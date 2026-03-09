---
name: mercury-commodities
description: Commodity market analysis covering energy, metals, and agricultural futures. Use when user asks about commodities, oil, crude, gold, silver, natural gas, the commodity complex, or specific commodity instruments (CL, GC, SI, NG).
allowed-tools: mcp__mercury-market-data__get_commodities_bundle, mcp__mercury-market-data__get_symbol_detail, mcp__mercury-market-data__get_amt_snapshot, mcp__mercury-market-data__get_volatility_metrics, mcp__mercury-market-data__get_correlation_matrix, mcp__mercury-econ-data__get_economic_events, mcp__mercury-darth-feedor__get_squawk_context, AskUserQuestion
priority: high
---

# Mercury Commodities Analysis

Commodities are driven by macro, geopolitics, and supply/demand in ways that differ from financial assets. Always read them with cross-asset context.

> **Commodity prices are highly sensitive to geopolitical headlines and inventory data. Always fetch live data and check for fresh squawks.**

---

## Step 1 — Commodity Bundle Snapshot

```
get_commodities_bundle()
```

Present in two groups:

**Energy:** CL (crude), NG (natural gas)
- Price, 1d/5d return, range position, vol regime
- Any notable move? Large gap? Spike in vol?

**Metals:** GC (gold), SI (silver)
- Same fields
- Gold/silver ratio: if both available, note divergence

One-line summary: *"Energy complex weak — CL -2% on demand concerns, metals bid — GC at 20-day highs."*

---

## Step 2 — Which Commodity to Focus On?

> "Want to go deeper on a specific commodity — crude oil, gold, silver, or natural gas?"

---

## Step 3 — Single Commodity Deep Dive

```
get_symbol_detail(symbol="<CL=F / GC=F / SI=F / NG=F>")
get_amt_snapshot(symbol="<symbol>")
```

**Crude oil (CL):**
- Where is price relative to value area?
- Note: CL is driven by EIA inventory data, OPEC decisions, geopolitical risk premium
- Check if any inventory release today

**Gold (GC):**
- Gold is a dollar/rates/risk hedge — always read vs USD and real yields
- At 20-day highs? Breakout or exhaustion?

**Silver (SI):**
- More industrial than gold — tends to lag gold in risk-off, outperform in risk-on
- Gold/silver ratio context useful

**Natural Gas (NG):**
- High-vol instrument — note the vol regime carefully
- Seasonal and weather-driven

---

## Step 4 — Cross-Asset Context

```
get_correlation_matrix()
```

Focus on:
- **CL vs equities:** Risk-on tends to lift both; supply shocks decouple them
- **GC vs USD:** Gold/dollar typically inversely correlated — check if holding
- **GC vs real yields:** Gold falls when real yields rise (opportunity cost)
- **NG vs seasonal norms:** Not always in correlation matrix but flag if vol is extreme

2–3 sentences max.

---

## Step 5 — Macro & Geopolitical Calendar

```
get_economic_events(time_range="today", importance=["high", "medium"])
```

For commodities, flag:
- EIA Crude Inventories (Wednesday) — CL mover
- US/China PMI data — demand signal for CL and metals
- Inflation data — GC bullish on upside surprises

---

## Step 6 — News Squawks

```
get_squawk_context(topic="oil crude gold commodities energy")
```

List 2–3 relevant squawks. Geopolitical headlines move CL fast — flag any OPEC, Middle East, or Russia-Ukraine references.

Ask: *"Any specific driver you want to track — OPEC, inventory data, dollar move, or a geopolitical story?"*

---

## Volatility Note

Commodities (especially NG and CL) can have extreme intraday vol. If vol regime shows `Spike-Rising`:
```
get_volatility_metrics(symbol="<symbol>")
```
Report ADR — how much room is left in today's range relative to the average.
