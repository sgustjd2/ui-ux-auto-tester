# SRC-GOOGLE-WEB-VITALS — Web Vitals (web.dev)

- Authority: Google (web.dev, Chrome team; article author Philip Walton)
- Canonical URL: https://web.dev/articles/vitals
- Version / date: published 4 May 2020, last updated 31 October 2024 (as printed on the page); metric lifecycle stages read 2026-09-23
- Source status: CURRENT
- Superseded by / supersedes: continuously updated; metric-definition changes are logged in the Chromium metrics changelog (https://chromium.googlesource.com/chromium/src/+/main/docs/speed/metrics_changelog/README.md), which the page links as its public CHANGELOG
- License / access: page content Creative Commons Attribution 4.0; code samples Apache 2.0 (Google Developers Site Policies, read in the page footer)
- Verified on: 2026-09-23 (page downloaded and read; thresholds, percentile rule, lifecycle stages, and license extracted from the HTML; changelog files read)
- Tier: T2
- Domains served: OTH-PERF-UX, OTH-CWV, OTH-SLOW-NETWORK

## Scope and applicability

- Google's definition of the Web Vitals programme and of the Core Web Vitals subset: the metrics Google says apply to all web pages, are measurable in the field, and are surfaced across Google tools.
- Platforms: web, pwa. Jurisdiction: GLOBAL. Binds no one; it is vendor guidance. Rule class METRIC (`docs/rule-schema.md` §4), producing UX_RISK findings with `performance_metric` evidence, never VIOLATION (`docs/finding-schema.md` §1, GAP-001).

## Structure (paraphrased)

- Core Web Vitals, all at lifecycle stage Stable as printed on the page: Largest Contentful Paint (loading), Interaction to Next Paint (interactivity), Cumulative Layout Shift (visual stability).
- "Good" thresholds as printed: LCP within 2.5 seconds of the page starting to load; INP of 200 milliseconds or less; CLS of 0.1 or less.
- Assessment rule: measure at the 75th percentile of page loads, segmented by mobile and desktop; a page passes Core Web Vitals when all three metrics meet their targets at the 75th percentile.
- Lifecycle model: metrics move through Experimental, Pending, and Stable stages; the page names INP as an example that started as an experimental metric replacing First Input Delay. The Chromium changelog index records FID as deprecated on 9 September 2024 in favour of INP.
- Supplemental (non-core) metrics named for diagnosis: Time to First Byte and First Contentful Paint (loading diagnosis, both field and lab), Total Blocking Time (lab proxy for interactivity).
- Measurement definitions keep changing without changing thresholds. Chromium changelog entries read 2026-09-23 include, for LCP, a February 2026 change to emit candidates from the largest painted image and a June 2026 change for video elements; for CLS, February 2026 attribution changes; for INP, a stable `performance.interactionCount` API (October 2025) and 2026 interaction-ID and Event Timing fixes. A separate soft-navigation heuristics changelog exists (single-page-app navigations), not part of the Core Web Vitals set.

## Candidate rules

| Proposed ID | Source item | Paraphrase | Class | Strength | Testability |
|---|---|---|---|---|---|
| CWV-lcp-001 | LCP threshold | LCP at the 75th percentile is within the good threshold (2.5 s) | METRIC | SHOULD | automated FULL with field data (CrUX/RUM); PARTIAL with lab runs |
| CWV-inp-001 | INP threshold | INP at the 75th percentile is within the good threshold (200 ms) | METRIC | SHOULD | automated FULL with field data; lab runs only approximate (interaction scripts) |
| CWV-cls-001 | CLS threshold | CLS at the 75th percentile is within the good threshold (0.1) | METRIC | SHOULD | automated FULL with field data; PARTIAL with lab runs |
| CWV-assessment-001 | 75th percentile rule | A Core Web Vitals pass is reported only when all three metrics meet their targets at p75, per device class | METRIC | SHOULD | automated FULL with field data |
| CWV-diagnostic-001 | TTFB, FCP, TBT | Supplemental metrics are reported as diagnostics for a failing core metric, never as a pass or fail on their own | METRIC | INFORMATIVE | automated FULL |

Notes for Phase 2: lab measurements (a single page load in a test browser) cannot establish a p75 field value, so a lab-only run yields PARTIAL with the limitation stated (`docs/audit-methodology.md` §2 performance row). The "needs improvement" and "poor" bands live on the per-metric pages (web.dev/articles/lcp, /inp, /cls), which Phase 2 reads before minting rules.

## Cross-references

- NN/g perceived-performance and response-time research (SRC-NNG-ARTICLES): explains why the thresholds matter; OTH-PERF-UX combines the two.
- web.dev Learn PWA (SRC-WEBDEV-PWA): slow-network resilience; OTH-SLOW-NETWORK combines the two.
- W3C Web Performance Working Group specifications (Largest Contentful Paint, Event Timing, Layout Instability) define the underlying browser APIs; not registered (recorded in `research/gaps.md`).
- Lighthouse and Chrome DevTools performance insights consume these metrics; tooling state is tracked in `research/landscape.md`, not here.

## Uncertainties and gaps

- The page was last updated 31 October 2024; the thresholds have not changed since, but metric definitions changed in 2025 and 2026 (changelog). Re-check the changelog before normalizing any threshold rule.
- The underlying W3C performance specifications are not registered; Phase 2 decides whether METRIC rules need them as anchors.
