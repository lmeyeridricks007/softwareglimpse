/**
 * Affiliate gap AI pack — aira, emergent, rank-prompt.
 */
import { expandAiProduct } from "./ai-compact-expand.mjs";
import { AI_CRITERIA } from "./ai-onboard-runtime.mjs";
import { VERIFIED_AT, scores, contactSalesPlanEntry } from "./affiliate-gap-shared.mjs";

export { VERIFIED_AT };

const S = (overrides) => scores(AI_CRITERIA, overrides);

const COMPACT = [
  {
    slug: "aira",
    name: "Aira",
    company: "Aira",
    website: "https://aira.io",
    domain: "aira.io",
    pricingUrl: "https://aira.io/pricing",
    membershipRole: "adjacent",
    jobCluster: "ai-automation",
    adjacentNote:
      "Adjacent to general AI: Aira is digital accessibility testing/monitoring — not LLM writing or image generation.",
    shortDescription:
      "Aira is an AI-powered digital accessibility platform — automated accessibility testing, monitoring, and remediation guidance for websites and apps. Tiered/quote pricing (2026-08-19 — confirm on aira.io). AI-adjacent governance job, not general LLM writing.",
    vendorPositioning: "AI accessibility intelligence — find, fix, and monitor digital accessibility issues.",
    pricingModel: "tiered",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 14,
    pricingNotes: "Confirm tiers on aira.io/pricing. Affiliate economics excluded.",
    pricingSummary: "Trial available — confirm seat/site pricing on vendor site.",
    plans: contactSalesPlanEntry("Aira", { hasFreeTrial: true, trialDays: 14 }),
    featureOverrides: {
      "agent-builder": "not-supported",
      "writing-assist": "not-supported",
      "website-generation": "limited",
      "workflow-automation": "supported",
      "analytics-reporting": "supported",
    },
    scores: S({ "ai-job-fit": 8, "governance-privacy": 8, "output-quality": 7 }),
    bestFor: ["Teams needing automated accessibility monitoring", "Compliance-aware web/product teams"],
    notIdealFor: ["General AI writing buyers (Writesonic)", "Image generation use cases"],
    pros: ["Accessibility-specific AI", "Monitoring + remediation guidance", "Compliance focus"],
    cons: ["Niche accessibility scope", "Not general-purpose AI suite", "Quote/tier pricing"],
    keyFeatures: ["Accessibility scanning", "Issue monitoring", "Remediation guidance"],
    whoShouldChoose: "Choose Aira when digital accessibility compliance is the AI job.",
    whoShouldConsiderAlternatives: "Compare Writesonic for content generation AI.",
    limitations: ["Accessibility niche — not general AI writing platform"],
  },
  {
    slug: "emergent",
    name: "Emergent",
    company: "Emergent Labs Inc.",
    website: "https://emergent.sh",
    domain: "emergent.sh",
    pricingUrl: "https://emergent.sh/pricing",
    membershipRole: "primary",
    jobCluster: "agent-builder",
    shortDescription:
      "Emergent is an AI app development platform — build and deploy AI agents and lightweight apps from natural language prompts with hosting. Usage/credit pricing (2026-08-19 — confirm on emergent.sh).",
    vendorPositioning: "Build AI apps and agents fast — prompt-to-product for developers and operators.",
    pricingModel: "usage",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 0,
    pricingNotes: "Freemium + usage credits on emergent.sh (medium confidence). Affiliate economics excluded.",
    pricingSummary: "Free tier + usage credits — confirm live credit packs on emergent.sh/pricing.",
    plans: [
      { kind: "free", slug: "free", name: "Free", description: "Limited build/deploy credits." },
      { kind: "flat-monthly", slug: "pro", name: "Pro", amount: 20, highlighted: true },
    ],
    featureOverrides: {
      "agent-builder": "supported",
      "website-generation": "supported",
      "code-assist": "supported",
      "writing-assist": "limited",
      "image-generation": "limited",
    },
    scores: S({ "ai-job-fit": 8, "workflow-depth": 8, "model-capability": 7, "value-for-money": 7 }),
    bestFor: ["Builders prototyping AI agents and micro-apps", "Teams wanting hosted agent deploys"],
    notIdealFor: ["Enterprise AI writing suites", "Marketing copy-only buyers"],
    pros: ["Agent/app builder", "Hosted deploy path", "Free tier"],
    cons: ["Developer-oriented", "Credit usage model", "Not marketing copy specialist"],
    keyFeatures: ["AI app builder", "Agent hosting", "Prompt-to-product"],
    whoShouldChoose: "Choose Emergent when building and deploying AI agents is the job.",
    whoShouldConsiderAlternatives: "Compare Writesonic or MindStudio for different AI workflow angles.",
    alternativeSlugs: ["writesonic", "gamma"],
    competitorSlugs: ["writesonic", "gamma", "mindstudio"],
    comparableSlugs: ["writesonic"],
    limitations: ["Builder platform — not enterprise MAP or writing suite"],
  },
  {
    slug: "rank-prompt",
    name: "Rank Prompt",
    company: "Rank Prompt",
    website: "https://rankprompt.com",
    domain: "rankprompt.com",
    pricingUrl: "https://rankprompt.com/pricing",
    membershipRole: "primary",
    jobCluster: "ai-automation",
    shortDescription:
      "Rank Prompt is an AI SEO and search visibility platform — prompt tracking, AI search optimization (GEO/AEO), and content workflows for marketing teams. Tiered SaaS pricing (2026-08-19 — confirm on rankprompt.com).",
    vendorPositioning: "AI search growth — monitor and improve visibility in ChatGPT, Perplexity, and Google AI results.",
    pricingModel: "tiered",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 7,
    startingPriceMonthly: 29,
    pricingNotes: "Confirm tiers on rankprompt.com/pricing. Affiliate economics excluded.",
    pricingSummary: "Tiered plans from ~$29/mo — 7-day trial; confirm on vendor site.",
    plans: [
      { kind: "flat-monthly", slug: "starter", name: "Starter", amount: 29, highlighted: true, hasFreeTrial: true, trialDays: 7 },
    ],
    featureOverrides: {
      "writing-assist": "supported",
      "workflow-automation": "supported",
      "analytics-reporting": "supported",
      "agent-builder": "limited",
    },
    scores: S({ "ai-job-fit": 8, "workflow-depth": 7, "output-quality": 7, integrations: 6 }),
    bestFor: ["SEO/marketing teams optimizing for AI search surfaces", "GEO/AEO experimentation"],
    notIdealFor: ["General copywriting only (Writesonic)", "Non-marketing AI buyers"],
    pros: ["AI search/GEO focus", "Prompt tracking", "Marketing workflow fit"],
    cons: ["Niche GEO scope", "Not general LLM suite", "Emerging category volatility"],
    keyFeatures: ["AI visibility tracking", "GEO/AEO workflows", "Content optimization"],
    whoShouldChoose: "Choose Rank Prompt when AI search visibility is the marketing job.",
    whoShouldConsiderAlternatives: "Compare Writesonic or QuillBot for broader AI writing.",
    alternativeSlugs: ["writesonic"],
    competitorSlugs: ["writesonic", "quillbot"],
    comparableSlugs: ["writesonic"],
    limitations: ["GEO/AEO niche — not general-purpose AI writing"],
  },
];

export const PRODUCTS = COMPACT.map(expandAiProduct);

export const COMPARISON_PAIRS = [
  ["emergent", "writesonic"],
  ["rank-prompt", "writesonic"],
  ["rank-prompt", "quillbot"],
];
