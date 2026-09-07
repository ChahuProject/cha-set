import * as React from 'react';
import { cn } from '../lib/utils';

export type SkeletonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
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
  rounded = 'md',
  ...props
}: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'bg-muted',
        animate && 'animate-pulse',
        radiusClasses[rounded],
        className,
      )}
      {...props}
    />
  );
}
