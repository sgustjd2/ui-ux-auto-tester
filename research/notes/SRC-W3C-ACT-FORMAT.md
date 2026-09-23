# SRC-W3C-ACT-FORMAT — Accessibility Conformance Testing (ACT) Rules Format 1.1

- Authority: W3C (Accessibility Guidelines Working Group)
- Canonical URL: https://www.w3.org/TR/act-rules-format/
- Version / date: W3C Recommendation 5 February 2026 (REC-act-rules-format-1.1-20260205), as printed in the header
- Source status: CURRENT
- Superseded by / supersedes: 1.1 coexists with the earlier ACT Rules Format 1.0 (its date was not re-read this session); the status section says 1.1 is not fully backwards compatible with 1.0 and the Working Group encourages writing rules compatible with 1.1. No changes since the Candidate Recommendation of 19 August 2025
- License / access: W3C document use rules (restrictive document license, as the header states); paraphrase only
- Verified on: 2026-09-23 (header, status section, table of contents, and change summary read from the downloaded HTML)
- Tier: T1
- Domains served: A11Y-WCAG22

## Scope and applicability

- A format for writing accessibility test rules usable by automated tools and by manual testing methodologies, so that test procedures can be documented, shared, compared, and harmonized. It does not itself contain accessibility requirements.
- Relevance: it is the W3C-standard shape of a machine-or-human test procedure, with explicit applicability, expectations, and outcome mapping to accessibility requirements. That is exactly the shape this project needs for the `testability`, `automated_check`, and `manual_check` parts of rule records (`docs/rule-schema.md`) and for check results (`docs/finding-schema.md` §2).
- Platforms: technology-neutral (web primarily). Jurisdiction: GLOBAL.

## Structure (paraphrased)

- Rule types: atomic rules (test one input aspect) and composite rules (combine atomic rules).
- Rule structure: identifier, description, rule type, accessibility requirements mapping (outcome mapping to conformance requirements and, new in 1.1, secondary requirements; mapping outside WCAG; rules without requirements; external requirement mappings), input aspects or input rules, applicability (atomic and composite, with an optional applicability type designation), expectations, background (assumptions, accessibility support, related rules), examples (passed, failed, inapplicable), rule versions, glossary, issues list, implementations (with consistency levels).
- Rule accuracy and harmonization sections; Appendix 1 expresses results in JSON-LD with EARL (Evaluation and Report Language).
- Two major changes from 1.0, per the status section: two types of accessibility requirements (conformance and secondary), and subjective applicability (applicability that needs human judgment).

## Candidate rules

No audit rules. It is a methodology source. Candidate project decisions for Phase 2 and Phase 3 (recorded, not decided):

- Map ACT outcomes to this project's check results: passed to PASS, failed to FAIL, inapplicable to NOT_APPLICABLE; untested aspects to NOT_TESTED; PARTIAL has no ACT equivalent and stays project-specific.
- Reuse ACT applicability and expectation wording when writing `automated_check` and `manual_check` for WCAG rules, and cite the ACT rule ID in `notes` or `related_rules`.
- Consider EARL/JSON-LD compatibility for the Phase 3 JSON output schema (GAP-019).

## Cross-references

- ACT Rules published on the WAI website (SRC-W3C-ACT-RULES): the concrete rules written in this format.
- WCAG 2.2 (SRC-W3C-WCAG22): the main conformance requirements ACT rules map to.
- `docs/finding-schema.md` §2 and `docs/rule-schema.md` §5: the project structures this format informs.

## Uncertainties and gaps

- The outcome-to-check-result mapping above is a proposal; Phase 3 decides it (recorded in `research/gaps.md`).
