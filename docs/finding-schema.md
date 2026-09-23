# Finding Schema

Status: v0.1, Phase 0 (2026-09-02). Defines how audit results are represented. Requirements: `prd.md` §3.1, §7.6–§7.9, §11–§13. Decision record: `docs/decisions/0003-finding-types-and-independent-dimensions.md`. Report assembly is specified in `prd.md` §13 and refined in Phase 3.

## 1. Finding types

Exactly one `finding_type` per finding. The types are never merged, renamed, or averaged together.

| Type | Meaning | Required evidence | Must never |
|---|---|---|---|
| VIOLATION | An authoritative requirement is actually violated | At least one entry in `rules` with result FAIL whose registry rule has `rule_class` NORMATIVE, LEGAL, STANDARD, or PLATFORM and `normative_strength` MUST, at least one machine-truth, visual, or manual evidence item showing the failing condition, and confidence MEDIUM or HIGH | Be raised from a heuristic, a persona opinion, a metric threshold, or SHOULD, MAY, or INFORMATIVE guidance alone |
| UX_RISK | An expert judgment that usability is at risk | At least one entry in `heuristics` (HEURISTIC or BEST_PRACTICE rule), or an entry in `rules` that is a METRIC rule, a SHOULD, MAY, or INFORMATIVE guidance rule, or a PARTIAL result on a requirement (suspected violation), plus observable evidence of the condition | Be labeled as a compliance failure or cite a WCAG criterion as if failed |
| USER_SIGNAL | Simulated user behavior indicates confusion, hesitation, wrong action, or abandonment | At least one `persona_signals` entry; every entry has `simulated: true` | Be presented as human participant research or as statistically representative |

A single root issue may have supporting evidence of other kinds. The primary `finding_type` is chosen by the strongest evidence class present (VIOLATION > UX_RISK > USER_SIGNAL), and the other evidence stays visible in its own field. Two root issues are never merged into one finding because they share a location.

METRIC rule breaches (for example a Core Web Vitals threshold) are reported as UX_RISK with `performance_metric` evidence unless a NORMATIVE or LEGAL rule incorporates the threshold. This mapping is an assumption pending confirmation (`research/gaps.md` GAP-001). Treating PLATFORM and STANDARD MUST-level requirements as VIOLATION sources is likewise an assumption pending confirmation (GAP-026).

## 2. Check results

Every applicable rule in an audit yields exactly one check result. Findings are derived from FAIL results (and, for UX_RISK, from heuristic review); the full result set is reported in the compliance matrix.

| Result | Meaning | Required |
|---|---|---|
| PASS | Positive evidence that the rule's condition holds for every examined instance | Evidence reference and the method used (automated, visual, manual) |
| FAIL | Evidence that at least one instance violates the rule | Evidence reference; produces a finding |
| PARTIAL | Some instances or aspects were verified and others could not be | Statement of what was and was not verified |
| NOT_TESTED | The rule applies, but it was not evaluated | Reason: input type, missing tooling, missing access, time, or user exclusion |
| NOT_APPLICABLE | The rule's precondition is absent in the target | Reason naming the absent precondition |

Rules:

- Absence of detected failures is not PASS. Automated tools report PASS only for the aspects they fully cover; the remainder is PARTIAL or NOT_TESTED.
- NOT_TESTED is never silently dropped; the report lists every NOT_TESTED rule with its reason.
- NOT_APPLICABLE is decided from evidence about the target, not from convenience.
- A result may be downgraded (PASS → PARTIAL) when later evidence limits it; it is never upgraded without new evidence.

## 3. Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `issue_id` | string | yes | `F-<run_id>-<seq>` (for example `F-20260902-001`), unique within a report |
| `title` | string | yes | Observable problem in one line |
| `finding_type` | enum | yes | VIOLATION, UX_RISK, USER_SIGNAL |
| `severity` | enum | yes | Critical, High, Medium, Low, Informational (§4) |
| `priority` | enum | yes | P0, P1, P2, P3 (§5) |
| `confidence` | enum | yes | HIGH, MEDIUM, LOW (§6) |
| `platform` | enum | yes | web, pwa, ios, android, desktop |
| `device` | string | yes | Device class or model used (for example `mobile`, `tablet`, `desktop`, `iPhone 15`) |
| `viewport` | string | yes | Width×height in CSS pixels, or `n/a` for non-runtime inputs |
| `location` | string | yes | URL, route, screen name, or screenshot reference |
| `component` | string | no | Component or element identifier (selector, accessibility name, design layer) |
| `flow` | string | no | Flow name and step when found during a flow test |
| `observed` | string | yes | What was observed, factual, no judgment |
| `expected` | string | yes | What the rule, principle, or task requires instead |
| `impact` | string | yes | Who is affected and how; which task is blocked or degraded |
| `evidence` | list | yes | Evidence items (§7); at least one |
| `rules` | list | yes | Registry rules of class NORMATIVE, LEGAL, STANDARD, PLATFORM, or METRIC evaluated as checks, each `{ id, result }`; non-empty for VIOLATION, may be empty otherwise |
| `heuristics` | list | yes | Registry rules of class HEURISTIC or BEST_PRACTICE cited as support, each `{ id }` without a check result; non-empty for UX_RISK unless `rules` carries the supporting METRIC, guidance, or PARTIAL entry; may be empty otherwise |
| `persona_signals` | list | yes | Persona signal items (§8); may be empty for VIOLATION and UX_RISK |
| `recommendation` | string | yes | Concrete fix, following the fix order in `prd.md` §7.8 |
| `code_guidance` | string | no | Implementation-level guidance when source is available |
| `retest` | object | yes | `steps` (manual), `expected_result`, `layer` (unit, accessibility_automation, visual_regression, e2e, performance, manual_a11y_qa, synthetic_user_regression) |
| `automation_candidate` | object | no | `assertion` and `tool_hint` when the retest can be automated |
| `limitations` | string | yes | What the evidence cannot establish; `none` is allowed only with HIGH confidence and runtime evidence |

