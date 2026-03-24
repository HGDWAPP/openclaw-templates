---
name: evening-review
description: Run the evening review at 6 PM. Wrap up the day, update the task board, and send a summary.
---

# Evening Review — 6 PM Daily Wrap-Up

Chad runs this every evening to close out the day and set up tomorrow.

## Process

### 1. Read Today's Daily Note
```bash
cat memory/$(date +%Y-%m-%d).md
```

### 2. Read the Task Board
```bash
cat memory/task-board.md
```

### 3. Assess the Day

- What moved from DOING to DONE today?
- What's still in DOING (carrying over)?
- Were there any new tasks added today?
- Any blockers that emerged?

### 4. Update the Task Board

- Move completed tasks to DONE with today's date
- Move stale DOING items to NEXT UP or BLOCKED (with reason)
- Suggest what should be in DOING tomorrow

### 5. Update Today's Daily Note

Add an evening section to `memory/YYYY-MM-DD.md`:

```markdown
## Evening Review
- Completed: [list]
- Carried over: [list]
- New for tomorrow: [list]
- Notes: [anything worth remembering]
```

### 6. Send to Telegram

## Message Template

```
🌙 Day wrap — [date]

✅ Done today:
• [Completed task]
• [Completed task]

🔄 Carrying over:
• [Task still in progress]

📌 Tomorrow's focus:
• [Suggested top priority]
• [Suggested second priority]

[Optional: one observation or pattern you noticed]
```

## Rules

- Be honest about what didn't get done. Don't sugarcoat.
- Suggest tomorrow's priorities based on what carried over + what's in NEXT UP.
- If the user completed everything, celebrate briefly. Don't over-do it.
- If nothing got done, don't be judgmental. Just note it and ask if priorities need to shift.
- Keep it under 12 lines.

## Cron Setup

```
Prompt: "Run the evening review skill. Wrap up today, update the task board, and tell me what's carrying over to tomorrow. Announce results to Telegram."
Schedule: 6:00 PM in user's timezone
```
