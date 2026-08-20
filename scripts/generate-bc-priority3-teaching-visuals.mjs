#!/usr/bin/env node
/**
 * Generate teaching overview + workflow PNGs for BC Priority-3 products.
 * SVG → sharp PNG (16:9 educational diagrams). Prefer GenerateImage refresh later.
 *
 * Usage: node scripts/generate-bc-priority3-teaching-visuals.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const PRODUCTS = [
  {
    slug: "webex",
    name: "Cisco Webex",
    overviewTitle: "Enterprise UC suite",
    overviewSteps: [
      "Meetings, messaging & whiteboards",
      "Webex Calling cloud phone",
      "CRM / device ecosystem",
      "Contact Center expansion path",
    ],
    workflow: [
      { n: "1", t: "Pick Meet/Suite", d: "Or start Free tier" },
      { n: "2", t: "Add Calling", d: "Suite or Calling SKU" },
      { n: "3", t: "Wire CRM", d: "Salesforce / ServiceNow" },
      { n: "4", t: "CC later?", d: "Webex Contact Center" },
    ],
  },
  {
    slug: "vonage",
    name: "Vonage",
    overviewTitle: "SMB/mid cloud phone",
    overviewSteps: [
      "Unlimited US/CA calling & SMS",
      "Mobile / Premium / Advanced lines",
      "Auto attendant & desk phones",
      "CRM + video on Premium+",
    ],
    workflow: [
      { n: "1", t: "Choose Mobile", d: "$13.99 promo floor" },
      { n: "2", t: "Port numbers", d: "Softphone & apps" },
      { n: "3", t: "Upgrade Premium", d: "CRM + video meetings" },
      { n: "4", t: "Advanced?", d: "Recording & call groups" },
    ],
  },
  {
    slug: "ooma",
    name: "Ooma",
    overviewTitle: "SMB VoIP, no contract",
    overviewSteps: [
      "Essentials / Pro / Pro Plus seats",
      "Virtual receptionist & ring groups",
      "Meetings + SMS on Pro+",
      "Queues & CRM on Pro Plus",
    ],
    workflow: [
      { n: "1", t: "Pick Essentials", d: "$19.95 monthly" },
      { n: "2", t: "Set receptionist", d: "Ring groups & apps" },
      { n: "3", t: "Add Pro", d: "Recording & meetings" },
      { n: "4", t: "Pro Plus?", d: "Queues + CRM CTI" },
    ],
  },
  {
    slug: "talkdesk",
    name: "Talkdesk",
    overviewTitle: "Cloud contact center",
    overviewSteps: [
      "Digital / Voice / Elite editions",
      "Studio IVR & agent workspace",
      "Omnichannel + WFM on Elite",
      "CXA AI Copilot / Autopilot",
    ],
    workflow: [
      { n: "1", t: "Pick edition", d: "Voice vs Elite" },
      { n: "2", t: "Build Studio", d: "IVR & queues" },
      { n: "3", t: "Connect CRM", d: "Salesforce / Zendesk" },
      { n: "4", t: "Add CXA", d: "Copilot / Autopilot" },
    ],
  },
  {
    slug: "genesys",
    name: "Genesys",
    overviewTitle: "Enterprise CCaaS",
    overviewSteps: [
      "Cloud CX 1–4 named ladders",
      "Voice + digital omnichannel",
      "WEM on CX 3+",
      "Native AI Copilot & bots",
    ],
    workflow: [
      { n: "1", t: "Choose CX tier", d: "CX1 voice → CX2+" },
      { n: "2", t: "Licence model", d: "Named vs concurrent" },
      { n: "3", t: "Wire AppFoundry", d: "CRM / UC apps" },
      { n: "4", t: "Size AI tokens", d: "Copilot & bots" },
    ],
  },
  {
    slug: "five9",
    name: "Five9",
    overviewTitle: "CCaaS + dialer strength",
    overviewSteps: [
      "Digital $119 / Core $159 seats",
      "Blended inbound & outbound",
      "CRM & UC adapter choice",
      "50 concurrent-seat minimum",
    ],
    workflow: [
      { n: "1", t: "Confirm 50+", d: "Concurrent seats" },
      { n: "2", t: "Pick Core", d: "Voice + digital" },
      { n: "3", t: "Choose adapters", d: "CRM + UC" },
      { n: "4", t: "Plus/Pro?", d: "Advanced AI / WEM" },
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
