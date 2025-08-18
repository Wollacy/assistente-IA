exports.up = function(knex) {
  return knex.schema.createTable('academias', function(table) {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('telefone').notNullable().unique();
    table.text('contexto').notNullable();
    table.string('senha').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('academias');
};
