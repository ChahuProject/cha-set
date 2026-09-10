import * as React from 'react';
import { cn } from '../lib/utils';

export interface SettingRowProps extends React.HTMLAttributes<HTMLDivElement> {
  name: React.ReactNode;
  description?: React.ReactNode;
  highlightId?: string;
  highlightTarget?: string;
  highlight?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const SettingRow = React.forwardRef<HTMLDivElement, SettingRowProps>(
  (
    {
      name,
      description,
      highlightId,
      highlightTarget,
      highlight = false,
      disabled = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isTargetMatched =
      Boolean(highlightTarget) && Boolean(highlightId) && highlightTarget === highlightId;
    const isHighlighted = highlight || isTargetMatched;

    return (
      <div
        ref={ref}
        id={highlightId}
        className={cn(
          'relative flex items-center justify-between gap-4 py-3 px-3 rounded-lg transition-all',
          isHighlighted && 'ring-2 ring-primary/80 bg-primary/5 animate-pulse',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-1 min-w-0 flex-1 pr-2">
          <div className="text-sm font-medium text-foreground leading-snug">
            {name}
          </div>
          {description && (
            <div className="text-xs text-muted-foreground leading-normal">
              {description}
            </div>
          )}
        </div>

        {children && (
          <div className="flex items-center justify-end shrink-0 gap-2">
            {children}
          </div>
        )}
      </div>
    );
  }
);

SettingRow.displayName = 'SettingRow';
