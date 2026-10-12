import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  it('raises the hovered card in place without moving it to the front', async () => {
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

    // Hover intent: activation fires after the pointer rests, not instantly.
    const raised = await screen.findByTestId('notice-card-1');
    await vi.waitFor(() => expect(onActiveChange).toHaveBeenCalledWith('2', 1));
    // Raised card keeps its stacked position (same Y offset) but gains top z-order + full size
    const raisedMatch = raised.style.transform.match(/translateY\(([-\d.]+)rem\)/);
    expect(raisedMatch).not.toBeNull();
    expect(Number(raisedMatch?.[1])).toBeCloseTo(Number(beforeMatch?.[1]), 5);
    expect(raised.style.zIndex).toBe('30');
    // Previous front card stays at its own position instead of being displaced
    expect(screen.getByTestId('queue-dot-0')).toBeInTheDocument();
  });

  it('defers activation during the settle glide, then raises the last-entered card', async () => {
    const onActiveChange = vi.fn();
    const notices: FloatingNoticeItem[] = [
      { id: '1', title: 'First Notice' },
      { id: '2', title: 'Second Notice' },
    ];

    render(<FloatingNotice notices={notices} onActiveChange={onActiveChange} />);
    // Mount itself notifies the initial raised card; only later calls matter.
    onActiveChange.mockClear();

    fireEvent.mouseEnter(screen.getByTestId('floating-notice-container'));
    // Entered mid-glide: stashed, not raised yet — this is what stops the
    // mid-animation flap between neighbours.
    fireEvent.mouseEnter(screen.getByTestId('queue-dot-1'));
    expect(screen.getByTestId('queue-dot-1')).toBeInTheDocument();

    // Once the window ends the stashed card raises exactly once.
    await screen.findByTestId('notice-card-1');
    await vi.waitFor(() => expect(onActiveChange).toHaveBeenCalledWith('2', 1));
    expect(onActiveChange).toHaveBeenCalledTimes(1);
  });

  it('activates instantly once the layout has settled', async () => {
    const onActiveChange = vi.fn();
    const notices: FloatingNoticeItem[] = [
      { id: '1', title: 'First Notice' },
      { id: '2', title: 'Second Notice' },
    ];

    render(<FloatingNotice notices={notices} onActiveChange={onActiveChange} />);
    onActiveChange.mockClear();

    fireEvent.mouseEnter(screen.getByTestId('floating-notice-container'));
    await React.act(async () => {
      await new Promise((r) => setTimeout(r, 150));
    });

    // Settled: no waiting, the touched card raises synchronously.
    fireEvent.mouseEnter(screen.getByTestId('queue-dot-1'));
    expect(screen.getByTestId('notice-card-1')).toBeInTheDocument();
    expect(onActiveChange).toHaveBeenCalledWith('2', 1);
  });

  it('cancels a stashed raise when the pointer leaves mid-settle', async () => {
    const onActiveChange = vi.fn();
    const notices: FloatingNoticeItem[] = [
      { id: '1', title: 'First Notice' },
      { id: '2', title: 'Second Notice' },
    ];

    render(<FloatingNotice notices={notices} onActiveChange={onActiveChange} />);
    onActiveChange.mockClear();

    fireEvent.mouseEnter(screen.getByTestId('floating-notice-container'));
    fireEvent.mouseEnter(screen.getByTestId('queue-dot-1'));
    fireEvent.mouseLeave(screen.getByTestId('floating-notice-container'));
    await React.act(async () => {
      await new Promise((r) => setTimeout(r, 200));
    });
    expect(onActiveChange).not.toHaveBeenCalled();
    expect(screen.getByTestId('notice-card-0')).toBeInTheDocument();
  });

  it('sizes cards by distance from the raised card, raised always largest', async () => {
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
    const raised = await screen.findByTestId('notice-card-2');
    expect(scaleOf('notice-card-2')).toBeCloseTo(1, 5);
    expect(raised.style.zIndex).toBe('30');

    // Non-raised cards shrink by distance, even above the raised card:
    // depth 0 (distance 2) is smaller than depth 1 (distance 1).
    expect(scaleOf('queue-dot-0')).toBeCloseTo(0.9, 5);
    expect(scaleOf('queue-dot-1')).toBeCloseTo(0.95, 5);
    expect(scaleOf('queue-dot-3')).toBeCloseTo(0.95, 5);
    // No special treatment: inactive depth 0 fans by distance exactly like the
    // back cards (distance 2 narrows like depth 2 behind).
    expect(screen.getByTestId('queue-dot-0').style.maxWidth).toBe('calc(100% - 1.8rem)');

    // Positions never move when raising: offsets only follow the hover spread.
    expect(translateYOf('queue-dot-1')).toBeCloseTo(restAbove * 1.75, 5);
    expect(translateYOf('queue-dot-3')).toBeCloseTo(restBelow * 1.75, 5);

    // Above mirrors below: the gap from the raised card to its upper neighbour
    // equals the gap to its lower neighbour (uniform body steps both ways).
    const gapAbove = translateYOf('notice-card-2') - translateYOf('queue-dot-1');
    const gapBelow = translateYOf('queue-dot-3') - translateYOf('notice-card-2');
    expect(gapAbove).toBeCloseTo(gapBelow, 5);
    expect(gapAbove).toBeGreaterThan(0);

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

    render(<FloatingNotice notices={notices} gap={7} />);

    const container = screen.getByTestId('floating-notice-container');
    const resting = screen.getByTestId('queue-dot-1').style.transform;
    expect(resting).toContain('translateY(0.4375rem)');

    fireEvent.mouseEnter(container);
    const spread = screen.getByTestId('queue-dot-1').style.transform;
    expect(spread).toContain('translateY(0.765625rem)');
    // Spreading never changes which card is raised.
    expect(screen.getByTestId('notice-card-0')).toBeInTheDocument();

    fireEvent.mouseLeave(container);
    expect(screen.getByTestId('queue-dot-1').style.transform).toContain(
      'translateY(0.4375rem)'
    );
  });

  it('adapts gap dynamically based on notice item count', () => {
    // 2 items: enlarged gap (12dp = 0.75rem)
    const twoItems: FloatingNoticeItem[] = [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' },
    ];
    const { unmount: unmount2 } = render(<FloatingNotice notices={twoItems} />);
    expect(screen.getByTestId('queue-dot-1').style.transform).toContain('translateY(0.75rem)');
    unmount2();

    // 3 items: medium gap (10dp = 0.625rem)
    const threeItems: FloatingNoticeItem[] = [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' },
      { id: '3', title: 'Item 3' },
    ];
    const { unmount: unmount3 } = render(<FloatingNotice notices={threeItems} />);
    expect(screen.getByTestId('queue-dot-1').style.transform).toContain('translateY(0.625rem)');
    unmount3();

    // 4+ items: compact standard gap (7dp = 0.4375rem)
    const fourItems: FloatingNoticeItem[] = [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' },
      { id: '3', title: 'Item 3' },
      { id: '4', title: 'Item 4' },
    ];
    const { unmount: unmount4 } = render(<FloatingNotice notices={fourItems} />);
    expect(screen.getByTestId('queue-dot-1').style.transform).toContain('translateY(0.4375rem)');
    unmount4();
  });

  it('respects explicit custom gap override regardless of notice count', () => {
    const twoItems: FloatingNoticeItem[] = [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' },
    ];
    render(<FloatingNotice notices={twoItems} gap={16} />);
    // 16dp * 0.0625 = 1rem
    expect(screen.getByTestId('queue-dot-1').style.transform).toContain('translateY(1rem)');
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
    // Every joint uses the same gap — depth 0 included — so the fan reads
    // identically above and below any raised card (no near-dense/far-sparse
    // surprise, no special first card).
    expect(o0).toBeCloseTo(0.4375, 5);
    expect(o1 - o0).toBeCloseTo(0.4375, 5);
    expect(o2 - o1).toBeCloseTo(0.4375, 5);

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

  it('never slides sideways: centering stays out of the animated transform', async () => {
    const notices: FloatingNoticeItem[] = [
      { id: 'a', title: 'Notice A' },
      { id: 'b', title: 'Notice B' },
      { id: 'c', title: 'Notice C' },
    ];

    const { container } = render(<FloatingNotice notices={notices} />);
    const transforms = () =>
      Array.from(container.querySelectorAll('[data-active]')).map(
        (el) => (el as HTMLElement).style.transform
      );

    // At rest every layer shares the same transform list with a constant X
    // channel (translateX(-50%) translateY scale).
    expect(transforms()).toHaveLength(3);
    for (const t of transforms()) {
      expect(t).toContain('translateX(-50%)');
    }

    // Switching the raised card must keep the X channel constant too:
    // activation only changes Y offset and scale, never slides sideways.
    fireEvent.mouseEnter(screen.getByTestId('floating-notice-container'));
    fireEvent.mouseEnter(screen.getByTestId('queue-dot-2'));
    await screen.findByTestId('notice-card-2');
    for (const t of transforms()) {
      expect(t).toContain('translateX(-50%)');
    }
    fireEvent.mouseEnter(screen.getByTestId('queue-dot-0'));
    await screen.findByTestId('notice-card-0');
    for (const t of transforms()) {
      expect(t).toContain('translateX(-50%)');
    }
  });

  it('fans widths symmetrically by distance without following content length', async () => {
    const notices: FloatingNoticeItem[] = [
      { id: 'short', title: 'OK' },
      { id: 'long', title: 'This is a much longer notice message that needs more room' },
      { id: 'mid', title: 'Medium length note' },
    ];

    render(<FloatingNotice notices={notices} />);

    fireEvent.mouseEnter(screen.getByTestId('queue-dot-1'));
    await screen.findByTestId('notice-card-1');

    // Front mirrors back: both distance-1 cards share the same fan width, and
    // width itself stays content-sized in both states so only the min/max
    // clamps (length-percentage, covered by transition-all) glide the grow.
    expect(screen.getByTestId('queue-dot-0').style.width).toBe('max-content');
    expect(screen.getByTestId('queue-dot-0').style.maxWidth).toBe('calc(100% - 1rem)');
    expect(screen.getByTestId('queue-dot-2').style.maxWidth).toBe('calc(100% - 1rem)');
    // Container never follows content length: fixed sizer still anchors it.
    const sizer = screen
      .getByTestId('floating-notice-container')
      .querySelector('[aria-hidden="true"]');
    expect(sizer?.className).toContain('w-64');
    // Raised card grows only: content width pinned by min-width 100%, with no
    // inline max cap so the max-w class lets long messages open up.
    const raisedStyle = screen.getByTestId('notice-card-1').style;
    expect(raisedStyle.width).toBe('max-content');
    expect(raisedStyle.minWidth).toBe('100%');
    expect(raisedStyle.maxWidth).toBe('');
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

  it('copies the raised notice message via the copy button ahead of close', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const notices: FloatingNoticeItem[] = [
      { id: '1', title: 'Deploy finished', description: '32 services updated' },
    ];

    render(<FloatingNotice notices={notices} forceHover />);

    const copyBtn = screen.getByTestId('notice-copy-button');
    const closeBtn = screen.getByTestId('notice-close-button');
    // Copy sits ahead of (before) the close button in DOM order.
    expect(copyBtn.compareDocumentPosition(closeBtn)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );

    fireEvent.click(copyBtn);
    await vi.waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('Deploy finished\n32 services updated');
    });
    // Copied feedback appears on the same button.
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    });
  });

  it('copies just the title when a notice has no description', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const notices: FloatingNoticeItem[] = [{ id: '1', title: 'Just a title' }];

    render(<FloatingNotice notices={notices} forceHover />);

    fireEvent.click(screen.getByTestId('notice-copy-button'));
    await vi.waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('Just a title');
    });
  });

  it('triggers onDismiss when close button is clicked', () => {    const onDismiss = vi.fn();
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
