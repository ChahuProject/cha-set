import path from 'node:path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Mirror the showcase dev server (examples/basic/vite.config.ts): the
    // workspace package must resolve to source, never to the stale prebuilt
    // bundle in dist/. Without this the living-doc smoke tests would silently
    // assert against the last `pnpm build` output instead of the components
    // under test — and a freshly added component would resolve to undefined.
    alias: [
      {
        find: /^@chahu\/cha-set$/,
        replacement: path.resolve(import.meta.dirname, 'src/index.ts'),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.test.{ts,tsx}', 'conformance/**/*.test.{ts,tsx}'],
  },
});
