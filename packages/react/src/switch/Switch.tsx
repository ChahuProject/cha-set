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
  forceHover?: boolean;
  forceFocus?: boolean;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked,
      defaultChecked = false,
      onCheckedChange,
      onChange,
      disabled = false,
      size = 'default',
      label,
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
      if (disabled) {
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
    if (forceHover) {
      forcedHoverClass = isChecked ? 'bg-primary/90' : 'bg-input/80';
    }

    const fallbackLabel =
      typeof label === 'string'
        ? label
        : typeof children === 'string'
        ? children
        : undefined;
    const effectiveAriaLabel = ariaLabelProp ?? fallbackLabel;

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        id={switchId}
        name={name}
        aria-checked={isChecked}
        aria-label={effectiveAriaLabel}
        data-slot="switch"
        data-state={state}
        data-size={size}
        disabled={disabled}
        className={cn(
          'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 select-none',
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
            'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
            isSm ? 'size-3' : 'size-4',
            isChecked ? (isSm ? 'translate-x-3' : 'translate-x-4') : 'translate-x-0',
          )}
        />
      </button>
    );
  },
);

Switch.displayName = 'Switch';
