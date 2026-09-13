import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StepTimeline } from './StepTimeline';
import { LogConsole } from './LogConsole';
import { JobList } from './JobList';
import { PipelineView } from './PipelineView';
import { PipelineCenter } from './PipelineCenter';
import type { PipelineJob, PipelineRun, PipelineStep } from './types';
import {
  formatDuration,
  formatTotalDuration,
  logsToPlainText,
  normalizeStatus,
  shouldStickToBottom,
  stripAnsi,
} from './utils';

describe('PipelineView subcomponents and utilities', () => {
  describe('Utilities', () => {
    it('normalizes status vocabularies', () => {
      expect(normalizeStatus('running')).toBe('running');
      expect(normalizeStatus('运行中')).toBe('running');
      expect(normalizeStatus('success')).toBe('success');
      expect(normalizeStatus('成功')).toBe('success');
      expect(normalizeStatus('failure')).toBe('failure');
      expect(normalizeStatus('失败')).toBe('failure');
      expect(normalizeStatus('queued')).toBe('queued');
      expect(normalizeStatus('排队')).toBe('queued');
      expect(normalizeStatus('compiling')).toBe('compiling');
      expect(normalizeStatus('编译中')).toBe('compiling');
      expect(normalizeStatus('retrying')).toBe('retrying');
      expect(normalizeStatus('重试中')).toBe('retrying');
      expect(normalizeStatus('cancelled')).toBe('cancelled');
      expect(normalizeStatus('已取消')).toBe('cancelled');
    });

    it('formats duration properly', () => {
      expect(formatDuration(0)).toBe('00:00');
      expect(formatDuration(5000)).toBe('00:05');
      expect(formatDuration(65000)).toBe('01:05');
      expect(formatDuration(3665000)).toBe('61:05');
    });

    it('formats total duration between timestamps', () => {
      expect(formatTotalDuration(1000, null)).toBe('');
      expect(formatTotalDuration(1000, 500)).toBe('');
      expect(formatTotalDuration(1000, 4000)).toBe('00:03');
    });

    it('strips ANSI escape codes from text', () => {
      const raw = '\u001B[32mBuild Succeeded\u001B[0m in 4.2s';
      expect(stripAnsi(raw)).toBe('Build Succeeded in 4.2s');
      expect(logsToPlainText([raw, '\u001B[31mError\u001B[0m'])).toBe('Build Succeeded in 4.2s\nError');
    });

    it('checks stick to bottom threshold', () => {
      expect(shouldStickToBottom(0)).toBe(true);
      expect(shouldStickToBottom(40)).toBe(true);
      expect(shouldStickToBottom(41)).toBe(false);
      expect(shouldStickToBottom(100)).toBe(false);
    });
  });

  describe('StepTimeline', () => {
    it('renders empty message when no steps provided', () => {
      render(<StepTimeline steps={[]} emptyText="No steps recorded" />);
      expect(screen.getByText('No steps recorded')).toBeInTheDocument();
    });

    it('renders steps with names and durations', () => {
      const steps: PipelineStep[] = [
        { name: 'Compile shaders', status: 'success', durationMs: 12000 },
        { name: 'Run test suite', status: 'running', durationMs: null },
      ];
      render(<StepTimeline steps={steps} />);
      expect(screen.getByText('Compile shaders')).toBeInTheDocument();
      expect(screen.getByText('Run test suite')).toBeInTheDocument();
      expect(screen.getByText('00:12')).toBeInTheDocument();
    });
  });

  describe('LogConsole', () => {
    it('renders empty message when lines are empty', () => {
      render(<LogConsole lines={[]} emptyText="Console is waiting for logs" />);
      expect(screen.getByText('Console is waiting for logs')).toBeInTheDocument();
    });

    it('renders lines and line counter', () => {
      const lines = ['[info] Starting engine', '[info] Finished initialization'];
      render(<LogConsole lines={lines} />);
      expect(screen.getByText('2 lines')).toBeInTheDocument();
      expect(screen.getByText('[info] Starting engine')).toBeInTheDocument();
    });
  });

  describe('JobList', () => {
    const jobs: PipelineJob[] = [
      { id: 'job-1', name: 'Shader compilation', status: 'success', durationMs: 4000, steps: [] },
      { id: 'job-2', name: 'Benchmark runner', status: 'running', durationMs: null, steps: [] },
    ];

    it('renders job names and triggers onSelectJob on click', () => {
      const onSelect = vi.fn();
      render(<JobList jobs={jobs} activeJobId="job-1" onSelectJob={onSelect} />);

      expect(screen.getByText('Shader compilation')).toBeInTheDocument();
      expect(screen.getByText('Benchmark runner')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Benchmark runner'));
      expect(onSelect).toHaveBeenCalledWith('job-2');
    });

    it('supports keyboard navigation', () => {
      const onSelect = vi.fn();
      render(<JobList jobs={jobs} activeJobId="job-1" onSelectJob={onSelect} />);

      const listbox = screen.getByRole('listbox');
      fireEvent.keyDown(listbox, { key: 'ArrowDown' });
      expect(onSelect).toHaveBeenCalledWith('job-2');

      fireEvent.keyDown(listbox, { key: 'Home' });
      expect(onSelect).toHaveBeenCalledWith('job-1');
    });
  });

  describe('PipelineView', () => {
    const sampleJobs: PipelineJob[] = [
      {
        id: 'job-1',
        name: 'Build Artifacts',
        status: 'success',
        durationMs: 8000,
        steps: [{ name: 'Compile', status: 'success', durationMs: 5000 }],
      },
    ];

    it('renders pipeline status, duration, and cancel button', () => {
      const onCancel = vi.fn();
      render(
        <PipelineView
          status="running"
          startMs={1000}
          endMs={8000}
          jobs={sampleJobs}
          activeJobId="job-1"
          onCancel={onCancel}
          getLogs={() => ['Log line 1']}
        />,
      );

      expect(screen.getByText('Running')).toBeInTheDocument();
      expect(screen.getByText('00:07')).toBeInTheDocument();
      expect(screen.getByText('Build Artifacts')).toBeInTheDocument();
      expect(screen.getByText('Compile')).toBeInTheDocument();
      expect(screen.getByText('Log line 1')).toBeInTheDocument();

      const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
      fireEvent.click(cancelBtn);
      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('PipelineCenter', () => {
    const samplePipelines: PipelineRun[] = [
      {
        id: 'run-1',
        name: 'Vulkan Pipeline',
        group: 'Graphics',
        status: 'success',
        startMs: 1000,
        endMs: 5000,
        jobs: [
          { id: 'j-1', name: 'Compile SPIR-V', status: 'success', durationMs: 4000, steps: [] },
        ],
        getLogs: () => ['SPIR-V compiled successfully'],
      },
      {
        id: 'run-2',
        name: 'DirectX Pipeline',
        group: 'Graphics',
        status: 'running',
        startMs: 2000,
        endMs: null,
        jobs: [
          { id: 'j-2', name: 'Compile DXIL', status: 'running', durationMs: null, steps: [] },
        ],
        getLogs: () => ['DXIL compilation in progress'],
      },
    ];

    it('renders pipeline list and supports status filtering and search', () => {
      const onSelectPipeline = vi.fn();
      render(
        <PipelineCenter
          pipelines={samplePipelines}
          activePipelineId="run-1"
          onSelectPipeline={onSelectPipeline}
        />,
      );

      expect(screen.getByText('Vulkan Pipeline')).toBeInTheDocument();
      expect(screen.getByText('DirectX Pipeline')).toBeInTheDocument();

      // Click filter 'Running'
      fireEvent.click(screen.getByRole('button', { name: 'Running' }));
      expect(screen.queryByText('Vulkan Pipeline')).not.toBeInTheDocument();
      expect(screen.getByText('DirectX Pipeline')).toBeInTheDocument();

      // Reset filter to 'All'
      fireEvent.click(screen.getByRole('button', { name: 'All' }));
      expect(screen.getByText('Vulkan Pipeline')).toBeInTheDocument();

      // Search input
      const searchInput = screen.getByPlaceholderText('Filter pipelines...');
      fireEvent.change(searchInput, { target: { value: 'Vulkan' } });
      expect(screen.getByText('Vulkan Pipeline')).toBeInTheDocument();
      expect(screen.queryByText('DirectX Pipeline')).not.toBeInTheDocument();
    });
  });
});
