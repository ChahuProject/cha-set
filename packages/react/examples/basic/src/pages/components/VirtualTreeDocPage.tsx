import React, { useState, useRef } from 'react';
import {
  VirtualTree,
  type TreeNode,
  type VirtualTreeHandle,
  type VirtualTreeDropEvent,
  Button,
  Badge,
  CodeBlock,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

const INITIAL_TREE: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'Button.tsx', label: 'Button.tsx' },
          { id: 'Input.tsx', label: 'Input.tsx' },
          { id: 'Dialog.tsx', label: 'Dialog.tsx' },
        ],
      },
      {
        id: 'virtual',
        label: 'virtual',
        children: [
          { id: 'VirtualList.tsx', label: 'VirtualList.tsx' },
          { id: 'VirtualTree.tsx', label: 'VirtualTree.tsx' },
          { id: 'VirtualGrid.tsx', label: 'VirtualGrid.tsx' },
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
  { id: 'README.md', label: 'README.md' },
];

function moveNodesInTree(
  tree: TreeNode[],
  sourceKeys: string[],
  targetKey: string,
  position: 'before' | 'inside' | 'after',
): TreeNode[] {
  const extracted: TreeNode[] = [];
  function removeSource(nodes: TreeNode[]): TreeNode[] {
    const next: TreeNode[] = [];
    for (const n of nodes) {
      if (sourceKeys.includes(n.id)) {
        extracted.push(n);
      } else {
        const copy = { ...n };
        if (copy.children) {
          copy.children = removeSource(copy.children);
        }
        next.push(copy);
      }
    }
    return next;
  }

  const cleanedTree = removeSource(tree);
  if (extracted.length === 0) return tree;

  function insertTarget(nodes: TreeNode[]): TreeNode[] {
    const next: TreeNode[] = [];
    for (const n of nodes) {
      if (n.id === targetKey) {
        if (position === 'before') {
          next.push(...extracted, n);
        } else if (position === 'after') {
          next.push(n, ...extracted);
        } else {
          // inside
          const copy = { ...n };
          copy.children = copy.children ? [...copy.children, ...extracted] : [...extracted];
          next.push(copy);
        }
      } else {
        const copy = { ...n };
        if (copy.children) {
          copy.children = insertTarget(copy.children);
        }
        next.push(copy);
      }
    }
    return next;
  }

  return insertTarget(cleanedTree);
}

function removeNodesInTree(tree: TreeNode[], targetKeys: string[]): TreeNode[] {
  const next: TreeNode[] = [];
  for (const n of tree) {
    if (!targetKeys.includes(n.id)) {
      const copy = { ...n };
      if (copy.children) {
        copy.children = removeNodesInTree(copy.children, targetKeys);
      }
      next.push(copy);
    }
  }
  return next;
}

export function VirtualTreeDocPage() {
  const treeRef = useRef<VirtualTreeHandle>(null);
  const [treeData, setTreeData] = useState<TreeNode[]>(INITIAL_TREE);
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('multiple');
  const [selectedIds, setSelectedIds] = useState<string[]>(['Button.tsx']);
  const [cutIds, setCutIds] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('Ready. Try selecting files or dragging to reorder.');

  const handleCut = (selectedNodes: TreeNode[], ids: string[]) => {
    if (ids.length === 0) return;
    setCutIds(ids);
    setStatusMessage(`Cut ${ids.length} item(s) (dimmed). Select a target folder or file and press Ctrl+V to paste.`);
  };

  const handleCopy = (selectedNodes: TreeNode[], ids: string[]) => {
    setStatusMessage(`Copied ${ids.length} item(s) to clipboard.`);
  };

  const handlePaste = (targetNode: TreeNode | null, position: 'inside' | 'after') => {
    if (cutIds.length === 0) {
      setStatusMessage('Clipboard is empty. Press Ctrl+X to cut items first.');
      return;
    }
    if (!targetNode) {
      setStatusMessage('No target selected for paste.');
      return;
    }
    const nextTree = moveNodesInTree(treeData, cutIds, targetNode.id, position);
    setTreeData(nextTree);
    setCutIds([]);
    setStatusMessage(`Pasted ${cutIds.length} item(s) into/after "${targetNode.label || targetNode.id}".`);
  };

  const handleDelete = (selectedNodes: TreeNode[], ids: string[]) => {
    if (ids.length === 0) return;
    const nextTree = removeNodesInTree(treeData, ids);
    setTreeData(nextTree);
    setSelectedIds([]);
    setStatusMessage(`Deleted ${ids.length} item(s).`);
  };

  const handleDropNode = (evt: VirtualTreeDropEvent<TreeNode>) => {
    const nextTree = moveNodesInTree(treeData, evt.sourceKeys, evt.targetKey, evt.position);
    setTreeData(nextTree);
    setStatusMessage(`Moved ${evt.sourceKeys.join(', ')} -> ${evt.position} "${evt.targetNode.label || evt.targetKey}".`);
  };

  const reactCode = `<VirtualTree
  ref={treeRef}
  rootNodes={treeData}
  selectionMode="${selectionMode}"
  selectedIds={selectedIds}
  onSelectionChange={(ids) => setSelectedIds(ids)}
  dimmedIds={cutIds}
  enableDnd
  onDropNode={(evt) => handleDrop(evt)}
  onCut={(nodes, ids) => setCutIds(ids)}
  onPaste={(target, pos) => handlePaste(target, pos)}
  onDelete={(nodes, ids) => handleDelete(ids)}
  defaultExpandDepth={2}
  className="h-72 border border-border rounded-md bg-card overflow-auto p-2"
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
          Hierarchical tree with multi-selection (Ctrl/Shift+Click), external dimmed cut state (Ctrl+X/V), and drag-and-drop reordering.
        </p>

        <ComponentPreview title="Virtual Tree Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-md flex flex-col gap-3">
            {/* Control Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectionMode((prev) => (prev === 'multiple' ? 'single' : 'multiple'))
                }
              >
                Mode: {selectionMode === 'multiple' ? 'Multi' : 'Single'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedIds.length === 0}
                onClick={() => handleCut([], selectedIds)}
              >
                Cut (Ctrl+X)
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={cutIds.length === 0 || selectedIds.length === 0}
                onClick={() => {
                  const targetKey = selectedIds[0];
                  const findNode = (nodes: TreeNode[]): TreeNode | null => {
                    for (const n of nodes) {
                      if (n.id === targetKey) return n;
                      if (n.children) {
                        const sub = findNode(n.children);
                        if (sub) return sub;
                      }
                    }
                    return null;
                  };
                  const target = findNode(treeData);
                  if (target) handlePaste(target, target.children ? 'inside' : 'after');
                }}
              >
                Paste (Ctrl+V)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTreeData(INITIAL_TREE);
                  setCutIds([]);
                  setSelectedIds(['Button.tsx']);
                  setStatusMessage('Reset tree to default.');
                }}
              >
                Reset
              </Button>
            </div>

            {/* Virtual Tree Component */}
            <VirtualTree<TreeNode>
              ref={treeRef}
              rootNodes={treeData}
              selectionMode={selectionMode}
              selectedIds={selectedIds}
              onSelectionChange={(ids) => setSelectedIds(ids)}
              dimmedIds={cutIds}
              enableDnd
              onDropNode={handleDropNode}
              onCut={handleCut}
              onCopy={handleCopy}
              onPaste={handlePaste}
              onDelete={handleDelete}
              getChildren={(node) => node.children ?? []}
              getNodeKey={(node) => node.id}
              defaultExpandDepth={2}
              className="h-72 border border-border rounded-md bg-card overflow-auto p-2"
              renderRow={({
                node,
                depth,
                hasChildren,
                isExpanded,
                isSelected,
                isDimmed,
                toggleExpand,
                selectNode,
              }) => (
                <div
                  className={`flex items-center gap-2 px-2 py-1 text-xs rounded cursor-pointer transition-colors select-none ${
                    isSelected
                      ? 'bg-primary/15 text-primary font-medium'
                      : 'hover:bg-muted/50 text-foreground'
                  } ${isDimmed ? 'opacity-40' : ''}`}
                  style={{ paddingLeft: `${(depth * 16 + 8) / 16}rem` }}
                  onClick={(e) => {
                    selectNode(e);
                    if (hasChildren && !e.shiftKey && !e.ctrlKey && !e.metaKey) toggleExpand();
                  }}
                >
                  {hasChildren ? (
                    <span className="text-micro w-3.5 text-muted-foreground">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  ) : (
                    <span className="w-3.5 text-micro text-muted-foreground/50">•</span>
                  )}
                  <span className="font-mono">{node.label}</span>
                  {hasChildren && (
                    <Badge variant="outline" className="text-nano ml-auto">
                      dir
                    </Badge>
                  )}
                </div>
              )}
            />

            {/* Telemetry / Status Footer */}
            <div className="flex flex-col gap-1 text-xs text-muted-foreground bg-muted/30 p-2 rounded border border-border">
              <div className="flex items-center justify-between">
                <span>
                  Selected: <strong className="text-foreground">{selectedIds.length > 0 ? selectedIds.join(', ') : 'None'}</strong>
                </span>
                {cutIds.length > 0 && (
                  <Badge variant="secondary" className="text-nano">
                    {cutIds.length} cut (dimmed)
                  </Badge>
                )}
              </div>
              <div className="truncate text-micro text-muted-foreground/80">
                {statusMessage}
              </div>
            </div>
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
            { name: 'selectionMode', type: "'single' | 'multiple' | 'none'", default: "'single'", description: 'Active selection interaction mode.' },
            { name: 'selectedId', type: 'string | null', default: 'null', description: 'Identifier of the currently selected node (single mode).' },
            { name: 'selectedIds', type: 'readonly string[]', default: '[]', description: 'Array of selected node identifiers (multiple mode).' },
            { name: 'dimmedIds', type: 'readonly string[]', default: '[]', description: 'Array of node IDs rendered in dimmed/cut state.' },
            { name: 'enableDnd', type: 'boolean', default: 'false', description: 'Enables drag-and-drop reordering and folder nesting.' },
            { name: 'onSelectionChange', type: '(ids: string[], nodes: T[]) => void', default: 'undefined', description: 'Callback fired when selected nodes change.' },
            { name: 'onDropNode', type: '(evt: VirtualTreeDropEvent<T>) => void', default: 'undefined', description: 'Callback fired when nodes are dropped.' },
            { name: 'onCut', type: '(nodes: T[], ids: string[]) => void', default: 'undefined', description: 'Callback fired on Ctrl+X cut shortcut.' },
            { name: 'onPaste', type: '(target: T | null, pos: string) => void', default: 'undefined', description: 'Callback fired on Ctrl+V paste shortcut.' },
            { name: 'defaultExpandDepth', type: 'number', default: '0', description: 'Default level of expansion for child branches.' },
            { name: 'estimateSize', type: 'number', default: '32', description: 'Estimated row height for virtual calculation.' },
            { name: 'gap', type: 'number', default: '0', description: 'Spacing between adjacent rows.' },
            { name: 'overscan', type: 'number', default: '10', description: 'Buffer nodes rendered outside visible bounds.' },
            { name: 'renderRow', type: '(context: VirtualTreeRowContext<T>) => ReactNode', default: 'undefined', description: 'Custom row rendering function.' },
            { name: 'emptyNode', type: 'ReactNode', default: 'null', description: 'Content shown when tree is empty.' },
            { name: 'ref', type: 'Ref<VirtualTreeHandle>', default: 'undefined', description: 'Handle exposing expandAll(), collapseAll(), selectAll(), scrollToIndex().' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
