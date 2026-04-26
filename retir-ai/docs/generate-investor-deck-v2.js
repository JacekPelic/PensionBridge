// ════════════════════════════════════════════════════════════════════
// Prevista Investor Deck v2 — generator
// ════════════════════════════════════════════════════════════════════
// Reads the financial model from financial-model.js so all numbers
// stay in sync with the projections workbook.
//
// Slide drafts (markdown source of truth): docs/investor-deck-v2-slides.md
// Render principles:
//   1. Native pptxgenjs primitives only (no embedded image content)
//   2. Live numbers from financial-model.js
//   3. One function per slide
//   4. THEME tokens at the top
//   5. Speaker notes embedded via slide.addNotes(...)
// ════════════════════════════════════════════════════════════════════

const pptxgen = require("pptxgenjs");
const path = require("path");
const model = require("./financial-model");

// ── THEME tokens ──────────────────────────────────────────────────────
const THEME = {
  // Brand purples
  purple:       "7030A0",
  midPurple:    "9558B0",
  lightPurple:  "E8D5F5",
  paleAccent:   "F5EAFA",
  darkPurple:   "3D1257",
  // Neutrals
  white:        "FFFFFF",
  offWhite:     "FAF8FC",
  lightGrey:    "E8E8E8",
  midGrey:      "888888",
  darkGrey:     "333333",
  // Status
  green:        "2E7D32",
  lightGreen:   "D4F4D7",
  red:          "C62828",
  lightRed:     "FDD8DA",
  gold:         "B8860B",
  lightGold:    "FFF4B8",
  // Fonts
  bodyFont:     "Calibri",
  headerFont:   "Calibri",
};

// ── Layout constants ─────────────────────────────────────────────────
const SLIDE_W = 13.333;
const SLIDE_H = 7.5;
const MARGIN  = 0.5;

// ── Format helpers ───────────────────────────────────────────────────
const fmtEur     = n => "€" + Math.round(n).toLocaleString("en-US");
const fmtEurK    = n => "€" + Math.round(n / 1000).toLocaleString("en-US") + "K";
const fmtEurM    = n => "€" + (n / 1e6).toFixed(2) + "M";
const fmtNumK    = n => n >= 1e6 ? (n/1e6).toFixed(2) + "M" : n >= 1000 ? Math.round(n/1000) + "K" : "" + Math.round(n);

// ── Generic primitives ───────────────────────────────────────────────
function addTitle(slide, text, opts = {}) {
  slide.addText(text, {
    x: MARGIN, y: opts.y || 0.3,
    w: SLIDE_W - 2*MARGIN, h: 0.7,
    fontFace: THEME.headerFont, fontSize: opts.fontSize || 26, bold: true,
    color: THEME.darkPurple, align: opts.align || "left", valign: "middle",
  });
}

function addSubhead(slide, text, opts = {}) {
  slide.addText(text, {
    x: MARGIN, y: opts.y || 1.05,
    w: SLIDE_W - 2*MARGIN, h: 0.4,
    fontFace: THEME.bodyFont, fontSize: opts.fontSize || 13, italic: true,
    color: THEME.midGrey, align: opts.align || "left", valign: "middle",
  });
}

function addCallout(slide, text, y, opts = {}) {
  const fill = opts.fill || THEME.lightPurple;
  const color = opts.color || THEME.darkPurple;
  const h = opts.h || 0.7;
  const fontSize = opts.fontSize || 13;
  const x = opts.x !== undefined ? opts.x : MARGIN;
  const w = opts.w !== undefined ? opts.w : SLIDE_W - 2*MARGIN;
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: fill }, line: { color: fill, width: 0 },
  });
  slide.addText(text, {
    x: x + 0.2, y, w: w - 0.4, h,
    fontFace: THEME.bodyFont, fontSize, italic: opts.italic !== false,
    color, align: opts.align || "center", valign: "middle",
    bold: opts.bold || false,
  });
}

