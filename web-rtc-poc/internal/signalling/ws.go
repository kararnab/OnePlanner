package signalling

import (
	"context"
	"crypto/hmac"
	"crypto/sha1"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"

	lk "github.com/kararnab/webrtc/internal/adapters/livekit"
	"github.com/kararnab/webrtc/internal/core"
	"github.com/kararnab/webrtc/internal/infra"
)

/* ---------------------------------------------------------------------------
   TURN HMAC helper
--------------------------------------------------------------------------- */

func generateTurnHMAC(secret string, ttlSeconds int64) (string, string) {
	expiry := time.Now().Unix() + ttlSeconds
	username := fmt.Sprintf("%d", expiry)

	mac := hmac.New(sha1.New, []byte(secret))
	mac.Write([]byte(username))
	pwd := mac.Sum(nil)

	credential := base64.StdEncoding.EncodeToString(pwd)
	return username, credential
}

/* ---------------------------------------------------------------------------
   WebSocket handler
--------------------------------------------------------------------------- */

type WebSocketHandler struct {
	logger     infra.Logger
	rtcManager core.RTCManager
	cfg        *infra.Config
	store      infra.Store

	upgrader websocket.Upgrader

	mu       sync.RWMutex
	sessions map[string]map[string]*Session
}

func NewWebSocketHandler(logger infra.Logger, rtc core.RTCManager, cfg *infra.Config, store infra.Store) *WebSocketHandler {
	up := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			// TODO: validate Origin or use auth token
			return true
		},
	}
	return &WebSocketHandler{
		logger:     logger,
		rtcManager: rtc,
		cfg:        cfg,
		store:      store,
		upgrader:   up,
		sessions:   make(map[string]map[string]*Session),
	}
}

func (h *WebSocketHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	conn, err := h.upgrader.Upgrade(w, r, nil)
	if err != nil {
		h.logger.Errorf("websocket upgrade failed: %v", err)
		http.Error(w, "upgrade failed", http.StatusBadRequest)
		return
	}

	sid := uuid.NewString()
	sess := NewSession(sid, conn, h.logger)

	roomID := r.URL.Query().Get("room")
	if roomID == "" {
		var m Message
		_ = conn.SetReadDeadline(time.Now().Add(10 * time.Second))
		if err := conn.ReadJSON(&m); err == nil && m.Type == MsgTypeJoin && m.RoomID != "" {
			roomID = m.RoomID
		}
		_ = conn.SetReadDeadline(time.Time{})
	}

	if roomID == "" {
		_ = sess.SendMessage(&Message{Type: MsgTypeError, Payload: []byte(`"missing room id"`)})
		sess.Close()
		return
	}

	ctx := r.Context()
	_, err = h.rtcManager.CreateOrGetRoom(ctx, roomID, core.RoomOptions{
		EnableTurn: h.cfg.Features.EnableTurn,
	})
	if err != nil {
		h.logger.Errorf("failed to create/get room: %v", err)
		_ = sess.SendMessage(&Message{Type: MsgTypeError, Payload: []byte(`"failed to join room"`)})
		sess.Close()
		return
	}

	// register session
	h.registerSession(roomID, sid, sess)
	defer h.unregisterSession(roomID, sid)

	/* -----------------------------------------------------------------------
	   LiveKit flow: return token + ICE servers to browser
	------------------------------------------------------------------------ */
	if h.cfg.RTC.Provider == "livekit" {
		// identity: optional client-provided via query ?identity= or fallback to sid
		identity := r.URL.Query().Get("identity")
		if identity == "" {
			identity = sid
		}

		token, err := lk.GenerateToken(h.cfg, roomID, identity, time.Hour)
		if err != nil {
			h.logger.Errorf("failed to generate token: %v", err)
			_ = sess.SendMessage(&Message{Type: MsgTypeError, Payload: []byte(`"token error"`)})

			sess.Close()
			return
		}

		// IMPORTANT: provide ICE servers so browser uses TURN
		ice := h.buildICEServers()

		resp := map[string]interface{}{
			"url":        h.cfg.RTC.Livekit.URL,
			"token":      token,
			"identity":   identity,
			"room":       roomID,
			"iceServers": ice, // <-- required for WebRTC to use TURN!!
		}

		payload, _ := json.Marshal(resp)
		_ = sess.SendMessage(&Message{Type: MsgTypeLivekitToken, Payload: payload})

		return
	}

	/* -----------------------------------------------------------------------
	   Non-LiveKit flows
	------------------------------------------------------------------------ */
	meta := map[string]interface{}{
		"type": "id",
		"id":   sid,
		"ice":  h.buildICEServers(),
	}

	_ = sess.SendMessage(&Message{Type: MsgTypeID, Payload: marshal(meta)})

	h.logger.Infof("peer %s joined room %s", sid, roomID)
	h.readLoop(ctx, roomID, sid, sess)
}

/* ---------------------------------------------------------------------------
   TURN / ICE SERVER builder (static or HMAC)
--------------------------------------------------------------------------- */

