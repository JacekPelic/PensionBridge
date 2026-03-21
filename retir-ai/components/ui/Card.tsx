'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Card({ children, className = '', style, onClick }: CardProps) {
  return (
    <div
      className={`rounded-[14px] p-[22px] ${className}`}
      style={{ background: 'var(--navy-2)', border: '1px solid var(--border)', ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
