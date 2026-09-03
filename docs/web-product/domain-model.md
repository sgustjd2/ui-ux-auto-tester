# Web product domain model

Version: 0.1 · Status: Draft / Foundation (Phase W0) · Last updated: 2026-09-02

Conceptual model for planning. No database schema or migrations are defined here. Core-produced entities use the shared schemas ([docs/finding-schema.md](../finding-schema.md), [docs/rule-schema.md](../rule-schema.md)) verbatim; the web layer stores them as produced.

---

## 1. Entity catalogue

| Entity | Owner | Phase | Purpose | Key attributes (conceptual) |
|---|---|---|---|---|
| User | web | W5 | account holder | id, email, created; absent in W1 (anonymous audits) |
| Project | web | W5 | groups targets and audits for a product | id, name, owner, members (W6) |
| AuditTarget | web | W1 (implicit), W5 (explicit) | the thing being audited across runs | id, kind (SCREENSHOT, SCREENSHOT_SET, URL, FLOW; later DESIGN, SOURCE), label, project; in W1 one target per audit, implicitly |
| Audit | web | W1 | one run of the Audit Core against one target with one intent | id, run_id, target, analysis_type, modes resolved by the core, question or task, options (device hint, persona ids, seed, budget), status, partial flag, stages, plan, created, started, finished, expires, versions (contract, core, corpus, finding schema, model), links (rerun_of, retest_of), access token or owner |
| Artifact | web | W1 | a stored file | id, audit, kind (UPLOAD, CAPTURE, CROP, THUMBNAIL), media type, bytes, width, height, sha256, created; never public |
| Screen | web (identity) / core (analysis) | W1 | one visual state of the target | id, audit, artifact, order, label, width, height, device hint; for URL targets: url, viewport, capture step |
| Flow | web (definition) / core (evaluation) | W2 | an ordered sequence of screens with a task | id, audit, task, steps (screen ids), expected outcome |
| Job | web | W1 | execution record of an audit | audit, attempt, executor (inline, queue), started, ended, error, stage timings, cost counters |
| Event | web | W1 | append-only stream of core output and lifecycle changes | audit, seq, kind, payload, ts |
| Finding | core (content) / web (storage, presentation) | W1 | an issue in the `docs/finding-schema.md` §3 shape | see §3; plus `presentation` {marker_number, group, display_rank} added by the web layer |
| Evidence item | core | W1 | observable support, embedded in a finding or a persona signal | type (`docs/finding-schema.md` §7), ref, value (may carry a normalized region, contract §4.6), captured_at, method (automated, visual, manual, simulated), artifact, note |
| RuleReference | core | W1 | a rule cited by a finding | on the finding: {id, result}; display metadata (title, authority, rule_class, source_version, source_url, conformance_level, normative_strength) resolved by the core into the envelope's `rules_index` from the registry (`docs/rule-schema.md` §4) |
| Recommendation | core | W1 | embedded in Finding | recommendation, code_guidance, retest {steps, expected_result, layer}, automation_candidate {assertion, tool_hint} |
| PersonaRun | core | W1 | one persona's signals for one screen or flow | id, audit, persona {persona_id, label, dimensions per `docs/architecture.md` §3}, screen or flow, signals (`docs/finding-schema.md` §8 items with optional embedded evidence), outcome {CONTINUE, HESITATE, ABANDON, confidence}, not_simulated reason, simulated: true |
| PersonaSummary | core | W1 | agreement across personas as counts | personas_tested, per test: majority answer, agree count, dissent; personas_confused, task_failures; derived USER_SIGNAL finding ids; disclaimer |
| Coverage | core | W1 | what was checked and with what result | applicable rule count; per rule: result (PASS, FAIL, PARTIAL, NOT_TESTED, NOT_APPLICABLE), method, reason, finding ids; not-tested check families with reasons; rule sets |
| Limitation | core | W1 | human-readable disclosure | scope (audit, stage, finding), text |
| Retest | web | W5 | link from a new audit to the audit it verifies, with a comparison | audit, retest_of, comparison {fixed, unresolved, new, regressed} using a stable issue identity from the core |
| ShareLink | web | W6 | scoped read access to an audit | token, audit, scope, expires, created_by |
| Comment | web | W6 | discussion on a finding | audit, finding, author, body, created |

Ownership meaning: the owner defines the entity's meaning and schema. The web layer stores core-owned entities without reinterpretation and may add namespaced metadata only.

---

## 2. Relationships

