# Architecture

Status: Phase 0 baseline (2026-09-02); layout table updated at the Phase 1 exit (2026-09-23). This document describes the intended system and the repository that supports building it. It is revised at each phase; material changes go through `docs/decisions/`. Authority order: `prd.md` > `CLAUDE.md` > this file.

## 1. System overview

The product turns an input (URL, screenshots, design file, source repository, or a described user flow) into an evidence-backed audit report.

```
input + intent
   │
   ▼
Target Context Resolver ──► audit plan: platform, device, viewport set, input type,
   │                        applicable rule set, available evidence classes,
   │                        checks that will be NOT_TESTED and why
   ▼
Evidence layer ──────────► Machine Truth (DOM, accessibility tree, text, styles,
   │                        geometry, semantics, interaction state, performance)
   │                        Perception Snapshot (derived, salience-weighted view)
   ▼
Reasoning engines ───────► Standards Auditor      → check results + VIOLATION findings
   │                        Expert UX Review        → UX_RISK findings
   │                        Synthetic User Engine   → USER_SIGNAL findings (simulated)
   │                        Flow Runner             → flow timeline, task outcomes
   ▼
Severity / Recommendation / Regression ──► findings (docs/finding-schema.md)
   │
   ▼
Report (prd.md §13): coverage matrix, limitations, findings by type, roadmap, retests
```

Engine responsibilities are specified in `prd.md` §7 and are not repeated here.

## 2. Layer model

### 2.1 Knowledge layer: the standards corpus

The corpus is built in three stages, each with its own durable state:

| Stage | Artifact | Defined in | Phase |
|---|---|---|---|
| Source research | `research/sources.md`, `research/notes/<source_id>.md`, `docs/standards-coverage.md` | `docs/standards-research-plan.md` | 1 |
| Normalized rules | rule records under a registry directory (created in Phase 2) | `docs/rule-schema.md` | 2 |
| Skill references | `references/*.md` inside the packaged Skill, generated or hand-written from rule records | `prd.md` §9 | 4 |

Rules always point back to a source ID, so every audit claim can be traced to an authority, version, and verification date.

### 2.2 Evidence layer: machine truth and human perception are separate

**Machine truth** is what tooling can observe: DOM, accessibility tree, text content, computed styles, element bounds and coordinates, semantics (role, name, state), interaction state, console and network data, and performance metrics. It is collected once per audited state and is the only source of objective evidence.

**Human perception simulation** is a derived layer. From machine truth and the rendered screenshot it builds a **perception snapshot**: the elements a user could plausibly notice, weighted by visual salience and attention level (`prd.md` §7.4 example configuration), with secondary text, hidden elements, and accessibility-only labels deliberately excluded or down-weighted. Persona reasoning operates only on this snapshot, which is what prevents synthetic users from behaving like perfect OCR engines.

Rules of the layer boundary:

- Perception consumes machine truth; it never feeds back into it. A persona's belief about an element does not change what the element is.
- Standards checks use machine truth only. A persona "not noticing" a label is a user signal, not an accessibility violation.
- Every output of the perception layer carries `simulated: true` and is reported as a USER_SIGNAL, never as a violation and never as human research.

### 2.3 Reasoning layer

Four engines run over the evidence layer according to the audit plan (`docs/audit-methodology.md`):

- **Standards Auditor**: applies rule records; every applicable rule yields exactly one check result (PASS, FAIL, PARTIAL, NOT_TESTED, NOT_APPLICABLE). FAIL with rule evidence becomes a VIOLATION.
- **Expert UX Review**: applies heuristic and best-practice rules; produces UX_RISK findings with the principle cited.
- **Synthetic User Engine**: runs independent personas over perception snapshots for the tests in `prd.md` §6.2; aggregates agreement into USER_SIGNAL findings.
- **Flow Runner**: executes goal-directed paths (runtime only), records deviations, recovery behavior, and completion; feeds all three finding types.

### 2.4 Output layer

Findings follow `docs/finding-schema.md`. The three finding types stay separate through aggregation and reporting. Severity, priority, and confidence are independent dimensions. Coverage that was not tested is reported, never implied.

## 3. Synthetic user foundation

Designed now, implemented in Phase 6.

- **Persona model**: a persona is a named set of behavioral and capability parameters, not a demographic profile. Dimensions: product familiarity (first-time vs returning), experience (novice vs experienced), digital literacy (low vs high), reading behavior (skimming vs deliberate), attention (distracted vs focused), device and grip (for example mobile one-hand use), goal orientation (efficiency-oriented power use), urgency, and accessibility needs expressed as capabilities (for example screen reader use, low vision, limited fine motor control). Age, gender, nationality, or other identity attributes are never behavioral parameters (`prd.md` §3.5).
- **Default personas** in `prd.md` §6.2 are presets over these dimensions.
- **Perception configuration** follows the attention and behavior keys in `prd.md` §7.4.
- **Independence**: personas run without seeing each other's output. Aggregation reports counts ("4 of 5 simulated personas") and disagreement, never population statistics.
- **Reasoning output** is a concise observable interpretation (what was noticed, what action was expected, confidence), not hidden reasoning.
- **Labeling**: all persona output is labeled simulated at the field level and the report level.

