import React, { useState } from 'react';
import { VirtualTree, type TreeNode } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

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
  rootNodes={treeData}
  getChildren={(node) => node.children ?? []}
  getNodeKey={(node) => node.id}
  defaultExpandDepth={2}
  className="h-64 border border-border rounded-md bg-card overflow-auto p-2"
  renderRow={({ node, depth, hasChildren, isExpanded, toggleExpand }) => (
    <div
      className="flex items-center gap-2 px-2 py-1 text-xs cursor-pointer hover:bg-muted/50 rounded"
      style={{ paddingLeft: \`\${depth * 16 + 8}px\` }}
      onClick={() => {
        setSelectedId(node.id);
        if (hasChildren) toggleExpand();
      }}
    >
      {hasChildren ? (
        <span className="text-[10px] w-3.5 text-muted-foreground">{isExpanded ? '▼' : '▶'}</span>
      ) : (
        <span className="w-3.5 text-[10px] text-muted-foreground/50">•</span>
      )}
      <span className="font-mono">{node.label}</span>
    </div>
  )}
/>`;

  return (
    <DocLayout
      category="Desktop & Virtualization"
      title="Virtual Tree"
      description="Virtualized hierarchical tree view with node expansion, selection, and keyboard navigation."
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
          Expand folders and click to select files in the tree view below.
        </p>

        <ComponentPreview title="Virtual Tree Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-sm flex flex-col gap-3">
            <VirtualTree
              rootNodes={SAMPLE_TREE}
              getChildren={(node) => node.children ?? []}
              getNodeKey={(node) => node.id}
              defaultExpandDepth={2}
              className="h-64 border border-border rounded-md bg-card overflow-auto p-2"
              renderRow={({ node, depth, hasChildren, isExpanded, toggleExpand }) => (
                <div
                  className={`flex items-center gap-2 px-2 py-1 text-xs rounded cursor-pointer transition-colors select-none ${
                    selectedId === node.id
                      ? 'bg-primary/15 text-primary font-medium'
                      : 'hover:bg-muted/50 text-foreground'
                  }`}
                  style={{ paddingLeft: `${depth * 16 + 8}px` }}
                  onClick={() => {
                    setSelectedId(node.id);
                    if (hasChildren) toggleExpand();
                  }}
                >
                  {hasChildren ? (
                    <span className="text-[10px] w-3.5 text-muted-foreground">{isExpanded ? '▼' : '▶'}</span>
                  ) : (
                    <span className="w-3.5 text-[10px] text-muted-foreground/50">•</span>
                  )}
                  <span className="font-mono">{node.label}</span>
                </div>
              )}
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

      
      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="virtual-tree" />
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