## 4. Severity

Severity measures harm, using the factors in `prd.md` §7.7 (task blocker, accessibility impact, legal impact, frequency, reach, recoverability, data loss, confusion, business-critical flow).

| Level | Guidance |
|---|---|
| Critical | Blocks a core task for a user group, causes data loss, or is a clear legal exposure on a primary flow |
| High | Substantially impairs a task or excludes a user group with a difficult workaround |
| Medium | Degrades the experience; workaround exists; affects a secondary flow or a subset of users |
| Low | Minor friction or inconsistency |
| Informational | Observation with no direct user impact; useful for consistency or future risk |

Start from the rule's `severity_hint`, then adjust for context. Record the adjustment reason in `impact`.

## 5. Priority

Priority is the implementation order and is decided separately from severity, considering effort, dependency, release timing, and business context. P0 Immediate, P1 Next release, P2 Planned, P3 Improvement. A High severity finding may be P2 if it requires a design-system change; a Low severity finding may be P0 if it is a one-line fix on the main flow. Never derive one from the other automatically.

## 6. Confidence

| Level | Meaning |
|---|---|
| HIGH | Direct machine-truth evidence or an unambiguous rule match on runtime data |
| MEDIUM | Visual or manual inference with a plausible alternative explanation, or static-artifact evidence |
| LOW | Inferred from partial evidence, from a screenshot alone, or from simulation only |

USER_SIGNAL findings are at most MEDIUM. A VIOLATION requires MEDIUM or HIGH confidence. When the evidence supports only LOW confidence, the check result is PARTIAL and the finding is a UX_RISK titled as a suspected violation, citing the rule in `rules` with result PARTIAL.

## 7. Evidence items

```yaml
- type: <evidence type>
  ref: <locator: selector, accessibility node path, file path, screenshot id, metric name>
  value: <measured value or observation, optional>
  captured_at: <ISO 8601 timestamp>
  method: automated | visual | manual | simulated
  artifact: <path to stored screenshot, trace, or log, optional>
  note: <short context, optional>
```

Evidence types (from `prd.md` §7.6): screenshot, dom_locator, accessibility_node, role_name_state, computed_style, bounding_box, color_value, contrast_ratio, keyboard_trace, focus_trace, network_timing, performance_metric, console_error, interaction_trace, persona_vote, task_failure, reviewer_observation.

`method: simulated` is valid only for persona_vote and task_failure produced by the synthetic user engine.

## 8. Persona signals

```yaml
- persona_id: <preset or custom persona name>
  test: first_impression | primary_action | click_expectation | outcome_prediction | comprehension | recall | confidence | abandonment
  observation: <what the persona noticed or believed, concise>
  expected_action: <what the persona would do next>
  predicted_outcome: <what the persona expects to happen>
  confidence: HIGH | MEDIUM | LOW
  simulated: true
```

Aggregation is reported as counts, for example `personas_tested: 5`, `personas_confused: 4`, `task_failures: 2`, with the sentence "Results are simulated persona behavior, not human participant research." attached to every USER_SIGNAL section. `simulated` is always `true`; the future report validator (Phase 4) rejects any other value.

## 9. Illustrative finding (not real audit output)

```yaml
issue_id: F-20260902-001
title: Icon-only button has no accessible name
finding_type: VIOLATION
severity: High
priority: P1
confidence: HIGH
platform: web
device: desktop
viewport: 1440x900
location: /checkout
component: button.cart-remove
observed: The remove button renders an SVG icon with no text, aria-label, or title; the accessibility tree exposes name "".
expected: The control exposes a name describing its action.
impact: Screen reader users cannot identify the control; the checkout task is degraded.
evidence:
  - { type: accessibility_node, ref: "button.cart-remove", value: "name: ''", captured_at: "2026-09-02T10:00:00Z", method: automated }
rules:
  - { id: WCAG-4.1.2, result: FAIL }
heuristics: []
persona_signals: []
recommendation: Add a visually hidden text label or aria-label naming the action and the item.
code_guidance: Prefer visible text or a design-system icon-button variant that requires a label prop.
retest: { steps: ["Inspect the accessibility tree name of the control"], expected_result: "Non-empty name describing the action", layer: accessibility_automation }
automation_candidate: { assertion: "getByRole('button', { name: /remove/i }) exists", tool_hint: "axe-core rule button-name or testing-library" }
limitations: none
```

The rule ID above is illustrative; the registry does not exist yet.
