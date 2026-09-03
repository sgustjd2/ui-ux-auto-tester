// Structural validation of findings against docs/finding-schema.md (v0.1) and of the provisional
// result envelope in docs/web-product/audit-core-contract.md section 4.5.
// Standard library only. Returns arrays of problem strings; empty means valid.
// ponytail: hand-rolled checks instead of a JSON Schema library (no dependencies without an ADR).

export const FINDING_TYPES = ["VIOLATION", "UX_RISK", "USER_SIGNAL"];
export const SEVERITIES = ["Critical", "High", "Medium", "Low", "Informational"];
export const PRIORITIES = ["P0", "P1", "P2", "P3"];
export const CONFIDENCES = ["HIGH", "MEDIUM", "LOW"];
export const PLATFORMS = ["web", "pwa", "ios", "android", "desktop"];
export const CHECK_RESULTS = ["PASS", "FAIL", "PARTIAL", "NOT_TESTED", "NOT_APPLICABLE"];
export const EVIDENCE_TYPES = [
  "screenshot", "dom_locator", "accessibility_node", "role_name_state", "computed_style", "bounding_box",
  "color_value", "contrast_ratio", "keyboard_trace", "focus_trace", "network_timing", "performance_metric",
  "console_error", "interaction_trace", "persona_vote", "task_failure", "reviewer_observation",
];
export const EVIDENCE_METHODS = ["automated", "visual", "manual", "simulated"];
export const SIMULATED_ONLY_TYPES = ["persona_vote", "task_failure"];
export const SYNTHETIC_TESTS = [
  "first_impression", "primary_action", "click_expectation", "outcome_prediction", "comprehension", "recall", "confidence", "abandonment",
];
export const RETEST_LAYERS = [
  "unit", "accessibility_automation", "visual_regression", "e2e", "performance", "manual_a11y_qa", "synthetic_user_regression",
];

const isStr = (v) => typeof v === "string" && v.length > 0;
const isList = (v) => Array.isArray(v);

export function validateEvidenceItem(e, where) {
  const p = [];
  if (!e || typeof e !== "object") return [`${where}: evidence item is not an object`];
  if (!EVIDENCE_TYPES.includes(e.type)) p.push(`${where}: unknown evidence type "${e.type}"`);
  if (!isStr(e.ref)) p.push(`${where}: evidence ref missing`);
  if (!isStr(e.captured_at)) p.push(`${where}: evidence captured_at missing`);
  if (!EVIDENCE_METHODS.includes(e.method)) p.push(`${where}: evidence method "${e.method}" invalid`);
  if (e.method === "simulated" && !SIMULATED_ONLY_TYPES.includes(e.type)) {
    p.push(`${where}: method simulated is only valid for ${SIMULATED_ONLY_TYPES.join(", ")}`);
  }
  const r = e.value && e.value.region;
  if (r !== undefined && r !== null) {
    const ok = ["x", "y", "w", "h"].every((k) => typeof r[k] === "number" && r[k] >= 0 && r[k] <= 1);
    if (!ok) p.push(`${where}: region must be {x,y,w,h} normalized to 0..1`);
  }
  return p;
}

export function validatePersonaSignal(s, where) {
  const p = [];
  if (!s || typeof s !== "object") return [`${where}: persona signal is not an object`];
  if (!isStr(s.persona_id)) p.push(`${where}: persona_id missing`);
  if (!SYNTHETIC_TESTS.includes(s.test)) p.push(`${where}: test "${s.test}" invalid`);
  for (const k of ["observation", "expected_action", "predicted_outcome"]) if (!isStr(s[k])) p.push(`${where}: ${k} missing`);
  if (!CONFIDENCES.includes(s.confidence)) p.push(`${where}: confidence "${s.confidence}" invalid`);
  if (s.simulated !== true) p.push(`${where}: simulated must be true`);
  if (s.evidence !== undefined) {
    if (!isList(s.evidence)) p.push(`${where}: evidence must be a list`);
    else s.evidence.forEach((e, i) => p.push(...validateEvidenceItem(e, `${where}.evidence[${i}]`)));
  }
  return p;
}

