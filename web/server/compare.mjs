// Retest comparison (W5): classify a current run's findings against a baseline run as fixed / unresolved / new /
// regressed. Keyed on the core-supplied stable issue identity (`finding.fingerprint`, W-OD-11); when a finding
// has no fingerprint it falls back to a provisional key over stable-ish fields, and the result is flagged
// `matching: "provisional"` so the UI can say so. Pure functions over finding lists — no I/O.

// A stable-enough key for a finding when the core did not supply a fingerprint.
export function findingKey(f) {
  if (f.fingerprint) return { key: String(f.fingerprint), provisional: false };
  const rules = (f.rules ?? []).map((r) => r.id).sort().join(",");
  const heur = (f.heuristics ?? []).slice().sort().join(",");
  return { key: `${f.finding_type}|${rules}|${heur}|${f.component ?? ""}|${f.location ?? ""}`, provisional: true };
}

const summarize = (f) => f && ({ issue_id: f.issue_id, title: f.title, finding_type: f.finding_type, severity: f.severity, priority: f.priority, confidence: f.confidence, fingerprint: f.fingerprint ?? null, presentation: f.presentation });

/**
 * @param {object[]} baseline findings of the prior run
 * @param {object[]} current  findings of the retest run
 * @param {object} [opts]
 * @param {Set<string>} [opts.priorKeys] keys seen in runs older than the baseline (for regressed detection)
 * @returns {{matching:'fingerprint'|'provisional', fixed:object[], unresolved:object[], new:object[], regressed:object[], counts:object}}
 */
export function compareFindings(baseline = [], current = [], { priorKeys = new Set() } = {}) {
  let provisional = false;
  const keyOf = (f) => { const k = findingKey(f); if (k.provisional) provisional = true; return k.key; };

  const baseByKey = new Map();
  for (const f of baseline) baseByKey.set(keyOf(f), f);
  const curByKey = new Map();
  for (const f of current) curByKey.set(keyOf(f), f);

  const fixed = [];
  const unresolved = [];
  const added = [];
  const regressed = [];

  for (const [k, f] of baseByKey) if (!curByKey.has(k)) fixed.push(summarize(f));
  for (const [k, f] of curByKey) {
    if (baseByKey.has(k)) unresolved.push({ baseline: summarize(baseByKey.get(k)), current: summarize(f) });
    else if (priorKeys.has(k)) regressed.push(summarize(f)); // absent in baseline but seen before it: came back
    else added.push(summarize(f));
  }

  const counts = { fixed: fixed.length, unresolved: unresolved.length, new: added.length, regressed: regressed.length };
  return { matching: provisional ? "provisional" : "fingerprint", fixed, unresolved, new: added, regressed, counts };
}

// The set of finding keys present in a run (used to accumulate history across a retest chain).
export function keysOf(findings = []) {
  return new Set(findings.map((f) => findingKey(f).key));
}
