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

    // Highest priority 'high' should be rendered in the raised notice
    expect(screen.getByText('Critical error alert')).toBeInTheDocument();
    // Full stack behind layers peek behind at fixed sorted positions
    expect(screen.getByTestId('queue-dot-1')).toBeInTheDocument();
  });

  it('raises the hovered card in place without moving it to the front', () => {
    const onActiveChange = vi.fn();
    const notices: FloatingNoticeItem[] = [
      { id: '1', title: 'First Notice', level: 'info', priority: 10 },
      { id: '2', title: 'Second Notice', level: 'info', priority: 10 },
    ];

    render(<FloatingNotice notices={notices} onActiveChange={onActiveChange} />);

    expect(screen.getByTestId('notice-card-0')).toBeInTheDocument();

    // Pin the hover-spread state first so the offset comparison is deterministic
    // whether or not the card hover also flips the container hover flag.
    fireEvent.mouseEnter(screen.getByTestId('floating-notice-container'));
    const beforeMatch = screen
      .getByTestId('queue-dot-1')
      .style.transform.match(/translateY\(([-\d.]+)rem\)/);
    fireEvent.mouseEnter(screen.getByTestId('queue-dot-1'));

    expect(onActiveChange).toHaveBeenCalledWith('2', 1);
    // Raised card keeps its stacked position (same Y offset) but gains top z-order + full size
    const raised = screen.getByTestId('notice-card-1');
    const raisedMatch = raised.style.transform.match(/translateY\(([-\d.]+)rem\)/);
    expect(raisedMatch).not.toBeNull();
    expect(Number(raisedMatch?.[1])).toBeCloseTo(Number(beforeMatch?.[1]), 5);
    expect(raised.style.zIndex).toBe('30');
    // Previous front card stays at its own position instead of being displaced
    expect(screen.getByTestId('queue-dot-0')).toBeInTheDocument();
  });

  it('sizes cards by distance from the raised card, raised always largest', () => {
    const notices: FloatingNoticeItem[] = [
      { id: 'a', title: 'Notice A' },
      { id: 'b', title: 'Notice B' },
      { id: 'c', title: 'Notice C' },
      { id: 'd', title: 'Notice D' },
    ];

    const translateYOf = (testId: string): number => {
      const t = screen.getByTestId(testId).style.transform;
      const m = t.match(/translateY\(([-\d.]+)rem\)/);
      return m?.[1] !== undefined ? Number(m[1]) : 0;
    };
    const scaleOf = (testId: string): number => {
      const t = screen.getByTestId(testId).style.transform;
      const m = t.match(/scale\(([-\d.]+)\)/);
      return m?.[1] !== undefined ? Number(m[1]) : NaN;
    };

    render(<FloatingNotice notices={notices} />);

    const restAbove = translateYOf('queue-dot-1');
    const restBelow = translateYOf('queue-dot-3');

    fireEvent.mouseEnter(screen.getByTestId('floating-notice-container'));
    fireEvent.mouseEnter(screen.getByTestId('queue-dot-2'));

    // Raised card restores full size in place
    const raised = screen.getByTestId('notice-card-2');
    expect(scaleOf('notice-card-2')).toBeCloseTo(1, 5);
    expect(raised.style.zIndex).toBe('30');

    // Non-raised cards shrink by distance, even above the raised card:
    // depth 0 (distance 2) is smaller than depth 1 (distance 1).
    expect(scaleOf('queue-dot-0')).toBeCloseTo(0.9, 5);
    expect(scaleOf('queue-dot-1')).toBeCloseTo(0.95, 5);
    expect(scaleOf('queue-dot-3')).toBeCloseTo(0.95, 5);
    // No special treatment: inactive depth 0 narrows exactly like any other
    // card at the same distance instead of keeping full width.
    expect(screen.getByTestId('queue-dot-0').style.width).toBe('calc(100% - 1.8rem)');

    // Positions never move when raising: offsets only follow the hover spread.
    expect(translateYOf('queue-dot-1')).toBeCloseTo(restAbove * 1.75, 5);
    expect(translateYOf('queue-dot-3')).toBeCloseTo(restBelow * 1.75, 5);

    // Nearer cards stack above farther ones, raised stays on top.
    const zRaised = Number(raised.style.zIndex);
    const zNear = Number(screen.getByTestId('queue-dot-1').style.zIndex);
    const zFar = Number(screen.getByTestId('queue-dot-0').style.zIndex);
    expect(zRaised).toBeGreaterThan(zNear);
    expect(zNear).toBeGreaterThan(zFar);
  });

  it('widens gaps while hovered so peeking strips stay reachable', () => {
    const notices: FloatingNoticeItem[] = [
      { id: 'a', title: 'Notice A' },
      { id: 'b', title: 'Notice B' },
      { id: 'c', title: 'Notice C' },
    ];

    render(<FloatingNotice notices={notices} />);

    const container = screen.getByTestId('floating-notice-container');
    const resting = screen.getByTestId('queue-dot-1').style.transform;
    expect(resting).toContain('translateY(0.875rem)');

    fireEvent.mouseEnter(container);
    const spread = screen.getByTestId('queue-dot-1').style.transform;
    expect(spread).toContain('translateY(1.53125rem)');
    // Spreading never changes which card is raised.
    expect(screen.getByTestId('notice-card-0')).toBeInTheDocument();

    fireEvent.mouseLeave(container);
    expect(screen.getByTestId('queue-dot-1').style.transform).toContain(
      'translateY(0.875rem)'
    );
  });

  it('disperses deeper layers with diminishing gaps and shrinking sizes', () => {
    const notices: FloatingNoticeItem[] = [
      { id: 'a', title: 'Notice A' },
      { id: 'b', title: 'Notice B' },
      { id: 'c', title: 'Notice C' },
      { id: 'd', title: 'Notice D' },
    ];

    render(<FloatingNotice notices={notices} />);

    const offsets = [1, 2, 3].map((depth) => {
      const el = screen.getByTestId(`queue-dot-${depth}`);
      const match = el.style.transform.match(/translateY\(([-\d.]+)rem\)/);
      expect(match).not.toBeNull();
      return Number(match?.[1]);
    });
    const [o0 = 0, o1 = 0, o2 = 0] = offsets;
    // Offsets spread out (more dispersed than the old 6px/12px stack)
    expect(o0).toBeGreaterThan(0.75);
    expect(o1).toBeGreaterThan(o0 + 0.5);
    expect(o2).toBeGreaterThan(o1 + 0.25);
    // Gaps diminish toward the back
    expect(o1 - o0).toBeLessThan(o0);
    expect(o2 - o1).toBeLessThan(o1 - o0);

    const scales = [1, 2, 3].map((depth) => {
      const el = screen.getByTestId(`queue-dot-${depth}`);
      const match = el.style.transform.match(/scale\(([-\d.]+)\)/);
      return Number(match?.[1]);
    });
    const [s0 = 0, s1 = 0, s2 = 0] = scales;
    expect(s0).toBeCloseTo(0.95, 5);
    expect(s1).toBeLessThan(s0);
    expect(s2).toBeLessThan(s1);

    const opacities = [1, 2, 3].map(
      (depth) => Number(screen.getByTestId(`queue-dot-${depth}`).style.opacity)
    );
    const [p0 = 0, p1 = 0, p2 = 0] = opacities;
    expect(p0).toBeLessThan(1);
    expect(p1).toBeLessThan(p0);
    expect(p2).toBeLessThan(p1);
  });

  it('renders an unlimited stack without slicing behind layers', () => {
    const notices: FloatingNoticeItem[] = Array.from({ length: 5 }, (_, i) => ({
      id: `n-${i}`,
      title: `Notice ${i}`,
    }));

    render(<FloatingNotice notices={notices} />);

    for (const depth of [1, 2, 3, 4]) {
      expect(screen.getByTestId(`queue-dot-${depth}`)).toBeInTheDocument();
    }
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
