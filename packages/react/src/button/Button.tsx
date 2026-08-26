import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * shadcn-style variant table. Utilities resolve against the shadcn-standard
 * core tokens (see styles/theme.css @theme inline) — the host's variables
 * win at runtime, cha-set only ships defaults.
 */
const buttonVariants = cva(
  // Base: rem-based sizing honors host root-font-size scaling; focus ring
  // reads --ring; loading/disabled share one disabled visual treatment.
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
        secondary:
          'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/90 active:bg-secondary/80',
        ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4',
        lg: 'h-10 px-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  /** Show a loading state and block clicks. @default false */
  loading?: boolean;
  /** Stretch to fill the parent width. @default false */
  fullWidth?: boolean;
  /**
   * Render as the child element instead of <button> (shadcn asChild).
   * Note: with asChild the spinner is not injected and click-blocking while
   * loading is left to the child (only aria-disabled/aria-busy are set).
   */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
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
    ...rest
  },
  ref,
) {
  const classes = cn(buttonVariants({ variant, size }), fullWidth && 'w-full', className);
  const isDisabled = disabled || loading;

  if (asChild) {
    return (
      <Slot
        ref={ref}
        className={classes}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        {...rest}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button ref={ref} type={type} className={classes} disabled={isDisabled} aria-busy={loading || undefined} {...rest}>
      {loading ? (
        <span
          className="cs-button__spinner size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : null}
      <span className={loading ? 'opacity-70' : undefined}>{children}</span>
    </button>
  );
});
