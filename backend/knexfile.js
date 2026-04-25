require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mssql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '1433'),
      user: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || 'yourStrong(!)Password',
      database: process.env.DB_NAME || 'hackathon26',
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    },
    migrations: {
      directory: './Infrastructure/Persistence/Migrations'
    },
    seeds: {
      directory: './Infrastructure/Persistence/Seeds'
    }
  },
  production: {
    client: 'mssql',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '1433'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    },
    migrations: {
      directory: './Infrastructure/Persistence/Migrations'
    },
    seeds: {
      directory: './Infrastructure/Persistence/Seeds'
    }
  }
};
