# Standards Coverage Matrix

Status: Phase 1 in progress (started 2026-09-02). Rows advance only through the protocol in `docs/standards-research-plan.md`; LEGAL-OTHER is DEFERRED by user decision. Vocabulary and the rules for advancing a row: `docs/standards-research-plan.md` §6 and §12. Source IDs refer to `research/sources.md`; a source counts toward coverage only when its row there is VERIFIED.

Rules enforced by `scripts/check-harness.mjs`:

- `source_ids` must exist in `research/sources.md`, and the `domains` column there must mirror this file.
- `research_status` COVERED or PARTIAL requires at least one listed source with `research_status: VERIFIED`; COVERED requires all of them.
- `normalization_status` may leave NOT_STARTED only when `research_status` is PARTIAL or COVERED.
- BLOCKED, PARTIAL, and DEFERRED rows need a reason in `notes` (DEFERRED also needs a gap ID).
- Cells must not contain the `|` character; a wrong cell count fails the check.

## Accessibility

| domain_id | domain | source_ids | research_status | normalization_status | notes |
|---|---|---|---|---|---|
| A11Y-WCAG22 | WCAG 2.2 | SRC-W3C-WCAG22, SRC-W3C-WCAG22-UNDERSTANDING, SRC-W3C-ACT-FORMAT, SRC-W3C-ACT-RULES | COVERED | NOT_STARTED | Verified 2026-09-02; research reviewer accepted both notes with fixes, applied. The Understanding companion is informative and yields no candidate rules by design. 2026-09-23: ACT Rules Format 1.1 (REC 5 February 2026) and the WAI ACT rule list added as test-procedure companions (testability and fixtures, no new requirements). WCAG 3.0 is a Working Draft (10 September 2026) registered watch-only (SRC-W3C-WCAG3, no domain) |
| A11Y-ARIA | WAI-ARIA | SRC-W3C-ARIA12, SRC-W3C-HTML-ARIA, SRC-W3C-ACCNAME | COVERED | NOT_STARTED | Verified 2026-09-02: WAI-ARIA 1.2 Recommendation (6 June 2023); 1.2 is the latest Recommendation, 1.3 is a published Working Draft. Candidate rules are author-conformance requirements plus the roles/attributes ontology. 2026-09-23: ARIA in HTML (REC, revision 11 August 2026) and Accname 1.1 (REC 2018; 1.2 WD 22 September 2026) added (GAP-031 resolved) |
| A11Y-APG | ARIA Authoring Practices Guide | SRC-W3C-APG | COVERED | NOT_STARTED | Verified 2026-09-02: informative WAI guide, 30 patterns; yields BEST_PRACTICE component rules that defer to ARIA and WCAG |
| A11Y-COGA | Cognitive accessibility guidance | SRC-W3C-COGA | COVERED | NOT_STARTED | Verified 2026-09-02: W3C Working Group Note (29 April 2021); 8 objectives yield BEST_PRACTICE cognitive-accessibility rule families |
| A11Y-WCAG2ICT | WCAG2ICT | SRC-W3C-WCAG2ICT | COVERED | NOT_STARTED | Verified 2026-09-02: W3C Group Note (11 December 2025); applies WCAG A/AA to non-web documents and software; informs WCAG rule platform applicability, yields no new rules |
| A11Y-MOBILE-WCAG | Mobile WCAG guidance | SRC-W3C-WCAG2ICT, SRC-APPLE-A11Y, SRC-GOOGLE-ANDROID-A11Y | COVERED | NOT_STARTED | Verified 2026-09-02: WCAG2ICT (non-web application) plus Apple and Android accessibility. GAP-024 resolved earlier |
| A11Y-KWCAG | KWCAG | SRC-KR-KWCAG22 | COVERED | NOT_STARTED | Verified 2026-09-02 from the standard PDF: KS X OT0003:2022 (revised 28 December 2022); 4 principles, 14 guidelines, 33 checkpoints. GAP-005 resolved |
| A11Y-KR-MOBILE | Korean mobile accessibility guidance | SRC-KR-MOBILE-A11Y | COVERED | NOT_STARTED | Verified 2026-09-02 from the standard PDF: KS X 3253:2016 (mobile 2.0, established 20 October 2016); 19 checkpoints. GAP-006 resolved |

