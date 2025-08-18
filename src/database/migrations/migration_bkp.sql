-- Criação da tabela principal
CREATE TABLE IF NOT EXISTS estabelecimentos (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    ramo_atividade TEXT,
    telefone TEXT NOT NULL,
    contexto TEXT
);
