// Filesystem persistence for audits (docs/web-product/architecture.md section 6). One directory per audit under
// a data directory outside the repository, random ids, hard deletion, retention sweep. Standard library only.
// ponytail: JSON files and an NDJSON event log; a database replaces this module behind the same functions if needed.

import { promises as fs, existsSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";
import { randomBytes } from "node:crypto";
import { tmpdir } from "node:os";

export const DEFAULT_DATA_DIR = join(tmpdir(), "ui-ux-auto-tester-web");

export const newId = (prefix, bytes = 16) => `${prefix}_${randomBytes(bytes).toString("base64url")}`;
const SAFE_ID = /^[a-z]{3}_[A-Za-z0-9_-]{6,}$/;
export const isSafeId = (id) => typeof id === "string" && SAFE_ID.test(id);

export function createStore(dataDir = DEFAULT_DATA_DIR) {
  const auditsDir = join(dataDir, "audits");
  const sharesDir = join(dataDir, "shares"); // global token -> share file, so a token resolves without the audit id
  const cacheDir = join(dataDir, "cache"); // content-addressed result cache (WNFR-02)
  mkdirSync(auditsDir, { recursive: true });
  mkdirSync(sharesDir, { recursive: true });
  mkdirSync(cacheDir, { recursive: true });
  const isCacheKey = (k) => typeof k === "string" && /^[a-f0-9]{64}$/.test(k);

  const dirOf = (auditId) => {
    if (!isSafeId(auditId)) throw Object.assign(new Error("invalid audit id"), { code: "not_found", status: 404 });
    return join(auditsDir, auditId);
  };
  const exists = (auditId) => isSafeId(auditId) && existsSync(join(auditsDir, auditId, "audit.json"));

  async function writeJson(path, value) {
    const tmp = `${path}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(value), "utf8");
    // ponytail: Windows fs.rename over an existing file can intermittently throw EPERM/EBUSY when a scanner or
    // indexer briefly holds the destination; retry a few times, then give up. Raise the cap if it ever proves shy.
    for (let attempt = 0; ; attempt++) {
      try { await fs.rename(tmp, path); return; }
      catch (e) {
        if (attempt >= 4 || !["EPERM", "EBUSY", "EEXIST", "EACCES"].includes(e.code)) { await fs.rm(tmp, { force: true }).catch(() => {}); throw e; }
        await new Promise((r) => setTimeout(r, 15 * (attempt + 1)));
      }
    }
  }
  async function readJson(path) {
    try { return JSON.parse(await fs.readFile(path, "utf8")); } catch (e) { if (e.code === "ENOENT") return null; throw e; }
  }

  return {
    dataDir,
    exists,
    async createAudit(audit) {
      const dir = dirOf(audit.audit_id);
      await fs.mkdir(join(dir, "artifacts"), { recursive: true });
      await writeJson(join(dir, "audit.json"), audit);
      return audit;
    },
    async readAudit(auditId) { return isSafeId(auditId) ? readJson(join(auditsDir, auditId, "audit.json")) : null; },
    async writeAudit(audit) { await writeJson(join(dirOf(audit.audit_id), "audit.json"), audit); },
    async writeArtifact(auditId, artifactId, ext, bytes) {
      if (!isSafeId(artifactId)) throw new Error("invalid artifact id");
      const path = join(dirOf(auditId), "artifacts", `${artifactId}.${ext}`);
      await fs.writeFile(path, bytes);
      return path;
    },
    async readArtifact(auditId, artifactId, ext) {
      if (!isSafeId(artifactId)) return null;
      try { return await fs.readFile(join(dirOf(auditId), "artifacts", `${artifactId}.${ext}`)); } catch (e) { if (e.code === "ENOENT") return null; throw e; }
    },
    async appendEvent(auditId, event) {
      await fs.appendFile(join(dirOf(auditId), "events.ndjson"), `${JSON.stringify(event)}\n`, "utf8");
    },
    async readEvents(auditId, sinceSeq = 0) {
      let text;
      try { text = await fs.readFile(join(dirOf(auditId), "events.ndjson"), "utf8"); } catch (e) { if (e.code === "ENOENT") return []; throw e; }
      return text.split("\n").filter(Boolean).map((l) => JSON.parse(l)).filter((e) => e.seq > sinceSeq);
    },
    async writeResult(auditId, result) { await writeJson(join(dirOf(auditId), "result.json"), result); },
    async readResult(auditId) { return isSafeId(auditId) ? readJson(join(auditsDir, auditId, "result.json")) : null; },
    async deleteAudit(auditId) {
      if (!isSafeId(auditId)) return false;
      const dir = join(auditsDir, auditId);
      if (!existsSync(dir)) return false;
      const audit = await readJson(join(dir, "audit.json")); // revoke this audit's share tokens too
      for (const token of audit?.shares ?? []) if (isSafeId(token)) await fs.rm(join(sharesDir, `${token}.json`), { force: true }).catch(() => {});
      await fs.rm(dir, { recursive: true, force: true });
      return true;
    },
    async writeShare(token, data) { if (!isSafeId(token)) throw new Error("invalid share token"); await writeJson(join(sharesDir, `${token}.json`), data); },
    async readShare(token) { return isSafeId(token) ? readJson(join(sharesDir, `${token}.json`)) : null; },
    async deleteShare(token) { if (isSafeId(token)) await fs.rm(join(sharesDir, `${token}.json`), { force: true }).catch(() => {}); },
    async writeCache(key, entry) { if (isCacheKey(key)) await writeJson(join(cacheDir, `${key}.json`), entry); },
    async readCache(key) { return isCacheKey(key) ? readJson(join(cacheDir, `${key}.json`)) : null; },
    // Remove cache entries older than maxAgeMs (by mtime). Cache entries hold no per-user data, so this is a
    // size bound, not a privacy requirement. Returns the number removed.
    async sweepCache(now = Date.now(), maxAgeMs = 30 * 86_400_000) {
      let removed = 0;
      let names;
      try { names = await fs.readdir(cacheDir); } catch { return 0; }
      for (const n of names) {
        if (!n.endsWith(".json")) continue;
        const p = join(cacheDir, n);
        try { if (now - (await fs.stat(p)).mtimeMs > maxAgeMs) { await fs.rm(p, { force: true }); removed++; } } catch { /* raced with another sweep */ }
      }
      return removed;
    },
    // Comments live one file per comment under the audit dir, so concurrent posts never contend on one file and
    // deleting the audit removes them all.
    async addComment(auditId, comment) {
      const dir = join(dirOf(auditId), "comments");
      await fs.mkdir(dir, { recursive: true });
      await writeJson(join(dir, `${comment.comment_id}.json`), comment);
    },
    async listComments(auditId) {
      const dir = join(dirOf(auditId), "comments");
      let names;
      try { names = await fs.readdir(dir); } catch (e) { if (e.code === "ENOENT") return []; throw e; }
      const out = [];
      for (const n of names) if (n.endsWith(".json")) { const c = await readJson(join(dir, n)); if (c) out.push(c); }
      return out.sort((a, b) => String(a.created).localeCompare(String(b.created)));
    },
    async deleteComment(auditId, commentId) {
      if (!isSafeId(commentId)) return false;
      const p = join(dirOf(auditId), "comments", `${commentId}.json`);
      if (!existsSync(p)) return false;
      await fs.rm(p, { force: true });
      return true;
    },
    async listAuditIds() {
      try { return (await fs.readdir(auditsDir)).filter(isSafeId).map((d) => basename(d)); } catch { return []; }
    },
    // Hard-delete every audit whose expires_at has passed. Returns the number removed.
    async sweepExpired(now = Date.now()) {
      let removed = 0;
      for (const id of await this.listAuditIds()) {
        const audit = await this.readAudit(id);
        if (!audit || Date.parse(audit.expires_at) <= now) { if (await this.deleteAudit(id)) removed++; }
      }
      return removed;
    },
  };
}
