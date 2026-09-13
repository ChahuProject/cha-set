import * as React from 'react';
import { cn } from '../lib/utils';
import { StatusIcon } from './icons';
import type { StepTimelineProps } from './types';
import { formatDuration, getStatusTextClass } from './utils';

/**
 * StepTimeline — standalone vertical execution timeline showing sequential steps,
 * status icons with spinning transition indicators, and formatted durations.
 */
export function StepTimeline({
  steps,
  className,
  emptyText = 'No steps',
}: StepTimelineProps) {
  if (steps.length === 0) {
    return (
      <div className={cn('text-xs text-muted-foreground select-text', className)}>
        {emptyText}
      </div>
    );
  }

  return (
    <ol className={cn('flex flex-col select-text', className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const colorClass = getStatusTextClass(step.status);

        return (
          <li key={`${index}-${step.name}`} className="flex gap-2">
            <div className="flex flex-col items-center">
              <StatusIcon
                status={step.status}
                className={cn('size-3.5 shrink-0', colorClass)}
              />
              {!isLast && (
                <div
                  aria-hidden="true"
                  className="w-[0.0625rem] flex-1 bg-border"
                />
              )}
            </div>
            <div className={cn('min-w-0 pb-3', isLast && 'pb-0')}>
              <div className="truncate text-xs font-medium text-foreground select-text">
                {step.name}
              </div>
              {step.durationMs !== null && (
                <div className="tabular-nums text-caption text-muted-foreground">
                  {formatDuration(step.durationMs)}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
