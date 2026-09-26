import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';
import type { PathSegment } from '@chahu/spec/address-bar';
import {
  ChevronRightIcon,
  FolderIcon,
  MonitorIcon,
  PackageIcon,
} from '../lib/icons';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of path segments */
  segments: PathSegment[];
  /** Active path string */
  activePath?: string;
  /** Whether the breadcrumb is disabled */
  disabled?: boolean;
  /** Callback when user clicks a segment to navigate */
  onNavigate?: (path: string) => void;
  /** Callback when user clicks chevron to browse subfolders */
  onOpenSubfolders?: (index: number, path: string) => void;
  /** Direct subfolders for the open segment dropdown */
  subfolders?: PathSegment[];
  /** Controlled currently open chevron segment index (-1 for none) */
  openSegmentIndex?: number;
  /** Callback when open segment changes */
  onOpenSegmentChange?: (index: number) => void;
  /** Maximum number of visible breadcrumb items before collapsing into overflow ellipsis */
  maxVisibleItems?: number;
}

export function getSegmentIcon(segment: PathSegment) {
  if (segment.isRoot || segment.icon === 'monitor' || segment.icon === 'computer') {
    return <MonitorIcon className="size-4 shrink-0 text-muted-foreground" />;
  }
  if (segment.isDrive || segment.icon === 'storage' || segment.icon === 'package') {
    return <PackageIcon className="size-4 shrink-0 text-muted-foreground" />;
  }
  return <FolderIcon className="size-4 shrink-0 text-muted-foreground" />;
}

