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

  it('removes outer injected label element and acts as a pure controlled component with aria accessibility', () => {
    const onCheckedChange = vi.fn();
    const { container } = render(
      <Switch label="Airplane Mode" onCheckedChange={onCheckedChange} id="test-airplane" data-testid="switch" />,
    );

    expect(container.querySelector('label')).toBeNull();
    const switchEl = screen.getByRole('switch', { name: 'Airplane Mode' });
    expect(switchEl).toBeInTheDocument();
    expect(switchEl).toHaveAttribute('id', 'test-airplane');
    expect(switchEl).toHaveAttribute('aria-label', 'Airplane Mode');

    fireEvent.click(switchEl);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('supports companion label via string children mapped to aria-label', () => {
    const { container } = render(<Switch>Bluetooth Enabled</Switch>);
    expect(container.querySelector('label')).toBeNull();
    const switchEl = screen.getByRole('switch', { name: 'Bluetooth Enabled' });
    expect(switchEl).toBeInTheDocument();
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

  it('supports loading state with spinner and interaction blocking', () => {
    const onCheckedChange = vi.fn();
    render(<Switch loading onCheckedChange={onCheckedChange} data-testid="switch" />);
    const switchEl = screen.getByTestId('switch');

    expect(switchEl).toHaveAttribute('aria-busy', 'true');
    expect(switchEl).toHaveAttribute('data-loading', 'true');
    expect(switchEl.querySelector('svg.animate-spin')).toBeInTheDocument();

    fireEvent.click(switchEl);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('supports readOnly mode', () => {
    const onCheckedChange = vi.fn();
    render(<Switch readOnly onCheckedChange={onCheckedChange} data-testid="switch" />);
    const switchEl = screen.getByTestId('switch');

    expect(switchEl).toHaveAttribute('aria-readonly', 'true');
    expect(switchEl).not.toBeDisabled();
    expect(switchEl.className).toContain('cursor-default');

    fireEvent.click(switchEl);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('renders wrapper with label and helper description', () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch
        label="Airplane Mode"
        description="Disables all wireless connections"
        onCheckedChange={onCheckedChange}
        data-testid="switch"
      />,
    );

    expect(screen.getByText('Airplane Mode')).toBeInTheDocument();
    expect(screen.getByText('Disables all wireless connections')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Airplane Mode'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
