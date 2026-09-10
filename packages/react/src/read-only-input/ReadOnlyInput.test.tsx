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
  });

  it('masks value when masked is true and reveals on toggle', () => {
    render(<ReadOnlyInput value="secret-token-123" masked />);
    expect(screen.queryByDisplayValue('secret-token-123')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('••••••••••••••••')).toBeInTheDocument();

    const revealBtn = screen.getByRole('button', { name: 'Reveal secret' });
    fireEvent.click(revealBtn);
    expect(screen.getByDisplayValue('secret-token-123')).toBeInTheDocument();
  });

  it('copies original unmasked token even when masked', async () => {
    const onCopy = vi.fn();
    render(<ReadOnlyInput value="secret-api-key" masked onCopy={onCopy} />);
    const copyBtn = screen.getByRole('button', { name: 'Copy' });

    fireEvent.click(copyBtn);
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('secret-api-key');
      expect(onCopy).toHaveBeenCalledWith('secret-api-key');
    });
  });

  it('renders sm size with compact height', () => {
    const { container } = render(<ReadOnlyInput value="token" size="sm" />);
    expect(container.firstChild).toHaveClass('h-7');
  });

  it('hides copy button when showCopy is false', () => {
    render(<ReadOnlyInput value="token" showCopy={false} />);
    expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument();
  });
});
