import React, { useMemo, useRef } from 'react';
import { VirtualList, type VirtualListHandle, Badge, Button, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function VirtualListDocPage() {
  const listRef = useRef<VirtualListHandle>(null);

  const items = useMemo(() => {
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      title: `Dataset Item #${i + 1}`,
      tag: i % 2 === 0 ? 'Production' : 'Staging',
    }));
  }, []);

  const reactCode = `const listRef = useRef<VirtualListHandle>(null);

// Programmatic jump
listRef.current?.scrollToIndex(500, 'center');

<VirtualList
  ref={listRef}
  items={items}
  estimateSize={36}
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
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Rendering <strong>10,000</strong> virtual items smoothly at 60fps. Use the controls below to trigger programmatic scrolling or scroll rapidly to observe instant windowing.
        </p>

        <ComponentPreview title="Virtual List Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-md space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => listRef.current?.scrollToIndex(0, 'start')}
              >
                Top (#1)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => listRef.current?.scrollToIndex(500, 'center')}
              >
                Index #500
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => listRef.current?.scrollToIndex(2500, 'center')}
              >
                Index #2,500
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => listRef.current?.scrollToIndex(items.length - 1, 'end')}
              >
                Bottom (#10,000)
              </Button>
            </div>

            <VirtualList
              ref={listRef}
              items={items}
              estimateSize={36}
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

      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="virtual-list" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'items', type: 'readonly T[]', default: '[]', description: 'Array of data items to virtualize.' },
            { name: 'renderRow', type: '(item: T, index: number) => ReactNode', default: 'undefined', description: 'Callback rendering an individual row.' },
            { name: 'renderItem', type: '(item: T, index: number) => ReactNode', default: 'undefined', description: 'Alias for renderRow.' },
            { name: 'estimateSize', type: 'number | ((index: number) => number)', default: '36', description: 'Estimated item height for measurement.' },
            { name: 'gap', type: 'number', default: '0', description: 'Vertical gap between adjacent items.' },
            { name: 'overscan', type: 'number', default: '8', description: 'Number of buffer items rendered beyond viewport bounds.' },
            { name: 'emptyNode', type: 'ReactNode', default: 'null', description: 'Content rendered when items array is empty.' },
            { name: 'onScroll', type: '(distanceToBottom: number) => void', default: 'undefined', description: 'Scroll event callback receiving distance to bottom.' },
            { name: 'ref', type: 'Ref<VirtualListHandle>', default: 'undefined', description: 'Handle exposing scrollToIndex(index, align).' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
