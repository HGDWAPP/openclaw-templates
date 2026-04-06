#!/bin/bash
# ============================================================
# OpenClaw Universal Gateway Fix
# Fixes ALL known gateway issues on 1-Click droplets:
#   1. Token mismatch (env file vs config)
#   2. Gateway crash loop (User=root → child process HOME mismatch)
#   3. File ownership (root-owned files under openclaw home)
#   4. Browser access (dashboard allowedOrigins + trustedProxies)
#   5. Bind setting (lan → loopback)
#
# Usage: Run as root on any OpenClaw 1-Click droplet
# ============================================================

set -euo pipefail

echo "==========================================="
echo " OpenClaw Universal Gateway Fix"
echo "==========================================="
echo ""

# -----------------------------------------------------------
# Step 1: Stop the gateway
# -----------------------------------------------------------
echo "[1/7] Stopping gateway..."
systemctl stop openclaw 2>/dev/null || true
sleep 2
pkill -9 -f openclaw-gateway 2>/dev/null || true
sleep 1
echo "  Done."
echo ""

# -----------------------------------------------------------
# Step 2: Sync the gateway token
# -----------------------------------------------------------
echo "[2/7] Syncing gateway token..."
OCDIR="/home/openclaw/.openclaw"
CONF="$OCDIR/openclaw.json"
ENV="/opt/openclaw.env"

# Extract the authoritative token from the config
TOKEN=$(sudo -iu openclaw python3 -c \
  "import json; print(json.load(open('$CONF'))['gateway']['auth']['token'])" 2>/dev/null) || true

if [ -z "$TOKEN" ]; then
  echo "  ERROR: Could not read token from $CONF"
  exit 1
fi

# Replace the token in the env file (grep-v + tee, no regex)
grep -v "^OPENCLAW_GATEWAY_TOKEN=" "$ENV" > "${ENV}.tmp" || true
echo "OPENCLAW_GATEWAY_TOKEN=$TOKEN" >> "${ENV}.tmp"
cp "${ENV}.tmp" "$ENV"
rm "${ENV}.tmp"

# Fix bind setting if still set to lan
sed -i 's/OPENCLAW_GATEWAY_BIND=lan/OPENCLAW_GATEWAY_BIND=loopback/' "$ENV"

# Verify
ENV_TOKEN=$(grep OPENCLAW_GATEWAY_TOKEN "$ENV" | cut -d= -f2-)
if [ "$TOKEN" = "$ENV_TOKEN" ]; then
  echo "  Tokens match: $TOKEN"
else
  echo "  ERROR: Token sync failed!"
  echo "  Config: $TOKEN"
  echo "  Env:    $ENV_TOKEN"
  exit 1
fi
echo ""

# -----------------------------------------------------------
# Step 3: Set gateway.mode=local
# -----------------------------------------------------------
echo "[3/7] Setting gateway.mode=local..."
sudo -iu openclaw openclaw config set gateway.mode local 2>&1 | tail -1
echo ""

# -----------------------------------------------------------
# Step 4: Configure browser access
# -----------------------------------------------------------
echo "[4/7] Configuring browser access..."
sudo -iu openclaw openclaw config set \
  gateway.controlUi.allowedOrigins '["*"]' 2>&1 | tail -1
sudo -iu openclaw openclaw config set \
  gateway.trustedProxies '["127.0.0.1", "::1"]' 2>&1 | tail -1
echo ""

# -----------------------------------------------------------
# Step 5: Fix file ownership
# -----------------------------------------------------------
echo "[5/7] Fixing file ownership..."
chown -R openclaw:openclaw /home/openclaw/.openclaw/
chown -R openclaw:openclaw /tmp/openclaw* 2>/dev/null || true
echo "  Done."
echo ""

# -----------------------------------------------------------
# Step 6: Install keep-alive wrapper + write service file
# The keep-alive wrapper monitors the gateway and auto-restarts
# it if it dies -- so the bot stays online 24/7.
# -----------------------------------------------------------
echo "[6/7] Installing keep-alive wrapper + writing service file..."

# Install the keep-alive wrapper script
cat > /opt/openclaw-start.sh << 'WRAPPER'
#!/bin/bash
cleanup() { kill $GATEWAY_PID 2>/dev/null; exit 0; }
trap cleanup SIGTERM SIGINT
while true; do
    pkill -9 -f 'openclaw-gateway' 2>/dev/null
    sleep 2
    /usr/bin/openclaw gateway --port 18789 --allow-unconfigured &
    GATEWAY_PID=$!
    for i in $(seq 1 60); do
        if ss -tlnp | grep -q ':18789'; then break; fi
        sleep 1
    done
    if ! ss -tlnp | grep -q ':18789'; then continue; fi
    while kill -0 $GATEWAY_PID 2>/dev/null && ss -tlnp | grep -q ':18789'; do
        sleep 10
    done
    sleep 5
done
WRAPPER
chmod +x /opt/openclaw-start.sh

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
ExecStart=/opt/openclaw-start.sh
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
SVC
systemctl daemon-reload
echo "  Keep-alive wrapper: installed"
echo "  Service file: User=openclaw, auto-restart"
echo ""

# -----------------------------------------------------------
# Step 7: Start and verify
# -----------------------------------------------------------
echo "[7/7] Starting gateway..."
systemctl start openclaw
echo "  Waiting for gateway to initialize (30s)..."
sleep 30

# Check port
if ss -tlnp | grep -q ":18789"; then
  echo "  Port 18789: LISTENING"
else
  echo "  Port 18789: NOT LISTENING"
  echo "  Check logs: journalctl -u openclaw --since '1 minute ago'"
  exit 1
fi

# Check service
if systemctl is-active --quiet openclaw; then
  echo "  Service: ACTIVE"
else
  echo "  Service: FAILED"
  exit 1
fi

# Run health check
echo ""
echo "  Running health check..."
sudo -iu openclaw openclaw health 2>&1 | head -5
echo ""

# Final summary
echo "==========================================="
echo " FIX COMPLETE"
echo "==========================================="
echo ""
echo " Gateway token: $TOKEN"
echo " Gateway port:  18789"
echo " Gateway bind:  loopback (127.0.0.1)"
echo " Service user:  openclaw"
echo " Dashboard:     https://$(hostname -I | awk '{print $1}')"
echo ""
echo " To get your dashboard connection token:"
echo "   sudo -iu openclaw openclaw dashboard"
echo ""
echo " To check status anytime:"
echo "   sudo -iu openclaw openclaw health"
echo "   systemctl status openclaw"
echo "==========================================="
