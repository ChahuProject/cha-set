import * as React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ElidedText } from './ElidedText';

describe('ElidedText', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders text content with truncate class and min-w-0', () => {
    render(<ElidedText text="Sample file path for test" />);
    const elem = screen.getByText('Sample file path for test');
    expect(elem).toBeInTheDocument();
    expect(elem).toHaveClass('truncate', 'min-w-0');
  });

  it('supports alwaysShowTooltip to show tooltip even without truncation', () => {
    render(
      <ElidedText
        text="Short text"
        alwaysShowTooltip
        tooltipPlacement="bottom"
      />
    );

    const elem = screen.getByText('Short text');
    fireEvent.mouseEnter(elem);
    // Tooltip trigger is mounted
    expect(elem.closest('[data-slot="tooltip-root"]')).toBeInTheDocument();
  });

  it('supports multi-line line-clamp mode', () => {
    const { container } = render(
      <ElidedText
        text="A long paragraph that wraps across multiple lines before truncating"
        maxLines={3}
      />
    );

    const elem = container.querySelector('[data-elided="true"]');
    expect(elem).toHaveClass('overflow-hidden', 'text-ellipsis');
    expect(elem).toHaveStyle({ WebkitLineClamp: 3 });
  });

  it('supports copyable click-to-copy functionality', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <ElidedText
        text="0x71C6793138A55f32D0804CEb9B"
        copyable
      />
    );

    const elem = screen.getByText('0x71C6793138A55f32D0804CEb9B');
    expect(elem).toHaveAttribute('data-copyable', 'true');
    expect(elem).toHaveClass('cursor-pointer');

    fireEvent.click(elem);
    expect(writeTextMock).toHaveBeenCalledWith('0x71C6793138A55f32D0804CEb9B');
  });
});
