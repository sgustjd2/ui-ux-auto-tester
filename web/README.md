# Web product — Phase W1 vertical slice

The web application layer of UI/UX Auto Tester. Specification: [docs/web-product/](../docs/web-product/README.md). This directory is owned by the web product stream (ADR 0006).

Status: W1, W2, W3, W5-groundwork, and W6-export slices against a **fixture** Audit Core. W1: upload one screenshot, run an analysis, and inspect summary, markers, grouped findings, simulated personas, coverage, and evidence. W2: upload several screenshots as an ordered flow and inspect a flow strip (per-step preview with per-screen markers), cross-screen findings, and a whole-result Markdown export. W3: choose which personas to simulate (descriptor-driven), set a seed for a reproducible run, and save persona sets; the fixture core keeps the personas it can simulate and honestly marks the rest not-simulated. W5 groundwork: browser-local history with a Retest action, client-side projects that group analyses of the same product (create on the home page, assign on the analysis page, manage at `/projects/{id}`), retest linking that compares a new run against its baseline as fixed / still-open / new / regressed, and a side-by-side comparison of any two analyses (mobile vs desktop, A vs B) at `/compare/{a}/{b}`. W6 export: copy a finding as Markdown, a GitHub issue, or Jira markup, and download the whole report as Markdown or CSV for a tracker. W6 sharing: mint a scoped, revocable read-only link (`/s/{token}`) that shows a finished report to anyone, with no input controls, honoring expiry and revocation. W6 comments: the owner and share viewers can attach plain-text comments to a finding in the drawer; anyone deletes only their own, the owner deletes any. A multi-screen request is served by the `flow-review` fixture; a retest by the `quick-review-fixed` variant. Results are illustrative until a live core is bound behind the adapter.

## Run

Requires Node.js 22 or newer (developed on 24). No dependencies, no build step.

```bash
node web/server/server.mjs
```

Open http://127.0.0.1:3000. Environment variables: `PORT` (3000), `WEB_DATA_DIR` (defaults to a folder in the OS temp directory; uploads never land in the repository), `WEB_FIXTURE` (`quick-review` or `injection`), `WEB_STAGE_DELAY_MS` (1500, simulates stage duration), `WEB_RETENTION_DAYS` (7), `WEB_SECURE_COOKIES` (`1` behind HTTPS), `WEB_CACHE` (`0` disables the result cache), `WEB_LOG_LEVEL` (`silent` | `error` | `info` (default) | `debug`).

### Core binding

`WEB_CORE` selects how the Audit Core is reached, without any change to the UI or orchestrator:

- `fixture` (default): in-process fixture adapter.
- `subprocess`: spawns a core process that speaks the NDJSON CLI protocol in `docs/web-product/audit-core-contract.md` §3.3. By default it runs the reference core CLI (`adapter/reference-core-cli.mjs`), which serves fixture data over the real wire protocol. Override with `WEB_CORE_CMD` and `WEB_CORE_ARGS` (comma-separated) to point at a real core executable in any language.

```bash
WEB_CORE=subprocess node web/server/server.mjs
```

A real core drops in by implementing two commands: `describe` (print the capability descriptor) and `run` (read one `AuditRequest` on stdin, stream events as NDJSON on stdout, end with a `completed` event). The conformance test then verifies it against the same request the in-process path uses.

## HTTP API

All under `/api`. Mutations (POST/DELETE) require an `X-Web-Client: 1` header (CSRF) and are rate-limited; owner mutations are bound to the creating session cookie. Errors are `{ error: { code, message } }`.

| Method & path | Purpose |
|---|---|
| `GET /api/capabilities` | capability descriptor + web limits |
| `POST /api/audits` | create an audit (`analysis_type`, `intent`, `options`, `retest_of?`, `idempotency_key?`) |
| `POST /api/audits/{id}/artifacts` | upload a screenshot (image body; `?label=`) |
| `POST /api/audits/{id}/start` | begin (or serve a cached result) |
| `GET /api/audits/{id}` | status + stages + progress |
| `GET /api/audits/{id}/result` | result envelope (partial allowed) |
| `GET /api/audits/{id}/events?since=` | event stream (polled) |
| `GET /api/audits/{id}/media/{artifactId}` | screenshot bytes |
| `POST /api/audits/{id}/cancel` · `POST /api/audits/{id}/rerun` · `DELETE /api/audits/{id}` | lifecycle |
| `GET /api/audits/{id}/comparison` | retest comparison vs `retest_of` baseline |
| `GET /api/compare?a=&b=` | side-by-side comparison of two analyses |
| `GET /api/audits/{id}/export?format=md\|csv` | download the report |
| `POST /api/audits/{id}/shares` · `GET` · `DELETE …/{token}` | create / list / revoke share links (owner) |
| `GET /api/shares/{token}` · `…/media/{artifactId}` | resolve a shared report (public, read-only) |
| `GET\|POST /api/audits/{id}/comments` · `DELETE …/{cid}` | finding comments (owner) |
| `GET\|POST /api/shares/{token}/comments` · `DELETE …/{cid}` | finding comments (share viewer) |

