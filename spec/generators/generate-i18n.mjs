// spec/generators/generate-i18n.mjs — Emits typed i18n dictionaries for React & Qt
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..', '..');
const i18nDir = path.resolve(repoRoot, 'spec', 'i18n');

const meta = JSON.parse(fs.readFileSync(path.join(i18nDir, 'meta.json'), 'utf8'));

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
  const mainFile = path.join(i18nDir, 'locales', `${code}.json`);
  let data = fs.existsSync(mainFile) ? JSON.parse(fs.readFileSync(mainFile, 'utf8')) : {};
  const subDir = path.join(i18nDir, 'locales', code);
  if (fs.existsSync(subDir) && fs.statSync(subDir).isDirectory()) {
    const files = fs.readdirSync(subDir).filter(f => f.endsWith('.json')).sort();
    for (const f of files) {
      const part = JSON.parse(fs.readFileSync(path.join(subDir, f), 'utf8'));
      data = deepMerge(data, part);
    }
  }
  return data;
}

const zhCN = loadLocale('zh-CN');
const enUS = loadLocale('en-US');

// 1. Validate Parity between Locales
const interpolationRegex = /\{\{\s*([^}\s]+)\s*\}\}/g;

function extractVars(str) {
  return [...str.matchAll(interpolationRegex)].map(m => m[1]).sort();
}

function compareTrees(base, curr, prefix, errors) {
  if (typeof base === 'string') {
    if (typeof curr !== 'string') {
      errors.push(`${prefix.join('.')}: type mismatch, expected string`);
      return;
    }
    const baseVars = extractVars(base);
    const currVars = extractVars(curr);
    if (baseVars.join('|') !== currVars.join('|')) {
      errors.push(`${prefix.join('.')}: interpolation vars mismatch: [${baseVars.join(', ')}] vs [${currVars.join(', ')}]`);
    }
    return;
  }

  if (typeof base !== 'object' || base === null) return;
  if (typeof curr !== 'object' || curr === null) {
    errors.push(`${prefix.join('.')}: type mismatch, expected object`);
    return;
  }

  const baseKeys = Object.keys(base);
  const currKeys = new Set(Object.keys(curr));

  for (const k of baseKeys) {
    if (!(k in curr)) {
      errors.push(`${[...prefix, k].join('.')}: missing key in target locale`);
      continue;
    }
    currKeys.delete(k);
    compareTrees(base[k], curr[k], [...prefix, k], errors);
  }

  for (const k of currKeys) {
    errors.push(`${[...prefix, k].join('.')}: extraneous key in target locale`);
  }
}

const parityErrors = [];
compareTrees(zhCN, enUS, ['en-US'], parityErrors);
if (parityErrors.length > 0) {
  console.error(`[gen:i18n] FAIL: Parity errors between zh-CN and en-US:\n${parityErrors.join('\n')}`);
  process.exit(1);
}

// 1b. Validate Showcase Navigation & Search i18n Completeness
const navPath = path.resolve(repoRoot, 'spec', 'showcase', 'navigation.json');
if (fs.existsSync(navPath)) {
  const nav = JSON.parse(fs.readFileSync(navPath, 'utf8'));
  const CJK_RE = /[\u3400-\u4dbf\u4e00-\u9fff]/;
  const navErrors = [];

  function getVal(obj, keyPath) {
    const parts = keyPath.split('.');
    let cur = obj;
    for (const p of parts) {
      if (cur == null || typeof cur !== 'object') return undefined;
      cur = cur[p];
    }
    return cur;
  }

  for (const cat of nav) {
    const catZh = getVal(zhCN, 'categories.' + cat.title) || getVal(zhCN, 'showcase.categories.' + cat.title);
    const catEn = getVal(enUS, 'categories.' + cat.title) || getVal(enUS, 'showcase.categories.' + cat.title);
    if (!catZh || !CJK_RE.test(catZh)) navErrors.push(`Category "${cat.title}": missing or invalid CJK in zh-CN`);
    if (!catEn || CJK_RE.test(catEn)) navErrors.push(`Category "${cat.title}": missing or leaked CJK in en-US`);

    for (const item of cat.items) {
      const titleZh = getVal(zhCN, 'navigation.' + item.id);
      const titleEn = getVal(enUS, 'navigation.' + item.id);
      if (!titleZh || !CJK_RE.test(titleZh)) navErrors.push(`Item "${item.id}" title: missing or invalid CJK in zh-CN`);
      if (!titleEn || CJK_RE.test(titleEn)) navErrors.push(`Item "${item.id}" title: missing or leaked CJK in en-US`);

      const camelId = item.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const descZh = getVal(zhCN, 'components.' + item.id + '.description') || getVal(zhCN, 'components.' + camelId + '.description');
      const descEn = getVal(enUS, 'components.' + item.id + '.description') || getVal(enUS, 'components.' + camelId + '.description');

      if (!descZh || !CJK_RE.test(descZh)) navErrors.push(`Item "${item.id}" description: missing or invalid CJK in zh-CN`);
      if (!descEn || CJK_RE.test(descEn)) navErrors.push(`Item "${item.id}" description: missing or leaked CJK in en-US`);
    }
  }

  if (navErrors.length > 0) {
    console.error(`[gen:i18n] FAIL: Showcase navigation i18n errors:\n${navErrors.join('\n')}`);
    process.exit(1);
  }
}

// 2. React Output
const reactOutDir = path.resolve(repoRoot, 'packages', 'react', 'src', 'i18n');
if (!fs.existsSync(reactOutDir)) fs.mkdirSync(reactOutDir, { recursive: true });

const reactCode = `// GENERATED FILE - DO NOT EDIT.
// Source: spec/i18n/* via spec/generators/generate-i18n.mjs

export interface LocaleQuote {
  text: string;
  author: string;
}

export interface LocaleMetadata {
  code: string;
  nativeName: string;
  englishName: string;
  matches: string[];
  quote: LocaleQuote;
}

export interface LocaleMetaConfig {
  defaultLocale: string;
  fallbackLocale: string;
  storageKey: string;
  locales: Record<string, LocaleMetadata>;
  namespaces: string[];
}

export const I18N_META: LocaleMetaConfig = ${JSON.stringify(meta, null, 2)};

export const BUILTIN_LOCALES: Record<string, any> = {
  'zh-CN': ${JSON.stringify(zhCN, null, 2)},
  'en-US': ${JSON.stringify(enUS, null, 2)},
};
`;

fs.writeFileSync(path.join(reactOutDir, 'locales.generated.ts'), reactCode, 'utf8');

// 3. Qt Output
const qtOutDir = path.resolve(repoRoot, 'qt', 'src');
const qtQml = `pragma Singleton
import QtQuick

// GENERATED FILE - DO NOT EDIT.
// Source: spec/i18n/* via spec/generators/generate-i18n.mjs
QtObject {
    id: root

    readonly property var meta: ${JSON.stringify(meta)}
    readonly property var builtinLocales: ({
        "zh-CN": ${JSON.stringify(zhCN)},
        "en-US": ${JSON.stringify(enUS)}
    })
}
`;

fs.writeFileSync(path.join(qtOutDir, 'ChaSetI18nData.generated.qml'), qtQml, 'utf8');

console.log('[gen:i18n] Emitted locales.generated.ts and ChaSetI18nData.generated.qml (100% parity verified)');
