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

/**
 * Explicit escape hatch for `<svg>` that is genuinely not iconography.
 *
 * The ratchet is only meaningful if every site inside it is a site someone could actually
 * migrate. That is not true of parametric vector art: a triangle whose vertices come from
 * computed `DEFAULT_TRIANGLE_WIDTH/HEIGHT`, or a mark built from `<defs>`, gradients and
 * `<clipPath>`, has no 24-grid stroke representation and never will. Leaving such a site in
 * the budget makes the budget permanently unreachable, and an unreachable budget stops being
 * read as a signal.
 *
 * So it is excluded — but explicitly and visibly, never silently:
 *
 *   1. the marker carries a mandatory reason; an empty reason is a gate failure, not a pass;
 *   2. the marker only covers an `<svg>` that follows it within `EXEMPTION_LOOKBACK` lines,
 *      so it cannot be sprinkled at the top of a file to bless everything below;
 *   3. the marker must be *used*; a dangling one is a gate failure, so exemptions cannot be
 *      stockpiled in advance of writing the art they excuse;
 *   4. exempt sites are reported in the ledger and shown in the showcase, so the escape hatch
 *      is auditable rather than invisible.
 */
export const EXEMPTION_MARKER = 'chaset-icon-exempt:';

/**
 * How far above an `<svg>` its marker may sit. Three lines covers a JSX comment plus the
 * opening tag and one attribute. A wider window would let one marker cover an unrelated
 * glyph further down the file.
 */
const EXEMPTION_LOOKBACK = 3;

function extractReason(line, markerAt) {
  return line
    .slice(markerAt + EXEMPTION_MARKER.length)
    .replace(/\s*(?:\*\/\}?|-->|\/\/)\s*$/, '')
    .trim();
}

function collectMarkers(lines) {
  const markers = [];
  lines.forEach((line, idx) => {
    const at = line.indexOf(EXEMPTION_MARKER);
    if (at === -1) return;
    markers.push({ line: idx, col: at, reason: extractReason(line, at) });
  });
  return markers;
}

/**
 * Offsets of every line start, so a match found in the raw content can be mapped back to a
 * line and column without re-splitting.
 */
function lineIndex(content) {
  const starts = [0];
  for (let i = 0; i < content.length; i += 1) {
    if (content[i] === '\n') starts.push(i + 1);
  }
  return starts;
}

function locate(starts, offset) {
  let lo = 0;
  let hi = starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (starts[mid] <= offset) lo = mid;
    else hi = mid - 1;
  }
  return { line: lo, col: offset - starts[lo] };
}

/**
 * Hand-authored `<svg>` artwork in component/showcase source, split into sites that still owe
 * a migration (`count`) and sites explicitly excused as non-iconography (`exempted`).
 *
 * Matching happens against the whole file rather than line by line: `<svg` is very often
 * written as a bare tag with its attributes on the following lines, and `[\s>]` only reaches
 * that newline when the newline is part of the searched string. A line-based scan silently
 * under-counts exactly those sites — the ones most worth catching.
 *
 * `icons.tsx` is excluded: it *is* the primitive.
 * `exemptionProblems` carries marker misuse for the gate to fail on.
 */
export function scanInlineSvgSites(rootDir) {
  const sites = [];
  const exemptionProblems = [];

  for (const target of SCAN_TARGETS) {
    for (const file of walk(join(rootDir, target.dir), target.ext)) {
      const rel = relative(rootDir, file).replace(/\\/g, '/');
      if (isGeneratedArtifact(rel)) continue;

      const content = readFileSync(file, 'utf8');
      const starts = lineIndex(content);
      const markers = collectMarkers(content.split(/\r?\n/));
      const consumed = new Set();
      let count = 0;
      let exempted = 0;
      const reasons = [];

      for (const match of content.matchAll(/<svg[\s>]/g)) {
        const here = locate(starts, match.index);
        const owner = markers
          .map((marker, i) => ({ ...marker, i }))
          .filter(
            (marker) =>
              !consumed.has(marker.i) &&
              (marker.line < here.line || (marker.line === here.line && marker.col < here.col)),
          )
          .filter((marker) => here.line - marker.line <= EXEMPTION_LOOKBACK)
          .pop();

        if (!owner) {
          count += 1;
          continue;
        }

        consumed.add(owner.i);
        if (!owner.reason) {
          // An unreasoned marker buys nothing: the site stays in the budget and the misuse is
          // reported, so silence is never a way to dodge the ratchet.
          exemptionProblems.push({ file: rel, line: owner.line + 1, problem: 'marker has no reason' });
          count += 1;
          continue;
        }
        exempted += 1;
        reasons.push({ line: here.line + 1, reason: owner.reason });
      }

      markers.forEach((marker, i) => {
        if (consumed.has(i)) return;
        exemptionProblems.push({
          file: rel,
          line: marker.line + 1,
          problem: marker.reason
            ? `marker is not attached to a following <svg> within ${EXEMPTION_LOOKBACK} lines`
            : 'marker has no reason',
        });
      });

      if (count > 0 || exempted > 0) sites.push({ file: rel, count, exempted, reasons });
    }
  }

  return {
    sites: sites.sort((a, b) => a.file.localeCompare(b.file)),
    exemptionProblems,
  };
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
