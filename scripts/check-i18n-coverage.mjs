#!/usr/bin/env node
// check-i18n-coverage.mjs — Cross-Stack i18n Translation Coverage Gate (Ratchet)
//
// Detects incomplete showcase translation via character-distribution analysis:
//   1. missing-key  — t()/tr() key absent from BOTH locale dictionaries (both
//                     locales silently render the English default text).
//   2. zh-latin     — the zh-CN resolved string contains translatable English
//                     words and zero CJK characters (untranslated for Chinese).
//   3. en-cjk       — the en-US resolved string contains CJK characters
//                     (Chinese text leaked into the English locale).
//   4. hardcoded    — visible string literals NOT wrapped in t()/tr()
//                     (JSX text nodes, title/label/description/text/... props
//                     on both stacks). These are the "not internationalized
//                     at all" backlog.
//
// Code is excluded by construction: template literals (reactCode/qtCode/code
// snippets), comments, and non-visible props are masked before scanning, and
// a neutral-token whitelist (component names, keyboard shortcuts, units,
// acronyms, {{var}} placeholders) keeps identifiers out of the distribution.
//
// Ratchet model (spec/i18n/coverage-baseline.json):
//   - First run: `--update-baseline` records every current finding.
//   - gate fails on NEW findings (not in baseline) and on STALE baseline
//     entries (already fixed but not pruned) — the baseline can only shrink.
//   - Workflow when fixing translations: land the fix, run
//     `pnpm check:i18n --update-baseline` to prune the baseline.
//
// Usage:
//   node scripts/check-i18n-coverage.mjs                    # audit + table
//   node scripts/check-i18n-coverage.mjs --json             # also write spec/i18n/coverage-report.json
//   node scripts/check-i18n-coverage.mjs --update-baseline  # regenerate ratchet baseline
//   node scripts/check-i18n-coverage.mjs --self-test        # guard self-test only

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, realpathSync } from 'node:fs';
import { resolve, dirname, join, relative, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REACT_SRC = resolve(root, 'packages', 'react', 'examples', 'basic', 'src');
const QT_SRC = resolve(root, 'qt', 'src');
const I18N_DIR = resolve(root, 'spec', 'i18n');
const BASELINE_PATH = resolve(I18N_DIR, 'coverage-baseline.json');
const REPORT_PATH = resolve(I18N_DIR, 'coverage-report.json');

// ---------------------------------------------------------------------------
// Dictionary loading — mirrors spec/generators/generate-i18n.mjs exactly
// ---------------------------------------------------------------------------

function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target;
  const result = Array.isArray(target) ? [...target] : { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function loadLocale(code) {
  const mainFile = join(I18N_DIR, 'locales', `${code}.json`);
  let data = existsSync(mainFile) ? JSON.parse(readFileSync(mainFile, 'utf8')) : {};
  const subDir = join(I18N_DIR, 'locales', code);
  if (existsSync(subDir) && statSync(subDir).isDirectory()) {
    const files = readdirSync(subDir).filter(f => f.endsWith('.json')).sort();
    for (const f of files) {
      data = deepMerge(data, JSON.parse(readFileSync(join(subDir, f), 'utf8')));
    }
  }
  return data;
}

function dictLookup(dict, key) {
  let cur = dict;
  for (const part of key.split('.')) {
    if (cur === undefined || cur === null || typeof cur !== 'object') return undefined;
    cur = cur[part];
  }
  return typeof cur === 'string' ? cur : undefined;
}

// ---------------------------------------------------------------------------
// Character-distribution classifier
// ---------------------------------------------------------------------------

const CJK_RE = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3005\u3007]/;

const NEUTRAL_TOKENS = new Set([
  // keyboard / modifiers
  'ctrl', 'shift', 'alt', 'del', 'esc', 'enter', 'tab', 'space', 'cmd', 'meta',
  'win', 'fn', 'pgup', 'pgdn', 'home', 'end', 'ins', 'num', 'caps', 'backspace',
  // units / tech acronyms / locale tags
  'px', 'dp', 'sp', 'ms', 'kb', 'mb', 'gb', 'api', 'ui', 'id', 'ids', 'url',
  'os', 'css', 'qml', 'jsx', 'tsx', 'ts', 'js', 'json', 'svg', 'rgb', 'rgba',
  'hsl', 'oklch', 'aria', 'toc', 'cdn', 'http', 'https', 'ok', 'no', 'pc',
  // locale codes / language tags
  'zh', 'en', 'cn', 'us', 'ja', 'de', 'fr', 'ko',
  // sizing tokens
  'sm', 'md', 'lg', 'xl', 'xs', 'xxl',
]);

// Regex sources for self-test masking assertions
export function classifyText(text) {
  const clean = String(text)
    .replace(/\{\{[^}]+\}\}/g, ' ')        // interpolation placeholders
    .replace(/https?:\/\/\S+/g, ' ');      // URLs
  if (CJK_RE.test(clean)) return 'cjk';

  const rawTokens = clean.match(/[A-Za-z][A-Za-z0-9]*/g) || [];
  const humped = new Set(); // multi-hump camel/Pascal identifiers (ChaSetButton)
  for (const rt of rawTokens) {
    const humps = (rt.match(/[A-Z]/g) || []).length;
    if (humps >= 2) humped.add(rt.toLowerCase());
  }

  for (const rt of rawTokens) {
    const tok = rt.toLowerCase();
    if (tok.length <= 1) continue;                                   // single letters
    if (/^\d/.test(tok)) continue;                                   // alnum codes
    if (NEUTRAL_TOKENS.has(tok)) continue;
    if (/^f\d{1,2}$/.test(tok)) continue;                            // F1..F12
    if (rt === rt.toUpperCase() && rt.length <= 4) continue;         // acronyms (ID, API)
    if (humped.has(tok)) continue;                                   // component/prop identifiers
    return 'latin'; // at least one translatable English word
  }
  return 'neutral';
}

