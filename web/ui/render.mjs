// Pure rendering functions for the web UI (docs/web-product/web-product-prd.md sections 10 to 12).
// Runs in the browser and in Node tests: no DOM access, no fetch, no auditing logic. Everything is escaped.
// The UI shows finding_type, severity, priority, and confidence exactly as the core supplied them.

// Text-format helpers live in the shared export module (used by the server and a future CLI too); re-export them
// so existing consumers keep importing them from here.
import { SIMULATION_DISCLAIMER, ILLUSTRATIVE_NOTICE, isIllustrative, GROUP_ORDER, GROUP_LABELS, METHOD_LABELS, countsByGroup, findingToMarkdown, resultToMarkdown, findingToGithubIssue, findingToJira } from "../shared/export.mjs";
export { SIMULATION_DISCLAIMER, ILLUSTRATIVE_NOTICE, isIllustrative, GROUP_ORDER, GROUP_LABELS, METHOD_LABELS, countsByGroup, findingToMarkdown, resultToMarkdown, findingToGithubIssue, findingToJira };

export const SIMULATED_LABEL = "Simulated persona";
export const STAGE_LABELS = { intake: "Understanding the input", visual: "Understanding the screen", personas: "Simulating personas", standards: "Checking rules", runtime: "Running the page", report: "Preparing the report" };
export const STATUS_LABELS = { QUEUED: "Queued", RUNNING: "Running", COMPLETED: "Completed", FAILED: "Failed", CANCELLED: "Cancelled" };

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ESC[c]);
const words = (s) => String(s ?? "").replaceAll("_", " ");

export function renderStages(status) {
  const items = (status?.stages ?? []).map((s) =>
    `<li class="stage stage-${esc(s.state)}"><span class="stage-dot" aria-hidden="true"></span>${esc(STAGE_LABELS[s.name] ?? words(s.name))}<span class="visually-hidden"> (${esc(s.state)})</span></li>`).join("");
  const label = STATUS_LABELS[status?.status] ?? status?.status ?? "";
  const partial = status?.partial && status?.status !== "RUNNING" ? " · partial" : "";
  const cached = status?.cached ? ` · <span class="muted" title="An identical screenshot and options were analyzed before, so the earlier result was reused.">reused a cached result</span>` : "";
  return `<p class="status-line"><strong>${esc(label)}${esc(partial)}</strong>${cached}${status?.error ? ` · ${esc(status.error.message)}` : ""}</p><ol class="stages" aria-label="Analysis progress">${items}</ol>`;
}

export function renderSummary(result) {
  const s = result?.summary;
  const counts = countsByGroup(result?.findings);
  const v = result?.versions;
  const banner = isIllustrative(result) ? `<div class="illustrative-banner" role="note">${esc(ILLUSTRATIVE_NOTICE)}</div>` : "";
  if (!s) return `${banner}<section class="card summary" aria-labelledby="summary-h"><h2 id="summary-h">Summary</h2><p class="muted">The summary appears when the first stage finishes.</p></section>`;
  return `${banner}<section class="card summary" aria-labelledby="summary-h">
  <h2 id="summary-h">Summary</h2>
  <p class="headline">${esc(s.headline)}</p>
  ${s.answer_to_question ? `<p class="answer"><strong>Answer to your question:</strong> ${esc(s.answer_to_question)}</p>` : ""}
  <dl class="summary-grid">
    <div><dt>Appears to be</dt><dd>${esc(s.perceived_purpose)}</dd></div>
    <div><dt>First impression</dt><dd>${esc(s.first_impression)}</dd></div>
    <div><dt>Likely next action</dt><dd>${esc(s.likely_next_action)}</dd></div>
  </dl>
  <p class="counts">${GROUP_ORDER.map((g) => `<span class="count count-${g}">${counts[g]} ${esc(GROUP_LABELS[g].toLowerCase())}</span>`).join(" ")}</p>
  ${v ? `<p class="versions muted small">Core ${esc(v.core)} · corpus ${esc(v.corpus)} · finding schema ${esc(v.finding_schema)} · model ${esc(v.model)}</p>` : ""}
</section>`;
}

export function typeBadge(f) {
  const sub = f.finding_type === "USER_SIGNAL" ? ` <span class="badge-sub">simulated</span>` : "";
  return `<span class="badge type-${esc(f.finding_type)}">${esc(f.finding_type)}${sub}</span>`;
}

