---
name: mercury-news-flow
description: Financial news, squawk, newsletter, and research workflow using Darth Feedor progressive retrieval. Use when user asks about news, headlines, squawks, newsletter coverage, market commentary, research reports, or wants to follow a specific story/theme across articles.
allowed-tools: mcp__mercury-darth-feedor__get_squawks, mcp__mercury-darth-feedor__get_squawk_context, mcp__mercury-darth-feedor__list_articles, mcp__mercury-darth-feedor__get_articles, mcp__mercury-darth-feedor__search_article_bullets, mcp__mercury-darth-feedor__get_article_bullets, mcp__mercury-darth-feedor__get_article_detail, mcp__mercury-darth-feedor__article_graph, mcp__mercury-darth-feedor__progressive_article_search, mcp__mercury-darth-feedor__get_research, mcp__mercury-darth-feedor__aggregate_articles, mcp__mercury-market-data__get_market_overview, mcp__mercury-market-data__get_symbol_detail, mcp__mercury-market-data__get_stir_snapshot, AskUserQuestion
priority: high
---

# Mercury News Flow

Work from fast/broad to slow/deep. Never pull full article text unless the user specifically asks. Lead with squawks for live tape; use article/newsletter tools for thematic depth.

> **News flow is time-sensitive. Always fetch fresh squawks for live context. Newsletter/article archives are not a substitute for the tape.**

---

## Mode Selection

Route by user intent:

| User asks | Use |
|---|---|
| “Anything new?”, “headlines”, “squawks” | Live tape mode: `get_squawks` → `get_squawk_context` |
| “What are newsletters saying about X?” | Newsletter discovery: `list_articles(query=...)` → `get_article_bullets` |
| “Follow this story/theme” | Graph mode: `article_graph(article_id=...)` |
| “Research this topic broadly” | Progressive mode: `progressive_article_search(seed_query=...)` |
| “Search the archive for X” | Archive mode: `search_article_bullets(query=...)` — check dates |
| “Summarise coverage” | Synthesis mode: `aggregate_articles(...)` |
| “Any PDFs/research notes?” | Research mode: `get_research(...)` |

---

## Live Tape Mode — Squawks First

```
get_squawks(limit=15, hours_back=6)
```

Present the **top 5–7 most relevant** squawks. Group by theme if clusters are obvious: Fed comments, geopolitics, data, auctions, earnings.

Flag anything that is breaking, unusual, or directly tied to rates/equities/commodities/FX.

Then, for a selected theme:

```
get_squawk_context(view="topic:<theme>")
```

Summarise in 2–3 sentences: narrative, actors, market implication.

---

## Newsletter Discovery — Two-Phase Retrieval

Start light:

```
list_articles(query="<topic>", since_days=14, limit=10)
```

Show article IDs, titles, source, date, thesis. Do **not** open all article details.

Then enrich selected IDs:

```
get_article_bullets(ids=["<id1>", "<id2>"])
```

Use bullets, sentiment, mechanisms, and relevance score to form the read. Stop here unless user asks to open a piece.

Only then:

```
get_article_detail(article_id="<id>")
```

Use full detail for one article at a time.

---

## Theme Graph Mode

If one article is a good seed:

```
article_graph(article_id="<seed_id>", limit=10, min_shared_tags=1)
```

Use this to follow a recurring newsletter theme without inventing a new query. Then call `get_article_bullets` on the best related IDs.

Output frame:
- original thesis,
- related cluster,
- what changed across pieces,
- instruments/markets affected.

---

## Progressive Research Mode

For broad topic research:

```
progressive_article_search(seed_query="<topic>", max_depth=2, max_articles=10)
```

Use when the user asks for a comprehensive view, not for live monitoring. It expands by tags and related articles.

If the result set is broad, synthesise:

```
aggregate_articles(tags=["<tag>"], limit=30)
```

or

```
aggregate_articles(category="Macro", limit=30)
```

---

## Archive Search Mode

```
search_article_bullets(query="<concept>", limit=10)
```

This is relevance-ranked, **not recency-ranked**. Always inspect `published_at`; do not present old hits as current context.

Use for concepts like “Treasury refunding”, “TGA rebuild”, “gold real yields”, “curve steepener”, or “liquidity impulse”.

---

## Research Documents

```
get_research(publisher="<publisher>", tag="<tag>", limit=5)
```

List available research titles first. Open/summarise key findings only; do not dump full documents unless asked.

---

## Market Cross-Check

If a story matters, ground it in live markets:

```
get_market_overview(symbols=["<relevant symbol>"])
```

For rates/Fed stories, also check:

```
get_stir_snapshot()
```

Say whether the market is confirming, fading, or ignoring the narrative.

---

## Refresh Rule

If the user says “anything new?” or “updates?” always re-run `get_squawks`. For newsletter/article workflows, ask whether they want **latest coverage** (`list_articles`) or **archive/theme research** (`search_article_bullets` / `progressive_article_search`).
