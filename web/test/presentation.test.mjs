import { test } from "node:test";
import assert from "node:assert/strict";
import { addPresentation, groupOf, regionsOf } from "../server/presentation.mjs";

const base = (over) => ({
  issue_id: "F-t-001", title: "t", finding_type: "UX_RISK", severity: "Medium", priority: "P2", confidence: "LOW",
  evidence: [{ type: "screenshot", ref: "scr", captured_at: "2026-09-02T00:00:00Z", method: "visual", value: { region: { x: 0.1, y: 0.1, w: 0.2, h: 0.2 } } }],
  rules: [], heuristics: ["NNG-H01"], persona_signals: [], ...over,
});

test("grouping is a pure function of priority, severity, and finding type", () => {
  assert.equal(groupOf(base({ priority: "P0", severity: "Low" })), "BLOCKER");
  assert.equal(groupOf(base({ priority: "P3", severity: "Critical" })), "BLOCKER");
  assert.equal(groupOf(base({ finding_type: "USER_SIGNAL", priority: "P2", severity: "Medium" })), "CONFUSION");
  assert.equal(groupOf(base({ finding_type: "USER_SIGNAL", priority: "P0" })), "BLOCKER");
  assert.equal(groupOf(base({ priority: "P1", severity: "High" })), "IMPROVEMENT");
  assert.equal(groupOf(base({ priority: "P2", severity: "Medium" })), "IMPROVEMENT");
  assert.equal(groupOf(base({ priority: "P3", severity: "Medium" })), "NOTE");
  assert.equal(groupOf(base({ priority: "P1", severity: "Low" })), "NOTE");
  assert.equal(groupOf(base({ priority: "P2", severity: "Informational" })), "NOTE");
});

test("regions come only from evidence items and must be normalized", () => {
  assert.equal(regionsOf(base()).length, 1);
  assert.equal(regionsOf(base({ evidence: [{ type: "screenshot", ref: "s", captured_at: "x", method: "visual", value: { region: { x: 5, y: 0, w: 1, h: 1 } } }] })).length, 0);
  assert.equal(regionsOf(base({ evidence: [{ type: "screenshot", ref: "s", captured_at: "x", method: "visual" }], location: "top right 10,10" })).length, 0);
});

test("presentation orders by group, priority, severity, confidence and numbers markers without touching core fields", () => {
  const input = [
    base({ issue_id: "F-t-001", priority: "P2", severity: "Medium", confidence: "LOW" }),
    base({ issue_id: "F-t-002", finding_type: "USER_SIGNAL", priority: "P2", severity: "Medium", persona_signals: [{ persona_id: "a", test: "recall", observation: "o", expected_action: "e", predicted_outcome: "p", confidence: "LOW", simulated: true }], heuristics: [] }),
    base({ issue_id: "F-t-003", finding_type: "VIOLATION", priority: "P0", severity: "High", rules: [{ id: "WCAG-1.4.3", result: "PARTIAL" }], heuristics: [] }),
    base({ issue_id: "F-t-004", priority: "P3", severity: "Low", evidence: [{ type: "screenshot", ref: "s", captured_at: "x", method: "visual" }] }),
    base({ issue_id: "F-t-005", priority: "P1", severity: "High", confidence: "MEDIUM" }),
  ];
  const snapshot = structuredClone(input);
  const out = addPresentation(input);
  assert.deepEqual(input, snapshot, "input must not be mutated");
  assert.deepEqual(out.map((f) => f.issue_id), ["F-t-003", "F-t-002", "F-t-005", "F-t-001", "F-t-004"]);
  assert.deepEqual(out.map((f) => f.presentation.group), ["BLOCKER", "CONFUSION", "IMPROVEMENT", "IMPROVEMENT", "NOTE"]);
  assert.deepEqual(out.map((f) => f.presentation.marker_number), [1, 2, 3, 4, null]);
  assert.deepEqual(out.map((f) => f.presentation.display_rank), [1, 2, 3, 4, 5]);
  for (const f of out) {
    const { presentation, ...core } = f;
    assert.deepEqual(core, snapshot.find((s) => s.issue_id === f.issue_id), "core fields are stored as produced");
    assert.ok(["BLOCKER", "CONFUSION", "IMPROVEMENT", "NOTE"].includes(presentation.group));
  }
  // idempotent: applying again yields the same result
  assert.deepEqual(addPresentation(out), out);
});
