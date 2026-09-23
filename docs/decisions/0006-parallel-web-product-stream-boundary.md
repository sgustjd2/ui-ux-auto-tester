# ADR 0006: Parallel web-product stream boundary

- Status: ACCEPTED
- Date: 2026-09-02
- Phase: 0
- Supersedes / Superseded by: none

## Context

While Phase 0 was being established, a second workstream in a concurrent session created `docs/web-product/` (web product PRD, architecture, Audit Core contract, domain model, security and privacy, decision log, README). Its README states that the root `prd.md` is the authority for audit semantics, that the core schema documents win over its provisional shapes once they exist, declares an ownership boundary (the core stream owns `CLAUDE.md`, `prd.md`, the core `docs/*.md`, `docs/decisions/`, `research/`, `.claude/`, `scripts/`, `tests/`, and the Skill folder; the web stream owns `docs/web-product/` and, from its Phase W1, the web application locations decided in its own decision log), and asks the core stream to add a pointer in `CLAUDE.md`. None of the core files were modified by that stream.

## Decision

1. The boundary is acknowledged as stated. Core sessions never edit `docs/web-product/`; the web stream never edits core-owned files. Conflicts are raised in both decision logs and, if they touch audit semantics, escalated to the user as a `prd.md` question.
2. `docs/web-product/*` sits at level 5 of the source-of-truth order (stream and research documents), below `prd.md`, `CLAUDE.md`, `docs/architecture.md`, `docs/decisions/*`, and the core schema documents.
3. `CLAUDE.md` points to `docs/web-product/README.md` as a read for web-stream work only; core sessions are not required to read it.
4. `scripts/check-harness.mjs` skips `docs/web-product/` entirely, so a core session's check can never fail on files it must not edit. The web stream is responsible for validating its own documents.
5. When the core stream publishes the report and JSON output schema (Phase 3), it reviews the provisional assumptions in `docs/web-product/decisions.md` and reports mismatches to the web stream (GAP-025).

## Consequences

- Two decision logs exist by design: `docs/decisions/` for the core stream and `docs/web-product/decisions.md` for the web stream. Each records only its own decisions.
- The layout table in `docs/architecture.md` lists `docs/web-product/` as an externally owned directory. Future web application directories are added to that table as externally owned once the web stream decides their locations.
- Ledger, coverage, and gaps in `research/` track only core-stream work.

## Alternatives considered

- Leaving the directory undocumented: rejected, because a future session would find an unexplained 100 KB of specification and could not tell whose it is or whether it is authoritative.
- Merging the web decision log into `docs/decisions/`: rejected, it violates the declared boundary and mixes owners.
- Validating web-product links in the harness check: rejected, because a failing check would block core sessions on files they may not edit.
