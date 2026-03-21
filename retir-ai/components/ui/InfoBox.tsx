'use client';

import { ReactNode } from 'react';

interface InfoBoxProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function InfoBox({ title, children, className = '' }: InfoBoxProps) {
  return (
    <div
      className={`rounded-[10px] p-3 px-4 mb-4 ${className}`}
      style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}
    >
      <div className="text-[12.5px] font-semibold mb-[3px]" style={{ color: 'var(--gold-light)' }}>{title}</div>
      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{children}</div>
    </div>
  );
}
