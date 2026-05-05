---
title: Mercury Quickstart
description: Install Mercury and start a session with /using-mercury.
nav_order: 2
publish: true
---

# Quickstart

Use this page to understand Mercury, install it, and start the first session. Skills are invoked as slash commands; the canonical entry point is `/using-mercury`.

## What is Mercury?

Mercury is a market-intelligence layer for Claude. It connects live MCP servers so Claude can pull market, macro, liquidity, and news/research data while answering a user’s question.

Most market assistants fail in one of two ways: they either answer from stale prior knowledge, or they dump raw tool output without forming a view. Mercury is designed around a different pattern: fetch the right layer of live data, interpret it in market structure terms, and decide what additional layer is worth pulling.

### The four data domains

| Domain | MCP server | What it covers |
|---|---|---|
| Market Data | `mercury-market-data` | Cross-asset futures snapshots, bundles, AMT, volatility, market texture, curve/STIR spreads, candles, futures options, correlations, and sandboxed cross-domain Python analysis. |
| Econ Data | `mercury-econ-data` | Calendar events with actual/forecast/previous values, BLS/BEA history, economic-history catalog, and data-quality diagnostics. |
| Darth Feedor | `mercury-darth-feedor` | Live squawks, rolling topic context, newsletter/media articles, article bullets, full article detail, article graph, progressive search, archive search, aggregation, and research docs. |
| PubFinance | `mercury-pubfinance` | Liquidity Composite Index, fiscal daily/weekly flows, Fed balance sheet/liquidity, reference rates, repo/RRP, Treasury operations, dealers, fails, TIC, debt, and freshness. |

### How Mercury analysis should feel

A strong Mercury answer is not a list of tool calls. It reads like a desk note:

1. **Headline** — what matters right now.
2. **Evidence** — the fresh tool outputs that support the claim.
3. **Structure** — whether price/auction/vol confirms or contradicts the headline.
4. **Liquidity and macro context** — whether the background impulse supports the move.
5. **Narrative** — whether live tape or newsletter research explains the catalyst.
6. **Next layer** — the one additional check that would improve confidence.

### Skill invocation

Skills are invoked as slash commands. Start a session with:

```text
/using-mercury
```

Then ask your market question, or include the intent in the same command:

```text
/using-mercury morning brief
/using-mercury deep dive ZN
/using-mercury what are newsletters saying about Treasury refunding?
```

### What Mercury is not

- It is not a substitute for your own trading judgment.
- It is not guaranteed to have every data source updated at the same cadence.
- It should not treat newsletter archive results as current news without checking dates.
- It should not expose or print API keys.

### Next

Continue below with the Claude Desktop or Claude Code install flow, then run the first-session examples.

## Install on Claude Desktop

Use the Claude Desktop extension when you want the simplest install path. The extension packages Mercury MCP access for a non-technical user: install, enter the API key, restart Claude Desktop, and invoke `/using-mercury`.

### Before you begin

- Install the latest Claude Desktop.
- Have your Mercury API key ready.
- Do not paste the API key into chat or documentation.

### Steps

1. Download `mercury-platform.mcpb` from the Mercury installer package.
2. Drag the file into the Claude Desktop window.
3. Claude Desktop opens the extension install dialog.
4. Enter your Mercury API key when prompted.
5. Confirm the install.
6. Restart Claude Desktop.

### Result

Claude Desktop gets one Mercury Platform extension that aggregates the four Mercury MCP domains:

- Market Data
- Econ Data
- Darth Feedor
- PubFinance

### Skills

For Desktop, ship `using-mercury` as the single canonical skill. Users invoke it as:

```text
/using-mercury
```

Specialized workflow skills can remain useful for Claude Code users, but Desktop documentation should teach the single `/using-mercury` entry point.

### Verify

Start a new Claude Desktop chat and ask:

```text
/using-mercury what Mercury workflows are available?
```

A healthy setup should describe market data, econ data, news/research, and PubFinance capabilities.

### Related