export const Breadcrumb = React.forwardRef<HTMLDivElement, BreadcrumbProps>(
  (
    {
      className,
      segments,
      activePath,
      disabled = false,
      onNavigate,
      onOpenSubfolders,
      subfolders = [],
      openSegmentIndex: controlledOpenIndex,
      onOpenSegmentChange,
      maxVisibleItems,
      ...props
    },
    ref
  ) => {
    const [internalOpenIndex, setInternalOpenIndex] = React.useState(-1);
    const activeOpenIndex = controlledOpenIndex !== undefined ? controlledOpenIndex : internalOpenIndex;

    const setOpenIndex = (idx: number) => {
      if (controlledOpenIndex === undefined) {
        setInternalOpenIndex(idx);
      }
      onOpenSegmentChange?.(idx);
    };

    const containerRef = React.useRef<HTMLDivElement>(null);
    const [firstVisibleIndex, setFirstVisibleIndex] = React.useState(0);
    const [isOverflowOpen, setIsOverflowOpen] = React.useState(false);
    const [overflowPos, setOverflowPos] = React.useState<{ top: number; left: number } | null>(null);
    const [dropdownPos, setDropdownPos] = React.useState<{ top: number; left: number } | null>(null);
    const overflowBtnRef = React.useRef<HTMLButtonElement>(null);
    const dropdownMenuRef = React.useRef<HTMLDivElement>(null);
    const overflowMenuRef = React.useRef<HTMLDivElement>(null);

    // Reset overflow and popups when path changes
    React.useEffect(() => {
      setFirstVisibleIndex(0);
      setOpenIndex(-1);
      setIsOverflowOpen(false);
      setDropdownPos(null);
      setOverflowPos(null);
    }, [activePath, segments.length]);

    // Dynamic overflow measurement when maxVisibleItems is not specified
    React.useEffect(() => {
      if (maxVisibleItems !== undefined) return;
      const el = containerRef.current;
      if (!el) return;

      const checkOverflow = () => {
        if (!containerRef.current) return;
        const parent = containerRef.current.parentElement;
        if (!parent) return;
        if (containerRef.current.scrollWidth > parent.clientWidth + 2 && segments.length > 2) {
          setFirstVisibleIndex((prev) => Math.min(prev + 1, segments.length - 2));
        }
      };

      const ro = new ResizeObserver(checkOverflow);
      ro.observe(el);
      if (el.parentElement) ro.observe(el.parentElement);
      return () => ro.disconnect();
    }, [segments.length, maxVisibleItems]);

    const effectiveFirstIndex =
      maxVisibleItems !== undefined
        ? Math.max(0, segments.length - maxVisibleItems)
        : firstVisibleIndex;
    const hasOverflow = effectiveFirstIndex > 0;

    // Close popups on click outside or Escape
    React.useEffect(() => {
      if (activeOpenIndex < 0 && !isOverflowOpen) return;

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          dropdownMenuRef.current?.contains(target) ||
          overflowMenuRef.current?.contains(target) ||
          containerRef.current?.contains(target)
        ) {
          return;
        }
        setOpenIndex(-1);
        setIsOverflowOpen(false);
        setDropdownPos(null);
        setOverflowPos(null);
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpenIndex(-1);
          setIsOverflowOpen(false);
          setDropdownPos(null);
          setOverflowPos(null);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [activeOpenIndex, isOverflowOpen]);

    const handleChevronClick = (index: number, segPath: string, e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      if (activeOpenIndex === index) {
        setOpenIndex(-1);
        setDropdownPos(null);
      } else {
        const rect = e.currentTarget.getBoundingClientRect();
        const winWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
        setDropdownPos({
          top: rect.bottom + 4,
          left: Math.max(8, Math.min(rect.left, winWidth - 280)),
        });
        setOpenIndex(index);
        setIsOverflowOpen(false);
        setOverflowPos(null);
        onOpenSubfolders?.(index, segPath);
      }
    };

    const handleOverflowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      if (isOverflowOpen) {
        setIsOverflowOpen(false);
        setOverflowPos(null);
      } else {
        const rect = e.currentTarget.getBoundingClientRect();
        const winWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
        setOverflowPos({
          top: rect.bottom + 4,
          left: Math.max(8, Math.min(rect.left, winWidth - 280)),
        });
        setIsOverflowOpen(true);
        setOpenIndex(-1);
        setDropdownPos(null);
      }
    };

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumbs"
        className={cn(
          'flex items-center text-sm select-none min-w-0 max-w-full',
          disabled && 'opacity-60 pointer-events-none',
          className
        )}
        {...props}
      >
        <div
          ref={containerRef}
          className="flex items-center gap-0.5 relative whitespace-nowrap min-w-0 flex-nowrap"
        >
          {/* Overflow ellipsis button if ancestors are collapsed */}
          {hasOverflow && (
            <div className="flex items-center shrink-0">
              <button
                ref={overflowBtnRef}
                type="button"
                aria-label="Show hidden ancestor folders"
                aria-expanded={isOverflowOpen}
                disabled={disabled}
                onClick={handleOverflowClick}
                className={cn(
                  'h-7 px-1.5 rounded flex items-center justify-center font-bold text-sm text-foreground hover:bg-accent/40 cursor-pointer shrink-0 transition-colors',
                  isOverflowOpen && 'bg-accent text-accent-foreground',
                  disabled && 'cursor-not-allowed'
                )}
              >
                …
              </button>
              <div className="size-7 flex items-center justify-center shrink-0 text-muted-foreground/60">
                <ChevronRightIcon className="size-3.5" />
              </div>
            </div>
          )}

          {segments.map((seg, idx) => {
            if (idx < effectiveFirstIndex) return null;
            const isLast = idx === segments.length - 1;
            const isMenuOpen = activeOpenIndex === idx;
            const showChevron = !isLast || segments.length === 1 || Boolean(seg.hasSubfolders);

            return (
              <div key={`${seg.path || seg.label}-${idx}`} className="flex items-center shrink-0">
                {/* Segment Pill */}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onNavigate?.(seg.realPath || seg.path)}
                  className={cn(
                    'h-7 px-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer text-sm shrink-0 whitespace-nowrap',
                    isLast
                      ? 'text-foreground font-medium hover:bg-accent/40'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
                    disabled && 'cursor-not-allowed'
                  )}
                  title={seg.realPath || seg.path}
                >
                  {getSegmentIcon(seg)}
                  <span className="truncate max-w-[12.5rem]">{seg.label || seg.displayName}</span>
                </button>

                {/* Independent Chevron Trigger */}
                {showChevron && (
                  <button
                    type="button"
                    aria-label={`Open subfolders for ${seg.label || seg.displayName}`}
                    aria-expanded={isMenuOpen}
                    disabled={disabled}
                    onClick={(e) => handleChevronClick(idx, seg.realPath || seg.path, e)}
                    className={cn(
                      'size-7 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent/40',
                      isMenuOpen && 'bg-accent text-accent-foreground',
                      disabled && 'cursor-not-allowed'
                    )}
                  >
                    <ChevronRightIcon
                      className={cn(
                        'size-3.5 transition-transform duration-150',
                        isMenuOpen && 'rotate-90'
                      )}
                    />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Subfolders Dropdown Menu (Portaled to document.body) */}
        {activeOpenIndex >= 0 && dropdownPos && subfolders.length > 0 && typeof document !== 'undefined' && createPortal(
          <div
            ref={dropdownMenuRef}
            role="menu"
            style={{
              position: 'fixed',
              top: `${dropdownPos.top * 0.0625}rem`,
              left: `${dropdownPos.left * 0.0625}rem`,
              zIndex: 9999,
            }}
            className="min-w-[12.5rem] max-w-[20rem] max-h-[18.75rem] overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-lg p-1 animate-in fade-in-0 zoom-in-95"
          >
            {subfolders.map((sub, sIdx) => (
              <button
                key={`${sub.path}-${sIdx}`}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpenIndex(-1);
                  setDropdownPos(null);
                  onNavigate?.(sub.realPath || sub.path);
                }}
                className="w-full h-8 px-2 rounded flex items-center gap-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer text-left transition-colors"
              >
                {getSegmentIcon(sub)}
                <span className="truncate">{sub.label || sub.displayName}</span>
              </button>
            ))}
          </div>,
          document.body
        )}

        {/* Overflow Ancestors Dropdown Menu (Portaled to document.body) */}
        {isOverflowOpen && overflowPos && effectiveFirstIndex > 0 && typeof document !== 'undefined' && createPortal(
          <div
            ref={overflowMenuRef}
            role="menu"
            style={{
              position: 'fixed',
              top: `${overflowPos.top * 0.0625}rem`,
              left: `${overflowPos.left * 0.0625}rem`,
              zIndex: 9999,
            }}
            className="min-w-[12.5rem] max-w-[20rem] max-h-[18.75rem] overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-lg p-1 animate-in fade-in-0 zoom-in-95"
          >
            {segments.slice(0, effectiveFirstIndex).map((seg, sIdx) => (
              <button
                key={`overflow-${seg.path}-${sIdx}`}
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOverflowOpen(false);
                  setOverflowPos(null);
                  onNavigate?.(seg.realPath || seg.path);
                }}
                className="w-full h-8 px-2 rounded flex items-center gap-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer text-left transition-colors"
              >
                {getSegmentIcon(seg)}
                <span className="truncate">{seg.label || seg.displayName}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';
