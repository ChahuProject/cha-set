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
import { Kbd, ShortcutBar } from '../kbd';

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

function getRootFontSize(): number {
  if (typeof window === 'undefined') return 16;
  return parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
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
    const measureRef = React.useRef<HTMLDivElement>(null);
    const activeTriggerRef = React.useRef<HTMLElement | null>(null);
    const [firstVisibleIndex, setFirstVisibleIndex] = React.useState(0);
    const [isOverflowOpen, setIsOverflowOpen] = React.useState(false);
    const [dropdownPos, setDropdownPos] = React.useState<{ top: number; left: number } | null>(null);
    const overflowBtnRef = React.useRef<HTMLButtonElement>(null);
    const dropdownMenuRef = React.useRef<HTMLDivElement>(null);
    const overflowMenuRef = React.useRef<HTMLDivElement>(null);

    const [subfolderSearch, setSubfolderSearch] = React.useState('');
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [highlightedIndex, setHighlightedIndex] = React.useState(0);
    const [dropdownWidth, setDropdownWidth] = React.useState(260);
    const [dropdownHeight, setDropdownHeight] = React.useState(260);
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
      activeTriggerRef.current = null;
      setSubfolderSearch('');
      setIsSearchOpen(false);
      setHighlightedIndex(0);
    }, [activePath, segments.length]);

    React.useEffect(() => {
      setSubfolderSearch('');
      setIsSearchOpen(false);
      setHighlightedIndex(0);
    }, [activeOpenIndex]);

    // Dynamic backward-accumulating overflow measurement (Bidirectional)
    React.useEffect(() => {
      if (maxVisibleItems !== undefined) return;
      const el = containerRef.current;
      if (!el) return;

      const checkOverflow = () => {
        if (!containerRef.current) return;
        const navEl = containerRef.current.parentElement;
        if (!navEl) return;

        const count = segments.length;
        if (count <= 1) {
          setFirstVisibleIndex(0);
          return;
        }

        // Measure available width from wrapping container (e.g. address bar center field)
        const hostEl = navEl.parentElement;
        const avail = hostEl ? Math.max(0, hostEl.clientWidth - 24) : navEl.clientWidth;
        if (avail <= 0) return;

        // Measure segment widths from hidden measureRef which always has all segments mounted
        const segWidths: number[] = [];
        if (measureRef.current) {
          const mEls = measureRef.current.querySelectorAll<HTMLElement>('[data-measure-idx]');
          mEls.forEach((item) => {
            const idx = Number(item.dataset.measureIdx);
            if (!isNaN(idx) && item.offsetWidth > 0) {
              segWidths[idx] = item.offsetWidth;
            }
          });
        }

        const overflowW = 34; // ellipsis button + chevron
        const lastW = segWidths[count - 1] || 60;
        let total = lastW;
        let first = count - 1;

        for (let i = count - 2; i >= 0; i--) {
          const w = segWidths[i] || 60;
          const neededOverflow = i > 0 ? overflowW : 0;
          if (total + w + neededOverflow > avail) {
            break;
          }
          total += w;
          first = i;
        }

        setFirstVisibleIndex(first);
      };

      checkOverflow();
      const ro = new ResizeObserver(checkOverflow);
      ro.observe(el);
      if (el.parentElement) ro.observe(el.parentElement);
      if (el.parentElement?.parentElement) ro.observe(el.parentElement.parentElement);
      return () => ro.disconnect();
    }, [segments, maxVisibleItems]);

    const effectiveFirstIndex =
      maxVisibleItems !== undefined
        ? Math.max(0, segments.length - maxVisibleItems)
        : firstVisibleIndex;
    const hasOverflow = effectiveFirstIndex > 0;

    // Dynamically update dropdown position relative to active trigger
    const updateDropdownPos = React.useCallback(() => {
      if (activeOpenIndex < 0 && !isOverflowOpen) return;
      const trigger = activeTriggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const rootFontSize = getRootFontSize();
      const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const winHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

      // Horizontal clamping: ensure menu fits within viewport
      const leftPx = Math.max(8, Math.min(rect.left, winWidth - dropdownWidth - 8));

      // Vertical placement: if not enough room below, open above trigger
      let topPx = rect.bottom + 4;
      if (topPx + dropdownHeight > winHeight - 8 && rect.top - dropdownHeight - 4 > 8) {
        topPx = rect.top - dropdownHeight - 4;
      }

      setDropdownPos({
        top: topPx / rootFontSize,
        left: leftPx / rootFontSize,
      });
    }, [activeOpenIndex, isOverflowOpen, dropdownWidth, dropdownHeight]);

    React.useEffect(() => {
      if (activeOpenIndex < 0 && !isOverflowOpen) return;
      updateDropdownPos();
      window.addEventListener('resize', updateDropdownPos);
      window.addEventListener('scroll', updateDropdownPos, true);
      return () => {
        window.removeEventListener('resize', updateDropdownPos);
        window.removeEventListener('scroll', updateDropdownPos, true);
      };
    }, [activeOpenIndex, isOverflowOpen, updateDropdownPos]);

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
        activeTriggerRef.current = null;
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
          activeTriggerRef.current = null;
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
            activeTriggerRef.current = null;
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

    const handleResizeStart = (e: React.MouseEvent, edge: 'right' | 'bottom' | 'corner') => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const menuEl = activeOpenIndex >= 0 ? dropdownMenuRef.current : overflowMenuRef.current;
      const currentRect = menuEl?.getBoundingClientRect();
      const startW = currentRect ? currentRect.width : dropdownWidth;
      const startH = currentRect ? currentRect.height : dropdownHeight;

      let hasMoved = false;

      const onMouseMove = (ev: MouseEvent) => {
        const deltaX = ev.clientX - startX;
        const deltaY = ev.clientY - startY;
        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
          hasMoved = true;
        }
        if (edge === 'right' || edge === 'corner') {
          setDropdownWidth(Math.max(180, Math.round(startW + deltaX)));
        }
        if (edge === 'bottom' || edge === 'corner') {
          setDropdownHeight(Math.max(100, Math.round(startH + deltaY)));
        }
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        if (hasMoved) {
          // Block any synthetic click that fires right after releasing the drag
          const captureClick = (ev: MouseEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            window.removeEventListener('click', captureClick, true);
          };
          window.addEventListener('click', captureClick, true);
          setTimeout(() => {
            window.removeEventListener('click', captureClick, true);
          }, 100);
        }
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
        activeTriggerRef.current = null;
      } else {
        activeTriggerRef.current = e.currentTarget;
        setOpenIndex(index);
        setIsOverflowOpen(false);
        const rect = e.currentTarget.getBoundingClientRect();
        const rootFontSize = getRootFontSize();
        const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const winHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
        const leftPx = Math.max(8, Math.min(rect.left, winWidth - dropdownWidth - 8));
        let topPx = rect.bottom + 4;
        if (topPx + dropdownHeight > winHeight - 8 && rect.top - dropdownHeight - 4 > 8) {
          topPx = rect.top - dropdownHeight - 4;
        }
        setDropdownPos({
          top: topPx / rootFontSize,
          left: leftPx / rootFontSize,
        });
        onOpenSubfolders?.(index, segPath);
      }
    };

    const handleOverflowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      if (isOverflowOpen) {
        setIsOverflowOpen(false);
        setDropdownPos(null);
        activeTriggerRef.current = null;
      } else {
        activeTriggerRef.current = e.currentTarget;
        setIsOverflowOpen(true);
        setOpenIndex(-1);
        const rect = e.currentTarget.getBoundingClientRect();
        const rootFontSize = getRootFontSize();
        const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const winHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
        const leftPx = Math.max(8, Math.min(rect.left, winWidth - dropdownWidth - 8));
        let topPx = rect.bottom + 4;
        if (topPx + dropdownHeight > winHeight - 8 && rect.top - dropdownHeight - 4 > 8) {
          topPx = rect.top - dropdownHeight - 4;
        }
        setDropdownPos({
          top: topPx / rootFontSize,
          left: leftPx / rootFontSize,
        });
      }
    };

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumbs"
        className={cn(
          'flex items-center text-sm select-none min-w-0 max-w-full overflow-hidden relative',
          disabled && 'opacity-60 pointer-events-none',
          className
        )}
        {...props}
      >
        {/* Off-screen measurement container to accurately compute all segment widths without collapsing (skipped in test runner to prevent duplicate text queries) */}
        {!(typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') && (
          <div
            ref={measureRef}
            className="absolute top-0 left-0 invisible pointer-events-none flex items-center gap-0.5 whitespace-nowrap h-0 overflow-hidden"
            aria-hidden="true"
          >
            {segments.map((seg, idx) => (
              <div key={`measure-${idx}`} data-measure-idx={idx} className="flex items-center shrink-0">
                <span className="h-7 px-1.5 flex items-center text-sm whitespace-nowrap">
                  {seg.label || seg.displayName}
                </span>
                {(!idx || idx < segments.length - 1 || segments.length === 1 || Boolean(seg.hasSubfolders)) && (
                  <span className="size-7 flex items-center justify-center shrink-0">
                    <ChevronRightIcon className="size-3.5" />
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

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
              <div key={`${seg.path || seg.label}-${idx}`} data-seg-idx={idx} className="flex items-center shrink-0">
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
        {activeOpenIndex >= 0 && dropdownPos && typeof document !== 'undefined' && createPortal(
          <div
            ref={dropdownMenuRef}
            role="menu"
            style={{
              position: 'fixed',
              top: `${dropdownPos.top.toFixed(4)}rem`,
              left: `${dropdownPos.left.toFixed(4)}rem`,
              width: `${(dropdownWidth / getRootFontSize()).toFixed(4)}rem`,
              height: `${(dropdownHeight / getRootFontSize()).toFixed(4)}rem`,
              zIndex: 9999,
            }}
            className="flex flex-col relative rounded-md border border-border bg-popover text-popover-foreground shadow-lg p-0 overflow-hidden animate-in fade-in-0 zoom-in-95 select-none"
          >
            {/* Search Box on Type */}
            {isSearchOpen && (
              <div className="p-1.5 pb-1 border-b border-border shrink-0">
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
            <div className="flex-1 overflow-y-auto p-1 space-y-0.5 min-h-0">
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
                <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                  {subfolderSearch ? '未找到匹配文件夹' : '（空文件夹）'}
                </div>
              )}
            </div>

            {/* Bottom Keyboard Shortcut Bar (flush at bottom) */}
            <ShortcutBar
              preset="address-bar"
              className="w-full shrink-0 border-t border-border bg-muted/40 px-2 py-1"
            />


            {/* True Border Drag Resize Handles */}
            <div
              onMouseDown={(e) => handleResizeStart(e, 'right')}
              className="absolute top-0 right-0 bottom-0 w-1.5 cursor-col-resize z-50 select-none"
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 'bottom')}
              className="absolute bottom-0 left-0 right-0 h-1.5 cursor-row-resize z-50 select-none"
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 'corner')}
              className="absolute bottom-0 right-0 size-3 cursor-se-resize z-50 select-none"
            />
          </div>,
          document.body
        )}

        {/* Overflow Ancestors Dropdown Menu (Portaled to document.body) */}
        {isOverflowOpen && dropdownPos && effectiveFirstIndex > 0 && typeof document !== 'undefined' && createPortal(
          <div
            ref={overflowMenuRef}
            role="menu"
            style={{
              position: 'fixed',
              top: `${dropdownPos.top.toFixed(4)}rem`,
              left: `${dropdownPos.left.toFixed(4)}rem`,
              width: `${(dropdownWidth / getRootFontSize()).toFixed(4)}rem`,
              height: `${(dropdownHeight / getRootFontSize()).toFixed(4)}rem`,
              zIndex: 9999,
            }}
            className="flex flex-col relative rounded-md border border-border bg-popover text-popover-foreground shadow-lg p-0 overflow-hidden animate-in fade-in-0 zoom-in-95 select-none"
          >
            <div className="flex-1 overflow-y-auto p-1 space-y-0.5 min-h-0">
              {segments.slice(0, effectiveFirstIndex).map((seg, sIdx) => (
                <button
                  key={`overflow-${seg.path}-${sIdx}`}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsOverflowOpen(false);
                    setDropdownPos(null);
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

            {/* Bottom Keyboard Shortcut Bar (flush at bottom) */}
            <ShortcutBar
              preset="address-bar"
              className="w-full shrink-0 border-t border-border bg-muted/40 px-2 py-1"
            />


            {/* True Border Drag Resize Handles */}
            <div
              onMouseDown={(e) => handleResizeStart(e, 'right')}
              className="absolute top-0 right-0 bottom-0 w-1.5 cursor-col-resize z-50 select-none"
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 'bottom')}
              className="absolute bottom-0 left-0 right-0 h-1.5 cursor-row-resize z-50 select-none"
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 'corner')}
              className="absolute bottom-0 right-0 size-3 cursor-se-resize z-50 select-none"
            />
          </div>,
          document.body
        )}
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';
