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
  | 'link'
  | 'overlay';

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
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-sm font-medium transition-[color,box-shadow,background-color,translate] duration-quick ease-standard select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:not-aria-[haspopup]:translate-y-0.5 [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 active:bg-primary/80',
        destructive:
          'bg-destructive/10 text-destructive shadow-xs hover:bg-destructive/20 active:bg-destructive/25 dark:bg-destructive/20 dark:hover:bg-destructive/30',
        outline:
          'border border-input bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:bg-secondary/70',
        ghost:
          'hover:bg-muted hover:text-foreground active:bg-muted/80',
        link:
          'text-primary underline-offset-4 hover:underline',
        overlay:
          'border border-[rgba(203,213,225,0.6)] bg-[rgba(232,236,243,0.85)] text-foreground shadow-none hover:border-[rgba(203,213,225,0.9)] hover:bg-[rgba(255,255,255,0.96)] active:border-[rgba(203,213,225,0.9)] active:bg-white dark:border-[rgba(60,72,88,0.6)] dark:bg-[rgba(37,45,61,0.85)] dark:hover:border-[rgba(60,72,88,0.9)] dark:hover:bg-[rgba(48,59,79,0.94)] dark:active:border-[rgba(60,72,88,0.9)] dark:active:bg-[rgba(55,67,89,0.97)]',
      },
      size: {
        default: 'h-8 gap-1.5 px-2.5 text-sm',
        sm: 'h-7 gap-1 px-2.5 text-xs',
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
  /** Optional content/label to display while loading. */
  loadingText?: React.ReactNode;
  /** Stretch to fill the parent width. @default false */
  fullWidth?: boolean;
  /** Toggle or selected state (renders aria-pressed and active styles). @default false */
  pressed?: boolean;
  /** Optional icon rendered before label/children. */
  leftIcon?: React.ReactNode;
  /** Optional icon rendered after label/children. */
  rightIcon?: React.ReactNode;
  /**
   * Logical unscaled icon size; enlarges or overrides the size of any icon
   * (leftIcon / rightIcon / inline svg) rendered inside the button.
   * When omitted, icons keep their size-variant defaults.
   */
  iconSize?: number;
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
  overlay: 'border-[rgba(203,213,225,0.9)] bg-[rgba(255,255,255,0.96)] dark:border-[rgba(60,72,88,0.9)] dark:bg-[rgba(48,59,79,0.94)]',
};

const forceActiveClasses: Record<string, string> = {
  default: 'bg-primary/80',
  destructive: 'bg-destructive/25',
  outline: 'bg-accent/80 text-accent-foreground',
  secondary: 'bg-secondary/70',
  ghost: 'bg-muted/80 text-foreground',
  link: 'underline',
  overlay: 'border-[rgba(203,213,225,0.9)] bg-[rgba(255,255,255,1)] dark:border-[rgba(60,72,88,0.9)] dark:bg-[rgba(55,67,89,0.97)]',
};

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    variant,
    size,
    loading = false,
    loadingText,
    fullWidth = false,
    pressed = false,
    leftIcon,
    rightIcon,
    iconSize,
    asChild = false,
    forceHover = false,
    forceActive = false,
    className,
    type = 'button',
    disabled,
    children,
    style,
    render,
    ...rest
  },
  ref,
) {
  const currentVariant = variant ?? 'default';
  const currentSize = size ?? 'default';
  const isPressed = pressed || forceActive;
  const forceClass =
    isPressed
      ? (forceActiveClasses[currentVariant] ?? '')
      : forceHover
      ? (forceHoverClasses[currentVariant] ?? '')
      : '';
  const classes = cn(
    buttonVariants({ variant, size }),
    forceClass,
    fullWidth && 'w-full',
    iconSize !== undefined && "[&_svg:not([class*='size-'])]:size-[var(--cs-icon-size)]!",
    className,
  );
  const mergedStyle =
    iconSize !== undefined
      ? ({ '--cs-icon-size': `${iconSize * 0.0625}rem`, ...(style ?? {}) } as unknown as React.CSSProperties)
      : style;
  const isDisabled = disabled || loading;

  const effectiveRender = asChild && React.isValidElement(children) ? children : render;

  return (
    <BaseButton
      ref={ref}
      type={type}
      className={classes}
      style={mergedStyle}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-pressed={pressed ? true : undefined}
      data-pressed={pressed ? 'true' : undefined}
      render={effectiveRender}
      nativeButton={asChild ? false : undefined}
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
            <>
              <span
                className="cs-button__spinner size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden="true"
              />
              {loadingText !== undefined ? loadingText : children}
            </>
          ) : (
            <>
              {leftIcon}
              {children}
              {rightIcon}
            </>
          )}
        </>
      )}
    </BaseButton>
  );
});

