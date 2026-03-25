import { mockDb } from "./mockDb.js";
import { auth } from "../state/auth.js";

function ok(data) {
  return Promise.resolve(data);
}

function notFound() {
  throw new Error("Recurso não encontrado (mock).");
}

function requireAuth() {
  if (!auth.isAuthenticated()) throw new Error("Não autenticado.");
}

function match(path, pattern) {
  const rx = new RegExp(`^${pattern.replaceAll("/", "\\/").replaceAll(":id", "([^/]+)")}$`);
  const m = path.match(rx);
  if (!m) return null;
  return { id: m[1] };
}

function upsertById(list, idField, obj) {
  const idx = list.findIndex((x) => x[idField] === obj[idField]);
  if (idx >= 0) list[idx] = obj;
  else list.unshift(obj);
}

function removeById(list, idField, id) {
  const idx = list.findIndex((x) => x[idField] === id);
  if (idx >= 0) list.splice(idx, 1);
}

export const mockApi = {
  async request(path, { method = "GET", body } = {}) {
    const db = mockDb.load();

    // Auth
    if (path === "/auth/login" && method === "POST") {
      const user = db.usuarios.find((u) => u.email === body?.email && u.senha === body?.senha);
      if (!user) throw new Error("E-mail ou senha inválidos.");
      return ok({
        token: `mock.${user.id_usuario}.${Date.now()}`,
        user: { id_usuario: user.id_usuario, nome: user.nome, email: user.email, perfil: user.perfil },
      });
    }

    if (path === "/auth/me" && method === "GET") {
      requireAuth();
      const me = auth.getUser();
      return ok(me);
    }

    // Collections
    const collections = [
      { name: "clientes", idField: "id_cliente" },
      { name: "ativos", idField: "id_ativo" },
      { name: "softwares", idField: "id_software" },
      { name: "instalacoes", idField: "id_instalacao" },
      { name: "usuarios", idField: "id_usuario" },
      { name: "chamados", idField: "id_chamado" },
    ];

    for (const c of collections) {
      if (path === `/${c.name}` && method === "GET") {
        requireAuth();
        return ok(db[c.name]);
      }
      if (path === `/${c.name}` && method === "POST") {
        requireAuth();
        const obj = body || {};
        if (!obj[c.idField]) obj[c.idField] = crypto.randomUUID();
        upsertById(db[c.name], c.idField, obj);
        mockDb.save(db);
        return ok(obj);
      }
      const m = match(path, `\\/${c.name}\\/:id`);
      if (m && method === "GET") {
        requireAuth();
        const item = db[c.name].find((x) => x[c.idField] === m.id);
        if (!item) return notFound();
        return ok(item);
      }
      if (m && method === "PUT") {
        requireAuth();
        const obj = { ...(body || {}), [c.idField]: m.id };
        upsertById(db[c.name], c.idField, obj);
        mockDb.save(db);
        return ok(obj);
      }
      if (m && method === "DELETE") {
        requireAuth();
        removeById(db[c.name], c.idField, m.id);
        mockDb.save(db);
        return ok({ ok: true });
      }
    }

    // Histórico / anexos por chamado
    const mh = match(path, "\\/chamados\\/:id\\/historico");
    if (mh && method === "GET") {
      requireAuth();
      return ok(db.historico_chamado.filter((h) => h.id_chamado === mh.id));
    }
    if (mh && method === "POST") {
      requireAuth();
      const obj = body || {};
      obj.id_historico = crypto.randomUUID();
      obj.id_chamado = mh.id;
      db.historico_chamado.unshift(obj);
      mockDb.save(db);
      return ok(obj);
    }

    const ma = match(path, "\\/chamados\\/:id\\/anexos");
    if (ma && method === "GET") {
      requireAuth();
      return ok(db.anexos.filter((a) => a.id_chamado === ma.id));
    }
    if (ma && method === "POST") {
      requireAuth();
      const obj = body || {};
      obj.id_anexo = crypto.randomUUID();
      obj.id_chamado = ma.id;
      db.anexos.unshift(obj);
      mockDb.save(db);
      return ok(obj);
    }

    // Dashboard com "join" (mock): ativos + cliente + softwares instalados + chamados
    if (path === "/dashboard/ativos" && method === "GET") {
      requireAuth();
      const rows = db.ativos.map((a) => {
        const cliente = db.clientes.find((c) => c.id_cliente === a.id_cliente) || null;
        const instalacoes = db.instalacoes.filter((i) => i.id_ativo === a.id_ativo);
        const softwares = instalacoes
          .map((i) => db.softwares.find((s) => s.id_software === i.id_software))
          .filter(Boolean);
        const chamados = db.chamados.filter((ch) => ch.id_ativo === a.id_ativo);
        return {
          id_ativo: a.id_ativo,
          ativo_nome: a.nome,
          ativo_tipo: a.tipo,
          cliente_nome: cliente?.nome || "—",
          total_softwares: softwares.length,
          total_chamados: chamados.length,
        };
      });
      return ok(rows);
    }

    throw new Error(`Endpoint mock não implementado: ${method} ${path}`);
  },
};

