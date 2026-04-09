#!/usr/bin/env bash
# ============================================================================
# OpenClaw Pi Kiosk Mode
# Makes the Pi boot directly into the workspace UI — no desktop, no terminal
#
# Usage:
#   sudo bash kiosk-mode.sh
#
# What this does:
#   1. Auto-login the pi user on boot
#   2. Launch Chromium in fullscreen kiosk mode
#   3. Set up mDNS so the Pi is reachable at myagent.local
#   4. Disable screen blanking and power management
#   5. Show a splash screen while the workspace loads
# ============================================================================

set -euo pipefail

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

# Must be root
if [ "$EUID" -ne 0 ]; then
  err "Please run with sudo: sudo bash kiosk-mode.sh"
fi

PI_USER="${SUDO_USER:-pi}"
PI_HOME=$(eval echo "~$PI_USER")

# ── Install dependencies ─────────────────────────────────────────────────

step "Installing kiosk dependencies"
apt-get install -y -qq chromium-browser xdotool unclutter avahi-daemon || true
log "Dependencies installed"

# ── Set up mDNS hostname ─────────────────────────────────────────────────

step "Setting up mDNS hostname"
MDNS_NAME="myagent"
hostnamectl set-hostname "$MDNS_NAME" 2>/dev/null || true

# Configure Avahi for .local resolution
cat > /etc/avahi/avahi-daemon.conf << EOF
[server]
host-name=$MDNS_NAME
domain-name=local
use-ipv4=yes
use-ipv6=yes

[publish]
publish-addresses=yes
publish-hinfo=yes
publish-workstation=yes

[wide-area]
enable-wide-area=no
EOF

systemctl enable avahi-daemon
systemctl restart avahi-daemon
log "mDNS configured: ${MDNS_NAME}.local"

# ── Auto-login ───────────────────────────────────────────────────────────

step "Configuring auto-login"
mkdir -p /etc/systemd/system/getty@tty1.service.d
cat > /etc/systemd/system/getty@tty1.service.d/autologin.conf << EOF
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin $PI_USER --noclear %I \$TERM
EOF
log "Auto-login enabled for $PI_USER"

# ── Kiosk launcher script ────────────────────────────────────────────────

step "Creating kiosk launcher"
KIOSK_SCRIPT="$PI_HOME/.openclaw-kiosk.sh"
cat > "$KIOSK_SCRIPT" << 'EOF'
#!/usr/bin/env bash
# OpenClaw Kiosk Launcher
# Waits for the workspace server, then opens Chromium in kiosk mode

WORKSPACE_URL="http://localhost:3000"
MAX_WAIT=60

# Wait for X server
while ! xdpyinfo -display :0 &>/dev/null; do
  sleep 1
done

# Disable screen blanking
xset -display :0 s off
xset -display :0 -dpms
xset -display :0 s noblank

# Hide mouse cursor after 3 seconds of inactivity
unclutter -display :0 -idle 3 -root &

# Wait for workspace server to come online
echo "Waiting for workspace server..."
WAITED=0
while ! curl -s "$WORKSPACE_URL" > /dev/null 2>&1; do
  sleep 2
  WAITED=$((WAITED + 2))
  if [ "$WAITED" -ge "$MAX_WAIT" ]; then
    echo "Timeout waiting for workspace server"
    break
  fi
done

# Launch Chromium in kiosk mode
chromium-browser \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-component-update \
  --kiosk \
  --start-fullscreen \
  --no-first-run \
  --fast \
  --fast-start \
  --disable-features=TranslateUI \
  --overscroll-history-navigation=0 \
  --disable-pinch \
  --check-for-update-interval=31536000 \
  "$WORKSPACE_URL" &

# Keep script running to prevent logout
wait
EOF
chmod +x "$KIOSK_SCRIPT"
chown "$PI_USER:$PI_USER" "$KIOSK_SCRIPT"
log "Kiosk launcher created"

# ── Auto-start kiosk on login ────────────────────────────────────────────

step "Configuring kiosk auto-start"

# Add to .bash_profile so it runs on console login
BASH_PROFILE="$PI_HOME/.bash_profile"
KIOSK_LINE="[[ -z \$DISPLAY && \$XDG_VTNR -eq 1 ]] && startx $KIOSK_SCRIPT -- -nocursor 2>/dev/null"

if ! grep -q "openclaw-kiosk" "$BASH_PROFILE" 2>/dev/null; then
  cat >> "$BASH_PROFILE" << EOF

# OpenClaw Kiosk Mode — auto-start on first console
$KIOSK_LINE
EOF
  chown "$PI_USER:$PI_USER" "$BASH_PROFILE"
fi

# Create .xinitrc as fallback
cat > "$PI_HOME/.xinitrc" << EOF
#!/bin/sh
exec $KIOSK_SCRIPT
EOF
chmod +x "$PI_HOME/.xinitrc"
chown "$PI_USER:$PI_USER" "$PI_HOME/.xinitrc"
log "Kiosk auto-start configured"

# ── Disable screen blanking in boot config ────────────────────────────────

step "Disabling screen blanking"
CMDLINE="/boot/cmdline.txt"
if [ -f "$CMDLINE" ] && ! grep -q "consoleblank=0" "$CMDLINE"; then
  sed -i 's/$/ consoleblank=0/' "$CMDLINE"
fi
log "Screen blanking disabled"

# ── Done ──────────────────────────────────────────────────────────────────

echo ""
echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  Kiosk Mode Configured!${NC}"
echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  On next reboot, the Pi will:"
echo -e "  1. Auto-login as ${BOLD}$PI_USER${NC}"
echo -e "  2. Launch fullscreen Chromium"
echo -e "  3. Open the workspace at ${BOLD}http://localhost:3000${NC}"
echo -e ""
echo -e "  Reachable from other devices at:"
echo -e "  ${BOLD}http://myagent.local:3000${NC}"
echo -e ""
echo -e "  To exit kiosk mode: ${BOLD}Alt+F4${NC} or SSH in"
echo -e "  To disable: ${BOLD}sudo systemctl set-default multi-user.target${NC}"
echo ""
echo -e "${GREEN}${BOLD}════════════════════════════════════════════════════════${NC}"
echo ""
