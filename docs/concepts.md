---
title: Mercury Concepts
description: Market-structure and liquidity concepts used by Mercury workflows.
nav_order: 5
publish: true
---

# Mercury Concepts

Use this guide to interpret the domain language that Mercury tools return. It is not a textbook; it explains the concepts needed to use the workflows correctly.

## Auction Market Theory

Mercury uses AMT/Market Profile outputs to describe whether price is being accepted, rejected, or rotating around value.

### Key terms

| Term | Meaning |
|---|---|
| POC | Point of Control — price with the most activity in the profile. |
| Value Area | Price range where most activity occurred. |
| VAH / VAL | Value Area High / Low. |
| Initial Balance | Early-session range. |
| Single prints | Thin areas where price moved quickly and did not trade much. |
| Buying/selling tail | Rejection at lows/highs. |
| Profile type | Shape of the auction: Normal, Trend, Double Distribution, etc. |

### How to use it

Start with `get_amt_snapshot(symbol="...")` after `get_symbol_detail`. If price is above value, buyers are accepting higher prices. If price is below value, sellers are controlling the auction. If price is inside value, the market is two-sided.

### Related workflow

[[workflows|Instrument deep dive]]

## Volatility regime

Mercury volatility tools help distinguish quiet balance from active trend, disorderly expansion, and regime-transition risk.

### Key outputs

- `vol_regime`: low, medium, high.
- `vol_rv_annual`: realised volatility.
- `vol_adr_pct`: average daily range context.
- `vol_switch_risk`: risk of regime transition.
- `tick_compression`: compression/expansion in tick activity.
- Market texture: efficiency ratio, rotation factor, texture score, trend quality.

### How to use it

Use `get_volatility_metrics(symbols=[...])` and `get_market_texture(symbol)` after price/AMT. High volatility above value is different from high volatility inside value. The first can be directional acceptance; the second can be disorderly chop.

### Related workflow

[[workflows|Instrument deep dive]]

## LCI and liquidity pillars

The Liquidity Composite Index (LCI) summarises market liquidity across three pillars.

| Pillar | Weight | What it captures |
|---|---:|---|
| Fiscal | 40% | Treasury spending, taxes, TGA, fiscal impulse. |
| Monetary | 35% | Fed balance sheet, net liquidity, reference rates. |
| Plumbing | 25% | RRP/repo, dealers, settlement fails, market plumbing. |

### Interpretation

| LCI | Regime | Read |
|---|---|---|
| > +1.5 | Very Loose | Abundant liquidity. |
| +0.5 to +1.5 | Loose | Above-average support. |
| -0.5 to +0.5 | Neutral | No strong impulse. |
| -1.5 to -0.5 | Tight | Below-average; watch vol/credit. |
| < -1.5 | Very Tight | Scarce liquidity; stress window. |

### How to use it

Start with `get_market_snapshot()` or `get_lci_summary()`. Then drill into the pillar doing the work. A fiscal tax drain is not the same as monetary tightening or plumbing stress.

### Related workflow

[[workflows|Liquidity and public finance]]

## Curve and STIR

Mercury separates Treasury futures curve structure from short-term interest-rate pricing.

### Curve tools

- `get_curve_snapshot()` — all core Treasury ICS spreads.
- `get_curve_analysis(spread_ids=[...])` — targeted spreads such as TUT, NOB, FIX.
- `get_treasuries_bundle(price_format="fractional")` — futures complex plus curve enrichment.

### STIR tools

- `get_stir_bundle()` — SOFR/ZQ outrights and implied rates.
- `get_stir_snapshot()` — calendar, butterfly, and EF spreads.
- `get_stir_matrix()` — full SR3 calendar spread grid.

### How to read it

Ask whether the move is front-end-led, belly-led, or long-end-led. Then describe stance: bull steepening, bear steepening, bull flattening, or bear flattening.

### Related workflow

[[workflows|Rates and STIR]]

## Newsletter retrieval model

Darth Feedor has separate retrieval modes for live tape, recent newsletter discovery, archive search, graph expansion, and synthesis.

### Retrieval layers

| Layer | Tool | Use |
|---|---|---|
| Live tape | `get_squawks` | Breaking/recent market headlines. |
| Rolling context | `get_squawk_context` | AI-processed themes/topics from squawks. |
| Recent articles | `list_articles` | Lightweight stubs for newsletters/articles. |
| Enrichment | `get_article_bullets` | Mechanisms, sentiment, relevance for selected IDs. |
| Full detail | `get_article_detail` | One article at a time when needed. |
| Graph | `article_graph` | Follow related pieces by shared tags. |
| Progressive | `progressive_article_search` | Broad topic research. |
| Archive | `search_article_bullets` | Relevance-ranked concept search; check dates. |
| Synthesis | `aggregate_articles` | Panoramic summary across many pieces. |

### Rule of thumb

Do not open full detail for many articles. Start with stubs, enrich selected IDs, then use graph/progressive search only when the user wants thematic depth.

### Related workflow

[[workflows|Newsletter and research workflow]]
