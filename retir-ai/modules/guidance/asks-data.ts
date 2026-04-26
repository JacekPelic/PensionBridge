import type { DataAsk } from './types';

/**
 * Catalogue of all possible asks. `deriveAsks` (engine.ts) decides which to
 * surface given a picture. Content ported from the sidelined PensionPicture
 * docs component.
 */

export const ASK_CH_AHV: DataAsk = {
  id: 'ch-ahv',
  title: 'Your Swiss AHV/AVS career extract',
  whyNow: 'Replaces our estimate of your Swiss state pension with the verified figures SVA holds on file.',
  pillar: 'p1',
  country: 'CH',
  priority: 'high',
  impact: 'tightens CH band by \u00B1\u20AC400/mo',
  icon: '\u{1F1E8}\u{1F1ED}',
  uploadable: true,
  uploadHint: 'PDF of your Individuelles Konto / Compte individuel',
  guide: {
    title: 'How to get your Swiss AVS/AHV Extract',
    timeEstimate: '1\u20132 weeks',
    difficulty: 'easy',
    language: 'German / French',
    steps: [
      {
        num: 1,
        text: 'Visit ahv-iv.ch',
        detail:
          'Go to ahv-iv.ch (German) or avs-ai.ch (French). Click "Individual account" \u2192 "Order an extract".',
      },
      {
        num: 2,
        text: 'Fill in the request form',
        detail:
          'Provide your AHV/AVS number (756.XXXX.XXXX.XX \u2014 found on your Swiss health insurance card or any old payslip). If you don\u2019t have it, provide your full name and date of birth.',
      },
      {
        num: 3,
        text: 'Receive by post',
        detail:
          'The extract arrives in 7\u201310 business days to your registered address. It shows every year of contributions, insured income, and any gaps.',
      },
      {
        num: 4,
        text: 'Upload to Prevista',
        detail:
          'Upload the PDF. We\u2019ll replace your estimated Swiss state pension with verified figures and recalculate your scale number.',
      },
    ],
    tips: [
      'Your AHV number is on your Swiss health insurance card (Versichertenkarte) \u2014 check if you still have it',
      'You can also request the extract at any Swiss embassy or consulate if you\u2019re abroad',
      'The extract is free of charge and available to anyone who has ever contributed to the Swiss system',
    ],
  },
  manualForm: {
    title: 'Enter your Swiss AVS/AHV data manually',
    description: 'These values are on your Individuelles Konto / Compte individuel extract from SVA.',
    fields: [
      {
        id: 'contributionYears',
        label: 'Contribution years',
        hint: 'Count the number of years listed \u2014 each row is one year',
        type: 'number',
        placeholder: 'e.g. 5.3',
      },
      {
        id: 'avgIncome',
        label: 'Average annual insured income',
        hint: 'Add up all "Einkommen" values and divide by the number of years',
        type: 'number',
        placeholder: 'e.g. 125000',
        unit: 'CHF/yr',
      },
      {
        id: 'ahvNumber',
        label: 'AHV/AVS number',
        hint: 'Format: 756.XXXX.XXXX.XX \u2014 found at the top of the extract',
        type: 'text',
        placeholder: '756.____.____.__',
      },
    ],
  },
};

