import * as React from 'react';
import { Rnd } from 'react-rnd';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { Maximize2Icon } from '../lib/icons';
import { cn } from '../lib/utils';

export interface DraggableModalSizeOption {
  name?: string;
  名称?: string;
  width?: number;
  height?: number;
  widthRem?: number;
  heightRem?: number;
  宽度rem?: number;
  高度rem?: number;
  special?: 'fullscreen' | 'default' | '全窗口' | '默认';
  特殊?: 'fullscreen' | 'default' | '全窗口' | '默认';
}

export interface DraggableModalProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  dataSlot?: string;
  dragHandleClassName?: string;
  showEscBadge?: boolean;
  fixedFooter?: React.ReactNode;
  topControls?: React.ReactNode;
  rootExtra?: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
  defaultWidthRem?: number;
  defaultHeightRem?: number;
  minWidthRem?: number;
  minHeightRem?: number;
  initialPositionMode?: 'center' | 'top' | '居中' | '顶部靠上';
  topMarginRem?: number;
  remBase?: number;
  autoFitHeight?: boolean;
  sizeOptions?: DraggableModalSizeOption[];
  sizeMenuTooltip?: string;

  // Compatibility aliases
  内容类名?: string;
  根级附加?: React.ReactNode;
  右上角控制?: React.ReactNode;
  底部固定区?: React.ReactNode;
  默认宽度rem?: number;
  默认高度rem?: number;
  最小宽度rem?: number;
  最小高度rem?: number;
  初始位置模式?: 'center' | 'top' | '居中' | '顶部靠上';
  顶部边距rem?: number;
  自动贴高?: boolean;
  尺寸选项?: DraggableModalSizeOption[];
  尺寸按钮提示?: string;
}

const cancelDragSelector =
  "button, input, textarea, select, a, label, [role='option'], [role='combobox'], [data-slot='dialog-close'], [data-slot='dropdown-menu-trigger'], [data-slot='splitter'], [data-slot='resizable-handle'], [data-no-drag], [data-no-drag] *";

