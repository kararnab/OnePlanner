# WebRTC Calling POC

This project is a 1:1 calling prototype for ChatApp. It combines a Go signalling service, static browser assets, and local infrastructure files for HTTPS, TURN, and LiveKit-based experiments.

## What This Project Does

- serves a signalling backend for WebSocket-based coordination
- manages room and peer state in Go
- hosts a simple browser demo in `static/`
- includes local infrastructure config for Nginx, coturn, and LiveKit

## Stack

- Go
- Gorilla WebSocket
- LiveKit protocol dependencies
- static HTML, CSS, and JavaScript
- Docker and Docker Compose
- Nginx

## Project Layout

```text
cmd/server/        entrypoint
internal/          app, signalling, infra, core logic
configs/           runtime YAML config
static/            browser demo assets
infra-deploy/      nginx, TURN, and LiveKit config
scripts/           helper scripts such as cert generation
ProofOfConcept/    older experimental versions and backups
```

## Configuration

Primary runtime config lives in:

```text
configs/config.yaml
```

The checked-in config currently contains LAN IPs, API keys, secrets, and TURN settings intended for local experimentation. Review and replace those values before using the project outside a throwaway local setup.

Key areas in config:

- server host and port
- signalling path and timeouts
- LiveKit URL and credentials
- coturn host and auth secret
- room cleanup timing
- feature toggles for TURN and E2EE

## Running Locally

### Go Service

```bash
go run ./cmd/server
```

### Tests

```bash
go test ./...
```

### Docker Flow

If you are using the bundled Docker setup:

```bash
docker-compose up --build
```

## TLS And Hosts

For the local HTTPS flow, this project includes cert-generation and Nginx config support.

Typical steps:

1. Generate or replace the local certificate.
2. Point a local hostname to your machine IP in the hosts file.
3. Start the stack.
4. Open the demo over HTTPS.

## Notes

- This is a proof of concept, not a finished calling platform.
- The repo still contains older experimental files under `ProofOfConcept/`.
- Treat checked-in secrets and certificates as local-dev placeholders, not production assets.
- For production-like usage, move secrets out of the repository, use trusted TLS, and tighten signalling authentication and origin checks.
