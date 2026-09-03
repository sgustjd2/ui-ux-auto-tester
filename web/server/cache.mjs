// Result cache (WNFR-02, W-R-02): reuse a completed result when the same screenshot(s) are analyzed again with
// the same options, instead of re-running the (expensive) core. The cache is content-addressed on the RESULT,
// which is a pure function of the input — screenshot bytes, options, intent, and the core/corpus/model versions —
// so a cached result carries no per-audit user data (no comments, shares, or ids) and is safe to reuse across
// sessions. A core upgrade changes the versions and so misses the old cache. Pure functions; the store does IO.

import { createHash } from "node:crypto";

// A stable key over everything that determines the result. Screen order matters (a flow), so screen hashes are
// kept in order; persona ids are sorted (order does not change the finding set). Versions bust the cache on upgrade.
export function contentKey({ screenHashes = [], analysis_type = null, persona_ids = [], device_hint = null, question = null, task = null, retest_of = null, versions = {} } = {}) {
  const canonical = JSON.stringify({
    s: [...screenHashes],
    at: analysis_type,
    p: [...persona_ids].sort(),
    d: device_hint,
    q: question,
    t: task,
    r: retest_of,
    v: { core: versions.core_version ?? null, corpus: versions.corpus_version ?? null, fs: versions.finding_schema_version ?? null, contract: versions.contract_version ?? null },
  });
  return createHash("sha256").update(canonical).digest("hex");
}

// Rewrite a cached envelope's ids to a new audit: audit id, and each screen and artifact id by order. Single-pass
// replacement so an inserted id (which can contain another id as a substring) is never re-scanned and corrupted.
export function remapEnvelope(envelope, from, to) {
  const map = new Map();
  if (from.audit_id && to.audit_id) map.set(from.audit_id, to.audit_id);
  (from.screens ?? []).forEach((s, i) => {
    const t = (to.screens ?? [])[i];
    if (!t) return;
    if (s.screen_id && t.screen_id) map.set(s.screen_id, t.screen_id);
    if (s.artifact_id && t.artifact_id) map.set(s.artifact_id, t.artifact_id);
  });
  let text = JSON.stringify(envelope);
  const tokens = [...map.keys()].filter(Boolean);
  if (tokens.length) {
    const escape = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(tokens.sort((a, b) => b.length - a.length).map(escape).join("|"), "g");
    text = text.replace(re, (m) => map.get(m));
  }
  return JSON.parse(text);
}
