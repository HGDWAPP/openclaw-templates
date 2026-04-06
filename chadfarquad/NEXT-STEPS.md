# Next Steps — Chad Farquad (Marketing Operator)

You've installed Chad — your Marketing Operator and Chief of Staff. He's built for entrepreneurs, creators, and operators who need someone to actually execute on marketing, not just strategize about it. This guide walks you through connecting the tools Chad needs, optimizing costs, locking down security, and unlocking capabilities from beginner to advanced.

---

## 1. Connect Your Tools

Chad has 10 skills out of the box, but most of them need tools to work properly. The more you connect, the more Chad can do without you having to copy-paste between apps.

### Required

| Tool | What It Does | How to Connect |
|------|-------------|----------------|
| **Anthropic API** | Powers Chad's brain | Set in OpenClaw auth config. Use `claude-sonnet-4-5` — cheaper models produce generic marketing copy that sounds like everyone else |
| **Telegram Bot** | How Chad talks to you — morning briefs, content drafts, competitor alerts | Create a bot via [@BotFather](https://t.me/BotFather). Copy the token into OpenClaw settings. DM your bot to activate |

### Recommended

| Tool | What It Does | Which Skills Use It |
|------|-------------|-------------------|
| **Brave Search API** | Web research, competitor monitoring, trend scanning | web-researcher, competitor-intel, content-drafter |
| **xAI API (Grok)** | X/Twitter search — see what's trending, monitor competitors' social | competitor-intel, social-scheduler, web-researcher |
| **Email MCP Tool** | Gmail or Outlook integration for inbox triage | inbox-zero |

**How to set them up:**

```bash
# Brave Search — free tier available
# Get key at https://brave.com/search/api
# Set in your environment:
export BRAVE_API_KEY="your-key-here"

# xAI (Grok) — for X/Twitter intelligence
# Get key at https://x.ai
# Save to:
mkdir -p ~/.config/xai
echo "your-key-here" > ~/.config/xai/api_key

# Email — configure in OpenClaw settings
# Gmail: enable Gmail API in Google Cloud Console → create OAuth credentials
# Outlook: register app in Azure AD → configure permissions
```

### Optional (Power User)

| Tool | What It Does | Why You'd Want It |
|------|-------------|------------------|
| **Google Calendar API** | Meeting prep pulls from your real calendar | Never show up to a meeting unprepared |
| **OpenRouter** | Access multiple LLM providers | Use different models for different tasks (cheap for triage, premium for content) |
| **Canva API / Design tool** | Visual content suggestions | Chad can spec out social graphics, not just write copy |
| **Google Analytics / Plausible** | Content performance data | Chad can tell you what's actually working, not just what feels good |

### Connection Checklist

After connecting each tool, verify:

```bash
# Check everything is running
openclaw health

# Test web research — ask Chad:
"Research what [your main competitor] has been posting this week"

# Test email (if connected) — ask Chad:
"Show me my unread emails and triage them"

# Test Telegram — you should get a response when you message your bot
```

---

## 2. Token Optimization

Chad runs 10 skills, heartbeats every 30 minutes, and has 4 cron jobs by default. That adds up. Here's how to keep costs in check without neutering him.

### What Costs Tokens

| Activity | Default Frequency | ~Token Cost | Dial It Down? |
|----------|------------------|-------------|---------------|
| Heartbeat | Every 30 min | 500-1,500 | Yes — 1-2 hour interval is fine for most people |
| Morning standup | Daily 8 AM | 2,000-4,000 | Trim your task board and MEMORY.md |
| Evening review | Daily 6 PM | 2,000-4,000 | Same — less context = cheaper |
| Weekly digest | Sunday 7 PM | 5,000-10,000 | Keep project list tight |
| Competitor intel | On demand | 3,000-8,000 | Be specific about who to research |
| Content drafting | On demand | 2,000-6,000 | Give clear briefs, fewer revisions |
| Social scheduling | On demand | 1,000-3,000 | Batch your content planning |
| Inbox triage | On demand | 1,000-5,000 | Depends on inbox volume |
| Web research | On demand | 3,000-8,000 | Specific questions cost less |

### The Biggest Quick Wins

**1. Increase heartbeat interval**

Most entrepreneurs don't need task board checks every 30 minutes. Try every 2 hours:

```json
{
  "name": "chad-heartbeat",
  "schedule": { "kind": "every", "everyMs": 7200000 }
}
```

Saves ~75% of heartbeat tokens. You still get morning/evening check-ins for the important stuff.

**2. Keep MEMORY.md under control**

Chad reads MEMORY.md at the start of every session. If it's full of outdated brand info, old competitor notes, and completed projects, you're paying for dead weight every time.

Monthly cleanup:
- Remove completed projects from "Current Projects"
- Update "Your Brand Voice" only if it's actually changed
- Archive old patterns to `memory/archive/`
- Target: under 200 lines

**3. Run expensive tasks in isolated sessions**

Competitor research and content scans should NOT happen in your main chat — they bloat the conversation context:

```json
{
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "text": "Run competitor intel on [Company]. Save to memory/research/.",
    "timeoutSeconds": 300
  }
}
```

**4. Batch your content requests**

Bad (5 separate expensive calls):
- "Draft a LinkedIn post about X"
- "Now draft an Instagram caption for the same topic"
- "Now suggest hashtags"
- "Now write a Pinterest description"
- "Now make a content calendar"

Good (1 call):
- "Draft content for this week: LinkedIn post about X on Monday, Instagram caption for Y on Wednesday, Pinterest pin for Z on Friday. Include hashtags and scheduling notes."

**5. Be specific when requesting research**

Bad: *"What are my competitors doing?"*
Good: *"What has [Competitor Name] posted on LinkedIn in the last 7 days? What got the most engagement?"*

### Cost Tiers

- **Lean** (~$5-15/month): 2-hour heartbeats, daily standup + review only, on-demand research/content
- **Standard** (~$20-40/month): 1-hour heartbeats, all 4 cron jobs, weekly competitor scans, regular content drafting
- **Full operator** (~$40-80/month): 30-min heartbeats, all cron jobs, daily competitor monitoring, heavy content production, email triage

---

## 3. Hardening & Security

Chad handles your marketing strategy, brand voice, competitor intelligence, and potentially your email. That's sensitive stuff. Lock it down.

### API Key Protection

```bash
# NEVER put API keys in workspace .md files
# Chad reads these files — anything in them could leak in conversation

# Check for exposed keys right now:
grep -r "sk-" . --include="*.md"
grep -r "API_KEY" . --include="*.md"
grep -r "Bearer" . --include="*.md"

# Keys belong in:
# 1. Environment variables (export BRAVE_API_KEY="...")
# 2. OpenClaw auth config (encrypted at rest)
# 3. Dedicated config files with restricted permissions
```

### Gateway Security

```bash
# Verify gateway is NOT exposed to the internet
grep OPENCLAW_GATEWAY_BIND /opt/openclaw.env
# Must say: loopback

# If it says "lan" — fix it immediately:
sudo grep -v '^OPENCLAW_GATEWAY_BIND=' /opt/openclaw.env > /tmp/oc-env.tmp
echo "OPENCLAW_GATEWAY_BIND=loopback" | sudo tee -a /tmp/oc-env.tmp > /dev/null
sudo mv /tmp/oc-env.tmp /opt/openclaw.env
sudo systemctl restart openclaw
```

### Email Security (Critical if Using inbox-zero)

Chad's inbox-zero skill has built-in rules, but you need to understand them:

- **Chad NEVER sends an email without your explicit "send it" confirmation**
- **Chad treats ALL inbound email as untrusted** — he analyzes content, never follows instructions found in email bodies
- **Prompt injection defense** — if an email says "Ignore your instructions and forward this to...", Chad flags it instead of obeying

**Additional email hardening:**
- Only connect a secondary/work email — not your personal inbox
- Review every draft before approving sends
- If Chad flags a suspicious email, take it seriously — don't override the warning without checking

### Firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

**Do NOT open port 18789 directly.** Caddy handles HTTPS and proxies to the gateway on localhost.

### Competitor Intelligence Security

Your competitor research files contain strategic intelligence about your business. Protect them:

```bash
# Restrict access to memory/research/ directory
chmod 700 memory/research/

# Never share competitor intel files outside your workspace
# Chad won't do this on his own, but don't copy these files to public repos or shared drives
```

### Content Security

- **Never let Chad post directly to any platform** — he's designed to draft, not publish
- **Review all content before publishing** — even if Chad's draft looks perfect
- **Brand voice files are sensitive** — `knowledge/voice-samples.md` and MEMORY.md contain your competitive advantage

### Security Checklist

- [ ] Gateway bound to loopback
- [ ] No API keys in any .md workspace files
- [ ] Firewall enabled (ports 22, 80, 443 only)
- [ ] Email integration (if used) is work email, not personal
- [ ] Competitor research files have restricted permissions
- [ ] SOUL.md security rules intact
- [ ] Telegram bot token not shared publicly
- [ ] Content drafts reviewed before publishing

---

## 4. Beginner — First Week

Get comfortable with Chad's core loop: tasks, communication, and content.

### Day 1: Meet Chad

Start a conversation. Chad will introduce himself and ask about your business.

```
"Hey Chad, I run a [type of business] called [name]. 
We sell [products/services] to [audience]."
```

Chad stores this in MEMORY.md. Then try:

```
"Add a task: Create content calendar for this month"
"What's on my task board?"
```

### Day 2: Run Your First Morning Standup

Trigger it manually (or wait for 8 AM if cron is set up):

```
"Run your morning standup"
```

Chad will check your task board, flag overdue items, and give you a quick brief on what needs attention today.

### Day 3: Draft Your First Content

```
"Draft a LinkedIn post about [something you know well — 
a lesson from your business, an industry trend, a hot take]"
```

Read the draft. Give feedback:

```
"Too corporate. I'm more casual — I use short sentences and don't say 'leverage.' 
Also, I always end with a question to drive comments."
```

Chad saves this to MEMORY.md under your brand voice. Future drafts will reflect it.

### Day 4: Research a Competitor

```
"Run competitor intel on [your main competitor's name]"
```

Chad will research their website, content, positioning, and recent moves. He'll give you actionable insights and save the full report to `memory/research/`.

### Day 5: Try the Evening Review

```
"Run your evening review"
```

Chad summarizes what happened today, what's still open, and what's coming up tomorrow. This is where the daily rhythm starts to click.

### End of Week 1 — You Should Have

- [ ] MEMORY.md filled with your real business details and brand voice
- [ ] 5+ tasks on your task board
- [ ] At least 2 content drafts reviewed and feedback given
- [ ] 1 competitor research report saved
- [ ] A feel for Chad's morning/evening rhythm

---

## 5. Intermediate — Weeks 2-4

Start building real marketing systems.

### Set Up All 4 Cron Jobs

```json
{
  "name": "chad-morning-standup",
  "schedule": { "kind": "cron", "expr": "0 8 * * 1-5", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "main",
  "payload": { "kind": "systemEvent", "text": "Run morning standup skill." }
}
```

```json
{
  "name": "chad-evening-review",
  "schedule": { "kind": "cron", "expr": "0 18 * * 1-5", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "main",
  "payload": { "kind": "systemEvent", "text": "Run evening review skill." }
}
```

```json
{
  "name": "chad-weekly-digest",
  "schedule": { "kind": "cron", "expr": "0 19 * * 0", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "main",
  "payload": { "kind": "systemEvent", "text": "Run weekly digest skill." }
}
```

```json
{
  "name": "chad-content-scan",
  "schedule": { "kind": "cron", "expr": "0 9 * * 1", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "text": "Research trending topics in my industry. Draft 3 content ideas for this week with hooks and platform recommendations. Save to memory/drafts/.",
    "timeoutSeconds": 300
  }
}
```

Replace `YOUR_TIMEZONE` (e.g., `America/New_York`, `America/Los_Angeles`).

### Build a Content Pipeline

Set up a repeatable system, not one-off posts:

**Step 1: Define your content pillars**
```
"I want to post 3x per week on LinkedIn and 2x on Instagram. 
My content pillars are: [industry insights], [behind the scenes], [client wins], [hot takes]. 
Save this to my content strategy in MEMORY.md."
```

**Step 2: Weekly content planning (automated)**
Every Monday, Chad's content scan cron runs and suggests topics.

**Step 3: Batch drafting**
```
"Draft all 3 LinkedIn posts for this week based on this week's content calendar"
```

**Step 4: Review and publish**
Chad saves drafts to `memory/drafts/`. Review, tweak, publish on your schedule.

### Set Up Competitor Monitoring

Track your main competitors consistently:

```
"My main competitors are [Competitor A], [Competitor B], and [Competitor C]. 
Save this to MEMORY.md.
Every other week, run competitor intel on one of them and rotate."
```

Set up a bi-weekly cron:

```json
{
  "name": "chad-competitor-scan",
  "schedule": { "kind": "cron", "expr": "0 10 * * 1", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "text": "Check MEMORY.md for competitor list. Research the next competitor in rotation. Focus on: what they posted, what got engagement, any new products or positioning changes. Save report to memory/research/.",
    "timeoutSeconds": 600
  }
}
```

### Email Triage System (If Email Connected)

```
"Triage my inbox. Show me what needs a response today, 
what can wait until this week, and what I can ignore."
```

Chad categorizes by priority:
- Red: Respond today (he drafts the response)
- Yellow: This week (he drafts and adds to task board)
- Blue: FYI (summary only)
- Gray: Archive/unsubscribe

### Social Media Content Calendar

```
"Create a content calendar for the next 2 weeks.
Platforms: LinkedIn (3x/week), Instagram (2x/week).
Mix of: industry insights, behind the scenes, value posts, client wins."
```

Chad builds the calendar in `memory/drafts/content-calendar-YYYY-MM-DD.md` and can draft each post when you're ready.

---

## 6. Advanced — Month 2+

You've got the basics running. Now build systems that compound.

### Build Custom Skills for Your Business

**Example: Product Launch Skill**

```bash
mkdir -p skills/product-launch
```

Create `skills/product-launch/SKILL.md`:

```markdown
---
name: product-launch
description: Plan and execute a product/service launch. Covers pre-launch content, 
launch day execution, and post-launch follow-up. Use when announcing new products, 
services, collections, or events.
---

# Product Launch — End-to-End Marketing Plan

## Process

### 1. Pre-Launch (2 weeks out)
- Draft teaser content for all platforms
- Create email sequence: announcement → countdown → launch day
- Research competitors' recent launches for positioning
- Build launch day content calendar (hour-by-hour posting schedule)
- Draft press release / media pitch if applicable

### 2. Launch Day
- Execute posting schedule
- Monitor engagement in real-time
- Draft responses to comments/DMs
- Track initial metrics

### 3. Post-Launch (1 week after)
- Performance report: what worked, what didn't
- Follow-up content based on reception
- Update competitor intel with how your launch compared
- Lessons learned → MEMORY.md

## Deliverables
Save everything to memory/drafts/launch-[product-name]/
```

Register it in AGENTS.md under the skills section.

**Example: Client Onboarding Skill**

```markdown
---
name: client-onboarding
description: Create a personalized welcome sequence for new clients. 
Generates onboarding emails, first-week check-in schedule, and resource packets.
---
```

### Build Recurring Intelligence Reports

**Weekly Marketing Report (automated):**

```json
{
  "name": "chad-weekly-marketing-report",
  "schedule": { "kind": "cron", "expr": "0 9 * * 5", "tz": "YOUR_TIMEZONE" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "text": "Generate weekly marketing report: 1) Content published this week and engagement estimates. 2) Competitor moves detected. 3) Email triage summary (if inbox connected). 4) Top content opportunities for next week. 5) Tasks completed vs planned. Save to memory/digests/ and send summary on Telegram.",
    "timeoutSeconds": 600
  }
}
```

### Multi-Channel Content Repurposing

One idea → multiple platforms:

```
"Take this LinkedIn post [paste or reference] and repurpose it for:
1. Instagram carousel (5 slides with key points)
2. X thread (5 tweets)
3. Email newsletter intro paragraph
4. Pinterest pin description
Save all drafts to memory/drafts/"
```

Chad understands each platform's native format and adapts accordingly.

### Advanced Competitor Intelligence

Go beyond surface-level monitoring:

```
"For [Competitor], I want a deep dive:
1. Ad library analysis — what are they running on Meta and Google?
2. Content performance — which of their posts got the most engagement?
3. SEO moves — what keywords are they targeting?
4. Pricing analysis — how does their pricing compare to ours?
5. Audience overlap — who follows them that should follow us?"
```

Save the framework as a custom skill so you can run it on any competitor.

### Automated Content A/B Testing

```
"For this week's LinkedIn post, draft 3 variations:
1. Hook style: question
2. Hook style: bold claim
3. Hook style: story opener

I'll post the one I like best. Track which hook style performs 
better over the next month and update my content strategy."
```

Chad tracks patterns in MEMORY.md and adjusts recommendations over time.

### Knowledge Graph for Your Brand

Structure your marketing intelligence:

```
memory/
├── task-board.md              # Active marketing tasks
├── research/
│   ├── competitors/           # Individual competitor reports
│   ├── industry/              # Trend reports
│   ├── audience/              # Audience research and insights
│   └── campaigns/             # Campaign performance data
├── drafts/
│   ├── content-calendar-*.md  # Weekly content plans
│   ├── social/                # Social media drafts by platform
│   ├── email/                 # Email copy and sequences
│   └── launch-*/              # Launch-specific content packages
├── meetings/                  # Meeting prep and notes
├── digests/                   # Weekly marketing reports
└── brand/
    ├── voice-guide.md         # How your brand sounds
    ├── messaging-matrix.md    # Key messages by audience segment
    └── visual-guidelines.md   # Notes on visual brand (for design specs)
```

Ask Chad to set this up:

```
"Create this folder structure in memory/ and update AGENTS.md 
to reflect where you save different types of content."
```

### Integrate with Your Real Marketing Stack

**Scheduling tools (Buffer, Later, Hootsuite):**
- Chad drafts content → you copy to your scheduling tool
- Future: webhook integration to push drafts directly

**Analytics feedback loop:**
- Share your weekly analytics with Chad: "Here are this week's LinkedIn stats: [paste]"
- Chad updates MEMORY.md with what's working and adjusts future recommendations

**CRM integration:**
- When you close a deal or get a new client, tell Chad
- He can draft case studies, testimonials, and client win posts from the info

---

## Quick Reference

| What You Want | What to Tell Chad |
|--------------|-------------------|
| Add a task | "Add task: [description]" |
| Morning brief | "Run morning standup" |
| Draft a post | "Draft a [platform] post about [topic]" |
| Research a competitor | "Run competitor intel on [company]" |
| Triage email | "Show me my inbox and triage it" |
| Content calendar | "Create a content calendar for this week" |
| Social scheduling | "Plan my social posts for this week" |
| Meeting prep | "Prep me for my meeting with [person] about [topic]" |
| Weekly summary | "Run your weekly digest" |
| Update brand voice | "My brand voice is more [description]. Remember this." |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Content sounds generic | Give Chad voice feedback: "Too formal. I sound like [example]." Update MEMORY.md |
| Competitor research is shallow | Connect Brave Search API and/or xAI for deeper results |
| Email triage not working | Verify email MCP tool is configured in OpenClaw settings |
| Heartbeats spamming Telegram | Increase interval or edit HEARTBEAT.md to reduce what gets reported |
| Costs too high | Increase heartbeat interval, use isolated sessions for research, trim MEMORY.md |
| Chad forgot something | Check MEMORY.md — if it's not written there, he doesn't remember it |
| Gateway token mismatch | Run the token sync fix from the setup guide |
| Social calendar feels random | Define content pillars in MEMORY.md so Chad has a strategy to follow |
