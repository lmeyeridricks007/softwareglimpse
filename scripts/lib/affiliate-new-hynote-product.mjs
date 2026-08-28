/**
 * HyNote — affiliate onboard pack (AI meeting notes / multimodal note taker).
 * Pricing grounded 2026-08-28 from hynote.ai/pricing (first-party).
 * Affiliate: https://hynote.ai/?via=J4VZPD6BKN
 */
import { expandAiProduct } from "./ai-compact-expand.mjs";

const MEETING_FEATURES = {
  "llm-chat": "limited",
  "reasoning-models": "not-supported",
  "writing-assist": "limited",
  "image-generation": "not-supported",
  "voice-tts": "not-supported",
  "presentation-generation": "limited",
  "website-generation": "not-supported",
  "ad-creative-generation": "not-supported",
  "agent-builder": "not-supported",
  "custom-projects": "supported",
  "enterprise-admin": "higher-plan-only",
  "usage-credits": "supported",
  connectors: "supported",
  "data-privacy": "supported",
  "analytics-reporting": "limited",
  "video-generation": "not-supported",
  "code-assist": "not-supported",
  "meeting-notes": "supported",
  "workflow-automation": "limited",
};

const COMPACT = {
  slug: "hynote",
  name: "HyNote",
  company: "Turing Intelligence LLC",
  website: "https://hynote.ai",
  domain: "hynote.ai",
  pricingUrl: "https://hynote.ai/pricing",
  aliases: ["HyNote AI", "Hy Note", "HyNote.ai"],
  membershipRole: "primary",
  jobCluster: "ai-meeting",
  useCaseSlugs: ["ai-meeting"],
  teamTypeSlugs: ["operations", "sales", "marketing"],
  businessSizeSlugs: ["solo", "small-business", "mid-market"],
  softShortDescription:
    "AI note taker — Free $0; Pro from $6.66/mo annual ($79.99/yr); Plus $10.83; Unlimited $15.83; Teams $15/seat.",
  shortDescription:
    "HyNote is an AI note taker that turns meetings, audio, PDFs, YouTube, images (OCR), web pages, and phone calls into searchable notes with summaries, action items, and 30+ templates — without a meeting bot. Free includes recording/transcription (120 min/session), templates, sync, and calendar. Pro starts at $6.66/mo billed annually ($79.99/yr) with 1,200 transcription minutes/mo and transcript export. Plus ($10.83/mo annual) adds speaker ID and Notion/Google Docs transfer. Unlimited ($15.83/mo annual) adds unlimited real-time transcription and CRM. Teams is $15/seat/mo annual (min 2). Same ai-meeting cluster as Fireflies.ai and Otter.ai — multimodal capture and study/publish templates rather than bot auto-join or conversation intelligence depth.",
  vendorPositioning:
    "Never take notes again — turn any audio, meeting, or file into clear, actionable notes.",
  pricingModel: "hybrid",
  hasFreePlan: true,
  hasFreeTrial: true,
  trialDays: 7,
  startingPriceMonthly: 6.66,
  startingPriceConfidence: "high",
  pricingNotes:
    "Verified 2026-08-28 from hynote.ai/pricing (high confidence). Free $0. Pro $6.66/mo annual ($79.99/yr). Plus $10.83/mo annual ($129.99/yr). Unlimited $15.83/mo annual ($189.99/yr). Teams $15/seat/mo ($180/seat/yr, min 2). Paid individual plans include 7-day free trial. Amounts shown are annual-billed monthly equivalents — confirm monthly toggle and live caps. Affiliate aff-hynote. Affiliate economics excluded.",
  pricingSummary:
    "Free forever. Pro from $6.66/mo annual. Plus $10.83. Unlimited $15.83. Teams $15/seat. Confirm live on hynote.ai/pricing.",
  plans: [
    {
      kind: "free",
      slug: "free",
      name: "Free",
      limits: {
        sessionMaxMinutes: 120,
        transcription: "included",
        templates: "professional",
        sync: "web-mobile-tablet",
      },
      description:
        "Free forever — recording/transcription, templates, uploads, calendar, private storage. No credit card.",
    },
    {
      kind: "flat-annual",
      slug: "pro",
      name: "Pro",
      amount: 6.66,
      hasFreeTrial: true,
      trialDays: 7,
      limits: {
        transcriptionMinutesPerMonth: 1200,
        podcastSlidesInfographicCredits: 300,
        transcriptExport: true,
        translation: "high-accuracy",
      },
      description:
        "$6.66/mo billed annually ($79.99/yr) — 1,200 transcription minutes/mo, translation, transcript export. 7-day trial.",
    },
    {
      kind: "flat-annual",
      slug: "plus",
      name: "Plus",
      amount: 10.83,
      hasFreeTrial: true,
      trialDays: 7,
      limits: {
        realtimeTranscriptionMinutesPerMonth: 1200,
        speakerIdentification: true,
        podcastSlidesInfographicCredits: 400,
        liveTranslation: true,
        docsNotionTransfer: true,
      },
      description:
        "$10.83/mo billed annually ($129.99/yr) — real-time transcription quota, speaker ID, live translation, Docs/Notion transfer. 7-day trial.",
    },
    {
      kind: "flat-annual",
      slug: "unlimited",
      name: "Unlimited",
      amount: 15.83,
      highlighted: true,
      hasFreeTrial: true,
      trialDays: 7,
      limits: {
        realtimeTranscription: "unlimited",
        privateStorage: "unlimited",
        podcastSlidesInfographicCredits: 600,
        crmIntegration: true,
      },
      description:
        "$15.83/mo billed annually ($189.99/yr) — unlimited real-time transcription, unlimited storage, CRM. 7-day trial.",
    },
    {
      kind: "per-seat-annual",
      slug: "teams",
      name: "Teams",
      amount: 15,
      minimumSeats: 2,
      limits: {
        minimumSeats: 2,
        teamTemplates: true,
        adminControls: true,
        prioritySupport: true,
      },
      description:
        "$15/seat/mo billed annually ($180/seat/yr) from 2 seats — Unlimited features plus team templates, admin, priority support.",
    },
  ],
  featureOverrides: MEETING_FEATURES,
  aiLines: [
    "AI assistant: supported",
    "AI summaries: supported",
    "AI automation: limited",
    "AI recommendations: limited",
  ],
  integrations: [
    { integrationSlug: "zapier", kind: "zapier-style" },
    { integrationSlug: "api", kind: "api", notes: "Plus+ export to Google Docs / Notion; Unlimited CRM" },
  ],
  limitations: [
    "No meeting bot auto-join — capture is device recording or file upload (polarising vs Fireflies bot UX)",
    "Conversation intelligence / team analytics depth is lighter than Fireflies Business",
    "Pro transcription minutes (1,200/mo) and session length (120 min) can cap heavy meeting days",
    "Teams admin/SSO depth needs confirmation versus enterprise meeting suites",
    "Not a general LLM assistant or voice studio",
  ],
  scores: {
    "ease-of-use": 8,
    "ai-job-fit": 8,
    "output-quality": 7,
    "workflow-depth": 8,
    integrations: 7,
    "governance-privacy": 8,
    scalability: 7,
    "value-for-money": 9,
    "model-capability": 7,
  },
  scoreRationales: {
    "ease-of-use":
      "Multimodal capture (audio, PDF, YouTube, OCR) plus free forever plan is approachable for individuals and students. Not a lab test.",
    "ai-job-fit":
      "Primary job is AI meeting/notes capture — ai-meeting cluster peer of Fireflies.ai and Otter.ai, not ChatGPT or ElevenLabs.",
    "output-quality":
      "Abstractive summaries, action items, and 30+ templates are the quality story from vendor packaging; no published conversation-intelligence suite.",
    "workflow-depth":
      "Capture → summarize → templates → export/publish (blog, slides, flashcards) is a full post-meeting and study loop.",
    integrations:
      "Google Docs, Notion, calendars on Plus+; CRM on Unlimited — narrower than Fireflies Slack/CRM/API breadth.",
    "governance-privacy":
      "AES-256, TLS 1.3, SOC 2 Type II infrastructure and GDPR/CCPA/HIPAA-aligned claims; Mac local transcription for private offline path.",
    scalability:
      "Free → Pro → Plus → Unlimited → Teams is a clear ladder; enterprise SSO depth less documented than Fireflies Enterprise.",
    "value-for-money":
      "Annual Pro $6.66 floor undercuts Fireflies Pro $10 and Otter individual floors for multimodal notes. Affiliate economics excluded.",
    "model-capability":
      "Meeting/document specialist summarization and transcription — not frontier general LLM compute.",
  },
  bestFor: [
    "Individuals and students who need multimodal notes (meetings + PDFs + YouTube) without a bot",
    "Buyers who want a free forever floor and a sub-$7 annual Pro entry",
    "Teams that prefer device recording / upload over auto-join bots",
  ],
  notIdealFor: [
    "Buyers who need calendar auto-join bots across Zoom/Meet/Teams (Fireflies)",
    "RevOps leads who need Business-grade conversation intelligence",
    "General LLM or voice-production workloads (ChatGPT / ElevenLabs)",
  ],
  pros: [
    "Free forever plan with real transcription",
    "Published Pro floor at $6.66/mo annual",
    "Eight input types including PDF, YouTube, OCR",
    "No meeting bot required",
    "Privacy story including Mac local transcription",
  ],
  cons: [
    "No auto-join bot path",
    "Conversation intelligence thinner than Fireflies Business",
    "Minute quotas on Pro/Plus",
    "Younger brand vs Otter/Fireflies references",
    "Not a general LLM",
  ],
  keyFeatures: [
    "Multimodal AI note capture (8 input types)",
    "Meeting transcription without a bot",
    "Abstractive summaries and action items",
    "30+ professional templates",
    "Export to Google Docs / Notion",
  ],
  whoShouldChoose:
    "Choose HyNote when multimodal AI notes (meetings, PDFs, YouTube) without a meeting bot are the job — not a general LLM or Fireflies-style conversation intelligence suite alone.",
  whoShouldConsiderAlternatives:
    "Compare Fireflies.ai for auto-join bots and Business conversation intelligence; Otter.ai for a mature meeting-notes peer; Microsoft 365 Copilot if Teams recap is already in the tenant.",
  competitorSlugs: ["fireflies", "otter-ai"],
  alternativeSlugs: ["fireflies", "otter-ai"],
  comparableSlugs: ["fireflies", "otter-ai"],
  officialVideos: [],
  sourcesExtra: [
    {
      id: "hynote-pricing",
      url: "https://hynote.ai/pricing",
      title: "HyNote pricing",
      domains: ["pricing", "plans", "free-plan", "limits", "free-trial"],
    },
    {
      id: "hynote-product",
      url: "https://hynote.ai/",
      title: "HyNote — AI Note Taker",
      domains: ["identity", "product-positioning", "features", "ai-capabilities"],
    },
  ],
};

export const HYNOTE_PRODUCT = expandAiProduct(COMPACT);

export const HYNOTE_COMPARISON_PAIRS = [
  ["hynote", "fireflies"],
  ["hynote", "otter-ai"],
];
