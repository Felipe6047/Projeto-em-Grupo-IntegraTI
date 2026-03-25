import { storage } from "../utils/storage.js";

const KEY_DB = "ts_mock_db_v1";

function nowIso() {
  return new Date().toISOString();
}

function createSeed() {
  const admin = {
    id_usuario: crypto.randomUUID(),
    nome: "Admin",
    email: "admin@techsolution.local",
    senha: "admin123",
    perfil: "admin",
    criado_em: nowIso(),
  };

  const cliente = {
    id_cliente: crypto.randomUUID(),
    nome: "Cliente Exemplo",
    cnpj: "00.000.000/0001-00",
    email: "contato@clienteexemplo.com",
    telefone: "(00) 00000-0000",
    criado_em: nowIso(),
  };

  const ativo = {
    id_ativo: crypto.randomUUID(),
    nome: "Notebook Dell",
    tipo: "Hardware",
    descricao: "Notebook para suporte",
    id_cliente: cliente.id_cliente,
    criado_em: nowIso(),
  };

  const software = {
    id_software: crypto.randomUUID(),
    nome: "Windows",
    versao: "11",
    tipo_licenca: "OEM",
    fabricante: "Microsoft",
    criado_em: nowIso(),
  };

  const instalacao = {
    id_instalacao: crypto.randomUUID(),
    id_ativo: ativo.id_ativo,
    id_software: software.id_software,
    chave_licenca: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
    data_instalacao: new Date().toISOString().slice(0, 10),
    data_expiracao: "",
    criado_em: nowIso(),
  };

  const chamado = {
    id_chamado: crypto.randomUUID(),
    codigo: "CH-0001",
    titulo: "Instalação de software",
    descricao: "Instalar pacote padrão do cliente.",
    status_chamado: "aberto",
    data_abertura: new Date().toISOString().slice(0, 10),
    data_fechamento: "",
    id_usuario: admin.id_usuario,
    id_ativo: ativo.id_ativo,
    criado_em: nowIso(),
  };

  const historico = [
    {
      id_historico: crypto.randomUUID(),
      id_chamado: chamado.id_chamado,
      descricao: "Chamado criado.",
      data_evento: nowIso(),
      id_usuario: admin.id_usuario,
    },
  ];

  const anexos = [];

  return {
    meta: { createdAt: nowIso() },
    clientes: [cliente],
    ativos: [ativo],
    softwares: [software],
    instalacoes: [instalacao],
    usuarios: [admin],
    chamados: [chamado],
    historico_chamado: historico,
    anexos,
  };
}

export const mockDb = {
  load() {
    const db = storage.getJson(KEY_DB);
    if (db) return db;
    const seed = createSeed();
    storage.setJson(KEY_DB, seed);
    return seed;
  },

  save(db) {
    storage.setJson(KEY_DB, db);
  },
};

