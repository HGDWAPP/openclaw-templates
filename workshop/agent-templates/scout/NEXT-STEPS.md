# Next Steps — Scout (GTM Intelligence)

Your bot is configured. Here's how to make it sharper.

---

## 1. Review Your Context Files

| File | What to Check |
|------|--------------|
| **SOUL.md** | Is the GTM strategist voice right? Too analytical? Not data-driven enough? |
| **IDENTITY.md** | Is the daily rhythm (morning brief, evening summary) matching your actual schedule? |
| **AGENTS.md** | Review the market intelligence loop. Does it match the markets and signals you care about? |
| **USER.md** | Check your business context, communication preferences, decision framework. Fill gaps. |
| **knowledge/icp.md** | Is your Ideal Customer Profile accurate? Add detail — demographics, pain points, buying triggers, objections. |
| **knowledge/influencer-frameworks.md** | Add the influencers, analysts, and thought leaders you actually follow in your space. |

**Quick test:** Ask *"Who's my ideal customer?"* and *"What GTM signals should I be watching?"* — if the answers are vague, your knowledge files need more detail.

---

## 2. Connect Your Tools

| Tool | What It Unlocks | Setup |
|------|----------------|-------|
| **Brave Search** | Market research, competitor tracking, ICP signal scanning. | Free key at [brave.com/search/api](https://brave.com/search/api) → `BRAVE_API_KEY` |
| **Google Analytics** | Real traffic and conversion data for GTM decisions. | MCP plugin in OpenClaw |
| **Google Drive** | Access to sales decks, market research, strategy docs. | OpenClaw dashboard → Integrations |
| **Email (MCP)** | Monitor prospect conversations, partner outreach, market signals from inbox. | MCP plugin in OpenClaw |
| **xAI (Grok)** | Real-time market signals and social listening. | [x.ai](https://x.ai) → `XAI_API_KEY` |

Test after connecting: *"What's happening in my market this week?"*

---

## 3. Make It More Useful

**Start here:**
- Fill out your ICP in detail (knowledge/icp.md) — the more specific, the better the signal scanning
- Ask for a market scan and see what it surfaces
- Set up morning brief and evening summary cron jobs

**Then:**
- Ask for weekly competitor analysis — pricing changes, new features, positioning shifts
- Use it to research prospects before calls — *"Research [Company] and tell me how they fit our ICP"*
- Build a signal dashboard — what market moves should trigger action from you?

**When you're ready:**
- Automate: Daily market scan → Weekly competitor report → Monthly GTM review
- Write custom skills for your GTM workflows (each skill is a markdown file in `skills/`)
- Connect analytics + email so recommendations come from real pipeline data, not guesses

---

**Something not working?** Market intel is off → update your ICP and influencer files. Research fails → connect Brave Search. Gateway issues → `sudo -iu openclaw openclaw health`
