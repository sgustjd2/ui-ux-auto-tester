# SRC-NNG-ARTICLES — Nielsen Norman Group research articles

- Authority: Nielsen Norman Group (NN/g)
- Canonical URL: https://www.nngroup.com/articles/
- Version / date: living collection of dated, authored articles; snapshot 2026-09-02
- Source status: CURRENT
- Superseded by / supersedes: individual articles are dated and occasionally updated
- License / access: copyright Nielsen Norman Group ("Copyright © 1998-2026 Nielsen Norman Group, All Rights Reserved"); viewable, paraphrase only, no verbatim reproduction
- Verified on: 2026-09-02 (identity as the NN/g article collection, example topics, and the all-rights-reserved copyright read at the canonical URL)
- Tier: T3
- Domains served: UX-IA, UX-DISCOVERABILITY, UX-AFFORDANCE, UX-FEEDBACK, UX-MAPPING, UX-COGNITIVE-LOAD, UX-PROGRESSIVE-DISCLOSURE, UX-FORMS, UX-NAVIGATION, UX-SEARCH, UX-ONBOARDING, UX-HELP, UX-CONTENT-MICROCOPY, UX-STATES, UX-DESTRUCTIVE-ACTIONS, VIS-HIERARCHY, OTH-PERF-UX, OTH-PERCEIVED-PERF

## Scope and applicability

- The NN/g research-article library: evidence-based UX guidance across information architecture, navigation, forms, search, content, cognition, states, and perceived performance. It is the T3 best-practice reference for the expert UX review layer.
- Jurisdiction: GLOBAL. Rule class HEURISTIC and BEST_PRACTICE. Platforms all.

## Modeling decision

Treated as a homogeneous reference collection, like MDN Web Docs (SRC-MDN-WEB), rather than split into one source row per article. This reading is now ratified in `docs/standards-research-plan.md` §4 and the `research/sources.md` preamble: a homogeneous living library under one authority stays one VERIFIED row, distinct from a placeholder umbrella that stands in for several distinct documents. Individual articles are cited per rule at extraction time (Phase 2), recording the specific article URL, date, and author. Because several domains have this collection as their sole source, Phase 2 verifies at least one representative article per such domain before finalizing that domain's rules (per §4).

## Candidate rules

- BEST_PRACTICE and HEURISTIC rule families per domain (IA, navigation, forms, search, content, states, cognition, perceived performance, visual hierarchy). Rule class HEURISTIC or BEST_PRACTICE, jurisdiction GLOBAL. They produce UX_RISK findings, never VIOLATION, and crosswalk to WCAG or platform rules where they overlap a requirement.
- Extraction is deferred to Phase 2, which registers the specific article behind each rule (with its date and author) in the rule's `notes`.

## Cross-references

- The 10 usability heuristics (SRC-NNG-HEURISTICS): the summary heuristic layer from the same authority.
- Platform design systems (SRC-GOOGLE-MATERIAL3, SRC-APPLE-HIG): overlap on components, states, and destructive actions.
- GOV.UK Design System (SRC-GOVUK-DESIGN-SYSTEM): overlap on forms and content.

## Uncertainties and gaps

- Living collection; individual article dates vary. Phase 2 records the date of each cited article.
- Copyright is all-rights-reserved; store paraphrases and article citations only, no verbatim text.
- The specific articles per domain were not enumerated this session; Phase 2 selects and cites them per rule.
