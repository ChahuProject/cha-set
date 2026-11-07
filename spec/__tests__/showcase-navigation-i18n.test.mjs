// spec/__tests__/showcase-navigation-i18n.test.mjs — Asserts 100% i18n coverage for showcase navigation & search
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..', '..');
const i18nDir = path.resolve(repoRoot, 'spec', 'i18n');
const navPath = path.resolve(repoRoot, 'spec', 'showcase', 'navigation.json');

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
      data = deepMerge(data, JSON.parse(fs.readFileSync(path.join(subDir, f), 'utf8')));
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

const CJK_RE = /[\u3400-\u4dbf\u4e00-\u9fff]/;

describe('Showcase Navigation & Command Search i18n Coverage', () => {
  const nav = JSON.parse(fs.readFileSync(navPath, 'utf8'));
  const zhCN = loadLocale('zh-CN');
  const enUS = loadLocale('en-US');

  it('all categories must have localized titles in zh-CN and en-US', () => {
    for (const cat of nav) {
      const catZh = dictLookup(zhCN, 'categories.' + cat.title) || dictLookup(zhCN, 'showcase.categories.' + cat.title);
      const catEn = dictLookup(enUS, 'categories.' + cat.title) || dictLookup(enUS, 'showcase.categories.' + cat.title);

      expect(catZh, `Category "${cat.title}" missing in zh-CN`).toBeDefined();
      expect(CJK_RE.test(catZh), `Category "${cat.title}" zh-CN "${catZh}" must contain CJK`).toBe(true);

      expect(catEn, `Category "${cat.title}" missing in en-US`).toBeDefined();
      expect(CJK_RE.test(catEn), `Category "${cat.title}" en-US "${catEn}" must not contain CJK`).toBe(false);
    }
  });

  it('all navigation items must have localized titles in zh-CN and en-US', () => {
    for (const cat of nav) {
      for (const item of cat.items) {
        const titleZh = dictLookup(zhCN, 'navigation.' + item.id);
        const titleEn = dictLookup(enUS, 'navigation.' + item.id);

        expect(titleZh, `Item "${item.id}" title missing in zh-CN (key: navigation.${item.id})`).toBeDefined();
        expect(CJK_RE.test(titleZh), `Item "${item.id}" title zh-CN "${titleZh}" must contain CJK`).toBe(true);

        expect(titleEn, `Item "${item.id}" title missing in en-US (key: navigation.${item.id})`).toBeDefined();
        expect(CJK_RE.test(titleEn), `Item "${item.id}" title en-US "${titleEn}" must not contain CJK`).toBe(false);
      }
    }
  });

  it('all navigation items must have localized descriptions in zh-CN and en-US (prevent search box English leaks)', () => {
    for (const cat of nav) {
      for (const item of cat.items) {
        const camel = item.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        const descZh = dictLookup(zhCN, 'components.' + item.id + '.description') || dictLookup(zhCN, 'components.' + camel + '.description');
        const descEn = dictLookup(enUS, 'components.' + item.id + '.description') || dictLookup(enUS, 'components.' + camel + '.description');

        expect(descZh, `Item "${item.id}" description missing in zh-CN (key: components.${item.id}.description)`).toBeDefined();
        expect(CJK_RE.test(descZh), `Item "${item.id}" description zh-CN "${descZh}" must contain CJK`).toBe(true);

        expect(descEn, `Item "${item.id}" description missing in en-US (key: components.${item.id}.description)`).toBeDefined();
        expect(CJK_RE.test(descEn), `Item "${item.id}" description en-US "${descEn}" must not contain CJK`).toBe(false);
      }
    }
  });

  it('specifically verifies adaptive-popup, filter-popup, and shortcut-bar descriptions are translated in Chinese', () => {
    expect(dictLookup(zhCN, 'components.adaptive-popup.description')).toBe('内容驱动的自适应高度弹窗原语，具备宿主空间封顶与头/体/尾三段式布局，绝不误出多余滚动条。');
    expect(dictLookup(zhCN, 'components.filter-popup.description')).toBe('多维分面筛选弹窗组件，支持实时拼音搜索、排除过滤、星级评分与快捷键提示。');
    expect(dictLookup(zhCN, 'components.shortcut-bar.description')).toBe('交互式多阶段响应式快捷键状态栏，在容器变窄时自动推进完整文字、紧凑符号、折叠徽章抽屉与小键盘图标形态。');
  });
});
