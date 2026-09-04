import { test } from "node:test";
import assert from "node:assert/strict";
import { findingsToCsv, findingToGithubIssue, findingToJira, findingToMarkdown, resultToMarkdown, exportReport, exportFinding, CSV_COLUMNS, SIMULATION_DISCLAIMER, ILLUSTRATIVE_NOTICE } from "../shared/export.mjs";
import { loadFixture } from "../adapter/fixture-adapter.mjs";
import { addPresentation } from "../server/presentation.mjs";

const env = JSON.parse(loadFixture("quick-review"));
const result = { ...env, findings: addPresentation(env.findings) };

const parseCsv = (text) => text.trimEnd().split("\r\n").map((line) => {
  const cells = []; let cur = ""; let q = false;
  for (let i = 0; i < line.length; i++) { const c = line[i];
    if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ",") { cells.push(cur); cur = ""; } else cur += c; }
  cells.push(cur); return cells;
});

test("the Markdown report carries the illustrative notice for fixture results and drops it for a real core", () => {
  const md = resultToMarkdown(result);
  assert.ok(md.includes(`> ${ILLUSTRATIVE_NOTICE}`), "illustrative results are flagged as a blockquote near the top");
  assert.ok(md.indexOf(ILLUSTRATIVE_NOTICE) < md.indexOf("**"), "the notice precedes the headline");
  const real = resultToMarkdown({ ...result, versions: { ...result.versions, core: "1.0.0" } });
  assert.ok(!real.includes(ILLUSTRATIVE_NOTICE), "a real core produces no illustrative notice");
});

test("CSV has a header, one row per finding, and the expected columns", () => {
  const rows = parseCsv(findingsToCsv(result));
  assert.deepEqual(rows[0], CSV_COLUMNS);
  assert.equal(rows.length - 1, result.findings.length);
  const typeCol = CSV_COLUMNS.indexOf("type");
  assert.ok(rows.slice(1).every((r) => ["VIOLATION", "UX_RISK", "USER_SIGNAL"].includes(r[typeCol])));
  const idCol = CSV_COLUMNS.indexOf("issue_id");
  assert.ok(rows.slice(1).some((r) => r[idCol] === "F-fixture-quick-review-001"));
});

test("CSV quotes fields containing commas, quotes, and newlines", () => {
  const f = { issue_id: "x", finding_type: "UX_RISK", severity: "Low", priority: "P3", confidence: "LOW", title: 'A, "quoted"\nmulti', recommendation: "plain", rules: [], heuristics: [], presentation: { group: "NOTE" } };
  const rows = parseCsv(findingsToCsv({ findings: [f] }));
  const titleCol = CSV_COLUMNS.indexOf("title");
  assert.equal(rows[1][titleCol], 'A, "quoted"\nmulti', "round-trips comma, quote, and newline");
  // the raw serialization wraps that cell in quotes and doubles the inner quote
  assert.ok(findingsToCsv({ findings: [f] }).includes('"A, ""quoted""'));
});

test("GitHub issue has a labelled title and a Markdown body", () => {
  const f = result.findings.find((x) => x.finding_type === "VIOLATION");
  const gh = findingToGithubIssue(f, result);
  assert.equal(gh.title, `[VIOLATION][${f.severity}] ${f.title}`);
  assert.equal(gh.body, findingToMarkdown(f, result));
  assert.ok(gh.body.includes("**Observed:**") && gh.body.includes("WCAG-1.4.3"));
});

test("Jira markup uses Jira syntax and keeps the simulation disclaimer for USER_SIGNAL", () => {
  const sig = result.findings.find((x) => x.finding_type === "USER_SIGNAL");
  const jira = findingToJira(sig, result);
  assert.match(jira, /^h2\. /);
  assert.ok(jira.includes("*Type:* USER_SIGNAL (simulated)"));
  assert.ok(jira.includes(SIMULATION_DISCLAIMER));
  assert.ok(jira.includes("# ") , "retest steps are a Jira numbered list");
  assert.ok(!jira.includes("**"), "no Markdown bold leaks into Jira");
});

test("dispatchers select the format and reject unknown ones", () => {
  assert.equal(exportReport(result, "md").content, resultToMarkdown(result));
  assert.equal(exportReport(result, "md").ext, "md");
  assert.equal(exportReport(result, "csv").ext, "csv");
  assert.match(exportReport(result, "csv").mime, /text\/csv/);
  assert.throws(() => exportReport(result, "pdf"), /unknown report format/);
  const f = result.findings[0];
  assert.equal(exportFinding(f, result, "md").content, findingToMarkdown(f, result));
  assert.ok(exportFinding(f, result, "github").title);
  assert.ok(exportFinding(f, result, "jira").content.startsWith("h2. "));
  assert.throws(() => exportFinding(f, result, "xml"), /unknown finding format/);
});
