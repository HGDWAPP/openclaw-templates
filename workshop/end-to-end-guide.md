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

#### Sync the Gateway Token (Required on 1-Click Droplets)

> **⚠️ This step prevents the #1 gateway issue.** The 1-Click image ships with a pre-generated token in `/opt/openclaw.env`. The onboarding wizard generates a **new** token in `openclaw.json` but does NOT update the env file. Without this sync, every dashboard and TUI connection fails with `unauthorized: gateway token mismatch`.

```bash
# Extract the correct token from openclaw.json and sync it to the env file
NEW_TOKEN=$(sudo -iu openclaw python3 -c "import json; print(json.load(open('/home/openclaw/.openclaw/openclaw.json'))['gateway']['auth']['token'])")
sudo sed -i "s|OPENCLAW_GATEWAY_TOKEN=.*|OPENCLAW_GATEWAY_TOKEN=$NEW_TOKEN|" /opt/openclaw.env
sudo sed -i 's/OPENCLAW_GATEWAY_BIND=lan/OPENCLAW_GATEWAY_BIND=loopback/' /opt/openclaw.env
sudo systemctl restart openclaw

# Verify the tokens match
echo "openclaw.json token: $NEW_TOKEN"
echo "env file token:      $(grep OPENCLAW_GATEWAY_TOKEN /opt/openclaw.env | cut -d= -f2)"
```

Both tokens should be identical. If they are, the gateway will accept connections.

#### Keep the Gateway Alive (Important)

OpenClaw's gateway can stop unexpectedly due to its internal process management. Install this wrapper script to auto-restart it:

```bash
# Create the auto-recovery wrapper script
sudo tee /opt/openclaw-start.sh > /dev/null << 'SCRIPT'
#!/bin/bash
# OpenClaw Gateway Auto-Recovery Wrapper
# Monitors the gateway process and auto-restarts if it dies or stops listening.

cleanup() { kill $GATEWAY_PID 2>/dev/null; exit 0; }
trap cleanup SIGTERM SIGINT

while true; do
    # Kill any orphaned gateway processes
    pkill -9 -f "openclaw-gateway" 2>/dev/null
    sleep 2

    # Start the gateway
    /usr/bin/openclaw gateway --port 18789 --allow-unconfigured &
    GATEWAY_PID=$!

    # Wait for the gateway to start listening (up to 60 seconds)
    for i in $(seq 1 60); do
        if ss -tlnp | grep -q ":18789"; then break; fi
        sleep 1
    done

    # If it never started listening, loop and retry
    if ! ss -tlnp | grep -q ":18789"; then
        echo "[auto-recovery] Gateway failed to start listening, retrying..."
        kill $GATEWAY_PID 2>/dev/null; wait $GATEWAY_PID 2>/dev/null
        continue
    fi

    echo "[auto-recovery] Gateway is listening on port 18789 (PID $GATEWAY_PID)"

    # Monitor: check every 10 seconds that the process is alive AND the port is listening
    while kill -0 $GATEWAY_PID 2>/dev/null && ss -tlnp | grep -q ":18789"; do
        sleep 10
    done

    echo "[auto-recovery] Gateway stopped (PID $GATEWAY_PID), restarting in 5 seconds..."
    sleep 5
done
SCRIPT
sudo chmod +x /opt/openclaw-start.sh

# Update the systemd service to use the wrapper
sudo tee /etc/systemd/system/openclaw.service > /dev/null << 'SERVICE'
[Unit]
Description=OpenClaw Gateway Service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=openclaw
Group=openclaw
WorkingDirectory=/home/openclaw
EnvironmentFile=/opt/openclaw.env
Environment="HOME=/home/openclaw"
Environment="NODE_ENV=production"
Environment="PATH=/home/openclaw/.openclaw/workspace/npm/bin:/home/openclaw/.openclaw/workspace/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=/opt/openclaw-start.sh
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
SERVICE
sudo systemctl daemon-reload
sudo systemctl restart openclaw
```