## Platform

| domain_id | domain | source_ids | research_status | normalization_status | notes |
|---|---|---|---|---|---|
| PLAT-WEB | Web conventions | SRC-WHATWG-HTML, SRC-MDN-WEB | COVERED | NOT_STARTED | Verified 2026-09-02: HTML Living Standard (semantics) plus MDN (conventions) |
| PLAT-APPLE-HIG | Apple Human Interface Guidelines | SRC-APPLE-HIG | COVERED | NOT_STARTED | Verified 2026-09-02 (browser-rendered); Foundations/Patterns/Components/Inputs/Technologies |
| PLAT-APPLE-A11Y | Apple accessibility | SRC-APPLE-A11Y | COVERED | NOT_STARTED | Verified 2026-09-02 (browser-rendered): Dynamic Type, WCAG AA contrast, Accessibility Inspector |
| PLAT-ANDROID-A11Y | Android accessibility | SRC-GOOGLE-ANDROID-A11Y | COVERED | NOT_STARTED | Verified 2026-09-02 (updated 2026-04-22): labels, touch targets, contrast, focus |
| PLAT-MATERIAL | Material Design | SRC-GOOGLE-MATERIAL3 | COVERED | NOT_STARTED | Verified 2026-09-02 (browser-rendered): Material Design 3; M3 Expressive design language (introduced at Google I/O 2025) |
| PLAT-PWA | PWA conventions | SRC-W3C-APPMANIFEST, SRC-MDN-PWA, SRC-WEBDEV-PWA | COVERED | NOT_STARTED | Verified 2026-09-02: App Manifest (WD), MDN PWA, web.dev Learn PWA. Service Worker spec not yet registered |
| PLAT-FORM-FACTORS | Mobile, tablet, desktop interaction conventions | SRC-APPLE-HIG, SRC-GOOGLE-MATERIAL3, SRC-MDN-WEB, SRC-GOOGLE-ANDROID-QUALITY | COVERED | NOT_STARTED | Verified 2026-09-02: HIG, Material 3, and MDN cover the form factors. 2026-09-23: Android app quality checklists (adaptive tiers for foldables, tablets, desktop windowing) added; HIG gained iPhone Duo foldable guidance (9 September 2026) |

## Standard and legal

| domain_id | domain | source_ids | research_status | normalization_status | notes |
|---|---|---|---|---|---|
| STD-ISO-9241 | ISO 9241 family | SRC-ISO-9241-11, SRC-ISO-9241-110, SRC-ISO-9241-112, SRC-ISO-9241-125, SRC-ISO-9241-161, SRC-ISO-9241-171, SRC-ISO-9241-210 | BLOCKED | NOT_STARTED | BLOCKED 2026-09-02 (GAP-004): all seven parts are paid ISO standards with no access this session; editions/titles recorded from the ISO catalogue via web search, normative text not obtained. Revisit if ISO access is provided |
| LEGAL-EN-301-549 | EN 301 549 | SRC-ETSI-EN301549, SRC-ETSI-EN301549-V4 | COVERED | NOT_STARTED | Verified 2026-09-02: V3.2.1 (2021-03), WCAG 2.1 A/AA in ch 9-11 plus non-web/hardware requirements. 2026-09-23: V4.1.1 (2026-09) published, WCAG 2.2 aligned, EAA and WAD annexes, not yet OJ-cited; V3.2.1 stays the cited WAD standard until citation (GAP-039) |
| LEGAL-SECTION-508 | Section 508 | SRC-USAB-SECTION508 | COVERED | NOT_STARTED | Verified 2026-09-02: Revised 508 Standards (36 CFR 1194), WCAG 2.0 A/AA, effective 2017 |
| LEGAL-ADA | ADA digital accessibility | SRC-DOJ-ADA-TITLE2, SRC-DOJ-ADA-GUIDANCE | COVERED | NOT_STARTED | Verified 2026-09-02 (GAP-007 resolved): Title II rule adopts WCAG 2.1 AA for state/local gov (dates 2027/2028 after the 2026 IFR); Title III has DOJ guidance but no mandated standard |
| LEGAL-EU | European accessibility requirements | SRC-EU-EAA, SRC-EU-WAD | COVERED | NOT_STARTED | Verified 2026-09-02: EAA (2019/882, applies 28 June 2025) and WAD (2016/2102, public sector, EN 301 549 -> WCAG 2.1 AA) |
| LEGAL-KR | Korean accessibility requirements | SRC-KR-DISABILITY-ACT, SRC-KR-INTELLIGENT-INFO-ACT, SRC-KR-DIGITAL-INCLUSION-ACT | COVERED | NOT_STARTED | Verified 2026-09-02: Disability Discrimination Act (Articles 20-21) mandates accessible websites; the Framework Act accessibility Articles 46, 46-2, 47 were deleted effective 22 January 2026 (promulgated 21 January 2025) and the mandate moved to the Digital Inclusion Act. Binding article text at law.go.kr not read this session (access gap); KLRI translation and korea.kr used |
| LEGAL-OTHER | Other jurisdictions | none | DEFERRED | NOT_STARTED | Deferred by user decision; jurisdictions are added deliberately later (GAP-023) |

