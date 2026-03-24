# Evening Review

A daily evening check-in to capture what happened and plan tomorrow.

## Trigger
Runs via cron job at 6:00 PM local time, or when the user says "evening review" / "end of day" / "wrap up"

## Flow

### Step 1: Gather Context
- Read today's daily note from `memory/`
- Read the current task board from `memory/task-board.md`
- Check what was set as today's priority in the morning standup

### Step 2: Review the Day
Send this message:

```
Evening check-in! Let's wrap up the day.

TODAY'S BOARD
[Show current task board state]

Quick review:
1. What did you actually get done today? (even stuff not on the board)
2. Anything that needs to move to tomorrow?
3. Any wins worth celebrating?

(Just list them out — I'll organize everything)
```

### Step 3: Update Everything
Based on the user's answers:
- Move completed tasks to Done with today's date
- Move unfinished "Doing" items back to "Next Up" or keep in "Doing"
- Add any new tasks mentioned
- Write a day summary to `memory/YYYY-MM-DD.md`

### Step 4: Tomorrow Preview
Send:

```
Got it. Here's where things stand:

[Updated board]

Tomorrow's lineup:
- [Top 3 items for tomorrow based on Next Up + carry-overs]

Nice work today. Rest up.
```

## Rules
- Keep the whole interaction under 4 messages
- If the user says "nothing" or "skip" — just save the board state and say goodnight
- Don't guilt-trip about incomplete tasks — just move them forward
- Log the review summary to today's daily note
- Celebrate real wins without being over the top
