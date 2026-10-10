import * as React from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  TooltipRoot,
} from './Tooltip';
import { Button } from '../button/Button';

describe('Tooltip Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders trigger children and does not show tooltip content initially', () => {
    render(
      <Tooltip content="Helpful information">
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip content on hover after delayDuration and hides on mouseLeave', () => {
    render(
      <Tooltip content="Helpful information" delayDuration={200}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Hover me' });

    fireEvent.mouseEnter(trigger);
    // Before delay expires, tooltip should NOT be visible
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    // Advance past delayDuration (200ms)
    act(() => {
      vi.advanceTimersByTime(100);
    });
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('Helpful information');

    // mouseLeave triggers the exit animation; the bubble stays mounted until
    // it finishes, then unmounts.
    fireEvent.mouseLeave(trigger);
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('cancels pending delay timer if mouse leaves before delay expires', () => {
    render(
      <Tooltip content="Tooltip message" delayDuration={300}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Hover me' });

    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    fireEvent.mouseLeave(trigger);
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on focus and hides on blur', () => {
    render(
      <Tooltip content="Focused tooltip" delayDuration={150}>
        <button type="button">Focus me</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Focus me' });

    fireEvent.focus(trigger);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByRole('tooltip')).toHaveTextContent('Focused tooltip');

    fireEvent.blur(trigger);
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens immediately when delayDuration is 0', () => {
    render(
      <Tooltip content="Instant tooltip" delayDuration={0}>
        <button type="button">Instant</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Instant' });
    fireEvent.mouseEnter(trigger);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('renders each side in the global body layer with data-side preserved', () => {
    const sides = ['top', 'bottom', 'left', 'right'] as const;

    for (const side of sides) {
      const { unmount } = render(
        <Tooltip content={`Side ${side}`} side={side} delayDuration={0}>
          <button type="button">Button {side}</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button', { name: `Button ${side}` });
      fireEvent.mouseEnter(trigger);

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveAttribute('data-side', side);
      // Global layer: portalled to document.body with fixed positioning,
      // immune to `overflow: hidden` clipping from any ancestor.
      expect(tooltip.parentElement).toBe(document.body);
      expect(tooltip.style.position).toBe('fixed');

      unmount();
    }
  });

  it('escapes overflow-hidden ancestors via the body portal', () => {
    render(
      <div data-testid="clip-box" style={{ overflow: 'hidden', position: 'relative' }}>
        <Tooltip content="Unclipped tip" delayDuration={0}>
          <button type="button">Clipped trigger</button>
        </Tooltip>
      </div>,
    );

    const trigger = screen.getByRole('button', { name: 'Clipped trigger' });
    fireEvent.mouseEnter(trigger);

    const tooltip = screen.getByRole('tooltip');
    const clipBox = screen.getByTestId('clip-box');
    expect(clipBox.contains(tooltip)).toBe(false);
    expect(document.body.contains(tooltip)).toBe(true);
  });

  it('clamps the bubble inside the viewport by default', () => {
    render(
      <Tooltip content="Clamped tip" side="top" delayDuration={0}>
        <button type="button">Corner trigger</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Corner trigger' });
    fireEvent.mouseEnter(trigger);

    const tooltip = screen.getByRole('tooltip');
    // jsdom measures every rect as 0: exact placement would be negative,
    // the default collision clamp pushes the bubble back inside the viewport.
    expect(tooltip.style.top).toBe('8px');
    expect(tooltip.style.left).toBe('8px');
  });

  it('renders exact side placement when avoidCollisions is false', () => {
    render(
      <Tooltip content="Exact tip" side="top" avoidCollisions={false} delayDuration={0}>
        <button type="button">Exact trigger</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Exact trigger' });
    fireEvent.mouseEnter(trigger);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveAttribute('data-side', 'top');
    expect(tooltip.parentElement).toBe(document.body);
    // No flip, no viewport clamping: exact anchor above the trigger,
    // even off-viewport (jsdom measures every rect as 0, bubble falls
    // back to 80x28).
    expect(tooltip.style.top).toBe('-36px');
    expect(tooltip.style.left).toBe('-40px');
  });

  it('suppresses tooltip when disabled is true', () => {
    render(
      <Tooltip content="Hidden tip" disabled delayDuration={0}>
        <button type="button">Disabled Tooltip</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Disabled Tooltip' });
    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('provides accessible role="tooltip" and links via aria-describedby', () => {
    render(
      <Tooltip content="Accessibility hint" delayDuration={0}>
        <button type="button">Accessible button</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Accessible button' });
    expect(trigger).not.toHaveAttribute('aria-describedby');

    fireEvent.mouseEnter(trigger);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveAttribute('id');
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.getAttribute('id'));
  });

  it('supports compound component structure with TooltipProvider', () => {
    render(
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button">Compound Trigger</button>
          </TooltipTrigger>
          <TooltipContent side="right">Compound Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    const trigger = screen.getByRole('button', { name: 'Compound Trigger' });
    fireEvent.mouseEnter(trigger);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('Compound Content');
    expect(tooltip).toHaveAttribute('data-side', 'right');
  });

  it('supports controlled open and onOpenChange callback', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Tooltip
        content="Controlled tip"
        open={false}
        onOpenChange={onOpenChange}
        delayDuration={0}
      >
        <button type="button">Controlled Trigger</button>
      </Tooltip>,
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    const trigger = screen.getByRole('button', { name: 'Controlled Trigger' });
    fireEvent.mouseEnter(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    // Open remains false until parent updates controlled prop
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    rerender(
      <Tooltip
        content="Controlled tip"
        open={true}
        onOpenChange={onOpenChange}
        delayDuration={0}
      >
        <button type="button">Controlled Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('forwards ref correctly on TooltipContent and TooltipRoot', () => {
    const rootRef = React.createRef<HTMLDivElement>();
    const contentRef = React.createRef<HTMLDivElement>();

    render(
      <TooltipRoot ref={rootRef} open={true}>
        <TooltipTrigger asChild>
          <span>Trigger</span>
        </TooltipTrigger>
        <TooltipContent ref={contentRef} className="custom-bubble">
          Ref test
        </TooltipContent>
      </TooltipRoot>,
    );

    expect(rootRef.current).toBeInstanceOf(HTMLDivElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(contentRef.current).toHaveClass('custom-bubble');
  });

  it('renders keyboard shortcut badge when shortcut prop is provided', () => {
    render(
      <Tooltip content="Save changes" shortcut="Ctrl+S" delayDuration={0}>
        <button type="button">Save</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Save' });
    fireEvent.mouseEnter(trigger);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('Save changes');
    const shortcut = tooltip.querySelector('[data-slot="tooltip-shortcut"]');
    expect(shortcut).toBeInTheDocument();
    expect(shortcut).toHaveTextContent('Ctrl+S');
  });

  it('renders directional arrow indicator when arrow is true', () => {
    render(
      <Tooltip content="Arrow tip" arrow side="top" delayDuration={0}>
        <button type="button">Target</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Target' });
    fireEvent.mouseEnter(trigger);

    const tooltip = screen.getByRole('tooltip');
    const arrow = tooltip.querySelector('[data-slot="tooltip-arrow"]');
    expect(arrow).toBeInTheDocument();
  });

  it('dismisses tooltip when Escape key is pressed', () => {
    render(
      <Tooltip content="Escape dismiss" delayDuration={0}>
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    fireEvent.mouseEnter(trigger);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(screen.getByRole('tooltip')).toHaveAttribute('data-state', 'closed');

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('renders in a portal attached to document.body outside overflow:hidden parent by default', () => {
    const { container } = render(
      <div style={{ overflow: 'hidden', width: '50px', height: '50px' }} data-testid="clipped-parent">
        <Tooltip content="Escaped overflow tooltip" delayDuration={0}>
          <button type="button">Inside Overflow</button>
        </Tooltip>
      </div>,
    );

    const trigger = screen.getByRole('button', { name: 'Inside Overflow' });
    fireEvent.mouseEnter(trigger);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('Escaped overflow tooltip');

    // The tooltip should NOT be a descendant of the clipped parent div
    const clippedParent = screen.getByTestId('clipped-parent');
    expect(clippedParent.contains(tooltip)).toBe(false);
    expect(document.body.contains(tooltip)).toBe(true);
  });

  it('renders inline within parent container when portal is false', () => {
    render(
      <div data-testid="inline-parent">
        <Tooltip content="Inline tooltip" portal={false} delayDuration={0}>
          <button type="button">Inline Trigger</button>
        </Tooltip>
      </div>,
    );

    const trigger = screen.getByRole('button', { name: 'Inline Trigger' });
    fireEvent.mouseEnter(trigger);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();

    const inlineParent = screen.getByTestId('inline-parent');
    expect(inlineParent.contains(tooltip)).toBe(true);
  });

  it('anchors shorthand Tooltip + composite Button to the trigger with explicit px coords', () => {
    // DocPage scenario: composite Button child resolves its DOM node through
    // the asChild ref handoff. Mock the trigger rect; everything else is 0.
    const rect = {
      x: 300, y: 200, width: 100, height: 40,
      top: 200, right: 400, bottom: 240, left: 300,
      toJSON: () => ({}),
    } as DOMRect;
    const spy = vi.spyOn(HTMLButtonElement.prototype, 'getBoundingClientRect').mockReturnValue(rect);
    try {
      render(
        <Tooltip content="DocPage tip" side="top" avoidCollisions={false} delayDuration={0}>
          <Button variant="outline">Hover or Focus Me</Button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button', { name: 'Hover or Focus Me' });
      fireEvent.mouseEnter(trigger);

      const tooltip = screen.getByRole('tooltip');
      // Bubble falls back to 80x28 in jsdom: top = 200-28-8 = 164,
      // left = 300+(100-80)/2 = 310. A null anchor would mount nothing
      // (or an unpositioned bubble); explicit px proves trigger anchoring.
      expect(tooltip.style.position).toBe('fixed');
      expect(tooltip.style.top).toBe('164px');
      expect(tooltip.style.left).toBe('310px');
      expect(tooltip).toHaveAttribute('data-side', 'top');
      expect(trigger).toHaveAttribute('aria-describedby', tooltip.getAttribute('id'));
    } finally {
      spy.mockRestore();
    }
  });
});

