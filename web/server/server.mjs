#!/usr/bin/env node
// HTTP server for the web product (product API, docs/web-product/audit-core-contract.md section 3.1, plus static UI).
// Standard library only. Run: `node web/server/server.mjs` and open http://localhost:3000.
// Environment: PORT (3000), WEB_DATA_DIR (OS temp dir), WEB_FIXTURE (quick-review), WEB_STAGE_DELAY_MS (1500),
// WEB_RETENTION_DAYS (7), WEB_SECURE_COOKIES (set to 1 behind HTTPS).

import http from "node:http";
import { promises as fs } from "node:fs";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import { createStore, DEFAULT_DATA_DIR } from "./store.mjs";
import { createLogger } from "./log.mjs";
import { createOrchestrator, ApiError } from "./orchestrator.mjs";
import { createFixtureAdapter } from "../adapter/fixture-adapter.mjs";
import { createSubprocessAdapter } from "../adapter/subprocess-adapter.mjs";
import { UploadError, LIMITS } from "./uploads.mjs";

const UI_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..", "ui");
const SHARED_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..", "shared");
const CONTENT_TYPES = { ".html": "text/html; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml" };
const JSON_LIMIT = 64 * 1024;

const SECURITY_HEADERS = {
  "Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' blob:; connect-src 'self'; font-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cache-Control": "no-store",
};

function parseCookies(header = "") {
  const out = {};
  for (const part of header.split(";")) { const i = part.indexOf("="); if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim(); }
  return out;
}

