# SRC-DOJ-ADA-TITLE2 — ADA Title II web and mobile app accessibility rule (28 CFR Part 35)

- Authority: U.S. Department of Justice, Civil Rights Division
- Canonical URL: https://www.ada.gov/resources/2024-03-08-web-rule/ (DOJ rule page and fact sheet). Codified in 28 CFR Part 35.
- Version / date: final rule published in the Federal Register on 24 April 2024, amending the ADA Title II regulation. An Interim Final Rule published 20 April 2026 extended the compliance dates.
- Source status: CURRENT
- Superseded by / supersedes: the first federal regulation adopting a specific technical standard for Title II web and mobile accessibility; the 20 April 2026 IFR modifies the compliance schedule
- License / access: U.S. Government work (public domain)
- Verified on: 2026-09-02 (the DOJ fact-sheet page read at the canonical URL; the technical standard and the compliance-date table extracted deterministically from the downloaded HTML, because summary fetches misreported the dates)
- Tier: T1
- Domains served: LEGAL-ADA

## Scope and applicability

- Binds public entities under Title II of the Americans with Disabilities Act: state and local governments, their agencies and departments, special purpose districts, and specified commuter authorities. Applies to their web content and mobile apps.
- Jurisdiction: US (state and local government). Rule class LEGAL.
- Technical standard adopted: WCAG 2.1 Level AA.

## Key facts (verified from the DOJ page)

- Compliance dates (from the fact sheet's compliance table, after the 20 April 2026 IFR extension):
  - state and local governments with a total population of 50,000 or more: 26 April 2027;
  - state and local governments with a total population of less than 50,000: 26 April 2028;
  - special district governments: 26 April 2028.
- After the applicable date, covered entities must keep their web content and mobile apps conforming to WCAG 2.1 Level AA.
- The rule includes exceptions (for example certain archived content, pre-existing conventional electronic documents, third-party content, and content with a minimal impact on access) with conditions; these are extracted in Phase 2.

## Candidate rules

- One primary `ADA-*` LEGAL rule: covered Title II entities must make web content and mobile apps conform to WCAG 2.1 Level AA by the applicable compliance date. It crosswalks (`equivalent`) to the WCAG 2.1 rules and carries jurisdiction US and the date/population applicability.
- Secondary `ADA-*` rules for the exceptions (archived content, conventional documents, third-party content, conforming alternate versions, minimal-impact noncompliance), each `rule_class: LEGAL`, jurisdiction US. Deferred to Phase 2 from the rule text.

## Cross-references

- WCAG 2.1 (to register per GAP-027) and WCAG 2.2 (SRC-W3C-WCAG22): the adopted standard is WCAG 2.1 Level AA; the WCAG rules are the equivalents.
- ADA guidance (SRC-DOJ-ADA-GUIDANCE): DOJ's broader position on the ADA and the web, including Title III; that guidance predates and is distinct from this regulation.
- Section 508 (SRC-USAB-SECTION508): the separate federal-agency track.

## Uncertainties and gaps

- This rule resolves the Title II part of GAP-007: state and local government web and mobile accessibility is WCAG 2.1 Level AA with the dated compliance schedule above. The Title III (private business) part is addressed by SRC-DOJ-ADA-GUIDANCE, which adopts no specific technical standard.
- The exceptions and their conditions were not extracted clause-by-clause this session; Phase 2 extracts them from the final rule.
- Compliance dates depend on population definitions in the rule (Section 35.104); Phase 2 records the definition when normalizing the applicability.
