import { useState } from 'react';
import { Button } from '@chahu/cha-set';

const VARIANTS = ['primary', 'secondary', 'ghost', 'destructive'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

export default function ButtonSection() {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const push = (msg: string) => setLog((l) => [msg, ...l].slice(0, 5));

  return (
    <section className="block" id="button">
      <h2>Components · Button</h2>
      <p className="desc">
        Contract: spec/components/button.ts — variant × size × loading / disabled /
        fullWidth; keyboard Tab focus then Enter / Space to operate.
      </p>

      {VARIANTS.map((v) => (
        <div className="matrix-row" key={v}>
          <span className="matrix-label">{v}</span>
          {SIZES.map((s) => (
            <Button key={s} variant={v} size={s} onClick={() => push(`${v}/${s} clicked`)}>
              {s}
            </Button>
          ))}
        </div>
      ))}

      <div className="matrix-row">
        <span className="matrix-label">states</span>
        <Button variant="destructive" onClick={() => push('destructive clicked')}>
          Delete
        </Button>
        <Button disabled onClick={() => push('never fire')}>
          Disabled
        </Button>
        <Button fullWidth onClick={() => push('fullWidth clicked')}>
          Full width
        </Button>
      </div>

      <div className="matrix-row">
        <span className="matrix-label">async</span>
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => setLoading(false), 1200);
          }}
        >
          {loading ? 'Saving…' : 'Simulate save'}
        </Button>
      </div>

      <ul className="log">
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </section>
  );
}
