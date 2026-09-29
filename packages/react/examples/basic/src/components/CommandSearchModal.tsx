import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Badge,
  Card,
  Input,
  Kbd,
  Separator,
  SearchIcon,
  VirtualList,
  type VirtualListHandle,
} from '@chahu/cha-set';
import { NAVIGATION_CONFIG, type NavItem } from '../types/navigation';

export interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (href: string) => void;
}

export function CommandSearchModal({ isOpen, onClose, onSelect }: CommandSearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<VirtualListHandle>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      });
    }
  }, [isOpen]);

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

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (filtered.length > 0 && selectedIndex >= 0) {
      listRef.current?.scrollToIndex(selectedIndex, 'auto');
    }
  }, [selectedIndex, filtered.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        if (query) {
          e.preventDefault();
          setQuery('');
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowDown' && isOpen) {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, Math.max(0, filtered.length - 1)));
      } else if (e.key === 'ArrowUp' && isOpen) {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && isOpen) {
        const target = filtered[selectedIndex];
        if (target) {
          e.preventDefault();
          onSelect(target.item.href);
          onClose();
        }
      }

    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelect, filtered, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-background/80 backdrop-blur-xs animate-in fade-in-0 duration-150">
      <div
        className="fixed inset-0 bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />
      <Card className="relative w-full max-w-xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col bg-card border-border">
        {/* Search Input using clean borderless Input with search icon & clearable button */}
        <div className="p-3">
          <Input
            ref={inputRef}
            type="text"
            placeholder="搜索组件与文档..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            bordered={false}
            clearable={true}
            icon={<SearchIcon className="size-4" />}
            className="text-sm bg-transparent"
          />
        </div>
        <Separator />

        {/* Results VirtualList */}
        <div className="h-80 w-full p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">未找到匹配页面</div>
          ) : (
            <VirtualList
              ref={listRef}
              items={filtered}
              estimateSize={56}
              className="h-full w-full"
              renderItem={({ category, item }, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelect(item.href);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`relative w-full p-2.5 rounded-lg text-left transition-colors cursor-pointer select-none ${
                      isSelected ? 'bg-muted text-foreground' : 'hover:bg-muted/60 text-foreground'
                    }`}
                  >
                    {/* Badge anchored directly to top-right corner */}
                    <div className="absolute top-2.5 right-3">
                      <Badge
                        size="sm"
                        variant="outline"
                        className="text-muted-foreground bg-muted/80 font-normal text-[0.6875rem]"
                      >
                        {category}
                      </Badge>
                    </div>

                    {/* Content area padded on the right so long text never collides with or overflows the badge */}
                    <div className="pr-24 flex flex-col gap-0.5">
                      <div className="font-medium text-sm flex items-center gap-2">
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                          <Badge
                            size="sm"
                            variant="secondary"
                            className="bg-primary/10 text-primary border-primary/20 shrink-0 text-[0.6875rem]"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            />
          )}
        </div>

        {/* Bottom Keyboard Shortcut & Result Count Bar */}
        <div className="flex items-center justify-between px-3.5 py-2 border-t border-border bg-muted/40 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Kbd size="xs" variant="outline">Up</Kbd>
              <Kbd size="xs" variant="outline">Down</Kbd>
              <span>导航</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd size="xs" variant="outline">Enter</Kbd>
              <span>打开</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd size="xs" variant="outline">Esc</Kbd>
              <span>关闭</span>
            </span>
          </div>
          <span className="text-micro">{filtered.length} 个结果</span>
        </div>
      </Card>
    </div>
  );
}
