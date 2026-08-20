/**
 * Client-safe metadata for category decision tools.
 * Does not import category-onboarding seeds (those stay server-only).
 */

export const NEW_TOOL_CATEGORY_SLUGS = [
  "marketing",
  "email-marketing",
  "business-communications",
  "customer-service",
  "project-management",
  "hr",
  "ecommerce",
  "ai",
  "it-development",
] as const;

export type NewToolCategorySlug = (typeof NEW_TOOL_CATEGORY_SLUGS)[number];

export const CATEGORY_TOOL_KINDS = [
  "finder",
  "cost-calculator",
  "plan-selector",
  "requirements-builder",
  "vendor-scorecard",
  "rfp-builder",
  "demo-checklist-builder",
  "readiness-assessment",
] as const;

export type CategoryToolKind = (typeof CATEGORY_TOOL_KINDS)[number];

export type CategoryToolMeta = {
  slug: NewToolCategorySlug;
  shortName: string;
  productNoun: string;
  productNounPlural: string;
  /** Lowercase phrase for sentences: "HR software", "email marketing tools". */
  softwarePhrase: string;
  bestSlug: string;
  jobSummary: string;
  integrationExtras: Array<{ value: string; label: string }>;
};

const BASE_INTEGRATIONS: Array<{ value: string; label: string }> = [
  { value: "google-workspace", label: "Google Workspace" },
  { value: "microsoft-365", label: "Microsoft 365" },
  { value: "slack", label: "Slack" },
  { value: "zapier", label: "Zapier" },
  { value: "none", label: "None / not sure" },
];