// ---------------------------------------------------------------------------
// Source masking & scanning
// ---------------------------------------------------------------------------

// Mask (same length, offset-preserving) comments and template literals so
// every scanner regex works on prose-bearing content only while `index`
// remains valid against the ORIGINAL file text (accurate line numbers).
function maskSource(content) {
  let out = content
    .replace(/\/\*[\s\S]*?\*\//g, m => ' '.repeat(m.length))
    // line comments: avoid stripping "://"" inside string literals/URLs
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, (m, p1) => p1 + ' '.repeat(m.length - p1.length))
    // template literals (reactCode / qtCode / code snippets on both stacks)
    .replace(/`(?:\\.|[^`\\])*`/g, m => ' '.repeat(m.length));
  return out;
}

const REACT_T_RE = /\bt\(\s*(['"])((?:\\.|(?!\1).)*)\1\s*(?:,\s*(['"])((?:\\.|(?!\3).)*)\3)?\s*[\),]/g;
const QT_TR_RE = /ChaSetI18n\.tr\(\s*(['"])((?:\\.|(?!\1).)*)\1\s*(?:,\s*(['"])((?:\\.|(?!\3).)*)\3)?/g;

// Visible string props: JSX attributes (title="...") and property literals
// (title: "...") shared by React option objects and QML property bindings.
const VISIBLE_PROP_RE =
  /\b(title|pageTitle|sectionTitle|label|description|placeholder|placeholderText|tooltip|caption|header|headerTitle|text|statusText|emptyText|confirmText|cancelText)\s*(?:=|:)\s*(['"])((?:\\.|(?!\2).)*)\2/g;

const JSX_TEXT_RE = />([^<>{}]+)</g;

function isProseCandidate(raw) {
  const s = raw.replace(/\s+/g, ' ').trim();
  if (!s) return false;
  if (!/[A-Za-z\u3400-\u4dbf\u4e00-\u9fff]/.test(s)) return false;
  if (/[;=`@#$^*\\|/]/.test(s)) return false;
  if (/=>/.test(s) || /\(\)/.test(s)) return false;
  if (s.length > 120) return false;
  return true;
}

function lineOf(content, index) {
  let line = 1;
  for (let i = 0; i < index && i < content.length; i++) {
    if (content.charCodeAt(i) === 10) line++;
  }
  return line;
}

