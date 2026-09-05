import React from 'react';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';
export type BadgeSize = 'default' | 'sm';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  forceHover?: boolean;
  forceActive?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
  secondary:
    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive:
    'border-transparent bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
  outline:
    'text-foreground border-border hover:bg-accent hover:text-accent-foreground',
};

const sizeStyles: Record<BadgeSize, string> = {
  default: 'px-2.5 py-0.5 text-xs rounded-full',
  sm: 'px-1.5 py-0.2 text-[0.625rem] font-mono rounded',
};

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className = '',
      variant = 'default',
      size = 'default',
      forceHover = false,
      forceActive = false,
      children,
      ...props
    },
    ref,
  ) => {
    let forcedStateClass = '';
    if (forceHover) {
      if (variant === 'default') forcedStateClass = '!bg-[#3387e3]';
      else if (variant === 'secondary') forcedStateClass = '!bg-[#f4f7fa]';
      else if (variant === 'outline') forcedStateClass = '!bg-[#f1f5f9] !text-[#0f172a]';
      else if (variant === 'destructive') forcedStateClass = '!bg-[#dc2626]';
    } else if (forceActive) {
      if (variant === 'default') forcedStateClass = '!bg-[#4a95e6]';
      else if (variant === 'secondary') forcedStateClass = '!bg-[#f5f8fb]';
      else if (variant === 'outline') forcedStateClass = '!bg-[#f4f7fa]';
      else if (variant === 'destructive') forcedStateClass = '!bg-[#b91c1c]';
    }

    return (
      <div
        ref={ref}
        data-slot="badge"
        data-variant={variant}
        data-size={size}
        className={`inline-flex items-center justify-center border font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantStyles[variant]} ${sizeStyles[size]} ${forcedStateClass} ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Badge.displayName = 'Badge';
