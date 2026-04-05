# BOOTSTRAP.md — Aria First-Run Setup

Complete this checklist before enabling heartbeats or cron jobs.
Heartbeats cost money on every cycle — don't run them before setup is done.

Aria will walk through this checklist on first conversation. Once complete, **delete this file**.

---

## Step 1: Set Your Model

Aria works best on Claude. Set in OpenClaw settings:

```
Model: anthropic/claude-sonnet-4-5
```

Do NOT use cheap/mini models as default. Content quality analysis and voice matching need a capable model.

**Why this matters:** Cheaper models generate generic-sounding content. For brand voice matching and content quality scoring, you need a model that can hold nuance.

## Step 2: Create Memory Structure

Run this in your terminal (or ask Aria to do it):

```bash
mkdir -p memory
mkdir -p knowledge
touch MEMORY.md
echo "# $(date +%Y-%m-%d)" > "memory/$(date +%Y-%m-%d).md"
```

This creates:
- `memory/` — where daily notes go (one file per day)
- `knowledge/` — where your brand knowledge lives
- `MEMORY.md` — where Aria stores learned patterns about you

## Step 3: Fill Out Your Knowledge Base

These files are what make Aria smart about YOUR brand. Without them, she's generic.

- **`knowledge/feedback-patterns.md`** — Your recurring feedback notes, quality bar, brand voice rules
- **`knowledge/voice-samples.md`** — Links to 3-5 of your best posts (Aria studies these to match your voice)
- **`USER.md`** — Your business details, goals, communication preferences, decision framework

**Don't skip this!** This is the difference between a generic chatbot and a brand strategist who knows your business.

## Step 4: Connect Your Channels

| Integration | Required? | How to Set Up |
|------------|-----------|---------------|
| Anthropic/OpenRouter API | **Required** | Set in OpenClaw auth config |
| Telegram Bot | Recommended | Create via @BotFather, add token in OpenClaw |
| Brave Search API | Optional | Get key at brave.com/search/api, set as `BRAVE_API_KEY` |
| xAI API | Optional | For X/Twitter search — get key at x.ai |

## Step 5: Enable Heartbeats

Only after Steps 1-4 are done:

```json
{
  "name": "aria-heartbeat",
  "schedule": { "kind": "every", "everyMs": 1800000 },
  "sessionTarget": "main",
  "payload": {
    "kind": "systemEvent",
    "text": "Heartbeat: run through HEARTBEAT.md checklist."
  }
}
```

Start at every 30 minutes. Adjust after you see how it works.

## Step 6: Set Up Content Cron Jobs

```json
{
  "name": "aria-content-scan",
  "schedule": { "kind": "cron", "expr": "0 */6 * * *", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "text": "Run content scan: search industry news, competitor content, trending topics in my space. Score each for relevance, timeliness, and angle potential. For top 3 signals, draft post angles with hook + key point + platform. Deliver summary.",
    "timeoutSeconds": 300
  },
  "delivery": { "channel": "telegram", "to": "YOUR_CHAT_ID", "mode": "announce" }
}
```

```json
{
  "name": "aria-morning-brief",
  "schedule": { "kind": "cron", "expr": "30 7 * * 1-5", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "main",
  "payload": {
    "kind": "systemEvent",
    "text": "Morning brief: today's content opportunities, any pending team reviews, yesterday's content performance. Under 200 words."
  }
}
```

```json
{
  "name": "aria-evening-recap",
  "schedule": { "kind": "cron", "expr": "0 18 * * 1-5", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "main",
  "payload": {
    "kind": "systemEvent",
    "text": "Evening recap: content published today, performance snapshot, tomorrow's angles. Flag any pending reviews."
  }
}
```

Replace `YOUR_TIMEZONE` with your timezone (e.g., `Asia/Jerusalem`, `America/New_York`).
Replace `YOUR_CHAT_ID` with your Telegram chat ID.

## Step 7: Verify Everything Works

Ask Aria these questions to confirm setup:
1. **"What do you know about me?"** → Should reference USER.md
2. **"What's in my feedback pattern library?"** → Should reference knowledge files
3. **"Run a content scan"** → Should search web and return structured results
4. **"Run through your heartbeat"** → Should complete without errors

If any fail, check that the files exist and have content.

---

## After Setup

Once all steps complete: **"Bootstrap is done, delete BOOTSTRAP.md"**

Aria will delete this file and switch to normal operating mode.
