import React, { useState } from 'react';
import { ScrollArea } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

const SAMPLE_TAGS = Array.from({ length: 120 }).map((_, i) => {
  const num = 120 - i;
  const major = 1 + Math.floor(num / 50);
  const minor = Math.floor((num % 50) / 10);
  const patch = num % 10;
  const categories = ['Tokens', 'Ergonomics', 'Performance', 'A11y', 'Desktop/Qt', 'Compiler', 'Visuals', 'Architecture'];
  const category = categories[i % categories.length];
  return {
    version: `v${major}.${minor}.${patch}-build.${num}`,
    category,
    desc: `Synchronized token updates, scrollbar steppers, and boundary checks (patch #${num})`,
    date: `2026-08-${String((i % 28) + 1).padStart(2, '0')}`,
    hash: (Math.sin(num) * 10000).toString(16).substring(7, 14),
  };
});

const SAMPLE_CARDS = [
  { id: '1', title: 'Single Source of Truth', desc: 'spec/tokens shards drive CSS & Qt', tag: 'Architecture' },
  { id: '2', title: 'Pixel-Perfect Parity', desc: '100% identical styling across platforms', tag: 'Visuals' },
  { id: '3', title: 'Dual-Box Hot Zone', desc: '16px hit box with 6px-12px dynamic expand', tag: 'Ergonomics' },
  { id: '4', title: 'Stepper Navigation', desc: 'To-top, page-up, page-down, to-bottom', tag: 'Interaction' },
  { id: '5', title: 'Native Performance', desc: 'Zero Electron overhead, pure QML on Qt', tag: 'Desktop' },
  { id: '6', title: 'Tailwind v4 Theming', desc: 'Inline theme variables mapped to CSS tokens', tag: 'Web' },
  { id: '7', title: 'Theme Studio Tuner', desc: 'Live color manipulation and JSON exporter', tag: 'Tooling' },
  { id: '8', title: 'Cross-Stack Parity Gate', desc: 'CI verifies every required capability', tag: 'Quality' },
  { id: '9', title: 'Token Shard Engine', desc: 'Modular schemas for colors, space, motion', tag: 'Tokens' },
  { id: '10', title: 'Synchronized Palette', desc: 'Dual-mode dark & light automatic calibration', tag: 'Visuals' },
  { id: '11', title: 'Fluid Animation Curve', desc: '150ms cubic easing for hot-zone hover states', tag: 'Motion' },
  { id: '12', title: 'Non-Intrusive Idle', desc: '6px slim visual bar preserves screen estate', tag: 'Ergonomics' },
  { id: '13', title: 'Multi-Page Stepping', desc: '85% viewport ratio smooth pagination jump', tag: 'Interaction' },
  { id: '14', title: 'Bi-Directional Bounds', desc: 'Thumb never overlaps stepper button clusters', tag: 'Robustness' },
  { id: '15', title: 'High Contrast A11y', desc: 'WCAG AAA verified state contrast ratios', tag: 'Accessibility' },
  { id: '16', title: 'Zero Dependency Core', desc: 'Headless primitives with minimal bundle size', tag: 'Performance' },
  { id: '17', title: 'QML Quick Integration', desc: 'Direct C++ token pipeline for 60fps Qt apps', tag: 'Desktop' },
  { id: '18', title: 'Visual Diff Conformance', desc: 'Automated pixelmatch snapshots on pull requests', tag: 'Quality' },
  { id: '19', title: 'Dual-Axis Sync Corner', desc: 'Seamless 2D grid matrix scrolling support', tag: 'Layout' },
  { id: '20', title: 'Polymorphic Component', desc: 'Custom render delegation via Base UI engine', tag: 'Architecture' },
  { id: '21', title: 'Touch & Pen Modality', desc: 'Smooth drag latch with touch gesture priority', tag: 'Interaction' },
  { id: '22', title: 'Zod API Schema', desc: 'Static typescript validation on design token types', tag: 'TypeSafety' },
  { id: '23', title: 'Dynamic CSS Variables', desc: 'Scoped custom properties for hot reload themes', tag: 'Web' },
  { id: '24', title: 'Release Artifact CI', desc: 'Generates headers, css, and tokens in one pass', tag: 'Tooling' },
];

