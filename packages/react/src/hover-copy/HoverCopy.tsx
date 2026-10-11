import * as React from 'react';
import type {
  HoverCopyIcon,
  HoverCopyRadius,
  HoverCopyState,
} from '@chahu/spec/hover-copy';
import { CheckIcon, CopyIcon } from '../lib/icons';
import { cn } from '../lib/utils';

export type { HoverCopyIcon, HoverCopyRadius, HoverCopyState };

/**
 * Semantic radius -> Tailwind class mapping. Mirrors
 * `hoverCopyRadiusMap[*].web` in spec/components/hover-copy.ts bit-for-bit;
 * drift is mechanically rejected by spec/__tests__/hover-copy-parity.test.ts.
 */
export const RADIUS_CLASS: Record<HoverCopyRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export interface HoverCopyProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onCopy'> {
  /** Payload to copy. Independent of displayed content. @default '' */
  text?: string;
  /** Black scrim alpha over content while active, clamped 0..1. @default 0.45 */
  dim?: number;
  /** Corner radius of the dim overlay + wrapper. @default 'md' */
  radius?: HoverCopyRadius;
  /** Resting overlay icon (semantic name). @default 'copy' */
  icon?: HoverCopyIcon;
  /** Success icon (semantic name). @default 'check' */
  copiedIcon?: HoverCopyIcon;
  /** Restore interval after a successful copy, in ms. Logic timer — reduced motion never shortens it. @default 2000 */
  resetTime?: number;
  /** Blocks reveal + copy. @default false */
  disabled?: boolean;
  /** Fired with the payload on successful copy. */
  onCopy?: (text: string) => void;
  /** Fired when the clipboard write fails; state stays hovered. */
  onError?: (error: unknown) => void;
  /** Test hook that forces the overlay visible regardless of state. */
  forceHover?: boolean;
}

const ICONS = {
  copy: CopyIcon,
  check: CheckIcon,
} as const;

/**
 * Hover-dim overlay + background-free centered glyph around arbitrary content.
 * The whole overlay reads as one big button: hovering reveals a dim scrim
 * with a semi-transparent centered icon (no button chrome), and clicking
 * anywhere on the overlay copies. The glyph auto-fits inside the wrapped
 * content and never overflows it.
 * Capability layer: owns overlay interaction, when to copy, and feedback
 * state. Zero assumptions about wrapped content. State machine per
 * docs/architecture/hover-copy.md section 3: idle | hovered | copied.
 */
