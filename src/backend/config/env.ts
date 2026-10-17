import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../');

export const config = {
  port: Number(process.env.PORT) || 3001,
  dbPath: process.env.DB_PATH || path.join(rootDir, 'data', 'mira.db'),
  casosPath: process.env.CASOS_PATH || path.join(rootDir, 'data', 'casos_prueba.json'),
  schemaPath: process.env.SCHEMA_PATH || path.join(__dirname, '../db/schema.sql'),
};
