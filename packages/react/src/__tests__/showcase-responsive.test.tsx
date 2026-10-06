import * as React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act, screen } from '@testing-library/react';
import { App } from '../../examples/basic/src/App';
import { computeResponsiveState, ResponsiveProvider, useResponsive } from '../../examples/basic/src/layout/useResponsive';

describe('React Showcase Scale-Aware Responsive Layout Gate', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    window.innerWidth = 1200;
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
  });

  it('computes effectiveWidth and breakpoints based on uiScale', () => {
    // 1200px at 1.0x -> 1200 (Desktop)
    const base = computeResponsiveState(1200, 1.0);
    expect(base.effectiveWidth).toBe(1200);
    expect(base.isMobile).toBe(false);
    expect(base.isTablet).toBe(false);
    expect(base.isDesktop).toBe(true);
    expect(base.isWide).toBe(false);

    // 1440px at 1.0x -> 1440 (Wide)
    const wide = computeResponsiveState(1440, 1.0);
    expect(wide.effectiveWidth).toBe(1440);
    expect(wide.isWide).toBe(true);

    // 1200px at 1.5x -> 800 (Tablet)
    const tablet = computeResponsiveState(1200, 1.5);
    expect(tablet.effectiveWidth).toBe(800);
    expect(tablet.isMobile).toBe(false);
    expect(tablet.isTablet).toBe(true);
    expect(tablet.isDesktop).toBe(false);

    // 1200px at 2.0x -> 600 (Mobile triggered!)
    const mobile = computeResponsiveState(1200, 2.0);
    expect(mobile.effectiveWidth).toBe(600);
    expect(mobile.isMobile).toBe(true);
    expect(mobile.isTablet).toBe(true);
    expect(mobile.isDesktop).toBe(false);
    expect(mobile.isWide).toBe(false);

    // 1920px at 3.0x -> 640 (Mobile triggered on 1080p screen!)
    const zoom3x = computeResponsiveState(1920, 3.0);
    expect(zoom3x.effectiveWidth).toBe(640);
    expect(zoom3x.isMobile).toBe(true);
  });

  it('triggers mobile responsive layout in App when UI is scaled up', async () => {
    window.innerWidth = 1200;
    let res: ReturnType<typeof render>;
    await act(async () => {
      res = render(<App />);
    });

    // 1. Initial 1.0x scale at 1200px:
    // Desktop sidebar exists
    const navs = res!.container.querySelectorAll('aside nav');
    expect(navs.length).toBeGreaterThan(0);

    // Hamburger button should NOT be present initially
    const hamburgerBtnInitial = res!.container.querySelector('button[aria-label="Open navigation sidebar"]');
    expect(hamburgerBtnInitial).toBeNull();

    // Center search input should be present
    expect(res!.container.querySelector('input, button')?.textContent).toBeDefined();

    // 2. Zoom in with keyboard shortcuts to reach mobile breakpoint (< 768 effective width)
    // 1200 / 1.6 = 750 (< 768)
    // CANONICAL_SCALE_STEPS: 1.0 -> 1.1 -> 1.25 -> 1.5 -> 1.75 -> 2.0
    // Trigger Ctrl + = 4 times (1.0 -> 1.1 -> 1.25 -> 1.5 -> 1.75)
    // 1200 / 1.75 = 685.7px (< 768px)
    for (let i = 0; i < 4; i++) {
      await act(async () => {
        fireEvent.keyDown(window, { key: '=', ctrlKey: true });
      });
    }

    // Now uiScale should be 1.75, effectiveWidth = 1200 / 1.75 = 686px (< 768px)
    // The mobile hamburger button MUST now appear!
    const hamburgerBtn = res!.container.querySelector('button[aria-label="Open navigation sidebar"]');
    expect(hamburgerBtn).not.toBeNull();

    // The persistent desktop navigation sidebar MUST collapse (has 'hidden' class)
    const leftSidebar = res!.container.querySelector('aside.w-64');
    expect(leftSidebar?.classList.contains('hidden')).toBe(true);

    // 3. Clicking the hamburger button opens the navigation drawer Sheet
    await act(async () => {
      fireEvent.click(hamburgerBtn!);
    });

    // Mobile navigation drawer sheet should be opened with "ChaSet Docs"
    expect(document.body.textContent).toContain('ChaSet Docs');

    // 4. Zoom back out to 1.0x with Ctrl + 0
    await act(async () => {
      fireEvent.keyDown(window, { key: '0', ctrlKey: true });
    });

    // Desktop sidebar should be restored (hidden class removed)!
    const leftSidebarRestored = res!.container.querySelector('aside.w-64');
    expect(leftSidebarRestored?.classList.contains('hidden')).toBe(false);

    // Hamburger button must disappear
    const hamburgerBtnAfterReset = res!.container.querySelector('button[aria-label="Open navigation sidebar"]');
    expect(hamburgerBtnAfterReset).toBeNull();
  });
});
