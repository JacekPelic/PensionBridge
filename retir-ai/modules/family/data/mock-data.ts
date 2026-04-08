import type { TrustedDelegate, AuditEntry } from '@/shared/types';

export const trustedDelegates: TrustedDelegate[] = [
  // Family
  { id: 'fm-1', initials: 'AK', name: 'Anna Karlsson', relation: 'Spouse', delegateType: 'family', accessLevel: 'full', scopes: ['dashboard', 'career', 'pension', 'vault', 'simulation', 'radar', 'claims'], gradientFrom: '#ec4899', gradientTo: '#f472b6', addedDate: '2025-09-14' },
  { id: 'fm-2', initials: 'LK', name: 'Lea Karlsson', relation: 'Daughter', delegateType: 'family', accessLevel: 'beneficiary', scopes: ['dashboard', 'pension', 'claims'], gradientFrom: '#8b5cf6', gradientTo: '#a78bfa', addedDate: '2025-10-02' },
  { id: 'fm-3', initials: 'ON', name: 'Oscar Nilsson', relation: 'Brother', delegateType: 'family', accessLevel: 'emergency', scopes: ['dashboard', 'claims'], gradientFrom: '#06b6d4', gradientTo: '#22d3ee', addedDate: '2025-11-20' },
  { id: 'fm-4', initials: 'EK', name: 'Erik Karlsson', relation: 'Father', delegateType: 'family', accessLevel: 'readonly', scopes: ['dashboard', 'pension'], gradientFrom: '#f97316', gradientTo: '#fb923c', addedDate: '2026-01-05' },
  // Advisors
  { id: 'ad-1', initials: 'SV', name: 'Sophie Villeneuve', relation: 'Pension Consultant', delegateType: 'advisor', accessLevel: 'contributor', scopes: ['career', 'pension', 'vault'], gradientFrom: '#3b82f6', gradientTo: '#60a5fa', company: 'CrossBorder Pensions AG', title: 'Senior Cross-Border Advisor', addedDate: '2026-02-18' },
  { id: 'ad-2', initials: 'MW', name: 'Marc Weber', relation: 'Tax Advisor', delegateType: 'advisor', accessLevel: 'readonly', scopes: ['pension', 'simulation'], gradientFrom: '#10b981', gradientTo: '#34d399', company: 'Deloitte Luxembourg', title: 'International Tax Manager', addedDate: '2026-03-01' },
];

/** Backwards-compatible alias */
export const familyMembers = trustedDelegates;

export const auditLog: AuditEntry[] = [
  { id: 'au-1', delegateId: 'ad-1', delegateName: 'Sophie Villeneuve', action: 'Uploaded document', scope: 'vault', timestamp: '2026-04-07T14:22:00Z', detail: 'Added "CNAV Career Extract 2024" to Document Vault' },
  { id: 'au-2', delegateId: 'ad-1', delegateName: 'Sophie Villeneuve', action: 'Updated career period', scope: 'career', timestamp: '2026-04-05T09:15:00Z', detail: 'Added missing employment period: Alstom France (2009–2012)' },
  { id: 'au-3', delegateId: 'ad-2', delegateName: 'Marc Weber', action: 'Viewed pension breakdown', scope: 'pension', timestamp: '2026-04-04T16:40:00Z', detail: 'Accessed pension breakdown for all 3 countries' },
  { id: 'au-4', delegateId: 'ad-1', delegateName: 'Sophie Villeneuve', action: 'Added note', scope: 'pension', timestamp: '2026-04-02T11:05:00Z', detail: 'Flagged potential gap: French P2 contributions 2010–2011 may be under-reported' },
  { id: 'au-5', delegateId: 'fm-1', delegateName: 'Anna Karlsson', action: 'Viewed claim guide', scope: 'claims', timestamp: '2026-03-28T20:12:00Z', detail: 'Opened France claim instructions' },
];
