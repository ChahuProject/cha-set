import * as React from 'react';
import { observeElementRect, useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../lib/utils';

export interface TreeNode {
  id: string;
  label?: string;
  name?: string;
  title?: string;
  children?: TreeNode[];
  hasChildren?: boolean;
  [key: string]: any;
}

export type DropPosition = 'before' | 'inside' | 'after';

export interface VirtualTreeDropEvent<T> {
  sourceNodes: T[];
  sourceKeys: string[];
  targetNode: T;
  targetKey: string;
  position: DropPosition;
  isCopy?: boolean;
}

export interface VirtualTreeHandle {
  /** Scroll to a specific item index */
  scrollToIndex: (index: number, align?: 'start' | 'center' | 'end' | 'auto') => void;
  /** Scroll to a specific item by its key/id */
  scrollToId: (id: string, align?: 'start' | 'center' | 'end' | 'auto') => boolean;
  /** Expand all foldable nodes */
  expandAll: () => void;
  /** Collapse all foldable nodes */
  collapseAll: () => void;
  /** Select all visible nodes in multiple selection mode */
  selectAll: () => void;
  /** Clear all selections */
  clearSelection: () => void;
  /** Retrieve currently selected node objects */
  getSelectedNodes: () => any[];
  /** Retrieve currently selected IDs */
  getSelectedIds: () => string[];
}

export interface VirtualTreeRowContext<T> {
  node: T;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  isDimmed: boolean;
  isCopied: boolean;
  isDropTarget: boolean;
  dropPosition: DropPosition | null;
  isDropValid: boolean;
  hasChildren: boolean;
  childCount: number;
  toggleExpand: () => void;
  selectNode: (e?: React.MouseEvent) => void;
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

  // Selection API
  selectionMode?: 'single' | 'multiple' | 'none';
  selectedId?: string | null;
  selectedIds?: readonly string[] | ReadonlySet<string>;
  defaultSelectedIds?: readonly string[];
  onSelectNode?: (node: T) => void;
  onSelectionChange?: (selectedIds: string[], selectedNodes: T[]) => void;

  // Dimmed / Cut State API
  dimmedIds?: readonly string[] | ReadonlySet<string>;

  // Copied State API
  copiedIds?: readonly string[] | ReadonlySet<string>;

  // Keyboard shortcut hooks
  onCut?: (selectedNodes: T[], selectedIds: string[]) => void;
  onCopy?: (selectedNodes: T[], selectedIds: string[]) => void;
  onPaste?: (targetNode: T | null, targetPosition: 'inside' | 'after') => void;
  onDelete?: (selectedNodes: T[], selectedIds: string[]) => void;
  onEscape?: () => void;

  // Drag and Drop API
  enableDnd?: boolean;
  canDrag?: (node: T) => boolean;
  canDrop?: (event: VirtualTreeDropEvent<T>) => boolean;
  onDropNode?: (event: VirtualTreeDropEvent<T>) => void;

  showBadges?: boolean;
  onNodeToggle?: (node: T, isExpanded: boolean) => void;

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
  showBadges = true,
  onNodeToggle,
  selectionMode = 'single',
  selectedId,
  selectedIds,
  defaultSelectedIds,
  onSelectNode,
  onSelectionChange,
  dimmedIds,
  copiedIds,
  onCut,
  onCopy,
  onPaste,
  onDelete,
  onEscape,
  enableDnd = false,
  canDrag,
  canDrop,
  onDropNode,
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

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const measuredSizeRef = React.useRef(estimateSize);

  const getChildrenRef = React.useRef(safeGetChildren);
  getChildrenRef.current = safeGetChildren;
  const getNodeKeyRef = React.useRef(safeGetNodeKey);
  getNodeKeyRef.current = safeGetNodeKey;

  // Single canonical set for expanded node keys
  const [expandedKeys, setExpandedKeys] = React.useState<ReadonlySet<string>>(() => {
    const initial = new Set<string>();
    if (defaultExpandDepth > 0) {
      const traverse = (nodeList: readonly T[], depth: number) => {
        if (depth >= defaultExpandDepth) return;
        for (const n of nodeList) {
          const k = safeGetNodeKey(n);
          const ch = safeGetChildren(n) ?? [];
          if (ch.length > 0) {
            initial.add(k);
            traverse(ch, depth + 1);
          }
        }
      };
      traverse(safeRootNodes, 0);
    }
    return initial;
  });

  // Multi-selection state
  const [internalSelectedKeys, setInternalSelectedKeys] = React.useState<ReadonlySet<string>>(() => {
    if (defaultSelectedIds) return new Set(defaultSelectedIds);
    if (selectedId != null) return new Set([selectedId]);
    return new Set();
  });

  const anchorIndexRef = React.useRef<number | null>(null);

  const currentSelectedSet = React.useMemo<ReadonlySet<string>>(() => {
    if (selectedIds !== undefined) {
      return selectedIds instanceof Set ? selectedIds : new Set(selectedIds);
    }
    if (selectedId !== undefined) {
      return selectedId ? new Set([selectedId]) : new Set();
    }
    return internalSelectedKeys;
  }, [selectedIds, selectedId, internalSelectedKeys]);

  const currentDimmedSet = React.useMemo<ReadonlySet<string>>(() => {
    if (!dimmedIds) return new Set();
    return dimmedIds instanceof Set ? dimmedIds : new Set(dimmedIds);
  }, [dimmedIds]);

  const currentCopiedSet = React.useMemo<ReadonlySet<string>>(() => {
    if (!copiedIds) return new Set();
    return copiedIds instanceof Set ? copiedIds : new Set(copiedIds);
  }, [copiedIds]);

  // Drag and Drop internal state
  const [draggedKeys, setDraggedKeys] = React.useState<string[] | null>(null);
  const [dragModifier, setDragModifier] = React.useState<'move' | 'copy'>('move');
  const [dropTarget, setDropTarget] = React.useState<{
    key: string;
    position: DropPosition;
    isValid: boolean;
  } | null>(null);

  const toggleExpand = React.useCallback((node: T) => {
    const key = getNodeKeyRef.current(node);
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      const isExpandedNow = !next.has(key);
      if (isExpandedNow) {
        next.add(key);
      } else {
        next.delete(key);
      }
      onNodeToggle?.(node, isExpandedNow);
      return next;
    });
  }, [onNodeToggle]);

  const getAllKeys = React.useCallback(() => {
    const keys: string[] = [];
    const traverse = (node: T) => {
      const children = safeGetChildren(node) ?? [];
      const hasChildren = (node as any)?.hasChildren !== undefined ? Boolean((node as any).hasChildren) : children.length > 0;
      if (hasChildren) {
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
  }, [getAllKeys]);

  const collapseAll = React.useCallback(() => {
    setExpandedKeys(new Set());
  }, []);

  const visibleNodes = React.useMemo(() => {
    const results: FlatNode<T>[] = [];
    const traverse = (node: T, depth: number) => {
      const children = getChildrenRef.current(node) ?? [];
      const key = getNodeKeyRef.current(node);
      const hasChildren = (node as any)?.hasChildren !== undefined ? Boolean((node as any).hasChildren) : children.length > 0;
      const isExpanded = hasChildren && expandedKeys.has(key);

      results.push({
        node,
        depth,
        isExpanded,
        hasChildren,
        childCount: children.length,
      });

      if (isExpanded && children.length > 0) {
        for (const child of children) {
          traverse(child, depth + 1);
        }
      }
    };

    for (const root of safeRootNodes) {
      traverse(root, 0);
    }
    return results;
  }, [safeRootNodes, expandedKeys]);

  const updateSelection = React.useCallback(
    (nextKeys: Set<string>, lastClickedNode?: T) => {
      if (selectedIds === undefined && selectedId === undefined) {
        setInternalSelectedKeys(nextKeys);
      }
      const keysArr = Array.from(nextKeys);
      const keyMap = new Map<string, T>();
      for (const flat of visibleNodes) {
        keyMap.set(safeGetNodeKey(flat.node), flat.node);
      }
      const selectedNodes = keysArr.map((k) => keyMap.get(k)).filter(Boolean) as T[];
      onSelectionChange?.(keysArr, selectedNodes);
      if (lastClickedNode) {
        onSelectNode?.(lastClickedNode);
      }
    },
    [selectedIds, selectedId, visibleNodes, safeGetNodeKey, onSelectionChange, onSelectNode],
  );

  const handleNodeClick = React.useCallback(
    (flatIndex: number, e?: React.MouseEvent) => {
      if (selectionMode === 'none' || flatIndex < 0 || flatIndex >= visibleNodes.length) return;
      const target = visibleNodes[flatIndex]!;
      const key = safeGetNodeKey(target.node);
      setFocusedIndex(flatIndex);

      if (selectionMode === 'single') {
        anchorIndexRef.current = flatIndex;
        updateSelection(new Set([key]), target.node);
        return;
      }

      // selectionMode === 'multiple'
      const isShift = Boolean(e?.shiftKey);
      const isCtrlOrCmd = Boolean(e?.ctrlKey || e?.metaKey);

      if (isShift && anchorIndexRef.current != null) {
        const start = Math.min(anchorIndexRef.current, flatIndex);
        const end = Math.max(anchorIndexRef.current, flatIndex);
        const rangeKeys = new Set(isCtrlOrCmd ? currentSelectedSet : []);
        for (let i = start; i <= end; i++) {
          rangeKeys.add(safeGetNodeKey(visibleNodes[i]!.node));
        }
        updateSelection(rangeKeys, target.node);
      } else if (isCtrlOrCmd) {
        const nextSet = new Set(currentSelectedSet);
        if (nextSet.has(key)) {
          nextSet.delete(key);
        } else {
          nextSet.add(key);
        }
        anchorIndexRef.current = flatIndex;
        updateSelection(nextSet, target.node);
      } else {
        anchorIndexRef.current = flatIndex;
        updateSelection(new Set([key]), target.node);
      }
    },
    [selectionMode, visibleNodes, safeGetNodeKey, currentSelectedSet, updateSelection],
  );

  const selectAll = React.useCallback(() => {
    if (selectionMode !== 'multiple' || visibleNodes.length === 0) return;
    const allKeys = new Set(visibleNodes.map((n) => safeGetNodeKey(n.node)));
    updateSelection(allKeys);
  }, [selectionMode, visibleNodes, safeGetNodeKey, updateSelection]);

  const clearSelection = React.useCallback(() => {
    anchorIndexRef.current = null;
    updateSelection(new Set());
  }, [updateSelection]);

  const getSelectedNodes = React.useCallback(() => {
    const keyMap = new Map<string, T>();
    for (const flat of visibleNodes) {
      keyMap.set(safeGetNodeKey(flat.node), flat.node);
    }
    return Array.from(currentSelectedSet)
      .map((k) => keyMap.get(k))
      .filter(Boolean) as T[];
  }, [visibleNodes, safeGetNodeKey, currentSelectedSet]);

  const getSelectedIds = React.useCallback(() => {
    return Array.from(currentSelectedSet);
  }, [currentSelectedSet]);

  // Cycle prevention helper: verifies if candidateKey is a descendant of ancestorKey
  const isDescendantOf = React.useCallback(
    (ancestorKey: string, candidateKey: string): boolean => {
      let found = false;
      const search = (node: T) => {
        const k = safeGetNodeKey(node);
        if (k === ancestorKey) {
          const scanSubtree = (child: T) => {
            if (safeGetNodeKey(child) === candidateKey) {
              found = true;
              return;
            }
            const children = safeGetChildren(child) ?? [];
            for (const c of children) {
              if (found) return;
              scanSubtree(c);
            }
          };
          const children = safeGetChildren(node) ?? [];
          for (const c of children) {
            if (found) return;
            scanSubtree(c);
          }
          return;
        }
        const children = safeGetChildren(node) ?? [];
        for (const c of children) {
          if (found) return;
          search(c);
        }
      };

      for (const root of safeRootNodes) {
        if (found) break;
        search(root);
      }
      return found;
    },
    [safeRootNodes, safeGetChildren, safeGetNodeKey],
  );

  // DnD Handlers
  const handleDragStart = (e: React.DragEvent, node: T, nodeKey: string) => {
    if (!enableDnd) return;
    if (canDrag && !canDrag(node)) {
      e.preventDefault();
      return;
    }

    const sourceKeys =
      currentSelectedSet.has(nodeKey) && currentSelectedSet.size > 1
        ? Array.from(currentSelectedSet)
        : [nodeKey];

    setDraggedKeys(sourceKeys);
    e.dataTransfer.effectAllowed = 'copyMove';
    e.dataTransfer.setData('text/plain', JSON.stringify(sourceKeys));
  };

  const handleDragOver = (e: React.DragEvent, targetNode: T, flatNode: FlatNode<T>) => {
    if (!enableDnd || !draggedKeys || draggedKeys.length === 0) return;
    e.preventDefault();

    const targetKey = safeGetNodeKey(targetNode);
    const rect = e.currentTarget.getBoundingClientRect();
    const rowHeight = rect.height || (rect.bottom - rect.top) || 32;
    const rawClientY = typeof e.clientY === 'number' ? e.clientY : (e.nativeEvent as any)?.clientY;
    const ratio = typeof rawClientY === 'number' && !isNaN(rawClientY)
      ? (rawClientY - rect.top) / rowHeight
      : (flatNode.hasChildren ? 0.5 : 0.8);

    let position: DropPosition = 'inside';
    if (ratio < 0.25) {
      position = 'before';
    } else if (ratio > 0.75) {
      position = 'after';
    } else {
      position = flatNode.hasChildren ? 'inside' : ratio < 0.5 ? 'before' : 'after';
    }

    // Cycle & Validity check
    let isValid = !draggedKeys.includes(targetKey);
    if (isValid) {
      for (const srcKey of draggedKeys) {
        if (isDescendantOf(srcKey, targetKey)) {
          isValid = false;
          break;
        }
      }
    }

    if (isValid && canDrop) {
      const keyMap = new Map<string, T>();
      for (const flat of visibleNodes) {
        keyMap.set(safeGetNodeKey(flat.node), flat.node);
      }
      const sourceNodes = draggedKeys.map((k) => keyMap.get(k)).filter(Boolean) as T[];
      isValid = canDrop({
        sourceNodes,
        sourceKeys: draggedKeys,
        targetNode,
        targetKey,
        position,
      });
    }

    const isCopy = e.ctrlKey || e.metaKey;
    setDragModifier(isCopy ? 'copy' : 'move');
    e.dataTransfer.dropEffect = isValid ? (isCopy ? 'copy' : 'move') : 'none';
    setDropTarget({
      key: targetKey,
      position,
      isValid,
    });
  };

  const handleDragLeave = (e: React.DragEvent, nodeKey: string) => {
    if (!enableDnd) return;
    const related = e.relatedTarget as Node | null;
    if (e.currentTarget.contains(related)) return;
    if (dropTarget?.key === nodeKey) {
      setDropTarget(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetNode: T) => {
    if (!enableDnd || !draggedKeys || !dropTarget || !dropTarget.isValid) return;
    e.preventDefault();

    const targetKey = safeGetNodeKey(targetNode);
    const keyMap = new Map<string, T>();
    for (const flat of visibleNodes) {
      keyMap.set(safeGetNodeKey(flat.node), flat.node);
    }
    const sourceNodes = draggedKeys.map((k) => keyMap.get(k)).filter(Boolean) as T[];
    const isCopy = Boolean(e.ctrlKey || e.metaKey || dragModifier === 'copy');

    onDropNode?.({
      sourceNodes,
      sourceKeys: draggedKeys,
      targetNode,
      targetKey,
      position: dropTarget.position,
      isCopy,
    });

    setDraggedKeys(null);
    setDropTarget(null);
    setDragModifier('move');
  };

  const handleDragEnd = () => {
    setDraggedKeys(null);
    setDropTarget(null);
    setDragModifier('move');
  };

  const getRootFontSize = React.useCallback(() => {
    if (typeof window === 'undefined') return 16;
    const size = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    return Number.isFinite(size) && size > 0 ? size : 16;
  }, []);

  const virtualizer = useVirtualizer({
    count: visibleNodes.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => (estimateSize / 16) * getRootFontSize(),
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

  // Re-measure virtual items when root font size changes (UI scaling) or window resizes
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleScale = () => {
      virtualizer.measure();
    };
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && (m.attributeName === 'style' || m.attributeName === 'class')) {
          virtualizer.measure();
          break;
        }
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
    window.addEventListener('resize', handleScale);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleScale);
    };
  }, [virtualizer]);

  React.useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (index, align = 'auto') => {
        virtualizer.scrollToIndex(index, { align });
      },
      scrollToId: (id, align = 'auto') => {
        const idx = visibleNodes.findIndex((n) => safeGetNodeKey(n.node) === id);
        if (idx !== -1) {
          virtualizer.scrollToIndex(idx, { align });
          return true;
        }
        return false;
      },
      expandAll,
      collapseAll,
      selectAll,
      clearSelection,
      getSelectedNodes,
      getSelectedIds,
    }),
    [virtualizer, visibleNodes, safeGetNodeKey, expandAll, collapseAll, selectAll, clearSelection, getSelectedNodes, getSelectedIds],
  );

  const [focusedIndex, setFocusedIndex] = React.useState(0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (visibleNodes.length === 0) return;
    const current = visibleNodes[focusedIndex];
    if (!current) return;

    // Clipboard shortcuts: Ctrl/Cmd + X / C / V / A
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;

    if (isCtrlOrCmd && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      selectAll();
      return;
    }

    if (isCtrlOrCmd && (e.key === 'x' || e.key === 'X')) {
      e.preventDefault();
      onCut?.(getSelectedNodes(), getSelectedIds());
      return;
    }

    if (isCtrlOrCmd && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      onCopy?.(getSelectedNodes(), getSelectedIds());
      return;
    }

    if (isCtrlOrCmd && (e.key === 'v' || e.key === 'V')) {
      e.preventDefault();
      let targetFlat = current;
      if (currentSelectedSet.size > 0) {
        const lastSelectedKey = Array.from(currentSelectedSet).pop();
        const found = visibleNodes.find((fn) => safeGetNodeKey(fn.node) === lastSelectedKey);
        if (found) targetFlat = found;
      }
      onPaste?.(targetFlat ? targetFlat.node : null, targetFlat?.hasChildren ? 'inside' : 'after');
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      onEscape?.();
      return;
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (currentSelectedSet.size > 0) {
        e.preventDefault();
        onDelete?.(getSelectedNodes(), getSelectedIds());
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(visibleNodes.length - 1, focusedIndex + 1);
      setFocusedIndex(next);
      virtualizer.scrollToIndex(next, { align: 'auto' });

      if (e.shiftKey && selectionMode === 'multiple') {
        if (anchorIndexRef.current == null) {
          anchorIndexRef.current = focusedIndex;
        }
        const start = Math.min(anchorIndexRef.current, next);
        const end = Math.max(anchorIndexRef.current, next);
        const rangeKeys = new Set<string>();
        for (let i = start; i <= end; i++) {
          rangeKeys.add(safeGetNodeKey(visibleNodes[i]!.node));
        }
        updateSelection(rangeKeys, visibleNodes[next]!.node);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max(0, focusedIndex - 1);
      setFocusedIndex(prev);
      virtualizer.scrollToIndex(prev, { align: 'auto' });

      if (e.shiftKey && selectionMode === 'multiple') {
        if (anchorIndexRef.current == null) {
          anchorIndexRef.current = focusedIndex;
        }
        const start = Math.min(anchorIndexRef.current, prev);
        const end = Math.max(anchorIndexRef.current, prev);
        const rangeKeys = new Set<string>();
        for (let i = start; i <= end; i++) {
          rangeKeys.add(safeGetNodeKey(visibleNodes[i]!.node));
        }
        updateSelection(rangeKeys, visibleNodes[prev]!.node);
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (current.hasChildren && !current.isExpanded) {
        toggleExpand(current.node);
      } else if (current.hasChildren && current.isExpanded) {
        const next = Math.min(visibleNodes.length - 1, focusedIndex + 1);
        setFocusedIndex(next);
        virtualizer.scrollToIndex(next, { align: 'auto' });
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (current.hasChildren && current.isExpanded) {
        toggleExpand(current.node);
      } else if (current.depth > 0) {
        for (let i = focusedIndex - 1; i >= 0; i--) {
          if (visibleNodes[i]!.depth === current.depth - 1) {
            setFocusedIndex(i);
            virtualizer.scrollToIndex(i, { align: 'auto' });
            break;
          }
        }
      }
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      if (selectionMode === 'multiple') {
        const key = safeGetNodeKey(current.node);
        const nextSet = new Set(currentSelectedSet);
        if (nextSet.has(key)) nextSet.delete(key);
        else nextSet.add(key);
        anchorIndexRef.current = focusedIndex;
        updateSelection(nextSet, current.node);
      } else if (selectionMode === 'single') {
        handleNodeClick(focusedIndex);
      }
      if (current.hasChildren) {
        toggleExpand(current.node);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleNodeClick(focusedIndex);
      if (current.hasChildren) {
        toggleExpand(current.node);
      }
    }
  };

  const safeRenderRow = React.useMemo(
    () =>
      renderRow ??
      (({ node, depth, hasChildren, isExpanded, isSelected, isDimmed, isCopied, toggleExpand, selectNode }) => (
        <div
          className={cn(
            'flex items-center gap-2 px-2 py-1 text-xs cursor-pointer rounded select-none transition-colors duration-quick ease-standard',
            isSelected
              ? 'bg-primary/15 text-primary font-medium border border-primary/25'
              : 'hover:bg-muted/50 text-foreground border border-transparent',
            isDimmed && 'opacity-40 transition-opacity',
            isCopied && 'ring-1 ring-primary/60 bg-primary/10',
          )}
          style={{ paddingLeft: `${depth * 1 + 0.5}rem` }}
          onClick={(e) => {
            selectNode(e);
          }}
        >
          {hasChildren ? (
            <span
              className="text-micro w-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand();
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </span>
          ) : (
            <span className="w-3.5 text-micro text-muted-foreground/50">•</span>
          )}
          <span className="font-mono">
            {(node as any)?.label ?? (node as any)?.name ?? (node as any)?.title ?? String(node)}
          </span>
        </div>
      )),
    [renderRow],
  );

  return (
    <div
      ref={scrollContainerRef}
      role="tree"
      aria-multiselectable={selectionMode === 'multiple' ? true : undefined}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      data-slot="virtual-tree"
      className={cn(
        'relative overflow-y-auto outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md',
        className,
      )}
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
            const isSelected = currentSelectedSet.has(nodeKey);
            const isDimmed = currentDimmedSet.has(nodeKey);
            const isCopied = currentCopiedSet.has(nodeKey);
            const isTarget = dropTarget != null && dropTarget.key === nodeKey;
            const dropPos = dropTarget != null && dropTarget.key === nodeKey ? dropTarget.position : null;
            const isDropValid = dropTarget != null && dropTarget.key === nodeKey ? dropTarget.isValid : false;

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                data-focused={isFocused ? true : undefined}
                data-selected={isSelected ? true : undefined}
                data-dimmed={isDimmed ? true : undefined}
                data-copied={isCopied ? true : undefined}
                data-drop-target={isTarget ? true : undefined}
                data-drop-position={dropPos ?? undefined}
                data-drop-valid={isTarget ? isDropValid : undefined}
                draggable={enableDnd && (canDrag ? canDrag(flat.node) : true)}
                onDragStart={(e) => handleDragStart(e, flat.node, nodeKey)}
                onDragOver={(e) => handleDragOver(e, flat.node, flat)}
                onDragLeave={(e) => handleDragLeave(e, nodeKey)}
                onDrop={(e) => handleDrop(e, flat.node)}
                onDragEnd={handleDragEnd}
                ref={virtualizer.measureElement}
                className={cn(
                  'absolute top-0 left-0 w-full',
                  isFocused && 'ring-1 ring-ring/40 rounded',
                  enableDnd && 'cursor-grab active:cursor-grabbing',
                )}
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                {/* Visual Drop Indicators */}
                {isTarget && isDropValid && dropPos === 'before' && (
                  <div
                    data-slot="drop-indicator-before"
                    className="absolute top-0 left-0 right-0 h-0.5 bg-primary z-20 pointer-events-none"
                  />
                )}
                {isTarget && isDropValid && dropPos === 'after' && (
                  <div
                    data-slot="drop-indicator-after"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary z-20 pointer-events-none"
                  />
                )}
                {isTarget && isDropValid && dropPos === 'inside' && (
                  <div
                    data-slot="drop-indicator-inside"
                    className="absolute inset-0 ring-2 ring-primary/80 bg-primary/10 rounded pointer-events-none z-20"
                  />
                )}
                {isTarget && !isDropValid && (
                  <div
                    data-slot="drop-indicator-invalid"
                    className="absolute inset-0 ring-1 ring-destructive/40 bg-destructive/5 rounded pointer-events-none z-20"
                  />
                )}

                {safeRenderRow({
                  node: flat.node,
                  depth: flat.depth,
                  isExpanded: flat.isExpanded,
                  isSelected,
                  isDimmed,
                  isCopied,
                  isDropTarget: isTarget,
                  dropPosition: dropPos,
                  isDropValid,
                  hasChildren: flat.hasChildren,
                  childCount: flat.childCount,
                  toggleExpand: () => toggleExpand(flat.node),
                  selectNode: (e) => handleNodeClick(virtualRow.index, e),
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Drag Modifier HUD Tooltip */}
      {enableDnd && draggedKeys && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1.5 rounded-md bg-popover/95 px-2.5 py-1 text-xs text-popover-foreground shadow-md border border-border backdrop-blur-xs z-30 transition-all select-none"
        >
          <span className="font-medium">{dragModifier === 'copy' ? 'Copying' : 'Moving'}</span>
          <span className="text-muted-foreground">({dragModifier === 'copy' ? 'Ctrl held' : 'Hold Ctrl to copy'})</span>
        </div>
      )}
    </div>
  );
}
