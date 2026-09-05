import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Input } from './Input';

describe('Input component', () => {
  it('renders default input and handles typing', () => {
    const handleChange = vi.fn();
    render(<Input placeholder="Enter username" onChange={handleChange} />);

    const input = screen.getByPlaceholderText('Enter username') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('data-slot', 'input');
    expect(input).toHaveAttribute('data-size', 'default');

    fireEvent.change(input, { target: { value: 'johndoe' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('supports size variants', () => {
    const { rerender } = render(<Input size="sm" data-testid="input" />);
    let input = screen.getByTestId('input');
    expect(input).toHaveAttribute('data-size', 'sm');
    expect(input.className).toContain('h-8');

    rerender(<Input size="default" data-testid="input" />);
    input = screen.getByTestId('input');
    expect(input.className).toContain('h-9');
  });

  it('handles disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
    expect(input.className).toContain('disabled:opacity-50');
  });

  it('forwards ref and merges custom className', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} className="custom-input-class" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input.className).toContain('custom-input-class');
    expect(ref.current).toBe(input);
  });
});
