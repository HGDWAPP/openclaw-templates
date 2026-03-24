---
name: weekly-digest
description: Sunday evening weekly summary. Reviews the week's wins, patterns, task board progress, and proposes next week's priorities.
---

# Weekly Digest — Sunday Evening Summary

Chad runs this every Sunday evening to close out the week and set up the next one.

## Process

### 1. Gather the Week's Data

Read the last 7 daily notes:
```bash
for i in $(seq 0 6); do
  f="memory/$(date -d "$i days ago" +%Y-%m-%d).md"
  [ -f "$f" ] && cat "$f"
done
```

Read the current task board:
```bash
cat memory/task-board.md
```

Read any research or drafts created this week:
```bash
ls -la memory/research/ memory/drafts/ memory/meetings/ 2>/dev/null
```

### 2. Analyze the Week

- **Tasks completed** — How many moved to DONE?
- **Tasks carried over** — What's been sitting in DOING too long?
- **New tasks added** — Is the backlog growing or shrinking?
- **Patterns** — What days were most productive? What got blocked and why?
- **Content created** — Any drafts, posts, or research produced?
- **Key decisions** — Anything important that was discussed or decided?

### 3. Write the Digest

Save to `memory/digests/week-of-YYYY-MM-DD.md`:

```markdown
# Weekly Digest — Week of [Start Date]

## By the Numbers
- Tasks completed: [N]
- Tasks added: [N]
- Tasks blocked: [N]
- Content pieces drafted: [N]
- Research reports: [N]

## Wins This Week
- [Win 1]
- [Win 2]
- [Win 3]

## What Carried Over
- [Task still in progress — why]
- [Task still in progress — why]

## Patterns I Noticed
- [Observation about productivity, focus areas, or habits]
- [Observation about what's working or not]

## Next Week's Priorities
1. [Top priority — why it matters]
2. [Second priority]
3. [Third priority]

## One Thing to Think About
[A reflection, suggestion, or question for the user to consider]
```

### 4. Send to Telegram

```
📊 Weekly digest — [date range]

✅ Completed: [N] tasks
➕ Added: [N] new tasks
🚫 Blocked: [N]

Wins:
• [Top win]
• [Second win]

Carried over:
• [Task — why]

Next week's focus:
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

💭 [One reflection or suggestion]

Full digest: memory/digests/
```

## Rules

- Keep the Telegram version under 15 lines. Detail lives in the file.
- Be honest about what didn't get done. The digest is a mirror, not a highlight reel.
- The "One Thing to Think About" should be genuinely useful — a pattern you noticed, a suggestion based on the week's data, or a question that helps them prioritize.
- Archive DONE items older than 7 days from the task board during the digest.
- If it was a light week (few tasks, little activity), keep the digest short. Don't pad it.

## Cron Setup

```
Prompt: "Run the weekly digest skill. Summarize the week — wins, patterns, and next week's priorities. Announce results to Telegram."
Schedule: Sunday 7:00 PM in user's timezone
```
