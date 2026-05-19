// ════════════════════════════════════════════════════════════════════
// Prevista Financial Model — V6.2
// ════════════════════════════════════════════════════════════════════
// Standalone, importable model. Used by:
//   - generate-financial-projections.js (Excel workbook)
//   - generate-investor-deck-v2.js     (investor PPTX)
//
// Single source of truth for: pricing, lead-gen rates, corridor matrix,
// engine schedule, FTE schedule, scenarios, costs, and the 60-month
// simulation.
// ════════════════════════════════════════════════════════════════════

// ── Pricing ──
const PRICE_MONTHLY = 4.99;
const PRICE_ANNUAL = 49.00;
const ANNUAL_SPLIT_TARGET = 0.40;

// ── Lead generation ──
const LEAD_GEN_RATE = 0.0003;
const LEAD_GEN_GAP_PCT = 0.80;
const LEAD_GEN_CLICK_PCT = 0.25;
const LEAD_GEN_INVEST_PCT = 0.15;
const LEAD_GEN_EFFECTIVE = LEAD_GEN_GAP_PCT * LEAD_GEN_CLICK_PCT * LEAD_GEN_INVEST_PCT;
const AVG_CAPITAL_INVESTED = 125000;
const CAPITAL_ANNUAL_GROWTH = 0.09;

// ── Funding ──
// Pure bootstrap: zero external funding committed. Founder capital absorbs
// the cash trough (~€32K at M16, base scenario, after founder compensation
// kicks in from M8). External capital (grants, angels, seed) can be layered
// in later as opportunistic acceleration without changing the underlying
// business viability.
const SEED_AMOUNT = 0;
const SEED_MONTH = 7; // retained for future scenarios; currently unused

// ── Bilateral pension corridor matrix ──
// Each entry is the addressable population (people with pension entitlements
// in BOTH countries) = bilateral diaspora × 0.55 addressability factor.
// Keys are alphabetically sorted ISO-2 country codes joined with "-".
const CORRIDORS = {
  // Iberian + Latin Europe
  "FR-PT": 358000, "CH-PT": 151000, "DE-PT": 96000, "LU-PT": 56000,
  "PT-UK": 47000, "BE-PT": 30000, "ES-PT": 96000, "NL-PT": 19000, "IT-PT": 14000,

  // Spanish corridors
  "ES-FR": 193000, "DE-ES": 176000, "ES-UK": 264000, "CH-ES": 72000,
  "BE-ES": 44000, "ES-IT": 33000, "ES-NL": 22000, "ES-RO": 413000, "ES-LU": 5000,

  // French corridors
  "CH-FR": 127000, "BE-FR": 165000, "DE-FR": 149000, "FR-LU": 29000,
  "FR-UK": 193000, "FR-IT": 138000, "FR-NL": 19000, "FR-PL": 72000, "FR-RO": 94000,

  // German corridors (DE is the biggest hub)
  "CH-DE": 209000, "AT-DE": 248000, "DE-NL": 127000, "DE-IT": 413000,
  "DE-PL": 1183000, "DE-RO": 454000, "DE-UK": 138000, "BE-DE": 36000,
  "DE-LU": 11000, "DE-HU": 127000, "CZ-DE": 33000, "DE-HR": 253000,
  "BG-DE": 215000, "DE-GR": 259000, "DE-SK": 44000, "DE-SI": 33000,
  "DE-DK": 25000, "DE-FI": 11000, "DE-SE": 28000, "DE-LT": 19000,
  "DE-LV": 19000, "DE-EE": 11000, "DE-IE": 11000,

  // Italian corridors
  "CH-IT": 237000, "BE-IT": 99000, "IT-UK": 99000, "AT-IT": 36000,
  "IT-RO": 677000, "IT-LU": 17000, "IT-SI": 6000, "HR-IT": 22000,
  "IT-MT": 4000, "IT-PL": 72000,

  // Polish corridors (post-2004 EU enlargement migration)
  "PL-UK": 605000, "NL-PL": 99000, "IE-PL": 69000, "PL-SE": 58000,
  "AT-PL": 55000, "BE-PL": 66000, "DK-PL": 25000, "LT-PL": 18000,
  "CZ-PL": 44000, "PL-SK": 28000, "ES-PL": 33000,

  // Romanian corridors
  "RO-UK": 303000, "AT-RO": 83000, "BE-RO": 61000, "HU-RO": 220000,
  "PT-RO": 39000, "NL-RO": 14000,

  // UK corridors
  "IE-UK": 275000, "NL-UK": 83000, "BE-UK": 30000, "LT-UK": 127000,
  "LV-UK": 66000, "MT-UK": 19000, "CY-UK": 55000, "BG-UK": 44000,
  "GR-UK": 50000, "HU-UK": 58000, "FI-UK": 19000, "SE-UK": 25000, "DK-UK": 19000,

  // Belgium / Netherlands / Switzerland / Austria
  "BE-NL": 127000, "BE-LU": 14000, "AT-CH": 39000, "CH-UK": 44000,
  "CH-NL": 19000, "CH-LU": 2000, "AT-HU": 61000, "AT-CZ": 22000,
  "AT-SK": 28000, "AT-SI": 22000, "AT-HR": 63000,

  // Greece / Ireland
  "CY-GR": 39000, "BE-GR": 14000, "BG-GR": 69000, "GR-NL": 6000,
  "IE-LT": 19000, "IE-LV": 14000, "IE-RO": 19000,

  // Czech-Slovak (historical Czechoslovakia)
  "CZ-SK": 138000,

  // Nordic
  "FI-SE": 99000, "DK-SE": 39000, "EE-FI": 28000, "EE-SE": 11000,

  // Long-tail
  "BG-ES": 66000, "BG-IT": 28000, "HR-SI": 11000, "LT-LV": 5000,
};

