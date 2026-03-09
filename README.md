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
