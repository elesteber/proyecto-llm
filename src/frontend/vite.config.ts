import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const currentDir = import.meta.dirname;

// Configuración de Vite para MIRA (Frontend SPA)
// Cumple: T002, PC-03, Criterio C4
// Proxy inverso transparente: /api -> http://localhost:3001
export default defineConfig({
  root: currentDir,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(currentDir, './'),
      '@shared': path.resolve(currentDir, '../shared'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: path.resolve(currentDir, '../../dist'),
    emptyOutDir: true,
  },
});
