import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { beforeAll, afterAll } from 'vitest';
import { closeDatabase, getDatabase } from '../src/backend/db/database.js';
import { runSeed } from '../src/backend/db/seeds/initial-seed.js';
import { config } from '../src/backend/config/env.js';

const __filename = fileURLToPath(import.meta.url);
export function resetTestDb(): void {
  const db = getDatabase();
  db.pragma('foreign_keys = OFF');
  db.exec(`
    DROP TABLE IF EXISTS auditoria_evaluaciones;
    DROP TABLE IF EXISTS rastro_auditoria;
    DROP TABLE IF EXISTS umbrales_flujo;
  `);
  db.pragma('foreign_keys = ON');
  const schemaContent = fs.readFileSync(config.schemaPath, 'utf-8');
  db.exec(schemaContent);
  runSeed();
}

beforeAll(() => {
  resetTestDb();
});

afterAll(() => {
  closeDatabase();
});

