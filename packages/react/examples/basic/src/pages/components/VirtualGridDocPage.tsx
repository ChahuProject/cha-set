import React, { useRef } from 'react';
import { VirtualGrid, type VirtualGridHandle, Badge, Button, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

const SAMPLE_ITEMS = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  title: `Module #${i + 1}`,
  description: `Virtual windowed card unit asset ${i + 1}`,
  status: i % 3 === 0 ? 'Active' : 'Pending',
}));

export function VirtualGridDocPage() {
  const gridRef = useRef<VirtualGridHandle>(null);

  const reactCode = `const gridRef = useRef<VirtualGridHandle>(null);

// Jump to card index
gridRef.current?.scrollToIndex(20, 'center');

<VirtualGrid
  ref={gridRef}
  items={items}
  minColumnWidthRem={10}
  gapRem={0.75}
  estimateSize={96}
  className="h-72 border rounded-md bg-card overflow-auto p-2"
  renderCard={(item) => (
    <div className="p-3 border rounded-lg bg-muted/20 flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs font-semibold">{item.title}</span>
        <Badge size="sm" variant="outline">{item.status}</Badge>
      </div>
      <p className="text-[0.7rem] text-muted-foreground">{item.description}</p>
    </div>
  )}
/>`;

  return (
    <DocLayout
      category="Desktop & Virtualization"
      title="Virtual Grid"
      description="2D responsive windowed grid virtualizer for massive cards, matrix data, and dynamic layouts."
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
          Virtualizing responsive card columns with automatic width calculation and row-based DOM recycling. Use controls below for programmatic navigation.
        </p>

        <ComponentPreview title="Virtual Grid Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-xl space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => gridRef.current?.scrollToIndex(0, 'start')}
              >
                Top (#1)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => gridRef.current?.scrollToIndex(20, 'center')}
              >
                Card #20
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => gridRef.current?.scrollToIndex(40, 'center')}
              >
                Card #40
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => gridRef.current?.scrollToIndex(59, 'end')}
              >
                Bottom (#60)
              </Button>
            </div>

            <VirtualGrid
              ref={gridRef}
              items={SAMPLE_ITEMS}
              minColumnWidthRem={10}
              gapRem={0.75}
              estimateSize={96}
              className="h-72 border border-border rounded-md bg-card overflow-auto p-2"
              renderCard={(item) => (
                <div
                  key={item.id}
                  className="p-3 border border-border/60 rounded-lg bg-muted/20 hover:bg-muted/50 transition-colors flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-foreground">{item.title}</span>
                    <Badge size="sm" variant={item.status === 'Active' ? 'secondary' : 'outline'}>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-[0.7rem] text-muted-foreground">{item.description}</p>
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
        <KeyboardShortcutsTable componentId="virtual-grid" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'items', type: 'readonly T[]', default: '[]', description: 'Array of data items to layout into grid cards.' },
            { name: 'renderCard', type: '(item: T, index: number) => ReactNode', default: 'undefined', description: 'Callback rendering an individual grid card.' },
            { name: 'renderItem', type: '(item: T, index: number) => ReactNode', default: 'undefined', description: 'Alias for renderCard.' },
            { name: 'minColumnWidthRem', type: 'number', default: '12', description: 'Minimum column width before responsive wrapping.' },
            { name: 'gapRem', type: 'number', default: '0.75', description: 'Grid gap spacing between cards.' },
            { name: 'estimateSize', type: 'number', default: '180', description: 'Estimated row height for virtual calculation.' },
            { name: 'overscan', type: 'number', default: '4', description: 'Buffer row count rendered beyond viewport bounds.' },
            { name: 'emptyNode', type: 'ReactNode', default: 'null', description: 'Content rendered when items array is empty.' },
            { name: 'ref', type: 'Ref<VirtualGridHandle>', default: 'undefined', description: 'Handle exposing scrollToIndex(index, align).' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
