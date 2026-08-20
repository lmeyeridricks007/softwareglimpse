/**
 * AI Priority-3 credibility products (compact).
 * synthesia, fireflies.
 *
 * Pricing grounded 2026-08-18 from first-party pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 *
 * Synthesia is avatar / L&D video — ai-video peer of Runway (generative clips).
 * Fireflies is meeting notes — ai-meeting peer of Otter.ai.
 */
import { expandAiProduct } from "./ai-compact-expand.mjs";

const VIDEO_FEATURES = {
  "llm-chat": "limited",
  "reasoning-models": "not-supported",
  "writing-assist": "limited",
  "image-generation": "limited",
  "voice-tts": "supported",
  "presentation-generation": "limited",
  "website-generation": "not-supported",
  "ad-creative-generation": "limited",
  "agent-builder": "not-supported",
  "custom-projects": "supported",
  "enterprise-admin": "higher-plan-only",
  "usage-credits": "supported",
  connectors: "limited",
  "data-privacy": "supported",
  "analytics-reporting": "limited",
  "video-generation": "supported",
  "code-assist": "not-supported",
  "meeting-notes": "not-supported",
};

const MEETING_FEATURES = {
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
  "data-privacy": "supported",
  "analytics-reporting": "higher-plan-only",
  "video-generation": "not-supported",
  "code-assist": "not-supported",
  "meeting-notes": "supported",
};

