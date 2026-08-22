import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Visual style of the button. @default 'primary' */
  variant?: ButtonVariant;
  /** Size of the button. @default 'md' */
  size?: ButtonSize;
  /** Show a loading state and block clicks. @default false */
  loading?: boolean;
  /** Stretch to fill the parent width. @default false */
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, fullWidth = false, className, type = 'button', disabled, children, ...rest },
  ref,
) {
  const isDisabled = disabled || loading;
  const classes = [
    'cs-button',
    `cs-button--${variant}`,
    `cs-button--${size}`,
    fullWidth ? 'cs-button--full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
    >
      {loading ? <span className="cs-button__spinner" aria-hidden="true" /> : null}
      <span className="cs-button__label">{children}</span>
    </button>
  );
});