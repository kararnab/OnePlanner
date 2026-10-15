FROM golang:1.27-alpine AS builder

WORKDIR /app

# Install build deps
RUN apk add --no-cache git

# Copy go.mod first (better caching)
COPY go.mod go.sum ./
RUN go mod download

# Copy full project
COPY . .

# Build static binary (good for Alpine runtime)
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./cmd/server/main.go

#############################
#       RUNTIME STAGE
#############################
FROM alpine:3.18

WORKDIR /root/

# Install certificates (for HTTPS calls if needed)
RUN apk add --no-cache ca-certificates

# Copy binary
COPY --from=builder /app/server /usr/local/bin/server

# Copy configs
COPY configs/config.yaml /etc/chatcore/config.yaml

COPY static /static

EXPOSE 8080

CMD ["/usr/local/bin/server"]
