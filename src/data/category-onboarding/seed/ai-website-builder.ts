import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * AI Website Builder subcategory definition v1.0 — under parent ai.
 * Generate sites or lightweight apps from prompts.
 */
export const aiWebsiteBuilderDefinition: CategoryDefinition =
  CategoryDefinitionSchema.parse({
    id: "cat-def-ai-website-builder-v1",
    slug: "ai-website-builder",
    name: "AI Website Builder",
    shortDescription:
      "Generate marketing sites or lightweight apps from prompts — distinct from general LLM assistants and traditional drag-and-drop builders.",
    parentSlug: "ai",
    aliases: [
      "AI website builder",
      "AI site generator",
      "AI app builder",
      "prompt-to-website software",
    ],
    lifecycle: "active",
    configVersion: "1.0.0",
    scope: {
      definition:
        "Software whose primary job is AI-assisted site or lightweight app generation from prompts — prompt-to-site builders, no-code AI app/agent builders, and AI app development platforms — not general-purpose LLM chat, coding IDEs, or traditional non-AI website builders unless prompt generation is the stated buyer job.",
      includes: [
        { id: "inc-prompt-site", label: "Prompt-to-website generation" },
        { id: "inc-agent-app", label: "No-code AI app / agent builders" },
        { id: "inc-ai-app-dev", label: "AI-assisted lightweight app development" },
        { id: "inc-publish", label: "Publish / deploy generated surfaces" },
      ],
      excludes: [
        {
          id: "exc-llm",
          label: "General-purpose LLM assistants without build UX",
          notes: "ChatGPT/Claude stay ai-primary unless site/app build is the job",
        },
        {
          id: "exc-traditional-builder",
          label: "Traditional drag-and-drop site builders without AI generation",
          notes: "Wix/Squarespace-class unless AI prompt build is primary",
        },
        {
          id: "exc-hosting-panel",
          label: "Hosting control panels",
          notes: "Plesk/cPanel stay IT-primary",
        },
      ],
      adjacentCategorySlugs: ["ai", "website-digital-presence", "it-development"],
      classificationNotes: [
        "Wegic is prompt-to-site — not an LLM-assistant or agent-builder peer",
        "MindStudio is no-code AI app/agent build — distinct from Wegic site generation",
        "Emergent is AI app development — distinct from both site and agent-builder jobs",
        "Never rank site generators, agent builders, and app dev platforms as one undifferentiated #1",
        "Use parent ai-finder with build-surface constraint — no dedicated subcategory finder",
      ],
    },
    features: [
      feat(
        "ai-site-generation",
        "AI site generation",
        "Generate marketing sites and landing pages from prompts.",
        "core",
        true,
        true,
      ),
      feat(
        "website-generation",
        "Website generation",
        "Prompt-to-page and multi-page site output.",
        "core",
        true,
        true,
      ),
      feat(
        "agent-builder",
        "Agent / app builder",
        "No-code builders for custom AI apps and agents.",
        "core",
        true,
        true,
      ),
      feat(
        "app-generation",
        "App generation",
        "Generate lightweight apps or prototypes from prompts.",
        "core",
        true,
        true,
      ),
      feat(
        "prompt-to-deploy",
        "Prompt to deploy",
        "Publish generated sites or apps to a live URL.",
        "important",
        true,
        true,
      ),
      feat(
        "integrations",
        "Integrations",
        "CMS, domains, APIs, and workflow connectors.",
        "important",
        true,
        true,
      ),
      feat(
        "customization",
        "Customization & editing",
        "Post-generation edit, branding, and layout controls.",
        "important",
        true,
        true,
      ),
    ],
    researchRequirements: [
      { domain: "identity", level: "required", featureSlugs: [] },
      {
        domain: "pricing",
        level: "required",
        featureSlugs: [],
        notes: "Free trial, starter monthly, and generation credit limits",
      },
      { domain: "plans", level: "required", featureSlugs: [] },
      {
        domain: "features",
        level: "required",
        featureSlugs: ["ai-site-generation", "agent-builder"],
      },
      { domain: "integrations", level: "required", featureSlugs: [] },
      { domain: "limits", level: "required", featureSlugs: [] },
      { domain: "free-trial", level: "recommended", featureSlugs: [] },
    ],
    editorialMethodology: {
      id: "methodology-ai-website-builder-v1",
      slug: "ai-website-builder-editorial",
      name: "AI Website Builder Editorial Methodology",
      version: "1.0.0",
      categorySlug: "ai-website-builder",
      description:
        "SoftwareGlimpse evaluates AI website and app builders on ease of use, build-surface job fit, generation quality, customization depth, deployment, integrations, scalability, and value. Products are ranked within build job clusters only.",
      criteria: [
        crit("ease-of-use", "Ease of use", "Prompt workflow and post-gen editing.", 12, 0, ["features:ai-site-generation"]),
        crit("build-job-fit", "Build job fit", "Fit to site vs agent vs app-dev cluster.", 14, 1, ["features:website-generation", "features:agent-builder"]),
        crit("generation-quality", "Generation quality", "Output fidelity from prompts.", 12, 2, ["features:ai-site-generation", "features:app-generation"]),
        crit("customization", "Customization", "Branding, layout, and edit depth.", 11, 3, ["features:customization"]),
        crit("deployment", "Deploy & publish", "Live URL, hosting, and export.", 11, 4, ["features:prompt-to-deploy"]),
        crit("integrations", "Integrations", "Domains, CMS, and API connectors.", 10, 5, ["integrations"]),
        crit("scalability", "Scalability", "Team seats, project limits, governance.", 8, 6, ["limits"]),
        crit("value-for-money", "Value for money", "Trial gates vs paid generation limits.", 11, 7, ["pricing", "plans"]),
        crit("agent-depth", "Agent / app depth", "Workflow logic and agent tooling.", 11, 8, ["features:agent-builder"]),
      ],
      notes: "Weights sum to 100. Score within build clusters. Affiliate economics excluded.",
    },
    comparisonCriteria: [
      cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
      cmp("free-trial", "Free trial", "factual", 1, "high"),
      cmp("site-gen", "AI site generation", "editorial", 2, "high", "ai-site-generation"),
      cmp("agent-build", "Agent / app builder", "editorial", 3, "high", "agent-builder"),
      cmp("app-gen", "App generation", "editorial", 4, "high", "app-generation"),
      cmp("deploy", "Deploy & publish", "editorial", 5, "medium", "prompt-to-deploy"),
      cmp("integrations", "Integrations", "editorial", 6, "medium"),
    ],
    pricingDimensions: [
      { id: "pd-awb-projects", slug: "projects", name: "Sites / projects", enginePrimitive: "usage", required: true },
      { id: "pd-awb-seats", slug: "seats", name: "Users", enginePrimitive: "per-seat", required: false },
      { id: "pd-awb-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
    ],
    pricingCapability: "PARTIAL",
    pricingCapabilityNotes: [
      "Project/credit and flat plan primitives supported; category TCO calculator not built",
    ],
    recommendationDimensions: [
      { id: "rd-awb-job", slug: "primary-job", name: "Primary job (site vs agent vs app dev)" },
      { id: "rd-awb-surface", slug: "build-surface", name: "Build surface (site, app, agent)" },
      { id: "rd-awb-audience", slug: "audience", name: "Solo founder vs product team" },
      { id: "rd-awb-budget", slug: "budget", name: "Budget" },
    ],
    finderReadiness: "NOT_READY",
    finderNotes: [
      "Use parent ai-finder with build-surface constraint — no dedicated subcategory finder UI",
      "Product fit enrichment routes through parent AI finder dimensions",
    ],
    useCases: [
      { slug: "ai-website-builder", name: "AI website builder", pageEligibility: "content-candidate" },
      { slug: "ai-agents", name: "AI agents / builders", pageEligibility: "content-candidate" },
      { slug: "ai-app-development", name: "AI app development", pageEligibility: "content-candidate" },
    ],
    audienceSlugs: ["founders", "marketing"],
    businessSizeSlugs: ["solo", "micro", "small-business", "mid-market"],
    businessTypeSlugs: ["agency", "saas", "startup"],
    seedProductSlugs: ["wegic", "mindstudio", "emergent"],
    queryAliases: [
      "AI website builder",
      "AI site generator",
      "AI app builder",
    ],
    requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
    optionalResearchDomains: ["free-trial"],
    pricingModelsSupported: ["per-seat", "usage", "flat", "credits", "hybrid"],
    notes: [
      "Tier 2 AI subcategory — May 2027 hub launch under parent ai",
      "Emergent category in affiliate expansion audit",
      "Do not invent product scores; do not auto-publish pages",
    ],
    supportingKnowledgeAreas: ["fundamentals", "selection", "pricing", "features"],
  });

function feat(
  slug: string,
  name: string,
  description: string,
  importance: "core" | "important" | "optional" | "specialist",
  comparisonRelevant: boolean,
  finderRelevant: boolean,
  researchGuidance?: string,
) {
  return {
    id: `feat-awb-${slug}`,
    slug,
    name,
    description,
    importance,
    comparisonRelevant,
    finderRelevant,
    researchGuidance,
    aliases: [],
  };
}

function crit(
  slug: string,
  name: string,
  description: string,
  weight: number,
  displayOrder: number,
  evidenceRequirements: string[],
) {
  return {
    id: `crit-awb-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "ai-website-builder",
    displayOrder,
  };
}

function cmp(
  slug: string,
  name: string,
  kind: "factual" | "editorial",
  displayOrder: number,
  decisionImportance: "high" | "medium" | "low",
  featureSlug?: string,
) {
  return {
    id: `cmp-awb-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
