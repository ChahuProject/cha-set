import * as React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReadOnlyInput } from './ReadOnlyInput';

describe('ReadOnlyInput', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders read-only text input and auto-selects on focus', () => {
    render(<ReadOnlyInput value="npm install @chahu/cha-set" />);
    const input = screen.getByDisplayValue('npm install @chahu/cha-set') as HTMLInputElement;
    expect(input).toHaveAttribute('readonly');

    const selectSpy = vi.spyOn(input, 'select');
    fireEvent.focus(input);
    expect(selectSpy).toHaveBeenCalled();
  });

  it('copies content on copy button click', async () => {
    const onCopy = vi.fn();
    render(<ReadOnlyInput value="token-abc-123" onCopy={onCopy} />);
    const copyBtn = screen.getByRole('button', { name: 'Copy' });

    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('token-abc-123');
      expect(onCopy).toHaveBeenCalledWith('token-abc-123');
    });

    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });
});
