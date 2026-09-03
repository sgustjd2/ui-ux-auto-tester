#!/usr/bin/env node
// Latency benchmark harness (W1-AC-14, WNFR-01/02). Runs a set of analyses end to end and reports p50/p95 wall
// time, so latency is measured and reported rather than assumed. Against the fixture core the numbers reflect
// harness overhead, not real inference; the value is the reusable harness (point it at the real core later) and
// the confirmation that the pipeline handles varied inputs — sizes, and Korean and English text (W-R-10) —
// without error. `runBenchmark` is pure enough to test; `main` wires a real fixture orchestrator and prints.

import { deflateSync, crc32 } from "node:zlib";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createStore } from "../server/store.mjs";
import { createOrchestrator } from "../server/orchestrator.mjs";
import { createFixtureAdapter } from "../adapter/fixture-adapter.mjs";

// Nearest-rank percentile over an unsorted array of numbers.
export function percentile(values, p) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.ceil((p / 100) * sorted.length);
  return sorted[Math.min(sorted.length - 1, Math.max(0, rank - 1))];
}

const summarize = (nums) => ({
  count: nums.length,
  min: nums.length ? Math.min(...nums) : null,
  p50: percentile(nums, 50),
  p95: percentile(nums, 95),
  max: nums.length ? Math.max(...nums) : null,
  mean: nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : null,
});

/**
 * Run each sample (an image + optional question) through the full create→upload→start→completed path, timing it.
 * @param {object} opts
 * @param {object} opts.orchestrator
 * @param {Array<{bytes:Buffer, question?:string, locale?:string}>} opts.samples
 * @param {number} [opts.concurrency=4]
 * @param {()=>number} [opts.clock=performance-ish]
 */
export async function runBenchmark({ orchestrator, samples, concurrency = 4, session_id = "bench", clock = () => Number(process.hrtime.bigint() / 1000000n) }) {
  const durations = [];
  const byLocale = {};
  let ok = 0;
  let failed = 0;

  const runOne = async (sample) => {
    const t0 = clock();
    try {
      const audit = await orchestrator.createAudit({ session_id, intent: { question: sample.question ?? null } });
      await orchestrator.attachArtifact(audit.audit_id, sample.bytes, { session_id });
      await orchestrator.start(audit.audit_id, { session_id });
      await orchestrator.whenDone(audit.audit_id);
      const status = await orchestrator.getStatus(audit.audit_id);
      const ms = clock() - t0;
      if (status.status === "COMPLETED") {
        ok++;
        durations.push(ms);
        const loc = sample.locale ?? "n/a";
        (byLocale[loc] ??= []).push(ms);
      } else {
        failed++;
      }
      return status.status;
    } catch {
      failed++;
      return "ERROR";
    }
  };

  // simple fixed-concurrency worker pool
  const queue = [...samples];
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (queue.length) await runOne(queue.shift());
  });
  await Promise.all(workers);

  return {
    total: samples.length,
    ok,
    failed,
    overall: summarize(durations),
    by_locale: Object.fromEntries(Object.entries(byLocale).map(([k, v]) => [k, summarize(v)])),
  };
}

// ---- standalone runner ----

// Minimal valid RGBA PNG of the given size (self-contained; no test dependency).
function makePng(width, height) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body) >>> 0);
    return Buffer.concat([len, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 6;
  const row = Buffer.alloc(1 + width * 4, 0x80); row[0] = 0;
  const raw = Buffer.concat(Array.from({ length: height }, () => row));
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

// A spread of realistic device sizes and English/Korean questions (W1-AC-14, W-R-10). At least 20 samples.
export function defaultSamples(n = 24) {
  const sizes = [[390, 844], [414, 896], [360, 800], [768, 1024], [1440, 900], [1280, 720]];
  const prompts = [
    { q: "Where would a first-time user click?", loc: "en" },
    { q: "What is confusing on this screen?", loc: "en" },
    { q: "처음 사용자는 어디를 누를까요?", loc: "ko" },
    { q: "이 화면에서 헷갈리는 부분은 무엇인가요?", loc: "ko" },
    { q: null, loc: "n/a" },
  ];
  const cache = new Map();
  return Array.from({ length: n }, (_, i) => {
    const [w, h] = sizes[i % sizes.length];
    // vary the pixels a little per index so hashes differ and every run actually executes (no cache reuse)
    const key = `${w}x${h}x${i}`;
    if (!cache.has(key)) cache.set(key, makePng(w, h + (i % 7)));
    const p = prompts[i % prompts.length];
    return { bytes: cache.get(key), question: p.q, locale: p.loc };
  });
}

export async function main() {
  const store = createStore(mkdtempSync(join(tmpdir(), "web-bench-")));
  const orchestrator = createOrchestrator({ adapter: createFixtureAdapter({ stageDelayMs: Number(process.env.BENCH_STAGE_DELAY_MS ?? 0) }), store, cacheEnabled: false });
  const samples = defaultSamples(Number(process.env.BENCH_N ?? 24));
  const started = Date.now();
  const report = await runBenchmark({ orchestrator, samples, concurrency: Number(process.env.BENCH_CONCURRENCY ?? 4) });
  const wall = Date.now() - started;

  const target = Number(process.env.BENCH_P50_TARGET_MS ?? 60000); // WNFR-01 p50 <= 60s (real core; trivially met by the fixture)
  const lines = [
    `Latency benchmark — ${report.total} analyses, ${report.ok} ok, ${report.failed} failed, ${wall} ms wall`,
    `  overall: p50 ${report.overall.p50} ms · p95 ${report.overall.p95} ms · min ${report.overall.min} · max ${report.overall.max} · mean ${report.overall.mean}`,
    ...Object.entries(report.by_locale).map(([loc, s]) => `  ${loc}: n=${s.count} p50 ${s.p50} ms p95 ${s.p95} ms`),
    `  WNFR-01 p50 <= ${target} ms: ${report.overall.p50 <= target ? "PASS" : "MISS (recorded as a risk, not hidden)"}`,
    report.failed ? `  WARNING: ${report.failed} analyses did not complete` : `  all analyses completed, including Korean and English inputs`,
  ];
  console.log(lines.join("\n"));
  return report.failed === 0 ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then((code) => process.exit(code)).catch((e) => { console.error(e); process.exit(1); });
}
