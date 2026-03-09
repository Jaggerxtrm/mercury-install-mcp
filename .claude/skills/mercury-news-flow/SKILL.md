---
name: mercury-news-flow
description: Financial news and squawk monitoring workflow using progressive retrieval. Use when user asks about news, headlines, squawks, what's in the news, recent market commentary, research reports, or wants to follow a specific story or theme.
allowed-tools: mcp__mercury-darth-feedor__get_squawks, mcp__mercury-darth-feedor__get_squawk_context, mcp__mercury-darth-feedor__list_articles, mcp__mercury-darth-feedor__get_articles, mcp__mercury-darth-feedor__get_article_bullets, mcp__mercury-darth-feedor__get_article_detail, mcp__mercury-darth-feedor__get_research, mcp__mercury-darth-feedor__aggregate_articles, mcp__mercury-market-data__get_market_overview, AskUserQuestion
priority: high
---

# Mercury News Flow

Work from fast/broad to slow/deep. Never pull full article text unless the user specifically asks. Lead with squawks, not articles.

> **News flow is time-sensitive. Always fetch fresh squawks — never summarise old ones from earlier in the session.**

---

## Step 1 — Latest Squawks

```
get_squawks(limit=15)
```

Present the **top 5–7 most relevant** squawks in a short list. Group by theme if there are clear clusters (e.g. Fed comments, geopolitical, earnings).

Do **not** show all 15 — curate. Flag anything that:
- Is breaking / very recent
- References a major move in equities, rates, or commodities
- Is unusual or unexpected

---

## Step 2 — Ask to Focus

> "Key themes in the flow: [theme 1], [theme 2], [theme 3]. Want me to dig into any of these — or look for a specific topic?"

---

## Step 3a — Topic Context (if theme selected)

```
get_squawk_context(topic="<theme>")
```

Pull 3–5 squawks with surrounding context on the topic. Summarise in 2–3 sentences: what's the narrative, who are the actors, what's the market implication?

---

## Step 3b — Article Search (if user wants depth)

```
list_articles(limit=10)
```

Show article headlines only. Ask: *"Any of these you want to go deeper on?"*

If yes:
```
get_article_bullets(article_id="<id>")
```

Present the bullets — 5–8 key points. Stop here unless user wants the full text.

If user wants full text:
```
get_article_detail(article_id="<id>")
```

---

## Step 3c — Research (if user asks for analysis/reports)

```
get_research(limit=5)
```

List available research titles. Ask which one to open. Then present the key findings section only — not the full document, unless asked.

---

## Step 4 — Theme Aggregation (if user wants cross-article synthesis)

```
aggregate_articles(topic="<theme>", limit=10)
```

Use this when the user asks "what are people saying about X?" or wants a synthesised view across multiple articles. Present as: *"Across recent coverage of [topic], the dominant narrative is... Key disagreements or data points: ..."*

---

## Step 5 — Market Cross-Check (optional)

If a news story is market-relevant, ground it in price action:
```
get_market_overview(symbols=["<relevant symbol>"])
```

*"The squawk about [story] aligns with [CL/ES/ZN] which is [up/down X%] today — the market [is/isn't] reacting yet."*

---

## Refresh Rule

If the user says "anything new?" or "any updates?" — **always re-run Step 1** with a fresh `get_squawks` call. Do not rely on squawks from earlier in the conversation.
