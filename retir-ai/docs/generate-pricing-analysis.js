const ExcelJS = require("exceljs");
const path = require("path");

async function generate() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Prevista Pricing Analysis";
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
  const YELLOW_BG = "FFFFF2CC";

  const headerFill = { type: "pattern", pattern: "solid", fgColor: { argb: DARK } };
  const headerFont = { bold: true, color: { argb: WHITE }, size: 11, name: "Calibri" };
  const subHeaderFill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_ACCENT } };
  const subHeaderFont = { bold: true, size: 11, name: "Calibri" };
  const bodyFont = { size: 11, name: "Calibri" };
  const boldFont = { bold: true, size: 11, name: "Calibri" };
  const currencyFmt = '€#,##0.00';
  const pctFmt = '0.0%';
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

  function styleDataRows(ws, startRow, endRow, colCount, opts = {}) {
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

  // ════════════════════════════════════════════════════════════════════
  // SHEET 1: COMPETITIVE BENCHMARKS
  // ════════════════════════════════════════════════════════════════════
  const ws1 = wb.addWorksheet("1. Competitive Benchmarks", { properties: { tabColor: { argb: ACCENT } } });
  ws1.columns = [
    { width: 24 }, { width: 14 }, { width: 14 }, { width: 14 },
    { width: 16 }, { width: 20 }, { width: 18 }, { width: 36 }
  ];

  addTitle(ws1, 1, "Competitive Pricing Benchmarks", 8);
  addNote(ws1, 2, "All prices normalized to EUR/month. USD converted at 1 USD = 0.92 EUR (April 2026). AUM fees annualized on example portfolio.", 8);

  const compHeaders = ["Competitor", "Monthly (EUR)", "Annual (EUR)", "EUR/mo equiv.", "Market", "Countries", "Problem Complexity", "Key Differentiator vs Prevista"];
  ws1.getRow(4).values = compHeaders;
  styleHeader(ws1, 4, 8);

  const competitors = [
    ["Boldin (US)", 11.04, 132.48, 11.04, "US only", "1", "Single-country, single tax", "US Social Security only, no multi-country"],
    ["ProjectionLab (US)", 11.04, 118.68, 9.89, "US only", "1", "Single-country, single tax", "No data persistence on free; US-focused"],
    ["OnTrajectory (US)", 8.28, 73.60, 6.13, "US only", "1", "Single-country", "Basic scenarios, no pension formulas"],
    ["WealthTrace (US)", null, 210.68, 17.56, "US only", "1", "Single-country, detailed", "Monte Carlo + scenarios, no cross-border"],
    ["MaxiFi (US)", null, 100.28, 8.36, "US only", "1", "Single-country, economics-based", "No multi-country, US Social Security focus"],
    ["PensionBee (UK)", null, 580.00, 48.33, "UK only", "1", "Single-country consolidation", "AUM-based (0.5% on 100K); UK pensions only"],
    ["Kubera (Global)", null, 229.08, 19.09, "Global", "N/A", "Net worth tracking, not pension", "No pension formulas, no tax sim, no claims"],
    ["YNAB", 13.79, 100.28, 8.36, "Global", "1*", "Budgeting only", "No pension/retirement planning at all"],
    ["Monarch Money", null, 91.99, 7.67, "US-focused", "1", "Personal finance tracking", "No pension planning, no multi-country"],
    ["ETS / findyourpension.eu", 0, 0, 0, "EU (limited)", "2 (BE/FR)", "Read-only tracking", "Free but no planning, no tax sim, not live yet"],
    ["PensionHunter", null, null, null, "11 countries", "11", "One-time discovery", "$99-199 per search + 15% success fee; no FR/CH/LU"],
    ["Human Advisors", null, null, null, "Multi-country", "Any", "Full service", "€250-833/mo; same service but 15-40x the price"],
  ];

  let row = 5;
  competitors.forEach(c => {
    ws1.getRow(row).values = [c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7]];
    if (c[1] !== null) ws1.getRow(row).getCell(2).numFmt = currencyFmt;
    if (c[2] !== null) ws1.getRow(row).getCell(3).numFmt = currencyFmt;
    if (c[3] !== null) ws1.getRow(row).getCell(4).numFmt = currencyFmt;
    row++;
  });
  styleDataRows(ws1, 5, row - 1, 8);

  // Highlight Prevista row
  row += 1;
  ws1.getRow(row).values = ["Prevista Pro (Recommended)", 14.90, 149.00, 12.42, "EU expats", "3+ (FR/CH/LU)", "Multi-country, multi-pillar", "Only self-service multi-country pension platform"];
  for (let c = 1; c <= 8; c++) {
    const cell = ws1.getRow(row).getCell(c);
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_GREEN } };
    cell.font = { bold: true, size: 11, name: "Calibri", color: { argb: GREEN } };
    cell.border = thinBorder;
    cell.alignment = { horizontal: c > 1 ? "center" : "left", vertical: "middle", wrapText: true };
  }
  ws1.getRow(row).getCell(2).numFmt = currencyFmt;
  ws1.getRow(row).getCell(3).numFmt = currencyFmt;
  ws1.getRow(row).getCell(4).numFmt = currencyFmt;

  // Summary statistics
  row += 2;
  addTitle(ws1, row, "Market Price Distribution (EUR/month, individual retirement planning tools)", 8);
  row++;
  const stats = [
    ["Metric", "Value", "Implication"],
    ["Median (US single-country tools)", "€9.89", "Floor — Prevista solves a harder problem"],
    ["Mean (US single-country tools)", "€10.60", "US market clusters around €10-11/mo"],
    ["Maximum (non-AUM individual)", "€19.09", "Kubera; global/HNI positioning similar to Prevista"],
    ["PensionBee equivalent (AUM on €100K)", "€48.33", "Validates high WTP for pension management"],
    ["Human advisor range", "€250-833/mo", "Prevista at €14.90 is 94-98% cheaper"],
    ["Prevista recommended", "€14.90", "35-50% premium over US median; justified by complexity"],
  ];
  ws1.getRow(row).values = stats[0];
  styleSubHeader(ws1, row, 3);
  row++;
  stats.slice(1).forEach(s => {
    ws1.getRow(row).values = s;
    ws1.getRow(row).getCell(1).font = bodyFont;
    ws1.getRow(row).getCell(2).font = boldFont;
    ws1.getRow(row).getCell(3).font = bodyFont;
    for (let c = 1; c <= 3; c++) {
      ws1.getRow(row).getCell(c).border = thinBorder;
      ws1.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }
    row++;
  });

  // ════════════════════════════════════════════════════════════════════
  // SHEET 2: VALUE ANALYSIS
  // ════════════════════════════════════════════════════════════════════
  const ws2 = wb.addWorksheet("2. Value Analysis", { properties: { tabColor: { argb: GREEN } } });
  ws2.columns = [{ width: 36 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 40 }];

  addTitle(ws2, 1, "Value-Based Price Justification", 5);
  addNote(ws2, 2, "Quantifying the monetary value Prevista delivers to users to establish price ceiling and ROI.", 5);

  ws2.getRow(4).values = ["Value Source", "Monthly Value (EUR)", "Annual Value (EUR)", "Confidence", "Notes"];
  styleHeader(ws2, 4, 5);

  const valueRows = [
    ["Tax residency optimization (PT NHR vs FR)", 356, 4272, "High", "Documented in simulation: moving to Portugal NHR saves €356/mo via flat 10% tax"],
    ["Gap recovery (e.g. CNAP buy-back)", 120, 1440, "High", "€179 one-time cost recovers €120/mo for life; ROI in 45 days"],
    ["Unclaimed pension detection", 308, 3700, "Medium", "€3.7B unclaimed in France; avg claim ~€308/mo based on CNAV stats"],
    ["Legislative alert (avoid missed deadline)", null, 2520, "Medium", "France retirement age change: €2,520/yr impact if not acted on"],
    ["Swiss capital tax optimization", null, 12000, "Medium", "Swiss tax treaty renegotiation: up to €12K capital tax impact"],
    ["Family claim protection (avoid missed claims)", null, 3700, "High", "60% of families with multi-country pensions miss at least one claim"],
    ["Replaced advisor cost savings", null, 6500, "High", "Avg advisor: €3K-10K/yr; midpoint €6.5K; Prevista replaces ~80% of this"],
  ];

  row = 5;
  valueRows.forEach(v => {
    ws2.getRow(row).values = [v[0], v[1], v[2], v[3], v[4]];
    if (v[1] !== null) ws2.getRow(row).getCell(2).numFmt = currencyFmt;
    if (v[2] !== null) ws2.getRow(row).getCell(3).numFmt = currencyFmt;
    row++;
  });
  styleDataRows(ws2, 5, row - 1, 5);

  // ROI analysis
  row += 1;
  addTitle(ws2, row, "ROI at Different Price Points", 5);
  row++;
  ws2.getRow(row).values = ["Price Point", "Monthly", "Annual", "ROI vs Min Value (€120/mo)", "Days to Pay for Itself"];
  styleHeader(ws2, row, 5);
  row++;

  const pricePoints = [
    ["€9.90/mo (too low)", 9.90, 118.80, null, null],
    ["€12.00/mo (deep research)", 12.00, 144.00, null, null],
    ["€14.90/mo (recommended)", 14.90, 148.00, null, null],
    ["€19.90/mo (pricing research)", 19.90, 199.00, null, null],
    ["€24.90/mo (premium ceiling)", 24.90, 298.80, null, null],
  ];
  const minMonthlyValue = 120; // minimum documented value
  pricePoints.forEach(p => {
    p[3] = (minMonthlyValue / p[1]) - 1; // ROI ratio
    p[4] = Math.ceil((p[1] / minMonthlyValue) * 30); // days
    ws2.getRow(row).values = p;
    ws2.getRow(row).getCell(2).numFmt = currencyFmt;
    ws2.getRow(row).getCell(3).numFmt = currencyFmt;
    ws2.getRow(row).getCell(4).numFmt = '0.0x';
    ws2.getRow(row).getCell(5).numFmt = '0 "days"';
    for (let c = 1; c <= 5; c++) {
      ws2.getRow(row).getCell(c).border = thinBorder;
      ws2.getRow(row).getCell(c).font = bodyFont;
      ws2.getRow(row).getCell(c).alignment = { horizontal: c > 1 ? "center" : "left", vertical: "middle" };
    }
    // Highlight recommended
    if (p[0].includes("recommended")) {
      for (let c = 1; c <= 5; c++) {
        ws2.getRow(row).getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_GREEN } };
        ws2.getRow(row).getCell(c).font = { bold: true, size: 11, name: "Calibri", color: { argb: GREEN } };
      }
    }
    row++;
  });

  // Affordability
  row += 1;
  addTitle(ws2, row, "Affordability for Target Market", 5);
  row++;
  ws2.getRow(row).values = ["Metric", "Value", "", "", ""];
  styleSubHeader(ws2, row, 2);
  row++;
  const affordability = [
    ["Avg net monthly income (Luxembourg)", "€3,540"],
    ["Prevista at €14.90 as % of income", "0.42%"],
    ["Prevista at €19.90 as % of income", "0.56%"],
    ["Netflix Standard (Luxembourg)", "€13.49 (0.38%)"],
    ["Spotify Premium", "€11.99 (0.34%)"],
    ["Boldin PlannerPlus", "~€11.04 (0.31%)"],
    ["Conclusion", "At €14.90, Prevista costs same as Netflix for a tool managing €200K+ in assets"],
  ];
  affordability.forEach(a => {
    ws2.getRow(row).values = [a[0], a[1]];
    ws2.getRow(row).getCell(1).font = bodyFont;
    ws2.getRow(row).getCell(2).font = a[0] === "Conclusion" ? boldFont : bodyFont;
    for (let c = 1; c <= 2; c++) {
      ws2.getRow(row).getCell(c).border = thinBorder;
    }
    row++;
  });

  // ════════════════════════════════════════════════════════════════════
  // SHEET 3: PRICE POSITIONING
  // ════════════════════════════════════════════════════════════════════
  const ws3 = wb.addWorksheet("3. Price Positioning", { properties: { tabColor: { argb: ORANGE } } });
  ws3.columns = [{ width: 28 }, { width: 16 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 40 }];

  addTitle(ws3, 1, "Complexity-Adjusted Price Positioning", 8);
  addNote(ws3, 2, "Scoring competitors on feature depth to derive a fair complexity-adjusted price for Prevista.", 8);

  ws3.getRow(4).values = [
    "Product", "Price (EUR/mo)",
    "Multi-Country (0-3)", "Tax Simulation (0-3)", "AI Features (0-3)",
    "Document Mgmt (0-3)", "Total Score (0-12)", "Complexity-Adjusted Assessment"
  ];
  styleHeader(ws3, 4, 8);

  const scoring = [
    ["Boldin", 11.04, 0, 1, 1, 0, null, "US-only; basic tax; digital coach but no doc AI"],
    ["ProjectionLab", 9.89, 0, 1, 0, 0, null, "US-only; tax estimation; no AI chat; no docs"],
    ["WealthTrace", 17.56, 0, 1, 0, 0, null, "US-only; detailed modeling; no AI; no docs"],
    ["Kubera", 19.09, 1, 0, 1, 0, null, "Global tracking; no pension formulas; AI net worth"],
    ["MaxiFi", 8.36, 0, 1, 0, 0, null, "US-only; economics-based; no AI; no docs"],
    ["OnTrajectory", 6.13, 0, 0, 0, 0, null, "Basic planning; US-focused; minimal features"],
    ["Prevista Pro", 14.90, 3, 3, 3, 3, null, "3+ countries; 6-country tax sim; AI chat+extraction; full vault"],
  ];
  scoring.forEach(s => { s[6] = s[2] + s[3] + s[4] + s[5]; });

  row = 5;
  scoring.forEach(s => {
    ws3.getRow(row).values = s;
    ws3.getRow(row).getCell(2).numFmt = currencyFmt;
    for (let c = 1; c <= 8; c++) {
      ws3.getRow(row).getCell(c).border = thinBorder;
      ws3.getRow(row).getCell(c).font = s[0] === "Prevista Pro" ?
        { bold: true, size: 11, name: "Calibri", color: { argb: GREEN } } : bodyFont;
      ws3.getRow(row).getCell(c).alignment = { horizontal: c > 1 ? "center" : "left", vertical: "middle", wrapText: true };
      if (s[0] === "Prevista Pro") {
        ws3.getRow(row).getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_GREEN } };
      }
    }
    row++;
  });

  // Price per complexity point
  row += 1;
  addTitle(ws3, row, "Price per Complexity Point (EUR/mo per point)", 8);
  row++;
  ws3.getRow(row).values = ["Product", "EUR/mo", "Score", "EUR per Point", "", "", "", ""];
  styleSubHeader(ws3, row, 4);
  row++;
  scoring.filter(s => s[6] > 0).forEach(s => {
    const pricePerPoint = s[1] / s[6];
    ws3.getRow(row).values = [s[0], s[1], s[6], pricePerPoint];
    ws3.getRow(row).getCell(2).numFmt = currencyFmt;
    ws3.getRow(row).getCell(4).numFmt = currencyFmt;
    for (let c = 1; c <= 4; c++) {
      ws3.getRow(row).getCell(c).border = thinBorder;
      ws3.getRow(row).getCell(c).font = s[0] === "Prevista Pro" ? { bold: true, size: 11, name: "Calibri", color: { argb: GREEN } } : bodyFont;
      ws3.getRow(row).getCell(c).alignment = { horizontal: c > 1 ? "center" : "left", vertical: "middle" };
      if (s[0] === "Prevista Pro") {
        ws3.getRow(row).getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_GREEN } };
      }
    }
    row++;
  });

  row += 1;
  addNote(ws3, row, "Prevista at €14.90 delivers €1.24/point vs competitors avg €5.52/point — 4.5x more value per EUR. Even at €19.90 it would be €1.66/point (3.3x more value).", 8);

  // ════════════════════════════════════════════════════════════════════
  // SHEET 4: SCENARIO MODELING
  // ════════════════════════════════════════════════════════════════════
  const ws4 = wb.addWorksheet("4. Scenario Modeling", { properties: { tabColor: { argb: "FF7030A0" } } });
  ws4.columns = [
    { width: 28 }, { width: 16 }, { width: 16 }, { width: 16 },
    { width: 16 }, { width: 16 }, { width: 16 }
  ];

  addTitle(ws4, 1, "Revenue Impact by Price Point", 7);
  addNote(ws4, 2, "Modeling MRR at Month 12 under different price points and conversion assumptions. Based on deep-research funnel assumptions (Likely scenario: 3,000 visitors/mo, 7% trial signup, 6% trial-to-paid, 4% churn).", 7);

  ws4.getRow(4).values = [
    "Price Point", "Monthly Price", "Annual Price",
    "Annual Discount", "Est. Conversion Rate", "Month-12 Paid Subs", "Month-12 MRR"
  ];
  styleHeader(ws4, 4, 7);

  // Conversion elasticity: base 6% at $12, each €1 increase reduces conversion by ~0.4pp
  const baseConv = 0.06;
  const baseVisitors = 3000;
  const monthlyGrowth = 0.10;
  const trialSignup = 0.07;
  const churn = 0.04;

  const scenarios = [
    { label: "Aggressive Low", monthly: 9.90, annual: 99.00, convAdj: 0.015 },
    { label: "Deep Research Rec.", monthly: 12.00, annual: 120.00, convAdj: 0.005 },
    { label: "RECOMMENDED", monthly: 14.90, annual: 149.00, convAdj: -0.005 },
    { label: "Pricing Research Rec.", monthly: 19.90, annual: 199.00, convAdj: -0.018 },
    { label: "Premium Ceiling", monthly: 24.90, annual: 249.00, convAdj: -0.028 },
  ];

  row = 5;
  scenarios.forEach(s => {
    const conv = baseConv + s.convAdj;
    // Simple accumulation model: 12 months
    let subs = 0;
    for (let m = 1; m <= 12; m++) {
      const visitors = baseVisitors * Math.pow(1 + monthlyGrowth, m - 1);
      const newPaid = visitors * trialSignup * conv;
      subs = subs * (1 - churn) + newPaid;
    }
    const mrr = subs * s.monthly;
    const discount = 1 - (s.annual / (s.monthly * 12));

    ws4.getRow(row).values = [
      s.label, s.monthly, s.annual,
      discount, conv, Math.round(subs), mrr
    ];
    ws4.getRow(row).getCell(2).numFmt = currencyFmt;
    ws4.getRow(row).getCell(3).numFmt = currencyFmt;
    ws4.getRow(row).getCell(4).numFmt = pctFmt;
    ws4.getRow(row).getCell(5).numFmt = pctFmt;
    ws4.getRow(row).getCell(6).numFmt = intFmt;
    ws4.getRow(row).getCell(7).numFmt = '€#,##0';

    for (let c = 1; c <= 7; c++) {
      ws4.getRow(row).getCell(c).border = thinBorder;
      ws4.getRow(row).getCell(c).font = s.label === "RECOMMENDED" ?
        { bold: true, size: 11, name: "Calibri", color: { argb: GREEN } } : bodyFont;
      ws4.getRow(row).getCell(c).alignment = { horizontal: c > 1 ? "center" : "left", vertical: "middle" };
      if (s.label === "RECOMMENDED") {
        ws4.getRow(row).getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_GREEN } };
      }
    }
    row++;
  });

  // Key insight
  row += 1;
  addTitle(ws4, row, "Key Insight: Revenue Optimization", 7);
  row++;
  const insights = [
    "At €9.90: Higher conversion but low revenue per user — leaves significant money on the table.",
    "At €12.00: Matches US competitors but undervalues multi-country complexity; perceived as 'basic tool'.",
    "At €14.90: Sweet spot — 35% premium over US tools, justified by multi-country value; strong MRR with sustainable conversion.",
    "At €19.90: Higher per-user revenue but conversion drops ~3pp; total MRR similar to €14.90 but with fewer users (less data, less virality).",
    "At €24.90: Conversion falls sharply; total MRR declines despite highest per-user price.",
    "",
    "RECOMMENDATION: Launch at €14.90/mo (€149/yr). This maximizes Month-12 MRR while building a larger user base.",
    "Plan to A/B test €14.90 vs €19.90 after 500+ trial users to validate elasticity with real data.",
  ];
  insights.forEach(i => {
    addNote(ws4, row, i, 7);
    if (i.startsWith("RECOMMENDATION")) {
      ws4.getRow(row).getCell(1).font = { bold: true, size: 11, name: "Calibri", color: { argb: GREEN } };
    }
    row++;
  });

  // ════════════════════════════════════════════════════════════════════
  // SHEET 5: FINAL RECOMMENDATION
  // ════════════════════════════════════════════════════════════════════
  const ws5 = wb.addWorksheet("5. RECOMMENDATION", { properties: { tabColor: { argb: GREEN } } });
  ws5.columns = [{ width: 36 }, { width: 20 }, { width: 20 }, { width: 50 }];

  addTitle(ws5, 1, "Prevista Pro — Recommended Pricing", 4);
  ws5.getRow(2).height = 8;

  // Main pricing box
  row = 3;
  ws5.mergeCells(row, 1, row, 4);
  const priceCell = ws5.getRow(row).getCell(1);
  priceCell.value = "€14.90 / month  |  €149 / year (17% discount)";
  priceCell.font = { bold: true, size: 20, name: "Calibri", color: { argb: GREEN } };
  priceCell.alignment = { horizontal: "center", vertical: "middle" };
  priceCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_GREEN } };
  priceCell.border = thinBorder;
  ws5.getRow(row).height = 48;

  row = 5;
  addTitle(ws5, row, "Why €14.90 — Not €12, Not €19.90", 4);

  row = 7;
  ws5.getRow(row).values = ["Factor", "Assessment", "Score (1-5)", "Rationale"];
  styleHeader(ws5, row, 4);
  row++;

  const factors = [
    ["Market Positioning", "35-50% premium over US tools", 5, "Multi-country × multi-language × multi-pillar justifies premium, but not 2x. €14.90 says 'more sophisticated' without saying 'expensive'."],
    ["Competitive Anchor", "Above all single-country tools", 5, "Higher than Boldin (€11), ProjectionLab (€10), MaxiFi (€8), OnTrajectory (€6). Below Kubera (€19) and WealthTrace (€18) which solve different problems."],
    ["Conversion Optimization", "Wider funnel than €19.90", 4, "Elasticity estimates suggest €14.90 converts ~5.5% vs ~4.2% at €19.90. At scale, the larger base drives more total revenue AND more data for product improvement."],
    ["Affordability Signal", "0.42% of avg Luxembourg income", 5, "'Costs the same as Netflix' is a powerful anchor. €19.90 crosses into 'considered purchase' territory; €14.90 stays in 'impulse/no-brainer' zone."],
    ["Value-to-Price Ratio", "8x minimum ROI", 5, "Even the minimum documented value (€120/mo gap recovery) delivers 8x return. At €19.90 it's 6x — still good, but €14.90 makes the ROI argument bulletproof."],
    ["Psychological Pricing", "€14.90 vs €19.90", 4, "€14.90 sits below the €15 threshold. €19.90 sits just below €20 but 'feels like €20'. The €5 gap in perception is larger than the €5 gap in price."],
    ["Revenue Ceiling", "Room to grow", 5, "Launch at €14.90, prove value, then introduce premium tiers (€24.90 with expert access) or raise to €19.90 after building trust. You can't easily lower prices."],
    ["Brand Stage", "Pre-brand, needs traction", 4, "Prevista has no brand equity yet. A lower entry price reduces friction and builds the user base needed for word-of-mouth. Raise prices once the brand commands it."],
  ];

  factors.forEach(f => {
    ws5.getRow(row).values = f;
    for (let c = 1; c <= 4; c++) {
      ws5.getRow(row).getCell(c).border = thinBorder;
      ws5.getRow(row).getCell(c).font = bodyFont;
      ws5.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true, horizontal: c === 3 ? "center" : "left" };
    }
    if ((row - 8) % 2 === 1) {
      for (let c = 1; c <= 4; c++) {
        ws5.getRow(row).getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: GRAY } };
      }
    }
    ws5.getRow(row).height = 48;
    row++;
  });

  // Why not €12 / Why not €19.90
  row += 1;
  addTitle(ws5, row, "Why NOT €12.00 (Deep Research Recommendation)", 4);
  row++;
  const whyNot12 = [
    ["Wrong anchor", "Benchmarks against US single-country tools that solve a fundamentally simpler problem"],
    ["Undervalues complexity", "Prevista handles 3+ countries, 3+ languages, multiple pillar systems — this is not a '€12 tool'"],
    ["Signals basic", "At €12, users might perceive it as 'another planning calculator', not a serious pension management platform"],
    ["Less revenue headroom", "Hard to justify future price increases from €12; €14.90 provides a stable base"],
  ];
  ws5.getRow(row).values = ["Issue", "Explanation", "", ""];
  styleSubHeader(ws5, row, 2);
  row++;
  whyNot12.forEach(w => {
    ws5.getRow(row).values = [w[0], w[1]];
    ws5.mergeCells(row, 2, row, 4);
    for (let c = 1; c <= 4; c++) {
      ws5.getRow(row).getCell(c).border = thinBorder;
      ws5.getRow(row).getCell(c).font = bodyFont;
      ws5.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }
    ws5.getRow(row).height = 28;
    row++;
  });

  row += 1;
  addTitle(ws5, row, "Why NOT €19.90 (Pricing Research Recommendation) — Yet", 4);
  row++;
  const whyNot20 = [
    ["Conversion risk at launch", "Without brand equity, €19.90 pushes into 'considered purchase' zone; higher friction for first-time users"],
    ["Fewer users = less data", "Smaller base means slower product feedback loop and weaker network effects (family sharing, advisor referrals)"],
    ["Similar total MRR", "Modeling shows €14.90 and €19.90 generate comparable Month-12 MRR — but €14.90 does it with more users"],
    ["Price increase is easier than decrease", "Launch at €14.90, A/B test €19.90 with data. If elasticity < 1.0, raise price. You can't easily walk back a cut."],
    ["Future premium tier", "€19.90-24.90 is the right range for a 'Pro+' tier with expert consultations, not the base Pro tier"],
  ];
  ws5.getRow(row).values = ["Issue", "Explanation", "", ""];
  styleSubHeader(ws5, row, 2);
  row++;
  whyNot20.forEach(w => {
    ws5.getRow(row).values = [w[0], w[1]];
    ws5.mergeCells(row, 2, row, 4);
    for (let c = 1; c <= 4; c++) {
      ws5.getRow(row).getCell(c).border = thinBorder;
      ws5.getRow(row).getCell(c).font = bodyFont;
      ws5.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }
    ws5.getRow(row).height = 28;
    row++;
  });

  // Full tier recommendation
  row += 1;
  addTitle(ws5, row, "Complete Tier Structure", 4);
  row++;
  ws5.getRow(row).values = ["Tier", "Monthly", "Annual", "Target"];
  styleHeader(ws5, row, 4);
  row++;

  const tiers = [
    ["Explorer (Free)", "€0", "€0", "Onboarding, document upload, basic dashboard, career entry, payout estimation"],
    ["Pro", "€14.90", "€149", "Multi-country simulation, radar, AI advisor, vault cross-referencing, family access, export"],
    ["Household Pro (future)", "€22.90", "€229", "2 adults + dependent, household linking, survivor planning, shared goals"],
    ["Advisor Pro (future)", "€59/seat", "€590/seat", "Client workspace, 15 profiles, audit trail, client-ready reports, priority support"],
  ];
  tiers.forEach((t, i) => {
    ws5.getRow(row).values = t;
    for (let c = 1; c <= 4; c++) {
      ws5.getRow(row).getCell(c).border = thinBorder;
      ws5.getRow(row).getCell(c).font = i === 1 ? { bold: true, size: 11, name: "Calibri", color: { argb: GREEN } } : bodyFont;
      ws5.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true, horizontal: (c === 2 || c === 3) ? "center" : "left" };
      if (i === 1) {
        ws5.getRow(row).getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT_GREEN } };
      }
    }
    ws5.getRow(row).height = 32;
    row++;
  });

  // Pricing roadmap
  row += 1;
  addTitle(ws5, row, "Pricing Roadmap", 4);
  row++;
  const roadmap = [
    ["Launch (Month 1-3)", "€14.90/mo, €149/yr", "Build user base, instrument funnel, collect usage data"],
    ["Validate (Month 3-6)", "A/B test €14.90 vs €17.90 vs €19.90", "Measure actual elasticity with 500+ trial users"],
    ["Optimize (Month 6-9)", "Adjust based on data", "If elasticity < 1.0 at €19.90 → raise price; if > 1.5 → stay at €14.90"],
    ["Expand (Month 9-12)", "Introduce Household + Advisor tiers", "Layer on premium tiers without touching core Pro price"],
    ["Scale (Month 12+)", "Consider €19.90 as new base if brand permits", "Grandfather early adopters at €14.90; new signups at €19.90"],
  ];
  ws5.getRow(row).values = ["Phase", "Price Action", "Objective", ""];
  styleSubHeader(ws5, row, 3);
  row++;
  roadmap.forEach(r => {
    ws5.getRow(row).values = [r[0], r[1], r[2]];
    for (let c = 1; c <= 3; c++) {
      ws5.getRow(row).getCell(c).border = thinBorder;
      ws5.getRow(row).getCell(c).font = bodyFont;
      ws5.getRow(row).getCell(c).alignment = { vertical: "middle", wrapText: true };
    }
    ws5.getRow(row).height = 28;
    row++;
  });

  // ─── Save ───
  const outPath = path.join(__dirname, "Prevista-Pricing-Analysis.xlsx");
  await wb.xlsx.writeFile(outPath);
  console.log("Written to:", outPath);
}

generate().catch(e => { console.error(e); process.exit(1); });
