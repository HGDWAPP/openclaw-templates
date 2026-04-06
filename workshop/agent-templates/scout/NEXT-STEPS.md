# Next Steps — Scout (GTM Intelligence)

Your bot is configured. Now let's make it actually useful for finding opportunities.

---

## 1. Review Your Context Files

Scout's market intelligence is only as good as the context you gave it. Open each file and make sure it still feels right.

| File | What to Check |
|------|--------------|
| **SOUL.md** | Is the GTM strategist voice working for you? Scout defaults to "sharp, analytical, numbers-driven." If you want warmer delivery or more narrative context around data, adjust the Voice & Tone section. Check the Transparency Protocol — Scout is wired to flag uncertainty and label estimates. Make sure that matches how you want market intel delivered. |
| **IDENTITY.md** | Is the mission statement updated with YOUR name and YOUR market? Is the daily rhythm right — morning brief, throughout-day monitoring, evening summary? Adjust times to your actual schedule. Check Core Responsibilities — add any GTM workflows specific to your business (e.g., partner channel tracking, event-based selling). |
| **AGENTS.md** | Review the Market Intelligence Loop (SENSE → SCORE → PROPOSE → REPORT → HUMAN DECISION). Is this the right flow for how you evaluate opportunities? Check the priority buckets — does what counts as "urgent" (act within 2 hours) match your sales cycle? Review the Structured Opportunity Format — is Scout surfacing the right fields? |
| **USER.md** | This is the most important file. Check every section: your name, role, company, timezone, target market, ICP, sales cycle length, deal size, team context, decision framework, and quarterly goals. Empty fields = Scout guesses instead of knowing. |
| **BOOTSTRAP.md** | This ran during setup. Verify it completed — ask Scout *"Did bootstrap finish?"* If it didn't, run through the remaining steps. If it did, you can ignore this file. |
| **knowledge/icp.md** | This is where Scout learns WHO you're selling to. Add your ideal customer profile in detail: company size, industry, tech stack, buying signals, disqualifiers. The more specific, the fewer false positives in opportunity scoring. |
| **knowledge/competitor-landscape.md** | Add your competitors: who they are, their positioning, pricing, strengths, weaknesses, and where they win deals you lose. Scout uses this to spot competitive displacement opportunities and flag when competitors make moves. |

**Quick test:** Ask Scout these three questions:
1. *"What's my ICP?"* — Should reference your ideal customer profile with specifics, not generic descriptions
2. *"Find me opportunities this week"* — Should search and score against your ICP and market criteria
3. *"Who are my top competitors and where do they beat us?"* — Should reference your competitor landscape file

If any answer is vague or generic, the corresponding file needs more detail.

---

## 2. Connect Your Tools

Scout's market intelligence loop depends on external data. Without Brave Search, the entire SENSE phase is blind — Scout can only work with what you tell it.

