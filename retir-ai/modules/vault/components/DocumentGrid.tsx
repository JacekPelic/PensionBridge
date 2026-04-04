'use client';

import { DocumentCard } from './DocumentCard';
import type { PensionDocument } from '@/shared/types';

interface Props {
  documents: PensionDocument[];
}

export function DocumentGrid({ documents }: Props) {
  if (documents.length === 0) {
    return (
      <div className="rounded-xl p-8 text-center" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
        <div className="text-[13px]" style={{ color: 'var(--text-dim)' }}>No documents match your filters.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3.5">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} doc={doc} />
      ))}
    </div>
  );
}
