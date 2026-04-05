# Chad Farquad — Your Marketing Operator

Chad Farquad is a fully configured OpenClaw agent that runs your marketing while you focus on the work that actually needs you. Drop it into your OpenClaw workspace and it's ready to go.

## What Chad Does

- **Task Management** — Kanban board with Doing, Next Up, Blocked, Backlog, Done. Morning standups and evening reviews.
- **Content Drafting** — Writes in your brand voice. Blog posts, social captions, email copy, landing page text.
- **Research** — Deep dives on topics, competitors, trends. Cited sources, not hallucinated facts.
- **Meeting Prep** — Briefing docs before your meetings with agendas, context, and talking points.
- **Email Triage** — Helps you sort, prioritize, and draft responses.
- **Competitor Intel** — Monitors what your competitors are doing — their ads, content, positioning.
- **Social Scheduling** — Plans your content calendar across LinkedIn, Instagram, and Pinterest.
- **Weekly Digest** — Sunday evening summary of the week's wins, patterns, and next week's priorities.

## Quick Start

### 1. Copy to your OpenClaw server

If you're using git:
```bash
sudo -iu openclaw
git clone https://github.com/HGDWAPP/openclaw-templates /tmp/openclaw-setup
cp -r /tmp/openclaw-setup/chadfarquad/* ~/.openclaw/workspace/
cp -r /tmp/openclaw-setup/chadfarquad/.* ~/.openclaw/workspace/ 2>/dev/null
```

Or via scp from your Mac:
```bash
ssh root@YOUR_DROPLET_IP mkdir -p /tmp/openclaw-setup
scp -r chadfarquad/* root@YOUR_DROPLET_IP:/tmp/openclaw-setup/
# Then SSH in and copy as the openclaw user:
ssh root@YOUR_DROPLET_IP
sudo -iu openclaw cp -r /tmp/openclaw-setup/. ~/.openclaw/workspace/
rm -rf /tmp/openclaw-setup
```

### 2. Restart OpenClaw
```bash
sudo -iu openclaw
openclaw restart
```

### 3. Paste Your Command Center

Open Telegram or the Dashboard and paste your AI Command Center from Phase 3. Chad reads it and auto-populates his memory.

### 4. Enable Cron Jobs

Set up morning standup (8 AM), evening review (6 PM), and weekly digest (Sunday 7 PM) in the OpenClaw dashboard under Cron Jobs.

That's it. Chad's running.

## File Structure

```
chadfarquad/
├── README.md          ← You are here
├── SOUL.md            ← Chad's personality and voice
├── IDENTITY.md        ← Who Chad is, daily rhythm
├── AGENTS.md          ← Operating rules, skills registry, memory system
├── MEMORY.md          ← What Chad knows about you (auto-populated)
├── HEARTBEAT.md       ← 30-minute check-in behavior
├── BOOTSTRAP.md       ← First-run setup checklist
└── skills/
    ├── task-board/        ← Kanban task tracking
    ├── morning-standup/   ← 8 AM daily check-in
    ├── evening-review/    ← 6 PM daily wrap-up
    ├── web-researcher/    ← Research with cited sources
    ├── content-drafter/   ← Write in your voice
    ├── meeting-prep/      ← Pre-meeting briefings
    ├── inbox-zero/        ← Email triage and drafting
    ├── competitor-intel/   ← Competitive analysis
    ├── social-scheduler/  ← Social media content planning
    └── weekly-digest/     ← Sunday week summary
```

## Built For

Entrepreneurs, creators, and operators who wear many hats. Designed from onboarding data of 50+ business owners in fashion, wellness, events, e-commerce, media, and tech.

## Inspired By

Felix v11's architecture — three-layer memory, heartbeat cycles, bootstrap pattern. Completely reworked for marketing operations instead of CEO revenue mode.
