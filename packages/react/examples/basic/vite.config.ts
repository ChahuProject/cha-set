import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: /^@chahu\/cha-set$/,
        replacement: path.resolve(import.meta.dirname, '../../src/index.ts'),
      },
    ],
  },
  server: {
    port: 5173,
  },
});