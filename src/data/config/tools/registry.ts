/**
 * SoftwareGlimpse tools registry — single source of truth for /tools/ hub.
 * Status reflects real capability, not marketing aspiration.
 */

import {
  ALL_SHARED_TOOL_CATEGORY_SLUGS,
  buildCategoryToolDefinitions,
} from "./category-tool-meta";

export type ToolType =
  | "finder"
  | "calculator"
  | "stack-builder"
  | "comparison"
  | "builder"
  | "scorecard"
  | "planner";

export type ToolStatus = "available" | "partial" | "coming-soon";

export type ToolDefinition = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  type: ToolType;
  /** Category slugs this tool serves (empty = cross-category / future). */
  categorySlugs: string[];
  status: ToolStatus;
  /** Public href when a route exists; null if not routable yet. */
  href: string | null;
  icon:
    | "finder"
    | "calculator"
    | "stack"
    | "compare"
    | "sparkles"
    | "builder"
    | "scorecard"
    | "planner"
    | "migration";
  primaryCta: string;
  secondaryCta?: string;
  secondaryHref?: string;
  features: string[];
  featured: boolean;
  popular: boolean;
  /** Soft availability note shown for partial tools. */
  availabilityNote?: string;
};

export const TOOLS_REGISTRY: ToolDefinition[] = [
  {
    id: "crm-finder",
    slug: "crm-finder",
    name: "CRM Finder",
    shortDescription:
      "Answer a few questions and get CRM recommendations matched to your requirements.",
    longDescription:
      "Answer a few questions about your sales team, workflow and priorities. We'll narrow down the CRM products that best match your requirements.",
    type: "finder",
    categorySlugs: ["crm"],
    status: "available",
    href: "/tools/crm-finder/",
    icon: "finder",
    primaryCta: "Find My CRM",
    secondaryCta: "How it works",
    secondaryHref: "/tools/crm-finder/#how-it-works",
    features: [
      "Personalized shortlist",
      "Fit-based recommendations",
      "Compare recommended CRMs",
      "No signup required",
    ],
    featured: true,
    popular: true,
  },
  {
    id: "sales-intelligence-finder",
    slug: "sales-intelligence-finder",
    name: "Sales Intelligence Finder",
    shortDescription:
      "Match prospecting, enrichment and outreach tools to your outbound motion.",
    longDescription:
      "Answer a few questions about your team, primary job and capabilities. We'll shortlist sales intelligence products that fit — without affiliate ranking bias.",
    type: "finder",
    categorySlugs: ["sales-intelligence"],
    status: "available",
    href: "/tools/sales-intelligence-finder/",
    icon: "finder",
    primaryCta: "Find Sales Intelligence",
    secondaryCta: "How it works",
    secondaryHref: "/tools/sales-intelligence-finder/#finder-experience",
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
    id: "sales-intelligence-vendor-scorecard",
    slug: "sales-intelligence-vendor-scorecard",
    name: "Sales Intelligence Vendor Scorecard",
    shortDescription:
      "Evaluate shortlisted SI vendors on coverage, accuracy, enrichment, sync and credits.",
    longDescription:
      "Compare 2–5 sales intelligence products using your SI Decision Profile, SoftwareGlimpse research, weighted criteria and your own demo evaluation — without affiliate influence.",
    type: "scorecard",
    categorySlugs: ["sales-intelligence"],
    status: "available",
    href: "/tools/sales-intelligence-vendor-scorecard/",
    icon: "scorecard",
    primaryCta: "Create my scorecard",
    secondaryCta: "How it works",
    secondaryHref: "/tools/sales-intelligence-vendor-scorecard/#scorecard-workspace",
    features: [
      "Coverage & accuracy criteria",
      "Credit transparency weighting",
      "Separate demo scores",
      "Export summary",
    ],
    featured: true,
    popular: true,
  },
  {
    id: "sales-intelligence-demo-checklist-builder",
    slug: "sales-intelligence-demo-checklist-builder",
    name: "SI Demo Checklist Builder",
    shortDescription:
      "Script coverage, verification, CRM writeback and credit-burn demos for every SI vendor.",
    longDescription:
      "Build a reusable sales intelligence demo agenda with moderator scripts, evidence rules and timed blocks — same script for every vendor, separate scoring.",
    type: "builder",
    categorySlugs: ["sales-intelligence"],
    status: "available",
    href: "/tools/sales-intelligence-demo-checklist-builder/",
    icon: "builder",
    primaryCta: "Build Demo Checklist",
    secondaryCta: "How it works",
    secondaryHref:
      "/tools/sales-intelligence-demo-checklist-builder/#demo-checklist-workspace",
    features: [
      "200-account coverage test",
      "Credit burn transparency",
      "CRM writeback scenario",
      "PDF + Excel workbook",
    ],
    featured: true,
    popular: true,
  },
  {
    id: "sales-intelligence-rfp-builder",
    slug: "sales-intelligence-rfp-builder",
    name: "SI RFP / Vendor Brief Builder",
    shortDescription:
      "Turn SI requirements into a vendor brief or formal RFP every shortlist can answer.",
    longDescription:
      "Package coverage regions, enrichment fields, CRM integrations, credits/export rights, DPA and trial criteria into a comparable vendor pack — without inventing requirements.",
    type: "builder",
    categorySlugs: ["sales-intelligence"],
    status: "available",
    href: "/tools/sales-intelligence-rfp-builder/",
    icon: "builder",
    primaryCta: "Build Vendor Brief",
    secondaryCta: "Create Formal RFP",
    secondaryHref: "/tools/sales-intelligence-rfp-builder/#rfp-workspace",
    features: [
      "SI scope catalog",
      "Import Decision Profile",
      "PDF + Excel exports",
      "Scorecard handoff path",
    ],
    featured: true,
    popular: true,
  },
  {
    id: "sales-intelligence-readiness-assessment",
    slug: "sales-intelligence-readiness-assessment",
    name: "SI Readiness Assessment",
    shortDescription:
      "Diagnose selection vs adoption readiness before you buy sales intelligence.",
    longDescription:
      "Assess ICP clarity, CRM SoR readiness, data ownership, compliance ownership, volume/credits, enrich vs list-buy, outbound maturity and success metrics. Get dual scores and a prioritized action plan.",
    type: "builder",
    categorySlugs: ["sales-intelligence"],
    status: "available",
    href: "/tools/sales-intelligence-readiness-assessment/",
    icon: "builder",
    primaryCta: "Start assessment",
    secondaryCta: "How scoring works",
    secondaryHref:
      "/tools/sales-intelligence-readiness-assessment/#readiness-workspace",
    features: [
      "Selection vs implementation scores",
      "8 SI readiness dimensions",
      "Action plan & risk register",
      "PDF + Excel export",
    ],
    featured: true,
    popular: true,
  },
  {
    id: "crm-vendor-scorecard",
    slug: "crm-vendor-scorecard",
    name: "CRM Vendor Scorecard",
    shortDescription:
      "Evaluate shortlisted CRM vendors against your requirements with evidence-backed research.",
    longDescription:
      "Compare 2–5 shortlisted CRM products using your CRMDecisionProfile, SoftwareGlimpse recommendations, weighted criteria, and your own demo or trial evaluation.",
    type: "scorecard",
    categorySlugs: ["crm"],
    status: "available",
    href: "/tools/crm-vendor-scorecard/",
    icon: "scorecard",
    primaryCta: "Create my scorecard",
    secondaryCta: "How it works",
    secondaryHref: "/tools/crm-vendor-scorecard/#how-the-scorecard-works",
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
    id: "crm-cost-calculator",
    slug: "crm-cost-calculator",
    name: "CRM Cost Calculator",
    shortDescription:
      "Estimate what CRM software could cost your team from public pricing.",
    longDescription:
      "Estimate what CRM software could actually cost your business based on team size, plan and billing period.",
    type: "calculator",
    categorySlugs: ["crm"],
    status: "available",
    href: "/tools/crm-cost-calculator/",
    icon: "calculator",
    primaryCta: "Calculate CRM Costs",
    secondaryCta: "How it works",
    secondaryHref: "/tools/crm-cost-calculator/",
    features: [
      "Compare plans",
      "Estimate team costs",
      "Monthly vs annual pricing",
      "Verified pricing data",
    ],
    featured: true,
    popular: false,
  },
  {
    id: "sales-intelligence-cost-calculator",
    slug: "sales-intelligence-cost-calculator",
    name: "Sales Intelligence Cost Calculator",
    shortDescription:
      "Estimate seat-based SI costs from verified public pricing — credits stay quote-required.",
    longDescription:
      "Compare verified seat and subscription list prices for sales intelligence tools. Credit packs and custom quotes stay unknown — we never invent credit dollar totals.",
    type: "calculator",
    categorySlugs: ["sales-intelligence"],
    status: "partial",
    href: "/tools/sales-intelligence-cost-calculator/",
    icon: "calculator",
    primaryCta: "Calculate SI Costs",
    secondaryCta: "How it works",
    secondaryHref: "/tools/sales-intelligence-cost-calculator/",
    features: [
      "Verified seat pricing",
      "Credits marked unknown",
      "Custom quotes never $0",
      "No affiliate cost bias",
    ],
    featured: true,
    popular: false,
    availabilityNote:
      "Verified seat/subscription ladders where published · Credits and custom quotes stay quote-required",
  },
  {
    id: "crm-plan-selector",
    slug: "crm-plan-selector",
    name: "CRM Plan Selector",
    shortDescription:
      "Already shortlisted a CRM? Find the lowest plan that meets your must-haves.",
    longDescription:
      "Choose a CRM and answer how your team will use it. We recommend the lowest qualifying plan, show what forces upgrades, estimate seat costs, and surface unknowns — without invented match scores.",
    type: "calculator",
    categorySlugs: ["crm"],
    status: "available",
    href: "/tools/crm-plan-selector/",
    icon: "calculator",
    primaryCta: "Find my plan",
    secondaryCta: "How it works",
    secondaryHref: "/tools/crm-plan-selector/#how-it-works",
    features: [
      "Lowest qualifying plan",
      "Must-have vs nice-to-have",
      "Upgrade drivers explained",
      "Verified plan matrices",
    ],
    featured: true,
    popular: true,
  },
  {
    id: "sales-intelligence-plan-selector",
    slug: "sales-intelligence-plan-selector",
    name: "Sales Intelligence Plan Selector",
    shortDescription:
      "Find the lowest verified SI plan for your must-haves — credit packs stay out of the ladder.",
    longDescription:
      "Only products with verified seat plan matrices are selectable. Credit packs and quote-only pricing link to pricing notes and product hubs instead of invented tiers.",
    type: "calculator",
    categorySlugs: ["sales-intelligence"],
    status: "partial",
    href: "/tools/sales-intelligence-plan-selector/",
    icon: "calculator",
    primaryCta: "Find my plan",
    secondaryCta: "How it works",
    secondaryHref: "/tools/sales-intelligence-plan-selector/#how-it-works",
    features: [
      "Verified seat matrices only",
      "Credit packs excluded",
      "Links to pricing hubs",
      "No invented match scores",
    ],
    featured: true,
    popular: false,
    availabilityNote:
      "Limited — only products with verified seat plan matrices",
  },
  {
    id: "crm-tco-calculator",
    slug: "crm-tco-calculator",
    name: "CRM TCO Calculator",
    shortDescription:
      "Estimate total CRM ownership cost — software plus implementation, migration, training and admin.",
    longDescription:
      "Calculate the true total cost of CRM ownership over 1–5 years. Reuses licence pricing and clearly separates verified costs from your assumptions. Unknown costs stay unknown.",
    type: "calculator",
    categorySlugs: ["crm"],
    status: "available",
    href: "/tools/crm-tco-calculator/",
    icon: "calculator",
    primaryCta: "Calculate CRM TCO",
    secondaryCta: "How it works",
    secondaryHref: "/tools/crm-tco-calculator/#how-crm-tco-is-calculated",
    features: [
      "Software + ownership costs",
      "Known vs unknown TCO",
      "Seat growth scenarios",
      "Vendor cost comparison",
    ],
    featured: true,
    popular: true,
  },
  {
    id: "crm-roi-calculator",
    slug: "crm-roi-calculator",
    name: "CRM ROI Calculator",
    shortDescription:
      "Estimate CRM ROI from your costs, productivity assumptions and scenario outcomes — without invented vendor claims.",
    longDescription:
      "Model the financial case for CRM over 1–3 years. Separate verified, estimated and scenario benefits, test conservative/base/upside cases, and export results into your CRM business case.",
    type: "calculator",
    categorySlugs: ["crm"],
    status: "available",
    href: "/tools/crm-roi-calculator/",
    icon: "calculator",
    primaryCta: "Calculate CRM ROI",
    secondaryCta: "Estimate CRM Costs",
    secondaryHref: "/tools/crm-cost-calculator/",
    features: [
      "Productivity + cost avoidance",
      "Explicit assumption quality",
      "Scenario comparison",
      "PDF & Excel export",
    ],
    featured: true,
    popular: true,
  },
  {
    id: "crm-readiness-assessment",
    slug: "crm-readiness-assessment",
    name: "CRM Readiness Assessment",
    shortDescription:
      "Diagnose selection vs implementation readiness before you talk to CRM vendors.",
    longDescription:
      "Assess 14 readiness dimensions across business case, process, requirements, data, ownership, budget, capacity and adoption. Get dual scores, critical blockers, a prioritized action plan and personalized next tools — deterministic, not a quiz percentage.",
    type: "builder",
    categorySlugs: ["crm"],
    status: "available",
    href: "/tools/crm-readiness-assessment/",
    icon: "builder",
    primaryCta: "Start assessment",
    secondaryCta: "How scoring works",
    secondaryHref: "/tools/crm-readiness-assessment/#how-scoring-works",
    features: [
      "Selection vs implementation scores",
      "14 readiness dimensions",
      "Action plan & risk register",
      "PDF + Excel export",
    ],
    featured: true,
    popular: true,
  },
  {
    id: "crm-adoption-health-assessment",
    slug: "crm-adoption-health-assessment",
    name: "CRM Adoption / Health Assessment",
    shortDescription:
      "Diagnose whether people work in the live CRM and whether the system is healthy enough to trust.",
    longDescription:
      "Score people adoption versus system health from eight diagnostic questions. Results stay on this device. Not a vendor ranking.",
    type: "builder",
    categorySlugs: ["crm"],
    status: "available",
    href: "/tools/crm-adoption-health-assessment/",
    icon: "builder",
    primaryCta: "Start diagnostic",
    secondaryCta: "How it works",
    secondaryHref: "/tools/crm-adoption-health-assessment/#results",
    features: [
      "People vs system scores",
      "Eight post-purchase questions",
      "Local answers only",
      "Links to optimization checklist",
    ],
    featured: true,
    popular: false,
  },
  {
    id: "crm-multi-compare",
    slug: "crm-multi-compare",
    name: "CRM Multi-product compare",
    shortDescription:
      "Select two to four published CRMs and open existing pairwise comparisons — no invented 3-way winner.",
    longDescription:
      "Assemble a shortlist matrix from catalogue fit notes and researched head-to-heads. Weighted scoring stays on the Vendor Scorecard. Affiliate relationships never set order.",
    type: "comparison",
    categorySlugs: ["crm"],
    status: "available",
    href: "/tools/crm-multi-compare/",
    icon: "compare",
    primaryCta: "Build matrix",
    secondaryCta: "Comparisons hub",
    secondaryHref: "/compare/",
    features: [
      "2–4 CRM shortlist",
      "Existing pairwise links",
      "No invented overall winner",
      "Handoff to Vendor Scorecard",
    ],
    featured: true,
    popular: false,
  },
  {
    id: "crm-requirements-builder",
    slug: "crm-requirements-builder",
    name: "CRM Requirements Builder",
    shortDescription:
      "Turn a vague CRM need into a structured, prioritized requirements profile.",
    longDescription:
      "Answer questions about your business, use cases, requirements, integrations and budget. Export a reusable profile for Finder, cost and comparison — without product rankings or affiliate influence.",
    type: "builder",
    categorySlugs: ["crm"],
    status: "available",
    href: "/tools/crm-requirements-builder/",
    icon: "builder",
    primaryCta: "Build My Requirements",
    secondaryCta: "How it works",
    secondaryHref: "/tools/crm-requirements-builder/#how-it-works",
    features: [
      "Use case → capability → requirement → feature",
      "Must-have / important / nice-to-have priorities",
      "Shared profile with Finder & Cost Calculator",
      "Local export — no signup",
    ],
    featured: true,
    popular: true,
  },
  {
    id: "sales-intelligence-requirements-builder",
    slug: "sales-intelligence-requirements-builder",
    name: "Sales Intelligence Requirements Builder",
    shortDescription:
      "Turn a vague prospecting / enrichment need into a prioritized SI requirements profile.",
    longDescription:
      "Answer questions about outbound use cases, data coverage, CRM sync, compliance posture and budget. Export a reusable profile — without product rankings or affiliate influence.",
    type: "builder",
    categorySlugs: ["sales-intelligence"],
    status: "available",
    href: "/tools/sales-intelligence-requirements-builder/",
    icon: "builder",
    primaryCta: "Build My Requirements",
    secondaryCta: "How it works",
    secondaryHref:
      "/tools/sales-intelligence-requirements-builder/#how-it-works",
    features: [
      "Prospecting → enrichment → outreach requirements",
      "Must-have / important / nice-to-have priorities",
      "Separate SI profile storage from CRM tools",
      "Local export — no signup",
    ],
    featured: true,
    popular: false,
  },
  {
    id: "crm-rfp-builder",
    slug: "crm-rfp-builder",
    name: "CRM RFP / Vendor Brief Builder",
    shortDescription:
      "Turn CRM requirements into a structured vendor brief or formal RFP every shortlisted vendor can answer consistently.",
    longDescription:
      "Build a lightweight vendor brief or formal CRM RFP from your requirements, integrations, implementation needs, security questions and pricing assumptions. Export PDF, Excel and Markdown — without inventing requirements or scoring vendors.",
    type: "builder",
    categorySlugs: ["crm"],
    status: "available",
    href: "/tools/crm-rfp-builder/",
    icon: "builder",
    primaryCta: "Build Vendor Brief",
    secondaryCta: "Create Formal RFP",
    secondaryHref: "/tools/crm-rfp-builder/#rfp-workspace",
    features: [
      "Vendor Brief or Formal RFP modes",
      "Import Requirements Builder profile",
      "PDF + Excel vendor response workbook",
      "Handoff path to Vendor Scorecard",
    ],
    featured: true,
    popular: true,
  },
  {
    id: "crm-demo-checklist-builder",
    slug: "crm-demo-checklist-builder",
    name: "CRM Demo Checklist Builder",
    shortDescription:
      "Build a reusable CRM demo agenda and evaluation workbook so every vendor demonstrates the same workflows.",
    longDescription:
      "Turn requirements into structured demo scenarios, moderator scripts, evidence rules and a timed agenda. Score vendors separately while keeping one shared script — then hand results to the Vendor Scorecard without silent overwrite.",
    type: "builder",
    categorySlugs: ["crm"],
    status: "available",
    href: "/tools/crm-demo-checklist-builder/",
    icon: "builder",
    primaryCta: "Build Demo Checklist",
    secondaryCta: "How it works",
    secondaryHref: "/tools/crm-demo-checklist-builder/#how-it-works",
    features: [
      "Scripted scenarios from requirements",
      "Time-budgeted agenda",
      "PDF + Excel evaluation workbook",
      "Scorecard handoff with evidence states",
    ],
    featured: true,
    popular: true,
  },
  {
    id: "crm-implementation-planner",
    slug: "crm-implementation-planner",
    name: "CRM Implementation Planner",
    shortDescription:
      "Turn a selected CRM into a structured rollout plan with phases, tasks, risks and go-live checklist.",
    longDescription:
      "Build a realistic CRM implementation plan from your requirements, migration scope, integrations and target go-live. Phases and tasks are generated from transparent planning rules — not affiliate influence or invented vendor timelines.",
    type: "planner",
    categorySlugs: ["crm"],
    status: "available",
    href: "/tools/crm-implementation-planner/",
    icon: "planner",
    primaryCta: "Build implementation plan",
    secondaryCta: "How it works",
    secondaryHref: "/tools/crm-implementation-planner/#how-the-implementation-planner-works",
    features: [
      "Phases, tasks and dependencies",
      "Migration & integration planning",
      "Risks and readiness gaps",
      "Exportable checklists",
    ],
    featured: true,
    popular: true,
  },
  {
    id: "crm-migration-cost-calculator",
    slug: "crm-migration-cost-calculator",
    name: "CRM Migration Cost Calculator",
    shortDescription:
      "Estimate CRM migration cost across data prep, mapping, integrations, internal effort, testing and contingency — without invented vendor pricing.",
    longDescription:
      "Model the cost of migrating from spreadsheets or an existing CRM into a new platform. Separate external services, internal labour, tooling and risk, then export into your CRM business case, TCO or ROI model.",
    type: "calculator",
    categorySlugs: ["crm"],
    status: "available",
    href: "/tools/crm-migration-cost-calculator/",
    icon: "calculator",
    primaryCta: "Estimate migration cost",
    secondaryCta: "Plan my field mapping",
    secondaryHref: "/resources/crm-field-mapping-template/",
    features: [
      "Internal + external cost model",
      "Complexity made explicit",
      "PDF & Excel export",
      "No invented vendor pricing",
    ],
    featured: true,
    popular: true,
  },
  {
    id: "crm-migration-planner",
    slug: "crm-migration-planner",
    name: "CRM Migration Planner",
    shortDescription:
      "Plan CRM data migration with source inventory, field mapping, user and pipeline mapping, test and cutover.",
    longDescription:
      "Inventory source systems, map fields and owners, plan cleaning, test migration, validation and cutover. Product-specific import guidance only where verified — SoftwareGlimpse plans the migration but does not execute it.",
    type: "planner",
    categorySlugs: ["crm"],
    status: "available",
    href: "/tools/crm-migration-planner/",
    icon: "migration",
    primaryCta: "Build migration plan",
    secondaryCta: "How it works",
    secondaryHref: "/tools/crm-migration-planner/#how-the-migration-planner-works",
    features: [
      "Field & user mapping workspace",
      "Pipeline and cleaning plans",
      "Test, validation and cutover",
      "Handoff to Implementation & TCO",
    ],
    featured: true,
    popular: true,
  },
  {
    id: "software-stack-builder",
    slug: "software-stack-builder",
    name: "Software Stack Builder",
    shortDescription:
      "Plan the combination of tools your business needs across published software categories.",
    longDescription:
      "Build a software stack around your business needs instead of choosing tools one at a time.",
    type: "stack-builder",
    categorySlugs: [...ALL_SHARED_TOOL_CATEGORY_SLUGS],
    status: "partial",
    href: "/tools/software-stack-builder/",
    icon: "stack",
    primaryCta: "Build My Stack",
    secondaryCta: "How it works",
    secondaryHref: "/tools/software-stack-builder/",
    features: [
      "5-step guided wizard",
      "Identify missing software",
      "Avoid overlapping tools",
      "Plan your stack",
    ],
    featured: true,
    popular: false,
    availabilityNote:
      "Category routing live for every published category · Cross-stack scoring still limited",
  },
  {
    id: "software-finder",
    slug: "software-finder",
    name: "Software Finder",
    shortDescription:
      "Not sure what type of software you need? Pick a category finder to get started.",
    longDescription:
      "Choose a category finder — CRM, sales intelligence, HR, project management, and more. Each finder uses the same research, with no affiliate ranking bias.",
    type: "finder",
    categorySlugs: [...ALL_SHARED_TOOL_CATEGORY_SLUGS],
    status: "available",
    href: "/tools/software-finder/",
    icon: "sparkles",
    primaryCta: "Choose a category",
    features: [
      "Category finders for every published category",
      "Business-goal matching within each finder",
      "Links to reviews and comparisons",
    ],
    featured: false,
    popular: false,
  },
  {
    id: "software-cost-calculator",
    slug: "software-cost-calculator",
    name: "Software Cost Calculator",
    shortDescription:
      "Choose a category cost calculator for CRM, sales intelligence, and every published category.",
    longDescription:
      "Pick a category cost calculator. Full cross-stack totals are still on the roadmap.",
    type: "calculator",
    categorySlugs: [...ALL_SHARED_TOOL_CATEGORY_SLUGS],
    status: "partial",
    href: "/tools/software-cost-calculator/",
    icon: "calculator",
    primaryCta: "Choose a calculator",
    features: [
      "Category calculators for published categories",
      "Verified list pricing only",
      "No affiliate cost bias",
    ],
    featured: false,
    popular: false,
    availabilityNote:
      "Category calculators live · Cross-stack totals coming",
  },
  ...buildCategoryToolDefinitions(),
];

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find((t) => t.id === id);
}

export function getToolsByStatus(status: ToolStatus): ToolDefinition[] {
  return TOOLS_REGISTRY.filter((t) => t.status === status);
}

export function getFeaturedTools(): ToolDefinition[] {
  return TOOLS_REGISTRY.filter((t) => t.featured);
}

/** Routable tools that can receive hub inbound (available or partial). */
export function getRoutableTools(categorySlug?: string): ToolDefinition[] {
  return TOOLS_REGISTRY.filter((tool) => {
    if (!tool.href) return false;
    if (tool.status === "coming-soon") return false;
    if (!categorySlug) return true;
    return tool.categorySlugs.includes(categorySlug);
  });
}
