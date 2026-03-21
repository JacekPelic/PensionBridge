'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useDataStage } from '@/providers/DataStageProvider';

// ─── Guide data per document ──────────────────────────────────────
interface GuideStep {
  num: number;
  text: string;
  detail?: string;
}

interface AltPath {
  title: string;
  options: string[];
}

interface GuideInfo {
  title: string;
  timeEstimate: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  language: string;
  steps: GuideStep[];
  altPath?: AltPath;
  tips: string[];
  conciergeNote: string;
}

const guideData: Record<string, GuideInfo> = {
  'Employment Certificate — Swiss employer (Sep 2014 – Dec 2019)': {
    title: 'How to get your Swiss Employment Certificate',
    timeEstimate: '1–3 weeks',
    difficulty: 'moderate',
    language: 'German / English',
    steps: [
      { num: 1, text: 'Contact your former Swiss employer\'s HR', detail: 'Reach out to the HR department of the company where you worked from Sep 2014 to Dec 2019. Ask for an "Arbeitszeugnis" or "Employment Certificate" confirming your exact employment dates and role.' },
      { num: 2, text: 'Specify what you need', detail: 'Request that the certificate explicitly states: start date, end date, job title, and employment type (full-time). CNAP requires these exact fields for gap verification.' },
      { num: 3, text: 'Follow up if needed', detail: 'Swiss employers are legally required to provide an Arbeitszeugnis (Art. 330a OR). If HR is unresponsive after 2 weeks, send a registered letter referencing this obligation.' },
      { num: 4, text: 'Upload to RetirAI', detail: 'Once received (PDF or scanned letter), upload it here. We\'ll extract the dates and cross-reference with CNAP records automatically.' },
    ],
    tips: [
      'If you still have your original Arbeitszeugnis from when you left, that works — just upload it',
      'Many large Swiss employers have dedicated Former Employee Services portals',
      'The certificate must be on company letterhead or officially stamped to be accepted by CNAP',
    ],
    conciergeNote: 'Our team can contact your former employer\'s HR on your behalf and handle the back-and-forth in German. Typical turnaround: 5–7 business days.',
  },
  'Employment Certificates — French employers': {
    title: 'How to get your French Employment Certificates',
    timeEstimate: '2–4 weeks',
    difficulty: 'easy',
    language: 'French',
    steps: [
      { num: 1, text: 'Contact each former employer\'s HR', detail: 'Reach out to the HR department of each company where you worked in France. Request an "attestation de travail" for each period (Sep 2003–May 2008 and Jun 2008–Jul 2013).' },
      { num: 2, text: 'Specify what you need', detail: 'Ask for a letter confirming: full name, employment dates, job title. You can send the request by email or registered post.' },
      { num: 3, text: 'Verify the content', detail: 'Each certificate should confirm: full name, employment dates, job title. French law (Art. L1234-19 Code du travail) guarantees your right to receive this document.' },
      { num: 4, text: 'Upload both to RetirAI', detail: 'Upload each certificate separately. We\'ll match them to your CNAV career extract and flag any discrepancies.' },
    ],
    tips: [
      'French employers must provide an attestation de travail — it\'s a legal right under the Code du travail',
      'If you have your old "certificat de travail" from when you left, that\'s the same thing',
      'Payslips from these periods can also serve as supporting evidence if certificates are delayed',
    ],
    conciergeNote: 'We can draft and send the request letters in French on your behalf. Most French employers respond within 2 weeks.',
  },
  'Extrait de Carrière': {
    title: 'How to get your Luxembourg Career Extract',
    timeEstimate: '2–3 weeks',
    difficulty: 'easy',
    language: 'French / German',
    steps: [
      { num: 1, text: 'Go to guichet.lu', detail: 'Visit guichet.public.lu and log in with your LuxTrust certificate or eIDAS-compatible ID. Navigate to "Social security" → "Pension" → "Career extract".' },
      { num: 2, text: 'Request your extract online', detail: 'Fill in the online form. CNAP will generate your "Extrait de carrière" showing all Luxembourg insurance periods and salary data.' },
      { num: 3, text: 'Wait for delivery', detail: 'The extract is typically available within 10–15 business days. You\'ll receive it by post to your registered address, or digitally if you opted in.' },
      { num: 4, text: 'Upload to RetirAI', detail: 'Upload the PDF. We\'ll extract your exact insurance years, salary coefficients, and calculate your verified CNAP pension.' },
    ],
    altPath: {
      title: 'Can\'t access guichet.lu?',
      options: [
        'LuxTrust token expired or lost — order a replacement at luxtrust.lu (takes ~5 business days) or visit a LuxTrust registration authority in person (same day)',
        'No LuxTrust at all — you can request the extract by post: send a signed letter with a copy of your ID to CNAP, 1 boulevard Prince Henri, L-1724 Luxembourg. Include your Luxembourg social security number (matricule)',
        'Living abroad — call CNAP directly at +352 22 41 41-1 and request the extract by phone. They\'ll post it to your current address',
      ],
    },
    tips: [
      'Your Luxembourg social security number (matricule) is on any old payslip or the "Carte d\'identification de sécurité sociale" — check old documents',
      'The extract covers all periods where Luxembourg social security contributions were paid',
      'If you also need EU totalization data, request an "E205 LU" form at the same time',
    ],
    conciergeNote: 'We can submit the guichet.lu request on your behalf if you grant us power of attorney. If your LuxTrust is expired, we can request the extract by post from CNAP directly.',
  },
  'AHV/AVS Individual Account Extract': {
    title: 'How to get your Swiss AVS/AHV Extract',
    timeEstimate: '1–2 weeks',
    difficulty: 'easy',
    language: 'German / French',
    steps: [
      { num: 1, text: 'Visit ahv-iv.ch', detail: 'Go to ahv-iv.ch (German) or avs-ai.ch (French). Click "Individual account" → "Order an extract".' },
      { num: 2, text: 'Fill in the request form', detail: 'Provide your AHV/AVS number (756.XXXX.XXXX.XX — found on your Swiss health insurance card or any old payslip). If you don\'t have it, provide your full name and date of birth.' },
      { num: 3, text: 'Receive by post', detail: 'The extract arrives in 7–10 business days to your registered address. It shows every year of contributions, the insured income, and any gaps.' },
      { num: 4, text: 'Upload to RetirAI', detail: 'Upload the PDF. We\'ll replace your estimated Swiss P1 with verified figures and recalculate your scale number.' },
    ],
    tips: [
      'Your AHV number is on your Swiss health insurance card (Versichertenkarte) — check if you still have it',
      'You can also request the extract at any Swiss embassy or consulate if you\'re abroad',
      'The extract is free of charge and available to anyone who has ever contributed to the Swiss system',
    ],
    conciergeNote: 'We can order this extract for you — we just need your AHV/AVS number or Swiss ID details. Delivered directly to us for faster processing.',
  },
  'Relevé de Carrière': {
    title: 'How to get your French Career Statement',
    timeEstimate: 'Instant – 5 min',
    difficulty: 'easy',
    language: 'French',
    steps: [
      { num: 1, text: 'Log in to lassuranceretraite.fr', detail: 'Go to lassuranceretraite.fr and sign in with your FranceConnect credentials (use your impots.gouv.fr or Ameli login).' },
      { num: 2, text: 'Navigate to your career overview', detail: 'Click "Mon relevé de carrière" in your personal space. This shows all validated trimestres, annual salaries, and any gaps.' },
      { num: 3, text: 'Download the PDF', detail: 'Click "Télécharger" to download your full career statement as PDF. This is the official CNAV document.' },
      { num: 4, text: 'Upload to RetirAI', detail: 'Upload the PDF. We\'ll extract your trimestres, SAM (best 25 years), and calculate your verified CNAV pension with décote/surcote applied.' },
    ],
    altPath: {
      title: 'Can\'t log in to FranceConnect?',
      options: [
        'Forgot your impots.gouv.fr password — reset it at impots.gouv.fr → "Mot de passe oublié". You\'ll need your tax number (numéro fiscal, on any old tax notice) and your email address',
        'Don\'t have a FranceConnect account at all — create one via impots.gouv.fr using your numéro fiscal + revenu fiscal de référence (from your last tax notice). Takes about 5 minutes',
        'No longer a French tax resident — you can still access FranceConnect with your old credentials. Alternatively, call CNAV at +33 9 71 10 39 60 and request your relevé de carrière by post (allow 3–4 weeks)',
        'Lost your numéro fiscal — visit any Centre des Finances Publiques in person with ID, or call +33 809 401 401 to recover it',
      ],
    },
    tips: [
      'This is the fastest document to get — it\'s available instantly online if you have FranceConnect',
      'The "Estimation Indicative Globale" (EIG) gives you an even more detailed projection — download that too if available',
      'Your numéro fiscal is a 13-digit number on the top-left of any French tax notice (avis d\'imposition)',
    ],
    conciergeNote: 'If you\'re stuck with FranceConnect, we can walk you through it on a screen-share call. If you can\'t access the online portal at all, we can request the document by post from CNAV on your behalf.',
  },
  'Vorsorgeausweis (BVG/LPP Statement)': {
    title: 'How to find your Swiss Pillar 2 statement',
    timeEstimate: '1–4 weeks (depends on situation)',
    difficulty: 'hard',
    language: 'German',
    steps: [
      { num: 1, text: 'Check if you already have it', detail: 'Look for your last "Vorsorgeausweis" or "Pensionskassenausweis" from your Swiss employer. You received one annually while employed. It shows your vested benefits (Freizügigkeitsleistung), projected pension, and insured salary.' },
      { num: 2, text: 'If you don\'t have it — locate your vested benefits', detail: 'When you left your Swiss employer in Dec 2019, your BVG capital was transferred to a Freizügigkeitskonto (vested benefits account). If you chose a provider, contact them. If you didn\'t choose, the capital may have been sent to the Stiftung Auffangeinrichtung BVG.' },
      { num: 3, text: 'Search the central register', detail: 'Visit zentralstelle.ch (Zentralstelle 2. Säule) and search for forgotten assets using your AHV number. This free service checks all pension funds and vested benefit accounts in Switzerland.' },
      { num: 4, text: 'Request a current statement', detail: 'Once located, contact the institution holding your capital and request a current "Freizügigkeitsausweis". This shows your balance, investment strategy, and annuity conversion rate.' },
      { num: 5, text: 'Upload to RetirAI', detail: 'Upload the statement. We\'ll add your Pillar 2 capital to your projection — this could significantly change your retirement picture.' },
    ],
    altPath: {
      title: 'Don\'t have your AHV number or can\'t access zentralstelle.ch?',
      options: [
        'AHV number lost — check old Swiss payslips, your Versichertenkarte (health insurance card), or any correspondence from SVA/AVS. The format is 756.XXXX.XXXX.XX',
        'Never received a Versichertenkarte — contact the SVA office of the canton where you worked (for UBS Zurich: SVA Zürich, +41 44 448 50 00). They can look you up by name and date of birth',
        'zentralstelle.ch search returned nothing — this doesn\'t mean the money is lost. The Auffangeinrichtung (aeis.ch) may hold it under a slightly different name spelling. Call them at +41 41 799 75 75 with your personal details',
        'Can\'t navigate German-language sites — the entire process can be done by phone or letter. Write to: Zentralstelle 2. Säule, Sicherheitsfonds BVG, Eigerplatz 2, 3007 Bern',
      ],
    },
    tips: [
      'The Stiftung Auffangeinrichtung BVG (aeis.ch) is the default destination for unclaimed vested benefits — start there if you\'re unsure',
      'zentralstelle.ch is the official free search service — avoid paid "pension finder" services',
      'Your Pillar 2 capital has been earning interest since 2019 — the current value may be higher than your last statement',
      'If you find the capital, you\'ll also want to check buy-in opportunities (Einkauf) for tax optimization',
    ],
    conciergeNote: 'Locating Swiss Pillar 2 assets is one of the most common problems we solve. We can search zentralstelle.ch, contact the Auffangeinrichtung, and negotiate with the pension fund — all in German, on your behalf.',
  },
};

