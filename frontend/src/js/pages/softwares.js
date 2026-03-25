import { buildCrudPage } from "./_crudPage.js";
import { api } from "../api/services.js";

export async function pageSoftwares() {
  return buildCrudPage({
    title: "Softwares",
    subtitle: "Inventário de softwares e licenças.",
    itemLabel: "software",
    service: api.softwares,
    idField: "id_software",
    columns: [
      { key: "nome", label: "Nome" },
      { key: "versao", label: "Versão" },
      { key: "tipo_licenca", label: "Tipo Licença" },
      { key: "fabricante", label: "Fabricante" },
    ],
    fields: [
      { name: "nome", label: "Nome", required: true },
      { name: "versao", label: "Versão", required: true },
      { name: "tipo_licenca", label: "Tipo de Licença", required: true },
      { name: "fabricante", label: "Fabricante", required: true },
    ],
  });
}

