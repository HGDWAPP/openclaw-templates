---
name: signal-scanner
description: Scan funding rounds, market news, and tech trends for investment signals. Score opportunities against thesis and pattern library. Generate structured proposals for high-conviction matches. Use when running scheduled signal scans, evaluating deal flow, or hunting for thesis-matching opportunities.
---

# Signal Scanner — Investment Intelligence Engine

Proactive deal flow intelligence. Atlas uses this to find opportunities you'd miss.

## When to Use

- During scheduled signal scans (cron job — every 6 hours default)
- When your human asks "find me opportunities" or "what's happening in [sector]?"
- When evaluating a specific company or deal
- During morning briefs and pattern watches

## When NOT to Use

- When doing deep due diligence on a specific deal (that needs dedicated research)
- When the human has already decided to pursue a deal
- When updating pipeline status (just edit knowledge/pipeline.md directly)

## Process

### Step 1: Signal Gathering

Scan multiple signal sources:

**Funding & Deals** (web search):
```bash
# Using xAI Responses API (if available):
curl -s https://api.x.ai/v1/responses \
  -H "Authorization: Bearer $(cat ~/.config/xai/api_key)" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-4",
    "tools": [{"type": "web_search"}, {"type": "x_search"}],
    "input": "Recent funding rounds, acquisitions, and investment news in [SECTOR] in the past 48 hours. Include round size, stage, investors, and company details."
  }'
```

**Market Shifts:**
- Regulatory changes affecting target sectors
- Platform shifts (new API launches, pricing changes from big tech)
- Technology breakthroughs (papers, launches, demos)

**Social Signals:**
- Founder activity on X (building in public, hiring posts)
- Investor discussions (what's getting attention)
- Community buzz in niche tech forums

**Important:** xAI Responses API can take 30-90 seconds. Use long timeouts.

### Step 2: Thesis Scoring

Load `knowledge/thesis.md` and score each signal:

| Dimension | Weight | Score (0-10) |
|-----------|--------|-------------|
| Sector match | 20% | Does this fit our target sectors? |
| Stage match | 15% | Right stage for our check size? |
| Team quality | 20% | Technical founders? Domain expertise? |
| Market timing | 15% | Why now? Is the window open? |
| Traction signals | 15% | ARR, users, growth rate? |
| Thesis alignment | 15% | Does this match our specific thesis? |

**Threshold:** Only generate full proposals for signals scoring **7.0+** overall.
Signals scoring 5.0-6.9 go in the daily summary as "watching."
Below 5.0 → logged and forgotten.

### Step 3: Pattern Classification

For each qualifying signal, classify the pattern type:

- **The Parallel:** "[Company] is doing to [Industry B] what [Success] did to [Industry A]"
  - Evidence: similar market dynamics, comparable customer pain, proven playbook
- **The Convergence:** "Two trends ([Trend A] + [Trend B]) are creating [New Category]"
  - Evidence: both trends maturing simultaneously, early adopters emerging
- **The Dislocation:** "[Market shift] is creating a [timeframe] window for [opportunity]"
  - Evidence: regulatory change, platform shift, incumbent weakness
- **The Infrastructure Play:** "[Emerging category] needs [picks-and-shovels]"
  - Evidence: category growing fast, tooling is still primitive, horizontal opportunity

### Step 4: Proposal Generation (for 7.0+ signals)

Generate a structured proposal:

```
## 🗺️ DEAL SIGNAL — [Company Name]

**Conviction Score:** [X.X]/10
**Pattern Type:** [Parallel / Convergence / Dislocation / Infrastructure]

### Company Snapshot
- **What they do:** [1 sentence]
- **Stage:** [stage + round info if raising]
- **Founded:** [year] | **Team:** [size]
- **Founders:** [names + relevant background]
- **Traction:** [ARR/users/growth — label estimates clearly]

### Thesis Match
- ✅ [dimension]: [how it matches]
- ✅ [dimension]: [how it matches]  
- ⚠️ [dimension]: [partial match or concern]
- ❌ [dimension]: [miss — if any]

### The Pattern
[2-3 sentences explaining the pattern and why it matters]

### Risk Flags
1. [risk + severity: low/medium/high]
2. [risk + severity]

### Timing Assessment
[Why now? What's the window? How urgent?]

### Recommended Action
[Pass / Monitor / Research deeper / Request intro]
```

### Step 5: Deliver

Send to Telegram:

```
🗺️ **Investment Signals** — [DATE]

**1. [Company]** — Conviction: **[X.X]/10** ([Pattern Type])
[1-line summary]
Action: [Pass / Monitor / Research / Intro]

**2. [Company]** — Conviction: **[X.X]/10** ([Pattern Type])
[1-line summary]
Action: [Pass / Monitor / Research / Intro]

**Watching:** [names of 5.0-6.9 signals, 1 line each]

**Market Pulse:** [1-2 lines on sector trends]

Reply with a number for full proposal, or "skip all"
```

## Data Integrity Rules

- **NEVER** present estimated numbers as verified. Always label: "~$5M ARR (estimated from headcount)" 
- **NEVER** fabricate traction data. If you can't find it, say "traction data unavailable"
- **ALWAYS** cite your source for key claims
- Round sizes, valuations, and ARR numbers should come from verified sources when possible

## Cron Setup

```json
{
  "name": "signal-scan",
  "schedule": { "kind": "cron", "expr": "0 */6 * * *", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "text": "Run the signal-scanner skill. Scan funding news, market shifts, and social signals. Score against thesis and pattern library. Generate structured proposals for 7.0+ conviction matches. Deliver summary.",
    "timeoutSeconds": 300
  },
  "delivery": { "channel": "telegram", "to": "YOUR_CHAT_ID", "mode": "announce" }
}
```
