#!/usr/bin/env node
/**
 * Generate teaching overview + workflow PNGs for BC Priority-2 products.
 * SVG → sharp PNG (16:9 educational diagrams). Prefer GenerateImage refresh later.
 *
 * Usage: node scripts/generate-bc-priority2-teaching-visuals.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const PRODUCTS = [
  {
    slug: "openphone",
    name: "OpenPhone",
    overviewTitle: "Modern SMB shared phone",
    overviewSteps: [
      "Shared business numbers & softphones",
      "Unlimited US/CA calling & SMS (fair use)",
      "Sona AI answering agent",
      "CRM + menus on Business+",
    ],
    workflow: [
      { n: "1", t: "Pick Starter", d: "Seat + number per user" },
      { n: "2", t: "Share the line", d: "Team inbox & SMS" },
      { n: "3", t: "Enable Sona", d: "AI answers after-hours" },
      { n: "4", t: "Upgrade CRM", d: "Business for HubSpot CTI" },
    ],
  },
  {
    slug: "eightx8",
    name: "8x8",
    overviewTitle: "Global UCaaS + contact centre",
    overviewSteps: [
      "8x8 Work cloud phone & softphones",
      "Video meetings + team messaging",
      "IVR / queues / multi-site routing",
      "Contact Center (X6–X8) path",
    ],
    workflow: [
      { n: "1", t: "Choose X2/X4", d: "Work UCaaS seats" },
      { n: "2", t: "Port numbers", d: "Multi-country DIDs" },
      { n: "3", t: "Wire CRM", d: "Salesforce / HubSpot" },
      { n: "4", t: "Add CC?", d: "X6–X8 agent ladder" },
    ],
  },
  {
    slug: "goto-connect",
    name: "GoTo Connect",
    overviewTitle: "Remote-team UCaaS",
    overviewSteps: [
      "Cloud phone + softphones anywhere",
      "Unlimited attendants & queues",
      "Video meetings up to 250",
      "CX / Contact Center ladders",
    ],
    workflow: [
      { n: "1", t: "Quote Phone", d: "Sales-assisted seats" },
      { n: "2", t: "Build dial plan", d: "Attendants & queues" },
      { n: "3", t: "Meet & message", d: "Video + team chat" },
      { n: "4", t: "Grow to CX", d: "Inbox & digital channels" },
    ],
  },
  {
    slug: "grasshopper",
    name: "Grasshopper",
    overviewTitle: "SMB virtual business numbers",
    overviewSteps: [
      "Local or toll-free virtual number",
      "Extensions to phones you already have",
      "Mobile & desktop apps",
      "IVR / recording on Solo Plus+",
    ],
    workflow: [
      { n: "1", t: "Pick plan", d: "Solo / Solo Plus / SB" },
      { n: "2", t: "Choose number", d: "Local or toll-free" },
      { n: "3", t: "Set extensions", d: "Forward to mobiles" },
      { n: "4", t: "Add SMS", d: "Complete A2P if needed" },
    ],
  },
  {
    slug: "respond-io",
    name: "respond.io",
    overviewTitle: "Omnichannel WhatsApp inbox",
    overviewSteps: [
      "WhatsApp Business API + other channels",
      "Shared team & custom inboxes",
      "Broadcasts & workflow automation",
      "AI Assist / Agents on Growth+",
    ],
    workflow: [
      { n: "1", t: "Connect channels", d: "WhatsApp + messengers" },
      { n: "2", t: "Build inbox", d: "Teams & assignment" },
      { n: "3", t: "Automate", d: "Workflows & broadcasts" },
      { n: "4", t: "Add AI Agents", d: "Growth+ packaging" },
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
