import * as React from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cn } from '../lib/utils';
import { useScrollAreaContext } from './context';
import { ScrollBarStartCluster, ScrollBarEndCluster } from './ScrollBarButtons';

export interface ScrollBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Scrollbar orientation. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  /** Scrollbar density and scale. @default 'default' */
  size?: 'default' | 'sm';
  /** Whether to show to-top/bottom & page-up/down stepper buttons. @default true */
  showButtons?: boolean;
  /** Viewport scroll step ratio for page buttons. @default 0.85 */
  pageStepRatio?: number;
  /** Whether stepper buttons trigger smooth scrolling. @default true */
  smoothScroll?: boolean;
  /** Custom hot zone thickness in rem string or scale value. @default 8 (0.5rem) */
  hitSize?: number | string;
  /** Collapsed indicator thickness in rem string or scale value. @default 4 (0.25rem) */
  collapsedSize?: number | string;
  /** Expanded indicator thickness in rem string or scale value. @default 8 (0.5rem) */
  expandedSize?: number | string;
  /** Whether to keep mounted in DOM when hidden. @default false */
  keepMounted?: boolean;
  /** Whether to automatically hide when content does not overflow. @default true */
  autoHide?: boolean;
  /** Whether the scrollbar floats over viewport content. If false, it occupies dedicated layout space. @default true */
  floating?: boolean;
  /** Force scrollbar into hovered visual state (for deterministic testing). */
  forceHover?: boolean;
  /** Force scrollbar into active/dragging visual state (for deterministic testing). */
  forceActive?: boolean;
  /** Force stepper buttons into specific state (for deterministic testing). */
  forceButtonState?: 'idle' | 'hover' | 'active';
}

function toRem(val?: number | string): string | undefined {
  if (val === undefined) return undefined;
  if (typeof val === 'number') return `${val / 16}rem`;
  return val;
}

