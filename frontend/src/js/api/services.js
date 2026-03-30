import { apiClient } from "./apiClient.js";

function unwrapList(data, resourceName) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  const byResource = {
    clientes: data.clientes,
    ativos: data.ativos,
    chamados: data.chamados,
    softwares: data.results,
    instalacoes: data.results,
    usuarios: data.usuario,
    historico: data.results,
    anexos: data.results,
    dashboard: data.dashboard,
  };
  const direct = byResource[resourceName];
  if (Array.isArray(direct)) return direct;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

function col(name) {
  return {
    list: async () => {
      const data = await apiClient.request(`/${name}`, { method: "GET" });
      return unwrapList(data, name);
    },
    create: (body) => apiClient.request(`/${name}`, { method: "POST", body }),
    get: (id) => apiClient.request(`/${name}/${encodeURIComponent(id)}`, { method: "GET" }),
    update: (id, body) => apiClient.request(`/${name}/${encodeURIComponent(id)}`, { method: "PUT", body }),
    remove: (id) => apiClient.request(`/${name}/${encodeURIComponent(id)}`, { method: "DELETE" }),
  };
}

export const api = {
  auth: {
    login: ({ email, senha }) => apiClient.request("/auth/login", { method: "POST", body: { email, senha } }),
    me: () => apiClient.request("/auth/me", { method: "GET" }),
  },
  clientes: col("clientes"),
  ativos: col("ativos"),
  softwares: col("softwares"),
  instalacoes: col("instalacoes"),
  usuarios: col("usuarios"),
  chamados: col("chamados"),
  historico: {
    listByChamado: async (id_chamado) => {
      const data = await apiClient.request(`/chamados/${encodeURIComponent(id_chamado)}/historico`, { method: "GET" });
      return unwrapList(data, "historico");
    },
    add: (id_chamado, body) =>
      apiClient.request(`/chamados/${encodeURIComponent(id_chamado)}/historico`, { method: "POST", body }),
  },
  anexos: {
    listByChamado: async (id_chamado) => {
      const data = await apiClient.request(`/chamados/${encodeURIComponent(id_chamado)}/anexos`, { method: "GET" });
      return unwrapList(data, "anexos");
    },
    add: (id_chamado, body) =>
      apiClient.request(`/chamados/${encodeURIComponent(id_chamado)}/anexos`, { method: "POST", body }),
  },
  dashboard: {
    ativos: async () => {
      const data = await apiClient.request("/dashboard/ativos", { method: "GET" });
      return unwrapList(data, "dashboard");
    },
  },
};
