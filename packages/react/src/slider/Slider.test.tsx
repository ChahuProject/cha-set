import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Slider } from './Slider';

describe('Slider component', () => {
  it('renders default value with accessible attributes', () => {
    render(<Slider data-testid="slider" />);
    const sliderEl = screen.getByTestId('slider');
    const thumb = screen.getByRole('slider');

    expect(sliderEl).toBeInTheDocument();
    expect(sliderEl).toHaveAttribute('data-slot', 'slider');
    expect(sliderEl).toHaveAttribute('data-orientation', 'horizontal');

    expect(thumb).toBeInTheDocument();
    expect(thumb).toHaveAttribute('role', 'slider');
    expect(thumb).toHaveAttribute('aria-valuemin', '0');
    expect(thumb).toHaveAttribute('aria-valuemax', '100');
    expect(thumb).toHaveAttribute('aria-valuenow', '0');
    expect(thumb).toHaveAttribute('aria-orientation', 'horizontal');
    expect(thumb).toHaveAttribute('tabindex', '0');
  });

  it('supports defaultValue for uncontrolled slider', () => {
    render(<Slider defaultValue={35} data-testid="slider" />);
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-valuenow', '35');
  });

  it('respects controlled value prop and responds to updates', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Slider value={40} onValueChange={onValueChange} data-testid="slider" />,
    );
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-valuenow', '40');

    rerender(<Slider value={70} onValueChange={onValueChange} data-testid="slider" />);
    expect(thumb).toHaveAttribute('aria-valuenow', '70');
  });

  it('clamps value within min and max bounds', () => {
    const { rerender } = render(
      <Slider min={20} max={80} value={5} data-testid="slider" />,
    );
    let thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-valuenow', '20');

    rerender(<Slider min={20} max={80} value={95} data-testid="slider" />);
    thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-valuenow', '80');
  });

  it('respects step increments', () => {
    render(<Slider min={0} max={100} step={10} defaultValue={24} data-testid="slider" />);
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-valuenow', '20');
  });

  it('handles keyboard navigation (ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Home, End)', () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(
      <Slider
        min={0}
        max={100}
        step={5}
        defaultValue={20}
        onValueChange={onValueChange}
        onChange={onChange}
      />,
    );
    const thumb = screen.getByRole('slider');

    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenCalledWith(25);
    expect(onChange).toHaveBeenCalledWith(25);

    fireEvent.keyDown(thumb, { key: 'ArrowLeft' });
    expect(onValueChange).toHaveBeenCalledWith(20);
    expect(onChange).toHaveBeenCalledWith(20);

    fireEvent.keyDown(thumb, { key: 'ArrowUp' });
    expect(onValueChange).toHaveBeenCalledWith(25);

    fireEvent.keyDown(thumb, { key: 'ArrowDown' });
    expect(onValueChange).toHaveBeenCalledWith(20);

    fireEvent.keyDown(thumb, { key: 'End' });
    expect(onValueChange).toHaveBeenCalledWith(100);

    fireEvent.keyDown(thumb, { key: 'Home' });
    expect(onValueChange).toHaveBeenCalledWith(0);
  });

  it('blocks keyboard and mouse interaction when disabled', () => {
    const onValueChange = vi.fn();
    render(<Slider disabled defaultValue={20} onValueChange={onValueChange} data-testid="slider" />);
    const sliderEl = screen.getByTestId('slider');
    const thumb = screen.getByRole('slider');

    expect(sliderEl).toHaveAttribute('data-disabled', '');
    expect(sliderEl.className).toContain('opacity-50 cursor-not-allowed');
    expect(thumb).toHaveAttribute('tabindex', '-1');
    expect(thumb).toHaveAttribute('aria-disabled', 'true');

    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    expect(onValueChange).not.toHaveBeenCalled();

    fireEvent.click(sliderEl, { clientX: 80, clientY: 0 });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('supports vertical orientation', () => {
    render(<Slider orientation="vertical" data-testid="slider" />);
    const sliderEl = screen.getByTestId('slider');
    const thumb = screen.getByRole('slider');

    expect(sliderEl).toHaveAttribute('data-orientation', 'vertical');
    expect(sliderEl.className).toContain('flex-col');
    expect(thumb).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('supports forced focus and hover testing hooks', () => {
    const { rerender } = render(<Slider forceFocus data-testid="slider" />);
    let thumb = screen.getByRole('slider');
    expect(thumb.className).toContain('ring-1 ring-ring');

    rerender(<Slider forceHover data-testid="slider" />);
    thumb = screen.getByRole('slider');
    expect(thumb.className).toContain('scale-105');
  });

  it('forwards ref and merges custom className', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Slider ref={ref} className="custom-slider" data-testid="slider" />);
    const sliderEl = screen.getByTestId('slider');

    expect(sliderEl.className).toContain('custom-slider');
    expect(ref.current).toBe(sliderEl);
  });

  it('renders hidden input when name is specified', () => {
    const { container } = render(<Slider name="volume" defaultValue={65} />);
    const hiddenInput = container.querySelector('input[type="hidden"]');
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveAttribute('name', 'volume');
    expect(hiddenInput).toHaveAttribute('value', '65');
  });

  it('supports size variants (default and sm)', () => {
    const { rerender } = render(<Slider size="default" data-testid="slider" />);
    let sliderEl = screen.getByTestId('slider');
    let thumb = screen.getByRole('slider');
    expect(sliderEl).toHaveAttribute('data-size', 'default');
    expect(thumb.className).toContain('size-4');

    rerender(<Slider size="sm" data-testid="slider" />);
    sliderEl = screen.getByTestId('slider');
    thumb = screen.getByRole('slider');
    expect(sliderEl).toHaveAttribute('data-size', 'sm');
    expect(thumb.className).toContain('size-3');
  });

  it('supports readOnly mode and prevents value change while keeping full opacity', () => {
    const onValueChange = vi.fn();
    render(<Slider readOnly defaultValue={40} onValueChange={onValueChange} data-testid="slider" />);
    const sliderEl = screen.getByTestId('slider');
    const thumb = screen.getByRole('slider');

    expect(sliderEl).toHaveAttribute('data-readonly', '');
    expect(sliderEl.className).toContain('cursor-default');
    expect(sliderEl.className).not.toContain('opacity-50');
    expect(thumb).toHaveAttribute('aria-readonly', 'true');

    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    expect(onValueChange).not.toHaveBeenCalled();

    fireEvent.click(sliderEl, { clientX: 90, clientY: 0 });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('supports showTooltip floating value indicator', () => {
    render(
      <Slider
        showTooltip
        forceHover
        value={75}
        formatValue={(val) => `${val}%`}
        data-testid="slider"
      />,
    );
    const tooltip = screen.getByText('75%');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveAttribute('data-slot', 'slider-tooltip');
  });
});
