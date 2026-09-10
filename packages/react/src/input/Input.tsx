import React, { useState, useRef, useImperativeHandle } from 'react';

export type InputSize = 'default' | 'sm';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  forceHover?: boolean;
  forceFocus?: boolean;
  invalid?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  passwordToggle?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles: Record<InputSize, string> = {
  default: 'h-8 px-2.5 py-1 text-sm',
  sm: 'h-7 px-2 py-0.5 text-xs',
};

const addonContainerSizeStyles: Record<InputSize, string> = {
  default: 'h-8 text-sm px-2.5',
  sm: 'h-7 text-xs px-2',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      type = 'text',
      size = 'default',
      forceHover = false,
      forceFocus = false,
      invalid = false,
      clearable = false,
      onClear,
      passwordToggle = false,
      leftIcon,
      rightIcon,
      disabled = false,
      readOnly = false,
      value,
      defaultValue,
      onChange,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!);

    const [innerValue, setInnerValue] = useState(value ?? defaultValue ?? '');
    const [showPassword, setShowPassword] = useState(false);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value) : String(innerValue);
    const hasValue = currentValue.length > 0;

    const effectiveType =
      type === 'password' && passwordToggle && showPassword ? 'text' : type;

    const hasAddons = Boolean(
      leftIcon || rightIcon || clearable || (type === 'password' && passwordToggle),
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInnerValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isControlled) {
        setInnerValue('');
      }
      if (inputRef.current) {
        inputRef.current.value = '';
        const syntheticEvent = {
          target: inputRef.current,
          currentTarget: inputRef.current,
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
        inputRef.current.focus();
      }
      onClear?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape' && clearable && hasValue && !disabled && !readOnly) {
        e.preventDefault();
        handleClear(e as unknown as React.MouseEvent);
      }
      onKeyDown?.(e);
    };

    let forcedStateClass = '';
    if (forceFocus) {
      forcedStateClass = invalid
        ? 'ring-1 ring-destructive border-destructive outline-hidden'
        : 'ring-1 ring-ring border-ring outline-hidden';
    } else if (invalid) {
      forcedStateClass = 'border-destructive focus-visible:ring-destructive focus-visible:border-destructive';
    }

    if (!hasAddons) {
      return (
        <input
          ref={inputRef}
          type={effectiveType}
          data-slot="input"
          data-size={size}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={invalid ? true : undefined}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={`flex w-full rounded-md border border-input bg-transparent dark:bg-input/20 shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground ${sizeStyles[size]} ${forcedStateClass} ${className}`.trim()}
          {...props}
        />
      );
    }

    const containerForcedClass = forceFocus
      ? invalid
        ? 'ring-1 ring-destructive border-destructive'
        : 'ring-1 ring-ring border-ring'
      : invalid
      ? 'border-destructive focus-within:ring-1 focus-within:ring-destructive focus-within:border-destructive'
      : 'border-input focus-within:ring-1 focus-within:ring-ring';

    return (
      <div
        data-slot="input-container"
        data-size={size}
        className={`flex items-center w-full rounded-md border bg-transparent dark:bg-input/20 shadow-xs transition-colors text-foreground ${addonContainerSizeStyles[size]} ${containerForcedClass} ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        } ${className}`.trim()}
      >
        {leftIcon && (
          <span className="flex items-center justify-center mr-2 text-muted-foreground shrink-0 select-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={inputRef}
          type={effectiveType}
          data-slot="input"
          data-size={size}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={invalid ? true : undefined}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 w-full bg-transparent border-0 outline-none placeholder:text-muted-foreground text-foreground text-inherit p-0 disabled:cursor-not-allowed"
          {...props}
        />
        <div className="flex items-center gap-1 ml-1.5 shrink-0">
          {clearable && hasValue && !disabled && !readOnly && (
            <button
              type="button"
              tabIndex={-1}
              aria-label="Clear input"
              onClick={handleClear}
              className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </button>
          )}
          {type === 'password' && passwordToggle && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(!showPassword)}
              className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
          {rightIcon && (
            <span className="flex items-center justify-center text-muted-foreground select-none">
              {rightIcon}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';
