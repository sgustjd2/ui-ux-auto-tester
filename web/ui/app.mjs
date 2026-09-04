// Web UI controller: routing, input capture, polling, rendering (docs/web-product/web-product-prd.md sections 8 to 10).
// It calls the product API only; it contains no auditing logic and never talks to a model.
import * as R from "./render.mjs";
import * as P from "./projects.mjs";

const app = document.getElementById("app");
const live = document.getElementById("live");
const drawer = document.getElementById("drawer");
// Close the finding drawer on Escape explicitly. Native modal <dialog> does this itself in standard browsers,
// but some embedded webviews swallow the default action, so we close it ourselves (idempotent with native).
drawer.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.preventDefault(); drawer.close(); } });
const noticeEl = document.getElementById("notice");
const TERMINAL = new Set(["COMPLETED", "FAILED", "CANCELLED"]);
const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];

let caps = null;
let pending = []; // ordered [{ file, url, w, h }] chosen on the home page
let retestOf = null; // audit id this new analysis retests, from ?retest=
let poll = { timer: null, id: null };
let current = { id: null, status: null, result: null, lastSeq: -1, tab: "findings" };

async function api(method, path, { json, body, headers } = {}) {
  const res = await fetch(path, {
    method,
    credentials: "same-origin",
    headers: { "x-web-client": "1", ...(json ? { "content-type": "application/json" } : {}), ...(headers ?? {}) },
    body: json ? JSON.stringify(json) : body,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data?.error?.message ?? res.statusText), { code: data?.error?.code, status: res.status });
  return data;
}
const announce = (msg) => { live.textContent = msg; };
function notice(msg, kind = "error") { noticeEl.textContent = msg ?? ""; noticeEl.className = `notice ${kind}`; noticeEl.hidden = !msg; }
async function copyToClipboard(text, msg) {
  try { await navigator.clipboard.writeText(text); announce(msg); notice(msg, "ok"); }
  catch { notice("Clipboard access was blocked by the browser."); }
}
const nav = (path) => { history.pushState({}, "", path); route(); };

// ---------- routing
function route() {
  stopPolling();
  notice(null);
  const share = location.pathname.match(/^\/s\/([A-Za-z0-9_-]+)$/);
  if (share) return showShare(share[1]);
  const proj = location.pathname.match(/^\/projects\/([A-Za-z0-9_-]+)$/);
  if (proj) return showProject(proj[1]);
  const cmp = location.pathname.match(/^\/compare\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+)$/);
  if (cmp) return showCompare(cmp[1], cmp[2]);
  const m = location.pathname.match(/^\/a\/([A-Za-z0-9_-]+)$/);
  if (m) showAnalysis(m[1]); else showHome();
}
window.addEventListener("popstate", route);
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-nav]");
  if (a) { e.preventDefault(); nav(a.getAttribute("href")); }
});

// ---------- home
function homeTemplate() {
  return `<section class="home">
  <h1>Drop a screenshot or a flow. Ask a question. Get evidence-linked UI/UX feedback.</h1>
  <p id="retest-banner" class="retest-banner" hidden></p>
  <form id="new" class="new-analysis" novalidate>
    <div class="input-col">
      <label for="file" class="dropzone" id="dropzone">
        <span class="drop-title">Drop screenshots here</span>
        <span class="muted">or paste (Ctrl/Cmd+V), or</span>
        <span class="btn-like">Choose files</span>
        <input id="file" name="file" type="file" accept="image/png,image/jpeg,image/webp" multiple class="visually-hidden-input">
        <span class="muted small">PNG, JPEG, WebP · up to 10 MB each. Add several in order to review a flow. URL input comes in a later phase.</span>
      </label>
      <ol id="pending-list" class="pending" aria-label="Chosen screenshots"></ol>
    </div>
    <div class="options-col">
      <label for="question">What do you want to know? <span class="muted">(optional, up to 500 characters)</span></label>
      <textarea id="question" maxlength="500" rows="3" placeholder="e.g. Where would a first-time user click?"></textarea>
      <fieldset>
        <legend>Analysis</legend>
        <label><input type="radio" name="analysis_type" value="QUICK_REVIEW" checked> Quick Review <span class="muted small">visual review, expert UX review, simulated personas, static accessibility checks</span></label>
        <label><input type="radio" name="analysis_type" value="USER_TEST"> User Test <span class="muted small">simulated personas only</span></label>
        <label><input type="radio" name="analysis_type" value="ACCESSIBILITY_CHECK"> Accessibility Check <span class="muted small">static rule checks only</span></label>
        <label><input type="radio" name="analysis_type" value="FULL_AUDIT"> Full Audit <span class="muted small">coming in a later phase</span></label>
      </fieldset>
      <label for="device">Device</label>
      <select id="device"><option value="auto">Auto-detect</option><option value="mobile">Mobile</option><option value="tablet">Tablet</option><option value="desktop">Desktop</option></select>
      <details id="persona-config" class="persona-config">
        <summary>Simulated personas <span class="muted small" id="persona-count"></span></summary>
        <fieldset id="persona-list" aria-label="Personas to simulate"></fieldset>
        <label for="seed" class="small">Seed (optional, for a reproducible run)</label>
        <input id="seed" type="number" min="0" inputmode="numeric" placeholder="random">
        <div class="save-row"><input id="set-name" type="text" maxlength="40" placeholder="Name this persona set" aria-label="Name this persona set"><button type="button" id="save-set">Save set</button></div>
        <div class="saved-sets" id="saved-sets" aria-label="Saved persona sets"></div>
      </details>
      <p class="disclaimer small">Simulated personas are AI simulations, not real participants.</p>
      <button type="submit" id="analyze" class="primary" disabled>Analyze</button>
    </div>
  </form>
  <section id="projects" aria-labelledby="projects-h"></section>
  <section id="recent" aria-labelledby="recent-h"></section>
</section>`;
}

