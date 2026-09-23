# SRC-WEBDEV-PWA — Learn PWA (web.dev)

- Authority: Google (web.dev)
- Canonical URL: https://web.dev/learn/pwa
- Version / date: living course; no explicit last-updated shown on the index. Snapshot 2026-09-02
- Source status: CURRENT
- Superseded by / supersedes: continuously updated
- License / access: web.dev content under Creative Commons Attribution 4.0; code under Apache 2.0 (Google Developers content terms). Attribution required
- Verified on: 2026-09-02 (identity as the Learn PWA course and the module list confirmed at the canonical URL; explicit last-updated not shown)
- Tier: T2
- Domains served: PLAT-PWA, OTH-OFFLINE, OTH-SLOW-NETWORK

## Scope and applicability

- Google's structured course on building progressive web apps. It covers foundations, app design, assets and data, service workers, caching, serving and offline, installation and the web app manifest, updates, OS integration, window management, and capabilities.
- Jurisdiction: GLOBAL. Rule class BEST_PRACTICE. Platforms web, pwa.

## Structure (read at the canonical URL)

- Roughly two dozen modules: Welcome, Progressive Web Apps, Getting started, Foundations, App design, Assets and data, Service workers, Caching, Serving, Workbox, Offline data, Installation, Web app manifest, Installation prompt, Update, Enhancements, Detection, OS integration, Window management, Experimental features, Tools and debug, Architecture, Complexity management, Capabilities.

## Candidate rules

- BEST_PRACTICE rule families: installability and manifest completeness; service-worker-based offline and caching strategy; resilient behavior on slow or flaky networks (the slow-network dimension); update handling; OS integration (shortcuts, file handling, window controls). Rule class BEST_PRACTICE, platform pwa, jurisdiction GLOBAL.
- Overlaps with the MDN PWA guide; Phase 2 should deduplicate PWA rules across web.dev and MDN and anchor normative facts to the manifest and Service Worker specs. Extraction deferred to Phase 2.

## Cross-references

- MDN PWA (SRC-MDN-PWA) and Web Application Manifest (SRC-W3C-APPMANIFEST): sibling PWA sources.
- Core Web Vitals (SRC-GOOGLE-WEB-VITALS, not yet verified): the performance dimension for slow-network UX; OTH-SLOW-NETWORK combines web.dev PWA with Web Vitals.

## Uncertainties and gaps

- No explicit last-updated on the index; snapshot dated. Re-verify per §5.
- Rules not extracted individually this session; deferred to Phase 2, deduplicated against MDN.
