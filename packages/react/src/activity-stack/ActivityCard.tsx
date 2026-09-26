import * as React from 'react';
import { cn } from '../lib/utils';
import { XIcon } from '../lib/icons';

/**
 * Accent vocabulary shared by every activity card.
 *
 * A card's tone drives three visual layers at once — the border, the top rail
 * hairline and the progress fill — so a caller never picks them independently
 * and ends up with, say, an amber border over a primary progress bar.
 */
export type ActivityTone = 'neutral' | 'success' | 'warning' | 'danger';

const TONE_BORDER: Record<ActivityTone, string> = {
  neutral: 'border-border/80',
  success: 'border-primary/40',
  warning: 'border-amber-500/40',
  danger: 'border-destructive/50',
};

const TONE_RAIL: Record<ActivityTone, string> = {
  neutral: 'bg-border',
  success: 'bg-primary',
  warning: 'bg-amber-500',
  danger: 'bg-destructive',
};

const TONE_FILL: Record<ActivityTone, string> = {
  neutral: 'bg-primary',
  success: 'bg-primary',
  warning: 'bg-amber-500',
  danger: 'bg-destructive',
};

const TONE_GLYPH: Record<ActivityTone, string> = {
  neutral: 'bg-muted/80 text-muted-foreground border-border/50',
  success: 'bg-primary/10 text-primary border-primary/25',
  warning: 'bg-amber-500/10 text-amber-500 border-amber-500/25',
  danger: 'bg-destructive/10 text-destructive border-destructive/25',
};

export interface ActivityCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Identity of the item this card renders. Drives the derived test ids
   * (`activity-card-<itemId>`, `activity-progress-<itemId>`,
   * `activity-indeterminate-<itemId>`, `activity-dismiss-<itemId>`) so both
   * stacks and their tests address cards by data rather than by position.
   */
  itemId: string;
  /** Leading status glyph. The card frames it; the caller colours it. */
  icon: React.ReactNode;
  /** Accent applied to the border, the top rail and the progress fill. */
  tone?: ActivityTone;
  title: React.ReactNode;
  /** Secondary line under the title. */
  detail?: React.ReactNode;
  /** Trailing content on the title row, e.g. an elapsed-time readout. */
  meta?: React.ReactNode;
  /** Determinate progress in the `0..1` range. Any negative value renders no bar. */
  progress?: number;
  /** Renders the sweeping bar of a step whose duration is unknown. */
  indeterminate?: boolean;
  /** Trailing action row rendered under the body. */
  actions?: React.ReactNode;
  /** Renders the dismiss control when provided. */
  onDismiss?: () => void;
  /** Accessible name of the dismiss control. Falls back to the item id. */
  dismissLabel?: string;
}

/**
 * Presentational shell for one entry of an activity stack.
 *
 * It owns no timers, no placement and no state: a task card and a notification
 * card are the same box with different content, so the stack mechanics can be
 * written once and the two public components stay thin adapters.
 */
export const ActivityCard = React.forwardRef<HTMLDivElement, ActivityCardProps>(function ActivityCard(
  {
    itemId,
    icon,
    tone = 'neutral',
    title,
    detail,
    meta,
    progress = -1,
    indeterminate = false,
    actions,
    onDismiss,
    dismissLabel,
    className,
    children,
    ...props
  },
  ref,
) {
  const hasProgress = indeterminate || progress >= 0;
  const ratio = Math.max(0, Math.min(1, progress < 0 ? 0 : progress));

  return (
    <div
      ref={ref}
      data-testid={`activity-card-${itemId}`}
      data-tone={tone}
      className={cn(
        'pointer-events-auto relative overflow-hidden rounded-xl border p-3.5 shadow-lg backdrop-blur-md',
        'bg-card/95 text-card-foreground',
        TONE_BORDER[tone],
        className,
      )}
      {...props}
    >
      {/* Top rail: a hairline that repeats the tone without adding a second border. */}
      {tone !== 'neutral' && (
        <div className={cn('absolute top-0 left-2 right-2 h-[0.0625rem] rounded-full opacity-60', TONE_RAIL[tone])} />
      )}

      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full border',
            TONE_GLYPH[tone],
          )}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1 pr-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-semibold text-foreground">{title}</span>
            {meta != null && (
              <span className="whitespace-nowrap text-micro text-muted-foreground">{meta}</span>
            )}
          </div>
          {detail != null && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{detail}</p>
          )}
        </div>

        {onDismiss && (
          <button
            type="button"
            aria-label={dismissLabel ?? `Dismiss ${itemId}`}
            data-testid={`activity-dismiss-${itemId}`}
            onClick={onDismiss}
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
          >
            <XIcon className="size-3.5" />
          </button>
        )}
      </div>

      {children}

      {hasProgress && (
        <div className="relative mt-3 h-[0.1875rem] w-full overflow-hidden rounded-full bg-muted/40">
          {indeterminate ? (
            <div
              data-testid={`activity-indeterminate-${itemId}`}
              className="pointer-events-none absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-primary to-transparent"
            />
          ) : (
            <div
              data-testid={`activity-progress-${itemId}`}
              className={cn('h-full rounded-full transition-[width] duration-medium ease-standard', TONE_FILL[tone])}
              style={{ width: `${ratio * 100}%` }}
            />
          )}
        </div>
      )}

      {actions != null && <div className="mt-3 flex items-center justify-end gap-2">{actions}</div>}
    </div>
  );
});

ActivityCard.displayName = 'ActivityCard';
