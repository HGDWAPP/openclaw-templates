#!/bin/bash
# ============================================================
# OpenClaw First-Time Setup
# Run this ONCE on a fresh 1-Click droplet, BEFORE onboarding.
#
# What it does:
#   1. Pre-fixes the service file (User=openclaw, keep-alive
#      wrapper) so the crash loop NEVER happens
#   2. Fixes bind setting (lan -> loopback)
#   3. Adds swap memory if missing
#   4. Updates OpenClaw to latest
#   5. Launches the onboard wizard (interactive)
#   6. Configures Telegram DM pairing (interactive)
#   7. Auto-syncs the gateway token
#   8. Configures browser access for the dashboard
#   9. Fixes file ownership
#  10. Restarts and verifies everything
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
# Step 1: Pre-fix the service file + install keep-alive wrapper
# This prevents the crash loop from EVER happening.
# The 1-Click image ships with User=root, but the config
# lives under /home/openclaw. Fixing this BEFORE onboarding
# means the gateway never crashes.
# The keep-alive wrapper monitors the gateway and auto-restarts
# it if it dies -- so the bot stays online 24/7.
# -----------------------------------------------------------
echo "[1/7] Pre-fixing service file + installing keep-alive wrapper..."

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
    if ! ss -tlnp | grep -q ':18789'; then kill $GATEWAY_PID 2>/dev/null; wait $GATEWAY_PID 2>/dev/null; continue; fi
    while kill -0 $GATEWAY_PID 2>/dev/null && ss -tlnp | grep -q ':18789'; do
        sleep 10
    done
    sleep 5
done
WRAPPER
chmod +x /opt/openclaw-start.sh

# Write the service file with User=openclaw and keep-alive wrapper
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

# Fix bind setting preemptively
if [ -f /opt/openclaw.env ]; then
  sed -i 's/OPENCLAW_GATEWAY_BIND=lan/OPENCLAW_GATEWAY_BIND=loopback/' /opt/openclaw.env
fi

echo "  Service file: User=openclaw (crash loop prevented)"
echo "  Keep-alive wrapper: installed (auto-restarts gateway)"
echo "  Bind setting: loopback"
echo ""

# -----------------------------------------------------------
# Step 2: Add swap memory (if not already present)
# -----------------------------------------------------------
echo "[2/7] Checking swap memory..."
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
echo "[3/7] Updating OpenClaw..."
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
echo " [4/7] Starting the onboard wizard..."
echo " Follow the prompts to configure your agent."
echo " When it finishes, the script will continue"
echo " automatically."
echo "==========================================="
echo ""

# Redirect stdin to the terminal for the onboard wizard only,
# so the wizard can read interactive input even when this script
# is piped via curl, without stealing bash's script source.

# Run onboard interactively
if ! sudo -iu openclaw openclaw onboard </dev/tty; then
  echo ""
  echo "==========================================="
  echo " ERROR: Onboard wizard did not complete."
  echo "==========================================="
  echo ""
  echo " The onboard wizard exited with an error."
  echo " This can happen if you cancelled it or"
  echo " entered invalid settings."
  echo ""
  echo " You can re-run it manually with:"
  echo "   sudo -iu openclaw openclaw onboard"
  echo ""
  echo " Then run the fix script to finish setup:"
  echo "   curl -sL https://raw.githubusercontent.com/HGDWAPP/openclaw-templates/main/scripts/openclaw-fix.sh | sudo bash"
  echo ""
  echo " Restarting gateway so your droplet isn't"
  echo " left in a broken state..."
  systemctl start openclaw 2>/dev/null || true
  exit 1
fi

echo ""
echo "==========================================="
echo " Onboard complete! Setting up DM pairing..."
echo "==========================================="
echo ""

