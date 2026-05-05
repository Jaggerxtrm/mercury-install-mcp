# Mercury Advanced Workflows

These workflows are intended for environments that ship only `using-mercury` rather than every specialized skill. Use them as modes, not rigid templates: fetch the first layer, state the key tension, then let the user steer depth.

## 1. Morning Brief

Purpose: give a fast but institutionally useful daily setup.

Sequence:
1. `get_economic_events(time_range="today", importance=["high"])` — calendar risk first.
2. `get_regime()` — macro label, confidence, drivers, per-complex regimes.
3. `get_market_overview()` — cross-asset snapshot.
4. `get_market_snapshot()` or `get_lci_summary()` — liquidity/plumbing frame.
5. `get_squawks(limit=15)` and optionally `get_squawk_context(view="dashboard")` — fresh tape.

Output: 3–5 paragraphs, no giant table. Lead with the highest-impact tension: data risk, regime contradiction, liquidity impulse, or obvious outlier.

## 2. Instrument Deep Dive

Purpose: answer “what is ES/ZN/CL/GC doing?” with structure, not just price.

Sequence:
1. Normalize the symbol (`gold` → `GC=F`, `crude` → `CL=F`, `10y` → `ZN=F`).
2. `get_symbol_detail(symbol)` — price, returns, range, session state.
3. `get_amt_snapshot(symbol)` — POC, value area, day/profile type, single prints, tails.
4. `get_market_texture(symbol)` — trend quality vs chop/balance.
5. `get_volatility_metrics(symbols=[symbol])` — vol regime, RV, ADR, switch risk.
6. `get_futures_options(symbol)` — use when event risk, vol regime, or positioning matters.
7. `get_squawk_context(view="topics")` / article tools — only if the move needs narrative context.

Output frame: **price**, **auction**, **vol/texture**, **catalyst**, **bottom line**.

## 3. Rates and STIR

Purpose: connect curve, front-end pricing, and macro/liquidity catalysts.

Sequence:
1. `get_curve_snapshot()` — full ICS curve map.
2. `get_curve_analysis(spread_ids=["TUT", "NOB", "FIX"])` or `stance=...` — targeted curve view.
3. `get_treasuries_bundle(price_format="fractional")` — futures complex + curve enrichment.
4. `get_stir_snapshot()` or `get_stir_matrix()` — SOFR calendars/butterflies/EF spreads.
5. `get_economic_events()` — releases and central-bank events.
6. `get_fed_liquidity_summary()` / `get_lci_summary()` — liquidity backdrop.

Output: describe whether the move is front-end-led, belly-led, long-end-led, bull/bear steepening/flattening, and what catalyst would validate or fade it.

## 4. PubFinance / Liquidity Plumbing

Purpose: separate fiscal, monetary, and plumbing contributions instead of treating “liquidity” as one number.

Sequence:
1. `get_market_snapshot()` — broad bundle.
2. `get_lci_summary()` — regime and percentile.
3. If fiscal is the driver: `get_fiscal_daily()`, `get_fiscal_weekly()`.
4. If monetary is the driver: `get_fed_liquidity()`, `get_reference_rates()`.
5. If plumbing is the driver: `get_rrp_operations()`, `get_repo_operations()`, `get_primary_dealers()`, `get_settlement_fails()`.
6. For foreign demand: `get_tic_flows()`. For debt stock: `get_debt_latest()`.

Output: explicitly say which pillar is doing the work and whether the impulse is likely transient, seasonal, or structurally market-relevant.

## 5. Cross-Domain Quant Check

Use `run_analysis(code)` when sequential MCP calls would force the agent to manually join data. Good cases:

- CPI/NFP surprise versus ZN/ES reaction windows.
- Multi-instrument correlations computed from candles.
- Newsletter/news event windows versus futures returns.
- Econ history trend plus market regime classification.

Rule: assign the final result to `result` in Python.
