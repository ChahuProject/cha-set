import type { ReactNode } from 'react';

/**
 * Standard status vocabularies for overall pipeline execution.
 * Supports both canonical English identifiers and Chinese aliases.
 */
export type PipelineStatus =
  | 'queued'
  | 'running'
  | 'success'
  | 'failure'
  | 'cancelled'
  | '排队'
  | '运行中'
  | '成功'
  | '失败'
  | '已取消';

/**
 * Status vocabularies for individual jobs within a pipeline.
 */
export type JobStatus =
  | 'queued'
  | 'compiling'
  | 'running'
  | 'retrying'
  | 'success'
  | 'failure'
  | 'cancelled'
  | '排队'
  | '编译中'
  | '运行中'
  | '重试中'
  | '成功'
  | '失败'
  | '已取消';

/**
 * Status vocabularies for steps within a job.
 */
export type StepStatus =
  | 'queued'
  | 'running'
  | 'success'
  | 'failure'
  | 'cancelled'
  | '排队'
  | '运行中'
  | '成功'
  | '失败'
  | '已取消';

/**
 * Union of all statuses across pipeline, job, and step levels.
 */
export type AnyPipelineStatus = PipelineStatus | JobStatus | StepStatus;

/**
 * Single step within a job.
 */
export interface PipelineStep {
  name: string;
  status: StepStatus;
  durationMs: number | null;
}

/**
 * Single job within a pipeline execution.
 */
export interface PipelineJob {
  id: string;
  name: string;
  status: JobStatus;
  durationMs: number | null;
  steps: PipelineStep[];
  logLinesCount?: number;
}

/**
 * Complete pipeline execution record.
 */
export interface PipelineRun {
  id: string;
  name: string;
  group?: string;
  status: PipelineStatus;
  startMs: number;
  endMs: number | null;
  jobs: PipelineJob[];
  getLogs: (jobId: string) => string[];
  onCancel?: () => void;
  cancelDisabled?: boolean;
}

/**
 * Filter options for pipeline list in PipelineCenter.
 */
export type PipelineStatusFilter =
  | 'all'
  | 'running'
  | 'success'
  | 'failure'
  | '全部'
  | '运行中'
  | '成功'
  | '失败';

/**
 * Props for StepTimeline subcomponent.
 */
export interface StepTimelineProps {
  steps: readonly PipelineStep[];
  className?: string;
  emptyText?: string;
}

/**
 * Props for LogConsole subcomponent.
 */
export interface LogConsoleProps {
  lines: readonly string[];
  className?: string;
  emptyText?: string;
  showCopy?: boolean;
  showLineCount?: boolean;
  autoScroll?: boolean;
  copyTitle?: string;
}

/**
 * Props for JobList subcomponent.
 */
export interface JobListProps {
  jobs: readonly PipelineJob[];
  activeJobId: string | null;
  onSelectJob?: (id: string) => void;
  title?: string;
  emptyText?: string;
  className?: string;
}

/**
 * Props for single PipelineView component.
 */
export interface PipelineViewProps {
  status: PipelineStatus;
  startMs: number;
  endMs: number | null;
  jobs: readonly PipelineJob[];
  activeJobId: string | null;
  onSelectJob?: (id: string) => void;
  onCancel?: () => void;
  cancelDisabled?: boolean;
  getLogs: (jobId: string) => string[];
  jobsTitle?: string;
  emptyJobsText?: string;
  headerActionSlot?: ReactNode;
  className?: string;
}

/**
 * Props for universal PipelineCenter dashboard component.
 */
export interface PipelineCenterProps {
  pipelines: readonly PipelineRun[];
  activePipelineId: string | null;
  onSelectPipeline: (id: string) => void;
  activeJobId?: string | null;
  onSelectJob?: (id: string) => void;
  title?: string;
  emptyText?: string;
  noSelectionText?: string;
  headerActionSlot?: (pipeline: PipelineRun) => ReactNode;
  listFooterSlot?: ReactNode;
  className?: string;
}
