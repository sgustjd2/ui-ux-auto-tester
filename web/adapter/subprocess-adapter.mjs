// Subprocess CLI binding of the Audit Core adapter (docs/web-product/audit-core-contract.md sections 3.2, 3.3).
// It spawns a core process that speaks the NDJSON protocol and exposes the same describe/plan/run interface as
// the in-process fixture adapter, so the orchestrator is unchanged whichever binding is used. This is the seam a
// real core (in any language) plugs into: it only has to implement the CLI protocol in reference-core-cli.mjs.
//
// Contract note: describe() is synchronous (the orchestrator reads capabilities at construction), so it runs the
// core's `describe` command once, blocking, and caches the result. run() is fully streamed and cancellable.

import { spawn, execFileSync } from "node:child_process";

// Static default so plan() stays synchronous; the authoritative plan arrives as the first `plan` run event.
const DEFAULT_STAGES = ["intake", "visual", "personas", "standards", "report"];

class LineSplitter {
  constructor() { this.buf = ""; }
  push(chunk) {
    this.buf += chunk;
    const lines = this.buf.split("\n");
    this.buf = lines.pop(); // keep the partial last line
    return lines.filter((l) => l.length);
  }
}

/**
 * @param {object} opts
 * @param {string} opts.command executable to run (e.g. process.execPath)
 * @param {string[]} [opts.args] leading args before the subcommand (e.g. [pathToCli])
 * @param {number} [opts.describeTimeoutMs=10000]
 * @param {number} [opts.runTimeoutMs=0] 0 = no adapter-level timeout (the orchestrator enforces the budget via signal)
 */
export function createSubprocessAdapter({ command, args = [], describeTimeoutMs = 10_000, runTimeoutMs = 0 }) {
  if (!command) throw new Error("createSubprocessAdapter needs a command");

  // Cache capabilities from a one-shot `describe` at construction so describe() can be synchronous.
  const capsRaw = execFileSync(command, [...args, "describe"], { timeout: describeTimeoutMs, maxBuffer: 4 * 1024 * 1024, encoding: "utf8" });
  const capabilities = JSON.parse(capsRaw);

  function run(request, sink, signal) {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) return reject(Object.assign(new Error("cancelled"), { code: "cancelled" }));
      const child = spawn(command, [...args, "run", "--events", "-"], { stdio: ["pipe", "pipe", "pipe"] });
      const splitter = new LineSplitter();
      let completed = null;
      let failed = null;
      let stderr = "";
      let chain = Promise.resolve(); // serialize sink handling; preserve event order and honor backpressure
      let settled = false;
      const timer = runTimeoutMs > 0 ? setTimeout(() => child.kill("SIGTERM"), runTimeoutMs) : null;

      const onAbort = () => child.kill("SIGTERM");
      signal?.addEventListener("abort", onAbort, { once: true });

      const finish = (fn) => {
        if (settled) return;
        settled = true;
        if (timer) clearTimeout(timer);
        signal?.removeEventListener("abort", onAbort);
        chain.then(fn, fn); // run resolution/rejection after queued sink handlers drain
      };

      child.stdout.setEncoding("utf8");
      child.stdout.on("data", (chunk) => {
        for (const line of splitter.push(chunk)) {
          let event;
          try { event = JSON.parse(line); } catch { continue; } // ignore non-JSON noise on stdout
          if (event.event === "completed") completed = event.result;
          else if (event.event === "failed") failed = event.error;
          chain = chain.then(() => sink(event)).catch(() => {}); // a sink error must not wedge the stream
        }
      });
      child.stderr.setEncoding("utf8");
      child.stderr.on("data", (c) => { stderr += c; if (stderr.length > 8192) stderr = stderr.slice(-8192); });

      child.on("error", (err) => finish(() => reject(Object.assign(new Error("core process could not start"), { code: "core_unavailable", cause: err }))));
      child.on("close", (code, sigResult) => {
        if (signal?.aborted) return finish(() => reject(Object.assign(new Error("cancelled"), { code: "cancelled" })));
        if (completed) return finish(() => resolve(completed));
        if (failed) return finish(() => reject(Object.assign(new Error(failed.message ?? "core failed"), { code: failed.code ?? "internal" })));
        return finish(() => reject(Object.assign(new Error(`core exited without a result (code ${code}${sigResult ? `, ${sigResult}` : ""})`), { code: "internal" })));
      });

      // Send the request and close stdin so the core can start.
      child.stdin.on("error", () => {}); // EPIPE if the core dies early; the close handler reports the real cause
      child.stdin.write(JSON.stringify(request));
      child.stdin.end();
    });
  }

  return {
    describe: () => structuredClone(capabilities),
    plan: () => ({ stages: DEFAULT_STAGES }),
    run,
  };
}
