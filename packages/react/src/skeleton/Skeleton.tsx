import * as React from 'react';
import { cn } from '../lib/utils';

export type SkeletonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
  animation?: SkeletonAnimation;
  rounded?: SkeletonRadius;
}

const radiusClasses: Record<SkeletonRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export function Skeleton({
  className,
  animate = true,
  animation,
  rounded = 'md',
  children,
  ...props
}: SkeletonProps) {
  const effectiveAnimation: SkeletonAnimation =
    animation ?? (animate ? 'pulse' : 'none');

  return (
    <div
      data-slot="skeleton"
      data-animation={effectiveAnimation}
      data-rounded={rounded}
      className={cn(
        'bg-muted',
        effectiveAnimation === 'pulse' && 'animate-pulse',
        effectiveAnimation === 'wave' && 'relative overflow-hidden',
        radiusClasses[rounded],
        className,
      )}
      {...props}
    >
      {effectiveAnimation === 'wave' && (
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/8 to-transparent animate-shimmer"
          data-slot="skeleton-wave"
        />
      )}
      {children}
    </div>
  );
}
