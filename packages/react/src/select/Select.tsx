import { Select as SelectPrimitive } from '@base-ui/react/select';
import * as React from 'react';
import { cn } from '../lib/utils';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '../lib/icons';

interface SelectContextValue {
  registerItem: (value: any, label: React.ReactNode) => void;
  unregisterItem: (value: any) => void;
  getLabel: (value: any) => React.ReactNode | undefined;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function extractItemsFromChildren(children: React.ReactNode, map: Record<string, React.ReactNode>) {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const props = child.props as Record<string, any> | undefined;
    if (!props) return;

    if ('value' in props && props.value !== undefined && props.value !== null) {
      const valKey = String(props.value);
      const label = props.itemText !== undefined ? props.itemText : props.children;
      if (label !== undefined && !(valKey in map)) {
        map[valKey] = label;
      }
    }

    if (props.children) {
      extractItemsFromChildren(props.children, map);
    }
  });
}

function shallowEqualRecords(a: Record<string, any>, b: Record<string, any>): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

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
  items: itemsProp,
  children,
  ...props
}: SelectProps<Value>) {
  const previousMapRef = React.useRef<Record<string, React.ReactNode>>({});
  const dynamicMapRef = React.useRef<Map<string, React.ReactNode>>(new Map());

  const extractedMap = React.useMemo(() => {
    const map: Record<string, React.ReactNode> = {};
    extractItemsFromChildren(children, map);
    if (shallowEqualRecords(previousMapRef.current, map)) {
      return previousMapRef.current;
    }
    previousMapRef.current = map;
    return map;
  }, [children]);

  const registerItem = React.useCallback((val: any, label: React.ReactNode) => {
    if (val === undefined || val === null) return;
    dynamicMapRef.current.set(String(val), label);
  }, []);

  const unregisterItem = React.useCallback((val: any) => {
    if (val === undefined || val === null) return;
    dynamicMapRef.current.delete(String(val));
  }, []);

  const getLabel = React.useCallback(
    (val: any) => {
      if (val === null || val === undefined) return undefined;
      const key = String(val);
      if (itemsProp && typeof itemsProp === 'object' && !Array.isArray(itemsProp)) {
        return itemsProp[val] ?? itemsProp[key];
      }
      return extractedMap[key] ?? dynamicMapRef.current.get(key);
    },
    [itemsProp, extractedMap]
  );

  const contextValue = React.useMemo<SelectContextValue>(
    () => ({
      registerItem,
      unregisterItem,
      getLabel,
    }),
    [registerItem, unregisterItem, getLabel]
  );

  const mergedItems = itemsProp !== undefined ? itemsProp : extractedMap;

  return (
    <SelectContext.Provider value={contextValue}>
      <SelectPrimitive.Root
        data-slot="select"
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange as any}
        items={mergedItems}
        {...(props as any)}
      >
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
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
  extends Omit<React.ComponentProps<typeof SelectPrimitive.Value>, 'children'> {
  placeholder?: React.ReactNode;
  children?: React.ReactNode | ((value: any) => React.ReactNode);
}

export function SelectValue({
  placeholder,
  className,
  children,
  ...props
}: SelectValueProps) {
  const ctx = React.useContext(SelectContext);

  const renderValue = React.useCallback(
    (selectedValue: any) => {
      if (selectedValue === null || selectedValue === undefined || selectedValue === '') {
        return placeholder;
      }
      if (typeof children === 'function') {
        return children(selectedValue);
      }
      if (children !== undefined && children !== null) {
        return children;
      }
      const label = ctx?.getLabel(selectedValue);
      if (label !== undefined && label !== null) {
        return label;
      }
      return selectedValue;
    },
    [placeholder, children, ctx]
  );

  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      placeholder={placeholder}
      className={className}
      {...props}
    >
      {renderValue}
    </SelectPrimitive.Value>
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
        'flex w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-background text-foreground py-1.5 pr-2 pl-3 text-sm transition-colors outline-hidden select-none cursor-pointer',
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
  value,
  ...props
}: SelectItemProps) {
  const ctx = React.useContext(SelectContext);

  React.useEffect(() => {
    const label = itemText !== undefined ? itemText : children;
    if (ctx && value !== undefined && value !== null && label !== undefined) {
      ctx.registerItem(value, label);
      return () => {
        ctx.unregisterItem(value);
      };
    }
  }, [ctx, value, itemText, children]);

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      value={value}
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
      <SelectPrimitive.ItemText>
        {children ?? itemText}
      </SelectPrimitive.ItemText>
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
        'z-10 flex cursor-default items-center justify-center bg-popover text-popover-foreground py-1 [&_svg:not([class*=\'size-\'])]:size-4',
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
        'z-10 flex cursor-default items-center justify-center bg-popover text-popover-foreground py-1 [&_svg:not([class*=\'size-\'])]:size-4',
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
