# ADR 0004: Validation tooling

- Status: ACCEPTED
- Date: 2026-09-02
- Phase: 0
- Supersedes / Superseded by: none

## Context

`prd.md` §9 leaves the implementation language open until repository inspection, §16 asks for a validation strategy and `scripts/` and `tests/` directories, and §19 forbids a large dependency stack. Inspection found Node.js 24 and a Python 3.9 interpreter on the development machine, no package manifest, and no code to test.

## Decision

1. Validation scripts are written for Node.js (ES modules, `.mjs`) using only the standard library. No `package.json` is added until a dependency or a script alias is actually needed.
2. `scripts/check-harness.mjs` is the single validation entry point for Phase 0 and Phase 1. It verifies required files, internal Markdown links and backtick path references, table cell counts, status vocabularies, two-way referential integrity between `docs/standards-coverage.md` and `research/sources.md` plus the prefix registry in `docs/rule-schema.md`, that no domain is COVERED or PARTIAL without a VERIFIED source, gap and ADR structure and ADR index consistency, the ledger status-board counts, and the `CLAUDE.md` length limit. It exits non-zero on any failure.
3. `tests/` is created when the first code module exists (Phase 4 at the latest); until then the harness check is the test. Adding a test framework requires an ADR.
4. Hooks are opt-in. `.claude/settings.json.example` shows a Stop hook that runs the harness check and a minimal permissions list; adopting it is a local choice. No hook is active by default (`prd.md` §16.6).
5. Later validators (rule registry, report schema, rule coverage) are added as separate scripts beside the harness check and listed in `docs/architecture.md`.

## Consequences

- The check runs anywhere Node 18+ exists, with no install step.
- Markdown tables in the validated files must not contain the `|` character inside cells.
- YAML rule validation will need a parser decision at Phase 2 (GAP-002).

## Alternatives considered

- Python scripts: available, but the interpreter version on the machine is old and PyYAML would also be a dependency; Node is the more current runtime here.
- A test framework now: nothing to test; rejected.
- Active hooks in a committed `.claude/settings.json`: rejected for scaffolding per `prd.md` §16.6.
