import { h, qs } from "./dom.js";

export function createModal({ title, bodyNode, footerNode, size = "lg" }) {
  const id = `m_${crypto.randomUUID()}`;
  const root = h("div", {
    className: "modal fade",
    attrs: { id, tabindex: "-1", "aria-hidden": "true" },
    html: `
      <div class="modal-dialog modal-${size} modal-dialog-scrollable">
        <div class="modal-content bg-dark text-white border border-white border-opacity-10">
          <div class="modal-header border-white border-opacity-10">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer border-white border-opacity-10"></div>
        </div>
      </div>
    `,
  });

  qs(".modal-body", root).appendChild(bodyNode);
  qs(".modal-footer", root).appendChild(footerNode);
  document.body.appendChild(root);

  const modal = new bootstrap.Modal(root, { backdrop: "static" });
  root.addEventListener("hidden.bs.modal", () => root.remove());

  return { id, root, modal };
}

