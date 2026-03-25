import { buildCrudPage } from "./_crudPage.js";
import { api } from "../api/services.js";

export async function pageClientes() {
  return buildCrudPage({
    title: "Clientes",
    subtitle: "Cadastro de empresas atendidas.",
    itemLabel: "cliente",
    service: api.clientes,
    idField: "id_cliente",
    columns: [
      { key: "nome", label: "Nome" },
      { key: "cnpj", label: "CNPJ" },
      { key: "email", label: "E-mail" },
      { key: "telefone", label: "Telefone" },
    ],
    fields: [
      { name: "nome", label: "Nome", required: true },
      { name: "cnpj", label: "CNPJ", required: true },
      { name: "email", label: "E-mail", type: "email", required: true },
      { name: "telefone", label: "Telefone", required: true },
    ],
  });
}

