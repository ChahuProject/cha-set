import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const tokens = JSON.parse(readFileSync(resolve(repoRoot, 'spec', 'tokens.json'), 'utf8'));
const outFile = resolve(repoRoot, 'packages', 'react', 'src', 'styles', 'tokens.css');

const lines = [':root {'];
for (const [group, entries] of Object.entries(tokens)) {
  for (const [name, def] of Object.entries(entries)) {
    lines.push(`  --cs-${group}-${name}: ${def.$value};`);
  }
}
lines.push('}');

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, lines.join('\n') + '\n', 'utf8');
console.log(`[gen:css] generated ${outFile}`);