const personasAffected = (f) => {
  const n = new Set((f.persona_signals ?? []).map((s) => s.persona_id)).size;
  return n ? `${n} simulated persona${n === 1 ? "" : "s"} affected` : "";
};

export function renderFindingCard(f) {
  const m = f.presentation?.marker_number;
  const affected = f.finding_type === "USER_SIGNAL" ? personasAffected(f) : "";
  return `<li class="finding" data-issue="${esc(f.issue_id)}">
  <button type="button" class="finding-open" data-open="${esc(f.issue_id)}" aria-haspopup="dialog">
    <span class="marker-badge" aria-label="${m ? `Marker ${m}` : "No marker"}">${m ?? "·"}</span>
    ${typeBadge(f)}
    <span class="sev sev-${esc(f.severity)}">${esc(f.severity)}</span>
    <span class="pri">${esc(f.priority)}</span>
    <span class="conf">confidence ${esc(f.confidence)}</span>
    <span class="title">${esc(f.title)}</span>
    ${affected ? `<span class="meta">${esc(affected)}</span>` : ""}
  </button>
</li>`;
}

export function renderFindingGroups(result, limit = 5) {
  const findings = result?.findings ?? [];
  if (!findings.length) return `<p class="muted">Findings appear as each stage finishes.</p>`;
  return GROUP_ORDER.map((g) => {
    const list = findings.filter((f) => f.presentation?.group === g);
    if (!list.length) return "";
    const shown = list.slice(0, limit);
    const rest = list.slice(limit);
    return `<section class="group" aria-labelledby="g-${g}">
  <h3 id="g-${g}">${esc(GROUP_LABELS[g])} <span class="muted">(${list.length})</span></h3>
  <ul class="findings">${shown.map(renderFindingCard).join("")}</ul>
  ${rest.length ? `<details class="more"><summary>Show ${rest.length} more</summary><ul class="findings">${rest.map(renderFindingCard).join("")}</ul></details>` : ""}
</section>`;
  }).join("");
}

function ruleLine(id, result, checkResult) {
  const meta = result?.rules_index?.[id];
  const parts = [`<code>${esc(id)}</code>`];
  if (meta) {
    parts.push(esc(meta.title), `<span class="chip">${esc(meta.rule_class)}</span>`, esc(`${meta.authority} ${meta.source_version ?? ""}`.trim()));
    if (meta.conformance_level) parts.push(esc(meta.conformance_level));
    if (meta.source_url) parts.push(`<a href="${esc(meta.source_url)}" rel="noopener noreferrer" target="_blank">source</a>`);
  }
  if (checkResult) parts.push(`result <span class="result result-${esc(checkResult)}">${esc(checkResult)}</span>`);
  return `<li>${parts.join(" · ")}</li>`;
}

function evidenceLine(e) {
  const value = e.value && e.value.ratio !== undefined ? ` ratio ~${esc(e.value.ratio)}:1${e.method === "automated" ? "" : " (estimated)"}` : "";
  return `<li><span class="ev-type">${esc(words(e.type))}</span> <span class="method method-${esc(e.method)}">${esc(METHOD_LABELS[e.method] ?? e.method)}</span>${value}${e.note ? ` <span class="muted">${esc(e.note)}</span>` : ""}</li>`;
}

