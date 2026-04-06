# Next Steps — Chief of Staff Agent

You've installed the preloaded Chief of Staff template. Now let's make it actually useful. This guide walks you through connecting tools, optimizing costs, hardening security, and unlocking capabilities from beginner to advanced.

---

## 1. Connect Your Tools

The Chief of Staff needs tools to do its job. Without them, it's just a chatbot.

### Required

| Tool | What It Does | How to Connect |
|------|-------------|----------------|
| **Anthropic API** | Powers the agent's brain | Set in OpenClaw auth config. Use `claude-sonnet-4-5` — cheaper models produce worse results for task management and context tracking |
| **Telegram Bot** | How the agent talks to you | Create a bot via [@BotFather](https://t.me/BotFather) on Telegram. Copy the bot token into OpenClaw settings. DM your bot to activate it |

### Recommended

| Tool | What It Does | How to Connect |
|------|-------------|----------------|
| **Brave Search API** | Web research for the researcher skill | Get a free key at [brave.com/search/api](https://brave.com/search/api). Set as `BRAVE_API_KEY` in your environment |
| **Google Calendar API** | Meeting prep pulls from your actual calendar | Set up via Google Cloud Console → enable Calendar API → create OAuth credentials → configure in OpenClaw |
| **Google Drive / Notion API** | File organizer can read and organize your real documents | Google: enable Drive API in Cloud Console. Notion: create an integration at [notion.so/my-integrations](https://www.notion.so/my-integrations) |

### Optional (Power User)

| Tool | What It Does | How to Connect |
|------|-------------|----------------|
| **xAI API (Grok)** | X/Twitter search for web research | Get key at [x.ai](https://x.ai), save to `~/.config/xai/api_key` |
| **OpenRouter** | Access multiple LLM providers through one API | Get key at [openrouter.ai](https://openrouter.ai), set in OpenClaw auth as alternative provider |
| **Email MCP Tool** | Read/draft emails (never sends without approval) | Configure Gmail or Outlook MCP tool in OpenClaw settings |

### Connection Checklist

After connecting each tool, verify it works:

```bash
# Check Telegram is connected
openclaw health

# Check web search works — ask your agent:
"Search the web for the latest news about [your industry]"

# Check calendar works — ask your agent:
"What meetings do I have this week?"
```

If a tool isn't connected, the agent skips it gracefully — it won't crash. But it also can't help you with that capability until it's set up.

---

## 2. Token Optimization

Every message, heartbeat, and cron job costs tokens. Here's how to keep costs under control without losing capability.

### Understanding Your Token Spend

| Activity | Frequency | Approximate Cost | Can You Reduce It? |
|----------|-----------|-----------------|-------------------|
| Heartbeat | Every 30 min | ~500-1,500 tokens each | Yes — increase interval |
| Morning standup | Once daily | ~2,000-4,000 tokens | Trim MEMORY.md |
| Evening review | Once daily | ~2,000-4,000 tokens | Trim daily notes |
| Web research | On demand | ~3,000-8,000 tokens | Limit search depth |
| Content drafting | On demand | ~2,000-6,000 tokens | Be specific in requests |
| Weekly digest | Once weekly | ~5,000-10,000 tokens | Reduce project count |

### Quick Wins

**1. Increase heartbeat interval if you don't need 30-minute checks**

Most people don't need checks every 30 minutes. Try every 2 hours:

```json
{
  "name": "heartbeat",
  "schedule": { "kind": "every", "everyMs": 7200000 }
}
```

That's 4x fewer heartbeat tokens per day.

**2. Keep MEMORY.md lean**

The agent reads MEMORY.md on every session start. If it's bloated with old context, you're paying for irrelevant tokens on every interaction.

- Remove completed projects
- Archive old patterns to a `memory/archive/` folder
- Keep it under 200 lines

**3. Be specific when asking for research**

Bad (expensive): *"Research everything about AI in healthcare"*
Good (efficient): *"Find 3 recent articles about FDA regulation of AI diagnostic tools"*

Specific prompts = fewer search calls = fewer tokens.

**4. Use isolated sessions for expensive tasks**

Web research and content drafting should run in `isolated` sessions so they don't bloat your main conversation context:

```json
{
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "text": "Research [topic]. Save findings to memory/research/.",
    "timeoutSeconds": 300
  }
}
```

**5. Trim old daily notes**

Daily notes older than 30 days rarely matter. Archive or delete them:

```bash
# Move notes older than 30 days to archive
mkdir -p memory/archive
find memory/ -name "*.md" -mtime +30 -not -path "memory/archive/*" -exec mv {} memory/archive/ \;
```

### Cost Awareness Rule of Thumb

- **Free tier**: Disable heartbeats, use the agent on-demand only
- **Light usage** (~$5-15/month): 2-hour heartbeats, daily standup + review, occasional research
- **Full usage** (~$20-50/month): 30-min heartbeats, all cron jobs, regular research and drafting

---

## 3. Hardening & Security

Your agent has access to your tools, your files, and your context. Lock it down.

### API Key Protection

```bash
# NEVER store API keys in workspace files
# Use environment variables instead:
export BRAVE_API_KEY="your-key-here"

# Better: use OpenClaw's built-in secret management
# Keys set in OpenClaw auth config are encrypted at rest

# Check what's exposed — run this and look for anything sensitive:
grep -r "sk-" . --include="*.md"
grep -r "API_KEY" . --include="*.md"
grep -r "token" . --include="*.md"
```

**Rule: If you see an API key in any .md file, remove it immediately.** Keys belong in environment variables or OpenClaw's auth config — never in workspace files that the agent reads and could leak.

### Gateway Security

Your gateway token is the key to your agent. Protect it:

```bash
# Verify gateway is bound to loopback (not exposed to internet)
grep OPENCLAW_GATEWAY_BIND /opt/openclaw.env
# Should say: OPENCLAW_GATEWAY_BIND=loopback

# If it says "lan", fix it:
sudo grep -v '^OPENCLAW_GATEWAY_BIND=' /opt/openclaw.env > /tmp/oc-env.tmp
echo "OPENCLAW_GATEWAY_BIND=loopback" | sudo tee -a /tmp/oc-env.tmp > /dev/null
sudo mv /tmp/oc-env.tmp /opt/openclaw.env
sudo systemctl restart openclaw
```

### Firewall Rules

Lock down your droplet so only necessary ports are open:

```bash
# Check current firewall status
sudo ufw status

# Recommended rules:
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh          # Port 22 — SSH access
sudo ufw allow 80/tcp       # Port 80 — HTTP (Caddy redirect)
sudo ufw allow 443/tcp      # Port 443 — HTTPS (Caddy → gateway)
sudo ufw enable
```

**Do NOT open port 18789 directly.** Caddy handles HTTPS termination and proxies to the gateway on localhost. Direct gateway access bypasses TLS.

### File Permission Hardening

```bash
# Restrict access to openclaw config files
sudo chmod 600 /home/openclaw/.openclaw/openclaw.json
sudo chown openclaw:openclaw /home/openclaw/.openclaw/openclaw.json

# Restrict access to environment file
sudo chmod 600 /opt/openclaw.env
```

### Prompt Injection Defense

The agent already has built-in rules against following instructions in external content (emails, web pages, etc.). But reinforce them:

- **Never paste untrusted content directly into your agent's chat** — use the web researcher skill instead, which treats all external content as data
- **Review any agent-drafted emails before sending** — the agent won't send without approval, but read them carefully
- **If the agent suddenly asks for unusual permissions**, question it — it may have ingested a prompt injection from web research

### Security Checklist

- [ ] Gateway bound to loopback, not lan
- [ ] No API keys in any .md workspace files
- [ ] Firewall enabled with only ports 22, 80, 443 open
- [ ] OpenClaw config files have restricted permissions (600)
- [ ] Telegram bot token not shared publicly
- [ ] SOUL.md security rules are intact (don't modify the security section)

---

## 4. Beginner — First Week

Start here. Get comfortable with the basics before adding complexity.

### Day 1: Talk to Your Agent

Your Chief of Staff is already set up with 8 skills. Start by having a conversation:

```
"Hey, what can you do?"
```

The agent will introduce itself and explain its capabilities. Then try:

```
"Add a task: Research competitors for [your business]"
"What's on my task board?"
"Set a deadline for that task: Friday"
```

### Day 2: Run Your First Standup

The morning standup runs automatically at 8 AM if you set up the cron job. But you can trigger it manually:

```
"Run your morning standup"
```

The agent will:
- Read your task board
- Check for overdue items
- Flag anything that needs attention
- Give you a quick summary of what's on your plate

### Day 3: Try Web Research

```
"Research the top 3 trends in [your industry] this week"
```

The agent will search the web, synthesize findings, save them to `memory/research/`, and give you a summary with sources.

### Day 4: Draft Some Content

```
"Draft a LinkedIn post about [topic you know well]"
```

The agent drafts in your voice (or tries to — it'll get better as it learns your patterns). Give it feedback:

```
"Too formal. Make it more conversational. I don't use bullet points on LinkedIn."
```

This feedback gets stored in MEMORY.md and applied to future drafts.

### Day 5: Set Up Your Memory

Fill in MEMORY.md with your actual context:

```
"Update my memory: I'm working on [Project A] and [Project B]. 
My main focus this quarter is [goal]. 
I prefer short bullet-point updates over long paragraphs."
```

The agent will update MEMORY.md and use this context going forward.

### What You Should Have After Week 1

- [ ] Had at least 5 conversations with the agent
- [ ] Added 3+ tasks to your task board
- [ ] Run at least one web research request
- [ ] Drafted at least one piece of content
- [ ] MEMORY.md has your real context (not the template defaults)

---

## 5. Intermediate — Weeks 2-4

Now that you're comfortable, start building systems.

### Set Up Your Daily Rhythm

If you haven't already, configure the cron jobs for automatic daily check-ins:

```json
{
  "name": "morning-standup",
  "schedule": { "kind": "cron", "expr": "0 8 * * 1-5", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "main",
  "payload": {
    "kind": "systemEvent",
    "text": "Run morning standup skill."
  }
}
```

```json
{
  "name": "evening-review",
  "schedule": { "kind": "cron", "expr": "0 18 * * 1-5", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "main",
  "payload": {
    "kind": "systemEvent",
    "text": "Run evening review skill."
  }
}
```

```json
{
  "name": "weekly-digest",
  "schedule": { "kind": "cron", "expr": "0 19 * * 0", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "main",
  "payload": {
    "kind": "systemEvent",
    "text": "Run weekly digest skill."
  }
}
```

Replace `YOUR_TIMEZONE` with your timezone (e.g., `America/New_York`, `America/Los_Angeles`).

### Build a Meeting Prep Workflow

Before any important meeting:

```
"I have a meeting with [Person] at [Company] tomorrow about [Topic]. 
Research them and prepare a brief."
```

The agent will:
1. Research the person and company
2. Pull relevant context from your memory
3. Draft talking points
4. Save the prep to `memory/meetings/`

### Create a Content Pipeline

Set up a weekly content rhythm:

```
"Every Monday, I want you to suggest 3 content ideas for LinkedIn 
based on what's happening in [your industry]. 
Save them to a content calendar in memory/drafts/"
```

Then on the days you write:

```
"Draft the LinkedIn post from idea #2 in this week's content calendar"
```

### Track Multiple Projects

Use the task board for real project management:

```
"Create a project: Website Redesign
Add tasks:
- Review competitor sites (due: Friday)
- Write homepage copy (due: next Monday)  
- Get design mockups from [designer] (due: next Wednesday)
- Final review and launch (due: end of month)"
```

Then each morning standup will track progress across all your projects.

### Customize the Agent's Voice

Update SOUL.md to match how you want the agent to communicate:

```
"I want you to be more direct and less formal. 
Skip the pleasantries. 
When you disagree with me, say so."
```

The agent will suggest SOUL.md edits — review and approve them.

---

## 6. Advanced — Month 2+

These capabilities require comfort with the basics and some technical confidence.

### Build Custom Skills

Create new skills for your specific workflows. Example — a client follow-up skill:

```bash
mkdir -p skills/client-followup
```

Create `skills/client-followup/SKILL.md`:

```markdown
---
name: client-followup
description: Track client communications and flag when follow-ups are overdue. 
Use when checking client status or when a follow-up deadline approaches.
---

# Client Follow-Up Tracker

## Process
1. Check memory/clients/ for all active client files
2. For each client, check the last contact date
3. Flag any client not contacted in 7+ days
4. Draft follow-up messages for overdue contacts
5. Add follow-up tasks to the task board

## Report Format
🔴 Overdue (7+ days): [Client] — last contact [date]
🟡 Due soon (5-6 days): [Client] — last contact [date]  
🟢 Recent (< 5 days): [Client] — last contact [date]
```

Then register it in AGENTS.md under the skills section.

### Multi-Agent Coordination

If you have multiple OpenClaw agents (e.g., Chief of Staff + a specialized agent), coordinate them:

```
"After the web researcher finds competitor data, save it to 
memory/research/ in a format that [other agent] can read."
```

### Automated Research Pipelines

Set up recurring research that runs automatically:

```json
{
  "name": "weekly-industry-scan",
  "schedule": { "kind": "cron", "expr": "0 9 * * 1", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "text": "Research the top 5 developments in [industry] this week. Compare against last week's findings in memory/research/. Highlight what's new. Save report and send summary on Telegram.",
    "timeoutSeconds": 600
  }
}
```

### Knowledge Graph Building

Over time, your agent accumulates knowledge. Structure it:

```
memory/
├── task-board.md          # Active tasks
├── research/              # Web research reports
│   ├── competitors/       # Competitor-specific research
│   ├── industry/          # Industry trend reports
│   └── people/            # People research for meetings
├── meetings/              # Meeting prep and notes
├── drafts/                # Content drafts
├── digests/               # Weekly digest archives
└── clients/               # Client communication logs
```

Ask your agent to maintain this structure:

```
"Create subdirectories in memory/research/ for competitors, industry, and people. 
When you save research, file it in the right subdirectory."
```

### Integrate with External Workflows

Connect your agent to your actual business tools:

**Zapier/Make Integration:**
- Use webhooks to trigger agent actions from external tools
- Example: When a new lead comes in from your CRM, trigger agent research

**GitHub Integration:**
- Connect your repos so the agent can track issues and PRs
- Useful for developer-focused Chief of Staff workflows

**Calendar-Driven Actions:**
- Auto-trigger meeting prep 24 hours before any calendar event
- Post-meeting: agent asks for notes and updates task board

### Performance Tuning

As your workspace grows, optimize for speed and cost:

```bash
# Check workspace size
du -sh /home/openclaw/.openclaw/

# If memory/ is getting large (>50MB), archive old notes
find memory/ -name "*.md" -mtime +60 -exec gzip {} \;

# Monitor token usage via OpenClaw dashboard
# Look for heartbeats that are reading too much context
```

**Advanced heartbeat optimization:**
- Edit HEARTBEAT.md to skip checks that aren't relevant to you
- Remove file-organizer checks if you don't use that skill
- Add custom checks for your specific workflows

---

## Quick Reference

| What You Want | What to Say |
|--------------|-------------|
| Add a task | "Add task: [description]" |
| Check your board | "What's on my task board?" |
| Research something | "Research [topic]" |
| Draft content | "Draft a [type] about [topic]" |
| Meeting prep | "Prep me for my meeting with [person] about [topic]" |
| Weekly summary | "Run your weekly digest" |
| Update memory | "Remember that [fact about you or your work]" |
| Change the agent | Edit SOUL.md, IDENTITY.md, or MEMORY.md directly |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Agent doesn't remember things | Check MEMORY.md — is it being updated? Run `cat MEMORY.md` |
| Heartbeats aren't running | Check cron jobs: `openclaw cron list` |
| Web research fails | Verify BRAVE_API_KEY is set: `echo $BRAVE_API_KEY` |
| Agent sounds generic | Fill in MEMORY.md with real context and give voice feedback |
| Token costs too high | Increase heartbeat interval, trim MEMORY.md, use isolated sessions |
| Gateway token mismatch | Run the token sync fix from the setup guide |