export const CATEGORY_TOOL_META: Record<NewToolCategorySlug, CategoryToolMeta> =
  {
    marketing: {
      slug: "marketing",
      shortName: "Marketing",
      productNoun: "marketing",
      productNounPlural: "marketing products",
      softwarePhrase: "marketing software",
      bestSlug: "marketing-software",
      jobSummary:
        "campaigns, landing pages, marketing automation and growth tooling",
      integrationExtras: [
        { value: "hubspot", label: "HubSpot" },
        { value: "salesforce", label: "Salesforce" },
        { value: "mailchimp", label: "Mailchimp" },
        { value: "google-ads", label: "Google Ads" },
      ],
    },
    "email-marketing": {
      slug: "email-marketing",
      shortName: "Email Marketing",
      productNoun: "email marketing",
      productNounPlural: "email marketing products",
      softwarePhrase: "email marketing software",
      bestSlug: "email-marketing-software",
      jobSummary: "lists, automations, deliverability and campaign sending",
      integrationExtras: [
        { value: "shopify", label: "Shopify" },
        { value: "wordpress", label: "WordPress" },
        { value: "hubspot", label: "HubSpot" },
        { value: "salesforce", label: "Salesforce" },
      ],
    },
    "business-communications": {
      slug: "business-communications",
      shortName: "Business Communications",
      productNoun: "business communications",
      productNounPlural: "business communications products",
      softwarePhrase: "business communications software",
      bestSlug: "business-communications-software",
      jobSummary: "calling, meetings, team chat and contact-center voice",
      integrationExtras: [
        { value: "teams", label: "Microsoft Teams" },
        { value: "zoom", label: "Zoom" },
        { value: "salesforce", label: "Salesforce" },
        { value: "hubspot", label: "HubSpot" },
      ],
    },
    "customer-service": {
      slug: "customer-service",
      shortName: "Customer Service",
      productNoun: "customer service",
      productNounPlural: "customer service products",
      softwarePhrase: "customer service software",
      bestSlug: "customer-service-software",
      jobSummary: "helpdesk, live chat, knowledge bases and omnichannel support",
      integrationExtras: [
        { value: "shopify", label: "Shopify" },
        { value: "salesforce", label: "Salesforce" },
        { value: "hubspot", label: "HubSpot" },
        { value: "teams", label: "Microsoft Teams" },
      ],
    },
    "project-management": {
      slug: "project-management",
      shortName: "Project Management",
      productNoun: "project management",
      productNounPlural: "project management products",
      softwarePhrase: "project management software",
      bestSlug: "project-management-software",
      jobSummary: "work OS, tasks, timelines and team delivery",
      integrationExtras: [
        { value: "github", label: "GitHub" },
        { value: "jira", label: "Jira" },
        { value: "teams", label: "Microsoft Teams" },
        { value: "figma", label: "Figma" },
      ],
    },
    hr: {
      slug: "hr",
      shortName: "HR",
      productNoun: "HR",
      productNounPlural: "HR products",
      softwarePhrase: "HR software",
      bestSlug: "hr-software",
      jobSummary:
        "ATS, core HRIS, payroll, frontline scheduling, time clocks and training",
      integrationExtras: [
        { value: "bamboohr", label: "BambooHR" },
        { value: "gusto", label: "Gusto" },
        { value: "quickbooks", label: "QuickBooks" },
        { value: "slack", label: "Slack" },
      ],
    },
    ecommerce: {
      slug: "ecommerce",
      shortName: "Ecommerce",
      productNoun: "ecommerce",
      productNounPlural: "ecommerce products",
      softwarePhrase: "ecommerce software",
      bestSlug: "ecommerce-software",
      jobSummary: "storefronts, checkout, omnichannel POS and dropshipping",
      integrationExtras: [
        { value: "shopify", label: "Shopify" },
        { value: "stripe", label: "Stripe" },
        { value: "paypal", label: "PayPal" },
        { value: "mailchimp", label: "Mailchimp" },
      ],
    },
    ai: {
      slug: "ai",
      shortName: "AI",
      productNoun: "AI",
      productNounPlural: "AI products",
      softwarePhrase: "AI software",
      bestSlug: "ai-software",
      jobSummary: "assistants, writing, image/video, agents and meeting tools",
      integrationExtras: [
        { value: "notion", label: "Notion" },
        { value: "slack", label: "Slack" },
        { value: "chrome", label: "Chrome" },
      ],
    },
    "it-development": {
      slug: "it-development",
      shortName: "IT & Development",
      productNoun: "IT",
      productNounPlural: "IT products",
      softwarePhrase: "IT and development software",
      bestSlug: "it-development-software",
      jobSummary: "ITSM, observability, hosting, source control and on-call",
      integrationExtras: [
        { value: "github", label: "GitHub" },
        { value: "jira", label: "Jira" },
        { value: "pagerduty", label: "PagerDuty" },
        { value: "aws", label: "AWS" },
      ],
    },
  };

export function categoryToolHref(
  slug: NewToolCategorySlug,
  kind: CategoryToolKind,
): string {
  return `/tools/${slug}-${kind}/`;
}

export function isNewToolCategorySlug(
  slug: string,
): slug is NewToolCategorySlug {
  return (NEW_TOOL_CATEGORY_SLUGS as readonly string[]).includes(slug);
}

/** Categories with dedicated (indexable) decision-tool packs. */
export function hasDedicatedCategoryTools(slug: string): boolean {
  return (
    slug === "crm" ||
    slug === "sales-intelligence" ||
    isNewToolCategorySlug(slug)
  );
}

/**
 * Dedicated tool path for a published category.
 * Returns null when no dedicated pack exists (never soft software-finder).
 */
export function categorySharedToolHref(
  slug: string,
  kind: CategoryToolKind,
): string | null {
  if (slug === "crm") return `/tools/crm-${kind}/`;
  if (slug === "sales-intelligence") {
    return `/tools/sales-intelligence-${kind}/`;
  }
  if (isNewToolCategorySlug(slug)) return categoryToolHref(slug, kind);
  return null;
}

/** Dedicated finder for a published category; null when none exists. */
export function categoryDecisionFinderHref(slug: string): string | null {
  return categorySharedToolHref(slug, "finder");
}

