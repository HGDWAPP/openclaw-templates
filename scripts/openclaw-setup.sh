#!/bin/bash
# ============================================================
# OpenClaw First-Time Setup
# Run this ONCE on a fresh 1-Click droplet, BEFORE onboarding.
#
# What it does:
#   1. Pre-fixes the service file (User=openclaw, no Docker dep)
#      so the crash loop NEVER happens
#   2. Fixes bind setting (lan → loopback)
#   3. Adds swap memory if missing
#   4. Updates OpenClaw to latest
#   5. Launches the onboard wizard (interactive)
#   6. After onboard completes, auto-syncs the gateway token
#   7. Configures browser access for the dashboard
#   8. Fixes file ownership
#   9. Restarts and verifies everything
#
# Usage:
#   curl -sL https://raw.githubusercontent.com/HGDWAPP/openclaw-templates/main/scripts/openclaw-setup.sh | sudo bash
#
# Or copy it to the droplet and run:
#   sudo bash openclaw-setup.sh
# ============================================================

set -euo pipefail

echo "==========================================="
echo " OpenClaw First-Time Setup"
echo "==========================================="
echo ""

# Must run as root
if [ "$(id -u)" -ne 0 ]; then
  echo "ERROR: Run this script as root (use sudo)"
  exit 1
fi

# -----------------------------------------------------------
# Step 1: Pre-fix the service file
# This prevents the crash loop from EVER happening.
# The 1-Click image ships with User=root, but the config
# lives under /home/openclaw. Fixing this BEFORE onboarding
# means the gateway never crashes.
# -----------------------------------------------------------
echo "[1/6] Pre-fixing service file..."
cat > /etc/systemd/system/openclaw.service << 'SVC'
[Unit]
Description=Openclaw Gateway Service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=openclaw
Group=openclaw
WorkingDirectory=/home/openclaw
EnvironmentFile=/opt/openclaw.env
Environment=HOME=/home/openclaw
Environment=NODE_ENV=production
Environment=PATH=/home/openclaw/.openclaw/workspace/npm/bin:/home/openclaw/.openclaw/workspace/homebrew/bin:/usr/local/bin:/usr/bin:/bin
ExecStart=/usr/bin/openclaw gateway --port 18789
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
SVC
systemctl daemon-reload

# Fix bind setting preemptively
if [ -f /opt/openclaw.env ]; then
  sed -i 's/OPENCLAW_GATEWAY_BIND=lan/OPENCLAW_GATEWAY_BIND=loopback/' /opt/openclaw.env
fi

echo "  Service file: User=openclaw (crash loop prevented)"
echo "  Bind setting: loopback"
echo ""

# -----------------------------------------------------------
# Step 2: Add swap memory (if not already present)
# -----------------------------------------------------------
echo "[2/6] Checking swap memory..."
if ! swapon --show | grep -q '/swapfile'; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  if ! grep -q '/swapfile' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
  fi
  echo "  Added 2G swap"
else
  echo "  Swap already configured"
fi
echo ""

# -----------------------------------------------------------
# Step 3: Update OpenClaw
# -----------------------------------------------------------
echo "[3/6] Updating OpenClaw..."
npm i -g openclaw@latest 2>&1 | tail -3
echo ""
echo "  Version: $(sudo -iu openclaw openclaw --version 2>/dev/null || echo 'unknown')"
echo ""

# Stop the gateway before onboarding (clean slate)
systemctl stop openclaw 2>/dev/null || true
sleep 2
pkill -9 -f openclaw-gateway 2>/dev/null || true
sleep 1

# -----------------------------------------------------------
# Step 4: Run the onboard wizard
# -----------------------------------------------------------
echo "==========================================="
echo " Starting the onboard wizard..."
echo " Follow the prompts to configure your agent."
echo " When it finishes, the script will continue"
echo " automatically to sync your token."
echo "==========================================="
echo ""

# Reconnect stdin to the terminal so the onboard wizard can
# read interactive input even when this script is piped via curl.
exec </dev/tty

