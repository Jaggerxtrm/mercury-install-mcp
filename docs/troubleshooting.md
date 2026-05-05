---
title: Mercury Troubleshooting
description: Fix MCP connection, API key, Desktop extension, and stale-data issues.
nav_order: 6
publish: true
---

# Mercury Troubleshooting

Use this page when Mercury tools are missing, authentication fails, Desktop extension install is unclear, or data appears stale.

## MCP connection issues

Use this page when Claude cannot see Mercury tools or a server does not respond.

### Checks

1. Confirm the server is installed.
2. Restart Claude or Pi after changing MCP config.
3. Check that the API key header is present.
4. Run the relevant health check tool.

Expected servers:

- `mercury-market-data`
- `mercury-darth-feedor`
- `mercury-econ-data`
- `mercury-pubfinance`

### Common causes

- Client was not restarted after install.
- API key missing or invalid.
- Project/user scope mismatch in Claude Code.
- Old MCP session after server restart.

### Related

[[troubleshooting|API key issues]]

## API key issues

All Mercury MCP servers require the same API key via the `X-API-Key` header.

### Symptoms

- Tools are visible but calls fail.
- Health checks return authorization errors.
- Desktop extension asks for a key again.

### Fixes

- Reinstall the Claude Desktop extension and enter the key again.
- For Claude Code, rerun the installer and choose reinstall if prompted.
- For Pi/manual configs, confirm the header is present without printing or committing the secret.

> **Warning:** Never commit a real Mercury API key to `.mcp.json`, `.pi/mcp.json`, docs, screenshots, or logs.

## Claude Desktop extension troubleshooting

The Desktop extension bundles all four Mercury servers behind one local extension package.

### Install does not open

- Confirm Claude Desktop is installed and up to date.
- Double-click `mercury-platform.mcpb` again.
- If the OS blocks the file, allow it from system security settings.

### Tools do not appear

- Restart Claude Desktop.
- Confirm the extension is enabled.
- Re-enter the API key if prompted.

### Best practice

Ship only `using-mercury` as the Desktop skill. It contains workflow routing for the specialized Mercury workflows.

## Stale or missing data

Mercury analysis should always be based on fresh tool calls. If data looks stale or unavailable, check freshness before interpreting the result.

### Checks

- Market data: run `health_check` and compare timestamps in tool output.
- PubFinance: run `get_data_freshness()`.
- Econ data: run `get_data_quality()`.
- Newsletters/articles: inspect `published_at`; archive search is relevance-ranked, not recency-ranked.

### Common pitfalls

- Treating earlier conversation data as live.
- Using newsletter archive hits as if they are current headlines.
- Ignoring holidays/weekends or source update schedules.

### Related

[[workflows|Newsletter and research workflow]]
