import * as React from 'react';
import { cn } from '../lib/utils';
import { Kbd } from './Kbd';
import {
  composeShortcuts,
  type ComposeShortcutsOptions,
} from './composeShortcuts';
import type {
  ShortcutItem,
  ShortcutPresetName,
  KbdSize,
  KbdVariant,
  KbdCompact,
} from '@chahu/spec/kbd';

export interface ShortcutBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Custom list of shortcut items to render */
  items?: ShortcutItem[];
  /** Base preset to inherit shortcuts from (default: undefined, falls back to items or 'dropdown') */
  preset?: ShortcutPresetName;
  /** Additional shortcuts to append */
  additionalShortcuts?: ShortcutItem[];
  /** Shortcuts to prepend */
  prependShortcuts?: ShortcutItem[];
  /** Field overrides indexed by shortcut id */
  overrides?: Record<string, Partial<ShortcutItem>>;
  /** IDs of shortcuts to exclude */
  exclude?: string[];
  /** Compact symbol mode for keys (default: 'auto') */
  compact?: KbdCompact;
  /** Keycap size (default: 'xs') */
  size?: KbdSize;
  /** Keycap visual variant (default: 'outline') */
  variant?: KbdVariant;
  /** Whether to show '+N' badge when items overflow (default: true) */
  showOverflowCount?: boolean;
  /** Force compact symbol rendering (for test hooks) */
  forceCompact?: boolean;
  /** Maximum number of visible items before collapsing (optional override) */
  maxVisibleItems?: number;
}

/**
 * Universal responsive shortcut bar for dialogs, popovers, dropdown menus, and address bars.
 * Enforces single-line height containment, responsive symbol compacting, and priority-based overflow.
 */
