import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const e2eDbPath = path.resolve(rootDir, 'data/mira.e2e.db');

export default defineConfig({
  testDir: path.resolve(__dirname, './e2e'),
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'npx tsx tests/playwright.global-setup.ts && npx tsx src/backend/server.ts',
      url: 'http://localhost:3001/api/session/current',
      reuseExistingServer: false,
      timeout: 15000,
      cwd: rootDir,
      env: {
        DB_PATH: e2eDbPath,
      },
    },
    {
      command: process.platform === 'win32' ? 'npm.cmd run dev:frontend' : 'npm run dev:frontend',
      url: 'http://localhost:5173',
      reuseExistingServer: false,
      timeout: 15000,
      cwd: rootDir,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
