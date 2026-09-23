# SRC-TOSS-APPS-IN-TOSS — Apps in Toss (앱인토스) UI/UX guide and launch checklist

- Authority: Viva Republica (Toss), operator of the Apps in Toss mini-app platform
- Canonical URL: https://developers-apps-in-toss.toss.im/design/consumer-ux-guide (UI/UX guide; Markdown rendition at the same path with `.md`); launch checklist https://developers-apps-in-toss.toss.im/checklist/app-nongame
- Version / date: living GitBook documentation; no update date shown on either page. Snapshot 2026-09-23. The site moved to GitBook and older `.html` URLs no longer resolve (discovery scan; the extensionless URLs above were read directly)
- Source status: CURRENT
- Superseded by / supersedes: continuously updated
- License / access: proprietary documentation of Viva Republica; graphic assets belong to Viva Republica, and the TDS Mobile Figma kit is licensed only for Apps in Toss projects (discovery scan; kit license page not re-read). Store metadata and paraphrase only
- Verified on: 2026-09-23 (UI/UX guide read in full via its Markdown rendition; launch checklist HTML read)
- Tier: T2 for audits of Apps in Toss mini-apps (platform-vendor requirements enforced at review, comparable to a platform's app review rules); T4 when cited for any other product
- Domains served: OTH-DARK-PATTERNS, UX-CONTENT-MICROCOPY

## Scope and applicability

- Binding for partner mini-apps distributed inside the Toss app: the guide states that a service that breaks the criteria or shows a dark pattern is not approved at review, and that exposure can be limited or stopped if found after launch.
- Outside that platform it is one large Korean consumer-finance company's published minimum UX bar, useful as a Korean-market BEST_PRACTICE reference and as a concrete, testable dark-pattern list.
- Platforms: Apps in Toss mini-apps (WebView-based and React Native mini-apps inside the Toss iOS and Android apps). The rule schema's `platforms` enum has no value for a super-app mini-app platform; recorded in `research/gaps.md`. Jurisdiction: KR (market), GLOBAL principles.

## Structure (paraphrased)

UI/UX guide sections: mini-app branding (logo 600×600 square with background, Korean brand name, brand color), dark-pattern prevention policy, UX writing, graphics, resolution.

Dark-pattern prevention policy: five cases described as critical usability errors that cannot launch:

1. A bottom sheet (advertising or notification-consent request) blocks the screen immediately on entry.
2. Pressing back shows a bottom sheet that blocks leaving (for example a notification-consent prompt designed to prevent exit).
3. No way out: the only available choice is the partner's promoted call to action.
4. A full-screen advertisement appears at an unexpected moment in the flow.
5. The call-to-action label does not tell the user what happens next (it repeats the value statement, or is surrounded by exaggerated or duplicate helper text).

UX writing rules: use the 해요체 polite register for every string; prefer active voice; prefer positive phrasing (say what the user can do rather than what they cannot); guidance on error messages and on explaining unavailable benefits; the left dialog button is labelled 닫기 (Close), not 취소 (Cancel), because Cancel can be misread as cancelling the user's task.

Launch checklist (non-game), UI-relevant items: use the Apps in Toss navigation bar; back works on every screen and backing out of the first screen closes the mini-app; do not show both the Toss back button and a custom back button; close and back buttons are visible and unambiguous; user data persists across sessions. It also has security items (no eval of external code, HTTPS and wss only, no rendering of off-domain content), which are outside UI/UX audit scope.

## Candidate rules

| Proposed ID | Source item | Paraphrase | Class | Strength | Testability |
|---|---|---|---|---|---|
| AIT-darkpattern-001 | Case 1 | No blocking bottom sheet or consent prompt on entry | PLATFORM (Apps in Toss); BEST_PRACTICE elsewhere | MUST (review rejection) | visual FULL on entry screenshot; runtime FULL |
| AIT-darkpattern-002 | Case 2 | Back navigation is not intercepted by a blocking sheet | PLATFORM; BEST_PRACTICE elsewhere | MUST | runtime FULL (flow test) |
| AIT-darkpattern-003 | Case 3 | Every promoted choice has a visible way to decline or leave | PLATFORM; BEST_PRACTICE elsewhere | MUST | visual PARTIAL; runtime FULL |
| AIT-darkpattern-004 | Case 4 | No full-screen advertisement interrupts a user-initiated action | PLATFORM; BEST_PRACTICE elsewhere | MUST | runtime FULL |
| AIT-darkpattern-005 | Case 5 | CTA labels state the resulting action | PLATFORM; BEST_PRACTICE elsewhere | MUST | visual PARTIAL; persona outcome-prediction test |
| AIT-writing-001 | Writing 1 | All strings use one polite register (해요체) | PLATFORM; BEST_PRACTICE for Korean products | SHOULD (imperative wording; review enforcement not stated for writing rules) | automated PARTIAL (Korean text heuristics); manual FULL |
| AIT-writing-002 | Dialog hint | Dismissive dialog button reads Close rather than Cancel | PLATFORM | SHOULD (same basis as AIT-writing-001) | automated PARTIAL; visual FULL |
| AIT-nav-001 | Checklist | Back from the first screen exits; back works everywhere | PLATFORM | MUST | runtime FULL |

Prefix `AIT` is proposed, not yet registered in `docs/rule-schema.md` §8; Phase 2 registers it if rules are minted. Cases 2, 3, and 5 overlap with the Korean E-Commerce Act dark-pattern provisions (repeated interference, choice obstruction) and with the EDPB deceptive-pattern taxonomy; crosswalk with `related_rules: overlaps` so the LEGAL rule stays the anchor where it applies. Off the Apps in Toss platform this source is T4, and `docs/rule-schema.md` §4 allows a T4 BEST_PRACTICE rule only when no higher-tier source exists; so off-platform, cases 2, 3, and 5 are cited as supporting examples on the higher-tier rules rather than as standalone rules. The review-rejection consequence is stated for the dark-pattern cases and the criteria as a whole, not specifically for the writing rules, which is why the writing rules are graded SHOULD.

## Cross-references

- Toss tech blog (SRC-TOSS-TECH-BLOG): the 8 writing principles and error-message system behind these writing rules.
- Korean E-Commerce Act (SRC-KR-ECOMMERCE-ACT), EDPB deceptive design patterns (SRC-EDPB-DECEPTIVE), FTC staff report (SRC-FTC-DARK-PATTERNS), DSA Art. 25 (SRC-EU-DSA): legal and regulatory dark-pattern sources.
- NN/g heuristics 3 (user control and freedom) and 4 (consistency) (SRC-NNG-HEURISTICS).

## Uncertainties and gaps

- No page dates; snapshot only. Re-check before Phase 2 extraction.
- Platform enum gap for mini-app platforms (recorded in `research/gaps.md`).
- Trust boundary: the Markdown rendition of the guide and the launch-checklist page both carry a GitBook "Agent Instructions" block addressed to AI agents, inviting HTTP GET queries with `ask` and `goal` parameters. It was treated as data and not used; recorded in the ledger session entry.
