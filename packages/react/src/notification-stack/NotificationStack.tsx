import * as React from 'react';
import { Button } from '../button';
import { ActivityCard, type ActivityTone } from '../activity-stack/ActivityCard';
import { ActivityStack, type ActivityStackEntry } from '../activity-stack/ActivityStack';
import { AlertTriangleIcon, CheckIcon, InfoIcon, XIcon } from '../lib/icons';
import type {
  NotificationItem,
  NotificationLevel,
  NotificationStackPlacement,
} from '@chahu/spec/notification-stack';

export type {
  NotificationItem,
  NotificationLevel,
  NotificationAction,
  NotificationStackPlacement,
} from '@chahu/spec/notification-stack';

export interface NotificationStackProps {
  /** Notifications to surface, oldest first. */
  notifications: NotificationItem[];
  /** Renders the per-card dismiss control and drives auto-expiry. */
  onDismiss?: (id: string) => void;
  /** Fired when an inline action button is pressed. */
  onAction?: (notificationId: string, actionId: string) => void;
  /** Viewport anchor. @default 'bottom-right' */
  placement?: NotificationStackPlacement;
  /** Inset from the anchored viewport edges, in logical units. @default 16 */
  offset?: number;
  /** Cards rendered before the stack overflows into its "show all" pill. @default 4 */
  maxVisible?: number;
  /** Lifetime for items that do not state their own `duration`. @default 5000 */
  defaultDuration?: number;
  /** Suspends every expiry countdown while the pointer rests on the stack. @default true */
  pauseOnHover?: boolean;
  /** Offer the collapse-to-summary-row control. @default true */
  collapsible?: boolean;
  /** Render collapsed on first paint. @default false */
  defaultCollapsed?: boolean;
  /** Accessible name of the stack region. @default 'Notifications' */
  label?: string;
  className?: string;
}

const LEVEL_TONE: Record<NotificationLevel, ActivityTone> = {
  info: 'neutral',
  success: 'success',
  warning: 'warning',
  error: 'danger',
};

const LEVEL_ICON: Record<NotificationLevel, (className: string) => React.ReactNode> = {
  info: (className) => <InfoIcon className={className} />,
  success: (className) => <CheckIcon className={className} />,
  warning: (className) => <AlertTriangleIcon className={className} />,
  error: (className) => <XIcon className={className} />,
};

interface Countdown {
  handle: number | null;
  /** Milliseconds left when the countdown was last suspended. */
  remaining: number;
  /** Epoch at which the running countdown was armed. */
  armedAt: number;
}

/**
 * Floating stack of transient, severity-coded notifications.
 *
 * Shares every layout mechanic of `TaskHud` — same placements, overflow pill,
 * collapse row, exit animation — and adds the one thing a notification has that
 * a background task does not: a lifetime. The countdown is tracked as a
 * remaining-time budget rather than a bare `setTimeout`, so hovering a stack of
 * toasts freezes each one mid-count instead of letting them expire underneath
 * the user's cursor.
 */
