import React, { useState, useRef } from 'react';
import { VirtualTree, type TreeNode, type VirtualTreeHandle, Button } from '@chahu/cha-set';
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
  const treeRef = useRef<VirtualTreeHandle>(null);
  const [selectedId, setSelectedId] = useState<string | null>('button.tsx');

  const reactCode = `const treeRef = useRef<VirtualTreeHandle>(null);

<div className="flex gap-2 mb-2">
  <Button size="sm" variant="outline" onClick={() => treeRef.current?.expandAll()}>Expand All</Button>
  <Button size="sm" variant="outline" onClick={() => treeRef.current?.collapseAll()}>Collapse All</Button>
</div>

<VirtualTree
  ref={treeRef}
  rootNodes={treeData}
  selectedId={selectedId}
  onSelectNode={(node) => setSelectedId(node.id)}
  getChildren={(node) => node.children ?? []}
  getNodeKey={(node) => node.id}
  defaultExpandDepth={2}
  className="h-64 border border-border rounded-md bg-card overflow-auto p-2"
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
          Expand folders, select nodes via mouse or keyboard, or use the batch controls below.
        </p>

        <ComponentPreview title="Virtual Tree Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-sm flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => treeRef.current?.expandAll()}
              >
                Expand All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => treeRef.current?.collapseAll()}
              >
                Collapse All
              </Button>
            </div>

            <VirtualTree
              ref={treeRef}
              rootNodes={SAMPLE_TREE}
              selectedId={selectedId}
              onSelectNode={(node) => setSelectedId(node.id)}
              getChildren={(node) => node.children ?? []}
              getNodeKey={(node) => node.id}
              defaultExpandDepth={2}
              className="h-64 border border-border rounded-md bg-card overflow-auto p-2"
              renderRow={({ node, depth, hasChildren, isExpanded, isSelected, toggleExpand, selectNode }) => (
                <div
                  className={`flex items-center gap-2 px-2 py-1 text-xs rounded cursor-pointer transition-colors select-none ${
                    isSelected
                      ? 'bg-primary/15 text-primary font-medium'
                      : 'hover:bg-muted/50 text-foreground'
                  }`}
                  style={{ paddingLeft: `${(depth * 16 + 8) / 16}rem` }}
                  onClick={() => {
                    selectNode();
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
            { name: 'rootNodes', type: 'readonly T[]', default: '[]', description: 'Array of top-level hierarchy nodes.' },
            { name: 'nodes', type: 'readonly T[]', default: '[]', description: 'Alias for rootNodes.' },
            { name: 'getChildren', type: '(node: T) => readonly T[]', default: '(node) => node.children', description: 'Accessor returning child nodes of a node.' },
            { name: 'getNodeKey', type: '(node: T) => string', default: '(node) => node.id', description: 'Unique identifier accessor for a node.' },
            { name: 'selectedId', type: 'string | null', default: 'null', description: 'Identifier of the currently selected node.' },
            { name: 'onSelectNode', type: '(node: T) => void', default: 'undefined', description: 'Callback invoked when a node is selected.' },
            { name: 'defaultExpandDepth', type: 'number', default: '0', description: 'Default level of expansion for child branches.' },
            { name: 'estimateSize', type: 'number', default: '32', description: 'Estimated row height for virtual calculation.' },
            { name: 'gap', type: 'number', default: '0', description: 'Spacing between adjacent rows.' },
            { name: 'overscan', type: 'number', default: '10', description: 'Buffer nodes rendered outside visible bounds.' },
            { name: 'renderRow', type: '(context: VirtualTreeRowContext<T>) => ReactNode', default: 'undefined', description: 'Custom row rendering function.' },
            { name: 'emptyNode', type: 'ReactNode', default: 'null', description: 'Content shown when tree is empty.' },
            { name: 'ref', type: 'Ref<VirtualTreeHandle>', default: 'undefined', description: 'Handle exposing expandAll(), collapseAll(), scrollToIndex().' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
