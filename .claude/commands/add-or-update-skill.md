---
name: add-or-update-skill
description: Workflow command scaffold for add-or-update-skill in terminalbeta.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-update-skill

Use this workflow when working on **add-or-update-skill** in `terminalbeta`.

## Goal

Add a new skill or update existing skills for user-facing workflows.

## Common Files

- `.claude/skills/*/SKILL.md`
- `.claude/skills/*/references/*.md`
- `.xtrm/skills/active/*`
- `.gitignore`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or update SKILL.md and reference files in the appropriate skills directory (e.g., .claude/skills/ or .xtrm/skills/).
- If adding a new skill, ensure references and supporting files are included.
- Update .gitignore if necessary to track or untrack skill directories.
- Commit the changes with a message referencing the new or updated skill.

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.