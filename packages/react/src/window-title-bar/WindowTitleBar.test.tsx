import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WindowTitleBar } from './WindowTitleBar';

describe('WindowTitleBar', () => {
  it('renders title, subtitle, and triggers caption button actions', () => {
    const onMinimize = vi.fn();
    const onMaximize = vi.fn();
    const onClose = vi.fn();

    render(
      <WindowTitleBar
        title="My App"
        subtitle="v1.0.0"
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      />,
    );

    expect(screen.getByText('My App')).toBeInTheDocument();
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Minimize' }));
    expect(onMinimize).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Maximize' }));
    expect(onMaximize).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('triggers maximize toggle on header double click', () => {
    const onMaximize = vi.fn();
    render(<WindowTitleBar title="Window" onMaximize={onMaximize} />);

    const header = screen.getByRole('banner');
    fireEvent.doubleClick(header);

    expect(onMaximize).toHaveBeenCalledTimes(1);
  });
});
