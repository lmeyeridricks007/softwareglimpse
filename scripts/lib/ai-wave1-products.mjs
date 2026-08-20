/**
 * AI Wave-1 affiliate products (compact).
 * chatgpt, claude, gemini, quillbot, elevenlabs, gamma, wegic, adcreative-ai, mindstudio.
 *
 * Pricing floors grounded 2026-08-18 from first-party / official pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 */
import { expandAiProduct } from "./ai-compact-expand.mjs";

const COMPACT = [
  {
    slug: "chatgpt",
    name: "ChatGPT",
    company: "OpenAI",
    website: "https://chatgpt.com",
    domain: "openai.com",
    pricingUrl: "https://openai.com/chatgpt/pricing",
    aliases: ["ChatGPT Plus", "OpenAI ChatGPT", "GPT-4o"],
    membershipRole: "primary",
    jobCluster: "llm-assistant",
    softShortDescription:
      "General-purpose LLM assistant — Free; Plus $20/mo; Business from $20/seat annual ($25 monthly, 2-seat min); Pro from $100; Enterprise contact.",
    shortDescription:
      "ChatGPT is OpenAI's general-purpose LLM assistant for chat, reasoning, coding help, image generation, and custom GPT projects. Free tier covers everyday chat with usage limits. Plus is $20/mo for individuals. Business is $25/seat/mo monthly or $20/seat/mo on annual billing with a 2-seat minimum. Pro starts around $100/mo for higher compute and model access. Enterprise is contact sales for admin, security, and scale.",
    vendorPositioning:
      "A conversational AI assistant for research, drafting, coding, and everyday work — with optional team admin and enterprise governance.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 20,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from openai.com/chatgpt/pricing (high confidence). Free; Plus $20/mo; Business $25/seat/mo monthly or $20/seat annual (2-seat min); Pro from ~$100/mo; Enterprise contact. Confirm live model caps and usage limits. Affiliate economics excluded from scoring.",
    pricingSummary:
      "Free. Plus $20/mo. Business $25/seat monthly or $20/seat annual (2-seat min). Pro from ~$100/mo. Enterprise contact. Confirm live on openai.com/chatgpt/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description:
          "Free chat with usage limits — entry tier for everyday LLM assistant use.",
      },
      {
        kind: "per-seat-monthly",
        slug: "plus",
        name: "Plus",
        amount: 20,
        highlighted: true,
        description:
          "$20/mo for individuals — higher model access and usage vs Free.",
      },
      {
        kind: "per-seat-annual",
        slug: "business-annual",
        name: "Business (annual)",
        amount: 20,
        minimumSeats: 2,
        description:
          "$20/seat/mo billed annually (2-seat minimum). Team workspace with admin controls.",
      },
      {
        kind: "per-seat-monthly",
        slug: "business-monthly",
        name: "Business (monthly)",
        amount: 25,
        minimumSeats: 2,
        description:
          "$25/seat/mo on monthly billing (2-seat minimum). Same Business packaging at higher monthly list.",
      },
      {
        kind: "per-seat-monthly",
        slug: "pro",
        name: "Pro",
        amount: 100,
        description:
          "From ~$100/mo — higher compute, advanced models, and expanded usage for power users.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description:
          "Enterprise — contact sales for advanced security, admin, and custom deployment.",
      },
    ],
    featureOverrides: {
      "llm-chat": "supported",
      "reasoning-models": "supported",
      "writing-assist": "supported",
      "image-generation": "supported",
      "voice-tts": "limited",
      "presentation-generation": "limited",
      "website-generation": "not-supported",
      "ad-creative-generation": "not-supported",
      "agent-builder": "limited",
      "custom-projects": "supported",
      "enterprise-admin": "higher-plan-only",
      "usage-credits": "limited",
      "connectors": "supported",
      "data-privacy": "higher-plan-only",
      "analytics-reporting": "higher-plan-only",
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
      "Free tier has usage and model caps that frustrate power users",
      "Business enforces a 2-seat minimum — solo buyers pay for unused seats",
      "Pro and Enterprise tiers gate the deepest model/compute access",
      "Not a specialist voice, presentation, or ad-creative platform",
      "Team admin and enterprise governance require paid Business+ packaging",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 9,
      "ai-job-fit": 9,
      "output-quality": 9,
      "workflow-depth": 8,
      integrations: 9,
      "governance-privacy": 8,
      scalability: 9,
      "value-for-money": 8,
      "model-capability": 9,
    },
    scoreRationales: {
      "ease-of-use":
        "ChatGPT is the mainstream LLM assistant with approachable chat UX and custom GPT projects — low friction for non-technical users. Score from first-party packaging, not hands-on lab testing.",
      "ai-job-fit":
        "Primary job is general-purpose LLM assistant — chat, reasoning, coding, and custom projects match the llm-assistant cluster strongly. Scored inside LLM peers, not against QuillBot or ElevenLabs.",
      "output-quality":
        "OpenAI's flagship models and reasoning modes are category-leading for breadth — strong output across writing, code, and multimodal tasks within the LLM cluster.",
      "workflow-depth":
        "Custom GPTs, memory, file uploads, and team workspaces add workflow depth beyond bare chat — held at 8 vs deepest agent-builder platforms.",
      integrations:
        "Native connectors for Slack, Teams, Google Workspace plus Zapier-style automation — top-tier ecosystem for an LLM assistant.",
      "governance-privacy":
        "Business and Enterprise publish admin controls and data policies; deepest governance is sales-gated. Strong for mid-market teams at Business tier.",
      scalability:
        "Clear Free → Plus → Business → Pro → Enterprise ladder supports individual through enterprise scale; 2-seat Business minimum is the main micro-team friction.",
      "value-for-money":
        "Free tier and $20 Plus are competitive entry points; Business 2-seat minimum and Pro pricing raise TCO for small teams. Capability justifies spend at scale. Affiliate economics excluded.",
      "model-capability":
        "Flagship OpenAI models, reasoning modes, and image generation on paid tiers — among the strongest model capability in the LLM cluster.",
    },
    bestFor: [
      "Teams and individuals wanting a mainstream general-purpose LLM assistant",
      "Buyers who need custom GPT projects and broad model access on Plus/Pro",
      "Orgs standardizing on OpenAI with Business admin and connector depth",
    ],
    notIdealFor: [
      "Buyers whose primary job is paraphrasing/grammar only (QuillBot)",
      "Voice/TTS production teams (ElevenLabs)",
      "Paid-media teams needing ad-creative generation (AdCreative.ai)",
    ],
    pros: [
      "Category-leading LLM assistant breadth and brand recognition",
      "Free tier plus clear Plus/Business/Pro ladder",
      "Custom GPT projects and strong connector ecosystem",
      "Strong reasoning and multimodal output on paid tiers",
      "Enterprise path for admin and governance",
    ],
    cons: [
      "Free usage and model caps",
      "Business 2-seat minimum",
      "Pro/Enterprise gates deepest models",
      "Not a specialist writing, voice, or ad tool",
      "Governance depth requires paid team tiers",
    ],
    keyFeatures: [
      "LLM chat and reasoning assistants",
      "Custom GPT projects",
      "Image generation",
      "Coding and file-analysis workflows",
      "Team workspace and admin (Business+)",
      "Slack, Teams, Google Workspace connectors",
    ],
    whoShouldChoose:
      "Choose ChatGPT when a general-purpose LLM assistant with custom projects, connectors, and a clear team upgrade path is the primary job.",
    whoShouldConsiderAlternatives:
      "Compare Claude for long-context writing and reasoning style, Gemini for Google Workspace integration, and QuillBot if you only need paraphrasing — not a full LLM.",
    alternativeSlugs: ["claude", "gemini"],
    competitorSlugs: ["claude", "gemini", "perplexity", "microsoft-copilot"],
    comparableSlugs: ["claude", "gemini"],
    useCaseSlugs: ["llm-assistant"],
    businessSizeSlugs: ["solo", "micro", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "marketing", "founders"],
    sourcesExtra: [
      {
        id: "chatgpt-pricing-official",
        url: "https://openai.com/chatgpt/pricing",
        title: "ChatGPT Pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },

  {
    slug: "claude",
    name: "Claude",
    company: "Anthropic",
    website: "https://claude.ai",
    domain: "anthropic.com",
    pricingUrl: "https://claude.com/pricing",
    aliases: ["Claude AI", "Anthropic Claude", "Claude Pro"],
    membershipRole: "primary",
    jobCluster: "llm-assistant",
    softShortDescription:
      "LLM assistant with strong writing and reasoning — Free; Pro $20/mo ($17 annual); Max from $100; Team Standard $20/seat annual ($25 monthly, 2-seat min).",
    shortDescription:
      "Claude is Anthropic's LLM assistant for chat, long-document analysis, coding help, and team collaboration. Free covers everyday use with limits. Pro is $20/mo or ~$17/mo on annual billing for higher usage and model access. Max starts around $100/mo for power users. Team Standard is $20/seat/mo annual or $25/seat monthly with a 2-seat minimum for shared workspaces.",
    vendorPositioning:
      "A helpful, honest, and harmless AI assistant — strong for writing, analysis, and coding with long-context workflows.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 17,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from claude.com/pricing (high confidence). Free; Pro $20/mo or ~$17/mo annual; Max from ~$100/mo; Team Standard $20/seat annual or $25/seat monthly (2-seat min). Confirm live usage caps. Affiliate economics excluded from scoring.",
    pricingSummary:
      "Free. Pro $20/mo (~$17 annual). Max from ~$100/mo. Team Standard $20/seat annual or $25/seat monthly (2-seat min). Confirm live on claude.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description: "Free chat with usage limits — entry LLM assistant tier.",
      },
      {
        kind: "per-seat-annual",
        slug: "pro-annual",
        name: "Pro (annual)",
        amount: 17,
        highlighted: true,
        description:
          "~$17/seat/mo billed annually — higher usage and model access vs Free.",
      },
      {
        kind: "per-seat-monthly",
        slug: "pro-monthly",
        name: "Pro (monthly)",
        amount: 20,
        description: "$20/mo on monthly billing — individual Pro packaging.",
      },
      {
        kind: "per-seat-monthly",
        slug: "max",
        name: "Max",
        amount: 100,
        description:
          "From ~$100/mo — expanded usage and priority access for power users.",
      },
      {
        kind: "per-seat-annual",
        slug: "team-standard-annual",
        name: "Team Standard (annual)",
        amount: 20,
        minimumSeats: 2,
        description:
          "$20/seat/mo billed annually (2-seat minimum). Shared team workspace.",
      },
      {
        kind: "per-seat-monthly",
        slug: "team-standard-monthly",
        name: "Team Standard (monthly)",
        amount: 25,
        minimumSeats: 2,
        description:
          "$25/seat/mo on monthly billing (2-seat minimum). Team workspace at monthly list.",
      },
    ],
    featureOverrides: {
      "llm-chat": "supported",
      "reasoning-models": "supported",
      "writing-assist": "supported",
      "image-generation": "limited",
      "voice-tts": "not-supported",
      "presentation-generation": "not-supported",
      "website-generation": "not-supported",
      "ad-creative-generation": "not-supported",
      "agent-builder": "limited",
      "custom-projects": "supported",
      "enterprise-admin": "higher-plan-only",
      "usage-credits": "limited",
      "connectors": "supported",
      "data-privacy": "higher-plan-only",
      "analytics-reporting": "limited",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: supported",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Free tier usage caps limit heavy document and coding workflows",
      "Team Standard enforces 2-seat minimum on paid team packaging",
      "Max tier required for highest usage — raises individual TCO",
      "Connector ecosystem trails ChatGPT breadth",
      "Not a specialist voice, presentation, or ad-creative platform",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "plan-restriction",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 9,
      "ai-job-fit": 9,
      "output-quality": 9,
      "workflow-depth": 8,
      integrations: 7,
      "governance-privacy": 8,
      scalability: 8,
      "value-for-money": 8,
      "model-capability": 9,
    },
    scoreRationales: {
      "ease-of-use":
        "Claude's chat UX and Projects feature are approachable for writing and analysis workflows — strong for non-technical users. Score from first-party packaging, not lab testing.",
      "ai-job-fit":
        "Primary job is LLM assistant with emphasis on long-context writing and reasoning — excellent llm-assistant cluster fit. Not scored against QuillBot or ElevenLabs.",
      "output-quality":
        "Anthropic models are widely regarded for writing quality and careful reasoning — top-tier output within the LLM cluster alongside ChatGPT.",
      "workflow-depth":
        "Projects, artifacts, and team workspaces add depth beyond bare chat — held at 8 vs full agent-builder platforms like MindStudio.",
      integrations:
        "Slack and Google Workspace connectors plus Zapier-style automation cover common stacks; ecosystem is narrower than ChatGPT's connector breadth.",
      "governance-privacy":
        "Team and enterprise packaging publish admin and data-handling policies — strong mid-market posture with sales-gated enterprise depth.",
      scalability:
        "Free → Pro → Max → Team ladder supports growth; 2-seat team minimum and Max pricing are friction for solo micro buyers.",
      "value-for-money":
        "Annual Pro at ~$17/mo is competitive; Max and team minimums raise TCO for power users and tiny teams. Capability strong at Pro tier. Affiliate economics excluded.",
      "model-capability":
        "Flagship Claude models with reasoning and long-context strength — among the strongest model capability in the LLM peer set.",
    },
    bestFor: [
      "Writers and analysts who prioritize long-document and reasoning quality",
      "Teams wanting a ChatGPT alternative with Projects and team workspaces",
      "Buyers who value careful output tone for customer-facing drafts",
    ],
    notIdealFor: [
      "Orgs needing the broadest third-party connector catalog (ChatGPT leads)",
      "Google Workspace-native buyers who want Gemini integration depth",
      "Specialist voice, presentation, or ad-creative production jobs",
    ],
    pros: [
      "Top-tier writing and reasoning output in LLM cluster",
      "Projects and long-context workflows",
      "Annual Pro discount (~$17/mo)",
      "Clear Team Standard packaging for small teams",
      "Strong governance narrative for enterprise buyers",
    ],
    cons: [
      "Connector ecosystem narrower than ChatGPT",
      "Team 2-seat minimum",
      "Max tier needed for highest usage",
      "Limited image/voice specialist depth",
      "Free tier caps heavy workflows",
    ],
    keyFeatures: [
      "LLM chat with long-context analysis",
      "Projects and artifact workflows",
      "Coding and document assistance",
      "Team Standard shared workspaces",
      "Slack and Google Workspace connectors",
      "Max tier for expanded usage",
    ],
    whoShouldChoose:
      "Choose Claude when writing quality, long-context analysis, and reasoning are the primary LLM assistant job — especially if ChatGPT's tone or connectors are not the deciding factor.",
    whoShouldConsiderAlternatives:
      "Compare ChatGPT for connector breadth and custom GPTs, Gemini for Google-native workflows, and QuillBot for lightweight paraphrasing only.",
    alternativeSlugs: ["chatgpt", "gemini"],
    competitorSlugs: ["chatgpt", "gemini", "perplexity", "microsoft-copilot"],
    comparableSlugs: ["chatgpt", "gemini"],
    useCaseSlugs: ["llm-assistant"],
    businessSizeSlugs: ["solo", "micro", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "marketing", "founders"],
    sourcesExtra: [
      {
        id: "claude-pricing-official",
        url: "https://claude.com/pricing",
        title: "Claude Pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },

  {
    slug: "gemini",
    name: "Gemini",
    company: "Google",
    website: "https://gemini.google.com",
    domain: "google.com",
    pricingUrl: "https://gemini.google/subscriptions/",
    aliases: ["Google Gemini", "Gemini Advanced", "Google AI"],
    membershipRole: "primary",
    jobCluster: "llm-assistant",
    softShortDescription:
      "Google LLM assistant — Free; Google AI Pro $19.99/mo; Ultra from $99.99/mo for highest model access.",
    shortDescription:
      "Gemini is Google's LLM assistant for chat, research, coding help, and Workspace-integrated workflows. Free covers everyday use with limits. Google AI Pro is $19.99/mo for expanded model access and Google One benefits. Ultra starts around $99.99/mo for the deepest Gemini model access and usage. Strong fit for teams already on Google Workspace.",
    vendorPositioning:
      "Google's AI assistant — chat, reasoning, and productivity integrated with Google apps and subscriptions.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 19.99,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from gemini.google/subscriptions/ (high confidence). Free; Google AI Pro $19.99/mo; Ultra from ~$99.99/mo. Bundled Google One/Workspace benefits may affect effective TCO. Confirm live caps. Affiliate economics excluded from scoring.",
    pricingSummary:
      "Free. Google AI Pro $19.99/mo. Ultra from ~$99.99/mo. Confirm live on gemini.google/subscriptions/.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description: "Free Gemini chat with usage limits.",
      },
      {
        kind: "per-seat-monthly",
        slug: "ai-pro",
        name: "Google AI Pro",
        amount: 19.99,
        highlighted: true,
        description:
          "$19.99/mo — expanded Gemini model access plus Google One subscription benefits.",
      },
      {
        kind: "per-seat-monthly",
        slug: "ultra",
        name: "Ultra",
        amount: 99.99,
        description:
          "From ~$99.99/mo — deepest Gemini model access and highest usage tier.",
      },
    ],
    featureOverrides: {
      "llm-chat": "supported",
      "reasoning-models": "supported",
      "writing-assist": "supported",
      "image-generation": "supported",
      "voice-tts": "limited",
      "presentation-generation": "limited",
      "website-generation": "not-supported",
      "ad-creative-generation": "not-supported",
      "agent-builder": "limited",
      "custom-projects": "limited",
      "enterprise-admin": "higher-plan-only",
      "usage-credits": "limited",
      "connectors": "supported",
      "data-privacy": "limited",
      "analytics-reporting": "limited",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: supported",
      "AI automation: limited",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "slack", kind: "limited" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Ultra tier (~$99.99/mo) gates deepest model access — raises power-user TCO",
      "Google subscription bundling complicates apples-to-apples pricing vs ChatGPT Plus",
      "Custom project / agent depth trails ChatGPT custom GPTs and MindStudio",
      "Enterprise governance packaging is less transparent than OpenAI Business",
      "Slack-native depth trails ChatGPT connector ecosystem",
    ],
    limitationKinds: [
      "plan-restriction",
      "other",
      "feature-unavailable",
      "other",
      "other",
    ],
    scores: {
      "ease-of-use": 8,
      "ai-job-fit": 8,
      "output-quality": 8,
      "workflow-depth": 8,
      integrations: 9,
      "governance-privacy": 7,
      scalability: 8,
      "value-for-money": 8,
      "model-capability": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Gemini is approachable for Google users with familiar chat UX and Workspace surfaces — strong for teams already on Google. Score from first-party packaging, not lab testing.",
      "ai-job-fit":
        "Primary job is LLM assistant with Google-native integration — strong llm-assistant cluster fit, especially for Workspace-centric buyers. Scored inside LLM peers.",
      "output-quality":
        "Gemini flagship models deliver competitive chat and multimodal output — strong but held slightly below ChatGPT/Claude peaks in cluster-relative scoring.",
      "workflow-depth":
        "Workspace integration (Docs, Gmail, Drive) adds productivity workflow depth — good for Google-centric teams; custom agent depth is lighter.",
      integrations:
        "Native Google Workspace integration is a category strength — top score for Google-stack buyers; narrower outside Google ecosystem.",
      "governance-privacy":
        "Enterprise and Workspace admin paths exist but packaging is less transparent than OpenAI Business — held at 7 for mid-market clarity.",
      scalability:
        "Free → Pro → Ultra ladder plus Workspace enterprise paths support growth; Ultra pricing is the main individual-scale friction.",
      "value-for-money":
        "Pro at $19.99/mo is competitive and bundles Google One benefits — value depends on whether buyers want Google subscription packaging. Affiliate economics excluded.",
      "model-capability":
        "Strong flagship models on Pro/Ultra — competitive in cluster but held at 8 vs ChatGPT/Claude peaks on published breadth.",
    },
    bestFor: [
      "Google Workspace-centric teams wanting an integrated LLM assistant",
      "Buyers who value Gemini inside Docs, Gmail, and Drive workflows",
      "Individuals already paying for Google One who want AI bundled",
    ],
    notIdealFor: [
      "Microsoft- or Slack-first stacks without Google Workspace",
      "Buyers needing the deepest custom GPT / agent-builder workflows",
      "Specialist voice, presentation, or ad-creative production jobs",
    ],
    pros: [
      "Deep Google Workspace native integration",
      "Competitive Pro pricing at $19.99/mo",
      "Multimodal chat and image capabilities",
      "Clear Free → Pro → Ultra ladder",
      "Familiar UX for Google users",
    ],
    cons: [
      "Ultra tier expensive for individuals",
      "Bundled Google One complicates pricing comparison",
      "Custom project depth trails ChatGPT",
      "Governance packaging less transparent",
      "Weaker outside Google ecosystem",
    ],
    keyFeatures: [
      "LLM chat and reasoning",
      "Google Workspace integration",
      "Multimodal image understanding",
      "Google AI Pro and Ultra tiers",
      "Gmail, Docs, Drive assistant surfaces",
      "Google One subscription benefits (Pro)",
    ],
    whoShouldChoose:
      "Choose Gemini when Google Workspace is your productivity hub and you want an LLM assistant embedded in Google apps — not when connectors outside Google are the priority.",
    whoShouldConsiderAlternatives:
      "Compare ChatGPT for connector breadth, Claude for writing/reasoning style, and MindStudio if agent-building is the actual job.",
    alternativeSlugs: ["chatgpt", "claude"],
    competitorSlugs: ["chatgpt", "claude", "microsoft-copilot", "perplexity"],
    comparableSlugs: ["chatgpt", "claude"],
    useCaseSlugs: ["llm-assistant"],
    businessSizeSlugs: ["solo", "micro", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "marketing", "founders"],
    sourcesExtra: [
      {
        id: "gemini-subscriptions-official",
        url: "https://gemini.google/subscriptions/",
        title: "Google AI Subscriptions",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },

  {
    slug: "quillbot",
    name: "QuillBot",
    company: "QuillBot",
    website: "https://quillbot.com",
    domain: "quillbot.com",
    pricingUrl: "https://quillbot.com/premium",
    aliases: ["QuillBot Premium", "Quillbot"],
    membershipRole: "primary",
    jobCluster: "ai-writing",
    softShortDescription:
      "AI writing and paraphrasing assistant — Free; Premium ~$8.33/mo annual ($99.95/yr).",
    shortDescription:
      "QuillBot is an AI writing assistant for paraphrasing, grammar, summarization, and citation tools — not a full LLM chat platform. Free covers basic rewriting with limits. Premium is ~$8.33/mo on annual billing ($99.95/yr) for unlimited paraphrasing, advanced grammar, and plagiarism checks.",
    vendorPositioning:
      "An AI writing companion for paraphrasing, grammar, and clarity — fast edits without opening a full LLM chat.",
    pricingModel: "flat",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 8.33,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from quillbot.com/premium (high confidence). Free; Premium ~$8.33/mo annual ($99.95/yr). Monthly list higher — confirm live. Affiliate economics excluded from scoring.",
    pricingSummary:
      "Free. Premium ~$8.33/mo annual ($99.95/yr). Confirm monthly list on quillbot.com/premium.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description: "Free paraphrasing and basic writing tools with usage limits.",
      },
      {
        kind: "flat-annual",
        slug: "premium",
        name: "Premium",
        amount: 8.33,
        highlighted: true,
        description:
          "~$8.33/mo billed annually ($99.95/yr) — unlimited paraphrasing, advanced grammar, plagiarism checker.",
      },
    ],
    featureOverrides: {
      "llm-chat": "limited",
      "reasoning-models": "not-supported",
      "writing-assist": "supported",
      "image-generation": "not-supported",
      "voice-tts": "not-supported",
      "presentation-generation": "not-supported",
      "website-generation": "not-supported",
      "ad-creative-generation": "not-supported",
      "agent-builder": "not-supported",
      "custom-projects": "not-supported",
      "enterprise-admin": "not-supported",
      "usage-credits": "not-supported",
      "connectors": "limited",
      "data-privacy": "limited",
      "analytics-reporting": "limited",
    },
    aiLines: [
      "AI assistant: limited",
      "AI summaries: supported",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "limited" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Not a full LLM assistant — limited chat/reasoning vs ChatGPT or Claude",
      "No voice, presentation, or ad-creative generation",
      "Enterprise admin and team governance are light vs LLM business tiers",
      "Connector depth trails general LLM platforms",
      "Reasoning and coding workflows are outside the product's primary job",
    ],
    limitationKinds: [
      "feature-unavailable",
      "feature-unavailable",
      "feature-unavailable",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 9,
      "ai-job-fit": 9,
      "output-quality": 7,
      "workflow-depth": 7,
      integrations: 6,
      "governance-privacy": 6,
      scalability: 7,
      "value-for-money": 9,
      "model-capability": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "QuillBot is built for fast paraphrasing and grammar fixes — minimal learning curve for students and content teams. Score from first-party positioning, not lab testing.",
      "ai-job-fit":
        "Primary job is AI writing/paraphrasing — excellent ai-writing cluster fit. Not scored as an LLM-assistant peer to ChatGPT.",
      "output-quality":
        "Strong paraphrasing and grammar output for editing tasks — held at 7 vs flagship LLM reasoning depth on open-ended research.",
      "workflow-depth":
        "Summarizer, citation generator, and plagiarism tools add writing workflow depth — narrower than full LLM project workflows.",
      integrations:
        "Browser extension and basic app connectors cover writing surfaces; ecosystem is lighter than LLM assistant platforms.",
      "governance-privacy":
        "Consumer-grade privacy posture — adequate for individuals and SMB content teams, not enterprise LLM governance depth.",
      scalability:
        "Free → Premium ladder works for individuals through small content teams; lacks team admin at LLM Business scale.",
      "value-for-money":
        "Premium at ~$8.33/mo annual is excellent value for dedicated writing assistance — far cheaper than LLM Plus tiers for the paraphrasing job. Affiliate economics excluded.",
      "model-capability":
        "Specialized writing models, not general reasoning flagship models — scored low on model-capability vs LLM peers by design.",
    },
    bestFor: [
      "Students and writers who primarily need paraphrasing and grammar",
      "Content teams wanting a lightweight writing assistant vs full LLM subscription",
      "Budget-conscious buyers who do not need chat/reasoning depth",
    ],
    notIdealFor: [
      "Teams needing a general-purpose LLM assistant (ChatGPT, Claude, Gemini)",
      "Coding, research, or agent-building workflows",
      "Enterprise governance and admin requirements",
    ],
    pros: [
      "Excellent value at ~$8.33/mo annual",
      "Strong paraphrasing and grammar focus",
      "Free tier for basic rewriting",
      "Fast editing workflow vs full LLM chat",
      "Plagiarism and citation tools on Premium",
    ],
    cons: [
      "Not a full LLM assistant",
      "Limited reasoning and coding capability",
      "Light enterprise governance",
      "Narrow connector ecosystem",
      "Cross-cluster comparison to ChatGPT is apples-to-oranges",
    ],
    keyFeatures: [
      "AI paraphrasing and rewriting",
      "Grammar and spell checking",
      "Summarization tools",
      "Plagiarism checker (Premium)",
      "Citation generator",
      "Browser extension workflows",
    ],
    whoShouldChoose:
      "Choose QuillBot when paraphrasing, grammar, and quick writing edits are the job — not when you need a general LLM for research and coding.",
    whoShouldConsiderAlternatives:
      "Compare ChatGPT or Claude if you need full LLM chat and reasoning; stay on QuillBot if writing-assist is the only recurring task.",
    alternativeSlugs: ["chatgpt"],
    competitorSlugs: ["grammarly", "wordtune", "chatgpt", "claude"],
    comparableSlugs: ["chatgpt"],
    useCaseSlugs: ["ai-writing"],
    businessSizeSlugs: ["solo", "micro", "small-business"],
    teamTypeSlugs: ["marketing", "founders"],
    sourcesExtra: [
      {
        id: "quillbot-premium-official",
        url: "https://quillbot.com/premium",
        title: "QuillBot Premium",
        domains: ["pricing", "plans", "free-plan"],
      },
    ],
    catalogueSourceId: "aff-quillbot",
    affiliateUrl: "https://try.quillbot.com/db3a97ce993a",
  },

  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    company: "ElevenLabs",
    website: "https://elevenlabs.io",
    domain: "elevenlabs.io",
    pricingUrl: "https://elevenlabs.io/pricing",
    aliases: ["Eleven Labs", "11Labs"],
    membershipRole: "primary",
    jobCluster: "ai-voice",
    softShortDescription:
      "AI voice and text-to-speech — Free 10k credits; Starter $6/mo; Creator $22/mo ($11 first-month promo).",
    shortDescription:
      "ElevenLabs is an AI voice platform for text-to-speech, voice cloning, and audio generation. Free includes ~10k credits/month. Starter is $6/mo for expanded credits and commercial basics. Creator is $22/mo (promotional $11 first month) for higher credit pools and professional voice workflows.",
    vendorPositioning:
      "The most realistic AI voice platform — text-to-speech, voice cloning, and dubbing for creators and product teams.",
    pricingModel: "usage",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 6,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from elevenlabs.io/pricing (high confidence). Free ~10k credits/mo; Starter $6/mo; Creator $22/mo ($11 first-month promo cited). Credit usage varies by model and output length. Confirm live credit tables. Affiliate economics excluded from scoring.",
    pricingSummary:
      "Free ~10k credits/mo. Starter $6/mo. Creator $22/mo ($11 first-month promo). Confirm credit tables on elevenlabs.io/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        limits: { creditsPerMonth: 10000 },
        description: "Free tier with ~10k credits/month for evaluation and light use.",
      },
      {
        kind: "per-seat-monthly",
        slug: "starter",
        name: "Starter",
        amount: 6,
        description: "$6/mo — expanded credits and commercial-use basics.",
      },
      {
        kind: "per-seat-monthly",
        slug: "creator",
        name: "Creator",
        amount: 22,
        highlighted: true,
        description:
          "$22/mo — higher credit pool for professional voice workflows ($11 first-month promo when offered).",
      },
    ],
    featureOverrides: {
      "llm-chat": "not-supported",
      "reasoning-models": "not-supported",
      "writing-assist": "limited",
      "image-generation": "not-supported",
      "voice-tts": "supported",
      "presentation-generation": "not-supported",
      "website-generation": "not-supported",
      "ad-creative-generation": "limited",
      "agent-builder": "not-supported",
      "custom-projects": "limited",
      "enterprise-admin": "higher-plan-only",
      "usage-credits": "supported",
      "connectors": "limited",
      "data-privacy": "limited",
      "analytics-reporting": "limited",
    },
    aiLines: [
      "AI assistant: not-supported",
      "AI summaries: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "zapier", kind: "zapier-style" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Credit-based pricing — heavy production usage can spike TCO unpredictably",
      "Not an LLM chat, presentation, or website builder",
      "Voice cloning and commercial rights vary by tier — confirm license terms",
      "Connector ecosystem is API/Zapier-first vs native app breadth",
      "Cross-cluster comparison to Gamma is landscape-only — different primary jobs",
    ],
    limitationKinds: [
      "other",
      "feature-unavailable",
      "plan-restriction",
      "other",
      "other",
    ],
    scores: {
      "ease-of-use": 8,
      "ai-job-fit": 9,
      "output-quality": 9,
      "workflow-depth": 8,
      integrations: 7,
      "governance-privacy": 7,
      scalability: 8,
      "value-for-money": 8,
      "model-capability": 9,
    },
    scoreRationales: {
      "ease-of-use":
        "ElevenLabs UI and API are approachable for creators generating voice from text — straightforward for the voice job. Score from first-party packaging, not lab testing.",
      "ai-job-fit":
        "Primary job is AI voice/TTS and voice cloning — category-leading ai-voice cluster fit. Not scored against ChatGPT or Gamma.",
      "output-quality":
        "Widely cited for realistic TTS and voice cloning quality — top-tier output within the voice cluster.",
      "workflow-depth":
        "Voice library, dubbing, and API workflows support production pipelines — strong depth for voice specialists.",
      integrations:
        "API-first with Zapier-style connectors — solid for developer and automation stacks; fewer native SaaS connectors than LLM platforms.",
      "governance-privacy":
        "Commercial licensing and voice-cloning policies are tier-dependent — adequate for creators and SMB product teams with tier review.",
      scalability:
        "Free → Starter → Creator plus enterprise paths support growing production volume; credit math is the scaling complexity.",
      "value-for-money":
        "Free 10k credits and $6 Starter are accessible entry points; credit consumption on heavy production can raise TCO. Affiliate economics excluded.",
      "model-capability":
        "Flagship voice models and cloning — among the strongest model capability in the ai-voice cluster.",
    },
    bestFor: [
      "Creators and product teams needing realistic TTS and voice cloning",
      "Video, podcast, and app teams embedding voice via API",
      "Buyers evaluating voice quality before committing to higher credit tiers",
    ],
    notIdealFor: [
      "Teams needing LLM chat or presentation generation",
      "Buyers who cannot model credit-based usage costs",
      "Orgs needing full enterprise voice governance without sales review",
    ],
    pros: [
      "Category-leading voice realism",
      "Generous free 10k credits",
      "Low $6 Starter entry",
      "API for product embedding",
      "Voice cloning and dubbing workflows",
    ],
    cons: [
      "Credit-based TCO can spike",
      "Not an LLM or presentation tool",
      "Commercial rights tier-dependent",
      "API-first connector story",
      "Landscape vs Gamma is different job cluster",
    ],
    keyFeatures: [
      "Text-to-speech generation",
      "Voice cloning",
      "Dubbing and multilingual voice",
      "Voice library management",
      "API access",
      "Credit-based usage tiers",
    ],
    whoShouldChoose:
      "Choose ElevenLabs when AI voice production — TTS, cloning, or API embedding — is the primary job, not when you need slides or LLM chat.",
    whoShouldConsiderAlternatives:
      "Compare Gamma only for landscape context (voice vs presentations are different jobs); use PlayHT or Murf as voice peers when onboarded.",
    alternativeSlugs: ["gamma"],
    competitorSlugs: ["playht", "murf", "speechify", "descript"],
    comparableSlugs: ["gamma"],
    useCaseSlugs: ["ai-voice"],
    businessSizeSlugs: ["solo", "micro", "small-business", "mid-market"],
    teamTypeSlugs: ["marketing", "founders"],
    sourcesExtra: [
      {
        id: "elevenlabs-pricing-official",
        url: "https://elevenlabs.io/pricing",
        title: "ElevenLabs Pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
    catalogueSourceId: "aff-elevenlabs",
    affiliateUrl: "https://try.elevenlabs.io/2tsfz1jc3rce",
  },

  {
    slug: "gamma",
    name: "Gamma",
    company: "Gamma",
    website: "https://gamma.app",
    domain: "gamma.app",
    pricingUrl: "https://gamma.app/pricing",
    aliases: ["Gamma App", "Gamma presentations"],
    membershipRole: "primary",
    jobCluster: "ai-presentations",
    softShortDescription:
      "AI presentation and document generator — Free; Plus $8/mo annual ($10 monthly).",
    shortDescription:
      "Gamma is an AI presentation and document platform that generates slide decks, docs, and webpages from prompts. Free covers basic creation with limits. Plus is $8/mo on annual billing ($10/mo monthly) for premium AI models, branding removal, and expanded exports.",
    vendorPositioning:
      "A new medium for presenting ideas — AI-generated decks, docs, and sites without starting from blank slides.",
    pricingModel: "flat",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 8,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from gamma.app/pricing (high confidence). Free; Plus $8/mo annual ($10/mo monthly). Confirm live AI credit caps. Affiliate economics excluded from scoring.",
    pricingSummary:
      "Free. Plus $8/mo annual ($10/mo monthly). Confirm live on gamma.app/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description: "Free AI deck and doc creation with usage limits.",
      },
      {
        kind: "flat-annual",
        slug: "plus",
        name: "Plus",
        amount: 8,
        highlighted: true,
        description:
          "$8/mo billed annually ($10/mo monthly) — premium AI, branding removal, expanded exports.",
      },
    ],
    featureOverrides: {
      "llm-chat": "limited",
      "reasoning-models": "not-supported",
      "writing-assist": "supported",
      "image-generation": "supported",
      "voice-tts": "not-supported",
      "presentation-generation": "supported",
      "website-generation": "limited",
      "ad-creative-generation": "limited",
      "agent-builder": "not-supported",
      "custom-projects": "limited",
      "enterprise-admin": "limited",
      "usage-credits": "limited",
      "connectors": "limited",
      "data-privacy": "limited",
      "analytics-reporting": "limited",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: supported",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "slack", kind: "limited" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Not a full LLM assistant — presentation/doc generation is the core job",
      "Website generation is limited vs dedicated AI website builders (Wegic)",
      "Ad-creative depth trails AdCreative.ai for paid-media teams",
      "Enterprise admin and governance are lighter than LLM business tiers",
      "Voice/TTS production requires ElevenLabs or similar",
    ],
    limitationKinds: [
      "feature-unavailable",
      "feature-unavailable",
      "feature-unavailable",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 9,
      "ai-job-fit": 9,
      "output-quality": 8,
      "workflow-depth": 7,
      integrations: 6,
      "governance-privacy": 6,
      scalability: 7,
      "value-for-money": 9,
      "model-capability": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Gamma's prompt-to-deck flow is fast for non-designers — minimal PowerPoint skills required. Score from first-party positioning, not lab testing.",
      "ai-job-fit":
        "Primary job is AI presentation/document generation — excellent ai-presentations cluster fit. Not scored as an LLM peer.",
      "output-quality":
        "Generated decks and docs are polished for SMB marketing and founder pitches — strong within presentation cluster, held below flagship LLM reasoning.",
      "workflow-depth":
        "Templates, themes, and export options cover presentation workflows — narrower than full work OS or agent-builder depth.",
      integrations:
        "Google Workspace and basic connectors cover common sharing; ecosystem is lighter than LLM or marketing suites.",
      "governance-privacy":
        "Consumer/SMB posture adequate for pitch decks and marketing collateral — not enterprise LLM governance depth.",
      scalability:
        "Free → Plus supports individuals and small teams; lacks seat-based enterprise admin at scale.",
      "value-for-money":
        "Plus at $8/mo annual is excellent value for AI deck generation vs hiring design time — strong value in cluster. Affiliate economics excluded.",
      "model-capability":
        "Presentation-focused AI models — capable for deck generation but not general reasoning flagship models.",
    },
    bestFor: [
      "Founders and marketers who need fast AI-generated pitch decks",
      "Teams wanting docs and microsites without PowerPoint or Figma skills",
      "Budget buyers who need presentation output, not full LLM chat",
    ],
    notIdealFor: [
      "Paid-media teams needing ad-creative generation (AdCreative.ai)",
      "Full website builder jobs (Wegic)",
      "Enterprise teams needing LLM admin and connector depth",
    ],
    pros: [
      "Excellent value at $8/mo annual",
      "Fast prompt-to-deck workflow",
      "Free tier for evaluation",
      "Polished visual output for SMB use",
      "Docs and webpage modes beyond slides",
    ],
    cons: [
      "Not a full LLM assistant",
      "Limited website builder depth",
      "Light ad-creative capability",
      "Narrow connector ecosystem",
      "Enterprise governance is light",
    ],
    keyFeatures: [
      "AI presentation generation",
      "AI document creation",
      "Theme and branding customization (Plus)",
      "Export to PDF and share links",
      "Image generation in decks",
      "Webpage-style Gamma sites",
    ],
    whoShouldChoose:
      "Choose Gamma when AI-generated presentations and documents are the primary job — not when you need voice production or full websites.",
    whoShouldConsiderAlternatives:
      "Compare Wegic for website building, AdCreative.ai for ad creative, and ChatGPT if you need general LLM chat instead of deck generation.",
    alternativeSlugs: ["wegic", "adcreative-ai"],
    competitorSlugs: ["beautiful-ai", "tome", "canva", "wegic"],
    comparableSlugs: ["wegic", "adcreative-ai"],
    useCaseSlugs: ["ai-presentations"],
    businessSizeSlugs: ["solo", "micro", "small-business", "mid-market"],
    teamTypeSlugs: ["marketing", "founders"],
    sourcesExtra: [
      {
        id: "gamma-pricing-official",
        url: "https://gamma.app/pricing",
        title: "Gamma Pricing",
        domains: ["pricing", "plans", "free-plan"],
      },
    ],
    catalogueSourceId: "aff-gamma",
    affiliateUrl: "https://try.gamma.app/m8cx9huc5414",
  },

  {
    slug: "wegic",
    name: "Wegic",
    company: "Wegic",
    website: "https://wegic.ai",
    domain: "wegic.ai",
    pricingUrl: "https://wegic.ai/pricing",
    aliases: ["Wegic AI", "Wegic website builder"],
    membershipRole: "primary",
    jobCluster: "ai-website-builder",
    softShortDescription:
      "AI website builder from prompts — free trial; published starter from ~$12–15/mo (medium confidence).",
    shortDescription:
      "Wegic is an AI website builder that generates sites from conversational prompts — layout, copy, and basic commerce. Free trial supports evaluation. Published starter pricing is commonly cited around $12–15/mo (medium confidence — confirm live). Higher tiers and custom packaging may require sales contact.",
    vendorPositioning:
      "Your AI website team — chat to build and edit a live site without traditional drag-and-drop builder complexity.",
    pricingModel: "hybrid",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 7,
    startingPriceMonthly: 12,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Researched 2026-08-18 from wegic.ai (medium confidence on dollar floors — pricing page may be JS-rendered). Free trial available; starter commonly cited ~$12–15/mo. Pro/custom tiers may be contact-sales. Confirm live on wegic.ai/pricing. Affiliate economics excluded from scoring.",
    pricingSummary:
      "Free trial. Starter ~$12–15/mo (medium confidence). Higher tiers — confirm live on wegic.ai/pricing.",
    plans: [
      {
        kind: "per-seat-monthly",
        slug: "starter",
        name: "Starter",
        amount: 12,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "~$12–15/mo published starter (medium confidence) — AI site generation and hosting basics.",
      },
      {
        kind: "contact-sales",
        slug: "pro",
        name: "Pro",
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "Pro / higher tiers — contact sales or confirm live for advanced sites and limits.",
      },
    ],
    featureOverrides: {
      "llm-chat": "supported",
      "reasoning-models": "not-supported",
      "writing-assist": "supported",
      "image-generation": "supported",
      "voice-tts": "not-supported",
      "presentation-generation": "not-supported",
      "website-generation": "supported",
      "ad-creative-generation": "not-supported",
      "agent-builder": "not-supported",
      "custom-projects": "limited",
      "enterprise-admin": "limited",
      "usage-credits": "limited",
      "connectors": "limited",
      "data-privacy": "limited",
      "analytics-reporting": "limited",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "zapier", kind: "zapier-style" },
      { integrationSlug: "google-workspace", kind: "limited" },
    ],
    limitations: [
      "Published starter pricing is medium confidence — confirm live dollar floors",
      "No free forever plan — trial-only entry vs Gamma free tier",
      "Not a presentation or ad-creative platform",
      "Connector and commerce depth trails mature website builders",
      "Custom/advanced tiers may require sales contact",
    ],
    limitationKinds: [
      "other",
      "plan-restriction",
      "feature-unavailable",
      "other",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 8,
      "ai-job-fit": 8,
      "output-quality": 7,
      "workflow-depth": 7,
      integrations: 5,
      "governance-privacy": 6,
      scalability: 7,
      "value-for-money": 7,
      "model-capability": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Conversational site building reduces traditional builder learning curve — approachable for founders. Score from first-party positioning, not lab testing.",
      "ai-job-fit":
        "Primary job is AI website generation from prompts — strong ai-website-builder cluster fit. Not scored against LLM assistants.",
      "output-quality":
        "Generated sites are adequate for SMB landing pages and portfolios — held at 7 vs custom dev or mature builder polish.",
      "workflow-depth":
        "Chat editing and hosting cover basic site lifecycle — shallower than full marketing suites or agent builders.",
      integrations:
        "Limited native connectors — Zapier-style and basic embeds; trails established website builder ecosystems.",
      "governance-privacy":
        "SMB-grade hosting posture — adequate for small business sites, not enterprise web governance.",
      scalability:
        "Starter → Pro path supports growing sites; pricing confidence and sales-gated tiers add scaling friction.",
      "value-for-money":
        "~$12/mo starter is competitive if confirmed live, but medium pricing confidence and trial-only entry vs free competitors temper the score. Affiliate economics excluded.",
      "model-capability":
        "Site-generation models are capable for SMB sites — not general flagship LLM reasoning depth.",
    },
    bestFor: [
      "Founders and SMBs who want a conversational AI website builder",
      "Buyers who prefer chat-to-site over drag-and-drop builders",
      "Teams evaluating via free trial before committing to starter pricing",
    ],
    notIdealFor: [
      "Teams needing presentation decks (Gamma)",
      "Paid-media ad creative production (AdCreative.ai)",
      "Enterprises needing deep connector and governance ecosystems",
    ],
    pros: [
      "Conversational AI site building",
      "Free trial for evaluation",
      "Competitive ~$12 starter if confirmed",
      "Hosting included in builder workflow",
      "Fast landing-page iteration",
    ],
    cons: [
      "Medium confidence on published pricing",
      "No permanent free plan",
      "Limited connector ecosystem",
      "Output polish trails custom development",
      "Higher tiers may need sales contact",
    ],
    keyFeatures: [
      "AI website generation from chat",
      "Conversational site editing",
      "Hosting and publishing",
      "AI copy and layout generation",
      "Image generation for site assets",
      "Free trial onboarding",
    ],
    whoShouldChoose:
      "Choose Wegic when building a small business website via AI chat is the primary job — not when you need slide decks or ad banners.",
    whoShouldConsiderAlternatives:
      "Compare Gamma for presentations and microsites, and traditional builders (Wix, Squarespace) if you need mature connector ecosystems.",
    alternativeSlugs: ["gamma"],
    competitorSlugs: ["wix", "squarespace", "durable", "gamma"],
    comparableSlugs: ["gamma"],
    useCaseSlugs: ["ai-website-builder"],
    businessSizeSlugs: ["solo", "micro", "small-business"],
    teamTypeSlugs: ["founders", "marketing"],
    sourcesExtra: [
      {
        id: "wegic-product-official",
        url: "https://wegic.ai",
        title: "Wegic — AI website builder",
        domains: ["features", "product-positioning", "free-trial"],
      },
    ],
    catalogueSourceId: "aff-wegic",
    affiliateUrl: "https://try.wegic.ai/4p512poiwlw9",
  },

  {
    slug: "adcreative-ai",
    name: "AdCreative.ai",
    company: "AdCreative.ai",
    website: "https://www.adcreative.ai",
    domain: "adcreative.ai",
    pricingUrl: "https://www.adcreative.ai/pricing",
    aliases: ["AdCreative", "Ad Creative AI"],
    membershipRole: "primary",
    secondaryCategorySlugs: ["marketing"],
    jobCluster: "ai-ad-creative",
    softShortDescription:
      "AI ad creative generator for paid media — Starter $29/mo; higher tiers for more credits and brands.",
    shortDescription:
      "AdCreative.ai generates display and social ad creatives, headlines, and performance-scored variants for paid media teams. Starter is $29/mo for entry credit pools and single-brand workflows. Higher tiers add more brands, users, and creative credits for agencies and growth teams.",
    vendorPositioning:
      "AI-powered ad creative generation — banners, social ads, and copy that converts, with performance scoring for paid campaigns.",
    pricingModel: "hybrid",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 7,
    startingPriceMonthly: 29,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from adcreative.ai/pricing (high confidence). Starter $29/mo; higher tiers for more credits/brands/users. Free trial commonly offered via partner funnels. Affiliate economics excluded from scoring.",
    pricingSummary:
      "Starter $29/mo. Higher tiers for credits/brands. Free trial commonly available. Confirm live on adcreative.ai/pricing.",
    plans: [
      {
        kind: "per-seat-monthly",
        slug: "starter",
        name: "Starter",
        amount: 29,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "$29/mo — entry ad creative generation with starter credit pool and single-brand workflows.",
      },
      {
        kind: "per-seat-monthly",
        slug: "professional",
        name: "Professional",
        amount: 59,
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "Higher tier — expanded credits, brands, and team features (confirm live dollar floor).",
      },
      {
        kind: "contact-sales",
        slug: "ultimate",
        name: "Ultimate",
        hasFreeTrial: true,
        trialDays: 7,
        description: "Ultimate / agency tiers — contact sales for highest credit and brand limits.",
      },
    ],
    featureOverrides: {
      "llm-chat": "limited",
      "reasoning-models": "not-supported",
      "writing-assist": "supported",
      "image-generation": "supported",
      "voice-tts": "not-supported",
      "presentation-generation": "limited",
      "website-generation": "not-supported",
      "ad-creative-generation": "supported",
      "agent-builder": "not-supported",
      "custom-projects": "limited",
      "enterprise-admin": "limited",
      "usage-credits": "supported",
      "connectors": "limited",
      "data-privacy": "limited",
      "analytics-reporting": "supported",
    },
    aiLines: [
      "AI assistant: limited",
      "AI summaries: supported",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "facebook-ads", kind: "native" },
      { integrationSlug: "google-ads", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Starter $29/mo is a higher entry floor than presentation tools like Gamma",
      "Credit-based creative generation — heavy campaigns raise TCO",
      "Not a general LLM assistant or full marketing automation suite",
      "Presentation and website jobs belong to Gamma or Wegic",
      "Enterprise governance is lighter than marketing suite incumbents",
    ],
    limitationKinds: [
      "plan-restriction",
      "other",
      "feature-unavailable",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 8,
      "ai-job-fit": 9,
      "output-quality": 8,
      "workflow-depth": 8,
      integrations: 7,
      "governance-privacy": 6,
      scalability: 7,
      "value-for-money": 6,
      "model-capability": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "AdCreative.ai streamlines variant generation for media buyers — faster than manual banner design. Score from first-party positioning, not lab testing.",
      "ai-job-fit":
        "Primary job is AI ad creative for paid media — excellent ai-ad-creative cluster fit with marketing secondary category. Not scored as LLM peer.",
      "output-quality":
        "Generated ad variants and performance scoring are strong for SMB/agency paid campaigns — held below flagship LLM reasoning.",
      "workflow-depth":
        "Brand kits, creative scoring, and multi-format export support paid-media workflows — deeper than Gamma for ads specifically.",
      integrations:
        "Native Facebook and Google Ads connectors align with paid-media job — solid for ad ops, narrower outside ads.",
      "governance-privacy":
        "SMB/agency posture adequate for ad creative — not enterprise marketing suite governance depth.",
      scalability:
        "Starter → Professional → Ultimate supports growing brands and agencies; credit limits are the scaling constraint.",
      "value-for-money":
        "$29/mo starter is meaningful spend vs $8 Gamma for decks — value is strong for paid-media teams but weaker for general content needs. Affiliate economics excluded.",
      "model-capability":
        "Ad-specific generative models and scoring — strong within ad-creative cluster, not general LLM flagship models.",
    },
    bestFor: [
      "Paid media teams and agencies generating ad variants at scale",
      "Growth marketers running Facebook and Google campaigns",
      "Buyers who want performance-scored creative, not manual design",
    ],
    notIdealFor: [
      "Founders who only need pitch decks (Gamma)",
      "Teams without paid ad spend — TCO hard to justify",
      "General LLM research and coding workflows",
    ],
    pros: [
      "Strong ai-ad-creative job fit",
      "Performance scoring for variants",
      "Facebook and Google Ads integrations",
      "Free trial for evaluation",
      "Brand kit workflows for agencies",
    ],
    cons: [
      "$29/mo higher entry than presentation tools",
      "Credit-based TCO on heavy campaigns",
      "Not a general LLM or ESP",
      "Limited outside paid-media connectors",
      "Landscape vs Gamma is different primary job",
    ],
    keyFeatures: [
      "AI ad banner and social creative generation",
      "Performance scoring for ad variants",
      "Brand kit management",
      "Facebook and Google Ads export",
      "Headline and copy generation",
      "Credit-based creative tiers",
    ],
    whoShouldChoose:
      "Choose AdCreative.ai when paid-media ad creative generation is the primary job — especially for Facebook and Google campaigns.",
    whoShouldConsiderAlternatives:
      "Compare Gamma for presentations and general marketing visuals; use Canva or traditional design tools if you do not run paid ads.",
    alternativeSlugs: ["gamma"],
    competitorSlugs: ["creatify", "pencil", "canva", "gamma"],
    comparableSlugs: ["gamma"],
    useCaseSlugs: ["ai-ad-creative"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    teamTypeSlugs: ["marketing"],
    sourcesExtra: [
      {
        id: "adcreative-pricing-official",
        url: "https://www.adcreative.ai/pricing",
        title: "AdCreative.ai Pricing",
        domains: ["pricing", "plans", "free-trial"],
      },
    ],
    catalogueSourceId: "aff-adcreative-ai",
    affiliateUrl: "https://free-trial.adcreative.ai/az59uqmj4faf-96w1li",
  },

  {
    slug: "mindstudio",
    name: "MindStudio",
    company: "MindStudio",
    website: "https://www.mindstudio.ai",
    domain: "mindstudio.ai",
    pricingUrl: "https://www.mindstudio.ai/pricing",
    aliases: ["Mind Studio", "MindStudio AI"],
    membershipRole: "primary",
    jobCluster: "ai-agents",
    softShortDescription:
      "No-code AI agent and app builder — Individual $20/mo ($16 annual).",
    shortDescription:
      "MindStudio is a no-code platform for building AI agents, workflows, and mini-apps without traditional development. Individual is $20/mo monthly or ~$16/mo on annual billing for builder access, model usage, and published agent workflows.",
    vendorPositioning:
      "Build AI agents and apps without code — connect models, data, and actions in visual workflows for business automation.",
    pricingModel: "flat",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 16,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from mindstudio.ai/pricing (high confidence). Individual $20/mo monthly or ~$16/mo annual. Team/enterprise tiers may exist — confirm live. Affiliate economics excluded from scoring.",
    pricingSummary:
      "Individual $20/mo monthly or ~$16/mo annual. Confirm team tiers on mindstudio.ai/pricing.",
    plans: [
      {
        kind: "flat-annual",
        slug: "individual-annual",
        name: "Individual (annual)",
        amount: 16,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "~$16/mo billed annually — no-code agent and app builder for individuals.",
      },
      {
        kind: "per-seat-monthly",
        slug: "individual-monthly",
        name: "Individual (monthly)",
        amount: 20,
        hasFreeTrial: true,
        trialDays: 14,
        description: "$20/mo on monthly billing — same Individual builder packaging.",
      },
    ],
    featureOverrides: {
      "llm-chat": "supported",
      "reasoning-models": "limited",
      "writing-assist": "supported",
      "image-generation": "limited",
      "voice-tts": "limited",
      "presentation-generation": "not-supported",
      "website-generation": "limited",
      "ad-creative-generation": "not-supported",
      "agent-builder": "supported",
      "custom-projects": "supported",
      "enterprise-admin": "limited",
      "usage-credits": "limited",
      "connectors": "supported",
      "data-privacy": "limited",
      "analytics-reporting": "limited",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: supported",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Not a general-purpose LLM chat replacement for everyday research",
      "Builder learning curve higher than bare ChatGPT chat",
      "Presentation, voice, and ad-creative jobs belong to specialist tools",
      "Enterprise admin depth trails ChatGPT Business at scale",
      "Usage limits on models may apply within Individual tier",
    ],
    limitationKinds: [
      "other",
      "other",
      "feature-unavailable",
      "other",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 7,
      "ai-job-fit": 8,
      "output-quality": 7,
      "workflow-depth": 8,
      integrations: 7,
      "governance-privacy": 6,
      scalability: 7,
      "value-for-money": 8,
      "model-capability": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Visual agent builder is approachable for ops marketers but steeper than ChatGPT chat — some workflow thinking required. Score from first-party packaging, not lab testing.",
      "ai-job-fit":
        "Primary job is no-code AI agent/app building — strong ai-agents cluster fit. Cross-comparison to ChatGPT is landscape (agent builder vs LLM chat).",
      "output-quality":
        "Agent output quality depends on connected models and workflow design — capable but not flagship LLM chat polish by default.",
      "workflow-depth":
        "Multi-step agents, data connections, and published apps deliver strong automation depth — deeper than bare LLM chat for repeatable workflows.",
      integrations:
        "Slack, API, and Zapier-style connectors support automation stacks — solid for SMB agent builders, narrower than ChatGPT connector catalog.",
      "governance-privacy":
        "Individual tier is SMB-grade — enterprise governance requires confirming team/enterprise packaging.",
      scalability:
        "Individual annual at $16/mo is accessible; scaling to team agents and higher usage may need higher tiers.",
      "value-for-money":
        "$16/mo annual is competitive for no-code agent building vs hiring dev time — strong value if agents are the job. Affiliate economics excluded.",
      "model-capability":
        "Connects to external models in workflows — capability is workflow-dependent, not a single flagship model surface like ChatGPT.",
    },
    bestFor: [
      "Ops and marketing teams building repeatable AI agents without developers",
      "Founders automating workflows with visual builder logic",
      "Buyers who need published agent apps, not just chat",
    ],
    notIdealFor: [
      "Users who only need everyday LLM chat (ChatGPT Free/Plus)",
      "Presentation, voice, or ad-creative specialist jobs",
      "Enterprises needing deepest LLM admin without builder complexity",
    ],
    pros: [
      "No-code agent and app builder",
      "Competitive $16/mo annual Individual tier",
      "14-day trial",
      "Slack and API connectors",
      "Workflow automation beyond bare chat",
    ],
    cons: [
      "Steeper learning curve than ChatGPT chat",
      "Not a specialist presentation/voice/ad tool",
      "Output quality depends on workflow design",
      "Enterprise governance less transparent",
      "Landscape vs ChatGPT is different primary job",
    ],
    keyFeatures: [
      "No-code AI agent builder",
      "Visual workflow automation",
      "Model and data connectors",
      "Published agent apps",
      "Slack and API integrations",
      "14-day trial on Individual",
    ],
    whoShouldChoose:
      "Choose MindStudio when building repeatable AI agents and mini-apps is the job — not when you only need conversational LLM chat.",
    whoShouldConsiderAlternatives:
      "Compare ChatGPT for general LLM chat and custom GPTs; use Zapier or Make if you need automation without AI agent packaging.",
    alternativeSlugs: ["chatgpt"],
    competitorSlugs: ["relevance-ai", "stack-ai", "chatgpt", "zapier"],
    comparableSlugs: ["chatgpt"],
    useCaseSlugs: ["ai-agents"],
    businessSizeSlugs: ["solo", "micro", "small-business", "mid-market"],
    teamTypeSlugs: ["operations", "marketing", "founders"],
    sourcesExtra: [
      {
        id: "mindstudio-pricing-official",
        url: "https://www.mindstudio.ai/pricing",
        title: "MindStudio Pricing",
        domains: ["pricing", "plans", "free-trial"],
      },
    ],
    catalogueSourceId: "aff-mindstudio",
    affiliateUrl: "https://get.mindstudio.ai/lgjc5c17fkpb",
  },
];

export const PRODUCTS = COMPACT.map(expandAiProduct);

/**
 * Comparison pairs — includes same-cluster LLM peers and approved cross-cluster
 * landscape pairs per ai-editorial classification notes.
 */
export const COMPARISON_PAIRS = [
  ["chatgpt", "claude"],
  ["chatgpt", "gemini"],
  ["claude", "gemini"],
  ["quillbot", "chatgpt"],
  ["elevenlabs", "gamma"],
  ["gamma", "wegic"],
  ["adcreative-ai", "gamma"],
  ["mindstudio", "chatgpt"],
];
