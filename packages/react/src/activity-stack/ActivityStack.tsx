import * as React from 'react';
import { cn } from '../lib/utils';
import { ScrollArea } from '../scroll-area';
import { ChevronDownIcon, ChevronUpIcon } from '../lib/icons';
import type { ActivityPlacement } from '@chahu/spec/shared/placement';

/**
 * One entry of an activity stack.
 *
 * `node` is the caller's rendered card (a `TaskItem` card, a notification card,
 * anything). The stack never inspects it: its only job is to place, order,
 * collapse and animate the entries a host hands it.
 */
export interface ActivityStackEntry {
  /** Stable identity. Keys the enter/exit animation and the DOM node. */
  id: string;
  /** The rendered card. */
  node: React.ReactNode;
  /** Tiny glyph echoed in the collapsed summary row. Falls back to a dot. */
  badge?: React.ReactNode;
}

export interface ActivityStackProps {
  entries: ActivityStackEntry[];
  /** Viewport anchor. */
  placement: ActivityPlacement;
  /** Inset from the anchored viewport edges, in logical units. @default 16 */
  offset?: number;
  /** Cards rendered before the stack overflows into its "show all" pill. @default 3 */
  maxVisible?: number;
  /** Offer the collapse-to-summary-row control. @default true */
  collapsible?: boolean;
  /** Render collapsed on first paint. @default false */
  defaultCollapsed?: boolean;
  /** Accessible name of the region. */
  label: string;
  /**
   * Noun appended to the collapsed row's count, e.g. `进行中` renders
   * `3 项进行中`. Omit for the bare `3 项`.
   */
  summaryLabel?: string;
  /** Live-region politeness. @default 'off' */
  ariaLive?: 'off' | 'polite' | 'assertive';
  /** Notified when the pointer enters or leaves the stack, so hosts can pause timers. */
  onHoverChange?: (hovered: boolean) => void;
  className?: string;
}

/** Exit animation length. Kept in sync with `animate-out-medium`. */
const EXIT_MS = 180;

/** Longest edge of the expanded list before it starts scrolling. */
const EXPANDED_MAX_HEIGHT = 'min(60vh, 32rem)';

type PlacementEdge = 'top' | 'bottom' | 'left' | 'right';
type PlacementAlign = 'left' | 'center' | 'right';

/**
 * A placement is an `<edge>-<align>` pair: the edge is the viewport side the
 * stack hugs, the align is where it sits along the perpendicular axis. Spelling
 * the eight cases out beats parsing, because `left-center` and `top-left` share
 * both words in opposite roles and a `split('-')` silently conflates them.
 */
const PLACEMENT_AXES: Record<ActivityPlacement, { edge: PlacementEdge; align: PlacementAlign }> = {
  'top-left': { edge: 'top', align: 'left' },
  'top-center': { edge: 'top', align: 'center' },
  'top-right': { edge: 'top', align: 'right' },
  'left-center': { edge: 'left', align: 'center' },
  'right-center': { edge: 'right', align: 'center' },
  'bottom-left': { edge: 'bottom', align: 'left' },
  'bottom-center': { edge: 'bottom', align: 'center' },
  'bottom-right': { edge: 'bottom', align: 'right' },
};

const ALIGN_CLASS: Record<PlacementAlign, string> = {
  left: 'items-start',
  center: 'items-center',
  right: 'items-end',
};

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

const isTopAnchored = (placement: ActivityPlacement) => PLACEMENT_AXES[placement].edge === 'top';

function placementStyle(placement: ActivityPlacement, offset: number): React.CSSProperties {
  const { edge, align } = PLACEMENT_AXES[placement];
  const style: React.CSSProperties = {};

  // Vertical edges pin the top/bottom inset and align horizontally. Horizontal
  // edges pin the left/right inset and centre vertically, which is what makes
  // `left-center` hug the left edge instead of drifting to the middle.
  if (edge === 'top') style.top = offset;
  else if (edge === 'bottom') style.bottom = offset;
  else if (edge === 'left') {
    style.left = offset;
    style.top = '50%';
  } else {
    style.right = offset;
    style.top = '50%';
  }

  if (edge === 'left' || edge === 'right') return style;

  if (align === 'left') style.left = offset;
  else if (align === 'right') style.right = offset;
  else style.left = '50%';

  return style;
}

