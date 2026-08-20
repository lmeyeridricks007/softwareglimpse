/**
 * AI automation overlay (compact) — not LLM-assistant peers.
 * zapier, n8n.
 *
 * Pricing grounded 2026-08-18 from first-party pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 *
 * Zapier (8.1) is the ai-automation cluster award.
 * n8n (8.0) is the self-host / execution-volume peer.
 * Explicitly NOT ChatGPT peers — automation overlay vs LLM chat.
 * MindStudio pairs are landscape (ai-agents).
 */
import { expandAiProduct } from "./ai-compact-expand.mjs";

const AUTOMATION_FEATURES = {
  "llm-chat": "limited",
  "reasoning-models": "not-supported",
  "writing-assist": "limited",
  "image-generation": "not-supported",
  "voice-tts": "not-supported",
  "presentation-generation": "not-supported",
  "website-generation": "not-supported",
  "ad-creative-generation": "not-supported",
  "agent-builder": "limited",
  "custom-projects": "supported",
  "enterprise-admin": "higher-plan-only",
  "usage-credits": "supported",
  connectors: "supported",
  "data-privacy": "limited",
  "analytics-reporting": "limited",
  "video-generation": "not-supported",
  "code-assist": "not-supported",
  "meeting-notes": "not-supported",
  "workflow-automation": "supported",
};

