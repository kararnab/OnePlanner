package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/kararnab/webrtc/internal/app"
	"github.com/kararnab/webrtc/internal/infra"
	"github.com/kararnab/webrtc/internal/signalling"
)

/**
Questions:
context.Background() vs context.WithCancel
What is context
*/

func main() {
	// Proper base context with cancel
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Load config
	path := os.Getenv("CONFIG_PATH")
	if path == "" {
		path = "/etc/chatcore/config.yaml"
	}

	cfg, err := infra.LoadConfig(path)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to load config: %v\n", err)
		os.Exit(1)
	}

	logger := infra.NewLogger(cfg)
	store := infra.NewInMemoryStore()

	// Create app (RTC manager + provider)
	appInstance, err := app.New(ctx, cfg, logger, store)
	if err != nil {
		logger.Fatalf("app init error: %v", err)
	}

	// Signalling handler
	wsHandler := signalling.NewWebSocketHandler(logger, appInstance.RTCManager(), cfg, store)

	// Router
	mux := http.NewServeMux()

	// 1️⃣ Serve static files (Docker stores them in /static)
	mux.Handle("/", http.FileServer(http.Dir("/static")))

	// 2️⃣ WebSocket endpoint
	mux.Handle(cfg.Signalling.WSPath, wsHandler)

	addr := fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port)
	srv := &http.Server{
		Addr:    addr,
		Handler: mux,
	}

	// Run server
	go func() {
		logger.Infof("starting server on %s", addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatalf("server error: %v", err)
		}
	}()

	// Wait for CTRL+C
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt)
	<-sig
	logger.Infof("shutdown signal received")

	// Graceful shutdown
	timeout := time.Duration(cfg.Server.ShutdownTimeoutSeconds) * time.Second
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), timeout)
	defer shutdownCancel()

	// Stop RTC manager, rooms, cleanup loops
	if err := appInstance.Shutdown(shutdownCtx); err != nil {
		logger.Errorf("app shutdown error: %v", err)
	}

	// Stop HTTP server
	if err := srv.Shutdown(shutdownCtx); err != nil {
		logger.Errorf("http shutdown error: %v", err)
	}

	logger.Infof("shutdown complete")
}
