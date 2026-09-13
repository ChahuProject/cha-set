import * as React from 'react';
import { cn } from '../lib/utils';

export type ScaleOsdPlacement =
  | 'bottom-center'
  | 'top-center'
  | 'bottom-right'
  | 'top-right';

export interface ScaleOsdProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current scale ratio (e.g. 1.0 for 100%) */
  value?: number;
  defaultValue?: number;
  /** Step increment for minus/plus buttons (default 0.1) */
  step?: number;
  min?: number;
  max?: number;
  /** Controlled visibility state */
  visible?: boolean;
  defaultVisible?: boolean;
  /** Auto-hide duration in milliseconds (default 1400) */
  autoHideDuration?: number;
  /** Custom formatter for the percentage label */
  format?: (value: number) => string;
  /** Whether to show step and reset buttons */
  showControls?: boolean;
  /** Floating anchor placement */
  placement?: ScaleOsdPlacement;
  disabled?: boolean;
  /** Callbacks */
  onChange?: (value: number) => void;
  onStep?: (delta: number) => void;
  onReset?: () => void;
  onVisibilityChange?: (visible: boolean) => void;
}

const placementClasses: Record<ScaleOsdPlacement, string> = {
  'bottom-center': 'fixed bottom-6 left-1/2 -translate-x-1/2',
  'top-center': 'fixed top-6 left-1/2 -translate-x-1/2',
  'bottom-right': 'fixed bottom-6 right-6',
  'top-right': 'fixed top-6 right-6',
};

export const ScaleOsd = React.forwardRef<HTMLDivElement, ScaleOsdProps>(
  (
    {
      className,
      value,
      defaultValue = 1,
      step = 0.1,
      min = 0.2,
      max = 3.0,
      visible: propVisible,
      defaultVisible = false,
      autoHideDuration = 1400,
      format,
      showControls = true,
      placement = 'bottom-center',
      disabled = false,
      onChange,
      onStep,
      onReset,
      onVisibilityChange,
      ...props
    },
    ref,
  ) => {
    const isControlledValue = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<number>(defaultValue);
    const currentValue = isControlledValue ? value : internalValue;

    const isControlledVisible = propVisible !== undefined;
    const [internalVisible, setInternalVisible] = React.useState<boolean>(defaultVisible);
    const isVisible = isControlledVisible ? propVisible : internalVisible;

    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const prevValueRef = React.useRef<number>(currentValue);

    const updateVisibility = React.useCallback(
      (nextVis: boolean) => {
        if (!isControlledVisible) {
          setInternalVisible(nextVis);
        }
        onVisibilityChange?.(nextVis);
      },
      [isControlledVisible, onVisibilityChange],
    );

    const startHideTimer = React.useCallback(() => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      if (autoHideDuration > 0 && autoHideDuration < Infinity) {
        hideTimerRef.current = setTimeout(() => {
          updateVisibility(false);
        }, autoHideDuration);
      }
    }, [autoHideDuration, updateVisibility]);

    // When value changes, automatically reveal and reset timer
    React.useEffect(() => {
      if (prevValueRef.current !== currentValue) {
        prevValueRef.current = currentValue;
        updateVisibility(true);
        if (!isHovered) {
          startHideTimer();
        }
      }
    }, [currentValue, isHovered, startHideTimer, updateVisibility]);

    // Handle mouse enter (pause timer) and leave (restart timer)
    const handleMouseEnter = React.useCallback(() => {
      setIsHovered(true);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    }, []);

    const handleMouseLeave = React.useCallback(() => {
      setIsHovered(false);
      if (isVisible) {
        startHideTimer();
      }
    }, [isVisible, startHideTimer]);

    React.useEffect(() => {
      return () => {
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
        }
      };
    }, []);

    const commitValue = React.useCallback(
      (newVal: number) => {
        const clamped = Math.max(min, Math.min(max, Math.round(newVal * 100) / 100));
        if (!isControlledValue) {
          setInternalValue(clamped);
        }
        onChange?.(clamped);
      },
      [isControlledValue, max, min, onChange],
    );

    const handleStep = React.useCallback(
      (delta: number) => {
        if (disabled) return;
        commitValue(currentValue + delta);
        onStep?.(delta);
      },
      [commitValue, currentValue, disabled, onStep],
    );

    const handleReset = React.useCallback(() => {
      if (disabled) return;
      commitValue(1.0);
      onReset?.();
    }, [commitValue, disabled, onReset]);

    if (!isVisible) {
      return null;
    }

    const defaultFormat = (v: number) => `${Math.round(v * 100)}%`;
    const labelText = format ? format(currentValue) : defaultFormat(currentValue);

    return (
      <div
        ref={ref}
        data-slot="scale-osd"
        role="region"
        aria-label="Scale OSD"
        className={cn(
          'z-50 flex items-center gap-1.5 h-10 px-3.5 select-none rounded-full',
          'bg-card text-card-foreground border border-border shadow-md',
          'transition-all duration-short ease-standard',
          placementClasses[placement],
          disabled && 'opacity-60 pointer-events-none',
          className,
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <span
          data-slot="scale-readout"
          className="font-medium tabular-nums text-sm text-foreground px-1.5 min-w-[3.5rem] text-center"
        >
          {labelText}
        </span>

        {showControls && (
          <div className="flex items-center gap-1 pl-1 border-l border-border/60">
            <button
              type="button"
              aria-label="Zoom Out"
              disabled={disabled || currentValue <= min}
              onClick={() => handleStep(-step)}
              className={cn(
                'size-7 rounded-full flex items-center justify-center text-sm font-semibold',
                'cursor-pointer hover:bg-muted text-foreground transition-colors duration-quick ease-standard',
                'focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring',
                'disabled:cursor-not-allowed disabled:opacity-40',
              )}
            >
              −
            </button>
            <button
              type="button"
              aria-label="Zoom In"
              disabled={disabled || currentValue >= max}
              onClick={() => handleStep(+step)}
              className={cn(
                'size-7 rounded-full flex items-center justify-center text-sm font-semibold',
                'cursor-pointer hover:bg-muted text-foreground transition-colors duration-quick ease-standard',
                'focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring',
                'disabled:cursor-not-allowed disabled:opacity-40',
              )}
            >
              +
            </button>
            <button
              type="button"
              aria-label="Reset Zoom"
              disabled={disabled}
              onClick={handleReset}
              className={cn(
                'size-7 rounded-full flex items-center justify-center text-xs',
                'cursor-pointer hover:bg-muted text-foreground transition-colors duration-quick ease-standard',
                'focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring',
                'disabled:cursor-not-allowed disabled:opacity-40',
              )}
            >
              ⟳
            </button>
          </div>
        )}
      </div>
    );
  },
);

ScaleOsd.displayName = 'ScaleOsd';
