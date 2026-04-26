'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { PartialPicture } from './picture-types';
import { MOCK_PICTURE } from './mock-picture';

const STORAGE_KEY = 'prevista-picture';

type PictureMode = 'mock' | 'user';

interface PictureContextValue {
  picture: PartialPicture;
  /** 'mock' means the demo persona is being shown; 'user' means real user data. */
  mode: PictureMode;
  /** Patch fields onto the current picture (transitions to 'user' mode). */
  updatePicture: (patch: Partial<PartialPicture>) => void;
  /** Replace the entire picture (transitions to 'user' mode). */
  setPicture: (next: PartialPicture) => void;
  /** Wipe to empty so the user starts their own picture from scratch. */
  startFresh: () => void;
  /** Reload the demo persona. */
  loadMock: () => void;
}

const PictureContext = createContext<PictureContextValue | null>(null);

interface StoredState {
  picture: PartialPicture;
  mode: PictureMode;
}

function readStored(): StoredState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredState;
    if (parsed && typeof parsed === 'object' && 'picture' in parsed && 'mode' in parsed) {
      return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function writeStored(state: StoredState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / privacy-mode errors
  }
}

export function PictureProvider({ children }: { children: ReactNode }) {
  // Default to mock so server-rendered HTML matches the demo persona.
  const [picture, setPictureState] = useState<PartialPicture>(MOCK_PICTURE);
  const [mode, setMode] = useState<PictureMode>('mock');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setPictureState(stored.picture);
      setMode(stored.mode);
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: PartialPicture, nextMode: PictureMode) => {
    setPictureState(next);
    setMode(nextMode);
    writeStored({ picture: next, mode: nextMode });
  }, []);

  const updatePicture = useCallback((patch: Partial<PartialPicture>) => {
    setPictureState((prev) => {
      const next = { ...prev, ...patch };
      writeStored({ picture: next, mode: 'user' });
      return next;
    });
    setMode('user');
  }, []);

  const setPicture = useCallback(
    (next: PartialPicture) => persist(next, 'user'),
    [persist],
  );

  const startFresh = useCallback(() => persist({}, 'user'), [persist]);

  const loadMock = useCallback(() => persist(MOCK_PICTURE, 'mock'), [persist]);

  // Don't render children until hydration completes — prevents UI flash
  // between SSR mock state and any persisted user state.
  if (!hydrated) return null;

  return (
    <PictureContext.Provider
      value={{ picture, mode, updatePicture, setPicture, startFresh, loadMock }}
    >
      {children}
    </PictureContext.Provider>
  );
}

export function usePicture(): PictureContextValue {
  const ctx = useContext(PictureContext);
  if (!ctx) {
    throw new Error('usePicture must be used within a PictureProvider');
  }
  return ctx;
}
