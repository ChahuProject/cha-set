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

  // Notify on active change
  React.useEffect(() => {
    if (activeItem) {
      onActiveChange?.(activeItem.id, activeIndex);
    }
  }, [activeItem?.id, activeIndex, onActiveChange]);

  // Countdown timer: only ticks when activeItem has duration > 0 and not paused
  React.useEffect(() => {
    if (!activeItem || (pauseOnHover && isHovered)) return;

    const timer = setInterval(() => {
      setBudgets((prev) => {
        const currentBudget = prev[activeItem.id];
        if (currentBudget === undefined || currentBudget <= 0) return prev;

        const updated = currentBudget - 100;
        if (updated <= 0) {
          onDismiss?.(activeItem.id);
          return { ...prev, [activeItem.id]: 0 };
        }
        return { ...prev, [activeItem.id]: updated };
      });
    }, 100);

    return () => clearInterval(timer);
  }, [activeItem?.id, isHovered, pauseOnHover, onDismiss]);

  if (!activeItem) return null;

  const currentLevel: FloatingNoticeLevel = activeItem.level ?? 'default';
  const styles = LEVEL_STYLES[currentLevel] ?? LEVEL_STYLES.default;
  const itemClosable = (activeItem.closable ?? true) && closable;

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
        'fixed left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-transform duration-short ease-standard',
        zoomOnHover && isHovered && 'scale-105',
        className
      )}
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
    >
      <div
        className={cn(
          'flex items-center gap-2.5 px-3.5 py-2 rounded-full border backdrop-blur-md',
          'transition-all duration-short ease-standard min-w-[12rem] max-w-[28rem]',
          styles.container
        )}
      >
        {/* Leading icon */}
        <div className="shrink-0 flex items-center justify-center">
          {LEVEL_ICON[currentLevel](cn('size-4 shrink-0', styles.icon))}
        </div>

        {/* Notice Content / Slot */}
        <div className="flex-1 min-w-0 text-xs font-medium truncate">
          {renderContent ? (
            renderContent(activeItem)
          ) : (
            <div className="flex items-center gap-1.5 truncate">
              <span className="truncate">{activeItem.title}</span>
              {activeItem.description && (
                <span className="text-muted-foreground truncate font-normal">
                  {activeItem.description}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Queue Dots (when multiple notices exist) */}
        {sortedNotices.length > 1 && (
          <div
            data-testid="queue-dots"
            className="flex items-center gap-1 shrink-0 px-1"
          >
            {sortedNotices.map((item, idx) => {
              const isActive = idx === activeIndex;
              const dotLevel = item.level ?? 'default';
              const dotStyle = LEVEL_STYLES[dotLevel];

              return (
                <button
                  key={item.id}
                  type="button"
                  data-testid={`queue-dot-${idx}`}
                  title={item.title}
                  className={cn(
                    'transition-all duration-quick rounded-full cursor-pointer p-0 border-0',
                    isActive
                      ? cn('w-3 h-1.5', dotStyle.dotActive)
                      : cn('size-1.5', dotStyle.dot)
                  )}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                />
              );
            })}
          </div>
        )}

        {/* Close Button ('x'): reveals on hover */}
        {itemClosable && (
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
              onDismiss?.(activeItem.id);
            }}
          >
            <XIcon className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
