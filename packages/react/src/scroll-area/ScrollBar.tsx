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
  /** Custom hot zone thickness in pixels. @default 16 */
  hitSize?: number;
  /** Collapsed indicator thickness in pixels. @default 6 */
  collapsedSize?: number;
  /** Expanded indicator thickness in pixels. @default 12 */
  expandedSize?: number;
}

export const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
  function ScrollBar(
    {
      className,
      orientation = 'vertical',
      showButtons = true,
      pageStepRatio = 0.85,
      smoothScroll = true,
      hitSize = 16,
      collapsedSize = 6,
      expandedSize = 12,
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
          ...(isVertical ? { width: hitSize } : { height: hitSize }),
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
              isVertical ? 'top-0 inset-x-0' : 'left-0 inset-y-0',
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
            isVertical ? 'top-0 inset-x-0 min-h-6' : 'left-0 inset-y-0 min-w-6',
          )}
        >
          {children ?? (
            <div
              className={cn(
                'rounded-full bg-border transition-all duration-150',
                'group-hover:bg-muted-foreground/50 group-data-[hovering]:bg-muted-foreground/50 active:bg-foreground/60',
                isVertical
                  ? 'h-full w-1.5 group-hover:w-3 group-data-[hovering]:w-3'
                  : 'w-full h-1.5 group-hover:h-3 group-data-[hovering]:h-3',
              )}
            />
          )}
        </BaseScrollArea.Thumb>

        {showButtons && (
          <div
            className={cn(
              'opacity-0 group-hover:opacity-100 group-data-[hovering]:opacity-100 transition-opacity duration-150 z-30 pointer-events-none group-hover:pointer-events-auto absolute',
              isVertical ? 'bottom-0 inset-x-0' : 'right-0 inset-y-0',
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
