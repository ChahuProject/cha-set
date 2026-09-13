import * as React from 'react';
import { Badge } from '../badge/Badge';
import { Button } from '../button/Button';
import { Input } from '../input/Input';
import { cn } from '../lib/utils';
import { VirtualList } from '../virtual/VirtualList';
import { ClockIcon, FilterIcon, LayersIcon, SearchIcon, StatusIcon } from './icons';
import { PipelineView } from './PipelineView';
import type { PipelineCenterProps, PipelineStatusFilter } from './types';
import {
  formatTotalDuration,
  getStatusBadgeClass,
  getStatusTextClass,
  isSpinningStatus,
  matchesStatusFilter,
} from './utils';

const FILTER_OPTIONS: { id: PipelineStatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'running', label: 'Running' },
  { id: 'success', label: 'Success' },
  { id: 'failure', label: 'Failed' },
];

/**
 * PipelineCenter — universal master-detail pipeline execution center with status filtering,
 * keyword searching, virtualized pipeline run list, and integrated run view.
 */
export function PipelineCenter({
  pipelines,
  activePipelineId,
  onSelectPipeline,
  activeJobId: controlledJobId,
  onSelectJob: controlledSelectJob,
  title = 'Pipelines',
  emptyText = 'No pipelines found',
  noSelectionText = 'Select a pipeline from the list to view execution details',
  headerActionSlot,
  listFooterSlot,
  className,
}: PipelineCenterProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<PipelineStatusFilter>('all');
  const [internalJobId, setInternalJobId] = React.useState<string | null>(null);

  const filteredPipelines = React.useMemo(() => {
    return pipelines.filter(item => {
      if (!matchesStatusFilter(item.status, statusFilter)) return false;
      if (!searchQuery.trim()) return true;
      const query = searchQuery.trim().toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        (item.group && item.group.toLowerCase().includes(query))
      );
    });
  }, [pipelines, statusFilter, searchQuery]);

  const activePipeline = React.useMemo(() => {
    return pipelines.find(p => p.id === activePipelineId) ?? null;
  }, [pipelines, activePipelineId]);

  const effectiveJobId = React.useMemo(() => {
    if (controlledJobId !== undefined) return controlledJobId;
    if (!activePipeline || activePipeline.jobs.length === 0) return null;
    const match = activePipeline.jobs.find(j => j.id === internalJobId);
    return match ? match.id : (activePipeline.jobs[0]?.id ?? null);
  }, [controlledJobId, activePipeline, internalJobId]);

  const handleSelectJob = React.useCallback(
    (jobId: string) => {
      if (controlledSelectJob) {
        controlledSelectJob(jobId);
      } else {
        setInternalJobId(jobId);
      }
    },
    [controlledSelectJob],
  );

  return (
    <div
      className={cn(
        'flex h-full w-full min-h-0 min-w-0 overflow-hidden rounded-lg border border-border bg-card select-text',
        className,
      )}
    >
      <aside className="flex w-[21rem] shrink-0 flex-col border-r border-border bg-muted/20">
        <div className="flex flex-col gap-2 border-b border-border p-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <LayersIcon className="size-3.5 text-primary" />
              {title}
            </span>
            <span className="text-[0.6875rem] text-muted-foreground">
              {filteredPipelines.length} runs
            </span>
          </div>

          <div className="flex items-center gap-1">
            {FILTER_OPTIONS.map(opt => (
              <Button
                key={opt.id}
                size="sm"
                variant={statusFilter === opt.id ? 'secondary' : 'ghost'}
                className={cn(
                  'h-6 px-2 text-[0.6875rem] cursor-pointer',
                  statusFilter === opt.id && 'font-medium shadow-2xs',
                )}
                onClick={() => setStatusFilter(opt.id)}
              >
                {opt.label}
              </Button>
            ))}
          </div>

          <div className="relative flex items-center">
            <SearchIcon className="absolute left-2 size-3 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Filter pipelines..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-7 pl-7 text-xs bg-background/50"
            />
          </div>
        </div>

        <div className="flex-1 min-h-0 p-1.5 overflow-hidden">
          <VirtualList
            items={filteredPipelines}
            estimateSize={74}
            gap={4}
            className="h-full w-full"
            emptyNode={
              <div className="flex h-32 flex-col items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                <FilterIcon className="size-4 opacity-40" />
                <span>{emptyText}</span>
              </div>
            }
            renderRow={item => {
              const isSelected = item.id === activePipelineId;
              const duration = formatTotalDuration(item.startMs, item.endMs);
              const colorClass = getStatusTextClass(item.status);
              const badgeClass = getStatusBadgeClass(item.status);
              const spinning = isSpinningStatus(item.status);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectPipeline(item.id)}
                  className={cn(
                    'w-full text-left rounded-md p-2.5 transition-colors duration-quick ease-standard flex flex-col gap-1.5 border border-transparent select-none cursor-pointer',
                    isSelected
                      ? 'bg-accent text-accent-foreground border-border/80 shadow-2xs'
                      : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <StatusIcon
                        status={item.status}
                        className={cn('size-3.5 shrink-0', colorClass, spinning && 'animate-spin')}
                      />
                      <span className="font-medium text-xs truncate text-foreground">
                        {item.name}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'inline-flex shrink-0 items-center rounded-sm border px-1 py-0.2 text-[0.625rem]',
                        badgeClass,
                      )}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[0.6875rem] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {item.group && (
                        <Badge
                          variant="outline"
                          className="h-4 px-1 text-[0.625rem] font-normal border-border/80"
                        >
                          {item.group}
                        </Badge>
                      )}
                      <span>{item.jobs.length} jobs</span>
                    </span>
                    {duration && (
                      <span className="flex items-center gap-0.5 font-mono">
                        <ClockIcon className="size-2.5" />
                        {duration}
                      </span>
                    )}
                  </div>
                </button>
              );
            }}
          />
        </div>

        {listFooterSlot && (
          <div className="border-t border-border p-2 shrink-0 bg-muted/10">
            {listFooterSlot}
          </div>
        )}
      </aside>

      <main className="flex flex-1 min-h-0 min-w-0 flex-col p-3 overflow-hidden bg-background">
        {activePipeline ? (
          <PipelineView
            status={activePipeline.status}
            startMs={activePipeline.startMs}
            endMs={activePipeline.endMs}
            jobs={activePipeline.jobs}
            activeJobId={effectiveJobId}
            onSelectJob={handleSelectJob}
            onCancel={activePipeline.onCancel}
            cancelDisabled={
              activePipeline.cancelDisabled ??
              (activePipeline.status !== 'queued' && activePipeline.status !== 'running')
            }
            getLogs={activePipeline.getLogs}
            headerActionSlot={
              headerActionSlot ? headerActionSlot(activePipeline) : undefined
            }
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <LayersIcon className="size-8 opacity-30" />
            <span className="text-sm">{noSelectionText}</span>
          </div>
        )}
      </main>
    </div>
  );
}
