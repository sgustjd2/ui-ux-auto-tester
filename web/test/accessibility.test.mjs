// Structural accessibility acceptance (W1-AC-13). These assert the machine-checkable a11y properties of the
// rendered UI and its wiring, complementing the live DOM audit in web/tools/a11y-audit.js (which found zero
// critical issues on both pages) and the browser keyboard checks (tab roving, drawer focus trap, Escape close,
// focus return). Contrast of the color tokens is verified separately (all pairs >= 4.5:1, AA).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as R from "../ui/render.mjs";
import { loadFixture } from "../adapter/fixture-adapter.mjs";
import { addPresentation } from "../server/presentation.mjs";

const UI = join(dirname(fileURLToPath(import.meta.url)), "..", "ui");
const read = (f) => readFileSync(join(UI, f), "utf8");
const env = JSON.parse(loadFixture("flow-review"));
const result = { ...env, findings: addPresentation(env.findings) };

test("index.html carries the document-level accessibility scaffolding", () => {
  const html = read("index.html");
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /class="skip" href="#app"/, "skip link to main");
  assert.match(html, /<main id="app" tabindex="-1">/, "main landmark");
  assert.match(html, /id="live"[^>]*aria-live="polite"/, "polite live region");
  assert.match(html, /id="notice"[^>]*role="alert"/, "assertive alert region");
  assert.match(html, /<dialog id="drawer" aria-labelledby="drawer-title">/, "labelled modal dialog");
});

test("finding cards and badges convey type by text, not color alone", () => {
  const html = R.renderFindingGroups(result);
  for (const t of ["VIOLATION", "UX_RISK", "USER_SIGNAL"]) if (result.findings.some((f) => f.finding_type === t)) assert.ok(html.includes(`>${t}`), `${t} rendered as text`);
  assert.match(R.typeBadge({ finding_type: "USER_SIGNAL" }), /simulated/, "USER_SIGNAL badge names simulation in text");
  assert.match(html, /aria-haspopup="dialog"/, "finding opener announces it opens a dialog");
  // group headings present so findings are navigable by structure
  for (const g of ["Blockers", "Confusion", "Improvements", "Notes"]) if (result.findings.some((f) => R.GROUP_LABELS[f.presentation.group] === g)) assert.ok(html.includes(`>${g}`));
});

test("finding detail uses the dialog's label id and safe external links", () => {
  const detail = R.renderFindingDetail(result.findings.find((f) => f.finding_type === "VIOLATION"), result);
  assert.match(detail, /id="drawer-title"/, "heading matches the dialog aria-labelledby");
  for (const m of detail.matchAll(/<a href="https?:[^"]+"([^>]*)>/g)) assert.match(m[1], /rel="noopener noreferrer"/, "external links are safe");
  assert.match(detail, /target="_blank"/);
});

test("persona cards are headed and labelled as simulations", () => {
  const html = R.renderPersonas(result, { seed: 1 });
  const cards = (html.match(/class="card persona"/g) ?? []).length;
  const headings = (html.match(/<h3[^>]*id="p-/g) ?? []).length;
  assert.equal(headings, cards, "each persona card has its own heading");
  assert.ok(html.includes(`>${R.SIMULATED_LABEL}</span>`), "the simulation label is present as text in the card heading");
  assert.ok(html.includes(R.SIMULATION_DISCLAIMER));
});

test("coverage renders a real table with header cells", () => {
  const html = R.renderCoverage(result);
  assert.match(html, /<th>Rule<\/th>/);
  assert.match(html, /<table>/);
});

test("no rendered HTML uses inline style attributes (keeps the strict CSP intact)", () => {
  for (const fn of [R.renderSummary, R.renderFindingGroups, R.renderPersonas, R.renderCoverage, R.renderStages]) {
    assert.ok(!/\sstyle="/.test(fn(result)), `${fn.name} must not emit inline style attributes`);
  }
  assert.ok(!/\sstyle="/.test(R.renderFindingDetail(result.findings[0], result)));
  assert.ok(!read("index.html").match(/\sstyle="/), "index.html has no inline styles");
  // app.mjs builds HTML too; inline style="" attributes are blocked by the strict CSP (style-src 'self'),
  // so markers/widths must come from classes or the CSSOM (element.style), never attribute strings.
  assert.ok(!/\sstyle="/.test(read("app.mjs")), "app.mjs must not emit inline style attributes");
});

test("the W5/W6 surfaces (comparison, comments) are labelled and free of inline styles", () => {
  // comment thread: labelled form controls and a heading; escaped, no inline styles
  const comments = R.renderComments([{ comment_id: "c1", issue_id: "F-1", author_name: "A", by_owner: false, mine: true, created: "2026-09-03T00:00:00Z", body: "hi" }], "F-1");
  assert.match(comments, /<h3>Comments/);
  assert.match(comments, /aria-label="Your name"/);
  assert.match(comments, /aria-label="Add a comment"/);
  assert.ok(!/\sstyle="/.test(comments));

  // pair comparison and retest comparison have headings and no inline styles
  const pair = R.renderPairComparison({ status: "ok", a: { headline: "A", device: "mobile" }, b: { headline: "B", device: "desktop" }, comparison: { matching: "fingerprint", fixed: [], unresolved: [], new: [], regressed: [], counts: { fixed: 0, unresolved: 0, new: 0, regressed: 0 } } }, "Mobile", "Desktop");
  assert.match(pair, /aria-labelledby="pair-h"/);
  assert.ok(!/\sstyle="/.test(pair));
  const cmp = R.renderComparison({ status: "ok", baseline_headline: "prev", comparison: { matching: "fingerprint", fixed: [], unresolved: [], new: [], regressed: [], counts: { fixed: 0, unresolved: 0, new: 0, regressed: 0 } } });
  assert.match(cmp, /aria-labelledby="cmp-h"/);
  assert.ok(!/\sstyle="/.test(cmp));
});

test("the analysis view wires the ARIA tabs, flow strip, and drawer keyboard behavior", () => {
  const app = read("app.mjs");
  for (const needle of ['role="tablist"', 'role="tab"', "aria-controls", "aria-selected", 'role="tabpanel"']) assert.ok(app.includes(needle), `tabs wiring: ${needle}`);
  assert.ok(/ArrowRight|ArrowLeft/.test(app), "tab roving with arrow keys");
  assert.ok(app.includes("drawer.showModal()"), "drawer opens as a modal (focus trap)");
  assert.ok(/key === "Escape"[\s\S]*drawer\.close\(\)/.test(app), "Escape closes the drawer");
  assert.ok(app.includes("opener.focus()"), "focus returns to the opener on close");
  assert.ok(/aria-label=`Marker /.test(app) || app.includes('setAttribute("aria-label"'), "markers carry accessible names");
  assert.ok(app.includes('aria-label="Flow steps"') || app.includes("flow-strip"), "flow strip is a labelled nav");
});
