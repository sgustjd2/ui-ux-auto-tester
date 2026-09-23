# ADR 0007: Ecosystem landscape and industry sources

- Status: ACCEPTED
- Date: 2026-09-23
- Phase: 1
- Supersedes / Superseded by: none

## Context

On 2026-09-23 the user asked for the latest UI/UX technical material (GitHub projects, the Toss tech blog, and similar) to be researched and reflected in the project. The scan turned up three kinds of material the research plan did not yet place:

1. Tools, datasets, and AI precedents (axe-core, Playwright and its MCP server, Chrome DevTools MCP, Lighthouse, Baseline data, the Agent Skills format, Toss's Heuribot, UICrit). They matter for deferred decisions (GAP-013 to GAP-017, GAP-019, Phase 4 packaging) but are not standards, so they do not belong in `research/sources.md`.
2. Industry sources of two different strengths: a company tech blog (Toss), which the tier table in `docs/standards-research-plan.md` §3 puts at T4, and a company's rules that bind third parties on its own platform (the Apps in Toss UI/UX guide and review checklist), which behave like a platform vendor's guidance, but only on that platform.
3. Newer versions whose legal effect lags publication (EN 301 549 V4.1.1 published 2 September 2026 but not yet cited in the Official Journal), and a major successor still in draft (WCAG 3.0 Working Draft of 10 September 2026).

## Decision

1. `research/landscape.md` is the single home for non-normative ecosystem facts: tool versions and capabilities, datasets, AI-evaluation precedents, and web-platform Baseline status. Every entry carries a scan date and a primary location; anything read only through a discovery summary is marked unverified. Nothing in it anchors a rule. Adopting a listed tool still needs its own ADR (ADR 0004).
2. A company blog or article collection is one T4 row, cited per article. A company's guidelines that bind third parties on the company's own platform (enforced at review) are T2 for audits of that platform and T4 anywhere else; the row notes state that scope. The rule schema's `platforms` enum does not yet express such platforms; that is a Phase 2 question (GAP-044).
3. A draft successor of a registered standard may be registered as a watch-only row: VERIFIED at its canonical location, `source_status: DRAFT`, `domains: none`, and no rules minted until it matures and the user or an adopting law makes it relevant.
4. When a newer version of a legal-reference standard is published before laws cite it, the older row is set to SUPERSEDED per the research plan §4 and its notes state that it remains the legally cited version; both rows serve the domain until the citation changes.

## Consequences

- `docs/architecture.md` §6 and the `CLAUDE.md` persistent-state table list `research/landscape.md`.
- Tool facts go stale quickly; the file must be refreshed before any decision that depends on it.
- T4 and platform-scoped rows can be VERIFIED and listed in coverage without lowering the evidence bar, because tier limits still apply at rule time (`docs/rule-schema.md` §4 tier constraint).

## Alternatives considered

- Registering tools in `research/sources.md`: rejected; tools are not authorities and would confuse coverage and tier checks.
- Keeping tool notes only in the ledger session log: rejected; the log is append-only history, not a place to look up the current state.
- Treating Apps in Toss as T4 everywhere: rejected; for an Apps in Toss mini-app its rules are enforced requirements, like a platform vendor's app review rules.
- Treating EN 301 549 V3.2.1 as CURRENT until OJ citation: rejected; the research plan ties `source_status` to the publishing authority, and the legal lag is expressed in notes instead.
