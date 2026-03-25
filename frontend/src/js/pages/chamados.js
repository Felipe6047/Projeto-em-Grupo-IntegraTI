import { h, qs, formToObject } from "../ui/dom.js";
import { api } from "../api/services.js";
import { ui } from "../ui/ui.js";

export async function pageChamados() {
  const root = h("div");
  const [ativos, usuarios, chamados] = await Promise.all([api.ativos.list(), api.usuarios.list(), api.chamados.list()]);

  root.innerHTML = `
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
      <div>
        <h1 class="h4 mb-1">Chamados</h1>
        <div class="text-white-50 small">Abertura e acompanhamento com histórico e anexos.</div>
      </div>
      <button class="btn btn-primary btn-sm" id="btnNovoChamado">Novo Chamado</button>
    </div>

    <div class="card app-card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Código</th>
                <th>Título</th>
                <th>Status</th>
                <th>Abertura</th>
                <th>Usuário</th>
                <th>Ativo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="tbChamados"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const tb = qs("#tbChamados", root);
  function userName(id) {
    return usuarios.find((u) => u.id_usuario === id)?.nome || "—";
  }
  function ativoName(id) {
    return ativos.find((a) => a.id_ativo === id)?.nome || "—";
  }
  function renderRows(list) {
    tb.innerHTML = list.length
      ? list
          .map(
            (c) => `
        <tr>
          <td>${ui.escapeHtml(c.codigo || "—")}</td>
          <td>${ui.escapeHtml(c.titulo || "—")}</td>
          <td><span class="badge badge-soft">${ui.escapeHtml(c.status_chamado || "—")}</span></td>
          <td>${ui.escapeHtml(c.data_abertura || "—")}</td>
          <td>${ui.escapeHtml(userName(c.id_usuario))}</td>
          <td>${ui.escapeHtml(ativoName(c.id_ativo))}</td>
          <td class="text-nowrap">
            <button class="btn btn-outline-light btn-sm me-1" data-action="edit" data-id="${c.id_chamado}">Editar</button>
            <button class="btn btn-outline-info btn-sm me-1" data-action="hist" data-id="${c.id_chamado}">Histórico</button>
            <button class="btn btn-outline-secondary btn-sm me-1" data-action="anx" data-id="${c.id_chamado}">Anexos</button>
            <button class="btn btn-outline-danger btn-sm" data-action="del" data-id="${c.id_chamado}">Excluir</button>
          </td>
        </tr>
      `
          )
          .join("")
      : `<tr><td colspan="7"><div class="empty-state m-3">Nenhum chamado cadastrado.</div></td></tr>`;
  }
  renderRows(chamados);

  function openFormModal(current = null) {
    const id = `m_${crypto.randomUUID()}`;
    const html = `
      <div class="modal fade" id="${id}" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <form id="fChamado" class="modal-content bg-dark text-white border border-white border-opacity-10">
            <div class="modal-header border-white border-opacity-10">
              <h5 class="modal-title">${current ? "Editar" : "Novo"} Chamado</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12 col-md-4"><label class="form-label">Código</label><input class="form-control" name="codigo" required value="${current?.codigo || ""}" /></div>
                <div class="col-12 col-md-8"><label class="form-label">Título</label><input class="form-control" name="titulo" required value="${current?.titulo || ""}" /></div>
                <div class="col-12"><label class="form-label">Descrição</label><textarea class="form-control" name="descricao" rows="3">${current?.descricao || ""}</textarea></div>
                <div class="col-12 col-md-4">
                  <label class="form-label">Status</label>
                  <select class="form-select" name="status_chamado" required>
                    ${["aberto", "em_andamento", "fechado"]
                      .map((s) => `<option value="${s}" ${current?.status_chamado === s ? "selected" : ""}>${s}</option>`)
                      .join("")}
                  </select>
                </div>
                <div class="col-12 col-md-4"><label class="form-label">Data Abertura</label><input class="form-control" type="datetime-local" name="data_abertura" required value="${current?.data_abertura || ""}" /></div>
                <div class="col-12 col-md-4"><label class="form-label">Data Fechamento</label><input class="form-control" type="datetime-local" name="data_fechamento" value="${current?.data_fechamento || ""}" /></div>
                <div class="col-12 col-md-4">
                  <label class="form-label">Ativo</label>
                  <select class="form-select" name="id_ativo" required>
                    <option value="">Selecione...</option>
                    ${ativos.map((a) => `<option value="${a.id_ativo}" ${current?.id_ativo === a.id_ativo ? "selected" : ""}>${a.nome}</option>`).join("")}
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label">Responsável</label>
                  <select class="form-select" name="id_usuario" required>
                    <option value="">Selecione...</option>
                    ${usuarios.map((u) => `<option value="${u.id_usuario}" ${current?.id_usuario === u.id_usuario ? "selected" : ""}>${u.nome} (${u.email})</option>`).join("")}
                  </select>
                </div>
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
    document.body.insertAdjacentHTML("beforeend", html);
    const el = document.getElementById(id);
    const md = new bootstrap.Modal(el);
    const form = qs("#fChamado", el);
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const payload = formToObject(form);
      if (current) await api.chamados.update(current.id_chamado, payload);
      else await api.chamados.create(payload);
      md.hide();
      const latest = await api.chamados.list();
      renderRows(latest);
      ui.toast("Chamado salvo.", { variant: "success" });
    });
    el.addEventListener("hidden.bs.modal", () => el.remove());
    md.show();
  }

  async function openHistory(idChamado) {
    const hist = await api.historico.listByChamado(idChamado);
    const id = `h_${crypto.randomUUID()}`;
    const html = `
      <div class="modal fade" id="${id}" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content bg-dark text-white border border-white border-opacity-10">
            <div class="modal-header border-white border-opacity-10">
              <h5 class="modal-title">Histórico do Chamado</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <form id="fHist" class="row g-2">
                  <div class="col-12 col-md-8"><input class="form-control" name="descricao" required placeholder="Descreva o evento..." /></div>
                  <div class="col-12 col-md-4"><button class="btn btn-primary w-100">Adicionar Evento</button></div>
                </form>
              </div>
              <div id="listHist">${hist
                .map((e) => `<div class="border border-white border-opacity-10 rounded p-2 mb-2"><div>${ui.escapeHtml(e.descricao || "")}</div><div class="small text-white-50">${ui.escapeHtml(e.data_evento || "")}</div></div>`)
                .join("") || '<div class="empty-state">Sem histórico.</div>'}</div>
            </div>
            <div class="modal-footer border-white border-opacity-10"><button class="btn btn-outline-light" data-bs-dismiss="modal">Fechar</button></div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);
    const el = document.getElementById(id);
    const md = new bootstrap.Modal(el);
    qs("#fHist", el).addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const fd = formToObject(ev.currentTarget);
      await api.historico.add(idChamado, { descricao: fd.descricao, data_evento: new Date().toISOString() });
      md.hide();
      openHistory(idChamado);
    });
    el.addEventListener("hidden.bs.modal", () => el.remove());
    md.show();
  }

  async function openAnexos(idChamado) {
    const anx = await api.anexos.listByChamado(idChamado);
    const id = `a_${crypto.randomUUID()}`;
    const html = `
      <div class="modal fade" id="${id}" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content bg-dark text-white border border-white border-opacity-10">
            <div class="modal-header border-white border-opacity-10">
              <h5 class="modal-title">Anexos do Chamado</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="fAnexo" class="row g-2 mb-3">
                <div class="col-12 col-md-6"><input class="form-control" name="nome_arquivo" required placeholder="Nome do arquivo" /></div>
                <div class="col-12 col-md-4"><input class="form-control" name="caminho" required placeholder="Caminho/URL" /></div>
                <div class="col-12 col-md-2"><button class="btn btn-primary w-100">Salvar</button></div>
              </form>
              <div id="listAnx">${anx
                .map((a) => `<div class="border border-white border-opacity-10 rounded p-2 mb-2"><div>${ui.escapeHtml(a.nome_arquivo || "")}</div><div class="small text-white-50">${ui.escapeHtml(a.caminho || "")}</div></div>`)
                .join("") || '<div class="empty-state">Sem anexos.</div>'}</div>
            </div>
            <div class="modal-footer border-white border-opacity-10"><button class="btn btn-outline-light" data-bs-dismiss="modal">Fechar</button></div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);
    const el = document.getElementById(id);
    const md = new bootstrap.Modal(el);
    qs("#fAnexo", el).addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const fd = formToObject(ev.currentTarget);
      await api.anexos.add(idChamado, { ...fd, data_upload: new Date().toISOString() });
      md.hide();
      openAnexos(idChamado);
    });
    el.addEventListener("hidden.bs.modal", () => el.remove());
    md.show();
  }

  qs("#btnNovoChamado", root).addEventListener("click", () => openFormModal());
  tb.addEventListener("click", async (ev) => {
    const btn = ev.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id");
    const current = (await api.chamados.list()).find((c) => c.id_chamado === id);
    if (action === "edit" && current) return openFormModal(current);
    if (action === "hist") return openHistory(id);
    if (action === "anx") return openAnexos(id);
    if (action === "del") {
      const ok = window.confirm("Confirma exclusão do chamado?");
      if (!ok) return;
      await api.chamados.remove(id);
      renderRows(await api.chamados.list());
      ui.toast("Chamado removido.", { variant: "info" });
    }
  });

  return root;
}

