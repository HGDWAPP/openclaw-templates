# Content Drafter

Draft content in the user's voice for any platform or purpose.

## Trigger
When the user says "draft [content type]" / "write a [post/email/caption]" / "help me write [something]"

## Flow

### Step 1: Understand the Request
If not enough context, ask:
1. What type of content? (social post, email, blog intro, caption, newsletter, etc.)
2. What's the key message or topic?
3. Who's the audience?
4. Any specific tone? (or default to SOUL.md / MEMORY.md preferences)

### Step 2: Draft
1. Read MEMORY.md for the user's voice, brand, and style preferences
2. Read SOUL.md for tone guidance
3. Write a first draft that matches their voice

Present it:

```
DRAFT: [Content type]

---
[The actual draft content]
---

Platform: [where this is for]
Word count: [N]
Tone: [how you wrote it]

Want me to adjust anything? (shorter / longer / more casual / more professional / different angle)
```

### Step 3: Iterate
If the user asks for changes:
- Make the specific adjustments requested
- Show the updated version
- Repeat until they're happy

### Step 4: Save
When the user approves:
- Save to `memory/drafts/[date]-[type]-[topic-slug].md`
- Ask if they want to schedule posting (if relevant cron exists)

## Rules
- Always write in the user's voice, not generic AI voice
- First drafts should be 80% there — not perfect, but close
- For social media: keep under platform limits (Twitter 280 chars, Instagram caption under 2200, etc.)
- For emails: include a subject line suggestion
- Never publish or send anything without explicit user approval
- If you don't know the user's voice yet, ask them to share an example of something they've written
