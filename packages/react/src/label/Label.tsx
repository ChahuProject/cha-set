import React from 'react';

export type LabelSize = 'default' | 'sm';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  size?: LabelSize;
  disabled?: boolean;
  required?: boolean;
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

    return (
      <label
        ref={ref}
        data-slot="label"
        data-size={size}
        data-disabled={disabled ? 'true' : undefined}
        data-required={required ? 'true' : undefined}
        className={`inline-flex items-center leading-none font-medium select-none text-foreground group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${sizeStyles[size]} ${disabledClass} ${forcedStateClass} ${className}`.trim()}
        {...props}
      >
        {children}
        {required && (
          <span className="text-destructive ml-0.5 leading-none" aria-hidden="true">
            *
          </span>
        )}
      </label>
    );
  },
);

Label.displayName = 'Label';
