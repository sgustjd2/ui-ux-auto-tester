# SRC-W3C-APPMANIFEST — Web Application Manifest

- Authority: W3C (Web Applications Working Group)
- Canonical URL: https://www.w3.org/TR/appmanifest/ (latest published version). This version at verification: https://www.w3.org/TR/2026/WD-appmanifest-20260813/
- Version / date: W3C Working Draft, 13 August 2026
- Source status: DRAFT (Working Draft maturity; it is developed as a living document but the TR snapshot is a Working Draft, not a Recommendation)
- Superseded by / supersedes: continuously updated Working Drafts
- License / access: W3C Software and Document License (permissive; the header reads "permissive document license rules apply")
- Verified on: 2026-09-02 (title, status line "W3C Working Draft 13 August 2026", this-version and latest-version URLs, and license confirmed at the canonical URL)
- Tier: T1
- Domains served: PLAT-PWA

## Scope and applicability

- Defines the JSON manifest that makes a web app installable: name, icons, display mode, orientation, theme and background colors, navigation scope, shortcuts, and related members. It is the installability half of the PWA platform.
- Jurisdiction: GLOBAL. Rule class STANDARD (Working Draft; not yet a Recommendation, so treat as PLATFORM/STANDARD guidance rather than a settled normative baseline). Platforms web, pwa.

## Structure

- Member definitions (name, short_name, icons, display, orientation, theme_color, background_color, scope, start_url, shortcuts, and more) with processing rules for user agents.

## Candidate rules

- Candidate STANDARD/PLATFORM rules for a PWA audit: a valid manifest is present and linked; required members (name/short_name, icons of adequate sizes, start_url, display) are set; theme and background colors are defined; scope and start_url are consistent. Rule class STANDARD, platforms pwa/web, jurisdiction GLOBAL.
- Because the source is a Working Draft, mark derived rules as PLATFORM/STANDARD with the draft status noted; do not treat them as a settled Recommendation. Extraction deferred to Phase 2.

## Cross-references

- MDN PWA (SRC-MDN-PWA) and web.dev Learn PWA (SRC-WEBDEV-PWA): the practitioner guides over this spec; PLAT-PWA combines all three.
- Service Workers (a separate spec, not yet registered): the offline half of PWA; register in Phase 2 if offline rules need it.

## Uncertainties and gaps

- Working Draft maturity: re-check whether it advances to Candidate/Proposed Recommendation before packaging; the manifest has been a long-lived WD.
- Service Workers and the broader PWA capability specs are not registered; PLAT-PWA and OTH-OFFLINE currently rely on the manifest plus the MDN and web.dev guides. Consider registering the Service Workers spec in Phase 2.
