# ADR 0008: JSON rule records and linked test procedures

- Status: ACCEPTED
- Date: 2026-09-23
- Phase: 2
- Supersedes / Superseded by: supersedes ADR 0002 (decision 1 changes; decisions 2 to 6 are carried over unchanged below)

## Context

ADR 0002 made YAML the canonical rule format and deferred the parser question to the start of Phase 2 (GAP-002): Node.js ships no YAML parser, so YAML records need either a new dependency (ADR 0004 requires an ADR and prefers none) or a hand-written parser. Phase 2 starts on 2026-09-23 with WCAG 2.2, whose criteria map to W3C ACT rules (SRC-W3C-ACT-RULES); GAP-040 asked whether rule records should carry those links so testability is evidence-based rather than guessed.

## Decision

1. Canonical rule records are JSON: one file per source family under `registry/` (for example `registry/wcag22.json`), each file a JSON array of rule records with the exact field set in `docs/rule-schema.md` §4. Unknown fields are invalid. JSON is parsed with the Node standard library, so no dependency is added (ADR 0004).
2. (Carried over from ADR 0002.) Rule IDs are `<PREFIX>-<identifier>`, the prefix maps to one source ID, the identifier keeps the public number when one exists, the version lives in `source_version`, and IDs are never reused.
3. (Carried over.) Overlap between authorities is expressed with typed `related_rules`, never by merging records.
4. (Carried over.) `rule_class` follows authority and force, not topic; `normative_strength` maps the source's wording to MUST, SHOULD, MAY, INFORMATIVE.
5. (Carried over.) Testability is tri-state (FULL, PARTIAL, NONE) for automated, visual, and manual methods.
6. (Carried over.) Categories are the twelve `prd.md` §10 groups; subcategories are their listed items.
7. New optional field `test_procedures`: a list of linked test procedures, each `{ "type": "act", "id": "<six-character ACT rule id>", "status": "approved" | "proposed" }`, citing SRC-W3C-ACT-RULES. Only ACT links are allowed for now; links to engine rules (for example axe-core) wait for the Phase 5 tooling decision (GAP-015), because tools are not registry sources (ADR 0007). Deprecated ACT rules are not linked, and a rule is linked only where the criterion is one of that ACT rule's conformance requirements (`forConformance` in the W3C mapping); secondary mappings, whose failures may still satisfy the criterion, are not linked, so a failed ACT rule never implies a failed criterion it only relates to. This settles the rule-record part of GAP-040; mapping ACT outcomes to check results stays with the Phase 3 output schema.
8. For sources with publicly numbered requirements (WCAG success criteria, EN 301 549 clauses, KWCAG items), the numbered requirement is the atomic record, and its conditions, options, and exceptions stay inside that record; the "one requirement per record" rule splits only unnumbered compound clauses. This keeps IDs equal to the public numbers that findings cite.
9. `scripts/check-registry.mjs` validates the registry against `docs/rule-schema.md` §4, the source registry, and the prefix registry; `scripts/check-harness.mjs` runs it whenever `registry/` exists, so the single harness entry point stays authoritative.

## Consequences

- Records are slightly noisier to edit by hand than YAML (quotes, commas); the validator catches syntax and schema errors immediately.
- `docs/rule-schema.md` moves to v0.2 (JSON, `test_procedures`); its illustrative record becomes JSON.
- `registry/` is added to the layout table in `docs/architecture.md` §6.
- The PRD's YAML-style examples remain illustrative; derived Skill references (Phase 4) can render records in any readable form.

## Alternatives considered

- YAML with a small parser dependency: readable, but adds the first dependency to a stdlib-only repository for no functional gain.
- A hand-written YAML subset parser: no dependency, but bespoke parsing code that every later session must trust and maintain.
- JSON Lines (one record per line): easy to diff per record, but long paraphrase fields make single lines unreadable.
- Engine rule links now: premature before the tooling decision, and would put tools into the registry.
