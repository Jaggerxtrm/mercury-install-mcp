---
title: Mercury Tool Reference
description: Source-backed reference for all Mercury MCP tools, parameters, defaults, and guardrails.
nav_order: 4
publish: true
---

# Mercury Tool Reference

This is the public, source-backed MCP tool reference. Tools are grouped by service. Use [[workflows]] for task routing; use this page for exact tool names, parameters, defaults, source descriptions, and guardrails.

> **Tip:** Prefer `format="toon"` for interactive agent sessions unless raw JSON is explicitly needed.

## Source verification

This reference is generated from live Pi MCP metadata and checked against Mercury source definitions. Current live/source counts: Market Data 21, Econ Data 6, Darth Feedor 12, PubFinance 20 — 59 tools total.

## Service map

| Service | What it covers |
|---|---|
| Market Data | Market Data is Mercury’s price, structure, volatility, and cross-asset analysis service. It covers futures outrights, bundles by complex, AMT/Market Profile, volatility/texture, curve and STIR spreads, historical candles, options, correlations, market regime, and sandboxed cross-domain Python analysis. |
| Econ Data | Econ Data is Mercury’s macro calendar and historical economic-data service. It covers scheduled releases with actual/forecast/previous values, BLS/BEA history, catalog discovery, event views, and data-quality diagnostics. |
| Darth Feedor | Darth Feedor is Mercury’s live news, squawk, newsletter, article, graph-search, progressive topic search, archive search, synthesis, and research-doc service. |
| PubFinance | PubFinance is Mercury’s public-finance and liquidity-plumbing service. It covers the Liquidity Composite Index, fiscal flows, Fed liquidity, reference rates, repo/RRP, Treasury operations, primary dealers, settlement fails, TIC, public debt, and data freshness. |

## Market Data tools

Market Data is Mercury’s price, structure, volatility, and cross-asset analysis service. It covers futures outrights, bundles by complex, AMT/Market Profile, volatility/texture, curve and STIR spreads, historical candles, options, correlations, market regime, and sandboxed cross-domain Python analysis.

### Quick selection

- Start broad: `get_regime()`, `get_market_overview()`.
- Drill by complex: `get_equities_bundle()`, `get_treasuries_bundle()`, `get_fx_bundle()`, `get_commodities_bundle()`, `get_stir_bundle()`.
- Deep dive: `get_symbol_detail()`, `get_amt_snapshot()`, `get_market_texture()`, `get_volatility_metrics()`.
- Custom cross-domain analysis: `run_analysis(code)` with final variable `result`.

### Tools

#### `get_market_overview`

**Description**

Get lightweight market overview for all tracked instruments. Covers 17 core instruments (Equity, Treasury, Commodity, FX, STIR) by default. Supports custom lists including Spread IDs (e.g., 'EF-M26', 'TUT').

**When to use it**

Session initialization and quick market scans.

**When not to use it / guardrails**

- For structure-based analysis use get_amt_snapshot().
- For detailed spread analysis use get_stir_snapshot() or get_curve_snapshot().
- For single instrument deep-dive use get_symbol_detail().
- When abs(poc_proximity_pct) > 0.5 or profile_type != 'normal', use get_amt_snapshot() for full auction context.

**Returns**

TOON: market[N]{field1|field2|...}: value1|value2|... Payload: ~1.5KB TOON vs ~3.6KB JSON (58% reduction)

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `symbols` | array[string] or null | optional | Symbol list or filter, for example `["ES=F", "ZN=F"]`. |
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `price_format` | string | `decimal` | Price display style. Use fractional for Treasury futures when the user wants desk-style rates pricing. |
| `return_periods` | array[integer] or null | optional | — |
| `position_periods` | array[integer] or null | optional | — |

#### `get_equities_bundle`

**Description**

Get equities bundle - all major equity index futures. Instruments: ES (S&P 500), NQ (Nasdaq-100), YM (Dow), RTY (Russell 2000).

**When to use it**

Equity market analysis: broad sentiment, index leadership, positioning.

**When not to use it / guardrails**

- For cross-asset overview use get_market_overview().
- For single index deep-dive use get_symbol_detail().

**Instrument coverage**

- - ES=F: S&P 500 E-mini (tick 0.25, most liquid)
- - NQ=F: Nasdaq-100 E-mini (tick 0.25, tech-heavy, higher vol)
- - YM=F: Dow Jones E-mini (tick 1.0, blue-chip, lower vol)
- - RTY=F: Russell 2000 E-mini (tick 0.10, small-cap, highest vol)
- All share 14:30 UTC session start (9:30 AM ET).

**Returns**

TOON structure: equities_bundle: asset_class: equities total: 4 instruments[4]{symbol|last_price|session_state|ret_1d_pct|ret_5d_pct|vol_regime}: ES=F|price|state|ret|ret|regime Payload: ~1-2KB (TOON), ~3-4KB (JSON)

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `price_format` | string | `decimal` | Price display style. Use fractional for Treasury futures when the user wants desk-style rates pricing. |
| `return_periods` | array[integer] or null | optional | — |
| `position_periods` | array[integer] or null | optional | — |

#### `get_treasuries_bundle`

**Description**

Get treasuries bundle - T-Bond futures + yield curve spreads (ICS). Instruments: 6 Treasury futures (ZT, ZF, ZN, TN, ZB, UB) covering 2Y to 30Y. Enrichment: 15 ICS spreads (TUT, NOB, FIX, etc.) with stance analysis.

**When to use it**

Treasury market analysis: interest rate positioning, curve dynamics, bond sentiment. Combines instrument snapshots with 15 ICS spreads for comprehensive context.