async function showHome() {
  for (const p of pending) URL.revokeObjectURL(p.url);
  pending = [];
  app.innerHTML = homeTemplate();
  try { caps = caps ?? await api("GET", "/api/capabilities"); } catch { notice("The service is unavailable right now."); return; }
  for (const radio of app.querySelectorAll('input[name="analysis_type"]')) {
    radio.disabled = !caps.analysis_types.includes(radio.value);
  }
  const drop = document.getElementById("dropzone");
  const input = document.getElementById("file");
  input.addEventListener("change", () => { addFiles(input.files); input.value = ""; });
  drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("over"); });
  drop.addEventListener("dragleave", () => drop.classList.remove("over"));
  drop.addEventListener("drop", (e) => { e.preventDefault(); drop.classList.remove("over"); addFiles(e.dataTransfer?.files); });
  document.onpaste = (e) => addFiles([...(e.clipboardData?.items ?? [])].filter((i) => i.type.startsWith("image/")).map((i) => i.getAsFile()).filter(Boolean));
  document.getElementById("pending-list").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]"); if (!b) return;
    const i = Number(b.dataset.i);
    if (b.dataset.act === "remove") { URL.revokeObjectURL(pending[i].url); pending.splice(i, 1); }
    else if (b.dataset.act === "up" && i > 0) { [pending[i - 1], pending[i]] = [pending[i], pending[i - 1]]; }
    else if (b.dataset.act === "down" && i < pending.length - 1) { [pending[i + 1], pending[i]] = [pending[i], pending[i + 1]]; }
    renderPending();
  });
  document.getElementById("new").addEventListener("submit", (e) => { e.preventDefault(); runFlow(); });
  retestOf = new URLSearchParams(location.search).get("retest");
  const banner = document.getElementById("retest-banner");
  if (retestOf) { banner.hidden = false; banner.textContent = "Retesting a previous analysis — upload the updated screenshot to see what is fixed, still open, or new."; }
  renderPersonaPicker();
  renderProjects();
  renderRecent();
}

// ---------- persona configuration (W3)
function personaStore(key, fallback) { try { return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback)); } catch { return fallback; } }
function currentPersonaIds() { return [...document.querySelectorAll('#persona-list input:checked')].map((i) => i.value); }

function renderPersonaPicker() {
  const list = document.getElementById("persona-list");
  if (!list || !caps?.persona_presets) return;
  const restored = personaStore("lastPersonas", caps.defaults?.persona_ids ?? []);
  const checked = new Set(restored.length ? restored : caps.defaults?.persona_ids ?? []);
  const max = caps.limits?.max_personas ?? 5;
  list.replaceChildren();
  for (const p of caps.persona_presets) {
    const id = `persona-${p.persona_id}`;
    const label = document.createElement("label");
    label.className = "persona-choice";
    const dims = Object.entries(p.dimensions ?? {}).filter(([, v]) => v && !(Array.isArray(v) && !v.length)).slice(0, 3).map(([, v]) => Array.isArray(v) ? v.join("/") : v).join(" · ");
    label.innerHTML = `<input type="checkbox" id="${id}" value="${R.esc(p.persona_id)}"> <strong>${R.esc(p.label)}</strong> <span class="muted small">${R.esc(dims)}</span>`;
    label.querySelector("input").checked = checked.has(p.persona_id);
    list.append(label);
  }
  list.addEventListener("change", (e) => {
    if (currentPersonaIds().length > max && e.target?.checked) { e.target.checked = false; notice(`Up to ${max} personas per run.`); }
    updatePersonaCount();
    try { localStorage.setItem("lastPersonas", JSON.stringify(currentPersonaIds())); } catch { /* storage off */ }
  });
  document.getElementById("save-set").addEventListener("click", saveNamedSet);
  document.getElementById("saved-sets").addEventListener("click", onSavedSetClick);
  updatePersonaCount();
  renderSavedSets();
}

function updatePersonaCount() {
  const el = document.getElementById("persona-count");
  const n = currentPersonaIds().length;
  if (el) el.textContent = n ? `(${n} selected)` : "(none — pick at least one)";
}

function saveNamedSet() {
  const name = document.getElementById("set-name").value.trim();
  const ids = currentPersonaIds();
  if (!name || !ids.length) { notice("Name the set and select at least one persona."); return; }
  const sets = personaStore("personaSets", []).filter((s) => s.name !== name);
  sets.unshift({ name, ids });
  try { localStorage.setItem("personaSets", JSON.stringify(sets.slice(0, 12))); } catch { /* storage off */ }
  document.getElementById("set-name").value = "";
  renderSavedSets();
  announce(`Saved persona set "${name}".`);
}

function onSavedSetClick(e) {
  const apply = e.target.closest("button[data-apply]");
  const del = e.target.closest("button[data-del]");
  if (apply) {
    const ids = new Set(personaStore("personaSets", []).find((s) => s.name === apply.dataset.apply)?.ids ?? []);
    for (const input of document.querySelectorAll("#persona-list input")) input.checked = ids.has(input.value);
    updatePersonaCount();
    try { localStorage.setItem("lastPersonas", JSON.stringify(currentPersonaIds())); } catch { /* storage off */ }
    announce(`Applied persona set "${apply.dataset.apply}".`);
  } else if (del) {
    const sets = personaStore("personaSets", []).filter((s) => s.name !== del.dataset.del);
    try { localStorage.setItem("personaSets", JSON.stringify(sets)); } catch { /* storage off */ }
    renderSavedSets();
  }
}

