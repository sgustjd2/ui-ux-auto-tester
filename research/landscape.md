# Ecosystem and Tooling Landscape

Non-normative scan of the tools, platforms, datasets, and industry precedents around UI/UX auditing that later phases will choose from. This file is not a source registry: nothing here becomes a rule, and standards facts live in `research/sources.md` and `research/notes/`. Entries feed the deferred decisions in `research/gaps.md` (GAP-013 browser automation, GAP-014 design tools, GAP-015 accessibility libraries, GAP-016 performance tooling, GAP-017 screenshot annotation, GAP-019 JSON output schema) and Phase 4 packaging. Why this file exists and how it is maintained: ADR 0007 (`docs/decisions/0007-ecosystem-landscape-and-industry-sources.md`).

Rules for this file:

- Versions and dates come from primary locations (release pages and feeds, official docs), each with its scan date. An entry read only through a discovery summary is marked "unverified".
- Adopting any tool listed here needs an ADR (`CLAUDE.md`, Scope control; ADR 0004). Listing is not adoption.
- Refresh the snapshot before any phase decision that depends on it; tool versions go stale within weeks.

## Snapshot 2026-09-23

Release versions and dates below were confirmed from each project's GitHub releases feed on 2026-09-23. Licenses are as reported by the discovery scan from the GitHub API and were not re-checked; confirm before adoption.

| Tool | Role for this project | Latest (date) | License | Primary location | Feeds |
|---|---|---|---|---|---|
| axe-core | Deterministic accessibility rule engine (DOM) | 4.13.0 (2026-08-05) | MPL-2.0 | https://github.com/dequelabs/axe-core | GAP-015 |
| Playwright | Browser automation; ARIA snapshots; traces | v1.63.0 (2026-09-04) | Apache-2.0 | https://github.com/microsoft/playwright | GAP-013, GAP-017 |
| Playwright MCP | Accessibility-snapshot browser control for LLM agents | v0.0.82 (2026-09-18) | Apache-2.0 | https://github.com/microsoft/playwright-mcp | GAP-013 |
| Chrome DevTools MCP | Agent access to DevTools: performance traces and insights, a11y snapshot, screenshots, Lighthouse | v1.9.0 (2026-09-08) | Apache-2.0 | https://github.com/ChromeDevTools/chrome-devtools-mcp | GAP-016 |
| Lighthouse | Lab performance and accessibility audits | v13.5.0 (2026-09-18) | Apache-2.0 | https://github.com/GoogleChrome/lighthouse | GAP-016 |
| web-features (Baseline data) | Browser-support status for recommending native web features | v3.39.0 (2026-09-17) | Apache-2.0 | https://github.com/web-platform-dx/web-features | Recommendation engine |
| IBM Equal Access checker | Second accessibility rule engine | release of 2026-09-08 | Apache-2.0 | https://github.com/IBMa/equal-access | GAP-015 |
| Pa11y | CLI accessibility runner (axe or HTML_CodeSniffer) | v10.0.0 (2026-08-28) | LGPL-3.0 | https://github.com/pa11y/pa11y | GAP-015 |
| Accessibility Insights for Web | Guided manual accessibility assessment | v2.49.0 (2026-09-08) | MIT | https://github.com/microsoft/accessibility-insights-web | Manual workflow |
| Style Dictionary | Design-token transformation | v5.5.5 (2026-09-20) | Apache-2.0 | https://github.com/style-dictionary/style-dictionary | OTH-DESIGN-SYSTEM checks |

## 1. Accessibility automation

