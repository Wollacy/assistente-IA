const axios = require('axios');
require('dotenv').config();

const ZAPI_URL = process.env.ZAPI_URL;

async function enviarMensagemWhats(numero, mensagem) {
  try {
    const body = {
      phone: numero,
      message: mensagem
    };

    const { data } = await axios.post(`${ZAPI_URL}/send-text`, body);
    console.log(`✅ Mensagem enviada para ${numero}: "${mensagem}"`);
    return data;
  } catch (error) {
    console.error(`❌ Erro ao enviar mensagem para ${numero}:`, error.response?.data || error.message);
  }
}

module.exports = { enviarMensagemWhats };
