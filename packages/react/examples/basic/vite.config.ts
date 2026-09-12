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
      {
        // Keep dev off the built artifact: a fresh clone has no dist/, and the
        // built CSS would also lag behind source edits. Matches the subpath
        // export declared in packages/react/package.json.
        find: '@chahu/cha-set/styles.css',
        replacement: path.resolve(import.meta.dirname, '../../src/styles/index.css'),
      },
    ],
  },
  server: {
    port: 5173,
  },
});