export const ASK_CH_BVG: DataAsk = {
  id: 'ch-bvg',
  title: 'Your Swiss workplace pension (Vorsorgeausweis / BVG)',
  whyNow:
    'Workplace pensions are often the largest single piece of your retirement income \u2014 many expats forget theirs when they leave Switzerland.',
  pillar: 'p2',
  country: 'CH',
  priority: 'high',
  impact: 'unlocks pillar 2 \u2014 could add \u20AC1,000+/mo',
  icon: '\u{1F3E6}',
  uploadable: true,
  uploadHint: 'PDF of Vorsorgeausweis or Freizügigkeitsausweis',
  guide: {
    title: 'How to find your Swiss workplace pension statement',
    timeEstimate: '1\u20134 weeks (depends on situation)',
    difficulty: 'hard',
    language: 'German',
    steps: [
      {
        num: 1,
        text: 'Check if you already have it',
        detail:
          'Look for your last "Vorsorgeausweis" or "Pensionskassenausweis" from your Swiss employer. You received one annually while employed. It shows vested benefits (Freizügigkeitsleistung), projected pension, and insured salary.',
      },
      {
        num: 2,
        text: 'If you don\u2019t have it \u2014 locate your vested benefits',
        detail:
          'When you left your Swiss employer, your BVG capital was transferred to a Freizügigkeitskonto (vested benefits account). If you chose a provider, contact them. If you didn\u2019t choose, the capital may have been sent to the Stiftung Auffangeinrichtung BVG.',
      },
      {
        num: 3,
        text: 'Search the central register',
        detail:
          'Visit zentralstelle.ch (Zentralstelle 2. Säule) and search for forgotten assets using your AHV number. This free service checks all pension funds and vested benefit accounts in Switzerland.',
      },
      {
        num: 4,
        text: 'Request a current statement',
        detail:
          'Once located, contact the institution holding your capital and request a current "Freizügigkeitsausweis". This shows your balance, investment strategy, and annuity conversion rate.',
      },
      {
        num: 5,
        text: 'Upload to Prevista',
        detail:
          'Upload the statement. We\u2019ll add your workplace pension capital to your projection \u2014 this could significantly change your retirement picture.',
      },
    ],
    altPath: {
      title: 'Don\u2019t have your AHV number or can\u2019t access zentralstelle.ch?',
      options: [
        'AHV number lost \u2014 check old Swiss payslips, your Versichertenkarte, or any correspondence from SVA/AVS. Format: 756.XXXX.XXXX.XX',
        'Never received a Versichertenkarte \u2014 contact the SVA office of the canton where you worked. They can look you up by name and date of birth',
        'zentralstelle.ch search returned nothing \u2014 call Auffangeinrichtung BVG at +41 41 799 75 75 with your personal details',
        'Can\u2019t navigate German-language sites \u2014 the entire process can be done by phone or letter to Zentralstelle 2. Säule, Sicherheitsfonds BVG, Eigerplatz 2, 3007 Bern',
      ],
    },
    tips: [
      'Stiftung Auffangeinrichtung BVG (aeis.ch) is the default destination for unclaimed vested benefits',
      'zentralstelle.ch is the official free search service \u2014 avoid paid "pension finder" services',
      'Your workplace pension capital has been earning interest since you left \u2014 current value may be higher than your last statement',
    ],
  },
  manualForm: {
    title: 'Enter your Swiss workplace pension data manually',
    description:
      'These values are on your Vorsorgeausweis (pension fund statement) or Freizügigkeitsausweis (vested benefits statement).',
    fields: [
      {
        id: 'vestedBenefits',
        label: 'Vested benefits / capital balance',
        hint: 'Labeled "Freizügigkeitsleistung" or "Austrittsleistung" \u2014 the total capital in your account',
        type: 'number',
        placeholder: 'e.g. 210000',
        unit: 'CHF',
      },
      {
        id: 'projectedAnnuity',
        label: 'Projected annual pension',
        hint: 'Labeled "Voraussichtliche Altersrente" \u2014 annual pension at standard retirement age',
        type: 'number',
        placeholder: 'e.g. 12480',
        unit: 'CHF/yr',
      },
      {
        id: 'conversionRate',
        label: 'Conversion rate',
        hint: 'Labeled "Umwandlungssatz" \u2014 typically between 5% and 6.8%',
        type: 'number',
        placeholder: 'e.g. 6.0',
        unit: '%',
      },
      {
        id: 'insuredSalary',
        label: 'Insured salary',
        hint: 'Labeled "Versicherter Lohn" \u2014 the salary base for contributions',
        type: 'number',
        placeholder: 'e.g. 85000',
        unit: 'CHF/yr',
      },
    ],
  },
};

