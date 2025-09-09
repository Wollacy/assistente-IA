// src/database/migrations/20250907224500_create_limites_mensais.js

exports.up = function(knex) {
  return knex.schema.createTable('limites_mensais', function(table) {
    table.increments('id').primary();
    table.integer('estabelecimento_id').unsigned().notNullable()
      .references('id').inTable('estabelecimentos')
      .onDelete('CASCADE');
    table.string('ano_mes', 7).notNullable(); // formato YYYY-MM
    table.integer('mensagens_utilizadas').notNullable().defaultTo(0);

    table.unique(['estabelecimento_id', 'ano_mes']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('limites_mensais');
};
