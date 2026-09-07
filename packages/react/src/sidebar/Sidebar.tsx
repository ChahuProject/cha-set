import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useRender } from '@base-ui/react/use-render';
import { Button } from '../button';
import { Input } from '../input';
import { Separator } from '../separator';
import { Skeleton } from '../skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';
import { PanelLeftIcon } from '../lib/icons';
import { cn } from '../lib/utils';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
/** 逻辑宽度单位：rem（随根 font-size / 界面缩放） */
const SIDEBAR_WIDTH = 16; // 100% 下约 256px
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';
const SIDEBAR_WIDTH_STORAGE_KEY = 'sidebar_width';
const SIDEBAR_HIDDEN_STORAGE_KEY = 'sidebar_hidden';
const SIDEBAR_MIN_WIDTH = 12; // ~192px @100%
const SIDEBAR_MAX_WIDTH = 24; // ~384px @100%
const SIDEBAR_HIDE_THRESHOLD = 6; // ~96px @100%
const SIDEBAR_REVEAL_DELAY = 120;
const SIDEBAR_CONCEAL_DELAY = 180;
const SIDEBAR_EDGE_REVEAL_ZONE_WIDTH = 0.5; // rem
const SIDEBAR_EDGE_REVEAL_LINE_WIDTH = 0.125; // rem

/** 兼容旧 localStorage 像素值（>48 视为 px，换算为 rem） */
function normalizeSidebarWidth(raw: number): number {
  if (!Number.isFinite(raw) || raw <= 0) return SIDEBAR_WIDTH;
  const rem = raw > 48 ? raw / 16 : raw;
  return Math.min(Math.max(rem, SIDEBAR_MIN_WIDTH), SIDEBAR_MAX_WIDTH);
}

function getRootFontSizePx(): number {
  if (typeof document === 'undefined') return 16;
  const n = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
  return Number.isFinite(n) && n > 0 ? n : 16;
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mql = window.matchMedia('(max-width: 767px)');
    const onChange = () => {
      setIsMobile(mql.matches);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

export interface SidebarContextProps {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (value: boolean | ((value: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (value: boolean | ((value: boolean) => boolean)) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
  temporaryOpen: boolean;
  setTemporaryOpen: (open: boolean) => void;
  revealTemporarySidebar: (immediate?: boolean) => void;
  concealTemporarySidebar: () => void;
  resizing: boolean;
  setResizing: (resizing: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export function useSidebar(): SidebarContextProps {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}

export interface SidebarProviderProps extends React.ComponentProps<'div'> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [sidebarWidth, setSidebarWidthState] = React.useState(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return SIDEBAR_WIDTH;
    }
    try {
      const raw = window.localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
      if (!raw) return SIDEBAR_WIDTH;
      const stored = Number(raw);
      return normalizeSidebarWidth(stored);
    } catch {
      return SIDEBAR_WIDTH;
    }
  });
  const [hidden, setHiddenState] = React.useState(false);
  const [temporaryOpen, setTemporaryOpen] = React.useState(false);
  const [resizing, setResizing] = React.useState(false);
  const revealTimerRef = React.useRef<number | null>(null);
  const concealTimerRef = React.useRef<number | null>(null);

  const clearTemporaryTimers = React.useCallback(() => {
    if (revealTimerRef.current !== null && typeof window !== 'undefined') {
      window.clearTimeout(revealTimerRef.current);
    }
    if (concealTimerRef.current !== null && typeof window !== 'undefined') {
      window.clearTimeout(concealTimerRef.current);
    }
    revealTimerRef.current = null;
    concealTimerRef.current = null;
  }, []);

  const revealTemporarySidebar = React.useCallback(
    (immediate = false) => {
      clearTemporaryTimers();
      if (immediate) {
        setTemporaryOpen(true);
        return;
      }
      if (typeof window !== 'undefined') {
        revealTimerRef.current = window.setTimeout(setTemporaryOpen, SIDEBAR_REVEAL_DELAY, true);
      }
    },
    [clearTemporaryTimers],
  );

  const concealTemporarySidebar = React.useCallback(() => {
    clearTemporaryTimers();
    if (typeof window !== 'undefined') {
      concealTimerRef.current = window.setTimeout(setTemporaryOpen, SIDEBAR_CONCEAL_DELAY, false);
    }
  }, [clearTemporaryTimers]);

  React.useEffect(() => clearTemporaryTimers, [clearTemporaryTimers]);

  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      if (typeof document !== 'undefined') {
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      }
    },
    [setOpenProp, open],
  );

  const setSidebarWidth = React.useCallback((width: number) => {
    const nextWidth = normalizeSidebarWidth(width);
    setSidebarWidthState(nextWidth);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(nextWidth));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setHidden = React.useCallback(
    (nextHidden: boolean) => {
      setHiddenState(false);
      setTemporaryOpen(false);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(SIDEBAR_HIDDEN_STORAGE_KEY);
        }
      } catch {
        // ignore
      }
      if (!nextHidden) {
        setOpen(true);
      }
    },
    [setOpen],
  );

  const state = open ? 'expanded' : 'collapsed';

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      return setOpenMobile((prev) => !prev);
    }
    if (hidden) {
      setHidden(false);
      return;
    }
    return setOpen((prev) => !prev);
  }, [hidden, isMobile, setHidden, setOpen, setOpenMobile]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    const handleRemoteToggle = () => {
      toggleSidebar();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('chahu:toggle-sidebar', handleRemoteToggle);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('chahu:toggle-sidebar', handleRemoteToggle);
    };
  }, [toggleSidebar]);

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      sidebarWidth,
      setSidebarWidth,
      hidden,
      setHidden,
      temporaryOpen,
      setTemporaryOpen,
      revealTemporarySidebar,
      concealTemporarySidebar,
      resizing,
      setResizing,
    }),
    [
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      sidebarWidth,
      setSidebarWidth,
      hidden,
      setHidden,
      temporaryOpen,
      setTemporaryOpen,
      revealTemporarySidebar,
      concealTemporarySidebar,
      resizing,
      setResizing,
    ],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            '--sidebar-width': `${sidebarWidth}rem`,
            '--sidebar-width-px': `${sidebarWidth * 16}px`,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          'group/sidebar-wrapper flex h-full min-h-0 w-full has-data-[variant=inset]:bg-sidebar',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export interface SidebarProps extends React.ComponentProps<'div'> {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
}

