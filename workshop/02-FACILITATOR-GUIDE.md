# Facilitator Guide: OpenClaw Workshop
## Your Session-by-Session Script + Energy Management
### For Ja'dan -- April 2026

---

## Before They Arrive

### Room / Space Setup
- [ ] Music playing when people walk in (upbeat, confident -- something that says "we're about to do something cool")
- [ ] Laptops/stations ready (or confirm everyone's bringing their own)
- [ ] Shared Google Doc or Notion page for real-time notes and links
- [ ] Snacks and drinks visible (energy management is real)
- [ ] Each person's DigitalOcean droplet provisioned and tested
- [ ] Print or share the Participant Resources packet (digital is fine)
- [ ] Your own OpenClaw instance running as a demo
- [ ] Tempo running as a live example (if possible)

### Pre-Provisioned for Each Person
- [ ] DigitalOcean droplet IP + SSH password (write on a card or DM)
- [ ] OpenClaw pre-installed and configured on each droplet
- [ ] Confirm each person has:
  - [ ] OpenRouter API key (or help them set one up in Session 3)
  - [ ] Telegram installed on phone
  - [ ] A terminal app on their laptop (Terminal on Mac, Windows Terminal on PC)

### Know Your Room

Read the group before you start. Watch for:
- **Different tech comfort levels.** Some people use AI tools daily; others have never opened a terminal. Plan to go at the pace of the least comfortable person on technical steps.
- **Security-conscious participants.** If someone raises concerns about safety or privacy, validate them loudly -- "That's a smart question" -- and point to Session 4 where you'll go deep. Don't brush it off.
- **Fast movers.** If someone finishes a step early, give them a stretch goal: "While we wait, try customizing your SOUL.md with an extra boundary rule." Let them help others if they want to.
- **Quiet participants.** Check in 1:1 during exercises. "How's it going? Anything feel unclear?"

---

## SESSION 1: How to Think About This Stuff (0:00 - 0:40)

### Energy Target: Excited + Safe
They might not know what OpenClaw is. They might be nervous about "technical" stuff. Your job is: "this is going to be fun and you're going to crush it."

### Opening Script (0:00 - 0:05)

```
"Hey! Welcome. Before we start, I need you to know three things:

One -- there are no dumb questions today. Seriously. I'd rather you
ask something 'obvious' than sit there confused for 20 minutes.

Two -- done is better than perfect. We're going to write things that
are 'good enough for now' and improve them later. Your agent gets
better with time, so we're building version 1 today, not the final version.

Three -- have fun. You're about to build something genuinely cool.
Like, actually cool. Not 'corporate innovation workshop' cool.
ACTUALLY cool.

Here's what we're doing today: by 5 PM, each of you will have a
custom AI agent running on your phone. It'll know your business,
talk in your voice, and do work for you while you sleep. Let's go."
```

### Decomposition Exercise (0:05 - 0:25)

**Setup:** "We're going to start by learning how engineers think. Not because you need to BE engineers -- but because this one mental model unlocks everything."

Walk through the three principles:
1. Break big things into small things
2. Think in systems, not tasks
3. Be specific, not vague

**The Exercise:** Each person breaks down their dream agent.

```
"Grab your packet. Flip to the Dream Agent Breakdown worksheet.
I want you to answer the 5 questions for YOUR business.
Take 5 minutes. Don't overthink it -- just get it down."
```

**Timer: 5 minutes.** Walk around. Help anyone who's stuck. If someone says "I don't know where to start," say: "What's the one thing you do every day that you WISH someone else would handle?"

**Share (0:10):** Have each person share their breakdown. Celebrate specificity.

> **WIN MOMENT:** When someone says something really specific (like "every Monday I manually check 5 competitor Instagram accounts"), light up. "THAT is exactly the kind of thing an agent can do. You just designed a system."

### The Universal Pattern (0:25 - 0:35)

Draw the Universal Agent Pattern on the whiteboard or show the slide:

```
TRIGGER -> SCAN -> FILTER/SCORE -> DRAFT/ACT -> REPORT -> YOU DECIDE
```

Map each person's breakdown to this pattern. They should have an "ohhhh" moment when they see their completely different businesses follow the same skeleton.

### Transition (0:35 - 0:40)

```
"So here's what just happened: you designed an agent on paper.
You already know WHAT it should do. The next session is about
giving it the CONTEXT it needs to do it well. Because here's
the secret: the AI model is a commodity. YOUR knowledge is the
moat. Let's talk about why."
```

### Session 1 Troubleshooting

| Issue | Fix |
|-------|-----|
| Someone can't articulate their dream agent | Ask: "What did you do yesterday that was boring?" Start from their actual day. |
| Someone's breakdown is too vague | Probe: "What SPECIFICALLY triggers that? What exactly would the output look like?" |
| Energy is low / people seem overwhelmed | Pause. "This is a lot of new thinking. That's okay. We're going to make it super concrete in the next session." |

---

## SESSION 2: Why Your Context is Your Superpower (0:40 - 1:20)

### Energy Target: Inspired + Motivated
This is the conceptual "aha" session. They should leave feeling: "My business knowledge IS the technology."

### Opening (0:40 - 0:45)

```
"Quick question: who's used ChatGPT to write a marketing email?
[Hands up] Was it... amazing? Or was it kind of generic?
[They'll say generic]

That's because ChatGPT doesn't know YOU. It doesn't know your
customers, your voice, your industry. It's writing from zero context.

Andrej Karpathy -- one of the smartest people in AI, co-founder
of OpenAI, led AI at Tesla -- he says the new skill isn't
'prompt engineering.' It's 'context engineering.'

And here's what that means for you..."
```

### The Context Stack (0:45 - 0:55)

Walk through the 5 layers. Use the cake analogy. Show real examples from Felix's IDENTITY.md and SOUL.md.

> **KEY MOMENT:** When you show the SOUL.md example ("Intellectually sharp but warm. Conversational, not corporate."), pause. "See that? That's not a prompt. That's a PERSONALITY. Your agent will talk like this in EVERY conversation. That's the power of context."

### What is OpenClaw? (0:55 - 1:05)

Keep this SIMPLE. Brain + Hands. Show the diagram. Show the chatbot vs agent comparison table.

**Live Demo:** Open your own OpenClaw dashboard. Send it a message. Show how it responds. Show how the personality comes through.

If you have Tempo running: "This is Tempo. It's an agent I built for productivity. Watch what happens when I ask it..." [Send a real message, show the response]

> **If someone asks about security here:** "Great question. I'm going to go DEEP on security in Session 4 -- we have a whole 45-minute section on exactly what the risks are and how we mitigate every one of them. Short answer: your data stays on YOUR server, and you write the rules."

### The Workspace Tour (1:05 - 1:15)

Show the workspace file structure. Open IDENTITY.md, SOUL.md, USER.md on screen. Make it tangible.

```
"Think of the workspace as your agent's brain on disk.
IDENTITY.md is its name tag. SOUL.md is its personality.
USER.md is what it knows about you. Skills are its abilities.
Memory is its diary. That's it. Those are files you can
read and edit. Nothing mysterious."
```

### Transition (1:15 - 1:20)

```
"You now understand WHY context matters and WHAT files make up
your agent's brain. After the break, we're going to BUILD it.
You're going to SSH into your servers, run the setup wizard,
and bring your agent to life. Go grab a snack -- we start
building in 15 minutes."
```

### Session 2 Troubleshooting

| Issue | Fix |
|-------|-----|
| Someone asks "is this safe?" | Direct answer: "Yes. Your server, your data, your rules. We have a whole session on security coming up -- I'll walk through every risk and every defense." |
| Confusion about AI models vs OpenClaw | "The AI model is the brain -- that's Claude or GPT. OpenClaw is the body. It gives the brain hands to actually DO things." |
| Someone says "I already use Claude for this" | "Claude is amazing for conversations. But it forgets you when you close the tab. OpenClaw remembers. And it can ACT, not just talk. Different tool, different purpose." |
| Energy is dropping | Do a quick poll: "Rate your excitement 1-5, hold up fingers." Usually this re-engages people. |

---

## BREAK (1:20 - 1:35)

Let them talk to each other. Don't structure this. Natural conversation about what they've learned so far is incredibly valuable.

If anyone has questions, answer them 1:1 during the break. Some people have questions they don't want to ask in front of the group -- be approachable.

---

## SESSION 3: Deploy Your Agent on DigitalOcean (1:35 - 2:45)

### Energy Target: Focused + Hands-Dirty
This is the most technical session. Go SLOW. Check in constantly. Follow the **end-to-end guide** (Stages 1-7) step by step.

### Opening (1:35 - 1:40)

```
"Okay. This is where it gets real. In the next hour, your agent
is going to come alive. We have 7 stages:

1. Connect to your server (SSH)
2. Prepare the server (swap memory + update)
3. Run the onboard wizard
4. Connect Telegram
5. Install config templates (your agent does this!)
6. Load your AI Command Center
7. Set up access: Telegram, TUI, and Dashboard

I'm going to go step by step. Do NOT jump ahead. Wait for me
before each step. If something looks different on your screen,
say so immediately. Ready? Let's do it."
```

### Stage 1: SSH Connection (1:40 - 1:48)

**Go VERY slow here. Many people have never used a terminal.**

```
"Open your terminal. On Mac, search for 'Terminal' in Spotlight.
On Windows, search for 'Windows Terminal' or 'PowerShell.'

Now type exactly this -- I'll spell it out:

ssh root@[READ THEIR IP ADDRESS]

Then press Enter. First time it asks 'continue connecting?' -- type yes."
```

Walk around and verify everyone's terminal shows the password prompt.

```
"Type your password. You won't see any characters as you type --
that's a security feature, not a bug. Trust me, it's working.
Press Enter when done."
```

**Important:** When they land, there's a model picker prompt. Tell them: "Press Ctrl+C to skip past that for now."

> **WIN MOMENT:** When they see the `root@droplet:~#` prompt. "You're IN. You're logged into a server in the cloud. That's actually kind of badass."

**Explain the two users:**
```
"Quick note: there are two accounts on this server.
root -- that's the system admin (you're using it now).
openclaw -- that's where the agent lives.

Golden rule: every openclaw command needs this prefix:
sudo -iu openclaw openclaw [command]

If you run bare 'openclaw' as root, it creates a SECOND config
with a different token and you'll get weird errors later. Don't
do that. Always use the prefix."
```

### Stage 2: Prepare the Server (1:48 - 1:55)

**Stage 2.1: Add Swap Memory**

```
"Your server has 2 GB of RAM. We're going to add 2 GB of swap
space so it doesn't crash when the AI model is thinking hard.
Run these commands one at a time:"
```

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

Verify: `free -h` -- they should see a "Swap" row showing 2.0G.

**Stage 2.2: Update OpenClaw**

```
"Now let's make sure we're on the latest version."
```

```bash
sudo npm i -g openclaw@latest
```

*Why npm? The DigitalOcean image installs via npm. Running `openclaw update` returns "SKIPPED: not-git-install."*

Verify: `sudo -iu openclaw openclaw --version` -- should show v2026.3.x or newer.

Then restart: `sudo systemctl restart openclaw`

### Stage 3: Onboard Wizard (1:55 - 2:08)

```bash
sudo -iu openclaw openclaw onboard
```

Walk through each screen of the wizard together. Wait for everyone at each step:

1. **QuickStart vs Advanced** -- Choose **QuickStart**
2. **Model / Auth** -- Select Anthropic / Claude, paste API key
3. **Workspace** -- Accept the default
4. **Gateway** -- Defaults are fine (token auto-generated)
5. **Channels** -- Skip for now (we'll do Telegram next)
6. **Daemon** -- Install the systemd service
7. **Health check** -- Verifies gateway starts

**Verify together:**
```bash
sudo -iu openclaw openclaw health
sudo -iu openclaw openclaw config validate --json
```

Green checks or passing status. A Telegram warning is expected (we haven't set it up yet).

### Stage 4: Connect Telegram (2:08 - 2:18)

**Telegram Bot Setup** (if anyone hasn't done this yet, do it now as a group side quest):
1. Open Telegram
2. Search @BotFather
3. Send /newbot
4. Pick a name and username (must end in "bot")
5. Copy the token BotFather gives you

**Connect to OpenClaw:**
```bash
# Configure the Telegram channel
sudo -iu openclaw openclaw configure --section channels
# Select Telegram, paste your bot token

# Set your Telegram user ID (message @userinfobot to find it)
sudo -iu openclaw openclaw configure --section telegram-dm

# Restart
sudo systemctl restart openclaw
```

**Verify:** Open Telegram, find the bot, send "Hey! Are you alive?"

> **MASSIVE WIN MOMENT:** When they get a response from their agent on their PHONE. This is the biggest moment of the day. Celebrate it. "Your agent is alive. On your phone. Working for you. Let that sink in for a second."

### Stage 5: Install Config Templates (2:18 - 2:25)

```
"Instead of manually editing files, we're going to let your
agent install its own configuration. Send this message to
your agent in Telegram:"
```

Have them send the install prompt from the end-to-end guide (Stage 5). The agent will:
1. Clone the template repo
2. Copy SOUL.md, MEMORY.md, AGENTS.md, HEARTBEAT.md, IDENTITY.md to workspace
3. Copy skills folder
4. Create memory directories

**Verify:**
```bash
sudo systemctl restart openclaw
sudo -iu openclaw ls /home/openclaw/.openclaw/workspace/
```

They should see: AGENTS.md, HEARTBEAT.md, IDENTITY.md, MEMORY.md, SOUL.md, memory/, skills/

### Stage 6: Load the Command Center (2:25 - 2:33)

```
"Now let's give your agent YOUR context. Paste your Command
Center document to your agent in Telegram."
```

They send: "I'm pasting my AI Command Center. Read everything and update MEMORY.md with my information. Then confirm what you learned about me." + their document.

**Verify:** Have them ask: "What do you know about me and my business?" The agent should respond with details from their Command Center.

> **KEY MOMENT:** When the agent summarizes their business back to them accurately. "See that? It KNOWS you now. That's the power of context."

### Stage 7: Access Methods (2:33 - 2:45)

**Stage 7.1: Telegram** -- Already working from Stage 4.

**Stage 7.2: TUI (Terminal Chat)**
```bash
sudo -iu openclaw openclaw tui --deliver
```
Quick demo: send a message, get a response, Ctrl+C to exit.

**Stage 7.3: Gateway Config + Dashboard**

```
"Last thing -- let's get the web dashboard working. This is
the visual command center."
```

First, configure the gateway for browser access:
```bash
sudo -iu openclaw openclaw config set gateway.controlUi.allowedOrigins '["*"]'
sudo -iu openclaw openclaw config set gateway.trustedProxies '["127.0.0.1", "::1"]'
```

**Install the gateway keep-alive wrapper** (this is the DigitalOcean bug fix -- the gateway can silently stop):
```bash
# Create the wrapper script (full script in end-to-end guide Stage 7.3)
sudo tee /opt/openclaw-start.sh > /dev/null << 'SCRIPT'
#!/bin/bash
cleanup() { kill $GATEWAY_PID 2>/dev/null; exit 0; }
trap cleanup SIGTERM SIGINT
while true; do
    pkill -9 -f 'openclaw-gateway' 2>/dev/null
    sleep 2
    /usr/bin/openclaw gateway --port 18789 --allow-unconfigured &
    GATEWAY_PID=$!
    for i in $(seq 1 60); do
        if ss -tlnp | grep -q ':18789'; then break; fi
        sleep 1
    done
    if ! ss -tlnp | grep -q ':18789'; then continue; fi
    while kill -0 $GATEWAY_PID 2>/dev/null && ss -tlnp | grep -q ':18789'; do
        sleep 10
    done
    sleep 5
done
SCRIPT
sudo chmod +x /opt/openclaw-start.sh
```

Update the systemd service:
```bash
sudo tee /etc/systemd/system/openclaw.service > /dev/null << 'SERVICE'
[Unit]
Description=OpenClaw Gateway
After=network.target

[Service]
Type=simple
ExecStart=/opt/openclaw-start.sh
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE
sudo systemctl daemon-reload
sudo systemctl restart openclaw
```

```
"What this does: it monitors your gateway every 10 seconds.
If it dies silently -- which happens on DigitalOcean -- it
auto-restarts. No more 'my bot stopped responding' mystery."
```

**Open the dashboard:**
- Browser: `https://[THEIR IP ADDRESS]`
- Click through SSL warning
- Paste gateway token
- Device pairing: Connect → SSH approve → Connect again

Get the gateway token:
```bash
sudo -iu openclaw cat ~/.openclaw/openclaw.json | grep -o '"token":"[^"]*"' | head -1
```

**Verify:** Send a message through at least two channels (Telegram + Dashboard or TUI).

> **WIN MOMENT:** "Same agent, same personality, three different ways to reach it. Your AI Command Center is live."

**Fallback:** If HTTPS dashboard doesn't work, use SSH tunnel:
```bash
ssh -N -L 18789:127.0.0.1:18789 root@YOUR_IP
# Then visit: http://localhost:18789
```

### Session 3 Troubleshooting

| Issue | Fix |
|-------|-----|
| SSH password not working | Double-check the IP. Try retyping slowly. Characters don't show. |
| Model picker prompt on login | Press Ctrl+C to skip it. |
| Ran `openclaw` as root (no prefix) | Token mismatch. Re-run with `sudo -iu openclaw openclaw onboard` to fix. |
| Swap already exists | Skip Stage 2.1. Run `free -h` to confirm. |
| npm update fails | Try: `sudo npm cache clean --force` then retry. |
| Onboard wizard crashes | Run again: `sudo -iu openclaw openclaw onboard` |
| Telegram bot not responding | Check: `sudo systemctl status openclaw`. Restart: `sudo systemctl restart openclaw`. Approve device: `sudo -iu openclaw openclaw devices approve --latest`. |
| Gateway silently stops | That's why we install the keep-alive wrapper (Stage 7.3). Run the wrapper setup commands from the end-to-end guide. |
| Dashboard won't connect | Check: `systemctl status openclaw`. Verify allowedOrigins and trustedProxies are set. Try SSH tunnel as fallback. |
| "Pairing required" confusion | The order matters: Browser first (click Connect), then SSH approve, then browser again. |
| "No pairing request found" | They ran approve before the browser tried to connect. Go back to browser, click Connect, THEN approve. |
| API key error | Check for extra spaces. Verify credits at openrouter.ai. |
| Agent responds but personality is wrong | Restart after editing: `sudo systemctl restart openclaw` |
| Someone is stressed about terminal | Sit next to them. Go through each step 1:1. Validate every concern. "You're right to ask that." |

---

## BREAK (2:45 - 3:00)

```
"Take 15. Your agents are alive. Play with them on your phones
during the break. Ask them weird questions. See how they respond.
When we come back, we're talking about security -- the honest
version, not the marketing version."
```

---

## SESSION 4: Security -- The Real Talk (3:00 - 3:45)

### Energy Target: Informed + Empowered
This session builds trust. Be honest about risks. Be thorough about defenses. Don't oversell safety -- explain it clearly.

### Opening (3:00 - 3:05)

```
"Okay. We need to have an honest conversation. You just gave
an AI agent the ability to act in your world. That's powerful.
It also comes with real risks.

I'm not going to sugarcoat this. I'm going to tell you exactly
what can go wrong, and then exactly what protects you. By the
end of this session, you'll know more about AI agent security
than 99% of people using AI tools."
```

### The 5 Risks (3:05 - 3:15)

Walk through each risk from the curriculum. Be concrete. Use the examples.

> **KEY: Don't rush this.** The temptation is to speed through risks to get to the "don't worry" part. DON'T. Let them sit with each risk for a moment. The honesty builds trust.

1. **Prompt Injection** -- "Someone hides instructions in an email your agent reads." Give the example. Let them react.
2. **Data Leakage** -- "Your agent accidentally includes private info in a draft."
3. **Runaway Spending** -- "A misconfigured cron job burns through your API credits."
4. **Unauthorized Actions** -- "Your agent posts something you didn't approve."
5. **Unauthorized Access** -- "Someone else gets your gateway token."

```
"Those are real risks. They're not hypothetical. Now let me
show you what protects you..."
```

### The 6 Defense Layers (3:15 - 3:35)

Walk through each layer. Do the hands-on parts together:

**Layer 1: Infrastructure** -- "Your server, your data. Show of hands: who's more comfortable knowing your data isn't on someone else's cloud?" Let them do the firewall setup:
```bash
ufw allow OpenSSH && ufw allow 443/tcp && ufw enable
```

**Layer 2: Auth & Device Pairing** -- Show the device list command. Explain why device pairing matters.

**Layer 3: SOUL.md Boundaries** -- "These are YOUR rules. Let's write them together right now." Walk through the hard rules section. Have everyone paste them into their SOUL.md.

**Layer 4: Prompt Injection Defense** -- Add the security rules to SOUL.md together. Be honest: "Is this perfect? No. But the real defense is the human-in-the-loop -- your agent asks before taking real action."

**Layer 5: Spending Controls** -- Show the OpenRouter budget page. Have everyone set a limit right now. Walk through the cron frequency cost table.

**Layer 6: Transparency Protocol** -- "Add this to your SOUL.md and your agent logs everything it does." Paste together.

### Safety Checklist (3:35 - 3:40)

Do the 10-item checklist from the curriculum together. Check each item off as a group.

### Close (3:40 - 3:45)

```
"Here's the honest bottom line: the most important safety layer
is YOU. Review outputs. Approve actions. Stay engaged. Don't
set it and forget it.

But also know this: running an agent on YOUR server with YOUR
rules is fundamentally safer than typing into a website where
you have no idea what happens to your data."
```

> **If someone still seems anxious:** "It's okay to start conservative. Set strict boundaries. Only loosen them as you build trust. Your agent won't be offended."

### Session 4 Troubleshooting

| Issue | Fix |
|-------|-----|
| Someone is scared and wants to stop | "You can set boundaries as strict as you want. Start with: agent can ONLY draft things and send them to you. Nothing autonomous." |
| "What if someone hacks my server?" | Walk through the firewall, SSH key auth, and encrypted connections. DigitalOcean has DDoS protection built in. |
| "How do I know it's not sending my data somewhere?" | "OpenClaw is open source. You can inspect every line of code. Your data goes to: your server and the AI model API. That's it." |
| Someone asks about GDPR/compliance | "Your data stays on your server, in whatever jurisdiction you choose. You control retention and deletion. For formal compliance, consult a lawyer, but the architecture is privacy-friendly by design." |

---

## SESSION 5: Customize & Build Your Specialist Agent (3:45 - 4:30)

### Energy Target: Creative + Empowered
They have working, secured agents. Now we make them SMART.

### Opening (3:45 - 3:50)

```
"Your agents are running and locked down. But they're still
generic. They don't know your businesses yet. This session
changes that.

We have three specialist template packs. Each one is designed
for a different type of business need. Pick the one closest to
what YOU want, or mix and match."
```

### Template Selection (3:50 - 3:55)

Show the three templates. Let each person pick:

| Template | Best For | Core Capability |
|----------|----------|----------------|
| **Aria** | Content, brand, thought leadership | Scans news, drafts in your voice, pre-screens deliverables |
| **Scout** | Sales, business development, GTM | Scans markets, scores leads against ICP, drafts outreach |
| **Atlas** | Investment, analysis, opportunities | Scans signals, matches patterns, generates scored proposals |

"Pick the one closest to your business. Or grab elements from multiple. These are starting points, not final answers."

### Agent Builds (3:55 - 4:20)

**Run these in parallel.** While one person is writing their IDENTITY.md, help another with their SOUL.md.

For each person:
1. Walk through their chosen template's IDENTITY.md
2. Walk through their custom SOUL.md (4-section spec)
3. Paste both into their workspace
4. Set up their first proactive loop (cron job)
5. Install relevant skills
6. Start filling out knowledge files
7. Test it

**Pacing tips:**
- People who chose Aria: Focus on content scanning loop + voice samples. Quick win: have the agent draft a post right now.
- People who chose Scout: Focus on security setup first (they'll want to feel safe), then buzz scanner. Quick win: run one scan manually.
- People who chose Atlas: Focus on signal scanner + pattern library. Quick win: run one scan and show pattern matching.
- If someone finishes early: "While we wait, try adding a second proactive loop" or "Start filling out your knowledge files -- that's where the magic happens."

### Cron Job Setup (do together)

```
"Let's set up your first automated scan. This is the moment
your agent goes from 'waits for you' to 'hunts for you.'"
```

Walk each person through their first `openclaw cron add` command from the curriculum.

Test it immediately:
```bash
openclaw cron run [their-cron-name]
```

> **WIN MOMENT:** When the cron job runs and they get a real result on their phone. "That just ran AUTOMATICALLY. Imagine getting that every 6 hours without lifting a finger."

### Wrap Session 5 (4:20 - 4:30)

Quick round-robin: "What's the coolest thing your agent just did?" Let each person share.

### Session 5 Troubleshooting

| Issue | Fix |
|-------|-----|
| Cron job doesn't produce results | Check the task description is clear. Run manually to debug: `openclaw cron run [name]` |
| Agent personality feels off | Re-edit SOUL.md. Add more specific voice notes. Restart: `sudo systemctl restart openclaw` |
| Skills not working | Check installation: `/skill list`. Reinstall if needed. |
| Someone is behind | Focus on getting ONE proactive loop working, even if simple. They can add more after. |
| Agent is too verbose | Add to SOUL.md: "Keep responses under 150 words unless asked for detail. Bullet points by default." |
| Knowledge files feel overwhelming | "Start with ONE file. The most important one. You can add more this week." |

---

## SESSION 6: Agents That Hunt For You + What's Next (4:30 - 5:00)

### Energy Target: Forward-Looking + Inspired
They've built something real. Now plant the seed for what's NEXT.

### The Proactive vs Reactive Distinction (4:30 - 4:40)

```
"Okay, one more big idea before we wrap. Most people set up an
AI agent and treat it like a chatbot. They ask it questions
when they remember to. That's leaving 80% of the value on the table.

The REAL power is a proactive agent. One that HUNTS for things
and brings them back to you. You've already built one of these --
your cron jobs are proactive loops. But let me show you the full
pattern..."
```

Walk through the DevPulse pipeline. Show how the same DISCOVERY -> LAB -> DRAFT -> REVIEW -> PUBLISHED pattern maps to any business.

### Build One More Loop (4:40 - 4:50)

```
"Last exercise. I want each of you to design ONE more proactive
loop right now. Use the template in your packet. Something you
want your agent doing by next week."
```

Give them 10 minutes. Help them set it up as a cron job before they leave.

### Closing Script (4:50 - 5:00)

```
"Let's take stock of what happened today.

You walked in knowing AI as chatbots. You're leaving with a
personal AI agent that:
- Knows who you are
- Talks in your voice
- Lives on your phone
- Does work while you sleep
- Gets better every day

You learned how to break down problems like an engineer. You
learned why YOUR context is the real technology. You deployed
a command center from scratch. You locked it down with real
security. And you built specialist agents designed for YOUR
specific business needs.

Your homework is in your packet. The most important thing:
USE your agent this week. Not as a novelty. As a tool.
Give it real work. Give it feedback when it gets things wrong.
Fill out your knowledge base files.

In two weeks, your agents will be 10x better than they are
right now. Not because of a software update -- because of
YOUR context making them smarter.

Any last questions? [Handle questions]

I'm proud of you. Go use your agents."
```

### Session 6 Troubleshooting

| Issue | Fix |
|-------|-----|
| Someone can't think of a second loop | Go back to their decomposition worksheet. What's the second most tedious thing they do? |
| "This feels like too much to maintain" | "Your agent maintains itself. You just check in once a day and give feedback. That's it." |
| Someone wants to do something advanced | Write it down and promise a follow-up. "Let's get the foundation solid first. I'll help you add that this week." |

---

## Post-Workshop Follow-Up

**Day 1 (Tomorrow):** Send a group message:
- "How did your first morning briefing go? Any issues?"
- Share troubleshooting tips for common first-day issues

**Day 3:** Check in individually:
- "Have you added anything to your knowledge base yet?"
- "How's the personality feeling? Need to adjust SOUL.md?"

**Week 1:** Group check-in:
- "What's the most useful thing your agent has done so far?"
- "What's not working yet? Let's debug together."

**Week 2:** Individual feedback sessions:
- Review their SOUL.md and IDENTITY.md
- Help add new proactive loops based on what they've learned
- Discuss next steps (more skills, advanced features, etc.)

---

## Emergency Scenarios

### "Nothing is working and someone is frustrated"
Stop the group. Sit with that person. Get their specific issue working before moving on. The group can chat or play with their agents while you troubleshoot.

### "Someone wants to do something we haven't covered"
If it's quick (< 5 min), show them. If it's complex, write it down and promise a follow-up. "That's a great idea. Let's get the foundation working first, and I'll help you add that this week."

### "The server goes down mid-session"
Have a backup droplet ready. Worst case: show everything on YOUR screen as a demo and have them take notes. They can paste their configs later.

### "API credits run out"
Have a backup OpenRouter key with $20 loaded. Switch to a cheaper model as emergency fallback.

### "Someone wants to quit"
"I hear you. This is a lot. Can we take a 5-minute break and I'll sit with you to catch up?" Usually it's one specific moment of confusion, not a fundamental problem.

---

## Energy Management Cheat Sheet

| Time | Energy Level | Your Move |
|------|-------------|-----------|
| 0:00 | High (fresh) | Match it. Be energetic. |
| 0:40 | Dipping (information overload) | Switch to hands-on. Less talking, more doing. |
| 1:20 | Low (break time) | Let them recharge. Don't hover. |
| 1:35 | Medium (post-break) | Start with something interactive immediately. |
| 2:00 | Varies (some excited, some struggling) | Pair fast + slow people. 1:1 help for strugglers. |
| 2:45 | Low (need a break) | Don't push. Break is essential. |
| 3:00 | Medium (security = serious tone) | Be honest and thorough. They'll respect it. |
| 3:45 | High (they have secured, working agents!) | Channel it. Let them build. |
| 4:30 | Medium-high (proud of what they built) | Celebrate. Let them show off. |
| 4:50 | Reflective (wrapping up) | Slow down. Be warm. Plant seeds. |

---

## Materials Checklist

- [ ] This Facilitator Guide (printed or on tablet)
- [ ] Slide deck loaded and tested
- [ ] Participant Resources packets (one per person)
- [ ] DigitalOcean credentials cards (IP + password per person)
- [ ] Backup OpenRouter API key ($20 loaded)
- [ ] Felix template pack on a USB or shared link
- [ ] Agent template packs (Aria, Scout, Atlas) printed or shared
- [ ] Your own OpenClaw instance running (for demos)
- [ ] Tempo running (for the live demo in Session 2)
- [ ] Music playlist ready
- [ ] Snacks and drinks
- [ ] Whiteboard or large notepad (for drawing the Universal Agent Pattern)
- [ ] Phone chargers (people will be using Telegram a lot)
- [ ] Backup laptop (in case someone's machine has issues)

---

*Facilitator Guide by HGDW / iterate Club | April 2026*
