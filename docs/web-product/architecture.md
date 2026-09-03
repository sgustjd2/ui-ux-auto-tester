# Web product architecture

Version: 0.1 · Status: Draft / Foundation (Phase W0) · Last updated: 2026-09-02

Scope: boundaries and runtime behavior of the web product layer. Audit semantics belong to the root `prd.md`; the integration contract is in `audit-core-contract.md`; entities are in `domain-model.md`; security controls are in `security-privacy.md`.

Transport, framework, language, database, and hosting are deliberately not chosen here. The repository has not established them, and the root PRD defers the implementation language until after repository inspection. See `decisions.md` W-OD-02 to W-OD-04.

---

## 1. System context

```
            +------------------+
            |      User        |  designer / developer / PM / QA
            +--------+---------+
                     | screenshot(s), URL, question, analysis type
                     v
+----------------------------------------------------------------------+
|  WEB PRODUCT                                                         |
|                                                                      |
|  +----------------+      +--------------------------------------+    |
|  |    Web UI      | <--> |        API / Audit Orchestrator      |    |
|  |  workspace,    |      |  uploads · jobs · lifecycle · events |    |
|  |  visual report |      |  results · deletion · retention      |    |
|  +----------------+      +------------------+-------------------+    |
|                                             | contract (JSON)        |
|                                             v                        |
|                          +------------------+-------------------+    |
|                          |        SHARED UI/UX AUDIT CORE       |    |
|                          |  Target Context Resolver · plan      |    |
|                          |  +----------+ +--------+ +---------+ |    |
|                          |  |Standards | |Expert  | |Synthetic| |    |
|                          |  |Auditor   | |UX      | |User     | |    |
|                          |  +----------+ +--------+ +---------+ |    |
|                          |  +----------+ +--------+ +---------+ |    |
|                          |  |Flow/     | |Evidence| |Severity/| |    |
|                          |  |Browser   | |        | |Recomm./ | |    |
|                          |  |(runtime) | |        | |Regress. | |    |
|                          |  +----+-----+ +--------+ +---------+ |    |
|                          +-------|----------------------------+    |
|                                  | drives                          |
|                          +-------v-----------+                     |
|                          | Browser / runtime |  W4                 |
|                          | worker (sandboxed)|                     |
|                          +-------------------+                     |
|                                                                      |
|  +----------------------------------------------------------------+  |
|  |  STORAGE: artifacts (uploads, captures, crops) · audit metadata |  |
|  |  · event log · findings/evidence/persona output as produced     |  |
|  +----------------------------------------------------------------+  |
+----------------------------------------------------------------------+
                     |
                     v
            Findings + Evidence  -->  Web report (summary → finding → evidence → technical detail)
```

The same Audit Core is consumed by the ChatGPT Skill (where ChatGPT is the runtime), and later by a CLI, CI checks, and a public API. Nothing in the core may depend on web concepts.

---

## 2. Components and boundaries

### 2.1 Web UI

Responsibilities: input capture (drop, paste, pick, URL later), analysis type selection, progress display, result rendering (summary, preview with markers, grouped findings, persona cards, coverage, drawer), deletion, browser-local recent list, copy/export.

Must not: call any model, contain prompts, contain rule text or IDs beyond what a result carries, define personas, compute severity or confidence, synthesize findings, or read core reference files. It renders what the API returns.

May: sort and group findings by core-provided fields with a pure function (`web-product-prd.md` §10.4), map enums to labels and colors, compute marker geometry from normalized regions, and remember view state.

Interfaces: product API (`audit-core-contract.md` §3.1).

### 2.2 API / Audit Orchestrator

Responsibilities:

- Uploads: validation by content, re-encoding, metadata stripping, storage under random IDs (`security-privacy.md` §3.1).
- Audit jobs: create, start, status, events, cancel, rerun, delete; lifecycle state machine (§5).
- Executing the core through the adapter; persisting every event and the final envelope as produced.
- Adding the namespaced `presentation` object (marker numbers, groups, display rank) to findings for the UI. This is the only transformation the orchestrator applies to core output.
- Retention enforcement and hard deletion.
- Rate limiting and abuse controls.
- Capability pass-through: exposes the core's capability descriptor so the UI can enable or disable analysis types and persona presets without redeploying.

Must not: contain prompts, rules, personas, or scoring; call model providers directly; interpret audited content.

Interfaces: product API to the UI; core adapter to the Audit Core (`audit-core-contract.md` §3.2); storage.

### 2.3 Shared UI/UX Audit Core

