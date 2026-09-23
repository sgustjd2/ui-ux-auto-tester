# SRC-APPLE-HIG — Apple Human Interface Guidelines

- Authority: Apple Inc.
- Canonical URL: https://developer.apple.com/design/human-interface-guidelines/
- Version / date: living document, no version number; snapshot 2026-09-02. "What's new" tracks recent additions
- Source status: CURRENT
- Superseded by / supersedes: continuously updated; supersedes prior HIG editions
- License / access: Apple Developer content, copyright Apple; viewable for reference, not openly licensed. Store metadata, structure, and paraphrases only; no verbatim reproduction
- Verified on: 2026-09-23 change log re-checked (see below); 2026-09-02 (rendered in the browser pane; the page is a JavaScript app that summary fetch could not read. Top-level structure and Foundations list read from the rendered page)
- Tier: T2
- Domains served: PLAT-APPLE-HIG, PLAT-FORM-FACTORS, UX-DESTRUCTIVE-ACTIONS, UX-COMPONENTS, VIS-TYPOGRAPHY, VIS-SPACING, VIS-COLOR, VIS-ICONS, VIS-ADAPTIVE, VIS-ORIENTATION, VIS-SAFE-AREAS, OTH-DESIGN-SYSTEM

## Scope and applicability

- Apple's design guidance for apps across its platforms (iOS, iPadOS, macOS, watchOS, tvOS, visionOS). Platform PLATFORM guidance for the Apple form factors.
- Jurisdiction: GLOBAL (vendor guidance). Rule class PLATFORM.

## Structure

Read from the rendered page:

- Top-level Topics: Getting started, Foundations, Patterns, Components, Inputs, Technologies.
- Foundations includes: Accessibility, App icons, Color, Layout, Materials, Typography (among others).
- Design fundamentals: design principles and per-platform "Designing for iOS / macOS" guidance.

## Candidate rules

- PLATFORM rule families per Foundations topic (layout, typography, color, materials, icons) and per Component (buttons, menus, sheets, alerts, and the rest), plus destructive-action patterns (alerts, confirmation) and platform interaction conventions. Rule class PLATFORM, platforms ios/ipados/macos (map to the registry's ios/desktop), jurisdiction GLOBAL.
- Extraction per topic/component is deferred to Phase 2 (paraphrase only, Apple copyright). Where a HIG rule repeats a WCAG threshold, the NORMATIVE rule stays the WCAG rule and the HIG rule links to it.

## Cross-references

- Apple accessibility (SRC-APPLE-A11Y): the accessibility Foundation, registered separately.
- Material Design (SRC-GOOGLE-MATERIAL3): the Android/Google counterpart; UX-COMPONENTS, VIS-*, and OTH-DESIGN-SYSTEM draw on both.
- WCAG (SRC-W3C-WCAG22): the accessibility baseline the HIG references.

## Change log re-check (2026-09-23)

Read at https://developer.apple.com/design/whats-new/ (server-rendered; dated entries, paraphrased). Entries after the 2026-09-02 snapshot, plus the major 2025 redesign for context:

- 9 June 2025 (WWDC25): new Liquid Glass design language across iOS/iPadOS 26 and macOS 26; rebuilt UI kits, Icon Composer, SF Symbols 7; Liquid Glass follow-up guidance updates on 28 July, 9 September, and 16 December 2025 (the 20 August, 12 September, and 4 December 2025 entries were Figma kits, new-device layout specs, and an article, not Liquid Glass changes; corrected after review).
- 24 March 2026: sheets (button placement) and scroll views (visionOS Look to Scroll) updated.
- 8 June 2026 (WWDC26): iOS/iPadOS 27 and macOS 27 kits, Icon Composer 2 beta, SF Symbols 8 beta, Pass Designer; design principles reintroduced; Siri revised for Siri AI; new Snippets page; app schemas for App Shortcuts; menus, sidebars, and scroll edge effects updated; app icons refined for Liquid Glass.
- 23 June 2026: updated Figma kits for iOS/iPadOS 27 and macOS 27.
- 9 September 2026: new page "Designing for iPhone Duo", the first folding iPhone (device poses, dynamic layouts across dual displays, toolbars and tab bars on the vertical axis); Layout, Branding, and SharePlay guidance updated.
- 17 to 18 September 2026: new iOS/iPadOS 27 and macOS 27 Figma kits; In-App Purchase guidance rebranded and refined; bezels for iPhone Duo and iPhone 18 models.

Audit impact: layout and adaptivity rules for iOS must now consider a foldable form factor with device poses (PLAT-FORM-FACTORS, VIS-ADAPTIVE), and Phase 2 should confirm whether the visual-material guidance (Liquid Glass) says anything about legibility over content that bears on contrast checks; WCAG contrast remains the normative floor either way. The change log itself does not make that claim. Rules are extracted in Phase 2 from the pages themselves, not from this change log.

## Uncertainties and gaps

- Living document with no version; the snapshot date is the verification date. Re-verify per `docs/standards-research-plan.md` §5.
- Per-topic and per-component rules were not extracted this session; deferred to Phase 2.
- Apple content is copyrighted and viewable for reference only; rules are formulated independently and cite the HIG, with no verbatim text (as with licensed standards).