export function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: SidebarProps) {
  const { isMobile, state, setOpen, hidden, temporaryOpen, revealTemporarySidebar, concealTemporarySidebar, resizing } =
    useSidebar();

  React.useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile, setOpen]);

  if (collapsible === 'none') {
    return (
      <div
        data-slot="sidebar"
        className={cn('flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground', className)}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className="group peer block text-sidebar-foreground"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-hidden={hidden ? 'true' : 'false'}
      data-temporary-open={temporaryOpen ? 'true' : 'false'}
      data-resizing={resizing ? 'true' : 'false'}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* Handles sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-out group-data-[resizing=true]:transition-none',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        )}
      />
      <div
        data-slot="sidebar-container"
        data-side={side}
        onPointerEnter={() => {
          if (hidden && temporaryOpen) {
            revealTemporarySidebar(true);
          }
        }}
        onPointerLeave={() => {
          if (hidden && temporaryOpen) {
            concealTemporarySidebar();
          }
        }}
        className={cn(
          'fixed top-10 bottom-0 z-10 flex h-[calc(100svh-2.5rem)] w-(--sidebar-width) bg-sidebar text-sidebar-foreground border-r border-sidebar-border/50 transition-[left,right,width,transform] duration-200 ease-out data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] group-data-[resizing=true]:transition-none',
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="flex size-full flex-col bg-transparent group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export interface SidebarTriggerProps extends React.ComponentProps<typeof Button> {
  tooltip?: string | false;
  label?: string;
}

export function SidebarTrigger({
  className,
  onClick,
  tooltip,
  label = '切换侧边栏',
  ...props
}: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();
  const tooltipText = tooltip === false ? null : (tooltip ?? label);

  const button = (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">{label}</span>
    </Button>
  );

  if (!tooltipText) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center">
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}

export interface SidebarEdgeRevealZoneProps extends React.ComponentProps<'button'> {
  label?: string;
}

export function SidebarEdgeRevealZone({
  className,
  onClick,
  onPointerEnter,
  onPointerLeave,
  label = '展开侧边栏',
  'aria-label': ariaLabel,
  ...props
}: SidebarEdgeRevealZoneProps) {
  const { hidden, setHidden, temporaryOpen, revealTemporarySidebar, concealTemporarySidebar } = useSidebar();

  if (!hidden) {
    return null;
  }

  return (
    <button
      data-sidebar="edge-reveal-zone"
      data-slot="sidebar-edge-reveal-zone"
      aria-label={ariaLabel ?? label}
      aria-expanded={temporaryOpen}
      className={cn(
        'fixed inset-y-0 left-0 z-50 hidden touch-none bg-transparent outline-none transition-opacity duration-150 after:absolute after:inset-y-0 after:left-0 after:w-(--sidebar-edge-reveal-line-width) after:bg-sidebar-ring after:opacity-0 after:shadow-[0_0_16px_hsl(var(--sidebar-ring)/0.55)] after:transition-opacity after:duration-150 hover:after:opacity-100 focus-visible:after:opacity-100 md:block',
        className,
      )}
      style={
        {
          '--sidebar-edge-reveal-line-width': `${SIDEBAR_EDGE_REVEAL_LINE_WIDTH}rem`,
          width: `${SIDEBAR_EDGE_REVEAL_ZONE_WIDTH}rem`,
        } as React.CSSProperties
      }
      {...props}
      onClick={(event) => {
        onClick?.(event);
        setHidden(false);
      }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        revealTemporarySidebar();
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        concealTemporarySidebar();
      }}
    />
  );
}

export interface SidebarRailProps extends React.ComponentProps<'button'> {
  label?: string;
  title?: string;
}

export function SidebarRail({
  className,
  label = '调整侧边栏宽度',
  title = '拖动调整侧边栏宽度',
  'aria-label': ariaLabel,
  ...props
}: SidebarRailProps) {
  const { sidebarWidth, setSidebarWidth, setHidden, setOpen, setResizing } = useSidebar();
  const startRef = React.useRef({ x: 0, width: sidebarWidth });

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const side = event.currentTarget.closest('[data-side]')?.getAttribute('data-side') ?? 'left';
      startRef.current = { x: event.clientX, width: sidebarWidth };
      setOpen(true);
      setResizing(true);
      event.currentTarget.setPointerCapture(event.pointerId);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const rootFontSize = getRootFontSizePx();
        const deltaPx =
          side === 'left' ? moveEvent.clientX - startRef.current.x : startRef.current.x - moveEvent.clientX;
        const nextWidth = startRef.current.width + deltaPx / rootFontSize;
        if (nextWidth < SIDEBAR_HIDE_THRESHOLD) {
          setOpen(false);
          setSidebarWidth(SIDEBAR_MIN_WIDTH);
          return;
        }
        setHidden(false);
        setSidebarWidth(nextWidth);
      };

      const handlePointerUp = () => {
        setResizing(false);
        if (typeof window !== 'undefined') {
          window.removeEventListener('pointermove', handlePointerMove);
          window.removeEventListener('pointerup', handlePointerUp);
        }
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp, { once: true });
      }
    },
    [sidebarWidth, setHidden, setOpen, setResizing, setSidebarWidth],
  );

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label={ariaLabel ?? label}
      tabIndex={-1}
      onPointerDown={handlePointerDown}
      title={title}
      className={cn(
        'absolute inset-y-0 z-20 hidden w-4 touch-none transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2',
        'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
        'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        'relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn('h-8 w-full bg-background shadow-none', className)}
      {...props}
    />
  );
}

