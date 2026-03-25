import { storage } from "../utils/storage.js";

const KEY_API_MODE = "ts_api_mode"; // "mock" | "real"

function ensureToastContainer() {
  const el = document.getElementById("toastRegion");
  if (!el) throw new Error("toastRegion não encontrado");
  return el;
}

export const ui = {
  escapeHtml(input) {
    return String(input)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  },

  toast(message, { variant = "info" } = {}) {
    const container = ensureToastContainer();
    const id = `t_${crypto.randomUUID()}`;
    const bg = variant === "danger" ? "text-bg-danger" : variant === "success" ? "text-bg-success" : "text-bg-dark";
    const html = `
      <div id="${id}" class="toast ${bg} border-0" role="status" aria-live="polite" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">${this.escapeHtml(message)}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", html);
    const toastEl = document.getElementById(id);
    const t = new bootstrap.Toast(toastEl, { delay: 3500 });
    toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
    t.show();
  },

  getApiMode() {
    return storage.get(KEY_API_MODE) || "mock";
  },

  toggleApiMode() {
    const next = this.getApiMode() === "mock" ? "real" : "mock";
    storage.set(KEY_API_MODE, next);
    return next;
  },
};