function scanReactContent(content) {
  const masked = maskSource(content);
  const i18nCalls = [];
  for (const m of masked.matchAll(REACT_T_RE)) {
    i18nCalls.push({
      key: m[2].replace(/\\'/g, "'").replace(/\\"/g, '"'),
      defaultText: m[4] !== undefined ? m[4].replace(/\\'/g, "'").replace(/\\"/g, '"') : undefined,
      index: m.index,
    });
  }
  // blank i18n call spans so their default text is not re-reported as hardcoded
  const blanked = blankSpans(masked, i18nCalls.map(c => {
    const end = findCallEnd(masked, c.index);
    return end > c.index ? [c.index, end] : null;
  }).filter(Boolean));

  const hardcoded = [];
  for (const m of blanked.matchAll(JSX_TEXT_RE)) {
    if (isProseCandidate(m[1])) {
      hardcoded.push({ text: m[1].replace(/\s+/g, ' ').trim(), index: m.index, kind: 'jsx-text' });
    }
  }
  for (const m of blanked.matchAll(VISIBLE_PROP_RE)) {
    const val = m[3].replace(/\s+/g, ' ').trim();
    if (val && isProseCandidate(val)) {
      hardcoded.push({ text: val, index: m.index, kind: `prop:${m[1]}` });
    }
  }
  return { i18nCalls, hardcoded };
}

function scanQtContent(content) {
  const masked = maskSource(content);
  const i18nCalls = [];
  for (const m of masked.matchAll(QT_TR_RE)) {
    i18nCalls.push({
      key: m[2].replace(/\\'/g, "'").replace(/\\"/g, '"'),
      defaultText: m[4] !== undefined ? m[4].replace(/\\'/g, "'").replace(/\\"/g, '"') : undefined,
      index: m.index,
    });
  }
  const blanked = blankSpans(masked, i18nCalls.map(c => {
    const end = findCallEnd(masked, c.index);
    return end > c.index ? [c.index, end] : null;
  }).filter(Boolean));

  const hardcoded = [];
  for (const m of blanked.matchAll(VISIBLE_PROP_RE)) {
    const val = m[3].replace(/\s+/g, ' ').trim();
    if (val && isProseCandidate(val)) {
      hardcoded.push({ text: val, index: m.index, kind: `prop:${m[1]}` });
    }
  }
  return { i18nCalls, hardcoded };
}

