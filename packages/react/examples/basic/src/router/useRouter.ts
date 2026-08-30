import { useEffect, useState, useCallback } from 'react';

export function useRouter() {
  const [currentHash, setCurrentHash] = useState(() => {
    if (typeof window === 'undefined') return '#/components/button';
    return window.location.hash || '#/components/button';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/components/button';
      setCurrentHash(hash);
      window.scrollTo({ top: 0, behavior: 'instant' });
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
