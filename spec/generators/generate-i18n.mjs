// spec/generators/generate-i18n.mjs — Emits typed i18n dictionaries for React & Qt
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..', '..');
const i18nDir = path.resolve(repoRoot, 'spec', 'i18n');

const meta = JSON.parse(fs.readFileSync(path.join(i18nDir, 'meta.json'), 'utf8'));
const zhCN = JSON.parse(fs.readFileSync(path.join(i18nDir, 'locales', 'zh-CN.json'), 'utf8'));
const enUS = JSON.parse(fs.readFileSync(path.join(i18nDir, 'locales', 'en-US.json'), 'utf8'));

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
import QtQuick 6.10

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
