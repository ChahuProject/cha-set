const RADIUS_STEPS = [
  { id: 'sm', css: 'calc(var(--radius) - 0.25rem)' },
  { id: 'md', css: 'calc(var(--radius) - 0.125rem)' },
  { id: 'lg', css: 'var(--radius)' },
  { id: 'xl', css: 'calc(var(--radius) + 0.25rem)' },
] as const;

export default function TypeRadiusSection() {
  return (
    <section className="block" id="type">
      <h2>Typography / Radius / Charts</h2>
      <p className="desc">
        Radii derived from <code>--radius</code> (same sm/md/lg/xl derivation as shadcn); font
        weights map to tokens.json primitives (500/600); chart five colors follow the accent.
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
          Medium 500 — Tea Set ChaSet, cross-stack component library
        </p>
        <p className="weight-sample" style={{ fontWeight: 600 }}>
          Semibold 600 — Tea Set ChaSet, cross-stack component library
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
