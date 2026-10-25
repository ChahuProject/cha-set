#!/usr/bin/env node
// migrate-doc-text.mjs — one-shot, re-runnable codemod: raw <h1…h4> / <p> in the
// React showcase → <DocText role="…">.
//
// Why a codemod and not 264 hand edits: the point of the role table is that NO
// call site spells out typography any more. Anything hand-edited would drift
// again on the next pass. This script is idempotent (it skips <DocText>) and
// reports every deviation it had to make, so the convergence is auditable.
//
// What it does NOT do, on purpose:
//   · <p> whose size class is not the role's size (text-xs / text-base …) —
//     changing those would silently resize prose all over the docs, so they are
//     reported and left alone.
//   · multi-line opening tags, dynamic className expressions — reported.
//   · anything inside a template literal (code samples shown to the user).
//
// Usage:
//   node scripts/migrate-doc-text.mjs            # write
//   node scripts/migrate-doc-text.mjs --dry-run  # report only
//   node scripts/migrate-doc-text.mjs --check    # exit 1 when work remains
import { readFileSync, writeFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const srcRoot = resolve(repoRoot, 'packages', 'react', 'examples', 'basic', 'src');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const checkOnly = args.includes('--check');

/** Tokens the role owns. Anything here is dropped from the className. */
const TYPOGRAPHY_TOKEN = /^(text-(?!\[?inherit)|font-|tracking-|leading-|uppercase$|lowercase$|capitalize$|tabular-nums$|antialiased$|text-(left|center|right|justify)$)/;
const COLOR_TOKEN = /^text-(foreground|muted-foreground|destructive|primary|secondary|accent)(\/|$)/;

/** tag → canonical role, plus the size tokens that mean "already canonical". */
const TAG_ROLE = {
  h1: { role: 'display', sizes: [], sizeRole: { 'text-3xl': 'h1', 'text-title': 'h1' } },
  h2: { role: 'h2', sizes: ['text-xl', 'text-2xl', 'text-title-sm'] },
  h3: { role: 'h3', sizes: ['text-base', 'text-lg'] },
  h4: { role: 'h4', sizes: ['text-sm', 'text-body'] },
  p: { role: 'p', sizes: ['text-sm', 'text-body'] },
};

/** Role weights, mirrored from spec/doc-roles.json (audited by --check). */
const ROLE_WEIGHT = { display: 700, h1: 700, h2: 600, h3: 600, h4: 600, p: 400, overline: 600 };

const SIZE_PX = {
  'text-4xl': 36,
  'text-3xl': 28,
  'text-2xl': 24,
  'text-xl': 20,
  'text-lg': 18,
  'text-base': 16,
  'text-sm': 14,
  'text-xs': 12,
  'text-caption': 11,
  'text-micro': 10,
};
const ROLE_PX = { display: 36, h1: 28, h2: 20, h3: 16, h4: 14, p: 14, overline: 12 };

/** Split a JSX opening tag's attribute string into [name, rawValue] pairs. */
function parseAttrs(raw) {
  const attrs = [];
  let i = 0;
  while (i < raw.length) {
    while (i < raw.length && /\s/.test(raw[i])) i += 1;
    if (i >= raw.length) break;
    if (raw[i] === '/' || raw[i] === '>') break;

    let name = '';
    while (i < raw.length && !/[\s=]/.test(raw[i])) name += raw[i++];
    while (i < raw.length && /\s/.test(raw[i])) i += 1;

    let value = null;
    if (raw[i] === '=') {
      i += 1;
      while (i < raw.length && /\s/.test(raw[i])) i += 1;
      const quote = raw[i];
      if (quote === '"' || quote === "'") {
        i += 1;
        let v = '';
        while (i < raw.length && raw[i] !== quote) v += raw[i++];
        i += 1;
        value = { kind: 'string', text: v, quote };
      } else if (quote === '{') {
        let depth = 0;
        let v = '';
        while (i < raw.length) {
          const c = raw[i];
          if (c === '{') depth += 1;
          if (c === '}') {
            depth -= 1;
            if (depth === 0) {
              v += c;
              i += 1;
              break;
            }
          }
          v += c;
          i += 1;
        }
        value = { kind: 'expr', text: v };
      }
    }
    if (name) attrs.push([name, value]);
  }
  return attrs;
}

function countUnescapedTicks(line, carry) {
  let ticks = carry;
  for (let i = 0; i < line.length; i += 1) {
    if (line[i] === '`' && line[i - 1] !== '\\') ticks += 1;
  }
  return ticks;
}

/** Classify one call site. Returns { role, keep, tone, dropReason }. */
function classify(tag, classText) {
  const tokens = classText ? classText.split(/\s+/).filter(Boolean) : [];
  const spec = TAG_ROLE[tag];
  if (!spec) return { dropReason: 'unsupported tag' };

  const size = tokens.find((t) => t in SIZE_PX);
  const sizeExpr = tokens.find((t) => /^(text-\[|text-(title|heading|body|small|nano|display)$)/.test(t));

  // ALL-CAPS small text is an overline, not a heading — mapping it to h4 would
  // drop both the capitalization and 3px of size.
  if (tokens.includes('uppercase') && tag !== 'p') {
    return { role: 'overline', keep: tokens.filter((t) => !TYPOGRAPHY_TOKEN.test(t) && !COLOR_TOKEN.test(t)), tone: tokens.some((t) => COLOR_TOKEN.test(t) && t.includes('muted')) ? 'muted' : 'default' };
  }

  // `p` must keep its size and weight: resizing/re-weighting prose across 40
  // pages is not a mechanical change (and weight specimens would lose their
  // point). Headings are semantic, so they converge onto the scale instead.
  if (tag === 'p' && !spec.sizes.includes(size ?? '')) {
    return { dropReason: size ? `body copy at ${size}` : 'body copy with no explicit size' };
  }
  if (tag === 'p' && (tokens.includes('font-bold') || tokens.includes('font-semibold') || tokens.includes('font-medium'))) {
    return { dropReason: 'body copy carrying an explicit weight' };
  }
  if (sizeExpr) return { dropReason: `non-scale size ${sizeExpr}` };

  // A caption-sized <h4> is a specimen label, not a heading: leave it alone
  // rather than doubling its size and calling it convergence.
  if (tag === 'h4' && size && ['text-caption', 'text-micro', 'text-xs'].includes(size)) {
    return { dropReason: `h4 used as ${size} label` };
  }

  const role = (size && spec.sizeRole?.[size]) || spec.role;

  const tone = tokens.some((t) => t.startsWith('text-destructive'))
    ? 'danger'
    : tokens.some((t) => t.startsWith('text-muted-foreground'))
      ? 'muted'
      : 'default';

  const keep = tokens.filter((t) => !TYPOGRAPHY_TOKEN.test(t) && !COLOR_TOKEN.test(t));

  const fromPx = size ? SIZE_PX[size] : undefined;
  const toPx = ROLE_PX[role];
  const fromWeight = tokens.includes('font-bold')
    ? 700
    : tokens.includes('font-semibold')
      ? 600
      : tokens.includes('font-medium')
        ? 500
        : tokens.includes('font-normal')
          ? 400
          : undefined;
  const toWeight = ROLE_WEIGHT[role] ?? 400;

  return {
    role,
    keep,
    tone,
    sizeDelta: fromPx !== undefined && toPx !== undefined && fromPx !== toPx ? `${fromPx}px → ${toPx}px` : null,
    weightDelta: fromWeight !== undefined && fromWeight !== toWeight ? `${fromWeight} → ${toWeight}` : null,
  };
}

const stats = {
  migrated: {},
  sizeDelta: [],
  weightDelta: [],
  skipped: [],
  files: 0,
};
const pending = new Map();

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.tsx') && !entry.endsWith('.generated.tsx')) out.push(full);
  }
  return out;
}

const OPEN_TAG = /^(\s*)<(h1|h2|h3|h4|p)(\s[^>]*)?>/;

for (const file of walk(srcRoot)) {
  const rel = relative(repoRoot, file).replace(/\\/g, '/');
  let source = readFileSync(file, 'utf8');
  if (source.includes('<DocText') && !/<h[1-4][\s>]|<p[\s>]/.test(source)) {
    stats.files += 1;
    continue;
  }

  const lines = source.split('\n');
  let ticks = 0;
  let changed = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trimStart();

    ticks = countUnescapedTicks(line, ticks);
    const inTemplate = ticks % 2 === 1;
    if (inTemplate) continue;
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('{/*')) continue;

    const match = OPEN_TAG.exec(line);
    if (!match) continue;

    const [full, indent, tag, rawAttrs = ''] = match;
    if (rawAttrs.includes('{...')) {
      stats.skipped.push(`${rel}:${index + 1} spread props`);
      continue;
    }

    // Locate the matching close tag on the same or a later line.
    const afterOpen = line.slice(match.index + full.length);
    let closeIndex = afterOpen.indexOf(`</${tag}>`);
    let closeLine = index;
    let contentEnd = closeIndex >= 0 ? match.index + full.length + closeIndex : -1;
    if (closeIndex < 0) {
      for (let scan = index + 1; scan < lines.length; scan += 1) {
        const hit = lines[scan].indexOf(`</${tag}>`);
        if (hit >= 0) {
          closeLine = scan;
          contentEnd = hit;
          break;
        }
        if (new RegExp(`<${tag}[\\s>]`).test(lines[scan])) break;
      }
    }
    if (contentEnd < 0) {
      stats.skipped.push(`${rel}:${index + 1} <${tag}> without a findable close tag`);
      continue;
    }

    const attrs = parseAttrs(rawAttrs);
    const classAttr = attrs.find(([name]) => name === 'className');
    let classText = '';
    if (classAttr) {
      if (!classAttr[1] || classAttr[1].kind !== 'string') {
        stats.skipped.push(`${rel}:${index + 1} <${tag}> with dynamic className`);
        continue;
      }
      classText = classAttr[1].text;
    }

    const verdict = classify(tag, classText);
    if (verdict.dropReason) {
      stats.skipped.push(`${rel}:${index + 1} <${tag}> ${verdict.dropReason}`);
      continue;
    }

    // Rebuild the opening tag.
    const otherAttrs = attrs
      .filter(([name]) => name !== 'className')
      .map(([name, value]) => {
        if (!value) return name;
        if (value.kind === 'string') return `${name}=${value.quote}${value.text}${value.quote}`;
        return `${name}=${value.text}`;
      });

    const parts = [`role="${verdict.role}"`];
    if (verdict.tone === 'danger') parts.push('tone="danger"');
    else if (verdict.tone === 'muted' && verdict.role !== 'p') parts.push('tone="muted"');
    parts.push(...otherAttrs);
    if (verdict.keep.length) parts.push(`className="${verdict.keep.join(' ')}"`);

    const newOpen = `${indent}<DocText ${parts.join(' ')}>`;
    const newClose = '</DocText>';

    if (closeLine === index) {
      lines[index] = newOpen + afterOpen.slice(0, closeIndex) + newClose + afterOpen.slice(closeIndex + tag.length + 3);
    } else {
      // Keep everything before the opening tag, swap the tag, then patch the close line.
      const before = lines[index].slice(0, match.index);
      const tail = afterOpen;
      lines[index] = before + newOpen + tail;
      const closeLineText = lines[closeLine];
      const hit = closeLineText.indexOf(`</${tag}>`);
      lines[closeLine] = closeLineText.slice(0, hit) + newClose + closeLineText.slice(hit + tag.length + 3);
    }

    changed = true;
    stats.migrated[verdict.role] = (stats.migrated[verdict.role] ?? 0) + 1;
    if (verdict.sizeDelta) stats.sizeDelta.push(`${rel}:${index + 1} <${tag}> ${verdict.role} ${verdict.sizeDelta}`);
    if (verdict.weightDelta) stats.weightDelta.push(`${rel}:${index + 1} <${tag}> → ${verdict.role} ${verdict.weightDelta}`);
  }

  if (changed) {
    let next = lines.join('\n');
    pending.set(file, next);
    stats.files += 1;
  }
}

