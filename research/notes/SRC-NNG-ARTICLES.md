# SRC-NNG-ARTICLES — Nielsen Norman Group research articles

- Authority: Nielsen Norman Group (NN/g)
- Canonical URL: https://www.nngroup.com/articles/
- Version / date: living collection of dated, authored articles; snapshot 2026-09-02, interaction-law pages read 2026-09-23
- Source status: CURRENT
- Superseded by / supersedes: individual articles are dated and occasionally updated
- License / access: copyright Nielsen Norman Group ("Copyright © 1998-2026 Nielsen Norman Group, All Rights Reserved"); viewable, paraphrase only, no verbatim reproduction
- Verified on: 2026-09-23 (interaction-law pages read, see the section below); 2026-09-02 (identity as the NN/g article collection, example topics, and the all-rights-reserved copyright read at the canonical URL)
- Tier: T3
- Domains served: UX-INTERACTION-LAWS, UX-IA, UX-DISCOVERABILITY, UX-AFFORDANCE, UX-FEEDBACK, UX-MAPPING, UX-COGNITIVE-LOAD, UX-PROGRESSIVE-DISCLOSURE, UX-FORMS, UX-NAVIGATION, UX-SEARCH, UX-ONBOARDING, UX-HELP, UX-CONTENT-MICROCOPY, UX-STATES, UX-DESTRUCTIVE-ACTIONS, VIS-HIERARCHY, OTH-PERF-UX, OTH-PERCEIVED-PERF

## Scope and applicability

- The NN/g research-article library: evidence-based UX guidance across information architecture, navigation, forms, search, content, cognition, states, and perceived performance. It is the T3 best-practice reference for the expert UX review layer.
- Jurisdiction: GLOBAL. Rule class HEURISTIC and BEST_PRACTICE. Platforms all.

## Modeling decision

Treated as a homogeneous reference collection, like MDN Web Docs (SRC-MDN-WEB), rather than split into one source row per article. This reading is now ratified in `docs/standards-research-plan.md` §4 and the `research/sources.md` preamble: a homogeneous living library under one authority stays one VERIFIED row, distinct from a placeholder umbrella that stands in for several distinct documents. Individual articles are cited per rule at extraction time (Phase 2), recording the specific article URL, date, and author. Because several domains have this collection as their sole source, Phase 2 verifies at least one representative article per such domain before finalizing that domain's rules (per §4).

## Candidate rules

- BEST_PRACTICE and HEURISTIC rule families per domain (IA, navigation, forms, search, content, states, cognition, perceived performance, visual hierarchy). Rule class HEURISTIC or BEST_PRACTICE, jurisdiction GLOBAL. They produce UX_RISK findings, never VIOLATION, and crosswalk to WCAG or platform rules where they overlap a requirement.
- Extraction is deferred to Phase 2, which registers the specific article behind each rule (with its date and author) in the rule's `notes`.

## Interaction-law pages (read 2026-09-23, for UX-INTERACTION-LAWS)

Representative pages verified by the lead (title, author, and publication date from the page metadata; paraphrase only). They anchor HEURISTIC rules for the laws in `prd.md` §7.3 at T3, next to the seven registered primary papers (Fitts, Hick, Miller, Murdock, Kivetz et al., Hunt, Wagemans et al.).

