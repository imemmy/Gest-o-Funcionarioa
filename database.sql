-- =====================================================
-- Script de criação do Banco de Dados
-- Sistema de Gestão de Funcionários
-- =====================================================

CREATE DATABASE IF NOT EXISTS gestao_funcionarios
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE gestao_funcionarios;

CREATE TABLE IF NOT EXISTS funcionarios (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(150)      NOT NULL,
    email       VARCHAR(150)      NOT NULL UNIQUE,
    cargo       VARCHAR(50)       NOT NULL,
    telefone    VARCHAR(20)       NOT NULL,
    cep         VARCHAR(9)        NOT NULL,
    logradouro  VARCHAR(150),
    bairro      VARCHAR(100),
    cidade      VARCHAR(100),
    estado      VARCHAR(2),
    criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================
-- Dados de exemplo (seed)
-- =====================================================
INSERT INTO funcionarios (nome, email, cargo, telefone, cep, logradouro, bairro, cidade, estado)
VALUES
    ('Maria Oliveira', 'maria@email.com', 'Gerente', '(11) 99999-0000', '01001-000', 'Praça da Sé', 'Sé', 'São Paulo', 'SP'),
    ('João Silva', 'joao@email.com', 'Analista', '(11) 98888-0000', '20040-020', 'Avenida Rio Branco', 'Centro', 'Rio de Janeiro', 'RJ');
