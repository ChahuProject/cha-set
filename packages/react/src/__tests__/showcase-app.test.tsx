import * as React from 'react';
import { describe, it, expect } from 'vitest';
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
    expect(res!.container.querySelector('[data-slot="scale-osd"]')?.textContent).toContain('100%');
    expect(document.documentElement.style.fontSize).toBe('');
  });
});
