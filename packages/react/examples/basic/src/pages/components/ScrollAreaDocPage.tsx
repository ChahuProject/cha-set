import React, { useState } from 'react';
import { ScrollArea } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

const SAMPLE_TAGS = Array.from({ length: 40 }).map(
  (_, i) => `v1.2.0-beta.${40 - i} — Performance optimizations and token synchronization updates`,
);

const SAMPLE_CARDS = [
  { id: '1', title: 'Single Source of Truth', desc: 'spec/tokens shards drive CSS & Qt', tag: 'Architecture' },
  { id: '2', title: 'Pixel-Perfect Parity', desc: '100% identical styling across platforms', tag: 'Visuals' },
  { id: '3', title: 'Dual-Box Hot Zone', desc: '16px hit box with 6px-12px dynamic expand', tag: 'Ergonomics' },
  { id: '4', title: 'Stepper Navigation', desc: 'To-top, page-up, page-down, to-bottom', tag: 'Interaction' },
  { id: '5', title: 'Native Performance', desc: 'Zero Electron overhead, pure QML on Qt', tag: 'Desktop' },
  { id: '6', title: 'Tailwind v4 Theming', desc: 'Inline theme variables mapped to CSS tokens', tag: 'Web' },
  { id: '7', title: 'Theme Studio Tuner', desc: 'Live color manipulation and JSON exporter', tag: 'Tooling' },
  { id: '8', title: 'Cross-Stack Parity Gate', desc: 'CI verifies every required capability', tag: 'Quality' },
];

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
      ? `<div className="p-4 w-[800px] h-[500px]">
    {/* 2D Grid Content */}
  </div>`
      : `<div className="p-4">
    <h4 className="mb-4 text-sm font-medium">Release Changelog</h4>
    {tags.map((tag) => (
      <div key={tag} className="text-sm py-2 border-b">
        {tag}
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
        model: 8
        spacing: 12
        delegate: Rectangle { width: 200; height: 120; radius: 6; color: ThemeTokens.panel }
    }`
        : `ListView {
        model: 40
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
          title="Interactive Scroll Area Sandbox"
          reactCode={reactCode}
          qtCode={qtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4 w-full">
              {/* Orientation Mode Switcher */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium">Mode:</span>
                <button
                  type="button"
                  onClick={() => setHeroMode('vertical')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    heroMode === 'vertical' ? 'bg-primary text-primary-foreground font-semibold' : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  Vertical List
                </button>
                <button
                  type="button"
                  onClick={() => setHeroMode('horizontal')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    heroMode === 'horizontal' ? 'bg-primary text-primary-foreground font-semibold' : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  Horizontal Cards
                </button>
                <button
                  type="button"
                  onClick={() => setHeroMode('both')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    heroMode === 'both' ? 'bg-primary text-primary-foreground font-semibold' : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  Dual Axis (2D)
                </button>
              </div>

              {/* Stepper buttons toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showButtons}
                  onChange={(e) => setShowButtons(e.target.checked)}
                  className="rounded border-border"
                />
                <span>Stepper Buttons (Hover)</span>
              </label>

              {/* Smooth scroll toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={smoothScroll}
                  onChange={(e) => setSmoothScroll(e.target.checked)}
                  className="rounded border-border"
                />
                <span>Smooth Scroll</span>
              </label>

              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-muted-foreground">Hot-zone:</span>
                <select
                  value={hitSize}
                  onChange={(e) => setHitSize(Number(e.target.value))}
                  className="px-2 py-0.5 rounded border border-border bg-background text-xs"
                >
                  <option value={12}>12px</option>
                  <option value={16}>16px (Standard)</option>
                  <option value={20}>20px (Spacious)</option>
                </select>
              </div>
            </div>
          }
        >
          <div className="w-full max-w-lg">
            {heroMode === 'vertical' && (
              <ScrollArea
                className="h-72 w-full rounded-lg border border-border bg-card shadow-xs"
                showVerticalScrollBar
                showHorizontalScrollBar={false}
                showButtons={showButtons}
                smoothScroll={smoothScroll}
              >
                <div className="p-4">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Release Changelog & Tags (Vertical Scroll)
                  </h4>
                  <div className="divide-y divide-border/50">
                    {SAMPLE_TAGS.map((tag) => (
                      <div key={tag} className="py-2.5 text-xs text-foreground/90 flex items-center justify-between">
                        <span className="font-mono">{tag}</span>
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Tag</span>
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
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                          {card.tag}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">#{card.id}</span>
                      </div>
                      <h5 className="font-bold text-xs text-foreground">{card.title}</h5>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{card.desc}</p>
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
                <div className="p-4 w-[750px]">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Dual-Axis Spreadsheet Matrix (2D Viewport)
                  </h4>
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-[11px] text-muted-foreground">
                        <th className="p-2">ID</th>
                        <th className="p-2">Feature Name</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Target Stack</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Commit Hash</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 text-[11px]">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <tr key={i} className="hover:bg-muted/20">
                          <td className="p-2 font-semibold">#00{i + 1}</td>
                          <td className="p-2 text-foreground font-sans">Cross-stack token sync pipeline module</td>
                          <td className="p-2 text-muted-foreground">Compiler</td>
                          <td className="p-2 text-primary">React & Qt</td>
                          <td className="p-2"><span className="text-emerald-500">Verified</span></td>
                          <td className="p-2 text-muted-foreground">7a9f21b</td>
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
                  <span className="text-[10px] font-mono font-semibold text-primary uppercase">{card.tag}</span>
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
            <div className="p-4 w-[700px]">
              <pre className="font-mono text-xs text-foreground/90 whitespace-pre leading-relaxed">
{`// Large Configuration Matrix
export const CrossStackSpecification = {
  specVersion: 1,
  schema: "zod",
  supportedPlatforms: ["react-web", "qt-quick-desktop", "qt-widgets"],
  tokenShards: [
    "spec/tokens/meta.json",
    "spec/tokens/primitives.json",
    "spec/tokens/semantic/core.json",
    "spec/tokens/semantic/dunting.json",
    "spec/tokens/themes/axes.json"
  ],
  capabilities: {
    scrollbar: { hotZone: 16, collapsed: 6, expanded: 12, steppers: true }
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
          <strong>16px transparent interaction hot-zone</strong> paired with an animated visual indicator that expands
          from <code className="font-mono text-primary">6px</code> (idle) to <code className="font-mono text-primary">12px</code> (hover) with 150ms cubic easing.
        </p>

        <div className="p-6 rounded-lg border border-border bg-card/40 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <span><strong>Idle State:</strong> 6px slim indicator bar, non-intrusive.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <span><strong>Hover State:</strong> Expands to 12px with high visual affordance.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <span><strong>Hit Area:</strong> 16px transparent box captures pointer immediately.</span>
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
