import { test } from "node:test";
import assert from "node:assert/strict";
import * as R from "../ui/render.mjs";
import { loadFixture, reconcilePersonas } from "../adapter/fixture-adapter.mjs";
import { addPresentation } from "../server/presentation.mjs";

const env = JSON.parse(loadFixture("quick-review"));
const result = { ...env, findings: addPresentation(env.findings) };

test("every persona element is labeled as a simulated persona and carries the disclaimer", () => {
  const html = R.renderPersonas(result);
  const cards = (html.match(/class="card persona"/g) ?? []).length;
  assert.equal(cards, result.persona_runs.length);
  assert.equal((html.match(new RegExp(R.SIMULATED_LABEL, "g")) ?? []).length >= cards, true);
  assert.ok(html.includes(R.SIMULATION_DISCLAIMER));
  assert.ok(/2 of 3/.test(html), "agreement is shown as counts");
  assert.ok(!/\d+%/.test(html), "no percentages");
});

test("persona panel shows the run info with seed and marks not-simulated personas (W3)", () => {
  const env = reconcilePersonas(JSON.parse(loadFixture("quick-review")), ["first_time_user", "power_user"]);
  const html = R.renderPersonas(env, { seed: 1234, persona_ids: ["first_time_user", "power_user"] });
  assert.ok(html.includes("seed 1234"));
  assert.ok(/1 of 2 selected personas simulated/.test(html));
  assert.ok(/Not simulated:/.test(html), "the unknown persona is shown as not simulated");
  assert.ok(html.includes("Power user"));
});

test("finding cards show finding type, severity, priority, and confidence exactly as supplied", () => {
  const html = R.renderFindingGroups(result);
  for (const f of result.findings) {
    assert.ok(html.includes(`>${f.finding_type}`), `type badge for ${f.issue_id}`);
    assert.ok(html.includes(`>${f.severity}<`), `severity for ${f.issue_id}`);
    assert.ok(html.includes(`>${f.priority}<`), `priority for ${f.issue_id}`);
    assert.ok(html.includes(`confidence ${f.confidence}<`), `confidence for ${f.issue_id}`);
  }
  assert.ok(html.includes(">Blockers") && html.includes(">Confusion") && html.includes(">Improvements") && html.includes(">Notes"));
  assert.ok(html.includes('type-USER_SIGNAL">USER_SIGNAL <span class="badge-sub">simulated</span>'));
});

test("finding detail shows evidence method, rule metadata, retest steps, and limitations", () => {
  const f = result.findings.find((x) => x.finding_type === "VIOLATION");
  const html = R.renderFindingDetail(f, result);
  assert.ok(html.includes("inferred") && html.includes("(estimated)"));
  assert.ok(html.includes("WCAG-1.4.3") && html.includes("NORMATIVE") && html.includes("Contrast (minimum)"));
  assert.ok(html.includes("PARTIAL"));
  assert.ok(html.includes("Retest") && html.includes(f.retest.steps[0]));
  assert.ok(html.includes(f.limitations));
  const sig = result.findings.find((x) => x.finding_type === "USER_SIGNAL");
  assert.ok(R.renderFindingDetail(sig, result).includes(R.SIMULATION_DISCLAIMER));
});

test("markdown export of a USER_SIGNAL finding carries the disclaimer; other exports carry type and confidence", () => {
  const sig = result.findings.find((x) => x.finding_type === "USER_SIGNAL");
  const md = R.findingToMarkdown(sig, result);
  assert.ok(md.includes(R.SIMULATION_DISCLAIMER));
  assert.ok(md.includes("Type: USER_SIGNAL (simulated)"));
  const vio = R.findingToMarkdown(result.findings.find((x) => x.finding_type === "VIOLATION"), result);
  assert.ok(vio.includes("Type: VIOLATION") && vio.includes("Confidence: LOW") && vio.includes("WCAG-1.4.3 (PARTIAL)"));
});

test("whole-result Markdown export covers the flow, groups, personas, and limitations", () => {
  const flowEnv = JSON.parse(loadFixture("flow-review"));
  const flow = { ...flowEnv, findings: addPresentation(flowEnv.findings) };
  const md = R.resultToMarkdown(flow);
  assert.ok(md.includes("# UI/UX analysis"));
  assert.ok(md.includes("Flow: Sign up with email"));
  assert.ok(md.includes(flow.summary.headline));
  assert.ok(md.includes("## Simulated personas") && md.includes(R.SIMULATION_DISCLAIMER));
  assert.ok(md.includes("## Limitations"));
  assert.ok(md.includes("## Not tested") && md.includes("flow completion"));
  // a USER_SIGNAL finding in the report carries the simulated marker
  assert.ok(md.includes("Type: USER_SIGNAL (simulated)"));
  assert.equal(R.resultToMarkdown(null), "");
});

