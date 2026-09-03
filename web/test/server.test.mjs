import { test, after, before } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "../server/server.mjs";
import { createStore } from "../server/store.mjs";
import { createOrchestrator } from "../server/orchestrator.mjs";
import { createFixtureAdapter } from "../adapter/fixture-adapter.mjs";
import { makePng, tempDir, sleep, SVG_BYTES } from "./helpers.mjs";

let server; let base; let orchestrator;
const jar = new Map(); // name -> cookie value per "browser"

function client(name = "alice") {
  return async (method, path, { json, body, headers = {}, raw = false } = {}) => {
    const h = { ...headers };
    if (method !== "GET" && !("x-web-client" in h) && !raw) h["x-web-client"] = "1";
    if (json) h["content-type"] = "application/json";
    if (jar.get(name)) h.cookie = `sid=${jar.get(name)}`;
    const res = await fetch(base + path, { method, headers: h, body: json ? JSON.stringify(json) : body });
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) { const m = setCookie.match(/sid=([^;]+)/); if (m) jar.set(name, m[1]); }
    const ctype = res.headers.get("content-type") ?? "";
    const data = res.status === 204 ? null : ctype.includes("json") ? await res.json() : Buffer.from(await res.arrayBuffer());
    return { status: res.status, headers: res.headers, data };
  };
}

