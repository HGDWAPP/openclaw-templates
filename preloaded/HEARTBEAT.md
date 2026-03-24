# HEARTBEAT.md — Chief of Staff Check-In

Run through this checklist on every heartbeat cycle.

## Pre-Flight
1. Verify `memory/` directory exists. If not: `mkdir -p memory`
2. Verify today's daily note exists at `memory/YYYY-MM-DD.md`. If not, create it.
3. Check if any cron jobs failed since last heartbeat.

## Task Awareness
1. Read the current task board from memory (or the last known state).
2. Check if any tasks in "Doing" have been there for more than 2 days — flag them.
3. Check if any tasks in "Blocked" need follow-up.
4. If the user mentioned deadlines, check if any are approaching (within 48 hours).

## Daily Note Update
1. If the user had any conversations since last heartbeat, extract key decisions or action items.
2. Append them to today's daily note under "## Updates".
3. Keep entries brief — one line per item.

## Report
- If anything needs attention: surface it clearly with context.
- If everything is fine: log "HEARTBEAT_OK" to daily notes. Do NOT message the user.

## Cost Awareness
This heartbeat costs tokens every cycle. Keep checks efficient. Don't run expensive operations (web searches, long file reads) during heartbeats unless something is clearly wrong.
