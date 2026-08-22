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