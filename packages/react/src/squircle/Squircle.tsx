import * as React from 'react';
import { getSquircleSvgPath, type SquircleParams } from './squircle-path';

export interface SquircleProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Corner radius in logical units.
   * Defaults to 8.
   */
  radius?: number;
  /**
   * Corner smoothing factor from 0.0 (traditional circular arc) to 1.0 (full squircle).
   * Defaults to 0.6 (the Apple iOS continuous corner standard).
   */
  smoothing?: number;
  /**
   * Alias for smoothing to match spec schema.
   */
  cornerSmoothing?: number;
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
   * Whether the left side corners are rounded.
   */
  roundLeft?: boolean;
  /**
   * Whether the right side corners are rounded.
   */
  roundRight?: boolean;
  /**
   * Whether the top side corners are rounded.
   */
  roundTop?: boolean;
  /**
   * Whether the bottom side corners are rounded.
   */
  roundBottom?: boolean;
  /**
   * Border width in logical units. Defaults to 0.
   */
  borderWidth?: number;
  /**
   * Border stroke color.
   */
  borderColor?: string;
  /**
   * Background surface color.
   */
  color?: string;
  /**
   * Explicit width in logical units (optional, auto-measures via ResizeObserver if omitted).
   */
  width?: number;
  /**
   * Explicit height in logical units (optional, auto-measures via ResizeObserver if omitted).
   */
  height?: number;
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
      cornerSmoothing,
      topLeftRadius,
      topRightRadius,
      bottomLeftRadius,
      bottomRightRadius,
      roundLeft = true,
      roundRight = true,
      roundTop = true,
      roundBottom = true,
      borderWidth = 0,
      borderColor,
      color,
      width,
      height,
      as: Component = 'div',
      className = '',
      style,
      children,
      ...rest
    },
    ref
  ) => {
    const rawId = React.useId();
    const clipId = React.useMemo(() => rawId.replace(/:/g, '_'), [rawId]);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const effectiveSmoothing = cornerSmoothing !== undefined ? cornerSmoothing : smoothing;

    const computePath = React.useCallback(
      (w: number, h: number) => {
        if (w <= 0 || h <= 0) return '';
        return getSquircleSvgPath({
          width: w,
          height: h,
          cornerRadius: radius,
          topLeftRadius,
          topRightRadius,
          bottomLeftRadius,
          bottomRightRadius,
          cornerSmoothing: effectiveSmoothing,
          roundLeft,
          roundRight,
          roundTop,
          roundBottom,
        });
      },
      [
        radius,
        effectiveSmoothing,
        topLeftRadius,
        topRightRadius,
        bottomLeftRadius,
        bottomRightRadius,
        roundLeft,
        roundRight,
        roundTop,
        roundBottom,
      ]
    );

    const [measuredDimensions, setMeasuredDimensions] = React.useState<{ w: number; h: number }>({
      w: width ?? 0,
      h: height ?? 0,
    });

    const currentW = width ?? measuredDimensions.w;
    const currentH = height ?? measuredDimensions.h;

    const path = React.useMemo(() => {
      if (currentW > 0 && currentH > 0) {
        return computePath(currentW, currentH);
      }
      return '';
    }, [currentW, currentH, computePath]);

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

    const updateDimensions = React.useCallback(() => {
      const el = containerRef.current;
      if (!el) return;
      const w = width ?? el.offsetWidth;
      const h = height ?? el.offsetHeight;
      setMeasuredDimensions((prev) => {
        if (prev.w === w && prev.h === h) return prev;
        return { w, h };
      });
    }, [width, height]);

    React.useEffect(() => {
      updateDimensions();
      if (!containerRef.current || typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(() => updateDimensions());
      ro.observe(containerRef.current);
      return () => ro.disconnect();
    }, [updateDimensions]);

    const combinedStyle: React.CSSProperties = {
      borderRadius: `${radius * 0.0625}rem`,
      // Progressive enhancement: corner-shape for modern browsers
      ['--cs-corner-shape' as string]: 'squircle',
      ['--cs-corner-smoothing' as string]: effectiveSmoothing,
      ...(color ? { backgroundColor: color } : {}),
      ...style,
    };

    return (
      <Component
        ref={setRefs}
        className={`relative ${className}`}
        style={{
          ...combinedStyle,
          clipPath: path ? `url(#${clipId})` : undefined,
        }}
        data-corner-shape="squircle"
        data-corner-smoothing={effectiveSmoothing}
        {...rest}
      >
        <svg
          className="absolute pointer-events-none w-0 h-0 overflow-hidden"
          aria-hidden="true"
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <path d={path} />
            </clipPath>
          </defs>
        </svg>
        {borderWidth > 0 && borderColor && (
          <svg
            className="absolute inset-0 pointer-events-none w-full h-full overflow-visible"
            aria-hidden="true"
          >
            <path
              d={path}
              fill="none"
              stroke={borderColor}
              strokeWidth={borderWidth}
            />
          </svg>
        )}
        {children}
      </Component>
    );
  }
);

Squircle.displayName = 'Squircle';