function renderSavedSets() {
  const el = document.getElementById("saved-sets");
  if (!el) return;
  const sets = personaStore("personaSets", []);
  el.replaceChildren();
  if (!sets.length) return;
  const heading = document.createElement("p"); heading.className = "muted small"; heading.textContent = "Saved sets:";
  el.append(heading);
  for (const s of sets) {
    const wrap = document.createElement("span"); wrap.className = "saved-set";
    wrap.innerHTML = `<button type="button" data-apply="${R.esc(s.name)}">${R.esc(s.name)} <span class="muted">(${s.ids.length})</span></button><button type="button" data-del="${R.esc(s.name)}" aria-label="Delete set ${R.esc(s.name)}">×</button>`;
    el.append(wrap);
  }
}

function addFiles(list) {
  const maxBytes = caps?.web_limits?.max_upload_bytes ?? 10 * 1024 * 1024;
  const maxScreens = caps?.limits?.max_screens ?? 8;
  const files = [...(list ?? [])];
  for (const file of files) {
    if (pending.length >= maxScreens) { notice(`Up to ${maxScreens} screenshots per analysis.`); break; }
    if (!ACCEPTED.includes(file.type)) { notice("Only PNG, JPEG, and WebP images are accepted."); continue; }
    if (file.size > maxBytes) { notice(`"${file.name}" is larger than ${Math.round(maxBytes / 1024 / 1024)} MB.`); continue; }
    const entry = { file, url: URL.createObjectURL(file), w: null, h: null };
    const img = new Image();
    img.onload = () => { entry.w = img.naturalWidth; entry.h = img.naturalHeight; renderPending(); };
    img.src = entry.url;
    pending.push(entry);
  }
  if (pending.length) notice(null);
  renderPending();
  announce(`${pending.length} screenshot${pending.length === 1 ? "" : "s"} ready.`);
}

function renderPending() {
  const el = document.getElementById("pending-list");
  const analyze = document.getElementById("analyze");
  if (!el) return;
  el.replaceChildren();
  pending.forEach((p, i) => {
    const li = document.createElement("li");
    li.className = "pending-item";
    const dims = p.w ? `${p.w} × ${p.h} px · ` : "";
    li.innerHTML = `<img alt="" class="thumb"><span class="pending-meta"><strong>${i + 1}.</strong> ${R.esc(p.file.name)}<br><span class="muted small">${dims}${Math.round(p.file.size / 1024)} KB</span></span>
      <span class="pending-actions">
        <button type="button" data-act="up" data-i="${i}" aria-label="Move ${R.esc(p.file.name)} earlier"${i === 0 ? " disabled" : ""}>↑</button>
        <button type="button" data-act="down" data-i="${i}" aria-label="Move ${R.esc(p.file.name)} later"${i === pending.length - 1 ? " disabled" : ""}>↓</button>
        <button type="button" data-act="remove" data-i="${i}" aria-label="Remove ${R.esc(p.file.name)}">Remove</button>
      </span>`;
    li.querySelector(".thumb").src = p.url;
    el.append(li);
  });
  if (analyze) {
    analyze.disabled = pending.length === 0;
    analyze.textContent = pending.length > 1 ? `Analyze ${pending.length} screens` : "Analyze";
  }
}

async function runFlow() {
  if (!pending.length) return;
  const btn = document.getElementById("analyze");
  btn.disabled = true;
  const question = document.getElementById("question").value.trim() || null;
  const task = pending.length > 1 ? (document.getElementById("question").value.trim() || null) : null;
  const analysis_type = app.querySelector('input[name="analysis_type"]:checked')?.value ?? "QUICK_REVIEW";
  const device_hint = document.getElementById("device").value;
  const persona_ids = currentPersonaIds();
  if (!persona_ids.length) { notice("Select at least one simulated persona."); document.getElementById("persona-config").open = true; btn.disabled = false; return; }
  const seedRaw = document.getElementById("seed").value.trim();
  const options = { device_hint, persona_ids };
  if (seedRaw !== "" && Number.isFinite(Number(seedRaw))) options.seed = Number(seedRaw);
  try {
    announce("Creating the analysis…");
    const body = { analysis_type, intent: { question, task }, options, idempotency_key: crypto.randomUUID() };
    if (retestOf) body.retest_of = retestOf;
    const audit = await api("POST", "/api/audits", { json: body });
    for (let i = 0; i < pending.length; i++) {
      announce(`Uploading screenshot ${i + 1} of ${pending.length}…`);
      await api("POST", `/api/audits/${audit.audit_id}/artifacts?label=${i + 1}`, { body: pending[i].file, headers: { "content-type": pending[i].file.type } });
    }
    announce("Starting the analysis…");
    await api("POST", `/api/audits/${audit.audit_id}/start`);
    nav(`/a/${audit.audit_id}`);
  } catch (err) {
    notice(err.message || "Something went wrong.");
    btn.disabled = false;
  }
}

// The "recent" list doubles as the browser's registry of known analyses (up to 200); projects filter over it.
function recentList() { try { return JSON.parse(localStorage.getItem("recent") ?? "[]"); } catch { return []; } }
function setRegistry(list) { try { localStorage.setItem("recent", JSON.stringify(list.slice(0, 200))); } catch { /* storage off */ } }
function getProjects() { try { return JSON.parse(localStorage.getItem("projects") ?? "[]"); } catch { return []; } }
function setProjects(list) { try { localStorage.setItem("projects", JSON.stringify(list)); } catch { /* storage off */ } }
function rememberRecent(entry) {
  const list = recentList();
  const existing = list.find((r) => r.id === entry.id);
  const merged = { ...existing, ...entry, projectId: existing?.projectId ?? entry.projectId ?? null }; // keep an existing project assignment
  setRegistry([merged, ...list.filter((r) => r.id !== entry.id)]);
}
function forgetRecent(id) { setRegistry(recentList().filter((r) => r.id !== id)); }
function assignAnalysis(auditId, projectId, meta) { setRegistry(P.assignToProject(recentList(), auditId, projectId || null, meta ?? {})); }

