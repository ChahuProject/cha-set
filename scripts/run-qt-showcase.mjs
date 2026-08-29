#!/usr/bin/env node
// scripts/run-qt-showcase.mjs — Build and launch the Qt Showcase & Style Studio.
// Automatically discovers local Qt 6 installations, configures CMake, builds with Ninja/MSVC,
// and runs QtChaSetDemo.exe.

import { existsSync } from 'node:fs';
import { spawnSync, spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const qtDir = resolve(repoRoot, 'qt');
const buildDir = resolve(qtDir, 'build');

// 1. Locate Qt 6 root
const candidateQtPaths = [
  process.env.QTDIR,
  process.env.CMAKE_PREFIX_PATH,
  'D:\\pengj\\qt\\6.10.1\\msvc2022_64',
  'C:\\pengj\\qt\\6.10.1\\msvc2022_64',
  'C:\\Qt\\6.10.1\\msvc2022_64',
  'D:\\Qt\\6.10.1\\msvc2022_64',
].filter(Boolean);

let qtPrefix = candidateQtPaths.find((p) => existsSync(resolve(p, 'bin', 'qmake.exe')) || existsSync(resolve(p, 'lib', 'cmake', 'Qt6')));

if (!qtPrefix) {
  console.warn('[qt-showcase] Warning: Could not auto-detect Qt 6 path from standard locations.');
  console.warn('[qt-showcase] Please ensure Qt 6 is in PATH or set QTDIR / CMAKE_PREFIX_PATH.');
} else {
  console.log(`[qt-showcase] Found Qt 6 at: ${qtPrefix}`);
  // Prepend Qt bin directory to PATH so runtime DLLs (Qt6Core.dll, Qt6Quick.dll, etc.) are found
  const qtBin = resolve(qtPrefix, 'bin');
  process.env.PATH = `${qtBin};${process.env.PATH}`;
}

// 2. Determine command line flags
const rawArgs = process.argv.slice(2);
const buildOnly = rawArgs.includes('--build-only');
const forwardArgs = rawArgs.filter((arg) => arg !== '--build-only');

// 3. Configure with CMake
console.log('\n[qt-showcase] 1. Configuring CMake...');
const cmakeArgs = ['-S', qtDir, '-B', buildDir, '-G', 'Ninja'];
if (qtPrefix) {
  cmakeArgs.push(`-DCMAKE_PREFIX_PATH=${qtPrefix}`);
}

const configRes = spawnSync('cmake', cmakeArgs, {
  cwd: repoRoot,
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

if (configRes.status !== 0) {
  console.error('[qt-showcase] CMake configuration failed.');
  process.exit(configRes.status || 1);
}

// 4. Build with CMake
console.log('\n[qt-showcase] 2. Building QtChaSetDemo...');
const buildRes = spawnSync('cmake', ['--build', buildDir], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

if (buildRes.status !== 0) {
  console.error('[qt-showcase] CMake build failed.');
  process.exit(buildRes.status || 1);
}

if (buildOnly) {
  console.log('\n[qt-showcase] Build completed successfully (--build-only).');
  process.exit(0);
}

// 5. Find the built executable
const candidateExePaths = [
  resolve(buildDir, 'QtChaSetDemo.exe'),
  resolve(buildDir, 'Release', 'QtChaSetDemo.exe'),
  resolve(buildDir, 'Debug', 'QtChaSetDemo.exe'),
  resolve(buildDir, 'QtChaSetDemo'),
];

const exePath = candidateExePaths.find((p) => existsSync(p));

if (!exePath) {
  console.error('[qt-showcase] Could not find built executable QtChaSetDemo.exe');
  process.exit(1);
}

console.log(`\n[qt-showcase] 3. Launching ${exePath}...`);
if (forwardArgs.length > 0) {
  console.log(`[qt-showcase] Arguments: ${forwardArgs.join(' ')}`);
}

const appProcess = spawn(exePath, forwardArgs, {
  cwd: qtDir,
  stdio: 'inherit',
  env: process.env,
});

appProcess.on('exit', (code) => {
  process.exit(code ?? 0);
});