> **What does this do?** The wrapper monitors the gateway every 10 seconds and auto-restarts it if it dies or stops listening on the port. Without this, the gateway can silently stop and your bot goes offline. The wrapper also:
> - Handles SIGTERM/SIGINT cleanly for `systemctl stop`
> - Kills orphaned gateway processes before starting
> - Logs recovery events to journald
> - Runs as the `openclaw` user (not root) via the systemd service

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

### 8.1 Choose Your Template

| Template | Best For | Core Capability |
|----------|----------|-----------------|
| **Aria** | Content, brand, thought leadership | Scans news, drafts in your voice, pre-screens work |
| **Scout** | Sales, BD, GTM | Scans markets, scores leads against your ICP, tracks competitors |
| **Atlas** | Investment, analysis, deal flow | Scans signals, matches patterns, generates scored proposals |

Pick the one closest to your business. You can always switch later.

### 8.2 Install the Template Pack

Open Telegram (or the TUI) and send **one** of these messages to your agent depending on which template you chose:

#### Aria (Brand Strategist & Content Intelligence)

```text
I need you to install a specialist agent template. Here's what to do:

1. Clone the repo: git clone https://github.com/HGDWAPP/openclaw-templates /tmp/agent-setup
2. Copy the Aria template files to your workspace:
   - cp /tmp/agent-setup/workshop/agent-templates/aria/IDENTITY.md ~/.openclaw/workspace/IDENTITY.md
   - cp /tmp/agent-setup/workshop/agent-templates/aria/SOUL.md ~/.openclaw/workspace/SOUL.md
   - cp /tmp/agent-setup/workshop/agent-templates/aria/AGENTS.md ~/.openclaw/workspace/AGENTS.md
   - cp /tmp/agent-setup/workshop/agent-templates/aria/HEARTBEAT.md ~/.openclaw/workspace/HEARTBEAT.md
   - cp /tmp/agent-setup/workshop/agent-templates/aria/BOOTSTRAP.md ~/.openclaw/workspace/BOOTSTRAP.md
   - cp /tmp/agent-setup/workshop/agent-templates/aria/USER.md ~/.openclaw/workspace/USER.md
3. Copy the skills: cp -r /tmp/agent-setup/workshop/agent-templates/aria/skills/. ~/.openclaw/workspace/skills/
4. Copy the knowledge templates: mkdir -p ~/.openclaw/workspace/knowledge && cp -r /tmp/agent-setup/workshop/agent-templates/aria/knowledge/. ~/.openclaw/workspace/knowledge/
5. Create memory directories: mkdir -p ~/.openclaw/workspace/memory/{research,drafts,digests}
6. Clean up: rm -rf /tmp/agent-setup
7. List what's now in your workspace to confirm everything is there.

Go ahead and do all of this now.
```

#### Scout (GTM Intelligence & Market Strategist)

```text
I need you to install a specialist agent template. Here's what to do:

1. Clone the repo: git clone https://github.com/HGDWAPP/openclaw-templates /tmp/agent-setup
2. Copy the Scout template files to your workspace:
   - cp /tmp/agent-setup/workshop/agent-templates/scout/IDENTITY.md ~/.openclaw/workspace/IDENTITY.md
   - cp /tmp/agent-setup/workshop/agent-templates/scout/SOUL.md ~/.openclaw/workspace/SOUL.md
   - cp /tmp/agent-setup/workshop/agent-templates/scout/AGENTS.md ~/.openclaw/workspace/AGENTS.md
   - cp /tmp/agent-setup/workshop/agent-templates/scout/HEARTBEAT.md ~/.openclaw/workspace/HEARTBEAT.md
   - cp /tmp/agent-setup/workshop/agent-templates/scout/BOOTSTRAP.md ~/.openclaw/workspace/BOOTSTRAP.md
   - cp /tmp/agent-setup/workshop/agent-templates/scout/USER.md ~/.openclaw/workspace/USER.md
3. Copy the skills: cp -r /tmp/agent-setup/workshop/agent-templates/scout/skills/. ~/.openclaw/workspace/skills/
4. Copy the knowledge templates: mkdir -p ~/.openclaw/workspace/knowledge && cp -r /tmp/agent-setup/workshop/agent-templates/scout/knowledge/. ~/.openclaw/workspace/knowledge/
5. Create memory directories: mkdir -p ~/.openclaw/workspace/memory/{research,leads,digests}
6. Clean up: rm -rf /tmp/agent-setup
7. List what's now in your workspace to confirm everything is there.

Go ahead and do all of this now.
```

