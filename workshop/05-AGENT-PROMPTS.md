# Agent Setup Prompts

Copy-paste these prompts into Telegram (or the TUI) to install and configure your specialist agent. Each section is a message you send to your agent.

Pick the agent that fits your business, then follow the steps in order.

---

## Choose Your Agent

| Agent | Best For | What It Does |
|-------|----------|-------------|
| **Aria** | Content, brand, thought leadership | Scans news, drafts in your voice, pre-screens work |
| **Scout** | Sales, BD, GTM, market strategy | Scans markets, scores leads, tracks competitors |
| **Atlas** | Investment, analysis, deal flow | Scans signals, matches patterns, scores opportunities |

---

## Step 1: Install the Template Pack

Pick ONE of the three prompts below based on your chosen agent.

### Aria (Brand Strategist & Content Intelligence)

```text
I need you to install a specialist agent template. Here's what to do:

1. Clone the repo: git clone https://github.com/HGDWAPP/openclaw-templates /tmp/agent-setup
2. Copy the Aria template files to your workspace:
   - cp /tmp/agent-setup/workshop/agent-templates/aria/IDENTITY.md ~/.openclaw/workspace/IDENTITY.md
   - cp /tmp/agent-setup/workshop/agent-templates/aria/SOUL.md ~/.openclaw/workspace/SOUL.md
   - cp /tmp/agent-setup/workshop/agent-templates/aria/AGENTS.md ~/.openclaw/workspace/AGENTS.md
   - cp /tmp/agent-setup/workshop/agent-templates/aria/HEARTBEAT.md ~/.openclaw/workspace/HEARTBEAT.md
   - cp /tmp/agent-setup/workshop/agent-templates/aria/BOOTSTRAP.md ~/.openclaw/workspace/BOOTSTRAP.md
   - cp /tmp/agent-setup/workshop/agent-templates/aria/USER.md ~/.openclaw/workspace/USER.md
3. Copy the skills: cp -r /tmp/agent-setup/workshop/agent-templates/aria/skills/. ~/.openclaw/workspace/skills/
4. Copy the knowledge templates: mkdir -p ~/.openclaw/workspace/knowledge && cp -r /tmp/agent-setup/workshop/agent-templates/aria/knowledge/. ~/.openclaw/workspace/knowledge/
5. Create memory directories: mkdir -p ~/.openclaw/workspace/memory/{research,drafts,digests}
6. Clean up: rm -rf /tmp/agent-setup
7. List what's now in your workspace to confirm everything is there.

Go ahead and do all of this now.
```

### Scout (GTM Intelligence & Market Strategist)

```text
I need you to install a specialist agent template. Here's what to do:

1. Clone the repo: git clone https://github.com/HGDWAPP/openclaw-templates /tmp/agent-setup
2. Copy the Scout template files to your workspace:
   - cp /tmp/agent-setup/workshop/agent-templates/scout/IDENTITY.md ~/.openclaw/workspace/IDENTITY.md
   - cp /tmp/agent-setup/workshop/agent-templates/scout/SOUL.md ~/.openclaw/workspace/SOUL.md
   - cp /tmp/agent-setup/workshop/agent-templates/scout/AGENTS.md ~/.openclaw/workspace/AGENTS.md
   - cp /tmp/agent-setup/workshop/agent-templates/scout/HEARTBEAT.md ~/.openclaw/workspace/HEARTBEAT.md
   - cp /tmp/agent-setup/workshop/agent-templates/scout/BOOTSTRAP.md ~/.openclaw/workspace/BOOTSTRAP.md
   - cp /tmp/agent-setup/workshop/agent-templates/scout/USER.md ~/.openclaw/workspace/USER.md
3. Copy the skills: cp -r /tmp/agent-setup/workshop/agent-templates/scout/skills/. ~/.openclaw/workspace/skills/
4. Copy the knowledge templates: mkdir -p ~/.openclaw/workspace/knowledge && cp -r /tmp/agent-setup/workshop/agent-templates/scout/knowledge/. ~/.openclaw/workspace/knowledge/
5. Create memory directories: mkdir -p ~/.openclaw/workspace/memory/{research,leads,digests}
6. Clean up: rm -rf /tmp/agent-setup
7. List what's now in your workspace to confirm everything is there.

Go ahead and do all of this now.
```

### Atlas (Investment Intelligence & Opportunity Engine)

