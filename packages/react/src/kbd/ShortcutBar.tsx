import * as React from 'react';
import { createPortal } from 'react-dom';
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

function getRootFontSize(): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 16;
  const parsed = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 16;
}

/**
 * Fallback width calculation for SSR or jsdom test environments
 */
function estimateFallbackWidth(
  item: ShortcutItem,
  mode: 'full' | 'squeezed' | 'compact',
): number {
  const isCompact = mode === 'compact';
  const numKeys = item.keys.length || 1;
  let keysW = 0;
  for (let i = 0; i < numKeys; i++) {
    const k = item.keys[i] || '';
    const isArrow = /^(Up|Down|Left|Right|ArrowUp|ArrowDown|ArrowLeft|ArrowRight)$/i.test(k);
    const isSymbol = /^(Enter|Esc|Escape|Tab|Space|Backspace)$/i.test(k);
    const kw =
      isCompact && (isArrow || isSymbol)
        ? 18
        : isCompact
          ? Math.max(18, k.length * 6 + 6)
          : Math.max(20, k.length * 7 + 8);
    keysW += kw + (i > 0 ? (isCompact ? 2 : 3) : 0);
  }
  const label = isCompact && item.shortLabel ? item.shortLabel : (item.label || '');
  let labelW = 0;
  if (label.length > 0) {
    const cjkCharW = isCompact ? 10 : 12;
    const latinCharW = isCompact ? 6 : 7;
    for (let i = 0; i < label.length; i++) {
      const code = label.charCodeAt(i);
      labelW += code >= 0x4e00 && code <= 0x9fff ? cjkCharW : latinCharW;
    }
    labelW += isCompact ? 2 : 4;
  }
  const itemPadding = isCompact ? 4 : 8; // px-1 = 8px padding
  return keysW + labelW + itemPadding;
}