Client routes served as the app shell: `/`, `/a/{id}`, `/s/{token}`, `/projects/{id}`, `/compare/{a}/{b}`.

## Test & benchmark

```bash
node --test "web/test/*.test.mjs"
node web/bench/latency.mjs   # end-to-end latency over 24 analyses (Korean + English), p50/p95 reported
```

The benchmark (`web/bench/latency.mjs`, W1-AC-14 / WNFR-01) measures create→completed wall time over a spread of device sizes and English/Korean questions and prints p50/p95 per locale. Against the fixture the numbers are harness overhead; point it at the real core (via `WEB_CORE=subprocess`-style wiring) to measure real latency. `BENCH_N`, `BENCH_CONCURRENCY`, `BENCH_STAGE_DELAY_MS`, `BENCH_P50_TARGET_MS` tune it.

Covers upload validation and metadata stripping, presentation grouping, persona reconciliation (W3), retest comparison and client-side projects (W5), issue-tracker export, shareable read-only links, and finding comment threads (W6), fixture conformance to `docs/finding-schema.md`, the audit lifecycle (partial results, cancel, failure, delete, expiry, rerun), rendering labels and escaping, structural accessibility (W1-AC-13), the boundary rules, the HTTP API end to end (including report export and static module serving), the subprocess CLI transport (describe, stream, failure, cancellation), cross-transport conformance (W1-AC-15: in-process and subprocess yield identical results), the result cache (hit, miss, disable, TTL sweep), PII-safe observability, the latency benchmark, the visual design pass (light and dark themes), and defensive validation of core output at the boundary. Test images are generated in memory; there are no binary fixtures.

## Layout

| Path | Role | Boundary |
|---|---|---|
| `ui/` | Web UI: `index.html`, `app.mjs` (routing, input, polling), `render.mjs` (pure HTML rendering), `projects.mjs` (pure client-side project grouping), `styles.css` | no model calls, no rules, no personas; renders what the API returns |
| `shared/export.mjs` | pure text export (Markdown, CSV, GitHub issue, Jira) used by the UI, the server, and a future CLI; served to the browser under `/shared/` | no auditing logic |
| `server/server.mjs` | HTTP server: product API, static files, security headers, sessions, CSRF header check, rate limit, retention sweep | composition root; the only place that instantiates the adapter |
| `server/orchestrator.mjs` | audits, uploads, lifecycle, event log, cancel, rerun, delete; adds `presentation` to findings | calls the core only through the adapter |
| `server/uploads.mjs` | magic-byte type detection, size and dimension caps, metadata stripping | trust boundary for uploads |
| `server/presentation.mjs` | pure grouping and marker numbering over core fields | never re-scores |
| `server/compare.mjs` | pure retest comparison (fixed / still-open / new / regressed) keyed on `fingerprint` or a provisional fallback | consumes the core's stable issue identity (W-OD-11) |
| `server/cache.mjs` | content-addressed result cache: key over image hashes + options + versions, and single-pass id remap | reuses an identical analysis instead of re-running the core (`WEB_CACHE=0` to disable) |
| `server/log.mjs` | structured JSON logger with an audit/trace id, timings, and a redaction denylist | observability (WNFR-09); never logs image bytes or user text (`WEB_LOG_LEVEL`) |
| `server/store.mjs` | filesystem persistence, random ids, hard delete, expiry sweep, share-token index | data outside the repository |
| `adapter/fixture-adapter.mjs` | in-process `describe()`, `plan()`, `run()` from fixtures; exports the shared `streamEnvelope` staging logic | replaced by the real binding behind the same functions |
| `adapter/subprocess-adapter.mjs` | CLI binding: spawns a core process, streams its NDJSON events, maps them to the same interface | the seam a real core (any language) plugs into |
| `adapter/reference-core-cli.mjs` | reference core CLI: `describe` and `run` over the wire protocol, serving fixture data | executable spec of what a real core CLI must produce |
| `shared/validate-finding.mjs` | structural validation of findings and the envelope (shared by tests and the orchestrator) | the orchestrator validates core output at the boundary — malformed output surfaces a warning and is not cached |
| `fixtures/` | example envelopes (`quick-review`, `injection`, `flow-review`) | illustrative; rule ids unverified |
| `tools/a11y-audit.js` | dependency-free live DOM accessibility smoke check (paste into the console or run via a driver) | dev tool; complements `test/accessibility.test.mjs` |
| `test/` | `node:test` suites and in-memory image generators | |

Data lives under `WEB_DATA_DIR/audits/<audit_id>/` as `audit.json`, `events.ndjson`, `result.json`, and `artifacts/`. Deleting an audit removes the directory.

## Known gaps (recorded in `docs/web-product/decisions.md`)

- Uploads are validated and stripped of metadata but not re-encoded (no image codec in the standard library); re-encoding waits for a dependency decision (W-OD-18).
- Polling only; server-sent events are not wired yet (W-OD-10).
- Single process, in-memory rate limiter and idempotency map.
