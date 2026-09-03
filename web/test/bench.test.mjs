import { test } from "node:test";
import assert from "node:assert/strict";
import { percentile, runBenchmark, defaultSamples } from "../bench/latency.mjs";
import { createStore } from "../server/store.mjs";
import { createOrchestrator } from "../server/orchestrator.mjs";
import { createFixtureAdapter } from "../adapter/fixture-adapter.mjs";
import { makePng, tempDir } from "./helpers.mjs";

test("percentile uses nearest-rank and handles edges", () => {
  const xs = [10, 20, 30, 40, 50];
  assert.equal(percentile(xs, 50), 30);
  assert.equal(percentile(xs, 100), 50);
  assert.equal(percentile(xs, 0), 10);
  assert.equal(percentile([], 50), null);
  assert.equal(percentile([7], 95), 7);
});

test("defaultSamples yields at least 20 varied samples including Korean and English (W1-AC-14, W-R-10)", () => {
  const s = defaultSamples();
  assert.ok(s.length >= 20);
  const locales = new Set(s.map((x) => x.locale));
  assert.ok(locales.has("ko") && locales.has("en"));
  assert.ok(s.every((x) => Buffer.isBuffer(x.bytes) && x.bytes.length > 0));
});

test("runBenchmark completes every sample and reports per-locale percentiles", async () => {
  const orchestrator = createOrchestrator({ adapter: createFixtureAdapter(), store: createStore(tempDir()), cacheEnabled: false });
  const samples = [
    { bytes: makePng(390, 800), question: "Where would a user click?", locale: "en" },
    { bytes: makePng(414, 896), question: "이 화면은 무엇을 위한 것인가요?", locale: "ko" },
    { bytes: makePng(768, 1024), question: null, locale: "n/a" },
    { bytes: makePng(1280, 720), question: "혼란스러운 부분은?", locale: "ko" },
  ];
  const report = await runBenchmark({ orchestrator, samples, concurrency: 2 });
  assert.equal(report.total, 4);
  assert.equal(report.ok, 4);
  assert.equal(report.failed, 0);
  assert.equal(report.overall.count, 4);
  assert.ok(typeof report.overall.p50 === "number" && typeof report.overall.p95 === "number");
  assert.ok(report.by_locale.ko && report.by_locale.ko.count === 2, "Korean inputs completed");
  assert.ok(report.by_locale.en && report.by_locale.en.count === 1);
});
