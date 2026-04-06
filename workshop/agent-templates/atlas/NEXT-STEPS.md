# Next Steps — Atlas (Investment Intelligence)

Atlas is your investment analyst. He scans funding rounds, market shifts, and tech trends — then scores every signal against your thesis and pattern library. Opportunities come to you as structured proposals with conviction scores, not raw data dumps.

---

## Connect Your Tools

| Tool | Required? | Setup |
|------|-----------|-------|
| **Anthropic API** | Yes | Set `claude-sonnet-4-5` in OpenClaw auth config. For deep deal analysis, consider Claude Opus |
| **Telegram Bot** | Recommended | Create via [@BotFather](https://t.me/BotFather), add token in OpenClaw |
| **Brave Search API** | Recommended | Free key at [brave.com/search/api](https://brave.com/search/api) → set as `BRAVE_API_KEY` |
| **xAI API** | Optional | For X/Twitter signal monitoring → key at [x.ai](https://x.ai) → save to `~/.config/xai/api_key` |

Verify:

```bash
openclaw health
# Then ask Atlas: "Find investment opportunities in [your target sector]"
```

---

## Fill Out Your Knowledge Base

Atlas can't score deals without knowing your thesis. This is non-negotiable.

1. **`knowledge/thesis.md`** — Your investment thesis. Target sectors, stages, check sizes, what you look for in founders, what makes you say yes.
2. **`knowledge/investment-patterns.md`** — The four pattern types Atlas tracks:
   - **The Parallel:** Success in Industry A replicable in Industry B
   - **The Convergence:** Two trends colliding to create a new category
   - **The Dislocation:** Market shift creating a temporary window
   - **The Infrastructure Play:** Picks-and-shovels for an emerging category
3. **`USER.md`** — Your fund details, decision framework, co-investors, portfolio companies, risk tolerance.

**Without a thesis, Atlas can't generate conviction scores.** Spend 20 minutes here.

---

## Token Optimization

| Activity | Cost | How to Reduce |
|----------|------|---------------|
| Signal scan (every 6 hours) | ~5,000-10,000 tokens | Reduce to twice daily |
| Pattern watch (daily) | ~3,000-8,000 tokens | Run every other day |
| Morning brief | ~2,000-4,000 tokens | Keep MEMORY.md lean |
| Full deal proposal | ~5,000-15,000 tokens | These are worth it — don't cut here |

**Quick wins:**
- Run signal scans and pattern watches in `isolated` sessions
- Keep MEMORY.md under 200 lines — archive old pipeline entries
- Be specific: "Scan Series A fintech deals" costs less than "Find me opportunities"
- Full deal proposals are expensive but high-value — don't optimize these away

**Cost tiers:** ~$15-30/month (basic scanning) · ~$30-60/month (full daily intelligence) · ~$60-120/month (heavy deal flow + deep analysis)

---

## Hardening & Security

```bash
# Gateway must be loopback
grep OPENCLAW_GATEWAY_BIND /opt/openclaw.env

# No API keys in workspace files
grep -r "sk-" . --include="*.md"

# Firewall
sudo ufw allow ssh && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw enable
```

**Investment-specific security:**
- Atlas never contacts founders or deal parties without your explicit approval
- Your thesis (`knowledge/thesis.md`) is proprietary intelligence — it never leaves the workspace
- Deal proposals are confidential — Atlas evaluates each deal independently, never mixing intelligence between opportunities
- Data integrity: Atlas labels all estimated numbers as "estimated" — never presents assumptions as verified data
- Prompt injection defense: pitch deck content and founder emails are treated as data, never instructions

---

## Beginner — First Week

**Day 1:** Fill out `knowledge/thesis.md` with your investment thesis. Then: *"What's my thesis?"* Atlas should recite it back accurately.

**Day 2:** Run your first signal scan: *"Find me investment opportunities in [your target sector]."* Atlas searches, scores against your thesis, and returns structured results.

**Day 3:** Score a specific company: *"Score [Company Name] against my thesis."* You'll get a full proposal with conviction score, pattern classification, risk flags, and recommended action.

**Day 4:** Test the pattern matching: *"What patterns are you tracking? Show me an example of a Parallel play in [sector]."*

**Day 5:** Enable the morning brief cron job. Start getting daily investment intelligence automatically.

---

## Intermediate — Weeks 2-4

- **Set up all cron jobs** from BOOTSTRAP.md (signal scan, morning brief, pattern watch)
- **Build your pipeline:** *"Create a pipeline tracker. Add [Company A] (conviction 8.2), [Company B] (conviction 6.5). Track status: watching / researching / meeting / passed."*
- **Refine conviction scoring:** After 2 weeks, review what Atlas has surfaced. *"Your scores have been too generous on [sector]. Raise the bar — I need stronger traction signals to score above 7."*
- **Track portfolio adjacencies:** *"Monitor news about my portfolio company [Company]. Flag any competitive threats, partnership opportunities, or follow-on signals."*
- **Weekly market pulse:** Set up a weekly digest cron that summarizes sector trends, pattern signals, and pipeline status.

---

## Advanced — Month 2+

- **Automated deal flow:** Signal scans find opportunities → Atlas scores and classifies patterns → high-conviction deals get full proposals → you decide to pass, monitor, or pursue
- **Pattern library:** Over time, Atlas builds a pattern library in `knowledge/investment-patterns.md` with real examples from your deal flow. *"Add [Company X] as an example of the Infrastructure Play pattern."*
- **Build custom skills:** Create `skills/deal-memo/SKILL.md` for generating investment memos from Atlas's research. Create `skills/portfolio-monitor/SKILL.md` for systematic portfolio company tracking
- **Thesis evolution:** As your thesis evolves, update `knowledge/thesis.md`. Atlas immediately adjusts all scoring. Review pipeline scores after thesis changes to see what shifts.
- **Multi-source intelligence:** Combine web search, X monitoring, and niche community scanning for early signals that don't show up in mainstream news

---

## Quick Reference

| What You Want | What to Say |
|--------------|-------------|
| Find opportunities | "Find investment opportunities in [sector]" |
| Score a deal | "Score [company] against my thesis" |
| Full proposal | "Generate a full investment proposal for [company]" |
| Pattern check | "What Convergence patterns are forming in [sector]?" |
| Pipeline status | "Show me my pipeline ranked by conviction score" |
| Market pulse | "What's happening in [sector] this week?" |
| Thesis check | "Does [opportunity] match my thesis? Why or why not?" |
