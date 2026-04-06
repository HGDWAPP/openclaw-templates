# Next Steps — Chief of Staff

Your bot is configured. Now let's make it actually useful.

---

## 1. Review Your Context Files

Your agent's personality and knowledge come from these files. Open each one and make sure it still feels right — if something's off, edit it directly.

| File | What to Check |
|------|--------------|
| **SOUL.md** | Does the voice match how you want your agent to talk? Too formal? Too casual? Edit "Voice & Tone." |
| **IDENTITY.md** | Is the daily rhythm right? Morning at 8 AM, evening at 6 PM — adjust to your actual schedule. |
| **MEMORY.md** | Did your agent capture your info correctly from the AI Command Center? Check each section. Fill in anything it missed. |
| **HEARTBEAT.md** | This runs every 30 minutes. Is it checking the right things? Add project-specific checks if needed. |
| **AGENTS.md** | Review the operating rules. Anything you want automatic that currently requires confirmation? Anything missing from the "Must Do" list? |

**Quick test:** Ask your agent *"What do you know about me?"* — if the answer is thin or wrong, your MEMORY.md needs work.

---

## 2. Connect Your Tools

Your agent gets more useful with each tool you connect. Start with Brave Search — it's free and makes research tasks actually work.

| Tool | What It Unlocks | Setup |
|------|----------------|-------|
| **Brave Search API** | Web research, trend scanning, competitor lookups. Without it, the web-researcher skill is dead. | Free key at [brave.com/search/api](https://brave.com/search/api) → set as `BRAVE_API_KEY` in your environment |
| **Google Calendar** | Meeting prep pulls from your real calendar. Agent flags scheduling conflicts. | Connect via OpenClaw dashboard → Integrations |
| **Google Drive** | Agent can read and organize your actual docs. | Connect via OpenClaw dashboard → Integrations |
| **Email (MCP)** | Inbox triage, draft replies, flag urgent messages. | Set up via MCP plugin in OpenClaw |
| **xAI (Grok)** | Second research source. Good for real-time social signals. | Key at [x.ai](https://x.ai) → set as `XAI_API_KEY` |
| **OpenRouter** | Access multiple models — cheap ones for simple tasks, better ones for complex work. | Key at [openrouter.ai](https://openrouter.ai) → add in OpenClaw auth config |

After connecting each tool, test it:
```
"Search the web for the latest news about [your industry]"
"What meetings do I have this week?"
```

---

## 3. Token Optimization

Every message, heartbeat, and cron job costs tokens. Keep costs reasonable without killing capability.

**Quick wins:**
- Set heartbeat to 60 min instead of 30 (saves ~50% on heartbeat costs)
- Use `isolated` sessions for research tasks (keeps main chat context small)
- Be specific — *"research competitor pricing for X"* costs less than *"tell me about my competitors"*
- Keep MEMORY.md under 200 lines — agent reads it every session start
- Archive daily notes older than 30 days

**What costs what:**
| Activity | Cost |
|----------|------|
| Quick chat message | $ |
| Morning standup / evening review | $ |
| Heartbeat check | $ |
| Web research task | $$ |
| Content drafting | $$ |
| Meeting prep with research | $$$ |

**Monthly cost tiers:**
- Light (chat + daily check-ins): ~$5-15
- Active (+ research + drafts): ~$15-40
- Heavy (all skills, frequent heartbeats): ~$40-80

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
- Prompt injection defense is built into SOUL.md — don't remove the Security section
- Don't open port 18789 directly — Caddy handles HTTPS and proxies to gateway

---

## 5. Beginner — First Week

**Day 1-2: Just talk to it.** Share what you're working on, your priorities, your context. Let it build memory.

**Day 3: Use the task board.** *"Add a task: Research competitors for my project"* → *"What's on my board?"* → *"Mark that task as done."*

**Day 4: Try a research task.** *"Research the top 3 trends in [your industry] this week."* (Requires Brave Search.) Agent saves findings to `memory/research/` with sources.

**Day 5: Let the cron jobs run.** Set up morning standup + evening review from the dashboard. Let them run a few days.

**End of week, ask yourself:**
- Is the morning standup useful or noise?
- Did the agent remember things from earlier conversations?
- Is the tone right? If not, edit SOUL.md.

---

## 6. Intermediate — Weeks 2-4

**Set up your daily rhythm.** Configure cron jobs for morning standup, evening review, and weekly digest. Adjust times to your actual schedule.

**Build a project tracker.** Tell the agent your active projects with deadlines, blockers, who's involved. It tracks them on the board and flags things during check-ins.

**Try meeting prep.** Before your next important meeting: *"I have a meeting with [Person] at [Company] tomorrow about [Topic]. Research them and prep me."*

**Start using content-drafter.** Share writing examples, ask for a draft, give feedback (*"too formal," "more punchy," "shorter"*). It learns from your edits.

**Refine your memory.** Open MEMORY.md — correct anything wrong, add context it's missing about your working style and preferences.

---

## 7. Advanced — Month 2+

**Write custom skills.** Each skill is just a markdown file in `skills/`. Create ones for your specific workflows — client check-in templates, weekly report generators, proposal drafters.

**Build automated pipelines.** Combine cron jobs + skills + isolated sessions:
- Monday AM: agent researches your industry, surfaces top 3 things to know
- Before each meeting: auto-generate prep docs
- Sunday evening: weekly digest with task progress and next week's priorities

**Connect more tools.** Email + Calendar + Drive together let your agent become a real operations layer — triaging inbox, checking schedule, pulling docs before meetings.

**Tune the heartbeat.** Edit HEARTBEAT.md to add project-specific monitoring — stale PRs, upcoming launches, content deadlines.

**Delegate more.** The goal: check your morning brief, approve or redirect, then focus on deep work. Everything else is handled.

---

## Quick Reference

| What | Where |
|------|-------|
| Agent personality | `SOUL.md` |
| Operating mode & schedule | `IDENTITY.md` |
| User context & memory | `MEMORY.md` |
| Heartbeat checklist | `HEARTBEAT.md` |
| Operating rules & skills | `AGENTS.md` |
| Task board | `memory/task-board.md` |
| Daily notes | `memory/YYYY-MM-DD.md` |
| Skills | `skills/` directory |

**Something not working?**
- Agent doesn't remember things → Check MEMORY.md, share your AI Command Center again if empty
- Research fails → Connect Brave Search (`BRAVE_API_KEY`)
- Tone is off → Edit SOUL.md directly
- Gateway issues → Run `sudo -iu openclaw openclaw health`
