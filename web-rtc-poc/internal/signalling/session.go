package signalling

import (
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/kararnab/webrtc/internal/infra"
)

type Session struct {
	id     string
	conn   *websocket.Conn
	logger infra.Logger

	sendMu sync.Mutex
	closed bool
}

func NewSession(id string, conn *websocket.Conn, logger infra.Logger) *Session {
	conn.SetReadLimit(65536)
	return &Session{
		id:     id,
		conn:   conn,
		logger: logger,
	}
}

func (s *Session) ID() string {
	return s.id
}

func (s *Session) ReadJSON(v interface{}) error {
	return s.conn.ReadJSON(v)
}

func (s *Session) WriteJSON(v interface{}) error {
	s.sendMu.Lock()
	defer s.sendMu.Unlock()
	s.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
	return s.conn.WriteJSON(v)
}

func (s *Session) SendMessage(msg *Message) error {
	return s.WriteJSON(msg)
}

func (s *Session) Close() {
	s.sendMu.Lock()
	defer s.sendMu.Unlock()
	if s.closed {
		return
	}
	s.closed = true
	_ = s.conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
	_ = s.conn.Close()
}
