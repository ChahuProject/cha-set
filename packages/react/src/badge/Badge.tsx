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
  /** Status indicator dot shown before label. @default false */
  dot?: boolean;
  /** Custom color class for the indicator dot (e.g. 'bg-emerald-500'). */
  dotColor?: string;
  /** Whether the badge displays a dismiss/remove button. @default false */
  removable?: boolean;
  /** Callback triggered when the remove button is clicked. */
  onRemove?: () => void;
  /** Enable interactive cursor and hover feedback. @default false */
  interactive?: boolean;
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
      dot = false,
      dotColor,
      removable = false,
      onRemove,
      interactive = false,
      forceHover = false,
      forceActive = false,
      children,
      onClick,
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

    const isClickable = interactive || Boolean(onClick) || variant === 'link';
    const showRemove = removable || Boolean(onRemove);

    return (
      <span
        ref={ref}
        data-slot="badge"
        data-variant={variant}
        data-size={size}
        onClick={onClick}
        className={`inline-flex items-center justify-center border font-medium transition-colors duration-quick ease-standard focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 [&>svg]:size-3! [&>svg]:shrink-0 select-none ${isClickable ? 'cursor-pointer' : ''} ${variantStyles[variant]} ${sizeStyles[size]} ${forcedStateClass} ${className}`.trim()}
        {...props}
      >
        {dot && (
          <span
            className={`size-1.5 rounded-full shrink-0 ${dotColor || (variant === 'default' ? 'bg-primary-foreground' : 'bg-primary')}`}
            aria-hidden="true"
          />
        )}
        {children}
        {showRemove && (
          <button
            type="button"
            aria-label="Remove"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="inline-flex items-center justify-center -mr-1 ml-0.5 size-3.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer transition-colors duration-quick ease-standard"
          >
            <svg
              className="size-2.5"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 2l8 8M10 2L2 10" />
            </svg>
          </button>
        )}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
