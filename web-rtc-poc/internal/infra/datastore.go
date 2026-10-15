package infra

import (
	"sync"
	"time"
)

// in-memory store for small state; replaceable with Redis in the future.

type Store interface {
	Set(key string, value any)
	Get(key string) (any, bool)
	Delete(key string)
	SetRoomCreated(roomID string, t time.Time)
	GetRoomCreated(roomID string) (time.Time, bool)
}

type inMemoryStore struct {
	mu       sync.RWMutex
	m        map[string]any
	roomMeta map[string]time.Time
}

func NewInMemoryStore() Store {
	return &inMemoryStore{
		m:        make(map[string]any),
		roomMeta: make(map[string]time.Time),
	}
}

func (s *inMemoryStore) Set(key string, value any) {
	s.mu.Lock()
	s.m[key] = value
	s.mu.Unlock()
}
func (s *inMemoryStore) Get(key string) (any, bool) {
	s.mu.RLock()
	v, ok := s.m[key]
	s.mu.RUnlock()
	return v, ok
}
func (s *inMemoryStore) Delete(key string) {
	s.mu.Lock()
	delete(s.m, key)
	s.mu.Unlock()
}
func (s *inMemoryStore) SetRoomCreated(roomID string, t time.Time) {
	s.mu.Lock()
	s.roomMeta[roomID] = t
	s.mu.Unlock()
}
func (s *inMemoryStore) GetRoomCreated(roomID string) (time.Time, bool) {
	s.mu.RLock()
	v, ok := s.roomMeta[roomID]
	s.mu.RUnlock()
	return v, ok
}
