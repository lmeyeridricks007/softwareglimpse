/**
 * DEPRECATED — do not run.
 * Teaching visuals must use GenerateImage per `.cursor/rules/softwareglimpse-teaching-visuals.mdc`
 * (premium SaaS UI / workflow infographics ~1MB+). Sharp SVG circle-cards are rejected.
 */
throw new Error(
  "Deprecated: use GenerateImage + softwareglimpse-teaching-visuals.mdc — not sharp SVG placeholders.",
);

/**
 * Best-diagram batch 5: Field Mapping, Go-Live, Health Check.
 * Run: node scripts/generate-guide-diagrams-batch5.mjs
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
    file: "crm-field-mapping-path.png",
    title: "Field mapping path",
    subtitle: "Inventory → classify → map source→target → transform rules → sample → freeze",
    stages: [
      { name: "Inventory", detail: "Source fields", color: C.blue },
      { name: "Classify", detail: "Required vs optional", color: C.teal },
      { name: "Map", detail: "Source → target", color: C.gold },
      { name: "Transform", detail: "Rules written", color: C.orange },
      { name: "Sample", detail: "Rows validated", color: C.purple },
      { name: "Freeze", detail: "Owner signs off", color: C.green },
    ],
    footer: "Freeze the dictionary before any pilot import — silent column renames after freeze are drift.",
  },
  {
    file: "crm-field-mapping-classify.png",
    title: "Classify required vs optional",
    subtitle: "List enforced targets → mark go-live required → defer history → drop unfillable customs",
    stages: [
      { name: "List", detail: "Target fields", color: C.blue },
      { name: "Require", detail: "Go-live musts", color: C.teal },
      { name: "Optional", detail: "Wave-two history", color: C.gold },
      { name: "Drop", detail: "Unfillable customs", color: C.orange },
      { name: "Honest", detail: "Short required set", color: C.green },
    ],
    footer: "A short required set with honest data beats a wide schema of empty columns.",
  },
  {
    file: "crm-field-mapping-transforms.png",
    title: "Write transforms as rules",
    subtitle: "Normalize → stage rename table → owner lookup → date format → quarantine fails",
    stages: [
      { name: "Normalize", detail: "Trim / lowercase", color: C.blue },
      { name: "Stages", detail: "Explicit rename", color: C.teal },
      { name: "Owners", detail: "Email → user ID", color: C.gold },
      { name: "Dates", detail: "Format convert", color: C.orange },
      { name: "Quarantine", detail: "Failed requireds", color: C.red },
    ],
    footer: "If you cannot explain the transform in one sentence on the sheet, do not automate it yet.",
  },
  {
    file: "crm-field-mapping-sample.png",
    title: "Validate sample rows, then hand off",
    subtitle: "Seller walks five rows → fix map → clean duplicates → pilot import on frozen version",
    stages: [
      { name: "Sample", detail: "Five real rows", color: C.blue },
      { name: "Review", detail: "Seller trust?", color: C.teal },
      { name: "Fix", detail: "Map before scale", color: C.gold },
      { name: "Clean", detail: "Dedupe / junk", color: C.orange },
      { name: "Pilot", detail: "Frozen sheet only", color: C.green },
    ],
    footer: "Sample-row review is cheaper than a full re-import after go-live storytelling collapses.",
  },
  {
    file: "crm-go-live-path.png",
    title: "Go-live path",
    subtitle: "Ready gate → freeze → cutover → open as SoR → hypercare week",
    stages: [
      { name: "Ready", detail: "UAT exit met", color: C.blue },
      { name: "Freeze", detail: "Legacy edits stop", color: C.teal },
      { name: "Cutover", detail: "Export→import→check", color: C.gold },
      { name: "Open", detail: "CRM is SoR", color: C.orange },
      { name: "Hypercare", detail: "Staffed week", color: C.green },
    ],
    footer: "A calendar date without UAT, frozen map, and rollback criteria is a rumor — not a launch.",
  },
  {
    file: "crm-go-live-freeze.png",
    title: "Freeze window and communication plan",
    subtitle: "Publish freeze → stop legacy edits → urgent path → login after open → ack before start",
    stages: [
      { name: "Publish", detail: "Who / when / where", color: C.blue },
      { name: "Freeze", detail: "Legacy read-only", color: C.teal },
      { name: "Urgent", detail: "Offline notes", color: C.gold },
      { name: "Login", detail: "New URL ready", color: C.orange },
      { name: "Ack", detail: "Every AE confirms", color: C.green },
    ],
    footer: "If people keep editing legacy during freeze, stop cutover — do not race two sources of truth.",
  },
  {
    file: "crm-go-live-validate.png",
    title: "Cutover, validate, rollback criteria",
    subtitle: "Final export → import → reconcile → spot-check → sync proof → open or roll back",
    stages: [
      { name: "Export", detail: "Versioned final", color: C.blue },
      { name: "Import", detail: "Frozen map", color: C.teal },
      { name: "Counts", detail: "Reconcile", color: C.gold },
      { name: "Sample", detail: "Owners / stages", color: C.orange },
      { name: "Decide", detail: "Open or rollback", color: C.red },
    ],
    footer: "Write numeric or binary rollback triggers before cutover day — not mid-incident.",
  },
  {
    file: "crm-go-live-hypercare.png",
    title: "Staff hypercare and protect the core loop",
    subtitle: "Named channel → daily triage → ban new automation → coach from board → exit on clean Friday",
    stages: [
      { name: "Staff", detail: "Named humans", color: C.blue },
      { name: "Triage", detail: "Daily queue", color: C.teal },
      { name: "Freeze", detail: "No new automations", color: C.gold },
      { name: "Coach", detail: "Board-native", color: C.orange },
      { name: "Exit", detail: "Clean Friday", color: C.green },
    ],
    footer: "Hypercare without named humans is just a calendar label.",
  },
  {
    file: "crm-health-check-path.png",
    title: "Health check operating path",
    subtitle: "Score five → apply Watch/Intervene → pick play → freeze expand → re-check cadence",
    stages: [
      { name: "Score", detail: "Five dimensions", color: C.blue },
      { name: "Rules", detail: "Watch / Intervene", color: C.teal },
      { name: "Play", detail: "Linked guide", color: C.gold },
      { name: "Freeze", detail: "If Intervene", color: C.orange },
      { name: "Recheck", detail: "Next cadence", color: C.green },
    ],
    footer: "Scorecard first — intervene rules decide whether you audit, coach, or consider replace.",
  },
  {
    file: "crm-health-check-intervene.png",
    title: "Apply Watch vs Intervene rules",
    subtitle: "Watch intensifies ritual → Intervene freezes config → assign owner → launch play → re-score",
    stages: [
      { name: "Watch", detail: "Coach + recheck", color: C.gold },
      { name: "Intervene", detail: "Two miss / crisis", color: C.orange },
      { name: "Freeze", detail: "No net-new config", color: C.red },
      { name: "Owner", detail: "Named play lead", color: C.teal },
      { name: "Rescore", detail: "Fixed date", color: C.green },
    ],
    footer: "Intervene without a freeze just adds more config noise on top of the failure.",
  },
  {
    file: "crm-health-check-plays.png",
    title: "Link each weak dimension to a play",
    subtitle: "Hygiene → Quality · Adoption → Improve · Reporting → Audit · Noise → Gov · Capacity → Ops",
    stages: [
      { name: "Hygiene", detail: "Quality / hygiene", color: C.blue },
      { name: "Adoption", detail: "Improve Adoption", color: C.teal },
      { name: "Reporting", detail: "Audit + coach", color: C.gold },
      { name: "Automation", detail: "Gov tickets", color: C.orange },
      { name: "Admin", detail: "WIP cadence", color: C.purple },
    ],
    footer: "A scorecard that does not deep-link to a play is a mood board.",
  },
  {
    file: "crm-health-check-cadence.png",
    title: "Run the scorecard on a fixed cadence",
    subtitle: "Same views → same bands → post decisions → tickets on Intervene → version bands deliberately",
    stages: [
      { name: "Cadence", detail: "Monthly / tighter", color: C.blue },
      { name: "Views", detail: "Same evidence", color: C.teal },
      { name: "Bands", detail: "Healthy/Watch/Int.", color: C.gold },
      { name: "Decide", detail: "Posted actions", color: C.orange },
      { name: "Tickets", detail: "Gov standup", color: C.green },
    ],
    footer: "Changing band definitions every cycle resets learning — version the scorecard deliberately.",
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
