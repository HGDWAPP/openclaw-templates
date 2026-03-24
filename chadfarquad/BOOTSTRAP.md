# BOOTSTRAP.md — First Run Setup

Run through this checklist the first time Chad connects. Once everything is checked off, heartbeats and cron jobs can be enabled.

## Step 1: Verify Workspace Structure

```bash
ls -la ~/.openclaw/workspace/
```

You should see: SOUL.md, IDENTITY.md, AGENTS.md, HEARTBEAT.md, MEMORY.md, BOOTSTRAP.md, and skills/

If any files are missing, the user needs to re-copy the chadfarquad folder.

## Step 2: Create Memory Directories

```bash
mkdir -p memory memory/research memory/meetings memory/drafts memory/digests
```

## Step 3: Create Task Board

```bash
cat > memory/task-board.md << 'EOF'
--- TASK BOARD ---

DOING

NEXT UP

BLOCKED

BACKLOG

DONE (last 7 days)
EOF
```

## Step 4: Create Today's Daily Note

```bash
echo "# $(date +%Y-%m-%d)" > "memory/$(date +%Y-%m-%d).md"
```

## Step 5: Verify Model Configuration

Open the OpenClaw dashboard → Settings → Model. Confirm:
- Provider: Anthropic
- Model: claude-sonnet-4-20250514 (or newer)

If not configured, guide the user through setting it up.

## Step 6: Load Command Center

Ask the user to paste their AI Command Center from Phase 3. When they do:

1. Read the entire document carefully
2. Extract: name, business, brand voice, audience, ONE Thing, current projects, tools
3. Write all extracted info to MEMORY.md in the appropriate sections
4. Confirm back to the user what you learned
5. Ask if anything is missing or wrong

## Step 7: Verify Telegram Connection

If the user has connected Telegram:
1. Send a brief greeting: "Hey [name] — Chad's online. Your marketing operator is ready. 🎯"
2. If Telegram isn't connected, skip this — they'll set it up later

## Step 8: Set Up Cron Jobs

Once the user confirms everything looks good, set up the daily cron jobs:

**Morning Standup (8 AM in user's timezone):**
```
Prompt: "Run the morning standup skill. Check today's task board, review what's due, and send me a brief update."
```

**Evening Review (6 PM in user's timezone):**
```
Prompt: "Run the evening review skill. Wrap up today, update the task board, and tell me what's carrying over to tomorrow."
```

**Weekly Digest (Sunday 7 PM in user's timezone):**
```
Prompt: "Run the weekly digest skill. Summarize the week — wins, patterns, and next week's priorities. Announce results to Telegram."
```

Set these up through the OpenClaw dashboard → Cron Jobs.

## Step 9: Mark Bootstrap Complete

Once all steps are done:
1. Delete or rename BOOTSTRAP.md to BOOTSTRAP-DONE.md
2. Confirm to the user: "Setup complete. Morning standups start tomorrow at 8 AM."

## Reminder

Heartbeats and cron jobs cost API credits. Don't enable them until setup is fully complete.
