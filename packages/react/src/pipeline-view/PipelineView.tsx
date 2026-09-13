import * as React from 'react';
import { Button } from '../button/Button';
import { cn } from '../lib/utils';
import { ClockIcon, StatusIcon } from './icons';
import { JobList } from './JobList';
import { LogConsole } from './LogConsole';
import { StepTimeline } from './StepTimeline';
import type { PipelineViewProps } from './types';
import {
  formatTotalDuration,
  getStatusBadgeClass,
  getStatusLabel,
  getStatusTextClass,
} from './utils';

/**
 * Overall status badge component.
 */
function PipelineStatusBadge({ status }: { status: PipelineViewProps['status'] }) {
  const badgeClass = getStatusBadgeClass(status);
  const textClass = getStatusTextClass(status);
  const label = getStatusLabel(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium select-none',
        badgeClass,
      )}
    >
      <StatusIcon status={status} className={cn('size-3', textClass)} />
      <span>{label}</span>
    </span>
  );
}

/**
 * PipelineView — single pipeline run execution view with job list, step timeline,
 * virtualized auto-scrolling log console, and execution controls.
 */
export function PipelineView({
  status,
  startMs,
  endMs,
  jobs,
  activeJobId,
  onSelectJob,
  onCancel,
  cancelDisabled,
  getLogs,
  jobsTitle = 'Jobs',
  emptyJobsText = 'No jobs in this pipeline',
  headerActionSlot,
  className,
}: PipelineViewProps) {
  const currentLogs = React.useMemo(
    () => (activeJobId === null ? [] : getLogs(activeJobId)),
    [activeJobId, getLogs],
  );

  const activeJob = React.useMemo(
    () => jobs.find(j => j.id === activeJobId) ?? null,
    [jobs, activeJobId],
  );

  const totalDuration = formatTotalDuration(startMs, endMs);

  return (
    <div className={cn('flex min-h-0 flex-1 gap-3 select-text', className)}>
      <JobList
        jobs={jobs}
        activeJobId={activeJobId}
        onSelectJob={onSelectJob}
        title={jobsTitle}
        emptyText={emptyJobsText}
      />

      <section className="flex min-w-0 flex-1 flex-col gap-2">
        <header className="flex shrink-0 items-center gap-2">
          <PipelineStatusBadge status={status} />

          {totalDuration !== '' && (
            <span className="flex items-center gap-1 tabular-nums text-xs text-muted-foreground font-mono">
              <ClockIcon className="size-3" />
              {totalDuration}
            </span>
          )}

          {headerActionSlot && (
            <div className="ml-auto flex items-center gap-2">
              {headerActionSlot}
            </div>
          )}

          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn('cursor-pointer', !headerActionSlot && 'ml-auto')}
              disabled={cancelDisabled}
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </header>

        {activeJob !== null && activeJob.steps.length > 0 && (
          <div className="shrink-0 rounded-lg border border-border p-3 bg-card">
            <StepTimeline steps={activeJob.steps} />
          </div>
        )}

        <LogConsole key={activeJobId ?? ''} lines={currentLogs} />
      </section>
    </div>
  );
}