**When not to use it / guardrails**

- For curve spreads only use get_curve_snapshot().
- For single Treasury deep-dive use get_symbol_detail().
- For granular stance filtering use get_curve_analysis().

**Instrument coverage**

- - UB=F: Ultra Bond (25+ yr, tick 1/32)
- - ZB=F: 30-Year Bond (tick 1/32)
- - TN=F: Ultra Note 10Y (tick 1/64)
- - ZN=F: 10-Year Note (tick 1/64)
- - ZF=F: 5-Year Note (tick 1/128)
- - ZT=F: 2-Year Note (tick 1/256)
- All session start: 13:00 UTC (8:00 AM ET).

**Returns**

TOON structure: treasuries_bundle: asset_class: treasuries total: 6 instruments[6]{symbol|last_price|session_state|ret_1d_pct|ret_5d_pct|vol_regime}: ZB=F|price|state|ret|ret|regime curve_spreads[15]{spread_id|spread_price|stance|ret_1d|ret_wtd}: TUT|spread|stance|ret|ret Payload: ~4-5KB (TOON), ~9-11KB (JSON). 55% reduction.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `price_format` | string | `decimal` | Price display style. Use fractional for Treasury futures when the user wants desk-style rates pricing. |
| `return_periods` | array[integer] or null | optional | — |
| `position_periods` | array[integer] or null | optional | — |

#### `get_commodities_bundle`

**Description**

Get commodities bundle - energy and precious metals futures. Instruments: CL (Crude Oil), NG (Natural Gas), GC (Gold), SI (Silver).

**When to use it**

Commodity market analysis: inflation signals, safe-haven flows, energy dynamics.

**When not to use it / guardrails**

- For cross-asset overview use get_market_overview().
- For single commodity deep-dive use get_symbol_detail().

**Instrument coverage**

- - CL=F: Crude Oil WTI (tick 0.01, inflation proxy, most liquid energy)
- - NG=F: Natural Gas (tick 0.001, high volatility, seasonal)
- - GC=F: Gold (tick 0.10, safe-haven, inflation hedge)
- - SI=F: Silver (tick 0.005, industrial + precious hybrid)
- All session start: 23:00 UTC (6:00 PM ET).

**Returns**

TOON structure: commodities_bundle: asset_class: commodities total: 4 instruments[4]{symbol|last_price|session_state|ret_1d_pct|ret_5d_pct|vol_regime}: CL=F|price|state|ret|ret|regime Payload: ~1-2KB (TOON), ~3-4KB (JSON).

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `price_format` | string | `decimal` | Price display style. Use fractional for Treasury futures when the user wants desk-style rates pricing. |
| `return_periods` | array[integer] or null | optional | — |
| `position_periods` | array[integer] or null | optional | — |

#### `get_fx_bundle`

**Description**

Get FX bundle - major currency futures vs USD. Instruments: 6E (Euro), 6J (Yen), 6B (Pound), 6S (Swiss Franc).

**When to use it**

Foreign exchange analysis: dollar strength, currency flows, safe-haven FX.

**When not to use it / guardrails**

- For cross-asset overview use get_market_overview().
- For single currency deep-dive use get_symbol_detail().

**Instrument coverage**

- - 6E=F: Euro/USD (tick 0.00005, ECB policy proxy, most liquid FX)
- - 6J=F: Yen/USD (tick 0.0000005, safe-haven, BOJ policy)
- - 6B=F: Pound/USD (tick 0.0001, high-beta risk currency)
- - 6S=F: Swiss Franc/USD (tick 0.0001, ultimate safe-haven)
- All session start: 22:00 UTC (5:00 PM ET).

**Returns**

TOON structure: fx_bundle: asset_class: fx total: 4 instruments[4]{symbol|last_price|session_state|ret_1d_pct|ret_5d_pct|vol_regime}: 6E=F|price|state|ret|ret|regime Payload: ~1-2KB (TOON), ~3-4KB (JSON).

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `price_format` | string | `decimal` | Price display style. Use fractional for Treasury futures when the user wants desk-style rates pricing. |
| `return_periods` | array[integer] or null | optional | — |
| `position_periods` | array[integer] or null | optional | — |

#### `get_stir_bundle`

**Description**

Get STIR bundle via canonical outright snapshots for SOFR futures (SR3, ZQ). Instruments: SR3 quarterly + ZQ monthly SOFR contracts. Enrichment: Implied rates (100 - price) plus return bps kept in enrichment_data. Color Packs: Support filtering by year groups (Whites, Reds, Greens, Blues, Gold).

**When to use it**

Short-term interest rate analysis: Fed policy, rate expectations, term structure. Use color_groups to focus on specific curve segments (e.g., 'whites' for current year).

**When not to use it / guardrails**

- For STIR spreads (calendar/butterfly/EF) use get_stir_snapshot().
- For single SOFR contract use get_symbol_detail().

**Instrument coverage**

- - SR3 Quarterly: 3-Month SOFR (H, M, U, Z cycle). Price = 100 - 3m rate.
- - ZQ Monthly: 1-Month SOFR (all months). Price = 100 - 1m rate.
- Tick size: 0.0025 (0.25 bps). Session start: 23:00 UTC.

**Returns**

TOON structure: stir_bundle: asset_class: stir total: N (outright STIR snapshots) instruments[N]{{symbol|snapshot_ts|last_price|session_state|ret_1d_pct|ret_5d_pct}} stir_rates[N]{{symbol|implied_rate|ret_1d_bps|ret_wtd_bps}} Payload: compact bundle; transport stays separate from market_overview.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `price_format` | string | `decimal` | Price display style. Use fractional for Treasury futures when the user wants desk-style rates pricing. |
| `color_groups` | array[string] or null | optional | — |

