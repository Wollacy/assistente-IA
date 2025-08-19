const knex = require('../database/db');

// Listar todos os estabelecimentos
async function listarEstabelecimentos(req, res) {
  try {
    const rows = await knex('estabelecimentos').select('*').orderBy('nome');
    res.json(rows);
  } catch (error) {
    console.error('❌ Erro ao listar estabelecimentos:', error);
    res.status(500).json({ mensagem: 'Erro ao listar estabelecimentos.' });
  }
}

// Buscar por telefone
async function buscarPorTelefone(req, res) {
  const { telefone } = req.params;
  try {
    const result = await knex('estabelecimentos')
      .where('telefone', telefone)
      .first();

    if (!result) return res.status(404).json({ mensagem: 'Não encontrado' });

    res.json(result);
  } catch (error) {
    console.error(`❌ Erro ao buscar por telefone ${telefone}:`, error);
    res.status(500).json({ mensagem: 'Erro ao buscar por telefone.' });
  }
}

// Buscar por ID
async function buscarPorId(req, res) {
  const { id } = req.params;
  try {
    const estabelecimento = await knex('estabelecimentos')
      .where('id', id)
      .first();

    if (!estabelecimento) return res.status(404).json({ mensagem: 'Não encontrado' });

    res.json(estabelecimento);
  } catch (error) {
    console.error(`❌ Erro ao buscar por ID ${id}:`, error);
    res.status(500).json({ mensagem: 'Erro ao buscar por ID.' });
  }
}

// Criar novo estabelecimento
async function criarEstabelecimento(req, res) {
  const { nome, ramo_atividade, contexto, telefone, email, plano = 'Básico' } = req.body;

  console.log('📥 Dados recebidos:', { nome, ramo_atividade, contexto, telefone });

  if (!telefone || typeof telefone !== 'string') {
    return res.status(400).json({ mensagem: 'É obrigatório fornecer um telefone válido.' });
  }

  try {
    const [retorno] = await knex('estabelecimentos')
      .insert({ nome, ramo_atividade, contexto, telefone, email, plano })
      .returning('*');

    console.log('✅ Estabelecimento criado com sucesso:', retorno);

    res.status(201).json(retorno);
  } catch (error) {
    console.error('❌ Erro ao criar estabelecimento:', error);

    if (error.code === '23505') {
      // Tratamento por nome da constraint
      if (error.constraint === 'unique_telefone') {
        res.status(409).json({ mensagem: 'Telefone já está em uso por outro estabelecimento.' });
      } else if (error.constraint === 'unique_email') {
        res.status(409).json({ mensagem: 'E-mail já está em uso por outro estabelecimento.' });
      } else {
        res.status(409).json({ mensagem: 'Já existe um registro com esses dados.' });
      }
    } else {
      res.status(500).json({ mensagem: 'Erro ao criar estabelecimento.' });
    }
  }


}

// Atualizar contexto
async function atualizarContexto(req, res) {
  const { id } = req.params;
  const { contexto } = req.body;

  try {
    const updated = await knex('estabelecimentos')
      .where({ id })
      .update({ contexto });

    if (updated === 0) return res.status(404).json({ mensagem: 'Estabelecimento não encontrado.' });

    res.json({ mensagem: 'Contexto atualizado com sucesso.' });
  } catch (error) {
    console.error('❌ Erro ao atualizar contexto:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar contexto.' });
  }
}

// Excluir estabelecimento
async function excluirEstabelecimento(req, res) {
  const { id } = req.params;
  try {
    const excluidos = await knex('estabelecimentos').where('id', id).del();

    if (excluidos === 0) {
      return res.status(404).json({ mensagem: 'Estabelecimento não encontrado.' });
    }

    res.json({ mensagem: 'Estabelecimento excluído com sucesso.' });
  } catch (error) {
    console.error('❌ Erro ao excluir estabelecimento:', error);
    res.status(500).json({ mensagem: 'Erro ao excluir estabelecimento.' });
  }
}

// Atualizar todos os dados de um estabelecimento
async function atualizarEstabelecimento(req, res) {
  const { id } = req.params;
  const { nome, ramo_atividade, contexto, telefone, email, plano } = req.body;

  try {
    const updated = await knex('estabelecimentos')
      .where({ id })
      .update({ nome, ramo_atividade, contexto, telefone, email, plano });

    if (updated === 0) {
      return res.status(404).json({ mensagem: 'Estabelecimento não encontrado.' });
    }

    res.json({ mensagem: 'Estabelecimento atualizado com sucesso.' });
  } catch (error) {
    console.error('❌ Erro ao atualizar estabelecimento:', error);

    if (error.code === '23505') {
      if (error.constraint === 'unique_telefone') {
        return res.status(409).json({ mensagem: 'Telefone já está em uso por outro estabelecimento.' });
      } else if (error.constraint === 'unique_email') {
        return res.status(409).json({ mensagem: 'E-mail já está em uso por outro estabelecimento.' });
      } else {
        return res.status(409).json({ mensagem: 'Já existe um registro com esses dados.' });
      }
    }

    res.status(500).json({ mensagem: 'Erro ao atualizar estabelecimento.' });
  }
}
// GET /api/estabelecimentos/:id/uso-mensal
async function consultarUsoMensal(req, res) {
  const { id } = req.params;
  const hoje = new Date();
  const anoMes = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;

  try {
    const estabelecimento = await knex('estabelecimentos').where({ id }).first();
    if (!estabelecimento) return res.status(404).json({ mensagem: 'Estabelecimento não encontrado.' });

    const plano = estabelecimento.plano || 'Básico';
    const limites = { 'Básico': 2000, 'Intermediário': 5000, 'Avançado': 10000, 'Ilimitado': 9999999 };
    const limite = limites[plano] || 2;

    const registro = await knex('limites_mensais')
      .where({ estabelecimento_id: id, ano_mes: anoMes })
      .first();

    const usado = registro?.mensagens_utilizadas || 0;

    res.json({ limite, usado });
  } catch (error) {
    console.error('Erro ao consultar uso mensal:', error);
    res.status(500).json({ mensagem: 'Erro ao consultar uso.' });
  }
}


module.exports = {
  listarEstabelecimentos,
  buscarPorTelefone,
  buscarPorId,
  criarEstabelecimento,
  atualizarContexto,
  excluirEstabelecimento,
  atualizarEstabelecimento,
  consultarUsoMensal
};
