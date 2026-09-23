# SRC-MDN-WEB — MDN Web Docs

- Authority: Mozilla (MDN Web Docs), a community-maintained reference
- Canonical URL: https://developer.mozilla.org/
- Version / date: living reference; individual pages carry a "last modified" date (a sample page checked showed November 2025). Snapshot 2026-09-02
- Source status: CURRENT
- Superseded by / supersedes: continuously updated
- License / access: content under a Creative Commons license (CC-BY-SA 2.5 and later, per MDN's attribution terms); code samples under permissive terms. Attribution and share-alike required
- Verified on: 2026-09-02 (identity, a page last-modified date, and the Creative Commons licensing confirmed at the canonical host)
- Tier: T2
- Domains served: PLAT-WEB, PLAT-FORM-FACTORS, VIS-SAFE-AREAS

## Scope and applicability

- The practitioner reference for web platform technologies (HTML, CSS, JavaScript, Web APIs). For this project it is the T2 reference over the normative specs (WHATWG HTML, CSS specs), used for conventions and how-to, not as a normative source.
- Jurisdiction: GLOBAL. Rule class BEST_PRACTICE where MDN gives guidance; normative facts defer to the underlying spec. Platforms web, pwa, and cross-form-factor.

## Structure

- Reference sections for HTML, CSS, JavaScript, and Web APIs, plus Guides and Learn tutorials. Per-page metadata includes a last-modified date and a GitHub source link.

## Candidate rules

- MDN yields BEST_PRACTICE rules for web conventions (semantic HTML usage, responsive patterns, safe-area handling via env() and viewport-fit, form conventions) that defer to WHATWG HTML and the CSS specs for normative force. Rule class BEST_PRACTICE, platform web, jurisdiction GLOBAL.
- Where MDN documents a normative behavior, the rule cites the underlying spec (WHATWG HTML, CSS) rather than MDN. Extraction deferred to Phase 2.

## Cross-references

- WHATWG HTML (SRC-WHATWG-HTML): the normative spec MDN documents.
- MDN Responsive design (SRC-MDN-RESPONSIVE) and MDN PWA (SRC-MDN-PWA): sibling MDN areas registered separately.

## Uncertainties and gaps

- Living reference; per-page dates vary. Re-verify specific pages when extracting rules in Phase 2.
- MDN is a T2 reference, not a normative source; every rule it grounds must cite the underlying spec.
