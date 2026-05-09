import type { PensionDocument } from '@/shared/types';

export const documentsBefore: PensionDocument[] = [
  // Career History
  { id: 'doc-1', name: 'Relevé de Carrière', country: 'FR', flag: '🇫🇷', source: 'CNAV', status: 'missing', date: 'Not uploaded', type: 'Career Extract', icon: '📋', category: 'career', sourceType: 'state' },
  { id: 'doc-3', name: 'Extrait de Carrière', country: 'LU', flag: '🇱🇺', source: 'CNAP', status: 'missing', date: 'Not uploaded', type: 'Career Extract', icon: '📋', category: 'career', sourceType: 'state' },
  { id: 'doc-5', name: 'Employment Certificate', country: 'CH', flag: '🇨🇭', source: 'Former employer', status: 'missing', date: 'Not uploaded', type: 'Employment', icon: '🏢', category: 'career', sourceType: 'general' },
  { id: 'doc-9', name: 'Employment Certificates (France)', country: 'FR', flag: '🇫🇷', source: 'Former employers', status: 'missing', date: 'Not uploaded', type: 'Employment', icon: '🏢', category: 'career', sourceType: 'general' },

  // Pension Statements
  { id: 'doc-2', name: 'Vorsorgeausweis', country: 'CH', flag: '🇨🇭', source: 'Pension Fund', status: 'missing', date: 'Not uploaded', type: 'Pension Statement', icon: '📊', category: 'pension', sourceType: 'workplace' },
  { id: 'doc-4', name: 'AHV/AVS Extract', country: 'CH', flag: '🇨🇭', source: 'SVA', status: 'missing', date: 'Not uploaded', type: 'State Pension', icon: '🏛️', category: 'pension', sourceType: 'state' },
  { id: 'doc-10', name: 'AGIRC-ARRCO Statement', country: 'FR', flag: '🇫🇷', source: 'AGIRC-ARRCO', status: 'missing', date: 'Not uploaded', type: 'Pension Statement', icon: '📊', category: 'pension', sourceType: 'workplace' },
  { id: 'doc-11', name: 'Foyer Prévoyance-vieillesse', country: 'LU', flag: '🇱🇺', source: 'Foyer', status: 'missing', date: 'Not uploaded', type: 'Pension Statement', icon: '📊', category: 'pension', sourceType: 'personal' },

  // Identity & Civil Status
  { id: 'doc-6', name: 'Passport / ID', country: 'CH', flag: '🇨🇭', source: 'Self', status: 'missing', date: 'Not uploaded', type: 'Identity', icon: '🪪', category: 'identity', sourceType: 'general' },
  { id: 'doc-7', name: 'Marriage Certificate', country: 'FR', flag: '🇫🇷', source: 'Civil registry', status: 'missing', date: 'Not uploaded', type: 'Civil Status', icon: '💍', category: 'identity', sourceType: 'general' },

  // Tax & Financial
  { id: 'doc-8', name: 'Tax Residence Certificate', country: 'LU', flag: '🇱🇺', source: 'ACD Luxembourg', status: 'missing', date: 'Not uploaded', type: 'Tax', icon: '🏦', category: 'tax', sourceType: 'general' },
  { id: 'doc-12', name: 'Double Taxation Form (FR-CH)', country: 'FR', flag: '🇫🇷', source: 'DGFiP', status: 'missing', date: 'Not uploaded', type: 'Tax', icon: '📑', category: 'tax', sourceType: 'general' },
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
    extractedData: { 'Employer': 'UBS AG, Zurich', 'Role': 'Senior Analyst', 'Period': 'Jan 2014 – Dec 2018', 'Final Salary': 'CHF 118,000' },
  },
  {
    id: 'doc-9', name: 'Employment Certificates (France)', country: 'FR', flag: '🇫🇷', source: 'Former employers',
    status: 'verified', date: '15 Mar 2026', type: 'Employment', icon: '🏢', category: 'career', sourceType: 'general',
    extractedData: { 'Employer 1': 'Société Générale, Paris', 'Period 1': 'Sep 2003 – May 2008', 'Employer 2': 'BNP Paribas, Paris', 'Period 2': 'Jun 2008 – Jul 2013' },
  },

  // Pension Statements
  {
    id: 'doc-2', name: 'Vorsorgeausweis', country: 'CH', flag: '🇨🇭', source: 'Pension Fund',
    status: 'verified', date: '10 Mar 2026', type: 'Pension Statement', icon: '📊', category: 'pension', sourceType: 'workplace',
    extractedData: { 'Fund': 'UBS Pension Fund', 'Insured Salary': 'CHF 112,000', 'Retirement Capital': 'CHF 284,600', 'Projected Pension (65)': 'CHF 1,420/mo' },
  },
  {
    id: 'doc-4', name: 'AHV/AVS Extract', country: 'CH', flag: '🇨🇭', source: 'SVA',
    status: 'verified', date: '10 Mar 2026', type: 'State Pension', icon: '🏛️', category: 'pension', sourceType: 'state',
    extractedData: { 'AHV Number': '756.1234.5678.90', 'Contribution Years': '10', 'Scale': 'Scale 21', 'Projected AVS (65)': 'CHF 1,085/mo' },
  },
  {
    id: 'doc-10', name: 'AGIRC-ARRCO Statement', country: 'FR', flag: '🇫🇷', source: 'AGIRC-ARRCO',
    status: 'verified', date: '13 Mar 2026', type: 'Pension Statement', icon: '📊', category: 'pension', sourceType: 'workplace',
    extractedData: { 'Points Accumulated': '4,218', 'Point Value (2025)': '€1.4159', 'Projected Monthly': '€280', 'Period': '2003 – 2013' },
  },
  {
    id: 'doc-11', name: 'Foyer Prévoyance-vieillesse', country: 'LU', flag: '🇱🇺', source: 'Foyer',
    status: 'pending', date: '16 Mar 2026', type: 'Pension Statement', icon: '📊', category: 'pension', sourceType: 'personal',
    extractedData: { 'Contract No.': 'LU-FOY-2021-7834', 'Annual Contribution': '€3,200', 'Accumulated Capital': '€14,800', 'Tax Deductible': 'Yes (Art. 111bis)' },
  },

  // Identity & Civil Status
  {
    id: 'doc-6', name: 'Passport / ID', country: 'CH', flag: '🇨🇭', source: 'Self',
    status: 'verified', date: '10 Mar 2026', type: 'Identity', icon: '🪪', category: 'identity', sourceType: 'general',
    extractedData: { 'Full Name': 'Mats Erik Karlsson', 'Date of Birth': '14 Jun 1981', 'Nationality': 'Swedish', 'Document Expiry': '2029' },
  },
  {
    id: 'doc-7', name: 'Marriage Certificate', country: 'FR', flag: '🇫🇷', source: 'Civil registry',
    status: 'verified', date: '10 Mar 2026', type: 'Civil Status', icon: '💍', category: 'identity', sourceType: 'general',
    extractedData: { 'Date of Marriage': '18 Sep 2010', 'Spouse': 'Sophie Karlsson (née Dupont)', 'Registered In': 'Paris 16e' },
  },

  // Tax & Financial
  {
    id: 'doc-8', name: 'Tax Residence Certificate', country: 'LU', flag: '🇱🇺', source: 'ACD Luxembourg',
    status: 'verified', date: '12 Mar 2026', type: 'Tax', icon: '🏦', category: 'tax', sourceType: 'general',
    extractedData: { 'Tax Year': '2025', 'Residence': 'Luxembourg-Ville', 'Tax Class': 'Class 2', 'Status': 'Resident taxpayer' },
  },
  {
    id: 'doc-12', name: 'Double Taxation Form (FR-CH)', country: 'FR', flag: '🇫🇷', source: 'DGFiP',
    status: 'pending', date: '17 Mar 2026', type: 'Tax', icon: '📑', category: 'tax', sourceType: 'general',
    extractedData: { 'Convention': 'FR-CH 1966 (amended 2014)', 'Purpose': 'Pension income allocation', 'Tax Year': '2025' },
  },

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
