// Fixture binding of the Audit Core adapter (docs/web-product/audit-core-contract.md sections 3.2 and 8).
// Returns canned envelopes from web/fixtures with per-stage delays so the web layer can exercise progressive
// delivery, cancellation, and failure before the core is runnable. It contains no auditing intelligence:
// no prompts, no rules, no persona reasoning. The real binding (in-process, subprocess CLI, or HTTP) replaces
// this module behind the same three functions.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";

const FIXTURES_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures");

// Provisional capability descriptor (contract section 4.1). Persona dimensions follow docs/architecture.md section 3;
// preset labels follow prd.md section 6.2. Values are provisional until the Phase 6 persona schema.
const DIMENSIONS = {
  product_familiarity: ["first_time", "returning"],
  experience: ["novice", "experienced"],
  digital_literacy: ["low", "high"],
  reading_behavior: ["skimming", "deliberate"],
  attention: ["distracted", "focused"],
  device_and_grip: ["desktop_pointer", "mobile_two_hand", "mobile_one_hand", "tablet", "keyboard_only"],
  goal_orientation: ["exploratory", "efficiency"],
  urgency: ["low", "high"],
  accessibility_needs: ["screen_reader", "low_vision", "limited_fine_motor", "color_vision_deficiency"],
};

const preset = (persona_id, label, d) => ({
  persona_id,
  label,
  dimensions: {
    product_familiarity: "first_time", experience: "experienced", digital_literacy: "high", reading_behavior: "skimming",
    attention: "focused", device_and_grip: "mobile_two_hand", goal_orientation: "exploratory", urgency: "low", accessibility_needs: [], ...d,
  },
});

export const CAPABILITIES = Object.freeze({
  contract_version: "0.1-provisional",
  core_version: "fixture",
  corpus_version: "none",
  finding_schema_version: "0.1",
  input_kinds: ["SCREENSHOT", "SCREENSHOT_SET"],
  analysis_types: ["QUICK_REVIEW", "USER_TEST", "ACCESSIBILITY_CHECK"],
  modes: ["SCREENSHOT_REVIEW", "MULTI_SCREEN_REVIEW", "SYNTHETIC_USER_TEST", "STANDARDS_AUDIT"],
  platforms: ["web", "pwa", "ios", "android", "desktop"],
  persona_presets: [
    preset("average_user", "Average user", {}),
    preset("first_time_user", "First-time user", {}),
    preset("returning_user", "Returning user", { product_familiarity: "returning" }),
    preset("skimmer", "Skimmer", { attention: "distracted", goal_orientation: "efficiency", urgency: "high", device_and_grip: "mobile_one_hand" }),
    preset("novice", "Novice", { experience: "novice", reading_behavior: "deliberate" }),
    preset("low_digital_literacy", "Low digital literacy", { experience: "novice", digital_literacy: "low", reading_behavior: "deliberate" }),
    preset("power_user", "Power user", { product_familiarity: "returning", goal_orientation: "efficiency", device_and_grip: "keyboard_only" }),
    preset("distracted_user", "Distracted user", { attention: "distracted" }),
    preset("mobile_one_hand_user", "Mobile one-hand user", { device_and_grip: "mobile_one_hand" }),
  ],
  persona_dimensions: DIMENSIONS,
  synthetic_tests: ["first_impression", "primary_action", "click_expectation", "outcome_prediction", "comprehension", "recall", "confidence", "abandonment"],
  defaults: { persona_ids: ["first_time_user", "skimmer", "low_digital_literacy"] },
  limits: { max_screens: 8, max_personas: 5, max_question_chars: 500 },
  streaming: true,
});

export function loadFixture(name) {
  const safe = String(name).replace(/[^a-z0-9-]/gi, "");
  return readFileSync(join(FIXTURES_DIR, `${safe}.example.json`), "utf8");
}

// Which fixture to serve for a request: multi-screen requests get the flow fixture; a single-screen retest gets
// the "fixed" variant (so a retest shows a real delta against its baseline); otherwise the configured fixture.
export function fixtureForRequest(request, configured = "quick-review") {
  if (request?.target?.kind === "SCREENSHOT_SET") return "flow-review";
  if (request?.links?.retest_of && (configured === "quick-review" || configured === "quick-review-fixed")) return "quick-review-fixed";
  return configured;
}

