import * as React from 'react';
import { cn } from '../lib/utils';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  attached?: boolean;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup(
    { className, orientation = 'horizontal', attached = true, children, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          'inline-flex',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          attached && [
            orientation === 'horizontal' && [
              '[&>*:not(:first-child)]:rounded-l-none',
              '[&>*:not(:last-child)]:rounded-r-none',
              '[&>*:not(:first-child)]:-ml-0.5',
              '[&>*:hover]:z-10',
              '[&>*:focus-visible]:z-20',
            ],
            orientation === 'vertical' && [
              '[&>*:not(:first-child)]:rounded-t-none',
              '[&>*:not(:last-child)]:rounded-b-none',
              '[&>*:not(:first-child)]:-mt-0.5',
              '[&>*:hover]:z-10',
              '[&>*:focus-visible]:z-20',
            ],
          ],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