export const ASK_FR_RELEVE: DataAsk = {
  id: 'fr-releve',
  title: 'Your French Relevé de Carrière',
  whyNow: 'Confirms your exact trimestres and SAM (best 25 years) \u2014 France\u2019s calculation swings by hundreds of euros based on these.',
  pillar: 'p1',
  country: 'FR',
  priority: 'high',
  impact: 'tightens FR band by \u00B1\u20AC200/mo',
  icon: '\u{1F1EB}\u{1F1F7}',
  uploadable: true,
  uploadHint: 'PDF from lassuranceretraite.fr',
  guide: {
    title: 'How to get your French Career Statement',
    timeEstimate: 'Instant \u2013 5 min',
    difficulty: 'easy',
    language: 'French',
    steps: [
      {
        num: 1,
        text: 'Log in to lassuranceretraite.fr',
        detail:
          'Go to lassuranceretraite.fr and sign in with FranceConnect (your impots.gouv.fr or Ameli login).',
      },
      {
        num: 2,
        text: 'Navigate to your career overview',
        detail:
          'Click "Mon relevé de carrière" in your personal space. This shows all validated trimestres, annual salaries, and any gaps.',
      },
      {
        num: 3,
        text: 'Download the PDF',
        detail: 'Click "Télécharger" to download your full career statement. This is the official CNAV document.',
      },
      {
        num: 4,
        text: 'Upload to Prevista',
        detail:
          'Upload the PDF. We\u2019ll extract your trimestres, SAM (best 25 years), and calculate your verified CNAV pension with décote/surcote applied.',
      },
    ],
    altPath: {
      title: 'Can\u2019t log in to FranceConnect?',
      options: [
        'Forgot your impots.gouv.fr password \u2014 reset it at impots.gouv.fr. You\u2019ll need your numéro fiscal (on any old tax notice)',
        'No FranceConnect account \u2014 create one via impots.gouv.fr using your numéro fiscal + revenu fiscal de référence. Takes about 5 minutes',
        'No longer a French tax resident \u2014 you can still access FranceConnect with old credentials, or call CNAV at +33 9 71 10 39 60 to request by post',
        'Lost your numéro fiscal \u2014 visit any Centre des Finances Publiques in person, or call +33 809 401 401',
      ],
    },
    tips: [
      'This is the fastest document to get \u2014 available instantly online if you have FranceConnect',
      'The "Estimation Indicative Globale" (EIG) gives even more detail \u2014 download that too if available',
      'Your numéro fiscal is the 13-digit number on top-left of any avis d\u2019imposition',
    ],
  },
  manualForm: {
    title: 'Enter your French career data manually',
    description:
      'You can find these values on your Relevé de Carrière from CNAV, or on your annual pension statement.',
    fields: [
      {
        id: 'trimestres',
        label: 'Trimestres validated',
        hint: 'Labeled "Trimestres validés (tous régimes)" \u2014 total across all schemes',
        type: 'number',
        placeholder: 'e.g. 41',
      },
      {
        id: 'sam',
        label: 'Average annual salary (SAM)',
        hint: 'Labeled "Salaire annuel moyen" \u2014 average of your best 25 years',
        type: 'number',
        placeholder: 'e.g. 38500',
        unit: '\u20AC/yr',
      },
      {
        id: 'projectedMonthly',
        label: 'Projected monthly pension',
        hint: 'Labeled "Montant estimé" \u2014 the monthly amount at your target retirement age',
        type: 'number',
        placeholder: 'e.g. 1220',
        unit: '\u20AC/mo',
      },
      {
        id: 'frYears',
        label: 'Total French contribution years',
        hint: 'Count of years with at least 1 validated trimestre',
        type: 'number',
        placeholder: 'e.g. 10.9',
      },
    ],
  },
};

export const ASK_LU_EXTRAIT: DataAsk = {
  id: 'lu-extrait',
  title: 'Your Luxembourg Extrait de Carrière',
  whyNow: 'Verifies your exact LU insurance years and salary coefficients \u2014 CNAP\u2019s calculation depends on both.',
  pillar: 'p1',
  country: 'LU',
  priority: 'medium',
  impact: 'tightens LU band by \u00B1\u20AC150/mo',
  icon: '\u{1F1F1}\u{1F1FA}',
  uploadable: true,
  uploadHint: 'PDF from guichet.lu',
  guide: {
    title: 'How to get your Luxembourg Career Extract',
    timeEstimate: '2\u20133 weeks',
    difficulty: 'easy',
    language: 'French / German',
    steps: [
      {
        num: 1,
        text: 'Go to guichet.lu',
        detail:
          'Visit guichet.public.lu and log in with your LuxTrust certificate or eIDAS-compatible ID. Navigate to "Social security" \u2192 "Pension" \u2192 "Career extract".',
      },
      {
        num: 2,
        text: 'Request your extract online',
        detail:
          'Fill in the online form. CNAP generates your "Extrait de carrière" showing all Luxembourg insurance periods and salary data.',
      },
      {
        num: 3,
        text: 'Wait for delivery',
        detail: 'Available within 10\u201315 business days \u2014 by post to your registered address, or digitally if you opted in.',
      },
      {
        num: 4,
        text: 'Upload to Prevista',
        detail:
          'Upload the PDF. We\u2019ll extract your exact insurance years, salary coefficients, and calculate your verified CNAP pension.',
      },
    ],
    altPath: {
      title: 'Can\u2019t access guichet.lu?',
      options: [
        'LuxTrust token expired or lost \u2014 order a replacement at luxtrust.lu (5 business days) or visit a registration authority in person',
        'No LuxTrust at all \u2014 request by post: send a signed letter with ID copy to CNAP, 1 boulevard Prince Henri, L-1724 Luxembourg. Include your matricule',
        'Living abroad \u2014 call CNAP at +352 22 41 41-1 and request by phone. They\u2019ll post it to your current address',
      ],
    },
    tips: [
      'Your matricule is on any old payslip or the "Carte d\u2019identification de sécurité sociale"',
      'The extract covers all periods where Luxembourg social security contributions were paid',
      'Also request an "E205 LU" form if you need EU totalization data',
    ],
  },
  manualForm: {
    title: 'Enter your Luxembourg career data manually',
    description: 'These values are on your Extrait de Carrière from CNAP.',
    fields: [
      {
        id: 'insuranceYears',
        label: 'Luxembourg insurance years',
        hint: 'Labeled "Périodes d\u2019assurance" \u2014 total months \u00F7 12',
        type: 'number',
        placeholder: 'e.g. 6.0',
      },
      {
        id: 'coefficientSum',
        label: 'Total coefficient sum',
        hint: 'Labeled "Somme des coefficients" \u2014 sum of annual salary \u00F7 reference salary per year',
        type: 'number',
        placeholder: 'e.g. 7.2',
      },
      {
        id: 'projectedMonthly',
        label: 'Projected monthly pension',
        hint: 'Labeled "Pension mensuelle estimée" \u2014 if shown on your extract',
        type: 'number',
        placeholder: 'e.g. 980',
        unit: '\u20AC/mo',
      },
    ],
  },
};

