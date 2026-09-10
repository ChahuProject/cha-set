import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RangeSlider } from './RangeSlider';

describe('RangeSlider', () => {
  it('renders dual sliders with correct aria values', () => {
    render(<RangeSlider value={[20, 80]} min={0} max={100} />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toHaveAttribute('aria-valuenow', '20');
    expect(sliders[1]).toHaveAttribute('aria-valuenow', '80');
  });

  it('adjusts values via keyboard arrow navigation', () => {
    const onChange = vi.fn();
    render(<RangeSlider value={[20, 80]} min={0} max={100} step={1} onChange={onChange} />);
    const [lowThumb, highThumb] = screen.getAllByRole('slider');

    fireEvent.keyDown(lowThumb!, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith([21, 80]);

    fireEvent.keyDown(highThumb!, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith([20, 79]);
  });

  it('jumps to limits on Home and End keys', () => {
    const onChange = vi.fn();
    render(<RangeSlider value={[20, 80]} min={0} max={100} onChange={onChange} />);
    const [lowThumb, highThumb] = screen.getAllByRole('slider');

    fireEvent.keyDown(lowThumb!, { key: 'Home' });
    expect(onChange).toHaveBeenCalledWith([0, 80]);

    fireEvent.keyDown(highThumb!, { key: 'End' });
    expect(onChange).toHaveBeenCalledWith([20, 100]);
  });

  it('fires onValueChange callback along with onChange', () => {
    const onValueChange = vi.fn();
    render(<RangeSlider value={[20, 80]} min={0} max={100} step={1} onValueChange={onValueChange} />);
    const [lowThumb] = screen.getAllByRole('slider');

    fireEvent.keyDown(lowThumb!, { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenCalledWith([21, 80]);
  });

  it('prevents value changes when readOnly', () => {
    const onChange = vi.fn();
    render(<RangeSlider value={[20, 80]} min={0} max={100} step={1} readOnly onChange={onChange} />);
    const [lowThumb] = screen.getAllByRole('slider');

    fireEvent.keyDown(lowThumb!, { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('enforces minStepsBetweenThumbs gap', () => {
    const onChange = vi.fn();
    render(
      <RangeSlider
        value={[75, 80]}
        min={0}
        max={100}
        step={1}
        minStepsBetweenThumbs={5}
        onChange={onChange}
      />,
    );
    const [lowThumb] = screen.getAllByRole('slider');

    fireEvent.keyDown(lowThumb!, { key: 'ArrowRight' });
    // Should be clamped to currentHigh (80) - minGap (5) = 75
    expect(onChange).toHaveBeenCalledWith([75, 80]);
  });

  it('renders sm size with compact classes', () => {
    render(<RangeSlider value={[20, 80]} size="sm" />);
    const [lowThumb] = screen.getAllByRole('slider');
    expect(lowThumb?.className).toContain('size-3');
  });

  it('displays tooltip on focus when showTooltip is true', () => {
    render(<RangeSlider value={[20, 80]} showTooltip />);
    const [lowThumb] = screen.getAllByRole('slider');
    fireEvent.focus(lowThumb!);
    expect(screen.getByText('20')).toBeInTheDocument();
  });
});
