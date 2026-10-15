package app

import (
	"context"
	"fmt"
	"time"

	lka "github.com/kararnab/webrtc/internal/adapters/livekit"
	"github.com/kararnab/webrtc/internal/core"
	"github.com/kararnab/webrtc/internal/infra"
)

type App struct {
	cfg        *infra.Config
	logger     infra.Logger
	store      infra.Store
	rtcManager core.RTCManager

	cancel context.CancelFunc
}

func New(parentCtx context.Context, cfg *infra.Config, logger infra.Logger, store infra.Store) (*App, error) {
	// Create child context
	ctx, cancel := context.WithCancel(parentCtx)

	// If anything fails, ensure cancel() is called (avoid context leak)
	defer func() {
		if r := recover(); r != nil {
			cancel()
			panic(r)
		}
	}()

	var provider core.RTCProvider
	switch cfg.RTC.Provider {
	case "livekit":
		provider = lka.NewProvider(cfg, logger)
	default:
		cancel() // cleanup!
		return nil, fmt.Errorf("unsupported provider: %s", cfg.RTC.Provider)
	}

	rtcManager := core.NewRTCManager(provider, logger, store)
	if rtcManager == nil {
		cancel() // cleanup!
		return nil, fmt.Errorf("failed to create RTC manager")
	}

	app := &App{
		cfg:        cfg,
		logger:     logger,
		store:      store,
		rtcManager: rtcManager,
		cancel:     cancel,
	}

	// Start cleanup loop AFTER fully constructing app
	go app.startCleanupLoop(ctx)

	return app, nil
}

func (a *App) RTCManager() core.RTCManager {
	return a.rtcManager
}

func (a *App) Shutdown(ctx context.Context) error {
	// Cancel app context
	a.cancel()

	// Stop RTC rooms etc.
	return a.rtcManager.Close(ctx)
}

func (a *App) startCleanupLoop(ctx context.Context) {
	ticker := time.NewTicker(time.Duration(a.cfg.Cleanup.CleanupIntervalSeconds) * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			a.logger.Infof("cleanup loop stopping")
			return
		case <-ticker.C:
			if err := a.rtcManager.CleanupIdleRooms(ctx,
				time.Duration(a.cfg.Cleanup.RoomIdleSeconds)*time.Second,
			); err != nil {
				a.logger.Errorf("cleanup error: %v", err)
			}
		}
	}
}
