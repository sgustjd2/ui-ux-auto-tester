# ADR 0001: Source of truth and repository layout

- Status: ACCEPTED
- Date: 2026-09-02
- Phase: 0
- Supersedes / Superseded by: none

## Context

The repository had no commits and contained only `prd.md` and an empty `.claude/worktrees/` directory at the start of the Phase 0 session. Later in the same session a parallel stream added `docs/web-product/`; that is recorded in ADR 0006 and does not change this decision. `prd.md` §16 proposes a harness layout and §16.2 an authority order. The harness must let a fresh session recover project state from files alone, without duplicating the same fact in several places.

## Decision

1. Authority order is exactly `prd.md` > `CLAUDE.md` > `docs/architecture.md` > `docs/decisions/*` > standards and research documents > implementation. Conflicts are reported and recorded, never resolved by silently editing the higher document.
2. `prd.md` stays at the repository root as delivered; its content is untouched.
3. The PRD §16 layout is adopted with these adaptations:
   - `research/sources.md` is the source registry (facts per source: authority, canonical URL, version, status, license, last check). `research/ledger.md` is the work log (status board, next actions, session log). The PRD §15 "research ledger" field list is implemented in `sources.md`, because those fields describe sources; the ledger tracks progress. This keeps one home per fact.
   - `research/notes/` is created on first use; git cannot track an empty directory and a placeholder file would serve no purpose.
   - `tests/` is not created until there is code to test (see ADR 0004). `.claude/hooks/` is not created; the only hook candidate is the harness check in `scripts/`, wired through the opt-in settings example.
   - `README.md` is added as the human entry point for the GitHub repository; it links to `prd.md` and `CLAUDE.md` and does not restate them.
4. Current project phase is stated only in the `CLAUDE.md` Status block and changes only at phase transitions. In-phase progress lives in `research/ledger.md` and `docs/standards-coverage.md`.
5. Status vocabularies are defined once in `docs/standards-research-plan.md` §6 (research) and `research/gaps.md` (gaps) and mirrored by the harness check.

## Consequences

- A future session answers "what phase, what is done, what is next" from `CLAUDE.md` and `research/ledger.md` without chat history.
- Adding a directory requires updating the layout table in `docs/architecture.md`.
- Two research files must be kept consistent (sources and coverage reference each other by ID); the harness check enforces referential integrity.

## Alternatives considered

- Single `research/ledger.md` holding both source facts and the work log: rejected because the table would mix stable facts with volatile progress and grow unreadable.
- A separate status document under docs/ for phase state: rejected as one more file for a fact that changes eight times in the project's life.
- Committing `.claude/settings.json` directly: rejected in favor of the PRD's `settings.json.example` so hooks stay opt-in during scaffolding (`prd.md` §16.6).
