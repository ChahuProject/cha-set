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

// 1.5 Ensure MSVC environment on Windows to avoid silent MinGW / GCC pollution
if (process.platform === 'win32') {
  const clCheck = spawnSync('where.exe', ['cl.exe'], { stdio: 'ignore' });
  if (clCheck.status !== 0) {
    console.log('[qt-showcase] cl.exe not found in PATH; attempting to locate Visual Studio vcvars64.bat...');
    let vcvarsBat = null;

    // Check vswhere
    const vswherePath = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe';
    if (existsSync(vswherePath)) {
      try {
        const vsInst = spawnSync(vswherePath, ['-latest', '-property', 'installationPath'], { encoding: 'utf8' }).stdout?.trim();
        if (vsInst) {
          const candidate = resolve(vsInst, 'VC', 'Auxiliary', 'Build', 'vcvars64.bat');
          if (existsSync(candidate)) vcvarsBat = candidate;
        }
      } catch {}
    }

    if (!vcvarsBat) {
      const candidates = [
        'C:\\Program Files\\Microsoft Visual Studio\\18\\Community\\VC\\Auxiliary\\Build\\vcvars64.bat',
        'C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\VC\\Auxiliary\\Build\\vcvars64.bat',
        'C:\\Program Files\\Microsoft Visual Studio\\2022\\Professional\\VC\\Auxiliary\\Build\\vcvars64.bat',
        'C:\\Program Files\\Microsoft Visual Studio\\2022\\Enterprise\\VC\\Auxiliary\\Build\\vcvars64.bat',
      ];
      vcvarsBat = candidates.find(existsSync);
    }

    if (vcvarsBat) {
      console.log(`[qt-showcase] Loading MSVC dev environment from: ${vcvarsBat}`);
      try {
        const envOutput = spawnSync('cmd.exe', ['/s', '/c', `"${vcvarsBat}" >nul && set`], { encoding: 'utf8' }).stdout;
        if (envOutput) {
          for (const line of envOutput.split(/\r?\n/)) {
            const eqIdx = line.indexOf('=');
            if (eqIdx > 0) {
              const key = line.slice(0, eqIdx);
              const val = line.slice(eqIdx + 1);
              process.env[key] = val;
            }
          }
          console.log('[qt-showcase] MSVC environment loaded successfully.');
        }
      } catch (err) {
        console.warn('[qt-showcase] Failed to load vcvars64.bat environment:', err.message);
      }
    } else {
      console.warn('[qt-showcase] Warning: Could not locate vcvars64.bat. CMake may fail if cl.exe is not in PATH.');
    }
  }
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
if (process.platform === 'win32') {
  cmakeArgs.push('-DCMAKE_C_COMPILER=cl', '-DCMAKE_CXX_COMPILER=cl');
}


const configRes = spawnSync('cmake', cmakeArgs, {
  cwd: repoRoot,
  stdio: 'inherit',
  env: process.env,
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
