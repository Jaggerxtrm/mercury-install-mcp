---
title: Mercury Workflows
description: Task-oriented workflows for market scans, deep dives, rates, liquidity, and newsletter research.
nav_order: 3
publish: true
---

# Mercury Workflows

Use this guide when you know the market question but not the exact tool chain. Each workflow starts from `/using-mercury` and then selects the right MCP layers.

## Workflow index

| Workflow | Best for | Example |

|---|---|---|

| Morning brief | Daily setup across calendar, regime, markets, liquidity, tape. | `/using-mercury morning brief` |

| Market scan | Finding what is moving and what to inspect next. | `/using-mercury market scan` |

| Instrument deep dive | Single-contract price, AMT, vol, options, catalysts. | `/using-mercury deep dive ZN` |

| Rates and STIR | Treasury curve, SOFR/STIR, Fed-sensitive spreads. | `/using-mercury rates and STIR` |

| Liquidity and public finance | LCI, fiscal/Fed/plumbing drivers. | `/using-mercury liquidity` |

| Newsletter and research | Squawks, article stubs, graph search, synthesis. | `/using-mercury newsletters on Treasury refunding` |

## Morning brief

Use this workflow to prepare the trading day across calendar risk, market regime, price action, liquidity, and live tape.

A Mercury morning brief should read like a desk handoff: what matters today, what markets are already doing, which data releases can change the path, and whether liquidity or narrative context is reinforcing the move.

### When to use this workflow

Use it before the cash session, before a major macro event, or whenever a user asks for “today’s setup”, “morning note”, “what matters today”, or “quick brief”.

### Before you begin

- Invoke the skill with `/using-mercury`.
- Treat yesterday’s tool outputs as stale.
- Use `toon` output unless the user explicitly asks for raw JSON.

### Steps

1. Pull calendar risk with `get_economic_events(time_range="today", importance=["high"])`.
2. Pull broad regime with `get_regime()`.
3. Pull cross-asset movement with `get_market_overview()`.
4. Add liquidity context with `get_market_snapshot()` or `get_lci_summary()`.
5. Pull live tape with `get_squawks(limit=15, hours_back=6)`.
6. If a theme dominates, call `get_squawk_context(view="topic:<theme>")`.
7. Summarize only the highest-signal items.

### Example prompt

```text
/using-mercury morning brief
```

### What good output looks like

A good brief has five blocks:

1. **Desk summary** — two or three sentences on the dominant setup.
2. **Event risk** — scheduled releases and consensus context.
3. **Market state** — strongest cross-asset moves and current regime.
4. **Liquidity backdrop** — whether liquidity is supportive, neutral, or restrictive.
5. **Tape watch** — the few live headlines or themes most likely to matter.

Example structure:

```text
Desk read: Risk is firmer but the move is rates-sensitive. Equity strength is concentrated in NQ while Treasury futures are stabilising ahead of CPI. Liquidity is neutral-to-loose, so the tape has room to extend unless the data surprise reprices the front end.

Watch: CPI at 08:30 ET; ZN around value area high; RRP/fiscal impulse not a headwind today.
```

### Related tools

- [[tool-reference|get_economic_events]]
- [[tool-reference|get_regime and get_market_overview]]
- [[tool-reference|get_lci_summary]]
- [[tool-reference|get_squawks and get_squawk_context]]

## Market scan

Use this workflow to identify what is moving across asset classes and decide where the next layer of analysis should go.

The goal is not to describe every contract. The goal is to rank the active complexes, identify leadership or divergence, and choose whether the user needs an equity, rates, FX, commodities, volatility, or news follow-up.

### When to use this workflow

Use it when the user asks “what’s moving?”, “give me a quick scan”, “how are markets trading?”, or when a conversation needs orientation before a deeper view.

### Before you begin

- Invoke `/using-mercury`.
- Start broad before drilling into a complex.
- Avoid over-calling detailed tools until the scan identifies the active area.

### Steps

1. Pull `get_regime()` for cross-asset regime classification.
2. Pull `get_market_overview()` for tracked instruments and top movers.
3. Drill into the active complex:
   - `get_equities_bundle()` for ES/NQ/YM/RTY.
   - `get_treasuries_bundle(price_format="fractional")` for ZT/ZF/ZN/TN/ZB/UB plus curve context.
   - `get_fx_bundle()` for major FX futures.
   - `get_commodities_bundle()` for energy/metals/agriculture.
4. Use `get_volatility_metrics(symbols=[...])` only for outliers or when the move may be volatility-driven.
5. Summarize ranking, divergence, and next layer.

### Example prompt

```text
/using-mercury market scan
```

### What good output looks like

A good scan answers three questions:

- What is the dominant asset-class move?
- Is the move broad or concentrated?
- What should we inspect next?

Example:

```text
The scan is rates-led: Treasury futures are firmer across the curve while equities are mixed and FX is quiet. The next useful layer is curve/STIR, not a generic equity deep dive, because the leadership is in the front end and belly.
```

