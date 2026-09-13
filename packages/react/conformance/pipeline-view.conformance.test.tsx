import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  pipelineStatusSchema,
  jobStatusSchema,
  stepStatusSchema,
  pipelineStepSchema,
  pipelineJobSchema,
  pipelineRunSchema,
  pipelineViewSchema,
} from '@chahu/spec/pipeline-view';

describe('PipelineView conformance (spec contract)', () => {
  it('validates pipelineStatusSchema against canonical values', () => {
    expect(pipelineStatusSchema.safeParse('queued').success).toBe(true);
    expect(pipelineStatusSchema.safeParse('running').success).toBe(true);
    expect(pipelineStatusSchema.safeParse('success').success).toBe(true);
    expect(pipelineStatusSchema.safeParse('failure').success).toBe(true);
    expect(pipelineStatusSchema.safeParse('cancelled').success).toBe(true);
    expect(pipelineStatusSchema.safeParse('unknown').success).toBe(false);
  });

  it('validates jobStatusSchema against compilation and retry values', () => {
    expect(jobStatusSchema.safeParse('compiling').success).toBe(true);
    expect(jobStatusSchema.safeParse('retrying').success).toBe(true);
  });

  it('validates pipelineStepSchema and pipelineJobSchema', () => {
    const step = pipelineStepSchema.parse({
      name: 'compile',
      status: 'success',
      durationMs: 4500,
    });
    expect(step.name).toBe('compile');
    expect(step.durationMs).toBe(4500);

    const job = pipelineJobSchema.parse({
      id: 'job-1',
      name: 'Build Variant',
      status: 'running',
      durationMs: null,
      steps: [step],
    });
    expect(job.steps).toHaveLength(1);
    expect(job.status).toBe('running');
  });

  it('validates pipelineRunSchema and applies defaults', () => {
    const run = pipelineRunSchema.parse({
      id: 'run-1',
      name: 'CI Pipeline',
      status: 'queued',
      startMs: 1000,
      endMs: null,
      jobs: [],
    });
    expect(run.id).toBe('run-1');
    expect(run.cancelDisabled).toBe(false);
  });

  it('validates pipelineViewSchema defaults', () => {
    const view = pipelineViewSchema.parse({});
    expect(view.status).toBe('running');
    expect(view.jobsTitle).toBe('Jobs');
    expect(view.emptyJobsText).toBe('No jobs');
    expect(view.cancelDisabled).toBe(false);
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      pipelineView?: Record<string, boolean>;
    };
    expect(coverage.pipelineView?.jobTracking).toBe(true);
    expect(coverage.pipelineView?.stepTimeline).toBe(true);
    expect(coverage.pipelineView?.logConsole).toBe(true);
    expect(coverage.pipelineView?.statusSummary).toBe(true);
  });
});
