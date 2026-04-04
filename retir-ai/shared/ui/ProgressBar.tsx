'use client';

interface ProgressBarProps {
  percent: number;
  color?: string;
  height?: number;
}

export function ProgressBar({ percent, color = 'var(--gold)', height = 6 }: ProgressBarProps) {
  return (
    <div className="rounded-md overflow-hidden" style={{ background: 'var(--navy-3)', height }}>
      <div
        className="rounded-md transition-all duration-600"
        style={{ height: '100%', width: `${Math.min(100, percent)}%`, background: color }}
      />
    </div>
  );
}
