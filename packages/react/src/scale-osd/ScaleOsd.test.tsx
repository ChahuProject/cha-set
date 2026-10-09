import * as React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, renderHook, screen, fireEvent, act } from '@testing-library/react';
import { ScaleOsd } from './ScaleOsd';
import { useScaleOsd } from './useScaleOsd';

describe('ScaleOsd', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders scale readout when visible', () => {
    render(<ScaleOsd visible value={1.25} />);
    expect(screen.getByText('125%')).toBeInTheDocument();
  });

  it('triggers step buttons on click', () => {
    const onChange = vi.fn();
    const onStep = vi.fn();
    render(
      <ScaleOsd
        visible
        value={1.0}
        step={0.1}
        onChange={onChange}
        onStep={onStep}
      />,
    );

    const zoomIn = screen.getByLabelText('Zoom In');
    const zoomOut = screen.getByLabelText('Zoom Out');

    fireEvent.click(zoomIn);
    expect(onChange).toHaveBeenCalledWith(1.1);
    expect(onStep).toHaveBeenCalledWith(0.1);

    fireEvent.click(zoomOut);
    expect(onChange).toHaveBeenCalledWith(0.9);
    expect(onStep).toHaveBeenCalledWith(-0.1);
  });

  it('triggers reset button to 100%', () => {
    const onChange = vi.fn();
    const onReset = vi.fn();
    render(<ScaleOsd visible value={1.5} onChange={onChange} onReset={onReset} />);

    const resetBtn = screen.getByLabelText('Reset Zoom');
    fireEvent.click(resetBtn);
    expect(onChange).toHaveBeenCalledWith(1.0);
    expect(onReset).toHaveBeenCalled();
  });

  it('auto-hides after autoHideDuration and pauses on hover', () => {
    const onVisibilityChange = vi.fn();
    const { rerender } = render(
      <ScaleOsd
        value={1.0}
        autoHideDuration={1400}
        onVisibilityChange={onVisibilityChange}
      />,
    );

    // Change value to trigger automatic reveal
    rerender(
      <ScaleOsd
        value={1.2}
        autoHideDuration={1400}
        onVisibilityChange={onVisibilityChange}
      />,
    );

    expect(screen.getByText('120%')).toBeInTheDocument();

    // Hover pauses timer
    const osd = screen.getByRole('region');
    fireEvent.mouseEnter(osd);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    // Still in the document because of hover pause
    expect(screen.getByText('120%')).toBeInTheDocument();

    // Mouse leave restarts timer
    fireEvent.mouseLeave(osd);

    act(() => {
      vi.advanceTimersByTime(1300);
    });
    expect(screen.getByText('120%')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Now hidden
    expect(screen.queryByText('120%')).not.toBeInTheDocument();
  });

  it('supports custom format function', () => {
    render(
      <ScaleOsd
        visible
        value={1.5}
        format={(v) => `${v.toFixed(1)}x Speed`}
      />,
    );
    expect(screen.getByText('1.5x Speed')).toBeInTheDocument();
  });

  it('renders with size="lg" and animated={false}', () => {
    render(
      <ScaleOsd
        visible
        value={1.0}
        size="lg"
        animated={false}
      />,
    );
    const osd = screen.getByRole('region');
    expect(osd).toHaveClass('h-11');
    expect(osd).toHaveClass('transition-none');
    expect(screen.getByText('100%')).toHaveClass('min-w-[11.25rem]');
  });

  it('steps through discrete steps list', () => {
    const onChange = vi.fn();
    const steps = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    render(
      <ScaleOsd
        visible
        value={1.0}
        steps={steps}
        onChange={onChange}
      />,
    );

    const zoomIn = screen.getByLabelText('Zoom In');
    const zoomOut = screen.getByLabelText('Zoom Out');

    fireEvent.click(zoomIn);
    expect(onChange).toHaveBeenCalledWith(1.25);

    fireEvent.click(zoomOut);
    expect(onChange).toHaveBeenCalledWith(0.75);
  });

  it('maintains fixed physical pixel metrics when ignoreUiScale is true', () => {
    const { container, rerender } = render(
      <ScaleOsd
        visible
        value={1.0}
        size="default"
        ignoreUiScale
      />,
    );
    const osd = screen.getByRole('region');
    expect(osd.style.height).toBe('40px');
    expect(osd.style.fontSize).toBe('14px');

    rerender(
      <ScaleOsd
        visible
        value={1.0}
        size="lg"
        ignoreUiScale
      />,
    );
    expect(osd.style.height).toBe('42px');
    expect(osd.style.fontSize).toBe('20px');
  });

  it('uses left-0 right-0 mx-auto w-fit to avoid subpixel translation blur', () => {
    render(<ScaleOsd visible value={1.0} placement="bottom-center" />);
    const osd = screen.getByRole('region');
    expect(osd).toHaveClass('left-0');
    expect(osd).toHaveClass('right-0');
    expect(osd).toHaveClass('mx-auto');
    expect(osd).toHaveClass('w-fit');
    expect(osd).not.toHaveClass('-translate-x-1/2');
  });

  it('disables reset button when value is 100% and enables when zoomed', () => {
    const { rerender } = render(<ScaleOsd visible value={1.0} />);
    const resetBtn = screen.getByLabelText('Reset Zoom');
    expect(resetBtn).toBeDisabled();

    rerender(<ScaleOsd visible value={1.25} />);
    expect(resetBtn).not.toBeDisabled();
  });

  it('remains visible while clicking buttons under active hover', () => {
    const onVisibilityChange = vi.fn();
    const { rerender } = render(
      <ScaleOsd
        value={1.0}
        autoHideDuration={1400}
        onVisibilityChange={onVisibilityChange}
      />,
    );

    // Reveal by changing value
    rerender(
      <ScaleOsd
        value={1.1}
        autoHideDuration={1400}
        onVisibilityChange={onVisibilityChange}
      />,
    );
    const osd = screen.getByRole('region');

    // Mouse enters the OSD
    fireEvent.mouseEnter(osd);

    // Advance 3000ms (way past 1400ms)
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('110%')).toBeInTheDocument();

    // Click zoom in while hovered
    const zoomIn = screen.getByLabelText('Zoom In');
    fireEvent.click(zoomIn);

    // Advance another 3000ms while still hovering
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    // Must remain visible under hover
    expect(screen.getByRole('region')).toBeInTheDocument();

    // Mouse leave starts countdown
    fireEvent.mouseLeave(osd);
    act(() => {
      vi.advanceTimersByTime(1400);
    });
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('enforces fixed physical pixel placement when ignoreUiScale is true', () => {
    render(<ScaleOsd visible value={1.0} ignoreUiScale={true} placement="bottom-center" />);
    const osd = screen.getByRole('region');
    expect(osd.style.position).toBe('fixed');
    expect(osd.style.bottom).toBe('36px');
    expect(osd.style.left).toBe('0px');
    expect(osd.style.right).toBe('0px');
  });

  it('renders tooltips by default and suppresses them when showTooltips is false', () => {
    const { rerender } = render(<ScaleOsd visible value={1.0} />);
    const zoomIn = screen.getByLabelText('Zoom In');
    const zoomOut = screen.getByLabelText('Zoom Out');
    const reset = screen.getByLabelText('Reset Zoom');

    expect(zoomIn).toHaveAttribute('title', '放大');
    expect(zoomOut).toHaveAttribute('title', '缩小');
    expect(reset).toHaveAttribute('title', '重置');

    rerender(<ScaleOsd visible value={1.0} showTooltips={false} />);
    expect(zoomIn).not.toHaveAttribute('title');
    expect(zoomOut).not.toHaveAttribute('title');
    expect(reset).not.toHaveAttribute('title');
  });

  it('debounces button clicks when debounceMs is specified on ScaleOsd', () => {
    const onChange = vi.fn();
    render(
      <ScaleOsd
        visible
        defaultValue={1.0}
        step={0.1}
        debounceMs={300}
        onChange={onChange}
      />,
    );

    const zoomIn = screen.getByLabelText('Zoom In');
    fireEvent.click(zoomIn);
    // Visual text updates immediately to 110%
    expect(screen.getByText('110%')).toBeInTheDocument();
    // onChange not called yet
    expect(onChange).not.toHaveBeenCalled();

    // Click again before debounce expires
    fireEvent.click(zoomIn);
    expect(screen.getByText('120%')).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();

    // Advance 299ms (timer still pending)
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(onChange).not.toHaveBeenCalled();

    // Advance 1ms to reach 300ms
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(1.2);
  });

  it('useScaleOsd debounces interactive zoom while setScale applies immediately', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useScaleOsd({
        defaultValue: 1.0,
        debounceMs: 300,
        onChange,
      }),
    );

    // Initial scale is 1.0
    expect(result.current.scale).toBe(1.0);

    // zoomIn 1: visual scale updates immediately to 1.1
    act(() => {
      result.current.zoomIn();
    });
    expect(result.current.scale).toBe(1.1);
    expect(onChange).not.toHaveBeenCalled();

    // zoomIn 2: visual scale updates immediately to 1.25 (canonical step)
    act(() => {
      result.current.zoomIn();
    });
    expect(result.current.scale).toBe(1.25);
    expect(onChange).not.toHaveBeenCalled();

    // Advance past debounce timer
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(1.25);

    // Direct setScale (e.g. from settings dropdown) applies immediately
    onChange.mockClear();
    act(() => {
      result.current.setScale(1.5);
    });
    expect(result.current.scale).toBe(1.5);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(1.5);
  });

  it('applies contained placement classes and absolute positioning when contained is true', () => {
    const { rerender } = render(<ScaleOsd visible value={1.0} contained={true} placement="bottom-center" />);
    const osd = screen.getByRole('region');
    expect(osd).toHaveClass('absolute');
    expect(osd).toHaveClass('bottom-4');
    expect(osd.style.position).toBe('absolute');

    rerender(<ScaleOsd visible value={1.0} contained={false} placement="bottom-center" />);
    expect(osd).toHaveClass('fixed');
    expect(osd).toHaveClass('bottom-9');
    expect(osd.style.position).toBe('fixed');
  });

  it('does not auto-hide when autoHideDuration is 0', () => {
    render(<ScaleOsd visible value={1.0} autoHideDuration={0} />);
    expect(screen.getByText('100%')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('supports delayedCommit toggle with onImmediateChange and onCommit', () => {
    const onChange = vi.fn();
    const onImmediateChange = vi.fn();
    const onCommit = vi.fn();

    render(
      <ScaleOsd
        visible
        defaultValue={1.0}
        step={0.1}
        delayedCommit={true}
        debounceMs={500}
        onChange={onChange}
        onImmediateChange={onImmediateChange}
        onCommit={onCommit}
      />,
    );

    const zoomIn = screen.getByLabelText('Zoom In');
    fireEvent.click(zoomIn);

    // Visual readout and onImmediateChange fire immediately
    expect(screen.getByText('110%')).toBeInTheDocument();
    expect(onImmediateChange).toHaveBeenCalledWith(1.1);
    expect(onChange).not.toHaveBeenCalled();
    expect(onCommit).not.toHaveBeenCalled();

    // Advance 499ms
    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(onChange).not.toHaveBeenCalled();
    expect(onCommit).not.toHaveBeenCalled();

    // Advance 1ms to complete debounce
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onChange).toHaveBeenCalledWith(1.1);
    expect(onCommit).toHaveBeenCalledWith(1.1);
  });

  it('commits immediately when delayedCommit is false even if debounceMs is set', () => {
    const onChange = vi.fn();
    const onCommit = vi.fn();

    render(
      <ScaleOsd
        visible
        defaultValue={1.0}
        step={0.1}
        delayedCommit={false}
        debounceMs={500}
        onChange={onChange}
        onCommit={onCommit}
      />,
    );

    const zoomIn = screen.getByLabelText('Zoom In');
    fireEvent.click(zoomIn);

    // Fires immediately without waiting
    expect(screen.getByText('110%')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(1.1);
    expect(onCommit).toHaveBeenCalledWith(1.1);
  });

  it('useScaleOsd supports delayedCommit={false} to commit immediately', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useScaleOsd({
        defaultValue: 1.0,
        delayedCommit: false,
        debounceMs: 500,
        onChange,
      }),
    );

    act(() => {
      result.current.zoomIn();
    });

    expect(result.current.scale).toBe(1.1);
    expect(onChange).toHaveBeenCalledWith(1.1);
  });
});