# Run onboard interactively
sudo -iu openclaw openclaw onboard

echo ""
echo "==========================================="
echo " Onboard complete! Applying final fixes..."
echo "==========================================="
echo ""

# -----------------------------------------------------------
# Step 5: Sync token + configure gateway
# -----------------------------------------------------------
echo "[5/6] Syncing gateway token and configuring..."

CONF="/home/openclaw/.openclaw/openclaw.json"
ENV="/opt/openclaw.env"

# Extract the authoritative token from the config
TOKEN=$(sudo -iu openclaw python3 -c \
  "import json; print(json.load(open('$CONF'))['gateway']['auth']['token'])")

if [ -z "$TOKEN" ]; then
  echo "  WARNING: Could not read token from config."
  echo "  You may need to run the fix script manually later."
else
  # Sync token to env file
  grep -v "^OPENCLAW_GATEWAY_TOKEN=" "$ENV" > "${ENV}.tmp" || true
  echo "OPENCLAW_GATEWAY_TOKEN=$TOKEN" >> "${ENV}.tmp"
  cp "${ENV}.tmp" "$ENV"
  rm "${ENV}.tmp"
  echo "  Token synced: $TOKEN"
fi

# Set gateway mode
sudo -iu openclaw openclaw config set gateway.mode local 2>&1 | tail -1

# Configure browser access for dashboard
sudo -iu openclaw openclaw config set \
  gateway.controlUi.allowedOrigins '["*"]' 2>&1 | tail -1
sudo -iu openclaw openclaw config set \
  gateway.trustedProxies '["127.0.0.1", "::1"]' 2>&1 | tail -1

# Fix file ownership (onboard may have created root-owned files)
chown -R openclaw:openclaw /home/openclaw/.openclaw/
chown -R openclaw:openclaw /tmp/openclaw* 2>/dev/null || true

echo ""

# -----------------------------------------------------------
# Step 6: Start and verify
# -----------------------------------------------------------
echo "[6/6] Starting gateway..."
systemctl start openclaw
echo "  Waiting 30s for gateway to initialize..."
sleep 30

PASS=true

# Check port
if ss -tlnp | grep -q ":18789"; then
  echo "  Port 18789: LISTENING"
else
  echo "  Port 18789: NOT LISTENING"
  PASS=false
fi

# Check service
if systemctl is-active --quiet openclaw; then
  echo "  Service: ACTIVE"
else
  echo "  Service: FAILED"
  PASS=false
fi

# Health check
echo ""
echo "  Running health check..."
sudo -iu openclaw openclaw health 2>&1 | head -5
echo ""

if [ "$PASS" = true ]; then
  echo "==========================================="
  echo " SETUP COMPLETE"
  echo "==========================================="
  echo ""
  echo " Gateway token: ${TOKEN:-unknown}"
  echo " Gateway port:  18789"
  echo " Gateway bind:  loopback (localhost only)"
  echo " Service user:  openclaw"
  echo " Dashboard:     https://$(hostname -I | awk '{print $1}')"
  echo ""
  echo " To get your dashboard token anytime:"
  echo "   sudo -iu openclaw openclaw dashboard"
  echo ""
  echo " To check status:"
  echo "   sudo -iu openclaw openclaw health"
  echo "   systemctl status openclaw"
  echo ""
  echo " Next steps:"
  echo "   1. Open https://$(hostname -I | awk '{print $1}') in your browser"
  echo "   2. Accept the certificate warning"
  echo "   3. Paste your gateway token when prompted"
  echo "==========================================="
else
  echo "==========================================="
  echo " SETUP INCOMPLETE"
  echo "==========================================="
  echo ""
  echo " The gateway didn't start correctly."
  echo " Check logs: journalctl -u openclaw --since '1 minute ago'"
  echo ""
  echo " You can also run the fix script separately:"
  echo "   curl -sL https://raw.githubusercontent.com/HGDWAPP/openclaw-templates/main/scripts/openclaw-fix.sh | sudo bash"
  echo "==========================================="
  exit 1
fi
