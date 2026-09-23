# ADR 0003: Finding types and independent dimensions

- Status: ACCEPTED
- Date: 2026-09-02
- Phase: 0
- Supersedes / Superseded by: none
- Amended: 2026-09-02, same session, after independent review, before any consumer existed (VIOLATION limited to MUST strength; confidence floor added; PLATFORM/STANDARD inclusion recorded as GAP-026)

## Context

`prd.md` §11 defines three finding types (VIOLATION, UX_RISK, USER_SIGNAL) and §7.7 requires severity and priority to stay separate. The PRD does not say how METRIC rule breaches or platform guideline breaches map to a type, and does not fix the confidence scale.

## Decision

1. Exactly three finding types. VIOLATION requires a FAIL on a rule of class NORMATIVE, LEGAL, STANDARD, or PLATFORM with strength MUST, observable evidence, and confidence MEDIUM or HIGH. UX_RISK requires a heuristic or best-practice reference, or a metric, SHOULD/MAY/INFORMATIVE guidance, or PARTIAL (suspected) requirement result, plus observable evidence. USER_SIGNAL requires persona signals with `simulated: true`.
2. PLATFORM and STANDARD requirements with MUST force can produce a VIOLATION, scoped to that platform, because the PRD treats platform guidelines as authoritative for the target platform (AC-08). It is never labeled as a WCAG or legal failure. Because `prd.md` §11.1 speaks only of an "authoritative standard or applicable requirement", this inclusion is recorded as an assumption (GAP-026).
3. METRIC breaches are UX_RISK with `performance_metric` evidence unless a NORMATIVE or LEGAL rule incorporates the threshold. Recorded as an assumption (GAP-001) because the PRD does not state it.
4. Severity (harm), priority (implementation order), and confidence (evidence strength) are independent enumerations; none is derived from another automatically. Confidence is HIGH, MEDIUM, LOW with the definitions in `docs/finding-schema.md` §6; USER_SIGNAL confidence is capped at MEDIUM, and VIOLATION requires MEDIUM or HIGH (LOW-confidence evidence yields a PARTIAL check and a suspected-violation UX_RISK).
5. Every applicable rule yields one of PASS, FAIL, PARTIAL, NOT_TESTED, NOT_APPLICABLE. PASS requires positive evidence; tool silence is not PASS. NOT_TESTED and NOT_APPLICABLE always carry a reason and are reported.
6. Persona output is labeled simulated at field level and section level, aggregated as counts, and never described as human research.

## Consequences

- Reports can list the same root issue under one type while showing supporting evidence of the other kinds, satisfying `prd.md` §11 without conflation.
- The report validator (Phase 4) must reject VIOLATION findings whose rules are HEURISTIC, BEST_PRACTICE, or METRIC, and any persona signal without `simulated: true`.
- If the user decides METRIC breaches deserve their own type, `prd.md` §11 changes first and this ADR is superseded.

## Alternatives considered

- A fourth type METRIC_FAILURE: cleaner for performance reporting but expands the PRD's declared three types; deferred to the user (GAP-001).
- Numeric confidence (0–1): more expressive but invites false precision from an LLM-driven auditor; rejected for v0.1.
- Deriving priority from severity by table: rejected by `prd.md` §7.7.
