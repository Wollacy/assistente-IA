const express = require('express');
const router = express.Router();
const { buscarEstabelecimentoPorTelefone } = require('../services/estabelecimento.service');
const { gerarRespostaAcademia } = require('../services/chat.service');

// Rota principal para o chat, recebendo uma mensagem de um cliente
// Acessível via POST /api/chat/ (com o prefixo em index.js)
router.post('/', async (req, res) => {
  try {
    const { telefone, mensagem } = req.body; // Padronizado para 'telefone' e 'mensagem'

    if (!telefone || !mensagem) {
      return res.status(400).json({ erro: 'Telefone e mensagem são obrigatórios' });
    }

    const estabelecimento = await buscarEstabelecimentoPorTelefone(telefone);

    if (!estabelecimento) {
      return res.status(404).json({ erro: 'Estabelecimento não encontrado para este telefone' });
    }

    const resposta = await gerarRespostaAcademia(mensagem, estabelecimento.contexto);

    res.json({ resposta });
  } catch (error) {
    console.error('Erro ao gerar resposta:', error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// A rota '/testar-mensagem' foi movida para 'estabelecimento.routes.js'

module.exports = router;