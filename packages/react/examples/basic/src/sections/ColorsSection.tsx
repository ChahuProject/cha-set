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
  'hover',
];

export default function ColorsSection({ themeKey }: { themeKey: string }) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const next: Record<string, string> = {};
    for (const t of TOKENS) next[t] = cs.getPropertyValue(`--cs-${t}`).trim();
    setValues(next);
  }, [themeKey]);

  return (
    <section className="block" id="colors">
      <h2>色板 · Semantic tokens</h2>
      <p className="desc">
        全部来自 spec/tokens.json（launcher preset），经 <code>--cs-*</code>{' '}
        暴露；右上角切换明暗与强调色即时生效。
      </p>
      <div className="swatch-grid">
        {TOKENS.map((t) => (
          <div className="swatch" key={t}>
            <div className="swatch-color" style={{ background: `var(--cs-${t})` }} />
            <div className="swatch-meta">
              <div className="swatch-name">--cs-{t}</div>
              <div className="swatch-value">{values[t] || '…'}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
