# SRC-WHATWG-HTML — HTML Living Standard

- Authority: WHATWG (Web Hypertext Application Technology Working Group)
- Canonical URL: https://html.spec.whatwg.org/multipage/ (multipage edition; the single-page edition is at https://html.spec.whatwg.org/)
- Version / date: Living Standard, no version numbers; "Last Updated 1 September 2026"
- Source status: CURRENT
- Superseded by / supersedes: the Living Standard supersedes the historical W3C HTML5 Recommendations
- License / access: WHATWG content under Creative Commons Attribution 4.0 (CC-BY 4.0). Attribution required
- Verified on: 2026-09-02 (identity, "Living Standard — Last Updated 1 September 2026", structure, and license confirmed at the canonical URL)
- Tier: T1
- Domains served: PLAT-WEB

## Scope and applicability

- The authoritative specification of HTML: element semantics, content models, form controls, interactive elements, and the associated DOM and scripting APIs. It is the source of truth for native web semantics that the audit engine reads (roles implied by elements, form semantics, landmarks).
- Jurisdiction: GLOBAL. Rule class STANDARD (or NORMATIVE for conformance requirements on authors). Platforms web, pwa.

## Structure (read at the canonical URL)

- Major sections: introduction and common infrastructure; semantics, structure, and DOM APIs; the element catalogue (document metadata, sections, grouping, text-level, links, embedded content, tabular data, forms, interactive elements); scripting and web application APIs; communication and workers; storage; syntax; rendering; obsolete features.

## Candidate rules

- The audit relevance of HTML is mainly as the definition of native semantics that satisfy ARIA and WCAG requirements (use the native element before ARIA). Candidate STANDARD rules cover: valid use of form controls and labels, native landmark and sectioning semantics, required attributes for interactive elements, and author conformance requirements the spec marks with "must".
- Most HTML author requirements crosswalk to WCAG (4.1.2 Name, Role, Value) and ARIA (native-first). Extraction is deferred to Phase 2; the spec is large, so Phase 2 should extract only the author-conformance and semantics rules relevant to auditing, not the full spec.

## Cross-references

- WAI-ARIA (SRC-W3C-ARIA12) and ARIA in HTML (GAP-031): define which ARIA is allowed on which HTML element and the native-first rule.
- WCAG (SRC-W3C-WCAG22): met in part through correct native HTML.
- MDN Web Docs (SRC-MDN-WEB): the practitioner reference over this spec.

## Uncertainties and gaps

- Living Standard; last-updated 1 September 2026 recorded. Re-verify per §5.
- The relevant author-conformance and semantics subset was not extracted this session; deferred to Phase 2.
