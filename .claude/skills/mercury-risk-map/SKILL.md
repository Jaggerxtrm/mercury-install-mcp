---
name: mercury-risk-map
description: Cross-asset correlation and risk mapping to identify regime shifts, divergences, and portfolio-level risk concentration. Use when user asks about correlations, cross-asset relationships, whether relationships are breaking down, risk-on vs risk-off regime, safe haven flows, or wants a portfolio-level view of market risk.
allowed-tools: mcp__mercury-market-data__get_regime, mcp__mercury-market-data__get_correlation_matrix, mcp__mercury-market-data__get_volatility_metrics, mcp__mercury-market-data__get_market_overview, mcp__mercury-market-data__get_market_texture, mcp__mercury-pubfinance__get_market_snapshot, mcp__mercury-darth-feedor__get_squawk_context, mcp__mercury-econ-data__get_economic_events, AskUserQuestion
priority: high
---

# Mercury Risk Map — Cross-Asset Correlation & Risk

Correlations are the bedrock of cross-asset risk. When they break, that's often the most interesting signal of all.

> **Correlations shift with regime. Always use live data — a correlation that held last week may be breaking down today.**

---

## Step 1 — Broad Market Snapshot

```
get_market_overview(fields=["symbol", "ret_1d_pct", "ret_5d_pct", "vol_regime", "trend"])
```

Quick orientation: what's up, what's down, what vol regime is each in?

Note any obvious divergences on the 1d return:
- Equities up but bonds also up → unusual (both can't be right for long)
- Gold up + equities up → risk-on with inflation fear
- Gold up + equities down → classic risk-off / safe haven
- CL down + equities down → demand destruction concern

One sentence: *"Early read: [risk-on / risk-off / mixed signals]."*

---

## Step 2 — Correlation Matrix

```
get_correlation_matrix()
```

Focus on the key pairs — don't read every cell. Highlight:

**Equity-Bond correlation:**
- Negative (normal): bonds rally when equities fall (safe haven)
- Positive (abnormal): both moving together — inflation regime or liquidity crunch

**Equity-Vol (VIX):**
- Always inverse — flag if VIX not rising with equity selloff (complacency) or rising in a rally (fear embedded)

**Gold-Dollar:**
- Typically inverse — flag if they're moving together (unusual)

**Crude-Equities:**
- Positive in growth regime; decouples in supply shock

**Rates-FX:**
- Higher US yields → USD stronger (usually) — flag if breaking

Ask: *"Any specific correlation you want to focus on, or should I dig into what's breaking from the norm?"*

---

## Step 3 — Regime Identification

Based on Steps 1 & 2, classify the current regime:

| Regime | Signal |
|--------|--------|
| Risk-On | Equities ↑, bonds ↓, gold ↓, USD ↓ |
| Risk-Off | Equities ↓, bonds ↑, gold ↑, USD ↑ |
| Inflation | Equities mixed, bonds ↓, gold ↑, CL ↑, USD ↑ |
| Stagflation | Equities ↓, bonds ↓, gold ↑, CL ↑ |
| Liquidity Crisis | Everything ↓ — correlations converge to 1 |
| Confused/Mixed | No clean pattern — watch for resolution |

State the regime in one sentence with supporting evidence.

---

## Step 4 — Vol Confirmation

```
get_market_texture()
```

Does the vol texture confirm the regime? Example:
- Risk-off regime + Spike-Rising vol across equities → confirmed
- Risk-off signal but vol compressed → could be a false move or early

---

## Step 5 — Catalyst Check

```
get_economic_events(time_range="today", importance=["high"])
get_squawk_context(view="topic:risk sentiment market flows")
```

Is there a macro or geopolitical catalyst driving the regime? Or is it technical / positioning-driven?

---

## Step 6 — Divergence Alert

Flag any instrument where the **price is moving against the regime**:
- Example: risk-off regime but gold selling off → anomaly worth investigating
- Example: dollar strengthening but yields falling → dollar being bought as safe haven, not on rate differential

Ask: *"There's a divergence in [X] — want me to pull the news context or check the vol metrics on that specifically?"*
