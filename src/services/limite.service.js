// src/services/limite.service.js
const knex = require('../database/db');

const limitesPorPlano = {
  'Básico': 2000,          // 2.000 Mensagens (durante testes você usa 2)
  'Intermediário': 5000,   // 5.000 Mensagens
  'Avançado': 10000,        // 10.000 Mensagens
  'Ilimitado': 9999999      // 9.999.999 Mensagens
};

async function registrarUsoMensagem(estabelecimentoId) {
  const agora = new Date();
  const anoMes = `${agora.getFullYear()}${String(agora.getMonth() + 1).padStart(2, '0')}`;

  console.log('[limite] Iniciando registrarUsoMensagem', { estabelecimentoId, anoMes, agora });

  try {
    // 🔍 Buscar plano do estabelecimento
    const estabelecimento = await knex('estabelecimentos')
      .select('plano')
      .where({ id: estabelecimentoId })
      .first();

    if (!estabelecimento) {
      console.error(`[limite] Estabelecimento não encontrado: ${estabelecimentoId}`);
      throw new Error(`Estabelecimento com ID ${estabelecimentoId} não encontrado.`);
    }

    const plano = estabelecimento.plano || 'Básico';
    const limite = limitesPorPlano[plano] || 2000;
    console.log(`[limite] Plano do estabelecimento: "${plano}" — limite (em testes): ${limite}`);

    // 🚨 Usar transação para garantir atomicidade entre atualização do limite e inserção do log
    await knex.transaction(async (trx) => {
      // 🔁 Verificar se já existe registro para o mês atual
      const registroAtual = await trx('limites_mensais')
        .where({ estabelecimento_id: estabelecimentoId, ano_mes: anoMes })
        .first();

      if (registroAtual) {
        console.log('[limite] Registro mensal existente encontrado:', registroAtual);

        if (registroAtual.mensagens_utilizadas >= limite) {
          console.warn('[limite] Limite atingido — não será possível registrar nova mensagem.', {
            mensagens_utilizadas: registroAtual.mensagens_utilizadas,
            limite
          });
          // Lança para ser tratado mais acima (rollback automático do trx)
          throw new Error('Aguarde você será transferido para um atendente.');
        }

        const updatedCount = await trx('limites_mensais')
          .where({ id: registroAtual.id })
          .update({ mensagens_utilizadas: registroAtual.mensagens_utilizadas + 1 });

        console.log(`[limite] Registro mensal atualizado. linhas afetadas: ${updatedCount}`);
      } else {
        const insertedIds = await trx('limites_mensais')
          .insert({
            estabelecimento_id: estabelecimentoId,
            ano_mes: anoMes,
            mensagens_utilizadas: 1
          })
          .returning('id');

        console.log('[limite] Registro mensal criado:', { insertedIds });
      }

      // 🔢 Calcular sequência atual para o log de mensagens
      const resultado = await trx('log_mensagens')
        .where({ estabelecimento_id: estabelecimentoId, ano_mes: anoMes })
        .count('id as total')
        .first();

      const total = parseInt(resultado?.total || '0', 10) || 0;
      const sequencia = total + 1;
      console.log(`[limite] Sequência calculada para o log: ${sequencia} (total atual: ${total})`);

      const insertedLog = await trx('log_mensagens')
        .insert({
          estabelecimento_id: estabelecimentoId,
          ano_mes: anoMes,
          sequencia,
          data_hora: agora
        })
        .returning('id');

      console.log('[limite] Log de mensagem inserido:', { insertedLog, sequencia });
    });

    console.log(`[limite] registrarUsoMensagem finalizado com sucesso para estab ${estabelecimentoId}`);
  } catch (err) {
    // Log detalhado do erro para debug
    console.error('[limite] ERRO em registrarUsoMensagem:', err && (err.message || err));
    // Repropaga o erro para o caller (ex.: controller) tratar (limite atingido ou erro DB)
    throw err;
  }
}

module.exports = { registrarUsoMensagem };