/**
 * Insert (or move) the DocText import after the import block.
 *
 * Runs for every file that renders <DocText>, including files a previous run
 * already migrated, so a mis-placed import (e.g. inside a multi-line
 * `import {` ... `} from`) repairs itself on the next run.
 */
function normalizeDocTextImport(file, source) {
  if (!source.includes('<DocText')) return source;
  const relPath = relative(dirname(file), join(srcRoot, 'components', 'DocText')).replace(/\\/g, '/');
  const importPath = relPath.startsWith('.') ? relPath : `./${relPath}`;
  const line = `import { DocText } from '${importPath}';`;

  const lines = source.split('\n').filter((l) => !/^import \{ DocText \} from '.*';$/.test(l));
  // Walk the import HEADER only (top of file), stopping at the first real
  // statement. Scanning the whole file would latch onto `import … from …`
  // lines that live inside code-sample template literals and bury the import
  // hundreds of lines down.
  let lastImport = -1;
  let inMultiLineImport = false;
  for (let i = 0; i < lines.length; i += 1) {
    const text = lines[i];
    if (/^\s*(\/\/|\/\*|\*)/.test(text) || /^\s*$/.test(text)) continue;
    if (!inMultiLineImport && /^import\s+\{/.test(text) && !/\}\s*from\s+['"]/.test(text)) {
      inMultiLineImport = true;
      continue;
    }
    if (inMultiLineImport) {
      if (/^\}\s*from\s+['"][^'"]+['"];?\s*$/.test(text)) {
        inMultiLineImport = false;
        lastImport = i;
      }
      continue;
    }
    if (/^import\b.*\bfrom\s+['"][^'"]+['"];?\s*$/.test(text) || /^import\s+['"][^'"]+['"];?\s*$/.test(text)) {
      lastImport = i;
      continue;
    }
    break;
  }
  if (lines.includes(line)) return lines.join('\n');
  if (lastImport < 0) return `${line}\n${lines.join('\n')}`;
  lines.splice(lastImport + 1, 0, line);
  return lines.join('\n');
}

