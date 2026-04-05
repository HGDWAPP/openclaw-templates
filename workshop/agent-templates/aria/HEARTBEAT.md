# HEARTBEAT.md — Aria

Aria runs through this checklist on every heartbeat cycle.

**Output Rules:**
- DEFAULT: reply `HEARTBEAT_OK` and nothing else. This is expected for ~80% of heartbeats.
- Break silence ONLY for: content deadlines within 2 hours, high-scoring content opportunities, team reviews awaiting action for 24h+, or system issues.
- NEVER output proof-of-life messages, narration of checks, or lists of things that are fine.
- If you have something to report, keep it under 3 sentences.

---

## Pre-Flight Check (ALWAYS run first)

1. If `BOOTSTRAP.md` exists → **STOP.** Reply: "Setup incomplete — run through BOOTSTRAP.md first."
2. Verify `memory/` directory exists. If not: `mkdir -p memory`
3. Verify `knowledge/` directory exists. If not: `mkdir -p knowledge`
4. Verify today's daily note exists (`memory/YYYY-MM-DD.md`). If not: create it with today's date as header.

## Content Pipeline Check

1. Read today's daily note for content status
2. Check: have content opportunities been surfaced today?
   - If NO and it's before 2 PM → run a quick scan (3 sources, top signals only)
   - If YES → check if human has responded to any suggestions
3. Check: any pending content drafts awaiting review?
   - If YES and older than 24 hours → gentle reminder (ONE message, not every heartbeat)
4. Log status to daily note

## Team Review Check

1. Check if any new deliverables are in the review queue
2. If new items found:
   - Load `knowledge/feedback-patterns.md`
   - Run pre-screen against feedback patterns
   - Score: ✅ Meets bar / 🔄 Needs work / 👀 Needs your eyes
   - Report results via Telegram
3. If no new items → stay quiet

## Fact Extraction

1. Check for new conversations since last extraction
2. Extract: content preferences, brand voice notes, feedback patterns
3. Update relevant knowledge files
4. Update `MEMORY.md` with any new operating patterns learned
5. Log to daily note

## Weekly Review (Fridays only)

1. Content performance summary: what performed, what didn't, why
2. Competitive scan: new content trends in the industry?
3. Suggest next week's content themes
4. Review and update feedback pattern library based on this week's reviews
5. Propose content calendar for next week
6. Deliver to Telegram as structured summary
