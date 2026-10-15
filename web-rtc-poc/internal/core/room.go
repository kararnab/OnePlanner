package core

import (
	"context"
	"sync"
	"time"

	"github.com/kararnab/webrtc/internal/infra"
)

type Room struct {
	id           string
	providerRoom ProviderRoom
	logger       infra.Logger

	mu       sync.RWMutex
	lastSeen time.Time
	closed   bool
}

func NewRoom(id string, providerRoom ProviderRoom, logger infra.Logger) *Room {
	return &Room{
		id:           id,
		providerRoom: providerRoom,
		logger:       logger,
		lastSeen:     time.Now(),
	}
}

func (r *Room) ID() string {
	return r.id
}

func (r *Room) Touch() {
	r.mu.Lock()
	r.lastSeen = time.Now()
	r.mu.Unlock()
}

func (r *Room) LastSeen() time.Time {
	r.mu.RLock()
	ts := r.lastSeen
	r.mu.RUnlock()
	return ts
}

func (r *Room) Close(ctx context.Context) error {
	r.mu.Lock()
	if r.closed {
		r.mu.Unlock()
		return nil
	}
	r.closed = true
	r.mu.Unlock()

	if r.providerRoom != nil {
		if err := r.providerRoom.Close(ctx); err != nil {
			r.logger.Errorf("provider close error for room %s: %v", r.id, err)
			return err
		}
	}
	r.logger.Infof("room closed: %s", r.id)
	return nil
}
