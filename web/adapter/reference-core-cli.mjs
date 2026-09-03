#!/usr/bin/env node
// Reference Audit Core CLI — the executable specification of the subprocess transport in
// docs/web-product/audit-core-contract.md section 3.3. It is a STUB that serves fixture data, not the real
// auditing intelligence; a real core replaces it by speaking the same protocol:
//
//   <cli> describe                          -> prints the CapabilityDescriptor as JSON on stdout, exits 0
//   <cli> run [--fixture <name>] [--stage-delay-ms N] [--artifacts <dir>]
//                                           -> reads one AuditRequest as JSON on stdin, streams NDJSON events
//                                              on stdout (one JSON object per line), the last being
//                                              {"event":"completed","result":<ResultEnvelope>}; exits 0.
//                                              On failure emits {"event":"failed",...} and exits non-zero.
//                                              SIGTERM cancels: stop promptly and exit non-zero.
//
// The wire format is the Event shape in contract section 4.4. Artifacts are passed by directory so a real core
// can resolve the `store://` URIs in the request; this stub ignores them (it already holds fixture pixels' worth).

import { CAPABILITIES, loadFixture, bindFixture, streamEnvelope, fixtureForRequest } from "./fixture-adapter.mjs";

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) out[a.slice(2)] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
    else out._.push(a);
  }
  return out;
}

const readStdin = () =>
  new Promise((resolve, reject) => {
    const chunks = [];
    process.stdin.on("data", (c) => chunks.push(c));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    process.stdin.on("error", reject);
  });

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0];

  if (cmd === "describe") {
    process.stdout.write(JSON.stringify(CAPABILITIES));
    return 0;
  }

  if (cmd === "run") {
    const controller = new AbortController();
    process.on("SIGTERM", () => controller.abort("cancelled"));
    process.on("SIGINT", () => controller.abort("cancelled"));
    const requestText = await readStdin();
    let request;
    try { request = JSON.parse(requestText); } catch { process.stderr.write("invalid request JSON\n"); return 2; }
    const configured = args.fixture && args.fixture !== "auto" ? args.fixture : "quick-review";
    const env = bindFixture(loadFixture(fixtureForRequest(request, configured)), request);
    // Serialize writes so lines never interleave; backpressure honored via the callback promise.
    const write = (event) => new Promise((res, rej) => process.stdout.write(JSON.stringify(event) + "\n", (e) => (e ? rej(e) : res())));
    try {
      await streamEnvelope(env, write, { stageDelayMs: Number(args["stage-delay-ms"] ?? 0), failAtStage: args["fail-at-stage"] || null, signal: controller.signal });
      return 0;
    } catch (err) {
      if (!controller.signal.aborted) await write({ event: "failed", audit_id: env.audit_id, error: { code: err.code ?? "internal", message: "reference core failure", retryable: false } }).catch(() => {});
      return controller.signal.aborted ? 130 : 1;
    }
  }

  process.stderr.write(`unknown command: ${cmd ?? "(none)"}\nusage: describe | run [--fixture <name>] [--stage-delay-ms N]\n`);
  return 2;
}

main().then((code) => process.exit(code)).catch((err) => { process.stderr.write(`${err.name}: ${err.message}\n`); process.exit(1); });
