import { h, qs, formToObject } from "../ui/dom.js";
import { ui } from "../ui/ui.js";

export async function buildCrudPage(config) {
  const root = h("div");
  const items = await config.service.list();

  root.innerHTML = `
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
      <div>
        <h1 class="h4 mb-1">${config.title}</h1>
        <div class="text-white-50 small">${config.subtitle || ""}</div>
      </div>
      <button class="btn btn-primary btn-sm" id="btnNovo">Novo</button>
    </div>
    <div class="card app-card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead><tr>${config.columns.map((c) => `<th>${c.label}</th>`).join("")}<th>Ações</th></tr></thead>
            <tbody id="tbodyRows"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const tbody = qs("#tbodyRows", root);
  function drawRows(list) {
    tbody.innerHTML = list.length
      ? list
          .map((row) => {
            return `
            <tr>
              ${config.columns.map((c) => `<td>${ui.escapeHtml(String(row[c.key] ?? "—"))}</td>`).join("")}
              <td class="text-nowrap">
                <button class="btn btn-outline-light btn-sm me-1" data-action="edit" data-id="${row[config.idField]}">Editar</button>
                <button class="btn btn-outline-danger btn-sm" data-action="del" data-id="${row[config.idField]}">Excluir</button>
              </td>
            </tr>
          `;
          })
          .join("")
      : `<tr><td colspan="${config.columns.length + 1}"><div class="empty-state m-3">Nenhum registro.</div></td></tr>`;
  }
  drawRows(items);

  function openModal(current = null) {
    const modalId = `modal_${crypto.randomUUID()}`;
    const formHtml = `
      <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <form class="modal-content bg-dark text-white border border-white border-opacity-10" id="formCrud">
            <div class="modal-header border-white border-opacity-10">
              <h5 class="modal-title">${current ? "Editar" : "Novo"} ${config.itemLabel || "registro"}</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                ${config.fields
                  .map((f) => {
                    const value = current?.[f.name] ?? "";
                    if (f.type === "select") {
                      return `
                        <div class="${f.col || "col-12 col-md-6"}">
                          <label class="form-label">${f.label}</label>
                          <select class="form-select" name="${f.name}" ${f.required ? "required" : ""}>
                            <option value="">Selecione...</option>
                            ${(f.options || [])
                              .map((op) => `<option value="${op.value}" ${String(op.value) === String(value) ? "selected" : ""}>${op.label}</option>`)
                              .join("")}
                          </select>
                        </div>
                      `;
                    }
                    if (f.type === "textarea") {
                      return `
                        <div class="${f.col || "col-12"}">
                          <label class="form-label">${f.label}</label>
                          <textarea class="form-control" name="${f.name}" rows="3" ${f.required ? "required" : ""}>${ui.escapeHtml(String(value))}</textarea>
                        </div>
                      `;
                    }
                    return `
                      <div class="${f.col || "col-12 col-md-6"}">
                        <label class="form-label">${f.label}</label>
                        <input class="form-control" name="${f.name}" type="${f.type || "text"}" value="${ui.escapeHtml(String(value))}" ${f.required ? "required" : ""} />
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
            <div class="modal-footer border-white border-opacity-10">
              <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-primary">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", formHtml);
    const modalEl = document.getElementById(modalId);
    const modal = new bootstrap.Modal(modalEl);
    const form = qs("#formCrud", modalEl);

    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const payload = formToObject(form);
      try {
        if (current) {
          await config.service.update(current[config.idField], payload);
          ui.toast("Registro atualizado.", { variant: "success" });
        } else {
          await config.service.create(payload);
          ui.toast("Registro criado.", { variant: "success" });
        }
        modal.hide();
        const latest = await config.service.list();
        drawRows(latest);
      } catch (err) {
        ui.toast(err.message || "Erro ao salvar.", { variant: "danger" });
      }
    });

    modalEl.addEventListener("hidden.bs.modal", () => modalEl.remove());
    modal.show();
  }

  qs("#btnNovo", root).addEventListener("click", () => openModal());
  tbody.addEventListener("click", async (ev) => {
    const btn = ev.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id");
    const latest = await config.service.list();
    const row = latest.find((x) => String(x[config.idField]) === String(id));
    if (!row) return;
    if (action === "edit") {
      openModal(row);
      return;
    }
    if (action === "del") {
      const ok = window.confirm("Confirma exclusão do registro?");
      if (!ok) return;
      try {
        await config.service.remove(id);
        const after = await config.service.list();
        drawRows(after);
        ui.toast("Registro removido.", { variant: "info" });
      } catch (err) {
        ui.toast(err.message || "Erro ao remover.", { variant: "danger" });
      }
    }
  });

  return root;
}

