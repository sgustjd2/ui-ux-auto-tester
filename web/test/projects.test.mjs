import { test } from "node:test";
import assert from "node:assert/strict";
import { analysesInProject, assignToProject, addProject, renameProject, removeProject, projectsWithCounts } from "../ui/projects.mjs";

test("assignToProject upserts and sets the project without mutating the input", () => {
  const reg = [{ id: "aud_1", at: 1, headline: "one" }];
  const snapshot = structuredClone(reg);
  const after = assignToProject(reg, "aud_1", "prj_a");
  assert.deepEqual(reg, snapshot, "input is not mutated");
  assert.equal(after.find((r) => r.id === "aud_1").projectId, "prj_a");
  // an unknown audit is added newest-first
  const added = assignToProject(after, "aud_2", "prj_a", { headline: "two", at: 5 });
  assert.equal(added[0].id, "aud_2");
  assert.equal(added[0].projectId, "prj_a");
});

test("analysesInProject filters by project and orders newest first", () => {
  const reg = [
    { id: "a", at: 1, projectId: "p1" },
    { id: "b", at: 3, projectId: "p1" },
    { id: "c", at: 2, projectId: "p2" },
    { id: "d", at: 9 },
  ];
  assert.deepEqual(analysesInProject(reg, "p1").map((r) => r.id), ["b", "a"]);
  assert.deepEqual(analysesInProject(reg, "p2").map((r) => r.id), ["c"]);
  assert.deepEqual(analysesInProject(reg, "none"), []);
});

test("addProject trims, caps the name, and rejects empty", () => {
  const { projects, project } = addProject([], "  My App  ", "prj_1");
  assert.equal(project.name, "My App");
  assert.equal(projects.length, 1);
  assert.equal(addProject([], "   ", "prj_x").project, null);
  assert.equal(addProject([], "n".repeat(100), "prj_2").project.name.length, 60);
});

test("renameProject changes only the target and ignores empty names", () => {
  const projects = [{ id: "p1", name: "Old" }, { id: "p2", name: "Keep" }];
  assert.equal(renameProject(projects, "p1", "New").find((p) => p.id === "p1").name, "New");
  assert.deepEqual(renameProject(projects, "p1", "  "), projects, "empty rename is a no-op");
});

test("removeProject drops the project and ungroups its analyses", () => {
  const projects = [{ id: "p1", name: "A" }, { id: "p2", name: "B" }];
  const registry = [{ id: "a", projectId: "p1" }, { id: "b", projectId: "p2" }];
  const out = removeProject(projects, registry, "p1");
  assert.deepEqual(out.projects.map((p) => p.id), ["p2"]);
  assert.equal(out.registry.find((r) => r.id === "a").projectId, null, "analysis stays but is ungrouped");
  assert.equal(out.registry.find((r) => r.id === "b").projectId, "p2");
});

test("projectsWithCounts annotates each project with its analysis count", () => {
  const projects = [{ id: "p1", name: "A" }, { id: "p2", name: "B" }];
  const registry = [{ id: "a", projectId: "p1" }, { id: "b", projectId: "p1" }, { id: "c", projectId: "p2" }];
  const counts = Object.fromEntries(projectsWithCounts(projects, registry).map((p) => [p.id, p.count]));
  assert.deepEqual(counts, { p1: 2, p2: 1 });
});
