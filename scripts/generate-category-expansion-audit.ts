#!/usr/bin/env npx tsx
/**
 * Net-new category and subcategory expansion opportunities.
 *
 * Focus: categories SoftwareGlimpse should add (or split out) with recommended
 * products — distinct from CONTENT-OPPORTUNITY-AUDIT (depth within existing cats).
 *
 * Usage: npm run catalogue:category-expansion
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { getAllSoftwareUnfiltered, getTopLevelCategories } from "@/data";
import { affiliateInventoryRows } from "@/data/catalogue/source/affiliate-inventory";
import { partnerLinks } from "@/data/affiliates/source/partner-links";

const OUT = join(
  process.cwd(),
  "docs/catalogue/CATEGORY-EXPANSION-OPPORTUNITIES-LATEST.md",
);

type ExpansionKind = "top-level" | "subcategory";

type ExpansionProposal = {
  slug: string;
  name: string;
  kind: ExpansionKind;
  parentSlug: string | null;
  tier: 1 | 2 | 3;
  rationale: string;
  buyerJob: string;
  keywords: string[];
  /** Slugs to prioritize on best page / finder — may include non-affiliate anchors */
  recommendedSlugs: string[];
  /** Slugs already in seed that match keywords (current primary category) */
  migrateFromSeed?: boolean;
  finderNote: string;
  defer?: string;
};

