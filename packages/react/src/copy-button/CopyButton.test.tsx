import * as React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CopyButton } from './CopyButton';

describe('CopyButton', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders default idle state with copy title', () => {
    render(<CopyButton text="hello world" />);
    const btn = screen.getByRole('button', { name: 'Copy' });
    expect(btn).toBeInTheDocument();
  });

  it('copies text and switches to copied feedback state', async () => {
    const onCopy = vi.fn();
    render(<CopyButton text="copy me" onCopy={onCopy} timeout={500} />);
    const btn = screen.getByRole('button', { name: 'Copy' });

    fireEvent.click(btn);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('copy me');
      expect(onCopy).toHaveBeenCalledWith('copy me');
    });

    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('supports function resolving text dynamically', async () => {
    const textFn = vi.fn().mockResolvedValue('dynamic string');
    render(<CopyButton text={textFn} />);
    const btn = screen.getByRole('button', { name: 'Copy' });

    fireEvent.click(btn);

    await waitFor(() => {
      expect(textFn).toHaveBeenCalled();
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('dynamic string');
    });
  });

  it('renders companion label and transitions copiedLabel correctly', async () => {
    render(<CopyButton text="npm install" label="Copy Command" copiedLabel="Copied Command!" timeout={500} />);
    const btn = screen.getByRole('button', { name: 'Copy Command' });
    expect(btn).toHaveTextContent('Copy Command');

    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied Command!' })).toHaveTextContent('Copied Command!');
    });
  });

  it('uses text-primary-foreground on variant="default" and text-muted-foreground on ghost', async () => {
    const { container: defaultContainer } = render(
      <CopyButton text="token-123" variant="default" label="Copy Token" />,
    );
    const defaultSvg = defaultContainer.querySelector('svg');
    expect(defaultSvg).toHaveClass('text-primary-foreground');
    expect(defaultSvg).not.toHaveClass('text-muted-foreground');

    const defaultBtn = screen.getByRole('button', { name: 'Copy Token' });
    fireEvent.click(defaultBtn);
    await waitFor(() => {
      const checkSvg = defaultContainer.querySelector('svg');
      expect(checkSvg).toHaveClass('text-primary-foreground');
      expect(checkSvg).not.toHaveClass('text-emerald-500');
    });

    const { container: ghostContainer } = render(
      <CopyButton text="ghost-token" variant="ghost" label="Ghost Copy" />,
    );
    const ghostSvg = ghostContainer.querySelector('svg');
    expect(ghostSvg).toHaveClass('text-muted-foreground');
  });
});
