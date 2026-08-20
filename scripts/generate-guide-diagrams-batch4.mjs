/**
 * DEPRECATED — do not run.
 * Teaching visuals must use GenerateImage per `.cursor/rules/softwareglimpse-teaching-visuals.mdc`
 * (premium SaaS UI / workflow infographics ~1MB+). Sharp SVG circle-cards are rejected.
 */
throw new Error(
  "Deprecated: use GenerateImage + softwareglimpse-teaching-visuals.mdc — not sharp SVG placeholders.",
);

/**
 * Best-diagram batch 4: Data Hygiene, Data Quality, CRM Demo.
 * Run: node scripts/generate-guide-diagrams-batch4.mjs
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
    file: "crm-data-hygiene-path.png",
    title: "Hygiene operating path",
    subtitle: "Pick signals → name owners → set SLAs → weekly ritual → prevent decay upstream",
    stages: [
      { name: "Signals", detail: "3–5 metrics", color: C.blue },
      { name: "Owners", detail: "Queue + R/A", color: C.teal },
      { name: "SLAs", detail: "Team targets", color: C.gold },
      { name: "Weekly", detail: "Decide + coach", color: C.orange },
      { name: "Prevent", detail: "Rules upstream", color: C.green },
    ],
    footer: "Hygiene is a calendar with owners — not a one-off data day on the backlog.",
  },
  {
    file: "crm-data-hygiene-owners-slas.png",
    title: "Assign owners and write hygiene SLAs",
    subtitle: "Signal → responsible human → clear queue → coaching response → intervene on misses",
    stages: [
      { name: "Signal", detail: "Owner / next / dupe", color: C.blue },
      { name: "R/A", detail: "Named human", color: C.teal },
      { name: "Queue", detail: "Saved view", color: C.gold },
      { name: "Coach", detail: "On SLA miss", color: C.orange },
      { name: "Intervene", detail: "Two miss weeks", color: C.red },
    ],
    footer: "An SLA without a named human is decoration — write R/A next to each signal.",
  },
  {
    file: "crm-data-hygiene-ritual.png",
    title: "Run the weekly hygiene ritual",
    subtitle: "Open views → clear queue → coach next steps → note decisions → flag intervene",
    stages: [
      { name: "Open", detail: "Saved views", color: C.blue },
      { name: "Clear", detail: "Assign items", color: C.teal },
      { name: "Coach", detail: "Empty next steps", color: C.gold },
      { name: "Decide", detail: "Merge / archive", color: C.orange },
      { name: "Flag", detail: "Intervene?", color: C.purple },
    ],
    footer: "If the huddle exceeds thirty minutes, cut signals to the three that block Friday trust.",
  },
  {
    file: "crm-data-hygiene-prevent.png",
    title: "Prevent decay upstream",
    subtitle: "Required owner+next → match keys → merge authority → archive rules → governance",
    stages: [
      { name: "Require", detail: "Owner + next", color: C.blue },
      { name: "Match", detail: "Dupe keys", color: C.teal },
      { name: "Merge", detail: "Who may merge", color: C.gold },
      { name: "Archive", detail: "Idle rules", color: C.orange },
      { name: "Govern", detail: "Field changes", color: C.green },
    ],
    footer: "If the queue always grows, fix creation paths — do not hire more merge time forever.",
  },
  {
    file: "crm-data-hygiene-cleanup.png",
    title: "Know when to run a cleanup project",
    subtitle: "Backlog blocks Fridays → bound the cleanse → end criteria → return to weekly rhythm",
    stages: [
      { name: "Detect", detail: "2 intervene wks", color: C.blue },
      { name: "Scope", detail: "Start count", color: C.teal },
      { name: "Clean", detail: "Bounded sprint", color: C.gold },
      { name: "End", detail: "Exit criteria", color: C.orange },
      { name: "Resume", detail: "Weekly SLAs", color: C.green },
    ],
    footer: "Cleanup without a return-to-rhythm plan is how decay repeats every quarter.",
  },
  {
    file: "crm-data-quality-path.png",
    title: "Ongoing quality path",
    subtitle: "Hygiene SLAs → duplicate rules → required fields → weekly review → intervene",
    stages: [
      { name: "SLAs", detail: "Team targets", color: C.blue },
      { name: "Dupes", detail: "Match + merge", color: C.teal },
      { name: "Required", detail: "Owner + next", color: C.gold },
      { name: "Weekly", detail: "Queue → decide", color: C.orange },
      { name: "Intervene", detail: "Two-week miss", color: C.red },
    ],
    footer: "Quality is recurring ops with decision rules — not a percentage from an industry blog.",
  },
  {
    file: "crm-data-quality-slas.png",
    title: "Define hygiene SLAs with team targets",
    subtitle: "Short signal set → explainable targets → act in weekly review → no invented benchmarks",
    stages: [
      { name: "Pick", detail: "3–5 signals", color: C.blue },
      { name: "Target", detail: "Team-defined", color: C.teal },
      { name: "Owner", detail: "Who clears", color: C.gold },
      { name: "Act", detail: "In the ritual", color: C.orange },
      { name: "Skip", detail: "Fake % facts", color: C.purple },
    ],
    footer: "A target nobody can act on in the weekly review is decoration.",
  },
  {
    file: "crm-data-quality-dupes.png",
    title: "Write duplicate rules and merge authority",
    subtitle: "Match keys → survivor rules → who may merge → queue with owner → no Slack votes",
    stages: [
      { name: "Keys", detail: "Email / domain", color: C.blue },
      { name: "Survive", detail: "Richer history", color: C.teal },
      { name: "Authority", detail: "Trained merger", color: C.gold },
      { name: "Queue", detail: "Aged items", color: C.orange },
      { name: "Ban", detail: "Silent deletes", color: C.red },
    ],
    footer: "Merge authority without training creates silent data loss — practice on low-risk records first.",
  },
  {
    file: "crm-data-quality-required.png",
    title: "Enforce required fields with coaching",
    subtitle: "Small required set → named stewards → reject junk → coach ritual → not more checkboxes",
    stages: [
      { name: "Minimal", detail: "Owner/stage/next", color: C.blue },
      { name: "Steward", detail: "Named owner", color: C.teal },
      { name: "Reject", detail: "Junk values", color: C.gold },
      { name: "Coach", detail: "On empties", color: C.orange },
      { name: "Hold", detail: "No checkbox pile", color: C.green },
    ],
    footer: "Junk required values are worse than honest empties — they hide the problem.",
  },
  {
    file: "crm-data-quality-weekly.png",
    title: "Run a weekly quality review",
    subtitle: "Scan signals → work dupe queue → sample honesty → assign actions → intervene/hold/expand",
    stages: [
      { name: "Scan", detail: "Hygiene signals", color: C.blue },
      { name: "Queue", detail: "Duplicates", color: C.teal },
      { name: "Sample", detail: "Stage honesty", color: C.gold },
      { name: "Assign", detail: "Named actions", color: C.orange },
      { name: "Decide", detail: "Intervene rule", color: C.purple },
    ],
    footer: "End every review with named actions and due dates — notes without owners are not quality ops.",
  },
  {
    file: "crm-demo-path.png",
    title: "Buyer-led demo path",
    subtitle: "Prep agenda → open outcomes → run must tasks → probe plan/edges → score and next",
    stages: [
      { name: "Prep", detail: "Agenda + sheet", color: C.blue },
      { name: "Open", detail: "Outcomes stated", color: C.teal },
      { name: "Script", detail: "Must tasks live", color: C.gold },
      { name: "Probe", detail: "Plan & edges", color: C.orange },
      { name: "Close", detail: "Score + next", color: C.green },
    ],
    footer: "Protect the middle block for your script — that is where fit is proven.",
  },
  {
    file: "crm-demo-run-score.png",
    title: "Run the script and score live",
    subtitle: "State outcomes → buyer clicks → score fit/coverage/usability → park hedges → score before next call",
    stages: [
      { name: "Outcomes", detail: "Three goals", color: C.blue },
      { name: "Click", detail: "Buyer drives", color: C.teal },
      { name: "Score", detail: "Fit live", color: C.gold },
      { name: "Hedge", detail: "Park later", color: C.orange },
      { name: "Lock", detail: "Before next AE", color: C.green },
    ],
    footer: "Anything deferred becomes a trial task or diligence email — never an assumption.",
  },
  {
    file: "crm-demo-close.png",
    title: "Close with written follow-ups",
    subtitle: "Open questions → plan shown → recording note → trial decision → attach scores same day",
    stages: [
      { name: "Questions", detail: "Shared list", color: C.blue },
      { name: "Plan", detail: "Tier shown", color: C.teal },
      { name: "Record", detail: "Permission", color: C.gold },
      { name: "Trial?", detail: "Yes / drop", color: C.orange },
      { name: "Card", detail: "Scores same day", color: C.green },
    ],
    footer: "Do not negotiate price mid-demo — lock fit evidence first, then cost clarity.",
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
