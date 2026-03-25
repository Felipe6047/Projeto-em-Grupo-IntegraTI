import { routes, navigateTo, renderRoute } from "./router.js";
import { auth } from "./state/auth.js";
import { ui } from "./ui/ui.js";

const navLinksEl = document.getElementById("navLinks");
const btnLogout = document.getElementById("btnLogout");
const btnApiMode = document.getElementById("btnApiMode");

function setApiModeButton() {
  const mode = ui.getApiMode();
  btnApiMode.textContent = mode === "mock" ? "API: Mock" : "API: Real";
  btnApiMode.classList.toggle("btn-outline-light", true);
}

function renderNav() {
  const isAuthed = auth.isAuthenticated();
  const links = [
    { href: "#/dashboard", label: "Dashboard", auth: true },
    { href: "#/clientes", label: "Clientes", auth: true },
    { href: "#/ativos", label: "Ativos", auth: true },
    { href: "#/softwares", label: "Softwares", auth: true },
    { href: "#/instalacoes", label: "Instalações", auth: true },
    { href: "#/chamados", label: "Chamados", auth: true },
    { href: "#/usuarios", label: "Usuários", auth: true },
  ];

  navLinksEl.innerHTML = "";
  links
    .filter((l) => (l.auth ? isAuthed : true))
    .forEach((l) => {
      const li = document.createElement("li");
      li.className = "nav-item";
      li.innerHTML = `<a class="nav-link text-white-50" href="${l.href}">${l.label}</a>`;
      navLinksEl.appendChild(li);
    });

  btnLogout.classList.toggle("d-none", !isAuthed);
}

function handleNavActive() {
  const hash = location.hash || "#/dashboard";
  document.querySelectorAll("#navLinks a.nav-link").forEach((a) => {
    a.classList.toggle("text-white", a.getAttribute("href") === hash);
    a.classList.toggle("text-white-50", a.getAttribute("href") !== hash);
  });
}

btnLogout.addEventListener("click", () => {
  auth.logout();
  ui.toast("Sessão encerrada.", { variant: "info" });
  renderNav();
  navigateTo("/login");
});

btnApiMode.addEventListener("click", () => {
  ui.toggleApiMode();
  setApiModeButton();
  ui.toast("Modo de API alterado. Recarregando dados…", { variant: "info" });
  renderRoute();
});

window.addEventListener("hashchange", async () => {
  await renderRoute();
  handleNavActive();
});

window.addEventListener("auth-changed", () => {
  renderNav();
  handleNavActive();
});

window.addEventListener("DOMContentLoaded", async () => {
  routes.init();
  setApiModeButton();
  renderNav();

  if (!location.hash) {
    navigateTo(auth.isAuthenticated() ? "/dashboard" : "/login");
  } else {
    await renderRoute();
  }

  handleNavActive();
});

