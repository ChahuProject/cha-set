import { forwardRef } from 'react';
import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

/**
 * shadcn-standard variant table. Utilities resolve against the shadcn-standard
 * core tokens (see styles/theme.css @theme inline) — the host's variables
 * win at runtime, cha-set only ships defaults.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow,background-color] select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 active:bg-primary/80',
        destructive:
          'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 active:bg-destructive/80',
        outline:
          'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:bg-secondary/70',
        ghost:
          'hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
        link:
          'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4 text-base',
        icon: 'size-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ComponentPropsWithRef<typeof BaseButton>,
    VariantProps<typeof buttonVariants> {
  /** Show a loading state and block clicks. @default false */
  loading?: boolean;
  /** Stretch to fill the parent width. @default false */
  fullWidth?: boolean;
  /**
   * shadcn-compatible prop: when true, merges props onto the immediate child element.
   * In Base UI, this maps directly to the `render` prop.
   */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    variant,
    size,
    loading = false,
    fullWidth = false,
    asChild = false,
    className,
    type = 'button',
    disabled,
    children,
    render,
    ...rest
  },
  ref,
) {
  const classes = cn(buttonVariants({ variant, size }), fullWidth && 'w-full', className);
  const isDisabled = disabled || loading;

  const effectiveRender = asChild && React.isValidElement(children) ? children : render;

  return (
    <BaseButton
      ref={ref}
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      render={effectiveRender}
      {...rest}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading ? (
            <span
              className="cs-button__spinner size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
          ) : null}
          <span className={loading ? 'opacity-70' : undefined}>{children}</span>
        </>
      )}
    </BaseButton>
  );
});

