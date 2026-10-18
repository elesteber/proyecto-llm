import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: process.platform === 'win32' ? 'npm.cmd run dev:backend' : 'npm run dev:backend',
      url: 'http://localhost:3001/api/session/current',
      reuseExistingServer: !process.env.CI,
      timeout: 15000,
    },
    {
      command: process.platform === 'win32' ? 'npm.cmd run dev:frontend' : 'npm run dev:frontend',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 15000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
