// src/routes/whatsapp.routes.js
const express = require('express');
const router = express.Router();
const { buscarEstabelecimentoPorTelefone } = require('../services/estabelecimento.service');
const { enviarMensagemWhats } = require('../services/whatsapp.service');
const { gerarRespostaAcademia } = require('../services/chat.service');
const { registrarUsoMensagem } = require('../services/limite.service');

// POST /webhook/whatsapp
router.post('/', async (req, res) => {
  try {
    const numero = req.body.phone;
    const mensagem = req.body.message?.text;

    if (!numero || !mensagem) {
      console.warn('⚠️ Webhook: Número ou mensagem ausente.');
      return res.sendStatus(400);
    }

    console.log(`💬 Mensagem recebida de ${numero}: "${mensagem}"`);

    const estabelecimento = await buscarEstabelecimentoPorTelefone(numero);

    if (!estabelecimento) {
      console.log(`📞 Número ${numero} não vinculado a nenhum estabelecimento.`);
      await enviarMensagemWhats(numero, 'Número não vinculado a nenhum estabelecimento.');
      return res.sendStatus(200);
    }

    console.log(`✅ Estabelecimento encontrado: ${estabelecimento.nome} (ID ${estabelecimento.id})`);

    const resposta = await gerarRespostaAcademia(mensagem, estabelecimento.contexto);

    console.log(`🤖 Resposta gerada: "${resposta}"`);

    // Enviar resposta ao WhatsApp (pode ser comentado durante teste se necessário)
    await enviarMensagemWhats(numero, resposta);

    // Registrar uso + log
    console.log(`📝 Registrando uso para estabelecimento ${estabelecimento.id}...`);
    await registrarUsoMensagem(estabelecimento.id);
    console.log(`✅ Uso registrado com sucesso`);

    res.sendStatus(200);
  } catch (erroLimite) {
    if (erroLimite.message === 'Aguarde você será transferido para um atendente.') {
      console.warn(`🚫 Limite atingido para o estabelecimento. Enviando aviso...`);
      await enviarMensagemWhats(req.body.phone, 'Você atingiu o limite de mensagens do seu plano. Entre em contato para atualizar.');
      return res.sendStatus(200);
    }

    console.error('❌ Erro no webhook do WhatsApp:', erroLimite);
    res.sendStatus(500);
  }
});

module.exports = router;
