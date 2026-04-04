'use client';

import { useVault } from '@/modules/vault/VaultProvider';
import { VaultToolbar } from './VaultToolbar';
import { DocumentGrid } from './DocumentGrid';
import { DocumentGroupedView } from './DocumentGroupedView';
import { DocumentCategoryView } from './DocumentCategoryView';
import { UploadZone } from './UploadZone';
import { DocumentDetailPanel } from './DocumentDetailPanel';
import { DiscrepancyAlerts } from './DiscrepancyAlerts';
import { VaultProActions } from './VaultProActions';

const statusCards = [
  { key: 'verified' as const, label: 'Verified', color: 'var(--green)', bg: 'var(--green-dim)', icon: '✓' },
  { key: 'pending' as const, label: 'Pending', color: 'var(--amber)', bg: 'var(--amber-dim)', icon: '⏳' },
  { key: 'missing' as const, label: 'Missing', color: 'var(--red)', bg: 'var(--red-dim)', icon: '!' },
];

export function DocumentVault() {
  const { documents, filteredDocuments, groupMode } = useVault();

  const counts = {
    verified: documents.filter((d) => d.status === 'verified').length,
    pending: documents.filter((d) => d.status === 'pending').length,
    missing: documents.filter((d) => d.status === 'missing').length,
  };

  return (
    <>
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3.5 mb-5">
        {statusCards.map((s) => (
          <div key={s.key} className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-sm" style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <div className="text-[20px] font-bold" style={{ color: s.color }}>{counts[s.key]}</div>
              <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Discrepancy alerts (Pro) / upgrade prompt (Free) */}
      <div className="mb-5">
        <DiscrepancyAlerts />
      </div>

      {/* Pro actions: Export + Family sharing */}
      <VaultProActions />

      {/* Toolbar */}
      <VaultToolbar />

      {/* Document list */}
      <div className="flex items-baseline justify-between mb-4">
        <div className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>Stored Documents</div>
        <div className="text-[12px]" style={{ color: 'var(--text-dim)' }}>{filteredDocuments.length} of {documents.length} documents</div>
      </div>
      <div className="mb-5">
        {groupMode === 'category' ? (
          <DocumentCategoryView documents={filteredDocuments} />
        ) : groupMode === 'country' ? (
          <DocumentGroupedView documents={filteredDocuments} />
        ) : (
          <DocumentGrid documents={filteredDocuments} />
        )}
      </div>

      {/* Upload zone */}
      <UploadZone />

      {/* Detail modal */}
      <DocumentDetailPanel />
    </>
  );
}
