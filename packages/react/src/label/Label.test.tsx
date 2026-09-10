import React, { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Label } from './Label';

describe('Label Component', () => {
  it('renders with default props as a label with data-slot and text-sm', () => {
    render(<Label>Username</Label>);
    const label = screen.getByText('Username');
    expect(label).toBeInTheDocument();
    expect(label.tagName.toLowerCase()).toBe('label');
    expect(label).toHaveAttribute('data-slot', 'label');
    expect(label).toHaveAttribute('data-size', 'default');
    expect(label.className).toContain('text-sm');
    expect(label.className).toContain('font-medium');
    expect(label.className).toContain('peer-disabled:opacity-50');
  });

  it('renders sm size correctly', () => {
    render(<Label size="sm">Small Label</Label>);
    const label = screen.getByText('Small Label');
    expect(label).toHaveAttribute('data-size', 'sm');
    expect(label.className).toContain('text-xs');
  });

  it('applies disabled state and classes', () => {
    render(<Label disabled>Disabled Label</Label>);
    const label = screen.getByText('Disabled Label');
    expect(label).toHaveAttribute('data-disabled', 'true');
    expect(label.className).toContain('cursor-not-allowed');
    expect(label.className).toContain('opacity-50');
  });

  it('renders required indicator when required is true', () => {
    render(<Label required>Email</Label>);
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('data-required', 'true');
    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk.className).toContain('text-destructive');
  });

  it('applies custom className', () => {
    render(<Label className="custom-test-label">Custom</Label>);
    expect(screen.getByText('Custom')).toHaveClass('custom-test-label');
  });

  it('associates with an input via htmlFor and forwards click', () => {
    const handleClick = vi.fn();
    render(
      <div>
        <Label htmlFor="test-checkbox" onClick={handleClick}>
          Accept Terms
        </Label>
        <input id="test-checkbox" type="checkbox" />
      </div>,
    );

    const label = screen.getByText('Accept Terms');
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

    expect(checkbox.checked).toBe(false);
    fireEvent.click(label);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(checkbox.checked).toBe(true);
  });

  it('supports forwarded ref', () => {
    const ref = createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Ref Label</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    expect(ref.current?.tagName.toLowerCase()).toBe('label');
  });

  it('supports forced hover and active testing hooks', () => {
    const { rerender } = render(<Label forceHover>Hovered</Label>);
    expect(screen.getByText('Hovered').className).toContain('opacity-80');

    rerender(<Label forceActive>Active</Label>);
    expect(screen.getByText('Active').className).toContain('opacity-70');
  });

  it('renders optional indicator when optional is true and not required', () => {
    render(<Label optional>Nickname</Label>);
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('does not render optional indicator when required is true', () => {
    render(<Label optional required>Email</Label>);
    expect(screen.queryByText('(optional)')).not.toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('applies invalid styling and data-invalid attribute', () => {
    render(<Label invalid>Password</Label>);
    const label = screen.getByText('Password').closest('label');
    expect(label).toHaveAttribute('data-invalid', 'true');
    expect(label?.className).toContain('text-destructive');
  });

  it('renders helper description text', () => {
    render(<Label description="Must be at least 8 characters">Password</Label>);
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
  });

  it('renders tooltip help trigger', () => {
    render(<Label tooltip="Enter your official registered company name">Company Name</Label>);
    const tooltipTrigger = screen.getByTitle('Enter your official registered company name');
    expect(tooltipTrigger).toBeInTheDocument();
  });
});