// ── Engine deployment schedule (V6) ──
// Front-loaded launch + quarterly Y1 cadence + ~2-month cadence Y2-Y5.
// 29 country engines (EU27 + UK + CH) all live by Month 58.
const ENGINE_SCHEDULE = [
  // Go-Live (M1) — three engines from day one
  { month: 1,  code: "LU" },
  { month: 1,  code: "FR" },
  { month: 1,  code: "CH" },
  // Year 1 — quarterly
  { month: 3,  code: "PT" },
  { month: 6,  code: "ES" },
  { month: 9,  code: "UK" },
  { month: 12, code: "IT" },
  // Year 2 — German hub + Benelux + Eastern EU
  { month: 13, code: "DE" },
  { month: 15, code: "PL" },
  { month: 17, code: "BE" },
  { month: 19, code: "NL" },
  { month: 21, code: "RO" },
  { month: 23, code: "AT" },
  // Year 3 — Central Europe + Mediterranean
  { month: 25, code: "HU" },
  { month: 27, code: "GR" },
  { month: 29, code: "HR" },
  { month: 31, code: "IE" },
  { month: 33, code: "BG" },
  { month: 35, code: "CZ" },
  // Year 4 — Nordic + remaining Central
  { month: 37, code: "SK" },
  { month: 39, code: "SE" },
  { month: 41, code: "DK" },
  { month: 43, code: "FI" },
  { month: 45, code: "LT" },
  { month: 47, code: "LV" },
  // Year 5 — long tail
  { month: 49, code: "SI" },
  { month: 52, code: "CY" },
  { month: 55, code: "EE" },
  { month: 58, code: "MT" },
];

const COUNTRY_NAMES = {
  LU:"Luxembourg", PT:"Portugal", FR:"France", ES:"Spain", DE:"Germany",
  PL:"Poland", RO:"Romania", IT:"Italy", UK:"United Kingdom", CH:"Switzerland",
  BE:"Belgium", NL:"Netherlands", AT:"Austria", HU:"Hungary", IE:"Ireland",
  HR:"Croatia", BG:"Bulgaria", GR:"Greece", CZ:"Czechia", SK:"Slovakia",
  LT:"Lithuania", LV:"Latvia", SI:"Slovenia", SE:"Sweden", DK:"Denmark",
  FI:"Finland", CY:"Cyprus", EE:"Estonia", MT:"Malta",
};

