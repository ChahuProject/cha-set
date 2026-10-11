import * as React from 'react';
import { cn } from '../lib/utils';
import { AlertTriangleIcon, CheckIcon, InfoIcon, XIcon } from '../lib/icons';
import type {
  FloatingNoticeItem,
  FloatingNoticeLevel,
  FloatingNoticePlacement,
} from '@chahu/spec/floating-notice';

export type {
  FloatingNoticeItem,
  FloatingNoticeLevel,
  FloatingNoticePlacement,
} from '@chahu/spec/floating-notice';

export interface FloatingNoticeProps {
  /** Notices to display. */
  notices: FloatingNoticeItem[];
  /** Anchor placement ('top' | 'bottom'). @default 'top' */
  placement?: FloatingNoticePlacement;
  /** Inset from the anchored viewport edge in logical units (dp). @default 16 */
  offset?: number;
  /** Fallback lifetime in ms for items that do not state their own duration. @default 3000 */
  defaultDuration?: number;
  /** Hovering the notice container suspends cycling and countdowns. @default true */
  pauseOnHover?: boolean;
  /** Zoom on hover (1.05x). @default true */
  zoomOnHover?: boolean;
  /** Global default for displaying close controls. @default true */
  closable?: boolean;
  /** Callback fired when a notice is dismissed or expired. */
  onDismiss?: (id: string) => void;
  /** Callback fired when active item changes. */
  onActiveChange?: (id: string, index: number) => void;
  /** Optional custom renderer for notice item content. */
  renderContent?: (item: FloatingNoticeItem) => React.ReactNode;
  className?: string;
  /** Test hook for forcing hover state */
  forceHover?: boolean;
}

const LEVEL_PRIORITY: Record<FloatingNoticeLevel, number> = {
  error: 30,
  warning: 20,
  info: 10,
  default: 0,
};

const LEVEL_ICON: Record<FloatingNoticeLevel, (className: string) => React.ReactNode> = {
  default: (className) => <InfoIcon className={className} />,
  info: (className) => <CheckIcon className={className} />,
  warning: (className) => <AlertTriangleIcon className={className} />,
  error: (className) => <XIcon className={className} />,
};

const LEVEL_STYLES: Record<FloatingNoticeLevel, { container: string; icon: string; dot: string; dotActive: string }> = {
  default: {
    container: 'bg-card/92 text-card-foreground border-border/80 shadow-md',
    icon: 'text-muted-foreground',
    dot: 'bg-muted-foreground/30 hover:bg-muted-foreground/70',
    dotActive: 'bg-foreground',
  },
  info: {
    container: 'bg-card/92 text-foreground border-primary/50 shadow-md',
    icon: 'text-primary',
    dot: 'bg-primary/30 hover:bg-primary/70',
    dotActive: 'bg-primary',
  },
  warning: {
    container: 'bg-card/92 text-foreground border-amber-500/50 shadow-md',
    icon: 'text-amber-500',
    dot: 'bg-amber-500/30 hover:bg-amber-500/70',
    dotActive: 'bg-amber-500',
  },
  error: {
    container: 'bg-card/92 text-foreground border-destructive/50 shadow-md',
    icon: 'text-destructive',
    dot: 'bg-destructive/30 hover:bg-destructive/70',
    dotActive: 'bg-destructive',
  },
};