export function renderFindingDetail(f, result) {
  const rules = (f.rules ?? []).map((r) => ruleLine(r.id, result, r.result)).join("");
  const heuristics = (f.heuristics ?? []).map((h) => ruleLine(h, result, null)).join("");
  const evidence = (f.evidence ?? []).map(evidenceLine).join("");
  const signals = (f.persona_signals ?? []).map((s) =>
    `<li><strong>${esc(words(s.persona_id))}</strong> <span class="muted">(${SIMULATED_LABEL}, ${esc(words(s.test))})</span>: ${esc(s.observation)} Would ${esc(s.expected_action)}; expects ${esc(s.predicted_outcome)}; confidence ${esc(s.confidence)}.</li>`).join("");
  const m = f.presentation?.marker_number;
  return `<header class="detail-head">${typeBadge(f)} <span class="sev sev-${esc(f.severity)}">${esc(f.severity)}</span> <span class="pri">${esc(f.priority)}</span> <span class="conf">confidence ${esc(f.confidence)}</span></header>
<h2 id="drawer-title">${m ? `<span class="marker-badge">${m}</span> ` : ""}${esc(f.title)}</h2>
<dl class="detail">
  <div><dt>Observed</dt><dd>${esc(f.observed)}</dd></div>
  <div><dt>Expected</dt><dd>${esc(f.expected)}</dd></div>
  <div><dt>Why it matters</dt><dd>${esc(f.impact)}</dd></div>
  <div><dt>Where</dt><dd>${esc(f.location)}${f.component ? ` · ${esc(f.component)}` : ""}</dd></div>
</dl>
<h3>Evidence</h3><ul class="evidence">${evidence || `<li class="muted">None recorded</li>`}</ul>
${signals ? `<h3>Persona signals</h3><p class="disclaimer">${esc(SIMULATION_DISCLAIMER)}</p><ul class="signals">${signals}</ul>` : ""}
<details class="technical" open><summary>Technical detail</summary>
  ${rules ? `<h4>Rules</h4><ul>${rules}</ul>` : ""}
  ${heuristics ? `<h4>Principles</h4><ul>${heuristics}</ul>` : ""}
  <h4>Recommended fix</h4><p>${esc(f.recommendation)}</p>
  ${f.code_guidance ? `<h4>Developer guidance</h4><p>${esc(f.code_guidance)}</p>` : ""}
  <h4>Retest</h4><ol>${(f.retest?.steps ?? []).map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
  <p>Expected: ${esc(f.retest?.expected_result)} <span class="muted">(${esc(words(f.retest?.layer))})</span></p>
  ${f.automation_candidate ? `<h4>Automation candidate</h4><p><code>${esc(f.automation_candidate.assertion)}</code>${f.automation_candidate.tool_hint ? ` <span class="muted">${esc(f.automation_candidate.tool_hint)}</span>` : ""}</p>` : ""}
  <h4>Limitations</h4><p>${esc(f.limitations)}</p>
</details>`;
}

// Comment thread for one finding (W6), shown in the drawer. Owner and viewers can comment; a viewer sees a
// Delete control only on their own comments (the server enforces it too).
export function renderComments(comments = [], issueId) {
  const list = comments.filter((c) => c.issue_id === issueId);
  const items = list.map((c) => `<li class="comment"><div class="comment-head"><strong>${esc(c.author_name)}</strong>${c.by_owner ? ' <span class="badge sim">owner</span>' : ""} <span class="muted small">${esc(new Date(c.created).toLocaleString())}</span>${c.mine ? ` <button type="button" class="link" data-del-comment="${esc(c.comment_id)}">Delete</button>` : ""}</div><div class="comment-body">${esc(c.body)}</div></li>`).join("");
  return `<section class="comments" aria-label="Comments">
  <h3>Comments <span class="muted">(${list.length})</span></h3>
  <ul class="comment-list">${items || '<li class="muted">No comments yet.</li>'}</ul>
  <form class="comment-form" data-issue="${esc(issueId)}">
    <input type="text" class="comment-name" maxlength="40" placeholder="Your name (optional)" aria-label="Your name">
    <textarea class="comment-body-input" rows="2" maxlength="2000" placeholder="Add a comment" aria-label="Add a comment" required></textarea>
    <button type="submit">Comment</button>
  </form>
</section>`;
}

