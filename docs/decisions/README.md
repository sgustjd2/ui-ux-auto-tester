# Architecture Decision Records

Material decisions are recorded here so that future sessions can see what was decided, why, and what it replaced. Authority: below `docs/architecture.md`, above research documents and implementation (`CLAUDE.md`, Source of truth).

## When to write an ADR

Write one when a decision changes architecture, schemas, scope interpretation, tooling, dependencies, the source-of-truth order, or the repository layout. Do not write one for routine edits, research facts (those go to `research/`), or open questions (those go to `research/gaps.md` until decided).

## Format

File name: `NNNN-kebab-case-title.md`, four-digit sequence, never reused. Each file:

```markdown
# ADR NNNN: Title

- Status: PROPOSED | ACCEPTED | SUPERSEDED | REJECTED
- Date: YYYY-MM-DD
- Phase: <phase number>
- Supersedes / Superseded by: <ADR id or none>

## Context
## Decision
## Consequences
## Alternatives considered
```

Superseding an ADR: write the new ADR, set the old one's status to SUPERSEDED with a link, and never edit the old decision text. Add every ADR to the index below; the harness check fails if a record is missing from it.

## Index

| ADR | Title | Status | Date |
|---|---|---|---|
| [0001](0001-source-of-truth-and-repository-layout.md) | Source of truth and repository layout | ACCEPTED | 2026-09-02 |
| [0002](0002-rule-record-format-and-identifiers.md) | Rule record format and identifiers | SUPERSEDED | 2026-09-02 |
| [0003](0003-finding-types-and-independent-dimensions.md) | Finding types and independent dimensions | ACCEPTED | 2026-09-02 |
| [0004](0004-validation-tooling.md) | Validation tooling | ACCEPTED | 2026-09-02 |
| [0005](0005-subagent-strategy.md) | Subagent strategy | ACCEPTED | 2026-09-02 |
| [0006](0006-parallel-web-product-stream-boundary.md) | Parallel web-product stream boundary | ACCEPTED | 2026-09-02 |
| [0007](0007-ecosystem-landscape-and-industry-sources.md) | Ecosystem landscape and industry sources | ACCEPTED | 2026-09-23 |
| [0008](0008-json-rule-records-and-test-procedures.md) | JSON rule records and linked test procedures | ACCEPTED | 2026-09-23 |
