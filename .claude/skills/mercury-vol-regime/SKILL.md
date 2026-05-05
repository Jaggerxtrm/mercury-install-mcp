---
name: mercury-vol-regime
description: Volatility regime analysis combined with auction market structure. Use when user asks about volatility, vol regime, whether markets are quiet or explosive, ADR, HMM regimes, VIX, realised volatility, or wants to understand auction structure (Value Area, POC, single prints) for a specific instrument.
allowed-tools: mcp__mercury-market-data__get_volatility_metrics, mcp__mercury-market-data__get_amt_snapshot, mcp__mercury-market-data__get_market_texture, mcp__mercury-market-data__get_symbol_detail, mcp__mercury-market-data__get_futures_options, mcp__mercury-market-data__get_market_overview, mcp__mercury-darth-feedor__get_squawk_context, AskUserQuestion
priority: high
---

# Mercury Volatility Regime & Auction Structure

Vol regime tells you *how* the market is moving. AMT structure tells you *where* it is. Together they give context for any directional or positioning view.

> **Vol regimes can shift fast — especially around data. Always fetch fresh data before drawing conclusions.**

---

## Step 1 — Market Texture Overview

```
get_market_texture()
```

One-liner per complex: what regime is each in?

Common regimes:
- **Compressed / Quiet** — low vol, expect expansion eventually
- **Normal-Rising** — orderly trending move
- **Spike-Rising** — sharp vol expansion, potentially news-driven
- **Choppy/Balance** — two-sided, mean-reverting

Flag anything that looks like a regime inflection (e.g. compressed → spiking).

---

## Step 2 — Ask: Which Instrument?

> "Which instrument do you want to dig into — or would you like a broad vol scan across all complexes?"

**If broad scan:** proceed to Step 3
**If specific instrument:** jump to Step 4

---

## Step 3 — Broad Vol Scan

```
get_market_overview(fields=["symbol", "vol_regime", "pos_5d", "pos_20d", "ret_1d_pct"])
```

Rank instruments by vol regime severity (Spike-Rising > Normal-Rising > Compressed). Flag:
- Anything in Spike-Rising not explained by an obvious catalyst
- Large mismatches between 5d range position and 1d move (vol whipsaw)

---

## Step 4 — Single Instrument Vol Detail

```
get_volatility_metrics(symbols=["<symbol>"])
```

Report:
- **Realised Vol (RV):** current vs historical norm — elevated or suppressed?
- **HMM Regime:** what state is the vol model in?
- **ADR (Average Daily Range):** how much has it moved today vs its typical daily range? How much room is left?
- **Implied vs Realised gap** (if available): options pricing more/less vol than realised?

Translate into plain language: *"ES has used 60% of its ADR already — limited room for extension if vol stays in current regime."*

---

## Step 5 — Auction Structure (AMT)

```
get_amt_snapshot(symbol="<symbol>")
```

The vol context should be read with AMT:

- **High vol + above value area** → breakout attempt, aggressive buyers
- **High vol + below value area** → breakdown, sellers in control
- **Low vol inside value area** → balance/consolidation, awaiting catalyst
- **Single prints above/below** → market has not returned to test these levels yet — potential magnet

Present: where is price vs POC, VAH, VAL? Are there unfilled single prints nearby?

---

## Step 6 — VIX Context

```
get_symbol_detail(symbol="^VIX")
```

VIX level:
- Below 15 → complacency / low-vol regime
- 15–20 → normal
- 20–30 → elevated concern
- Above 30 → fear / crisis mode

Note: VIX above 25 while equities are holding up can signal vol sellers stepping in. VIX compressing while equities fall = unusual, worth flagging.

---

## Step 7 — News Driver Check (if vol spike)

```
get_squawk_context(view="topic:volatility market risk")
```

Is there a headline explaining the spike? Or is it a technical/positioning move?

Ask: *"The vol spike in [instrument] [is/isn't] explained by headlines. Want me to look for a specific catalyst in the news flow?"*
