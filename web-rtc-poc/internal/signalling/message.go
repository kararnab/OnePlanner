package signalling

import "encoding/json"

type MessageType string

const (
	MsgTypeJoin         MessageType = "join"
	MsgTypeLeave        MessageType = "leave"
	MsgTypeOffer        MessageType = "offer"
	MsgTypeAnswer       MessageType = "answer"
	MsgTypeCandidate    MessageType = "candidate"
	MsgTypePeers        MessageType = "peers"
	MsgTypeID           MessageType = "id"
	MsgTypeError        MessageType = "error"
	MsgTypeHeartbeat    MessageType = "heartbeat"
	MsgTypeReconnect    MessageType = "reconnect"
	MsgTypeLivekitToken MessageType = "livekit_token"
)

type Message struct {
	Type    MessageType     `json:"type"`
	From    string          `json:"from,omitempty"`
	To      string          `json:"to,omitempty"`
	RoomID  string          `json:"room,omitempty"`
	Payload json.RawMessage `json:"payload,omitempty"`
}
