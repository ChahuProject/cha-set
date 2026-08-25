import { useState } from 'react';
import { Button } from '@chahu/cha-set';
import '@chahu/cha-set/styles.css';

export function App() {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const push = (msg: string) => setLog((l) => [msg, ...l].slice(0, 6));

  return (
    <main className="demo">
      <h1>ChaSet React Button example</h1>
      <p className="muted">
        Rendered from <code>@chahu/cha-set</code> (React implementation, styled by
        generated <code>--cs-*</code> tokens).
      </p>

      <section className="row">
        <Button variant="primary" onClick={() => push('primary clicked')}>
          Primary
        </Button>
        <Button variant="secondary" onClick={() => push('secondary clicked')}>
          Secondary
        </Button>
        <Button variant="ghost" onClick={() => push('ghost clicked')}>
          Ghost
        </Button>
        <Button variant="danger" onClick={() => push('danger clicked')}>
          Danger
        </Button>
      </section>

      <section className="row">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button fullWidth={false} onClick={() => push('default size')}>
          Default
        </Button>
      </section>

      <section className="row">
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => setLoading(false), 1500);
          }}
        >
          {loading ? 'Saving…' : 'Simulate save'}
        </Button>
        <Button disabled onClick={() => push('should never fire')}>
          Disabled
        </Button>
        <Button fullWidth>Full width</Button>
      </section>

      <section className="row">
        <Button
          variant="secondary"
          onClick={() => document.documentElement.classList.toggle('dark')}
        >
          Toggle dark mode
        </Button>
      </section>

      <ul className="log">
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </main>
  );
}