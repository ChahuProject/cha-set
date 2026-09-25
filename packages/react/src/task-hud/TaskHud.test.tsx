import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import * as React from 'react';
import { TaskHud, type TaskItem } from './TaskHud';

describe('TaskHud', () => {
  const sampleTasks: TaskItem[] = [
    {
      id: 'task-1',
      title: 'Packaging Bundle',
      detail: 'Compiling assets',
      progress: 0.45,
      indeterminate: false,
      status: 'running',
      elapsedMs: 1200,
    },
    {
      id: 'task-2',
      title: 'Database Migration',
      detail: 'Applied 12 scripts',
      progress: 1,
      indeterminate: false,
      status: 'success',
      total: 12,
      done: 12,
    },
    {
      id: 'task-3',
      title: 'Lint Check',
      detail: '2 warnings found',
      progress: 0,
      indeterminate: false,
      status: 'warning',
    },
    {
      id: 'task-4',
      title: 'Deployment Sync',
      detail: 'Network timeout',
      progress: 0,
      indeterminate: false,
      status: 'error',
    },
  ];

  it('renders task cards and titles correctly', () => {
    render(<TaskHud tasks={sampleTasks.slice(0, 2)} forceVisible />);
    expect(screen.getByText('Packaging Bundle')).toBeInTheDocument();
    expect(screen.getByText('Compiling assets')).toBeInTheDocument();
    expect(screen.getByText('Database Migration')).toBeInTheDocument();
    expect(screen.getByText('Applied 12 scripts 12/12')).toBeInTheDocument();
  });

  it('supports determinate progress bars', () => {
    render(<TaskHud tasks={[sampleTasks[0]!]} forceVisible />);
    const progressBar = screen.getByTestId('task-progress-task-1');
    expect(progressBar).toHaveStyle({ width: '45%' });
  });

  it('supports indeterminate progress bars', () => {
    const indeterminateTask: TaskItem = {
      id: 'task-indet',
      title: 'Analyzing repository',
      status: 'running',
      progress: 0,
      indeterminate: true,
    };
    render(<TaskHud tasks={[indeterminateTask]} forceVisible />);
    expect(screen.getByTestId('task-indeterminate-task-indet')).toBeInTheDocument();
  });

  it('calls onDismiss callback when dismiss button is clicked', () => {
    const handleDismiss = vi.fn();
    render(<TaskHud tasks={[sampleTasks[0]!]} onDismiss={handleDismiss} forceVisible />);
    const dismissBtn = screen.getByTestId('task-dismiss-task-1');
    fireEvent.click(dismissBtn);
    expect(handleDismiss).toHaveBeenCalledWith('task-1');
  });

  it('renders overflow pill when task count exceeds maxVisible', () => {
    render(<TaskHud tasks={sampleTasks} maxVisible={2} forceVisible />);
    expect(screen.getByTestId('task-hud-overflow-pill')).toBeInTheDocument();
    expect(screen.getByText('还有 2 项')).toBeInTheDocument();
  });

  it('auto-hides after delay when tasks list becomes empty', () => {
    vi.useFakeTimers();
    const { rerender } = render(<TaskHud tasks={[sampleTasks[0]!]} autoHideDelay={500} />);
    expect(screen.getByText('Packaging Bundle')).toBeInTheDocument();

    // Pass empty tasks
    rerender(<TaskHud tasks={[]} autoHideDelay={500} />);
    // Still visible immediately due to delay
    expect(screen.getByRole('region', { name: 'Task Progress HUD' })).toBeInTheDocument();

    // Fast-forward delay
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.queryByRole('region', { name: 'Task Progress HUD' })).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
