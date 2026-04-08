# Next Steps — Atlas (Investment Intelligence)

Your bot is configured. Now let's make it actually useful for finding deals.

---

## 1. Review Your Context Files

Atlas's deal quality depends entirely on how well these files describe your investment thesis. Open each one and make sure it still feels right.

| File | What to Check |
|------|--------------|
| **SOUL.md** | Is the investment analyst voice working for you? Atlas defaults to "analytical, precise, numbers-forward, confident about analysis but humble about predictions." If you want more conviction or less hedging, adjust the Voice & Tone section. Check the pattern recognition framework — Atlas looks for Parallel, Convergence, Dislocation, and Infrastructure plays. Add or remove pattern types that match how you actually invest. |
| **IDENTITY.md** | Is the mission statement updated with YOUR name and YOUR fund focus? Is the daily rhythm right — morning market brief, throughout-day monitoring, evening summary? Adjust times to your actual schedule. Check Core Responsibilities — add any deal sourcing workflows specific to your approach (e.g., thesis-driven outbound, network-based deal flow). |
| **AGENTS.md** | Review the Investment Intelligence Loop (SENSE → SCORE → PROPOSE → REPORT → HUMAN DECISION). Is this the right flow for how you evaluate deals? Check the Structured Proposal Format — is Atlas surfacing the right fields (conviction score, pattern type, thesis match, risk flags, timing)? Review the priority buckets — does what counts as "urgent" (hot deal with closing timeline) match your deal pace? |
| **USER.md** | This is the most important file. Check every section: your name, role, fund/vehicle, timezone, stage focus, check size, sectors, geography, portfolio size, deals per year target, what makes you say yes, what makes you pass, decision framework, and quarterly goals. Empty fields = Atlas guesses instead of knowing. |
| **BOOTSTRAP.md** | This ran during setup. Verify it completed — ask Atlas *"Did bootstrap finish?"* If it didn't, run through the remaining steps. If it did, you can ignore this file. |
| **knowledge/thesis.md** | This is where Atlas learns WHAT you invest in. Add your full investment thesis: sectors, stages, check sizes, what you look for in founding teams, market dynamics that excite you, return expectations. Without this, Atlas can't score deals. This is the single most important knowledge file. |
| **knowledge/investment-patterns.md** | Add the pattern types you track: Parallel plays (success in one industry replicable in another), Convergence signals (two trends meeting), Dislocation events (market shifts creating windows), Infrastructure plays (picks-and-shovels for emerging categories). The more specific your pattern definitions, the better Atlas spots them. |

**Quick test:** Ask Atlas these three questions:
1. *"What's my thesis?"* — Should reference your investment thesis with specifics, not generic VC language
2. *"Find me opportunities"* — Should search and score against your thesis and pattern library
3. *"Score this company: [name a company you know well]"* — Should generate a structured proposal with conviction score, thesis match, and risk flags

If any answer is vague or generic, the corresponding file needs more detail.

---

## 2. Connect Your Tools

Atlas's intelligence loop depends on external data. Without Brave Search, the entire SENSE phase is blind — Atlas can only work with what you tell it.

