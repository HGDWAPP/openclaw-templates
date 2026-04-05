# BOOTSTRAP.md — Atlas First-Run Setup

Complete this checklist before enabling heartbeats or cron jobs.
Heartbeats cost money on every cycle — don't run them before setup is done.

Atlas will walk through this checklist on first conversation. Once complete, **delete this file**.

---

## Step 1: Set Your Model

Atlas works best on Claude. Set in OpenClaw settings:

```
Model: anthropic/claude-sonnet-4-5
```

For complex deal analysis, consider Claude Opus for deeper reasoning. But Sonnet is fine for daily operations.

## Step 2: Create Memory Structure

```bash
mkdir -p memory
mkdir -p knowledge
touch MEMORY.md
echo "# $(date +%Y-%m-%d)" > "memory/$(date +%Y-%m-%d).md"
```

## Step 3: Fill Out Your Knowledge Base

These files are what make Atlas smart about YOUR investment approach:

- **`knowledge/thesis.md`** — Your investment thesis (sectors, stages, check sizes, what you look for)
- **`knowledge/investment-patterns.md`** — Pattern types you track (Parallel, Convergence, Dislocation, Infrastructure)
- **`USER.md`** — Your preferences, decision framework, communication style

**Don't skip this!** Without a thesis, Atlas can't score deals. Without patterns, he can't spot opportunities.

## Step 4: Connect Your Channels

| Integration | Required? | How to Set Up |
|------------|-----------|---------------|
| Anthropic/OpenRouter API | **Required** | Set in OpenClaw auth config |
| Telegram Bot | Recommended | Create via @BotFather, add token in OpenClaw |
| Brave Search API | Recommended | Get key at brave.com/search/api, set as `BRAVE_API_KEY` |
| xAI API | Optional | For X/Twitter market monitoring — get key at x.ai |

## Step 5: Enable Heartbeats

Only after Steps 1-4 are done:

```json
{
  "name": "atlas-heartbeat",
  "schedule": { "kind": "every", "everyMs": 1800000 },
  "sessionTarget": "main",
  "payload": {
    "kind": "systemEvent",
    "text": "Heartbeat: run through HEARTBEAT.md checklist."
  }
}
```

## Step 6: Set Up Investment Intelligence Cron Jobs

```json
{
  "name": "atlas-signal-scan",
  "schedule": { "kind": "cron", "expr": "0 */6 * * *", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "text": "Run investment signal scan: check funding news, market shifts, tech trends. Score signals against knowledge/thesis.md and knowledge/investment-patterns.md. Generate structured proposals for anything above 7.0 conviction. Deliver summary.",
    "timeoutSeconds": 300
  },
  "delivery": { "channel": "telegram", "to": "YOUR_CHAT_ID", "mode": "announce" }
}
```

```json
{
  "name": "atlas-morning-brief",
  "schedule": { "kind": "cron", "expr": "0 8 * * 1-5", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "main",
  "payload": {
    "kind": "systemEvent",
    "text": "Morning brief: overnight funding rounds, market shifts matching thesis, pipeline status, any pattern signals. Under 200 words."
  }
}
```

```json
{
  "name": "atlas-pattern-watch",
  "schedule": { "kind": "cron", "expr": "0 14 * * 1-5", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "text": "Pattern watch: look for emerging patterns across sectors. Check for Parallel plays (success in one industry replicable in another), Convergence signals (two trends meeting), Dislocation events (market shifts creating windows), Infrastructure plays (picks-and-shovels for emerging categories). Only report if a pattern is forming.",
    "timeoutSeconds": 300
  },
  "delivery": { "channel": "telegram", "to": "YOUR_CHAT_ID", "mode": "announce" }
}
```

Replace `YOUR_TIMEZONE` and `YOUR_CHAT_ID` with your values.

## Step 7: Verify Everything Works

Ask Atlas:
1. **"What's my thesis?"** → Should reference knowledge/thesis.md
2. **"Find me opportunities"** → Should search and score against your thesis
3. **"What patterns are you tracking?"** → Should reference investment-patterns.md
4. **"Run through your heartbeat"** → Should complete without errors
5. **"Score this company: [name]"** → Should generate a structured proposal

---

## After Setup

Once all steps complete: **"Bootstrap is done, delete BOOTSTRAP.md"**

Atlas will delete this file and switch to normal operating mode.