// ── FTE ramp ──
// €8K/mo blended = ~€85K gross + ~14% LU social charges + equipment/desk overhead.
// Reflects senior-leaning hire mix (eng + content + ops); junior-only would be ~€6K.
//
// FTE schedule is **scenario-dependent**: in base, the subscriber-revenue ramp
// can't comfortably support 8 FTEs by M60 (€64K/mo people cost vs €90K subMRR
// → 87% of revenue to people, no safety margin). Base hires conservatively
// (4 by M60). Upside keeps the original aggressive ramp because the revenue
// curve genuinely supports it.
const AVG_FTE_COST_MONTHLY = 8000;
const BASE_FTE_SCHEDULE = [
  { month: 30, hires: 1 }, // first hire just before cumulative BE (M32)
  { month: 42, hires: 1 },
  { month: 54, hires: 1 },
  { month: 60, hires: 1 },
]; // 4 FTEs by M60
const UPSIDE_FTE_SCHEDULE = [
  { month: 28, hires: 1 },
  { month: 36, hires: 1 },
  { month: 42, hires: 1 },
  { month: 48, hires: 2 },
  { month: 54, hires: 1 },
  { month: 60, hires: 2 },
]; // 8 FTEs by M60
// Backward-compat alias for any external consumer expecting the old global.
// Points at upside (the original / fuller schedule).
const FTE_SCHEDULE = UPSIDE_FTE_SCHEDULE;

// ── Founder compensation ──
// BD cofounder goes full-time at M7; first paycheck M8. Tech cofounder defers
// salary until BD reaches market rate (subMRR > €25K). All figures are
// company cost (loaded) — LU indépendant ~25% social charges → net to founder
// is ~75% of these numbers.
//
// Step-ups trigger on subscription MRR (not lead-gen) — cleaner signal of
// whether the core business is working. Step-ups auto-fire earlier in the
// upside scenario as the revenue curve ramps faster.
const FOUNDER_COMP = {
  bd: {
    phases: [
      { trigger: { type: "month", value: 8 },     monthly: 3000 }, // ramen
      { trigger: { type: "subMRR", value: 8000 },  monthly: 5000 }, // sub-market
      { trigger: { type: "subMRR", value: 25000 }, monthly: 7000 }, // approaching market
    ],
  },
  tech: {
    phases: [
      { trigger: { type: "subMRR", value: 25000 }, monthly: 5000 }, // tech starts when BD hits market rate
      { trigger: { type: "subMRR", value: 60000 }, monthly: 7000 },
    ],
  },
};

function founderCompFor(rule, month, subMRR) {
  let amount = 0;
  for (const p of rule.phases) {
    const t = p.trigger;
    if (t.type === "month" && month >= t.value) amount = p.monthly;
    if (t.type === "subMRR" && subMRR >= t.value) amount = p.monthly;
  }
  return amount;
}

// ── Scenario parameters (V6.2 calibration) ──
const SCENARIOS = {
  base: {
    label: "Base",
    fteSchedule: BASE_FTE_SCHEDULE,
    organicReachY1: 0.04,
    organicGrowthRate: 0.08,
    emailCapture: 0.30,
    emailToSignup: 0.18,
    directSignup: 0.05,
    paidConversion: 0.12,
    monthlyChurn: 0.03,
    // Paid acquisition zeroed: at €4.99/mo with 12% conversion, paid LTV:CAC is 0.49× —
    // every paid signup is acquired at a loss. Paid is reserved as a Series A lever once
    // CAC/conversion economics are validated post-launch. Seed-stage growth runs purely
    // on organic SEO + distribution partnerships.
    paidBudgetM7: 0,
    paidBudgetM24: 0,
    paidBudgetM60: 0,
    blendedCAC: 40, // retained as a parameter for future scenarios; not used while paid is zero
    partnershipStartMonth: 7,
    activePartnersM7: 1,
    activePartnersM12: 3,
    activePartnersM24: 8,
    activePartnersM60: 20,
    signupsPerPartnerPerMonth: 8,
  },
  upside: {
    label: "Upside",
    fteSchedule: UPSIDE_FTE_SCHEDULE,
    organicReachY1: 0.06,
    organicGrowthRate: 0.12,
    emailCapture: 0.35,
    emailToSignup: 0.22,
    directSignup: 0.07,
    paidConversion: 0.18, // conversion lift at accessible €4.99 pricing (vs 12% base) — realistic-with-evidence case
    monthlyChurn: 0.025,
    // Paid acquisition also zeroed in upside — the upside thesis is conversion lift +
    // stronger organic/partnerships, not "more paid spend." Paid is a Series A lever.
    paidBudgetM7: 0,
    paidBudgetM24: 0,
    paidBudgetM60: 0,
    blendedCAC: 30, // retained for future scenarios
    partnershipStartMonth: 7,
    activePartnersM7: 2,
    activePartnersM12: 5,
    activePartnersM24: 14,
    activePartnersM60: 30,
    signupsPerPartnerPerMonth: 12,
  },
};

