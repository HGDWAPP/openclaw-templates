# BOOTSTRAP.md — Scout First-Run Setup

Complete this checklist before enabling heartbeats or cron jobs.
Heartbeats cost money on every cycle — don't run them before setup is done.

Scout will walk through this checklist on first conversation. Once complete, **delete this file**.

---

## Step 1: Set Your Model

Scout works best on Claude. Set in OpenClaw settings:

```
Model: anthropic/claude-sonnet-4-5
```

Market analysis and lead scoring need a capable model. Don't use cheap/mini models.

## Step 2: Create Memory Structure

```bash
mkdir -p memory
mkdir -p knowledge
touch MEMORY.md
echo "# $(date +%Y-%m-%d)" > "memory/$(date +%Y-%m-%d).md"
```

## Step 3: Fill Out Your Knowledge Base

These files are what make Scout smart about YOUR market:

- **`knowledge/icp.md`** — Your Ideal Customer Profile (who you're selling to, what makes a great lead)
- **`knowledge/influencer-frameworks.md`** — Growth frameworks you follow (Hormozi, Koerner, etc.)
- **`USER.md`** — Your business details, goals, security preferences, decision framework

**Don't skip this!** Without ICP data, Scout can't score leads. Without frameworks, he can't evaluate opportunities.

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
  "name": "scout-heartbeat",
  "schedule": { "kind": "every", "everyMs": 1800000 },
  "sessionTarget": "main",
  "payload": {
    "kind": "systemEvent",
    "text": "Heartbeat: run through HEARTBEAT.md checklist."
  }
}
```

## Step 6: Set Up Market Intelligence Cron Jobs

```json
{
  "name": "scout-market-scan",
  "schedule": { "kind": "cron", "expr": "0 */6 * * *", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "text": "Run market intelligence scan: check competitor activity, search for ICP-matching leads, monitor industry trends. Score each signal against knowledge/icp.md. Deliver top opportunities with transparency logs.",
    "timeoutSeconds": 300
  },
  "delivery": { "channel": "telegram", "to": "YOUR_CHAT_ID", "mode": "announce" }
}
```

```json
{
  "name": "scout-morning-brief",
  "schedule": { "kind": "cron", "expr": "0 8 * * 1-5", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "main",
  "payload": {
    "kind": "systemEvent",
    "text": "Morning brief: overnight market signals, today's lead pipeline, competitor moves. Under 200 words. Include total API spend from yesterday."
  }
}
```

```json
{
  "name": "scout-competitor-watch",
  "schedule": { "kind": "cron", "expr": "0 12 * * 1-5", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "text": "Competitor watch: check each competitor from knowledge/competitor-landscape.md for new moves — pricing changes, product launches, content, job postings. Only report if something changed.",
    "timeoutSeconds": 300
  },
  "delivery": { "channel": "telegram", "to": "YOUR_CHAT_ID", "mode": "announce" }
}
```

Replace `YOUR_TIMEZONE` and `YOUR_CHAT_ID` with your values.

## Step 7: Verify Everything Works

Ask Scout:
1. **"What's my ICP?"** → Should reference knowledge/icp.md
2. **"Find me 3 leads"** → Should search and score against your ICP
3. **"What are my competitors doing?"** → Should check for activity
4. **"Run through your heartbeat"** → Should complete without errors
5. **"Show me your transparency log"** → Should show recent actions with costs

---

## After Setup

Once all steps complete: **"Bootstrap is done, delete BOOTSTRAP.md"**

Scout will delete this file and switch to normal operating mode.
