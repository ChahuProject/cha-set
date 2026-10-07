import { useEffect, useState } from 'react';
import { CheckIcon, useChaSetI18n } from '@chahu/cha-set';

const TOKENS = [
  'background',
  'foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'card',
  'popover',
];

export default function ColorsSection({ themeKey }: { themeKey: string }) {
  const { t } = useChaSetI18n();
  const [values, setValues] = useState<Record<string, string>>({});
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const next: Record<string, string> = {};
    for (const tok of TOKENS) next[tok] = cs.getPropertyValue(`--${tok}`).trim();
    setValues(next);
  }, [themeKey]);

  const copyTokenValue = async (token: string, value: string) => {
    try {
      await navigator.clipboard.writeText(`var(--${token}) /* ${value} */`);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 1500);
    } catch {
      // Fallback
    }
  };

  return (
    <section className="block" id="colors">
      <div className="block-header">
        <div>
          <h2>{t('getStarted.tokens.palette.title', 'Palette · Semantic Core Tokens')}</h2>
          <p className="desc">
            {t('getStarted.tokens.palette.desc', 'All derived from spec/tokens.json. Click any swatch to copy its CSS variable expression.')}
          </p>
        </div>
      </div>
      <div className="swatch-grid">
        {TOKENS.map((tok) => (
          <div
            className="swatch clickable"
            key={tok}
            onClick={() => copyTokenValue(tok, values[tok] || '')}
            title={t('getStarted.tokens.palette.copySwatchTitle', 'Click to copy CSS variable')}
          >
            <div className="swatch-color" style={{ background: `var(--${tok})` }}>
              {copiedToken === tok && (
                <span className="swatch-copied-badge inline-flex items-center gap-1">
                  <CheckIcon className="size-3" /> {t('common.copied', 'Copied')}
                </span>
              )}
            </div>
            <div className="swatch-meta">
              <div className="swatch-name">--{tok}</div>
              <div className="swatch-value">{values[tok] || '…'}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
