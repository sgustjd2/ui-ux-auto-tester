// W1-AC-15: the same audit request executed through the core's own entry point (the reference CLI over the
// subprocess transport) and through the in-process path produces the same finding set for the same versions.
// Both bindings share the fixture staging logic, so this proves the subprocess transport carries the envelope
// and event stream without loss or reordering. When a real core CLI exists, point WEB_CORE_CMD at it and this
// harness becomes the cross-implementation conformance check.
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createFixtureAdapter } from "../adapter/fixture-adapter.mjs";
import { createSubprocessAdapter } from "../adapter/subprocess-adapter.mjs";

const CLI = resolve(dirname(fileURLToPath(import.meta.url)), "..", "adapter", "reference-core-cli.mjs");

const request = (fixture) => ({
  contract_version: "0.1-provisional", audit_id: "aud_conformance", run_id: "conf-1", analysis_type: "QUICK_REVIEW",
  target: { kind: "SCREENSHOT", screens: [{ screen_id: "scr_real", artifact: { artifact_id: "art_real", uri: "store://aud_conformance/art_real.png", media_type: "image/png", width: 390, height: 560 }, order: 1, label: null }], device_hint: "mobile" },
  intent: { question: "Where would a first-time user click?", task: null }, options: { personas: { persona_ids: ["first_time_user", "skimmer", "low_digital_literacy"], custom: [] }, seed: 7 },
  _fixture: fixture,
});

async function collect(adapter, req) {
  const events = [];
  const envelope = await adapter.run(req, (e) => events.push(e));
  return { events, envelope };
}
const kindsOf = (events) => events.map((e) => e.event);

for (const fixture of ["quick-review", "injection"]) {
  test(`in-process and subprocess transports agree for the ${fixture} fixture`, async () => {
    const req = request(fixture);
    const inproc = await collect(createFixtureAdapter({ fixture }), req);
    const sub = await collect(createSubprocessAdapter({ command: process.execPath, args: [CLI, "--fixture", fixture] }), req);

    // Identical envelope: same findings, summary, personas, coverage, versions — the whole result.
    assert.deepEqual(sub.envelope, inproc.envelope, "envelopes must be identical across transports");

    // Identical finding set specifically (the acceptance criterion's wording).
    const digest = (env) => env.findings.map((f) => ({ id: f.issue_id, type: f.finding_type, severity: f.severity, priority: f.priority, confidence: f.confidence, rules: f.rules }));
    assert.deepEqual(digest(sub.envelope), digest(inproc.envelope));

    // Identical event stream, ignoring per-event timestamps.
    assert.deepEqual(kindsOf(sub.events), kindsOf(inproc.events), "event order must match");
    assert.equal(kindsOf(sub.events).filter((k) => k === "finding").length, inproc.envelope.findings.length);
  });
}

test("a multi-screen (SCREENSHOT_SET) request auto-selects the flow fixture identically across transports", async () => {
  const req = {
    contract_version: "0.1-provisional", audit_id: "aud_flowconf", run_id: "flowconf-1", analysis_type: "QUICK_REVIEW",
    target: { kind: "SCREENSHOT_SET", device_hint: "mobile", screens: ["a", "b", "c"].map((k, i) => ({ screen_id: `scr_${k}`, artifact: { artifact_id: `art_${k}`, uri: `store://aud_flowconf/art_${k}.png`, media_type: "image/png", width: 390, height: 560 }, order: i + 1, label: String(i + 1) })) },
    intent: { question: null, task: "Sign up with email" }, options: { personas: { persona_ids: ["first_time_user", "skimmer", "low_digital_literacy"], custom: [] }, seed: 3 },
  };
  const inproc = await collect(createFixtureAdapter(), req); // default fixture, but kind SCREENSHOT_SET -> flow-review
  const sub = await collect(createSubprocessAdapter({ command: process.execPath, args: [CLI] }), req);
  assert.equal(inproc.envelope.target.kind, "SCREENSHOT_SET");
  assert.equal(inproc.envelope.target.screens.length, 3);
  assert.ok(inproc.envelope.flow?.steps?.length === 3);
  assert.deepEqual(sub.envelope, inproc.envelope, "flow envelopes identical across transports");
});

test("the finding set is stable across repeated subprocess runs of the same request (same versions)", async () => {
  const req = request("quick-review");
  const a = await collect(createSubprocessAdapter({ command: process.execPath, args: [CLI] }), req);
  const b = await collect(createSubprocessAdapter({ command: process.execPath, args: [CLI] }), req);
  assert.deepEqual(a.envelope, b.envelope);
});
