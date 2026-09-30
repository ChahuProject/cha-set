import * as React from 'react';
import { cn } from '../lib/utils';
import type { KbdVariant, KbdSize, KbdCompact, KbdOverflow } from '@chahu/spec/kbd';

export type { KbdVariant, KbdSize, KbdCompact, KbdOverflow };

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  'data-slot'?: string;
  /** Visual presentation variant */
  variant?: KbdVariant;
  /** Size scale of keycap */
  size?: KbdSize;
  /** Whether to convert modifier keys to compact symbols (e.g. Ctrl -> ⌃) */
  compact?: KbdCompact;
  /** Responsive overflow strategy in tight containers */
  overflow?: KbdOverflow;
  /** Serialized shortcut string (e.g. 'Ctrl+Shift+P' or 'Space / Enter') */
  shortcut?: string;
  /** Custom separator string between keys in combinations (default '+') */
  separator?: string;
  /** Test hook for headless hover state */
  forceHover?: boolean;
  /** Test hook for headless active state */
  forceActive?: boolean;
}

const MODIFIER_SYMBOLS: Record<string, string> = {
  ctrl: '⌃',
  control: '⌃',
  shift: '⇧',
  alt: '⌥',
  opt: '⌥',
  option: '⌥',
  cmd: '⌘',
  command: '⌘',
  meta: '⌘',
  win: '⌘',
  enter: '↵',
  return: '↵',
  backspace: '⌫',
  escape: '⎋',
  esc: '⎋',
  tab: '⇥',
  space: '␣',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
  pageup: '⇞',
  pagedown: '⇟',
  delete: '⌦',
  del: '⌦',
};

const STANDARD_MODIFIER_NAMES: Record<string, string> = {
  ctrl: 'Ctrl',
  control: 'Ctrl',
  shift: 'Shift',
  alt: 'Alt',
  opt: 'Alt',
  option: 'Alt',
  cmd: 'Cmd',
  command: 'Cmd',
  meta: 'Cmd',
  win: 'Win',
  enter: 'Enter',
  return: 'Enter',
  backspace: 'Backspace',
  escape: 'Esc',
  esc: 'Esc',
  tab: 'Tab',
  space: 'Space',
  up: 'Up',
  down: 'Down',
  left: 'Left',
  right: 'Right',
  pageup: 'PageUp',
  pagedown: 'PageDown',
  delete: 'Delete',
  del: 'Del',
};

/**
 * Format a single key token according to compact setting.
 */
export function formatKeyToken(rawKey: string, compactMode: boolean): string {
  const trimmed = rawKey.trim();
  const lower = trimmed.toLowerCase();
  if (compactMode && MODIFIER_SYMBOLS[lower]) {
    return MODIFIER_SYMBOLS[lower];
  }
  if (!compactMode && STANDARD_MODIFIER_NAMES[lower]) {
    return STANDARD_MODIFIER_NAMES[lower];
  }
  return trimmed;
}

export interface ParsedKeyToken {
  isMouse: boolean;
  button: 'left' | 'right' | 'middle';
  text: string;
  label?: string;
}

export function parseKeyToken(rawKey: string, compactMode: boolean): ParsedKeyToken {
  const trimmed = rawKey.trim();
  const colonIdx = trimmed.indexOf(':');
  const keyPart = colonIdx >= 0 ? trimmed.substring(0, colonIdx).trim() : trimmed;
  const labelPart = colonIdx >= 0 ? trimmed.substring(colonIdx + 1).trim() : undefined;
  const lower = keyPart.toLowerCase();

  if (lower === 'mouse-left' || lower === 'left-click' || lower === 'lmb' || lower === 'mouse_left') {
    return { isMouse: true, button: 'left', text: 'LMB', label: labelPart };
  }
  if (lower === 'mouse-right' || lower === 'right-click' || lower === 'rmb' || lower === 'mouse_right') {
    return { isMouse: true, button: 'right', text: 'RMB', label: labelPart };
  }
  if (lower === 'mouse-middle' || lower === 'middle-click' || lower === 'mmb' || lower === 'wheel' || lower === 'mouse_middle') {
    return { isMouse: true, button: 'middle', text: 'MMB', label: labelPart };
  }
  if (lower === 'mouse' || lower === 'click') {
    return { isMouse: true, button: 'left', text: 'Click', label: labelPart };
  }
  return { isMouse: false, button: 'left', text: formatKeyToken(trimmed, compactMode), label: labelPart };
}

export function MouseGlyph({
  button = 'left',
  className,
}: {
  button?: 'left' | 'right' | 'middle';
  className?: string;
}) {
  const isLeft = button === 'left';
  const isRight = button === 'right';
  const isMiddle = button === 'middle';

  return (
    <svg
      data-slot="mouse-glyph"
      data-button={button}
      width="11"
      height="15"
      viewBox="0 0 11 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block shrink-0', className)}
    >
      {/* Palm body */}
      <path
        d="M1 6.5V10.5C1 12.9853 3.01472 15 5.5 15C7.98528 15 10 12.9853 10 10.5V6.5H1Z"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Left button */}
      <path
        d="M1 4.5C1 2.567 2.567 1 4.5 1V6.5H1V4.5Z"
        fill={isLeft ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Right button */}
      <path
        d="M6.5 1C8.433 1 10 2.567 10 4.5V6.5H6.5V1Z"
        fill={isRight ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Middle wheel */}
      <rect
        x="4.75"
        y="2.5"
        width="1.5"
        height="2.5"
        rx="0.75"
        fill={isMiddle ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="0.7"
      />
    </svg>
  );
}

/**
 * Parses a shortcut string into branches (split by ' / ') and key tokens (split by '+').
 */
