import * as React from 'react';

/**
 * Canonical 17-step discrete scale ladder matching Chrome / Chromium page zoom:
 * 25% 33% 50% 67% 75% 80% 90% 100% 110% 125% 150% 175% 200% 250% 300% 400% 500%
 */
export const CANONICAL_SCALE_STEPS: readonly number[] = [
  0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0, 4.0, 5.0,
] as const;

export interface UseScaleOsdOptions {
  /** Current scale ratio (controlled) */
  value?: number;
  /** Initial scale ratio if uncontrolled (default 1.0) */
  defaultValue?: number;
  /** Discrete scale steps (default CANONICAL_SCALE_STEPS) */
  steps?: readonly number[];
  /** Continuous step delta if steps is not used (default 0.1) */
  step?: number;
  min?: number;
  max?: number;
  /** Auto-hide duration in milliseconds (default 1400) */
  autoHideDuration?: number;
  /** Whether global Ctrl+Wheel and Ctrl++, Ctrl+-, Ctrl+0 shortcuts are enabled (default true) */
  enableShortcuts?: boolean;
  /**
   * Debounce delay in milliseconds for interactive zooming (wheel, shortcuts, buttons) (default 1500, set 0 to disable).
   * Visual indicator on the capsule updates immediately, while onChange is debounced
   * so frantic Ctrl+Wheel bursts only pay one heavy re-layout after the user pauses.
   * Direct calls to setScale() bypass debounce and apply immediately.
   */
  debounceMs?: number;
  /** Callback fired when scale changes */
  onChange?: (scale: number) => void;
}

