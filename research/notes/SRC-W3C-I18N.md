# SRC-W3C-I18N — W3C Internationalization techniques and articles

- Authority: W3C Internationalization (i18n) Activity
- Canonical URL: https://www.w3.org/International/ (entry point); techniques index verified at https://www.w3.org/International/techniques/authoring-html
- Version / date: living reference library. Techniques index "Authoring web pages": first published 13 February 2008, last updated 30 March 2026 (dates embedded in the page source). Sample article "Personal names around the world" (https://www.w3.org/International/questions/qa-personal-names): first published 17 August 2011, version dated 24 January 2016 (last substantive update 17 August 2011 per the source repository, as reported by the research reviewer)
- Source status: CURRENT
- Superseded by / supersedes: continuously updated; individual articles carry their own dates
- License / access: W3C website content. The site footer is script-rendered and the license text was not captured; W3C site pages are generally under the W3C Software and Document License, but that is unconfirmed for these pages (recorded as an uncertainty). Paraphrase only
- Verified on: 2026-09-23 (techniques index and one representative article downloaded and read; topic structure extracted)
- Tier: T2
- Domains served: OTH-LOCALIZATION, OTH-I18N, OTH-RTL

## Scope and applicability

- The W3C i18n Activity publishes a techniques index for authoring HTML and CSS plus a collection of articles (questions and answers, tutorials) on characters, language, text direction, forms, names, dates, and layout. It is a homogeneous living reference library under one authority, so it stays one row (`docs/standards-research-plan.md` §4); Phase 2 cites individual articles per rule and verifies a representative page per sole-source domain.
- Formal W3C i18n specifications with their own metadata (for example the Hangul layout requirements) are registered as separate rows (SRC-W3C-KLREQ).
- Platforms: web, pwa (principles transfer to apps). Jurisdiction: GLOBAL. Rule class BEST_PRACTICE; where an article restates a normative HTML or CSS requirement, the rule anchors to that specification instead.

## Structure (techniques index topics, paraphrased)

- Characters: choosing and declaring UTF-8, escapes, normalization, encoding issues in forms, unavailable glyphs, non-ASCII addresses.
- Language: declaring the page language, marking in-document language changes, choosing language tags, audience language metadata, link destination language, browser language preferences and Accept-Language.
- Markup and text: b and i usage, ruby, form controls, strings in JavaScript and databases, marking what should not be translated.
- Styling and layout: preparing for text expansion in translation, styling by language, writing modes, bidirectional text, fonts, inline annotations and decoration.
- Navigation: guiding users to translated pages, letting users switch and remember a language choice rather than relying only on language negotiation.
- Article sample (personal names): name structures differ (order, multiple family names, patronymics, variant forms), so forms should avoid assuming given/family splits and should support the needed characters; formality and honorifics vary by culture.

## Candidate rules

| Proposed ID | Topic | Paraphrase | Class | Strength | Testability |
|---|---|---|---|---|---|
| I18N-lang-001 | Language | The page declares its primary language and marks passages in another language | BEST_PRACTICE (overlaps WCAG 3.1.1 and 3.1.2, which are the normative anchors) | SHOULD | automated FULL for presence; manual for correctness |
| I18N-expansion-001 | Text expansion | Layouts tolerate translated text growth without clipping or overlap | BEST_PRACTICE | SHOULD | visual PARTIAL (needs localized or pseudo-localized render) |
| I18N-bidi-001 | Bidirectional text | Right-to-left content sets direction in markup and mirrors layout where appropriate | BEST_PRACTICE | SHOULD | automated PARTIAL; visual FULL with RTL render |
| I18N-names-001 | Personal names | Name fields do not force a given/family split or reject valid characters | BEST_PRACTICE | SHOULD | manual FULL; automated PARTIAL (field inspection) |
| I18N-lang-switch-001 | Navigation | Users can switch language explicitly and the choice persists | BEST_PRACTICE | SHOULD | manual FULL |
| I18N-no-translate-001 | Markup | Content that must not be translated is marked so | BEST_PRACTICE | MAY | automated PARTIAL |

## Cross-references

- WCAG 2.2 3.1.1 and 3.1.2 (SRC-W3C-WCAG22): normative language-of-page and language-of-parts criteria; the I18N language rule crosswalks to them.
- Material 3 (SRC-GOOGLE-MATERIAL3): RTL and bidirectionality guidance for OTH-RTL.
- Requirements for Hangul Text Layout and Typography (SRC-W3C-KLREQ): Korean-specific layout requirements.
- GOV.UK Design System (SRC-GOVUK-DESIGN-SYSTEM): name and address field patterns overlap with the names article.

## Uncertainties and gaps

- License text not captured from the script-rendered footer; confirm before quoting any article.
- Several articles are old (the names article was last updated in 2016). Phase 2 records each cited article's date and prefers recently reviewed pages.
- Locale-sensitive date, number, and currency formatting (`prd.md` §10.12) is covered here only indirectly; Phase 2 may need Unicode CLDR or ECMAScript Intl as anchors (recorded in `research/gaps.md`).
