const PptxGenJS = require("pptxgenjs");
const path = require("path");

async function generate() {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.33" × 7.5"
  pptx.author = "Prevista";
  pptx.company = "Prevista";
  pptx.title = "Prevista — Investor Pitch (Seed)";
  pptx.subject = "Cross-border pension intelligence for European mobile workers";

  // ─── Brand palette (matches generate-financial-projections.js) ───
  const DARK = "1B2A4A";
  const ACCENT = "2E75B6";
  const LIGHT_ACCENT = "D6E4F0";
  const GREEN = "548235";
  const LIGHT_GREEN = "E2EFDA";
  const ORANGE = "ED7D31";
  const LIGHT_ORANGE = "FCE4D6";
  const GOLD = "B8860B";
  const LIGHT_GOLD = "FFF8DC";
  const WHITE = "FFFFFF";
  const GRAY_LIGHT = "F2F2F2";
  const GRAY_MED = "808080";
  const BODY = "333333";

  // ─── Master slide: top accent bar + footer ───
  pptx.defineSlideMaster({
    title: "MASTER",
    background: { color: WHITE },
    objects: [
      { rect: { x: 0, y: 0, w: 13.33, h: 0.18, fill: { color: ACCENT } } },
      {
        text: {
          text: "Prevista — Investor Pitch — Confidential",
          options: { x: 0.5, y: 7.05, w: 8, h: 0.3, fontSize: 9, color: GRAY_MED, italic: true, fontFace: "Calibri" },
        },
      },
    ],
    slideNumber: { x: 12.5, y: 7.05, w: 0.5, h: 0.3, fontSize: 9, color: GRAY_MED, fontFace: "Calibri" },
  });

  // ─── Helpers ───
  function addTitleSlide() {
    const s = pptx.addSlide();
    // Background block
    s.addShape("rect", { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: DARK } });
    // Accent stripe
    s.addShape("rect", { x: 0, y: 5.4, w: 13.33, h: 0.08, fill: { color: ACCENT } });
    // Brand mark
    s.addText("Prevista", {
      x: 0.7, y: 2.0, w: 12, h: 1.4,
      fontSize: 80, bold: true, color: WHITE, fontFace: "Calibri",
    });
    s.addText("Cross-border pension intelligence for European mobile workers", {
      x: 0.7, y: 3.5, w: 12, h: 0.8,
      fontSize: 24, color: LIGHT_ACCENT, fontFace: "Calibri", italic: true,
    });
    s.addText("Investor Pitch  ·  Seed Round €230K  ·  April 2026", {
      x: 0.7, y: 5.7, w: 12, h: 0.5,
      fontSize: 16, color: WHITE, fontFace: "Calibri",
    });
    s.addText("From fragmented entitlements to a unified retirement view.", {
      x: 0.7, y: 6.3, w: 12, h: 0.4,
      fontSize: 13, color: LIGHT_ACCENT, fontFace: "Calibri", italic: true,
    });
  }

  function addContentSlide(title, subtitle) {
    const s = pptx.addSlide({ masterName: "MASTER" });
    s.addText(title, {
      x: 0.5, y: 0.4, w: 12.33, h: 0.6,
      fontSize: 28, bold: true, color: DARK, fontFace: "Calibri",
    });
    s.addShape("rect", { x: 0.5, y: 1.05, w: 1.5, h: 0.06, fill: { color: ACCENT } });
    if (subtitle) {
      s.addText(subtitle, {
        x: 0.5, y: 1.15, w: 12.33, h: 0.45,
        fontSize: 14, italic: true, color: GRAY_MED, fontFace: "Calibri",
      });
    }
    return s;
  }

  function bullet(text, opts = {}) {
    return {
      text,
      options: {
        bullet: { code: "25A0" }, // small filled square
        fontSize: 14,
        color: BODY,
        fontFace: "Calibri",
        paraSpaceAfter: 8,
        ...opts,
      },
    };
  }

  function bold(text) {
    return { text, options: { bold: true, color: DARK } };
  }

  // ════════════════════════════════════════════════════════════════════
  // SLIDE 1 — Title
  // ════════════════════════════════════════════════════════════════════
  addTitleSlide();

  // ════════════════════════════════════════════════════════════════════
  // SLIDE 2 — The Problem
  // ════════════════════════════════════════════════════════════════════
  {
    const s = addContentSlide("The Problem", "17 million Europeans have pension entitlements scattered across countries");

    s.addText([
      bullet("Each EU country runs its own pension system — unique rules, formulas, retrieval procedures, and contribution histories"),
      bullet("17M EU citizens live in a member state other than their own (Eurostat). Most have entitlements in 2+ countries with no unified view"),
      bullet("Government dashboards are single-country and read-only — useless for the cross-border picture"),
      bullet("Specialised cross-border pension advisors charge €500-2,000/year — out of reach for the mass market"),
      bullet("Result: people don't know what they're entitled to, fail to plan, and leave significant money on the table"),
    ], {
      x: 0.7, y: 1.85, w: 12, h: 4.5,
    });

    // Pull-quote box
    s.addShape("rect", { x: 0.7, y: 6.0, w: 11.93, h: 0.85, fill: { color: LIGHT_ACCENT }, line: { color: ACCENT, width: 0.75 } });
    s.addText('"I worked in 4 countries over 30 years. I have no idea what my retirement income will actually be. Every authority shows me a different number."', {
      x: 0.85, y: 6.05, w: 11.6, h: 0.75,
      fontSize: 13, italic: true, color: DARK, fontFace: "Calibri", valign: "middle",
    });
  }

  // ════════════════════════════════════════════════════════════════════
  // SLIDE 3 — The Solution
  // ════════════════════════════════════════════════════════════════════
  {
    const s = addContentSlide("The Solution", "The first cross-border pension intelligence platform built for European mobile workers");

    s.addText([
      { text: "Free calculator", options: { bullet: { code: "25A0" }, fontSize: 14, bold: true, color: DARK, fontFace: "Calibri", paraSpaceAfter: 4 } },
      { text: "        Instant multi-country pension estimates in 2 minutes. The acquisition wedge.", options: { fontSize: 13, color: BODY, fontFace: "Calibri", paraSpaceAfter: 10 } },

      { text: "Paid platform (€14.90/mo)", options: { bullet: { code: "25A0" }, fontSize: 14, bold: true, color: DARK, fontFace: "Calibri", paraSpaceAfter: 4 } },
      { text: "        Full multi-country simulation, gap analysis, retirement scenarios, document vault, family sharing.", options: { fontSize: 13, color: BODY, fontFace: "Calibri", paraSpaceAfter: 10 } },

      { text: "AI-powered data extraction", options: { bullet: { code: "25A0" }, fontSize: 14, bold: true, color: DARK, fontFace: "Calibri", paraSpaceAfter: 4 } },
      { text: "        Upload official pension documents (relevés, décomptes, Renten­auskunft). AI extracts and normalises the data.", options: { fontSize: 13, color: BODY, fontFace: "Calibri", paraSpaceAfter: 10 } },

      { text: "Built on EU Regulation 883/2004", options: { bullet: { code: "25A0" }, fontSize: 14, bold: true, color: DARK, fontFace: "Calibri", paraSpaceAfter: 4 } },
      { text: "        The same cross-border coordination rules pension authorities themselves use. Country-specific engines for each EU member state.", options: { fontSize: 13, color: BODY, fontFace: "Calibri", paraSpaceAfter: 10 } },

      { text: "One screen, full retirement picture", options: { bullet: { code: "25A0" }, fontSize: 14, bold: true, color: DARK, fontFace: "Calibri", paraSpaceAfter: 4 } },
      { text: "        Total monthly retirement income, broken down by country, with gap analysis and what-if scenarios.", options: { fontSize: 13, color: BODY, fontFace: "Calibri", paraSpaceAfter: 0 } },
    ], {
      x: 0.7, y: 1.85, w: 12, h: 5.0,
    });
  }

  // ════════════════════════════════════════════════════════════════════
  // SLIDE 4 — Product (Calculator-Led PLG)
  // ════════════════════════════════════════════════════════════════════
  {
    const s = addContentSlide("Product", "A calculator-led PLG funnel that converts cross-border workers into paying users");

    // Funnel diagram - 5 boxes left to right
    const funnelY = 2.0;
    const funnelH = 1.4;
    const boxW = 2.2;
    const gapW = 0.2;
    const startX = 0.7;
    const stages = [
      { title: "Find calculator", subtitle: "SEO, community, ads", color: LIGHT_ACCENT },
      { title: "Use calculator", subtitle: "2-min input → estimate", color: LIGHT_ACCENT },
      { title: "Email capture", subtitle: "Detailed report → drip", color: LIGHT_ACCENT },
      { title: "Platform signup", subtitle: "Free tier (gap visible)", color: LIGHT_ACCENT },
      { title: "Pro subscriber", subtitle: "€14.90/mo", color: LIGHT_GREEN },
    ];
    stages.forEach((stage, i) => {
      const x = startX + i * (boxW + gapW);
      s.addShape("rect", { x, y: funnelY, w: boxW, h: funnelH, fill: { color: stage.color }, line: { color: ACCENT, width: 1 } });
      s.addText(stage.title, { x, y: funnelY + 0.25, w: boxW, h: 0.4, fontSize: 14, bold: true, color: DARK, align: "center", fontFace: "Calibri" });
      s.addText(stage.subtitle, { x, y: funnelY + 0.65, w: boxW, h: 0.5, fontSize: 11, color: BODY, align: "center", fontFace: "Calibri", italic: true });
      if (i < stages.length - 1) {
        s.addText("▶", { x: x + boxW - 0.05, y: funnelY + 0.4, w: 0.3, h: 0.6, fontSize: 16, color: ACCENT, fontFace: "Calibri" });
      }
    });

    // Conversion rates row
    s.addText("Funnel benchmarks:  Calculator → email 30%   ·   Email → signup 18%   ·   Signup → paid 10%   ·   Monthly churn 4%", {
      x: 0.7, y: 3.65, w: 12, h: 0.4,
      fontSize: 12, italic: true, color: GRAY_MED, fontFace: "Calibri", align: "center",
    });

    // Key features below
    s.addText("Platform features that convert free users to paid:", {
      x: 0.7, y: 4.3, w: 12, h: 0.4,
      fontSize: 14, bold: true, color: DARK, fontFace: "Calibri",
    });
    s.addText([
      bullet("Multi-country pension simulator with up to 29 country engines (Y5)"),
      bullet("Document vault: AI-powered extraction from official pension statements"),
      bullet("Scenario modelling: retire-early, late-contribution, country-switch what-ifs"),
      bullet("Family sharing: couples plan together, see joint retirement projection"),
      bullet("Lead-gen integration: financial products that bridge the identified gap"),
    ], {
      x: 0.7, y: 4.7, w: 12, h: 2.3,
    });
  }

  // ════════════════════════════════════════════════════════════════════
  // SLIDE 5 — Market
  // ════════════════════════════════════════════════════════════════════
  {
    const s = addContentSlide("Market", "A 17M-person addressable market with no direct competitor");

    // Key numbers — three big tiles
    const tiles = [
      { num: "140K", label: "Luxembourg beachhead", sub: "Multi-country residents, validated via STATEC", color: LIGHT_ACCENT, fc: DARK },
      { num: "12M", label: "Year 5 reachable TAM", sub: "29 country engines × bilateral corridors", color: LIGHT_GREEN, fc: GREEN },
      { num: "17M", label: "EU mobile workers (ceiling)", sub: "Eurostat — citizens in non-home member state", color: LIGHT_GOLD, fc: GOLD },
    ];
    tiles.forEach((t, i) => {
      const x = 0.7 + i * 4.2;
      s.addShape("rect", { x, y: 1.95, w: 4.0, h: 1.85, fill: { color: t.color }, line: { color: t.fc, width: 1.5 } });
      s.addText(t.num, { x, y: 2.05, w: 4.0, h: 0.85, fontSize: 48, bold: true, color: t.fc, align: "center", fontFace: "Calibri" });
      s.addText(t.label, { x, y: 2.95, w: 4.0, h: 0.4, fontSize: 14, bold: true, color: DARK, align: "center", fontFace: "Calibri" });
      s.addText(t.sub, { x, y: 3.35, w: 4.0, h: 0.45, fontSize: 11, italic: true, color: BODY, align: "center", fontFace: "Calibri" });
    });

    s.addText("Why no incumbent has solved this:", {
      x: 0.7, y: 4.2, w: 12, h: 0.4,
      fontSize: 14, bold: true, color: DARK, fontFace: "Calibri",
    });
    s.addText([
      bullet("Government tools are single-country and read-only — they were never designed for cross-border use"),
      bullet("US SaaS (Boldin, ProjectionLab) cover only US Social Security — no European pension engines"),
      bullet("Cross-border financial advisors charge €500-2,000/yr and don't scale below the wealth-management segment"),
      bullet("Building 27+ country pension engines under EU Regulation 883/2004 is the moat — slow, technical, jurisdiction-specific"),
    ], {
      x: 0.7, y: 4.6, w: 12, h: 2.4,
    });
  }

  // ════════════════════════════════════════════════════════════════════
  // SLIDE 6 — Geographic Strategy (Corridor Expansion)
  // ════════════════════════════════════════════════════════════════════
  {
    const s = addContentSlide("Geographic Expansion", "Corridor-driven: 29 country engines covering all of EU + UK + CH by Year 5");

    s.addText("The unlock principle:", {
      x: 0.7, y: 1.85, w: 12, h: 0.35,
      fontSize: 13, bold: true, color: DARK, fontFace: "Calibri",
    });
    s.addText("Each new country engine unlocks bilateral pension corridors with all already-supported countries. Adding Portugal after LU+FR doesn't just add 56K Luxembourg residents — it also unlocks ~358K Portuguese living in France. Engines are sequenced in greedy TAM-maximising order.", {
      x: 0.7, y: 2.18, w: 12, h: 0.7,
      fontSize: 12, color: BODY, fontFace: "Calibri", italic: true,
    });

    // Year-by-year rollout table
    const rows = [
      [
        { text: "Year", options: { fill: { color: DARK }, color: WHITE, bold: true, fontSize: 12, align: "center", valign: "middle" } },
        { text: "Engines added", options: { fill: { color: DARK }, color: WHITE, bold: true, fontSize: 12, align: "center", valign: "middle" } },
        { text: "Cumulative", options: { fill: { color: DARK }, color: WHITE, bold: true, fontSize: 12, align: "center", valign: "middle" } },
        { text: "Strategic step", options: { fill: { color: DARK }, color: WHITE, bold: true, fontSize: 12, align: "center", valign: "middle" } },
        { text: "Addressable (≈)", options: { fill: { color: DARK }, color: WHITE, bold: true, fontSize: 12, align: "center", valign: "middle" } },
      ],
      [
        { text: "Y1", options: { bold: true, fontSize: 12, align: "center", valign: "middle" } },
        { text: "LU, PT, FR, ES", options: { fontSize: 11, valign: "middle" } },
        { text: "4", options: { fontSize: 12, align: "center", valign: "middle" } },
        { text: "Iberian + French sphere — bootstrap funnel validation", options: { fontSize: 11, valign: "middle" } },
        { text: "540K", options: { fontSize: 12, align: "center", valign: "middle" } },
      ],
      [
        { text: "Y2", options: { bold: true, fontSize: 12, align: "center", valign: "middle", fill: { color: GRAY_LIGHT } } },
        { text: "+ DE, PL, RO", options: { fontSize: 11, valign: "middle", fill: { color: GRAY_LIGHT } } },
        { text: "7", options: { fontSize: 12, align: "center", valign: "middle", fill: { color: GRAY_LIGHT } } },
        { text: "German hub + Eastern EU diasporas (largest TAM unlock)", options: { fontSize: 11, valign: "middle", fill: { color: GRAY_LIGHT } } },
        { text: "2.8M", options: { fontSize: 12, align: "center", valign: "middle", fill: { color: GRAY_LIGHT } } },
      ],
      [
        { text: "Y3", options: { bold: true, fontSize: 12, align: "center", valign: "middle" } },
        { text: "+ IT, UK, CH, BE, NL, AT", options: { fontSize: 11, valign: "middle" } },
        { text: "13", options: { fontSize: 12, align: "center", valign: "middle" } },
        { text: "Major Western European markets", options: { fontSize: 11, valign: "middle" } },
        { text: "8.1M", options: { fontSize: 12, align: "center", valign: "middle" } },
      ],
      [
        { text: "Y4", options: { bold: true, fontSize: 12, align: "center", valign: "middle", fill: { color: GRAY_LIGHT } } },
        { text: "+ HU, IE, HR, BG, GR, CZ", options: { fontSize: 11, valign: "middle", fill: { color: GRAY_LIGHT } } },
        { text: "19", options: { fontSize: 12, align: "center", valign: "middle", fill: { color: GRAY_LIGHT } } },
        { text: "Central + Mediterranean", options: { fontSize: 11, valign: "middle", fill: { color: GRAY_LIGHT } } },
        { text: "10.5M", options: { fontSize: 12, align: "center", valign: "middle", fill: { color: GRAY_LIGHT } } },
      ],
      [
        { text: "Y5", options: { bold: true, fontSize: 12, align: "center", valign: "middle", fill: { color: LIGHT_GREEN } } },
        { text: "+ SK, LT, LV, SI, SE, DK, FI, CY, EE, MT", options: { fontSize: 11, valign: "middle", fill: { color: LIGHT_GREEN } } },
        { text: "29", options: { fontSize: 12, bold: true, align: "center", valign: "middle", fill: { color: LIGHT_GREEN }, color: GREEN } },
        { text: "Long tail — full EU + UK + CH coverage", options: { fontSize: 11, bold: true, valign: "middle", fill: { color: LIGHT_GREEN } } },
        { text: "12M", options: { fontSize: 12, bold: true, align: "center", valign: "middle", fill: { color: LIGHT_GREEN }, color: GREEN } },
      ],
    ];
    s.addTable(rows, {
      x: 0.7, y: 3.0, w: 12, colW: [0.7, 3.6, 1.3, 4.7, 1.7],
      border: { type: "solid", pt: 0.5, color: GRAY_MED },
      fontFace: "Calibri",
    });

    s.addText("Schedule built into the financial model — see 'Engine Schedule' sheet of the projections workbook.", {
      x: 0.7, y: 6.65, w: 12, h: 0.35,
      fontSize: 11, italic: true, color: GRAY_MED, fontFace: "Calibri",
    });
  }

  // ════════════════════════════════════════════════════════════════════
  // SLIDE 7 — Business Model
  // ════════════════════════════════════════════════════════════════════
  {
    const s = addContentSlide("Business Model", "Two complementary revenue streams");

    // Two columns
    const colY = 1.95;
    const colW = 5.85;
    const colH = 4.7;

    // LEFT — Subscriptions
    s.addShape("rect", { x: 0.7, y: colY, w: colW, h: colH, fill: { color: LIGHT_ACCENT }, line: { color: ACCENT, width: 1 } });
    s.addText("Subscriptions", { x: 0.85, y: colY + 0.15, w: colW - 0.3, h: 0.5, fontSize: 22, bold: true, color: DARK, fontFace: "Calibri" });
    s.addText("€14.90/mo  ·  €149/yr", { x: 0.85, y: colY + 0.7, w: colW - 0.3, h: 0.4, fontSize: 16, color: ACCENT, bold: true, fontFace: "Calibri" });
    s.addText([
      bullet("Pro tier: full multi-country simulation, vault, scenarios, family sharing", { fontSize: 12 }),
      bullet("Predictable monthly recurring revenue, ~95% of Y5 ARR", { fontSize: 12 }),
      bullet("4% monthly churn (SaaS finance benchmark)", { fontSize: 12 }),
      bullet("LTV per subscriber: ~€373 (25-month average lifetime)", { fontSize: 12 }),
      bullet("Annual plans drive lower effective churn", { fontSize: 12 }),
    ], { x: 0.85, y: colY + 1.25, w: colW - 0.3, h: 3.3 });

    // RIGHT — Lead Generation
    s.addShape("rect", { x: 6.78, y: colY, w: colW, h: colH, fill: { color: LIGHT_GOLD }, line: { color: GOLD, width: 1 } });
    s.addText("Lead Generation", { x: 6.93, y: colY + 0.15, w: colW - 0.3, h: 0.5, fontSize: 22, bold: true, color: DARK, fontFace: "Calibri" });
    s.addText("0.03% trailing commission on referred capital", { x: 6.93, y: colY + 0.7, w: colW - 0.3, h: 0.4, fontSize: 14, color: GOLD, bold: true, fontFace: "Calibri" });
    s.addText([
      bullet("Free + paid users see retirement gaps → product offers from partners", { fontSize: 12 }),
      bullet("Pure margin, no delivery cost", { fontSize: 12 }),
      bullet("Compounds: capital under referral grows via contributions + market returns", { fontSize: 12 }),
      bullet("Y5 capital under referral: €304M → €91K annual lead-gen revenue", { fontSize: 12 }),
      bullet("Even free users have ~€4.50 lead-gen LTV", { fontSize: 12 }),
    ], { x: 6.93, y: colY + 1.25, w: colW - 0.3, h: 3.3 });

    s.addText("Why both streams matter:  Subscriptions provide predictable MRR. Lead gen monetises every user (free + paid) and creates a long-term, asset-based revenue base that grows even without new acquisition.", {
      x: 0.7, y: 6.75, w: 11.93, h: 0.4,
      fontSize: 11, italic: true, color: GRAY_MED, fontFace: "Calibri", align: "center",
    });
  }

  // ════════════════════════════════════════════════════════════════════
  // SLIDE 8 — GTM Strategy
  // ════════════════════════════════════════════════════════════════════
  {
    const s = addContentSlide("Go-to-Market", "Three acquisition channels with complementary economics");

    const ch = [
      {
        title: "Channel 1 — Organic SEO",
        weight: "Dominant channel",
        color: LIGHT_GREEN, fc: GREEN,
        bullets: [
          "Calculator-led PLG: long-tail content per country combination + niche pension keywords",
          "Compounds: content written in Month 1 still drives traffic in Month 36",
          "Capped at 0.5%/month organic reach of addressable (~6%/year ceiling — defensible benchmark)",
          "Foundation channel — near-zero marginal cost",
        ],
      },
      {
        title: "Channel 2 — Paid Acquisition",
        weight: "€180K seed allocation",
        color: LIGHT_ACCENT, fc: ACCENT,
        bullets: [
          "Google Ads on high-intent cross-border pension queries (low volume, high intent)",
          "Facebook + LinkedIn targeting expat demographics in key countries",
          "€100 blended CAC vs €373 subscription LTV → 3.7× LTV:CAC ratio",
          "Ramps from €3K/mo (M7) to €15K/mo (M24) — controllable, predictable scaling",
        ],
      },
      {
        title: "Channel 3 — Distribution Partnerships",
        weight: "BD co-founder owns this",
        color: LIGHT_ORANGE, fc: ORANGE,
        bullets: [
          "Corporate HR deals — international employers offer Prevista as a benefit (e.g. PwC LU, EU institutions)",
          "Expat associations and community partnerships (AMCHAM, Cercle Munster, expat newsletters)",
          "Mobility consultancies — Deloitte Global Mobility, EY People Advisory recommend Prevista to clients",
          "Each closed partnership leverages an existing audience — one deal = many signups",
        ],
      },
    ];

    const chY = 1.85;
    const chH = 1.6;
    ch.forEach((c, i) => {
      const y = chY + i * (chH + 0.1);
      s.addShape("rect", { x: 0.7, y, w: 12, h: chH, fill: { color: c.color }, line: { color: c.fc, width: 1 } });
      s.addText(c.title, { x: 0.85, y: y + 0.1, w: 7, h: 0.4, fontSize: 16, bold: true, color: DARK, fontFace: "Calibri" });
      s.addText(c.weight, { x: 8, y: y + 0.1, w: 4.5, h: 0.4, fontSize: 12, italic: true, color: c.fc, fontFace: "Calibri", align: "right" });
      s.addText(
        c.bullets.map(b => bullet(b, { fontSize: 11, paraSpaceAfter: 2 })),
        { x: 0.85, y: y + 0.55, w: 11.7, h: chH - 0.65 }
      );
    });
  }

  // ════════════════════════════════════════════════════════════════════
  // SLIDE 9 — Financial Projections
  // ════════════════════════════════════════════════════════════════════
  {
    const s = addContentSlide("5-Year Financial Projections", "Base case: profitable by Year 3, full EU coverage by Year 5");

    // Bar chart of ARR (base + upside)
    const chartData = [
      {
        name: "Base ARR",
        labels: ["Y1", "Y2", "Y3", "Y4", "Y5"],
        values: [25, 177, 706, 1452, 2169],
      },
      {
        name: "Upside ARR",
        labels: ["Y1", "Y2", "Y3", "Y4", "Y5"],
        values: [48, 335, 1289, 2631, 3951],
      },
    ];
    s.addChart(pptx.ChartType.bar, chartData, {
      x: 0.7, y: 1.85, w: 7.0, h: 4.5,
      barDir: "col",
      barGrouping: "clustered",
      catAxisLabelFontSize: 11,
      valAxisLabelFontSize: 10,
      valAxisTitle: "ARR (€K)",
      valAxisTitleFontSize: 11,
      showLegend: true,
      legendPos: "b",
      legendFontSize: 11,
      chartColors: [ACCENT, GREEN],
      showTitle: true,
      title: "Annual Revenue (€ thousands)",
      titleFontSize: 13,
      titleColor: DARK,
    });

    // Key metrics box on the right
    s.addShape("rect", { x: 8.0, y: 1.85, w: 4.65, h: 4.5, fill: { color: LIGHT_ACCENT }, line: { color: ACCENT, width: 1 } });
    s.addText("Key Metrics (Base)", { x: 8.15, y: 1.95, w: 4.4, h: 0.4, fontSize: 16, bold: true, color: DARK, fontFace: "Calibri" });

    const metrics = [
      ["Y5 ARR (base)", "€2.17M"],
      ["Y5 ARR (upside)", "€3.95M"],
      ["Y5 paying subscribers", "12,450"],
      ["Y5 paid penetration of TAM", "0.10%"],
      ["Monthly break-even", "Month 28"],
      ["Cumulative break-even", "Month 37"],
      ["Y5 cumulative net income", "+€1.73M"],
      ["Y5 capital under referral", "€304M"],
      ["Country engines live by Y5", "29 (EU + UK + CH)"],
    ];
    let metricY = 2.5;
    metrics.forEach(([k, v]) => {
      s.addText(k, { x: 8.15, y: metricY, w: 2.85, h: 0.35, fontSize: 11, color: BODY, fontFace: "Calibri", valign: "middle" });
      s.addText(v, { x: 11.0, y: metricY, w: 1.6, h: 0.35, fontSize: 12, bold: true, color: DARK, fontFace: "Calibri", align: "right", valign: "middle" });
      metricY += 0.4;
    });

    // Footnote
    s.addText("Growth ratios: 7.1× → 4.0× → 2.1× → 1.5× — classic decelerating SaaS curve.", {
      x: 0.7, y: 6.5, w: 12, h: 0.35,
      fontSize: 11, italic: true, color: GRAY_MED, fontFace: "Calibri", align: "center",
    });
  }

  // ════════════════════════════════════════════════════════════════════
  // SLIDE 10 — Unit Economics
  // ════════════════════════════════════════════════════════════════════
  {
    const s = addContentSlide("Unit Economics", "Profitable from the first cohort — even free users have positive expected value");

    // LTV box
    s.addShape("rect", { x: 0.7, y: 1.95, w: 5.85, h: 2.3, fill: { color: LIGHT_GREEN }, line: { color: GREEN, width: 1.5 } });
    s.addText("Subscription LTV", { x: 0.85, y: 2.05, w: 5.55, h: 0.4, fontSize: 16, bold: true, color: DARK, fontFace: "Calibri" });
    s.addText("€373", { x: 0.85, y: 2.5, w: 5.55, h: 0.9, fontSize: 48, bold: true, color: GREEN, fontFace: "Calibri", align: "center" });
    s.addText("€14.90/mo × 25-month average lifetime (4% monthly churn)", { x: 0.85, y: 3.6, w: 5.55, h: 0.4, fontSize: 11, italic: true, color: BODY, fontFace: "Calibri", align: "center" });

    // CAC box
    s.addShape("rect", { x: 6.78, y: 1.95, w: 5.85, h: 2.3, fill: { color: LIGHT_ACCENT }, line: { color: ACCENT, width: 1.5 } });
    s.addText("Blended CAC (paid)", { x: 6.93, y: 2.05, w: 5.55, h: 0.4, fontSize: 16, bold: true, color: DARK, fontFace: "Calibri" });
    s.addText("€100", { x: 6.93, y: 2.5, w: 5.55, h: 0.9, fontSize: 48, bold: true, color: ACCENT, fontFace: "Calibri", align: "center" });
    s.addText("Google/Facebook/LinkedIn ads on high-intent pension queries", { x: 6.93, y: 3.6, w: 5.55, h: 0.4, fontSize: 11, italic: true, color: BODY, fontFace: "Calibri", align: "center" });

    // LTV:CAC ratio big
    s.addShape("rect", { x: 0.7, y: 4.4, w: 11.93, h: 1.0, fill: { color: DARK } });
    s.addText("LTV:CAC = 3.7× — above the 3× SaaS investor threshold", {
      x: 0.7, y: 4.4, w: 11.93, h: 1.0,
      fontSize: 24, bold: true, color: WHITE, fontFace: "Calibri", align: "center", valign: "middle",
    });

    // Three small notes
    s.addText([
      bullet("Lead-gen LTV per investor: €150+ (€15/yr × 10-year holding)", { fontSize: 12 }),
      bullet("Lead-gen LTV per platform user (paid + free): €4.50 — every user has positive expected value", { fontSize: 12 }),
      bullet("Payback period for paid acquisition: ~7 months from subscription alone (lead gen is upside)", { fontSize: 12 }),
    ], {
      x: 0.7, y: 5.55, w: 12, h: 1.4,
    });
  }

  // ════════════════════════════════════════════════════════════════════
  // SLIDE 11 — Use of Funds & Capital Stack
  // ════════════════════════════════════════════════════════════════════
  {
    const s = addContentSlide("The Ask", "€230K seed — grant-dominant, 0-4% dilution");

    // LEFT — Use of funds
    s.addText("Use of Funds", { x: 0.7, y: 1.85, w: 6, h: 0.4, fontSize: 18, bold: true, color: DARK, fontFace: "Calibri" });
    const useRows = [
      [
        { text: "Category", options: { fill: { color: DARK }, color: WHITE, bold: true, fontSize: 12, align: "center", valign: "middle" } },
        { text: "Amount", options: { fill: { color: DARK }, color: WHITE, bold: true, fontSize: 12, align: "center", valign: "middle" } },
        { text: "Deployment", options: { fill: { color: DARK }, color: WHITE, bold: true, fontSize: 12, align: "center", valign: "middle" } },
      ],
      [
        { text: "Paid acquisition", options: { fontSize: 12, valign: "middle" } },
        { text: "€180,000", options: { fontSize: 12, bold: true, align: "right", valign: "middle" } },
        { text: "M7-M26 ramp €3K → €15K/mo", options: { fontSize: 11, italic: true, valign: "middle" } },
      ],
      [
        { text: "Content & SEO", options: { fontSize: 12, valign: "middle", fill: { color: GRAY_LIGHT } } },
        { text: "€50,000", options: { fontSize: 12, bold: true, align: "right", valign: "middle", fill: { color: GRAY_LIGHT } } },
        { text: "M7-M18 (~€4K/mo)", options: { fontSize: 11, italic: true, valign: "middle", fill: { color: GRAY_LIGHT } } },
      ],
      [
        { text: "TOTAL", options: { fontSize: 13, bold: true, valign: "middle", fill: { color: LIGHT_ACCENT } } },
        { text: "€230,000", options: { fontSize: 13, bold: true, align: "right", valign: "middle", fill: { color: LIGHT_ACCENT }, color: DARK } },
        { text: "", options: { fill: { color: LIGHT_ACCENT } } },
      ],
    ];
    s.addTable(useRows, { x: 0.7, y: 2.3, w: 6, colW: [1.8, 1.5, 2.7], border: { type: "solid", pt: 0.5, color: GRAY_MED }, fontFace: "Calibri" });

    s.addText("Not in the seed (covered by co-founder equity):", {
      x: 0.7, y: 4.5, w: 6, h: 0.35, fontSize: 12, bold: true, color: DARK, fontFace: "Calibri",
    });
    s.addText([
      bullet("Country pension engines (29 of them — built by technical co-founder)", { fontSize: 11 }),
      bullet("BD / distribution partnerships (BD co-founder owns this full-time)", { fontSize: 11 }),
      bullet("Co-founder salaries — both work on equity until Series A", { fontSize: 11 }),
    ], { x: 0.7, y: 4.85, w: 6, h: 1.8 });

    // RIGHT — Capital stack
    s.addText("Capital Stack", { x: 7.0, y: 1.85, w: 5.65, h: 0.4, fontSize: 18, bold: true, color: DARK, fontFace: "Calibri" });

    const stackRows = [
      [
        { text: "Source", options: { fill: { color: DARK }, color: WHITE, bold: true, fontSize: 12, align: "center", valign: "middle" } },
        { text: "Amount", options: { fill: { color: DARK }, color: WHITE, bold: true, fontSize: 12, align: "center", valign: "middle" } },
        { text: "Dilution", options: { fill: { color: DARK }, color: WHITE, bold: true, fontSize: 12, align: "center", valign: "middle" } },
      ],
      [
        { text: "Fit4Start grant (3 tranches)", options: { fontSize: 11, valign: "middle" } },
        { text: "€150K", options: { fontSize: 12, bold: true, align: "right", valign: "middle" } },
        { text: "0%", options: { fontSize: 12, bold: true, align: "center", valign: "middle", color: GREEN } },
      ],
      [
        { text: "LBAN angels or Expon Capital", options: { fontSize: 11, valign: "middle", fill: { color: GRAY_LIGHT } } },
        { text: "€80K", options: { fontSize: 12, bold: true, align: "right", valign: "middle", fill: { color: GRAY_LIGHT } } },
        { text: "2-4%", options: { fontSize: 12, bold: true, align: "center", valign: "middle", fill: { color: GRAY_LIGHT }, color: ACCENT } },
      ],
      [
        { text: "TOTAL", options: { fontSize: 13, bold: true, valign: "middle", fill: { color: LIGHT_ACCENT } } },
        { text: "€230K", options: { fontSize: 13, bold: true, align: "right", valign: "middle", fill: { color: LIGHT_ACCENT }, color: DARK } },
        { text: "0-4%", options: { fontSize: 13, bold: true, align: "center", valign: "middle", fill: { color: LIGHT_ACCENT }, color: GREEN } },
      ],
    ];
    s.addTable(stackRows, { x: 7.0, y: 2.3, w: 5.65, colW: [3.0, 1.3, 1.35], border: { type: "solid", pt: 0.5, color: GRAY_MED }, fontFace: "Calibri" });

    s.addText("Alternative path: Fit4Start €150K + YIE €80K = €230K at 0% dilution", {
      x: 7.0, y: 4.5, w: 5.65, h: 0.35, fontSize: 11, italic: true, bold: true, color: GREEN, fontFace: "Calibri",
    });

    // Why this is small
    s.addShape("rect", { x: 7.0, y: 4.95, w: 5.65, h: 1.7, fill: { color: LIGHT_ACCENT }, line: { color: ACCENT, width: 1 } });
    s.addText("Why €230K is enough", { x: 7.15, y: 5.05, w: 5.35, h: 0.35, fontSize: 13, bold: true, color: DARK, fontFace: "Calibri" });
    s.addText("Co-founders bring all engineering and BD as equity. Seed capital only funds variable acquisition costs (paid ads + content). The break-even point at Month 28 means the runway converts to profitability without a second round.", {
      x: 7.15, y: 5.4, w: 5.35, h: 1.2, fontSize: 11, color: BODY, fontFace: "Calibri",
    });
  }

  // ════════════════════════════════════════════════════════════════════
  // SLIDE 12 — Team & Closing
  // ════════════════════════════════════════════════════════════════════
  {
    const s = addContentSlide("Team", "Two co-founders, both on equity until Series A");

    // LEFT — Technical co-founder
    s.addShape("rect", { x: 0.7, y: 1.85, w: 5.85, h: 3.0, fill: { color: LIGHT_ACCENT }, line: { color: ACCENT, width: 1 } });
    s.addText("Technical Co-founder", { x: 0.85, y: 1.95, w: 5.55, h: 0.4, fontSize: 18, bold: true, color: DARK, fontFace: "Calibri" });
    s.addText("[Name]", { x: 0.85, y: 2.4, w: 5.55, h: 0.4, fontSize: 14, italic: true, color: ACCENT, fontFace: "Calibri" });
    s.addText([
      bullet("Owns the product end-to-end: calculator, platform, AI extraction, document vault", { fontSize: 11 }),
      bullet("Builds all 29 country pension engines as part of normal product development", { fontSize: 11 }),
      bullet("Domain expertise: [pension systems / fintech / cross-border experience]", { fontSize: 11 }),
    ], { x: 0.85, y: 2.85, w: 5.55, h: 1.95 });

    // RIGHT — BD co-founder
    s.addShape("rect", { x: 6.78, y: 1.85, w: 5.85, h: 3.0, fill: { color: LIGHT_ORANGE }, line: { color: ORANGE, width: 1 } });
    s.addText("BD Co-founder", { x: 6.93, y: 1.95, w: 5.55, h: 0.4, fontSize: 18, bold: true, color: DARK, fontFace: "Calibri" });
    s.addText("[Name]", { x: 6.93, y: 2.4, w: 5.55, h: 0.4, fontSize: 14, italic: true, color: ORANGE, fontFace: "Calibri" });
    s.addText([
      bullet("Owns distribution partnerships (corporate HR, expat associations, content, mobility consultants)", { fontSize: 11 }),
      bullet("Negotiates lead-gen partner agreements with pension product providers", { fontSize: 11 }),
      bullet("Manages CSSF Innovation Hub relationship + Luxembourg fintech ecosystem (LHoFT, LBAN)", { fontSize: 11 }),
    ], { x: 6.93, y: 2.85, w: 5.55, h: 1.95 });

    // Closing block
    s.addShape("rect", { x: 0.7, y: 5.1, w: 11.93, h: 1.85, fill: { color: DARK } });
    s.addText("Cross-border pension intelligence is a 17M-person market with no incumbent.", {
      x: 0.85, y: 5.25, w: 11.6, h: 0.55, fontSize: 18, bold: true, color: WHITE, fontFace: "Calibri", align: "center",
    });
    s.addText("€230K gets us to break-even and full EU coverage by Year 5.", {
      x: 0.85, y: 5.85, w: 11.6, h: 0.5, fontSize: 16, color: LIGHT_ACCENT, fontFace: "Calibri", align: "center", italic: true,
    });
    s.addText("Let's talk.   ·   [contact@prevista.com]   ·   [linkedin]", {
      x: 0.85, y: 6.45, w: 11.6, h: 0.4, fontSize: 13, color: WHITE, fontFace: "Calibri", align: "center",
    });
  }

  // ─── Save ───
  const outPath = path.join(__dirname, "Prevista-Investor-Pitch.pptx");
  await pptx.writeFile({ fileName: outPath });
  console.log("Written to:", outPath);
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
