import * as React from 'react';
import { cn } from '../lib/utils';
import type { PathSegment, AddressBarApi } from '../../../../spec/components/address-bar';

export type { PathSegment, AddressBarApi };

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
  /** Whether backward navigation is available */
  canGoBack?: boolean;
  /** Whether forward navigation is available */
  canGoForward?: boolean;
  /** Path auto-complete or history suggestions */
  suggestions?: string[];
  /** Disabled state */
  disabled?: boolean;
  /** Callback when user navigates to a new path */
  onNavigate?: (path: string) => void;
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

export function parsePathSegments(rawPath: string): PathSegment[] {
  if (!rawPath || typeof rawPath !== 'string') return [];
  const normalized = rawPath.replace(/\\/g, '/');

  // Windows drive letter: C:/ or C:/foo/bar
  const winMatch = normalized.match(/^([a-zA-Z]:)(?:\/(.*))?$/);
  if (winMatch) {
    const drive = winMatch[1];
    const rest = winMatch[2] || '';
    const segments: PathSegment[] = [{ label: drive, path: `${drive}/` }];
    if (rest) {
      const parts = rest.split('/').filter(Boolean);
      let accum = `${drive}/`;
      for (const part of parts) {
        accum = `${accum}${accum.endsWith('/') ? '' : '/'}${part}`;
        segments.push({ label: part, path: accum });
      }
    }
    return segments;
  }

  // POSIX path: /home/user or /
  if (normalized.startsWith('/')) {
    const parts = normalized.split('/').filter(Boolean);
    const segments: PathSegment[] = [{ label: '/', path: '/' }];
    let accum = '';
    for (const part of parts) {
      accum = `${accum}/${part}`;
      segments.push({ label: part, path: accum });
    }
    return segments;
  }

  // Relative path or generic token segments: "foo/bar"
  const parts = normalized.split('/').filter(Boolean);
  const segments: PathSegment[] = [];
  let accum = '';
  for (const part of parts) {
    accum = accum ? `${accum}/${part}` : part;
    segments.push({ label: part, path: accum });
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

export const AddressBar = React.forwardRef<HTMLDivElement, AddressBarProps>(
  (
    {
      className,
      path: controlledPath,
      defaultValue = '',
      showNavButtons = true,
      showRefresh = true,
      showSearch = false,
      canGoBack = false,
      canGoForward = false,
      suggestions = [],
      disabled = false,
      onNavigate,
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
    const [showSuggestions, setShowSuggestions] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!isEditing) {
        setEditValue(activePath);
      }
    }, [activePath, isEditing]);

    const segments = React.useMemo(() => parsePathSegments(activePath), [activePath]);

    const startEditing = () => {
      if (disabled) return;
      setIsEditing(true);
      setEditValue(activePath);
      setShowSuggestions(suggestions.length > 0);
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

    const handleSegmentClick = (segmentPath: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      if (controlledPath === undefined) {
        setInternalPath(segmentPath);
      }
      onNavigate?.(segmentPath);
    };

    const handleUpClick = () => {
      if (disabled) return;
      const parent = getParentPath(activePath);
      if (parent) {
        if (controlledPath === undefined) {
          setInternalPath(parent);
        }
        onUp ? onUp() : onNavigate?.(parent);
      }
    };

    // Global keyboard shortcuts (Alt+D or Ctrl+L to focus address bar)
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (disabled) return;
        if ((e.altKey && (e.key === 'd' || e.key === 'D')) || (e.ctrlKey && (e.key === 'l' || e.key === 'L'))) {
          e.preventDefault();
          startEditing();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [disabled, activePath]);

    const filteredSuggestions = React.useMemo(() => {
      if (!suggestions.length || !editValue) return suggestions;
      const lower = editValue.toLowerCase();
      return suggestions.filter((s) => s.toLowerCase().includes(lower));
    }, [suggestions, editValue]);

    return (
      <div
        ref={ref}
        role="toolbar"
        aria-label="Address bar"
        className={cn(
          'relative flex items-center gap-1.5 h-9 w-full rounded-md border border-border bg-card text-card-foreground px-1.5 select-none transition-colors text-sm',
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
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>

            {/* Forward Button */}
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
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            {/* Up Button */}
            <button
              type="button"
              aria-label="Up to parent directory"
              disabled={disabled || !activePath || activePath === '/' || activePath.match(/^[a-zA-Z]:[/\\]?$/) !== null}
              onClick={handleUpClick}
              className={cn(
                'size-7 rounded flex items-center justify-center transition-colors',
                activePath && !disabled
                  ? 'text-foreground hover:bg-accent/40 cursor-pointer'
                  : 'text-muted-foreground/40 cursor-not-allowed'
              )}
            >
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>

            {/* Refresh Button */}
            {showRefresh && (
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
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2v6h-6" />
                  <path d="M3 12a9 9 0 0 1 15.5-5.5L21 8" />
                  <path d="M3 22v-6h6" />
                  <path d="M21 12a9 9 0 0 1-15.5 5.5L3 16" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Separator between nav buttons and breadcrumb area */}
        {showNavButtons && <div className="h-4 w-[0.0625rem] bg-border mx-0.5" />}

        {/* Path Display and Edit Container */}
        <div
          ref={containerRef}
          onClick={!isEditing ? startEditing : undefined}
          className={cn(
            'flex-1 relative flex items-center h-7 px-2 rounded overflow-hidden min-w-0 bg-background/50 border border-transparent',
            !isEditing && 'hover:border-border cursor-text',
            isEditing && 'border-primary ring-1 ring-primary bg-background'
          )}
        >
          {/* Edit Mode Input */}
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              aria-label="Address path input"
              value={editValue}
              disabled={disabled}
              onChange={(e) => {
                setEditValue(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  commitEdit(editValue);
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  cancelEdit();
                }
              }}
              onBlur={() => {
                // Delay so suggestion clicks can register
                setTimeout(() => {
                  cancelEdit();
                }, 150);
              }}
              className="w-full h-full bg-transparent text-foreground outline-none text-xs font-mono cursor-text"
            />
          ) : (
            /* Breadcrumbs Mode */
            <div className="flex items-center gap-0.5 flex-1 min-w-0 overflow-x-auto no-scrollbar py-0.5">
              {segments.length === 0 ? (
                <span className="text-muted-foreground text-xs">{activePath || 'Enter address...'}</span>
              ) : (
                segments.map((seg, idx) => {
                  const isLast = idx === segments.length - 1;
                  return (
                    <React.Fragment key={seg.path}>
                      <button
                        type="button"
                        data-testid={`address-segment-${idx}`}
                        onClick={(e) => handleSegmentClick(seg.path, e)}
                        className={cn(
                          'px-1.5 py-0.5 rounded text-xs truncate max-w-40 hover:bg-accent/40 transition-colors cursor-pointer',
                          isLast ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'
                        )}
                        title={seg.path}
                      >
                        {seg.label}
                      </button>
                      {!isLast && (
                        <span className="text-muted-foreground/60 text-xs px-0.5 pointer-events-none select-none">
                          ›
                        </span>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Optional Search / Quick Filter Input */}
        {showSearch && (
          <div className="shrink-0 flex items-center w-36 h-7 px-2 rounded bg-background/50 border border-border focus-within:border-primary">
            <svg className="size-3 text-muted-foreground mr-1.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              disabled={disabled}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              className="w-full bg-transparent text-foreground outline-none text-xs cursor-text"
            />
          </div>
        )}

        {/* Suggestions Popover */}
        {isEditing && showSuggestions && filteredSuggestions.length > 0 && (
          <div
            data-testid="address-bar-suggestions"
            className="absolute left-0 right-0 top-full mt-1 z-50 rounded-md border border-border bg-popover text-popover-foreground shadow-md max-h-48 overflow-y-auto p-1 text-xs"
          >
            {filteredSuggestions.map((sug) => (
              <div
                key={sug}
                data-testid={`suggestion-${sug}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  commitEdit(sug);
                }}
                className="px-2.5 py-1.5 rounded hover:bg-accent hover:text-accent-foreground cursor-pointer font-mono truncate"
              >
                {sug}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

AddressBar.displayName = 'AddressBar';
