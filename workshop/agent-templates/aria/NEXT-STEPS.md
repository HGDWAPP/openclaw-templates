# Next Steps — Aria (Brand Intelligence)

Aria is your brand strategist. She scans for content opportunities, drafts in your voice, and pre-screens deliverables. Here's how to get her fully configured.

---

## Connect Your Tools

| Tool | Required? | Setup |
|------|-----------|-------|
| **Anthropic API** | Yes | Set `claude-sonnet-4-5` in OpenClaw auth config |
| **Telegram Bot** | Recommended | Create via [@BotFather](https://t.me/BotFather), add token in OpenClaw |
| **Brave Search API** | Recommended | Free key at [brave.com/search/api](https://brave.com/search/api) → set as `BRAVE_API_KEY` |
| **xAI API** | Optional | For X/Twitter monitoring → key at [x.ai](https://x.ai) → save to `~/.config/xai/api_key` |

Verify everything works:

```bash
openclaw health
# Then ask Aria: "Run a content scan for [your industry]"
```

---

## Fill Out Your Knowledge Base

This is what makes Aria useful. Without it, she's generic.

1. **`knowledge/voice-samples.md`** — Paste links to 3-5 of your best posts. Aria studies these to match your voice.
2. **`knowledge/feedback-patterns.md`** — Your quality bar. What makes content good or bad in your world? Common feedback you give on team work?
3. **`USER.md`** — Your name, business, platforms, content goals, audience.

**Spend 15 minutes here.** This is the highest-ROI setup step.

---

## Token Optimization

| Activity | Cost | How to Reduce |
|----------|------|---------------|
| Heartbeat (every 30 min) | ~500-1,500 tokens | Increase to every 2 hours if you don't need constant monitoring |
| Content scan (every 6 hours) | ~3,000-8,000 tokens | Reduce to once or twice daily |
| Morning brief / evening recap | ~2,000-4,000 each | Keep MEMORY.md under 200 lines |
| Content drafting | ~2,000-6,000 per draft | Give specific briefs — vague requests cost more |

**Quick wins:**
- Run content scans in `isolated` sessions (don't bloat your main chat)
- Archive daily notes older than 30 days
- Be specific: "Draft a LinkedIn post about X" costs less than "Write me some content"

**Cost tiers:** ~$5-15/month (light) · ~$20-40/month (daily rhythm) · ~$40-80/month (full production)

---

## Hardening & Security

```bash
# Gateway must be loopback, not lan
grep OPENCLAW_GATEWAY_BIND /opt/openclaw.env

# No API keys in workspace files
grep -r "sk-" . --include="*.md"
grep -r "API_KEY" . --include="*.md"

# Firewall
sudo ufw allow ssh && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw enable
```

**Content-specific security:**
- Aria never posts without your explicit approval
- Never paste untrusted content directly into chat — use the content scanner skill instead
- Your voice-samples.md and feedback-patterns.md contain competitive intelligence — keep them in your workspace only

---

## Beginner — First Week

**Day 1:** Talk to Aria. Tell her about your business and content goals.

**Day 2:** Ask her to run a content scan: *"What should I post about this week?"* She'll search trending topics in your space and suggest angles.

**Day 3:** Draft your first post: *"Draft a LinkedIn post about [topic you know well]."* Give voice feedback: *"Too formal. I'm more casual and use short sentences."*

**Day 4:** Have her review something: *"Review this draft: [paste content]. Is it on-brand?"* She'll score it against your feedback patterns.

**Day 5:** Set up the daily rhythm — enable the morning brief and evening recap cron jobs from BOOTSTRAP.md.

---

## Intermediate — Weeks 2-4

- **Set up all cron jobs** from BOOTSTRAP.md (content scan every 6 hours, morning brief, evening recap)
- **Build a content calendar:** *"Create a content calendar for the next 2 weeks. I post 3x/week on LinkedIn and 2x on Instagram."*
- **Monitor competitors:** *"What has [competitor] been posting this week? What's getting engagement?"*
- **Refine your voice:** Keep giving feedback on drafts. Aria stores patterns in MEMORY.md and improves over time.
- **Track performance:** Share your post analytics with Aria so she can learn what works.

---

## Advanced — Month 2+

- **Automated content pipeline:** Content scan finds angles → Aria drafts → you review and publish → she tracks performance → adjusts strategy
- **Multi-platform repurposing:** *"Take this LinkedIn post and adapt it for X thread + Instagram caption + newsletter intro"*
- **Team review system:** Have team members submit content to Aria for pre-screening against your quality bar before it reaches you
- **Build custom skills:** Create a `skills/brand-audit/SKILL.md` to periodically review your brand consistency across platforms
- **Knowledge graph:** Structure `knowledge/` with competitor-notes.md, content-calendar.md, and platform-specific performance data

---

## Quick Reference

| What You Want | What to Say |
|--------------|-------------|
| Content ideas | "What should I post about this week?" |
| Draft a post | "Draft a [platform] post about [topic]" |
| Review content | "Review this: [paste]. Is it on-brand?" |
| Competitor check | "What has [company] been posting?" |
| Content calendar | "Plan my content for next week" |
| Voice feedback | "Too [formal/casual/long]. I sound more like [example]" |
