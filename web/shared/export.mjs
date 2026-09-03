// Text export of findings and reports (W6): the single home for Markdown, CSV, GitHub-issue, and Jira formats,
// shared by the UI (clipboard copy) and the server (downloadable files) — and usable by a future CLI. Pure string
// transforms over a result envelope; no auditing logic, no HTML, no I/O. USER_SIGNAL output keeps the simulation
// disclaimer so exported issues stay honest about what is a rule failure versus simulated behavior.

export const SIMULATION_DISCLAIMER = "Results are simulated persona behavior, not human participant research.";
export const GROUP_ORDER = ["BLOCKER", "CONFUSION", "IMPROVEMENT", "NOTE"];
export const GROUP_LABELS = { BLOCKER: "Blockers", CONFUSION: "Confusion", IMPROVEMENT: "Improvements", NOTE: "Notes" };
export const METHOD_LABELS = { automated: "measured", visual: "inferred", manual: "inferred", simulated: "simulated" };

export function countsByGroup(findings = []) {
  const counts = Object.fromEntries(GROUP_ORDER.map((g) => [g, 0]));
  for (const f of findings) if (f.presentation?.group in counts) counts[f.presentation.group] += 1;
  return counts;
}

// ---------- Markdown ----------
export function findingToMarkdown(f, result) {
  const lines = [
    `## ${f.title}`, "",
    `- Type: ${f.finding_type}${f.finding_type === "USER_SIGNAL" ? " (simulated)" : ""}`,
    `- Severity: ${f.severity} · Priority: ${f.priority} · Confidence: ${f.confidence}`,
    `- Where: ${f.location}${f.component ? ` · ${f.component}` : ""}`, "",
    `**Observed:** ${f.observed}`, "", `**Expected:** ${f.expected}`, "", `**Why it matters:** ${f.impact}`, "",
  ];
  if (f.rules?.length) lines.push(`**Rules:** ${f.rules.map((r) => `${r.id} (${r.result})`).join(", ")}`, "");
  if (f.heuristics?.length) lines.push(`**Principles:** ${f.heuristics.join(", ")}`, "");
  lines.push("**Evidence:**", ...(f.evidence ?? []).map((e) => `- ${e.type} (${METHOD_LABELS[e.method] ?? e.method})${e.note ? `: ${e.note}` : ""}`), "");
  if (f.persona_signals?.length) {
    lines.push(`**Persona signals:** ${SIMULATION_DISCLAIMER}`, ...f.persona_signals.map((s) => `- ${s.persona_id} (${s.test}): ${s.observation} Would ${s.expected_action}; expects ${s.predicted_outcome}; confidence ${s.confidence}.`), "");
  }
  lines.push(`**Recommended fix:** ${f.recommendation}`, "");
  if (f.code_guidance) lines.push(`**Developer guidance:** ${f.code_guidance}`, "");
  lines.push("**Retest:**", ...(f.retest?.steps ?? []).map((s, i) => `${i + 1}. ${s}`), `Expected: ${f.retest?.expected_result} (${f.retest?.layer})`, "", `**Limitations:** ${f.limitations}`);
  if (result?.versions) lines.push("", `_Core ${result.versions.core} · corpus ${result.versions.corpus} · finding schema ${result.versions.finding_schema}_`);
  return lines.join("\n");
}

export function resultToMarkdown(result) {
  if (!result) return "";
  const s = result.summary ?? {};
  const counts = countsByGroup(result.findings);
  const out = ["# UI/UX analysis", ""];
  if (result.flow?.task) out.push(`Flow: ${result.flow.task}`, "");
  out.push(`**${s.headline ?? ""}**`, "");
  if (s.answer_to_question) out.push(`Answer to the question: ${s.answer_to_question}`, "");
  out.push(`- Appears to be: ${s.perceived_purpose ?? ""}`, `- First impression: ${s.first_impression ?? ""}`, `- Likely next action: ${s.likely_next_action ?? ""}`, "");
  out.push(`Findings: ${GROUP_ORDER.map((g) => `${counts[g]} ${GROUP_LABELS[g].toLowerCase()}`).join(", ")}.`, "");
  for (const g of GROUP_ORDER) {
    const list = (result.findings ?? []).filter((f) => f.presentation?.group === g);
    if (!list.length) continue;
    out.push(`## ${GROUP_LABELS[g]}`, "");
    for (const f of list) out.push(findingToMarkdown(f, result), "");
  }
  const ps = result.persona_summary;
  if (ps) {
    out.push("## Simulated personas", "", SIMULATION_DISCLAIMER, "");
    for (const t of ps.tests ?? []) out.push(`- ${t.test}: ${t.agree} of ${ps.personas_tested} answered "${t.majority_answer}"${t.dissent?.length ? ` (dissent: ${t.dissent.map((d) => `${d.persona_id} — ${d.answer}`).join(", ")})` : ""}`);
    out.push("");
  }
  if (result.limitations?.length) { out.push("## Limitations", ""); for (const l of result.limitations) out.push(`- ${l.text}`); out.push(""); }
  const notTested = result.coverage?.not_tested_families ?? result.plan?.not_tested ?? [];
  if (notTested.length) { out.push("## Not tested", ""); for (const n of notTested) out.push(`- ${String(n.family).replaceAll("_", " ")}: ${n.reason}`); out.push(""); }
  if (result.versions) out.push(`_Core ${result.versions.core} · corpus ${result.versions.corpus} · finding schema ${result.versions.finding_schema} · model ${result.versions.model}_`);
  return out.join("\n");
}