export function parseShortcutString(shortcutStr: string): string[][] {
  if (!shortcutStr || !shortcutStr.trim()) return [];
  const branches = shortcutStr.split(' / ');
  return branches.map((branch) =>
    branch
      .split('+')
      .map((k) => k.trim())
      .filter(Boolean),
  );
}

const variantClasses: Record<KbdVariant, string> = {
  outline:
    'border border-border/80 bg-muted/60 text-foreground shadow-2xs dark:bg-muted/40 dark:border-border/60',
  solid:
    'border border-transparent bg-muted text-foreground shadow-2xs dark:bg-muted/80',
  subtle:
    'border-transparent bg-transparent text-muted-foreground font-normal tracking-wider',
  inverted:
    'border border-current/20 bg-current/15 text-inherit shadow-2xs',
};

const sizeClasses: Record<KbdSize, string> = {
  xs: 'h-4.5 min-w-4.5 px-1 text-micro rounded',
  sm: 'h-5 min-w-5 px-1.5 text-caption rounded-md',
  default: 'h-6 min-w-6 px-2 text-xs rounded-md',
  md: 'h-6 min-w-6 px-2 text-xs rounded-md',
};

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  (
    {
      variant = 'outline',
      size = 'default',
      compact = 'auto',
      overflow = 'collapse',
      shortcut,
      separator = '+',
      className,
      children,
      forceHover,
      forceActive,
      'data-slot': dataSlot,
      ...props
    },
    ref,
  ) => {
    const isCompact = compact === 'always';
    const isSubtle = variant === 'subtle';

    // Overflow handling class
    const overflowClasses =
      overflow === 'hide'
        ? 'hidden sm:inline-flex'
        : overflow === 'collapse'
          ? 'shrink-0'
          : 'shrink-0';

    // If a shortcut string is provided, parse and render key combinations
    if (shortcut) {
      const branches = parseShortcutString(shortcut);
      if (branches.length === 0) return null;

      return (
        <span
          ref={ref as React.Ref<HTMLSpanElement>}
          data-slot={dataSlot ?? 'kbd-group'}
          data-variant={variant}
          data-size={size}
          className={cn(
            'inline-flex items-center gap-1.5 font-mono select-none',
            overflowClasses,
            className,
          )}
          {...props}
        >
          {branches.map((keys, branchIdx) => (
            <React.Fragment key={`branch-${branchIdx}-${keys.join('-')}`}>
              {branchIdx > 0 && (
                <span className="text-muted-foreground text-micro font-sans font-normal px-0.5">
                  or
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                {isSubtle && !keys.some((k) => parseKeyToken(k, isCompact).isMouse) ? (
                  <span
                    className={cn(
                      'inline-flex items-center text-muted-foreground font-mono tracking-widest',
                      size === 'xs' ? 'text-micro' : size === 'sm' ? 'text-caption' : 'text-xs',
                    )}
                  >
                    {keys
                      .map((k) => formatKeyToken(k, isCompact))
                      .join(isCompact ? '' : separator)}
                  </span>
                ) : (
                  keys.map((k, keyIdx) => {
                    const parsed = parseKeyToken(k, isCompact);
                    return (
                      <React.Fragment key={`key-${keyIdx}-${k}`}>
                        {keyIdx > 0 && !isCompact && (
                          <span className="text-muted-foreground text-nano px-0.2 select-none">
                            {separator}
                          </span>
                        )}
                        <kbd
                          data-slot="kbd"
                          data-variant={variant}
                          data-size={size}
                          data-is-mouse={parsed.isMouse ? true : undefined}
                          className={cn(
                            'inline-flex items-center justify-center font-mono font-medium leading-none select-none transition-colors duration-quick ease-standard gap-1',
                            variantClasses[variant],
                            sizeClasses[size],
                            forceHover && 'border-primary/50 text-foreground',
                            forceActive && 'bg-accent text-accent-foreground',
                          )}
                        >
                          {parsed.isMouse && <MouseGlyph button={parsed.button} />}
                          {(!parsed.isMouse || parsed.label) && (
                            <span>{parsed.isMouse ? parsed.label : parsed.text}</span>
                          )}
                        </kbd>
                      </React.Fragment>
                    );
                  })
                )}
              </span>
            </React.Fragment>
          ))}
        </span>
      );
    }

    // Direct children keycap rendering: apply formatKeyToken if compact === 'always'
    const renderedContent =
      compact === 'always' && typeof children === 'string'
        ? formatKeyToken(children, true)
        : children;

    if (isSubtle) {
      return (
        <span
          ref={ref as React.Ref<HTMLSpanElement>}
          data-slot={dataSlot ?? 'kbd'}
          data-variant={variant}
          data-size={size}
          className={cn(
            'inline-flex items-center font-mono tracking-widest text-muted-foreground select-none',
            size === 'xs' ? 'text-micro' : size === 'sm' ? 'text-caption' : 'text-xs',
            overflowClasses,
            className,
          )}
          {...props}
        >
          {renderedContent}
        </span>
      );
    }

    return (
      <kbd
        ref={ref}
        data-slot={dataSlot ?? 'kbd'}
        data-variant={variant}
        data-size={size}
        className={cn(
          'inline-flex items-center justify-center font-mono font-medium leading-none select-none transition-colors duration-quick ease-standard',
          variantClasses[variant],
          sizeClasses[size],
          overflowClasses,
          forceHover && 'border-primary/50 text-foreground',
          forceActive && 'bg-accent text-accent-foreground',
          className,
        )}
        {...props}
      >
        {renderedContent}
      </kbd>
    );
  },
);

Kbd.displayName = 'Kbd';
