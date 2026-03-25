import { h, qs } from "../ui/dom.js";
import { api } from "../api/services.js";
import { auth } from "../state/auth.js";
import { navigateTo } from "../router.js";
import { ui } from "../ui/ui.js";

export async function pageLogin() {
  const wrap = h("div", { className: "row justify-content-center py-4" });
  const col = h("div", { className: "col-12 col-md-7 col-lg-5 col-xl-4" });
  const card = h("div", {
    className: "card app-card shadow-sm",
    html: `
      <div class="card-header"><h1 class="h5 mb-0">Acesso ao sistema</h1></div>
      <div class="card-body">
        <p class="text-white-50 small mb-3">Entre para acessar os módulos de gestão.</p>
        <form id="formLogin" novalidate>
          <div class="mb-3">
            <label class="form-label" for="email">E-mail</label>
            <input class="form-control" id="email" name="email" type="email" required placeholder="admin@techsolution.local" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="senha">Senha</label>
            <input class="form-control" id="senha" name="senha" type="password" required minlength="6" placeholder="******" />
          </div>
          <button class="btn btn-primary w-100" type="submit">Entrar</button>
        </form>
      </div>
      <div class="card-footer text-white-50 small">
        Modo mock: use <code>admin@techsolution.local</code> / <code>admin123</code>
      </div>
    `,
  });

  const form = qs("#formLogin", card);
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const email = qs("#email", form).value.trim();
    const senha = qs("#senha", form).value;
    try {
      const data = await api.auth.login({ email, senha });
      auth.setSession({ token: data.token, user: data.user });
      window.dispatchEvent(new Event("auth-changed"));
      ui.toast(`Bem-vindo, ${data.user.nome}!`, { variant: "success" });
      navigateTo("/dashboard");
    } catch (err) {
      ui.toast(err.message || "Falha no login.", { variant: "danger" });
    }
  });

  col.appendChild(card);
  wrap.appendChild(col);
  return wrap;
}

