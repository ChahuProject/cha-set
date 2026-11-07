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
//     `just check-i18n --update-baseline` to prune the baseline.
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
const REACT_LIB_SRC = resolve(root, 'packages', 'react', 'src');
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
const QT_TR_RE = /ChaSetI18n\.tr\(\s*(['"])((?:\\.|(?!\1).)*)\1\s*(?:,\s*(['"])((?:\\.|(?!\3).)*)\3)?\s*[\),]/g;

// Visible string props: JSX attributes (title="...") and property literals
// (title: "...") shared by React option objects and QML property bindings.
// React components do not use a `text` prop for user-facing prose (only CopyButton/CopyableBadge clipboard payloads).
const BASE_VISIBLE_PROPS = [
  'title', 'pageTitle', 'sectionTitle', 'label', 'description',
  'placeholder', 'placeholderText', 'searchPlaceholder', 'filterPlaceholder', 'queryPlaceholder',
  'tooltip', 'searchTooltip', 'clearTooltip', 'caption', 'header', 'headerTitle',
  'statusText', 'helperText', 'errorText', 'emptyText', 'emptySearchText', 'emptyState',
  'noMatchesText', 'noResultsText', 'confirmText', 'cancelText', 'clearText',
  'prompt', 'searchPrompt', 'filterPrompt', 'ariaLabel', 'aria-label',
];

const REACT_VISIBLE_PROP_RE = new RegExp(
  `\\b(${BASE_VISIBLE_PROPS.join('|')})\\s*(?:=|:)\\s*(['"])((?:\\\\.|(?!\\2).)*)\\2`,
  'g'
);

const QT_VISIBLE_PROP_RE = new RegExp(
  `\\b(text|${BASE_VISIBLE_PROPS.join('|')})\\s*(?:=|:)\\s*(['"])((?:\\\\.|(?!\\2).)*)\\2`,
  'g'
);

const QT_BANNED_QSTR_RE = /\bqsTr\s*\(/g;

const JSX_TEXT_RE = />([^<>{}]+)</g;

function isProseCandidate(raw) {
  const s = raw.replace(/\s+/g, ' ').trim();
  if (!s) return false;
  if (!/[A-Za-z\u3400-\u4dbf\u4e00-\u9fff]/.test(s)) return false;
  if (/[;=]/.test(s)) return false;
  if (/\$\{/.test(s)) return false; // template literal interpolation
  if (/[?&|]/.test(s)) return false; // ternary, logical, or bitwise operators
  if (/=>/.test(s)) return false; // arrow functions
  if (/\b(as|typeof|instanceof|keyof|return)\b/.test(s)) return false; // JS/TS keywords
  if (/\b(React\.|Math\.|console\.)/.test(s)) return false; // library calls
  if (/^(Promise|Record|Array|Map|Set|Function|Object)$/.test(s)) return false; // TS built-in generics
  if (/\)[^)]*\(/.test(s)) return false; // unbalanced / chained parens from code
  if (/\)\s*:\s*[A-Z]/.test(s)) return false; // return types
  if (/^@[\w.-]+(\/[\w.-]+)*$/.test(s)) return false; // npm package or handle (@radix-ui/primitives, @arivera)
  if (/^#[0-9a-fA-F]{3,8}$/.test(s)) return false; // hex color
  if (/^e\.g\.\s*#[0-9a-fA-F]+/i.test(s)) return false; // hex placeholder
  if (/^(pnpm|npm|yarn|cargo|git)\s/.test(s)) return false; // shell commands
  if (/^[A-Za-z_]\w*(\.[A-Za-z_]\w*)+$/.test(s)) return false; // property access (ThemeTokens.foo)
  if (/^[a-z0-9]+(-[a-z0-9]+)+$/.test(s)) return false; // kebab-case tokens (duration-quick)
  if (/^[\w.-]+(\/[\w.-]+)+\.[a-zA-Z]+$/.test(s)) return false; // file paths
  if (/^qt-page:\/\//.test(s)) return false; // custom url schemes
  if (/^user@example\.com$|^invalid-email@$/.test(s)) return false; // demo emails
  if (/^Order #\d+|^cha-set \/ /.test(s)) return false; // demo IDs
  if (/^(wrap|embedded|top|bottom)$/.test(s)) return false; // code options
  if (/=>/.test(s) || /^\s*[{<].*[}>]\s*$/.test(s)) return false;
  if (/^(import|export|const|let|var|function|return|class|interface|type)\s/.test(s)) return false;
  if (/^[\d\s.,%pxremdpsp#+\-*\/()]+$/.test(s)) return false;
  return true;
}

function lineOf(content, index) {
  let line = 1;
  for (let i = 0; i < index && i < content.length; i++) {
    if (content.charCodeAt(i) === 10) line++;
  }
  return line;
}

export function scanReactContent(content) {
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
  for (const m of blanked.matchAll(REACT_VISIBLE_PROP_RE)) {
    const val = m[3].replace(/\s+/g, ' ').trim();
    if (val && isProseCandidate(val)) {
      hardcoded.push({ text: val, index: m.index, kind: `prop:${m[1]}` });
    }
  }
  return { i18nCalls, hardcoded };
}

export function scanQtContent(content) {
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
  for (const m of blanked.matchAll(QT_VISIBLE_PROP_RE)) {
    const val = m[3].replace(/\s+/g, ' ').trim();
    if (val && isProseCandidate(val)) {
      hardcoded.push({ text: val, index: m.index, kind: `prop:${m[1]}` });
    }
  }

  const bannedQsTr = [];
  for (const m of masked.matchAll(QT_BANNED_QSTR_RE)) {
    bannedQsTr.push({ index: m.index });
  }

  return { i18nCalls, hardcoded, bannedQsTr };
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

export function auditNavigationItems(navCategories, zhDict, enDict) {
  const findings = [];
  const relFile = 'spec/showcase/navigation.json';

  for (const cat of navCategories) {
    const catTitle = cat.title || '';
    const catKey = 'categories.' + catTitle;
    const catZh = dictLookup(zhDict, catKey) || dictLookup(zhDict, 'showcase.categories.' + catTitle);
    const catEn = dictLookup(enDict, catKey) || dictLookup(enDict, 'showcase.categories.' + catTitle);

    if (catZh === undefined && catEn === undefined) {
      findings.push({
        id: findingId('missing-key', 'spec', relFile, catKey),
        type: 'missing-key', stack: 'spec', file: relFile, page: 'navigation', line: 1,
        key: catKey,
        detail: `Category "${catTitle}" missing from locale dictionaries`,
      });
    } else {
      if (catZh === undefined) {
        findings.push({
          id: findingId('missing-key', 'spec', relFile, catKey + ':zh-CN'),
          type: 'missing-key', stack: 'spec', file: relFile, page: 'navigation', line: 1,
          key: catKey,
          detail: `Category "${catTitle}" missing from zh-CN`,
        });
      } else if (classifyText(catZh) === 'latin') {
        findings.push({
          id: findingId('zh-latin', 'spec', relFile, catKey),
          type: 'zh-latin', stack: 'spec', file: relFile, page: 'navigation', line: 1,
          key: catKey,
          detail: `Category "${catTitle}" zh-CN renders "${catZh}" (untranslated English)`,
        });
      }

      if (catEn === undefined) {
        findings.push({
          id: findingId('missing-key', 'spec', relFile, catKey + ':en-US'),
          type: 'missing-key', stack: 'spec', file: relFile, page: 'navigation', line: 1,
          key: catKey,
          detail: `Category "${catTitle}" missing from en-US`,
        });
      } else if (classifyText(catEn) === 'cjk') {
        findings.push({
          id: findingId('en-cjk', 'spec', relFile, catKey),
          type: 'en-cjk', stack: 'spec', file: relFile, page: 'navigation', line: 1,
          key: catKey,
          detail: `Category "${catTitle}" en-US renders "${catEn}" (leaked CJK)`,
        });
      }
    }

    for (const item of (cat.items || [])) {
      // 1. Navigation item title
      const navKey = 'navigation.' + item.id;
      const navZh = dictLookup(zhDict, navKey);
      const navEn = dictLookup(enDict, navKey);

      if (navZh === undefined && navEn === undefined) {
        findings.push({
          id: findingId('missing-key', 'spec', relFile, navKey),
          type: 'missing-key', stack: 'spec', file: relFile, page: 'navigation', line: 1,
          key: navKey,
          detail: `Item "${item.id}" title missing from locale dictionaries`,
        });
      } else {
        if (navZh === undefined) {
          findings.push({
            id: findingId('missing-key', 'spec', relFile, navKey + ':zh-CN'),
            type: 'missing-key', stack: 'spec', file: relFile, page: 'navigation', line: 1,
            key: navKey,
            detail: `Item "${item.id}" title missing from zh-CN`,
          });
        } else if (classifyText(navZh) === 'latin') {
          findings.push({
            id: findingId('zh-latin', 'spec', relFile, navKey),
            type: 'zh-latin', stack: 'spec', file: relFile, page: 'navigation', line: 1,
            key: navKey,
            detail: `Item "${item.id}" title zh-CN renders "${navZh}" (untranslated English)`,
          });
        }

        if (navEn === undefined) {
          findings.push({
            id: findingId('missing-key', 'spec', relFile, navKey + ':en-US'),
            type: 'missing-key', stack: 'spec', file: relFile, page: 'navigation', line: 1,
            key: navKey,
            detail: `Item "${item.id}" title missing from en-US`,
          });
        } else if (classifyText(navEn) === 'cjk') {
          findings.push({
            id: findingId('en-cjk', 'spec', relFile, navKey),
            type: 'en-cjk', stack: 'spec', file: relFile, page: 'navigation', line: 1,
            key: navKey,
            detail: `Item "${item.id}" title en-US renders "${navEn}" (leaked CJK)`,
          });
        }
      }

      // 2. Component description (rendered in Search Modal and Sidebar)
      const descKey = 'components.' + item.id + '.description';
      const camelId = item.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const camelDescKey = 'components.' + camelId + '.description';

      const descZh = dictLookup(zhDict, descKey) || dictLookup(zhDict, camelDescKey);
      const descEn = dictLookup(enDict, descKey) || dictLookup(enDict, camelDescKey);

      if (descZh === undefined && descEn === undefined) {
        findings.push({
          id: findingId('missing-key', 'spec', relFile, descKey),
          type: 'missing-key', stack: 'spec', file: relFile, page: 'navigation', line: 1,
          key: descKey,
          detail: `Description for "${item.id}" missing from locale dictionaries (leaks raw text in search dialog)`,
        });
      } else {
        if (descZh === undefined) {
          findings.push({
            id: findingId('missing-key', 'spec', relFile, descKey + ':zh-CN'),
            type: 'missing-key', stack: 'spec', file: relFile, page: 'navigation', line: 1,
            key: descKey,
            detail: `Description for "${item.id}" missing from zh-CN (fallback would leak English in search dialog)`,
          });
        } else if (classifyText(descZh) === 'latin') {
          findings.push({
            id: findingId('zh-latin', 'spec', relFile, descKey),
            type: 'zh-latin', stack: 'spec', file: relFile, page: 'navigation', line: 1,
            key: descKey,
            detail: `Description for "${item.id}" zh-CN renders "${descZh}" (untranslated English in search dialog)`,
          });
        }

        if (descEn === undefined) {
          findings.push({
            id: findingId('missing-key', 'spec', relFile, descKey + ':en-US'),
            type: 'missing-key', stack: 'spec', file: relFile, page: 'navigation', line: 1,
            key: descKey,
            detail: `Description for "${item.id}" missing from en-US`,
          });
        } else if (classifyText(descEn) === 'cjk') {
          findings.push({
            id: findingId('en-cjk', 'spec', relFile, descKey),
            type: 'en-cjk', stack: 'spec', file: relFile, page: 'navigation', line: 1,
            key: descKey,
            detail: `Description for "${item.id}" en-US renders "${descEn}" (leaked CJK)`,
          });
        }
      }
    }
  }

  return findings;
}

export function analyzeI18nCoverage() {
  const zhDict = loadLocale('zh-CN');
  const enDict = loadLocale('en-US');

  const reactFiles = [
    ...walk(REACT_SRC, ['.tsx', '.ts']),
    ...walk(REACT_LIB_SRC, ['.tsx']),
  ];
  const qtFiles = walk(QT_SRC, ['.qml']);

  const findings = [];
  const files = [];

  const processFile = (absPath, stack, scanFn) => {
    const content = readFileSync(absPath, 'utf8');
    const { i18nCalls, hardcoded, bannedQsTr } = scanFn(content);
    const relFile = relative(root, absPath).replace(/\\/g, '/');
    const page = basename(absPath).replace(/\.(tsx|ts|qml)$/, '');

    const perFile = {
      stack, file: relFile, page,
      i18nCalls: i18nCalls.length,
      hardcoded: hardcoded.length,
      missing: 0, zhLatin: 0, enCjk: 0,
    };

    if (bannedQsTr && bannedQsTr.length > 0) {
      for (const b of bannedQsTr) {
        const line = lineOf(content, b.index);
        findings.push({
          id: findingId('banned-qstr', stack, relFile, `qstr:${line}`),
          type: 'banned-qstr', stack, file: relFile, page, line,
          detail: 'Forbidden qsTr() detected; use ChaSetI18n.tr() instead',
        });
      }
    }

    for (const call of i18nCalls) {
      if (call.key.endsWith('.')) continue;
      const line = lineOf(content, call.index);

      if (call.defaultText && CJK_RE.test(call.defaultText)) {
        findings.push({
          id: findingId('cjk-fallback', stack, relFile, `${call.key}:${line}`),
          type: 'cjk-fallback', stack, file: relFile, page, line,
          key: call.key,
          detail: `defaultText contains CJK: "${String(call.defaultText).slice(0, 60)}"`,
        });
      }

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

  // ---- Audit showcase navigation & search dataset (spec/showcase/navigation.json) ----
  const navPath = resolve(root, 'spec', 'showcase', 'navigation.json');
  if (existsSync(navPath)) {
    const nav = JSON.parse(readFileSync(navPath, 'utf8'));
    const navFindings = auditNavigationItems(nav, zhDict, enDict);
    findings.push(...navFindings);

    const navFileEntry = {
      stack: 'spec', file: 'spec/showcase/navigation.json', page: 'NavigationDataset',
      i18nCalls: nav.reduce((acc, c) => acc + 1 + (c.items ? c.items.length * 2 : 0), 0),
      hardcoded: 0,
      missing: navFindings.filter(f => f.type === 'missing-key').length,
      zhLatin: navFindings.filter(f => f.type === 'zh-latin').length,
      enCjk: navFindings.filter(f => f.type === 'en-cjk').length,
    };
    const flaggedCalls = navFileEntry.missing + navFileEntry.zhLatin + navFileEntry.enCjk;
    navFileEntry.coverage = navFileEntry.i18nCalls > 0 ? 1 - flaggedCalls / navFileEntry.i18nCalls : 1;
    files.push(navFileEntry);
  }

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
  // 1. Zero tolerance for missing keys: missing keys must NEVER exist or be masked by baseline!
  const missingKeys = findings.filter(f => f.type === 'missing-key');
  for (const f of missingKeys) {
    errors.push(`MISSING KEY [${f.stack}] ${f.file}:${f.line} — key "${f.key}" absent from locale dictionaries (${f.detail})`);
  }
  if (missingKeys.length > 0) {
    errors.push(`Zero-Tolerance Gate Failure: ${missingKeys.length} missing dictionary key(s) detected. Missing keys can never be ratcheted.`);
  }

  // 2. Zero tolerance for banned qsTr() in QML (must use ChaSetI18n.tr)
  const bannedQsTr = findings.filter(f => f.type === 'banned-qstr');
  for (const f of bannedQsTr) {
    errors.push(`BANNED qsTr [${f.stack}] ${f.file}:${f.line} — ${f.detail}`);
  }
  if (bannedQsTr.length > 0) {
    errors.push(`Zero-Tolerance Gate Failure: ${bannedQsTr.length} forbidden qsTr() call(s) detected. Must use ChaSetI18n.tr().`);
  }

  // 3. Zero tolerance for CJK defaultText in code (fallbacks in code must be English)
  const cjkFallbacks = findings.filter(f => f.type === 'cjk-fallback');
  for (const f of cjkFallbacks) {
    errors.push(`CJK FALLBACK [${f.stack}] ${f.file}:${f.line} — key "${f.key}" ${f.detail}. Fallbacks in code must be English.`);
  }
  if (cjkFallbacks.length > 0) {
    errors.push(`Zero-Tolerance Gate Failure: ${cjkFallbacks.length} CJK code fallback(s) detected. Code defaultText must be English.`);
  }

  // 4. Zero tolerance for zh-latin (untranslated English in zh-CN) and en-cjk (leaked CJK in en-US)
  const zhLatin = findings.filter(f => f.type === 'zh-latin');
  for (const f of zhLatin) {
    errors.push(`ZH-LATIN [${f.stack}] ${f.file}:${f.line} — key "${f.key}" ${f.detail}`);
  }
  if (zhLatin.length > 0) {
    errors.push(`Zero-Tolerance Gate Failure: ${zhLatin.length} untranslated English string(s) in zh-CN.`);
  }

  const enCjk = findings.filter(f => f.type === 'en-cjk');
  for (const f of enCjk) {
    errors.push(`EN-CJK [${f.stack}] ${f.file}:${f.line} — key "${f.key}" ${f.detail}`);
  }
  if (enCjk.length > 0) {
    errors.push(`Zero-Tolerance Gate Failure: ${enCjk.length} CJK leak(s) in en-US.`);
  }

  // 3. Ratchet baseline applies exclusively to legacy hardcoded JSX/prop strings backlog
  const hardcodedFindings = findings.filter(f => f.type === 'hardcoded');
  const currentHardcodedIds = new Set(hardcodedFindings.map(f => f.id));

  let baseline = loadBaseline();
  if (!baseline || updateBaseline) {
    baseline = {
      version: 1,
      generatedAt: new Date().toISOString(),
      totalFindings: hardcodedFindings.length,
      ids: hardcodedFindings.map(f => f.id).sort(),
    };
    writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2) + '\n', 'utf8');
    warnings.push(`ratchet baseline (re)written: ${BASELINE_PATH} (${hardcodedFindings.length} hardcoded findings)`);
    // A fresh baseline equals the current state by definition — this run is clean.
  }

  const baselineIds = new Set(baseline.ids || []);
  const newOnes = hardcodedFindings.filter(f => !baselineIds.has(f.id));
  const stale = [...baselineIds].filter(id => !currentHardcodedIds.has(id));

  for (const f of newOnes.slice(0, 40)) {
    errors.push(`NEW hardcoded [${f.stack}] ${f.file}:${f.line} — ${f.detail}`);
  }
  if (newOnes.length > 40) {
    errors.push(`... and ${newOnes.length - 40} more new violations`);
  }
  if (newOnes.length > 0) {
    errors.push(`Ratchet: ${newOnes.length} new un-internationalized string(s) not present in the baseline.`);
    errors.push(`Fix the translations, or (only after real translation work) run: just check-i18n --update-baseline`);
  }
  if (stale.length > 0) {
    errors.push(`Stale baseline: ${stale.length} baseline entry(ies) no longer match any current finding — the ratchet may only shrink.`);
    errors.push(`Run: just check-i18n --update-baseline`);
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
          'banned-qstr': findings.filter(f => f.type === 'banned-qstr').length,
          'cjk-fallback': findings.filter(f => f.type === 'cjk-fallback').length,
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

  // searchPlaceholder prop detection
  const searchSnippet = '<Input searchPlaceholder="Search components..." />';
  const searchScan = scanReactContent(searchSnippet);
  if (!searchScan.hardcoded.some(h => h.kind === 'prop:searchPlaceholder')) {
    errors.push('react self-test: searchPlaceholder prop was not detected');
  }

  // Banned qsTr in QML
  const qtBannedSnippet = 'Item { property string s: qsTr("forbidden text") }';
  const qtBannedScan = scanQtContent(qtBannedSnippet);
  if (!qtBannedScan.bannedQsTr || qtBannedScan.bannedQsTr.length !== 1) {
    errors.push('qt self-test: qsTr() was not detected as banned');
  }

  // Navigation & search modal dataset audit self-test
  const mockNav = [
    {
      title: 'Mock Cat',
      items: [
        { id: 'mock-missing', title: 'Mock Missing', desc: 'Mock missing item' },
        { id: 'mock-latin', title: 'Mock Latin', desc: 'Mock latin item' },
      ],
    },
  ];
  const mockZh = {
    categories: { 'Mock Cat': '模拟分类' },
    navigation: { 'mock-latin': '模拟条目' },
    components: { 'mock-latin': { description: 'English prose un-translated in zh' } },
  };
  const mockEn = {
    categories: { 'Mock Cat': 'Mock Cat' },
    navigation: { 'mock-missing': 'Mock Missing', 'mock-latin': 'Mock Latin' },
    components: { 'mock-missing': { description: 'English desc' }, 'mock-latin': { description: 'English desc' } },
  };
  const navAuditFindings = auditNavigationItems(mockNav, mockZh, mockEn);
  if (!navAuditFindings.some(f => f.type === 'missing-key' && f.key === 'navigation.mock-missing')) {
    errors.push('navigation self-test: missing-key not detected for missing nav title in zh-CN');
  }
  if (!navAuditFindings.some(f => f.type === 'zh-latin' && f.key === 'components.mock-latin.description')) {
    errors.push('navigation self-test: zh-latin not detected for English description in zh-CN');
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
