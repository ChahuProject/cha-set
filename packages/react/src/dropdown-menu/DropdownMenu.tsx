import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import * as React from 'react';
import { cn } from '../lib/utils';
import { CheckIcon, ChevronRightIcon } from '../lib/icons';

export interface DropdownMenuProps
  extends React.ComponentProps<typeof MenuPrimitive.Root> {}

export function DropdownMenuRoot({ ...props }: DropdownMenuProps) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

export interface DropdownMenuPortalProps
  extends React.ComponentProps<typeof MenuPrimitive.Portal> {}

export function DropdownMenuPortal({ ...props }: DropdownMenuPortalProps) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

export interface DropdownMenuTriggerProps
  extends React.ComponentProps<typeof MenuPrimitive.Trigger> {
  asChild?: boolean;
}

export function DropdownMenuTrigger({
  render,
  asChild = false,
  children,
  ...props
}: DropdownMenuTriggerProps) {
  const renderProp =
    render ??
    (asChild && React.isValidElement(children)
      ? (triggerProps: any) =>
          React.cloneElement(children as React.ReactElement<any>, {
            ...triggerProps,
            className: cn(triggerProps.className, (children as React.ReactElement<any>).props.className),
            children: (children as React.ReactElement<any>).props.children,
          })
      : undefined);
  return (
    <MenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      render={renderProp}
      {...props}
    >
      {renderProp ? undefined : children}
    </MenuPrimitive.Trigger>
  );
}

export type DropdownMenuPositionerProps = Pick<
  React.ComponentProps<typeof MenuPrimitive.Positioner>,
  'side' | 'sideOffset' | 'align' | 'alignOffset' | 'collisionPadding' | 'anchor'
>;

export interface DropdownMenuContentProps
  extends React.ComponentProps<typeof MenuPrimitive.Popup>,
    DropdownMenuPositionerProps {}

export function DropdownMenuContent({
  className,
  align = 'start',
  sideOffset = 4,
  side = 'bottom',
  alignOffset = 0,
  collisionPadding,
  anchor,
  ...props
}: DropdownMenuContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        anchor={anchor}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            'z-50 max-h-(--available-height) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md duration-100 outline-none',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
            'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

export interface DropdownMenuGroupProps
  extends React.ComponentProps<typeof MenuPrimitive.Group> {}

export function DropdownMenuGroup({ ...props }: DropdownMenuGroupProps) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

export interface DropdownMenuItemProps
  extends React.ComponentProps<typeof MenuPrimitive.Item> {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}

export function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: DropdownMenuItemProps) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        'group/dropdown-menu-item relative flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-foreground outline-hidden select-none transition-colors',
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

export interface DropdownMenuCheckboxItemProps
  extends React.ComponentProps<typeof MenuPrimitive.CheckboxItem> {
  inset?: boolean;
}

export function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
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
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="size-4" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

export interface DropdownMenuRadioGroupProps
  extends React.ComponentProps<typeof MenuPrimitive.RadioGroup> {}

export function DropdownMenuRadioGroup({
  ...props
}: DropdownMenuRadioGroupProps) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

export interface DropdownMenuRadioItemProps
  extends React.ComponentProps<typeof MenuPrimitive.RadioItem> {
  inset?: boolean;
}

export function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: DropdownMenuRadioItemProps) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
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
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon className="size-4" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

export interface DropdownMenuLabelProps
  extends React.ComponentProps<typeof MenuPrimitive.GroupLabel> {
  inset?: boolean;
}

export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        'px-2 py-1.5 text-xs font-semibold text-muted-foreground data-inset:pl-8',
        className,
      )}
      {...props}
    />
  );
}

export interface DropdownMenuSeparatorProps
  extends React.ComponentProps<typeof MenuPrimitive.Separator> {}

export function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
}

export interface DropdownMenuShortcutProps
  extends React.ComponentProps<'span'> {}

export function DropdownMenuShortcut({
  className,
  ...props
}: DropdownMenuShortcutProps) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  );
}

export interface DropdownMenuSubProps
  extends React.ComponentProps<typeof MenuPrimitive.SubmenuRoot> {}

export function DropdownMenuSub({ ...props }: DropdownMenuSubProps) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

export interface DropdownMenuSubTriggerProps
  extends React.ComponentProps<typeof MenuPrimitive.SubmenuTrigger> {
  inset?: boolean;
  showChevron?: boolean;
}

export function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  showChevron = true,
  ...props
}: DropdownMenuSubTriggerProps) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
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
    </MenuPrimitive.SubmenuTrigger>
  );
}

export interface DropdownMenuSubContentProps
  extends React.ComponentProps<typeof MenuPrimitive.Popup> {}

export function DropdownMenuSubContent({
  className,
  ...props
}: DropdownMenuSubContentProps) {
  return (
    <MenuPrimitive.Positioner>
      <MenuPrimitive.Popup
        data-slot="dropdown-menu-sub-content"
        className={cn(
          'z-50 min-w-32 origin-(--transform-origin) overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md duration-100 outline-none',
          'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
          'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Positioner>
  );
}

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Portal: DropdownMenuPortal,
  Content: DropdownMenuContent,
  Group: DropdownMenuGroup,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  Shortcut: DropdownMenuShortcut,
  Sub: DropdownMenuSub,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
});
