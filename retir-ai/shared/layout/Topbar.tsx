'use client';

import { ReactNode } from 'react';
import { useSidebar } from '@/shared/layout/SidebarProvider';

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  const { toggle } = useSidebar();

  return (
    <div
      className="px-4 sm:px-8 py-[14px] sm:py-[18px] flex items-center gap-3 flex-wrap"
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--navy-2)' }}
    >
      {/* Hamburger — opens the drawer, mobile only */}
      <button
        type="button"
        onClick={toggle}
        aria-label="Open menu"
        className="lg:hidden flex items-center justify-center rounded-lg shrink-0 cursor-pointer text-xl"
        style={{ width: 44, height: 44, marginLeft: -6, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}
      >
        ☰
      </button>

      <div className="min-w-0">
        <div className="text-lg sm:text-xl font-semibold truncate" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}>
          {title}
        </div>
        {subtitle && <div className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>{subtitle}</div>}
      </div>
      {actions && <div className="flex items-center gap-2.5 ml-auto flex-wrap justify-end">{actions}</div>}
    </div>
  );
}