### Related tools

- [[tool-reference|get_market_overview]]
- [[tool-reference|get_equities_bundle]]
- [[tool-reference|get_treasuries_bundle]]
- [[tool-reference|get_fx_bundle]]
- [[tool-reference|get_commodities_bundle]]

## Instrument deep dive

Use this workflow to analyse a single futures instrument through price, auction structure, volatility, options, and catalysts.

A good deep dive separates “price moved” from “the market accepted the move”. That distinction matters: a contract can rally into value and fail, break above value with strong acceptance, or chop inside value while volatility rises.

### When to use this workflow

Use it when the user asks for one instrument: `ZN`, `ES`, `NQ`, `CL`, `GC`, `6E`, `SR3`, or another supported contract.

### Before you begin

- Invoke `/using-mercury`.
- Normalize the symbol if needed (`ZN` → `ZN=F` where the tool expects it).
- Use fractional price format for Treasury futures if the user wants desk-style rates pricing.

### Steps

1. Pull `get_symbol_detail(symbol="...")` for detailed market state.
2. Pull `get_amt_snapshot(symbol="...")` for auction structure: value, POC, profile type, tails, single prints, and session context.
3. Pull `get_market_texture(symbol="...")` for efficiency, rotation, trend quality, and texture score.
4. Pull `get_volatility_metrics(symbols=["..."])` for realised vol, ADR, volatility regime, and switch risk.
5. If options matter, pull `get_futures_options(symbol="...", include_delta=true, include_greeks=true)`.
6. If a catalyst is suspected, pull `get_squawk_context(view="topic:<theme>")` or recent squawks.
7. Conclude with directional state, invalidation area, and what would change the read.

### Example prompt

```text
/using-mercury deep dive ZN
```

### What good output looks like

A strong deep dive includes:

- **Price state:** where the contract is relative to recent range/returns.
- **Auction state:** above/below/inside value, POC proximity, profile type, tails/single prints.
- **Volatility state:** quiet balance, expansion, compression, or regime-switch risk.
- **Catalyst state:** whether news/calendar explains the move.
- **Trading implication:** what confirms or invalidates the setup.

Example:

```text
ZN is bid but not yet cleanly accepted: price is pressing above value, but POC proximity remains close and texture is not fully trend-like. If volatility expands while price holds above VAH, the read shifts from short-covering to accepted repricing.
```

### Related tools

- [[tool-reference|get_symbol_detail]]
- [[tool-reference|get_amt_snapshot]]
- [[tool-reference|get_market_texture]]
- [[tool-reference|get_volatility_metrics]]
- [[tool-reference|get_futures_options]]

## Rates and STIR

Use this workflow for Treasury curve, SOFR/STIR, and Fed-pricing questions.

Rates analysis should identify which part of the curve is driving the move and whether short-rate pricing agrees with the Treasury futures complex.

### When to use this workflow

Use it for questions about ZT/ZF/ZN/TN/ZB/UB, curve steepening/flattening, SOFR packs, Fed cuts/hikes, front-end stress, or spread structures such as TUT, NOB, and FIX.

### Before you begin

- Invoke `/using-mercury`.
- Use fractional price format for Treasury futures unless decimal output is specifically needed.
- Separate futures-price moves from yield-curve interpretation.

### Steps

1. Pull `get_curve_snapshot()` for the full curve spread map.
2. Pull `get_curve_analysis(spread_ids=["TUT", "NOB", "FIX"])` for targeted stance.
3. Pull `get_treasuries_bundle(price_format="fractional")` for outright Treasury futures plus curve enrichment.
4. Pull `get_stir_snapshot()` for SOFR calendars, butterflies, and event-sensitive spreads.
5. If needed, pull `get_stir_matrix()` for the full SR3 calendar-spread grid.
6. If macro timing matters, add `get_economic_events(time_range="this_week", importance=["high"])`.

### Example prompt

```text
/using-mercury rates and STIR
```

### What good output looks like

A good rates read says:

- whether the move is front-end, belly, or long-end led;
- whether the curve is bull/bear steepening or flattening;
- whether STIR confirms the same Fed path;
- which data release or Fed event can change the read.

Example:

```text
The curve read is belly-led bull flattening: ZN/TN are leading while the front end is less responsive. STIR is not pricing an aggressive near-term shift, so the move looks more duration-demand than immediate Fed repricing.
```

### Related tools

- [[tool-reference|get_curve_snapshot]]
- [[tool-reference|get_curve_analysis]]
- [[tool-reference|get_treasuries_bundle]]
- [[tool-reference|get_stir_snapshot]]
- [[tool-reference|get_stir_matrix]]

## Liquidity and public finance

Use this workflow when the question is about liquidity, fiscal impulse, Treasury cash, Fed balance-sheet plumbing, repo/RRP, dealers, settlement fails, TIC, or public debt.

