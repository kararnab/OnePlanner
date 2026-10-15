package livekit

import (
	"context"
	"fmt"
	"time"

	"github.com/kararnab/webrtc/internal/core"
	"github.com/kararnab/webrtc/internal/infra"
	"github.com/livekit/protocol/auth"
)

// Provider implements core.RTCProvider for LiveKit
type Provider struct {
	cfg    *infra.Config
	logger infra.Logger
}

func NewProvider(cfg *infra.Config, logger infra.Logger) core.RTCProvider {
	return &Provider{
		cfg:    cfg,
		logger: logger,
	}
}

// CreateRoom returns a providerRoom stub. LiveKit will auto-create rooms on first join,
// so explicit CreateRoom is optional. If you want deterministic room creation, integrate
// server-sdk-go RoomService API here.
func (p *Provider) CreateRoom(ctx context.Context, roomID string, opts core.RoomOptions) (core.ProviderRoom, error) {
	// LiveKit auto-creates rooms on first join by default.
	p.logger.Infof("livekit: returning stub provider room for %s", roomID)
	return &livekitRoom{id: roomID}, nil
}

func (p *Provider) CloseRoom(ctx context.Context, roomID string) error {
	// Optionally call RoomService.DeleteRoom if you integrate server-sdk-go for explicit cleanup.
	p.logger.Infof("livekit: CloseRoom called for %s (no-op)", roomID)
	return nil
}

// GenerateToken creates a LiveKit access token for given room and identity.
func GenerateToken(cfg *infra.Config, roomID, identity string, ttl time.Duration) (string, error) {
	fmt.Println("LiveKit -> GenerateToken()")
	if cfg == nil {
		return "", fmt.Errorf("config is nil")
	}
	apiKey := cfg.RTC.Livekit.APIKey
	apiSecret := cfg.RTC.Livekit.APISecret
	if apiKey == "" || apiSecret == "" {
		return "", fmt.Errorf("livekit api key/secret not configured")
	}
	if ttl <= 0 {
		ttl = time.Hour
	}
	at := auth.NewAccessToken(apiKey, apiSecret)
	grant := &auth.VideoGrant{
		RoomJoin: true,
		Room:     roomID,
	}
	at.AddGrant(grant).
		SetIdentity(identity).
		SetValidFor(ttl)
	jwt, err := at.ToJWT()
	if err != nil {
		return "", fmt.Errorf("failed to create token: %w", err)
	}
	return jwt, nil
}

type livekitRoom struct {
	id string
}

func (r *livekitRoom) ID() string {
	return r.id
}

func (r *livekitRoom) Close(ctx context.Context) error {
	// no-op for now (LiveKit auto-manages rooms)
	return nil
}
