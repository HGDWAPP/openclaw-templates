# Weekly Digest

Generate a weekly summary of tasks completed, progress made, and the week ahead.

## Trigger
Runs via cron job on Sunday at 7:00 PM, or when the user says "weekly digest" / "weekly summary" / "what did I do this week"

## Flow

### Step 1: Gather Data
1. Read all daily notes from the past 7 days (`memory/YYYY-MM-DD.md`)
2. Read the current task board from `memory/task-board.md`
3. Count tasks completed (moved to Done) this week
4. Identify tasks that have been in "Doing" or "Blocked" for more than 3 days

### Step 2: Generate Digest
Format:

```
WEEKLY DIGEST: [Date range]

WINS THIS WEEK
- [Task completed] (date)
- [Task completed] (date)
- [Task completed] (date)
Total: [N] tasks completed

STILL IN PROGRESS
- [Task] — [days in progress]
- [Task] — [days in progress]

BLOCKED ITEMS
- [Task] — waiting on: [what] ([days blocked])

PATTERNS I NOTICED
- [Observation about their week — e.g., "You were most productive on Tuesday and Wednesday"]
- [Observation — e.g., "3 tasks got blocked waiting on client responses"]

NEXT WEEK PREVIEW
Based on your backlog and carry-overs:
1. [Suggested priority]
2. [Suggested priority]
3. [Suggested priority]

Keep going. You got this.
```

### Step 3: Save
Save the digest to `memory/digests/week-of-[date].md`

## Rules
- Keep the digest scannable — no walls of text
- "Patterns I Noticed" should be genuinely useful observations, not filler
- If it was a slow week, don't make it sound worse than it is — just note it neutrally
- If it was a big week, acknowledge it genuinely
- Always suggest 3 priorities for next week based on the backlog
- Include the digest in the Sunday evening message on Telegram
