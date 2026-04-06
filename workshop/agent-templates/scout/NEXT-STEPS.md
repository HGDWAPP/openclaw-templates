# Next Steps — Scout (GTM Intelligence)

Scout is your go-to-market strategist. He scans markets, scores leads against your ICP, monitors competitors, and surfaces growth opportunities — all with full transparency on what he's doing and what it costs.

---

## Connect Your Tools

| Tool | Required? | Setup |
|------|-----------|-------|
| **Anthropic API** | Yes | Set `claude-sonnet-4-5` in OpenClaw auth config |
| **Telegram Bot** | Recommended | Create via [@BotFather](https://t.me/BotFather), add token in OpenClaw |
| **Brave Search API** | Recommended | Free key at [brave.com/search/api](https://brave.com/search/api) → set as `BRAVE_API_KEY` |
| **xAI API** | Optional | For X/Twitter market monitoring → key at [x.ai](https://x.ai) → save to `~/.config/xai/api_key` |

Verify:

```bash
openclaw health
# Then ask Scout: "Find me 3 leads in [your market]"
```

---

## Fill Out Your Knowledge Base

Scout is only as good as the criteria you give him.

1. **`knowledge/icp.md`** — Your Ideal Customer Profile. Who are you selling to? Industry, company size, pain points, budget signals, deal-breakers.
2. **`knowledge/influencer-frameworks.md`** — Growth frameworks you follow (Hormozi value equation, specific GTM playbooks, etc.)
3. **`USER.md`** — Your business, what you sell, target market, growth channels, risk tolerance.

**Without ICP data, Scout can't score leads.** This is the most important setup step.

---

## Token Optimization

| Activity | Cost | How to Reduce |
|----------|------|---------------|
| Market scan (every 6 hours) | ~3,000-8,000 tokens | Reduce to twice daily |
| Competitor watch (daily) | ~2,000-5,000 tokens | Run every other day instead |
| Morning brief | ~2,000-4,000 tokens | Keep MEMORY.md lean |
| Lead deep-dive | ~5,000-10,000 tokens | Be specific about what you want to know |

**Quick wins:**
- Run market scans and competitor watches in `isolated` sessions
- Keep MEMORY.md under 200 lines — remove old leads and completed experiments
- Scout logs API costs in his transparency log — check it weekly

**Cost tiers:** ~$10-20/month (basic monitoring) · ~$25-50/month (daily scans + competitor watch) · ~$50-100/month (full GTM intelligence)

**Scout's built-in spending cap:** $5/day on API calls unless you explicitly raise it. This is in his SOUL.md — adjust as needed.

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

**GTM-specific security:**
- Scout never sends outreach without your explicit approval
- Competitive intelligence files (`knowledge/icp.md`, `knowledge/competitor-landscape.md`) are proprietary — never share externally
- Scout's transparency protocol logs every proactive action with source and cost — review it periodically
- All lead/prospect data stays in your workspace — never exported without confirmation

---

## Beginner — First Week

**Day 1:** Fill out `knowledge/icp.md` and talk to Scout about your market. *"I sell [product] to [audience]. My ideal customer is [description]."*

**Day 2:** Run your first lead scan: *"Find me 3 companies that match my ICP."* Scout will search, score against your ICP, and explain why each one qualifies.

**Day 3:** Competitor intel: *"What are my top 3 competitors doing right now?"* He'll research their activity and flag opportunities.

**Day 4:** Try the frameworks: *"Evaluate this opportunity using the Hormozi value equation: [describe the opportunity]."*

**Day 5:** Enable the morning brief cron job. Start getting daily market intelligence automatically.

---

## Intermediate — Weeks 2-4

- **Set up all cron jobs** from BOOTSTRAP.md (market scan, morning brief, competitor watch)
- **Build your competitor landscape:** *"Add [Company A], [Company B], [Company C] to my competitor list. Monitor them weekly."* Scout saves to `knowledge/competitor-landscape.md`
- **Growth experiments:** *"Propose 3 growth experiments for [your channel]. Include hypothesis, test, metric, and effort level."* Scout applies frameworks from your knowledge base
- **Lead pipeline:** *"Create a lead pipeline tracker in memory/. Score and rank the top 10 leads we've found so far."*
- **Refine ICP scoring:** After 2 weeks of scans, review what Scout's been surfacing. *"The last 3 leads were too small. Update ICP to require $5M+ ARR."*

---

## Advanced — Month 2+

- **Automated lead pipeline:** Market scans find leads → Scout scores against ICP → you approve for outreach → Scout drafts the message → you send
- **Competitive war room:** Build `knowledge/competitor-landscape.md` into a living document that Scout updates weekly with pricing, positioning, and product changes
- **Build custom skills:** Create `skills/outreach-drafter/SKILL.md` for personalized outreach based on lead research. Create `skills/win-loss-tracker/SKILL.md` to track why deals close or don't
- **Cross-channel intelligence:** Combine web search, X monitoring, and email intel for a complete market picture
- **Growth experiment tracking:** Have Scout maintain a running log of experiments, results, and learnings. Every experiment feeds back into the next one.

---

## Quick Reference

| What You Want | What to Say |
|--------------|-------------|
| Find leads | "Find me leads matching my ICP in [market]" |
| Score a company | "Score [company] against my ICP" |
| Competitor check | "What's [competitor] doing right now?" |
| Growth ideas | "Propose growth experiments for [channel]" |
| Market scan | "What's happening in [industry] this week?" |
| Pipeline status | "Show me my lead pipeline ranked by ICP score" |
| Cost check | "Show me your transparency log from today" |
