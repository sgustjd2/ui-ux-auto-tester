# Web product stream — documentation index

This folder defines the **web product layer** of UI/UX Auto Tester: a web service where users upload screenshots (later: several screens, URLs, flows) and receive structured UI/UX feedback produced by the shared UI/UX Audit Core.

Status: Phase W0 (product definition) complete on 2026-09-02, with Phase W1 (single-screenshot), Phase W2 (multi-screen flow), and Phase W3 (persona configuration) slices built the same day against a fixture Audit Core. The slices live under [web/](../../web/README.md): upload one screenshot or an ordered flow, choose which personas to simulate with an optional seed, run an analysis, and inspect summary, markers, grouped findings, simulated personas (with honest not-simulated handling), coverage, evidence, a flow strip with per-step markers, and a whole-result export, all from `web/fixtures/`. The Audit Core integration seam is also in place: a subprocess CLI binding, a reference core CLI that defines the wire protocol executably, and a cross-transport conformance harness (W1-AC-15), so a real core in any language drops in without server changes. The core stream's Phase 0 harness exists in the repository as of the same date, every shape here has been reconciled to its published schemas, and the parallel-stream boundary is recorded on the core side in [ADR 0006](../decisions/0006-parallel-web-product-stream-boundary.md). W1/W2/W3/W5/W6-groundwork decisions, the accessibility pass, and deferrals: [decisions.md](decisions.md) W-D-17, W-D-18, W-D-19, W-D-20, W-D-21, W-D-22, W-D-23, W-D-24, W-D-25, W-D-26, W-D-27, W-D-28, W-OD-04, W-OD-10, W-OD-11, W-OD-18.

## Where this folder sits

Per `CLAUDE.md` (Source of truth) and ADR 0006, `docs/web-product/*` is at level 5 of the repository's authority order: below root `prd.md`, `CLAUDE.md`, `docs/architecture.md`, `docs/decisions/*`, and the core schema documents. If anything here conflicts with those, they win and the conflict is recorded in [decisions.md](decisions.md).

## Reading order

1. Root [prd.md](../../prd.md) — the core product and Skill PRD, highest authority for audit semantics.
2. [CLAUDE.md](../../CLAUDE.md) — repository operating manual (rules that also bind this stream: source of truth, git safety, trust boundary, definition of done).
3. [ADR 0006](../decisions/0006-parallel-web-product-stream-boundary.md) — the boundary between the core stream and this stream.
4. Core schemas this folder depends on: [docs/finding-schema.md](../finding-schema.md), [docs/rule-schema.md](../rule-schema.md), [docs/audit-methodology.md](../audit-methodology.md), [docs/architecture.md](../architecture.md).
5. [web-product-prd.md](web-product-prd.md) — what the web product is, who it is for, the MVP, modes, journeys, information architecture, workspace and report UX, synthetic-user UX, requirements, roadmap, acceptance criteria.
6. [architecture.md](architecture.md) — component boundaries (Web UI, API/orchestrator, Audit Core, Synthetic User engine, browser/runtime worker, storage/evidence), asynchronous audit lifecycle, streaming, storage, repository layout proposal.
7. [audit-core-contract.md](audit-core-contract.md) — the integration contract between the orchestrator and the Audit Core: what is binding (core schemas) and what is provisional (envelope, events, capability descriptor, transport), with JSON examples.
   - [core-integration-guide.md](core-integration-guide.md) — actionable how-to **for the core stream**: exactly what the runnable core entry point must implement and how to verify it against the conformance harness, so binding is turnkey.
8. [domain-model.md](domain-model.md) — conceptual entities, relationships, and ownership.
9. [security-privacy.md](security-privacy.md) — threat model and mandatory controls for uploads, retention, untrusted content, credentials, and live browsing.
10. [decisions.md](decisions.md) — decision log, assumptions about the core with their confirmation status, open decisions, risk register.

A fresh implementation agent should be able to start Phase W1 (screenshot feedback MVP) from these files plus the root PRD and the core schemas. The W1 task list is in [web-product-prd.md](web-product-prd.md) §19.1, and the decisions that gate W1 coding are listed in [decisions.md](decisions.md) §3 (W-OD-02, W-OD-03, W-OD-04 first).

## Ownership boundary (parallel work)

Two streams work in this repository in parallel. The boundary below is stated here and accepted by the core stream in ADR 0006.

