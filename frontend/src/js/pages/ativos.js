import { buildCrudPage } from "./_crudPage.js";
import { api } from "../api/services.js";

export async function pageAtivos() {
  const clientes = await api.clientes.list();
  return buildCrudPage({
    title: "Ativos",
    subtitle: "Controle de hardware e outros ativos por cliente.",
    itemLabel: "ativo",
    service: api.ativos,
    idField: "id_ativo",
    columns: [
      { key: "nome", label: "Nome" },
      { key: "tipo", label: "Tipo" },
      { key: "id_cliente", label: "ID Cliente" },
    ],
    fields: [
      { name: "nome", label: "Nome", required: true },
      { name: "tipo", label: "Tipo", required: true },
      { name: "id_cliente", label: "Cliente", required: true, type: "select", options: clientes.map((c) => ({ value: c.id_cliente, label: c.nome })) },
      { name: "descricao", label: "Descrição", type: "textarea", col: "col-12" },
    ],
  });
}

