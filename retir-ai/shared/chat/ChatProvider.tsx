'use client';

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from 'react';

/**
 * Exposes a small API for other components to open the ChatWidget with a
 * pre-seeded user message. Used by the "Stuck? Ask your advisor" CTA on
 * each ask card / tour step.
 *
 * Uses a ref-based handler registration so the ChatWidget's internal
 * `setState` calls are invoked from an event handler (openWithSeed callers)
 * rather than inside a `useEffect` body — sidesteps React's
 * set-state-in-effect warning.
 */
type SeedHandler = (seed: string) => void;

interface ChatContextValue {
  /** Open the chat panel and auto-send this message. */
  openWithSeed: (seed: string) => void;
  /** ChatWidget registers its handler here. Returns an unsubscribe fn. */
  registerHandler: (handler: SeedHandler) => () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const handlerRef = useRef<SeedHandler | null>(null);

  const registerHandler = useCallback((handler: SeedHandler) => {
    handlerRef.current = handler;
    return () => {
      if (handlerRef.current === handler) {
        handlerRef.current = null;
      }
    };
  }, []);

  const openWithSeed = useCallback((seed: string) => {
    if (handlerRef.current) {
      handlerRef.current(seed);
    } else if (typeof window !== 'undefined') {
      // No chat widget mounted (shouldn't happen in the rendered app).
      // Silent no-op in prod; log in dev so we can catch misuse.
      if (process.env.NODE_ENV !== 'production') {
        console.warn('ChatProvider: openWithSeed called but no ChatWidget is mounted');
      }
    }
  }, []);

  return (
    <ChatContext.Provider value={{ openWithSeed, registerHandler }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return ctx;
}
