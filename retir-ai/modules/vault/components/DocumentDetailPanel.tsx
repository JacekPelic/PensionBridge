'use client';

import { useMemo } from 'react';
import { useVault } from '@/modules/vault/VaultProvider';
import { useVaultTier } from '@/modules/vault/VaultTierProvider';
import { mockStalenessWarnings, mockCorrectionSteps, mockDiscrepancies } from '@/modules/vault/data/mock-discrepancies';
import { Button } from '@/shared/ui/Button';
import { Pill } from '@/shared/ui/Pill';

const statusPillVariant: Record<string, 'green' | 'amber' | 'red'> = {
  verified: 'green',
  pending: 'amber',
  missing: 'red',
};

const statusLabel: Record<string, string> = {
  verified: 'Verified',
  pending: 'Pending Review',
  missing: 'Missing',
};

const sourceTypeDisplay: Record<string, { label: string; variant: 'gold' | 'blue' | 'amber' | 'green' }> = {
  state: { label: 'State', variant: 'gold' },
  workplace: { label: 'Workplace', variant: 'blue' },
  personal: { label: 'Personal', variant: 'amber' },
  general: { label: 'General', variant: 'green' },
};

const categoryDisplay: Record<string, string> = {
  career: 'Career History',
  pension: 'Pension Statement',
  identity: 'Identity & Civil Status',
  tax: 'Tax & Financial',
  correspondence: 'Correspondence',
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const countryNames: Record<string, string> = { FR: 'France', CH: 'Switzerland', LU: 'Luxembourg' };

const urgencyConfig: Record<string, { color: string; bg: string; label: string }> = {
  high: { color: 'var(--red)', bg: 'var(--red-dim)', label: 'Urgent' },
  medium: { color: 'var(--amber)', bg: 'var(--amber-dim)', label: 'Recommended' },
  low: { color: 'var(--blue)', bg: 'var(--blue-dim)', label: 'Optional' },
};

export function DocumentDetailPanel() {
  const { selectedDocument: doc, setSelectedDocument, removeDocument, updateDocumentStatus } = useVault();
  const { isPro } = useVaultTier();

  const staleness = useMemo(() => doc ? mockStalenessWarnings.find((w) => w.docId === doc.id) : null, [doc]);
  const relatedDiscrepancy = useMemo(() => doc ? mockDiscrepancies.find((d) => d.affectedDocs.includes(doc.name)) : null, [doc]);

  if (!doc) return null;

  const isImage = doc.fileType?.startsWith('image/');
  const isPdf = doc.fileType === 'application/pdf';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={() => setSelectedDocument(null)}
    >
      <div
        className="w-[640px] max-w-[90vw] max-h-[85vh] overflow-y-auto rounded-[18px] p-6"
        style={{ background: 'var(--navy-2)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
              {doc.icon}
            </div>
            <div>
              <div className="text-[16px] font-semibold" style={{ color: 'var(--text)' }}>{doc.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[12px]" style={{ color: 'var(--text-dim)' }}>{doc.flag} {countryNames[doc.country] || doc.country}</span>
                <span className="text-[12px]" style={{ color: 'var(--text-dim)' }}>·</span>
                <span className="text-[12px]" style={{ color: 'var(--text-dim)' }}>{doc.source}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setSelectedDocument(null)} className="text-lg px-2 py-1 cursor-pointer" style={{ background: 'none', border: 'none', color: 'var(--text-dim)' }}>✕</button>
        </div>

        {/* Status + metadata row */}
        <div className="flex items-center gap-3 mb-5">
          <Pill variant={statusPillVariant[doc.status]}>{statusLabel[doc.status]}</Pill>
          {doc.sourceType && sourceTypeDisplay[doc.sourceType] && (
            <Pill variant={sourceTypeDisplay[doc.sourceType].variant}>{sourceTypeDisplay[doc.sourceType].label}</Pill>
          )}
          {doc.category && categoryDisplay[doc.category] && (
            <span className="text-[12px]" style={{ color: 'var(--text-dim)' }}>{categoryDisplay[doc.category]}</span>
          )}
          {doc.category && <span className="text-[12px]" style={{ color: 'var(--text-dim)' }}>·</span>}
          <span className="text-[12px]" style={{ color: 'var(--text-dim)' }}>{doc.type}</span>
          {doc.date && <span className="text-[12px]" style={{ color: 'var(--text-dim)' }}>· {doc.date}</span>}
          {doc.fileSize != null && <span className="text-[12px]" style={{ color: 'var(--text-dim)' }}>· {formatSize(doc.fileSize)}</span>}
        </div>

        {/* Preview area */}
        <div className="rounded-xl mb-5 overflow-hidden flex items-center justify-center"
          style={{ background: 'var(--navy-3)', border: '1px solid var(--border)', minHeight: 200 }}>
          {isImage && doc.fileUrl ? (
            <img src={doc.fileUrl} alt={doc.name} className="max-w-full max-h-[300px] object-contain" />
          ) : isPdf && doc.fileUrl ? (
            <iframe src={doc.fileUrl} title={doc.name} className="w-full" style={{ height: 300, border: 'none' }} />
          ) : (
            <div className="p-8 text-center">
              <div className="text-[32px] mb-2 opacity-40">📄</div>
              <div className="text-[13px]" style={{ color: 'var(--text-dim)' }}>
                {doc.status === 'missing' ? 'Document pending retrieval' : 'Preview available after processing'}
              </div>
            </div>
          )}
        </div>

        {/* Extracted data */}
        {doc.extractedData && Object.keys(doc.extractedData).length > 0 && (
          <div className="rounded-xl p-4 mb-5" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
            <div className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-dim)' }}>
              Extracted Data
            </div>
            <div className="flex flex-col gap-2">
              {Object.entries(doc.extractedData).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-[12px]" style={{ color: 'var(--text-dim)' }}>{key}</span>
                  <span className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staleness warning — Pro only */}
        {isPro && staleness && (() => {
          const urg = urgencyConfig[staleness.urgency];
          return (
            <div className="rounded-xl p-4 mb-5" style={{ background: urg.bg, border: `1px solid ${urg.color}25` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">⚠</span>
                <span className="text-[12px] font-semibold" style={{ color: urg.color }}>Document may be outdated</span>
                <Pill variant={staleness.urgency === 'high' ? 'red' : staleness.urgency === 'medium' ? 'amber' : 'blue'}
                  style={{ fontSize: 9, padding: '1px 8px' }}>{urg.label}</Pill>
              </div>
              <div className="text-[12px] leading-relaxed mb-2" style={{ color: 'var(--text-muted)' }}>{staleness.reason}</div>
              <div className="text-[11px] mb-1" style={{ color: 'var(--text-dim)' }}>
                <strong style={{ color: urg.color }}>Impact:</strong> {staleness.impact}
              </div>
              <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                <strong style={{ color: 'var(--text-muted)' }}>Action:</strong> {staleness.action}
              </div>
            </div>
          );
        })()}

        {/* Discrepancy alert — Pro shows full, Free shows teaser */}
        {relatedDiscrepancy && (
          isPro ? (
            <div className="rounded-xl p-4 mb-5" style={{ background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">⚠</span>
                <span className="text-[12px] font-semibold" style={{ color: 'var(--red)' }}>Discrepancy detected</span>
                <span className="text-[11px] font-medium" style={{ color: 'var(--red)' }}>{relatedDiscrepancy.financialImpact}</span>
              </div>
              <div className="text-[12px] leading-relaxed mb-2" style={{ color: 'var(--text-muted)' }}>{relatedDiscrepancy.description}</div>
              <div className="rounded-lg p-2.5 mt-2" style={{ background: 'var(--navy-4)', border: '1px solid var(--border)' }}>
                <div className="text-[11px] font-medium mb-1" style={{ color: 'var(--gold-light)' }}>Recommendation</div>
                <div className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{relatedDiscrepancy.recommendation}</div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-4 mb-5 relative overflow-hidden" style={{ background: 'var(--navy-3)', border: '1px solid var(--gold-border)' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm">⚠</span>
                <span className="text-[12px] font-semibold" style={{ color: 'var(--gold)' }}>Possible discrepancy found</span>
              </div>
              <div className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                We detected an inconsistency that may affect your pension projection.
                <span className="font-medium" style={{ color: 'var(--gold-light)' }}> Upgrade to Vault Pro to see details.</span>
              </div>
            </div>
          )
        )}

        {/* Correction workflow — Pro only */}
        {isPro && relatedDiscrepancy && (
          <div className="rounded-xl p-4 mb-5" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
            <div className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-dim)' }}>
              Correction Workflow
            </div>
            <div className="relative pl-5">
              <div className="absolute left-[7px] top-1 bottom-3 w-px" style={{ background: 'var(--border)' }} />
              {mockCorrectionSteps.map((step) => {
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';
                return (
                  <div key={step.id} className="relative pl-4 pb-3.5">
                    <div className="absolute left-0 top-[3px] w-[15px] h-[15px] rounded-full flex items-center justify-center text-[8px] font-bold"
                      style={{
                        background: isCompleted ? 'var(--green)' : isCurrent ? 'var(--gold)' : 'var(--navy-4)',
                        border: isCompleted ? 'none' : isCurrent ? '2px solid var(--gold)' : '1.5px solid var(--border)',
                        color: isCompleted ? 'var(--navy)' : isCurrent ? 'var(--navy)' : 'var(--text-dim)',
                      }}>
                      {isCompleted ? '✓' : ''}
                    </div>
                    <div className="text-[12px] font-medium" style={{ color: isCurrent ? 'var(--gold-light)' : isCompleted ? 'var(--text)' : 'var(--text-dim)' }}>
                      {step.label}
                      {step.date && <span className="text-[10px] ml-2 font-normal" style={{ color: 'var(--text-dim)' }}>{step.date}</span>}
                    </div>
                    {step.detail && (
                      <div className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.detail}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {doc.fileUrl && (
            <Button variant="primary" onClick={() => {
              const a = document.createElement('a');
              a.href = doc.fileUrl!;
              a.download = doc.name;
              a.click();
            }}>
              Download
            </Button>
          )}
          <Button variant="outline-gold" onClick={() => {
            updateDocumentStatus(doc.id, 'pending');
            setSelectedDocument({ ...doc, status: 'pending' });
          }}>
            Re-verify
          </Button>
          <Button variant="ghost" onClick={() => {
            removeDocument(doc.id);
            setSelectedDocument(null);
          }}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
