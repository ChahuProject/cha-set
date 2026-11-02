import * as React from 'react';

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
   * Explicit width in logical units (optional, uses CSS layout sizing if omitted).
   */
  width?: number;
  /**
   * Explicit height in logical units (optional, uses CSS layout sizing if omitted).
   */
  height?: number;
  /**
   * Optional tag name or element type to render as. Defaults to 'div'.
   */
  as?: React.ElementType;
}

/**
 * `<Squircle>` renders an element with native CSS continuous corner curvature.
 *
 * Utilizes modern W3C CSS Borders and Box Decorations Module Level 4 `corner-shape: squircle` / `superellipse()`.
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
    const effectiveSmoothing = cornerSmoothing !== undefined ? cornerSmoothing : smoothing;

    // Resolve per-corner radii (converted from logical units: 1 unit = 0.0625rem)
    const tl = roundLeft && roundTop ? (topLeftRadius ?? radius) : 0;
    const tr = roundRight && roundTop ? (topRightRadius ?? radius) : 0;
    const br = roundRight && roundBottom ? (bottomRightRadius ?? radius) : 0;
    const bl = roundLeft && roundBottom ? (bottomLeftRadius ?? radius) : 0;

    // Resolve native CSS corner-shape:
    // - 0.0 -> round (traditional circular arc)
    // - 0.0 < s <= 1.0 -> superellipse(1 + smoothing) strictly monotonic smooth interpolation
    // - 1.0 -> superellipse(2) (full continuous squircle)
    const cornerShapeValue = React.useMemo(() => {
      if (effectiveSmoothing <= 0.001) return 'round';
      if (effectiveSmoothing >= 0.999) return 'superellipse(2)';
      const exponent = (1 + effectiveSmoothing).toFixed(2);
      return `superellipse(${exponent})`;
    }, [effectiveSmoothing]);

    const combinedStyle: React.CSSProperties = {
      // Native W3C CSS corner-shape & tokens
      ['cornerShape' as string]: cornerShapeValue,
      ['--cs-corner-shape' as string]: cornerShapeValue,
      ['--cs-corner-smoothing' as string]: effectiveSmoothing,

      // Border radius in rem scale
      borderTopLeftRadius: `${tl * 0.0625}rem`,
      borderTopRightRadius: `${tr * 0.0625}rem`,
      borderBottomRightRadius: `${br * 0.0625}rem`,
      borderBottomLeftRadius: `${bl * 0.0625}rem`,

      // Background color if specified
      ...(color ? { backgroundColor: color } : {}),

      // Border styling if specified
      ...(borderWidth > 0
        ? {
            borderWidth: `${borderWidth * 0.0625}rem`,
            borderStyle: 'solid',
            ...(borderColor ? { borderColor } : {}),
          }
        : {}),

      // Dimensions if explicitly specified
      ...(width !== undefined ? { width: `${width * 0.0625}rem` } : {}),
      ...(height !== undefined ? { height: `${height * 0.0625}rem` } : {}),

      ...style,
    };

    return (
      <Component
        ref={ref}
        className={className}
        style={combinedStyle}
        data-corner-shape={cornerShapeValue}
        data-corner-smoothing={effectiveSmoothing}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

Squircle.displayName = 'Squircle';