const PROPOSALS: ExpansionProposal[] = [
  {
    slug: "accounting-finance",
    name: "Accounting & Finance",
    kind: "top-level",
    parentSlug: null,
    tier: 1,
    rationale:
      "High SMB search intent; payroll/expense/bookkeeping sit adjacent to HR but deserve a dedicated hub and cost tooling. Three live affiliate SKUs today — anchor with editorial leaders before scaling inventory.",
    buyerJob:
      "Close books, automate receipt capture, manage expenses, and connect finance to payroll/HR.",
    keywords: [
      "Accounting",
      "Bookkeeping",
      "Expense",
      "Invoicing",
      "MRP",
      "Manufacturing ERP",
    ],
    recommendedSlugs: ["dext", "navan", "mrpeasy"],
    migrateFromSeed: true,
    finderNote:
      "Category finder + TCO after 8–12 primaries; expense vs bookkeeping vs inventory ERP are distinct jobs.",
  },
  {
    slug: "social-media-marketing",
    name: "Social Media Marketing",
    kind: "top-level",
    parentSlug: null,
    tier: 1,
    rationale:
      "Distinct buyer job from generic marketing automation — scheduling, listening, influencer workflows. Three affiliate products plus `buffer` / `hootsuite` editorial anchors already in seed.",
    buyerJob:
      "Plan posts, monitor brand mentions, run influencer campaigns, and report on social ROI.",
    keywords: ["Social Media", "Social Listening", "Influencer"],
    recommendedSlugs: [
      "socialbee",
      "brand24",
      "zypper",
      "buffer",
      "hootsuite",
    ],
    migrateFromSeed: true,
    finderNote:
      "Strong candidate for next category finder after CS hub matures; overlaps marketing parent until split.",
  },
  {
    slug: "webinar-virtual-events",
    name: "Webinar & Virtual Events",
    kind: "top-level",
    parentSlug: null,
    tier: 1,
    rationale:
      "Tight affiliate cluster ($7.6k+ minor units combined) currently buried in marketing. WebinarJam launch (Aug 2026) is the wedge.",
    buyerJob:
      "Run live webinars, virtual events, and repurposed streams for demand gen and customer education.",
    keywords: ["Webinar", "Video Conferencing", "Live Streaming"],
    recommendedSlugs: [
      "webinarjam-everwebinar",
      "livestorm",
      "switcher-studio",
      "zoom",
    ],
    migrateFromSeed: true,
    finderNote:
      "Lightweight finder (audience size, integrations, simulive vs live); pair with demo checklist tool.",
  },
  {
    slug: "lms-course-creation",
    name: "LMS & Course Creation",
    kind: "top-level",
    parentSlug: null,
    tier: 2,
    rationale:
      "Course creators and training businesses are not the same buyer as frontline SOP/LMS in HR. Two affiliate SKUs (`learnworlds`, `flexiquiz`) plus HR training overlap.",
    buyerJob:
      "Sell courses, host cohorts, issue certificates, and assess learners — not employee onboarding checklists.",
    keywords: ["LMS", "Online Course", "Quiz / Assessment"],
    recommendedSlugs: ["learnworlds", "flexiquiz", "trainual"],
    migrateFromSeed: true,
    finderNote:
      "Defer dedicated finder until 6+ primaries; until then index under marketing or hr with clear scope notes.",
  },
  {
    slug: "website-digital-presence",
    name: "Website & Digital Presence",
    kind: "top-level",
    parentSlug: null,
    tier: 2,
    rationale:
      "Scattered across ecommerce, marketing, IT, and AI — buyers shopping for site builders, landing pages, and hosting need a coherent hub.",
    buyerJob:
      "Launch a site, optimize landing pages, buy/sell digital businesses, or manage hosting control panels.",
    keywords: [
      "Website Builder",
      "Landing Page",
      "Web Hosting",
      "Online Business Marketplace",
      "AI Website Builder",
    ],
    recommendedSlugs: [
      "ueni",
      "leadpages",
      "flippa",
      "plesk",
      "wegic",
      "shopify",
    ],
    migrateFromSeed: true,
    finderNote:
      "High scope risk — prefer subcategories under marketing + ecommerce first (see Tier 2 subs).",
    defer:
      "Activate as top-level only after subcategory hubs prove traffic; hosting (plesk) may stay IT-primary.",
  },
  {
    slug: "analytics-bi",
    name: "Analytics & Business Intelligence",
    kind: "top-level",
    parentSlug: null,
    tier: 2,
    rationale:
      "Marketing analytics and KPI dashboards share a buyer mindset (prove ROI) but inventory is thin (3 affiliate, 1 not in seed).",
    buyerJob:
      "Attribute leads, unify marketing metrics, and build executive KPI dashboards.",
    keywords: ["Analytics", "KPI", "Dashboard", "Lead Tracking"],
    recommendedSlugs: ["databox", "whatconverts", "canvas-score"],
    migrateFromSeed: true,
    finderNote: "Wait for `canvas-score` onboarding; otherwise defer finder.",
    defer: "Below 5 primaries — keep as marketing sub-hub until inventory grows.",
  },
  {
    slug: "reputation-reviews",
    name: "Reputation & Review Management",
    kind: "top-level",
    parentSlug: null,
    tier: 3,
    rationale:
      "Single affiliate SKU (`nicejob`) — valuable for local SMB but explicitly excluded from CS helpdesk peer sets.",
    buyerJob:
      "Collect reviews, respond on Google/social, and automate reputation workflows — not ticket resolution.",
    keywords: ["Reputation"],
    recommendedSlugs: ["nicejob"],
    migrateFromSeed: true,
    finderNote: "Hub page only; no finder until 4+ products.",
    defer: "Single-product category — keep as CS-adjacent until more inventory.",
  },
  {
    slug: "field-service-operations",
    name: "Field Service & Operations",
    kind: "top-level",
    parentSlug: null,
    tier: 2,
    rationale:
      "Construction and appointment-led service businesses — two affiliate SKUs plus pending `servicem8` inventory row.",
    buyerJob:
      "Schedule field crews, manage construction jobs, or run appointment-based local services.",
    keywords: [
      "Construction",
      "Field Service",
      "Appointment Scheduling",
    ],
    recommendedSlugs: [
      "contractor-foreman",
      "shore",
      "servicem8",
    ],
    migrateFromSeed: true,
    finderNote:
      "Vertical-specific; consider industry use-case pages before a generic finder.",
  },
  // Subcategories
  {
    slug: "social-media-management",
    name: "Social Media Management",
    kind: "subcategory",
    parentSlug: "marketing",
    tier: 1,
    rationale: "Indexable hub under marketing — faster than new top-level taxonomy.",
    buyerJob: "Schedule, publish, and analyze social posts across networks.",
    keywords: ["Social Media Management"],
    recommendedSlugs: ["socialbee", "buffer", "hootsuite"],
    finderNote: "Reuse marketing category finder with social job filter.",
  },
  {
    slug: "landing-pages-cro",
    name: "Landing Pages & CRO",
    kind: "subcategory",
    parentSlug: "marketing",
    tier: 2,
    rationale: "Landing page builders overlap funnel/CRO tools — distinct from email automation.",
    buyerJob: "Build high-converting landing pages and sales funnels.",
    keywords: ["Landing Page", "CRO", "Funnel Builder"],
    recommendedSlugs: ["leadpages", "kartra", "freshmarketer"],
    finderNote: "Marketing finder sub-route or requirements tag.",
  },
  {
    slug: "ppc-advertising",
    name: "PPC & Advertising Automation",
    kind: "subcategory",
    parentSlug: "marketing",
    tier: 3,
    rationale: "Two affiliate SKUs — niche but monetizable.",
    buyerJob: "Manage paid search/social campaigns and automate ad ops.",
    keywords: ["PPC", "Advertising Automation"],
    recommendedSlugs: ["birch", "diginius"],
    finderNote: "Defer indexable hub until 4+ peers.",
  },
  {
    slug: "dropshipping-pod",
    name: "Dropshipping & Print-on-Demand",
    kind: "subcategory",
    parentSlug: "ecommerce",
    tier: 1,
    rationale: "Strong affiliate cluster; distinct from core storefront platforms.",
    buyerJob: "Source products, print-on-demand merch, and fulfill without holding inventory.",
    keywords: ["Dropshipping", "Print-on-Demand"],
    recommendedSlugs: ["spocket", "printify", "alidrop"],
    finderNote: "Ecommerce finder with fulfillment-model constraint.",
  },
  {
    slug: "fulfillment-shipping",
    name: "Fulfillment & Shipping",
    kind: "subcategory",
    parentSlug: "ecommerce",
    tier: 2,
    rationale: "Post-checkout ops — pairs with dropshipping hub.",
    buyerJob: "Ship orders, manage returns, and outsource fulfillment.",
    keywords: ["Fulfillment", "Shipping", "Returns"],
    recommendedSlugs: ["shipbob", "sendcloud"],
    finderNote: "Ecommerce finder integration filter.",
  },
  {
    slug: "ats-recruiting",
    name: "ATS & Recruiting",
    kind: "subcategory",
    parentSlug: "hr",
    tier: 1,
    rationale: "HR hub is broad — ATS is a top January buying season per social strategy.",
    buyerJob: "Post jobs, track candidates, and coordinate hiring workflows.",
    keywords: ["Applicant Tracking", "Recruiting"],
    recommendedSlugs: ["breezy-hr", "freshteam"],
    finderNote: "HR finder with hiring-team-size constraints.",
  },
  {
    slug: "time-attendance",
    name: "Time & Attendance",
    kind: "subcategory",
    parentSlug: "hr",
    tier: 1,
    rationale: "Frontline workforce scheduling — distinct from core HRIS.",
    buyerJob: "Clock in/out, schedule shifts, and track hourly teams.",
    keywords: ["Time Tracking", "Workforce Management"],
    recommendedSlugs: ["connecteam", "jibble"],
    finderNote: "HR finder shift-scheduling dimension.",
  },
  {
    slug: "voip-business-phone",
    name: "VoIP & Business Phone",
    kind: "subcategory",
    parentSlug: "business-communications",
    tier: 1,
    rationale: "Largest BC affiliate cluster — deserves indexable sub-hub like CRM subcats.",
    buyerJob: "Cloud phone, sales dialers, and contact-center voice.",
    keywords: ["VoIP", "Business Phone", "Dialer", "Contact Center"],
    recommendedSlugs: [
      "aircall",
      "kixie",
      "krispcall",
      "callhippo",
      "freshcaller",
    ],
    finderNote: "BC finder with voice-vs-chat primary job.",
  },
  {
    slug: "live-chat",
    name: "Live Chat",
    kind: "subcategory",
    parentSlug: "customer-service",
    tier: 1,
    rationale: "CS category is thin (11 products) — split live chat from helpdesk for SEO and best pages.",
    buyerJob: "Website messenger, proactive chat, and chatbot deflection.",
    keywords: ["Live Chat"],
    recommendedSlugs: ["tidio", "freshchat", "livechat", "intercom"],
    finderNote: "CS finder with channel-primary filter.",
  },
  {
    slug: "helpdesk-ticketing",
    name: "Helpdesk & Ticketing",
    kind: "subcategory",
    parentSlug: "customer-service",
    tier: 1,
    rationale: "Core CS peer set — Zendesk, Freshdesk, Help Scout, Gorgias.",
    buyerJob: "Shared inbox, ticketing, SLA workflows, and knowledge base.",
    keywords: ["Help Desk", "Customer Support"],
    recommendedSlugs: [
      "zendesk-suite",
      "freshdesk",
      "help-scout",
      "gorgias",
      "zoho-desk",
      "freshservice",
    ],
    finderNote: "CS finder default path.",
  },
  {
    slug: "web-hosting",
    name: "Web Hosting & Server Management",
    kind: "subcategory",
    parentSlug: "it-development",
    tier: 2,
    rationale: "Hosting control panels are IT-primary but buyer overlaps website hub.",
    buyerJob: "Manage servers, panels, and hosted infrastructure.",
    keywords: ["Web Hosting", "Server Management"],
    recommendedSlugs: ["plesk"],
    finderNote: "IT finder hosting constraint.",
    defer: "Single SKU — expand inventory before indexable hub.",
  },
  {
    slug: "itsm",
    name: "IT Service Management",
    kind: "subcategory",
    parentSlug: "it-development",
    tier: 2,
    rationale: "ITSM vs dev tools — Freshservice straddles CS and IT.",
    buyerJob: "Internal service desk, incident management, and ITIL workflows.",
    keywords: ["IT Service Management"],
    recommendedSlugs: ["freshservice"],
    finderNote: "Scope note: customer-facing vs internal ITSM.",
    defer: "Need 3+ ITSM-native peers (not CS helpdesks).",
  },
  {
    slug: "ai-writing",
    name: "AI Writing",
    kind: "subcategory",
    parentSlug: "ai",
    tier: 2,
    rationale: "Largest AI affiliate sub-cluster — buyers search specifically for writing assistants.",
    buyerJob: "Draft, rewrite, and optimize copy with AI.",
    keywords: ["AI Writing"],
    recommendedSlugs: ["quillbot", "writesonic"],
    finderNote: "AI finder writing use-case tag.",
  },
  {
    slug: "ai-website-builder",
    name: "AI Website & App Builders",
    kind: "subcategory",
    parentSlug: "ai",
    tier: 2,
    rationale: "Emergent category in affiliate inventory — distinct from general AI assistants.",
    buyerJob: "Generate sites or lightweight apps from prompts.",
    keywords: ["AI Website Builder", "AI App"],
    recommendedSlugs: ["wegic", "emergent", "mindstudio"],
    finderNote: "AI finder build-surface constraint.",
  },
];

