import { z } from 'zod';
import { activityPlacementSchema } from '../shared/placement';

/**
 * Neutral API contract for the TaskHud component.
 *
 * A viewport-anchored stack of background-execution cards. The HUD owns the
 * stack mechanics (placement, overflow, collapse, auto-hide, keyboard
 * traversal); each card is a presentational shell defined by `taskItemSchema`.
 */
export const activityStatusSchema = z.enum([
  'queued',
  'running',
  'success',
  'warning',
  'error',
  'cancelled',
]);

/**
 * One background execution.
 *
 * `progress` and `indeterminate` are deliberately independent: `-1` means "no
 * bar at all" (a queued or finished task), `0..1` is a determinate bar, and
 * `indeterminate: true` asks for the shimmering bar of an unknown-duration
 * step. Deriving one from the other would make a running task that has not
 * reported a fraction indistinguishable from a finished one.
 */
export const taskItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  detail: z.string().optional(),
  progress: z.number().default(-1),
  indeterminate: z.boolean().default(false),
  status: activityStatusSchema.default('running'),
  total: z.number().optional(),
  done: z.number().optional(),
  elapsedMs: z.number().optional(),
  cancellable: z.boolean().default(false),
});

export const taskHudSchema = z.object({
  tasks: z.array(taskItemSchema).default([]),
  /** Cards rendered before the stack overflows into its "show all" pill. */
  maxVisible: z.number().default(3),
  /** Grace period before an emptied HUD fades out. `0` hides it immediately. */
  autoHideDelay: z.number().default(600),
  placement: activityPlacementSchema.default('bottom-right'),
  /** Inset from the anchored viewport edges, in logical units. */
  offset: z.number().default(16),
  /** Whether the stack offers a collapse-to-summary-row control. */
  collapsible: z.boolean().default(true),
  /** Renders collapsed on first paint. */
  defaultCollapsed: z.boolean().default(false),
});

export type ActivityStatus = z.infer<typeof activityStatusSchema>;
/**
 * Caller-facing shape. Every field that carries a `.default()` is optional here,
 * so a host writes `{ id, title, status: 'running' }` and lets the stack fill the
 * rest — the defaults live in the schema and nowhere else.
 */
export type TaskItem = z.input<typeof taskItemSchema>;
/** Post-parse shape, with every default materialised. */
export type ResolvedTaskItem = z.output<typeof taskItemSchema>;
export type TaskHudPlacement = z.infer<typeof activityPlacementSchema>;
export type TaskHudApi = z.input<typeof taskHudSchema>;
export type ResolvedTaskHudApi = z.output<typeof taskHudSchema>;
