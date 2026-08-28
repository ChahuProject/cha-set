// spec/load-tokens.mjs — single token read path with split-aware fallback.
// After split, shards contain deltas (no selector) and no qt; loader derives both.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hexToRgbf, selectorFor } from './token-helpers.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const snapshotPath = resolve(__dirname, 'tokens.json');
const tokensDir = resolve(__dirname, 'tokens');
const mappingPath = resolve(__dirname, 'qt-mapping.json');

// Known shard relative paths in deterministic merge order.
// Must stay in sync with build-tokens shard list and plan aggregation order.
const SHARD_REL_PATHS = [
  'meta.json',
  'primitives.json',
  'semantic/core.json',
  'semantic/launcher.json',
  'semantic/dunting.json',
  'composite/launcher.json',
  'themes/axes.json',
  'themes/deltas.json',
];

function isObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function deepMerge(target, source) {
  const out = { ...target };
  for (const [k, v] of Object.entries(source)) {
    if (isObject(v) && isObject(out[k])) {
      out[k] = deepMerge(out[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function hasShards() {
  if (!existsSync(tokensDir)) return false;
  try {
    for (const rel of SHARD_REL_PATHS) {
      if (existsSync(resolve(tokensDir, rel))) return true;
    }
    const entries = readdirSync(tokensDir);
    return entries.length > 0;
  } catch {
    return false;
  }
}

function readSnapshotSync() {
  try {
    return JSON.parse(readFileSync(snapshotPath, 'utf8'));
  } catch (e) {
    console.error(`[load-tokens] failed to read snapshot ${snapshotPath}: ${e.message}`);
    process.exit(1);
  }
}

function readShardsSync() {
  let merged = {};
  let found = 0;
  for (const rel of SHARD_REL_PATHS) {
    const p = resolve(tokensDir, rel);
    if (!existsSync(p)) continue;
    try {
      const data = JSON.parse(readFileSync(p, 'utf8'));
      merged = deepMerge(merged, data);
      found++;
    } catch (e) {
      console.error(`[load-tokens] failed to read shard ${rel}: ${e.message}`);
      process.exit(1);
    }
  }
  return { merged, found };
}

function getByPath(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (const part of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[part];
  }
  return cur;
}

function deriveQt(merged) {
  if (merged.qt && merged.qt.colors && merged.qt.rgbf) return merged;
  if (!merged.semantic || !merged.primitives) return merged;
  let mapping;
  try {
    mapping = JSON.parse(readFileSync(mappingPath, 'utf8'));
  } catch (e) {
    console.error(`[load-tokens] failed to read qt-mapping ${mappingPath}: ${e.message}`);
    process.exit(1);
  }
  const colors = {};
  const rgbfDerived = {};
  for (const [field, entry] of Object.entries(mapping.colors ?? {})) {
    const token = typeof entry === 'string' ? entry : entry.token;
    const transform = typeof entry === 'object' ? entry.transform : undefined;
    const sem = merged.semantic[token];
    if (!sem || !sem.presets || !sem.presets.dunting) {
      console.error(`[load-tokens] qt derive: semantic token "${token}" missing for field "${field}"`);
      process.exit(1);
    }
    const lightHex = sem.presets.dunting.light;
    const darkHex = sem.presets.dunting.dark;
    if (!lightHex || !darkHex) {
      console.error(`[load-tokens] qt derive: missing dunting preset for "${token}" field "${field}"`);
      process.exit(1);
    }
    const apply = (hex) => {
      if (!transform) return hex;
      if (transform.startsWith('alpha:')) {
        const alpha = parseFloat(transform.slice(6));
        const byte = Math.round(alpha * 255);
        return hex.slice(0, 7) + byte.toString(16).padStart(2, '0');
      }
      return hex;
    };
    const derivedLight = apply(lightHex);
    const derivedDark = apply(darkHex);
    colors[field] = { light: derivedLight, dark: derivedDark };
    try {
      rgbfDerived[field] = { light: hexToRgbf(derivedLight), dark: hexToRgbf(derivedDark) };
    } catch (e) {
      console.error(`[load-tokens] qt derive rgbf failed for ${field}: ${e.message}`);
      process.exit(1);
    }
  }
  const space = {};
  for (const [qtKey, primPath] of Object.entries(mapping.space ?? {})) {
    const v = getByPath(merged, primPath);
    if (v === undefined) {
      console.error(`[load-tokens] qt derive: missing primitives path "${primPath}" for space "${qtKey}"`);
      process.exit(1);
    }
    space[qtKey] = v;
  }
  const motion = {};
  for (const [qtKey, primPath] of Object.entries(mapping.motion ?? {})) {
    const v = getByPath(merged, primPath);
    if (v === undefined) {
      console.error(`[load-tokens] qt derive: missing primitives path "${primPath}" for motion "${qtKey}"`);
      process.exit(1);
    }
    motion[qtKey] = v;
  }
  const size = {};
  for (const [qtKey, primPath] of Object.entries(mapping.size ?? {})) {
    const v = getByPath(merged, primPath);
    if (v === undefined) {
      console.error(`[load-tokens] qt derive: missing primitives path "${primPath}" for size "${qtKey}"`);
      process.exit(1);
    }
    size[qtKey] = v;
  }
  const note = merged.qt?.note ?? 'dunting preset flattened for generate-qt.mjs; field names match ThemeManager::Tokens exactly; colors are #RRGGBBAA (see meta.conventions.colors.dunting); accentHover/accentPressed intentionally absent (runtime-derived)';
  // Preserve byte-identical snapshot: if snapshot exists, copy its rgbf for float-origin fields where hex-derived differs >1e-9
  let rgbf = rgbfDerived;
  try {
    if (existsSync(snapshotPath)) {
      const snap = JSON.parse(readFileSync(snapshotPath, 'utf8'));
      if (snap.qt && snap.qt.rgbf) {
        const snapRgbf = snap.qt.rgbf;
        let useSnap = false;
        for (const f of Object.keys(rgbfDerived)) {
          const dr = rgbfDerived[f];
          const sr = snapRgbf[f];
          if (!sr) continue;
          for (const mode of ['light', 'dark']) {
            const a = dr[mode];
            const b = sr[mode];
            if (!a || !b) continue;
            for (let i = 0; i < 4; i++) if (Math.abs(a[i] - b[i]) > 1e-9) useSnap = true;
          }
        }
        if (useSnap) rgbf = JSON.parse(JSON.stringify(snapRgbf));
      }
    }
  } catch {}
  merged.qt = { note, colors, space, motion, size, rgbf };
  return merged;
}

function deriveThemes(merged) {
  if (!merged.themes) return merged;
  // If deltas present but overrides missing, derive overrides.
  if (Array.isArray(merged.themes.deltas) && !Array.isArray(merged.themes.overrides)) {
    const overrides = merged.themes.deltas.map((d) => {
      const { preset, mode, accentTheme, windowTint, interfaceStyle, tokens } = d;
      const selector = selectorFor({ mode, accentTheme, windowTint, interfaceStyle });
      const entry = { selector, preset, mode, tokens };
      if (accentTheme !== undefined) entry.accentTheme = accentTheme;
      if (windowTint !== undefined) entry.windowTint = windowTint;
      if (interfaceStyle !== undefined) entry.interfaceStyle = interfaceStyle;
      return entry;
    });
    merged.themes.overrides = overrides;
    // Keep deltas for validation? For snapshot we want overrides only.
    // Delete deltas so snapshot matches original shape (overrides only).
    delete merged.themes.deltas;
  }
  // If both exist, prefer overrides (legacy) — remove deltas to avoid duplicate key in snapshot.
  if (Array.isArray(merged.themes.deltas) && Array.isArray(merged.themes.overrides)) {
    delete merged.themes.deltas;
  }
  return merged;
}

function finalizeMerged(merged) {
  let out = { ...merged };
  out = deriveThemes(out);
  out = deriveQt(out);
  return out;
}

export function loadTokensSync({ from = 'split' } = {}) {
  if (from === 'snapshot') {
    const tokens = readSnapshotSync();
    return { tokens, source: 'snapshot' };
  }
  if (hasShards()) {
    const { merged, found } = readShardsSync();
    if (found > 0 && Object.keys(merged).length > 0) {
      const tokens = finalizeMerged(merged);
      return { tokens, source: 'split' };
    }
  }
  const tokens = readSnapshotSync();
  return { tokens, source: 'snapshot' };
}

export async function loadTokens({ from = 'split' } = {}) {
  return loadTokensSync({ from });
}

// CLI entry: `node spec/load-tokens.mjs`
function main() {
  const { tokens, source } = loadTokensSync({ from: 'split' });
  const topKeys = Object.keys(tokens).length;
  const semanticCount = tokens.semantic ? Object.keys(tokens.semantic).length : 0;
  const primitivesCount = tokens.primitives ? Object.keys(tokens.primitives).length : 0;
  const compositeCount = tokens.composite?.launcher ? Object.keys(tokens.composite.launcher).length : 0;
  const overridesCount = tokens.themes?.overrides?.length ?? tokens.themes?.deltas?.length ?? 0;
  const qtColors = tokens.qt?.colors ? Object.keys(tokens.qt.colors).length : 0;

  console.log(`[load-tokens] source: ${source} (${source === 'split' ? 'spec/tokens/**' : 'spec/tokens.json'})`);
  console.log(`[load-tokens] top-level keys: ${topKeys} (${Object.keys(tokens).join(', ')})`);
  console.log(`[load-tokens] primitives: ${primitivesCount} groups, semantic: ${semanticCount} tokens, composite.launcher: ${compositeCount}, themes: ${overridesCount} overrides, qt.colors: ${qtColors}`);
  if (source === 'snapshot') {
    console.log(`[load-tokens] fallback to snapshot — spec/tokens/** not present (monolith mode)`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
