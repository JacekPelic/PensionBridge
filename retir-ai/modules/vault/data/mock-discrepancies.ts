export interface Discrepancy {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  financialImpact: string;
  affectedDocs: string[];
  recommendation: string;
}

export interface StalenessWarning {
  docId: string;
  reason: string;
  impact: string;
  action: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface CorrectionStep {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
  detail?: string;
  date?: string;
}

export const mockDiscrepancies: Discrepancy[] = [
  {
    id: 'disc-1',
    title: 'Missing 2 quarters in French career extract',
    description: 'Your CNAV Relevé de Carrière shows 40 validated quarters, but your employment dates (Sep 2003 – Jul 2013) suggest 42 quarters. Two quarters may not have been credited.',
    severity: 'high',
    financialImpact: '−€45/mo at retirement',
    affectedDocs: ['Relevé de Carrière', 'Employment Certificates (France)'],
    recommendation: 'Request a detailed quarterly breakdown from CNAV to identify which quarters are missing. This may be a reporting lag or an employer contribution issue.',
  },
  {
    id: 'disc-2',
    title: 'Swiss employment end date mismatch',
    description: 'Your Employment Certificate states end date Dec 2018, but your AHV/AVS extract shows contributions through Jan 2019. One month may be double-counted or misattributed.',
    severity: 'medium',
    financialImpact: '~€12/mo projection variance',
    affectedDocs: ['Employment Certificate', 'AHV/AVS Extract'],
    recommendation: 'Contact SVA Zürich to clarify the contribution period. If the extra month is valid, your AVS scale number may increase.',
  },
  {
    id: 'disc-3',
    title: 'Luxembourg gap not reflected in CNAP extract',
    description: 'Your career timeline shows a 3-month gap (Jan–Mar 2020) between Swiss and Luxembourg employment, but your CNAP Extrait de Carrière starts from Apr 2020 without flagging the gap. This gap may affect EU totalisation calculations.',
    severity: 'medium',
    financialImpact: '−€120/mo if uncorrected',
    affectedDocs: ['Extrait de Carrière', 'Employment Certificate'],
    recommendation: 'Submit an E205 form from Switzerland to CNAP to ensure proper EU period coordination.',
  },
];

export const mockStalenessWarnings: StalenessWarning[] = [
  {
    docId: 'doc-2',
    reason: 'Your Vorsorgeausweis is from March 2026. Pension funds typically issue updated statements in Q1 each year. A newer version may reflect additional contributions and investment returns.',
    impact: 'Projection could be off by CHF 8,000–15,000 in capital',
    action: 'Contact UBS Pension Fund for your 2027 statement',
    urgency: 'low',
  },
  {
    docId: 'doc-8',
    reason: 'Your Luxembourg tax residence certificate covers fiscal year 2025. It will not be valid for 2027 double-taxation claims.',
    impact: 'May be taxed at source in the wrong country',
    action: 'Request a 2026 certificate from ACD Luxembourg',
    urgency: 'high',
  },
  {
    docId: 'doc-1',
    reason: 'France adjusted the SAM (Salaire Annuel Moyen) reference table in January 2027. Your Relevé de Carrière from March 2026 uses the old table.',
    impact: 'French state pension projection may be off by €30–60/mo',
    action: 'Download an updated Relevé from lassuranceretraite.fr',
    urgency: 'medium',
  },
];

export const mockCorrectionSteps: CorrectionStep[] = [
  { id: 'cs-1', label: 'Discrepancy detected', status: 'completed', detail: '2 missing quarters identified in French career extract', date: '18 Mar 2026' },
  { id: 'cs-2', label: 'Correction letter prepared', status: 'completed', detail: 'Pre-filled letter to CNAV requesting quarterly breakdown review', date: '18 Mar 2026' },
  { id: 'cs-3', label: 'Submitted to institution', status: 'current', detail: 'Marked as sent to CNAV on 20 Mar 2026. Expected response: 2–3 weeks.', date: '20 Mar 2026' },
  { id: 'cs-4', label: 'Awaiting response', status: 'upcoming', detail: 'CNAV typically responds within 2–3 weeks. Follow-up nudge scheduled for 10 Apr 2026.' },
  { id: 'cs-5', label: 'Resolved', status: 'upcoming', detail: 'Re-upload corrected extract to update your projection.' },
];
