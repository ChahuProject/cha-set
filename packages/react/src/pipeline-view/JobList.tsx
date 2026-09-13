import * as React from 'react';
import { cn } from '../lib/utils';
import { ScrollArea } from '../scroll-area/ScrollArea';
import { StatusIcon } from './icons';
import type { JobListProps } from './types';
import { formatDuration, getStatusTextClass } from './utils';

/**
 * JobList — standalone job selector listing pipeline tasks with execution status,
 * spinning indicators, duration badges, and keyboard navigation.
 */
export function JobList({
  jobs,
  activeJobId,
  onSelectJob,
  title = 'Jobs',
  emptyText = 'No jobs',
  className,
}: JobListProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (jobs.length === 0) return;
    const currentIndex = jobs.findIndex(j => j.id === activeJobId);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex < jobs.length - 1 ? currentIndex + 1 : 0;
      const nextJob = jobs[nextIndex];
      if (nextJob) onSelectJob?.(nextJob.id);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : jobs.length - 1;
      const prevJob = jobs[prevIndex];
      if (prevJob) onSelectJob?.(prevJob.id);
    } else if (e.key === 'Home') {
      e.preventDefault();
      const firstJob = jobs[0];
      if (firstJob) onSelectJob?.(firstJob.id);
    } else if (e.key === 'End') {
      e.preventDefault();
      const lastJob = jobs[jobs.length - 1];
      if (lastJob) onSelectJob?.(lastJob.id);
    }
  };

  return (
    <aside
      className={cn(
        'flex w-[18rem] shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-card select-text',
        className,
      )}
    >
      {title && (
        <div className="border-b border-border px-2.5 py-2 text-xs font-semibold text-muted-foreground">
          {title}
        </div>
      )}
      <ScrollArea className="min-h-0 flex-1 p-1">
        {jobs.length === 0 ? (
          <div className="flex h-full min-h-[6rem] items-center justify-center p-3 text-center text-xs text-muted-foreground">
            {emptyText}
          </div>
        ) : (
          <div
            role="listbox"
            aria-label={title}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="flex flex-col gap-0.5 outline-none select-text"
          >
            {jobs.map(job => {
              const isSelected = job.id === activeJobId;
              const colorClass = getStatusTextClass(job.status);

              return (
                <button
                  key={job.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelectJob?.(job.id)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs transition-colors duration-quick ease-standard focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                    isSelected
                      ? 'bg-accent text-accent-foreground font-medium shadow-2xs'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                  )}
                >
                  <StatusIcon
                    status={job.status}
                    className={cn('size-3.5 shrink-0', colorClass)}
                  />
                  <span className="truncate flex-1 select-text">{job.name}</span>
                  {job.durationMs !== null && (
                    <span className="ml-auto shrink-0 tabular-nums text-[0.6875rem] text-muted-foreground">
                      {formatDuration(job.durationMs)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
