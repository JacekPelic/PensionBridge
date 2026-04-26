import type { PensionDocument } from '@/shared/types';

export const documentsBefore: PensionDocument[] = [
  // Career History — state career extracts are core; employment certificates
  // are only useful to reconstruct a contribution gap.
  { id: 'doc-1', name: 'Relevé de Carrière', country: 'FR', flag: '🇫🇷', source: 'CNAV', status: 'missing', date: 'Not uploaded', type: 'Career Extract', icon: '📋', category: 'career', sourceType: 'state' },
  { id: 'doc-3', name: 'Extrait de Carrière', country: 'LU', flag: '🇱🇺', source: 'CNAP', status: 'missing', date: 'Not uploaded', type: 'Career Extract', icon: '📋', category: 'career', sourceType: 'state' },
  { id: 'doc-4', name: 'AHV/AVS Extract', country: 'CH', flag: '🇨🇭', source: 'SVA', status: 'missing', date: 'Not uploaded', type: 'State Pension', icon: '🏛️', category: 'pension', sourceType: 'state' },
  { id: 'doc-5', name: 'Employment Certificate', country: 'CH', flag: '🇨🇭', source: 'Former employer', status: 'missing', date: 'Not uploaded', type: 'Employment', icon: '🏢', category: 'career', sourceType: 'general', optional: true, notes: 'Optional \u2014 only needed to reconstruct a contribution gap.' },
  { id: 'doc-9', name: 'Employment Certificates (France)', country: 'FR', flag: '🇫🇷', source: 'Former employers', status: 'missing', date: 'Not uploaded', type: 'Employment', icon: '🏢', category: 'career', sourceType: 'general', optional: true, notes: 'Optional \u2014 only needed to reconstruct French contribution gaps.' },

  // Workplace pension statements (Pillar 2)
  { id: 'doc-2', name: 'Vorsorgeausweis', country: 'CH', flag: '🇨🇭', source: 'Pension Fund', status: 'missing', date: 'Not uploaded', type: 'Pension Statement', icon: '📊', category: 'pension', sourceType: 'workplace' },
  { id: 'doc-10', name: 'AGIRC-ARRCO Statement', country: 'FR', flag: '🇫🇷', source: 'AGIRC-ARRCO', status: 'missing', date: 'Not uploaded', type: 'Pension Statement', icon: '📊', category: 'pension', sourceType: 'workplace' },
  { id: 'doc-15', name: 'Luxembourg RCP statement', country: 'LU', flag: '🇱🇺', source: 'Employer pension fund', status: 'missing', date: 'Not uploaded', type: 'Pension Statement', icon: '🏛', category: 'pension', sourceType: 'workplace' },
  { id: 'doc-16', name: 'Freizügigkeitsausweis (vested benefits)', country: 'CH', flag: '🇨🇭', source: 'Vested-benefits foundation', status: 'missing', date: 'Not uploaded', type: 'Pension Statement', icon: '🔍', category: 'pension', sourceType: 'workplace' },

  // Personal pension statements (Pillar 3)
  { id: 'doc-11', name: 'Foyer Prévoyance-vieillesse', country: 'LU', flag: '🇱🇺', source: 'Foyer', status: 'missing', date: 'Not uploaded', type: 'Pension Statement', icon: '📊', category: 'pension', sourceType: 'personal' },
  { id: 'doc-17', name: 'French PER statement', country: 'FR', flag: '🇫🇷', source: 'Bank or insurer', status: 'missing', date: 'Not uploaded', type: 'Pension Statement', icon: '🏦', category: 'pension', sourceType: 'personal' },
  { id: 'doc-18', name: 'Swiss Pillar 3a attestation', country: 'CH', flag: '🇨🇭', source: '3a provider', status: 'missing', date: 'Not uploaded', type: 'Pension Statement', icon: '🇨🇭', category: 'pension', sourceType: 'personal' },
];

