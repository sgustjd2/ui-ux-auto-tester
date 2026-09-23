# SRC-W3C-KLREQ — Requirements for Hangul Text Layout and Typography (한국어 텍스트 레이아웃 및 타이포그래피를 위한 요구사항)

- Authority: W3C (Internationalization Working Group; editor Richard Ishida)
- Canonical URL: https://www.w3.org/TR/klreq/
- Version / date: W3C Group Note Draft 21 March 2026 (DNOTE-klreq-20260321), as printed in the header
- Source status: DRAFT (Group Note Draft, not a Recommendation-track specification)
- Superseded by / supersedes: continuously revised; history at https://www.w3.org/standards/history/klreq/
- License / access: W3C permissive document license (header); paraphrase only
- Verified on: 2026-09-23 (header and status section read from the downloaded HTML)
- Tier: T2
- Domains served: OTH-I18N

## Scope and applicability

- Describes requirements for general Korean language and Hangul text layout and typography as realized with CSS, SVG, and XSL-FO. It is a requirements document addressed mainly to specification and browser implementers; it explains how Korean text is expected to behave (line breaking, spacing, punctuation, emphasis, vertical and horizontal writing, and related conventions).
- Relevance: the project audits Korean products (KWCAG, Korean law) and the web product serves Korean users; Korean-specific typography expectations (for example word-based line breaking and punctuation handling) give BEST_PRACTICE anchors for Korean visual and localization checks that Latin-centric guidelines miss.
- Platforms: web primarily. Jurisdiction: GLOBAL (language-specific, not country law). Rule class BEST_PRACTICE.

## Structure

Table of contents (read from the downloaded HTML after review): contributors; introduction; 3 text direction; 4 glyph shaping and positioning; 5 typographic units; 6 punctuation and inline features; 7 line and paragraph layout; 8 page and book layout; appendices on Hangul code ranges in Unicode and Hangul typographic classes, references, revision log. Section-level requirements are not yet read (GAP-050); Phase 2 reads sections 6 and 7 before minting rules.

## Candidate rules

Candidate families (to confirm against the text in Phase 2):

- Korean text lines break in the expected places (for example not splitting words where Korean convention keeps them together), checked visually on rendered Korean content (CSS `word-break: keep-all` is a common implementation technique, noted as technique, not requirement).
- Punctuation and spacing follow Korean typographic convention.

## Cross-references

- W3C i18n techniques and articles (SRC-W3C-I18N): general internationalization guidance.
- KWCAG 2.2 (SRC-KR-KWCAG22): Korean accessibility; readability of Korean text overlaps.

## Uncertainties and gaps

- Group Note Draft: content may change; re-check at each publication.
- Section-level requirements not yet read; candidate families above are provisional.
