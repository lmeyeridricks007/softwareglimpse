/**
 * Affiliate gap CS pack (compact).
 * nicejob, shore.
 *
 * Pricing grounded 2026-08-19 from first-party pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 */
import { expandCsProduct } from "./cs-compact-expand.mjs";

export const VERIFIED_AT = "2026-08-19T12:00:00.000Z";

const COMPACT = [
  {
    slug: "nicejob",
    name: "NiceJob",
    company: "NiceJob",
    website: "https://get.nicejob.com",
    domain: "get.nicejob.com",
    pricingUrl: "https://get.nicejob.com/pricing",
    aliases: ["Nice Job", "NiceJob Reviews"],
    membershipRole: "adjacent",
    jobCluster: "helpdesk-ticketing",
    adjacentNote:
      "Adjacent to customer service: NiceJob is local-business reputation and review-generation software — automated review requests, monitoring, and referral campaigns — not a helpdesk, live chat, or ITSM platform. Never a CS best-page peer.",
    softShortDescription:
      "Local reputation marketing — Reviews $75/mo, Pro $125/mo (USD); 14-day trial, no contract. Per-business pricing; Sites add-on $99/mo + $199 setup.",
    shortDescription:
      "NiceJob is reputation and review-generation software for local service businesses — automated SMS/email review requests after jobs close, review monitoring, social sharing, and referral campaigns on higher tiers. Published USD pricing (2026-08-19): Reviews $75/month, Pro $125/month. 14-day free trial, no credit card, no contract. Optional Sites managed-website add-on $99/month plus $199 setup. Priced per business location (each Google Business Profile needs its own licence); customer-count thresholds above ~2,500 active customers can raise the bill — confirm live tiers. Scored as CS-adjacent reputation tooling, not helpdesk-ticketing primary.",
    vendorPositioning:
      "Reputation marketing for local businesses — turn happy customers into online reviews and repeat bookings.",
    pricingModel: "flat",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 75,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-19 from get.nicejob.com/pricing (high confidence). Reviews $75/mo, Pro $125/mo USD. 14-day trial, no card, no contract. Sites add-on $99/mo + $199 setup. Per-location licensing; unpublished customer-volume bands above ~2,500 may increase price. Affiliate aff-nicejob. Affiliate economics excluded.",
    pricingSummary:
      "Reviews $75/mo. Pro $125/mo. 14-day trial, no contract. Sites add-on $99/mo + $199 setup. Per location — confirm customer-volume bands on get.nicejob.com/pricing.",
    plans: [
      {
        kind: "flat-monthly",
        slug: "reviews",
        name: "Reviews",
        amount: 75,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "$75/mo Reviews — automated requests, monitoring, widgets, and social sharing.",
      },
      {
        kind: "flat-monthly",
        slug: "pro",
        name: "Pro",
        amount: 125,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "$125/mo Pro — adds referrals, repeat-booking campaigns, gifting, competitor insights, and AI review replies.",
      },
      {
        kind: "flat-monthly",
        slug: "sites",
        name: "Sites",
        amount: 99,
        description:
          "$99/mo Sites managed-website add-on plus $199 one-time setup — optional layer on Reviews/Pro.",
      },
    ],
    featureOverrides: {
      ticketing: "not-supported",
      "shared-inbox": "not-supported",
      "live-chat": "not-supported",
      "knowledge-base": "not-supported",
      "omnichannel-inbox": "not-supported",
      "sla-routing": "not-supported",
      "macros-automation": "limited",
      "self-service-portal": "limited",
      "csat-surveys": "limited",
      "helpdesk-reporting": "limited",
      "ecommerce-helpdesk": "not-supported",
      "itsm-service-desk": "not-supported",
      "chatbot-ai-agent": "not-supported",
      "agent-copilot": "not-supported",
      "phone-support": "not-supported",
      "helpdesk-integrations": "limited",
    },
    aiLines: [
      "AI agent: not-supported",
      "AI copilot: limited",
      "AI deflection: not-supported",
      "AI review replies: supported",
    ],
    integrations: [
      { integrationSlug: "zapier", kind: "zapier-style" },
      { integrationSlug: "google-workspace", kind: "native" },
    ],
    limitations: [
      "Adjacent to CS — reputation/review generation, not helpdesk or live chat",
      "Per-location licensing multiplies cost for multi-branch operators",
      "Customer-volume thresholds above published bands can raise price",
      "Not a ticketing, SLA, or omnichannel agent workspace",
      "Sites add-on is a separate website product, not core CS",
    ],
    scores: {
      "ease-of-use": 8,
      "support-job-fit": 6,
      "workflow-depth": 7,
      omnichannel: 5,
      "self-service": 4,
      integrations: 7,
      analytics: 6,
      scalability: 5,
      "value-for-money": 7,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "support-job-fit":
        "Reputation and review automation for local businesses — adjacent to CS, not helpdesk-ticketing primary. Scored on its own job.",
      "value-for-money":
        "$75 Reviews floor is transparent versus quote-only reputation suites; per-location and volume bands cap value for multi-site teams. Affiliate economics excluded.",
    },
    bestFor: [
      "Single-location local service businesses that need automated Google review requests",
      "Teams closing 15+ jobs/month who want referral and repeat-booking automation (Pro)",
      "Buyers who value no-contract $75/$125 published pricing over enterprise reputation suites",
    ],
    notIdealFor: [
      "Helpdesk, live-chat, or ITSM buyers — use Freshdesk, Tidio, or Freshservice instead",
      "Multi-location franchises without budgeting per-GBP licence",
      "Enterprise social listening (Brand24 is the marketing-cluster peer)",
    ],
    pros: [
      "Published $75/$125 USD pricing with 14-day trial",
      "No contract — month-to-month exit",
      "Automated post-job review requests and monitoring",
      "Pro adds referrals, repeats, and AI review replies",
      "Zapier-style integrations with field-service tools",
    ],
    cons: [
      "Not a helpdesk or chat platform",
      "Per-location licensing",
      "Volume bands above ~2,500 customers unpublished",
      "Limited CS analytics versus Zendesk-class reporting",
      "Sites add-on is optional website work, not CS core",
    ],
    keyFeatures: [
      "Automated review requests (SMS/email)",
      "Review monitoring and widgets",
      "Referral and repeat-booking campaigns (Pro)",
      "AI review reply assistance (Pro)",
      "Social sharing and microsite",
    ],
    whoShouldChoose:
      "Choose NiceJob when automated local review generation and referral follow-up is the job — and treat it as reputation tooling adjacent to customer service, not a helpdesk replacement.",
    whoShouldConsiderAlternatives:
      "Compare Brand24 for social listening and mention analytics; Tidio or Help Scout if website chat and ticketing are the primary jobs.",
    alternativeSlugs: ["brand24", "tidio"],
    competitorSlugs: ["brand24", "tidio"],
    comparableSlugs: ["brand24"],
    useCaseSlugs: ["helpdesk-ticketing"],
    businessSizeSlugs: ["micro", "small-business"],
    teamTypeSlugs: ["marketing", "customer-success"],
    catalogueSourceId: "aff-nicejob",
    sourcesExtra: [
      {
        id: "nicejob-pricing",
        url: "https://get.nicejob.com/pricing",
        title: "NiceJob pricing",
        domains: ["pricing", "plans", "free-trial", "limits"],
      },
    ],
  },
  {
    slug: "shore",
    name: "Shore",
    company: "Shore GmbH",
    website: "https://www.shore.com",
    domain: "shore.com",
    pricingUrl: "https://www.shore.com/us/pricing",
    aliases: ["Shore Booking", "Shore POS"],
    membershipRole: "primary",
    jobCluster: "live-chat-support",
    softShortDescription:
      "Appointment booking and local business management — US Booking from $49.90/mo annual ($59.90 monthly); Booking + Marketing $69.90 annual. 14-day trial.",
    shortDescription:
      "Shore is appointment scheduling and local business management for salons, studios, and service businesses — online calendar, website/Google/Instagram booking, reminders, customer management, and marketing tools on higher tiers. US pricing (2026-08-19): Booking $59.90/mo or $49.90/mo billed annually; Booking + Marketing $79.90/$69.90 annual. 14-day free trial, no commission on bookings. POS is primarily DACH (Germany, Austria, Switzerland). Scored in the live-chat-support cluster as customer-facing booking/conversation entry — not a website messenger like Tidio.",
    vendorPositioning:
      "Digital appointment booking and business management — fixed monthly price, no booking commission.",
    pricingModel: "flat",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 49.9,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-19 from shore.com/us/pricing (high confidence). Booking $59.90/mo ($49.90 annual). Booking + Marketing $79.90/mo ($69.90 annual). 14-day trial. EU Starter/Growth/Business tiers also published on shore.com/en/pricing. POS limited to DACH. SMS may bill separately. Affiliate aff-shore. Affiliate economics excluded.",
    pricingSummary:
      "Booking from $49.90/mo annual ($59.90 monthly). Booking + Marketing $69.90 annual. 14-day trial. No booking commission — confirm SMS and POS region limits on shore.com/us/pricing.",
    plans: [
      {
        kind: "flat-annual",
        slug: "booking",
        name: "Booking",
        amount: 49.9,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "$49.90/mo billed annually ($59.90 monthly) — online calendar, booking, reminders, customer management.",
      },
      {
        kind: "flat-annual",
        slug: "booking-marketing",
        name: "Booking + Marketing",
        amount: 69.9,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "$69.90/mo billed annually ($79.90 monthly) — adds marketing and customer-loyalty tools.",
      },
    ],
    featureOverrides: {
      ticketing: "not-supported",
      "shared-inbox": "limited",
      "live-chat": "limited",
      "knowledge-base": "not-supported",
      "omnichannel-inbox": "limited",
      "sla-routing": "not-supported",
      "macros-automation": "limited",
      "self-service-portal": "supported",
      "csat-surveys": "limited",
      "helpdesk-reporting": "limited",
      "ecommerce-helpdesk": "not-supported",
      "itsm-service-desk": "not-supported",
      "chatbot-ai-agent": "not-supported",
      "agent-copilot": "not-supported",
      "phone-support": "not-supported",
      "helpdesk-integrations": "limited",
    },
    aiLines: [
      "AI agent: not-supported",
      "AI copilot: not-supported",
      "AI deflection: not-supported",
      "AI summaries: not-supported",
    ],
    integrations: [
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "facebook", kind: "native" },
      { integrationSlug: "instagram", kind: "native" },
    ],
    limitations: [
      "Appointment booking primary — not a helpdesk ticket queue or AI live chat",
      "POS and GoBD-compliant register limited to DACH markets",
      "SMS reminder fees may apply separately from subscription",
      "No SLA routing, macros, or agent assignment model",
      "Marketing tier adds cost versus pure booking needs",
    ],
    scores: {
      "ease-of-use": 8,
      "support-job-fit": 7,
      "workflow-depth": 8,
      omnichannel: 6,
      "self-service": 8,
      integrations: 6,
      analytics: 7,
      scalability: 6,
      "value-for-money": 8,
      "ai-capabilities": 4,
    },
    scoreRationales: {
      "support-job-fit":
        "Self-service booking and customer-facing scheduling — live-chat-support cluster as booking entry, not Tidio-class messenger depth.",
      "self-service":
        "24/7 online booking via website, Google, and Instagram is the core self-service surface.",
      "value-for-money":
        "No booking commission and published $49.90 annual floor are strong for local service SMBs; SMS and DACH POS limits apply. Affiliate economics excluded.",
    },
    bestFor: [
      "Salons, studios, and appointment-based local businesses needing online booking",
      "Operators who want fixed monthly pricing without per-booking commission",
      "Teams that will use Google/Instagram booking surfaces plus automated reminders",
    ],
    notIdealFor: [
      "Ecommerce order helpdesk buyers (Gorgias territory)",
      "Website AI live chat and ticket deflection (Tidio, Intercom)",
      "WhatsApp customer messaging (Wati)",
    ],
    pros: [
      "Published US/EU pricing with 14-day trial",
      "No commission on bookings",
      "Google, Instagram, and website booking surfaces",
      "Automated email/SMS reminders",
      "Customer management and marketing tier",
    ],
    cons: [
      "Not a helpdesk or AI chat product",
      "POS primarily DACH-only",
      "SMS may bill separately",
      "No ticketing SLAs or agent workspace",
      "AI is not a product surface",
    ],
    keyFeatures: [
      "Online appointment calendar",
      "Website / Google / Instagram booking",
      "Automated reminders",
      "Customer database",
      "Marketing and feedback tools (upper tier)",
    ],
    whoShouldChoose:
      "Choose Shore when appointment self-service booking and local business management are the job — not when you need a website live-chat helpdesk.",
    whoShouldConsiderAlternatives:
      "Compare Tidio for AI website chat and conversation automation; Wati for WhatsApp Business messaging.",
    alternativeSlugs: ["tidio", "wati"],
    competitorSlugs: ["tidio", "wati"],
    comparableSlugs: ["tidio"],
    useCaseSlugs: ["live-chat-support"],
    businessSizeSlugs: ["micro", "small-business"],
    teamTypeSlugs: ["operations"],
    catalogueSourceId: "aff-shore",
    sourcesExtra: [
      {
        id: "shore-us-pricing",
        url: "https://www.shore.com/us/pricing",
        title: "Shore US pricing",
        domains: ["pricing", "plans", "free-trial", "limits"],
      },
    ],
  },
];

export const PRODUCTS = COMPACT.map(expandCsProduct);

export const COMPARISON_PAIRS = [
  ["nicejob", "brand24"],
  ["nicejob", "tidio"],
  ["shore", "tidio"],
  ["shore", "wati"],
];
