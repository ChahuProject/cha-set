import * as React from 'react';

export interface ScrollState {
  isAtTop: boolean;
  isAtBottom: boolean;
  isAtLeft: boolean;
  isAtRight: boolean;
  hasOverflowY: boolean;
  hasOverflowX: boolean;
  scrollTop: number;
  scrollLeft: number;
  scrollHeight: number;
  clientHeight: number;
  scrollWidth: number;
  clientWidth: number;
}

export interface ScrollAreaContextValue {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  scrollState: ScrollState;
  scrollToTop: (smooth?: boolean) => void;
  scrollToBottom: (smooth?: boolean) => void;
  scrollPageUp: (ratio?: number, smooth?: boolean) => void;
  scrollPageDown: (ratio?: number, smooth?: boolean) => void;
  scrollToLeft: (smooth?: boolean) => void;
  scrollToRight: (smooth?: boolean) => void;
  scrollPageLeft: (ratio?: number, smooth?: boolean) => void;
  scrollPageRight: (ratio?: number, smooth?: boolean) => void;
}

export const ScrollAreaContext = React.createContext<ScrollAreaContextValue | null>(null);

export function useScrollAreaContext(): ScrollAreaContextValue | null {
  return React.useContext(ScrollAreaContext);
}
