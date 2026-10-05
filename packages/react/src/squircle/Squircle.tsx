import * as React from 'react';
import { getSquircleSvgPath, type SquircleParams } from './squircle-path';

export interface SquircleProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Corner radius in logical pixels or rem-equivalent units.
   * Defaults to 8.
   */
  radius?: number;
  /**
   * Corner smoothing factor from 0.0 (traditional circular arc) to 1.0 (full squircle).
   * Defaults to 0.6 (the Apple iOS continuous corner standard).
   */
  smoothing?: number;
  /**
   * Top-left corner radius override.
   */
  topLeftRadius?: number;
  /**
   * Top-right corner radius override.
   */
  topRightRadius?: number;
  /**
   * Bottom-left corner radius override.
   */
  bottomLeftRadius?: number;
  /**
   * Bottom-right corner radius override.
   */
  bottomRightRadius?: number;
  /**
   * Border width in pixels. Defaults to 0.
   */
  borderWidth?: number;
  /**
   * Border stroke color.
   */
  borderColor?: string;
  /**
   * Optional tag name or element type to render as. Defaults to 'div'.
   */
  as?: React.ElementType;
}

/**
 * `<Squircle>` renders an element with iOS-style continuous corner curvature.
 *
 * In modern browsers supporting CSS `corner-shape: squircle`, standard CSS rules apply.
 * This component also generates dynamic SVG clip-path geometry as a progressive
 * enhancement or for canvas/SVG contexts.
 */
export const Squircle = React.forwardRef<HTMLDivElement, SquircleProps>(
  (
    {
      radius = 8,
      smoothing = 0.6,
      topLeftRadius,
      topRightRadius,
      bottomLeftRadius,
      bottomRightRadius,
      borderWidth = 0,
      borderColor,
      as: Component = 'div',
      className = '',
      style,
      children,
      ...rest
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [path, setPath] = React.useState<string>('');

    // Combine forwarded ref and local ref
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref]
    );

    const updatePath = React.useCallback(() => {
      if (!containerRef.current) return;
      const { offsetWidth, offsetHeight } = containerRef.current;
      if (offsetWidth > 0 && offsetHeight > 0) {
        const p = getSquircleSvgPath({
          width: offsetWidth,
          height: offsetHeight,
          cornerRadius: radius,
          topLeftRadius,
          topRightRadius,
          bottomLeftRadius,
          bottomRightRadius,
          cornerSmoothing: smoothing,
        });
        setPath(p);
      }
    }, [radius, smoothing, topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius]);

    React.useEffect(() => {
      updatePath();
      if (!containerRef.current || typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(() => updatePath());
      ro.observe(containerRef.current);
      return () => ro.disconnect();
    }, [updatePath]);

    const combinedStyle: React.CSSProperties = {
      borderRadius: `${radius * 0.0625}rem`,
      // Progressive enhancement: corner-shape for modern browsers
      ['--cs-corner-shape' as string]: 'squircle',
      ['--cs-corner-smoothing' as string]: smoothing,
      ...style,
    };

    return (
      <Component
        ref={setRefs}
        className={`relative ${className}`}
        style={combinedStyle}
        data-corner-shape="squircle"
        data-corner-smoothing={smoothing}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

Squircle.displayName = 'Squircle';
