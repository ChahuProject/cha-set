import * as React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ViewportConstrainedContainer, useViewportConstraint } from './ViewportConstrainedContainer';

describe('ViewportConstrainedContainer', () => {
  let originalInnerHeight: number;
  let originalGetBoundingClientRect: typeof Element.prototype.getBoundingClientRect;

  beforeEach(() => {
    originalInnerHeight = window.innerHeight;
    originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

    // Mock window.innerHeight
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });

    // Mock requestAnimationFrame to run immediately
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(performance.now());
      return 1;
    });

    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

    // Mock getBoundingClientRect: top: 200, height: 100
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 200,
      height: 100,
      top: 200,
      left: 50,
      bottom: 300,
      right: 250,
      x: 50,
      y: 200,
      toJSON: () => {},
    }));
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    vi.restoreAllMocks();
  });

  it('renders children and applies default classes and styles', () => {
    render(
      <ViewportConstrainedContainer aria-label="test-container">
        <div>Content Item</div>
      </ViewportConstrainedContainer>,
    );

    const container = screen.getByLabelText('test-container');
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Content Item')).toBeInTheDocument();
    expect(container).toHaveClass('bg-popover', 'text-popover-foreground', 'border');
  });

  it('calculates remaining viewport height dynamically (innerHeight - rect.top - margin)', () => {
    // window.innerHeight = 800, top = 200, margin = 16 => 800 - 200 - 16 = 584px
    render(
      <ViewportConstrainedContainer aria-label="measured-container">
        <div>Content</div>
      </ViewportConstrainedContainer>,
    );

    const container = screen.getByLabelText('measured-container');
    expect(container.style.maxHeight).toBe('584px');
  });

  it('respects numeric maxHeight override when smaller than remaining viewport', () => {
    // remaining is 584px, override is 300px
    render(
      <ViewportConstrainedContainer maxHeight={300} aria-label="override-container">
        <div>Content</div>
      </ViewportConstrainedContainer>,
    );

    const container = screen.getByLabelText('override-container');
    expect(container.style.maxHeight).toBe('300px');
  });

  it('respects string maxHeight override when parsed', () => {
    render(
      <ViewportConstrainedContainer maxHeight="250px" aria-label="string-override-container">
        <div>Content</div>
      </ViewportConstrainedContainer>,
    );

    const container = screen.getByLabelText('string-override-container');
    expect(container.style.maxHeight).toBe('250px');
  });

  it('supports custom margin from viewport bottom edge', () => {
    // 800 - 200 - 40 = 560px
    render(
      <ViewportConstrainedContainer margin={40} aria-label="margin-container">
        <div>Content</div>
      </ViewportConstrainedContainer>,
    );

    const container = screen.getByLabelText('margin-container');
    expect(container.style.maxHeight).toBe('560px');
  });

  it('applies custom className and overflow mode', () => {
    render(
      <ViewportConstrainedContainer
        className="custom-class-name"
        overflow="scroll"
        aria-label="custom-container"
      >
        <div>Content</div>
      </ViewportConstrainedContainer>,
    );

    const container = screen.getByLabelText('custom-container');
    expect(container).toHaveClass('custom-class-name');
    expect(container.style.overflowY).toBe('scroll');
  });

  it('re-calculates bounded height on window resize and scroll events', () => {
    render(
      <ViewportConstrainedContainer aria-label="reactive-container">
        <div>Content</div>
      </ViewportConstrainedContainer>,
    );

    const container = screen.getByLabelText('reactive-container');
    expect(container.style.maxHeight).toBe('584px');

    // Change window height to 600
    act(() => {
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 600,
      });
      window.dispatchEvent(new Event('resize'));
    });

    // 600 - 200 - 16 = 384px
    expect(container.style.maxHeight).toBe('384px');

    // Simulate scroll changing rect.top to 300
    act(() => {
      Element.prototype.getBoundingClientRect = vi.fn(() => ({
        width: 200,
        height: 100,
        top: 300,
        left: 50,
        bottom: 400,
        right: 250,
        x: 50,
        y: 300,
        toJSON: () => {},
      }));
      window.dispatchEvent(new Event('scroll'));
    });

    // 600 - 300 - 16 = 284px
    expect(container.style.maxHeight).toBe('284px');
  });

  it('works standalone via useViewportConstraint hook', () => {
    function TestHookComponent() {
      const { ref, boundedHeight } = useViewportConstraint(350, 20);
      return (
        <div ref={ref} data-testid="hook-elem">
          Height: {boundedHeight}
        </div>
      );
    }

    render(<TestHookComponent />);
    const elem = screen.getByTestId('hook-elem');
    expect(elem.textContent).toContain('Height: 350');
  });
});
