import * as React from 'react';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { cn } from '../lib/utils';
import { Button } from '../button';
import { SegmentedControl } from '../segmented-control';
import { ShortcutBar } from '../kbd';
import { CheckIcon, XIcon, SearchIcon, StarIcon } from '../lib/icons';
import { matchPinyin } from '../lib/pinyin';
import { useChaSetI18n } from '../i18n';
import type {
  FilterPopupSearchVisibility,
  FilterPopupLogicMode,
} from '@chahu/spec/filter-popup';

export interface FilterPopupItem {
  key: string | number;
  label?: string;
  count?: number;
  stars?: number;
  color?: string;
  isChecked?: boolean;
  isExcluded?: boolean;
}

export interface FilterPopupProps {
  title?: string;
  icon?: string | React.ReactNode;
  items?: FilterPopupItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  searchEnabled?: boolean;
  searchVisibility?: FilterPopupSearchVisibility;
  searchPlaceholder?: string;
  validateFileName?: boolean;
  showLogicToggle?: boolean;
  logicMode?: FilterPopupLogicMode;
  onLogicModeChange?: (mode: FilterPopupLogicMode) => void;
  hasActive?: boolean;
  onClear?: () => void;
  onItemIncludeToggle?: (key: string | number) => void;
  onItemExcludeToggle?: (key: string | number) => void;
  className?: string;
  trigger?: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  emptyText?: string;
  noMatchText?: string;
}

const STAR_CHINESE = ['零星', '一星', '二星', '三星', '四星', '五星'];

