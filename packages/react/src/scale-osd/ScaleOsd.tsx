import * as React from 'react';
import { cn } from '../lib/utils';
export { CANONICAL_SCALE_STEPS } from '@chahu/spec/scale-osd';
import { CANONICAL_SCALE_STEPS } from '@chahu/spec/scale-osd';

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
  /** Step increment for minus/plus buttons when not using discrete steps (default 0.1) */
  step?: number;
  min?: number;
  max?: number;
  /** Discrete scale steps list (e.g. CANONICAL_SCALE_STEPS) */
  steps?: readonly number[];
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
  /** Visual sizing preset ('default' or 'lg') */
  size?: 'default' | 'lg';
  /** Whether visibility and value changes animate */
  animated?: boolean;
  /** Whether controls are disabled */
  disabled?: boolean;
  /** Whether the OSD ignores global UI scale and maintains fixed physical pixel geometry (default true) */
  ignoreUiScale?: boolean;
  /** Callbacks */
  onChange?: (value: number) => void;
  onStep?: (delta: number) => void;
  onReset?: () => void;
  onVisibilityChange?: (visible: boolean) => void;
}

const placementClasses: Record<ScaleOsdPlacement, string> = {
  'bottom-center': 'fixed bottom-9 left-0 right-0 mx-auto w-fit',
  'top-center': 'fixed top-9 left-0 right-0 mx-auto w-fit',
  'bottom-right': 'fixed bottom-9 right-9',
  'top-right': 'fixed top-9 right-9',
};

