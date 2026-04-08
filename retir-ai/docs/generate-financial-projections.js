const ExcelJS = require("exceljs");
const path = require("path");

async function generate() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "RetirAI Financial Projections";
  wb.created = new Date();

  // ─── Color palette (matches pricing analysis) ───
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
  const YELLOW_BG = "FFFFF2CC";
  const PURPLE = "FF7030A0";
  const LIGHT_PURPLE = "FFE8D5F5";

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

  // ════════════════════════════════════════════════════════════════════
  // ASSUMPTIONS & CONSTANTS
  // ════════════════════════════════════════════════════════════════════

  const PRICE_MONTHLY = 14.90;
  const PRICE_ANNUAL = 149.00;
  const ANNUAL_SPLIT = 0.40; // 40% annual, 60% monthly by Month 12

  // Luxembourg market sizing
  const LU_POPULATION = 672000;
  const LU_FOREIGN_RESIDENTS = 315000; // 47% foreign residents
  const LU_CROSS_BORDER_WORKERS = 220000; // daily cross-border commuters
  const LU_MULTI_COUNTRY_CAREERS = 180000; // estimated people with 2+ country careers in LU ecosystem
  const LU_DIGITALLY_ENGAGED_PCT = 0.55; // % who would consider a digital tool
  const LU_PENSION_CONCERNED_PCT = 0.35; // % actively concerned about pension planning

  // EU expansion markets (Year 2-3)
  const EU_MARKETS = [
    { name: "Belgium", expats: 200000, crossBorder: 50000, startMonth: 13 },
    { name: "Netherlands", expats: 250000, crossBorder: 40000, startMonth: 13 },
    { name: "Germany (border)", expats: 180000, crossBorder: 60000, startMonth: 16 },
    { name: "France (expat)", expats: 300000, crossBorder: 0, startMonth: 18 },
    { name: "Switzerland (expat)", expats: 350000, crossBorder: 0, startMonth: 18 },
    { name: "Portugal/Spain (retiree)", expats: 150000, crossBorder: 0, startMonth: 24 },
  ];

  // Funnel assumptions — 3 scenarios
  const scenarios = {
    conservative: {
      label: "Conservative",
      luVisitorsM1: 800,
      visitorGrowth: 0.06,
      trialSignup: 0.05,
      trialToPaid: 0.04,
      monthlyChurn: 0.05,
      euVisitorMultiplier: 0.3, // each EU market adds 30% of LU traffic at that point
    },
    likely: {
      label: "Likely",
      luVisitorsM1: 1500,
      visitorGrowth: 0.10,
      trialSignup: 0.07,
      trialToPaid: 0.055,
      monthlyChurn: 0.04,
      euVisitorMultiplier: 0.5,
    },
    optimistic: {
      label: "Optimistic",
      luVisitorsM1: 3000,
      visitorGrowth: 0.14,
      trialSignup: 0.09,
      trialToPaid: 0.07,
      monthlyChurn: 0.03,
      euVisitorMultiplier: 0.7,
    },
  };

  // Cost structure (monthly)
  const COSTS = {
    infrastructure: { m1: 150, m12: 350, m24: 800, m36: 1500 },
    aiApi: { perUser: 2.50 }, // avg AI API cost per active paid user/month
    marketing: { m1: 500, m12: 2000, m24: 4000, m36: 6000 },
    support: { perUser: 0.50 }, // minimal at start, self-serve
    legal: { monthly: 200 }, // GDPR, compliance
    misc: { monthly: 100 },
    // Founder(s) salary not included — assumed bootstrapped / separate
  };

  // ════════════════════════════════════════════════════════════════════
  // HELPER: Run 36-month simulation
  // ════════════════════════════════════════════════════════════════════
  function simulate(scenario) {
    const s = scenarios[scenario];
    const months = [];

    let totalPaidSubs = 0;

    for (let m = 1; m <= 36; m++) {
      // LU visitors with growth
      const luVisitors = s.luVisitorsM1 * Math.pow(1 + s.visitorGrowth, m - 1);

      // EU market visitors (each market ramps up over 6 months after launch)
      let euVisitors = 0;
      let activeEuMarkets = 0;
      EU_MARKETS.forEach(market => {
        if (m >= market.startMonth) {
          const monthsActive = m - market.startMonth;
          const rampFactor = Math.min(1, monthsActive / 6); // 6-month ramp
          const marketBase = s.luVisitorsM1 * s.euVisitorMultiplier * rampFactor;
          const marketGrowth = marketBase * Math.pow(1 + s.visitorGrowth * 0.7, monthsActive); // slower growth than LU
          euVisitors += marketGrowth;
          if (rampFactor > 0) activeEuMarkets++;
        }
      });

      const totalVisitors = luVisitors + euVisitors;
      const trials = totalVisitors * s.trialSignup;
      const newPaid = trials * s.trialToPaid;

      // Churn improves slightly over time as product matures
      const churnAdj = Math.max(s.monthlyChurn * 0.7, s.monthlyChurn - (m * 0.0005));
      const churned = totalPaidSubs * churnAdj;
      totalPaidSubs = totalPaidSubs - churned + newPaid;

      // Revenue calculation
      const annualPct = Math.min(ANNUAL_SPLIT, 0.15 + (m * 0.02)); // annual billing grows over time
      const monthlyUsers = totalPaidSubs * (1 - annualPct);
      const annualUsers = totalPaidSubs * annualPct;
      const mrr = (monthlyUsers * PRICE_MONTHLY) + (annualUsers * (PRICE_ANNUAL / 12));

      // Costs
      const infraCost = interpolateCost(COSTS.infrastructure, m);
      const aiCost = totalPaidSubs * COSTS.aiApi.perUser;
      const marketingCost = interpolateCost(COSTS.marketing, m);
      const supportCost = totalPaidSubs * COSTS.support.perUser;
      const legalCost = COSTS.legal.monthly;
      const miscCost = COSTS.misc.monthly;
      const totalCost = infraCost + aiCost + marketingCost + supportCost + legalCost + miscCost;

      const netIncome = mrr - totalCost;

      months.push({
        month: m,
        luVisitors: Math.round(luVisitors),
        euVisitors: Math.round(euVisitors),
        totalVisitors: Math.round(totalVisitors),
        trials: Math.round(trials),
        newPaid: Math.round(newPaid * 10) / 10,
        churned: Math.round(churned * 10) / 10,
        churnRate: churnAdj,
        totalPaidSubs: Math.round(totalPaidSubs),
        mrr: Math.round(mrr),
        arr: Math.round(mrr * 12),
        infraCost: Math.round(infraCost),
        aiCost: Math.round(aiCost),
        marketingCost: Math.round(marketingCost),
        supportCost: Math.round(supportCost),
        legalCost,
        miscCost,
        totalCost: Math.round(totalCost),
        netIncome: Math.round(netIncome),
        activeEuMarkets,
      });
    }
    return months;
  }

  function interpolateCost(costDef, month) {
    if (month <= 12) {
      return costDef.m1 + (costDef.m12 - costDef.m1) * ((month - 1) / 11);
    } else if (month <= 24) {
      return costDef.m12 + (costDef.m24 - costDef.m12) * ((month - 12) / 12);
    } else {
      return costDef.m24 + (costDef.m36 - costDef.m24) * ((month - 24) / 12);
    }
  }

  // Run all 3 scenarios
  const conservativeData = simulate("conservative");
  const likelyData = simulate("likely");
  const optimisticData = simulate("optimistic");

  // ════════════════════════════════════════════════════════════════════
  // SHEET 1: MARKET SIZING
  // ════════════════════════════════════════════════════════════════════
  const ws1 = wb.addWorksheet("1. Market Sizing", { properties: { tabColor: { argb: ACCENT } } });
  ws1.columns = [{ width: 36 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 40 }];

  addTitle(ws1, 1, "RetirAI — Total Addressable Market", 5);
  addNote(ws1, 2, "Luxembourg launch market + EU expansion. Focus: internationally mobile professionals with multi-country pension entitlements.", 5);

  // Luxembourg TAM/SAM/SOM
  let row = 4;
  addTitle(ws1, row, "Phase 1: Luxembourg (Launch Market)", 5);
  row++;
  ws1.getRow(row).values = ["Metric", "Value", "Calculation", "Confidence", "Source / Notes"];
  styleHeader(ws1, row, 5);
  row++;

  const luMarket = [
    ["Total population", LU_POPULATION, "—", "High", "STATEC 2026"],
    ["Foreign residents", LU_FOREIGN_RESIDENTS, `${(LU_FOREIGN_RESIDENTS/LU_POPULATION*100).toFixed(0)}% of population`, "High", "47% foreign-born — highest in EU"],
    ["Cross-border workers", LU_CROSS_BORDER_WORKERS, "Daily commuters from FR/BE/DE", "High", "IGSS statistics"],
    ["Multi-country career holders (TAM)", LU_MULTI_COUNTRY_CAREERS, "Foreign residents + cross-border with 2+ countries", "Medium", "Estimated from mobility data"],
    ["Digitally engaged segment", Math.round(LU_MULTI_COUNTRY_CAREERS * LU_DIGITALLY_ENGAGED_PCT), `${(LU_DIGITALLY_ENGAGED_PCT*100)}% of TAM`, "Medium", "Would consider a digital pension tool"],
    ["Actively pension-concerned (SAM)", Math.round(LU_MULTI_COUNTRY_CAREERS * LU_DIGITALLY_ENGAGED_PCT * LU_PENSION_CONCERNED_PCT), `${(LU_PENSION_CONCERNED_PCT*100)}% of digitally engaged`, "Medium", "Age 40+, approaching retirement planning window"],
    ["Realistic reach Year 1 (SOM)", Math.round(LU_MULTI_COUNTRY_CAREERS * LU_DIGITALLY_ENGAGED_PCT * LU_PENSION_CONCERNED_PCT * 0.03), "3% of SAM in Year 1", "Low", "Realistic for pre-brand launch with digital marketing"],
    ["Realistic reach Year 3 (SOM)", Math.round(LU_MULTI_COUNTRY_CAREERS * LU_DIGITALLY_ENGAGED_PCT * LU_PENSION_CONCERNED_PCT * 0.10), "10% of SAM by Year 3", "Low", "With brand, referrals, partnerships"],
  ];

  luMarket.forEach(m => {
    ws1.getRow(row).values = m;
    if (typeof m[1] === "number") ws1.getRow(row).getCell(2).numFmt = intFmt;
    row++;
  });
  styleDataRows(ws1, 6, row - 1, 5);

  // LU revenue potential
  row += 1;
  const luSam = Math.round(LU_MULTI_COUNTRY_CAREERS * LU_DIGITALLY_ENGAGED_PCT * LU_PENSION_CONCERNED_PCT);
  addTitle(ws1, row, "Luxembourg Revenue Potential", 5);
  row++;
  ws1.getRow(row).values = ["Scenario", "Penetration", "Paid Users", "MRR", "ARR"];
  styleHeader(ws1, row, 5);
  row++;

  const luRevScenarios = [
    ["Year 1 — Conservative (1%)", 0.01],
    ["Year 1 — Likely (3%)", 0.03],
    ["Year 1 — Optimistic (5%)", 0.05],
    ["Year 3 — Conservative (5%)", 0.05],
    ["Year 3 — Likely (10%)", 0.10],
    ["Year 3 — Optimistic (15%)", 0.15],
  ];

  luRevScenarios.forEach(s => {
    const users = Math.round(luSam * s[1]);
    const mrr = Math.round(users * PRICE_MONTHLY * 0.85); // blended (some annual)
    ws1.getRow(row).values = [s[0], s[1], users, mrr, mrr * 12];
    ws1.getRow(row).getCell(2).numFmt = pctFmt;
    ws1.getRow(row).getCell(3).numFmt = intFmt;
    ws1.getRow(row).getCell(4).numFmt = currencyFmt;
    ws1.getRow(row).getCell(5).numFmt = currencyFmt;
    row++;
  });
  styleDataRows(ws1, row - 6, row - 1, 5);

  // EU expansion TAM
  row += 1;
  addTitle(ws1, row, "Phase 2-3: EU Expansion Markets", 5);
  row++;
  ws1.getRow(row).values = ["Market", "Expat Population", "Cross-Border Workers", "Est. SAM", "Launch Month"];
  styleHeader(ws1, row, 5);
  row++;

  let totalEuSam = 0;
  EU_MARKETS.forEach(m => {
    const sam = Math.round((m.expats + m.crossBorder) * LU_DIGITALLY_ENGAGED_PCT * LU_PENSION_CONCERNED_PCT);
    totalEuSam += sam;
    ws1.getRow(row).values = [m.name, m.expats, m.crossBorder, sam, `Month ${m.startMonth}`];
    ws1.getRow(row).getCell(2).numFmt = intFmt;
    ws1.getRow(row).getCell(3).numFmt = intFmt;
    ws1.getRow(row).getCell(4).numFmt = intFmt;
    row++;
  });
  // Total row
  ws1.getRow(row).values = ["TOTAL EU EXPANSION", "", "", totalEuSam, ""];
  ws1.getRow(row).getCell(4).numFmt = intFmt;
  highlightRow(ws1, row, 5, LIGHT_GREEN, GREEN);
  row++;

  // Grand total
  row++;
  ws1.getRow(row).values = ["TOTAL ADDRESSABLE SAM (LU + EU)", "", "", luSam + totalEuSam, ""];
  ws1.getRow(row).getCell(4).numFmt = intFmt;
  highlightRow(ws1, row, 5, LIGHT_ACCENT, DARK);
  row++;
  addNote(ws1, row + 1, `At €14.90/mo with 5% penetration of combined SAM = ${Math.round((luSam + totalEuSam) * 0.05)} paying users = €${Math.round((luSam + totalEuSam) * 0.05 * PRICE_MONTHLY * 0.85).toLocaleString()}/mo MRR`, 5);

  styleDataRows(ws1, row - EU_MARKETS.length - 3, row - 3, 5);

  // ════════════════════════════════════════════════════════════════════
  // SHEET 2: 36-MONTH REVENUE MODEL (LIKELY)
  // ════════════════════════════════════════════════════════════════════
  const ws2 = wb.addWorksheet("2. Revenue Model (36mo)", { properties: { tabColor: { argb: GREEN } } });
  const revCols = [
    { width: 10 }, // Month
    { width: 14 }, // LU Visitors
    { width: 14 }, // EU Visitors
    { width: 14 }, // Total Visitors
    { width: 12 }, // Trials
    { width: 12 }, // New Paid
    { width: 12 }, // Churned
    { width: 10 }, // Churn %
    { width: 14 }, // Total Subs
    { width: 14 }, // MRR
    { width: 14 }, // ARR
    { width: 10 }, // EU Markets
  ];
  ws2.columns = revCols;

  addTitle(ws2, 1, "36-Month Revenue Model — Likely Scenario", 12);
  addNote(ws2, 2, `Price: €${PRICE_MONTHLY}/mo | €${PRICE_ANNUAL}/yr. Funnel: ${scenarios.likely.luVisitorsM1} initial monthly visitors, ${(scenarios.likely.trialSignup*100)}% trial signup, ${(scenarios.likely.trialToPaid*100)}% trial→paid, ${(scenarios.likely.monthlyChurn*100)}% initial churn. EU expansion starts Month 13.`, 12);

  row = 4;
  ws2.getRow(row).values = [
    "Month", "LU Visitors", "EU Visitors", "Total Visitors",
    "Trials", "New Paid", "Churned", "Churn %",
    "Total Subs", "MRR (€)", "ARR (€)", "EU Markets"
  ];
  styleHeader(ws2, row, 12);
  row++;

  likelyData.forEach((d, i) => {
    ws2.getRow(row).values = [
      d.month, d.luVisitors, d.euVisitors, d.totalVisitors,
      d.trials, d.newPaid, d.churned, d.churnRate,
      d.totalPaidSubs, d.mrr, d.arr, d.activeEuMarkets
    ];
    ws2.getRow(row).getCell(2).numFmt = intFmt;
    ws2.getRow(row).getCell(3).numFmt = intFmt;
    ws2.getRow(row).getCell(4).numFmt = intFmt;
    ws2.getRow(row).getCell(5).numFmt = intFmt;
    ws2.getRow(row).getCell(8).numFmt = pctFmt;
    ws2.getRow(row).getCell(9).numFmt = intFmt;
    ws2.getRow(row).getCell(10).numFmt = currencyFmt;
    ws2.getRow(row).getCell(11).numFmt = currencyFmt;

    // Highlight milestones
    if (d.month === 12 || d.month === 24 || d.month === 36) {
      highlightRow(ws2, row, 12, LIGHT_GREEN, GREEN);
    }
    row++;
  });
  styleDataRows(ws2, 5, row - 1, 12);
  // Re-apply milestone highlights after styleDataRows
  [12, 24, 36].forEach(milestone => {
    const mRow = 4 + milestone;
    highlightRow(ws2, mRow, 12, LIGHT_GREEN, GREEN);
  });

  // Summary row
  row += 1;
  addTitle(ws2, row, "Key Milestones — Likely Scenario", 12);
  row++;
  ws2.getRow(row).values = ["Milestone", "Month", "Paid Subs", "MRR", "ARR", "", "", "", "", "", "", ""];
  styleSubHeader(ws2, row, 5);
  row++;

  [11, 23, 35].forEach(i => { // 0-indexed for Month 12, 24, 36
    const d = likelyData[i];
    ws2.getRow(row).values = [`Year ${d.month / 12}`, d.month, d.totalPaidSubs, d.mrr, d.arr];
    ws2.getRow(row).getCell(3).numFmt = intFmt;
    ws2.getRow(row).getCell(4).numFmt = currencyFmt;
    ws2.getRow(row).getCell(5).numFmt = currencyFmt;
    for (let c = 1; c <= 5; c++) {
      ws2.getRow(row).getCell(c).border = thinBorder;
      ws2.getRow(row).getCell(c).font = boldFont;
      ws2.getRow(row).getCell(c).alignment = { horizontal: c > 1 ? "center" : "left", vertical: "middle" };
    }
    row++;
  });

  // ════════════════════════════════════════════════════════════════════
  // SHEET 3: SCENARIO COMPARISON
  // ════════════════════════════════════════════════════════════════════
  const ws3 = wb.addWorksheet("3. Scenario Comparison", { properties: { tabColor: { argb: ORANGE } } });
  ws3.columns = [
    { width: 10 }, { width: 14 }, { width: 14 }, { width: 14 },
    { width: 14 }, { width: 14 }, { width: 14 },
    { width: 14 }, { width: 14 }, { width: 14 },
  ];

  addTitle(ws3, 1, "3-Year Scenario Comparison: Conservative / Likely / Optimistic", 10);
  addNote(ws3, 2, "Side-by-side comparison of paid subscribers, MRR, and cumulative revenue across all scenarios.", 10);

  row = 4;
  ws3.getRow(row).values = [
    "Month",
    "Cons. Subs", "Likely Subs", "Opt. Subs",
    "Cons. MRR", "Likely MRR", "Opt. MRR",
    "Cons. Cum Rev", "Likely Cum Rev", "Opt. Cum Rev",
  ];
  styleHeader(ws3, row, 10);
  row++;

  let consCumRev = 0, likelyCumRev = 0, optCumRev = 0;
  for (let i = 0; i < 36; i++) {
    const c = conservativeData[i];
    const l = likelyData[i];
    const o = optimisticData[i];
    consCumRev += c.mrr;
    likelyCumRev += l.mrr;
    optCumRev += o.mrr;

    ws3.getRow(row).values = [
      i + 1,
      c.totalPaidSubs, l.totalPaidSubs, o.totalPaidSubs,
      c.mrr, l.mrr, o.mrr,
      consCumRev, likelyCumRev, optCumRev,
    ];
    for (let cc = 2; cc <= 4; cc++) ws3.getRow(row).getCell(cc).numFmt = intFmt;
    for (let cc = 5; cc <= 10; cc++) ws3.getRow(row).getCell(cc).numFmt = currencyFmt;

    if ((i + 1) === 12 || (i + 1) === 24 || (i + 1) === 36) {
      highlightRow(ws3, row, 10, LIGHT_GREEN, GREEN);
    }
    row++;
  }
  styleDataRows(ws3, 5, row - 1, 10);
  // Re-apply milestone highlights
  [12, 24, 36].forEach(milestone => {
    highlightRow(ws3, 4 + milestone, 10, LIGHT_GREEN, GREEN);
  });

  // Summary table
  row += 1;
  addTitle(ws3, row, "Year-End Summary", 10);
  row++;
  ws3.getRow(row).values = ["", "Conservative", "", "", "Likely", "", "", "Optimistic", "", ""];
  styleSubHeader(ws3, row, 10);
  row++;
  ws3.getRow(row).values = ["Year", "Subs", "MRR", "Cum Rev", "Subs", "MRR", "Cum Rev", "Subs", "MRR", "Cum Rev"];
  styleSubHeader(ws3, row, 10);
  row++;

  let ccr = 0, lcr = 0, ocr = 0;
  [11, 23, 35].forEach((idx, yi) => {
    // Compute cumulative revenue for each year
    const cYearRev = conservativeData.slice(yi * 12, (yi + 1) * 12).reduce((s, d) => s + d.mrr, 0);
    const lYearRev = likelyData.slice(yi * 12, (yi + 1) * 12).reduce((s, d) => s + d.mrr, 0);
    const oYearRev = optimisticData.slice(yi * 12, (yi + 1) * 12).reduce((s, d) => s + d.mrr, 0);

    ws3.getRow(row).values = [
      `Year ${yi + 1}`,
      conservativeData[idx].totalPaidSubs, conservativeData[idx].mrr, cYearRev,
      likelyData[idx].totalPaidSubs, likelyData[idx].mrr, lYearRev,
      optimisticData[idx].totalPaidSubs, optimisticData[idx].mrr, oYearRev,
    ];
    for (let cc = 2; cc <= 10; cc++) {
      ws3.getRow(row).getCell(cc).numFmt = (cc % 3 === 2) ? intFmt : currencyFmt;
      ws3.getRow(row).getCell(cc).border = thinBorder;
      ws3.getRow(row).getCell(cc).font = boldFont;
      ws3.getRow(row).getCell(cc).alignment = { horizontal: "center", vertical: "middle" };
    }
    ws3.getRow(row).getCell(1).border = thinBorder;
    ws3.getRow(row).getCell(1).font = boldFont;
    row++;
  });

  // ════════════════════════════════════════════════════════════════════
  // SHEET 4: P&L (LIKELY SCENARIO)
  // ════════════════════════════════════════════════════════════════════
  const ws4 = wb.addWorksheet("4. P&L (Likely)", { properties: { tabColor: { argb: PURPLE } } });
  ws4.columns = [
    { width: 22 }, { width: 14 }, { width: 14 }, { width: 14 },
    { width: 14 }, { width: 14 }, { width: 14 },
    { width: 14 }, { width: 14 }, { width: 14 },
    { width: 14 }, { width: 14 }, { width: 14 },
  ];

  addTitle(ws4, 1, "Profit & Loss — Likely Scenario (Monthly)", 13);
  addNote(ws4, 2, "Excludes founder salary. Assumes bootstrapped with minimal team. AI API cost scales with users.", 13);

  // Quarterly summary first
  row = 4;
  addTitle(ws4, row, "Quarterly P&L Summary", 13);
  row++;
  ws4.getRow(row).values = [
    "Quarter", "Paid Subs (end)", "Revenue (MRR × 3)", "Infrastructure", "AI API",
    "Marketing", "Support", "Legal", "Misc", "Total Costs", "Net Income", "Margin", "Cumulative"
  ];
  styleHeader(ws4, row, 13);
  row++;

  let cumPL = 0;
  for (let q = 0; q < 12; q++) { // 12 quarters in 3 years
    const qStart = q * 3;
    const qEnd = qStart + 3;
    const qData = likelyData.slice(qStart, qEnd);
    const qRev = qData.reduce((s, d) => s + d.mrr, 0);
    const qInfra = qData.reduce((s, d) => s + d.infraCost, 0);
    const qAi = qData.reduce((s, d) => s + d.aiCost, 0);
    const qMktg = qData.reduce((s, d) => s + d.marketingCost, 0);
    const qSupport = qData.reduce((s, d) => s + d.supportCost, 0);
    const qLegal = qData.reduce((s, d) => s + d.legalCost, 0);
    const qMisc = qData.reduce((s, d) => s + d.miscCost, 0);
    const qCost = qInfra + qAi + qMktg + qSupport + qLegal + qMisc;
    const qNet = qRev - qCost;
    cumPL += qNet;
    const margin = qRev > 0 ? qNet / qRev : 0;

    const yr = Math.floor(q / 4) + 1;
    const qNum = (q % 4) + 1;
    ws4.getRow(row).values = [
      `Y${yr} Q${qNum}`, qData[2].totalPaidSubs, qRev, qInfra, qAi,
      qMktg, qSupport, qLegal, qMisc, qCost, qNet, margin, cumPL
    ];
    ws4.getRow(row).getCell(2).numFmt = intFmt;
    for (let c = 3; c <= 11; c++) ws4.getRow(row).getCell(c).numFmt = currencyFmt;
    ws4.getRow(row).getCell(12).numFmt = pctFmt;
    ws4.getRow(row).getCell(13).numFmt = currencyFmt;

    // Color net income
    if (qNet >= 0) {
      ws4.getRow(row).getCell(11).font = { bold: true, size: 11, name: "Calibri", color: { argb: GREEN } };
      ws4.getRow(row).getCell(11).fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_GREEN } };
    } else {
      ws4.getRow(row).getCell(11).font = { bold: true, size: 11, name: "Calibri", color: { argb: RED } };
      ws4.getRow(row).getCell(11).fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_RED } };
    }
    // Color cumulative
    if (cumPL >= 0) {
      ws4.getRow(row).getCell(13).font = { bold: true, size: 11, name: "Calibri", color: { argb: GREEN } };
    } else {
      ws4.getRow(row).getCell(13).font = { bold: true, size: 11, name: "Calibri", color: { argb: RED } };
    }

    row++;
  }
  styleDataRows(ws4, 6, row - 1, 13);
  // Re-apply profit/loss coloring
  for (let q = 0; q < 12; q++) {
    const r = 6 + q;
    const netCell = ws4.getRow(r).getCell(11);
    const val = netCell.value;
    if (val >= 0) {
      netCell.font = { bold: true, size: 11, name: "Calibri", color: { argb: GREEN } };
      netCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_GREEN } };
    } else {
      netCell.font = { bold: true, size: 11, name: "Calibri", color: { argb: RED } };
      netCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_RED } };
    }
  }

  // Annual summary
  row += 1;
  addTitle(ws4, row, "Annual P&L Summary", 13);
  row++;
  ws4.getRow(row).values = ["Year", "Ending Subs", "Total Revenue", "Total Costs", "Net Income", "Margin", "Cumulative Net", "", "", "", "", "", ""];
  styleHeader(ws4, row, 7);
  row++;

  let annCum = 0;
  for (let y = 0; y < 3; y++) {
    const yData = likelyData.slice(y * 12, (y + 1) * 12);
    const yRev = yData.reduce((s, d) => s + d.mrr, 0);
    const yCost = yData.reduce((s, d) => s + d.totalCost, 0);
    const yNet = yRev - yCost;
    annCum += yNet;

    ws4.getRow(row).values = [
      `Year ${y + 1}`, yData[11].totalPaidSubs, yRev, yCost, yNet,
      yRev > 0 ? yNet / yRev : 0, annCum
    ];
    ws4.getRow(row).getCell(2).numFmt = intFmt;
    ws4.getRow(row).getCell(3).numFmt = currencyFmt;
    ws4.getRow(row).getCell(4).numFmt = currencyFmt;
    ws4.getRow(row).getCell(5).numFmt = currencyFmt;
    ws4.getRow(row).getCell(6).numFmt = pctFmt;
    ws4.getRow(row).getCell(7).numFmt = currencyFmt;

    for (let c = 1; c <= 7; c++) {
      ws4.getRow(row).getCell(c).border = thinBorder;
      ws4.getRow(row).getCell(c).font = boldFont;
      ws4.getRow(row).getCell(c).alignment = { horizontal: c > 1 ? "center" : "left", vertical: "middle" };
    }

    if (yNet >= 0) {
      ws4.getRow(row).getCell(5).font = { bold: true, size: 11, name: "Calibri", color: { argb: GREEN } };
    } else {
      ws4.getRow(row).getCell(5).font = { bold: true, size: 11, name: "Calibri", color: { argb: RED } };
    }
    row++;
  }

  // Cost breakdown note
  row += 1;
  addTitle(ws4, row, "Cost Structure Assumptions", 13);
  row++;
  const costNotes = [
    ["Infrastructure (hosting, DB, storage)", `€${COSTS.infrastructure.m1}/mo → €${COSTS.infrastructure.m12}/mo (Y1) → €${COSTS.infrastructure.m36}/mo (Y3)`, "Scales with users; Vercel/AWS/Supabase"],
    ["AI API (LLM inference)", `€${COSTS.aiApi.perUser}/user/mo`, "Chat advisor, document extraction, pension explainer"],
    ["Marketing (SEO, content, ads)", `€${COSTS.marketing.m1}/mo → €${COSTS.marketing.m12}/mo (Y1) → €${COSTS.marketing.m36}/mo (Y3)`, "LinkedIn, pension communities, SEO content, Google Ads"],
    ["Support (per user)", `€${COSTS.support.perUser}/user/mo`, "Self-serve first; FAQ, in-app help; minimal tickets"],
    ["Legal / Compliance", `€${COSTS.legal.monthly}/mo`, "GDPR DPO, privacy policy, financial disclaimer review"],
    ["Miscellaneous", `€${COSTS.misc.monthly}/mo`, "Domain, email, tools, subscriptions"],
  ];
  ws4.getRow(row).values = ["Cost Category", "Rate", "Notes", "", "", "", "", "", "", "", "", "", ""];
  styleSubHeader(ws4, row, 3);
  row++;
  costNotes.forEach(cn => {
    ws4.getRow(row).values = [cn[0], cn[1], cn[2]];
    for (let c = 1; c <= 3; c++) {
      ws4.getRow(row).getCell(c).border = thinBorder;
      ws4.getRow(row).getCell(c).font = bodyFont;
      ws4.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }
    ws4.getRow(row).height = 24;
    row++;
  });

  // ════════════════════════════════════════════════════════════════════
  // SHEET 5: EU EXPANSION
  // ════════════════════════════════════════════════════════════════════
  const ws5 = wb.addWorksheet("5. EU Expansion", { properties: { tabColor: { argb: ORANGE } } });
  ws5.columns = [
    { width: 28 }, { width: 16 }, { width: 16 }, { width: 16 },
    { width: 16 }, { width: 16 }, { width: 16 }, { width: 28 },
  ];

  addTitle(ws5, 1, "EU Expansion Strategy & Revenue Impact", 8);
  addNote(ws5, 2, "Phased rollout from Luxembourg base. Each market adds country-specific pension formulas and localization.", 8);

  row = 4;
  addTitle(ws5, row, "Expansion Phases", 8);
  row++;
  ws5.getRow(row).values = [
    "Phase", "Markets", "Launch Month", "New Countries to Build",
    "Est. SAM", "Year 3 Penetration", "Year 3 Paid Users", "Revenue Contribution"
  ];
  styleHeader(ws5, row, 8);
  row++;

  const phases = [
    {
      phase: "Phase 0: Launch",
      markets: "Luxembourg (FR/CH/LU)",
      month: "Month 1",
      countries: "FR, CH, LU (done)",
      sam: luSam,
      pen: 0.10,
    },
    {
      phase: "Phase 1: Benelux",
      markets: "Belgium, Netherlands",
      month: "Month 13",
      countries: "+BE, +NL pension systems",
      sam: Math.round((250000 + 200000) * LU_DIGITALLY_ENGAGED_PCT * LU_PENSION_CONCERNED_PCT),
      pen: 0.04,
    },
    {
      phase: "Phase 2: DACH + France",
      markets: "Germany (border), France (expats)",
      month: "Month 16-18",
      countries: "+DE pension system",
      sam: Math.round((240000 + 300000) * LU_DIGITALLY_ENGAGED_PCT * LU_PENSION_CONCERNED_PCT),
      pen: 0.03,
    },
    {
      phase: "Phase 3: Swiss expats",
      markets: "Switzerland (expat focus)",
      month: "Month 18",
      countries: "CH already done; localize DE/IT",
      sam: Math.round(350000 * LU_DIGITALLY_ENGAGED_PCT * LU_PENSION_CONCERNED_PCT),
      pen: 0.03,
    },
    {
      phase: "Phase 4: Retirement destinations",
      markets: "Portugal, Spain, Italy",
      month: "Month 24",
      countries: "+PT, +ES, +IT pension + tax",
      sam: Math.round(150000 * LU_DIGITALLY_ENGAGED_PCT * LU_PENSION_CONCERNED_PCT),
      pen: 0.02,
    },
  ];

  let totalY3Users = 0;
  phases.forEach(p => {
    const users = Math.round(p.sam * p.pen);
    totalY3Users += users;
    const mrr = Math.round(users * PRICE_MONTHLY * 0.85);
    ws5.getRow(row).values = [
      p.phase, p.markets, p.month, p.countries,
      p.sam, p.pen, users, `€${mrr.toLocaleString()}/mo`
    ];
    ws5.getRow(row).getCell(5).numFmt = intFmt;
    ws5.getRow(row).getCell(6).numFmt = pctFmt;
    ws5.getRow(row).getCell(7).numFmt = intFmt;
    row++;
  });
  styleDataRows(ws5, 6, row - 1, 8);

  // Total
  const totalMrr = Math.round(totalY3Users * PRICE_MONTHLY * 0.85);
  ws5.getRow(row).values = [
    "TOTAL (Year 3 potential)", "", "", "",
    "", "", totalY3Users, `€${totalMrr.toLocaleString()}/mo (€${(totalMrr * 12).toLocaleString()}/yr)`
  ];
  ws5.getRow(row).getCell(7).numFmt = intFmt;
  highlightRow(ws5, row, 8, LIGHT_GREEN, GREEN);

  // Expansion investment requirements
  row += 2;
  addTitle(ws5, row, "Investment per New Market", 8);
  row++;
  ws5.getRow(row).values = ["Item", "Cost (one-time)", "Time", "Notes", "", "", "", ""];
  styleHeader(ws5, row, 4);
  row++;

  const investments = [
    ["Pension formula engine (per country)", "€2,000-5,000", "2-4 weeks", "Research + implement Pillar 1 calculation (regulations, formulas, edge cases)"],
    ["Tax simulation (per country)", "€1,000-2,000", "1-2 weeks", "Tax brackets, social charges, special regimes"],
    ["UI localization (per language)", "€500-1,000", "1 week", "Translations, currency formatting, pension terminology"],
    ["Legal review (per jurisdiction)", "€1,000-2,000", "2-4 weeks", "Financial disclaimer, GDPR compliance, local regulations"],
    ["Content & SEO (per market)", "€1,000-2,000", "Ongoing", "Localized landing pages, blog content, pension guides"],
    ["TOTAL per new market", "€5,500-12,000", "6-12 weeks", "Can parallelize across markets"],
  ];

  investments.forEach((inv, i) => {
    ws5.getRow(row).values = [inv[0], inv[1], inv[2], inv[3]];
    for (let c = 1; c <= 4; c++) {
      ws5.getRow(row).getCell(c).border = thinBorder;
      ws5.getRow(row).getCell(c).font = i === investments.length - 1 ? boldFont : bodyFont;
      ws5.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }
    if (i === investments.length - 1) {
      highlightRow(ws5, row, 4, LIGHT_ACCENT, DARK);
    }
    ws5.getRow(row).height = 28;
    row++;
  });

  // ════════════════════════════════════════════════════════════════════
  // SHEET 6: KEY ASSUMPTIONS & RISKS
  // ════════════════════════════════════════════════════════════════════
  const ws6 = wb.addWorksheet("6. Assumptions & Risks", { properties: { tabColor: { argb: RED } } });
  ws6.columns = [{ width: 28 }, { width: 20 }, { width: 44 }, { width: 28 }];

  addTitle(ws6, 1, "Key Assumptions, Risks & Sensitivities", 4);
  addNote(ws6, 2, "All projections are estimates. Key variables to validate with real data after launch.", 4);

  row = 4;
  addTitle(ws6, row, "Key Assumptions", 4);
  row++;
  ws6.getRow(row).values = ["Assumption", "Value Used", "Basis", "Sensitivity"];
  styleHeader(ws6, row, 4);
  row++;

  const assumptions = [
    ["Launch price", "€14.90/mo", "Pricing analysis recommendation", "€12-19.90 range; A/B test after 500 trials"],
    ["Initial LU visitors/mo", "1,500 (likely)", "SEO + LinkedIn + pension communities", "High — depends on marketing execution"],
    ["Visitor growth rate", "10%/mo (likely)", "Content marketing + word-of-mouth", "Medium — could be 6-14%"],
    ["Trial signup rate", "7%", "Industry benchmarks (SaaS freemium)", "Medium — depends on landing page + free tier value"],
    ["Trial-to-paid conversion", "5.5%", "Between deep research (6%) and pricing analysis (4.2%)", "High — most critical metric to validate"],
    ["Monthly churn", "4% initial → ~3.2% Y3", "SaaS benchmarks for niche B2C", "Medium — lower if product stickiness is high"],
    ["Annual billing split", "15% → 40% over time", "Industry benchmarks", "Low — mostly affects cash flow, not MRR math"],
    ["EU market ramp time", "6 months to full traffic", "New market penetration estimate", "Medium — varies by market maturity"],
    ["AI cost per user", "€2.50/mo", "GPT-4o / Claude API pricing", "Medium — could decrease with model efficiency"],
    ["No founder salary in costs", "Excluded", "Bootstrapped assumption", "Major — add €3-6K/mo if salaried"],
  ];

  assumptions.forEach(a => {
    ws6.getRow(row).values = a;
    row++;
  });
  styleDataRows(ws6, 6, row - 1, 4);

  // Risks
  row += 1;
  addTitle(ws6, row, "Key Risks", 4);
  row++;
  ws6.getRow(row).values = ["Risk", "Impact", "Mitigation", "Probability"];
  styleHeader(ws6, row, 4);
  row++;

  const risks = [
    ["Low conversion rate (<3%)", "Revenue 40-50% below projections", "Optimize onboarding, improve free→paid value gap, A/B test pricing", "Medium"],
    ["High churn (>6%/mo)", "Never reaches critical mass", "Invest in activation, legislative alerts, vault lock-in", "Medium"],
    ["ETS/free gov dashboards improve", "Reduces perceived value of free tier", "Focus on planning/simulation (not just tracking); multi-country = moat", "Low (slow-moving)"],
    ["Regulatory risk (financial advice)", "May need disclaimers or licensing", "Position as education/planning, not advice; legal review per market", "Low-Medium"],
    ["Competitor enters EU multi-country", "Price pressure, feature competition", "First-mover advantage; deep country expertise; vault data lock-in", "Low (next 2 years)"],
    ["AI costs spike", "Margin compression", "Caching, fine-tuning, credit limits, model optimization", "Low"],
    ["Marketing underperformance", "Slower growth, delayed break-even", "Diversify channels; partnerships with advisors, HR firms, expat communities", "Medium"],
  ];

  risks.forEach(r => {
    ws6.getRow(row).values = r;
    // Color probability
    const probCell = ws6.getRow(row).getCell(4);
    if (r[3].includes("Medium")) {
      probCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_ORANGE } };
    } else if (r[3].includes("Low")) {
      probCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_GREEN } };
    }
    row++;
  });
  styleDataRows(ws6, row - risks.length, row - 1, 4);
  // Re-apply probability colors
  risks.forEach((r, i) => {
    const rr = row - risks.length + i;
    const probCell = ws6.getRow(rr).getCell(4);
    if (r[3].includes("Medium")) {
      probCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_ORANGE } };
    } else {
      probCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_GREEN } };
    }
  });

  // Break-even analysis
  row += 1;
  addTitle(ws6, row, "Break-Even Analysis (Likely Scenario)", 4);
  row++;

  // Find break-even month (when cumulative net income turns positive)
  let cumNet = 0;
  let breakEvenMonth = null;
  for (let i = 0; i < 36; i++) {
    cumNet += likelyData[i].netIncome;
    if (cumNet >= 0 && !breakEvenMonth) {
      breakEvenMonth = i + 1;
    }
  }

  // Find monthly break-even (when MRR > costs)
  let monthlyBE = null;
  for (let i = 0; i < 36; i++) {
    if (likelyData[i].netIncome >= 0 && !monthlyBE) {
      monthlyBE = i + 1;
    }
  }

  const beData = [
    ["Monthly break-even (MRR > costs)", monthlyBE ? `Month ${monthlyBE}` : "Not reached in 36 months", monthlyBE ? `${likelyData[monthlyBE-1].totalPaidSubs} paid subscribers needed` : ""],
    ["Cumulative break-even (total profit > 0)", breakEvenMonth ? `Month ${breakEvenMonth}` : "Not reached in 36 months", breakEvenMonth ? `Recovers all prior losses` : ""],
    ["Minimum viable subs (cover fixed costs)", `${Math.ceil((COSTS.infrastructure.m1 + COSTS.marketing.m1 + COSTS.legal.monthly + COSTS.misc.monthly) / (PRICE_MONTHLY - COSTS.aiApi.perUser - COSTS.support.perUser))} subscribers`, "At launch cost structure"],
    ["Month 36 cumulative net (likely)", `€${cumNet.toLocaleString()}`, cumNet > 0 ? "Profitable over 3 years" : "Still in investment phase"],
  ];

  ws6.getRow(row).values = ["Metric", "Value", "Notes", ""];
  styleSubHeader(ws6, row, 3);
  row++;
  beData.forEach(b => {
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
  const outPath = path.join(__dirname, "RetirAI-Financial-Projections.xlsx");
  await wb.xlsx.writeFile(outPath);
  console.log("Written to:", outPath);
}

generate().catch(e => { console.error(e); process.exit(1); });
