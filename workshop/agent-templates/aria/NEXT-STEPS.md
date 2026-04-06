# Next Steps — Aria (Brand Intelligence)

Your bot is configured. Now let's make it actually useful for your brand.

---

## 1. Review Your Context Files

Aria's content quality depends entirely on how well these files describe your brand. Open each one and make sure it still feels right.

| File | What to Check |
|------|--------------|
| **SOUL.md** | Is the brand strategist voice working for you? Aria defaults to "sharp, opinionated, brand-obsessed." If that's too aggressive for your industry or style, soften it. If it's not aggressive enough, push it further. Check the "How Aria Sounds" table — are those examples close to what you'd want? |
| **IDENTITY.md** | Is the mission statement updated with YOUR name and YOUR industry? Is the daily rhythm right — morning brief, evening recap? Adjust times if you don't work a 9-5. Check Core Responsibilities — add any content workflows specific to your business. |
| **AGENTS.md** | Review the Content Intelligence Loop (SENSE → INTERPRET → DRAFT → REPORT → HUMAN DECISION). Is this the right flow for how you create content? Check the priority buckets — does what counts as "urgent" match your definition? |
| **USER.md** | This is the most important file. Check every section: your name, role, industry, timezone, content goals, platforms, posting cadence, topics you want to own, team context, decision framework, and quarterly goals. Empty fields = Aria guesses instead of knowing. |
| **BOOTSTRAP.md** | This ran during setup. Verify it completed — ask Aria *"Did bootstrap finish?"* If it didn't, run through the remaining steps. If it did, you can ignore this file. |
| **knowledge/voice-samples.md** | This is where Aria learns YOUR voice. Add 3-5 links to your best-performing posts — the ones that sound the most like you. Include posts from different platforms if your voice changes between X and LinkedIn. Without this, Aria writes generic content. |
| **knowledge/feedback-patterns.md** | Add your quality bar: what makes a post good vs bad in your eyes? What feedback do you always give? (e.g., "Always lead with a hook, not a question" or "Never use the word 'leverage'"). The more patterns here, the fewer revision rounds you'll need. |

**Quick test:** Ask Aria these three questions:
1. *"What's my brand voice?"* — Should reference your voice samples and match how you actually sound
2. *"What content should I create this week?"* — Should reference your platforms, topics, and posting cadence
3. *"Review this draft: [paste a recent post]"* — Should give specific, opinionated feedback based on your patterns

If any answer is vague or generic, the corresponding file needs more detail.

---

## 2. Connect Your Tools

Aria gets dramatically better with each tool you connect. Without Brave Search, she can't scan trends or competitors — her content intelligence loop is running blind.

