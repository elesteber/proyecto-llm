import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../src/backend/config/env.js';
import { closeDatabase, getDatabase } from '../src/backend/db/database.js';
import { runSeed } from '../src/backend/db/seeds/initial-seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const e2eDbPath = path.resolve(__dirname, '../data/mira.e2e.db');

export default async function globalSetup(): Promise<void> {
  // Recrear la base de datos E2E limpia desde cero antes de arrancar los servidores
  closeDatabase();

  if (fs.existsSync(e2eDbPath)) {
    try {
      fs.unlinkSync(e2eDbPath);
    } catch {
      // Ignorar si está en uso o ya fue eliminado
    }
  }

  const journalPath = `${e2eDbPath}-journal`;
  if (fs.existsSync(journalPath)) {
    try {
      fs.unlinkSync(journalPath);
    } catch {
      // Ignorar
    }
  }

  // Inicializar esquema relacional idempotente y sembrar Versión 1 por defecto
  config.dbPath = e2eDbPath;
  getDatabase();
  runSeed();
  closeDatabase();
  console.log(`[E2E SETUP] Base de datos aislada inicializada en: ${e2eDbPath}`);
}

if (process.argv[1] && process.argv[1].includes('playwright.global-setup')) {
  await globalSetup();
}