export function DraggableModal({
  children,
  className,
  contentClassName,
  dataSlot = 'dialog-content',
  dragHandleClassName,
  showEscBadge = false,
  fixedFooter,
  topControls,
  rootExtra,
  defaultWidth,
  defaultHeight,
  minWidth,
  minHeight,
  defaultWidthRem,
  defaultHeightRem,
  minWidthRem,
  minHeightRem,
  initialPositionMode = 'center',
  topMarginRem = 4.5,
  remBase = 16,
  autoFitHeight = true,
  sizeOptions,
  sizeMenuTooltip,

  // Compatibility aliases
  内容类名,
  根级附加,
  右上角控制,
  底部固定区,
  默认宽度rem,
  默认高度rem,
  最小宽度rem,
  最小高度rem,
  初始位置模式,
  顶部边距rem,
  自动贴高,
  尺寸选项,
  尺寸按钮提示,
}: DraggableModalProps) {
  const rndRef = React.useRef<Rnd | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const footerRef = React.useRef<HTMLDivElement | null>(null);
  const hasManuallyAdjustedRef = React.useRef(false);

  const finalContentClassName = contentClassName ?? 内容类名;
  const finalFixedFooter = fixedFooter ?? 底部固定区;
  const finalTopControls = topControls ?? 右上角控制;
  const finalRootExtra = rootExtra ?? 根级附加;
  const effectiveSizeOptions = sizeOptions ?? 尺寸选项;
  const effectiveTooltip = sizeMenuTooltip ?? 尺寸按钮提示 ?? '调整弹窗尺寸';

  const rem = remBase ?? 16;
  const widthRemVal = defaultWidthRem ?? 默认宽度rem;
  const heightRemVal = defaultHeightRem ?? 默认高度rem;
  const minWidthRemVal = minWidthRem ?? 最小宽度rem;
  const minHeightRemVal = minHeightRem ?? 最小高度rem;

  const resolvedMinWidth = minWidthRemVal !== undefined ? minWidthRemVal * rem : (minWidth ?? 300);
  const resolvedMinHeight = minHeightRemVal !== undefined ? minHeightRemVal * rem : (minHeight ?? 200);

  let resolvedWidth: number;
  if (widthRemVal !== undefined) {
    resolvedWidth = widthRemVal * rem;
  } else if (defaultWidth !== undefined) {
    resolvedWidth = defaultWidth;
  } else {
    resolvedWidth = 500;
  }

  let resolvedHeight: number;
  if (heightRemVal !== undefined) {
    resolvedHeight = heightRemVal * rem;
  } else if (defaultHeight !== undefined) {
    resolvedHeight = defaultHeight;
  } else {
    resolvedHeight = 400;
  }

  const isBrowser = typeof window !== 'undefined';
  const innerW = isBrowser ? window.innerWidth : 1024;
  const innerH = isBrowser ? window.innerHeight : 768;

  const mode = initialPositionMode ?? 初始位置模式 ?? 'center';
  const isTopMode = mode === 'top' || mode === '顶部靠上';

  const topMarginVal = topMarginRem ?? 顶部边距rem ?? 4.5;
  const topMarginPx = topMarginVal * rem;

  const initialPosRef = React.useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  if (initialPosRef.current === null) {
    let initX = Math.max(16, (innerW - resolvedWidth) / 2);
    let initY = Math.max(16, (innerH - resolvedHeight) / 2);
    let initH = resolvedHeight;

    if (isTopMode) {
      initY = topMarginPx;
      const maxAvailableH = Math.max(resolvedMinHeight, innerH - initY - 2 * rem);
      initH = Math.min(initH, maxAvailableH);
    }

    initialPosRef.current = {
      x: initX,
      y: initY,
      width: resolvedWidth,
      height: initH,
    };
  }
  const initialPos = initialPosRef.current;
  const currentSizeRef = React.useRef({ width: initialPos.width, height: initialPos.height });

  const shouldAutoFit = autoFitHeight ?? 自动贴高 ?? true;

  const attemptFitHeight = React.useCallback(() => {
    const content = contentRef.current;
    const rnd = rndRef.current;
    if (!shouldAutoFit || !content || !rnd || hasManuallyAdjustedRef.current) return;
    if (typeof window === 'undefined') return;

    // Temporarily release flex-1 / overflow to measure natural scrollHeight
    content.style.flex = 'none';
    content.style.overflow = 'visible';
    const footerH = footerRef.current?.offsetHeight ?? 0;
    const neededH = content.scrollHeight + footerH;
    content.style.flex = '';
    content.style.overflow = '';

    const topOffset = isTopMode ? topMarginPx : 16;
    const bottomMargin = (isTopMode ? 2 : 1) * rem;
    const maxAvailableH = Math.max(resolvedMinHeight, window.innerHeight - topOffset - bottomMargin);

    const targetH = Math.min(Math.max(neededH, resolvedMinHeight), maxAvailableH);
    if (Math.abs(targetH - currentSizeRef.current.height) > 1) {
      currentSizeRef.current = { ...currentSizeRef.current, height: targetH };
      rnd.updateSize({ width: currentSizeRef.current.width, height: targetH });
    }
  }, [shouldAutoFit, isTopMode, topMarginPx, rem, resolvedMinHeight]);

  React.useLayoutEffect(() => {
    attemptFitHeight();
  }, [children, attemptFitHeight]);

  React.useEffect(() => {
    const id = window.setTimeout(attemptFitHeight, 50);
    return () => window.clearTimeout(id);
  }, [children, attemptFitHeight]);

  React.useEffect(() => {
    if (!shouldAutoFit || !contentRef.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      attemptFitHeight();
    });
    ro.observe(contentRef.current);
    if (contentRef.current.firstElementChild) {
      ro.observe(contentRef.current.firstElementChild);
    }
    return () => ro.disconnect();
  }, [shouldAutoFit, attemptFitHeight]);

  // Sync with dynamic defaultHeight when not manually adjusted
  React.useEffect(() => {
    if (hasManuallyAdjustedRef.current || !rndRef.current || typeof window === 'undefined') return;
    const topOffset = isTopMode ? topMarginPx : 16;
    const bottomMargin = (isTopMode ? 2 : 1) * rem;
    const maxAvailableH = Math.max(resolvedMinHeight, window.innerHeight - topOffset - bottomMargin);
    const targetH = Math.min(Math.max(resolvedHeight, resolvedMinHeight), maxAvailableH);

    if (Math.abs(targetH - currentSizeRef.current.height) > 1) {
      currentSizeRef.current = { ...currentSizeRef.current, height: targetH };
      rndRef.current.updateSize({ width: currentSizeRef.current.width, height: targetH });
    }
  }, [resolvedHeight, resolvedMinHeight, isTopMode, topMarginPx, rem]);

  const handleSelectSize = (option: DraggableModalSizeOption) => {
    hasManuallyAdjustedRef.current = true;
    if (typeof window === 'undefined') return;
    const currentInnerW = window.innerWidth;
    const currentInnerH = window.innerHeight;

    let targetW: number;
    let targetH: number;

    const optSpecial = option.special ?? option.特殊;
    if (optSpecial === 'fullscreen' || optSpecial === '全窗口') {
      targetW = currentInnerW - 16;
      targetH = currentInnerH - 16;
    } else if (optSpecial === 'default' || optSpecial === '默认') {
      targetW = initialPos.width;
      targetH = initialPos.height;
    } else {
      const remW = option.widthRem ?? option.宽度rem;
      const remH = option.heightRem ?? option.高度rem;
      const optW = remW !== undefined ? remW * rem : (option.width ?? initialPos.width);
      const optH = remH !== undefined ? remH * rem : (option.height ?? initialPos.height);

      targetW = Math.min(optW, currentInnerW - 16);
      targetH = Math.min(optH, currentInnerH - 16);
    }

    currentSizeRef.current = { width: targetW, height: targetH };
    rndRef.current?.updateSize({ width: targetW, height: targetH });

    const newX = Math.max(8, Math.min((currentInnerW - targetW) / 2, Math.max(8, currentInnerW - targetW - 8)));
    const newY = Math.max(8, Math.min((currentInnerH - targetH) / 2, Math.max(8, currentInnerH - targetH - 8)));
    rndRef.current?.updatePosition({ x: newX, y: newY });
  };

  return (
    <Rnd
      ref={rndRef}
      default={{
        x: initialPos.x,
        y: initialPos.y,
        width: initialPos.width,
        height: initialPos.height,
      }}
      minWidth={resolvedMinWidth}
      minHeight={resolvedMinHeight}
      bounds="window"
      dragHandleClassName={dragHandleClassName}
      cancel={cancelDragSelector}
      data-slot={dataSlot}
      onDragStart={() => {
        hasManuallyAdjustedRef.current = true;
      }}
      onResizeStart={() => {
        hasManuallyAdjustedRef.current = true;
      }}
      onDrag={(e, data) => {
        const root = (e.target as HTMLElement).closest(`[data-slot="${dataSlot}"]`) as HTMLElement | null;
        if (root) {
          root.style.backgroundPosition = `${-data.x}px ${-data.y}px`;
        }
      }}
      onResize={(_e, _direction, ref, _delta, position) => {
        ref.style.backgroundPosition = `${-position.x}px ${-position.y}px`;
      }}
      style={{ display: 'flex', flexDirection: 'column' }}
      className={cn(
        'pointer-events-auto z-50 overflow-hidden rounded-xl border bg-popover text-sm text-popover-foreground shadow-2xl',
        !dragHandleClassName && 'cursor-move',
        className,
      )}
    >
      <div
        ref={contentRef}
        data-slot="draggable-modal-content"
        className={cn('flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6', finalContentClassName)}
      >
        {children}
      </div>

      {finalFixedFooter && (
        <div ref={footerRef} className="shrink-0 border-t border-border/50">
          {finalFixedFooter}
        </div>
      )}

      {(showEscBadge || (effectiveSizeOptions && effectiveSizeOptions.length > 0) || finalTopControls) && (
        <div className="absolute top-3.5 right-3.5 z-30 flex items-center gap-1.5 pointer-events-auto">
          {showEscBadge && (
            <kbd className="pointer-events-none hidden sm:inline-flex h-5.5 select-none items-center rounded-md border border-border/60 bg-muted/60 px-1.5 font-mono text-[0.625rem] text-muted-foreground/80">
              ESC
            </kbd>
          )}
          {effectiveSizeOptions && effectiveSizeOptions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  data-slot="dropdown-menu-trigger"
                  title={effectiveTooltip}
                  aria-label={effectiveTooltip}
                  className="flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <Maximize2Icon className="size-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {effectiveSizeOptions.map((option, idx) => {
                  const label = option.name ?? option.名称 ?? `Option ${idx + 1}`;
                  return (
                    <DropdownMenuItem
                      key={label}
                      onClick={() => handleSelectSize(option)}
                    >
                      {label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {finalTopControls}
        </div>
      )}

      {finalRootExtra}
    </Rnd>
  );
}