export function FilterPopup({
  title = '',
  icon,
  items = [],
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  searchEnabled = true,
  searchVisibility = 'autoHidden',
  searchPlaceholder,
  validateFileName = false,
  showLogicToggle = false,
  logicMode = 'and',
  onLogicModeChange,
  hasActive = false,
  onClear,
  onItemIncludeToggle,
  onItemExcludeToggle,
  className,
  trigger,
  align = 'start',
  side = 'bottom',
  sideOffset = 6,
  emptyText,
  noMatchText,
}: FilterPopupProps) {
  const { t } = useChaSetI18n();
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('overlays.filterPopup.searchPlaceholder', 'Quick search...');
  const resolvedEmptyText = emptyText ?? t('overlays.filterPopup.empty', 'No items available');
  const resolvedNoMatchText = noMatchText ?? t('overlays.filterPopup.noMatch', 'No matching items');

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const [searchActive, setSearchActive] = React.useState(searchVisibility === 'always');
  const [searchQuery, setSearchQuery] = React.useState('');
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  const invalidFileNameChars = React.useMemo(() => {
    if (!validateFileName || !searchQuery) return [];
    const list: string[] = [];
    const seen = new Set<string>();
    for (const ch of searchQuery) {
      if (/[\\/:*?"<>|\x00-\x1F]/.test(ch)) {
        if (!seen.has(ch)) {
          seen.add(ch);
          list.push(ch);
        }
      }
    }
    return list;
  }, [validateFileName, searchQuery]);

  const hasInvalidChars = invalidFileNameChars.length > 0;

  React.useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSearchActive(searchVisibility === 'always');
      if (searchEnabled) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else {
        setTimeout(() => panelRef.current?.focus(), 50);
      }
    } else {
      setSearchQuery('');
      setSearchActive(searchVisibility === 'always');
    }
  }, [isOpen, searchEnabled, searchVisibility]);

  const isSearchVisible =
    searchEnabled &&
    (searchVisibility === 'always' || searchActive || searchQuery.trim().length > 0);

  const filteredItems = React.useMemo(() => {
    if (!items || items.length === 0) return [];
    const q = searchQuery.trim();
    if (!searchEnabled || !q) return items;

    return items.filter((it) => {
      if (typeof it.stars === 'number') {
        const s = it.stars;
        if (q === String(s)) return true;
        const alias = `${s} ${s}星 ${STAR_CHINESE[s] || ''} ${s}star`;
        return matchPinyin(alias, q);
      }
      const label = it.label || '';
      const key = String(it.key ?? '');
      if (matchPinyin(label, q)) return true;
      if (key && matchPinyin(key, q)) return true;
      return false;
    });
  }, [items, searchEnabled, searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!searchEnabled) return;

    if (e.key === 'Escape') {
      if (searchQuery.length > 0) {
        setSearchQuery('');
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      if (searchVisibility === 'autoHidden' && searchActive) {
        setSearchActive(false);
        panelRef.current?.focus();
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      handleOpenChange(false);
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    if (
      !isSearchVisible &&
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.metaKey &&
      e.key.charCodeAt(0) >= 32
    ) {
      setSearchActive(true);
      setSearchQuery(e.key);
      e.preventDefault();
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.setSelectionRange(e.key.length, e.key.length);
        }
      }, 0);
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      return <span className="size-3.5 shrink-0 text-muted-foreground">{icon}</span>;
    }
    return icon;
  };

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger
        data-slot="filter-popup-trigger"
        render={
          trigger ? (
            React.isValidElement(trigger) ? (
              trigger
            ) : (
              <span>{trigger}</span>
            )
          ) : (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'gap-2 text-foreground border-border bg-card hover:bg-accent/40',
                hasActive && 'border-primary/50 text-primary font-medium',
              )}
            >
              {renderIcon()}
              <span>{title || 'Filter'}</span>
            </Button>
          )
        }
      />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          data-slot="filter-popup-positioner"
          align={align}
          side={side}
          sideOffset={sideOffset}
          className="z-50"
        >
          <PopoverPrimitive.Popup
            data-slot="filter-popup-content"
            className={cn(
              'z-50 w-[18.125rem] rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-xl outline-hidden focus:outline-hidden flex flex-col gap-1.5 duration-quick ease-standard',
              'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
              'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
              className,
            )}
          >
            <div
              ref={panelRef}
              tabIndex={-1}
              onKeyDown={handleKeyDown}
              className="flex flex-col gap-1.5 outline-hidden focus:outline-hidden"
            >
            {/* Header */}
            <div className="flex h-6 items-center gap-1.5 px-1">
              {renderIcon()}
              <span className="truncate text-xs font-semibold text-foreground flex-1">
                {title}
              </span>

              {showLogicToggle && (
                <SegmentedControl
                  size="sm"
                  value={logicMode}
                  onChange={(val) => onLogicModeChange?.(val as FilterPopupLogicMode)}
                  options={[
                    { label: 'AND', value: 'and' },
                    { label: 'OR', value: 'or' },
                  ]}
                />
              )}

              {hasActive && onClear && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    onClear();
                    panelRef.current?.focus();
                  }}
                  className="h-5 px-1.5 text-[0.6875rem] text-muted-foreground hover:text-foreground"
                >
                  {t('overlays.filterPopup.clear', 'Clear')}
                </Button>
              )}
            </div>

            {/* Search Bar */}
            {isSearchVisible && (
              <div
                className={cn(
                  'relative flex h-7 items-center rounded-md border px-2 gap-1.5 transition-colors',
                  hasInvalidChars
                    ? 'border-destructive bg-destructive/10 text-destructive'
                    : 'border-border bg-background text-foreground focus-within:border-primary',
                )}
              >
                <SearchIcon className="size-3 text-muted-foreground shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && searchQuery.length === 0) {
                      e.stopPropagation();
                    }
                    if (e.key === 'Escape') {
                      if (searchQuery.length > 0) {
                        setSearchQuery('');
                        e.stopPropagation();
                        e.preventDefault();
                        return;
                      }
                      if (searchVisibility === 'autoHidden') {
                        setSearchActive(false);
                        panelRef.current?.focus();
                        e.stopPropagation();
                        e.preventDefault();
                        return;
                      }
                      handleOpenChange(false);
                      e.stopPropagation();
                      e.preventDefault();
                    }
                  }}
                  placeholder={resolvedSearchPlaceholder}
                  className="h-full w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-hidden"
                />
                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      if (searchVisibility === 'autoHidden') {
                        setSearchActive(false);
                        panelRef.current?.focus();
                      } else {
                        searchInputRef.current?.focus();
                      }
                    }}
                    className="size-3 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                  >
                    <XIcon className="size-3" />
                  </button>
                )}
              </div>
            )}

            {/* Invalid filename characters warning */}
            {isSearchVisible && hasInvalidChars && (
              <div className="flex items-center gap-1.5 px-1 text-2xs text-destructive">
                <XIcon className="size-3 shrink-0" />
                <span className="truncate">
                  {t('overlays.filterPopup.invalidChars', 'Invalid characters: {{chars}}', {
                    chars: invalidFileNameChars.join('  '),
                  })}
                </span>
              </div>
            )}

            {/* Items list */}
            <div className="max-h-[15rem] min-h-[3.75rem] overflow-y-auto overflow-x-hidden flex flex-col gap-0.5 py-0.5">
              {filteredItems.length === 0 ? (
                <div className="flex h-9 items-center justify-center text-xs text-muted-foreground">
                  {searchQuery ? resolvedNoMatchText : resolvedEmptyText}
                </div>
              ) : (
                filteredItems.map((item) => {
                  const isChecked = Boolean(item.isChecked);
                  const isExcluded = Boolean(item.isExcluded);
                  const hasStars = typeof item.stars === 'number';
                  const starsCount = hasStars ? (item.stars as number) : 0;

                  return (
                    <div
                      key={item.key}
                      onClick={() => {
                        onItemIncludeToggle?.(item.key);
                        panelRef.current?.focus();
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        onItemExcludeToggle?.(item.key);
                        panelRef.current?.focus();
                      }}
                      className={cn(
                        'group flex h-7 items-center gap-1.5 rounded-md px-1.5 text-xs transition-colors duration-quick ease-standard select-none cursor-pointer border border-transparent',
                        isChecked && 'bg-primary/10 border-primary/30 text-foreground font-medium',
                        isExcluded && 'bg-destructive/10 border-destructive/40 text-destructive line-through font-medium',
                        !isChecked && !isExcluded && 'hover:bg-muted text-foreground',
                      )}
                    >
                      {/* Tri-state indicator box */}
                      <div
                        className={cn(
                          'flex size-4 items-center justify-center rounded-[0.1875rem] border shrink-0 transition-colors',
                          isChecked && 'border-primary bg-primary text-primary-foreground',
                          isExcluded && 'border-destructive bg-destructive/20 text-destructive',
                          !isChecked && !isExcluded && 'border-border bg-transparent group-hover:border-muted-foreground/50',
                        )}
                      >
                        {isChecked && <CheckIcon className="size-3" />}
                        {isExcluded && <XIcon className="size-3" />}
                      </div>

                      {/* Optional Color Indicator */}
                      {item.color && (
                        <span
                          className="size-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                      )}

                      {/* Stars Row or Label */}
                      {hasStars ? (
                        <div className="flex items-center gap-0.5 flex-1">
                          {[0, 1, 2, 3, 4].map((i) => {
                            const isLit = i < starsCount;
                            return (
                              <StarIcon
                                key={i}
                                className={cn(
                                  'size-3.5 shrink-0 transition-opacity',
                                  isLit
                                    ? 'text-amber-500 fill-amber-500 opacity-100'
                                    : 'text-muted-foreground/35 opacity-40',
                                )}
                              />
                            );
                          })}
                        </div>
                      ) : (
                        <span className="truncate flex-1 text-xs">
                          {item.label ?? String(item.key)}
                        </span>
                      )}

                      {/* Count Badge */}
                      {typeof item.count === 'number' && (
                        <span className="text-[0.625rem] text-muted-foreground shrink-0 font-normal no-underline">
                          {item.count}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Shortcuts Bar */}
            <ShortcutBar
              preset="filter-popup"
              exclude={searchEnabled ? [] : ['search']}
              className="border-t border-border pt-1 px-0.5"
            />
          </div>
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
