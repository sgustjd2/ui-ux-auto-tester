# Phase 1 Exit Report — Standards corpus research

- Phase: 1 (standards corpus research), `prd.md` §18
- Ran: 2026-09-02 to 2026-09-23 (ten sessions; session log in `research/ledger.md`)
- Report date: 2026-09-23
- Verdict: **Phase 1 complete.** Every domain in `docs/standards-coverage.md` is COVERED, BLOCKED with a recorded reason, or DEFERRED by user decision with a gap ID, which is the exit condition in `docs/standards-research-plan.md` §1.

This report is a phase-gate record. It restates counts as of its date; the live numbers stay in `research/ledger.md` (status board), `research/sources.md`, and `docs/standards-coverage.md`.

## 1. Exit criteria (`prd.md` §18, Phase 1)

| Criterion | Evidence | Met |
|---|---|---|
| Every major required standards family has been researched | Section 3 maps each family named in `prd.md` §6.3 to verified sources; the only unresearched family is ISO 9241, BLOCKED for lack of access (paid standard, GAP-004) | Yes, with ISO 9241 blocked |
| Source authority and version are recorded | Every VERIFIED row in `research/sources.md` carries authority, canonical URL, version or date, status, license, and `last_checked`; `node scripts/check-harness.mjs` enforces the URL, version, status, license, date, and a note per VERIFIED source, and the authority column is filled on every row | Yes |
| No unsupported "standard says" claims remain | Every note written in sessions 1 to 10 went through an independent research-reviewer pass against the canonical sources (verdicts and fixes in the ledger session log), except the seven ISO notes, which hold public metadata only; no CANDIDATE rows remain | Yes |

## 2. Deliverables (`prd.md` §18, Phase 1)

| Deliverable | Where |
|---|---|
| Source inventory | `research/sources.md` (one row per source) |
| Versioned standards registry | `research/sources.md` version, status, and `last_checked` columns; supersession recorded row to row (for example EN 301 549 V3.2.1 to V4.1.1) |
| Coverage matrix | `docs/standards-coverage.md` |
| Official-source citations | `research/notes/<source_id>.md`, one per source, citing canonical URLs and clause or criterion identifiers |
| Gaps and unresolved questions | `research/gaps.md` |
| Initial rule taxonomy | `docs/rule-schema.md` (rule classes, categories mapped to `prd.md` §10, prefix registry) plus the candidate rules listed in each note |

## 3. Required families (`prd.md` §6.3) against the corpus

| Family | Sources | Status |
|---|---|---|
| WCAG 2.2 | SRC-W3C-WCAG22, SRC-W3C-WCAG22-UNDERSTANDING, SRC-W3C-ACT-FORMAT, SRC-W3C-ACT-RULES | COVERED |
| WAI-ARIA | SRC-W3C-ARIA12, SRC-W3C-HTML-ARIA, SRC-W3C-ACCNAME | COVERED |
| ARIA Authoring Practices Guide | SRC-W3C-APG | COVERED |
| W3C cognitive accessibility guidance | SRC-W3C-COGA | COVERED |
| KWCAG 2.2 | SRC-KR-KWCAG22 | COVERED |
| Korean mobile accessibility guidance | SRC-KR-MOBILE-A11Y | COVERED |
| WCAG2ICT | SRC-W3C-WCAG2ICT | COVERED |
| Mobile application of WCAG guidance | SRC-W3C-WCAG2ICT, SRC-APPLE-A11Y, SRC-GOOGLE-ANDROID-A11Y (the W3C 2015 mobile draft was rejected, GAP-024) | COVERED |
| Apple Human Interface Guidelines | SRC-APPLE-HIG | COVERED |
| Apple accessibility guidance | SRC-APPLE-A11Y | COVERED |
| Android accessibility guidance | SRC-GOOGLE-ANDROID-A11Y (Android app quality, SRC-GOOGLE-ANDROID-QUALITY, serves the form-factor domains) | COVERED |
| Material Design guidance | SRC-GOOGLE-MATERIAL3 | COVERED |
| ISO 9241 family | seven parts, metadata only | BLOCKED (GAP-004) |
| EN 301 549 | SRC-ETSI-EN301549 (V3.2.1, OJ-cited), SRC-ETSI-EN301549-V4 (V4.1.1, not yet cited) | COVERED |
| Section 508 | SRC-USAB-SECTION508 | COVERED |
| ADA digital accessibility rules | SRC-DOJ-ADA-TITLE2, SRC-DOJ-ADA-GUIDANCE | COVERED |
| European Accessibility Act context | SRC-EU-EAA, SRC-EU-WAD | COVERED |
| Core Web Vitals | SRC-GOOGLE-WEB-VITALS | COVERED |
| Platform and browser conventions | SRC-WHATWG-HTML, SRC-MDN-WEB, SRC-MDN-RESPONSIVE, SRC-W3C-APPMANIFEST, SRC-MDN-PWA, SRC-WEBDEV-PWA | COVERED |

