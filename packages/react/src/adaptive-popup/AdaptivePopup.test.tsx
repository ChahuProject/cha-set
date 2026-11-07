import * as React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdaptivePopup } from './AdaptivePopup';

describe('AdaptivePopup', () => {
  let originalInnerHeight: number;
  let originalInnerWidth: number;

  beforeEach(() => {
    originalInnerHeight = window.innerHeight;
    originalInnerWidth = window.innerWidth;

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    vi.restoreAllMocks();
  });

  it('does not render when open is false', () => {
    render(
      <AdaptivePopup open={false}>
        <div>Popup Content</div>
      </AdaptivePopup>,
    );
    expect(screen.queryByText('Popup Content')).toBeNull();
  });

  it('renders content, header, and footer when open is true', () => {
    render(
      <AdaptivePopup
        open={true}
        header={<div>Header Title</div>}
        footer={<div>Footer Action</div>}
      >
        <div>Body Content</div>
      </AdaptivePopup>,
    );
    expect(screen.getByText('Header Title')).toBeTruthy();
    expect(screen.getByText('Body Content')).toBeTruthy();
    expect(screen.getByText('Footer Action')).toBeTruthy();
  });

  it('invokes onOpenChange(false) when Escape is pressed', () => {
    const onOpenChange = vi.fn();
    render(
      <AdaptivePopup open={true} onOpenChange={onOpenChange}>
        <div>Dismissable Content</div>
      </AdaptivePopup>,
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('sets data-slot="adaptive-popup" attribute', () => {
    render(
      <AdaptivePopup open={true}>
        <div>Slot Check</div>
      </AdaptivePopup>,
    );
    const popup = document.querySelector('[data-slot="adaptive-popup"]');
    expect(popup).toBeTruthy();
  });

  it('renders inside container element and uses absolute positioning when containerRef is provided', () => {
    function ContainerWrapper() {
      const containerRef = React.useRef<HTMLDivElement>(null);
      return (
        <div ref={containerRef} data-testid="custom-container" style={{ position: 'relative', width: '25rem', height: '18.75rem' }}>
          <AdaptivePopup open={true} containerRef={containerRef}>
            <div>Contained Content</div>
          </AdaptivePopup>
        </div>
      );
    }
    render(<ContainerWrapper />);

    const container = screen.getByTestId('custom-container');
    const popup = container.querySelector('[data-slot="adaptive-popup"]');
    expect(popup).toBeTruthy();
    expect(popup?.classList.contains('absolute')).toBe(true);
    expect(screen.getByText('Contained Content')).toBeTruthy();
  });

  it('closes on click outside when bounded inside container', () => {
    const onOpenChange = vi.fn();
    function ClickOutsideWrapper() {
      const containerRef = React.useRef<HTMLDivElement>(null);
      return (
        <div ref={containerRef} style={{ position: 'relative', width: '25rem', height: '18.75rem' }}>
          <button data-testid="outside-button">Outside</button>
          <AdaptivePopup open={true} onOpenChange={onOpenChange} containerRef={containerRef}>
            <div>Inside Content</div>
          </AdaptivePopup>
        </div>
      );
    }
    render(<ClickOutsideWrapper />);

    const outsideBtn = screen.getByTestId('outside-button');
    fireEvent.pointerDown(outsideBtn);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('embeds ChaSet ScrollArea inside the popup content area', () => {
    render(
      <AdaptivePopup open={true}>
        <div>Scrollable Item 1</div>
        <div>Scrollable Item 2</div>
      </AdaptivePopup>,
    );

    const scrollAreaRoot = document.querySelector('[data-slot="adaptive-popup"] [data-floating]');
    expect(scrollAreaRoot).toBeTruthy();

    const scrollBar = document.querySelector('[data-slot="adaptive-popup"] [data-orientation="vertical"]');
    expect(scrollBar).toBeTruthy();
  });

  it('computes capped height and clamps top within container when bounded', () => {
    const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        if (this.getAttribute?.('data-slot') === 'adaptive-popup') return 200;
        return 600;
      },
    });

    try {
      function ClampedWrapper() {
        const containerRef = React.useRef<HTMLDivElement>(null);
        return (
          <div
            ref={containerRef}
            data-testid="stage-container"
            style={{ position: 'relative', width: '25rem', height: '18.75rem' }}
          >
            <AdaptivePopup
              open={true}
              containerRef={containerRef}
              edgeMargin={12}
              placement="down"
              maxHeight={200}
            >
              <div>Large Scrollable List</div>
            </AdaptivePopup>
          </div>
        );
      }
      render(<ClampedWrapper />);

      const popup = document.querySelector('[data-slot="adaptive-popup"]') as HTMLDivElement;
      expect(popup).toBeTruthy();
      expect(popup.getAttribute('data-height-capped')).toBe('true');
    } finally {
      if (originalOffsetHeight) {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
      }
    }
  });

  it('clamps height to available space below anchor to avoid bottom overflow', () => {
    const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;

    // Simulate container: 360px high; anchor: top 32px, height 36px (bottom 68px)
    HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.getAttribute?.('data-testid') === 'test-container') {
        return { top: 100, left: 100, width: 400, height: 360, bottom: 460, right: 500 } as DOMRect;
      }
      if (this.getAttribute?.('data-testid') === 'test-anchor') {
        return { top: 132, left: 150, width: 120, height: 36, bottom: 168, right: 270 } as DOMRect;
      }
      return { top: 0, left: 0, width: 320, height: 320, bottom: 320, right: 320 } as DOMRect;
    };

    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        if (this.getAttribute?.('data-slot') === 'adaptive-popup') return 340;
        return 400; // Large natural content
      },
    });

    try {
      function BoundedAnchorWrapper() {
        const containerRef = React.useRef<HTMLDivElement>(null);
        const anchorRef = React.useRef<HTMLButtonElement>(null);
        return (
          <div
            ref={containerRef}
            data-testid="test-container"
            style={{ position: 'relative', width: '25rem', height: '22.5rem' }}
          >
            <button ref={anchorRef} data-testid="test-anchor" style={{ position: 'absolute', top: '2rem' }}>
              Anchor
            </button>
            <AdaptivePopup
              open={true}
              anchorRef={anchorRef}
              containerRef={containerRef}
              edgeMargin={12}
              placement="down"
            >
              <div>Large Content Requiring 400px</div>
            </AdaptivePopup>
          </div>
        );
      }
      render(<BoundedAnchorWrapper />);

      const popup = document.querySelector('[data-slot="adaptive-popup"]') as HTMLDivElement;
      expect(popup).toBeTruthy();

      // Top should be anchor bottom (68) + 4 = 72
      // Available below = 360 - 72 - 12 = 276
      // Height should be capped to 276
      // Top (72) + Height (276) = 348 <= 360 - 12 (348)
      const topRem = parseFloat(popup.style.top);
      const heightRem = parseFloat(popup.style.height);
      const topPx = topRem / 0.0625;
      const heightPx = heightRem / 0.0625;

      expect(topPx).toBe(72);
      expect(heightPx).toBe(276);
      expect(topPx + heightPx).toBeLessThanOrEqual(360 - 12);
      expect(popup.getAttribute('data-height-capped')).toBe('true');
    } finally {
      HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
      if (originalOffsetHeight) {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
      }
    }
  });
});
