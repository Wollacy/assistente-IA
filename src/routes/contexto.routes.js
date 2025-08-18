const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const caminho = path.join(__dirname, '..', 'data', 'academias.json');

function lerDados() {
  const data = fs.readFileSync(caminho, 'utf8');
  return JSON.parse(data);
}

function salvarDados(dados) {
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf8');
}

// Listar todas as academias
router.get('/lista', (req, res) => {
  try {
    const { dados } = lerDados();
    const academias = Object.entries(dados).map(([id, info]) => ({ id, ...info }));
    res.json(academias);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao listar academias' });
  }
});

// Obter academia ativa
router.get('/', (req, res) => {
  try {
    const { ativa, dados } = lerDados();
    res.json({ id: ativa, ...dados[ativa] });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao ler academia ativa' });
  }
});

// Trocar academia ativa
router.post('/ativa/:id', (req, res) => {
  try {
    const dados = lerDados();
    if (!dados.dados[req.params.id]) {
      return res.status(404).json({ error: 'Academia não encontrada' });
    }
    dados.ativa = req.params.id;
    salvarDados(dados);
    res.json({ message: 'Academia ativa alterada com sucesso' });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao alterar academia ativa' });
  }
});

// Atualizar contexto de uma academia
router.put('/:id', (req, res) => {
  const { nome, contexto } = req.body;
  if (!nome || !contexto) {
    return res.status(400).json({ error: 'Campos obrigatórios' });
  }

  try {
    const dados = lerDados();
    dados.dados[req.params.id] = { nome, contexto };
    salvarDados(dados);
    res.json({ message: 'Academia atualizada' });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao salvar academia' });
  }
});

// Obter dados de uma academia específica (usado após login)
router.get('/:id', (req, res) => {
  try {
    const { dados } = lerDados();
    const academia = dados[req.params.id];
    if (!academia) {
      return res.status(404).json({ error: 'Academia não encontrada' });
    }
    res.json({ id: req.params.id, ...academia });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar academia' });
  }
});

module.exports = router;
