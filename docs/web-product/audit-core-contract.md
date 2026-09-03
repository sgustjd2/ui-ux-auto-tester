# Audit Core integration contract (provisional)

Version: 0.1-provisional · Status: Draft / Foundation (Phase W0) · Last updated: 2026-09-03

Authority: the core stream's published documents win over this contract wherever they overlap. As of 2026-09-02 the following exist and are binding here: [docs/finding-schema.md](../finding-schema.md) (finding fields, check results, severity, priority, confidence, evidence items, persona signals), [docs/rule-schema.md](../rule-schema.md) (rule records and identifiers), [docs/audit-methodology.md](../audit-methodology.md) (modes, evidence capability matrix, check lifecycle, synthetic user method), and [docs/architecture.md](../architecture.md) (layer model, persona dimensions). What remains provisional is everything the core has not yet specified: the capability descriptor, the audit request, the event stream, the result envelope that carries findings, the persona run container, the coverage container, and the transport. Those are marked "provisional" below and listed in [decisions.md](decisions.md) §2.

Transport is intentionally unspecified. §3.3 lists the bindings a W1 implementation may choose.

---

## 1. Boundary principles

1. The web layer sends targets, intent, and options. It never sends prompts, rules, persona instructions, or scoring parameters.
2. The core returns findings, persona runs, coverage, limitations, and versions. It never returns web concerns (layout, routes, marker numbers).
3. All content crossing the boundary is JSON; binary artifacts are passed by reference (URI or path) with media type and dimensions.
4. Audited content (images, OCR text, DOM, page text) is untrusted data on both sides of the boundary (root `prd.md` §17; `CLAUDE.md` Trust boundary; `docs/audit-methodology.md` §6; [security-privacy.md](security-privacy.md) §3.4).
5. The contract must be usable by the ChatGPT Skill fixtures, a CLI, CI, and an API with no web dependency.
6. Unknown fields are ignored by the web layer; required fields are versioned (§6). Findings themselves follow `docs/finding-schema.md` exactly; the web layer adds nothing inside a finding except the namespaced `presentation` object.

---

## 2. Two layers of interface

```
Web UI  --(product API, §3.1)-->  API / Orchestrator  --(core adapter, §3.2)-->  Audit Core
```

The product API is what browsers and, later, external API clients call. The core adapter is what the orchestrator calls; it is the only place in the web product that knows how the core is packaged.

---

## 3. Operations

### 3.1 Product API (Web UI ↔ API / Orchestrator)

| Operation | Purpose | Input | Output | Notes |
|---|---|---|---|---|
| `get_capabilities` | let the UI enable analysis types, input kinds, persona presets | none | CapabilityDescriptor (§4.1) plus web limits (max upload bytes, retention days) | cached; changes only on deploy or core upgrade |
| `create_audit` | create an audit shell | analysis_type, intent {question, task}, options {device_hint, persona_ids, seed}, idempotency key | audit_id, status QUEUED, expires_at | no target yet |
| `submit_artifact` | attach a screenshot | audit_id, file (multipart), optional label and order | artifact_id, screen_id, width, height, media_type | validation and re-encoding happen here; errors: invalid_type, too_large, too_small, corrupt |
| `set_target_url` (W4) | attach a URL target | audit_id, url, options (viewports, max pages, interaction policy) | target summary, confirmation text | subject to SSRF policy |
| `start_audit` | begin execution | audit_id | status RUNNING | errors: no_target, unsupported_capability |
| `get_status` | lifecycle and progress | audit_id | status, partial, stages [{name, state, started, ended, error}], progress 0..1, last_seq | polled by W1 clients |
| `stream_events` | live events | audit_id, since_seq | ordered events (§4.4) | optional in W1 |
| `get_result` | the envelope, partial allowed | audit_id | ResultEnvelope (§4.5) with `presentation` added to findings | ETag or last_seq for caching |
| `get_findings` | filtered findings | audit_id, filter {finding_type, severity, group, screen_id} | findings[] | convenience over `get_result` |
| `get_evidence_media` | media for an evidence item | audit_id, issue_id or persona_run_id, evidence index | short-lived URL for the referenced screen or crop | authorization checked |
| `get_persona_results` | persona runs and summary | audit_id | persona_runs[], persona_summary | convenience |
| `cancel_audit` | stop execution | audit_id | status CANCELLED (or the terminal state already reached) | keeps partial output |
| `rerun_audit` | new audit from an existing one | audit_id, overrides (analysis_type, intent, options) | new audit_id with `links.rerun_of` | artifacts are reused, not re-uploaded |
| `delete_audit` | hard delete | audit_id | none | idempotent; later reads return not_found |

