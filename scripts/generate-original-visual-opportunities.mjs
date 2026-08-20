/**
 * DEPRECATED — do not run.
 * Teaching visuals must use GenerateImage per `.cursor/rules/softwareglimpse-teaching-visuals.mdc`
 * (premium SaaS UI / workflow infographics ~1MB+). Sharp SVG circle-cards are rejected.
 */
throw new Error(
  "Deprecated: use GenerateImage + softwareglimpse-teaching-visuals.mdc — not sharp SVG placeholders.",
);

/**
 * Generate SoftwareGlimpse original visuals for:
 * - use-case workflow diagrams (pipeline management)
 * - next-queue product feature diagrams
 * - shared A0 template kit (migration cutover + day-zero setup)
 *
 * Run: node scripts/generate-original-visual-opportunities.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const W = 1536;
const H = 1024;

/** @typedef {{ name: string, detail: string, color: string }} Stage */

/**
 * @typedef {{
 *   slug: string,
 *   product: string,
 *   kind: 'feature' | 'workflow' | 'shared',
 *   feature?: string,
 *   useCase?: string,
 *   file: string,
 *   outDir: string,
 *   title: string,
 *   subtitle: string,
 *   stages: Stage[],
 *   footer: string,
 * }} Diagram
 */

/** @type {Diagram[]} */
const DIAGRAMS = [
  // --- Use-case workflows (majors) ---
  ...[
    ["dynamics-365", "Dynamics 365"],
    ["freshsales", "Freshsales"],
    ["hubspot", "HubSpot"],
    ["pipedrive", "Pipedrive"],
    ["salesforce", "Salesforce"],
    ["zoho-crm", "Zoho CRM"],
  ].map(([slug, product]) => ({
    slug,
    product,
    kind: /** @type {const} */ ("workflow"),
    useCase: "pipeline-management",
    file: "usecase-pipeline-management.png",
    outDir: `public/software/${slug}/diagrams`,
    title: `${product} pipeline management workflow`,
    subtitle: "End-to-end use-case flow: capture → qualify → advance → close → review",
    stages: [
      { name: "Capture", detail: "Lead or deal enters", color: "#2563EB" },
      { name: "Qualify", detail: "Fit & next step", color: "#0D9488" },
      { name: "Advance", detail: "Stage criteria met", color: "#CA8A04" },
      { name: "Close", detail: "Won / lost outcome", color: "#7C3AED" },
      { name: "Review", detail: "Forecast & hygiene", color: "#059669" },
    ],
    footer: `This SoftwareGlimpse workflow teaches how ${product} supports pipeline management as a use case — not a vendor UI capture.`,
  })),

  // --- Amplemarket ---
  {
    slug: "amplemarket",
    product: "Amplemarket",
    kind: "feature",
    feature: "workflow-automation",
    file: "workflow-automation.png",
    outDir: "public/software/amplemarket/diagrams",
    title: "How Amplemarket workflow automation works",
    subtitle: "Signals and sequences that keep outreach moving",
    stages: [
      { name: "Signal", detail: "Intent / reply / job change", color: "#2563EB" },
      { name: "Enroll", detail: "Add to sequence", color: "#0D9488" },
      { name: "Branch", detail: "If opened / replied", color: "#CA8A04" },
      { name: "Act", detail: "Email, call, LinkedIn", color: "#EA580C" },
      { name: "Handoff", detail: "Book meeting / CRM", color: "#059669" },
    ],
    footer:
      "Automate the repetitive follow-ups; keep personalization and judgment with the seller.",
  },
  {
    slug: "amplemarket",
    product: "Amplemarket",
    kind: "feature",
    feature: "lead-scoring",
    file: "lead-scoring.png",
    outDir: "public/software/amplemarket/diagrams",
    title: "How Amplemarket lead scoring works",
    subtitle: "Prioritize who to work next from fit + engagement",
    stages: [
      { name: "Fit", detail: "ICP attributes", color: "#2563EB" },
      { name: "Intent", detail: "Buying signals", color: "#0D9488" },
      { name: "Engage", detail: "Opens, replies, clicks", color: "#CA8A04" },
      { name: "Score", detail: "Rank the queue", color: "#EA580C" },
      { name: "Act", detail: "Seller takes next step", color: "#059669" },
    ],
    footer:
      "Scoring is a triage tool — high scores get human attention first, not automatic closed-won.",
  },
  {
    slug: "amplemarket",
    product: "Amplemarket",
    kind: "feature",
    feature: "pipeline-management",
    file: "pipeline-management.png",
    outDir: "public/software/amplemarket/diagrams",
    title: "How Amplemarket pipelines work",
    subtitle: "From sequenced prospect to meeting-ready opportunity",
    stages: [
      { name: "Prospect", detail: "Target account/person", color: "#2563EB" },
      { name: "Engage", detail: "Multichannel sequence", color: "#0D9488" },
      { name: "Interest", detail: "Positive reply", color: "#CA8A04" },
      { name: "Meeting", detail: "Booked conversation", color: "#7C3AED" },
      { name: "Pipeline", detail: "Hand to CRM deal", color: "#059669" },
    ],
    footer:
      "Amplemarket pipeline teaching focuses on the engagement → meeting motion that feeds CRM deal stages.",
  },

  // --- Apollo ---
  {
    slug: "apollo",
    product: "Apollo.io",
    kind: "feature",
    feature: "lead-management",
    file: "lead-management.png",
    outDir: "public/software/apollo/diagrams",
    title: "How Apollo.io lead management works",
    subtitle: "Find, enrich, sequence, and convert prospects",
    stages: [
      { name: "Search", detail: "ICP filters", color: "#2563EB" },
      { name: "Enrich", detail: "Contact + company data", color: "#0D9488" },
      { name: "Sequence", detail: "Outreach cadence", color: "#CA8A04" },
      { name: "Qualify", detail: "Reply & intent", color: "#EA580C" },
      { name: "Convert", detail: "Deal / CRM sync", color: "#059669" },
    ],
    footer:
      "Lead management in Apollo combines data + engagement — convert only when a real conversation exists.",
  },
  {
    slug: "apollo",
    product: "Apollo.io",
    kind: "feature",
    feature: "workflow-automation",
    file: "workflow-automation.png",
    outDir: "public/software/apollo/diagrams",
    title: "How Apollo.io workflow automation works",
    subtitle: "Triggers that keep sequences and tasks consistent",
    stages: [
      { name: "Trigger", detail: "List, stage, or signal", color: "#2563EB" },
      { name: "Filter", detail: "ICP / owner rules", color: "#0D9488" },
      { name: "Sequence", detail: "Enroll or pause", color: "#CA8A04" },
      { name: "Task", detail: "Call / LinkedIn step", color: "#EA580C" },
      { name: "Sync", detail: "Update CRM fields", color: "#059669" },
    ],
    footer:
      "Start with enrollment and pause rules; add complex branching after the basics are reliable.",
  },
  {
    slug: "apollo",
    product: "Apollo.io",
    kind: "feature",
    feature: "pipeline-management",
    file: "pipeline-management.png",
    outDir: "public/software/apollo/diagrams",
    title: "How Apollo.io pipelines work",
    subtitle: "Deal stages for opportunities created from outreach",
    stages: [
      { name: "New", detail: "Opportunity opened", color: "#2563EB" },
      { name: "Contacted", detail: "Conversation live", color: "#0D9488" },
      { name: "Qualified", detail: "Need confirmed", color: "#CA8A04" },
      { name: "Proposal", detail: "Offer shared", color: "#7C3AED" },
      { name: "Won", detail: "Closed revenue", color: "#059669" },
    ],
    footer:
      "Keep Apollo deal stages aligned with your CRM so forecast language stays consistent across tools.",
  },

  // --- Attio ---
  {
    slug: "attio",
    product: "Attio",
    kind: "feature",
    feature: "pipeline-management",
    file: "pipeline-management.png",
    outDir: "public/software/attio/diagrams",
    title: "How Attio pipelines work",
    subtitle: "Flexible deal stages on relationship-centric records",
    stages: [
      { name: "Inbound", detail: "Deal created", color: "#2563EB" },
      { name: "Discovery", detail: "Needs mapped", color: "#0D9488" },
      { name: "Evaluation", detail: "Buyer comparing", color: "#CA8A04" },
      { name: "Negotiation", detail: "Terms open", color: "#7C3AED" },
      { name: "Won", detail: "Closed", color: "#059669" },
    ],
    footer:
      "Attio pipelines should mirror how your team actually advances relationships — keep stage exit criteria explicit.",
  },
  {
    slug: "attio",
    product: "Attio",
    kind: "feature",
    feature: "contact-management",
    file: "contact-management.png",
    outDir: "public/software/attio/diagrams",
    title: "How Attio contact management works",
    subtitle: "People and companies as the relationship graph",
    stages: [
      { name: "Capture", detail: "Person / company", color: "#2563EB" },
      { name: "Enrich", detail: "Attributes & history", color: "#0D9488" },
      { name: "Link", detail: "Relationships", color: "#CA8A04" },
      { name: "Activity", detail: "Emails & notes", color: "#EA580C" },
      { name: "Act", detail: "Next relationship step", color: "#059669" },
    ],
    footer:
      "Contact quality beats contact volume — keep ownership and next steps visible on every important person.",
  },
  {
    slug: "attio",
    product: "Attio",
    kind: "feature",
    feature: "workflow-automation",
    file: "workflow-automation.png",
    outDir: "public/software/attio/diagrams",
    title: "How Attio workflow automation works",
    subtitle: "Rules that keep relationship work moving",
    stages: [
      { name: "Event", detail: "Record change", color: "#2563EB" },
      { name: "Filter", detail: "List or attribute", color: "#0D9488" },
      { name: "Action", detail: "Task / notify / update", color: "#CA8A04" },
      { name: "Owner", detail: "Route to teammate", color: "#EA580C" },
      { name: "Log", detail: "Activity timeline", color: "#059669" },
    ],
    footer:
      "Automate reminders and routing first; leave nuanced relationship judgment to people.",
  },

  // --- Bitrix24 ---
  {
    slug: "bitrix24",
    product: "Bitrix24",
    kind: "feature",
    feature: "pipeline-management",
    file: "pipeline-management.png",
    outDir: "public/software/bitrix24/diagrams",
    title: "How Bitrix24 pipelines work",
    subtitle: "CRM deal stages across sales funnels",
    stages: [
      { name: "New", detail: "Lead/deal in", color: "#2563EB" },
      { name: "In progress", detail: "Working the deal", color: "#0D9488" },
      { name: "Proposal", detail: "Offer sent", color: "#CA8A04" },
      { name: "Negotiation", detail: "Terms", color: "#7C3AED" },
      { name: "Won", detail: "Closed", color: "#059669" },
    ],
    footer:
      "Bitrix24 can run multiple funnels — keep each motion’s stages distinct to protect forecasting.",
  },
  {
    slug: "bitrix24",
    product: "Bitrix24",
    kind: "feature",
    feature: "sales-automation",
    file: "sales-automation.png",
    outDir: "public/software/bitrix24/diagrams",
    title: "How Bitrix24 sales automation works",
    subtitle: "Robots and triggers on CRM stages",
    stages: [
      { name: "Stage", detail: "Deal enters stage", color: "#2563EB" },
      { name: "Robot", detail: "Automation fires", color: "#0D9488" },
      { name: "Task", detail: "Assign follow-up", color: "#CA8A04" },
      { name: "Notify", detail: "Chat / email alert", color: "#EA580C" },
      { name: "Advance", detail: "Move when done", color: "#059669" },
    ],
    footer:
      "Stage robots should create the next activity — not skip human qualification gates.",
  },
  {
    slug: "bitrix24",
    product: "Bitrix24",
    kind: "feature",
    feature: "contact-management",
    file: "contact-management.png",
    outDir: "public/software/bitrix24/diagrams",
    title: "How Bitrix24 contact management works",
    subtitle: "Contacts and companies tied to deals and activities",
    stages: [
      { name: "Create", detail: "Contact / company", color: "#2563EB" },
      { name: "Enrich", detail: "Fields & tags", color: "#0D9488" },
      { name: "Link", detail: "Attach to deal", color: "#CA8A04" },
      { name: "Activity", detail: "Calls, email, chat", color: "#EA580C" },
      { name: "Reuse", detail: "Next opportunity", color: "#059669" },
    ],
    footer:
      "One clean contact record per person beats duplicate portals across CRM, chat, and tasks.",
  },

  // --- Capsule ---
  {
    slug: "capsule",
    product: "Capsule",
    kind: "feature",
    feature: "pipeline-management",
    file: "pipeline-management.png",
    outDir: "public/software/capsule/diagrams",
    title: "How Capsule pipelines work",
    subtitle: "Opportunity boards for relationship-led selling",
    stages: [
      { name: "Prospect", detail: "Opportunity opened", color: "#2563EB" },
      { name: "Meeting", detail: "Conversation set", color: "#0D9488" },
      { name: "Proposal", detail: "Offer out", color: "#CA8A04" },
      { name: "Negotiate", detail: "Terms", color: "#7C3AED" },
      { name: "Won", detail: "Closed", color: "#059669" },
    ],
    footer:
      "Capsule pipelines stay useful when stages match real relationship milestones — not vanity checkboxes.",
  },
  {
    slug: "capsule",
    product: "Capsule",
    kind: "feature",
    feature: "contact-management",
    file: "contact-management.png",
    outDir: "public/software/capsule/diagrams",
    title: "How Capsule contact management works",
    subtitle: "People and organisations with clear next actions",
    stages: [
      { name: "Add", detail: "Person / org", color: "#2563EB" },
      { name: "Tag", detail: "Lists & labels", color: "#0D9488" },
      { name: "History", detail: "Notes & emails", color: "#CA8A04" },
      { name: "Task", detail: "Next action", color: "#EA580C" },
      { name: "Opportunity", detail: "Attach pipeline", color: "#059669" },
    ],
    footer:
      "Capsule is contact-first — keep next actions visible so relationships do not stall in the inbox.",
  },
  {
    slug: "capsule",
    product: "Capsule",
    kind: "feature",
    feature: "workflow-automation",
    file: "workflow-automation.png",
    outDir: "public/software/capsule/diagrams",
    title: "How Capsule workflow automation works",
    subtitle: "Tracks and reminders that keep follow-ups honest",
    stages: [
      { name: "Trigger", detail: "Opportunity / task", color: "#2563EB" },
      { name: "Rule", detail: "Match criteria", color: "#0D9488" },
      { name: "Remind", detail: "Due activity", color: "#CA8A04" },
      { name: "Notify", detail: "Owner alert", color: "#EA580C" },
      { name: "Complete", detail: "Log outcome", color: "#059669" },
    ],
    footer:
      "Use automation for reminders and handoffs; keep relationship nuance in notes and calls.",
  },

  // --- Close ---
  {
    slug: "close",
    product: "Close",
    kind: "feature",
    feature: "pipeline-management",
    file: "pipeline-management.png",
    outDir: "public/software/close/diagrams",
    title: "How Close pipelines work",
    subtitle: "Opportunity statuses built for calling teams",
    stages: [
      { name: "New", detail: "Lead/opp created", color: "#2563EB" },
      { name: "Active", detail: "In conversation", color: "#0D9488" },
      { name: "Qualified", detail: "Fit confirmed", color: "#CA8A04" },
      { name: "Pending", detail: "Waiting on buyer", color: "#7C3AED" },
      { name: "Won", detail: "Closed", color: "#059669" },
    ],
    footer:
      "Close pipelines should reflect call outcomes and next dials — stale opportunities kill dialer efficiency.",
  },
  {
    slug: "close",
    product: "Close",
    kind: "feature",
    feature: "workflow-automation",
    file: "workflow-automation.png",
    outDir: "public/software/close/diagrams",
    title: "How Close workflow automation works",
    subtitle: "Triggers that schedule the next call or email",
    stages: [
      { name: "Event", detail: "Status / activity", color: "#2563EB" },
      { name: "Filter", detail: "Pipeline / owner", color: "#0D9488" },
      { name: "Action", detail: "Task or email", color: "#CA8A04" },
      { name: "Sequence", detail: "Follow-up cadence", color: "#EA580C" },
      { name: "Log", detail: "Activity history", color: "#059669" },
    ],
    footer:
      "Automate the next touch after a call disposition so no opportunity dies in silence.",
  },
  {
    slug: "close",
    product: "Close",
    kind: "feature",
    feature: "lead-management",
    file: "lead-management.png",
    outDir: "public/software/close/diagrams",
    title: "How Close lead management works",
    subtitle: "Inbound and dialer leads into owned opportunities",
    stages: [
      { name: "Capture", detail: "Form / import / dial", color: "#2563EB" },
      { name: "Assign", detail: "Owner / smart views", color: "#0D9488" },
      { name: "Call", detail: "First conversation", color: "#CA8A04" },
      { name: "Qualify", detail: "Need & timing", color: "#EA580C" },
      { name: "Opportunity", detail: "Pipeline status", color: "#059669" },
    ],
    footer:
      "Lead → opportunity handoff should preserve call context so the next owner does not restart cold.",
  },

  // --- Closely ---
  {
    slug: "closely",
    product: "Closely",
    kind: "feature",
    feature: "workflow-automation",
    file: "workflow-automation.png",
    outDir: "public/software/closely/diagrams",
    title: "How Closely workflow automation works",
    subtitle: "LinkedIn and email sequences that react to engagement",
    stages: [
      { name: "Trigger", detail: "Accept / view / reply", color: "#2563EB" },
      { name: "Branch", detail: "Path by signal", color: "#0D9488" },
      { name: "Message", detail: "Next touch", color: "#CA8A04" },
      { name: "Wait", detail: "Delay step", color: "#EA580C" },
      { name: "Handoff", detail: "Meeting / CRM", color: "#059669" },
    ],
    footer:
      "Automate channel steps; pause aggressively on replies so humans take over warm conversations.",
  },
  {
    slug: "closely",
    product: "Closely",
    kind: "feature",
    feature: "lead-scoring",
    file: "lead-scoring.png",
    outDir: "public/software/closely/diagrams",
    title: "How Closely lead scoring works",
    subtitle: "Prioritize engaged prospects in outreach queues",
    stages: [
      { name: "Reach", detail: "Connection / email", color: "#2563EB" },
      { name: "Engage", detail: "Views & replies", color: "#0D9488" },
      { name: "Fit", detail: "ICP match", color: "#CA8A04" },
      { name: "Score", detail: "Priority rank", color: "#EA580C" },
      { name: "Focus", detail: "Seller works top queue", color: "#059669" },
    ],
    footer:
      "Score for attention allocation — high engagement plus ICP fit deserves the next human message.",
  },
  {
    slug: "closely",
    product: "Closely",
    kind: "feature",
    feature: "pipeline-management",
    file: "pipeline-management.png",
    outDir: "public/software/closely/diagrams",
    title: "How Closely pipelines work",
    subtitle: "From outreach acceptance to booked opportunity",
    stages: [
      { name: "Target", detail: "Prospect selected", color: "#2563EB" },
      { name: "Connect", detail: "Accepted / opened", color: "#0D9488" },
      { name: "Converse", detail: "Thread started", color: "#CA8A04" },
      { name: "Meeting", detail: "Call booked", color: "#7C3AED" },
      { name: "Opportunity", detail: "CRM / close path", color: "#059669" },
    ],
    footer:
      "Treat Closely pipeline stages as engagement milestones that feed your CRM deal board.",
  },

  // --- Shared A0 template kit ---
  {
    slug: "_shared",
    product: "SoftwareGlimpse",
    kind: "shared",
    file: "migration-cutover-field-map.png",
    outDir: "public/guides/_shared",
    title: "CRM migration visual system: inventory → map → pilot → cutover",
    subtitle: "Shared SoftwareGlimpse teaching kit for migration guides",
    stages: [
      { name: "Inventory", detail: "Sources of truth", color: "#2563EB" },
      { name: "Clean", detail: "Dedupe & owners", color: "#0D9488" },
      { name: "Map", detail: "Source → target fields", color: "#CA8A04" },
      { name: "Pilot", detail: "Sample import", color: "#EA580C" },
      { name: "Cutover", detail: "Freeze & go-live", color: "#059669" },
    ],
    footer:
      "Reuse this parameterized visual across product migration guides — swap product names in captions, keep the sequence identical.",
  },
  {
    slug: "_shared",
    product: "SoftwareGlimpse",
    kind: "shared",
    file: "implementation-day-zero.png",
    outDir: "public/guides/_shared",
    title: "CRM implementation day-zero visual system",
    subtitle: "Shared SoftwareGlimpse kit: pipeline-ready in the first working week",
    stages: [
      { name: "Access", detail: "Roles & seats", color: "#2563EB" },
      { name: "Objects", detail: "Fields that matter", color: "#0D9488" },
      { name: "Pipeline", detail: "Stages & criteria", color: "#CA8A04" },
      { name: "Import", detail: "Pilot records", color: "#EA580C" },
      { name: "Live", detail: "First team workflow", color: "#059669" },
    ],
    footer:
      "Day-zero means a usable pipeline, not every integration. Parameterize product name; keep this sequence for setup/implementation guides.",
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
  const kindLabel =
    d.kind === "workflow"
      ? "use-case workflow"
      : d.kind === "shared"
        ? "shared template kit"
        : "feature teaching diagram";

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
      <text x="${x + stageW / 2}" y="${cardY + 350}" text-anchor="middle" fill="#64748B" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="14">${escapeXml(d.product)}</text>
    `;
    })
    .join("\n");

  const footerLines = wrapFooter(d.footer, 100);
  const footerText = footerLines
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
  <rect x="48" y="40" width="${W - 96}" height="180" rx="20" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
  <text x="${W / 2}" y="100" text-anchor="middle" fill="#0F172A" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="36" font-weight="700">${escapeXml(d.title)}</text>
  <text x="${W / 2}" y="148" text-anchor="middle" fill="#475569" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="20">${escapeXml(d.subtitle)}</text>
  <text x="${W / 2}" y="186" text-anchor="middle" fill="#64748B" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="16">SoftwareGlimpse original ${escapeXml(kindLabel)} · not a vendor UI capture</text>
  ${cards}
  <rect x="64" y="820" width="${W - 128}" height="160" rx="16" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
  <text x="96" y="862" fill="#0F172A" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="18" font-weight="700">How it works</text>
  ${footerText}
</svg>`;
}

async function main() {
  for (const d of DIAGRAMS) {
    const dir = path.join(ROOT, d.outDir);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, d.file);
    await sharp(Buffer.from(buildSvg(d))).png().toFile(out);
    console.log("wrote", path.relative(ROOT, out));
  }
  console.log(`Done: ${DIAGRAMS.length} diagrams`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
