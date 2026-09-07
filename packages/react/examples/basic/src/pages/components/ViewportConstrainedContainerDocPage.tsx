import React, { useState } from 'react';
import { ViewportConstrainedContainer } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

export function ViewportConstrainedContainerDocPage() {
  const [limit, setLimit] = useState<number | undefined>(220);
  const [margin, setMargin] = useState(16);

  const sampleItems = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    title: `Render Target #${i + 1}`,
    format: i % 2 === 0 ? 'RGBA8_UNORM' : 'D32_SFLOAT',
    size: `${1920 / (i % 4 + 1)}x${1080 / (i % 4 + 1)}`,
  }));

  const reactCode = `<ViewportConstrainedContainer
  maxHeight={${limit ?? 'undefined'}}
  margin={${margin}}
  overflow="auto"
>
  <div className="p-3 space-y-2">
    {items.map(item => (
      <div key={item.id} className="p-2 rounded bg-muted/30 text-xs">
        {item.title}
      </div>
    ))}
  </div>
</ViewportConstrainedContainer>`;

  return (
    <DocLayout
      category="Interactive Controls"
      title="Viewport Constrained Container"
      description="Container that dynamically bounds max-height based on available viewport space below the anchor rect, supporting custom upper limit overrides and smooth vertical scrolling."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'variants', title: 'Variants & Limits' },
        { id: 'installation', title: 'Installation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          The container dynamically measures the distance from its anchor to the bottom of the window (window.innerHeight - rect.top - margin) and clamps content height to prevent overflowing outside the viewport.
        </p>

        <ComponentPreview title="Viewport Constrained Container Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLimit(180)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${limit === 180 ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-foreground'}`}
              >
                180px Cap
              </button>
              <button
                type="button"
                onClick={() => setLimit(260)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${limit === 260 ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-foreground'}`}
              >
                260px Cap
              </button>
              <button
                type="button"
                onClick={() => setLimit(undefined)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${limit === undefined ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-foreground'}`}
              >
                Auto Viewport
              </button>
            </div>

            <ViewportConstrainedContainer
              maxHeight={limit}
              margin={margin}
              className="w-full max-w-xs"
            >
              <div className="p-3 space-y-2">
                <div className="text-xs font-semibold text-foreground mb-1">
                  Active Framebuffers ({sampleItems.length})
                </div>
                {sampleItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded border border-border/50 bg-card/60 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-foreground">{item.title}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{item.format}</span>
                  </div>
                ))}
              </div>
            </ViewportConstrainedContainer>
          </div>
        </ComponentPreview>
      </section>

      <section id="variants" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Variants & Limits
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configure custom numeric overrides, string-based bounds, or custom margin offsets.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">Strict 150px Cap</span>
            <ViewportConstrainedContainer maxHeight={150} className="w-full">
              <div className="p-3 space-y-1.5">
                {sampleItems.slice(0, 8).map((item) => (
                  <div key={item.id} className="text-xs p-1.5 rounded bg-muted/40">
                    {item.title}
                  </div>
                ))}
              </div>
            </ViewportConstrainedContainer>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">Always Scroll Overflow</span>
            <ViewportConstrainedContainer maxHeight={150} overflow="scroll" className="w-full">
              <div className="p-3 space-y-1.5">
                {sampleItems.slice(0, 8).map((item) => (
                  <div key={item.id} className="text-xs p-1.5 rounded bg-muted/40">
                    {item.title}
                  </div>
                ))}
              </div>
            </ViewportConstrainedContainer>
          </div>

          <div className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground">High Margin (48px)</span>
            <ViewportConstrainedContainer margin={48} maxHeight={150} className="w-full">
              <div className="p-3 space-y-1.5">
                {sampleItems.slice(0, 8).map((item) => (
                  <div key={item.id} className="text-xs p-1.5 rounded bg-muted/40">
                    {item.title}
                  </div>
                ))}
              </div>
            </ViewportConstrainedContainer>
          </div>
        </div>
      </section>

      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'maxHeight', type: 'number | string', default: 'undefined', description: 'Optional upper limit on container max-height.' },
            { name: 'margin', type: 'number', default: '16', description: 'Reserved margin between container bottom and viewport bottom edge.' },
            { name: 'overflow', type: "'auto' | 'scroll'", default: "'auto'", description: 'Vertical overflow scrolling strategy.' },
            { name: 'className', type: 'string', default: 'undefined', description: 'Custom CSS class names for styling.' },
            { name: 'children', type: 'React.ReactNode', default: 'undefined', description: 'Elements rendered inside the container.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
