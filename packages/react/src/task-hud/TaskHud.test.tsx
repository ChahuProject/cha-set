import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import * as React from 'react';
import { TaskHud } from './TaskHud';
import type { TaskItem } from '@chahu/spec/task-hud';

const sampleTasks: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Packaging Bundle',
    detail: 'Compiling assets',
    progress: 0.45,
    status: 'running',
    elapsedMs: 1200,
  },
  {
    id: 'task-2',
    title: 'Database Migration',
    detail: 'Applied 12 scripts',
    progress: 1,
    status: 'success',
    total: 12,
    done: 12,
  },
  {
    id: 'task-3',
    title: 'Lint Check',
    detail: '2 warnings found',
    progress: 0,
    status: 'warning',
  },
  {
    id: 'task-4',
    title: 'Deployment Sync',
    detail: 'Network timeout',
    progress: 0,
    status: 'error',
  },
];

describe('TaskHud', () => {
  it('renders a labelled region anchored at the requested placement', () => {
    render(<TaskHud tasks={sampleTasks.slice(0, 2)} placement="top-left" forceVisible />);
    const region = screen.getByRole('region', { name: 'Task Progress HUD' });
    expect(region).toHaveAttribute('data-placement', 'top-left');
  });

  it('renders task titles, details and the done/total counter', () => {
    render(<TaskHud tasks={sampleTasks.slice(0, 2)} forceVisible />);
    expect(screen.getByText('Packaging Bundle')).toBeInTheDocument();
    expect(screen.getByText('Compiling assets')).toBeInTheDocument();
    expect(screen.getByText('Applied 12 scripts')).toBeInTheDocument();
    expect(screen.getByText('12/12')).toBeInTheDocument();
  });

  it('shows the elapsed readout for a running task', () => {
    render(<TaskHud tasks={[sampleTasks[0]!]} forceVisible />);
    expect(screen.getByText('1s')).toBeInTheDocument();
  });

  it('supports determinate progress bars', () => {
    render(<TaskHud tasks={[sampleTasks[0]!]} forceVisible />);
    expect(screen.getByTestId('activity-progress-task-1')).toHaveStyle({ width: '45%' });
  });

  it('supports indeterminate progress bars', () => {
    const indeterminateTask: TaskItem = {
      id: 'task-indet',
      title: 'Analyzing repository',
      status: 'running',
      indeterminate: true,
    };
    render(<TaskHud tasks={[indeterminateTask]} forceVisible />);
    expect(screen.getByTestId('activity-indeterminate-task-indet')).toBeInTheDocument();
  });

  it('calls onDismiss with the task id', () => {
    const handleDismiss = vi.fn();
    render(<TaskHud tasks={[sampleTasks[1]!]} onDismiss={handleDismiss} forceVisible />);
    fireEvent.click(screen.getByTestId('activity-dismiss-task-2'));
    expect(handleDismiss).toHaveBeenCalledWith('task-2');
  });

  it.each([
    ['left-center', 'left', 'right'],
    ['right-center', 'right', 'left'],
  ] as const)('hugs the %s edge with a vertical centre', (placement, hugging, empty) => {
    render(<TaskHud tasks={[sampleTasks[0]!]} placement={placement} forceVisible offset={24} />);
    const region = screen.getByRole('region', { name: 'Task Progress HUD' });

    expect(region.style[hugging]).toBe('24px');
    expect(region.style[empty]).toBe('');
    expect(region.style.top).toBe('50%');
    expect(region.style.bottom).toBe('');
    expect(region.style.transform).toBe('translateY(-50%)');
  });

  it('centres a middle-anchored stack on its axis with a horizontal shift', () => {
    render(<TaskHud tasks={[sampleTasks[0]!]} placement="bottom-center" forceVisible offset={20} />);
    const region = screen.getByRole('region', { name: 'Task Progress HUD' });

    expect(region.style.left).toBe('50%');
    expect(region.style.bottom).toBe('20px');
    expect(region.style.transform).toBe('translateX(-50%)');
  });

  it('offers cancel instead of dismiss on a cancellable running task', () => {
    const handleCancel = vi.fn();
    const handleDismiss = vi.fn();
    render(
      <TaskHud
        tasks={[{ ...sampleTasks[0]!, cancellable: true }]}
        onCancel={handleCancel}
        onDismiss={handleDismiss}
        forceVisible
      />,
    );
    expect(screen.queryByTestId('activity-dismiss-task-1')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handleCancel).toHaveBeenCalledWith('task-1');
  });

  it('renders an overflow pill and expands the whole list on demand', () => {
    render(<TaskHud tasks={sampleTasks} maxVisible={2} forceVisible />);
    expect(screen.getByText('还有 2 项')).toBeInTheDocument();
    expect(screen.queryByText('Packaging Bundle')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('activity-stack-overflow'));
    expect(screen.getByText('Packaging Bundle')).toBeInTheDocument();
    expect(screen.getByText('Deployment Sync')).toBeInTheDocument();
    expect(screen.queryByTestId('activity-stack-overflow')).not.toBeInTheDocument();
  });

  it('collapses into a summary row', () => {
    render(<TaskHud tasks={sampleTasks} forceVisible defaultCollapsed />);
    expect(screen.getByText('4 项进行中')).toBeInTheDocument();
    expect(screen.queryByTestId('activity-card-task-1')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('activity-stack-toggle'));
    expect(screen.getByTestId('activity-card-task-4')).toBeInTheDocument();
  });

  it('keeps the final frame during the grace period, then fades the HUD away', () => {
    vi.useFakeTimers();
    const { rerender } = render(<TaskHud tasks={[sampleTasks[0]!]} autoHideDelay={500} />);
    expect(screen.getByText('Packaging Bundle')).toBeInTheDocument();

    rerender(<TaskHud tasks={[]} autoHideDelay={500} />);
    expect(screen.getByRole('region', { name: 'Task Progress HUD' })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(500);
    });
    // The exit animation is still running at this point.
    expect(screen.getByTestId('activity-card-task-1')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByRole('region', { name: 'Task Progress HUD' })).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
