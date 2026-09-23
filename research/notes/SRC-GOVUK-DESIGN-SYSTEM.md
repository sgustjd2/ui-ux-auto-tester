# SRC-GOVUK-DESIGN-SYSTEM — GOV.UK Design System

- Authority: UK Government Digital Service (GDS)
- Canonical URL: https://design-system.service.gov.uk/
- Version / date: living system; snapshot 2026-09-02, Addresses and Names pattern pages read 2026-09-23
- Source status: CURRENT
- Superseded by / supersedes: continuously updated
- License / access: content under the Open Government Licence v3.0 (Crown copyright, read at the site footer); the GOV.UK Frontend codebase is MIT (per the alphagov/govuk-frontend repository, not shown on the site). Attribution required
- Verified on: 2026-09-23 (Addresses and Names pattern pages read for localization); 2026-09-02 (identity, owner, top-level sections, evidence-based framing, and Open Government Licence read at the canonical URL)
- Tier: T3
- Domains served: UX-FORMS, UX-CONTENT-MICROCOPY, OTH-LOCALIZATION

## Scope and applicability

- The UK government's design system: styles, components, and patterns for building government services, backed by cross-government research and the Government Design Principles. Especially strong on forms (question pages, error handling, one-thing-per-page) and plain-language content.
- Jurisdiction: GLOBAL as design guidance (developed for GB government services but broadly applicable). Rule class BEST_PRACTICE. Platform web.

## Structure

- Sections: Get started, Styles, Components, Patterns, Community, Accessibility. Patterns include forms-related flows (ask users for information, validation and error summaries) and content patterns.

## Candidate rules

- BEST_PRACTICE rule families for form UX (labels and hints, one question per page where appropriate, error summary and inline errors, autocomplete, accessible validation) and content/microcopy (plain language, question wording). Rule class BEST_PRACTICE, platform web, jurisdiction GLOBAL. They produce UX_RISK findings and crosswalk to WCAG form and error criteria (3.3.x) and to the ARIA APG.
- The GOV.UK error-summary and question-page patterns are well-evidenced and map closely to WCAG 3.3.1/3.3.2/3.3.3. Extraction is deferred to Phase 2.

## Cross-references

- WCAG (SRC-W3C-WCAG22): the form and error criteria the GOV.UK patterns help satisfy.
- NN/g articles (SRC-NNG-ARTICLES): overlapping forms and content guidance.
- ARIA APG (SRC-W3C-APG): the semantics layer for the components.

## Localization-relevant patterns (read 2026-09-23)

- Addresses (https://design-system.service.gov.uk/patterns/addresses/): address lookups generally work only for UK addresses; say so when using one, provide a manual entry option for international addresses, and prefer multiple text inputs or a textarea when collecting mostly international addresses.
- Names (https://design-system.service.gov.uk/patterns/names/): not everyone's name fits a first-name and last-name format; a single full-name field accommodates the broadest range of names; fields must be long enough for users' names (size them from population or user data) and accept all the characters users may need; where multiple fields are used for users outside the UK, label them Given names and Family name rather than First name and Last name.
- Candidate rules: GOVUK-addresses-001 (an address lookup that works only for domestic addresses says so and offers manual entry; services collecting mostly international addresses use free-form fields), BEST_PRACTICE, SHOULD, testability manual FULL; GOVUK-names-001 (name entry does not force a given-name and family-name split unless the service needs it, accepts all characters users need, and is long enough), BEST_PRACTICE, SHOULD, testability automated PARTIAL (field attributes), manual FULL.
- These give BEST_PRACTICE anchors (T3) for the name and address assumptions in `prd.md` §10.12, alongside the W3C personal-names article (SRC-W3C-I18N). The guidance is written for UK government services; applying it to other markets is this project's interpretation.

## Uncertainties and gaps

- Living system; snapshot dated. Re-verify per §5.
- Per-pattern rules not extracted this session; deferred to Phase 2.
- Open Government Licence permits reuse with attribution; short attributed quotes are allowed where precise.