type MatchedProduct = {
  slug: string;
  name: string;
  currentCategory: string | null;
  affiliate: boolean;
  hasUrl: boolean;
  revenueMinor: number;
  inSeed: boolean;
  partnerCategory: string;
};

function tableRow(cols: (string | number)[]): string {
  return `| ${cols.join(" | ")} |`;
}

function matchProposal(proposal: ExpansionProposal): MatchedProduct[] {
  const swMap = new Map(
    getAllSoftwareUnfiltered().map((s) => [s.slug, s]),
  );
  const revBySource = new Map(
    affiliateInventoryRows.map((r) => [r.sourceId, r.revenueAmountMinor ?? 0]),
  );

  const hits = partnerLinks.filter((pl) =>
    proposal.keywords.some((k) =>
      pl.primaryCategory.toLowerCase().includes(k.toLowerCase()),
    ),
  );

  const bySlug = new Map<string, MatchedProduct>();

  for (const pl of hits) {
    const sw = swMap.get(pl.productSlug);
    bySlug.set(pl.productSlug, {
      slug: pl.productSlug,
      name: pl.name,
      currentCategory: sw?.primaryCategorySlug ?? null,
      affiliate: true,
      hasUrl: !!pl.affiliateUrl,
      revenueMinor: revBySource.get(pl.catalogueSourceId ?? "") ?? 0,
      inSeed: !!sw,
      partnerCategory: pl.primaryCategory,
    });
  }

  for (const slug of proposal.recommendedSlugs) {
    if (bySlug.has(slug)) continue;
    const sw = swMap.get(slug);
    const pl = partnerLinks.find((p) => p.productSlug === slug);
    bySlug.set(slug, {
      slug,
      name: sw?.name ?? slug,
      currentCategory: sw?.primaryCategorySlug ?? null,
      affiliate: !!pl,
      hasUrl: !!pl?.affiliateUrl,
      revenueMinor: pl
        ? (revBySource.get(pl.catalogueSourceId ?? "") ?? 0)
        : 0,
      inSeed: !!sw,
      partnerCategory: pl?.primaryCategory ?? "editorial anchor",
    });
  }

  return [...bySlug.values()].sort(
    (a, b) => b.revenueMinor - a.revenueMinor,
  );
}

