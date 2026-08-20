/**
 * DEPRECATED — do not run.
 * Teaching visuals must use GenerateImage per `.cursor/rules/softwareglimpse-teaching-visuals.mdc`
 * (premium SaaS UI / workflow infographics ~1MB+). Sharp SVG circle-cards are rejected.
 */
throw new Error(
  "Deprecated: use GenerateImage + softwareglimpse-teaching-visuals.mdc — not sharp SVG placeholders.",
);

/**
 * Guide Original visual queue — teaching diagrams for selection/adoption guides.
 * Run: node scripts/generate-guide-original-visuals.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const W = 1536;
const H = 1024;

const C = {
  blue: "#2563EB",
  teal: "#0D9488",
  gold: "#CA8A04",
  orange: "#EA580C",
  purple: "#7C3AED",
  green: "#059669",
};

/** @typedef {{ name: string, detail: string, color: string }} Stage */
/** @typedef {{ file: string, title: string, subtitle: string, stages: Stage[], footer: string }} Diagram */

/** @type {Diagram[]} */
const DIAGRAMS = [
  {
    file: "crm-adoption-path.png",
    title: "CRM adoption path",
    subtitle: "Define the loop → train → coach from CRM → gate → expand on evidence",
    stages: [
      { name: "Define", detail: "Core loop + owners", color: C.blue },
      { name: "Train", detail: "Role-based practice", color: C.teal },
      { name: "Coach", detail: "Managers use CRM", color: C.gold },
      { name: "Gate", detail: "30 / 60 / 90", color: C.purple },
      { name: "Expand", detail: "Only on evidence", color: C.green },
    ],
    footer: "Adoption is a gated operating change — login counts alone never prove the loop is trusted.",
  },
  {
    file: "crm-adoption-core-loop.png",
    title: "Instrument the CRM core loop",
    subtitle: "Minimum loop every role completes for open work",
    stages: [
      { name: "Own", detail: "Named owner", color: C.blue },
      { name: "Stage", detail: "Honest status", color: C.teal },
      { name: "Log", detail: "Last real touch", color: C.gold },
      { name: "Next", detail: "Dated next step", color: C.orange },
      { name: "Review", detail: "Weekly from CRM", color: C.green },
    ],
    footer: "Defer custom fields and automation until this loop holds for two consecutive Friday reviews.",
  },
  {
    file: "crm-adoption-manager-coach.png",
    title: "Managers coach from the CRM",
    subtitle: "Make the board the only accepted weekly review surface",
    stages: [
      { name: "Open", detail: "CRM board view", color: C.blue },
      { name: "Ask", detail: "Owner & next step", color: C.teal },
      { name: "Coach", detail: "Deal quality talk", color: C.gold },
      { name: "Update", detail: "Fix in CRM live", color: C.orange },
      { name: "Close", detail: "No side sheet", color: C.green },
    ],
    footer: "If managers accept verbal updates, the CRM will never become the system of record.",
  },
  {
    file: "crm-adoption-gates-30-60-90.png",
    title: "30 / 60 / 90 adoption gates",
    subtitle: "Each gate is pass, coach, or simplify — not a calendar decoration",
    stages: [
      { name: "Day 30", detail: "Loop exists", color: C.blue },
      { name: "Check", detail: "Pass or coach", color: C.teal },
      { name: "Day 60", detail: "Managers coach", color: C.gold },
      { name: "Day 90", detail: "Trusted Fridays", color: C.purple },
      { name: "Decide", detail: "Expand or cut", color: C.green },
    ],
    footer: "Name gate owners. Expansion without a pass decision trains shadow work.",
  },
  {
    file: "crm-adoption-training.png",
    title: "Link training to failure modes",
    subtitle: "Practice the exact mistakes that create shadow systems",
    stages: [
      { name: "Spot", detail: "Failure pattern", color: C.blue },
      { name: "Lab", detail: "Role-based drill", color: C.teal },
      { name: "Live", detail: "Real deal practice", color: C.gold },
      { name: "Refresh", detail: "After drift", color: C.orange },
      { name: "Champion", detail: "Peer assist", color: C.green },
    ],
    footer: "One webinar is not training — labs tied to missed next-steps and stage lies change behavior.",
  },
  {
    file: "crm-evaluation-path.png",
    title: "Fair CRM evaluation path",
    subtitle: "Criteria → script → same scorers → written scores same day",
    stages: [
      { name: "Criteria", detail: "Weighted must-haves", color: C.blue },
      { name: "Script", detail: "Identical tasks", color: C.teal },
      { name: "Trial", detail: "Each shortlist tool", color: C.gold },
      { name: "Score", detail: "Same day write-up", color: C.orange },
      { name: "Decide", detail: "Compare totals", color: C.green },
    ],
    footer: "Freeze weights before demos. Changing criteria after a favorite appears rewrites the winner.",
  },
  {
    file: "crm-evaluation-trial-script.png",
    title: "Same trial script on every tool",
    subtitle: "Your tasks first — vendor theater second",
    stages: [
      { name: "Sample", detail: "Contacts & deals", color: C.blue },
      { name: "Own", detail: "Owner + next step", color: C.teal },
      { name: "Activity", detail: "Log / sync touch", color: C.gold },
      { name: "Board", detail: "Weekly view", color: C.orange },
      { name: "Integr.", detail: "One critical check", color: C.green },
    ],
    footer: "Every shortlisted product gets the same script and the same scorers — ban “show the coolest feature” first.",
  },
  {
    file: "crm-pricing-literacy-path.png",
    title: "CRM pricing literacy path",
    subtitle: "Model → gates → seats → add-ons → estimate in bands",
    stages: [
      { name: "Model", detail: "How billed", color: C.blue },
      { name: "Gates", detail: "Must → tier", color: C.teal },
      { name: "Seats", detail: "Who pays", color: C.gold },
      { name: "Add-ons", detail: "Extras listed", color: C.orange },
      { name: "Estimate", detail: "Band, not fantasy", color: C.green },
    ],
    footer: "Read pricing bottom-up from must-have gates — the cheapest tile rarely matches your sheet.",
  },
  {
    file: "crm-pricing-must-haves-bands.png",
    title: "Map must-haves, then estimate in bands",
    subtitle: "Qualify plans that unlock day-one needs before comparing totals",
    stages: [
      { name: "Musts", detail: "Day-one needs", color: C.blue },
      { name: "Qualify", detail: "Plans that unlock", color: C.teal },
      { name: "Seats", detail: "Real headcount", color: C.gold },
      { name: "Add-ons", detail: "Known extras", color: C.orange },
      { name: "Band", detail: "Low / mid / high", color: C.green },
    ],
    footer: "Discard “from” tiers that cannot show must-haves — then compare only qualifying plans.",
  },
  {
    file: "crm-requirements-path.png",
    title: "CRM requirements path",
    subtitle: "Outcomes → stakeholders → must vs nice → tests → freeze",
    stages: [
      { name: "Outcomes", detail: "90-day results", color: C.blue },
      { name: "People", detail: "Stakeholders", color: C.teal },
      { name: "Must", detail: "Go-live blockers", color: C.gold },
      { name: "Test", detail: "How you’ll prove", color: C.orange },
      { name: "Freeze", detail: "Demo sheet ready", color: C.green },
    ],
    footer: "Start from outcomes and constraints — not from vendor feature grids.",
  },
  {
    file: "crm-requirements-stakeholders.png",
    title: "Map stakeholders and hard constraints",
    subtitle: "Buyer, daily user, admin capacity, and integration truth",
    stages: [
      { name: "Buyer", detail: "Signs & sponsors", color: C.blue },
      { name: "Users", detail: "Daily owners", color: C.teal },
      { name: "Admin", detail: "Who maintains", color: C.gold },
      { name: "Integr.", detail: "Must connect", color: C.orange },
      { name: "Freeze", detail: "Hard constraints", color: C.green },
    ],
    footer: "A must-have without an admin who will keep it accurate is adoption debt.",
  },
  {
    file: "do-i-need-a-crm-path.png",
    title: "Do you need a CRM? A simple path",
    subtitle: "Volume → people → failures → system of record → decide",
    stages: [
      { name: "Volume", detail: "Deals & contacts", color: C.blue },
      { name: "People", detail: "Shared owners?", color: C.teal },
      { name: "Failures", detail: "Misses & rebuilds", color: C.gold },
      { name: "SoR", detail: "Inbox / sheet?", color: C.orange },
      { name: "Decide", detail: "Sheet, CRM, wait", color: C.green },
    ],
    footer: "Need is driven by shared ownership and failure patterns — not by logo shopping.",
  },
  {
    file: "do-i-need-a-crm-spreadsheet-ok.png",
    title: "When a spreadsheet is still OK",
    subtitle: "Solo, low concurrency, and short cycles can wait on CRM",
    stages: [
      { name: "Solo", detail: "One owner", color: C.blue },
      { name: "Simple", detail: "Few open deals", color: C.teal },
      { name: "Short", detail: "Fast cycles", color: C.gold },
      { name: "Honest", detail: "Sheet stays true", color: C.orange },
      { name: "Watch", detail: "Revisit signals", color: C.green },
    ],
    footer: "A clean solo sheet beats a CRM nobody updates — revisit when dual ownership or rebuilds appear.",
  },
  {
    file: "how-to-choose-crm-define-needs.png",
    title: "Define what you need a CRM to solve",
    subtitle: "Three measurable 90-day outcomes before demos",
    stages: [
      { name: "Jobs", detail: "What must improve", color: C.blue },
      { name: "Observe", detail: "Weekly evidence", color: C.teal },
      { name: "Limit", detail: "Top 3 outcomes", color: C.gold },
      { name: "Cut", detail: "Deprioritize extras", color: C.orange },
      { name: "Align", detail: "Team agreement", color: C.green },
    ],
    footer: "Vague goals make every product look good enough — anchor on outcomes you can observe weekly.",
  },
];

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapFooter(text, maxChars = 100) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

