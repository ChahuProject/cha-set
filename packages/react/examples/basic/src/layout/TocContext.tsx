import React, { createContext, useContext, useState } from 'react';
import type { TocItem } from '@chahu/cha-set';

export interface TocContextValue {
  items: TocItem[];
  setItems: (items: TocItem[]) => void;
  tocOpen: boolean;
  setTocOpen: (open: boolean) => void;
}

const TocContext = createContext<TocContextValue | null>(null);

export function TocProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <TocContext.Provider value={{ items, setItems, tocOpen, setTocOpen }}>
      {children}
    </TocContext.Provider>
  );
}

export function useToc(): TocContextValue {
  const ctx = useContext(TocContext);
  if (!ctx) {
    return {
      items: [],
      setItems: () => {},
      tocOpen: false,
      setTocOpen: () => {},
    };
  }
  return ctx;
}