Authorization in W1: possession of the audit id (unguessable) plus the creating browser session for mutations; W5 replaces this with account ownership ([security-privacy.md](security-privacy.md) §3.3).

### 3.2 Core adapter (Orchestrator ↔ Audit Core)

```
describe() -> CapabilityDescriptor
plan(AuditRequest) -> AuditPlan                     # optional as a separate call; the plan is also emitted as the first event of run()
run(AuditRequest, sink: Event -> void, cancel: signal) -> ResultEnvelope
```

Semantics:

- `describe` is cheap and side-effect free.
- `plan` is the Target Context Resolver output (`docs/audit-methodology.md` §3 step 1): platform, device, input kind, applicable rule count, check families that will be NOT_TESTED with reasons, evidence classes available, engines to run, estimated budget. The orchestrator may show it before starting (W4 URL confirmation) and stores it with the audit.
- `run` executes the check lifecycle (`docs/audit-methodology.md` §3), emits events as results become available, honors the cancel signal, and returns the final envelope. A finding is emitted only once it is complete per `docs/finding-schema.md` (severity, priority, confidence, recommendation, retest assigned); the summary and the plan may be emitted earlier. If the core cannot stream, it may emit only `plan` and `completed`; the orchestrator still works, without progressive delivery.
- Determinism: for the same request, versions, and `seed`, deterministic checks produce the same results; model-driven variance is acceptable and must be reflected in `confidence`, not hidden.

### 3.3 Transport bindings (choose one in W1; W-OD-04)

