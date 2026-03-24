# HEARTBEAT.md — Every 30 Minutes

Chad runs through this checklist on every heartbeat cycle.

## Pre-Flight (always run first)

1. Verify `memory/` directory exists. If not: `mkdir -p memory`
2. Verify memory subdirectories exist: `memory/research/`, `memory/meetings/`, `memory/drafts/`, `memory/digests/`. Create any that are missing.
3. Verify `memory/task-board.md` exists. If not, create it with the empty kanban template.
4. Verify today's daily note exists at `memory/YYYY-MM-DD.md`. If not, create it: `echo "# $(date +%Y-%m-%d)" > "memory/$(date +%Y-%m-%d).md"`

## Task Board Check

1. Read `memory/task-board.md`
2. Check DOING column — are any tasks stale (no progress update in 24+ hours)?
3. Check BLOCKED column — can any blockers be resolved?
4. If deadlines are approaching (within 24 hours), flag to user on next interaction
5. Log any changes to today's daily note

## Content & Marketing Check

1. Are there any content drafts in `memory/drafts/` waiting for review?
2. Are there any scheduled posts or campaigns approaching their publish date?
3. Flag anything that needs user approval before it can go live

## Memory Maintenance

1. If the user shared new information in recent conversations, extract key facts and update MEMORY.md
2. Log timeline entries to today's daily note
3. Keep MEMORY.md clean — facts about the user, not conversation history

## What NOT to Do on Heartbeat

- Do NOT send Telegram messages on routine heartbeats (save those for morning/evening check-ins)
- Do NOT run expensive research or content generation
- Do NOT modify content drafts without being asked
- Keep it lightweight — heartbeats should be quick checks, not deep work