const recentItemHtml = (r, extra = "") => `<li><a href="/a/${R.esc(r.id)}" data-nav>${R.esc(r.headline || r.id)}</a> <span class="muted small">${R.esc(new Date(r.at).toLocaleString())}</span> · <a href="/?retest=${R.esc(r.id)}" data-nav>Retest</a>${extra}</li>`;

function renderRecent() {
  const el = document.getElementById("recent");
  const list = recentList().slice(0, 20);
  if (!el || !list.length) { if (el) el.innerHTML = ""; return; }
  el.innerHTML = `<h2 id="recent-h">Recent analyses <span class="muted small">(stored in this browser only)</span></h2><ul>${list.map((r) => recentItemHtml(r)).join("")}</ul>`;
}

function renderProjects() {
  const el = document.getElementById("projects");
  if (!el) return;
  const projects = P.projectsWithCounts(getProjects(), recentList());
  el.innerHTML = `<h2 id="projects-h">Projects <span class="muted small">(this browser only)</span></h2>
    <form id="project-new" class="project-new"><input id="project-name" type="text" maxlength="60" placeholder="New project name" aria-label="New project name"><button type="submit">Create</button></form>
    <ul class="project-index">${projects.map((p) => `<li><a href="/projects/${R.esc(p.id)}" data-nav>${R.esc(p.name)}</a> <span class="muted small">${p.count} ${p.count === 1 ? "analysis" : "analyses"}</span></li>`).join("") || '<li class="muted">No projects yet. Create one to group analyses of the same product.</li>'}</ul>`;
  document.getElementById("project-new").addEventListener("submit", (e) => {
    e.preventDefault();
    const { projects: next, project } = P.addProject(getProjects(), document.getElementById("project-name").value, `prj_${crypto.randomUUID().slice(0, 8)}`);
    if (project) { setProjects(next); nav(`/projects/${project.id}`); }
  });
}

// ---------- project detail
function projectTemplate(project) {
  return `<section class="analysis project-view">
  <div class="analysis-head">
    <h1 id="project-title">${R.esc(project.name)}</h1>
    <div class="actions">
      <button type="button" id="rename-proj">Rename</button>
      <button type="button" id="delete-proj" class="danger">Delete project</button>
      <a href="/" data-nav class="btn-like">New analysis</a>
    </div>
  </div>
  <p class="muted small">Projects group analyses in this browser only. <a href="/" data-nav>All projects and recent analyses</a></p>
  <ul id="project-analyses" class="project-analyses recent-analyses"></ul>
</section>`;
}

function renderProjectAnalyses(id) {
  const el = document.getElementById("project-analyses");
  const list = P.analysesInProject(recentList(), id);
  el.innerHTML = list.map((r) => recentItemHtml(r, ` · <button type="button" class="link" data-remove="${R.esc(r.id)}">Remove from project</button>`)).join("") || '<li class="muted">No analyses in this project yet. Open an analysis and add it to this project.</li>';
}

function showProject(id) {
  const project = getProjects().find((p) => p.id === id);
  if (!project) { app.innerHTML = `<section class="analysis"><h1>Project</h1><p class="notice">This project was not found in this browser.</p><p><a href="/" data-nav>Home</a></p></section>`; return; }
  app.innerHTML = projectTemplate(project);
  renderProjectAnalyses(id);
  document.getElementById("rename-proj").addEventListener("click", () => {
    let name; try { name = prompt("Rename project", project.name); } catch { notice("Renaming is not available here."); return; }
    if (name && name.trim()) { setProjects(P.renameProject(getProjects(), id, name)); document.getElementById("project-title").textContent = name.trim().slice(0, 60); project.name = name.trim().slice(0, 60); }
  });
  document.getElementById("delete-proj").addEventListener("click", () => {
    if (!confirm(`Delete project "${project.name}"? The analyses stay in your history but are ungrouped.`)) return;
    const out = P.removeProject(getProjects(), recentList(), id);
    setProjects(out.projects); setRegistry(out.registry);
    nav("/");
  });
  document.getElementById("project-analyses").addEventListener("click", (e) => {
    const rm = e.target.closest("[data-remove]"); if (!rm) return;
    assignAnalysis(rm.dataset.remove, null);
    renderProjectAnalyses(id);
  });
}

