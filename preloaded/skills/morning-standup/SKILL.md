# Morning Standup

A daily morning check-in to set priorities and start the day with clarity.

## Trigger
Runs via cron job at 8:00 AM local time, or when the user says "morning check-in" / "standup" / "what's the plan today"

## Flow

### Step 1: Greet and Context
- Read yesterday's daily note from `memory/` for context
- Read the current task board from `memory/task-board.md`
- Check if any tasks were left in "Doing" from yesterday

### Step 2: Ask Three Questions
Send this message:

```
Good morning! Here's your standup:

YESTERDAY
- [Summary of what was in Done/Doing yesterday]

STILL IN PROGRESS
- [Tasks still in Doing from yesterday]

Three quick questions:
1. What's your #1 priority today?
2. Anything blocking you right now?
3. Any new tasks to add?

(Reply with just the answers, or say "skip" to keep yesterday's plan)
```

### Step 3: Update the Board
Based on the user's answers:
- Move yesterday's "Doing" items to Done if completed
- Set today's priority as the first item in "Doing"
- Add any new blockers to "Blocked"
- Add any new tasks to the appropriate column
- Save updated board to `memory/task-board.md`

### Step 4: Confirm
Send the updated board and a one-line encouragement. Keep it genuine, not cheesy.

## Rules
- Keep the whole interaction under 4 messages
- If the user says "skip" — keep everything as-is and just show the board
- If the user hasn't responded in 2 hours, don't follow up — they're busy
- Log the standup summary to today's daily note