## 4. Progressive loading design for the future Skill

The packaged Skill (Phase 4) must not load the whole corpus at once (`prd.md` §9, AC-16).

- `SKILL.md` is a control plane: how to resolve target context, which reference files to load for which platform and mode, and the output contract. It carries no standards content.
- Reference files are partitioned by source family and by concern (for example one file per standard, one per UX domain). Each reference file starts with a scope header (platforms, modes, rule ID prefixes) so the resolver can select files without reading them fully.
- Rule records are the canonical data; reference files are views over them and cite rule IDs rather than restating sources.
- Scripts (validators, coverage checks, deterministic helpers) live beside the references and stay dependency-light.
- Loading order at audit time: resolver → applicable reference files only → schemas → report template. Missing references produce NOT_TESTED results with a reason, not silent gaps.

## 5. Trust boundary enforcement

Policy is in `CLAUDE.md` (Trust boundary). Architecturally:

- The evidence layer stores external content as data with provenance (URL, selector, capture time). Nothing in the evidence store is executed or interpreted as instruction.
- The resolver fixes scope from user intent before any external content is read; later content cannot widen it.
- Text that appears to address the agent is recorded as an observation (it may itself be a deceptive pattern) and reported in the Limitations section.
- Runtime actions are restricted to a safe action list (`prd.md` §14); destructive, paid, or externally visible actions require explicit user authorization.

## 6. Repository layout

| Path | Purpose | Owner document |
|---|---|---|
| `prd.md` | Product requirements, highest authority | user |
| `CLAUDE.md` | Operating manual and current status for Claude sessions | `CLAUDE.md` |
| `README.md` | Human entry point | — |
| `docs/architecture.md` | This document | — |
| `docs/standards-research-plan.md` | Research methodology, source tiers, protocol, status vocabularies | ADR 0001 |
| `docs/standards-coverage.md` | Coverage matrix per domain (research and normalization status) | research plan |
| `docs/rule-schema.md` | Normalized rule model, ID scheme, normalization method | ADR 0002 |
| `docs/finding-schema.md` | Finding types, check results, severity, priority, confidence, evidence | ADR 0003 |
| `docs/audit-methodology.md` | Audit modes, evidence capability matrix, check lifecycle, synthetic user and flow method | — |
| `docs/decisions/` | ADR index and records | `docs/decisions/README.md` |
| `research/sources.md` | Source registry (facts per source) | research plan |
| `research/ledger.md` | Status board, next actions, session log | research plan |
| `research/gaps.md` | Gap tracker | research plan |
| `research/notes/` | One note per source (created on first use) | research plan |
| `research/phase-1-exit-report.md` | Phase 1 gate record: exit criteria, deliverables, counts at exit, items carried into Phase 2 | `prd.md` §18 |
| `research/landscape.md` | Non-normative ecosystem and tooling landscape (tools, datasets, AI precedents, Baseline status); never a rule anchor | ADR 0007 |
| `.claude/agents/` | Subagent definitions | ADR 0005 |
| `.claude/commands/` | Slash commands for recurring workflows | ADR 0005 |
| `.claude/settings.json.example` | Opt-in permissions and hook template | ADR 0004 |
| `scripts/check-harness.mjs` | Harness validator (no dependencies) | ADR 0004 |
| `tests/` | Not created yet; added when there is code to test (ADR 0004) | ADR 0004 |
| `web/` | Web product prototype (fixture-backed UI, server, adapters, tests); owned exclusively by the web-product stream, listed here as externally owned per ADR 0006 | `web/README.md` (web stream) |
| `docs/web-product/` | Parallel web-product stream; owned exclusively by that stream, subordinate to `prd.md` and the core documents above. Core sessions read its `README.md` only when working on the web stream and never edit the folder | ADR 0006 |

Directories not listed here (registry, Skill package, fixtures) are created by the phase that needs them and must be added to this table when created.

## 7. Phase map and where state lives

Phases and exit criteria are defined in `prd.md` §18. The current phase is stated in the `CLAUDE.md` Status block and changes only at phase transitions. Within a phase, progress lives in `research/ledger.md` (status board, next actions, session log) and `docs/standards-coverage.md`.

## 8. Open architectural questions

Tracked in `research/gaps.md`. Phase 0 raised: rule record serialization and validation dependency (GAP-002), METRIC finding mapping (GAP-001), and the PRD §22 open decisions (GAP-004 and GAP-009 to GAP-022).