// ---------- analysis
function analysisTemplate() {
  return `<section class="analysis">
  <div class="analysis-head">
    <h1>Analysis</h1>
    <div class="actions">
      <button type="button" id="cancel" hidden>Cancel</button>
      <button type="button" id="retest" hidden>Retest</button>
      <button type="button" id="share-btn" hidden aria-expanded="false" aria-controls="share-panel">Share</button>
      <button type="button" id="copy-all">Copy report</button>
      <a id="dl-md" class="btn-like" download hidden>Download .md</a>
      <a id="dl-csv" class="btn-like" download hidden>Download .csv</a>
      <button type="button" id="delete" class="danger">Delete this analysis</button>
      <a href="/" data-nav class="btn-like">New analysis</a>
    </div>
  </div>
  <div id="status" class="status"></div>
  <div id="share-panel" class="share-panel" hidden aria-label="Share links"></div>
  <div id="summary"></div>
  <div id="comparison"></div>
  <div class="workspace">
    <section class="preview-pane" aria-labelledby="pv-h">
      <h2 id="pv-h" class="visually-hidden">Screenshot preview</h2>
      <nav id="flow-strip" class="flow-strip" hidden aria-label="Flow steps"></nav>
      <div class="preview-wrap"><img id="shot" alt="Uploaded screenshot"><div id="markers" class="markers"></div></div>
      <p class="muted small" id="shot-caption"></p>
      <p class="muted small">Hover or focus a marker to highlight its finding. Marker positions on screenshots are approximate.</p>
      <p class="muted small" id="retention"></p>
      <label id="project-assign" class="project-assign" hidden>In project <select id="project-select"></select></label>
      <label id="compare-with" class="project-assign" hidden>Compare with <select id="compare-select"></select></label>
    </section>
    <section class="results-pane">
      <div role="tablist" aria-label="Results" class="tabs">
        <button type="button" role="tab" id="tab-findings" data-tab="findings" aria-controls="panel-findings" aria-selected="true">Findings</button>
        <button type="button" role="tab" id="tab-personas" data-tab="personas" aria-controls="panel-personas" aria-selected="false" tabindex="-1">Simulated personas</button>
        <button type="button" role="tab" id="tab-coverage" data-tab="coverage" aria-controls="panel-coverage" aria-selected="false" tabindex="-1">Coverage &amp; limitations</button>
      </div>
      <div role="tabpanel" id="panel-findings" aria-labelledby="tab-findings" tabindex="0"></div>
      <div role="tabpanel" id="panel-personas" aria-labelledby="tab-personas" tabindex="0" hidden></div>
      <div role="tabpanel" id="panel-coverage" aria-labelledby="tab-coverage" tabindex="0" hidden></div>
    </section>
  </div>
</section>`;
}

function stopPolling() { if (poll.timer) clearTimeout(poll.timer); poll = { timer: null, id: null }; }

async function showAnalysis(id) {
  app.innerHTML = analysisTemplate();
  current = { id, status: null, result: null, lastSeq: -1, tab: "findings", selectedScreen: null };
  document.getElementById("delete").addEventListener("click", () => deleteAnalysis(id));
  document.getElementById("retest").addEventListener("click", () => nav(`/?retest=${encodeURIComponent(id)}`));
  document.getElementById("cancel").addEventListener("click", () => api("POST", `/api/audits/${id}/cancel`).catch((e) => notice(e.message)));
  document.getElementById("copy-all").addEventListener("click", () => { if (current.result) copyToClipboard(R.resultToMarkdown(current.result), "Report copied as Markdown."); });
  const share = document.getElementById("share-btn");
  share.addEventListener("click", () => {
    const panel = document.getElementById("share-panel");
    const open = panel.hidden;
    panel.hidden = !open;
    share.setAttribute("aria-expanded", String(open));
    if (open) loadShares(id);
  });
  wireResultView();
  poll.id = id;
  await tick(id);
  const wanted = new URLSearchParams(location.search).get("f");
  if (wanted) openFinding(wanted);
}

// Shared event wiring for the report body (flow strip, tabs, finding drawer, marker highlight).
function wireResultView() {
  document.getElementById("flow-strip").addEventListener("click", (e) => { const b = e.target.closest("button[data-screen]"); if (b) selectScreen(b.dataset.screen); });
  const tabs = document.querySelector(".tabs");
  tabs.addEventListener("click", (e) => { const t = e.target.closest("[role=tab]"); if (t) selectTab(t.dataset.tab); });
  tabs.addEventListener("keydown", (e) => {
    const list = [...document.querySelectorAll("[role=tab]")];
    const i = list.indexOf(document.activeElement);
    if (i < 0) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); const n = list[(i + (e.key === "ArrowRight" ? 1 : list.length - 1)) % list.length]; n.focus(); selectTab(n.dataset.tab); }
  });
  app.addEventListener("click", (e) => { const b = e.target.closest("[data-open]"); if (b) openFinding(b.dataset.open); });
  for (const ev of ["mouseover", "mouseout", "focusin", "focusout"]) app.addEventListener(ev, (e) => highlight(e.target.closest("[data-issue],[data-open]"), ev === "mouseover" || ev === "focusin"));
}

// ---------- share links (owner side)
async function loadShares(id) {
  const panel = document.getElementById("share-panel");
  try {
    const { shares } = await api("GET", `/api/audits/${id}/shares`);
    panel.innerHTML = `<p><strong>Share a read-only link</strong> <span class="muted small">Anyone with the link can view this report (not the input). Links expire and can be revoked.</span></p>
      <div class="share-create"><label class="small">Expires in <input id="share-days" type="number" min="1" max="90" value="7"> days</label> <button type="button" id="share-create">Create link</button></div>
      <ul class="share-list">${shares.filter((s) => !s.revoked && !s.expired).map((s) => `<li><input class="share-url" readonly value="${R.esc(location.origin)}/s/${R.esc(s.token)}"><button type="button" data-copy-share="${R.esc(s.token)}">Copy</button><button type="button" class="link" data-revoke="${R.esc(s.token)}">Revoke</button> <span class="muted small">expires ${R.esc(new Date(s.expires_at).toLocaleDateString())}</span></li>`).join("") || '<li class="muted">No active links.</li>'}</ul>`;
    document.getElementById("share-create").addEventListener("click", async () => {
      const days = Number(document.getElementById("share-days").value) || 7;
      try { const s = await api("POST", `/api/audits/${id}/shares`, { json: { expires_in_days: days } }); await copyToClipboard(`${location.origin}/s/${s.token}`, "Share link created and copied."); loadShares(id); }
      catch (e) { notice(e.message); }
    });
    panel.querySelectorAll("[data-copy-share]").forEach((b) => b.addEventListener("click", () => copyToClipboard(`${location.origin}/s/${b.dataset.copyShare}`, "Share link copied.")));
    panel.querySelectorAll("[data-revoke]").forEach((b) => b.addEventListener("click", async () => { try { await api("DELETE", `/api/audits/${id}/shares/${b.dataset.revoke}`); loadShares(id); notice("Share link revoked.", "ok"); } catch (e) { notice(e.message); } }));
  } catch (e) { panel.innerHTML = `<p class="muted">${R.esc(e.message)}</p>`; }
}

