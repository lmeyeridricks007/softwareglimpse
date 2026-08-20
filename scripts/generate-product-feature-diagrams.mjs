/**
 * DEPRECATED — do not run.
 * Teaching visuals must use GenerateImage per `.cursor/rules/softwareglimpse-teaching-visuals.mdc`
 * (premium SaaS UI / workflow infographics ~1MB+). Sharp SVG circle-cards are rejected.
 */
throw new Error(
  "Deprecated: use GenerateImage + softwareglimpse-teaching-visuals.mdc — not sharp SVG placeholders.",
);

/**
 * Generate SoftwareGlimpse original teaching diagrams for CRM feature pages.
 * SVG → PNG via sharp. Run: node scripts/generate-product-feature-diagrams.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const W = 1536;
const H = 1024;

const DIAGRAMS = [
  {
    slug: "dynamics-365",
    product: "Dynamics 365",
    feature: "pipeline-management",
    file: "pipeline-management.png",
    title: "How Dynamics 365 pipelines work",
    subtitle: "Opportunity stages from open to close — teaching view, not a UI screenshot",
    stages: [
      { name: "Qualify", detail: "Confirm fit & interest", color: "#2563EB" },
      { name: "Develop", detail: "Discover needs", color: "#0D9488" },
      { name: "Propose", detail: "Quote & proposal", color: "#CA8A04" },
      { name: "Close", detail: "Negotiate terms", color: "#7C3AED" },
      { name: "Won / Lost", detail: "Outcome + next steps", color: "#059669" },
    ],
    footer:
      "Deals advance when stage criteria are met. Keep stages few and exit criteria explicit for forecast accuracy.",
  },
  {
    slug: "dynamics-365",
    product: "Dynamics 365",
    feature: "lead-management",
    file: "lead-management.png",
    title: "How Dynamics 365 lead management works",
    subtitle: "From capture to opportunity conversion",
    stages: [
      { name: "Capture", detail: "Form, import, or API", color: "#2563EB" },
      { name: "Qualify", detail: "Score & disqualify noise", color: "#0D9488" },
      { name: "Assign", detail: "Route to owner", color: "#CA8A04" },
      { name: "Nurture", detail: "Calls, email, tasks", color: "#EA580C" },
      { name: "Convert", detail: "Lead → Opportunity", color: "#059669" },
    ],
    footer:
      "Leads stay leads until conversion creates Account / Contact / Opportunity records for pipeline work.",
  },
  {
    slug: "dynamics-365",
    product: "Dynamics 365",
    feature: "sales-automation",
    file: "sales-automation.png",
    title: "How Dynamics 365 sales automation works",
    subtitle: "Trigger → condition → action on sales records",
    stages: [
      { name: "Trigger", detail: "Stage change / field update", color: "#2563EB" },
      { name: "Condition", detail: "If owner, amount, region…", color: "#0D9488" },
      { name: "Action", detail: "Task, email, or update", color: "#CA8A04" },
      { name: "Log", detail: "Timeline activity written", color: "#EA580C" },
      { name: "Notify", detail: "Owner or team alert", color: "#059669" },
    ],
    footer:
      "Automate handoffs and follow-ups — keep judgment steps (discount, exception) with people.",
  },
  {
    slug: "freshsales",
    product: "Freshsales",
    feature: "pipeline-management",
    file: "pipeline-management.png",
    title: "How Freshsales pipelines work",
    subtitle: "Deal stages on a sales board — teaching view",
    stages: [
      { name: "New", detail: "Deal created", color: "#2563EB" },
      { name: "Contacted", detail: "First conversation", color: "#0D9488" },
      { name: "Qualified", detail: "Need & budget fit", color: "#CA8A04" },
      { name: "Proposal", detail: "Offer sent", color: "#7C3AED" },
      { name: "Won", detail: "Closed revenue", color: "#059669" },
    ],
    footer:
      "One primary pipeline per motion; duplicate stages create noisy forecasts. Move deals only when criteria are true.",
  },
  {
    slug: "freshsales",
    product: "Freshsales",
    feature: "lead-management",
    file: "lead-management.png",
    title: "How Freshsales lead management works",
    subtitle: "Capture, score, and convert inbound interest",
    stages: [
      { name: "Capture", detail: "Web, import, sync", color: "#2563EB" },
      { name: "Score", detail: "Fit + engagement", color: "#0D9488" },
      { name: "Assign", detail: "Round-robin or territory", color: "#CA8A04" },
      { name: "Follow up", detail: "Sequences & calls", color: "#EA580C" },
      { name: "Convert", detail: "Lead → Contact / Deal", color: "#059669" },
    ],
    footer:
      "Separate lead inbox hygiene from deal pipeline hygiene — convert only when sales-ready.",
  },
  {
    slug: "freshsales",
    product: "Freshsales",
    feature: "workflow-automation",
    file: "workflow-automation.png",
    title: "How Freshsales workflow automation works",
    subtitle: "Rules that keep follow-ups and updates consistent",
    stages: [
      { name: "Event", detail: "Deal or lead change", color: "#2563EB" },
      { name: "Rule", detail: "Match filters", color: "#0D9488" },
      { name: "Action", detail: "Task / email / update", color: "#CA8A04" },
      { name: "Owner", detail: "Notify assignee", color: "#EA580C" },
      { name: "Audit", detail: "Activity recorded", color: "#059669" },
    ],
    footer:
      "Start with high-volume, low-judgment rules (assignment, reminders) before complex branching.",
  },
  {
    slug: "hubspot",
    product: "HubSpot",
    feature: "pipeline-management",
    file: "pipeline-management.png",
    title: "How HubSpot pipelines work",
    subtitle: "Deal pipelines with stage properties and probability",
    stages: [
      { name: "Appointment", detail: "Meeting booked", color: "#2563EB" },
      { name: "Qualified", detail: "To-do / discovery done", color: "#0D9488" },
      { name: "Presentation", detail: "Demo delivered", color: "#CA8A04" },
      { name: "Decision", detail: "Buyer evaluating", color: "#7C3AED" },
      { name: "Closed won", detail: "Revenue booked", color: "#059669" },
    ],
    footer:
      "HubSpot deal stages carry probability for forecasting — align stage names to your real sales motion.",
  },
  {
    slug: "hubspot",
    product: "HubSpot",
    feature: "lead-management",
    file: "lead-management.png",
    title: "How HubSpot lead management works",
    subtitle: "Contacts, lifecycle stages, and handoff to sales",
    stages: [
      { name: "Subscriber", detail: "Opt-in captured", color: "#2563EB" },
      { name: "Lead", detail: "Identified interest", color: "#0D9488" },
      { name: "MQL", detail: "Marketing-qualified", color: "#CA8A04" },
      { name: "SQL", detail: "Sales-accepted", color: "#EA580C" },
      { name: "Opportunity", detail: "Deal created", color: "#059669" },
    ],
    footer:
      "Lifecycle stage is the shared language between marketing and sales — define exit criteria for each step.",
  },
  {
    slug: "hubspot",
    product: "HubSpot",
    feature: "sales-automation",
    file: "sales-automation.png",
    title: "How HubSpot sales automation works",
    subtitle: "Workflows and sequences on deals and contacts",
    stages: [
      { name: "Enrollment", detail: "List, form, or deal stage", color: "#2563EB" },
      { name: "Branch", detail: "If/then filters", color: "#0D9488" },
      { name: "Engage", detail: "Email / task / Slack", color: "#CA8A04" },
      { name: "Update", detail: "Property or deal stage", color: "#EA580C" },
      { name: "Goal", detail: "Exit when met", color: "#059669" },
    ],
    footer:
      "Use sequences for 1:1 sales follow-up; use workflows for property updates and team routing.",
  },
  {
    slug: "pipedrive",
    product: "Pipedrive",
    feature: "pipeline-management",
    file: "pipeline-management.png",
    title: "How Pipedrive pipelines work",
    subtitle: "Deal-centric stages designed for activity-based selling",
    stages: [
      { name: "Qualified", detail: "Deal worth pursuing", color: "#2563EB" },
      { name: "Contact made", detail: "Conversation started", color: "#0D9488" },
      { name: "Demo", detail: "Product shown", color: "#CA8A04" },
      { name: "Proposal", detail: "Offer out", color: "#7C3AED" },
      { name: "Won", detail: "Deal closed", color: "#059669" },
    ],
    footer:
      "Pipedrive centers the deal board — activities (calls, emails) push deals forward, not vanity stage counts.",
  },
  {
    slug: "pipedrive",
    product: "Pipedrive",
    feature: "lead-management",
    file: "lead-management.png",
    title: "How Pipedrive lead management works",
    subtitle: "Leads inbox → qualified deal in a pipeline",
    stages: [
      { name: "Inbox", detail: "Raw lead captured", color: "#2563EB" },
      { name: "Label", detail: "Source & intent", color: "#0D9488" },
      { name: "Qualify", detail: "Worth a deal?", color: "#CA8A04" },
      { name: "Convert", detail: "Lead → Deal", color: "#EA580C" },
      { name: "Pipeline", detail: "Stage ownership starts", color: "#059669" },
    ],
    footer:
      "Keep the Leads inbox for triage; convert to a Deal only when you intend to run a sales process.",
  },
  {
    slug: "pipedrive",
    product: "Pipedrive",
    feature: "sales-automation",
    file: "sales-automation.png",
    title: "How Pipedrive sales automation works",
    subtitle: "Workflow automation on deals, people, and activities",
    stages: [
      { name: "Trigger", detail: "Deal created / moved", color: "#2563EB" },
      { name: "Filter", detail: "Pipeline, value, owner", color: "#0D9488" },
      { name: "Action", detail: "Activity, email, field", color: "#CA8A04" },
      { name: "Sequence", detail: "Optional follow-ups", color: "#EA580C" },
      { name: "Done", detail: "Logged on the deal", color: "#059669" },
    ],
    footer:
      "Automate the next activity when a deal enters a stage so the board never goes stale.",
  },
  {
    slug: "salesforce",
    product: "Salesforce",
    feature: "pipeline-management",
    file: "pipeline-management.png",
    title: "How Salesforce pipelines work",
    subtitle: "Opportunity stages with path guidance",
    stages: [
      { name: "Prospecting", detail: "Early opportunity", color: "#2563EB" },
      { name: "Qualification", detail: "Needs & authority", color: "#0D9488" },
      { name: "Proposal", detail: "Quote presented", color: "#CA8A04" },
      { name: "Negotiation", detail: "Terms & legal", color: "#7C3AED" },
      { name: "Closed Won", detail: "Booked business", color: "#059669" },
    ],
    footer:
      "Opportunity Path and stage probability drive forecast categories — customize stages to your sales methodology.",
  },
  {
    slug: "salesforce",
    product: "Salesforce",
    feature: "lead-management",
    file: "lead-management.png",
    title: "How Salesforce lead management works",
    subtitle: "Lead object → Convert creates Account, Contact, Opportunity",
    stages: [
      { name: "Create", detail: "Web-to-Lead / import", color: "#2563EB" },
      { name: "Assign", detail: "Rules / queues", color: "#0D9488" },
      { name: "Qualify", detail: "Status & rating", color: "#CA8A04" },
      { name: "Convert", detail: "Account + Contact", color: "#EA580C" },
      { name: "Opportunity", detail: "Pipeline begins", color: "#059669" },
    ],
    footer:
      "Conversion is the hard boundary: before = lead work; after = opportunity pipeline and forecasting.",
  },
  {
    slug: "salesforce",
    product: "Salesforce",
    feature: "sales-automation",
    file: "sales-automation.png",
    title: "How Salesforce sales automation works",
    subtitle: "Flow / Process automation on leads and opportunities",
    stages: [
      { name: "Trigger", detail: "Record create/update", color: "#2563EB" },
      { name: "Decision", detail: "Entry criteria", color: "#0D9488" },
      { name: "Action", detail: "Task, email, update", color: "#CA8A04" },
      { name: "Path", detail: "Guided next steps", color: "#EA580C" },
      { name: "Report", detail: "Audit & metrics", color: "#059669" },
    ],
    footer:
      "Prefer Flow for new automation; keep assignment rules and path guidance aligned with stage exit criteria.",
  },
  {
    slug: "zoho-crm",
    product: "Zoho CRM",
    feature: "pipeline-management",
    file: "pipeline-management.png",
    title: "How Zoho CRM pipelines work",
    subtitle: "Deals module stages across your sales process",
    stages: [
      { name: "Qualification", detail: "Fit confirmed", color: "#2563EB" },
      { name: "Needs analysis", detail: "Discovery done", color: "#0D9488" },
      { name: "Value proposition", detail: "Pitch delivered", color: "#CA8A04" },
      { name: "Negotiation", detail: "Commercials open", color: "#7C3AED" },
      { name: "Closed Won", detail: "Deal complete", color: "#059669" },
    ],
    footer:
      "Zoho Deals stages power pipeline analytics — map blueprint rules so reps cannot skip required fields.",
  },
  {
    slug: "zoho-crm",
    product: "Zoho CRM",
    feature: "lead-management",
    file: "lead-management.png",
    title: "How Zoho CRM lead management works",
    subtitle: "Leads module from capture through conversion to Deal",
    stages: [
      { name: "Capture", detail: "Webform / import / API", color: "#2563EB" },
      { name: "Assign", detail: "Owner or assignment rule", color: "#0D9488" },
      { name: "Qualify", detail: "Status & scoring", color: "#CA8A04" },
      { name: "Nurture", detail: "Tasks & follow-ups", color: "#EA580C" },
      { name: "Convert", detail: "Lead → Contact / Deal", color: "#059669" },
    ],
    footer:
      "Keep Leads for early triage; convert into Contacts and Deals when the opportunity is real enough for pipeline forecasting.",
  },
  {
    slug: "zoho-crm",
    product: "Zoho CRM",
    feature: "sales-automation",
    file: "sales-automation.png",
    title: "How Zoho CRM sales automation works",
    subtitle: "Workflow rules and Blueprint on Leads and Deals",
    stages: [
      { name: "Trigger", detail: "Create / edit / score", color: "#2563EB" },
      { name: "Rule", detail: "Criteria match", color: "#0D9488" },
      { name: "Action", detail: "Task, email, field update", color: "#CA8A04" },
      { name: "Blueprint", detail: "Guided stage path", color: "#EA580C" },
      { name: "Audit", detail: "Timeline + reports", color: "#059669" },
    ],
    footer:
      "Use workflow rules for repetitive follow-ups; use Blueprint when stage transitions need required fields and approvals.",
  },
];

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapFooter(text, maxChars = 92) {
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
      <rect x="${x}" y="${cardY}" width="${stageW}" height="10" rx="18" fill="${stage.color}"/>
      <rect x="${x}" y="${cardY}" width="${stageW}" height="88" fill="${stage.color}"/>
      <text x="${x + stageW / 2}" y="${cardY + 38}" text-anchor="middle" fill="#FFFFFF" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="18" font-weight="700">Stage ${num}</text>
      <text x="${x + stageW / 2}" y="${cardY + 68}" text-anchor="middle" fill="#FFFFFF" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="${stage.name.length > 14 ? 18 : 22}" font-weight="700">${escapeXml(stage.name)}</text>
      <circle cx="${x + stageW / 2}" cy="${cardY + 200}" r="48" fill="${stage.color}" fill-opacity="0.12" stroke="${stage.color}" stroke-width="3"/>
      <text x="${x + stageW / 2}" y="${cardY + 212}" text-anchor="middle" fill="${stage.color}" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="36" font-weight="700">${num}</text>
      <text x="${x + stageW / 2}" y="${cardY + 300}" text-anchor="middle" fill="#0F172A" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="19" font-weight="600">${escapeXml(stage.detail)}</text>
      <text x="${x + stageW / 2}" y="${cardY + 350}" text-anchor="middle" fill="#64748B" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="15">${escapeXml(d.product)}</text>
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
  <text x="${W / 2}" y="100" text-anchor="middle" fill="#0F172A" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="40" font-weight="700">${escapeXml(d.title)}</text>
  <text x="${W / 2}" y="148" text-anchor="middle" fill="#475569" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="22">${escapeXml(d.subtitle)}</text>
  <text x="${W / 2}" y="186" text-anchor="middle" fill="#64748B" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="16">SoftwareGlimpse original teaching diagram · grounded in ${escapeXml(d.product)} concepts · not a vendor UI capture</text>
  ${cards}
  <rect x="64" y="820" width="${W - 128}" height="160" rx="16" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
  <text x="96" y="862" fill="#0F172A" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="18" font-weight="700">How it works</text>
  ${footerText}
</svg>`;
}

async function main() {
  for (const d of DIAGRAMS) {
    const dir = path.join(ROOT, "public", "software", d.slug, "diagrams");
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, d.file);
    const svg = buildSvg(d);
    await sharp(Buffer.from(svg)).png().toFile(out);
    console.log("wrote", path.relative(ROOT, out));
  }
  console.log(`Done: ${DIAGRAMS.length} diagrams`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
