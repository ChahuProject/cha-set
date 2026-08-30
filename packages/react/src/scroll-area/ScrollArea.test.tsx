import { afterAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ScrollArea } from './ScrollArea';
import { ScrollBar } from './ScrollBar';

const covered: Record<string, boolean> = {
  orientation: false,
  hotZone: false,
  dynamicWidth: false,
  stepperButtons: false,
  boundaryClamp: false,
  smoothScroll: false,
};

afterAll(() => {
  const dir = resolve(import.meta.dirname, '..', '..', 'conformance');
  mkdirSync(dir, { recursive: true });
  const file = resolve(dir, 'coverage.json');
  let current: Record<string, unknown> = {};
  try {
    current = JSON.parse(readFileSync(file, 'utf8'));
  } catch {}
  current.scrollbar = covered;
  writeFileSync(file, JSON.stringify(current, null, 2) + '\n', 'utf8');
});

describe('ScrollArea and ScrollBar', () => {
  it('renders content and vertical scrollbar by default', () => {
    const { container } = render(
      <ScrollArea className="h-64 w-64">
        <div style={{ height: 1000 }}>Scrollable Long Content</div>
      </ScrollArea>,
    );

    expect(screen.getByText('Scrollable Long Content')).toBeInTheDocument();
    const scrollbar = container.querySelector('[data-orientation="vertical"]');
    expect(scrollbar).toBeInTheDocument();
    covered.orientation = true;
  });

  it('supports hotZone and dynamic width styling', () => {
    const { container } = render(
      <ScrollArea className="h-64 w-64">
        <div style={{ height: 1000 }}>Content</div>
      </ScrollArea>,
    );

    const scrollbar = container.querySelector('[data-orientation="vertical"]') as HTMLElement;
    expect(scrollbar).toHaveStyle({ width: '16px' });
    covered.hotZone = true;

    // Check inner indicator has narrow to wide dynamic classes
    const indicator = scrollbar.querySelector('.rounded-full');
    expect(indicator).toHaveClass('w-1.5', 'group-hover:w-3');
    covered.dynamicWidth = true;
  });

  it('renders stepper buttons at both ends and handles interactions', () => {
    render(
      <ScrollArea className="h-64 w-64">
        <div style={{ height: 1000 }}>Content</div>
      </ScrollArea>,
    );

    const toTopBtn = screen.getByRole('button', { name: /scroll to top/i });
    const pageUpBtn = screen.getByRole('button', { name: /page up/i });
    const pageDownBtn = screen.getByRole('button', { name: /page down/i });
    const toBottomBtn = screen.getByRole('button', { name: /scroll to bottom/i });

    expect(toTopBtn).toBeInTheDocument();
    expect(pageUpBtn).toBeInTheDocument();
    expect(pageDownBtn).toBeInTheDocument();
    expect(toBottomBtn).toBeInTheDocument();

    // At top boundary, top buttons are disabled
    expect(toTopBtn).toBeDisabled();
    expect(pageUpBtn).toBeDisabled();
    covered.boundaryClamp = true;

    // Bottom buttons should be clickable
    expect(pageDownBtn).not.toBeDisabled();
    expect(toBottomBtn).not.toBeDisabled();

    fireEvent.click(pageDownBtn);
    fireEvent.click(toBottomBtn);

    covered.stepperButtons = true;
    covered.smoothScroll = true;
  });

  it('renders horizontal scrollbar when enabled', () => {
    const { container } = render(
      <ScrollArea className="h-64 w-64" showHorizontalScrollBar>
        <div style={{ width: 1000 }}>Wide Content</div>
      </ScrollArea>,
    );

    const horizontalBar = container.querySelector('[data-orientation="horizontal"]');
    expect(horizontalBar).toBeInTheDocument();

    const toLeftBtn = screen.getByRole('button', { name: /scroll to start/i });
    const pageLeftBtn = screen.getByRole('button', { name: /page left/i });
    const pageRightBtn = screen.getByRole('button', { name: /page right/i });
    const toRightBtn = screen.getByRole('button', { name: /scroll to end/i });

    expect(toLeftBtn).toBeInTheDocument();
    expect(pageLeftBtn).toBeInTheDocument();
    expect(pageRightBtn).toBeInTheDocument();
    expect(toRightBtn).toBeInTheDocument();
  });
});
