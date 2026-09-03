// Structured, PII-safe logging (WNFR-09 observability). One JSON object per line, carrying an audit/trace id and
// timings so an audit can be followed end to end, while never recording image bytes or user text. As defense in
// depth the logger itself drops fields whose names are known to carry content, so a careless caller cannot leak.

const REDACT = new Set([
  "question", "task", "body", "headline", "title", "observed", "expected", "impact", "recommendation",
  "author_name", "label", "bytes", "image", "note", "text", "summary", "answer_to_question",
]);

const LEVELS = { silent: 0, error: 1, info: 2, debug: 3 };

function safe(fields = {}) {
  const out = {};
  for (const [k, v] of Object.entries(fields)) {
    if (REDACT.has(k)) out[k] = "[redacted]";
    else if (v !== undefined) out[k] = v;
  }
  return out;
}

/**
 * @param {object} [opts]
 * @param {string} [opts.level="info"] silent | error | info | debug
 * @param {(line:string)=>void} [opts.write] sink; defaults to stderr so logs never mingle with data on stdout
 * @param {()=>number} [opts.now]
 */
export function createLogger({ level = "info", write = (line) => process.stderr.write(line + "\n"), now = () => Date.now() } = {}) {
  const threshold = LEVELS[level] ?? LEVELS.info;
  const emit = (lvl, event, fields) => {
    if ((LEVELS[lvl] ?? LEVELS.info) > threshold) return;
    write(JSON.stringify({ ts: new Date(now()).toISOString(), level: lvl, event, ...safe(fields) }));
  };
  return {
    info: (event, fields) => emit("info", event, fields),
    error: (event, fields) => emit("error", event, fields),
    debug: (event, fields) => emit("debug", event, fields),
  };
}

// A no-op logger for tests and callers that do not want logging.
export const nullLogger = { info() {}, error() {}, debug() {} };