| Binding | When | Shape |
|---|---|---|
| In-process | orchestrator and core share a language (the core's validators are Node.js, ADR 0004) | function calls with the shapes below |
| Subprocess CLI | languages differ or isolation is wanted | `audit-core describe` prints the capability descriptor; `audit-core run` reads one AuditRequest as JSON on stdin and writes NDJSON events to stdout, ending with the `completed` event; cancellation by signal (SIGTERM). Implemented and specified executably by `web/adapter/reference-core-cli.mjs`, with the client half in `web/adapter/subprocess-adapter.mjs` |
| HTTP service | core deployed separately | `POST /audits` with the request; `GET /audits/{id}/events` as server-sent events; `POST /audits/{id}/cancel` |

The adapter package ([architecture.md](architecture.md) §3) hides the binding. A fixture binding (§8) is required in W1 regardless of the real binding chosen.

---

## 4. Data shapes

Field names are snake_case. Enumerations reuse the spellings of `docs/finding-schema.md` and `docs/rule-schema.md`. Identifiers such as `aud_…`, `scr_…`, `art_…`, `prs_…` are conventions, not requirements. Rule and heuristic identifiers in examples are illustrative; the registry does not exist yet (Phase 2).

### 4.1 CapabilityDescriptor (provisional)

```json
{
  "contract_version": "0.1-provisional",
  "core_version": "0.0.0",
  "corpus_version": "0.0.0",
  "finding_schema_version": "0.1",
  "input_kinds": ["SCREENSHOT"],
  "analysis_types": ["QUICK_REVIEW", "USER_TEST", "ACCESSIBILITY_CHECK"],
  "modes": ["SCREENSHOT_REVIEW", "SYNTHETIC_USER_TEST", "STANDARDS_AUDIT"],
  "platforms": ["web", "pwa", "ios", "android", "desktop"],
  "persona_presets": [
    {"persona_id": "first_time_user", "label": "First-time user",
     "dimensions": {"product_familiarity": "first_time", "experience": "experienced", "digital_literacy": "high", "reading_behavior": "skimming", "attention": "focused", "device_and_grip": "mobile_two_hand", "goal_orientation": "exploratory", "urgency": "low", "accessibility_needs": []}}
  ],
  "persona_dimensions": {
    "product_familiarity": ["first_time", "returning"],
    "experience": ["novice", "experienced"],
    "digital_literacy": ["low", "high"],
    "reading_behavior": ["skimming", "deliberate"],
    "attention": ["distracted", "focused"],
    "device_and_grip": ["desktop_pointer", "mobile_two_hand", "mobile_one_hand", "tablet", "keyboard_only"],
    "goal_orientation": ["exploratory", "efficiency"],
    "urgency": ["low", "high"],
    "accessibility_needs": ["screen_reader", "low_vision", "limited_fine_motor", "color_vision_deficiency"]
  },
  "synthetic_tests": ["first_impression", "primary_action", "click_expectation", "outcome_prediction", "comprehension", "recall", "confidence", "abandonment"],
  "limits": {"max_screens": 1, "max_personas": 5, "max_question_chars": 500},
  "streaming": true
}
```

- `modes` use the names in `docs/audit-methodology.md` §1: SCREENSHOT_REVIEW, STANDARDS_AUDIT, SYNTHETIC_USER_TEST, USER_FLOW_TEST, FULL_AUDIT.
- Persona dimension names follow `docs/architecture.md` §3; the value lists are provisional until the Phase 6 persona schema. Age, gender, nationality, and other identity attributes are never dimensions.
- `synthetic_tests` are the `test` enumeration of `docs/finding-schema.md` §8.
- Later values: `input_kinds` gains `SCREENSHOT_SET`, `URL`, `FLOW`; `analysis_types` gains `FULL_AUDIT`.

### 4.2 AuditRequest (provisional)

```json
{
  "contract_version": "0.1-provisional",
  "audit_id": "aud_8f3k2m",
  "run_id": "20260902-8f3k2m",
  "analysis_type": "QUICK_REVIEW",
  "target": {
    "kind": "SCREENSHOT",
    "screens": [
      {"screen_id": "scr_1", "artifact": {"artifact_id": "art_1", "uri": "file:///data/art_1.png", "media_type": "image/png", "width": 1170, "height": 2532}, "order": 1, "label": null}
    ],
    "device_hint": "auto",
    "platform_hint": null,
    "locale_hint": null
  },
  "intent": {"question": "Where would a first-time user click?", "task": null},
  "options": {
    "personas": {"persona_ids": ["first_time_user", "skimmer", "low_digital_literacy"], "custom": []},
    "seed": 1234,
    "budget": {"max_seconds": 150}
  }
}
```

- `run_id` is offered so the core can form `issue_id` as `F-<run_id>-<seq>` (`docs/finding-schema.md` §3); the core may choose its own.
- `target.kind` later: `SCREENSHOT_SET` (several ordered screens), `URL` (`url`, `viewports`, `max_pages`, `interaction_policy`), `FLOW` (screens plus `task` and expected outcome).
- `options.personas.custom` holds dimension objects only, never free-text instructions. `intent.question` is user data that the core frames as a task, never as system-level instruction.

### 4.3 AuditPlan (Target Context Resolver output; container provisional)

```json
{
  "audit_id": "aud_8f3k2m",
  "resolved": {"platform": "ios", "device": "mobile", "input_kind": "SCREENSHOT", "jurisdictions": []},
  "modes": ["SCREENSHOT_REVIEW", "SYNTHETIC_USER_TEST", "STANDARDS_AUDIT"],
  "stages": ["intake", "visual", "personas", "standards", "report"],
  "rule_sets": [{"id": "WCAG-2.2", "version": "2.2", "scope": "visually decidable rules only"}],
  "applicable_rule_count": 14,
  "not_tested": [
    {"family": "semantics", "reason": "input cannot establish semantics"},
    {"family": "keyboard_operability", "reason": "input cannot establish keyboard operability"}
  ],
  "evidence_classes": ["screenshot", "color_value", "contrast_ratio", "bounding_box", "persona_vote"],
  "estimate": {"seconds": 90}
}
```

Check families and the NOT_TESTED reasons come from the evidence capability matrix in `docs/audit-methodology.md` §2.

### 4.4 Event (provisional)

One JSON object per event; `seq` is assigned by the orchestrator when persisted.

```json
{"event": "plan",            "audit_id": "aud_…", "plan": { "…": "see 4.3" }}
{"event": "stage_started",   "audit_id": "aud_…", "stage": "visual", "ts": "2026-09-02T00:00:00Z"}
{"event": "summary",         "audit_id": "aud_…", "summary": { "…": "see 4.5" }}
{"event": "finding",         "audit_id": "aud_…", "finding": { "…": "see 4.6" }}
{"event": "persona_run",     "audit_id": "aud_…", "persona_run": { "…": "see 4.8" }}
{"event": "persona_summary", "audit_id": "aud_…", "persona_summary": { "…": "see 4.9" }}
{"event": "coverage",        "audit_id": "aud_…", "coverage": { "…": "see 4.10" }}
{"event": "limitation",      "audit_id": "aud_…", "limitation": {"scope": "audit", "text": "…"}}
{"event": "stage_completed", "audit_id": "aud_…", "stage": "visual", "state": "DONE", "error": null}
{"event": "completed",       "audit_id": "aud_…", "result": { "…": "full ResultEnvelope" }}
{"event": "failed",          "audit_id": "aud_…", "error": {"code": "timeout", "message": "…", "retryable": false}}
```

`stage_completed.state` is one of DONE, FAILED, SKIPPED.

### 4.5 ResultEnvelope (provisional container; findings per `docs/finding-schema.md`)

```json
{
  "contract_version": "0.1-provisional",
  "audit_id": "aud_8f3k2m",
  "run_id": "20260902-8f3k2m",
  "analysis_type": "QUICK_REVIEW",
  "modes": ["SCREENSHOT_REVIEW", "SYNTHETIC_USER_TEST", "STANDARDS_AUDIT"],
  "target": {"kind": "SCREENSHOT", "screens": [{"screen_id": "scr_1", "width": 1170, "height": 2532, "device": "mobile", "platform": "ios"}]},
  "intent": {"question": "Where would a first-time user click?", "task": null},
  "plan": { "…": "AuditPlan (4.3)" },
  "summary": {
    "perceived_purpose": "Sign-up screen for a personal budgeting app.",
    "first_impression": "Clean, but the plan cards read as decoration.",
    "likely_next_action": "Tap 'Get started'.",
    "answer_to_question": "2 of 3 simulated personas would tap 'Get started'; 1 would tap the logo expecting a home page.",
    "top_concerns": ["F-20260902-003", "F-20260902-001"],
    "headline": "Clear purpose; plan selection is easy to miss."
  },
  "findings": [ "…Finding (4.6)…" ],
  "rules_index": {
    "WCAG-1.4.3": {"title": "Contrast (minimum)", "authority": "W3C", "rule_class": "NORMATIVE", "source_version": "2.2", "source_url": "https://www.w3.org/TR/WCAG22/#contrast-minimum", "conformance_level": "AA", "normative_strength": "MUST"}
  },
  "persona_runs": [ "…PersonaRun (4.8)…" ],
  "persona_summary": { "…": "4.9" },
  "coverage": { "…": "4.10" },
  "limitations": [
    {"scope": "audit", "text": "Static screenshot: semantics, keyboard operability, focus order and visibility, dynamic states, responsive behavior beyond the captured viewport, and performance were not tested."}
  ],
  "versions": {"contract": "0.1-provisional", "core": "0.0.0", "corpus": "0.0.0", "finding_schema": "0.1", "model": "unspecified"},
  "timing": {"started": "…", "finished": "…", "stages": {"visual": 21.4, "personas": 33.0, "standards": 18.2}}
}
```

- `rules_index` carries, for every rule and heuristic id referenced by any finding, the display fields from `docs/rule-schema.md` §4 (`title`, `authority`, `rule_class`, `source_version`, `source_url`, `conformance_level`, `normative_strength`). It exists so the UI can render rule references without importing the registry. Provisional; requested from the core (§9).
- The orchestrator adds `presentation` to each finding and `storage` (`created`, `expires_at`, `status`, `partial`) to the envelope before serving it to the UI. Nothing else is added or changed.

### 4.6 Finding (binding: `docs/finding-schema.md` §3, JSON rendering)

Field list, required flags, and enumerations are exactly those of `docs/finding-schema.md`. Two illustrative findings for one screenshot:

```json
{
  "issue_id": "F-20260902-001",
  "title": "Suspected insufficient text contrast on plan price labels",
  "finding_type": "VIOLATION",
  "severity": "High",
  "priority": "P1",
  "confidence": "LOW",
  "platform": "ios",
  "device": "mobile",
  "viewport": "n/a",
  "location": "scr_1 (uploaded screenshot), plan cards",
  "component": "plan card price label",
  "observed": "Grey price text on a white card samples at about 2.9:1 in the screenshot.",
  "expected": "At least 4.5:1 for body-size text, or 3:1 if the text qualifies as large.",
  "impact": "Users with low vision or in bright light may not read the price before committing; the plan choice step is degraded.",
  "evidence": [
    {"type": "contrast_ratio", "ref": "scr_1", "value": {"ratio": 2.9, "foreground": "#8A8A8E", "background": "#FFFFFF", "region": {"x": 0.08, "y": 0.52, "w": 0.36, "h": 0.05}}, "captured_at": "2026-09-02T00:00:00Z", "method": "visual", "artifact": "art_1", "note": "Sampled from screenshot pixels; rendered font size unknown"}
  ],
  "rules": [{"id": "WCAG-1.4.3", "result": "PARTIAL"}],
  "heuristics": [],
  "persona_signals": [],
  "recommendation": "Use a darker color token for price text; keep the light tint for secondary labels only.",
  "code_guidance": "Raise the price label color token until it meets 4.5:1 against the card background; verify at the rendered size.",
  "retest": {"steps": ["Measure the contrast of the price labels at rendered size using computed colors."], "expected_result": "Ratio at least 4.5:1, or at least 3:1 with the text qualifying as large.", "layer": "accessibility_automation"},
  "automation_candidate": {"assertion": "contrast(.plan-price) >= 4.5", "tool_hint": "axe-core rule color-contrast"},
  "limitations": "Ratio estimated from screenshot pixels; rendered font size unknown, so the large-text exception could not be evaluated; the check is reported as PARTIAL."
}
```

```json
{
  "issue_id": "F-20260902-003",
  "title": "Simulated personas did not recognize the plan selector as a choice",
  "finding_type": "USER_SIGNAL",
  "severity": "Medium",
  "priority": "P2",
  "confidence": "LOW",
  "platform": "ios",
  "device": "mobile",
  "viewport": "n/a",
  "location": "scr_1 (uploaded screenshot), plan cards",
  "component": "plan selector",
  "observed": "2 of 3 simulated personas described the plan cards as informational and expected 'Get started' to proceed without a plan choice.",
  "expected": "Personas identify the plan cards as a required choice before continuing.",
  "impact": "Users may proceed without choosing a plan and be surprised by a default selection.",
  "evidence": [
    {"type": "persona_vote", "ref": "prs_1", "value": {"expected_action": "Tap 'Get started'", "region": {"x": 0.10, "y": 0.86, "w": 0.80, "h": 0.07}}, "captured_at": "2026-09-02T00:00:30Z", "method": "simulated", "note": "first_time_user, primary_action"},
    {"type": "persona_vote", "ref": "prs_3", "value": {"expected_action": "Tap 'Get started'", "region": {"x": 0.10, "y": 0.86, "w": 0.80, "h": 0.07}}, "captured_at": "2026-09-02T00:00:31Z", "method": "simulated", "note": "low_digital_literacy, comprehension"}
  ],
  "rules": [],
  "heuristics": [],
  "persona_signals": [
    {"persona_id": "first_time_user", "test": "primary_action", "observation": "The plan cards look like feature highlights.", "expected_action": "Tap 'Get started'", "predicted_outcome": "An account creation form", "confidence": "MEDIUM", "simulated": true},
    {"persona_id": "low_digital_literacy", "test": "comprehension", "observation": "Unsure whether tapping a card does anything.", "expected_action": "Tap 'Get started'", "predicted_outcome": "Not sure", "confidence": "LOW", "simulated": true}
  ],
  "recommendation": "Make the plan cards read as a selectable group: a visible selected state, single-choice semantics, and a caption such as 'Choose a plan'.",
  "retest": {"steps": ["Re-run the primary_action and comprehension tests with the same three presets on the revised screen."], "expected_result": "At least 2 of 3 simulated personas identify the plan cards as a choice.", "layer": "synthetic_user_regression"},
  "limitations": "Simulated persona behavior from a static screenshot; not human participant research."
}
```

Optional field for retest comparison (W5): a finding MAY carry `fingerprint`, a stable cross-run identity the core computes (W-OD-11), so the same issue lines up across runs. When present, the web layer keys retest comparison (fixed / unresolved / new / regressed) on it; when absent, it falls back to a provisional key over `finding_type`, rule ids, heuristics, `component`, and `location`, and labels the comparison "provisional". The fixtures set `fingerprint` so the comparison is demonstrable; a real core owns the real fingerprint. `fingerprint` is not one of the root PRD §12 fields and is ignored by consumers that do not compare runs.

Notes that follow from the schema:

- `confidence` is HIGH, MEDIUM, or LOW; screenshot-only evidence is LOW and USER_SIGNAL is never above MEDIUM (`docs/finding-schema.md` §6). A LOW-confidence VIOLATION is phrased as suspected and its check result is PARTIAL.
- `evidence` items are embedded, with `type` from the §7 list (screenshot, dom_locator, accessibility_node, role_name_state, computed_style, bounding_box, color_value, contrast_ratio, keyboard_trace, focus_trace, network_timing, performance_metric, console_error, interaction_trace, persona_vote, task_failure, reviewer_observation) and `method` one of automated, visual, manual, simulated. The UI presents `method` as measured (automated), inferred (visual, manual), or simulated.
- **Region convention (provisional):** when an evidence item refers to a screen, `value.region` may hold `{x, y, w, h}` normalized to 0..1 of that screen's width and height. Markers are drawn from these regions; findings without any region are listed without a marker. A dedicated `region` field on evidence items is requested from the core (§9); until then the convention lives inside `value`, which the schema leaves free-form.
- `rules` items are `{id, result}`; display metadata comes from `rules_index`.
- `retest` is `{steps, expected_result, layer}`; `automation_candidate` is `{assertion, tool_hint}`; `limitations` is a string.
- `flow`, `component`, `code_guidance`, `automation_candidate` are optional and omitted when absent.

### 4.7 Evidence item

Exactly `docs/finding-schema.md` §7: `type`, `ref`, `value`, `captured_at`, `method`, `artifact`, `note`. See the region convention in §4.6. `method: simulated` is valid only for `persona_vote` and `task_failure`.

### 4.8 PersonaRun (provisional container; signals per `docs/finding-schema.md` §8)

```json
{
  "persona_run_id": "prs_1",
  "persona": {"persona_id": "first_time_user", "label": "First-time user", "dimensions": {"product_familiarity": "first_time", "experience": "experienced", "digital_literacy": "high", "reading_behavior": "skimming", "attention": "focused", "device_and_grip": "mobile_two_hand", "goal_orientation": "exploratory", "urgency": "low", "accessibility_needs": []}},
  "screen_id": "scr_1",
  "signals": [
    {"persona_id": "first_time_user", "test": "first_impression", "observation": "A sign-up screen for a budgeting app; the green button stands out.", "expected_action": "Tap 'Get started'", "predicted_outcome": "An account creation form", "confidence": "MEDIUM", "simulated": true},
    {"persona_id": "first_time_user", "test": "primary_action", "observation": "The plan cards look like feature highlights.", "expected_action": "Tap 'Get started'", "predicted_outcome": "An account creation form", "confidence": "MEDIUM", "simulated": true,
     "evidence": [{"type": "persona_vote", "ref": "scr_1", "value": {"region": {"x": 0.10, "y": 0.86, "w": 0.80, "h": 0.07}}, "captured_at": "2026-09-02T00:00:30Z", "method": "simulated"}]},
    {"persona_id": "first_time_user", "test": "comprehension", "observation": "Unclear whether 'Get started' commits to a paid plan.", "expected_action": "Look for a free option", "predicted_outcome": "Not sure", "confidence": "LOW", "simulated": true},
    {"persona_id": "first_time_user", "test": "abandonment", "observation": "Would continue but hesitate at the plan step.", "expected_action": "Continue", "predicted_outcome": "Reach the form", "confidence": "MEDIUM", "simulated": true}
  ],
  "outcome": {"decision": "HESITATE", "confidence": "MEDIUM"},
  "not_simulated": null,
  "simulated": true
}
```

- A persona run is the container for one persona's signals on one screen (or one flow, W2). Each signal is a `docs/finding-schema.md` §8 item plus an optional embedded `evidence` list (for the region a persona would act on).
- `outcome.decision` (CONTINUE, HESITATE, ABANDON) summarizes the abandonment test; the fixed answer shape of each test is a Phase 6 deliverable, so this is provisional.
- `not_simulated`, when the core cannot honestly simulate a persona for the input: `{"reason": "screen reader behavior cannot be simulated from a screenshot"}` with `signals` empty.
- Personas receive the perception snapshot (`docs/architecture.md` §2.2), never raw DOM or hidden text; the web layer has no influence on that.

### 4.9 PersonaSummary (provisional container; counts per `docs/audit-methodology.md` §4)

```json
{
  "personas_tested": 3,
  "tests": [
    {"test": "primary_action", "majority_answer": "Tap 'Get started'", "agree": 2, "dissent": [{"persona_id": "skimmer", "answer": "Tap the logo"}]},
    {"test": "abandonment", "majority_answer": "HESITATE", "agree": 2, "dissent": [{"persona_id": "low_digital_literacy", "answer": "ABANDON"}]}
  ],
  "personas_confused": 2,
  "task_failures": 0,
  "derived_findings": ["F-20260902-003"],
  "disclaimer": "Results are simulated persona behavior, not human participant research."
}
```

Counts only: no percentages, no averaged confidence. Disagreement is reported, not smoothed.

### 4.10 Coverage (provisional container; results per `docs/finding-schema.md` §2)

```json
{
  "applicable_rule_count": 14,
  "rule_results": [
    {"id": "WCAG-1.4.3", "result": "PARTIAL", "method": "visual", "finding_ids": ["F-20260902-001"], "note": "Some text verified; rendered size unknown"},
    {"id": "WCAG-2.5.8", "result": "PARTIAL", "method": "visual", "finding_ids": [], "note": "Target size estimated; scale unknown"},
    {"id": "WCAG-2.1.1", "result": "NOT_TESTED", "reason": "input cannot establish keyboard operability"}
  ],
  "not_tested_families": [
    {"family": "semantics", "reason": "input cannot establish semantics"},
    {"family": "keyboard_operability", "reason": "input cannot establish keyboard operability"},
    {"family": "focus_order_visibility", "reason": "input cannot establish focus order and visibility"}
  ],
  "rule_sets": [{"id": "WCAG-2.2", "version": "2.2", "scope": "visually decidable rules only"}]
}
```

Every applicable rule appears once with PASS, FAIL, PARTIAL, NOT_TESTED, or NOT_APPLICABLE and, for the last two, a reason; NOT_TESTED rules are never dropped.

---

## 5. Fixture seed

The fragments in §4.5 to §4.10 compose into one Quick Review envelope. W1 extracts them into a fixtures directory (location per W-OD-03; the core stream lists it in the `docs/architecture.md` §6 layout table as externally owned, ADR 0006) and keeps them valid against `docs/finding-schema.md` and, once published, the core's JSON output schema (GAP-019). A second fixture holds a screenshot whose visible text attempts prompt injection ([web-product-prd.md](web-product-prd.md) W1-AC-10) with an envelope showing normal output and the injected text recorded as an observation.

---

## 6. Versioning and compatibility

- `contract_version` follows semantic versioning once the core publishes it; until then it is `0.1-provisional`.
- The finding shape is versioned by `docs/finding-schema.md` (`finding_schema_version`); the web layer never renames or reinterprets its fields.
- Additive changes (new optional fields, new values in extensible enumerations such as `input_kinds`) are minor; renamed or removed required fields are major.
- The web layer ignores unknown fields, treats missing optional fields as absent, and rejects envelopes whose major version it does not support with `unsupported_capability`.
- Every envelope carries `versions` so stored results remain interpretable after upgrades.

---

## 7. Errors

| Code | Meaning | Client behavior |
|---|---|---|
| invalid_input | file or request failed validation | show the specific message; nothing stored |
| unsupported_capability | analysis type, input kind, or persona not offered by the core | disable the option; explain |
| core_unavailable | adapter could not reach or start the core | retry later; audit FAILED |
| timeout | budget exceeded without usable output | audit FAILED or COMPLETED-partial per [architecture.md](architecture.md) §5.5 |
| cancelled | user cancelled | show partial output labeled CANCELLED |
| internal | unexpected | generic message; trace id for support |

Errors never include audited content, prompts, or provider responses.

---

## 8. Fixture adapter (required in W1)

A binding of the adapter that returns canned events and envelopes from fixture files, with configurable delays per stage to exercise progressive delivery, cancellation, timeouts, and failures. It lets the web layer be built and tested before the core is runnable and doubles as the contract test: fixtures and live core output are both validated against `docs/finding-schema.md` in CI.

---

## 9. Requests to the core stream

Confirmed by published documents (2026-09-02): finding fields and enumerations (`docs/finding-schema.md` §3–§6), evidence item shape and `method` (§7), persona signal shape and simulation labeling (§8), check results (§2), mode names and evidence capability matrix (`docs/audit-methodology.md` §1–§2), persona dimensions (`docs/architecture.md` §3), untrusted-content policy (`CLAUDE.md`, `docs/audit-methodology.md` §6).

Still requested, in priority order (the core stream reviews these against its Phase 3 report and JSON output schema per GAP-025; W1 kickoff may raise items 1, 2, and 8 earlier):

1. A `region` field on evidence items (normalized `{x, y, w, h}` per screen), or explicit blessing of the `value.region` convention in §4.6. Related to GAP-017 (screenshot annotation method).
2. A capability descriptor (§4.1) so the UI never hard-codes analysis types, presets, or tests.
3. A result envelope or JSON output schema (GAP-019) that carries findings plus summary, persona runs, persona summary, coverage, limitations, and versions; §4.5 is offered as a starting point.
4. Rule display metadata resolution (`rules_index` in §4.5) so consumers never import the registry.
5. Progressive events by stage (§4.4), cancellation, and a per-request budget; a single `completed` event is an acceptable first step.
6. The persona run container and per-test answer shapes (§4.8) when Phase 6 defines them, including `not_simulated`.
7. A stable issue identity across runs (needed only from W5).
8. A runnable entry point (in-process, CLI, or HTTP) and the language decision that determines the binding (W-OD-02, W-OD-04). The subprocess CLI protocol is now defined executably by `web/adapter/reference-core-cli.mjs`; a real core can satisfy this request by implementing that protocol in any language, and the conformance harness (`web/test/conformance.test.mjs`, W1-AC-15) will check it.
9. A shared prompt-injection fixture set.