Mercury’s PubFinance layer is designed to prevent vague “liquidity is good/bad” claims. It forces the answer into pillars: fiscal, monetary, and plumbing.

### When to use this workflow

Use it when the user asks about liquidity conditions, LCI, Treasury General Account, tax drains, RRP, repo, settlement fails, Treasury operations, primary dealers, TIC flows, or why risk assets may be supported or pressured by plumbing.

### Before you begin

- Invoke `/using-mercury`.
- Start with the aggregate LCI before drilling into components.
- Check data freshness if the conclusion depends on very recent public data.

### Steps

1. Pull `get_market_snapshot()` for broad PubFinance market context.
2. Pull `get_lci_summary()` for current LCI, regime, percentile, and pillar breakdown.
3. Drill fiscal if needed: `get_fiscal_daily()`, `get_fiscal_weekly()`, `get_tga_balance()`, `get_treasury_statement()`.
4. Drill monetary if needed: `get_fed_liquidity_summary()`, `get_fed_balance_sheet()`, `get_reference_rates()`.
5. Drill plumbing if needed: `get_rrp_operations()`, `get_repo_operations()`, `get_primary_dealers()`, `get_settlement_fails()`.
6. Use `get_data_freshness()` if the latest update date matters.
7. Translate the driver into market impact: supportive, neutral, restrictive, or stress-sensitive.

### Example prompt

```text
/using-mercury liquidity
```

### What good output looks like

A good liquidity read identifies the driver, not just the level:

```text
Liquidity is neutral-to-supportive, but the support is fiscal rather than plumbing-driven. LCI is above neutral because Treasury cash flows are adding impulse; RRP/repo conditions do not show acute stress. The market implication is supportive for risk unless front-end rates or settlement fails deteriorate.
```

### Related tools

- [[tool-reference|get_lci_summary]]
- [[tool-reference|get_market_snapshot]]
- [[tool-reference|get_fiscal_daily]]
- [[tool-reference|get_fed_liquidity_summary]]
- [[tool-reference|get_rrp_operations]]
- [[tool-reference|get_settlement_fails]]

## Newsletter and research workflow

Use this workflow to move from live squawks to newsletter/article discovery, graph expansion, progressive search, and synthesis.

This is one of Mercury’s strongest differentiators. It lets Claude combine current tape with a curated article/newsletter archive without opening everything in full detail. The correct pattern is staged retrieval: discover lightweight stubs, enrich selected IDs, then expand by graph or progressive search only when the user wants thematic depth.

### When to use this workflow

Use it when the user asks what newsletters, research notes, or market commentary are saying about a topic. Also use it when live squawks mention a theme and the user wants deeper context.

### Before you begin

- Invoke `/using-mercury`.
- Distinguish **live squawks** from **article archives**.
- Remember that `list_articles(query=...)` and `search_article_bullets(...)` can return relevance-ranked older items. Dates matter.
- Do not call full article detail for many articles. Enrich selected IDs first.

### Steps

1. Start with live tape if the question is current: `get_squawks(limit=20, hours_back=6)`.
2. Get AI-processed context if a live theme is visible: `get_squawk_context(view="topic:<theme>")`.
3. Discover article stubs: `list_articles(query="...", since_days=14, limit=10)`.
4. Enrich selected IDs: `get_article_bullets(ids=[...])`.
5. Open one article only if necessary: `get_article_detail(id="...")`.
6. Expand a promising article: `article_graph(article_id="...", max_depth=1)`.
7. Research a broad topic: `progressive_article_search(seed_query="...", max_iterations=...)`.
8. Search the archive by concept: `search_article_bullets(query="...")`.
9. Synthesize many pieces: `aggregate_articles(query="...", since_days=..., limit=...)`.

### Example prompt

```text
/using-mercury what are newsletters saying about Treasury refunding?
```

### What good output looks like

A good newsletter/research answer separates recency from relevance:

```text
Current tape: no major live refunding squawk in the last few hours.
Recent newsletter view: three recent pieces focus on coupon supply and term premium; two older but relevant pieces frame the issue through dealer balance-sheet capacity.
Consensus: refunding risk is less about the headline size and more about duration distribution and auction tails.
Dissent: one article argues liquidity is adequate if bill supply absorbs cash without pressuring coupons.
Market link: watch ZN/ZB, curve steepeners, and auction tail metrics.
```

### Common mistakes

- Treating archive results as breaking news.
- Opening full detail for 10+ articles instead of using bullets/aggregation.
- Ignoring `published_at` when the query is similarity-ranked.
- Mixing live squawks and newsletters without labeling them.

### Related tools

- [[tool-reference|get_squawks]]
- [[tool-reference|get_squawk_context]]
- [[tool-reference|list_articles]]
- [[tool-reference|get_article_bullets]]
- [[tool-reference|article_graph]]
- [[tool-reference|progressive_article_search]]
- [[tool-reference|aggregate_articles]]
