import * as React from 'react';
import { observeElementRect, useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../lib/utils';

export interface VirtualGridHandle {
  /** Scroll to a specific item index */
  scrollToIndex: (index: number, align?: 'start' | 'center' | 'end' | 'auto') => void;
}

export interface VirtualGridProps<T = any> {
  items?: readonly T[];
  renderCard?: (item: T, index: number) => React.ReactNode;
  /** Alias for renderCard */
  renderItem?: (item: T, index: number) => React.ReactNode;
  /** Cell renderer fallback */
  renderCell?: (row: number, col: number) => React.ReactNode;
  /** Minimum card column width (rem, default: 12) */
  minColumnWidthRem?: number;
  /** Gap between grid items (rem, default: 0.75) */
  gapRem?: number;
  /** Estimated row height (default: 180) */
  estimateSize?: number;
  /** Overscan rows (default: 4) */
  overscan?: number;
  /** Empty state element */
  emptyNode?: React.ReactNode;
  /** Class name attached to scroll container */
  className?: string;
  /** Ref handle for programmatic scrolling */
  ref?: React.Ref<VirtualGridHandle>;
}

export function VirtualGrid<T>({
  items: rawItems,
  renderCard,
  renderItem,
  renderCell,
  minColumnWidthRem = 12,
  gapRem = 0.75,
  estimateSize = 180,
  overscan = 4,
  emptyNode,
  className,
  ref,
}: VirtualGridProps<T>) {
  const items = rawItems ?? [];
  const actualRenderCard = React.useMemo(() => {
    if (renderCard) return renderCard;
    if (renderItem) return renderItem;
    if (renderCell) return (_: any, idx: number) => renderCell(Math.floor(idx / 10), idx % 10);
    return (item: any, idx: number) => (
      <div className="p-3 border border-border/60 rounded-lg bg-card text-xs text-card-foreground font-mono">
        {String(item?.title ?? item?.name ?? item ?? `Item ${idx}`)}
      </div>
    );
  }, [renderCard, renderItem, renderCell]);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const measuredSizeRef = React.useRef(estimateSize);
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const update = () => setContainerWidth(container.clientWidth);
    update();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(update);
      observer.observe(container);
      if (typeof document !== 'undefined') {
        observer.observe(document.documentElement);
      }
      return () => observer.disconnect();
    }
  }, []);

  const rootFontSize =
    typeof document !== 'undefined'
      ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      : 16;
  const minColWidthPx = minColumnWidthRem * rootFontSize;
  const gapPx = gapRem * rootFontSize;
  const colWidth = containerWidth > 0 ? containerWidth : 1000;
  const columnCount = Math.max(1, Math.floor((colWidth + gapPx) / (minColWidthPx + gapPx)));

  const rows = React.useMemo(() => {
    const result: T[][] = [];
    for (let i = 0; i < items.length; i += columnCount) {
      result.push(items.slice(i, i + columnCount));
    }
    return result;
  }, [items, columnCount]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => measuredSizeRef.current,
    overscan,
    gap: gapPx,
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
        const rowIndex = Math.floor(index / Math.max(1, columnCount));
        virtualizer.scrollToIndex(rowIndex, { align });
      },
    }),
    [virtualizer, columnCount],
  );

  return (
    <div
      ref={scrollContainerRef}
      data-slot="virtual-grid"
      className={cn('overflow-y-auto', className)}
    >
      {rows.length === 0 ? (
        emptyNode ?? null
      ) : (
        <div
          data-slot="virtual-grid-content"
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize(), flexShrink: 0 }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="absolute top-0 left-0 w-full"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                gap: gapPx,
              }}
            >
              {rows[virtualRow.index]!.map((item, colIndex) => (
                <div key={colIndex} className="min-w-0">
                  {actualRenderCard(item, virtualRow.index * columnCount + colIndex)}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
