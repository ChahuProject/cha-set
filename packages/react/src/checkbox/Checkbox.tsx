import * as React from 'react';
import { cn } from '../lib/utils';

export type CheckboxSize = 'default' | 'sm';

export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean | 'indeterminate';
  defaultChecked?: boolean;
  indeterminate?: boolean;
  size?: CheckboxSize;
  label?: React.ReactNode;
  description?: React.ReactNode;
  invalid?: boolean;
  readOnly?: boolean;
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
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
      readOnly = false,
      invalid = false,
      label,
      description,
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
    const isExplicitIndeterminate = controlledChecked === 'indeterminate' || indeterminate;
    const isControlled = controlledChecked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] =
      React.useState<boolean>(defaultChecked);
    const isChecked = controlledChecked === 'indeterminate' ? false : (isControlled ? Boolean(controlledChecked) : uncontrolledChecked);

    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

    const handleToggle = (e?: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || readOnly) return;
      const nextChecked = isExplicitIndeterminate ? true : !isChecked;
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
      forcedStateClass += invalid
        ? ' ring-1 ring-destructive border-destructive outline-hidden'
        : ' ring-1 ring-ring border-ring outline-hidden';
    }
    if (forceHover && !disabled && !readOnly) {
      forcedStateClass += isChecked || isExplicitIndeterminate
        ? ' bg-primary/90 border-primary/90'
        : invalid
        ? ' border-destructive'
        : ' border-foreground/40';
    }

    const stateClasses = isChecked || isExplicitIndeterminate
      ? 'bg-primary text-primary-foreground border-primary'
      : invalid
      ? 'border-destructive bg-transparent hover:border-destructive'
      : 'border-input bg-transparent hover:border-foreground/40';

    const focusRingClass = invalid ? 'focus-visible:ring-destructive' : 'focus-visible:ring-ring';

    const boxElement = (
      <button
        ref={buttonRef}
        type="button"
        role="checkbox"
        id={id}
        aria-checked={isExplicitIndeterminate ? 'mixed' : isChecked}
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
        aria-invalid={invalid ? 'true' : undefined}
        disabled={disabled}
        data-slot="checkbox"
        data-state={isExplicitIndeterminate ? 'indeterminate' : isChecked ? 'checked' : 'unchecked'}
        data-size={size}
        className={cn(
          'inline-flex items-center justify-center shrink-0 border transition-colors duration-quick ease-standard',
          readOnly ? 'cursor-default' : 'cursor-pointer',
          'focus-visible:outline-hidden focus-visible:ring-1',
          focusRingClass,
          'disabled:cursor-not-allowed disabled:opacity-50',
          sizeStyles[size],
          stateClasses,
          forcedStateClass,
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          data-slot="checkbox-indicator"
          className={cn(
            size === 'sm' ? 'size-2.5' : 'size-3',
            'transition-[opacity,scale] duration-quick ease-entrance',
            isChecked || isExplicitIndeterminate ? 'opacity-100 scale-100' : 'opacity-0 scale-50',
          )}
        >
          {isExplicitIndeterminate ? (
            <line x1="5" y1="12" x2="19" y2="12" />
          ) : isChecked ? (
            <polyline points="20 6 9 17 4 12" />
          ) : null}
        </svg>
      </button>
    );

    const companionContent = label ?? children;
    const hasDescription = description !== undefined && description !== null;

    if (companionContent !== undefined && companionContent !== null || hasDescription) {
      if (hasDescription) {
        return (
          <label
            htmlFor={id}
            data-slot="checkbox-wrapper"
            className={cn(
              'inline-flex items-start gap-2.5 select-none text-foreground',
              disabled ? 'cursor-not-allowed opacity-50' : readOnly ? 'cursor-default' : 'cursor-pointer',
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
              if (!disabled && !readOnly) {
                buttonRef.current?.click();
              }
            }}
          >
            <div className="pt-0.5 shrink-0">{boxElement}</div>
            <div className="flex flex-col select-none">
              {companionContent && (
                <span
                  data-slot="checkbox-label"
                  className={cn('font-medium leading-none', size === 'sm' ? 'text-xs' : 'text-sm')}
                >
                  {companionContent}
                </span>
              )}
              <span
                data-slot="checkbox-description"
                className={cn('text-muted-foreground font-normal mt-1 leading-normal', size === 'sm' ? 'text-[11px]' : 'text-xs')}
              >
                {description}
              </span>
            </div>
          </label>
        );
      }

      return (
        <label
          htmlFor={id}
          data-slot="checkbox-wrapper"
          className={cn(
            'inline-flex items-center gap-2 select-none text-foreground font-medium',
            size === 'sm' ? 'text-xs' : 'text-sm',
            disabled ? 'cursor-not-allowed opacity-50' : readOnly ? 'cursor-default' : 'cursor-pointer',
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
            if (!disabled && !readOnly) {
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