// ── Cost structure (monthly) ──
// AI + support split by user type. Free tier does unlimited document
// extraction (data moat) so it costs real money even though it doesn't pay.
const ACTIVE_FREE_FACTOR = 0.5; // fraction of all-time free signups still monthly-active
// Support: founders absorb tickets through M24 (cash cost = tooling only).
// From M25 onwards a CS function exists and per-user costing kicks in.
const SUPPORT_FOUNDER_PHASE_END = 24;
const SUPPORT_FIXED_EARLY = 150; // €/mo for help-desk + KB + status tooling
const COSTS = {
  infrastructure: { m1: 150, m12: 400, m24: 900, m36: 1500, m48: 2200, m60: 3000 },
  aiApi: { perPaidUser: 0.20, perFreeUser: 0.04 }, // optimized engineering: Haiku 4.5 by default + 90% prompt caching + Sonnet only for vision/complex; ~10× safety margin over theoretical floor (€0.05/€0.01)
  marketing: { m1: 80, m12: 250, m24: 700, m36: 1500, m48: 3000, m60: 4000 }, // Global tooling only: Workspace, email, SEO suite, video tools. Country-specific marketing is split out via COUNTRY_LAUNCH_BURST + COUNTRY_RECURRING below.
  support: { perPaidUser: 0.50, perFreeUser: 0.08 }, // AI-first model: tooling + bounded contractor overflow; FTE captures primary human CS labor. ~10% of sub revenue at €4.99 — absolute number is €0.50/user, in line with Stripe/Wise/Klarna AI-augmented fintech
  legal: { m1: 600, m12: 1000, m24: 1500, m36: 2000, m48: 2500, m60: 3000 }, // multi-jurisdiction regulatory + GDPR + partner contracts; ramps with countries-live
  misc: { monthly: 100 },
};

// ── Country-launch marketing ──
// Per-engine one-time spike in the launch month: AI translation QA, local
// press wire, content seed, small SEM activation. Plus persistent per-live-
// country run-rate for locale SEO tooling, content refresh, A/B testing.
// Bulk of country-marketing *labor* is absorbed by the FTE line from M28+.
// Same numbers across base and upside — a company decision, not market-driven.
const COUNTRY_LAUNCH_BURST = 1000;  // €/engine, single-month spike at launch
const COUNTRY_RECURRING = 100;       // €/live-country/month, persistent

// ── Helper functions ──

function computeAddressable(m) {
  const live = ENGINE_SCHEDULE.filter(e => e.month <= m);
  let addressable = 0;
  for (let i = 0; i < live.length; i++) {
    for (let j = i + 1; j < live.length; j++) {
      const a = live[i];
      const b = live[j];
      const key = [a.code, b.code].sort().join("-");
      const pop = CORRIDORS[key] || 0;
      if (pop === 0) continue;
      const corridorOpenMonth = Math.max(a.month, b.month);
      const monthsLive = m - corridorOpenMonth;
      const ramp = Math.min(1, Math.max(0, monthsLive / 6));
      addressable += pop * ramp;
    }
  }
  return addressable;
}

function liveCountryCount(m) {
  return ENGINE_SCHEDULE.filter(e => e.month <= m).length;
}

function fteCount(m, schedule = FTE_SCHEDULE) {
  return schedule.filter(e => e.month <= m).reduce((s, e) => s + e.hires, 0);
}

