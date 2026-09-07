import React from 'react';
import { VirtualGrid, Badge } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

const SAMPLE_ITEMS = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  title: `Module #${i + 1}`,
  description: `Virtual windowed card unit asset ${i + 1}`,
  status: i % 3 === 0 ? 'Active' : 'Pending',
}));

export function VirtualGridDocPage() {
  const reactCode = `<VirtualGrid
  items={items}
  minColumnWidthRem={10}
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
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Virtualizing responsive card columns with automatic width calculation and row-based DOM recycling.
        </p>

        <ComponentPreview title="Virtual Grid Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-xl">
            <VirtualGrid
              items={SAMPLE_ITEMS}
              minColumnWidthRem={10}
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

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'rowCount', type: 'number', default: '0', description: 'Total number of rows.' },
            { name: 'columnCount', type: 'number', default: '0', description: 'Total number of columns.' },
            { name: 'estimateRowSize', type: '(idx: number) => number', default: '() => 36', description: 'Row height estimator.' },
            { name: 'estimateColumnSize', type: '(idx: number) => number', default: '() => 80', description: 'Column width estimator.' },
            { name: 'renderCell', type: '(row: number, col: number) => ReactNode', default: 'undefined', description: 'Cell rendering callback.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
