'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useVault } from '@/modules/vault/VaultProvider';
import { useVaultTier } from '@/modules/vault/VaultTierProvider';
import { mockStalenessWarnings } from '@/modules/vault/data/mock-discrepancies';
import type { PensionDocument } from '@/shared/types';

const statusColors: Record<string, { dot: string; text: string }> = {
  verified: { dot: 'var(--green)', text: 'Verified' },
  pending: { dot: 'var(--amber)', text: 'Pending' },
  missing: { dot: 'var(--red)', text: 'Missing' },
};

const statusBg: Record<string, string> = {
  verified: 'var(--green-dim)',
  pending: 'var(--amber-dim)',
  missing: 'var(--red-dim)',
};

const sourceTypeLabel: Record<string, { label: string; color: string }> = {
  state: { label: 'State', color: 'var(--gold)' },
  workplace: { label: 'Workplace', color: 'var(--blue)' },
  personal: { label: 'Personal', color: 'var(--amber)' },
  general: { label: 'General', color: 'var(--text-dim)' },
};

interface Props {
  doc: PensionDocument;
}

const urgencyColor: Record<string, string> = {
  high: 'var(--red)',
  medium: 'var(--amber)',
  low: 'var(--blue)',
};

export function DocumentCard({ doc }: Props) {
  const { setSelectedDocument, removeDocument, updateDocumentStatus } = useVault();
  const { isPro } = useVaultTier();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const status = statusColors[doc.status];
  const staleness = useMemo(() => isPro ? mockStalenessWarnings.find((w) => w.docId === doc.id) : null, [isPro, doc.id]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('mousedown', handleClick); document.removeEventListener('keydown', handleKey); };
  }, [menuOpen]);

  return (
    <div
      className="rounded-xl p-4 cursor-pointer transition-all duration-200 flex flex-col gap-2.5 relative"
      style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gold-border)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
      onClick={() => setSelectedDocument(doc)}
    >
      {/* Three-dot menu trigger */}
      <button
        className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-sm cursor-pointer transition-all"
        style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)' }}
        onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--navy-4)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        ⋯
      </button>

      {/* Context menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-10 right-3 z-50 rounded-xl py-1.5 min-w-[150px]"
          style={{ background: 'var(--navy-2)', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
        >
          {[
            { label: 'View Details', action: () => setSelectedDocument(doc) },
            ...(doc.fileUrl ? [{ label: 'Download', action: () => { const a = document.createElement('a'); a.href = doc.fileUrl!; a.download = doc.name; a.click(); } }] : []),
            { label: 'Re-verify', action: () => updateDocumentStatus(doc.id, 'pending') },
            { label: 'Delete', action: () => removeDocument(doc.id) },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full text-left px-3.5 py-2 text-[12px] cursor-pointer transition-all"
              style={{
                background: 'transparent', border: 'none',
                color: item.label === 'Delete' ? 'var(--red)' : 'var(--text-muted)',
                fontFamily: 'var(--font-sans)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--navy-3)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              onClick={(e) => { e.stopPropagation(); item.action(); setMenuOpen(false); }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg" style={{ background: statusBg[doc.status] }}>
        {doc.icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <div className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{doc.name}</div>
          {doc.sourceType && sourceTypeLabel[doc.sourceType] && (
            <span className="text-[9px] font-medium px-1.5 py-[1px] rounded-full"
              style={{ color: sourceTypeLabel[doc.sourceType].color, border: `1px solid ${sourceTypeLabel[doc.sourceType].color}`, opacity: 0.7 }}>
              {sourceTypeLabel[doc.sourceType].label}
            </span>
          )}
          {doc.optional && (
            <span
              className="text-[9px] font-medium px-1.5 py-[1px] rounded-full uppercase tracking-wide"
              style={{
                color: 'var(--text-dim)',
                border: '1px solid var(--border)',
                background: 'var(--navy-3)',
              }}
              title={doc.notes ?? 'Optional \u2014 only needed in specific cases.'}
            >
              Optional
            </span>
          )}
        </div>
        <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{doc.flag} {doc.source}</div>
      </div>
      <div className="flex items-center gap-[5px] text-[11px]">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
        <span style={{ color: status.dot }}>{status.text}</span>
        <span className="ml-auto" style={{ color: 'var(--text-dim)' }}>{doc.date}</span>
      </div>

      {/* Staleness warning — Pro only */}
      {staleness && (
        <div className="rounded-lg p-2 mt-0.5 flex items-start gap-1.5"
          style={{ background: 'var(--navy-4)', border: `1px solid ${urgencyColor[staleness.urgency]}25` }}>
          <span className="text-[10px] mt-px">⚠</span>
          <div className="text-[10px] leading-snug" style={{ color: urgencyColor[staleness.urgency] }}>
            {staleness.action}
          </div>
        </div>
      )}
    </div>
  );
}
