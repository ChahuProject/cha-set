#!/usr/bin/env node
// scripts/run-qt-showcase.mjs — Build and launch the Qt Showcase & Style Studio.
// Automatically discovers local Qt 6 installations, configures CMake, builds with Ninja/MSVC,
// and runs QtChaSetDemo.exe.

import { existsSync, readdirSync } from 'node:fs';
import { spawnSync, spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { detectQtPrefix, qtVersionOf } from './lib/qt-install.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const qtDir = resolve(repoRoot, 'qt');

// 1. Locate Qt 6 root — never a hardcoded version, so a Qt upgrade needs no edits.
//    Resolution order lives in scripts/lib/qt-install.mjs (QTDIR / CMAKE_PREFIX_PATH,
//    then `<root>/current`, then the newest `<root>/<version>` directory).
let qtPrefix = detectQtPrefix({
  onWarn: (msg) => console.warn(`[qt-showcase] ${msg}`),
});

if (!qtPrefix) {
  console.warn('[qt-showcase] Warning: Could not auto-detect Qt 6 path from standard locations.');
  console.warn('[qt-showcase] Please ensure Qt 6 is in PATH or set QTDIR / CMAKE_PREFIX_PATH.');
} else {
  console.log(`[qt-showcase] Found Qt ${qtVersionOf(qtPrefix) ?? ''} at: ${qtPrefix}`);

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
// --hot / --hot-reload: separate Debug build with QML debugging infra,
// launched under the official qmlpreview tool so QML edits apply live
// without restarting the app (C++ edits still need a rebuild).
const hotReload = rawArgs.includes('--hot') || rawArgs.includes('--hot-reload');
const forwardArgs = rawArgs.filter((arg) => arg !== '--build-only' && arg !== '--hot' && arg !== '--hot-reload');

const buildDir = hotReload ? resolve(qtDir, 'build-hot') : resolve(qtDir, 'build');
const buildType = hotReload ? 'Debug' : 'Release';

// 0. Regenerate all spec-derived artifacts first, so `pnpm showcase:qt`
// always launches with the latest tokens / i18n / showcase data / icons.
// QML itself is compiled from qt/src on every build below, but the
// *.generated.qml singletons would otherwise lag behind spec/ edits.
console.log('\n[qt-showcase] 0. Regenerating spec-derived artifacts...');
const genRes = spawnSync(process.execPath, [resolve(repoRoot, 'spec/generators/generate-all.mjs')], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: process.env,
});

if (genRes.status !== 0) {
  console.error('[qt-showcase] Artifact regeneration failed.');
  process.exit(genRes.status || 1);
}

// 3. Configure with CMake
console.log('\n[qt-showcase] 1. Configuring CMake...');
const cmakeArgs = ['-S', qtDir, '-B', buildDir, '-G', 'Ninja', `-DCMAKE_BUILD_TYPE=${buildType}`];
if (hotReload) {
  cmakeArgs.push('-DCHASET_QML_HOT_RELOAD=ON');
}
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
const buildRes = spawnSync('cmake', ['--build', buildDir, '--parallel'], {
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

// Hot mode: run under the official qmlpreview tool so QML edits in qt/src
// apply live without restarting the app. qmlpreview usage:
// `qmlpreview [options] executable [parameters...]`.
let launchPath = exePath;
let launchArgs = forwardArgs;
if (hotReload) {
  const qmlPreviewCandidates = qtPrefix
    ? [resolve(qtPrefix, 'bin', process.platform === 'win32' ? 'qmlpreview.exe' : 'qmlpreview')]
    : [];
  const qmlPreview = qmlPreviewCandidates.find((p) => existsSync(p));
  if (qmlPreview) {
    console.log('[qt-showcase] Hot reload active: QML edits apply live in-place (C++ edits still need a rebuild).');
    launchPath = qmlPreview;

    // Collect all generated QRC resource files across ChaSet and QtChaSetDemo so
    // qmlpreview maps qrc: URIs back to disk files for all components and showcase pages.
    const resourceFlags = [];
    const rccDir = resolve(buildDir, '.qt', 'rcc');
    if (existsSync(rccDir)) {
      const qrcFiles = readdirSync(rccDir).filter((f) => f.endsWith('.qrc'));
      for (const qrc of qrcFiles) {
        resourceFlags.push('--resource', resolve(rccDir, qrc));
      }
    }

    const verbose = forwardArgs.includes('--verbose');
    const appArgs = forwardArgs.filter((a) => a !== '--verbose');
    const previewFlags = verbose ? ['--verbose'] : [];

    launchArgs = [...previewFlags, ...resourceFlags, exePath, ...(verbose ? ['--verbose', ...appArgs] : appArgs)];
  } else {
    console.warn('[qt-showcase] Warning: qmlpreview tool not found; running without live reload.');
  }
}

const appProcess = spawn(launchPath, launchArgs, {
  cwd: qtDir,
  stdio: 'inherit',
  env: process.env,
});

appProcess.on('exit', (code) => {
  process.exit(code ?? 0);
});
