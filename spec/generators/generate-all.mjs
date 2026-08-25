// spec/generators/generate-all.mjs — run every generator in one shot.
// Usage: node spec/generators/generate-all.mjs
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const run = (script) => {
  console.log(`[gen:all] > ${script}`);
  execFileSync(process.execPath, [resolve(here, script)], { stdio: 'inherit' });
};

run('generate-css.mjs');
run('generate-qt.mjs');
console.log('[gen:all] all generators completed');