// ---------- read-only share view
function shareTemplate(expiresAt) {
  return `<section class="analysis share-view">
  <div class="analysis-head">
    <h1>Shared report <span class="badge sim">read-only</span></h1>
    <a href="/" data-nav class="btn-like">Open UI/UX Auto Tester</a>
  </div>
  <p class="muted small">${expiresAt ? `This shared link expires on ${new Date(expiresAt).toLocaleDateString()}.` : ""} Simulated personas are AI simulations, not real participants.</p>
  <div id="status" hidden></div><div id="share-panel" hidden></div>
  <div id="summary"></div>
  <div id="comparison"></div>
  <div class="workspace">
    <section class="preview-pane" aria-labelledby="pv-h">
      <h2 id="pv-h" class="visually-hidden">Screenshot preview</h2>
      <nav id="flow-strip" class="flow-strip" hidden aria-label="Flow steps"></nav>
      <div class="preview-wrap"><img id="shot" alt="Shared screenshot"><div id="markers" class="markers"></div></div>
      <p class="muted small" id="shot-caption"></p>
      <p class="muted small">Hover or focus a marker to highlight its finding.</p>
      <p class="muted small" id="retention"></p>
    </section>
    <section class="results-pane">
      <div role="tablist" aria-label="Results" class="tabs">
        <button type="button" role="tab" id="tab-findings" data-tab="findings" aria-controls="panel-findings" aria-selected="true">Findings</button>
        <button type="button" role="tab" id="tab-personas" data-tab="personas" aria-controls="panel-personas" aria-selected="false" tabindex="-1">Simulated personas</button>
        <button type="button" role="tab" id="tab-coverage" data-tab="coverage" aria-controls="panel-coverage" aria-selected="false" tabindex="-1">Coverage &amp; limitations</button>
      </div>
      <div role="tabpanel" id="panel-findings" aria-labelledby="tab-findings" tabindex="0"></div>
      <div role="tabpanel" id="panel-personas" aria-labelledby="tab-personas" tabindex="0" hidden></div>
      <div role="tabpanel" id="panel-coverage" aria-labelledby="tab-coverage" tabindex="0" hidden></div>
    </section>
  </div>
</section>`;
}

async function showShare(token) {
  try {
    const data = await api("GET", `/api/shares/${token}`);
    app.innerHTML = shareTemplate(data.expires_at);
    current = { id: token, result: data.result, screens: data.screens ?? [], comparison: data.comparison, mediaBase: `/api/shares/${token}`, runInfo: {}, tab: "findings", selectedScreen: null };
    wireResultView();
    renderResultPanels();
    announce("Shared report loaded.");
  } catch (err) {
    app.innerHTML = `<section class="analysis"><h1>Shared report</h1><p class="notice">${R.esc(err.status === 410 ? "This shared report link has expired." : "This shared report was not found. It may have been revoked or deleted.")}</p><p><a href="/" data-nav>Open UI/UX Auto Tester</a></p></section>`;
  }
}

async function tick(id) {
  if (poll.id !== id) return;
  try {
    const status = await api("GET", `/api/audits/${id}`);
    current.status = status;
    if (status.last_seq !== current.lastSeq || !current.result) {
      const r = await api("GET", `/api/audits/${id}/result`);
      current.result = r.result;
      current.lastSeq = status.last_seq;
    }
    renderAnalysis();
    if (!TERMINAL.has(status.status)) { poll.timer = setTimeout(() => tick(id), 1000); return; }
    announce(`Analysis ${R.STATUS_LABELS[status.status].toLowerCase()}.`);
    if (status.status === "COMPLETED") rememberRecent({ id, at: status.finished_at ?? Date.now(), headline: current.result?.summary?.headline ?? "" });
    if (status.links?.retest_of && !current.comparison) {
      try { current.comparison = await api("GET", `/api/audits/${id}/comparison`); renderAnalysis(); } catch { /* comparison is best-effort */ }
    }
  } catch (err) {
    if (err.status === 404) { notice("This analysis does not exist or has been deleted."); forgetRecent(id); app.querySelector(".workspace")?.remove(); return; }
    notice(err.message || "Could not load the analysis.");
    poll.timer = setTimeout(() => tick(id), 3000);
  }
}

function renderAnalysis() {
  const { status } = current;
  document.getElementById("status").innerHTML = R.renderStages(status);
  const done = status.status === "COMPLETED";
  document.getElementById("retest").hidden = !done;
  document.getElementById("share-btn").hidden = !done;
  for (const [elId, fmt] of [["dl-md", "md"], ["dl-csv", "csv"]]) {
    const a = document.getElementById(elId);
    a.hidden = !done;
    if (done) a.href = `/api/audits/${status.audit_id}/export?format=${fmt}`;
  }
  document.getElementById("cancel").hidden = TERMINAL.has(status.status);
  document.getElementById("retention").textContent = status.expires_at ? `Deleted automatically on ${new Date(status.expires_at).toLocaleDateString()}. Delete it earlier with the button above.` : "";
  const assign = document.getElementById("project-assign");
  assign.hidden = !done;
  if (done) { renderProjectSelect(status.audit_id); renderCompareSelect(status.audit_id); }
  else document.getElementById("compare-with").hidden = true;
  current.screens = status.screens ?? [];
  current.mediaBase = `/api/audits/${status.audit_id}`;
  current.runInfo = { seed: status.options?.seed, persona_ids: status.options?.persona_ids };
  renderResultPanels();
}