# -----------------------------------------------------------
# Step 5: Configure Telegram DM pairing
# This ensures only YOU can message the bot.
# -----------------------------------------------------------
echo "[5/7] Configuring Telegram DM pairing..."
echo ""
echo "  This sets your Telegram user ID so only YOU"
echo "  can message the bot. If you don't have your"
echo "  user ID, message @userinfobot on Telegram."
echo ""
echo "  (If you want to skip this, just press Enter"
echo "  through the prompts, or close the terminal and"
echo "  run it later with:"
echo "    sudo -iu openclaw openclaw configure --section telegram-dm)"
echo ""

trap '' INT
sudo -iu openclaw openclaw configure --section telegram-dm </dev/tty || true
trap - INT

echo ""
echo "==========================================="
echo " Applying final fixes..."
echo "==========================================="
echo ""

# -----------------------------------------------------------
# Step 6: Sync token + configure gateway
# -----------------------------------------------------------
echo "[6/7] Syncing gateway token and configuring..."

CONF="/home/openclaw/.openclaw/openclaw.json"
ENV="/opt/openclaw.env"

# Extract the authoritative token from the config
TOKEN=$(sudo -iu openclaw python3 -c \
  "import json; print(json.load(open('$CONF'))['gateway']['auth']['token'])" 2>/dev/null) || true

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
# Step 7: Start and verify
# -----------------------------------------------------------
echo "[7/7] Starting gateway..."
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
sudo -iu openclaw openclaw health 2>&1 | head -5 || true
echo ""

DROPLET_IP=$(hostname -I | awk '{print $1}')

if [ "$PASS" = true ]; then
  echo "==========================================="
  echo " SETUP COMPLETE"
  echo "==========================================="
  echo ""
  echo " Your gateway is running and healthy."
  echo ""
  echo " Gateway token: ${TOKEN:-unknown}"
  echo " Gateway port:  18789"
  echo " Service user:  openclaw"
  echo " Keep-alive:    enabled (auto-restarts)"
  echo ""
  echo "==========================================="
  echo " NEXT STEPS -- follow these in order"
  echo "==========================================="
  echo ""
  echo " 1. TEST TELEGRAM"
  echo "    Open Telegram on your phone."
  echo "    Find your bot and send: Hey! Are you alive?"
  echo "    It should respond within 30 seconds."
  echo ""
  echo " 2. TRY THE TUI (optional -- test from terminal)"
  echo "    Run this command on the server:"
  echo "      sudo -iu openclaw openclaw tui --deliver"
  echo "    Type a message, press Enter. Press Ctrl+C to exit."
  echo ""
  echo " 3. CONNECT THE WEB DASHBOARD"
  echo "    a. On your MacBook, open your browser"
  echo "    b. Go to: https://${DROPLET_IP}"
  echo "    c. You will see an SSL warning -- click through it:"
  echo "       Chrome: Advanced -> Proceed to ${DROPLET_IP} (unsafe)"
  echo "       Safari: Show Details -> visit this website"
  echo "    d. You will see the Gateway Dashboard connection screen"
  echo "    e. Gateway Token: paste this ->  ${TOKEN:-unknown}"
  echo "    f. Click Connect"
  echo ""
  echo " 4. APPROVE DEVICE PAIRING (first time only)"
  echo "    After clicking Connect, you will see 'pairing required'."
  echo "    That is normal! Come back to this terminal and run:"
  echo "      sudo -iu openclaw openclaw devices approve --latest"
  echo "    Then go back to your browser and click Connect again."
  echo "    The dashboard will load."
  echo ""
  echo "    NOTE: The order matters!"
  echo "    Browser Connect FIRST -> SSH approve -> Browser Connect again"
  echo "    If you see 'No pairing request found', you ran approve"
  echo "    before clicking Connect. Just click Connect in the"
  echo "    browser first, then approve, then Connect again."
  echo ""
  echo " USEFUL COMMANDS:"
  echo "   Get your token:  sudo -iu openclaw openclaw dashboard"
  echo "   Health check:    sudo -iu openclaw openclaw health"
  echo "   Service status:  systemctl status openclaw"
  echo "   View logs:       journalctl -u openclaw -f"
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