test("comparison renders counts and grouped findings, and notes provisional matching (W5)", () => {
  const data = {
    status: "ok", baseline_audit_id: "aud_base", baseline_headline: "Prior run",
    comparison: {
      matching: "fingerprint",
      fixed: [{ issue_id: "a", title: "Contrast fixed", finding_type: "VIOLATION", severity: "High" }],
      unresolved: [{ current: { issue_id: "b", title: "Plan still unclear", finding_type: "USER_SIGNAL", severity: "Medium" } }],
      new: [{ issue_id: "c", title: "Header crowded", finding_type: "UX_RISK", severity: "Medium" }],
      regressed: [],
      counts: { fixed: 1, unresolved: 1, new: 1, regressed: 0 },
    },
  };
  const html = R.renderComparison(data);
  assert.ok(html.includes("Compared to the previous analysis"));
  assert.ok(html.includes("1 fixed") && html.includes("1 still open") && html.includes("1 new"));
  assert.ok(html.includes("Contrast fixed") && html.includes("Plan still unclear") && html.includes("Header crowded"));
  assert.ok(!html.includes("provisional matching"), "fingerprint matching is not flagged provisional");

  assert.match(R.renderComparison({ ...data, comparison: { ...data.comparison, matching: "provisional" } }), /provisional matching/);
  assert.equal(R.renderComparison({ status: "none" }), "");
  assert.match(R.renderComparison({ status: "baseline_unavailable" }), /no longer available/);
});

test("pair comparison renders side-by-side counts and device labels (W5)", () => {
  const data = {
    status: "ok",
    a: { audit_id: "aud_a", headline: "Mobile run", device: "mobile" },
    b: { audit_id: "aud_b", headline: "Desktop run", device: "desktop" },
    comparison: {
      matching: "fingerprint",
      fixed: [{ issue_id: "x", title: "Small tap target", finding_type: "VIOLATION", severity: "High" }],
      unresolved: [{ current: { issue_id: "y", title: "Weak hierarchy", finding_type: "UX_RISK", severity: "Medium" } }],
      new: [{ issue_id: "z", title: "Desktop-only overflow", finding_type: "UX_RISK", severity: "Medium" }],
      regressed: [],
      counts: { fixed: 1, unresolved: 1, new: 1, regressed: 0 },
    },
  };
  const html = R.renderPairComparison(data, "Mobile", "Desktop");
  assert.ok(html.includes("Mobile run") && html.includes("Desktop run"));
  assert.ok(html.includes("(mobile)") && html.includes("(desktop)"));
  assert.ok(html.includes("1 only in Mobile") && html.includes("1 in both") && html.includes("1 only in Desktop"));
  assert.ok(html.includes("Only in Mobile") && html.includes("In both") && html.includes("Only in Desktop"));
  assert.ok(html.includes("Small tap target") && html.includes("Desktop-only overflow"));
  assert.match(R.renderPairComparison({ status: "unavailable" }), /unavailable/);
  assert.equal(R.renderPairComparison(null), "");
});

test("comment thread renders authors, escapes bodies, and gates the delete control (W6)", () => {
  const comments = [
    { comment_id: "cmt_1", issue_id: "F-1", author_name: "Owner", by_owner: true, mine: true, created: "2026-09-02T00:00:00Z", body: "Looks right" },
    { comment_id: "cmt_2", issue_id: "F-1", author_name: "Guest", by_owner: false, mine: false, created: "2026-09-02T00:01:00Z", body: "<script>alert(1)</script>" },
    { comment_id: "cmt_3", issue_id: "F-2", author_name: "Other", by_owner: false, mine: true, created: "2026-09-02T00:02:00Z", body: "on another finding" },
  ];
  const html = R.renderComments(comments, "F-1");
  assert.ok(html.includes("Comments <span class=\"muted\">(2)</span>"), "counts only this finding's comments");
  assert.ok(html.includes(">Owner<") && html.includes("badge sim\">owner"), "owner is labeled");
  assert.ok(html.includes("&lt;script&gt;") && !html.includes("<script>alert"), "comment body is escaped");
  assert.ok(html.includes('data-del-comment="cmt_1"'), "own comment has a delete control");
  assert.ok(!html.includes('data-del-comment="cmt_2"'), "another author's comment has no delete control");
  assert.ok(html.includes('class="comment-form"') && html.includes('data-issue="F-1"'));
  assert.match(R.renderComments([], "F-9"), /No comments yet/);
});

test("output is escaped and partial results render without throwing", () => {
  const hostile = structuredClone(result);
  hostile.summary.headline = `<img src=x onerror=alert(1)>`;
  hostile.findings[0].title = `</button><script>alert(1)</script>`;
  const html = R.renderSummary(hostile) + R.renderFindingGroups(hostile);
  assert.ok(!html.includes("<script>") && !html.includes("<img src=x"));
  assert.ok(html.includes("&lt;script&gt;"));
  for (const fn of [R.renderSummary, R.renderFindingGroups, R.renderPersonas, R.renderCoverage]) {
    assert.doesNotThrow(() => fn(null));
    assert.doesNotThrow(() => fn({ findings: [], persona_runs: [], limitations: [] }));
  }
  assert.doesNotThrow(() => R.renderStages({ status: "RUNNING", stages: [{ name: "visual", state: "running" }] }));
  assert.ok(R.renderCoverage(result).includes("NOT_TESTED") && R.renderCoverage(result).includes("keyboard operability"));
});
