/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('estabelecimentos', function (table) {
    table.string('email').notNullable().defaultTo('');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('estabelecimentos', function (table) {
    table.dropColumn('email');
  });
};

// src/database/migrations/20250907223500_add_plano_to_estabelecimentos.js

exports.up = function(knex) {
  return knex.schema.table('estabelecimentos', function (table) {
    table.string('plano').notNullable().defaultTo('Básico');
  });
};

exports.down = function(knex) {
  return knex.schema.table('estabelecimentos', function (table) {
    table.dropColumn('plano');
  });
};

