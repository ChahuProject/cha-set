import * as React from 'react';
import { cn } from '../lib/utils';
import { Kbd, type KbdProps } from './Kbd';

export interface ShortcutProps extends Omit<KbdProps, 'value'> {
  /** Shortcut string value (alias for shortcut prop, e.g. '⌘K' or 'Ctrl+S') */
  value?: string;
}

/**
 * Shortcut component tailored for trailing placement in dropdown items,
 * context menus, search palettes, and toolbars.
 * Enforces right alignment (ml-auto), non-shrinking, and responsive layout safety.
 */
export const Shortcut = React.forwardRef<HTMLElement, ShortcutProps>(
  (
    {
      value,
      shortcut,
      variant = 'subtle',
      size = 'xs',
      compact = 'auto',
      overflow = 'collapse',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const effectiveShortcut = shortcut ?? value;

    return (
      <Kbd
        ref={ref}
        data-slot="shortcut"
        variant={variant}
        size={size}
        compact={compact}
        overflow={overflow}
        shortcut={effectiveShortcut}
        className={cn(
          'ml-auto shrink-0 select-none tracking-widest text-muted-foreground',
          className,
        )}
        {...props}
      >
        {children}
      </Kbd>
    );
  },
);

Shortcut.displayName = 'Shortcut';
