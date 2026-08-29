import { useEffect, useState } from 'react';

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
  const [values, setValues] = useState<Record<string, string>>({});
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const next: Record<string, string> = {};
    for (const t of TOKENS) next[t] = cs.getPropertyValue(`--${t}`).trim();
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
          <h2>Palette · Semantic Core Tokens</h2>
          <p className="desc">
            All derived from <code>spec/tokens.json</code>. Click any swatch to copy its CSS variable expression.
          </p>
        </div>
      </div>
      <div className="swatch-grid">
        {TOKENS.map((t) => (
          <div
            className="swatch clickable"
            key={t}
            onClick={() => copyTokenValue(t, values[t] || '')}
            title="Click to copy CSS variable"
          >
            <div className="swatch-color" style={{ background: `var(--${t})` }}>
              {copiedToken === t && <span className="swatch-copied-badge">✓ Copied</span>}
            </div>
            <div className="swatch-meta">
              <div className="swatch-name">--{t}</div>
              <div className="swatch-value">{values[t] || '…'}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
