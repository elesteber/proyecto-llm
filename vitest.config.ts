import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './src/shared'),
      '@backend': path.resolve(__dirname, './src/backend'),
    },
  },
});