## UX and interaction

| domain_id | domain | source_ids | research_status | normalization_status | notes |
|---|---|---|---|---|---|
| UX-NIELSEN | Nielsen usability heuristics | SRC-NNG-HEURISTICS | COVERED | NOT_STARTED | Verified 2026-09-02: the ten usability heuristics (HEURISTIC rules, UX_RISK) |
| UX-IA | Information architecture | SRC-NNG-ARTICLES | COVERED | NOT_STARTED | Verified 2026-09-02: NN/g IA research |
| UX-DISCOVERABILITY | Discoverability | SRC-NNG-ARTICLES | COVERED | NOT_STARTED | Verified 2026-09-02: NN/g |
| UX-AFFORDANCE | Affordance and signifiers | SRC-NNG-ARTICLES | COVERED | NOT_STARTED | Verified 2026-09-02: NN/g |
| UX-FEEDBACK | Feedback | SRC-NNG-ARTICLES | COVERED | NOT_STARTED | Verified 2026-09-02: NN/g. ISO 9241-110 also addresses feedback but is BLOCKED (GAP-004); the free source covers this domain |
| UX-CONSISTENCY | Consistency | SRC-NNG-HEURISTICS | COVERED | NOT_STARTED | Verified 2026-09-02: heuristic 4. ISO 9241-110 also addresses consistency but is BLOCKED (GAP-004) |
| UX-RECOGNITION-RECALL | Recognition vs recall | SRC-NNG-HEURISTICS | COVERED | NOT_STARTED | Verified 2026-09-02: heuristic 6 |
| UX-COGNITIVE-LOAD | Cognitive load | SRC-NNG-ARTICLES, SRC-W3C-COGA | COVERED | NOT_STARTED | Verified 2026-09-02: NN/g plus COGA |
| UX-ERROR-PREVENTION | Error prevention | SRC-NNG-HEURISTICS | COVERED | NOT_STARTED | Verified 2026-09-02: heuristic 5. ISO 9241-110 also addresses use-error robustness but is BLOCKED (GAP-004) |
| UX-USER-CONTROL | User control | SRC-NNG-HEURISTICS | COVERED | NOT_STARTED | Verified 2026-09-02: heuristic 3. ISO 9241-110 also addresses controllability but is BLOCKED (GAP-004) |
| UX-PROGRESSIVE-DISCLOSURE | Progressive disclosure | SRC-NNG-ARTICLES | COVERED | NOT_STARTED | Verified 2026-09-02: NN/g |
| UX-INTERACTION-LAWS | Interaction principles and laws | SRC-LAWSOFUX-INDEX | PARTIAL | NOT_STARTED | Laws of UX (T4 discovery index) verified 2026-09-02; per-law primary papers (T3) owed to anchor rules (GAP-035). A T4 index cannot anchor rules alone |
| UX-FORMS | Form UX | SRC-GOVUK-DESIGN-SYSTEM, SRC-NNG-ARTICLES, SRC-KR-KRDS | COVERED | NOT_STARTED | Verified 2026-09-02: GOV.UK forms patterns plus NN/g 2026-09-23: KRDS (Korean government design system, 2025.08 guideline) added for Korean public-sector services. |
| UX-NAVIGATION | Navigation UX | SRC-NNG-ARTICLES, SRC-KR-KRDS | COVERED | NOT_STARTED | Verified 2026-09-02: NN/g 2026-09-23: KRDS (Korean government design system, 2025.08 guideline) added for Korean public-sector services. |
| UX-SEARCH | Search UX | SRC-NNG-ARTICLES, SRC-KR-KRDS | COVERED | NOT_STARTED | Verified 2026-09-02: NN/g 2026-09-23: KRDS (Korean government design system, 2025.08 guideline) added for Korean public-sector services. |
| UX-ONBOARDING | Onboarding | SRC-NNG-ARTICLES | COVERED | NOT_STARTED | Verified 2026-09-02: NN/g |
| UX-CONTENT-MICROCOPY | Content and microcopy | SRC-GOVUK-DESIGN-SYSTEM, SRC-NNG-ARTICLES, SRC-TOSS-TECH-BLOG, SRC-TOSS-APPS-IN-TOSS, SRC-KR-NIKL-PUBLIC-LANGUAGE | COVERED | NOT_STARTED | Verified 2026-09-02: GOV.UK content patterns plus NN/g. 2026-09-23: Korean plain-language anchor (National Institute of Korean Language public-language guide, T2) and Korean microcopy practice from Toss (tech blog T4; Apps in Toss writing rules, T2 on that platform only) |
| UX-STATES | Empty, loading, error, success states | SRC-NNG-ARTICLES, SRC-GOOGLE-MATERIAL3 | COVERED | NOT_STARTED | Verified 2026-09-02: NN/g plus Material component states |
| UX-MAPPING | Mapping between controls and effects | SRC-NNG-ARTICLES | COVERED | NOT_STARTED | Verified 2026-09-02: NN/g |
| UX-HELP | Help and documentation | SRC-NNG-HEURISTICS, SRC-NNG-ARTICLES | COVERED | NOT_STARTED | Verified 2026-09-02: heuristic 10 plus NN/g |
| UX-DESTRUCTIVE-ACTIONS | Destructive actions and confirmation | SRC-NNG-ARTICLES, SRC-APPLE-HIG, SRC-GOOGLE-MATERIAL3 | COVERED | NOT_STARTED | Verified 2026-09-02: NN/g plus HIG and Material confirmation/alert patterns |
| UX-COMPONENTS | Component patterns | SRC-W3C-APG, SRC-GOOGLE-MATERIAL3, SRC-APPLE-HIG, SRC-KR-KRDS | COVERED | NOT_STARTED | Verified 2026-09-02: ARIA APG (semantics/keyboard), Material, and HIG components. One row for the prd.md 10.6 list; split per family in Phase 2 if needed 2026-09-23: KRDS (Korean government design system, 2025.08 guideline) added for Korean public-sector services. |

