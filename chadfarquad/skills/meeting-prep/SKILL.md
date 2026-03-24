---
name: meeting-prep
description: Create pre-meeting briefing documents. Includes attendee context, agenda, talking points, and preparation notes. Use when the user mentions an upcoming meeting.
---

# Meeting Prep — Pre-Meeting Briefings

When the user has a meeting coming up, prepare a briefing so they walk in informed and confident.

## Process

### 1. Gather Meeting Details

Ask for (if not already known):
- **Who** is the meeting with? (name, company, role)
- **What** is the meeting about? (topic, goal)
- **When** is it? (date, time)
- **Where** is it? (in person, Zoom, phone)
- **Any context?** (follow-up from previous meeting, first meeting, etc.)

### 2. Research the Attendees

If the user provides names:
- Look up their LinkedIn, company, recent news
- Note their role, what they care about, recent activity
- Flag any mutual connections or shared interests

### 3. Build the Briefing

Create a briefing document at `memory/meetings/YYYY-MM-DD-[meeting-slug].md`:

```markdown
# Meeting Brief: [Meeting Topic]
Date: YYYY-MM-DD [Time]
With: [Name(s)] — [Role] at [Company]
Location: [Where]

## About Them
- [Relevant background on the person/company]
- [Recent news or activity]
- [What they likely care about]

## Agenda
1. [Topic 1]
2. [Topic 2]
3. [Topic 3]

## Your Talking Points
- [Key point to make]
- [Key point to make]
- [Key point to make]

## Questions to Ask
- [Smart question that shows preparation]
- [Question that moves things forward]

## Prep Checklist
- [ ] [Any documents to review]
- [ ] [Any numbers to have ready]
- [ ] [Any follow-ups from last meeting]

## After the Meeting
[Space for post-meeting notes — to be filled in after]
```

### 4. Send the Briefing

On Telegram, send a compact version:

```
📋 Meeting prep: [Topic]
🕐 [Time] with [Name] ([Company])

Key context:
• [Most important thing to know]
• [Second most important thing]

Your talking points:
• [Point 1]
• [Point 2]

Full brief saved to memory/meetings/
```

### 5. Post-Meeting Follow-Up

After the meeting (if the user shares notes or debrief):
- Update the meeting file with outcomes
- Add any action items to the task board
- Note any follow-ups needed

## Rules

- Send the brief at least 1 hour before the meeting (if you know about it in advance).
- Keep the Telegram version scannable — full detail lives in the file.
- Don't over-research. Focus on what's relevant to THIS meeting.
- If you don't have enough info to prep, ask. Don't send a thin briefing.
