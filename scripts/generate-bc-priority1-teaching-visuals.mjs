#!/usr/bin/env node
/**
 * Generate teaching overview + workflow PNGs for BC Priority-1 products.
 * SVG → sharp PNG (16:9 educational diagrams). Prefer GenerateImage refresh later.
 *
 * Usage: node scripts/generate-bc-priority1-teaching-visuals.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const PRODUCTS = [
  {
    slug: "ringcentral",
    name: "RingCentral",
    overviewTitle: "Enterprise UCaaS stack",
    overviewSteps: [
      "Business phone numbers & softphones",
      "IVR / queues / multi-site routing",
      "Video meetings + team messaging",
      "CRM sync & contact-centre options",
    ],
    workflow: [
      { n: "1", t: "Port numbers", d: "Move DIDs into RingEX" },
      { n: "2", t: "Build IVR", d: "Menus, hours, queues" },
      { n: "3", t: "Connect CRM", d: "Salesforce / HubSpot CTI" },
      { n: "4", t: "Coach & scale", d: "Recording, analytics, AI" },
    ],
  },
  {
    slug: "dialpad",
    name: "Dialpad",
    overviewTitle: "AI-native business calling",
    overviewSteps: [
      "Cloud phone + unlimited US/CA calling",
      "Real-time AI transcription & summaries",
      "Team messaging and video meetings",
      "CRM integrations on Pro+",
    ],
    workflow: [
      { n: "1", t: "Activate Connect", d: "Numbers + softphones" },
      { n: "2", t: "Enable Ai", d: "Live transcripts on calls" },
      { n: "3", t: "Wire CRM", d: "Salesforce / HubSpot (Pro)" },
      { n: "4", t: "Coach from Ai", d: "Summaries & sentiment" },
    ],
  },
  {
    slug: "zoom",
    name: "Zoom",
    overviewTitle: "Video-led UCaaS + Zoom Phone",
    overviewSteps: [
      "Zoom Workplace meetings & team chat",
      "Add Zoom Phone for PSTN calling",
      "AI Companion notes & summaries",
      "Optional Power Pack for queues",
    ],
    workflow: [
      { n: "1", t: "Standardise video", d: "Workplace for meetings" },
      { n: "2", t: "Add Phone", d: "Unlimited or metered lines" },
      { n: "3", t: "Route calls", d: "Auto attendants & queues" },
      { n: "4", t: "Unify workspace", d: "Chat + phone + meetings" },
    ],
  },
  {
    slug: "nextiva",
    name: "Nextiva",
    overviewTitle: "SMB all-in-one business comms",
    overviewSteps: [
      "Voice, SMS, video, and team chat",
      "Call routing & auto-attendant",
      "Shared inbox / digital channels",
      "Scale plan AI & contact centre path",
    ],
    workflow: [
      { n: "1", t: "Pick Core/Engage", d: "Seat plan for team size" },
      { n: "2", t: "Set routing", d: "Menus and business hours" },
      { n: "3", t: "Open channels", d: "SMS, chat, messaging apps" },
      { n: "4", t: "Add AI / CC", d: "XBert or Scale / CC tiers" },
    ],
  },
  {
    slug: "microsoft-teams",
    name: "Microsoft Teams",
    overviewTitle: "M365 collaboration hub",
    overviewSteps: [
      "Channels, chat, and meetings",
      "Files & apps inside M365",
      "Optional Teams Phone telephony",
      "Copilot AI as licensed add-on",
    ],
    workflow: [
      { n: "1", t: "License Teams", d: "M365 or Teams seat" },
      { n: "2", t: "Structure teams", d: "Channels for workstreams" },
      { n: "3", t: "Meet & chat", d: "Default collaboration hub" },
      { n: "4", t: "Add Phone?", d: "Teams Phone + PSTN plan" },
    ],
  },
  {
    slug: "slack",
    name: "Slack",
    overviewTitle: "Channel-first team messaging",
    overviewSteps: [
      "Public & private channels",
      "Huddles for quick voice/video",
      "2,600+ app integrations",
      "Workflows & AI on higher plans",
    ],
    workflow: [
      { n: "1", t: "Create workspace", d: "Free or Pro seats" },
      { n: "2", t: "Design channels", d: "By team / project / topic" },
      { n: "3", t: "Connect apps", d: "CRM, Git, calendars" },
      { n: "4", t: "Automate", d: "Workflows + Slack AI" },
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
