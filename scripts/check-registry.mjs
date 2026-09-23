#!/usr/bin/env node
// Rule registry validator (ADR 0008, docs/rule-schema.md §4). Standard library only.
// Usage: `node scripts/check-registry.mjs` validates registry/*.json; `--self-test` checks the validator itself.
// Exit 0 when valid, 2 on any problem (same convention as scripts/check-harness.mjs, which runs this script).
// ponytail: markdown tables are split on "|" like the harness check; a "|" inside a cell breaks parsing there first.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const REQUIRED = ["id", "title", "authority", "source", "source_url", "source_version", "source_status", "last_verified", "rule_class", "platforms", "jurisdictions", "category", "subcategory", "conformance_level", "normative_strength", "description", "rationale", "applicability", "exceptions", "testability", "expected_evidence", "severity_hint", "related_rules", "status"];
const OPTIONAL = ["test_procedures", "notes"];
const E = {
  sourceStatus: ["CURRENT", "SUPERSEDED", "DRAFT", "DEPRECATED", "WITHDRAWN", "UNKNOWN"],
  ruleClass: ["NORMATIVE", "LEGAL", "PLATFORM", "STANDARD", "HEURISTIC", "BEST_PRACTICE", "METRIC"],
  platform: ["web", "pwa", "ios", "android", "desktop", "all"],
  category: ["accessibility", "visual_design", "layout_responsive", "navigation_ia", "forms", "components", "states_feedback", "content_cognition", "performance_ux", "platform_ux", "trust_privacy", "i18n_l10n"],
  level: ["A", "AA", "AAA"],
  strength: ["MUST", "SHOULD", "MAY", "INFORMATIVE"],
  testability: ["FULL", "PARTIAL", "NONE"],
  evidence: ["screenshot", "dom_locator", "accessibility_node", "role_name_state", "computed_style", "bounding_box", "color_value", "contrast_ratio", "keyboard_trace", "focus_trace", "network_timing", "performance_metric", "console_error", "interaction_trace", "persona_vote", "task_failure", "reviewer_observation"],
  severity: ["Critical", "High", "Medium", "Low", "Informational"],
  relation: ["equivalent", "narrower", "broader", "overlaps", "see_also"],
  status: ["ACTIVE", "RETIRED"],
  actStatus: ["approved", "proposed"],
};
// Tiers each rule class may come from (docs/rule-schema.md §4); T4 BEST_PRACTICE also needs a notes statement.
const CLASS_TIERS = { NORMATIVE: ["T1"], LEGAL: ["T1"], PLATFORM: ["T1", "T2"], STANDARD: ["T1", "T2"], METRIC: ["T1", "T2"], HEURISTIC: ["T1", "T2", "T3"], BEST_PRACTICE: ["T1", "T2", "T3", "T4"] };
// ponytail: sources that define conformance levels, listed by hand; add a source here when its levels are normalized.
const LEVELED = new Set(["SRC-W3C-WCAG22"]);
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const isStr = (v) => typeof v === "string" && v.trim() !== "";
const isList = Array.isArray;

// ---------- context from the markdown registries ----------
function tableRows(md, required) {
  const lines = md.replace(/```[\s\S]*?```/g, "").split(/\r?\n/);
  const out = [];
  for (let i = 0; i + 1 < lines.length; i++) {
    if (!/^\s*\|.*\|\s*$/.test(lines[i]) || !/^\s*\|(\s*:?-{3,}:?\s*\|)+\s*$/.test(lines[i + 1])) continue;
    const cells = (l) => l.trim().replace(/^\||\|$/g, "").split("|").map((s) => s.trim());
    const head = cells(lines[i]);
    let j = i + 2;
    for (; j < lines.length && /^\s*\|.*\|\s*$/.test(lines[j]); j++) {
      const c = cells(lines[j]);
      if (required.every((h) => head.includes(h))) out.push(Object.fromEntries(head.map((h, k) => [h, c[k] ?? ""])));
    }
    i = j - 1;
  }
  return out;
}

export function loadContext(root = ROOT) {
  const sources = new Map(tableRows(readFileSync(join(root, "research/sources.md"), "utf8"), ["source_id", "tier", "research_status"]).map((r) => [r.source_id, r]));
  const prefixes = new Map(tableRows(readFileSync(join(root, "docs/rule-schema.md"), "utf8"), ["prefix", "source_id"]).map((r) => [r.prefix, r.source_id]));
  return { sources, prefixes };
}

