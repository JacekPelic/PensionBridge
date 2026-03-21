'use client';

import { ReactNode } from 'react';

type PillVariant = 'green' | 'amber' | 'red' | 'blue' | 'gold';

const variantStyles: Record<PillVariant, React.CSSProperties> = {
  green: { background: 'var(--green-dim)', color: 'var(--green)', borderColor: 'rgba(62,207,142,0.25)' },
  amber: { background: 'var(--amber-dim)', color: 'var(--amber)', borderColor: 'rgba(245,158,11,0.25)' },
  red: { background: 'var(--red-dim)', color: 'var(--red)', borderColor: 'rgba(239,68,68,0.25)' },
  blue: { background: 'var(--blue-dim)', color: 'var(--blue)', borderColor: 'rgba(96,165,250,0.25)' },
  gold: { background: 'var(--gold-dim)', color: 'var(--gold-light)', borderColor: 'var(--gold-border)' },
};

interface PillProps {
  variant: PillVariant;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Pill({ variant, children, className = '', style }: PillProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-[5px] rounded-[20px] text-xs font-medium ${className}`}
      style={{ border: '1px solid', ...variantStyles[variant], ...style }}
    >
      {children}
    </span>
  );
}