#### Atlas (Investment Intelligence & Opportunity Engine)

```text
I need you to install a specialist agent template. Here's what to do:

1. Clone the repo: git clone https://github.com/HGDWAPP/openclaw-templates /tmp/agent-setup
2. Copy the Atlas template files to your workspace:
   - cp /tmp/agent-setup/workshop/agent-templates/atlas/IDENTITY.md ~/.openclaw/workspace/IDENTITY.md
   - cp /tmp/agent-setup/workshop/agent-templates/atlas/SOUL.md ~/.openclaw/workspace/SOUL.md
   - cp /tmp/agent-setup/workshop/agent-templates/atlas/AGENTS.md ~/.openclaw/workspace/AGENTS.md
   - cp /tmp/agent-setup/workshop/agent-templates/atlas/HEARTBEAT.md ~/.openclaw/workspace/HEARTBEAT.md
   - cp /tmp/agent-setup/workshop/agent-templates/atlas/BOOTSTRAP.md ~/.openclaw/workspace/BOOTSTRAP.md
   - cp /tmp/agent-setup/workshop/agent-templates/atlas/USER.md ~/.openclaw/workspace/USER.md
3. Copy the skills: cp -r /tmp/agent-setup/workshop/agent-templates/atlas/skills/. ~/.openclaw/workspace/skills/
4. Copy the knowledge templates: mkdir -p ~/.openclaw/workspace/knowledge && cp -r /tmp/agent-setup/workshop/agent-templates/atlas/knowledge/. ~/.openclaw/workspace/knowledge/
5. Create memory directories: mkdir -p ~/.openclaw/workspace/memory/{research,deals,digests}
6. Clean up: rm -rf /tmp/agent-setup
7. List what's now in your workspace to confirm everything is there.

Go ahead and do all of this now.
```

Your agent will execute each step and report back. Once it confirms, restart from your SSH terminal:

```bash
sudo systemctl restart openclaw
```

**Verify:**

```bash
sudo -iu openclaw ls /home/openclaw/.openclaw/workspace/
```

Should show: `AGENTS.md`, `BOOTSTRAP.md`, `HEARTBEAT.md`, `IDENTITY.md`, `SOUL.md`, `USER.md`, `knowledge/`, `memory/`, `skills/`

### 8.3 Load Your Personal Context

This is what makes the agent smart about YOU specifically. Send this to your agent (fill in the blanks):

```text
I'm going to give you my personal context so you can be effective for MY business specifically. Please read everything and update USER.md and MEMORY.md with my information. Then confirm what you learned about me.

Here's who I am:

**Name:** [Your name]
**Business:** [What you do / your company]
**Industry:** [Your industry or niche]
**Role:** [Your title or what you do day-to-day]

**What I sell / offer:**
[Describe your products, services, or what you're building]

**My audience / customers:**
[Who are you trying to reach? What do they care about?]

**My goals right now:**
[What are you focused on for the next 30-90 days?]

**My voice / brand:**
[How would you describe your communication style? Casual? Professional? Bold? Give examples if you can.]

**Things I care about:**
[What topics, trends, or ideas are you passionate about?]

**Communication preferences:**
- Best way to reach me: Telegram
- When I want updates: [morning / evening / both]
- How detailed: [bullet points / detailed analysis / just the highlights]
- Timezone: [Your timezone]
```

Your agent reads this and immediately becomes smarter about YOUR specific business.

**Verify:** Ask `What do you know about me and my business?` — it should respond with the details you just gave it.

