# OpenClaw Templates  

Ready-to-use workspace configurations for OpenClaw. Drop one into your server and start talking to your agent immediately.

## What's Inside

### `preloaded/` — Chief of Staff (Recommended)
Fully configured Chief of Staff agent with 8 skills:
- Task board (kanban), morning standup, evening review
- Web researcher, content drafter, meeting prep
- File organizer, weekly digest

Designed for the HGDW curriculum. Paste your AI Command Center and it auto-populates.

### `chadfarquad/` — Marketing Operator
Fully configured marketing automation agent with 10 skills:
- Task board, morning standup, evening review, weekly digest
- Content drafter, social scheduler, competitor intel
- Web researcher, meeting prep, inbox zero

Built for entrepreneurs, creators, and operators who wear many hats. Reads your Command Center and runs your marketing.

### `blank/` — Start From Scratch
Empty workspace scaffolding with placeholder files. For those who want to build their own agent from the ground up.

### `workshop/` — Build Your AI Command Center (5-Hour Workshop)
Complete workshop resource pack with course materials and 3 specialist agent templates:

**Course Materials:**
- `01-CURRICULUM.md` — Full 5-hour workshop curriculum (5 sessions)
- `02-FACILITATOR-GUIDE.md` — Facilitator scripts, timing, energy cues
- `03-SLIDES.md` / `03-SLIDES.html` — Slide deck (markdown + interactive HTML)
- `04-PARTICIPANT-RESOURCES.md` — Worksheets, cheat sheets, templates
- `05-AGENT-PROMPTS.md` — Copy-paste prompts to install and configure each agent
- `end-to-end-guide.md` — Full deployment walkthrough (server to proactive agent)

**Specialist Agent Templates:**
- **Aria** — Brand Strategist & Content Intelligence (scans news, drafts in your voice, pre-screens work)
- **Scout** — GTM Intelligence & Market Strategist (scans markets, scores leads, tracks competitors)
- **Atlas** — Investment Intelligence & Opportunity Engine (scans signals, matches patterns, scored proposals)

Each template includes: IDENTITY.md, SOUL.md, USER.md, AGENTS.md, BOOTSTRAP.md, HEARTBEAT.md, a proactive scanning skill, and knowledge file templates.

## Quick Install

SSH into your server, then:

```bash
sudo -iu openclaw
git clone https://github.com/jdanjohnson/openclaw-templates /tmp/openclaw-setup

# Choose ONE:
# Option A: Chief of Staff (recommended for course)
cp -r /tmp/openclaw-setup/preloaded/* ~/.openclaw/workspace/

# Option B: Marketing Operator
cp -r /tmp/openclaw-setup/chadfarquad/* ~/.openclaw/workspace/

# Option C: Blank slate
cp -r /tmp/openclaw-setup/blank/* ~/.openclaw/workspace/

# Option D: Workshop specialist agent (pick one: aria, scout, or atlas)
cp -r /tmp/openclaw-setup/workshop/agent-templates/aria/* ~/.openclaw/workspace/

# Then restart
openclaw restart
```

## After Install

1. Open Telegram or the Dashboard
2. Paste your AI Command Center from Phase 3
3. The agent reads it and auto-populates its memory
4. Set up cron jobs for morning standup (8 AM), evening review (6 PM), and weekly digest (Sunday 7 PM)

## Part of

[Hot Girls Don't Work](https://github.com/jdanjohnson/hgdw-curriculum) — 5-Week AI Intensive, Phase 4: OpenClaw Mastery
