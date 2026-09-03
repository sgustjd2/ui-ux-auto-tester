import { test } from "node:test";
import assert from "node:assert/strict";
import { compareFindings, findingKey, keysOf } from "../server/compare.mjs";

const f = (fp, over = {}) => ({ fingerprint: fp, finding_type: "UX_RISK", severity: "Medium", priority: "P2", confidence: "LOW", title: fp, rules: [], heuristics: [], ...over });

test("classifies fixed, still-open, and new by fingerprint", () => {
  const base = [f("a"), f("b"), f("c")];
  const cur = [f("b"), f("c"), f("d")];
  const r = compareFindings(base, cur);
  assert.equal(r.matching, "fingerprint");
  assert.deepEqual(r.fixed.map((x) => x.fingerprint), ["a"]);
  assert.deepEqual(r.unresolved.map((x) => x.current.fingerprint), ["b", "c"]);
  assert.deepEqual(r.new.map((x) => x.fingerprint), ["d"]);
  assert.deepEqual(r.regressed, []);
  assert.deepEqual(r.counts, { fixed: 1, unresolved: 2, new: 1, regressed: 0 });
});

test("a finding absent in the baseline but seen in an older run is regressed, not new", () => {
  const base = [f("b")];
  const cur = [f("b"), f("a"), f("z")];
  const r = compareFindings(base, cur, { priorKeys: new Set(["a"]) });
  assert.deepEqual(r.regressed.map((x) => x.fingerprint), ["a"]);
  assert.deepEqual(r.new.map((x) => x.fingerprint), ["z"]);
  assert.equal(r.counts.regressed, 1);
  assert.equal(r.counts.new, 1);
});

test("falls back to a provisional key and flags it when findings have no fingerprint", () => {
  const base = [{ finding_type: "VIOLATION", title: "x", rules: [{ id: "WCAG-1.4.3" }], heuristics: [], component: "price", location: "scr" }];
  const cur = [{ finding_type: "VIOLATION", title: "x (reworded)", rules: [{ id: "WCAG-1.4.3" }], heuristics: [], component: "price", location: "scr" }];
  const r = compareFindings(base, cur);
  assert.equal(r.matching, "provisional");
  assert.equal(r.counts.unresolved, 1, "same rule+component+location matches despite a reworded title");
  assert.equal(r.counts.fixed, 0);
  assert.equal(r.counts.new, 0);
});

test("findingKey prefers the fingerprint and marks the fallback provisional", () => {
  assert.deepEqual(findingKey(f("fp1")), { key: "fp1", provisional: false });
  const k = findingKey({ finding_type: "UX_RISK", rules: [], heuristics: ["NNG-H08"], component: "cta", location: "top" });
  assert.equal(k.provisional, true);
  assert.match(k.key, /UX_RISK\|\|NNG-H08\|cta\|top/);
});

test("keysOf collects the comparison keys of a finding list", () => {
  assert.deepEqual([...keysOf([f("a"), f("b")])], ["a", "b"]);
});

test("empty baseline makes everything new; empty current makes everything fixed", () => {
  assert.equal(compareFindings([], [f("a"), f("b")]).counts.new, 2);
  assert.equal(compareFindings([f("a")], []).counts.fixed, 1);
});
