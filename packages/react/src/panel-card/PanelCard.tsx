import * as React from 'react';
import { cn } from '../lib/utils';

export interface PanelCardProps extends React.ComponentProps<'div'> {
  /** Size variant: standard or compact */
  size?: 'default' | 'sm';
}

export function PanelCard({ className, size = 'default', ...props }: PanelCardProps) {
  return (
    <div
      data-slot="panel-card"
      data-size={size}
      className={cn(
        'group/panel-card flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card text-sm text-card-foreground shadow-none',
        size === 'sm' && 'text-xs',
        className,
      )}
      {...props}
    />
  );
}

export interface PanelCardHeaderProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  /** Whether to render a tinted header background (default: true) */
  tinted?: boolean;
}

export function PanelCardHeader({
  className,
  icon,
  title,
  description,
  action,
  tinted = true,
  children,
  ...props
}: PanelCardHeaderProps) {
  return (
    <div
      data-slot="panel-card-header"
      className={cn(
        'flex items-center justify-between gap-3 border-b border-border/50 px-4 py-3',
        tinted && 'bg-muted/20',
        className,
      )}
      {...props}
    >
      {children || (
        <>
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              {icon && <span className="shrink-0 text-muted-foreground">{icon}</span>}
              {title && <span className="truncate">{title}</span>}
            </div>
            {description && (
              <p className="text-[0.6875rem] text-muted-foreground leading-normal">
                {description}
              </p>
            )}
          </div>
          {action && <div className="flex shrink-0 items-center gap-1.5">{action}</div>}
        </>
      )}
    </div>
  );
}

export function PanelCardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="panel-card-content"
      className={cn('p-4 text-xs', className)}
      {...props}
    />
  );
}

export function PanelCardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="panel-card-footer"
      className={cn(
        'flex items-center justify-between border-t border-border/50 bg-muted/10 px-4 py-2.5 text-xs text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}
