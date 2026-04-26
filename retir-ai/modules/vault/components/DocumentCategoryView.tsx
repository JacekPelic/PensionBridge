'use client';

import { useState, useMemo } from 'react';
import { DocumentGrid } from './DocumentGrid';
import type { PensionDocument, DocCategory } from '@/shared/types';

const categoryMeta: Record<DocCategory, { icon: string; label: string; description: string }> = {
  career: { icon: '📋', label: 'Career History', description: 'Career extracts plus optional employment certificates for gap corrections' },
  pension: { icon: '📊', label: 'Pension Statements', description: 'State, workplace and personal pension statements' },
  correspondence: { icon: '✉️', label: 'Correspondence', description: 'Letters, claim forms, correction requests' },
};

const categoryOrder: DocCategory[] = ['career', 'pension', 'correspondence'];

interface Props {
  documents: PensionDocument[];
}

export function DocumentCategoryView({ documents }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const groups = useMemo(() => {
    const map = new Map<DocCategory, PensionDocument[]>();
    for (const doc of documents) {
      const cat = doc.category || 'career';
      const list = map.get(cat) || [];
      list.push(doc);
      map.set(cat, list);
    }
    // Return in defined order, only categories that have documents
    return categoryOrder
      .filter((cat) => map.has(cat))
      .map((cat) => ({ category: cat, docs: map.get(cat)! }));
  }, [documents]);

  if (groups.length === 0) {
    return (
      <div className="rounded-xl p-8 text-center" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
        <div className="text-[13px]" style={{ color: 'var(--text-dim)' }}>No documents match your filters.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {groups.map(({ category, docs }) => {
        const meta = categoryMeta[category];
        const isCollapsed = collapsed[category] ?? false;
        const verified = docs.filter((d) => d.status === 'verified').length;
        const total = docs.length;

        return (
          <div key={category}>
            <button
              className="w-full flex items-center gap-3 p-3.5 px-4 rounded-xl cursor-pointer transition-all text-left"
              style={{
                background: 'var(--navy-3)',
                border: isCollapsed ? '1px solid var(--border)' : '1px solid var(--gold-border)',
                borderRadius: isCollapsed ? '12px' : '12px 12px 0 0',
              }}
              onClick={() => setCollapsed((prev) => ({ ...prev, [category]: !isCollapsed }))}
            >
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-base shrink-0"
                style={{ background: 'var(--navy-4)' }}>
                {meta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>{meta.label}</div>
                <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{meta.description}</div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-[12px] font-medium" style={{ color: verified === total ? 'var(--green)' : 'var(--text-muted)' }}>
                  {verified}/{total} verified
                </span>
                <span className="text-[12px] px-2 py-0.5 rounded-full" style={{ background: 'var(--navy-4)', color: 'var(--text-dim)' }}>
                  {total}
                </span>
                <span className="text-[12px] transition-transform" style={{ color: 'var(--text-dim)', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                  ▼
                </span>
              </div>
            </button>
            {!isCollapsed && (
              <div className="rounded-b-xl p-4 pt-3.5" style={{ background: 'var(--navy-4)', border: '1px solid var(--gold-border)', borderTop: 'none' }}>
                <DocumentGrid documents={docs} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
