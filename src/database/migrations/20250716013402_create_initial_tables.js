// src/database/migrations/YYYYMMDDHHMMSS_create_initial_tables.js

exports.up = function(knex) {
  return knex.raw(`
    -- Criação da tabela principal
    CREATE TABLE IF NOT EXISTS estabelecimentos (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        ramo_atividade TEXT,
        telefone TEXT NOT NULL,
        contexto TEXT,
        plano VARCHAR NOT NULL DEFAULT 'Básico',
        email VARCHAR NOT NULL DEFAULT ''
    );
  `);
};

exports.down = function(knex) {
  // Importante para reverter a migração se necessário
  return knex.raw(`
    DROP TABLE IF EXISTS estabelecimentos;
  `);
};