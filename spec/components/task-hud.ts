import { z } from 'zod';

/**
 * Neutral API contract for TaskHud component.
 * Floating task progress and notification HUD stack for background executions.
 */
export const taskStatusSchema = z.enum([
  'running',
  'success',
  'warning',
  'error',
]);

export const taskItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  detail: z.string().optional(),
  progress: z.number().optional().default(-1),
  indeterminate: z.boolean().optional().default(false),
  status: taskStatusSchema.default('running'),
  total: z.number().optional(),
  done: z.number().optional(),
  elapsedMs: z.number().optional(),
});

export const taskHudPlacementSchema = z.enum([
  'bottom-right',
  'bottom-left',
  'top-right',
  'top-left',
]);

export const taskHudSchema = z.object({
  tasks: z.array(taskItemSchema).default([]),
  maxVisible: z.number().default(3),
  autoHideDelay: z.number().default(600),
  placement: taskHudPlacementSchema.default('bottom-right'),
});

export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskItem = z.infer<typeof taskItemSchema>;
export type TaskHudPlacement = z.infer<typeof taskHudPlacementSchema>;
export type TaskHudApi = z.infer<typeof taskHudSchema>;
