import * as React from 'react';
import { cn } from '../lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../card';
import { Badge } from '../badge';
import { useChaSetI18n } from '../i18n';
import type { LocalePreference, LocaleMetadata } from '../i18n';

export interface LanguageSettingsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  preference?: LocalePreference;
  onPreferenceChange?: (next: LocalePreference) => void;
  showFollowSystem?: boolean;
  variant?: 'card' | 'embedded';
  disabled?: boolean;
  title?: string;
  description?: string;
  textProvider?: (key: string, defaultText?: string, params?: Record<string, string | number>) => string;
}

// Icon primitives (Zero external icon dependencies)
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function MonitorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export const LanguageSettings = React.forwardRef<HTMLDivElement, LanguageSettingsProps>(
  (
    {
      preference: controlledPreference,
      onPreferenceChange,
      showFollowSystem = true,
      variant = 'card',
      disabled = false,
      title,
      description,
      textProvider,
      className,
      ...props
    },
    ref
  ) => {
    const i18n = useChaSetI18n();
    const t = textProvider || i18n.t;

    const currentPreference = controlledPreference !== undefined ? controlledPreference : i18n.preference;

    const handleSelect = (pref: LocalePreference) => {
      if (disabled) return;
      onPreferenceChange?.(pref);
      if (controlledPreference === undefined) {
        i18n.setPreference(pref);
      }
    };

    const isEmbedded = variant === 'embedded';
    const supportedLocales = i18n.supportedLocales;
    const systemLocaleMeta = supportedLocales.find((l) => l.code === i18n.systemLocale) || {
      code: i18n.systemLocale,
      nativeName: i18n.systemLocale,
      englishName: i18n.systemLocale,
    };

    const activeLocaleMeta = supportedLocales.find((l) => l.code === i18n.locale) || {
      code: i18n.locale,
      nativeName: i18n.locale,
      englishName: i18n.locale,
    };

    const currentLabel =
      currentPreference === 'system'
        ? `${t('language.followSystem', 'Follow System')} (${activeLocaleMeta.nativeName})`
        : activeLocaleMeta.nativeName;

    const statusHint =
      currentPreference === 'system'
        ? t('language.systemHint', 'Currently following system, rendering UI in {{language}}', {
            language: activeLocaleMeta.nativeName,
          })
        : t('language.fixedHint', 'Currently fixed to {{language}}, ignoring system language changes', {
            language: activeLocaleMeta.nativeName,
          });

    const content = (
      <div className="space-y-4">
        {/* Follow System Section */}
        {showFollowSystem && (
          <button
            type="button"
            role="radio"
            aria-checked={currentPreference === 'system'}
            disabled={disabled}
            onClick={() => handleSelect('system')}
            className={cn(
              'group relative flex w-full items-center gap-3 rounded-lg border border-border/80 bg-background/50 p-3.5 text-left transition-all',
              'hover:border-border hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
              currentPreference === 'system' &&
                'border-primary/40 bg-primary/5 shadow-xs ring-1 ring-primary/25'
            )}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
              <MonitorIcon className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-foreground">
                {t('language.followSystem', 'Follow System')}
              </span>
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                {t('language.systemDetected', 'System detected')} · {systemLocaleMeta.nativeName}
              </span>
              <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">
                {t('language.followSystemDesc', 'Automatically matches your system language if supported, otherwise defaults to English')}
              </span>
            </span>
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full border transition-all',
                currentPreference === 'system'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background'
              )}
            >
              {currentPreference === 'system' && <CheckIcon className="size-3" />}
            </span>
          </button>
        )}

        {/* Section Label */}
        <div className="pt-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
            {t('language.fixedNotice', 'Fixed Languages')}
          </span>
        </div>

        {/* Fixed Languages Grid */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3" role="radiogroup">
          {supportedLocales.map((loc: LocaleMetadata) => {
            const isSelected = currentPreference === loc.code;
            return (
              <button
                key={loc.code}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={disabled}
                onClick={() => handleSelect(loc.code)}
                className={cn(
                  'group flex min-h-[7.5rem] flex-col justify-between rounded-lg border border-border/80 bg-background/50 p-3.5 text-left transition-all',
                  'hover:border-border hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                  isSelected && 'border-primary/40 bg-primary/5 shadow-xs ring-1 ring-primary/25'
                )}
              >
                <span className="flex items-start justify-between gap-3 w-full">
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground tracking-tight">
                      {loc.nativeName}
                    </span>
                    <span className="mt-0.5 block font-mono text-[0.6875rem] text-muted-foreground">
                      {loc.code}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'flex size-5 shrink-0 items-center justify-center rounded-full border transition-all',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background'
                    )}
                  >
                    {isSelected && <CheckIcon className="size-3" />}
                  </span>
                </span>

                {loc.quote && (
                  <span className="mt-3 block border-t border-border/40 pt-2" aria-hidden="true">
                    <span className="block truncate text-xs italic text-foreground/80">
                      &ldquo;{loc.quote.text}&rdquo;
                    </span>
                    <span className="mt-0.5 block truncate text-[0.6875rem] text-muted-foreground">
                      — {loc.quote.author}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Hint */}
        <p className="text-xs leading-relaxed text-muted-foreground pt-1">
          {statusHint}
        </p>
      </div>
    );

    if (isEmbedded) {
      return (
        <div
          ref={ref}
          data-slot="language-settings"
          data-variant="embedded"
          className={cn('w-full text-foreground', disabled && 'opacity-60 pointer-events-none', className)}
          {...props}
        >
          {content}
        </div>
      );
    }

    return (
      <Card
        ref={ref}
        id="language"
        data-slot="language-settings"
        data-variant="card"
        className={cn('w-full text-foreground', disabled && 'opacity-60 pointer-events-none', className)}
        {...props}
      >
        <CardHeader className="border-b border-border/70 pb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
                <GlobeIcon className="size-5" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base font-semibold text-foreground tracking-tight">
                  {title || t('language.title', 'Language Preference')}
                </CardTitle>
                <CardDescription className="mt-1 text-xs text-muted-foreground">
                  {description || t('language.desc', 'Switch UI display language with instant effect and system language detection.')}
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" size="sm" className="shrink-0 bg-muted/60 text-muted-foreground font-medium">
              {currentLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-5">{content}</CardContent>
      </Card>
    );
  }
);

LanguageSettings.displayName = 'LanguageSettings';
