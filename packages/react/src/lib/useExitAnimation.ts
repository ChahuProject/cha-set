import * as React from 'react';

/**
 * Minimal exit-animation state machine for surfaces that unmount on close
 * (custom Dialog/DraggableModal). Keeps the subtree mounted during the exit
 * phase so CSS `animate-out` classes can play, then unmounts.
 *
 * Typical usage:
 *   const { visible, exiting } = useExitAnimation(open, 180);
 *   if (!visible) return null;
 *   return <div className={exiting ? 'animate-fade-out' : 'animate-fade-in'} />
 *
 * @param open - current open state from the controlling context/state.
 * @param exitDurationMs - length of the CSS exit animation (should match the
 *   duration token used by the `animate-out` class; closest at ~ short + buffer).
 * @returns
 *   - visible: whether the subtree should be rendered at all.
 *   - exiting: true while closing, i.e. the exit animation is in flight.
 */
export function useExitAnimation(open: boolean, exitDurationMs = 180) {
  const [visible, setVisible] = React.useState(open);
  const [exiting, setExiting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setVisible(true);
      setExiting(false);
    } else if (visible) {
      setExiting(true);
    }
  }, [open, visible]);

  React.useEffect(() => {
    if (!exiting) return;
    const t = window.setTimeout(() => {
      setVisible(false);
      setExiting(false);
    }, exitDurationMs);
    return () => window.clearTimeout(t);
  }, [exiting, exitDurationMs]);

  return { visible, exiting };
}