func (h *WebSocketHandler) buildICEServers() []interface{} {
	var out []interface{}

	if h.cfg.RTC.Ice.UseInternalCoturn {
		c := h.cfg.RTC.Ice.Coturn

		// HMAC mode (coturn: use-auth-secret)
		if c.UseHMAC {
			u, p := generateTurnHMAC(c.StaticAuthSecret, 3600)

			out = append(out, map[string]interface{}{
				"urls": []string{
					fmt.Sprintf("stun:%s:%d", c.Host, c.Port),
					fmt.Sprintf("turn:%s:%d?transport=udp", c.Host, c.Port),
				},
				"username":   u,
				"credential": p,
			})

		} else {
			// static username/password
			out = append(out, map[string]interface{}{
				"urls": []string{
					fmt.Sprintf("stun:%s:%d", c.Host, c.Port),
					fmt.Sprintf("turn:%s:%d?transport=udp", c.Host, c.Port),
				},
				"username":   c.Username,
				"credential": c.Password,
			})
		}
	}

	// fallback STUN servers
	for _, f := range h.cfg.RTC.Ice.FallbackServers {
		if f.Enabled {
			out = append(out, map[string]interface{}{"urls": f.URLs})
		}
	}

	return out
}

/* ---------------------------------------------------------------------------
   Session management + reading loop
--------------------------------------------------------------------------- */

func (h *WebSocketHandler) registerSession(roomID, sid string, sess *Session) {
	h.mu.Lock()
	defer h.mu.Unlock()
	if _, ok := h.sessions[roomID]; !ok {
		h.sessions[roomID] = make(map[string]*Session)
	}
	h.sessions[roomID][sid] = sess
}

func (h *WebSocketHandler) unregisterSession(roomID, sid string) {
	h.mu.Lock()
	roomMap, ok := h.sessions[roomID]
	if ok {
		delete(roomMap, sid)
		if len(roomMap) == 0 {
			delete(h.sessions, roomID)
		}
	}
	h.mu.Unlock()
	h.logger.Infof("peer %s left room %s", sid, roomID)

	h.broadcastToRoom(roomID, &Message{
		Type:   MsgTypeLeave,
		From:   sid,
		RoomID: roomID,
	})
}

func (h *WebSocketHandler) readLoop(ctx context.Context, roomID, sid string, sess *Session) {
	conn := sess.conn
	conn.SetReadDeadline(time.Now().Add(time.Duration(h.cfg.Signalling.PongWaitSeconds) * time.Second))
	conn.SetPongHandler(func(string) error {
		conn.SetReadDeadline(time.Now().Add(time.Duration(h.cfg.Signalling.PongWaitSeconds) * time.Second))
		return nil
	})

	for {
		var msg Message
		if err := sess.ReadJSON(&msg); err != nil {
			h.logger.Infof("peer %s disconnected: %v", sid, err)
			return
		}

		if rm, err := h.rtcManager.CreateOrGetRoom(ctx, roomID, core.RoomOptions{}); err == nil {
			rm.Touch()
		}

		switch msg.Type {
		case MsgTypeOffer, MsgTypeAnswer, MsgTypeCandidate:
			if msg.To != "" {
				h.sendToPeer(roomID, msg.To, &msg)
			} else {
				h.broadcastToRoomExcept(roomID, &msg, sid)
			}
		case MsgTypeHeartbeat:
			_ = sess.SendMessage(&Message{Type: MsgTypeHeartbeat})
		case MsgTypeLeave:
			return
		case MsgTypeJoin:
			h.sendPeersList(roomID, sid)
		case MsgTypeReconnect:
			_ = sess.SendMessage(&Message{Type: MsgTypeID, From: sid, RoomID: roomID})
		default:
			h.logger.Debugf("unknown msg type from %s: %v", sid, msg.Type)
		}
	}
}

func (h *WebSocketHandler) sendPeersList(roomID, sid string) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	roomMap, ok := h.sessions[roomID]
	if !ok {
		return
	}
	peers := make([]string, 0, len(roomMap))
	for id := range roomMap {
		if id == sid {
			continue
		}
		peers = append(peers, id)
	}
	payload, _ := json.Marshal(map[string]any{"peers": peers})
	h.sendToPeer(roomID, sid, &Message{Type: MsgTypePeers, Payload: payload})
}

func (h *WebSocketHandler) sendToPeer(roomID, to string, msg *Message) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	if sess, ok := h.sessions[roomID][to]; ok {
		_ = sess.SendMessage(msg)
	}
}

func (h *WebSocketHandler) broadcastToRoom(roomID string, msg *Message) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	for _, sess := range h.sessions[roomID] {
		_ = sess.SendMessage(msg)
	}
}

func (h *WebSocketHandler) broadcastToRoomExcept(roomID string, msg *Message, except string) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	for id, sess := range h.sessions[roomID] {
		if id == except {
			continue
		}
		_ = sess.SendMessage(msg)
	}
}

func marshal(v interface{}) json.RawMessage {
	b, _ := json.Marshal(v)
	return json.RawMessage(b)
}
