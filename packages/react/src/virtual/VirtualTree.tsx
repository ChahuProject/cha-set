import * as React from 'react';
import { observeElementRect, useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../lib/utils';

export interface VirtualTreeRowContext<T> {
  node: T;
  depth: number;
  isExpanded: boolean;
  hasChildren: boolean;
  childCount: number;
  toggleExpand: () => void;
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
      (({ node, depth, hasChildren, isExpanded, toggleExpand }) => (
        <div
          className="flex items-center gap-2 px-2 py-1 text-xs cursor-pointer hover:bg-muted/50 rounded select-none"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={hasChildren ? toggleExpand : undefined}
        >
          {hasChildren ? (
            <span className="text-[10px] w-3.5 text-muted-foreground">{isExpanded ? '▼' : '▶'}</span>
          ) : (
            <span className="w-3.5 text-[10px] text-muted-foreground/50">•</span>
          )}
          <span className="font-mono text-foreground">
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

  return (
    <div
      ref={scrollContainerRef}
      data-slot="virtual-tree"
      className={cn('overflow-y-auto', className)}
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
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="absolute top-0 left-0 w-full"
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                {safeRenderRow({
                  node: flat.node,
                  depth: flat.depth,
                  isExpanded: flat.isExpanded,
                  hasChildren: flat.hasChildren,
                  childCount: flat.childCount,
                  toggleExpand: () => toggleExpand(flat.node, flat.depth, flat.isExpanded),
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
