---
name: adjust-gitignore-and-untrack-files
description: Workflow command scaffold for adjust-gitignore-and-untrack-files in terminalbeta.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /adjust-gitignore-and-untrack-files

Use this workflow when working on **adjust-gitignore-and-untrack-files** in `terminalbeta`.

## Goal

Update .gitignore to include or exclude dev tooling or workflow artifacts and untrack files as needed.

## Common Files

- `.gitignore`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit .gitignore to add or remove patterns for files/directories.
- Untrack files from git history as needed.
- Commit the changes with a message referencing the .gitignore update and untracked files.

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.