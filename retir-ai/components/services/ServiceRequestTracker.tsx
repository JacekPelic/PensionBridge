'use client';

import { serviceRequests } from '@/lib/mock-data';

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  quote_sent:  { bg: 'var(--blue-dim)', color: 'var(--blue)', label: 'Quote sent' },
  in_progress: { bg: 'var(--amber-dim)', color: 'var(--amber)', label: 'In progress' },
  completed:   { bg: 'var(--green-dim)', color: 'var(--green)', label: 'Completed' },
};

export function ServiceRequestTracker() {
  if (serviceRequests.length === 0) return null;

  return (
    <>
      <div className="text-[15px] font-semibold mb-1" style={{ color: 'var(--text)' }}>Your Requests</div>
      <div className="text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
        Track the status of your consulting engagements.
      </div>

      <div className="flex flex-col gap-2.5">
        {serviceRequests.map((req) => {
          const st = statusStyle[req.status];
          return (
            <div
              key={req.id}
              className="rounded-xl p-4 px-5 flex items-start gap-3.5 transition-all duration-200"
              style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gold-border)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>{req.packageName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </div>
                <div className="text-[12px] mb-1.5" style={{ color: 'var(--text-muted)' }}>{req.context}</div>
                {req.notes && (
                  <div className="text-[11.5px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>{req.notes}</div>
                )}
                <div className="flex items-center gap-3 mt-2 text-[10.5px]" style={{ color: 'var(--text-dim)' }}>
                  {req.assignedExpert && (
                    <span>👤 {req.assignedExpert}</span>
                  )}
                  <span>📅 Requested {req.createdAt}</span>
                  {req.createdAt !== req.updatedAt && (
                    <span>· Updated {req.updatedAt}</span>
                  )}
                </div>
              </div>

              {req.price && (
                <div className="text-right shrink-0">
                  <div className="text-[15px] font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                    €{req.price}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                    {req.status === 'quote_sent' ? 'quoted' : req.status === 'completed' ? 'paid' : 'approved'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
