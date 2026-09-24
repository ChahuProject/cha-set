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
//
// `scanIconUsages` answers a third question the ledgers cannot: what does each reference site
// actually ask for? A name that resolves is only half the story — the size it renders at says
// which grid it should have been drawn on, and that is where a 24 unit glyph rendered at 10px
// quietly ships a sub-pixel stroke.

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

/** Tailwind's `size-N` utility paints N * 0.25rem, which is N * 4px. */
function utilityToPx(token) {
  const value = Number(token);
  return Number.isFinite(value) ? value * 4 : null;
}

function pascalCase(name) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * End of a JSX opening tag, skipping quoted strings and brace expressions so a `>` inside an
 * attribute value does not close the tag early.
 */
function jsxTagEnd(content, start) {
  let depth = 0;
  let quote = null;
  for (let i = start; i < content.length; i += 1) {
    const ch = content[i];
    if (quote) {
      if (ch === quote && content[i - 1] !== '\\') quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    else if (ch === '}') depth -= 1;
    else if (ch === '>' && depth === 0) return i + 1;
  }
  return -1;
}

/** End of the `{...}` block that opens at `openIndex`, honouring nested braces and strings. */
function braceBlockEnd(content, openIndex) {
  let depth = 0;
  let quote = null;
  for (let i = openIndex; i < content.length; i += 1) {
    const ch = content[i];
    if (quote) {
      if (ch === quote && content[i - 1] !== '\\') quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

/**
 * Render sizes a JSX icon element can paint at, read from its own opening tag. A size prop
 * wins over a utility class because it is what the consumer typed at the call site, and an
 * element with neither renders at the primitive's default.
 *
 * A conditional size yields every branch, not just the first: `size={isSm ? 10 : 12}` renders
 * at 10 on small viewports, and that is the branch that has to satisfy the grid.
 */
function sizesFromJsxTag(tag, fallback) {
  const attr = tag.match(/\bsize=\{([^}]*)\}/);
  if (attr) {
    const numbers = [...attr[1].matchAll(/(?<![\w.])(\d+(?:\.\d+)?)\b/g)].map((m) => Number(m[1]));
    if (numbers.length > 0) return { sizes: numbers, source: `size={${attr[1].trim()}}` };
    return { sizes: [], source: `size={${attr[1].trim()}}` };
  }
  const util = tag.match(/(?<![\w-])size-(\d+(?:\.\d+)?)\b/);
  if (util) return { sizes: [utilityToPx(util[1])], source: `className size-${util[1]}` };
  return { sizes: fallback === null ? [] : [fallback], source: 'primitive default' };
}

function sizesFromQmlBlock(block, fallback) {
  const line = block.match(/^\s*size\s*:\s*(.+)$/m);
  if (!line) return { sizes: fallback === null ? [] : [fallback], source: 'primitive default' };
  const value = line[1].trim().replace(/;$/, '');
  const numbers = [];
  for (const m of value.matchAll(/\bdp\(\s*(\d+(?:\.\d+)?)\s*\)/g)) numbers.push(Number(m[1]));
  const bare = value.replace(/\bdp\(\s*[\d.]+\s*\)/g, '');
  for (const m of bare.matchAll(/(?<![\w.])(\d+(?:\.\d+)?)\b/g)) numbers.push(Number(m[1]));
  return { sizes: numbers, source: `size: ${value}` };
}

/**
 * Icon references through the icon primitives, with the render size each one asks for.
 *
 * Three reference shapes exist and all three have to be seen, because each one has hidden the
 * others at some point:
 *
 *   1. `<Icon name="x" />` — a dynamic name, resolvable only at run time, so the registry has
 *      to prove it owns the name.
 *   2. `<SearchIcon />` — a named export. It is compile-checked, but it still renders at a
 *      size, and a size is a claim about which grid is appropriate. Missing these hid 116 of
 *      the 139 reference sites in the repository.
 *   3. `ChaSetIcon { name: ... }` — QML, where the name is often a ternary over two literals
 *      (`root.maximized ? "restore" : "maximize"`), so a scan that only reads a quoted name
 *      misses the state it flips to.
 *
 * `size` is null when the value is computed at run time. Those cannot be checked, and the
 * caller reports them as unverifiable rather than pretending they passed.
 */
export function scanIconUsages(rootDir, { iconNames = [], aliases = {}, defaultSize = null } = {}) {
  const usages = [];

  const byExport = new Map();
  const byKey = new Map();
  for (const name of iconNames) {
    byExport.set(`${pascalCase(name)}Icon`, name);
    byKey.set(name, name);
  }
  for (const [alias, target] of Object.entries(aliases)) byKey.set(alias, target);

  const record = (entry, raw, resolver) => {
    const resolved = resolver(raw);
    usages.push({
      ...entry,
      written: raw,
      name: resolved ?? null,
      known: Boolean(resolved),
    });
  };

  for (const file of walk(join(rootDir, 'qt/src'), ['.qml'])) {
    const rel = relative(rootDir, file).replace(/\\/g, '/');
    if (isGeneratedArtifact(rel)) continue;
    const content = readFileSync(file, 'utf8');
    const starts = lineIndex(content);

    for (const match of content.matchAll(/\bChaSetIcon\s*\{/g)) {
      const open = content.indexOf('{', match.index + match[0].length - 1);
      const end = braceBlockEnd(content, open);
      if (end === -1) continue;
      const block = content.slice(open, end);
      const here = locate(starts, match.index);
      const nameLine = block.match(/^\s*name\s*:\s*(.+)$/m);
      if (!nameLine) continue;
      const literals = [...nameLine[1].matchAll(/"([a-zA-Z0-9_-]+)"/g)].map((m) => m[1]);
      if (literals.length === 0) continue;
      const { sizes, source } = sizesFromQmlBlock(block, defaultSize);
      for (const literal of literals) {
        record(
          { stack: 'qt', file: rel, line: here.line + 1, sizes, sizeSource: source, reference: 'name' },
          literal,
          (raw) => byKey.get(raw.toLowerCase()),
        );
      }
    }
  }

  const reactFiles = walk(join(rootDir, 'packages/react/src'), ['.tsx']).concat(
    walk(join(rootDir, 'packages/react/examples'), ['.tsx']),
  );
  for (const file of reactFiles) {
    const rel = relative(rootDir, file).replace(/\\/g, '/');
    if (isGeneratedArtifact(rel)) continue;
    const content = readFileSync(file, 'utf8');
    const starts = lineIndex(content);
    const pattern = /<([A-Z][A-Za-z0-9]*)\b/g;

    for (const match of content.matchAll(pattern)) {
      const identifier = match[1];
      const isDynamic = identifier === 'Icon';
      if (!isDynamic && !identifier.endsWith('Icon')) continue;
      const end = jsxTagEnd(content, match.index);
      if (end === -1) continue;
      const tag = content.slice(match.index, end);
      if (isDynamic && !/\bname=["']/.test(tag)) continue;
      const here = locate(starts, match.index);
      const { sizes, source } = sizesFromJsxTag(tag, defaultSize);

      if (isDynamic) {
        const dynamicName = tag.match(/\bname=["']([a-zA-Z0-9_-]+)["']/);
        if (!dynamicName) continue;
        record(
          { stack: 'react', file: rel, line: here.line + 1, sizes, sizeSource: source, reference: 'name' },
          dynamicName[1],
          (raw) => byKey.get(raw.toLowerCase()),
        );
      } else {
        record(
          { stack: 'react', file: rel, line: here.line + 1, sizes, sizeSource: source, reference: 'export' },
          identifier,
          (raw) => byExport.get(raw),
        );
      }
    }
  }

  return usages.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
}

export function relativeTo(rootDir, file) {
  return isAbsolute(file) ? relative(rootDir, file).replace(/\\/g, '/') : file;
}
