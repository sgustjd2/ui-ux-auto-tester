---
description: Summarize the current research state and next actions from repository files (read-only)
allowed-tools: Read, Grep, Glob, Bash(node scripts/check-harness.mjs), Bash(git status:*)
---

Report the project's research state from repository files only. Do not change any file.

1. Read the Status block in `CLAUDE.md`, the Status board and Next actions in `research/ledger.md`, the OPEN and DEFERRED rows in `research/gaps.md`, and `docs/standards-coverage.md`.
2. Run `node scripts/check-harness.mjs` and `git status --short`.
3. Reply with:
   - current phase and focus;
   - counts of domains by research status and sources by research status (count them from the tables; do not trust the ledger counts blindly, and say if they disagree);
   - OPEN gaps that block the next action;
   - the next three actions from the ledger queue;
   - harness check result and any uncommitted changes.

If the ledger, coverage matrix, and source registry disagree with each other, say so explicitly; that is the first thing to repair before new research.
