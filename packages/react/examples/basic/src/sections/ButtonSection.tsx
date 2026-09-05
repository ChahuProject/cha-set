import { useState } from 'react';
import { Button } from '@chahu/cha-set';

const VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;
const SIZES = ['sm', 'default', 'lg', 'icon'] as const;

export default function ButtonSection() {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const push = (msg: string) => setLog((l) => [msg, ...l].slice(0, 5));

  return (
    <section className="block" id="button">
      <div className="block-header">
        <div>
          <h2>Components · Button Matrix</h2>
          <p className="desc">
            Neutral contract (spec/components/button.ts) implemented via @base-ui/react. Full variant × size matrix,
            polymorphic link rendering, and asynchronous loading states.
          </p>
        </div>
      </div>

      {/* Variant × Size Matrix */}
      {VARIANTS.map((v) => (
        <div className="matrix-row" key={v}>
          <span className="matrix-label">{v}</span>
          {SIZES.map((s) => (
            <Button key={s} variant={v} size={s} onClick={() => push(`${v}/${s} clicked`)}>
              {s === 'icon' ? '⚙' : `${v} ${s}`}
            </Button>
          ))}
        </div>
      ))}

      {/* States Row */}
      <div className="matrix-row">
        <span className="matrix-label">states</span>
        <Button variant="destructive" onClick={() => push('destructive clicked')}>
          Delete Item
        </Button>
        <Button disabled onClick={() => push('never fire')}>
          Disabled Button
        </Button>
        <Button
          asChild
          variant="secondary"
          nativeButton={false}
          onClick={() => push('asChild <a> link clicked')}
        >
          <a href="#docs">asChild Link (`&lt;a&gt;`)</a>
        </Button>
      </div>

      {/* Async Loading & Full Width */}
      <div className="matrix-row">
        <span className="matrix-label">async & block</span>
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            push('Async action started (1.2s spinner)');
            window.setTimeout(() => {
              setLoading(false);
              push('Async action finished');
            }, 1200);
          }}
        >
          {loading ? 'Saving Changes…' : 'Simulate Async Action'}
        </Button>
      </div>

      <div className="matrix-row" style={{ marginTop: '0.5rem' }}>
        <span className="matrix-label">fullWidth</span>
        <div style={{ flex: 1 }}>
          <Button fullWidth onClick={() => push('fullWidth clicked')}>
            Full Width Block Action
          </Button>
        </div>
      </div>

      {/* Interactive Log */}
      <div className="log-container">
        <div className="log-header">
          <span>Interaction Log (Click events)</span>
          {log.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setLog([])}>
              Clear
            </Button>
          )}
        </div>
        <ul className="log">
          {log.length === 0 ? (
            <li className="log-empty">Click buttons above to see click events…</li>
          ) : (
            log.map((entry, i) => <li key={i}>{entry}</li>)
          )}
        </ul>
      </div>
    </section>
  );
}
