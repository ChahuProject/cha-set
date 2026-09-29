import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';
import type { PathSegment, AddressBarApi } from '@chahu/spec/address-bar';
import { Breadcrumb } from './Breadcrumb';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  RotateCcwIcon,
  SearchIcon,
  XIcon,
  ClockIcon,
  FolderIcon,
} from '../lib/icons';
import { Tooltip } from '../tooltip/Tooltip';
import { Input } from '../input/Input';

export type { PathSegment, AddressBarApi };

export interface AddressBarFileSystemAdapter {
  /** Enumerate direct subfolders for a path */
  getSubfolders?: (path: string) => Promise<PathSegment[]> | PathSegment[];
  /** Search suggestions for typed text */
  getSuggestions?: (query: string) => Promise<string[]> | string[];
}

export interface AddressBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current path string (controlled) */
  path?: string;
  /** Default path string for uncontrolled usage */
  defaultValue?: string;
  /** Whether to show back, forward, up, and refresh navigation buttons */
  showNavButtons?: boolean;
  /** Whether to show the refresh action button */
  showRefresh?: boolean;
  /** Whether to show right-side search/filter input */
  showSearch?: boolean;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Whether backward navigation is available */
  canGoBack?: boolean;
  /** Whether forward navigation is available */
  canGoForward?: boolean;
  /** Path auto-complete or history suggestions */
  suggestions?: string[];
  /** Recent typed path history */
  history?: string[];
  /** File system adapter for subfolder enumeration and suggestions */
  fileSystemAdapter?: AddressBarFileSystemAdapter;
  /** Disabled state */
  disabled?: boolean;
  /** Callback when user navigates to a new path */
  onNavigate?: (path: string) => void;
  /** Callback when user navigates with a target file selected */
  onNavigateWithSelection?: (path: string, selectionPath: string) => void;
  /** Callback for back button */
  onBack?: () => void;
  /** Callback for forward button */
  onForward?: () => void;
  /** Callback for up (parent directory) button */
  onUp?: () => void;
  /** Callback for refresh button */
  onRefresh?: () => void;
  /** Callback for search input change */
  onSearch?: (query: string) => void;
}

const DEFAULT_VIRTUAL_FS: Record<string, string[]> = {
  '': ['C:/', 'D:/', 'C:/Users/Development/Documents', 'C:/Users/Development/Downloads'],
  '此电脑': ['C:/', 'D:/'],
  '此电脑/': ['C:/', 'D:/'],
  'C:': ['Users', 'Windows', 'Program Files'],
  'C:/': ['Users', 'Windows', 'Program Files'],
  'C:/Users': ['Development', 'Public'],
  'C:/Users/Development': ['cha-set', 'Projects', 'Documents', 'Downloads'],
  'C:/Users/Development/cha-set': ['packages', 'qt', 'spec', 'docs', 'scripts'],
  'C:/Users/Development/Projects': ['cha-set', 'react-app', 'docs'],
  'C:/Users/Development/Projects/cha-set': ['packages', 'qt', 'spec', 'docs', 'scripts'],
  'C:/Users/Development/Projects/cha-set/packages': ['react', 'icons', 'tokens'],
  'C:/Users/Development/Projects/cha-set/qt': ['src', 'tests', 'cmake'],
  'C:/Windows': ['System32', 'Fonts', 'Temp'],
  'D:': ['Media', 'Games', 'Backups'],
  'D:/': ['Media', 'Games', 'Backups'],
};

export const defaultVirtualFileSystemAdapter: AddressBarFileSystemAdapter = {
  getSubfolders: (dirPath: string) => {
    const normalized = (dirPath || '').replace(/\\/g, '/').replace(/\/+$/, '');
    const lookupKey = normalized || (dirPath === '' ? '' : dirPath);
    let children = DEFAULT_VIRTUAL_FS[lookupKey] || DEFAULT_VIRTUAL_FS[`${lookupKey}/`];
    if (!children) {
      const stripped = lookupKey.replace(/^此电脑\/?/, '');
      if (stripped) {
        children = DEFAULT_VIRTUAL_FS[stripped] || DEFAULT_VIRTUAL_FS[`${stripped}/`];
      }
    }
    if (!children || children.length === 0) {
      children = ['Documents', 'Downloads', 'Media', 'Projects'];
    }
    return children.map((name) => {
      const full = lookupKey ? `${lookupKey.endsWith('/') ? lookupKey : `${lookupKey}/`}${name}` : name;
      return {
        label: name.includes('/') ? name.split('/').filter(Boolean).pop() || name : name,
        path: full,
        realPath: full,
        isDrive: name.endsWith(':/') || name.endsWith(':'),
        icon: name.endsWith(':/') ? 'package' : 'folder',
      };
    });
  },
};

