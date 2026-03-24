# OpenClaw Config — Preloaded Chief of Staff

This is a **fully configured** workspace for your OpenClaw agent. Everything works out of the box. You do not need to edit any files before installing.

## What's Inside

| File | What It Does |
|------|-------------|
| `SOUL.md` | Agent personality — warm, direct, organized Chief of Staff |
| `MEMORY.md` | Your personal context — auto-populated when you share your Command Center |
| `AGENTS.md` | Operating rules, skill registry, safety boundaries |
| `HEARTBEAT.md` | 30-minute check-in checklist (task awareness, daily notes) |
| `IDENTITY.md` | Agent identity, daily rhythm (8 AM standup, 6 PM review) |
| `skills/task-board/` | Kanban task tracking (Doing, Next Up, Blocked, Backlog, Done) |
| `skills/morning-standup/` | 8 AM daily priority check-in |
| `skills/evening-review/` | 6 PM daily progress wrap-up |
| `skills/web-researcher/` | Research any topic with sources cited |
| `skills/file-organizer/` | Clean up messy directories |
| `skills/meeting-prep/` | Briefing docs before calls |
| `skills/content-drafter/` | Write social posts and emails in your voice |
| `skills/weekly-digest/` | Sunday evening week summary |

## How to Install

### Step 1: Upload the files to your server

From your laptop (not on the server), run:

```bash
ssh root@YOUR_DROPLET_IP mkdir -p /tmp/openclaw-setup
scp -r openclaw-config/* root@YOUR_DROPLET_IP:/tmp/openclaw-setup/
```

### Step 2: SSH into your server

```bash
ssh root@YOUR_DROPLET_IP
```

Press Ctrl+C to skip the model selection prompt.

### Step 3: Copy workspace files

```bash
sudo -iu openclaw cp /tmp/openclaw-setup/SOUL.md /home/openclaw/.openclaw/workspace/SOUL.md
sudo -iu openclaw cp /tmp/openclaw-setup/MEMORY.md /home/openclaw/.openclaw/workspace/MEMORY.md
sudo -iu openclaw cp /tmp/openclaw-setup/AGENTS.md /home/openclaw/.openclaw/workspace/AGENTS.md
sudo -iu openclaw cp /tmp/openclaw-setup/HEARTBEAT.md /home/openclaw/.openclaw/workspace/HEARTBEAT.md
sudo -iu openclaw cp /tmp/openclaw-setup/IDENTITY.md /home/openclaw/.openclaw/workspace/IDENTITY.md
```

### Step 4: Copy skills

```bash
sudo -iu openclaw mkdir -p /home/openclaw/.openclaw/workspace/skills
sudo -iu openclaw cp -r /tmp/openclaw-setup/skills/. /home/openclaw/.openclaw/workspace/skills/
```

### Step 5: Create the memory directory and empty task board

```bash
sudo -iu openclaw mkdir -p /home/openclaw/.openclaw/workspace/memory
sudo -iu openclaw mkdir -p /home/openclaw/.openclaw/workspace/memory/research
sudo -iu openclaw mkdir -p /home/openclaw/.openclaw/workspace/memory/meetings
sudo -iu openclaw mkdir -p /home/openclaw/.openclaw/workspace/memory/drafts
sudo -iu openclaw mkdir -p /home/openclaw/.openclaw/workspace/memory/digests
sudo -iu openclaw tee /home/openclaw/.openclaw/workspace/memory/task-board.md > /dev/null << 'EOF'
--- TASK BOARD ---

DOING

NEXT UP

BLOCKED

BACKLOG

DONE (last 7 days)
EOF
```

### Step 6: Restart and verify

```bash
sudo systemctl restart openclaw
sudo -iu openclaw ls /home/openclaw/.openclaw/workspace/
sudo -iu openclaw ls /home/openclaw/.openclaw/workspace/skills/
```

You should see all 5 workspace files and 8 skill folders.

### Step 7: Clean up

```bash
rm -rf /tmp/openclaw-setup
```

## After Installing

1. Open Telegram and paste your AI Command Center from Phase 3. Your agent reads it and populates MEMORY.md automatically.
2. Ask your agent: "What do you know about me?" — it should respond with your details.
3. Set up cron jobs for morning standup (8 AM) and evening review (6 PM).

## Want to Start from Scratch Instead?

Use the `openclaw-config-blank/` folder. It has the same file structure but with empty templates you can fill in yourself.
