import { h } from "../ui/dom.js";
import { api } from "../api/services.js";
import { auth } from "../state/auth.js";

export async function pageDashboard() {
  const user = auth.getUser();
  const rows = await api.dashboard.ativos();
  const chamados = await api.chamados.list();

  const totalAtivos = rows.length;
  const totalChamados = chamados.length;
  const chamadosAbertos = chamados.filter((c) => c.status_chamado === "aberto").length;
  const totalSoftwares = rows.reduce((acc, r) => acc + Number(r.total_softwares || 0), 0);

  const root = h("div", {
    html: `
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h1 class="h4 mb-1">Dashboard</h1>
          <div class="text-white-50 small">Visão integrada de ativos, softwares e chamados.</div>
        </div>
        <span class="badge badge-soft">Usuário: ${user?.nome || "—"}</span>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card app-card"><div class="card-body kpi"><div><div class="kpi-label">Ativos</div><div class="kpi-value">${totalAtivos}</div></div></div></div>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card app-card"><div class="card-body kpi"><div><div class="kpi-label">Chamados</div><div class="kpi-value">${totalChamados}</div></div></div></div>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card app-card"><div class="card-body kpi"><div><div class="kpi-label">Chamados Abertos</div><div class="kpi-value">${chamadosAbertos}</div></div></div></div>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card app-card"><div class="card-body kpi"><div><div class="kpi-label">Softwares Instalados</div><div class="kpi-value">${totalSoftwares}</div></div></div></div>
        </div>
      </div>

      <div class="card app-card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="h6 mb-0">Ativos por Cliente (JOIN)</h2>
          <span class="text-white-50 small">Fonte: /api/dashboard/ativos</span>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0 align-middle">
              <thead>
                <tr>
                  <th>Ativo</th>
                  <th>Tipo</th>
                  <th>Cliente</th>
                  <th>Softwares</th>
                  <th>Chamados</th>
                </tr>
              </thead>
              <tbody>
                ${
                  rows.length
                    ? rows
                        .map(
                          (r) => `
                    <tr>
                      <td>${r.ativo_nome}</td>
                      <td>${r.ativo_tipo || "—"}</td>
                      <td>${r.cliente_nome || "—"}</td>
                      <td>${r.total_softwares ?? 0}</td>
                      <td>${r.total_chamados ?? 0}</td>
                    </tr>
                  `
                        )
                        .join("")
                    : `<tr><td colspan="5"><div class="empty-state m-3">Sem dados no dashboard.</div></td></tr>`
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `,
  });

  return root;
}

