/**
 * AI Priority-2 credibility products (compact).
 * microsoft-copilot, perplexity, github-copilot, cursor, midjourney,
 * adobe-firefly, runway, otter-ai.
 *
 * Pricing grounded 2026-08-18 from first-party / official pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 */
import { expandAiProduct } from "./ai-compact-expand.mjs";

const LLM_FEATURES = {
  "llm-chat": "supported",
  "reasoning-models": "supported",
  "writing-assist": "supported",
  "image-generation": "limited",
  "voice-tts": "limited",
  "presentation-generation": "limited",
  "website-generation": "not-supported",
  "ad-creative-generation": "not-supported",
  "agent-builder": "limited",
  "custom-projects": "supported",
  "enterprise-admin": "supported",
  "usage-credits": "supported",
  connectors: "supported",
  "data-privacy": "supported",
  "analytics-reporting": "higher-plan-only",
  "video-generation": "not-supported",
  "code-assist": "limited",
  "meeting-notes": "not-supported",
};

const CODE_FEATURES = {
  "llm-chat": "supported",
  "reasoning-models": "supported",
  "writing-assist": "limited",
  "image-generation": "not-supported",
  "voice-tts": "not-supported",
  "presentation-generation": "not-supported",
  "website-generation": "not-supported",
  "ad-creative-generation": "not-supported",
  "agent-builder": "supported",
  "custom-projects": "supported",
  "enterprise-admin": "supported",
  "usage-credits": "supported",
  connectors: "supported",
  "data-privacy": "supported",
  "analytics-reporting": "supported",
  "video-generation": "not-supported",
  "code-assist": "supported",
  "meeting-notes": "not-supported",
};

const IMAGE_FEATURES = {
  "llm-chat": "not-supported",
  "reasoning-models": "not-supported",
  "writing-assist": "not-supported",
  "image-generation": "supported",
  "voice-tts": "not-supported",
  "presentation-generation": "not-supported",
  "website-generation": "not-supported",
  "ad-creative-generation": "limited",
  "agent-builder": "not-supported",
  "custom-projects": "supported",
  "enterprise-admin": "limited",
  "usage-credits": "supported",
  connectors: "limited",
  "data-privacy": "limited",
  "analytics-reporting": "limited",
  "video-generation": "limited",
  "code-assist": "not-supported",
  "meeting-notes": "not-supported",
};

