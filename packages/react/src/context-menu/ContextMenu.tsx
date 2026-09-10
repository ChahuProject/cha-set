import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import * as React from 'react';
import { cn } from '../lib/utils';
import { CheckIcon, ChevronRightIcon } from '../lib/icons';

export interface ContextMenuProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.Root> {}

export function ContextMenuRoot({ ...props }: ContextMenuProps) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

export interface ContextMenuTriggerProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.Trigger> {
  asChild?: boolean;
}

export function ContextMenuTrigger({
  render,
  asChild = false,
  children,
  ...props
}: ContextMenuTriggerProps) {
  const renderProp =
    render ?? (asChild && React.isValidElement(children) ? children : undefined);
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      render={renderProp}
      {...props}
    >
      {renderProp === children ? undefined : children}
    </ContextMenuPrimitive.Trigger>
  );
}

export interface ContextMenuPortalProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.Portal> {}

export function ContextMenuPortal({ ...props }: ContextMenuPortalProps) {
  return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />;
}

export interface ContextMenuContentProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.Popup> {
  alignOffset?: number;
  collisionPadding?: number;
}

export function ContextMenuContent({
  className,
  alignOffset = 0,
  collisionPadding = 8,
  ...props
}: ContextMenuContentProps) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          className={cn(
            'z-50 min-w-36 origin-(--transform-origin) overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md duration-100 outline-none',
            'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
            'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            className,
          )}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

export interface ContextMenuItemProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.Item> {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}

export function ContextMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: ContextMenuItemProps) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-variant={variant}
      data-inset={inset}
      className={cn(
        'relative flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-foreground outline-hidden select-none transition-colors',
        'focus:bg-accent focus:text-accent-foreground',
        'data-inset:pl-8',
        'data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        className,
      )}
      {...props}
    />
  );
}

export interface ContextMenuGroupProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.Group> {}

export function ContextMenuGroup({ ...props }: ContextMenuGroupProps) {
  return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
}

export interface ContextMenuLabelProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.GroupLabel> {
  inset?: boolean;
}

export function ContextMenuLabel({
  className,
  inset,
  ...props
}: ContextMenuLabelProps) {
  return (
    <ContextMenuPrimitive.GroupLabel
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        'px-2 py-1.5 text-xs font-semibold text-muted-foreground data-inset:pl-8',
        className,
      )}
      {...props}
    />
  );
}

export interface ContextMenuSeparatorProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.Separator> {}

export function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuSeparatorProps) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
}

export interface ContextMenuCheckboxItemProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem> {
  inset?: boolean;
}

export function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: ContextMenuCheckboxItemProps) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        'relative flex cursor-pointer items-center gap-1.5 rounded-md py-1.5 pr-8 pl-2 text-sm text-foreground outline-hidden select-none transition-colors',
        'focus:bg-accent focus:text-accent-foreground',
        'data-inset:pl-8',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        className,
      )}
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex size-4 items-center justify-center"
        data-slot="context-menu-checkbox-item-indicator"
      >
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="size-4" />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

export interface ContextMenuRadioGroupProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup> {}

export function ContextMenuRadioGroup({
  ...props
}: ContextMenuRadioGroupProps) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}

export interface ContextMenuRadioItemProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.RadioItem> {
  inset?: boolean;
}

export function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: ContextMenuRadioItemProps) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      data-inset={inset}
      className={cn(
        'relative flex cursor-pointer items-center gap-1.5 rounded-md py-1.5 pr-8 pl-2 text-sm text-foreground outline-hidden select-none transition-colors',
        'focus:bg-accent focus:text-accent-foreground',
        'data-inset:pl-8',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        className,
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex size-4 items-center justify-center"
        data-slot="context-menu-radio-item-indicator"
      >
        <ContextMenuPrimitive.RadioItemIndicator>
          <CheckIcon className="size-4" />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

export interface ContextMenuShortcutProps
  extends React.ComponentProps<'span'> {}

export function ContextMenuShortcut({
  className,
  ...props
}: ContextMenuShortcutProps) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  );
}

export interface ContextMenuSubProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.SubmenuRoot> {}

export function ContextMenuSub({ ...props }: ContextMenuSubProps) {
  return <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />;
}

export interface ContextMenuSubTriggerProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.SubmenuTrigger> {
  inset?: boolean;
  showChevron?: boolean;
}

export function ContextMenuSubTrigger({
  className,
  inset,
  children,
  showChevron = true,
  ...props
}: ContextMenuSubTriggerProps) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        'flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-foreground outline-hidden select-none transition-colors',
        'focus:bg-accent focus:text-accent-foreground',
        'data-inset:pl-8',
        'data-open:bg-accent data-open:text-accent-foreground',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        className,
      )}
      {...props}
    >
      {children}
      {showChevron && <ChevronRightIcon className="ml-auto size-4" />}
    </ContextMenuPrimitive.SubmenuTrigger>
  );
}

export interface ContextMenuSubContentProps
  extends React.ComponentProps<typeof ContextMenuPrimitive.Popup> {}

export function ContextMenuSubContent({
  className,
  ...props
}: ContextMenuSubContentProps) {
  return (
    <ContextMenuPrimitive.Positioner>
      <ContextMenuPrimitive.Popup
        data-slot="context-menu-sub-content"
        className={cn(
          'z-50 min-w-32 origin-(--transform-origin) overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md duration-100 outline-none',
          'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
          'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className,
        )}
        {...props}
      />
    </ContextMenuPrimitive.Positioner>
  );
}

export const ContextMenu = Object.assign(ContextMenuRoot, {
  Trigger: ContextMenuTrigger,
  Portal: ContextMenuPortal,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  Group: ContextMenuGroup,
  Label: ContextMenuLabel,
  Separator: ContextMenuSeparator,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  Shortcut: ContextMenuShortcut,
  Sub: ContextMenuSub,
  SubTrigger: ContextMenuSubTrigger,
  SubContent: ContextMenuSubContent,
});