| Law | NN/g page | Author | Published |
|---|---|---|---|
| Fitts's Law | https://www.nngroup.com/articles/fitts-law/ (Fitts's Law and Its Applications in UX) | Raluca Budiu | 2022-07-31 |
| Miller / working memory | https://www.nngroup.com/articles/working-memory-external-memory/ (Working Memory and External Memory); https://www.nngroup.com/articles/short-term-memory-and-web-usability/ | Raluca Budiu; Jakob Nielsen | 2018-04-29; 2009-12-07 |
| Jakob's Law | https://www.nngroup.com/videos/jakobs-law-internet-ux/ (video: users prefer sites to work like the sites they already know) | Jakob Nielsen | 2017-08-18 |
| Tesler's Law | https://www.nngroup.com/videos/teslers-law/ (video: shift irreducible complexity away from users) | Lola Famulegun | 2025-11-24 |
| Zeigarnik Effect | https://www.nngroup.com/videos/zeigarnik-effect/ (video: unfinished tasks are more memorable; use carefully for task completion) | Feifei Liu | 2024-03-27 |
| Peak-End Rule | https://www.nngroup.com/articles/peak-end-rule/ | Lexie Kane | 2018-12-30 |
| Aesthetic-Usability Effect | https://www.nngroup.com/articles/aesthetic-usability-effect/ | Kate Moran | 2024-02-03 |
| Gestalt: proximity | https://www.nngroup.com/articles/gestalt-proximity/ | Aurora Harley | 2020-08-02 |
| Gestalt: similarity | https://www.nngroup.com/articles/gestalt-similarity/ | Aurora Harley | 2020-09-06 |
| Gestalt: common region | https://www.nngroup.com/articles/common-region/ | Aurora Harley | 2020-07-12 |
| Gestalt: closure | https://www.nngroup.com/articles/principle-closure/ | Alita Kendrick | 2021-07-18 |
| Response-time limits (performance thresholds; related to the Doherty Threshold but not the same claim) | https://www.nngroup.com/articles/response-times-3-important-limits/ | Jakob Nielsen | 1993-01-01 (updated since) |
| Pareto Principle | https://www.nngroup.com/articles/pareto-principle/ (applied to prioritizing quantitative data) | Evan Sunwall | 2021-10-17 |
| Hick's Law | https://www.nngroup.com/videos/hicks-law-long-menus/ (video: more choices take longer; techniques for long menus) | Katie Sherwin | 2018-07-06 |
| Jakob's Law (origin) | https://www.nngroup.com/articles/end-of-web-design/ (End of Web Design, where Nielsen states the law) | Jakob Nielsen | July 2000 |
| Miller / chunking | https://www.nngroup.com/articles/chunking/ (How Chunking Helps Content Processing); https://www.nngroup.com/videos/magical-number-7-ux/ (video warning against misusing the number 7) | Kate Moran; Raluca Budiu | 2016-03-20; 2021-01-15 |
| Serial position (primacy) | https://www.nngroup.com/videos/primacy-effect/ (video: put important things first) | Caleb Sponheim | 2023-09-13 |
| Gestalt: continuation | https://www.nngroup.com/videos/continuation-gestalt/ (video) | Megan Brown | 2023-02-03 |
| Gestalt: connectedness | https://www.nngroup.com/videos/connectedness-gestalt/ (video; related to but not the same as uniform connectedness) | Sana Behnam | 2022-12-30 |

The rows after Pareto come from a read-only mapping scan on the same day; the lead re-checked each page's title, date, and author. Laws with no NN/g page: Von Restorff Effect (anchored by SRC-HUNT-1995), Goal-Gradient Effect (SRC-KIVETZ-2006), Doherty Threshold (no T3 anchor, GAP-062), and Gestalt Prägnanz (no NN/g page; only mentioned historically in the Wagemans review, so not anchored). Videos (Hick, Jakob, Tesler, Zeigarnik, continuation, connectedness) cite no papers; Tesler's Law, the Zeigarnik Effect, the Pareto Principle, the Peak-End Rule, and the Aesthetic-Usability Effect rest on NN/g alone at T3 (their primary papers are not registered, GAP-062). The Pareto page is about prioritizing quantitative data, so it is a weak anchor for any interface rule.

## Cross-references

- The 10 usability heuristics (SRC-NNG-HEURISTICS): the summary heuristic layer from the same authority.
- Platform design systems (SRC-GOOGLE-MATERIAL3, SRC-APPLE-HIG): overlap on components, states, and destructive actions.
- GOV.UK Design System (SRC-GOVUK-DESIGN-SYSTEM): overlap on forms and content.

## Uncertainties and gaps

- Living collection; individual article dates vary. Phase 2 records the date of each cited article.
- Copyright is all-rights-reserved; store paraphrases and article citations only, no verbatim text.
- The specific articles per domain were not enumerated this session; Phase 2 selects and cites them per rule.
