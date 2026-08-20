/**
 * DEPRECATED — do not run.
 * Teaching visuals must use GenerateImage per `.cursor/rules/softwareglimpse-teaching-visuals.mdc`
 * (premium SaaS UI / workflow infographics ~1MB+). Sharp SVG circle-cards are rejected.
 */
throw new Error(
  "Deprecated: use GenerateImage + softwareglimpse-teaching-visuals.mdc — not sharp SVG placeholders.",
);

/**
 * Best-diagram batch 7: Training leftovers, Trial, Vendor, vs MA, Adopt/Replace.
 * Run: node scripts/generate-guide-diagrams-batch7.mjs
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
    file: "crm-training-cert-access.png",
    title: "Certification-lite, then production access",
    subtitle: "Run checklist → pass or repractice → signoff → grant seat → no permanent exceptions",
    stages: [
      { name: "Checklist", detail: "Role tasks", color: C.blue },
      { name: "Observe", detail: "No mouse drive", color: C.teal },
      { name: "Pass", detail: "Or repractice", color: C.gold },
      { name: "Sign", detail: "Trainer date", color: C.orange },
      { name: "Seat", detail: "Production role", color: C.green },
    ],
    footer: "Access without practice is how empty next-step fields return on day two.",
  },
  {
    file: "crm-training-bridge-adoption.png",
    title: "Bridge training into adoption and go-live",
    subtitle: "Cert complete → cutover only trained → Friday board coaching → weekly hygiene → scheduled refresh",
    stages: [
      { name: "Ready", detail: "Trained cohort", color: C.blue },
      { name: "Cutover", detail: "No untrained seats", color: C.teal },
      { name: "Friday", detail: "Coach from board", color: C.gold },
      { name: "Hygiene", detail: "Incident empties", color: C.orange },
      { name: "Refresh", detail: "Pre-scheduled", color: C.green },
    ],
    footer: "Schedule the first post-go-live refresh before launch day so it actually happens.",
  },
  {
    file: "crm-trial-path.png",
    title: "Trial evaluation path",
    subtitle: "Freeze script → load sample → non-admin run → score same day → diligence after both tools",
    stages: [
      { name: "Script", detail: "Tasks frozen", color: C.blue },
      { name: "Data", detail: "Sample loaded", color: C.teal },
      { name: "Run", detail: "Non-admin days", color: C.gold },
      { name: "Score", detail: "One card", color: C.orange },
      { name: "Diligence", detail: "Exit & plan", color: C.green },
    ],
    footer: "Repeat the same week shape for each finalist — change the product, not the plan.",
  },
  {
    file: "crm-trial-run-score.png",
    title: "Run, score, then diligence — in that order",
    subtitle: "Finish script A → score same day → finish script B → compare totals → then diligence emails",
    stages: [
      { name: "Run A", detail: "Full script", color: C.blue },
      { name: "Score A", detail: "Same day", color: C.teal },
      { name: "Run B", detail: "Same script", color: C.gold },
      { name: "Compare", detail: "Weights frozen", color: C.orange },
      { name: "Diligence", detail: "Leader only", color: C.green },
    ],
    footer: "If trial length is short, cut nice-to-haves — never cut the non-admin core loop.",
  },
  {
    file: "crm-vendor-diligence-path.png",
    title: "Diligence path",
    subtitle: "Security → pricing truth → support → exit → implement → contract — in parallel with scores",
    stages: [
      { name: "Security", detail: "Baseline fit", color: C.blue },
      { name: "Pricing", detail: "Plan truth", color: C.teal },
      { name: "Support", detail: "Channels", color: C.gold },
      { name: "Exit", detail: "Export path", color: C.orange },
      { name: "Contract", detail: "Terms & refs", color: C.green },
    ],
    footer: "Run diligence in parallel with final scoring — contract review is not a rubber stamp after the demo.",
  },
  {
    file: "crm-vendor-exit-contract.png",
    title: "Prove exit, implementation, and contract fit",
    subtitle: "Export story → implement owner → reference like you → term/renewal → small trial export test",
    stages: [
      { name: "Export", detail: "Objects + formats", color: C.blue },
      { name: "Implement", detail: "Who does work", color: C.teal },
      { name: "Refs", detail: "Similar motion", color: C.gold },
      { name: "Contract", detail: "Term & renewal", color: C.orange },
      { name: "Test", detail: "Trial export", color: C.green },
    ],
    footer: "Do a small export test in trial when allowed — screenshots of UI are not an exit plan.",
  },
  {
    file: "crm-vendor-questions-when.png",
    title: "When to ask what",
    subtitle: "Pre-demo agenda → live plan/edges → trial export → diligence security/exit → memo file",
    stages: [
      { name: "Pre-demo", detail: "Agenda + musts", color: C.blue },
      { name: "Live", detail: "Plan & edge", color: C.teal },
      { name: "Trial", detail: "Export sample", color: C.gold },
      { name: "Diligence", detail: "Security/exit", color: C.orange },
      { name: "Memo", detail: "Written file", color: C.green },
    ],
    footer: "Use one category ring for every finalist — swap products, not the list.",
  },
  {
    file: "crm-vendor-questions-score.png",
    title: "Score answers for clarity, not charm",
    subtitle: "Clear / Partial / Missing → Partial becomes trial task → Missing is blocker → no charm inflation",
    stages: [
      { name: "Clear", detail: "Plan + docs", color: C.green },
      { name: "Partial", detail: "Needs proof", color: C.gold },
      { name: "Missing", detail: "Blocker", color: C.red },
      { name: "Task", detail: "Trial follow-up", color: C.teal },
      { name: "File", detail: "Same memo", color: C.blue },
    ],
    footer: "Do not convert vague enthusiasm into a high diligence score.",
  },
  {
    file: "crm-vs-ma-choose.png",
    title: "How to choose (or combine) CRM and MA",
    subtitle: "Primary job → lead volume → handoff rules → data owners → stack shape → admin capacity",
    stages: [
      { name: "Job", detail: "Nurture vs sell", color: C.blue },
      { name: "Volume", detail: "Programs vs pipe", color: C.teal },
      { name: "Handoff", detail: "MQL definition", color: C.gold },
      { name: "Owners", detail: "Mkt vs sales", color: C.orange },
      { name: "Stack", detail: "Separate vs suite", color: C.purple },
      { name: "Admin", detail: "Who runs it?", color: C.green },
    ],
    footer: "Same buyer journey — different systems by job. Write the handoff before arguing logos.",
  },
  {
    file: "when-to-adopt-path.png",
    title: "Adoption timing path",
    subtitle: "Pain → owners → pilot scope → live deals → review habits → expand",
    stages: [
      { name: "Pain", detail: "Recurring fails", color: C.blue },
      { name: "Owners", detail: "Who updates", color: C.teal },
      { name: "Scope", detail: "Team + deals", color: C.gold },
      { name: "Pilot", detail: "Live only", color: C.orange },
      { name: "Expand", detail: "After trust", color: C.green },
    ],
    footer: "Move when pain and ownership are real — then pilot before scaling configuration.",
  },
  {
    file: "when-to-adopt-pilot.png",
    title: "Pilot real deals, then expand",
    subtitle: "Thin stages → required owners → this month’s deals → Friday from board → then sync/pipelines",
    stages: [
      { name: "Thin", detail: "Few stages", color: C.blue },
      { name: "Own", detail: "Required owners", color: C.teal },
      { name: "Live", detail: "Real deals", color: C.gold },
      { name: "Friday", detail: "No shadow sheet", color: C.orange },
      { name: "Expand", detail: "Sync / pipelines", color: C.green },
    ],
    footer: "Measure pilot success by “did we stop rebuilding the pipeline?” — not by custom field count.",
  },
  {
    file: "when-to-replace-path.png",
    title: "Optimize vs replace path",
    subtitle: "Score four signals → 60–90 day optimize → gate pass/fail → keep or shortlist → migrate if switching",
    stages: [
      { name: "Signals", detail: "Score the four", color: C.blue },
      { name: "Optimize", detail: "60–90 day sprint", color: C.teal },
      { name: "Gate", detail: "Pass or fail", color: C.gold },
      { name: "Decide", detail: "Keep or replace", color: C.orange },
      { name: "Next", detail: "Finder / migrate", color: C.green },
    ],
    footer: "Replacement starts only after an honest optimize gate fails — not after one bad week.",
  },
  {
    file: "when-to-replace-optimize.png",
    title: "Run a 60–90 day optimize-in-place sprint",
    subtitle: "Scope core loop → name owners → hygiene + coaching → freeze expansion → pass/fail evidence",
    stages: [
      { name: "Scope", detail: "Core loop only", color: C.blue },
      { name: "Owners", detail: "Named leads", color: C.teal },
      { name: "Fix", detail: "Hygiene + coach", color: C.gold },
      { name: "Freeze", detail: "No new complexity", color: C.orange },
      { name: "Gate", detail: "Written pass/fail", color: C.green },
    ],
    footer: "Write pass/fail criteria before the sprint — not after you already prefer a new vendor.",
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