Beyond the required list, Phase 1 also covered the `prd.md` §7.3 heuristic families and §10 taxonomy: Nielsen heuristics and NN/g research, interaction laws with primary papers, GOV.UK and KRDS design systems, Korean law (Disability Discrimination Act, Digital Inclusion Act, E-Commerce Act, PIPA), privacy and deceptive-design sources (GDPR, EDPB, DSA, FTC), internationalization (W3C i18n, klreq, Unicode locale data), and Korean content sources (NIKL, Toss).

## 4. Counts at exit

| Measure | At exit (2026-09-23) |
|---|---|
| Source rows | 68: 60 VERIFIED, 7 BLOCKED (ISO 9241 parts), 1 REJECTED (W3C 2015 mobile mapping draft), 0 CANDIDATE |
| Verified sources by tier | T1 24, T2 24, T3 10, T4 2 |
| Source status | 63 CURRENT, 4 DRAFT (App Manifest, WCAG 3.0, klreq, and the rejected mobile draft), 1 SUPERSEDED (EN 301 549 V3.2.1, still OJ-cited) |
| Research notes | 68, one per source |
| Domains | 72: 70 COVERED, 1 BLOCKED (STD-ISO-9241), 1 DEFERRED (LEGAL-OTHER); normalization NOT_STARTED everywhere |
| Gaps | GAP-001 to GAP-063; open, deferred, and resolved counts are in `research/gaps.md` |
| Rule prefixes registered | see `docs/rule-schema.md` §8 |

## 5. Not covered, and why

- **STD-ISO-9241 (BLOCKED):** all seven parts are paid ISO standards and no access was provided (GAP-004). Only public metadata is recorded. The licensed-source workflow is defined in GAP-004's resolution; revisit if the user provides access.
- **LEGAL-OTHER (DEFERRED):** jurisdictions beyond the US, EU, and Korea are added only by user decision (GAP-023).
- **Watch-only drafts:** WCAG 3.0 (Working Draft) is registered with no domain and yields no rules (ADR 0007, GAP-036). Draft companions (WAI-ARIA 1.3, Accname 1.2, HTML-AAM, Core-AAM) are tracked in GAP-030 and GAP-037.

## 6. Carried into Phase 2

Phase 2 (rule normalization) starts from the candidate rules in the notes. Open items that shape it, grouped (full text in `research/gaps.md`):

- **Schema decisions (Phase 2, ADR required):** record serialization and validator dependency (GAP-002); linked test procedures such as ACT rule IDs and engine rule IDs (GAP-040); a platform value or applicability field for super-app mini-app platforms (GAP-044); prefixes, identifier formats, and strength rules for T2 regulator guidance (GAP-045).
- **Anchors to register before normalizing the affected rules:** ePrivacy Directive, UCPD, Korean enforcement decrees and KFTC guideline, PIPC notice (GAP-046); Android behavior changes (GAP-047); W3C performance specifications and CWV bands (GAP-041); WCAG 2.0 and 2.1 for laws that cite them (GAP-027); ARIA in HTML companions and AAMs as needed (GAP-037).
- **Extraction reads owed:** section-level reads listed in GAP-050, GAP-061, and GAP-063; full texts of the interaction-law papers, read so far at abstract level (GAP-062(b)); raw XML for Korean statutes through the law.go.kr open API (GAP-033, GAP-048).
- **Decisions the user owns:** METRIC breaches reported as UX_RISK (GAP-001); PLATFORM and STANDARD MUST rules as VIOLATION sources (GAP-026); whether independent paraphrases under the W3C Document License may be distributed (GAP-029); default jurisdictions (GAP-010); `prd.md` subcategories for nagging, recommender controls, and ad transparency (GAP-059).
- **Re-verification triggers:** sources older than 180 days, new versions (EN 301 549 OJ citation, GAP-039; WCAG 2.2 errata, GAP-028; CLDR 49 release, SRC-UNICODE-UTS35; PIPA Act 21910 on 9 March 2027, GAP-061), and before packaging (`docs/standards-research-plan.md` §5).

## 7. Review record

Independent research-reviewer passes (`.claude/agents/research-reviewer.md`) ran after every research session except session 7 (ISO access decision, metadata only). Session 9 used three parallel reviewers over every note and row added or changed that day; session 10 reviewed the final additions, including the NIKL note added late in session 9. No note was rejected in any pass; every ACCEPT_WITH_FIXES finding was applied and logged.

## 8. Recommended first Phase 2 actions

1. Decide GAP-002 (YAML with a small dependency by ADR, or JSON records) and write the registry validator.
2. Normalize WCAG 2.2 first (the anchor most other sources crosswalk to), with ACT rule links per GAP-040.
3. Register the GAP-046 anchors before normalizing consent and deceptive-design rules.
4. Get user answers on GAP-001, GAP-026, and GAP-029 before VIOLATION-producing rules are finalized.
