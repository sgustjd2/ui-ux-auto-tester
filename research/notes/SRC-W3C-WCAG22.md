# SRC-W3C-WCAG22 — Web Content Accessibility Guidelines (WCAG) 2.2

- Authority: W3C (Accessibility Guidelines Working Group)
- Canonical URL: https://www.w3.org/TR/WCAG22/ (latest published version). This version at verification: https://www.w3.org/TR/2024/REC-WCAG22-20241212/
- Version / date: W3C Recommendation, 12 December 2024 (the second Recommendation publication of WCAG 2.2 per the W3C history page; the first was 5 October 2023. The errata page separates entries dated before and after the December 2024 publication, which is the basis for treating it as an errata republication; the status section itself does not say so)
- Source status: CURRENT (re-checked 2026-09-23: the WCAG 2 overview, updated 17 September 2026, still names 2.2 as the latest version; WCAG 2.2 is also published as ISO/IEC 40500:2025, identical to the October 2023 text, with the December 2024 text expected as ISO/IEC 40500:2026; errata page last modified 3 September 2026 with editorial entries dated 17 August 2026)
- Superseded by / supersedes: supersedes the 5 October 2023 Recommendation of WCAG 2.2 (https://www.w3.org/TR/2023/REC-WCAG22-20231005/). Previous Recommendation in the WCAG 2 line: WCAG 2.1 (https://www.w3.org/TR/WCAG21/), which remains a separate, still-cited document (see Uncertainties).
- License / access: open. W3C Document License 2023 (the header says "document use rules apply"): copying and distribution permitted with attribution (link, copyright notice, status); no derivative works except to facilitate implementation, and publishing derivatives as a technical specification is prohibited. Code components fall under the W3C Software License.
- Verified on: 2026-09-23 re-check (TR header still the Recommendation of 12 December 2024; WCAG 2 overview updated 17 September 2026; errata page modified 3 September 2026); first verified 2026-09-02 (header, status section, history page, errata page, and every success criterion read at the canonical URL; text extracted deterministically from the downloaded HTML, not from a summary)
- Tier: T1
- Domains served: A11Y-WCAG22, VIS-TYPOGRAPHY, VIS-CONTRAST, VIS-IMAGERY, VIS-RESPONSIVE, VIS-ZOOM, VIS-ORIENTATION, VIS-TEXT-SCALING

## Scope and applicability

- Applies to web content (web pages and web applications). The Skill applies it to platforms `web` and `pwa` directly; application to native mobile and non-web ICT goes through WCAG2ICT (SRC-W3C-WCAG2ICT, not yet verified).
- Jurisdiction: GLOBAL as a technical standard. Legal force comes only through laws and harmonized standards that reference a WCAG version (registered separately as LEGAL sources).
- Conformance model (section 5): three levels, A (minimum), AA, AAA; five conformance requirements (5.2.1 Conformance Level, 5.2.2 Full pages, 5.2.3 Complete processes, 5.2.4 Only Accessibility-Supported Ways of Using Technologies, 5.2.5 Non-Interference). A level is met only when every success criterion at that level and below is satisfied or a conforming alternate version exists. The document itself advises against requiring AAA as a general policy for whole sites.
- Non-interference: the notes on 1.4.2, 2.1.2, 2.2.2, and 2.3.1 state that all content on a page must meet them because failures block use of the whole page.

## Structure

- 4 principles (Perceivable, Operable, Understandable, Robust), 13 guidelines, 86 active success criteria plus 4.1.1 Parsing, which is retained as a heading marked obsolete and removed.
- Identifier scheme: success criteria numbered principle.guideline.criterion (for example 2.5.8); each has a stable fragment id at the canonical URL (for example `#target-size-minimum`).
- New in 2.2 (9): 2.4.11, 2.4.12, 2.4.13, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8, 3.3.9. New criteria are appended at the end of their guideline, so criteria within a guideline are not ordered by level; only the level indicator is authoritative.
- Removed in 2.2 (1): 4.1.1 Parsing. The comparison section notes that authors bound by policies citing 2.0 or 2.1 may still need to test and report it.
- Backwards compatibility: the document states that content conforming to 2.2 also conforms to 2.0 and 2.1.
- Normative parts: the success criteria (including glossary terms they reference) and the conformance section. Informative parts: the introduction, notes, Understanding documents, Techniques, and the quick reference. Notes attached to criteria are explanatory but several state scope (for example the non-interference notes).
- Errata: an errata page exists (https://www.w3.org/WAI/WCAG22/errata/). At verification it listed editorial errata under "since 05 October 2023 publication" (dated November 2024) and further editorial errata under "since current publication" (dated 2025-06-27, 2025-10-28, and 2026-08-17). All entries are labeled editorial; the page does not describe any as changing a requirement. The 2025 and 2026 entries touch the wording of 1.4.13, so re-check the errata page before normalizing 1.4.13 and any threshold.

## Candidate rules

One row per success criterion. Paraphrases are this project's own words and are not the normative text; normalization (Phase 2) must go back to the criterion at the canonical URL for exceptions and defined terms. Testability columns are the researcher's estimate for automated / visual / manual methods (FULL, PARTIAL, NONE). All rows: rule_class NORMATIVE, normative_strength MUST, category accessibility unless noted, platforms web and pwa, jurisdictions GLOBAL.

| proposed_id | level | new in 2.2 | paraphrase | auto | visual | manual | subcategory |
|---|---|---|---|---|---|---|---|
| WCAG-1.1.1 | A | | Every non-text element has a text alternative with the same purpose; controls need a descriptive name; time-based media, tests or exercises that would be invalid as text, and sensory-experience content need at least descriptive identification; CAPTCHAs need a described purpose plus alternatives in other sensory modes; content that is pure decoration, used only for visual formatting, or not presented to users is implemented so assistive technology can ignore it | PARTIAL | PARTIAL | FULL | alt-text |
| WCAG-1.2.1 | A | | Prerecorded audio-only gets a text-based alternative and prerecorded video-only gets a text alternative or an audio track, unless the media is itself a labeled alternative for text | NONE | PARTIAL | FULL | audio |
| WCAG-1.2.2 | A | | Prerecorded synchronized media has captions unless it is a labeled alternative for text | PARTIAL | PARTIAL | FULL | captions |
| WCAG-1.2.3 | A | | Prerecorded synchronized video has audio description or a full text alternative unless it is a labeled alternative for text | NONE | PARTIAL | FULL | video |
| WCAG-1.2.4 | AA | | Live synchronized audio content is captioned | NONE | PARTIAL | FULL | captions |
| WCAG-1.2.5 | AA | | Prerecorded synchronized video has audio description | NONE | PARTIAL | FULL | video |
| WCAG-1.2.6 | AAA | | Prerecorded synchronized audio content has sign-language interpretation | NONE | PARTIAL | FULL | video |
| WCAG-1.2.7 | AAA | | When natural pauses are too short for description, extended audio description is provided for prerecorded synchronized video | NONE | NONE | FULL | video |
| WCAG-1.2.8 | AAA | | All prerecorded synchronized media and prerecorded video-only media has a full text alternative | NONE | PARTIAL | FULL | transcripts |
| WCAG-1.2.9 | AAA | | Live audio-only content has an equivalent text-based alternative | NONE | NONE | FULL | transcripts |
| WCAG-1.3.1 | A | | Structure and relationships that presentation conveys (headings, lists, tables, groups, labels) are exposed programmatically or stated in text | PARTIAL | PARTIAL | FULL | semantic-structure |
| WCAG-1.3.2 | A | | When reading order affects meaning, the programmatic order preserves it | PARTIAL | PARTIAL | FULL | semantic-structure |
| WCAG-1.3.3 | A | | Instructions do not depend only on shape, color, size, position, orientation, or sound | NONE | PARTIAL | FULL | semantic-structure |
| WCAG-1.3.4 | AA | | Content works in both portrait and landscape unless one orientation is essential | PARTIAL | FULL | FULL | orientation |
| WCAG-1.3.5 | AA | | Fields that collect personal information expose their purpose programmatically where the technology supports it (the input purposes list in section 7) | FULL | NONE | PARTIAL | forms |
| WCAG-1.3.6 | AAA | | In markup content, the purpose of components, icons, and regions is programmatically determinable | PARTIAL | NONE | FULL | semantic-structure |
| WCAG-1.4.1 | A | | Color is never the only visual cue for information, actions, responses, or distinctions | NONE | FULL | FULL | contrast |
| WCAG-1.4.2 | A | | Audio that starts automatically and lasts more than 3 seconds can be paused, stopped, or volume-controlled independently of the system | PARTIAL | NONE | FULL | audio |
| WCAG-1.4.3 | AA | | Text and images of text reach 4.5:1 contrast, or 3:1 for large-scale text; text in inactive components, pure decoration, invisible text, text inside pictures with significant other visual content, and logos or brand names are exempt | FULL | PARTIAL | FULL | contrast |
| WCAG-1.4.4 | AA | | Text other than captions and images of text can be enlarged to 200 percent without assistive technology and without losing content or function | PARTIAL | FULL | FULL | text-resize |
| WCAG-1.4.5 | AA | | Real text is used instead of images of text where the technology allows, unless the image is user-customizable or the presentation is essential (logos count as essential) | NONE | FULL | FULL | images |
| WCAG-1.4.6 | AAA | | Text contrast reaches 7:1, or 4.5:1 for large text, with the same exemptions as 1.4.3 | FULL | PARTIAL | FULL | contrast |
| WCAG-1.4.7 | AAA | | Prerecorded speech audio has no background sound, lets background sound be turned off, or keeps it at least 20 dB below the speech | NONE | NONE | FULL | audio |
| WCAG-1.4.8 | AAA | | For blocks of text a mechanism lets users pick foreground and background colors, keep line width to no more than 80 characters or glyphs (40 for CJK), avoid full justification, get line spacing of at least 1.5 and paragraph spacing at least 1.5 times the line spacing, and enlarge to 200 percent without horizontal scrolling on a full-screen window; writing systems that do not use one of these aspects can conform without it | PARTIAL | PARTIAL | FULL | text-resize |
| WCAG-1.4.9 | AAA | | Images of text appear only as decoration or where the presentation is essential | NONE | FULL | FULL | images |
| WCAG-1.4.10 | AA | | Content reflows to 320 CSS px width (256 CSS px height for horizontally scrolling content) without two-dimensional scrolling or loss, except parts that need two-dimensional layout | PARTIAL | FULL | FULL | reflow |
| WCAG-1.4.11 | AA | | Indicators needed to identify components and their states, and meaningful parts of graphics, have at least 3:1 contrast against adjacent colors; inactive or user-agent-styled components and essential graphics are exempt | PARTIAL | FULL | FULL | contrast |
| WCAG-1.4.12 | AA | | In markup-language content that supports these properties, overriding line height to at least 1.5, paragraph spacing to at least 2, letter spacing to at least 0.12, and word spacing to at least 0.16 times the font size, and nothing else, causes no loss of content or function; languages and scripts that do not use some of these properties conform using only the ones they have | PARTIAL | FULL | FULL | text-resize |
| WCAG-1.4.13 | AA | | Content that appears on hover or focus can be dismissed without moving the pointer or focus (unless it reports an input error or does not obscure or replace other content), stays visible while the pointer moves over it, and persists until the trigger is removed, the user dismisses it, or its information is no longer valid; additional content whose presentation is controlled by the user agent and not modified by the author is exempt | PARTIAL | PARTIAL | FULL | accessible-custom-widgets |
| WCAG-2.1.1 | A | | All functionality works from a keyboard without timing-dependent keystrokes, except functions that need path-dependent input | PARTIAL | NONE | FULL | keyboard-operation |
| WCAG-2.1.2 | A | | Focus can always be moved away from a component with the keyboard, and any non-standard exit method is explained | PARTIAL | NONE | FULL | keyboard-operation |
| WCAG-2.1.3 | AAA | | All functionality works from a keyboard with no exception | PARTIAL | NONE | FULL | keyboard-operation |
| WCAG-2.1.4 | A | | Single-character shortcuts can be turned off, remapped to include a modifier key, or are active only when the component has focus | PARTIAL | NONE | FULL | keyboard-operation |
| WCAG-2.2.1 | A | | Content-imposed time limits can be turned off, adjusted to at least ten times the default, or extended after a warning with at least 20 seconds to act and at least ten extensions, unless real-time, essential, or longer than 20 hours | NONE | NONE | FULL | errors |
| WCAG-2.2.2 | A | | Moving, blinking, or scrolling content that starts automatically, lasts more than five seconds, and sits beside other content can be paused, stopped, or hidden, and auto-updating content that starts automatically beside other content can be paused, stopped, hidden, or have its update frequency controlled, unless the behavior is essential | PARTIAL | PARTIAL | FULL | motion |
| WCAG-2.2.3 | AAA | | Timing is not essential to any activity except non-interactive synchronized media and real-time events | NONE | NONE | FULL | errors |
| WCAG-2.2.4 | AAA | | Users can postpone or suppress interruptions except emergencies | NONE | NONE | FULL | errors |
| WCAG-2.2.5 | AAA | | After an authenticated session expires, users can re-authenticate and continue without losing data | NONE | NONE | FULL | authentication |
| WCAG-2.2.6 | AAA | | Users are warned how long inactivity can last before data is lost, unless data is kept for more than 20 hours | NONE | NONE | FULL | errors |
| WCAG-2.3.1 | A | | Nothing flashes more than three times in a second unless the flash is below the general and red flash thresholds | PARTIAL | PARTIAL | FULL | flashing |
| WCAG-2.3.2 | AAA | | Nothing flashes more than three times in a second | PARTIAL | PARTIAL | FULL | flashing |
| WCAG-2.3.3 | AAA | | Motion animation triggered by interaction can be disabled unless essential | PARTIAL | PARTIAL | FULL | motion |
| WCAG-2.4.1 | A | | A mechanism lets users skip content repeated across pages | PARTIAL | PARTIAL | FULL | landmarks |
| WCAG-2.4.2 | A | | Each page has a title that describes its topic or purpose | PARTIAL | NONE | FULL | headings |
| WCAG-2.4.3 | A | | When sequential navigation affects meaning or operation, focus order preserves both | PARTIAL | PARTIAL | FULL | focus-order |
| WCAG-2.4.4 | A | | Each link's purpose is clear from its text or its programmatic context, unless it would be ambiguous to everyone | PARTIAL | PARTIAL | FULL | names-roles-values |
| WCAG-2.4.5 | AA | | Pages in a set can be reached in more than one way, except pages that are steps or results of a process | NONE | PARTIAL | FULL | landmarks |
| WCAG-2.4.6 | AA | | Headings and labels describe topic or purpose | NONE | PARTIAL | FULL | headings |
| WCAG-2.4.7 | AA | | Keyboard-operable interfaces have a mode in which the focus indicator is visible | PARTIAL | FULL | FULL | focus-visibility |
| WCAG-2.4.8 | AAA | | Users can tell where they are within a set of pages | NONE | PARTIAL | FULL | landmarks |
| WCAG-2.4.9 | AAA | | A mechanism makes each link's purpose identifiable from the link text alone, unless ambiguous to everyone | PARTIAL | PARTIAL | FULL | names-roles-values |
| WCAG-2.4.10 | AAA | | Written content is organized with section headings | PARTIAL | PARTIAL | FULL | headings |
| WCAG-2.4.11 | AA | yes | A component that receives keyboard focus is never entirely hidden by author-created content; only the initial positions of user-movable content count, and content the user opened does not count as hiding when the focused component can be revealed without moving focus | PARTIAL | FULL | FULL | focus-visibility |
| WCAG-2.4.12 | AAA | yes | No part of a component that receives keyboard focus is hidden by author-created content | PARTIAL | FULL | FULL | focus-visibility |
| WCAG-2.4.13 | AAA | yes | A visible focus indicator covers at least the area of a 2 CSS px perimeter of the component and changes by at least 3:1 contrast between focused and unfocused states, unless the indicator is user-agent-defined or unmodified by the author | PARTIAL | FULL | FULL | focus-visibility |
| WCAG-2.5.1 | A | | Functions that use multipoint or path-based gestures also work with a single pointer without a path, unless the gesture is essential | NONE | NONE | FULL | gestures |
| WCAG-2.5.2 | A | | Single-pointer functions do not fire on the down-event, or can be aborted, undone, or reversed, unless down-event completion is essential | PARTIAL | NONE | FULL | pointer-input |
| WCAG-2.5.3 | A | | The accessible name of a labeled component contains the visible label text | FULL | NONE | PARTIAL | names-roles-values |
| WCAG-2.5.4 | A | | Functions operated by device or user motion also have UI controls and the motion response can be disabled, except accessibility-supported interfaces or essential motion | NONE | NONE | FULL | alternative-input |
| WCAG-2.5.5 | AAA | | Pointer targets are at least 44 by 44 CSS px, except equivalent targets, targets in text, user-agent-sized targets, or essential presentation | PARTIAL | FULL | FULL | touch-target |
| WCAG-2.5.6 | AAA | | Available input modalities are not restricted except when essential, for security, or to respect user settings | PARTIAL | NONE | FULL | alternative-input |
| WCAG-2.5.7 | AA | yes | Drag-based functions can be done with a single pointer without dragging, unless dragging is essential or the function is user-agent-determined | NONE | NONE | FULL | drag-interactions |
| WCAG-2.5.8 | AA | yes | Pointer targets are at least 24 by 24 CSS px, or undersized targets are spaced so that a 24 CSS px circle centered on each does not intersect another target or the circle of another undersized target; exempt when an equivalent control on the page meets the criterion, the target is inline in text or constrained by line height, the size is user-agent-determined and unmodified, or the presentation is essential or legally required | PARTIAL | FULL | FULL | touch-target |
| WCAG-3.1.1 | A | | The default language of each page is programmatically determinable | FULL | NONE | PARTIAL | semantic-structure |
| WCAG-3.1.2 | AA | | Language changes within content are programmatically marked, except proper names, technical terms, indeterminate words, and vernacular | PARTIAL | NONE | FULL | semantic-structure |
| WCAG-3.1.3 | AAA | | A mechanism identifies the definitions of unusual words, idioms, and jargon | NONE | NONE | FULL | cognitive-accessibility |
| WCAG-3.1.4 | AAA | | A mechanism gives the expanded form or meaning of abbreviations | NONE | NONE | FULL | cognitive-accessibility |
| WCAG-3.1.5 | AAA | | Text above lower-secondary reading level has supplemental content or a simpler version | PARTIAL | NONE | FULL | cognitive-accessibility |
| WCAG-3.1.6 | AAA | | Pronunciation is available where meaning depends on it | NONE | NONE | FULL | cognitive-accessibility |
| WCAG-3.2.1 | A | | Receiving focus does not change context | PARTIAL | NONE | FULL | keyboard-operation |
| WCAG-3.2.2 | A | | Changing a control's setting does not change context unless users were told beforehand | PARTIAL | NONE | FULL | forms |
| WCAG-3.2.3 | AA | | Navigation repeated across a set of pages keeps the same relative order unless the user changes it | PARTIAL | PARTIAL | FULL | semantic-structure |
| WCAG-3.2.4 | AA | | Components with the same function are identified consistently across a set of pages | PARTIAL | PARTIAL | FULL | names-roles-values |
| WCAG-3.2.5 | AAA | | Context changes happen only on user request, or a mechanism turns them off | NONE | NONE | FULL | keyboard-operation |
| WCAG-3.2.6 | A | yes | Help mechanisms repeated across a set of pages (human contact details, human contact mechanism, self-help, automated contact) keep the same relative order unless the user changes it | NONE | PARTIAL | FULL | semantic-structure |
| WCAG-3.3.1 | A | | When an input error is detected automatically, the field is identified and the error is described in text | PARTIAL | PARTIAL | FULL | errors |
| WCAG-3.3.2 | A | | Labels or instructions are provided wherever input is required | PARTIAL | PARTIAL | FULL | labels |
| WCAG-3.3.3 | AA | | Known corrections for detected errors are suggested unless that would compromise security or purpose | NONE | PARTIAL | FULL | errors |
| WCAG-3.3.4 | AA | | Submissions with legal, financial, data-changing, or test consequences are reversible, checked with a chance to correct, or confirmable before finalizing | NONE | NONE | FULL | forms |
| WCAG-3.3.5 | AAA | | Context-sensitive help is available | NONE | NONE | FULL | cognitive-accessibility |
| WCAG-3.3.6 | AAA | | Every information submission is reversible, checked, or confirmable | NONE | NONE | FULL | forms |
| WCAG-3.3.7 | A | yes | Information already entered or provided in a process is auto-filled or selectable when asked again, unless re-entry is essential, needed for security, or the information is no longer valid | NONE | NONE | FULL | forms |
| WCAG-3.3.8 | AA | yes | No authentication step requires a cognitive function test unless it offers another method without such a test, a mechanism that helps complete the test, a test that only asks to recognize objects, or a test that only asks to identify non-text content the user provided | PARTIAL | NONE | FULL | authentication |
| WCAG-3.3.9 | AAA | yes | No authentication step requires a cognitive function test unless it offers an alternative method or an assisting mechanism | PARTIAL | NONE | FULL | authentication |
| WCAG-4.1.2 | A | | Components expose name and role programmatically, allow user-settable states, properties, and values to be set programmatically, and notify user agents of changes | PARTIAL | NONE | FULL | names-roles-values |
| WCAG-4.1.3 | AA | | Status messages are exposed through roles or properties so assistive technology can announce them without moving focus | PARTIAL | NONE | FULL | accessible-status-messages |

Not a candidate rule: 4.1.1 Parsing is obsolete and removed in 2.2; register nothing for it, but the crosswalk must record that laws citing WCAG 2.0 or 2.1 still contain it.

## Cross-references

- Understanding WCAG 2.2 (SRC-W3C-WCAG22-UNDERSTANDING): informative explanations per criterion; use for intent, examples, and testability guidance, never as a rule source.
- WCAG 2.1 (https://www.w3.org/TR/WCAG21/): previous Recommendation, still the version cited by several laws and harmonized standards; not registered yet (see Uncertainties).
- WCAG2ICT (SRC-W3C-WCAG2ICT): applies these criteria to non-web software and documents.
- Laws and harmonized standards expected to incorporate WCAG by reference: EN 301 549 (SRC-ETSI-EN301549), Section 508 (SRC-USAB-SECTION508), ADA Title II rule (SRC-DOJ-ADA-TITLE2), KWCAG (SRC-KR-KWCAG22, a related national guideline). Crosswalk relations are assigned when those sources are verified.
- Glossary terms referenced by criteria (for example "essential", "large-scale text", "cognitive function test") are normative and must be looked up at normalization time.

## Uncertainties and gaps

- Laws cite different WCAG versions (2.0, 2.1, 2.2). A separate source row for WCAG 2.1 is needed so LEGAL rules can link to the exact version they incorporate; raised as a gap.
- Errata continue to accumulate after the December 2024 republication; the registry needs a rule for when errata trigger re-verification; raised as a gap.
- The W3C Document License forbids publishing derivative works as a technical specification. This project's rule records are independent paraphrases that cite the source and are not a republished specification; recorded as an assumption for confirmation.
- Testability values in the table are estimates from reading the criteria, not from tooling experiments; Phase 2 sets them per rule with evidence types.