export const NotificationStack = React.forwardRef<HTMLDivElement, NotificationStackProps>(
  function NotificationStack(
    {
      notifications,
      onDismiss,
      onAction,
      placement = 'bottom-right',
      offset = 16,
      maxVisible = 4,
      defaultDuration = 5000,
      pauseOnHover = true,
      collapsible = true,
      defaultCollapsed = false,
      label = 'Notifications',
      className,
    },
    ref,
  ) {
    const countdownsRef = React.useRef(new Map<string, Countdown>());
    const hoveredRef = React.useRef(false);

    const dismissRef = React.useRef(onDismiss);
    dismissRef.current = onDismiss;

    const stopCountdown = React.useCallback((id: string) => {
      const state = countdownsRef.current.get(id);
      if (!state) return;
      if (state.handle != null) window.clearTimeout(state.handle);
      countdownsRef.current.delete(id);
    }, []);

    const startCountdown = React.useCallback((id: string, ms: number) => {
      stopCountdown(id);
      if (ms <= 0) return;

      const state: Countdown = { handle: null, remaining: ms, armedAt: Date.now() };
      if (hoveredRef.current && pauseOnHover) {
        // Arm in the suspended state; resuming on pointer-leave starts the clock.
        countdownsRef.current.set(id, state);
        return;
      }
      state.handle = window.setTimeout(() => {
        countdownsRef.current.delete(id);
        dismissRef.current?.(id);
      }, ms);
      countdownsRef.current.set(id, state);
    }, [pauseOnHover, stopCountdown]);

    // Arm eligible items and retire countdowns whose notification has gone.
    const notificationKey = notifications.map((item) => item.id).join('\u0000');
    React.useEffect(() => {
      const live = new Set(notifications.map((item) => item.id));
      for (const id of Array.from(countdownsRef.current.keys())) {
        if (!live.has(id)) stopCountdown(id);
      }
      for (const item of notifications) {
        if (countdownsRef.current.has(item.id)) continue;
        const duration = item.duration ?? defaultDuration;
        if (duration > 0) startCountdown(item.id, duration);
      }
      // `notificationKey` is the stable projection of the id list; item payload
      // changes must not restart a countdown that is already ticking.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notificationKey, defaultDuration, startCountdown, stopCountdown]);

    React.useEffect(
      () => () => {
        for (const state of countdownsRef.current.values()) {
          if (state.handle != null) window.clearTimeout(state.handle);
        }
        countdownsRef.current.clear();
      },
      [],
    );

    const handleHoverChange = (hovered: boolean) => {
      if (!pauseOnHover || hoveredRef.current === hovered) return;
      hoveredRef.current = hovered;
      const now = Date.now();
      for (const [id, state] of Array.from(countdownsRef.current.entries())) {
        if (hovered) {
          if (state.handle == null) continue;
          window.clearTimeout(state.handle);
          countdownsRef.current.set(id, {
            ...state,
            handle: null,
            remaining: Math.max(0, state.remaining - (now - state.armedAt)),
          });
        } else {
          if (state.handle != null) continue;
          const handle = window.setTimeout(() => {
            countdownsRef.current.delete(id);
            dismissRef.current?.(id);
          }, state.remaining);
          countdownsRef.current.set(id, { ...state, handle, armedAt: now });
        }
      }
    };

    const entries: ActivityStackEntry[] = notifications.map((notification) => {
      // Defaults mirror `notificationItemSchema`; see TaskHud for why they are
      // restated instead of read off the schema at runtime.
      const level: NotificationLevel = notification.level ?? 'info';
      const dismissible = notification.dismissible ?? true;
      const actions = notification.actions ?? [];
      const renderIcon = LEVEL_ICON[level];

      return {
        id: notification.id,
        badge: renderIcon('size-3.5'),
        node: (
          <ActivityCard
            itemId={notification.id}
            icon={renderIcon('size-4')}
            tone={LEVEL_TONE[level]}
            title={notification.title}
            detail={notification.description}
            dismissLabel={`Dismiss ${notification.title}`}
            onDismiss={
              dismissible && onDismiss ? () => onDismiss(notification.id) : undefined
            }
            actions={
              actions.length > 0 ? (
                <>
                  {actions.map((action) => (
                    <Button
                      key={action.id}
                      size="xs"
                      variant={action.variant ?? 'outline'}
                      onClick={() => onAction?.(notification.id, action.id)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </>
              ) : undefined
            }
          />
        ),
      };
    });

    return (
      <ActivityStack
        ref={ref}
        entries={entries}
        placement={placement}
        offset={offset}
        maxVisible={maxVisible}
        collapsible={collapsible}
        defaultCollapsed={defaultCollapsed}
        label={label}
        ariaLive="polite"
        onHoverChange={handleHoverChange}
        className={className}
      />
    );
  },
);

NotificationStack.displayName = 'NotificationStack';
