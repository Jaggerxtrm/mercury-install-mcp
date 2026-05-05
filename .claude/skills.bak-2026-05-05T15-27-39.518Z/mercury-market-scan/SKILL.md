---
name: mercury-market-scan
description: Quick live market scan covering all instrument complexes with regime context. Use when user asks for a market check, quick scan, "what's moving", current prices, or wants a broad view before narrowing to a specific instrument or asset class.
allowed-tools: mcp__mercury-market-data__get_regime, mcp__mercury-market-data__get_market_overview, mcp__mercury-market-data__get_market_texture, mcp__mercury-market-data__get_volatility_metrics, mcp__mercury-pubfinance__get_lci_summary, AskUserQuestion
priority: high
---

# Mercury Market Scan

A fast, layered scan. Never show everything at once — lead with what's notable.

> **Markets move continuously. Always fetch fresh data — never describe prices from earlier in the session.**

---

## Step 1 — Live Snapshot

```
get_market_overview()
```

**Present in two sentences max per complex:**

- **Equities** (ES, NQ, RTY, YM): Direction + strongest/weakest + vol regime
- **Rates** (ZN, ZB): Up or down on the day? Meaningful or noise?
- **Commodities** (CL, GC, SI): Any outliers?
- **FX** (6E, 6B, 6J): Dollar trend?
- **VIX**: Elevated, suppressed, or normal?

Flag anything that stands out:
- `pos_5d` or `pos_20d` near 0 (at lows) or 1 (at highs)
- `vol_regime` showing Spike-Rising
- Large 1d return vs small 5d (mean reversion setup?)

---

## Step 2 — Texture Check

```
get_market_texture()
```

One line per complex. Answer: **Is the market trending or balancing?**

Translate the regime into plain language:
- "ES is in a balance phase — expect two-sided action"
- "ZN trending lower — sellers in control"

---

## Step 3 — Ask to Go Deeper

Present the 1–2 most interesting observations, then ask:

> "The standout moves are [X] and [Y]. Want to dig into one of those — or scan volatility metrics across the board?"

**If user picks an instrument** → hand off to `/mercury-deep-dive`
**If user asks about rates** → hand off to `/mercury-yield-curve`
**If user asks about vol** → hand off to `/mercury-vol-regime`
**If user wants FX** → hand off to `/mercury-fx`

---

## Refresh Prompt

If the user asks "what changed?" or "any updates?" — **always re-run Step 1 and Step 2** with new calls. Describe the delta vs what you showed before, not the full snapshot again.
