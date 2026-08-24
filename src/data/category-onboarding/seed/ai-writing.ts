import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * AI Writing subcategory definition v1.0 — under parent ai.
 * Draft, rewrite, and optimize copy with AI writing assistants.
 */
export const aiWritingDefinition: CategoryDefinition =
  CategoryDefinitionSchema.parse({
    id: "cat-def-ai-writing-v1",
    slug: "ai-writing",
    name: "AI Writing",
    shortDescription:
      "Draft, rewrite, and optimize copy with AI — paraphrasing, grammar, and marketing content tools distinct from general LLM chat.",
    parentSlug: "ai",
    aliases: [
      "AI writing software",
      "AI writing assistant",
      "AI paraphrasing tool",
      "AI copywriting software",
    ],
    lifecycle: "active",
    configVersion: "1.0.0",
    scope: {
      definition:
        "Software whose primary job is AI-assisted writing — paraphrasing, grammar, summarisation, marketing copy, and GEO/AEO content — not general-purpose LLM chat, coding assistants, or image generators unless writing is the stated buyer job.",
      includes: [
        { id: "inc-paraphrase", label: "Paraphrasing & rewriting" },
        { id: "inc-grammar", label: "Grammar & clarity editing" },
        { id: "inc-copy", label: "Marketing copy generation" },
        { id: "inc-geo", label: "GEO / AI search content optimization" },
      ],
      excludes: [
        {
          id: "exc-llm",
          label: "General-purpose LLM assistants without writing-first UX",
          notes: "ChatGPT/Claude stay ai-primary unless writing is the job",
        },
        {
          id: "exc-presentations",
          label: "Prompt-to-deck presentation tools",
          notes: "Prefer ai-presentations cluster (Gamma)",
        },
        {
          id: "exc-ad-creative",
          label: "Paid-media ad creative generators",
          notes: "Prefer ai-ad-creative cluster",
        },
      ],
      adjacentCategorySlugs: ["ai", "marketing"],
      classificationNotes: [
        "QuillBot is paraphrasing/grammar-first — not an LLM-assistant peer",
        "Writesonic is GEO/AEO + marketing copy — distinct from QuillBot grammar workflows",
        "Never rank paraphrasing tools and GEO content platforms as one undifferentiated #1",
        "Use parent ai-finder with ai-writing use-case tag — no dedicated subcategory finder",
      ],
    },
    features: [
      feat(
        "paraphrasing",
        "Paraphrasing & rewriting",
        "Rephrase sentences and passages with tone controls.",
        "core",
        true,
        true,
      ),
      feat(
        "grammar-clarity",
        "Grammar & clarity",
        "Grammar, spelling, and readability suggestions.",
        "core",
        true,
        true,
      ),
      feat(
        "copy-generation",
        "Copy generation",
        "Blog, ad, and landing copy drafts from prompts.",
        "core",
        true,
        true,
      ),
      feat(
        "geo-aeo-content",
        "GEO / AEO content",
        "AI search visibility and answer-engine optimization.",
        "important",
        true,
        true,
      ),
      feat(
        "summarisation",
        "Summarisation",
        "Condense long text into summaries.",
        "important",
        true,
        true,
      ),
      feat(
        "tone-style",
        "Tone & style controls",
        "Adjust formality, voice, and audience.",
        "important",
        true,
        true,
      ),
      feat(
        "writing-assist",
        "Writing & paraphrasing",
        "Shared writing primitives for landscape scoring.",
        "specialist",
        true,
        false,
      ),
      feat(
        "integrations",
        "Integrations",
        "Browser, docs, and CMS connectors.",
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
        notes: "Free tier, Premium annual, and word/credit limits",
      },
      { domain: "plans", level: "required", featureSlugs: [] },
      {
        domain: "features",
        level: "required",
        featureSlugs: ["paraphrasing", "copy-generation"],
      },
      { domain: "integrations", level: "required", featureSlugs: [] },
      { domain: "limits", level: "required", featureSlugs: [] },
      { domain: "free-trial", level: "recommended", featureSlugs: [] },
    ],
    editorialMethodology: {
      id: "methodology-ai-writing-v1",
      slug: "ai-writing-editorial",
      name: "AI Writing Editorial Methodology",
      version: "1.0.0",
      categorySlug: "ai-writing",
      description:
        "SoftwareGlimpse evaluates AI writing platforms on ease of use, writing job fit, paraphrasing depth, copy quality, GEO/AEO capabilities, integrations, scalability, and value. Products are ranked within writing job clusters only.",
      criteria: [
        crit("ease-of-use", "Ease of use", "Writer workflow and browser/doc integration.", 12, 0, ["features:paraphrasing"]),
        crit("writing-job-fit", "Writing job fit", "Fit to paraphrasing vs GEO/copy cluster.", 15, 1, ["features:paraphrasing", "features:copy-generation"]),
        crit("paraphrasing-depth", "Paraphrasing depth", "Modes, tone, and rewrite quality.", 12, 2, ["features:paraphrasing", "features:tone-style"]),
        crit("grammar-clarity", "Grammar & clarity", "Proofreading and readability suggestions.", 10, 3, ["features:grammar-clarity"]),
        crit("copy-generation", "Copy generation", "Marketing and long-form draft quality.", 12, 4, ["features:copy-generation"]),
        crit("geo-aeo", "GEO / AEO", "AI search visibility and content optimization.", 10, 5, ["features:geo-aeo-content"]),
        crit("integrations", "Integrations", "Browser, docs, and workflow connectors.", 10, 6, ["integrations"]),
        crit("scalability", "Scalability", "Team seats, word limits, and governance.", 8, 7, ["limits"]),
        crit("value-for-money", "Value for money", "Free tier fairness vs Premium gates.", 11, 8, ["pricing", "plans"]),
      ],
      notes: "Weights sum to 100. Score within writing clusters. Affiliate economics excluded.",
    },
    comparisonCriteria: [
      cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
      cmp("free-tier", "Free tier", "factual", 1, "high"),
      cmp("paraphrasing", "Paraphrasing", "editorial", 2, "high", "paraphrasing"),
      cmp("grammar", "Grammar & clarity", "editorial", 3, "high", "grammar-clarity"),
      cmp("copy", "Copy generation", "editorial", 4, "high", "copy-generation"),
      cmp("geo-aeo", "GEO / AEO", "editorial", 5, "medium", "geo-aeo-content"),
      cmp("integrations", "Integrations", "editorial", 6, "medium"),
    ],
    pricingDimensions: [
      { id: "pd-aw-words", slug: "words", name: "Words / credits", enginePrimitive: "usage", required: true },
      { id: "pd-aw-seats", slug: "seats", name: "Users", enginePrimitive: "per-seat", required: false },
      { id: "pd-aw-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
    ],
    pricingCapability: "PARTIAL",
    pricingCapabilityNotes: [
      "Word/credit and flat Premium primitives supported; category TCO calculator not built",
    ],
    recommendationDimensions: [
      { id: "rd-aw-job", slug: "primary-job", name: "Primary job (paraphrasing vs GEO copy)" },
      { id: "rd-aw-volume", slug: "volume", name: "Writing volume / word limits" },
      { id: "rd-aw-audience", slug: "audience", name: "Solo writer vs marketing team" },
      { id: "rd-aw-budget", slug: "budget", name: "Budget" },
    ],
    finderReadiness: "NOT_READY",
    finderNotes: [
      "Use parent ai-finder with ai-writing use-case tag — no dedicated subcategory finder UI",
      "Product fit enrichment routes through parent AI finder dimensions",
    ],
    useCases: [
      { slug: "ai-writing", name: "AI writing", pageEligibility: "content-candidate" },
      { slug: "paraphrasing", name: "Paraphrasing & rewriting", pageEligibility: "content-candidate" },
      { slug: "ai-copywriting", name: "AI copywriting", pageEligibility: "content-candidate" },
    ],
    audienceSlugs: ["marketing", "founders"],
    businessSizeSlugs: ["solo", "micro", "small-business", "mid-market"],
    businessTypeSlugs: ["agency", "saas", "startup"],
    seedProductSlugs: ["quillbot", "writesonic"],
    queryAliases: [
      "AI writing software",
      "AI writing assistant",
      "AI paraphrasing tool",
    ],
    requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
    optionalResearchDomains: ["free-trial"],
    pricingModelsSupported: ["per-seat", "usage", "flat", "credits", "hybrid"],
    notes: [
      "Tier 2 AI subcategory — May 2027 hub launch under parent ai",
      "Largest AI affiliate sub-cluster in expansion audit",
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
    id: `feat-aw-${slug}`,
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
    id: `crit-aw-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "ai-writing",
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
    id: `cmp-aw-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
