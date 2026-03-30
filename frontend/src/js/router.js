import { auth } from "./state/auth.js";
import { ui } from "./ui/ui.js";

import { pageLogin } from "./pages/login.js";
import { pageDashboard } from "./pages/dashboard.js";
import { pageClientes } from "./pages/clientes.js";
import { pageAtivos } from "./pages/ativos.js";
import { pageSoftwares } from "./pages/softwares.js";
import { pageInstalacoes } from "./pages/instalacoes.js";
import { pageChamados } from "./pages/chamados.js";
import { pageUsuarios } from "./pages/usuarios.js";

const viewEl = document.getElementById("view");

const routeTable = [
  { path: "/login", auth: false, render: pageLogin },
  { path: "/dashboard", auth: true, render: pageDashboard },
  { path: "/clientes", auth: true, render: pageClientes },
  { path: "/ativos", auth: true, render: pageAtivos },
  { path: "/softwares", auth: true, render: pageSoftwares },
  { path: "/instalacoes", auth: true, render: pageInstalacoes },
  { path: "/chamados", auth: true, render: pageChamados },
  { path: "/usuarios", auth: true, render: pageUsuarios },
];

function getPath() {
  const hash = location.hash || "#/dashboard";
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const [path] = raw.split("?");
  return path || "/dashboard";
}

export function navigateTo(path) {
  location.hash = `#${path}`;
}

export async function renderRoute() {
  const path = getPath();
  const route = routeTable.find((r) => r.path === path) || routeTable[1];

  if (route.auth && !auth.isAuthenticated()) {
    navigateTo("/login");
    return;
  }
  if (!route.auth && auth.isAuthenticated() && path === "/login") {
    navigateTo("/dashboard");
    return;
  }

  try {
    viewEl.innerHTML = `<div class="text-white-50 small">Carregando…</div>`;
    const node = await route.render();
    viewEl.innerHTML = "";
    viewEl.appendChild(node);
    document.getElementById("app")?.focus();
  } catch (err) {
    console.error(err);
    ui.toast("Falha ao renderizar a tela.", { variant: "danger" });
    viewEl.innerHTML = `
      <div class="card app-card">
        <div class="card-body">
          <div class="fw-semibold">Erro ao abrir a tela</div>
          <div class="text-white-50 small mt-1">${ui.escapeHtml(String(err?.message || err))}</div>
        </div>
      </div>
    `;
  }
}

export const routes = {
  init() {
    // apenas para deixar explícito o ponto de inicialização
  },
};

