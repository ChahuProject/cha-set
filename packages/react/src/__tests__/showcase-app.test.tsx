import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { App } from '../../examples/basic/src/App';

describe('React Showcase App Integration & Smoke Gate', () => {
  it('renders App without unhandled exceptions and triggers ScaleOsd on shortcuts', async () => {
    let res: ReturnType<typeof render>;
    await act(async () => {
      res = render(<App />);
    });

    expect(res!.container).toBeTruthy();

    // Initially ScaleOsd is hidden (returns null)
    expect(res!.container.querySelector('[data-slot="scale-osd"]')).toBeNull();

    // Trigger Ctrl + = to zoom in
    await act(async () => {
      fireEvent.keyDown(window, { key: '=', ctrlKey: true });
    });

    // ScaleOsd should now appear in the DOM
    const scaleOsd = res!.container.querySelector('[data-slot="scale-osd"]');
    expect(scaleOsd).toBeTruthy();
    // First step above 1.0 in CANONICAL_SCALE_STEPS is 1.1 -> 110%
    expect(scaleOsd?.textContent).toContain('110%');
    expect(document.documentElement.style.fontSize).toBe('17.6px');

    // Trigger Ctrl + - to zoom out back to 100% (110% -> 100%)
    await act(async () => {
      fireEvent.keyDown(window, { key: '-', ctrlKey: true });
    });
    expect(res!.container.querySelector('[data-slot="scale-osd"]')?.textContent).toContain('100%');
    expect(document.documentElement.style.fontSize).toBe('');

    // Trigger Ctrl + - again to zoom out to 90% (100% -> 90%)
    await act(async () => {
      fireEvent.keyDown(window, { key: '-', ctrlKey: true });
    });
    expect(res!.container.querySelector('[data-slot="scale-osd"]')?.textContent).toContain('90%');
    expect(document.documentElement.style.fontSize).toBe('14.4px');

    // Trigger Ctrl + = to zoom in back to 100% (90% -> 100%)
    await act(async () => {
      fireEvent.keyDown(window, { key: '=', ctrlKey: true });
    });
    expect(res!.container.querySelector('[data-slot="scale-osd"]')?.textContent).toContain('100%');
    expect(document.documentElement.style.fontSize).toBe('');

    // Trigger Ctrl + 0 to reset from a non-1.0 scale
    await act(async () => {
      fireEvent.keyDown(window, { key: '=', ctrlKey: true });
    });
    expect(document.documentElement.style.fontSize).toBe('17.6px');
    await act(async () => {
      fireEvent.keyDown(window, { key: '0', ctrlKey: true });
    });
    expect(document.documentElement.style.fontSize).toBe('');
  });

  it('preserves current page and smoothly navigates section on TOC anchor click without falling back to Button', async () => {
    // Set route to slider page
    window.location.hash = '#/components/slider';

    let res: ReturnType<typeof render>;
    await act(async () => {
      res = render(<App />);
    });

    // Check we are indeed on the Slider page (title is Slider)
    const headerTitle = res!.container.querySelector('h1');
    expect(headerTitle?.textContent).toBe('Slider');

    // Find the TableOfContents navigation links
    const tocLinks = res!.container.querySelectorAll('aside nav a');
    expect(tocLinks.length).toBeGreaterThan(0);

    // Mock scrollIntoView
    const mockScrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

    // Click on a TOC link (e.g. Keyboard Navigation or Props Reference)
    const keyboardLink = Array.from(tocLinks).find(
      (link) => link.textContent?.includes('Keyboard') || link.getAttribute('href') === '#keyboard'
    );
    expect(keyboardLink).toBeTruthy();

    await act(async () => {
      fireEvent.click(keyboardLink!);
    });

    // CRITICAL BUG VERIFICATION: The page MUST REMAIN on Slider, NOT jump to Button!
    const titleAfterClick = res!.container.querySelector('h1');
    expect(titleAfterClick?.textContent).toBe('Slider');

    // scrollIntoView should have been triggered
    expect(mockScrollIntoView).toHaveBeenCalled();

    // Bare hash change simulation (#overview or #props) must also not jump to Button
    await act(async () => {
      window.location.hash = '#overview';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    const titleAfterBareHash = res!.container.querySelector('h1');
    expect(titleAfterBareHash?.textContent).toBe('Slider');
  });
});