// ---------- validation ----------
export function validate(records, ctx) {
  const errors = [];
  const byId = new Map();
  const err = (r, msg) => errors.push(`${r?.id ?? "(no id)"}: ${msg}`);

  for (const r of records) {
    if (typeof r !== "object" || r === null || isList(r)) { errors.push("record is not an object"); continue; }
    for (const k of Object.keys(r)) if (!REQUIRED.includes(k) && !OPTIONAL.includes(k)) err(r, `unknown field "${k}"`);
    for (const k of REQUIRED) if (!(k in r)) err(r, `missing field "${k}"`);
    if (byId.has(r.id)) err(r, "duplicate id");
    byId.set(r.id, r);

    // identifier and prefix
    const prefix = [...ctx.prefixes.keys()].filter((p) => String(r.id).startsWith(p + "-")).sort((a, b) => b.length - a.length)[0];
    if (!prefix) err(r, "id prefix is not registered in docs/rule-schema.md §8");
    else if (ctx.prefixes.get(prefix).toLowerCase() !== "n/a" && ctx.prefixes.get(prefix) !== r.source) err(r, `prefix ${prefix} maps to ${ctx.prefixes.get(prefix)}, not ${r.source}`);

    // source and tier
    const src = ctx.sources.get(r.source);
    if (!src) err(r, `unknown source ${r.source}`);
    else {
      if (src.research_status !== "VERIFIED") err(r, `source ${r.source} is not VERIFIED`);
      if (src.source_status && r.source_status !== src.source_status) err(r, `source_status ${r.source_status} differs from the registry (${src.source_status})`);
      const tiers = CLASS_TIERS[r.rule_class];
      if (tiers && !tiers.includes(src.tier)) err(r, `rule_class ${r.rule_class} cannot come from a ${src.tier} source`);
      if (r.rule_class === "BEST_PRACTICE" && src.tier === "T4" && !/no higher-tier source/i.test(r.notes ?? "")) err(r, "T4 BEST_PRACTICE needs notes stating that no higher-tier source exists");
    }

    // scalar fields
    for (const k of ["title", "authority", "source_version", "description", "rationale", "applicability", "subcategory"]) if (k in r && !isStr(r[k])) err(r, `${k} must be a non-empty string`);
    if ("source_url" in r && !/^https?:\/\//.test(r.source_url ?? "")) err(r, "source_url must be an http(s) URL");
    if ("last_verified" in r && !DATE.test(r.last_verified ?? "")) err(r, "last_verified must be YYYY-MM-DD");
    if ("subcategory" in r && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(r.subcategory ?? "")) err(r, "subcategory must be kebab-case");
    const enumCheck = (k, list) => { if (k in r && !list.includes(r[k])) err(r, `invalid ${k} "${r[k]}"`); };
    enumCheck("source_status", E.sourceStatus);
    enumCheck("rule_class", E.ruleClass);
    enumCheck("category", E.category);
    enumCheck("normative_strength", E.strength);
    enumCheck("severity_hint", E.severity);
    enumCheck("status", E.status);
    if ("conformance_level" in r) {
      if (r.conformance_level !== null && !E.level.includes(r.conformance_level)) err(r, `invalid conformance_level "${r.conformance_level}"`);
      if (r.conformance_level !== null && !LEVELED.has(r.source)) err(r, "conformance_level must be null for a source without levels");
      if (r.conformance_level === null && LEVELED.has(r.source)) err(r, "conformance_level is required for this source");
    }
    if ("notes" in r && typeof r.notes !== "string") err(r, "notes must be a string");

    // lists
    if ("platforms" in r && (!isList(r.platforms) || !r.platforms.length || r.platforms.some((p) => !E.platform.includes(p)))) err(r, "platforms must be a non-empty list of web, pwa, ios, android, desktop, all");
    if ("jurisdictions" in r) {
      if (!isList(r.jurisdictions) || !r.jurisdictions.length || r.jurisdictions.some((j) => !/^([A-Z]{2}|EU|GLOBAL)$/.test(j))) err(r, "jurisdictions must be ISO 3166-1 alpha-2 codes, EU, or GLOBAL");
      else if (r.rule_class === "LEGAL" && r.jurisdictions.includes("GLOBAL")) err(r, "LEGAL rules must not use GLOBAL");
    }
    if ("exceptions" in r && (!isList(r.exceptions) || r.exceptions.some((x) => !isStr(x)))) err(r, "exceptions must be a list of non-empty strings");
    if ("expected_evidence" in r && (!isList(r.expected_evidence) || !r.expected_evidence.length || r.expected_evidence.some((x) => !E.evidence.includes(x)))) err(r, "expected_evidence must be a non-empty list of finding-schema evidence types");
    if ("testability" in r) {
      const t = r.testability;
      const keys = t && typeof t === "object" ? Object.keys(t).sort().join(",") : "";
      if (keys !== "automated,manual,visual" || !Object.values(t).every((v) => E.testability.includes(v))) err(r, "testability must be { automated, visual, manual } with FULL, PARTIAL, or NONE");
      else if (t.automated === "NONE" && t.visual === "NONE" && t.manual === "NONE") err(r, "at least one testability method must be above NONE");
    }
    if ("related_rules" in r && (!isList(r.related_rules) || r.related_rules.some((x) => !x || !isStr(x.id) || !E.relation.includes(x.relation) || Object.keys(x).length !== 2))) err(r, "related_rules items must be { id, relation }");
    if ("test_procedures" in r && (!isList(r.test_procedures) || r.test_procedures.some((x) => !x || x.type !== "act" || !/^[a-z0-9]{6}$/.test(x.id ?? "") || !E.actStatus.includes(x.status) || Object.keys(x).length !== 3))) err(r, "test_procedures items must be { type: act, id: six-character ACT id, status: approved or proposed }");
  }

  // cross-record: related rules resolve; equivalent is symmetric
  for (const r of records) {
    for (const rel of isList(r.related_rules) ? r.related_rules : []) {
      const target = byId.get(rel?.id);
      if (!target) { err(r, `related rule ${rel?.id} does not exist`); continue; }
      if (rel.relation === "equivalent" && !(target.related_rules ?? []).some((x) => x.id === r.id && x.relation === "equivalent")) err(r, `equivalent link to ${rel.id} is not symmetric`);
    }
  }
  return errors;
}

// ---------- self-test ----------
function selfTest() {
  const ctx = {
    sources: new Map([["SRC-X", { source_id: "SRC-X", tier: "T3", research_status: "VERIFIED", source_status: "CURRENT" }]]),
    prefixes: new Map([["X", "SRC-X"]]),
  };
  const good = { id: "X-1", title: "t", authority: "a", source: "SRC-X", source_url: "https://example.org/", source_version: "1", source_status: "CURRENT", last_verified: "2026-09-23", rule_class: "HEURISTIC", platforms: ["web"], jurisdictions: ["GLOBAL"], category: "accessibility", subcategory: "alt-text", conformance_level: null, normative_strength: "SHOULD", description: "d", rationale: "r", applicability: "a", exceptions: [], testability: { automated: "NONE", visual: "PARTIAL", manual: "FULL" }, expected_evidence: ["screenshot"], severity_hint: "Low", related_rules: [], status: "ACTIVE" };
  const cases = [
    ["valid record", [good], 0],
    ["unknown field", [{ ...good, extra: 1 }], 1],
    ["NORMATIVE from T3", [{ ...good, rule_class: "NORMATIVE" }], 1],
    ["level on unleveled source", [{ ...good, conformance_level: "AA" }], 1],
    ["dangling related rule", [{ ...good, related_rules: [{ id: "X-9", relation: "see_also" }] }], 1],
    ["asymmetric equivalent", [{ ...good, related_rules: [{ id: "X-2", relation: "equivalent" }] }, { ...good, id: "X-2" }], 1],
    ["bad evidence type", [{ ...good, expected_evidence: ["photo"] }], 1],
    ["bad ACT id", [{ ...good, test_procedures: [{ type: "act", id: "ABC", status: "approved" }] }], 1],
  ];
  let failed = 0;
  for (const [name, recs, want] of cases) {
    const got = validate(recs, ctx).length;
    const ok = want === 0 ? got === 0 : got >= want;
    if (!ok) { failed++; console.error(`self-test FAIL: ${name} (expected ${want ? "errors" : "no errors"}, got ${got})`); }
  }
  console.log(failed ? `check-registry self-test: ${failed} failure(s)` : `check-registry self-test: OK (${cases.length} cases)`);
  process.exit(failed ? 2 : 0);
}

// ---------- main ----------
if (process.argv.includes("--self-test")) selfTest();
else {
  const dir = join(ROOT, "registry");
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".json")).sort() : [];
  const records = [];
  const errors = [];
  for (const f of files) {
    try {
      const data = JSON.parse(readFileSync(join(dir, f), "utf8"));
      if (!isList(data)) errors.push(`registry/${f}: top level must be a JSON array of rule records`);
      else records.push(...data);
    } catch (e) {
      errors.push(`registry/${f}: invalid JSON (${e.message})`);
    }
  }
  errors.push(...validate(records, loadContext()));
  if (errors.length) {
    console.error(`check-registry: ${errors.length} problem(s) in ${records.length} rules`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(2);
  }
  console.log(`check-registry: OK (${records.length} rules in ${files.length} files)`);
}
