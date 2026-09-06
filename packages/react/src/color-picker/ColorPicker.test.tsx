import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColorPicker, DEFAULT_PRESET_COLORS } from './ColorPicker';

describe('ColorPicker component', () => {
  it('renders default value with accessible preview and hex input', () => {
    render(<ColorPicker data-testid="color-picker" />);
    const picker = screen.getByTestId('color-picker');

    expect(picker).toBeInTheDocument();
    expect(picker).toHaveAttribute('data-slot', 'color-picker');
    expect(picker).toHaveAttribute('data-mode', 'inline');

    const hexInput = screen.getByTestId('color-hex-input') as HTMLInputElement;
    expect(hexInput).toBeInTheDocument();
    expect(hexInput.value).toBe('#1D7AE0');
  });

  it('supports defaultValue for uncontrolled usage', () => {
    render(<ColorPicker defaultValue="#22C55E" />);
    const hexInput = screen.getByTestId('color-hex-input') as HTMLInputElement;
    expect(hexInput.value).toBe('#22C55E');
  });

  it('respects controlled value prop and responds to updates', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ColorPicker value="#EF4444" onChange={onChange} />,
    );
    let hexInput = screen.getByTestId('color-hex-input') as HTMLInputElement;
    expect(hexInput.value).toBe('#EF4444');

    rerender(<ColorPicker value="#8B5CF6" onChange={onChange} />);
    hexInput = screen.getByTestId('color-hex-input') as HTMLInputElement;
    expect(hexInput.value).toBe('#8B5CF6');
  });

  it('updates color and invokes onChange when typing valid hex code in input', () => {
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#1D7AE0" onChange={onChange} />);
    const hexInput = screen.getByTestId('color-hex-input');

    fireEvent.change(hexInput, { target: { value: '#FF0000' } });
    expect(onChange).toHaveBeenCalledWith('#FF0000');
  });

  it('invokes onChange when clicking preset color swatch', () => {
    const onChange = vi.fn();
    render(
      <ColorPicker
        defaultValue="#1D7AE0"
        presetColors={['#EF4444', '#22C55E', '#3B82F6']}
        onChange={onChange}
      />,
    );

    const redSwatches = screen.getAllByLabelText('#EF4444');
    expect(redSwatches.length).toBeGreaterThan(0);
    fireEvent.click(redSwatches[0]!);

    expect(onChange).toHaveBeenCalledWith('#EF4444');
  });

  it('supports mode="popover" opening and closing dropdown', () => {
    render(<ColorPicker mode="popover" defaultValue="#3B82F6" />);

    const trigger = screen.getByTestId('color-picker-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('color-hex-input')).not.toBeInTheDocument();

    // Click trigger to open popover
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('color-hex-input')).toBeInTheDocument();

    // Press Escape to dismiss
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('color-hex-input')).not.toBeInTheDocument();
  });

  it('blocks interaction and applies disabled styling when disabled', () => {
    const onChange = vi.fn();
    render(
      <ColorPicker
        disabled
        defaultValue="#1D7AE0"
        presetColors={['#EF4444', '#22C55E']}
        onChange={onChange}
        data-testid="color-picker"
      />,
    );
    const picker = screen.getByTestId('color-picker');
    expect(picker).toHaveAttribute('data-disabled', '');

    const hexInput = screen.getByTestId('color-hex-input') as HTMLInputElement;
    expect(hexInput).toBeDisabled();

    const redSwatches = screen.getAllByLabelText('#EF4444');
    fireEvent.click(redSwatches[0]!);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('switches between square, circle, triangle, and swatches selector panels', () => {
    render(<ColorPicker defaultValue="#1D7AE0" />);

    // Default is square view (inside HueRing)
    expect(screen.getByLabelText('Color saturation and brightness')).toBeInTheDocument();
    expect(screen.getByLabelText('Hue ring')).toBeInTheDocument();

    // Switch to circle (wheel) view
    const circleTab = screen.getByRole('button', { name: 'Circle' });
    fireEvent.click(circleTab);
    expect(screen.getByLabelText('Color Wheel')).toBeInTheDocument();

    // Switch to triangle view (inside HueRing)
    const triangleTab = screen.getByRole('button', { name: 'Triangle' });
    fireEvent.click(triangleTab);
    expect(screen.getByLabelText('Triangle HSV color picker')).toBeInTheDocument();

    // Switch to swatches view
    const swatchesTab = screen.getByRole('button', { name: 'Swatches' });
    fireEvent.click(swatchesTab);
    expect(screen.getByTitle(DEFAULT_PRESET_COLORS[0]!)).toBeInTheDocument();
  });

  it('supports independent multi-channel toggles (RGB, HSV, CMYK, LAB)', () => {
    render(<ColorPicker defaultValue="#1D7AE0" />);

    // RGB is visible by default
    expect(screen.getByLabelText('RGB channels')).toBeInTheDocument();
    expect(screen.queryByLabelText('HSV channels')).not.toBeInTheDocument();

    // Toggle HSV on
    const hsvToggle = screen.getByRole('button', { name: 'HSV' });
    fireEvent.click(hsvToggle);
    expect(screen.getByLabelText('RGB channels')).toBeInTheDocument();
    expect(screen.getByLabelText('HSV channels')).toBeInTheDocument();

    // Toggle CMYK on
    const cmykToggle = screen.getByRole('button', { name: 'CMYK' });
    fireEvent.click(cmykToggle);
    expect(screen.getByLabelText('CMYK channels')).toBeInTheDocument();

    // Toggle LAB on
    const labToggle = screen.getByRole('button', { name: 'LAB' });
    fireEvent.click(labToggle);
    expect(screen.getByLabelText('LAB channels')).toBeInTheDocument();

    // All 4 channel groups visible simultaneously
    expect(screen.getByLabelText('RGB channels')).toBeInTheDocument();
    expect(screen.getByLabelText('HSV channels')).toBeInTheDocument();
    expect(screen.getByLabelText('CMYK channels')).toBeInTheDocument();
    expect(screen.getByLabelText('LAB channels')).toBeInTheDocument();
  });

  it('updates color when editing channel numeric inputs', () => {
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#000000" onChange={onChange} />);

    // Modify R input
    const rInput = screen.getByLabelText('Color channel R value');
    fireEvent.change(rInput, { target: { value: '255' } });

    expect(onChange).toHaveBeenCalledWith('#FF0000');
  });

  it('supports movable prop and dragging on empty card area', () => {
    const { container } = render(<ColorPicker movable defaultValue="#1d7ae0" />);
    const card = container.querySelector('.cursor-grab') as HTMLElement;
    expect(card).toBeInTheDocument();

    // Drag blank area
    fireEvent.pointerDown(card, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(card, { clientX: 150, clientY: 120, pointerId: 1 });
    fireEvent.pointerUp(card, { pointerId: 1 });

    expect(card.style.transform).toBe('translate3d(50px, 20px, 0)');

    // Double click to reset
    fireEvent.doubleClick(card);
    expect(card.style.transform).toBeFalsy();
  });
});
