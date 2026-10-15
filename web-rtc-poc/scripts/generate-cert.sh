#!/bin/bash

set -e

CERT_DIR="../infra-deploy/nginx/certs"

echo "=== Self-Signed Certificate Generator for nginx ==="

echo ""
echo "Enter the IP address or hostname for the certificate."
echo "👉 Do NOT include http:// or https://"
echo "👉 Valid examples:"
echo "   - localhost"
echo "   - example.com"
echo "   - api.example.com"
echo "   - 192.168.1.10"
echo ""

read -p "Enter IP address or hostname for the certificate (e.g. 192.168.1.10 or localhost): " DOMAIN

if [[ -z "$DOMAIN" ]]; then
  echo "Error: You must provide an IP address or hostname."
  exit 1
fi

mkdir -p "$CERT_DIR"

echo "Generating self signed certificate for: $DOMAIN"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$CERT_DIR/server.key" \
  -out "$CERT_DIR/server.crt" \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=$DOMAIN"

echo "Certificate and key generated successfully:"
echo "  $CERT_DIR/server.key"
echo "  $CERT_DIR/server.crt"
echo ""
echo "✔ Valid for modern browsers"
echo ""
echo "Done!"
