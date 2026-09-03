// Presentation layer for findings (docs/web-product/web-product-prd.md section 10.4, domain-model.md section 3).
// A pure function over core fields. It never changes finding_type, severity, priority, or confidence, never
// creates findings, and only adds the namespaced `presentation` object.

export const GROUP_ORDER = ["BLOCKER", "CONFUSION", "IMPROVEMENT", "NOTE"];
const PRIORITY_RANK = { P0: 0, P1: 1, P2: 2, P3: 3 };
const SEVERITY_RANK = { Critical: 0, High: 1, Medium: 2, Low: 3, Informational: 4 };
const CONFIDENCE_RANK = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export function groupOf(f) {
  if (f.priority === "P0" || f.severity === "Critical") return "BLOCKER";
  if (f.finding_type === "USER_SIGNAL") return "CONFUSION";
  if (["P1", "P2"].includes(f.priority) && ["High", "Medium"].includes(f.severity)) return "IMPROVEMENT";
  return "NOTE";
}

const validRegion = (r) => r && ["x", "y", "w", "h"].every((k) => typeof r[k] === "number" && r[k] >= 0 && r[k] <= 1);

// Regions come from evidence items only (never from the free-text location).
export function regionsOf(f) {
  const out = [];
  for (const e of f.evidence ?? []) {
    const r = e?.value?.region;
    if (validRegion(r)) out.push({ x: r.x, y: r.y, w: r.w, h: r.h, ref: e.ref ?? null, method: e.method ?? null });
  }
  return out;
}

const rank = (f) => [GROUP_ORDER.indexOf(groupOf(f)), PRIORITY_RANK[f.priority] ?? 9, SEVERITY_RANK[f.severity] ?? 9, CONFIDENCE_RANK[f.confidence] ?? 9];
const compare = (a, b) => { const ra = rank(a), rb = rank(b); for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) return ra[i] - rb[i]; return 0; };

export function addPresentation(findings) {
  const ordered = [...findings].map((f, i) => ({ f, i })).sort((a, b) => compare(a.f, b.f) || a.i - b.i);
  let marker = 0;
  return ordered.map(({ f }, idx) => {
    const { presentation: _old, ...core } = f;
    const regions = regionsOf(core);
    const presentation = {
      group: groupOf(core),
      display_rank: idx + 1,
      marker_number: regions.length ? ++marker : null,
      regions,
    };
    return { ...core, presentation };
  });
}
