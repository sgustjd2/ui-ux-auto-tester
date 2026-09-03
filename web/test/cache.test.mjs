import { test } from "node:test";
import assert from "node:assert/strict";
import { contentKey, remapEnvelope } from "../server/cache.mjs";

const base = { screenHashes: ["h1"], analysis_type: "QUICK_REVIEW", persona_ids: ["a", "b"], device_hint: "auto", question: null, task: null, retest_of: null, versions: { core_version: "1", corpus_version: "1", finding_schema_version: "0.1", contract_version: "0.1" } };

test("contentKey is stable for the same input and insensitive to persona order", () => {
  assert.equal(contentKey(base), contentKey({ ...base }));
  assert.equal(contentKey(base), contentKey({ ...base, persona_ids: ["b", "a"] }), "persona order does not change the result");
});

test("contentKey changes when any determinant changes", () => {
  const k = contentKey(base);
  assert.notEqual(k, contentKey({ ...base, screenHashes: ["h2"] }), "different image");
  assert.notEqual(k, contentKey({ ...base, analysis_type: "USER_TEST" }));
  assert.notEqual(k, contentKey({ ...base, persona_ids: ["a"] }));
  assert.notEqual(k, contentKey({ ...base, device_hint: "mobile" }));
  assert.notEqual(k, contentKey({ ...base, question: "where?" }));
  assert.notEqual(k, contentKey({ ...base, retest_of: "aud_x" }));
  assert.notEqual(k, contentKey({ ...base, versions: { ...base.versions, core_version: "2" } }), "a core upgrade misses the cache");
});

test("screen order matters (a flow is order-sensitive)", () => {
  assert.notEqual(contentKey({ ...base, screenHashes: ["h1", "h2"] }), contentKey({ ...base, screenHashes: ["h2", "h1"] }));
});

test("remapEnvelope rewrites audit, screen, and artifact ids in one pass", () => {
  const envelope = {
    audit_id: "aud_OLD",
    target: { screens: [{ screen_id: "scr_OLD1" }, { screen_id: "scr_OLD2" }] },
    findings: [
      { issue_id: "f1", location: "scr_OLD1 top", evidence: [{ ref: "scr_OLD1", artifact: "art_OLD1" }] },
      { issue_id: "f2", location: "scr_OLD2 bottom", evidence: [{ ref: "scr_OLD2", artifact: "art_OLD2" }] },
    ],
  };
  const from = { audit_id: "aud_OLD", screens: [{ screen_id: "scr_OLD1", artifact_id: "art_OLD1" }, { screen_id: "scr_OLD2", artifact_id: "art_OLD2" }] };
  const to = { audit_id: "aud_NEW", screens: [{ screen_id: "scr_NEW1", artifact_id: "art_NEW1" }, { screen_id: "scr_NEW2", artifact_id: "art_NEW2" }] };
  const out = remapEnvelope(envelope, from, to);
  assert.equal(out.audit_id, "aud_NEW");
  assert.deepEqual(out.target.screens.map((s) => s.screen_id), ["scr_NEW1", "scr_NEW2"]);
  assert.equal(out.findings[0].evidence[0].ref, "scr_NEW1");
  assert.equal(out.findings[0].evidence[0].artifact, "art_NEW1");
  assert.ok(out.findings[1].location.includes("scr_NEW2"));
  const text = JSON.stringify(out);
  assert.ok(!/OLD/.test(text), "no old ids remain");
});

test("remapEnvelope is safe when a real id contains another id as a substring", () => {
  const envelope = { audit_id: "aud_1", target: { screens: [{ screen_id: "scr_1" }] }, findings: [{ location: "scr_1", evidence: [{ ref: "scr_1" }] }] };
  const from = { audit_id: "aud_1", screens: [{ screen_id: "scr_1", artifact_id: "art_1" }] };
  const to = { audit_id: "aud_1x", screens: [{ screen_id: "scr_1abc", artifact_id: "art_1abc" }] };
  const out = remapEnvelope(envelope, from, to);
  assert.equal(out.audit_id, "aud_1x");
  assert.equal(out.findings[0].evidence[0].ref, "scr_1abc", "no cascade corruption");
});
