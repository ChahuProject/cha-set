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

  it('embeds ChaSet ScrollArea inside the popup and only shows scrollbar when height-capped', () => {
    const { rerender } = render(
      <AdaptivePopup open={true}>
        <div>Scrollable Item 1</div>
        <div>Scrollable Item 2</div>
      </AdaptivePopup>,
    );

    const scrollAreaRoot = document.querySelector('[data-slot="adaptive-popup"] [data-floating]');
    expect(scrollAreaRoot).toBeTruthy();

    // When space is sufficient / uncapped: zero scrollbar
    let scrollBar = document.querySelector('[data-slot="adaptive-popup"] [data-orientation="vertical"]');
    expect(scrollBar).toBeNull();

    // When height-capped: scrollbar is rendered
    const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        return 500;
      },
    });

    try {
      rerender(
        <AdaptivePopup open={true} maxHeight={200}>
          <div>Scrollable Item 1</div>
          <div>Scrollable Item 2</div>
          <div>Scrollable Item 3</div>
        </AdaptivePopup>,
      );

      scrollBar = document.querySelector('[data-slot="adaptive-popup"] [data-orientation="vertical"]');
      expect(scrollBar).toBeTruthy();
    } finally {
      if (originalOffsetHeight) {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
      }
    }
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

  it('horizontally centers popup directly beneath trigger button and maintains parity across UI scales', () => {
    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
    const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

    // Container: 600px wide, 400px high at (100, 100)
    // Anchor: 120px wide, 36px high, centered in container at x = 100 + (600 - 120) / 2 = 340, y = 132
    // Popup: 320px wide, 200px natural height
    HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.getAttribute?.('data-testid') === 'center-container') {
        return { top: 100, left: 100, width: 600, height: 400, bottom: 500, right: 700 } as DOMRect;
      }
      if (this.getAttribute?.('data-testid') === 'center-anchor') {
        return { top: 132, left: 340, width: 120, height: 36, bottom: 168, right: 460 } as DOMRect;
      }
      if (this.getAttribute?.('data-slot') === 'adaptive-popup') {
        return { top: 172, left: 240, width: 320, height: 200, bottom: 372, right: 560 } as DOMRect;
      }
      return { top: 0, left: 0, width: 320, height: 200, bottom: 200, right: 320 } as DOMRect;
    };

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        if (this.getAttribute?.('data-slot') === 'adaptive-popup') return 320;
        if (this.getAttribute?.('data-testid') === 'center-anchor') return 120;
        return 600;
      },
    });

    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        if (this.getAttribute?.('data-slot') === 'adaptive-popup') return 200;
        return 40;
      },
    });

    try {
      function CenterTestWrapper({ rootSize = 16 }: { rootSize?: number }) {
        const containerRef = React.useRef<HTMLDivElement>(null);
        const anchorRef = React.useRef<HTMLButtonElement>(null);

        React.useEffect(() => {
          document.documentElement.style.fontSize = `${rootSize}px`;
        }, [rootSize]);

        return (
          <div
            ref={containerRef}
            data-testid="center-container"
            style={{ position: 'relative', width: '37.5rem', height: '25rem' }}
          >
            <button
              ref={anchorRef}
              data-testid="center-anchor"
              style={{ position: 'absolute', left: '15rem', top: '2rem' }}
            >
              Trigger Button
            </button>
            <AdaptivePopup
              open={true}
              align="center"
              placement="down"
              anchorRef={anchorRef}
              containerRef={containerRef}
            >
              <div>Popup Content</div>
            </AdaptivePopup>
          </div>
        );
      }

      // 1. Test at standard scale (16px root font size)
      const { unmount } = render(<CenterTestWrapper rootSize={16} />);
      const popup = document.querySelector('[data-slot="adaptive-popup"]') as HTMLDivElement;
      expect(popup).toBeTruthy();

      // Anchor in container: left = 340 - 100 = 240. Width = 120. Center = 300.
      // Popup width = 320. Centered left = 300 - 160 = 140.
      // Expected left in rem = 140 / 16 = 8.75rem.
      // Expected top in rem = (168 - 100 + 4) / 16 = 72 / 16 = 4.5rem.
      const leftRem = parseFloat(popup.style.left);
      const topRem = parseFloat(popup.style.top);
      expect(leftRem * 16).toBe(140);
      expect(topRem * 16).toBe(72);

      // Verify exact center alignment
      const anchorCenter = 240 + 120 / 2;
      const popupCenter = leftRem * 16 + 320 / 2;
      expect(popupCenter).toBe(anchorCenter);

      unmount();

      // 2. Test at 200% UI scale (32px root font size)
      // When root font size is 32px, the position in rem must evaluate such that
      // leftRem * 32 == 140px, ensuring ZERO drift on UI scale
      const { unmount: unmount2 } = render(<CenterTestWrapper rootSize={32} />);
      const popupScaled = document.querySelector('[data-slot="adaptive-popup"]') as HTMLDivElement;
      expect(popupScaled).toBeTruthy();

      const leftRemScaled = parseFloat(popupScaled.style.left);
      const topRemScaled = parseFloat(popupScaled.style.top);
      expect(leftRemScaled * 32).toBe(140);
      expect(topRemScaled * 32).toBe(72);

      unmount2();
    } finally {
      document.documentElement.style.fontSize = '';
      HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
      if (originalOffsetWidth) {
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
      }
      if (originalOffsetHeight) {
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
      }
    }
  });

  it('clamps popup to edgeMargin when anchor is at extreme right border', () => {
    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');

    // Container: 500px wide (left 100 to 600)
    // Anchor pushed to far right: left 540 to 580 (width 40)
    // Popup width: 320px
    HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.getAttribute?.('data-testid') === 'edge-container') {
        return { top: 100, left: 100, width: 500, height: 400, bottom: 500, right: 600 } as DOMRect;
      }
      if (this.getAttribute?.('data-testid') === 'edge-anchor') {
        return { top: 132, left: 540, width: 40, height: 36, bottom: 168, right: 580 } as DOMRect;
      }
      return { top: 0, left: 0, width: 320, height: 200, bottom: 200, right: 320 } as DOMRect;
    };

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        if (this.getAttribute?.('data-slot') === 'adaptive-popup') return 320;
        return 40;
      },
    });

    try {
      function EdgeWrapper() {
        const containerRef = React.useRef<HTMLDivElement>(null);
        const anchorRef = React.useRef<HTMLButtonElement>(null);
        return (
          <div ref={containerRef} data-testid="edge-container" style={{ position: 'relative', width: '31.25rem', height: '25rem' }}>
            <button ref={anchorRef} data-testid="edge-anchor">Right Anchor</button>
            <AdaptivePopup
              open={true}
              align="center"
              edgeMargin={12}
              anchorRef={anchorRef}
              containerRef={containerRef}
            >
              <div>Clamped Content</div>
            </AdaptivePopup>
          </div>
        );
      }
      render(<EdgeWrapper />);

      const popup = document.querySelector('[data-slot="adaptive-popup"]') as HTMLDivElement;
      expect(popup).toBeTruthy();

      // Container width: 500. Popup width: 320. Edge margin: 12.
      // Max left = 500 - 320 - 12 = 168px.
      // Left must be clamped to 168px (10.5rem at 16px).
      const leftRem = parseFloat(popup.style.left);
      expect(leftRem * 16).toBe(168);
      expect(leftRem * 16 + 320).toBe(500 - 12);
    } finally {
      HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
      if (originalOffsetWidth) {
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
      }
    }
  });
});
