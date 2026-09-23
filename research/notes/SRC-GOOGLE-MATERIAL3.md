# SRC-GOOGLE-MATERIAL3 — Material Design 3

- Authority: Google
- Canonical URL: https://m3.material.io/
- Version / date: Material Design 3 (Material You); living design system. Current design language is M3 Expressive (introduced at Google I/O 2025); the site's latest news at verification was Google I/O 2026 (Compose-first Android). Snapshot 2026-09-02
- Source status: CURRENT
- Superseded by / supersedes: Material Design 3 supersedes Material Design 2; M3 Expressive is the current update within M3
- License / access: open-source design system. Material component code is under Apache 2.0. The guidance-content license (typically Creative Commons Attribution for Google design content) was not confirmable at the m3.material.io footer, which is a JavaScript app with no readable legal text; recorded as an uncertainty. Store metadata and paraphrase; short attributed quotes only if the content license is confirmed
- Verified on: 2026-09-02 (rendered in the browser pane; JavaScript app not readable by summary fetch. Identity, the M3 Expressive design language, the I/O 2026 news, and structure read from the rendered page)
- Tier: T2
- Domains served: PLAT-MATERIAL, PLAT-FORM-FACTORS, UX-STATES, UX-DESTRUCTIVE-ACTIONS, UX-COMPONENTS, VIS-TYPOGRAPHY, VIS-SPACING, VIS-ALIGNMENT, VIS-GRID, VIS-COLOR, VIS-ICONS, VIS-IMAGERY, VIS-DENSITY, VIS-ADAPTIVE, OTH-RTL, OTH-DESIGN-SYSTEM

## Scope and applicability

- Google's open-source design system for building products on Android (Compose-first), web, and Flutter. It defines foundations, styles, and components with design tokens.
- Jurisdiction: GLOBAL. Rule class PLATFORM (or BEST_PRACTICE for general design guidance). Platforms android, web (and cross-platform via Flutter).

## Structure (read from the rendered page)

- Top level: Foundations, Styles, Components (the standard M3 sections), plus Get started and Develop.
- Current update M3 Expressive adds expressive color, motion physics, an expanded shape library, adaptive components, and flexible typography; components include toolbars, split buttons, button groups, and updated progress indicators.

## Candidate rules

- PLATFORM/BEST_PRACTICE rule families across: color and theming, typography scale, spacing and layout grid, elevation and shape, motion, iconography, density, adaptive/responsive layout, RTL, and per-component behavior (buttons, dialogs, menus, lists, navigation, and the rest), plus component states (enabled, hovered, focused, pressed, dragged, disabled) and destructive-action patterns. Rule class PLATFORM, platforms android/web, jurisdiction GLOBAL.
- Design tokens are the machine-readable layer; Phase 2 can map token-based rules where useful. Extraction is deferred to Phase 2 (paraphrase; content is CC-BY, so short attributed quotes are permitted where precise).

## Cross-references

- Apple HIG (SRC-APPLE-HIG): the Apple counterpart; UX-COMPONENTS, VIS-*, and OTH-DESIGN-SYSTEM draw on both.
- Android accessibility (SRC-GOOGLE-ANDROID-A11Y): references Material as an accessibility guideline.
- WCAG (SRC-W3C-WCAG22): the accessibility baseline Material aligns to for contrast and states.
- ARIA APG (SRC-W3C-APG): the web-semantics layer for Material web components.

## Uncertainties and gaps

- Living system; snapshot dated. M3 Expressive is the current design language (introduced at Google I/O 2025); the homepage also surfaced Google I/O 2026 news. Re-verify per section 5. Confirm the guidance-content license at a reachable location.
- Per-component and per-foundation rules not extracted this session; deferred to Phase 2.
- The exact top-level section labels were read partially from the rendered home page; confirm the full Foundations/Styles/Components tree at extraction time.