function countryLaunchBurstFor(m) {
  return ENGINE_SCHEDULE.filter(e => e.month === m).length * COUNTRY_LAUNCH_BURST;
}

function countryRecurringFor(m) {
  return liveCountryCount(m) * COUNTRY_RECURRING;
}

function interpolatePartners(s, month) {
  const points = [
    [s.partnershipStartMonth, s.activePartnersM7],
    [12, s.activePartnersM12],
    [24, s.activePartnersM24],
    [60, s.activePartnersM60],
  ];
  if (month <= points[0][0]) return points[0][1];
  for (let i = 0; i < points.length - 1; i++) {
    const [m0, v0] = points[i];
    const [m1, v1] = points[i + 1];
    if (month <= m1) {
      return Math.round(v0 + (v1 - v0) * ((month - m0) / (m1 - m0)));
    }
  }
  return points[points.length - 1][1];
}

function interpolateCost(costDef, month) {
  const points = [
    [1, costDef.m1], [12, costDef.m12], [24, costDef.m24],
    [36, costDef.m36], [48, costDef.m48], [60, costDef.m60]
  ];
  for (let i = 0; i < points.length - 1; i++) {
    if (month <= points[i + 1][0]) {
      const [m0, v0] = points[i];
      const [m1, v1] = points[i + 1];
      return Math.round(v0 + (v1 - v0) * ((month - m0) / (m1 - m0)));
    }
  }
  return costDef.m60;
}

function interpolateCostExtended(costDef, month, startMonth) {
  if (month < startMonth) return 0;
  const elapsed = month - startMonth;
  const m24elapsed = 24 - startMonth;
  const m60elapsed = 60 - startMonth;
  if (elapsed <= m24elapsed) {
    return costDef.m7 + (costDef.m24 - costDef.m7) * (elapsed / m24elapsed);
  } else {
    return costDef.m24 + (costDef.m60 - costDef.m24) * ((elapsed - m24elapsed) / (m60elapsed - m24elapsed));
  }
}