const COMPACT = [
  {
    slug: "zapier",
    name: "Zapier",
    company: "Zapier, Inc.",
    website: "https://zapier.com",
    domain: "zapier.com",
    pricingUrl: "https://zapier.com/pricing",
    aliases: ["Zapier AI", "Zapier Agents", "Zaps"],
    membershipRole: "primary",
    jobCluster: "ai-automation",
    softShortDescription:
      "Automation + AI — Free 100 tasks; Pro from $19.99/mo annual (750 tasks); Team from 2,000 tasks; Agents add-on separate.",
    shortDescription:
      "Zapier is a no-code automation platform (Zaps plus AI steps and a separate Agents add-on). Free includes 100 tasks. Pro is $19.99/mo billed annually ($29.99 monthly) with 750 tasks and a 14-day Pro trial. Team starts from 2,000 tasks — confirm live Team price. Agents are an add-on, not the Pro floor. Same ai-automation cluster as n8n — not an LLM-assistant peer of ChatGPT, and not an ai-agents builder peer of MindStudio (landscape only).",
    vendorPositioning:
      "Connect apps and add AI steps in Zaps — automation overlay, not a chat assistant you live in all day.",
    pricingModel: "usage",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 19.99,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from zapier.com/pricing (high confidence, machine-readable page). Free 100 tasks. Pro 750 tasks $19.99/mo annual / $29.99 monthly. 14-day Pro trial. Team from 2,000 tasks — live Team dollar amount not frozen here. Agents add-on is separate from Pro. Affiliate economics excluded.",
    pricingSummary:
      "Free 100 tasks. Pro from $19.99/mo annual (750 tasks; $29.99 monthly). 14-day Pro trial. Team from 2,000 tasks. Agents add-on separate. Confirm live on zapier.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        limits: ["100 tasks / month"],
        description: "Free plan with 100 tasks — automation overlay sandbox, not a paid Pro floor.",
      },
      {
        kind: "flat-annual",
        slug: "pro",
        name: "Pro",
        amount: 19.99,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "$19.99/mo billed annually ($29.99 monthly) — 750 tasks; 14-day Pro trial. Agents add-on not included.",
      },
      {
        kind: "contact-sales",
        slug: "team",
        name: "Team",
        description:
          "From 2,000 tasks — confirm live Team packaging on zapier.com/pricing. Agents add-on remains separate.",
      },
    ],
    featureOverrides: AUTOMATION_FEATURES,
    aiLines: [
      "AI assistant: limited",
      "AI summaries: limited",
      "AI automation: supported",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Task quotas (100 Free / 750 Pro) dominate TCO — multi-step Zaps burn tasks fast",
      "Agents add-on is separate from the Pro $19.99 floor",
      "Not a general LLM assistant (ChatGPT) and not a no-code agent studio (MindStudio) as the primary job",
      "Enterprise admin/SSO sits on higher packaging",
      "Team dollar amount must be confirmed live — not frozen in this pack",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
      "plan-restriction",
      "other",
    ],
    scores: {
      "ease-of-use": 9,
      "ai-job-fit": 9,
      "output-quality": 7,
      "workflow-depth": 8,
      integrations: 10,
      "governance-privacy": 7,
      scalability: 8,
      "value-for-money": 7,
      "model-capability": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Zap editor is the easiest automation overlay for non-developers. Not a lab test.",
      "ai-job-fit":
        "Primary job is app automation with AI steps — ai-automation cluster award versus n8n; not ChatGPT chat.",
      "output-quality":
        "AI steps and Agents assist workflows; quality is connector- and prompt-dependent, not flagship LLM chat.",
      "workflow-depth":
        "Multi-step Zaps, paths, and AI/Agents cover a deep automation loop; less self-host control than n8n.",
      integrations: "Connector catalogue is the product — scored at the top of this cluster.",
      "governance-privacy":
        "Team/Enterprise admin exists; self-serve Free/Pro is SaaS-grade, not self-host privacy.",
      scalability: "Task tiers and Team/Enterprise scale; task math still caps naive volume.",
      "value-for-money":
        "Free 100 tasks plus $19.99 Pro annual is a clear overlay floor; task burn and Agents add-on raise TCO. Affiliate economics excluded.",
      "model-capability":
        "AI steps and Agents overlay models — not a frontier chat model surface.",
    },
    bestFor: [
      "Ops teams that need the widest SaaS connector catalogue with AI steps",
      "Buyers who want a Free 100-task sandbox then Pro at $19.99 annual",
      "Teams that will treat Agents as an add-on, not as the reason to skip n8n",
    ],
    notIdealFor: [
      "Teams that need Community self-host / EU-priced execution volume (n8n)",
      "Buyers who only need ChatGPT as an LLM assistant",
      "No-code AI agent studios as the primary job (MindStudio) — landscape only",
    ],
    pros: [
      "Free 100 tasks",
      "Published Pro $19.99 annual / $29.99 monthly",
      "14-day Pro trial",
      "Widest connector catalogue in-cluster",
      "AI steps plus separate Agents add-on",
    ],
    cons: [
      "Task quotas burn on multi-step Zaps",
      "Agents add-on is extra",
      "Not a ChatGPT peer",
      "Not self-host Community Edition",
      "Team price not frozen here",
    ],
    keyFeatures: [
      "Zap-based workflow automation",
      "Large connector catalogue",
      "AI steps in Zaps",
      "Agents add-on (separate)",
      "Free 100-task plan + Pro trial",
    ],
    whoShouldChoose:
      "Choose Zapier when no-code app automation with AI steps is the job — not ChatGPT as an LLM, and not MindStudio as an agent studio by default.",
    whoShouldConsiderAlternatives:
      "Compare n8n for self-host / execution-volume automation; MindStudio only on landscape pages if the job is building AI agents.",
    alternativeSlugs: ["n8n", "mindstudio"],
    competitorSlugs: ["n8n", "mindstudio"],
    comparableSlugs: ["n8n"],
    useCaseSlugs: ["ai-automation"],
    businessSizeSlugs: ["solo", "micro", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "marketing", "engineering"],
    sourcesExtra: [
      {
        id: "zapier-pricing",
        url: "https://zapier.com/pricing",
        title: "Zapier pricing",
        domains: ["pricing", "plans", "free-plan", "free-trial", "limits"],
      },
    ],
  },
  {
    slug: "n8n",
    name: "n8n",
    company: "n8n GmbH",
    website: "https://n8n.io",
    domain: "n8n.io",
    pricingUrl: "https://n8n.io/pricing/",
    aliases: ["n8n Cloud", "n8n Community Edition", "n8n AI"],
    membershipRole: "primary",
    jobCluster: "ai-automation",
    softShortDescription:
      "Workflow automation — Community self-host free; Cloud Starter €20/mo annual (2.5k executions + AI credits); Pro €50; Business €667; Enterprise quote.",
    shortDescription:
      "n8n is a workflow-automation platform with a free Community Edition for self-host and a Cloud ladder priced in EUR. Cloud Starter is €20/mo billed annually (2,500 executions plus AI credits). Pro €50. Business €667. Enterprise quote. Same ai-automation cluster as Zapier — more self-host / execution-volume shaped, not an LLM-assistant peer of ChatGPT. MindStudio is landscape (ai-agents).",
    vendorPositioning:
      "Fair-code workflow automation you can self-host or run on n8n Cloud — executions and AI credits, not Zapier task branding.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 20,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from n8n.io/pricing (high confidence). Amounts are EUR, not USD: Cloud Starter €20/mo annual (2.5k executions + AI credits); Pro €50; Business €667; Enterprise quote. Community Edition is free self-host — that is the free plan, not a Cloud $0 SKU. startingPriceMonthly 20 is the Starter annual euro floor stored as a number; confirm FX and live euro tiles. Affiliate economics excluded.",
    pricingSummary:
      "Community self-host free. Cloud Starter from €20/mo annual (2.5k executions + AI credits). Pro €50. Business €667. Enterprise quote. Confirm live EUR packaging on n8n.io/pricing.",
    plans: [
      {
        kind: "free",
        slug: "community",
        name: "Community Edition",
        limits: ["Self-host", "Community support"],
        description: "Free Community Edition for self-host — not n8n Cloud.",
      },
      {
        kind: "flat-annual",
        slug: "cloud-starter",
        name: "Cloud Starter",
        amount: 20,
        highlighted: true,
        description:
          "€20/mo billed annually — 2,500 executions plus AI credits on n8n Cloud. Amount is EUR (see pricingNotes).",
      },
      {
        kind: "flat-monthly",
        slug: "cloud-pro",
        name: "Cloud Pro",
        amount: 50,
        description: "€50/mo Cloud Pro — confirm live interval on n8n.io/pricing. Amount is EUR.",
      },
      {
        kind: "flat-monthly",
        slug: "cloud-business",
        name: "Cloud Business",
        amount: 667,
        description: "€667/mo Cloud Business — amount is EUR. Confirm live packaging.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Enterprise quote — self-host or Cloud. Confirm live on n8n.io/pricing.",
      },
    ],
    featureOverrides: {
      ...AUTOMATION_FEATURES,
      "data-privacy": "supported",
      "enterprise-admin": "higher-plan-only",
      "agent-builder": "limited",
    },
    aiLines: [
      "AI assistant: limited",
      "AI summaries: limited",
      "AI automation: supported",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Cloud prices are EUR — startingPriceMonthly 20 is the Starter euro floor, not a USD SKU",
      "Community Edition is self-host ops work — not a hosted Free Zapier-style 100-task sandbox",
      "Not a general LLM assistant (ChatGPT) and not MindStudio as the primary agent-builder job",
      "Business €667 and Enterprise are a different buying motion than Starter €20",
      "Execution + AI-credit math still dominates Cloud TCO",
    ],
    limitationKinds: [
      "other",
      "other",
      "feature-unavailable",
      "plan-restriction",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 7,
      "ai-job-fit": 9,
      "output-quality": 7,
      "workflow-depth": 9,
      integrations: 8,
      "governance-privacy": 8,
      scalability: 8,
      "value-for-money": 9,
      "model-capability": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Node graph is more developer-shaped than Zapier’s Zap editor; Community self-host adds ops. Not a lab test.",
      "ai-job-fit":
        "Primary job is workflow automation with AI credits — ai-automation peer of Zapier, not ChatGPT.",
      "output-quality":
        "AI nodes/credits assist workflows; quality depends on connected models and graph design.",
      "workflow-depth":
        "Branching graphs, self-host, and Cloud execution volume are the deepest automation loop in this pair.",
      integrations: "Strong connector/node set — narrower consumer SaaS catalogue than Zapier.",
      "governance-privacy":
        "Community self-host is the privacy story; Cloud Business/Enterprise carry admin gates.",
      scalability: "Starter → Pro → Business → Enterprise plus self-host scale; ops skill is the constraint.",
      "value-for-money":
        "Free Community plus €20 Starter annual is sharp if you will run executions yourself. Affiliate economics excluded.",
      "model-capability":
        "AI credits overlay models — not a frontier chat product.",
    },
    bestFor: [
      "Teams that want Community self-host or EUR Cloud execution volume",
      "Builders comfortable with a node graph instead of Zapier’s editor",
      "Buyers who need automation overlay, not ChatGPT as the home screen",
    ],
    notIdealFor: [
      "Non-technical teams that only want Zapier’s connector-first editor",
      "Buyers who only need an LLM assistant (ChatGPT)",
      "No-code AI agent studios as the primary job (MindStudio) — landscape only",
    ],
    pros: [
      "Community Edition self-host free",
      "Published Cloud Starter €20/mo annual",
      "Pro €50 and Business €667 ladder",
      "Deep workflow graph + AI credits",
      "Self-host privacy path",
    ],
    cons: [
      "Steeper than Zapier for non-developers",
      "Cloud amounts are EUR",
      "Not a ChatGPT peer",
      "Self-host is ops work",
      "Connector catalogue trails Zapier",
    ],
    keyFeatures: [
      "Community Edition self-host",
      "n8n Cloud Starter / Pro / Business",
      "Execution-based workflows",
      "AI credits on Cloud",
      "Node-graph automation",
    ],
    whoShouldChoose:
      "Choose n8n when self-host or EUR Cloud workflow automation is the job — not Zapier by default, and not ChatGPT or MindStudio as the primary product.",
    whoShouldConsiderAlternatives:
      "Compare Zapier for the widest SaaS connector overlay; MindStudio only on landscape pages if the job is building AI agents.",
    alternativeSlugs: ["zapier", "mindstudio"],
    competitorSlugs: ["zapier", "mindstudio"],
    comparableSlugs: ["zapier"],
    useCaseSlugs: ["ai-automation"],
    businessSizeSlugs: ["solo", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering", "operations"],
    sourcesExtra: [
      {
        id: "n8n-pricing",
        url: "https://n8n.io/pricing/",
        title: "n8n pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },
];

export const PRODUCTS = COMPACT.map(expandAiProduct);

export const COMPARISON_PAIRS = [
  ["zapier", "n8n"],
  ["zapier", "mindstudio"],
  ["n8n", "mindstudio"],
];
