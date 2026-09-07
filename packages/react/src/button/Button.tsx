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

export type ButtonSize =
  | 'default'
  | 'sm'
  | 'lg'
  | 'icon'
  | 'xs'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon-lg';

/**
 * shadcn-standard variant table. Utilities resolve against the shadcn-standard
 * core tokens (see styles/theme.css @theme inline) — the host's variables
 * win at runtime, cha-set only ships defaults.
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-sm font-medium transition-[color,box-shadow,background-color,transform] select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:not-aria-[haspopup]:translate-y-px [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 active:bg-primary/80',
        destructive:
          'bg-destructive/10 text-destructive shadow-xs hover:bg-destructive/20 active:bg-destructive/25 dark:bg-destructive/20 dark:hover:bg-destructive/30',
        outline:
          'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:bg-secondary/70',
        ghost:
          'hover:bg-muted hover:text-foreground active:bg-muted/80',
        link:
          'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-8 gap-1.5 px-2.5 text-sm',
        sm: 'h-7 gap-1 px-2.5 text-[0.8rem]',
        xs: 'h-6 gap-1 px-2 text-xs [&_svg:not([class*=\'size-\'])]:size-3',
        lg: 'h-9 gap-2 px-3 text-sm',
        icon: 'size-8 p-0',
        'icon-xs': 'size-6 p-0 [&_svg:not([class*=\'size-\'])]:size-3',
        'icon-sm': 'size-7 p-0 [&_svg:not([class*=\'size-\'])]:size-3.5',
        'icon-lg': 'size-9 p-0 [&_svg:not([class*=\'size-\'])]:size-4.5',
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
  /** Programmatically force the hover state for visual testing and snapshot parity. */
  forceHover?: boolean;
  /** Programmatically force the active/pressed state for visual testing and snapshot parity. */
  forceActive?: boolean;
}

const forceHoverClasses: Record<string, string> = {
  default: 'bg-primary/90',
  destructive: 'bg-destructive/20',
  outline: 'bg-accent text-accent-foreground',
  secondary: 'bg-secondary/80',
  ghost: 'bg-muted text-foreground',
  link: 'underline',
};

const forceActiveClasses: Record<string, string> = {
  default: 'bg-primary/80',
  destructive: 'bg-destructive/25',
  outline: 'bg-accent/80 text-accent-foreground',
  secondary: 'bg-secondary/70',
  ghost: 'bg-muted/80 text-foreground',
  link: 'underline',
};

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    variant,
    size,
    loading = false,
    fullWidth = false,
    asChild = false,
    forceHover = false,
    forceActive = false,
    className,
    type = 'button',
    disabled,
    children,
    render,
    ...rest
  },
  ref,
) {
  const currentVariant = variant ?? 'default';
  const currentSize = size ?? 'default';
  const forceClass =
    forceActive
      ? (forceActiveClasses[currentVariant] ?? '')
      : forceHover
      ? (forceHoverClasses[currentVariant] ?? '')
      : '';
  const classes = cn(
    buttonVariants({ variant, size }),
    forceClass,
    fullWidth && 'w-full',
    className,
  );
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
      data-slot="button"
      data-variant={currentVariant}
      data-size={currentSize}
      {...rest}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading ? (
            <span
              className="cs-button__spinner size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
          ) : null}
          {children}
        </>
      )}
    </BaseButton>
  );
});