export function renderPersonas(result, runInfo = {}) {
  const runs = result?.persona_runs ?? [];
  if (!runs.length) return `<p class="muted">Persona results appear when the persona stage finishes.</p>`;
  const simulated = runs.filter((r) => !r.not_simulated).length;
  const runLine = `<p class="run-info muted small">${simulated} of ${runs.length} selected persona${runs.length === 1 ? "" : "s"} simulated${runInfo.seed != null ? ` · seed ${esc(runInfo.seed)} (rerun with the same personas and seed to reproduce)` : ""}.</p>`;
  const cards = runs.map((run) => {
    const by = (t) => (run.signals ?? []).find((s) => s.test === t);
    const head = `<h3 id="p-${esc(run.persona_run_id)}">${esc(run.persona?.label ?? run.persona?.persona_id)} <span class="badge sim" title="AI simulation of a user profile. Not a real participant.">${SIMULATED_LABEL}</span></h3>`;
    if (run.not_simulated) return `<article class="card persona" aria-labelledby="p-${esc(run.persona_run_id)}">${head}<p class="muted">Not simulated: ${esc(run.not_simulated.reason)}</p></article>`;
    const fi = by("first_impression"), pa = by("primary_action"), co = by("comprehension"), re = by("recall"), ab = by("abandonment");
    const dims = Object.entries(run.persona?.dimensions ?? {})
      .filter(([, v]) => v && !(Array.isArray(v) && v.length === 0))
      .map(([k, v]) => `${esc(words(k))}: ${esc(Array.isArray(v) ? v.map(words).join(", ") : words(v))}`).join(" · ");
    return `<article class="card persona" aria-labelledby="p-${esc(run.persona_run_id)}">${head}
  <p class="dims muted small">${dims}</p>
  <dl>
    ${fi ? `<div><dt>Sees first</dt><dd>${esc(fi.observation)}</dd></div>` : ""}
    ${pa ? `<div><dt>Would act</dt><dd>${esc(pa.expected_action)} <span class="muted">(confidence ${esc(pa.confidence)})</span></dd></div><div><dt>Expects</dt><dd>${esc(pa.predicted_outcome)}</dd></div>` : ""}
    ${co ? `<div><dt>Confused by</dt><dd>${esc(co.observation)}</dd></div>` : ""}
    ${re ? `<div><dt>Remembers</dt><dd>${esc(re.observation)}</dd></div>` : ""}
    ${ab || run.outcome ? `<div><dt>Continue or leave</dt><dd>${esc(run.outcome?.decision ?? ab?.expected_action)} <span class="muted">(confidence ${esc(run.outcome?.confidence ?? ab?.confidence)})</span></dd></div>` : ""}
  </dl>
</article>`;
  }).join("");
  const ps = result?.persona_summary;
  const agreement = ps ? `<section class="card agreement"><h3>Agreement across ${esc(ps.personas_tested)} simulated personas</h3><ul>${(ps.tests ?? []).map((t) =>
    `<li><strong>${esc(words(t.test))}</strong>: ${esc(t.agree)} of ${esc(ps.personas_tested)} answered "${esc(t.majority_answer)}"${t.dissent?.length ? `; dissent: ${t.dissent.map((d) => `${esc(words(d.persona_id))} (${esc(d.answer)})`).join(", ")}` : ""}</li>`).join("")}</ul>
  <p class="muted small">Confused: ${esc(ps.personas_confused)} · task failures: ${esc(ps.task_failures)}</p></section>` : "";
  return `<p class="disclaimer" role="note">${esc(SIMULATION_DISCLAIMER)} Simulated personas scan before reading, may skip secondary text, and may misunderstand by design.</p>
${runLine}
<div class="persona-grid">${cards}</div>${agreement}`;
}

export function renderCoverage(result) {
  const c = result?.coverage;
  const limitations = result?.limitations ?? [];
  const notTested = c?.not_tested_families ?? result?.plan?.not_tested ?? [];
  const rows = (c?.rule_results ?? []).map((r) =>
    `<tr><td><code>${esc(r.id)}</code>${result?.rules_index?.[r.id] ? ` ${esc(result.rules_index[r.id].title)}` : ""}</td><td><span class="result result-${esc(r.result)}">${esc(r.result)}</span></td><td>${esc(r.method ?? "")}</td><td>${esc(r.reason ?? r.note ?? "")}</td></tr>`).join("");
  return `<section class="card"><h3>Limitations</h3>${limitations.length ? `<ul>${limitations.map((l) => `<li>${esc(l.text)}</li>`).join("")}</ul>` : `<p class="muted">Limitations appear when the report stage finishes.</p>`}</section>
<section class="card"><h3>Rule results${c ? ` <span class="muted">(${esc(c.applicable_rule_count)} applicable)</span>` : ""}</h3>
${rows ? `<div class="table-wrap"><table><thead><tr><th>Rule</th><th>Result</th><th>Method</th><th>Note</th></tr></thead><tbody>${rows}</tbody></table></div>` : `<p class="muted">Rule results appear when the standards stage finishes.</p>`}</section>
${notTested.length ? `<section class="card"><h3>Not tested</h3><ul>${notTested.map((n) => `<li>${esc(words(n.family))}: ${esc(n.reason)}</li>`).join("")}</ul></section>` : ""}`;
}

