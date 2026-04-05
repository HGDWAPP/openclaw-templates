# HEARTBEAT.md — Atlas

Atlas runs through this checklist on every heartbeat cycle.

**Output Rules:**
- DEFAULT: reply `HEARTBEAT_OK` and nothing else. Expected for ~80% of heartbeats.
- Break silence ONLY for: high-conviction deal signal (7.0+), major market dislocation, thesis-relevant funding round, or system issues.
- NEVER output proof-of-life messages, narration of checks, or lists of things that are fine.
- If you have something to report, keep it under 3 sentences.
- ALWAYS log to today's daily note, even when silent.

---

## Pre-Flight Check (ALWAYS run first)

1. If `BOOTSTRAP.md` exists → **STOP.** Reply: "Setup incomplete — run through BOOTSTRAP.md first."
2. Verify `memory/` directory exists. If not: `mkdir -p memory`
3. Verify `knowledge/` directory exists. If not: `mkdir -p knowledge`
4. Verify today's daily note exists (`memory/YYYY-MM-DD.md`). If not: create it.

## Deal Signal Check

1. Read today's daily note for signal status
2. Check: have deal signals been scanned today?
   - If NO and it's before 2 PM → run a quick scan (funding news, market shifts, thesis-relevant signals)
   - If YES → check if human has responded to any proposals
3. Check: any high-conviction opportunities (7.0+) awaiting decision?
   - If YES and older than 48 hours → one reminder (not every heartbeat)
4. Log status to daily note

## Pattern Monitor

1. Quick check: any new pattern signals since last heartbeat?
2. Cross-reference against `knowledge/investment-patterns.md`:
   - **Parallel:** Success pattern in Industry A appearing in Industry B?
   - **Convergence:** Two tracked trends showing signs of collision?
   - **Dislocation:** Market shift creating a window? (regulatory change, tech breakthrough, platform shift)
   - **Infrastructure:** New category emerging that needs picks-and-shovels?
3. If new pattern forming → alert with early signal data
4. If nothing new → stay quiet

## Pipeline Health

1. Check `knowledge/pipeline.md` (if it exists) for deal statuses
2. Any deals going stale? (no activity in 7+ days)
3. Any follow-up actions overdue?
4. Update pipeline status in daily note

## Market Pulse

1. Quick scan: any thesis-relevant market shifts?
2. Funding round announcements in target sectors?
3. Portfolio-adjacent signals? (competitor to portfolio company raised, partner opportunity)
4. Only surface if actionable — not general market noise

## Fact Extraction

1. Check for new conversations since last extraction
2. Extract: investment preferences, thesis refinements, pattern observations, deal feedback
3. Update relevant knowledge files
4. Update `MEMORY.md` with new operating patterns
5. Log to daily note

## Weekly Review (Fridays only)

1. Pipeline summary: deals sourced, scored, advanced, passed
2. Pattern tracker: which patterns are strengthening, which are fading
3. Market map update: any sector shifts worth noting
4. Thesis performance: are the types of deals we're finding matching what we want?
5. Deliver to Telegram as structured summary
6. Prompt: "Any thesis adjustments for next week?"
