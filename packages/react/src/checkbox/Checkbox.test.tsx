import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Checkbox } from './Checkbox';

describe('Checkbox component', () => {
  it('renders default unchecked state correctly', () => {
    render(<Checkbox data-testid="checkbox" />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('role', 'checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox).toHaveAttribute('data-slot', 'checkbox');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    expect(checkbox).toHaveAttribute('data-size', 'default');
    expect(checkbox.querySelector('svg')).toBeNull();
  });

  it('handles click toggling in uncontrolled mode', () => {
    render(<Checkbox data-testid="checkbox" />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');

    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(checkbox).toHaveAttribute('data-state', 'checked');
    expect(checkbox.querySelector('svg')).toBeInTheDocument();

    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    expect(checkbox.querySelector('svg')).toBeNull();
  });

  it('notifies onCheckedChange in controlled mode', () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <Checkbox checked={false} onCheckedChange={handleChange} data-testid="checkbox" />,
    );

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);

    rerender(<Checkbox checked={true} onCheckedChange={handleChange} data-testid="checkbox" />);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(checkbox).toHaveAttribute('data-state', 'checked');

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('supports checked="indeterminate" as a mixed state', () => {
    render(<Checkbox checked="indeterminate" data-testid="checkbox" />);
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
  });

  it('blocks click interactions when disabled', () => {
    const handleChange = vi.fn();
    render(
      <Checkbox
        disabled
        onCheckedChange={handleChange}
        data-testid="checkbox"
      />,
    );

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    expect(checkbox.className).toContain('disabled:cursor-not-allowed');
    expect(checkbox.className).toContain('disabled:opacity-50');

    fireEvent.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('renders indeterminate state and toggles to checked on click', () => {
    const handleChange = vi.fn();
    render(
      <Checkbox
        indeterminate
        onCheckedChange={handleChange}
        data-testid="checkbox"
      />,
    );

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');

    const svg = checkbox.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.querySelector('line')).toBeInTheDocument();

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('renders companion label text and supports toggling via label click', () => {
    const handleChange = vi.fn();
    render(
      <Checkbox
        label="Accept terms"
        onCheckedChange={handleChange}
        data-testid="checkbox"
      />,
    );

    const labelText = screen.getByText('Accept terms');
    expect(labelText).toBeInTheDocument();

    fireEvent.click(labelText);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('supports children as companion label', () => {
    const handleChange = vi.fn();
    render(
      <Checkbox onCheckedChange={handleChange} data-testid="checkbox">
        Remember me
      </Checkbox>,
    );

    const childLabel = screen.getByText('Remember me');
    expect(childLabel).toBeInTheDocument();

    fireEvent.click(childLabel);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('supports size variants (sm and default)', () => {
    const { rerender } = render(<Checkbox size="sm" data-testid="checkbox" />);
    let checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('data-size', 'sm');
    expect(checkbox.className).toContain('size-3.5');
    expect(checkbox.className).toContain('rounded-[3px]');

    rerender(<Checkbox size="default" data-testid="checkbox" />);
    checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toHaveAttribute('data-size', 'default');
    expect(checkbox.className).toContain('size-4');
    expect(checkbox.className).toContain('rounded-[4px]');
  });

  it('forwards ref and merges custom className', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Checkbox
        ref={ref}
        className="custom-checkbox-class"
        data-testid="checkbox"
      />,
    );

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox.className).toContain('custom-checkbox-class');
    expect(ref.current).toBe(checkbox);
  });
});