#### `get_futures_options`

**Description**

Get current futures options snapshot for a symbol with compact analytics output.

**When to use it**

Use for quick inspection of latest options positioning, aggregate greeks, and change blocks for one futures symbol.

**When not to use it / guardrails**

- Historical report browsing is out of scope here.
- Market price checks (use get_symbol_detail or get_market_overview).

**Returns**

Single options snapshot object or error dict when no data exists.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `symbol` | string | required | Single instrument symbol, for example `ES=F`, `ZN=F`, `CL=F`. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `include_delta` | boolean | `True` | — |
| `include_greeks` | boolean | `True` | — |

#### `get_symbol_detail`

**Description**

Get detailed snapshot for a single symbol - full analytics profile. Includes: returns (1d-60d), session metrics, volatility, path swing analysis. Supports: Outrights (ES=F) and Spreads (TUT, EF-M26).

**When to use it**

Deep-dive on specific instrument with complete analytics context.

**When not to use it / guardrails**

- For multi-instrument scans use get_market_overview().
- For structure analysis use get_amt_snapshot().

**Returns**

TOON structure: symbol_detail: symbol: ES=F last_price: 5750.25 returns{ret_1d_pct|ret_5d_pct|...}: 0.52|2.35|... volatility{vol_regime|vol_rv_annual|...}: low|15.5|... session{...} path{...}

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `symbol` | string | required | Single instrument symbol, for example `ES=F`, `ZN=F`, `CL=F`. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `price_format` | string | `decimal` | Price display style. Use fractional for Treasury futures when the user wants desk-style rates pricing. |

#### `get_volatility_metrics`

**Description**

Get volatility metrics (RV, ADR, HMM regimes) with optional filtering. Purpose: Risk assessment, regime analysis, volatility-based signals.

**When to use it**

Granular volatility metrics: RV, ADR, Garman-Klass, HMM regimes, switch risk.

**When not to use it / guardrails**

- For quick scans with vol_regime only use get_market_overview().
- For structure-based analysis use get_amt_snapshot().

**Returns**

TOON structure: volatility[N]{symbol|vol_rv_annual|vol_regime|vol_switch_risk|...}: ES=F|15.5|low|12.5|... Payload: ~3KB all fields, ~1KB filtered. 60% JSON reduction.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `symbols` | array[string] or null | optional | Symbol list or filter, for example `["ES=F", "ZN=F"]`. |
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `price_format` | string | `decimal` | Price display style. Use fractional for Treasury futures when the user wants desk-style rates pricing. |
| `days` | integer | `1` | Recent lookback window in days. |

#### `get_market_texture`

**Description**

Get Market Texture metrics for a symbol. Market Texture replaces Path Analytics with a lightweight quality score measuring HOW price moved (trending vs rotational vs choppy) rather than WHERE it went. Computed from 5-minute session candles. efficiency_ratio: 0.0 (pure noise) to 1.0 (pure trend). Kaufman ER. rotation_factor: Signed integer. Positive = buyer auction control. Negative = seller control. texture_score: Composite -1.0 (bearish/choppy) to +1.0 (bullish/trending). trend_quality: 'Strong Trend', 'Trend/Rotational', or 'Choppy/Balance'. get_market_texture("ES=F") symbol: ES=F efficiency_ratio: 0.72 rotation_factor: 8 texture_score: 0.61 trend_quality: Strong Trend snapshot_ts: 2026-02-22T14:35:00 get_market_texture("ZN=F") symbol: ZN=F efficiency_ratio: 0.18 rotation_factor: -3 texture_score: -0.21 trend_quality: Choppy/Balance

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `symbol` | string | required | Single instrument symbol, for example `ES=F`, `ZN=F`, `CL=F`. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |

#### `get_correlation_matrix`

**Description**

Get correlation matrix with HMM regime predictions. Multi-timeframe correlation (1h, 8h, 24h) between all tracked instruments.

**When to use it**

Cross-asset relationship analysis: diversification, hedging, regime breakdowns.

**When not to use it / guardrails**

- For single instrument use get_symbol_detail().
- For yield curve spreads use get_curve_analysis().

**Returns**

TOON structure: correlations[N]{symbol1|symbol2|corr_24h|hmm_regime|...}: ES=F|ZN=F|-0.45|mod_negative|...

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `price_format` | string | `decimal` | Price display style. Use fractional for Treasury futures when the user wants desk-style rates pricing. |
| `days` | integer | `1` | Recent lookback window in days. |

#### `get_regime`

**Description**

Current cross-asset macro regime with driver attribution and per-complex sub-regimes. Synthesises equity-bond correlation, curve shape, STIR pricing, vol regime, and AMT profile distribution into a single macro label.

**When to use it**

Call FIRST in any cross-asset or macro analysis session to establish context. Use before get_volatility_metrics, get_curve_analysis, or get_market_overview to interpret individual signals within the macro regime. Regime changes are the most important structural event to track.

**When not to use it / guardrails**

- For single instrument detail use get_symbol_detail().
- For intraday session structure use get_market_texture().

**Returns**

Single snapshot (history=1): { "regime": "risk_off_flight", "confidence": 0.75, "since_date": "2026-03-14", "duration_days": 2, "drivers": ["eq_bond_corr_positive", "curve_bull_flattening", "gold_bid"], "prior_regime": "neutral_drift", "per_complex": { "rates": "bull_flattening", "equities": "distributing", "fx": "dollar_bid", "commodities": "gold_led_bid", "stir": "easing_priced_moderately" }, "model_version": "v1_rules", "snapshot_ts": "2026-03-16T14:30:00Z" } History (history=N): { "snapshots": [...], "count": N }

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `history` | integer | `1` | — |

