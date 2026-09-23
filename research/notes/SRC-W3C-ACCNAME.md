# SRC-W3C-ACCNAME — Accessible Name and Description Computation

- Authority: W3C (Accessible Rich Internet Applications Working Group)
- Canonical URL: https://www.w3.org/TR/accname-1.1/ (current Recommendation); successor draft at https://www.w3.org/TR/accname-1.2/
- Version / date: Accessible Name and Description Computation 1.1, W3C Recommendation 18 December 2018 (REC-accname-1.1-20181218). Successor 1.2 is a W3C Working Draft dated 22 September 2026 (WD-accname-1.2-20260922)
- Source status: CURRENT (1.1 is the latest Recommendation; 1.2 is a Working Draft whose status section says it is inappropriate to cite as other than work in progress)
- Superseded by / supersedes: 1.1 replaced the name computation part of the WAI-ARIA 1.0 User Agent Implementation Guide (listed as the previous Recommendation in the 1.1 header). 1.2 will supersede 1.1 when it reaches Recommendation (tracked in `research/gaps.md`)
- License / access: 1.1 under the W3C document use rules (restrictive W3C Document License of its era); 1.2 draft under the W3C permissive document license. Paraphrase only
- Verified on: 2026-09-23 (headers, status sections, license lines, and 1.1 table of contents read from the downloaded HTML of both versions)
- Tier: T1
- Domains served: A11Y-ARIA

## Scope and applicability

- A user-agent specification: it defines the algorithm browsers use to compute the accessible name and description of an element from content, aria-labelledby, aria-label, native labelling (label, alt, caption), title, and so on, for exposure through accessibility APIs.
- Authors are not the conformance target, but audits depend on it: whether a control "has an accessible name" (WCAG 4.1.2, ARIA naming rules) is decided by this algorithm. Automated tools and the accessibility tree already apply it; the auditor needs it to explain why a name resolved to a given string.
- Platforms: web, pwa. Jurisdiction: GLOBAL.

## Structure (1.1, paraphrased)

- Conformance (RFC 2119 keywords; normative vs informative sections), Important terms, Name and Description (name computation, description computation, and the combined step-by-step algorithm with its terminology), Accessible Name and Description Mapping, change log.
- 1.2 draft keeps the same algorithmic purpose; its detailed differences from 1.1 were not extracted this session.

## Candidate rules

No author rules are minted from this source; it is a user-agent algorithm. It serves as the reference for:

- the evidence method of name-related checks (read the computed name from the accessibility tree, cite this algorithm for how it was derived);
- explanations in findings (for example why a placeholder or title produced a weak name);
- Phase 2 rule notes for WCAG 1.1.1, 2.4.6, 2.5.3 (Label in Name), 4.1.2 and the ARIA naming rules.

## Cross-references

- WAI-ARIA 1.2 (SRC-W3C-ARIA12) and ARIA in HTML (SRC-W3C-HTML-ARIA): define the naming attributes and where they are allowed.
- WCAG 2.2 (SRC-W3C-WCAG22): 2.5.3 Label in Name compares the visible label with the computed name.

## Uncertainties and gaps

- Whether WAI-ARIA 1.2 normatively references accname 1.1 or 1.2 was not checked this session; confirm in Phase 2 before citing a version in rule notes.
- The 1.2 Working Draft of 22 September 2026 is under active revision; register it as its own row when it reaches Recommendation (recorded in `research/gaps.md`).