```text
I need you to install a specialist agent template. Here's what to do:

1. Clone the repo: git clone https://github.com/HGDWAPP/openclaw-templates /tmp/agent-setup
2. Copy the Atlas template files to your workspace:
   - cp /tmp/agent-setup/workshop/agent-templates/atlas/IDENTITY.md ~/.openclaw/workspace/IDENTITY.md
   - cp /tmp/agent-setup/workshop/agent-templates/atlas/SOUL.md ~/.openclaw/workspace/SOUL.md
   - cp /tmp/agent-setup/workshop/agent-templates/atlas/AGENTS.md ~/.openclaw/workspace/AGENTS.md
   - cp /tmp/agent-setup/workshop/agent-templates/atlas/HEARTBEAT.md ~/.openclaw/workspace/HEARTBEAT.md
   - cp /tmp/agent-setup/workshop/agent-templates/atlas/BOOTSTRAP.md ~/.openclaw/workspace/BOOTSTRAP.md
   - cp /tmp/agent-setup/workshop/agent-templates/atlas/USER.md ~/.openclaw/workspace/USER.md
3. Copy the skills: cp -r /tmp/agent-setup/workshop/agent-templates/atlas/skills/. ~/.openclaw/workspace/skills/
4. Copy the knowledge templates: mkdir -p ~/.openclaw/workspace/knowledge && cp -r /tmp/agent-setup/workshop/agent-templates/atlas/knowledge/. ~/.openclaw/workspace/knowledge/
5. Create memory directories: mkdir -p ~/.openclaw/workspace/memory/{research,deals,digests}
6. Clean up: rm -rf /tmp/agent-setup
7. List what's now in your workspace to confirm everything is there.

Go ahead and do all of this now.
```

After your agent confirms, restart the service from your SSH terminal:

```bash
sudo systemctl restart openclaw
```

---

## Step 2: Load Your Personal Context

Send this to your agent (fill in the blanks):

```text
I'm going to give you my personal context so you can be effective for MY business specifically. Please read everything and update USER.md and MEMORY.md with my information. Then confirm what you learned about me.

Here's who I am:

**Name:** [Your name]
**Business:** [What you do / your company]
**Industry:** [Your industry or niche]
**Role:** [Your title or what you do day-to-day]

**What I sell / offer:**
[Describe your products, services, or what you're building]

**My audience / customers:**
[Who are you trying to reach? What do they care about?]

**My goals right now:**
[What are you focused on for the next 30-90 days?]

**My voice / brand:**
[How would you describe your communication style? Casual? Professional? Bold? Give examples if you can.]

**Things I care about:**
[What topics, trends, or ideas are you passionate about?]

**Communication preferences:**
- Best way to reach me: Telegram
- When I want updates: [morning / evening / both]
- How detailed: [bullet points / detailed analysis / just the highlights]
- Timezone: [Your timezone]
```

Your agent reads this and immediately becomes smarter about YOUR specific business.

---

## Step 3: Fill Out Your Knowledge Files

This is the step that makes the agent actually powerful. Send one of these depending on your agent:

### For Aria — Voice & Feedback Patterns

```text
I need to fill out my knowledge files so you can do your job well. Let's start:

**My best content (links or descriptions of posts that performed well):**
1. [Link or description of your best post/article]
2. [Another one]
3. [One more]

**My brand voice rules:**
- [e.g., "Never use corporate jargon"]
- [e.g., "Always lead with a story or hot take"]
- [e.g., "Keep it conversational, like texting a smart friend"]

**My quality bar — what makes content "good enough" to publish:**
- [e.g., "Has a clear hook in the first line"]
- [e.g., "Teaches something actionable"]
- [e.g., "Sounds like me, not like AI"]

**Topics I want to own as a thought leader:**
- [Topic 1]
- [Topic 2]
- [Topic 3]

**Competitors or peers I watch:**
- [Name/handle 1]
- [Name/handle 2]

Please update knowledge/voice-samples.md and knowledge/feedback-patterns.md with this information. Then show me what you saved.
```

### For Scout — ICP & Growth Frameworks

```text
I need to fill out my knowledge files so you can do your job well. Let's start:

**My Ideal Customer Profile (ICP):**
- Industry: [What industry are your best customers in?]
- Company size: [Revenue range or employee count]
- Title of decision maker: [Who do you sell to?]
- Pain points: [What problems do they have that you solve?]
- Budget range: [What do they typically spend?]
- How I find them today: [Referrals? Social? Outbound? Events?]

**What makes a lead "hot":**
- [e.g., "They just raised funding"]
- [e.g., "They posted about the exact problem we solve"]
- [e.g., "They're hiring for the role our product replaces"]

**Growth frameworks I follow:**
- [e.g., "Alex Hormozi — value equation, $100M Offers framework"]
- [e.g., "Sabri Suby — Sell Like Crazy funnel methodology"]
- [e.g., "Your own framework or playbook"]

**Competitors to monitor:**
- [Competitor 1 — what they sell, why they matter]
- [Competitor 2]

**My current growth channels:**
- [e.g., LinkedIn outbound, Twitter/X, cold email, partnerships]

Please update knowledge/icp.md and knowledge/influencer-frameworks.md with this information. Then show me what you saved.
```