Owned by the core/Skill stream. From the web layer's point of view it is a black box with one contract: capability descriptor in, audit request in, events and a result envelope out. Inside it live the engines from the root PRD §7: Target Context Resolver, Standards Auditor, Expert UX Review, Synthetic User, Flow Runner, Evidence, Severity, Recommendation, Regression, plus the rule registry and references. Its internal layering (resolver, evidence layer with machine truth and the perception snapshot, reasoning engines, output layer) is specified in `docs/architecture.md` §1–§2 and is not repeated here.

The core needs a programmatic runtime to be callable from the web (the ChatGPT Skill has ChatGPT as its runtime). Whether that runtime is part of the core package or a thin executor contributed by the web stream is open (`decisions.md` W-OD-04). Either way, the methodology, references, schemas, and deterministic checks stay in the core and the web layer never re-implements them.

### 2.4 Synthetic User engine

Part of the core. The web layer interacts with it only through the audit request (`options.personas` with persona ids or dimension values advertised by the capability descriptor, plus the user's question) and reads persona runs and the persona summary from the envelope. The engine, not the web layer, decides which synthetic tests run, how personas perceive the screen, how agreement is aggregated, and which USER_SIGNAL findings result.

### 2.5 Browser / runtime worker (W4)

A sandboxed worker that the core's Flow Runner and Standards Auditor drive when the target is a URL: navigation, viewports, keyboard passes, form interaction, accessibility-tree inspection, screenshots, performance data (root PRD §14). It runs in an isolated, egress-restricted environment with an ephemeral browser profile per job, no downloads, no destructive or externally visible actions, and credential isolation (`security-privacy.md` §3.6). It produces artifacts (captures) and measured evidence into storage; it never talks to the Web UI.

### 2.6 Storage / evidence

Three stores, whatever the technology:

- Artifact store: uploads, captures, evidence crops. Random IDs, private, no public listing, served through short-lived signed or session-checked URLs.
- Metadata store: audits, targets, screens, jobs, links between audits (rerun, retest), and the core output persisted as produced (plan, summary, findings with embedded evidence, rules index, persona runs, persona summary, coverage, limitations, versions).
- Event log: append-only per audit; supports reconnecting clients and partial results; retained with the audit.

All three are deleted together when an audit is deleted or expires.

### 2.7 Boundary rules (enforceable)

| Rule | How it is checked |
|---|---|
| No model SDK or HTTP calls to model providers outside the core adapter package | dependency allowlist per package; CI grep for provider SDK imports |
| No prompt templates in web or API packages | CI grep for prompt markers agreed with the core stream (for example files under a `prompts/` path, or strings such as "You are") |
| No rule text or persona definitions in web or API packages | CI check that web/API packages do not import from the core's references or registry paths |
| Findings are stored as produced; only `presentation` is added | schema validation on write: stored finding minus `presentation` equals the core finding |
| Severity, priority, confidence, finding type are never modified | unit test on the orchestrator's transform |
| Audited content is never placed in an instruction position | code review checklist; prompt-injection fixture in acceptance tests (`web-product-prd.md` W1-AC-10) |

---

## 3. Repository layout (proposal, provisional)

The repository currently holds only the root PRD. The root PRD §9 and §16 plan a Skill folder (`ui-ux-auditor/`), `docs/`, `research/`, `.claude/`, `scripts/`, and `tests/`. The web layer must not disturb those. Two options:

Option A — same repository, additive top-level folders:

```
apps/
  web/                 Web UI
services/
  api/                 API / Audit Orchestrator (may be merged with apps/web if the stack is full-stack)
  browser-worker/      W4
packages/
  audit-core-adapter/  the contract types, the fixture adapter, and transport bindings (subprocess/in-process/HTTP)
  web-schemas/         JSON schema copies used for validation in CI (generated from the core's schema when published)
fixtures/
  web/                 example envelopes, screenshots for acceptance tests (Korean and English), prompt-injection fixture
```

Option B — separate repository for the web product, consuming the core as a versioned package or CLI.

Recommendation: Option A until the core's packaging is known, because the contract and fixtures need to evolve with the core, and a single repository keeps the schema-conformance test (`web-product-prd.md` W1-AC-15) simple. Folder names are provisional; the decision is W-OD-03. Do not create these folders until W1 starts. When their locations are decided, the core stream adds them to the layout table in `docs/architecture.md` §6 as externally owned directories (ADR 0006); this stream requests that addition rather than editing the table.

---

## 4. Request flow (W1, screenshot Quick Review)

```
UI                     API / Orchestrator                 Audit Core (adapter)
|  POST create_audit    |                                   |
|---------------------->|  audit QUEUED, audit_id           |
|  upload artifact      |  validate, re-encode, store       |
|---------------------->|  screen scr_1 attached            |
|  start_audit          |  RUNNING; open event log          |
|---------------------->|  run(request, sink) ------------->|  plan → visual → personas → standards → report
|  poll status / events |<-- stage_started(visual) ---------|
|<----------------------|<-- summary -----------------------|  PARTIAL results visible
|                       |<-- plan; finding ×N --------------|
|                       |<-- persona_run ×3, persona_summary|
|                       |<-- stage_completed ×k ------------|
|                       |<-- completed(envelope) -----------|
|  get_result           |  add presentation; persist; COMPLETED
|<----------------------|                                   |
```

W1 may run the adapter inline inside the API process (a background task per request) rather than through a queue. The state machine, event log, and API shape are the same either way, so moving to a queue later changes no client code.

---

## 5. Asynchronous audit lifecycle

### 5.1 States

```
                 start                 first stage done
   QUEUED  -------------->  RUNNING  ------------------>  PARTIAL (RUNNING with partial results)
      |                        |                                |
      | cancel                 | all stages done                | all stages done
      v                        v                                v
  CANCELLED                COMPLETED  <--------------------- COMPLETED
                               ^
      failure of a required stage, timeout, or infrastructure error
                    RUNNING/PARTIAL ---------------------------> FAILED
      cancel while running
                    RUNNING/PARTIAL ---------------------------> CANCELLED (partial results kept)
```

- `QUEUED`: created, target attached or pending; nothing executed.
- `RUNNING`: the core is executing; no stage output yet.
- `PARTIAL`: at least one stage has produced output and others are still running, or the run finished with some stages FAILED or SKIPPED. Represented as `status: RUNNING|COMPLETED` plus `partial: true` so that clients can treat it as both a state and a flag. (Provisional representation; W-OD-10.)
- `COMPLETED`: all planned stages finished; `partial` is true if any stage was skipped or failed but the report is still usable.
- `FAILED`: no usable result (intake failure, required stage failure, timeout without output).
- `CANCELLED`: user cancelled; output produced before cancellation is kept and labeled.

Terminal states: COMPLETED, FAILED, CANCELLED. Terminal audits are immutable except for deletion.

### 5.2 Stages and delivery order

| Stage | Produces | Screenshot input | URL input (W4) |
|---|---|---|---|
| intake | validated target, inferred device/platform, audit plan, coverage preview | yes | yes (adds discovery) |
| visual | summary (perceived purpose, first impression, likely next action, answer to the question), visual hierarchy findings, regions | yes | yes, per captured screen |
| personas | persona runs, persona summary, USER_SIGNAL findings | yes | yes |
| standards | rule results, VIOLATION and UX_RISK findings, coverage, limitations | static subset | full |
| runtime | keyboard, forms, responsive, performance evidence | skipped | yes |
| report | final envelope, ordering, versions | yes | yes |

Delivery order is intake → visual → personas → standards → runtime → report, so that the user sees the answer to "what is this and what will people do" first and the deepest checks last. The core may run stages concurrently; the orchestrator only requires that events be emitted as they become available. These are delivery stages for streaming; the core's check lifecycle (`docs/audit-methodology.md` §3: plan, collect, evaluate, derive, score, recommend, report) runs inside them, and a finding is emitted only once it is complete per `docs/finding-schema.md`.

### 5.3 Events

Persisted per audit in order, each with a monotonically increasing sequence number. Event kinds (provisional names, `audit-core-contract.md` §4.4): `plan`, `stage_started`, `stage_completed`, `summary`, `finding`, `persona_run`, `persona_summary`, `coverage`, `limitation`, `completed`, `failed`, `cancelled`. Clients resume from a sequence number after a reconnect.

### 5.4 Client behavior

- W1: poll `get_status` every 2 s while non-terminal and fetch `get_result` on each stage change; or subscribe to `stream_events` if the chosen stack makes server-sent events trivial (W-OD-10). Both must be supported by the API shape from the start.
- The UI renders partial results immediately and shows which stages are still running.
- On FAILED, the UI shows the error class (invalid input, core unavailable, timeout, internal) and offers retry as a new audit.

### 5.5 Timeouts, retries, idempotency

- Per-stage soft timeout: the orchestrator marks a stage SKIPPED with a limitation if it exceeds its budget and the core supports partial completion; hard timeout for the whole audit ends it FAILED or COMPLETED-partial depending on what exists.
- `create_audit` accepts an idempotency key so a retried request does not create duplicates.
- The core adapter call is retried once on transient infrastructure errors before the audit is marked FAILED; the core itself is expected to be idempotent for the same request and seed.
- Cancellation propagates to the core through a cancellation signal; the orchestrator waits a bounded time for the core to stop, then records CANCELLED regardless.

### 5.6 Provisional budgets (W1, to be measured)

| Item | Budget |
|---|---|
| intake | 5 s |
| visual | 25 s |
| personas (3 presets) | 40 s |
| standards (static) | 30 s |
| report | 5 s |
| whole audit hard timeout | 180 s |

---

## 6. Storage and evidence

- Identifiers are random and unguessable (at least 128 bits of entropy); nothing is sequential.
- Uploads are re-encoded and stored once; derived artifacts (thumbnails, evidence crops) reference the parent and are deleted with it.
- Marker regions come from evidence items embedded in findings and persona signals, as `value.region` rectangles normalized to 0..1 of the screen (provisional convention, `audit-core-contract.md` §4.6), so the same evidence renders at any zoom or viewport and survives re-encoding. Pixel coordinates, when the core reports them, are converted at ingest and the original values kept inside the evidence `value`.
- The envelope is stored as produced by the core, plus `presentation`, plus storage metadata (created, expires, versions). It is never rewritten after the audit reaches a terminal state.
- Retention: a scheduled job deletes expired audits and their artifacts; deletion is hard and complete (`security-privacy.md` §3.2).
- Media are served only through the API with authorization checks (session-scoped access to unlisted IDs in W1; account ACLs in W5).

---

## 7. Browser / runtime worker (W4 sketch)

```
Orchestrator --job--> Worker pool (one isolated browser context per job)
                        - egress allowlist / private-range denylist (SSRF), DNS pinning
                        - no downloads, no clipboard, no file system access
                        - ephemeral profile; credentials injected as opaque session only
                        - action policy: navigate, viewport, keyboard, hover, click on non-destructive
                          controls, fill forms with synthetic data; never submit payments,
                          deletions, or messages; robots and explicit per-target allowances respected
                        - captures: screenshots (screens), accessibility tree, computed styles,
                          focus traces, console, timings → artifact store + measured evidence
```

The core's Flow Runner decides what to do; the worker enforces what is allowed. The worker's action policy is a security control and lives in the worker, not in prompts.

---

## 8. Deployment topology by phase (illustrative, not a decision)

- W1: one web/API service with an inline executor, one artifact store, one metadata store. A single container is enough.
- W2–W3: same, plus a background worker if audits exceed request time limits.
- W4: queue plus a browser worker pool in a separate network segment.
- W5–W6: accounts, ACLs, integrations; the core is also exposed as a CLI/API for CI consumers using the same contract.

---

## 9. Cross-cutting concerns

- Versioning: every envelope records contract version, core version, corpus version, finding schema version, and model identifier. The UI shows corpus and core versions; contract changes follow the compatibility rules in `audit-core-contract.md` §6.
- Feature availability: analysis types, persona presets, and input kinds are enabled from the capability descriptor, not from hard-coded flags.
- Observability: traces per audit with stage timings, error causes, and cost counters; no image bytes or uploaded text in logs (`security-privacy.md` §3.8).
- Errors: typed error codes shared between the adapter and the API (invalid_input, unsupported_capability, core_unavailable, timeout, cancelled, internal).
- Accessibility of the product UI: WCAG 2.2 AA target; the finding list is the accessible representation of the marker overlay.

---

## 10. Extension points for later phases

| Future capability | Attaches to | Boundary impact |
|---|---|---|
| Multi-screen / flows (W2) | target kind `SCREENSHOT_SET` with ordered screens and optional flow | none beyond target shape |
| Persona configuration (W3) | `options.personas` values advertised by the capability descriptor | none |
| Live URL and authenticated sites (W4) | target kind `URL`; browser worker; credential vault | worker isolation and credential rules |
| Projects, history, regression (W5) | web-owned entities Project, Target, Retest link; comparison uses stable issue identity supplied by the core (W-OD-11) | core must provide a stable issue fingerprint |
| Share links, comments, exports, Jira/GitHub, CI, API keys (W6) | web-owned entities and integrations over the same contract | none in the core |
| Figma input, browser extension | new target kinds; extension uses the product API | core must accept the new input kind |
| Design-system auditing | additional context in the audit request (component inventory) | core methodology extension |
| Automatic fix suggestions and source remediation | code guidance already in the finding schema; source input is a new target kind | core Phase 4+ |
