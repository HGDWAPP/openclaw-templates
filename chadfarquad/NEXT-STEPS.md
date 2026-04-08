# Next Steps — Marketing Operator

Your bot is configured. Now let's make it actually useful for marketing.

---

## 1. Review Your Context Files

Your agent's personality and marketing knowledge come from these files. Open each one and make sure it still feels right.

| File | What to Check |
|------|--------------|
| **SOUL.md** | Does the voice match your brand? It's set to "warm, direct, action-first, culturally fluent." If your brand is more corporate or more playful, edit it. |
| **IDENTITY.md** | Is the daily rhythm right? Morning at 8 AM, evening at 6 PM, Sunday digest at 7 PM — adjust to your actual schedule. |
| **MEMORY.md** | Check every section: your business description, brand voice, audience details, your ONE Thing, active projects, content preferences. Fill in anything it missed. |
| **HEARTBEAT.md** | This runs every 30 minutes. It checks content calendars, marketing tasks, and memory health. Add your own checks — upcoming launches, campaign deadlines, etc. |
| **AGENTS.md** | Review the 10 skills installed. Anything missing from the "Must Do" list? Anything you'd rather handle yourself? |
| **BOOTSTRAP.md** | This already ran during setup. No action needed — just know it exists if you ever reset. |

**Quick test:** Ask your agent *"What's my brand voice?"* and *"Who's my target audience?"* — if the answers are wrong or empty, your MEMORY.md needs work.

---

## 2. Connect Your Tools

Your marketing agent gets dramatically better with tools. Start with Brave Search — it's free and unlocks the competitor-intel and web-researcher skills.

