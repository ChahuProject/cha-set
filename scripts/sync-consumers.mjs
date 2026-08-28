// scripts/sync-consumers.mjs — copy generated artifacts into sibling product
// checkouts (committed-artifacts house style; see docs/token-mapping.md).
//
// SoT is now split shards spec/tokens/** aggregated via spec/build-tokens.mjs
// into spec/tokens.json (committed snapshot); generators read via spec/load-tokens.mjs.
// Run `pnpm gen:all` before sync to ensure dist/consumers/** is fresh.
//
// Usage: node scripts/sync-consumers.mjs [--dry-run]
// Behavior: for each consumer whose checkout exists next to this repo, copy
// the artifact and print the exact `git -C <repo> status` hint. Missing
// siblings are skipped with a notice (CI-safe). --dry-run logs without copying.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(repoRoot, 'dist', 'consumers');

const CONSUMERS = [
  {
    repo: resolve(repoRoot, '..', 'crd-a'),
    workdir: 'launcher',
    copies: [
      {
        from: resolve(dist, 'launcher', 'generated', 'tokens.generated.css'),
        to: resolve(repoRoot, '..', 'crd-a', 'launcher', 'src', 'css', 'generated', 'tokens.generated.css'),
      },
    ],
    note: 'commit inside crd-a: launcher/src/css/generated/',
  },
  {
    repo: resolve(repoRoot, '..', 'dt-a'),
    workdir: '.',
    copies: [
      {
        from: resolve(dist, 'dunting', 'generated', 'theme_tokens.generated.h'),
        to: resolve(repoRoot, '..', 'dt-a', 'theme', 'generated', 'theme_tokens.generated.h'),
      },
    ],
    note: 'commit inside dt-a: theme/generated/ (then touch theme/theme_manager.cpp — ninja depfile quirk)',
  },
];

const dryRun = process.argv.includes('--dry-run');
if (dryRun) console.log('[sync] --dry-run: no files will be written');
console.log('[sync] SoT: spec/tokens/** -> spec/tokens.json (via spec/build-tokens.mjs) -> dist/consumers/** -> sibling repos');

let synced = 0;
for (const c of CONSUMERS) {
  if (!existsSync(c.repo)) {
    console.log(`[sync] skip (checkout not found): ${c.repo}`);
    continue;
  }
  for (const cp of c.copies) {
    if (!existsSync(cp.from)) {
      console.error(`[sync] MISSING artifact (run pnpm gen:all first): ${cp.from}`);
      process.exitCode = 1;
      continue;
    }
    if (dryRun) {
      console.log(`[sync] [dry-run] would copy ${cp.from} -> ${cp.to}`);
    } else {
      mkdirSync(dirname(cp.to), { recursive: true });
      copyFileSync(cp.from, cp.to);
      console.log(`[sync] copied -> ${cp.to}`);
    }
    synced += 1;
  }
  const status = execSync(`git -C "${c.repo}" status --porcelain`, { encoding: 'utf8' }).trim();
  console.log(`[sync] ${c.repo} now dirty paths:\n${status || '  (clean)'}`);
  console.log(`[sync] remember: ${c.note}`);
}
console.log(`[sync] done — ${synced} file(s) ${dryRun ? 'would be ' : ''}copied`);