/** Placement transform, kept on the frame so card animations never fight it. */
function placementTransform(placement: ActivityPlacement): string | undefined {
  const { edge, align } = PLACEMENT_AXES[placement];
  if (edge === 'left' || edge === 'right') return 'translateY(-50%)';
  if (align === 'center') return 'translateX(-50%)';
  return undefined;
}

/** `[enter, leave]` travel classes for each anchored edge. */
const SLIDE_TRAVEL: Record<PlacementEdge, [string, string]> = {
  top: ['slide-in-from-top-10', 'slide-out-to-top-10'],
  bottom: ['slide-in-from-bottom-10', 'slide-out-to-bottom-10'],
  left: ['slide-in-from-left-10', 'slide-out-to-left-10'],
  right: ['slide-in-from-right-10', 'slide-out-to-right-10'],
};

/** Direction a card travels when it enters or leaves, away from its anchor. */
function slideClasses(placement: ActivityPlacement, phase: 'in' | 'out'): string {
  const [enter, leave] = SLIDE_TRAVEL[PLACEMENT_AXES[placement].edge];
  return `${phase === 'in' ? 'animate-in animate-in-medium' : 'animate-out animate-out-medium'} fade-${
    phase === 'in' ? 'in' : 'out'
  }-0 ${phase === 'in' ? enter : leave}`;
}

interface TrackedEntry {
  id: string;
  node: React.ReactNode;
  badge?: React.ReactNode;
}

interface ExitingEntry extends TrackedEntry {
  /** Index the entry occupied in the previous ordered list, so it leaves in place. */
  slot: number;
}

/**
 * Viewport-anchored host for floating activity cards.
 *
 * Owns the mechanics that `task-hud` and `notification-stack` would otherwise
 * each re-implement: anchoring across the eight placements, newest-nearest-the-
 * anchor ordering, the overflow pill, expansion into a scrollable list,
 * collapse into a summary row, hover reporting and keyboard traversal.
 *
 * Entries are read as "tail is newest". The stack keeps removed entries mounted
 * for one exit animation, so a dismissed card fades in place instead of
 * vanishing on the frame its data disappears.
 */
