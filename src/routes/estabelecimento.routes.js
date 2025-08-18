// src/routes/estabelecimento.routes.js
const express = require('express');
const router = express.Router();

const controller = require('../controllers/estabelecimento.controller');
const { testarMensagem } = require('../controllers/chat.controller'); // ✅ Importa controller certo

// 📌 ROTAS PRINCIPAIS DE ESTABELECIMENTO
router.get('/', controller.listarEstabelecimentos);                // Listar todos
router.get('/:id', controller.buscarPorId);                        // Buscar por ID (com telefones)
router.get('/telefone/:telefone', controller.buscarPorTelefone);  // Buscar por telefone
router.post('/', controller.criarEstabelecimento);                 // Criar novo
router.put('/:id', controller.atualizarEstabelecimento);           // Atualizar Estabelecimento
router.put('/:id/contexto', controller.atualizarContexto);         // Atualizar contexto da IA
router.delete('/:id', controller.excluirEstabelecimento);          // Excluir Estabelecimento

// 🔧 ROTA DE TESTE DE MENSAGEM (usada pelo painel)
router.post('/testar-mensagem', testarMensagem); // ✅ Agora usa o controller centralizado

module.exports = router;
