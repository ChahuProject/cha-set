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

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const next: Record<string, string> = {};
    for (const t of TOKENS) next[t] = cs.getPropertyValue(`--${t}`).trim();
    setValues(next);
  }, [themeKey]);

  return (
    <section className="block" id="colors">
      <h2>Palette · Semantic tokens</h2>
      <p className="desc">
        All from spec/tokens.json (launcher preset), exposed with shadcn standard names (no prefix); toggle
        light/dark and accent at top-right to take effect instantly.
      </p>
      <div className="swatch-grid">
        {TOKENS.map((t) => (
          <div className="swatch" key={t}>
            <div className="swatch-color" style={{ background: `var(--${t})` }} />
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
