/**
 * DEPRECATED — do not run.
 * Teaching visuals must use GenerateImage per `.cursor/rules/softwareglimpse-teaching-visuals.mdc`
 * (premium SaaS UI / workflow infographics ~1MB+). Sharp SVG circle-cards are rejected.
 */
throw new Error(
  "Deprecated: use GenerateImage + softwareglimpse-teaching-visuals.mdc — not sharp SVG placeholders.",
);

/**
 * Batch 2: Original visual / Best diagram queue (Copper → remaining CRMs)
 * + first use-case workflow per product.
 * Run: node scripts/generate-original-visuals-batch2.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const W = 1536;
const H = 1024;

/** @typedef {{ name: string, detail: string, color: string }} Stage */
/** @typedef {{ slug: string, product: string, kind: 'feature'|'workflow', feature?: string, useCase?: string, file: string, title: string, subtitle: string, stages: Stage[], footer: string }} Diagram */

const C = {
  blue: "#2563EB",
  teal: "#0D9488",
  gold: "#CA8A04",
  orange: "#EA580C",
  purple: "#7C3AED",
  green: "#059669",
};

/** @type {Record<string, Stage[]>} */
const STAGE_SETS = {
  pipeline: [
    { name: "New", detail: "Deal opened", color: C.blue },
    { name: "Qualify", detail: "Fit confirmed", color: C.teal },
    { name: "Propose", detail: "Offer shared", color: C.gold },
    { name: "Negotiate", detail: "Terms open", color: C.purple },
    { name: "Won", detail: "Closed revenue", color: C.green },
  ],
  lead: [
    { name: "Capture", detail: "Form / import", color: C.blue },
    { name: "Score", detail: "Fit + intent", color: C.teal },
    { name: "Assign", detail: "Owner routed", color: C.gold },
    { name: "Nurture", detail: "Follow-ups", color: C.orange },
    { name: "Convert", detail: "To opportunity", color: C.green },
  ],
  salesAuto: [
    { name: "Trigger", detail: "Stage / field change", color: C.blue },
    { name: "Filter", detail: "Match rules", color: C.teal },
    { name: "Action", detail: "Task / email / update", color: C.gold },
    { name: "Notify", detail: "Owner alert", color: C.orange },
    { name: "Log", detail: "Activity recorded", color: C.green },
  ],
  workflow: [
    { name: "Event", detail: "Record change", color: C.blue },
    { name: "Rule", detail: "Criteria match", color: C.teal },
    { name: "Action", detail: "Task / update", color: C.gold },
    { name: "Owner", detail: "Route / notify", color: C.orange },
    { name: "Audit", detail: "Timeline entry", color: C.green },
  ],
  contact: [
    { name: "Capture", detail: "Person / company", color: C.blue },
    { name: "Enrich", detail: "Fields & tags", color: C.teal },
    { name: "Link", detail: "Deals / relationships", color: C.gold },
    { name: "Activity", detail: "Notes & emails", color: C.orange },
    { name: "Next step", detail: "Owned follow-up", color: C.green },
  ],
  scoring: [
    { name: "Fit", detail: "ICP attributes", color: C.blue },
    { name: "Intent", detail: "Buying signals", color: C.teal },
    { name: "Engage", detail: "Opens / replies", color: C.gold },
    { name: "Score", detail: "Priority rank", color: C.orange },
    { name: "Act", detail: "Seller works queue", color: C.green },
  ],
  usecasePipeline: [
    { name: "Capture", detail: "Lead or deal enters", color: C.blue },
    { name: "Qualify", detail: "Fit & next step", color: C.teal },
    { name: "Advance", detail: "Stage criteria met", color: C.gold },
    { name: "Close", detail: "Won / lost", color: C.purple },
    { name: "Review", detail: "Forecast & hygiene", color: C.green },
  ],
  usecaseContact: [
    { name: "Add", detail: "Person captured", color: C.blue },
    { name: "Context", detail: "Company & history", color: C.teal },
    { name: "Engage", detail: "Touch logged", color: C.gold },
    { name: "Own", detail: "Next action set", color: C.orange },
    { name: "Advance", detail: "Opportunity link", color: C.green },
  ],
  usecaseLead: [
    { name: "Inbound", detail: "Lead arrives", color: C.blue },
    { name: "Triage", detail: "Score & route", color: C.teal },
    { name: "Work", detail: "Calls / email", color: C.gold },
    { name: "Qualify", detail: "Sales-ready?", color: C.orange },
    { name: "Convert", detail: "Pipeline starts", color: C.green },
  ],
  usecaseProspect: [
    { name: "Define", detail: "ICP filters", color: C.blue },
    { name: "Find", detail: "People / accounts", color: C.teal },
    { name: "Enrich", detail: "Contact data", color: C.gold },
    { name: "Outreach", detail: "Sequence starts", color: C.orange },
    { name: "Handoff", detail: "Meeting / CRM", color: C.green },
  ],
};

