import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const toPosix = (p) => p.replace(/\\/g, '/');
export default {
  test: {
    environment: 'node',
    globals: true,
    include: [toPosix(resolve(__dirname, '__tests__/**/*.test.mjs')), toPosix(resolve(__dirname, '__tests__/**/*.test.ts'))],
  },
};
