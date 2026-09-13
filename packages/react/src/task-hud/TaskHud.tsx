import * as React from 'react';
import { cn } from '../lib/utils';
import type { TaskItem, TaskStatus, TaskHudPlacement } from '../../../../spec/components/task-hud';

export type { TaskItem, TaskStatus, TaskHudPlacement };

export interface TaskHudProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of active or completed tasks */
  tasks: TaskItem[];
  /** Callback when user dismisses a task */
  onDismiss?: (id: string) => void;
  /** Maximum number of cards visible in the stack at once (default 3) */
  maxVisible?: number;
  /** Delay in milliseconds before hiding the HUD when tasks array becomes empty (default 600) */
  autoHideDelay?: number;
  /** Placement anchor on viewport (default 'bottom-right') */
  placement?: TaskHudPlacement;
  /** Whether the HUD is forced visible for inspection / static presentation */
  forceVisible?: boolean;
}

const placementClasses: Record<TaskHudPlacement, string> = {
  'bottom-right': 'fixed bottom-4 right-4 items-end',
  'bottom-left': 'fixed bottom-4 left-4 items-start',
  'top-right': 'fixed top-4 right-4 items-end',
  'top-left': 'fixed top-4 left-4 items-start',
};

function normalizeStatus(status: TaskStatus | number): TaskStatus {
  if (typeof status === 'number') {
    switch (status) {
      case 1:
        return 'success';
      case 2:
        return 'warning';
      case 3:
        return 'error';
      default:
        return 'running';
    }
  }
  return status;
}

export const TaskHud = React.forwardRef<HTMLDivElement, TaskHudProps>(
  (
    {
      className,
      tasks = [],
      onDismiss,
      maxVisible = 3,
      autoHideDelay = 600,
      placement = 'bottom-right',
      forceVisible = false,
      style,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(tasks.length > 0 || forceVisible);
    const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
      if (forceVisible || tasks.length > 0) {
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
          hideTimerRef.current = null;
        }
        setIsVisible(true);
      } else {
        hideTimerRef.current = setTimeout(() => {
          setIsVisible(false);
        }, autoHideDelay);
      }

      return () => {
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
        }
      };
    }, [tasks.length, forceVisible, autoHideDelay]);

    if (!isVisible) {
      return null;
    }

    const visibleTasks = tasks.slice(0, maxVisible);
    const hiddenCount = Math.max(0, tasks.length - maxVisible);

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Task Progress HUD"
        className={cn(
          'z-50 flex flex-col gap-2.5 pointer-events-none select-none w-88 max-w-[calc(100vw-2rem)]',
          placementClasses[placement],
          className
        )}
        style={style}
        {...props}
      >
        {/* Overflow pill indicator */}
        {hiddenCount > 0 && (
          <div
            data-testid="task-hud-overflow-pill"
            className="pointer-events-auto flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-muted/90 text-muted-foreground border border-border/60 shadow-sm backdrop-blur-sm self-center"
          >
            <span>{`还有 ${hiddenCount} 项`}</span>
            <svg
              className="size-3 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </div>
        )}

        {/* Task Cards Stack */}
        <div className="flex flex-col gap-2.5 w-full">
          {visibleTasks.map((task) => {
            const status = normalizeStatus(task.status);
            const isRunning = status === 'running';
            const isSuccess = status === 'success';
            const isWarning = status === 'warning';
            const isError = status === 'error';
            const isIndeterminate = Boolean(task.indeterminate && isRunning);
            const progress = task.progress ?? -1;

            return (
              <div
                key={task.id}
                data-testid={`task-card-${task.id}`}
                className={cn(
                  'pointer-events-auto relative overflow-hidden rounded-xl border p-3.5 shadow-lg backdrop-blur-md transition-all duration-200',
                  'bg-card/95 text-card-foreground',
                  isError
                    ? 'border-destructive/50'
                    : isSuccess
                    ? 'border-primary/40'
                    : isWarning
                    ? 'border-amber-500/40'
                    : 'border-border/80'
                )}
              >
                {/* Top subtle highlight line */}
                {(isSuccess || isWarning) && (
                  <div
                    className={cn(
                      'absolute top-0 left-2 right-2 h-[0.0625rem] rounded-full opacity-60',
                      isSuccess ? 'bg-primary' : 'bg-amber-500'
                    )}
                  />
                )}

                <div className="flex items-center gap-3">
                  {/* Status Icon */}
                  <div
                    className={cn(
                      'size-9 rounded-full flex items-center justify-center shrink-0 border',
                      isError
                        ? 'bg-destructive/10 text-destructive border-destructive/25'
                        : isSuccess
                        ? 'bg-primary/10 text-primary border-primary/25'
                        : isWarning
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/25'
                        : 'bg-muted/80 text-muted-foreground border-border/50'
                    )}
                  >
                    {isRunning && (
                      <svg
                        className="size-4 animate-spin text-muted-foreground"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                    )}
                    {isSuccess && (
                      <svg
                        className="size-4 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {isWarning && (
                      <svg
                        className="size-4 text-amber-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    )}
                    {isError && (
                      <svg
                        className="size-4 text-destructive"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    )}
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-foreground truncate">
                        {task.title}
                      </span>
                      {isRunning && task.elapsedMs && task.elapsedMs > 0 ? (
                        <span className="text-micro text-muted-foreground whitespace-nowrap">
                          {task.elapsedMs < 1000
                            ? `${task.elapsedMs}ms`
                            : `${(task.elapsedMs / 1000).toFixed(1)}s`}
                        </span>
                      ) : null}
                    </div>

                    {/* Detail text or fraction */}
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {task.total && task.total > 0
                        ? `${task.detail ? `${task.detail}  ` : ''}${task.done ?? 0}/${task.total}`
                        : task.detail || ''}
                    </p>
                  </div>

                  {/* Dismiss Close Button */}
                  <button
                    type="button"
                    aria-label={`Dismiss task ${task.title}`}
                    data-testid={`task-dismiss-${task.id}`}
                    onClick={() => onDismiss?.(task.id)}
                    className="size-6 shrink-0 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                  >
                    <svg
                      className="size-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Progress Bar */}
                {(isRunning || progress >= 0) && (
                  <div className="relative w-full h-[0.1875rem] bg-muted/40 rounded-full overflow-hidden mt-3">
                    {/* Determinate progress fill */}
                    {!isIndeterminate && (
                      <div
                        data-testid={`task-progress-${task.id}`}
                        className={cn(
                          'h-full rounded-full transition-all duration-300 ease-out',
                          isError
                            ? 'bg-destructive'
                            : isWarning
                            ? 'bg-amber-500'
                            : 'bg-primary'
                        )}
                        style={{
                          width: `${Math.max(0, Math.min(100, (progress < 0 ? 0 : progress) * 100))}%`,
                        }}
                      />
                    )}

                    {/* Indeterminate shimmer */}
                    {isIndeterminate && (
                      <div
                        data-testid={`task-indeterminate-${task.id}`}
                        className="absolute top-0 bottom-0 w-2/5 rounded-full bg-primary animate-[shimmer_1.4s_infinite_linear]"
                        style={{
                          animation: 'shimmer 1.4s infinite ease-in-out',
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

TaskHud.displayName = 'TaskHud';
