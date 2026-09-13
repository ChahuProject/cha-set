import type { AnyPipelineStatus, PipelineStatusFilter } from './types';

/**
 * Normalizes any English or Chinese status alias into canonical English keys.
 */
export function normalizeStatus(
  status: AnyPipelineStatus,
): 'queued' | 'compiling' | 'running' | 'retrying' | 'success' | 'failure' | 'cancelled' {
  switch (status) {
    case 'queued':
    case '排队':
      return 'queued';
    case 'compiling':
    case '编译中':
      return 'compiling';
    case 'running':
    case '运行中':
      return 'running';
    case 'retrying':
    case '重试中':
      return 'retrying';
    case 'success':
    case '成功':
      return 'success';
    case 'failure':
    case '失败':
      return 'failure';
    case 'cancelled':
    case '已取消':
      return 'cancelled';
    default:
      return 'queued';
  }
}

/**
 * Human-readable label for a given status.
 */
export function getStatusLabel(status: AnyPipelineStatus): string {
  switch (normalizeStatus(status)) {
    case 'queued':
      return 'Queued';
    case 'compiling':
      return 'Compiling';
    case 'running':
      return 'Running';
    case 'retrying':
      return 'Retrying';
    case 'success':
      return 'Success';
    case 'failure':
      return 'Failed';
    case 'cancelled':
      return 'Cancelled';
  }
}

/**
 * Whether the status indicates an active spinning transition.
 */
export function isSpinningStatus(status: AnyPipelineStatus): boolean {
  const norm = normalizeStatus(status);
  return norm === 'compiling' || norm === 'running' || norm === 'retrying';
}

/**
 * Semantic text color class for icons and text elements.
 */
export function getStatusTextClass(status: AnyPipelineStatus): string {
  switch (normalizeStatus(status)) {
    case 'queued':
      return 'text-muted-foreground';
    case 'compiling':
    case 'running':
      return 'text-primary';
    case 'retrying':
      return 'text-amber-500';
    case 'success':
      return 'text-emerald-500';
    case 'failure':
      return 'text-destructive';
    case 'cancelled':
      return 'text-muted-foreground/60';
  }
}

/**
 * Border, background, and text token classes for summary badges.
 */
export function getStatusBadgeClass(status: AnyPipelineStatus): string {
  switch (normalizeStatus(status)) {
    case 'queued':
      return 'border-border bg-muted/50 text-muted-foreground';
    case 'compiling':
    case 'running':
      return 'border-blue-500/30 bg-blue-500/15 text-blue-400';
    case 'retrying':
      return 'border-amber-500/30 bg-amber-500/15 text-amber-400';
    case 'success':
      return 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400';
    case 'failure':
      return 'border-destructive/30 bg-destructive/15 text-destructive';
    case 'cancelled':
      return 'border-border bg-muted/50 text-muted-foreground';
  }
}

/**
 * Stick-to-bottom distance threshold in pixels (2.5rem base = 40).
 */
export const STICK_TO_BOTTOM_THRESHOLD_PX = 40;

/**
 * Determines whether the viewport is close enough to the bottom to remain pinned.
 */
export function shouldStickToBottom(distanceFromBottom: number): boolean {
  return distanceFromBottom <= STICK_TO_BOTTOM_THRESHOLD_PX;
}

/**
 * Formats milliseconds into mm:ss or hh:mm:ss.
 */
export function formatDuration(ms: number): string {
  if (ms < 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Computes elapsed or final duration string between start and end timestamps.
 */
export function formatTotalDuration(startMs: number, endMs: number | null): string {
  if (endMs === null || endMs < startMs) return '';
  return formatDuration(endMs - startMs);
}

/**
 * Strips ANSI color and control sequences from raw terminal text.
 */
export function stripAnsi(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/\u001B\[[0-9;]*[a-zA-Z]/g, '');
}

/**
 * Converts array of log lines into plain text with ANSI codes removed.
 */
export function logsToPlainText(lines: readonly string[]): string {
  return stripAnsi(lines.join('\n'));
}

/**
 * Checks whether a pipeline status matches a filter criteria.
 */
export function matchesStatusFilter(
  status: AnyPipelineStatus,
  filter: PipelineStatusFilter,
): boolean {
  const normStatus = normalizeStatus(status);
  const normFilter = filter.toLowerCase();

  if (normFilter === 'all' || normFilter === '全部') return true;
  if (normFilter === 'running' || normFilter === '运行中') {
    return normStatus === 'running' || normStatus === 'queued' || normStatus === 'compiling' || normStatus === 'retrying';
  }
  if (normFilter === 'success' || normFilter === '成功') {
    return normStatus === 'success';
  }
  if (normFilter === 'failure' || normFilter === 'failed' || normFilter === '失败') {
    return normStatus === 'failure';
  }
  return true;
}
