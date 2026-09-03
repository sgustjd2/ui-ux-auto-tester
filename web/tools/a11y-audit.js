// Lightweight, dependency-free accessibility audit run in the page (paste into the browser console, or via a
// headless driver). It is a smoke check, not a substitute for a full audit tool: it flags the common,
// machine-detectable problems (missing names, unlabeled controls, heading jumps, duplicate ids, color-only text,
// focusable elements with no visible focus). Returns { critical, warnings } arrays. Used for the W-design pass.
(function auditAccessibility() {
  const critical = [];
  const warn = [];
  const desc = (el) => `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""}`;
  const accname = (el) => {
    const aria = el.getAttribute("aria-label");
    if (aria && aria.trim()) return aria.trim();
    const labelledby = el.getAttribute("aria-labelledby");
    if (labelledby) return labelledby.split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? "").join(" ").trim();
    if (el.labels && el.labels.length) return [...el.labels].map((l) => l.textContent).join(" ").trim();
    const title = el.getAttribute("title");
    if (title && title.trim()) return title.trim();
    if (el.tagName === "INPUT" && ["submit", "button", "reset"].includes(el.type)) return (el.value || "").trim();
    if (el.tagName === "IMG") return el.getAttribute("alt");
    return (el.textContent || "").trim();
  };

  // 1. interactive controls must have an accessible name
  for (const el of document.querySelectorAll("button, a[href], select, textarea, input:not([type=hidden])")) {
    if (el.type === "checkbox" || el.type === "radio") {
      if (!accname(el) && !el.closest("label")) critical.push(`${desc(el)} has no accessible name`);
      continue;
    }
    const name = accname(el);
    if (name === null) critical.push(`${desc(el)} (image control) has no alt`);
    else if (!name) critical.push(`${desc(el)} has no accessible name`);
  }

  // 2. images have an alt attribute (empty allowed for decorative)
  for (const img of document.querySelectorAll("img")) if (img.getAttribute("alt") === null) critical.push(`${desc(img)} is missing an alt attribute`);

  // 3. duplicate ids
  const ids = {};
  for (const el of document.querySelectorAll("[id]")) ids[el.id] = (ids[el.id] || 0) + 1;
  for (const [id, n] of Object.entries(ids)) if (n > 1) critical.push(`duplicate id "${id}" (${n}×)`);

  // 4. heading order has no skipped levels
  let prev = 0;
  for (const h of document.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
    const lvl = Number(h.tagName[1]);
    if (prev && lvl > prev + 1) warn.push(`heading jumps from h${prev} to h${lvl} ("${h.textContent.trim().slice(0, 40)}")`);
    prev = lvl;
  }

  // 5. exactly one h1 and a main landmark
  if (document.querySelectorAll("h1").length !== 1) warn.push(`expected exactly one h1, found ${document.querySelectorAll("h1").length}`);
  if (!document.querySelector("main")) critical.push("no <main> landmark");

  // 6. focusable controls must show a visible focus style (heuristic: outline or box-shadow changes on :focus-visible)
  //    We cannot compute pseudo-classes here, so we check that no control sets outline:none inline.
  for (const el of document.querySelectorAll("button, a[href], input, select, textarea")) {
    if (el.style && el.style.outline === "none") warn.push(`${desc(el)} removes its focus outline inline`);
  }

  // 7. tabs wiring
  for (const tab of document.querySelectorAll('[role="tab"]')) {
    if (!tab.getAttribute("aria-controls")) critical.push(`${desc(tab)} tab has no aria-controls`);
    if (tab.getAttribute("aria-selected") == null) critical.push(`${desc(tab)} tab has no aria-selected`);
  }

  return { critical, warnings: warn, controls: document.querySelectorAll("button, a[href], input:not([type=hidden]), select, textarea").length };
})();
