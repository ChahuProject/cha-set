import { z } from 'zod';

/**
 * Execution status for an individual step in StepTimeline.
 */
export const stepTimelineStatusSchema = z.enum([
  'queued',
  'running',
  'success',
  'failure',
  'cancelled',
]);

/**
 * Single step entry in StepTimeline.
 */
export const stepTimelineStepSchema = z.object({
  name: z.string(),
  status: stepTimelineStatusSchema,
  durationMs: z.number().nullable().optional(),
});

/**
 * Neutral API contract for StepTimeline component.
 * Standalone vertical execution step timeline with status indicators and formatted durations.
 */
export const stepTimelineSchema = z.object({
  steps: z.array(stepTimelineStepSchema).default([]),
  emptyText: z.string().default('No steps'),
});

export type StepTimelineStatus = z.infer<typeof stepTimelineStatusSchema>;
export type StepTimelineStep = z.infer<typeof stepTimelineStepSchema>;
export type StepTimelineApi = z.infer<typeof stepTimelineSchema>;
