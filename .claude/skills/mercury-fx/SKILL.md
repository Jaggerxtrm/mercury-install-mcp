---
name: mercury-fx
description: FX market analysis covering major currency pairs with cross-asset context. Use when user asks about FX, currencies, dollar strength/weakness, euro, pound, yen, Swiss franc, specific currency pairs, or DXY direction.
allowed-tools: mcp__mercury-market-data__get_fx_bundle, mcp__mercury-market-data__get_symbol_detail, mcp__mercury-market-data__get_correlation_matrix, mcp__mercury-market-data__get_stir_bundle, mcp__mercury-econ-data__get_economic_events, mcp__mercury-darth-feedor__get_squawk_context, AskUserQuestion
priority: high
---

# Mercury FX Analysis

FX is a relative game — always read pairs in context of rates differentials and risk-on/off. Never read one pair in isolation.

> **FX rates move continuously, especially around data prints and central bank events. Always fetch live data.**

---

## Step 1 — FX Bundle Snapshot

```
get_fx_bundle()
```

Present each major (6E, 6B, 6J, 6S) with:
- Current price and 1d return
- 5-day range position (near highs or lows?)
- Vol regime

One-line dollar read: *"Dollar broadly [stronger/weaker/mixed] today — EUR -0.2%, GBP flat, JPY +0.4%."*

---

## Step 2 — Ask Which Pair to Focus On

> "Which pair are you interested in — EUR/USD, GBP/USD, USD/JPY, USD/CHF — or do you want the full cross-asset picture first?"

---

## Step 3a — Single Pair Deep Dive (if pair selected)

```
get_symbol_detail(symbol="<6E=F or 6B=F etc>")
```

Report: price, session state, 1d/5d return, range positions, trend, vol regime.

Map CME futures to FX spot pairs for the user:
- `6E=F` = EUR/USD
- `6B=F` = GBP/USD
- `6J=F` = USD/JPY (inverted — higher 6J = weaker dollar)
- `6S=F` = USD/CHF (inverted)

---

## Step 3b — Cross-Asset Context (if full picture requested)

```
get_correlation_matrix()
```

Focus on FX vs:
- **Rates:** EUR/USD typically negatively correlated with US yields rising (dollar strengthens)
- **Equities:** Risk-on often = EUR/USD up, JPY down
- **Commodities:** AUD/CAD sensitive to commodity prices

Describe the current correlation regime in 2–3 lines. Is FX tracking rates, risk sentiment, or breaking the usual relationship?

---

## Step 4 — Rates Differential Check

```
get_stir_bundle()
```

FX moves are often driven by rate differential expectations. Check:
- Is the USD front-end pricing more cuts than EUR/GBP?
- That would be USD-negative → EUR/GBP positive

One sentence: *"US STIRs pricing 2 cuts this year vs ECB pricing 1 — rate differential supports EUR."*

---

## Step 5 — Macro Calendar

```
get_economic_events(time_range="today", importance=["high"])
```

Flag any FX-moving events today:
- US data → dollar volatility
- ECB/BoE/BoJ speakers or decisions → respective pair vol
- Inflation prints → rate path repricing

---

## Step 6 — News Check (optional)

```
get_squawk_context(topic="currency FX dollar euro")
```

2–3 relevant squawks. Are they explaining the move?

Ask: *"Any specific driver you want to dig into — a central bank story, geopolitical risk, positioning?"*