```
User (W5) 1 --- * Project (W5) 1 --- * AuditTarget 1 --- * Audit
                                                            |
                    +-------------+-------------+-----------+------------+-------------+
                    |             |             |           |            |             |
                  * Screen     * Artifact    1 Job       * Event     1 Result envelope  * Retest / ShareLink / Comment (W5, W6)
                    |             ^                                         |
                    | 1..1        | (screen -> upload or capture artifact)  +-- 1 plan (AuditPlan)
                    +-------------+                                         +-- 1 summary
                                                                            +-- * Finding
                  Flow (W2) 1 --- * Screen (ordered steps)                  |       +-- * Evidence item (embedded)
                                                                            |       +-- * RuleReference {id, result}  -> rules_index
                                                                            |       +-- * heuristic id               -> rules_index
                                                                            |       +-- * persona signal (embedded)  -> PersonaRun by persona_id
                                                                            +-- 1 rules_index
                                                                            +-- * PersonaRun
                                                                            |       +-- * signal (embedded) --- * Evidence item (embedded)
                                                                            +-- 1 PersonaSummary
                                                                            +-- 1 Coverage
                                                                            +-- * Limitation
                                                                            +-- versions, timing

Audit --rerun_of--> Audit          (W1: new audit created from a previous one with changed options)
Audit --retest_of--> Audit         (W5: verification run; comparison stored on Retest)
```

Cardinality notes:

- W1: one Audit has exactly one Screen and one UPLOAD Artifact; AuditTarget exists implicitly (one per audit) so that W5 can attach history without changing the Audit shape.
- Evidence items are embedded where they are used (finding or persona signal), as the shared schema defines them. The web layer derives markers by scanning embedded evidence for regions; it keeps no separate evidence table in W1.
- A Finding may cite several rules and several heuristics; a root issue may carry supporting evidence of other kinds but has exactly one `finding_type` (`docs/finding-schema.md` §1).

---

## 3. Finding fields (binding: `docs/finding-schema.md` §3) and web additions

Core fields, stored exactly as produced:

```
issue_id, title, finding_type, severity, priority, confidence, platform, device, viewport,
location, component, flow, observed, expected, impact, evidence, rules, heuristics,
persona_signals, recommendation, code_guidance, retest, automation_candidate, limitations
```

Enumerations and formats (all from `docs/finding-schema.md`): `issue_id` is `F-<run_id>-<seq>`; `finding_type` is VIOLATION, UX_RISK, or USER_SIGNAL; `severity` is Critical, High, Medium, Low, or Informational; `priority` is P0 to P3; `confidence` is HIGH, MEDIUM, or LOW (USER_SIGNAL at most MEDIUM); `platform` is web, pwa, ios, android, or desktop; `viewport` is a string (`n/a` for non-runtime inputs); `evidence` is a non-empty list of §7 items; `rules` items are {id, result} with result PASS, FAIL, PARTIAL, NOT_TESTED, or NOT_APPLICABLE; `retest` is {steps, expected_result, layer}; `limitations` is a string. Rule classes on referenced rules (via `rules_index`) are NORMATIVE, LEGAL, PLATFORM, STANDARD, HEURISTIC, BEST_PRACTICE, or METRIC (`docs/rule-schema.md` §4).

Web addition, namespaced so it can never collide with a core field:

```
presentation:
  marker_number: integer or null    # assigned in display rank order; null when no evidence item carries a region
  group: BLOCKER | CONFUSION | IMPROVEMENT | NOTE
  display_rank: integer
```

`presentation` is derived by a pure function of `priority`, `severity`, `finding_type`, and `confidence` ([web-product-prd.md](web-product-prd.md) §10.4) and can be recomputed at any time; it is never an input to the core.

---

## 4. Identity and stability

- Audit, Screen, Artifact, and Event ids are web-generated, random, and unguessable.
- `issue_id` (`F-<run_id>-<seq>`) and `persona_run_id` are core-generated and unique within one audit's report. For comparison across audits (W5), the core must supply a stable issue identity (for example a fingerprint over rule id, component, and location semantics). Until it does, cross-run comparison is not attempted ([decisions.md](decisions.md) W-OD-11).
- Marker numbers are stable for the life of a result; they are not stable across audits.

---

## 5. Entity lifecycle

| Entity | Created by | When | Deleted |
|---|---|---|---|
| Audit | orchestrator | `create_audit` | on user deletion or retention expiry; cascades to everything below |
| Artifact (UPLOAD) | orchestrator | `submit_artifact` after validation and re-encoding | with the audit; also immediately if the audit is never started within a grace period |
| Screen | orchestrator | on artifact attach (W1) or worker capture (W4) | with the audit |
| Job, Event | orchestrator | `start_audit` and during execution | with the audit |
| Result envelope (plan, summary, findings, rules_index, persona runs, persona summary, coverage, limitations) | core, persisted by orchestrator | during execution | with the audit |
| Artifact (CROP, THUMBNAIL) | orchestrator | on demand from evidence regions | with the parent artifact |
| Retest, ShareLink, Comment | web | W5 and W6 user actions | with the audit; share links also on revoke or expiry |

Deletion is hard: no soft-delete flags for content, no backups retaining user uploads beyond the declared window ([security-privacy.md](security-privacy.md) §3.2).

---

## 6. Deliberately not modeled yet

- Organization, team, roles, billing plans (W5, W6).
- Design-file and source-code targets (later phases; the AuditTarget kind enumeration leaves room).
- Scores and category ratings (only if the core publishes a documented scoring model; root `prd.md` §13 and GAP-009).
- Any denormalized analytics tables.
