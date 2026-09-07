import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PresetNumberInput } from './PresetNumberInput';

describe('PresetNumberInput', () => {
  it('renders input with initial value and placeholder', () => {
    render(<PresetNumberInput value="1024" placeholder="Enter size" />);
    const input = screen.getByPlaceholderText('Enter size') as HTMLInputElement;
    expect(input.value).toBe('1024');
  });

  it('triggers onChange when typing numeric text', () => {
    const onChange = vi.fn();
    render(<PresetNumberInput value="100" onChange={onChange} placeholder="Enter size" />);
    const input = screen.getByPlaceholderText('Enter size');
    fireEvent.change(input, { target: { value: '200' } });
    expect(onChange).toHaveBeenCalledWith('200');
  });

  it('opens preset dropdown on focus and click', () => {
    render(<PresetNumberInput value="" placeholder="Size" />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    const input = screen.getByPlaceholderText('Size');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Default presets and clear label exist
    expect(screen.getByText('None')).toBeInTheDocument();
    expect(screen.getByText('1024')).toBeInTheDocument();
    expect(screen.getByText('1K')).toBeInTheDocument();
  });

  it('selects preset item and calls onChange', () => {
    const onChange = vi.fn();
    render(<PresetNumberInput value="" onChange={onChange} placeholder="Size" />);
    const input = screen.getByPlaceholderText('Size');
    fireEvent.focus(input);

    const preset2048 = screen.getByText('2048');
    fireEvent.mouseDown(preset2048);

    expect(onChange).toHaveBeenCalledWith('2048');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('clears value when clear option is clicked', () => {
    const onChange = vi.fn();
    render(
      <PresetNumberInput
        value="512"
        onChange={onChange}
        clearLabel="Reset"
        placeholder="Size"
      />,
    );
    const input = screen.getByPlaceholderText('Size');
    fireEvent.focus(input);

    const clearBtn = screen.getByText('Reset');
    fireEvent.mouseDown(clearBtn);

    expect(onChange).toHaveBeenCalledWith('');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('hides clear option when allowClear is false', () => {
    render(
      <PresetNumberInput
        value="512"
        allowClear={false}
        placeholder="Size"
      />,
    );
    const input = screen.getByPlaceholderText('Size');
    fireEvent.focus(input);

    expect(screen.queryByText('None')).not.toBeInTheDocument();
  });

  it('does not open dropdown or allow input when disabled', () => {
    render(<PresetNumberInput value="1024" disabled placeholder="Size" />);
    const input = screen.getByPlaceholderText('Size') as HTMLInputElement;
    expect(input).toBeDisabled();

    fireEvent.focus(input);
    fireEvent.click(input);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes dropdown on Escape key', () => {
    render(<PresetNumberInput value="" placeholder="Size" />);
    const input = screen.getByPlaceholderText('Size');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes dropdown on outside click', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <PresetNumberInput value="" placeholder="Size" />
      </div>,
    );
    const input = screen.getByPlaceholderText('Size');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    const outside = screen.getByTestId('outside');
    fireEvent.pointerDown(outside);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