- [[quickstart#Run your first session|Run your first session]]
- [[troubleshooting|Claude Desktop extension]]
- [[troubleshooting|API key issues]]

## Install on Claude Code

Use the CLI installer if you run Claude Code in a terminal. Claude Code users can install the same Mercury MCP servers and optionally keep specialized workflow skills as shortcuts.

### Before you begin

- Node.js 18 or newer.
- Claude Code CLI installed.
- Mercury API key.

### Install

```bash
npx github:Jaggerxtrm/terminalbeta
```

The installer will:

1. Show the available Mercury servers.
2. Ask which servers to install.
3. Ask for user or project scope.
4. Prompt for your Mercury API key.
5. Run `claude mcp add` with the correct HTTP endpoints and `X-API-Key` header.

### Verify

```bash
claude mcp list
```

You should see:

- `mercury-market-data`
- `mercury-darth-feedor`
- `mercury-econ-data`
- `mercury-pubfinance`

### Skills

Start with the canonical skill:

```text
/using-mercury
```

Specialized `mercury-*` skills are workflow shortcuts for Claude Code. They should not replace the public Desktop guidance; `/using-mercury` remains the universal entry point.

### Related

- [[quickstart#Run your first session|Run your first session]]
- [[troubleshooting|MCP connection issues]]
- [[troubleshooting|API key issues]]


## Skills and workflow shortcuts

For public/Desktop documentation, teach a single entry point:

```text
/using-mercury
```

`/using-mercury` routes the main workflows: Morning Brief, Market Scan, Instrument Deep Dive, Rates & STIR, PubFinance/Liquidity Plumbing, Live News, Newsletter Research, and cross-domain `run_analysis`.

Claude Code users may also keep specialized `mercury-*` shortcuts. They are useful for trigger routing and as source material for workflow pages, but they are not required for Desktop users:

| Shortcut | When it applies |
|---|---|
| `mercury-morning-brief` | Full morning setup across calendar, regime, markets, liquidity, and news. |
| `mercury-market-scan` | Broad live market scan and regime context. |
| `mercury-deep-dive` | Single instrument price/AMT/vol/news analysis. |
| `mercury-yield-curve` | Treasury curve, STIR, Fed pricing, and fixed-income futures. |
| `mercury-news-flow` | Squawks, newsletters, article graph, archive search, and research synthesis. |
| `mercury-econ-watch` | Economic calendar, release monitoring, and event reaction analysis. |
| `mercury-vol-regime` | Volatility regime and auction-market structure. |
| `mercury-risk-map` | Correlations, cross-asset relationships, and risk concentration. |
| `mercury-fx` | FX futures and dollar/currency analysis. |
| `mercury-commodities` | Energy, metals, and commodity complex analysis. |

## Run your first session

Start a Mercury session by invoking the skill as a slash command. The slash command matters: write `/using-mercury`, not a natural-language request to load the skill.

### Before you begin

- Mercury MCP servers are installed and visible in your Claude client.
- Your Mercury API key is configured.
- The `using-mercury` skill is installed.

### Start prompt

```text
/using-mercury
```

Claude should orient to the Mercury workflow router and ask what you want to do next.

You can also invoke the skill and task together:

```text
/using-mercury give me a morning brief
/using-mercury deep dive ZN
/using-mercury what are newsletters saying about Treasury refunding?
```

### Recommended first workflows

| Goal | Prompt |
|---|---|
| Daily setup | `/using-mercury morning brief` |
| Fast market read | `/using-mercury what is moving across equities, rates, FX, and commodities?` |
| Single instrument | `/using-mercury deep dive ZN` |
| Rates/Fed | `/using-mercury what is the curve and STIR market pricing?` |
| Liquidity | `/using-mercury what is liquidity doing today?` |
| Newsletters | `/using-mercury what are newsletters saying about Treasury refunding?` |

### What good output looks like

Good Mercury output is layered and selective. It should usually include:

- A one-paragraph desk summary.
- A short “evidence” section with fresh tool outputs.
- A “what changed” or “why it matters” section.
- A caveat if the result depends on stale, missing, or archive-ranked data.
- A suggested next layer only when it would materially improve the read.

It should not dump every returned field or open every article in full detail.

### If the first response is too generic

Ask it to pull the specific layer:

```text
Pull live market data first, then add liquidity context.
```

or:

```text
Use Darth Feedor article stubs first, then enrich only the top three IDs.
```

### Related

- [[workflows|Morning brief]]
- [[workflows|Instrument deep dive]]
- [[workflows|Newsletter and research workflow]]