export const FloatingNotice: React.FC<FloatingNoticeProps> = ({
  notices,
  placement = 'top',
  offset = 16,
  defaultDuration = 3000,
  pauseOnHover = true,
  zoomOnHover = true,
  closable = true,
  onDismiss,
  onActiveChange,
  renderContent,
  className,
  forceHover = false,
}) => {
  const [internalHover, setInternalHover] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [budgets, setBudgets] = React.useState<Record<string, number>>({});
  const isHovered = forceHover || internalHover;

  // Stable sort: priority descending, insertion order FIFO
  const sortedNotices = React.useMemo(() => {
    return notices
      .map((item, index) => {
        const level = item.level ?? 'default';
        const priority = item.priority !== undefined ? item.priority : LEVEL_PRIORITY[level];
        return { item, index, priority };
      })
      .sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return a.index - b.index;
      })
      .map((entry) => entry.item);
  }, [notices]);

  // Sync budgets for lifetime tracking
  React.useEffect(() => {
    setBudgets((prev) => {
      const next: Record<string, number> = {};
      for (const item of sortedNotices) {
        const existing = prev[item.id];
        if (existing !== undefined) {
          next[item.id] = existing;
        } else {
          const declared = item.duration !== undefined ? item.duration : defaultDuration;
          const num = typeof declared === 'number' ? declared : 0;
          next[item.id] = num > 0 ? num : 0;
        }
      }
      return next;
    });
  }, [sortedNotices, defaultDuration]);

  // Clamp active index
  React.useEffect(() => {
    if (activeIndex >= sortedNotices.length) {
      setActiveIndex(Math.max(0, sortedNotices.length - 1));
    }
  }, [sortedNotices.length, activeIndex]);

  const activeItem = sortedNotices[activeIndex] ?? null;
  const activeBudget = activeItem ? budgets[activeItem.id] : undefined;
  const isExpired = activeBudget === 0;

  // Stack geometry: dispersed near the front, progressively tighter toward the
  // back. Positions are fixed by sorted order; hovering only raises the layer
  // (z-index + full size in place) without reordering.
  const BASE_GAP_REM = 0.875; // 14px — visibly more dispersed than the old 6px
  const GAP_DECAY = 0.85;
  const MIN_GAP_REM = 0.25; // 4px floor
  const BASE_INSET_REM = 1; // 16px narrower per depth step (decaying)
  const INSET_DECAY = 0.8;
  const MIN_INSET_REM = 0.25;

  const gapForDepth = (depth: number): number => {
    if (depth <= 0) return 0;
    return Math.max(MIN_GAP_REM, BASE_GAP_REM * Math.pow(GAP_DECAY, depth - 1));
  };

  const offsetForDepth = (sortedIdx: number): number => {
    let total = 0;
    for (let d = 1; d <= sortedIdx; d++) total += gapForDepth(d);
    return total;
  };

  const insetForDepth = (sortedIdx: number): number => {
    let total = 0;
    for (let d = 1; d <= sortedIdx; d++) {
      total += Math.max(MIN_INSET_REM, BASE_INSET_REM * Math.pow(INSET_DECAY, d - 1));
    }
    return total;
  };

  const scaleForDepth = (sortedIdx: number, isActive: boolean): number => {
    if (isActive) return 1; // raised card restores full size in place
    return Math.max(0.72, 1 - sortedIdx * 0.04);
  };

  const opacityForDepth = (sortedIdx: number, isActive: boolean): number => {
    if (isActive) return isExpired ? 0 : 1;
    return Math.max(0.3, 0.9 - sortedIdx * 0.15);
  };

  // All entries stay in sorted positions (no slice limit); the active entry
  // only gains top z-order and full size where it already sits.
  const stackEntries = sortedNotices.map((item, sortedIdx) => ({ item, sortedIdx }));
  const stackSign = placement === 'top' ? 1 : -1;

  // Notify on active change
  React.useEffect(() => {
    if (activeItem) {
      onActiveChange?.(activeItem.id, activeIndex);
    }
  }, [activeItem?.id, activeIndex, onActiveChange]);

  // Countdown timer: only ticks when activeItem has duration > 0 and not paused.
  // Updater stays pure (no side effects inside); expiry notification is handled
  // by the dedicated effect below to avoid setState-during-render warnings.
  React.useEffect(() => {
    if (!activeItem || (pauseOnHover && isHovered)) return;

    const timer = setInterval(() => {
      setBudgets((prev) => {
        const currentBudget = prev[activeItem.id];
        if (currentBudget === undefined || currentBudget <= 0) return prev;

        const updated = currentBudget - 100;
        return { ...prev, [activeItem.id]: updated > 0 ? updated : 0 };
      });
    }, 100);

    return () => clearInterval(timer);
  }, [activeItem?.id, isHovered, pauseOnHover]);

  // Expiry notification: fires onDismiss once when the active item's budget
  // transitions from positive to zero (sticky budget-0 items never fire).
  const prevBudgetsRef = React.useRef<Record<string, number>>({});
  React.useEffect(() => {
    if (activeItem) {
      const current = budgets[activeItem.id];
      const previous = prevBudgetsRef.current[activeItem.id];
      if (current === 0 && previous !== undefined && previous > 0) {
        onDismiss?.(activeItem.id);
      }
    }
    prevBudgetsRef.current = budgets;
  }, [budgets, activeItem, onDismiss]);

  if (!activeItem) return null;

  const offsetStyle: React.CSSProperties =
    placement === 'top'
      ? { top: `${offset * 0.0625}rem` }
      : { bottom: `${offset * 0.0625}rem` };

  return (
    <div
      role="region"
      aria-label="Floating Notices"
      data-floating-notice=""
      data-testid="floating-notice-container"
      style={offsetStyle}
      className={cn(
        'absolute left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-transform duration-short ease-standard',
        zoomOnHover && isHovered && 'scale-105',
        className
      )}
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
    >
      <div className="relative">
        {/* Full stack: every notice keeps its sorted position; hover raises
            that position to the top (z-index + full size) without reordering.
            Depth 0 stays in-flow as the sizing anchor; deeper layers overlay. */}
        {stackEntries.map((entry) => {
          const isActive = entry.sortedIdx === activeIndex;
          const isAnchor = entry.sortedIdx === 0;
          const layerLevel = entry.item.level ?? 'default';
          const layerStyle = LEVEL_STYLES[layerLevel] ?? LEVEL_STYLES.default;
          const layerIcon = LEVEL_ICON[layerLevel] ?? LEVEL_ICON.default;
          const depthOffset = offsetForDepth(entry.sortedIdx) * stackSign;
          const scale = scaleForDepth(entry.sortedIdx, isActive);
          const inset = isActive ? 0 : insetForDepth(entry.sortedIdx);
          const layerClosable = (entry.item.closable ?? true) && closable;
          return (
            <div
              key={entry.item.id}
              role="button"
              tabIndex={0}
              data-testid={isActive ? `notice-card-${entry.sortedIdx}` : `queue-dot-${entry.sortedIdx}`}
              data-active={isActive ? 'true' : 'false'}
              data-depth={entry.sortedIdx}
              title={entry.item.title}
              aria-label={isActive ? entry.item.title : `Show notice: ${entry.item.title}`}
              className={cn(
                'flex items-center gap-2.5 px-3.5 py-2 rounded-full border backdrop-blur-md',
                'min-w-[12rem] max-w-[28rem] cursor-pointer transition-all duration-short ease-standard',
                isAnchor ? 'relative' : 'absolute top-0 left-1/2',
                layerStyle.container
              )}
              style={{
                transform: isAnchor
                  ? `scale(${scale})`
                  : `translateX(-50%) translateY(${depthOffset}rem) scale(${scale})`,
                width: isAnchor ? undefined : inset === 0 ? '100%' : `calc(100% - ${inset}rem)`,
                height: isAnchor ? undefined : '100%',
                opacity: opacityForDepth(entry.sortedIdx, isActive),
                zIndex: isActive ? 30 : stackEntries.length - entry.sortedIdx,
              }}
              onMouseEnter={() => setActiveIndex(entry.sortedIdx)}
              onClick={() => setActiveIndex(entry.sortedIdx)}
              onFocus={() => setActiveIndex(entry.sortedIdx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveIndex(entry.sortedIdx);
                }
              }}
            >
              {/* Leading icon */}
              <div className="shrink-0 flex items-center justify-center">
                {layerIcon(cn('size-4 shrink-0', layerStyle.icon))}
              </div>

              {/* Notice Content / Slot */}
              <div className="flex-1 min-w-0 text-xs font-medium truncate">
                {renderContent ? (
                  renderContent(entry.item)
                ) : (
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="truncate">{entry.item.title}</span>
                    {entry.item.description && (
                      <span className="text-muted-foreground truncate font-normal">
                        {entry.item.description}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Close Button ('x'): reveals on hover, raised card only */}
              {isActive && layerClosable && (
                <button
                  type="button"
                  data-testid="notice-close-button"
                  aria-label="Close notice"
                  className={cn(
                    'shrink-0 p-0.5 rounded-full hover:bg-foreground/10 text-muted-foreground hover:text-foreground cursor-pointer transition-opacity duration-quick',
                    isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss?.(entry.item.id);
                  }}
                >
                  <XIcon className="size-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
