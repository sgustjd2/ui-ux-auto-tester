# SRC-W3C-HTML-ARIA — ARIA in HTML

- Authority: W3C (published by the Accessible Rich Internet Applications Working Group; an HTML specification module)
- Canonical URL: https://www.w3.org/TR/html-aria/
- Version / date: W3C Recommendation 11 August 2026 (REC-html-aria-20260811), as printed in the header
- Source status: CURRENT
- Superseded by / supersedes: the document states it first became a W3C Recommendation on 9 December 2021; the 11 August 2026 publication is the current revision of that Recommendation, with dated substantive changes listed in its status section
- License / access: W3C permissive document license (header: "liability, trademark and permissive document license rules apply"); short quotation with attribution allowed; paraphrase used here
- Verified on: 2026-09-23 (header, status section, change list, and table of contents read from the downloaded HTML)
- Tier: T1
- Domains served: A11Y-ARIA

## Scope and applicability

- Defines the author conformance requirements for using WAI-ARIA 1.2 and DPUB-ARIA 1.1 attributes on HTML elements: which roles and aria-* attributes each HTML element may carry, and which uses are forbidden or not recommended.
- Its stated primary audience is conformance checkers used by authors, which makes it directly machine-checkable: an automated rule can compare an element's role and attributes against the allowed set.
- Platforms: web, pwa (and web views). Jurisdiction: GLOBAL. Rule class NORMATIVE for the conformance requirements in §4 and the per-element table in §1; §3 is author guidance (informative).

## Structure (paraphrased, from the table of contents)

1. Author requirements for use of ARIA in HTML (the per-element table of implicit role, allowed roles, and allowed aria-* attributes).
2. ARIA semantics that extend and diverge from HTML (non-normative).
3. Author guidance to avoid incorrect use of ARIA: do not override interactive elements with non-interactive roles, avoid redundant roles, be cautious of side effects, follow the rules of ARIA and of HTML.
4. Document conformance requirements for ARIA attributes in HTML: attributes used to name elements, ARIA attributes in place of equivalent HTML attributes, deprecated ARIA roles/states/properties, and case requirements.
5. Allowed descendants of ARIA roles.
6. Conformance (including conformance-checking requirements).
7. Privacy and security considerations.

§4.4 (case requirements for role and aria-* attribute values) yields a further candidate check not listed below; Phase 2 adds it.

Recent substantive changes listed in the status section (paraphrased): September 2025 clarification of the summary element; July 2025 additions for the label element, the new selectedcontent element and button allowances inside a customized select, and clarification that the html element is generic; December 2024 additions allowing the math role on img, the image role as preferred synonym of img, and aria-hidden with the hidden attribute. These track new HTML features (customizable select), so audits of current markup need this revision rather than older snapshots.

## Candidate rules

| Proposed ID | Source item | Paraphrase | Class | Strength | Testability |
|---|---|---|---|---|---|
| HTMLARIA-allowed-role-001 | §1 table | An element carries only roles the table allows for it | NORMATIVE | MUST | automated FULL |
| HTMLARIA-allowed-attr-001 | §1 table | An element carries only aria-* attributes allowed for its role | NORMATIVE | MUST | automated FULL |
| HTMLARIA-naming-001 | §4.1 | Naming attributes are not used on elements or roles that prohibit naming | NORMATIVE | MUST | automated FULL |
| HTMLARIA-native-equivalent-001 | §4.2 | An ARIA attribute is not used in place of, or in contradiction to, the equivalent native HTML attribute | NORMATIVE | MUST or SHOULD per row (confirm per row in Phase 2) | automated FULL |
| HTMLARIA-deprecated-001 | §4.3 | Deprecated ARIA roles, states, and properties are not used | NORMATIVE | SHOULD (confirm wording in Phase 2) | automated FULL |
| HTMLARIA-redundant-role-001 | §3.2 | Redundant explicit roles matching the implicit role are avoided | BEST_PRACTICE | SHOULD | automated FULL |
| HTMLARIA-interactive-override-001 | §3.1 | Interactive elements are not given non-interactive roles | BEST_PRACTICE (§3 is guidance; the binding form is the §1 allowed-roles table) | SHOULD | automated FULL |

The prefix `HTMLARIA` is registered in `docs/rule-schema.md` §8. Normative strength per row must be read from the exact sentences in Phase 2; the table above records the section, not a verified MUST/SHOULD per row.

## Cross-references

- WAI-ARIA 1.2 (SRC-W3C-ARIA12): defines the roles and attributes; this module constrains their use on HTML elements. Together they give the "use native semantics first" basis for the `prd.md` §7.8 fix order.
- WHATWG HTML (SRC-WHATWG-HTML): defines the elements; new elements (selectedcontent, customizable select) appear here first.
- Accessible Name and Description Computation (SRC-W3C-ACCNAME): how the naming attributes resolve.
- WCAG 2.2 4.1.2 Name, Role, Value (SRC-W3C-WCAG22): ARIA misuse often surfaces as a 4.1.2 failure; crosswalk with `related_rules: overlaps`.
- ACT Rules (SRC-W3C-ACT-RULES): several ACT rules test ARIA attribute and role validity.

## Uncertainties and gaps

- Per-row normative strength (MUST vs SHOULD vs "not recommended") must be confirmed from the text in Phase 2 before rules are minted.
- GAP-031 recorded this as "now a Recommendation, 11 August 2026"; the document itself says it has been a Recommendation since 9 December 2021 and 11 August 2026 is the current revision. Corrected in the GAP-031 resolution.