export function parsePathSegments(rawPath: string): PathSegment[] {
  if (!rawPath || typeof rawPath !== 'string') return [];
  const normalized = rawPath.replace(/\\/g, '/');

  // Handle explicit "此电脑" root prefix
  if (normalized === '此电脑' || normalized.startsWith('此电脑/')) {
    const rootSeg: PathSegment = {
      label: '此电脑',
      path: '此电脑',
      realPath: '',
      isRoot: true,
      icon: 'computer',
      hasSubfolders: true,
    };
    const rest = normalized.slice('此电脑'.length).replace(/^\/+/, '');
    if (!rest) return [rootSeg];
    const sub = parsePathSegments(rest);
    return [rootSeg, ...sub];
  }

  // Windows drive letter: C:/ or C:/foo/bar
  const winMatch = normalized.match(/^([a-zA-Z]:)(?:\/(.*))?$/);
  if (winMatch) {
    const drive = winMatch[1]!;
    const rest = winMatch[2] || '';
    const segments: PathSegment[] = [
      { label: drive, path: `${drive}/`, realPath: `${drive}/`, isDrive: true, icon: 'package' },
    ];
    if (rest) {
      const parts = rest.split('/').filter(Boolean);
      let accum = `${drive}/`;
      for (const part of parts) {
        accum = `${accum}${accum.endsWith('/') ? '' : '/'}${part}`;
        segments.push({ label: part, path: accum, realPath: accum, icon: 'folder' });
      }
    }
    return segments;
  }

  // POSIX path: /home/user or /
  if (normalized.startsWith('/')) {
    const parts = normalized.split('/').filter(Boolean);
    const segments: PathSegment[] = [{ label: '/', path: '/', realPath: '/', isRoot: true, icon: 'folder' }];
    let accum = '';
    for (const part of parts) {
      accum = `${accum}/${part}`;
      segments.push({ label: part, path: accum, realPath: accum, icon: 'folder' });
    }
    return segments;
  }

  // Relative path or generic token segments: "foo/bar"
  const parts = normalized.split('/').filter(Boolean);
  const segments: PathSegment[] = [];
  let accum = '';
  for (const part of parts) {
    accum = accum ? `${accum}/${part}` : part;
    segments.push({ label: part, path: accum, realPath: accum, icon: 'folder' });
  }
  return segments;
}

export function getParentPath(rawPath: string): string {
  if (!rawPath) return '';
  const normalized = rawPath.replace(/\\/g, '/').replace(/\/+$/, '');
  const lastSlash = normalized.lastIndexOf('/');
  if (lastSlash < 0) return '';
  // Drive letter root: C:
  if (lastSlash === 2 && normalized.charAt(1) === ':') {
    return `${normalized.slice(0, 3)}`;
  }
  if (lastSlash === 0) return '/';
  return normalized.slice(0, lastSlash);
}

function getRootFontSize(): number {
  if (typeof window === 'undefined') return 16;
  return parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
}

