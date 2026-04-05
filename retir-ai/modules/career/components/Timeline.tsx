'use client';

import { Card } from '@/shared/ui/Card';
import { Pill } from '@/shared/ui/Pill';

const timelineItems = [
  {
    dotColor: 'var(--amber)', pill: { variant: 'amber' as const, label: '🇱🇺 Luxembourg' },
    title: 'Employed · Luxembourg', date: 'Apr 2020 – Present',
    salary: '€78,000 → €92,000/yr',
    body: 'State pension contributions estimated from salary and dates. ~6.0 insurance years.',
    status: 'employed' as const,
  },
  {
    dotColor: 'var(--text-dim)', pill: { variant: 'amber' as const, label: 'No data' },
    title: 'Jan – Mar 2020', date: '3 months',
    salary: '',
    body: 'No employment data between your Switzerland and Luxembourg periods. Were you between jobs, travelling, or on leave?',
    status: 'nodata' as const,
  },
  {
    dotColor: 'var(--blue)', pill: { variant: 'blue' as const, label: '🇨🇭 Switzerland' },
    title: 'Employed · Switzerland', date: 'Sep 2014 – Dec 2019',
    salary: 'CHF 110,000 → CHF 135,000/yr',
    body: 'State pension contributions estimated from salary and dates. ~5.3 insurance years.',
    status: 'employed' as const,
  },
  {
    dotColor: 'var(--text-dim)', pill: { variant: 'amber' as const, label: 'No data' },
    title: 'Aug 2013 – Aug 2014', date: '14 months',
    salary: '',
    body: 'No employment data for this period. Were you working, studying, or abroad? Adding the missing period will complete your picture.',
    status: 'nodata' as const,
  },
  {
    dotColor: 'var(--green)', pill: { variant: 'green' as const, label: '🇫🇷 France' },
    title: 'Employed · France', date: 'Jun 2008 – Jul 2013',
    salary: '€42,000 → €55,000/yr',
    body: 'State pension contributions estimated from salary and dates. ~5.1 insurance years.',
    status: 'employed' as const,
  },
  {
    dotColor: 'var(--green)', pill: { variant: 'green' as const, label: '🇫🇷 France' },
    title: 'Employed · France', date: 'Sep 2003 – May 2008',
    salary: '€32,000 → €38,000/yr',
    body: 'State pension contributions estimated from salary and dates. ~4.7 insurance years.',
    status: 'employed' as const,
  },
];

export function Timeline() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-1">
        <div className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>Employment Timeline</div>
        <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Ordered by most recent</div>
      </div>
      <div className="text-[11px] mb-4 flex items-center gap-1.5" style={{ color: 'var(--amber)' }}>
        <span>◎</span>
        <span>Based on imported career data — upload documents to verify</span>
      </div>

      <div className="relative pl-5" style={{ borderLeft: 'none' }}>
        <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: 'var(--border)' }} />

        {timelineItems.map((item, i) => (
          <div key={i} className="relative pl-5 pb-6">
            {/* Dot */}
            <div className="absolute -left-[5px] top-[3px] w-2.5 h-2.5 rounded-full"
              style={{
                border: `2px solid ${item.dotColor}`,
                background: item.status === 'nodata'
                  ? 'var(--navy-3)'
                  : item.dotColor === 'var(--green)' ? 'var(--green-dim)'
                  : item.dotColor === 'var(--blue)' ? 'var(--blue-dim)'
                  : 'var(--amber-dim)',
              }} />

            {/* Header */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Pill variant={item.pill.variant} style={{ fontSize: 10, padding: '2px 8px' }}>{item.pill.label}</Pill>
              <span className="text-[13.5px] font-medium" style={{ color: item.status === 'nodata' ? 'var(--text-dim)' : 'var(--text)' }}>{item.title}</span>
              <span className="text-[11px] ml-auto" style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{item.date}</span>
            </div>

            {item.salary && (
              <div className="text-[12px] mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{item.salary}</div>
            )}

            <div className="text-[12.5px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.body}</div>

            {/* Estimated badge */}
            {item.status === 'employed' && (
              <div className="inline-flex items-center gap-1 mt-1.5 text-[10px] px-2 py-[2px] rounded-full"
                style={{ background: 'var(--amber-dim)', color: 'var(--amber)', border: '1px solid rgba(217,119,6,0.2)' }}>
                ◎ State pension estimated · not yet verified
              </div>
            )}

            {/* No data action */}
            {item.status === 'nodata' && (
              <button className="mt-2 text-[12px] font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                style={{ background: 'var(--navy-3)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
                + Add missing period
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