### 8.4 Fill Out Your Knowledge Files

This is the step that makes the agent actually powerful. The knowledge files are what separate "generic chatbot" from "specialist that understands your world." Send **one** of these depending on your agent:

#### For Aria — Voice & Feedback Patterns

```text
I need to fill out my knowledge files so you can do your job well. Let's start:

**My best content (links or descriptions of posts that performed well):**
1. [Link or description of your best post/article]
2. [Another one]
3. [One more]

**My brand voice rules:**
- [e.g., "Never use corporate jargon"]
- [e.g., "Always lead with a story or hot take"]
- [e.g., "Keep it conversational, like texting a smart friend"]

**My quality bar — what makes content "good enough" to publish:**
- [e.g., "Has a clear hook in the first line"]
- [e.g., "Teaches something actionable"]
- [e.g., "Sounds like me, not like AI"]

**Topics I want to own as a thought leader:**
- [Topic 1]
- [Topic 2]
- [Topic 3]

**Competitors or peers I watch:**
- [Name/handle 1]
- [Name/handle 2]

Please update knowledge/voice-samples.md and knowledge/feedback-patterns.md with this information. Then show me what you saved.
```

#### For Scout — ICP & Growth Frameworks

```text
I need to fill out my knowledge files so you can do your job well. Let's start:

**My Ideal Customer Profile (ICP):**
- Industry: [What industry are your best customers in?]
- Company size: [Revenue range or employee count]
- Title of decision maker: [Who do you sell to?]
- Pain points: [What problems do they have that you solve?]
- Budget range: [What do they typically spend?]
- How I find them today: [Referrals? Social? Outbound? Events?]

**What makes a lead "hot":**
- [e.g., "They just raised funding"]
- [e.g., "They posted about the exact problem we solve"]
- [e.g., "They're hiring for the role our product replaces"]

**Growth frameworks I follow:**
- [e.g., "Alex Hormozi — value equation, $100M Offers framework"]
- [e.g., "Sabri Suby — Sell Like Crazy funnel methodology"]
- [e.g., "Your own framework or playbook"]

**Competitors to monitor:**
- [Competitor 1 — what they sell, why they matter]
- [Competitor 2]

**My current growth channels:**
- [e.g., LinkedIn outbound, Twitter/X, cold email, partnerships]

Please update knowledge/icp.md and knowledge/influencer-frameworks.md with this information. Then show me what you saved.
```

#### For Atlas — Investment Thesis & Patterns

```text
I need to fill out my knowledge files so you can do your job well. Let's start:

**My Investment Thesis:**
- Sectors I care about: [e.g., "AI infrastructure, fintech, health tech"]
- Stage preference: [e.g., "Pre-seed to Series A"]
- Check size: [e.g., "$25K - $100K" or "angel checks"]
- Geographic focus: [e.g., "US, with interest in emerging markets"]
- What I look for in founders: [e.g., "Domain experts building in their own industry"]

**Pattern types I'm most interested in:**
- The Parallel: [e.g., "What worked in fintech applied to health care"]
- The Convergence: [e.g., "AI + robotics creating new categories"]
- The Dislocation: [e.g., "Regulatory changes opening windows"]
- The Infrastructure Play: [e.g., "Picks and shovels for AI adoption"]

**Deal sources I trust:**
- [e.g., "AngelList, specific Twitter follows, specific newsletters"]

**My conviction scoring — what pushes a deal from 6 to 8+:**
- [e.g., "Founder has done this before"]
- [e.g., "Revenue already growing 20%+ MoM"]
- [e.g., "Clear thesis match on 2+ dimensions"]

**Red flags that kill a deal:**
- [e.g., "No technical co-founder"]
- [e.g., "Crowded market with no differentiation"]

Please update knowledge/thesis.md and knowledge/investment-patterns.md with this information. Then show me what you saved.
```

**Verify:** Ask your agent `What's in my knowledge files?` — it should reference the specific details you just provided.