/**
 * @param {string} slug
 * @param {string} product
 * @param {string} feature
 * @param {string} label
 * @param {Stage[]} stages
 * @param {string} subtitle
 * @param {string} footer
 * @returns {Diagram}
 */
function featureDiagram(slug, product, feature, label, stages, subtitle, footer) {
  return {
    slug,
    product,
    kind: "feature",
    feature,
    file: `${feature}.png`,
    title: `How ${product} ${label} works`,
    subtitle,
    stages,
    footer,
  };
}

/**
 * @param {string} slug
 * @param {string} product
 * @param {string} useCase
 * @param {string} label
 * @param {Stage[]} stages
 * @returns {Diagram}
 */
function workflowDiagram(slug, product, useCase, label, stages) {
  return {
    slug,
    product,
    kind: "workflow",
    useCase,
    file: `usecase-${useCase}.png`,
    title: `${product} ${label} workflow`,
    subtitle: `End-to-end use-case flow for ${label}`,
    stages,
    footer: `SoftwareGlimpse workflow teaching how ${product} supports ${label} — not a vendor UI capture.`,
  };
}

/** @type {Diagram[]} */
const DIAGRAMS = [
  // Copper
  featureDiagram("copper", "Copper", "pipeline-management", "pipelines", STAGE_SETS.pipeline, "Opportunity stages on Google Workspace–friendly CRM", "Keep Copper stages aligned with real sales milestones so forecasting stays honest."),
  featureDiagram("copper", "Copper", "contact-management", "contact management", STAGE_SETS.contact, "People and companies tied to deals and activity", "Copper is relationship-centric — ownership and next steps should live on the contact."),
  featureDiagram("copper", "Copper", "workflow-automation", "workflow automation", STAGE_SETS.workflow, "Rules that keep follow-ups and updates consistent", "Automate reminders and routing; leave judgment calls with sellers."),
  workflowDiagram("copper", "Copper", "pipeline-management", "pipeline management", STAGE_SETS.usecasePipeline),

  // Creatio
  featureDiagram("creatio", "Creatio", "pipeline-management", "pipelines", STAGE_SETS.pipeline, "Opportunity stages across Creatio sales processes", "Creatio pipelines should encode exit criteria — not just pretty stage names."),
  featureDiagram("creatio", "Creatio", "lead-management", "lead management", STAGE_SETS.lead, "From capture through qualification to opportunity", "Convert leads only when sales-ready so pipeline forecasts stay clean."),
  featureDiagram("creatio", "Creatio", "sales-automation", "sales automation", STAGE_SETS.salesAuto, "Process automation on leads and opportunities", "Start with assignment and next-task robots before complex branching."),
  workflowDiagram("creatio", "Creatio", "pipeline-management", "pipeline management", STAGE_SETS.usecasePipeline),

  // folk
  featureDiagram("folk", "folk", "contact-management", "contact management", STAGE_SETS.contact, "People-first CRM with clear next actions", "folk is contact-led — keep lists, notes, and next steps visible."),
  featureDiagram("folk", "folk", "workflow-automation", "workflow automation", STAGE_SETS.workflow, "Reminders and sequences that keep relationships warm", "Automate nudges; write the personal message yourself."),
  featureDiagram("folk", "folk", "pipeline-management", "pipelines", STAGE_SETS.pipeline, "Deal stages grounded in relationship progress", "Map stages to relationship milestones, not vanity checkboxes."),
  workflowDiagram("folk", "folk", "contact-management", "contact management", STAGE_SETS.usecaseContact),

  // Insightly
  featureDiagram("insightly", "Insightly", "pipeline-management", "pipelines", STAGE_SETS.pipeline, "Opportunity boards for project-aware selling", "Keep stages few and exit criteria explicit for forecast accuracy."),
  featureDiagram("insightly", "Insightly", "lead-management", "lead management", STAGE_SETS.lead, "Capture, qualify, and convert inbound interest", "Separate lead triage from opportunity pipeline hygiene."),
  featureDiagram("insightly", "Insightly", "contact-management", "contact management", STAGE_SETS.contact, "Contacts and organisations linked to opportunities", "One clean contact identity beats duplicate project silos."),
  workflowDiagram("insightly", "Insightly", "pipeline-management", "pipeline management", STAGE_SETS.usecasePipeline),

  // Keap
  featureDiagram("keap", "Keap", "lead-management", "lead management", STAGE_SETS.lead, "Contact-centric lead capture and follow-up", "Keap lead work lives on contacts — convert when a real opportunity exists."),
  featureDiagram("keap", "Keap", "sales-automation", "sales automation", STAGE_SETS.salesAuto, "Campaigns and sequences that drive the next ask", "Automate follow-up cadence; keep the offer conversation human."),
  featureDiagram("keap", "Keap", "workflow-automation", "workflow automation", STAGE_SETS.workflow, "Campaign builder rules on tags and stages", "Tag-based automation works when tags mean one clear state."),
  workflowDiagram("keap", "Keap", "lead-management", "lead management", STAGE_SETS.usecaseLead),

  // Lusha
  featureDiagram("lusha", "Lusha", "contact-management", "contact management", STAGE_SETS.contact, "Find and enrich B2B contacts for outreach", "Enrichment quality matters more than list size — verify before you dial."),
  featureDiagram("lusha", "Lusha", "lead-scoring", "lead scoring", STAGE_SETS.scoring, "Prioritize who to work from fit and signals", "Score for attention allocation, not automatic closed-won."),
  featureDiagram("lusha", "Lusha", "workflow-automation", "workflow automation", STAGE_SETS.workflow, "Prospecting workflows into CRM and sequences", "Push enriched contacts into the next owned outreach step."),
  workflowDiagram("lusha", "Lusha", "prospecting", "prospecting", STAGE_SETS.usecaseProspect),

  // monday sales CRM
  featureDiagram("monday-sales-crm", "monday sales CRM", "pipeline-management", "pipelines", STAGE_SETS.pipeline, "Board-based deal stages for sales teams", "monday pipelines should mirror your real sales motion column-for-column."),
  featureDiagram("monday-sales-crm", "monday sales CRM", "lead-management", "lead management", STAGE_SETS.lead, "Leads into boards with clear ownership", "Convert to a deal board only when sales-ready."),
  featureDiagram("monday-sales-crm", "monday sales CRM", "sales-automation", "sales automation", STAGE_SETS.salesAuto, "Automations on status changes and dates", "Automate the next activity when a status changes so boards stay alive."),
  workflowDiagram("monday-sales-crm", "monday sales CRM", "pipeline-management", "pipeline management", STAGE_SETS.usecasePipeline),

  // Remaining CRMs (proactive clearance)
  featureDiagram("nutshell", "Nutshell", "pipeline-management", "pipelines", STAGE_SETS.pipeline, "Sales pipeline stages for growing teams", "Keep Nutshell stages few and criteria explicit."),
  featureDiagram("nutshell", "Nutshell", "lead-management", "lead management", STAGE_SETS.lead, "Lead capture through conversion", "Triage leads separately from deal forecasting."),
  featureDiagram("nutshell", "Nutshell", "sales-automation", "sales automation", STAGE_SETS.salesAuto, "Triggers that create the next sales activity", "Automate handoffs; keep discount judgment with people."),
  workflowDiagram("nutshell", "Nutshell", "pipeline-management", "pipeline management", STAGE_SETS.usecasePipeline),

  featureDiagram("oracle-cx", "Oracle CX", "pipeline-management", "pipelines", STAGE_SETS.pipeline, "Opportunity stages in Oracle Sales", "Align stage probability with how Oracle forecasts categories."),
  featureDiagram("oracle-cx", "Oracle CX", "lead-management", "lead management", STAGE_SETS.lead, "Lead object through conversion", "Conversion is the boundary between lead work and opportunity forecasting."),
  featureDiagram("oracle-cx", "Oracle CX", "sales-automation", "sales automation", STAGE_SETS.salesAuto, "Sales process automation on CRM events", "Prefer clear entry criteria before complex branching."),
  workflowDiagram("oracle-cx", "Oracle CX", "pipeline-management", "pipeline management", STAGE_SETS.usecasePipeline),

  featureDiagram("rocketreach", "RocketReach", "workflow-automation", "workflow automation", STAGE_SETS.workflow, "Prospect data into outreach workflows", "Automate enrichment → sequence enrollment with human review on edge cases."),
  featureDiagram("rocketreach", "RocketReach", "lead-scoring", "lead scoring", STAGE_SETS.scoring, "Prioritize contacts worth researching next", "Score for research priority, not automatic buying intent claims."),
  featureDiagram("rocketreach", "RocketReach", "lead-management", "lead management", STAGE_SETS.lead, "Find, enrich, and hand off prospects", "Hand off only when contact data and context are good enough to call."),
  workflowDiagram("rocketreach", "RocketReach", "prospecting", "prospecting", STAGE_SETS.usecaseProspect),

  featureDiagram("salesflare", "Salesflare", "contact-management", "contact management", STAGE_SETS.contact, "Automatic timeline contacts for relationship selling", "Salesflare is contact-first — keep timelines and next steps honest."),
  featureDiagram("salesflare", "Salesflare", "workflow-automation", "workflow automation", STAGE_SETS.workflow, "Reminders from email and meeting activity", "Automate nudges from real activity, not invented busywork."),
  featureDiagram("salesflare", "Salesflare", "pipeline-management", "pipelines", STAGE_SETS.pipeline, "Opportunity stages tied to contact timelines", "Advance deals when relationship evidence exists — not on calendar hope."),
  workflowDiagram("salesflare", "Salesflare", "contact-management", "contact management", STAGE_SETS.usecaseContact),

  featureDiagram("streak", "Streak", "pipeline-management", "pipelines", STAGE_SETS.pipeline, "Gmail-native pipeline boxes", "Streak pipelines live in mail — stage moves should reflect real thread progress."),
  featureDiagram("streak", "Streak", "contact-management", "contact management", STAGE_SETS.contact, "People linked to Gmail threads and boxes", "One contact identity across threads beats duplicate boxes."),
  featureDiagram("streak", "Streak", "workflow-automation", "workflow automation", STAGE_SETS.workflow, "Mail pipeline rules and shared inboxes", "Automate stage entry tasks; keep the email reply human."),
  workflowDiagram("streak", "Streak", "pipeline-management", "pipeline management", STAGE_SETS.usecasePipeline),

  featureDiagram("sugarcrm", "SugarCRM", "pipeline-management", "pipelines", STAGE_SETS.pipeline, "Opportunity stages for enterprise sales motions", "Customize stages to methodology; protect forecast categories."),
  featureDiagram("sugarcrm", "SugarCRM", "lead-management", "lead management", STAGE_SETS.lead, "Lead capture through convert", "Convert creates the opportunity path — keep that boundary clear."),
  featureDiagram("sugarcrm", "SugarCRM", "sales-automation", "sales automation", STAGE_SETS.salesAuto, "Workflow on leads and opportunities", "Automate assignment and next activities first."),
  workflowDiagram("sugarcrm", "SugarCRM", "pipeline-management", "pipeline management", STAGE_SETS.usecasePipeline),

  featureDiagram("activecampaign", "ActiveCampaign", "lead-management", "lead management", STAGE_SETS.lead, "Contact-centric lead capture and scoring", "ActiveCampaign leads live as contacts — convert when sales-ready."),
  featureDiagram("activecampaign", "ActiveCampaign", "sales-automation", "sales automation", STAGE_SETS.salesAuto, "Automations and deal stages working together", "Use automations for cadence; use deal stages for forecast truth."),
  featureDiagram("activecampaign", "ActiveCampaign", "contact-management", "contact management", STAGE_SETS.contact, "Contacts, lists, and deal relationships", "One contact record with clear ownership beats list sprawl."),
  workflowDiagram("activecampaign", "ActiveCampaign", "lead-management", "lead management", STAGE_SETS.usecaseLead),
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
  const kindLabel = d.kind === "workflow" ? "use-case workflow" : "feature teaching diagram";

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

  const footerText = wrapFooter(d.footer, 100)
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
  <text x="${W / 2}" y="100" text-anchor="middle" fill="#0F172A" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="34" font-weight="700">${escapeXml(d.title)}</text>
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
    const dir = path.join(ROOT, "public", "software", d.slug, "diagrams");
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
