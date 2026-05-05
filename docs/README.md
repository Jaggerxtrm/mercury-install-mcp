---
title: Mercury Docs
description: Mercury documentation landing page and navigation map.
nav_order: 1
publish: true
---

# Mercury Docs

Mercury connects Claude to institutional market data, economic calendars, public-finance liquidity data, and news/newsletter intelligence through MCP.

These docs are intentionally compact: fewer pages, more substance per page. Start with setup, then use the workflow guide when you know the market question, the tool reference when you need exact tool names/parameters, and the concepts guide when you need to interpret returned market structure.

## Documentation map

| Page | Use it for |
|---|---|
| [[quickstart|Quickstart]] | What Mercury is, how to install it, and how to invoke `/using-mercury`. |
| [[workflows|Workflows]] | Morning brief, market scan, instrument deep dive, rates/STIR, liquidity, newsletter research. |
| [[tool-reference|Tool reference]] | All MCP tools grouped by service, with source-backed descriptions, parameters, defaults, and guardrails. |
| [[concepts|Concepts]] | AMT, volatility regime, LCI/liquidity pillars, curve/STIR, newsletter retrieval model. |
| [[troubleshooting|Troubleshooting]] | MCP connection, API key, Desktop extension, stale/missing data. |

## Recommended first command

```text
/using-mercury
```

You can include the task in the same invocation:

```text
/using-mercury morning brief
/using-mercury deep dive ZN
/using-mercury what are newsletters saying about Treasury refunding?
```

## What Mercury is best at

Mercury is strongest when the answer needs more than one layer of market context:

1. **Regime** — what macro/market state are we in?
2. **Price** — what is actually moving?
3. **Structure** — is the auction accepting or rejecting the move?
4. **Volatility** — is the move orderly, compressed, or expanding?
5. **Liquidity** — are fiscal/Fed/plumbing conditions supportive or restrictive?
6. **Narrative** — does live news or newsletter research explain the move?


_Last verified against live MCP metadata: 2026-05-05._
