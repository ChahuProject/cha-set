import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const dbPath = resolve('.codegraph', 'codegraph.db');
if (!existsSync(dbPath)) {
  console.log('[codegraph] First install, initializing code knowledge graph index...');
  try {
    execSync('npx codegraph query .', { stdio: 'inherit' });
  } catch (err) {
    console.warn('[codegraph] Index initialization skipped or failed (you can manually run npx codegraph query . later)');
  }
}