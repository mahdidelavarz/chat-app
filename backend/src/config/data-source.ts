import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import path from 'path';

// Load the appropriate .env file based on NODE_ENV and DB_TYPE
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production'
  : `.env.${process.env.DB_TYPE || 'postgres'}.local`;

dotenv.config({ path: path.resolve(__dirname, '../../', envFile) });

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  ...(process.env.DB_TYPE === 'mssql' && {
    options: {
      encrypt: process.env.DB_OPTIONS_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_OPTIONS_TRUST_SERVER_CERTIFICATE === 'true',
    },
  }),
});