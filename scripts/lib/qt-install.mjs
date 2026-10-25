// scripts/lib/qt-install.mjs
//
// Resolves a local Qt 6 installation *without* hardcoding a version number, so
// upgrading Qt (6.10 -> 6.12 -> ...) never breaks the tooling again.
//
// Resolution order:
//   1. QTDIR / QT_PREFIX / CMAKE_PREFIX_PATH entries (explicit wins)
//   2. `<root>/current` for every known Qt install root
//   3. `<root>/<version>` sorted newest-first, newest compatible kit
//   4. `qmake -query QT_INSTALL_PREFIX` when qmake is on PATH
//
// Every candidate must look like a usable Qt prefix (`bin/qmake*` or
// `lib/cmake/Qt6`), otherwise it is skipped.

import { existsSync, readdirSync, statSync, realpathSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, join } from 'node:path';

const VERSION_RE = /^(\d+)\.(\d+)(?:\.(\d+))?(?:-.*)?$/;

/** Kits we can build against, in descending preference. */
const KIT_PREFERENCE = [
  'msvc2022_64',
  'msvc2019_64',
  'llvm-mingw_64',
  'mingw_64',
  'macos',
  'clang_64',
  'gcc_64',
];

/** Qt install roots we probe when no environment variable says otherwise. */
export const DEFAULT_QT_ROOTS = [
  'D:/pengj/qt',
  'C:/pengj/qt',
  'C:/Qt',
  'D:/Qt',
  'C:/Program Files/Qt',
];

function compareVersionsDesc(a, b) {
  const pa = a.split('.').map((n) => Number.parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => Number.parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const diff = (pb[i] ?? 0) - (pa[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** A directory is a Qt prefix when it carries the cmake package or qmake. */
export function looksLikeQtPrefix(dir) {
  if (!dir || !existsSync(dir)) return false;
  return (
    existsSync(join(dir, 'lib', 'cmake', 'Qt6')) ||
    existsSync(join(dir, 'bin', 'qmake.exe')) ||
    existsSync(join(dir, 'bin', 'qmake')) ||
    existsSync(join(dir, 'bin', 'qmake6'))
  );
}

function safeStat(p) {
  try {
    return statSync(p);
  } catch {
    return null;
  }
}

function versionDirs(root) {
  if (!root || !existsSync(root)) return [];
  let entries;
  try {
    entries = readdirSync(root, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => (e.isDirectory() || e.isSymbolicLink()) && VERSION_RE.test(e.name))
    .map((e) => e.name)
    .sort(compareVersionsDesc)
    .map((name) => join(root, name));
}

function kitsIn(versionDir) {
  const ordered = [];
  for (const kit of KIT_PREFERENCE) {
    const candidate = join(versionDir, kit);
    if (looksLikeQtPrefix(candidate)) ordered.push(candidate);
  }
  // Unknown kit layouts: accept any direct child that looks like a prefix.
  if (ordered.length === 0 && safeStat(versionDir)?.isDirectory()) {
    for (const entry of readdirSync(versionDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const candidate = join(versionDir, entry.name);
      if (looksLikeQtPrefix(candidate)) ordered.push(candidate);
    }
  }
  return ordered;
}

function fromQmakeOnPath() {
  for (const exe of ['qmake6', 'qmake']) {
    const probe = spawnSync(exe, ['-query', 'QT_INSTALL_PREFIX'], { encoding: 'utf8' });
    const prefix = probe.stdout?.trim();
    if (probe.status === 0 && looksLikeQtPrefix(prefix)) return prefix;
  }
  return null;
}

/**
 * @param {{ env?: NodeJS.ProcessEnv, roots?: string[], minVersion?: string,
 *           onWarn?: (message: string) => void }} [options]
 * @returns {string|null} absolute Qt prefix, e.g. `D:\\pengj\\qt\\6.12.0\\msvc2022_64`
 */
export function detectQtPrefix(options = {}) {
  const env = options.env ?? process.env;
  const roots = options.roots ?? DEFAULT_QT_ROOTS;
  const warn = options.onWarn ?? (() => {});
  const minVersion = options.minVersion;

  const explicit = [env.QTDIR, env.QT_PREFIX, env.QT_ROOT]
    .flatMap((value) => (value ? value.split(';') : []))
    .filter(Boolean);
  // CMAKE_PREFIX_PATH may legitimately point at a kit dir or a version dir.
  for (const value of (env.CMAKE_PREFIX_PATH ?? '').split(';').filter(Boolean)) {
    explicit.push(value);
    for (const kit of KIT_PREFERENCE) explicit.push(join(value, kit));
  }

  const candidates = [...explicit];
  for (const root of roots) {
    const current = join(root, 'current');
    candidates.push(current);
    for (const kit of KIT_PREFERENCE) candidates.push(join(current, kit));
    for (const versionDir of versionDirs(root)) candidates.push(...kitsIn(versionDir));
  }

  for (const candidate of candidates) {
    if (!looksLikeQtPrefix(candidate)) continue;
    const prefix = resolve(candidate);
    if (minVersion) {
      const found = /[/\\](\d+\.\d+(?:\.\d+)?)[/\\]?/.exec(prefix)?.[1];
      if (found && compareVersionsDesc(found, minVersion) > 0) {
        warn(`Qt ${found} at ${prefix} is older than the required ${minVersion}; skipping.`);
        continue;
      }
    }
    return prefix;
  }

  return fromQmakeOnPath();
}

/** Convenience: the `bin` directory to prepend to PATH so Qt DLLs resolve. */
export function detectQtBin(options = {}) {
  const prefix = detectQtPrefix(options);
  return prefix ? resolve(prefix, 'bin') : null;
}

/** The `x.y.z` version of a Qt prefix, or null when it is not encoded in the path. */
export function qtVersionOf(prefix) {
  if (!prefix) return null;
  const paths = [resolve(prefix)];
  try {
    paths.push(realpathSync(prefix)); // resolves a `current` -> `6.12.0` symlink
  } catch {}
  for (const candidate of paths) {
    const hit = candidate.split(/[/\\]+/).find((segment) => VERSION_RE.test(segment));
    if (hit) return hit;
  }
  return null;
}