#### `get_curve_analysis`

**Description**

Get curve analysis with granular filtering by spread_ids or stance. Targeted Treasury curve analysis with precise filtering capabilities.

**When to use it**

Focused curve analysis: specific spreads (TUT, NOB) or stance-based filtering.

**When not to use it / guardrails**

- For complete curve overview use get_curve_snapshot().
- For instruments + spreads use get_treasuries_bundle().

**Returns**

TOON structure: curve_spreads[N]{spread_id|spread_price|stance|ret_1d|...}: TUT|7.39|bear_steepening|-0.13|... Payload: 150 bytes (1 spread) to 2KB (all 15).

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `spread_ids` | array[string] or null | optional | — |
| `stance` | string or null | optional | — |
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `price_format` | string | `decimal` | Price display style. Use fractional for Treasury futures when the user wants desk-style rates pricing. |

#### `get_curve_snapshot`

**Description**

Get curve spread snapshot - all 15 ICS Treasury spreads. Coverage: TUT (2s10s), NOB (10s30s), FIX (5s30s), and 12 more.

**When to use it**

Treasury curve analysis: yield dynamics, stance classification, positioning signals.

**When not to use it / guardrails**

- For specific spreads or stance filtering use get_curve_analysis().
- For instruments + spreads together use get_treasuries_bundle().

**Returns**

TOON structure: curve_spreads[15]{spread_id|spread_price|stance|ret_1d|...}: TUT|7.39|bear_steepening|-0.13|... Payload: ~2KB (TOON), ~4.5KB (JSON). 55% reduction.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `price_format` | string | `decimal` | Price display style. Use fractional for Treasury futures when the user wants desk-style rates pricing. |
| `days` | integer | `1` | Recent lookback window in days. |

#### `get_stir_snapshot`

**Description**

Get STIR spread metrics - SOFR futures calendar, butterfly, and EF (Weighted) spreads. Coverage: ~65 spreads (Calendar, Butterfly, EF) for rate expectations.

**When to use it**

SOFR curve analysis: Fed policy path, rate hike/cut expectations, curve inversion.

**When not to use it / guardrails**

- For outright SR3 implied rates use get_stir_bundle().
- For instruments + spreads use get_stir_bundle().

**Returns**

TOON structure: stir_spreads[60]{spread_id|spread_price|spread_type|ret_1d|...}: SR3_1Q_H26-M26|12.5|calendar|-2.5|... Payload: ~3KB (TOON), ~6.5KB (JSON). 54% reduction.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `spread_type` | string or null | optional | — |
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `price_format` | string | `decimal` | Price display style. Use fractional for Treasury futures when the user wants desk-style rates pricing. |
| `days` | integer | `1` | Recent lookback window in days. |

#### `get_stir_matrix`

**Description**

Get NxN SR3 spread matrix — all contract-vs-contract calendar spreads in one grid. Each cell = Front price - Back price (positive = inversion/front higher).

**When to use it**

Visualizing the full SR3 term structure at once: inversion, shape, steepness across all expiries. Identify which specific contract pairs are driving inversion or steepening.

**When not to use it / guardrails**

- For named calendar/butterfly spreads (1Q, 2Y etc.) use get_stir_snapshot().
- For outright SR3 implied rates use get_stir_bundle().

**Returns**

JSON dict: contracts: sorted list of SR3 contract symbols (chronological) matrix: NxN list-of-lists, matrix[i][j] = contracts[i] price - contracts[j] price timestamp: calculation time Diagonal is always 0. Upper triangle = front spread (positive = inversion).

**Parameters:** none.

#### `get_candles`

**Description**

Fetch OHLCV candles for a symbol. Supports 5-minute and hourly intervals. Returns time-ordered list of open, high, low, close, volume bars.

**When to use it**

Recent intraday bars around a specific event or price level. Default 50 bars (~40 min of 5m).

**When not to use it / guardrails**

- For current price/regime use get_market_overview() or get_symbol_detail().
- For volatility metrics use get_volatility_metrics().

**Returns**

List of dicts: [{timestamp, open, high, low, close, volume}, ...] sorted ascending.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `symbol` | string | required | Single instrument symbol, for example `ES=F`, `ZN=F`, `CL=F`. |
| `interval` | string | `5m` | — |
| `start` | string or null | optional | — |
| `end` | string or null | optional | — |
| `limit` | integer | `50` | Maximum number of rows/items returned. |

#### `get_candles_symbols`

**Description**

Return all symbols available in the candles database. Use this to discover valid symbols before calling get_candles().

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `interval` | string | `5m` | — |

#### `get_amt_snapshot`

**Description**

Get Auction Market Theory (AMT) snapshot - Market Profile analysis. Core: Value Area, POC, Initial Balance. Analysis: TPO, single prints, profile types.

**When to use it**

Structure-based market analysis: key levels, balance/imbalance, auction acceptance.

**When not to use it / guardrails**

- For simple price quotes use get_market_overview().
- For volatility regimes use get_volatility_metrics().

**Returns**

