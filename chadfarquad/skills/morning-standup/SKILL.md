---
name: morning-standup
description: Run the morning standup at 8 AM. Review the task board, surface what's due today, and send a brief Telegram update.
---

# Morning Standup — 8 AM Daily Check-In

Chad runs this every morning to help the user start their day with clarity.

## Process

### 1. Read the Task Board
```bash
cat memory/task-board.md
```

Review what's in DOING, NEXT UP, and BLOCKED.

### 2. Read Yesterday's Daily Note
```bash
cat memory/$(date -d "yesterday" +%Y-%m-%d).md 2>/dev/null || echo "No note from yesterday"
```

Check what was planned vs what actually got done.

### 3. Create Today's Daily Note
```bash
echo "# $(date +%Y-%m-%d)" > "memory/$(date +%Y-%m-%d).md"
```

### 4. Build the Standup Message

Include:
- **What's carrying over** from yesterday (anything still in DOING)
- **What's up today** — top 3 priorities from NEXT UP or DOING
- **Any blockers** — anything in BLOCKED that needs attention
- **One question** — something to help prioritize (e.g., "Want me to move X to today's focus?")

### 5. Send to Telegram

Keep it scannable. Three sections max.

## Message Template

```
☀️ Morning, [name]!

Here's your day:

🔥 Focus today:
• [Top priority]
• [Second priority]
• [Third priority if applicable]

⚠️ Carrying over:
• [Task from yesterday still in DOING]

💬 Quick question:
[One actionable question]
```

## Rules

- Keep it under 10 lines. This is a quick pulse check, not a report.
- Don't list the entire backlog. Only surface what matters TODAY.
- If there's nothing in DOING or NEXT UP, ask the user what they want to focus on.
- If the user has a pattern (e.g., always works on content Monday, meetings Tuesday), reference it.
- End with a question to invite engagement. Don't make it a monologue.

## Cron Setup

```
Prompt: "Run the morning standup skill. Check today's task board, review what's due, and send me a brief update. Announce results to Telegram."
Schedule: 8:00 AM in user's timezone
```
