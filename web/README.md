# UI/UX Auto Tester — Web app

The web application layer of UI/UX Auto Tester: drop in a screenshot (or a few, or a whole flow), optionally ask a question, and get structured UI/UX feedback in three clearly separated lenses — **standards violations**, **expert UX risks**, and **simulated-user signals** — with evidence, fixes, and retest guidance. Specification lives in [docs/web-product/](../docs/web-product/README.md); this directory is owned by the web product stream (ADR 0006).

> [!IMPORTANT]
> **This runs on a *fixture* Audit Core right now.** The app is a complete, working product shell, but the analysis it shows is **sample data**, not real analysis of your screenshot. Every screenshot currently produces the same example findings. To get *real* results you bind a real Audit Core behind the adapter — see [Getting real results](#getting-real-results). Everything else in this guide (uploading, flows, personas, projects, retest, compare, export, share, comments) is fully functional today against that sample data. So it can't be mistaken for a real audit, every result page, share link, and downloaded report is marked with an **"Illustrative sample"** banner while the fixture core is bound; it disappears automatically once a real core is connected.

---

## 1. Quick start

You need **Node.js 22 or newer** (developed on 24). There are no dependencies and no build step.

```bash
node web/server/server.mjs
```

You'll see `[web] listening on http://127.0.0.1:3000 ...`. Open **http://127.0.0.1:3000** in a browser. To stop the server, press `Ctrl+C`.

Prefer a different port or data location? `PORT=8080 node web/server/server.mjs` (full list in [Configuration](#7-configuration)).

---

## 2. Run your first analysis

1. **Open the home page** (`http://127.0.0.1:3000`).
2. **Add a screenshot.** Drop an image on the drop zone, click **Choose files**, or paste from the clipboard with `Ctrl/Cmd+V`. Accepted: **PNG, JPEG, WebP, up to 10 MB each.** A thumbnail with the file name appears once it's added.
3. **(Optional) Ask a question** in "What do you want to know?" — e.g. *"Where would a first-time user click?"* (up to 500 characters).
4. **(Optional) Pick an analysis type** (default **Quick Review** — see [Analysis types](#analysis-types)) and a **Device** (Auto-detect by default).
5. **Click Analyze.** The page moves to `/a/<id>` and shows stage progress: *Understanding the input → the screen → Simulating personas → Checking rules → Preparing the report.* Partial results stream in — the summary appears first.
6. **Read the result** (next section). The analysis has its own URL you can bookmark; your browser also keeps a **Recent analyses** list on the home page.

That's the core loop. Everything below is optional depth.

---

## 3. Understand the result

The result page has a **summary**, a **screenshot preview with numbered markers**, and three tabs.

**Summary card** — what the screen appears to be for, the first impression, the likely next action, the answer to your question (if you asked one), and a one-line headline, plus counts: **Blockers · Confusion · Improvements · Notes**.

**Preview + markers** — numbered markers sit on the screenshot at the regions findings refer to. Hover or focus a marker to highlight its finding (and vice-versa). Marker positions on screenshots are approximate; findings without a region are still listed, just without a marker.

**Findings tab** — findings grouped into Blockers / Confusion / Improvements / Notes. Every finding card shows its **type**, kept strictly separate:

| Badge | Means | Backed by |
|---|---|---|
| **VIOLATION** | an objective failure of a registered rule (e.g. WCAG) | a rule + evidence |
| **UX_RISK** | an expert usability/design concern | a named heuristic + evidence |
| **USER_SIGNAL** *(simulated)* | how simulated personas behaved | persona votes; always labelled "simulated" |

Each card also shows **severity** (Critical…Informational), **priority** (P0…P3), and **confidence** (HIGH/MEDIUM/LOW — screenshot-only findings are LOW, and a low-confidence violation reads as "suspected"). Click a card (or its marker) to open the **drawer**: observed → expected → why it matters → evidence (with how it was obtained: measured / inferred / simulated) → rule/principle references → recommended fix → retest steps. The drawer also has **Copy Markdown / Copy GitHub issue / Copy Jira** and a **comment thread** (see [Comments](#comments)).

**Simulated personas tab** — one card per persona: what it sees first, where it would click, what confuses it, whether it would continue, and its confidence. Below, an agreement view shows, per test, how many personas agreed (as counts, never fake percentages). Everything here is labelled **"Simulated persona — not a real participant."**

**Coverage & limitations tab** — which rules were checked and their result (PASS / FAIL / PARTIAL / NOT_TESTED / NOT_APPLICABLE), and an honest list of what a screenshot *can't* establish (keyboard operability, focus order, dynamic states, performance, …).

You may also see small honest notes: **"reused a cached result"** (an identical screenshot + options was analyzed before), or a schema warning if the core returned something malformed.

---

## 4. Feature guide

### Analysis types
On the home page: **Quick Review** (visual + expert UX + personas + static accessibility — the default), **User Test** (personas only), **Accessibility Check** (static rule checks only). **Full Audit** is shown but disabled — it needs the live-URL phase.

### Ask a question
Type a task or question before Analyze; the answer appears at the top of the summary and, for "where would you click"-style questions, as persona click markers.

### Review a flow (multiple screens)
Add several screenshots at once. They appear as an ordered list — reorder with the **↑ / ↓** buttons, remove with **Remove**. The order is the flow order. Click Analyze; the result adds a **flow strip** (one thumbnail per step). Click a step to switch the preview to that screen and see its markers, plus cross-screen findings (e.g. "the primary button moves between steps").

### Choose which personas to simulate
Open **Simulated personas** on the home page. Tick any of the behaviour-based presets (First-time user, Skimmer, Low digital literacy, Power user, …; up to 5). Set a **Seed** for a reproducible run (same personas + same seed → same result). Name and **Save** a set to reuse it later; saved sets and your last selection persist in this browser. On the result's persona tab, any persona the core can't honestly simulate is shown as **"not simulated"** with a reason rather than faked.

### Projects (group analyses)
Under **Projects** on the home page, type a name and **Create** — you land on `/projects/<id>`. Assign analyses to a project from the **In project** dropdown on any completed analysis. The project page lists its analyses with **Open / Retest / Remove**, and lets you **Rename** or **Delete** the project (deleting only ungroups the analyses; it doesn't delete them). Projects are stored in your browser only.

### Retest (verify a fix)
On a completed analysis, click **Retest** (or "Retest" next to a recent/project item). You return to the home page in "retesting" mode; upload the **fixed** screenshot and Analyze. The new result adds a **Compared to the previous analysis** panel classifying findings as **Fixed / Still open / New / Regressed**.

### Compare two analyses (A/B, mobile vs desktop)
On a completed analysis, use **Compare with…** to pick another of your analyses; you land on `/compare/<a>/<b>` with a side-by-side panel (**only in A / in both / only in B**). If the two runs used different device hints, the sides are labelled by device (Mobile / Desktop).

### Export to your issue tracker
- **Per finding** (in the drawer): **Copy Markdown**, **Copy GitHub issue** (title + body), or **Copy Jira** (wiki markup) to your clipboard.
- **Whole report**: **Copy report** (Markdown to clipboard), or **Download .md** / **Download .csv** (CSV is one row per finding — good for bulk import into Jira/GitHub).

### Share a read-only link
On a completed analysis, click **Share** → set an expiry (days) → **Create link**. Anyone with the link opens `/s/<token>`: the full report, read-only, no input or delete controls. Revoke a link anytime from the same panel; links also stop working when they expire or the analysis is deleted. Only you (the creating browser) can create or revoke; resolving a valid link is public.

### Comments
In a finding's drawer, add a plain-text comment with an optional name. You and anyone viewing a share link can comment; you can delete any comment on your analysis, others can delete only their own.

### Dark mode
The UI follows your operating system's light/dark setting automatically — no toggle. Both themes meet WCAG AA contrast.

### Delete & retention
**Delete this analysis** hard-deletes the screenshot, evidence, and results immediately (the URL then 404s). Anonymous analyses are also auto-deleted after the retention window (default **7 days**). There are no accounts; an analysis is reachable only by its unguessable URL, and mutating it (delete, retest, share) is tied to the browser that created it.

---

## 5. Getting real results

The app ships bound to a **fixture** core, so results are illustrative. To analyze real screenshots you connect a real Audit Core — no UI or server change, just a different adapter binding:

```bash
WEB_CORE=subprocess WEB_CORE_CMD="<your-core-executable>" node web/server/server.mjs
```

A real core is any program (any language) that implements two commands — `describe` and `run` — over the small NDJSON protocol. The exact contract, a working reference implementation, and a verification checklist are in **[docs/web-product/core-integration-guide.md](../docs/web-product/core-integration-guide.md)**. Until such a core exists (the core stream is still researching the standards corpus), the fixture is what you get.

---

## 6. Develop, test, benchmark

```bash
node --test "web/test/*.test.mjs"        # full suite (111 tests)
node web/bench/latency.mjs               # end-to-end latency over 24 analyses (Korean + English), p50/p95
```

The suite covers upload validation and metadata stripping, finding grouping, persona configuration, retest and A/B comparison, projects, export, share links, comments, the audit lifecycle (partial/cancel/failure/delete/expiry/rerun), rendering/escaping, accessibility structure, the boundary rules, the HTTP API end to end, the subprocess transport and cross-transport conformance, the result cache, PII-safe logging, both themes, and defensive validation of core output. Test images are generated in memory — there are no binary fixtures.

---

## 7. Configuration

All optional environment variables:

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | HTTP port (binds to `127.0.0.1`) |
| `WEB_DATA_DIR` | OS temp dir | where uploads/results live; **never** inside the repo |
| `WEB_CORE` | `fixture` | `fixture` (in-process) or `subprocess` (CLI core) |
| `WEB_CORE_CMD`, `WEB_CORE_ARGS` | reference CLI | the subprocess core to run (`WEB_CORE_ARGS` is comma-separated) |
| `WEB_FIXTURE` | `quick-review` | fixture served for single-screen runs (`quick-review` or `injection`) |
| `WEB_STAGE_DELAY_MS` | `1500` | simulated per-stage delay (set `0` for instant) |
| `WEB_CACHE` | on | `0` disables the identical-input result cache |
| `WEB_RETENTION_DAYS` | `7` | auto-delete window for analyses |
| `WEB_LOG_LEVEL` | `info` | `silent` \| `error` \| `info` \| `debug` (structured JSON to stderr; never logs image bytes or your text) |
| `WEB_SECURE_COOKIES` | off | `1` when serving behind HTTPS |

---

## 8. HTTP API

Everything the UI does is a plain HTTP call under `/api`. Mutations (POST/DELETE) require an `X-Web-Client: 1` header (CSRF) and are rate-limited; owner mutations are bound to the creating session cookie. Errors are `{ error: { code, message } }`.

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
| `POST /api/audits/{id}/cancel` · `POST …/rerun` · `DELETE /api/audits/{id}` | lifecycle |
| `GET /api/audits/{id}/comparison` | retest comparison vs the `retest_of` baseline |
| `GET /api/compare?a=&b=` | side-by-side comparison of two analyses |
| `GET /api/audits/{id}/export?format=md\|csv` | download the report |
| `POST /api/audits/{id}/shares` · `GET` · `DELETE …/{token}` | create / list / revoke share links (owner) |
| `GET /api/shares/{token}` · `…/media/{artifactId}` | resolve a shared report (public, read-only) |
| `GET\|POST /api/audits/{id}/comments` · `DELETE …/{cid}` | finding comments (owner) |
| `GET\|POST /api/shares/{token}/comments` · `DELETE …/{cid}` | finding comments (share viewer) |

Client routes served as the app shell: `/`, `/a/{id}`, `/s/{token}`, `/projects/{id}`, `/compare/{a}/{b}`.

---

## 9. Data & privacy

Data lives under `WEB_DATA_DIR/audits/<audit_id>/` as `audit.json`, `events.ndjson`, `result.json`, and `artifacts/` — outside the repository. Uploads are validated by content (magic bytes, not extension), size- and dimension-capped, and stripped of metadata (EXIF/XMP). Deleting an analysis removes its directory; a background sweep removes expired ones. Logs never contain image bytes or your questions. Screenshot text is treated as data, never as instructions (a screenshot that says "ignore previous instructions…" is reported as content, never obeyed). The result cache stores only analysis results keyed by a content hash — never image bytes, comments, or share links.

---

## 10. Troubleshooting

- **`node: command not found` / syntax errors on start** — you need Node 22+. Check `node --version`.
- **Port already in use** — set another: `PORT=8080 node web/server/server.mjs`.
- **"Only PNG, JPEG, and WebP…" on upload** — the file isn't one of those types (checked by content, so a renamed file is still rejected), or it's over 10 MB / outside 64–8000 px.
- **Every screenshot gives the same findings** — expected: you're on the fixture core (see [Getting real results](#getting-real-results)).
- **"Copy" buttons do nothing** — the browser blocked clipboard access (common on plain `http://` in some browsers); use the **Download** buttons instead, or serve over HTTPS.
- **Recent list / projects empty after clearing site data** — they're stored in your browser only; clearing storage removes them (the analyses themselves persist server-side until deleted or expired).

---

## 11. Layout & known gaps

| Path | Role |
|---|---|
| `ui/` | Web UI: `index.html`, `app.mjs` (routing/input/polling), `render.mjs` (pure HTML), `projects.mjs` (client-side projects), `styles.css` |
| `shared/export.mjs` · `shared/validate-finding.mjs` | pure text export; schema validation (used by UI, server, tests) |
| `server/` | `server.mjs` (HTTP + security), `orchestrator.mjs` (lifecycle), `uploads.mjs`, `presentation.mjs`, `compare.mjs`, `cache.mjs`, `log.mjs`, `store.mjs` |
| `adapter/` | `fixture-adapter.mjs`, `subprocess-adapter.mjs`, `reference-core-cli.mjs` (the seam a real core plugs into) |
| `fixtures/` | example envelopes (illustrative; rule ids unverified) |
| `bench/` · `tools/` · `test/` | latency benchmark; a11y smoke tool; `node:test` suites |

The web layer holds **no** auditing intelligence — no prompts, rules, personas, scoring, or model calls; it renders what the core returns and only adds display grouping. Known gaps (see [docs/web-product/decisions.md](../docs/web-product/decisions.md)): uploads are stripped but not pixel-re-encoded (W-OD-18); progress is polled, not server-sent (W-OD-10); single process with an in-memory rate limiter. The live-URL audit (W4) and real-core binding depend on the parallel core stream.