TOON structure: amt_snapshot: symbol: ES=F current_session{poc|va_high|va_low|profile_type|...} historical_sessions[N]{date|poc|va_high|va_low...} patterns{...} Payload: ~2-3KB (TOON), ~6-8KB (JSON).

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `symbol` | string | required | Single instrument symbol, for example `ES=F`, `ZN=F`, `CL=F`. |
| `session` | string | `RTH` | — |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `price_format` | string | `decimal` | Price display style. Use fractional for Treasury futures when the user wants desk-style rates pricing. |
| `days` | integer | `10` | Recent lookback window in days. |
| `date` | string or null | optional | — |

#### `run_analysis`

**Description**

Latest CPI surprise (most recent release)

**When to use it**

Use when the user wants to combine data from multiple Mercury services in a single computation: - Economic release × market reaction studies (CPI/NFP surprise vs ES 30-min return) - BLS time-series trend analysis (CPI trend over N months) - Cross-asset correlation or regime snapshots with computed statistics - Treasury/fiscal data (TGA, RRP, auctions) vs bond market moves - Any ad-hoc Python snippet that queries MercuryClient and returns a result

**Returns**

JSON object: - `result` : the value of the `result` variable after execution (any JSON-serialisable type) - `stdout` : any print() output captured during execution - `error` : null on success, error message string on failure

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `code` | string | required | Python code. For `run_analysis`, the final answer must be assigned to variable `result`. |
| `timeout` | integer | `30` | — |

#### `health_check`

**Description**

Check the health status of the Market Data MCP server. Returns server status and database connectivity. Use this to verify the server is alive before running workflows.

**Parameters:** none.


## Econ Data tools

Econ Data is Mercury’s macro calendar and historical economic-data service. It covers scheduled releases with actual/forecast/previous values, BLS/BEA history, catalog discovery, event views, and data-quality diagnostics.

### Quick selection

- Calendar risk: `get_economic_events()`.
- Historical macro: discover with `list_economic_history_catalog()`, then query `get_economic_history()`.
- Freshness/quality: `get_data_quality()` and `health_check()`.

### Tools

#### `get_economic_events`

**Description**

Fetch economic calendar events with actual, forecast, and previous values. Returns scheduled macro releases (CPI, NFP, GDP, PMI, rate decisions, etc.) including released actuals and consensus forecasts — useful for event-driven analysis, pre-market briefings, and surprise detection.

**Guardrails**

- Country names must be lowercase; wrong case can return no results silently.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `time_range` | string | `today` | — |
| `countries` | array[string] or string | `all` | — |
| `importance` | array[string] or null | optional | — |
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `limit` | integer | `50` | Maximum number of rows/items returned. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |

#### `get_economic_history`

**Description**

Query the economic history time series database (BLS + BEA data). Returns decades of historical macro data — CPI, NFP, GDP, PCE, unemployment, PPI, JOLTS, ECI, productivity and more. Useful for trend analysis, regime identification, and quantitative research.

**Guardrails**

- Use `list_economic_history_catalog` before historical queries when you do not know the canonical indicator name.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `indicator_name` | string or null | optional | — |
| `series_id` | string or null | optional | — |
| `source` | string or null | optional | — |
| `category` | string or null | optional | — |
| `calc_type` | string or null | optional | — |
| `start_date` | string or null | optional | ISO start date for date-range queries. |
| `end_date` | string or null | optional | ISO end date for date-range queries. |
| `date_from` | string or null | optional | — |
| `date_to` | string or null | optional | — |
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `limit` | integer | `200` | Maximum number of rows/items returned. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |

#### `list_economic_history_catalog`

**Description**

Browse available series in the economic history database. Returns metadata for each series — no data values. Use this to discover what indicator_names and series_ids are available before calling get_economic_history.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `source` | string or null | optional | — |
| `category` | string or null | optional | — |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |

#### `get_data_quality`

**Description**

Query automated data quality check results for all economic history series. Quality checks run after each sync cycle (freshness, completeness, outlier, source_agreement). Use status="error" or status="warn" to surface problems.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `status` | string or null | optional | — |
| `source` | string or null | optional | — |
| `check_name` | string or null | optional | — |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |

#### `get_contract_migration_telemetry`

**Description**

Return in-process contract migration counters for shadow rollout monitoring. Counters include legacy/vNext param usage and request/response volumes by surface. Use this during beta to estimate legacy adoption before cutover.

**Parameters:** none.

#### `health_check`

**Description**

Check the health status of the economic-data MCP server. Returns server status, database connectivity, and version info. Use this to verify the server is alive before running workflows.

**Parameters:** none.


## Darth Feedor tools

Darth Feedor is Mercury’s live news, squawk, newsletter, article, graph-search, progressive topic search, archive search, synthesis, and research-doc service.

### Quick selection

- Live tape: `get_squawks()` and `get_squawk_context()`.
- Newsletter discovery: `list_articles()` then `get_article_bullets(ids=[...])`.
- Deep research: `article_graph()`, `progressive_article_search()`, `search_article_bullets()`, `aggregate_articles()`.

### Tools

#### `tool_health_check`

**Description**

Check the health of the MCP server and its database connection.

**Parameters:** none.

#### `get_articles`

**Description**

Get ingested newsletter/media articles.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `source` | string or null | optional | — |
| `has_summary` | boolean or null | optional | — |
| `date_from` | string or null | optional | — |
| `date_to` | string or null | optional | — |
| `limit` | integer | `50` | Maximum number of rows/items returned. |
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `timezone` | string or null | optional | IANA timezone for timestamp conversion, for example `Europe/Warsaw`. |

#### `list_articles`

**Description**