export const ASK_FR_AGIRC_ARRCO: DataAsk = {
  id: 'fr-agirc-arrco',
  title: 'Your French Agirc-Arrco complementary pension',
  whyNow: 'Nearly every French private-sector worker has this complementary scheme on top of CNAV \u2014 typically \u20AC300\u2013600/mo that most estimates ignore.',
  pillar: 'p2',
  country: 'FR',
  priority: 'medium',
  impact: 'unlocks FR pillar 2 \u2014 typically +\u20AC300\u2013600/mo',
  icon: '\u{1F4D1}',
  uploadable: true,
  uploadHint: 'PDF from agirc-arrco.fr or your espace personnel',
  guide: {
    title: 'How to find your Agirc-Arrco statement',
    timeEstimate: 'Instant \u2013 5 min',
    difficulty: 'easy',
    language: 'French',
    steps: [
      {
        num: 1,
        text: 'Log in to agirc-arrco.fr',
        detail:
          'Go to agirc-arrco.fr \u2192 "Mon espace personnel". You can sign in via FranceConnect using the same credentials as lassuranceretraite.fr.',
      },
      {
        num: 2,
        text: 'Open your account summary',
        detail:
          'Your personal space shows total points accumulated across all French private-sector employments, and a projected annual pension at retirement.',
      },
      {
        num: 3,
        text: 'Download the "relevé de points"',
        detail:
          'Click the PDF export to get the official statement showing every year of contributions and points earned.',
      },
      {
        num: 4,
        text: 'Upload to Prevista',
        detail:
          'Upload the PDF. We\u2019ll add your complementary pension to your French retirement picture.',
      },
    ],
    tips: [
      'If you\u2019ve worked for multiple French employers, all of them feed into the same Agirc-Arrco account \u2014 one statement covers everything',
      'The points system means early career years keep earning you retirement income decades later',
      'Value per point is revalued annually \u2014 your projected pension adjusts over time',
    ],
  },
  manualForm: {
    title: 'Enter your Agirc-Arrco data manually',
    description: 'These values are on your Agirc-Arrco relevé de points or annual statement.',
    fields: [
      {
        id: 'points',
        label: 'Total points accumulated',
        hint: 'Sum across all French private-sector employments \u2014 labeled "Total des points"',
        type: 'number',
        placeholder: 'e.g. 4820',
      },
      {
        id: 'projectedAnnual',
        label: 'Projected annual pension',
        hint: 'Labeled "Pension annuelle estimée" at your target retirement age',
        type: 'number',
        placeholder: 'e.g. 5400',
        unit: '\u20AC/yr',
      },
    ],
  },
};

// ─── LU Pillar 2 ────────────────────────────────────────────────────

