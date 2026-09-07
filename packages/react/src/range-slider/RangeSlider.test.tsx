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
});
