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

      <div className="mt-4 p-4 rounded-lg bg-card border border-border space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-foreground">Font System · CJK Fallback & Typography Scale</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-medium bg-secondary text-secondary-foreground border border-border">
            Zero-SimSun Guarantee
          </span>
        </div>

        <p className="text-caption font-mono text-muted-foreground">
          Fallback Stack (Sans): Segoe UI → Microsoft YaHei UI → Microsoft YaHei → PingFang SC → Noto Sans SC → sans-serif
        </p>

        <div className="space-y-1 text-foreground">
          <p className="font-normal text-sm">
            Regular 400 — ChaSet 组件库 · 跨端统一字体系统 (The quick brown fox jumps over the lazy dog 0123456789)
          </p>
          <p className="font-medium text-sm">
            Medium 500 — ChaSet 组件库 · 跨端统一字体系统 (The quick brown fox jumps over the lazy dog 0123456789)
          </p>
          <p className="font-semibold text-sm">
            Semibold 600 — ChaSet 组件库 · 跨端统一字体系统 (The quick brown fox jumps over the lazy dog 0123456789)
          </p>
          <p className="font-bold text-sm">
            Bold 700 — ChaSet 组件库 · 跨端统一字体系统 (The quick brown fox jumps over the lazy dog 0123456789)
          </p>
        </div>

        <div className="border-t border-border my-2" />

        <p className="text-caption font-mono text-muted-foreground">
          Fallback Stack (Mono): Consolas → Cascadia Code → Microsoft YaHei UI → Microsoft YaHei → PingFang SC → Noto Sans SC → monospace
        </p>

        <div className="p-2.5 rounded-md bg-muted border border-border font-mono text-xs space-y-1">
          <p className="text-foreground">
            const fontSystem = ChaSet.FontSystem; // 自动处理中文字体回退，消除宋体锯齿
          </p>
          <p className="text-muted-foreground">
            console.log(`[ChaSet] CJK glyphs: 字体平滑清晰, zero raster artifacts`);
          </p>
        </div>
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