export function validateFinding(f) {
  const p = [];
  if (!f || typeof f !== "object") return ["finding is not an object"];
  const id = f.issue_id ?? "?";
  const at = `finding ${id}`;
  if (!/^F-.+-\d+$/.test(String(f.issue_id))) p.push(`${at}: issue_id must be F-<run_id>-<seq>`);
  for (const k of ["title", "location", "observed", "expected", "impact", "recommendation", "device", "viewport"]) {
    if (!isStr(f[k])) p.push(`${at}: ${k} missing`);
  }
  if (!FINDING_TYPES.includes(f.finding_type)) p.push(`${at}: finding_type "${f.finding_type}" invalid`);
  if (!SEVERITIES.includes(f.severity)) p.push(`${at}: severity "${f.severity}" invalid`);
  if (!PRIORITIES.includes(f.priority)) p.push(`${at}: priority "${f.priority}" invalid`);
  if (!CONFIDENCES.includes(f.confidence)) p.push(`${at}: confidence "${f.confidence}" invalid`);
  if (!PLATFORMS.includes(f.platform)) p.push(`${at}: platform "${f.platform}" invalid`);

  if (!isList(f.evidence) || f.evidence.length === 0) p.push(`${at}: evidence must be a non-empty list`);
  else f.evidence.forEach((e, i) => p.push(...validateEvidenceItem(e, `${at}.evidence[${i}]`)));

  if (!isList(f.rules)) p.push(`${at}: rules must be a list`);
  else f.rules.forEach((r, i) => {
    if (!r || !isStr(r.id)) p.push(`${at}.rules[${i}]: id missing`);
    if (!r || !CHECK_RESULTS.includes(r.result)) p.push(`${at}.rules[${i}]: result invalid`);
  });
  if (!isList(f.heuristics)) p.push(`${at}: heuristics must be a list`);
  if (!isList(f.persona_signals)) p.push(`${at}: persona_signals must be a list`);
  else f.persona_signals.forEach((s, i) => p.push(...validatePersonaSignal(s, `${at}.persona_signals[${i}]`)));

  if (f.finding_type === "VIOLATION" && (!isList(f.rules) || f.rules.length === 0)) p.push(`${at}: VIOLATION needs at least one rule`);
  if (f.finding_type === "UX_RISK" && (!isList(f.heuristics) || f.heuristics.length === 0)) p.push(`${at}: UX_RISK needs at least one heuristic`);
  if (f.finding_type === "USER_SIGNAL") {
    if (!isList(f.persona_signals) || f.persona_signals.length === 0) p.push(`${at}: USER_SIGNAL needs persona_signals`);
    if (f.confidence === "HIGH") p.push(`${at}: USER_SIGNAL confidence is at most MEDIUM`);
  }
  if (f.finding_type === "VIOLATION" && f.confidence === "LOW" && isList(f.rules)) {
    if (f.rules.some((r) => r.result === "FAIL")) p.push(`${at}: LOW-confidence VIOLATION must report PARTIAL, not FAIL`);
  }

  const rt = f.retest;
  if (!rt || typeof rt !== "object") p.push(`${at}: retest missing`);
  else {
    if (!isList(rt.steps) || rt.steps.length === 0 || !rt.steps.every(isStr)) p.push(`${at}: retest.steps must be a non-empty list of strings`);
    if (!isStr(rt.expected_result)) p.push(`${at}: retest.expected_result missing`);
    if (!RETEST_LAYERS.includes(rt.layer)) p.push(`${at}: retest.layer "${rt.layer}" invalid`);
  }
  if (f.automation_candidate !== undefined && f.automation_candidate !== null) {
    if (!isStr(f.automation_candidate.assertion)) p.push(`${at}: automation_candidate.assertion missing`);
  }
  if (!isStr(f.limitations)) p.push(`${at}: limitations must be a non-empty string`);
  else if (f.limitations.trim().toLowerCase() === "none" && f.confidence !== "HIGH") p.push(`${at}: limitations "none" requires HIGH confidence`);
  return p;
}

export function validateEnvelope(env) {
  const p = [];
  if (!env || typeof env !== "object") return ["envelope is not an object"];
  for (const k of ["contract_version", "audit_id", "analysis_type"]) if (!isStr(env[k])) p.push(`envelope: ${k} missing`);
  if (!isList(env.modes)) p.push("envelope: modes must be a list");
  if (!env.target || typeof env.target !== "object") p.push("envelope: target missing");
  if (!env.summary || typeof env.summary !== "object") p.push("envelope: summary missing");
  if (!isList(env.findings)) p.push("envelope: findings must be a list");
  else {
    const seen = new Set();
    for (const f of env.findings) {
      p.push(...validateFinding(f));
      if (seen.has(f?.issue_id)) p.push(`envelope: duplicate issue_id ${f.issue_id}`);
      seen.add(f?.issue_id);
    }
  }
  if (!isList(env.persona_runs)) p.push("envelope: persona_runs must be a list");
  else env.persona_runs.forEach((run, i) => {
    const at = `persona_runs[${i}]`;
    if (!run || !isStr(run.persona_run_id)) p.push(`${at}: persona_run_id missing`);
    if (!run?.persona || !isStr(run.persona.persona_id)) p.push(`${at}: persona.persona_id missing`);
    if (run?.simulated !== true) p.push(`${at}: simulated must be true`);
    if (!isList(run?.signals)) p.push(`${at}: signals must be a list`);
    else run.signals.forEach((s, j) => p.push(...validatePersonaSignal(s, `${at}.signals[${j}]`)));
  });
  const ps = env.persona_summary;
  if (!ps || typeof ps !== "object") p.push("envelope: persona_summary missing");
  else {
    if (!Number.isInteger(ps.personas_tested)) p.push("persona_summary: personas_tested must be an integer");
    if (!isList(ps.tests)) p.push("persona_summary: tests must be a list");
    else ps.tests.forEach((t, i) => {
      if (!SYNTHETIC_TESTS.includes(t.test)) p.push(`persona_summary.tests[${i}]: test invalid`);
      if (!Number.isInteger(t.agree)) p.push(`persona_summary.tests[${i}]: agree must be an integer count`);
      if ("agreement" in t || "share" in t || "percent" in t) p.push(`persona_summary.tests[${i}]: percentages are not allowed, use counts`);
    });
    if (!isStr(ps.disclaimer)) p.push("persona_summary: disclaimer missing");
  }
  const cov = env.coverage;
  if (!cov || typeof cov !== "object") p.push("envelope: coverage missing");
  else if (!isList(cov.rule_results)) p.push("coverage: rule_results must be a list");
  else cov.rule_results.forEach((r, i) => {
    if (!CHECK_RESULTS.includes(r.result)) p.push(`coverage.rule_results[${i}]: result invalid`);
    if (["NOT_TESTED", "NOT_APPLICABLE"].includes(r.result) && !isStr(r.reason)) p.push(`coverage.rule_results[${i}]: ${r.result} needs a reason`);
  });
  if (!isList(env.limitations)) p.push("envelope: limitations must be a list");
  if (!env.versions || typeof env.versions !== "object") p.push("envelope: versions missing");
  return p;
}