export const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
  function ScrollBar(
    {
      className,
      orientation = 'vertical',
      size = 'default',
      showButtons = true,
      pageStepRatio = 0.85,
      smoothScroll = true,
      hitSize = size === 'sm' ? 6 : 8,
      collapsedSize = size === 'sm' ? 2 : 4,
      expandedSize = size === 'sm' ? 6 : 8,
      keepMounted = false,
      autoHide = true,
      floating = true,
      forceHover = false,
      forceActive = false,
      forceButtonState,
      children,
      style,
      ...props
    },
    ref,
  ) {
    const isVertical = orientation === 'vertical';
    const ctx = useScrollAreaContext();
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const [trackSize, setTrackSize] = React.useState<number>(0);

    const setRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    const hasOverflow = ctx
      ? isVertical
        ? ctx.scrollState.hasOverflowY
        : ctx.scrollState.hasOverflowX
      : true;

    React.useEffect(() => {
      const el = localRef.current;
      if (!el) return;
      const measure = () => {
        setTrackSize(isVertical ? el.clientHeight : el.clientWidth);
      };
      measure();
      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
      }
    }, [isVertical]);

    const isExpanded = forceHover || forceActive;

    const effectiveTrackSize =
      trackSize || (ctx ? (isVertical ? ctx.scrollState.clientHeight : ctx.scrollState.clientWidth) : 0) || 100;
    const isAtStart = ctx ? (isVertical ? ctx.scrollState.isAtTop : ctx.scrollState.isAtLeft) : false;
    const isAtEnd = ctx ? (isVertical ? ctx.scrollState.isAtBottom : ctx.scrollState.isAtRight) : false;

    // Calculate thumb position and bounds for proximity hiding of floating stepper buttons
    const { isStartToNear, isStartPageNear, isEndPageNear, isEndToNear } = React.useMemo(() => {
      if (!ctx) {
        return { isStartToNear: false, isStartPageNear: false, isEndPageNear: false, isEndToNear: false };
      }
      if (isAtStart) {
        return { isStartToNear: true, isStartPageNear: true, isEndPageNear: false, isEndToNear: false };
      }
      if (isAtEnd) {
        return { isStartToNear: false, isStartPageNear: false, isEndPageNear: true, isEndToNear: true };
      }

      const viewportSize = isVertical ? ctx.scrollState.clientHeight : ctx.scrollState.clientWidth;
      const contentSize = isVertical ? ctx.scrollState.scrollHeight : ctx.scrollState.scrollWidth;
      const scrollPos = isVertical ? ctx.scrollState.scrollTop : ctx.scrollState.scrollLeft;
      const maxScroll = Math.max(1, contentSize - viewportSize);
      const scrollRatio = Math.max(0, Math.min(1, scrollPos / maxScroll));

      const ratio = viewportSize / Math.max(1, contentSize);
      const minThumb = 16;
      const thumbLength = Math.max(minThumb, effectiveTrackSize * ratio);
      const maxThumbOffset = Math.max(0, effectiveTrackSize - thumbLength);
      const thumbStart = scrollRatio * maxThumbOffset;
      const thumbEnd = thumbStart + thumbLength;

      const btnSize = 10;
      const buffer = 4;

      return {
        isStartToNear: thumbStart <= btnSize + buffer,
        isStartPageNear: thumbStart <= btnSize * 2 + buffer,
        isEndPageNear: thumbEnd >= effectiveTrackSize - btnSize * 2 - buffer,
        isEndToNear: thumbEnd >= effectiveTrackSize - btnSize - buffer,
      };
    }, [ctx, isVertical, isAtStart, isAtEnd, effectiveTrackSize]);

    if (autoHide && !hasOverflow && !keepMounted) {
      return null;
    }

    return (
      <div
        ref={setRef}
        data-orientation={orientation}
        data-size={size}
        data-floating={floating ? 'true' : 'false'}
        data-has-overflow={hasOverflow ? '' : undefined}
        style={{
          ...(floating
            ? (isVertical
                ? {
                    width: toRem(hitSize),
                    top: 0,
                    bottom: 'var(--scroll-area-corner-height, 0px)',
                    right: 0,
                  }
                : {
                    height: toRem(hitSize),
                    left: 0,
                    right: 'var(--scroll-area-corner-width, 0px)',
                    bottom: 0,
                  })
            : (isVertical
                ? {
                    width: toRem(hitSize),
                    height: '100%',
                  }
                : {
                    height: toRem(hitSize),
                    width: '100%',
                  })),
          ...(!hasOverflow ? { display: 'none' } : undefined),
          ...style,
        }}
        className={cn(
          'group select-none touch-none transition-colors duration-short ease-standard z-20',
          floating ? 'absolute' : 'relative shrink-0',
          !hasOverflow && 'hidden',
          isVertical
            ? floating
              ? 'hover:bg-muted/80'
              : 'bg-muted/30 border-l border-border/40 hover:bg-muted/60'
            : floating
              ? 'hover:bg-muted/80'
              : 'bg-muted/30 border-t border-border/40 hover:bg-muted/60',
          isExpanded && (floating ? 'bg-muted/80' : 'bg-muted/60'),
          className,
        )}
        {...props}
      >
        <BaseScrollArea.Scrollbar
          orientation={orientation}
          keepMounted={true}
          style={{
            position: 'absolute',
            inset: 0,
            ...(isVertical ? { width: '100%', height: '100%' } : { height: '100%', width: '100%' }),
          }}
          className={cn(
            'size-full cursor-pointer select-none touch-none',
            isVertical ? 'w-full py-0.5' : 'h-full px-0.5',
          )}
        >
          <BaseScrollArea.Thumb
            className={cn(
              'absolute z-20 flex items-center justify-center cursor-pointer',
              isVertical ? 'top-0 inset-x-0 min-h-4 my-0.5' : 'left-0 inset-y-0 min-w-4 mx-0.5',
            )}
          >
            {children ?? (
              <div
                className={cn(
                  'rounded-full bg-border transition-[width,height,background-color] duration-short ease-standard',
                  'group-hover:bg-muted-foreground/50 active:bg-foreground/60',
                  isVertical ? 'h-full w-1 group-hover:w-2' : 'w-full h-1 group-hover:h-2',
                  isExpanded && (isVertical ? 'w-2' : 'h-2'),
                  forceHover && !forceActive && 'bg-muted-foreground/50',
                  forceActive && 'bg-foreground/60',
                )}
              />
            )}
          </BaseScrollArea.Thumb>
        </BaseScrollArea.Scrollbar>

        {showButtons && (
          <div
            className={cn(
              'absolute z-30 transition-opacity duration-short ease-standard',
              isVertical ? 'top-0 inset-x-0 h-5' : 'left-0 inset-y-0 w-5',
              isStartToNear && isStartPageNear ? 'pointer-events-none' : 'pointer-events-auto',
            )}
          >
            <ScrollBarStartCluster
              orientation={orientation}
              pageStepRatio={pageStepRatio}
              smoothScroll={smoothScroll}
              forceState={forceButtonState}
              isParentExpanded={isExpanded}
              hideToStart={isStartToNear}
              hidePageBack={isStartPageNear}
            />
          </div>
        )}

        {showButtons && (
          <div
            className={cn(
              'absolute z-30 transition-opacity duration-short ease-standard',
              isVertical ? 'bottom-0 inset-x-0 h-5' : 'right-0 inset-y-0 w-5',
              isEndPageNear && isEndToNear ? 'pointer-events-none' : 'pointer-events-auto',
            )}
          >
            <ScrollBarEndCluster
              orientation={orientation}
              pageStepRatio={pageStepRatio}
              smoothScroll={smoothScroll}
              forceState={forceButtonState}
              isParentExpanded={isExpanded}
              hidePageForward={isEndPageNear}
              hideToEnd={isEndToNear}
            />
          </div>
        )}
      </div>
    );
  },
);