export const documentsAfter: PensionDocument[] = [
  // Career History
  {
    id: 'doc-1', name: 'Relevé de Carrière', country: 'FR', flag: '🇫🇷', source: 'CNAV',
    status: 'verified', date: '12 Mar 2026', type: 'Career Extract', icon: '📋', category: 'career', sourceType: 'state',
    extractedData: { 'Policy Number': 'FR-CNAV-2024-18432', 'Period Covered': '2008 – 2018', 'Total Quarters': '40', 'Average Annual Salary': '€38,420' },
  },
  {
    id: 'doc-3', name: 'Extrait de Carrière', country: 'LU', flag: '🇱🇺', source: 'CNAP',
    status: 'verified', date: '11 Mar 2026', type: 'Career Extract', icon: '📋', category: 'career', sourceType: 'state',
    extractedData: { 'Affiliation No.': 'LU-CNAP-90217', 'Period Covered': '2018 – present', 'Insurance Months': '96', 'Contribution Base': '€74,160/yr' },
  },
  {
    id: 'doc-5', name: 'Employment Certificate', country: 'CH', flag: '🇨🇭', source: 'Former employer',
    status: 'pending', date: '14 Mar 2026', type: 'Employment', icon: '🏢', category: 'career', sourceType: 'general',
    optional: true,
    notes: 'Optional \u2014 uploaded to reconstruct the Jan\u2013Mar 2020 gap.',
    extractedData: { 'Employer': 'UBS AG, Zurich', 'Role': 'Senior Analyst', 'Period': 'Sep 2014 – Dec 2019', 'Final Salary': 'CHF 125,000' },
  },
  {
    id: 'doc-9', name: 'Employment Certificates (France)', country: 'FR', flag: '🇫🇷', source: 'Former employers',
    status: 'verified', date: '15 Mar 2026', type: 'Employment', icon: '🏢', category: 'career', sourceType: 'general',
    optional: true,
    notes: 'Optional \u2014 helps cross-check the 2013\u20132014 gap on the French Relev\u00e9.',
    extractedData: { 'Employer 1': 'Société Générale, Paris', 'Period 1': 'Sep 2003 – May 2008', 'Employer 2': 'BNP Paribas, Paris', 'Period 2': 'Jun 2008 – Jul 2013' },
  },

  // Pension Statements
  {
    id: 'doc-2', name: 'Vorsorgeausweis', country: 'CH', flag: '🇨🇭', source: 'Pension Fund',
    status: 'verified', date: '10 Mar 2026', type: 'Pension Statement', icon: '📊', category: 'pension', sourceType: 'workplace',
    extractedData: { 'Fund': 'UBS Pension Fund', 'Insured Salary': 'CHF 85,000', 'Retirement Capital': 'CHF 210,000', 'Projected Pension (65)': 'CHF 1,040/mo' },
  },
  {
    id: 'doc-4', name: 'AHV/AVS Extract', country: 'CH', flag: '🇨🇭', source: 'SVA',
    status: 'verified', date: '10 Mar 2026', type: 'State Pension', icon: '🏛️', category: 'pension', sourceType: 'state',
    extractedData: { 'AHV Number': '756.1234.5678.90', 'Contribution Years': '5.3', 'Scale': 'Scale 11', 'Projected AVS (65)': 'CHF 340/mo' },
  },
  {
    id: 'doc-10', name: 'AGIRC-ARRCO Statement', country: 'FR', flag: '🇫🇷', source: 'AGIRC-ARRCO',
    status: 'verified', date: '13 Mar 2026', type: 'Pension Statement', icon: '📊', category: 'pension', sourceType: 'workplace',
    extractedData: { 'Points Accumulated': '4,820', 'Point Value (2025)': '€1.4159', 'Projected Monthly': '€420', 'Period': '2003 – 2013' },
  },
  {
    id: 'doc-11', name: 'Foyer Prévoyance-vieillesse', country: 'LU', flag: '🇱🇺', source: 'Foyer',
    status: 'pending', date: '16 Mar 2026', type: 'Pension Statement', icon: '📊', category: 'pension', sourceType: 'personal',
    extractedData: { 'Contract No.': 'LU-FOY-2021-7834', 'Annual Contribution': '€3,200', 'Accumulated Capital': '€14,800', 'Tax Deductible': 'Yes (Art. 111bis)' },
  },

  // Workplace / personal pension statements still outstanding even after the
  // user's first upload wave — these remain the open asks on the dashboard.
  { id: 'doc-15', name: 'Luxembourg RCP statement', country: 'LU', flag: '🇱🇺', source: 'Employer pension fund', status: 'missing', date: 'Not located yet', type: 'Pension Statement', icon: '🏛', category: 'pension', sourceType: 'workplace' },
  { id: 'doc-16', name: 'Freizügigkeitsausweis (vested benefits)', country: 'CH', flag: '🇨🇭', source: 'Vested-benefits foundation', status: 'missing', date: 'Not located yet', type: 'Pension Statement', icon: '🔍', category: 'pension', sourceType: 'workplace' },
  { id: 'doc-17', name: 'French PER statement', country: 'FR', flag: '🇫🇷', source: 'Bank or insurer', status: 'missing', date: 'Not uploaded', type: 'Pension Statement', icon: '🏦', category: 'pension', sourceType: 'personal' },
  { id: 'doc-18', name: 'Swiss Pillar 3a attestation', country: 'CH', flag: '🇨🇭', source: '3a provider', status: 'missing', date: 'Not uploaded', type: 'Pension Statement', icon: '🇨🇭', category: 'pension', sourceType: 'personal' },

  // Correspondence
  {
    id: 'doc-13', name: 'CNAP Gap Correction Request', country: 'LU', flag: '🇱🇺', source: 'CNAP',
    status: 'pending', date: '18 Mar 2026', type: 'Correspondence', icon: '✉️', category: 'correspondence', sourceType: 'state',
    extractedData: { 'Reference': 'CNAP-CORR-2026-0412', 'Gap Period': 'Jan – Mar 2020', 'Submitted': '18 Mar 2026', 'Expected Response': '4 – 6 weeks' },
  },
  {
    id: 'doc-14', name: 'EU Coordination Form E205', country: 'CH', flag: '🇨🇭', source: 'SVA',
    status: 'verified', date: '11 Mar 2026', type: 'Correspondence', icon: '✉️', category: 'correspondence', sourceType: 'state',
    extractedData: { 'Form': 'E205 CH', 'Purpose': 'Confirm Swiss contribution periods for EU totalisation', 'Periods Confirmed': 'Sep 2014 – Dec 2019' },
  },
];
