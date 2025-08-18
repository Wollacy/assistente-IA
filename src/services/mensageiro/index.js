const zapi = require('./zapi');
const meta = require('./meta');

const provider = process.env.WHATSAPP_PROVIDER || 'zapi';

async function enviarMensagem(numero, mensagem) {
  switch (provider) {
    case 'zapi':
      return await zapi.enviar(numero, mensagem);
    case 'meta':
      return await meta.enviar(numero, mensagem);
    default:
      throw new Error(`Provedor de WhatsApp não suportado: ${provider}`);
  }
}

module.exports = { enviarMensagem };
