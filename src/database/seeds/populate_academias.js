exports.seed = async function(knex) {
  await knex('academias').del();

  await knex('academias').insert([
    {
      nome: 'Gracie Barra',
      telefone: '5584999999999',
      contexto: 'A academia funciona de segunda a sábado das 8h às 22h. Valor dos planos: Básico 2x por semana R$ 100,00. Premium 4x por semana R$ 160,00. Unlimited qualquer dia da semana R$ 250,00\nQuero respostas mais casuais, sem muita formalidade, responde apenas oque o usuário deseja saber, se ele mandar apenas uma saudação, dê a ele boas vindas e fale no que pode ser útil.',
      senha: '1234'
    },
    {
      nome: 'Checkmat',
      telefone: '5547997557903',
      contexto: 'Treinos de jiu-jitsu todas às segundas, quartas e sextas, em 4 horários, 7:00, 10:00, 15:00 e 19:00.\nTreinos de muay-thai todas às terças e quintas também em 4 horários 7:00, 10:00, 15:00 e 19:00.\nAcademia todos os dias de segunda à sábado das 6:00 às 23:00, domingo das 7:00 às 20:00\nMensalidade:\nMusculação R$ 90,00 3x por semana ou R$ 120,00 todos os dias\nLutas R$ 180,00 qualquer uma.\nCombos: na escolha da segunda atividade ganha 10% de desconto',
      senha: 'senha123'
    }
  ]);
};
