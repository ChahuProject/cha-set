import * as React from 'react';
import { cn } from '../lib/utils';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

// Context for TooltipProvider (global/ancestor defaults)
interface TooltipProviderContextValue {
  delayDuration: number;
}

const TooltipProviderContext = React.createContext<TooltipProviderContextValue>({
  delayDuration: 200,
});

export interface TooltipProviderProps {
  delayDuration?: number;
  children: React.ReactNode;
}

export function TooltipProvider({ delayDuration = 200, children }: TooltipProviderProps) {
  return (
    <TooltipProviderContext.Provider value={{ delayDuration }}>
      {children}
    </TooltipProviderContext.Provider>
  );
}

// Context for individual Tooltip instances
interface TooltipContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  side: TooltipSide;
  delayDuration: number;
  disabled: boolean;
  tooltipId: string;
  handleTriggerMouseEnter: (event?: React.MouseEvent) => void;
  handleTriggerMouseLeave: (event?: React.MouseEvent) => void;
  handleTriggerFocus: (event?: React.FocusEvent) => void;
  handleTriggerBlur: (event?: React.FocusEvent) => void;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

export function useTooltip() {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error('Tooltip compound components must be used within a Tooltip or TooltipRoot');
  }
  return context;
}

function composeEventHandlers<E extends React.SyntheticEvent<any, any>>(
  originalHandler?: ((event: E) => void) | undefined,
  ourHandler?: ((event?: any) => void) | undefined,
) {
  return (event: E) => {
    originalHandler?.(event);
    if (!event.defaultPrevented) {
      ourHandler?.(event);
    }
  };
}

export interface TooltipRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  side?: TooltipSide;
  delayDuration?: number;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  forceHover?: boolean;
}

export const TooltipRoot = React.forwardRef<HTMLDivElement, TooltipRootProps>(
  (
    {
      children,
      side = 'top',
      delayDuration: propDelay,
      disabled = false,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      forceHover = false,
      className,
      ...props
    },
    ref,
  ) => {
    const providerContext = React.useContext(TooltipProviderContext);
    const delayDuration = propDelay !== undefined ? propDelay : providerContext.delayDuration;

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const isOpen = (isControlled ? controlledOpen : uncontrolledOpen) || forceHover;

    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const reactId = React.useId();
    const tooltipId = `tooltip-${reactId}`;

    const updateOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) {
          setUncontrolledOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
      [isControlled, onOpenChange],
    );

    const clearTimer = React.useCallback(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }, []);

    const handleTriggerMouseEnter = React.useCallback(() => {
      if (disabled) return;
      clearTimer();
      if (delayDuration <= 0) {
        updateOpen(true);
      } else {
        timerRef.current = setTimeout(() => {
          updateOpen(true);
        }, delayDuration);
      }
    }, [disabled, clearTimer, delayDuration, updateOpen]);

    const handleTriggerMouseLeave = React.useCallback(() => {
      clearTimer();
      updateOpen(false);
    }, [clearTimer, updateOpen]);

    const handleTriggerFocus = React.useCallback(() => {
      if (disabled) return;
      clearTimer();
      if (delayDuration <= 0) {
        updateOpen(true);
      } else {
        timerRef.current = setTimeout(() => {
          updateOpen(true);
        }, delayDuration);
      }
    }, [disabled, clearTimer, delayDuration, updateOpen]);

    const handleTriggerBlur = React.useCallback(() => {
      clearTimer();
      updateOpen(false);
    }, [clearTimer, updateOpen]);

    React.useEffect(() => {
      if (disabled && isOpen) {
        clearTimer();
        updateOpen(false);
      }
    }, [disabled, isOpen, clearTimer, updateOpen]);

    React.useEffect(() => {
      return () => {
        clearTimer();
      };
    }, [clearTimer]);

    const contextValue = React.useMemo<TooltipContextValue>(
      () => ({
        isOpen,
        setIsOpen: updateOpen,
        side,
        delayDuration,
        disabled,
        tooltipId,
        handleTriggerMouseEnter,
        handleTriggerMouseLeave,
        handleTriggerFocus,
        handleTriggerBlur,
      }),
      [
        isOpen,
        updateOpen,
        side,
        delayDuration,
        disabled,
        tooltipId,
        handleTriggerMouseEnter,
        handleTriggerMouseLeave,
        handleTriggerFocus,
        handleTriggerBlur,
      ],
    );

    return (
      <TooltipContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="tooltip-root"
          className={cn('relative inline-flex items-center justify-center', className)}
          {...props}
        >
          {children}
        </div>
      </TooltipContext.Provider>
    );
  },
);

TooltipRoot.displayName = 'TooltipRoot';

export interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}