// Side-by-side comparison of two analyses (W5: mobile vs desktop, A vs B). Reuses the retest comparison shape,
// relabeling fixed→"only in A", new→"only in B", unresolved→"in both".
export function renderPairComparison(data, labelA = "A", labelB = "B") {
  if (!data) return "";
  const side = (s, label) => `<strong>${esc(label)}</strong>: ${esc(s?.headline ?? s?.audit_id ?? "?")}${s?.device ? ` <span class="muted">(${esc(s.device)})</span>` : ""}`;
  if (data.status !== "ok") return `<section class="card comparison"><h2>Comparison</h2><p class="muted">One of the analyses is unavailable (deleted, expired, or still running), so no comparison can be shown.</p></section>`;
  const c = data.comparison;
  const map = { fixed: `Only in ${labelA}`, unresolved: "In both", new: `Only in ${labelB}` };
  const cls = { fixed: "cmp-fixed", unresolved: "", new: "cmp-new" };
  const item = (f) => `<li><span class="badge type-${esc(f.finding_type)}">${esc(f.finding_type)}</span> <span class="sev sev-${esc(f.severity)}">${esc(f.severity)}</span> ${esc(f.title)}</li>`;
  const group = (k) => { const list = k === "unresolved" ? c[k].map((p) => p.current) : c[k]; return list.length ? `<section class="cmp-group"><h3>${esc(map[k])} <span class="muted">(${list.length})</span></h3><ul class="findings-plain">${list.map(item).join("")}</ul></section>` : ""; };
  return `<section class="card comparison" aria-labelledby="pair-h">
  <h2 id="pair-h">Comparison</h2>
  <p class="muted small">${side(data.a, labelA)} &nbsp;·&nbsp; ${side(data.b, labelB)}${c.matching === "provisional" ? ' · <span title="No stable issue ids, so findings are matched by rule, component, and location.">provisional matching</span>' : ""}</p>
  <p class="cmp-counts"><span class="cmp-count cmp-fixed">${c.counts.fixed} only in ${esc(labelA)}</span> <span class="cmp-count">${c.counts.unresolved} in both</span> <span class="cmp-count cmp-new">${c.counts.new} only in ${esc(labelB)}</span></p>
  ${["fixed", "unresolved", "new"].map(group).join("")}
</section>`;
}

// Retest comparison against the previous run (W5): fixed / unresolved / new / regressed.
export const COMPARE_ORDER = ["regressed", "new", "unresolved", "fixed"];
export const COMPARE_LABELS = { fixed: "Fixed", unresolved: "Still open", new: "New", regressed: "Regressed" };
export function renderComparison(data) {
  if (!data || data.status === "none") return "";
  if (data.status === "baseline_unavailable") return `<section class="card comparison"><h2>Compared to the previous analysis</h2><p class="muted">The previous analysis is no longer available (deleted or expired), so no comparison can be shown.</p></section>`;
  if (data.status !== "ok") return `<section class="card comparison"><h2>Compared to the previous analysis</h2><p class="muted">The comparison will appear when this retest finishes.</p></section>`;
  const c = data.comparison;
  const chip = (k) => `<span class="cmp-count cmp-${k}">${c.counts[k]} ${esc(COMPARE_LABELS[k].toLowerCase())}</span>`;
  const item = (f) => `<li><span class="badge type-${esc(f.finding_type)}">${esc(f.finding_type)}</span> <span class="sev sev-${esc(f.severity)}">${esc(f.severity)}</span> ${esc(f.title)}</li>`;
  const group = (k) => c[k].length ? `<section class="cmp-group"><h3>${esc(COMPARE_LABELS[k])} <span class="muted">(${c[k].length})</span></h3><ul class="findings-plain">${(k === "unresolved" ? c[k].map((p) => p.current) : c[k]).map(item).join("")}</ul></section>` : "";
  return `<section class="card comparison" aria-labelledby="cmp-h">
  <h2 id="cmp-h">Compared to the previous analysis</h2>
  <p class="muted small">Baseline: ${esc(data.baseline_headline ?? data.baseline_audit_id)}${c.matching === "provisional" ? ' · <span title="The core did not supply stable issue ids, so findings are matched by rule, component, and location.">provisional matching</span>' : ""}</p>
  <p class="cmp-counts">${COMPARE_ORDER.map(chip).join(" ")}</p>
  ${COMPARE_ORDER.map(group).join("")}
</section>`;
}

