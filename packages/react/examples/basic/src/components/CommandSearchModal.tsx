import React, { useState, useEffect, useMemo } from 'react';
import { ScrollArea } from '@chahu/cha-set';
import { NAVIGATION_CONFIG, type NavItem } from '../types/navigation';

export interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (href: string) => void;
}

export function CommandSearchModal({ isOpen, onClose, onSelect }: CommandSearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or custom state
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const allItems = useMemo(() => {
    const list: { category: string; item: NavItem }[] = [];
    NAVIGATION_CONFIG.forEach((cat) => {
      cat.items.forEach((item) => {
        list.push({ category: cat.title, item });
      });
    });
    return list;
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(
      (entry) =>
        entry.item.title.toLowerCase().includes(q) ||
        (entry.item.description && entry.item.description.toLowerCase().includes(q)) ||
        entry.category.toLowerCase().includes(q),
    );
  }, [allItems, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-background/80 backdrop-blur-xs animate-in fade-in-0 duration-150">
      <div
        className="fixed inset-0 bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        <div className="flex items-center border-b border-border px-3">
          <svg className="size-4 text-muted-foreground mr-2 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            autoFocus
            type="text"
            placeholder="Search documentation and components..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground text-foreground"
          />
          <kbd className="text-[0.625rem] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">
            ESC
          </kbd>
        </div>

        <ScrollArea className="max-h-80 w-full" viewportClassName="p-2">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">No matching pages found.</div>
          ) : (
            filtered.map(({ category, item }) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.href);
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm hover:bg-muted transition-colors cursor-pointer group"
              >
                <div>
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    {item.title}
                    {item.badge && (
                      <span className="text-[0.625rem] px-1.5 py-0.2 rounded font-mono bg-primary/10 text-primary font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.description && <div className="text-xs text-muted-foreground truncate max-w-sm">{item.description}</div>}
                </div>
                <span className="text-[0.6875rem] text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">
                  {category}
                </span>
              </button>
            ))
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
