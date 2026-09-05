import * as React from 'react';
import { cn } from '../lib/utils';

export type CheckboxSize = 'default' | 'sm';

export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  size?: CheckboxSize;
  label?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  forceHover?: boolean;
  forceFocus?: boolean;
  wrapperClassName?: string;
}

const sizeStyles: Record<CheckboxSize, string> = {
  default: 'size-4 rounded-[4px]',
  sm: 'size-3.5 rounded-[3px]',
};

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className = '',
      wrapperClassName = '',
      checked: controlledChecked,
      defaultChecked = false,
      indeterminate = false,
      size = 'default',
      disabled = false,
      label,
      children,
      onCheckedChange,
      forceHover = false,
      forceFocus = false,
      onClick,
      id,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledChecked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] =
      React.useState<boolean>(defaultChecked);
    const isChecked = isControlled ? Boolean(controlledChecked) : uncontrolledChecked;

    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

    const handleToggle = (e?: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const nextChecked = indeterminate ? true : !isChecked;
      if (!isControlled) {
        setUncontrolledChecked(nextChecked);
      }
      onCheckedChange?.(nextChecked);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      handleToggle(e);
      onClick?.(e);
    };

    let forcedStateClass = '';
    if (forceFocus) {
      forcedStateClass += ' ring-1 ring-ring border-ring outline-hidden';
    }
    if (forceHover && !disabled) {
      forcedStateClass += isChecked || indeterminate
        ? ' bg-primary/90 border-primary/90'
        : ' border-foreground/40';
    }

    const stateClasses = isChecked || indeterminate
      ? 'bg-primary text-primary-foreground border-primary'
      : 'border-input bg-transparent hover:border-foreground/40';

    const boxElement = (
      <button
        ref={buttonRef}
        type="button"
        role="checkbox"
        id={id}
        aria-checked={indeterminate ? 'mixed' : isChecked}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        data-slot="checkbox"
        data-state={indeterminate ? 'indeterminate' : isChecked ? 'checked' : 'unchecked'}
        data-size={size}
        className={cn(
          'inline-flex items-center justify-center shrink-0 border transition-colors cursor-pointer',
          'focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          sizeStyles[size],
          stateClasses,
          forcedStateClass,
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        {indeterminate ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(size === 'sm' ? 'size-2.5' : 'size-3')}
            aria-hidden="true"
            data-slot="checkbox-indicator"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        ) : isChecked ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(size === 'sm' ? 'size-2.5' : 'size-3')}
            aria-hidden="true"
            data-slot="checkbox-indicator"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : null}
      </button>
    );

    const companionContent = label ?? children;

    if (companionContent !== undefined && companionContent !== null) {
      return (
        <label
          htmlFor={id}
          data-slot="checkbox-wrapper"
          className={cn(
            'inline-flex items-center gap-2 select-none text-foreground font-medium',
            size === 'sm' ? 'text-xs' : 'text-sm',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            wrapperClassName,
          )}
          onClick={(e) => {
            if (
              buttonRef.current &&
              (e.target === buttonRef.current || buttonRef.current.contains(e.target as Node))
            ) {
              return;
            }
            e.preventDefault();
            if (!disabled) {
              buttonRef.current?.click();
            }
          }}
        >
          {boxElement}
          <span data-slot="checkbox-label">{companionContent}</span>
        </label>
      );
    }

    return boxElement;
  },
);

Checkbox.displayName = 'Checkbox';
