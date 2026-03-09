# Mercury MCP Installer

Interactive CLI installer for all [Mercury Platform](https://mercuryintelligence.net) MCP servers in Claude Code.

## Usage

```bash
npx github:Jaggerxtrm/mercury-install-mcp
```

No npm account or global install required. Requires **Node.js ≥ 18** and the **Claude Code CLI** (`claude`).

Works on Windows, macOS, and Linux.

## What it installs

| Server | Label | Description |
|--------|-------|-------------|
| `mercury-market-data` | Market Intelligence | Futures prices, AMT profiles, volatility metrics, yield curve spreads |
| `mercury-darth-feedor` | Darth Feedor | Financial articles, squawk context, and research — progressive retrieval, filtered views |
| `mercury-econ-data` | Economic Calendar | Macro events, economic releases, central bank decisions |

All servers connect to `mcp.mercuryintelligence.net` via the `streamable-http` transport and require a **Mercury API Key**.

## How it works

1. Lists available servers with descriptions and URLs
2. Prompts which to install (`1 3`, `all`, etc.)
3. Prompts for scope — **user** (`~/.claude.json`) or **project** (`.mcp.json`)
4. Detects already-installed servers and offers to reinstall or skip
5. Prompts for your Mercury API Key (hidden input)
6. Runs `claude mcp add` for each selected server with the correct transport and auth header

## Adding a new server

Edit `servers.json` — no code changes needed:

```json
{
  "name": "mercury-<service>",
  "label": "Human Label",
  "description": "One-line description",
  "url": "https://mcp.mercuryintelligence.net/<path>/mcp",
  "transport": "streamable-http"
}
```

Push to `main` — available immediately to all users via `npx github:`.

## Pinning a version

```bash
npx github:Jaggerxtrm/mercury-install-mcp#v1.0.0
```

## Architecture

```
mercury-install-mcp/
├── index.js       # CLI entrypoint — pure Node built-ins (readline, child_process)
├── servers.json   # MCP server registry — the only file to edit when adding a server
└── package.json   # npm metadata and bin entry
```

No external dependencies. Uses `readline` for interactive prompts (including hidden key input) and `child_process.spawnSync` to invoke `claude mcp add/get/remove`.

---

## Agent Skills

Once the MCPs are installed, a set of Claude Code skills is available to get the most out of the platform. Skills are interactive workflows that guide the agent step-by-step, fetching live data at each stage rather than producing a single large text dump.

> **All skills treat market data as live and time-sensitive. They always fetch fresh data rather than relying on anything stated earlier in the conversation.**

Install skills via the [Claude Code skills system](https://github.com/anthropics/claude-code) or copy them into `~/.claude/skills/`.

### `using-mercury` — Session Onboarding *(load at session start)*

Maps all three MCPs and their tools, explains when to use each, and lists all available skills. Triggers automatically when Mercury MCP servers are connected or when the user asks what tools are available. Ends with a prompt asking the user where they want to start.

**Tools:** all Mercury MCPs · **Trigger:** session start, "what can you do", "what tools do you have"

---

### `mercury-morning-brief` — Daily Setup

Full pre-session workflow combining all three MCPs in sequence: today's high-importance economic events, a live market snapshot across all four complexes (equities, rates, commodities, FX), market texture/regime context, and the latest squawk headlines. Presents each layer concisely and asks where to focus before going deeper.

**Tools:** market overview, market texture, economic events, squawks · **Trigger:** "morning brief", "pre-market", "daily setup", "what's happening today"

---

### `mercury-market-scan` — Quick Market Check

Fast scan of all instrument complexes: current prices, 1d/5d returns, range positioning, vol regimes. Surfaces outliers and notable moves, then asks the user which instrument or complex to dig into. Hands off to the appropriate specialist skill.

**Tools:** market overview, market texture, volatility metrics · **Trigger:** "market check", "quick scan", "what's moving", "current prices"

---

### `mercury-deep-dive` — Single Instrument Analysis

Layered analysis of one instrument. Starts with price snapshot and range positioning, then adds AMT auction structure (Value Area, POC, single prints), then optionally adds vol regime metrics and news context. User steers depth at each step.

**Tools:** symbol detail, AMT snapshot, volatility metrics, squawk context · **Trigger:** "tell me about ES", "deep dive on gold", "analyse crude", any specific instrument name

---

### `mercury-yield-curve` — Rates & Curve Analysis

Yield curve shape, spread analysis (2s10s, 5s30s, TUT), and STIR front-end pricing. Covers treasury futures individually (ZT → TN) and short-term rate expectations. Cross-references the economic calendar for curve-moving releases and adds squawk context.

**Tools:** curve snapshot, curve analysis, treasuries bundle, STIR bundle/snapshot, economic events, squawk context · **Trigger:** "yield curve", "rates", "2s10s", "STIR", "Fed pricing", "ZN", "ZB"

---

### `mercury-fx` — Currency Analysis

Live FX bundle snapshot across major pairs (EUR, GBP, JPY, CHF), with optional single-pair deep dive. Cross-references rate differentials via STIR data, cross-asset correlations, and the macro calendar. Flags when FX is breaking from its usual relationship with yields or risk sentiment.

**Tools:** FX bundle, symbol detail, correlation matrix, STIR bundle, economic events, squawk context · **Trigger:** "FX", "currencies", "dollar", "euro", "yen", specific currency pair names

---

### `mercury-commodities` — Energy & Metals

Commodity complex snapshot (CL, GC, SI, NG), with per-instrument deep dive option including AMT structure and vol metrics. Reads commodities in cross-asset context: gold vs dollar and real yields, crude vs equities and demand signals. Checks the calendar for inventory releases and inflation prints.

**Tools:** commodities bundle, symbol detail, AMT snapshot, volatility metrics, correlation matrix, economic events, squawk context · **Trigger:** "commodities", "oil", "gold", "silver", "natural gas", "CL", "GC"

---

### `mercury-news-flow` — News & Squawk Monitoring

Progressive news retrieval workflow. Starts with the latest squawks, curates the most relevant, and asks which theme to explore. Drills from squawks → article bullets → full article text only when requested. Supports topic aggregation across multiple articles and cross-checks news against live price action.

**Tools:** squawks, squawk context, list/get articles, article bullets, article detail, research, aggregate articles · **Trigger:** "news", "headlines", "squawks", "what's in the news", "latest stories", topic-based queries

---

### `mercury-econ-watch` — Economic Event Tracker

Three modes in one skill: **calendar scan** (today or week ahead), **pre-event prep** (positioning + vol context before a release), and **post-release reaction** (actual vs forecast, market response, news confirmation). Includes a quick-reference table mapping countries to their key events and affected instruments.

**Tools:** economic events, market overview, symbol detail, volatility metrics, squawks, squawk context · **Trigger:** "economic calendar", "what's on today", "CPI", "NFP", "FOMC", pre/post release analysis

---

### `mercury-vol-regime` — Volatility & Auction Structure

Volatility regime classification (Compressed, Normal-Rising, Spike-Rising, Choppy/Balance) across all complexes via market texture, with optional per-instrument breakdown: realised vol, HMM regime, ADR (how much daily range is left). Combined with AMT auction structure to contextualise whether a vol spike is inside or outside value. VIX level interpretation included.

**Tools:** volatility metrics, AMT snapshot, market texture, symbol detail, market overview, squawk context · **Trigger:** "volatility", "vol regime", "VIX", "ADR", "quiet market", "Value Area", "auction structure"

---

### `mercury-risk-map` — Cross-Asset Risk & Correlations

Identifies the current macro regime (risk-on, risk-off, inflation, stagflation, liquidity crisis) by reading the full correlation matrix against live price moves. Flags when classic relationships are breaking down (e.g. gold and dollar moving together, bonds not rallying in equity selloff). Confirms regime via vol texture and searches for macro/news catalysts.

**Tools:** correlation matrix, volatility metrics, market overview, market texture, economic events, squawk context · **Trigger:** "correlations", "cross-asset", "risk-on/off", "safe haven", "regime", "what's breaking", portfolio-level questions
