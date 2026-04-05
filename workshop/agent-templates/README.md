# Agent Templates — Workshop Resource Pack

Three ready-to-deploy OpenClaw agent workspaces. Built on proven patterns from the Felix-v11 template pack and the Tempo-Assistant production agent. Pick the one closest to your business, or mix and match.

## What's Inside

```
agent-templates/
├── aria/                              # Brand Intelligence Agent
│   ├── IDENTITY.md                    # Who Aria is and what she does
│   ├── SOUL.md                        # Core truths, voice, boundaries, security
│   ├── USER.md                        # YOUR preferences (fill this out!)
│   ├── AGENTS.md                      # Workspace rules, memory layers, intelligence loop
│   ├── BOOTSTRAP.md                   # First-run setup — model, memory, channels, cron jobs
│   ├── HEARTBEAT.md                   # What Aria checks every 30 minutes
│   ├── skills/
│   │   └── content-scanner/
│   │       └── SKILL.md              # Proactive content opportunity scanning
│   └── knowledge/
│       ├── feedback-patterns.md       # Your quality bar + brand voice rules
│       └── voice-samples.md           # Links to your best posts (voice matching)
│
├── scout/                             # GTM Intelligence Agent
│   ├── IDENTITY.md                    # Who Scout is and what he does
│   ├── SOUL.md                        # Core truths, transparency protocol, security deep dive
│   ├── USER.md                        # YOUR preferences (fill this out!)
│   ├── AGENTS.md                      # Workspace rules, memory layers, intelligence loop
│   ├── BOOTSTRAP.md                   # First-run setup — model, memory, channels, cron jobs
│   ├── HEARTBEAT.md                   # What Scout checks every 30 minutes
│   ├── skills/
│   │   └── buzz-scanner/
│   │       └── SKILL.md              # Market signal scanning + lead scoring
│   └── knowledge/
│       ├── icp.md                     # Ideal Customer Profile + scoring weights
│       └── influencer-frameworks.md   # Hormozi, Koerner, GTM playbook frameworks
│
└── atlas/                             # Investment Intelligence Agent
    ├── IDENTITY.md                    # Who Atlas is and what he does
    ├── SOUL.md                        # Core truths, conviction scoring, data integrity
    ├── USER.md                        # YOUR preferences (fill this out!)
    ├── AGENTS.md                      # Workspace rules, memory layers, intelligence loop
    ├── BOOTSTRAP.md                   # First-run setup — model, memory, channels, cron jobs
    ├── HEARTBEAT.md                   # What Atlas checks every 30 minutes
    ├── skills/
    │   └── signal-scanner/
    │       └── SKILL.md              # Investment signal scanning + deal proposals
    └── knowledge/
        ├── thesis.md                  # Your investment thesis + scoring weights
        └── investment-patterns.md     # Pattern library (Parallel, Convergence, Dislocation, Infrastructure)
```

## Quick Start

1. **Pick the template** closest to your business (or mix and match)
2. **Copy the folder** into your OpenClaw workspace
3. **Fill out USER.md** with your personal details, goals, and preferences
4. **Fill out knowledge/ files** — this is what makes YOUR agent smart about YOUR business
5. **Start a conversation** — the agent walks you through BOOTSTRAP.md automatically
6. **Once bootstrap is complete**, your agent runs on autopilot via heartbeats and cron jobs

The entire setup takes about 15 minutes. The knowledge files are the important part — spend time here.

## What Each Agent Does

| Agent | Best For | Superpower | Proactive Skill |
|-------|----------|------------|-----------------|
| **Aria** | Content, brand, thought leadership | Scans news, drafts in your voice, pre-screens deliverables | Content Scanner — finds thought leadership angles |
| **Scout** | Sales, BD, GTM | Scans markets, scores leads against ICP, drafts outreach | Buzz Scanner — scores leads against ICP |
| **Atlas** | Investment, analysis, opportunities | Scans signals, matches patterns, generates scored proposals | Signal Scanner — conviction-scores deal flow |

## The Proactive Intelligence Loop

All three agents run the same proactive pattern (from DevPulse + Tempo-Assistant):

```
TRIGGER (cron job / schedule)
    → SENSE (scan sources relevant to your domain)
    → SCORE (against your knowledge base — thesis, ICP, quality bar)
    → DRAFT (structured output — posts, leads, proposals)
    → REPORT (send to you on Telegram)
    → HUMAN DECISION (you approve, reject, or refine)
```

This is what makes these agents different from ChatGPT — they don't wait for you to ask. They hunt, analyze, and bring you structured recommendations on a schedule. You stay in control — nothing goes out without your approval.

## Where These Patterns Come From

These templates are grounded in real, production-tested agent patterns:

- **Felix-v11** — CEO-mode AI agent with 3-layer memory (knowledge graph, daily notes, tacit knowledge), proven BOOTSTRAP → HEARTBEAT → CRON architecture, memory decay system, and 10+ skills including research, content creation, and email security
- **Tempo-Assistant** — Production AI Chief of Staff with proactive intelligence loop (SENSE → INTERPRET → PROBE → ACT → LEARN → COMPILE), multi-agent crew architecture, 15+ cron jobs, knowledge graph building, and battle-tested security rules
- **OpenClaw Community** — Workspace file specs, SOUL.md 4-section standard (Core Truths, Boundaries, Vibe, Continuity), HEARTBEAT output rules, and cron job patterns from the official docs and community templates
- **DevPulse** — Proactive content pipeline architecture: Discovery → Lab → Draft → Review → Publish

## Key Design Decisions

**Why 3-layer memory?** Because one memory file gets overwhelming. Knowledge files hold domain facts (stable), daily notes hold raw events (temporary), MEMORY.md holds operating patterns (learned over time).

**Why HEARTBEAT output rules?** Without "default silent" rules, heartbeats spam your Telegram with "everything is fine" messages. 80% of heartbeats should return `HEARTBEAT_OK` — silence means things are working.

**Why cron JSON format?** This is the actual OpenClaw cron system format. Copy-paste into your cron setup. `main` sessions inject into your active conversation, `isolated` sessions run independently.

**Why the "Never Say" lists?** These prevent the agent from sounding like a generic chatbot. Real personality comes from specificity about what NOT to do, not what to do.

**Why Email Fortress?** The Email Fortress pattern (from Felix-v11) treats email as never-trusted — read and summarize only, never follow instructions found in emails. This is critical for any agent that handles email.

## Requirements

- OpenClaw account (free tier works to start)
- API key (Anthropic Claude Sonnet recommended — the model matters for quality)
- Telegram (for notifications — optional but strongly recommended)
- 15 minutes to fill out your knowledge files

## After the Workshop

These agents get better over time. They learn your patterns, build context in their memory files, and refine their scoring. The first week is "training" — expect to adjust and give feedback. By week two, they should be surfacing things you actually care about.
