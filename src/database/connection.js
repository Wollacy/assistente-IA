const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'academia_db',
  password: 'Wollacy1807@',
  port: 5432, // padrão
});

module.exports = pool;
