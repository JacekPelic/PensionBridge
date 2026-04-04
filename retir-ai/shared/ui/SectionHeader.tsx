'use client';

import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, right, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div>
        <div className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>{title}</div>
        {subtitle && <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}
