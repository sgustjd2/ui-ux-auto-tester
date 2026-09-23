# Rule Schema

Status: v0.1, Phase 0 (2026-09-02). Defines the normalized rule model for the standards registry. Requirements: `prd.md` §3.2, §8, §10. Decision record: `docs/decisions/0002-rule-record-format-and-identifiers.md`. No rule registry exists yet; it is populated in Phase 2 from Phase 1 research.

## 1. Purpose

Every audit claim must resolve to a rule record that names its authority, source, version, verification date, class, applicability, and testability. The registry is the only place rules are defined; reference files in the Skill cite rule IDs.

## 2. Record format and location

- Canonical format: YAML, one document per rule, grouped in one file per source family (for example `registry/wcag-2.2.yaml` holding a list of rule records). The registry directory is created in Phase 2 and must be added to the layout table in `docs/architecture.md` at that time.
- Field names are `snake_case` exactly as listed below. Unknown fields are rejected by the future registry validator (Phase 2, GAP-002).
- Strings are written in this project's own words; verbatim text from sources is limited to short quoted thresholds or defined terms with attribution.

## 3. Rule identifier scheme

`<PREFIX>-<identifier>`

- `PREFIX` is registered in §8 and maps to exactly one source ID in `research/sources.md`.
- For sources with public numbering, `identifier` is the public number unchanged (`WCAG-2.5.8`, `EN301549-9.2.5.8`, `S508-E205.4`).
- For sources that label items without numbering them, `identifier` is the source's own label (`NNG-H01` for the ten heuristics). For unlabeled sections, `identifier` is a kebab-case slug of the section followed by a three-digit sequence (`HIG-buttons-001`, `BP-forms-003`).
- IDs are stable once published. A retired rule keeps its ID with `status: RETIRED`; IDs are never reused.
- Versioned sources keep the version in `source_version`, not in the ID, where the source keeps its public numbering stable across versions (confirm per source during research). A version that renumbers gets a new prefix.

## 4. Fields

