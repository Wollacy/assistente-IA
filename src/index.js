// src/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// 🛡️ Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Servir arquivos estáticos (ex: painel.html)

// 📦 Importações de rotas
const chatRoutes = require('./routes/chat.routes');
const contextoRoutes = require('./routes/contexto.routes');
const authRoutes = require('./routes/auth.routes');
const estabelecimentoRoutes = require('./routes/estabelecimento.routes');
const whatsappRoutes = require('./routes/whatsapp.routes');

// 🚏 Rotas da API
app.use('/api/contexto', contextoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes); // Ex: POST /api/chat
app.use('/api/estabelecimentos', estabelecimentoRoutes); // Ex: POST /api/estabelecimentos/testar-mensagem

// 🤖 Webhook do WhatsApp (entrada de mensagens reais)
app.use('/webhook/whatsapp', whatsappRoutes);

// 🚀 Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));
