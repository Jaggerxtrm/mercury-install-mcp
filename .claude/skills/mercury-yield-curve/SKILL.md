---
name: mercury-yield-curve
description: Treasury yield curve and short-term interest rate (STIR) analysis. Use when user asks about rates, the yield curve, curve shape, inversions, STIR markets, Fed pricing, rate spreads, or anything related to fixed income futures (ZT, ZF, ZN, ZB, UB, TN).
allowed-tools: mcp__mercury-market-data__get_curve_snapshot, mcp__mercury-market-data__get_curve_analysis, mcp__mercury-market-data__get_treasuries_bundle, mcp__mercury-market-data__get_stir_bundle, mcp__mercury-market-data__get_stir_snapshot, mcp__mercury-econ-data__get_economic_events, mcp__mercury-darth-feedor__get_squawk_context, AskUserQuestion
priority: high
---

# Mercury Yield Curve & STIR Analysis

Rates are intermarket context for everything else. Always fetch live — curve shape can shift fast around data prints.

> **Rates markets are especially sensitive to economic releases and central bank communication. Always check the economic calendar alongside curve data.**

---

## Step 1 — Curve Snapshot

```
get_curve_snapshot()
```

Report the key spreads in one line each:
- **2s10s** (2yr vs 10yr): Inverted, flat, or steep? Direction vs yesterday?
- **5s30s**: Long-end steepening or flattening?
- **TUT** (2yr vs 30yr): Broad curvature

One-sentence interpretation: *"The 2s10s spread has steepened to +X bps — market is pricing in cuts ahead."*

---

## Step 2 — Curve Analysis

```
get_curve_analysis()
```

Look for:
- Regime change signals (steepening vs flattening momentum)
- Where spreads are relative to recent range
- Unusual moves at specific tenors (e.g. belly richening)

Present as 2–3 observations, not a wall of text.

---

## Step 3 — Ask: Treasuries or STIR?

> "Do you want to look at the treasury futures (ZT to TN) in detail, or drill into STIR — the front-end rate pricing and central bank expectations?"

**If Treasuries:**

```
get_treasuries_bundle()
```

Show each contract (ZT, ZF, ZN, ZB, UB, TN): price, 1d return, range position. Flag which part of the curve is moving most.

**If STIR:**

```
get_stir_bundle()
get_stir_snapshot()
```

Report:
- Front contract level and move
- What rate path the market is pricing (cuts/hikes)
- Any divergence between Fed pricing and ECB/BoE pricing

---

## Step 4 — Macro Calendar Check

```
get_economic_events(time_range="today", countries=["united states"], importance=["high", "medium"])
```

Flag any pending data that could move the curve:
- CPI / PCE → inflation impact on long end
- NFP / unemployment → Fed reaction function
- FOMC / speakers → front-end vol

Ask: *"There's a [CPI print / FOMC speaker] at [time]. Want me to monitor squawks around it?"*

---

## Step 5 — News Context (optional)

```
get_squawk_context(topic="treasuries yields rates")
```

List 2–3 relevant headlines. Are they explaining today's curve move?

---

## Refresh Rule

Yield curves are especially sensitive to intraday flow. If the user asks "any change in rates?" — **always re-run Steps 1 and 2** before answering.
