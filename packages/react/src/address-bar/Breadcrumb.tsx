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
import { Tooltip } from '../tooltip/Tooltip';
import { Input } from '../input/Input';

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

    const [subfolderSearch, setSubfolderSearch] = React.useState('');
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [highlightedIndex, setHighlightedIndex] = React.useState(0);
    const [dropdownSize, setDropdownSize] = React.useState({ width: 240, height: 260 });
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const filteredSubfolders = React.useMemo(() => {
      if (!subfolderSearch.trim()) return subfolders;
      const q = subfolderSearch.toLowerCase();
      return subfolders.filter((s) => (s.label || s.displayName || s.path).toLowerCase().includes(q));
    }, [subfolders, subfolderSearch]);

    // Reset overflow, popups, and search when path or open segment changes
    React.useEffect(() => {
      setFirstVisibleIndex(0);
      setOpenIndex(-1);
      setIsOverflowOpen(false);
      setDropdownPos(null);
      setOverflowPos(null);
      setSubfolderSearch('');
      setIsSearchOpen(false);
      setHighlightedIndex(0);
    }, [activePath, segments.length]);

    React.useEffect(() => {
      setSubfolderSearch('');
      setIsSearchOpen(false);
      setHighlightedIndex(0);
    }, [activeOpenIndex, isOverflowOpen]);

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

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [activeOpenIndex, isOverflowOpen]);

    // Keyboard navigation inside open dropdowns
    React.useEffect(() => {
      if (activeOpenIndex < 0 && !isOverflowOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          setOpenIndex(-1);
          setIsOverflowOpen(false);
          setDropdownPos(null);
          setOverflowPos(null);
          return;
        }

        const currentList = activeOpenIndex >= 0 ? filteredSubfolders : segments.slice(0, effectiveFirstIndex);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setHighlightedIndex((prev) => (currentList.length > 0 ? (prev + 1) % currentList.length : 0));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setHighlightedIndex((prev) => (currentList.length > 0 ? (prev - 1 + currentList.length) % currentList.length : 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (currentList.length > 0 && highlightedIndex >= 0 && highlightedIndex < currentList.length) {
            const item = currentList[highlightedIndex]!;
            setOpenIndex(-1);
            setIsOverflowOpen(false);
            setDropdownPos(null);
            setOverflowPos(null);
            onNavigate?.(item.realPath || item.path);
          }
        } else if (
          !isSearchOpen &&
          e.key.length === 1 &&
          !e.ctrlKey &&
          !e.altKey &&
          !e.metaKey
        ) {
          setIsSearchOpen(true);
          setSubfolderSearch(e.key);
          setHighlightedIndex(0);
          requestAnimationFrame(() => {
            searchInputRef.current?.focus();
          });
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeOpenIndex, isOverflowOpen, filteredSubfolders, highlightedIndex, isSearchOpen, effectiveFirstIndex, segments]);

    const handleResizeMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = dropdownSize.width;
      const startH = dropdownSize.height;

      const onMouseMove = (ev: MouseEvent) => {
        setDropdownSize({
          width: Math.max(160, startW + (ev.clientX - startX)),
          height: Math.max(120, startH + (ev.clientY - startY)),
        });
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    const handleChevronClick = (index: number, segPath: string, e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      if (activeOpenIndex === index) {
        setOpenIndex(-1);
        setDropdownPos(null);
      } else {
        const rect = e.currentTarget.getBoundingClientRect();
        setDropdownPos({
          top: rect.bottom + 4,
          left: rect.left,
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
        setOverflowPos({
          top: rect.bottom + 4,
          left: rect.left,
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
              <Tooltip content="显示隐藏的祖先文件夹" side="bottom">
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
              </Tooltip>
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
                {/* Segment Pill (No leading icon, auto-expanding width) */}
                <Tooltip content={seg.realPath || seg.path || seg.label || seg.displayName} side="bottom">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onNavigate?.(seg.realPath || seg.path)}
                    className={cn(
                      'h-7 px-1.5 rounded flex items-center transition-colors cursor-pointer text-sm shrink-0 whitespace-nowrap',
                      isLast
                        ? 'text-foreground font-medium hover:bg-accent/40'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
                      disabled && 'cursor-not-allowed'
                    )}
                  >
                    <span className="whitespace-nowrap">{seg.label || seg.displayName}</span>
                  </button>
                </Tooltip>

                {/* Independent Chevron Trigger */}
                {showChevron && (
                  <Tooltip content={`展开 ${seg.label || seg.displayName} 的子文件夹`} side="bottom">
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
                  </Tooltip>
                )}
              </div>
            );
          })}
        </div>

        {/* Subfolders Dropdown Menu (Portaled to document.body, resizable, keyboard-navigable, with search) */}
        {activeOpenIndex >= 0 && dropdownPos && subfolders.length > 0 && typeof document !== 'undefined' && createPortal(
          <div
            ref={dropdownMenuRef}
            role="menu"
            style={{
              position: 'fixed',
              top: `${dropdownPos.top * 0.0625}rem`,
              left: `${dropdownPos.left * 0.0625}rem`,
              width: `${dropdownSize.width * 0.0625}rem`,
              height: `${dropdownSize.height * 0.0625}rem`,
              zIndex: 9999,
            }}
            className="flex flex-col relative rounded-md border border-border bg-popover text-popover-foreground shadow-lg p-1 animate-in fade-in-0 zoom-in-95"
          >
            {/* Search Box on Type */}
            {isSearchOpen && (
              <div className="p-1 pb-1.5 shrink-0">
                <Input
                  ref={searchInputRef}
                  size="sm"
                  icon="search"
                  placeholder="搜索文件夹..."
                  clearable
                  value={subfolderSearch}
                  onChange={(e) => {
                    setSubfolderSearch(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  onClear={() => {
                    setSubfolderSearch('');
                    setHighlightedIndex(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.stopPropagation();
                      if (subfolderSearch) {
                        setSubfolderSearch('');
                      } else {
                        setIsSearchOpen(false);
                      }
                    }
                  }}
                />
              </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-0.5 min-h-0">
              {filteredSubfolders.map((sub, sIdx) => (
                <button
                  key={`${sub.path}-${sIdx}`}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpenIndex(-1);
                    setDropdownPos(null);
                    onNavigate?.(sub.realPath || sub.path);
                  }}
                  onMouseEnter={() => setHighlightedIndex(sIdx)}
                  className={cn(
                    'w-full h-8 px-2 rounded flex items-center gap-2 text-sm text-foreground cursor-pointer text-left transition-colors',
                    sIdx === highlightedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
                  )}
                >
                  <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{sub.label || sub.displayName}</span>
                </button>
              ))}
              {filteredSubfolders.length === 0 && (
                <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                  未找到匹配项
                </div>
              )}
            </div>

            {/* Drag Resize Grip */}
            <div
              onMouseDown={handleResizeMouseDown}
              className="absolute bottom-0.5 right-0.5 size-3 cursor-se-resize flex items-center justify-center text-muted-foreground/60 hover:text-foreground select-none"
              title="拖拽调整大小"
            >
              <svg className="size-2.5" viewBox="0 0 6 6" fill="currentColor">
                <circle cx="5" cy="5" r="0.8" />
                <circle cx="5" cy="2" r="0.8" />
                <circle cx="2" cy="5" r="0.8" />
              </svg>
            </div>
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
              width: `${dropdownSize.width * 0.0625}rem`,
              height: `${dropdownSize.height * 0.0625}rem`,
              zIndex: 9999,
            }}
            className="flex flex-col relative rounded-md border border-border bg-popover text-popover-foreground shadow-lg p-1 animate-in fade-in-0 zoom-in-95"
          >
            <div className="flex-1 overflow-y-auto space-y-0.5 min-h-0">
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
                  onMouseEnter={() => setHighlightedIndex(sIdx)}
                  className={cn(
                    'w-full h-8 px-2 rounded flex items-center gap-2 text-sm text-foreground cursor-pointer text-left transition-colors',
                    sIdx === highlightedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
                  )}
                >
                  <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{seg.label || seg.displayName}</span>
                </button>
              ))}
            </div>

            {/* Drag Resize Grip */}
            <div
              onMouseDown={handleResizeMouseDown}
              className="absolute bottom-0.5 right-0.5 size-3 cursor-se-resize flex items-center justify-center text-muted-foreground/60 hover:text-foreground select-none"
              title="拖拽调整大小"
            >
              <svg className="size-2.5" viewBox="0 0 6 6" fill="currentColor">
                <circle cx="5" cy="5" r="0.8" />
                <circle cx="5" cy="2" r="0.8" />
                <circle cx="2" cy="5" r="0.8" />
              </svg>
            </div>
          </div>,
          document.body
        )}
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';