| Field | Type | Required | Allowed values / format |
|---|---|---|---|
| `id` | string | yes | §3 |
| `title` | string | yes | Short name in this project's words |
| `authority` | string | yes | Publishing body (W3C, ETSI, U.S. Access Board, Apple, Google, ISO, NN/g, ...) |
| `source` | string | yes | Source ID from `research/sources.md` (`SRC-...`) |
| `source_url` | string | yes | Deep link to the specific clause or section at the canonical location |
| `source_version` | string | yes | Version or date string as published |
| `source_status` | enum | yes | CURRENT, SUPERSEDED, DRAFT, DEPRECATED, WITHDRAWN, UNKNOWN |
| `last_verified` | date | yes | YYYY-MM-DD when the rule was last checked against the source |
| `rule_class` | enum | yes | NORMATIVE, LEGAL, PLATFORM, STANDARD, HEURISTIC, BEST_PRACTICE, METRIC |
| `platforms` | list | yes | One or more of: web, pwa, ios, android, desktop, all |
| `jurisdictions` | list | yes | ISO 3166-1 alpha-2 codes, `EU`, or `GLOBAL`. LEGAL rules must not use GLOBAL |
| `category` | enum | yes | accessibility, visual_design, layout_responsive, navigation_ia, forms, components, states_feedback, content_cognition, performance_ux, platform_ux, trust_privacy, i18n_l10n (maps to `prd.md` §10.1–§10.12) |
| `subcategory` | string | yes | An item from the `prd.md` §10 list of the chosen `category`, kebab-case (for example `touch-target`). When an item appears in several §10 lists, use `accessibility` for NORMATIVE and LEGAL accessibility criteria and otherwise the most specific list (`forms` over `accessibility`, `components` over `visual_design`); record the choice in `notes` |
| `conformance_level` | enum or null | yes | A, AA, AAA, or null when the source has no levels |
| `normative_strength` | enum | yes | MUST, SHOULD, MAY, INFORMATIVE (the source's own force, mapped to these four) |
| `description` | string | yes | What the rule requires, paraphrased, one requirement only |
| `rationale` | string | yes | Why it matters, including who is affected |
| `applicability` | string | yes | When the rule applies (content types, components, contexts) |
| `exceptions` | list | yes | May be empty. Each exception paraphrased from the source |
| `testability` | object | yes | `automated`, `visual`, `manual`, each one of FULL, PARTIAL, NONE (§5) |
| `expected_evidence` | list | yes | Evidence types from `docs/finding-schema.md` §7 that a PASS or FAIL must carry |
| `severity_hint` | enum | yes | Critical, High, Medium, Low, Informational: default severity of a FAIL before context adjustment |
| `related_rules` | list | yes | May be empty. Items `{ id, relation }` with relation one of equivalent, narrower, broader, overlaps, see_also (§6) |
| `status` | enum | yes | ACTIVE, RETIRED |
| `notes` | string | no | Techniques, measurement details, licensing caveats, known ambiguities |

Constraints enforced by the future validator:

- `source` must exist in `research/sources.md` with `research_status: VERIFIED`.
- `rule_class` must be consistent with the source tier (`docs/standards-research-plan.md` §3): NORMATIVE and LEGAL require T1; PLATFORM, STANDARD, METRIC require T1 or T2; HEURISTIC requires T1–T3; BEST_PRACTICE requires T1–T3, or T4 only when `notes` records that no higher-tier source exists.
- `conformance_level` is non-null only for sources that define levels.
- `related_rules` targets must exist; `equivalent` must be symmetric.
- A rule with `testability.automated: NONE` and `testability.visual: NONE` must have `testability.manual` other than NONE.

## 5. Testability

| Value | Meaning |
|---|---|
| FULL | The check can be decided by this method alone with high confidence |
| PARTIAL | This method can detect some failures or narrow the question but cannot decide all cases |
| NONE | This method contributes nothing to the check |

`automated` means deterministic tooling over machine truth (DOM, accessibility tree, computed styles, metrics). `visual` means inspection of rendered output or screenshots. `manual` means human or agent judgment with interaction (keyboard traversal, screen-reader reasoning, task walk-through). The PRD example values `true`/`false` map to FULL/NONE.

## 6. Crosswalk relations

Standards overlap (WCAG, EN 301 549, Section 508, KWCAG, platform guidelines). The registry keeps one record per source requirement and expresses overlap through `related_rules` instead of merging records, so authority and jurisdiction stay visible.

| Relation | Meaning |
|---|---|
| equivalent | Same requirement, different authority (for example a harmonized standard incorporating a criterion by reference) |
| narrower | The related rule is a stricter or more specific subset |
| broader | The related rule is a superset or more general principle |
| overlaps | Partial overlap; a fix for one may not satisfy the other |
| see_also | Explanatory or contextual relationship |

The Standards Auditor evaluates each applicable record once and uses `equivalent` links to avoid duplicate findings while still listing every violated authority.

## 7. Normalization methodology (Phase 2)

1. Start from a VERIFIED source note's candidate rules (`docs/standards-research-plan.md` §8).
2. One requirement per record. Split compound clauses; keep the source identifier on each.
3. Preserve public identifiers in the ID and the deep link in `source_url`.
4. Paraphrase the requirement and each exception in this project's words. No verbatim criterion text.
5. Assign `rule_class` from authority and force, not from topic: a WCAG success criterion is NORMATIVE; a law citing it is LEGAL with an `equivalent` link; a platform guideline is PLATFORM even when it repeats a WCAG threshold.
6. Assign `normative_strength` from the source's own wording (must/shall → MUST, should → SHOULD, may → MAY, examples and explanations → INFORMATIVE).
7. Decide testability per method and list the evidence a check must produce.
8. Set `severity_hint` from impact class: blocks a task or excludes a user group → Critical or High; degrades but has a workaround → Medium; polish or informational → Low or Informational.
9. Add crosswalk links to existing records; never duplicate a record to cover a second authority.
10. Validate, then have the research reviewer check a sample against the source.

## 8. Prefix registry

Every prefix maps to one source ID. `n/a` means the source is recorded per rule (project-formulated best practices cite their supporting source in `source`).

| prefix | source_id | example id |
|---|---|---|
| WCAG | SRC-W3C-WCAG22 | WCAG-2.5.8 |
| ARIA | SRC-W3C-ARIA12 | ARIA-role-button-001 |
| HTMLARIA | SRC-W3C-HTML-ARIA | HTMLARIA-allowed-role-001 |
| APG | SRC-W3C-APG | APG-dialog-modal-001 |
| COGA | SRC-W3C-COGA | COGA-objective-1-001 |
| WCAG2ICT | SRC-W3C-WCAG2ICT | WCAG2ICT-2.5.8 |
| KWCAG | SRC-KR-KWCAG22 | KWCAG-5.1.1 |
| KRMOBILE | SRC-KR-MOBILE-A11Y | KRMOBILE-1.1 |
| HIG | SRC-APPLE-HIG | HIG-buttons-001 |
| APPLEA11Y | SRC-APPLE-A11Y | APPLEA11Y-dynamic-type-001 |
| ANDROIDA11Y | SRC-GOOGLE-ANDROID-A11Y | ANDROIDA11Y-touch-target-001 |
| MD | SRC-GOOGLE-MATERIAL3 | MD-typography-001 |
| PWA | SRC-W3C-APPMANIFEST | PWA-manifest-001 |
| ISO9241-11 | SRC-ISO-9241-11 | ISO9241-11-usability-001 |
| ISO9241-110 | SRC-ISO-9241-110 | ISO9241-110-4.2 |
| ISO9241-112 | SRC-ISO-9241-112 | ISO9241-112-5.1 |
| ISO9241-125 | SRC-ISO-9241-125 | ISO9241-125-5.1 |
| ISO9241-161 | SRC-ISO-9241-161 | ISO9241-161-5.1 |
| ISO9241-171 | SRC-ISO-9241-171 | ISO9241-171-8.1 |
| ISO9241-210 | SRC-ISO-9241-210 | ISO9241-210-4.1 |
| EN301549 | SRC-ETSI-EN301549 | EN301549-9.2.5.8 |
| S508 | SRC-USAB-SECTION508 | S508-E205.4 |
| ADA | SRC-DOJ-ADA-TITLE2 | ADA-35.200-001 |
| EAA | SRC-EU-EAA | EAA-annex-1-001 |
| WAD | SRC-EU-WAD | WAD-art-4-001 |
| KRLAW | SRC-KR-DISABILITY-ACT | KRLAW-art-21-001 |
| NNG | SRC-NNG-HEURISTICS | NNG-H01 |
| GOVUK | SRC-GOVUK-DESIGN-SYSTEM | GOVUK-forms-001 |
| CWV | SRC-GOOGLE-WEB-VITALS | CWV-lcp-001 |
| I18N | SRC-W3C-I18N | I18N-bidi-001 |
| GDPR | SRC-EU-GDPR | GDPR-art-7-001 |
| EDPB | SRC-EDPB-DECEPTIVE | EDPB-overloading-001 |
| FTC | SRC-FTC-DARK-PATTERNS | FTC-confirmshaming-001 |
| FITTS | SRC-FITTS-1954 | FITTS-target-acquisition-001 |
| HICK | SRC-HICK-1952 | HICK-choice-load-001 |
| MILLER | SRC-MILLER-1956 | MILLER-memory-load-001 |
| MURDOCK | SRC-MURDOCK-1962 | MURDOCK-order-001 |
| KIVETZ | SRC-KIVETZ-2006 | KIVETZ-progress-001 |
| HUNT | SRC-HUNT-1995 | HUNT-isolation-001 |
| WAGEMANS | SRC-WAGEMANS-2012 | WAGEMANS-grouping-001 |
| CLDR | SRC-UNICODE-UTS35 | CLDR-date-format-001 |
| BP | n/a | BP-forms-001 |

Example identifiers illustrate the format only; the identifiers themselves are unverified until Phase 2. Interaction laws (Fitts, Hick, and others) receive a prefix only when their primary papers are registered as sources; a T4 index such as SRC-LAWSOFUX-INDEX never anchors a prefix.

## 9. Illustrative record (not a registry entry)

The following shows the shape of a record. Its factual content has not been verified in this repository and must not be copied into the registry without following the research protocol.

```yaml
- id: WCAG-2.5.8
  title: Target size minimum
  authority: W3C
  source: SRC-W3C-WCAG22
  source_url: https://www.w3.org/TR/WCAG22/#target-size-minimum
  source_version: "2.2"
  source_status: CURRENT
  last_verified: null            # illustrative; a real record needs a date
  rule_class: NORMATIVE
  platforms: [web, pwa]
  jurisdictions: [GLOBAL]
  category: accessibility
  subcategory: touch-target
  conformance_level: AA
  normative_strength: MUST
  description: Pointer targets meet a minimum size unless an exception applies.
  rationale: Small targets are hard to activate for people with limited fine motor control and on touch devices.
  applicability: Any interactive target activated by pointer input.
  exceptions: []                 # to be paraphrased from the source in Phase 2
  testability: { automated: PARTIAL, visual: FULL, manual: FULL }
  expected_evidence: [bounding_box, screenshot, dom_locator]
  severity_hint: High
  related_rules: []
  status: ACTIVE
  notes: Illustrative only.
```
