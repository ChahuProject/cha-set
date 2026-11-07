import * as React from 'react';
import { cn } from '../lib/utils';
import { GripVerticalIcon, EyeIcon, EyeOffIcon } from '../lib/icons';
import { Tooltip } from '../tooltip';
import type { ReorderableActionColumn, ReorderableListItem } from './types';

export type { ReorderableActionColumn, ReorderableListItem };

export interface ReorderableListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ReorderableListItem[];
  rowHeight?: number;
  reorderable?: boolean;
  actionColumns?: ReorderableActionColumn[];
  defaultActionKey?: string;
  onItemsEdited?: (items: ReorderableListItem[]) => void;
  onActionTriggered?: (index: number, key: string, value: boolean) => void;
  onItemsReordered?: (from: number, to: number, items: ReorderableListItem[]) => void;
}

export const ReorderableList = React.forwardRef<HTMLDivElement, ReorderableListProps>(
  (
    {
      items = [],
      rowHeight = 30,
      reorderable = true,
      actionColumns,
      defaultActionKey = 'visible',
      onItemsEdited,
      onActionTriggered,
      onItemsReordered,
      className,
      ...props
    },
    ref,
  ) => {
    const [dragIndex, setDragIndex] = React.useState<number>(-1);
    const [dragDeltaY, setDragDeltaY] = React.useState<number>(0);
    const dragStartYRef = React.useRef<number>(0);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const effectiveActionColumns: ReorderableActionColumn[] = React.useMemo(() => {
      if (actionColumns && actionColumns.length > 0) return actionColumns;
      return [
        {
          key: defaultActionKey,
          activeIcon: 'visibility',
          inactiveIcon: 'visibility_off',
          tooltip: 'Show/Hide',
          shortcut: 'Alt+Click',
        },
      ];
    }, [actionColumns, defaultActionKey]);

    const moveItem = React.useCallback(
      (from: number, to: number) => {
        if (from < 0 || to < 0 || from === to) return;
        if (from >= items.length || to >= items.length) return;
        const next = [...items];
        const [moved] = next.splice(from, 1);
        if (!moved) return;
        next.splice(to, 0, moved);
        onItemsReordered?.(from, to, next);
        onItemsEdited?.(next);
      },
      [items, onItemsReordered, onItemsEdited],
    );

    const handleActionClick = React.useCallback(
      (targetIndex: number, colKey: string, e: React.MouseEvent) => {
        if (targetIndex < 0 || targetIndex >= items.length) return;
        const isAlt = e.altKey;
        let next: ReorderableListItem[] = [];

        if (isAlt) {
          // Alt+Click: Solo toggle or invert
          let onlyThisActive = true;
          for (let i = 0; i < items.length; ++i) {
            const item = items[i];
            const val = item ? Boolean(item[colKey]) : false;
            if (i === targetIndex) {
              if (!val) onlyThisActive = false;
            } else {
              if (val) onlyThisActive = false;
            }
          }

          if (onlyThisActive) {
            // Already solo: toggle so all other items active, this one disabled
            next = items.map((it, idx) => ({
              ...it,
              [colKey]: idx !== targetIndex,
            }));
            onActionTriggered?.(targetIndex, colKey, false);
          } else {
            // Not solo: solo this one, disable all others
            next = items.map((it, idx) => ({
              ...it,
              [colKey]: idx === targetIndex,
            }));
            onActionTriggered?.(targetIndex, colKey, true);
          }
        } else {
          // Normal toggle
          const targetItem = items[targetIndex];
          const targetNewVal = targetItem ? !Boolean(targetItem[colKey]) : false;
          next = items.map((it, idx) =>
            idx === targetIndex ? { ...it, [colKey]: targetNewVal } : it,
          );
          onActionTriggered?.(targetIndex, colKey, targetNewVal);
        }

        onItemsEdited?.(next);
      },
      [items, onActionTriggered, onItemsEdited],
    );

    const dropSlot = React.useMemo(() => {
      if (dragIndex < 0) return -1;
      return Math.max(
        0,
        Math.min(
          items.length,
          Math.round(((dragIndex + 0.5) * rowHeight + dragDeltaY) / rowHeight),
        ),
      );
    }, [dragIndex, dragDeltaY, items.length, rowHeight]);

    const handlePointerDown = (index: number, e: React.PointerEvent) => {
      if (!reorderable) return;
      if (e.button !== 0) return;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setDragIndex(index);
      setDragDeltaY(0);
      dragStartYRef.current = e.clientY;
    };

    const handlePointerMove = (index: number, e: React.PointerEvent) => {
      if (dragIndex !== index) return;
      const count = items.length;
      const raw = e.clientY - dragStartYRef.current;
      const minDelta = -index * rowHeight;
      const maxDelta = (count - 1 - index) * rowHeight;
      setDragDeltaY(Math.max(minDelta, Math.min(maxDelta, raw)));
    };

    const handlePointerUp = (index: number, e: React.PointerEvent) => {
      if (dragIndex !== index) return;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture release safety
      }
      const from = dragIndex;
      const slot = dropSlot;
      setDragIndex(-1);
      setDragDeltaY(0);
      if (from >= 0 && slot >= 0 && from !== slot && from !== slot - 1) {
        const to = from < slot ? slot - 1 : slot;
        moveItem(from, to);
      }
    };

    const renderActionIcon = (iconName: string | undefined, isActive: boolean) => {
      const name = iconName?.toLowerCase() || (isActive ? 'visibility' : 'visibility_off');
      if (name === 'visibility' || name === 'eye') {
        return <EyeIcon className="size-3.5" />;
      }
      if (name === 'visibility_off' || name === 'eye-off') {
        return <EyeOffIcon className="size-3.5" />;
      }
      return <EyeIcon className="size-3.5" />;
    };

    const isIndicatorVisible =
      dragIndex >= 0 &&
      dropSlot >= 0 &&
      dropSlot !== dragIndex &&
      dropSlot !== dragIndex + 1;

    return (
      <div
        ref={(el) => {
          containerRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        data-slot="reorderable-list"
        className={cn(
          'relative w-full select-none flex flex-col min-w-0 text-foreground',
          className,
        )}
        style={{
          height: `${items.length * rowHeight * 0.0625}rem`,
        }}
        {...props}
      >
        {/* Drop Slot Indicator Line (Centered at Seam with Notch) */}
        {isIndicatorVisible && (
          <div
            data-slot="drop-indicator"
            className="absolute left-0 right-0 z-30 pointer-events-none -translate-y-1/2 h-[0.125rem] bg-primary"
            style={{
              top: `${dropSlot * rowHeight * 0.0625}rem`,
            }}
          >
            <div className="size-1.5 rounded-full bg-primary absolute left-0.5 top-1/2 -translate-y-1/2" />
          </div>
        )}

        {items.map((item, index) => {
          const isDragging = dragIndex === index;
          const label = item.label || item.name || item.id;
          const anyActive = effectiveActionColumns.some((col) => Boolean(item[col.key]));

          return (
            <div
              key={item.id}
              data-slot="reorderable-list-row"
              data-index={index}
              className={cn(
                'absolute left-0 right-0 rounded-md flex items-center px-2 group transition-colors duration-quick ease-standard',
                isDragging
                  ? 'z-20 bg-muted shadow-sm cursor-grabbing text-foreground'
                  : 'z-0 bg-transparent hover:bg-muted/50 text-foreground',
                !anyActive && !isDragging && 'text-muted-foreground',
              )}
              style={{
                top: `${index * rowHeight * 0.0625}rem`,
                height: `${(rowHeight - 2) * 0.0625}rem`,
                transform: isDragging
                  ? `translateY(${dragDeltaY * 0.0625}rem)`
                  : undefined,
              }}
            >
              {/* Drag Handle */}
              {reorderable && (
                <div
                  data-slot="reorderable-grip"
                  className={cn(
                    'flex items-center justify-center size-6 shrink-0 rounded text-muted-foreground hover:text-foreground touch-none',
                    isDragging ? 'cursor-grabbing' : 'cursor-grab',
                  )}
                  onPointerDown={(e) => handlePointerDown(index, e)}
                  onPointerMove={(e) => handlePointerMove(index, e)}
                  onPointerUp={(e) => handlePointerUp(index, e)}
                  onPointerCancel={(e) => handlePointerUp(index, e)}
                >
                  <GripVerticalIcon className="size-3.5" />
                </div>
              )}

              {/* Optional Item Leading Icon */}
              {item.icon && (
                <div className="flex items-center justify-center size-5 shrink-0 ml-1 text-muted-foreground">
                  {typeof item.icon === 'string' ? (
                    <span className="text-xs">{item.icon}</span>
                  ) : (
                    item.icon
                  )}
                </div>
              )}

              {/* Item Label */}
              <div className="flex-1 min-w-0 px-2 text-sm truncate font-normal">
                {label}
              </div>

              {/* Trailing Action Column Buttons */}
              <div className="flex items-center gap-1 shrink-0 ml-auto">
                {effectiveActionColumns.map((col) => {
                  const isActive = Boolean(item[col.key]);
                  const tipText = col.tooltip || 'Show/Hide';
                  const tipShortcut = col.shortcut || 'Alt+Click';

                  return (
                    <Tooltip
                      key={col.key}
                      content={tipText}
                      shortcut={tipShortcut}
                      side="right"
                      delayDuration={300}
                    >
                      <button
                        type="button"
                        data-slot="action-btn"
                        data-action-key={col.key}
                        aria-label={`${tipText} ${label}`}
                        className={cn(
                          'inline-flex items-center justify-center size-6 rounded hover:bg-muted transition-colors duration-quick ease-standard cursor-pointer',
                          isActive
                            ? 'text-primary opacity-100'
                            : 'text-muted-foreground opacity-60 hover:opacity-100',
                        )}
                        onClick={(e) => handleActionClick(index, col.key, e)}
                      >
                        {renderActionIcon(
                          isActive ? col.activeIcon : col.inactiveIcon,
                          isActive,
                        )}
                      </button>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);

ReorderableList.displayName = 'ReorderableList';
