import * as React from 'react';
import { cn } from '../lib/utils';
import { Badge } from '../badge';

export interface SettingRowProps extends React.HTMLAttributes<HTMLDivElement> {
  name: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  highlightId?: string;
  highlightTarget?: string;
  highlight?: boolean;
  disabled?: boolean;
  size?: 'default' | 'sm';
  children?: React.ReactNode;
}

export const SettingRow = React.forwardRef<HTMLDivElement, SettingRowProps>(
  (
    {
      name,
      description,
      icon,
      badge,
      highlightId,
      highlightTarget,
      highlight = false,
      disabled = false,
      size = 'default',
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isTargetMatched =
      Boolean(highlightTarget) && Boolean(highlightId) && highlightTarget === highlightId;
    const isHighlighted = highlight || isTargetMatched;
    const isSm = size === 'sm';

    return (
      <div
        ref={ref}
        id={highlightId}
        data-slot="setting-row"
        data-size={size}
        className={cn(
          'relative flex items-center justify-between gap-3 rounded-lg transition-all',
          isSm ? 'py-2 px-2.5' : 'py-3 px-3',
          isHighlighted && 'ring-2 ring-primary/80 bg-primary/5 animate-pulse',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
          {icon && (
            <div
              data-slot="setting-icon"
              className={cn(
                'inline-flex shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground',
                isSm ? 'size-7 text-xs' : 'size-8 text-sm'
              )}
            >
              {icon}
            </div>
          )}

          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'font-medium text-foreground leading-snug',
                  isSm ? 'text-xs' : 'text-sm'
                )}
              >
                {name}
              </span>
              {badge && (
                <div data-slot="setting-badge">
                  {typeof badge === 'string' || typeof badge === 'number' ? (
                    <Badge variant="secondary" size="sm">
                      {badge}
                    </Badge>
                  ) : (
                    badge
                  )}
                </div>
              )}
            </div>
            {description && (
              <div
                className={cn(
                  'text-muted-foreground leading-normal',
                  isSm ? 'text-[0.6875rem]' : 'text-xs'
                )}
              >
                {description}
              </div>
            )}
          </div>
        </div>

        {children && (
          <div
            data-slot="setting-controls"
            className="flex items-center justify-end shrink-0 gap-2"
          >
            {children}
          </div>
        )}
      </div>
    );
  }
);

SettingRow.displayName = 'SettingRow';

