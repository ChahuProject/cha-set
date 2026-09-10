import React from 'react';
import { cn } from '../lib/utils';

export type LabelSize = 'default' | 'sm';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  size?: LabelSize;
  disabled?: boolean;
  required?: boolean;
  optional?: boolean;
  invalid?: boolean;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
  forceHover?: boolean;
  forceActive?: boolean;
}

const sizeStyles: Record<LabelSize, string> = {
  default: 'text-sm gap-2',
  sm: 'text-xs gap-1.5',
};

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      className = '',
      size = 'default',
      disabled = false,
      required = false,
      optional = false,
      invalid = false,
      description,
      tooltip,
      forceHover = false,
      forceActive = false,
      children,
      ...props
    },
    ref,
  ) => {
    let forcedStateClass = '';
    if (forceHover) {
      forcedStateClass = 'opacity-80';
    } else if (forceActive) {
      forcedStateClass = 'opacity-70';
    }

    const disabledClass = disabled
      ? 'cursor-not-allowed opacity-50 pointer-events-none'
      : '';

    const content = (
      <>
        {children}
        {required && (
          <span className="text-destructive font-semibold ml-0.5 leading-none" aria-hidden="true">
            *
          </span>
        )}
        {optional && !required && (
          <span className="text-xs text-muted-foreground font-normal ml-0.5 leading-none">
            (optional)
          </span>
        )}
        {tooltip && (
          <span
            className="text-muted-foreground hover:text-foreground inline-flex items-center cursor-help ml-0.5"
            title={typeof tooltip === 'string' ? tooltip : undefined}
          >
            {typeof tooltip === 'string' ? (
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            ) : (
              tooltip
            )}
          </span>
        )}
      </>
    );

    return (
      <label
        ref={ref}
        data-slot="label"
        data-size={size}
        data-disabled={disabled ? 'true' : undefined}
        data-required={required ? 'true' : undefined}
        data-invalid={invalid ? 'true' : undefined}
        className={cn(
          'font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          description ? 'flex flex-col items-start gap-1' : 'inline-flex items-center leading-none',
          sizeStyles[size],
          invalid ? 'text-destructive' : 'text-foreground',
          disabledClass,
          forcedStateClass,
          className,
        )}
        {...props}
      >
        {description ? (
          <span className="inline-flex items-center gap-1.5 leading-none">
            {content}
          </span>
        ) : (
          content
        )}
        {description && (
          <span className="text-xs text-muted-foreground font-normal leading-normal">
            {description}
          </span>
        )}
      </label>
    );
  },
);

Label.displayName = 'Label';

