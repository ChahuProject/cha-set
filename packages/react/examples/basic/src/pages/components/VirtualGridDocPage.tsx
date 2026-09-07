import React from 'react';
import { VirtualGrid } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

export function VirtualGridDocPage() {
  const reactCode = `<VirtualGrid
  rowCount={1000}
  columnCount={100}
  estimateRowSize={() => 36}
  estimateColumnSize={() => 80}
  className="h-64 border rounded-md"
  renderCell={(row, col) => (
    <div className="flex items-center justify-center border-r border-b text-xs font-mono">
      {row}:{col}
    </div>
  )}
/>`;

  return (
    <DocLayout
      category="Desktop & Virtualization"
      title="Virtual Grid"
      description="2D windowed grid virtualizer for massive matrix, spreadsheet, and memory dump visualization."
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
          Virtualizing a <strong>1,000 × 100 (100,000 cells)</strong> 2D matrix smoothly with independent horizontal and vertical windowing.
        </p>

        <ComponentPreview title="Virtual Grid Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-lg">
            <VirtualGrid
              rowCount={1000}
              columnCount={100}
              estimateRowSize={() => 36}
              estimateColumnSize={() => 80}
              className="h-64 border border-border rounded-md bg-card overflow-auto"
              renderCell={(row, col) => (
                <div
                  key={`${row}-${col}`}
                  className="flex items-center justify-center border-r border-b border-border/40 text-[0.7rem] font-mono text-muted-foreground hover:bg-muted/40 transition-colors"
                >
                  R{row}:C{col}
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
