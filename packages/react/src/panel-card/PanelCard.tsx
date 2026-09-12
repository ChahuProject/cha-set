import * as React from 'react';
import { Badge } from '../badge/Badge';
import { Button } from '../button/Button';
import { ChevronDownIcon } from '../lib/icons';
import { cn } from '../lib/utils';

export interface PanelCardProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Size variant: standard or compact */
  size?: 'default' | 'sm';
  /** Optional convenience title */
  title?: React.ReactNode;
  /** Optional icon displayed in convenience header */
  icon?: React.ReactNode;
  /** Optional description displayed in convenience header */
  description?: React.ReactNode;
  /** Optional badge text displayed next to convenience title */
  badgeText?: string;
  /** Whether the panel can be collapsed */
  collapsible?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
  /** Callback fired on collapse state change */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Optional action slot in convenience header */
  actions?: React.ReactNode;
}

export function PanelCard({
  className,
  size = 'default',
  title,
  icon,
  description,
  badgeText,
  collapsible = false,
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  actions,
  children,
  ...props
}: PanelCardProps) {
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = React.useState(defaultCollapsed);
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : uncontrolledCollapsed;

  const handleToggle = () => {
    if (!collapsible) return;
    const next = !isCollapsed;
    setUncontrolledCollapsed(next);
    onCollapsedChange?.(next);
  };

  const hasConvenienceHeader = title !== undefined || collapsible || badgeText !== undefined;

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
    >
      {hasConvenienceHeader ? (
        <>
          <PanelCardHeader
            icon={icon}
            title={
              <div className="flex items-center gap-2">
                {title}
                {badgeText && (
                  <Badge variant="secondary" size="sm">
                    {badgeText}
                  </Badge>
                )}
              </div>
            }
            description={description}
            action={
              <div className="flex items-center gap-1.5">
                {actions}
                {collapsible && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
                    onClick={handleToggle}
                    className="size-6 text-muted-foreground hover:text-foreground"
                  >
                    <ChevronDownIcon
                      className={cn(
                        'size-3.5 transition-transform duration-short ease-standard',
                        isCollapsed && '-rotate-90',
                      )}
                    />
                  </Button>
                )}
              </div>
            }
          />
          {!isCollapsed && (
            <PanelCardContent className="p-4">{children}</PanelCardContent>
          )}
        </>
      ) : (
        children
      )}
    </div>
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
