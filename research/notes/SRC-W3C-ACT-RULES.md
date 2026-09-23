# SRC-W3C-ACT-RULES — ACT Rules (WAI rule list)

- Authority: W3C WAI (rules written in the ACT Rules Format by the ACT Rules Community Group and ACT Task Force; approved rules are approved by the relevant Working Group)
- Canonical URL: https://www.w3.org/WAI/standards-guidelines/act/rules/
- Version / date: living list; snapshot 2026-09-23 (no page-level date found in the downloaded HTML)
- Source status: CURRENT
- Superseded by / supersedes: continuously updated; individual rules carry their own versions and can be deprecated
- License / access: W3C Software and Document License (footer link to the W3C software license); paraphrase and cite rule IDs
- Verified on: 2026-09-23 (list page downloaded; statement of informative status read; rules counted from the W3C wcag-act-rules mapping file)
- Tier: T2
- Domains served: A11Y-WCAG22

## Scope and applicability

- The page states that ACT Rules describe ways to test conformance to WCAG, ARIA, and other accessibility practices, that approved rules are formally approved by the relevant Working Group, that proposed rules are agreed by the ACT Task Force but not yet approved, and that ACT Rules are informative (not required for determining conformance).
- The list is organized by WCAG 2.2 success criterion (Levels A, AA, AAA) plus an ARIA section, and can be filtered by rule status (approved, proposed, deprecated) and by implementation type (manual, semi-automatic, automated, linter).
- Snapshot count 2026-09-23: 94 rules: 37 approved, 50 proposed (not deprecated), and 7 deprecated (which the file also flags as proposed). Counted from `wcag-mapping.json` in the W3C repository https://github.com/w3c/wcag-act-rules, which generates the list page; every entry records ACT Rules Format 1.1. A first count from the page markup found only 84 rules because the list is partly built dynamically, so the repository file is the reliable count. Recount before relying on the numbers.
- Platforms: web. Jurisdiction: GLOBAL.

## Structure

- Each rule has a six-character ID (for example `46ca7f`, "Element marked as decorative is not exposed", mapped to 1.1.1) and a page with applicability, expectations, assumptions, accessibility support notes, and passed/failed/inapplicable test cases, following SRC-W3C-ACT-FORMAT.
- The list filters by implementation type, and the WAI site links implementation reports per rule; which tools implement which rules was not extracted this session. Tooling state is tracked in `research/landscape.md`.

## Candidate rules

ACT rules are not new requirements; they are test procedures for existing ones. Phase 2 use:

- For each WCAG rule record, link the approved ACT rules (and proposed ones marked as such) that test it, and derive `testability.automated` from their implementation types (an ACT rule with automated implementations supports PARTIAL or FULL automated testability for that aspect).
- ACT test cases (passed/failed/inapplicable) are ready-made known-good and known-bad fixtures for Phase 7 (`prd.md` §18 Phase 7). Recorded as a candidate, not a decision.
- Rules stay cited as `WCAG-<sc>` records; the ACT ID goes in `notes` or a future `test_procedures` field (schema change would need an ADR).

## Cross-references

- ACT Rules Format 1.1 (SRC-W3C-ACT-FORMAT).
- WCAG 2.2 (SRC-W3C-WCAG22), WAI-ARIA 1.2 (SRC-W3C-ARIA12), ARIA in HTML (SRC-W3C-HTML-ARIA).
- Understanding WCAG 2.2 (SRC-W3C-WCAG22-UNDERSTANDING): the other informative companion of WCAG.

## Uncertainties and gaps

- Proposed rules are not Working Group approved; the registry must record rule status when citing one.
- Whether the rule schema gains a field for linked test procedures is a Phase 2 decision (recorded in `research/gaps.md`).