export function useScaleOsd(options: UseScaleOsdOptions = {}) {
  const {
    value,
    defaultValue = 1.0,
    steps = CANONICAL_SCALE_STEPS,
    step = 0.1,
    min = options.min ?? (steps && steps.length > 0 ? (steps[0] ?? 0.2) : 0.2),
    max = options.max ?? (steps && steps.length > 0 ? (steps[steps.length - 1] ?? 5.0) : 5.0),
    autoHideDuration = 1400,
    enableShortcuts = true,
    debounceMs = 1500,
    onChange,
  } = options;

  const isControlled = value !== undefined;
  const [internalScale, setInternalScale] = React.useState<number>(defaultValue);
  const [pendingScale, setPendingScale] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (isControlled) {
      setPendingScale(null);
    }
  }, [isControlled, value]);

  const displayScale = pendingScale !== null ? pendingScale : (isControlled ? value : internalScale);
  const scale = isControlled ? value : internalScale;

  const [visible, setVisible] = React.useState<boolean>(false);
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveredRef = React.useRef<boolean>(false);

  const clearTimer = React.useCallback(() => {
    if (hideTimerRef.current != null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const clearDebounceTimer = React.useCallback(() => {
    if (debounceTimerRef.current != null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  const scheduleHide = React.useCallback(
    (duration = autoHideDuration) => {
      clearTimer();
      if (isHoveredRef.current) return;
      if (duration > 0 && duration < Infinity) {
        hideTimerRef.current = setTimeout(() => {
          if (!isHoveredRef.current) {
            setVisible(false);
            hideTimerRef.current = null;
          }
        }, duration);
      }
    },
    [autoHideDuration, clearTimer],
  );

  const show = React.useCallback(
    (duration = autoHideDuration) => {
      setVisible(true);
      scheduleHide(duration);
    },
    [autoHideDuration, scheduleHide],
  );

  const hide = React.useCallback(() => {
    clearTimer();
    setVisible(false);
  }, [clearTimer]);

  const pauseHide = React.useCallback(() => {
    isHoveredRef.current = true;
    clearTimer();
  }, [clearTimer]);

  const resumeHide = React.useCallback(() => {
    isHoveredRef.current = false;
    scheduleHide();
  }, [scheduleHide]);

  const commitScale = React.useCallback(
    (nextScale: number, immediate = false) => {
      const clamped = Math.max(min, Math.min(max, Math.round(nextScale * 100) / 100));
      setPendingScale(clamped);
      if (!isControlled) {
        setInternalScale(clamped);
      }
      show();
      clearDebounceTimer();

      if (immediate || debounceMs <= 0) {
        setPendingScale(null);
        onChange?.(clamped);
      } else {
        debounceTimerRef.current = setTimeout(() => {
          setPendingScale(null);
          onChange?.(clamped);
          // The debounced commit (1500ms) outlives autoHide (1400ms): re-show so
          // the OSD is still visible when the heavy apply lands as confirmation.
          show();
          debounceTimerRef.current = null;
        }, debounceMs);
      }
      return clamped;
    },
    [clearDebounceTimer, debounceMs, isControlled, max, min, onChange, show],
  );

  const setScale = React.useCallback(
    (nextScale: number) => {
      return commitScale(nextScale, true);
    },
    [commitScale],
  );

  const zoomIn = React.useCallback(() => {
    const base = displayScale;
    if (steps && steps.length > 0) {
      let nearestIdx = 0;
      let minDiff = Infinity;
      for (let i = 0; i < steps.length; i++) {
        const stepVal = steps[i];
        if (stepVal !== undefined) {
          const diff = Math.abs(stepVal - base);
          if (diff < minDiff) {
            minDiff = diff;
            nearestIdx = i;
          }
        }
      }
      const nextIdx = Math.min(steps.length - 1, nearestIdx + 1);
      const nextVal = steps[nextIdx];
      return commitScale(nextVal !== undefined ? nextVal : base + step, false);
    }
    return commitScale(base + step, false);
  }, [commitScale, displayScale, step, steps]);

  const zoomOut = React.useCallback(() => {
    const base = displayScale;
    if (steps && steps.length > 0) {
      let nearestIdx = 0;
      let minDiff = Infinity;
      for (let i = 0; i < steps.length; i++) {
        const stepVal = steps[i];
        if (stepVal !== undefined) {
          const diff = Math.abs(stepVal - base);
          if (diff < minDiff) {
            minDiff = diff;
            nearestIdx = i;
          }
        }
      }
      const nextIdx = Math.max(0, nearestIdx - 1);
      const nextVal = steps[nextIdx];
      return commitScale(nextVal !== undefined ? nextVal : base - step, false);
    }
    return commitScale(base - step, false);
  }, [commitScale, displayScale, step, steps]);

  const reset = React.useCallback(() => {
    return commitScale(1.0, false);
  }, [commitScale]);

  const zoomInRef = React.useRef(zoomIn);
  zoomInRef.current = zoomIn;
  const zoomOutRef = React.useRef(zoomOut);
  zoomOutRef.current = zoomOut;
  const resetRef = React.useRef(reset);
  resetRef.current = reset;

  // Cleanup timers on unmount
  React.useEffect(() => {
    return () => {
      clearTimer();
      clearDebounceTimer();
    };
  }, [clearDebounceTimer, clearTimer]);

  // Window listeners for wheel and keydown when enableShortcuts is true
  React.useEffect(() => {
    if (!enableShortcuts || typeof window === 'undefined') return;

    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.defaultPrevented) return;
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        target.closest('.monaco-editor, [data-monaco-editor], [data-no-ui-zoom]')
      ) {
        return;
      }
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomInRef.current();
      } else if (e.deltaY > 0) {
        zoomOutRef.current();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.defaultPrevented) return;
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        target.closest('.monaco-editor, [data-monaco-editor], [data-no-ui-zoom]')
      ) {
        return;
      }
      const isInput =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if (isInput) return;

      const key = e.key;
      if (key === '+' || key === '=') {
        e.preventDefault();
        zoomInRef.current();
      } else if (key === '-' || key === '_') {
        e.preventDefault();
        zoomOutRef.current();
      } else if (key === '0') {
        e.preventDefault();
        resetRef.current();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [enableShortcuts]);

  const bind = React.useMemo(
    () => ({
      value: displayScale,
      visible,
      steps,
      autoHideDuration,
      onChange: setScale,
      onStep: (delta: number) => (delta > 0 ? zoomIn() : zoomOut()),
      onReset: reset,
      onVisibilityChange: setVisible,
      onMouseEnter: pauseHide,
      onMouseLeave: resumeHide,
    }),
    [
      autoHideDuration,
      displayScale,
      pauseHide,
      reset,
      resumeHide,
      setScale,
      steps,
      visible,
      zoomIn,
      zoomOut,
    ],
  );

  return {
    scale: displayScale,
    appliedScale: scale,
    visible,
    zoomIn,
    zoomOut,
    reset,
    setScale,
    show,
    hide,
    pauseHide,
    resumeHide,
    bind,
  };
}
