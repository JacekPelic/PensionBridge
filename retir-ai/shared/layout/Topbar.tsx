'use client';

import { ReactNode } from 'react';

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  return (
    <div
      className="px-8 py-[18px] flex items-center justify-between"
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--navy-2)' }}
    >
      <div>
        <div className="text-xl font-semibold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}>
          {title}
        </div>
        {subtitle && <div className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>{subtitle}</div>}
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}
