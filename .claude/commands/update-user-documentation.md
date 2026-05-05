---
name: update-user-documentation
description: Workflow command scaffold for update-user-documentation in terminalbeta.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /update-user-documentation

Use this workflow when working on **update-user-documentation** in `terminalbeta`.

## Goal

Update user-facing documentation to clarify instructions or correct steps.

## Common Files

- `docs/quickstart.md`
- `README.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit documentation file(s) (e.g., quickstart.md, README.md) to update or clarify instructions.
- Commit the changes with a message referencing the specific clarification or fix.

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.