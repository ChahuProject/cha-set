import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DurationInput } from './DurationInput';

describe('DurationInput', () => {
  it('renders time segments correctly from seconds', () => {
    // 1h 2m 3s = 3600 + 120 + 3 = 3723
    render(<DurationInput value={3723} />);
    const hours = screen.getByLabelText('Hours') as HTMLInputElement;
    const minutes = screen.getByLabelText('Minutes') as HTMLInputElement;
    const seconds = screen.getByLabelText('Seconds') as HTMLInputElement;

    expect(hours.value).toBe('1');
    expect(minutes.value).toBe('2');
    expect(seconds.value).toBe('3');
  });

  it('triggers onChange when typing numbers into segments', () => {
    const onChange = vi.fn();
    render(<DurationInput value={0} onChange={onChange} />);

    const seconds = screen.getByLabelText('Seconds') as HTMLInputElement;
    fireEvent.change(seconds, { target: { value: '45' } });
    expect(onChange).toHaveBeenCalledWith(45);
  });

  it('normalizes and zero-pads values on blur', () => {
    const onChange = vi.fn();
    render(<DurationInput value={0} onChange={onChange} />);

    const minutes = screen.getByLabelText('Minutes') as HTMLInputElement;
    fireEvent.change(minutes, { target: { value: '5' } });
    fireEvent.blur(minutes);
    expect(minutes.value).toBe('05');
  });

  it('increments and decrements using stepper buttons', () => {
    const onChange = vi.fn();
    render(<DurationInput value={60} onChange={onChange} />);

    const incMinutes = screen.getByLabelText('Increment Minutes');
    fireEvent.pointerDown(incMinutes);
    fireEvent.pointerUp(incMinutes);

    // 60s + 60s = 120s
    expect(onChange).toHaveBeenCalledWith(120);

    const decMinutes = screen.getByLabelText('Decrement Minutes');
    fireEvent.pointerDown(decMinutes);
    fireEvent.pointerUp(decMinutes);

    expect(onChange).toHaveBeenCalledWith(60);
  });

  it('supports keyboard navigation with arrow keys', () => {
    const onChange = vi.fn();
    render(<DurationInput value={10} onChange={onChange} />);

    const seconds = screen.getByLabelText('Seconds');
    fireEvent.keyDown(seconds, { key: 'ArrowUp' });
    expect(onChange).toHaveBeenCalledWith(11);

    fireEvent.keyDown(seconds, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('navigates between segments with Left and Right arrow keys', () => {
    render(<DurationInput value={0} />);
    const hours = screen.getByLabelText('Hours');
    const minutes = screen.getByLabelText('Minutes');

    hours.focus();
    expect(document.activeElement).toBe(hours);

    fireEvent.keyDown(hours, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(minutes);

    fireEvent.keyDown(minutes, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(hours);
  });

  it('disables all inputs and steppers when disabled is true', () => {
    render(<DurationInput value={100} disabled />);
    const hours = screen.getByLabelText('Hours') as HTMLInputElement;
    const minutes = screen.getByLabelText('Minutes') as HTMLInputElement;
    const seconds = screen.getByLabelText('Seconds') as HTMLInputElement;

    expect(hours).toBeDisabled();
    expect(minutes).toBeDisabled();
    expect(seconds).toBeDisabled();
  });

  it('handles mouse wheel adjustments when focused', () => {
    const onChange = vi.fn();
    render(<DurationInput value={10} onChange={onChange} />);
    const seconds = screen.getByLabelText('Seconds');

    seconds.focus();
    fireEvent.wheel(seconds, { deltaY: -100 });
    expect(onChange).toHaveBeenCalledWith(11);

    fireEvent.wheel(seconds, { deltaY: 100 });
    expect(onChange).toHaveBeenCalledWith(10);
  });
});