export const ActivityStack = React.forwardRef<HTMLDivElement, ActivityStackProps>(function ActivityStack(
  {
    entries,
    placement,
    offset = 16,
    maxVisible = 3,
    collapsible = true,
    defaultCollapsed = false,
    label,
    summaryLabel,
    ariaLive = 'off',
    onHoverChange,
    className,
  },
  ref,
) {
  const [collapsed, setCollapsed] = React.useState(collapsible && defaultCollapsed);
  const [expanded, setExpanded] = React.useState(false);
  const [exiting, setExiting] = React.useState<ExitingEntry[]>([]);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const attachRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const top = isTopAnchored(placement);
  const cap = Math.max(1, Math.floor(maxVisible));

  // Node snapshots of everything currently on screen, so an entry that leaves
  // the `entries` prop can still be rendered once more while it animates out.
  const snapshotsRef = React.useRef(new Map<string, TrackedEntry>());
  const previousIdsRef = React.useRef<string[]>([]);

  const orderedAll: TrackedEntry[] = top ? [...entries].reverse() : entries;
  const orderedVisible = expanded ? orderedAll : orderedAll.slice(-cap);
  const hiddenCount = orderedAll.length - orderedVisible.length;
  const renderedIds = orderedVisible.map((entry) => entry.id);
  const renderedKey = renderedIds.join('\u0000');

  for (const entry of orderedVisible) {
    snapshotsRef.current.set(entry.id, { id: entry.id, node: entry.node, badge: entry.badge });
  }

  // Runs before paint, so a removed entry is never visibly absent for a frame.
  useIsomorphicLayoutEffect(() => {
    const previous = previousIdsRef.current;
    previousIdsRef.current = renderedIds;

    const removed = previous.filter((id) => !renderedIds.includes(id));

    setExiting((current) => {
      const kept = current.filter((entry) => !renderedIds.includes(entry.id));
      const added = removed
        .filter((id) => !kept.some((entry) => entry.id === id))
        .map((id): ExitingEntry | null => {
          const snapshot = snapshotsRef.current.get(id);
          return snapshot ? { ...snapshot, slot: previous.indexOf(id) } : null;
        })
        .filter((entry): entry is ExitingEntry => entry !== null);

      if (kept.length === current.length && added.length === 0) return current;
      return [...kept, ...added];
    });
    // `renderedKey` is the stable, comparable projection of `renderedIds`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderedKey]);

  React.useEffect(() => {
    if (exiting.length === 0) return undefined;
    const timers = exiting.map((entry) =>
      window.setTimeout(() => {
        snapshotsRef.current.delete(entry.id);
        setExiting((current) => current.filter((item) => item.id !== entry.id));
      }, EXIT_MS),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [exiting]);

  const rows = React.useMemo(() => {
    const list: Array<TrackedEntry & { exiting: boolean }> = orderedVisible.map((entry) => ({
      ...entry,
      exiting: false,
    }));
    for (const entry of exiting) {
      list.splice(Math.max(0, Math.min(list.length, entry.slot)), 0, { ...entry, exiting: true });
    }
    return list;
  }, [orderedVisible, exiting]);

  const focusEntry = React.useCallback((direction: 1 | -1 | 'first' | 'last') => {
    const cards = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>('[data-activity-entry]') ?? [],
    );
    if (cards.length === 0) return;
    const active = document.activeElement as HTMLElement | null;
    const current = cards.findIndex((card) => card === active || card.contains(active));

    let next: number;
    if (direction === 'first') next = 0;
    else if (direction === 'last') next = cards.length - 1;
    else if (direction === 1) next = current < 0 ? 0 : Math.min(cards.length - 1, current + 1);
    else next = current < 0 ? cards.length - 1 : Math.max(0, current - 1);

    cards[next]?.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'Escape':
        // Peel one layer at a time: expanded -> capped -> collapsed.
        if (expanded) setExpanded(false);
        else if (collapsible && !collapsed) setCollapsed(true);
        else return;
        event.preventDefault();
        event.stopPropagation();
        return;
      case 'ArrowDown':
        focusEntry(1);
        break;
      case 'ArrowUp':
        focusEntry(-1);
        break;
      case 'Home':
        focusEntry('first');
        break;
      case 'End':
        focusEntry('last');
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  if (rows.length === 0 && !collapsed) return null;

  const enterClass = slideClasses(placement, 'in');
  const exitClass = slideClasses(placement, 'out');
  const pillAtEnd = top;

  const overflowPill = !expanded && hiddenCount > 0 && (
    <button
      type="button"
      data-testid="activity-stack-overflow"
      onClick={() => setExpanded(true)}
      className="pointer-events-auto flex cursor-pointer items-center gap-1 rounded-full border border-border/60 bg-muted/90 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted hover:text-foreground"
    >
      <span>{`还有 ${hiddenCount} 项`}</span>
      {top ? <ChevronDownIcon className="size-3" /> : <ChevronUpIcon className="size-3" />}
    </button>
  );

  const expandGlyph = top ? (
    <ChevronDownIcon className="size-3.5" />
  ) : (
    <ChevronUpIcon className="size-3.5" />
  );

  const summaryRow = (
    <button
      type="button"
      data-testid="activity-stack-toggle"
      aria-expanded={!collapsed}
      onClick={() => setCollapsed((value) => !value)}
      className={cn(
        'pointer-events-auto flex w-full cursor-pointer items-center gap-2 rounded-full border border-border/60 bg-card/95 px-3 py-2 text-xs font-medium text-card-foreground shadow-lg backdrop-blur-md transition-colors hover:bg-muted/80',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        enterClass,
      )}
    >
      <span className="flex items-center gap-1">
        {orderedAll.slice(-MAX_SUMMARY_BADGES).map((entry) => (
          <span key={entry.id} className="flex size-3.5 items-center justify-center">
            {entry.badge ?? <span className="size-1.5 rounded-full bg-muted-foreground/70" />}
          </span>
        ))}
      </span>
      <span className="min-w-0 flex-1 truncate text-left">
        {`${orderedAll.length} 项${summaryLabel ?? ''}`}
      </span>
      {expandGlyph}
    </button>
  );

  return (
    <div
      ref={attachRef}
      role="region"
      aria-label={label}
      aria-live={ariaLive}
      data-testid="activity-stack"
      data-placement={placement}
      data-collapsed={collapsed ? 'true' : 'false'}
      onKeyDown={handleKeyDown}
      onPointerEnter={() => onHoverChange?.(true)}
      onPointerLeave={() => onHoverChange?.(false)}
      style={{ ...placementStyle(placement, offset), transform: placementTransform(placement) }}
      className={cn(
        'pointer-events-none fixed z-50 flex select-none flex-col gap-2.5',
        'w-88 max-w-[calc(100vw-2rem)]',
        ALIGN_CLASS[PLACEMENT_AXES[placement].align],
        className,
      )}
    >
      {collapsed && summaryRow}

      {!collapsed && (
        <div className="flex w-full flex-col gap-2.5">
          {pillAtEnd ? null : overflowPill}

          {expanded ? (
            <ScrollArea
              data-testid="activity-stack-scroll"
              showHorizontalScrollBar={false}
              className="pointer-events-auto w-full rounded-xl"
              style={{ maxHeight: EXPANDED_MAX_HEIGHT }}
            >
              <div className="flex w-full flex-col gap-2.5 pr-1">
                {rows.map((row) => (
                  <ActivityRow
                    key={row.id}
                    id={row.id}
                    exiting={row.exiting}
                    enterClass={enterClass}
                    exitClass={exitClass}
                  >
                    {row.node}
                  </ActivityRow>
                ))}
              </div>
            </ScrollArea>
          ) : (
            rows.map((row) => (
              <ActivityRow
                key={row.id}
                id={row.id}
                exiting={row.exiting}
                enterClass={enterClass}
                exitClass={exitClass}
              >
                {row.node}
              </ActivityRow>
            ))
          )}

          {pillAtEnd ? overflowPill : null}
        </div>
      )}
    </div>
  );
});

/** Badges echoed in the collapsed row before it degrades to "+n". */
const MAX_SUMMARY_BADGES = 5;

interface ActivityRowProps {
  id: string;
  exiting: boolean;
  enterClass: string;
  exitClass: string;
  children: React.ReactNode;
}

/**
 * Focusable wrapper that gives the stack its arrow-key traversal while keeping
 * the tab order inside the cards (buttons, inputs) untouched.
 */
function ActivityRow({ id, exiting, enterClass, exitClass, children }: ActivityRowProps) {
  return (
    <div
      data-activity-entry={id}
      data-exiting={exiting ? 'true' : 'false'}
      tabIndex={-1}
      // `inert` removes the whole departing card from hit-testing and the
      // accessibility tree for the length of its exit animation, which a
      // parent-level `pointer-events-none` cannot do (the card sets its own
      // `pointer-events: auto`).
      inert={exiting || undefined}
      className={cn(
        'rounded-xl outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        exiting ? exitClass : enterClass,
      )}
    >
      {children}
    </div>
  );
}

ActivityStack.displayName = 'ActivityStack';
