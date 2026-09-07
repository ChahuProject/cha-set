import React, { useState } from 'react';
import { VirtualTree, type TreeNode } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

const SAMPLE_TREE: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button.tsx', label: 'Button.tsx' },
          { id: 'input.tsx', label: 'Input.tsx' },
          { id: 'dialog.tsx', label: 'Dialog.tsx' },
        ],
      },
      {
        id: 'virtual',
        label: 'virtual',
        children: [
          { id: 'virtual-list.tsx', label: 'VirtualList.tsx' },
          { id: 'virtual-tree.tsx', label: 'VirtualTree.tsx' },
          { id: 'virtual-grid.tsx', label: 'VirtualGrid.tsx' },
        ],
      },
      { id: 'index.ts', label: 'index.ts' },
    ],
  },
  {
    id: 'spec',
    label: 'spec',
    children: [
      { id: 'capabilities.json', label: 'capabilities.json' },
      { id: 'components.ts', label: 'components.ts' },
    ],
  },
  { id: 'package.json', label: 'package.json' },
  { id: 'readme.md', label: 'README.md' },
];

export function VirtualTreeDocPage() {
  const [selectedId, setSelectedId] = useState<string | null>('button.tsx');

  const reactCode = `<VirtualTree
  nodes={treeData}
  selectedId={selectedId}
  onSelectNode={(node) => setSelectedId(node.id)}
  defaultExpandedIds={['src', 'components']}
  className="h-64 border rounded-md"
/>`;

  return (
    <DocLayout
      category="Desktop & Virtualization"
      title="Virtual Tree"
      description="Virtualized hierarchical tree view with node expansion, selection, and keyboard navigation."
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
          Expand folders and click to select files in the tree view below.
        </p>

        <ComponentPreview title="Virtual Tree Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-sm flex flex-col gap-3">
            <VirtualTree
              nodes={SAMPLE_TREE}
              selectedId={selectedId}
              onSelectNode={(node) => setSelectedId(node.id)}
              defaultExpandedIds={['src', 'components', 'virtual']}
              className="h-64 border border-border rounded-md bg-card overflow-auto p-2"
            />
            <span className="text-xs text-muted-foreground">
              Selected node: <strong className="text-foreground">{selectedId || 'None'}</strong>
            </span>
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
            { name: 'nodes', type: 'TreeNode[]', default: '[]', description: 'Hierarchical node tree structure.' },
            { name: 'selectedId', type: 'string | null', default: 'null', description: 'ID of currently active selected node.' },
            { name: 'onSelectNode', type: '(node: TreeNode) => void', default: 'undefined', description: 'Selection callback.' },
            { name: 'defaultExpandedIds', type: 'string[]', default: '[]', description: 'Initially expanded folder IDs.' },
            { name: 'indentWidth', type: 'number', default: '16', description: 'Pixel indent per nesting level.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
