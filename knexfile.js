// knexfile.js
require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'Wollacy1807@',
      database: 'assistente_academia',
      port: 5432
    },
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    }
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.PGHOST || process.env.POSTGRES_HOST,
      user: process.env.PGUSER || process.env.POSTGRES_USER,
      password: process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD,
      database: process.env.PGDATABASE || process.env.POSTGRES_DB,
      port: process.env.PGPORT || 5432,
      ssl: { rejectUnauthorized: false } // Railway geralmente precisa de SSL
    },
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    }
  }
};
