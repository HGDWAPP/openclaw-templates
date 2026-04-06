# Next Steps — Atlas (Investment Intelligence)

Your bot is configured. Here's how to make it sharper.

---

## 1. Review Your Context Files

| File | What to Check |
|------|--------------|
| **SOUL.md** | Is the investment analyst voice right? Too cautious? Not analytical enough? |
| **IDENTITY.md** | Is the daily rhythm (morning brief, evening summary) matching your actual schedule? |
| **AGENTS.md** | Review the investment intelligence loop. Does it match the sectors and signals you care about? |
| **USER.md** | Check your investment context, communication preferences, decision framework. Fill gaps. |
| **knowledge/thesis.md** | Is your investment thesis current? Add your sectors, check sizes, stage preferences, deal-breakers. |
| **knowledge/investment-patterns.md** | Add patterns you've observed — what makes a good deal in your portfolio, red flags, valuation benchmarks. |

**Quick test:** Ask *"What's my investment thesis?"* and *"What signals should I be watching?"* — if the answers are vague, your knowledge files need more detail.

---

## 2. Connect Your Tools

| Tool | What It Unlocks | Setup |
|------|----------------|-------|
| **Brave Search** | Deal sourcing, market research, company deep-dives, founder background checks. | Free key at [brave.com/search/api](https://brave.com/search/api) → `BRAVE_API_KEY` |
| **Google Drive** | Access to deal memos, diligence docs, portfolio reports. | OpenClaw dashboard → Integrations |
| **Email (MCP)** | Monitor deal flow emails, founder updates, LP communications. | MCP plugin in OpenClaw |
| **xAI (Grok)** | Real-time market signals, funding announcements, social sentiment on founders/companies. | [x.ai](https://x.ai) → `XAI_API_KEY` |
| **Google Calendar** | Track pitch meetings, board meetings, portfolio check-ins. | OpenClaw dashboard → Integrations |

Test after connecting: *"What funding rounds were announced in [your sector] this week?"*

---

## 3. Make It More Useful

**Start here:**
- Fill out your investment thesis in detail (knowledge/thesis.md) — sectors, stages, check sizes, what you pass on
- Ask for a market scan in your focus area and see what it surfaces
- Set up morning brief and evening summary cron jobs

**Then:**
- Use it to research companies before calls — *"Research [Company] and tell me if it fits my thesis"*
- Ask for weekly sector scans — funding rounds, exits, market shifts in your space
- Build pattern recognition — add your deal evaluation frameworks to knowledge/investment-patterns.md

**When you're ready:**
- Automate: Daily sector scan → Weekly deal flow digest → Monthly portfolio review prep
- Write custom skills for your investment workflows (each skill is a markdown file in `skills/`)
- Connect email + calendar so the agent tracks your deal pipeline and preps you before every pitch meeting

---

**Something not working?** Analysis is off-target → update your thesis and patterns files. Research fails → connect Brave Search. Gateway issues → `sudo -iu openclaw openclaw health`
