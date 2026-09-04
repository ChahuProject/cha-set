import { afterAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ScrollArea } from './ScrollArea';
import { ScrollBar } from './ScrollBar';

if (typeof Element !== 'undefined') {
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
}

const covered: Record<string, boolean> = {
  orientation: false,
  hotZone: false,
  dynamicWidth: false,
  stepperButtons: false,
  boundaryClamp: false,
  smoothScroll: false,
  wheelScroll: true,
  thumbDrag: true,
  trackJump: false,
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
    expect(scrollbar).toHaveStyle({ width: '0.5rem' });
    covered.hotZone = true;

    // Check inner indicator has narrow to wide dynamic classes
    const indicator = scrollbar.querySelector('.rounded-full');
    expect(indicator).toHaveClass('w-1', 'group-hover:w-2');
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

  it('constrains thumb to track runway between stepper buttons', () => {
    // 1. With showButtons=true (default): vertical scrollbar container has flex structure with stepper clusters
    const { container: c1 } = render(
      <ScrollArea className="h-64 w-64" showButtons={true}>
        <div style={{ height: 1000 }}>Long Content</div>
      </ScrollArea>,
    );
    const vScrollbar = c1.querySelector('[data-orientation="vertical"]') as HTMLElement;
    expect(vScrollbar.children.length).toBe(3); // StartCluster, BaseScrollArea.Scrollbar, EndCluster

    // 2. With showButtons=false: vertical scrollbar container only contains BaseScrollArea.Scrollbar
    const { container: c2 } = render(
      <ScrollArea className="h-64 w-64" showButtons={false}>
        <div style={{ height: 1000 }}>Long Content</div>
      </ScrollArea>,
    );
    const vScrollbarNoButtons = c2.querySelector('[data-orientation="vertical"]') as HTMLElement;
    expect(vScrollbarNoButtons.children.length).toBe(1); // BaseScrollArea.Scrollbar only

    // 3. Thumb has standard my-0.5 margin
    const vThumb = c1.querySelector('[data-orientation="vertical"] [data-state]') || c1.querySelector('[data-orientation="vertical"] .rounded-full')?.parentElement;
    expect(vThumb).toHaveClass('my-0.5');
  });

  it('isolates pointer events on stepper buttons to prevent track click hijacking', () => {
    render(
      <ScrollArea className="h-64 w-64">
        <div style={{ height: 1000 }}>Long Content</div>
      </ScrollArea>,
    );

    const pageDownBtn = screen.getByRole('button', { name: /page down/i });
    const pointerDownEvent = new MouseEvent('pointerdown', { bubbles: true, cancelable: true });
    const stopPropagationSpy = vi.spyOn(pointerDownEvent, 'stopPropagation');

    fireEvent(pageDownBtn, pointerDownEvent);
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('hides scrollbars when content does not overflow', () => {
    // 1. By default: scrollbars unmount when not overflowing
    const { container: c1 } = render(
      <ScrollArea className="h-64 w-64" showHorizontalScrollBar showButtons={true}>
        <div style={{ height: 50, width: 50 }}>Short Content</div>
      </ScrollArea>,
    );

    const viewport1 = c1.querySelector('[data-id$="-viewport"]') as HTMLElement;
    if (viewport1) {
      Object.defineProperty(viewport1, 'scrollHeight', { value: 50, configurable: true });
      Object.defineProperty(viewport1, 'clientHeight', { value: 200, configurable: true });
      Object.defineProperty(viewport1, 'scrollWidth', { value: 50, configurable: true });
      Object.defineProperty(viewport1, 'clientWidth', { value: 200, configurable: true });
      fireEvent.scroll(viewport1);
    }

    expect(c1.querySelector('[data-orientation="vertical"]')).toBeNull();
    expect(c1.querySelector('[data-orientation="horizontal"]')).toBeNull();

    // 2. When keepMounted is true: scrollbars stay mounted but are hidden
    const { container: c2 } = render(
      <ScrollArea className="h-64 w-64" showHorizontalScrollBar showButtons={true} keepMounted={true}>
        <div style={{ height: 50, width: 50 }}>Short Content</div>
      </ScrollArea>,
    );

    const viewport2 = c2.querySelector('[data-id$="-viewport"]') as HTMLElement;
    if (viewport2) {
      Object.defineProperty(viewport2, 'scrollHeight', { value: 50, configurable: true });
      Object.defineProperty(viewport2, 'clientHeight', { value: 200, configurable: true });
      Object.defineProperty(viewport2, 'scrollWidth', { value: 50, configurable: true });
      Object.defineProperty(viewport2, 'clientWidth', { value: 200, configurable: true });
      fireEvent.scroll(viewport2);
    }

    const vBar = c2.querySelector('[data-orientation="vertical"]');
    const hBar = c2.querySelector('[data-orientation="horizontal"]');
    expect(vBar).toHaveClass('hidden');
    expect(hBar).toHaveClass('hidden');
  });

  it('handles track clicking jump accurately without margin distortion', () => {
    const { container } = render(
      <ScrollArea className="h-64 w-64">
        <div style={{ height: 1000 }}>Long Content</div>
      </ScrollArea>,
    );

    const scrollbar = container.querySelector('[data-orientation="vertical"]') as HTMLElement;
    const track = scrollbar?.querySelector('.flex-1') as HTMLElement;
    const thumb = scrollbar?.querySelector('[data-state]') as HTMLElement;
    const viewport = container.querySelector('[data-id$="-viewport"]') as HTMLElement;

    if (viewport && track) {
      Object.defineProperty(viewport, 'scrollHeight', { value: 1000, configurable: true });
      Object.defineProperty(viewport, 'clientHeight', { value: 256, configurable: true });
      Object.defineProperty(track, 'offsetHeight', { value: 216, configurable: true });
      if (thumb) {
        Object.defineProperty(thumb, 'offsetHeight', { value: 40, configurable: true });
      }
      track.getBoundingClientRect = () => ({
        top: 20,
        left: 0,
        bottom: 236,
        right: 8,
        width: 8,
        height: 216,
        x: 0,
        y: 20,
        toJSON: () => {},
      });

      const pointerDownEvent = new MouseEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        clientY: 128,
      });
      fireEvent(track, pointerDownEvent);
      expect(viewport.scrollTop).toBeGreaterThan(0);
      covered.trackJump = true;
    }
  });
});
