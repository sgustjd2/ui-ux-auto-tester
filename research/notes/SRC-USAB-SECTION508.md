# SRC-USAB-SECTION508 — Section 508 Standards (Revised 508 Standards, 36 CFR Part 1194)

- Authority: U.S. Access Board (regulation enforced for federal agencies; the standard is codified in the Code of Federal Regulations)
- Canonical URL: https://www.access-board.gov/ict/ (the Revised 508 Standards and 255 Guidelines). Codified at 36 CFR Part 1194.
- Version / date: the "Revised 508 Standards" (the 2017 ICT Refresh). Final rule issued 18 January 2017; effective 21 March 2017 (corrected from 20 March by a notice); compliance required on or before 18 January 2018. A technical correction was issued 22 January 2018
- Source status: CURRENT
- Superseded by / supersedes: the Revised 508 Standards replaced the original 2000 Section 508 standards
- License / access: U.S. Government work; U.S. federal regulations are not subject to copyright (public domain). The Access Board text may be reproduced.
- Verified on: 2026-09-02 (Access Board ICT standards page read at the canonical URL; WCAG incorporation and effective date confirmed)
- Tier: T1
- Domains served: LEGAL-SECTION-508

## Scope and applicability

- Binds U.S. federal agencies: information and communication technology procured, developed, maintained, or used by agencies must conform (E201.1). Covers web content, software, hardware, and electronic content (documents).
- Jurisdiction: US (federal government). Rule class LEGAL.
- Platforms: web, pwa, ios, android, desktop, hardware, and electronic documents.

## Structure

- Appendices to 36 CFR Part 1194: Appendix A (application and scoping, E-numbered provisions), Appendix B (255 Guidelines for telecommunications), Appendix C (functional performance criteria and technical requirements, numbered chapters 3xx–7xx).
- Chapter 5 covers software, chapter 6 hardware, chapter 7 support documentation and services. Provision 702.10.1 incorporates by reference WCAG 2.0 Level A and Level AA Success Criteria and Conformance Requirements; chapters 4 and 5 apply WCAG to web and to software/electronic content.
- Normative vs informative: the CFR text is regulatory (normative); advisory notes are informative.

## Candidate rules

- The WCAG-derived requirements (WCAG 2.0 Level A and AA, applied to web and electronic content) crosswalk to the WCAG rules: `rule_class: LEGAL`, jurisdiction US, with `equivalent` links to the corresponding WCAG rules. Note the version is WCAG 2.0, older than the WCAG 2.2 registry baseline; the crosswalk must record the version difference (a WCAG 2.0 source may be needed, related to GAP-027).
- The non-WCAG provisions (functional performance criteria in chapter 3, hardware in chapter 6, support in chapter 7) are candidate `S508-*` rules of `rule_class: LEGAL`, jurisdiction US. Extraction deferred to Phase 2 from the CFR text.

## Cross-references

- WCAG (SRC-W3C-WCAG22): Section 508 incorporates WCAG 2.0 A/AA; the WCAG rules are the equivalents for web and electronic content.
- EN 301 549 (SRC-ETSI-EN301549): the EU analogue; the two are broadly harmonized on the WCAG core, enabling a US/EU crosswalk (with version differences: 508 → WCAG 2.0, EN 301 549 V3.2.1 → WCAG 2.1).
- ADA (SRC-DOJ-ADA-TITLE2): a separate US legal track; Section 508 binds federal agencies, the ADA Title II rule binds state and local governments.

## Uncertainties and gaps

- Section 508 references WCAG 2.0, not 2.2; the registry needs a WCAG 2.0 reference to link these precisely (GAP-027 extended to 2.0).
- Whether a further 508 update aligns with a newer WCAG version should be re-checked before packaging.
- Individual non-WCAG provisions were not extracted this session; deferred to Phase 2.