Discover articles via lightweight stubs (phase 1 of two-phase retrieval). Returns id, title, source, published_at, category, thesis, bullets, tags — never the full summary text. Use get_article_bullets or get_article_detail for deeper reads on selected IDs. When N > 20 a warning is prepended suggesting aggregate_articles instead. ⚠ When query= is used, results are ordered by SIMILARITY not recency. Old articles may surface. A staleness warning is prepended automatically if any result is older than 7 days — do not ignore it.

**Guardrails**

- When `query` is used, results are similarity/relevance-ranked, not recency-ranked. Inspect `published_at`.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `since_days` | integer | `2` | — |
| `date_from` | string or null | optional | — |
| `date_to` | string or null | optional | — |
| `category` | string or null | optional | — |
| `source` | string or null | optional | — |
| `limit` | integer | `20` | Maximum number of rows/items returned. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `timezone` | string or null | optional | IANA timezone for timestamp conversion, for example `Europe/Warsaw`. |
| `query` | string or null | optional | Text query. For article search, inspect dates because relevance-ranked results may be old. |
| `tags` | array[string] or null | optional | — |
| `tag_match` | string | `any` | — |

#### `search_article_bullets`

**Description**

Full-text search inside article bullet-points (phase 1 alternative). ⚠ NOT FOR CURRENT CONTEXT — results are ranked by FTS relevance, not recency. Old articles will surface if they match the query. Always check published_at. Use list_articles (no query=) for recent-first results. Searches the LLM-generated bullet arrays via tsvector FTS. Use for concept research across the archive, not live market monitoring. Returns stub shape: id, title, source, published_at, category, thesis, bullets, tags. Use get_article_bullets for cross-article fetching by ID.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `query` | string | required | Text query. For article search, inspect dates because relevance-ranked results may be old. |
| `limit` | integer | `10` | Maximum number of rows/items returned. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `timezone` | string or null | optional | IANA timezone for timestamp conversion, for example `Europe/Warsaw`. |

#### `get_article_bullets`

**Description**

Get enriched phase-2 snapshots for selected article IDs. Unlike list_articles stubs, this returns additional analytical fields (`sentiment`, `mechanisms`, `relevance_score`) while still avoiding the full summary blob. Use this after selecting candidate IDs from list_articles.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `ids` | array[integer] | required | List of selected article IDs. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |

#### `get_article_detail`

**Description**

Get the full LLM summary for one article (deep-dive, phase 3). Returns the complete summary JSONB: thesis, bullets, category, sentiment, mechanisms, tags, relevance_score. Use only when bullet points are insufficient and a full analytical read is needed.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `article_id` | integer | required | — |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `timezone` | string or null | optional | IANA timezone for timestamp conversion, for example `Europe/Warsaw`. |

#### `aggregate_articles`

**Description**

Aggregate many articles into a concise LLM briefing (sub-agent synthesis). Use when list_articles warns of a large result set and a panoramic summary is more useful than reading individual articles. Calls qwen-service internally.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `since_days` | integer | `2` | — |
| `date_from` | string or null | optional | — |
| `date_to` | string or null | optional | — |
| `category` | string or null | optional | — |
| `source` | string or null | optional | — |
| `tags` | array[string] or null | optional | — |
| `tag_match` | string | `any` | — |
| `limit` | integer | `50` | Maximum number of rows/items returned. |

#### `article_graph`

**Description**

Find articles related to a given article by shared tags. Use after list_articles to expand context: pick a relevant article ID, then call article_graph to discover thematically connected articles without an additional search query. Each hop follows tag edges in the graph — no vector DB, no embedding calls. Token cost: one DB round-trip per hop. Results are re-ranked with MMR to reduce near-duplicates from the same newsletter edition. Lower mmr_lambda = more diversity, higher = more relevance.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `article_id` | integer | required | — |
| `limit` | integer | `10` | Maximum number of rows/items returned. |
| `min_shared_tags` | integer | `1` | — |
| `mmr_lambda` | number | `0.7` | — |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `timezone` | string or null | optional | IANA timezone for timestamp conversion, for example `Europe/Warsaw`. |

#### `progressive_article_search`

**Description**

Progressive multi-hop article retrieval. Starts with a seed query, then expands via tag-based graph traversal. Simulates expert research: start with obvious matches, then follow the threads. Algorithm: 1. Seed: Find 1-2 articles matching the query 2. Expand: Use article_graph to find related articles via shared tags 3. Repeat up to max_depth or until no new tags discovered 4. Return ranked, deduplicated results Use this when you need comprehensive context on a topic, not just recent articles.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `seed_query` | string | required | — |
| `max_depth` | integer | `2` | — |
| `max_articles` | integer | `10` | — |
| `token_budget` | integer | `8000` | — |
| `since_days` | integer | `7` | — |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `timezone` | string or null | optional | IANA timezone for timestamp conversion, for example `Europe/Warsaw`. |

#### `get_squawks`

**Description**

Get raw squawks from Telegram/Discord.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `hours_back` | integer | `6` | — |
| `source` | string or null | optional | — |
| `limit` | integer | `100` | Maximum number of rows/items returned. |
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `timezone` | string or null | optional | IANA timezone for timestamp conversion, for example `Europe/Warsaw`. |

#### `get_squawk_context`

**Description**

Get AI-processed rolling squawk context with optional field-level filtering.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `mode` | string | `latest` | — |
| `view` | string | `dashboard` | — |
| `limit` | integer | `5` | Maximum number of rows/items returned. |
| `session_date` | string or null | optional | — |
| `date_from` | string or null | optional | — |
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `timezone` | string or null | optional | IANA timezone for timestamp conversion, for example `Europe/Warsaw`. |

#### `get_research`

**Description**

