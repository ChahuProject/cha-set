import '@testing-library/jest-dom/vitest';

if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// jsdom implements no part of the Web Animations API, so `getAnimations` is
// absent. Base UI's ScrollArea viewport calls it unconditionally when settling a
// scroll gesture, which surfaces as an unhandled TypeError and a non-zero test
// exit; the stub keeps that call site safe.
if (typeof window !== 'undefined' && typeof window.Element !== 'undefined' && !window.Element.prototype.getAnimations) {
  window.Element.prototype.getAnimations = function getAnimations() {
    return [];
  };
}

// Defining `getAnimations` above is not free: Base UI's `useAnimationsFinished`
// branches on whether the method exists, and when it does it waits for exit
// animations to finish before unmounting popups. Under jsdom nothing ever
// finishes, so dialogs / menus would stay mounted past the synchronous
// assertions in the interaction tests. This flag is Base UI's supported opt-out
// and restores immediate (synchronous) unmounting, which is what a
// no-animations environment actually behaves like.
(globalThis as { BASE_UI_ANIMATIONS_DISABLED?: boolean }).BASE_UI_ANIMATIONS_DISABLED = true;