export const ASK_LU_RCP: DataAsk = {
  id: 'lu-rcp',
  title: 'Your Luxembourg employer pension (RCP)',
  whyNow:
    'Many larger LU employers (banks, EU institutions, Big Four, industry) fund a complementary pension under the LPFP 1999 regime. Not universal — but when present, often the second-largest slice of retirement.',
  pillar: 'p2',
  country: 'LU',
  priority: 'high',
  impact: 'unlocks LU pillar 2 \u2014 can add \u20AC500\u20132,500/mo',
  icon: '\u{1F3DB}',
  uploadable: true,
  uploadHint: 'Annual RCP statement from your employer or pension provider',
  guide: {
    title: 'How to find your Luxembourg employer pension (RCP)',
    timeEstimate: '1\u20133 weeks',
    difficulty: 'moderate',
    language: 'French / English',
    steps: [
      {
        num: 1,
        text: 'Check your payroll & HR portal',
        detail:
          'RCP contributions appear on your annual salary statement under "pension compl\u00e9mentaire employeur" or similar. Your HR platform may also host the plan summary.',
      },
      {
        num: 2,
        text: 'Ask HR for your current statement',
        detail:
          'Every LU employer plan is administered by an insurer or pension fund (commonly AXA, Foyer, Swiss Life, Vitis Life, or Generali). HR can direct you to the provider and confirm plan rules.',
      },
      {
        num: 3,
        text: 'If you\u2019ve left the employer',
        detail:
          'Your vested rights remain with the provider. Contact them with your matricule (13-digit LU social security number) and ask for a "reconstitution des droits acquis".',
      },
      {
        num: 4,
        text: 'Upload to Prevista',
        detail:
          'We\u2019ll add your RCP capital or projected annuity to your Luxembourg pillar 2 \u2014 this typically changes the picture meaningfully.',
      },
    ],
    tips: [
      'Most LU plans pay out as a lump sum at retirement (tax-privileged); some offer an annuity option',
      'If you\u2019ve worked at multiple LU employers, you may have several small RCP plans \u2014 each provider will issue a separate statement',
      'Employer contribution rates typically range 4\u201312% of salary; employee top-ups are optional and capped at 1,200 \u20ac/yr deductible',
    ],
  },
  manualForm: {
    title: 'Enter your RCP data manually',
    description:
      'Values from your annual RCP statement ("rel\u00e9v\u00e9 du plan de pension compl\u00e9mentaire").',
    fields: [
      {
        id: 'vestedCapital',
        label: 'Current vested capital',
        hint: 'Labeled "provisions constitu\u00e9es" or "droits acquis"',
        type: 'number',
        placeholder: 'e.g. 65000',
        unit: '\u20AC',
      },
      {
        id: 'projectedLumpSum',
        label: 'Projected lump sum at retirement',
        hint: 'Labeled "capital constitutif estim\u00e9" or "prestation \u00e0 terme"',
        type: 'number',
        placeholder: 'e.g. 180000',
        unit: '\u20AC',
      },
      {
        id: 'employerRate',
        label: 'Employer contribution rate',
        hint: 'Annual employer contribution as % of salary',
        type: 'number',
        placeholder: 'e.g. 8',
        unit: '%/yr',
      },
      {
        id: 'provider',
        label: 'Plan provider',
        hint: 'Insurer or pension fund administering the plan',
        type: 'text',
        placeholder: 'e.g. Foyer, AXA, Swiss Life',
      },
    ],
  },
};

// ─── CH Pillar 2 \u2014 vested benefits (forgotten capital) ────────────────

export const ASK_CH_FREIZUGIGKEIT: DataAsk = {
  id: 'ch-freizugigkeit',
  title: 'Your Swiss vested benefits (Freiz\u00fcgigkeitskonto)',
  whyNow:
    'When you leave a Swiss employer, your BVG capital transfers to a vested-benefits account. Many expats lose track \u2014 it compounds silently for years and is one of the most common "found money" moments.',
  pillar: 'p2',
  country: 'CH',
  priority: 'high',
  impact: 'recovers forgotten CH capital \u2014 typically \u20AC50k\u2013300k',
  icon: '\u{1F50D}',
  uploadable: true,
  uploadHint: 'Freiz\u00fcgigkeitsausweis or annual statement from the vested-benefits foundation',
  guide: {
    title: 'How to locate your Swiss vested benefits',
    timeEstimate: '2\u20136 weeks (if dormant)',
    difficulty: 'hard',
    language: 'German',
    steps: [
      {
        num: 1,
        text: 'Check your own records first',
        detail:
          'If you actively chose a vested-benefits provider when leaving your CH employer (a bank 2nd-pillar foundation, VIAC, Finpension, Frankly\u2026), they should be sending you annual statements.',
      },
      {
        num: 2,
        text: 'Search zentralstelle.ch',
        detail:
          'Visit zentralstelle.ch (2. S\u00e4ule-Zentralstelle) and submit a free search with your AHV number. This is the official register for forgotten 2nd-pillar assets across all Swiss institutions.',
      },
      {
        num: 3,
        text: 'Call Auffangeinrichtung BVG',
        detail:
          'If zentralstelle returns nothing, call Auffangeinrichtung BVG at +41 41 799 75 75. Unclaimed vested benefits default here after a few years.',
      },
      {
        num: 4,
        text: 'Request a current statement',
        detail:
          'Once located, ask the institution for a current "Freiz\u00fcgigkeitsausweis" showing balance, investment strategy, and withdrawal conditions.',
      },
      {
        num: 5,
        text: 'Upload to Prevista',
        detail:
          'We\u2019ll add your vested capital to your Swiss pillar 2 \u2014 this can materially change your retirement picture.',
      },
    ],
    tips: [
      'Splitting vested benefits across two foundations allows staggered withdrawal for tax optimisation',
      'If you\u2019re leaving CH permanently for a non-EU/EFTA country, the non-compulsory portion can be withdrawn in cash',
      'Interest on vested benefits compounds silently \u2014 current value is almost always higher than your last statement',
    ],
  },
  manualForm: {
    title: 'Enter your Swiss vested-benefits data',
    description: 'Values from your latest Freiz\u00fcgigkeitsausweis.',
    fields: [
      {
        id: 'currentBalance',
        label: 'Current capital on deposit',
        hint: 'Labeled "Freiz\u00fcgigkeitsguthaben" or "Austrittsleistung"',
        type: 'number',
        placeholder: 'e.g. 185000',
        unit: 'CHF',
      },
      {
        id: 'provider',
        label: 'Foundation / provider',
        hint: 'Holding your capital',
        type: 'text',
        placeholder: 'e.g. Auffangeinrichtung BVG, VIAC, Finpension',
      },
      {
        id: 'lastEmployer',
        label: 'Former employer',
        hint: 'Swiss employer whose plan this capital originates from',
        type: 'text',
        placeholder: 'e.g. UBS, Credit Suisse',
      },
    ],
  },
};