export function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
}

export function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
}

export function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn('mx-2 w-auto bg-sidebar-border', className)}
      {...props}
    />
  );
}

export function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        'no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    />
  );
}

export interface SidebarGroupLabelProps extends React.ComponentProps<'div'> {
  asChild?: boolean;
  render?: React.ReactElement;
}

export function SidebarGroupLabel({
  className,
  asChild = false,
  render,
  children,
  ...props
}: SidebarGroupLabelProps) {
  const renderElement = render ?? (asChild && React.isValidElement(children) ? children : undefined);

  return useRender({
    defaultTagName: 'div',
    render: renderElement,
    props: {
      'data-slot': 'sidebar-group-label',
      'data-sidebar': 'group-label',
      className: cn(
        'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        className,
      ),
      children: renderElement === children ? undefined : children,
      ...props,
    },
  });
}

export interface SidebarGroupActionProps extends React.ComponentProps<'button'> {
  asChild?: boolean;
  render?: React.ReactElement;
}

export function SidebarGroupAction({
  className,
  asChild = false,
  render,
  children,
  ...props
}: SidebarGroupActionProps) {
  const renderElement = render ?? (asChild && React.isValidElement(children) ? children : undefined);

  return useRender({
    defaultTagName: 'button',
    render: renderElement,
    props: {
      'data-slot': 'sidebar-group-action',
      'data-sidebar': 'group-action',
      className: cn(
        'absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0',
        className,
      ),
      children: renderElement === children ? undefined : children,
      ...props,
    },
  });
}

export function SidebarGroupContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn('w-full text-sm', className)}
      {...props}
    />
  );
}

export function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      {...props}
    />
  );
}

