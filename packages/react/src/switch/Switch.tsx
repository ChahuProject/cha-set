import * as React from 'react';
import { cn } from '../lib/utils';

export type SwitchSize = 'default' | 'sm';

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'size'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (checked: boolean) => void;
  size?: SwitchSize;
  label?: React.ReactNode;
  description?: React.ReactNode;
  readOnly?: boolean;
  loading?: boolean;
  forceHover?: boolean;
  forceFocus?: boolean;
  wrapperClassName?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      wrapperClassName,
      checked,
      defaultChecked = false,
      onCheckedChange,
      onChange,
      disabled = false,
      readOnly = false,
      loading = false,
      size = 'default',
      label,
      description,
      children,
      id,
      name,
      forceHover = false,
      forceFocus = false,
      onClick,
      'aria-label': ariaLabelProp,
      ...props
    },
    ref,
  ) => {
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isChecked = isControlled ? checked : internalChecked;

    const generatedId = React.useId();
    const switchId = id || generatedId;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || readOnly || loading) {
        e.preventDefault();
        return;
      }
      const nextChecked = !isChecked;
      if (!isControlled) {
        setInternalChecked(nextChecked);
      }
      onCheckedChange?.(nextChecked);
      onChange?.(nextChecked);
      onClick?.(e);
    };

    const isSm = size === 'sm';
    const state = isChecked ? 'checked' : 'unchecked';

    let forcedFocusClass = '';
    if (forceFocus) {
      forcedFocusClass = 'ring-1 ring-ring outline-hidden';
    }

    let forcedHoverClass = '';
    if (forceHover && !disabled && !readOnly) {
      forcedHoverClass = isChecked ? 'bg-primary/90' : 'bg-input/80';
    }

    const fallbackLabel =
      typeof label === 'string'
        ? label
        : typeof children === 'string'
        ? children
        : undefined;
    const effectiveAriaLabel = ariaLabelProp ?? fallbackLabel;

    const switchButton = (
      <button
        ref={ref}
        type="button"
        role="switch"
        id={switchId}
        name={name}
        aria-checked={isChecked}
        aria-label={effectiveAriaLabel}
        aria-readonly={readOnly || undefined}
        aria-busy={loading || undefined}
        data-slot="switch"
        data-state={state}
        data-size={size}
        data-loading={loading || undefined}
        disabled={disabled}
        className={cn(
          'peer inline-flex shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-short ease-standard focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 select-none',
          readOnly ? 'cursor-default' : 'cursor-pointer',
          isSm ? 'h-4 w-7' : 'h-5 w-9',
          isChecked ? 'bg-primary' : 'bg-input',
          forcedFocusClass,
          forcedHoverClass,
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        <span
          data-slot="switch-thumb"
          data-state={state}
          className={cn(
            'pointer-events-none flex items-center justify-center rounded-full bg-background shadow-lg ring-0 transition-[translate] duration-short ease-standard',
            isSm ? 'size-3' : 'size-4',
            isChecked ? (isSm ? 'translate-x-3' : 'translate-x-4') : 'translate-x-0',
          )}
        >
          {loading && (
            <svg
              className="animate-spin text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              style={{ width: isSm ? 8 : 10, height: isSm ? 8 : 10 }}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          )}
        </span>
      </button>
    );

    if (description !== undefined && description !== null) {
      const visualLabel = label ?? children;
      return (
        <div
          data-slot="switch-wrapper"
          className={cn(
            'inline-flex items-start gap-3 select-none',
            disabled && 'opacity-50 cursor-not-allowed',
            wrapperClassName,
          )}
          onClick={(e) => {
            if (e.target !== e.currentTarget && !readOnly && !disabled && !loading) {
              const target = e.target as HTMLElement;
              if (target.closest('button[role="switch"]')) return;
              const nextChecked = !isChecked;
              if (!isControlled) setInternalChecked(nextChecked);
              onCheckedChange?.(nextChecked);
              onChange?.(nextChecked);
            }
          }}
        >
          <div className="pt-0.5 shrink-0">{switchButton}</div>
          <div className="flex flex-col select-none">
            {visualLabel && (
              <span
                data-slot="switch-label"
                className={cn(
                  'font-medium text-foreground leading-none cursor-pointer',
                  isSm ? 'text-xs' : 'text-sm',
                  readOnly && 'cursor-default',
                )}
              >
                {visualLabel}
              </span>
            )}
            <span
              data-slot="switch-description"
              className={cn(
                'text-muted-foreground font-normal mt-1 leading-normal cursor-pointer',
                isSm ? 'text-[11px]' : 'text-xs',
                readOnly && 'cursor-default',
              )}
            >
              {description}
            </span>
          </div>
        </div>
      );
    }

    return switchButton;
  },
);

Switch.displayName = 'Switch';
