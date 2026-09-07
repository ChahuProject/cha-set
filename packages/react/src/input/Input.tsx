import React from 'react';

export type InputSize = 'default' | 'sm';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  forceHover?: boolean;
  forceFocus?: boolean;
}

const sizeStyles: Record<InputSize, string> = {
  default: 'h-8 px-2.5 py-1 text-sm',
  sm: 'h-7 px-2 py-0.5 text-xs',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      type = 'text',
      size = 'default',
      forceHover = false,
      forceFocus = false,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    let forcedStateClass = '';
    if (forceFocus) {
      forcedStateClass = 'ring-1 ring-ring border-ring outline-hidden';
    }

    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        data-size={size}
        disabled={disabled}
        className={`flex w-full rounded-md border border-input bg-transparent dark:bg-input/20 shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground ${sizeStyles[size]} ${forcedStateClass} ${className}`.trim()}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
