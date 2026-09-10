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

// 2. Mandatory Dual-Stack Living Showcase & Component Completeness Gate (100% React & Qt Coverage)
const navPath = resolve(root, 'spec', 'showcase', 'navigation.json');
const reactAppPath = resolve(root, 'packages', 'react', 'examples', 'basic', 'src', 'App.tsx');
const reactDocPagesDir = resolve(root, 'packages', 'react', 'examples', 'basic', 'src', 'pages', 'components');

const qtSrcDir = resolve(root, 'qt', 'src');
const qtMainPath = resolve(root, 'qt', 'src', 'Main.qml');
const qtCmakePath = resolve(root, 'qt', 'CMakeLists.txt');
const componentsDir = resolve(root, 'spec', 'components');

if (existsSync(componentsDir) && existsSync(navPath)) {
  const nav = JSON.parse(readFileSync(navPath, 'utf8'));
  const navIds = new Set(nav.flatMap(group => group.items.map(item => item.id)));
  const reactAppContent = existsSync(reactAppPath) ? readFileSync(reactAppPath, 'utf8') : '';
  const qtMainContent = existsSync(qtMainPath) ? readFileSync(qtMainPath, 'utf8') : '';
  const qtCmakeContent = existsSync(qtCmakePath) ? readFileSync(qtCmakePath, 'utf8') : '';
  const specFiles = readdirSync(componentsDir).filter(f => f.endsWith('.ts'));

  function toPascalCase(str) {
    return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  }

  const specialMap = {
    'scrollbar': { navId: 'scroll-area', reactDoc: 'ScrollAreaDocPage.tsx', qtDoc: 'ScrollAreaDocPage.qml', qtComp: 'ChaSetScrollBar.qml' },
    'data-table': { navId: 'generic-data-table', reactDoc: 'GenericDataTableDocPage.tsx', qtDoc: 'GenericDataTableDocPage.qml', qtComp: 'ChaSetGenericDataTable.qml' }
  };

  let missingCount = 0;
  for (const file of specFiles) {
    const base = file.replace('.ts', '');
    const pascal = toPascalCase(base);
    const navId = specialMap[base]?.navId || base;
    const reactDocName = specialMap[base]?.reactDoc || `${pascal}DocPage.tsx`;
    const qtDocName = specialMap[base]?.qtDoc || `${pascal}DocPage.qml`;
    const qtCompName = specialMap[base]?.qtComp || `ChaSet${pascal}.qml`;

    // 1. Navigation item in spec/showcase/navigation.json
    const hasNav = navIds.has(navId);

    // 2. React Living Showcase (DocPage file & App.tsx route)
    const hasReactDoc = existsSync(resolve(reactDocPagesDir, reactDocName));
    const hasReactRoute = reactAppContent.includes(reactDocName.replace('.tsx', ''));

    // 3. Qt Library Component file & CMake registration
    const hasQtComp = existsSync(resolve(qtSrcDir, qtCompName));
    const hasQtCompCmake = qtCmakeContent.includes(`src/${qtCompName}`);

    // 4. Qt Living Showcase (DocPage file, Main.qml route, & CMake registration)
    const hasQtDoc = existsSync(resolve(qtSrcDir, qtDocName));
    const hasQtDocCmake = qtCmakeContent.includes(`src/${qtDocName}`);
    const hasQtRoute = qtMainContent.includes(`"${navId}"`) && qtMainContent.includes(`"${qtDocName}"`);

    const checks = [
      { ok: hasNav, msg: `Missing navigation entry in spec/showcase/navigation.json (id: "${navId}")` },
      { ok: hasReactDoc, msg: `Missing React doc page: packages/react/examples/basic/src/pages/components/${reactDocName}` },
      { ok: hasReactRoute, msg: `Missing React route in packages/react/examples/basic/src/App.tsx` },
      { ok: hasQtComp, msg: `Missing Qt component: qt/src/${qtCompName}` },
      { ok: hasQtCompCmake, msg: `Missing Qt component CMake registration: qt/CMakeLists.txt (src/${qtCompName})` },
      { ok: hasQtDoc, msg: `Missing Qt doc page: qt/src/${qtDocName}` },
      { ok: hasQtDocCmake, msg: `Missing Qt doc page CMake registration: qt/CMakeLists.txt (src/${qtDocName})` },
      { ok: hasQtRoute, msg: `Missing Qt getPageSource route in qt/src/Main.qml (case "${navId}": return "${qtDocName}")` }
    ];

    const failedChecks = checks.filter(c => !c.ok);
    if (failedChecks.length > 0) {
      console.error(`[gate] FAIL: Component "${base}" is missing dual-stack showcase coverage:`);
      for (const fc of failedChecks) {
        console.error(`  - ${fc.msg}`);
      }
      missingCount++;
      failed = true;
    }
  }

  if (failed) {
    console.error(`[gate] Showcase documentation & dual-stack completeness failed (${missingCount} components incomplete).`);
    console.error(`[gate] Golden Red Line: Every component MUST have 100% living showcase demos and implementations in BOTH React and Qt before PR/gate sign-off.`);
    process.exit(1);
  }
  console.log(`[gate] OK — 100% Dual-Stack Living Showcase documentation coverage (${specFiles.length} components registered across React & Qt)`);
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

// 4. React Showcase Smoke & Interactive Click Integrity Check
const showcaseTestFile = resolve(root, 'packages/react/src/__tests__/showcase-pages.test.tsx');
if (existsSync(showcaseTestFile)) {
  const { execSync } = await import('node:child_process');
  try {
    execSync('pnpm --filter @chahu/cha-set exec vitest run src/__tests__/showcase-pages.test.tsx', {
      cwd: root,
      stdio: 'pipe',
      encoding: 'utf8',
    });
    console.log('[gate] OK — React showcase living documentation pages smoke & click integrity passed (all showcase pages verified)');
  } catch (err) {
    console.error('[gate] FAIL: React showcase living documentation pages smoke & click integrity check failed');
    if (err.stdout) console.error(err.stdout);
    if (err.stderr) console.error(err.stderr);
    process.exit(1);
  }
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