# SRC-W3C-ARIA12 — Accessible Rich Internet Applications (WAI-ARIA) 1.2

- Authority: W3C (Accessible Rich Internet Applications Working Group; now maintained by the ARIA Working Group)
- Canonical URL: https://www.w3.org/TR/wai-aria-1.2/ (latest published version). This version at verification: https://www.w3.org/TR/2023/REC-wai-aria-1.2-20230606/
- Version / date: W3C Recommendation, 6 June 2023
- Source status: CURRENT
- Superseded by / supersedes: supersedes WAI-ARIA 1.1 (the header names 1.1 as the previous Recommendation). No later version is a Recommendation: WAI-ARIA 1.3 is a published W3C Working Draft (latest WD-wai-aria-1.3-20260604, 4 June 2026; first public draft 23 January 2024) at https://www.w3.org/TR/wai-aria-1.3/, still on the Working Draft maturity level, not a Recommendation. So 1.2 remains the current Recommendation. This resolves the "later ARIA Recommendation" question in ledger action 2.
- License / access: open. The header reads "permissive document license rules apply", which links to the W3C Software and Document License 2023 (https://www.w3.org/copyright/software-license/): copy, modify, and distribute for any purpose with the required notice and a change statement. This is the permissive W3C license, more permissive than the W3C Document License used by WCAG 2.2 (which forbids derivative specifications); the two documents deliberately use different licenses, confirmed from their differing header wording.
- Verified on: 2026-09-02 (header, status section, conformance section, roles and states/properties sections, and the publication history read at the canonical URL; roles, attributes, and deprecations extracted deterministically from the downloaded HTML)
- Tier: T1
- Domains served: A11Y-ARIA

## Scope and applicability

- Applies to web content and applications: it defines the accessibility semantics (roles, states, properties) that authors add to host-language elements (HTML, SVG) so assistive technology can convey widgets, structures, and behaviors. Platforms `web` and `pwa`.
- Jurisdiction: GLOBAL as a technical standard. It is referenced indirectly by law only through WCAG (for example WCAG 4.1.2 Name, Role, Value is met by correct ARIA or native semantics).
- Conformance model (section 3): the specification states MUST/SHOULD requirements for user agents, assistive technologies, and authors. Section 3.4 requires conformance checkers to error on unmet author MUST requirements and warn on unmet author SHOULD requirements. This project audits the author requirements.
- Relationship to native semantics: ARIA supplements host-language semantics and must not be used where a native element already carries the role (the "first rule of ARIA use" lives in the separate ARIA in HTML document, not registered here; noted as a gap).

## Structure

Extracted from the 6 June 2023 Recommendation HTML on 2026-09-02:

- Roles: 94 defined roles. 12 are abstract (command, composite, input, landmark, range, roletype, section, sectionhead, select, structure, widget, window) and are used only to build the ontology. 82 are concrete roles authors may use. One concrete role is deprecated: directory (superseded by list).
- States and properties: 48 `aria-*` attributes, split into 10 states (aria-busy, aria-checked, aria-current, aria-disabled, aria-expanded, aria-grabbed, aria-hidden, aria-invalid, aria-pressed, aria-selected) and 38 properties (aria-activedescendant, aria-atomic, aria-autocomplete, aria-colcount, aria-colindex, aria-colspan, aria-controls, aria-describedby, aria-details, aria-dropeffect, aria-errormessage, aria-flowto, aria-haspopup, aria-keyshortcuts, aria-label, aria-labelledby, aria-level, aria-live, aria-modal, aria-multiline, aria-multiselectable, aria-orientation, aria-owns, aria-placeholder, aria-posinset, aria-readonly, aria-relevant, aria-required, aria-roledescription, aria-rowcount, aria-rowindex, aria-rowspan, aria-setsize, aria-sort, aria-valuemax, aria-valuemin, aria-valuenow, aria-valuetext). Two attributes are deprecated: the aria-dropeffect property and the aria-grabbed state.
- Each role definition carries characteristics: superclass and subclass roles, required and supported states and properties, required context role, required owned elements, name-from, and whether naming is prohibited. These characteristics are the machine-readable basis for the author-conformance rules below.
- Key sections: 3 Conformance; 5 The Roles Model (5.3 Categorization of Roles); 6 Supported States and Properties (6.6 taxonomy, 6.7 definitions).
- Normative vs informative: section 3 states that the main content is normative and that introductory material, appendices, examples, diagrams, and notes are informative.
- Errata: an errata page exists (linked from the status section); re-check it before normalizing any specific requirement (mirrors the WCAG errata handling in GAP-028).

## Candidate rules

The audit-relevant normative content is the set of author-conformance requirements, not one rule per role. The 94 roles and 48 attributes are the vocabulary the rules and the audit engine consult, not individual rules. Each row below is quoted or closely paraphrased from a MUST/SHOULD sentence read in the document. All are rule_class NORMATIVE, authority W3C, platforms web and pwa, jurisdictions GLOBAL, category accessibility, subcategory names-roles-values unless noted.

| proposed_id | strength | paraphrase (grounded in the conformance and role sections) | auto | visual | manual |
|---|---|---|---|---|---|
| ARIA-abstract-roles | MUST | Authors do not use abstract roles in content ("Content authors MUST NOT use abstract roles because they are not implemented in the API binding") | FULL | NONE | PARTIAL |
| ARIA-required-states | MUST | Authors provide a non-empty value for every state and property a role marks required ("Content authors MUST provide a non-empty value for required states and properties") | FULL | NONE | PARTIAL |
| ARIA-undefined-required | MUST | Authors do not set a required state or property to `undefined` unless the role explicitly supports that value | FULL | NONE | PARTIAL |
| ARIA-prohibited-states | MUST | Authors do not specify a state or property that a role prohibits ("Authors MUST NOT specify a prohibited state or property") | FULL | NONE | PARTIAL |
| ARIA-name-prohibited | MUST | Authors do not use aria-label or aria-labelledby to name a role whose name is prohibited (for example generic, presentation, none) | FULL | NONE | PARTIAL |
| ARIA-required-context | MUST | An element whose role has a required context role is contained in or owned by an element with that context role (for example listitem within list) | PARTIAL | NONE | FULL |
| ARIA-required-owned | MUST | When a container role that requires owned elements is temporarily missing them due to script or loading, a containing element is marked aria-busy=true; the role's required owned elements are otherwise present | PARTIAL | NONE | FULL |
| ARIA-valid-value | MUST | Each aria-* attribute holds a value of the type the specification defines for it (true/false, tristate, id reference, id reference list, integer, number, token, token list, string) | FULL | NONE | PARTIAL |
| ARIA-focus-management | MUST | Authors manage focus on the container roles that require it: grid, listbox, menu, menubar, radiogroup, tree, treegrid, tablist | PARTIAL | PARTIAL | FULL |
| ARIA-application-text | MUST | Non-decorative static text or image content inside an element with role application is exposed to assistive technology by one of the documented techniques (grounded in the verbatim sentence "authors MUST use one of the following techniques to ensure all non-decorative static text or image content inside an application is" accessible) | NONE | NONE | FULL |
| ARIA-deprecated | SHOULD | Authors avoid the role and attributes deprecated in this version: role directory, aria-dropeffect, aria-grabbed | FULL | NONE | PARTIAL |

Notes for normalization (Phase 2):
- ARIA-required-states, ARIA-required-context, ARIA-required-owned, and ARIA-valid-value are parameterized by the per-role and per-attribute characteristic tables in sections 5 and 6.7. Normalization should reference those tables rather than expand one rule per role, and should record the role or attribute set each check ranges over.
- Several SHOULD-level, pattern-specific author recommendations exist per role (for example "mark no more than one element with the banner role", alertdialog focus and modality). These map better to BEST_PRACTICE rules sourced from the APG (SRC-W3C-APG); register them there to avoid duplicating role-specific guidance as NORMATIVE.
- ARIA rules crosswalk to WCAG-4.1.2 (Name, Role, Value) and WCAG-4.1.3 (Status Messages): correct ARIA is one way to satisfy those criteria. Add `related_rules` at normalization.

## Cross-references

- WCAG 2.2 (SRC-W3C-WCAG22): 4.1.2 and 4.1.3 are met through correct semantics, native or ARIA; ARIA is not itself cited by law but underpins those criteria.
- ARIA Authoring Practices Guide (SRC-W3C-APG): informative patterns showing how to apply these roles and attributes; source of component BEST_PRACTICE rules.
- ARIA in HTML (https://www.w3.org/TR/html-aria/): the normative document defining which ARIA roles/attributes are allowed on which HTML elements and the "only when necessary" rule. Not registered yet; raised as a gap.
- Accessible Name and Description Computation (accname): defines how aria-label/aria-labelledby resolve to an accessible name. Not registered yet; relevant to naming rules.

## Uncertainties and gaps

- WAI-ARIA 1.3 is a published Working Draft (4 June 2026), not a Recommendation; when it reaches Recommendation, register it and record the 1.2 to 1.3 delta (it adds attributes such as aria-description, aria-braillelabel, aria-brailleroledescription, aria-colindextext, aria-rowindextext). Raised as GAP-030.
- Two companion documents are needed to audit ARIA fully: ARIA in HTML (now a Recommendation, 11 August 2026) and Accessible Name and Description Computation (accname). Raised as GAP-031.
- Deprecation strength: the specification deprecates directory, aria-dropeffect, and aria-grabbed; it does not use a MUST NOT for them, so ARIA-deprecated is modeled as SHOULD. Confirm at normalization.
- Testability values are estimates from the conformance model; Phase 2 sets them per rule with evidence types (accessibility tree nodes, role/name/state).