// ---------- CSV (one row per finding; RFC 4180 quoting) ----------
export const CSV_COLUMNS = ["issue_id", "fingerprint", "type", "severity", "priority", "confidence", "group", "title", "component", "location", "rules", "heuristics", "recommendation", "retest_expected", "limitations"];
const csvCell = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
};
function findingRow(f) {
  return {
    issue_id: f.issue_id, fingerprint: f.fingerprint ?? "", type: f.finding_type, severity: f.severity, priority: f.priority,
    confidence: f.confidence, group: f.presentation?.group ?? "", title: f.title, component: f.component ?? "", location: f.location ?? "",
    rules: (f.rules ?? []).map((r) => `${r.id} (${r.result})`).join("; "), heuristics: (f.heuristics ?? []).join("; "),
    recommendation: f.recommendation ?? "", retest_expected: f.retest?.expected_result ?? "", limitations: f.limitations ?? "",
  };
}
export function findingsToCsv(result) {
  const rows = [CSV_COLUMNS.join(",")];
  for (const f of result?.findings ?? []) { const r = findingRow(f); rows.push(CSV_COLUMNS.map((c) => csvCell(r[c])).join(",")); }
  return rows.join("\r\n") + "\r\n";
}

// ---------- GitHub issue (title + Markdown body) ----------
export function findingToGithubIssue(f, result) {
  return { title: `[${f.finding_type}][${f.severity}] ${f.title}`, body: findingToMarkdown(f, result) };
}

// ---------- Jira wiki markup ----------
export function findingToJira(f, result) {
  const sim = f.finding_type === "USER_SIGNAL" ? " (simulated)" : "";
  const out = [
    `h2. ${f.title}`, "",
    `* *Type:* ${f.finding_type}${sim}`,
    `* *Severity:* ${f.severity}  *Priority:* ${f.priority}  *Confidence:* ${f.confidence}`,
    `* *Where:* ${f.location}${f.component ? `  (${f.component})` : ""}`, "",
    `*Observed:* ${f.observed}`, "", `*Expected:* ${f.expected}`, "", `*Why it matters:* ${f.impact}`, "",
  ];
  if (f.rules?.length) out.push(`*Rules:* ${f.rules.map((r) => `${r.id} (${r.result})`).join(", ")}`, "");
  if (f.heuristics?.length) out.push(`*Principles:* ${f.heuristics.join(", ")}`, "");
  out.push("*Evidence:*", ...(f.evidence ?? []).map((e) => `* ${e.type} (${METHOD_LABELS[e.method] ?? e.method})${e.note ? `: ${e.note}` : ""}`), "");
  if (f.persona_signals?.length) out.push(`*Persona signals:* ${SIMULATION_DISCLAIMER}`, ...f.persona_signals.map((s) => `* ${s.persona_id} (${s.test}): ${s.observation}`), "");
  out.push(`*Recommended fix:* ${f.recommendation}`, "");
  if (f.code_guidance) out.push(`*Developer guidance:* ${f.code_guidance}`, "");
  out.push("*Retest:*", ...(f.retest?.steps ?? []).map((s) => `# ${s}`), `Expected: ${f.retest?.expected_result} (${f.retest?.layer})`, "", `*Limitations:* ${f.limitations}`);
  return out.join("\n");
}

// ---------- dispatchers ----------
export const REPORT_FORMATS = { md: { mime: "text/markdown; charset=utf-8", ext: "md", build: resultToMarkdown }, csv: { mime: "text/csv; charset=utf-8", ext: "csv", build: findingsToCsv } };
export function exportReport(result, format) {
  const spec = REPORT_FORMATS[format];
  if (!spec) throw new Error(`unknown report format: ${format}`);
  return { mime: spec.mime, ext: spec.ext, content: spec.build(result) };
}
export function exportFinding(f, result, format) {
  if (format === "md") return { content: findingToMarkdown(f, result) };
  if (format === "github") return findingToGithubIssue(f, result);
  if (format === "jira") return { content: findingToJira(f, result) };
  throw new Error(`unknown finding format: ${format}`);
}