function addFooter(slide, text) {
  slide.addText(text, {
    x: MARGIN, y: SLIDE_H - 0.3,
    w: SLIDE_W - 2*MARGIN, h: 0.25,
    fontFace: THEME.bodyFont, fontSize: 9, italic: true,
    color: THEME.midGrey, align: "right",
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 1 — Cover
// ════════════════════════════════════════════════════════════════════
function slide1_cover(deck) {
  const slide = deck.addSlide();

  // Big purple background
  slide.addShape("rect", {
    x: 0, y: 0, w: SLIDE_W, h: SLIDE_H,
    fill: { color: THEME.darkPurple },
    line: { color: THEME.darkPurple, width: 0 },
  });

  // Decorative accent strip
  slide.addShape("rect", {
    x: 0, y: 1.7, w: SLIDE_W, h: 0.05,
    fill: { color: THEME.purple },
    line: { color: THEME.purple, width: 0 },
  });

  // Brand mark
  slide.addText("Prevista", {
    x: 0, y: 1.9, w: SLIDE_W, h: 1.6,
    fontFace: THEME.headerFont, fontSize: 88, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });

  // Tagline
  slide.addText("Cross-border pensions, finally solved.", {
    x: 0, y: 3.6, w: SLIDE_W, h: 0.6,
    fontFace: THEME.headerFont, fontSize: 24, italic: true,
    color: THEME.lightPurple, align: "center", valign: "middle",
  });

  // Subtitle
  slide.addText("The platform for the 17M EU mobile workers nobody is serving.", {
    x: 0, y: 4.4, w: SLIDE_W, h: 0.5,
    fontFace: THEME.bodyFont, fontSize: 16,
    color: THEME.white, align: "center", valign: "middle",
  });

  // Round info bar at bottom
  slide.addShape("rect", {
    x: 0, y: SLIDE_H - 1.0, w: SLIDE_W, h: 1.0,
    fill: { color: THEME.purple },
    line: { color: THEME.purple, width: 0 },
  });
  slide.addText("Seed round  ·  €230K  ·  April 2026", {
    x: 0, y: SLIDE_H - 1.0, w: SLIDE_W, h: 1.0,
    fontFace: THEME.headerFont, fontSize: 22, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });

  slide.addNotes("Cover slide. Hand the deck to the room. Wait a beat. Then move to the problem statement on slide 2.");
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 2 — The Problem
// ════════════════════════════════════════════════════════════════════
function slide2_problem(deck) {
  const slide = deck.addSlide();

  addTitle(slide, "Pensions are organised country by country. People aren't.");
  addSubhead(slide,
    "17 million EU citizens have moved between member states. None of them have a complete picture of their retirement."
  );

  const facts = [
    {
      headline: "Pensions are fragmented",
      body: "27 member states with 27 different pension systems. EU coordination (Reg 883/2004) handles entitlement portability — but not a single unified picture for the worker.",
    },
    {
      headline: "Government tools don't aggregate",
      body: "Each country offers its own pension extract. None combine across borders. There is no European \"check your pension\" service.",
    },
    {
      headline: "Private tools don't cover Europe",
      body: "US tools like Boldin focus on the IRS / Social Security stack. No private tool currently models multi-country EU pensions with corridor-level accuracy.",
    },
    {
      headline: "Advisors are 92–97% more expensive",
      body: "A multi-country pension consultation costs €500-€2,000 in Luxembourg. Most cross-border workers can't justify the cost — so they don't plan, and they discover their gap at 65.",
    },
  ];

  // 2x2 grid
  const cellW = 5.9, cellH = 1.95;
  const gap = 0.2;
  const startX = (SLIDE_W - 2*cellW - gap) / 2;
  const startY = 1.7;

  facts.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = startX + col * (cellW + gap);
    const y = startY + row * (cellH + gap);

    slide.addShape("rect", {
      x, y, w: cellW, h: cellH,
      fill: { color: THEME.paleAccent },
      line: { color: THEME.midPurple, width: 1 },
    });
    slide.addText(f.headline, {
      x: x + 0.2, y: y + 0.15, w: cellW - 0.4, h: 0.5,
      fontFace: THEME.headerFont, fontSize: 14, bold: true,
      color: THEME.darkPurple, align: "left", valign: "middle",
    });
    slide.addText(f.body, {
      x: x + 0.2, y: y + 0.65, w: cellW - 0.4, h: cellH - 0.8,
      fontFace: THEME.bodyFont, fontSize: 11,
      color: THEME.darkGrey, align: "left", valign: "top",
    });
  });

  addCallout(slide,
    "Result: most multi-country workers don't plan, can't see the full picture, and discover their pension gap at 65 — when it's too late to do anything about it.",
    6.05,
    { fill: THEME.darkPurple, color: THEME.white, h: 0.7, fontSize: 13, italic: true }
  );

  slide.addNotes([
    "There are 17 million EU citizens currently living in a member state other than their own. Most of them have worked in two or more countries. Almost none of them have a complete picture of their retirement.",
    "Why? Four reasons.",
    "First: pensions are fragmented. 27 member states, 27 systems. EU coordination rules portability but doesn't aggregate.",
    "Second: government tools don't aggregate. Each country has its own extract. None combine across borders.",
    "Third: private tools don't cover Europe. US tools like Boldin handle the US stack. No private tool currently does EU multi-country with corridor-level accuracy.",
    "Fourth: advisors are 92 to 97 percent more expensive. €500-2,000 per consultation. Most cross-border workers can't justify it.",
    "Result: they don't plan. They discover their gap at 65 when it's too late."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 3 — What We Built
// ════════════════════════════════════════════════════════════════════
// Two products, not three: Calculator (acquisition) + Platform (the
// actual product, with 8 modules including Vault as one of them).
function slide3_product(deck) {
  const slide = deck.addSlide();

  addTitle(slide, "What we built — calculator + platform.");
  addSubhead(slide,
    "Calculator validates demand and drives acquisition. Platform delivers the full pension picture across eight modules."
  );

  // Two columns
  const cardW = 5.9, gap = 0.4;
  const cardY = 1.7;
  const cardH = 4.85;
  const startX = (SLIDE_W - 2*cardW - gap) / 2;

  // ── LEFT — CALCULATOR ──
  slide.addShape("rect", {
    x: startX, y: cardY, w: cardW, h: cardH,
    fill: { color: THEME.paleAccent },
    line: { color: THEME.midPurple, width: 1.5 },
  });
  slide.addShape("rect", {
    x: startX, y: cardY, w: cardW, h: 0.85,
    fill: { color: THEME.midPurple },
    line: { color: THEME.midPurple, width: 0 },
  });
  slide.addText([
    { text: "1.  CALCULATOR", options: { fontSize: 16, bold: true, breakLine: true } },
    { text: "Free  ·  Public  ·  Standalone tool", options: { fontSize: 11, italic: true } },
  ], {
    x: startX, y: cardY, w: cardW, h: 0.85,
    fontFace: THEME.headerFont, color: THEME.white,
    align: "center", valign: "middle",
  });
  slide.addText([
    { text: "Multi-country pension estimate from a few career details. ", options: { breakLine: true } },
    { text: "Lightweight, no signup, public-facing.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "CTAs evolve across phases:", options: { bold: true, breakLine: true } },
    { text: "  •  Phase −1:  \"Join the wishlist\"", options: { breakLine: true } },
    { text: "  •  Phase 1+:  \"Email report\" + direct redirect", options: { breakLine: true } },
  ], {
    x: startX + 0.3, y: cardY + 1.0, w: cardW - 0.6, h: 2.4,
    fontFace: THEME.bodyFont, fontSize: 11,
    color: THEME.darkGrey, valign: "top", paraSpaceAfter: 4,
  });
  // Strategic role footer
  slide.addShape("line", {
    x: startX + 0.3, y: cardY + cardH - 1.55, w: cardW - 0.6, h: 0,
    line: { color: THEME.midPurple, width: 1, dashType: "dash" },
  });
  slide.addText([
    { text: "STRATEGIC ROLE", options: { fontSize: 9, bold: true, color: THEME.midPurple, breakLine: true } },
    { text: "Validates demand pre-launch · drives organic SEO · seeds the wishlist that activates at M1.", options: { fontSize: 10, italic: true, color: THEME.darkGrey } },
  ], {
    x: startX + 0.3, y: cardY + cardH - 1.45, w: cardW - 0.6, h: 1.3,
    fontFace: THEME.bodyFont, valign: "top", paraSpaceAfter: 3,
  });

  // ── RIGHT — PLATFORM ──
  const rightX = startX + cardW + gap;
  slide.addShape("rect", {
    x: rightX, y: cardY, w: cardW, h: cardH,
    fill: { color: THEME.paleAccent },
    line: { color: THEME.purple, width: 1.5 },
  });
  slide.addShape("rect", {
    x: rightX, y: cardY, w: cardW, h: 0.85,
    fill: { color: THEME.purple },
    line: { color: THEME.purple, width: 0 },
  });
  slide.addText([
    { text: "2.  PLATFORM", options: { fontSize: 16, bold: true, breakLine: true } },
    { text: "Free  +  Pro €14.90/mo", options: { fontSize: 11, italic: true } },
  ], {
    x: rightX, y: cardY, w: cardW, h: 0.85,
    fontFace: THEME.headerFont, color: THEME.white,
    align: "center", valign: "middle",
  });
  slide.addText("The full product. Eight modules across visibility (free) and intelligence (Pro). See slide 4 for tier split.", {
    x: rightX + 0.3, y: cardY + 1.0, w: cardW - 0.6, h: 0.55,
    fontFace: THEME.bodyFont, fontSize: 11,
    color: THEME.darkGrey, valign: "top",
  });

  // 8 modules in 2-column grid (4 rows × 2 cols)
  const modules = [
    "📊  Dashboard",
    "🗂️  Career timeline",
    "💰  Payout estimation",
    "📄  Vault (uploads + AI extraction)",
    "🎛️  Simulation",
    "🛰️  Radar (legislative changes)",
    "👨‍👩‍👧  Family (multi-member)",
    "🤖  Chat (general + Pro: AI)",
  ];
  const moduleColW = (cardW - 0.6) / 2;
  const moduleGridY = cardY + 1.65;
  modules.forEach((m, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    slide.addText(m, {
      x: rightX + 0.3 + col * moduleColW, y: moduleGridY + row * 0.42,
      w: moduleColW, h: 0.4,
      fontFace: THEME.bodyFont, fontSize: 11,
      color: THEME.darkGrey, valign: "middle",
    });
  });

  // Strategic role footer
  slide.addShape("line", {
    x: rightX + 0.3, y: cardY + cardH - 1.55, w: cardW - 0.6, h: 0,
    line: { color: THEME.purple, width: 1, dashType: "dash" },
  });
  slide.addText([
    { text: "STRATEGIC ROLE", options: { fontSize: 9, bold: true, color: THEME.purple, breakLine: true } },
    { text: "Where users see their picture, convert to paid, and accumulate data (the moat). Powered by 29 country engines — LU/FR/CH live at M1.", options: { fontSize: 10, italic: true, color: THEME.darkGrey } },
  ], {
    x: rightX + 0.3, y: cardY + cardH - 1.45, w: cardW - 0.6, h: 1.3,
    fontFace: THEME.bodyFont, valign: "top", paraSpaceAfter: 3,
  });

  // Bottom callout
  addCallout(slide,
    "Two products, one funnel: calculator brings users in, platform converts them to paid and locks them in.",
    6.7,
    { fill: THEME.darkPurple, color: THEME.white, h: 0.5, fontSize: 12, italic: true }
  );

  slide.addNotes([
    "Two products, one funnel.",
    "Calculator: standalone, free, public. Multi-country pension estimate from a few career details. No signup. Drives organic SEO via long-tail pension queries. CTAs evolve from \"join the wishlist\" in Phase minus one to \"email report\" plus direct redirect in Phase 1.",
    "Platform: the full product. Free tier plus Pro at €14.90 a month. Eight modules: Dashboard, Career timeline, Payout estimation, Vault, Simulation, Radar, Family, Chat. Each module has a free tier and most have a Pro tier — slide 4 covers the split in detail.",
    "The vault is one module among eight. It's strategically important because it's where document data accumulates and creates switching cost. But it's not a separate product — it's a feature inside the platform.",
    "Powered by 29 country pension engines that the technical co-founder builds over 5 years. LU, FR, and CH live at M1 — that's the launch trio.",
    "Funnel: calculator brings users in (acquisition). Platform converts them to paid (monetisation) and locks them in (retention through accumulated data)."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 4 — Free vs Pro Tiers
// ════════════════════════════════════════════════════════════════════
function slide4_freeVsPro(deck) {
  const slide = deck.addSlide();

  // Headline = philosophy
  slide.addText('"See your situation" is free.   "Act on your situation" is paid.', {
    x: MARGIN, y: 0.3, w: SLIDE_W - 2*MARGIN, h: 0.7,
    fontFace: THEME.headerFont, fontSize: 24, bold: true,
    color: THEME.darkPurple, align: "center", valign: "middle",
  });

  addSubhead(slide,
    "A freemium model designed around the data moat — every feature that drives uploads stays free.",
    { y: 1.05, align: "center" }
  );

  // ── FREE column ──
  const freeX = 0.7, colW = 5.97;
  slide.addShape("rect", {
    x: freeX, y: 1.7, w: colW, h: 4.4,
    fill: { color: THEME.paleAccent },
    line: { color: THEME.midPurple, width: 1 },
  });
  slide.addShape("rect", {
    x: freeX, y: 1.7, w: colW, h: 0.55,
    fill: { color: THEME.midPurple },
    line: { color: THEME.midPurple, width: 0 },
  });
  slide.addText("FREE — Visibility", {
    x: freeX, y: 1.7, w: colW, h: 0.55,
    fontFace: THEME.headerFont, fontSize: 16, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });

  const freeFeatures = [
    "📊  Dashboard, KPIs, retirement gap",
    "🗂️  Career timeline + gap detection",
    "💰  Payout estimation (all pillars, gross + net)",
    "📄  Unlimited vault uploads + AI extraction",
    "🎛️  Simulation interactive controls",
    "👁️  Module previews (Radar/Family/Chat)",
    "💬  General pension Q&A",
  ];
  slide.addText(freeFeatures.map(t => ({ text: t, options: { breakLine: true }})), {
    x: freeX + 0.3, y: 2.4, w: colW - 0.6, h: 3.5,
    fontFace: THEME.bodyFont, fontSize: 13, color: THEME.darkGrey,
    valign: "top", paraSpaceAfter: 6,
  });

  // ── PRO column ──
  const proX = 6.85;
  slide.addShape("rect", {
    x: proX, y: 1.65, w: colW, h: 4.45,
    fill: { color: THEME.purple },
    line: { color: THEME.darkPurple, width: 2 },
  });
  slide.addShape("rect", {
    x: proX, y: 1.65, w: colW, h: 0.55,
    fill: { color: THEME.darkPurple },
    line: { color: THEME.darkPurple, width: 0 },
  });
  slide.addText("PRO — €14.90/mo — Intelligence", {
    x: proX, y: 1.65, w: colW, h: 0.55,
    fontFace: THEME.headerFont, fontSize: 14, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });

  const proFeatures = [
    "🔍  Vault Pro: cross-referencing & alerts",
    "⚙️  Correction workflow (auto-letters)",
    "📅  Document age & expiry monitoring",
    "📤  Consolidated dossier export",
    "👨‍👩‍👧  Family vault sharing",
    "📈  Sim Pro: tax + PPP + capital modeller",
    "🛰️  Radar full: alerts + impact analysis",
    "🤖  Chat AI: personalized analysis",
  ];
  slide.addText(proFeatures.map(t => ({ text: t, options: { breakLine: true }})), {
    x: proX + 0.3, y: 2.35, w: colW - 0.6, h: 3.6,
    fontFace: THEME.bodyFont, fontSize: 13, color: THEME.white,
    valign: "top", paraSpaceAfter: 6,
  });

  // ── Bottom moat callout ──
  addCallout(slide,
    "Why this works: data accumulation is the moat. Free tier maximises uploads (every document increases switching cost). Pro tier delivers ongoing intelligence on top of that data. The free tier is not generosity — it is the lead-gen funnel.",
    6.35,
    { fill: THEME.darkPurple, color: THEME.white, h: 0.85, fontSize: 12 }
  );

  slide.addNotes([
    'Freemium principle: "See your situation" is free, "Act on your situation" is paid.',
    "Free: dashboard, career timeline, payout estimation across all pillars, unlimited vault uploads, AI extraction, simulation controls, module previews, general Q&A.",
    "Pro: cross-referencing, correction workflow, monitoring, dossier export, family sharing, tax breakdown + PPP + capital modeller, personalized AI chat.",
    "The split is strategic: data accumulation is the moat. Every document upload increases switching cost. We do not paywall anything that drives uploads.",
    "Pro converts engaged users who have built up their vault and now want ongoing intelligence on top of that data.",
    "Every free user who never converts still has €4.50 lead-gen LTV, which subsidises the effective CAC across the entire user base."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 5 — Target Market & Beachhead
// ════════════════════════════════════════════════════════════════════
function slide5_targetMarket(deck) {
  const slide = deck.addSlide();

  addTitle(slide, "The densest target market in Europe — and why we start here.");

  const facts = [
    {
      n: "1",
      headline: "48% foreign-born population",
      body: "Luxembourg has the highest proportion of foreign residents in the EU. The cross-border pension problem is the default, not the exception."
    },
    {
      n: "2",
      headline: "130–150K addressable individuals in LU",
      body: "Multi-country pension holders, sized from STATEC data on resident foreign nationals. Discounted for second-generation residents and excludes frontaliers."
    },
    {
      n: "3",
      headline: "NOT frontaliers",
      body: "A German commuting from Germany has all their pension in Luxembourg — no multi-country problem. Our target is people who relocated and accumulated entitlements in 2+ countries."
    },
    {
      n: "4",
      headline: "17M EU mobile citizens (Eurostat)",
      body: "The ceiling. Luxembourg is the beachhead, not the boundary. Year 5 endpoint covers all of EU + UK + CH (29 country engines)."
    },
  ];

  let y = 1.55;
  facts.forEach(f => {
    // number circle
    slide.addShape("ellipse", {
      x: 0.7, y: y, w: 0.85, h: 0.85,
      fill: { color: THEME.purple },
      line: { color: THEME.darkPurple, width: 1 },
    });
    slide.addText(f.n, {
      x: 0.7, y: y, w: 0.85, h: 0.85,
      fontFace: THEME.headerFont, fontSize: 28, bold: true,
      color: THEME.white, align: "center", valign: "middle",
    });
    // headline
    slide.addText(f.headline, {
      x: 1.75, y: y, w: 11, h: 0.4,
      fontFace: THEME.headerFont, fontSize: 16, bold: true,
      color: THEME.darkPurple, align: "left", valign: "middle",
    });
    // body
    slide.addText(f.body, {
      x: 1.75, y: y + 0.42, w: 11, h: 0.55,
      fontFace: THEME.bodyFont, fontSize: 12,
      color: THEME.darkGrey, align: "left", valign: "top",
    });
    y += 1.2;
  });

  addCallout(slide,
    "Phase −1 lets us measure the addressable market before we spend a euro of seed capital. The wishlist tells us if our sizing is right — or if it isn't.",
    6.4,
    { fill: THEME.lightPurple, color: THEME.darkPurple, h: 0.7, fontSize: 12 }
  );

  slide.addNotes([
    "Why Luxembourg first.",
    "48% of Luxembourg's residents are foreign-born — highest in the EU. The cross-border pension problem isn't a niche here, it's the default.",
    "Addressable market sized at 130-150K individuals from STATEC data, discounted for second-generation residents and excluding frontaliers.",
    "Frontaliers matter to mention because people get this confused. A German commuting from Germany to a job in Luxembourg has all their pension contributions in Luxembourg — no multi-country problem. Our target is people who relocated.",
    "The 17M Eurostat number is the ceiling. EU citizens currently living in a member state other than their own. That's what we get to address by year 5 with all 29 country engines live.",
    "Phase −1 is specifically designed to measure whether our addressable estimate is right before we spend a euro of seed capital. If the wishlist doesn't grow at the rate we expect, we adjust before raising, not after."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 6 — The 3-Phase Acquisition Funnel
// ════════════════════════════════════════════════════════════════════
function slide6_funnel(deck) {
  const slide = deck.addSlide();

  addTitle(slide, "The funnel matures in three steps — we don't try to launch everything at once.");

  // Three columns
  const colW = 4.0;
  const gap = 0.25;
  const startX = (SLIDE_W - 3*colW - 2*gap) / 2;
  const colY = 1.45;
  const colH = 5.0;

  const phases = [
    {
      title: "PHASE −1",
      subtitle: "Validate (M-3 to M0)",
      bg: THEME.lightPurple,
      headerBg: THEME.midPurple,
      textColor: THEME.darkGrey,
      items: [
        "💰  Funding: €0, founder labor only",
        "🛠️  Tools: Calculator (free, public)",
        "📡  Channels: Organic SEO + community",
        "🎯  CTA: \"Join the wishlist\"",
        "✅  Output: ~450 wishlist signups by M0",
        "📊  Investor proof: demand validated before any capital deploys",
      ]
    },
    {
      title: "PHASE 1",
      subtitle: "Launch (M1 to M6)",
      bg: THEME.paleAccent,
      headerBg: THEME.purple,
      textColor: THEME.darkGrey,
      items: [
        "💰  Funding: founder self-funded, no external capital",
        "🛠️  Tools: Calculator + Platform live",
        "📡  Channels: Organic + wishlist activation at M1",
        "🎯  CTA 1: \"Send report by email\" (consent → drip)",
        "🎯  CTA 2: Direct redirect → platform signup",
        "📊  Investor proof: funnel metrics measured, not modeled",
      ]
    },
    {
      title: "PHASE 2",
      subtitle: "Scale (M7 to M60)",
      bg: THEME.purple,
      headerBg: THEME.darkPurple,
      textColor: THEME.white,
      items: [
        "💰  Funding: €230K seed deployed",
        "🛠️  Tools: Calculator + Platform + Vault",
        "📡  Channels: Organic + Paid + Distribution Partnerships",
        "🎯  CTAs: same + paid landing pages + partner referrals",
        "✅  Output: €3.67M ARR Y5 base, M16 monthly BE",
        "📊  Investor proof: capital pours fuel on a measured fire",
      ]
    },
  ];

  phases.forEach((p, i) => {
    const x = startX + i * (colW + gap);
    slide.addShape("rect", {
      x, y: colY, w: colW, h: colH,
      fill: { color: p.bg },
      line: { color: p.headerBg, width: 1 },
    });
    slide.addShape("rect", {
      x, y: colY, w: colW, h: 0.85,
      fill: { color: p.headerBg },
      line: { color: p.headerBg, width: 0 },
    });
    slide.addText([
      { text: p.title, options: { fontSize: 16, bold: true, breakLine: true } },
      { text: p.subtitle, options: { fontSize: 11, italic: true } },
    ], {
      x, y: colY + 0.05, w: colW, h: 0.85,
      fontFace: THEME.headerFont, color: THEME.white,
      align: "center", valign: "middle",
    });
    slide.addText(
      p.items.map(t => ({ text: t, options: { breakLine: true } })),
      {
        x: x + 0.2, y: colY + 1.0, w: colW - 0.4, h: colH - 1.1,
        fontFace: THEME.bodyFont, fontSize: 10.5,
        color: p.textColor, valign: "top", paraSpaceAfter: 6,
      }
    );
  });

  addCallout(slide,
    "Each phase only starts when the previous has produced its evidence. By M7 (seed close), we have 6 months of platform metrics + 9 months of calculator metrics. The seed underwrites measured reality, not slideware.",
    6.6,
    { fill: THEME.darkPurple, color: THEME.white, h: 0.7, fontSize: 11 }
  );

  slide.addNotes([
    "Most consumer SaaS plans assume the funnel exists from day one. We're sequencing this deliberately — build it in three steps, validate each step before the next.",
    "Phase -1 is the calculator. We can ship it today using LU/FR/CH engines we already have. CTA is \"join the wishlist\" — no platform yet, no commitment beyond an email.",
    "Three months of Phase -1 gets us about 450 wishlist signups in the LU beachhead. First proof: do people care enough to give us their email?",
    "Phase 1: platform launches, wishlist activates (warm signups convert at 40-60% vs cold organic), calculator CTAs evolve to (1) detailed email report = marketing consent → drip campaign, and (2) direct redirect to signup.",
    "Phase 1 runs on organic only. No paid spend. The point is to validate conversion rates, not to scale.",
    "Phase 2: seed deploys at M7. Paid acquisition + BD partnerships layer on top of a funnel we've already proven. Not raising to figure out the model — raising to scale a model that's already producing measured numbers.",
    "By the time the seed deploys, we have 6 months of platform metrics and 9 months of calculator metrics. Investors get to underwrite measured reality."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 7 — The Corridor Unlock Thesis
// ════════════════════════════════════════════════════════════════════
function slide7_corridorUnlock(deck) {
  const slide = deck.addSlide();

  addTitle(slide, "Same engine, ~10× the TAM — the order matters.");
  addSubhead(slide,
    "Each new country unlocks bilateral pension corridors with every already-supported country. Sequence determines marginal value."
  );

  // Two columns
  const colY = 1.7;
  const colH = 4.4;
  const leftX = 0.7;
  const rightX = 7.0;
  const colW = 5.6;

  // LEFT — weak case
  slide.addShape("rect", {
    x: leftX, y: colY, w: colW, h: colH,
    fill: { color: THEME.paleAccent },
    line: { color: THEME.midPurple, width: 1 },
  });
  slide.addShape("rect", {
    x: leftX, y: colY, w: colW, h: 0.6,
    fill: { color: THEME.midPurple },
    line: { color: THEME.midPurple, width: 0 },
  });
  slide.addText("Adding PT when only LU is supported", {
    x: leftX, y: colY, w: colW, h: 0.6,
    fontFace: THEME.headerFont, fontSize: 14, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });

  slide.addText([
    { text: "Live engines:  ", options: { bold: true } },
    { text: "LU", options: { breakLine: true } },
    { text: "New engine:   ", options: { bold: true } },
    { text: "PT", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Unlocked corridors:", options: { bold: true, breakLine: true } },
    { text: "  • PT–LU:  56K", options: { breakLine: true } },
  ], {
    x: leftX + 0.4, y: colY + 0.85, w: colW - 0.8, h: 2.5,
    fontFace: THEME.bodyFont, fontSize: 13, color: THEME.darkGrey, valign: "top",
  });

  slide.addText("Marginal addressable: 56K", {
    x: leftX + 0.4, y: colY + 3.5, w: colW - 0.8, h: 0.7,
    fontFace: THEME.headerFont, fontSize: 22, bold: true,
    color: THEME.midPurple, align: "center", valign: "middle",
  });

  // RIGHT — strong case
  slide.addShape("rect", {
    x: rightX, y: colY, w: colW, h: colH,
    fill: { color: THEME.lightPurple },
    line: { color: THEME.darkPurple, width: 2 },
  });
  slide.addShape("rect", {
    x: rightX, y: colY, w: colW, h: 0.6,
    fill: { color: THEME.darkPurple },
    line: { color: THEME.darkPurple, width: 0 },
  });
  slide.addText("Adding PT when LU + FR + CH are all live", {
    x: rightX, y: colY, w: colW, h: 0.6,
    fontFace: THEME.headerFont, fontSize: 14, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });

  slide.addText([
    { text: "Live engines:  ", options: { bold: true } },
    { text: "LU + FR + CH", options: { breakLine: true } },
    { text: "New engine:   ", options: { bold: true } },
    { text: "PT", options: { breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Unlocked corridors:", options: { bold: true, breakLine: true } },
    { text: "  • PT–LU:    56K", options: { breakLine: true } },
    { text: "  • FR–PT:  358K", options: { breakLine: true } },
    { text: "  • CH–PT:  151K", options: { breakLine: true } },
  ], {
    x: rightX + 0.4, y: colY + 0.85, w: colW - 0.8, h: 2.5,
    fontFace: THEME.bodyFont, fontSize: 13, color: THEME.darkGrey, valign: "top",
  });

  slide.addText("Marginal addressable: 565K", {
    x: rightX + 0.4, y: colY + 3.5, w: colW - 0.8, h: 0.7,
    fontFace: THEME.headerFont, fontSize: 22, bold: true,
    color: THEME.darkPurple, align: "center", valign: "middle",
  });

  // Bottom banner
  addCallout(slide,
    "Same engine. ~10× the marginal TAM. The launch trio (LU + FR + CH at M1) is what makes the rest of the schedule work.",
    6.4,
    { fill: THEME.darkPurple, color: THEME.white, h: 0.55, fontSize: 14, bold: true, italic: false }
  );
  slide.addText(
    "This is why we ship Luxembourg, France, and Switzerland together at month one rather than sequentially.",
    {
      x: MARGIN, y: 7.05, w: SLIDE_W - 2*MARGIN, h: 0.3,
      fontFace: THEME.bodyFont, fontSize: 10, italic: true,
      color: THEME.midGrey, align: "center",
    }
  );

  slide.addNotes([
    "This is the structural insight nobody else has.",
    "The cross-border pension problem exists along migration corridors. Each engine we ship unlocks bilateral corridors with every already-supported country.",
    "Take Portugal: if we add it when only LU is supported, we unlock the PT-LU corridor — about 56,000 multi-country pension holders.",
    "If we add Portugal when LU + FR + CH are all supported, we also unlock FR-PT (358,000 Portuguese in France) and CH-PT (151,000 Portuguese in Switzerland). Total: 565,000.",
    "Same engine. Same engineering work. Ten times the marginal TAM. Just because of what was supported when it shipped.",
    "This is why our launch trio matters. We ship LU, FR, and CH together at M1, not sequentially. By M3 when we add PT, we already have three countries to corridor against.",
    "The full schedule is greedy TAM-maximizing — at every step we ship the engine that unlocks the largest combined corridor population.",
    "And one more thing: the corridor logic is what makes this defensible. A US tool like Boldin can't just \"add Europe\" — they'd need to build 29 country engines AND know which corridors to ship in which order. Sequence is the moat."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 8 — Engine Rollout (Year Cards)
// ════════════════════════════════════════════════════════════════════
// Tells the rollout as 5 year cards instead of 29 markers crammed on
// a single timeline. Y1 and Y2 each get a highlighted "key moment" box
// (launch trio at M1, German hub at M13). Engines pulled live from
// model.ENGINE_SCHEDULE; addressable values pulled live from baseData.
function slide8_engineRollout(deck, baseData) {
  const slide = deck.addSlide();

  addTitle(slide, "29 country engines, paced for capacity — full EU+UK+CH coverage by Month 58.");
  addSubhead(slide,
    "Front-loaded launch trio + quarterly Y1 cadence + ~2-month cadence Y2-Y5. Each new engine unlocks bilateral corridors with everything already supported."
  );

  // Group engines by year (1-indexed) from the model
  const engines = model.ENGINE_SCHEDULE;
  const yearEngines = [[], [], [], [], []];
  engines.forEach(e => {
    const yr = Math.ceil(e.month / 12) - 1;
    if (yr >= 0 && yr <= 4) yearEngines[yr].push(e);
  });

  // Year-end snapshots from baseData
  const yearEndIdx = [11, 23, 35, 47, 59];
  const yearAddressable = yearEndIdx.map(i => baseData[i].addressable);
  const yearLiveCount = yearEndIdx.map(i => baseData[i].countriesLive);

  // 5 year cards
  const years = [
    {
      title: "YEAR 1",
      subtitle: "M1 → M12",
      keyMoment: { label: "LAUNCH TRIO  ·  M1", body: "LU  +  FR  +  CH" },
      engineList: "PT  (M3)\nES  (M6)\nUK  (M9)\nIT  (M12)",
      addedNote: "+4 engines after the trio",
      cumulative: yearLiveCount[0],
      addressable: yearAddressable[0],
      headerBg: THEME.darkPurple,
      cardBg: THEME.lightPurple,
      isHighlight: true,
    },
    {
      title: "YEAR 2",
      subtitle: "M13 → M23",
      keyMoment: { label: "GERMAN HUB  ·  M13", body: "Largest single TAM unlock" },
      engineList: "PL  (M15)\nBE  (M17)\nNL  (M19)\nRO  (M21)\nAT  (M23)",
      addedNote: "+6 engines",
      cumulative: yearLiveCount[1],
      addressable: yearAddressable[1],
      headerBg: THEME.darkPurple,
      cardBg: THEME.lightPurple,
      isHighlight: true,
    },
    {
      title: "YEAR 3",
      subtitle: "M25 → M35",
      keyMoment: null,
      engineList: yearEngines[2].map(e => e.code).join("   "),
      engineListIsCompact: true,
      addedNote: "+6 engines · Central + Mediterranean",
      cumulative: yearLiveCount[2],
      addressable: yearAddressable[2],
      headerBg: THEME.midPurple,
      cardBg: THEME.paleAccent,
      isHighlight: false,
    },
    {
      title: "YEAR 4",
      subtitle: "M37 → M47",
      keyMoment: null,
      engineList: yearEngines[3].map(e => e.code).join("   "),
      engineListIsCompact: true,
      addedNote: "+6 engines · Nordic + Baltic",
      cumulative: yearLiveCount[3],
      addressable: yearAddressable[3],
      headerBg: THEME.midPurple,
      cardBg: THEME.paleAccent,
      isHighlight: false,
    },
    {
      title: "YEAR 5",
      subtitle: "M49 → M58",
      keyMoment: null,
      engineList: yearEngines[4].map(e => e.code).join("   "),
      engineListIsCompact: true,
      addedNote: "+4 engines · long tail",
      cumulative: yearLiveCount[4],
      addressable: yearAddressable[4],
      headerBg: THEME.midPurple,
      cardBg: THEME.paleAccent,
      isHighlight: false,
    },
  ];

  // Layout: 5 cards across the slide
  const cardW = 2.45;
  const gap = 0.13;
  const totalW = 5 * cardW + 4 * gap;
  const startX = (SLIDE_W - totalW) / 2;
  const cardY = 1.65;
  const cardH = 4.85;

  years.forEach((y, i) => {
    const x = startX + i * (cardW + gap);

    // Card background
    slide.addShape("rect", {
      x, y: cardY, w: cardW, h: cardH,
      fill: { color: y.cardBg },
      line: { color: y.headerBg, width: y.isHighlight ? 2 : 1 },
    });

    // Header band
    slide.addShape("rect", {
      x, y: cardY, w: cardW, h: 0.7,
      fill: { color: y.headerBg },
      line: { color: y.headerBg, width: 0 },
    });
    slide.addText([
      { text: y.title, options: { fontSize: 14, bold: true, breakLine: true } },
      { text: y.subtitle, options: { fontSize: 10, italic: true } },
    ], {
      x, y: cardY, w: cardW, h: 0.7,
      fontFace: THEME.headerFont, color: THEME.white,
      align: "center", valign: "middle",
    });

    let contentY = cardY + 0.85;

    // Key moment box (Y1, Y2 only)
    if (y.keyMoment) {
      slide.addShape("rect", {
        x: x + 0.15, y: contentY, w: cardW - 0.3, h: 0.85,
        fill: { color: THEME.purple },
        line: { color: THEME.darkPurple, width: 1 },
      });
      slide.addText([
        { text: y.keyMoment.label, options: { fontSize: 9, bold: true, breakLine: true } },
        { text: y.keyMoment.body, options: { fontSize: 12, bold: true } },
      ], {
        x: x + 0.15, y: contentY, w: cardW - 0.3, h: 0.85,
        fontFace: THEME.headerFont, color: THEME.white,
        align: "center", valign: "middle",
      });
      contentY += 1.0;
    }

    // Engine list
    if (y.engineListIsCompact) {
      // Y3-Y5: compact horizontal codes
      slide.addText(y.engineList, {
        x: x + 0.15, y: contentY, w: cardW - 0.3, h: 1.0,
        fontFace: THEME.bodyFont, fontSize: 13, bold: true,
        color: THEME.darkPurple, align: "center", valign: "middle",
      });
    } else {
      // Y1, Y2: vertical engine list with months
      slide.addText(y.engineList, {
        x: x + 0.15, y: contentY, w: cardW - 0.3, h: 1.5,
        fontFace: THEME.bodyFont, fontSize: 11,
        color: THEME.darkGrey, align: "center", valign: "top",
      });
    }

    // Footer divider + cumulative + addressable
    slide.addShape("line", {
      x: x + 0.3, y: cardY + cardH - 1.45, w: cardW - 0.6, h: 0,
      line: { color: y.headerBg, width: 1, dashType: "dash" },
    });
    slide.addText(y.cumulative + "  engines live", {
      x: x + 0.1, y: cardY + cardH - 1.35, w: cardW - 0.2, h: 0.45,
      fontFace: THEME.headerFont, fontSize: 16, bold: true,
      color: y.headerBg, align: "center", valign: "middle",
    });
    slide.addText(y.addedNote, {
      x: x + 0.1, y: cardY + cardH - 0.85, w: cardW - 0.2, h: 0.3,
      fontFace: THEME.bodyFont, fontSize: 9, italic: true,
      color: THEME.midGrey, align: "center", valign: "middle",
    });
    slide.addText(fmtNumK(y.addressable) + " addressable", {
      x: x + 0.1, y: cardY + cardH - 0.5, w: cardW - 0.2, h: 0.4,
      fontFace: THEME.headerFont, fontSize: 13, bold: true,
      color: THEME.darkPurple, align: "center", valign: "middle",
    });
  });

  // Bottom callout
  addCallout(slide,
    "Greedy TAM-maximising order: at every step, ship the engine that unlocks the largest combined corridor population. The German hub at M13 takes the addressable from 1.36M to 7.35M in three months — single biggest unlock in the entire 5-year plan.",
    6.65,
    { fill: THEME.darkPurple, color: THEME.white, h: 0.65, fontSize: 11, italic: true }
  );

  slide.addNotes([
    "This is the geographic expansion plan, end to end.",
    "Phase -1 on the far left: calculator live but no engines built specifically for it. Wishlist accumulates.",
    "Month one: launch. Three engines simultaneously — LU, FR, CH. LU is our beachhead. FR is the largest expat group living in Luxembourg. CH is the highest-value pension market in Europe — non-EU, third-pillar, premium positioning.",
    "Year one is quarterly: PT M3, ES M6, UK M9, IT M12. By M12 we have 7 engines and 1.36M addressable.",
    "Year two: the German hub at M13. Single most consequential month in the entire plan. DE-PL (1.18M Polish workers in Germany), DE-IT (413K Italians), DE-RO (454K Romanians). Addressable jumps from 1.36M to over 7M in three months.",
    "From there, ~2-month cadence through Y3, Y4, Y5. Central Europe, Mediterranean, Nordic, Baltic — small markets last.",
    "By M58, every EU member state plus UK and Switzerland. ~12M addressable across the entire European cross-border pension landscape.",
    "Order matters. Adding PT when only LU is supported unlocks 56K. Adding PT when LU + FR + CH are supported unlocks 565K. Same engine, 10× the TAM. The whole sequence is greedy TAM-maximizing."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 9 — Three Rings of Partnerships
// ════════════════════════════════════════════════════════════════════
// Concentric rings visual: LU at center, communities in LU as middle
// ring, home-country orgs as outer ring. Replaces the "3 priority
// bands" framing — same idea, stronger geographic visualisation.
function slide9_threeRings(deck) {
  const slide = deck.addSlide();

  addTitle(slide, "Three rings of partnerships — concentric, not parallel.");
  addSubhead(slide,
    "Luxembourg as launchpad: mobilise existing networks before reaching outward."
  );

  // ── LEFT SIDE — concentric rings ──
  const cx = 3.4, cy = 4.05;

  // Ring 3 (outermost — lightest)
  slide.addShape("ellipse", {
    x: cx - 2.2, y: cy - 2.2, w: 4.4, h: 4.4,
    fill: { color: THEME.lightPurple },
    line: { color: THEME.midPurple, width: 1.5 },
  });
  // Ring 2
  slide.addShape("ellipse", {
    x: cx - 1.55, y: cy - 1.55, w: 3.1, h: 3.1,
    fill: { color: THEME.midPurple },
    line: { color: THEME.purple, width: 1.5 },
  });
  // Ring 1
  slide.addShape("ellipse", {
    x: cx - 0.9, y: cy - 0.9, w: 1.8, h: 1.8,
    fill: { color: THEME.purple },
    line: { color: THEME.darkPurple, width: 1.5 },
  });
  // LU center dot
  slide.addShape("ellipse", {
    x: cx - 0.35, y: cy - 0.35, w: 0.7, h: 0.7,
    fill: { color: THEME.darkPurple },
    line: { color: THEME.white, width: 2 },
  });
  slide.addText("LU", {
    x: cx - 0.35, y: cy - 0.35, w: 0.7, h: 0.7,
    fontFace: THEME.headerFont, fontSize: 14, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });

  // Ring labels (in the visible band of each ring, at the top)
  slide.addText("RING 3", {
    x: cx - 2.2, y: cy - 2.05, w: 4.4, h: 0.3,
    fontFace: THEME.headerFont, fontSize: 10, bold: true,
    color: THEME.darkPurple, align: "center", valign: "middle",
  });
  slide.addText("RING 2", {
    x: cx - 1.55, y: cy - 1.4, w: 3.1, h: 0.3,
    fontFace: THEME.headerFont, fontSize: 10, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });
  slide.addText("RING 1", {
    x: cx - 0.9, y: cy - 0.78, w: 1.8, h: 0.28,
    fontFace: THEME.headerFont, fontSize: 9, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });

  // ── RIGHT SIDE — description boxes ──
  const boxX = 7.0;
  const boxW = 5.83;
  const boxH = 1.5;
  const boxGap = 0.13;

  // Ring 1 box (top — innermost ring)
  let boxY = 1.7;
  slide.addShape("rect", {
    x: boxX, y: boxY, w: boxW, h: boxH,
    fill: { color: THEME.paleAccent },
    line: { color: THEME.purple, width: 1.5 },
  });
  slide.addShape("rect", {
    x: boxX, y: boxY, w: boxW, h: 0.4,
    fill: { color: THEME.purple },
    line: { color: THEME.purple, width: 0 },
  });
  slide.addText("RING 1  ·  LU institutions", {
    x: boxX, y: boxY, w: boxW, h: 0.4,
    fontFace: THEME.headerFont, fontSize: 12, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });
  slide.addText([
    { text: "Chambers of Commerce, federations, public bodies, hubs, media, HR networks.", options: { breakLine: true } },
    { text: "Examples: ", options: { bold: true } },
    { text: "HoE, UEL, LHoFT, ABBL, FEDIL, HoST, ACA, CFA Society", options: { italic: true } },
  ], {
    x: boxX + 0.2, y: boxY + 0.45, w: boxW - 0.4, h: boxH - 0.5,
    fontFace: THEME.bodyFont, fontSize: 10,
    color: THEME.darkGrey, valign: "top",
  });

  // Ring 2 box
  boxY += boxH + boxGap;
  slide.addShape("rect", {
    x: boxX, y: boxY, w: boxW, h: boxH,
    fill: { color: THEME.paleAccent },
    line: { color: THEME.midPurple, width: 1.5 },
  });
  slide.addShape("rect", {
    x: boxX, y: boxY, w: boxW, h: 0.4,
    fill: { color: THEME.midPurple },
    line: { color: THEME.midPurple, width: 0 },
  });
  slide.addText("RING 2  ·  Country communities & associations in LU", {
    x: boxX, y: boxY, w: boxW, h: 0.4,
    fontFace: THEME.headerFont, fontSize: 12, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });
  slide.addText([
    { text: "Top 6 expat communities (PT, FR, IT, BE, DE, ES), bilateral chambers, diaspora groups, cultural institutes.", options: { breakLine: true } },
    { text: "Examples: ", options: { bold: true } },
    { text: "Contacto, CLAE, CCIPL, ACEP (PT) · French Chamber · Frontaliers Grand Est · HRCommunity", options: { italic: true } },
  ], {
    x: boxX + 0.2, y: boxY + 0.45, w: boxW - 0.4, h: boxH - 0.5,
    fontFace: THEME.bodyFont, fontSize: 10,
    color: THEME.darkGrey, valign: "top",
  });

  // Ring 3 box
  boxY += boxH + boxGap;
  slide.addShape("rect", {
    x: boxX, y: boxY, w: boxW, h: boxH,
    fill: { color: THEME.lightPurple },
    line: { color: THEME.midPurple, width: 1.5 },
  });
  slide.addShape("rect", {
    x: boxX, y: boxY, w: boxW, h: 0.4,
    fill: { color: THEME.lightPurple },
    line: { color: THEME.midPurple, width: 0 },
  });
  slide.addText("RING 3  ·  Home-country organisations", {
    x: boxX, y: boxY, w: boxW, h: 0.4,
    fontFace: THEME.headerFont, fontSize: 12, bold: true,
    color: THEME.darkPurple, align: "center", valign: "middle",
  });
  slide.addText([
    { text: "Chambers, business associations, and institutions in each target country — activated only when the corresponding engine ships.", options: { breakLine: true } },
    { text: "Examples: ", options: { bold: true } },
    { text: "PT, ES, UK, IT chambers of commerce; expat associations", options: { italic: true } },
  ], {
    x: boxX + 0.2, y: boxY + 0.45, w: boxW - 0.4, h: boxH - 0.5,
    fontFace: THEME.bodyFont, fontSize: 10,
    color: THEME.darkGrey, valign: "top",
  });

  // Bottom callout
  addCallout(slide,
    "Ring 1 opens doors. Ring 2 validates and refers. Ring 3 activates only when the corresponding engine ships. Concentration, not scattering.",
    6.65,
    { fill: THEME.darkPurple, color: THEME.white, h: 0.6, fontSize: 11, italic: true }
  );

  slide.addNotes([
    "Three rings. Concentric, not parallel.",
    "Center: Luxembourg — our launchpad. The whole strategy radiates outward from here.",
    "Ring 1: LU institutions. Chambers of Commerce, House of Entrepreneurship, UEL, LHoFT, ABBL, FEDIL, House of Startups, ACA, CFA Society. These are the trust anchors — the door-openers. Logos and warm intros come from here.",
    "Ring 2: country communities and associations living in LU. The top 6 expat communities — Portuguese, French, Italian, Belgian, German, Spanish. Bilateral chambers. Diaspora groups. Cultural institutes. These are the trusted messengers who pre-validate the product to their members. Specifically: Contacto, CLAE, CCIPL, ACEP for the Portuguese community — over 92,000 residents. French Chamber. Frontaliers Grand Est for the 120K daily commuters.",
    "Ring 3: home-country organisations. Chambers and business associations in the target countries themselves. These activate only when the corresponding country engine has shipped — Portugal chambers when PT engine is live, Spanish chambers when ES is live, and so on.",
    "Why concentric, not parallel? We mobilise what's closest first. Ring 1 gives us credibility we need to talk to Ring 2. Ring 2 gives us validated reach we need to land Ring 3. The entire BD co-founder workload concentrates on one ring at a time."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 10 — Lead Nationalities (PT / FR / ES)
// ════════════════════════════════════════════════════════════════════
// Three priority cards with population numbers and rationale. Anchors
// the strategy in real demographics rather than abstract framing.
function slide10_leadNationalities(deck) {
  const slide = deck.addSlide();

  addTitle(slide, "Lead nationalities: French first, Portuguese second, Spanish third.");
  addSubhead(slide,
    "Three communities with the highest leverage. Frontalier scale first, largest resident community second, fastest-growing wave third."
  );

  const nationalities = [
    {
      priority: "PRIORITY #1",
      country: "FRENCH",
      bigNum: "49K + 120K",
      subLabel: "residents + daily cross-border commuters",
      bullets: [
        "120K+ daily commuters — volume nobody else has",
        "2023 pension reform raised anxiety to historic peak",
        "Frontaliers Grand Est = ready-made distribution partner",
        "Bridge to Y2 France expansion",
      ],
      headerBg: THEME.darkPurple,
    },
    {
      priority: "PRIORITY #2",
      country: "PORTUGUESE",
      bigNum: "~92,000",
      subLabel: "residents in LU  ·  13.1% of total population",
      bullets: [
        "Largest foreign community in Luxembourg",
        "Strongest community infrastructure (Contacto, CLAE, CCIPL, ACEP)",
        "Highest emotional salience around pensions (return-migration)",
        "Bridge to Y2 Portugal expansion",
      ],
      headerBg: THEME.purple,
    },
    {
      priority: "PRIORITY #3",
      country: "SPANISH",
      bigNum: "~9,600",
      subLabel: "residents in LU  ·  ~1.4% of population",
      bullets: [
        "+472 new arrivals in 2024 — fastest EU growth",
        "Young, mobile workforce — high pension complexity",
        "Spanish content reusable from PT product track",
        "Bridge to Y3 Spain expansion",
      ],
      headerBg: THEME.midPurple,
    },
  ];

  // 3 cards in a row
  const cardW = 4.05, gap = 0.25;
  const totalW = 3 * cardW + 2 * gap;
  const startX = (SLIDE_W - totalW) / 2;
  const cardY = 1.65;
  const cardH = 4.85;

  nationalities.forEach((n, i) => {
    const x = startX + i * (cardW + gap);

    // Card background
    slide.addShape("rect", {
      x, y: cardY, w: cardW, h: cardH,
      fill: { color: THEME.paleAccent },
      line: { color: n.headerBg, width: 1.5 },
    });

    // Header band with PRIORITY # and country
    slide.addShape("rect", {
      x, y: cardY, w: cardW, h: 0.85,
      fill: { color: n.headerBg },
      line: { color: n.headerBg, width: 0 },
    });
    slide.addText([
      { text: n.priority, options: { fontSize: 11, bold: true, color: THEME.lightPurple, breakLine: true } },
      { text: n.country, options: { fontSize: 18, bold: true, color: THEME.white } },
    ], {
      x, y: cardY, w: cardW, h: 0.85,
      fontFace: THEME.headerFont, align: "center", valign: "middle",
    });

    // Big number
    slide.addText(n.bigNum, {
      x: x + 0.1, y: cardY + 1.0, w: cardW - 0.2, h: 0.85,
      fontFace: THEME.headerFont, fontSize: 30, bold: true,
      color: n.headerBg, align: "center", valign: "middle",
    });

    // Sub-label
    slide.addText(n.subLabel, {
      x: x + 0.2, y: cardY + 1.85, w: cardW - 0.4, h: 0.35,
      fontFace: THEME.bodyFont, fontSize: 10, italic: true,
      color: THEME.midGrey, align: "center", valign: "middle",
    });

    // Divider
    slide.addShape("line", {
      x: x + 0.3, y: cardY + 2.35, w: cardW - 0.6, h: 0,
      line: { color: n.headerBg, width: 1, dashType: "dash" },
    });

    // Bullets — "Why this priority"
    slide.addText("Why this priority:", {
      x: x + 0.25, y: cardY + 2.5, w: cardW - 0.5, h: 0.3,
      fontFace: THEME.bodyFont, fontSize: 10, bold: true,
      color: n.headerBg, align: "left", valign: "middle",
    });
    slide.addText(
      n.bullets.map(t => ({ text: "•  " + t, options: { breakLine: true } })),
      {
        x: x + 0.25, y: cardY + 2.85, w: cardW - 0.5, h: 1.85,
        fontFace: THEME.bodyFont, fontSize: 10.5,
        color: THEME.darkGrey, valign: "top", paraSpaceAfter: 4,
      }
    );
  });

  // Bottom callout
  addCallout(slide,
    "Three nationalities, three reasons. Together they account for ~150K addressable individuals in Luxembourg — and each one is a bridge to a country engine launch in Y1 or Y2.",
    6.65,
    { fill: THEME.darkPurple, color: THEME.white, h: 0.6, fontSize: 11, italic: true }
  );

  slide.addNotes([
    "Three lead nationalities, picked for different reasons. We focus there because they give us the highest leverage per BD hour.",
    "Priority #1: French. 49,000 residents PLUS 120,000 daily cross-border commuters from France. The 120K commuters are the volume nobody else has — that's the largest single touchpoint we can address. The 2023 French pension reform raised pension anxiety to historic levels. And Frontaliers Grand Est is a ready-made distribution partner that already represents the cross-border worker community. French goes first because of the sheer scale of the addressable touchpoint when commuters are counted.",
    "Priority #2: Portuguese. Approximately 92,000 residents in Luxembourg — 13.1 percent of the entire population, the largest resident foreign community by a wide margin. They have the strongest community infrastructure: Contacto is the Portuguese-language newspaper, CLAE is the umbrella organisation for foreign communities, CCIPL is the Portuguese chamber of commerce in Luxembourg, ACEP is the cultural association. The Portuguese community also has the highest emotional salience around pensions — many are first-generation workers planning return migration. Pension fragmentation is the central financial question of their retirement.",
    "Priority #3: Spanish. About 9,600 residents in Luxembourg. Smaller than the other two but with the fastest growth: +472 net new arrivals in 2024, the highest of any EU nationality. Young, mobile workforce — exactly the high-cross-border-pension-complexity demographic. And our Spanish-language content is immediately reusable from the Portuguese product track because the SEO and translation work overlap.",
    "Each of these communities is also a bridge to a country engine launch: French to Y2 France expansion, Portuguese to Y2 Portugal expansion, Spanish to Y3 Spain expansion. The lead nationalities are not just \"who we sell to\" — they're the natural beachheads for the corridor expansion."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 10 — Partnership Rollout Timeline
// ════════════════════════════════════════════════════════════════════
function slide10_partnershipTimeline(deck) {
  const slide = deck.addSlide();

  addTitle(slide, "Outreach waves aligned to engine rollout — concentrated, not scattered.");
  addSubhead(slide,
    "Each country wave coincides with corridor activation. The lead time grows as the engines get more complex."
  );

  const waves = [
    { wave: 1, weeks: "Weeks 1-4",   country: "LU + FR + CH", targets: "Luxembourg institutions + FR/CH-linked partners",
      goal: "Trust, visibility, warm intros", engineMonth: 1, color: THEME.purple },
    { wave: 2, weeks: "Weeks 11-12", country: "Portugal",     targets: "Portugal-linked partners",
      goal: "PT community activation",        engineMonth: 3, color: THEME.midPurple },
    { wave: 3, weeks: "Weeks 19-20", country: "Spain",        targets: "Spain-linked partners",
      goal: "ES community activation",        engineMonth: 6, color: THEME.midPurple },
    { wave: 4, weeks: "Weeks 27-28", country: "UK",           targets: "British Chamber + UK expat associations",
      goal: "Market-entry bridge (QROPS)",    engineMonth: 9, color: THEME.lightPurple },
    { wave: 5, weeks: "Weeks 35-36", country: "Italy",        targets: "Italy-linked partners + Italian community",
      goal: "Market-entry bridge (INPS)",     engineMonth: 12, color: THEME.lightPurple },
  ];

  // Timeline axis at the top
  const axisY = 2.0;
  const axisX1 = 0.7;
  const axisX2 = 12.7;
  const xPerWeek = (axisX2 - axisX1) / 40; // 40 weeks visible

  function weekToX(w) { return axisX1 + w * xPerWeek; }

  // Main axis line
  slide.addShape("line", {
    x: axisX1, y: axisY, w: axisX2 - axisX1, h: 0,
    line: { color: THEME.darkGrey, width: 2 },
  });

  // Month labels under axis
  [1, 3, 6, 9, 12].forEach(m => {
    const w = (m - 1) * 4.33;
    const x = weekToX(w);
    slide.addText("M" + m, {
      x: x - 0.3, y: axisY + 0.1, w: 0.6, h: 0.25,
      fontFace: THEME.bodyFont, fontSize: 9, bold: true,
      color: THEME.midGrey, align: "center",
    });
    slide.addShape("line", {
      x: x, y: axisY - 0.08, w: 0, h: 0.16,
      line: { color: THEME.darkGrey, width: 1 },
    });
  });

  // Engine launch markers (small triangles below axis)
  [
    { m: 1, label: "LU/FR/CH" },
    { m: 3, label: "PT" },
    { m: 6, label: "ES" },
    { m: 9, label: "UK" },
    { m: 12, label: "IT" },
  ].forEach(e => {
    const w = (e.m - 1) * 4.33;
    const x = weekToX(w);
    slide.addText("⬇ " + e.label + " ships", {
      x: x - 0.6, y: axisY + 0.42, w: 1.2, h: 0.25,
      fontFace: THEME.bodyFont, fontSize: 7, italic: true,
      color: THEME.midPurple, align: "center",
    });
  });

  // Wave markers above axis
  waves.forEach(wv => {
    const wkNum = parseInt(wv.weeks.replace(/[^0-9]/g, '').substring(0, 2)); // first 2 digits
    const x = weekToX(wkNum - 1);

    // Pill for wave
    slide.addShape("roundRect", {
      x: x - 0.7, y: axisY - 0.85, w: 1.4, h: 0.65,
      fill: { color: wv.color },
      line: { color: THEME.darkPurple, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText([
      { text: "Wave " + wv.wave, options: { fontSize: 9, bold: true, breakLine: true } },
      { text: wv.weeks, options: { fontSize: 8 } },
    ], {
      x: x - 0.7, y: axisY - 0.85, w: 1.4, h: 0.65,
      fontFace: THEME.bodyFont,
      color: wv.color === THEME.lightPurple ? THEME.darkPurple : THEME.white,
      align: "center", valign: "middle",
    });
    // Connecting line down to axis
    slide.addShape("line", {
      x: x, y: axisY - 0.2, w: 0, h: 0.2,
      line: { color: wv.color, width: 1 },
    });
  });

  // Wave detail blocks below the axis (all five in a row)
  const blockY = 3.4;
  const blockH = 1.9;
  const blockW = (SLIDE_W - 2*MARGIN - 0.4) / 5;
  waves.forEach((wv, i) => {
    const x = MARGIN + i * (blockW + 0.1);
    slide.addShape("rect", {
      x, y: blockY, w: blockW, h: blockH,
      fill: { color: THEME.offWhite },
      line: { color: wv.color, width: 1.5 },
    });
    slide.addShape("rect", {
      x, y: blockY, w: blockW, h: 0.4,
      fill: { color: wv.color },
      line: { color: wv.color, width: 0 },
    });
    slide.addText(wv.country, {
      x, y: blockY, w: blockW, h: 0.4,
      fontFace: THEME.headerFont, fontSize: 11, bold: true,
      color: wv.color === THEME.lightPurple ? THEME.darkPurple : THEME.white,
      align: "center", valign: "middle",
    });
    slide.addText([
      { text: "Targets:", options: { bold: true, breakLine: true } },
      { text: wv.targets, options: { breakLine: true } },
      { text: " ", options: { breakLine: true } },
      { text: "Goal:", options: { bold: true, breakLine: true } },
      { text: wv.goal },
    ], {
      x: x + 0.1, y: blockY + 0.45, w: blockW - 0.2, h: blockH - 0.5,
      fontFace: THEME.bodyFont, fontSize: 8,
      color: THEME.darkGrey, valign: "top",
    });
  });

  // Bottom rules
  addCallout(slide,
    "Sequencing rule: we do not activate all country associations at once. The BD co-founder cannot serve five countries in parallel and we don't try. Lower-priority logos stay warm in the tracker — deferred, not ignored.",
    5.65,
    { fill: THEME.darkPurple, color: THEME.white, h: 0.65, fontSize: 11 }
  );
  slide.addText(
    "Lead time grows for harder markets: UK has 2 months (QROPS regulation), IT has 3 months (fragmented INPS) — relationship-building is front-loaded for complex jurisdictions.",
    {
      x: MARGIN, y: 6.45, w: SLIDE_W - 2*MARGIN, h: 0.5,
      fontFace: THEME.bodyFont, fontSize: 11, italic: true,
      color: THEME.darkPurple, align: "center", valign: "middle",
    }
  );

  slide.addNotes([
    "This is the operational view. Five waves of partnership outreach across the first nine months.",
    "Wave 1: weeks 1-4, alongside the launch trio at M1. Luxembourg institutions plus France & Switzerland-linked partners. Goal: trust, visibility, warm intros.",
    "Wave 2: ~M3. Portugal-linked partners. PT engine ships at M3, so this is concurrent.",
    "Wave 3: ~M5. Spain-linked partners. Spain engine ships at M6, so we are starting outreach about a month before the engine is live.",
    "Wave 4: ~M7. British Chamber and UK expat associations. UK engine ships at M9, so we have two months of lead time.",
    "Wave 5: ~M9. Italian-linked partners. IT engine ships at M12, so we have three months of lead time.",
    "Notice the pattern: lead time grows as we move to more complex markets. UK has post-Brexit QROPS regulation. Italy has fragmented INPS plus casse di previdenza. Both need more relationship-building before launch.",
    "We do not activate all country associations at once. The BD co-founder cannot serve five countries in parallel. Lower-priority logos stay in the tracker — deferred, not ignored.",
    "This is also why partnerships are a leveraged channel. One deal with a French Chamber gives us access to their entire member base. We close maybe 20 meaningful partnerships across years 1-3."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 11 — Unit Economics, Told Honestly
// ════════════════════════════════════════════════════════════════════
function slide11_unitEconomics(deck) {
  const slide = deck.addSlide();

  addTitle(slide, "Unit economics — the honest math.");
  addSubhead(slide,
    "No cherry-picked ratios. Conservative parameters. Strong on a blended basis."
  );

  // Three vertical blocks
  const blockY = 1.65;
  const blockH = 4.2;
  const blockW = 4.0;
  const gap = 0.3;
  const startX = (SLIDE_W - 3*blockW - 2*gap) / 2;

  const blocks = [
    {
      title: "1. Subscription LTV",
      lines: [
        "Monthly subscription: €14.90",
        "Monthly churn: 3% (Recurly 2025 finance category median: 3.7%)",
        "Avg lifetime: 33 months",
      ],
      result: "Sub LTV: €492",
    },
    {
      title: "2. Lead-Gen LTV / Signup",
      lines: [
        "80% have a retirement gap",
        "× 25% click product offers",
        "× 15% invest via referral",
        "= 3% effective conversion",
        "Avg capital: €50,000",
        "Annual commission: €15",
        "10-year holding period",
      ],
      result: "Lead Gen LTV: €4.50",
    },
    {
      title: "3. CAC + LTV:CAC",
      lines: [
        "Per-signup CAC: €40",
        "Blended LTV per signup:",
        "  12% × €492 + €4.50 = €63.54",
        " ",
        "Per-paying-sub CAC: €333",
        "Per-sub LTV: €492",
        "Per-sub LTV:CAC: 1.48×",
      ],
      result: "Per-signup LTV:CAC: 1.6×",
    },
  ];

  blocks.forEach((b, i) => {
    const x = startX + i * (blockW + gap);
    // Block background
    slide.addShape("rect", {
      x, y: blockY, w: blockW, h: blockH,
      fill: { color: THEME.paleAccent },
      line: { color: THEME.midPurple, width: 1 },
    });
    // Header bar
    slide.addShape("rect", {
      x, y: blockY, w: blockW, h: 0.55,
      fill: { color: THEME.purple },
      line: { color: THEME.purple, width: 0 },
    });
    slide.addText(b.title, {
      x, y: blockY, w: blockW, h: 0.55,
      fontFace: THEME.headerFont, fontSize: 13, bold: true,
      color: THEME.white, align: "center", valign: "middle",
    });
    // Body lines
    slide.addText(
      b.lines.map(t => ({ text: t, options: { breakLine: true } })),
      {
        x: x + 0.2, y: blockY + 0.7, w: blockW - 0.4, h: 2.7,
        fontFace: THEME.bodyFont, fontSize: 11,
        color: THEME.darkGrey, valign: "top", paraSpaceAfter: 3,
      }
    );
    // Result
    slide.addShape("rect", {
      x, y: blockY + blockH - 0.7, w: blockW, h: 0.7,
      fill: { color: THEME.lightPurple },
      line: { color: THEME.purple, width: 0 },
    });
    slide.addText(b.result, {
      x, y: blockY + blockH - 0.7, w: blockW, h: 0.7,
      fontFace: THEME.headerFont, fontSize: 16, bold: true,
      color: THEME.darkPurple, align: "center", valign: "middle",
    });
  });

  // Bottom callout
  addCallout(slide,
    "Paid is only ~10% of total signups in the model. Organic SEO and distribution partnerships drive the majority of acquisition. Blended channel mix has healthier economics than this paid-only ratio implies — and post-launch CPC optimisation is a realistic path to 2.5–3× within 12 months.",
    6.1,
    { fill: THEME.darkPurple, color: THEME.white, h: 1.0, fontSize: 12, italic: false }
  );

  slide.addNotes([
    "Most decks show one LTV:CAC ratio and skip the math. We're showing the math because the math defends the business.",
    "Subscription LTV: 33 months at €14.90. €492.",
    "Lead gen LTV: small per signup but real. 3% of all platform users invest through a referral. Each investor produces about €150 over a 10-year holding period. €4.50 per signup.",
    "Blended expected value of a signup: €63.54. Modeled paid CAC: €40. Per-signup LTV:CAC = 1.6×.",
    "Honest framing: 1.6× is below the conventional 3× target. We're not going to pretend otherwise.",
    "But: paid acquisition is roughly 10% of total signups in this model. Organic and partnerships do most of the work. Blended channel economics are much healthier.",
    "Per-paying-sub: €40 / 12% = €333 effective CAC vs €492 sub LTV = 1.48×. Subscription revenue alone covers acquisition with margin.",
    "These are conservative parameters. €40 CAC is the high end for niche keywords with no competitive bidding. 3% churn is below median for the financial tools category. CPC optimization, landing page iteration, retargeting are all realistic paths to 2.5-3× within 12 months of launch.",
    "The honest framing is the strong framing here. If we showed a fake 3.7× and someone runs the math, we look bad. We show the real 1.6× and explain why it's defensible."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 12 — 5-Year Revenue Projections
// ════════════════════════════════════════════════════════════════════
function slide12_revenueProjections(deck, baseData, upsideData) {
  const slide = deck.addSlide();

  addTitle(slide, "€3.67M ARR by Year 5 — base scenario.");
  addSubhead(slide, "V6.2 model, conservative parameters.");

  // Top callout: wishlist note
  addCallout(slide,
    "Year 1 isn't cold-start: M1 launches with ~450 warm wishlist signups (Phase −1) of which ~40% activate to platform signups in the first month.",
    1.55,
    { fill: THEME.lightGold, color: THEME.darkGrey, h: 0.45, fontSize: 11, italic: true }
  );

  // Pull data
  const yearEndIdx = [11, 23, 35, 47, 59];
  const years = yearEndIdx.map(i => baseData[i]);
  const yearRevs = yearEndIdx.map((endIdx, yi) => {
    const slice = baseData.slice(yi*12, endIdx + 1);
    return {
      sub: slice.reduce((s, d) => s + d.subMRR, 0),
      lead: slice.reduce((s, d) => s + d.leadGenMonthly, 0),
      total: slice.reduce((s, d) => s + d.totalMRR, 0),
    };
  });

  const yoy = (i) => i === 0 ? "—" : (yearRevs[i].total / yearRevs[i-1].total).toFixed(2) + "×";

  // Build the table
  const headerCell = (text) => ({ text, options: { bold: true, color: THEME.white, fill: { color: THEME.purple }, align: "center", valign: "middle" } });
  const dataCell = (text, opts = {}) => ({ text, options: { color: THEME.darkGrey, align: opts.align || "right", valign: "middle", ...opts } });

  const tableRows = [
    [
      headerCell(""),
      headerCell("Year 1"), headerCell("Year 2"), headerCell("Year 3"), headerCell("Year 4"), headerCell("Year 5"),
    ],
    [
      dataCell("Countries live", { align: "left", bold: true }),
      ...years.map(y => dataCell("" + y.countriesLive, { align: "center" })),
    ],
    [
      dataCell("Addressable market", { align: "left", bold: true }),
      ...years.map(y => dataCell(fmtNumK(y.addressable), { align: "center" })),
    ],
    [
      dataCell("Paying subscribers", { align: "left", bold: true }),
      ...years.map(y => dataCell(y.totalPaidSubs.toLocaleString(), { align: "center" })),
    ],
    [
      dataCell("Subscription ARR", { align: "left" }),
      ...years.map(y => dataCell(fmtEurK(y.subARR))),
    ],
    [
      dataCell("Lead gen annual rev.", { align: "left" }),
      ...years.map(y => dataCell(fmtEurK(y.totalARR - y.subARR))),
    ],
    [
      { text: "Total ARR", options: { bold: true, color: THEME.darkPurple, fill: { color: THEME.lightGreen }, align: "left", valign: "middle" } },
      ...years.map(y => ({ text: fmtEurK(y.totalARR), options: { bold: true, color: THEME.darkPurple, fill: { color: THEME.lightGreen }, align: "right", valign: "middle" } })),
    ],
    [
      { text: "Capital under referral", options: { bold: true, color: THEME.darkGrey, fill: { color: THEME.lightGold }, align: "left", valign: "middle" } },
      ...years.map(y => ({ text: fmtEurM(y.totalCapital), options: { color: THEME.darkGrey, fill: { color: THEME.lightGold }, align: "right", valign: "middle" } })),
    ],
    [
      dataCell("YoY ARR growth", { align: "left", italic: true }),
      ...years.map((y, i) => dataCell(yoy(i), { align: "center", italic: true })),
    ],
  ];

  slide.addTable(tableRows, {
    x: MARGIN, y: 2.15, w: SLIDE_W - 2*MARGIN, h: 4.0,
    colW: [3.5, 1.77, 1.77, 1.77, 1.77, 1.77],
    fontFace: THEME.bodyFont, fontSize: 12,
    border: { type: "solid", color: THEME.lightGrey, pt: 0.5 },
  });

  addCallout(slide,
    "YoY ratios decelerate from 7.72× (Y2) to 1.34× (Y5) — the natural shape of a corridor-expansion model maturing into existing markets.",
    6.45,
    { fill: THEME.lightPurple, color: THEME.darkPurple, h: 0.5, fontSize: 11, italic: true }
  );

  slide.addNotes([
    "Year 5 base scenario: €3.67M total ARR. 21,221 paying subscribers across 29 country engines.",
    "Three things to notice.",
    "First: Year 1 isn't cold-start. Phase -1 builds a wishlist of ~450 warm signups, 40% of whom activate in M1. Measured demand, not zero.",
    "Second: YoY growth ratios. Year 2 is 7.7× — that's the German hub at M13, single largest TAM unlock. Then 2.6×, 1.6×, 1.3×. Natural shape of a SaaS business maturing into existing markets.",
    "Third: capital under referral at the bottom. €425M by Year 5. Lead gen revenue is small as a percentage of total but compounding pure margin — €127K/yr by Y5, growing on its own without acquisition spend.",
    "€3.67M is our committed base. Upside scenario hits €7.22M with defensible parameter shifts — slide 15."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 13 — The Break-Even Story
// ════════════════════════════════════════════════════════════════════
// Tells the journey through 6 milestone cards instead of a line chart.
// (Earlier version used addChart but the dynamic range — peak deficit
// ~€24K vs Y5 +€4.3M — made the V-shape visually invisible.)
function slide13_breakEven(deck, baseData) {
  const slide = deck.addSlide();

  addTitle(slide, "Profitable before the runway runs out.");
  addSubhead(slide,
    "Cumulative break-even at Month 20 — four months before the seed would have been depleted."
  );

  // Compute trajectory + key months from the model
  const cashBalance = model.computeCashBalance(baseData);
  const cashAt = m => cashBalance[m - 1].cash;
  const { monthlyBE, cumBE } = model.computeBreakEvens(baseData);

  // Find the month with the lowest cash balance after the seed arrives
  let peakDrawMonth = model.SEED_MONTH, peakDrawCash = cashAt(model.SEED_MONTH);
  for (let m = model.SEED_MONTH + 1; m <= 30; m++) {
    if (cashAt(m) < peakDrawCash) {
      peakDrawCash = cashAt(m);
      peakDrawMonth = m;
    }
  }
  const peakDeficitFromSeed = model.SEED_AMOUNT - peakDrawCash;

  // Format helpers for card values
  const fmtCardCash = c => {
    if (c >= 1e6) return "+€" + (c / 1e6).toFixed(2) + "M";
    if (c >= 1000) return "+€" + Math.round(c / 1000) + "K";
    if (c >= 0)    return "+€" + Math.round(c);
    return "−€" + Math.abs(Math.round(c)).toLocaleString();
  };

  // 6 milestone cards
  const milestones = [
    {
      month: "M1",
      title: "Platform launches",
      cash: cashAt(1),
      detail: "Founder self-funded\nWishlist activates",
      color: THEME.midGrey,
      bg: THEME.lightGrey,
    },
    {
      month: "M" + model.SEED_MONTH,
      title: "Seed arrives",
      cash: cashAt(model.SEED_MONTH),
      detail: "€230K deploys\nPaid acquisition begins",
      color: THEME.midPurple,
      bg: THEME.lightPurple,
    },
    {
      month: "M" + peakDrawMonth,
      title: "Peak draw from seed",
      cash: cashAt(peakDrawMonth),
      detail: "~" + fmtEurK(peakDeficitFromSeed) + " spent of €230K\n~" + fmtEurK(peakDrawCash) + " remaining",
      color: THEME.red,
      bg: THEME.lightRed,
    },
    {
      month: "M" + monthlyBE,
      title: "Monthly break-even",
      cash: cashAt(monthlyBE),
      detail: "Monthly revenue exceeds\nmonthly costs — slope flips",
      color: THEME.gold,
      bg: THEME.lightGold,
    },
    {
      month: "M" + cumBE,
      title: "Cumulative break-even",
      cash: cashAt(cumBE),
      detail: "Every euro of seed +\nbootstrap losses recovered",
      color: THEME.green,
      bg: THEME.lightGreen,
    },
    {
      month: "M60",
      title: "Y5 endpoint",
      cash: cashAt(60),
      detail: "+€4.08M cumulative net\nself-sustaining",
      color: THEME.green,
      bg: THEME.lightGreen,
    },
  ];

  // Layout: 6 cards across the slide
  const cardW = 2.05;
  const gap = 0.10;
  const totalW = 6 * cardW + 5 * gap;
  const startX = (SLIDE_W - totalW) / 2;
  const cardY = 1.75;
  const cardH = 4.45;

  // Render cards
  milestones.forEach((m, i) => {
    const x = startX + i * (cardW + gap);

    // Card background
    slide.addShape("rect", {
      x, y: cardY, w: cardW, h: cardH,
      fill: { color: m.bg },
      line: { color: m.color, width: 2 },
    });

    // Top header band with month label
    slide.addShape("rect", {
      x, y: cardY, w: cardW, h: 0.55,
      fill: { color: m.color },
      line: { color: m.color, width: 0 },
    });
    slide.addText(m.month, {
      x, y: cardY, w: cardW, h: 0.55,
      fontFace: THEME.headerFont, fontSize: 18, bold: true,
      color: THEME.white, align: "center", valign: "middle",
    });

    // Title (the "what happened")
    slide.addText(m.title, {
      x: x + 0.1, y: cardY + 0.7, w: cardW - 0.2, h: 0.85,
      fontFace: THEME.headerFont, fontSize: 13, bold: true,
      color: m.color, align: "center", valign: "middle",
    });

    // Cash value (the headline number)
    slide.addText(fmtCardCash(m.cash), {
      x: x + 0.1, y: cardY + 1.65, w: cardW - 0.2, h: 0.85,
      fontFace: THEME.headerFont, fontSize: 22, bold: true,
      color: m.color, align: "center", valign: "middle",
    });

    // Divider line
    slide.addShape("line", {
      x: x + 0.3, y: cardY + 2.65, w: cardW - 0.6, h: 0,
      line: { color: m.color, width: 1, dashType: "dash" },
    });

    // Detail (the "what to know")
    slide.addText(m.detail, {
      x: x + 0.15, y: cardY + 2.8, w: cardW - 0.3, h: 1.5,
      fontFace: THEME.bodyFont, fontSize: 10,
      color: THEME.darkGrey, align: "center", valign: "top",
    });
  });

  // Bottom callout — the punchline
  addCallout(slide,
    "The seed isn't bridging us to a Series A. The seed is bridging us to a self-sustaining business. Series A becomes optional, not survival.",
    6.4,
    { fill: THEME.darkPurple, color: THEME.white, h: 0.7, fontSize: 13, italic: true }
  );

  slide.addNotes([
    "This is the slide that explains why our seed pitch is structurally different from most seed pitches you'll see.",
    "Most decks at this stage show a P&L chart that doesn't cross zero for years. We don't have that slide because we don't have that problem.",
    "Cumulative cash balance, base scenario, M1 to M60.",
    "M1 to M6: bootstrap. Tiny revenue, small operating costs. Founder self-funded. Cash balance ticks slightly negative.",
    "M7: seed arrives. €230K. Cash jumps.",
    "M7 to ~M14: cash falls as paid acquisition ramps faster than revenue. Peak deficit around M14 — about €24K spent from the seed at the lowest point. We still have ~€206K in the bank.",
    "M16: monthly break-even. Operating revenue exceeds monthly costs. Slope changes from negative to positive.",
    "M20: cumulative break-even. The line crosses back through €230K — fully recovered. Every euro of seed plus all bootstrap losses, recovered.",
    "Then because there's no second raise required, the cash compounds. By Year 5: +€4.08M cumulative.",
    "The point: cumulative break-even at M20, four months before the seed runway would have ended. The seed isn't financing a runway. The seed is financing a bridge to a self-sustaining business. Series A becomes optional, not survival.",
    "That's an unusual story at seed stage and it's the single biggest reason we believe this round is the right round to lead."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 14 — Two Revenue Streams Compounding
// ════════════════════════════════════════════════════════════════════
function slide14_revenueStreams(deck, baseData) {
  const slide = deck.addSlide();

  addTitle(slide, "Two revenue streams. One compounds forever.");
  addSubhead(slide,
    "Subscriptions are the headline. Lead gen is an asset that grows even without new acquisition."
  );

  // Pull capital trajectory
  const yearEndIdx = [11, 23, 35, 47, 59];
  const capitals = yearEndIdx.map(i => baseData[i].totalCapital);

  // Two stream cards at top
  const cardW = 5.9, gap = 0.4;
  const cardY = 1.65;
  const cardH = 2.4;
  const startX = (SLIDE_W - 2*cardW - gap) / 2;

  // LEFT — Subscriptions
  slide.addShape("rect", {
    x: startX, y: cardY, w: cardW, h: cardH,
    fill: { color: THEME.lightPurple },
    line: { color: THEME.purple, width: 1.5 },
  });
  slide.addShape("rect", {
    x: startX, y: cardY, w: cardW, h: 0.55,
    fill: { color: THEME.purple },
    line: { color: THEME.purple, width: 0 },
  });
  slide.addText("STREAM 1  ·  Subscriptions", {
    x: startX, y: cardY, w: cardW, h: 0.55,
    fontFace: THEME.headerFont, fontSize: 14, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });
  slide.addText([
    { text: "€14.90/mo  ·  €149/yr", options: { fontSize: 14, bold: true, color: THEME.darkPurple, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "•  Sub LTV: €492 (33-month lifetime at 3% churn)", options: { breakLine: true } },
    { text: "•  Recurring revenue, traditional SaaS metric", options: { breakLine: true } },
    { text: "•  Year 5 base: €3.54M sub ARR", options: { breakLine: true } },
    { text: "•  ~96% of total ARR — dominant stream", options: {} },
  ], {
    x: startX + 0.3, y: cardY + 0.7, w: cardW - 0.6, h: cardH - 0.85,
    fontFace: THEME.bodyFont, fontSize: 11, color: THEME.darkGrey,
    valign: "top", paraSpaceAfter: 4,
  });

  // RIGHT — Lead Gen
  const rightX = startX + cardW + gap;
  slide.addShape("rect", {
    x: rightX, y: cardY, w: cardW, h: cardH,
    fill: { color: THEME.lightGold },
    line: { color: THEME.gold, width: 2 },
  });
  slide.addShape("rect", {
    x: rightX, y: cardY, w: cardW, h: 0.55,
    fill: { color: THEME.gold },
    line: { color: THEME.gold, width: 0 },
  });
  slide.addText("STREAM 2  ·  Lead Gen (Compounding Asset)", {
    x: rightX, y: cardY, w: cardW, h: 0.55,
    fontFace: THEME.headerFont, fontSize: 14, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });
  slide.addText([
    { text: "0.03% trailing on referred capital", options: { fontSize: 14, bold: true, color: THEME.gold, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "•  Compounds — invested capital stays + grows", options: { breakLine: true } },
    { text: "•  10-year average holding period", options: { breakLine: true } },
    { text: "•  Pure margin (no acquisition spend after referral)", options: { breakLine: true } },
    { text: "•  Year 5 base: €127K/yr — small but durable", options: {} },
  ], {
    x: rightX + 0.3, y: cardY + 0.7, w: cardW - 0.6, h: cardH - 0.85,
    fontFace: THEME.bodyFont, fontSize: 11, color: THEME.darkGrey,
    valign: "top", paraSpaceAfter: 4,
  });

  // Bottom: capital trajectory as 5 vertical bars (manual)
  slide.addText("Capital under referral trajectory  ·  base scenario", {
    x: 0.5, y: 4.35, w: SLIDE_W - 1.0, h: 0.4,
    fontFace: THEME.headerFont, fontSize: 13, bold: true,
    color: THEME.darkPurple, align: "center", valign: "middle",
  });

  const yearLabels = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];
  const trajectoryY = 4.85;
  const maxBarH = 1.2;
  const trajectoryW = SLIDE_W - 2.0;
  const cellW = trajectoryW / 5;
  const trajectoryX = 1.0;

  yearLabels.forEach((label, i) => {
    const cellLeft = trajectoryX + i * cellW;
    const cellMid = cellLeft + cellW / 2;
    const heightPct = capitals[i] / capitals[4]; // Y5 = 100%
    const barH = Math.max(0.05, maxBarH * heightPct);
    const barW = 0.9;

    // Vertical bar
    slide.addShape("rect", {
      x: cellMid - barW / 2, y: trajectoryY + maxBarH - barH, w: barW, h: barH,
      fill: { color: THEME.gold },
      line: { color: THEME.gold, width: 0 },
    });

    // Year label below bar
    slide.addText(label, {
      x: cellLeft, y: trajectoryY + maxBarH + 0.1, w: cellW, h: 0.3,
      fontFace: THEME.bodyFont, fontSize: 11,
      color: THEME.darkGrey, align: "center", valign: "middle",
    });
    // Capital value
    slide.addText(fmtEurM(capitals[i]), {
      x: cellLeft, y: trajectoryY + maxBarH + 0.4, w: cellW, h: 0.4,
      fontFace: THEME.headerFont, fontSize: 14, bold: true,
      color: THEME.gold, align: "center", valign: "middle",
    });
  });

  // Bottom callout
  addCallout(slide,
    "The long-term moat: capital under referral keeps compounding past Year 5 — Y10 ~€545M, Y15 €950M+ — generating pure-margin revenue indefinitely. Subscriptions monetise the present; lead gen monetises the past.",
    6.7,
    { fill: THEME.darkPurple, color: THEME.white, h: 0.65, fontSize: 11, italic: true }
  );

  slide.addNotes([
    "Two streams. Different mechanics. Different timescales.",
    "Stream 1: subscriptions. €14.90/mo. Standard SaaS metric. €492 LTV at 33-month lifetime. 96% of total ARR. This is the headline business.",
    "Stream 2: lead gen. 0.03% trailing commission on capital that users invest through our product referrals. Each investor produces ~€150 over a 10-year holding period.",
    "The interesting thing about stream 2 is it compounds. Every cohort of investors keeps paying for as long as their capital stays invested. New cohorts add to the base. Existing capital grows with contributions and market returns.",
    "Capital under referral by year: Y1 €6.6M, Y2 €54.9M, Y3 €157.4M, Y4 €283.6M, Y5 €425M.",
    "By Y5 lead gen produces €127K/yr. Small as a percentage of total ARR (about 4%) but pure margin, no ongoing acquisition cost.",
    "And here's the long game: even if user acquisition stopped at Y5, the capital under referral would keep growing at ~5% per year through contributions and market returns. By Y10, ~€545M. By Y15 with new acquisition, €950M+. The lead gen revenue stream becomes a structural asset.",
    "The framing for investors: subscriptions monetise the present. Lead gen monetises the past."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 15 — Base vs Upside
// ════════════════════════════════════════════════════════════════════
function slide15_baseVsUpside(deck, baseData, upsideData) {
  const slide = deck.addSlide();

  addTitle(slide, "Base vs upside — same business, defensible parameter shifts.");
  addSubhead(slide,
    "Upside isn't a moonshot. It's the model with realistic post-launch CPC, churn, conversion, and partnership performance."
  );

  // Two large summary cards at top
  const cardW = 5.9, gap = 0.4;
  const cardY = 1.65;
  const cardH = 2.4;
  const startX = (SLIDE_W - 2*cardW - gap) / 2;

  // BASE
  slide.addShape("rect", {
    x: startX, y: cardY, w: cardW, h: cardH,
    fill: { color: THEME.paleAccent },
    line: { color: THEME.midPurple, width: 1.5 },
  });
  slide.addShape("rect", {
    x: startX, y: cardY, w: cardW, h: 0.55,
    fill: { color: THEME.midPurple },
    line: { color: THEME.midPurple, width: 0 },
  });
  slide.addText("BASE  ·  committed", {
    x: startX, y: cardY, w: cardW, h: 0.55,
    fontFace: THEME.headerFont, fontSize: 14, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });
  slide.addText("€3.67M", {
    x: startX, y: cardY + 0.65, w: cardW, h: 0.95,
    fontFace: THEME.headerFont, fontSize: 52, bold: true,
    color: THEME.darkPurple, align: "center", valign: "middle",
  });
  slide.addText("Year 5 ARR  ·  21,221 paying subscribers  ·  €425M capital under referral", {
    x: startX, y: cardY + 1.7, w: cardW, h: 0.55,
    fontFace: THEME.bodyFont, fontSize: 11, italic: true,
    color: THEME.darkGrey, align: "center", valign: "middle",
  });

  // UPSIDE
  const rightX = startX + cardW + gap;
  slide.addShape("rect", {
    x: rightX, y: cardY, w: cardW, h: cardH,
    fill: { color: THEME.lightGold },
    line: { color: THEME.gold, width: 2 },
  });
  slide.addShape("rect", {
    x: rightX, y: cardY, w: cardW, h: 0.55,
    fill: { color: THEME.gold },
    line: { color: THEME.gold, width: 0 },
  });
  slide.addText("UPSIDE  ·  defensible", {
    x: rightX, y: cardY, w: cardW, h: 0.55,
    fontFace: THEME.headerFont, fontSize: 14, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });
  slide.addText("€7.22M", {
    x: rightX, y: cardY + 0.65, w: cardW, h: 0.95,
    fontFace: THEME.headerFont, fontSize: 52, bold: true,
    color: THEME.gold, align: "center", valign: "middle",
  });
  slide.addText("Year 5 ARR  ·  42,128 paying subscribers  ·  faster partnership ramp", {
    x: rightX, y: cardY + 1.7, w: cardW, h: 0.55,
    fontFace: THEME.bodyFont, fontSize: 11, italic: true,
    color: THEME.darkGrey, align: "center", valign: "middle",
  });

  // Below: parameter comparison table
  const tableY = 4.35;
  const headerStyle = { bold: true, color: THEME.white, fill: { color: THEME.purple }, align: "center", valign: "middle" };
  const baseCellStyle = { color: THEME.darkGrey, align: "center", valign: "middle" };
  const upsideCellStyle = { color: THEME.darkGrey, align: "center", valign: "middle", fill: { color: THEME.lightGold }, bold: true };

  const tableRows = [
    [
      { text: "Parameter", options: headerStyle },
      { text: "Base", options: headerStyle },
      { text: "Upside", options: headerStyle },
      { text: "Why upside is defensible", options: headerStyle },
    ],
    [
      { text: "Per-signup CAC", options: { ...baseCellStyle, align: "left", bold: true } },
      { text: "€40", options: baseCellStyle },
      { text: "€30", options: upsideCellStyle },
      { text: "Niche keywords with no competitive bidding push CPC lower as we mature", options: { ...baseCellStyle, align: "left", fontSize: 10 } },
    ],
    [
      { text: "Paid signup → sub conversion", options: { ...baseCellStyle, align: "left", bold: true } },
      { text: "12%", options: baseCellStyle },
      { text: "15%", options: upsideCellStyle },
      { text: "Better landing pages, retargeting, in-product upgrade prompts", options: { ...baseCellStyle, align: "left", fontSize: 10 } },
    ],
    [
      { text: "Monthly churn", options: { ...baseCellStyle, align: "left", bold: true } },
      { text: "3.0%", options: baseCellStyle },
      { text: "2.5%", options: upsideCellStyle },
      { text: "Multi-year pension context + vault data lock-in increases retention", options: { ...baseCellStyle, align: "left", fontSize: 10 } },
    ],
    [
      { text: "Distribution partnerships (Y5)", options: { ...baseCellStyle, align: "left", bold: true } },
      { text: "20", options: baseCellStyle },
      { text: "30", options: upsideCellStyle },
      { text: "Faster BD ramp once core launch markets are proven", options: { ...baseCellStyle, align: "left", fontSize: 10 } },
    ],
  ];

  slide.addTable(tableRows, {
    x: MARGIN, y: tableY, w: SLIDE_W - 2*MARGIN, h: 1.95,
    colW: [3.0, 1.5, 1.5, 6.33],
    fontFace: THEME.bodyFont, fontSize: 11,
    border: { type: "solid", color: THEME.lightGrey, pt: 0.5 },
  });

  // Bottom callout
  addCallout(slide,
    "Each upside parameter is individually defensible from launch metrics. None require heroics. The €7.22M upside is the model with realistic post-launch tuning, not a stretch goal.",
    6.55,
    { fill: THEME.darkPurple, color: THEME.white, h: 0.55, fontSize: 11, italic: true }
  );

  slide.addNotes([
    "Two scenarios. Base is what we're committing to. Upside is what we expect with realistic post-launch tuning.",
    "Base: €3.67M Y5 ARR, 21,221 subs.",
    "Upside: €7.22M Y5 ARR, 42,128 subs.",
    "The four parameter shifts that produce the upside:",
    "1. Per-signup CAC drops from €40 to €30. This happens when we optimize CPC, improve landing page conversion, and add retargeting. Niche keywords with no competitive bidding push the floor lower.",
    "2. Paid signup-to-paid conversion goes from 12% to 15%. Better in-product upgrade prompts, better gap-surfacing UX.",
    "3. Monthly churn drops from 3% to 2.5%. Multi-year pension context already gives us high retention. Vault data lock-in compounds it.",
    "4. Active distribution partnerships at Y5 grow from 20 to 30. Faster BD ramp once core launch markets are proven.",
    "None of these require heroics. Each is individually defensible from a measured Phase 1 baseline.",
    "The framing matters: upside isn't a stretch goal. Upside is the model with parameters we expect to actually hit post-launch."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 16 — Use of €230K
// ════════════════════════════════════════════════════════════════════
function slide16_useOfFunds(deck) {
  const slide = deck.addSlide();

  addTitle(slide, "€230K seed: pure variable acquisition cost.");
  addSubhead(slide,
    "Co-founder labor, engine builds, and partnerships are all funded by equity. The seed only buys things that scale with growth."
  );

  // Top framing callout
  addCallout(slide,
    "By the time the seed deploys at M7, the calculator has been live for 9 months and the platform for 6. Paid acquisition pours fuel on a measured fire.",
    1.55,
    { fill: THEME.lightGold, color: THEME.darkGrey, h: 0.5, fontSize: 11, italic: true }
  );

  // Use of funds table
  const headerStyle = { bold: true, color: THEME.white, fill: { color: THEME.purple }, align: "center", valign: "middle" };
  const cellStyle = { color: THEME.darkGrey, align: "left", valign: "middle" };

  const tableRows = [
    [
      { text: "Category", options: headerStyle },
      { text: "Amount", options: headerStyle },
      { text: "When deployed", options: headerStyle },
      { text: "What it buys", options: headerStyle },
    ],
    [
      { text: "Paid acquisition", options: { ...cellStyle, bold: true } },
      { text: "€180,000", options: { ...cellStyle, align: "center", bold: true } },
      { text: "M7-M60 ramp\n(€3K → €25K/mo)", options: cellStyle },
      { text: "~4,500 platform signups at €40 blended CAC → ~540 paid users at 12% conversion → ~€96K additional sub ARR over 5y", options: cellStyle },
    ],
    [
      { text: "Content & SEO acceleration", options: { ...cellStyle, bold: true } },
      { text: "€50,000", options: { ...cellStyle, align: "center", bold: true } },
      { text: "M7-M18\n(~€4K/mo)", options: cellStyle },
      { text: "Multi-language SEO content per corridor; multi-country landing pages — compounds annually", options: cellStyle },
    ],
    [
      { text: "TOTAL", options: { fill: { color: THEME.lightGreen }, bold: true, color: THEME.darkPurple, align: "left", valign: "middle" } },
      { text: "€230,000", options: { fill: { color: THEME.lightGreen }, bold: true, color: THEME.darkPurple, align: "center", valign: "middle" } },
      { text: "", options: { fill: { color: THEME.lightGreen }, valign: "middle" } },
      { text: "", options: { fill: { color: THEME.lightGreen }, valign: "middle" } },
    ],
  ];

  slide.addTable(tableRows, {
    x: MARGIN, y: 2.2, w: SLIDE_W - 2*MARGIN, h: 2.6,
    colW: [2.6, 1.6, 2.4, 5.73],
    fontFace: THEME.bodyFont, fontSize: 11,
    border: { type: "solid", color: THEME.lightGrey, pt: 0.5 },
    rowH: 0.7,
  });

  // "What is NOT in the seed" block
  slide.addShape("rect", {
    x: MARGIN, y: 5.0, w: SLIDE_W - 2*MARGIN, h: 1.8,
    fill: { color: THEME.offWhite },
    line: { color: THEME.midGrey, width: 1 },
  });
  slide.addText("What is NOT in the seed (funded by equity, not cash):", {
    x: MARGIN + 0.2, y: 5.05, w: SLIDE_W - 2*MARGIN - 0.4, h: 0.35,
    fontFace: THEME.headerFont, fontSize: 13, bold: true,
    color: THEME.darkGrey, align: "left", valign: "middle",
  });
  slide.addText([
    { text: "❌  Co-founder salaries — technical + BD on equity until Series A", options: { breakLine: true } },
    { text: "❌  Engine development — 29 pension engines built by technical co-founder over 5 years; founder labor", options: { breakLine: true } },
    { text: "❌  BD / distribution partnerships — owned full-time by BD co-founder, no salary line", options: { breakLine: true } },
    { text: "❌  Legal entity setup, infrastructure, basic ops — founder self-funded during Phases −1 and 1" },
  ], {
    x: MARGIN + 0.2, y: 5.4, w: SLIDE_W - 2*MARGIN - 0.4, h: 1.3,
    fontFace: THEME.bodyFont, fontSize: 11,
    color: THEME.darkGrey, valign: "top", paraSpaceAfter: 4,
  });

  slide.addNotes([
    "€230K, two line items only.",
    "€180K for paid acquisition. Budget ramps from €3K/mo at M7 to €25K/mo by M60. ~4,500 additional platform signups at €40 CAC. ~540 paid subs at 12% conversion. ~€96K additional subscription ARR over 5 years plus compounding lead gen.",
    "€50K for content and SEO acceleration. Multi-language landing pages per migration corridor.",
    "Excluded from the seed: co-founder salaries, engine development, BD partnerships, legal entity, infrastructure, ongoing ops. All funded by equity and founder labor.",
    "Framing: by the time the seed deploys at M7, the calculator has been live 9 months (3 of Phase -1 + 6 of Phase 1), platform live 6 months. We have measured conversion rates, an active user base, an activated wishlist, and corridors with real traffic.",
    "The seed isn't bridging us across a chasm of unknown unit economics. The seed pours fuel on a measured fire. Those €40 of paid spend become one platform signup with confidence — we proved the funnel rates in Phase 1 without spending a euro of investor capital."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 17 — Capital Stack & Dilution
// ════════════════════════════════════════════════════════════════════
function slide17_capitalStack(deck) {
  const slide = deck.addSlide();

  addTitle(slide, "€230K capital stack — grant-dominant, 0–4% dilution.");
  addSubhead(slide,
    "Two paths to the same €230K. Both keep founder dilution under 5% at seed."
  );

  // Two stack cards
  const cardW = 6.0, gap = 0.4;
  const cardY = 1.65;
  const cardH = 4.5;
  const startX = (SLIDE_W - 2*cardW - gap) / 2;

  // ── PRIMARY STACK ──
  slide.addShape("rect", {
    x: startX, y: cardY, w: cardW, h: cardH,
    fill: { color: THEME.paleAccent },
    line: { color: THEME.purple, width: 1.5 },
  });
  slide.addShape("rect", {
    x: startX, y: cardY, w: cardW, h: 0.6,
    fill: { color: THEME.purple },
    line: { color: THEME.purple, width: 0 },
  });
  slide.addText("PRIMARY  ·  2–4% dilution", {
    x: startX, y: cardY, w: cardW, h: 0.6,
    fontFace: THEME.headerFont, fontSize: 14, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });

  const primaryRows = [
    { src: "Fit4Start (Tranche 1)", amt: "€50K", dil: "0%", note: "On LU company registration" },
    { src: "LBAN angels or Expon Capital", amt: "€80K", dil: "2–4%", note: "Pre-money €2-4M, convertible note" },
    { src: "Fit4Start (Tranche 2)", amt: "€80K", dil: "0%", note: "After coaching + co-financing" },
    { src: "Fit4Start (Tranche 3)", amt: "€20K", dil: "0%", note: "On KPI achievement" },
  ];

  let rowY = cardY + 0.85;
  primaryRows.forEach(r => {
    slide.addText(r.src, {
      x: startX + 0.2, y: rowY, w: 3.5, h: 0.4,
      fontFace: THEME.bodyFont, fontSize: 11, bold: true,
      color: THEME.darkGrey, align: "left", valign: "middle",
    });
    slide.addText(r.amt, {
      x: startX + 3.7, y: rowY, w: 1.2, h: 0.4,
      fontFace: THEME.headerFont, fontSize: 12, bold: true,
      color: THEME.darkPurple, align: "right", valign: "middle",
    });
    slide.addText(r.dil, {
      x: startX + 4.95, y: rowY, w: 0.95, h: 0.4,
      fontFace: THEME.headerFont, fontSize: 11, bold: true,
      color: r.dil === "0%" ? THEME.green : THEME.gold,
      align: "center", valign: "middle",
    });
    slide.addText(r.note, {
      x: startX + 0.2, y: rowY + 0.36, w: cardW - 0.4, h: 0.25,
      fontFace: THEME.bodyFont, fontSize: 9, italic: true,
      color: THEME.midGrey, align: "left", valign: "top",
    });
    rowY += 0.78;
  });

  // Total row
  slide.addShape("rect", {
    x: startX + 0.15, y: cardY + cardH - 0.7, w: cardW - 0.3, h: 0.55,
    fill: { color: THEME.lightPurple },
    line: { color: THEME.purple, width: 0 },
  });
  slide.addText("TOTAL", {
    x: startX + 0.25, y: cardY + cardH - 0.7, w: 3.5, h: 0.55,
    fontFace: THEME.headerFont, fontSize: 13, bold: true,
    color: THEME.darkPurple, align: "left", valign: "middle",
  });
  slide.addText("€230K", {
    x: startX + 3.7, y: cardY + cardH - 0.7, w: 1.2, h: 0.55,
    fontFace: THEME.headerFont, fontSize: 14, bold: true,
    color: THEME.darkPurple, align: "right", valign: "middle",
  });
  slide.addText("2–4%", {
    x: startX + 4.95, y: cardY + cardH - 0.7, w: 0.95, h: 0.55,
    fontFace: THEME.headerFont, fontSize: 13, bold: true,
    color: THEME.gold, align: "center", valign: "middle",
  });

  // ── ALTERNATIVE STACK ──
  const rightX = startX + cardW + gap;
  slide.addShape("rect", {
    x: rightX, y: cardY, w: cardW, h: cardH,
    fill: { color: THEME.lightGreen },
    line: { color: THEME.green, width: 2 },
  });
  slide.addShape("rect", {
    x: rightX, y: cardY, w: cardW, h: 0.6,
    fill: { color: THEME.green },
    line: { color: THEME.green, width: 0 },
  });
  slide.addText("ALTERNATIVE  ·  0% dilution", {
    x: rightX, y: cardY, w: cardW, h: 0.6,
    fontFace: THEME.headerFont, fontSize: 14, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });

  const altRows = [
    { src: "Fit4Start (full)", amt: "€150K", dil: "0%", note: "3 tranches across M5-M16" },
    { src: "YIE — Young Innovative Enterprise", amt: "€80K", dil: "0%", note: "70% co-financing of qualifying R&D costs" },
  ];

  rowY = cardY + 0.85;
  altRows.forEach(r => {
    slide.addText(r.src, {
      x: rightX + 0.2, y: rowY, w: 4.0, h: 0.4,
      fontFace: THEME.bodyFont, fontSize: 11, bold: true,
      color: THEME.darkGrey, align: "left", valign: "middle",
    });
    slide.addText(r.amt, {
      x: rightX + 4.2, y: rowY, w: 1.0, h: 0.4,
      fontFace: THEME.headerFont, fontSize: 12, bold: true,
      color: THEME.green, align: "right", valign: "middle",
    });
    slide.addText(r.dil, {
      x: rightX + 5.25, y: rowY, w: 0.65, h: 0.4,
      fontFace: THEME.headerFont, fontSize: 11, bold: true,
      color: THEME.green, align: "center", valign: "middle",
    });
    slide.addText(r.note, {
      x: rightX + 0.2, y: rowY + 0.36, w: cardW - 0.4, h: 0.25,
      fontFace: THEME.bodyFont, fontSize: 9, italic: true,
      color: THEME.midGrey, align: "left", valign: "top",
    });
    rowY += 0.78;
  });

  // "Why this path" block in the alt card empty space
  slide.addShape("rect", {
    x: rightX + 0.2, y: cardY + 2.5, w: cardW - 0.4, h: 1.2,
    fill: { color: THEME.white },
    line: { color: THEME.green, width: 1, dashType: "dash" },
  });
  slide.addText([
    { text: "Why this path?", options: { fontSize: 12, bold: true, color: THEME.green, breakLine: true } },
    { text: "Fully non-dilutive — founders retain 100% of equity through seed.", options: { fontSize: 10, breakLine: true } },
    { text: "Worth pursuing aggressively even if it delays the timeline by 2-3 months.", options: { fontSize: 10, italic: true } },
  ], {
    x: rightX + 0.35, y: cardY + 2.55, w: cardW - 0.7, h: 1.1,
    fontFace: THEME.bodyFont, color: THEME.darkGrey,
    align: "left", valign: "top",
  });

  // Total row
  slide.addShape("rect", {
    x: rightX + 0.15, y: cardY + cardH - 0.7, w: cardW - 0.3, h: 0.55,
    fill: { color: THEME.green },
    line: { color: THEME.green, width: 0 },
  });
  slide.addText("TOTAL", {
    x: rightX + 0.25, y: cardY + cardH - 0.7, w: 4.0, h: 0.55,
    fontFace: THEME.headerFont, fontSize: 13, bold: true,
    color: THEME.white, align: "left", valign: "middle",
  });
  slide.addText("€230K", {
    x: rightX + 4.2, y: cardY + cardH - 0.7, w: 1.0, h: 0.55,
    fontFace: THEME.headerFont, fontSize: 14, bold: true,
    color: THEME.white, align: "right", valign: "middle",
  });
  slide.addText("0%", {
    x: rightX + 5.25, y: cardY + cardH - 0.7, w: 0.65, h: 0.55,
    fontFace: THEME.headerFont, fontSize: 13, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });

  // Bottom callout
  addCallout(slide,
    "Convertible loan agreement (CLA) for the dilutive portion — common in EU, familiar to LU lawyers and investors. The major dilution event is Series A, not seed.",
    6.45,
    { fill: THEME.darkPurple, color: THEME.white, h: 0.6, fontSize: 11, italic: true }
  );

  slide.addNotes([
    "Two paths to €230K. Both keep us under 5% dilution at seed.",
    "Primary path: Fit4Start €150K across three tranches plus a small €80K angel or Expon Capital top-up. Total €230K, 2-4% dilution depending on pre-money valuation.",
    "Alternative path: Fit4Start €150K plus YIE — Young Innovative Enterprise — €80K. Both fully non-dilutive. Founders retain 100% of equity through seed. YIE requires 15% of operating expenses on R&D and is harder to qualify for, but if we hit the criteria, this path is preferred.",
    "Either way, the major dilution event is Series A, not seed. We expect 15-25% dilution at Series A, ~Month 24-30, with MiddleGame Ventures as the natural lead.",
    "Instrument for the dilutive portion: convertible loan agreement. CLA is the standard EU instrument — familiar to LU lawyers, used by LBAN and Expon regularly. Avoids fighting over exact valuation at seed."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 18 — Team & Path to Series A
// ════════════════════════════════════════════════════════════════════
function slide18_teamAndSeriesA(deck) {
  const slide = deck.addSlide();

  addTitle(slide, "Two co-founders. €0 salary. Bridge to Series A.");
  addSubhead(slide,
    "Both co-founders work on equity through Series A. Trigger metrics hit by M24 — comfortably inside the runway."
  );

  // Two co-founder cards
  const cardW = 5.9, gap = 0.4;
  const cardY = 1.65;
  const cardH = 2.2;
  const startX = (SLIDE_W - 2*cardW - gap) / 2;

  // TECHNICAL
  slide.addShape("rect", {
    x: startX, y: cardY, w: cardW, h: cardH,
    fill: { color: THEME.lightPurple },
    line: { color: THEME.purple, width: 1.5 },
  });
  slide.addShape("rect", {
    x: startX, y: cardY, w: cardW, h: 0.55,
    fill: { color: THEME.purple },
    line: { color: THEME.purple, width: 0 },
  });
  slide.addText("TECHNICAL CO-FOUNDER", {
    x: startX, y: cardY, w: cardW, h: 0.55,
    fontFace: THEME.headerFont, fontSize: 14, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });
  slide.addText([
    { text: "•  Builds product (calculator, platform, vault)", options: { breakLine: true } },
    { text: "•  Builds 29 country pension engines over 5 years", options: { breakLine: true } },
    { text: "•  LU/FR/CH already prototyped before launch", options: { breakLine: true } },
    { text: "•  €0 salary — equity through Series A", options: { italic: true } },
  ], {
    x: startX + 0.3, y: cardY + 0.7, w: cardW - 0.6, h: cardH - 0.85,
    fontFace: THEME.bodyFont, fontSize: 11, color: THEME.darkGrey,
    valign: "top", paraSpaceAfter: 4,
  });

  // BD
  const rightX = startX + cardW + gap;
  slide.addShape("rect", {
    x: rightX, y: cardY, w: cardW, h: cardH,
    fill: { color: THEME.lightPurple },
    line: { color: THEME.purple, width: 1.5 },
  });
  slide.addShape("rect", {
    x: rightX, y: cardY, w: cardW, h: 0.55,
    fill: { color: THEME.purple },
    line: { color: THEME.purple, width: 0 },
  });
  slide.addText("BD CO-FOUNDER", {
    x: rightX, y: cardY, w: cardW, h: 0.55,
    fontFace: THEME.headerFont, fontSize: 14, bold: true,
    color: THEME.white, align: "center", valign: "middle",
  });
  slide.addText([
    { text: "•  Owns distribution partnerships (3 priority bands)", options: { breakLine: true } },
    { text: "•  Owns lead-gen partner negotiations", options: { breakLine: true } },
    { text: "•  CSSF + ecosystem relationships", options: { breakLine: true } },
    { text: "•  €0 salary — equity through Series A", options: { italic: true } },
  ], {
    x: rightX + 0.3, y: cardY + 0.7, w: cardW - 0.6, h: cardH - 0.85,
    fontFace: THEME.bodyFont, fontSize: 11, color: THEME.darkGrey,
    valign: "top", paraSpaceAfter: 4,
  });

  // Series A trigger metrics
  slide.addText("Series A trigger metrics  ·  by M24 (base scenario)", {
    x: MARGIN, y: 4.15, w: SLIDE_W - 2*MARGIN, h: 0.4,
    fontFace: THEME.headerFont, fontSize: 14, bold: true,
    color: THEME.darkPurple, align: "center", valign: "middle",
  });

  const triggers = [
    { metric: "Paying subscribers",          target: "1,000+",  actual: "~3,800 by M24" },
    { metric: "Country engines live",        target: "13+",     actual: "13 by M24 (DE hub + Benelux + Eastern EU live)" },
    { metric: "ARR",                         target: "€450K+",  actual: "€649K by M24, €1.70M by M36" },
    { metric: "Cumulative break-even",       target: "Yes",     actual: "M20 — 4 months before runway end" },
    { metric: "Lead-gen capital under ref.", target: "€50M+",   actual: "€55M by M24" },
  ];

  const headerStyle = { bold: true, color: THEME.white, fill: { color: THEME.purple }, align: "center", valign: "middle" };
  const tableRows = [
    [
      { text: "Metric", options: headerStyle },
      { text: "Target", options: headerStyle },
      { text: "Model says", options: headerStyle },
    ],
    ...triggers.map(t => [
      { text: t.metric, options: { color: THEME.darkGrey, align: "left", valign: "middle", bold: true } },
      { text: t.target, options: { color: THEME.darkGrey, align: "center", valign: "middle" } },
      { text: t.actual, options: { color: THEME.green, align: "left", valign: "middle", bold: true, fill: { color: THEME.lightGreen } } },
    ]),
  ];

  slide.addTable(tableRows, {
    x: MARGIN, y: 4.6, w: SLIDE_W - 2*MARGIN, h: 1.7,
    colW: [3.5, 2.0, 6.83],
    fontFace: THEME.bodyFont, fontSize: 11,
    border: { type: "solid", color: THEME.lightGrey, pt: 0.5 },
  });

  // Bottom callout
  addCallout(slide,
    "Natural Series A lead: MiddleGame Ventures (LU-based fintech specialist, SNCI-backed). Series A becomes optional, not survival — we raise to accelerate, not to survive.",
    6.55,
    { fill: THEME.darkPurple, color: THEME.white, h: 0.6, fontSize: 11, italic: true }
  );

  slide.addNotes([
    "Two co-founders. Both work on equity through Series A — no salary lines on the cost model.",
    "Technical co-founder: builds the product, all 29 country pension engines, the AI extraction stack. LU/FR/CH already prototyped before launch — that's the M1 trio.",
    "BD co-founder: owns distribution partnerships across the 3 priority bands we covered, owns lead-gen partner negotiations, owns CSSF and ecosystem relationships.",
    "Both on equity until Series A. Eliminates the largest opex line at this stage and is what makes the M16 / M20 break-even profile possible.",
    "Series A trigger metrics by M24, base scenario:",
    "1,000+ paying subscribers — model shows 3,800 by M24.",
    "13+ country engines live — model shows exactly 13 by M24 (German hub + Benelux + Eastern EU all live).",
    "€450K+ ARR — model shows €649K by M24 and €1.70M by M36.",
    "Cumulative break-even achieved — yes, at M20.",
    "Lead-gen capital under referral €50M+ — model shows €55M by M24.",
    "All five trigger metrics hit comfortably by M24 in the base scenario.",
    "Natural Series A lead: MiddleGame Ventures. Luxembourg-based fintech specialist, SNCI-backed, runs the NadiFin accelerator we plan to apply to in Y1.",
    "Critical framing: Series A becomes optional, not survival. Cumulative break-even at M20 means we don't need a Series A to keep the lights on. We raise it because we want to accelerate further into the European corridors, not because we're running out of money."
  ].join("\n\n"));
}

// ════════════════════════════════════════════════════════════════════
// MAIN — generate the deck
// ════════════════════════════════════════════════════════════════════
async function generate() {
  const deck = new pptxgen();
  deck.layout = "LAYOUT_WIDE"; // 13.333 × 7.5
  deck.author = "Prevista";
  deck.title = "Prevista — Investor Deck v2";
  deck.subject = "Seed round — €230K — V6.2";

  const baseData = model.simulate("base");
  const upsideData = model.simulate("upside");

  // Render in canonical deck order. Full 19-slide core deck.
  // NOTE: Function names follow legacy slide numbering. Canonical
  // position is the call order below. After the partnership rework
  // (rings + lead nationalities + timeline = 3 slides instead of 2),
  // function names slideN_X don't always match canonical position N.
  slide1_cover(deck);                                  // pos 1
  slide2_problem(deck);                                // pos 2
  slide3_product(deck);                                // pos 3
  slide4_freeVsPro(deck);                              // pos 4
  slide5_targetMarket(deck);                           // pos 5
  slide6_funnel(deck);                                 // pos 6
  slide7_corridorUnlock(deck);                         // pos 7
  slide8_engineRollout(deck, baseData);                // pos 8
  slide9_threeRings(deck);                             // pos 9  (NEW — replaces priority bands)
  slide10_leadNationalities(deck);                     // pos 10 (NEW — PT/FR/ES priority)
  slide10_partnershipTimeline(deck);                   // pos 11 (legacy fn name; was slide 10)
  slide11_unitEconomics(deck);                         // pos 12 (legacy fn name)
  slide12_revenueProjections(deck, baseData, upsideData); // pos 13
  slide13_breakEven(deck, baseData);                   // pos 14
  slide14_revenueStreams(deck, baseData);              // pos 15
  slide15_baseVsUpside(deck, baseData, upsideData);    // pos 16
  slide16_useOfFunds(deck);                            // pos 17
  slide17_capitalStack(deck);                          // pos 18
  slide18_teamAndSeriesA(deck);                        // pos 19

  const outPath = path.join(__dirname, "Prevista-Investor-Deck-v2.pptx");
  await deck.writeFile({ fileName: outPath });
  console.log("Written to:", outPath);
  console.log("Slides rendered: 19 of 19 core (100%)");
}

generate().catch(e => { console.error(e); process.exit(1); });
