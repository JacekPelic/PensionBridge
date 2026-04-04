import type { FamilyMember } from '@/shared/types';

export const familyMembers: FamilyMember[] = [
  { id: 'fm-1', initials: 'AK', name: 'Anna Karlsson', relation: 'Spouse', accessLevel: 'full', gradientFrom: '#ec4899', gradientTo: '#f472b6' },
  { id: 'fm-2', initials: 'LK', name: 'Lea Karlsson', relation: 'Daughter', accessLevel: 'beneficiary', gradientFrom: '#8b5cf6', gradientTo: '#a78bfa' },
  { id: 'fm-3', initials: 'ON', name: 'Oscar Nilsson', relation: 'Brother', accessLevel: 'emergency', gradientFrom: '#06b6d4', gradientTo: '#22d3ee' },
  { id: 'fm-4', initials: 'EK', name: 'Erik Karlsson', relation: 'Father', accessLevel: 'readonly', gradientFrom: '#f97316', gradientTo: '#fb923c' },
];