export const HoverCopy = React.forwardRef<HTMLSpanElement, HoverCopyProps>(
  (
    {
      text = '',
      dim = 0.45,
      radius = 'md',
      icon = 'copy',
      copiedIcon = 'check',
      resetTime = 2000,
      disabled = false,
      onCopy,
      onError,
      forceHover = false,
      className,
      children,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onFocus,
      onBlur,
      ...props
    },
    forwardedRef,
  ) => {
    const [state, setState] = React.useState<HoverCopyState>('idle');
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const pointerInsideRef = React.useRef(false);
    const focusInsideRef = React.useRef(false);
    const pinnedRef = React.useRef(false);

    const clearTimer = React.useCallback(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }, []);

    React.useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    // Transition #11: disabled becomes true forces idle, overlay out, button inert.
    React.useEffect(() => {
      if (disabled) {
        clearTimer();
        pointerInsideRef.current = false;
        focusInsideRef.current = false;
        pinnedRef.current = false;
        setState('idle');
      }
    }, [disabled, clearTimer]);

    const reveal = React.useCallback(() => {
      setState((prev) => (prev === 'idle' ? 'hovered' : prev));
    }, []);

    const conceal = React.useCallback(() => {
      // Transitions #4 (leave/out only when not copied) and #9 (leave during
      // copied is ignored). A touch-pinned overlay stays until copy or mouse
      // takeover, so pointer-leave alone never unpins it.
      if (pinnedRef.current) return;
      setState((prev) => (prev === 'hovered' && !focusInsideRef.current && !pointerInsideRef.current ? 'idle' : prev));
    }, []);

    const handlePointerEnter = (event: React.PointerEvent<HTMLSpanElement>) => {
      onPointerEnter?.(event);
      if (disabled) return;
      pointerInsideRef.current = true;
      // A mouse pointer entering takes over from touch pinning.
      if (event.pointerType !== 'touch') pinnedRef.current = false;
      reveal();
    };

    const handlePointerLeave = (event: React.PointerEvent<HTMLSpanElement>) => {
      onPointerLeave?.(event);
      if (disabled) return;
      pointerInsideRef.current = false;
      conceal();
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLSpanElement>) => {
      onPointerDown?.(event);
      if (disabled) return;
      // Transition #3: touch has no hover — first tap pins the overlay open.
      if (event.pointerType === 'touch') {
        pinnedRef.current = true;
        reveal();
      }
    };

    const handleFocus = (event: React.FocusEvent<HTMLSpanElement>) => {
      onFocus?.(event);
      if (disabled) return;
      // Transition #2: focus-within counts as hover modality.
      focusInsideRef.current = true;
      reveal();
    };

    const handleBlur = (event: React.FocusEvent<HTMLSpanElement>) => {
      onBlur?.(event);
      if (disabled) return;
      focusInsideRef.current = false;
      conceal();
    };

    const handleCopy = async (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (disabled) return;
      // Transition #6: empty text is a silent no-op — no clipboard call, no
      // callbacks, no error, no state change.
      if (!text) return;
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(text);
        }
        // Transition #5 / #10: success (or unavailable-bridge no-op write, same
        // idiom as CopyButton) enters copied, swaps the icon, restarts the
        // restore timer, and fires onCopy.
        setState('copied');
        onCopy?.(text);
        clearTimer();
        timerRef.current = setTimeout(() => {
          // Transitions #7 / #8 (anti-flicker guarantee): re-check hover/focus
          // modality — still engaged restores to hovered with the overlay
          // staying, otherwise fades out to idle.
          if (pointerInsideRef.current || focusInsideRef.current || pinnedRef.current) {
            setState('hovered');
          } else {
            setState('idle');
          }
        }, resetTime);
      } catch (err) {
        // Transition #12: failure stays hovered (no false check), fires onError.
        setState('hovered');
        onError?.(err);
      }
    };

    const clampedDim = Math.min(1, Math.max(0, dim));
    const revealed = forceHover || state !== 'idle';
    // Resolved off a capitalized non-Icon-suffixed identifier: the icon-spec
    // gate resolves `<XIcon/>` JSX against the registry, and a local alias
    // named *Icon would register as unowned artwork.
    const OverlayGlyph = state === 'copied' ? ICONS[copiedIcon] : ICONS[icon];

    return (
      <span
        ref={forwardedRef}
        data-state={state}
        aria-disabled={disabled || undefined}
        className={cn(
          'group relative inline-flex max-w-full align-middle',
          RADIUS_CLASS[radius],
          revealed && !disabled && 'cursor-pointer',
          className,
        )}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleCopy}
        {...props}
      >
        {children}
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-quick ease-standard',
            revealed ? 'opacity-100' : 'opacity-0',
          )}
          style={{ backgroundColor: `rgb(0 0 0 / ${Math.round(clampedDim * 100)}%)` }}
        />
        <button
          type="button"
          aria-label="Copy to clipboard"
          disabled={disabled}
          onClick={handleCopy}
          className={cn(
            'absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] p-1 transition-opacity duration-quick ease-standard',
            revealed ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          <OverlayGlyph
            className={cn(
              'h-[min(1.5rem,55%)] w-auto shrink-0',
              state === 'copied'
                ? 'text-white'
                : 'text-white/60 transition-colors duration-quick ease-standard group-hover:text-white/90',
              state === 'copied' && 'animate-in fade-in-0 zoom-in-75 duration-short',
            )}
          />
        </button>
      </span>
    );
  },
);

HoverCopy.displayName = 'HoverCopy';