function formatShortcutTooltip(item: ShortcutItem): string {
  if (!item.keys || item.keys.length === 0) return '';
  const isNav =
    item.id === 'nav' ||
    (item.keys.includes('Up') && item.keys.includes('Down')) ||
    (item.keys.includes('Left') && item.keys.includes('Right'));
  return isNav ? item.keys.join(' / ') : item.keys.join('+');
}

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
  /** Optional callback notified whenever responsive stage transitions between full, squeezed, compact, and folded */
  onStageChange?: (stage: 'full' | 'squeezed' | 'compact' | 'folded') => void;
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
      onStageChange,
      className,
      ...props
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const badgeRef = React.useRef<HTMLDivElement | null>(null);
    const normalStripRef = React.useRef<HTMLDivElement | null>(null);
    const squeezedStripRef = React.useRef<HTMLDivElement | null>(null);
    const compactStripRef = React.useRef<HTMLDivElement | null>(null);
    const badgeMeasureRef = React.useRef<HTMLDivElement | null>(null);

    const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

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
    const [measureVersion, setMeasureVersion] = React.useState<number>(0);
    const [popoverPos, setPopoverPos] = React.useState<{
      top: number;
      bottom: number;
      left: number;
      placeBelow: boolean;
    } | null>(null);

    // Active hovered item tooltip
    const [activeTooltip, setActiveTooltip] = React.useState<{
      item: ShortcutItem;
      rect: DOMRect;
      formattedShortcut: string;
    } | null>(null);
    const itemTooltipTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleItemMouseEnter = (item: ShortcutItem, target: HTMLElement) => {
      if (itemTooltipTimerRef.current) {
        clearTimeout(itemTooltipTimerRef.current);
        itemTooltipTimerRef.current = null;
      }
      const rect = target.getBoundingClientRect();
      setActiveTooltip({
        item,
        rect,
        formattedShortcut: formatShortcutTooltip(item),
      });
    };

    const handleItemMouseLeave = () => {
      itemTooltipTimerRef.current = setTimeout(() => {
        setActiveTooltip(null);
      }, 120);
    };

    // Observe container width
    React.useEffect(() => {
      const el = containerRef.current;
      if (!el || typeof ResizeObserver === 'undefined') return;

      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = el.clientWidth || entry.contentRect.width;
          if (width > 0) {
            setContainerWidth(width);
          }
        }
      });

      ro.observe(el);
      if (el.clientWidth > 0) {
        setContainerWidth(el.clientWidth);
      }

      return () => ro.disconnect();
    }, []);

    // Trigger measurement tick when relevant props change
    React.useLayoutEffect(() => {
      setMeasureVersion((v) => v + 1);
    }, [effectiveItems, size, variant, compact]);

    // Measure strip widths
    const getMeasuredWidths = React.useCallback(
      (
        strip: HTMLDivElement | null,
        mode: 'full' | 'squeezed' | 'compact',
      ): number[] => {
        if (!strip) {
          return effectiveItems.map((it) => estimateFallbackWidth(it, mode));
        }
        const children = Array.from(strip.children) as HTMLElement[];
        if (children.length !== effectiveItems.length) {
          return effectiveItems.map((it) => estimateFallbackWidth(it, mode));
        }
        return children.map((el, i) => {
          const rect = el.getBoundingClientRect();
          const w = rect.width || el.offsetWidth;
          return w > 0 ? w : estimateFallbackWidth(effectiveItems[i]!, mode);
        });
      },
      [effectiveItems],
    );

    // Progressive Multi-Stage Responsive Engine:
    // 1. Loops visible item count k from N down to 1 (maximizing visible count, eliminating premature +N badges).
    // 2. For the k visible items, loops compact count c from 0 to k:
    //    The rightmost c items are compact symbols, while leftmost (k - c) items remain full text.
    // 3. When an item folds into +1, remaining items immediately attempt larger/full sizes to eliminate blank space.
    const { visibleItems, overflowItems, responsiveStage } =
      React.useMemo(() => {
        if (effectiveItems.length === 0) {
          return {
            visibleItems: [] as { item: ShortcutItem; isCompact: boolean }[],
            overflowItems: [] as ShortcutItem[],
            responsiveStage: 'full' as const,
          };
        }

        if (maxVisibleItems !== undefined && maxVisibleItems >= 0) {
          const vis = effectiveItems.slice(0, maxVisibleItems);
          const ov = effectiveItems.slice(maxVisibleItems);
          const isComp = compact === 'always' || forceCompact;
          return {
            visibleItems: vis.map((item) => ({ item, isCompact: isComp })),
            overflowItems: ov,
            responsiveStage: ov.length > 0 ? ('folded' as const) : ('full' as const),
          };
        }

        if (containerWidth <= 0) {
          const isComp = compact === 'always' || forceCompact;
          return {
            visibleItems: effectiveItems.map((item) => ({ item, isCompact: isComp })),
            overflowItems: [] as ShortcutItem[],
            responsiveStage: isComp ? ('compact' as const) : ('full' as const),
          };
        }

        const availableInnerWidth = Math.max(0, containerWidth - 4);
        const normalGap = 10;
        const compactGap = 6;

        const measuredBadgeWidth = badgeMeasureRef.current
          ? (badgeMeasureRef.current.firstElementChild as HTMLElement)?.getBoundingClientRect().width ||
            badgeMeasureRef.current.getBoundingClientRect().width ||
            badgeMeasureRef.current.offsetWidth
          : 0;
        const badgeWidth = measuredBadgeWidth > 0 ? measuredBadgeWidth : 32;

        const normalWidths = getMeasuredWidths(normalStripRef.current, 'full');
        const compactWidths = getMeasuredWidths(compactStripRef.current, 'compact');

        // Priority order for overflow folding: lowest priority / rightmost items fold first
        const priorityOrder = [...effectiveItems]
          .map((item, idx) => ({ item, index: idx, priority: item.priority ?? 1 }))
          .sort((a, b) => {
            if (a.priority !== b.priority) return a.priority - b.priority;
            return a.index - b.index;
          });

        const N = effectiveItems.length;
        let bestConfig: {
          visibleItems: { item: ShortcutItem; isCompact: boolean }[];
          overflowItems: ShortcutItem[];
          responsiveStage: 'full' | 'squeezed' | 'compact' | 'folded';
        } | null = null;

        // Try visible count k from N down to 1
        for (let k = N; k >= 1; k--) {
          const hasOverflow = k < N;
          const badgeSpace = hasOverflow && showOverflowCount ? badgeWidth + compactGap : 0;
          const targetAvail = availableInnerWidth - badgeSpace;
          if (targetAvail < 0 && k > 1) continue;

          // Visible items set (top k by priority, kept in original display order)
          const keptIndices = new Set(priorityOrder.slice(0, k).map((p) => p.index));
          const currentVisible: ShortcutItem[] = [];
          const currentOverflow: ShortcutItem[] = [];
          for (let i = 0; i < N; i++) {
            if (keptIndices.has(i)) {
              currentVisible.push(effectiveItems[i]!);
            } else {
              currentOverflow.push(effectiveItems[i]!);
            }
          }

          // Try compact count c from 0 (all full) to k (all compact)
          // Rightmost c items are compact; leftmost (k - c) items are full text
          for (let c = 0; c <= k; c++) {
            if ((compact === 'always' || forceCompact) && c < k) continue;
            if (compact === 'never' && c > 0) continue;

            const gap = c === 0 ? normalGap : compactGap;
            let totalW = Math.max(0, k - 1) * gap;

            for (let vIdx = 0; vIdx < k; vIdx++) {
              const origIdx = effectiveItems.indexOf(currentVisible[vIdx]!);
              const itemIsCompact = vIdx >= k - c;
              const w = itemIsCompact ? compactWidths[origIdx]! : normalWidths[origIdx]!;
              totalW += w;
            }

            if (totalW <= targetAvail) {
              const stage: 'full' | 'squeezed' | 'compact' | 'folded' = hasOverflow
                ? 'folded'
                : c === k
                  ? 'compact'
                  : c > 0
                    ? 'squeezed'
                    : 'full';

              bestConfig = {
                visibleItems: currentVisible.map((item, vIdx) => ({
                  item,
                  isCompact: vIdx >= k - c,
                })),
                overflowItems: currentOverflow,
                responsiveStage: stage,
              };
              break;
            }
          }

          if (bestConfig) break;
        }

        return (
          bestConfig ?? {
            visibleItems: [{ item: effectiveItems[0]!, isCompact: true }],
            overflowItems: effectiveItems.slice(1),
            responsiveStage: 'folded' as const,
          }
        );
      }, [
        effectiveItems,
        containerWidth,
        compact,
        forceCompact,
        maxVisibleItems,
        showOverflowCount,
        measureVersion,
        getMeasuredWidths,
      ]);

    // Notify stage change listener if provided
    React.useEffect(() => {
      onStageChange?.(responsiveStage);
    }, [responsiveStage, onStageChange]);

    // Position calculation for portal popover
    const updatePopoverPos = React.useCallback(() => {
      if (!badgeRef.current) return;
      const rect = badgeRef.current.getBoundingClientRect();
      const placeBelow = rect.top < 160;
      const top = rect.bottom + 6;
      const bottom =
        typeof window !== 'undefined' ? window.innerHeight - rect.top + 6 : 0;
      const popoverWidth = 176; // 11rem
      const center = rect.left + rect.width / 2;
      const left =
        typeof window !== 'undefined'
          ? Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, center - popoverWidth / 2))
          : rect.left;
      setPopoverPos({ top, bottom, left, placeBelow });
    }, []);

    const handleBadgeMouseEnter = () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      updatePopoverPos();
      setIsHoveringOverflow(true);
    };

    const handleBadgeMouseLeave = () => {
      closeTimerRef.current = setTimeout(() => {
        setIsHoveringOverflow(false);
      }, 150);
    };

    const handlePopoverMouseEnter = () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };

    const handlePopoverMouseLeave = () => {
      closeTimerRef.current = setTimeout(() => {
        setIsHoveringOverflow(false);
      }, 150);
    };

    // Close on escape or update position on scroll/resize
    React.useEffect(() => {
      if (!isHoveringOverflow && !activeTooltip) return;

      const handleScrollOrResize = () => {
        updatePopoverPos();
        setActiveTooltip(null);
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsHoveringOverflow(false);
          setActiveTooltip(null);
        }
      };

      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('scroll', handleScrollOrResize, true);
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isHoveringOverflow, activeTooltip, updatePopoverPos]);

    // Cleanup timer on unmount
    React.useEffect(() => {
      return () => {
        if (closeTimerRef.current) {
          clearTimeout(closeTimerRef.current);
        }
        if (itemTooltipTimerRef.current) {
          clearTimeout(itemTooltipTimerRef.current);
        }
      };
    }, []);

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
        data-stage={responsiveStage}
        className={cn(
          'relative flex h-6.5 w-full min-w-0 max-w-full shrink-0 select-none items-center overflow-hidden whitespace-nowrap text-micro text-muted-foreground',
          className,
        )}
        {...props}
      >
        {/* Hidden measurement strips */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none flex flex-col items-start"
          style={{
            position: 'fixed',
            left: '-9999px',
            top: '-9999px',
            visibility: 'hidden',
            pointerEvents: 'none',
            opacity: 0,
            zIndex: -9999,
          }}
        >
          {/* Normal strip */}
          <div ref={normalStripRef} className="flex items-center gap-2.5 whitespace-nowrap text-micro">
            {effectiveItems.map((item) => (
              <span
                key={`meas-norm-${item.id}`}
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap px-1 py-0.5"
              >
                {item.keys.map((k, kIdx) => (
                  <Kbd
                    key={`meas-k-norm-${item.id}-${kIdx}`}
                    size={size}
                    variant={variant}
                    compact="never"
                  >
                    {k}
                  </Kbd>
                ))}
                <span className="whitespace-nowrap">{item.label}</span>
              </span>
            ))}
          </div>

          {/* Squeezed strip */}
          <div ref={squeezedStripRef} className="flex items-center gap-1.5 whitespace-nowrap text-nano">
            {effectiveItems.map((item) => (
              <span
                key={`meas-sq-${item.id}`}
                className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap px-1 py-0.5"
              >
                {item.keys.map((k, kIdx) => (
                  <Kbd
                    key={`meas-k-sq-${item.id}-${kIdx}`}
                    size="xs"
                    variant={variant}
                    compact="never"
                    className="h-4 min-w-4 px-0.5 text-nano"
                  >
                    {k}
                  </Kbd>
                ))}
                <span className="whitespace-nowrap">{item.label}</span>
              </span>
            ))}
          </div>

          {/* Compact strip */}
          <div ref={compactStripRef} className="flex items-center gap-1.5 whitespace-nowrap text-nano">
            {effectiveItems.map((item) => (
              <span
                key={`meas-comp-${item.id}`}
                className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap px-1 py-0.5"
              >
                {item.keys.map((k, kIdx) => (
                  <Kbd
                    key={`meas-k-comp-${item.id}-${kIdx}`}
                    size="xs"
                    variant={variant}
                    compact="always"
                    className="h-4 min-w-4 px-0.5 text-nano"
                  >
                    {k}
                  </Kbd>
                ))}
                <span className="whitespace-nowrap">
                  {item.shortLabel || item.label}
                </span>
              </span>
            ))}
          </div>

          {/* Badge measurement */}
          <div ref={badgeMeasureRef} className="inline-flex w-fit shrink-0 items-center self-start">
            <Kbd size="xs" variant="outline" className="font-medium h-4 min-w-4 px-1 text-nano">
              +{effectiveItems.length}
            </Kbd>
          </div>
        </div>

        {/* Visible Shortcut Items - Strict Atomic Units */}
        <div
          className={cn(
            'flex min-w-0 shrink-0 items-center transition-colors duration-100',
            responsiveStage === 'full' ? 'gap-2.5 text-micro' : 'gap-1.5 text-nano',
          )}
        >
          {visibleItems.map(({ item, isCompact }) => (
            <span
              key={`visible-${item.id}`}
              data-slot="shortcut-item"
              data-compact={isCompact ? 'true' : 'false'}
              className={cn(
                'inline-flex shrink-0 items-center whitespace-nowrap cursor-pointer rounded px-1 py-0.5 transition-colors duration-100 hover:bg-accent/40',
                isCompact ? 'gap-0.5' : 'gap-1',
                item.disabled && 'opacity-50 pointer-events-none',
              )}
              onMouseEnter={(e) => handleItemMouseEnter(item, e.currentTarget)}
              onMouseLeave={handleItemMouseLeave}
            >
              {item.keys.map((keyStr, kIdx) => (
                <Kbd
                  key={`key-${item.id}-${kIdx}`}
                  size={isCompact ? 'xs' : (responsiveStage === 'full' ? size : 'xs')}
                  variant={variant}
                  compact={isCompact ? 'always' : 'never'}
                  className={cn(isCompact && 'h-4 min-w-4 px-0.5 text-nano')}
                >
                  {keyStr}
                </Kbd>
              ))}
              <span className="shrink-0 whitespace-nowrap">
                {isCompact && item.shortLabel ? item.shortLabel : item.label}
              </span>
            </span>
          ))}
        </div>

        {/* Item Tooltip on Hover rendered via Portal */}
        {activeTooltip &&
          typeof document !== 'undefined' &&
          createPortal(
            <div
              role="tooltip"
              className="fixed z-[9999] pointer-events-none rounded-md bg-foreground px-2.5 py-1 text-xs text-background shadow-md inline-flex items-center gap-2 select-none animate-in fade-in-0 duration-100"
              style={{
                top: `${((activeTooltip.rect.top < 60
                  ? activeTooltip.rect.bottom + 6
                  : activeTooltip.rect.top - 6) / getRootFontSize()).toFixed(4)}rem`,
                left: `${(Math.max(
                  16,
                  Math.min(
                    typeof window !== 'undefined' ? window.innerWidth - 16 : 800,
                    activeTooltip.rect.left + activeTooltip.rect.width / 2,
                  ),
                ) / getRootFontSize()).toFixed(4)}rem`,
                transform:
                  activeTooltip.rect.top < 60
                    ? 'translate(-50%, 0)'
                    : 'translate(-50%, -100%)',
              }}
            >
              <span className="font-medium text-xs text-background">
                {activeTooltip.item.label}
              </span>
              {activeTooltip.formattedShortcut && (
                <Kbd
                  variant="inverted"
                  size="xs"
                  compact="never"
                  shortcut={activeTooltip.formattedShortcut}
                />
              )}
            </div>,
            document.body,
          )}

        {/* Overflow '+N' Badge with interactive trigger */}
        {showOverflowCount && overflowItems.length > 0 && (
          <div
            ref={badgeRef}
            className="relative ml-1.5 inline-flex shrink-0 items-center"
            onMouseEnter={handleBadgeMouseEnter}
            onMouseLeave={handleBadgeMouseLeave}
          >
            <Kbd
              size="xs"
              variant="outline"
              className={cn(
                'cursor-pointer font-medium hover:border-primary/50 hover:text-foreground',
                responsiveStage !== 'full' && 'h-4 min-w-4 px-1 text-nano',
              )}
              tabIndex={0}
              role="button"
              aria-label={`更多 ${overflowItems.length} 个快捷键`}
              aria-expanded={isHoveringOverflow}
              onMouseEnter={handleBadgeMouseEnter}
              onMouseLeave={handleBadgeMouseLeave}
              onFocus={handleBadgeMouseEnter}
              onBlur={handleBadgeMouseLeave}
            >
              +{overflowItems.length}
            </Kbd>
          </div>
        )}

        {/* Floating Popover on Hover rendered via Portal into document.body */}
        {showOverflowCount &&
          overflowItems.length > 0 &&
          isHoveringOverflow &&
          popoverPos &&
          typeof document !== 'undefined' &&
          createPortal(
            <div
              role="tooltip"
              className="fixed z-[9999] rounded-md border border-border bg-popover px-3 py-2 text-micro text-popover-foreground shadow-lg pointer-events-auto select-none transition-opacity duration-150 animate-in fade-in-0"
              style={{
                ...(popoverPos.placeBelow
                  ? { top: `${(popoverPos.top / getRootFontSize()).toFixed(4)}rem` }
                  : { bottom: `${(popoverPos.bottom / getRootFontSize()).toFixed(4)}rem` }),
                left: `${(popoverPos.left / getRootFontSize()).toFixed(4)}rem`,
                minWidth: '11rem',
              }}
              onMouseEnter={handlePopoverMouseEnter}
              onMouseLeave={handlePopoverMouseLeave}
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between border-b border-border/50 pb-1 text-micro font-medium text-muted-foreground">
                  <span>更多快捷键</span>
                  <span className="text-nano opacity-75">+{overflowItems.length}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {overflowItems.map((ovItem) => (
                    <div
                      key={`ov-${ovItem.id}`}
                      className="flex items-center justify-between gap-4 py-0.5 text-micro"
                    >
                      <div className="flex items-center gap-1">
                        {ovItem.keys.map((k, kIdx) => (
                          <Kbd key={`ov-kbd-${kIdx}`} size="xs" variant="outline" compact="never">
                            {k}
                          </Kbd>
                        ))}
                      </div>
                      <span className="whitespace-nowrap text-foreground">{ovItem.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>,
            document.body,
          )}
      </div>
    );
  },
);

ShortcutBar.displayName = 'ShortcutBar';
