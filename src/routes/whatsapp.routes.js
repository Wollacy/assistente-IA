// src/routes/whatsapp.routes.js
const express = require('express');
const router = express.Router();

const { buscarEstabelecimentoPorTelefone } = require('../services/estabelecimento.service');
const { enviarMensagemWhats } = require('../services/whatsapp.service');
const { gerarRespostaAcademia } = require('../services/chat.service');
const { registrarUsoMensagem } = require('../services/limite.service');

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

/**
 * 🔐 Validação do webhook (Meta chama 1x)
 */
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

/**
 * 📩 Recebimento de mensagens do WhatsApp Cloud API
 */
router.post('/', async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    // Se não for mensagem (ex: status), só responder 200
    if (!message || message.type !== 'text') {
      return res.sendStatus(200);
    }

    const numero = message.from;
    const mensagem = message.text.body;

    console.log(`💬 Mensagem recebida de ${numero}: "${mensagem}"`);

    const estabelecimento = await buscarEstabelecimentoPorTelefone(numero);

    if (!estabelecimento) {
      await enviarMensagemWhats(numero, 'Número não vinculado a nenhum estabelecimento.');
      return res.sendStatus(200);
    }

    const resposta = await gerarRespostaAcademia(
      mensagem,
      estabelecimento.contexto
    );

    await enviarMensagemWhats(numero, resposta);

    await registrarUsoMensagem(estabelecimento.id);

    return res.sendStatus(200);
  } catch (erroLimite) {
    if (erroLimite.message === 'Aguarde você será transferido para um atendente.') {
      await enviarMensagemWhats(
        req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from,
        'Você atingiu o limite de mensagens do seu plano. Entre em contato para atualizar.'
      );
      return res.sendStatus(200);
    }

    console.error('❌ Erro no webhook do WhatsApp:', erroLimite);
    return res.sendStatus(200); // ⚠️ NUNCA devolver erro pra Meta
  }
});

module.exports = router;
