#!/usr/bin/env node
// Parity gate: validates capabilities, living showcase docs completeness, and behavioral/pixel parity.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
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

// 1. Check capability contract coverage
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
  console.error('[gate] capability parity check failed');
  process.exit(1);
}
console.log(`[gate] OK — all must capabilities covered (${checked} checks)`);

// 2. Mandatory Living Showcase Documentation & Demo Completeness Gate (100% Coverage)
const navPath = resolve(root, 'spec', 'showcase', 'navigation.json');
const appPath = resolve(root, 'packages', 'react', 'examples', 'basic', 'src', 'App.tsx');
const componentsDir = resolve(root, 'spec', 'components');
const docPagesDir = resolve(root, 'packages', 'react', 'examples', 'basic', 'src', 'pages', 'components');

if (existsSync(componentsDir) && existsSync(navPath) && existsSync(appPath)) {
  const nav = JSON.parse(readFileSync(navPath, 'utf8'));
  const navIds = new Set(nav.flatMap(group => group.items.map(item => item.id)));
  const appContent = readFileSync(appPath, 'utf8');
  const specFiles = readdirSync(componentsDir).filter(f => f.endsWith('.ts'));

  const specialMap = {
    'scrollbar': { navId: 'scroll-area', docPage: 'ScrollAreaDocPage.tsx' },
    'data-table': { navId: 'generic-data-table', docPage: 'GenericDataTableDocPage.tsx' }
  };

  function toPascalCase(str) {
    return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  }

  let docMissing = 0;
  for (const file of specFiles) {
    const base = file.replace('.ts', '');
    const navId = specialMap[base]?.navId || base;
    const docPage = specialMap[base]?.docPage || `${toPascalCase(base)}DocPage.tsx`;
    const docPath = resolve(docPagesDir, docPage);

    const hasNav = navIds.has(navId);
    const hasDoc = existsSync(docPath);
    const hasRoute = appContent.includes(docPage.replace('.tsx', ''));

    if (!hasNav || !hasDoc || !hasRoute) {
      console.error(`[gate] FAIL: Component "${base}" is missing living showcase coverage:`);
      if (!hasNav) console.error(`  - Missing navigation entry in spec/showcase/navigation.json (id: "${navId}")`);
      if (!hasDoc) console.error(`  - Missing doc page component: packages/react/examples/basic/src/pages/components/${docPage}`);
      if (!hasRoute) console.error(`  - Missing route/import in packages/react/examples/basic/src/App.tsx`);
      docMissing++;
      failed = true;
    }
  }

  if (failed) {
    console.error(`[gate] Showcase documentation completeness failed (${docMissing} components incomplete).`);
    console.error(`[gate] Golden Red Line: Every component MUST have a living showcase demo before PR/gate sign-off.`);
    process.exit(1);
  }
  console.log(`[gate] OK — 100% Living Showcase documentation coverage (${specFiles.length} components registered)`);
}

// 3. Executable Behavioral Parity Checks
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

// 4. Optional Targeted Pixel Conformance Gate (selective opt-in)
if (process.argv.includes('--pixel')) {
  const compIndex = process.argv.indexOf('--component');
  const comp = compIndex !== -1 ? process.argv[compIndex + 1] : 'all';
  console.log(`[gate] Executing targeted pixel-level conformance gate for ${comp}...`);
  const { execSync } = await import('node:child_process');
  execSync(`node scripts/pixel-sync-test.mjs --component ${comp}`, { stdio: 'inherit', cwd: root });
  console.log('[gate] OK — Pixel conformance gate passed!');
}