// ─── FR Pillar 3 \u2014 Plan d\u2019\u00c9pargne Retraite ───────────────────

export const ASK_FR_PER: DataAsk = {
  id: 'fr-per',
  title: 'Your French PER (Plan d\u2019\u00c9pargne Retraite)',
  whyNow:
    'The PER replaced PERP/Madelin in 2019 as France\u2019s unified personal pension. Contributions reduce your taxable income (up to 10% of net professional income, capped at 8\u00d7 PASS \u2248 \u20AC37k/yr).',
  pillar: 'p3',
  country: 'FR',
  priority: 'medium',
  impact: 'adds tax-advantaged French P3 bucket',
  icon: '\u{1F1EB}\u{1F1F7}',
  uploadable: true,
  uploadHint: 'Annual PER statement from your bank or insurer',
  guide: {
    title: 'How to review your French PER',
    timeEstimate: 'Instant \u2013 5 min',
    difficulty: 'easy',
    language: 'French',
    steps: [
      {
        num: 1,
        text: 'Log in to your provider',
        detail:
          'PERs are typically held at a bank (BoursoBank, Cr\u00e9dit Agricole, BNP) or insurer (AXA, Generali, Spirica). Log in and find "Plan d\u2019\u00c9pargne Retraite" in your product list.',
      },
      {
        num: 2,
        text: 'Download the annual statement',
        detail:
          'The statement shows encours (balance), versements (contributions paid in), and a projected income at retirement. You also get a tax-deduction summary for your impots.gouv.fr declaration.',
      },
      {
        num: 3,
        text: 'Check for legacy PERP / Madelin',
        detail:
          'If you started saving for retirement before 2019, you may still have a PERP or contrat Madelin with an old insurer. You can consolidate into a PER individuel.',
      },
      {
        num: 4,
        text: 'Upload to Prevista',
        detail:
          'We\u2019ll add your PER capital to your French pillar 3 and factor the tax deduction into your net income.',
      },
    ],
    tips: [
      'Annual contribution cap: 10% of net pro income (floor \u20AC4,637; ceiling \u2248 \u20AC37k in 2025). Unused cap carries forward 3 years.',
      'Exit options at retirement: capital (taxed), annuity (partly tax-free), or mix. Early unlock only for specific life events (primary home purchase, accident\u2026).',
      'If you leave France, the PER stays put until retirement or the specific unlock conditions trigger.',
    ],
  },
  manualForm: {
    title: 'Enter your PER data',
    description: 'Values from your latest annual PER statement.',
    fields: [
      {
        id: 'currentBalance',
        label: 'Current balance (encours)',
        hint: 'Total accumulated balance',
        type: 'number',
        placeholder: 'e.g. 42000',
        unit: '\u20AC',
      },
      {
        id: 'monthlyContribution',
        label: 'Monthly contribution',
        hint: 'Versement mensuel moyen',
        type: 'number',
        placeholder: 'e.g. 300',
        unit: '\u20AC/mo',
      },
      {
        id: 'growthAssumption',
        label: 'Expected annual return',
        hint: '4% is a common baseline for a balanced PER allocation',
        type: 'number',
        placeholder: 'e.g. 4',
        unit: '%',
      },
      {
        id: 'provider',
        label: 'Provider',
        hint: 'Bank or insurer',
        type: 'text',
        placeholder: 'e.g. BoursoBank, AXA',
      },
    ],
  },
};

