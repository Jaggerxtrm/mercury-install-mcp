---
name: mercury-morning-brief
description: Full morning market setup combining economic calendar, regime, live market snapshot, liquidity/plumbing, and top news headlines. Use when user asks for a morning brief, pre-market overview, daily setup, or "what's happening today". Covers all four Mercury MCPs in sequence.
allowed-tools: mcp__mercury-market-data__get_regime, mcp__mercury-market-data__get_market_overview, mcp__mercury-market-data__get_market_texture, mcp__mercury-econ-data__get_economic_events, mcp__mercury-pubfinance__get_market_snapshot, mcp__mercury-pubfinance__get_lci_summary, mcp__mercury-darth-feedor__get_squawks, mcp__mercury-darth-feedor__get_squawk_context, AskUserQuestion
priority: high
---

# Mercury Morning Brief

A structured pre-session workflow. Run each step, present results concisely, then ask before going deeper. Markets are always moving — fetch fresh data at every step.

---

## Step 1 — Calendar First

Fetch today's high-importance events:
```
get_economic_events(time_range="today", importance=["high", "medium"])
```

Present as a compact table. Call out:
- Any events **already released** (compare actual vs forecast — surprise direction?)
- Events **still pending** today (what time, what's expected?)
- Anything market-moving (NFP, CPI, rate decisions, GDP)

Then ask:
> "Any of these events on your radar, or should we move to the market snapshot?"

---

## Step 2 — Market Snapshot

Fetch live prices:
```
get_market_overview()
```

Present the 4 key complexes in short blocks — **do not dump all 19 instruments at once**:

**Equities:** ES, NQ, RTY, YM — direction, 1d return, vol regime
**Rates:** ZN, ZB — direction vs yesterday
**Commodities:** CL, GC — overnight move
**FX:** 6E, 6B — dollar strength context

Flag anything notable: large overnight gaps, vol regime spikes, extreme range positioning.

---

## Step 3 — Market Texture

```
get_market_texture()
```

One sentence per complex: trending or balancing? Rising or compressing volatility?

---

## Step 4 — Top Headlines

```
get_squawks(limit=10)
```

List the 5 most relevant squawks. Highlight any that connect to:
- The economic events from Step 1
- The price moves flagged in Step 2

---

## Step 5 — Focus Question

Ask the user:
> "Based on what we see — [summarise 1-2 key themes] — where do you want to focus? A specific instrument, the rates complex, commodities, or something from the news flow?"

Then load the appropriate skill: `/mercury-deep-dive`, `/mercury-yield-curve`, `/mercury-fx`, etc.

---

## Refresh Rule

If the user returns to this brief later in the session, **always re-run Steps 1–4 with fresh calls**. Do not reuse earlier data. Price action and news flow change continuously.