| Tool | What It Unlocks | Setup |
|------|----------------|-------|
| **Brave Search API** | Competitor content scanning, trend research, audience insights. The entire SENSE phase of the content intelligence loop depends on this. Without it, Aria can only work with what you tell her. | Free key at [brave.com/search/api](https://brave.com/search/api) → set as BRAVE_API_KEY in your environment |
| **Google Analytics** | Real performance data instead of guessing. Aria can tell you which posts actually drove traffic, what topics resonate, and where your audience drops off. Makes the evening performance recap data-driven. | Connect via MCP plugin in OpenClaw |
| **Google Drive** | Access to your brand assets, strategy docs, content library, style guides. Aria can reference these when drafting instead of making things up. | Connect via OpenClaw dashboard → Integrations |
| **Canva API** | Visual content creation using your brand templates. Aria can draft social graphics that match your brand, not just text. | Key from Canva Developer portal → add in OpenClaw auth config |
| **xAI (Grok)** | Real-time social signals and cultural pulse. Good for spotting trending topics on X before they peak. Adds a second research source beyond Brave. | Key at [x.ai](https://x.ai) → set as XAI_API_KEY |
| **OpenRouter** | Access to multiple models. Route simple tasks (scheduling reminders, quick summaries) to cheap models, save your Anthropic budget for content drafts and brand analysis. | Key at [openrouter.ai](https://openrouter.ai) → add in OpenClaw auth config |

**After connecting each tool, test it:**

- *"What are my competitors posting about this week?"* (needs Brave Search)
- *"What's trending in [your industry] right now?"* (needs Brave Search)
- *"How did my last 5 posts perform?"* (needs Google Analytics)

---

## 3. Token Optimization

Content agents burn more tokens than most — drafting, revising, and research all add up. Keep costs reasonable without killing quality.

**Quick wins:**
- Set heartbeat to 60 min instead of 30 (saves ~50%% on heartbeat costs)
- Use isolated sessions for content scans and research (keeps main chat context small)
- Be specific — *"Draft a LinkedIn post about our product launch using the hook format from my voice samples"* costs less and produces better results than *"Write me something for LinkedIn"*
- Keep MEMORY.md under 200 lines — Aria reads it every session start
- Archive daily notes older than 30 days
- Set content scan cron to every 6 hours instead of every 2 — you don't need real-time trend scanning

**What costs what:**
| Activity | Cost |
|----------|------|
| Quick chat message | $ |
| Morning brief / evening recap | $ |
| Heartbeat check | $ |
| Single content draft with revision | $$ |
| Competitor content scan | $$ |
| Full content strategy session (research + multiple drafts) | $$$ |
| Batch content production (5+ posts) | $$$ |

**Monthly cost tiers:**
- Light (chat + daily briefs): ~$5-15
- Active (+ content drafts + competitor scans): ~$15-50
- Heavy (daily content production + research + full pipeline): ~$50-100

---

## 4. Hardening

- Verify gateway only listens locally: check that OPENCLAW_GATEWAY_BIND=loopback in /opt/openclaw.env
- Firewall — only allow SSH (22), HTTPS (443), and HTTP (80). Block everything else incoming.
- Never paste API keys in chat — set them in environment variables or OpenClaw auth config
- Don't share brand strategy docs through the chat — upload to Drive and connect via integration
- Prompt injection defense is built into SOUL.md — don't remove the Security section
- Don't open port 18789 directly — Caddy handles HTTPS and proxies to gateway
- Aria's boundary rules (NEVER post without approval, NEVER share unpublished content) are in SOUL.md — don't weaken them

---

## 5. Beginner — First Week

**Day 1-2: Feed it your brand.** This is the most important thing you do. The more Aria knows, the better every interaction gets.

- Paste 3-5 of your best-performing posts into knowledge/voice-samples.md with links
- Add your recurring feedback patterns to knowledge/feedback-patterns.md — things you always correct in content
- Fill out every field in USER.md — especially content goals, platforms, and posting cadence
- Tell Aria about your current projects, campaigns, and content themes in chat — she'll capture them in memory

**Day 3: Try a content draft.** Ask: *"Draft a LinkedIn post about [your recent project/insight]."* Read the draft critically:
- Does it sound like you, or like generic AI? If generic → add more voice samples
- Is the hook strong? If not → add "I like hooks that..." to feedback-patterns.md
- Give specific feedback: *"Too formal." "More punchy." "Make the hook a question."* Aria adjusts.

**Day 4: Run a content scan.** Ask: *"Scan what's trending in [your industry] and give me 3 content angles."* (Requires Brave Search.) Aria returns structured angles using the Content Intelligence Loop format — signal, why it matters for you, draft hook, recommended platform.

**Day 5: Let the cron jobs run.** Morning brief and evening recap should already be set up from bootstrap. If not:
- Set up morning brief (7:30 AM weekdays): content opportunities, pending reviews, yesterday's performance
- Set up evening recap (6 PM weekdays): what published, what landed, tomorrow's angles
- Let them run for 3-4 days before judging — the first few will be thin until Aria has more memory

**End of week, ask yourself:**
- Are the content drafts getting closer to my voice with each revision?
- Is the morning brief surfacing useful opportunities or just noise?
- Is Aria remembering my feedback across conversations?
- Is the tone right? If not, edit SOUL.md — the "Voice & Tone" and "How Aria Sounds" sections.

---

## 6. Intermediate — Weeks 2-4

**Build a content calendar.** Tell Aria your posting schedule — which platforms, how often, what themes rotate. She tracks deadlines, drafts ahead of schedule, and flags when you're falling behind.

Create knowledge/content-calendar.md with:
- Platforms and frequency (e.g., "LinkedIn 3x/week, X daily, newsletter biweekly")
- Content themes/pillars (e.g., "AI strategy, leadership, behind-the-scenes")
- Recurring series if any (e.g., "Friday Insights thread")

**Set up competitor monitoring.** Add competitors to knowledge/competitor-notes.md — who they are, what platforms they're on, what angles they take. Aria scans their content during the 6-hour content scan and flags interesting moves.

**Try team review workflows.** If your team submits content for review, tell Aria: *"Review this deck/post/copy against my quality bar."* She uses your feedback patterns to give specific, actionable notes — not generic "looks good."

**Use content repurposing.** Share a long-form piece and ask: *"Turn this blog post into 3 LinkedIn posts, a tweet thread, and a newsletter intro."* Aria adapts format and length per platform while keeping your voice.

**Refine everything.** By week 3, you'll know what works. Open MEMORY.md and check what Aria has learned about your patterns. Correct anything wrong. Add patterns she hasn't picked up yet.

---

## 7. Advanced — Month 2+

**Build an automated content pipeline.** Combine cron jobs + isolated sessions:
- Monday AM: Aria scans trends and competitors, proposes 3-5 content ideas with hooks
- Tuesday-Thursday: You approve angles, Aria drafts and queues posts for your review
- Friday: Content performance review — what worked, what didn't, what to double down on
- Sunday evening: Weekly digest with performance metrics, top-performing content patterns, next week's plan

**Write custom content skills.** Each skill is a markdown file in skills/. Create skills for your specific workflows:
- Launch announcement template (product launches, feature drops)
- Thread format (your specific thread structure)
- Newsletter outline generator
- Content brief for team members
- Client case study format

**Connect the full creative stack.** Analytics + Drive + Canva together let Aria:
- Pull real performance data into content recommendations
- Reference your strategy docs and brand guidelines when drafting
- Create visual assets that match your brand
- Build a complete production pipeline from idea to published post

**Tune the Content Intelligence Loop.** Edit AGENTS.md to adjust:
- What sources Aria monitors (add industry-specific blogs, newsletters, communities)
- How she scores relevance (weight factors toward what matters most to you)
- What triggers a content opportunity vs what gets filed as awareness
- The communication format she uses for reporting

**The goal:** You check your morning brief, approve or redirect content, give one round of feedback on drafts, and move on. The research, drafting, scheduling, and performance tracking happen around you.

---

## Quick Reference

| What | Where |
|------|-------|
| Aria's personality and voice | SOUL.md |
| Role, mission and daily rhythm | IDENTITY.md |
| Operating rules and intelligence loop | AGENTS.md |
| Your preferences and goals | USER.md |
| First-run setup | BOOTSTRAP.md |
| Learned patterns about you | MEMORY.md |
| Your brand voice examples | knowledge/voice-samples.md |
| Your content quality bar | knowledge/feedback-patterns.md |
| Content schedule | knowledge/content-calendar.md |
| Competitor tracking | knowledge/competitor-notes.md |
| Daily activity log | memory/YYYY-MM-DD.md |

**Something not working?**
- Content drafts sound generic → Add more voice samples to knowledge/voice-samples.md
- Aria doesn't know your quality bar → Fill out knowledge/feedback-patterns.md
- Research/scanning fails → Connect Brave Search (BRAVE_API_KEY)
- Morning briefs are empty → Check that cron jobs are running and heartbeat is enabled
- Aria forgets your feedback → Check MEMORY.md — if empty, she's not persisting learnings
- Tone is off → Edit SOUL.md — adjust Voice and Tone section
- Gateway issues → Run: sudo -iu openclaw openclaw health