| Tool | What It Unlocks | Setup |
|------|----------------|-------|
| **Brave Search API** | Competitor intel, trend scanning, audience research. The competitor-intel and web-researcher skills need this. | Free key at [brave.com/search/api](https://brave.com/search/api) → set as `BRAVE_API_KEY` |
| **Google Calendar** | Agent blocks content creation time and meeting prep around your actual schedule. | Connect via OpenClaw dashboard → Integrations |
| **Google Drive** | Access to your content library, brand assets, strategy docs. | Connect via OpenClaw dashboard → Integrations |
| **Email (MCP)** | Inbox-zero skill actually works — triages messages, drafts replies, flags partner/client emails. | Set up via MCP plugin in OpenClaw |
| **Canva API** | Social post creation with your brand templates. | Key from Canva Developer portal → add in OpenClaw auth config |
| **Google Analytics** | Agent pulls real traffic data into content strategy and weekly digests. | Connect via MCP plugin in OpenClaw |
| **xAI (Grok)** | Real-time social signals and cultural pulse checks. Great for buzz-scanning. | Key at [x.ai](https://x.ai) → set as `XAI_API_KEY` |
| **OpenRouter** | Route cheap tasks to smaller models, save budget for complex content work. | Key at [openrouter.ai](https://openrouter.ai) → add in OpenClaw auth config |

After connecting each tool, test it:
```
"What are my competitors posting about this week?"
"Draft me a LinkedIn post about [topic] in my brand voice"
"What's trending in my industry right now?"
```

---

## 3. Token Optimization

Marketing agents are chatty — content drafting and research burn tokens fast. Keep costs reasonable.

**Quick wins:**
- Set heartbeat to 60 min instead of 30 (saves ~50% on heartbeat costs)
- Use `isolated` sessions for research and content drafts (keeps main chat context small)
- Be specific — *"draft a LinkedIn post about our new feature launch"* costs less than *"write me some social content"*
- Keep MEMORY.md under 200 lines
- Archive daily notes older than 30 days

**What costs what:**
| Activity | Cost |
|----------|------|
| Quick chat | $ |
| Morning standup / evening review | $ |
| Social post draft | $$ |
| Competitor research | $$ |
| Full content strategy session | $$$ |
| Weekly digest with research | $$$ |

**Monthly cost tiers:**
- Light (chat + check-ins): ~$5-15
- Active (+ content drafts + competitor intel): ~$15-50
- Heavy (daily content + research + inbox): ~$50-100

---

## 4. Hardening

```bash
# Verify gateway only listens locally
grep OPENCLAW_GATEWAY_BIND /opt/openclaw.env
# Should say: OPENCLAW_GATEWAY_BIND=loopback

# Firewall — only SSH and HTTPS
sudo ufw allow 22/tcp && sudo ufw allow 443/tcp && sudo ufw allow 80/tcp
sudo ufw default deny incoming && sudo ufw --force enable

# No API keys in workspace files
grep -r "sk-" . --include="*.md"
grep -r "API_KEY" . --include="*.md"
```

- Never paste API keys in chat — set them in environment variables or OpenClaw auth config
- Don't share brand strategy docs through the chat — upload them to Drive and connect via integration
- Prompt injection defense is built into SOUL.md — don't remove the Security section

---

## 5. Beginner — First Week

**Day 1-2: Feed it your brand.** Share brand guidelines, voice examples, audience info, past content that performed well. The more context, the better its content drafts.

**Day 3: Try a content draft.** *"Draft a LinkedIn post about [recent thing you did]."* Give feedback. *"More casual." "Shorter." "Add a hook."* It learns fast.

**Day 4: Run competitor intel.** *"What are my top 3 competitors doing on social this week?"* (Requires Brave Search.) Agent saves findings to memory.

**Day 5: Let the cron jobs run.** Set up morning standup + evening review. The marketing agent checks content calendars and flags things during check-ins.

**End of week, ask yourself:**
- Are the content drafts close to your voice, or way off?
- Is competitor intel surfacing useful stuff?
- Is the daily rhythm helping or just noise?

---

## 6. Intermediate — Weeks 2-4

**Build a content calendar.** Tell the agent your content schedule — platforms, frequency, themes. It tracks deadlines and drafts ahead of time.

**Set up the social scheduler skill.** Map out which platforms you post to, when, and what type of content. Agent drafts and queues posts.

**Use competitor-intel regularly.** Weekly competitor scan becomes part of your Sunday digest. Agent spots patterns you might miss.

**Try inbox-zero.** Connect email, let agent triage. It drafts replies for routine stuff, flags urgent partner/client messages, and archives noise.

**Refine brand voice.** Open MEMORY.md → brand voice section. Add specific examples: *"We say 'hey' not 'hello.' We never use the word 'synergy.' We always lead with the outcome, not the process."*

---

## 7. Advanced — Month 2+

**Build a content pipeline.** Combine cron jobs + skills + isolated sessions:
- Monday: agent scans trends and competitors, proposes 3 content ideas
- Tuesday-Thursday: drafts and queues social posts based on your approval
- Friday: content performance review (needs Google Analytics)
- Sunday: weekly digest with what worked, what didn't, next week's plan

**Write custom marketing skills.** Create skills for your specific workflows — launch announcements, partnership outreach templates, campaign brief generators. Each skill is a markdown file in `skills/`.

**Connect the full stack.** Email + Calendar + Drive + Analytics together = agent can triage inbox, draft responses, check your schedule, pull performance data, and suggest content adjustments. That's a real marketing operations layer.

**Automate reporting.** Weekly digest pulls from analytics, content performance, competitor moves, and inbox activity. One message every Sunday with everything you need to know.

---

## Quick Reference

| What | Where |
|------|-------|
| Agent personality & brand voice | `SOUL.md` |
| Operating mode & schedule | `IDENTITY.md` |
| Brand context & audience | `MEMORY.md` |
| Heartbeat checklist | `HEARTBEAT.md` |
| Operating rules & skills | `AGENTS.md` |
| First-run setup | `BOOTSTRAP.md` |
| Task board | `memory/task-board.md` |
| Daily notes | `memory/YYYY-MM-DD.md` |
| Skills | `skills/` directory |

**Something not working?**
- Content drafts are off-brand → Add more brand voice examples to MEMORY.md
- Competitor intel fails → Connect Brave Search (`BRAVE_API_KEY`)
- Agent doesn't know your audience → Fill in the audience section of MEMORY.md
- Gateway issues → Run `sudo -iu openclaw openclaw health`