### 8.5 Run the Bootstrap

```text
Let's run through your bootstrap checklist. Walk me through each step of BOOTSTRAP.md and let me know what's already done and what still needs setup.
```

Your agent goes through the BOOTSTRAP.md checklist step by step — model config, memory structure, channels, heartbeats, cron jobs. It tells you what's configured and what still needs attention.

Once bootstrap completes, tell your agent: `Bootstrap is done, delete BOOTSTRAP.md`

### 8.6 Test Your Agent's Superpowers

Now trigger a manual scan to see the proactive intelligence loop in action:

#### For Aria

```text
Run a content scan right now. Search for trending topics and news in my industry, score each for relevance and angle potential, and draft 3 post ideas in my voice.
```

#### For Scout

```text
Run a market scan right now. Search for leads that match my ICP, check what my competitors are doing, and surface the top 3 opportunities with scores.
```

#### For Atlas

```text
Run a signal scan right now. Search for recent funding rounds, market shifts, and emerging patterns in my sectors. Score any opportunities against my thesis and give me structured proposals for anything above 7.0 conviction.
```

**Verify:** Your agent returns scored signals with clear reasoning, not generic summaries. The results should be specific to YOUR business.

### 8.7 Set Up Proactive Schedules

This is what makes your agent run on autopilot — scanning, scoring, and reporting to you on a schedule without you having to ask:

```text
Set up my recurring cron jobs:

1. Morning brief at 8:00 AM every weekday — summarize overnight signals, today's priorities, and anything needing my attention. Run as a main session event.

2. Proactive scan every 6 hours — run your scanning skill as an isolated session and announce results to Telegram. Only report if something is worth my time.

3. Evening recap at 6:00 PM every weekday — summarize what happened today, what's actionable, and what's on deck for tomorrow. Run as a main session event.

Use my timezone: [YOUR TIMEZONE]
My Telegram chat ID: [YOUR CHAT ID]
```

**Verify from SSH:**

```bash
sudo -iu openclaw openclaw cron list
```

You should see 3 jobs listed with their schedules.

### 8.8 Verify the Full Loop

Wait for the next scheduled scan to fire (or trigger one manually with Step 8.6). You should get a structured Telegram message with:

- Scored signals/leads/opportunities
- Clear recommendations
- Your agent's reasoning for each score

If the message arrives and the scoring makes sense for your business, **your specialist agent is fully operational.**

### Specialist Agent Quick Reference

| You Want To... | Say This |
|----------------|----------|
| Get a status update | "What's going on?" |
| Run a manual scan | "Run a [content/market/signal] scan now" |
| Check what agent knows about you | "What do you know about me?" |
| Update your context | "Update my [USER.md/knowledge files] with this: ..." |
| Add a task | "Add a task: [description]" |
| See your pipeline | "Show me my [content calendar/lead pipeline/deal pipeline]" |
| Adjust scan frequency | "Change the scan schedule to every [X] hours" |
| Get help | "Walk me through your capabilities" |

---

## Stage 9: Chief of Staff — Task Management

> **Note:** If you installed a specialist template in Stage 8, your agent already has task management capabilities built in. This stage is for the base (preloaded) setup.

### 9.1 Test the Task Board

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

### 9.2 Set Up Cron Jobs

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

### 11.1 Set Up a Search Provider

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

### 11.2 Test It

```text
Search the web for the latest trends in AI automation for small businesses
```

**Verify:** Your agent returns current results with URLs and summaries — not just training data.

---

## Stage 12: Optimization Quick-Check

Run through these after your setup is working. Each one makes your agent faster and cheaper.

### 12.1 Trim Workspace Files

Ask your agent:

```text
Review all my workspace files (SOUL.md, AGENTS.md, MEMORY.md, IDENTITY.md, HEARTBEAT.md).
For each one, tell me the file size in bytes.
```

**Target sizes:** SOUL.md < 1 KB, AGENTS.md < 10 KB, MEMORY.md < 3 KB, IDENTITY.md < 1 KB, HEARTBEAT.md < 1 KB. If any are over, move details into `memory/` files.

