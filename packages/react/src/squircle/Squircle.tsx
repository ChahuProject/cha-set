import * as React from 'react';
import { getSquircleSvgPath } from './squircle-path';

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
   * Whether to preserve smoothing curvature profile at large radii instead of collapsing.
   * Defaults to true.
   */
  preserveSmoothing?: boolean;
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
      preserveSmoothing = true,
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
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const effectiveSmoothing = cornerSmoothing !== undefined ? cornerSmoothing : smoothing;

    const computeOuterPath = React.useCallback(
      (w: number, h: number) => {
        if (w <= 0 || h <= 0) return '';
        return getSquircleSvgPath({
          x: 0,
          y: 0,
          width: w,
          height: h,
          cornerRadius: radius,
          topLeftRadius,
          topRightRadius,
          bottomLeftRadius,
          bottomRightRadius,
          cornerSmoothing: effectiveSmoothing,
          preserveSmoothing,
          roundLeft,
          roundRight,
          roundTop,
          roundBottom,
        });
      },
      [
        radius,
        effectiveSmoothing,
        preserveSmoothing,
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

    const computeStrokePath = React.useCallback(
      (w: number, h: number, bw: number) => {
        if (w <= 0 || h <= 0 || bw <= 0) return '';
        const inset = bw / 2;
        const innerW = Math.max(0, w - 2 * inset);
        const innerH = Math.max(0, h - 2 * inset);
        const strRadius = Math.max(0, radius - inset);
        const strTL = topLeftRadius !== undefined ? Math.max(0, topLeftRadius - inset) : undefined;
        const strTR = topRightRadius !== undefined ? Math.max(0, topRightRadius - inset) : undefined;
        const strBL = bottomLeftRadius !== undefined ? Math.max(0, bottomLeftRadius - inset) : undefined;
        const strBR = bottomRightRadius !== undefined ? Math.max(0, bottomRightRadius - inset) : undefined;

        return getSquircleSvgPath({
          x: inset,
          y: inset,
          width: innerW,
          height: innerH,
          cornerRadius: strRadius,
          topLeftRadius: strTL,
          topRightRadius: strTR,
          bottomLeftRadius: strBL,
          bottomRightRadius: strBR,
          cornerSmoothing: effectiveSmoothing,
          preserveSmoothing,
          roundLeft,
          roundRight,
          roundTop,
          roundBottom,
        });
      },
      [
        radius,
        effectiveSmoothing,
        preserveSmoothing,
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

    const outerPath = React.useMemo(() => {
      if (currentW > 0 && currentH > 0) {
        return computeOuterPath(currentW, currentH);
      }
      return '';
    }, [currentW, currentH, computeOuterPath]);

    const strokePath = React.useMemo(() => {
      if (currentW > 0 && currentH > 0 && borderWidth > 0) {
        return computeStrokePath(currentW, currentH, borderWidth);
      }
      return '';
    }, [currentW, currentH, borderWidth, computeStrokePath]);

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
      const rect = el.getBoundingClientRect();
      const w = width ?? (rect.width > 0 ? rect.width : el.offsetWidth);
      const h = height ?? (rect.height > 0 ? rect.height : el.offsetHeight);
      setMeasuredDimensions((prev) => {
        if (Math.abs(prev.w - w) < 0.01 && Math.abs(prev.h - h) < 0.01) return prev;
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

    // Unique clipId per geometry to prevent Chromium from reusing stale cached clip-path masks
    const clipId = React.useMemo(() => {
      const sanitized = rawId.replace(/:/g, '_');
      return `${sanitized}_${Math.round(currentW)}_${Math.round(currentH)}_${Math.round(radius)}_${Math.round(effectiveSmoothing * 100)}_${preserveSmoothing ? 1 : 0}`;
    }, [rawId, currentW, currentH, radius, effectiveSmoothing, preserveSmoothing]);

    const clipPathStyle = React.useMemo(() => {
      if (!outerPath) return undefined;
      // In modern browsers supporting CSS basic shape path(), use path() directly to avoid SVG clipPath caching issues
      // and High-DPI/DPR scaling distortion where clipPathUnits="userSpaceOnUse" miscomputes device coordinates.
      if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('clip-path', 'path("M0 0Z")')) {
        return `path('${outerPath}')`;
      }
      return `url(#${clipId})`;
    }, [outerPath, clipId]);

    const combinedStyle: React.CSSProperties = {
      // Prioritize continuous corner shape token
      ['--cs-corner-shape' as string]: 'squircle',
      ['--cs-corner-smoothing' as string]: effectiveSmoothing,
      // Fallback border-radius only when SVG path has not resolved yet
      borderRadius: outerPath ? undefined : `${radius * 0.0625}rem`,
      ...style,
    };

    const hasSvgDecoration = Boolean(color || (borderWidth > 0 && borderColor));

    return (
      <Component
        ref={setRefs}
        className={`relative ${className}`}
        style={{
          ...combinedStyle,
          clipPath: clipPathStyle,
        }}
        data-corner-shape="squircle"
        data-corner-smoothing={effectiveSmoothing}
        {...rest}
      >
        <svg
          className="absolute pointer-events-none w-0 h-0 overflow-hidden"
          viewBox={`0 0 ${currentW} ${currentH}`}
          aria-hidden="true"
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <path d={outerPath} />
            </clipPath>
          </defs>
        </svg>
        {hasSvgDecoration && outerPath && (
          <svg
            className="absolute inset-0 pointer-events-none w-full h-full overflow-hidden"
            viewBox={`0 0 ${currentW} ${currentH}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {color && (
              <path
                d={outerPath}
                fill={color}
              />
            )}
            {borderWidth > 0 && borderColor && strokePath && (
              <path
                d={strokePath}
                fill="none"
                stroke={borderColor}
                strokeWidth={borderWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}
          </svg>
        )}
        {children}
      </Component>
    );
  }
);

Squircle.displayName = 'Squircle';
