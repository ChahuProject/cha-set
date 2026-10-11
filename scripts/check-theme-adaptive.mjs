// scripts/check-theme-adaptive.mjs
// High-performance dual-stack theme-adaptive gate (Red Line 18).
// Catches the Sidebar-white-border-in-dark class: bare `border` -> currentColor
// fallback, hardcoded white/black/zinc borders, and bg surfaces without text pairing.
// Sync fs only, zero deps, single pass per file, precompiled regex outside loops.
// Scope: `git ls-files` (fallback readdirSync) filtered to
// packages/react/src/**/*.{tsx,ts,css} + qt/src/*.qml.
//
// Precision contract (rules v2): every utility match is TOKEN-aware. The old
// `\bborder\b` / `\bbg-sidebar\b` forms misfired because `-` is a word
// boundary, so `bg-border`, `bg-sidebar-border`, `bg-sidebar-ring` and
// `var(--sidebar-border)` were read as bare borders / surfaces. A token is now
// delimited by whitespace, quotes, backticks or a variant separator (`:`), and
// the leading token name must not be followed by `-`/word char.
// Escape hatch: `theme-adaptive:allow <reason>` skips a finding when placed on
// the offending line OR on either of the two lines above it (comment above the
// JSX/`Rectangle` element), so legitimate functional-contrast cases stay explicit.
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RULES_VERSION = 2;

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const BINARY_EXTENSIONS = new Set([
  '.png', '.ico', '.jpg', '.jpeg', '.gif', '.svg',
  '.exe', '.dll', '.obj', '.o', '.a', '.lib',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.pdf', '.zip', '.tar', '.gz',
]);

const SKIP_FILE_SUBSTR = ['.generated.', 'ThemeTuner', 'ExportModal'];

// ---- token-aware regex helpers ---------------------------------------------
// A utility token starts at line start or after whitespace / a quote / a
// backtick / a variant separator `:`. It must NOT be preceded by `-` (so
// `bg-border` never yields a bare `border`) and must NOT be followed by a word
// char or `-` (so `border-white`, `border-2`, `bg-sidebar-border` are excluded).
const TOK = `(?:^|[\\s"'\`:.])`;
const tok = (body) => new RegExp(`${TOK}${body}(?![\\w-])`);

