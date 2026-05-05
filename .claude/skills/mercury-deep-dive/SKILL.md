---
name: mercury-deep-dive
description: Single instrument deep analysis combining price structure, auction market theory, volatility regime, and news context. Use when user wants to analyse a specific instrument, ticker, or contract in depth — e.g. "tell me about ES", "deep dive on gold", "what's ZN doing", "analyse crude oil".
allowed-tools: mcp__mercury-market-data__get_symbol_detail, mcp__mercury-market-data__get_amt_snapshot, mcp__mercury-market-data__get_volatility_metrics, mcp__mercury-market-data__get_market_texture, mcp__mercury-market-data__get_futures_options, mcp__mercury-market-data__get_market_overview, mcp__mercury-darth-feedor__get_squawk_context, mcp__mercury-darth-feedor__list_articles, mcp__mercury-darth-feedor__get_article_bullets, AskUserQuestion
priority: high
---

# Mercury Deep Dive — Single Instrument

Layered, interactive analysis. Do not front-load everything — go layer by layer and let the user steer.

> **Always fetch fresh data. Price structure, vol regimes, and news context change continuously.**

---

## Step 0 — Confirm the Instrument

If the instrument is not specified, ask:
> "Which instrument would you like to deep dive on? (e.g. ES, ZN, CL, GC, 6E...)"

If a common name is used (e.g. "gold", "crude", "10-year"), map it:
- gold → `GC=F`
- crude / oil → `CL=F`
- 10-year / 10yr → `ZN=F`
- S&P / SPX → `ES=F`
- Nasdaq → `NQ=F`
- Russell → `RTY=F`

---

## Step 1 — Price Snapshot

```
get_symbol_detail(symbol="<SYMBOL>")
```

Report concisely:
- Current price, session state (RTH/ETH/CLOSED)
- 1d and 5d returns
- 5-day and 20-day range position (0 = at lows, 1 = at highs)
- Trend and vol regime labels

One key observation: *"XYZ is trading near its 20-day highs in a Spike-Rising vol regime — market is extended."*

---

## Step 2 — Auction Structure (AMT)

```
get_amt_snapshot(symbol="<SYMBOL>")
```

Explain in plain language:
- Where is price relative to the **Value Area** (VAH / VAL / POC)?
- Above value → buyers accepting higher prices
- Below value → sellers in control / testing lower
- Inside value → two-sided, no directional conviction
- Any **single prints** (unfilled gaps in the profile)?

One sentence on what the structure implies for next likely move.

---

## Step 3 — Ask: Go Deeper?

> "Price is [above/below/inside] value, with [key structural observation]. Want me to check the volatility regime, or pull any related news/squawks?"

**If vol:** proceed to Step 4
**If news:** proceed to Step 5
**If done:** summarise in 3 bullets

---

## Step 4 — Volatility Regime (optional)

```
get_volatility_metrics(symbols=["<SYMBOL>"])
```

Report:
- Realised volatility vs historical norm
- HMM regime: what state is vol in?
- Average Daily Range (ADR) — how much room does the market typically move?
- Implied vs realised gap (if available)

Translate: *"Vol is compressed — if a catalyst hits, expect a sharp expansion."*

---

## Step 5 — Options / Positioning Context (optional)

Use this when the user asks about event risk, volatility, positioning, or options context:

```
get_futures_options(symbol="<symbol>")
```

Do not force options into every deep dive. Use it when it adds context to AMT/vol.

---

## Step 6 — News Context (optional)

```
get_squawk_context(view="topic:<instrument name or theme>")
```

List the 3 most relevant squawks or headlines. Note if any explain today's price action.

If the user wants to go deeper on an article:
```
get_article_bullets(ids=["<id>"])
```

---

## Step 7 — Synthesis

Offer a 3-bullet summary only if the user asks "what does it all mean?" or similar. Keep it tight:
- **Structure:** [AMT context]
- **Regime:** [vol + trend]
- **Narrative:** [news driver if any]

Do not speculate on direction. Describe what the market is doing, not what it will do.