## Visual and responsive

| domain_id | domain | source_ids | research_status | normalization_status | notes |
|---|---|---|---|---|---|
| VIS-TYPOGRAPHY | Typography | SRC-GOOGLE-MATERIAL3, SRC-APPLE-HIG, SRC-W3C-WCAG22, SRC-KR-KRDS | COVERED | NOT_STARTED | Verified 2026-09-02: Material and HIG type systems plus WCAG text criteria 2026-09-23: KRDS (Korean government design system, 2025.08 guideline) added for Korean public-sector services. |
| VIS-HIERARCHY | Visual hierarchy | SRC-NNG-ARTICLES | COVERED | NOT_STARTED | Verified 2026-09-02: NN/g visual-hierarchy research |
| VIS-SPACING | Spacing | SRC-GOOGLE-MATERIAL3, SRC-APPLE-HIG | COVERED | NOT_STARTED | Verified 2026-09-02: Material and HIG spacing/layout |
| VIS-ALIGNMENT | Alignment | SRC-GOOGLE-MATERIAL3 | COVERED | NOT_STARTED | Verified 2026-09-02: Material layout/grid |
| VIS-GRID | Grid | SRC-GOOGLE-MATERIAL3 | COVERED | NOT_STARTED | Verified 2026-09-02: Material layout grid |
| VIS-COLOR | Color | SRC-GOOGLE-MATERIAL3, SRC-APPLE-HIG, SRC-KR-KRDS | COVERED | NOT_STARTED | Verified 2026-09-02: Material and HIG color systems 2026-09-23: KRDS (Korean government design system, 2025.08 guideline) added for Korean public-sector services. |
| VIS-CONTRAST | Contrast | SRC-W3C-WCAG22 | COVERED | NOT_STARTED | Sole source verified 2026-09-02; candidate rules 1.4.1, 1.4.3, 1.4.6, 1.4.11, 2.4.13 |
| VIS-ICONS | Icons | SRC-GOOGLE-MATERIAL3, SRC-APPLE-HIG | COVERED | NOT_STARTED | Verified 2026-09-02: Material and HIG iconography |
| VIS-IMAGERY | Imagery | SRC-GOOGLE-MATERIAL3, SRC-W3C-WCAG22 | COVERED | NOT_STARTED | Verified 2026-09-02: Material imagery guidance plus WCAG image criteria |
| VIS-DENSITY | Density | SRC-GOOGLE-MATERIAL3 | COVERED | NOT_STARTED | Verified 2026-09-02: Material density guidance |
| VIS-RESPONSIVE | Responsive layout | SRC-MDN-RESPONSIVE, SRC-W3C-WCAG22 | COVERED | NOT_STARTED | Verified 2026-09-02: MDN responsive guide plus WCAG 1.4.10 Reflow |
| VIS-ADAPTIVE | Adaptive layout | SRC-GOOGLE-MATERIAL3, SRC-APPLE-HIG, SRC-GOOGLE-ANDROID-QUALITY | COVERED | NOT_STARTED | Verified 2026-09-02: Material and HIG adaptive layout. 2026-09-23: Android adaptive app quality tiers added |
| VIS-ZOOM | Zoom | SRC-W3C-WCAG22 | COVERED | NOT_STARTED | Sole source verified 2026-09-02; candidate rules 1.4.4, 1.4.8, 1.4.10 |
| VIS-ORIENTATION | Orientation | SRC-W3C-WCAG22, SRC-APPLE-HIG, SRC-GOOGLE-ANDROID-QUALITY | COVERED | NOT_STARTED | Verified 2026-09-02: WCAG 1.3.4 plus HIG layout/orientation. 2026-09-23: Android quality items on orientation and configuration changes added |
| VIS-SAFE-AREAS | Safe areas | SRC-APPLE-HIG, SRC-MDN-WEB | COVERED | NOT_STARTED | Verified 2026-09-02: HIG safe areas plus MDN env()/viewport-fit |
| VIS-TEXT-SCALING | Text scaling | SRC-APPLE-A11Y, SRC-GOOGLE-ANDROID-A11Y, SRC-W3C-WCAG22 | COVERED | NOT_STARTED | Verified 2026-09-02: Dynamic Type, Android font scaling, WCAG 1.4.4/1.4.10 |