export function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn('group/menu-item relative w-full', className)}
      {...props}
    />
  );
}

export const sidebarMenuButtonVariants = cva(
  'peer/menu-button group/menu-button relative flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] cursor-pointer group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-[active=true]:bg-[var(--sidebar-selected)] data-[active=true]:font-medium data-[active=true]:text-[var(--sidebar-selected-foreground)] data-[active=true]:hover:bg-[var(--sidebar-selected)] data-[active=true]:hover:text-[var(--sidebar-selected-foreground)] data-[active=true]:[&_svg]:text-[var(--sidebar-selected-foreground)] [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface SidebarMenuButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean;
  render?: React.ReactElement;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
}

export function SidebarMenuButton({
  asChild = false,
  render,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  children,
  ...props
}: SidebarMenuButtonProps) {
  const { state } = useSidebar();
  const renderElement = render ?? (asChild && React.isValidElement(children) ? children : undefined);

  const button = useRender({
    defaultTagName: 'button',
    render: renderElement,
    props: {
      'data-slot': 'sidebar-menu-button',
      'data-sidebar': 'menu-button',
      'data-size': size,
      'data-active': isActive,
      className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      children: renderElement === children ? undefined : children,
      ...props,
    },
  });

  if (!tooltip || state !== 'collapsed') {
    return button;
  }

  const tooltipProps = typeof tooltip === 'string' ? { children: tooltip } : tooltip;

  return (
    <Tooltip className="flex w-full justify-center">
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center" {...tooltipProps} />
    </Tooltip>
  );
}

export interface SidebarMenuActionProps extends React.ComponentProps<'button'> {
  asChild?: boolean;
  render?: React.ReactElement;
  showOnHover?: boolean;
}

export function SidebarMenuAction({
  className,
  asChild = false,
  render,
  showOnHover = false,
  children,
  ...props
}: SidebarMenuActionProps) {
  const renderElement = render ?? (asChild && React.isValidElement(children) ? children : undefined);

  return useRender({
    defaultTagName: 'button',
    render: renderElement,
    props: {
      'data-slot': 'sidebar-menu-action',
      'data-sidebar': 'menu-action',
      className: cn(
        'absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform cursor-pointer group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0',
        showOnHover &&
          'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0',
        className,
      ),
      children: renderElement === children ? undefined : children,
      ...props,
    },
  });
}

export function SidebarMenuBadge({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        'pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
        className,
      )}
      {...props}
    />
  );
}

export interface SidebarMenuSkeletonProps extends React.ComponentProps<'div'> {
  showIcon?: boolean;
}

export function SidebarMenuSkeleton({ className, showIcon = false, ...props }: SidebarMenuSkeletonProps) {
  const [width] = React.useState(() => `${Math.floor(Math.random() * 40) + 50}%`);

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn('flex h-8 items-center gap-2 rounded-md px-2', className)}
      {...props}
    >
      {showIcon && <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={{ '--skeleton-width': width } as React.CSSProperties}
      />
    </div>
  );
}

export function SidebarMenuSub({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        'ml-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border pl-2.5 py-0.5 group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn('group/menu-sub-item relative', className)}
      {...props}
    />
  );
}

export interface SidebarMenuSubButtonProps extends React.ComponentProps<'a'> {
  asChild?: boolean;
  render?: React.ReactElement;
  size?: 'sm' | 'md';
  isActive?: boolean;
}

export function SidebarMenuSubButton({
  asChild = false,
  render,
  size = 'md',
  isActive = false,
  className,
  children,
  ...props
}: SidebarMenuSubButtonProps) {
  const renderElement = render ?? (asChild && React.isValidElement(children) ? children : undefined);

  return useRender({
    defaultTagName: 'a',
    render: renderElement,
    props: {
      'data-slot': 'sidebar-menu-sub-button',
      'data-sidebar': 'menu-sub-button',
      'data-size': size,
      'data-active': isActive,
      className: cn(
        'flex h-7 min-w-0 w-full -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-left text-sidebar-foreground ring-sidebar-ring outline-hidden cursor-pointer group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs data-[active=true]:bg-[var(--sidebar-selected)] data-[active=true]:text-[var(--sidebar-selected-foreground)] data-[active=true]:hover:bg-[var(--sidebar-selected)] data-[active=true]:hover:text-[var(--sidebar-selected-foreground)] data-[active=true]:[&>svg]:text-[var(--sidebar-selected-foreground)] [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground',
        className,
      ),
      children: renderElement === children ? undefined : children,
      ...props,
    },
  });
}