// Precompiled regex (outside loops)
const RE_ALLOW_ESCAPE = /theme-adaptive:allow/;
const RE_R1_BORDER_HARD = tok('border-(white|black|zinc-\\d+|slate-\\d+|gray-\\d+|neutral-\\d+)');
const RE_R1_BG_SURFACE = new RegExp(`${TOK}bg-(white|black)(?![\\w-])`, 'g');
const RE_R1_BG_OPACITY = tok('bg-(white|black)\\/\\d+');
const RE_R2_BG_BRACKET = /bg-\[#[0-9a-fA-F]{3,8}[^\]]*\]/;
const RE_R2_RGBA_WHITE = /rgba\(\s*255\s*,\s*255\s*,\s*255/;
const RE_R2_RGBA_GRAY = /rgba\(\s*203\s*,\s*213\s*,\s*225/;
const RE_BARE_BORDER = tok('border');
// Paired border colour = any border colour token (not a width/radius utility).
const RE_BORDER_PAIRED = /border-(border|transparent|current|input|ring|primary|secondary|accent|muted|destructive|sidebar|background|card|popover|foreground|warning|success|info|danger)/;
const RE_R4_BG = tok('bg-(background|card|popover|sidebar)');
const RE_TEXT_ANY = /text-/;
const RE_SCHEME_TEXT = /scheme\.text/;
const RE_R5_TEXT_HARD = tok('text-(white|black|zinc-\\d+)');
const RE_SVG_CURRENT = /(stroke|fill).*currentColor/;
const RE_R6_CLOSE_RED = /bg-\[#e81123\]/i;
const RE_CN_CALL = /\b(?:cn|cva|clsx)\s*\(/;
const RE_Q1_WIDTH = /border\.width\s*:\s*[1-9]/;
// Q1 = border.width must be *paired* with an explicit border.color (any
// expression: ThemeTokens.*, a theme-derived property, a conditional, ...).
// Hardcoded literals are caught separately by Q2/Q3.
const RE_Q1_COLOR_OK = /border\.color\s*:/;
const RE_Q2_HARD = /border\.color\s*:\s*["'](#fff\b|#ffffff\b|#000\b|#000000\b|white|black)["']/i;
const RE_Q3_COLOR = /^\s*color\s*:\s*["'](#[0-9a-fA-F]{3,8}|white|black)["']/i;
// Q4 = unbranched WHITE overlay (Qt.rgba(1,1,1,α) with α>0). Pure-black
// Qt.rgba(0,0,0,α) is a theme-safe scrim/darkener — allowed, mirroring the
// React `bg-black/60` scrim allowance; α=0 is a transparent no-op.
const RE_Q4_WHITE_RGBA = /Qt\.rgba\(\s*1\s*,\s*1\s*,\s*1\s*,\s*([^)]*?)\)/g;
const RE_Q4_BRANCH = /ThemeTokens\.dark|isDark/;
const RE_Q5_PANEL = /color\s*:\s*ThemeTokens\.(panel|panelRaised)\b/;
const RE_Q5_TEXT = /ThemeTokens\.(text|subduedText|onAccentColor|primaryForeground)\b/;
const RE_RECT_OPEN = /^\s*Rectangle\s*\{/;

function isCommentLine(trimmed) {
  return trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*');
}

// Escape hatch: the marker may sit on the offending line or on any of the
// three lines above it (so it can be written as a comment above the element, or
// as the first line inside a `cn(...)` / `Rectangle {` block).
function allowAt(lines, idx) {
  for (let k = 0; k < 4; k++) {
    const l = lines[idx - k];
    if (typeof l === 'string' && RE_ALLOW_ESCAPE.test(l)) return true;
  }
  return false;
}

// True for colocated *.test.* / *.spec.* files as well as __tests__ dirs.
function isTestFile(rel) {
  return rel.includes('__tests__') || /\.(test|spec)\.[cm]?[jt]sx?$/.test(rel);
}

function listFiles(root, componentFilter) {
  let files = [];
  try {
    const out = execSync('git ls-files', { cwd: root, encoding: 'utf-8' });
    files = out.split(/\r?\n/).map((f) => f.trim()).filter(Boolean);
  } catch {
    files = [];
  }
  if (files.length === 0) {
    // Fallback: scoped readdirSync only.
    const reactSrc = join(root, 'packages', 'react', 'src');
    const qtSrc = join(root, 'qt', 'src');
    const walk = (dir, acc) => {
      let entries = [];
      try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
      for (const e of entries) {
        const p = join(dir, e.name);
        if (e.isDirectory()) {
          if (['node_modules', 'dist', 'build', '.git'].includes(e.name)) continue;
          walk(p, acc);
        } else {
          acc.push(p.slice(root.length + 1).replace(/\\/g, '/'));
        }
      }
      return acc;
    };
    files = [...walk(reactSrc, []), ...walk(qtSrc, [])];
  }
  const out = [];
  for (const f of files) {
    const rel = f.replace(/\\/g, '/');
    if (rel.includes('node_modules/') || rel.includes('/dist/') || rel.includes('/build/') || rel.startsWith('.git/')) continue;
    const ext = extname(rel).toLowerCase();
    if (BINARY_EXTENSIONS.has(ext)) continue;
    if (SKIP_FILE_SUBSTR.some((s) => rel.includes(s))) continue;
    const isReact = rel.startsWith('packages/react/src/') && (rel.endsWith('.tsx') || rel.endsWith('.ts') || rel.endsWith('.css'));
    const isQml = rel.startsWith('qt/src/') && rel.endsWith('.qml');
    if (!isReact && !isQml) continue;
    if (componentFilter && !rel.toLowerCase().includes(componentFilter.toLowerCase())) continue;
    out.push(rel);
  }
  return out;
}

// Extract cn()/cva()/clsx() arg blocks with paren-depth scan (single pass).
function extractCnBlocks(content) {
  const blocks = [];
  let m;
  RE_CN_CALL.lastIndex = 0;
  // Manual scan to handle nesting: find each call start then depth-count parens.
  const re = /\b(?:cn|cva|clsx)\s*\(/g;
  while ((m = re.exec(content)) !== null) {
    const startIdx = m.index;
    let depth = 0;
    let i = m.index + m[0].length - 1; // at '('
    for (; i < content.length; i++) {
      const c = content[i];
      if (c === '(') depth++;
      else if (c === ')') { depth--; if (depth === 0) break; }
    }
    const endIdx = Math.min(i + 1, content.length);
    const startLine = content.slice(0, startIdx).split('\n').length;
    blocks.push({ text: content.slice(startIdx, endIdx), startLine });
    if (i >= content.length) break;
  }
  return blocks;
}

function checkReactFile(rel, lines, blocks, nextLinesAreText, errors, warnings) {
  const lower = rel.toLowerCase();
  // Tests are assertions, not shipped component/showcase code — Red Line 18
  // scopes to component & showcase sources only.
  if (isTestFile(rel)) return;
  const isColorPicker = lower.includes('color-picker') || lower.includes('colorpicker');
  const isSvgIconFile = lower.endsWith('icons.tsx') || lower.includes('/lib/icons');

  // R3: bare border only fails inside cn/cva blocks lacking paired border color.
  for (const b of blocks) {
    if (RE_ALLOW_ESCAPE.test(b.text) || allowAt(lines, b.startLine - 2)) continue;
    if (RE_BARE_BORDER.test(b.text) && !RE_BORDER_PAIRED.test(b.text)) {
      errors.push(`[R3 bare-border ${rel}:L${b.startLine}] bare "border" in cn()/cva() block without border-border/transparent/primary/current/input pairing (dark-mode currentColor fallback)`);
    }
  }

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    if (allowAt(lines, idx)) continue;
    // A marker placed anywhere inside the enclosing cn()/cva() block also
    // escapes every rule for that block's lines.
    const snip = line.trim().slice(0, 40);
    let enclosingAllow = false;
    if (snip) {
      for (const b of blocks) {
        if (b.text.includes(snip) && RE_ALLOW_ESCAPE.test(b.text)) { enclosingAllow = true; break; }
      }
    }
    if (enclosingAllow) continue;
    const trimmed = line.trim();
    if (!trimmed || isCommentLine(trimmed)) continue;
    // Windows title-bar close button: `hover:bg-[#e81123]` + white glyph is a
    // fixed OS-brand red pairing that is legible in BOTH themes (see R6 WARN).
    const isCloseRed = RE_R6_CLOSE_RED.test(line);

    // R1: hardcoded border colors. The colour-picker is an intentional
    // hardcoded-colour component (arbitrary swatches/handles), matching R2's
    // file-level exemption below.
    if (RE_R1_BORDER_HARD.test(line) && !isColorPicker) {
      errors.push(`[R1 hardcoded-border ${rel}:L${idx + 1}] hardcoded border color "${line.trim().slice(0, 120)}" — use border-border token`);
    }
    // R1: bg-white/bg-black surfaces
    RE_R1_BG_SURFACE.lastIndex = 0;
    if (RE_R1_BG_SURFACE.test(line)) {
      if (RE_R1_BG_OPACITY.test(line)) {
        // bg-black/60 scrim — allowed
      } else if (isColorPicker) {
        // color spectrum / swatch canvas — allowed
      } else if (isSvgIconFile && RE_SVG_CURRENT.test(line)) {
        // svg currentColor — allowed
      } else {
        errors.push(`[R1 hardcoded-bg ${rel}:L${idx + 1}] hardcoded surface "${line.trim().slice(0, 120)}" — use bg-background/bg-card token`);
      }
    }
    // R2: arbitrary hex whites / rgba whites. The gray rgba form is only a
    // violation when it is NOT paired with a `dark:` counterpart on the same
    // line (a light-gray glass border with a dark: override is adaptive).
    const hasDarkVariant = /\bdark:/.test(line);
    if (!isCloseRed && !isColorPicker && (RE_R2_BG_BRACKET.test(line) || RE_R2_RGBA_WHITE.test(line) || (RE_R2_RGBA_GRAY.test(line) && !hasDarkVariant))) {
      errors.push(`[R2 hardcoded-hex ${rel}:L${idx + 1}] hardcoded white hex/rgba "${line.trim().slice(0, 120)}" — use theme token`);
    }
    // R4: bg/text pairing
    if (RE_R4_BG.test(line) && !RE_TEXT_ANY.test(line) && !RE_SCHEME_TEXT.test(line)) {
      const next3 = lines.slice(idx + 1, idx + 4).join('\n');
      if (!RE_TEXT_ANY.test(next3) && !RE_SCHEME_TEXT.test(next3)) {
        // Also allow if enclosing cn block already pairs text-
        let paired = false;
        for (const b of blocks) {
          if (b.text.includes(line.trim().slice(0, 40)) && RE_TEXT_ANY.test(b.text)) { paired = true; break; }
        }
        if (!paired) errors.push(`[R4 bg-without-text ${rel}:L${idx + 1}] surface without text pairing "${line.trim().slice(0, 120)}" — add text-foreground (same block or next 3 lines)`);
      }
    }
    // R5: hardcoded text colors
    if (!isCloseRed && RE_R5_TEXT_HARD.test(line) && !RE_SVG_CURRENT.test(line)) {
      errors.push(`[R5 hardcoded-text ${rel}:L${idx + 1}] hardcoded text color "${line.trim().slice(0, 120)}" — use text-foreground/text-muted-foreground`);
    }
    // R6: close-red hover without token text — WARN only
    if (RE_R6_CLOSE_RED.test(line) && !RE_TEXT_ANY.test(line)) {
      warnings.push(`[R6 close-red ${rel}:L${idx + 1}] hover:bg-[#e81123] without paired token text — verify dark-mode contrast (WARN only)`);
    }
  }
}

function checkQmlFile(rel, content, lines, errors, warnings) {
  const base = rel.slice(rel.lastIndexOf('/') + 1);
  if (base === 'ChaSetThemeSettings.qml' || base === 'TokensPage.qml') {
    // Q3 exempt files (token catalogs) — still run Q1/Q2/Q4/Q5
  }

  // Q1: per-Rectangle pairing via brace counter
  const rectStack = [];
  let depth = 0;
  const rectBlocks = [];
  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    if (RE_RECT_OPEN.test(line) && !isCommentLine(line.trim()) && !RE_ALLOW_ESCAPE.test(line)) {
      rectStack.push({ startLine: idx + 1, depth, text: '' });
    }
    for (const r of rectStack) r.text += '\n' + line;
    depth += opens - closes;
    while (rectStack.length > 0 && depth <= rectStack[rectStack.length - 1].depth) {
      rectBlocks.push(rectStack.pop());
    }
  }
  while (rectStack.length > 0) rectBlocks.push(rectStack.pop());
  for (const b of rectBlocks) {
    if (RE_ALLOW_ESCAPE.test(b.text) || allowAt(lines, b.startLine - 2)) continue;
    if (RE_Q1_WIDTH.test(b.text) && !RE_Q1_COLOR_OK.test(b.text)) {
      errors.push(`[Q1 bare-qml-border ${rel}:L${b.startLine}] border.width without any border.color declaration (dark-mode fallback)`);
    }
  }

  // Generic brace blocks for Q5 WARN (reuse rect parse but all blocks)
  const blockStack = [];
  let d2 = 0;
  const allBlocks = [];
  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    if (line.includes('{') && !isCommentLine(line.trim())) blockStack.push({ startLine: idx + 1, depth: d2, text: '' });
    for (const r of blockStack) r.text += '\n' + line;
    d2 += opens - closes;
    while (blockStack.length > 0 && d2 <= blockStack[blockStack.length - 1].depth) allBlocks.push(blockStack.pop());
  }
  for (const b of allBlocks) {
    if (b.text.length > 4000) continue; // skip root-level mega blocks to avoid noise
    if (RE_ALLOW_ESCAPE.test(b.text)) continue;
    if (RE_Q5_PANEL.test(b.text) && !RE_Q5_TEXT.test(b.text)) {
      warnings.push(`[Q5 panel-without-text ${rel}:L${b.startLine}] color: ThemeTokens.panel/panelRaised without sibling ThemeTokens.text/subduedText/onAccentColor (WARN only)`);
      break; // one WARN per file to avoid noise
    }
  }

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    if (allowAt(lines, idx)) continue;
    const trimmed = line.trim();
    if (!trimmed || isCommentLine(trimmed)) continue;

    // Q2: hardcoded QML border colors (no allowlist)
    if (RE_Q2_HARD.test(line)) {
      errors.push(`[Q2 hardcoded-qml-border ${rel}:L${idx + 1}] hardcoded border.color "${trimmed.slice(0, 120)}" — use ThemeTokens.border`);
    }
    // Q3: hardcoded color literals
    if (base !== 'ChaSetThemeSettings.qml' && base !== 'TokensPage.qml' && RE_Q3_COLOR.test(line)) {
      if (line.includes('GradientStop') || line.includes('conic') || line.includes('linear-gradient') || line.includes('placeholder') || line.includes('fallback')) continue;
      if (line.includes('selectedTextColor')) {
        warnings.push(`[Q3 selectedTextColor ${rel}:L${idx + 1}] hardcoded selectedTextColor (WARN only)`);
        continue;
      }
      if (base.startsWith('ThemeTunerPage')) continue;
      errors.push(`[Q3 hardcoded-qml-color ${rel}:L${idx + 1}] hardcoded color "${trimmed.slice(0, 120)}" — use ThemeTokens.*`);
    }
    // Q4: unbranched WHITE overlays. Pure-black scrims (Qt.rgba(0,0,0,α)) and
    // α=0 transparent stops are theme-safe and intentionally allowed.
    RE_Q4_WHITE_RGBA.lastIndex = 0;
    let whiteAlpha = null;
    let q4m;
    while ((q4m = RE_Q4_WHITE_RGBA.exec(line)) !== null) {
      const alpha = Number.parseFloat(q4m[1]);
      if (alpha === 0) continue; // transparent no-op
      whiteAlpha = q4m[1].trim();
      break;
    }
    if (whiteAlpha !== null) {
      const lo = Math.max(0, idx - 5);
      const hi = Math.min(lines.length, idx + 6);
      const ctx = lines.slice(lo, hi).join('\n');
      if (!RE_Q4_BRANCH.test(ctx)) {
        errors.push(`[Q4 unbranched-white ${rel}:L${idx + 1}] Qt.rgba(1,1,1,${whiteAlpha}) white overlay without ThemeTokens.dark/isDark branch within 5 lines`);
      }
    }
  }
}

export function verifyThemeAdaptive({ quiet = false, rootOverride = null } = {}) {
  const root = rootOverride || rootDir;
  const compFilter = (() => {
    const i = process.argv.indexOf('--component');
    return i !== -1 ? process.argv[i + 1] : null;
  })();
  const files = listFiles(root, compFilter);
  const errors = [];
  const warnings = [];
  let checkedCount = 0;

  for (const rel of files) {
    checkedCount++;
    let content;
    try {
      content = readFileSync(resolve(root, rel), 'utf-8');
    } catch { continue; }
    const lines = content.split(/\r?\n/); // single split per file
    if (rel.endsWith('.qml')) {
      checkQmlFile(rel, content, lines, errors, warnings);
    } else {
      const blocks = extractCnBlocks(content);
      checkReactFile(rel, lines, blocks, null, errors, warnings);
    }
  }

  const ok = errors.length === 0;
  if (!quiet) {
    if (ok) {
      console.log(`[PASS] Theme-adaptive gate: 0 violations across ${checkedCount} files (rules v${RULES_VERSION}).`);
      for (const w of warnings) console.warn(`[WARN] ${w}`);
    } else {
      console.error(`[FAIL] Theme-adaptive gate: ${errors.length} violation(s) across ${checkedCount} files (rules v${RULES_VERSION}):`);
      for (const err of errors) console.error(`  - ${err}`);
      for (const w of warnings) console.warn(`[WARN] ${w}`);
    }
  }
  return { ok, errors, warnings, checkedCount, rulesVersion: RULES_VERSION };
}

// --- self-test: prove each rule fires on synthetic fixtures -----------------
function runRuleOnReactSnippet(snippetLines, rel = 'packages/react/src/test/Snippet.tsx') {
  const errors = [];
  const warnings = [];
  const content = snippetLines.join('\n');
  checkReactFile(rel, snippetLines, extractCnBlocks(content), null, errors, warnings);
  return { errors, warnings };
}

function runRuleOnQmlSnippet(snippetLines, rel = 'qt/src/Snippet.qml') {
  const errors = [];
  const warnings = [];
  checkQmlFile(rel, snippetLines.join('\n'), snippetLines, errors, warnings);
  return { errors, warnings };
}

export function selfTest() {
  const results = [];
  const push = (name, passed) => {
    results.push([name, passed]);
    console.log(`[theme-adaptive] self-test ${passed ? 'PASS' : 'FAIL'} — ${name}`);
  };

  // 1. bare border in cn block without pairing
  let r = runRuleOnReactSnippet(['import { cn } from "x";', 'const c = cn("border", "p-2");']);
  push('R3 catches bare border in cn() without border-border pairing', r.errors.some((e) => e.startsWith('[R3')));
  // 2. border-white
  r = runRuleOnReactSnippet(['<div className="border-white p-2">x</div>']);
  push('R1 catches border-white', r.errors.some((e) => e.startsWith('[R1')));
  // 3. bg-white surface
  r = runRuleOnReactSnippet(['<div className="bg-white p-2">x</div>']);
  push('R1 catches bg-white surface', r.errors.some((e) => e.startsWith('[R1')));
  // 4. #ffffff QML border
  r = runRuleOnQmlSnippet(['Rectangle {', '  border.width: 1', '  border.color: "#ffffff"', '}']);
  push('Q2 catches #ffffff QML border', r.errors.some((e) => e.startsWith('[Q2')));
  // 5. bg-background without text pairing
  r = runRuleOnReactSnippet(['<div className="bg-background p-4">', '  <span>hello</span>', '</div>', '<p>more</p>', '<p>even more</p>']);
  push('R4 catches bg-background without text pairing', r.errors.some((e) => e.startsWith('[R4')));

  // Clean fixtures must pass.
  r = runRuleOnReactSnippet(['const c = cn("border border-border", "bg-background text-foreground");']);
  const cleanReact = r.errors.length === 0;
  push('clean React fixture (paired border + bg/text) passes', cleanReact);
  if (!cleanReact) for (const e of r.errors) console.log(`  - unexpected: ${e}`);

  const rq = runRuleOnQmlSnippet(['Rectangle {', '  border.width: 1', '  border.color: ThemeTokens.border', '  color: ThemeTokens.panel', '}']);
  // Q1 paired so no Q1/Q2 errors; Q5 may warn (panel without text) but must not hard-fail.
  const cleanQml = !rq.errors.some((e) => e.startsWith('[Q1') || e.startsWith('[Q2'));
  push('clean QML fixture (ThemeTokens border) passes hard rules', cleanQml);

  // Escape hatch must skip.
  r = runRuleOnReactSnippet(['<div className="bg-white p-2">x</div> // theme-adaptive:allow scrim']);
  push('theme-adaptive:allow escape hatch skips line', r.errors.length === 0);

  // --- v2 precision fixtures -------------------------------------------------
  // `bg-border` / `bg-sidebar-border` contain the substring `border` but are
  // NOT bare border utilities (hyphen is a word boundary — the old bug).
  r = runRuleOnReactSnippet(['const c = cn("bg-border", "p-2");']);
  push('v2: bg-border is NOT flagged as a bare border', !r.errors.some((e) => e.startsWith('[R3')));
  r = runRuleOnReactSnippet(['const c = cn("mx-2 w-auto bg-sidebar-border");']);
  push('v2: bg-sidebar-border is neither bare border nor a surface', r.errors.length === 0);
  // `after:bg-sidebar-ring` is a ring colour, not a bg surface.
  r = runRuleOnReactSnippet(['const c = cn("after:bg-sidebar-ring after:opacity-0");']);
  push('v2: bg-sidebar-ring (ring colour) is NOT a surface', !r.errors.some((e) => e.startsWith('[R4')));
  // The escape marker may sit on the line ABOVE the offending line.
  r = runRuleOnReactSnippet([
    'const x = cn(',
    '  // theme-adaptive:allow decorative-handle',
    "  'absolute bg-background pointer-events-none',",
    ');',
  ]);
  push('v2: allow marker on the line above skips the finding', r.errors.length === 0);
  // Colocated *.test.tsx files are exempt from hardcoded-literal rules.
  r = runRuleOnReactSnippet(["expect(el).toHaveClass('border-[rgba(203,213,225,0.6)]');"], 'packages/react/src/button/Button.test.tsx');
  push('v2: *.test.tsx files are exempt from R2 literals', !r.errors.some((e) => e.startsWith('[R2')));
  // A light-gray rgba glass border PAIRED with a dark: override is adaptive.
  r = runRuleOnReactSnippet(["const c = 'border-[rgba(203,213,225,0.6)] dark:border-[rgba(60,72,88,0.6)]';"]);
  push('v2: gray rgba with a dark: counterpart passes R2', !r.errors.some((e) => e.startsWith('[R2')));
  r = runRuleOnReactSnippet(["const c = 'border-[rgba(203,213,225,0.6)]';"]);
  push('v2: unbranched gray rgba is still caught by R2', r.errors.some((e) => e.startsWith('[R2')));
  // Q1 pairs on ANY border.color declaration (conditional / property reference).
  const rqCond = runRuleOnQmlSnippet(['Rectangle {', '  border.width: 1', '  border.color: root.activeFocus ? ThemeTokens.focus : "transparent"', '}']);
  push('v2: Q1 accepts a conditional/property border.color', !rqCond.errors.some((e) => e.startsWith('[Q1')));
  // Q1 still fires when border.color is genuinely absent.
  const rqBare = runRuleOnQmlSnippet(['Rectangle {', '  color: ThemeTokens.panel', '  border.width: 1', '}']);
  push('v2: Q1 still catches border.width without any border.color', rqBare.errors.some((e) => e.startsWith('[Q1')));
  // Q4: white overlay (α>0, no branch) fails; black scrim and α=0 pass.
  const q4Bad = runRuleOnQmlSnippet(['Rectangle {', '  color: Qt.rgba(1, 1, 1, 0.08)', '}']);
  push('v2: Q4 catches unbranched white overlay', q4Bad.errors.some((e) => e.startsWith('[Q4')));
  const q4Scrim = runRuleOnQmlSnippet(['Rectangle {', '  color: Qt.rgba(0, 0, 0, 0.6)', '}']);
  push('v2: Q4 allows pure-black scrim', !q4Scrim.errors.some((e) => e.startsWith('[Q4')));
  const q4Zero = runRuleOnQmlSnippet(['Rectangle {', '  color: Qt.rgba(1, 1, 1, 0)', '}']);
  push('v2: Q4 allows α=0 transparent stop', !q4Zero.errors.some((e) => e.startsWith('[Q4')));

  const ok = results.every(([, p]) => p);
  if (ok) console.log('[theme-adaptive] self-test PASS — all synthetic violations caught, clean fixtures pass');
  else console.log('[theme-adaptive] self-test FAIL — a rule no longer fires');
  return { ok, results };
}

// --- CLI -------------------------------------------------------------------
const isMain = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase() === resolve(process.argv[1]).toLowerCase();
if (isMain) {
  if (process.argv.includes('--self-test')) {
    const { ok } = selfTest();
    process.exit(ok ? 0 : 1);
  }
  const res = verifyThemeAdaptive({});
  process.exit(res.ok ? 0 : 1);
}
