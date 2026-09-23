#!/usr/bin/env node
// Harness validator for the UI/UX Auto Tester repository (ADR 0004).
// Standard library only. Run from anywhere: `node scripts/check-harness.mjs`.
// Exit 0 when every check passes, 2 on any failure (2 lets it block as a Claude Code Stop hook).
// ponytail: tables are parsed by splitting on "|"; a "|" inside a cell shows up as a cell-count error.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
let checks = 0;
const check = (cond, msg) => {
  checks++;
  if (!cond) errors.push(msg);
};
const exists = (rel) => existsSync(join(ROOT, rel));
const read = (rel) => (exists(rel) ? readFileSync(join(ROOT, rel), "utf8") : "");

const VOCAB = {
  sourceStatus: ["CURRENT", "SUPERSEDED", "DRAFT", "DEPRECATED", "WITHDRAWN", "UNKNOWN"],
  sourceResearch: ["CANDIDATE", "IN_PROGRESS", "VERIFIED", "BLOCKED", "REJECTED"],
  coverageResearch: ["NOT_STARTED", "IN_PROGRESS", "PARTIAL", "COVERED", "BLOCKED", "DEFERRED"],
  normalization: ["NOT_STARTED", "IN_PROGRESS", "PARTIAL", "DONE", "BLOCKED"],
  tier: ["T1", "T2", "T3", "T4"],
  gapType: ["OPEN_QUESTION", "CONTRADICTION", "INCOMPLETE", "LICENSE", "ACCESS", "ASSUMPTION"],
  gapStatus: ["OPEN", "RESOLVED", "DEFERRED"],
  adrStatus: ["PROPOSED", "ACCEPTED", "SUPERSEDED", "REJECTED"],
};

const REQUIRED_FILES = [
  "CLAUDE.md",
  "prd.md",
  "README.md",
  ".gitignore",
  "docs/architecture.md",
  "docs/standards-research-plan.md",
  "docs/standards-coverage.md",
  "docs/rule-schema.md",
  "docs/finding-schema.md",
  "docs/audit-methodology.md",
  "docs/decisions/README.md",
  "research/sources.md",
  "research/ledger.md",
  "research/gaps.md",
  ".claude/agents/standards-researcher.md",
  ".claude/agents/research-reviewer.md",
  ".claude/commands/research-status.md",
  ".claude/commands/research-source.md",
  ".claude/settings.json.example",
];

const CLAUDE_MD_MAX_LINES = 200;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SOURCE_ID_RE = /^SRC-[A-Z0-9]+-[A-Z0-9-]+$/;
const DOMAIN_ID_RE = /^[A-Z0-9]+-[A-Z0-9-]+$/;
const GAP_ID_RE = /^GAP-\d{3}$/;
const UNSET = new Set(["", "—", "-", "none", "n/a", "unverified"]);

// docs/web-product is owned by a parallel stream that core sessions must not edit (ADR 0006); it is not validated here.
const SKIP_DIRS = new Set(["node_modules", ".git", "worktrees", "web-product"]);

