import { Select as SelectPrimitive } from '@base-ui/react/select';
import * as React from 'react';
import { cn } from '../lib/utils';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '../lib/icons';

export interface SelectProps<Value = string> {
  value?: Value | null;
  defaultValue?: Value | null;
  onValueChange?: (value: Value, eventDetails: any) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: any) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  items?: any;
  modal?: boolean;
  children?: React.ReactNode;
}

export function SelectRoot<Value = string>({
  value,
  defaultValue,
  onValueChange,
  ...props
}: SelectProps<Value>) {
  return (
    <SelectPrimitive.Root
      data-slot="select"
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange as any}
      {...(props as any)}
    />
  );
}

export interface SelectGroupProps
  extends React.ComponentProps<typeof SelectPrimitive.Group> {}

export function SelectGroup({ className, ...props }: SelectGroupProps) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn('scroll-my-1', className)}
      {...props}
    />
  );
}

export interface SelectValueProps
  extends React.ComponentProps<typeof SelectPrimitive.Value> {
  placeholder?: React.ReactNode;
}

export function SelectValue({
  placeholder,
  className,
  ...props
}: SelectValueProps) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      placeholder={placeholder}
      className={className}
      {...props}
    />
  );
}

export interface SelectTriggerProps
  extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
  size?: 'default' | 'sm';
  chevronIcon?: React.ReactNode;
}

export function SelectTrigger({
  className,
  size = 'default',
  children,
  chevronIcon,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        'flex w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-background py-1.5 pr-2 pl-3 text-sm transition-colors outline-hidden select-none cursor-pointer',
        'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
        'data-placeholder:text-muted-foreground',
        size === 'default' ? 'h-8' : 'h-7 text-xs rounded-md',
        '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        {chevronIcon ?? (
          <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
        )}
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export interface SelectContentProps
  extends React.ComponentProps<typeof SelectPrimitive.Popup> {
  position?: 'item-aligned' | 'popper';
  align?: 'start' | 'center' | 'end';
}

export function SelectContent({
  className,
  children,
  position = 'item-aligned',
  align = 'center',
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        alignItemWithTrigger={position === 'item-aligned'}
        align={align}
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={position === 'item-aligned'}
          className={cn(
            'relative z-50 max-h-(--available-height) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md duration-100 outline-none',
            'data-[align-trigger=true]:animate-none',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
            'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            position === 'popper' &&
              'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <div className={cn(position === 'popper' && 'w-full min-w-(--anchor-width)')}>
            {children}
          </div>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

export interface SelectLabelProps
  extends React.ComponentProps<typeof SelectPrimitive.GroupLabel> {}

export function SelectLabel({ className, ...props }: SelectLabelProps) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn('px-2 py-1.5 text-xs font-semibold text-muted-foreground', className)}
      {...props}
    />
  );
}

export interface SelectItemProps
  extends React.ComponentProps<typeof SelectPrimitive.Item> {
  itemText?: React.ReactNode;
}

export function SelectItem({
  className,
  children,
  itemText,
  ...props
}: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1.5 pr-8 pl-2 text-sm outline-hidden select-none transition-colors',
        'focus:bg-accent focus:text-accent-foreground',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        '*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2',
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4 pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{itemText ?? children}</SelectPrimitive.ItemText>
      {itemText !== undefined && children}
    </SelectPrimitive.Item>
  );
}

export interface SelectSeparatorProps
  extends React.ComponentProps<typeof SelectPrimitive.Separator> {}

export function SelectSeparator({
  className,
  ...props
}: SelectSeparatorProps) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('pointer-events-none -mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
}

export interface SelectScrollUpButtonProps
  extends React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow> {}

export function SelectScrollUpButton({
  className,
  ...props
}: SelectScrollUpButtonProps) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        'z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*=\'size-\'])]:size-4',
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpArrow>
  );
}

export interface SelectScrollDownButtonProps
  extends React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow> {}

export function SelectScrollDownButton({
  className,
  ...props
}: SelectScrollDownButtonProps) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        'z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*=\'size-\'])]:size-4',
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export const Select = Object.assign(SelectRoot, {
  Group: SelectGroup,
  Value: SelectValue,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Label: SelectLabel,
  Item: SelectItem,
  Separator: SelectSeparator,
  ScrollUpButton: SelectScrollUpButton,
  ScrollDownButton: SelectScrollDownButton,
});