// ── 60-month simulation ──
function simulate(scenarioKey) {
  const s = SCENARIOS[scenarioKey];
  const months = [];

  let totalPaidSubs = 0;
  let cumulativeSignups = 0;
  let cumulativeInvestors = 0;
  let totalCapitalUnderReferral = 0;
  let cumulativeSubRevenue = 0;
  let cumulativeLeadGenRevenue = 0;
  let cumulativeCosts = 0;

  for (let m = 1; m <= 60; m++) {
    const addressable = computeAddressable(m);
    const countriesLive = liveCountryCount(m);

    // Channel 1: Organic
    const organicMonthlyReach = (s.organicReachY1 / 12) * Math.pow(1 + s.organicGrowthRate, m - 1);
    const organicCalcUsers = Math.round(addressable * Math.min(organicMonthlyReach, 0.005));
    const organicEmails = Math.round(organicCalcUsers * s.emailCapture);
    const organicSignupsViaEmail = Math.round(organicEmails * s.emailToSignup);
    const organicSignupsDirect = Math.round(organicCalcUsers * s.directSignup);
    const organicSignups = organicSignupsViaEmail + organicSignupsDirect;

    // Channel 2: Paid Acquisition
    let paidSignups = 0;
    let paidBudget = 0;
    if (m >= 7) {
      paidBudget = interpolateCostExtended(
        { m7: s.paidBudgetM7, m24: s.paidBudgetM24, m60: s.paidBudgetM60 },
        m, 7
      );
      paidSignups = Math.round(paidBudget / s.blendedCAC);
    }

    // Channel 3: Distribution Partnerships
    let partnerSignups = 0;
    let activePartners = 0;
    if (m >= s.partnershipStartMonth) {
      activePartners = interpolatePartners(s, m);
      partnerSignups = Math.round(activePartners * s.signupsPerPartnerPerMonth);
    }

    const totalNewSignups = organicSignups + paidSignups + partnerSignups;
    cumulativeSignups += totalNewSignups;

    // Subscription conversion + churn
    const newPaid = Math.round(totalNewSignups * s.paidConversion);
    const churnAdj = Math.max(s.monthlyChurn * 0.70, s.monthlyChurn - (m * 0.0003));
    const churned = Math.round(totalPaidSubs * churnAdj);
    totalPaidSubs = Math.max(0, totalPaidSubs - churned + newPaid);

    // Subscription revenue
    const annualPct = Math.min(ANNUAL_SPLIT_TARGET, 0.15 + (m * 0.015));
    const blendedMonthlyPrice = (1 - annualPct) * PRICE_MONTHLY + annualPct * (PRICE_ANNUAL / 12);
    const subMRR = Math.round(totalPaidSubs * blendedMonthlyPrice);

    // Lead generation
    const newInvestors = Math.round(totalNewSignups * LEAD_GEN_EFFECTIVE);
    cumulativeInvestors += newInvestors;
    totalCapitalUnderReferral *= (1 + CAPITAL_ANNUAL_GROWTH / 12);
    totalCapitalUnderReferral += newInvestors * AVG_CAPITAL_INVESTED;
    const leadGenMonthlyRevenue = Math.round(totalCapitalUnderReferral * LEAD_GEN_RATE / 12);

    const totalMRR = subMRR + leadGenMonthlyRevenue;

    // Active free users = (cumulative signups − live paid) × retention factor.
    // Treats churned-paid as "back to free" for cost purposes.
    const activeFreeUsers = Math.max(0, Math.round((cumulativeSignups - totalPaidSubs) * ACTIVE_FREE_FACTOR));

    // Costs
    const infraCost = interpolateCost(COSTS.infrastructure, m);
    const aiCost = Math.round(totalPaidSubs * COSTS.aiApi.perPaidUser + activeFreeUsers * COSTS.aiApi.perFreeUser);
    const marketingCost = interpolateCost(COSTS.marketing, m);
    const supportCost = m <= SUPPORT_FOUNDER_PHASE_END
      ? SUPPORT_FIXED_EARLY
      : Math.round(totalPaidSubs * COSTS.support.perPaidUser + activeFreeUsers * COSTS.support.perFreeUser);
    const legalCost = interpolateCost(COSTS.legal, m);
    const miscCost = COSTS.misc.monthly;
    const activeFtes = fteCount(m, s.fteSchedule);
    const salaryCost = activeFtes * AVG_FTE_COST_MONTHLY;
    const founderCompBd = founderCompFor(FOUNDER_COMP.bd, m, subMRR);
    const founderCompTech = founderCompFor(FOUNDER_COMP.tech, m, subMRR);
    const founderComp = founderCompBd + founderCompTech;
    const countryLaunchBurst = countryLaunchBurstFor(m);
    const countryRecurring = countryRecurringFor(m);
    const totalFixedCosts = infraCost + marketingCost + legalCost + miscCost + salaryCost + founderComp + countryLaunchBurst + countryRecurring;
    const totalVariableCosts = aiCost + supportCost;
    const totalOperatingCosts = totalFixedCosts + totalVariableCosts;
    const totalCostsWithPaid = totalOperatingCosts + paidBudget;

    const netIncome = totalMRR - totalCostsWithPaid;

    cumulativeSubRevenue += subMRR;
    cumulativeLeadGenRevenue += leadGenMonthlyRevenue;
    cumulativeCosts += totalCostsWithPaid;

    months.push({
      month: m,
      year: Math.ceil(m / 12),
      addressable: Math.round(addressable),
      countriesLive,
      organicCalcUsers, organicSignups, paidSignups, partnerSignups, activePartners,
      paidBudget: Math.round(paidBudget),
      totalNewSignups, cumulativeSignups,
      newPaid, churned, churnRate: churnAdj, totalPaidSubs,
      newInvestors, cumulativeInvestors,
      totalCapital: Math.round(totalCapitalUnderReferral),
      leadGenMonthly: leadGenMonthlyRevenue,
      subMRR, totalMRR,
      subARR: subMRR * 12,
      totalARR: totalMRR * 12,
      infraCost, aiCost, marketingCost, supportCost, legalCost, miscCost,
      salaryCost, activeFtes, activeFreeUsers,
      founderCompBd, founderCompTech, founderComp,
      countryLaunchBurst, countryRecurring,
      totalOperatingCosts,
      paidAcqCost: Math.round(paidBudget),
      totalCosts: totalCostsWithPaid,
      netIncome,
      cumulativeNet: cumulativeSubRevenue + cumulativeLeadGenRevenue - cumulativeCosts,
      cumulativeSubRevenue, cumulativeLeadGenRevenue,
      cumulativeTotalRevenue: cumulativeSubRevenue + cumulativeLeadGenRevenue,
    });
  }
  return months;
}