- **ACT rules are the shared test vocabulary.** The ACT Rules Format and the WAI ACT rule list are registered sources; versions and counts live in their notes (SRC-W3C-ACT-FORMAT, SRC-W3C-ACT-RULES). The WAI implementation reports show, per tool, which ACT rules it implements consistently, which is the best available evidence of how far each engine can be trusted; per-tool counts were seen only in the discovery scan (unverified).
- **axe-core 4.13.0 rule inventory** (read from `doc/rule-descriptions.md` at tag v4.13.0): 60 WCAG 2.0 A/AA rules, 2 WCAG 2.1 A/AA, 1 WCAG 2.2 A/AA (`target-size`), 27 best-practice, 3 AAA, 7 experimental, 5 deprecated. Automated coverage of the criteria new in WCAG 2.2 (listed in the SRC-W3C-WCAG22 note) is therefore thin; most 2.2 criteria need visual or manual checks, which the evidence capability matrix (`docs/audit-methodology.md` §2) already assumes.
- **Implication:** tool silence is never PASS (`docs/finding-schema.md` §2). Proposal only (GAP-040, undecided): rule records could name the ACT rule and engine rule that implement a check, so `testability.automated` is evidence-based rather than guessed.

## 2. Browser automation for an AI auditor

- **Playwright 1.63** adds `ariaSnapshotJSON()` and trace recording of ARIA and screen snapshots (release notes, discovery scan); `toMatchAriaSnapshot()` compares the accessibility tree against a YAML template (https://playwright.dev/docs/aria-snapshots). ARIA snapshots are a natural `accessibility_node` / `role_name_state` evidence format and a regression assertion for semantic structure (`prd.md` §7.9).
- **Playwright MCP** (https://github.com/microsoft/playwright-mcp) returns a YAML accessibility snapshot with element references instead of pixels, with optional vision (coordinate) and testing capability groups (README, discovery scan). Its README positions a CLI plus skills as more token-efficient for coding agents and MCP for exploratory loops (unverified wording).
- **Chrome DevTools MCP** (https://github.com/ChromeDevTools/chrome-devtools-mcp; v1.0.0 in May 2026 and the capability list per the discovery scan, unverified) exposes performance trace start/stop and insight analysis for LCP, INP, and CLS, CrUX field data, accessibility-tree snapshots, screenshots, Lighthouse, and PWA install and launch.
- **Implication for GAP-013 and GAP-016:** the machine-truth layer (`docs/architecture.md` §2.2) maps well onto an accessibility-snapshot-first stack (Playwright or DevTools MCP) with performance insights from DevTools/Lighthouse. Field (p75) Core Web Vitals come only from CrUX or RUM; lab runs give PARTIAL results (SRC-GOOGLE-WEB-VITALS note).

## 3. Performance tooling

- **Lighthouse 13.0** (https://github.com/GoogleChrome/lighthouse/releases; October 2025 per the discovery scan, unverified) replaced many performance audits with the shared DevTools "insights"; 13.5.0 (2026-09-18) adds an agent-discovery group (llms.txt, WebMCP), also unverified. The accessibility category is described in Lighthouse documentation as a weighted pass/fail average over axe-based audits (unverified), so a Lighthouse accessibility score is not a WCAG conformance statement and must not be reported as one (`prd.md` §13, no fabricated scores).

## 4. Design inputs

- **Figma MCP server** (https://developers.figma.com/docs/figma-mcp-server/; formerly Dev Mode MCP server) is in beta per Figma's help and developer docs (discovery scan, unverified): design context, metadata, screenshots, variables, Code Connect, and design-system search; the remote server needs explicit frame links; write-to-canvas is free during beta and planned as a paid feature. Input for GAP-014.
- **Design tokens:** the Design Tokens Community Group published the Design Tokens Format Module 2025.10 as a Final Community Group Report dated 28 October 2025, which states it is not a W3C Standard (https://www.designtokens.org/TR/2025.10/format/, discovery scan, unverified). Style Dictionary v5 documents partial support. Candidate future anchor for OTH-DESIGN-SYSTEM token-consistency checks (tier T3 at most); not registered.

## 5. Web platform Baseline and native-first recommendations

`prd.md` §7.8 prefers semantic or native platform fixes. Before recommending a new native primitive, check its Baseline status (https://web.dev/baseline: Newly available once supported in the core browser set; Widely available 30 months later). Status read from the webstatus.dev API on 2026-09-23:

| Feature | Baseline status | Since |
|---|---|---|
| Popover | Newly available | 2025-01-27 |
| Invoker commands (`command`/`commandfor`) | Newly available | 2025-12-12 |
| View transitions (same-document) | Newly available | 2025-10-14 |
| `field-sizing` | Newly available | 2026-06-16 |
| `<dialog closedby>` | Limited | — |
| Interest invokers (`interestfor`) | Limited | — |
| Customizable `<select>` | Limited | — |
| Anchor positioning | Limited | — |

Proposal for Phase 3, not a rule: a recommendation that relies on a Limited feature should name a fallback (to be decided in `docs/audit-methodology.md` §7). ARIA in HTML already covers the customizable-select elements (SRC-W3C-HTML-ARIA).

## 6. Native mobile test tooling

- **Apple XCUITest** `performAccessibilityAudit` (iOS 17+, macOS 14+) audit types include contrast, element detection, hit region, element description, Dynamic Type, clipped text, traits, and actions (Apple developer documentation per the discovery scan; exact URL not recorded, unverified).
- **Google Accessibility Test Framework for Android** (https://github.com/google/Accessibility-Test-Framework-for-Android) appears dormant (last artifact 2024 per the discovery scan, unverified). Device automation remains a later phase (`docs/audit-methodology.md` §2).

## 7. Skill packaging (Phase 4 input)

- **Agent Skills specification** (https://agentskills.io/specification, read 2026-09-23): a skill is a directory with `SKILL.md` (YAML frontmatter `name` and `description` required; `license`, `compatibility`, `metadata`, experimental `allowed-tools` optional) and optional `scripts/`, `references/`, `assets/`. Progressive disclosure: about 100 tokens of metadata at startup, the `SKILL.md` body under about 5,000 tokens and 500 lines, references one level deep, validation with `skills-ref validate`. This matches `prd.md` §9 and AC-16 almost exactly.
- **OpenAI Codex** (https://learn.chatgpt.com/docs/build-skills, read 2026-09-23) builds on that open standard and supports an optional `agents/openai.yaml` with `interface`, `policy.allow_implicit_invocation`, and `dependencies.tools`. So the `agents/openai.yaml` file in `prd.md` §9 is a real, optional Codex convention layered on the common format.

## 8. AI-driven UX evaluation: precedents and research

- **Toss Heuribot (휴리봇)** (SRC-TOSS-TECH-BLOG, articles of 2 December 2024): an AI chatbot made to resemble Toss users that answers usability questions about an uploaded screen (the articles name no model; LLM-based is an inference). Lessons that match this project's design: role and context framing instead of rules, OCR before reasoning, deliberately skimming fine print (compare `prd.md` §7.4 attention weights), and positioning as a quick check rather than validation. No accuracy data was published, so it is a design precedent, not evidence.
- **UICrit** (https://github.com/google-research-datasets/uicrit, UIST 2024, CC BY 4.0 per the discovery scan, unverified): 11,344 designer critiques with bounding boxes over 1,000 mobile UIs; candidate benchmark material for Phase 7 (GAP-021) and for calibrating UX_RISK wording.
- **UXAgent** (https://github.com/neuhai/UXAgent, arXiv 2502.12561): LLM personas driving a browser to simulate usability studies; no license detected per the discovery scan.
- Unverified leads (seen only in the discovery scan): Avenir-UX (arXiv 2604.09581), PerceptUI (arXiv 2606.05697), UXBench (arXiv 2606.16262). Read the papers before citing them in Phase 6 or 7.
- **Implication:** the precedents read so far (Heuribot directly, UXAgent through the discovery scan) report designer feedback or task metrics rather than agreement with real participants; the unverified leads were not read. This supports the existing safeguards (simulated labels, counts not percentages, no VIOLATION from personas; `docs/audit-methodology.md` §4) and keeps GAP-022 (evaluation metrics for synthetic users) open.

## 9. Industry practice sources considered

Registered as sources (with notes): Toss tech blog (T4) and Apps in Toss guide (T2 on its platform), KRDS (see its registry row). Considered and not registered this scan, all T4 per the discovery scan: Naver NULI accessibility site, LINE Design System, Woowahan tech blog; Kakao publishes no public design or accessibility guideline that the scan could find.
