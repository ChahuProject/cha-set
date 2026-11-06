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
});
