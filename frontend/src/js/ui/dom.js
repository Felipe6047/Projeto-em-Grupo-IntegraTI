export function h(tag, { className, attrs = {}, text, html, children = [], on } = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text != null) el.textContent = text;
  if (html != null) el.innerHTML = html;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v == null) return;
    el.setAttribute(k, String(v));
  });
  Object.entries(on || {}).forEach(([evt, fn]) => el.addEventListener(evt, fn));
  (children || []).forEach((c) => el.appendChild(c));
  return el;
}

export function qs(sel, root = document) {
  return root.querySelector(sel);
}

export function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

export function formToObject(formEl) {
  const fd = new FormData(formEl);
  const obj = {};
  for (const [k, v] of fd.entries()) {
    obj[k] = typeof v === "string" ? v.trim() : v;
  }
  return obj;
}

