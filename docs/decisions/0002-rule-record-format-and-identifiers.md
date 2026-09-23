# ADR 0002: Rule record format and identifiers

- Status: ACCEPTED
- Date: 2026-09-02
- Phase: 0
- Supersedes / Superseded by: none

## Context

`prd.md` §8 lists the rule fields and gives a YAML-style example. Relative to that list, this schema renames `version` to `source_version`, folds `automated_check`, `visual_check`, and `manual_check` into a tri-state `testability` object, and adds `source_status` and `status`; every other PRD field is kept under its PRD name. Phase 2 will normalize hundreds of rules from overlapping standards; Phase 4 needs progressive loading. The format and ID scheme must be fixed before any rule is written so subagents cannot diverge.

## Decision

1. Canonical rule records are YAML documents, one file per source family, with the exact field set in `docs/rule-schema.md` §4. Unknown fields are invalid.
2. Rule IDs are `<PREFIX>-<identifier>`, where the prefix maps to one source ID (`docs/rule-schema.md` §8) and the identifier preserves the public number when one exists. Version lives in `source_version`, not in the ID. IDs are never reused.
3. Overlap between authorities is expressed with `related_rules` and typed relations (equivalent, narrower, broader, overlaps, see_also), never by merging records, so authority and jurisdiction remain visible per rule.
4. `rule_class` is assigned from authority and force, not from topic; `normative_strength` maps the source's own wording to MUST, SHOULD, MAY, INFORMATIVE.
5. Testability is a tri-state per method (FULL, PARTIAL, NONE) for automated, visual, and manual checks. The PRD example booleans map to FULL and NONE.
6. Categories are the twelve `prd.md` §10 groups; subcategories are the listed items.

## Consequences

- Validating YAML in `scripts/` needs a YAML parser, which Node does not ship. The choice between adding a small dev dependency (an ADR is required) and switching records to JSON is deferred to the start of Phase 2 and tracked as GAP-002. Until then nothing depends on the parser.
- The registry directory does not exist yet; creating it in Phase 2 requires updating the layout table in `docs/architecture.md`.
- Prefix additions require a source ID first, which forces research before rule authoring.

## Alternatives considered

- JSON records: machine-friendly and dependency-free, but harder to author by hand and further from the PRD examples; kept as the fallback in GAP-002.
- Markdown tables per standard: readable, but not validatable and prone to drift; rejected as the canonical form (Markdown references remain as derived views for the Skill).
- Merging equivalent rules across authorities into one record: rejected because it hides which authority applies in which jurisdiction.