### For Atlas — Investment Thesis & Patterns

```text
I need to fill out my knowledge files so you can do your job well. Let's start:

**My Investment Thesis:**
- Sectors I care about: [e.g., "AI infrastructure, fintech, health tech"]
- Stage preference: [e.g., "Pre-seed to Series A"]
- Check size: [e.g., "$25K - $100K" or "angel checks"]
- Geographic focus: [e.g., "US, with interest in emerging markets"]
- What I look for in founders: [e.g., "Domain experts building in their own industry"]

**Pattern types I'm most interested in:**
- The Parallel: [e.g., "What worked in fintech applied to health care"]
- The Convergence: [e.g., "AI + robotics creating new categories"]
- The Dislocation: [e.g., "Regulatory changes opening windows"]
- The Infrastructure Play: [e.g., "Picks and shovels for AI adoption"]

**Deal sources I trust:**
- [e.g., "AngelList, specific Twitter follows, specific newsletters"]

**My conviction scoring — what pushes a deal from 6 to 8+:**
- [e.g., "Founder has done this before"]
- [e.g., "Revenue already growing 20%+ MoM"]
- [e.g., "Clear thesis match on 2+ dimensions"]

**Red flags that kill a deal:**
- [e.g., "No technical co-founder"]
- [e.g., "Crowded market with no differentiation"]

Please update knowledge/thesis.md and knowledge/investment-patterns.md with this information. Then show me what you saved.
```

---

## Step 4: Run the Bootstrap

```text
Let's run through your bootstrap checklist. Walk me through each step of BOOTSTRAP.md and let me know what's already done and what still needs setup.
```

Your agent goes through the BOOTSTRAP.md checklist step by step. It will tell you what's configured and what still needs attention.

---

## Step 5: Test Your Agent's Superpowers

Once bootstrap is done, test the proactive capabilities:

### For Aria

```text
Run a content scan right now. Search for trending topics and news in my industry, score each for relevance and angle potential, and draft 3 post ideas in my voice.
```

### For Scout

```text
Run a market scan right now. Search for leads that match my ICP, check what my competitors are doing, and surface the top 3 opportunities with scores.
```

### For Atlas

```text
Run a signal scan right now. Search for recent funding rounds, market shifts, and emerging patterns in my sectors. Score any opportunities against my thesis and give me structured proposals for anything above 7.0 conviction.
```

---

## Step 6: Set Up Proactive Schedules

```text
Set up my recurring cron jobs:

1. Morning brief at 8:00 AM every weekday — summarize overnight signals, today's priorities, and anything needing my attention. Run as a main session event.

2. Proactive scan every 6 hours — run your scanning skill as an isolated session and announce results to Telegram. Only report if something is worth my time.

3. Evening recap at 6:00 PM every weekday — summarize what happened today, what's actionable, and what's on deck for tomorrow. Run as a main session event.

Use my timezone: [YOUR TIMEZONE]
My Telegram chat ID: [YOUR CHAT ID]
```

**Verify from SSH:**

```bash
sudo -iu openclaw openclaw cron list
```

You should see 3 jobs listed.

---

## Step 7: Verify the Full Loop

Wait for the next scheduled scan to fire (or trigger one manually with Step 5). You should get a structured Telegram message with:

- Scored signals/leads/opportunities
- Clear recommendations
- Your agent's reasoning for each score

If the message arrives and the scoring makes sense for your business, your agent is fully operational.

---

## Quick Reference — What to Say When

| You Want To... | Say This |
|----------------|----------|
| Get a status update | "What's going on?" |
| Run a manual scan | "Run a [content/market/signal] scan now" |
| Check what agent knows about you | "What do you know about me?" |
| Update your context | "Update my [USER.md/knowledge files] with this: ..." |
| Add a task | "Add a task: [description]" |
| See your pipeline | "Show me my [content calendar/lead pipeline/deal pipeline]" |
| Adjust scan frequency | "Change the scan schedule to every [X] hours" |
| Get help | "Walk me through your capabilities" |

---

*OpenClaw Workshop — Build Your AI Command Center*
