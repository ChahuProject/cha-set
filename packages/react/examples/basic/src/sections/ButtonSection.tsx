import { useState } from 'react';
import { Button } from '@chahu/cha-set';

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

export default function ButtonSection() {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const push = (msg: string) => setLog((l) => [msg, ...l].slice(0, 5));

  return (
    <section className="block" id="button">
      <h2>组件 · Button</h2>
      <p className="desc">
        契约：spec/components/button.ts —— variant × size × loading / disabled /
        fullWidth；键盘 Tab 聚焦后 Enter / Space 可完整操作。
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
        <Button variant="danger" onClick={() => push('danger clicked')}>
          删除
        </Button>
        <Button disabled onClick={() => push('never fire')}>
          禁用
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
          {loading ? '保存中…' : '模拟保存'}
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
