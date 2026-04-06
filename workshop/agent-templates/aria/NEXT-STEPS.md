# Next Steps — Aria (Brand Intelligence)

Your bot is configured. Here's how to make it sharper.

---

## 1. Review Your Context Files

| File | What to Check |
|------|--------------|
| **SOUL.md** | Is the brand strategist voice right for you? Too opinionated? Not opinionated enough? |
| **IDENTITY.md** | Is the daily rhythm (morning brief, evening recap) matching your actual schedule? |
| **AGENTS.md** | Review the content intelligence loop. Does it match the platforms and channels you care about? |
| **USER.md** | Check your communication preferences, content goals, team context. Fill gaps. |
| **knowledge/voice-samples.md** | Add real examples of your brand voice — past posts, emails, copy that nailed your tone. |
| **knowledge/feedback-patterns.md** | Add patterns: what content performs well, what flops, audience reactions you've noticed. |

**Quick test:** Ask *"What's my brand voice?"* and *"What content should I create this week?"* — if the answers are vague, your knowledge files need more detail.

---

## 2. Connect Your Tools

| Tool | What It Unlocks | Setup |
|------|----------------|-------|
| **Brave Search** | Competitor content scanning, trend research, audience insights. | Free key at [brave.com/search/api](https://brave.com/search/api) → `BRAVE_API_KEY` |
| **Google Analytics** | Real performance data for content recommendations. | MCP plugin in OpenClaw |
| **Google Drive** | Access to brand assets, strategy docs, content library. | OpenClaw dashboard → Integrations |
| **Canva API** | Visual content creation with your brand templates. | Canva Developer portal → OpenClaw auth config |
| **xAI (Grok)** | Real-time social signals and cultural pulse. | [x.ai](https://x.ai) → `XAI_API_KEY` |

Test after connecting: *"What are my competitors posting about this week?"*

---

## 3. Make It More Useful

**Start here:**
- Feed it 5-10 examples of your best content (paste into chat or add to knowledge/voice-samples.md)
- Ask for a content draft and give specific feedback — *"too formal," "more punchy," "shorter"*
- Set up morning brief and evening recap cron jobs

**Then:**
- Build a content calendar — tell it your posting schedule, platforms, themes
- Ask for weekly competitor scans — what are they doing that you're not?
- Use it to repurpose content — *"Turn this blog post into 3 LinkedIn posts and a tweet thread"*

**When you're ready:**
- Automate: Monday competitor scan → Wednesday content suggestions → Friday performance review
- Write custom skills for your content workflows (each skill is a markdown file in `skills/`)
- Connect analytics so recommendations are based on real data, not guesses

---

**Something not working?** Content off-brand → add more voice samples. Research fails → connect Brave Search. Gateway issues → `sudo -iu openclaw openclaw health`
