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
}

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, side: propSide, align = 'center', sideOffset, alignOffset, children, style, ...props }, ref) => {
    const { isOpen, side: contextSide, tooltipId } = useTooltip();
    const side = propSide || contextSide || 'top';

    if (!isOpen) {
      return null;
    }

    const computedStyle: React.CSSProperties = { ...style };
    if (sideOffset !== undefined) {
      if (side === 'top') computedStyle.marginBottom = `${sideOffset}px`;
      else if (side === 'bottom') computedStyle.marginTop = `${sideOffset}px`;
      else if (side === 'left') computedStyle.marginRight = `${sideOffset}px`;
      else if (side === 'right') computedStyle.marginLeft = `${sideOffset}px`;
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
          'z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md animate-in fade-in-0 zoom-in-95',
          sidePositionClasses[side],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

TooltipContent.displayName = 'TooltipContent';

export interface TooltipProps extends Omit<TooltipRootProps, 'content'> {
  content?: React.ReactNode;
}

const TooltipComponent = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      children,
      content,
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
          <TooltipContent side={side}>{content}</TooltipContent>
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
