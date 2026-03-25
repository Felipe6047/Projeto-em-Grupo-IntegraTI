import { buildCrudPage } from "./_crudPage.js";
import { api } from "../api/services.js";

export async function pageInstalacoes() {
  const [ativos, softwares] = await Promise.all([api.ativos.list(), api.softwares.list()]);

  return buildCrudPage({
    title: "Instalações de Software",
    subtitle: "Relação N:N entre ativos e softwares instalados.",
    itemLabel: "instalação",
    service: api.instalacoes,
    idField: "id_instalacao",
    columns: [
      { key: "id_ativo", label: "ID Ativo" },
      { key: "id_software", label: "ID Software" },
      { key: "data_instalacao", label: "Data Instalação" },
      { key: "data_expiracao", label: "Data Expiração" },
    ],
    fields: [
      { name: "id_ativo", label: "Ativo", type: "select", required: true, options: ativos.map((a) => ({ value: a.id_ativo, label: a.nome })) },
      { name: "id_software", label: "Software", type: "select", required: true, options: softwares.map((s) => ({ value: s.id_software, label: `${s.nome} ${s.versao || ""}`.trim() })) },
      { name: "chave_licenca", label: "Chave de Licença" },
      { name: "data_instalacao", label: "Data da Instalação", type: "datetime-local", required: true },
      { name: "data_expiracao", label: "Data de Expiração", type: "datetime-local" },
    ],
  });
}

