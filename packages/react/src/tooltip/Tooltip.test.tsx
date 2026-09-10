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

    // mouseLeave should immediately hide the tooltip
    fireEvent.mouseLeave(trigger);
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

  it('applies correct side positioning classes and data-side attributes', () => {
    const sides = [
      { side: 'top', expectedClass: 'bottom-full left-1/2 -translate-x-1/2 mb-2' },
      { side: 'bottom', expectedClass: 'top-full left-1/2 -translate-x-1/2 mt-2' },
      { side: 'left', expectedClass: 'right-full top-1/2 -translate-y-1/2 mr-2' },
      { side: 'right', expectedClass: 'left-full top-1/2 -translate-y-1/2 ml-2' },
    ] as const;

    for (const { side, expectedClass } of sides) {
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
      for (const cls of expectedClass.split(' ')) {
        expect(tooltip).toHaveClass(cls);
      }

      unmount();
    }
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
});
