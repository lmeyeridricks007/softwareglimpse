/**
 * DEPRECATED — do not run.
 * Teaching visuals must use GenerateImage per `.cursor/rules/softwareglimpse-teaching-visuals.mdc`
 * (premium SaaS UI / workflow infographics ~1MB+). Sharp SVG circle-cards are rejected.
 */
throw new Error(
  "Deprecated: use GenerateImage + softwareglimpse-teaching-visuals.mdc — not sharp SVG placeholders.",
);

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
    file: "crm-automation-task-spam.png",
    title: "Design against task spam",
    subtitle: "Cap volume → suppress duplicates → update in place → review weekly → retire noise",
    stages: [
      { name: "Cap", detail: "Open-task limit", color: C.blue },
      { name: "Suppress", detail: "If next step exists", color: C.teal },
      { name: "Update", detail: "Reuse activity", color: C.gold },
      { name: "Review", detail: "Weekly volume", color: C.orange },
      { name: "Retire", detail: "Dismissed = fail", color: C.red },
    ],
    footer: "If people dismiss automation tasks unread, the automation already failed — retire it.",
  },
  {
    file: "crm-automation-trigger-owner.png",
    title: "Trigger discipline and ownership",
    subtitle: "Write trigger → scope objects → name R/A → set kill criteria → peer-review changes",
    stages: [
      { name: "Trigger", detail: "One sentence", color: C.blue },
      { name: "Scope", detail: "Objects in play", color: C.teal },
      { name: "Owner", detail: "Named R/A", color: C.gold },
      { name: "Kill", detail: "Spam / error rule", color: C.orange },
      { name: "Govern", detail: "Peer change check", color: C.green },
    ],
    footer: "An automation without an owner is debt — assign R/A before it goes live.",
  },
  {
    file: "crm-automation-monitor-retire.png",
    title: "Monitor, then retire without guilt",
    subtitle: "Ship small → watch two weeks → keep or kill → pause on hygiene intervene",
    stages: [
      { name: "Pilot", detail: "One pod first", color: C.blue },
      { name: "Watch", detail: "False positives", color: C.teal },
      { name: "Decide", detail: "Keep or kill", color: C.gold },
      { name: "Document", detail: "Next review date", color: C.orange },
      { name: "Pause", detail: "Hygiene intervene", color: C.purple },
    ],
    footer: "Retiring a noisy flow is a win — unused flows accumulate risk every quarter.",
  },
  {
    file: "crm-data-cleaning-path.png",
    title: "Cleaning path before migrate",
    subtitle: "Dedupe → owners → next steps → archive inactive → required fields → then map",
    stages: [
      { name: "Dedupe", detail: "One identity", color: C.blue },
      { name: "Owners", detail: "Open work owned", color: C.teal },
      { name: "Next", detail: "Dates on open", color: C.gold },
      { name: "Archive", detail: "Cold out of live", color: C.orange },
      { name: "Required", detail: "Day-one fields", color: C.green },
    ],
    footer: "Do not start a full import until open work has owners and next-step dates.",
  },
  {
    file: "crm-data-cleaning-owners-next.png",
    title: "Fix owner and next-step hygiene",
    subtitle: "Filter blanks → written assign rule → real dates → close fiction → then map",
    stages: [
      { name: "Filter", detail: "Blank owner/next", color: C.blue },
      { name: "Assign", detail: "Territory / book", color: C.teal },
      { name: "Date", detail: "Real next action", color: C.gold },
      { name: "Close", detail: "Fiction deals", color: C.orange },
      { name: "Gate", detail: "Then mapping", color: C.green },
    ],
    footer: "Empty next steps are migration debt — treat them as incidents in cleaning week.",
  },
  {
    file: "crm-data-cleaning-archive.png",
    title: "Archive inactive records",
    subtitle: "Write inactive rule → mark do-not-migrate → export archive → keep open set live",
    stages: [
      { name: "Define", detail: "Inactive rule", color: C.blue },
      { name: "Mark", detail: "Do-not-migrate", color: C.teal },
      { name: "Export", detail: "History file", color: C.gold },
      { name: "Exclude", detail: "From live load", color: C.orange },
      { name: "Keep", detail: "Open pipeline", color: C.green },
    ],
    footer: "Inactive is a written rule — not a freeze-weekend feeling.",
  },
  {
    file: "crm-data-cleaning-required.png",
    title: "Enforce required fields before migrate",
    subtitle: "List day-one fields → fill open set → name updaters → reject vanity requireds",
    stages: [
      { name: "List", detail: "Day-one only", color: C.blue },
      { name: "Fill", detail: "Open migrate set", color: C.teal },
      { name: "Owner", detail: "Updater named", color: C.gold },
      { name: "Reject", detail: "Vanity requireds", color: C.orange },
      { name: "Hold", detail: "Accuracy bar", color: C.green },
    ],
    footer: "Required fields without owners become empty theater in the new system.",
  },
  {
    file: "crm-data-cleaning-hand-off.png",
    title: "Hand a clean open set to mapping",
    subtitle: "Checklist green → freeze messy imports → finalize map → pilot → hygiene through cutover",
    stages: [
      { name: "Pass", detail: "Checklist green", color: C.blue },
      { name: "Freeze", detail: "No new mess", color: C.teal },
      { name: "Map", detail: "Field map final", color: C.gold },
      { name: "Pilot", detail: "Messy sample", color: C.orange },
      { name: "Hygiene", detail: "Through cutover", color: C.green },
    ],
    footer: "If cleaning never finishes, move the migrate date — not the quality bar.",
  },
  {
    file: "improve-crm-adoption-stalled-vs-recovering.png",
    title: "Stalled vs recovering signals",
    subtitle: "Review surface · next steps · coaching channel · freeze complexity · ignore vanity logins",
    stages: [
      { name: "Review", detail: "CRM vs Sheet", color: C.blue },
      { name: "Next", detail: "Filled vs empty", color: C.teal },
      { name: "Coach", detail: "Views vs chat", color: C.gold },
      { name: "Freeze", detail: "No new fields", color: C.orange },
      { name: "Metric", detail: "Trust ≠ logins", color: C.purple },
    ],
    footer: "Recovering teams freeze complexity and coach from CRM — stalled teams add fields and accept Slack updates.",
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
