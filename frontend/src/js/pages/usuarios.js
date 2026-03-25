import { buildCrudPage } from "./_crudPage.js";
import { api } from "../api/services.js";

export async function pageUsuarios() {
  return buildCrudPage({
    title: "Usuários",
    subtitle: "Controle básico de acesso (login).",
    itemLabel: "usuário",
    service: api.usuarios,
    idField: "id_usuario",
    columns: [
      { key: "nome", label: "Nome" },
      { key: "email", label: "E-mail" },
      { key: "perfil", label: "Perfil" },
    ],
    fields: [
      { name: "nome", label: "Nome", required: true },
      { name: "email", label: "E-mail", type: "email", required: true },
      { name: "senha", label: "Senha", type: "password", required: true },
      {
        name: "perfil",
        label: "Perfil",
        type: "select",
        required: true,
        options: [
          { value: "admin", label: "Administrador" },
          { value: "tecnico", label: "Técnico" },
          { value: "usuario", label: "Usuário" },
        ],
      },
    ],
  });
}

