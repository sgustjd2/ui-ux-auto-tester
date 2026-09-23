# SRC-W3C-WCAG3 — W3C Accessibility Guidelines (WCAG) 3.0 (Working Draft, watch only)

- Authority: W3C (Accessibility Guidelines Working Group)
- Canonical URL: https://www.w3.org/TR/wcag-3.0/
- Version / date: W3C Working Draft 10 September 2026 (WD-wcag-3.0-20260910), as printed in the header
- Source status: DRAFT
- Superseded by / supersedes: not a successor that replaces WCAG 2.x yet; WCAG 2.2 (SRC-W3C-WCAG22) remains the registry baseline and the version laws cite
- License / access: W3C document use rules (restrictive document license, as the header states); paraphrase only
- Verified on: 2026-09-23 (header, status section, section status levels, and table of contents read from the downloaded HTML)
- Tier: T1 (by authority; its content is not normative while a Working Draft)
- Domains served: none (watch-only row; no rules are minted from a Working Draft)

## Scope and applicability

- Intended future W3C accessibility guidelines covering web content and apps across desktop, mobile, wearable and other devices, with a different structure and conformance model from WCAG 2.x.
- The status section says this draft includes all requirements that have reached the "developing" status and asks for feedback through the wcag3 GitHub repository.
- Nothing here is citable as a requirement. It matters to this project for three reasons: early warning of how requirements will be phrased and tested, a conformance and severity model that may later align with this project's finding schema, and legal adoption risk (laws currently cite WCAG 2.0, 2.1, or 2.2).

## Structure (paraphrased, from the 10 September 2026 table of contents)

- Section status levels define how mature each part is: Placeholder, Exploratory, Developing, Refining, and later stages. At this draft, Guidelines, Conformance, and Glossary are marked Developing and Reporting is marked Exploratory.
- Guidelines are grouped into twelve areas: images and media; text and wording; interactive components; input and operation; error handling; animation and movement; layout; consistency across views; process and task completion; policy and protection; help and feedback; user control. Each area contains fine-grained requirements written in an "applies when / except when" format (the draft asks reviewers whether this format and the added granularity help).
- Requirement kinds: core requirements, supplemental requirements, and assertions (statements about processes, for example a clear-language review, with public information about who asserts it and when).
- Conformance: interpreting normative provisions and conformance requirements. Conformance is declared when all core requirements are met. The draft also mentions an alternative proposal that uses scoring to show progress toward conformance, and invites comment on which approach is better.
- Reporting: core requirements are tagged by type (physical harm, risk, barrier, friction); the tags do not change conformance but drive six reporting tiers, each including the ones before: 1 avoid physical harm (physical-harm and risk requirements), 2 foundational access (plus barrier requirements), 3 conformance (plus friction requirements, so all core requirements), 4 Bronze, 5 Silver, 6 Gold (plus increasing numbers of supplemental requirements and assertions, numbers still to be decided). An editor's note says policymakers may require additional tiers. Expanded functional performance statements complete the reporting section.
- An editor's note states that the severity of a failure depends on the circumstances (for example the role of the affected element in a page or process) as well as on the requirement, so one requirement can yield failures of different severity. This matches this project's rule `severity_hint` plus context adjustment (`docs/finding-schema.md` §4).

## Candidate rules

None. This is a watch-only row. Requirements are not normalized until WCAG 3 reaches at least Candidate Recommendation and a law or harmonized standard adopts it, or the user decides otherwise.

## Cross-references

- WCAG 2.2 (SRC-W3C-WCAG22): current normative baseline.
- ACT Rules Format (SRC-W3C-ACT-FORMAT): WCAG 3 testing is expected to reuse ACT-style test rules (not verified here; do not assert).
- `docs/finding-schema.md` §4 (severity) and GAP-009 (scoring model): compare with the WCAG 3 conformance and scoring proposals when Phase 3 decides the scoring model.

## Uncertainties and gaps

- Maturity changes frequently (several drafts per year). Re-check at each publication; tracked in `research/gaps.md`.
- The tier structure, the requirement tags, and the scoring alternative are draft proposals under discussion, not decisions. A discovery scan reported that the WAI WCAG 3 introduction page does not mention Bronze/Silver/Gold; the Working Draft itself does (reporting tiers 4 to 6), and the Working Draft is what this note records.
- The requirement tags (physical harm, risk, barrier, friction) are a candidate input for this project's severity factors when Phase 3 revisits `docs/finding-schema.md` §4; recorded in `research/gaps.md`.
