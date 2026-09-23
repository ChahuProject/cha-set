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

    // Trigger Ctrl + 0 to reset
    await act(async () => {
      fireEvent.keyDown(window, { key: '0', ctrlKey: true });
    });
    expect(res!.container.querySelector('[data-slot="scale-osd"]')?.textContent).toContain('100%');
  });
});
