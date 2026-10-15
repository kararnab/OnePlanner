package infra

import (
	"log"
	"os"
)

type Logger interface {
	Infof(fmtStr string, args ...any)
	Errorf(fmtStr string, args ...any)
	Debugf(fmtStr string, args ...any)
	Fatalf(fmtStr string, args ...any)
}

type stdLogger struct {
	prefix string
	logger *log.Logger
}

func NewLogger(cfg *Config) Logger {
	prefix := "[chatcore]"
	return &stdLogger{
		prefix: prefix,
		logger: log.New(os.Stdout, "", log.LstdFlags|log.Lmicroseconds),
	}
}

func (l *stdLogger) Infof(fmtStr string, args ...any) {
	l.logger.Printf("[INFO] "+fmtStr, args...)
}
func (l *stdLogger) Errorf(fmtStr string, args ...any) {
	l.logger.Printf("[ERROR] "+fmtStr, args...)
}
func (l *stdLogger) Debugf(fmtStr string, args ...any) {
	l.logger.Printf("[DEBUG] "+fmtStr, args...)
}
func (l *stdLogger) Fatalf(fmtStr string, args ...any) {
	l.logger.Fatalf("[FATAL] "+fmtStr, args...)
}
