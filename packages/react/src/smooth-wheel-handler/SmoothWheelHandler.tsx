import * as React from 'react';
import type { ScrollOrientation } from '@chahu/spec/smooth-wheel-handler';
import { cn } from '../lib/utils';

export interface SmoothWheelOptions {
  scrollOrientation?: ScrollOrientation;
  mapVerticalToHorizontal?: boolean;
  speedMultiplier?: number;
  duration?: number;
  fixedStepSize?: number;
  consumeEvent?: boolean;
}

export function useSmoothWheel<T extends HTMLElement = HTMLDivElement>(
  options: SmoothWheelOptions = {}
) {
  const {
    scrollOrientation = 'vertical',
    mapVerticalToHorizontal = false,
    speedMultiplier = 1.2,
    duration = 200,
    fixedStepSize = 0,
    consumeEvent = true,
  } = options;

  const targetRef = React.useRef<T>(null);
  const animFrameId = React.useRef<number | null>(null);
  const targetPosRef = React.useRef<number>(0);
  const startPosRef = React.useRef<number>(0);
  const startTimeRef = React.useRef<number>(0);

  const isVertical = scrollOrientation === 'vertical' && !mapVerticalToHorizontal;

  const handleWheel = React.useCallback(
    (e: WheelEvent) => {
      const el = targetRef.current;
      if (!el) return;

      if (consumeEvent) {
        e.preventDefault();
      }

      let delta = isVertical ? e.deltaY : (e.deltaX !== 0 ? e.deltaX : e.deltaY);
      if (fixedStepSize > 0) {
        delta = Math.sign(delta) * fixedStepSize;
      } else {
        delta *= speedMultiplier;
      }

      const currentPos = isVertical ? el.scrollTop : el.scrollLeft;
      const maxScroll = isVertical
        ? Math.max(0, el.scrollHeight - el.clientHeight)
        : Math.max(0, el.scrollWidth - el.clientWidth);

      // If animation is already in progress, accumulate on target
      let base = currentPos;
      if (animFrameId.current !== null) {
        base = targetPosRef.current;
      }

      const newTarget = Math.max(0, Math.min(maxScroll, base + delta));
      targetPosRef.current = newTarget;
      startPosRef.current = currentPos;
      startTimeRef.current = performance.now();

      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current);
      }

      const animate = (now: number) => {
        const elapsed = now - startTimeRef.current;
        const progress = Math.min(1, elapsed / duration);
        // OutCubic easing: 1 - pow(1 - x, 3)
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = startPosRef.current + (targetPosRef.current - startPosRef.current) * ease;

        if (isVertical) {
          el.scrollTop = current;
        } else {
          el.scrollLeft = current;
        }

        if (progress < 1) {
          animFrameId.current = requestAnimationFrame(animate);
        } else {
          animFrameId.current = null;
        }
      };

      animFrameId.current = requestAnimationFrame(animate);
    },
    [isVertical, fixedStepSize, speedMultiplier, duration, consumeEvent]
  );

  React.useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    el.addEventListener('wheel', handleWheel, { passive: !consumeEvent });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [handleWheel, consumeEvent]);

  return targetRef;
}

export interface SmoothWheelHandlerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    SmoothWheelOptions {}

export const SmoothWheelHandler = React.forwardRef<HTMLDivElement, SmoothWheelHandlerProps>(
  (
    {
      children,
      scrollOrientation = 'vertical',
      mapVerticalToHorizontal = false,
      speedMultiplier = 1.2,
      duration = 200,
      fixedStepSize = 0,
      consumeEvent = true,
      className,
      ...props
    },
    ref
  ) => {
    const internalRef = useSmoothWheel<HTMLDivElement>({
      scrollOrientation,
      mapVerticalToHorizontal,
      speedMultiplier,
      duration,
      fixedStepSize,
      consumeEvent,
    });

    React.useImperativeHandle(ref, () => internalRef.current!);

    return (
      <div
        ref={internalRef}
        className={cn('overflow-auto', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SmoothWheelHandler.displayName = 'SmoothWheelHandler';
