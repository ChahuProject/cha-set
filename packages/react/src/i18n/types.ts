// packages/react/src/i18n/types.ts
export type LocaleCode = string;

export interface LocaleQuote {
  text: string;
  author: string;
}

export interface LocaleMetadata {
  code: LocaleCode;
  nativeName: string;
  englishName: string;
  matches?: string[];
  quote?: LocaleQuote;
}

export type LocalePreference = 'system' | LocaleCode;

export type TranslationDictionary = Record<string, any>;

export interface I18nContextValue {
  locale: LocaleCode;
  preference: LocalePreference;
  systemLocale: LocaleCode;
  supportedLocales: LocaleMetadata[];
  setPreference: (pref: LocalePreference) => void;
  t: (key: string, defaultText?: string, params?: Record<string, string | number>) => string;
}
