package infra

import (
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Server struct {
		Host                   string `yaml:"host"`
		Port                   int    `yaml:"port"`
		ShutdownTimeoutSeconds int    `yaml:"shutdown_timeout_seconds"`
	} `yaml:"server"`
	Signalling struct {
		WSPath              string `yaml:"ws_path"`
		Port                int    `yaml:"port"`
		ReadTimeoutSeconds  int    `yaml:"read_timeout_seconds"`
		WriteTimeoutSeconds int    `yaml:"write_timeout_seconds"`
		PongWaitSeconds     int    `yaml:"pong_wait_seconds"`
	} `yaml:"signalling"`
	RTC struct {
		Provider string `yaml:"provider"`
		Livekit  struct {
			URL       string `yaml:"url"`
			APIKey    string `yaml:"api_key"`
			APISecret string `yaml:"api_secret"`
		} `yaml:"livekit"`
		Ice struct {
			UseInternalCoturn bool `yaml:"use_internal_coturn"`
			Coturn            struct {
				Host     string `yaml:"host"`
				Port     int    `yaml:"port"`
				Username string `yaml:"username"`
				Password string `yaml:"password"`

				UseHMAC          bool   `yaml:"use_hmac"`
				StaticAuthSecret string `yaml:"static_auth_secret"`
			} `yaml:"coturn"`

			FallbackServers []struct {
				URLs    []string `yaml:"urls"`
				Enabled bool     `yaml:"enabled"`
			} `yaml:"fallback_servers"`
		} `yaml:"ice"`
	} `yaml:"rtc"`
	Cleanup struct {
		RoomIdleSeconds        int `yaml:"room_idle_seconds"`
		CleanupIntervalSeconds int `yaml:"cleanup_interval_seconds"`
	} `yaml:"cleanup"`
	Features struct {
		EnableTurn bool `yaml:"enable_turn"`
		EnableE2EE bool `yaml:"enable_e2ee"`
	} `yaml:"features"`
}

func LoadConfig(path string) (*Config, error) {
	b, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var cfg Config
	if err := yaml.Unmarshal(b, &cfg); err != nil {
		return nil, err
	}
	if cfg.Server.ShutdownTimeoutSeconds == 0 {
		cfg.Server.ShutdownTimeoutSeconds = 10
	}
	if cfg.Cleanup.CleanupIntervalSeconds == 0 {
		cfg.Cleanup.CleanupIntervalSeconds = 60
	}
	if cfg.Cleanup.RoomIdleSeconds == 0 {
		cfg.Cleanup.RoomIdleSeconds = 600
	}
	if cfg.Signalling.PongWaitSeconds == 0 {
		cfg.Signalling.PongWaitSeconds = 60
	}
	return &cfg, nil
}