export const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ asChild = false, children, className, ...props }, ref) => {
    const {
      isOpen,
      tooltipId,
      handleTriggerMouseEnter,
      handleTriggerMouseLeave,
      handleTriggerFocus,
      handleTriggerBlur,
    } = useTooltip();

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<Record<string, any>>;
      const existingDescribedBy = child.props['aria-describedby'];
      const combinedDescribedBy = [existingDescribedBy, isOpen ? tooltipId : undefined]
        .filter(Boolean)
        .join(' ');

      return React.cloneElement(child, {
        ...props,
        ...child.props,
        ref,
        'data-slot': 'tooltip-trigger',
        'aria-describedby': combinedDescribedBy || undefined,
        onMouseEnter: composeEventHandlers(child.props.onMouseEnter, handleTriggerMouseEnter),
        onMouseLeave: composeEventHandlers(child.props.onMouseLeave, handleTriggerMouseLeave),
        onFocus: composeEventHandlers(child.props.onFocus, handleTriggerFocus),
        onBlur: composeEventHandlers(child.props.onBlur, handleTriggerBlur),
        className: cn(child.props.className, className),
      });
    }

    return (
      <button
        type="button"
        ref={ref as React.Ref<HTMLButtonElement>}
        data-slot="tooltip-trigger"
        aria-describedby={isOpen ? tooltipId : undefined}
        onMouseEnter={handleTriggerMouseEnter}
        onMouseLeave={handleTriggerMouseLeave}
        onFocus={handleTriggerFocus}
        onBlur={handleTriggerBlur}
        className={cn('inline-flex items-center justify-center', className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

TooltipTrigger.displayName = 'TooltipTrigger';

const sidePositionClasses: Record<TooltipSide, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export type TooltipAlign = 'start' | 'center' | 'end';

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: TooltipSide;
  align?: TooltipAlign;
  sideOffset?: number;
  alignOffset?: number;
  shortcut?: string;
  arrow?: boolean;
}

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      className,
      side: propSide,
      align = 'center',
      sideOffset,
      alignOffset,
      shortcut,
      arrow = false,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const { isOpen, side: contextSide, tooltipId } = useTooltip();
    const side = propSide || contextSide || 'top';

    if (!isOpen) {
      return null;
    }

    const computedStyle: React.CSSProperties = { ...style };
    if (sideOffset !== undefined) {
      const remVal = `${(sideOffset * 0.0625).toFixed(4)}rem`;
      if (side === 'top') computedStyle.marginBottom = remVal;
      else if (side === 'bottom') computedStyle.marginTop = remVal;
      else if (side === 'left') computedStyle.marginRight = remVal;
      else if (side === 'right') computedStyle.marginLeft = remVal;
    }

    return (
      <div
        ref={ref}
        role="tooltip"
        id={tooltipId}
        data-slot="tooltip-content"
        data-side={side}
        data-align={align}
        data-state={isOpen ? 'open' : 'closed'}
        style={computedStyle}
        className={cn(
          'absolute whitespace-nowrap pointer-events-none select-none',
          'z-50 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md animate-in fade-in-0 zoom-in-95 inline-flex items-center gap-2',
          sidePositionClasses[side],
          className,
        )}
        {...props}
      >
        <span>{children}</span>
        {shortcut && (
          <kbd
            data-slot="tooltip-shortcut"
            className="inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[0.6875rem] font-mono font-medium tracking-tight bg-primary-foreground/20 text-primary-foreground/90 border border-primary-foreground/20"
          >
            {shortcut}
          </kbd>
        )}
        {arrow && (
          <span
            data-slot="tooltip-arrow"
            className={cn(
              'absolute w-0 h-0 border-solid pointer-events-none',
              side === 'top' && 'top-full left-1/2 -translate-x-1/2 border-t-[0.25rem] border-t-primary border-x-[0.25rem] border-x-transparent border-b-0',
              side === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 border-b-[0.25rem] border-b-primary border-x-[0.25rem] border-x-transparent border-t-0',
              side === 'left' && 'left-full top-1/2 -translate-y-1/2 border-l-[0.25rem] border-l-primary border-y-[0.25rem] border-y-transparent border-r-0',
              side === 'right' && 'right-full top-1/2 -translate-y-1/2 border-r-[0.25rem] border-r-primary border-y-[0.25rem] border-y-transparent border-l-0',
            )}
          />
        )}
      </div>
    );
  },
);

TooltipContent.displayName = 'TooltipContent';

export interface TooltipProps extends Omit<TooltipRootProps, 'content'> {
  content?: React.ReactNode;
  shortcut?: string;
  arrow?: boolean;
  sideOffset?: number;
  alignOffset?: number;
}

const TooltipComponent = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      children,
      content,
      shortcut,
      arrow,
      sideOffset,
      alignOffset,
      side = 'top',
      delayDuration,
      disabled = false,
      open,
      defaultOpen,
      onOpenChange,
      className,
      ...props
    },
    ref,
  ) => {
    if (content !== undefined) {
      const isElement = React.isValidElement(children);
      return (
        <TooltipRoot
          ref={ref}
          side={side}
          delayDuration={delayDuration}
          disabled={disabled}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          className={className}
          {...props}
        >
          {isElement ? (
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          ) : (
            <TooltipTrigger>{children}</TooltipTrigger>
          )}
          <TooltipContent
            side={side}
            shortcut={shortcut}
            arrow={arrow}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
          >
            {content}
          </TooltipContent>
        </TooltipRoot>
      );
    }

    return (
      <TooltipRoot
        ref={ref}
        side={side}
        delayDuration={delayDuration}
        disabled={disabled}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        className={className}
        {...props}
      >
        {children}
      </TooltipRoot>
    );
  },
);

TooltipComponent.displayName = 'Tooltip';

export const Tooltip = Object.assign(TooltipComponent, {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});
