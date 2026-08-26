const RADIUS_STEPS = [
  { id: 'sm', css: 'calc(var(--radius) - 0.25rem)' },
  { id: 'md', css: 'calc(var(--radius) - 0.125rem)' },
  { id: 'lg', css: 'var(--radius)' },
  { id: 'xl', css: 'calc(var(--radius) + 0.25rem)' },
] as const;

export default function TypeRadiusSection() {
  return (
    <section className="block" id="type">
      <h2>字体 / 圆角 / 图表</h2>
      <p className="desc">
        圆角派生自 <code>--radius</code>（同 shadcn 的 sm/md/lg/xl 派生式）；
        字重对应 tokens.json primitives（500/600）；图表五色随强调色联动。
      </p>

      <div className="radius-row">
        {RADIUS_STEPS.map((s) => (
          <div key={s.id} className="radius-box" style={{ borderRadius: s.css }}>
            radius-{s.id}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.1rem' }}>
        <p className="weight-sample" style={{ fontWeight: 500 }}>
          Medium 500 — 茶具 ChaSet，跨栈组件库
        </p>
        <p className="weight-sample" style={{ fontWeight: 600 }}>
          Semibold 600 — 茶具 ChaSet，跨栈组件库
        </p>
      </div>

      <div className="chart-row" style={{ marginTop: '1rem' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="chart-bar"
            style={{ background: `var(--chart-${i})`, height: `${28 + i * 12}px` }}
            title={`--chart-${i}`}
          />
        ))}
      </div>
    </section>
  );
}
