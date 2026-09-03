// Client-side projects (W5 groundwork): group this browser's analyses into named projects. There are no
// accounts yet, so projects live in localStorage alongside the "recent" registry of analyses this browser knows.
// These are pure functions over plain arrays so they are unit-testable without a browser; app.mjs wraps them
// with localStorage. The server is unchanged — a project is just a client-side grouping of audit ids.

// The analysis registry is the "recent" list: [{ id, at, headline, projectId? }]. It doubles as recent activity
// (the UI shows the newest few) and as the set a project filters over.

export function analysesInProject(registry = [], projectId) {
  return registry.filter((r) => r.projectId === projectId).sort((a, b) => (b.at ?? 0) - (a.at ?? 0));
}

// Upsert an analysis into the registry, setting its project. Returns a new registry (newest first).
export function assignToProject(registry = [], auditId, projectId, meta = {}) {
  const i = registry.findIndex((r) => r.id === auditId);
  if (i >= 0) return registry.map((r) => (r.id === auditId ? { ...r, projectId } : r));
  return [{ id: auditId, at: meta.at ?? Date.now(), headline: meta.headline ?? "", projectId }, ...registry];
}

export function addProject(projects = [], name, id) {
  const clean = String(name ?? "").trim().slice(0, 60);
  if (!clean) return { projects, project: null };
  const project = { id, name: clean, created: Date.now() };
  return { projects: [project, ...projects].slice(0, 50), project };
}

export function renameProject(projects = [], id, name) {
  const clean = String(name ?? "").trim().slice(0, 60);
  return clean ? projects.map((p) => (p.id === id ? { ...p, name: clean } : p)) : projects;
}

// Remove a project and unassign its analyses (the analyses themselves stay in the registry, just ungrouped).
export function removeProject(projects = [], registry = [], id) {
  return {
    projects: projects.filter((p) => p.id !== id),
    registry: registry.map((r) => (r.projectId === id ? { ...r, projectId: null } : r)),
  };
}

// Projects annotated with how many analyses each contains, newest project first.
export function projectsWithCounts(projects = [], registry = []) {
  return projects.map((p) => ({ ...p, count: registry.filter((r) => r.projectId === p.id).length }));
}
