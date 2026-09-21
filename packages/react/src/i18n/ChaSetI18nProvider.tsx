// packages/react/src/i18n/ChaSetI18nProvider.tsx
import * as React from 'react';
import { registry } from './registry';
import { ChaSetI18nContext } from './useChaSetI18n';
import type { I18nContextValue, LocalePreference } from './types';

export interface ChaSetI18nProviderProps {
  children: React.ReactNode;
  initialPreference?: LocalePreference;
}

export function ChaSetI18nProvider({
  children,
  initialPreference,
}: ChaSetI18nProviderProps) {
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    if (initialPreference !== undefined) {
      registry.setPreference(initialPreference);
    }
  }, [initialPreference]);

  React.useEffect(() => {
    return registry.subscribe(() => {
      setTick((t) => t + 1);
    });
  }, []);

  const value: I18nContextValue = React.useMemo(() => {
    return {
      locale: registry.getResolvedLocale(),
      preference: registry.getPreference(),
      systemLocale: registry.getSystemLocale(),
      supportedLocales: registry.getSupportedLocales(),
      setPreference: (pref) => registry.setPreference(pref),
      t: (key, defaultText, params) => registry.t(key, defaultText, params),
    };
  }, [registry.getPreference(), registry.getResolvedLocale()]);

  return (
    <ChaSetI18nContext.Provider value={value}>
      {children}
    </ChaSetI18nContext.Provider>
  );
}