export const AddressBar = React.forwardRef<HTMLDivElement, AddressBarProps>(
  (
    {
      className,
      path: controlledPath,
      defaultValue = '',
      showNavButtons = true,
      showRefresh = true,
      showSearch = true,
      searchPlaceholder = '搜索...',
      canGoBack = false,
      canGoForward = false,
      suggestions = [],
      history = [],
      fileSystemAdapter = defaultVirtualFileSystemAdapter,
      disabled = false,
      onNavigate,
      onNavigateWithSelection,
      onBack,
      onForward,
      onUp,
      onRefresh,
      onSearch,
      style,
      ...props
    },
    ref
  ) => {
    const [internalPath, setInternalPath] = React.useState(
      controlledPath !== undefined ? controlledPath : defaultValue
    );
    const activePath = controlledPath !== undefined ? controlledPath : internalPath;

    const [isEditing, setIsEditing] = React.useState(false);
    const [editValue, setEditValue] = React.useState(activePath);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [highlightedIndex, setHighlightedIndex] = React.useState(0);
    const [openSegmentIndex, setOpenSegmentIndex] = React.useState(-1);
    const [subfolders, setSubfolders] = React.useState<PathSegment[]>([]);
    const [popoverPos, setPopoverPos] = React.useState<{ top: number; left: number; width: number } | null>(null);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const popoverRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (isEditing && showSuggestions && containerRef.current) {
        const updatePos = () => {
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            setPopoverPos({
              top: rect.bottom + 4,
              left: rect.left,
              width: Math.min(rect.width, 420),
            });
          }
        };
        updatePos();
        window.addEventListener('resize', updatePos);
        window.addEventListener('scroll', updatePos, true);
        return () => {
          window.removeEventListener('resize', updatePos);
          window.removeEventListener('scroll', updatePos, true);
        };
      } else {
        setPopoverPos(null);
      }
    }, [isEditing, showSuggestions]);

    React.useEffect(() => {
      if (!isEditing) {
        setEditValue(activePath);
      }
    }, [activePath, isEditing]);

    const segments = React.useMemo(() => parsePathSegments(activePath), [activePath]);

    const startEditing = () => {
      if (disabled) return;
      setIsEditing(true);
      setOpenSegmentIndex(-1);
      setEditValue(activePath);
      setShowSuggestions(true);
      setHighlightedIndex(0);
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      });
    };

    const commitEdit = (targetPath: string) => {
      const trimmed = targetPath.trim();
      if (controlledPath === undefined) {
        setInternalPath(trimmed);
      }
      setIsEditing(false);
      setShowSuggestions(false);
      if (trimmed !== activePath) {
        onNavigate?.(trimmed);
      }
    };

    const cancelEdit = () => {
      setIsEditing(false);
      setShowSuggestions(false);
      setEditValue(activePath);
    };

    // Close editing mode on external click and allow immediate re-entry
    React.useEffect(() => {
      if (!isEditing) return;

      const handleDocMouseDown = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          containerRef.current?.contains(target) ||
          popoverRef.current?.contains(target)
        ) {
          return;
        }
        cancelEdit();
      };

      document.addEventListener('mousedown', handleDocMouseDown);
      return () => {
        document.removeEventListener('mousedown', handleDocMouseDown);
      };
    }, [isEditing, activePath]);

    const handleUpClick = () => {
      if (disabled) return;
      const parent = getParentPath(activePath);
      if (controlledPath === undefined) {
        setInternalPath(parent);
      }
      onUp ? onUp() : onNavigate?.(parent);
    };

    // Subfolders loading for breadcrumb chevron
    const handleOpenSubfolders = async (index: number, segPath: string) => {
      if (fileSystemAdapter?.getSubfolders) {
        const res = await fileSystemAdapter.getSubfolders(segPath);
        setSubfolders(res || []);
      }
    };

    // Global keyboard shortcuts (Alt+D or Ctrl+L or F4 to focus address bar)
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (disabled) return;
        if (
          (e.altKey && (e.key === 'd' || e.key === 'D')) ||
          (e.ctrlKey && (e.key === 'l' || e.key === 'L')) ||
          e.key === 'F4'
        ) {
          e.preventDefault();
          startEditing();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [disabled, activePath]);

    // Combined suggestions (typed history + suggestions)
    const combinedSuggestions = React.useMemo(() => {
      const list: Array<{ text: string; icon: 'clock' | 'folder' }> = [];
      const lower = (editValue || '').toLowerCase();

      // Recent history
      for (const h of history) {
        if (!lower || h.toLowerCase().includes(lower)) {
          list.push({ text: h, icon: 'clock' });
        }
      }

      // Suggestions
      for (const s of suggestions) {
        if ((!lower || s.toLowerCase().includes(lower)) && !list.some((item) => item.text === s)) {
          list.push({ text: s, icon: 'folder' });
        }
      }

      return list.slice(0, 12);
    }, [history, suggestions, editValue]);

    return (
      <div
        ref={ref}
        role="toolbar"
        aria-label="Address bar"
        className={cn(
          'relative flex items-center gap-1 h-9 w-full rounded-md border border-border bg-card text-card-foreground px-1 select-none transition-colors text-sm',
          disabled && 'opacity-60 pointer-events-none',
          className
        )}
        style={style}
        {...props}
      >
        {/* Navigation buttons */}
        {showNavButtons && (
          <div className="flex items-center gap-0.5 shrink-0">
            {/* Back Button */}
            <Tooltip content="后退" side="bottom">
              <button
                type="button"
                aria-label="Back"
                disabled={disabled || !canGoBack}
                onClick={onBack}
                className={cn(
                  'size-7 rounded flex items-center justify-center transition-colors',
                  canGoBack && !disabled
                    ? 'text-foreground hover:bg-accent/40 cursor-pointer'
                    : 'text-muted-foreground/40 cursor-not-allowed'
                )}
              >
                <ArrowLeftIcon className="size-3.5" />
              </button>
            </Tooltip>

            {/* Forward Button */}
            <Tooltip content="前进" side="bottom">
              <button
                type="button"
                aria-label="Forward"
                disabled={disabled || !canGoForward}
                onClick={onForward}
                className={cn(
                  'size-7 rounded flex items-center justify-center transition-colors',
                  canGoForward && !disabled
                    ? 'text-foreground hover:bg-accent/40 cursor-pointer'
                    : 'text-muted-foreground/40 cursor-not-allowed'
                )}
              >
                <ArrowRightIcon className="size-3.5" />
              </button>
            </Tooltip>

            {/* Up (Parent) Button */}
            <Tooltip content="上一级" side="bottom">
              <button
                type="button"
                aria-label="Up to parent directory"
                disabled={disabled || !activePath || activePath === '/' || /^[a-zA-Z]:[/\\]?$/.test(activePath)}
                onClick={handleUpClick}
                className={cn(
                  'size-7 rounded flex items-center justify-center transition-colors',
                  activePath && activePath !== '/' && !/^[a-zA-Z]:[/\\]?$/.test(activePath) && !disabled
                    ? 'text-foreground hover:bg-accent/40 cursor-pointer'
                    : 'text-muted-foreground/40 cursor-not-allowed'
                )}
              >
                <ArrowUpIcon className="size-3.5" />
              </button>
            </Tooltip>

            {/* Refresh Button */}
            {showRefresh && (
              <Tooltip content="刷新" side="bottom">
                <button
                  type="button"
                  aria-label="Refresh"
                  disabled={disabled}
                  onClick={onRefresh}
                  className={cn(
                    'size-7 rounded flex items-center justify-center transition-colors',
                    !disabled
                      ? 'text-foreground hover:bg-accent/40 cursor-pointer'
                      : 'text-muted-foreground/40 cursor-not-allowed'
                  )}
                >
                  <RotateCcwIcon className="size-3.5" />
                </button>
              </Tooltip>
            )}

            <div className="w-[0.0625rem] h-4 bg-border mx-0.5" />
          </div>
        )}

        {/* Central Address Bar Field */}
        <div ref={containerRef} className="relative flex-1 flex items-center h-full min-w-0">
          {!isEditing ? (
            <div
              className="flex-1 flex items-center h-full min-w-0 cursor-text overflow-hidden"
              onClick={(e) => {
                if (!(e.target as HTMLElement).closest('button')) {
                  startEditing();
                }
              }}
            >
              <Breadcrumb
                segments={segments}
                activePath={activePath}
                disabled={disabled}
                subfolders={subfolders}
                openSegmentIndex={openSegmentIndex}
                onOpenSegmentChange={setOpenSegmentIndex}
                onNavigate={(targetPath) => {
                  if (controlledPath === undefined) {
                    setInternalPath(targetPath);
                  }
                  onNavigate?.(targetPath);
                }}
                onOpenSubfolders={handleOpenSubfolders}
                className="min-w-0 max-w-full overflow-hidden"
              />

              {/* Blank Area Click to Edit */}
              <div
                onClick={startEditing}
                className="flex-1 h-full min-w-[2rem] cursor-text"
                title="Click to edit address"
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center h-full relative">
              <input
                ref={inputRef}
                type="text"
                aria-label="Address path input"
                value={editValue}
                disabled={disabled}
                onChange={(e) => {
                  setEditValue(e.target.value);
                  setShowSuggestions(true);
                  setHighlightedIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    cancelEdit();
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (
                      showSuggestions &&
                      combinedSuggestions.length > 0 &&
                      highlightedIndex >= 0 &&
                      highlightedIndex < combinedSuggestions.length
                    ) {
                      commitEdit(combinedSuggestions[highlightedIndex]!.text);
                    } else {
                      commitEdit(editValue);
                    }
                  } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setHighlightedIndex((prev) => Math.min(prev + 1, combinedSuggestions.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                  }
                }}
                className="w-full h-7 px-2 text-sm bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground cursor-text"
              />

              {/* Suggestions / History Popover (Portaled to document.body) */}
              {showSuggestions && combinedSuggestions.length > 0 && popoverPos && typeof document !== 'undefined' && createPortal(
                <div
                  ref={popoverRef}
                  role="listbox"
                  style={{
                    position: 'fixed',
                    top: `${(popoverPos.top / getRootFontSize()).toFixed(4)}rem`,
                    left: `${(popoverPos.left / getRootFontSize()).toFixed(4)}rem`,
                    width: `${(popoverPos.width / getRootFontSize()).toFixed(4)}rem`,
                    zIndex: 9999,
                  }}
                  className="max-h-[16.25rem] overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-lg p-1 animate-in fade-in-0 zoom-in-95"
                >
                  {combinedSuggestions.map((item, idx) => (
                    <button
                      key={`${item.text}-${idx}`}
                      type="button"
                      role="option"
                      aria-selected={idx === highlightedIndex}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        commitEdit(item.text);
                      }}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={cn(
                        'w-full h-8 px-2 rounded flex items-center gap-2 text-sm text-foreground cursor-pointer text-left transition-colors',
                        idx === highlightedIndex
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent/50'
                      )}
                    >
                      {item.icon === 'clock' ? (
                        <ClockIcon className="size-3.5 text-muted-foreground shrink-0" />
                      ) : (
                        <FolderIcon className="size-3.5 text-muted-foreground shrink-0" />
                      )}
                      <span className="truncate">{item.text}</span>
                    </button>
                  ))}
                </div>,
                document.body
              )}
            </div>
          )}
        </div>

        {/* Responsive Right Search Input / Collapsible Button */}
        {showSearch && (
          <div className="shrink-0 flex items-center">
            {!isSearchExpanded ? (
              <Tooltip content="搜索" side="bottom">
                <button
                  type="button"
                  aria-label="搜索"
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return;
                    setIsSearchExpanded(true);
                    requestAnimationFrame(() => {
                      searchInputRef.current?.focus();
                    });
                  }}
                  className={cn(
                    'size-7 rounded flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/40 cursor-pointer shrink-0',
                    disabled && 'cursor-not-allowed opacity-60'
                  )}
                >
                  <SearchIcon className="size-3.5" />
                </button>
              </Tooltip>
            ) : (
              <div className="relative flex items-center h-7 w-[11.25rem] rounded-md border border-border bg-card px-2 shrink-0 transition-all duration-150">
                <SearchIcon className="size-3.5 text-muted-foreground mr-1.5 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  disabled={disabled}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    onSearch?.(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.stopPropagation();
                      if (searchQuery) {
                        setSearchQuery('');
                        onSearch?.('');
                      } else {
                        setIsSearchExpanded(false);
                      }
                    }
                  }}
                  onBlur={() => {
                    if (!searchQuery) {
                      setIsSearchExpanded(false);
                    }
                  }}
                  className="flex-1 bg-transparent border-0 outline-none text-xs text-foreground placeholder:text-muted-foreground min-w-0"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      setSearchQuery('');
                      onSearch?.('');
                      searchInputRef.current?.focus();
                    }}
                    className="size-4 rounded-full flex items-center justify-center hover:bg-accent/50 text-muted-foreground hover:text-foreground cursor-pointer shrink-0 ml-1"
                  >
                    <XIcon className="size-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

AddressBar.displayName = 'AddressBar';
