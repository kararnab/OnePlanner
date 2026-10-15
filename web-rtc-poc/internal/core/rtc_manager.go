package core

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/kararnab/webrtc/internal/infra"
)

type RTCProvider interface {
	CreateRoom(ctx context.Context, roomID string, opts RoomOptions) (ProviderRoom, error)
	CloseRoom(ctx context.Context, roomID string) error
}

type ProviderRoom interface {
	ID() string
	Close(ctx context.Context) error
}

type RoomOptions struct {
	EnableTurn bool
}

type RTCManager interface {
	CreateOrGetRoom(ctx context.Context, roomID string, opts RoomOptions) (*Room, error)
	Close(ctx context.Context) error
	CleanupIdleRooms(ctx context.Context, idleDuration time.Duration) error
}

type rtcManager struct {
	provider RTCProvider
	logger   infra.Logger
	store    infra.Store

	mu     sync.RWMutex
	rooms  map[string]*Room
	closed bool
}

func NewRTCManager(provider RTCProvider, logger infra.Logger, store infra.Store) RTCManager {
	return &rtcManager{
		provider: provider,
		logger:   logger,
		store:    store,
		rooms:    make(map[string]*Room),
	}
}

func (m *rtcManager) CreateOrGetRoom(ctx context.Context, roomID string, opts RoomOptions) (*Room, error) {
	m.mu.RLock()
	if m.closed {
		m.mu.RUnlock()
		return nil, errors.New("rtc manager closed")
	}
	if rm, ok := m.rooms[roomID]; ok {
		rm.Touch()
		m.mu.RUnlock()
		return rm, nil
	}
	m.mu.RUnlock()

	m.mu.Lock()
	defer m.mu.Unlock()
	if rm, ok := m.rooms[roomID]; ok {
		rm.Touch()
		return rm, nil
	}
	providerRoom, err := m.provider.CreateRoom(ctx, roomID, opts)
	if err != nil {
		return nil, err
	}
	room := NewRoom(roomID, providerRoom, m.logger)
	m.rooms[roomID] = room
	m.store.SetRoomCreated(roomID, time.Now())
	m.logger.Infof("room created: %s", roomID)
	return room, nil
}

func (m *rtcManager) Close(ctx context.Context) error {
	m.mu.Lock()
	if m.closed {
		m.mu.Unlock()
		return nil
	}
	m.closed = true
	rooms := m.rooms
	m.rooms = make(map[string]*Room)
	m.mu.Unlock()

	var firstErr error
	for _, rm := range rooms {
		if err := rm.Close(ctx); err != nil && firstErr == nil {
			firstErr = err
		}
		m.logger.Infof("closed room %s", rm.ID())
	}
	return firstErr
}

func (m *rtcManager) CleanupIdleRooms(ctx context.Context, idleDuration time.Duration) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	now := time.Now()
	for id, rm := range m.rooms {
		if now.Sub(rm.LastSeen()) > idleDuration {
			m.logger.Infof("cleaning idle room: %s", id)
			if err := rm.Close(ctx); err != nil {
				m.logger.Errorf("error closing room %s: %v", id, err)
				continue
			}
			delete(m.rooms, id)
		}
	}
	return nil
}
