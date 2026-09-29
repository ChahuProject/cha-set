import * as React from 'react';
import { cn } from '../lib/utils';

export interface KbdGroupProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Separator character or text between keycaps (e.g. '+' or '/') */
  separator?: React.ReactNode;
}

/**
 * Groups multiple Kbd components together with consistent spacing and optional separators.
 */
export const KbdGroup = React.forwardRef<HTMLSpanElement, KbdGroupProps>(
  ({ separator = '+', className, children, ...props }, ref) => {
    const validChildren = React.Children.toArray(children).filter(Boolean);

    return (
      <span
        ref={ref}
        data-slot="kbd-group"
        className={cn('inline-flex items-center gap-1 font-mono select-none', className)}
        {...props}
      >
        {validChildren.map((child, index) => (
          <React.Fragment key={index}>
            {index > 0 && separator && (
              <span className="text-muted-foreground text-nano px-0.2 select-none">
                {separator}
              </span>
            )}
            {child}
          </React.Fragment>
        ))}
      </span>
    );
  },
);

KbdGroup.displayName = 'KbdGroup';
