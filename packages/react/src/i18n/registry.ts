// packages/react/src/i18n/registry.ts
import { I18N_META, BUILTIN_LOCALES } from './locales.generated';
import type { LocaleCode, LocaleMetadata, LocalePreference, TranslationDictionary } from './types';

function deepMerge(target: any, source: any): any {
  if (!source || typeof source !== 'object') return target;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      result[key] &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

class I18nRegistry {
  private defaultLocale: LocaleCode = I18N_META.defaultLocale;
  private fallbackLocale: LocaleCode = I18N_META.fallbackLocale;
  private storageKey: string = I18N_META.storageKey;
  private localesMeta: Map<LocaleCode, LocaleMetadata> = new Map();
  private dictionaries: Map<LocaleCode, TranslationDictionary> = new Map();
  private preference: LocalePreference = 'system';
  private listeners: Set<() => void> = new Set();
  private customResolver: ((key: string, defaultText?: string) => string | undefined) | null = null;

  constructor() {
    // 1. Seed built-in locale metadata
    for (const [code, meta] of Object.entries(I18N_META.locales)) {
      this.localesMeta.set(code, meta);
    }
    // 2. Seed built-in dictionaries
    for (const [code, dict] of Object.entries(BUILTIN_LOCALES)) {
      this.dictionaries.set(code, dict);
    }
    // 3. Load initial preference
    this.loadPersistedPreference();
  }

  private loadPersistedPreference() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = window.localStorage.getItem(this.storageKey);
        if (stored) {
          if (stored === 'system' || this.localesMeta.has(stored)) {
            this.preference = stored as LocalePreference;
            return;
          }
        }
      } catch {
        // ignore localStorage access failure
      }
    }
    this.preference = 'system';
  }

  public registerLocale(metadata: LocaleMetadata, messages: TranslationDictionary): void {
    this.localesMeta.set(metadata.code, metadata);
    const existing = this.dictionaries.get(metadata.code) || {};
    this.dictionaries.set(metadata.code, deepMerge(existing, messages));
    this.notify();
  }

  public extendLocale(code: LocaleCode, messages: TranslationDictionary): void {
    const existing = this.dictionaries.get(code) || {};
    this.dictionaries.set(code, deepMerge(existing, messages));
    this.notify();
  }

  public setCustomResolver(resolver: ((key: string, defaultText?: string) => string | undefined) | null): void {
    this.customResolver = resolver;
    this.notify();
  }

  public setPreference(pref: LocalePreference): void {
    this.preference = pref;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        if (pref === 'system') {
          window.localStorage.removeItem(this.storageKey);
        } else {
          window.localStorage.setItem(this.storageKey, pref);
        }
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  public getPreference(): LocalePreference {
    return this.preference;
  }

  public getSystemLocale(): LocaleCode {
    if (typeof navigator === 'undefined') return this.defaultLocale;
    const candidates = [navigator.language, ...(navigator.languages || [])].filter(Boolean);

    for (const lang of candidates) {
      const norm = lang.trim().replace('_', '-');
      const lower = norm.toLowerCase();
      // Direct match
      for (const [code, meta] of this.localesMeta.entries()) {
        if (code.toLowerCase() === lower) return code;
        if (meta.matches?.some(m => m.toLowerCase() === lower)) return code;
      }
      // Prefix match (e.g. "zh" matching "zh-CN")
      const langPrefix = lower.split('-')[0];
      if (langPrefix) {
        for (const [code, meta] of this.localesMeta.entries()) {
          if (code.toLowerCase().startsWith(langPrefix)) return code;
          if (meta.matches?.some(m => m.toLowerCase() === langPrefix)) return code;
        }
      }
    }

    return this.defaultLocale;
  }

  public getResolvedLocale(): LocaleCode {
    if (this.preference === 'system') {
      const sys = this.getSystemLocale();
      return this.localesMeta.has(sys) ? sys : this.defaultLocale;
    }
    return this.localesMeta.has(this.preference) ? this.preference : this.defaultLocale;
  }

  public getSupportedLocales(): LocaleMetadata[] {
    return Array.from(this.localesMeta.values());
  }

  public t(key: string, defaultText?: string, params?: Record<string, string | number>): string {
    if (this.customResolver) {
      const custom = this.customResolver(key, defaultText);
      if (custom !== undefined && custom !== null && custom !== '') {
        return this.interpolate(custom, params);
      }
    }

    const resolvedLocale = this.getResolvedLocale();
    let template = this.lookup(resolvedLocale, key);

    // Fall back to defaultLocale
    if (template === undefined && resolvedLocale !== this.defaultLocale) {
      template = this.lookup(this.defaultLocale, key);
    }
    // Fall back to fallbackLocale
    if (template === undefined && resolvedLocale !== this.fallbackLocale) {
      template = this.lookup(this.fallbackLocale, key);
    }

    const raw = template !== undefined ? template : (defaultText !== undefined ? defaultText : key);
    return this.interpolate(raw, params);
  }

  private lookup(locale: LocaleCode, key: string): string | undefined {
    const dict = this.dictionaries.get(locale);
    if (!dict) return undefined;

    const parts = key.split('.');
    let cur: any = dict;
    for (const part of parts) {
      if (cur === undefined || cur === null || typeof cur !== 'object') return undefined;
      cur = cur[part];
    }
    return typeof cur === 'string' ? cur : undefined;
  }

  private interpolate(str: string, params?: Record<string, string | number>): string {
    if (!params || !str) return str;
    return str.replace(/\{\{\s*([^}\s]+)\s*\}\}/g, (_, varName) => {
      const val = params[varName];
      return val !== undefined ? String(val) : `{{${varName}}}`;
    });
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }
}

export const registry = new I18nRegistry();

export const registerLocale = registry.registerLocale.bind(registry);
export const extendLocale = registry.extendLocale.bind(registry);
export const setLocalePreference = registry.setPreference.bind(registry);
export const getLocalePreference = registry.getPreference.bind(registry);
export const getResolvedLocale = registry.getResolvedLocale.bind(registry);
export const getSystemLocale = registry.getSystemLocale.bind(registry);
export const getSupportedLocales = registry.getSupportedLocales.bind(registry);
export const t = registry.t.bind(registry);
