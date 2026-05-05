---
name: filing-bugs
description: Help users file bug reports for Mercury. TRIGGER when the user reports a bug, discovers an error, finds unexpected behavior, or says things like "this is broken", "there's a bug", "it doesn't work", "I found an issue", or describes any problem. Also trigger proactively when you observe failures or unexpected behavior in your own work.
---

# Filing Bugs for Mercury

When something isn't working, help the user report it so it can be fixed.

## Step 1: Gather the details

Collect the following before filing:

1. **What happened** — the error message or wrong behavior
2. **What was expected** — what should have happened
3. **Steps to reproduce** — how to trigger it
4. **Environment** — OS, Claude Desktop or Claude Code, Node version if relevant

Ask for anything missing, but don't be pedantic — file quickly with what you have.

## Step 2: File on GitHub (preferred)

Direct the user to open an issue at:

**https://github.com/Jaggerxtrm/terminalbeta/issues/new**

Use this template:

```
**Describe the bug**
[What happened — include any error messages]

**Expected behavior**
[What should have happened]

**Steps to reproduce**
1. 
2. 
3. 

**Environment**
- OS: [e.g. Windows 11, macOS 14]
- Client: [Claude Desktop / Claude Code]
- Node version (if relevant): 

**Additional context**
[Anything else that might help]
```

## Step 3: No GitHub? Generate a report to send

If the user doesn't have a GitHub account, produce a clean bug report they can copy and send via email or another channel:

---

**Bug Report — Mercury**

**What happened:**
[observed behavior]

**What was expected:**
[expected behavior]

**Steps to reproduce:**
1. [step]
2. [step]
3. [observe]

**Environment:**
- OS: 
- Client: Claude Desktop / Claude Code
- Node version (if relevant): 

**Additional context:**
[any other details]

---

Tell the user they can send this to the Mercury support contact or paste it into any feedback channel they have access to.

## Severity guide

| Severity | Example |
|----------|---------|
| Critical | Data loss, auth broken, installer crashes for everyone |
| High | Major feature broken, no workaround |
| Medium | Feature degraded, workaround exists |
| Low | Minor issue, cosmetic |

Include severity in the report title if it's Critical or High, e.g. `[Critical] Installer crashes on Windows`.
