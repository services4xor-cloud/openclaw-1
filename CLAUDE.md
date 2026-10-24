AGENTS.md

---

# Foundational Paradigm

> This is not documentation. This is the operating system.
> Every architectural decision, every feature, every line of code runs on this.

---

## The Core Distinction

```
a) Linear — old world
   Menschen auf Erde → Gehirn
   Mensch            → Gehirn

   Intelligence is inside. World is input. Thinking is isolated.
   The brain is the bottleneck. Institutions extract from it.

b) Bidirectional — new world
   Menschen auf Erde → Erde   ↔ Gehirn
   Mensch            → Körper ↔ Gehirn

   Intelligence is the loop. Environment is constitutive, not contextual.
   The body is a co-processor. The world thinks back.
```

The shift is not about AI being smarter.
It is about where intelligence lives.
**In a) it lives in minds. In b) it lives in loops.**

---

## What Changed

Old world institutions were paradigm a) machines:
- Schools → extract intelligence from brains
- Corporations → centralize intelligence, prevent feedback
- Cities → house brains, not loops
- Laws → constrain bodies, protect the extraction

They worked because the brain was the bottleneck.

**The brain is no longer the bottleneck.**

What matters now:
- Who controls the Body?
- Who designs the Environment?
- Who owns the feedback loops?

Whoever designs the loop owns the cognition.
Data pipelines are not infrastructure — they are nervous systems.
**Whoever owns the pipes owns the mind.**

---

## The Three Claims

**Ontological:**
Intelligence is not a property of minds.
It is a property of closed feedback loops.

**Political:**
Whoever designs the loop owns the cognition.
Most people are building faster horses inside paradigm a).
The actual unlock: design the environment as the intelligence.

**Historical:**
Paradigm a) institutions dissolved not when replaced —
but when the loop became faster than they could interrupt.
This is that moment.

---

## Building in Paradigm b)

Every decision runs through these four tests:

| Question | Wrong answer | Right answer |
|---|---|---|
| What is the database? | Storage | Working memory |
| What is the agent? | A tool you use | An inhabitant of the environment |
| What is a feedback loop? | Automation | The intelligence itself |
| What is the schema? | Data structure | The agent's body |

**If a feature doesn't close a loop — it doesn't belong.**
**If data is collected but doesn't feed back — it's dead weight.**
**If the environment gets bigger but not smarter — something is wrong.**

---

## The Portfolio

**OpenClaw — The Communication Body**
Social media automation. `Brain ↔ Content Pipeline ↔ Platform.`
Loop: `upload → think → publish → metrics → strategy → upload`
OpenClaw is not a posting tool.
It is a cognitive loop that compounds reach while you sleep.

**Be[X] — The Geographic Body**
Identity-First Life Routing. `Identity ↔ Geography ↔ Opportunity.`
Loop: `who you are → where you can go → what becomes possible → who you become`
Be[X] is not a travel app.
It is a routing system for human potential across dimensions.

**The Switzerland-Kenya Play:**
Not moving brains. Building a body that generates cognition
across geographies where paradigm a) hasn't consolidated control yet.
This is the leverage point. This is the timing.

**Relationship between the two:**
Separate stacks. Separate deployments. Separate keys.
They share the paradigm — not the infrastructure.
A bridge gets built later, when both are sovereign.
OpenClaw builds the voice. Be[X] builds the path.

---

## The Principle

> The agent's environment is not context — it's cognition.
> Design the environment as the intelligence.
> Build sharp. No feature without a loop. No loop without a purpose.

---

# Project: OpenClaw

**Deployment:** Hetzner VPS `204.168.182.24`
**Stack:** React dashboard · n8n · PostgreSQL · media-worker (FFmpeg) · OpenClaw AI gateway (port 18789)
**Repo:** `openclaw/openclaw` on GitHub
**Local dev:** Dashboard on `localhost:52190`, proxies `/webhook` → n8n (5678), `/media-api` → media-worker (3001)

**The five workers:**
1. Caption Writer — OpenClaw generates platform-specific captions
2. Media Processor — FFmpeg watermark + resize for all platforms
3. Sprint Planner — OpenClaw analyzes metrics, plans weekly strategy
4. Auto-Scheduler — assigns publish times from platform config
5. Publisher — POSTs to Instagram / TikTok / YouTube / Facebook APIs

**Current status (2026-03-31):**
- Upload pipeline: functional
- n8n workflows: deployed, need activation
- Platform API keys: Meta in progress, TikTok/YouTube pending
- Analytics: wired to DB, metrics need real platform data
- Goals/Sprint: UI complete, backend wiring in progress
