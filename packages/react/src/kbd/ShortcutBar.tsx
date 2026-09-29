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

/**
 * Fallback width calculation for SSR or jsdom test environments
 */
function estimateFallbackWidth(
  item: ShortcutItem,
  mode: 'full' | 'squeezed' | 'compact',
): number {
  const isCompact = mode === 'compact';
  const isSqueezed = mode === 'squeezed';
  const numKeys = item.keys.length || 1;
  let keysW = 0;
  for (let i = 0; i < numKeys; i++) {
    const k = item.keys[i] || '';
    const isArrow = /^(Up|Down|Left|Right|ArrowUp|ArrowDown|ArrowLeft|ArrowRight)$/i.test(k);
    const kw =
      isCompact && isArrow
        ? 18
        : isCompact
          ? Math.max(18, k.length * 7 + 10)
          : isSqueezed
            ? Math.max(20, k.length * 7 + 10)
            : Math.max(24, k.length * 8 + 12);
    keysW += kw + (i > 0 ? (isCompact || isSqueezed ? 2 : 4) : 0);
  }
  const label = isCompact && item.shortLabel ? item.shortLabel : item.label || '';
  let labelW = 0;
  const cjkCharW = isSqueezed || isCompact ? 11 : 14;
  const latinCharW = isSqueezed || isCompact ? 6 : 8;
  for (let i = 0; i < label.length; i++) {
    const code = label.charCodeAt(i);
    labelW += code >= 0x4e00 && code <= 0x9fff ? cjkCharW : latinCharW;
  }
  const keyToLabelGap = isSqueezed || isCompact ? 2 : 4;
  return keysW + keyToLabelGap + labelW;
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
    // Stage 1 (full): Normal words & normal scale
    // Stage 2 (squeezed): Normal words & cohesive unit scale-down (font 10px, gap 6px)
    // Stage 3 (compact): Keys convert to compact symbols/icons (↑, ↵, ⎋, ⌃), shortLabels
    // Stage 4 (folded): Lowest priority items fold into +N badge
    const { visibleItems, overflowItems, responsiveStage, effectiveCompact } =
      React.useMemo(() => {
        if (effectiveItems.length === 0) {
          return {
            visibleItems: [],
            overflowItems: [],
            responsiveStage: 'full' as const,
            effectiveCompact: compact === 'always' || forceCompact,
          };
        }

        if (maxVisibleItems !== undefined) {
          const vis = effectiveItems.slice(0, maxVisibleItems);
          const ov = effectiveItems.slice(maxVisibleItems);
          return {
            visibleItems: vis,
            overflowItems: ov,
            responsiveStage: ov.length > 0 ? ('folded' as const) : ('full' as const),
            effectiveCompact: compact === 'always' || forceCompact,
          };
        }

        if (containerWidth <= 0) {
          return {
            visibleItems: effectiveItems,
            overflowItems: [],
            responsiveStage: 'full' as const,
            effectiveCompact: compact === 'always' || forceCompact,
          };
        }

        // Account for horizontal container padding (e.g. px-2.5 = 20px)
        const availableInnerWidth = Math.max(0, containerWidth - 20);

        const normalGap = 12; // gap-3 = 12px
        const squeezedGap = 6; // gap-1.5 = 6px
        const compactGap = 6; // gap-1.5 = 6px

        const measuredBadgeWidth = badgeMeasureRef.current
          ? badgeMeasureRef.current.getBoundingClientRect().width ||
            badgeMeasureRef.current.offsetWidth
          : 0;
        const badgeWidth = measuredBadgeWidth > 0 ? measuredBadgeWidth : 36;

        const normalWidths = getMeasuredWidths(normalStripRef.current, 'full');
        const squeezedWidths = getMeasuredWidths(squeezedStripRef.current, 'squeezed');
        const compactWidths = getMeasuredWidths(compactStripRef.current, 'compact');

        const totalNormalWidth =
          normalWidths.reduce((sum, w) => sum + w, 0) +
          Math.max(0, effectiveItems.length - 1) * normalGap;

        const totalSqueezedWidth =
          squeezedWidths.reduce((sum, w) => sum + w, 0) +
          Math.max(0, effectiveItems.length - 1) * squeezedGap;

        const totalCompactWidth =
          compactWidths.reduce((sum, w) => sum + w, 0) +
          Math.max(0, effectiveItems.length - 1) * compactGap;

        // Stage 1: Full normal mode
        if (
          totalNormalWidth <= availableInnerWidth &&
          compact !== 'always' &&
          !forceCompact
        ) {
          return {
            visibleItems: effectiveItems,
            overflowItems: [],
            responsiveStage: 'full' as const,
            effectiveCompact: false,
          };
        }

        // Stage 2: Squeezed mode (words intact, unit scales down together)
        if (
          totalSqueezedWidth <= availableInnerWidth &&
          compact !== 'always' &&
          !forceCompact
        ) {
          return {
            visibleItems: effectiveItems,
            overflowItems: [],
            responsiveStage: 'squeezed' as const,
            effectiveCompact: false,
          };
        }

        // Stage 3: Compact symbols mode (words transform into symbols/icons)
        if (totalCompactWidth <= availableInnerWidth && compact !== 'never') {
          return {
            visibleItems: effectiveItems,
            overflowItems: [],
            responsiveStage: 'compact' as const,
            effectiveCompact: true,
          };
        }

        // Stage 4: Overflow fold into +N badge (items in compact mode)
        const shouldUseCompact = compact !== 'never';
        const activeWidths = shouldUseCompact
          ? compactWidths
          : totalSqueezedWidth <= totalNormalWidth
            ? squeezedWidths
            : normalWidths;
        const activeGap = shouldUseCompact || totalSqueezedWidth <= totalNormalWidth ? 6 : 12;

        const spaceForItems = Math.max(
          0,
          availableInnerWidth - (showOverflowCount ? badgeWidth + activeGap : 0),
        );

        // Strict Atomic Units: Rank by priority ascending (1 = highest priority kept)
        const indexed = effectiveItems.map((item, idx) => ({
          item,
          index: idx,
          priority: item.priority ?? 1,
          width: activeWidths[idx] ?? 50,
        }));

        const sortedByPriority = [...indexed].sort((a, b) => {
          if (a.priority !== b.priority) return a.priority - b.priority;
          return a.index - b.index;
        });

        let accumulatedWidth = 0;
        let acceptedCount = 0;
        const acceptedIndices = new Set<number>();

        for (const entry of sortedByPriority) {
          const needed = entry.width + (acceptedCount > 0 ? activeGap : 0);
          if (accumulatedWidth + needed <= spaceForItems) {
            accumulatedWidth += needed;
            acceptedCount++;
            acceptedIndices.add(entry.index);
          }
        }

        if (acceptedCount === 0 && effectiveItems.length > 0) {
          acceptedIndices.add(sortedByPriority[0]!.index);
        }

        const vis: ShortcutItem[] = [];
        const ov: ShortcutItem[] = [];

        for (let i = 0; i < effectiveItems.length; i++) {
          if (acceptedIndices.has(i)) {
            vis.push(effectiveItems[i]!);
          } else {
            ov.push(effectiveItems[i]!);
          }
        }

        return {
          visibleItems: vis,
          overflowItems: ov,
          responsiveStage: 'folded' as const,
          effectiveCompact: shouldUseCompact,
        };
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
      if (!isHoveringOverflow) return;

      const handleScrollOrResize = () => {
        updatePopoverPos();
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsHoveringOverflow(false);
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
    }, [isHoveringOverflow, updatePopoverPos]);

    // Cleanup timer on unmount
    React.useEffect(() => {
      return () => {
        if (closeTimerRef.current) {
          clearTimeout(closeTimerRef.current);
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
          className="pointer-events-none invisible fixed -left-[624.9375rem] -top-[624.9375rem] flex flex-col select-none opacity-0"
          style={{ zIndex: -9999 }}
        >
          {/* Normal strip */}
          <div ref={normalStripRef} className="flex items-center gap-3 whitespace-nowrap text-micro">
            {effectiveItems.map((item) => (
              <span
                key={`meas-norm-${item.id}`}
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap"
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
                className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap"
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
                className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap"
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
          <div ref={badgeMeasureRef} className="inline-flex shrink-0 items-center">
            <Kbd size="xs" variant="outline" className="font-medium h-4 min-w-4 px-1 text-nano">
              +{effectiveItems.length}
            </Kbd>
          </div>
        </div>

        {/* Visible Shortcut Items - Strict Atomic Units */}
        <div
          className={cn(
            'flex min-w-0 shrink-0 items-center transition-all duration-150',
            responsiveStage === 'full' ? 'gap-3 text-micro' : 'gap-1.5 text-nano',
          )}
        >
          {visibleItems.map((item) => (
            <span
              key={`visible-${item.id}`}
              data-slot="shortcut-item"
              className={cn(
                'inline-flex shrink-0 items-center whitespace-nowrap transition-all duration-150',
                responsiveStage === 'full' ? 'gap-1' : 'gap-0.5',
                item.disabled && 'opacity-50',
              )}
            >
              {item.keys.map((keyStr, kIdx) => (
                <Kbd
                  key={`key-${item.id}-${kIdx}`}
                  size={responsiveStage === 'full' ? size : 'xs'}
                  variant={variant}
                  compact={
                    responsiveStage === 'compact' || responsiveStage === 'folded'
                      ? 'always'
                      : 'never'
                  }
                  className={cn(
                    responsiveStage !== 'full' && 'h-4 min-w-4 px-0.5 text-nano',
                  )}
                >
                  {keyStr}
                </Kbd>
              ))}
              <span className="shrink-0 whitespace-nowrap">
                {(responsiveStage === 'compact' || responsiveStage === 'folded') &&
                item.shortLabel
                  ? item.shortLabel
                  : item.label}
              </span>
            </span>
          ))}
        </div>

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
                  ? { top: `${popoverPos.top * 0.0625}rem` }
                  : { bottom: `${popoverPos.bottom * 0.0625}rem` }),
                left: `${popoverPos.left * 0.0625}rem`,
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
