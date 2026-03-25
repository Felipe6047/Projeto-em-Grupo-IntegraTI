CREATE DATABASE gestao_ti;
USE gestao_ti;

CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20)    
);

CREATE TABLE ativo (
    id_ativo INT AUTO_INCREMENT PRIMARY KEY,
	id_cliente INT NOT NULL,
    nome VARCHAR(100)NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    descricao TEXT,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE software (
    id_software INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    versao VARCHAR(50),
    tipo_licenca VARCHAR(50),
    fabricante VARCHAR(50)
);

CREATE TABLE instalacao_software (
    id_instalacao INT AUTO_INCREMENT PRIMARY KEY,
    id_ativo INT NOT NULL,
    id_software INT NOT NULL,
    chave_licenca VARCHAR(100),
    data_instalacao DATETIME,
    data_expiracao DATETIME,
	FOREIGN KEY (id_ativo) REFERENCES ativo (id_ativo)
    ON DELETE CASCADE,
    FOREIGN KEY (id_software) REFERENCES software (id_software)
    ON DELETE CASCADE
);



CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(50) NOT NULL,
    perfil VARCHAR(50) NOT NULL
);


CREATE TABLE chamado (
    id_chamado INT AUTO_INCREMENT PRIMARY KEY,
    id_ativo INT NOT NULL,
    id_usuario INT NOT NULL,
    codigo VARCHAR(50)UNIQUE,
    titulo VARCHAR(50),
    descricao VARCHAR(200),
    status_chamado VARCHAR(50),
	data_abertura DATETIME,
    data_fechamento DATETIME NULL,
    FOREIGN KEY (id_ativo) REFERENCES ativo(id_ativo),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE historico_chamado (
    id_historico INT AUTO_INCREMENT PRIMARY KEY,
    id_chamado INT NOT NULL,
    id_usuario INT NOT NULL,
	descricao TEXT NOT NULL,
    data_evento DATETIME,
    FOREIGN KEY (id_chamado) REFERENCES chamado(id_chamado)
    ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE anexo(
    id_anexo INT AUTO_INCREMENT PRIMARY KEY,
    id_chamado INT,
    nome_arquivo VARCHAR(100),
    caminho TEXT,
    data_upload DATETIME,
    FOREIGN KEY (id_chamado) REFERENCES chamado(id_chamado)
    ON DELETE CASCADE
);

