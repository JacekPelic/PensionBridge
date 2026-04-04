'use client';

import { useState, useMemo } from 'react';
import { DocumentGrid } from './DocumentGrid';
import type { PensionDocument, Country } from '@/shared/types';

const countryLabels: Record<Country, { flag: string; name: string }> = {
  FR: { flag: '🇫🇷', name: 'France' },
  CH: { flag: '🇨🇭', name: 'Switzerland' },
  LU: { flag: '🇱🇺', name: 'Luxembourg' },
};

interface Props {
  documents: PensionDocument[];
}

export function DocumentGroupedView({ documents }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const groups = useMemo(() => {
    const map = new Map<Country, PensionDocument[]>();
    for (const doc of documents) {
      const list = map.get(doc.country) || [];
      list.push(doc);
      map.set(doc.country, list);
    }
    return Array.from(map.entries());
  }, [documents]);

  if (groups.length === 0) {
    return (
      <div className="rounded-xl p-8 text-center" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
        <div className="text-[13px]" style={{ color: 'var(--text-dim)' }}>No documents match your filters.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {groups.map(([country, docs]) => {
        const info = countryLabels[country];
        const isCollapsed = collapsed[country] ?? false;
        return (
          <div key={country}>
            <button
              className="flex items-center gap-2.5 mb-3 cursor-pointer w-full text-left"
              style={{ background: 'none', border: 'none' }}
              onClick={() => setCollapsed((prev) => ({ ...prev, [country]: !isCollapsed }))}
            >
              <span className="text-[14px]">{info.flag}</span>
              <span className="text-[14px] font-semibold" style={{ color: 'var(--text)', fontFamily: 'var(--font-sans)' }}>
                {info.name}
              </span>
              <span className="text-[12px] px-2 py-0.5 rounded-full" style={{ background: 'var(--navy-4)', color: 'var(--text-dim)' }}>
                {docs.length}
              </span>
              <span className="ml-auto text-[12px] transition-transform" style={{ color: 'var(--text-dim)', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                ▼
              </span>
            </button>
            {!isCollapsed && <DocumentGrid documents={docs} />}
          </div>
        );
      })}
    </div>
  );
}
