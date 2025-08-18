// src/controllers/chat.controller.js
const { gerarRespostaAcademia } = require('../services/chat.service.js');
const { registrarUsoMensagem } = require('../services/limite.service.js');
const { buscarEstabelecimentoPorTelefone } = require('../services/estabelecimento.service.js');

async function testarMensagem(req, res) {
  const { telefone, mensagem } = req.body;

  if (!mensagem || !telefone) {
    return res.status(400).json({ erro: 'Telefone e mensagem são obrigatórios.' });
  }

  console.log('🧪 Testando mensagem via painel:', { telefone, mensagem });

  try {
    const estabelecimento = await buscarEstabelecimentoPorTelefone(telefone);

    if (!estabelecimento) {
      return res.status(404).json({ erro: 'Estabelecimento não encontrado para este telefone.' });
    }

    console.log('🔹 Chamando gerarRespostaAcademia...');
    const resposta = await gerarRespostaAcademia(mensagem, estabelecimento.contexto);
    console.log('🔹 Resposta gerada com sucesso, chamando registrarUsoMensagem...');

    // ✅ Contabilizar uso e gravar log
    await registrarUsoMensagem(estabelecimento.id);
    console.log('🔹 registrarUsoMensagem executado com sucesso');

    res.json({ resposta });
  } catch (erro) {
    console.error('❌ Erro ao testar mensagem:', erro);

    if (erro.message === 'Aguarde você será transferido para um atendente.') {
      return res.status(403).json({ erro: erro.message });
    }

    res.status(500).json({ erro: 'Erro ao processar a mensagem.' });
  }
}

module.exports = { testarMensagem };