// Bind the fixture to the request: map each fixture screen (scr_<i>, art_<i>) to the real uploaded screen and
// artifact by order, then set the request's audit id, intent, and target. Works for one screen or many.
export function bindFixture(text, request) {
  const reqScreens = request.target?.screens ?? [];
  const fixScreens = (JSON.parse(text).target?.screens ?? []).map((s) => s.screen_id); // e.g. ["scr_1","scr_2"]

  // Map each fixture token (screen id and its art_<i> pair) to the real uploaded id. Replace them all in ONE pass
  // so an inserted real id (random base64url, which can itself contain "scr_2") is never re-scanned and corrupted.
  // Overflow fixture screens map to the last real screen; extra real screens carry no findings.
  const map = new Map();
  fixScreens.forEach((fid, i) => {
    const target = reqScreens[Math.min(i, reqScreens.length - 1)];
    if (!target) return;
    const faid = fid.replace(/^scr_/, "art_");
    map.set(fid, target.screen_id);
    map.set(faid, target.artifact?.artifact_id ?? faid);
  });
  let bound = text;
  if (map.size) {
    const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const tokens = [...map.keys()].sort((a, b) => b.length - a.length).map(escape); // longest first, so scr_10 beats scr_1
    bound = text.replace(new RegExp(tokens.join("|"), "g"), (m) => map.get(m));
  }

  const env = JSON.parse(bound);
  env.audit_id = request.audit_id;
  if (env.plan) env.plan.audit_id = request.audit_id;
  env.analysis_type = request.analysis_type ?? env.analysis_type;
  env.intent = { question: request.intent?.question ?? null, task: request.intent?.task ?? null };
  if (reqScreens.length) {
    env.target = {
      kind: request.target.kind ?? env.target?.kind ?? "SCREENSHOT",
      screens: reqScreens.map((s, i) => {
        const fx = env.target?.screens?.[Math.min(i, (env.target?.screens?.length ?? 1) - 1)];
        return { screen_id: s.screen_id, width: s.artifact?.width ?? null, height: s.artifact?.height ?? null, device: fx?.device ?? null, platform: fx?.platform ?? null };
      }),
    };
  }
  if (env.intent.question && env.summary && !env.summary.answer_to_question) {
    // The fixture cannot answer arbitrary questions; say so instead of inventing an answer.
    env.summary.answer_to_question = "Fixture core: the question was recorded but not answered. A live core answers it from the persona and visual results.";
  }
  reconcilePersonas(env, request.options?.personas?.persona_ids);
  return env;
}

// Shape the fixture's persona output to the personas the request actually selected (W3). The fixture core only
// authored a few example personas: it keeps the selected ones it can simulate, marks the rest not_simulated
// (the honest path in web-product-prd.md §12.5), recomputes the agreement counts, and drops USER_SIGNAL findings
// left with no simulated persona behind them. A live persona engine simulates any selected persona instead.
export function reconcilePersonas(env, personaIds) {
  if (!Array.isArray(personaIds) || personaIds.length === 0) return env; // no selection: serve as authored (defaults)
  const authored = new Map((env.persona_runs ?? []).map((r) => [r.persona.persona_id, r]));
  const firstScreen = env.target?.screens?.[0]?.screen_id ?? null;
  env.persona_runs = personaIds.map((id) => {
    if (authored.has(id)) return authored.get(id);
    const preset = CAPABILITIES.persona_presets.find((p) => p.persona_id === id);
    return {
      persona_run_id: `prs_ns_${id}`,
      persona: { persona_id: id, label: preset?.label ?? id, dimensions: preset?.dimensions ?? {} },
      screen_id: firstScreen,
      signals: [],
      outcome: null,
      not_simulated: { reason: "The fixture core simulates only its example personas; a live persona engine simulates any selected persona." },
      simulated: true,
    };
  });

  const keptSim = new Set(env.persona_runs.filter((r) => !r.not_simulated).map((r) => r.persona.persona_id));

  // Drop USER_SIGNAL findings whose personas were not simulated in this run; keep the id set consistent.
  const dropped = new Set();
  env.findings = (env.findings ?? []).filter((f) => {
    if (f.finding_type !== "USER_SIGNAL") return true;
    const supported = (f.persona_signals ?? []).some((s) => keptSim.has(s.persona_id));
    if (!supported) dropped.add(f.issue_id);
    return supported;
  });
  if (env.summary) {
    if (Array.isArray(env.summary.top_concerns)) env.summary.top_concerns = env.summary.top_concerns.filter((id) => !dropped.has(id));
  }

  const ps = env.persona_summary;
  if (ps) {
    ps.personas_tested = keptSim.size;
    ps.personas_confused = Math.min(ps.personas_confused ?? 0, keptSim.size);
    ps.tests = (ps.tests ?? []).map((t) => {
      const dissent = (t.dissent ?? []).filter((d) => keptSim.has(d.persona_id));
      return { ...t, dissent, agree: Math.max(0, keptSim.size - dissent.length) };
    });
    if (Array.isArray(ps.derived_findings)) ps.derived_findings = ps.derived_findings.filter((id) => !dropped.has(id));
  }
  return env;
}