export const ScaleOsd = React.forwardRef<HTMLDivElement, ScaleOsdProps>(
  (
    {
      className,
      value,
      defaultValue = 1,
      step = 0.1,
      min: propMin,
      max: propMax,
      steps,
      visible: propVisible,
      defaultVisible = false,
      autoHideDuration = 1400,
      format,
      showControls = true,
      placement = 'bottom-center',
      disabled = false,
      size = 'default',
      animated = true,
      ignoreUiScale = true,
      onChange,
      onStep,
      onReset,
      onVisibilityChange,
      style,
      onMouseEnter,
      onMouseLeave,
      onPointerEnter,
      onPointerLeave,
      ...props
    },
    ref,
  ) => {
    const min = propMin ?? (steps && steps.length > 0 ? (steps[0] ?? 0.2) : 0.2);
    const max = propMax ?? (steps && steps.length > 0 ? (steps[steps.length - 1] ?? 5.0) : 5.0);

    const isControlledValue = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<number>(defaultValue);
    const currentValue = isControlledValue ? value : internalValue;

    const isControlledVisible = propVisible !== undefined;
    const [internalVisible, setInternalVisible] = React.useState<boolean>(defaultVisible);
    const isVisible = isControlledVisible ? propVisible : internalVisible;

    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const isHoveredRef = React.useRef<boolean>(false);
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

    const clearHideTimer = React.useCallback(() => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    }, []);

    const startHideTimer = React.useCallback(() => {
      clearHideTimer();
      if (isHoveredRef.current) return;
      if (autoHideDuration > 0 && autoHideDuration < Infinity) {
        hideTimerRef.current = setTimeout(() => {
          if (!isHoveredRef.current) {
            updateVisibility(false);
            hideTimerRef.current = null;
          }
        }, autoHideDuration);
      }
    }, [autoHideDuration, clearHideTimer, updateVisibility]);

    // When value changes, automatically reveal and reset timer if not hovered
    React.useEffect(() => {
      if (prevValueRef.current !== currentValue) {
        prevValueRef.current = currentValue;
        updateVisibility(true);
        if (!isHoveredRef.current) {
          startHideTimer();
        }
      }
    }, [currentValue, startHideTimer, updateVisibility]);

    // Handle mouse/pointer enter (pause timer) and leave (restart timer)
    const handleMouseEnter = React.useCallback(() => {
      isHoveredRef.current = true;
      setIsHovered(true);
      clearHideTimer();
    }, [clearHideTimer]);

    const handleMouseLeave = React.useCallback(() => {
      isHoveredRef.current = false;
      setIsHovered(false);
      if (isVisible) {
        startHideTimer();
      }
    }, [isVisible, startHideTimer]);

    React.useEffect(() => {
      return () => {
        clearHideTimer();
      };
    }, [clearHideTimer]);

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
      (direction: number) => {
        if (disabled) return;
        if (steps && steps.length > 0) {
          let nearestIdx = 0;
          let minDiff = Infinity;
          for (let i = 0; i < steps.length; i++) {
            const stepVal = steps[i];
            if (stepVal !== undefined) {
              const diff = Math.abs(stepVal - currentValue);
              if (diff < minDiff) {
                minDiff = diff;
                nearestIdx = i;
              }
            }
          }
          const nextIdx = Math.max(0, Math.min(steps.length - 1, nearestIdx + (direction > 0 ? 1 : -1)));
          const targetVal = steps[nextIdx];
          if (targetVal !== undefined) {
            commitValue(targetVal);
          }
        } else {
          commitValue(currentValue + direction * step);
        }
        onStep?.(direction * step);
      },
      [commitValue, currentValue, disabled, onStep, step, steps],
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

    const isLg = size === 'lg';

    const defaultBoxShadow =
      '0 0 0 1px color-mix(in oklch, var(--border) 85%, transparent), 0 12px 36px color-mix(in oklch, black 18%, transparent)';

    // When ignoreUiScale is true, apply fixed physical pixel metrics to guarantee
    // the HUD does not grow or shrink with root font-size rem scaling or uiScale.
    const invariantContainerStyle: React.CSSProperties = ignoreUiScale
      ? {
          height: isLg ? 42 : 40,
          minHeight: isLg ? 42 : 40,
          paddingLeft: isLg ? 18 : 14,
          paddingRight: isLg ? 9 : 14,
          gap: 6,
          fontSize: isLg ? 20 : 14,
          lineHeight: isLg ? '30px' : '20px',
          boxShadow: style?.boxShadow || defaultBoxShadow,
          ...style,
        }
      : {
          boxShadow: style?.boxShadow || defaultBoxShadow,
          ...style,
        };

    const readoutStyle: React.CSSProperties | undefined = ignoreUiScale
      ? {
          fontSize: isLg ? 20 : 14,
          minWidth: isLg ? 180 : 56,
        }
      : undefined;

    const buttonStyle: React.CSSProperties | undefined = ignoreUiScale
      ? {
          width: isLg ? 42 : 28,
          height: isLg ? 42 : 28,
          minWidth: isLg ? 42 : 28,
          fontSize: isLg ? 21 : 15,
        }
      : undefined;

    const resetButtonStyle: React.CSSProperties | undefined = ignoreUiScale
      ? {
          width: isLg ? 42 : 28,
          height: isLg ? 42 : 28,
          minWidth: isLg ? 42 : 28,
          fontSize: isLg ? 18 : 12,
        }
      : undefined;

    return (
      <div
        ref={ref}
        data-slot="scale-osd"
        role="region"
        aria-label="Scale OSD"
        className={cn(
          'z-[100] flex items-center select-none rounded-full',
          isLg ? 'gap-1.5 h-11 px-4' : 'gap-1.5 h-10 px-3.5',
          'bg-popover text-popover-foreground border border-border/80 shadow-2xl',
          animated ? 'transition-all duration-short ease-standard' : 'transition-none',
          placementClasses[placement],
          disabled && 'opacity-60 pointer-events-none',
          className,
        )}
        style={invariantContainerStyle}
        onMouseEnter={(e) => {
          handleMouseEnter();
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          handleMouseLeave();
          onMouseLeave?.(e);
        }}
        onPointerEnter={(e) => {
          handleMouseEnter();
          onPointerEnter?.(e);
        }}
        onPointerLeave={(e) => {
          handleMouseLeave();
          onPointerLeave?.(e);
        }}
        {...props}
      >
        <span
          data-slot="scale-readout"
          className={cn(
            'font-medium tabular-nums text-foreground px-1.5 text-center',
            isLg ? 'text-lg min-w-[11.25rem]' : 'text-sm min-w-[3.5rem]',
          )}
          style={readoutStyle}
        >
          {labelText}
        </span>

        {showControls && (
          <div
            className={cn('flex items-center', isLg ? 'gap-1.5' : 'gap-1 pl-1 border-l border-border/60')}
            style={ignoreUiScale ? { gap: 6 } : undefined}
          >
            <button
              type="button"
              aria-label="Zoom Out"
              title="缩小"
              disabled={disabled || currentValue <= min}
              onClick={() => handleStep(-1)}
              className={cn(
                'rounded-full flex items-center justify-center font-semibold shrink-0',
                isLg ? 'size-10 text-lg' : 'size-7 text-sm',
                'cursor-pointer hover:bg-muted text-foreground transition-colors duration-quick ease-standard',
                'focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring',
                'disabled:cursor-not-allowed disabled:opacity-40',
              )}
              style={buttonStyle}
            >
              −
            </button>
            <button
              type="button"
              aria-label="Zoom In"
              title="放大"
              disabled={disabled || currentValue >= max}
              onClick={() => handleStep(1)}
              className={cn(
                'rounded-full flex items-center justify-center font-semibold shrink-0',
                isLg ? 'size-10 text-lg' : 'size-7 text-sm',
                'cursor-pointer hover:bg-muted text-foreground transition-colors duration-quick ease-standard',
                'focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring',
                'disabled:cursor-not-allowed disabled:opacity-40',
              )}
              style={buttonStyle}
            >
              +
            </button>
            <button
              type="button"
              aria-label="Reset Zoom"
              title="重置"
              disabled={disabled || Math.abs(currentValue - 1.0) < 0.001}
              onClick={handleReset}
              className={cn(
                'rounded-full flex items-center justify-center shrink-0',
                isLg ? 'size-10 text-base' : 'size-7 text-xs',
                'cursor-pointer hover:bg-muted text-foreground transition-colors duration-quick ease-standard',
                'focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring',
                'disabled:cursor-not-allowed disabled:opacity-40',
              )}
              style={resetButtonStyle}
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

