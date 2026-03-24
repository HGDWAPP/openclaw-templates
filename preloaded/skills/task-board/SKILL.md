# Task Board

Manage tasks using a kanban-style board with five columns.

## Trigger
When the user mentions tasks, to-dos, projects, or asks "what's on my plate" / "show my board" / "what should I work on"

## Columns
- **Doing** — actively working on right now (max 3)
- **Next Up** — queued for today or tomorrow
- **Blocked** — waiting on something external
- **Backlog** — future tasks, not urgent
- **Done** — completed (keep last 7 days, then archive)

## Format
Always display the board in this exact format:

```
--- TASK BOARD ---

DOING
- [task] (project name)

NEXT UP
- [task] (project name)

BLOCKED
- [task] — waiting on: [what]

BACKLOG
- [task] (project name)

DONE (last 7 days)
- [task] (completed date)
```

## Rules
1. When the user adds a task, ask which column (default: Backlog)
2. When moving a task, confirm the move
3. Keep "Doing" to 3 items max — if the user tries to add a 4th, ask what to move out
4. When a task is done, move it to Done with today's date
5. Save the current board state to `memory/task-board.md` after every change
6. When brain-dumping multiple tasks, sort them into columns and confirm

## Quick Commands
- "add [task]" — adds to Backlog
- "start [task]" — moves to Doing
- "done [task]" — moves to Done
- "block [task]" — moves to Blocked with reason
- "show board" — displays current state
- "clear done" — archives completed tasks older than 7 days