| Tool | What It Unlocks | Setup |
|------|----------------|-------|
| **Brave Search API** | Funding round scanning, market news, tech trend research, founder background checks. This powers the SENSE phase of the investment intelligence loop. Without it, Atlas can't proactively surface deals. | Free key at [brave.com/search/api](https://brave.com/search/api) → set as BRAVE_API_KEY in your environment |
| **Google Drive** | Access to your deal memos, term sheets, portfolio docs, market research. Atlas can reference past deals when evaluating new ones and pull in your existing research. | Connect via OpenClaw dashboard → Integrations |
| **Email MCP** | Monitor inbound deal flow, founder intros, and market signals from your inbox. Atlas can flag high-priority deals and extract opportunity data from forwarded decks and intros. | Configure in OpenClaw MCP settings |
| **xAI (Grok)** | Real-time social signals — track what founders, VCs, and industry leaders are saying on X. Good for spotting funding announcements, market shifts, and sentiment changes before they hit mainstream news. | Key at [x.ai](https://x.ai) → set as XAI_API_KEY |
| **Google Calendar** | Track partner meetings, founder calls, demo days, and deal deadlines. Atlas can prepare briefing docs before meetings and flag when deals are approaching close dates. | Connect via MCP plugin in OpenClaw |
| **OpenRouter** | Access to multiple models. Route simple tasks (quick lookups, formatting) to cheap models, save your Anthropic budget for deep deal analysis and thesis-level reasoning. | Key at [openrouter.ai](https://openrouter.ai) → add in OpenClaw auth config |

**After connecting each tool, test it:**

- *"What funding rounds were announced this week in [your sector]?"* (needs Brave Search)
- *"Research [company name] and score against my thesis"* (needs Brave Search)
- *"What are founders in [your space] talking about on X?"* (needs xAI)

---

## 3. Token Optimization

Investment analysis agents can burn tokens fast — deep research, scoring, and market scanning add up. Keep costs reasonable without missing deals.

**Quick wins:**
- Set heartbeat to 60 min instead of 30 (saves ~50% on heartbeat costs)
- Use isolated sessions for signal scans and market research (keeps main chat context small)
- Be specific — *"Find pre-seed AI infrastructure companies that launched in the last 90 days with technical founders"* costs less and returns better results than *"Find me deals"*
- Keep MEMORY.md under 200 lines — Atlas reads it every session start
- Archive daily notes older than 30 days
- Set signal scan cron to every 6 hours instead of every 2 — funding rounds don't close in hours

**What costs what:**
| Activity | Cost |
|----------|------|
| Quick chat message | $ |
| Morning brief / evening summary | $ |
| Heartbeat check | $ |
| Single deal score and proposal | $$ |
| Market signal scan (full SENSE cycle) | $$ |
| Deep company research with competitive analysis | $$$ |
| Full pipeline review with re-scoring | $$$ |

**Monthly cost tiers:**
- Light (chat + daily briefs): ~$5-15
- Active (+ signal scans + deal scoring): ~$15-50
- Heavy (daily scanning + deep research + full pipeline management): ~$50-100

---

## 4. Hardening

- Verify gateway only listens locally: check that OPENCLAW_GATEWAY_BIND=loopback in /opt/openclaw.env
- Firewall — only allow SSH (22), HTTPS (443), and HTTP (80). Block everything else incoming.
- Never paste API keys in chat — set them in environment variables or OpenClaw auth config
- Deal intelligence is confidential — never cross-reference between active deals
- Prompt injection defense is built into SOUL.md — don't remove the Security section
- Don't open port 18789 directly — Caddy handles HTTPS and proxies to gateway
- Atlas's boundary rules (NEVER contact founders without approval, NEVER share deal intelligence externally, NEVER execute transactions) are in SOUL.md — don't weaken them
- If Atlas flags data as "estimated," don't treat it as verified — the transparency protocol exists for a reason

---

## 5. Beginner — First Week

**Day 1-2: Feed it your thesis.** This is the most important thing you do. Atlas can't score deals without a thesis to score against.

- Write your full investment thesis in knowledge/thesis.md — sectors, stages, check sizes, what excites you, what you pass on, return expectations
- Define your pattern library in knowledge/investment-patterns.md — what types of opportunities have you historically invested in? What patterns repeat?
- Fill out every field in USER.md — especially stage focus, check size, sectors, geography, and what makes you say yes/pass
- Tell Atlas about your current portfolio in chat — it'll capture them in memory and watch for adjacency signals

**Day 3: Try a deal score.** Pick a company you already know well and ask: *"Score [company name] against my thesis."* Atlas should generate a structured proposal with conviction score, pattern type, thesis match dimensions, risk flags, timing assessment, and recommended action. Compare the output to your own assessment:
- Is the conviction score reasonable?
- Did it catch the right thesis match dimensions?
- Did it flag the risks you'd flag?
- If the output is off → your thesis file needs more specificity

**Day 4: Run a signal scan.** Ask: *"Scan for funding rounds and market signals in [your sectors] from the past week."* (Requires Brave Search.) Atlas returns scored signals using the Investment Intelligence Loop format — company snapshot, conviction score, pattern type, thesis match, recommended action.

**Day 5: Let the cron jobs run.** Morning brief and pattern watch should already be set up from bootstrap. If not:
- Set up morning brief (8 AM weekdays): overnight funding rounds, market shifts matching thesis, pipeline status
- Set up signal scan (every 6 hours): funding news, tech trends, market signals scored against thesis
- Set up pattern watch (2 PM weekdays): emerging patterns across sectors — Parallel, Convergence, Dislocation, Infrastructure
- Let them run for 3-4 days before judging — the first few will be thin until Atlas has more memory

**End of week, ask yourself:**
- Is Atlas scoring deals consistently with your own judgment?
- Is the signal scan surfacing relevant companies or noise?
- Are the pattern types making sense for your investment style?
- Is the conviction threshold right? (Too low = noise, too high = missed deals)
- Is Atlas remembering your feedback and preferences across conversations?

---

## 6. Intermediate — Weeks 2-4

**Build a deal pipeline.** Create knowledge/pipeline.md with your current deals: company name, stage, conviction score, check size, next step, key risk, close timeline. Atlas monitors these and flags when deals stall, new intel surfaces, or follow-on timing is right.

**Add portfolio tracking.** Create knowledge/portfolio.md with your current investments: company name, investment date, check size, current status, key metrics. Atlas watches for adjacency signals — companies in your portfolio's orbit that might be interesting, competitive threats to portfolio companies, potential synergies.

**Build a market map.** Create knowledge/market-map.md with the sectors you care about: key players, emerging companies, funding trends, technology shifts. Atlas watches for sector-level patterns and flags when a space you're tracking starts heating up or cooling down.

**Try thesis backtesting.** Ask Atlas: *"Based on my thesis and the deals I've passed on vs invested in, what patterns do you see in my decision-making?"* This surfaces blind spots and hidden preferences you might not have articulated.

**Refine scoring criteria.** After seeing 20-30 scored deals, you'll know if the conviction scores are calibrated. Adjust knowledge/thesis.md and knowledge/investment-patterns.md based on what you've learned. The scores should match your gut within +/- 1 point.

---

## 7. Advanced — Month 2+

**Build an automated deal flow pipeline.** Combine cron jobs + isolated sessions:
- Monday AM: Atlas scans market for new signals, scores and ranks opportunities
- Tuesday-Wednesday: You review structured proposals, approve deeper research, Atlas does deep dives on approved targets
- Thursday: Pattern watch — what's emerging across sectors, what themes are forming
- Friday: Pipeline review — deal progress, risk flags, stale opportunities, follow-on timing
- Weekly: Market trend summary — sector heat map, funding velocity, emerging themes

**Write custom investment skills.** Each skill is a markdown file in skills/. Create skills for your specific workflows:
- Deal memo template (your standard deep-dive format)
- Founder background research template
- Competitive landscape analysis format
- Follow-on assessment framework
- Sector thesis generator (structured framework for building sector-level theses)
- LP update data collector (gather portfolio metrics for reporting)

**Connect the full intelligence stack.** Brave + Email + Drive + Calendar together let Atlas:
- Scan external markets for deal signals
- Monitor inbound deal flow from email
- Reference past deal memos and research
- Prepare briefings before founder meetings
- Build a complete pipeline from signal to structured proposal

**Tune the Investment Intelligence Loop.** Edit AGENTS.md to adjust:
- What sources Atlas monitors (add funding databases, tech blogs, industry communities, AngelList, Crunchbase)
- How it calculates conviction scores (weight the thesis dimensions that best predict your actual decisions)
- What triggers a structured proposal vs what gets filed as awareness
- The conviction threshold for surfacing deals (calibrate based on your hit rate)
- Pattern type definitions (refine based on patterns you've actually seen play out)
- The communication format for reporting

**The goal:** You check your morning brief, review 2-3 structured deal proposals, approve deeper research or request intros, and move on. The scanning, scoring, pattern matching, and pipeline monitoring happen around you.

---

## Quick Reference

| What | Where |
|------|-------|
| Atlas's personality and voice | SOUL.md |
| Role, mission and daily rhythm | IDENTITY.md |
| Operating rules and intelligence loop | AGENTS.md |
| Your preferences and goals | USER.md |
| First-run setup | BOOTSTRAP.md |
| Learned patterns about you | MEMORY.md |
| Your investment thesis | knowledge/thesis.md |
| Pattern library | knowledge/investment-patterns.md |
| Deal pipeline | knowledge/pipeline.md |
| Portfolio companies | knowledge/portfolio.md |
| Sector landscape | knowledge/market-map.md |
| Daily activity log | memory/YYYY-MM-DD.md |

**Something not working?**
- Deal scores don't match your judgment → Update knowledge/thesis.md with more specifics
- Atlas misses patterns → Refine knowledge/investment-patterns.md with examples
- Research/scanning fails → Connect Brave Search (BRAVE_API_KEY)
- Morning briefs are empty → Check that cron jobs are running and heartbeat is enabled
- Atlas forgets your feedback → Check MEMORY.md — if empty, it's not persisting learnings
- Everything scores too high → Your thesis is too broad — add specific pass criteria
- Atlas flags data as estimated → This is correct behavior (transparency protocol) — verify before acting
- Gateway issues → Run: sudo -iu openclaw openclaw health
