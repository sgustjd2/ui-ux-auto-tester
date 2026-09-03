#!/usr/bin/env node
// Link and section-reference check for docs/web-product.
// ADR 0006 excludes this folder from scripts/check-harness.mjs, so the web stream validates its own documents.
// Standard library only. Run from anywhere: `node docs/web-product/check-links.mjs`. Exit 0 when clean, 2 on any problem.
// ponytail: regex-based; good enough for markdown links and "§n.n" references, not a markdown parser.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(DIR, "..", "..");
const CORE_DOCS = ["docs/finding-schema.md", "docs/rule-schema.md", "docs/audit-methodology.md", "docs/architecture.md", "prd.md"];

const files = readdirSync(DIR).filter((f) => f.endsWith(".md"));
const errors = [];
let links = 0;
let refs = 0;

const stripFences = (md) => md.replace(/```[\s\S]*?```/g, "");
const stripInline = (md) => md.replace(/`[^`\n]*`/g, "");
const headings = (path) =>
  new Set([...readFileSync(path, "utf8").matchAll(/^#{1,4}\s+(\d+(?:\.\d+)?|J\d+)\b/gm)].map((m) => m[1]));

const local = Object.fromEntries(files.map((f) => [f, headings(join(DIR, f))]));
const core = Object.fromEntries(CORE_DOCS.filter((f) => existsSync(join(ROOT, f))).map((f) => [f, headings(join(ROOT, f))]));

for (const file of files) {
  const raw = readFileSync(join(DIR, file), "utf8");
  const text = stripFences(raw);

  for (const m of stripInline(text).matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = m[1];
    if (/^(https?:|mailto:|#)/i.test(target)) continue;
    links++;
    const p = resolve(DIR, decodeURIComponent(target.split("#")[0]));
    if (!existsSync(p)) errors.push(`${file}: broken link -> ${target}`);
  }

  for (const m of text.matchAll(/`?([a-z-]+\.md)`?\)?\s+§(\d+(?:\.\d+)?)/g)) {
    const [, doc, sec] = m;
    if (!local[doc]) continue; // core docs are matched below by their docs/ path
    refs++;
    if (!local[doc].has(sec)) errors.push(`${file}: ${doc} §${sec} does not exist`);
  }

  for (const m of text.matchAll(/(docs\/[a-z-]+\.md)`?\)?\s+§(\d+(?:\.\d+)?)/g)) {
    const [, doc, sec] = m;
    if (!core[doc]) continue;
    refs++;
    if (!core[doc].has(sec)) errors.push(`${file}: ${doc} §${sec} does not exist`);
  }

  for (const m of text.matchAll(/root (?:PRD|`prd\.md`) §(\d+(?:\.\d+)?)/g)) {
    refs++;
    if (core["prd.md"] && !core["prd.md"].has(m[1])) errors.push(`${file}: prd.md §${m[1]} does not exist`);
  }
}

if (errors.length) {
  console.error(`check-links: ${errors.length} problem(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(2);
}
console.log(`check-links: OK (${files.length} files, ${links} links, ${refs} section references)`);
