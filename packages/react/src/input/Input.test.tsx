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
    expect(input.className).toContain('h-7');

    rerender(<Input size="default" data-testid="input" />);
    input = screen.getByTestId('input');
    expect(input.className).toContain('h-8');
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

  it('supports invalid error state', () => {
    render(<Input invalid data-testid="invalid-input" />);
    const input = screen.getByTestId('invalid-input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.className).toContain('border-destructive');
  });

  it('supports clearable functionality and onClear callback', () => {
    const handleClear = vi.fn();
    const handleChange = vi.fn();
    render(
      <Input
        clearable
        defaultValue="hello world"
        onClear={handleClear}
        onChange={handleChange}
        data-testid="clearable-input"
      />,
    );

    const input = screen.getByTestId('clearable-input') as HTMLInputElement;
    expect(input.value).toBe('hello world');

    const clearBtn = screen.getByRole('button', { name: 'Clear input' });
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(input.value).toBe('');
  });

  it('supports clearing on Escape key when clearable', () => {
    const handleClear = vi.fn();
    render(
      <Input
        clearable
        defaultValue="test text"
        onClear={handleClear}
        data-testid="esc-input"
      />,
    );

    const input = screen.getByTestId('esc-input') as HTMLInputElement;
    expect(input.value).toBe('test text');

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(input.value).toBe('');
  });

  it('supports password visibility toggle', () => {
    render(
      <Input
        type="password"
        passwordToggle
        defaultValue="secret123"
        data-testid="pwd-input"
      />,
    );

    const input = screen.getByTestId('pwd-input');
    expect(input).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByRole('button', { name: 'Show password' });
    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute('type', 'text');

    const hideBtn = screen.getByRole('button', { name: 'Hide password' });
    fireEvent.click(hideBtn);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('renders left and right icon slots', () => {
    render(
      <Input
        leftIcon={<span data-testid="left-icon">🔍</span>}
        rightIcon={<span data-testid="right-icon">✓</span>}
        data-testid="icon-input"
      />,
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });
});

