---
name: buzz-scanner
description: Scan market signals, competitor activity, and social buzz for GTM opportunities. Score leads against ICP and surface actionable intelligence. Use when running scheduled market scans, hunting for leads, or monitoring competitor moves.
---

# Buzz Scanner — Market Intelligence Engine

Proactive market intelligence. Scout uses this to find opportunities your human would miss.

## When to Use

- During scheduled market scans (cron job — every 6 hours default)
- When your human asks "find me leads" or "what's happening in the market?"
- When monitoring competitor activity
- During morning briefs

## When NOT to Use

- When drafting outreach messages (that's a conversation, not a scan)
- When the human has already identified a specific lead to pursue
- When doing deep-dive research on a single company (use web search directly)

## Process

### Step 1: Source Scan

Scan multiple signal types in parallel:

**Market Signals** (web search):
```bash
# Using xAI Responses API (if available):
curl -s https://api.x.ai/v1/responses \
  -H "Authorization: Bearer $(cat ~/.config/xai/api_key)" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-4",
    "tools": [{"type": "web_search"}, {"type": "x_search"}],
    "input": "Latest news about [INDUSTRY]: funding rounds, product launches, market shifts, partnerships in the last 48 hours"
  }'
```

**Competitor Activity:**
- Check competitor websites/social for new content, pricing changes, job postings
- Job postings reveal strategy — hiring sales means they're going outbound, hiring engineers means new product

**Social Buzz:**
- X/Twitter: trending topics in your industry via x_search
- LinkedIn: thought leader posts, industry discussion threads

**Important:** xAI Responses API can take 30-90 seconds. Use long timeouts.

### Step 2: ICP Scoring

Load `knowledge/icp.md` and score each lead/signal:

| Dimension | Weight | Score (0-10) |
|-----------|--------|-------------|
| Industry match | 25% | |
| Company size match | 20% | |
| Pain point alignment | 25% | |
| Timing signals | 15% | |
| Budget indicators | 15% | |

**Threshold:** Only report leads scoring 7.0+ overall.

### Step 3: Framework Application

Apply relevant frameworks from `knowledge/influencer-frameworks.md`:

**Hormozi Value Equation:**
- Dream Outcome × Perceived Likelihood ÷ (Time Delay × Effort/Sacrifice)
- Does this opportunity score high on the value equation?

**Growth Experiment Format:**
- Hypothesis: [what we think will happen]
- Test: [what we'll do]
- Metric: [how we'll measure]
- Expected impact: [revenue/lead impact]
- Effort: [low / medium / high]

### Step 4: Deliver

Send to Telegram:

```
🔍 **Market Intelligence** — [DATE]

**1. [LEAD/SIGNAL]** — ICP Score: [X]/10
Company: [name, size, stage]
Signal: [what caught Scout's attention]
Why now: [timing factor]
Action: [recommended next step]
📋 Source: [where this came from] | Cost: $[X.XX]

**2. [LEAD/SIGNAL]** — ICP Score: [X]/10
...

**Market Pulse:**
- [1-line trend summary]
- [competitor move if any]

💰 Scan cost: $[total] | Daily spend: $[X.XX]/$[limit]

Reply with a number for deep dive, or "skip all"
```

## Transparency Log

**Every scan MUST log to the daily note:**

```
📋 BUZZ SCAN — [TIME]
Sources checked: [list]
Signals found: [count]
Leads above threshold: [count]
API cost: $[X.XX]
Top signal: [1-line summary]
```

## Cron Setup

```json
{
  "name": "buzz-scan",
  "schedule": { "kind": "cron", "expr": "0 */6 * * *", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "text": "Run the buzz-scanner skill. Scan market signals, competitor activity, and social buzz. Score leads against ICP. Deliver top opportunities with full transparency logs.",
    "timeoutSeconds": 300
  },
  "delivery": { "channel": "telegram", "to": "YOUR_CHAT_ID", "mode": "announce" }
}
```
