import { z } from 'zod';

/**
 * Status vocabulary for overall pipeline execution.
 */
export const pipelineStatusSchema = z.enum([
  'queued',
  'running',
  'success',
  'failure',
  'cancelled',
]);

/**
 * Status vocabulary for individual jobs within a pipeline.
 */
export const jobStatusSchema = z.enum([
  'queued',
  'compiling',
  'running',
  'retrying',
  'success',
  'failure',
  'cancelled',
]);

/**
 * Status vocabulary for execution steps within a job.
 */
export const stepStatusSchema = z.enum([
  'queued',
  'running',
  'success',
  'failure',
  'cancelled',
]);

/**
 * Single execution step view.
 */
export const pipelineStepSchema = z.object({
  name: z.string(),
  status: stepStatusSchema,
  durationMs: z.number().nullable().default(null),
});

/**
 * Single job view containing a sequence of steps.
 */
export const pipelineJobSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: jobStatusSchema,
  durationMs: z.number().nullable().default(null),
  steps: z.array(pipelineStepSchema).default([]),
  logLinesCount: z.number().optional(),
});

/**
 * Complete pipeline execution record.
 */
export const pipelineRunSchema = z.object({
  id: z.string(),
  name: z.string(),
  group: z.string().optional(),
  status: pipelineStatusSchema,
  startMs: z.number(),
  endMs: z.number().nullable().default(null),
  jobs: z.array(pipelineJobSchema).default([]),
  cancelDisabled: z.boolean().default(false),
});

/**
 * Neutral API contract for the PipelineView component.
 */
export const pipelineViewSchema = z.object({
  status: pipelineStatusSchema.default('running'),
  startMs: z.number().default(0),
  endMs: z.number().nullable().default(null),
  jobsTitle: z.string().default('Jobs'),
  emptyJobsText: z.string().default('No jobs'),
  cancelDisabled: z.boolean().default(false),
});

export type PipelineStatus = z.infer<typeof pipelineStatusSchema>;
export type JobStatus = z.infer<typeof jobStatusSchema>;
export type StepStatus = z.infer<typeof stepStatusSchema>;
export type PipelineStep = z.infer<typeof pipelineStepSchema>;
export type PipelineJob = z.infer<typeof pipelineJobSchema>;
export type PipelineRun = z.infer<typeof pipelineRunSchema>;
export type PipelineViewApi = z.infer<typeof pipelineViewSchema>;
