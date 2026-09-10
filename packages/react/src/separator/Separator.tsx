import React from 'react';
import { cn } from '../lib/utils';

export type SeparatorOrientation = 'horizontal' | 'vertical';
export type SeparatorVariant = 'solid' | 'dashed' | 'dotted';
export type SeparatorLabelPosition = 'left' | 'center' | 'right';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: SeparatorOrientation;
  decorative?: boolean;
  variant?: SeparatorVariant;
  label?: React.ReactNode;
  labelPosition?: SeparatorLabelPosition;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      orientation = 'horizontal',
      decorative = true,
      variant = 'solid',
      label,
      labelPosition = 'center',
      children,
      ...props
    },
    ref,
  ) => {
    const hasLabel = label !== undefined || children !== undefined;
    const isHorizontal = orientation === 'horizontal';
    const labelContent = label ?? children;

    const variantBorderClass =
      variant === 'dashed'
        ? 'border-dashed'
        : variant === 'dotted'
        ? 'border-dotted'
        : 'border-solid';

    if (hasLabel && isHorizontal) {
      const lineClass = cn(
        'border-border shrink transition-colors',
        variant === 'solid'
          ? 'h-[1px] bg-border'
          : cn('border-t bg-transparent', variantBorderClass),
      );

      return (
        <div
          ref={ref}
          data-slot="separator"
          data-orientation={orientation}
          data-variant={variant}
          data-has-label="true"
          role={decorative ? 'none' : 'separator'}
          aria-orientation={decorative ? undefined : orientation}
          className={cn(
            'flex items-center w-full text-xs text-muted-foreground select-none',
            className,
          )}
          {...props}
        >
          <div
            data-slot="separator-line"
            className={cn(
              lineClass,
              labelPosition === 'left' ? 'w-6 shrink-0' : 'grow',
            )}
          />
          <span
            data-slot="separator-label"
            className="px-3 font-medium text-muted-foreground whitespace-nowrap"
          >
            {labelContent}
          </span>
          <div
            data-slot="separator-line"
            className={cn(
              lineClass,
              labelPosition === 'right' ? 'w-6 shrink-0' : 'grow',
            )}
          />
        </div>
      );
    }

    if (variant !== 'solid') {
      return (
        <div
          ref={ref}
          data-slot="separator"
          data-orientation={orientation}
          data-variant={variant}
          role={decorative ? 'none' : 'separator'}
          aria-orientation={decorative ? undefined : orientation}
          className={cn(
            'shrink-0 border-border transition-colors',
            isHorizontal ? 'w-full border-t' : 'h-full border-l',
            variantBorderClass,
            className,
          )}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        data-slot="separator"
        data-orientation={orientation}
        data-variant={variant}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(
          'shrink-0 bg-border transition-colors',
          isHorizontal ? 'h-[1px] w-full' : 'h-full w-[1px]',
          className,
        )}
        {...props}
      />
    );
  },
);

Separator.displayName = 'Separator';