// ─── CH Pillar 3 \u2014 S\u00e4ule 3a ────────────────────────────────────

export const ASK_CH_3A: DataAsk = {
  id: 'ch-3a',
  title: 'Your Swiss Pillar 3a (S\u00e4ule 3a)',
  whyNow:
    'Annual 3a contributions are fully tax-deductible \u2014 CHF 7,258 for employees, CHF 36,288 for the self-employed in 2025. The iconic Swiss tax-advantaged retirement vehicle.',
  pillar: 'p3',
  country: 'CH',
  priority: 'medium',
  impact: 'adds tax-advantaged Swiss savings',
  icon: '\u{1F1E8}\u{1F1ED}',
  uploadable: true,
  uploadHint: 'Annual 3a Bescheinigung / attestation from your provider',
  guide: {
    title: 'How to review your Swiss Pillar 3a',
    timeEstimate: 'Instant',
    difficulty: 'easy',
    language: 'German / French',
    steps: [
      {
        num: 1,
        text: 'Log in to your 3a provider',
        detail:
          'Banks (PostFinance, Migros Bank, Raiffeisen, ZKB) or digital providers (VIAC, Finpension, Frankly, Selma). Each account issues a separate annual attestation.',
      },
      {
        num: 2,
        text: 'Download the annual attestation',
        detail:
          'Shows opening balance, annual contribution, fund allocation, closing balance, and the tax deduction you can claim.',
      },
      {
        num: 3,
        text: 'Gather all 3a accounts',
        detail:
          'You may hold up to 5 separate 3a accounts in Switzerland. Gather each provider\u2019s attestation \u2014 we\u2019ll sum them for your picture.',
      },
      {
        num: 4,
        text: 'Upload to Prevista',
        detail:
          'We\u2019ll add your 3a savings to your Swiss pillar 3 and flag unused tax room.',
      },
    ],
    tips: [
      'You can hold up to 5 separate 3a accounts \u2014 staggering withdrawal across tax years optimises the lump-sum tax',
      'Withdrawal only possible 5 years before standard retirement age, or earlier to purchase a primary home, become self-employed, or leave CH permanently',
      'If you left CH and moved to the EU, your 3a stays accessible \u2014 but early withdrawal rules and tax treatment differ by canton',
    ],
  },
  manualForm: {
    title: 'Enter your Pillar 3a data',
    description: 'Sum of all your 3a accounts \u2014 attach each attestation if you want us to track them individually.',
    fields: [
      {
        id: 'currentBalance',
        label: 'Total 3a balance',
        hint: 'Across all 3a accounts',
        type: 'number',
        placeholder: 'e.g. 48000',
        unit: 'CHF',
      },
      {
        id: 'annualContribution',
        label: 'Annual contribution',
        hint: '2025 max: CHF 7,258 (employee) / CHF 36,288 (self-employed)',
        type: 'number',
        placeholder: 'e.g. 7258',
        unit: 'CHF/yr',
      },
      {
        id: 'growthAssumption',
        label: 'Expected annual return',
        hint: '3% cash / 5% invested \u2014 depends on your allocation',
        type: 'number',
        placeholder: 'e.g. 4',
        unit: '%',
      },
      {
        id: 'provider',
        label: 'Main provider',
        hint: 'Bank or digital 3a platform',
        type: 'text',
        placeholder: 'e.g. VIAC, PostFinance',
      },
    ],
  },
};

// ─── LU Pillar 3 \u2014 Pr\u00e9voyance vieillesse Art. 111bis ─────────────

