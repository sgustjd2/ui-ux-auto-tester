# SRC-GOVUK-DESIGN-SYSTEM — GOV.UK Design System

- Authority: UK Government Digital Service (GDS)
- Canonical URL: https://design-system.service.gov.uk/
- Version / date: living system; snapshot 2026-09-02
- Source status: CURRENT
- Superseded by / supersedes: continuously updated
- License / access: content under the Open Government Licence v3.0 (Crown copyright, read at the site footer); the GOV.UK Frontend codebase is MIT (per the alphagov/govuk-frontend repository, not shown on the site). Attribution required
- Verified on: 2026-09-02 (identity, owner, top-level sections, evidence-based framing, and Open Government Licence read at the canonical URL)
- Tier: T3
- Domains served: UX-FORMS, UX-CONTENT-MICROCOPY

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

## Uncertainties and gaps

- Living system; snapshot dated. Re-verify per §5.
- Per-pattern rules not extracted this session; deferred to Phase 2.
- Open Government Licence permits reuse with attribution; short attributed quotes are allowed where precise.
