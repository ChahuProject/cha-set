import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from './Switch';

describe('Switch component', () => {
  it('renders default unchecked state with accessible attributes', () => {
    render(<Switch data-testid="switch" />);
    const switchEl = screen.getByTestId('switch');

    expect(switchEl).toBeInTheDocument();
    expect(switchEl).toHaveAttribute('role', 'switch');
    expect(switchEl).toHaveAttribute('aria-checked', 'false');
    expect(switchEl).toHaveAttribute('data-slot', 'switch');
    expect(switchEl).toHaveAttribute('data-state', 'unchecked');
    expect(switchEl).toHaveAttribute('data-size', 'default');
  });

  it('toggles unchecked to checked on click (uncontrolled)', () => {
    const onCheckedChange = vi.fn();
    render(<Switch onCheckedChange={onCheckedChange} data-testid="switch" />);
    const switchEl = screen.getByTestId('switch');

    expect(switchEl).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(switchEl);
    expect(switchEl).toHaveAttribute('aria-checked', 'true');
    expect(switchEl).toHaveAttribute('data-state', 'checked');
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    fireEvent.click(switchEl);
    expect(switchEl).toHaveAttribute('aria-checked', 'false');
    expect(switchEl).toHaveAttribute('data-state', 'unchecked');
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('respects controlled checked prop', () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Switch checked={false} onCheckedChange={onCheckedChange} data-testid="switch" />,
    );
    const switchEl = screen.getByTestId('switch');
    expect(switchEl).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(switchEl);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    // Controlled without parent update stays false
    expect(switchEl).toHaveAttribute('aria-checked', 'false');

    rerender(<Switch checked={true} onCheckedChange={onCheckedChange} data-testid="switch" />);
    expect(switchEl).toHaveAttribute('aria-checked', 'true');
    expect(switchEl).toHaveAttribute('data-state', 'checked');
  });

  it('blocks click interaction when disabled', () => {
    const onCheckedChange = vi.fn();
    render(<Switch disabled onCheckedChange={onCheckedChange} data-testid="switch" />);
    const switchEl = screen.getByTestId('switch');

    expect(switchEl).toBeDisabled();
    expect(switchEl.className).toContain('disabled:opacity-50');

    fireEvent.click(switchEl);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(switchEl).toHaveAttribute('aria-checked', 'false');
  });

  it('supports size variants', () => {
    const { rerender } = render(<Switch size="default" data-testid="switch" />);
    let switchEl = screen.getByTestId('switch');
    expect(switchEl).toHaveAttribute('data-size', 'default');
    expect(switchEl.className).toContain('h-5 w-9');

    rerender(<Switch size="sm" data-testid="switch" />);
    switchEl = screen.getByTestId('switch');
    expect(switchEl).toHaveAttribute('data-size', 'sm');
    expect(switchEl.className).toContain('h-4 w-7');
  });

  it('renders companion label and links accessibility', () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Airplane Mode" onCheckedChange={onCheckedChange} id="test-airplane" />);

    const labelText = screen.getByText('Airplane Mode');
    expect(labelText).toBeInTheDocument();

    const switchEl = screen.getByLabelText('Airplane Mode');
    expect(switchEl).toBeInTheDocument();
    expect(switchEl).toHaveAttribute('id', 'test-airplane');

    fireEvent.click(labelText);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('supports companion label via children', () => {
    render(<Switch>Bluetooth Enabled</Switch>);
    expect(screen.getByText('Bluetooth Enabled')).toBeInTheDocument();
  });

  it('forwards ref and merges custom className', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Switch ref={ref} className="custom-switch" data-testid="switch" />);
    const switchEl = screen.getByTestId('switch');

    expect(switchEl.className).toContain('custom-switch');
    expect(ref.current).toBe(switchEl);
  });

  it('supports forced focus and hover testing hooks', () => {
    const { rerender } = render(<Switch forceFocus data-testid="switch" />);
    let switchEl = screen.getByTestId('switch');
    expect(switchEl.className).toContain('ring-1 ring-ring');

    rerender(<Switch forceHover checked data-testid="switch" />);
    switchEl = screen.getByTestId('switch');
    expect(switchEl.className).toContain('bg-primary/90');
  });
});
