/**
 * Turbotic — affiliate onboard pack (AI automation overlay).
 * Pricing grounded 2026-08-26 from try.turbotic.com affiliate landing (first-party).
 */
import { expandAiProduct } from "./ai-compact-expand.mjs";

const AUTOMATION_FEATURES = {
  "llm-chat": "supported",
  "reasoning-models": "limited",
  "writing-assist": "limited",
  "image-generation": "not-supported",
  "voice-tts": "not-supported",
  "presentation-generation": "not-supported",
  "website-generation": "not-supported",
  "ad-creative-generation": "not-supported",
  "agent-builder": "supported",
  "custom-projects": "supported",
  "enterprise-admin": "higher-plan-only",
  "usage-credits": "supported",
  connectors: "supported",
  "data-privacy": "limited",
  "analytics-reporting": "supported",
  "video-generation": "not-supported",
  "code-assist": "supported",
  "meeting-notes": "not-supported",
  "workflow-automation": "supported",
};

const COMPACT = {
  slug: "turbotic",
  name: "Turbotic",
  company: "Turbotic",
  website: "https://turbotic.com",
  domain: "turbotic.com",
  pricingUrl: "https://try.turbotic.com/cjl61tbufha3",
  aliases: ["Turbotic Automation AI"],
  membershipRole: "primary",
  jobCluster: "ai-automation",
  useCaseSlugs: ["ai-automation"],
  teamTypeSlugs: ["operations", "engineering", "marketing"],
  businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
  softShortDescription:
    "Automation AI platform — Free tier; Basic from $14.99/mo annual; Pro from $79.99/mo annual.",
  shortDescription:
    "Turbotic Automation AI is an enterprise-oriented automation platform where teams describe workflows in natural language and the system generates, tests, and runs integrations with self-healing execution and ROI reporting. Free includes up to 100 executions/mo, 100 AI chats/mo, and 3 automations. Basic starts at $14.99/mo billed annually with higher execution and chat tiers. Pro from $79.99/mo annual adds priority support and custom workflows (most popular on first-party pricing). Enterprise is contact-sales with unlimited automations, SLA, and optional on-premise deployment. Same ai-automation cluster as Zapier and n8n — AI-native orchestration rather than classic Zap-only wiring.",
  vendorPositioning:
    "Vibe automation without limits — conversational build, API-first connectors, self-healing workflows.",
  pricingModel: "usage",
  hasFreePlan: true,
  hasFreeTrial: false,
  startingPriceMonthly: 14.99,
  startingPriceConfidence: "high",
  pricingNotes:
    "Verified 2026-08-26 from try.turbotic.com affiliate landing pricing section (high confidence). Free: 100 executions/mo, 100 chats/mo, 3 automations. Basic from $14.99/mo annual. Pro from $79.99/mo annual. Enterprise contact sales. Execution and chat quotas scale by tier — confirm live caps. Affiliate aff-turbotic. Affiliate economics excluded.",
  pricingSummary:
    "Free (100 executions/mo). Basic from $14.99/mo annual. Pro from $79.99/mo annual. Enterprise custom. Confirm execution/chat tiers on turbotic.com.",
  plans: [
    {
      kind: "free",
      slug: "free",
      name: "Free",
      limits: ["100 executions/mo", "100 AI chats/mo", "3 automations"],
      description: "Free tier for evaluation — community support.",
    },
    {
      kind: "flat-annual",
      slug: "basic",
      name: "Basic",
      amount: 14.99,
      highlighted: true,
      description:
        "$14.99/mo billed annually — up to 50 automations, standard support, scheduling.",
    },
    {
      kind: "flat-annual",
      slug: "pro",
      name: "Pro",
      amount: 79.99,
      description:
        "$79.99/mo billed annually — up to 100 automations, priority support, custom workflows.",
    },
    {
      kind: "contact-sales",
      slug: "enterprise",
      name: "Enterprise",
      description:
        "Unlimited automations, dedicated support, SLA, optional on-premise deployment.",
    },
  ],
  featureOverrides: AUTOMATION_FEATURES,
  aiLines: [
    "AI assistant: supported",
    "AI summaries: supported",
    "AI automation: supported",
    "AI recommendations: supported",
  ],
  integrations: [
    { integrationSlug: "zapier", kind: "zapier-style" },
    { integrationSlug: "slack", kind: "native" },
  ],
  limitations: [
    "Newer platform — confirm enterprise references and connector catalog depth",
    "Execution/chat quotas vary by tier — monitor usage on Free and Basic",
    "Not a general-purpose LLM chat replacement like ChatGPT",
    "Self-host/open-source automation peers (n8n Community) differ on deployment model",
    "Complex legacy RPA (UiPath-class) is a different job cluster",
  ],
  scores: {
    "ease-of-use": 8,
    "ai-job-fit": 8,
    "output-quality": 7,
    "workflow-depth": 8,
    integrations: 8,
    "governance-privacy": 6,
    scalability: 7,
    "value-for-money": 8,
    "model-capability": 7,
  },
  scoreRationales: {
    "ease-of-use":
      "Natural-language workflow generation lowers the bar versus manual Zap wiring — still requires automation thinking.",
    "ai-job-fit":
      "Primary job is AI-native business automation — ai-automation cluster peer to Zapier/n8n, not LLM chat.",
    "value-for-money":
      "Free tier and $14.99/mo Basic annual floor are accessible versus Zapier Pro task tiers for experimenters. Affiliate economics excluded.",
  },
  bestFor: [
    "Teams that want AI-generated automation code with self-healing execution",
    "Ops and RevOps buyers bridging non-technical users and API-heavy stacks",
    "Organizations comparing AI-first automation against classic Zapier Zaps",
  ],
  notIdealFor: [
    "Buyers who only need simple two-app Zaps with a mature 6,000-app catalog (Zapier)",
    "Self-hosted-only requirements (n8n Community)",
    "Pure LLM research/chat workloads (ChatGPT-class tools)",
  ],
  pros: [
    "Conversational workflow build with generated code",
    "Free tier for proof-of-concept",
    "Self-healing and ROI reporting positioning",
    "API-first connector story",
    "Published Basic/Pro annual pricing on affiliate landing",
  ],
  cons: [
    "Younger ecosystem versus Zapier connector catalog",
    "Enterprise governance details require sales conversation",
    "Usage caps on Free/Basic need monitoring",
    "Not self-hosted like n8n Community",
    "Landscape overlap with RPA suites is limited",
  ],
  keyFeatures: [
    "Natural-language automation builder",
    "AI agent orchestration",
    "Self-healing workflows",
    "ROI and time-saved analytics",
    "Team collaboration and approvals",
  ],
  competitorSlugs: ["zapier", "n8n"],
  alternativeSlugs: ["zapier", "n8n"],
  comparableSlugs: ["zapier", "n8n"],
  officialVideos: [],
};

export const TURBOTIC_PRODUCT = expandAiProduct(COMPACT);

export const TURBOTIC_COMPARISON_PAIRS = [
  ["turbotic", "zapier"],
  ["turbotic", "n8n"],
];
