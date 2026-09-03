import { test } from "node:test";
import assert from "node:assert/strict";
import { loadFixture, createFixtureAdapter, CAPABILITIES, reconcilePersonas, bindFixture } from "../adapter/fixture-adapter.mjs";
import { validateEnvelope, validateFinding, SYNTHETIC_TESTS } from "../shared/validate-finding.mjs";

const loadEnv = (name) => JSON.parse(loadFixture(name));

for (const name of ["quick-review", "injection", "flow-review"]) {
  test(`fixture ${name} validates against docs/finding-schema.md and the provisional envelope`, () => {
    const env = JSON.parse(loadFixture(name));
    assert.deepEqual(validateEnvelope(env), []);
    for (const f of env.findings) {
      assert.deepEqual(validateFinding(f), []);
      if (f.finding_type === "USER_SIGNAL") assert.notEqual(f.confidence, "HIGH");
      for (const s of f.persona_signals) assert.equal(s.simulated, true);
    }
    for (const run of env.persona_runs) {
      assert.equal(run.simulated, true);
      for (const s of run.signals) { assert.equal(s.simulated, true); assert.ok(SYNTHETIC_TESTS.includes(s.test)); }
    }
    for (const t of env.persona_summary.tests) { assert.ok(Number.isInteger(t.agree)); assert.ok(!("agreement" in t)); }
    assert.equal(env.persona_summary.disclaimer, "Results are simulated persona behavior, not human participant research.");
    // every applicable rule result that is NOT_TESTED carries a reason
    for (const r of env.coverage.rule_results) if (r.result === "NOT_TESTED") assert.ok(r.reason);
  });
}

test("the validator rejects schema violations", () => {
  const env = JSON.parse(loadFixture("quick-review"));
  const f = structuredClone(env.findings[0]);
  f.confidence = 0.7;
  assert.ok(validateFinding(f).some((p) => p.includes("confidence")));
  const g = structuredClone(env.findings[2]);
  g.persona_signals[0].simulated = false;
  assert.ok(validateFinding(g).some((p) => p.includes("simulated must be true")));
  const h = structuredClone(env.findings[0]);
  h.rules = [{ id: "WCAG-1.4.3", result: "FAIL" }];
  assert.ok(validateFinding(h).some((p) => p.includes("PARTIAL, not FAIL")));
  const i = structuredClone(env.findings[1]);
  i.heuristics = [];
  assert.ok(validateFinding(i).some((p) => p.includes("UX_RISK needs")));
});

test("bindFixture maps every screen in one pass even when a real id contains a fixture token", () => {
  // scr_2abc contains the fixture token "scr_2"; art_1xyz contains "art_1". The old sequential replace corrupted these.
  const request = {
    audit_id: "aud_x", analysis_type: "QUICK_REVIEW",
    target: { kind: "SCREENSHOT_SET", screens: [
      { screen_id: "scr_2abc", artifact: { artifact_id: "art_1xyz", width: 1, height: 1 }, order: 1 },
      { screen_id: "scr_def", artifact: { artifact_id: "art_2ghi", width: 1, height: 1 }, order: 2 },
      { screen_id: "scr_jkl", artifact: { artifact_id: "art_3mno", width: 1, height: 1 }, order: 3 },
    ] },
    intent: {}, options: { personas: { persona_ids: ["first_time_user", "skimmer", "low_digital_literacy"] } },
  };
  const env = bindFixture(loadFixture("flow-review"), request);
  assert.deepEqual(env.target.screens.map((s) => s.screen_id), ["scr_2abc", "scr_def", "scr_jkl"]);
  assert.deepEqual(env.flow.steps, ["scr_2abc", "scr_def", "scr_jkl"], "flow steps map cleanly with no cascade");
  const real = new Set(["scr_2abc", "scr_def", "scr_jkl"]);
  for (const f of env.findings) for (const e of f.evidence ?? []) if (typeof e.ref === "string" && e.ref.startsWith("scr_")) assert.ok(real.has(e.ref), `clean evidence ref: ${e.ref}`);
  assert.ok(!JSON.stringify(env).includes('"scr_1"') && !JSON.stringify(env).includes('"scr_2"'), "no leftover fixture tokens");
});

test("reconcilePersonas: selecting a subset keeps those runs and recomputes counts (W3)", () => {
  const env = reconcilePersonas(loadEnv("quick-review"), ["first_time_user"]);
  assert.deepEqual(env.persona_runs.map((r) => r.persona.persona_id), ["first_time_user"]);
  assert.ok(env.persona_runs.every((r) => !r.not_simulated));
  assert.equal(env.persona_summary.personas_tested, 1);
  // the USER_SIGNAL finding is supported by first_time_user, so it stays
  assert.ok(env.findings.some((f) => f.finding_type === "USER_SIGNAL"));
  assert.deepEqual(validateEnvelope(env), []);
});

test("reconcilePersonas: unknown presets come back not_simulated and unsupported USER_SIGNALs are dropped (W3)", () => {
  const env = reconcilePersonas(loadEnv("quick-review"), ["power_user"]);
  assert.equal(env.persona_runs.length, 1);
  assert.equal(env.persona_runs[0].persona.persona_id, "power_user");
  assert.ok(env.persona_runs[0].not_simulated?.reason, "carries a not-simulated reason");
  assert.equal(env.persona_runs[0].signals.length, 0);
  assert.ok(!env.findings.some((f) => f.finding_type === "USER_SIGNAL"), "USER_SIGNAL with no simulated persona is dropped");
  assert.ok(!env.summary.top_concerns.includes("F-fixture-quick-review-003"));
  assert.equal(env.persona_summary.personas_tested, 0);
  assert.deepEqual(validateEnvelope(env), []);
});

test("reconcilePersonas: a mix keeps supported findings and marks only the unknown persona not_simulated", () => {
  const env = reconcilePersonas(loadEnv("quick-review"), ["first_time_user", "power_user"]);
  const byId = Object.fromEntries(env.persona_runs.map((r) => [r.persona.persona_id, r]));
  assert.ok(!byId.first_time_user.not_simulated && byId.power_user.not_simulated);
  assert.equal(env.persona_summary.personas_tested, 1);
  assert.ok(env.findings.some((f) => f.finding_type === "USER_SIGNAL"));
  assert.deepEqual(validateEnvelope(env), []);
});

test("reconcilePersonas: no selection serves the fixture as authored", () => {
  const before = loadEnv("quick-review");
  const after = reconcilePersonas(loadEnv("quick-review"), undefined);
  assert.deepEqual(after.persona_runs.map((r) => r.persona.persona_id), before.persona_runs.map((r) => r.persona.persona_id));
});

test("the capability descriptor advertises presets by behavior and never by demographics", () => {
  const dims = Object.keys(CAPABILITIES.persona_dimensions);
  for (const forbidden of ["age", "gender", "nationality", "ethnicity", "income"]) assert.ok(!dims.includes(forbidden));
  assert.ok(CAPABILITIES.persona_presets.length >= 3);
  for (const p of CAPABILITIES.persona_presets) for (const k of Object.keys(p.dimensions)) assert.ok(dims.includes(k), `unknown dimension ${k}`);
  assert.deepEqual(createFixtureAdapter().describe().defaults.persona_ids, ["first_time_user", "skimmer", "low_digital_literacy"]);
  assert.ok(CAPABILITIES.input_kinds.includes("SCREENSHOT_SET") && CAPABILITIES.limits.max_screens > 1, "multi-screen advertised");
});
