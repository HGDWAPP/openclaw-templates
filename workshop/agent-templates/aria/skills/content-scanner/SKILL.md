---
name: content-scanner
description: Scan industry sources for thought leadership content opportunities. Surface the best angles for your brand across X and LinkedIn. Use when running scheduled content scans, when asked "what should I post?", or when a trending topic might be relevant.
---

# Content Scanner — Find What's Worth Posting

Proactive content intelligence. Aria uses this to find content opportunities you'd miss.

## When to Use

- During scheduled content scans (cron job — every 6 hours default)
- When your human asks "what should I post about?"
- When a trending topic might be relevant to their niche
- During morning briefs and evening recaps

## When NOT to Use

- When drafting a specific post (that's a conversation, not a scan)
- When reviewing team deliverables (use feedback-patterns.md for that)
- When the human has already told you what to write

## Process

### Step 1: Source Scan

Use web search (Brave API or xAI Responses API) to scan:
- Industry news sites relevant to the human's niche
- Competitor content on LinkedIn and X (if xpost CLI available)
- Trending topics on X in the human's industry
- Relevant newsletters and publications

**Using xAI Responses API (if available):**
```bash
curl -s https://api.x.ai/v1/responses \
  -H "Authorization: Bearer $(cat ~/.config/xai/api_key)" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-4",
    "tools": [{"type": "web_search"}, {"type": "x_search"}],
    "input": "Latest news and trending discussions about [INDUSTRY/TOPIC] in the past 24 hours"
  }'
```

**Using Brave Search (if available):**
```bash
curl -s "https://api.search.brave.com/res/v1/web/search?q=[QUERY]&count=10&freshness=pd" \
  -H "Accept: application/json" \
  -H "X-Subscription-Token: $BRAVE_API_KEY"
```

**Important:** xAI Responses API can take 30-90 seconds. Use long timeouts.

### Step 2: Signal Scoring

For each finding, score on three dimensions:
- **Relevance** to the human's brand and expertise (0-10)
- **Timeliness** — is this trending NOW or still developing? (0-10)
- **Angle potential** — can they add a unique take? (0-10)

**Threshold:** Only report signals scoring 20+ out of 30.

Cross-reference against `knowledge/voice-samples.md` — does this topic align with what they've posted about before? Bonus points for topics that extend their existing threads.

### Step 3: Draft Angles

For each qualifying signal, draft:
- **Hook** — first line that stops the scroll (study hooks from voice-samples.md)
- **Key insight** — the human's unique angle on this topic
- **CTA** — what should the reader do?
- **Platform recommendation** — X (punchy, thread-friendly) vs LinkedIn (professional, longer form) vs both

### Step 4: Deliver

Send to Telegram using this format:

```
🎯 **Content Opportunities** — [DATE]

**1. [TOPIC]** — Score: [X]/30
Hook: "[draft first line]"
Angle: [what makes this YOUR take]
Platform: [X / LinkedIn / both]
Status: Draft ready / Needs your angle

**2. [TOPIC]** — Score: [X]/30
Hook: "[draft first line]"
Angle: [your unique perspective]
Platform: [X / LinkedIn / both]

Reply with a number to develop into full draft, or "skip all"
```

## Voice Notes

- Match the human's voice from `knowledge/voice-samples.md` and `knowledge/feedback-patterns.md`
- Prioritize contrarian or insight-driven angles over news reporting
- Quality > quantity — 2 great opportunities beats 5 mediocre ones
- If nothing clears the 20/30 threshold, say so: "Nothing worth posting today. Checked [X] sources."
- Never pad the list with weak signals just to have something to report

## Cron Setup

```json
{
  "name": "content-scan",
  "schedule": { "kind": "cron", "expr": "0 */6 * * *", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "text": "Run the content-scanner skill. Scan industry news, competitor content, and trending topics. Score and deliver top opportunities.",
    "timeoutSeconds": 300
  },
  "delivery": { "channel": "telegram", "to": "YOUR_CHAT_ID", "mode": "announce" }
}
```
