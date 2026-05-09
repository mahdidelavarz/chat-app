require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// Get the database type from environment or default to postgres
const dbType = process.env.DB_TYPE || 'postgres';

// Base configuration
const baseConfig = {
  type: dbType,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers',
  },
};

// SQL Server specific configurations
if (dbType === 'mssql') {
  baseConfig.options = {
    encrypt: process.env.DB_OPTIONS_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_OPTIONS_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
  };
}

// PostgreSQL specific configurations
if (dbType === 'postgres') {
  baseConfig.ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;
}

module.exports = baseConfig;