for (const [file, content] of pending) {
  pending.set(file, normalizeDocTextImport(file, content));
}

// Files that already had <DocText> before this run still need the import fixed.
for (const file of walk(srcRoot)) {
  if (pending.has(file)) continue;
  const content = readFileSync(file, 'utf8');
  const fixed = normalizeDocTextImport(file, content);
  if (fixed !== content) pending.set(file, fixed);
}

const totalMigrated = Object.values(stats.migrated).reduce((a, b) => a + b, 0);

console.log(`[migrate:doctext] ${totalMigrated} call sites in ${pending.size} files`);
for (const [role, count] of Object.entries(stats.migrated).sort((a, b) => b[1] - a[1])) {
  console.log(`  role ${role.padEnd(8)} ${count}`);
}
if (stats.sizeDelta.length) {
  console.log(`\n[migrate:doctext] size converged on the scale (${stats.sizeDelta.length}):`);
  for (const line of stats.sizeDelta) console.log(`  · ${line}`);
}
if (stats.weightDelta.length) {
  console.log(`\n[migrate:doctext] weight converged on the role (${stats.weightDelta.length}):`);
  for (const line of stats.weightDelta) console.log(`  · ${line}`);
}
if (stats.skipped.length) {
  const byReason = new Map();
  for (const line of stats.skipped) {
    const reason = line.replace(/^\S+?:\d+\s/, '');
    byReason.set(reason, (byReason.get(reason) ?? 0) + 1);
  }
  console.log(`[migrate:doctext] left alone (${stats.skipped.length}) — needs a human decision, not a codemod:`);
  for (const [reason, count] of [...byReason.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(4)}  ${reason}`);
  }
}

if (checkOnly) {
  if (pending.size > 0) {
    console.error(`\n[migrate:doctext] --check: ${pending.size} files still carry raw headings`);
    process.exit(1);
  }
  process.exit(0);
}

if (dryRun) {
  console.log('\n[migrate:doctext] --dry-run: nothing written');
  process.exit(0);
}

for (const [file, content] of pending) writeFileSync(file, content, 'utf8');
console.log(`\n[migrate:doctext] wrote ${pending.size} files`);