const COMPACT = [
  {
    slug: "synthesia",
    name: "Synthesia",
    company: "Synthesia Ltd.",
    website: "https://www.synthesia.io",
    domain: "synthesia.io",
    pricingUrl: "https://www.synthesia.io/pricing",
    aliases: ["Synthesia AI", "Synthesia avatars"],
    membershipRole: "primary",
    jobCluster: "ai-video",
    softShortDescription:
      "AI avatar video studio — Basic free (watermark, no MP4); Starter $18/mo annual ($29 monthly); Creator $64/mo annual ($89 monthly); Enterprise quote.",
    shortDescription:
      "Synthesia is an AI avatar-presenter video studio for training, enablement, and on-brand explainers. Credits are the shared currency: Basic is free with 1,200 credits/month (~10 minutes) but keeps a logo and blocks MP4 download. Starter is $18/editor/mo billed annually ($29 monthly) with 14,500 credits/year (~120 minutes) and download/logo removal. Creator is $64/mo annual ($89 monthly) with 44,000 credits/year (~360 minutes), API, and interactive video. Enterprise is contact sales (SSO, SCORM, unlimited minutes). Distinct from Runway’s generative-clip studio — Synthesia is talking-head / L&D video, not text-to-shot filmmaking.",
    vendorPositioning:
      "Turn scripts into on-brand avatar videos without cameras — training and communications at scale.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 18,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from synthesia.io/pricing (high confidence). Basic $0 (1,200 credits/mo, no MP4). Starter $18/mo annual / $29 monthly (14,500 credits/year). Creator $64/mo annual / $89 monthly (44,000 credits/year). Enterprise custom. Affiliate economics excluded.",
    pricingSummary:
      "Free Basic (watermark, no download). Starter from $18/mo annual. Creator $64/mo annual. Enterprise quote. Credits buy minutes — confirm live on synthesia.io/pricing.",
    plans: [
      {
        kind: "free",
        slug: "basic",
        name: "Basic",
        description:
          "1,200 credits/month (~10 minutes); 9 stock avatars; watermark; no MP4 download.",
      },
      {
        kind: "flat-annual",
        slug: "starter",
        name: "Starter",
        amount: 18,
        highlighted: true,
        description:
          "$18/mo billed annually ($29 monthly) — 14,500 credits/year (~120 minutes); MP4 download and logo removal.",
      },
      {
        kind: "flat-annual",
        slug: "creator",
        name: "Creator",
        amount: 64,
        description:
          "$64/mo billed annually ($89 monthly) — 44,000 credits/year (~360 minutes); API, interactive video, extra personal avatars.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description:
          "Unlimited minutes, SSO/SAML, SCORM, brand kits, dedicated CSM — custom quote.",
      },
    ],
    featureOverrides: VIDEO_FEATURES,
    aiLines: [
      "AI assistant: limited",
      "AI summaries: not-supported",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "api", kind: "api" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Basic cannot publish — no MP4 download and a persistent logo",
      "Credits buy minutes of avatar video — not unlimited renders",
      "Not a generative-filmmaking studio like Runway Gen-4",
      "Personal/studio avatars and SCORM sit on higher or Enterprise packaging",
      "Not an LLM assistant, meeting-notes, or coding product",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
      "plan-restriction",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "ai-job-fit": 9,
      "output-quality": 8,
      "workflow-depth": 8,
      integrations: 7,
      "governance-privacy": 8,
      scalability: 8,
      "value-for-money": 7,
      "model-capability": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Script-to-avatar studio is approachable for L&D and comms teams; credit math is the learning curve. Not a lab test.",
      "ai-job-fit":
        "Primary job is AI avatar / training video — ai-video cluster peer of Runway, not ChatGPT or Midjourney stills.",
      "output-quality":
        "Stock and personal avatars plus dubbing are the quality story from vendor packaging.",
      "workflow-depth":
        "Templates, brand kits, interactive video, and API (Creator+) form a production loop for enablement teams.",
      integrations: "API and LMS/SCORM on Enterprise; weaker than workspace LLM connectors.",
      "governance-privacy":
        "Enterprise SSO/SAML and brand controls; self-serve plans are creator-grade.",
      scalability: "Clear Basic → Starter → Creator → Enterprise credit ladder.",
      "value-for-money":
        "Annual Starter $18 is a fair publishing floor; volume L&D usually lands on Creator/Enterprise credits. Affiliate economics excluded.",
      "model-capability":
        "Avatar, dubbing, and assistant features — not flagship generative-film models.",
    },
    bestFor: [
      "L&D and enablement teams producing talking-head explainers",
      "Internal comms that need on-brand avatars without a film crew",
      "Creator/Enterprise buyers who need API, SSO, or SCORM",
    ],
    notIdealFor: [
      "Generative B-roll / text-to-shot filmmaking (Runway)",
      "Still-image art direction (Midjourney)",
      "Buyers who need a free plan that actually exports MP4",
    ],
    pros: [
      "Real free Basic sandbox",
      "Published Starter/Creator credit ladder",
      "Avatar + dubbing for L&D",
      "Enterprise SSO/SCORM path",
      "API on Creator+",
    ],
    cons: [
      "Basic cannot download",
      "Credits cap minutes",
      "Not Runway-style generative film",
      "Personal avatars gated",
      "Not a general LLM",
    ],
    keyFeatures: [
      "AI avatar presenters",
      "Credit-based video minutes",
      "AI dubbing",
      "Brand kits / interactive video",
      "Enterprise SSO and SCORM",
    ],
    whoShouldChoose:
      "Choose Synthesia when avatar / training video is the job — not Runway generative clips and not ChatGPT.",
    whoShouldConsiderAlternatives:
      "Compare Runway if you need text-to-video filmmaking; Midjourney for stills; ChatGPT only if you paste scripts into a chat.",
    alternativeSlugs: ["runway", "midjourney"],
    competitorSlugs: ["runway"],
    comparableSlugs: ["runway"],
    useCaseSlugs: ["ai-video"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "marketing"],
    sourcesExtra: [
      {
        id: "synthesia-pricing",
        url: "https://www.synthesia.io/pricing",
        title: "Synthesia pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },
  {
    slug: "fireflies",
    name: "Fireflies.ai",
    company: "Fireflies.ai",
    website: "https://fireflies.ai",
    domain: "fireflies.ai",
    pricingUrl: "https://fireflies.ai/pricing",
    aliases: ["Fireflies", "Fireflies AI", "AskFred"],
    membershipRole: "primary",
    jobCluster: "ai-meeting",
    softShortDescription:
      "AI meeting notes — Free $0 (400 min storage); Pro $10/seat/mo annual ($18 monthly); Business $19 annual ($29 monthly); Enterprise $39 annual-only.",
    shortDescription:
      "Fireflies.ai is an AI meeting notetaker (bot or Chrome extension) for Zoom, Google Meet, and Microsoft Teams. Transcription is unlimited on every plan; storage, video recording, conversation intelligence, and admin/compliance are the gates. Free is $0 with 400 minutes team storage. Pro is $10/seat/mo billed annually ($18 monthly) with 8,000 minutes/seat storage and video recording. Business (most popular) is $19/seat/mo annual ($29 monthly) with unlimited storage and conversation intelligence. Enterprise is $39/seat/mo annual-only (SSO, SCIM, HIPAA). Distinct from Otter.ai (meeting-notes peer) and from Microsoft 365 Copilot Teams recap (workspace LLM add-on).",
    vendorPositioning:
      "Auto-join meetings, transcribe everything, and ask Fred — conversation intelligence for the whole team.",
    pricingModel: "per-seat",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 10,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from fireflies.ai/pricing (high confidence). Free $0. Pro $10/seat/mo annual ($18 monthly). Business $19 annual ($29 monthly). Enterprise $39 annual-only. Transcription unlimited; storage and CI gated. Affiliate economics excluded.",
    pricingSummary:
      "Free 400 min storage. Pro from $10/seat/mo annual. Business $19. Enterprise $39 annual-only. Confirm live on fireflies.ai/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description:
          "Unlimited transcription; 400 minutes storage/team; limited AskFred; no video recording.",
      },
      {
        kind: "per-seat-annual",
        slug: "pro",
        name: "Pro",
        amount: 10,
        description:
          "$10/seat/mo billed annually ($18 monthly) — 8,000 min storage/seat, video recording, AI Skills.",
      },
      {
        kind: "per-seat-annual",
        slug: "business",
        name: "Business",
        amount: 19,
        highlighted: true,
        description:
          "$19/seat/mo billed annually ($29 monthly) — unlimited storage, conversation intelligence, team analytics.",
      },
      {
        kind: "per-seat-annual",
        slug: "enterprise",
        name: "Enterprise",
        amount: 39,
        description:
          "$39/seat/mo billed annually only — SSO/SCIM, HIPAA, private storage, super admin.",
      },
    ],
    featureOverrides: MEETING_FEATURES,
    aiLines: [
      "AI assistant: supported",
      "AI summaries: supported",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Free storage (400 min/team) burns down fast; transcription unlimited is not unlimited retention",
      "Conversation intelligence and team analytics unlock on Business",
      "SSO, HIPAA, and private storage are Enterprise-only",
      "Not a general LLM assistant or voice studio",
      "Bot-join UX is polarising in some meetings — Chrome extension is the alternative capture path",
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
      "ai-job-fit": 9,
      "output-quality": 8,
      "workflow-depth": 8,
      integrations: 9,
      "governance-privacy": 8,
      scalability: 8,
      "value-for-money": 8,
      "model-capability": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Calendar auto-join plus a Chrome extension path is easy for non-technical users. Not a lab test.",
      "ai-job-fit":
        "Primary job is AI meeting notes — ai-meeting cluster peer of Otter.ai, not ChatGPT or ElevenLabs.",
      "output-quality":
        "Unlimited transcription plus summaries/AskFred are the quality story from vendor packaging.",
      "workflow-depth":
        "AskFred, AI Skills, soundbites, and Business conversation intelligence add a post-meeting loop.",
      integrations: "Unlimited integrations on paid plans (Zoom/Meet/Teams, Slack, CRM, API).",
      "governance-privacy":
        "SOC2/GDPR on the platform; HIPAA, SSO/SCIM, and private storage are Enterprise.",
      scalability: "Free → Pro → Business → Enterprise is a clear seat ladder.",
      "value-for-money":
        "Annual Pro $10 is a strong individual floor; Business is the team SKU. Affiliate economics excluded.",
      "model-capability":
        "Meeting-specialist models and AskFred — not frontier general LLM compute.",
    },
    bestFor: [
      "Teams that want auto-join transcripts across Zoom/Meet/Teams",
      "RevOps/CS leads who will actually use Business conversation intelligence",
      "Enterprises that need HIPAA/SSO meeting capture",
    ],
    notIdealFor: [
      "Buyers who need a general LLM (ChatGPT)",
      "Voice production (ElevenLabs)",
      "Teams already paying for Microsoft 365 Copilot Teams recap as the only meeting job",
    ],
    pros: [
      "Unlimited transcription on every plan",
      "Published Pro/Business/Enterprise seats",
      "Conversation intelligence on Business",
      "Enterprise HIPAA/SSO path",
      "Chrome extension without a bot",
    ],
    cons: [
      "Free storage is tiny",
      "CI gated to Business",
      "Not a general LLM",
      "Bot-join UX is polarising",
      "AI credits can add TCO for AskFred/Skills",
    ],
    keyFeatures: [
      "Unlimited transcription",
      "AskFred meeting assistant",
      "Auto-join Zoom / Meet / Teams",
      "Conversation intelligence (Business+)",
      "Enterprise SSO / HIPAA",
    ],
    whoShouldChoose:
      "Choose Fireflies.ai when AI meeting notes and conversation intelligence are the job — not a general LLM or Teams-recap add-on alone.",
    whoShouldConsiderAlternatives:
      "Compare Otter.ai for a lower individual Pro floor; Microsoft 365 Copilot if Teams recap is already in the tenant.",
    alternativeSlugs: ["otter-ai", "microsoft-copilot"],
    competitorSlugs: ["otter-ai"],
    comparableSlugs: ["otter-ai"],
    useCaseSlugs: ["ai-meeting"],
    businessSizeSlugs: ["solo", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "sales"],
    sourcesExtra: [
      {
        id: "fireflies-pricing",
        url: "https://fireflies.ai/pricing",
        title: "Fireflies.ai pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },
];

export const PRODUCTS = COMPACT.map(expandAiProduct);

export const COMPARISON_PAIRS = [
  ["synthesia", "runway"],
  ["fireflies", "otter-ai"],
];