export class AbortError extends Error {
  constructor() { super("audit cancelled"); this.name = "AbortError"; this.code = "cancelled"; }
}

// The staging schedule shared by the in-process fixture adapter and the reference core CLI, so both emit
// the byte-identical event stream and envelope. It is the executable specification of the delivery order in
// docs/web-product/architecture.md section 5.2. `emit` may be sync or async; callers serialize if needed.
export async function streamEnvelope(env, emit, { stageDelayMs = 0, failAtStage = null, signal } = {}) {
  const at = (event) => emit({ audit_id: env.audit_id, ts: new Date().toISOString(), ...event });
  const pause = async () => {
    if (signal?.aborted) throw new AbortError();
    if (stageDelayMs > 0) await sleep(stageDelayMs, undefined, { signal }).catch(() => { throw new AbortError(); });
    if (signal?.aborted) throw new AbortError();
  };
  const byType = (t) => env.findings.filter((f) => f.finding_type === t);
  const stage = async (name, body) => {
    await at({ event: "stage_started", stage: name });
    if (failAtStage === name) {
      await at({ event: "stage_completed", stage: name, state: "FAILED", error: { code: "internal", message: "fixture failure" } });
      await at({ event: "failed", error: { code: "internal", message: "fixture failure", retryable: false } });
      const err = new Error("fixture failure"); err.code = "internal"; throw err;
    }
    await pause();
    for (const e of body()) await at(e);
    await at({ event: "stage_completed", stage: name, state: "DONE", error: null });
  };

  await stage("intake", () => [{ event: "plan", plan: env.plan }]);
  await stage("visual", () => [{ event: "summary", summary: env.summary }, ...byType("UX_RISK").map((f) => ({ event: "finding", finding: f }))]);
  await stage("personas", () => [
    ...env.persona_runs.map((r) => ({ event: "persona_run", persona_run: r })),
    { event: "persona_summary", persona_summary: env.persona_summary },
    ...byType("USER_SIGNAL").map((f) => ({ event: "finding", finding: f })),
  ]);
  await stage("standards", () => [...byType("VIOLATION").map((f) => ({ event: "finding", finding: f })), { event: "coverage", coverage: env.coverage }]);
  await stage("report", () => env.limitations.map((l) => ({ event: "limitation", limitation: l })));
  await at({ event: "completed", result: env });
  return env;
}

/**
 * In-process fixture binding of the Audit Core adapter.
 * @param {object} [opts]
 * @param {string} [opts.fixture="quick-review"] fixture name (quick-review | injection)
 * @param {number} [opts.stageDelayMs=0] delay per stage to simulate work
 * @param {string|null} [opts.failAtStage=null] stage name at which the fixture core fails (tests)
 */
export function createFixtureAdapter({ fixture = "quick-review", stageDelayMs = 0, failAtStage = null } = {}) {
  const load = (request) => loadFixture(fixtureForRequest(request, fixture)); // multi-screen requests auto-select the flow fixture
  return {
    describe: () => structuredClone(CAPABILITIES),
    plan: (request) => bindFixture(load(request), request).plan,
    run: (request, sink, signal) => streamEnvelope(bindFixture(load(request), request), sink, { stageDelayMs, failAtStage, signal }),
  };
}
