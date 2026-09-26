import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import * as React from 'react';
import { NotificationStack } from './NotificationStack';
import type { NotificationItem } from '@chahu/spec/notification-stack';

const notifications: NotificationItem[] = [
  { id: 'n-1', title: 'Build finished', description: 'All packages green', level: 'success' },
  {
    id: 'n-2',
    title: 'Sync failed',
    description: 'Remote rejected the push',
    level: 'error',
    actions: [
      { id: 'retry', label: 'Retry', variant: 'default' },
      { id: 'details', label: 'Details' },
    ],
  },
];

describe('NotificationStack', () => {
  it('renders a live region with every notification', () => {
    render(<NotificationStack notifications={notifications} />);
    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Build finished')).toBeInTheDocument();
    expect(screen.getByText('Sync failed')).toBeInTheDocument();
  });

  it('reports inline action presses with the notification id', () => {
    const handleAction = vi.fn();
    render(<NotificationStack notifications={notifications} onAction={handleAction} />);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(handleAction).toHaveBeenCalledWith('n-2', 'retry');
  });

  it('calls onDismiss from the trailing dismiss control', () => {
    const handleDismiss = vi.fn();
    render(<NotificationStack notifications={notifications} onDismiss={handleDismiss} />);
    fireEvent.click(screen.getByTestId('activity-dismiss-n-1'));
    expect(handleDismiss).toHaveBeenCalledWith('n-1');
  });

  it('expires a notification after its own duration', () => {
    vi.useFakeTimers();
    const handleDismiss = vi.fn();
    render(
      <NotificationStack
        notifications={[{ id: 'n-3', title: 'Saved', duration: 800 }]}
        defaultDuration={5000}
        onDismiss={handleDismiss}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(handleDismiss).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(handleDismiss).toHaveBeenCalledWith('n-3');
    vi.useRealTimers();
  });

  it('suspends the countdown while the pointer rests on the stack', () => {
    vi.useFakeTimers();
    const handleDismiss = vi.fn();
    render(
      <NotificationStack
        notifications={[{ id: 'n-4', title: 'Saved', duration: 1000 }]}
        onDismiss={handleDismiss}
      />,
    );
    const region = screen.getByRole('region', { name: 'Notifications' });

    act(() => {
      vi.advanceTimersByTime(400);
    });
    fireEvent.pointerOver(region);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(handleDismiss).not.toHaveBeenCalled();

    fireEvent.pointerOut(region);
    act(() => {
      vi.advanceTimersByTime(599);
    });
    expect(handleDismiss).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2);
    });
    expect(handleDismiss).toHaveBeenCalledWith('n-4');
    vi.useRealTimers();
  });

  it('keeps a zero-duration notification on screen', () => {
    vi.useFakeTimers();
    const handleDismiss = vi.fn();
    render(
      <NotificationStack
        notifications={[{ id: 'n-5', title: 'Action required', duration: 0 }]}
        onDismiss={handleDismiss}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(handleDismiss).not.toHaveBeenCalled();
    expect(screen.getByText('Action required')).toBeInTheDocument();
    vi.useRealTimers();
  });
});
