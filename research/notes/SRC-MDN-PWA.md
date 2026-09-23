# SRC-MDN-PWA — MDN Progressive Web Apps guide

- Authority: Mozilla (MDN Web Docs)
- Canonical URL: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- Version / date: living documentation hub; last modified 31 August 2026. Snapshot 2026-09-02
- Source status: CURRENT
- Superseded by / supersedes: continuously updated
- License / access: Creative Commons (MDN Web Docs); attribution and share-alike
- Verified on: 2026-09-02 (identity, subtopic list, last-modified date, and license confirmed at the canonical URL)
- Tier: T2
- Domains served: PLAT-PWA, OTH-OFFLINE

## Scope and applicability

- MDN's PWA documentation hub: what a PWA is, making PWAs installable, offline and background operation, caching, and best practices, plus reference on manifest members and Service Worker APIs.
- Jurisdiction: GLOBAL. Rule class BEST_PRACTICE (defers to the manifest and Service Worker specs for normative facts). Platforms web, pwa.

## Structure (read at the canonical URL)

- Guides: what is a PWA, making PWAs installable, installing and uninstalling, offline and background operation, caching, best practices.
- How-to: standalone app, app icons, app colors, badges, shortcuts, share, install prompts, file handling.
- Reference: web app manifest members; Service Worker APIs; related APIs (IndexedDB, Badging, Notifications, Web Share, Window Controls Overlay).

## Candidate rules

- BEST_PRACTICE rule families: provide a valid, complete manifest (crosswalk to SRC-W3C-APPMANIFEST); make the app installable; provide an offline experience via a service worker and caching; handle updates; provide icons, theme, and shortcuts. Rule class BEST_PRACTICE, platform pwa, jurisdiction GLOBAL.
- Normative facts defer to the Web Application Manifest and Service Worker specs. Extraction deferred to Phase 2.

## Cross-references

- Web Application Manifest (SRC-W3C-APPMANIFEST): the manifest spec.
- web.dev Learn PWA (SRC-WEBDEV-PWA): the Google course; PLAT-PWA combines all three.

## Uncertainties and gaps

- Living hub; last-modified 31 August 2026 recorded. Re-verify per §5.
- The Service Worker spec is not registered separately; OTH-OFFLINE currently relies on the MDN and web.dev guides. Register the Service Workers spec in Phase 2 if offline rules need a normative anchor.
