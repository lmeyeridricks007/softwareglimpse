/**
 * DEPRECATED — do not run.
 * Teaching visuals must use GenerateImage per `.cursor/rules/softwareglimpse-teaching-visuals.mdc`
 * (premium SaaS UI / workflow infographics ~1MB+). Sharp SVG circle-cards are rejected.
 */
throw new Error(
  "Deprecated: use GenerateImage + softwareglimpse-teaching-visuals.mdc — not sharp SVG placeholders.",
);

/**
 * Best-diagram batch 6: Reporting, Selection Mistakes/Process, TCO, Training.
 * Run: node scripts/generate-guide-diagrams-batch6.mjs
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
  red: "#DC2626",
};

/** @typedef {{ name: string, detail: string, color: string }} Stage */
/** @typedef {{ file: string, title: string, subtitle: string, stages: Stage[], footer: string }} Diagram */

/** @type {Diagram[]} */
const DIAGRAMS = [
  {
    file: "crm-reporting-trust-path.png",
    title: "Reporting trust path",
    subtitle: "Define stages → hygiene first → canonical views → Friday CRM-native → forecast hygiene",
    stages: [
      { name: "Stages", detail: "Exit criteria", color: C.blue },
      { name: "Hygiene", detail: "Owner + next", color: C.teal },
      { name: "Views", detail: "Canonical set", color: C.gold },
      { name: "Friday", detail: "CRM-native", color: C.orange },
      { name: "Forecast", detail: "Honest categories", color: C.green },
    ],
    footer: "Forecast trust sits on stage honesty and hygiene — dashboards alone cannot carry Friday.",
  },
  {
    file: "crm-reporting-hygiene-first.png",
    title: "Fix hygiene before expanding reports",
    subtitle: "Owners filled → next steps dated → dupes aged → pause new dashboards → then expand",
    stages: [
      { name: "Owners", detail: "Open work owned", color: C.blue },
      { name: "Next", detail: "Dates filled", color: C.teal },
      { name: "Dupes", detail: "Queue aged", color: C.gold },
      { name: "Pause", detail: "No new charts", color: C.orange },
      { name: "Expand", detail: "After green weeks", color: C.green },
    ],
    footer: "A new chart on dirty data is a second source of arguments, not a decision tool.",
  },
  {
    file: "crm-reporting-canonical-views.png",
    title: "Publish a small set of canonical views",
    subtitle: "Name 3–5 views → assign owners → freeze orphans → same filters weekly",
    stages: [
      { name: "Pick", detail: "3–5 views", color: C.blue },
      { name: "Owner", detail: "Named steward", color: C.teal },
      { name: "Question", detail: "Decision it answers", color: C.gold },
      { name: "Freeze", detail: "Orphan reports", color: C.orange },
      { name: "Reuse", detail: "Same Friday filters", color: C.green },
    ],
    footer: "Every new report needs a decision question and an owner — or it is decoration.",
  },
  {
    file: "crm-reporting-friday-crm.png",
    title: "Run Friday from CRM — no rebuild sheet",
    subtitle: "Open board → same filters → coach live → update in CRM → ban side-sheet SoR",
    stages: [
      { name: "Open", detail: "CRM board", color: C.blue },
      { name: "Filter", detail: "Canonical view", color: C.teal },
      { name: "Coach", detail: "Live on deals", color: C.gold },
      { name: "Update", detail: "Fix in CRM", color: C.orange },
      { name: "Ban", detail: "Sheet rebuild", color: C.red },
    ],
    footer: "If Friday needs a Sheet rebuild, reporting trust already failed — fix hygiene and stages first.",
  },
  {
    file: "crm-reporting-forecast.png",
    title: "Practice forecast hygiene",
    subtitle: "Define categories → evidence rules → sample honesty → no silent commits → coach fiction",
    stages: [
      { name: "Define", detail: "Commit / best / pipe", color: C.blue },
      { name: "Evidence", detail: "What qualifies", color: C.teal },
      { name: "Sample", detail: "Honesty check", color: C.gold },
      { name: "Coach", detail: "Fiction deals", color: C.orange },
      { name: "Lock", detail: "Same defs weekly", color: C.green },
    ],
    footer: "Forecast categories without written meanings become negotiation — not a forecast.",
  },
  {
    file: "crm-selection-mistakes-catch.png",
    title: "Catch mistakes before signature",
    subtitle: "Requirements sheet → fair eval → cost truth → admin owners → export proved",
    stages: [
      { name: "Sheet", detail: "Requirements", color: C.blue },
      { name: "Fair", detail: "Same script", color: C.teal },
      { name: "Cost", detail: "Qualifying plan", color: C.gold },
      { name: "Owners", detail: "Admin named", color: C.orange },
      { name: "Exit", detail: "Export proved", color: C.green },
    ],
    footer: "Each common mistake maps to a concrete artifact — signature is not a substitute.",
  },
  {
    file: "crm-selection-mistakes-commercial.png",
    title: "Commercial and operating mistakes",
    subtitle: "Map must-haves to plan → Calculator band → name admin R/A → prove export in trial",
    stages: [
      { name: "Gates", detail: "Must → plan", color: C.blue },
      { name: "Band", detail: "Calculator", color: C.teal },
      { name: "Admin", detail: "Named R/A", color: C.gold },
      { name: "Export", detail: "Trial sample", color: C.orange },
      { name: "Memo", detail: "Before sign", color: C.green },
    ],
    footer: "A low seat band on the wrong tier is not a savings — it is a deferred upgrade.",
  },
  {
    file: "crm-selection-mistakes-recover.png",
    title: "If you already skipped a gate",
    subtitle: "Hard pause → reopen artifact → compress trial → stabilize core loop → defer nice-to-haves",
    stages: [
      { name: "Pause", detail: "Stop hoping", color: C.red },
      { name: "Artifact", detail: "Write the sheet", color: C.blue },
      { name: "Retest", detail: "Compressed script", color: C.teal },
      { name: "Stabilize", detail: "Core loop", color: C.gold },
      { name: "Defer", detail: "Nice-to-haves", color: C.orange },
    ],
    footer: "Adding marketplace apps rarely cures a missing ownership SLA or empty next-step field.",
  },
  {
    file: "crm-selection-process-timeline.png",
    title: "Set a realistic timeline",
    subtitle: "Week 1 define/sheet → week 2 shortlist/trials → week 3 diligence/decide — score same day",
    stages: [
      { name: "Week 1", detail: "Define + sheet", color: C.blue },
      { name: "Week 2", detail: "Trials + scores", color: C.teal },
      { name: "Week 3", detail: "Diligence + memo", color: C.gold },
      { name: "Same day", detail: "Score each trial", color: C.orange },
      { name: "Lock", detail: "No “one more”", color: C.green },
    ],
    footer: "Schedule scorecard fill-in the same day as each trial — delay is how preference replaces evidence.",
  },
  {
    file: "crm-total-cost-path.png",
    title: "TCO mapping path",
    subtitle: "Subscription band → time → change costs → risk/exit → memo with categories",
    stages: [
      { name: "Sub", detail: "Calculator band", color: C.blue },
      { name: "Time", detail: "Admin & users", color: C.teal },
      { name: "Change", detail: "Migrate & train", color: C.gold },
      { name: "Risk", detail: "Exit & lock-in", color: C.orange },
      { name: "Memo", detail: "Categories listed", color: C.green },
    ],
    footer: "Separate one-time change costs from ongoing operating costs before you compare tools.",
  },
  {
    file: "crm-total-cost-compare.png",
    title: "Compare TCO shapes, not single numbers",
    subtitle: "Side-by-side categories → catch seat-cheap traps → catch time-expensive traps → balanced pick",
    stages: [
      { name: "Table", detail: "Categories side-by-side", color: C.blue },
      { name: "Seats", detail: "Qualifying tier", color: C.teal },
      { name: "Admin", detail: "Runnable load?", color: C.gold },
      { name: "Exit", detail: "Export clear?", color: C.orange },
      { name: "Pick", detail: "Shape fit", color: C.green },
    ],
    footer: "Attach the category table to the business case — challenge assumptions without fake precision.",
  },
  {
    file: "crm-training-path.png",
    title: "Training path",
    subtitle: "Roles → short curricula → sandbox practice → cert-lite → production access → adoption coaching",
    stages: [
      { name: "Roles", detail: "AE / mgr / admin", color: C.blue },
      { name: "Curricula", detail: "Short scripts", color: C.teal },
      { name: "Sandbox", detail: "Practice reps", color: C.gold },
      { name: "Cert-lite", detail: "Checklist pass", color: C.orange },
      { name: "Access", detail: "Then adopt", color: C.green },
    ],
    footer: "Three curricula, one sandbox lane, then certification-lite — before broad production access.",
  },
  {
    file: "crm-training-sandbox.png",
    title: "Practice in sandbox on real-shaped records",
    subtitle: "Seed realistic data → run role scripts → coach mistakes → pass cert-lite → then production",
    stages: [
      { name: "Seed", detail: "Real-shaped data", color: C.blue },
      { name: "Script", detail: "Role checklist", color: C.teal },
      { name: "Coach", detail: "Live corrections", color: C.gold },
      { name: "Pass", detail: "Cert-lite signoff", color: C.orange },
      { name: "Prod", detail: "Grant seats", color: C.green },
    ],
    footer: "Sandbox practice on empty happy-path demos does not transfer — seed messy, real-shaped work.",
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
  const n = d.stages.length;
  const stageW = n >= 6 ? 200 : 240;
  const gap = n >= 6 ? 20 : 28;
  const totalW = n * stageW + (n - 1) * gap;
  const startX = (W - totalW) / 2;
  const cardY = 280;
  const cardH = 420;

  const cards = d.stages
    .map((stage, i) => {
      const x = startX + i * (stageW + gap);
      const num = i + 1;
      const arrow =
        i < n - 1
          ? `<path d="M ${x + stageW + 4} ${cardY + cardH / 2} L ${x + stageW + gap - 4} ${cardY + cardH / 2}" stroke="#94A3B8" stroke-width="3" fill="none" marker-end="url(#arrow)"/>`
          : "";
      const nameSize = stage.name.length > 11 ? 16 : stage.name.length > 9 ? 18 : 22;
      return `
      ${arrow}
      <rect x="${x}" y="${cardY}" width="${stageW}" height="${cardH}" rx="18" fill="#FFFFFF" stroke="${stage.color}" stroke-width="3"/>
      <rect x="${x}" y="${cardY}" width="${stageW}" height="88" fill="${stage.color}"/>
      <text x="${x + stageW / 2}" y="${cardY + 38}" text-anchor="middle" fill="#FFFFFF" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="18" font-weight="700">Step ${num}</text>
      <text x="${x + stageW / 2}" y="${cardY + 68}" text-anchor="middle" fill="#FFFFFF" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="${nameSize}" font-weight="700">${escapeXml(stage.name)}</text>
      <circle cx="${x + stageW / 2}" cy="${cardY + 200}" r="48" fill="${stage.color}" fill-opacity="0.12" stroke="${stage.color}" stroke-width="3"/>
      <text x="${x + stageW / 2}" y="${cardY + 212}" text-anchor="middle" fill="${stage.color}" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="36" font-weight="700">${num}</text>
      <text x="${x + stageW / 2}" y="${cardY + 300}" text-anchor="middle" fill="#0F172A" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="16" font-weight="600">${escapeXml(stage.detail)}</text>
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
  <text x="96" y="88" fill="#0F172A" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="42" font-weight="800">${escapeXml(d.title)}</text>
  <text x="96" y="140" fill="#475569" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="24">${escapeXml(d.subtitle)}</text>
  <text x="96" y="190" fill="#64748B" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="18">SoftwareGlimpse teaching diagram — not a vendor UI screenshot</text>
  ${cards}
  ${footerText}
</svg>`;
}

async function main() {
  const outDir = path.join(ROOT, "public/guides");
  fs.mkdirSync(outDir, { recursive: true });
  for (const d of DIAGRAMS) {
    const svg = buildSvg(d);
    const out = path.join(outDir, d.file);
    await sharp(Buffer.from(svg)).png().toFile(out);
    console.log("wrote", d.file);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