function readBody(req, limit) {
  return new Promise((resolvePromise, reject) => {
    const declared = Number(req.headers["content-length"] ?? 0);
    if (declared > limit) { req.resume(); return reject(new UploadError("too_large", `Body exceeds ${limit} bytes`)); }
    const chunks = []; let size = 0;
    req.on("data", (c) => { size += c.length; if (size > limit) { req.destroy(); reject(new UploadError("too_large", `Body exceeds ${limit} bytes`)); } else chunks.push(c); });
    req.on("end", () => resolvePromise(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// ponytail: fixed-window per-IP limiter in memory; replace with a shared store when there is more than one process.
function createRateLimiter({ windowMs = 60_000, mutations = 60, uploads = 20 } = {}) {
  const buckets = new Map();
  return (ip, kind) => {
    const nowMs = Date.now();
    let b = buckets.get(ip);
    if (!b || nowMs - b.start > windowMs) { b = { start: nowMs, mutations: 0, uploads: 0 }; buckets.set(ip, b); }
    b[kind] += 1;
    if (buckets.size > 10_000) buckets.clear();
    return b[kind] <= (kind === "uploads" ? uploads : mutations);
  };
}

export function createServer({ orchestrator, uiDir = UI_DIR, sharedDir = SHARED_DIR, secureCookies = false, rateLimiter = createRateLimiter(), log = createLogger({ level: "silent" }) } = {}) {
  const send = (res, status, body, headers = {}) => {
    const payload = body === undefined ? "" : typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body);
    res.writeHead(status, { ...SECURITY_HEADERS, "Content-Type": headers["Content-Type"] ?? (typeof payload === "string" && !headers["Content-Type"] ? "application/json; charset=utf-8" : "application/octet-stream"), ...headers, "Content-Length": Buffer.byteLength(payload) });
    res.end(payload);
  };
  const sendError = (res, status, code, message) => send(res, status, { error: { code, message } });

  async function sendFile(res, root, rel) {
    const file = resolve(root, rel);
    if (file !== root && !file.startsWith(root + sep)) return sendError(res, 404, "not_found", "Not found"); // no path traversal
    try {
      const bytes = await fs.readFile(file);
      // ponytail: no content hashing yet, so revalidate every load to avoid stale modules; add hashed filenames + long max-age in production.
      send(res, 200, bytes, { "Content-Type": CONTENT_TYPES[extname(file)] ?? "application/octet-stream", "Cache-Control": "no-cache" });
    } catch { sendError(res, 404, "not_found", "Not found"); }
  }

  async function serveStatic(res, urlPath) {
    if (urlPath === "/" || urlPath.startsWith("/a/") || urlPath.startsWith("/s/") || urlPath.startsWith("/projects/") || urlPath.startsWith("/compare/")) return sendFile(res, uiDir, "index.html");
    if (urlPath.startsWith("/ui/")) return sendFile(res, uiDir, urlPath.slice(4));
    if (urlPath.startsWith("/shared/")) return sendFile(res, sharedDir, urlPath.slice(8)); // client+server shared modules
    return sendError(res, 404, "not_found", "Not found");
  }

  const server = http.createServer(async (req, res) => {
    const startedMs = Date.now();
    const url = new URL(req.url, "http://localhost");
    const path = url.pathname;
    res.on("finish", () => log.debug("request", { method: req.method, path, status: res.statusCode, ms: Date.now() - startedMs })); // path only, never the query values
    const ip = req.socket.remoteAddress ?? "unknown";
    const cookies = parseCookies(req.headers.cookie);
    let sid = cookies.sid;
    const setCookie = [];
    if (!sid || !/^[A-Za-z0-9_-]{22,}$/.test(sid)) {
      sid = randomBytes(16).toString("base64url");
      setCookie.push(`sid=${sid}; HttpOnly; SameSite=Strict; Path=/${secureCookies ? "; Secure" : ""}; Max-Age=${30 * 86400}`);
    }
    if (setCookie.length) res.setHeader("Set-Cookie", setCookie);

    try {
      if (!path.startsWith("/api/")) {
        if (req.method !== "GET" && req.method !== "HEAD") return sendError(res, 405, "method_not_allowed", "Method not allowed");
        return await serveStatic(res, path);
      }

      const mutating = req.method === "POST" || req.method === "DELETE";
      if (mutating) {
        // CSRF: a custom header forces a CORS preflight that this server never answers; cross-site fetch is blocked.
        if (req.headers["x-web-client"] !== "1") return sendError(res, 403, "forbidden", "Missing X-Web-Client header");
        const site = req.headers["sec-fetch-site"];
        if (site && site !== "same-origin" && site !== "none") return sendError(res, 403, "forbidden", "Cross-site request rejected");
        const isUpload = /\/artifacts$/.test(path);
        if (!rateLimiter(ip, isUpload ? "uploads" : "mutations")) return sendError(res, 429, "rate_limited", "Too many requests; try again in a minute");
      }

      if (path === "/api/capabilities" && req.method === "GET") return send(res, 200, orchestrator.capabilities());

      // Compare any two finished analyses side by side (W5).
      if (path === "/api/compare" && req.method === "GET") {
        const a = url.searchParams.get("a"), b = url.searchParams.get("b");
        if (!a || !b) return sendError(res, 400, "invalid_input", "Two analysis ids are required");
        return send(res, 200, await orchestrator.getPairComparison(a, b));
      }

      // Public share endpoints by token: resolve the report, its screenshots, and its comment threads.
      const shareM = path.match(/^\/api\/shares\/([^/]+)(?:\/(media|comments)(?:\/([^/]+))?)?$/);
      if (shareM) {
        const [, token, sub, arg] = shareM;
        if (sub === "media") {
          if (req.method !== "GET") return sendError(res, 405, "method_not_allowed", "Method not allowed");
          const { bytes, media_type } = await orchestrator.getShareArtifact(token, arg);
          return send(res, 200, bytes, { "Content-Type": media_type, "Cache-Control": "private, no-store", "Content-Disposition": "inline" });
        }
        if (sub === "comments") {
          if (req.method === "GET") return send(res, 200, { comments: await orchestrator.listShareComments(token, { session_id: sid }) });
          if (req.method === "POST") { const body = JSON.parse((await readBody(req, JSON_LIMIT)).toString("utf8") || "{}"); return send(res, 201, await orchestrator.addShareComment(token, { issue_id: body.issue_id, body: body.body, author_name: body.author_name, session_id: sid })); }
          if (req.method === "DELETE" && arg) { await orchestrator.deleteShareComment(token, arg, { session_id: sid }); return send(res, 204); }
          return sendError(res, 405, "method_not_allowed", "Method not allowed");
        }
        if (req.method !== "GET") return sendError(res, 405, "method_not_allowed", "Method not allowed");
        return send(res, 200, await orchestrator.resolveShare(token));
      }

      if (path === "/api/audits" && req.method === "POST") {
        const body = JSON.parse((await readBody(req, JSON_LIMIT)).toString("utf8") || "{}");
        const links = typeof body.retest_of === "string" ? { retest_of: body.retest_of } : {};
        const audit = await orchestrator.createAudit({ analysis_type: body.analysis_type, intent: body.intent ?? {}, options: body.options ?? {}, session_id: sid, idempotency_key: typeof body.idempotency_key === "string" ? body.idempotency_key.slice(0, 64) : null, links });
        return send(res, 201, audit);
      }

      const m = path.match(/^\/api\/audits\/([^/]+)(?:\/([a-z]+)(?:\/([^/]+))?)?$/);
      if (!m) return sendError(res, 404, "not_found", "Not found");
      const [, auditId, action, sub] = m;

      if (!action) {
        if (req.method === "GET") return send(res, 200, await orchestrator.getStatus(auditId));
        if (req.method === "DELETE") { await orchestrator.remove(auditId, { session_id: sid }); return send(res, 204); }
      }
      if (action === "artifacts" && req.method === "POST") {
        const bytes = await readBody(req, LIMITS.maxBytes);
        return send(res, 201, await orchestrator.attachArtifact(auditId, bytes, { session_id: sid, label: url.searchParams.get("label") }));
      }
      if (action === "comments") {
        if (req.method === "GET") return send(res, 200, { comments: await orchestrator.listComments(auditId, { session_id: sid }) });
        if (req.method === "POST") { const body = JSON.parse((await readBody(req, JSON_LIMIT)).toString("utf8") || "{}"); return send(res, 201, await orchestrator.addComment(auditId, { issue_id: body.issue_id, body: body.body, author_name: body.author_name, session_id: sid })); }
        if (req.method === "DELETE" && sub) { await orchestrator.deleteComment(auditId, sub, { session_id: sid }); return send(res, 204); }
      }
      if (action === "shares") {
        if (req.method === "POST") { const body = JSON.parse((await readBody(req, JSON_LIMIT)).toString("utf8") || "{}"); return send(res, 201, await orchestrator.createShare(auditId, { session_id: sid, expires_in_days: Number(body.expires_in_days) || null })); }
        if (req.method === "GET") return send(res, 200, { shares: await orchestrator.listShares(auditId, { session_id: sid }) });
        if (req.method === "DELETE" && sub) { await orchestrator.revokeShare(auditId, sub, { session_id: sid }); return send(res, 204); }
      }
      if (action === "start" && req.method === "POST") return send(res, 202, await orchestrator.start(auditId, { session_id: sid }));
      if (action === "cancel" && req.method === "POST") return send(res, 200, await orchestrator.cancel(auditId, { session_id: sid }));
      if (action === "rerun" && req.method === "POST") {
        const body = JSON.parse((await readBody(req, JSON_LIMIT)).toString("utf8") || "{}");
        return send(res, 201, await orchestrator.rerun(auditId, body, { session_id: sid }));
      }
      if (action === "events" && req.method === "GET") return send(res, 200, { events: await orchestrator.getEvents(auditId, Number(url.searchParams.get("since") ?? 0)) });
      if (action === "result" && req.method === "GET") return send(res, 200, await orchestrator.getResult(auditId));
      if (action === "comparison" && req.method === "GET") return send(res, 200, await orchestrator.getComparison(auditId));
      if (action === "export" && req.method === "GET") {
        const { mime, content, filename } = await orchestrator.exportReport(auditId, url.searchParams.get("format") || "md");
        return send(res, 200, content, { "Content-Type": mime, "Content-Disposition": `attachment; filename="${filename}"`, "Cache-Control": "no-store" });
      }
      if (action === "media" && sub && req.method === "GET") {
        const { bytes, media_type } = await orchestrator.getArtifact(auditId, sub);
        return send(res, 200, bytes, { "Content-Type": media_type, "Cache-Control": "private, no-store", "Content-Disposition": "inline" });
      }
      return sendError(res, 404, "not_found", "Not found");
    } catch (err) {
      if (err instanceof ApiError || err instanceof UploadError) return sendError(res, err.status ?? 400, err.code, err.message);
      if (err instanceof SyntaxError) return sendError(res, 400, "invalid_input", "Malformed JSON");
      log.error("request_error", { method: req.method, path, code: err.code ?? err.name }); // no request content in logs
      return sendError(res, 500, "internal", "Internal error");
    }
  });
  return server;
}

// WEB_CORE selects the Audit Core binding: "fixture" (in-process, default) or "subprocess" (CLI protocol).
// For subprocess, WEB_CORE_CMD overrides the executable and WEB_CORE_ARGS (comma-separated) its leading args;
// the default runs the reference core CLI, which serves fixture data over the real wire protocol.
function buildAdapter() {
  const kind = process.env.WEB_CORE || "fixture";
  const fixture = process.env.WEB_FIXTURE || "quick-review";
  const stageDelayMs = Number(process.env.WEB_STAGE_DELAY_MS ?? 1500);
  if (kind === "subprocess") {
    const referenceCli = resolve(dirname(fileURLToPath(import.meta.url)), "..", "adapter", "reference-core-cli.mjs");
    const command = process.env.WEB_CORE_CMD || process.execPath;
    const args = process.env.WEB_CORE_ARGS ? process.env.WEB_CORE_ARGS.split(",") : [referenceCli, "--fixture", fixture, "--stage-delay-ms", String(stageDelayMs)];
    return { adapter: createSubprocessAdapter({ command, args }), label: `subprocess (${command})` };
  }
  return { adapter: createFixtureAdapter({ fixture, stageDelayMs }), label: "fixture (in-process)" };
}

export function main() {
  const dataDir = process.env.WEB_DATA_DIR || DEFAULT_DATA_DIR;
  const log = createLogger({ level: process.env.WEB_LOG_LEVEL || "info" });
  const store = createStore(dataDir);
  const { adapter, label } = buildAdapter();
  const orchestrator = createOrchestrator({ adapter, store, retentionDays: Number(process.env.WEB_RETENTION_DAYS ?? 7), cacheEnabled: process.env.WEB_CACHE !== "0", log });
  const server = createServer({ orchestrator, secureCookies: process.env.WEB_SECURE_COOKIES === "1", log });
  const port = Number(process.env.PORT ?? 3000);
  const sweep = setInterval(() => {
    orchestrator.sweepExpired().then((n) => n && log.info("retention_swept", { removed: n })).catch((e) => log.error("retention_sweep_failed", { code: e.code ?? e.name }));
    orchestrator.sweepCache().then((n) => n && log.info("cache_swept", { removed: n })).catch((e) => log.error("cache_sweep_failed", { code: e.code ?? e.name }));
  }, 10 * 60_000);
  sweep.unref();
  orchestrator.sweepExpired().catch(() => {});
  orchestrator.sweepCache().catch(() => {});
  server.listen(port, "127.0.0.1", () => log.info("listening", { port, data_dir: dataDir, core: label }));
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