| Stream | Owns | Must not edit |
|---|---|---|
| Core / Skill stream (harness, standards research, rule registry, audit methodology, Skill packaging) | `CLAUDE.md`, root `prd.md`, root `README.md`, `.gitignore`, `docs/architecture.md`, `docs/rule-schema.md`, `docs/finding-schema.md`, `docs/audit-methodology.md`, `docs/standards-research-plan.md`, `docs/standards-coverage.md`, `docs/decisions/`, `research/`, `.claude/`, `scripts/`, `tests/`, the Skill folder (root `prd.md` §9) | `docs/web-product/` |
| Web product stream (this folder) | `docs/web-product/`, and from W1 the web application, API/orchestrator, and web-side fixtures in the locations decided in [decisions.md](decisions.md) W-OD-03 | everything in the row above |

Rules this folder follows:

- Shared schemas are used verbatim: findings, check results, severity, priority, confidence, evidence items, and persona signals from `docs/finding-schema.md`; rule identifiers and display fields from `docs/rule-schema.md`; mode names and the evidence capability matrix from `docs/audit-methodology.md`; persona dimensions from `docs/architecture.md` §3. Web-specific additions are namespaced (`presentation`, `storage`) and never rename or reinterpret core fields.
- Anything the core has not yet specified (capability descriptor, audit request, events, result envelope, persona run container, coverage container, transport) is marked provisional and tracked in [decisions.md](decisions.md) §2 with its confirmation status. The core stream reviews those assumptions when it publishes the report and JSON output schema (GAP-025 in `research/gaps.md`).
- No auditing intelligence (prompts, rule text, persona definitions, scoring) is specified for the web layer; it is consumed through the contract.
- This stream does not edit core-owned files. Cross-stream requests go through this README and [audit-core-contract.md](audit-core-contract.md) §9; the core stream raises mismatches in its own decision log or gap tracker.

## Cross-stream status

Done by the core stream on 2026-09-02 (ADR 0006): pointer to this folder in `CLAUDE.md` startup read order; `docs/web-product/` row in the `docs/architecture.md` §6 layout table; note in `research/ledger.md`; GAP-025 scheduling a review of this folder's provisional assumptions at core Phase 3; `scripts/check-harness.mjs` skips this folder.

Still open:

- The requests in [audit-core-contract.md](audit-core-contract.md) §9 (evidence region field, capability descriptor, result envelope or JSON output schema, rule display metadata, progressive events, persona run container, stable issue identity, runnable entry point, injection fixture). Reviewed at core Phase 3 per GAP-025 unless raised earlier at W1 kickoff.
- Root `prd.md` does not mention the web product; whether to add a section is the user's call ([decisions.md](decisions.md) W-OD-16).
- When W1 decides the application directories (W-OD-03), the core stream adds them to the `docs/architecture.md` §6 layout table as externally owned (ADR 0006); this stream requests that rather than editing the table.

## Validating this folder

`scripts/check-harness.mjs` does not validate this folder (ADR 0006). Run the folder's own check before finishing any change here:

```bash
node docs/web-product/check-links.mjs
```

It verifies that markdown links resolve and that `§` references to sibling documents, the core schema documents, and the root PRD point at headings that exist. It has no dependencies.

## Conventions

- `WFR-nn`, `WNFR-nn`: web functional and non-functional requirements. `W1-AC-nn`: MVP acceptance criteria. `W-D-nn`: web-stream decisions. `W-A-nn`: assumptions about the core. `W-OD-nn`: open decisions. `W-R-nn`: risks.
- Phases are `W0`–`W6` to distinguish them from the root PRD's Phases 0–8.
- Identifier prefixes used in examples: `aud_` audit, `scr_` screen, `art_` artifact, `prs_` persona run. Finding ids follow `docs/finding-schema.md` (`F-<run_id>-<seq>`). Prefixes are conventions for readability, not requirements.

## How to change these documents

- Keep the root PRD and the core schemas as the authority on audit semantics; if a web need conflicts with them, record the conflict in [decisions.md](decisions.md) and raise it, do not redefine the concept here.
- Record every material decision in [decisions.md](decisions.md) with context and consequences; convert an open decision into a decision rather than deleting it.
- Update `Last updated` in the file you change, and run `node docs/web-product/check-links.mjs` before finishing.