export const ASK_LU_PREVOYANCE: DataAsk = {
  id: 'lu-prevoyance',
  title: 'Your Luxembourg personal pension (Art. 111bis)',
  whyNow:
    'Art. 111bis LIR lets you deduct up to \u20AC3,200/yr from taxable income. Pays out from age 60 as capital, annuity, or both. Straightforward to open at any LU bank or insurer.',
  pillar: 'p3',
  country: 'LU',
  priority: 'medium',
  impact: 'adds tax-deductible LU P3 savings',
  icon: '\u{1F1F1}\u{1F1FA}',
  uploadable: true,
  uploadHint: 'Annual statement from your bank or insurer',
  guide: {
    title: 'How to review your pr\u00e9voyance-vieillesse',
    timeEstimate: '5 min',
    difficulty: 'easy',
    language: 'French / German',
    steps: [
      {
        num: 1,
        text: 'Log in to your provider',
        detail:
          'Contracts are held at LU banks (ING, BIL, Spuerkeess, BGL BNP) or insurers (Foyer, Swiss Life, AXA, LaLux, Cardif Lux Vie).',
      },
      {
        num: 2,
        text: 'Download the annual statement',
        detail:
          'Shows versements de l\u2019ann\u00e9e (annual contributions), provisions (accumulated balance), and the tax deduction to claim on your annual Luxembourg tax return.',
      },
      {
        num: 3,
        text: 'Check your tax declaration',
        detail:
          'If you\u2019re unsure whether you have a contract, look at your last LU tax return \u2014 the deduction appears under "Art. 111bis LIR, pr\u00e9voyance vieillesse".',
      },
      {
        num: 4,
        text: 'Upload to Prevista',
        detail:
          'We\u2019ll add your prévoyance balance to your Luxembourg pillar 3 and flag unused tax room.',
      },
    ],
    tips: [
      'Flat \u20AC3,200/yr deduction at any age (previously age-scaled \u2014 reformed in 2017). Unused cap doesn\u2019t carry forward.',
      'Contract must run \u22656510 years and pay out earliest at 60, latest at 75',
      'Minimum 50% must be taken as annuity (taxed at 50% of standard rate); up to 50% as tax-free lump sum',
    ],
  },
  manualForm: {
    title: 'Enter your pr\u00e9voyance-vieillesse data',
    description: 'Values from your latest annual statement.',
    fields: [
      {
        id: 'currentBalance',
        label: 'Current provision',
        hint: 'Accumulated balance on the contract',
        type: 'number',
        placeholder: 'e.g. 18000',
        unit: '\u20AC',
      },
      {
        id: 'annualContribution',
        label: 'Annual contribution',
        hint: '2025 max: \u20AC3,200/yr (deductible)',
        type: 'number',
        placeholder: 'e.g. 3200',
        unit: '\u20AC/yr',
      },
      {
        id: 'growthAssumption',
        label: 'Expected annual return',
        hint: 'Contract-dependent \u2014 3\u20135% is typical',
        type: 'number',
        placeholder: 'e.g. 3.5',
        unit: '%',
      },
      {
        id: 'provider',
        label: 'Provider',
        hint: 'Bank or insurer',
        type: 'text',
        placeholder: 'e.g. Foyer, BIL',
      },
    ],
  },
};

export const ASK_PRIVATE_SAVINGS: DataAsk = {
  id: 'private-savings',
  title: 'Your private savings & investments',
  whyNow: 'Your own savings are the third leg of retirement \u2014 even a rough figure lets us show the full picture, not just pensions.',
  pillar: 'p3',
  priority: 'low',
  impact: 'completes the 3-pillar picture',
  icon: '\u{1F4B0}',
  uploadable: false,
  manualForm: {
    title: 'Tell us roughly what you\u2019re saving',
    description:
      'No need to be precise \u2014 a rough figure is enough to show where your savings sit in the full picture. You can refine per-product later.',
    fields: [
      {
        id: 'currentBalance',
        label: 'Total current savings & investments',
        hint: 'Across all accounts (brokerage, PEA, assurance-vie, 3a, investment apps\u2026)',
        type: 'number',
        placeholder: 'e.g. 85000',
        unit: '\u20AC',
      },
      {
        id: 'monthlyContribution',
        label: 'Monthly contribution',
        hint: 'What you\u2019re putting aside each month on average',
        type: 'number',
        placeholder: 'e.g. 600',
        unit: '\u20AC/mo',
      },
      {
        id: 'growthAssumption',
        label: 'Expected annual return',
        hint: 'A rough assumption \u2014 4% is a common baseline for a balanced portfolio',
        type: 'number',
        placeholder: 'e.g. 4',
        unit: '%',
      },
    ],
  },
};

export const ALL_ASKS: DataAsk[] = [
  // P1 — state
  ASK_CH_AHV,
  ASK_FR_RELEVE,
  ASK_LU_EXTRAIT,
  // P2 — workplace
  ASK_CH_BVG,
  ASK_CH_FREIZUGIGKEIT,
  ASK_FR_AGIRC_ARRCO,
  ASK_LU_RCP,
  // P3 — personal (country-specific first, then universal fallback)
  ASK_FR_PER,
  ASK_CH_3A,
  ASK_LU_PREVOYANCE,
  ASK_PRIVATE_SAVINGS,
];
