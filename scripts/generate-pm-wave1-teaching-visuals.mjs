#!/usr/bin/env node
/**
 * Generate teaching overview + workflow PNGs for PM Wave-1 products.
 * SVG → sharp PNG (16:9 educational diagrams). Prefer GenerateImage refresh later.
 *
 * Usage: node scripts/generate-pm-wave1-teaching-visuals.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const PRODUCTS = [
  {
    slug: "monday",
    name: "monday.com",
    overviewTitle: "Work OS for teams",
    overviewSteps: [
      "Boards & multi-view work tracking",
      "Timeline / Gantt & workload views",
      "Automations & integrations",
      "Dashboards + AI credit assists",
    ],
    workflow: [
      { n: "1", t: "Create board", d: "Template or blank workspace" },
      { n: "2", t: "Plan timeline", d: "Dependencies & owners" },
      { n: "3", t: "Automate updates", d: "Status recipes & apps" },
      { n: "4", t: "Report & AI", d: "Dashboards + credits" },
    ],
  },
  {
    slug: "hive",
    name: "Hive",
    overviewTitle: "Projects + chat + proofs",
    overviewSteps: [
      "Project boards and Gantt views",
      "Team messaging & proofing",
      "Automations and time tracking",
      "AI credits on Free and paid",
    ],
    workflow: [
      { n: "1", t: "Start Free", d: "Up to 10 members" },
      { n: "2", t: "Build projects", d: "Actions, Gantt, owners" },
      { n: "3", t: "Collaborate", d: "Chat, proofs, files" },
      { n: "4", t: "Upgrade Teams", d: "Unlimited + add-ons" },
    ],
  },
  {
    slug: "office-timeline",
    name: "Office Timeline",
    overviewTitle: "PowerPoint Gantt specialist",
    overviewSteps: [
      "Native PowerPoint timeline authoring",
      "Executive-ready Gantt visuals",
      "Import from Project / Excel",
      "Lite / Plus / Expert paid ladder",
    ],
    workflow: [
      { n: "1", t: "Install add-in", d: "Free or paid Lucen seat" },
      { n: "2", t: "Import data", d: "Project / Excel sources" },
      { n: "3", t: "Style timeline", d: "Templates & branding" },
      { n: "4", t: "Present", d: "Stakeholder PowerPoint" },
    ],
  },
  {
    slug: "foxit",
    name: "Foxit",
    overviewTitle: "PDF document productivity",
    overviewSteps: [
      "Create, edit and convert PDFs",
      "eSign and protect documents",
      "Free Reader for viewing",
      "Annual Editor / Editor+ licences",
    ],
    workflow: [
      { n: "1", t: "Pick licence", d: "Reader or PDF Editor" },
      { n: "2", t: "Edit docs", d: "Convert, annotate, redact" },
      { n: "3", t: "Sign & share", d: "eSign workflows" },
      { n: "4", t: "Store in M365", d: "Drive / SharePoint sync" },
    ],
  },
  {
    slug: "getscreen-me",
    name: "Getscreen.me",
    overviewTitle: "Remote access & screen share",
    overviewSteps: [
      "Attended and unattended remote desktop",
      "Cross-platform device clients",
      "User + device hybrid pricing",
      "Free light tier + business plans",
    ],
    workflow: [
      { n: "1", t: "Create account", d: "Free or business trial" },
      { n: "2", t: "Install agents", d: "Target devices" },
      { n: "3", t: "Connect", d: "Support or remote work" },
      { n: "4", t: "Scale seats", d: "Users + device fees" },
    ],
  },
  {
    slug: "webcatalog",
    name: "WebCatalog",
    overviewTitle: "Desktop web-app workspaces",
    overviewSteps: [
      "Turn websites into desktop apps",
      "Multi-app focus workspaces",
      "Basic Free (2 apps) entry",
      "Pro / Business per-user seats",
    ],
    workflow: [
      { n: "1", t: "Install client", d: "macOS / Windows / Linux" },
      { n: "2", t: "Add apps", d: "Wrap key web tools" },
      { n: "3", t: "Build spaces", d: "Work vs personal shells" },
      { n: "4", t: "Upgrade Pro", d: "More apps & team seats" },
    ],
  },
];

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function overviewSvg(p) {
  const cards = p.overviewSteps
    .map((label, i) => {
      const x = 48 + (i % 2) * 720;
      const y = 160 + Math.floor(i / 2) * 200;
      return `
      <rect x="${x}" y="${y}" width="680" height="160" rx="16" fill="#FFFFFF" stroke="#D7E3F4"/>
      <circle cx="${x + 48}" cy="${y + 80}" r="28" fill="#1B3A5C"/>
      <text x="${x + 48}" y="${y + 88}" text-anchor="middle" fill="#FFFFFF"
        font-family="Helvetica,Arial,sans-serif" font-size="22" font-weight="700">${i + 1}</text>
      <text x="${x + 100}" y="${y + 90}" fill="#0F2744"
        font-family="Helvetica,Arial,sans-serif" font-size="26" font-weight="600">${escapeXml(label)}</text>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="864" viewBox="0 0 1536 864">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F4F8FC"/>
      <stop offset="100%" stop-color="#E8F0F8"/>
    </linearGradient>
  </defs>
  <rect width="1536" height="864" fill="url(#bg)"/>
  <text x="48" y="64" fill="#1B3A5C" font-family="Helvetica,Arial,sans-serif"
    font-size="20" font-weight="700" letter-spacing="2">SOFTWAREGLIMPSE</text>
  <text x="48" y="118" fill="#0F2744" font-family="Helvetica,Arial,sans-serif"
    font-size="42" font-weight="700">${escapeXml(p.name)} — ${escapeXml(p.overviewTitle)}</text>
  ${cards}
  <text x="48" y="830" fill="#5A6B7D" font-family="Helvetica,Arial,sans-serif" font-size="18">
    Educational overview — not a vendor screenshot. No trademark logos.
  </text>
</svg>`;
}

function workflowSvg(p) {
  const steps = p.workflow
    .map((s, i) => {
      const x = 56 + i * 370;
      return `
      <rect x="${x}" y="280" width="330" height="280" rx="18" fill="#FFFFFF" stroke="#D7E3F4"/>
      <circle cx="${x + 48}" cy="${320}" r="32" fill="#1B3A5C"/>
      <text x="${x + 48}" y="328" text-anchor="middle" fill="#FFFFFF"
        font-family="Helvetica,Arial,sans-serif" font-size="24" font-weight="700">${s.n}</text>
      <text x="${x + 24}" y="400" fill="#0F2744" font-family="Helvetica,Arial,sans-serif"
        font-size="28" font-weight="700">${escapeXml(s.t)}</text>
      <text x="${x + 24}" y="450" fill="#4A5D73" font-family="Helvetica,Arial,sans-serif"
        font-size="22">${escapeXml(s.d)}</text>
      ${
        i < p.workflow.length - 1
          ? `<path d="M${x + 330} 420 L${x + 360} 420" stroke="#1B3A5C" stroke-width="3" marker-end="url(#arrow)"/>`
          : ""
      }`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="864" viewBox="0 0 1536 864">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F4F8FC"/>
      <stop offset="100%" stop-color="#E8F0F8"/>
    </linearGradient>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#1B3A5C"/>
    </marker>
  </defs>
  <rect width="1536" height="864" fill="url(#bg)"/>
  <text x="48" y="64" fill="#1B3A5C" font-family="Helvetica,Arial,sans-serif"
    font-size="20" font-weight="700" letter-spacing="2">SOFTWAREGLIMPSE</text>
  <text x="48" y="118" fill="#0F2744" font-family="Helvetica,Arial,sans-serif"
    font-size="42" font-weight="700">${escapeXml(p.name)} — adoption workflow</text>
  <text x="48" y="168" fill="#4A5D73" font-family="Helvetica,Arial,sans-serif" font-size="24">
    Practical steps a buyer can run after shortlisting ${escapeXml(p.name)}.
  </text>
  ${steps}
  <text x="48" y="830" fill="#5A6B7D" font-family="Helvetica,Arial,sans-serif" font-size="18">
    Educational workflow — research-grounded teaching visual, not hands-on lab evidence.
  </text>
</svg>`;
}

async function main() {
  for (const p of PRODUCTS) {
    const dir = path.join(ROOT, "public/software", p.slug);
    fs.mkdirSync(dir, { recursive: true });
    const overview = path.join(dir, "overview.png");
    const workflow = path.join(dir, "workflow.png");
    await sharp(Buffer.from(overviewSvg(p)))
      .png({ compressionLevel: 8 })
      .toFile(overview);
    await sharp(Buffer.from(workflowSvg(p)))
      .png({ compressionLevel: 8 })
      .toFile(workflow);
    console.log(`✓ ${p.slug}/overview.png + workflow.png`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