const SAMPLE_MATRIX_ROWS = Array.from({ length: 100 }).map((_, i) => {
  const rowNum = i + 1;
  const categories = ['Compiler', 'Tokens', 'Components', 'Desktop', 'Web', 'Quality', 'A11y', 'Performance'];
  const stacks = ['React & Qt', 'React Only', 'Qt Only', 'Spec Pipeline'];
  const statuses = ['Verified', 'In Review', 'Passing CI', 'Production'];
  const category = categories[i % categories.length];
  const stack = stacks[i % stacks.length];
  const status = statuses[i % statuses.length];
  const hash = (Math.cos(rowNum) * 100000).toString(16).substring(3, 10);
  return {
    id: `#00${rowNum < 10 ? '0' + rowNum : rowNum}`,
    name: `Cross-stack module feature test #${rowNum} (page step validation)`,
    category,
    stack,
    status,
    hash,
    priority: i % 3 === 0 ? 'High' : i % 2 === 0 ? 'Medium' : 'Normal',
  };
});

export function ScrollAreaDocPage() {
  const [heroMode, setHeroMode] = useState<'vertical' | 'horizontal' | 'both'>('vertical');
  const [showButtons, setShowButtons] = useState(true);
  const [smoothScroll, setSmoothScroll] = useState(true);
  const [hitSize, setHitSize] = useState(16);

  const reactCode = `<ScrollArea
  className="h-72 w-full rounded-md border border-border"
  showVerticalScrollBar={${heroMode !== 'horizontal'}}
  showHorizontalScrollBar={${heroMode !== 'vertical'}}
  showButtons={${showButtons}}
  smoothScroll={${smoothScroll}}
>
  ${
    heroMode === 'horizontal'
      ? `<div className="flex gap-4 p-4 w-max">
    {cards.map((card) => (
      <div key={card.id} className="w-64 p-4 rounded-lg border bg-card shrink-0">
        <span className="text-xs font-semibold text-primary">{card.tag}</span>
        <h5 className="font-bold text-sm mt-1">{card.title}</h5>
        <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
      </div>
    ))}
  </div>`
      : heroMode === 'both'
      ? `<div className="p-4 w-[50rem] h-[31.25rem]">
    {/* 2D Grid Content */}
  </div>`
      : `<div className="p-4">
    <h4 className="mb-4 text-sm font-medium">Release Changelog</h4>
    {tags.map((tag) => (
      <div key={tag.version} className="text-sm py-2 border-b">
        {tag.version} — {tag.desc}
      </div>
    ))}
  </div>`
  }
</ScrollArea>`;

  const qtCode = `ChaSetScrollView {
    width: parent.width
    height: 300
    showButtons: ${showButtons}
    showVerticalScrollBar: ${heroMode !== 'horizontal'}
    showHorizontalScrollBar: ${heroMode !== 'vertical'}
    smoothScroll: ${smoothScroll}

    ${
      heroMode === 'horizontal'
        ? `ListView {
        orientation: ListView.Horizontal
        model: 24
        spacing: 12
        delegate: Rectangle { width: 200; height: 120; radius: 6; color: ThemeTokens.panel }
    }`
        : `ListView {
        model: 120
        delegate: Text { text: "Item " + index; color: ThemeTokens.text; padding: 8 }
    }`
    }
}`;

  return (
    <DocLayout
      category="Components"
      title="Scroll Area"
      description="Augments native scroll functionality with custom cross-browser styling, dynamic hot-zone expansion, and interactive stepper navigation buttons."
      tocItems={[
        { id: 'preview', title: 'Interactive Preview' },
        { id: 'installation', title: 'Installation' },
        { id: 'horizontal-example', title: 'Horizontal Scrolling' },
        { id: 'dual-axis', title: 'Dual-Axis (Both Axes)' },
        { id: 'hotzone', title: 'Hot Zone & Dynamic Width' },
        { id: 'steppers', title: 'Stepper Navigation' },
        { id: 'props', title: 'API Reference' },
      ]}
    >
      {/* 1. Interactive Preview Hero */}
      <section id="preview">
        <ComponentPreview
          title="ScrollArea Showcase"
          description="Interactive playground demonstrating cross-stack scrollbar styling, stepper pagination, and dynamic hot-zone expansion."
          reactCode={reactCode}
          qtCode={qtCode}
          controls={
            <div className="flex flex-wrap items-center justify-between gap-4 w-full">
              {/* Orientation Mode */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium">Mode:</span>
                {(['vertical', 'horizontal', 'both'] as ('vertical' | 'horizontal' | 'both')[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setHeroMode(m)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer capitalize ${
                      heroMode === m ? 'bg-primary text-primary-foreground font-semibold' : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    {m === 'both' ? '2D Dual-Axis' : m}
                  </button>
                ))}
              </div>

              {/* Stepper Buttons Toggle */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showButtons}
                    onChange={(e) => setShowButtons(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary size-3.5 cursor-pointer"
                  />
                  <span className="text-xs text-foreground font-medium">Show Stepper Buttons</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={smoothScroll}
                    onChange={(e) => setSmoothScroll(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary size-3.5 cursor-pointer"
                  />
                  <span className="text-xs text-foreground font-medium">Smooth Scroll</span>
                </label>
              </div>
            </div>
          }
        >
          <div className="w-full max-w-xl flex justify-center">
            {heroMode === 'vertical' && (
              <ScrollArea
                className="h-72 w-full rounded-lg border border-border bg-card shadow-xs"
                showVerticalScrollBar
                showHorizontalScrollBar={false}
                showButtons={showButtons}
                smoothScroll={smoothScroll}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Release Changelog & Tags (120 Items)
                    </h4>
                    <span className="text-[0.625rem] text-muted-foreground font-mono">120 entries</span>
                  </div>
                  <div className="divide-y divide-border/50">
                    {SAMPLE_TAGS.map((item) => (
                      <div key={item.version} className="py-2.5 text-xs text-foreground/90 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-medium">{item.version}</span>
                            <span className="text-[0.625rem] text-primary bg-primary/10 px-1.5 py-0.2 rounded font-mono font-semibold">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[0.6875rem] text-muted-foreground truncate mt-0.5">{item.desc}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[0.625rem] text-muted-foreground font-mono block">{item.date}</span>
                          <span className="text-[0.625rem] text-muted-foreground/60 font-mono block">#{item.hash}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            )}

            {heroMode === 'horizontal' && (
              <ScrollArea
                className="w-full rounded-lg border border-border bg-card shadow-xs"
                showVerticalScrollBar={false}
                showHorizontalScrollBar
                showButtons={showButtons}
                smoothScroll={smoothScroll}
              >
                <div className="flex gap-3 p-4 w-max">
                  {SAMPLE_CARDS.map((card) => (
                    <div
                      key={card.id}
                      className="w-56 p-4 rounded-xl border border-border bg-muted/30 shrink-0 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[0.625rem] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                          {card.tag}
                        </span>
                        <span className="text-[0.625rem] text-muted-foreground font-mono">#{card.id}</span>
                      </div>
                      <h5 className="font-bold text-xs text-foreground">{card.title}</h5>
                      <p className="text-[0.6875rem] text-muted-foreground mt-1 leading-relaxed">{card.desc}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {heroMode === 'both' && (
              <ScrollArea
                className="h-72 w-full rounded-lg border border-border bg-card shadow-xs"
                showVerticalScrollBar
                showHorizontalScrollBar
                showButtons={showButtons}
                smoothScroll={smoothScroll}
              >
                <div className="p-4 w-[53.125rem]">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Dual-Axis Matrix (100 Rows &times; 6 Columns)
                    </h4>
                    <span className="text-[0.625rem] text-muted-foreground font-mono">100 items</span>
                  </div>
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-[0.6875rem] text-muted-foreground">
                        <th className="p-2">ID</th>
                        <th className="p-2">Feature Name</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Target Stack</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Commit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 text-[0.6875rem]">
                      {SAMPLE_MATRIX_ROWS.map((row) => (
                        <tr key={row.id} className="hover:bg-muted/20">
                          <td className="p-2 font-semibold text-muted-foreground">{row.id}</td>
                          <td className="p-2 text-foreground font-sans">{row.name}</td>
                          <td className="p-2">
                            <span className="text-[0.625rem] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                              {row.category}
                            </span>
                          </td>
                          <td className="p-2 text-foreground/80">{row.stack}</td>
                          <td className="p-2">
                            <span className={row.status === 'Verified' ? 'text-emerald-500 font-semibold' : 'text-primary'}>
                              {row.status}
                            </span>
                          </td>
                          <td className="p-2 text-muted-foreground">{row.hash}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            )}
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Installation */}
      <section id="installation" className="my-8">
        <h2 className="text-xl font-bold tracking-tight mb-3">Installation</h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
        <p className="text-xs text-muted-foreground mt-2">Import components and styles:</p>
        <CodeBlock
          code={`import { ScrollArea, ScrollBar } from '@chahu/cha-set';\nimport '@chahu/cha-set/styles.css';`}
          language="tsx"
          className="mt-2"
        />
      </section>

      {/* 3. Horizontal Scrolling Example Card */}
      <section id="horizontal-example" className="my-10">
        <h2 className="text-xl font-bold tracking-tight mb-2">Horizontal Scrolling Example</h2>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Hover over the bottom scrollbar to reveal the left (⏪ / ◀) and right (▶ / ⏩) stepper buttons.
        </p>

        <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
          <ScrollArea
            className="w-full rounded-lg border border-border bg-muted/20"
            showHorizontalScrollBar
            showVerticalScrollBar={false}
          >
            <div className="flex gap-4 p-4 w-max">
              {SAMPLE_CARDS.map((card) => (
                <div
                  key={card.id}
                  className="w-60 p-4 rounded-xl border border-border bg-card shadow-xs shrink-0"
                >
                  <span className="text-[0.625rem] font-mono font-semibold text-primary uppercase">{card.tag}</span>
                  <h4 className="text-sm font-bold mt-1 text-foreground">{card.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <CodeBlock
          code={`<ScrollArea className="w-full border rounded-md" showHorizontalScrollBar showVerticalScrollBar={false}>
  <div className="flex gap-4 p-4 w-max">
    {cards.map((card) => (
      <div key={card.id} className="w-60 p-4 border rounded-xl bg-card shrink-0">
        <h4>{card.title}</h4>
        <p>{card.desc}</p>
      </div>
    ))}
  </div>
</ScrollArea>`}
          language="tsx"
          className="mt-3"
        />
      </section>

      {/* 4. Dual-Axis Example */}
      <section id="dual-axis" className="my-10">
        <h2 className="text-xl font-bold tracking-tight mb-2">Dual-Axis (Both Axes with Corner)</h2>
        <p className="text-xs text-muted-foreground mb-4">
          When content exceeds both width and height, both scrollbars render with a synchronized corner piece.
        </p>

        <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
          <ScrollArea
            className="h-64 w-full rounded-lg border border-border bg-muted/10"
            showHorizontalScrollBar
            showVerticalScrollBar
          >
            <div className="p-4 w-[53.125rem]">
              <pre className="font-mono text-xs text-foreground/90 whitespace-pre leading-relaxed">
{`// Large Cross-Stack Configuration & Token Matrix (Multi-Page Test Dataset)
export const CrossStackSpecification = {
  specVersion: 1,
  schema: "zod",
  namespace: "@chahu/cha-set",
  supportedPlatforms: ["react-web", "qt-quick-desktop", "qt-widgets"],
  tokenShards: [
    "spec/tokens/meta.json",
    "spec/tokens/primitives.json",
    "spec/tokens/semantic/core.json",
    "spec/tokens/semantic/dunting.json",
    "spec/tokens/themes/axes.json",
    "spec/tokens/components/button.json",
    "spec/tokens/components/scrollbar.json"
  ],
  capabilities: {
    scrollbar: {
      hotZone: "1rem",
      collapsed: "0.375rem",
      expanded: "0.75rem",
      pageStepRatio: 0.85,
      smoothScroll: true,
      boundaryClamp: true,
      steppers: {
        toTop: true,
        pageUp: true,
        pageDown: true,
        toBottom: true,
        toLeft: true,
        pageLeft: true,
        pageRight: true,
        toRight: true
      },
      preventThumbOverlap: true
    },
    button: {
      variants: ["primary", "secondary", "ghost", "destructive"],
      sizes: ["sm", "md", "lg"],
      loadingSpinner: true,
      polymorphic: true
    }
  },
  conformanceMatrix: [
    { rule: "hotZone-expand", target: "both", result: "PASS", latencyMs: 0.4 },
    { rule: "stepper-clamp", target: "both", result: "PASS", latencyMs: 0.2 },
    { rule: "smooth-scroll-curve", target: "both", result: "PASS", latencyMs: 0.3 },
    { rule: "thumb-overlap-prevention", target: "both", result: "PASS", latencyMs: 0.1 },
    { rule: "dual-axis-corner-sync", target: "both", result: "PASS", latencyMs: 0.5 },
    { rule: "wcag-contrast-aa", target: "both", result: "PASS", latencyMs: 0.2 },
    { rule: "wcag-contrast-aaa", target: "both", result: "PASS", latencyMs: 0.2 },
    { rule: "touch-momentum-latch", target: "both", result: "PASS", latencyMs: 0.6 },
    { rule: "resize-observer-sync", target: "both", result: "PASS", latencyMs: 0.3 }
  ],
  buildTargets: {
    react: { entry: "src/index.ts", outDir: "dist", format: ["esm", "cjs"] },
    qt: { entry: "CMakeLists.txt", qmlDir: "src", moduleUri: "chaSet" }
  }
};`}
              </pre>
            </div>
          </ScrollArea>
        </div>
      </section>

      {/* 5. Hot Zone & Dynamic Width Feature */}
      <section id="hotzone" className="my-10">
        <h2 className="text-xl font-bold tracking-tight mb-2">Dual-Box Hot Zone & Dynamic Width</h2>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Traditional narrow scrollbars are difficult to target with a mouse pointer. ChaSet introduces a{' '}
          <strong>1rem (16px equivalent) transparent interaction hot-zone</strong> paired with an animated visual indicator that expands
          from <code className="font-mono text-primary">0.375rem</code> (6px idle) to <code className="font-mono text-primary">0.75rem</code> (12px hover) with 150ms cubic easing.
        </p>

        <div className="p-6 rounded-lg border border-border bg-card/40 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <span><strong>Idle State:</strong> 0.375rem (6px) slim indicator bar, non-intrusive.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <span><strong>Hover State:</strong> Expands to 0.75rem (12px) with high visual affordance.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <span><strong>Hit Area:</strong> 1rem (16px) transparent box captures pointer immediately.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Stepper Navigation */}
      <section id="steppers" className="my-10">
        <h2 className="text-xl font-bold tracking-tight mb-2">Two-End Stepper Navigation</h2>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Hovering the scrollbar reveals two-end stepper action buttons:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg border border-border bg-card/40">
            <h4 className="font-semibold mb-2">Vertical Cluster</h4>
            <ul className="space-y-1 text-muted-foreground list-disc pl-4">
              <li><strong>Top:</strong> ⏫ To Top & 🔼 Page Up (85% viewport step)</li>
              <li><strong>Bottom:</strong> 🔽 Page Down & ⏬ To Bottom</li>
              <li>Auto-disabled when at boundary limits.</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card/40">
            <h4 className="font-semibold mb-2">Horizontal Cluster</h4>
            <ul className="space-y-1 text-muted-foreground list-disc pl-4">
              <li><strong>Left:</strong> ⏪ To Start & ◀ Page Left</li>
              <li><strong>Right:</strong> ▶ Page Right & ⏩ To End</li>
              <li>Supports smooth animated interpolation.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 7. API Reference */}
      <section id="props" className="my-10">
        <h2 className="text-xl font-bold tracking-tight mb-2">API Reference</h2>
        <PropsTable
          title="ScrollAreaProps"
          props={[
            {
              name: 'showVerticalScrollBar',
              type: 'boolean',
              default: 'true',
              description: 'Whether to render the vertical scrollbar.',
            },
            {
              name: 'showHorizontalScrollBar',
              type: 'boolean',
              default: 'false',
              description: 'Whether to render the horizontal scrollbar.',
            },
            {
              name: 'showButtons',
              type: 'boolean',
              default: 'true',
              description: 'Whether stepper navigation buttons appear on scrollbar hover.',
            },
            {
              name: 'pageStepRatio',
              type: 'number',
              default: '0.85',
              description: 'Viewport dimension ratio used when clicking page-up/page-down.',
            },
            {
              name: 'smoothScroll',
              type: 'boolean',
              default: 'true',
              description: 'Whether stepper buttons use smooth scrolling behavior.',
            },
            {
              name: 'viewportClassName',
              type: 'string',
              default: 'undefined',
              description: 'Additional CSS classes for the internal scroll viewport element.',
            },
          ]}
        />

        <PropsTable
          title="ScrollBarProps"
          props={[
            {
              name: 'orientation',
              type: "'vertical' | 'horizontal'",
              default: "'vertical'",
              description: 'Scrollbar orientation axis.',
            },
            {
              name: 'hitSize',
              type: 'number',
              default: '16',
              description: 'Thickness in pixels of the transparent pointer-capture hot-zone.',
            },
            {
              name: 'collapsedSize',
              type: 'number',
              default: '6',
              description: 'Thickness in pixels of the visual indicator when idle.',
            },
            {
              name: 'expandedSize',
              type: 'number',
              default: '12',
              description: 'Thickness in pixels of the visual indicator when hovered.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