// ---------- markdown helpers ----------
// Blank out fenced code blocks while keeping line numbers stable.
const blankFences = (md) => md.replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, ""));
const stripCode = (md) => blankFences(md).replace(/`[^`\n]*`/g, "");
const isRow = (l) => /^\s*\|.*\|\s*$/.test(l);
const isSeparator = (l) => /^\s*\|(\s*:?-{3,}:?\s*\|)+\s*$/.test(l);
const cells = (l) =>
  l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((s) => s.trim());

function parseTables(rel) {
  const lines = blankFences(read(rel)).split(/\r?\n/);
  const tables = [];
  for (let i = 0; i + 1 < lines.length; i++) {
    if (!isRow(lines[i]) || !isSeparator(lines[i + 1])) continue;
    const headers = cells(lines[i]);
    const rows = [];
    let j = i + 2;
    for (; j < lines.length && isRow(lines[j]); j++) {
      const c = cells(lines[j]);
      check(c.length === headers.length, `${rel}:${j + 1}: expected ${headers.length} cells, found ${c.length} (a "|" inside a cell?)`);
      const row = { __line: j + 1 };
      headers.forEach((h, k) => (row[h] = c[k] ?? ""));
      rows.push(row);
    }
    tables.push({ headers, rows });
    i = j - 1;
  }
  return tables;
}

const rowsWith = (rel, required) =>
  parseTables(rel)
    .filter((t) => required.every((h) => t.headers.includes(h)))
    .flatMap((t) => t.rows);

const isSet = (s) => !UNSET.has((s ?? "").trim().toLowerCase());
const splitIds = (s) =>
  (s ?? "")
    .split(/[,\s]+/)
    .map((x) => x.trim())
    .filter((x) => isSet(x));

function walkMarkdown(dirRel, out = []) {
  const abs = join(ROOT, dirRel);
  if (!existsSync(abs)) return out;
  for (const name of readdirSync(abs)) {
    if (SKIP_DIRS.has(name)) continue;
    const rel = posix.join(dirRel, name);
    if (statSync(join(ROOT, rel)).isDirectory()) walkMarkdown(rel, out);
    else if (name.endsWith(".md")) out.push(rel);
  }
  return out;
}

// ---------- 1. required files ----------
for (const f of REQUIRED_FILES) check(exists(f), `missing required file: ${f}`);

// ---------- 2. CLAUDE.md stays concise ----------
{
  const lines = read("CLAUDE.md").split(/\r?\n/).length;
  check(lines <= CLAUDE_MD_MAX_LINES, `CLAUDE.md has ${lines} lines; limit is ${CLAUDE_MD_MAX_LINES} (move detail into docs/)`);
}

// ---------- 3. markdown links and backtick path references resolve ----------
{
  const files = ["CLAUDE.md", "README.md", ...walkMarkdown("docs"), ...walkMarkdown("research"), ...walkMarkdown(".claude")];
  const LINK_RE = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  // Root-relative paths quoted in backticks, e.g. `docs/rule-schema.md`. Placeholders (<...>, *, NNNN) and non-md/mjs paths are skipped.
  const PATH_RE = /`((?:docs|research|scripts|\.claude)\/[^`\s]+|CLAUDE\.md|README\.md|prd\.md)`/g;
  for (const file of files) {
    const raw = read(file);
    for (const m of stripCode(raw).matchAll(LINK_RE)) {
      const target = m[1];
      if (/^(https?:|mailto:|#)/i.test(target)) continue;
      const path = decodeURIComponent(target.split("#")[0]);
      if (!path) continue;
      const abs = resolve(dirname(join(ROOT, file)), path);
      check(existsSync(abs), `${file}: broken link -> ${target}`);
    }
    for (const m of blankFences(raw).matchAll(PATH_RE)) {
      const p = m[1];
      if (/[<>*]|NNNN/.test(p) || !/\.(md|mjs)$/.test(p)) continue;
      check(exists(p), `${file}: referenced path \`${p}\` does not exist`);
    }
  }
}

// ---------- 4. source registry ----------
const sources = new Map();
{
  const rows = rowsWith("research/sources.md", ["source_id", "research_status", "source_status"]);
  check(rows.length > 0, "research/sources.md: no source table found");
  for (const r of rows) {
    const id = r.source_id;
    const at = `research/sources.md:${r.__line} (${id})`;
    check(SOURCE_ID_RE.test(id), `${at}: source_id does not match SRC-<AUTHORITY>-<SHORT>`);
    check(!sources.has(id), `${at}: duplicate source_id`);
    sources.set(id, r);
    check(VOCAB.tier.includes(r.tier), `${at}: invalid tier "${r.tier}"`);
    check(VOCAB.sourceStatus.includes(r.source_status), `${at}: invalid source_status "${r.source_status}"`);
    check(VOCAB.sourceResearch.includes(r.research_status), `${at}: invalid research_status "${r.research_status}"`);
    if (r.research_status === "VERIFIED") {
      check(DATE_RE.test(r.last_checked), `${at}: VERIFIED source needs last_checked as YYYY-MM-DD`);
      check(/^https?:\/\//.test(r.canonical_url), `${at}: VERIFIED source needs a canonical_url`);
      check(isSet(r.version), `${at}: VERIFIED source needs a version`);
      check(isSet(r.license), `${at}: VERIFIED source needs a recorded license or access restriction`);
      check(r.source_status !== "UNKNOWN", `${at}: VERIFIED source cannot have source_status UNKNOWN`);
      check(exists(`research/notes/${id}.md`), `${at}: VERIFIED source needs research/notes/${id}.md`);
    }
    if (r.source_status === "SUPERSEDED") {
      check(/superseded by SRC-/i.test(r.notes ?? ""), `${at}: SUPERSEDED source must name its successor in notes ("superseded by SRC-...")`);
    }
  }
}

// ---------- 5. coverage matrix ----------
const domains = new Map();
{
  const rows = rowsWith("docs/standards-coverage.md", ["domain_id", "research_status", "normalization_status"]);
  check(rows.length > 0, "docs/standards-coverage.md: no coverage table found");
  for (const r of rows) {
    const id = r.domain_id;
    const at = `docs/standards-coverage.md:${r.__line} (${id})`;
    check(DOMAIN_ID_RE.test(id), `${at}: invalid domain_id`);
    check(!domains.has(id), `${at}: duplicate domain_id`);
    domains.set(id, r);
    check(VOCAB.coverageResearch.includes(r.research_status), `${at}: invalid research_status "${r.research_status}"`);
    check(VOCAB.normalization.includes(r.normalization_status), `${at}: invalid normalization_status "${r.normalization_status}"`);
    const ids = splitIds(r.source_ids);
    for (const s of ids) check(sources.has(s), `${at}: unknown source_id ${s}`);
    const verified = ids.filter((s) => sources.get(s)?.research_status === "VERIFIED");
    if (r.research_status === "COVERED") {
      check(ids.length > 0 && verified.length === ids.length, `${at}: COVERED requires every listed source to be VERIFIED`);
    }
    if (r.research_status === "PARTIAL") {
      check(verified.length > 0, `${at}: PARTIAL requires at least one VERIFIED source`);
    }
    if (["BLOCKED", "PARTIAL", "DEFERRED"].includes(r.research_status)) {
      check((r.notes ?? "").trim() !== "", `${at}: ${r.research_status} requires a reason in notes`);
    }
    if (r.research_status === "DEFERRED") {
      check(/GAP-\d{3}/.test(r.notes ?? ""), `${at}: DEFERRED requires a gap ID in notes`);
    }
    if (r.normalization_status !== "NOT_STARTED") {
      check(["PARTIAL", "COVERED"].includes(r.research_status), `${at}: normalization cannot start before research is PARTIAL or COVERED`);
    }
  }
}

// ---------- 6. sources and coverage mirror each other ----------
for (const [sid, r] of sources) {
  const at = `research/sources.md:${r.__line} (${sid})`;
  for (const d of splitIds(r.domains)) {
    check(domains.has(d), `${at}: unknown domain ${d}`);
    if (domains.has(d)) {
      check(splitIds(domains.get(d).source_ids).includes(sid), `${at}: lists ${d}, but docs/standards-coverage.md row ${d} does not list ${sid}`);
    }
  }
}
for (const [did, r] of domains) {
  for (const s of splitIds(r.source_ids)) {
    if (!sources.has(s)) continue;
    check(splitIds(sources.get(s).domains).includes(did), `docs/standards-coverage.md:${r.__line} (${did}): lists ${s}, but research/sources.md row ${s} does not list ${did} in domains`);
  }
}

// ---------- 7. rule prefix registry points at known sources ----------
{
  const rows = rowsWith("docs/rule-schema.md", ["prefix", "source_id"]);
  check(rows.length > 0, "docs/rule-schema.md: no prefix registry table found");
  const seen = new Set();
  for (const r of rows) {
    const at = `docs/rule-schema.md:${r.__line} (${r.prefix})`;
    check(!seen.has(r.prefix), `${at}: duplicate prefix`);
    seen.add(r.prefix);
    if (r.source_id.toLowerCase() === "n/a") continue;
    check(sources.has(r.source_id), `${at}: unknown source_id ${r.source_id}`);
  }
}

// ---------- 8. gap tracker ----------
{
  const rows = rowsWith("research/gaps.md", ["gap_id", "type", "status"]);
  check(rows.length > 0, "research/gaps.md: no gap table found");
  const seen = new Set();
  for (const r of rows) {
    const at = `research/gaps.md:${r.__line} (${r.gap_id})`;
    check(GAP_ID_RE.test(r.gap_id), `${at}: invalid gap_id`);
    check(!seen.has(r.gap_id), `${at}: duplicate gap_id`);
    seen.add(r.gap_id);
    check(VOCAB.gapType.includes(r.type), `${at}: invalid type "${r.type}"`);
    check(VOCAB.gapStatus.includes(r.status), `${at}: invalid status "${r.status}"`);
    check(DATE_RE.test(r.raised), `${at}: raised must be YYYY-MM-DD`);
    if (r.status === "RESOLVED") check((r.resolution ?? "").trim() !== "", `${at}: RESOLVED gap needs a resolution`);
  }
}

// ---------- 9. decision records are indexed, well-formed, and consistent with the index ----------
{
  const dir = "docs/decisions";
  const indexRows = rowsWith(`${dir}/README.md`, ["ADR", "Title", "Status", "Date"]);
  const files = exists(dir) ? readdirSync(join(ROOT, dir)).filter((f) => /^\d{4}-.+\.md$/.test(f)) : [];
  const numbers = new Set();
  for (const f of files) {
    const num = f.slice(0, 4);
    check(!numbers.has(num), `${dir}/${f}: duplicate ADR number ${num}`);
    numbers.add(num);
    const body = read(`${dir}/${f}`);
    const status = body.match(/^- Status:\s*([A-Z_]+)/m)?.[1];
    const date = body.match(/^- Date:\s*(\S+)/m)?.[1];
    check(status && VOCAB.adrStatus.includes(status), `${dir}/${f}: missing or invalid "- Status:" line`);
    check(date && DATE_RE.test(date), `${dir}/${f}: missing or invalid "- Date:" line`);
    const row = indexRows.find((r) => r.ADR.includes(f));
    check(row, `${dir}/README.md: ADR ${f} is not listed in the index`);
    if (row) {
      check(row.Status === status, `${dir}/README.md: index status for ${f} is "${row.Status}", the file says "${status}"`);
      check(row.Date === date, `${dir}/README.md: index date for ${f} is "${row.Date}", the file says "${date}"`);
    }
  }
}

// ---------- 10. ledger structure and status-board counts ----------
{
  const ledger = read("research/ledger.md");
  for (const h of ["## Status board", "## Next actions", "## Session log"]) {
    check(ledger.includes(h), `research/ledger.md: missing section "${h}"`);
  }
  const board = rowsWith("research/ledger.md", ["Field", "Value"]);
  const countBy = (map, key) => {
    const c = {};
    for (const r of map.values()) c[r[key]] = (c[r[key]] ?? 0) + 1;
    return c;
  };
  const checkBoard = (field, actual, label) => {
    const row = board.find((r) => r.Field === field);
    check(row, `research/ledger.md: status board lacks a "${field}" row`);
    if (!row) return;
    const claimed = {};
    for (const m of row.Value.matchAll(/(\d+)\s+([A-Z_]+)/g)) claimed[m[2]] = Number(m[1]);
    for (const [status, n] of Object.entries(actual)) {
      check(claimed[status] === n, `research/ledger.md: status board says ${claimed[status] ?? 0} ${status} ${label}, actual ${n}`);
    }
    for (const [status, n] of Object.entries(claimed)) {
      if (!(status in actual)) check(n === 0, `research/ledger.md: status board says ${n} ${status} ${label}, actual 0`);
    }
  };
  checkBoard("Sources", countBy(sources, "research_status"), "sources");
  checkBoard("Domains", countBy(domains, "research_status"), "domains");
}

// ---------- 11. settings example is strict JSON ----------
{
  try {
    JSON.parse(read(".claude/settings.json.example"));
    checks++;
  } catch (e) {
    checks++;
    errors.push(`.claude/settings.json.example: invalid JSON (${e.message})`);
  }
}

// ---------- report ----------
if (errors.length) {
  console.error(`check-harness: ${errors.length} problem(s) in ${checks} checks`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(2);
}
console.log(`check-harness: OK (${checks} checks, ${sources.size} sources, ${domains.size} domains)`);
