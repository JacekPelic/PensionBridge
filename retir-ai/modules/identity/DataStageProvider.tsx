'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export type DataStage = 'before' | 'after';

interface DataStageContextType {
  stage: DataStage;
  toggleStage: () => void;
  setStage: (stage: DataStage) => void;
}

const STORAGE_KEY = 'clerio-data-stage';

const DataStageContext = createContext<DataStageContextType>({
  stage: 'before',
  toggleStage: () => {},
  setStage: () => {},
});

/**
 * Drives the "before / after document upload" demo toggle. The provider is
 * mounted once at the app root so the toggle state survives navigation
 * between dashboard, /picture, /estimation and /vault — all the surfaces
 * that show projection numbers stay aligned with the same toggle.
 */
export function DataStageProvider({ children }: { children: ReactNode }) {
  const [stage, setStageInternal] = useState<DataStage>('before');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'before' || saved === 'after') {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating client-only state from localStorage; matches PictureProvider/ThemeProvider pattern
        setStageInternal(saved);
      }
    } catch {
      // ignore storage errors
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: DataStage) => {
    setStageInternal(next);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore quota / privacy errors
      }
    }
  }, []);

  const toggleStage = useCallback(() => {
    persist(stage === 'before' ? 'after' : 'before');
  }, [stage, persist]);

  // Don't render children until hydration completes — prevents a flash of
  // 'before' content before localStorage is read on demos that left the
  // toggle on 'after' between sessions.
  if (!hydrated) return null;

  return (
    <DataStageContext.Provider value={{ stage, toggleStage, setStage: persist }}>
      {children}
    </DataStageContext.Provider>
  );
}

export function useDataStage() {
  return useContext(DataStageContext);
}
