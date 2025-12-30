const axios = require('axios');
require('dotenv').config();

const GRAPH_URL = 'https://graph.facebook.com';
const VERSION = process.env.WHATSAPP_API_VERSION || 'v21.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const TOKEN = process.env.WHATSAPP_TOKEN;

async function enviarMensagemWhats(numero, mensagem) {
  try {
    const url = `${GRAPH_URL}/${VERSION}/${PHONE_NUMBER_ID}/messages`;

    const body = {
      messaging_product: 'whatsapp',
      to: numero,
      text: {
        body: mensagem
      }
    };

    const { data } = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Mensagem enviada para ${numero}: "${mensagem}"`);
    return data;
  } catch (error) {
    console.error(
      '❌ Erro ao enviar mensagem:',
      error.response?.data || error.message
    );
  }
}

module.exports = { enviarMensagemWhats };
