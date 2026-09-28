import * as React from 'react';
import { createPortal } from 'react-dom';
import { Input, type InputProps } from './Input';
import { cn } from '../lib/utils';
import { ClockIcon, XIcon } from '../lib/icons';

export interface HistoryInputProps extends InputProps {
  /** List of history entries */
  history?: string[];
  /** Callback when user picks a history item */
  onSelectHistory?: (item: string) => void;
  /** Callback to clear all history */
  onClearHistory?: () => void;
  /** Maximum number of history suggestions to show */
  maxHistoryItems?: number;
}

export const HistoryInput = React.forwardRef<HTMLInputElement, HistoryInputProps>(
  (
    {
      history = [],
      onSelectHistory,
      onClearHistory,
      maxHistoryItems = 8,
      value,
      defaultValue,
      onChange,
      onKeyDown,
      onFocus,
      onBlur,
      className,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
    const [dropdownPos, setDropdownPos] = React.useState<{
      top: number;
      left: number;
      width: number;
    } | null>(null);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const innerInputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => innerInputRef.current!);

    const [currentText, setCurrentText] = React.useState(
      String(value ?? defaultValue ?? ''),
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setCurrentText(String(value));
      }
    }, [value]);

    // Filter history based on current typed text
    const filteredHistory = React.useMemo(() => {
      if (!history || history.length === 0) return [];
      const q = currentText.toLowerCase().trim();
      const list = q
        ? history.filter((h) => h.toLowerCase().includes(q))
        : history;
      return list.slice(0, maxHistoryItems);
    }, [history, currentText, maxHistoryItems]);

    // Update dropdown position relative to container
    const updatePosition = React.useCallback(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const winWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
      const left = Math.max(8, Math.min(rect.left, winWidth - rect.width - 8));
      setDropdownPos({
        top: rect.bottom + 4,
        left,
        width: rect.width,
      });
    }, []);

    React.useEffect(() => {
      if (open && filteredHistory.length > 0) {
        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        return () => {
          window.removeEventListener('resize', updatePosition);
          window.removeEventListener('scroll', updatePosition, true);
        };
      } else {
        setDropdownPos(null);
      }
    }, [open, filteredHistory.length, updatePosition]);

    const handleSelect = (item: string) => {
      setCurrentText(item);
      if (innerInputRef.current) {
        innerInputRef.current.value = item;
        const syntheticEvent = {
          target: innerInputRef.current,
          currentTarget: innerInputRef.current,
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }
      onSelectHistory?.(item);
      setOpen(false);
      setHighlightedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        if (open) {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
          setHighlightedIndex(-1);
          return;
        }
      } else if (e.key === 'ArrowDown') {
        if (filteredHistory.length > 0) {
          e.preventDefault();
          if (!open) {
            setOpen(true);
            setHighlightedIndex(0);
          } else {
            setHighlightedIndex((prev) =>
              Math.min(prev + 1, filteredHistory.length - 1),
            );
          }
        }
      } else if (e.key === 'ArrowUp') {
        if (open && filteredHistory.length > 0) {
          e.preventDefault();
          setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        }
      } else if (e.key === 'Enter') {
        if (open && highlightedIndex >= 0 && highlightedIndex < filteredHistory.length) {
          e.preventDefault();
          handleSelect(filteredHistory[highlightedIndex]!);
          return;
        }
      }
      onKeyDown?.(e);
    };

    return (
      <div
        ref={containerRef}
        data-slot="history-input-root"
        className="relative w-full"
      >
        <Input
          ref={innerInputRef}
          value={value}
          defaultValue={defaultValue}
          className={className}
          onChange={(e) => {
            setCurrentText(e.target.value);
            setOpen(true);
            setHighlightedIndex(0);
            onChange?.(e);
          }}
          onFocus={(e) => {
            setOpen(true);
            setHighlightedIndex(-1);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            if (
              !dropdownRef.current?.contains(e.relatedTarget as Node) &&
              !containerRef.current?.contains(e.relatedTarget as Node)
            ) {
              setOpen(false);
              setHighlightedIndex(-1);
            }
            onBlur?.(e);
          }}
          onKeyDown={handleKeyDown}
          {...props}
        />

        {open && filteredHistory.length > 0 && dropdownPos && typeof document !== 'undefined' && createPortal(
          <div
            ref={dropdownRef}
            role="listbox"
            tabIndex={-1}
            style={{
              position: 'fixed',
              top: `${dropdownPos.top * 0.0625}rem`,
              left: `${dropdownPos.left * 0.0625}rem`,
              width: `${dropdownPos.width * 0.0625}rem`,
              zIndex: 9999,
            }}
            className="max-h-[16.25rem] overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-lg p-1 animate-in fade-in-0 zoom-in-95 select-none"
          >
            {filteredHistory.map((item, idx) => (
              <button
                key={`${item}-${idx}`}
                type="button"
                role="option"
                aria-selected={idx === highlightedIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(item);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={cn(
                  'w-full h-8 px-2 rounded flex items-center gap-2 text-sm text-foreground cursor-pointer text-left transition-colors',
                  idx === highlightedIndex
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/50',
                )}
              >
                <ClockIcon className="size-3.5 text-muted-foreground shrink-0" />
                <span className="truncate flex-1 min-w-0">{item}</span>
              </button>
            ))}
          </div>,
          document.body,
        )}
      </div>
    );
  },
);

HistoryInput.displayName = 'HistoryInput';