Get financial research documents (PDF-sourced).

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `publisher` | string or null | optional | — |
| `tag` | string or null | optional | — |
| `has_summary` | boolean or null | optional | — |
| `date_from` | string or null | optional | — |
| `limit` | integer | `20` | Maximum number of rows/items returned. |
| `fields` | array[string] or null | optional | Optional field list to reduce payload size. |
| `format` | string | `toon` | Output format. `toon` is compact and preferred for chat workflows; use `json` only when needed. |
| `timezone` | string or null | optional | IANA timezone for timestamp conversion, for example `Europe/Warsaw`. |


## PubFinance tools

PubFinance is Mercury’s public-finance and liquidity-plumbing service. It covers the Liquidity Composite Index, fiscal flows, Fed liquidity, reference rates, repo/RRP, Treasury operations, primary dealers, settlement fails, TIC, public debt, and data freshness.

### Quick selection

- Aggregate liquidity: `get_lci_summary()` or `get_market_snapshot()`.
- Fiscal pillar: `get_fiscal_daily()`, `get_fiscal_weekly()`.
- Monetary pillar: `get_fed_liquidity_summary()`, `get_reference_rates()`.
- Plumbing pillar: `get_repo_operations()`, `get_rrp_operations()`, `get_primary_dealers()`, `get_settlement_fails()`.
- Freshness: `get_data_freshness()`.

### Tools

#### `get_lci`

**Description**

Get Liquidity Composite Index (LCI) history. The LCI combines three pillars of market liquidity: - Fiscal Index (40%): Government spending impact - Monetary Index (35%): Fed balance sheet and rates - Plumbing Index (25%): Repo and settlement conditions Interpretation: - LCI > +1.5: Very Loose (abundant liquidity) - LCI +0.5 to +1.5: Loose (above-average) - LCI -0.5 to +0.5: Neutral - LCI -1.5 to -0.5: Tight (below-average) - LCI < -1.5: Very Tight (scarce liquidity)

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `days` | integer | `30` | Number of recent records to retrieve (default: 30, max: 365). Ignored when start_date/end_date provided. |
| `fields` | array[string] or null | optional | Optional list of fields (default: all) |
| `format` | string | `toon` | Output format - "toon" (default, token-efficient) or "json" |
| `start_date` | string or null | optional | Optional start date ISO 8601 (e.g. "2026-01-01"). When provided, uses date-range query. |
| `end_date` | string or null | optional | Optional end date ISO 8601 (e.g. "2026-01-31"). Defaults to today when start_date given. |

#### `get_lci_latest`

**Description**

Get the latest LCI reading. Returns a single LCI record with the most recent data. Use get_lci_summary for interpretation and percentile ranking.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `fields` | array[string] or null | optional | Optional list of fields to include |
| `format` | string | `toon` | Output format - "toon" (default) or "json" |

#### `get_lci_summary`

**Description**

Get LCI summary with regime interpretation and percentile ranking.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `format` | string | `toon` | Output format - "toon" (default) or "json" |

#### `get_fed_liquidity`

**Description**

Get Federal Reserve liquidity data. Includes: - Fed Total Assets, Treasury Holdings, MBS Holdings - RRP Balance, TGA Balance - Net Liquidity (Fed Assets - RRP - TGA) - Interest rates (SOFR, EFFR, IORB) - Yield curve (2Y, 10Y, 30Y) - Credit spreads, VIX

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `days` | integer | `30` | Number of recent records to retrieve (default: 30, max: 365). Ignored when start_date/end_date provided. |
| `fields` | array[string] or null | optional | Optional list of fields |
| `format` | string | `toon` | Output format - "toon" (default) or "json" |
| `start_date` | string or null | optional | Optional start date ISO 8601 (e.g. "2026-01-01"). |
| `end_date` | string or null | optional | Optional end date ISO 8601 (e.g. "2026-01-31"). |

#### `get_fed_liquidity_latest`

**Description**

Get the latest Fed liquidity data. Returns the most recent daily record with all Fed balance sheet metrics.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `fields` | array[string] or null | optional | Optional list of fields to include |
| `format` | string | `toon` | Output format - "toon" (default) or "json" |

#### `get_fed_liquidity_summary`

**Description**

Get Fed liquidity summary with 1-week and 1-month changes.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `format` | string | `toon` | Output format - "toon" (default) or "json" |

#### `get_fiscal_daily`

**Description**

Get daily fiscal metrics. Includes: - Net Impulse (spending - taxes) - MPC-weighted spending (household impact) - TGA balance - Fiscal pressure/acceleration indices - GDP % calculations

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `days` | integer | `30` | Number of recent records to retrieve (default: 30, max: 365). Ignored when start_date/end_date provided. |
| `fields` | array[string] or null | optional | Optional list of fields |
| `format` | string | `toon` | Output format - "toon" (default) or "json" |
| `start_date` | string or null | optional | Optional start date ISO 8601 (e.g. "2026-01-01"). |
| `end_date` | string or null | optional | Optional end date ISO 8601 (e.g. "2026-01-31"). |

#### `get_fiscal_daily_latest`

**Description**

Get the latest daily fiscal metrics.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `fields` | array[string] or null | optional | Optional list of fields |
| `format` | string | `toon` | Output format - "toon" (default) or "json" |

#### `get_fiscal_weekly`

**Description**

Get weekly fiscal metrics. Aggregated weekly data with: - Total spending and taxes - Net impulse - YoY comparisons - Seasonal baselines

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `weeks` | integer | `12` | Number of recent weeks to retrieve (default: 12, max: 52). Ignored when start_date/end_date provided. |
| `format` | string | `toon` | Output format - "toon" (default) or "json" |
| `start_date` | string or null | optional | Optional start date ISO 8601 (e.g. "2026-01-01"). |
| `end_date` | string or null | optional | Optional end date ISO 8601 (e.g. "2026-03-31"). |