// ─── Manual entry form definitions ──────────────────────────────────
interface ManualField {
  id: string;
  label: string;
  hint: string;
  type: 'number' | 'text' | 'date';
  placeholder: string;
  unit?: string;
}

interface ManualFormDef {
  title: string;
  description: string;
  fields: ManualField[];
  privacyNote: string;
}

const manualForms: Record<string, ManualFormDef> = {
  'Relevé de Carrière': {
    title: 'Enter your French career data manually',
    description: 'You can find these values on your Relevé de Carrière from CNAV, or on your annual pension statement.',
    fields: [
      { id: 'trimestres', label: 'Trimestres validated', hint: 'Labeled "Trimestres validés (tous régimes)" — total across all schemes', type: 'number', placeholder: 'e.g. 41' },
      { id: 'sam', label: 'Average annual salary (SAM)', hint: 'Labeled "Salaire annuel moyen" — average of your best 25 years. Found on the projection page', type: 'number', placeholder: 'e.g. 38500', unit: '€/yr' },
      { id: 'projectedMonthly', label: 'Projected monthly pension', hint: 'Labeled "Montant estimé" — the monthly amount at your target retirement age', type: 'number', placeholder: 'e.g. 1220', unit: '€/mo' },
      { id: 'frYears', label: 'Total French contribution years', hint: 'Count of years with at least 1 validated trimestre — visible in the year-by-year table', type: 'number', placeholder: 'e.g. 10.9' },
    ],
    privacyNote: 'Your data stays in your browser and is only used for calculations. We never store or transmit manually entered data to third parties.',
  },
  'AHV/AVS Individual Account Extract': {
    title: 'Enter your Swiss AVS/AHV data manually',
    description: 'These values are on your Individuelles Konto / Compte individuel extract from SVA.',
    fields: [
      { id: 'contributionYears', label: 'Contribution years', hint: 'Count the number of years listed in the extract — each row is one year', type: 'number', placeholder: 'e.g. 5.3' },
      { id: 'avgIncome', label: 'Average annual insured income', hint: 'Add up all "Einkommen" values and divide by the number of years', type: 'number', placeholder: 'e.g. 125000', unit: 'CHF/yr' },
      { id: 'ahvNumber', label: 'AHV/AVS number', hint: 'Format: 756.XXXX.XXXX.XX — found at the top of the extract', type: 'text', placeholder: '756.____.____.__ ' },
    ],
    privacyNote: 'Your data stays in your browser and is only used for calculations. Your AHV number is used solely to cross-reference records — it is never shared.',
  },
  'Extrait de Carrière': {
    title: 'Enter your Luxembourg career data manually',
    description: 'These values are on your Extrait de Carrière from CNAP.',
    fields: [
      { id: 'insuranceYears', label: 'Luxembourg insurance years', hint: 'Labeled "Périodes d\'assurance" — total months ÷ 12. Found on the summary page', type: 'number', placeholder: 'e.g. 6.0' },
      { id: 'coefficientSum', label: 'Total coefficient sum', hint: 'Labeled "Somme des coefficients" — sum of annual salary ÷ reference salary for each year', type: 'number', placeholder: 'e.g. 7.2' },
      { id: 'projectedMonthly', label: 'Projected monthly pension', hint: 'Labeled "Pension mensuelle estimée" — if shown on your extract', type: 'number', placeholder: 'e.g. 980', unit: '€/mo' },
    ],
    privacyNote: 'Your data stays in your browser and is only used for calculations. We never store or transmit manually entered data to third parties.',
  },
  'Vorsorgeausweis (BVG/LPP Statement)': {
    title: 'Enter your Swiss Pillar 2 data manually',
    description: 'These values are on your Vorsorgeausweis (pension fund statement) or Freizügigkeitsausweis (vested benefits statement).',
    fields: [
      { id: 'vestedBenefits', label: 'Vested benefits / Capital balance', hint: 'Labeled "Freizügigkeitsleistung" or "Austrittsleistung" — the total capital in your account', type: 'number', placeholder: 'e.g. 210000', unit: 'CHF' },
      { id: 'projectedAnnuity', label: 'Projected annual pension', hint: 'Labeled "Voraussichtliche Altersrente" — the annual pension at standard retirement age', type: 'number', placeholder: 'e.g. 12480', unit: 'CHF/yr' },
      { id: 'conversionRate', label: 'Conversion rate', hint: 'Labeled "Umwandlungssatz" — typically between 5% and 6.8%. Converts capital to annuity', type: 'number', placeholder: 'e.g. 6.0', unit: '%' },
      { id: 'insuredSalary', label: 'Insured salary', hint: 'Labeled "Versicherter Lohn" — the salary base for contributions', type: 'number', placeholder: 'e.g. 85000', unit: 'CHF/yr' },
    ],
    privacyNote: 'Your data stays in your browser and is only used for calculations. We never store or transmit manually entered data to third parties.',
  },
  'Employment Certificate — Swiss employer (Sep 2014 – Dec 2019)': {
    title: 'Enter your Swiss employment details manually',
    description: 'If you have the certificate but prefer not to upload it, just enter the key details below.',
    fields: [
      { id: 'employer', label: 'Employer name', hint: 'The company name as it appears on the certificate', type: 'text', placeholder: 'e.g. UBS AG' },
      { id: 'jobTitle', label: 'Job title', hint: 'Your official role/title', type: 'text', placeholder: 'e.g. Senior Analyst' },
      { id: 'startDate', label: 'Start date', hint: 'Exact start date on the certificate', type: 'date', placeholder: '' },
      { id: 'endDate', label: 'End date', hint: 'Exact end date on the certificate', type: 'date', placeholder: '' },
    ],
    privacyNote: 'Your data stays in your browser and is only used to verify the gap between your Swiss and Luxembourg employment.',
  },
  'Employment Certificates — French employers': {
    title: 'Enter your French employment details manually',
    description: 'Enter the details from each employment certificate. This helps verify your CNAV contribution record.',
    fields: [
      { id: 'employer1', label: 'First employer name', hint: 'Company name (Sep 2003 – May 2008)', type: 'text', placeholder: 'e.g. BNP Paribas' },
      { id: 'title1', label: 'Job title', hint: 'Your role at the first employer', type: 'text', placeholder: 'e.g. Junior Analyst' },
      { id: 'startDate1', label: 'Start date', hint: 'Exact start date', type: 'date', placeholder: '' },
      { id: 'endDate1', label: 'End date', hint: 'Exact end date', type: 'date', placeholder: '' },
      { id: 'employer2', label: 'Second employer name', hint: 'Company name (Jun 2008 – Jul 2013)', type: 'text', placeholder: 'e.g. Société Générale' },
      { id: 'title2', label: 'Job title', hint: 'Your role at the second employer', type: 'text', placeholder: 'e.g. Analyst' },
      { id: 'startDate2', label: 'Start date', hint: 'Exact start date', type: 'date', placeholder: '' },
      { id: 'endDate2', label: 'End date', hint: 'Exact end date', type: 'date', placeholder: '' },
    ],
    privacyNote: 'Your data stays in your browser and is only used to cross-reference with CNAV records.',
  },
};

