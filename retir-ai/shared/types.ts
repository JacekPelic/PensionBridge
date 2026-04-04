export type Country = 'FR' | 'CH' | 'LU';
export type PillarType = 'p1' | 'p2' | 'p3';
export type Severity = 'high' | 'medium' | 'low';
export type DocStatus = 'verified' | 'pending' | 'missing';
export type AccessLevel = 'full' | 'beneficiary' | 'emergency' | 'readonly';

export interface UserProfile {
  firstName: string;
  lastName: string;
  initials: string;
  dateOfBirth: string;
  residenceCountry: Country;
  residenceLabel: string;
  targetRetirementAge: number;
  monthlyIncomeGoal: number;
}

export interface EmploymentPeriod {
  id: string;
  country: Country;
  employer: string;
  role: string;
  startDate: string;
  endDate: string | null;
  grossSalary: number;
  currency: string;
  pillars: PillarType[];
  verified: boolean;
  insuranceYears: number;
  pensionBody?: string;
  notes?: string;

}

export interface PensionGap {
  id: string;
  period: string;
  country: Country;
  months: number;
  monthlyImpact: number;
  correctable: boolean;
  correctionCost?: number;
  description: string;
}

export interface PensionBreakdown {
  country: Country;
  countryLabel: string;
  flag: string;
  pillar1: number;
  pillar1Body: string;
  pillar1Years: number;
  pillar2: number;
  pillar2Body: string;
  pillar2Status: 'confirmed' | 'estimated' | 'unlocated';
  pillar3: number;
  pillar3Body: string;
  total: number;
}

export interface ProductOffer {
  id: string;
  provider: string;
  providerInitial: string;
  providerGradient: string;
  country: string;
  productName: string;
  description: string;
  gapImpact: number;
  monthlyContribution: number;
  horizon: number;
  isBestMatch: boolean;
}

export type SourceType = 'state' | 'workplace' | 'personal' | 'general';
export type DocCategory = 'career' | 'pension' | 'identity' | 'tax' | 'correspondence';

export interface PensionDocument {
  id: string;
  name: string;
  country: Country;
  flag: string;
  source: string;
  status: DocStatus;
  date: string;
  type: string;
  icon: string;
  category?: DocCategory;
  sourceType?: SourceType;
  accuracyBoost?: number;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  extractedData?: Record<string, string>;
  notes?: string;
}

export type AlertCategory = 'retirement_age' | 'tax' | 'contribution' | 'benefit';

export interface RiskAlert {
  id: string;
  title: string;
  description: string;
  country: string;
  flag: string;
  severity: Severity;
  impact: string;
  timestamp: string;
  icon: string;
  category: AlertCategory;
  source: string;
  effectiveDate?: string;
}

export interface FamilyMember {
  id: string;
  initials: string;
  name: string;
  relation: string;
  accessLevel: AccessLevel;
  gradientFrom: string;
  gradientTo: string;
}

export interface CapitalComponent {
  label: string;
  country: Country;
  monthlyAnnuity: number;
  lumpSumOption: number | null;
  payoutType: 'annuity_only' | 'capital_choice';
  isHighlighted?: boolean;
}

export interface ChatMessage {
  role: 'bot' | 'user';
  text: string;
  suggestions: string[];
}
