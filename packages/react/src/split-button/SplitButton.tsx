import * as React from 'react';
import { Button, type ButtonProps } from '../button/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { ChevronDownIcon } from '../lib/icons';
import { cn } from '../lib/utils';

export type SplitButtonSize = 'default' | 'sm' | 'xs' | 'lg';
export type SplitButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';

export interface SplitButtonItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  title?: string;
  separator?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export interface SplitButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  size?: SplitButtonSize;
  variant?: SplitButtonVariant;
  title?: string;
  className?: string;
  items?: SplitButtonItem[];
  dropdownContent?: React.ReactNode;
  onInteract?: (e: React.MouseEvent) => void;
  chevronAriaLabel?: string;
}

const chevronSizeMap: Record<SplitButtonSize, ButtonProps['size']> = {
  default: 'icon',
  sm: 'icon-sm',
  xs: 'icon-xs',
  lg: 'icon-lg',
};

const chevronIconSizeMap: Record<SplitButtonSize, string> = {
  default: 'size-4',
  sm: 'size-3.5',
  xs: 'size-3',
  lg: 'size-4.5',
};

const separatorColorMap: Partial<Record<SplitButtonVariant, string>> = {
  default: 'border-primary-foreground/20',
  secondary: 'border-secondary-foreground/20',
  destructive: 'border-destructive-foreground/30',
  outline: 'border-border',
  ghost: 'border-border',
};

export function SplitButton({
  children,
  onClick,
  disabled = false,
  size = 'default',
  variant = 'default',
  title,
  className,
  items,
  dropdownContent,
  onInteract,
  chevronAriaLabel = 'Show more options',
}: SplitButtonProps) {
  const chevronSize = chevronSizeMap[size] ?? 'icon';
  const chevronIconSize = chevronIconSizeMap[size] ?? 'size-4';
  const separatorColor = separatorColorMap[variant] ?? 'border-border';

  return (
    <div
      data-slot="split-button"
      className={cn('inline-flex shrink-0 items-stretch', className)}
      onClick={onInteract}
    >
      <Button
        size={size}
        variant={variant}
        className="rounded-r-none border-r-0"
        disabled={disabled}
        title={title}
        onClick={(e) => {
          onInteract?.(e);
          onClick?.(e);
        }}
      >
        {children}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={chevronSize}
            variant={variant}
            className={cn('rounded-l-none border-l px-1.5', separatorColor)}
            disabled={disabled}
            aria-label={chevronAriaLabel}
            onClick={(e) => onInteract?.(e)}
          >
            <ChevronDownIcon className={chevronIconSize} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          {dropdownContent ||
            (items ?? []).map((item) => (
              <React.Fragment key={item.key}>
                {item.separator && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  disabled={item.disabled}
                  title={item.title}
                  onClick={(e) => {
                    onInteract?.(e);
                    item.onClick?.(e);
                  }}
                >
                  {item.icon ? (
                    <span className="shrink-0">{item.icon}</span>
                  ) : null}
                  <span>{item.label}</span>
                </DropdownMenuItem>
              </React.Fragment>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
