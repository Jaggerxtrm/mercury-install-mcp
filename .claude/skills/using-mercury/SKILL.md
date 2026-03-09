---
name: using-mercury
description: Mercury Platform onboarding and tool reference. TRIGGER at session start when Mercury MCP servers are connected, or when user asks about available market tools, Mercury capabilities, or what data is available. Also trigger when user says "what can you do" or "what tools do you have" in a trading/markets context.
allowed-tools: mcp__mercury-market-data__*, mcp__mercury-econ-data__*, mcp__mercury-darth-feedor__*, AskUserQuestion
priority: high
---

# Mercury Platform — Session Onboarding

You have access to three live Mercury MCP servers. Markets are always moving — **always fetch fresh data rather than relying on anything stated earlier in the conversation.**

---

## Your Tools at a Glance

### 1. Mercury Market Data
Real-time futures, FX, and volatility data.

| Tool | Use it when... |
|------|---------------|
| `get_market_overview` | Session start, quick price check, broad scan |
| `get_market_texture` | Understanding regime — trending vs. choppy |
| `get_symbol_detail` | Deep single-instrument analysis |
| `get_amt_snapshot` | Auction structure — Value Area, POC, singles |
| `get_volatility_metrics` | RV, ADR, HMM vol regime |
| `get_equities_bundle` | ES, NQ, YM, RTY overview |
| `get_fx_bundle` | EUR, GBP, JPY, CHF, AUD overview |
| `get_commodities_bundle` | CL, GC, SI, NG overview |
| `get_treasuries_bundle` | ZT, ZF, ZN, ZB, UB, TN overview |
| `get_stir_bundle` / `get_stir_snapshot` | Front-end rates, Fed/ECB pricing |
| `get_curve_snapshot` / `get_curve_analysis` | Yield curve shape, spreads, inversions |
| `get_correlation_matrix` | Cross-asset relationships |
| `get_options_data` | Options flow and skew |

### 2. Mercury Econ Data
Macro event calendar with actuals, forecasts, and previous readings.

| Tool | Use it when... |
|------|---------------|
| `get_economic_events` | Checking today's releases, week ahead, event prep |

### 3. Mercury Darth Feedor
Financial news, squawks, and research retrieval.

| Tool | Use it when... |
|------|---------------|
| `get_squawks` | Real-time headline flow (most recent first) |
| `get_squawk_context` | Deeper context on a squawk topic |
| `list_articles` / `get_articles` | Browse article feed |
| `get_article_bullets` | Quick summary of an article |
| `get_article_detail` | Full article content |
| `get_research` | Structured research reports |
| `aggregate_articles` | Theme or topic aggregation across articles |

---

## Core Principles

1. **Always refresh.** Markets move continuously. Before any analysis, fetch current data.
2. **Start broad, then narrow.** Use `get_market_overview` first, then drill into specific instruments.
3. **Cross-reference.** Price action + news flow + macro calendar together tell a better story.
4. **Ask before assuming.** When scope is unclear, use `AskUserQuestion` to clarify the instrument, timeframe, or goal.
5. **Be gradual.** Show one layer at a time. Let the user guide the depth of analysis.

---

## Available Skills (type `/mercury-` to see them)

| Skill | What it does |
|-------|-------------|
| `/mercury-morning-brief` | Full morning setup: calendar + market snapshot + top headlines |
| `/mercury-market-scan` | Live market scan + regime texture |
| `/mercury-deep-dive` | Single instrument deep analysis |
| `/mercury-yield-curve` | Rates, curve shape, and STIR analysis |
| `/mercury-fx` | FX pair monitoring and cross-asset context |
| `/mercury-commodities` | Energy, metals, and commodity complex |
| `/mercury-news-flow` | Squawks + article drill-through workflow |
| `/mercury-econ-watch` | Economic event prep and reaction analysis |
| `/mercury-vol-regime` | Volatility regime + auction structure |
| `/mercury-risk-map` | Cross-asset correlation and risk mapping |

---

## Quick Start

After loading this skill, ask the user:

> "Markets are live. Would you like a morning brief, a quick market scan, or are you focused on something specific today?"
