import { test } from "node:test";
import assert from "node:assert/strict";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createSubprocessAdapter } from "../adapter/subprocess-adapter.mjs";
import { validateEnvelope } from "../shared/validate-finding.mjs";

const CLI = resolve(dirname(fileURLToPath(import.meta.url)), "..", "adapter", "reference-core-cli.mjs");
const makeAdapter = (extra = []) => createSubprocessAdapter({ command: process.execPath, args: [CLI, ...extra] });
const request = (over = {}) => ({
  contract_version: "0.1-provisional", audit_id: "aud_subprocess", run_id: "sub-1", analysis_type: "QUICK_REVIEW",
  target: { kind: "SCREENSHOT", screens: [{ screen_id: "scr_x", artifact: { artifact_id: "art_x", uri: "store://aud_subprocess/art_x.png", media_type: "image/png", width: 390, height: 560 }, order: 1, label: null }], device_hint: "mobile" },
  intent: { question: null, task: null }, options: { personas: { persona_ids: ["first_time_user"], custom: [] }, seed: 1 }, ...over,
});

test("describe() over the subprocess returns the capability descriptor", () => {
  const caps = makeAdapter().describe();
  assert.ok(caps.analysis_types.includes("QUICK_REVIEW"));
  assert.ok(caps.persona_presets.length >= 3);
  assert.equal(caps.streaming, true);
});

test("run() streams the protocol events and returns a valid envelope", async () => {
  const events = [];
  const env = await makeAdapter().run(request(), (e) => events.push(e));
  const kinds = events.map((e) => e.event);
  assert.ok(kinds.includes("plan") && kinds.includes("summary") && kinds.includes("finding") && kinds.includes("completed"));
  assert.equal(kinds[kinds.length - 1], "completed", "completed is the final event");
  assert.equal(env.audit_id, "aud_subprocess");
  assert.equal(env.target.screens[0].screen_id, "scr_x");
  const { findings, ...rest } = env;
  assert.deepEqual(validateEnvelope({ ...rest, findings }), []);
});

test("run() propagates a core failure as a rejection with the reported code", async () => {
  await assert.rejects(makeAdapter(["--fail-at-stage", "standards"]).run(request(), () => {}), (e) => e.code === "internal");
});

test("run() cancels promptly when the signal aborts, killing the child", async () => {
  const controller = new AbortController();
  const p = makeAdapter(["--stage-delay-ms", "400"]).run(request(), () => {}, controller.signal);
  setTimeout(() => controller.abort("cancelled"), 150);
  await assert.rejects(p, (e) => e.code === "cancelled");
});

test("run() rejects immediately if the signal is already aborted", async () => {
  const controller = new AbortController();
  controller.abort("cancelled");
  await assert.rejects(makeAdapter().run(request(), () => {}, controller.signal), (e) => e.code === "cancelled");
});
