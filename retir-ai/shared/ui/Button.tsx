'use client';

import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'outline-gold';

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: 'var(--gold)', color: 'var(--navy)', fontWeight: 600 },
  ghost: { background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)' },
  'outline-gold': { background: 'transparent', color: 'var(--gold)', border: '1px solid var(--gold-border)' },
};

interface ButtonProps {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ variant = 'primary', children, className = '', style, onClick, disabled }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
      style={{ ...variantStyles[variant], fontFamily: 'var(--font-sans)', ...style }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