## Other UX domains

| domain_id | domain | source_ids | research_status | normalization_status | notes |
|---|---|---|---|---|---|
| OTH-PERF-UX | Performance UX | SRC-GOOGLE-WEB-VITALS, SRC-NNG-ARTICLES | COVERED | NOT_STARTED | NN/g verified 2026-09-02; Web Vitals verified 2026-09-23 (METRIC thresholds plus perceived-performance research) |
| OTH-CWV | Core Web Vitals | SRC-GOOGLE-WEB-VITALS | COVERED | NOT_STARTED | Verified 2026-09-23: LCP, INP, CLS Stable; thresholds 2.5 s, 200 ms, 0.1 at p75. METRIC class, reported as UX_RISK (GAP-001). Lab-only runs yield PARTIAL |
| OTH-PERCEIVED-PERF | Perceived performance | SRC-NNG-ARTICLES | COVERED | NOT_STARTED | Verified 2026-09-02: NN/g perceived-performance research |
| OTH-OFFLINE | Offline UX | SRC-MDN-PWA, SRC-WEBDEV-PWA | COVERED | NOT_STARTED | Verified 2026-09-02: MDN PWA and web.dev offline/caching guidance |
| OTH-SLOW-NETWORK | Slow-network UX | SRC-WEBDEV-PWA, SRC-GOOGLE-WEB-VITALS | COVERED | NOT_STARTED | web.dev PWA verified 2026-09-02; Web Vitals verified 2026-09-23 |
| OTH-LOCALIZATION | Localization | SRC-W3C-I18N | COVERED | NOT_STARTED | Verified 2026-09-23: W3C i18n techniques index and a representative article (text expansion, language switching, names). Locale formatting anchors (CLDR, ECMAScript Intl) not registered (GAP-038) |
| OTH-I18N | Internationalization | SRC-W3C-I18N, SRC-W3C-KLREQ | COVERED | NOT_STARTED | Verified 2026-09-23: W3C i18n techniques plus Hangul layout requirements (Group Note Draft) for Korean text |
| OTH-RTL | RTL and bidirectional layout | SRC-W3C-I18N, SRC-GOOGLE-MATERIAL3 | COVERED | NOT_STARTED | Material 3 verified 2026-09-02 (RTL/bidi guidance); W3C i18n bidi and writing-mode techniques verified 2026-09-23 |
| OTH-PRIVACY-UX | Privacy UX | SRC-EU-GDPR, SRC-KR-PIPA, SRC-EDPB-DECEPTIVE, SRC-FTC-DARK-PATTERNS | COVERED | NOT_STARTED | Verified 2026-09-23: GDPR and PIPA define the obligations (LEGAL, EU and KR); EDPB deceptive-pattern guidelines and the FTC report (privacy-choice section) give interface-level guidance (BEST_PRACTICE) |
| OTH-CONSENT-UX | Consent UX | SRC-EU-GDPR, SRC-EDPB-CONSENT, SRC-KR-PIPA | COVERED | NOT_STARTED | Verified 2026-09-23: GDPR Art. 4(11) and 7, EDPB Guidelines 05/2020 v1.1, PIPA Art. 22 (current text 법률 제21445호). Cookie consent (ePrivacy Directive) not registered (GAP-046) |
| OTH-DARK-PATTERNS | Deceptive and dark patterns | SRC-EDPB-DECEPTIVE, SRC-FTC-DARK-PATTERNS, SRC-EU-DSA, SRC-KR-ECOMMERCE-ACT, SRC-TOSS-APPS-IN-TOSS | COVERED | NOT_STARTED | Verified 2026-09-23: DSA Art. 25 (EU, online platforms) and Korean E-Commerce Act Art. 21-2 (KR) as LEGAL anchors; EDPB 03/2022 taxonomy (6 categories, 16 types) and FTC 2022 report (8 pattern types) as BEST_PRACTICE; Apps in Toss five banned patterns (T2 on that platform). EU UCPD not registered (GAP-046) |
| OTH-DESIGN-SYSTEM | Design-system consistency | SRC-GOOGLE-MATERIAL3, SRC-APPLE-HIG, SRC-KR-KRDS | COVERED | NOT_STARTED | Verified 2026-09-02: Material and HIG as exemplar design systems; rules methodology-derived 2026-09-23: KRDS (Korean government design system, 2025.08 guideline) added for Korean public-sector services. |
