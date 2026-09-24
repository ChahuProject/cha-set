import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { ScrollArea } from '../scroll-area';

export interface TocItem {
  id: string;
  title: string;
  level?: number;
  disabled?: boolean;
  children?: TocItem[];
}

export interface FlattenedTocItem extends TocItem {
  depth: number;
}

export function flattenTocItems(items: TocItem[], parentDepth = 1): FlattenedTocItem[] {
  const result: FlattenedTocItem[] = [];

  for (const item of items) {
    const depth = item.level ?? parentDepth;
    result.push({
      ...item,
      depth,
    });

    if (item.children && item.children.length > 0) {
      result.push(...flattenTocItems(item.children, depth + 1));
    }
  }

  return result;
}

/** Active indicator bar height, matching the previous fixed `h-4` marker. */
const INDICATOR_HEIGHT_REM = 1;

export const tableOfContentsVariants = cva('flex flex-col text-xs', {
  variants: {
    variant: {
      default: '',
      // The guide track itself is rendered by the item container for every
      // variant so the sliding indicator can align with it; `track` only adds
      // the inset that separates labels from the line.
      track: 'pl-3',
      flat: '',
    },
    size: {
      default: 'gap-2.5',
      sm: 'gap-1.5 text-[0.6875rem]',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface TableOfContentsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'>,
    VariantProps<typeof tableOfContentsVariants> {
  items: TocItem[];
  activeId?: string;
  title?: string;
  showTitle?: boolean;
  showTrack?: boolean;
  topOffset?: number | string;
  targetOffset?: number;
  onSelect?: (item: TocItem, event: React.MouseEvent | React.KeyboardEvent) => void;
  scrollArea?: boolean;
}

export const TableOfContents = React.forwardRef<HTMLElement, TableOfContentsProps>(
  (
    {
      className,
      items = [],
      activeId: controlledActiveId,
      title = 'On this page',
      showTitle = true,
      showTrack = true,
      topOffset = 0,
      targetOffset = 0,
      variant = 'default',
      size = 'default',
      onSelect,
      scrollArea = false,
      style,
      ...props
    },
    ref
  ) => {
    const flatItems = React.useMemo(() => flattenTocItems(items), [items]);
    const [internalActiveId, setInternalActiveId] = React.useState<string>(() => flatItems[0]?.id || '');
    const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;

    const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
    const [modality, setModality] = React.useState<'pointer' | 'keyboard'>('pointer');

    const listRef = React.useRef<HTMLDivElement>(null);
    const itemRefs = React.useRef(new Map<string, HTMLAnchorElement>());
    const [indicator, setIndicator] = React.useState<{ top: number; height: number } | null>(null);

    const showTrackLine = showTrack && variant !== 'flat';
    const itemsKey = React.useMemo(() => flatItems.map((item) => item.id).join('|'), [flatItems]);

    // The single active marker is a sibling of the labels rather than a child of
    // one of them, so switching sections slides one bar instead of swapping two
    // static bars. Geometry is measured from the live DOM because row height is
    // font-relative and therefore changes with interface scale.
    React.useEffect(() => {
      const el = itemRefs.current.get(activeId);
      if (!el) {
        setIndicator(null);
        return;
      }

      const sync = () => {
        const next = { top: el.offsetTop, height: el.offsetHeight };
        setIndicator((prev) => (prev && prev.top === next.top && prev.height === next.height ? prev : next));
      };

      sync();

      if (typeof ResizeObserver === 'undefined' || !listRef.current) return;
      const observer = new ResizeObserver(sync);
      observer.observe(listRef.current);
      return () => observer.disconnect();
    }, [activeId, flatItems]);

    const handleSelect = (item: TocItem, event: React.MouseEvent | React.KeyboardEvent) => {
      if (item.disabled) return;
      if (controlledActiveId === undefined) {
        setInternalActiveId(item.id);
      }
      onSelect?.(item, event);

      if (typeof window !== 'undefined' && item.id) {
        const el = document.getElementById(item.id);
        if (el) {
          if (targetOffset && targetOffset > 0) {
            const rect = el.getBoundingClientRect();
            const top = window.pageYOffset + rect.top - targetOffset;
            window.scrollTo({ top, behavior: 'smooth' });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      if (flatItems.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setModality('keyboard');
        setFocusedIndex((prev) => {
          let next = prev + 1;
          while (next < flatItems.length && flatItems[next]?.disabled) {
            next++;
          }
          return next < flatItems.length ? next : prev;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setModality('keyboard');
        setFocusedIndex((prev) => {
          let next = prev - 1;
          while (next >= 0 && flatItems[next]?.disabled) {
            next--;
          }
          return next >= 0 ? next : prev;
        });
      } else if (e.key === 'Home') {
        e.preventDefault();
        setModality('keyboard');
        const first = flatItems.findIndex((it) => !it.disabled);
        if (first !== -1) setFocusedIndex(first);
      } else if (e.key === 'End') {
        e.preventDefault();
        setModality('keyboard');
        for (let i = flatItems.length - 1; i >= 0; i--) {
          if (!flatItems[i]?.disabled) {
            setFocusedIndex(i);
            break;
          }
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < flatItems.length) {
          const item = flatItems[focusedIndex];
          if (item && !item.disabled) {
            handleSelect(item, e);
          }
        }
      }
    };

    const parsedTopOffset = typeof topOffset === 'number' ? (topOffset > 0 ? `${topOffset * 0.0625}rem` : undefined) : topOffset;

    const content = (
      <nav
        aria-label={title}
        className={cn('flex flex-col', tableOfContentsVariants({ variant, size }))}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {showTitle && title && (
          <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[0.6875rem] select-none mb-1">
            {title}
          </span>
        )}

        <div
          ref={listRef}
          key={itemsKey}
          className={cn(
            'flex flex-col relative animate-in fade-in-0 slide-in-from-left-2 animate-in-quick',
            showTrackLine && 'border-l border-border/50'
          )}
        >
          {/* Sliding active marker: one bar, animated between rows. */}
          {showTrackLine && indicator && (
            <span
              aria-hidden="true"
              data-slot="toc-indicator"
              className="pointer-events-none absolute left-0 top-0 -ml-[0.0625rem] w-[0.125rem] rounded-full bg-primary transition-[transform,height] duration-quick ease-standard"
              style={{
                height: `${INDICATOR_HEIGHT_REM}rem`,
                transform: `translateY(${
                  indicator.top +
                  indicator.height / 2 -
                  (INDICATOR_HEIGHT_REM *
                    (typeof window !== 'undefined'
                      ? parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16
                      : 16)) /
                    2
                }px)`,
              }}
            />
          )}

          {flatItems.map((item, index) => {
            const isActive = activeId === item.id;
            const isFocused = modality === 'keyboard' && focusedIndex === index;
            const indentLevel = Math.max(0, item.depth - 1);
            const indentRem = `${indentLevel * 0.75 + 0.625}rem`;

            return (
              <a
                key={item.id}
                ref={(node) => {
                  if (node) itemRefs.current.set(item.id, node);
                  else itemRefs.current.delete(item.id);
                }}
                href={`#${item.id}`}
                aria-current={isActive ? 'true' : undefined}
                aria-level={item.depth}
                aria-disabled={item.disabled ? 'true' : undefined}
                tabIndex={-1}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(item, e);
                }}
                onPointerMove={() => {
                  if (modality !== 'pointer') setModality('pointer');
                }}
                style={{
                  paddingLeft: indentRem,
                }}
                className={cn(
                  'relative group flex items-center py-1 text-left transition-[color,opacity] duration-quick ease-standard truncate select-none',
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed pointer-events-none'
                    : 'cursor-pointer',
                  isActive
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground',
                  isFocused && 'ring-1 ring-primary/40 rounded-sm'
                )}
              >
                <span className="truncate">{item.title}</span>
              </a>
            );
          })}
        </div>
      </nav>
    );

    const mergedStyle = {
      ...(parsedTopOffset ? { top: parsedTopOffset } : {}),
      ...style,
    };

    return (
      <aside
        ref={ref}
        className={cn('w-full', className)}
        style={mergedStyle}
        {...props}
      >
        {scrollArea ? (
          <ScrollArea className="h-full w-full">
            {content}
          </ScrollArea>
        ) : (
          content
        )}
      </aside>
    );
  }
);

TableOfContents.displayName = 'TableOfContents';
