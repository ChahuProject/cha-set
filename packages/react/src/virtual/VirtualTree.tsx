import * as React from 'react';
import { observeElementRect, useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../lib/utils';

export interface VirtualTreeHandle {
  /** Scroll to a specific item index */
  scrollToIndex: (index: number, align?: 'start' | 'center' | 'end' | 'auto') => void;
  /** Expand all foldable nodes */
  expandAll: () => void;
  /** Collapse all foldable nodes */
  collapseAll: () => void;
}

export interface VirtualTreeRowContext<T> {
  node: T;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  hasChildren: boolean;
  childCount: number;
  toggleExpand: () => void;
  selectNode: () => void;
}

export interface VirtualTreeProps<T> {
  rootNodes?: readonly T[];
  /** Alias for rootNodes */
  nodes?: readonly T[];
  getChildren?: (node: T) => readonly T[];
  getNodeKey?: (node: T) => string;
  defaultExpandDepth?: number;
  estimateSize?: number;
  gap?: number;
  overscan?: number;
  renderRow?: (context: VirtualTreeRowContext<T>) => React.ReactNode;
  emptyNode?: React.ReactNode;
  className?: string;
  selectedId?: string | null;
  onSelectNode?: (node: T) => void;
  ref?: React.Ref<VirtualTreeHandle>;
}

interface FlatNode<T> {
  node: T;
  depth: number;
  isExpanded: boolean;
  hasChildren: boolean;
  childCount: number;
}

export function VirtualTree<T>({
  rootNodes,
  nodes,
  getChildren,
  getNodeKey,
  defaultExpandDepth = 0,
  estimateSize = 32,
  gap = 0,
  overscan = 10,
  renderRow,
  emptyNode,
  className,
  selectedId,
  onSelectNode,
  ref,
}: VirtualTreeProps<T>) {
  const safeRootNodes = rootNodes ?? nodes ?? [];
  const safeGetChildren = React.useMemo(
    () => getChildren ?? ((node: any) => node?.children ?? []),
    [getChildren],
  );
  const safeGetNodeKey = React.useMemo(
    () => getNodeKey ?? ((node: any) => node?.id ?? node?.key ?? String(node)),
    [getNodeKey],
  );
  const safeRenderRow = React.useMemo(
    () =>
      renderRow ??
      (({ node, depth, hasChildren, isExpanded, isSelected, toggleExpand, selectNode }) => (
        <div
          className={cn(
            'flex items-center gap-2 px-2 py-1 text-xs cursor-pointer rounded select-none transition-colors',
            isSelected
              ? 'bg-primary/15 text-primary font-medium'
              : 'hover:bg-muted/50 text-foreground',
          )}
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
          <span className="font-mono">
            {(node as any)?.label ?? (node as any)?.name ?? (node as any)?.title ?? String(node)}
          </span>
        </div>
      )),
    [renderRow],
  );

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const measuredSizeRef = React.useRef(estimateSize);

  const getChildrenRef = React.useRef(safeGetChildren);
  getChildrenRef.current = safeGetChildren;
  const getNodeKeyRef = React.useRef(safeGetNodeKey);
  getNodeKeyRef.current = safeGetNodeKey;

  const [expandedKeys, setExpandedKeys] = React.useState<ReadonlySet<string>>(new Set());
  const [collapsedKeys, setCollapsedKeys] = React.useState<ReadonlySet<string>>(new Set());

  const toggleExpand = React.useCallback(
    (node: T, depth: number, currentlyExpanded: boolean) => {
      const key = getNodeKeyRef.current(node);
      if (currentlyExpanded) {
        if (depth < defaultExpandDepth) {
          setCollapsedKeys((prev) => new Set(prev).add(key));
        } else {
          setExpandedKeys((prev) => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
        }
      } else {
        if (depth < defaultExpandDepth) {
          setCollapsedKeys((prev) => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
        } else {
          setExpandedKeys((prev) => new Set(prev).add(key));
        }
      }
    },
    [defaultExpandDepth],
  );

  const getAllKeys = React.useCallback(() => {
    const keys: string[] = [];
    const traverse = (node: T) => {
      const children = safeGetChildren(node) ?? [];
      if (children.length > 0) {
        keys.push(safeGetNodeKey(node));
        for (const child of children) {
          traverse(child);
        }
      }
    };
    for (const root of safeRootNodes) {
      traverse(root);
    }
    return keys;
  }, [safeRootNodes, safeGetChildren, safeGetNodeKey]);

  const expandAll = React.useCallback(() => {
    const all = getAllKeys();
    setExpandedKeys(new Set(all));
    setCollapsedKeys(new Set());
  }, [getAllKeys]);

  const collapseAll = React.useCallback(() => {
    const all = getAllKeys();
    setCollapsedKeys(new Set(all));
    setExpandedKeys(new Set());
  }, [getAllKeys]);

  const visibleNodes = React.useMemo(() => {
    const results: FlatNode<T>[] = [];
    const traverse = (node: T, depth: number) => {
      const children = getChildrenRef.current(node) ?? [];
      const key = getNodeKeyRef.current(node);
      const isExpanded =
        children.length > 0 &&
        (depth < defaultExpandDepth ? !collapsedKeys.has(key) : expandedKeys.has(key));

      results.push({
        node,
        depth,
        isExpanded,
        hasChildren: children.length > 0,
        childCount: children.length,
      });

      if (isExpanded) {
        for (const child of children) {
          traverse(child, depth + 1);
        }
      }
    };

    for (const root of safeRootNodes) {
      traverse(root, 0);
    }
    return results;
  }, [safeRootNodes, defaultExpandDepth, expandedKeys, collapsedKeys]);

  const virtualizer = useVirtualizer({
    count: visibleNodes.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => measuredSizeRef.current,
    overscan,
    gap,
    getItemKey: (index) => getNodeKeyRef.current(visibleNodes[index]!.node),
    observeElementRect: (instance, cb) => {
      return observeElementRect(instance, (rect) => {
        cb({
          width: rect.width || 1000,
          height: rect.height || 600,
        });
      });
    },
  });

  React.useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (index, align = 'auto') => {
        virtualizer.scrollToIndex(index, { align });
      },
      expandAll,
      collapseAll,
    }),
    [virtualizer, expandAll, collapseAll],
  );

  const [focusedIndex, setFocusedIndex] = React.useState(0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (visibleNodes.length === 0) return;
    const current = visibleNodes[focusedIndex];
    if (!current) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(visibleNodes.length - 1, focusedIndex + 1);
      setFocusedIndex(next);
      virtualizer.scrollToIndex(next, { align: 'auto' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max(0, focusedIndex - 1);
      setFocusedIndex(prev);
      virtualizer.scrollToIndex(prev, { align: 'auto' });
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (current.hasChildren && !current.isExpanded) {
        toggleExpand(current.node, current.depth, current.isExpanded);
      } else if (current.hasChildren && current.isExpanded) {
        const next = Math.min(visibleNodes.length - 1, focusedIndex + 1);
        setFocusedIndex(next);
        virtualizer.scrollToIndex(next, { align: 'auto' });
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (current.hasChildren && current.isExpanded) {
        toggleExpand(current.node, current.depth, current.isExpanded);
      } else if (current.depth > 0) {
        for (let i = focusedIndex - 1; i >= 0; i--) {
          if (visibleNodes[i]!.depth === current.depth - 1) {
            setFocusedIndex(i);
            virtualizer.scrollToIndex(i, { align: 'auto' });
            break;
          }
        }
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectNode?.(current.node);
      if (current.hasChildren) {
        toggleExpand(current.node, current.depth, current.isExpanded);
      }
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      role="tree"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      data-slot="virtual-tree"
      className={cn('overflow-y-auto outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md', className)}
    >
      {visibleNodes.length === 0 ? (
        emptyNode ?? null
      ) : (
        <div
          data-slot="virtual-tree-content"
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize(), flexShrink: 0 }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const flat = visibleNodes[virtualRow.index]!;
            const isFocused = virtualRow.index === focusedIndex;
            const nodeKey = safeGetNodeKey(flat.node);
            const isSelected = selectedId != null && nodeKey === selectedId;
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                data-focused={isFocused ? true : undefined}
                ref={virtualizer.measureElement}
                className={cn('absolute top-0 left-0 w-full', isFocused && 'ring-1 ring-ring/40 rounded')}
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                {safeRenderRow({
                  node: flat.node,
                  depth: flat.depth,
                  isExpanded: flat.isExpanded,
                  isSelected,
                  hasChildren: flat.hasChildren,
                  childCount: flat.childCount,
                  toggleExpand: () => toggleExpand(flat.node, flat.depth, flat.isExpanded),
                  selectNode: () => onSelectNode?.(flat.node),
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
