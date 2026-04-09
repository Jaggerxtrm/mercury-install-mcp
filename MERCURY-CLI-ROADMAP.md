# Mercury — Agent-Friendly CLI Roadmap

Planned evolution of the Mercury CLI and MCP surface toward a more
**agent-native** interface: fewer round-trips, composable commands, structured
output, and an explicit versioning contract.

---

## Background

Mercury currently exposes its functionality primarily as individual, blocking
MCP calls. This works well for human-driven single lookups but creates
unnecessary overhead when an AI agent needs to run multi-step workflows
(e.g. lookup → transform → validate → summarize). The goal of this roadmap is
to give agents a richer, more composable surface without breaking the existing
human-friendly MCP layer.

The guiding principle: **what feels verbose to a human is often optimal for an
agent**. Explicit flags, predictable output schemas, and composable commands
reduce orchestration cost and make agent behavior more deterministic.

---

## M1 — Primitive vs Macro-Command Split

**What:** Introduce two command tiers:

- **Core commands** — atomic, stable, low-level primitives. Each does one thing
  and returns a clean, typed result. These will never change their output shape
  without a major version bump.
- **Agent workflows** — composable macro-commands that chain several MCP
  operations into a single invocation with a declared pipeline.

**Why:** Agents benefit from both: primitives for precise control, workflows to
reduce round-trips in common multi-step patterns.

**Example:**
```bash
# Instead of 4 separate MCP calls:
mercury workflow run --steps "lookup,transform,validate,summarize" --symbol ES --date today

# plan mode first to inspect sub-steps before executing:
mercury workflow plan --steps "lookup,transform,validate,summarize" --symbol ES
```

---

## M2 — Plan / Execute Mode

**What:** Every command (and workflow) gains two modes:

- `--plan` — dry run; prints what would happen, which sub-steps would fire, and
  with what parameters. No side effects.
- `--execute` (or default) — actually runs.

**Why:** Essential for agent debugging, chain review, and safe orchestration.
An agent can `--plan` first, inspect the output, then decide to `--execute`.

**Example:**
```bash
mercury market fetch --symbol CL --fields price,volume,iv --plan
# → Would call: market-data/futures?symbol=CL&fields=price,volume,iv
# → Estimated tokens: ~120
# → Sub-steps: [authenticate, fetch, normalize]
```

---

## M3 — Structured JSON Output on All Commands

**What:** Every command that currently returns human-readable text must also
support `--json` / `--format json` to emit a strict, typed JSON payload.

JSON should be the **primary** format for agents; human-readable is secondary.

**Output contract:**
```json
{
  "ok": true,
  "command": "market.fetch",
  "version": "1",
  "data": { "..." : "..." },
  "meta": {
    "latency_ms": 42,
    "source": "mercury-market-data",
    "timestamp": "2026-03-30T12:00:00Z"
  }
}
```

Error shape:
```json
{
  "ok": false,
  "command": "market.fetch",
  "error": { "code": "SYMBOL_NOT_FOUND", "message": "..." }
}
```

**Why:** Enables reliable chaining, ranking, and routing without fragile text parsing.

---

## M4 — Batch Semantics

**What:** A single invocation that declares multiple operations as a pipeline,
with shared context and a single aggregated response.

**Why:** Eliminates the N round-trip problem. Instead of an agent calling MCP
4 times sequentially (each with its own auth + network overhead), one batch
call returns all results.

**Proposed interface:**
```bash
mercury batch --file pipeline.json
mercury batch --inline '[{"op":"market.fetch","symbol":"ES"},{"op":"econ.next","limit":3}]'
```

Output: array of per-operation results with the same schema as M3, plus a
top-level `pipeline_id` for traceability.

**Note:** This is not shell piping — it is a first-class semantic understood by
the Mercury server, enabling server-side optimization (parallelism, caching).

---

## M5 — CLI Versioning Contract

**What:** Treat the CLI output surface as a versioned API:

- All JSON outputs include a `"version"` field.
- Fields can be deprecated (present but marked `_deprecated: true`) before removal.
- A `mercury schema <command>` subcommand returns the JSON schema for any command's output.
- A `MERCURY_API_VERSION` env var (or `--api-version` flag) pins behavior for stability-sensitive callers.

**Why:** If agents hardcode field access against Mercury output, silent schema changes break them.
A versioned contract enables safe evolution.

**Example:**
```bash
mercury schema market.fetch
# → prints JSON Schema for the market.fetch output

mercury market fetch --symbol ES --json --api-version 1
# → guaranteed to return v1 shape even after v2 is released
```

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| CLI surface grows too large to maintain | Keep core/workflow split strict; auto-generate workflow commands from a declarative registry |
| Duplication between CLI logic and MCP logic | CLI commands are thin wrappers; all logic lives in shared server-side handlers |
| Unstable output contracts break agents | M5 versioning + deprecation cycle before removal |
| Batch adds server-side complexity | Implement as sequential fan-out first; optimize to parallel later |

---

## Sequencing

```
M3 (JSON output) → M5 (versioning) → M1 (primitive split) → M2 (plan/execute) → M4 (batch)
```

M3 and M5 are foundations — everything else builds on a stable, typed output layer.

---

*Filed from session notes — Mercury/Specialist/Xtreme architecture review, 2026-03-30*
