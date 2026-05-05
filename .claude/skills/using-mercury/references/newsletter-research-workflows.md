# Mercury Newsletter and Research Workflows

Darth Feedor is not just “latest headlines”. It supports progressive retrieval over newsletters/articles/research. Use the right retrieval mode for the user's time horizon.

## Live tape vs newsletter research

- **Live/breaking:** `get_squawks` → `get_squawk_context`.
- **Recent curated articles/newsletters:** `list_articles` → `get_article_bullets` → `get_article_detail` only if needed.
- **Theme expansion from one good article:** `article_graph`.
- **Broad thematic research:** `progressive_article_search`.
- **Archive/concept search:** `search_article_bullets` (relevance-ranked, not recency-ranked).
- **Panoramic synthesis:** `aggregate_articles`.
- **PDF/research docs:** `get_research`.

## Two-phase article retrieval

1. Start with `list_articles(...)`.
   - Use `since_days` for recency.
   - Use `query` for topical discovery.
   - Use `tags` and `tag_match` when the user gives a theme.
   - Show titles/IDs/thesis only.
2. Call `get_article_bullets(ids=[...])` for selected IDs.
   - This adds sentiment, mechanisms, and relevance score.
   - Stop here unless the user asks to open the article.
3. Call `get_article_detail(article_id="...")` only when bullets are insufficient.

Never pull full detail for ten articles. That wastes context and hides the signal.

## Following a theme

If one article is clearly relevant:

1. `article_graph(article_id="...", limit=10, min_shared_tags=1)`
2. Pick the 3–5 related articles with the clearest shared mechanisms.
3. `get_article_bullets(ids=[...])`
4. Cross-check market relevance with `get_market_overview` or the relevant complex bundle.

## Broad topic research

For “what has the street been saying about X?”:

1. `progressive_article_search(seed_query="...", max_depth=2, max_articles=10)`
2. If the result set is broad, `aggregate_articles(tags=[...], limit=30)` or `aggregate_articles(category="Macro", limit=30)`.
3. Summarise:
   - dominant thesis,
   - dissenting view,
   - mechanisms/data points,
   - market instruments affected,
   - what to monitor next.

## Archive search warning

`search_article_bullets(query="...")` ranks by textual relevance, not recency. Always inspect `published_at` before presenting it as current market context.

## Good newsletter prompts

- “Find recent newsletter coverage on Treasury refunding and connect it to ZN/ZB.”
- “What are the recurring mechanisms people cite for gold strength?”
- “Trace articles related to this CPI piece and tell me what changed over time.”
- “Aggregate the last two weeks of policy articles and separate consensus from outliers.”
