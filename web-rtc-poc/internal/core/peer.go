package core

import (
	"sync"
	"time"
)

/**
Simple peer registry helpers (optional for future SFU/P2P behavior)
*/

type peerRegistry struct {
	mu    sync.RWMutex
	peers map[string]time.Time
}

func newPeerRegistry() *peerRegistry {
	return &peerRegistry{
		peers: make(map[string]time.Time),
	}
}

func (r *peerRegistry) add(peerID string) {
	r.mu.Lock()
	r.peers[peerID] = time.Now()
	r.mu.Unlock()
}

func (r *peerRegistry) remove(peerID string) {
	r.mu.Lock()
	delete(r.peers, peerID)
	r.mu.Unlock()
}