/** @param {Diagram} d */
function buildSvg(d) {
  const stageW = 240;
  const gap = 28;
  const totalW = d.stages.length * stageW + (d.stages.length - 1) * gap;
  const startX = (W - totalW) / 2;
  const cardY = 280;
  const cardH = 420;

  const cards = d.stages
    .map((stage, i) => {
      const x = startX + i * (stageW + gap);
      const num = i + 1;
      const arrow =
        i < d.stages.length - 1
          ? `<path d="M ${x + stageW + 4} ${cardY + cardH / 2} L ${x + stageW + gap - 4} ${cardY + cardH / 2}" stroke="#94A3B8" stroke-width="3" fill="none" marker-end="url(#arrow)"/>`
          : "";
      return `
      ${arrow}
      <rect x="${x}" y="${cardY}" width="${stageW}" height="${cardH}" rx="18" fill="#FFFFFF" stroke="${stage.color}" stroke-width="3"/>
      <rect x="${x}" y="${cardY}" width="${stageW}" height="88" fill="${stage.color}"/>
      <text x="${x + stageW / 2}" y="${cardY + 38}" text-anchor="middle" fill="#FFFFFF" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="18" font-weight="700">Step ${num}</text>
      <text x="${x + stageW / 2}" y="${cardY + 68}" text-anchor="middle" fill="#FFFFFF" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="${stage.name.length > 12 ? 18 : 22}" font-weight="700">${escapeXml(stage.name)}</text>
      <circle cx="${x + stageW / 2}" cy="${cardY + 200}" r="48" fill="${stage.color}" fill-opacity="0.12" stroke="${stage.color}" stroke-width="3"/>
      <text x="${x + stageW / 2}" y="${cardY + 212}" text-anchor="middle" fill="${stage.color}" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="36" font-weight="700">${num}</text>
      <text x="${x + stageW / 2}" y="${cardY + 300}" text-anchor="middle" fill="#0F172A" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="18" font-weight="600">${escapeXml(stage.detail)}</text>
    `;
    })
    .join("\n");

  const footerText = wrapFooter(d.footer)
    .map(
      (line, i) =>
        `<text x="96" y="${900 + i * 28}" fill="#334155" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="20">${escapeXml(line)}</text>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#94A3B8"/>
    </marker>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="48" y="40" width="${W - 96}" height="180" rx="20" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
  <text x="${W / 2}" y="100" text-anchor="middle" fill="#0F172A" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="34" font-weight="700">${escapeXml(d.title)}</text>
  <text x="${W / 2}" y="148" text-anchor="middle" fill="#475569" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="20">${escapeXml(d.subtitle)}</text>
  <text x="${W / 2}" y="186" text-anchor="middle" fill="#64748B" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="16">SoftwareGlimpse original teaching diagram · not a vendor UI capture</text>
  ${cards}
  <rect x="64" y="820" width="${W - 128}" height="160" rx="16" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
  <text x="96" y="862" fill="#0F172A" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="18" font-weight="700">How it works</text>
  ${footerText}
</svg>`;
}

async function main() {
  const dir = path.join(ROOT, "public", "guides");
  fs.mkdirSync(dir, { recursive: true });
  for (const d of DIAGRAMS) {
    const out = path.join(dir, d.file);
    await sharp(Buffer.from(buildSvg(d))).png().toFile(out);
    console.log("wrote", path.relative(ROOT, out));
  }
  console.log(`Done: ${DIAGRAMS.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