// ---------- side-by-side comparison of two analyses (W5)
async function showCompare(a, b) {
  app.innerHTML = `<section class="analysis"><div class="analysis-head"><h1>Comparison</h1><div class="actions"><a href="/a/${R.esc(a)}" data-nav class="btn-like">Open A</a><a href="/a/${R.esc(b)}" data-nav class="btn-like">Open B</a><a href="/" data-nav class="btn-like">New analysis</a></div></div><div id="pair"><p class="muted">Loading comparison…</p></div></section>`;
  try {
    const data = await api("GET", `/api/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`);
    const cap = (s) => s ? s[0].toUpperCase() + s.slice(1) : "";
    const differ = data.a?.device && data.b?.device && data.a.device !== data.b.device;
    const la = differ ? cap(data.a.device) : "A";
    const lb = differ ? cap(data.b.device) : "B";
    document.getElementById("pair").innerHTML = R.renderPairComparison(data, la, lb);
  } catch (err) { document.getElementById("pair").innerHTML = ""; notice(err.message || "Could not load the comparison."); }
}

function renderCompareSelect(auditId) {
  const sel = document.getElementById("compare-select");
  const others = recentList().filter((r) => r.id !== auditId);
  document.getElementById("compare-with").hidden = others.length === 0;
  sel.innerHTML = `<option value="">Choose an analysis…</option>${others.map((r) => `<option value="${R.esc(r.id)}">${R.esc((r.headline || r.id).slice(0, 60))}</option>`).join("")}`;
  sel.onchange = () => { if (sel.value) nav(`/compare/${auditId}/${sel.value}`); };
}

function renderProjectSelect(auditId) {
  const sel = document.getElementById("project-select");
  const projects = getProjects();
  const cur = recentList().find((r) => r.id === auditId)?.projectId ?? "";
  sel.innerHTML = `<option value="">None</option>${projects.map((p) => `<option value="${R.esc(p.id)}"${p.id === cur ? " selected" : ""}>${R.esc(p.name)}</option>`).join("")}`;
  sel.onchange = () => { assignAnalysis(auditId, sel.value || null, { headline: current.result?.summary?.headline ?? "" }); notice(sel.value ? "Added to project." : "Removed from project.", "ok"); };
}

// Renders the report body (summary, comparison, findings, personas, coverage, preview, flow strip) from `current`.
// Shared by the owner analysis page and the read-only share view.
function renderResultPanels() {
  const result = current.result;
  document.getElementById("summary").innerHTML = R.renderSummary(result);
  document.getElementById("comparison").innerHTML = current.comparison ? R.renderComparison(current.comparison) : "";
  document.getElementById("panel-findings").innerHTML = R.renderFindingGroups(result);
  document.getElementById("panel-personas").innerHTML = R.renderPersonas(result, current.runInfo ?? {});
  document.getElementById("panel-coverage").innerHTML = R.renderCoverage(result);
  const screens = [...(current.screens ?? [])].sort((a, b) => a.order - b.order);
  if (!current.selectedScreen && screens[0]) current.selectedScreen = screens[0].screen_id;
  renderFlowStrip(result, screens);
  paintScreen(result, screens);
  if (drawer.open && drawer.dataset.issue) {
    const f = (result?.findings ?? []).find((x) => x.issue_id === drawer.dataset.issue);
    if (f) drawer.querySelector(".drawer-body").innerHTML = R.renderFindingDetail(f, result);
  }
}

function screenLabel(result, screenId, screens) {
  const steps = result?.flow?.steps ?? [];
  const idx = steps.indexOf(screenId);
  const label = idx >= 0 ? result.flow.labels?.[idx] : null;
  const stepNo = idx >= 0 ? idx + 1 : screens.findIndex((s) => s.screen_id === screenId) + 1;
  return { stepNo, label };
}

function renderFlowStrip(result, screens) {
  const strip = document.getElementById("flow-strip");
  if (screens.length <= 1) { strip.hidden = true; strip.replaceChildren(); return; }
  strip.hidden = false;
  strip.replaceChildren();
  screens.forEach((s, i) => {
    if (i > 0) { const arrow = document.createElement("span"); arrow.className = "flow-arrow"; arrow.setAttribute("aria-hidden", "true"); arrow.textContent = "→"; strip.append(arrow); }
    const { stepNo, label } = screenLabel(result, s.screen_id, screens);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "flow-step" + (s.screen_id === current.selectedScreen ? " active" : "");
    btn.dataset.screen = s.screen_id;
    btn.setAttribute("aria-pressed", String(s.screen_id === current.selectedScreen));
    btn.setAttribute("aria-label", `Step ${stepNo}${label ? `: ${label}` : ""}`);
    const img = document.createElement("img"); img.alt = ""; img.className = "flow-thumb"; img.src = `${current.mediaBase}/media/${s.artifact_id}`;
    const cap = document.createElement("span"); cap.className = "flow-cap small"; cap.textContent = label ? `${stepNo}. ${label}` : `Step ${stepNo}`;
    btn.append(img, cap);
    strip.append(btn);
  });
}

