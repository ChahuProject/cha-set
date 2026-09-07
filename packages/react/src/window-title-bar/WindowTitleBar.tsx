import * as React from 'react';
import { cn } from '../lib/utils';

export interface WindowTitleBarProps {
  /** Application or window title */
  title?: React.ReactNode;
  /** Leading app icon */
  icon?: React.ReactNode;
  /** Optional subtitle */
  subtitle?: React.ReactNode;
  /** Center slot, e.g. search capsule / command palette */
  centerSlot?: React.ReactNode;
  /** Whether the host window is maximized */
  isMaximized?: boolean;
  /** Whether the window currently has focus */
  isFocused?: boolean;
  /** Callback to minimize window */
  onMinimize?: () => void;
  /** Callback to maximize or restore window */
  onMaximize?: () => void;
  /** Callback to close window */
  onClose?: () => void;
  /** Double click on header bar */
  onDoubleClick?: (e: React.MouseEvent) => void;
  /** Minimize button tooltip */
  minimizeTitle?: string;
  /** Maximize button tooltip */
  maximizeTitle?: string;
  /** Restore button tooltip */
  restoreTitle?: string;
  /** Close button tooltip */
  closeTitle?: string;
  /** Whether to render caption buttons */
  showControls?: boolean;
  /** Extra controls to render before the caption buttons */
  extraControls?: React.ReactNode;
  className?: string;
}

export function WindowTitleBar({
  title,
  icon,
  subtitle,
  centerSlot,
  isMaximized = false,
  isFocused = true,
  onMinimize,
  onMaximize,
  onClose,
  onDoubleClick,
  minimizeTitle = 'Minimize',
  maximizeTitle = 'Maximize',
  restoreTitle = 'Restore',
  closeTitle = 'Close',
  showControls = true,
  extraControls,
  className,
}: WindowTitleBarProps) {
  const handleDoubleClick = (e: React.MouseEvent) => {
    onDoubleClick?.(e);
    if (!e.defaultPrevented) {
      onMaximize?.();
    }
  };

  return (
    <header
      data-slot="window-title-bar"
      onDoubleClick={handleDoubleClick}
      className={cn(
        'flex h-10 select-none items-center justify-between bg-transparent flex-shrink-0 transition-opacity duration-200',
        isFocused ? 'opacity-100' : 'opacity-60',
        className,
      )}
    >
      {/* Left title info & drag region */}
      <div
        data-slot="window-drag-region"
        className="flex h-full flex-1 items-center gap-2 px-3 text-xs text-muted-foreground min-w-0"
      >
        {icon && <div className="pointer-events-none flex shrink-0 items-center justify-center">{icon}</div>}
        {title && (
          <span className="pointer-events-none truncate font-medium text-foreground/85">
            {title}
          </span>
        )}
        {subtitle && (
          <span className="pointer-events-none hidden truncate text-muted-foreground/70 sm:inline">
            {subtitle}
          </span>
        )}
      </div>

      {/* Center slot */}
      {centerSlot && (
        <div className="flex shrink-0 items-center justify-center px-2">
          {centerSlot}
        </div>
      )}

      {/* Right caption controls */}
      <div className="flex h-full flex-shrink-0 items-center">
        {extraControls}

        {showControls && (
          <>
            <button
              type="button"
              className="flex h-full w-[2.875rem] cursor-default items-center justify-center border-none bg-transparent text-foreground/70 transition-colors hover:bg-muted/70 hover:text-foreground"
              title={minimizeTitle}
              aria-label={minimizeTitle}
              onClick={onMinimize}
              onDoubleClick={(e) => e.stopPropagation()}
            >
              <svg className="h-[0.0625rem] w-2.5" viewBox="0 0 10 1" aria-hidden="true" preserveAspectRatio="none">
                <rect width="10" height="1" fill="currentColor" />
              </svg>
            </button>

            <button
              type="button"
              className="flex h-full w-[2.875rem] cursor-default items-center justify-center border-none bg-transparent text-foreground/70 transition-colors hover:bg-muted/70 hover:text-foreground"
              title={isMaximized ? restoreTitle : maximizeTitle}
              aria-label={isMaximized ? restoreTitle : maximizeTitle}
              onClick={onMaximize}
              onDoubleClick={(e) => e.stopPropagation()}
            >
              {isMaximized ? (
                <svg className="size-2.5" viewBox="0 0 10 10" aria-hidden="true">
                  <rect x="2" y="0" width="8" height="8" rx="0.5" ry="0.5" fill="none" stroke="currentColor" strokeWidth="1" />
                  <rect x="0" y="2" width="8" height="8" rx="0.5" ry="0.5" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              ) : (
                <svg className="size-2.5" viewBox="0 0 10 10" aria-hidden="true">
                  <rect x="0.5" y="0.5" width="9" height="9" rx="0.5" ry="0.5" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className="flex h-full w-[2.875rem] cursor-default items-center justify-center border-none bg-transparent text-foreground/70 transition-colors hover:bg-[#e81123] hover:text-white"
              title={closeTitle}
              aria-label={closeTitle}
              onClick={onClose}
              onDoubleClick={(e) => e.stopPropagation()}
            >
              <svg className="size-2.5" viewBox="0 0 10 10" aria-hidden="true">
                <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1" />
                <line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
