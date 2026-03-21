'use client';

import { documentsBefore, documentsAfter } from '@/lib/mock-data';
import { useDataStage } from '@/providers/DataStageProvider';
import { Card } from '@/components/ui/Card';

const statusColors: Record<string, { dot: string; text: string }> = {
  verified: { dot: 'var(--green)', text: 'Verified' },
  pending: { dot: 'var(--amber)', text: 'Pending' },
  missing: { dot: 'var(--red)', text: 'Missing' },
};

export function DocumentVault() {
  const { stage } = useDataStage();
  const documents = stage === 'after' ? documentsAfter : documentsBefore;

  const verified = documents.filter((d) => d.status === 'verified').length;
  const pending = documents.filter((d) => d.status === 'pending').length;
  const missing = documents.filter((d) => d.status === 'missing').length;

  return (
    <>
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3.5 mb-5">
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-sm" style={{ background: 'var(--green-dim)' }}>✓</div>
          <div>
            <div className="text-[20px] font-bold" style={{ color: 'var(--green)' }}>{verified}</div>
            <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>Verified</div>
          </div>
        </div>
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-sm" style={{ background: 'var(--amber-dim)' }}>⏳</div>
          <div>
            <div className="text-[20px] font-bold" style={{ color: 'var(--amber)' }}>{pending}</div>
            <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>Pending</div>
          </div>
        </div>
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-sm" style={{ background: 'var(--red-dim)' }}>!</div>
          <div>
            <div className="text-[20px] font-bold" style={{ color: 'var(--red)' }}>{missing}</div>
            <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>Missing</div>
          </div>
        </div>
      </div>

      <div className="text-[15px] font-semibold mb-4" style={{ color: 'var(--text)' }}>Stored Documents</div>

      <div className="grid grid-cols-3 gap-3.5 mb-5">
        {documents.map((doc) => {
          const status = statusColors[doc.status];
          return (
            <div
              key={doc.id}
              className="rounded-xl p-4 cursor-pointer transition-all duration-200 flex flex-col gap-2.5"
              style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gold-border)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg"
                style={{ background: doc.status === 'verified' ? 'var(--green-dim)' : doc.status === 'pending' ? 'var(--amber-dim)' : 'var(--red-dim)' }}>
                {doc.icon}
              </div>
              <div>
                <div className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{doc.name}</div>
                <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{doc.flag} {doc.source}</div>
              </div>
              <div className="flex items-center gap-[5px] text-[11px]">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
                <span style={{ color: status.dot }}>{status.text}</span>
                <span className="ml-auto" style={{ color: 'var(--text-dim)' }}>{doc.date}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload zone */}
      <Card>
        <div
          className="rounded-xl p-8 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all duration-200 text-center"
          style={{ border: '1.5px dashed var(--navy-5)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold-border)'; e.currentTarget.style.background = 'var(--gold-dim)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--navy-5)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <div className="text-[28px]">📄</div>
          <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>Drop files here or click to upload</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Supports PDF, JPG, PNG, DOCX up to 25MB</div>
          <div className="flex gap-2 mt-2">
            {['PDF', 'JPG', 'PNG', 'DOCX'].map((t) => (
              <span key={t} className="text-[11px] px-3 py-1 rounded-[20px]"
                style={{ background: 'var(--navy-3)', border: '1px solid var(--border)', color: 'var(--text-dim)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}
