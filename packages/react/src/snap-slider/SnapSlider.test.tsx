import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SnapSlider } from './SnapSlider';

describe('SnapSlider', () => {
  it('renders slider and label annotations', () => {
    render(
      <SnapSlider
        count={5}
        labels={['1x', '2x', '3x', '4x', '5x']}
        leftLabel="Min"
        rightLabel="Max"
        value={2}
      />,
    );

    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-valuenow', '2');

    expect(screen.getByText('Min')).toBeInTheDocument();
    expect(screen.getByText('3x')).toBeInTheDocument();
    expect(screen.getByText('Max')).toBeInTheDocument();
  });

  it('adjusts values via keyboard arrow keys', () => {
    const onChange = vi.fn();
    render(
      <SnapSlider
        count={5}
        labels={['1x', '2x', '3x', '4x', '5x']}
        value={2}
        onChange={onChange}
      />,
    );
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(3);

    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('jumps to ends via Home and End keys', () => {
    const onChange = vi.fn();
    render(
      <SnapSlider
        count={5}
        labels={['1x', '2x', '3x', '4x', '5x']}
        value={2}
        onChange={onChange}
      />,
    );
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'Home' });
    expect(onChange).toHaveBeenCalledWith(0);

    fireEvent.keyDown(slider, { key: 'End' });
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('respects disabled state', () => {
    const onChange = vi.fn();
    render(
      <SnapSlider
        count={5}
        labels={['1x', '2x', '3x', '4x', '5x']}
        value={2}
        disabled
        onChange={onChange}
      />,
    );
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-disabled', 'true');

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('respects readOnly state', () => {
    const onChange = vi.fn();
    render(
      <SnapSlider
        count={5}
        labels={['1x', '2x', '3x', '4x', '5x']}
        value={2}
        readOnly
        onChange={onChange}
      />,
    );
    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('works in uncontrolled mode with defaultValue', () => {
    const onChange = vi.fn();
    render(
      <SnapSlider
        count={5}
        labels={['1x', '2x', '3x', '4x', '5x']}
        defaultValue={1}
        onChange={onChange}
      />,
    );
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '1');

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(2);
    expect(slider).toHaveAttribute('aria-valuenow', '2');
  });
});