### 12.2 Set Heartbeat to 60 Minutes

The default 30-minute heartbeat is aggressive for most setups:

```bash
sudo -iu openclaw openclaw config set agents.defaults.heartbeat.every '"3600"'
sudo systemctl restart openclaw
```

### 12.3 Use a Cheaper Model for Heartbeats

```bash
sudo -iu openclaw openclaw config set agents.defaults.heartbeat.model '"anthropic/claude-haiku-3"'
sudo systemctl restart openclaw
```

### 12.4 Audit Cron Jobs

```bash
sudo -iu openclaw openclaw cron list
```

Remove any test jobs you forgot about. Keep only: morning standup, evening review, weekly digest.

### 12.5 Set Spending Alerts

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
| "origin not allowed" on dashboard | Run the gateway config commands from Stage 7.3 (allowedOrigins + trustedProxies) |
| "pairing required" on dashboard | Run `sudo -iu openclaw openclaw devices approve --latest` in SSH, then click Connect again |
| "No pairing request found" | Click Connect in browser FIRST, then run approve in SSH, then Connect again |
| "gateway token mismatch" | See **Fixing "Gateway Token Mismatch"** below — this is usually a dual-config problem |

### Fixing "Gateway Token Mismatch"

If you see `unauthorized: gateway token mismatch` in the Control UI or when running `openclaw doctor`, there are **two common causes**:

#### Cause 1: Env file token desync (most common on 1-Click droplets)

The 1-Click image ships with a pre-generated token in `/opt/openclaw.env`. When you run `openclaw onboard`, the wizard generates a **new** token in `openclaw.json` but does NOT update the env file. Scripts and dashboards that read the env file get the wrong token.

**How to check:**

```bash
# Get the REAL token (from openclaw.json — the authoritative source)
sudo -iu openclaw python3 -c "import json; print(json.load(open('/home/openclaw/.openclaw/openclaw.json'))['gateway']['auth']['token'])"

# Get the env file token
grep OPENCLAW_GATEWAY_TOKEN /opt/openclaw.env
```

If they're different, that's your problem.

**Fix:**

```bash
NEW_TOKEN=$(sudo -iu openclaw python3 -c "import json; print(json.load(open('/home/openclaw/.openclaw/openclaw.json'))['gateway']['auth']['token'])")
sudo sed -i "s|OPENCLAW_GATEWAY_TOKEN=.*|OPENCLAW_GATEWAY_TOKEN=$NEW_TOKEN|" /opt/openclaw.env
sudo systemctl restart openclaw
```

**Prevention:** Always run the token sync step after `openclaw onboard` (see Stage 7.3 "Sync the Gateway Token").

#### Cause 2: Dual-config problem (root vs openclaw user)

If anyone runs an `openclaw` command as root (without `sudo -iu openclaw`), OpenClaw creates a second config at `/root/.openclaw/openclaw.json` with its own auto-generated token.

**How to check:**

```bash
# See the openclaw user's token (this is the one the service uses)
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

```bash
# 1. Get the correct token from the openclaw user's config
sudo -iu openclaw cat ~/.openclaw/openclaw.json | grep -o '"token":"[^"]*"' | head -1
# Copy the token value between the quotes

# 2. Sync it to root's config (replace YOUR_TOKEN with the token you just copied)
openclaw config set gateway.auth.token YOUR_TOKEN
openclaw config set gateway.remote.token YOUR_TOKEN

# 3. Also sync the env file
sudo sed -i "s|OPENCLAW_GATEWAY_TOKEN=.*|OPENCLAW_GATEWAY_TOKEN=YOUR_TOKEN|" /opt/openclaw.env

# 4. Restart the service
sudo systemctl restart openclaw
```

**How to prevent both causes:**
1. Always use `sudo -iu openclaw` before any `openclaw` command (prevents Cause 2)
2. Always run the token sync step after `openclaw onboard` (prevents Cause 1)

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
