import React from 'react';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link';

export type BadgeSize = 'default' | 'sm';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
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
    'border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20',
  outline:
    'text-foreground border-border hover:bg-accent hover:text-accent-foreground',
  ghost:
    'border-transparent text-foreground hover:bg-muted hover:text-foreground',
  link:
    'border-transparent text-primary underline-offset-4 hover:underline p-0 h-auto',
};

const sizeStyles: Record<BadgeSize, string> = {
  default: 'h-5 px-2 text-xs rounded-4xl gap-1',
  sm: 'h-4 px-1.5 text-[0.625rem] font-mono rounded-4xl gap-0.5',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
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
      else if (variant === 'destructive') forcedStateClass = '!bg-destructive/20';
      else if (variant === 'ghost') forcedStateClass = '!bg-muted';
      else if (variant === 'link') forcedStateClass = '!underline';
    } else if (forceActive) {
      if (variant === 'default') forcedStateClass = '!bg-[#4a95e6]';
      else if (variant === 'secondary') forcedStateClass = '!bg-[#f5f8fb]';
      else if (variant === 'outline') forcedStateClass = '!bg-[#f4f7fa]';
      else if (variant === 'destructive') forcedStateClass = '!bg-destructive/30';
      else if (variant === 'ghost') forcedStateClass = '!bg-muted/80';
      else if (variant === 'link') forcedStateClass = '!underline';
    }

    return (
      <span
        ref={ref}
        data-slot="badge"
        data-variant={variant}
        data-size={size}
        className={`inline-flex items-center justify-center border font-medium transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 [&>svg]:size-3! [&>svg]:shrink-0 select-none ${variantStyles[variant]} ${sizeStyles[size]} ${forcedStateClass} ${className}`.trim()}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
