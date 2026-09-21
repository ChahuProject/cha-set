// packages/react/src/i18n/useChaSetI18n.ts
import * as React from 'react';
import { registry } from './registry';
import type { I18nContextValue } from './types';

export const ChaSetI18nContext = React.createContext<I18nContextValue | null>(null);

export function useChaSetI18n(): I18nContextValue {
  const context = React.useContext(ChaSetI18nContext);

  // If outside a Provider, bind directly to the registry singleton with local reactive state
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    if (context) return;
    return registry.subscribe(() => {
      setTick((t) => t + 1);
    });
  }, [context]);

  if (context) {
    return context;
  }

  return {
    locale: registry.getResolvedLocale(),
    preference: registry.getPreference(),
    systemLocale: registry.getSystemLocale(),
    supportedLocales: registry.getSupportedLocales(),
    setPreference: (pref) => registry.setPreference(pref),
    t: (key, defaultText, params) => registry.t(key, defaultText, params),
  };
}