function priorityScore(
  proposal: ExpansionProposal,
  matched: MatchedProduct[],
): number {
  const affiliateCount = matched.filter((m) => m.affiliate).length;
  const inSeedCount = matched.filter((m) => m.inSeed).length;
  const revenue = matched.reduce((s, m) => s + m.revenueMinor, 0);
  const tierWeight = proposal.tier === 1 ? 30 : proposal.tier === 2 ? 15 : 5;
  const kindWeight = proposal.kind === "top-level" ? 10 : 5;
  return (
    tierWeight +
    kindWeight +
    affiliateCount * 8 +
    inSeedCount * 3 +
    Math.min(revenue / 100_000, 40)
  );
}

function main() {
  const now = new Date().toISOString().slice(0, 10);
  const platformCats = getTopLevelCategories({ includeUnpublished: true })
    .map((c) => c.slug)
    .sort();

  const topLevel = PROPOSALS.filter((p) => p.kind === "top-level");
  const subcats = PROPOSALS.filter((p) => p.kind === "subcategory");

  const scored = PROPOSALS.map((p) => ({
    proposal: p,
    matched: matchProposal(p),
    score: 0,
  }));
  for (const row of scored) {
    row.score = priorityScore(row.proposal, row.matched);
  }
  scored.sort((a, b) => b.score - a.score);

  const lines: string[] = [
    "# Category expansion opportunities",
    "",
    `_Generated ${now}. Regenerate: \`npm run catalogue:category-expansion\`_`,
    "",
    "Strategic view of **net-new categories and subcategory hubs** SoftwareGlimpse should add, with **recommended products** per vertical.",
    "",
    "> **Not this doc:** depth within existing categories → [CONTENT-OPPORTUNITY-AUDIT-LATEST.md](./CONTENT-OPPORTUNITY-AUDIT-LATEST.md). Affiliate inventory gaps → [PRODUCT-AFFILIATE-GAP-AUDIT-LATEST.md](./PRODUCT-AFFILIATE-GAP-AUDIT-LATEST.md).",
    "",
    "## Executive summary",
    "",
    `| Signal | Value |`,
    `| --- | --- |`,
    `| Platform top-level categories today | ${platformCats.length} (\`${platformCats.join("`, `")}\`) |`,
    `| Proposed new top-level categories | ${topLevel.length} |`,
    `| Proposed subcategory hubs | ${subcats.length} |`,
    `| Affiliate inventory rows | ${affiliateInventoryRows.length} |`,
    `| Pending inventory → seed (\`streak\`, \`servicem8\`, Freshworks programme) | 3+ |`,
    "",
    "### Recommended launch sequence (Q4 2026 → Q1 2027)",
    "",
    "1. **Subcategory hubs first** (low taxonomy risk): CS live-chat + helpdesk, ecommerce dropshipping, HR ATS + time, BC VoIP, marketing social.",
    "2. **Top-level splits** when a sub-hub hits 6+ primaries with distinct finder jobs: **social-media-marketing**, **webinar-virtual-events**, **accounting-finance**.",
    "3. **Defer** single-SKU top-levels (`reputation-reviews`) and thin analytics until inventory onboarding catches up.",
    "",
    "### Top 10 expansion bets (scored)",
    "",
    tableRow(["Rank", "Slug", "Kind", "Tier", "Affiliate", "In seed", "Score"]),
    tableRow(["---:", "---", "---", "---:", "---:", "---:", "---:"]),
  ];

  scored.slice(0, 10).forEach((row, i) => {
    const m = row.matched;
    lines.push(
      tableRow([
        i + 1,
        `\`${row.proposal.slug}\``,
        row.proposal.kind,
        row.proposal.tier,
        m.filter((x) => x.affiliate).length,
        m.filter((x) => x.inSeed).length,
        Math.round(row.score),
      ]),
    );
  });

  lines.push("", "---", "", "## Tier 1 — New top-level categories", "");

  for (const p of topLevel.filter((x) => x.tier === 1)) {
    const matched = matchProposal(p);
    lines.push(...renderProposalSection(p, matched));
  }

  lines.push("", "## Tier 2 — New top-level categories (nurture inventory)", "");

  for (const p of topLevel.filter((x) => x.tier === 2)) {
    const matched = matchProposal(p);
    lines.push(...renderProposalSection(p, matched));
  }

  lines.push("", "## Tier 3 — Top-level (defer)", "");

  for (const p of topLevel.filter((x) => x.tier === 3)) {
    const matched = matchProposal(p);
    lines.push(...renderProposalSection(p, matched));
  }

  lines.push("", "---", "", "## Subcategory hubs (within existing parents)", "");

  const byParent = new Map<string, ExpansionProposal[]>();
  for (const p of subcats) {
    const parent = p.parentSlug ?? "unknown";
    if (!byParent.has(parent)) byParent.set(parent, []);
    byParent.get(parent)!.push(p);
  }

  for (const [parent, props] of [...byParent.entries()].sort()) {
    lines.push(`### Parent: \`${parent}\``, "");
    for (const p of props.sort((a, b) => a.tier - b.tier)) {
      const matched = matchProposal(p);
      lines.push(...renderProposalSection(p, matched, true));
    }
  }

  lines.push(
    "",
    "---",
    "",
    "## Expand thin categories (products to add or recategorize)",
    "",
    "### Customer service (11 primaries today)",
    "",
    "CS is the thinnest activated category. Before a new top-level, **grow the peer set** and add subcategory hubs:",
    "",
    "| Action | Products |",
    "| --- | --- |",
    "| **Sub-hub: live chat** | `tidio`, `freshchat`, `livechat`, `intercom` (BC-primary, CS-secondary) |",
    "| **Sub-hub: helpdesk** | `zendesk-suite`, `freshdesk`, `help-scout`, `gorgias`, `zoho-desk`, `freshservice` |",
    "| **Adjacent (not helpdesk peers)** | `nicejob` (reputation), `shore` (appointments) — separate hubs |",
    "| **Inventory pending** | Map Freshworks programme → `freshdesk` / `freshchat` / `freshservice` (no composite `/software/freshworks`) |",
    "",
    "### CRM (editorial depth, affiliate gaps)",
    "",
    "| Action | Products |",
    "| --- | --- |",
    "| **Onboard from inventory** | `streak` (Gmail CRM — affiliate row pending URL) |",
    "| **Keep as anchors** | Salesforce, HubSpot, Pipedrive, Zoho CRM — editorial credibility |",
    "",
    "### Field service (net-new vertical)",
    "",
    "| Action | Products |",
    "| --- | --- |",
    "| **Onboard from inventory** | `servicem8` (field service — category hint TBD) |",
    "| **In seed today** | `contractor-foreman`, `shore` |",
    "",
    "## Out of scope (for now)",
    "",
    "| Vertical | Why defer |",
    "| --- | --- |",
    "| Healthcare practice management | Single affiliate SKU; regulated vertical |",
    "| Legal / e-signature | No affiliate inventory |",
    "| Cybersecurity (standalone) | Proxy/remote-desktop SKUs fit IT; thin buyer overlap |",
    "| Business travel (standalone) | `navan` fits accounting-finance or HR expense |",
    "| Composite vendor programmes | Freshworks, etc. — map to SKUs only |",
    "",
    "## Recommended workflows",
    "",
    "| Goal | Command |",
    "| --- | --- |",
    "| Regenerate this report | `npm run catalogue:category-expansion` |",
    "| Depth within existing categories | `npm run catalogue:opportunities` |",
    "| Category onboarding | Category Onboarding workflow per parent slug |",
    "| Commercial priority | `npm run catalogue:commercial` |",
    "| Onboard affiliate SKU | `npm run catalogue:onboard` (existing inventory only) |",
    "| Activate subcategory seed | Extend `src/data/seed/categories.ts` + category onboarding |",
    "",
    "## Discovery agent",
    "",
    "This audit is produced by **`catalogue-category-expansion-agent`** (`scripts/generate-category-expansion-audit.ts`). Read-only — no taxonomy or content mutation.",
    "",
  );

  mkdirSync(join(process.cwd(), "docs/catalogue"), { recursive: true });
  writeFileSync(OUT, lines.join("\n"), "utf8");
  console.log(`Wrote ${OUT}`);
  console.log(
    `  proposals: ${PROPOSALS.length} (${topLevel.length} top-level, ${subcats.length} subcategory)`,
  );
}

