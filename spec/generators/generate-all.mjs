// spec/generators/generate-all.mjs — run every generator in one shot.
// Usage: node spec/generators/generate-all.mjs
// SoT is now split shards spec/tokens/** aggregated via spec/build-tokens.mjs;
// generate-all runs build-tokens first when shards exist, then css+qt.
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..');
const run = (script) => {
  console.log(`[gen:all] > ${script}`);
  execFileSync(process.execPath, [resolve(here, script)], { stdio: 'inherit' });
};

const tokensDir = resolve(here, '..', 'tokens');
if (existsSync(tokensDir)) {
  const buildScript = resolve(here, '..', 'build-tokens.mjs');
  if (existsSync(buildScript)) {
    console.log('[gen:all] > spec/build-tokens.mjs (snapshot from spec/tokens/**)');
    execFileSync(process.execPath, [buildScript], { stdio: 'inherit' });
  }
}

run('generate-css.mjs');
run('generate-qt.mjs');
console.log('[gen:all] all generators completed');
