# HEARTBEAT.md — Scout

Scout runs through this checklist on every heartbeat cycle.

**Output Rules:**
- DEFAULT: reply `HEARTBEAT_OK` and nothing else. Expected for ~80% of heartbeats.
- Break silence ONLY for: high-value lead detected, competitor made a major move, market shift relevant to current GTM, or system issues.
- NEVER output proof-of-life messages, narration of checks, or lists of things that are fine.
- If you have something to report, keep it under 3 sentences.
- ALWAYS log actions to today's daily note, even when silent.

---

## Pre-Flight Check (ALWAYS run first)

1. If `BOOTSTRAP.md` exists → **STOP.** Reply: "Setup incomplete — run through BOOTSTRAP.md first."
2. Verify `memory/` directory exists. If not: `mkdir -p memory`
3. Verify `knowledge/` directory exists. If not: `mkdir -p knowledge`
4. Verify today's daily note exists (`memory/YYYY-MM-DD.md`). If not: create it.

## Market Signal Check

1. Read today's daily note for signal status
2. Check: have market signals been scanned today?
   - If NO and it's before 2 PM → run a quick scan (top 3 signals only)
   - If YES → check if human has responded to any recommendations
3. Check: any high-priority leads awaiting action?
   - If YES and older than 24 hours → one reminder (not every heartbeat)
4. Log status to daily note with transparency format

## Competitor Monitor

1. Quick check: any competitor activity since last heartbeat?
2. If new activity detected:
   - Evaluate impact on your human's business
   - If significant (pricing change, product launch, strategic pivot) → alert immediately
   - If minor → log and include in next daily summary
3. If nothing new → stay quiet

## Lead Pipeline Health

1. Check today's lead scores and statuses
2. Any leads going cold? (no follow-up in 48h+)
3. Any new ICP-match signals from social/news?
4. Update `knowledge/lead-playbook.md` if patterns emerge

## Cost Tracking

1. Calculate today's API spend so far
2. If approaching daily limit ($5 default) → flag and pause non-essential scans
3. Log cost to daily note:
   ```
   📋 API Spend: $X.XX / $5.00 limit
   Calls: [breakdown by service]
   ```

## Fact Extraction

1. Check for new conversations since last extraction
2. Extract: market insights, lead patterns, competitor intelligence
3. Update relevant knowledge files
4. Update `MEMORY.md` with new operating patterns
5. Log to daily note

## Weekly Review (Fridays only)

1. GTM performance: leads found, leads converted, pipeline health
2. Competitor landscape changes this week
3. Top performing lead sources (what's working?)
4. Growth experiment results and next experiments
5. Total weekly API spend
6. Deliver to Telegram as structured summary
