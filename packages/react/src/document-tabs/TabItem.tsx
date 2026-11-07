import * as React from 'react';
import { forwardRef } from 'react';
import { cn } from '../lib/utils';
import { WindowCloseIcon } from '../lib/icons.generated';
import { useChaSetI18n } from '../i18n';

export type TabWidthMode = 'content' | 'fixed';

export interface TabItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  selected?: boolean;
  canClose?: boolean;
  useShellChrome?: boolean;
  tabWidthMode?: TabWidthMode;
  tabMinWidth?: number | string;
  tabMaxWidth?: number | string;
  tooltipText?: string;
  tooltipDescription?: string;
  onClose?: (e: React.MouseEvent) => void;
  onMiddleClick?: (e: React.MouseEvent) => void;
}

export const TabItem = forwardRef<HTMLButtonElement, TabItemProps>(function TabItem(
  {
    text,
    selected = false,
    canClose = true,
    useShellChrome = false,
    tabWidthMode = 'content',
    tabMinWidth,
    tabMaxWidth,
    tooltipText,
    tooltipDescription,
    onClose,
    onMiddleClick,
    onContextMenu,
    onClick,
    onMouseDown,
    disabled = false,
    className,
    children,
    ...props
  },
  ref,
) {
  const { t } = useChaSetI18n();
  const displayText = text || (typeof children === 'string' ? children : '');

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.button === 1) {
      e.preventDefault();
      onMiddleClick?.(e);
      return;
    }
    onMouseDown?.(e);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!disabled) {
      onClose?.(e);
    }
  };

  const isFixed = tabWidthMode === 'fixed';

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-disabled={disabled}
      disabled={disabled}
      title={tooltipText || displayText}
      onMouseDown={handleMouseDown}
      onContextMenu={onContextMenu}
      onClick={onClick}
      className={cn(
        'group relative inline-flex items-center justify-between h-8 px-2.5 rounded-md border text-xs select-none transition-all duration-150',
        disabled
          ? 'cursor-not-allowed opacity-50 bg-transparent border-transparent text-muted-foreground'
          : 'cursor-pointer',
        !disabled && selected
          ? useShellChrome
            ? 'bg-card text-foreground border-border shadow-xs'
            : 'bg-card text-foreground border-primary/20 shadow-xs'
          : !disabled && 'bg-transparent text-muted-foreground border-transparent hover:bg-muted/50 hover:text-foreground',
        isFixed
          ? 'w-44 shrink-0'
          : 'w-auto max-w-[15rem] min-w-[3.5rem] shrink-0',
        className,
      )}
      style={{
        minWidth: tabMinWidth,
        maxWidth: tabMaxWidth,
      }}
      {...props}
    >
      <span className={cn('truncate text-left', canClose ? 'mr-1.5' : 'mx-auto')}>
        {displayText || children}
      </span>

      {canClose && (
        <span
          role="button"
          tabIndex={-1}
          aria-label={t('common.close', 'Close')}
          onClick={handleClose}
          className={cn(
            'size-4 rounded-full inline-flex items-center justify-center shrink-0 transition-colors',
            disabled
              ? 'cursor-not-allowed opacity-40'
              : 'cursor-pointer text-muted-foreground hover:bg-destructive/15 hover:text-destructive group-hover:text-foreground',
          )}
        >
          <WindowCloseIcon className="size-2.5" />
        </span>
      )}
    </button>
  );
});

TabItem.displayName = 'TabItem';
