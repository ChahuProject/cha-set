import { useEffect, useState, useCallback } from 'react';

export function parseRouteAndAnchor(rawHash: string): { route: string; sectionId: string } {
  if (!rawHash) return { route: '#/components/button', sectionId: '' };

  const cleaned = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
  const parts = cleaned.split('#').filter(Boolean);

  if (parts.length === 0) {
    return { route: '#/components/button', sectionId: '' };
  }

  // If parts[0] begins with '/', it's a page route path (e.g. '/components/slider')
  if (parts[0].startsWith('/')) {
    const route = `#${parts[0]}`;
    const sectionId = parts[1] || '';
    return { route, sectionId };
  }

  // Bare anchor like 'props' or 'overview'
  return { route: '', sectionId: parts[0] };
}

export function useRouter() {
  const [currentHash, setCurrentHash] = useState(() => {
    if (typeof window === 'undefined') return '#/components/button';
    const { route } = parseRouteAndAnchor(window.location.hash);
    return route || '#/components/button';
  });

  // Initial scroll to anchor if URL contains one on first load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { sectionId } = parseRouteAndAnchor(window.location.hash);
    if (sectionId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash;
      if (!rawHash) {
        setCurrentHash('#/components/button');
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }

      const { route, sectionId } = parseRouteAndAnchor(rawHash);

      if (route) {
        setCurrentHash((prevRoute) => {
          if (prevRoute !== route) {
            // Route actually changed to another page: scroll to top
            window.scrollTo({ top: 0, behavior: 'instant' });
            if (sectionId) {
              setTimeout(() => {
                const el = document.getElementById(sectionId);
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 80);
            }
            return route;
          } else {
            // Same page route, just section anchor changed
            if (sectionId) {
              const el = document.getElementById(sectionId);
              el?.scrollIntoView({ behavior: 'smooth' });
            }
            return prevRoute;
          }
        });
      } else if (sectionId) {
        // Bare anchor like "#props"
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
        setCurrentHash((currentRoute) => {
          const cleanRoute = currentRoute || '#/components/button';
          window.history.replaceState(null, '', `${window.location.pathname}${cleanRoute}#${sectionId}`);
          return cleanRoute;
        });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash) {
      window.location.hash = '#/components/button';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigate = useCallback((path: string) => {
    window.location.hash = path.startsWith('#') ? path : `#${path}`;
  }, []);

  return {
    currentHash,
    navigate,
  };
}
