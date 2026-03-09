---
name: mercury-econ-watch
description: Economic event calendar monitoring with pre-event setup and post-release reaction analysis. Use when user asks about economic data, macro releases, NFP, CPI, GDP, PMI, central bank decisions, what's on the calendar, or wants to track a specific event before or after its release.
allowed-tools: mcp__mercury-econ-data__get_economic_events, mcp__mercury-market-data__get_market_overview, mcp__mercury-market-data__get_symbol_detail, mcp__mercury-market-data__get_volatility_metrics, mcp__mercury-darth-feedor__get_squawk_context, mcp__mercury-darth-feedor__get_squawks, AskUserQuestion
priority: high
---

# Mercury Economic Event Watch

Three modes: **calendar scan**, **pre-event prep**, and **post-release reaction**. Ask which mode before starting.

> **Econ data moves markets instantly. Always fetch live prices after a release — never assume what happened based on consensus.**

---

## Mode Selection

Ask the user:
> "Are we prepping for an upcoming release, checking what just came out, or scanning the week ahead?"

---

## Mode A — Calendar Scan

```
get_economic_events(time_range="today", importance=["high", "medium"])
```

Present as a table: time | country | event | forecast | previous | actual (if released)

Then ask: *"Any specific event you want to prep for, or shall we look at the week ahead?"*

For week ahead:
```
get_economic_events(time_range="this_week", importance=["high"])
```

Flag the 3 most market-moving events of the week. For each, explain in one sentence *why* it matters (e.g. "NFP — primary labour market gauge for Fed reaction function").

---

## Mode B — Pre-Event Prep

Step 1 — Get the event details:
```
get_economic_events(time_range="today", countries=["<country>"], importance=["high"])
```

Report: What is being released? Consensus forecast? Previous reading? Which direction would be a positive surprise vs negative surprise?

Step 2 — Check current market positioning:
```
get_symbol_detail(symbol="<most relevant instrument>")
```

How much is the market already pricing in? Is the instrument near highs or lows going into the print?

Step 3 — Vol context:
```
get_volatility_metrics(symbol="<instrument>")
```

What is the ADR? Is there room for a big move or is the instrument already extended?

Step 4 — Ask:
> "Do you want me to monitor squawks the moment the data hits, or set up a watchlist of instruments to check post-release?"

---

## Mode C — Post-Release Reaction

Step 1 — Pull the actual:
```
get_economic_events(time_range="today", importance=["high"])
```

Compare: **Actual vs Forecast vs Previous**. Was it a beat, miss, or in-line? By how much?

Classify the surprise:
- Large beat → hawkish for rates, potentially bullish for dollar/equities (depends on context)
- Large miss → dovish, potentially bearish dollar
- In-line → likely limited reaction

Step 2 — Market reaction:
```
get_market_overview(symbols=["<relevant instruments>"])
```

What actually happened vs what was expected? Markets don't always react "correctly" — describe the *actual* price move, not the theoretical one.

Step 3 — News confirmation:
```
get_squawks(limit=10)
```

Is the market narrative in squawks consistent with the move? Any secondary effects (e.g. CPI beat → bonds sell off → gold dips)?

Step 4 — Dig deeper if needed:
```
get_squawk_context(topic="<event name>")
```

Step 5 — Ask:
> "The market [reacted as expected / surprised to the [upside/downside]]. Want to track how this evolves, or move to a specific instrument?"

---

## Country Quick-Reference

| Country | Key events | Primary instruments affected |
|---------|-----------|------------------------------|
| United States | NFP, CPI, PCE, FOMC | ES, NQ, ZN, DXY (6E/6B) |
| European Union | CPI, ECB | 6E, ZN |
| United Kingdom | CPI, BoE | 6B |
| Japan | GDP, BoJ | 6J |
| China | PMI, GDP | CL, GC, RTY |