before(async () => {
  const store = createStore(tempDir());
  orchestrator = createOrchestrator({ adapter: createFixtureAdapter({ stageDelayMs: 0 }), store });
  server = createServer({ orchestrator });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise((r) => server.close(r)));

test("capabilities and security headers", async () => {
  const c = client();
  const res = await c("GET", "/api/capabilities");
  assert.equal(res.status, 200);
  assert.ok(res.data.analysis_types.includes("QUICK_REVIEW"));
  assert.equal(res.data.web_limits.retention_days, 7);
  assert.ok(res.headers.get("content-security-policy").includes("script-src 'self'"));
  assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  assert.ok(/HttpOnly/.test(res.headers.get("set-cookie") ?? "") && /SameSite=Strict/.test(res.headers.get("set-cookie") ?? ""));
});

test("mutations require the client header; static files are served without traversal", async () => {
  const c = client();
  const denied = await c("POST", "/api/audits", { json: {}, raw: true });
  assert.equal(denied.status, 403);
  const home = await c("GET", "/");
  assert.equal(home.status, 200);
  assert.ok(home.data.toString().includes("<title>UI/UX Auto Tester</title>"));
  const deep = await c("GET", "/a/aud_anything");
  assert.equal(deep.status, 200, "analysis routes serve the app shell");
  assert.equal((await c("GET", "/projects/prj_abc")).status, 200, "project routes serve the app shell");
  const js = await c("GET", "/ui/app.mjs");
  assert.equal(js.status, 200);
  assert.ok(js.headers.get("content-type").includes("javascript"));
  const shared = await c("GET", "/shared/export.mjs"); // the UI imports this; it must be served
  assert.equal(shared.status, 200);
  assert.ok(shared.headers.get("content-type").includes("javascript"));
  for (const p of ["/ui/%2e%2e/server/server.mjs", "/ui/..%2fserver%2fserver.mjs", "/server/server.mjs", "/ui/../../prd.md", "/shared/../server/orchestrator.mjs"]) {
    const r = await c("GET", p);
    assert.equal(r.status, 404, `${p} must not be served`);
  }
});

test("upload validation over HTTP: bad files are rejected and nothing is attached", async () => {
  const c = client();
  const audit = (await c("POST", "/api/audits", { json: { analysis_type: "QUICK_REVIEW" } })).data;
  const svg = await c("POST", `/api/audits/${audit.audit_id}/artifacts`, { body: SVG_BYTES, headers: { "content-type": "image/png" } });
  assert.equal(svg.status, 400);
  assert.equal(svg.data.error.code, "invalid_type");
  const big = await fetch(`${base}/api/audits/${audit.audit_id}/artifacts`, { method: "POST", headers: { "x-web-client": "1", cookie: `sid=${jar.get("alice")}`, "content-type": "image/png", "content-length": String(50 * 1024 * 1024) }, body: makePng(100, 100), duplex: "half" }).catch(() => null);
  if (big) assert.equal(big.status, 413);
  const status = (await c("GET", `/api/audits/${audit.audit_id}`)).data;
  assert.equal(status.screens.length, 0, "no screen was attached by a rejected upload");
  const start = await c("POST", `/api/audits/${audit.audit_id}/start`);
  assert.equal(start.status, 400);
  assert.equal(start.data.error.code, "no_target");
});

test("end-to-end: create, upload, start, poll, result, media, events, delete → 404", async () => {
  const c = client();
  const audit = (await c("POST", "/api/audits", { json: { analysis_type: "QUICK_REVIEW", intent: { question: "What is confusing here?" }, options: { device_hint: "mobile" } } })).data;
  assert.equal(audit.status, "QUEUED");
  const up = await c("POST", `/api/audits/${audit.audit_id}/artifacts`, { body: makePng(390, 844, { text: "internal build 42" }), headers: { "content-type": "image/png" } });
  assert.equal(up.status, 201);
  assert.equal(up.data.width, 390);
  const started = await c("POST", `/api/audits/${audit.audit_id}/start`);
  assert.equal(started.status, 202);
  let status;
  for (let i = 0; i < 200; i++) {
    status = (await c("GET", `/api/audits/${audit.audit_id}`)).data;
    if (["COMPLETED", "FAILED", "CANCELLED"].includes(status.status)) break;
    await sleep(25);
  }
  assert.equal(status.status, "COMPLETED");
  const result = (await c("GET", `/api/audits/${audit.audit_id}/result`)).data;
  assert.equal(result.status, "COMPLETED");
  assert.ok(result.result.findings.every((f) => f.presentation && ["VIOLATION", "UX_RISK", "USER_SIGNAL"].includes(f.finding_type)));
  assert.equal(result.result.intent.question, "What is confusing here?");
  const media = await c("GET", `/api/audits/${audit.audit_id}/media/${up.data.artifact_id}`);
  assert.equal(media.status, 200);
  assert.equal(media.headers.get("content-type"), "image/png");
  assert.ok(!media.data.includes("internal build 42"), "stored image has no text chunk");
  const events = (await c("GET", `/api/audits/${audit.audit_id}/events?since=0`)).data.events;
  assert.ok(events.some((e) => e.event === "completed"));
  const later = (await c("GET", `/api/audits/${audit.audit_id}/events?since=${events.length - 1}`)).data.events;
  assert.equal(later.length, 1);

  const other = client("bob");
  await other("GET", "/api/capabilities");
  const forbidden = await other("DELETE", `/api/audits/${audit.audit_id}`);
  assert.equal(forbidden.status, 403, "another session cannot delete");

  const del = await c("DELETE", `/api/audits/${audit.audit_id}`);
  assert.equal(del.status, 204);
  assert.equal((await c("GET", `/api/audits/${audit.audit_id}`)).status, 404);
  assert.equal((await c("GET", `/api/audits/${audit.audit_id}/result`)).status, 404);
  assert.equal((await c("GET", `/api/audits/${audit.audit_id}/media/${up.data.artifact_id}`)).status, 404);
  assert.equal((await c("DELETE", `/api/audits/${audit.audit_id}`)).status, 404);
});

test("report export endpoint returns downloadable CSV and Markdown, and rejects bad requests", async () => {
  const c = client();
  const audit = (await c("POST", "/api/audits", { json: { analysis_type: "QUICK_REVIEW" } })).data;
  // before completion there is nothing to export
  const early = await c("GET", `/api/audits/${audit.audit_id}/export?format=csv`);
  assert.equal(early.status, 409);

  await c("POST", `/api/audits/${audit.audit_id}/artifacts`, { body: makePng(390, 560), headers: { "content-type": "image/png" } });
  await c("POST", `/api/audits/${audit.audit_id}/start`);
  let status;
  for (let i = 0; i < 200; i++) { status = (await c("GET", `/api/audits/${audit.audit_id}`)).data; if (["COMPLETED", "FAILED"].includes(status.status)) break; await sleep(20); }
  assert.equal(status.status, "COMPLETED");

  const csv = await c("GET", `/api/audits/${audit.audit_id}/export?format=csv`);
  assert.equal(csv.status, 200);
  assert.match(csv.headers.get("content-type"), /text\/csv/);
  assert.match(csv.headers.get("content-disposition"), /attachment; filename="ui-ux-.*\.csv"/);
  const csvText = csv.data.toString("utf8");
  assert.ok(csvText.startsWith("issue_id,fingerprint,type,"));
  assert.ok(csvText.split("\r\n").length >= 4);

  const md = await c("GET", `/api/audits/${audit.audit_id}/export?format=md`);
  assert.equal(md.status, 200);
  assert.match(md.headers.get("content-type"), /text\/markdown/);
  assert.ok(md.data.toString("utf8").startsWith("# UI/UX analysis"));

  const bad = await c("GET", `/api/audits/${audit.audit_id}/export?format=pdf`);
  assert.equal(bad.status, 400);
});

test("share links: owner creates, a public visitor resolves read-only, and revoke ends access", async () => {
  const owner = client("owner-share");
  await owner("GET", "/api/capabilities");
  const audit = (await owner("POST", "/api/audits", { json: { analysis_type: "QUICK_REVIEW" } })).data;
  const up = await owner("POST", `/api/audits/${audit.audit_id}/artifacts`, { body: makePng(390, 560), headers: { "content-type": "image/png" } });
  await owner("POST", `/api/audits/${audit.audit_id}/start`);
  let status;
  for (let i = 0; i < 200; i++) { status = (await owner("GET", `/api/audits/${audit.audit_id}`)).data; if (["COMPLETED", "FAILED"].includes(status.status)) break; await sleep(20); }
  assert.equal(status.status, "COMPLETED");

  const created = await owner("POST", `/api/audits/${audit.audit_id}/shares`, { json: { expires_in_days: 7 } });
  assert.equal(created.status, 201);
  const token = created.data.token;

  // a fresh visitor with no session can view the shared report (GET, public) and its screenshot
  const visitor = client("share-visitor");
  const view = await visitor("GET", `/api/shares/${token}`);
  assert.equal(view.status, 200);
  assert.ok(view.data.result.findings.length >= 3);
  assert.ok(view.data.screens.length === 1);
  const media = await visitor("GET", `/api/shares/${token}/media/${up.data.artifact_id}`);
  assert.equal(media.status, 200);
  assert.equal(media.headers.get("content-type"), "image/png");
  // the share route serves the app shell for /s/<token>
  assert.equal((await visitor("GET", `/s/${token}`)).status, 200);

  // a visitor cannot create or revoke shares
  const badRevoke = await visitor("DELETE", `/api/audits/${audit.audit_id}/shares/${token}`);
  assert.equal(badRevoke.status, 403);

  const del = await owner("DELETE", `/api/audits/${audit.audit_id}/shares/${token}`);
  assert.equal(del.status, 204);
  assert.equal((await visitor("GET", `/api/shares/${token}`)).status, 404, "revoked share no longer resolves");
});

test("comments over HTTP: owner and a share visitor post; a visitor cannot delete the owner's comment", async () => {
  const owner = client("owner-cmt");
  await owner("GET", "/api/capabilities");
  const audit = (await owner("POST", "/api/audits", { json: { analysis_type: "QUICK_REVIEW" } })).data;
  await owner("POST", `/api/audits/${audit.audit_id}/artifacts`, { body: makePng(390, 560), headers: { "content-type": "image/png" } });
  await owner("POST", `/api/audits/${audit.audit_id}/start`);
  let status;
  for (let i = 0; i < 200; i++) { status = (await owner("GET", `/api/audits/${audit.audit_id}`)).data; if (status.status === "COMPLETED") break; await sleep(20); }
  const result = (await owner("GET", `/api/audits/${audit.audit_id}/result`)).data.result;
  const issue = result.findings[0].issue_id;

  const ownerComment = await owner("POST", `/api/audits/${audit.audit_id}/comments`, { json: { issue_id: issue, body: "Owner comment", author_name: "Owner" } });
  assert.equal(ownerComment.status, 201);
  assert.equal(ownerComment.data.by_owner, true);

  const token = (await owner("POST", `/api/audits/${audit.audit_id}/shares`, { json: {} })).data.token;
  const visitor = client("cmt-visitor");
  const vc = await visitor("POST", `/api/shares/${token}/comments`, { json: { issue_id: issue, body: "Visitor comment", author_name: "V" } });
  assert.equal(vc.status, 201);
  assert.equal(vc.data.by_owner, false);

  const shareList = (await visitor("GET", `/api/shares/${token}/comments`)).data.comments;
  assert.equal(shareList.length, 2);
  assert.equal(shareList.find((c) => c.comment_id === vc.data.comment_id).mine, true);
  assert.equal(shareList.find((c) => c.comment_id === ownerComment.data.comment_id).mine, false);

  // the visitor cannot delete the owner's comment, but can delete their own; the owner can delete any
  assert.equal((await visitor("DELETE", `/api/shares/${token}/comments/${ownerComment.data.comment_id}`)).status, 403);
  assert.equal((await visitor("DELETE", `/api/shares/${token}/comments/${vc.data.comment_id}`)).status, 204);
  assert.equal((await owner("DELETE", `/api/audits/${audit.audit_id}/comments/${ownerComment.data.comment_id}`)).status, 204);
  assert.equal((await owner("GET", `/api/audits/${audit.audit_id}/comments`)).data.comments.length, 0);
});

test("rate limiting returns 429 after the configured number of mutations", async () => {
  const store = createStore(tempDir());
  const limited = createServer({ orchestrator: createOrchestrator({ adapter: createFixtureAdapter(), store }), rateLimiter: (() => { let n = 0; return () => ++n <= 2; })() });
  await new Promise((r) => limited.listen(0, "127.0.0.1", r));
  const url = `http://127.0.0.1:${limited.address().port}/api/audits`;
  const post = () => fetch(url, { method: "POST", headers: { "x-web-client": "1", "content-type": "application/json" }, body: "{}" });
  assert.equal((await post()).status, 201);
  assert.equal((await post()).status, 201);
  assert.equal((await post()).status, 429);
  await new Promise((r) => limited.close(r));
});

test("malformed JSON and unknown routes are handled without leaking internals", async () => {
  const c = client();
  const bad = await c("POST", "/api/audits", { body: "{not json", headers: { "content-type": "application/json" } });
  assert.equal(bad.status, 400);
  assert.equal(bad.data.error.code, "invalid_input");
  const nope = await c("GET", "/api/nothing");
  assert.equal(nope.status, 404);
  const method = await c("POST", "/ui/app.mjs", { body: "x" });
  assert.equal(method.status, 405);
});
