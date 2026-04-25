import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { ROUTES } from '../constants/routes';

const KNOWN_PATHS = new Set(Object.values(ROUTES));

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') {
    return ROUTES.HOME;
  }

  return KNOWN_PATHS.has(pathname) ? pathname : ROUTES.HOME;
}

export default function useWebRouter() {
  const isWeb = Platform.OS === 'web' && typeof window !== 'undefined';

  const [path, setPath] = useState(() => {
    if (!isWeb) {
      return ROUTES.HOME;
    }

    return normalizePathname(window.location.pathname);
  });

  const syncPath = useCallback(
    (nextPath, replace = false) => {
      if (!isWeb) {
        setPath(nextPath);
        return;
      }

      const normalizedPath = normalizePathname(nextPath);

      if (replace) {
        window.history.replaceState({}, '', normalizedPath);
      } else {
        window.history.pushState({}, '', normalizedPath);
      }

      setPath(normalizedPath);
    },
    [isWeb]
  );

  useEffect(() => {
    if (!isWeb) {
      return;
    }

    const normalizedInitialPath = normalizePathname(window.location.pathname);
    if (window.location.pathname !== normalizedInitialPath) {
      window.history.replaceState({}, '', normalizedInitialPath);
    }

    setPath(normalizedInitialPath);

    const handlePopState = () => {
      setPath(normalizePathname(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isWeb]);

  return useMemo(
    () => ({
      path,
      navigate: (nextPath) => syncPath(nextPath, false),
      replace: (nextPath) => syncPath(nextPath, true),
    }),
    [path, syncPath]
  );
}
