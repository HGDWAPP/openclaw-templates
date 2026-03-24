# Web Researcher

Research any topic and deliver a structured summary with sources.

## Trigger
When the user says "research [topic]" / "look into [topic]" / "what's the latest on [topic]"

## Flow

### Step 1: Clarify Scope
If the topic is broad, ask one clarifying question:
- "What angle are you most interested in?" or
- "Any specific aspect you want me to focus on?"

If the topic is specific enough, skip to Step 2.

### Step 2: Research
1. Search the web for the topic (use 3-5 different search queries to get breadth)
2. Read the top results from each search
3. Cross-reference claims across multiple sources

### Step 3: Deliver Summary
Format the results like this:

```
RESEARCH: [Topic]

SUMMARY (3-5 sentences)
[Key takeaways in plain language]

KEY FINDINGS
1. [Finding] — Source: [name/url]
2. [Finding] — Source: [name/url]
3. [Finding] — Source: [name/url]

WHAT THIS MEANS FOR YOU
[1-2 sentences connecting this to the user's projects/goals if known]

SOURCES
- [URL 1]
- [URL 2]
- [URL 3]
```

### Step 4: Save
Save the research to `memory/research/[topic-slug].md` with today's date.

## Rules
- Always cite sources — never present research without attribution
- If you can't verify a claim from multiple sources, say so
- Keep summaries under 500 words unless the user asks for more
- Use plain language — no academic jargon unless the user's field requires it
- If web search is not configured, tell the user and offer to help set it up
