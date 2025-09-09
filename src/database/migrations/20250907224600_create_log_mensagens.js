// src/database/migrations/20250907224600_create_log_mensagens.js

exports.up = function(knex) {
  return knex.schema.createTable('log_mensagens', function(table) {
    table.increments('id').primary();
    table.integer('estabelecimento_id').unsigned().notNullable()
      .references('id').inTable('estabelecimentos')
      .onDelete('CASCADE');
    table.string('ano_mes', 6).notNullable(); // formato YYYYMM
    table.integer('sequencia').notNullable();
    table.timestamp('data_hora').notNullable().defaultTo(knex.fn.now());

    table.unique(['estabelecimento_id', 'ano_mes', 'sequencia']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('log_mensagens');
};
