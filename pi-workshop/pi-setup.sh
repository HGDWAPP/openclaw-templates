#!/usr/bin/env bash
# ============================================================================
# OpenClaw Pi Workshop Setup
# One-command bootstrap for Raspberry Pi 5 workshop units
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/HGDWAPP/openclaw-templates/main/pi-workshop/pi-setup.sh | bash
#
# What this does:
#   1. Detects Raspberry Pi hardware
#   2. Installs Node.js 24 (ARM64)
#   3. Installs OpenClaw gateway
#   4. Clones workshop templates
#   5. Builds the workspace UI
#   6. Sets up systemd services (gateway + workspace)
#   7. Prints access URL
# ============================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }
step() { echo -e "\n${CYAN}${BOLD}▸ $1${NC}"; }

# ── Pre-flight checks ──────────────────────────────────────────────────────

step "Pre-flight checks"

# Detect Pi
if [ -f /proc/device-tree/model ]; then
  MODEL=$(tr -d '\0' < /proc/device-tree/model)
  log "Detected: $MODEL"
else
  warn "Not running on a Raspberry Pi — proceeding anyway"
  MODEL="Unknown"
fi

# Check architecture
ARCH=$(uname -m)
if [ "$ARCH" != "aarch64" ]; then
  err "This script requires 64-bit ARM (aarch64). Got: $ARCH"
fi
log "Architecture: $ARCH"

# Check memory
TOTAL_MEM=$(free -m | awk '/Mem:/{print $2}')
if [ "$TOTAL_MEM" -lt 2000 ]; then
  warn "Only ${TOTAL_MEM}MB RAM detected. Recommend 4GB+."
else
  log "Memory: ${TOTAL_MEM}MB"
fi

# ── System updates ─────────────────────────────────────────────────────────

step "Updating system packages"
sudo apt-get update -qq
sudo apt-get upgrade -y -qq
sudo apt-get install -y -qq curl git build-essential
log "System packages updated"

# ── Node.js 24 ─────────────────────────────────────────────────────────────

step "Installing Node.js 24 (ARM64)"
if command -v node &>/dev/null; then
  CURRENT_NODE=$(node --version)
  log "Node.js already installed: $CURRENT_NODE"
else
  curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
  sudo apt-get install -y -qq nodejs
  log "Node.js installed: $(node --version)"
fi

# ── OpenClaw ───────────────────────────────────────────────────────────────

step "Installing OpenClaw"
if command -v openclaw &>/dev/null; then
  log "OpenClaw already installed: $(openclaw --version 2>/dev/null || echo 'unknown')"
  log "Updating to latest..."
  sudo npm install -g openclaw@latest --quiet
else
  sudo npm install -g openclaw@latest --quiet
  log "OpenClaw installed: $(openclaw --version 2>/dev/null || echo 'installed')"
fi

# ── Clone templates ────────────────────────────────────────────────────────

step "Setting up workshop files"
TEMPLATES_DIR="$HOME/openclaw-templates"
if [ -d "$TEMPLATES_DIR" ]; then
  log "Templates already cloned, pulling latest..."
  cd "$TEMPLATES_DIR" && git pull --quiet
else
  git clone --quiet https://github.com/HGDWAPP/openclaw-templates.git "$TEMPLATES_DIR"
  log "Templates cloned"
fi

# ── Build workspace UI ─────────────────────────────────────────────────────

step "Building workspace UI"
WORKSHOP_DIR="$TEMPLATES_DIR/pi-workshop"
cd "$WORKSHOP_DIR"
npm install --quiet
cd "$WORKSHOP_DIR/workspace-ui"
npm install --quiet
npm run build
log "Workspace UI built"

# ── OpenClaw initial setup ─────────────────────────────────────────────────

step "Running OpenClaw initial setup"
# Create workspace directories
mkdir -p "$HOME/.openclaw/workspace/memory"/{research,meetings,drafts,digests}

# Create task board
TASK_BOARD="$HOME/.openclaw/workspace/memory/task-board.md"
if [ ! -f "$TASK_BOARD" ]; then
  cat > "$TASK_BOARD" << 'EOF'
--- TASK BOARD ---
DOING

NEXT UP

BLOCKED

BACKLOG

DONE (last 7 days)
EOF
fi

log "OpenClaw workspace initialized"

# ── Systemd services ───────────────────────────────────────────────────────

step "Setting up systemd services"
mkdir -p "$HOME/.config/systemd/user"

# Workspace UI service
cat > "$HOME/.config/systemd/user/openclaw-workspace.service" << EOF
[Unit]
Description=OpenClaw Pi Workspace UI
After=network.target

[Service]
Type=simple
WorkingDirectory=$WORKSHOP_DIR
ExecStart=$(which node) server.js
Restart=always
RestartSec=5
Environment=PORT=3000
Environment=NODE_ENV=production

[Install]
WantedBy=default.target
EOF

# Enable and start
systemctl --user daemon-reload
systemctl --user enable openclaw-workspace.service
systemctl --user start openclaw-workspace.service
log "Workspace UI service started on port 3000"

# Enable lingering so services start on boot without login
sudo loginctl enable-linger "$(whoami)" 2>/dev/null || true
log "Services enabled for auto-start on boot"

# ── Performance tuning ─────────────────────────────────────────────────────

step "Performance tuning"

# Increase file watchers
if ! grep -q "fs.inotify.max_user_watches" /etc/sysctl.conf 2>/dev/null; then
  echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf > /dev/null
  sudo sysctl -p > /dev/null 2>&1
fi

# Add swap if not present
if [ "$(swapon --show | wc -l)" -eq 0 ]; then
  warn "No swap detected. Adding 2GB swap..."
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile > /dev/null
  sudo swapon /swapfile
  echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab > /dev/null
  log "2GB swap added"
else
  log "Swap already configured"
fi

# ── Done ───────────────────────────────────────────────────────────────────

IP_ADDR=$(hostname -I | awk '{print $1}')
HOSTNAME=$(hostname)

echo ""
echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  OpenClaw Pi Workshop — Setup Complete!${NC}"
echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${BOLD}Workspace UI:${NC}  http://${IP_ADDR}:3000"
echo -e "  ${BOLD}Also at:${NC}       http://${HOSTNAME}.local:3000"
echo ""
echo -e "  ${BOLD}Next step:${NC}     Open the URL above in your browser"
echo -e "                 and follow the guided setup."
echo ""
echo -e "  ${BOLD}Gateway port:${NC}  18789 (starts after onboarding)"
echo -e "  ${BOLD}Templates:${NC}     $TEMPLATES_DIR"
echo ""
echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════════${NC}"
echo ""
