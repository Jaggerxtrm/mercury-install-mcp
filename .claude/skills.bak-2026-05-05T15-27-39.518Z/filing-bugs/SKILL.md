---
name: filing-bugs
description: File well-structured bug reports in the terminalbeta issue tracker. TRIGGER when the user reports a bug, discovers an error, finds unexpected behavior, or says things like "this is broken", "there's a bug", "it doesn't work", "I found an issue", "error when", or describes any problem they encountered during testing. Also trigger proactively when you observe test failures, crashes, or unexpected behavior in your own work.
---

# Filing Bugs in TerminalBeta

This skill guides you through filing comprehensive, actionable bug reports using `bd` (beads issue tracker).

## When to File

File a bug when:
- User reports unexpected behavior or errors
- User describes something that "doesn't work" or is "broken"
- You encounter test failures, crashes, or errors during your own work
- User mentions finding an "issue" or "problem" during testing
- Any behavior deviates from documented expectations

**Always file bugs proactively** when you observe issues — don't wait for the user to ask.

## Bug Filing Workflow

### Step 1: Gather Information

Before filing, collect:

1. **What happened** - The observed behavior or error
2. **What was expected** - What should have happened instead
3. **Reproduction steps** - How to trigger the bug (commands, inputs, conditions)
4. **Environment** - Node version, OS, terminal, Claude Code version if relevant
5. **Severity** - How impactful is this bug?

Ask the user for any missing details, but don't be overly pedantic — file quickly with what you have.

### Step 2: Determine Priority

| Priority | Label | When to Use |
|----------|-------|-------------|
| P0 | `--priority 0` | Critical: Blocks all testing, data loss, security issue |
| P1 | `--priority 1` | High: Major feature broken, no workaround |
| P2 | `--priority 2` | Medium: Feature degraded, workaround exists |
| P3 | `--priority 3` | Low: Minor issue, cosmetic, nice-to-fix |
| P4 | `--priority 4` | Backlog: Future consideration |

Default to P2 for most bugs unless clearly critical or minor.

### Step 3: Write the Bug Report

Use this template for the description:

```
## Observed Behavior
[What actually happened - error message, wrong output, crash, etc.]

## Expected Behavior
[What should have happened]

## Reproduction Steps
1. [First step]
2. [Second step]
3. [Observe the bug]

## Environment
- Node version: [e.g., 20.20.0]
- OS: [e.g., Linux, macOS, Windows]
- Terminal: [e.g., bash, zsh, fish]
- Claude Code version: [if relevant]

## Additional Context
[Any other relevant information - screenshots, logs, related issues]
```

### Step 4: File the Bug

```bash
bd create "[Bug]: <short description>" \
  -t bug \
  -p <priority> \
  --description="<full description>" \
  [--deps="discovered-from:<parent-issue>"]
```

**Example:**
```bash
bd create "[Bug]: Installer fails when Claude Code not in PATH" \
  -t bug \
  -p 1 \
  --description="## Observed Behavior
The installer crashes with 'claude: command not found' when Claude Code CLI is not in the system PATH.

## Expected Behavior
Installer should detect missing Claude CLI and provide helpful instructions or prompt to install it.

## Reproduction Steps
1. Remove Claude Code from PATH
2. Run npx github:Jaggerxtrm/terminalbeta
3. Select any server to install
4. Observe 'claude: command not found' error

## Environment
- Node version: 20.20.0
- OS: Linux (Ubuntu 24.04)
- Terminal: bash

## Additional Context
This blocks users who haven't set up Claude Code yet."
```

### Step 5: Confirm and Link

After filing:
1. Confirm the issue ID to the user: "Filed bug `bd-42`"
2. If this was found while working on another issue, link it:
   ```bash
   bd update bd-42 --deps="discovered-from:bd-15"
   ```
3. If the bug blocks other work, note the dependency:
   ```bash
   bd update bd-15 --deps="blocked-by:bd-42"
   ```

## Quick Reference

```bash
# Create bug
bd create "[Bug]: <title>" -t bug -p <0-4> --description="<desc>"

# View bug details
bd show <id>

# List all bugs
bd list --type=bug

# Claim and fix
bd update <id> --claim
# ... fix the bug ...
bd close <id> --reason="Fixed in <commit>"

# Find ready bugs
bd ready --type=bug
```

## Best Practices

1. **File immediately** - Don't wait until later; bugs get forgotten
2. **One bug per issue** - Split complex issues into separate bugs
3. **Be specific** - "It doesn't work" is not actionable
4. **Include reproduction** - Someone else should be able to trigger it
5. **Link dependencies** - Connect to related issues with `--deps`
6. **Use `discovered-from`** - Track where bugs were found (useful for beta testing context)

## Anti-Patterns

- ❌ Vague descriptions: "The installer is broken"
- ❌ Missing reproduction: "It crashed"
- ❌ Wrong priority: P0 for cosmetic issues
- ❌ Combining multiple bugs: "Three things don't work"
- ❌ Forgetting to file: "I'll file a bug later" (do it now)

## Related Skills

- **planning** - For breaking down larger work into issues
- **test-planning** - For ensuring bugs have test coverage