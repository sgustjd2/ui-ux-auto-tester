# SRC-W3C-APG — ARIA Authoring Practices Guide (APG)

- Authority: W3C Web Accessibility Initiative (WAI), ARIA Working Group
- Canonical URL: https://www.w3.org/WAI/ARIA/apg/
- Version / date: living resource, no version number; footer copyright 2026 at verification (snapshot date 2026-09-02). It is published under /WAI/, not on the /TR/ Recommendation track.
- Source status: CURRENT
- Superseded by / supersedes: none (continuously updated; supersedes the older "WAI-ARIA Authoring Practices 1.1" TR note, which it replaced)
- License / access: open. Footer states W3C liability, trademark and permissive license rules apply unless otherwise noted (W3C Software and Document License 2023, as with the WCAG Understanding companion). Code in examples is under the W3C Software License.
- Verified on: 2026-09-02 (home page, patterns index, About page, and one pattern page read at the canonical URL)
- Tier: T2
- Domains served: A11Y-APG, UX-COMPONENTS

## Scope and applicability

- The APG is an informative educational guide that shows how to apply WAI-ARIA (SRC-W3C-ARIA12) roles, states, and properties, plus keyboard interaction, to common UI patterns. It is not a W3C Recommendation and is not a conformance standard: it sits under /WAI/ (guidance), not /TR/ (standards). Following it is one way to build accessible widgets, but conformance is judged against WCAG and ARIA, not against the APG.
- Platforms: web and pwa. It informs component behavior expectations the audit engine checks (keyboard operation, roles, states) but only through BEST_PRACTICE rules that defer to WCAG (NORMATIVE) and ARIA (NORMATIVE) where those apply.

## Structure

- Sections: Patterns, Practices, Index, About, plus "All WCAG 2 Guidance". The Practices section covers cross-cutting topics (names and descriptions, landmark regions, keyboard interaction, grid and table properties, hiding semantics).
- Patterns index (30 design patterns, read 2026-09-02): Accordion, Alert, Alert and Message Dialogs, Breadcrumb, Button, Carousel, Checkbox, Combobox, Dialog (Modal), Disclosure, Feed, Grid, Landmarks, Link, Listbox, Menu and Menubar, Menu Button, Meter, Radio Group, Slider, Slider (Multi-Thumb), Spinbutton, Switch, Table, Tabs, Toolbar, Tooltip, Tree View, Treegrid, Window Splitter.
- Each pattern page documents, per the dialog-modal page checked as a sample: a Keyboard Interaction section (for example Escape closes a modal dialog; Tab cycles focus within it), a WAI-ARIA Roles, States, and Properties section (for example role dialog, aria-modal, aria-labelledby, aria-describedby), and links to working examples.
- Normative vs informative: entirely informative. The About page did not print an explicit "non-normative" sentence in the fetched view; the informative status rests on its /WAI/ location, its self-description as a guide, and its absence from the Recommendation track.

## Candidate rules

The APG yields BEST_PRACTICE rules at pattern granularity: for each pattern, the expected keyboard interaction and the required or recommended ARIA roles, states, and properties. These are candidates, one family per pattern (for example BP-dialog-modal-keyboard, BP-dialog-modal-aria), and they always defer to:

- ARIA (SRC-W3C-ARIA12) for whether a role or attribute is required (NORMATIVE); and
- WCAG (SRC-W3C-WCAG22) for the underlying obligation (for example keyboard operability 2.1.1, focus order 2.4.3, name/role/value 4.1.2).

The 30 patterns above are the candidate rule families. They are not expanded here because each depends on reading the specific pattern page during normalization; the note records the pattern list and the per-pattern page structure (keyboard, ARIA, examples) so Phase 2 can extract them. Candidate rule class for APG-derived component behaviors is BEST_PRACTICE (or PLATFORM as W3C guidance); severity comes from the WCAG or ARIA obligation each pattern supports, not from the APG itself.

Do not turn APG guidance into NORMATIVE rules: where the APG says a widget "should" behave a certain way, that is best practice unless a WCAG criterion or an ARIA MUST makes it required, in which case the NORMATIVE rule is the WCAG or ARIA rule and the APG rule links to it.

## Cross-references

- SRC-W3C-ARIA12: the normative vocabulary the APG applies.
- SRC-W3C-WCAG22: the conformance obligations the patterns help satisfy.
- UX-COMPONENTS domain also draws on Material Design (SRC-GOOGLE-MATERIAL3) and Apple HIG (SRC-APPLE-HIG), not yet verified; the component rule set is the union across these with the APG carrying the ARIA-semantics and keyboard layer.

## Uncertainties and gaps

- The APG is updated continuously; the recorded date is a snapshot. Re-verify per `docs/standards-research-plan.md` §5 and when normalizing a pattern.
- The About page's explicit "informative/non-normative" wording was not captured in the fetched view; the informative classification rests on the /WAI/ location and Recommendation-track absence. Raised as GAP-032; confirm an explicit source statement before quoting the About page on status.
- Per-pattern extraction (keyboard tables, required ARIA) is deferred to Phase 2; only the pattern inventory and page structure are verified now.
