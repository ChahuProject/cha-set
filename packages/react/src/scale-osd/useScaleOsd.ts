import * as React from 'react';
import { CANONICAL_SCALE_STEPS } from '@chahu/spec/scale-osd';

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
  /** Callback fired when scale changes */
  onChange?: (scale: number) => void;
}

export function useScaleOsd(options: UseScaleOsdOptions = {}) {
  const {
    value,
    defaultValue = 1.0,
    steps = CANONICAL_SCALE_STEPS,
    step = 0.1,
    min = steps && steps.length > 0 ? steps[0] : 0.2,
    max = steps && steps.length > 0 ? steps[steps.length - 1] : 5.0,
    autoHideDuration = 1400,
    enableShortcuts = true,
    onChange,
  } = options;

  const isControlled = value !== undefined;
  const [internalScale, setInternalScale] = React.useState<number>(defaultValue);
  const scale = isControlled ? value : internalScale;

  const [visible, setVisible] = React.useState<boolean>(false);
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveredRef = React.useRef<boolean>(false);

  const clearTimer = React.useCallback(() => {
    if (hideTimerRef.current != null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
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
    (nextScale: number) => {
      const clamped = Math.max(min, Math.min(max, Math.round(nextScale * 100) / 100));
      if (!isControlled) {
        setInternalScale(clamped);
      }
      onChange?.(clamped);
      show();
      return clamped;
    },
    [isControlled, max, min, onChange, show],
  );

  const zoomIn = React.useCallback(() => {
    if (steps && steps.length > 0) {
      let nearestIdx = 0;
      let minDiff = Infinity;
      for (let i = 0; i < steps.length; i++) {
        const diff = Math.abs(steps[i] - scale);
        if (diff < minDiff) {
          minDiff = diff;
          nearestIdx = i;
        }
      }
      const nextIdx = Math.min(steps.length - 1, nearestIdx + 1);
      return commitScale(steps[nextIdx]);
    }
    return commitScale(scale + step);
  }, [commitScale, scale, step, steps]);

  const zoomOut = React.useCallback(() => {
    if (steps && steps.length > 0) {
      let nearestIdx = 0;
      let minDiff = Infinity;
      for (let i = 0; i < steps.length; i++) {
        const diff = Math.abs(steps[i] - scale);
        if (diff < minDiff) {
          minDiff = diff;
          nearestIdx = i;
        }
      }
      const nextIdx = Math.max(0, nearestIdx - 1);
      return commitScale(steps[nextIdx]);
    }
    return commitScale(scale - step);
  }, [commitScale, scale, step, steps]);

  const reset = React.useCallback(() => {
    return commitScale(1.0);
  }, [commitScale]);

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
        zoomIn();
      } else if (e.deltaY > 0) {
        zoomOut();
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
        zoomIn();
      } else if (key === '-' || key === '_') {
        e.preventDefault();
        zoomOut();
      } else if (key === '0') {
        e.preventDefault();
        reset();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      clearTimer();
    };
  }, [clearTimer, enableShortcuts, reset, zoomIn, zoomOut]);

  const bind = React.useMemo(
    () => ({
      value: scale,
      visible,
      steps,
      autoHideDuration,
      onChange: commitScale,
      onStep: (delta: number) => (delta > 0 ? zoomIn() : zoomOut()),
      onReset: reset,
      onVisibilityChange: setVisible,
      onMouseEnter: pauseHide,
      onMouseLeave: resumeHide,
    }),
    [
      autoHideDuration,
      commitScale,
      pauseHide,
      reset,
      resumeHide,
      scale,
      steps,
      visible,
      zoomIn,
      zoomOut,
    ],
  );

  return {
    scale,
    visible,
    zoomIn,
    zoomOut,
    reset,
    setScale: commitScale,
    show,
    hide,
    pauseHide,
    resumeHide,
    bind,
  };
}