function paintScreen(result, screens) {
  const shot = document.getElementById("shot");
  const screen = screens.find((s) => s.screen_id === current.selectedScreen) ?? screens[0];
  if (!screen) return;
  const src = `${current.mediaBase}/media/${screen.artifact_id}`;
  if (shot.getAttribute("src") !== src) shot.src = src;
  const { stepNo, label } = screenLabel(result, screen.screen_id, screens);
  document.getElementById("shot-caption").textContent = screens.length > 1 ? `Step ${stepNo}${label ? `: ${label}` : ""}` : "";
  renderMarkers(screen.screen_id);
}

function selectScreen(screenId) {
  current.selectedScreen = screenId;
  const screens = [...(current.screens ?? [])].sort((a, b) => a.order - b.order);
  renderFlowStrip(current.result, screens);
  paintScreen(current.result, screens);
}

function renderMarkers(selectedScreen) {
  const layer = document.getElementById("markers");
  const findings = (current.result?.findings ?? []).filter((f) => {
    const r = f.presentation?.regions?.[0];
    return f.presentation?.marker_number && r && (!selectedScreen || !r.ref || r.ref === selectedScreen);
  });
  layer.replaceChildren();
  // Positions are set through the CSSOM, not inline style attributes, so the strict CSP (style-src 'self',
  // no 'unsafe-inline') stays intact. Percentages are of the preview, so markers hold at any zoom.
  for (const f of findings) {
    const r = f.presentation.regions[0];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `marker type-${f.finding_type}`;
    btn.dataset.open = f.issue_id;
    btn.dataset.issue = f.issue_id;
    btn.setAttribute("aria-label", `Marker ${f.presentation.marker_number}: ${f.title}`);
    Object.assign(btn.style, { left: `${r.x * 100}%`, top: `${r.y * 100}%`, width: `${r.w * 100}%`, height: `${r.h * 100}%` });
    const num = document.createElement("span");
    num.className = "marker-num";
    num.setAttribute("aria-hidden", "true");
    num.textContent = String(f.presentation.marker_number);
    btn.append(num);
    layer.append(btn);
  }
}

function highlight(el, on) {
  const issue = el?.dataset?.issue ?? el?.dataset?.open;
  if (!issue) return;
  for (const node of app.querySelectorAll(`[data-issue="${CSS.escape(issue)}"]`)) node.classList.toggle("hl", on);
}

// Load comment threads for the current report (owner or share view) and refresh the open drawer thread.
async function loadComments() {
  if (!current.mediaBase) return;
  try { const { comments } = await api("GET", `${current.mediaBase}/comments`); current.comments = comments; }
  catch { current.comments = current.comments ?? []; }
  if (drawer.open && drawer.dataset.issue) {
    const sec = drawer.querySelector(".comments");
    if (sec) sec.outerHTML = R.renderComments(current.comments, drawer.dataset.issue); // drawer-body listeners are delegated, so they survive this
  }
}

function selectTab(name) {
  current.tab = name;
  for (const t of document.querySelectorAll("[role=tab]")) {
    const on = t.dataset.tab === name;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  }
}

function openFinding(issueId) {
  const f = (current.result?.findings ?? []).find((x) => x.issue_id === issueId);
  if (!f) return;
  const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  drawer.dataset.issue = issueId;
  drawer.innerHTML = `<form method="dialog" class="drawer-bar">
    <button type="button" data-copy="md">Copy Markdown</button>
    <button type="button" data-copy="github">Copy GitHub issue</button>
    <button type="button" data-copy="jira">Copy Jira</button>
    <button value="close">Close</button>
  </form><div class="drawer-body">${R.renderFindingDetail(f, current.result)}${R.renderComments(current.comments ?? [], issueId)}</div>`;
  drawer.querySelector(".drawer-bar").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-copy]"); if (!b) return;
    if (b.dataset.copy === "github") { const gh = R.findingToGithubIssue(f, current.result); copyToClipboard(`${gh.title}\n\n${gh.body}`, "GitHub issue copied (the first line is the suggested title)."); }
    else if (b.dataset.copy === "jira") copyToClipboard(R.findingToJira(f, current.result), "Jira markup copied.");
    else copyToClipboard(R.findingToMarkdown(f, current.result), "Finding copied as Markdown.");
  });
  const body = drawer.querySelector(".drawer-body");
  body.addEventListener("submit", async (e) => {
    const form = e.target.closest(".comment-form"); if (!form) return;
    e.preventDefault();
    const text = form.querySelector(".comment-body-input").value.trim();
    if (!text) return;
    try { await api("POST", `${current.mediaBase}/comments`, { json: { issue_id: issueId, body: text, author_name: form.querySelector(".comment-name").value.trim() } }); await loadComments(); announce("Comment added."); }
    catch (err) { notice(err.message); }
  });
  body.addEventListener("click", async (e) => {
    const del = e.target.closest("[data-del-comment]"); if (!del) return;
    try { await api("DELETE", `${current.mediaBase}/comments/${del.dataset.delComment}`); await loadComments(); notice("Comment deleted.", "ok"); }
    catch (err) { notice(err.message); }
  });
  loadComments();
  const url = new URL(location.href); url.searchParams.set("f", issueId); history.replaceState({}, "", url);
  drawer.addEventListener("close", () => {
    const u = new URL(location.href); u.searchParams.delete("f"); history.replaceState({}, "", u);
    delete drawer.dataset.issue;
    if (opener && document.contains(opener)) opener.focus(); // return focus to the finding that opened the drawer
  }, { once: true });
  if (!drawer.open) drawer.showModal();
}

async function deleteAnalysis(id) {
  if (!confirm("Delete this analysis? The screenshot, evidence, and results are removed permanently.")) return;
  try {
    await api("DELETE", `/api/audits/${id}`);
    forgetRecent(id);
    nav("/");
    notice("Analysis deleted.", "ok");
  } catch (err) { notice(err.message || "Could not delete the analysis."); }
}

route();