// ─── Manual entry panel component ───────────────────────────────────
function ManualEntryPanel({ docName, onClose }: { docName: string; onClose: () => void }) {
  const form = manualForms[docName];
  if (!form) return null;

  return (
    <div className="mt-2 rounded-xl overflow-hidden animate-fade-in"
      style={{ background: 'var(--navy-4)', border: '1px solid var(--border)' }}>

      {/* Header */}
      <div className="p-4 pb-3 flex items-start justify-between gap-3"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <div className="text-[13px] font-semibold mb-1" style={{ color: 'var(--text)' }}>
            {form.title}
          </div>
          <div className="text-[11.5px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {form.description}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[13px] shrink-0 w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors"
          style={{ background: 'var(--navy-3)', border: '1px solid var(--border)', color: 'var(--text-dim)', fontFamily: 'var(--font-sans)' }}
        >
          ×
        </button>
      </div>

      {/* Fields */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {form.fields.map((field) => (
            <div key={field.id} className={field.type === 'text' && field.id.includes('employer') ? '' : ''}>
              <label className="text-[11.5px] font-medium block mb-1" style={{ color: 'var(--text-muted)' }}>
                {field.label}
                {field.unit && <span className="ml-1 font-normal" style={{ color: 'var(--text-dim)' }}>({field.unit})</span>}
              </label>
              <input
                type={field.type === 'number' ? 'text' : field.type}
                inputMode={field.type === 'number' ? 'decimal' : undefined}
                placeholder={field.placeholder}
                className="w-full rounded-lg px-3 py-2 text-[12.5px] outline-none transition-all"
                style={{
                  background: 'var(--navy-3)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontFamily: field.type === 'number' ? 'var(--font-mono)' : 'var(--font-sans)',
                }}
              />
              <div className="text-[10px] mt-0.5 leading-snug" style={{ color: 'var(--text-dim)' }}>
                {field.hint}
              </div>
            </div>
          ))}
        </div>

        {/* Privacy note */}
        <div className="flex items-start gap-2 mt-4 p-2.5 px-3 rounded-lg"
          style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
          <span className="text-[11px] shrink-0 mt-px">🔒</span>
          <div className="text-[10.5px] leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            {form.privacyNote}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 mt-4">
          <Button variant="primary" className="text-[11.5px] px-4 py-2">
            Save & recalculate
          </Button>
          <Button variant="ghost" className="text-[11.5px] px-3 py-2" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Types ──────────────────────────────────────────────────────────
interface StepDoc {
  icon: string;
  name: string;
  desc: string;
  unlocks: string;
  unlockColor: string;
  highlighted?: boolean;
  flag?: string;
}

interface Step {
  num: number;
  title: string;
  color: string;
  dimColor: string;
  borderColor: string;
  priority?: string;
  description: string;
  docs: StepDoc[];
}

const steps: Step[] = [
  {
    num: 1,
    title: 'Verify your pension gaps',
    color: 'var(--red)',
    dimColor: 'var(--red-dim)',
    borderColor: 'rgba(239,68,68,0.3)',
    priority: 'High priority',
    description: 'We detected a 3-month gap between your Swiss and Luxembourg periods. An employment certificate from your Swiss employer proves your exact dates — the first step to recovering up to €120/mo.',
    docs: [
      {
        icon: '🏢', name: 'Employment Certificate — Swiss employer (Sep 2014 – Dec 2019)', highlighted: true,
        desc: 'Official letter from your Swiss employer confirming start date, end date, and job title. Needed by CNAP to verify the Jan–Mar 2020 gap.',
        unlocks: 'gap correction · +€120/mo', unlockColor: 'var(--red)', flag: '🇨🇭 → 🇱🇺 transition',
      },
      {
        icon: '🏢', name: 'Employment Certificates — French employers',
        desc: 'Certificates from your French employers (Sep 2003–May 2008 and Jun 2008–Jul 2013). Useful for cross-referencing CNAV records.',
        unlocks: 'verified French contribution years', unlockColor: 'var(--amber)', flag: '🇫🇷 Pillar 1',
      },
    ],
  },
  {
    num: 2,
    title: 'Confirm your state pension entitlements',
    color: 'var(--amber)',
    dimColor: 'var(--amber-dim)',
    borderColor: 'rgba(217,119,6,0.3)',
    description: 'Official career extracts from each country confirm contribution years, insured salary, and projected pension — replacing estimates with verified figures.',
    docs: [
      { icon: '🇱🇺', name: 'Extrait de Carrière', desc: 'Issued by CNAP. Confirms all Luxembourg P1 insurance years. Available from guichet.lu.', unlocks: 'verified LU pension · +18% accuracy', unlockColor: 'var(--amber)' },
      { icon: '🇨🇭', name: 'AHV/AVS Individual Account Extract', desc: 'Issued by SVA. Shows complete Swiss P1 contribution record. Available via ahv-iv.ch.', unlocks: 'verified CH Pillar 1 · +10% accuracy', unlockColor: 'var(--amber)' },
      { icon: '🇫🇷', name: 'Relevé de Carrière', desc: 'Issued by CNAV/CARSAT. Shows trimestres validated and projected pension. Download from lassuranceretraite.fr.', unlocks: 'verified FR pension · +12% accuracy', unlockColor: 'var(--amber)' },
    ],
  },
  {
    num: 3,
    title: 'Unlock your Pillar 2 projections',
    color: 'var(--blue)',
    dimColor: 'var(--blue-dim)',
    borderColor: 'rgba(37,99,235,0.3)',
    description: 'Your Swiss occupational pension (BVG/LPP) is not yet included in your projection. This is often the largest single component — uploading your statement could significantly change your picture.',
    docs: [
      { icon: '🇨🇭', name: 'Vorsorgeausweis (BVG/LPP Statement)', desc: 'Shows vested benefits, projected annuity, insured salary, and buy-in options. If you left your Swiss employer, this may be in a Freizügigkeitskonto.', unlocks: 'Unlock Pillar 2 · could add €1,000+/mo', unlockColor: 'var(--blue)' },
    ],
  },
];

// ─── Difficulty badge ───────────────────────────────────────────────
function DifficultyBadge({ level }: { level: 'easy' | 'moderate' | 'hard' }) {
  const config = {
    easy: { label: 'Easy', color: 'var(--green)', bg: 'var(--green-dim)' },
    moderate: { label: 'Moderate', color: 'var(--amber)', bg: 'var(--amber-dim)' },
    hard: { label: 'May need help', color: 'var(--red)', bg: 'var(--red-dim)' },
  }[level];

  return (
    <span className="text-[10px] font-medium px-2 py-[2px] rounded-full"
      style={{ background: config.bg, color: config.color }}>
      {config.label}
    </span>
  );
}

// ─── Guide panel component ──────────────────────────────────────────
function GuidePanel({ docName, onClose }: { docName: string; onClose: () => void }) {
  const guide = guideData[docName];
  if (!guide) return null;

  return (
    <div className="mt-2 rounded-xl overflow-hidden animate-fade-in"
      style={{ background: 'var(--navy-4)', border: '1px solid var(--border)' }}>

      {/* Header */}
      <div className="p-4 pb-3 flex items-start justify-between gap-3"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <div>
          <div className="text-[13px] font-semibold mb-1" style={{ color: 'var(--text)' }}>
            {guide.title}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--text-dim)' }}>Timeline:</span> {guide.timeEstimate}
            </span>
            <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--text-dim)' }}>Language:</span> {guide.language}
            </span>
            <DifficultyBadge level={guide.difficulty} />
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[13px] shrink-0 w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors"
          style={{ background: 'var(--navy-3)', border: '1px solid var(--border)', color: 'var(--text-dim)', fontFamily: 'var(--font-sans)' }}
        >
          ×
        </button>
      </div>

      {/* Steps */}
      <div className="p-4 pb-2">
        <div className="text-[11px] uppercase tracking-wider font-medium mb-3" style={{ color: 'var(--text-dim)' }}>
          Step by step
        </div>
        <div className="relative pl-5">
          <div className="absolute left-[7px] top-1 bottom-3 w-px" style={{ background: 'var(--border)' }} />
          {guide.steps.map((step) => (
            <div key={step.num} className="relative pl-4 pb-4">
              <div className="absolute left-0 top-[3px] w-[15px] h-[15px] rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: 'var(--navy-3)', border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
                {step.num}
              </div>
              <div className="text-[12.5px] font-medium mb-0.5" style={{ color: 'var(--text)' }}>
                {step.text}
              </div>
              {step.detail && (
                <div className="text-[11.5px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {step.detail}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Alt path — can't log in? */}
      {guide.altPath && (
        <div className="px-4 pb-3">
          <div className="rounded-lg p-3 pb-2.5" style={{ background: 'var(--amber-dim)', border: '1px solid rgba(217,119,6,0.2)' }}>
            <div className="text-[11px] font-semibold mb-2 flex items-center gap-1.5" style={{ color: 'var(--amber)' }}>
              <span>&#9888;</span> {guide.altPath.title}
            </div>
            <ul className="list-none m-0 p-0 flex flex-col gap-2">
              {guide.altPath.options.map((option, i) => (
                <li key={i} className="text-[11.5px] leading-relaxed flex gap-2" style={{ color: 'var(--text-muted)' }}>
                  <span className="shrink-0 mt-px font-bold" style={{ color: 'var(--amber)' }}>{i + 1}.</span>
                  {option}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="px-4 pb-3">
        <div className="rounded-lg p-3" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
          <div className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--gold)' }}>
            Tips
          </div>
          <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
            {guide.tips.map((tip, i) => (
              <li key={i} className="text-[11.5px] leading-relaxed flex gap-2" style={{ color: 'var(--text-muted)' }}>
                <span className="shrink-0 mt-px" style={{ color: 'var(--gold)' }}>&#8227;</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Concierge CTA */}
      <div className="p-4 pt-2 flex items-center gap-3 flex-wrap"
        style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex-1 min-w-[200px]">
          <div className="text-[12px] font-semibold mb-[2px] flex items-center gap-1.5" style={{ color: 'var(--gold-light)' }}>
            <span>&#9733;</span> Let us handle it
          </div>
          <div className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {guide.conciergeNote}
          </div>
        </div>
        <Button variant="primary" className="text-[11.5px] px-4 py-2 shrink-0">
          Request via Concierge
        </Button>
      </div>
    </div>
  );
}

// ─── Completed state documents ──────────────────────────────────────
const completedDocs = [
  { icon: '📋', name: 'Relevé de Carrière', source: 'CNAV', country: '🇫🇷', date: 'Mar 2026', impact: 'Verified 10.9 yrs · 41 trimestres' },
  { icon: '📊', name: 'Vorsorgeausweis', source: 'Freizügigkeitsstiftung', country: '🇨🇭', date: 'Mar 2026', impact: 'Unlocked P2 · €210K capital · +€1,040/mo' },
  { icon: '📋', name: 'Extrait de Carrière', source: 'CNAP', country: '🇱🇺', date: 'Mar 2026', impact: 'Verified 6.0 yrs · confirmed CNAP pension' },
  { icon: '🏛️', name: 'AHV/AVS Extract', source: 'SVA Zürich', country: '🇨🇭', date: 'Mar 2026', impact: 'Verified 5.3 yrs · scale 22 confirmed' },
  { icon: '🏢', name: 'Employment Certificate', source: 'Former Swiss employer', country: '🇨🇭', date: 'Mar 2026', impact: 'Gap verified · CNAP correction initiated' },
];

// ─── Main component ─────────────────────────────────────────────────
export function PensionPicture() {
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [expandedManual, setExpandedManual] = useState<string | null>(null);
  const { stage } = useDataStage();
  const complete = stage === 'after';

  const toggleGuide = (docName: string) => {
    setExpandedManual(null);
    setExpandedGuide((prev) => (prev === docName ? null : docName));
  };

  const toggleManual = (docName: string) => {
    setExpandedGuide(null);
    setExpandedManual((prev) => (prev === docName ? null : docName));
  };

  if (complete) {
    return (
      <Card className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>Pension picture complete</div>
            <div className="text-xs" style={{ color: 'var(--text-dim)' }}>All key documents uploaded and verified</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-[100px] rounded overflow-hidden" style={{ background: 'var(--navy-3)' }}>
              <div className="h-full rounded" style={{ width: '100%', background: 'linear-gradient(90deg,var(--green),#2ba87a)' }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--green)' }}>3 of 3</span>
          </div>
        </div>

        <div className="text-xs leading-relaxed mb-[18px]" style={{ color: 'var(--text-muted)' }}>
          Your projection is now based on verified data from official sources. Accuracy improved from ±30% to ±3%.
        </div>

        {/* Accuracy improvement banner */}
        <div className="rounded-xl p-4 mb-[18px] flex items-center gap-4"
          style={{ background: 'var(--green-dim)', border: '1px solid rgba(62,207,142,0.25)' }}>
          <div className="text-2xl">✓</div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold mb-0.5" style={{ color: 'var(--green)' }}>
              Projection accuracy: ±3%
            </div>
            <div className="text-[11.5px]" style={{ color: 'var(--text-muted)' }}>
              Improved from ±30% after uploading 5 documents across 3 countries
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>Income change</div>
            <div className="text-[15px] font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--green)' }}>
              +€1,320/mo
            </div>
          </div>
        </div>

        {/* Uploaded documents list */}
        <div className="flex flex-col gap-2">
          {completedDocs.map((doc) => (
            <div key={doc.name} className="flex items-center gap-3 p-3 px-4 rounded-xl"
              style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-base shrink-0"
                style={{ background: 'var(--green-dim)' }}>
                {doc.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12.5px] font-medium truncate" style={{ color: 'var(--text)' }}>{doc.name}</span>
                  <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{doc.country}</span>
                </div>
                <div className="text-[11px]" style={{ color: 'var(--green)' }}>{doc.impact}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{doc.source}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{doc.date}</div>
              </div>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0"
                style={{ background: 'var(--green)', color: 'var(--navy)' }}>
                ✓
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>Complete your pension picture</div>
          <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Upload documents to verify your career, close gaps, and sharpen your projection</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-[100px] rounded overflow-hidden" style={{ background: 'var(--navy-3)' }}>
            <div className="h-full rounded" style={{ width: '33%', background: 'linear-gradient(90deg,var(--amber),var(--gold))' }} />
          </div>
          <span className="text-xs font-semibold" style={{ color: 'var(--amber)' }}>1 of 3</span>
        </div>
      </div>

      <div className="text-xs leading-relaxed mb-[22px]" style={{ color: 'var(--text-muted)' }}>
        We built your pension picture from your career data, but official documents make it precise. Each document below is matched to your profile — upload what you have, and we&apos;ll tell you exactly what it unlocks.
      </div>

      {/* Steps */}
      {steps.map((step) => (
        <div key={step.num} className="mb-6">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
              style={{ background: step.dimColor, border: `1.5px solid ${step.borderColor}`, color: step.color }}>
              {step.num}
            </div>
            <div className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>{step.title}</div>
            {step.priority && (
              <span className="text-[9px] font-medium px-2 py-[2px] rounded-[20px]"
                style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.25)' }}>
                {step.priority}
              </span>
            )}
          </div>
          <div className="text-xs leading-relaxed ml-[34px] mb-3" style={{ color: 'var(--text-muted)' }}>
            {step.description}
          </div>

          <div className="flex flex-col gap-2 ml-[34px]">
            {step.docs.map((doc) => (
              <div key={doc.name}>
                <div className="flex items-center gap-3 p-3.5 px-4 rounded-xl"
                  style={{
                    background: doc.highlighted ? 'var(--red-dim)' : 'var(--navy-3)',
                    border: doc.highlighted ? '1px solid rgba(239,68,68,0.25)' : '1px solid var(--border)',
                    borderRadius: (expandedGuide === doc.name || expandedManual === doc.name) ? '12px 12px 0 0' : undefined,
                  }}>
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg shrink-0"
                    style={{ background: doc.highlighted ? 'var(--navy-3)' : 'var(--navy-4)' }}>
                    {doc.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold mb-0.5" style={{ color: 'var(--text)' }}>{doc.name}</div>
                    <div className="text-[11.5px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{doc.desc}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[11px] font-medium" style={{ color: doc.unlockColor }}>Unlocks: {doc.unlocks}</span>
                      {doc.flag && <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>{doc.flag}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <Button variant={doc.highlighted ? 'primary' : 'outline-gold'} className="text-[11.5px] px-3.5 py-1.5">Upload</Button>
                    <Button
                      variant="ghost"
                      className="text-[11px] px-2.5 py-1"
                      onClick={() => toggleManual(doc.name)}
                      style={expandedManual === doc.name ? { color: 'var(--gold-light)', border: '1px solid var(--gold-border)' } : undefined}
                    >
                      {expandedManual === doc.name ? 'Hide form' : 'Enter manually'}
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-[11px] px-2.5 py-1"
                      onClick={() => toggleGuide(doc.name)}
                      style={expandedGuide === doc.name ? { color: 'var(--gold-light)', border: '1px solid var(--gold-border)' } : undefined}
                    >
                      {expandedGuide === doc.name ? 'Hide guide' : 'How to get it'}
                    </Button>
                  </div>
                </div>

                {/* Expanded manual entry panel */}
                {expandedManual === doc.name && (
                  <ManualEntryPanel docName={doc.name} onClose={() => setExpandedManual(null)} />
                )}

                {/* Expanded guide panel */}
                {expandedGuide === doc.name && (
                  <GuidePanel docName={doc.name} onClose={() => setExpandedGuide(null)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Don't see your doc */}
      <div className="rounded-xl p-4 px-[18px] mb-5" style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
        <div className="text-[13px] font-semibold mb-2" style={{ color: 'var(--text)' }}>Don&apos;t see your document listed?</div>
        <div className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
          You can upload any pension-related document and our system will extract the relevant data automatically.
        </div>
        <div className="flex flex-wrap gap-2">
          {['Payslips', 'Tax returns', 'Social security statements', 'Pension fund letters', 'Employment contracts', 'Termination letters'].map((t) => (
            <span key={t} className="text-[11px] px-2.5 py-[5px] rounded-md" style={{ background: 'var(--navy-4)', color: 'var(--text-muted)' }}>{t}</span>
          ))}
        </div>
        <Button variant="outline-gold" className="mt-3 text-xs px-4 py-2">Upload any document</Button>
      </div>

      {/* Concierge CTA */}
      <div className="flex items-center gap-4 flex-wrap pt-[18px]" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex-1 min-w-[200px]">
          <div className="text-[13px] font-semibold mb-[3px]" style={{ color: 'var(--text)' }}>Need personal assistance?</div>
          <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Our pension specialists can handle anything on your behalf — from collecting documents to resolving complex multi-country pension questions.
          </div>
        </div>
        <Button variant="primary" className="whitespace-nowrap shrink-0">Get in Touch →</Button>
      </div>
    </Card>
  );
}
