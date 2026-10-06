import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export interface ResponsiveState {
  uiScale: number;
  viewportWidth: number;
  effectiveWidth: number;
  /** effectiveWidth < 640 */
  isCompact: boolean;
  /** effectiveWidth < 768 (mobile nav drawer triggers) */
  isMobile: boolean;
  /** effectiveWidth < 1024 (search bar collapses to icon) */
  isTablet: boolean;
  /** effectiveWidth >= 1024 */
  isDesktop: boolean;
  /** effectiveWidth >= 1280 (persistent right TOC triggers) */
  isWide: boolean;
}

export function computeResponsiveState(viewportWidth: number, uiScale: number = 1.0): ResponsiveState {
  const scale = typeof uiScale === 'number' && uiScale > 0 ? uiScale : 1.0;
  const effectiveWidth = Math.round(viewportWidth / scale);

  return {
    uiScale: scale,
    viewportWidth,
    effectiveWidth,
    isCompact: effectiveWidth < 640,
    isMobile: effectiveWidth < 768,
    isTablet: effectiveWidth < 1024,
    isDesktop: effectiveWidth >= 1024,
    isWide: effectiveWidth >= 1280,
  };
}

const defaultViewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
const defaultInitialState = computeResponsiveState(defaultViewportWidth, 1.0);

export const ResponsiveContext = createContext<ResponsiveState>(defaultInitialState);

export function useResponsive(): ResponsiveState {
  return useContext(ResponsiveContext);
}

export interface ResponsiveProviderProps {
  uiScale?: number;
  children: React.ReactNode;
}

export function ResponsiveProvider({ uiScale = 1.0, children }: ResponsiveProviderProps) {
  const [viewportWidth, setViewportWidth] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth : 1200;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const value = useMemo(
    () => computeResponsiveState(viewportWidth, uiScale),
    [viewportWidth, uiScale]
  );

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
}
