# OpenClaw Config — Blank Template

This is an **empty workspace template** for your OpenClaw agent. Use this if you want to build your agent's personality and configuration from scratch.

If you want a fully configured Chief of Staff that works out of the box, use `openclaw-config/` instead.

## What's Inside

Every file has the correct structure but with empty sections for you to fill in.

| File | What You Define |
|------|----------------|
| `SOUL.md` | Your agent's personality, voice, tone, and boundaries |
| `MEMORY.md` | Facts about you — name, projects, preferences |
| `AGENTS.md` | Behavior rules, installed skills, safety boundaries |
| `HEARTBEAT.md` | What your agent checks every 30 minutes |
| `IDENTITY.md` | Agent role, mission, and daily rhythm |
| `skills/` | 8 empty skill folders — add your own SKILL.md files |

## How to Install

### Step 1: Upload the files to your server

From your laptop (not on the server), run:

```bash
ssh root@YOUR_DROPLET_IP mkdir -p /tmp/openclaw-setup
scp -r openclaw-config-blank/* root@YOUR_DROPLET_IP:/tmp/openclaw-setup/
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

### Step 4: Copy skills and create the memory directory

```bash
sudo -iu openclaw mkdir -p /home/openclaw/.openclaw/workspace/skills
sudo -iu openclaw cp -r /tmp/openclaw-setup/skills/. /home/openclaw/.openclaw/workspace/skills/
sudo -iu openclaw mkdir -p /home/openclaw/.openclaw/workspace/memory
```

### Step 5: Restart

```bash
sudo systemctl restart openclaw
```

### Step 6: Clean up

```bash
rm -rf /tmp/openclaw-setup
```

## After Installing

1. Open each workspace file with nano and fill in your own content:
   ```bash
   sudo -iu openclaw nano /home/openclaw/.openclaw/workspace/SOUL.md
   ```
2. Write SKILL.md files for any skills you want to add under `skills/`.
3. Restart after making changes: `sudo systemctl restart openclaw`

## Want a Pre-Configured Agent Instead?

Use the `openclaw-config/` folder. It comes with a fully configured Chief of Staff personality, 8 working skills, and task management built in. Just install and go.
