import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from '../button';
import { ActivityCard } from '../activity-stack/ActivityCard';
import { ActivityStack, type ActivityStackEntry } from '../activity-stack/ActivityStack';
import {
  AlertTriangleIcon,
  CheckIcon,
  CircleDashedIcon,
  LoaderIcon,
  MinusIcon,
  XIcon,
} from '../lib/icons';
import type { ActivityStatus, TaskItem, TaskHudPlacement } from '@chahu/spec/task-hud';

export type { ActivityStatus, TaskItem, TaskHudPlacement };

export interface TaskHudProps {
  /** Background executions to surface, oldest first. */
  tasks: TaskItem[];
  /** Renders the per-card dismiss control. */
  onDismiss?: (id: string) => void;
  /** Renders a cancel control on cancellable running tasks. */
  onCancel?: (id: string) => void;
  /** Cards rendered before the stack overflows into its "show all" pill. @default 3 */
  maxVisible?: number;
  /** Grace period an emptied HUD stays on screen before it fades out. @default 600 */
  autoHideDelay?: number;
  /** Viewport anchor. @default 'bottom-right' */
  placement?: TaskHudPlacement;
  /** Inset from the anchored viewport edges, in logical units. @default 16 */
  offset?: number;
  /** Offer the collapse-to-summary-row control. @default true */
  collapsible?: boolean;
  /** Render collapsed on first paint. @default false */
  defaultCollapsed?: boolean;
  /** Keep the HUD mounted even while no task is running. @default false */
  forceVisible?: boolean;
  /** Accessible name of the HUD region. @default 'Task Progress HUD' */
  label?: string;
  className?: string;
}

interface StatusPresentation {
  tone: 'neutral' | 'success' | 'warning' | 'danger';
  icon: (className: string) => React.ReactNode;
}

const STATUS_PRESENTATION: Record<ActivityStatus, StatusPresentation> = {
  queued: { tone: 'neutral', icon: (className) => <CircleDashedIcon className={className} /> },
  running: {
    tone: 'neutral',
    // `motion-safe` keeps the spinner still for users who asked for reduced motion.
    icon: (className) => <LoaderIcon className={cn(className, 'motion-safe:animate-spin')} />,
  },
  success: { tone: 'success', icon: (className) => <CheckIcon className={className} /> },
  warning: { tone: 'warning', icon: (className) => <AlertTriangleIcon className={className} /> },
  error: { tone: 'danger', icon: (className) => <XIcon className={className} /> },
  cancelled: { tone: 'neutral', icon: (className) => <MinusIcon className={className} /> },
};

function formatElapsed(ms: number): string {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes > 0 ? `${minutes}m ${String(rest).padStart(2, '0')}s` : `${rest}s`;
}

/**
 * Floating HUD for background executions.
 *
 * A thin adapter over `ActivityStack`: it maps a `TaskItem` onto an
 * `ActivityCard` and holds the one piece of state the stack does not — the
 * grace period an emptied HUD lingers for, so the final card fades out instead
 * of disappearing the instant the last job reports success.
 */
export const TaskHud = React.forwardRef<HTMLDivElement, TaskHudProps>(function TaskHud(
  {
    tasks,
    onDismiss,
    onCancel,
    maxVisible = 3,
    autoHideDelay = 600,
    placement = 'bottom-right',
    offset = 16,
    collapsible = true,
    defaultCollapsed = false,
    forceVisible = false,
    label = 'Task Progress HUD',
    className,
  },
  ref,
) {
  const taskCount = tasks.length;

  // Frozen last-frame data: an emptied HUD keeps rendering the final snapshot
  // until the grace period lapses, and only then does the stack see an empty
  // list and play the exit animation. The flag is inverted (rather than a
  // `lingering` flag set by the effect) because a render with the list already
  // cleared would register the exit before the grace period had even begun,
  // leaving a live card and its ghost mounted at the same time.
  const lastTasksRef = React.useRef<TaskItem[]>(tasks);
  if (taskCount > 0) lastTasksRef.current = tasks;
  const [cleared, setCleared] = React.useState(false);

  React.useEffect(() => {
    if (taskCount > 0 || forceVisible) {
      setCleared(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setCleared(true), autoHideDelay);
    return () => window.clearTimeout(timer);
  }, [taskCount, forceVisible, autoHideDelay]);

  const source = taskCount > 0 || forceVisible ? tasks : cleared ? [] : lastTasksRef.current;

  const entries: ActivityStackEntry[] = source.map((task) => {
    // Defaults mirror `taskItemSchema`. They are restated here rather than read
    // off the schema because importing a runtime value from `@chahu/spec` would
    // pull zod into the component bundle.
    const status: ActivityStatus = task.status ?? 'running';
    const presentation = STATUS_PRESENTATION[status];
    const running = status === 'running';
    const indeterminate = Boolean(task.indeterminate) && running;
    const counter = task.total != null && task.done != null ? `${task.done}/${task.total}` : null;
    const cancellable = Boolean(task.cancellable) && running && Boolean(onCancel);
    const dismissible = Boolean(onDismiss) && !cancellable;

    return {
      id: task.id,
      badge: presentation.icon('size-3.5'),
      node: (
        <ActivityCard
          itemId={task.id}
          icon={presentation.icon('size-4')}
          tone={presentation.tone}
          title={task.title}
          detail={
            task.detail || counter ? (
              <>
                {task.detail}
                {counter && (
                  <span className={cn('text-muted-foreground/70', task.detail && 'ml-2')}>
                    {counter}
                  </span>
                )}
              </>
            ) : undefined
          }
          meta={task.elapsedMs && task.elapsedMs > 0 ? formatElapsed(task.elapsedMs) : undefined}
          progress={task.progress ?? -1}
          indeterminate={indeterminate}
          dismissLabel={`Dismiss ${task.title}`}
          onDismiss={dismissible ? () => onDismiss?.(task.id) : undefined}
          actions={
            cancellable ? (
              <Button size="xs" variant="ghost" onClick={() => onCancel?.(task.id)}>
                Cancel
              </Button>
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
      summaryLabel="进行中"
      className={className}
    />
  );
});

TaskHud.displayName = 'TaskHud';