| Tool | What It Unlocks | Setup |
|------|----------------|-------|
| **Brave Search API** | Market scanning, competitor monitoring, lead research, industry news. This powers the SENSE phase of the intelligence loop. Without it, Scout can't proactively find opportunities. | Free key at [brave.com/search/api](https://brave.com/search/api) → set as BRAVE_API_KEY in your environment |
| **Google Analytics** | Website visitor data, traffic sources, conversion funnels. Scout can correlate marketing activities with pipeline and tell you which channels actually drive qualified leads. | Connect via MCP plugin in OpenClaw |
| **Google Drive** | Access to sales decks, case studies, battle cards, pricing docs. Scout can reference these when building opportunity proposals instead of working from memory. | Connect via OpenClaw dashboard → Integrations |
| **Email MCP** | Monitor inbound leads, partnership inquiries, and market signals from your inbox. Scout can flag high-priority emails and extract opportunity data automatically. | Configure in OpenClaw MCP settings |
| **xAI (Grok)** | Real-time social signals — track what prospects, competitors, and industry influencers are saying on X. Good for spotting buying signals and market shifts before they hit the news. | Key at [x.ai](https://x.ai) → set as XAI_API_KEY |
| **OpenRouter** | Access to multiple models. Route simple tasks (quick lookups, formatting) to cheap models, save your Anthropic budget for deep market analysis and opportunity scoring. | Key at [openrouter.ai](https://openrouter.ai) → add in OpenClaw auth config |

**After connecting each tool, test it:**

- *"What are my competitors doing this week?"* (needs Brave Search)
- *"Find companies that match my ICP that recently raised funding"* (needs Brave Search)
- *"What's trending in [your market] right now?"* (needs Brave Search)

---

## 3. Token Optimization

Market intelligence agents can burn tokens fast — scanning, scoring, and deep research add up. Keep costs reasonable without missing opportunities.

**Quick wins:**
- Set heartbeat to 60 min instead of 30 (saves ~50% on heartbeat costs)
- Use isolated sessions for market scans and competitor research (keeps main chat context small)
- Be specific — *"Find Series A B2B SaaS companies in fintech that launched in the last 90 days"* costs less and returns better results than *"Find me leads"*
- Keep MEMORY.md under 200 lines — Scout reads it every session start
- Archive daily notes older than 30 days
- Set market scan cron to every 6 hours instead of every 2 — markets don't move that fast for most B2B cycles

**What costs what:**
| Activity | Cost |
|----------|------|
| Quick chat message | $ |
| Morning brief / evening summary | $ |
| Heartbeat check | $ |
| Single opportunity score and research | $$ |
| Market scan (full SENSE cycle) | $$ |
| Deep competitive analysis | $$$ |
| Full pipeline review with scoring | $$$ |

**Monthly cost tiers:**
- Light (chat + daily briefs): ~$5-15
- Active (+ market scans + opportunity scoring): ~$15-50
- Heavy (daily scanning + deep research + full pipeline management): ~$50-100

---

## 4. Hardening

- Verify gateway only listens locally: check that OPENCLAW_GATEWAY_BIND=loopback in /opt/openclaw.env
- Firewall — only allow SSH (22), HTTPS (443), and HTTP (80). Block everything else incoming.
- Never paste API keys in chat — set them in environment variables or OpenClaw auth config
- Don't share competitive intelligence through unsecured channels — Scout's deal intel is confidential
- Prompt injection defense is built into SOUL.md — don't remove the Security section
- Don't open port 18789 directly — Caddy handles HTTPS and proxies to gateway
- Scout's boundary rules (NEVER contact prospects without approval, NEVER share deal intelligence externally) are in SOUL.md — don't weaken them
- The Transparency Protocol ensures Scout labels estimates and flags uncertainty — don't disable this

---

## 5. Beginner — First Week

**Day 1-2: Feed it your market context.** This is the most important thing you do. Scout can't find the right opportunities without knowing what "right" looks like.

- Fill out knowledge/icp.md with your ideal customer profile — be as specific as possible (company size, industry, tech stack, buying signals, budget range)
- Fill out knowledge/competitor-landscape.md — who are you competing against, where do they win, where do you win?
- Fill out every field in USER.md — especially target market, deal size, sales cycle, and quarterly goals
- Tell Scout about your current pipeline and active deals in chat — it'll capture them in memory

**Day 3: Try an opportunity scan.** Ask: *"Scan for companies matching my ICP that recently raised funding or announced expansion."* (Requires Brave Search.) Scout returns structured opportunities using the Market Intelligence Loop format — company snapshot, ICP match score, timing assessment, recommended action.

**Day 4: Run a competitor check.** Ask: *"What have my competitors been up to this week?"* Scout scans for product launches, pricing changes, new partnerships, key hires, and positioning shifts. Review the results — if Scout is tracking the wrong competitors, update competitor-landscape.md.

**Day 5: Let the cron jobs run.** Morning brief and evening summary should already be set up from bootstrap. If not:
- Set up morning brief (8 AM weekdays): overnight market signals, new opportunities, pipeline status
- Set up evening summary (6 PM weekdays): opportunities scored today, competitor moves, tomorrow's focus
- Let them run for 3-4 days before judging — the first few will be thin until Scout has more memory

**End of week, ask yourself:**
- Is Scout surfacing relevant opportunities or noise?
- Are the ICP match scores making sense? If everything scores high, your ICP is too broad.
- Is the competitor monitoring catching real moves?
- Is the priority bucketing right? (Urgent vs Important vs Awareness)
- Is Scout remembering your feedback across conversations?

---

## 6. Intermediate — Weeks 2-4

**Build a pipeline tracker.** Create knowledge/pipeline.md with your current deals: company name, stage, deal size, next step, close date, risk factors. Scout monitors these and flags when deals stall, competitors enter, or new intel surfaces.

**Set up lead scoring criteria.** Tell Scout your scoring framework in chat or add it to knowledge/icp.md. Example: team quality (30%), market timing (25%), product-market fit (25%), competitive position (20%). Scout applies this consistently to every opportunity.

**Create market segment tracking.** Add knowledge/market-map.md with the segments you care about — which are growing, shrinking, converging. Scout watches for shifts and flags when a segment you're in (or watching) changes trajectory.

**Try outbound research.** Give Scout a target account list and ask: *"Research these 10 companies and score them against my ICP."* Scout returns structured profiles with match scores, risk flags, and recommended approach for each.

**Use the intelligence for content.** Ask Scout: *"Based on what you're seeing in the market, what content would resonate with my ICP right now?"* Combines market intelligence with your positioning to suggest thought leadership angles.

**Refine everything.** By week 3, you'll know what works. Open MEMORY.md and check what Scout has learned about your patterns. Correct anything wrong. Update your ICP if you've learned what actually converts.

---

## 7. Advanced — Month 2+

**Build an automated GTM pipeline.** Combine cron jobs + isolated sessions:
- Monday AM: Scout scans market for new opportunities matching ICP, scores and ranks them
- Tuesday-Wednesday: You review proposals, approve outreach targets, Scout does deep research on approved targets
- Thursday: Competitive intelligence roundup — what competitors shipped, said, or changed
- Friday: Pipeline review — deal progress, risk flags, opportunities going stale
- Weekly: Market trend summary — what's shifting, what's emerging, what to watch

**Write custom GTM skills.** Each skill is a markdown file in skills/. Create skills for your specific workflows:
- Account research template (standard deep-dive format for target accounts)
- Competitive battle card generator (structured comparison format)
- ICP scoring rubric (standardized evaluation across all opportunities)
- Win/loss analysis format (structured post-deal learning)
- Market signal taxonomy (how to categorize and prioritize different signal types)

**Connect the full intelligence stack.** Brave + Email + Analytics + Drive together let Scout:
- Scan external markets for opportunities
- Monitor inbound signals from email and web traffic
- Correlate marketing activities with pipeline
- Reference your sales materials when building proposals
- Build a complete intelligence pipeline from signal to proposal

**Tune the Market Intelligence Loop.** Edit AGENTS.md to adjust:
- What sources Scout monitors (add industry-specific databases, news sources, communities)
- How it scores ICP fit (weight the factors that actually predict conversion)
- What triggers a structured proposal vs what gets filed as awareness
- The conviction threshold for surfacing opportunities (too low = noise, too high = missed deals)
- The communication format for reporting

**The goal:** You check your morning brief, review 2-3 structured proposals, approve or redirect, and move on. The scanning, scoring, research, and pipeline monitoring happen around you.

---

## Quick Reference

| What | Where |
|------|-------|
| Scout's personality and voice | SOUL.md |
| Role, mission and daily rhythm | IDENTITY.md |
| Operating rules and intelligence loop | AGENTS.md |
| Your preferences and goals | USER.md |
| First-run setup | BOOTSTRAP.md |
| Learned patterns about you | MEMORY.md |
| Ideal customer profile | knowledge/icp.md |
| Competitor analysis | knowledge/competitor-landscape.md |
| Deal pipeline | knowledge/pipeline.md |
| Market segment map | knowledge/market-map.md |
| Daily activity log | memory/YYYY-MM-DD.md |

**Something not working?**
- Opportunities don't match your market → Update knowledge/icp.md with more specific criteria
- Scout misses competitors → Update knowledge/competitor-landscape.md
- Research/scanning fails → Connect Brave Search (BRAVE_API_KEY)
- Morning briefs are empty → Check that cron jobs are running and heartbeat is enabled
- Scout forgets your feedback → Check MEMORY.md — if empty, it's not persisting learnings
- Everything scores too high → Your ICP is too broad — add disqualifiers
- Gateway issues → Run: sudo -iu openclaw openclaw health
