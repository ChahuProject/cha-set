// spec/icons/adoption.mjs
//
// Icon-system adoption scanner. Two ledgers are produced:
//
//  1. `inlineSvgSites` — components that still hand-author their own `<svg>` artwork
//     instead of rendering a registry icon. Frozen as a ratchet: the gate fails when the
//     number of sites grows, so new drift is impossible while the backlog shrinks at will.
//  2. `textGlyphSites` — glyphs such as `+`, U+2212 MINUS SIGN or U+27F3 used as iconography.
//     Those inherit font metrics, weight and baseline from the surrounding text, which is
//     exactly how the two stacks end up with "bold plus, thin reset" and "icon sits low in
//     the pill" defects. This ledger must stay empty.
//
// Both ledgers are also embedded into the generated artifacts so the showcase page can
// display live, cross-stack identical numbers.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, isAbsolute } from 'node:path';

/** Glyphs that must never stand in for an icon. */
export const BANNED_ICON_GLYPHS = [
  '\u2212', // MINUS SIGN  (- as drawn by a font)
  '+', //            PLUS SIGN
  '\u27F3', // CLOCKWISE GAPPED CIRCLE ARROW (reset)
  '\u27F2', // ANTICLOCKWISE GAPPED CIRCLE ARROW (undo)
  '\u00D7', // MULTIPLICATION SIGN (close)
  '\u2715', // MULTIPLICATION X
  '\u2717', // BALLOT X
  '\u2713', // CHECK MARK
  '\u2190', // LEFTWARDS ARROW
  '\u2192', // RIGHTWARDS ARROW
  '\u2191', // UPWARDS ARROW
  '\u2193', // DOWNWARDS ARROW
];

/**
 * Typographic marks that are legitimately part of copy rather than iconography:
 * breadcrumb chevrons, list bullets and word separators. Documented here so the ban
 * stays sharp instead of growing a per-file allowlist.
 */
export const TYPOGRAPHIC_MARKS = ['\u2022', '\u00B7', '\u203A', '\u2039', '\u2013', '\u2014', '\u2026'];

const SCAN_TARGETS = [
  { dir: 'qt/src', ext: ['.qml'] },
  { dir: 'packages/react/src', ext: ['.tsx'] },
  { dir: 'packages/react/examples', ext: ['.tsx'] },
];

const IGNORED_PATH_SEGMENTS = ['node_modules', 'dist', 'build', '.git'];

/**
 * Generated artifacts are excluded from every ledger. They legitimately embed the ledger
 * itself (so the showcase page can display live numbers), and scanning them would create a
 * feedback loop where the embedded snippet keeps re-triggering its own violation.
 */
const GENERATED_ARTIFACTS = new Set([
  'packages/react/src/lib/icons.tsx',
  'packages/react/src/lib/icons.generated.tsx',
  'qt/src/ChaSetIcons.generated.qml',
]);

function isGeneratedArtifact(relPath) {
  return GENERATED_ARTIFACTS.has(relPath);
}


function walk(dir, exts, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (IGNORED_PATH_SEGMENTS.some((seg) => full.includes(seg))) continue;
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, exts, out);
    } else if (exts.some((e) => entry.endsWith(e)) && !/\.test\.[jt]sx?$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

/** Hand-authored `<svg>` artwork in component/showcase source (icons.tsx is excluded: it *is* the primitive). */
export function scanInlineSvgSites(rootDir) {
  const sites = [];
  for (const target of SCAN_TARGETS) {
    for (const file of walk(join(rootDir, target.dir), target.ext)) {
      const rel = relative(rootDir, file).replace(/\\/g, '/');
      if (isGeneratedArtifact(rel)) continue;
      const content = readFileSync(file, 'utf8');
      const count = (content.match(/<svg[\s>]/g) || []).length;
      if (count > 0) sites.push({ file: rel, count });
    }
  }
  return sites.sort((a, b) => a.file.localeCompare(b.file));
}

/** Text glyphs masquerading as icons. */
export function scanTextGlyphSites(rootDir) {
  const ban = BANNED_ICON_GLYPHS.join('');
  const qmlPattern = new RegExp(String.raw`text\s*:\s*"([${ban}])"`, 'g');
  const jsxPattern = new RegExp(String.raw`>\s*([${ban}])\s*<`, 'g');
  const hits = [];

  for (const target of SCAN_TARGETS) {
    for (const file of walk(join(rootDir, target.dir), target.ext)) {
      const rel = relative(rootDir, file).replace(/\\/g, '/');
      if (isGeneratedArtifact(rel)) continue;
      const content = readFileSync(file, 'utf8');
      const lines = content.split(/\r?\n/);
      const pattern = target.ext[0] === '.qml' ? qmlPattern : jsxPattern;
      lines.forEach((line, idx) => {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(line)) !== null) {
          hits.push({
            file: rel,
            line: idx + 1,
            glyph: match[1],
            codePoint: `U+${match[1].codePointAt(0).toString(16).toUpperCase()}`,
            snippet: line.trim().slice(0, 120),
          });
        }
      });
    }
  }
  return hits.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
}

/** Names referenced through the icon primitives, so the registry can prove it owns them. */
export function scanIconUsages(rootDir) {
  const usages = [];

  const qmlFiles = walk(join(rootDir, 'qt/src'), ['.qml']);
  for (const file of qmlFiles) {
    const rel = relative(rootDir, file).replace(/\\/g, '/');
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, idx) => {
      if (!/\bChaSetIcon\s*\{/.test(line)) return;
      for (let look = idx + 1; look < Math.min(idx + 9, lines.length); look += 1) {
        const m = lines[look].match(/^\s*name\s*:\s*"([a-zA-Z0-9_-]+)"/);
        if (m) {
          usages.push({ stack: 'qt', file: rel, line: look + 1, name: m[1] });
          break;
        }
      }
    });
  }

  const reactFiles = walk(join(rootDir, 'packages/react/src'), ['.tsx']).concat(
    walk(join(rootDir, 'packages/react/examples'), ['.tsx']),
  );
  for (const file of reactFiles) {
    const rel = relative(rootDir, file).replace(/\\/g, '/');
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, idx) => {
      const m = line.match(/<Icon\s+name=["']([a-zA-Z0-9_-]+)["']/);
      if (m) usages.push({ stack: 'react', file: rel, line: idx + 1, name: m[1] });
    });
  }

  return usages.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
}

export function relativeTo(rootDir, file) {
  return isAbsolute(file) ? relative(rootDir, file).replace(/\\/g, '/') : file;
}