// Find the matching closing paren of a call that opens at `openParenIndex`
// (index of the '(' char), respecting nesting and string literals.
function findCallEnd(content, callStartIndex) {
  const open = content.indexOf('(', callStartIndex);
  if (open === -1) return -1;
  let depth = 0;
  let inStr = null;
  for (let i = open; i < content.length; i++) {
    const ch = content[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") { inStr = ch; continue; }
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

function blankSpans(content, spans) {
  if (spans.length === 0) return content;
  const arr = content.split('');
  for (const [s, e] of spans) {
    for (let i = s; i < e && i < arr.length; i++) {
      if (arr[i] !== '\n') arr[i] = ' ';
    }
  }
  return arr.join('');
}

// ---------------------------------------------------------------------------
// Walk & analyze
// ---------------------------------------------------------------------------

const SKIP_RE = /generated|\.test\.|__tests__|conformance/i;

function walk(dir, exts, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (SKIP_RE.test(entry)) continue;
      walk(full, exts, acc);
    } else if (exts.some(e => entry.endsWith(e)) && !SKIP_RE.test(entry)) {
      acc.push(full);
    }
  }
  return acc;
}

function findingId(type, stack, relFile, identity) {
  return createHash('sha1').update(`${type}|${stack}|${relFile}|${identity}`).digest('hex').slice(0, 12);
}

export function analyzeI18nCoverage() {
  const zhDict = loadLocale('zh-CN');
  const enDict = loadLocale('en-US');

  const reactFiles = walk(REACT_SRC, ['.tsx', '.ts']);
  const qtFiles = walk(QT_SRC, ['.qml']);

  const findings = [];
  const files = [];

  const processFile = (absPath, stack, scanFn) => {
    const content = readFileSync(absPath, 'utf8');
    const { i18nCalls, hardcoded } = scanFn(content);
    const relFile = relative(root, absPath).replace(/\\/g, '/');
    const page = basename(absPath).replace(/\.(tsx|ts|qml)$/, '');

    const perFile = {
      stack, file: relFile, page,
      i18nCalls: i18nCalls.length,
      hardcoded: hardcoded.length,
      missing: 0, zhLatin: 0, enCjk: 0,
    };

    for (const call of i18nCalls) {
      const line = lineOf(content, call.index);
      const zhVal = dictLookup(zhDict, call.key);
      const enVal = dictLookup(enDict, call.key);

      if (zhVal === undefined && enVal === undefined) {
        perFile.missing++;
        findings.push({
          id: findingId('missing-key', stack, relFile, call.key),
          type: 'missing-key', stack, file: relFile, page, line,
          key: call.key,
          detail: `default: "${(call.defaultText ?? '').slice(0, 60)}"`,
        });
        continue;
      }

      const zhShow = zhVal !== undefined ? zhVal : (enVal !== undefined ? enVal : (call.defaultText ?? call.key));
      const enShow = enVal !== undefined ? enVal : (zhVal !== undefined ? zhVal : (call.defaultText ?? call.key));
      const zhCls = classifyText(zhShow);
      const enCls = classifyText(enShow);

      if (zhCls === 'latin') {
        perFile.zhLatin++;
        findings.push({
          id: findingId('zh-latin', stack, relFile, call.key),
          type: 'zh-latin', stack, file: relFile, page, line,
          key: call.key,
          detail: `zh-CN renders "${String(zhShow).slice(0, 60)}"`,
        });
      }
      if (enCls === 'cjk') {
        perFile.enCjk++;
        findings.push({
          id: findingId('en-cjk', stack, relFile, call.key),
          type: 'en-cjk', stack, file: relFile, page, line,
          key: call.key,
          detail: `en-US renders "${String(enShow).slice(0, 60)}"`,
        });
      }
    }

    for (const h of hardcoded) {
      const cls = classifyText(h.text);
      if (cls === 'neutral') continue;
      const line = lineOf(content, h.index);
      perFile.hardcodedFlagged = (perFile.hardcodedFlagged || 0) + 1;
      findings.push({
        id: findingId('hardcoded', stack, relFile, h.text),
        type: 'hardcoded', stack, file: relFile, page, line,
        detail: `"${h.text.slice(0, 80)}" (${h.kind})`,
      });
    }

    const flaggedCalls = perFile.missing + perFile.zhLatin + perFile.enCjk;
    const total = i18nCalls.length + hardcoded.length;
    const flaggedTotal = flaggedCalls + (perFile.hardcodedFlagged || 0);
    perFile.coverage = total > 0 ? 1 - flaggedTotal / total : 1;
    files.push(perFile);
  };

  for (const f of reactFiles) processFile(f, 'react', scanReactContent);
  for (const f of qtFiles) processFile(f, 'qt', scanQtContent);

  // ---- page-level aggregation ----
  const pageMap = new Map();
  for (const f of files) {
    if (!pageMap.has(f.page)) pageMap.set(f.page, {});
    const row = pageMap.get(f.page);
    const agg = row[f.stack] || { i18n: 0, missing: 0, zhLatin: 0, enCjk: 0, hardcoded: 0, flagged: 0, total: 0 };
    agg.i18n += f.i18nCalls;
    agg.missing += f.missing;
    agg.zhLatin += f.zhLatin;
    agg.enCjk += f.enCjk;
    agg.hardcoded += f.hardcodedFlagged || 0;
    agg.flagged += f.missing + f.zhLatin + f.enCjk + (f.hardcodedFlagged || 0);
    agg.total += f.i18nCalls + f.hardcoded;
    row[f.stack] = agg;
  }

  const pages = [...pageMap.entries()].map(([page, stacks]) => {
    let worst = 1;
    for (const agg of Object.values(stacks)) {
      if (agg.total > 0) worst = Math.min(worst, 1 - agg.flagged / agg.total);
    }
    return { page, stacks, worstCoverage: worst };
  }).sort((a, b) => a.worstCoverage - b.worstCoverage || a.page.localeCompare(b.page));

  return { findings, files, pages };
}

// ---------------------------------------------------------------------------
// Console table
// ---------------------------------------------------------------------------

function pad(s, n) { return String(s).padEnd(n); }
function padL(s, n) { return String(s).padStart(n); }

export function renderTable(pages) {
  const lines = [];
  lines.push(
    pad('Page', 38) + pad('Stack', 7) +
    padL('i18n', 6) + padL('Miss', 6) + padL('zhEn', 6) + padL('enCJK', 6) +
    padL('Hard', 6) + padL('Total', 7) + padL('Cov%', 7)
  );
  lines.push('-'.repeat(83));
  for (const { page, stacks } of pages) {
    const ordered = ['react', 'qt'].filter(s => stacks[s] && stacks[s].total > 0);
    if (ordered.length === 0) continue; // nothing visible to translate in this file
    for (const stack of ordered) {
      const a = stacks[stack];
      const cov = a.total > 0 ? Math.round((1 - a.flagged / a.total) * 100) : 100;
      lines.push(
        pad(page, 38) + pad(stack, 7) +
        padL(a.i18n, 6) + padL(a.missing, 6) + padL(a.zhLatin, 6) + padL(a.enCjk, 6) +
        padL(a.hardcoded, 6) + padL(a.total, 7) + padL(cov, 7)
      );
    }
  }
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Ratchet baseline
// ---------------------------------------------------------------------------

function loadBaseline() {
  if (!existsSync(BASELINE_PATH)) return null;
  try {
    return JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public verification API (gate entry point)
// ---------------------------------------------------------------------------

export function verifyI18nCoverage(options = {}) {
  const { quiet = false, updateBaseline = false, jsonOut = false } = options;
  const errors = [];
  const warnings = [];

  const { findings, files, pages } = analyzeI18nCoverage();
  const currentIds = new Set(findings.map(f => f.id));

  let baseline = loadBaseline();
  if (!baseline || updateBaseline) {
    baseline = {
      version: 1,
      generatedAt: new Date().toISOString(),
      totalFindings: findings.length,
      ids: findings.map(f => f.id).sort(),
    };
    writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2) + '\n', 'utf8');
    warnings.push(`ratchet baseline (re)written: ${BASELINE_PATH} (${findings.length} findings)`);
    // A fresh baseline equals the current state by definition — this run is clean.
  }

  const baselineIds = new Set(baseline.ids || []);
  const newOnes = findings.filter(f => !baselineIds.has(f.id));
  const stale = [...baselineIds].filter(id => !currentIds.has(id));

  for (const f of newOnes.slice(0, 40)) {
    errors.push(`NEW ${f.type} [${f.stack}] ${f.file}:${f.line} — ${f.key ?? ''} ${f.detail}`);
  }
  if (newOnes.length > 40) {
    errors.push(`... and ${newOnes.length - 40} more new violations`);
  }
  if (newOnes.length > 0) {
    errors.push(`Ratchet: ${newOnes.length} new i18n coverage violation(s) not present in the baseline.`);
    errors.push(`Fix the translations, or (only after real translation work) run: pnpm check:i18n --update-baseline`);
  }
  if (stale.length > 0) {
    errors.push(`Stale baseline: ${stale.length} baseline entr(y|ies) no longer match any current finding — the ratchet may only shrink.`);
    errors.push(`Run: pnpm check:i18n --update-baseline`);
  }

  if (jsonOut) {
    const report = {
      generatedAt: new Date().toISOString(),
      scope: { react: relative(root, REACT_SRC), qt: relative(root, QT_SRC) },
      summary: {
        filesScanned: files.length,
        findings: findings.length,
        byType: {
          'missing-key': findings.filter(f => f.type === 'missing-key').length,
          'zh-latin': findings.filter(f => f.type === 'zh-latin').length,
          'en-cjk': findings.filter(f => f.type === 'en-cjk').length,
          hardcoded: findings.filter(f => f.type === 'hardcoded').length,
        },
      },
      pages,
      findings,
    };
    writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf8');
  }

  if (!quiet) {
    console.log(`[i18n-coverage] Scanned ${files.length} showcase files ` +
      `(${files.filter(f => f.stack === 'react').length} react, ${files.filter(f => f.stack === 'qt').length} qt); ` +
      `${findings.length} findings.`);
    console.log(renderTable(pages));
  }

  return {
    ok: errors.length === 0,
    errors, warnings,
    stats: {
      files: files.length,
      findings: findings.length,
      newViolations: newOnes.length,
      staleBaseline: stale.length,
    },
    pages, findings,
  };
}

// ---------------------------------------------------------------------------
// Self-test — proves the guard actually fires (masked sources, classifiers,
// and both stack scanners detect injected violations).
// ---------------------------------------------------------------------------

export function selfTest() {
  const errors = [];

  const cls = (input, expected, label) => {
    const got = classifyText(input);
    if (got !== expected) errors.push(`classify("${input}") = "${got}", expected "${expected}" (${label})`);
  };
  cls('Reset Removed Badge', 'latin', 'english prose');
  cls('默认状态徽章', 'cjk', 'chinese prose');
  cls('Ctrl+C #500', 'neutral', 'keyboard + number');
  cls('ChaSetButton', 'neutral', 'PascalCase identifier');
  cls('ID', 'neutral', 'acronym');
  cls('Item #{{index}}', 'latin', 'interpolated placeholder with translatable word');
  cls('#{{index}} ({{count}})', 'neutral', 'interpolated placeholder only');
  cls('Speed Multiplier:', 'latin', 'hardcoded english label');

  const reactSnippet = [
    "const { t } = useChaSetI18n();",
    "const code = `<Badge text={x}>code</Badge>`; // code must be masked",
    "<div>",
    "  {t('selftest.missing.key', 'Missing Translation Sample')}",
    "</div>",
    "<button title=\"Hard Coded Title\">Press Me</button>",
  ].join('\n');
  const reactScan = scanReactContent(reactSnippet);
  if (reactScan.i18nCalls.length !== 1) errors.push(`react self-test: expected 1 t() call, got ${reactScan.i18nCalls.length}`);
  if (reactScan.i18nCalls[0]?.key !== 'selftest.missing.key') errors.push('react self-test: wrong key extracted');
  const reactTexts = reactScan.hardcoded.map(h => h.text);
  if (!reactTexts.includes('Hard Coded Title')) errors.push(`react self-test: hardcoded title not detected (got ${JSON.stringify(reactTexts)})`);
  if (!reactTexts.includes('Press Me')) errors.push('react self-test: hardcoded JSX text not detected');
  if (reactScan.hardcoded.some(h => /code|Badge/.test(h.text))) errors.push('react self-test: template-literal code leaked into findings');

  const qtSnippet = [
    "DocText {",
    "    text: ChaSetI18n.tr(\"selftest.missing.key2\", \"Missing Qt Sample\")",
    "}",
    "ComponentPreview {",
    "    reactCode: `Text { text: \"ignored\" }`",
    "    title: \"Hard Coded Label\"",
    "}",
  ].join('\n');
  const qtScan = scanQtContent(qtSnippet);
  if (qtScan.i18nCalls.length !== 1) errors.push(`qt self-test: expected 1 tr() call, got ${qtScan.i18nCalls.length}`);
  const qtTexts = qtScan.hardcoded.map(h => h.text);
  if (!qtTexts.includes('Hard Coded Label')) errors.push(`qt self-test: hardcoded label not detected (got ${JSON.stringify(qtTexts)})`);
  if (qtScan.hardcoded.some(h => /ignored/.test(h.text))) errors.push('qt self-test: template-literal code leaked into findings');

  // missing-key detection end-to-end
  const zhDict = loadLocale('zh-CN');
  const enDict = loadLocale('en-US');
  if (dictLookup(zhDict, 'selftest.missing.key') !== undefined || dictLookup(enDict, 'selftest.missing.key') !== undefined) {
    errors.push('self-test key must not exist in dictionaries');
  }

  return { ok: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const currentFile = fileURLToPath(import.meta.url);
// D: is a drive mapping of E:\D in this environment — canonicalize both sides
// with realpath so the CLI entry check matches regardless of which spelling
// the shell used.
const sameAsEntry = (() => {
  try {
    return realpathSync(process.argv[1] || '') === realpathSync(currentFile);
  } catch {
    return false;
  }
})();
if (sameAsEntry) {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) {
    const st = selfTest();
    if (!st.ok) {
      console.error('[i18n-coverage] SELF-TEST FAILED:');
      for (const e of st.errors) console.error('  - ' + e);
      process.exit(1);
    }
    console.log('[i18n-coverage] self-test passed (classifier + both stack scanners + masking verified)');
    process.exit(0);
  }

  const res = verifyI18nCoverage({
    updateBaseline: args.includes('--update-baseline'),
    jsonOut: args.includes('--json'),
  });
  for (const w of res.warnings) console.warn('[i18n-coverage] WARN ' + w);
  if (!res.ok) {
    console.error(`[i18n-coverage] FAIL: ${res.stats.newViolations} new violation(s), ${res.stats.staleBaseline} stale baseline entr(y|ies):`);
    for (const e of res.errors) console.error('  - ' + e);
    process.exit(1);
  }
  console.log(`[i18n-coverage] OK — ratchet baseline held (${res.stats.findings} known findings, 0 new).`);
}
