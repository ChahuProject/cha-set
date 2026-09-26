import * as React from 'react';
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

    // Close subfolder popup on click outside
    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpenIndex(-1);
        }
      };
      if (activeOpenIndex >= 0) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [activeOpenIndex]);

    const handleChevronClick = (index: number, segPath: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      if (activeOpenIndex === index) {
        setOpenIndex(-1);
      } else {
        setOpenIndex(index);
        onOpenSubfolders?.(index, segPath);
      }
    };

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumbs"
        className={cn(
          'flex items-center gap-0.5 overflow-hidden text-sm select-none',
          disabled && 'opacity-60 pointer-events-none',
          className
        )}
        {...props}
      >
        <div ref={containerRef} className="flex items-center gap-0.5 relative flex-wrap">
          {segments.map((seg, idx) => {
            const isLast = idx === segments.length - 1;
            const isMenuOpen = activeOpenIndex === idx;
            const showChevron = !isLast || segments.length === 1 || Boolean(seg.hasSubfolders);

            return (
              <div key={`${seg.path || seg.label}-${idx}`} className="flex items-center relative">
                {/* Segment Pill */}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onNavigate?.(seg.realPath || seg.path)}
                  className={cn(
                    'h-7 px-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer text-sm',
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
                      'size-7 rounded flex items-center justify-center transition-colors cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent/40',
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

                {/* Subfolders Dropdown Menu */}
                {isMenuOpen && subfolders.length > 0 && (
                  <div
                    role="menu"
                    className="absolute top-full left-0 mt-1 min-w-[11.25rem] max-w-[20rem] max-h-[18.75rem] overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md p-1 z-50 animate-in fade-in-0 zoom-in-95"
                  >
                    {subfolders.map((sub, sIdx) => (
                      <button
                        key={`${sub.path}-${sIdx}`}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setOpenIndex(-1);
                          onNavigate?.(sub.realPath || sub.path);
                        }}
                        className="w-full h-8 px-2 rounded flex items-center gap-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer text-left transition-colors"
                      >
                        {getSegmentIcon(sub)}
                        <span className="truncate">{sub.label || sub.displayName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';
