# Next Steps — Custom Agent

Your bot is configured. Now let's make it actually useful.

---

## 1. Review Your Context Files

You built this agent from scratch, so these files are entirely yours. Open each one and make sure everything still feels right.

| File | What to Check |
|------|--------------|
| **SOUL.md** | Does the personality match what you want? Check voice/tone, what it does, what it doesn't do, communication rules. |
| **IDENTITY.md** | Is the role clear? Is the daily rhythm realistic for how you'll actually use it? |
| **MEMORY.md** | Did your context transfer correctly? Check each section — about you, current focus, projects, preferences, key dates. |
| **HEARTBEAT.md** | What should it check every cycle? Add checks specific to your use case. |
| **AGENTS.md** | Review the skills you wrote. Are they doing what you intended? Anything missing? |

**Quick test:** Ask your agent *"What's your job?"* and *"What do you know about me?"* — the answers should match what's in IDENTITY.md and MEMORY.md. If they don't, those files need edits.

---

## 2. Connect Your Tools

Your agent starts with Anthropic (the LLM). Each tool you add unlocks new capabilities.

| Tool | What It Unlocks | Setup |
|------|----------------|-------|
| **Brave Search API** | Web research, fact-checking, industry scanning. Most custom skills that touch the internet need this. | Free key at [brave.com/search/api](https://brave.com/search/api) → set as `BRAVE_API_KEY` |
| **Google Calendar** | Schedule-aware agent. It can check conflicts, prep for meetings, block focus time. | Connect via OpenClaw dashboard → Integrations |
| **Google Drive** | Agent reads and organizes your docs. Useful for any agent that works with files. | Connect via OpenClaw dashboard → Integrations |
| **Email (MCP)** | Inbox triage, draft replies, flag messages. | Set up via MCP plugin in OpenClaw |
| **xAI (Grok)** | Second LLM source. Good for real-time information and social signals. | Key at [x.ai](https://x.ai) → set as `XAI_API_KEY` |
| **OpenRouter** | Access to many models. Route cheap tasks to small models, complex ones to better models. | Key at [openrouter.ai](https://openrouter.ai) → add in OpenClaw auth config |

After connecting each tool, test it with a simple task:
```
"Search the web for [something relevant to your agent's role]"
```

---

## 3. Token Optimization

Every message, heartbeat, and cron job costs tokens. Custom agents can be lean or expensive depending on how you built them.

**Quick wins:**
- Set heartbeat to 60 min instead of 30 (saves ~50% on heartbeat costs)
- Use `isolated` sessions for research tasks (keeps main context small)
- Be specific in your prompts — vague requests cost more tokens
- Keep MEMORY.md under 200 lines
- Archive old daily notes (30+ days)

**Monthly cost tiers:**
- Light (chat + daily check-ins): ~$5-15
- Active (+ skills + research): ~$15-40
- Heavy (all skills, frequent heartbeats, lots of research): ~$40-80

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
- Prompt injection defense should be in your SOUL.md Security section — if you skipped it, add it back
- Don't open port 18789 directly — Caddy handles HTTPS and proxies to gateway

---

## 5. Beginner — First Week

**Day 1-2: Test your skills.** Run each skill you wrote and see if it works the way you intended. Fix anything that's off.

**Day 3: Build memory.** Talk to your agent about what you're working on. Share context. Let it populate daily notes and the task board.

**Day 4: Try a real task.** Give it something from your actual workflow — not a test. See how it handles it with the skills and context it has.

**Day 5: Set up cron jobs.** Morning check-in, evening review, whatever rhythm makes sense for your agent's role.

**End of week, ask yourself:**
- Are the skills useful or do they need rewriting?
- Is the agent's memory building correctly?
- Is the personality right? If not, edit SOUL.md.

---

## 6. Intermediate — Weeks 2-4

**Refine your skills.** After a week of real use, you'll know which skills are useful and which need work. Edit them. Each skill is a markdown file in `skills/`.

**Add more skills.** Now that you see what your agent can do, think about what's missing. Write new skills for your specific workflows.

**Set up project tracking.** Use the task board — tell your agent about active projects, deadlines, blockers. It flags things during check-ins.

**Tune the heartbeat.** Edit HEARTBEAT.md to check things specific to your use case — stale tasks, upcoming deadlines, whatever matters for your role.

---

## 7. Advanced — Month 2+

**Build automated workflows.** Combine cron jobs + skills + isolated sessions to create pipelines that run without you:
- Daily: agent runs a scan relevant to your role, summarizes findings
- Weekly: digest with progress, blockers, and recommendations
- Before events: auto-prep based on calendar

**Connect multiple tools.** The more tools connected, the more your agent can do independently. Email + Calendar + Drive together = real automation.

**Write compound skills.** Skills that call other skills — a "weekly strategy review" that pulls from research, task board, and memory to generate a report.

**Delegate more aggressively.** The goal: your agent handles the routine so you focus on what only you can do.

---

## Quick Reference

| What | Where |
|------|-------|
| Agent personality | `SOUL.md` |
| Role & operating mode | `IDENTITY.md` |
| User context & memory | `MEMORY.md` |
| Heartbeat checklist | `HEARTBEAT.md` |
| Operating rules & skills | `AGENTS.md` |
| Task board | `memory/task-board.md` |
| Daily notes | `memory/YYYY-MM-DD.md` |
| Skills | `skills/` directory |

**Something not working?**
- Agent confused about its role → Check IDENTITY.md
- Agent doesn't remember things → Check MEMORY.md
- Skills not firing → Check AGENTS.md skill definitions
- Research fails → Connect Brave Search (`BRAVE_API_KEY`)
- Gateway issues → Run `sudo -iu openclaw openclaw health`
