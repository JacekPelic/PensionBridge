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
  // MODEL — imported from canonical financial-model.js
  // ════════════════════════════════════════════════════════════════════
  // All constants, helpers, and the simulate() function live in
  // financial-model.js. We import here so this generator stays in lockstep
  // with the canonical model (avoids the drift that previously broke this
  // file when the model added founder comp, country-launch costs, and a
  // scenario-dependent FTE schedule).
  const M = require("./financial-model");
  const {
    PRICE_MONTHLY, PRICE_ANNUAL, ANNUAL_SPLIT_TARGET,
    LEAD_GEN_RATE, LEAD_GEN_GAP_PCT, LEAD_GEN_CLICK_PCT, LEAD_GEN_INVEST_PCT,
    LEAD_GEN_EFFECTIVE, AVG_CAPITAL_INVESTED, CAPITAL_ANNUAL_GROWTH,
    AVG_FTE_COST_MONTHLY, ACTIVE_FREE_FACTOR,
    SCENARIOS, COSTS,
    FOUNDER_COMP, COUNTRY_LAUNCH_BURST, COUNTRY_RECURRING,
    ENGINE_SCHEDULE, COUNTRY_NAMES, CORRIDORS,
    BASE_FTE_SCHEDULE, UPSIDE_FTE_SCHEDULE, FTE_SCHEDULE,
    simulate,
  } = M;

  // Run simulations
  const baseData = simulate("base");
  const upsideData = simulate("upside");

  // ════════════════════════════════════════════════════════════════════
  // SHEET 1: EXECUTIVE SUMMARY
  // ════════════════════════════════════════════════════════════════════
  const ws1 = wb.addWorksheet("1. Executive Summary", { properties: { tabColor: { argb: ACCENT } } });
  ws1.columns = [{ width: 32 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 30 }];

  addTitle(ws1, 1, "Prevista — 5-Year Financial Projections", 7);
  addNote(ws1, 2, "Two revenue streams: Subscriptions (€4.99/mo) + Lead Generation (0.03% annual trailing commission on aggregate referred capital — deliberately conservative floor). Two seed-stage acquisition channels: Organic SEO + Distribution Partnerships (paid acquisition is held in reserve as a Series A lever — at €4.99 + 12% conversion paid LTV:CAC is 0.49×). Pure bootstrap: zero external funding required to reach cumulative break-even at M28 (base) / M20 (upside). Geographic expansion: 29 country engines (EU27 + UK + CH) rolled out across 5 years in greedy TAM-maximizing order.", 7);

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
    ["Subscription Revenue", ...yearRevenues.map(d => d.subRev), "€4.99/mo or €49/yr"],
    ["Lead Gen Revenue", ...yearRevenues.map(d => d.leadGenRev), "0.03% annual trailing on aggregate referred capital"],
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
  addNote(wsFunding, 2, "Prevista operates as a pure bootstrap: zero external funding committed. Phase 1 (Months 1-28) builds country engines + organic + partnerships on founder capital, reaching cumulative break-even at M28 (base scenario). Phase 2 (Month 28+) operates profitably on cashflow; no fundraising required to maintain operations. Phase 3 (optional) Series A is a strategic acceleration choice — turn on paid acquisition + scale engineering — only when terms are advantageous and post-launch metrics support it. Country pension engines are built by the technical co-founder; BD co-founder draws salary from M8 (€3K → €5K → €7K as subMRR scales); tech co-founder defers salary until subMRR>€25K.", 7);

  // ── Phase overview ──
  row = 4;
  addTitle(wsFunding, row, "Two-Phase Approach", 7);
  row++;
  wsFunding.getRow(row).values = ["Phase", "Months", "Funding", "Channels Active", "Revenue Streams", "Purpose", ""];
  styleHeader(wsFunding, row, 6);
  row++;

  const phaseRows = [
    ["Phase 1: Bootstrap & Validate", "1-28", "Founder capital (~€60-70K business cash; covers M17 trough of ~€52K plus safety margin and BD draw from M8)", "Organic SEO + Distribution Partnerships", "Subscriptions + lead gen", "Build LU/FR/CH engines, validate conversion, reach cumulative break-even"],
    ["Phase 2: Operate & Expand", "28-60", "Operating cashflow (no fundraising required)", "Organic + Distribution Partnerships", "Subscriptions + lead gen", "Country expansion to 29 engines, profitable operations"],
    ["Phase 3 (Optional): Series A acceleration", "When metrics warrant", "€1-3M (only if terms advantageous)", "+ Paid acquisition turned on", "Subscriptions + lead gen", "Scale paid + engineering team if/when post-launch unit economics validate it"],
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
    ["Signup → paid conversion", "8-12%", "Proves users see enough value to pay €4.99/mo"],
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

  // ── Founder capital requirements (bootstrap) ──
  row += 1;
  addTitle(wsFunding, row, "Founder Capital Requirements — Pure Bootstrap", 7);
  row++;
  addNote(wsFunding, row, "Pure bootstrap: zero external capital required. Founder capital absorbs the operational cash trough (~€52K at M17, base scenario) plus a small safety margin. BD co-founder draws salary from M8 onwards (€3K ramen → €5K sub-market at subMRR>€8K → €7K market at subMRR>€25K); tech co-founder defers salary until subMRR>€25K (~M28 base) and then mirrors BD. Both founder draws are loaded company cost (LU indépendant ~25% social charges; net to founder ~75%). Country pension engines built by technical co-founder; BD partnerships owned by BD co-founder. External capital (grants, angels, Series A) is opportunistic acceleration, not required.", 7);
  row += 2;
  wsFunding.getRow(row).values = ["Component", "Amount", "When Needed", "What It Covers", "Notes", "", ""];
  styleHeader(wsFunding, row, 5);
  row++;

  const fundingRows = [
    ["Operational cash trough", "~€52,000", "M1-M28 (deepest at M17)", "Bridges the business to monthly break-even at M18 then on to cumulative BE at M28", "Founder comp from M8 deepens trough vs zero-comp model; honest about real founder economics"],
    ["Safety margin (recommended)", "+€10,000-20,000", "Reserve", "Hedge against revenue ramp underperformance (2-3 month plan slip)", "Recommended buffer above the modeled trough"],
    ["TOTAL BUSINESS-CASH REQUIREMENT", "~€60-70K", "Through cumulative BE (M28)", "Funds business operations including founder draws — split across two co-founders ≈ €30-35K each", "External capital is opportunistic acceleration, not required"],
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
  addNote(wsFunding, row, "Pure bootstrap — no seed inflow modeled. Shows cash in (revenue only), cash out (operating costs incl. founder comp + country-launch spend), and running cash balance starting from €0. Founder capital absorbs the cash trough at M17 (~€52K negative).", 7);
  row += 2;

  wsFunding.getRow(row).values = ["Month", "Revenue", "Operating Costs", "Paid Acquisition", "Total Cash Out", "Net Cash Flow", "Cash Balance"];
  styleHeader(wsFunding, row, 7);
  row++;

  const SEED_AMOUNT = 0; // Pure bootstrap — founder capital absorbs cash trough (~€10K at M11). External capital is opportunistic acceleration, not required.
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

  // Compute cumulative BE dynamically from baseData (don't hardcode).
  let _cumNet = 0;
  let cumBEMonth = null;
  for (let i = 0; i < 60; i++) {
    _cumNet += baseData[i].netIncome;
    if (_cumNet >= 0 && !cumBEMonth) { cumBEMonth = i + 1; break; }
  }

  const cashMilestones = [
    ["External funding committed", `€${SEED_AMOUNT.toLocaleString()}`, "Pure bootstrap — zero external capital required to reach cumulative break-even"],
    ["Business-cash bridge required", `€${Math.abs(Math.round(peakBurn)).toLocaleString()} (deepest at Month ${peakBurnMonth})`, "Operational cash absorbed during ramp-up — includes BD founder comp from M8 + country-launch costs"],
    ["Avg monthly net burn (pre-BE, Months 1-12)", `€${Math.round(avgMonthlyBurn).toLocaleString()}/mo`, "Operating costs minus revenue while the funnel is ramping"],
    ["Monthly break-even", monthlyBECash ? `Month ${monthlyBECash}` : "Not in 60 months", "When monthly revenue exceeds monthly costs"],
    ["Cumulative break-even", cumBEMonth ? `Month ${cumBEMonth}` : "Not in 60 months", "All prior losses recovered; cumulative cashflow positive thereafter"],
    ["Recommended business buffer (with safety margin)", "~€60-70K", "Operational cash trough plus safety margin against revenue ramp slip"],
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

  // ── What external capital would add (optional acceleration) ──
  row += 1;
  addTitle(wsFunding, row, "Optional: What External Capital Would Accelerate", 7);
  row++;
  addNote(wsFunding, row, "The base model is the pure-bootstrap path. If external capital is raised opportunistically (grants, angels, Series A), it would be deployed to accelerate beyond the bootstrap baseline. The illustrative comparison below shows the bootstrap canonical path vs. a hypothetical Series A-funded scenario where paid acquisition is turned on at validated economics.", 7);
  row += 2;

  // Bootstrap (canonical) is baseData. Hypothetical Series A overlay assumes paid acq turned on.
  // Rough estimate: Series A would lift Y3 subs by ~15-20% via paid channel addition + faster country rollout.
  const bootstrapY3 = baseData[35];
  const seriesAY3Subs = Math.round(bootstrapY3.totalPaidSubs * 1.18); // hypothetical 18% lift from paid
  const seriesAY3ARR = Math.round(seriesAY3Subs * PRICE_MONTHLY * 12 + bootstrapY3.totalARR - bootstrapY3.subARR);

  wsFunding.getRow(row).values = ["Metric", "Bootstrap (canonical)", "With Series A acceleration (hypothetical)", "Lift", "", "", ""];
  styleHeader(wsFunding, row, 4);
  row++;

  const comparisonRows = [
    ["Year 3 paying subscribers", bootstrapY3.totalPaidSubs, seriesAY3Subs, seriesAY3Subs - bootstrapY3.totalPaidSubs],
    ["Year 3 ARR", bootstrapY3.totalARR, seriesAY3ARR, seriesAY3ARR - bootstrapY3.totalARR],
    ["Countries supported by Year 3", `${bootstrapY3.countriesLive} (organic build)`, `${bootstrapY3.countriesLive + 4} (compressed by funded engineering hires)`, "+4 countries earlier"],
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

  // COUNTRY_NAMES is destructured from the model import above.

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
  addNote(ws2, 2, "Column conventions — '/mo' = value flowed in that month (monthly flow); 'Cum.' = cumulative since M1; '(end)' = state at end of month (snapshot, not flow). Two seed-stage acquisition channels (organic SEO + distribution partnerships) × two revenue streams (subscriptions + lead gen). Paid acquisition is held in reserve as a Series A lever — at €4.99/mo + 12% conversion paid LTV:CAC is 0.49× (loss-making per channel). Addressable market grows as country engines come online (see Engine Schedule sheet). FTE schedule is scenario-dependent: base hires 4 by M60 (first hire M30, just before cumulative BE at M28); upside hires 8 by M60 (first hire M28). All hiring funded from operating cashflow (pure bootstrap). BD co-founder draws salary from M8 (€3K → €5K → €7K as subMRR scales); tech co-founder defers until subMRR>€25K.", 22);

  row = 4;
  ws2.getRow(row).values = [
    "Mo",
    "Countries\n(end)",
    "Addressable\n(end)",
    "Organic\nSignups /mo",
    "Paid\nSignups /mo",
    "Active\nPartners (end)",
    "Partner\nSignups /mo",
    "New Signups\n/mo (all chs)",
    "Cum.\nSignups",
    "New Paid\n/mo",
    "Churned\n/mo",
    "Paid Subs\n(end)",
    "Sub Rev\n/mo",
    "LeadGen\nRev /mo",
    "Total Rev\n/mo",
    "Cum.\nRevenue",
    "FTEs\n(end)",
    "FTE Salary\n/mo",
    "Total Costs\n/mo",
    "Net Income\n/mo",
    "Cum.\nNet",
    "Capital\n(end)"
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
  addTitle(ws3, row, "Stream 1: Subscriptions (€4.99/mo / €49/yr)", 7);
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
  addTitle(ws3, row, "Stream 2: Lead Generation (0.03% annual trailing on aggregate referred capital)", 7);
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
    ["Annual lead gen revenue", ...yearRevenues.map(d => d.leadGenRev), "0.03% annual trailing on aggregate referred capital"],
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
  addNote(ws4, 2, "Co-founder salaries are INCLUDED from M8 (BD ramen €3K) with step-ups at subMRR thresholds. Tech co-founder defers until subMRR>€25K (~M28 base). Team line reflects scenario-dependent FTE schedule: base = 4 FTEs by M60 (first hire M30); upside = 8 FTEs by M60. Country-launch line covers per-engine launch burst (€1K/engine in launch month) plus persistent per-live-country recurring (€100/mo). All funded from operating cashflow (pure bootstrap — no seed funding).", 7);

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
      countryLaunch: slice.reduce((s,d) => s + d.countryLaunchBurst + d.countryRecurring, 0),
      support: slice.reduce((s,d) => s + d.supportCost, 0),
      legal: slice.reduce((s,d) => s + d.legalCost, 0),
      misc: slice.reduce((s,d) => s + d.miscCost, 0),
      founderComp: slice.reduce((s,d) => s + d.founderComp, 0),
      team: slice.reduce((s,d) => s + d.salaryCost, 0),
      paidAcq: slice.reduce((s,d) => s + d.paidAcqCost, 0),
      endFtes: slice[slice.length - 1].activeFtes,
    };
  });

  const sumOpex = (yc) => yc.infra + yc.ai + yc.marketing + yc.countryLaunch + yc.support + yc.legal + yc.misc + yc.founderComp + yc.team;
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
    { label: "  Content & SEO (global tooling)", values: yearCosts.map(d => d.marketing) },
    { label: "  Country launch + recurring", values: yearCosts.map(d => d.countryLaunch) },
    { label: "  Support", values: yearCosts.map(d => d.support) },
    { label: "  Legal / Compliance", values: yearCosts.map(d => d.legal) },
    { label: "  Miscellaneous", values: yearCosts.map(d => d.misc) },
    { label: "  Founder comp (BD + Tech)", values: yearCosts.map(d => d.founderComp) },
    { label: "  Team (FTEs)", values: yearCosts.map(d => d.team) },
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
    ["Monthly subscription price", PRICE_MONTHLY, currencyFmt2, "€4.99/month — repositioned as accessible-tool pricing (volume thesis)"],
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

  // Lead gen LTV: flat 0.03% applied to investor's compounding capital over
  // the 10-year holding period. Conservative floor — actual distribution
  // rates in LU/FR are higher but 0.03% is the figure used in all investor
  // narrative.
  const HOLDING_YEARS = 10;
  let investorLTV = 0;
  let capitalAtYear = AVG_CAPITAL_INVESTED;
  for (let y = 0; y < HOLDING_YEARS; y++) {
    investorLTV += capitalAtYear * LEAD_GEN_RATE;
    capitalAtYear *= (1 + CAPITAL_ANNUAL_GROWTH);
  }
  const perUserLeadGenLTV = Math.round(LEAD_GEN_EFFECTIVE * investorLTV * 100) / 100;

  const leadLtvRows = [
    ["% of users with retirement gap", LEAD_GEN_GAP_PCT, pctFmt, "Inherent to multi-country career profiles"],
    ["% who click product offer", LEAD_GEN_CLICK_PCT, pctFmt, "High-intent context (viewing their gap)"],
    ["% who invest via referral", LEAD_GEN_INVEST_PCT, pctFmt, "Qualified financial product conversion"],
    ["Effective conversion (all users)", LEAD_GEN_EFFECTIVE, pctFmt, "80% × 25% × 15% = 3%"],
    ["Average capital invested", AVG_CAPITAL_INVESTED, currencyFmt, "Initial placement + early contributions; rollover pathway alone defends this"],
    ["Annual trailing commission rate", LEAD_GEN_RATE, pctFmt, "Conservative floor — actual LU/FR retail rates are higher"],
    ["Annual commission per investor (Y1)", AVG_CAPITAL_INVESTED * LEAD_GEN_RATE, currencyFmt2, "Flat 0.03% × invested capital"],
    ["Average holding period", `${HOLDING_YEARS}+ years`, null, "Pension/retirement products are long-duration"],
    ["Lead gen LTV per investor", Math.round(investorLTV), currencyFmt, "Σ (capital_y × 0.03%) over holding period"],
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

  addTitle(ws6, 1, "Founder Capital, Key Assumptions & Risks", 4);

  // Founder capital
  row = 3;
  addTitle(ws6, row, "Founder Capital — Pure Bootstrap (Zero External Funding)", 4);
  row++;
  ws6.getRow(row).values = ["Component", "Amount", "What It Covers", "Notes"];
  styleHeader(ws6, row, 4);
  row++;

  const seedRows = [
    ["Operational cash trough", "~€52,000", "Bridges to monthly break-even at M18 then on to cumulative BE at M28 (deepest negative cash at M17)", "Includes BD founder comp from M8 onwards — honest about real founder economics"],
    ["Safety margin (recommended)", "+€10,000-20,000", "Hedge against 2-3 month revenue ramp slip", "Cushion above the modeled trough"],
    ["TOTAL BUSINESS-CASH REQUIREMENT", "~€60-70K", "Operational + founder draws through cumulative BE (M28)", "Split across two co-founders ≈ €30-35K each. External capital is opportunistic acceleration, not required"],
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
    ["Subscription price", "€4.99/mo / €49/yr", "Repositioned from €14.90 — accessible-tool pricing to maximize volume; bets on conversion lift + lead-gen LTV", "Critical — model is highly sensitive to whether lower price drives proportional conversion lift"],
    ["Organic reach (Year 1)", "4% of addressable", "Niche SaaS benchmarks (OpenView); concentrated LU market", "High — depends on SEO execution"],
    ["Email capture rate", "30%", "Financial calculator industry 20-40% (Unbounce 2025)", "Medium — depends on report value prop"],
    ["Email → signup", "18%", "SaaS drip campaign benchmarks 10-20% (HubSpot)", "Medium"],
    ["Signup → paid conversion", "12%", "Freemium financial tools 8-15% where free tier surfaces problems", "High — most critical metric"],
    ["Monthly churn", "3% (improving to ~2.1% with maturity)", "Recurly 2025 finance category median: 3.7% — sit below median given multi-year pension context", "High impact on long-term subs"],
    ["Paid acquisition CAC (hypothetical — paid is reserved)", "€40/signup base param (currently zero spend)", "At €4.99/mo + 12% conversion, paid LTV:CAC is 0.49× — loss-making per channel. Paid is held as a Series A lever to be turned on once post-launch CAC + conversion data validate it. Parameters retained for that future scenario.", "Low — paid is deferred until validated"],
    ["Lead gen conversion", "3% of all signups", "80% gap × 25% click × 15% invest", "Medium — depends on product partners"],
    ["Avg capital invested", "€125,000", "Initial placement + early contributions; rollover-pathway clients (vested CH pillar 2 cash-out, FR PER consolidation) defend the higher figure for the multi-country demo", "Wide range: €50K-300K"],
    ["Capital annual growth", "9%", "~5% market returns + ~4% ongoing top-ups by users actively closing their gap", "Medium — depends on user contribution behaviour"],
    ["Trailing commission rate", "0.03% flat", "Deliberately conservative floor. Realistic LU/FR retail distribution rates are 1-1.5% (Swiss Life, Foyer benchmarks); 0.03% is used in all narrative as an underpromise.", "Low — actual rates expected to be much higher; floor is robust"],
    ["Co-founder salaries (BD)", "€3K from M8 → €5K at subMRR>€8K → €7K at subMRR>€25K", "Loaded company cost incl. ~25% LU indépendant social charges. Net to founder ~75% of these. BD goes full-time at M7, first paycheck M8.", "Medium — recruiting reality requires this"],
    ["Co-founder salaries (Tech)", "€0 until subMRR>€25K (~M28 base / M22 upside) → €5K → €7K at subMRR>€60K", "Tech defers because (a) BD is binding constraint earlier post-launch, (b) tech founder has higher pain tolerance for low-pay phase", "Low — deferred salary protects trough"],
    ["FTE ramp (base scenario)", "0→0→1→1→4 FTEs by end Y1-Y5 (first hire M30)", "Conservative ramp tied to subscriber-revenue ramp in base. Funded from cashflow not seed. Roles unspecified (engineering / content / CS / ops mix).", "Medium — scales with growth, flexible"],
    ["FTE ramp (upside scenario)", "0→0→2→5→8 FTEs by end Y1-Y5 (first hire M28)", "Aggressive ramp justified by upside revenue trajectory. Same role mix.", "Medium — scenario-conditional"],
    ["Avg loaded FTE cost", "€8,000/mo", "LU market senior-leaning hire mix: ~€85K gross + ~14% social charges + equipment/desk", "Low — well-benchmarked"],
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
    ["Paid acquisition CAC too high (Series A scenario)", "If/when paid is turned on with Series A capital, unprofitable per-channel growth if CAC > €25/signup at current price", "Defer paid activation until post-launch data confirms LTV:CAC ≥ 1.0×; bootstrap path doesn't depend on paid", "Low — deferred"],
    ["Lead gen commission rate below floor", "0.03% floor not achievable → lead-gen revenue collapses to negligible", "Subscription-only business still reaches €3.5M Y5 ARR; lead gen is upside on top of core. 0.03% is already a deliberate underpromise vs realistic 1-1.5% market rates, so risk is low.", "Low"],
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
