import * as React from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cn } from '../lib/utils';
import { useScrollAreaContext } from './context';
import { ScrollBarStartCluster, ScrollBarEndCluster } from './ScrollBarButtons';

export interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<typeof BaseScrollArea.Scrollbar> {
  /** Whether to show to-top/bottom & page-up/down stepper buttons. @default true */
  showButtons?: boolean;
  /** Viewport scroll step ratio for page buttons. @default 0.85 */
  pageStepRatio?: number;
  /** Whether stepper buttons trigger smooth scrolling. @default true */
  smoothScroll?: boolean;
  /** Custom hot zone thickness in pixels or rem string. @default 8 (0.5rem) */
  hitSize?: number | string;
  /** Collapsed indicator thickness in pixels or rem string. @default 4 (0.25rem) */
  collapsedSize?: number | string;
  /** Expanded indicator thickness in pixels or rem string. @default 8 (0.5rem) */
  expandedSize?: number | string;
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
      showButtons = true,
      pageStepRatio = 0.85,
      smoothScroll = true,
      hitSize = 8,
      collapsedSize = 4,
      expandedSize = 8,
      keepMounted = true,
      children,
      style,
      onPointerDown,
      ...props
    },
    ref,
  ) {
    const isVertical = orientation === 'vertical';
    const ctx = useScrollAreaContext();

    const handleTrackPointerDown = React.useCallback(
      (event: any) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || event.button !== 0) return;

        const target = event.target as HTMLElement | null;
        const currentTarget = event.currentTarget as HTMLElement | null;
        if (!currentTarget) return;

        // If clicking on the thumb or stepper buttons, let default dragging / button handlers proceed
        const thumbEl = currentTarget.querySelector('[data-state]') as HTMLElement | null;
        if (thumbEl && (thumbEl === target || thumbEl.contains(target))) {
          return;
        }
        if (target?.closest('button')) {
          return;
        }

        const viewportEl = ctx?.viewportRef.current;
        if (!viewportEl) return;

        // Prevent Base UI's erroneous track calculation
        event.preventDefault();

        const trackRect = currentTarget.getBoundingClientRect();
        const scrollableSize = isVertical ? viewportEl.scrollHeight : viewportEl.scrollWidth;
        const viewportSize = isVertical ? viewportEl.clientHeight : viewportEl.clientWidth;
        const maxScrollDistance = scrollableSize - viewportSize;
        if (maxScrollDistance <= 0) return;

        // 20px stepper button clearance when showButtons is true, 2px padding when false
        const buttonOffset = showButtons ? 20 : 2;
        const thumbSizePx = isVertical
          ? (thumbEl?.offsetHeight || 24)
          : (thumbEl?.offsetWidth || 24);

        const trackSize = isVertical ? trackRect.height : trackRect.width;
        const availableTrack = trackSize - thumbSizePx - buttonOffset * 2;
        if (availableTrack <= 0) return;

        const clickCoord = isVertical ? event.clientY - trackRect.top : event.clientX - trackRect.left;
        const targetThumbOffset = clickCoord - buttonOffset - thumbSizePx / 2;
        const scrollRatio = Math.max(0, Math.min(1, targetThumbOffset / availableTrack));
        const targetScroll = scrollRatio * maxScrollDistance;

        if (isVertical) {
          if (typeof viewportEl.scrollTo === 'function') {
            viewportEl.scrollTo({ top: targetScroll, behavior: smoothScroll ? 'smooth' : 'auto' });
          } else {
            viewportEl.scrollTop = targetScroll;
          }
        } else {
          if (typeof viewportEl.scrollTo === 'function') {
            viewportEl.scrollTo({ left: targetScroll, behavior: smoothScroll ? 'smooth' : 'auto' });
          } else {
            viewportEl.scrollLeft = targetScroll;
          }
        }
      },
      [ctx, isVertical, onPointerDown, showButtons, smoothScroll],
    );

    return (
      <BaseScrollArea.Scrollbar
        ref={ref}
        orientation={orientation}
        keepMounted={keepMounted}
        onPointerDown={handleTrackPointerDown}
        style={{
          ...(isVertical ? { width: toRem(hitSize) } : { height: toRem(hitSize) }),
          ...style,
        }}
        className={cn(
          'group select-none touch-none transition-colors duration-150 z-20',
          isVertical
            ? 'py-0.5 bg-transparent hover:bg-muted/30'
            : 'px-0.5 bg-transparent hover:bg-muted/30',
          className,
        )}
        {...props}
      >
        {showButtons && (
          <div
            className={cn(
              'opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-30 pointer-events-none group-hover:pointer-events-auto absolute',
              isVertical ? 'top-0 inset-x-0 h-5' : 'left-0 inset-y-0 w-5',
            )}
          >
            <ScrollBarStartCluster
              orientation={orientation}
              pageStepRatio={pageStepRatio}
              smoothScroll={smoothScroll}
            />
          </div>
        )}

        <BaseScrollArea.Thumb
          className={cn(
            'absolute z-20 flex items-center justify-center cursor-pointer transition-all duration-150',
            isVertical
              ? cn('top-0 inset-x-0 min-h-4', showButtons ? 'my-5' : 'my-0.5')
              : cn('left-0 inset-y-0 min-w-4', showButtons ? 'mx-5' : 'mx-0.5'),
          )}
        >
          {children ?? (
            <div
              className={cn(
                'rounded-full bg-border transition-all duration-150',
                'group-hover:bg-muted-foreground/50 active:bg-foreground/60',
                isVertical
                  ? 'h-full w-1 group-hover:w-2'
                  : 'w-full h-1 group-hover:h-2',
              )}
            />
          )}
        </BaseScrollArea.Thumb>

        {showButtons && (
          <div
            className={cn(
              'opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-30 pointer-events-none group-hover:pointer-events-auto absolute',
              isVertical ? 'bottom-0 inset-x-0 h-5' : 'right-0 inset-y-0 w-5',
            )}
          >
            <ScrollBarEndCluster
              orientation={orientation}
              pageStepRatio={pageStepRatio}
              smoothScroll={smoothScroll}
            />
          </div>
        )}
      </BaseScrollArea.Scrollbar>
    );
  },
);
