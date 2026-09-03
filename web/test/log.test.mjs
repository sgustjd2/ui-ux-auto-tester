import { test } from "node:test";
import assert from "node:assert/strict";
import { createLogger, nullLogger } from "../server/log.mjs";

const capture = (level = "debug") => { const lines = []; return { log: createLogger({ level, write: (l) => lines.push(l), now: () => 0 }), lines }; };

test("logs are JSON lines with a timestamp, level, and event", () => {
  const { log, lines } = capture();
  log.info("audit_started", { audit_id: "aud_1", screens: 2 });
  const rec = JSON.parse(lines[0]);
  assert.equal(rec.event, "audit_started");
  assert.equal(rec.level, "info");
  assert.equal(rec.audit_id, "aud_1");
  assert.equal(rec.screens, 2);
  assert.ok(rec.ts);
});

test("sensitive field names are redacted as defense in depth", () => {
  const { log, lines } = capture();
  log.info("x", { audit_id: "aud_1", question: "my secret question", title: "finding title", body: "comment text", ok: "kept" });
  const rec = JSON.parse(lines[0]);
  assert.equal(rec.question, "[redacted]");
  assert.equal(rec.title, "[redacted]");
  assert.equal(rec.body, "[redacted]");
  assert.equal(rec.ok, "kept");
  assert.ok(!lines[0].includes("my secret question"));
});

test("level gates output: silent is quiet, info drops debug", () => {
  const silent = capture("silent");
  silent.log.info("e", {}); silent.log.error("e", {});
  assert.equal(silent.lines.length, 0);

  const info = capture("info");
  info.log.debug("d", {}); info.log.info("i", {}); info.log.error("e", {});
  assert.deepEqual(info.lines.map((l) => JSON.parse(l).level), ["info", "error"]);
});

test("nullLogger is a no-op", () => {
  assert.doesNotThrow(() => { nullLogger.info("e", { a: 1 }); nullLogger.error("e"); nullLogger.debug("e"); });
});