export function categoryDecisionCostHref(slug: string): string | null {
  return categorySharedToolHref(slug, "cost-calculator");
}

export function categoryShortName(slug: string): string {
  if (slug === "crm") return "CRM";
  if (slug === "sales-intelligence") return "Sales Intelligence";
  if (isNewToolCategorySlug(slug)) return CATEGORY_TOOL_META[slug].shortName;
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function categorySoftwarePhrase(slug: string): string {
  if (slug === "crm") return "CRM software";
  if (slug === "sales-intelligence") return "sales intelligence software";
  if (isNewToolCategorySlug(slug)) return CATEGORY_TOOL_META[slug].softwarePhrase;
  return `${categoryShortName(slug)} software`;
}

export function categoryFinderCtaLabel(slug: string): string {
  if (slug === "crm") return "Find My CRM";
  return `Find ${categoryShortName(slug)}`;
}

/** Best-page / related-tool seed paths for a category (indexable tools only). */
export function categoryRelatedToolPaths(slug: string): string[] {
  const kinds: CategoryToolKind[] = [
    "finder",
    "cost-calculator",
    "requirements-builder",
    "readiness-assessment",
  ];
  return kinds
    .map((kind) => categorySharedToolHref(slug, kind))
    .filter((href): href is string => Boolean(href));
}

export function categoryBestHref(slug: NewToolCategorySlug): string {
  return `/best/${CATEGORY_TOOL_META[slug].bestSlug}/`;
}

export function categoryHubHref(slug: NewToolCategorySlug): string {
  return `/categories/${slug}/`;
}

export function integrationOptionsFor(
  slug: NewToolCategorySlug,
): Array<{ value: string; label: string }> {
  const extras = CATEGORY_TOOL_META[slug].integrationExtras;
  const seen = new Set<string>();
  const merged: Array<{ value: string; label: string }> = [];
  for (const option of [...extras, ...BASE_INTEGRATIONS]) {
    if (seen.has(option.value)) continue;
    seen.add(option.value);
    merged.push(option);
  }
  return merged;
}

export function parseCategoryToolSlug(
  toolSlug: string,
): { categorySlug: NewToolCategorySlug; kind: CategoryToolKind } | null {
  const categories = [...NEW_TOOL_CATEGORY_SLUGS].sort(
    (a, b) => b.length - a.length,
  );
  const kinds = [...CATEGORY_TOOL_KINDS].sort((a, b) => b.length - a.length);
  for (const categorySlug of categories) {
    const prefix = `${categorySlug}-`;
    if (!toolSlug.startsWith(prefix)) continue;
    const rest = toolSlug.slice(prefix.length);
    for (const kind of kinds) {
      if (rest === kind) return { categorySlug, kind };
    }
  }
  return null;
}

function article(noun: string): string {
  return /^[aeiou]/i.test(noun) ? "an" : "a";
}

export function buildCategoryToolDefinitions() {
  const tools: Array<{
    id: string;
    slug: string;
    name: string;
    shortDescription: string;
    longDescription: string;
    type:
      | "finder"
      | "calculator"
      | "stack-builder"
      | "comparison"
      | "builder"
      | "scorecard"
      | "planner";
    categorySlugs: string[];
    status: "available" | "partial" | "coming-soon";
    href: string;
    icon: "finder" | "calculator" | "stack" | "compare" | "sparkles" | "builder" | "scorecard" | "planner" | "migration";
    primaryCta: string;
    secondaryCta?: string;
    secondaryHref?: string;
    features: string[];
    featured: boolean;
    popular: boolean;
    availabilityNote?: string;
  }> = [];
  for (const slug of NEW_TOOL_CATEGORY_SLUGS) {
    const meta = CATEGORY_TOOL_META[slug];
    const name = meta.shortName;
    const noun = meta.productNoun;
    const a = article(noun);

    tools.push(
      {
        id: `${slug}-finder`,
        slug: `${slug}-finder`,
        name: `${name} Finder`,
        shortDescription: `Answer a few questions and get ${noun} recommendations matched to your requirements.`,
        longDescription: `Answer a few questions about your team, primary job and must-haves. We'll shortlist ${meta.softwarePhrase} that fit — without affiliate ranking bias.`,
        type: "finder",
        categorySlugs: [slug],
        status: "available",
        href: categoryToolHref(slug, "finder"),
        icon: "finder",
        primaryCta: `Find ${name}`,
        secondaryCta: "How it works",
        secondaryHref: `${categoryToolHref(slug, "finder")}#finder-experience`,
        features: [
          "Personalized shortlist",
          "Fit-based recommendations",
          "Compare recommended tools",
          "No signup required",
        ],
        featured: true,
        popular: true,
      },
      {
        id: `${slug}-vendor-scorecard`,
        slug: `${slug}-vendor-scorecard`,
        name: `${name} Vendor Scorecard`,
        shortDescription: `Evaluate shortlisted ${noun} vendors against your requirements with evidence-backed research.`,
        longDescription: `Compare 2–5 ${meta.softwarePhrase} products using your decision profile, SoftwareGlimpse research, weighted criteria and your own demo evaluation — without affiliate influence.`,
        type: "scorecard",
        categorySlugs: [slug],
        status: "available",
        href: categoryToolHref(slug, "vendor-scorecard"),
        icon: "scorecard",
        primaryCta: "Create my scorecard",
        secondaryCta: "How it works",
        secondaryHref: `${categoryToolHref(slug, "vendor-scorecard")}#scorecard-workspace`,
        features: [
          "Weighted evaluation criteria",
          "Must-have gating",
          "Separate demo scores",
          "Export summary",
        ],
        featured: true,
        popular: true,
      },
      {
        id: `${slug}-demo-checklist-builder`,
        slug: `${slug}-demo-checklist-builder`,
        name: `${name} Demo Checklist Builder`,
        shortDescription: `Script the same ${noun} demo workflows for every vendor so comparisons stay fair.`,
        longDescription: `Build a reusable ${noun} demo agenda with moderator scripts, evidence rules and timed blocks — same script for every vendor, separate scoring.`,
        type: "builder",
        categorySlugs: [slug],
        status: "available",
        href: categoryToolHref(slug, "demo-checklist-builder"),
        icon: "builder",
        primaryCta: "Build Demo Checklist",
        secondaryCta: "How it works",
        secondaryHref: `${categoryToolHref(slug, "demo-checklist-builder")}#demo-checklist-workspace`,
        features: [
          "Scripted scenarios from requirements",
          "Time-budgeted agenda",
          "PDF + Excel workbook",
          "Scorecard handoff path",
        ],
        featured: true,
        popular: false,
      },
      {
        id: `${slug}-rfp-builder`,
        slug: `${slug}-rfp-builder`,
        name: `${name} RFP / Vendor Brief Builder`,
        shortDescription: `Turn ${noun} requirements into a vendor brief or formal RFP every shortlist can answer.`,
        longDescription: `Package scope, integrations, security questions and trial criteria into a comparable vendor pack — without inventing requirements.`,
        type: "builder",
        categorySlugs: [slug],
        status: "available",
        href: categoryToolHref(slug, "rfp-builder"),
        icon: "builder",
        primaryCta: "Build Vendor Brief",
        secondaryCta: "Create Formal RFP",
        secondaryHref: `${categoryToolHref(slug, "rfp-builder")}#rfp-workspace`,
        features: [
          `${name} scope catalog`,
          "Import Decision Profile",
          "PDF + Excel exports",
          "Scorecard handoff path",
        ],
        featured: true,
        popular: false,
      },
      {
        id: `${slug}-readiness-assessment`,
        slug: `${slug}-readiness-assessment`,
        name: `${name} Readiness Assessment`,
        shortDescription: `Diagnose selection vs implementation readiness before you buy ${a} ${noun} platform.`,
        longDescription: `Assess business case, process, requirements, data, ownership, budget, capacity and adoption. Get dual scores and a prioritized action plan.`,
        type: "builder",
        categorySlugs: [slug],
        status: "available",
        href: categoryToolHref(slug, "readiness-assessment"),
        icon: "builder",
        primaryCta: "Start assessment",
        secondaryCta: "How scoring works",
        secondaryHref: `${categoryToolHref(slug, "readiness-assessment")}#readiness-workspace`,
        features: [
          "Selection vs implementation scores",
          "Action plan & risk register",
          "PDF + Excel export",
          "No affiliate influence",
        ],
        featured: true,
        popular: false,
      },
      {
        id: `${slug}-cost-calculator`,
        slug: `${slug}-cost-calculator`,
        name: `${name} Cost Calculator`,
        shortDescription: `Estimate ${noun} software costs from verified public pricing.`,
        longDescription: `Compare verified list prices for ${meta.softwarePhrase}. Unknown, usage-based and custom quotes stay unknown — we never invent totals.`,
        type: "calculator",
        categorySlugs: [slug],
        status: "available",
        href: categoryToolHref(slug, "cost-calculator"),
        icon: "calculator",
        primaryCta: `Calculate ${name} Costs`,
        secondaryCta: "How it works",
        secondaryHref: categoryToolHref(slug, "cost-calculator"),
        features: [
          "Verified list pricing",
          "Unknowns stay unknown",
          "Custom quotes never $0",
          "No affiliate cost bias",
        ],
        featured: true,
        popular: false,
        availabilityNote:
          "Verified seat/subscription ladders where published · Usage and custom quotes stay quote-required",
      },
      {
        id: `${slug}-plan-selector`,
        slug: `${slug}-plan-selector`,
        name: `${name} Plan Selector`,
        shortDescription: `Already shortlisted ${a} ${noun} product? Find the lowest plan that meets your must-haves.`,
        longDescription: `Choose a product and answer how your team will use it. We recommend the lowest qualifying plan where a verified plan matrix exists — without invented match scores.`,
        type: "calculator",
        categorySlugs: [slug],
        status: "available",
        href: categoryToolHref(slug, "plan-selector"),
        icon: "calculator",
        primaryCta: "Find my plan",
        secondaryCta: "How it works",
        secondaryHref: `${categoryToolHref(slug, "plan-selector")}#how-it-works`,
        features: [
          "Lowest qualifying plan",
          "Must-have vs nice-to-have",
          "Upgrade drivers explained",
          "Verified plan matrices",
        ],
        featured: true,
        popular: false,
        availabilityNote:
          "Limited — only products with verified seat plan matrices",
      },
      {
        id: `${slug}-requirements-builder`,
        slug: `${slug}-requirements-builder`,
        name: `${name} Requirements Builder`,
        shortDescription: `Turn a vague ${noun} need into a structured, prioritized requirements profile.`,
        longDescription: `Answer questions about your business, jobs to be done, capabilities, integrations and budget. Export a reusable profile — without product rankings or affiliate influence.`,
        type: "builder",
        categorySlugs: [slug],
        status: "available",
        href: categoryToolHref(slug, "requirements-builder"),
        icon: "builder",
        primaryCta: "Build My Requirements",
        secondaryCta: "How it works",
        secondaryHref: `${categoryToolHref(slug, "requirements-builder")}#how-it-works`,
        features: [
          "Use case → capability → requirement",
          "Must-have / important / nice-to-have",
          "Shared profile with Finder & Cost Calculator",
          "Local export — no signup",
        ],
        featured: true,
        popular: false,
      },
    );
  }
  return tools;
}

export const ALL_SHARED_TOOL_CATEGORY_SLUGS = [
  "crm",
  "sales-intelligence",
  ...NEW_TOOL_CATEGORY_SLUGS,
] as const;
