# Phase 4: End-to-End Verification Guide

## HOT GIRLS DON'T WORK — 5-Week AI Intensive

This document walks you through every step of Phase 4 on a live server. Use it to verify your setup works, or as a condensed reference if you've already read the full guide.

Every stage ends with a **Verify** step. If the verify step doesn't match what we describe, stop and troubleshoot before continuing.

---

## Pre-Flight Checklist

Before starting, confirm you have:

- [ ] A DigitalOcean account with billing set up ([Sign up with $200 free credit](https://m.do.co/c/1be1bed36903))
- [ ] An Anthropic API key from [console.anthropic.com](https://console.anthropic.com)
- [ ] A Telegram account with @BotFather access
- [ ] Terminal access on your MacBook (Cmd+Space > "Terminal")
- [ ] Your AI Command Center document from Phase 3

---

## Stage 1: Create Your Server

### 1.1 Create the Droplet

1. Go to [marketplace.digitalocean.com/apps/openclaw](https://marketplace.digitalocean.com/apps/openclaw)
2. Click **Create OpenClaw Droplet**
3. Select the **$12/month** tier (1 vCPU, 2 GB RAM)
4. Choose the region closest to you
5. Add your SSH key (or create one: `ssh-keygen -t ed25519 -C "your-email@example.com"`)
6. Click **Create Droplet**

**Verify:** Droplet appears in your DigitalOcean dashboard with an IPv4 address.

### 1.2 SSH In

```bash
ssh root@YOUR_DROPLET_IP
```

First connection asks "Are you sure you want to continue connecting?" — type `yes`.

**What you'll see:** The DigitalOcean 1-Click image shows a model selection prompt. **Press Ctrl+C to skip it.** You'll do this every time you SSH in.

**Verify:** Your terminal prompt changes to `root@your-droplet-name`.

### 1.3 Understand the Two Users

| Account | Home Directory | Purpose |
|---------|---------------|---------|
| `root` | `/root/` | System admin (updates, firewall) |
| `openclaw` | `/home/openclaw/` | OpenClaw runtime (config, API keys, workspace) |

**Golden rule:** Every `openclaw` CLI command must use `sudo -iu openclaw` prefix.

```bash
# WRONG — config goes to /root/ and creates a second config with a different token
openclaw onboard

# RIGHT — config goes to /home/openclaw/
sudo -iu openclaw openclaw onboard
```

> **Why this matters:** Running bare `openclaw` as root creates a separate config file at `/root/.openclaw/openclaw.json` with its own auto-generated token. The gateway then reads root's token while CLI commands read the openclaw user's token — causing "gateway token mismatch" errors. If this happens, see the Troubleshooting section at the bottom of this guide.

---

## Stage 2: Prepare the Server

### 2.1 Add Swap Memory

Run these as root (NOT as the openclaw user):

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

**Verify:**

```bash
free -h
```

You should see a "Swap" row showing `2.0G` total.

### 2.2 Update OpenClaw

```bash
sudo npm i -g openclaw@latest
```

> **Why npm?** The DigitalOcean 1-Click image installs OpenClaw via npm, not git. Running `openclaw update` returns "SKIPPED: not-git-install."

**Verify:**

```bash
sudo -iu openclaw openclaw --version
```

Should show `v2026.3.x` or newer. Then restart:

```bash
sudo systemctl restart openclaw
```

---

## Stage 3: Run the Onboard Wizard

```bash
sudo -iu openclaw openclaw onboard
```

The wizard walks through these steps in order:

1. **QuickStart vs Advanced** — Choose **QuickStart**
2. **Model / Auth** — Select **Anthropic / Claude**, paste your API key
3. **Workspace** — Accept the default
4. **Gateway** — Defaults are fine; token is auto-generated
5. **Channels** — Skip for now (we'll configure Telegram separately)
6. **Daemon** — Install the systemd service
7. **Health check** — Verifies the gateway starts

**Verify:**

```bash
sudo -iu openclaw openclaw health
```

Green checks or passing status. A Telegram warning is expected at this point.

```bash
sudo -iu openclaw openclaw config validate --json
```

Valid config output, no errors.

### What About the Web Dashboard?

The web dashboard is set up in Stage 7 — after you've tested Telegram and the TUI first. The onboard wizard already configured the gateway that powers it.

---

## Stage 4: Connect Telegram

### 4.1 Create a Bot

1. Open Telegram, search for **@BotFather**
2. Send `/newbot`
3. Give it a name (e.g., "My AI Assistant") and username (must end in `bot`)
4. Copy the API token BotFather gives you

### 4.2 Connect to OpenClaw

```bash
sudo -iu openclaw openclaw configure --section channels
```

Select **Telegram**, paste your bot token.

```bash
sudo -iu openclaw openclaw configure --section telegram-dm
```

Find your Telegram user ID by messaging **@userinfobot** in Telegram. Paste the number.

```bash
sudo systemctl restart openclaw
```

**Verify:** Open Telegram, find your bot, send "Hey! Are you alive?" — you should get a response.

---

## Stage 5: Install Config Templates (Agent-Based)

Instead of manually copying files to your server, let your agent do it. This is faster and less error-prone.

### 5.1 Tell Your Agent to Install

Open Telegram (or the TUI) and send this message to your agent:

```text
I need you to install your configuration files from our GitHub repository. Here's what to do:

1. Clone the repo: git clone https://github.com/HGDWAPP/openclaw-templates /tmp/openclaw-setup-repo
2. Copy the preloaded config files to your workspace:
   - cp /tmp/openclaw-setup-repo/preloaded/SOUL.md ~/.openclaw/workspace/SOUL.md
   - cp /tmp/openclaw-setup-repo/preloaded/MEMORY.md ~/.openclaw/workspace/MEMORY.md
   - cp /tmp/openclaw-setup-repo/preloaded/AGENTS.md ~/.openclaw/workspace/AGENTS.md
   - cp /tmp/openclaw-setup-repo/preloaded/HEARTBEAT.md ~/.openclaw/workspace/HEARTBEAT.md
   - cp /tmp/openclaw-setup-repo/preloaded/IDENTITY.md ~/.openclaw/workspace/IDENTITY.md
3. Copy the skills folder: cp -r /tmp/openclaw-setup-repo/preloaded/skills/. ~/.openclaw/workspace/skills/
4. Create the memory directories: mkdir -p ~/.openclaw/workspace/memory/{research,meetings,drafts,digests}
5. Create an empty task board at ~/.openclaw/workspace/memory/task-board.md with these columns:
   --- TASK BOARD ---
   DOING
   NEXT UP
   BLOCKED
   BACKLOG
   DONE (last 7 days)
6. Clean up: rm -rf /tmp/openclaw-setup-repo
7. List what's now in your workspace to confirm everything is there.

Go ahead and do all of this now.
```

Your agent will execute each step and report back.

### 5.2 Restart and Verify

```bash
sudo systemctl restart openclaw
```

```bash
sudo -iu openclaw ls /home/openclaw/.openclaw/workspace/
```

Should show: `AGENTS.md`, `HEARTBEAT.md`, `IDENTITY.md`, `MEMORY.md`, `SOUL.md`, `memory/`, `skills/`

```bash
sudo -iu openclaw ls /home/openclaw/.openclaw/workspace/skills/
```

Should show 8 folders: `content-drafter`, `evening-review`, `file-organizer`, `meeting-prep`, `morning-standup`, `task-board`, `web-researcher`, `weekly-digest`

---

## Stage 6: Load Your AI Command Center

### 6.1 Send the Command Center

Open Telegram (or the TUI) and send:

```text
I'm going to paste my AI Command Center below. This contains my personal context,
brand voice, audience profile, and current projects from Phase 3.

Please read through everything and update MEMORY.md with my information.
Then confirm what you learned about me.

Here is my Command Center:

[PASTE YOUR ENTIRE COMMAND CENTER DOCUMENT HERE]
```

Your agent reads everything, extracts the key information, and updates MEMORY.md automatically.

> **Important:** Paste your REAL Command Center — the one from Phase 3 with your actual information.

### 6.2 Verify It Worked

```text
What do you know about me and my business?
```

Your agent should respond with details from your Command Center — brand voice, audience, projects, ONE Thing.

---

## Stage 7: Access Methods

### 7.1 Telegram (Your Phone)

Already configured in Stage 4. Send messages to your bot anytime, from anywhere.

### 7.2 TUI (Terminal User Interface)

**On your MacBook, step by step:**

1. Open **Terminal** (Cmd+Space > "Terminal")
2. SSH into your server:

```bash
ssh root@YOUR_DROPLET_IP
```

3. Press **Ctrl+C** to skip the model prompt
4. Run:

```bash
sudo -iu openclaw openclaw tui --deliver
```

The `--deliver` flag starts with message delivery already enabled. Without it, the TUI connects but doesn't send your messages to the AI.

**Essential TUI commands:**

| Command | What It Does |
|---------|-------------|
| `/deliver on` | Start sending messages |
| `/deliver off` | Stop (observe mode) |
| `/session main` | Switch to main session |
| `/session new` | Start a new session |
| Ctrl+T | Toggle thinking visibility |
| Ctrl+C | Exit the TUI |

**Test it:** Type a message and make sure you get a response. When you're done, press **Ctrl+C** to exit.

### 7.3 Web Dashboard (GUI)

#### Exit the TUI and Start Fresh

Before setting up the dashboard, get a clean starting point:

1. **Exit the TUI** by pressing **Ctrl+C** (if you're still in it)
2. **Close your SSH session** by typing `exit`
3. **Open a fresh SSH session** from your MacBook:

```bash
ssh root@YOUR_DROPLET_IP
```

#### Configure the Gateway for Browser Access

Run these commands **on your server** (the SSH terminal you just opened). Do NOT run them on your MacBook:

```bash
# 1. Allow browser connections from any origin
sudo -iu openclaw openclaw config set gateway.controlUi.allowedOrigins '["*"]'

# 2. Trust the reverse proxy (Caddy handles HTTPS on your droplet)
sudo -iu openclaw openclaw config set gateway.trustedProxies '["127.0.0.1", "::1"]'

# 3. Get your gateway token (save this — you'll need it to connect)
sudo -iu openclaw cat ~/.openclaw/openclaw.json | grep -o '"token":"[^"]*"' | head -1
```

> **What do these do?** Your droplet uses Caddy as a reverse proxy between your browser and the gateway. The first command lets the gateway accept browser connections. The second tells it to trust Caddy. Without these, you'll get "origin not allowed" or "token mismatch" errors.

#### Keep the Gateway Alive (Important)

OpenClaw's gateway can stop unexpectedly due to its internal process management. Install this wrapper script to auto-restart it:

```bash
# Create the wrapper script
sudo tee /opt/openclaw-start.sh > /dev/null << 'SCRIPT'
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
SCRIPT
sudo chmod +x /opt/openclaw-start.sh

# Update the systemd service to use the wrapper
sudo tee /etc/systemd/system/openclaw.service > /dev/null << 'SERVICE'
[Unit]
Description=OpenClaw Gateway
After=network.target

[Service]
Type=simple
ExecStart=/opt/openclaw-start.sh
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE
sudo systemctl daemon-reload
sudo systemctl restart openclaw
```

> **What does this do?** The wrapper monitors the gateway every 10 seconds and auto-restarts it if it dies. Without this, the gateway can silently stop and your bot goes offline.

#### Open the Dashboard

**Method 1: Direct HTTPS (DigitalOcean 1-Click)**

Open this URL **on your MacBook** (not on the server):

```text
https://YOUR_DROPLET_IP
```

> **SSL certificate warning:** Your browser will show a security warning (the cert is for an IP address). Click through it:
> - **Chrome:** "Advanced" → "Proceed to [IP] (unsafe)"
> - **Firefox:** "Advanced" → "Accept the Risk and Continue"
> - **Safari:** "Show Details" → "visit this website"

On the connection screen:
1. **WebSocket URL** — should be pre-filled with `wss://YOUR_DROPLET_IP`
2. **Gateway Token** — paste the token you saved above
3. Click **Connect**

**Device Pairing (first time only):**

You'll see a "pairing required" message. This is a security feature.

1. Go to your SSH terminal and run:
```bash
sudo -iu openclaw openclaw devices approve --latest
```
2. Go back to your browser and click **Connect** again.

The dashboard should now load.

> **"No pairing request found"?** You ran the approve command before clicking Connect. The correct order is:
> 1. Click **Connect** in browser (creates the pairing request)
> 2. Run `devices approve --latest` in SSH (approves it)
> 3. Click **Connect** again in browser (now it works)
>
> Once paired, you won't need to do this again on the same browser.

**Alternative — Tokenized URL:** Open `https://YOUR_DROPLET_IP/#token=YOUR_GATEWAY_TOKEN` to auto-fill the token. Still needs device pairing the first time.

**Method 2: SSH Tunnel (fallback)**

If direct HTTPS doesn't work, open a **new terminal window** on your MacBook:

```bash
ssh -N -L 18789:127.0.0.1:18789 root@YOUR_DROPLET_IP
```

The `-N` flag means tunnel-only — the terminal will look frozen. That's normal. Leave it running and visit:

```text
http://localhost:18789
```

You'll still need your gateway token and device pairing for the first connection.

### 7.4 Verify Multi-Channel

Send a message through at least two different methods. You should get the same agent with the same personality responding.

---

## Stage 8: Install a Specialist Agent Template (Optional)

The base setup gives you a capable Chief of Staff agent. But if you want an agent that's *specifically* built for your business type, install one of the specialist templates from the workshop.

### 8.0 Choose Your Template

| Template | Best For | Core Capability |
|----------|----------|-----------------|
| **Aria** | Content, brand, thought leadership | Scans news, drafts in your voice, pre-screens work |
| **Scout** | Sales, BD, GTM | Scans markets, scores leads against your ICP, tracks competitors |
| **Atlas** | Investment, analysis, deal flow | Scans signals, matches patterns, generates scored proposals |

### 8.1 Install via Agent Prompt

Open Telegram and send the install prompt for your chosen agent from `workshop/05-AGENT-PROMPTS.md` (or the [Agent Prompts guide on GitHub](https://github.com/HGDWAPP/openclaw-templates/blob/main/workshop/05-AGENT-PROMPTS.md)).

The prompt tells your agent to:
1. Clone the templates repo
2. Copy the specialist template files to your workspace
3. Set up knowledge directories
4. Clean up

Then restart:

```bash
sudo systemctl restart openclaw
```

### 8.2 Load Your Personal Context

Send your agent the personal context prompt from the Agent Prompts guide (Step 2). This fills in USER.md and MEMORY.md with YOUR business details.

### 8.3 Fill Out Knowledge Files

Send your agent the knowledge file prompt for your template (Step 3 in the Agent Prompts guide). This is what makes your agent actually smart about YOUR specific business — without these, it's generic.

### 8.4 Run Bootstrap

```text
Let's run through your bootstrap checklist. Walk me through each step of BOOTSTRAP.md.
```

Your agent walks through setup: model config, memory structure, channels, heartbeats, cron jobs.

### 8.5 Test the Proactive Loop

Once bootstrap completes, trigger a manual scan:

- **Aria:** `Run a content scan right now.`
- **Scout:** `Run a market scan right now.`
- **Atlas:** `Run a signal scan right now.`

You should get back structured, scored results specific to your business.

**Verify:** Your agent returns scored signals with clear reasoning, not generic summaries.

---

## Stage 9: Chief of Staff — Task Management

> **Note:** If you installed a specialist template in Stage 8, your agent already has task management capabilities built in. This stage is for the base (preloaded) setup.

### 8.1 Test the Task Board

In Telegram:

```text
Show me my task board
```

Should show the empty kanban template.

```text
Add a task: review Week 4 guide
```

```text
Start working on: review Week 4 guide
```

```text
What's on my plate?
```

Your agent responds with the formatted kanban board each time.

### 8.2 Set Up Cron Jobs

Tell your agent in Telegram:

```text
Set up two recurring cron jobs:
1. Morning standup at 8:00 AM every day — use the morning-standup skill
2. Evening review at 6:00 PM every day — use the evening-review skill

Both should run as isolated sessions and announce the results to Telegram.
```

**Verify:**

```bash
sudo -iu openclaw openclaw cron list
```

You should see two jobs listed with their schedules.

---

## Stage 10: Five Showcase Skills

All five are already installed. Test each one:

### Web Researcher

```text
Research the latest trends in AI automation for small businesses
```

> Requires web search. Configure if needed: `sudo -iu openclaw openclaw configure --section web`

### File Organizer

```text
What's in my workspace directory?
```

### Meeting Prep

```text
Prep me for a call with [name] about [topic]
```

### Content Drafter

```text
Draft a LinkedIn post about [your area of expertise]
```

### Weekly Digest

Set up the weekly cron:

```text
Set up a recurring cron job: Every Sunday at 7:00 PM, run the weekly-digest skill as an isolated session and announce the results to Telegram.
```

---

## Stage 11: Configure Web Search

Web search lets your agent research topics in real time instead of relying only on its training data.

### 10.1 Set Up a Search Provider

```bash
sudo -iu openclaw openclaw configure --section web
```

The wizard asks for a search provider. **Brave Search** is recommended (free tier available):

1. Go to [brave.com/search/api](https://brave.com/search/api/)
2. Create a free account and get your API key
3. Paste the key into the wizard

```bash
sudo systemctl restart openclaw
```

### 10.2 Test It

```text
Search the web for the latest trends in AI automation for small businesses
```

**Verify:** Your agent returns current results with URLs and summaries — not just training data.

---

## Stage 12: Optimization Quick-Check

Run through these after your setup is working. Each one makes your agent faster and cheaper.

### 11.1 Trim Workspace Files

Ask your agent:

```text
Review all my workspace files (SOUL.md, AGENTS.md, MEMORY.md, IDENTITY.md, HEARTBEAT.md).
For each one, tell me the file size in bytes.
```

**Target sizes:** SOUL.md < 1 KB, AGENTS.md < 10 KB, MEMORY.md < 3 KB, IDENTITY.md < 1 KB, HEARTBEAT.md < 1 KB. If any are over, move details into `memory/` files.

### 11.2 Set Heartbeat to 60 Minutes

The default 30-minute heartbeat is aggressive for most setups:

```bash
sudo -iu openclaw openclaw config set agents.defaults.heartbeat.every '"3600"'
sudo systemctl restart openclaw
```

### 11.3 Use a Cheaper Model for Heartbeats

```bash
sudo -iu openclaw openclaw config set agents.defaults.heartbeat.model '"anthropic/claude-haiku-3"'
sudo systemctl restart openclaw
```

### 11.4 Audit Cron Jobs

```bash
sudo -iu openclaw openclaw cron list
```

Remove any test jobs you forgot about. Keep only: morning standup, evening review, weekly digest.

### 11.5 Set Spending Alerts

Go to [console.anthropic.com](https://console.anthropic.com) and set a daily spending limit.

---

## Stage 13: Tier Completion Checklist

### Tier 1: Getting Started

- [ ] Server running on DigitalOcean ($12/month tier)
- [ ] OpenClaw updated and configured with Claude (Anthropic)
- [ ] Telegram bot connected and responding
- [ ] Dashboard accessible (via HTTPS or SSH tunnel)
- [ ] TUI working — chatted with agent in terminal
- [ ] AI Command Center loaded — agent knows who you are
- [ ] Task board skill working (add, start, complete tasks)
- [ ] Morning standup cron job (8 AM)
- [ ] Evening review cron job (6 PM)
- [ ] Formatted kanban board displayed in Telegram

### Tier 2: Making It Yours

- [ ] Web search configured (Brave Search or other provider)
- [ ] Agent correctly identifies brand voice from Command Center
- [ ] Used web researcher on a real topic
- [ ] Used content drafter in your brand voice
- [ ] Used meeting prep for a real meeting
- [ ] Used file organizer on your workspace
- [ ] Weekly digest cron (Sunday 7 PM)
- [ ] Tweaked at least one workspace file
- [ ] Written at least one custom skill

### Tier 2.5: Specialist Agent (if installed)

- [ ] Specialist template installed (Aria, Scout, or Atlas)
- [ ] Personal context loaded (USER.md + MEMORY.md populated)
- [ ] Knowledge files filled out (voice samples / ICP / thesis)
- [ ] Bootstrap checklist completed
- [ ] Manual scan returned scored, business-specific results
- [ ] Proactive cron jobs set up (morning brief, scan, evening recap)
- [ ] Received first proactive Telegram message from agent

### Tier 3: Optimization & Advanced

- [ ] Workspace files trimmed to recommended sizes
- [ ] Heartbeat interval adjusted (60 or 120 minutes)
- [ ] Cheaper model set for heartbeats (Haiku)
- [ ] Cron jobs audited — no stale or test jobs
- [ ] Spending alerts configured on Anthropic console
- [ ] Tried a sub-agent for a complex task
- [ ] Dashboard HTML file copied to server and working
- [ ] Connected to gateway via WebSocket in browser

---

## Troubleshooting Quick Reference

| Problem | Fix |
|---------|-----|
| Bot doesn't respond on Telegram | `journalctl -u openclaw -f` + `sudo -iu openclaw openclaw doctor` |
| "Command not found" | Add `sudo -iu openclaw` prefix |
| Config changes not taking effect | `sudo systemctl restart openclaw` |
| "ANTHROPIC_API_KEY is not set" | You configured as root. See Stage 1.3 golden rule. |
| Gateway shows "auth required" | Re-run `sudo -iu openclaw openclaw onboard` then restart |
| TUI connects but messages don't send | Type `/deliver on` or use `--deliver` flag |
| Cron jobs not running | `sudo -iu openclaw openclaw cron list` — check times and timezone |
| Dashboard won't load via HTTPS | Try SSH tunnel method (Stage 7.3 Method 2) |
| `openclaw update` says "SKIPPED" | Use `sudo npm i -g openclaw@latest` instead |
| "origin not allowed" on dashboard | Run the gateway commands from Stage 3 |
| "pairing required" on dashboard | Run `sudo -iu openclaw openclaw devices approve --latest` in SSH, then click Connect again |
| "No pairing request found" | Click Connect in browser FIRST, then run approve in SSH, then Connect again |
| "gateway token mismatch" | See **Fixing "Gateway Token Mismatch"** below — this is usually a dual-config problem |

### Fixing "Gateway Token Mismatch"

If you see `unauthorized: gateway token mismatch` in the Control UI or when running `openclaw doctor`, the most common cause is a **dual-config problem** — two different config files with two different tokens.

**How it happens:** If anyone runs an `openclaw` command as root (without `sudo -iu openclaw`), OpenClaw creates a second config at `/root/.openclaw/openclaw.json` with its own auto-generated token. The gateway's background process reads root's config, but the token you copied came from the openclaw user's config. They don't match.

**How to check:**

```bash
# See the openclaw user's token (this is the one you copied)
sudo -iu openclaw cat ~/.openclaw/openclaw.json | grep -o '"token":"[^"]*"' | head -1

# See root's token (if this file exists, you have the dual-config problem)
cat /root/.openclaw/openclaw.json 2>/dev/null
```

If both files exist and the tokens are different, that's your problem.

**Quick fix — use OpenClaw's built-in repair:**

```bash
sudo -iu openclaw openclaw doctor --fix
sudo systemctl restart openclaw
```

The `doctor --fix` command detects the mismatch and syncs the tokens automatically.

**Manual fix (if doctor --fix doesn't resolve it):**

Copy the correct token from the openclaw user's config and sync it to root's config. Run these **on your server**:

```bash
# 1. Get the correct token
sudo -iu openclaw cat ~/.openclaw/openclaw.json | grep -o '"token":"[^"]*"' | head -1
# Copy the token value between the quotes

# 2. Sync it to root's config (replace YOUR_TOKEN with the token you just copied)
openclaw config set gateway.auth.token YOUR_TOKEN
openclaw config set gateway.remote.token YOUR_TOKEN

# 3. Also check the env file — it can override the config
cat /opt/openclaw.env | grep OPENCLAW_GATEWAY_TOKEN
# If the token there is different, update it too:
sudo sed -i "s/OPENCLAW_GATEWAY_TOKEN=.*/OPENCLAW_GATEWAY_TOKEN=YOUR_TOKEN/" /opt/openclaw.env

# 4. Restart the service
sudo systemctl restart openclaw
```

**How to prevent it:** Always use `sudo -iu openclaw` before any `openclaw` command. Never run bare `openclaw` as root.

---

## Key Commands

| What You Want | Command |
|--------------|---------|
| Check if running | `sudo systemctl status openclaw --no-pager` |
| Restart | `sudo systemctl restart openclaw` |
| Health check | `sudo -iu openclaw openclaw health` |
| Diagnose | `sudo -iu openclaw openclaw doctor` |
| Live logs | `journalctl -u openclaw -f` (Ctrl+C to stop) |
| TUI chat | `sudo -iu openclaw openclaw tui --deliver` |
| Validate config | `sudo -iu openclaw openclaw config validate --json` |
| Change model | `sudo -iu openclaw openclaw configure --section model` |
| Change Telegram | `sudo -iu openclaw openclaw configure --section channels` |
| List cron jobs | `sudo -iu openclaw openclaw cron list` |
| Edit workspace file | `sudo -iu openclaw nano /home/openclaw/.openclaw/workspace/[FILE]` |
| Update OpenClaw | `sudo npm i -g openclaw@latest && sudo systemctl restart openclaw` |

## The Filesystem

```
/home/openclaw/.openclaw/
    openclaw.json          # Master config
    workspace/
        SOUL.md            # Personality + voice + boundaries
        MEMORY.md          # Facts about you (auto-populated from Command Center)
        AGENTS.md          # Behavior guidelines + skill registry
        HEARTBEAT.md       # 30-min checklist
        IDENTITY.md        # Agent identity + daily rhythm
        skills/            # 8 installed skills
            task-board/
            morning-standup/
            evening-review/
            web-researcher/
            file-organizer/
            meeting-prep/
            content-drafter/
            weekly-digest/
        memory/
            task-board.md  # Your kanban board
            research/      # Research outputs
            meetings/      # Meeting notes
            drafts/        # Content drafts
            digests/       # Weekly digests
            YYYY-MM-DD.md  # Daily logs (auto-generated)
    cron/
        jobs.json          # Persisted cron job schedules
        runs/              # Run history (auto-pruned)
```

---

*Hot Girls Don't Work — Phase 4: OpenClaw Mastery*
*Work Less. Earn More. Be Hot.*
