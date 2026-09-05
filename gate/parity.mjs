#!/usr/bin/env node
// Parity gate: every "must" capability declared in spec/capabilities.json
// must be covered by every implementation that currently exists.
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const capabilities = JSON.parse(readFileSync(resolve(root, 'spec', 'capabilities.json'), 'utf8'));

const stacks = [
  { name: 'react', coverageFile: resolve(root, 'packages/react/conformance/coverage.json') },
  { name: 'qt', coverageFile: resolve(root, 'qt/conformance/coverage.json') },
];

let failed = false;
let checked = 0;

for (const [componentId, caps] of Object.entries(capabilities.components)) {
  for (const [capId, spec] of Object.entries(caps)) {
    if (spec.requirement !== 'must') continue;
    for (const stack of stacks) {
      if (!existsSync(stack.coverageFile)) continue; // stack not implemented yet
      const coverage = JSON.parse(readFileSync(stack.coverageFile, 'utf8'));
      checked += 1;
      if (coverage[componentId]?.[capId] !== true) {
        console.error(`[gate] FAIL ${stack.name} is missing must capability "${componentId}.${capId}"`);
        failed = true;
      }
    }
  }
}

if (failed) {
  console.error('[gate] parity check failed');
  process.exit(1);
}
console.log(`[gate] OK — all must capabilities covered (${checked} checks)`);

// 2. Executable Behavioral Parity Checks
const qtExe = resolve(root, 'qt/build/QtChaSetDemo.exe');
if (existsSync(qtExe)) {
  const { spawnSync } = await import('node:child_process');
  const testRes = spawnSync(qtExe, ['--test-scenario', 'all'], { encoding: 'utf8' });
  if (testRes.status !== 0) {
    console.error('[gate] FAIL: Qt runtime behavioral scenario assertions failed');
    if (testRes.stdout) console.error(testRes.stdout);
    if (testRes.stderr) console.error(testRes.stderr);
    process.exit(1);
  }
  console.log('[gate] OK — Qt runtime behavioral scenario assertions passed (showcase-data, scroll-kinematics, steppers)');
}

// 3. Optional Targeted Pixel Conformance Gate (selective opt-in)
if (process.argv.includes('--pixel')) {
  const compIndex = process.argv.indexOf('--component');
  const comp = compIndex !== -1 ? process.argv[compIndex + 1] : 'all';
  console.log(`[gate] Executing targeted pixel-level conformance gate for ${comp}...`);
  const { execSync } = await import('node:child_process');
  execSync(`node scripts/pixel-sync-test.mjs --component ${comp}`, { stdio: 'inherit', cwd: root });
  console.log('[gate] OK — Pixel conformance gate passed!');
}