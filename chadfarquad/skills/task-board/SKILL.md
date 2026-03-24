---
name: task-board
description: Manage the kanban task board. Add, move, complete, and review tasks across five columns: Doing, Next Up, Blocked, Backlog, Done.
---

# Task Board — Kanban Task Management

Your task board lives at `memory/task-board.md`. It's the single source of truth for everything on your plate.

## Board Format

```
--- TASK BOARD ---

DOING
- [task description] (added YYYY-MM-DD)

NEXT UP
- [task description] (added YYYY-MM-DD)

BLOCKED
- [task description] — REASON: [why it's blocked] (added YYYY-MM-DD)

BACKLOG
- [task description] (added YYYY-MM-DD)

DONE (last 7 days)
- [task description] (completed YYYY-MM-DD)
```

## Commands

The user can manage tasks by talking naturally. Interpret these as task board actions:

| What they say | What you do |
|---|---|
| "Add [task] to my list" | Add to NEXT UP |
| "I'm working on [task]" | Move to DOING |
| "I finished [task]" or "Done with [task]" | Move to DONE with today's date |
| "I'm stuck on [task]" or "[task] is blocked" | Move to BLOCKED, ask for the reason |
| "What's on my plate?" or "What am I working on?" | Show the full board |
| "What should I do next?" | Recommend from NEXT UP based on priority |
| "Clear done items" | Archive DONE items older than 7 days |
| "Move [task] to backlog" | Move to BACKLOG |

## Rules

1. **DOING should have 1-3 items max.** If someone tries to add a 4th, ask which one to move out first.
2. **Always show the full board after making changes** — don't just confirm. Show the updated state.
3. **Add dates to everything** — when it was added, when it was completed, when it was blocked.
4. **DONE items expire after 7 days** — archive them to the daily note, then remove from the board.
5. **Never delete tasks without confirmation** — move to BACKLOG or DONE, don't remove.

## Telegram Format

When showing the board on Telegram, use this compact format:

```
📋 TASK BOARD

🔥 DOING
• Task one
• Task two

⏭️ NEXT UP
• Task three
• Task four

🚫 BLOCKED
• Task five — waiting on X

📦 BACKLOG
• Task six
• Task seven

✅ DONE (this week)
• Task eight (Mar 20)
• Task nine (Mar 19)
```

## Integration with Daily Notes

When tasks move to DONE, log it in today's daily note (`memory/YYYY-MM-DD.md`):

```
## Completed
- [task description] — moved to done at [time]
```

## Maintenance

During each heartbeat:
1. Check if any DOING items have been there for 24+ hours without updates — flag them
2. Check if DONE has items older than 7 days — archive them
3. Check if BLOCKED items have a resolution path — suggest unblocking