const COMPACT = [
  {
    slug: "microsoft-copilot",
    name: "Microsoft 365 Copilot",
    company: "Microsoft",
    website: "https://www.microsoft.com/microsoft-365-copilot",
    domain: "microsoft.com",
    pricingUrl: "https://www.microsoft.com/microsoft-365-copilot/pricing",
    aliases: ["Microsoft Copilot", "M365 Copilot", "Copilot for Microsoft 365"],
    membershipRole: "primary",
    jobCluster: "llm-assistant",
    softShortDescription:
      "Workspace LLM assistant add-on — Copilot Business from $21/user/mo annual; Enterprise add-on $30/user/mo annual on a qualifying Microsoft 365 base licence.",
    shortDescription:
      "Microsoft 365 Copilot is Microsoft’s workspace LLM assistant inside Word, Excel, PowerPoint, Outlook, Teams, and Copilot Chat, grounded in Microsoft Graph tenant data. It is an add-on: Copilot Business lists from $21/user/mo on annual billing (promo windows may be lower); Enterprise Copilot is $30/user/mo annual ($31.50 monthly) and requires a qualifying Microsoft 365 plan. Bundles such as Business Standard with Copilot (~$23.50/user/mo annual) combine base suite + Copilot. Distinct from GitHub Copilot, which is an AI coding product.",
    vendorPositioning:
      "AI in the Microsoft 365 apps you already use — chat, drafts, and meeting recap grounded in your tenant.",
    pricingModel: "per-seat",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 21,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from microsoft.com Microsoft 365 Copilot pricing (high confidence). Copilot Business add-on from $21/user/mo annual; Enterprise add-on $30/user/mo annual ($31.50 monthly). Qualifying Microsoft 365 base licence required — all-in TCO is base + Copilot. Promo $18 windows are time-boxed; do not treat as the durable floor. Affiliate economics excluded.",
    pricingSummary:
      "Copilot Business from $21/user/mo annual add-on; Enterprise $30/user/mo annual. Requires qualifying Microsoft 365. Confirm live bundles on microsoft.com.",
    plans: [
      {
        kind: "per-seat-annual",
        slug: "copilot-business",
        name: "Copilot Business (add-on)",
        amount: 21,
        highlighted: true,
        description:
          "$21/user/mo billed annually — SMB Copilot add-on on a qualifying Business plan (≤300 seats typical).",
      },
      {
        kind: "per-seat-annual",
        slug: "copilot-enterprise",
        name: "Copilot (Enterprise add-on)",
        amount: 30,
        description:
          "$30/user/mo billed annually — enterprise Copilot add-on on E3/E5-class Microsoft 365.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise-quote",
        name: "Enterprise / volume",
        description:
          "Volume, education, and frontline packaging — confirm with Microsoft or a Cloud Solution Provider.",
      },
    ],
    featureOverrides: {
      ...LLM_FEATURES,
      "image-generation": "supported",
      "meeting-notes": "supported",
      "code-assist": "limited",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: supported",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "slack", kind: "third-party" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Requires a qualifying Microsoft 365 base licence — Copilot is not a standalone $21 chat app",
      "Weak fit if the team is not already in Word/Excel/Teams",
      "Not GitHub Copilot — coding agents live on a separate SKU",
      "Deepest Graph grounding and admin controls follow enterprise packaging",
      "Usage and Copilot Studio credits can add TCO beyond the seat add-on",
    ],
    limitationKinds: [
      "plan-restriction",
      "other",
      "feature-unavailable",
      "plan-restriction",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 8,
      "ai-job-fit": 8,
      "output-quality": 8,
      "workflow-depth": 8,
      integrations: 10,
      "governance-privacy": 9,
      scalability: 9,
      "value-for-money": 6,
      "model-capability": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Copilot sits inside familiar Microsoft 365 apps — low extra UX for Office-native teams. Score from packaging, not a lab test.",
      "ai-job-fit":
        "Primary job is workspace LLM assistant, not a specialist coding IDE or image studio. Ranked inside llm-assistant with ChatGPT/Claude/Gemini, not against GitHub Copilot.",
      "output-quality":
        "Microsoft publishes Copilot Chat plus in-app drafting; quality tracks the bundled models rather than a standalone lab bake-off.",
      "workflow-depth":
        "Graph-grounded drafts, meeting recap, and Copilot Studio extend beyond bare chat — held at 8 vs deepest agent builders.",
      integrations:
        "Native Word, Excel, PowerPoint, Outlook, and Teams is the strongest Microsoft-stack integration in the LLM cluster.",
      "governance-privacy":
        "Tenant admin, enterprise compliance, and data-handling claims are a core Microsoft 365 story — strong for regulated buyers.",
      scalability:
        "Business (capped) through Enterprise add-on scales with the M365 tenant; not a consumer-only chat SKU.",
      "value-for-money":
        "Add-on + base licence means all-in TCO is often $34–$90/user/mo. Capability is high; sticker value is weaker than $20 ChatGPT Plus. Affiliate economics excluded.",
      "model-capability":
        "Access to Microsoft’s Copilot models and in-app features is competitive, without claiming a ChatGPT Pro compute lead.",
    },
    bestFor: [
      "Microsoft 365 shops that want AI inside Word, Excel, Outlook, and Teams",
      "IT buyers who need tenant admin and Graph grounding",
      "Enterprises already paying for E3/E5 who can absorb the $30 add-on",
    ],
    notIdealFor: [
      "Teams without a qualifying Microsoft 365 licence",
      "Developers whose primary job is an AI IDE (Cursor / GitHub Copilot)",
      "Buyers who only need a $20 standalone chat assistant",
    ],
    pros: [
      "Native in Microsoft 365 apps and Graph",
      "Strong enterprise admin and compliance story",
      "Meeting recap and document drafting in the flow of work",
      "Clear Business vs Enterprise add-on packaging",
      "Scales with existing M365 tenants",
    ],
    cons: [
      "Base licence is mandatory extra cost",
      "Poor fit outside the Microsoft stack",
      "Not a coding-primary product",
      "Studio / credit usage can stack on seats",
      "Published add-on looks cheaper than all-in TCO",
    ],
    keyFeatures: [
      "Copilot Chat grounded in Microsoft Graph",
      "In-app assistance in Word, Excel, PowerPoint, Outlook",
      "Teams meeting recap",
      "Copilot Studio / agents (packaging varies)",
      "Enterprise admin on qualifying tenants",
    ],
    whoShouldChoose:
      "Choose Microsoft 365 Copilot when the primary job is an LLM assistant inside Microsoft 365 — not a standalone chat tab and not GitHub Copilot.",
    whoShouldConsiderAlternatives:
      "Compare ChatGPT or Claude if you need a standalone assistant; GitHub Copilot or Cursor if coding is the job.",
    alternativeSlugs: ["chatgpt", "claude", "gemini"],
    competitorSlugs: ["chatgpt", "claude", "gemini", "perplexity"],
    comparableSlugs: ["chatgpt", "claude", "gemini", "perplexity"],
    useCaseSlugs: ["llm-assistant"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "marketing"],
    sourcesExtra: [
      {
        id: "m365-copilot-pricing-official",
        url: "https://www.microsoft.com/microsoft-365-copilot/pricing",
        title: "Microsoft 365 Copilot pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    company: "Perplexity AI, Inc.",
    website: "https://www.perplexity.ai",
    domain: "perplexity.ai",
    pricingUrl: "https://www.perplexity.ai/pro",
    aliases: ["Perplexity AI", "Perplexity Pro", "Sonar"],
    membershipRole: "primary",
    jobCluster: "llm-assistant",
    softShortDescription:
      "Cited-search LLM assistant — Free; Pro $20/mo (~$17 annual); Max $200/mo; Enterprise Pro $40/seat.",
    shortDescription:
      "Perplexity is a cited-search LLM assistant for research, Pro Search, and Deep Research. Free covers basic search with daily Pro/Deep Research caps. Pro is $20/mo or about $17/mo billed annually. Max is $200/mo ($2,000/year) for power-user Labs and Computer credits. Enterprise Pro lists around $40/seat/mo with SSO/admin; Enterprise Max is a higher published seat SKU. Sonar API is a separate usage product.",
    vendorPositioning:
      "An answer engine — cited research and Deep Research rather than a general chat OS.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 20,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from Perplexity Pro/Max packaging (high confidence for Pro/Max; Enterprise from published help/list pages). Free; Pro $20/mo or ~$200/year; Max $200/mo or $2,000/year; Enterprise Pro ~$40/seat. Confirm live Enterprise Max and API rates. Affiliate economics excluded.",
    pricingSummary:
      "Free. Pro $20/mo (~$17 annual). Max $200/mo. Enterprise Pro ~$40/seat. Confirm on perplexity.ai.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description: "Cited search with daily Pro Search / Deep Research caps.",
      },
      {
        kind: "per-seat-monthly",
        slug: "pro",
        name: "Pro",
        amount: 20,
        highlighted: true,
        description: "$20/mo — unlimited Pro Search and higher Deep Research caps.",
      },
      {
        kind: "per-seat-monthly",
        slug: "max",
        name: "Max",
        amount: 200,
        description: "$200/mo — power-user Labs, Computer credits, and priority models.",
      },
      {
        kind: "per-seat-annual",
        slug: "enterprise-pro",
        name: "Enterprise Pro",
        amount: 40,
        description: "~$40/seat/mo annual — team admin, SSO, and business data handling.",
      },
    ],
    featureOverrides: {
      ...LLM_FEATURES,
      "image-generation": "supported",
      "agent-builder": "limited",
      "enterprise-admin": "higher-plan-only",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: supported",
      "AI automation: limited",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "api", kind: "api" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Research/citations are the core — weaker as a general coding or custom-GPT OS",
      "Max at $200 is a power-user SKU, not the default Pro comparison",
      "Enterprise admin is not on Free/Pro consumer plans",
      "Sonar API billing is separate from Pro search seats",
      "Not a specialist voice, meeting, or image studio",
    ],
    limitationKinds: [
      "other",
      "plan-restriction",
      "plan-restriction",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 9,
      "ai-job-fit": 9,
      "output-quality": 8,
      "workflow-depth": 8,
      integrations: 8,
      "governance-privacy": 8,
      scalability: 8,
      "value-for-money": 8,
      "model-capability": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Search-first UI is easy for research questions; less of a project/GPT workshop than ChatGPT.",
      "ai-job-fit":
        "Cited research LLM assistant — a peer inside llm-assistant, not a writing-only or voice tool.",
      "output-quality":
        "Pro Search and Deep Research with citations are the quality story; not a lab bake-off vs ChatGPT.",
      "workflow-depth":
        "Spaces, files, Labs, and Computer (higher tiers) add depth beyond one-shot search.",
      integrations: "Slack, API/Sonar, and file Spaces cover research workflows; thinner Office-native depth than Copilot.",
      "governance-privacy":
        "Enterprise Pro publishes SSO/admin and no-training claims; consumer tiers are weaker.",
      scalability: "Free → Pro → Max → Enterprise ladder exists; Max is expensive for casual teams.",
      "value-for-money":
        "Pro at $20 matches ChatGPT Plus for research-heavy users; Max is a steep step. Affiliate economics excluded.",
      "model-capability":
        "Model switching on Pro/Max is competitive; capability is research-shaped rather than agent-OS-shaped.",
    },
    bestFor: [
      "Analysts and operators who need cited answers and Deep Research",
      "Teams replacing ‘Google then paste into ChatGPT’ with one research surface",
      "Orgs that want Enterprise Pro admin without Microsoft Graph lock-in",
    ],
    notIdealFor: [
      "Buyers who need Custom GPTs and a general work OS (ChatGPT)",
      "Microsoft 365-native drafting (Copilot)",
      "Primary coding in an IDE (Cursor / GitHub Copilot)",
    ],
    pros: [
      "Citations and Deep Research as the default",
      "Usable Free tier plus $20 Pro",
      "Model choice on paid plans",
      "Enterprise Pro admin path",
      "API/Sonar for developers (separate bill)",
    ],
    cons: [
      "Not the deepest custom-GPT / project OS",
      "Max pricing is steep",
      "Weaker Office-native workflow than Copilot",
      "API is a different SKU",
      "Not a specialist image/video/meeting tool",
    ],
    keyFeatures: [
      "Cited Pro Search",
      "Deep Research",
      "Spaces and file context",
      "Model switching (Pro+)",
      "Enterprise SSO/admin",
    ],
    whoShouldChoose:
      "Choose Perplexity when the LLM job is cited research and Deep Research — not a general Custom GPT workshop.",
    whoShouldConsiderAlternatives:
      "Compare ChatGPT or Claude for general assistants; Microsoft 365 Copilot for Office-native work.",
    alternativeSlugs: ["chatgpt", "claude", "microsoft-copilot"],
    competitorSlugs: ["chatgpt", "claude", "gemini", "microsoft-copilot"],
    comparableSlugs: ["chatgpt", "claude", "gemini", "microsoft-copilot"],
    useCaseSlugs: ["llm-assistant"],
    businessSizeSlugs: ["solo", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "founders", "marketing"],
    sourcesExtra: [
      {
        id: "perplexity-pro",
        url: "https://www.perplexity.ai/pro",
        title: "Perplexity Pro",
        domains: ["pricing", "plans", "free-plan"],
      },
    ],
  },
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    company: "GitHub, Inc.",
    website: "https://github.com/features/copilot",
    domain: "github.com",
    pricingUrl: "https://github.com/features/copilot#pricing",
    aliases: ["Copilot", "GitHub Copilot Pro", "Copilot Chat"],
    membershipRole: "primary",
    secondaryCategorySlugs: ["it-development"],
    jobCluster: "ai-code",
    softShortDescription:
      "AI coding assistant in GitHub and IDEs — Pro $10/mo; Business $19/user; Enterprise $39/user; usage via GitHub AI Credits from June 2026.",
    shortDescription:
      "GitHub Copilot is GitHub’s AI coding assistant for completions, Copilot Chat, and coding agents inside VS Code, JetBrains, and github.com. Distinct from Microsoft 365 Copilot and from GitHub the source-control platform. Published seats: Copilot Pro $10/mo, Pro+ $39, Max $100, Business $19/user/mo, Enterprise $39/user/mo. From 1 June 2026 plans include monthly GitHub AI Credits with $0.01/credit overage. Completions on paid plans remain unlimited in GitHub’s billing docs.",
    vendorPositioning:
      "The AI pair programmer that lives where your code already is — GitHub and your IDE.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 10,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from GitHub Copilot plans docs (high confidence). Pro $10, Pro+ $39, Max $100, Business $19/user, Enterprise $39/user. Usage-based AI Credits from June 2026; included credits scale with plan. Copilot Free exists with limits. Affiliate economics excluded.",
    pricingSummary:
      "Pro $10/mo; Business $19/user; Enterprise $39/user. AI Credits + overage from June 2026. Confirm on GitHub Copilot plans.",
    plans: [
      {
        kind: "free",
        slug: "copilot-free",
        name: "Copilot Free",
        description: "Limited Copilot for individuals — confirm live Free allowances.",
      },
      {
        kind: "per-seat-monthly",
        slug: "pro",
        name: "Copilot Pro",
        amount: 10,
        highlighted: true,
        description: "$10/mo — individual Copilot with included monthly AI Credits.",
      },
      {
        kind: "per-seat-monthly",
        slug: "business",
        name: "Copilot Business",
        amount: 19,
        description: "$19/user/mo — org policy, pooled credits, broader model catalog.",
      },
      {
        kind: "per-seat-monthly",
        slug: "enterprise",
        name: "Copilot Enterprise",
        amount: 39,
        description: "$39/user/mo — GitHub Enterprise Cloud; larger credit pool and enterprise controls.",
      },
    ],
    featureOverrides: CODE_FEATURES,
    aiLines: [
      "AI assistant: supported",
      "AI summaries: supported",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Not Microsoft 365 Copilot — no Word/Excel Graph assistant",
      "Usage-based AI Credits can exceed the $10/$19 sticker after included pool",
      "Deepest Enterprise features need GitHub Enterprise Cloud",
      "Weaker as a standalone research chat than ChatGPT/Perplexity",
      "Agent/cloud coding depth still trails some AI-native editors",
    ],
    limitationKinds: [
      "feature-unavailable",
      "plan-restriction",
      "plan-restriction",
      "other",
      "other",
    ],
    scores: {
      "ease-of-use": 8,
      "ai-job-fit": 9,
      "output-quality": 8,
      "workflow-depth": 8,
      integrations: 9,
      "governance-privacy": 8,
      scalability: 9,
      "value-for-money": 8,
      "model-capability": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Installs into VS Code/JetBrains/github.com with little new surface — strong for GitHub-native teams.",
      "ai-job-fit":
        "Primary job is AI coding assistant — ranked in ai-code with Cursor, not as an LLM-assistant peer of ChatGPT.",
      "output-quality":
        "Completions and chat quality track GitHub’s model catalog; not a hands-on bake-off vs Cursor.",
      "workflow-depth":
        "PR, repo, and cloud-agent workflows add depth beyond autocomplete; held at 8 vs AI-native IDEs.",
      integrations: "Native GitHub + IDE plugins is the distribution advantage.",
      "governance-privacy":
        "Business/Enterprise publish org policy and admin; consumer Pro is weaker.",
      scalability: "Free/Pro through Business/Enterprise is a clear org ladder.",
      "value-for-money":
        "$10 Pro is a low individual floor; credit overage is the TCO risk. Affiliate economics excluded.",
      "model-capability":
        "Broad model catalog on paid plans; not claimed as the single highest-compute IDE.",
    },
    bestFor: [
      "Teams already on GitHub who want IDE + PR Copilot",
      "Orgs that need Business/Enterprise policy on a familiar SKU",
      "Developers who want completions without switching editors",
    ],
    notIdealFor: [
      "Buyers whose job is Microsoft 365 drafting (M365 Copilot)",
      "Developers standardised on an AI-native editor (Cursor)",
      "Non-coding LLM research (Perplexity / ChatGPT)",
    ],
    pros: [
      "Lives in GitHub and major IDEs",
      "Clear Pro / Business / Enterprise seats",
      "Unlimited completions on paid plans (per GitHub billing docs)",
      "Org policy on Business+",
      "Low $10 individual floor",
    ],
    cons: [
      "AI Credit overage after included pool",
      "Not a general LLM OS",
      "Enterprise SKU tied to GitHub Enterprise Cloud",
      "Agent IDE experience may trail Cursor",
      "Easy to confuse with Microsoft 365 Copilot in procurement",
    ],
    keyFeatures: [
      "Inline code completions",
      "Copilot Chat in IDE and github.com",
      "Org policy (Business/Enterprise)",
      "AI Credits usage model (2026)",
      "Cloud agent / PR assistance (plan-gated)",
    ],
    whoShouldChoose:
      "Choose GitHub Copilot when AI coding inside GitHub and your current IDE is the job — not Microsoft 365 Copilot.",
    whoShouldConsiderAlternatives:
      "Compare Cursor for an AI-native editor; ChatGPT if you only need general coding chat.",
    alternativeSlugs: ["cursor", "chatgpt"],
    competitorSlugs: ["cursor", "chatgpt", "claude"],
    comparableSlugs: ["cursor"],
    useCaseSlugs: ["ai-code"],
    businessSizeSlugs: ["solo", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering"],
    sourcesExtra: [
      {
        id: "github-copilot-plans",
        url: "https://docs.github.com/en/copilot/get-started/plans",
        title: "GitHub Copilot plans",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "cursor",
    name: "Cursor",
    company: "Anysphere, Inc.",
    website: "https://cursor.com",
    domain: "cursor.com",
    pricingUrl: "https://cursor.com/pricing",
    aliases: ["Cursor IDE", "Cursor AI", "Anysphere Cursor"],
    membershipRole: "primary",
    secondaryCategorySlugs: ["it-development"],
    jobCluster: "ai-code",
    softShortDescription:
      "AI-native code editor — Hobby free; Pro $20/mo; Teams Standard $40/user; Enterprise contact. Usage credits inside paid plans.",
    shortDescription:
      "Cursor is an AI-native code editor (VS Code fork) with Tab completions, Agent, Cloud Agents, and MCP/skills. Hobby is free with limited Agent/Tab. Pro is $20/mo. Teams Standard is $40/user/mo (about $32 annual). Heavier Pro+/Ultra and Teams Premium SKUs exist for agent-heavy usage; Enterprise is contact sales. Paid plans include model usage allotments with overage — the seat price is not a hard cap.",
    vendorPositioning:
      "The AI editor built for agents — not a plugin bolted onto a classic IDE.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 20,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from cursor.com/pricing (high confidence for Pro $20 and Teams $40/user). Hobby free. Annual ~20% off Teams. Pro+/Ultra and Teams Premium usage SKUs — confirm live. Enterprise contact. Affiliate economics excluded.",
    pricingSummary:
      "Hobby free. Pro $20/mo. Teams Standard $40/user/mo. Enterprise contact. Usage allotments + overage. Confirm on cursor.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "hobby",
        name: "Hobby",
        description: "Free — limited Agent and Tab for evaluation.",
      },
      {
        kind: "per-seat-monthly",
        slug: "pro",
        name: "Pro",
        amount: 20,
        highlighted: true,
        description: "$20/mo — individual daily editor with included model usage.",
      },
      {
        kind: "per-seat-monthly",
        slug: "teams-standard",
        name: "Teams Standard",
        amount: 40,
        description: "$40/user/mo — team admin, SSO, privacy modes, pooled usage.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "SCIM, audit, pooled usage, invoice/PO — contact sales.",
      },
    ],
    featureOverrides: CODE_FEATURES,
    aiLines: [
      "AI assistant: supported",
      "AI summaries: supported",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "zapier-style" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Switching editors is a real adoption cost vs Copilot-in-VS-Code",
      "Usage overage on Agent/frontier models can exceed $20 Pro",
      "Enterprise controls are sales-gated",
      "Not a general LLM research assistant",
      "Not GitHub the platform — still needs a git host",
    ],
    limitationKinds: [
      "other",
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 8,
      "ai-job-fit": 9,
      "output-quality": 9,
      "workflow-depth": 9,
      integrations: 8,
      "governance-privacy": 7,
      scalability: 8,
      "value-for-money": 8,
      "model-capability": 9,
    },
    scoreRationales: {
      "ease-of-use":
        "VS Code-familiar editor with Agent-first UX; migration cost exists but onboarding is fast for VS Code users.",
      "ai-job-fit":
        "AI-native coding editor — ai-code cluster peer of GitHub Copilot, not an LLM-assistant rank.",
      "output-quality":
        "Frontier-model Agent and Tab are the quality story from vendor positioning — not a lab bake-off.",
      "workflow-depth":
        "Agent, Cloud Agents, MCP, skills, and hooks are deeper than plugin-style autocomplete.",
      integrations: "MCP and git remotes cover the coding loop; GitHub-native PR UI still belongs to Copilot/github.com.",
      "governance-privacy":
        "Teams/Enterprise add SSO and privacy modes; consumer Pro is individual-grade.",
      scalability: "Hobby → Pro → Teams → Enterprise exists; usage economics matter at agent scale.",
      "value-for-money":
        "Pro $20 matches ChatGPT Plus; Teams $40 is the procurement seat. Overage is the TCO watch-out. Affiliate economics excluded.",
      "model-capability":
        "Explicit frontier-model Agent access is a capability lead vs autocomplete-only tools.",
    },
    bestFor: [
      "Developers who want an AI-native editor rather than a plugin",
      "Teams running Agent-heavy refactors with MCP/tools",
      "Orgs ready for Teams SSO and privacy modes",
    ],
    notIdealFor: [
      "Teams that refuse to leave VS Code/JetBrains + Copilot plugin",
      "Procurement that only wants GitHub Enterprise Copilot SKUs",
      "Non-coding LLM chat (ChatGPT / Perplexity)",
    ],
    pros: [
      "AI-native editor and Agent loop",
      "Hobby free + $20 Pro floor",
      "Teams admin and SSO",
      "MCP / skills / cloud agents",
      "Frontier model access on paid plans",
    ],
    cons: [
      "Editor switch cost",
      "Usage overage on Agents",
      "Enterprise is quote-based",
      "Weaker github.com-native PR Copilot",
      "Not a meeting or image product",
    ],
    keyFeatures: [
      "Tab completions",
      "Agent and Cloud Agents",
      "MCP, skills, hooks",
      "Teams SSO and privacy modes",
      "Usage allotments with overage",
    ],
    whoShouldChoose:
      "Choose Cursor when the job is an AI-native coding editor and agents — not GitHub Copilot-as-a-plugin and not ChatGPT.",
    whoShouldConsiderAlternatives:
      "Compare GitHub Copilot if you must stay in current IDEs and GitHub policy; ChatGPT for general coding chat only.",
    alternativeSlugs: ["github-copilot", "chatgpt"],
    competitorSlugs: ["github-copilot", "chatgpt", "claude"],
    comparableSlugs: ["github-copilot"],
    useCaseSlugs: ["ai-code"],
    businessSizeSlugs: ["solo", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering"],
    sourcesExtra: [
      {
        id: "cursor-pricing",
        url: "https://cursor.com/pricing",
        title: "Cursor pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },
  {
    slug: "midjourney",
    name: "Midjourney",
    company: "Midjourney, Inc.",
    website: "https://www.midjourney.com",
    domain: "midjourney.com",
    pricingUrl: "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans",
    aliases: ["Midjourney AI", "MJ"],
    membershipRole: "primary",
    jobCluster: "ai-image",
    softShortDescription:
      "AI image (and video) generation — no free plan; Basic $10/mo ($8 annual); Standard $30; Pro $60; Mega $120. GPU-hour packs.",
    shortDescription:
      "Midjourney is a generative image (and video) studio known for distinctive stills. There is no free plan. Published monthly: Basic $10, Standard $30, Pro $60, Mega $120 (annual ~20% off: $8/$24/$48/$96). Fast GPU hours scale by plan; Relax Mode and Stealth Mode gate by tier. Companies over $1M revenue must use Pro or Mega per Midjourney terms. Extra Fast GPU time is $4/hour.",
    vendorPositioning:
      "A research lab and imagination engine for images — Discord and web, GPU-hour economics.",
    pricingModel: "hybrid",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 10,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from Midjourney plan comparison docs (high confidence). Basic $10 / Standard $30 / Pro $60 / Mega $120 monthly; annual 20% off. No free tier. Stealth and commercial-revenue rules on Pro+. Affiliate economics excluded.",
    pricingSummary:
      "No free plan. Basic $10/mo ($8 annual). Standard $30. Pro $60. Mega $120. Confirm GPU hours on Midjourney docs.",
    plans: [
      {
        kind: "flat-monthly",
        slug: "basic",
        name: "Basic",
        amount: 10,
        description: "$10/mo — 3.3 Fast GPU hours; no Relax Mode.",
      },
      {
        kind: "flat-annual",
        slug: "standard-annual",
        name: "Standard (annual)",
        amount: 24,
        highlighted: true,
        description: "$24/mo billed annually ($30 monthly) — 15 Fast hours + unlimited image Relax.",
      },
      {
        kind: "flat-monthly",
        slug: "pro",
        name: "Pro",
        amount: 60,
        description: "$60/mo — Stealth Mode; higher Fast hours; required for >$1M-revenue companies.",
      },
      {
        kind: "flat-monthly",
        slug: "mega",
        name: "Mega",
        amount: 120,
        description: "$120/mo — 60 Fast GPU hours; Stealth; high-volume studio.",
      },
    ],
    featureOverrides: {
      ...IMAGE_FEATURES,
      "video-generation": "supported",
      "enterprise-admin": "not-supported",
      "data-privacy": "higher-plan-only",
    },
    aiLines: [
      "AI assistant: limited",
      "AI summaries: not-supported",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [{ integrationSlug: "api", kind: "limited" }],
    limitations: [
      "No free plan — paid GPU hours from day one",
      "Default community visibility until Stealth (Pro/Mega)",
      ">$1M-revenue companies must buy Pro or Mega",
      "Not an LLM assistant, coding IDE, or Adobe-native Firefly workflow",
      "Enterprise SSO/admin is not a Microsoft/Adobe-style story",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 8,
      "ai-job-fit": 10,
      "output-quality": 10,
      "workflow-depth": 8,
      integrations: 6,
      "governance-privacy": 6,
      scalability: 7,
      "value-for-money": 8,
      "model-capability": 10,
    },
    scoreRationales: {
      "ease-of-use":
        "Web + Discord prompting is approachable; GPU-hour mental model takes a minute to learn.",
      "ai-job-fit":
        "Primary job is distinctive AI image generation — ai-image cluster, not ChatGPT.",
      "output-quality":
        "Midjourney’s stills reputation is the cluster quality lead from public positioning — not a lab bake-off.",
      "workflow-depth":
        "Jobs, permutations, Relax/Fast, and video add a production loop beyond one-shot images.",
      integrations: "Weaker Adobe/Office-native connectors than Firefly; Discord/web first.",
      "governance-privacy":
        "Stealth is Pro+; community-default generations are a privacy constraint for brands.",
      scalability: "Basic through Mega GPU hours scale; not an enterprise seat admin platform.",
      "value-for-money":
        "Basic $10 is a low floor; Standard annual is the practical production plan. Affiliate economics excluded.",
      "model-capability":
        "Flagship image (and video) models are the capability story of this cluster.",
    },
    bestFor: [
      "Creative teams that want distinctive stills",
      "Studios that can live with GPU-hour packs and Discord/web",
      "Pro/Mega buyers who need Stealth or high-volume Fast time",
    ],
    notIdealFor: [
      "Buyers who need Adobe-native Firefly + IP indemnification",
      "Teams that need a free tier to evaluate",
      "LLM, coding, or meeting-notes primary jobs",
    ],
    pros: [
      "Distinctive image quality reputation",
      "Clear GPU-hour plans",
      "Relax Mode on Standard+",
      "Stealth on Pro/Mega",
      "Video on higher plans",
    ],
    cons: [
      "No free plan",
      "Community default until Stealth",
      "Revenue-based Pro/Mega requirement",
      "Thin enterprise admin",
      "Not an Adobe Creative Cloud workflow",
    ],
    keyFeatures: [
      "Text-to-image generation",
      "Fast vs Relax GPU queues",
      "Stealth Mode (Pro/Mega)",
      "Video generation (plan-gated)",
      "Permutation / repeat jobs",
    ],
    whoShouldChoose:
      "Choose Midjourney when distinctive AI stills (and optional video) are the job — not Firefly-in-Photoshop and not ChatGPT images.",
    whoShouldConsiderAlternatives:
      "Compare Adobe Firefly for Creative Cloud + commercial IP posture.",
    alternativeSlugs: ["adobe-firefly", "chatgpt"],
    competitorSlugs: ["adobe-firefly", "chatgpt"],
    comparableSlugs: ["adobe-firefly"],
    useCaseSlugs: ["ai-image"],
    businessSizeSlugs: ["solo", "small-business", "mid-market"],
    teamTypeSlugs: ["marketing"],
    sourcesExtra: [
      {
        id: "midjourney-plans",
        url: "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans",
        title: "Comparing Midjourney Plans",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "adobe-firefly",
    name: "Adobe Firefly",
    company: "Adobe Inc.",
    website: "https://www.adobe.com/products/firefly.html",
    domain: "adobe.com",
    pricingUrl: "https://www.adobe.com/products/firefly/plans.html",
    aliases: ["Firefly", "Adobe Firefly Image", "Generative Fill"],
    membershipRole: "primary",
    jobCluster: "ai-image",
    softShortDescription:
      "Adobe generative image/video — Free credits; Firefly Standard from ~$9.99/mo; Pro ~$19.99; also bundled in Creative Cloud.",
    shortDescription:
      "Adobe Firefly is Adobe’s generative model family for images, vectors, and (on higher credits) video — integrated with Photoshop, Express, and Firefly web. Free includes a small credit allotment. Standalone Standard is commonly listed around $9.99/mo and Pro around $19.99/mo with premium credit pools; Creative Cloud Pro bundles Firefly credits for designers already in Adobe apps. Commercial IP posture and indemnification are the buying reason vs Midjourney for many brands.",
    vendorPositioning:
      "Commercially safer generative media inside the Adobe apps designers already run.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 10,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Verified 2026-08-18 from Adobe Firefly plan marketing and third-party corroboration (medium-high). Treat $9.99 Standard / $19.99 Pro as published standalone floors — confirm live on adobe.com/products/firefly/plans because Adobe renames Creative Cloud bundles. Credits reset monthly. Affiliate economics excluded.",
    pricingSummary:
      "Free limited credits. Standalone Standard ~$9.99/mo; Pro ~$19.99/mo. Often cheaper as Creative Cloud bundle. Confirm on adobe.com.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description: "Limited generative credits — evaluation; confirm commercial/watermark terms.",
      },
      {
        kind: "flat-monthly",
        slug: "standard",
        name: "Firefly Standard",
        amount: 10,
        highlighted: true,
        description: "~$9.99/mo — standalone Firefly with premium credit pool (confirm live).",
      },
      {
        kind: "flat-monthly",
        slug: "pro",
        name: "Firefly Pro",
        amount: 20,
        description: "~$19.99/mo — larger credit pool; often includes Express/Photoshop web.",
      },
      {
        kind: "contact-sales",
        slug: "teams-enterprise",
        name: "Firefly for Teams / Enterprise",
        description: "Teams and enterprise Firefly licensing — contact Adobe.",
      },
    ],
    featureOverrides: {
      ...IMAGE_FEATURES,
      "video-generation": "supported",
      connectors: "supported",
      "enterprise-admin": "higher-plan-only",
      "data-privacy": "supported",
    },
    aiLines: [
      "AI assistant: limited",
      "AI summaries: not-supported",
      "AI automation: limited",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "limited" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Premium video/partner models consume credits even when standard images are unlimited on paid plans",
      "Standalone pricing is easy to confuse with Creative Cloud Pro bundles",
      "Distinctive ‘art direction’ still often trails Midjourney for some styles",
      "Not an LLM assistant or coding IDE",
      "Teams/enterprise admin is a different SKU path",
    ],
    limitationKinds: [
      "plan-restriction",
      "other",
      "other",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 8,
      "ai-job-fit": 8,
      "output-quality": 8,
      "workflow-depth": 8,
      integrations: 9,
      "governance-privacy": 9,
      scalability: 8,
      "value-for-money": 8,
      "model-capability": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Firefly web plus Photoshop Generative Fill is familiar for Adobe users.",
      "ai-job-fit":
        "Commercial AI image (and credit-gated video) — ai-image peer of Midjourney, not ChatGPT.",
      "output-quality":
        "Strong commercial/controllable output; not positioned as Midjourney’s style lead.",
      "workflow-depth":
        "Photoshop, Express, and Firefly Boards create a production loop inside Adobe.",
      integrations: "Deepest Creative Cloud integration in the image cluster.",
      "governance-privacy":
        "Licensed-training and indemnification positioning is the governance lead vs community image tools.",
      scalability: "Standalone through Teams/Enterprise and CC bundles.",
      "value-for-money":
        "~$10 Standard is a low standalone floor; CC subscribers should price the bundle not a second Firefly SKU. Affiliate economics excluded.",
      "model-capability":
        "Adobe models plus partner models on credits; capability is commercial-safe rather than max-style.",
    },
    bestFor: [
      "Designers already in Photoshop / Creative Cloud",
      "Brands that need commercial IP posture",
      "Teams that want Firefly + Express without Discord",
    ],
    notIdealFor: [
      "Art-direction-first buyers who prefer Midjourney stills",
      "Non-Adobe stacks that only need a $10 GPU-hour image lab",
      "LLM or coding primary jobs",
    ],
    pros: [
      "Adobe app integration",
      "Commercial/IP positioning",
      "Free evaluation credits",
      "Low standalone Standard floor",
      "Video/audio on credit pools",
    ],
    cons: [
      "Credit complexity vs unlimited standard images",
      "Bundle vs standalone confusion",
      "Style lead often given to Midjourney",
      "Enterprise is quote/CC path",
      "Not a general LLM",
    ],
    keyFeatures: [
      "Text-to-image and vector generation",
      "Generative Fill in Photoshop",
      "Premium credit pool for video/partner models",
      "Adobe Express / Firefly web",
      "Commercial use terms on paid plans",
    ],
    whoShouldChoose:
      "Choose Adobe Firefly when AI images must live in Creative Cloud with a commercial IP story — not as a Midjourney Discord substitute.",
    whoShouldConsiderAlternatives:
      "Compare Midjourney for distinctive stills; ChatGPT if image gen is a side feature of an LLM.",
    alternativeSlugs: ["midjourney", "chatgpt"],
    competitorSlugs: ["midjourney", "chatgpt"],
    comparableSlugs: ["midjourney"],
    useCaseSlugs: ["ai-image"],
    businessSizeSlugs: ["solo", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["marketing"],
    sourcesExtra: [
      {
        id: "adobe-firefly-plans",
        url: "https://www.adobe.com/products/firefly/plans.html",
        title: "Adobe Firefly plans",
        domains: ["pricing", "plans", "free-plan"],
      },
    ],
  },
  {
    slug: "runway",
    name: "Runway",
    company: "Runway AI, Inc.",
    website: "https://runwayml.com",
    domain: "runwayml.com",
    pricingUrl: "https://runwayml.com/pricing",
    aliases: ["Runway ML", "Runway Gen-4", "Runway Gen-4.5"],
    membershipRole: "primary",
    jobCluster: "ai-video",
    softShortDescription:
      "Generative video studio — Free 125 credits once; Standard $15/editor/mo ($12 annual); Pro $35 ($28 annual); Max $95 ($76 annual).",
    shortDescription:
      "Runway is a generative video studio (Gen-4 / Gen-4.5 and partner models) billed per editor with monthly credits. Free includes a one-time 125-credit deposit. Standard is $15/mo ($12 annual) with 625 credits; Pro $35 ($28 annual) with 2,250; Max $95 ($76 annual) with 9,500. Credits generally do not roll over except Max (one month). Explore/Unlimited was retired for new buyers in 2026. Commercial rights typically start at Pro. Enterprise is custom.",
    vendorPositioning:
      "A complete set of tools for cinematic generative video — credits, not unlimited magic.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 12,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from Runway help/pricing (high confidence). Standard $15/$12, Pro $35/$28, Max $95/$76 per editor; credit allotments 625 / 2,250 / 9,500. Free 125 one-time. Confirm commercial-rights gate and model credit rates live. Affiliate economics excluded.",
    pricingSummary:
      "Free 125 credits (one-time). Standard $12/editor/mo annual. Pro $28. Max $76. Credits per plan. Confirm on runwayml.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description: "One-time 125 credits — concept testing, not a monthly refill.",
      },
      {
        kind: "flat-annual",
        slug: "standard-annual",
        name: "Standard (annual)",
        amount: 12,
        highlighted: true,
        description: "$12/editor/mo billed annually ($15 monthly) — 625 credits/mo.",
      },
      {
        kind: "flat-annual",
        slug: "pro-annual",
        name: "Pro (annual)",
        amount: 28,
        description: "$28/editor/mo billed annually ($35 monthly) — 2,250 credits; commercial rights typical.",
      },
      {
        kind: "flat-annual",
        slug: "max-annual",
        name: "Max (annual)",
        amount: 76,
        description: "$76/editor/mo billed annually ($95 monthly) — 9,500 credits; limited rollover.",
      },
    ],
    featureOverrides: {
      "llm-chat": "limited",
      "image-generation": "supported",
      "video-generation": "supported",
      "voice-tts": "limited",
      "usage-credits": "supported",
      "custom-projects": "supported",
      connectors: "limited",
      "enterprise-admin": "higher-plan-only",
      "data-privacy": "limited",
    },
    aiLines: [
      "AI assistant: limited",
      "AI summaries: not-supported",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [{ integrationSlug: "api", kind: "limited" }],
    limitations: [
      "Credits buy seconds of flagship video — Standard is not an unlimited studio",
      "Free credits do not refill monthly",
      "Commercial use typically needs Pro+",
      "Per-editor billing: extra editors duplicate the plan fee",
      "Not an LLM, meeting-notes, or hosting product",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 7,
      "ai-job-fit": 9,
      "output-quality": 9,
      "workflow-depth": 8,
      integrations: 6,
      "governance-privacy": 6,
      scalability: 7,
      "value-for-money": 7,
      "model-capability": 9,
    },
    scoreRationales: {
      "ease-of-use":
        "Web studio is usable; credit math and model rate cards add onboarding friction.",
      "ai-job-fit":
        "Primary job is generative video — ai-video cluster, not Midjourney stills or ChatGPT.",
      "output-quality":
        "Gen-4.x and partner models are the quality story from vendor docs — not a lab bake-off.",
      "workflow-depth":
        "Editor, assets, upscale, and lip-sync (higher plans) form a real production loop.",
      integrations: "Weaker workspace connectors than LLM assistants; studio-first.",
      "governance-privacy":
        "Enterprise exists; self-serve plans are creator-grade admin.",
      scalability: "Per-editor + credits scale cost quickly; Max/Enterprise for volume.",
      "value-for-money":
        "Annual Standard is a fair trial floor; professional work usually lands on Pro credits. Affiliate economics excluded.",
      "model-capability":
        "Flagship video models plus partner catalog — cluster capability lead.",
    },
    bestFor: [
      "Creators and agencies generating short AI video clips",
      "Teams that can budget credits rather than unlimited renders",
      "Pro buyers who need commercial rights",
    ],
    notIdealFor: [
      "Buyers who need unlimited video for a flat $15",
      "Still-image-only art direction (Midjourney)",
      "Meeting transcription (Otter)",
    ],
    pros: [
      "Dedicated generative video studio",
      "Published credit tiers",
      "Annual 20% off",
      "Pro commercial-rights path",
      "Max for high credit volume",
    ],
    cons: [
      "Credits exhaust fast on flagship models",
      "Free is one-time",
      "Per-editor multiplication",
      "Unlimited plan retired for new buyers",
      "Thin enterprise self-serve admin",
    ],
    keyFeatures: [
      "Text/image-to-video generation",
      "Credit-based model access",
      "Asset library and editor",
      "Upscale / lip-sync (plan-gated)",
      "Per-editor workspaces",
    ],
    whoShouldChoose:
      "Choose Runway when generative video clips are the job — not Midjourney stills and not an LLM chat.",
    whoShouldConsiderAlternatives:
      "Compare Midjourney if stills (with some video) are enough; Firefly if Adobe video credits fit the stack.",
    alternativeSlugs: ["midjourney", "adobe-firefly"],
    competitorSlugs: ["midjourney", "adobe-firefly"],
    comparableSlugs: ["midjourney", "adobe-firefly"],
    useCaseSlugs: ["ai-video"],
    businessSizeSlugs: ["solo", "small-business", "mid-market"],
    teamTypeSlugs: ["marketing"],
    sourcesExtra: [
      {
        id: "runway-credits",
        url: "https://help.runwayml.com/hc/en-us/articles/15124877443219-How-do-credits-work",
        title: "Runway credits",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "otter-ai",
    name: "Otter.ai",
    company: "Otter.ai, Inc.",
    website: "https://otter.ai",
    domain: "otter.ai",
    pricingUrl: "https://otter.ai/pricing",
    aliases: ["Otter", "Otter Pilot", "Otter Meeting Agent"],
    membershipRole: "primary",
    jobCluster: "ai-meeting",
    softShortDescription:
      "AI meeting notes — Free 300 min; Pro $8.33/user/mo annual ($16.99 monthly); Business $19.99 annual ($30 monthly); Enterprise contact.",
    shortDescription:
      "Otter.ai is an AI meeting assistant for live transcription, summaries, and action items with OtterPilot joining Zoom, Meet, and Teams. Basic is free (300 minutes/month, 30-minute conversation cap). Pro is $8.33/user/mo annual or $16.99 monthly (1,200 minutes, 90-minute cap). Business is $19.99/user/mo annual or $30 monthly with much higher/unlimited meeting minutes and admin. Enterprise is contact sales (SSO/SCIM, OtterPilot for Sales).",
    vendorPositioning:
      "The AI meeting agent that joins, transcribes, and summarises so humans do not take notes.",
    pricingModel: "per-seat",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 8.33,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from Otter pricing pages and corroborating 2026 writeups (high confidence). Free 300 min; Pro $8.33 annual / $16.99 monthly; Business $19.99 annual / $30 monthly. Minute caps are the real limiter. Affiliate economics excluded.",
    pricingSummary:
      "Free 300 min/mo. Pro $8.33/user/mo annual. Business $19.99 annual. Enterprise contact. Confirm on otter.ai/pricing.",
    plans: [
      {
        kind: "free",
        slug: "basic",
        name: "Basic",
        description: "300 transcription minutes/mo; 30-minute conversation cap.",
      },
      {
        kind: "per-seat-annual",
        slug: "pro",
        name: "Pro",
        amount: 8.33,
        highlighted: true,
        description: "$8.33/user/mo annual ($16.99 monthly) — 1,200 minutes; 90-minute cap.",
      },
      {
        kind: "per-seat-annual",
        slug: "business",
        name: "Business",
        amount: 19.99,
        description: "$19.99/user/mo annual ($30 monthly) — team admin; high/unlimited meeting minutes.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "SSO/SCIM, domain capture, OtterPilot for Sales — contact sales.",
      },
    ],
    featureOverrides: {
      "llm-chat": "limited",
      "writing-assist": "supported",
      "voice-tts": "not-supported",
      "meeting-notes": "supported",
      "custom-projects": "limited",
      "enterprise-admin": "higher-plan-only",
      "usage-credits": "supported",
      connectors: "supported",
      "data-privacy": "higher-plan-only",
      "analytics-reporting": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: supported",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Minute and per-conversation caps on Free/Pro burn down in a busy meeting week",
      "Not a general LLM assistant or coding IDE",
      "Language coverage is narrower than specialist transcription suites",
      "Sales AI (OtterPilot for Sales) is Enterprise-oriented",
      "Bot-join meeting capture is not the same as a native recorder in every stack",
    ],
    limitationKinds: [
      "plan-restriction",
      "feature-unavailable",
      "other",
      "plan-restriction",
      "other",
    ],
    scores: {
      "ease-of-use": 8,
      "ai-job-fit": 9,
      "output-quality": 8,
      "workflow-depth": 8,
      integrations: 8,
      "governance-privacy": 7,
      scalability: 8,
      "value-for-money": 8,
      "model-capability": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Calendar auto-join and a simple transcript UI are easy for non-technical users.",
      "ai-job-fit":
        "Primary job is AI meeting notes — ai-meeting cluster, not ChatGPT or ElevenLabs.",
      "output-quality":
        "Live transcript + summary/action items are the quality story from vendor packaging.",
      "workflow-depth":
        "OtterPilot, shared workspaces, and CRM/Slack hooks add a post-meeting loop.",
      integrations: "Zoom, Meet, Teams, Slack, and CRM connectors cover the meeting stack.",
      "governance-privacy":
        "Enterprise SSO/SCIM exists; Free/Pro are individual-grade.",
      scalability: "Free → Pro → Business → Enterprise is a clear seat ladder.",
      "value-for-money":
        "Annual Pro at $8.33 is a strong individual floor; Business is the team SKU. Affiliate economics excluded.",
      "model-capability":
        "Meeting-specialist models, not frontier general LLM compute.",
    },
    bestFor: [
      "Individuals drowning in meeting notes",
      "Sales and CS teams that want auto-join transcripts",
      "SMBs that need Business admin without an enterprise RFP",
    ],
    notIdealFor: [
      "Buyers who need a general LLM (ChatGPT)",
      "Voice production (ElevenLabs)",
      "Coding (Cursor / GitHub Copilot)",
    ],
    pros: [
      "Real free tier",
      "Low annual Pro floor",
      "Auto-join Zoom/Meet/Teams",
      "Summaries and action items",
      "Business admin path",
    ],
    cons: [
      "Minute caps on lower plans",
      "Not a general LLM",
      "Enterprise features are quote-gated",
      "Language/specialty transcription limits",
      "Bot-join UX is polarising in some meetings",
    ],
    keyFeatures: [
      "Live transcription",
      "AI summaries and action items",
      "OtterPilot auto-join",
      "Zoom / Meet / Teams",
      "Business analytics and admin",
    ],
    whoShouldChoose:
      "Choose Otter.ai when AI meeting notes and auto-join transcription are the job — not a general LLM or voice studio.",
    whoShouldConsiderAlternatives:
      "Compare Microsoft 365 Copilot if Teams recap is already paid for; ChatGPT if you only paste transcripts into a chat.",
    alternativeSlugs: ["microsoft-copilot", "chatgpt"],
    competitorSlugs: ["microsoft-copilot", "chatgpt"],
    comparableSlugs: ["microsoft-copilot"],
    useCaseSlugs: ["ai-meeting"],
    businessSizeSlugs: ["solo", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "sales"],
    sourcesExtra: [
      {
        id: "otter-pricing",
        url: "https://otter.ai/pricing",
        title: "Otter.ai pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },
];

export const PRODUCTS = COMPACT.map(expandAiProduct);

export const COMPARISON_PAIRS = [
  ["microsoft-copilot", "chatgpt"],
  ["perplexity", "chatgpt"],
  ["github-copilot", "cursor"],
  ["midjourney", "adobe-firefly"],
  ["runway", "midjourney"],
  ["otter-ai", "microsoft-copilot"],
  ["cursor", "chatgpt"],
  ["github-copilot", "chatgpt"],
];
