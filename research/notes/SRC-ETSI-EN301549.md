# SRC-ETSI-EN301549 — EN 301 549 Accessibility requirements for ICT products and services

- Authority: ETSI, CEN, and CENELEC (the three European Standardization Organizations), developed under European Commission mandate
- Canonical URL: https://www.etsi.org/deliver/etsi_en/301500_301599/301549/ (version directory). V3.2.1 file: https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf
- Version / date: EN 301 549 V3.2.1 (2021-03); superseded at ETSI by V4.1.1 on 2 September 2026 and still the OJ-cited harmonized standard under the WAD
- Source status: SUPERSEDED at ETSI since 2 September 2026 (re-checked 2026-09-23): V4.1.1 is published (SRC-ETSI-EN301549-V4). V3.2.1 remains the harmonized standard cited under the Web Accessibility Directive (Decision (EU) 2021/1339) until V4.1.1 is cited in the Official Journal, so EU legal audits keep citing it until then
- Superseded by / supersedes: superseded by SRC-ETSI-EN301549-V4 (V4.1.1, 2026-09). Supersedes V3.1.1 (2019) and earlier. Historical note from 2026-09-02: A successor, V4.1.0, is in ETSI approval (the directory shows 04.01.00_30 dated 2026-06 with file en_301549v040100va.pdf, the "va" suffix marking a draft under vote, not a published EN). V4.1.0 aligns EN 301 549 with the European Accessibility Act and newer WCAG; it is not yet the published or harmonized version. This resolves GAP-008.
- License / access: freely downloadable at no cost from ETSI (unlike paid ISO standards), because it is a mandated European standard. Copyright ETSI/CEN/CENELEC; store metadata, structure, and paraphrases only, no large verbatim text.
- Verified on: 2026-09-23 re-check (ETSI directory lists 04.01.01_60, V4.1.1, dated 2 September 2026; AccessibleEU news of 7 September 2026 says V3.2.1 remains the legal reference until V4.1.1 is cited in the Official Journal); first verified 2026-09-02 (ETSI version directory and the V3.2.1 and V4.1.0 subdirectory file listings read via the canonical ETSI host; version and published-vs-draft status confirmed from the file naming)
- Tier: T1
- Domains served: LEGAL-EN-301-549

## Scope and applicability

- The European standard of accessibility requirements for ICT products and services. It is the harmonized standard that gives a presumption of conformity under the Web Accessibility Directive (SRC-EU-WAD) via Commission Implementing Decision (EU) 2021/1339, and it is the technical baseline used across EU accessibility law.
- Jurisdiction: EU (and EFTA states that adopt it). Rule class LEGAL when applied through the directives; the standard itself is STANDARD, but this project registers its requirements as the referenced technical baseline of the EU legal sources.
- Platforms: web, pwa, ios, android, desktop, and hardware; the standard is technology-broad.

## Structure

- Organized by ICT type: functional performance statements (chapter 4/5), then requirements by category — generic (5), two-way voice/RTT (6), video (7), hardware (8), Web (9), non-web documents (10), non-web software (11), documentation and support services (12), relay/access services (13).
- Chapters 9, 10, and 11 incorporate the WCAG 2.1 Level A and AA success criteria (mapped to web, documents, and software respectively), plus additional requirements WCAG does not cover (for example hardware, real-time text, closed functionality, biometrics).
- Normative vs informative: the requirement clauses are normative; annexes include the mapping to the EU directives and to WCAG.

## Candidate rules

Two kinds:

- The WCAG-derived clauses (chapters 9–11) crosswalk to the WCAG rules (SRC-W3C-WCAG22, though EN 301 549 V3.2.1 references WCAG 2.1); they carry `rule_class: STANDARD` with `equivalent` links to the WCAG rules and jurisdiction EU. Do not duplicate the WCAG text; link.
- The non-WCAG clauses (hardware, RTT, closed functionality, and the additional software/documentation requirements) are candidate `EN301549-*` rules of `rule_class: STANDARD`, jurisdiction EU. These are the value EN 301 549 adds beyond WCAG. Extraction of individual clauses is deferred to Phase 2 from the V3.2.1 PDF.

## Cross-references

- WCAG 2.1 / 2.2 (SRC-W3C-WCAG22 and the WCAG 2.1 source to be registered, GAP-027): EN 301 549 V3.2.1 references WCAG 2.1; the WCAG rules are the equivalents of chapters 9–11.
- Web Accessibility Directive (SRC-EU-WAD): makes conformance to EN 301 549 a presumption of conformity for public sector web and apps.
- European Accessibility Act (SRC-EU-EAA): the EAA-aligned successor V4.1.1 (SRC-ETSI-EN301549-V4) was published on 2 September 2026 with an EAA annex; not yet cited in the Official Journal (GAP-039).
- Section 508 (SRC-USAB-SECTION508): the US analogue; both incorporate WCAG, enabling a US/EU crosswalk.

## Uncertainties and gaps

- The individual non-WCAG clauses were not extracted in this session; Phase 2 extracts them from the V3.2.1 PDF (paraphrase only, licensed text).
- Which WCAG version each chapter references (2.1 in V3.2.1; 2.2 in V4.1.1) must be pinned per clause at normalization; this ties to GAP-027 (register WCAG 2.1).
- Superseded by V4.1.1 (2 September 2026); re-check its Official Journal citation before EU legal rules are normalized (GAP-039).
