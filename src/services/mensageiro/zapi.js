const axios = require('axios');

async function enviar(numero, mensagem) {
  const url = process.env.ZAPI_URL;

  if (!url) {
    throw new Error('ZAPI_URL não configurado no .env');
  }

  try {
    const response = await axios.post(`${url}/send-message`, {
      phone: numero,
      message: mensagem,
    });

    console.log(`✅ Mensagem enviada para ${numero}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao enviar mensagem via Z-API:`, error.response?.data || error.message);
    throw new Error('Falha ao enviar mensagem via Z-API');
  }
}

module.exports = { enviar };
