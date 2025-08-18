// src/services/estabelecimento.service.js
const knex = require('../database/db');

async function buscarEstabelecimentoPorTelefone(telefone) {
  try {
    const estabelecimento = await knex('estabelecimentos')
      .where('telefone', telefone)
      .first();

    return estabelecimento;
  } catch (error) {
    console.error(`❌ Erro ao buscar estabelecimento por telefone ${telefone}:`, error);
    throw error;
  }
}

module.exports = { buscarEstabelecimentoPorTelefone };
