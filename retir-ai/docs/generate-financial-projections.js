const ExcelJS = require("exceljs");
const path = require("path");

async function generate() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Prevista Financial Projections v2";
  wb.created = new Date();

  // ─── Color palette ───
  const DARK = "FF1B2A4A";
  const ACCENT = "FF2E75B6";
  const LIGHT_ACCENT = "FFD6E4F0";
  const GREEN = "FF548235";
  const LIGHT_GREEN = "FFE2EFDA";
  const ORANGE = "FFED7D31";
  const LIGHT_ORANGE = "FFFCE4D6";
  const RED = "FFC00000";
  const LIGHT_RED = "FFFCE4EC";
  const GRAY = "FFF2F2F2";
  const WHITE = "FFFFFFFF";
  const PURPLE = "FF7030A0";
  const LIGHT_PURPLE = "FFE8D5F5";
  const GOLD = "FFB8860B";
  const LIGHT_GOLD = "FFFFF8DC";

  const headerFill = { type: "pattern", pattern: "solid", fgColor: { argb: DARK } };
  const headerFont = { bold: true, color: { argb: WHITE }, size: 11, name: "Calibri" };
  const subHeaderFill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_ACCENT } };
  const subHeaderFont = { bold: true, size: 11, name: "Calibri" };
  const bodyFont = { size: 11, name: "Calibri" };
  const boldFont = { bold: true, size: 11, name: "Calibri" };
  const currencyFmt = '€#,##0';
  const currencyFmt2 = '€#,##0.00';
  const pctFmt = '0.0%';
  const pct1Fmt = '0%';
  const intFmt = '#,##0';

  const thinBorder = {
    top: { style: "thin" }, bottom: { style: "thin" },
    left: { style: "thin" }, right: { style: "thin" }
  };

  function styleHeader(ws, row, colCount) {
    for (let c = 1; c <= colCount; c++) {
      const cell = ws.getRow(row).getCell(c);
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border = thinBorder;
    }
    ws.getRow(row).height = 32;
  }

  function styleSubHeader(ws, row, colCount) {
    for (let c = 1; c <= colCount; c++) {
      const cell = ws.getRow(row).getCell(c);
      cell.fill = subHeaderFill;
      cell.font = subHeaderFont;
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border = thinBorder;
    }
    ws.getRow(row).height = 24;
  }

  function styleDataRows(ws, startRow, endRow, colCount) {
    for (let r = startRow; r <= endRow; r++) {
      for (let c = 1; c <= colCount; c++) {
        const cell = ws.getRow(r).getCell(c);
        cell.font = bodyFont;
        cell.border = thinBorder;
        cell.alignment = { vertical: "middle", wrapText: true };
        if (c > 1) cell.alignment.horizontal = "center";
      }
      if ((r - startRow) % 2 === 1) {
        for (let c = 1; c <= colCount; c++) {
          ws.getRow(r).getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: GRAY } };
        }
      }
    }
  }

  function addTitle(ws, row, text, colSpan) {
    ws.mergeCells(row, 1, row, colSpan);
    const cell = ws.getRow(row).getCell(1);
    cell.value = text;
    cell.font = { bold: true, size: 14, name: "Calibri", color: { argb: DARK } };
    cell.alignment = { horizontal: "left", vertical: "middle" };
    ws.getRow(row).height = 28;
  }

  function addNote(ws, row, text, colSpan) {
    ws.mergeCells(row, 1, row, colSpan);
    const cell = ws.getRow(row).getCell(1);
    cell.value = text;
    cell.font = { italic: true, size: 10, name: "Calibri", color: { argb: "FF666666" } };
    cell.alignment = { wrapText: true };
  }

  function highlightRow(ws, row, colCount, fillArgb, fontArgb) {
    for (let c = 1; c <= colCount; c++) {
      const cell = ws.getRow(row).getCell(c);
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fillArgb } };
      cell.font = { bold: true, size: 11, name: "Calibri", color: { argb: fontArgb } };
      cell.border = thinBorder;
      cell.alignment = { horizontal: c > 1 ? "center" : "left", vertical: "middle", wrapText: true };
    }
  }

  function colorProfitLoss(cell, value) {
    if (value >= 0) {
      cell.font = { bold: true, size: 11, name: "Calibri", color: { argb: GREEN } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_GREEN } };
    } else {
      cell.font = { bold: true, size: 11, name: "Calibri", color: { argb: RED } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_RED } };
    }
  }

  // ════════════════════════════════════════════════════════════════════
  // ASSUMPTIONS & CONSTANTS
  // ════════════════════════════════════════════════════════════════════

  const PRICE_MONTHLY = 14.90;
  const PRICE_ANNUAL = 149.00;
  const ANNUAL_SPLIT_TARGET = 0.40; // grows to 40% annual billing over time

  // Lead generation
  // Tiered annual trailing commission applied to each investor's current
  // referred capital. Rate is evaluated PER INVESTOR (not on aggregate book),
  // so the €500K threshold is crossed by an individual client's balance, not
  // by the platform's total capital under referral.
  //
  // Rationale: retail pension/insurance distribution in LU/FR pays a higher
  // trailing % on smaller tickets because fixed onboarding cost per client
  // needs higher margin on lower AUM to be viable; large tickets face
  // competitive alternatives (private banking) that force rates down.
  const COMMISSION_TIERS = [
    { threshold: 500000, rate: 0.015 },   // €0–500K: 1.5% annual trailing
    { threshold: Infinity, rate: 0.010 }, // €500K+: 1.0% annual trailing
  ];
  function commissionRate(perInvestorCapital) {
    for (const tier of COMMISSION_TIERS) {
      if (perInvestorCapital < tier.threshold) return tier.rate;
    }
    return COMMISSION_TIERS[COMMISSION_TIERS.length - 1].rate;
  }
  const LEAD_GEN_GAP_PCT = 0.80; // 80% of users have a retirement gap
  const LEAD_GEN_CLICK_PCT = 0.25; // 25% click through to product offer
  const LEAD_GEN_INVEST_PCT = 0.15; // 15% actually invest
  const LEAD_GEN_EFFECTIVE = LEAD_GEN_GAP_PCT * LEAD_GEN_CLICK_PCT * LEAD_GEN_INVEST_PCT; // 3% of all signups
  const AVG_CAPITAL_INVESTED = 50000;
  const CAPITAL_ANNUAL_GROWTH = 0.05; // 5% annual growth (contributions + market returns)

  // Country expansion phases — addressable market per phase
  // ════════════════════════════════════════════════════════════════════
  // GEOGRAPHIC EXPANSION — CORRIDOR MATRIX & ENGINE SCHEDULE
  // ════════════════════════════════════════════════════════════════════
  // Each "corridor" (X, Y) is the addressable population — people who have
  // pension entitlements in BOTH country X and country Y. Numbers are
  // bilateral diaspora populations × 0.55 addressability factor (matches
  // gtm-market-sizing.md methodology). Sources: Eurostat migr_pop3ctb,
  // national statistics offices, Wikipedia diaspora articles. Estimates;
  // refine before investor pitch.
  //
  // Keys are alphabetically sorted ISO-2 country codes joined with "-".

  const CORRIDORS = {
    // Iberian + Latin Europe
    "FR-PT": 358000,  // ~600K Portuguese in FR + ~50K French in PT
    "CH-PT": 151000,  // ~270K Portuguese in CH
    "DE-PT": 96000,
    "LU-PT": 56000,
    "PT-UK": 47000,
    "BE-PT": 30000,
    "ES-PT": 96000,
    "NL-PT": 19000,
    "IT-PT": 14000,

    // Spanish corridors
    "ES-FR": 193000,  // ~250K Spanish in FR + ~100K French in ES
    "DE-ES": 176000,
    "ES-UK": 264000,  // pre-Brexit British retirees in ES (~300K) + Spanish in UK
    "CH-ES": 72000,
    "BE-ES": 44000,
    "ES-IT": 33000,
    "ES-NL": 22000,
    "ES-RO": 413000, // ~700K Romanians in ES — huge corridor
    "ES-LU": 5000,

    // French corridors
    "CH-FR": 127000,
    "BE-FR": 165000,  // Belgian-French border — huge bidirectional
    "DE-FR": 149000,
    "FR-LU": 29000,
    "FR-UK": 193000,
    "FR-IT": 138000,
    "FR-NL": 19000,
    "FR-PL": 72000,
    "FR-RO": 94000,

    // German corridors (DE is the biggest hub)
    "CH-DE": 209000,
    "AT-DE": 248000,  // German-Austrian
    "DE-NL": 127000,
    "DE-IT": 413000,  // ~700K Italians in DE — huge
    "DE-PL": 1183000, // ~2M Poles in DE — largest single corridor
    "DE-RO": 454000,
    "DE-UK": 138000,
    "BE-DE": 36000,
    "DE-LU": 11000,
    "DE-HU": 127000,
    "CZ-DE": 33000,
    "DE-HR": 253000,  // ~430K Croats in DE
    "BG-DE": 215000,
    "DE-GR": 259000,  // ~450K Greeks in DE
    "DE-SK": 44000,
    "DE-SI": 33000,
    "DE-DK": 25000,
    "DE-FI": 11000,
    "DE-SE": 28000,
    "DE-LT": 19000,
    "DE-LV": 19000,
    "DE-EE": 11000,
    "DE-IE": 11000,

    // Italian corridors
    "CH-IT": 237000,  // ~350K Italians in CH
    "BE-IT": 99000,
    "IT-UK": 99000,
    "AT-IT": 36000,
    "IT-RO": 677000,  // ~1.2M Romanians in IT — massive
    "IT-LU": 17000,
    "IT-SI": 6000,
    "HR-IT": 22000,
    "IT-MT": 4000,
    "IT-PL": 72000,

    // Polish corridors (post-2004 EU enlargement migration)
    "PL-UK": 605000,  // ~1M Poles in UK pre-Brexit
    "NL-PL": 99000,
    "IE-PL": 69000,
    "PL-SE": 58000,
    "AT-PL": 55000,
    "BE-PL": 66000,
    "DK-PL": 25000,
    "LT-PL": 18000,
    "CZ-PL": 44000,
    "PL-SK": 28000,
    "ES-PL": 33000,

    // Romanian corridors (largest contemporary EU diaspora)
    "FR-RO": 94000,
    "RO-UK": 303000,
    "AT-RO": 83000,
    "BE-RO": 61000,
    "HU-RO": 220000,  // ethnic Hungarians in RO + reverse
    "PT-RO": 39000,
    "NL-RO": 14000,

    // UK corridors
    "IE-UK": 275000,
    "NL-UK": 83000,
    "BE-UK": 30000,
    "LT-UK": 127000,
    "LV-UK": 66000,
    "MT-UK": 19000,
    "CY-UK": 55000,
    "BG-UK": 44000,
    "GR-UK": 50000,
    "HU-UK": 58000,
    "FI-UK": 19000,
    "SE-UK": 25000,
    "DK-UK": 19000,

    // Belgium corridors (small country, many borders)
    "BE-NL": 127000,
    "BE-LU": 14000,

    // Netherlands corridors
    "DE-NL": 127000,
    "NL-RO": 14000,

    // Switzerland corridors
    "AT-CH": 39000,
    "CH-UK": 44000,
    "CH-NL": 19000,
    "CH-LU": 2000,

    // Austria corridors
    "AT-HU": 61000,
    "AT-CZ": 22000,
    "AT-SK": 28000,
    "AT-SI": 22000,
    "AT-HR": 63000,

    // Greece corridors
    "CY-GR": 39000,
    "BE-GR": 14000,
    "BG-GR": 69000,
    "GR-NL": 6000,

    // Ireland corridors
    "IE-LT": 19000,
    "IE-LV": 14000,
    "IE-RO": 19000,

    // Czech-Slovak (historical Czechoslovakia corridor)
    "CZ-SK": 138000,
    "AT-CZ": 22000,
    "AT-SK": 28000,

    // Nordic corridors (Finnish-Swedish is largest)
    "FI-SE": 99000,
    "DK-SE": 39000,
    "EE-FI": 28000,
    "EE-SE": 11000,

    // Long-tail corridors
    "BG-ES": 66000,
    "BG-IT": 28000,
    "HR-SI": 11000,
    "LT-LV": 5000,
  };

  // Engine deployment schedule (V6). Months are absolute (Month 1 = product launch).
  // Front-loaded launch — three engines live from day one — then quarterly Y1 cadence,
  // then a steady ~2-month cadence through Y5. Same 29-country endpoint as V5 (M58).
  // - Go-live (M1): 3 engines (LU, FR, CH) — beachhead + premium high-value market
  // - Y1: 4 new engines (PT M3, ES M6, UK M9, IT M12) — quarterly adds, 7 live by M12
  // - Y2: 6 engines (DE, PL, BE, NL, RO, AT) — German hub + Benelux + Eastern EU
  // - Y3: 6 engines (HU, GR, HR, IE, BG, CZ) — Central Europe + Mediterranean
  // - Y4: 6 engines (SK, SE, DK, FI, LT, LV) — Nordic + remaining Central
  // - Y5: 4 engines (SI, CY, EE, MT) — long tail (small populations)
  // All 29 (EU27 + UK + CH) live by Month 58. Greedy TAM-maximizing order within years.
  const ENGINE_SCHEDULE = [
    // ── Go-Live (M1) — three engines supported from day one ──
    { month: 1,  code: "LU" }, // Beachhead
    { month: 1,  code: "FR" }, // Large neighbor population, FR-LU corridor
    { month: 1,  code: "CH" }, // High-value third pillar; FR-CH (~127K) live immediately
    // ── Year 1: quarterly engine adds (PT → ES → UK → IT) ──
    { month: 3,  code: "PT" }, // Unlocks FR-PT (~358K) + CH-PT (~151K)
    { month: 6,  code: "ES" }, // ES-FR + ES-UK (post-Brexit retirees ~264K)
    { month: 9,  code: "UK" }, // FR-UK + ES-UK + CH-UK; QROPS/HMRC complexity
    { month: 12, code: "IT" }, // Closes Western markets — CH-IT (237K) + FR-IT (138K)
    // ── Year 2: German hub + Benelux + Eastern EU ──
    { month: 13, code: "DE" }, // Hub — unlocks DE-* across the live set immediately
    { month: 15, code: "PL" }, // DE-PL ~1.18M + PL-UK ~605K (largest single unlocks)
    { month: 17, code: "BE" }, // BE-FR 165K + BE-NL 127K
    { month: 19, code: "NL" }, // DE-NL 127K + NL-PL 99K
    { month: 21, code: "RO" }, // IT-RO 677K + DE-RO 454K + ES-RO 413K + RO-UK 303K
    { month: 23, code: "AT" }, // AT-DE 248K + AT-IT + AT-CH
    // ── Year 3: Central Europe + Mediterranean ──
    { month: 25, code: "HU" }, // HU-RO 220K + DE-HU 127K
    { month: 27, code: "GR" }, // DE-GR 259K
    { month: 29, code: "HR" }, // DE-HR 253K
    { month: 31, code: "IE" }, // IE-UK 275K + IE-PL 69K
    { month: 33, code: "BG" }, // BG-DE 215K
    { month: 35, code: "CZ" },
    // ── Year 4: Nordic + remaining Central ──
    { month: 37, code: "SK" },
    { month: 39, code: "SE" }, // FI-SE 99K + PL-SE 58K
    { month: 41, code: "DK" },
    { month: 43, code: "FI" },
    { month: 45, code: "LT" }, // LT-UK 127K
    { month: 47, code: "LV" }, // LV-UK 66K
    // ── Year 5: long tail (small populations) ──
    { month: 49, code: "SI" },
    { month: 52, code: "CY" },
    { month: 55, code: "EE" },
    { month: 58, code: "MT" },
  ];

  // Compute the addressable market at a given month based on which engines are
  // live and what corridors that opens. Each corridor ramps over 6 months from
  // when the LATER of its two engines went live (time for content/SEO/community).
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

  // ════════════════════════════════════════════════════════════════════
  // TEAM / FTE RAMP
  // ════════════════════════════════════════════════════════════════════
  // Hiring begins comfortably after the business reaches monthly break-even.
  // V6 model: monthly BE lands at ~M18, first hire at M28 — that's a 10-month
  // buffer so the funnel is durably proven before adding payroll. All hires
  // are funded from operating cashflow, NOT from the €230K seed. Roles are
  // deliberately unspecified at this stage — the mix evolves based on where
  // the funnel needs reinforcement (engineering, content/SEO, customer
  // success, ops).
  //
  // Co-founder salaries remain excluded (technical + BD co-founders work
  // on equity through Series A).
  const AVG_FTE_COST_MONTHLY = 6000; // €6K/mo fully-loaded (gross + ~13% LU social charges + equipment)
  const FTE_SCHEDULE = [
    { month: 28, hires: 1 }, // First hire — 10 months post monthly BE (durable funnel buffer)
    { month: 36, hires: 1 }, // End of Y3 — 2 FTEs
    { month: 42, hires: 1 }, // Mid-Y4 — 3 FTEs
    { month: 48, hires: 2 }, // End of Y4 — 5 FTEs (supporting ~11.5K subs / 25 countries)
    { month: 54, hires: 1 }, // Mid-Y5 — 6 FTEs
    { month: 60, hires: 2 }, // End of Y5 — 8 FTEs (supporting ~14.9K subs / 29 countries)
  ];

  function fteCount(m) {
    return FTE_SCHEDULE.filter(e => e.month <= m).reduce((s, e) => s + e.hires, 0);
  }

  // Acquisition channel assumptions — Base scenario
  const SCENARIOS = {
    base: {
      label: "Base",
      // Organic
      organicReachY1: 0.04,     // 4% of addressable in Year 1
      organicGrowthRate: 0.08,  // 8% monthly growth in organic traffic
      // Funnel
      emailCapture: 0.30,       // 30% of calculator users
      emailToSignup: 0.18,      // 18% of emails → signup (via drip)
      directSignup: 0.05,       // 5% of calculator users sign up directly (skip email)
      paidConversion: 0.12,     // 12% of signups → paid (high-intent financial
                                // tool with concrete gap surfacing — tighter than
                                // generic SaaS freemium 5-10%)
      monthlyChurn: 0.03,       // 3% monthly churn on subscriptions (Recurly 2025
                                // finance category median: 3.7% — we sit slightly
                                // below median given multi-year pension context)
      // Paid acquisition (starts Month 7 — post-seed)
      paidBudgetM7: 3000,       // €3K/mo starting budget
      paidBudgetM24: 15000,     // ramps to €15K/mo by Month 24
      paidBudgetM60: 25000,     // €25K/mo by Month 60
      blendedCAC: 40,           // €40 per signup via paid — defensible for niche
                                // financial-tool keywords with near-zero competition
                                // (CPC €5-10, landing conversion 25-35%). Previously
                                // €100 which produced an unhealthy 0.4x LTV:CAC.
      // Distribution partnerships (corporate HR, expat associations, content
      // partners, mobility consultancies). BD co-founder owns this channel.
      // Each "active partnership" yields a steady stream of consumer signups.
      partnershipStartMonth: 7, // first deals close post-seed
      activePartnersM7: 1,      // 1 partnership live at month 7
      activePartnersM12: 3,     // 3 by end of year 1
      activePartnersM24: 8,     // 8 by end of year 2
      activePartnersM60: 20,    // 20 by year 5
      signupsPerPartnerPerMonth: 8, // avg signups per active partnership
    },
    upside: {
      label: "Upside",
      organicReachY1: 0.06,
      organicGrowthRate: 0.12,
      emailCapture: 0.35,
      emailToSignup: 0.22,
      directSignup: 0.07,
      paidConversion: 0.15,
      monthlyChurn: 0.025,
      paidBudgetM7: 5000,
      paidBudgetM24: 25000,
      paidBudgetM60: 40000,
      blendedCAC: 30,           // upside: better landing pages + retargeting
      partnershipStartMonth: 7,
      activePartnersM7: 2,
      activePartnersM12: 5,
      activePartnersM24: 14,
      activePartnersM60: 30,
      signupsPerPartnerPerMonth: 12,
    },
  };

  // Cost structure (monthly)
  const COSTS = {
    infrastructure: { m1: 150, m12: 400, m24: 900, m36: 1500, m48: 2200, m60: 3000 },
    aiApi: { perUser: 2.00 },       // per active paid user/month
    marketing: { m1: 200, m12: 800, m24: 2000, m36: 3500, m48: 5000, m60: 6000 }, // organic content costs (on top of paid budget)
    support: { perUser: 0.40 },     // per active paid user/month
    legal: { monthly: 250 },
    misc: { monthly: 100 },
    // Co-founder salaries excluded — technical + BD co-founders work on
    // equity through Series A. Post-break-even FTE ramp is modeled
    // separately via FTE_SCHEDULE + AVG_FTE_COST_MONTHLY; see fteCount().
  };

  // ════════════════════════════════════════════════════════════════════
  // 60-MONTH SIMULATION
  // ════════════════════════════════════════════════════════════════════
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
      // ── Addressable market (sum of all live corridors with per-corridor 6-month ramp) ──
      const addressable = computeAddressable(m);
      const countriesLive = liveCountryCount(m);

      // ── Channel 1: Organic ──
      // Organic reach grows monthly, but as a % of addressable, with SEO compounding
      const organicMonthlyReach = (s.organicReachY1 / 12) * Math.pow(1 + s.organicGrowthRate, m - 1);
      const organicCalcUsers = Math.round(addressable * Math.min(organicMonthlyReach, 0.005)); // cap at 0.5%/month (~6%/yr ceiling on organic reach of addressable market)
      const organicEmails = Math.round(organicCalcUsers * s.emailCapture);
      const organicSignupsViaEmail = Math.round(organicEmails * s.emailToSignup);
      const organicSignupsDirect = Math.round(organicCalcUsers * s.directSignup);
      const organicSignups = organicSignupsViaEmail + organicSignupsDirect;

      // ── Channel 2: Paid Acquisition ──
      let paidSignups = 0;
      let paidBudget = 0;
      if (m >= 7) { // paid starts after seed (Month 7)
        paidBudget = interpolateCostExtended(
          { m7: s.paidBudgetM7, m24: s.paidBudgetM24, m60: s.paidBudgetM60 },
          m, 7
        );
        paidSignups = Math.round(paidBudget / s.blendedCAC);
      }

      // ── Channel 3: Distribution Partnerships ──
      // Direct ramp model — active partnership count interpolated across the
      // 60-month window, each yielding a steady stream of consumer signups.
      // BD co-founder owns this channel from day 1; first deals close post-seed.
      let partnerSignups = 0;
      let activePartners = 0;
      if (m >= s.partnershipStartMonth) {
        activePartners = interpolatePartners(s, m);
        partnerSignups = Math.round(activePartners * s.signupsPerPartnerPerMonth);
      }

      // ── Total signups ──
      const totalNewSignups = organicSignups + paidSignups + partnerSignups;
      cumulativeSignups += totalNewSignups;

      // ── Subscription conversion ──
      const newPaid = Math.round(totalNewSignups * s.paidConversion);
      // Churn improves slightly as product matures
      const churnAdj = Math.max(s.monthlyChurn * 0.70, s.monthlyChurn - (m * 0.0003));
      const churned = Math.round(totalPaidSubs * churnAdj);
      totalPaidSubs = Math.max(0, totalPaidSubs - churned + newPaid);

      // Revenue — subscription
      const annualPct = Math.min(ANNUAL_SPLIT_TARGET, 0.15 + (m * 0.015));
      const blendedMonthlyPrice = (1 - annualPct) * PRICE_MONTHLY + annualPct * (PRICE_ANNUAL / 12);
      const subMRR = Math.round(totalPaidSubs * blendedMonthlyPrice);

      // ── Lead generation ──
      const newInvestors = Math.round(totalNewSignups * LEAD_GEN_EFFECTIVE);
      cumulativeInvestors += newInvestors;
      // Existing capital grows
      totalCapitalUnderReferral *= (1 + CAPITAL_ANNUAL_GROWTH / 12);
      // New capital added
      totalCapitalUnderReferral += newInvestors * AVG_CAPITAL_INVESTED;
      // Tiered trailing commission — evaluated on avg per-investor capital.
      // With avg capital near €50K and 5% compounding, the per-investor
      // balance stays well under the €500K break-point throughout the 60m
      // simulation, so the effective rate is 1.5%. Logic below preserves
      // the tier structure for scenarios where avg capital is larger.
      const perInvestorCapital = cumulativeInvestors > 0
        ? totalCapitalUnderReferral / cumulativeInvestors
        : AVG_CAPITAL_INVESTED;
      const currentLeadGenRate = commissionRate(perInvestorCapital);
      const leadGenMonthlyRevenue = Math.round(totalCapitalUnderReferral * currentLeadGenRate / 12);

      // ── Total revenue (subscriptions + lead gen) ──
      const totalMRR = subMRR + leadGenMonthlyRevenue;

      // ── Costs ──
      const infraCost = interpolateCost(COSTS.infrastructure, m);
      const aiCost = Math.round(totalPaidSubs * COSTS.aiApi.perUser);
      const marketingCost = interpolateCost(COSTS.marketing, m);
      const supportCost = Math.round(totalPaidSubs * COSTS.support.perUser);
      const legalCost = COSTS.legal.monthly;
      const miscCost = COSTS.misc.monthly;
      // Team salaries — post-break-even FTE ramp, funded from operating cashflow
      const activeFtes = fteCount(m);
      const salaryCost = activeFtes * AVG_FTE_COST_MONTHLY;
      const totalFixedCosts = infraCost + marketingCost + legalCost + miscCost + salaryCost;
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
        // Market
        addressable: Math.round(addressable),
        countriesLive,
        // Channels
        organicCalcUsers,
        organicSignups,
        paidSignups,
        paidBudget: Math.round(paidBudget),
        activePartners,
        partnerSignups,
        totalNewSignups,
        cumulativeSignups,
        // Subscribers
        newPaid,
        churned,
        churnRate: churnAdj,
        totalPaidSubs,
        // Lead gen
        newInvestors,
        cumulativeInvestors,
        totalCapital: Math.round(totalCapitalUnderReferral),
        leadGenMonthly: leadGenMonthlyRevenue,
        // Revenue
        subMRR,
        totalMRR,
        subARR: subMRR * 12,
        totalARR: totalMRR * 12,
        // Costs
        infraCost,
        aiCost,
        marketingCost,
        supportCost,
        legalCost,
        miscCost,
        salaryCost,
        activeFtes,
        totalOperatingCosts,
        paidAcqCost: Math.round(paidBudget),
        totalCosts: totalCostsWithPaid,
        // P&L
        netIncome,
        cumulativeNet: cumulativeSubRevenue + cumulativeLeadGenRevenue - cumulativeCosts,
        // Cumulative
        cumulativeSubRevenue,
        cumulativeLeadGenRevenue,
        cumulativeTotalRevenue: cumulativeSubRevenue + cumulativeLeadGenRevenue,
      });
    }
    return months;
  }

  // Linear interpolation across the four anchor points for active partnerships.
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

  // Run simulations
  const baseData = simulate("base");
  const upsideData = simulate("upside");

  // ════════════════════════════════════════════════════════════════════
  // SHEET 1: EXECUTIVE SUMMARY
  // ════════════════════════════════════════════════════════════════════
  const ws1 = wb.addWorksheet("1. Executive Summary", { properties: { tabColor: { argb: ACCENT } } });
  ws1.columns = [{ width: 32 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 30 }];

  addTitle(ws1, 1, "Prevista — 5-Year Financial Projections", 7);
  addNote(ws1, 2, "Two revenue streams: Subscriptions (€14.90/mo) + Lead Generation (tiered annual trailing commission — 1.5% on investor capital ≤€500K, 1.0% above). Three acquisition channels: Organic SEO, Paid acquisition, Distribution Partnerships. Geographic expansion: 29 country engines (EU27 + UK + CH) rolled out across 5 years in greedy TAM-maximizing order. Addressable market grows from corridor unlocks as each new engine ships.", 7);

  let row = 4;
  addTitle(ws1, row, "Annual Revenue Summary — Base Scenario", 7);
  row++;
  ws1.getRow(row).values = ["Metric", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Notes"];
  styleHeader(ws1, row, 7);
  row++;

  const yearEndIndices = [11, 23, 35, 47, 59]; // 0-indexed for Month 12, 24, 36, 48, 60
  const yearData = yearEndIndices.map(i => baseData[i]);
  const yearRevenues = yearEndIndices.map((endIdx, yi) => {
    const startIdx = yi * 12;
    const slice = baseData.slice(startIdx, endIdx + 1);
    return {
      subRev: slice.reduce((s, d) => s + d.subMRR, 0),
      leadGenRev: slice.reduce((s, d) => s + d.leadGenMonthly, 0),
      totalRev: slice.reduce((s, d) => s + d.totalMRR, 0),
      totalCosts: slice.reduce((s, d) => s + d.totalCosts, 0),
    };
  });

  const summaryRows = [
    ["Country Engines Live (end of year)", ...yearData.map(d => d.countriesLive), "EU27 + UK + CH = 29 total"],
    ["Addressable Market", ...yearData.map(d => d.addressable), "Sum of bilateral pension corridors across live countries"],
    ["Cumulative Platform Signups", ...yearData.map(d => d.cumulativeSignups), "All channels combined"],
    ["Paying Subscribers (end of year)", ...yearData.map(d => d.totalPaidSubs), "After churn"],
    ["", "", "", "", "", "", ""],
    ["Subscription Revenue", ...yearRevenues.map(d => d.subRev), "€14.90/mo or €149/yr"],
    ["Lead Gen Revenue", ...yearRevenues.map(d => d.leadGenRev), "Tiered annual trailing: 1.5% ≤€500K / 1.0% >€500K"],
    ["Total Revenue", ...yearRevenues.map(d => d.totalRev), "Subscriptions + lead gen"],
    ["Total Costs (incl. paid acq.)", ...yearRevenues.map(d => d.totalCosts), "Operating + paid acquisition"],
    ["Net Income", ...yearRevenues.map(d => d.totalRev - d.totalCosts), ""],
    ["", "", "", "", "", "", ""],
    ["Subscription ARR (end of year)", ...yearData.map(d => d.subARR), "MRR × 12"],
    ["Total ARR (end of year)", ...yearData.map(d => d.totalARR), "Subscriptions + lead gen annualised"],
    ["Capital Under Referral", ...yearData.map(d => d.totalCapital), "Compounding asset base"],
    ["Cumulative Investors", ...yearData.map(d => d.cumulativeInvestors), "3% of all signups"],
  ];

  summaryRows.forEach(r => {
    ws1.getRow(row).values = r;
    if (r[0] === "") { row++; return; }
    for (let c = 2; c <= 6; c++) {
      const val = r[c];
      if (typeof val === "number") {
        if (r[0].includes("Market") || r[0].includes("Signups") || r[0].includes("Subscribers") || r[0].includes("Investors")) {
          ws1.getRow(row).getCell(c).numFmt = intFmt;
        } else {
          ws1.getRow(row).getCell(c).numFmt = currencyFmt;
        }
      }
    }
    // Highlight key rows
    if (r[0] === "Total Revenue") {
      highlightRow(ws1, row, 7, LIGHT_GREEN, GREEN);
    } else if (r[0] === "Net Income") {
      for (let c = 2; c <= 6; c++) {
        colorProfitLoss(ws1.getRow(row).getCell(c), r[c]);
        ws1.getRow(row).getCell(c).numFmt = currencyFmt;
      }
      ws1.getRow(row).getCell(1).font = boldFont;
    } else if (r[0] === "Total ARR (end of year)") {
      highlightRow(ws1, row, 7, LIGHT_ACCENT, DARK);
    } else if (r[0] === "Capital Under Referral") {
      highlightRow(ws1, row, 7, LIGHT_GOLD, GOLD);
    }
    row++;
  });
  styleDataRows(ws1, 6, row - 1, 7);
  // Re-apply highlights
  summaryRows.forEach((r, i) => {
    const rr = 6 + i;
    if (r[0] === "Total Revenue") highlightRow(ws1, rr, 7, LIGHT_GREEN, GREEN);
    else if (r[0] === "Total ARR (end of year)") highlightRow(ws1, rr, 7, LIGHT_ACCENT, DARK);
    else if (r[0] === "Capital Under Referral") highlightRow(ws1, rr, 7, LIGHT_GOLD, GOLD);
    else if (r[0] === "Net Income") {
      for (let c = 2; c <= 6; c++) {
        colorProfitLoss(ws1.getRow(rr).getCell(c), r[c]);
        ws1.getRow(rr).getCell(c).numFmt = currencyFmt;
      }
      ws1.getRow(rr).getCell(1).font = boldFont;
    }
  });

  // ── Upside comparison ──
  row += 2;
  addTitle(ws1, row, "Base vs Upside — Total ARR at Year End", 7);
  row++;
  ws1.getRow(row).values = ["Scenario", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", ""];
  styleHeader(ws1, row, 6);
  row++;

  const upsideYearData = yearEndIndices.map(i => upsideData[i]);
  ws1.getRow(row).values = ["Base", ...yearData.map(d => d.totalARR), ""];
  for (let c = 2; c <= 6; c++) ws1.getRow(row).getCell(c).numFmt = currencyFmt;
  ws1.getRow(row).getCell(1).font = boldFont;
  row++;
  ws1.getRow(row).values = ["Upside", ...upsideYearData.map(d => d.totalARR), ""];
  for (let c = 2; c <= 6; c++) ws1.getRow(row).getCell(c).numFmt = currencyFmt;
  ws1.getRow(row).getCell(1).font = boldFont;
  highlightRow(ws1, row, 6, LIGHT_GREEN, GREEN);
  row++;
  styleDataRows(ws1, row - 2, row - 1, 6);
  highlightRow(ws1, row - 1, 6, LIGHT_GREEN, GREEN);

  // ════════════════════════════════════════════════════════════════════
  // SHEET 2: FUNDING & CASH FLOW
  // ════════════════════════════════════════════════════════════════════
  const wsFunding = wb.addWorksheet("2. Funding & Cash Flow", { properties: { tabColor: { argb: PURPLE } } });
  wsFunding.columns = [
    { width: 32 }, { width: 16 }, { width: 16 }, { width: 16 },
    { width: 16 }, { width: 16 }, { width: 30 }
  ];

  addTitle(wsFunding, 1, "Funding Requirement, Use of Funds & Cash Flow", 7);
  addNote(wsFunding, 2, "Prevista operates in two phases: bootstrap (Months 1-6, organic only, no external funding) and accelerated growth (Month 7+, post-seed). The seed round unlocks paid acquisition and the BD co-founder's distribution partnerships channel. Country pension engines are built by the technical co-founder.", 7);

  // ── Phase overview ──
  row = 4;
  addTitle(wsFunding, row, "Two-Phase Approach", 7);
  row++;
  wsFunding.getRow(row).values = ["Phase", "Months", "Funding", "Channels Active", "Revenue Streams", "Purpose", ""];
  styleHeader(wsFunding, row, 6);
  row++;

  const phaseRows = [
    ["Phase 1: Bootstrap", "1-6", "€0 (self-funded)", "Organic only (SEO + community)", "Subscriptions + lead gen", "Validate funnel, prove conversion rates"],
    ["Phase 2: Accelerate", "7-60", "€230K seed", "Organic + Paid + Distribution Partnerships", "Subscriptions + lead gen", "Scale proven funnel, sign distribution partnerships, expand countries"],
  ];
  phaseRows.forEach(r => {
    wsFunding.getRow(row).values = r;
    for (let c = 1; c <= 6; c++) {
      wsFunding.getRow(row).getCell(c).border = thinBorder;
      wsFunding.getRow(row).getCell(c).font = bodyFont;
      wsFunding.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }
    wsFunding.getRow(row).height = 36;
    row++;
  });

  // ── What Phase 1 proves ──
  row += 1;
  addTitle(wsFunding, row, "Phase 1 Milestones (Months 1-6) — What We Prove Before Raising", 7);
  row++;
  wsFunding.getRow(row).values = ["Milestone", "Target", "Why It Matters", "", "", "", ""];
  styleHeader(wsFunding, row, 3);
  row++;

  const milestoneRows = [
    ["Calculator → email capture rate", "25-35%", "Proves the tool delivers enough value to earn an email"],
    ["Email → platform signup rate", "15-22%", "Proves the drip campaign and platform CTA work"],
    ["Signup → paid conversion", "8-12%", "Proves users see enough value to pay €14.90/mo"],
    ["Lead gen click-through rate", "25%+", "Proves users engage with product recommendations"],
    ["Monthly organic traffic growth", "8%+ MoM", "Proves SEO/content strategy is compounding"],
    ["First paying subscribers", "15-40", "Not about the number — about the conversion rates holding"],
  ];
  milestoneRows.forEach(r => {
    wsFunding.getRow(row).values = [r[0], r[1], r[2]];
    for (let c = 1; c <= 3; c++) {
      wsFunding.getRow(row).getCell(c).border = thinBorder;
      wsFunding.getRow(row).getCell(c).font = bodyFont;
      wsFunding.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }
    wsFunding.getRow(row).height = 24;
    row++;
  });

  // ── Seed round ──
  row += 1;
  addTitle(wsFunding, row, "Seed Round: €230K — Use of Funds", 7);
  row++;
  addNote(wsFunding, row, "Raised at Month 6 based on Phase 1 metrics. Deployed over 18-26 months. Capital arrives at Month 7. Country pension engines built by technical co-founder (no cash cost). BD co-founder works on equity (no salary line).", 7);
  row += 2;
  wsFunding.getRow(row).values = ["Category", "Amount", "When Deployed", "What It Buys", "Revenue Impact", "", ""];
  styleHeader(wsFunding, row, 5);
  row++;

  const fundingRows = [
    ["Paid acquisition", "€180,000", "Month 7-26 (€3K→€15K/mo ramp)", "~1,800 platform signups via Google/Facebook/LinkedIn ads", "~€27K additional subscription ARR + lead gen"],
    ["Content & SEO acceleration", "€50,000", "Month 7-18 (~€4K/mo)", "Professional content, landing pages per corridor, multi-language SEO", "3-5x organic traffic growth, compounds annually"],
    ["TOTAL", "€230,000", "", "", ""],
  ];

  fundingRows.forEach((r, i) => {
    wsFunding.getRow(row).values = r;
    for (let c = 1; c <= 5; c++) {
      wsFunding.getRow(row).getCell(c).border = thinBorder;
      wsFunding.getRow(row).getCell(c).font = i === fundingRows.length - 1 ? boldFont : bodyFont;
      wsFunding.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }
    if (i === fundingRows.length - 1) highlightRow(wsFunding, row, 5, LIGHT_ACCENT, DARK);
    wsFunding.getRow(row).height = 36;
    row++;
  });

  // ── Monthly cash flow ──
  row += 1;
  addTitle(wsFunding, row, "Monthly Cash Flow — Base Scenario", 7);
  row++;
  addNote(wsFunding, row, "Shows cash in (revenue + seed), cash out (costs + acquisition), and running cash balance. Seed of €230K arrives at Month 7.", 7);
  row += 2;

  wsFunding.getRow(row).values = ["Month", "Revenue", "Operating Costs", "Paid Acquisition", "Total Cash Out", "Net Cash Flow", "Cash Balance"];
  styleHeader(wsFunding, row, 7);
  row++;

  const SEED_AMOUNT = 230000;
  const SEED_MONTH = 7;
  let cashBalance = 0; // start with 0, founder self-funds Months 1-6

  // Show quarterly for readability (not all 60 months)
  for (let q = 0; q < 20; q++) { // 20 quarters = 5 years
    const qStart = q * 3;
    const qEnd = qStart + 3;
    const qData = baseData.slice(qStart, qEnd);
    const qRevenue = qData.reduce((s, d) => s + d.totalMRR, 0);
    const qOpCosts = qData.reduce((s, d) => s + d.totalOperatingCosts, 0);
    const qPaidAcq = qData.reduce((s, d) => s + d.paidAcqCost, 0);
    const qTotalOut = qOpCosts + qPaidAcq;

    // Seed arrives in the quarter that contains Month 7
    let seedInflow = 0;
    if (SEED_MONTH >= qStart + 1 && SEED_MONTH <= qStart + 3) {
      seedInflow = SEED_AMOUNT;
    }

    const qNetCash = qRevenue + seedInflow - qTotalOut;
    cashBalance += qNetCash;

    const yr = Math.floor(q / 4) + 1;
    const qNum = (q % 4) + 1;
    const label = `Y${yr} Q${qNum} (M${qStart+1}-${qStart+3})`;

    wsFunding.getRow(row).values = [
      label,
      qRevenue + seedInflow,
      qOpCosts,
      qPaidAcq,
      qTotalOut,
      qNetCash,
      cashBalance
    ];

    for (let c = 2; c <= 7; c++) wsFunding.getRow(row).getCell(c).numFmt = currencyFmt;

    // Color net cash flow
    colorProfitLoss(wsFunding.getRow(row).getCell(6), qNetCash);
    // Color cash balance
    if (cashBalance >= 0) {
      wsFunding.getRow(row).getCell(7).font = { bold: true, size: 11, name: "Calibri", color: { argb: GREEN } };
    } else {
      wsFunding.getRow(row).getCell(7).font = { bold: true, size: 11, name: "Calibri", color: { argb: RED } };
    }

    // Highlight seed quarter
    if (seedInflow > 0) {
      highlightRow(wsFunding, row, 7, LIGHT_PURPLE, PURPLE);
      wsFunding.getRow(row).getCell(2).value = qRevenue + seedInflow;
      wsFunding.getRow(row).getCell(2).numFmt = currencyFmt;
    }

    // Highlight year ends
    if (qNum === 4) {
      for (let c = 1; c <= 7; c++) {
        wsFunding.getRow(row).getCell(c).font = boldFont;
      }
    }

    for (let c = 1; c <= 7; c++) {
      wsFunding.getRow(row).getCell(c).border = thinBorder;
      wsFunding.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }

    row++;
  }

  // ── Key cash flow milestones ──
  row += 1;
  addTitle(wsFunding, row, "Key Cash Flow Milestones", 7);
  row++;

  // Find milestones
  let monthlyBECash = null;
  let peakBurn = 0;
  let peakBurnMonth = 0;
  let cumCash = 0;
  let cashBreakEven = null;
  const seedCash = SEED_AMOUNT;

  // Self-funded months 1-6
  for (let i = 0; i < 60; i++) {
    const d = baseData[i];
    const seedIn = (i + 1 === SEED_MONTH) ? seedCash : 0;
    cumCash += d.totalMRR + seedIn - d.totalCosts;

    if (d.netIncome >= 0 && !monthlyBECash) monthlyBECash = i + 1;

    // Track lowest cash point (peak burn)
    if (cumCash < peakBurn) {
      peakBurn = cumCash;
      peakBurnMonth = i + 1;
    }
  }

  // Cash runway
  const avgMonthlyBurn = baseData.slice(6, 18).reduce((s, d) => s + Math.max(0, d.totalCosts - d.totalMRR), 0) / 12;
  const runwayMonths = avgMonthlyBurn > 0 ? Math.round(seedCash / avgMonthlyBurn) : 999;

  wsFunding.getRow(row).values = ["Milestone", "Value", "Notes", "", "", "", ""];
  styleSubHeader(wsFunding, row, 3);
  row++;

  const cashMilestones = [
    ["Seed round amount", `€${SEED_AMOUNT.toLocaleString()}`, "Raised based on Phase 1 (Months 1-6) metrics"],
    ["Seed arrives", `Month ${SEED_MONTH}`, "Start of Phase 2 (accelerated growth)"],
    ["Pre-seed self-funding (Months 1-6)", `€${Math.round(baseData.slice(0,6).reduce((s,d) => s + d.totalCosts - d.totalMRR, 0)).toLocaleString()}`, "Operating costs minus revenue during bootstrap phase"],
    ["Average monthly net burn (Months 7-18)", `€${Math.round(avgMonthlyBurn).toLocaleString()}/mo`, "After seed, including paid acquisition ramp"],
    ["Cash runway from seed", `~${runwayMonths} months`, "Months of operation the seed covers at avg burn rate"],
    ["Monthly break-even", monthlyBECash ? `Month ${monthlyBECash}` : "Not in 60 months", "When monthly revenue exceeds monthly costs"],
    ["Lowest cash point", `€${Math.round(peakBurn).toLocaleString()} (Month ${peakBurnMonth})`, "Maximum cumulative cash deficit"],
  ];

  cashMilestones.forEach(r => {
    wsFunding.getRow(row).values = [r[0], r[1], r[2]];
    for (let c = 1; c <= 3; c++) {
      wsFunding.getRow(row).getCell(c).border = thinBorder;
      wsFunding.getRow(row).getCell(c).font = boldFont;
      wsFunding.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }
    wsFunding.getRow(row).height = 28;
    row++;
  });

  // ── What happens without funding ──
  row += 1;
  addTitle(wsFunding, row, "What Happens Without Funding (Organic Only)", 7);
  row++;
  addNote(wsFunding, row, "If the seed round is not raised, the business continues on organic-only growth. No paid acquisition budget, no professional content/SEO push, BD co-founder still works but with smaller pipeline. The model still works — it just grows much slower.", 7);
  row += 2;

  // Calculate organic-only Year 1-3 from base data but zeroing paid/partnership
  // We can approximate: organic signups from baseData months 1-6 extrapolated
  const organicOnlyY1Subs = baseData[5].totalPaidSubs; // Month 6 is pure organic
  const organicOnlyY1ARR = baseData[5].subARR;
  wsFunding.getRow(row).values = ["Metric", "With Seed (Base)", "Without Seed (Organic Only)", "Difference", "", "", ""];
  styleHeader(wsFunding, row, 4);
  row++;

  const withSeedY3 = baseData[35];
  const withSeedY3Rev = baseData.slice(0, 36).reduce((s, d) => s + d.totalMRR, 0);

  // Organic-only rough estimate: Month 6 run rate × 30 months of compounding at organic growth rate
  const organicOnlyY3Subs = Math.round(organicOnlyY1Subs * Math.pow(1.08, 30));
  const organicOnlyY3ARR = Math.round(organicOnlyY3Subs * PRICE_MONTHLY * 12);

  const comparisonRows = [
    ["Year 3 paying subscribers", withSeedY3.totalPaidSubs, organicOnlyY3Subs, withSeedY3.totalPaidSubs - organicOnlyY3Subs],
    ["Year 3 ARR", withSeedY3.totalARR, organicOnlyY3ARR, withSeedY3.totalARR - organicOnlyY3ARR],
    ["Countries supported by Year 3", `${withSeedY3.countriesLive} (V6 schedule)`, "5-7 (slower build)", `${withSeedY3.countriesLive - 6} more countries`],
  ];
  comparisonRows.forEach(r => {
    wsFunding.getRow(row).values = [r[0], r[1], r[2], r[3]];
    for (let c = 1; c <= 4; c++) {
      wsFunding.getRow(row).getCell(c).border = thinBorder;
      wsFunding.getRow(row).getCell(c).font = bodyFont;
      wsFunding.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }
    if (typeof r[1] === "number" && r[0].includes("ARR")) {
      for (let c = 2; c <= 4; c++) wsFunding.getRow(row).getCell(c).numFmt = currencyFmt;
    } else if (typeof r[1] === "number") {
      for (let c = 2; c <= 4; c++) wsFunding.getRow(row).getCell(c).numFmt = intFmt;
    }
    row++;
  });
  styleDataRows(wsFunding, row - comparisonRows.length, row - 1, 4);

  // ════════════════════════════════════════════════════════════════════
  // SHEET 2.5: ENGINE SCHEDULE (geographic expansion roadmap)
  // ════════════════════════════════════════════════════════════════════
  const wsEng = wb.addWorksheet("2b. Engine Schedule", { properties: { tabColor: { argb: ACCENT } } });
  wsEng.columns = [
    { width: 8 },   // #
    { width: 10 },  // Month
    { width: 6 },   // Code
    { width: 24 },  // Country
    { width: 10 },  // Year
    { width: 18 },  // New corridors unlocked
    { width: 16 },  // Cumulative TAM after launch
  ];

  addTitle(wsEng, 1, "Geographic Expansion — Engine Rollout Schedule", 7);
  addNote(wsEng, 2, "Country pension engines deployed in greedy TAM-maximizing order. Each new engine unlocks all bilateral corridors with already-supported countries. V6 pace: 3 live at launch (LU/FR/CH), 4 added in Year 1 (PT/ES/UK/IT, quarterly), 6 in Year 2, 6 in Year 3, 6 in Year 4, 4 in Year 5. End-state: 29 countries (EU27 + UK + CH) by Month 58.", 7);

  row = 4;
  wsEng.getRow(row).values = ["#", "Month", "Code", "Country", "Year", "New Corridors", "Cumulative TAM"];
  styleHeader(wsEng, row, 7);
  row++;

  const COUNTRY_NAMES = {
    LU:"Luxembourg", PT:"Portugal", FR:"France", ES:"Spain", DE:"Germany",
    PL:"Poland", RO:"Romania", IT:"Italy", UK:"United Kingdom", CH:"Switzerland",
    BE:"Belgium", NL:"Netherlands", AT:"Austria", HU:"Hungary", IE:"Ireland",
    HR:"Croatia", BG:"Bulgaria", GR:"Greece", CZ:"Czechia", SK:"Slovakia",
    LT:"Lithuania", LV:"Latvia", SI:"Slovenia", SE:"Sweden", DK:"Denmark",
    FI:"Finland", CY:"Cyprus", EE:"Estonia", MT:"Malta",
  };

  // Identify the last engine of each year (for year-boundary highlights).
  // V6 doesn't have engines landing exactly on M12/24/36/48/60, so we
  // highlight the last engine that ships in each year window instead.
  const lastEngineOfYearIdx = new Set();
  [12, 24, 36, 48, 60].forEach(monthEnd => {
    let lastIdx = -1;
    ENGINE_SCHEDULE.forEach((e, i) => {
      if (e.month <= monthEnd) lastIdx = i;
    });
    if (lastIdx >= 0) lastEngineOfYearIdx.add(lastIdx);
  });

  // Walk the schedule and compute cumulative TAM after each addition
  ENGINE_SCHEDULE.forEach((engine, idx) => {
    const liveBefore = ENGINE_SCHEDULE.slice(0, idx);
    const liveAfter = ENGINE_SCHEDULE.slice(0, idx + 1);

    // Count new corridors unlocked by this addition
    let newCorridors = 0;
    let newCorridorPop = 0;
    liveBefore.forEach(prev => {
      const key = [prev.code, engine.code].sort().join("-");
      const pop = CORRIDORS[key] || 0;
      if (pop > 0) {
        newCorridors++;
        newCorridorPop += pop;
      }
    });

    // Cumulative TAM = sum of all corridor pairs in liveAfter (full ramp, theoretical max)
    let cumTAM = 0;
    for (let i = 0; i < liveAfter.length; i++) {
      for (let j = i + 1; j < liveAfter.length; j++) {
        const key = [liveAfter[i].code, liveAfter[j].code].sort().join("-");
        cumTAM += CORRIDORS[key] || 0;
      }
    }

    const yr = Math.ceil(engine.month / 12);
    wsEng.getRow(row).values = [
      idx + 1,
      `M${engine.month}`,
      engine.code,
      COUNTRY_NAMES[engine.code] || engine.code,
      `Y${yr}`,
      newCorridors > 0 ? `${newCorridors} new (€${Math.round(newCorridorPop/1000)}K addressable)` : "—",
      cumTAM,
    ];
    wsEng.getRow(row).getCell(7).numFmt = intFmt;
    for (let c = 1; c <= 7; c++) {
      wsEng.getRow(row).getCell(c).border = thinBorder;
      wsEng.getRow(row).getCell(c).font = bodyFont;
      wsEng.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }
    // Highlight launch / pre-seed rows (M1-M6)
    if (engine.month <= 6) {
      highlightRow(wsEng, row, 7, LIGHT_ACCENT, DARK);
    }
    // Year-end highlights — last engine added in each year window
    if (lastEngineOfYearIdx.has(idx)) {
      highlightRow(wsEng, row, 7, LIGHT_GREEN, GREEN);
    }
    row++;
  });

  // Summary by year
  row += 1;
  addTitle(wsEng, row, "Engines Live by End of Each Year", 7);
  row++;
  wsEng.getRow(row).values = ["Year", "Engines Live (cumulative)", "New This Year", "Cumulative TAM (theoretical max)", "", "", ""];
  styleHeader(wsEng, row, 4);
  row++;
  let prevCount = 0;
  [12, 24, 36, 48, 60].forEach((monthEnd, i) => {
    const live = ENGINE_SCHEDULE.filter(e => e.month <= monthEnd);
    let cumTAM = 0;
    for (let a = 0; a < live.length; a++) {
      for (let b = a + 1; b < live.length; b++) {
        const key = [live[a].code, live[b].code].sort().join("-");
        cumTAM += CORRIDORS[key] || 0;
      }
    }
    wsEng.getRow(row).values = [`Y${i + 1}`, live.length, live.length - prevCount, cumTAM, "", "", ""];
    wsEng.getRow(row).getCell(4).numFmt = intFmt;
    for (let c = 1; c <= 4; c++) {
      wsEng.getRow(row).getCell(c).border = thinBorder;
      wsEng.getRow(row).getCell(c).font = boldFont;
      wsEng.getRow(row).getCell(c).alignment = { vertical: "middle" };
    }
    prevCount = live.length;
    row++;
  });

  // ════════════════════════════════════════════════════════════════════
  // SHEET 3: MONTHLY MODEL (BASE) (was Sheet 2)
  // ════════════════════════════════════════════════════════════════════
  const ws2 = wb.addWorksheet("3. Monthly Model (Base)", { properties: { tabColor: { argb: GREEN } } });
  const monthCols = [
    { width: 8 },  // Month
    { width: 9 },  // Countries
    { width: 14 }, // Addressable
    { width: 12 }, // Organic Signups
    { width: 12 }, // Paid Signups
    { width: 12 }, // Active Partners
    { width: 12 }, // Partner Signups
    { width: 12 }, // Total Signups
    { width: 13 }, // Cum Signups
    { width: 10 }, // New Paid
    { width: 10 }, // Churned
    { width: 10 }, // Total Subs
    { width: 12 }, // Sub MRR
    { width: 12 }, // Lead Gen MRR
    { width: 12 }, // Total MRR
    { width: 13 }, // Cum Revenue
    { width: 7 },  // FTEs
    { width: 12 }, // Salary Cost
    { width: 12 }, // Total Costs
    { width: 12 }, // Net Income
    { width: 13 }, // Cum Net
    { width: 14 }, // Capital Under Ref
  ];
  ws2.columns = monthCols;

  addTitle(ws2, 1, "60-Month Revenue Model — Base Scenario", 22);
  addNote(ws2, 2, "Three acquisition channels (organic / paid / distribution partnerships) × two revenue streams (subscriptions + lead gen). Paid acquisition and partnerships both start Month 7 post-seed. Addressable market grows as country engines come online (see Engine Schedule sheet). Team hiring ramp begins M28 — 10 months after monthly break-even (M18) — funded from operating cashflow, leaving buffer to confirm the funnel is durable before adding payroll. Co-founders on equity excluded.", 22);

  row = 4;
  ws2.getRow(row).values = [
    "Mo", "Countries", "Addressable", "Organic\nSignups", "Paid\nSignups", "Active\nPartners", "Partner\nSignups", "Total\nSignups",
    "Cum\nSignups",
    "New\nPaid", "Churned", "Total\nSubs",
    "Sub\nMRR", "LeadGen\nMRR", "Total\nMRR",
    "Cum\nRevenue",
    "FTEs", "Salary\nCost",
    "Total\nCosts", "Net\nIncome",
    "Cum\nNet",
    "Capital\nUnder Ref"
  ];
  styleHeader(ws2, row, 22);
  row++;

  baseData.forEach(d => {
    ws2.getRow(row).values = [
      d.month, d.countriesLive, d.addressable, d.organicSignups, d.paidSignups, d.activePartners, d.partnerSignups, d.totalNewSignups,
      d.cumulativeSignups,
      d.newPaid, d.churned, d.totalPaidSubs,
      d.subMRR, d.leadGenMonthly, d.totalMRR,
      d.cumulativeTotalRevenue,
      d.activeFtes, d.salaryCost,
      d.totalCosts, d.netIncome,
      d.cumulativeNet,
      d.totalCapital
    ];
    // Integer cols: Countries, Addressable, Organic, Paid, Partners, PartnerSignups, Total, CumSignups, NewPaid, Churned, TotalSubs, FTEs
    [2,3,4,5,6,7,8,9,10,11,12,17].forEach(c => ws2.getRow(row).getCell(c).numFmt = intFmt);
    // Currency cols: SubMRR, LeadGenMRR, TotalMRR, CumRevenue, SalaryCost, TotalCosts, NetIncome, CumNet, CapitalUnderRef
    [13,14,15,16,18,19,20,21,22].forEach(c => ws2.getRow(row).getCell(c).numFmt = currencyFmt);

    // Highlight year ends
    if (d.month % 12 === 0) {
      highlightRow(ws2, row, 22, LIGHT_GREEN, GREEN);
    }
    row++;
  });
  styleDataRows(ws2, 5, row - 1, 22);
  // Re-apply year-end highlights
  baseData.forEach((d, i) => {
    if (d.month % 12 === 0) highlightRow(ws2, 5 + i, 22, LIGHT_GREEN, GREEN);
  });

  // ════════════════════════════════════════════════════════════════════
  // SHEET 3: REVENUE STREAMS BREAKDOWN
  // ════════════════════════════════════════════════════════════════════
  const ws3 = wb.addWorksheet("4. Revenue Streams", { properties: { tabColor: { argb: ORANGE } } });
  ws3.columns = [
    { width: 28 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 24 }
  ];

  addTitle(ws3, 1, "Revenue Streams — Detailed Annual Breakdown", 7);

  // ── Subscriptions ──
  row = 3;
  addTitle(ws3, row, "Stream 1: Subscriptions (€14.90/mo / €149/yr)", 7);
  row++;
  ws3.getRow(row).values = ["Metric", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Notes"];
  styleHeader(ws3, row, 7);
  row++;

  const subMetrics = [
    ["New signups (organic)", ...yearEndIndices.map((_, yi) => baseData.slice(yi*12, (yi+1)*12).reduce((s,d) => s + d.organicSignups, 0)), "SEO + community"],
    ["New signups (paid)", ...yearEndIndices.map((_, yi) => baseData.slice(yi*12, (yi+1)*12).reduce((s,d) => s + d.paidSignups, 0)), "Google/Facebook/LinkedIn ads"],
    ["New signups (partnerships)", ...yearEndIndices.map((_, yi) => baseData.slice(yi*12, (yi+1)*12).reduce((s,d) => s + d.partnerSignups, 0)), "Corporate HR, expat associations, content partners"],
    ["Total new signups", ...yearEndIndices.map((_, yi) => baseData.slice(yi*12, (yi+1)*12).reduce((s,d) => s + d.totalNewSignups, 0)), "All channels"],
    ["New paid subscribers", ...yearEndIndices.map((_, yi) => baseData.slice(yi*12, (yi+1)*12).reduce((s,d) => s + d.newPaid, 0)), `${SCENARIOS.base.paidConversion*100}% conversion`],
    ["Churned subscribers", ...yearEndIndices.map((_, yi) => baseData.slice(yi*12, (yi+1)*12).reduce((s,d) => s + d.churned, 0)), `${SCENARIOS.base.monthlyChurn*100}% initial churn`],
    ["Ending subscribers", ...yearData.map(d => d.totalPaidSubs), "After churn"],
    ["Annual subscription revenue", ...yearRevenues.map(d => d.subRev), "Sum of monthly MRR"],
    ["Subscription ARR (end)", ...yearData.map(d => d.subARR), "End-of-year MRR × 12"],
  ];

  subMetrics.forEach(r => {
    ws3.getRow(row).values = r;
    for (let c = 2; c <= 6; c++) {
      ws3.getRow(row).getCell(c).numFmt = r[0].includes("revenue") || r[0].includes("ARR") ? currencyFmt : intFmt;
    }
    if (r[0].includes("ARR")) highlightRow(ws3, row, 7, LIGHT_ACCENT, DARK);
    row++;
  });
  styleDataRows(ws3, row - subMetrics.length, row - 1, 7);
  // Re-apply ARR highlight
  subMetrics.forEach((r, i) => {
    if (r[0].includes("ARR")) highlightRow(ws3, row - subMetrics.length + i, 7, LIGHT_ACCENT, DARK);
  });

  // ── Lead Gen ──
  row += 2;
  addTitle(ws3, row, "Stream 2: Lead Generation (tiered trailing: 1.5% ≤€500K / 1.0% >€500K)", 7);
  row++;
  ws3.getRow(row).values = ["Metric", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Notes"];
  styleHeader(ws3, row, 7);
  row++;

  const leadMetrics = [
    ["New investors (3% of signups)", ...yearEndIndices.map((_, yi) => baseData.slice(yi*12, (yi+1)*12).reduce((s,d) => s + d.newInvestors, 0)), "80% gap × 25% click × 15% invest"],
    ["Cumulative investors", ...yearData.map(d => d.cumulativeInvestors), "Investors rarely leave"],
    ["New capital placed (year)", ...yearEndIndices.map((_, yi) => {
      const slice = baseData.slice(yi*12, (yi+1)*12);
      return slice.reduce((s,d) => s + d.newInvestors, 0) * AVG_CAPITAL_INVESTED;
    }), `€${(AVG_CAPITAL_INVESTED/1000).toFixed(0)}K avg investment`],
    ["Total capital under referral", ...yearData.map(d => d.totalCapital), "Compounds at 5%/yr"],
    ["Annual lead gen revenue", ...yearRevenues.map(d => d.leadGenRev), "Tiered trailing: 1.5% ≤€500K / 1.0% >€500K"],
    ["Lead gen as % of total revenue", ...yearRevenues.map((d, i) => d.totalRev > 0 ? d.leadGenRev / d.totalRev : 0), "Grows over time"],
  ];

  leadMetrics.forEach(r => {
    ws3.getRow(row).values = r;
    for (let c = 2; c <= 6; c++) {
      if (r[0].includes("%")) {
        ws3.getRow(row).getCell(c).numFmt = pctFmt;
      } else if (r[0].includes("capital") || r[0].includes("revenue")) {
        ws3.getRow(row).getCell(c).numFmt = currencyFmt;
      } else {
        ws3.getRow(row).getCell(c).numFmt = intFmt;
      }
    }
    if (r[0].includes("Total capital")) highlightRow(ws3, row, 7, LIGHT_GOLD, GOLD);
    row++;
  });
  styleDataRows(ws3, row - leadMetrics.length, row - 1, 7);
  leadMetrics.forEach((r, i) => {
    if (r[0].includes("Total capital")) highlightRow(ws3, row - leadMetrics.length + i, 7, LIGHT_GOLD, GOLD);
  });

  // ── Distribution Partnerships (channel detail) ──
  row += 2;
  addTitle(ws3, row, "Channel 3: Distribution Partnerships — Detail", 7);
  row++;
  addNote(ws3, row, "BD co-founder owns this channel from day 1. Each active partnership (corporate HR deal, expat association, content partner, mobility consultancy) yields a steady stream of consumer signups. First deals close post-seed.", 7);
  row += 2;
  ws3.getRow(row).values = ["Metric", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Notes"];
  styleHeader(ws3, row, 7);
  row++;

  const partnerMetrics = [
    ["Active partnerships (end of year)", ...yearData.map(d => d.activePartners), "Cumulative live deals"],
    ["Signups via partnerships (year)", ...yearEndIndices.map((_, yi) => baseData.slice(yi*12, (yi+1)*12).reduce((s,d) => s + d.partnerSignups, 0)), `${SCENARIOS.base.signupsPerPartnerPerMonth}/mo per active partnership`],
    ["Partnership share of total signups", ...yearEndIndices.map((_, yi) => {
      const slice = baseData.slice(yi*12, (yi+1)*12);
      const tot = slice.reduce((s,d) => s + d.totalNewSignups, 0);
      const part = slice.reduce((s,d) => s + d.partnerSignups, 0);
      return tot > 0 ? part / tot : 0;
    }), "Validates BD co-founder channel weight"],
  ];

  partnerMetrics.forEach(r => {
    ws3.getRow(row).values = r;
    for (let c = 2; c <= 6; c++) {
      if (r[0].includes("share")) {
        ws3.getRow(row).getCell(c).numFmt = pctFmt;
      } else {
        ws3.getRow(row).getCell(c).numFmt = intFmt;
      }
    }
    if (r[0].includes("Active partnerships")) highlightRow(ws3, row, 7, LIGHT_PURPLE, PURPLE);
    row++;
  });
  styleDataRows(ws3, row - partnerMetrics.length, row - 1, 7);
  partnerMetrics.forEach((r, i) => {
    if (r[0].includes("Active partnerships")) highlightRow(ws3, row - partnerMetrics.length + i, 7, LIGHT_PURPLE, PURPLE);
  });

  // ════════════════════════════════════════════════════════════════════
  // SHEET 4: P&L
  // ════════════════════════════════════════════════════════════════════
  const ws4 = wb.addWorksheet("5. P&L (Base)", { properties: { tabColor: { argb: PURPLE } } });
  ws4.columns = [
    { width: 24 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }
  ];

  addTitle(ws4, 1, "Profit & Loss — Base Scenario (Annual)", 7);
  addNote(ws4, 2, "Co-founder salaries excluded (technical + BD co-founders both work on equity through Series A). Team line reflects post-break-even FTE ramp — first hire at M28 (10 months after monthly BE at M18, leaving buffer to confirm funnel durability). Funded from operating cashflow, not from the €230K seed.", 7);

  row = 4;
  addTitle(ws4, row, "Annual P&L", 7);
  row++;
  ws4.getRow(row).values = ["", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "5-Year Total"];
  styleHeader(ws4, row, 7);
  row++;

  // Revenue section
  const yearCosts = yearEndIndices.map((_, yi) => {
    const slice = baseData.slice(yi*12, (yi+1)*12);
    return {
      infra: slice.reduce((s,d) => s + d.infraCost, 0),
      ai: slice.reduce((s,d) => s + d.aiCost, 0),
      marketing: slice.reduce((s,d) => s + d.marketingCost, 0),
      support: slice.reduce((s,d) => s + d.supportCost, 0),
      legal: slice.reduce((s,d) => s + d.legalCost, 0),
      misc: slice.reduce((s,d) => s + d.miscCost, 0),
      team: slice.reduce((s,d) => s + d.salaryCost, 0),
      paidAcq: slice.reduce((s,d) => s + d.paidAcqCost, 0),
      endFtes: slice[slice.length - 1].activeFtes,
    };
  });

  const sumOpex = (yc) => yc.infra + yc.ai + yc.marketing + yc.support + yc.legal + yc.misc + yc.team;
  const sumAllCosts = (yc) => sumOpex(yc) + yc.paidAcq;

  const plRows = [
    { label: "REVENUE", values: null, style: "subheader" },
    { label: "  Subscription revenue", values: yearRevenues.map(d => d.subRev) },
    { label: "  Lead gen revenue", values: yearRevenues.map(d => d.leadGenRev) },
    { label: "Total Revenue", values: yearRevenues.map(d => d.totalRev), style: "total_green" },
    { label: "", values: null, style: "spacer" },
    { label: "OPERATING COSTS", values: null, style: "subheader" },
    { label: "  Infrastructure", values: yearCosts.map(d => d.infra) },
    { label: "  AI API", values: yearCosts.map(d => d.ai) },
    { label: "  Content & SEO", values: yearCosts.map(d => d.marketing) },
    { label: "  Support", values: yearCosts.map(d => d.support) },
    { label: "  Legal / Compliance", values: yearCosts.map(d => d.legal) },
    { label: "  Miscellaneous", values: yearCosts.map(d => d.misc) },
    { label: "  Team (post-break-even FTEs)", values: yearCosts.map(d => d.team) },
    { label: "  FTEs at year-end", values: yearCosts.map(d => d.endFtes), style: "int_plain" },
    { label: "Total Operating Costs", values: yearCosts.map(sumOpex), style: "total_orange" },
    { label: "", values: null, style: "spacer" },
    { label: "ACQUISITION COSTS", values: null, style: "subheader" },
    { label: "  Paid acquisition budget", values: yearCosts.map(d => d.paidAcq) },
    { label: "Total Acquisition Costs", values: yearCosts.map(d => d.paidAcq), style: "total_orange" },
    { label: "", values: null, style: "spacer" },
    { label: "TOTAL COSTS", values: yearCosts.map(sumAllCosts), style: "total_orange" },
    { label: "", values: null, style: "spacer" },
    { label: "NET INCOME", values: yearRevenues.map((d, i) => d.totalRev - sumAllCosts(yearCosts[i])), style: "profit_loss" },
    { label: "Margin", values: yearRevenues.map((d, i) => d.totalRev > 0 ? (d.totalRev - sumAllCosts(yearCosts[i])) / d.totalRev : 0), style: "pct" },
    { label: "Cumulative Net Income", values: (() => {
      let cum = 0;
      return yearRevenues.map((d, i) => {
        cum += d.totalRev - sumAllCosts(yearCosts[i]);
        return cum;
      });
    })(), style: "profit_loss" },
  ];

  plRows.forEach(r => {
    if (r.style === "spacer") { row++; return; }
    if (r.style === "subheader") {
      ws4.getRow(row).values = [r.label, "", "", "", "", "", ""];
      styleSubHeader(ws4, row, 7);
      row++;
      return;
    }

    // For FTE headcount rows, the "5-year total" is nonsensical as a sum —
    // show the end-state headcount instead.
    const fiveYearTotal = r.values
      ? (r.style === "int_plain" ? r.values[r.values.length - 1] : r.values.reduce((s, v) => s + v, 0))
      : 0;
    ws4.getRow(row).values = [r.label, ...(r.values || []), r.values ? fiveYearTotal : ""];

    if (r.values) {
      for (let c = 2; c <= 7; c++) {
        if (r.style === "pct") {
          ws4.getRow(row).getCell(c).numFmt = pctFmt;
        } else if (r.style === "int_plain") {
          ws4.getRow(row).getCell(c).numFmt = intFmt;
        } else {
          ws4.getRow(row).getCell(c).numFmt = currencyFmt;
        }
      }
    }

    if (r.style === "total_green") highlightRow(ws4, row, 7, LIGHT_GREEN, GREEN);
    else if (r.style === "total_orange") highlightRow(ws4, row, 7, LIGHT_ORANGE, ORANGE);
    else if (r.style === "profit_loss") {
      ws4.getRow(row).getCell(1).font = boldFont;
      for (let c = 2; c <= 7; c++) {
        colorProfitLoss(ws4.getRow(row).getCell(c), r.values[Math.min(c-2, r.values.length-1)]);
        ws4.getRow(row).getCell(c).numFmt = currencyFmt;
      }
    }

    for (let c = 1; c <= 7; c++) {
      ws4.getRow(row).getCell(c).border = thinBorder;
    }

    row++;
  });

  // ════════════════════════════════════════════════════════════════════
  // SHEET 5: UNIT ECONOMICS
  // ════════════════════════════════════════════════════════════════════
  const ws5 = wb.addWorksheet("6. Unit Economics", { properties: { tabColor: { argb: GOLD } } });
  ws5.columns = [{ width: 36 }, { width: 18 }, { width: 18 }, { width: 40 }];

  addTitle(ws5, 1, "User Economics & LTV Analysis", 4);
  addNote(ws5, 2, "Demonstrates positive unit economics: every user type has positive expected value.", 4);

  row = 4;
  addTitle(ws5, row, "Subscription LTV", 4);
  row++;
  ws5.getRow(row).values = ["Metric", "Value", "", "Rationale"];
  styleHeader(ws5, row, 4);
  row++;

  const avgChurn = SCENARIOS.base.monthlyChurn;
  const avgLifetimeMonths = Math.round(1 / avgChurn);
  const subLTV = Math.round(avgLifetimeMonths * PRICE_MONTHLY);

  const ltvRows = [
    ["Monthly subscription price", PRICE_MONTHLY, currencyFmt2, "€14.90/month confirmed"],
    ["Monthly churn rate", avgChurn, pctFmt, "SaaS benchmark — Recurly 2025 finance category median: 3.7%"],
    ["Average subscriber lifetime", avgLifetimeMonths, intFmt, "1 / churn rate (months)"],
    ["Subscription LTV", subLTV, currencyFmt, "Price × lifetime"],
  ];

  ltvRows.forEach(r => {
    ws5.getRow(row).values = [r[0], r[1], "", r[3]];
    ws5.getRow(row).getCell(2).numFmt = r[2];
    if (r[0] === "Subscription LTV") highlightRow(ws5, row, 4, LIGHT_GREEN, GREEN);
    row++;
  });
  styleDataRows(ws5, row - ltvRows.length, row - 1, 4);
  highlightRow(ws5, row - 1, 4, LIGHT_GREEN, GREEN);

  // Lead gen LTV
  row += 2;
  addTitle(ws5, row, "Lead Generation LTV", 4);
  row++;
  ws5.getRow(row).values = ["Metric", "Value", "", "Rationale"];
  styleHeader(ws5, row, 4);
  row++;

  // Lead gen LTV uses the tiered commission rate applied to the investor's
  // compounding capital over the 10-year holding period. For avg €50K invested
  // at 5% growth, the balance stays inside the 1.5% tier for the full period.
  const HOLDING_YEARS = 10;
  let investorLTV = 0;
  let capitalAtYear = AVG_CAPITAL_INVESTED;
  for (let y = 0; y < HOLDING_YEARS; y++) {
    investorLTV += capitalAtYear * commissionRate(capitalAtYear);
    capitalAtYear *= (1 + CAPITAL_ANNUAL_GROWTH);
  }
  const avgInvestorRate = commissionRate(AVG_CAPITAL_INVESTED);
  const perUserLeadGenLTV = Math.round(LEAD_GEN_EFFECTIVE * investorLTV * 100) / 100;

  const leadLtvRows = [
    ["% of users with retirement gap", LEAD_GEN_GAP_PCT, pctFmt, "Inherent to multi-country career profiles"],
    ["% who click product offer", LEAD_GEN_CLICK_PCT, pctFmt, "High-intent context (viewing their gap)"],
    ["% who invest via referral", LEAD_GEN_INVEST_PCT, pctFmt, "Qualified financial product conversion"],
    ["Effective conversion (all users)", LEAD_GEN_EFFECTIVE, pctFmt, "80% × 25% × 15% = 3%"],
    ["Average capital invested", AVG_CAPITAL_INVESTED, currencyFmt, "Target demo: 45-65, LU income levels"],
    ["Commission tier applied", avgInvestorRate, pctFmt, "€0–500K: 1.5% / €500K+: 1.0% — per-investor"],
    ["Annual commission per investor (Y1)", AVG_CAPITAL_INVESTED * avgInvestorRate, currencyFmt2, "Tiered trailing × invested capital"],
    ["Average holding period", `${HOLDING_YEARS}+ years`, null, "Pension/retirement products are long-duration"],
    ["Lead gen LTV per investor", Math.round(investorLTV), currencyFmt, "Σ (capital_y × tier_rate_y) over holding period"],
    ["Lead gen LTV per platform user", perUserLeadGenLTV, currencyFmt2, "3% conversion × investor LTV"],
  ];

  leadLtvRows.forEach(r => {
    ws5.getRow(row).values = [r[0], r[1], "", r[3]];
    if (r[2]) ws5.getRow(row).getCell(2).numFmt = r[2];
    if (r[0].includes("per platform")) highlightRow(ws5, row, 4, LIGHT_GOLD, GOLD);
    row++;
  });
  styleDataRows(ws5, row - leadLtvRows.length, row - 1, 4);
  highlightRow(ws5, row - 1, 4, LIGHT_GOLD, GOLD);

  // Combined user value
  row += 2;
  addTitle(ws5, row, "Combined User Value", 4);
  row++;
  ws5.getRow(row).values = ["User Type", "Sub LTV", "Lead Gen LTV", "Total LTV"];
  styleHeader(ws5, row, 4);
  row++;

  const combinedRows = [
    ["Free user (never subscribes)", 0, perUserLeadGenLTV, perUserLeadGenLTV],
    ["Paid subscriber (doesn't invest)", subLTV, perUserLeadGenLTV, subLTV + perUserLeadGenLTV],
    ["Paid subscriber who invests", subLTV, Math.round(investorLTV), subLTV + Math.round(investorLTV)],
  ];

  combinedRows.forEach(r => {
    ws5.getRow(row).values = r;
    for (let c = 2; c <= 4; c++) ws5.getRow(row).getCell(c).numFmt = currencyFmt;
    row++;
  });
  styleDataRows(ws5, row - combinedRows.length, row - 1, 4);

  // CAC analysis
  row += 2;
  addTitle(ws5, row, "CAC Analysis", 4);
  row++;
  ws5.getRow(row).values = ["Metric", "Value", "", "Notes"];
  styleHeader(ws5, row, 4);
  row++;

  const blendedLTV = SCENARIOS.base.paidConversion * subLTV + perUserLeadGenLTV;
  const cacRows = [
    ["Blended CAC (paid channel)", SCENARIOS.base.blendedCAC, currencyFmt, "Google/Facebook/LinkedIn ads"],
    ["Blended LTV per signup", Math.round(blendedLTV), currencyFmt, `${(SCENARIOS.base.paidConversion*100)}% × €${subLTV} sub LTV + €${perUserLeadGenLTV.toFixed(2)} lead gen`],
    ["LTV:CAC ratio", Math.round(blendedLTV / SCENARIOS.base.blendedCAC * 10) / 10, "0.0x", "Target: >3x for healthy SaaS"],
    ["Payback period (months)", Math.round(SCENARIOS.base.blendedCAC / (SCENARIOS.base.paidConversion * PRICE_MONTHLY)), intFmt, "Months to recover CAC from subscription alone"],
  ];

  cacRows.forEach(r => {
    ws5.getRow(row).values = [r[0], r[1], "", r[3]];
    if (r[2]) ws5.getRow(row).getCell(2).numFmt = r[2];
    if (r[0].includes("LTV:CAC")) highlightRow(ws5, row, 4, LIGHT_GREEN, GREEN);
    row++;
  });
  styleDataRows(ws5, row - cacRows.length, row - 1, 4);
  highlightRow(ws5, row - cacRows.length + 2, 4, LIGHT_GREEN, GREEN);

  // ════════════════════════════════════════════════════════════════════
  // SHEET 6: INVESTMENT USE & ASSUMPTIONS
  // ════════════════════════════════════════════════════════════════════
  const ws6 = wb.addWorksheet("7. Assumptions & Risks", { properties: { tabColor: { argb: RED } } });
  ws6.columns = [{ width: 30 }, { width: 20 }, { width: 40 }, { width: 28 }];

  addTitle(ws6, 1, "Investment Use, Key Assumptions & Risks", 4);

  // Seed round
  row = 3;
  addTitle(ws6, row, "Seed Round — €230K Allocation", 4);
  row++;
  ws6.getRow(row).values = ["Category", "Amount", "What It Buys", "Revenue Impact"];
  styleHeader(ws6, row, 4);
  row++;

  const seedRows = [
    ["Paid acquisition", "€180,000", "Month 7-26 ramp (€3K → €15K/mo). ~1,800 platform signups via Google/Facebook/LinkedIn ads", "~€27K additional subscription ARR + lead gen"],
    ["Content & SEO acceleration", "€50,000", "Month 7-18. Professional content, landing pages per corridor, multi-language SEO", "3-5x organic traffic growth, compounds annually"],
    ["TOTAL", "€230,000", "", ""],
  ];

  seedRows.forEach((r, i) => {
    ws6.getRow(row).values = r;
    for (let c = 1; c <= 4; c++) {
      ws6.getRow(row).getCell(c).border = thinBorder;
      ws6.getRow(row).getCell(c).font = i === seedRows.length - 1 ? boldFont : bodyFont;
      ws6.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }
    if (i === seedRows.length - 1) highlightRow(ws6, row, 4, LIGHT_ACCENT, DARK);
    ws6.getRow(row).height = 28;
    row++;
  });

  // Key assumptions
  row += 1;
  addTitle(ws6, row, "Key Assumptions", 4);
  row++;
  ws6.getRow(row).values = ["Assumption", "Value Used", "Basis / Benchmark", "Sensitivity"];
  styleHeader(ws6, row, 4);
  row++;

  const assumptions = [
    ["Subscription price", "€14.90/mo / €149/yr", "Competitive analysis vs Boldin ($12/mo US), positioned as premium for multi-country", "A/B test €12-19.90 range"],
    ["Organic reach (Year 1)", "4% of addressable", "Niche SaaS benchmarks (OpenView); concentrated LU market", "High — depends on SEO execution"],
    ["Email capture rate", "30%", "Financial calculator industry 20-40% (Unbounce 2025)", "Medium — depends on report value prop"],
    ["Email → signup", "18%", "SaaS drip campaign benchmarks 10-20% (HubSpot)", "Medium"],
    ["Signup → paid conversion", "10%", "Freemium financial tools 8-15% where free tier surfaces problems", "High — most critical metric"],
    ["Monthly churn", "4% (improving to ~3%)", "Recurly 2025 finance category median: 3.7%", "High impact on long-term subs"],
    ["Paid acquisition CAC", "€40/signup (base) / €30 (upside)", "Financial services CPC €5-15, 30-50% landing conversion. Niche keywords with near-zero competition justify the lower end. Sensitivity: at €100/signup the model becomes loss-making.", "Medium — optimisable"],
    ["Lead gen conversion", "3% of all signups", "80% gap × 25% click × 15% invest", "Medium — depends on product partners"],
    ["Avg capital invested", "€50,000", "Target demo 45-65, LU income levels", "Wide range: €20K-100K"],
    ["Trailing commission (tiered)", "1.5% ≤€500K capital / 1.0% above", "Retail pension/life distribution benchmarks in LU/FR (Swiss Life, Foyer). Small-ticket trail typically 1-1.5%; HNW drops due to competitive alternatives (private banking).", "High — critical to validate against signed term sheet before pitch"],
    ["Co-founder salaries excluded", "€0 in cost model", "Both technical + BD co-founders work on equity through Series A", "Major — add €6-10K/mo combined if salaried"],
    ["Post-break-even team ramp", "0→0→2→5→6→8 FTEs by end Y1-Y5 (first hire M28, 10mo after BE)", "Hires begin after monthly break-even at M18, with a deliberate 10-month buffer to confirm funnel durability. Funded from cashflow not seed. Roles unspecified (engineering / content / CS / ops mix).", "Medium — scales with growth, flexible"],
    ["Avg loaded FTE cost", "€6,000/mo", "LU market: ~€60K gross + ~13% social charges + equipment/desk", "Low — well-benchmarked"],
    ["Country pension engines", "Founder-built (no cash cost)", "Technical co-founder builds 29 engines (EU27 + UK + CH) over 5 years in greedy TAM order. LU/FR/CH already prototyped.", "Schedule risk if founder bandwidth tight"],
    ["Engine rollout pace", "3 at launch (LU/FR/CH), 4 in Y1 quarterly (PT/ES/UK/IT), 6 in Y2, 6 in Y3, 6 in Y4, 4 in Y5", "Front-loaded launch + steady ~2-month cadence Y2-Y5. End-state 29 engines by M58.", "Slower pace shifts projections right; faster gives diminishing returns until corridors mature"],
    ["Geographic addressable", "Sum of bilateral pension corridors", "Each new engine unlocks corridors with all already-supported countries; 0.55 addressability factor on diaspora populations", "See Engine Schedule sheet for full rollout"],
    ["Per-corridor ramp", "6 months from when both engines live", "Time for content, SEO indexing, community seeding in each corridor", "Realistic per published SEO benchmarks"],
    ["Distribution partnerships ramp", "1 → 3 → 8 → 20 active partners (Yr1→Yr5)", "BD co-founder owns channel from day 1; first deals close post-seed", "High — entirely depends on BD co-founder execution"],
    ["Signups per active partnership", "8/month (base)", "Blend of corporate HR (high), expat associations (one-time burst), content (steady)", "Wide range: 5-12/mo per partner"],
  ];

  assumptions.forEach(a => {
    ws6.getRow(row).values = a;
    for (let c = 1; c <= 4; c++) {
      ws6.getRow(row).getCell(c).border = thinBorder;
      ws6.getRow(row).getCell(c).font = bodyFont;
      ws6.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }
    ws6.getRow(row).height = 28;
    row++;
  });

  // Risks
  row += 1;
  addTitle(ws6, row, "Key Risks", 4);
  row++;
  ws6.getRow(row).values = ["Risk", "Impact", "Mitigation", "Probability"];
  styleHeader(ws6, row, 4);
  row++;

  const risks = [
    ["Low conversion (<5% signup→paid)", "Revenue 40-50% below projections", "Optimize onboarding, improve free→paid value gap, A/B test pricing", "Medium"],
    ["High churn (>6%/mo)", "Never reaches critical mass of subscribers", "Invest in activation, legislative alerts, vault data lock-in", "Medium"],
    ["ETS/gov dashboards improve", "Reduces perceived value of free tier", "Focus on planning/simulation (not tracking); multi-country = moat", "Low (slow-moving)"],
    ["Regulatory risk (financial advice)", "May need disclaimers or licensing per market", "Position as education/planning, not advice; legal review per market", "Low-Medium"],
    ["Competitor enters EU multi-country", "Price pressure, feature competition", "First-mover advantage; deep country expertise; vault data lock-in", "Low (2-3 year window)"],
    ["Paid acquisition CAC too high", "Unprofitable growth", "Shift budget to organic/partnerships; optimise landing pages", "Medium"],
    ["Lead gen commission rate compression", "Tiered 1.5%/1.0% not achievable → blended ~0.5% cuts Y5 lead-gen ARR by ~65%", "Subscription-only business still reaches €3.5M Y5 ARR; lead gen is upside on top of core", "Medium"],
    ["Marketing underperformance", "Slower growth, delayed break-even", "Diversify channels; lean into distribution partnerships as fallback", "Medium"],
  ];

  risks.forEach(r => {
    ws6.getRow(row).values = r;
    const probCell = ws6.getRow(row).getCell(4);
    for (let c = 1; c <= 4; c++) {
      ws6.getRow(row).getCell(c).border = thinBorder;
      ws6.getRow(row).getCell(c).font = bodyFont;
      ws6.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }
    if (r[3].includes("Medium")) {
      probCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_ORANGE } };
    } else {
      probCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_GREEN } };
    }
    ws6.getRow(row).height = 28;
    row++;
  });

  // Break-even
  row += 1;
  addTitle(ws6, row, "Break-Even Analysis", 4);
  row++;

  let cumNet = 0;
  let breakEvenMonth = null;
  let monthlyBEMonth = null;
  for (let i = 0; i < 60; i++) {
    if (baseData[i].netIncome >= 0 && !monthlyBEMonth) monthlyBEMonth = i + 1;
    cumNet += baseData[i].netIncome;
    if (cumNet >= 0 && !breakEvenMonth) breakEvenMonth = i + 1;
  }

  ws6.getRow(row).values = ["Metric", "Base Scenario", "Notes", ""];
  styleSubHeader(ws6, row, 3);
  row++;

  const beRows = [
    ["Monthly break-even (MRR > costs)", monthlyBEMonth ? `Month ${monthlyBEMonth}` : "Not reached in 60 months", monthlyBEMonth ? `${baseData[monthlyBEMonth-1].totalPaidSubs} subscribers needed` : ""],
    ["Cumulative break-even", breakEvenMonth ? `Month ${breakEvenMonth}` : "Not reached in 60 months", breakEvenMonth ? "Recovers all prior losses including acquisition spend" : ""],
    ["Year 5 cumulative net income", `€${Math.round(baseData[59].cumulativeNet).toLocaleString()}`, baseData[59].cumulativeNet > 0 ? "Profitable over 5 years" : "Still in investment phase"],
  ];

  beRows.forEach(b => {
    ws6.getRow(row).values = [b[0], b[1], b[2]];
    for (let c = 1; c <= 3; c++) {
      ws6.getRow(row).getCell(c).border = thinBorder;
      ws6.getRow(row).getCell(c).font = boldFont;
      ws6.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }
    ws6.getRow(row).height = 28;
    row++;
  });

  // ─── Save ───
  const outPath = path.join(__dirname, "Prevista-Financial-Projections.xlsx");
  await wb.xlsx.writeFile(outPath);
  console.log("Written to:", outPath);

  // ─── Headline summary (base scenario) ───
  const fmtEur = n => "€" + Math.round(n).toLocaleString();
  console.log("\n── Headline metrics (base) ──");
  console.log("Year | Live | Addressable | Subs    | SubARR     | LeadGen/yr | Total ARR  | Capital ref.");
  yearEndIndices.forEach((idx, yi) => {
    const d = baseData[idx];
    const leadGen = d.totalARR - d.subARR;
    console.log(
      `Y${yi+1}   | ${String(d.countriesLive).padStart(2)}   | ${String(d.addressable).padStart(11)} | ${String(d.totalPaidSubs).padStart(7)} | ${fmtEur(d.subARR).padStart(10)} | ${fmtEur(leadGen).padStart(10)} | ${fmtEur(d.totalARR).padStart(10)} | ${fmtEur(d.totalCapital)}`
    );
  });
  const ratios = yearEndIndices.slice(1).map((idx, i) => baseData[idx].totalARR / baseData[yearEndIndices[i]].totalARR);
  console.log("YoY ARR ratios:", ratios.map(r => r.toFixed(2) + "×").join(" → "));
  console.log(`Monthly break-even: ${monthlyBEMonth ? "M" + monthlyBEMonth : "not in 60mo"}`);
  console.log(`Cumulative break-even: ${breakEvenMonth ? "M" + breakEvenMonth : "not in 60mo"}`);
  console.log(`Y5 cumulative net: ${fmtEur(baseData[59].cumulativeNet)}`);
  console.log(`Y5 upside ARR: ${fmtEur(upsideData[59].totalARR)} (${upsideData[59].totalPaidSubs} subs)`);
}

generate().catch(e => { console.error(e); process.exit(1); });
