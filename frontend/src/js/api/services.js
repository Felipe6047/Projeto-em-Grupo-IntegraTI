import { apiClient } from "./apiClient.js";

function col(name) {
  return {
    list: () => apiClient.request(`/${name}`, { method: "GET" }),
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
    listByChamado: (id_chamado) =>
      apiClient.request(`/chamados/${encodeURIComponent(id_chamado)}/historico`, { method: "GET" }),
    add: (id_chamado, body) =>
      apiClient.request(`/chamados/${encodeURIComponent(id_chamado)}/historico`, { method: "POST", body }),
  },
  anexos: {
    listByChamado: (id_chamado) =>
      apiClient.request(`/chamados/${encodeURIComponent(id_chamado)}/anexos`, { method: "GET" }),
    add: (id_chamado, body) =>
      apiClient.request(`/chamados/${encodeURIComponent(id_chamado)}/anexos`, { method: "POST", body }),
  },
  dashboard: {
    ativos: () => apiClient.request("/dashboard/ativos", { method: "GET" }),
  },
};