#### `get_repo_operations`

**Description**

Get NY Fed Repo Operations. These are Fed operations to inject liquidity. Shows operation amounts, rates, and terms.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `days` | integer | `30` | Number of recent records to retrieve (default: 30, max: 365). Ignored when start_date/end_date provided. |
| `fields` | array[string] or null | optional | Optional list of fields (default: all) |
| `format` | string | `toon` | Output format - "toon" (default) or "json" |
| `start_date` | string or null | optional | Optional start date ISO 8601 (e.g. "2026-01-01"). |
| `end_date` | string or null | optional | Optional end date ISO 8601 (e.g. "2026-01-31"). |

#### `get_rrp_operations`

**Description**

Get NY Fed Reverse Repo (RRP) Operations. These are Fed operations to drain liquidity. Money market funds park cash at the Fed via RRP.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `days` | integer | `30` | Number of recent records to retrieve (default: 30, max: 365). Ignored when start_date/end_date provided. |
| `fields` | array[string] or null | optional | Optional list of fields (default: all) |
| `format` | string | `toon` | Output format - "toon" (default) or "json" |
| `start_date` | string or null | optional | Optional start date ISO 8601 (e.g. "2026-01-01"). |
| `end_date` | string or null | optional | Optional end date ISO 8601 (e.g. "2026-01-31"). |

#### `get_reference_rates`

**Description**

Get money market reference rates. Includes: - SOFR (Secured Overnight Financing Rate) - EFFR (Effective Federal Funds Rate) - BGCR (Broad General Collateral Rate) - TGCR (Tri-Party General Collateral Rate) - OBFR (Overnight Bank Funding Rate)

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `days` | integer | `30` | Number of recent records to retrieve (default: 30, max: 365). Ignored when start_date/end_date provided. |
| `fields` | array[string] or null | optional | Optional list of fields (default: all) |
| `format` | string | `toon` | Output format - "toon" (default) or "json" |
| `start_date` | string or null | optional | Optional start date ISO 8601 (e.g. "2026-01-01"). |
| `end_date` | string or null | optional | Optional end date ISO 8601 (e.g. "2026-01-31"). |

#### `get_reference_rates_latest`

**Description**

Get the latest money market reference rates.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `format` | string | `toon` | Output format - "toon" (default) or "json" |

#### `get_primary_dealers`

**Description**

Get Primary Dealer positions. Shows dealer positioning in: - Treasuries, MBS, Corporate, Agency - Repo and Reverse Repo activity - Positioning z-scores (deviation from normal) High positive z-scores indicate crowded long positions.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `weeks` | integer | `12` | Number of recent weeks to retrieve (default: 12, max: 52). Ignored when start_date/end_date provided. |
| `format` | string | `toon` | Output format - "toon" (default) or "json" |
| `start_date` | string or null | optional | Optional start date ISO 8601 (e.g. "2026-01-01"). |
| `end_date` | string or null | optional | Optional end date ISO 8601 (e.g. "2026-03-31"). |

#### `get_settlement_fails`

**Description**

Get Treasury settlement fails data. High settlement fails indicate: - Collateral scarcity - Market stress - Potential liquidity issues Includes fails by Treasury maturity and z-scores.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `weeks` | integer | `12` | Number of recent weeks to retrieve (default: 12, max: 52). Ignored when start_date/end_date provided. |
| `format` | string | `toon` | Output format - "toon" (default) or "json" |
| `start_date` | string or null | optional | Optional start date ISO 8601 (e.g. "2026-01-01"). |
| `end_date` | string or null | optional | Optional end date ISO 8601 (e.g. "2026-03-31"). |

#### `get_tic_flows`

**Description**

Get Treasury International Capital (TIC) flows. Shows foreign demand for US securities: - Total foreign inflows - Private vs official (central bank) inflows - 3-month and 12-month moving averages Negative flows indicate foreign selling of US assets.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `months` | integer | `12` | Number of recent months to retrieve (default: 12, max: 36). Ignored when start_date/end_date provided. |
| `format` | string | `toon` | Output format - "toon" (default) or "json" |
| `start_date` | string or null | optional | Optional start date ISO 8601 (e.g. "2025-01-01"). |
| `end_date` | string or null | optional | Optional end date ISO 8601 (e.g. "2025-12-31"). |

#### `get_debt_latest`

**Description**

Get Debt to the Penny (total public debt outstanding). Shows: - Total public debt - Debt held by public - Intragovernmental holdings

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `format` | string | `toon` | Output format - "toon" (default) or "json" |

#### `get_market_snapshot`

**Description**

Get comprehensive market snapshot. Returns a bundle with: - LCI summary (regime, interpretation) - Fed liquidity summary (balance sheet, changes) - Latest fiscal daily metrics - Reference rates Use this for a quick overview of current conditions.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `format` | string | `toon` | Output format - "toon" (default) or "json" |

#### `get_data_freshness`

**Description**

Get data freshness status. Shows when each data source was last updated. Use to check if data is current or stale.

**Parameters**

| Parameter | Type | Default | Notes |
|---|---|---:|---|
| `format` | string | `toon` | Output format - "toon" (default) or "json" |

#### `health_check`

**Description**

Check the health status of the PubFinance MCP server. Returns server status and database connectivity. Use this to verify the server is alive before running workflows.

**Parameters:** none.

_Last verified against live MCP metadata: 2026-05-05._
