'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

/**
 * Holds the mobile drawer open/closed state, shared between the Topbar
 * hamburger and the Sidebar drawer. On desktop (lg+) the sidebar is always
 * visible and this state is ignored.
 */
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((v) => !v),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

// Defensive default so surfaces rendered outside the provider (e.g. onboarding)
// don't crash — the drawer simply stays closed.
const NOOP: SidebarContextValue = { isOpen: false, open: () => {}, close: () => {}, toggle: () => {} };

export function useSidebar(): SidebarContextValue {
  return useContext(SidebarContext) ?? NOOP;
}
