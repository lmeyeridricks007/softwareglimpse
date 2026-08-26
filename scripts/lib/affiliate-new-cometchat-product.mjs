/**
 * CometChat — affiliate onboard pack (live-chat / in-app chat SDK).
 * Pricing grounded 2026-08-26 from cometchat.com/pricing + pricing.md (first-party).
 */
import { expandCsProduct } from "./cs-compact-expand.mjs";

const COMPACT = {
  slug: "cometchat",
  name: "CometChat",
  company: "CometChat",
  website: "https://www.cometchat.com",
  domain: "cometchat.com",
  pricingUrl: "https://www.cometchat.com/pricing",
  aliases: ["Comet Chat"],
  membershipRole: "primary",
  jobCluster: "live-chat",
  primaryCategorySlug: "live-chat",
  secondaryCategorySlugs: ["customer-service", "it-development"],
  useCaseSlugs: ["live-chat-support", "ai-customer-service"],
  teamTypeSlugs: ["engineering", "product", "customer-success"],
  businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
  softShortDescription:
    "In-app chat SDK/API with UI kits — Build free (100 MAU); Basic from ~$239/mo annual at 1k MAU tier.",
  shortDescription:
    "CometChat is an in-app chat, voice, and video SDK/API platform with prebuilt UI kits for React, Flutter, iOS, Android, and web. Build is free for up to 100 monthly active users (MAU) with full feature access for development. Paid Chat & Messaging tiers are MAU-based: Basic from approximately $239/mo billed annually at the 1k MAU tier ($298.75/mo on monthly billing); Advanced from ~$359/mo annual at 1k MAU with AI moderation, smart replies, multi-tenancy, HIPAA/BAA, and translation; Enterprise is custom from ~$999/mo annual at 10k MAU with zero overages and SSO. Overage on Basic/Advanced: $0.10/MAU and $1/concurrent connection above included limits. Not a website live-chat widget like Tidio — embed SDK for marketplaces, telehealth, edtech, and social apps.",
  vendorPositioning:
    "Ship in-app chat and calls in days with SDKs, UI kits, and APIs — not a standalone agent inbox.",
  pricingModel: "usage",
  hasFreePlan: true,
  hasFreeTrial: false,
  startingPriceMonthly: 239,
  startingPriceConfidence: "high",
  pricingNotes:
    "Verified 2026-08-26 from cometchat.com/pricing and first-party pricing.md (high confidence). Build free: 100 MAU, 25 concurrent connections. Basic ~$239/mo annual at 1k MAU; Advanced ~$359/mo annual at 1k MAU. Enterprise custom from ~$999/mo annual at 10k MAU. MAU overage $0.10; concurrency overage $1/connection on Basic/Advanced. Voice/video and AI Agent Platform are separate product lines — confirm bundles. Affiliate aff-cometchat. Affiliate economics excluded.",
  pricingSummary:
    "Build free (100 MAU). Basic from ~$239/mo annual at 1k MAU. Advanced ~$359/mo annual at 1k MAU. Enterprise custom. Confirm live MAU tiers on cometchat.com/pricing.",
  plans: [
    {
      kind: "free",
      slug: "build",
      name: "Build",
      limits: ["100 MAU", "25 concurrent connections"],
      description:
        "Free forever for development — all core messaging features, up to 100 MAU.",
    },
    {
      kind: "flat-annual",
      slug: "basic-1k-mau",
      name: "Basic (1k MAU, annual)",
      amount: 239,
      highlighted: true,
      description:
        "~$239/mo billed annually at 1k MAU tier — rich in-app chat, push, basic moderation, EDGE network.",
    },
    {
      kind: "flat-annual",
      slug: "advanced-1k-mau",
      name: "Advanced (1k MAU, annual)",
      amount: 359,
      description:
        "~$359/mo billed annually at 1k MAU — AI moderation, smart replies, multi-tenancy, HIPAA/BAA, translation, insights.",
    },
    {
      kind: "contact-sales",
      slug: "enterprise",
      name: "Enterprise",
      description:
        "Custom MAU tiers from ~10k MAU (~$999/mo annual reference tier), zero overages, SSO, dedicated support.",
    },
  ],
  featureOverrides: {
    ticketing: "not-supported",
    "shared-inbox": "limited",
    "live-chat": "supported",
    "knowledge-base": "not-supported",
    "omnichannel-inbox": "limited",
    "sla-routing": "not-supported",
    "macros-automation": "limited",
    "self-service-portal": "not-supported",
    "csat-surveys": "limited",
    "helpdesk-reporting": "limited",
    "ecommerce-helpdesk": "not-supported",
    "itsm-service-desk": "not-supported",
    "chatbot-ai-agent": "supported",
    "agent-copilot": "supported",
    "phone-support": "supported",
    "helpdesk-integrations": "supported",
  },
  aiLines: [
    "AI agent: supported",
    "AI copilot: supported",
    "AI deflection: limited",
    "AI moderation: supported",
  ],
  integrations: [
    { integrationSlug: "zapier", kind: "zapier-style" },
    { integrationSlug: "slack", kind: "native" },
  ],
  limitations: [
    "SDK/API product — not a standalone helpdesk or shared inbox like Zendesk",
    "Steep jump from free 100 MAU to ~$239/mo Basic at 1k MAU",
    "MAU and concurrency overages add cost quickly at scale",
    "Website-widget live chat (Tidio, LiveChat) is a different buyer job",
    "Voice/video and AI Agent Platform pricing are separate product lines",
  ],
  scores: {
    "ease-of-use": 7,
    "support-job-fit": 8,
    "workflow-depth": 8,
    omnichannel: 6,
    "self-service": 4,
    integrations: 9,
    analytics: 7,
    scalability: 8,
    "value-for-money": 6,
    "ai-capabilities": 8,
  },
  scoreRationales: {
    "support-job-fit":
      "Primary job is embedded in-app messaging for product teams — strong live-chat SDK fit, not helpdesk-ticketing primary.",
    "value-for-money":
      "Free Build tier is generous for dev; paid floor ~$239/mo at 1k MAU is steep versus widget chat for SMB sites. Affiliate economics excluded.",
    integrations:
      "Broad SDK/UI kit coverage and API-first integrations for mobile and web apps.",
  },
  bestFor: [
    "Product teams embedding chat, voice, or video inside their own app",
    "Marketplaces, telehealth, edtech, and community apps needing compliant messaging",
    "Developers who want prebuilt UI kits instead of building chat infrastructure from scratch",
  ],
  notIdealFor: [
    "SMBs that only need a website live-chat widget — Tidio or LiveChat are simpler",
    "Full helpdesk + ticketing without custom development",
    "Teams with fewer than 100 MAU who cannot budget ~$239/mo when they outgrow Build",
  ],
  pros: [
    "Free Build tier with 100 MAU for full SDK evaluation",
    "UI kits and SDKs for major mobile and web stacks",
    "Voice, video, and AI moderation on Advanced+",
    "HIPAA/BAA and enterprise SSO on higher tiers",
    "Unlimited messages and storage on paid chat plans (per first-party pricing)",
  ],
  cons: [
    "Paid plans start around ~$239/mo annual at 1k MAU",
    "MAU/concurrency overages require monitoring",
    "Not a plug-and-play website chat bubble",
    "Enterprise pricing needed for zero-overage scale",
    "Separate pricing lines for voice/video and AI agents",
  ],
  keyFeatures: [
    "1:1 and group in-app chat",
    "Voice and video calling SDKs",
    "Prebuilt UI kits",
    "Push notifications",
    "AI moderation and smart replies (Advanced+)",
    "Multi-tenancy (Advanced+)",
  ],
  competitorSlugs: ["tidio", "intercom", "freshchat", "livechat"],
  alternativeSlugs: ["tidio", "intercom", "freshchat"],
  comparableSlugs: ["tidio", "freshchat"],
  officialVideos: [
    {
      videoId: "h3AF-nrD7-k",
      title: "How to Integrate ChatGPT with CometChat",
      channel: "CometChat",
      shows: "product-ui",
    },
  ],
  sourcesExtra: [
    {
      id: "cometchat-pricing-md",
      url: "https://www.cometchat.com/pricing.md",
      title: "CometChat machine-readable pricing",
      domains: ["pricing", "plans", "limits"],
    },
  ],
};

export const COMETCHAT_PRODUCT = expandCsProduct(COMPACT);

export const COMETCHAT_COMPARISON_PAIRS = [
  ["cometchat", "tidio"],
  ["cometchat", "intercom"],
  ["cometchat", "freshchat"],
  ["cometchat", "livechat"],
];