// ── Convenience: compute break-even months ──
function computeBreakEvens(baseData) {
  let monthlyBE = null;
  let cumBE = null;
  let cumNet = 0;
  for (let i = 0; i < baseData.length; i++) {
    if (baseData[i].netIncome >= 0 && !monthlyBE) monthlyBE = i + 1;
    cumNet += baseData[i].netIncome;
    if (cumNet >= 0 && !cumBE) cumBE = i + 1;
  }
  return { monthlyBE, cumBE };
}

// ── Convenience: compute monthly cash balance for break-even chart ──
// Cash starts at 0, founder self-funded M1-M6, seed of €230K arrives at M7.
function computeCashBalance(baseData) {
  let cash = 0;
  const balances = [];
  for (let i = 0; i < baseData.length; i++) {
    const m = i + 1;
    if (m === SEED_MONTH) cash += SEED_AMOUNT;
    cash += baseData[i].netIncome;
    balances.push({ month: m, cash: Math.round(cash) });
  }
  return balances;
}

// ── Exports ──
module.exports = {
  // Constants
  PRICE_MONTHLY, PRICE_ANNUAL, ANNUAL_SPLIT_TARGET,
  LEAD_GEN_RATE, LEAD_GEN_GAP_PCT, LEAD_GEN_CLICK_PCT, LEAD_GEN_INVEST_PCT,
  LEAD_GEN_EFFECTIVE, AVG_CAPITAL_INVESTED, CAPITAL_ANNUAL_GROWTH,
  SEED_AMOUNT, SEED_MONTH, AVG_FTE_COST_MONTHLY, ACTIVE_FREE_FACTOR,
  // Data structures
  CORRIDORS, ENGINE_SCHEDULE, COUNTRY_NAMES,
  FTE_SCHEDULE, BASE_FTE_SCHEDULE, UPSIDE_FTE_SCHEDULE,
  SCENARIOS, COSTS,
  FOUNDER_COMP, COUNTRY_LAUNCH_BURST, COUNTRY_RECURRING,
  // Functions
  computeAddressable, liveCountryCount, fteCount, founderCompFor,
  countryLaunchBurstFor, countryRecurringFor,
  interpolatePartners, interpolateCost, interpolateCostExtended,
  simulate, computeBreakEvens, computeCashBalance,
};

// ── Self-test when run directly ──
if (require.main === module) {
  const baseData = simulate("base");
  const upsideData = simulate("upside");
  const { monthlyBE, cumBE } = computeBreakEvens(baseData);
  const cashBalance = computeCashBalance(baseData);

  console.log("── Financial model self-test ──");
  console.log(`Engines: ${ENGINE_SCHEDULE.length}, M1 live: ${liveCountryCount(1)}, M58 live: ${liveCountryCount(58)}`);
  console.log(`Y5 base subs: ${baseData[59].totalPaidSubs}, ARR: €${Math.round(baseData[59].totalARR).toLocaleString()}, capital: €${Math.round(baseData[59].totalCapital).toLocaleString()}`);
  console.log(`Y5 upside subs: ${upsideData[59].totalPaidSubs}, ARR: €${Math.round(upsideData[59].totalARR).toLocaleString()}`);
  console.log(`Monthly BE: M${monthlyBE}, Cumulative BE: M${cumBE}`);
  console.log(`Y5 cumulative net: €${Math.round(baseData[59].cumulativeNet).toLocaleString()}`);
  console.log(`Cash balance — M1: €${cashBalance[0].cash}, M7: €${cashBalance[6].cash}, M14: €${cashBalance[13].cash}, M20: €${cashBalance[19].cash}, M60: €${cashBalance[59].cash}`);
}
