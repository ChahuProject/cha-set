import * as React from 'react';
import { observeElementRect, useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../lib/utils';
import { Input } from '../input';
import { SearchIcon } from '../lib/icons';

export interface VirtualListHandle {
  /** Scroll to a specific item index */
  scrollToIndex: (index: number, align?: 'start' | 'center' | 'end' | 'auto') => void;
}

export interface VirtualListProps<T> {
  items: readonly T[];
  /** Initial row height estimate */
  estimateSize?: number | ((index: number) => number);
  /** Function rendering an individual item */
  renderRow?: (item: T, index: number) => React.ReactNode;
  /** Alias for renderRow */
  renderItem?: (item: T, index: number) => React.ReactNode;
  /** Vertical gap between items */
  gap?: number;
  /** Number of items to render outside of the visible area */
  overscan?: number;
  /** Node to render when items list is empty */
  emptyNode?: React.ReactNode;
  /** Class name attached to scroll container */
  className?: string;
  /** Optional scroll callback receiving distance to bottom */
  onScroll?: (distanceToBottom: number) => void;
  /** Ref handle for programmatic scrolling */
  ref?: React.Ref<VirtualListHandle>;
  /** Enable search filtering within virtual list (default: false) */
  searchable?: boolean;
  /** Whether search input is open by default when searchable (default: false) */
  searchDefaultOpen?: boolean;
  /** Placeholder text for search input */
  searchPlaceholder?: string;
  /** Controlled search query */
  searchQuery?: string;
  /** Callback when search query changes */
  onSearchChange?: (query: string) => void;
  /** Custom filter predicate */
  filterItem?: (item: T, query: string) => boolean;
}

export function VirtualList<T>({
  items,
  estimateSize = 36,
  renderRow,
  renderItem,
  gap = 0,
  overscan = 8,
  emptyNode,
  className,
  onScroll,
  ref,
  searchable = false,
  searchDefaultOpen = false,
  searchPlaceholder = '搜索...',
  searchQuery: controlledQuery,
  onSearchChange,
  filterItem,
}: VirtualListProps<T>) {
  const [internalQuery, setInternalQuery] = React.useState('');
  const [searchOpen, setSearchOpen] = React.useState(searchDefaultOpen);
  const activeQuery = controlledQuery !== undefined ? controlledQuery : internalQuery;
  const isSearchVisible = searchable && (searchDefaultOpen || searchOpen || activeQuery.length > 0);

  const safeItems = items ?? [];
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const filteredItems = React.useMemo(() => {
    if (!searchable || !activeQuery.trim()) return safeItems;
    const q = activeQuery.trim().toLowerCase();
    if (filterItem) {
      return safeItems.filter((item) => filterItem(item, q));
    }
    return safeItems.filter((item: any) => {
      const label = String(item?.title ?? item?.name ?? item?.label ?? item?.displayName ?? item ?? '');
      return label.toLowerCase().includes(q);
    });
  }, [safeItems, searchable, activeQuery, filterItem]);

  const actualRenderRow = React.useMemo(
    () =>
      renderRow ??
      renderItem ??
      ((item: any) => (
        <div className="p-2 text-xs font-mono border-b border-border/40">
          {String(item?.title ?? item?.name ?? item)}
        </div>
      )),
    [renderRow, renderItem],
  );
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: (index) =>
      typeof estimateSize === 'function' ? estimateSize(index) : estimateSize,
    overscan,
    gap,
    measureElement: (element) => {
      const measured = element?.getBoundingClientRect()?.height;
      if (typeof measured === 'number' && measured > 0) {
        return measured;
      }
      const idx = Number(element?.getAttribute?.('data-index') ?? 0);
      return typeof estimateSize === 'function' ? estimateSize(idx) : estimateSize;
    },
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

  const handleContainerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!searchable) return;
    // Input-to-reveal: if typing alphanumeric key while focused on container, open search
    if (
      !isSearchVisible &&
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      setSearchOpen(true);
      const nextQ = e.key;
      if (controlledQuery === undefined) setInternalQuery(nextQ);
      onSearchChange?.(nextQ);
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleContainerKeyDown}
      className={cn('flex flex-col min-w-0 outline-none', className)}
    >
      {/* Search Bar Header */}
      {isSearchVisible && (
        <div className="p-1.5 border-b border-border bg-muted/20 shrink-0">
          <Input
            ref={searchInputRef}
            size="sm"
            value={activeQuery}
            placeholder={searchPlaceholder}
            clearable={true}
            leftIcon={<SearchIcon className="size-3.5 text-muted-foreground" />}
            onChange={(e) => {
              if (controlledQuery === undefined) setInternalQuery(e.target.value);
              onSearchChange?.(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                if (activeQuery) {
                  if (controlledQuery === undefined) setInternalQuery('');
                  onSearchChange?.('');
                } else if (!searchDefaultOpen) {
                  setSearchOpen(false);
                }
              }
            }}
            className="w-full"
          />
        </div>
      )}

      {/* Virtual Scroll Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        data-slot="virtual-list"
        className="flex-1 overflow-y-auto min-h-0"
      >
        {filteredItems.length === 0 ? (
          emptyNode ?? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              {activeQuery ? '无匹配项目' : '列表为空'}
            </div>
          )
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
                {actualRenderRow(filteredItems[virtualRow.index]!, virtualRow.index)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
