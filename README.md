# Mercury MCP Installer

Installs all [Mercury Platform](https://mercuryintelligence.net) MCP servers into Claude Desktop or Claude Code.

---

## Windows — Claude Desktop (no developer tools required)

If you just want to use Mercury in Claude Desktop, you don't need Node.js or a terminal.

**1. Download the extension**

> [**Download mercury-platform.mcpb**](https://github.com/Jaggerxtrm/terminalbeta/raw/main/ext/mercury-platform/mercury-platform.mcpb)

**2. Install**

Double-click the downloaded file. Claude Desktop opens an install dialog.

**3. Enter your Mercury API Key**

Paste your key when prompted. It is stored securely in the Windows keychain — you only enter it once.

**4. Done**

All four Mercury servers are now available in Claude Desktop. No terminal, no configuration files.

> **Requires:** [Claude Desktop](https://claude.ai/download) (latest version)

---

## Claude Code — All platforms

If you use Claude Code (the CLI), run the interactive installer:

```bash
npx github:Jaggerxtrm/terminalbeta
```

On **Windows**, the installer will ask whether you want the Desktop Extension or Claude Code — choose whichever you need.

**Requires:** [Node.js ≥ 18](https://nodejs.org) and the [Claude Code CLI](https://claude.ai/code)

**What it does:**

1. Lists available servers with descriptions
2. Prompts which to install (`1 3`, `all`, etc.)
3. Prompts for install scope — **user** (`~/.claude.json`) or **project** (`.mcp.json`)
4. Detects already-installed servers, offers to reinstall or skip
5. Prompts for your Mercury API Key (hidden input)
6. Runs `claude mcp add` for each selected server

---

## What gets installed

| Server | Label | Description |
|--------|-------|-------------|
| `mercury-market-data` | Market Intelligence | Futures prices, AMT profiles, volatility metrics, yield curve spreads |
| `mercury-darth-feedor` | Darth Feedor | Financial articles, squawk context, and research — progressive retrieval, filtered views |
| `mercury-econ-data` | Economic Calendar | Macro events, economic releases, central bank decisions |
| `mercury-pubfinance` | Public Finance | Fed reference rates (SOFR, EFFR, OBFR), repo/RRP operations, Treasury auctions, TGA, primary dealers, fiscal flows |

All servers connect to `mcp.mercuryintelligence.net` and require a **Mercury API Key**.

---

## Adding a new server

Edit `servers.json` — no code changes needed:

```json
{
  "name": "mercury-<service>",
  "label": "Human Label",
  "description": "One-line description",
  "url": "https://mcp.mercuryintelligence.net/<path>/mcp",
  "transport": "http"
}
```

Then rebuild the Desktop Extension:

```bash
cd ext/mercury-platform
npm install
npx @anthropic-ai/mcpb pack
```

Push to `main` — the updated `.mcpb` and CLI installer are immediately available to all users.

---

## Architecture

```
terminalbeta/
├── index.js                              # CLI installer (Node built-ins only)
├── servers.json                          # MCP server registry
├── package.json
└── ext/
    └── mercury-platform/
        ├── manifest.json                 # Extension metadata and user_config
        ├── server/index.mjs              # Proxy: aggregates all 4 HTTP endpoints over stdio
        ├── package.json
        ├── node_modules/                 # Bundled MCP SDK — no install step for end users
        └── mercury-platform.mcpb         # Built extension — commit this
```

The Desktop Extension bundles the MCP SDK and a small proxy server that connects to all four Mercury HTTP endpoints and exposes them as a single stdio MCP server. Claude Desktop ships Node.js, so no runtime install is needed.

---

## Pinning a version

```bash
npx github:Jaggerxtrm/terminalbeta#v1.0.0
```

---

## Agent Skills

Once the MCPs are installed, a set of Claude Code skills is available to get the most out of the platform. Skills are interactive workflows that guide the agent step-by-step, fetching live data at each stage rather than producing a single large text dump.

> **All skills treat market data as live and time-sensitive. They always fetch fresh data rather than relying on anything stated earlier in the conversation.**

### Installing the skills

The skills live in the `.claude/skills/` directory of this repo. **Beta testing is designed to be done from within this repo** — clone it, open Claude Code here, and the skills are immediately available:

```bash
git clone https://github.com/Jaggerxtrm/terminalbeta.git
cd terminalbeta
claude  # open Claude Code in the repo
```

To make the skills available globally across all Claude Code sessions:

```bash
cp -r .claude/skills/* ~/.claude/skills/
```

### `using-mercury` — Session Onboarding + Workflow Hub *(load at session start)*

Maps all four MCPs and their tools, explains when to use each, and includes an internal workflow router for Morning Brief, Market Scan, Instrument Deep Dive, Rates/STIR, PubFinance, News/Newsletter Research, and cross-domain `run_analysis` work. This is the canonical skill to ship in minimal environments such as Claude Desktop.

The packaged `using-mercury.skill` also includes reference files:

- `references/advanced-workflows.md`
- `references/newsletter-research-workflows.md`
- `references/tool-selection-cheatsheet.md`

**Tools:** all Mercury MCPs · **Trigger:** session start, "what can you do", "what tools do you have"

---

> **Packaging note:** The specialized `mercury-*` skills below are useful Claude Code trigger shortcuts. They are not required for Claude Desktop if `using-mercury` is installed, because the same workflows are now available inside `using-mercury` and its references.

### `mercury-morning-brief` — Daily Setup

Full pre-session workflow combining all four MCPs in sequence: today's high-importance economic events, a live market snapshot across all four complexes (equities, rates, commodities, FX), market texture/regime context, and the latest squawk headlines. Presents each layer concisely and asks where to focus before going deeper.

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
