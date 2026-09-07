import React, { useMemo } from 'react';
import { VirtualList, Badge } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

export function VirtualListDocPage() {
  const items = useMemo(() => {
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      title: `Dataset Item #${i + 1}`,
      tag: i % 2 === 0 ? 'Production' : 'Staging',
    }));
  }, []);

  const reactCode = `<VirtualList
  items={items}
  estimateSize={() => 36}
  className="h-64 border rounded-md"
  renderItem={(item, index) => (
    <div className="flex items-center justify-between px-3 h-9 border-b border-border/50 text-xs">
      <span>{item.title}</span>
      <Badge size="sm">{item.tag}</Badge>
    </div>
  )}
/>`;

  return (
    <DocLayout
      category="Desktop & Virtualization"
      title="Virtual List"
      description="High-performance windowed 100k+ row list powered by TanStack Virtual, rendering only DOM nodes visible in the active viewport."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Rendering <strong>10,000</strong> virtual items smoothly at 60fps. Scroll rapidly to observe instant windowing.
        </p>

        <ComponentPreview title="Virtual List Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-md">
            <VirtualList
              items={items}
              estimateSize={() => 36}
              className="h-64 border border-border rounded-md bg-card overflow-auto"
              renderRow={(item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-3 h-9 border-b border-border/40 text-xs hover:bg-muted/40 transition-colors"
                >
                  <span className="font-mono text-foreground">{item.title}</span>
                  <Badge size="sm" variant={item.id % 2 === 0 ? 'secondary' : 'outline'}>
                    {item.tag}
                  </Badge>
                </div>
              )}
            />
          </div>
        </ComponentPreview>
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
            { name: 'items', type: 'T[]', default: '[]', description: 'Array of data items to virtualize.' },
            { name: 'renderItem', type: '(item: T, idx: number) => ReactNode', default: 'undefined', description: 'Item rendering callback.' },
            { name: 'estimateSize', type: '(idx: number) => number', default: '() => 36', description: 'Estimated item pixel height for measurement.' },
            { name: 'overscan', type: 'number', default: '5', description: 'Number of buffer items rendered beyond viewport bounds.' },
            { name: 'getItemKey', type: '(item: T, idx: number) => Key', default: 'undefined', description: 'Key extractor callback.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
