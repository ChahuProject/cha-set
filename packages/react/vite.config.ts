import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'ChasetUI',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      cssFileName: 'styles',
    },
    rollupOptions: {
      // Everything the library imports at runtime stays external so consumers
      // get single instances (clsx/twMerge identity matters for cn() interop).
      // Regexes cover scoped subpath imports.
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@radix-ui/react-slot',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        /^@base-ui\/react(\/.*)?$/,
      ],
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
});