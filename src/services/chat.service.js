const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Gera uma resposta da IA com base na pergunta do usuário e o contexto do estabelecimento.
 * @param {string} pergunta - A pergunta feita pelo usuário.
 * @param {string} contexto - O contexto do estabelecimento, obtido do banco.
 * @returns {Promise<string>} - A resposta da IA.
 */
async function gerarRespostaAcademia(pergunta, contexto) {
  if (!contexto) {
    throw new Error('Contexto é obrigatório para gerar uma resposta.');
  }

  try {
    const resposta = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: contexto },
        { role: 'user', content: pergunta }
      ]
    });

    return resposta.choices[0].message.content;
  } catch (err) {
    console.error('Erro ao gerar resposta:', err.response?.data || err.message);
    throw new Error('Erro ao gerar resposta com OpenAI');
  }
}

module.exports = { gerarRespostaAcademia };
