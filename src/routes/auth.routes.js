const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const caminho = path.join(__dirname, '..', 'data', 'academias.json');

router.post('/login', (req, res) => {
  const { id, senha } = req.body;

  if (!id || !senha) {
    return res.status(400).json({ error: 'ID e senha obrigatórios' });
  }

  try {
    const raw = fs.readFileSync(caminho, 'utf8');
    const json = JSON.parse(raw);
    const academia = json.dados[id];

    if (!academia) return res.status(404).json({ error: 'Academia não encontrada' });

    if (academia.senha !== senha) return res.status(401).json({ error: 'Senha incorreta' });

    res.json({ message: 'Login autorizado', nome: academia.nome });
  } catch (e) {
    res.status(500).json({ error: 'Erro interno no login' });
  }
});

module.exports = router;
