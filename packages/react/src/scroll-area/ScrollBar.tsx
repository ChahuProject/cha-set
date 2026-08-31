import * as React from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cn } from '../lib/utils';
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
      ...props
    },
    ref,
  ) {
    const isVertical = orientation === 'vertical';

    return (
      <BaseScrollArea.Scrollbar
        ref={ref}
        orientation={orientation}
        keepMounted={keepMounted}
        style={{
          ...(isVertical ? { width: toRem(hitSize) } : { height: toRem(hitSize) }),
          ...style,
        }}
        className={cn(
          'group absolute select-none touch-none transition-colors duration-150 z-20',
          isVertical
            ? 'h-full py-0.5 right-0 top-0 bottom-0 bg-transparent hover:bg-muted/30 data-[hovering]:bg-muted/30'
            : 'w-full px-0.5 bottom-0 left-0 right-0 bg-transparent hover:bg-muted/30 data-[hovering]:bg-muted/30',
          className,
        )}
        {...props}
      >
        {showButtons && (
          <div
            className={cn(
              'opacity-0 group-hover:opacity-100 group-data-[hovering]:opacity-100 transition-opacity duration-150 z-30 pointer-events-none group-hover:pointer-events-auto absolute',
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
                'group-hover:bg-muted-foreground/50 group-data-[hovering]:bg-muted-foreground/50 active:bg-foreground/60',
                isVertical
                  ? 'h-full w-1 group-hover:w-2 group-data-[hovering]:w-2'
                  : 'w-full h-1 group-hover:h-2 group-data-[hovering]:h-2',
              )}
            />
          )}
        </BaseScrollArea.Thumb>

        {showButtons && (
          <div
            className={cn(
              'opacity-0 group-hover:opacity-100 group-data-[hovering]:opacity-100 transition-opacity duration-150 z-30 pointer-events-none group-hover:pointer-events-auto absolute',
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
