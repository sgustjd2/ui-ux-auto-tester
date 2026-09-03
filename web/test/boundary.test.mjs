// Boundary rules (docs/web-product/architecture.md section 2.7): the UI and API layers carry no auditing intelligence.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const files = (dir) => readdirSync(join(ROOT, dir)).filter((f) => /\.(mjs|html|css)$/.test(f)).map((f) => join(dir, f));
const read = (rel) => readFileSync(join(ROOT, rel), "utf8");

const PROVIDER_PATTERNS = [/@anthropic-ai\//, /["']openai["']/, /@google\/generative/, /api\.openai\.com/, /api\.anthropic\.com/, /generativelanguage\.googleapis/];
const PROMPT_PATTERNS = [/\bYou are an?\b/i, /system prompt:/i, /prompt_template/i, /<<SYS>>/, /\bpersona_dimensions\s*[:=]\s*\{/];

test("web UI and API layers import no model provider SDKs and contain no prompts or persona definitions", () => {
  for (const rel of [...files("ui"), ...files("server"), ...files("shared")]) {
    const text = read(rel);
    for (const p of PROVIDER_PATTERNS) assert.ok(!p.test(text), `${rel} matches provider pattern ${p}`);
    for (const p of PROMPT_PATTERNS) assert.ok(!p.test(text), `${rel} matches prompt pattern ${p}`);
    assert.ok(!/fetch\(\s*["']https?:/.test(text), `${rel} must not call external services`);
  }
});

test("the UI imports nothing from the server, adapter, or fixtures", () => {
  for (const rel of files("ui")) {
    const text = read(rel);
    assert.ok(!/from\s+["']\.\.\/(server|adapter|fixtures)/.test(text), `${rel} crosses the UI boundary`);
    assert.ok(!/rules_index\s*=\s*\{/.test(text), `${rel} must not define rule metadata`);
  }
});

test("only the server composition root and tests touch the adapter", () => {
  const importsAdapter = (rel) => /from\s+["']\.\.\/adapter\//.test(read(rel));
  assert.ok(importsAdapter("server/server.mjs"));
  for (const rel of files("server").filter((f) => !f.endsWith("server.mjs"))) assert.ok(!importsAdapter(rel), `${rel} must go through the orchestrator's adapter argument`);
});
