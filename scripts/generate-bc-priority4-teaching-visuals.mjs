#!/usr/bin/env node
/**
 * Generate teaching overview + workflow PNGs for BC Priority-4 products.
 * SVG → sharp PNG (16:9 educational diagrams). Prefer GenerateImage refresh later.
 *
 * Usage: node scripts/generate-bc-priority4-teaching-visuals.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const PRODUCTS = [
  {
    slug: "twilio",
    name: "Twilio",
    overviewTitle: "Programmable CPaaS platform",
    overviewSteps: [
      "SMS, Voice & WhatsApp APIs",
      "Studio + TaskRouter builders",
      "Pay-as-you-go usage meters",
      "Optional Flex contact center",
    ],
    workflow: [
      { n: "1", t: "Start free", d: "Trial / signup path" },
      { n: "2", t: "Pick channel", d: "SMS, Voice or WhatsApp" },
      { n: "3", t: "Build flows", d: "Studio / Functions" },
      { n: "4", t: "Flex later?", d: "Named or hourly seats" },
    ],
  },
  {
    slug: "manychat",
    name: "ManyChat",
    overviewTitle: "Marketing messaging chatbot",
    overviewSteps: [
      "Instagram, Messenger & WhatsApp",
      "Free → Essential → Pro ladder",
      "Active Contacts packaging",
      "Broadcasts & AI on Pro+",
    ],
    workflow: [
      { n: "1", t: "Start Free", d: "25 Active Contacts" },
      { n: "2", t: "Build flows", d: "IG / Messenger DMs" },
      { n: "3", t: "Add Pro", d: "WhatsApp + AI" },
      { n: "4", t: "Scale tiers", d: "Business / Advanced" },
    ],
  },
  {
    slug: "intercom",
    name: "Intercom",
    overviewTitle: "AI customer messaging inbox",
    overviewSteps: [
      "Messenger + shared inbox",
      "Essential / Advanced / Expert",
      "Fin AI from $0.99/outcome",
      "Help center & workflows",
    ],
    workflow: [
      { n: "1", t: "Pick Essential", d: "$29 seat + Fin" },
      { n: "2", t: "Enable Fin", d: "Outcome-priced AI" },
      { n: "3", t: "Route inbox", d: "Teams & workflows" },
      { n: "4", t: "Add channels", d: "WhatsApp / SMS paygo" },
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
    .map((step, i) => {
      const x = 48 + (i % 2) * 720;
      const y = 180 + Math.floor(i / 2) * 260;
      return `
      <rect x="${x}" y="${y}" width="680" height="220" rx="20" fill="#FFFFFF" stroke="#D7E3F4"/>
      <circle cx="${x + 48}" cy="${y + 48}" r="28" fill="#1B3A5C"/>
      <text x="${x + 48}" y="${y + 56}" text-anchor="middle" fill="#FFFFFF"
        font-family="Helvetica,Arial,sans-serif" font-size="22" font-weight="700">${i + 1}</text>
      <text x="${x + 96}" y="${y + 58}" fill="#0F2744" font-family="Helvetica,Arial,sans-serif"
        font-size="28" font-weight="700">${escapeXml(step)}</text>`;
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
