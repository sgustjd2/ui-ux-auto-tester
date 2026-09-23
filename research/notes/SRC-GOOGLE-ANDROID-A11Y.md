# SRC-GOOGLE-ANDROID-A11Y — Android accessibility developer guidance

- Authority: Google (Android Developers)
- Canonical URL: https://developer.android.com/guide/topics/ui/accessibility
- Version / date: living documentation; the page footer showed "last updated 2026-04-22"
- Source status: CURRENT
- Superseded by / supersedes: continuously updated
- License / access: Google Developers content under the Content License (Creative Commons Attribution 2.5, per developer.android.com/license); code samples under Apache 2.0. Attribution required
- Verified on: 2026-09-02 (page rendered and read at the canonical URL; last-updated date and license confirmed)
- Tier: T2
- Domains served: PLAT-ANDROID-A11Y, A11Y-MOBILE-WCAG, VIS-TEXT-SCALING

## Scope and applicability

- Google's guidance for building accessible Android apps. Covers content labels, touch target size, color contrast, focus management, and support for assistive technologies (TalkBack), with testing via the Accessibility Scanner.
- Jurisdiction: GLOBAL. Rule class PLATFORM. One of the platform sources covering mobile WCAG application (A11Y-MOBILE-WCAG).

## Structure and key content (read at the canonical URL)

- Getting started with accessibility; principles (perceivable, operable, understandable).
- Key practices: content labels for UI elements, minimum touch target size, sufficient color contrast, logical focus order, and support for low-vision and assistive-technology users.
- Testing: Accessibility Scanner; links to making apps accessible, testing accessibility, and building custom accessibility services. References Material Design as an accessibility guideline.

## Candidate rules

- PLATFORM rule families: content labels / accessible names; touch target size; color contrast (deferring to WCAG); focus order and management; text scaling (font size / sp units); assistive-technology support. Rule class PLATFORM, platform android, jurisdiction GLOBAL. Contrast and text-scaling rules crosswalk to WCAG.
- Extraction is deferred to Phase 2.

## Cross-references

- Material Design (SRC-GOOGLE-MATERIAL3): the Android design system, referenced for accessibility.
- WCAG 2.2 (SRC-W3C-WCAG22) and WCAG2ICT (SRC-W3C-WCAG2ICT): the accessibility baseline and non-web mapping.
- Apple accessibility (SRC-APPLE-A11Y): the iOS counterpart.

## Uncertainties and gaps

- Living documentation; last-updated 2026-04-22 recorded. Re-verify per §5.
- Per-practice rules not extracted this session; deferred to Phase 2.
