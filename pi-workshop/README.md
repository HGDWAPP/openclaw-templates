# OpenClaw Pi Workshop

A gamified workspace UI for setting up OpenClaw on Raspberry Pi 5 — designed for workshop environments where pre-configured Pis are handed out to students.

## What This Is

Students power on a Pi, open a browser, and land in a **workspace** — not a terminal. The workspace guides them through setting up their personal AI agent with:

- **Gamified onboarding** — 6-step setup flow with XP, levels, and achievements
- **Template browser** — one-click install of pre-built agent personalities (Chief of Staff, Marketing Operator, etc.)
- **Chat interface** — talk to your agent directly from the workspace
- **Dashboard** — system stats, quick actions, activity feed
- **Settings** — manage API keys, channels, gateway config

## Architecture

```
Student's Laptop (browser)
       │
       ▼
┌──────────────────────────┐
│  Pi Workshop Server      │  ← Express.js on port 3000
│  ├── Workspace UI (React)│  ← Built with Vite + Tailwind
│  └── API endpoints       │  ← Talks to OpenClaw CLI
├──────────────────────────┤
│  OpenClaw Gateway        │  ← Port 18789
│  └── Routes to Cloud AI  │  ← Gemini, Claude, GPT
└──────────────────────────┘
```

## Quick Start (on a Raspberry Pi 5)

```bash
curl -fsSL https://raw.githubusercontent.com/HGDWAPP/openclaw-templates/main/pi-workshop/pi-setup.sh | bash
```

This single command:
1. Installs Node.js 24 (ARM64)
2. Installs OpenClaw gateway
3. Clones this repo
4. Builds the workspace UI
5. Sets up auto-start systemd services
6. Prints the access URL

Then open `http://<pi-ip>:3000` on any device on the same network.

## Manual Setup

```bash
# Clone the repo
git clone https://github.com/HGDWAPP/openclaw-templates.git
cd openclaw-templates/pi-workshop

# Install server dependencies
npm install

# Build the workspace UI
cd workspace-ui
npm install
npm run build
cd ..

# Start the server
node server.js
```

## Development

```bash
# Run the workspace UI in dev mode (hot reload)
cd workspace-ui
npm run dev

# In another terminal, run the Express server
cd ..
node server.js
```

## Workshop Prep

To prepare Pis for a workshop:

1. Flash Raspberry Pi OS Lite 64-bit onto each SD card
2. Enable SSH and configure Wi-Fi in the imager
3. Boot each Pi and run the setup script
4. Verify the workspace loads at `http://<pi-ip>:3000`

For pre-baked SD cards, run the setup once, then clone the SD card with `dd` or Raspberry Pi Imager.

## Resetting Between Sessions

The workspace has a "Reset Everything" button in Settings. For bulk reset:

```bash
curl -X POST http://localhost:3000/api/reset
```

## File Structure

```
pi-workshop/
├── server.js              # Express API server
├── package.json           # Server dependencies
├── pi-setup.sh            # One-command bootstrap script
├── README.md
└── workspace-ui/          # React frontend (Vite + Tailwind + shadcn)
    ├── src/
    │   ├── App.tsx         # Main app with routing and state
    │   ├── components/
    │   │   └── Sidebar.tsx # Navigation sidebar with XP bar
    │   └── pages/
    │       ├── Dashboard.tsx
    │       ├── Onboarding.tsx
    │       ├── Chat.tsx
    │       ├── Templates.tsx
    │       ├── Achievements.tsx
    │       └── Settings.tsx
    └── dist/               # Built output (served by Express)
```