function renderProposalSection(
  p: ExpansionProposal,
  matched: MatchedProduct[],
  compact = false,
): string[] {
  const affiliateN = matched.filter((m) => m.affiliate).length;
  const inSeedN = matched.filter((m) => m.inSeed).length;
  const revenue = matched.reduce((s, m) => s + m.revenueMinor, 0);

  const lines: string[] = [
    compact ? `#### \`${p.slug}\`` : `### ${p.name} (\`${p.slug}\`)`,
    "",
    `**Tier ${p.tier}** · ${p.kind}${p.parentSlug ? ` · parent \`${p.parentSlug}\`` : ""} · ${affiliateN} affiliate · ${inSeedN} in seed · ~${(revenue / 100).toFixed(0)} affiliate revenue units`,
    "",
    p.rationale,
    "",
    `**Buyer job:** ${p.buyerJob}`,
    "",
    `**Finder / tools:** ${p.finderNote}`,
    "",
  ];

  if (p.defer) {
    lines.push(`> **Defer note:** ${p.defer}`, "");
  }

  lines.push(
    "**Recommended products:**",
    "",
    tableRow([
      "Product",
      "In seed",
      "Affiliate",
      "URL",
      "Current category",
      "Partner label",
    ]),
    tableRow(["---", "---", "---", "---", "---", "---"]),
  );

  for (const m of matched) {
    lines.push(
      tableRow([
        `\`${m.slug}\``,
        m.inSeed ? "✓" : "—",
        m.affiliate ? "✓" : "anchor",
        m.hasUrl ? "✓" : "—",
        m.currentCategory ? `\`${m.currentCategory}\`` : "—",
        m.partnerCategory.slice(0, 42),
      ]),
    );
  }

  const toMigrate = matched.filter(
    (m) =>
      m.inSeed &&
      m.currentCategory &&
      (p.parentSlug
        ? m.currentCategory !== p.parentSlug
        : m.currentCategory !== p.slug),
  );
  if (toMigrate.length && p.migrateFromSeed) {
    lines.push(
      "",
      `**Recategorize when hub launches:** ${toMigrate.map((m) => `\`${m.slug}\` (${m.currentCategory})`).join(", ")}`,
      "",
    );
  } else {
    lines.push("");
  }

  if (!compact) lines.push("---", "");
  return lines;
}

main();