export const ShortcutBar = React.forwardRef<HTMLDivElement, ShortcutBarProps>(
  (
    {
      items: rawItems,
      preset,
      additionalShortcuts,
      prependShortcuts,
      overrides,
      exclude,
      compact = 'auto',
      size = 'xs',
      variant = 'outline',
      showOverflowCount = true,
      forceCompact = false,
      maxVisibleItems,
      className,
      ...props
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const measureRef = React.useRef<HTMLDivElement | null>(null);

    // Merge shortcuts through composition engine
    const effectiveItems = React.useMemo(() => {
      const base = rawItems ?? preset ?? 'dropdown';
      const options: ComposeShortcutsOptions = {
        append: additionalShortcuts,
        prepend: prependShortcuts,
        overrides,
        exclude,
      };
      return composeShortcuts(base, options);
    }, [rawItems, preset, additionalShortcuts, prependShortcuts, overrides, exclude]);

    // Responsive measurement states
    const [containerWidth, setContainerWidth] = React.useState<number>(0);
    const [isHoveringOverflow, setIsHoveringOverflow] = React.useState<boolean>(false);

    // Observe container width
    React.useEffect(() => {
      const el = containerRef.current;
      if (!el || typeof ResizeObserver === 'undefined') return;

      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          if (width > 0) {
            setContainerWidth(width);
          }
        }
      });

      ro.observe(el);
      // Initial measure
      setContainerWidth(el.clientWidth);

      return () => ro.disconnect();
    }, []);

    // Calculate item visibility & compact decision
    const { visibleItems, overflowItems, effectiveCompact } = React.useMemo(() => {
      if (effectiveItems.length === 0) {
        return {
          visibleItems: [],
          overflowItems: [],
          effectiveCompact: compact === 'always' || forceCompact,
        };
      }

      // If containerWidth hasn't been measured yet (e.g. first paint or SSR),
      // or if maxVisibleItems is explicitly specified:
      if (maxVisibleItems !== undefined) {
        const vis = effectiveItems.slice(0, maxVisibleItems);
        const ov = effectiveItems.slice(maxVisibleItems);
        return {
          visibleItems: vis,
          overflowItems: ov,
          effectiveCompact: compact === 'always' || forceCompact,
        };
      }

      const measureEl = measureRef.current;
      if (!measureEl || containerWidth <= 0) {
        return {
          visibleItems: effectiveItems,
          overflowItems: [],
          effectiveCompact: compact === 'always' || forceCompact,
        };
      }

      // Check width of items from measureEl
      const childNodes = Array.from(measureEl.children) as HTMLElement[];
      const badgeWidth = 36; // estimated badge width in px
      const gap = 12; // gap-3 = 12px

      let totalNormalWidth = 0;
      const itemWidths: number[] = [];

      for (let i = 0; i < childNodes.length; i++) {
        const w = childNodes[i]?.offsetWidth || 60;
        itemWidths.push(w);
        totalNormalWidth += w + (i > 0 ? gap : 0);
      }

      const fitsNormal = totalNormalWidth <= containerWidth;
      const shouldCompact =
        forceCompact ||
        compact === 'always' ||
        (compact === 'auto' && !fitsNormal);

      if (fitsNormal && compact !== 'always' && !forceCompact) {
        return {
          visibleItems: effectiveItems,
          overflowItems: [],
          effectiveCompact: false,
        };
      }

      // In compact mode, items shrink by ~30%
      const compactScale = 0.75;
      let accumulatedWidth = 0;
      const vis: ShortcutItem[] = [];
      const ov: ShortcutItem[] = [];

      // Sort items by priority ascending (1 = high priority kept first)
      const indexedItems = effectiveItems.map((item, originalIndex) => ({
        item,
        originalIndex,
        width: (itemWidths[originalIndex] || 60) * (shouldCompact ? compactScale : 1),
      }));

      // High priority items first for space allocation
      const sortedByPriority = [...indexedItems].sort(
        (a, b) => (a.item.priority ?? 1) - (b.item.priority ?? 1),
      );

      const availableSpace = containerWidth - (showOverflowCount ? badgeWidth + gap : 0);

      // Greedily pick items by priority that fit
      const acceptedOriginalIndices = new Set<number>();

      for (const entry of sortedByPriority) {
        const itemNeeded = entry.width + (acceptedOriginalIndices.size > 0 ? gap : 0);
        if (accumulatedWidth + itemNeeded <= availableSpace) {
          accumulatedWidth += itemNeeded;
          acceptedOriginalIndices.add(entry.originalIndex);
        } else if (acceptedOriginalIndices.size === 0 && containerWidth > 80) {
          // Guarantee at least the single highest priority item if width allows
          accumulatedWidth += entry.width;
          acceptedOriginalIndices.add(entry.originalIndex);
        }
      }

      // Partition preserving original display sequence
      for (let i = 0; i < effectiveItems.length; i++) {
        const it = effectiveItems[i];
        if (!it) continue;
        if (acceptedOriginalIndices.has(i)) {
          vis.push(it);
        } else {
          ov.push(it);
        }
      }


      return {
        visibleItems: vis.length > 0 ? vis : effectiveItems.slice(0, 1),
        overflowItems: vis.length > 0 ? ov : effectiveItems.slice(1),
        effectiveCompact: shouldCompact,
      };
    }, [effectiveItems, containerWidth, compact, forceCompact, maxVisibleItems, showOverflowCount]);

    // Construct tooltip text for overflow badge
    const overflowTooltipText = React.useMemo(() => {
      if (overflowItems.length === 0) return '';
      return overflowItems
        .map((it) => `${it.keys.join('+')}: ${it.label}`)
        .join(' | ');
    }, [overflowItems]);

    // Forward ref assignment
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    return (
      <div
        ref={setRefs}
        data-slot="shortcut-bar"
        className={cn(
          'relative flex h-6.5 min-w-0 max-w-full shrink-0 select-none items-center overflow-visible whitespace-nowrap text-micro text-muted-foreground',
          className,
        )}
        {...props}
      >
        {/* Hidden measurement strip */}
        <div
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-0 top-0 flex items-center gap-3 whitespace-nowrap opacity-0"
          style={{ position: 'absolute', zIndex: -999 }}
        >
          {effectiveItems.map((item) => (
            <div key={`measure-${item.id}`} className="flex items-center gap-1 shrink-0">
              {item.keys.map((k, kIdx) => (
                <Kbd key={`measure-${item.id}-${kIdx}`} size={size} variant={variant} compact="never">
                  {k}
                </Kbd>
              ))}
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Visible Shortcut Items */}
        <div className="flex min-w-0 items-center gap-3 overflow-hidden">
          {visibleItems.map((item) => (
            <span
              key={`visible-${item.id}`}
              data-slot="shortcut-item"
              className={cn(
                'inline-flex shrink-0 items-center gap-1',
                item.disabled && 'opacity-50',
              )}
            >
              {item.keys.map((keyStr, kIdx) => (
                <Kbd
                  key={`key-${item.id}-${kIdx}`}
                  size={size}
                  variant={variant}
                  compact={effectiveCompact ? 'always' : 'never'}
                >
                  {keyStr}
                </Kbd>
              ))}
              <span className="truncate">
                {effectiveCompact && item.shortLabel ? item.shortLabel : item.label}
              </span>
            </span>
          ))}
        </div>

        {/* Overflow '+N' Badge with interactive hover card */}
        {showOverflowCount && overflowItems.length > 0 && (
          <div
            className="relative ml-2 inline-flex shrink-0 items-center"
            onMouseEnter={() => setIsHoveringOverflow(true)}
            onMouseLeave={() => setIsHoveringOverflow(false)}
          >
            <Kbd
              size={size}
              variant="outline"
              title={overflowTooltipText}
              className="cursor-pointer font-medium hover:border-primary/50 hover:text-foreground"
            >
              +{overflowItems.length}
            </Kbd>

            {/* Floating Popover on Hover */}
            {isHoveringOverflow && (
              <div
                role="tooltip"
                className="absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 rounded-md border border-border bg-popover px-2.5 py-1.5 text-nano text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-micro font-medium text-muted-foreground">
                    更多快捷键
                  </span>
                  <div className="flex flex-col gap-1">
                    {overflowItems.map((ovItem) => (
                      <div
                        key={`ov-${ovItem.id}`}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-0.5">
                          {ovItem.keys.map((k, kIdx) => (
                            <Kbd key={`ov-kbd-${kIdx}`} size="xs" variant="outline" compact="auto">
                              {k}
                            </Kbd>
                          ))}
                        </div>
                        <span className="text-foreground">{ovItem.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

ShortcutBar.displayName = 'ShortcutBar';
