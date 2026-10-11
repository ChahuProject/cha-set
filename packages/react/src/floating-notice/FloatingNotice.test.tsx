import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { FloatingNotice, type FloatingNoticeItem } from './FloatingNotice';

describe('FloatingNotice', () => {
  it('renders a single notice item', () => {
    const notices: FloatingNoticeItem[] = [
      { id: '1', title: 'File copied to clipboard', level: 'default' },
    ];

    render(<FloatingNotice notices={notices} />);

    expect(screen.getByText('File copied to clipboard')).toBeInTheDocument();
    expect(screen.queryByTestId('queue-dot-0')).not.toBeInTheDocument();
  });

  it('sorts multiple notices by priority descending and FIFO', () => {
    const notices: FloatingNoticeItem[] = [
      { id: 'low', title: 'Low priority task', level: 'default', priority: 0 },
      { id: 'high', title: 'Critical error alert', level: 'error', priority: 50 },
      { id: 'medium', title: 'Warning notice', level: 'warning', priority: 20 },
    ];

    render(<FloatingNotice notices={notices} />);

    // Highest priority 'high' should be rendered in the active notice
    expect(screen.getByText('Critical error alert')).toBeInTheDocument();
    // Card-stack behind layers peek behind the front card (max 2 layers)
    expect(screen.getByTestId('queue-dot-1')).toBeInTheDocument();
  });

  it('switches active notice when hovering queue dots', () => {
    const onActiveChange = vi.fn();
    const notices: FloatingNoticeItem[] = [
      { id: '1', title: 'First Notice', level: 'info', priority: 10 },
      { id: '2', title: 'Second Notice', level: 'info', priority: 10 },
    ];

    render(<FloatingNotice notices={notices} onActiveChange={onActiveChange} />);

    expect(screen.getByText('First Notice')).toBeInTheDocument();

    const secondDot = screen.getByTestId('queue-dot-1');
    fireEvent.mouseEnter(secondDot);

    expect(screen.getByText('Second Notice')).toBeInTheDocument();
    expect(onActiveChange).toHaveBeenCalledWith('2', 1);
  });

  it('triggers onDismiss when close button is clicked', () => {
    const onDismiss = vi.fn();
    const notices: FloatingNoticeItem[] = [
      { id: 'active-item', title: 'Closable Notice', closable: true },
    ];

    render(<FloatingNotice notices={notices} onDismiss={onDismiss} forceHover />);

    const closeBtn = screen.getByTestId('notice-close-button');
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn);
    expect(onDismiss).toHaveBeenCalledWith('active-item');
  });

  it('renders behind layers at full pill height so the peek strip stays hoverable', () => {
    const notices: FloatingNoticeItem[] = [
      { id: '1', title: 'First Notice', level: 'info', priority: 10 },
      { id: '2', title: 'Second Notice', level: 'info', priority: 10 },
    ];

    render(<FloatingNotice notices={notices} />);

    // Behind layer must be as tall as the front pill and shifted down,
    // otherwise the front pill fully covers it and hover can never reach it.
    const behindLayer = screen.getByTestId('queue-dot-1');
    expect(behindLayer.style.height).toBe('100%');
  });

  it('fires onDismiss once when the active notice expires', () => {
    vi.useFakeTimers();
    try {
      const onDismiss = vi.fn();
      const notices: FloatingNoticeItem[] = [
        { id: 'expiring', title: 'Expiring Notice', level: 'default', duration: 300 },
      ];

      render(<FloatingNotice notices={notices} onDismiss={onDismiss} />);

      React.act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
      expect(onDismiss).toHaveBeenCalledWith('expiring');
    } finally {
      vi.useRealTimers();
    }
  });

  it('supports custom renderContent slot', () => {
    const notices: FloatingNoticeItem[] = [
      { id: 'custom-1', title: 'Ignored title' },
    ];

    render(
      <FloatingNotice
        notices={notices}
        renderContent={(item) => (
          <div data-testid="custom-slot">Custom Star Rating: 5 Stars ({item.id})</div>
        )}
      />
    );

    expect(screen.getByTestId('custom-slot')).toHaveTextContent('Custom Star Rating: 5 Stars (custom-1)');
  });
});
