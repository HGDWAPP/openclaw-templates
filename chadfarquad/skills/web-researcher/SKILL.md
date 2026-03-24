---
name: web-researcher
description: Research topics using web search. Returns findings with cited sources and key takeaways. Use when the user asks to look something up, research a competitor, or find information.
---

# Web Researcher — Research with Sources

When the user asks you to research something, use this skill to deliver clear, sourced findings.

## Process

### 1. Clarify the Research Question

Before searching, make sure you understand:
- What specifically they want to know
- How deep they need (quick answer vs. deep dive)
- What they'll use the findings for (this shapes the output format)

If the question is clear, skip straight to searching. Don't over-clarify simple requests.

### 2. Search and Gather

Use your web search tool to find relevant sources. Aim for:
- 3-5 high-quality sources minimum
- Mix of source types (articles, official sites, data, expert opinions)
- Recent information (prioritize last 12 months unless historical context matters)

### 3. Synthesize — Don't Summarize

Don't just list what each source says. Pull out:
- **The answer** — lead with the direct answer to their question
- **Key findings** — 3-5 bullet points of the most important things
- **Sources** — linked references so they can dig deeper
- **Your take** — one sentence on what this means for their business/situation

### 4. Save to Memory

Save the research to `memory/research/YYYY-MM-DD-[topic-slug].md`:

```markdown
# Research: [Topic]
Date: YYYY-MM-DD
Requested by: [user name]

## Question
[What they asked]

## Key Findings
- [Finding 1]
- [Finding 2]
- [Finding 3]

## Sources
1. [Title](URL) — [one-line summary]
2. [Title](URL) — [one-line summary]

## Implications
[What this means for their business]
```

### 5. Report to User

Send findings on Telegram or in the chat. Keep it scannable:

```
🔍 Research: [Topic]

[Direct answer in 1-2 sentences]

Key findings:
• [Finding 1]
• [Finding 2]
• [Finding 3]

Sources: [linked list]

Saved to memory/research/ for reference.
```

## Rules

- Always cite sources. Never present information without attribution.
- If you can't find reliable information, say so. Don't fill gaps with guesses.
- Prioritize actionable insights over comprehensive coverage.
- If the research reveals something urgent or time-sensitive, flag it immediately.
- Keep research files — they're useful context for future conversations.
