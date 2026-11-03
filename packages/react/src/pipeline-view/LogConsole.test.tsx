import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogConsole } from './LogConsole';

describe('LogConsole (React)', () => {
  const sampleLogs = [
    '[compiler] Initializing Vulkan GLSL compiler...',
    '\u001B[32mStage 1/2: Vertex shader compiled successfully\u001B[0m',
    '\u001B[33mWarning: Unused uniform binding 2\u001B[0m',
    'Pipeline layout validated (0 errors, 1 warning)',
  ];

  it('renders log lines and displays line count badge', () => {
    render(<LogConsole lines={sampleLogs} />);

    expect(screen.getByText('4 lines')).toBeInTheDocument();
    expect(screen.getByText(/Initializing Vulkan GLSL compiler/)).toBeInTheDocument();
  });

  it('renders custom emptyText when lines is empty', () => {
    render(<LogConsole lines={[]} emptyText="No build logs available" />);

    expect(screen.getByText('No build logs available')).toBeInTheDocument();
  });

  it('hides line count and copy button when disabled via props', () => {
    render(<LogConsole lines={sampleLogs} showCopy={false} showLineCount={false} />);

    expect(screen.queryByText('4 lines')).toBeNull();
  });
});
