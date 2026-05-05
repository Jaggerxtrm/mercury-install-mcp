# Mercury Tool Selection Cheatsheet

| Question | Start with | Then use |
|---|---|---|
| What is the market regime? | `get_regime` | `get_market_overview`, `get_correlation_matrix` |
| What is moving? | `get_market_overview` | Complex bundle, `get_volatility_metrics` |
| Why is ES/ZN/CL/GC moving? | `get_symbol_detail` | `get_amt_snapshot`, `get_market_texture`, `get_squawks` |
| Is this a breakout or balance? | `get_amt_snapshot` | `get_market_texture`, `get_volatility_metrics` |
| Is vol dangerous? | `get_volatility_metrics` | `get_correlation_matrix`, `get_futures_options` |
| What is the curve doing? | `get_curve_snapshot` | `get_curve_analysis`, `get_treasuries_bundle` |
| What is the front end pricing? | `get_stir_snapshot` | `get_stir_matrix`, `get_stir_bundle` |
| What data is on deck? | `get_economic_events` | `get_symbol_detail`, `get_volatility_metrics` |
| What is liquidity doing? | `get_market_snapshot` | `get_lci_summary`, pillar drilldowns |
| What is in the news now? | `get_squawks` | `get_squawk_context` |
| What have newsletters said about X? | `list_articles` or `progressive_article_search` | `get_article_bullets`, `article_graph`, `aggregate_articles` |
| Need a custom cross-service statistic? | `run_analysis` | Use sequential tools only to validate output |
