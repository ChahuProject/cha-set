import * as React from 'react';
import { cn } from '../lib/utils';

export interface ViewportConstrainedContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Optional custom upper limit for max-height, clamped against remaining viewport space */
  maxHeight?: number | string;
  /** Minimum allowable height lower bound, defaults to 80 */
  minHeight?: number | string;
  /** Reserved margin from the viewport bottom edge, defaults to 16 */
  margin?: number;
  /** Vertical overflow behavior, defaults to 'auto' */
  overflow?: 'auto' | 'scroll';
  className?: string;
  'aria-label'?: string;
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 * Hook to dynamically calculate remaining viewport height below a container element.
 */
export function useViewportConstraint(
  maxHeight?: number | string,
  margin = 16,
  minHeight: number | string = 80,
) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [boundedHeight, setBoundedHeight] = React.useState<number | undefined>(undefined);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    let raf = 0;
    let raf2 = 0;

    const calculate = () => {
      const element = containerRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const viewportRemaining = window.innerHeight - rect.top - margin;

      let minH = 80;
      if (typeof minHeight === 'number') {
        minH = minHeight;
      } else if (typeof minHeight === 'string') {
        const parsed = Number.parseInt(minHeight, 10);
        if (Number.isFinite(parsed)) minH = parsed;
      }

      const available = Math.max(minH, viewportRemaining);

      let limitNum: number | undefined;
      if (typeof maxHeight === 'number') {
        limitNum = Math.min(maxHeight, available);
      } else if (typeof maxHeight === 'string') {
        const parsed = Number.parseInt(maxHeight, 10);
        limitNum = Number.isFinite(parsed) ? Math.min(parsed, available) : available;
      } else {
        limitNum = available;
      }

      const globalUpper = window.innerHeight - 16;
      const target = Math.max(minH, Math.min(limitNum, globalUpper, available));
      setBoundedHeight(target);
    };

    raf = requestAnimationFrame(calculate);
    raf2 = requestAnimationFrame(() => requestAnimationFrame(calculate));

    const onUpdate = () => {
      raf = requestAnimationFrame(calculate);
    };

    window.addEventListener('resize', onUpdate);
    window.addEventListener('scroll', onUpdate, true);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(raf2);
      window.removeEventListener('resize', onUpdate);
      window.removeEventListener('scroll', onUpdate, true);
    };
  }, [maxHeight, margin, minHeight]);

  return { ref: containerRef, boundedHeight } as const;
}

/**
 * ViewportConstrainedContainer: Dynamically bounds container max-height
 * based on remaining viewport space below its anchor rect.
 */
export const ViewportConstrainedContainer = React.forwardRef<
  HTMLDivElement,
  ViewportConstrainedContainerProps
>(function ViewportConstrainedContainer(
  {
    children,
    maxHeight,
    minHeight = 80,
    margin = 16,
    overflow = 'auto',
    className,
    style,
    ...props
  },
  forwardedRef,
) {
  const { ref: internalRef, boundedHeight } = useViewportConstraint(maxHeight, margin, minHeight);


  React.useImperativeHandle(forwardedRef, () => internalRef.current as HTMLDivElement);

  return (
    <div
      ref={internalRef}
      data-slot="viewport-constrained-container"
      style={{
        maxHeight: boundedHeight !== undefined ? `${boundedHeight}px` : undefined,
        overflowY: overflow,
        ...style,
      }}
      className={cn(
        'w-max max-w-[20rem] overflow-x-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

ViewportConstrainedContainer.displayName = 'ViewportConstrainedContainer';
