import * as React from 'react';
import { observeElementRect, useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../lib/utils';

export interface VirtualListHandle {
  /** Scroll to a specific item index */
  scrollToIndex: (index: number, align?: 'start' | 'center' | 'end' | 'auto') => void;
}

export interface VirtualListProps<T> {
  items: readonly T[];
  /** Initial row height estimate (px) */
  estimateSize?: number;
  /** Function rendering an individual item */
  renderRow: (item: T, index: number) => React.ReactNode;
  /** Vertical gap between items (px) */
  gap?: number;
  /** Number of items to render outside of the visible area */
  overscan?: number;
  /** Node to render when items list is empty */
  emptyNode?: React.ReactNode;
  /** Class name attached to scroll container */
  className?: string;
  /** Optional scroll callback receiving distance to bottom in pixels */
  onScroll?: (distanceToBottom: number) => void;
  /** Ref handle for programmatic scrolling */
  ref?: React.Ref<VirtualListHandle>;
}

export function VirtualList<T>({
  items,
  estimateSize = 36,
  renderRow,
  gap = 0,
  overscan = 8,
  emptyNode,
  className,
  onScroll,
  ref,
}: VirtualListProps<T>) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const measuredSizeRef = React.useRef(estimateSize);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => measuredSizeRef.current,
    overscan,
    gap,
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
    }),
    [virtualizer],
  );

  const handleScroll = onScroll
    ? (event: React.UIEvent<HTMLDivElement>) => {
        const el = event.currentTarget;
        onScroll(el.scrollHeight - el.scrollTop - el.clientHeight);
      }
    : undefined;

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      data-slot="virtual-list"
      className={cn('overflow-y-auto', className)}
    >
      {items.length === 0 ? (
        emptyNode ?? null
      ) : (
        <div
          data-slot="virtual-list-content"
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize(), flexShrink: 0 }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="absolute top-0 left-0 w-full"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              {renderRow(items[virtualRow.index]!, virtualRow.index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
