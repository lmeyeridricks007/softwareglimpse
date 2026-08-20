/**
 * Business Communications Priority-1 non-affiliate product pack.
 * Shape matches writeProduct / Wave-1 objects in onboard-bc-wave1-batch.mjs.
 *
 * Research floors cross-checked 2026-08-17 from first-party pricing pages.
 * Affiliate economics never enter scores.
 */
import {
  contactSalesPlan,
  freePlan,
  planPerSeatAnnual,
} from "./bc-onboard-runtime.mjs";

export const PRODUCTS = [
  {
    slug: "ringcentral",
    name: "RingCentral",
    company: "RingCentral, Inc.",
    website: "https://www.ringcentral.com",
    domain: "ringcentral.com",
    pricingUrl: "https://www.ringcentral.com/office/plansandpricing.html",
    aliases: [],
    membershipRole: "primary",
    jobCluster: "cloud-phone",
    softShortDescription:
      "Enterprise-grade UCaaS / cloud phone platform (RingEX) with deep call routing, video, team messaging and contact-centre options — Core from ~$20/user/month annual.",
    shortDescription:
      "RingCentral is a cloud business communications suite built around RingEX phone, messaging and meetings, with RingCX contact centre as a separate ladder. RingEX Core, Advanced and Ultra cover business phone, IVR/routing, SMS, team chat and video; call recording and deeper CRM/CTI land on Advanced+, while AI Receptionist and Conversational Intelligence are add-ons. Seat dollars are often behind quote/selectors, so published floors are medium confidence.",
    vendorPositioning:
      "The complete phone system for modern business — AI-powered voice, video, messaging and contact centre in one cloud platform.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 20,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Cross-checked 2026-08-17. RingCentral often hides seat dollars behind quote/selector flows, so floors are medium confidence: RingEX Core ~$20, Advanced ~$25, Ultra ~$35 per user/month annual ($30/$35/$45 monthly). RingCX contact centre is separate (~$65+/agent). AI Receptionist and Conversational Intelligence are add-ons. Customer Engagement Bundle is contact-sales. Confirm live on ringcentral.com pricing before publishing dollar claims.",
    fixturePlans: [
      "PLAN core: name=RingEX Core; amountPerSeat=20; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=medium",
      "PLAN advanced: name=RingEX Advanced; amountPerSeat=25; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=medium",
      "PLAN ultra: name=RingEX Ultra; amountPerSeat=35; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=medium",
      "PLAN ringcx: name=RingCX; contactSales=true; fromFloor=true; note=separate-contact-center",
      "PLAN customer-engagement: name=Customer Engagement Bundle; contactSales=true",
    ],
    enrichmentPlans: [
      planPerSeatAnnual("core", "RingEX Core", 20, {
        hasFreeTrial: true,
        description:
          "From ~$20/user/month on annual billing (medium-confidence research floor; page often quote/selector gated). Cloud phone, team messaging, video meetings, SMS and core call routing.",
      }),
      planPerSeatAnnual("advanced", "RingEX Advanced", 25, {
        highlighted: true,
        hasFreeTrial: true,
        description:
          "From ~$25/user/month annual (medium confidence). Adds call recording, deeper analytics and stronger CRM/CTI relative to Core.",
      }),
      planPerSeatAnnual("ultra", "RingEX Ultra", 35, {
        hasFreeTrial: true,
        description:
          "From ~$35/user/month annual (medium confidence). Top RingEX tier for larger UCaaS deployments before moving to RingCX contact centre.",
      }),
      contactSalesPlan("ringcx", "RingCX", {
        description:
          "Separate contact-centre ladder from ~$65+/agent — not scored as the RingEX Core phone floor. Quote-based packaging common.",
      }),
      contactSalesPlan("customer-engagement", "Customer Engagement Bundle", {
        description:
          "Contact sales for bundled customer-engagement packaging beyond published RingEX seat floors.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "supported",
      "call-recording": "higher-plan-only",
      "power-dialer": "limited",
      "sms-messaging": "supported",
      "whatsapp-business": "limited",
      "shared-inbox": "limited",
      "team-messaging": "supported",
      "video-meetings": "supported",
      "crm-cti": "higher-plan-only",
      "analytics-reporting": "supported",
      "ai-assistance": "add-on",
      "unified-inbox": "limited",
    },
    aiLines: [
      "AI receptionist: add-on",
      "AI transcription: add-on",
      "AI summaries: add-on",
      "AI conversational intelligence: add-on",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native", notes: "Stronger CTI depth on Advanced+" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "zendesk", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Published seat floors are medium confidence — RingCentral often gates exact dollars behind quote/selector flows",
      "Call recording and deeper CRM/CTI require Advanced or above",
      "Power dialer capability is limited / add-on rather than a first-class RingEX Core feature",
      "AI Receptionist and Conversational Intelligence are separately priced add-ons",
      "RingCX contact centre and Customer Engagement Bundle are separate quote paths from RingEX",
      "WhatsApp Business and shared/unified inbox depth are limited versus dedicated messaging platforms",
    ],
    limitationKinds: [
      "other",
      "plan-restriction",
      "requires-add-on",
      "requires-add-on",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 10,
      "routing-workflows": 10,
      integrations: 9,
      analytics: 9,
      "outbound-tools": 8,
      scalability: 10,
      "value-for-money": 6,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "RingEX is a full UCaaS suite with desktop/mobile apps, admin portals and familiar phone+meetings+chat packaging. Mid-market and enterprise rollouts still need IT involvement for numbers, PBX migration and policy. Score reflects documented product surface, not hands-on lab testing.",
      "voice-messaging-quality":
        "RingCentral’s core strength is carrier-grade cloud phone with SMS, video meetings and team messaging in one suite — the strongest published voice/UCaaS envelope in this Priority-1 set. Score is grounded in product breadth, not a lab audio test.",
      "routing-workflows":
        "IVR, queues, multi-site routing and RingCX contact-centre workflows give RingCentral top-tier routing depth for business phone and contact-centre buyers. Advanced+ unlocks more of the recording and supervisor surface.",
      integrations:
        "Broad CRM/helpdesk and collaboration connectors (Salesforce, HubSpot, Zendesk, Microsoft Teams, Slack, Google Workspace) plus Zapier-style automation. Deeper CTI is Advanced+ gated, which keeps the score just under Aircall-class CTI specialists.",
      analytics:
        "Business analytics and supervisor reporting are first-party strengths on RingEX; Conversational Intelligence deepens insight as an add-on. Score reflects published analytics depth rather than hands-on dashboard review.",
      "outbound-tools":
        "SMS, click-to-dial and limited/add-on power-dialer options cover structured outbound, but RingCentral is not primarily a high-volume parallel dialer product.",
      scalability:
        "RingEX Ultra plus RingCX and enterprise bundles document a clear path from SMB seats to contact-centre and multi-site deployments — the strongest scale story in this batch.",
      "value-for-money":
        "Core from ~$20/user/month annual looks competitive on paper, but medium confidence on seat floors, Advanced/Ultra upsells, RingCX separation and AI add-ons raise real TCO opacity. Capability justifies premium for large UCaaS buyers; accessibility and price clarity are weaker. Affiliate economics excluded.",
      "ai-capabilities":
        "AI Receptionist and Conversational Intelligence are credible first-party AI surfaces, but they are priced as add-ons rather than included on Core — strong capability, paid packaging.",
    },
    bestFor: [
      "Mid-market and enterprise teams standardising on one UCaaS phone + meetings + messaging suite",
      "Organisations that need serious call routing and a path into contact centre (RingCX)",
      "Buyers who want CRM/helpdesk connectors and analytics as part of the phone system",
    ],
    notIdealFor: [
      "Budget-first micro teams that need the cheapest transparent per-seat VoIP",
      "Buyers who expect AI Receptionist / Conversational Intelligence included in Core",
      "Teams whose primary job is team chat alone — Slack or Microsoft Teams fit that job better",
    ],
    pros: [
      "Carrier-grade RingEX cloud phone with SMS, video and team messaging",
      "Top-tier routing and a clear RingCX contact-centre expansion path",
      "Broad CRM and collaboration integrations",
      "Strong analytics with optional Conversational Intelligence",
      "Scales from SMB seats to multi-site enterprise deployments",
    ],
    cons: [
      "Seat dollars often quote/selector gated — medium confidence on published floors",
      "Call recording and deeper CTI require Advanced+",
      "AI features are add-ons that inflate TCO",
      "Power dialer is limited/add-on versus sales-dialer specialists",
      "WhatsApp and shared inbox depth trail messaging-first platforms",
    ],
    keyFeatures: [
      "RingEX cloud phone, SMS, video meetings and team messaging",
      "IVR, queues and advanced call routing",
      "Call recording on Advanced+",
      "CRM/CTI connectors (deeper on Advanced+)",
      "Analytics and Conversational Intelligence add-on",
      "RingCX contact centre ladder",
    ],
    pricingSummary:
      "RingEX Core ~$20, Advanced ~$25, Ultra ~$35 per user/month annual ($30/$35/$45 monthly) — medium confidence because RingCentral often hides seat dollars behind quote/selector flows (cross-checked 2026-08-17). RingCX contact centre separate (~$65+). AI Receptionist / Conversational Intelligence add-ons; Customer Engagement Bundle is contact sales. Confirm live before publishing.",
    whoShouldChoose:
      "Choose RingCentral when you need enterprise-ready UCaaS — phone, meetings, messaging and a contact-centre path — and can accept quote-gated pricing plus Advanced+/AI add-ons for full depth.",
    whoShouldConsiderAlternatives:
      "Compare Dialpad for stronger included AI on Connect, Zoom if meetings-first UCaaS matters most, Aircall for CRM/CTI-led mid-market phone, Nextiva for clearer SMB published floors, and Microsoft Teams if collaboration is the primary job.",
    alternativeSlugs: ["dialpad", "zoom", "aircall", "nextiva", "microsoft-teams"],
    competitorSlugs: ["dialpad", "zoom", "aircall", "nextiva", "microsoft-teams"],
    comparableSlugs: ["dialpad", "zoom", "aircall", "nextiva"],
    secondaryCategorySlugs: ["customer-service"],
    subcategorySlugs: [],
    useCaseSlugs: ["business-phone", "sales-calling", "contact-center", "team-communication"],
    teamTypeSlugs: ["sales", "customer-success", "operations"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "ringcentral-ringex",
        url: "https://www.ringcentral.com/office.html",
        title: "RingCentral RingEX",
        domains: ["features", "product-positioning"],
      },
      {
        id: "ringcentral-ai",
        url: "https://www.ringcentral.com/ai.html",
        title: "RingCentral AI",
        domains: ["ai-capabilities", "pricing"],
      },
    ],
  },

  {
    slug: "dialpad",
    name: "Dialpad",
    company: "Dialpad, Inc.",
    website: "https://www.dialpad.com",
    domain: "dialpad.com",
    pricingUrl: "https://www.dialpad.com/pricing/",
    aliases: [],
    membershipRole: "primary",
    jobCluster: "cloud-phone",
    softShortDescription:
      "AI-first cloud phone (Dialpad Connect) with included transcription/summaries — Standard from $15/user/month annual; Sell and Support are separate product ladders.",
    shortDescription:
      "Dialpad is an AI-centred business communications platform. Dialpad Connect is the core cloud phone scored here (Standard $15, Pro $25 annual per user/month; Enterprise custom). Support (~$80+) and Sell (~$39+) are separate products and are not treated as the Connect entry floor. AI transcription and summaries are included on Connect; power dialer depth lives on Sell, and stronger CRM/CTI starts on Pro+.",
    vendorPositioning:
      "The AI-powered customer intelligence platform — voice, meetings and messaging with real-time AI built into every conversation.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 15,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Dialpad pricing is product-tab heavy (Connect / Support / Sell). Connect floors cross-checked 2026-08-17 at medium confidence: Standard $15/user/mo annual ($27 monthly), Pro $25 annual ($35 monthly, 3-user minimum), Enterprise custom (100-user minimum). Support from ~$80 and Sell from ~$39 are separate products — not scored as the Connect core. AI transcription/summaries included on Connect. 14-day trial.",
    fixturePlans: [
      "PLAN connect-standard: name=Connect Standard; amountPerSeat=15; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=medium",
      "PLAN connect-pro: name=Connect Pro; amountPerSeat=25; currency=USD; interval=year; amountPeriod=month; minimumSeats=3; fromFloor=true; confidence=medium",
      "PLAN connect-enterprise: name=Connect Enterprise; contactSales=true; minimumSeats=100",
      "PLAN sell: name=Dialpad Sell; amountPerSeat=39; currency=USD; interval=year; amountPeriod=month; note=separate-product; fromFloor=true",
      "PLAN support: name=Dialpad Support; amountPerSeat=80; currency=USD; interval=year; amountPeriod=month; note=separate-product; fromFloor=true",
    ],
    enrichmentPlans: [
      planPerSeatAnnual("connect-standard", "Connect Standard", 15, {
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "$15/user/month billed annually ($27 monthly) — medium-confidence Connect floor. Cloud phone with AI transcription and summaries included.",
      }),
      planPerSeatAnnual("connect-pro", "Connect Pro", 25, {
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        minimumSeats: 3,
        description:
          "$25/user/month annual ($35 monthly) with a 3-user minimum. Stronger CRM/CTI and advanced Connect features versus Standard.",
      }),
      contactSalesPlan("connect-enterprise", "Connect Enterprise", {
        limits: { minimumSeats: 100 },
        description:
          "Custom Connect packaging with a 100-user minimum — quote-based enterprise UCaaS.",
      }),
      planPerSeatAnnual("sell", "Dialpad Sell", 39, {
        description:
          "Separate sales product from ~$39/user/month — power-dialer depth lives here, not on Connect Standard. Not used as the scored entry floor.",
      }),
      planPerSeatAnnual("support", "Dialpad Support", 80, {
        description:
          "Separate contact-centre/support product from ~$80/user/month — not scored as Dialpad Connect core.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "supported",
      "call-recording": "supported",
      "power-dialer": "higher-plan-only",
      "sms-messaging": "supported",
      "whatsapp-business": "limited",
      "shared-inbox": "limited",
      "team-messaging": "supported",
      "video-meetings": "supported",
      "crm-cti": "higher-plan-only",
      "analytics-reporting": "supported",
      "ai-assistance": "supported",
      "unified-inbox": "limited",
    },
    aiLines: [
      "AI transcription: supported",
      "AI summaries: supported",
      "AI assistant: supported",
      "AI real-time coaching: higher-plan-only",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native", notes: "Deeper CTI on Pro+" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "zendesk", kind: "native" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "zoom", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Pricing page is product-tab heavy — Connect vs Support vs Sell can confuse buyers comparing a single seat price",
      "Connect Pro has a 3-user minimum; Enterprise requires 100 users",
      "Power dialer depth requires Dialpad Sell, not Connect Standard",
      "Stronger CRM/CTI is Pro+ gated",
      "WhatsApp Business and shared/unified inbox are limited versus messaging platforms",
      "Support (~$80+) and Sell (~$39+) are separate products that raise TCO if you need those jobs",
    ],
    limitationKinds: [
      "other",
      "plan-restriction",
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
      "high-cost-at-scale",
    ],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 9,
      "routing-workflows": 9,
      integrations: 8,
      analytics: 9,
      "outbound-tools": 8,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 10,
    },
    scoreRationales: {
      "ease-of-use":
        "Dialpad Connect is packaged for fast cloud-phone adoption with modern apps and a 14-day trial. Multi-product tabs (Connect/Support/Sell) add buying complexity. Score reflects documented onboarding posture, not hands-on lab testing.",
      "voice-messaging-quality":
        "Connect delivers solid cloud phone, SMS, team messaging and video with AI transcription on the call surface. Strong voice/messaging envelope short of RingCentral’s full UCaaS+contact-centre breadth.",
      "routing-workflows":
        "Business call routing and IVR-style workflows are first-party Connect strengths; Support ladder adds contact-centre depth as a separate product. Scored on Connect routing, not assuming Support packaging.",
      integrations:
        "Native Salesforce, HubSpot, Zendesk, Slack, Zoom and Google Workspace connectors are real, with deeper CTI on Pro+. Broad but slightly narrower than RingCentral/Teams ecosystem gravity.",
      analytics:
        "Conversation analytics and AI-derived insights are a Dialpad hallmark, with reporting that benefits from included transcription/summaries. Score grounded in published AI analytics positioning.",
      "outbound-tools":
        "SMS and Connect outbound calling cover day-to-day sales calling; power-dialer depth requires Sell. Solid outbound for Connect buyers, with a clear upsell path for dialer-heavy teams.",
      scalability:
        "Pro and Enterprise (100-user minimum) plus Support/Sell ladders cover growth, though product fragmentation and seat minimums create friction versus a single RingEX-style suite.",
      "value-for-money":
        "Connect Standard at $15/user/month annual with included AI transcription/summaries is a strong published floor versus RingCentral’s medium-confidence Core ~$20, tempered by Pro minimums and separate Sell/Support spend if those jobs matter. Affiliate economics excluded.",
      "ai-capabilities":
        "Highest AI score in this Priority-1 set: transcription and summaries are included on Connect rather than sold only as add-ons — Dialpad’s clearest differentiator against RingCentral and Nextiva packaging.",
    },
    bestFor: [
      "Teams that want AI transcription and call summaries included in the cloud phone licence",
      "SMB and mid-market buyers starting on Connect Standard at a clear $15 annual floor",
      "Sales orgs willing to add Dialpad Sell when power dialer becomes the primary job",
    ],
    notIdealFor: [
      "Buyers who need power dialer on the cheapest Connect seat",
      "Enterprises that want one quoted UCaaS+contact-centre bundle without product-tab shopping",
      "Teams whose only need is Slack-style team chat",
    ],
    pros: [
      "AI transcription and summaries included on Connect",
      "Connect Standard from $15/user/month annual",
      "Strong conversation analytics tied to AI",
      "Clear Sell path when outbound dialer depth is required",
      "14-day free trial",
    ],
    cons: [
      "Connect / Support / Sell fragmentation complicates pricing comparisons",
      "Power dialer and deeper CTI are gated off Standard",
      "Pro 3-user and Enterprise 100-user minimums",
      "WhatsApp and shared inbox depth are limited",
      "Support ladder is expensive if contact centre is the real job",
    ],
    keyFeatures: [
      "Dialpad Connect cloud phone with SMS",
      "AI transcription and summaries included",
      "Call recording and call routing",
      "Team messaging and video meetings",
      "CRM/CTI on Pro+",
      "Dialpad Sell power dialer (separate product)",
    ],
    pricingSummary:
      "Dialpad Connect: Standard $15/user/mo annual ($27 monthly), Pro $25 annual ($35 monthly, 3-user min), Enterprise custom (100-user min). Support from ~$80 and Sell from ~$39 are separate products. AI transcription/summaries included on Connect. 14-day trial. Medium confidence — pricing page is product-tab heavy; floors cross-checked 2026-08-17.",
    whoShouldChoose:
      "Choose Dialpad when included AI on the phone licence matters as much as calling itself, and Connect Standard’s $15 annual floor fits the team size.",
    whoShouldConsiderAlternatives:
      "Compare RingCentral for broader UCaaS+contact-centre scale, Aircall for CRM/CTI-led mid-market phone, Zoom for meetings-first bundles, and Nextiva for clearer SMB published Core floors.",
    alternativeSlugs: ["ringcentral", "aircall", "zoom", "nextiva"],
    competitorSlugs: ["ringcentral", "aircall", "zoom", "nextiva"],
    comparableSlugs: ["ringcentral", "aircall", "zoom", "nextiva"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: ["business-phone", "sales-calling", "team-communication"],
    teamTypeSlugs: ["sales", "customer-success", "operations"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "dialpad-connect",
        url: "https://www.dialpad.com/products/connect/",
        title: "Dialpad Connect",
        domains: ["features", "product-positioning"],
      },
      {
        id: "dialpad-ai",
        url: "https://www.dialpad.com/ai/",
        title: "Dialpad AI",
        domains: ["ai-capabilities"],
      },
    ],
  },

  {
    slug: "zoom",
    name: "Zoom",
    company: "Zoom Video Communications, Inc.",
    website: "https://www.zoom.com",
    domain: "zoom.com",
    pricingUrl: "https://www.zoom.com/en/pricing/",
    aliases: ["Zoom Phone", "Zoom Workplace"],
    membershipRole: "primary",
    jobCluster: "cloud-phone",
    softShortDescription:
      "Meetings-first Workplace suite plus Zoom Phone UCaaS — Phone US/CA Unlimited research floor ~$15–16/user/month; free meetings/chat exist but Phone is paid.",
    shortDescription:
      "Zoom combines Zoom Workplace (meetings, chat, whiteboard) with Zoom Phone for cloud PBX. Free Workplace meetings/chat exist, but business phone is a paid Zoom Phone add-on or bundle (US/CA Unlimited research floor ~$15–16; Pro Plus ~$20.50 / Business Plus ~$24.50 annual bundles). AI Companion is included on paid Workplace surfaces; call recording and Power Pack dialer options are higher-plan or add-on.",
    vendorPositioning:
      "One platform for workplace collaboration — AI-powered meetings, phone, chat and webinars that keep hybrid teams connected.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: true,
    startingPriceMonthly: 15,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Cross-checked 2026-08-17. Free Zoom meetings/chat exist (Workplace free) but Zoom Phone is paid. Zoom Phone US/CA Unlimited research floor ~$15–16/user/month; Workplace Pro/Business video plans are separate. Phone bundles commonly cited: Pro Plus ~$20.50 and Business Plus ~$24.50 per user/month annual — document carefully and confirm live. Medium confidence on Phone seat floors versus meetings SKUs.",
    fixturePlans: [
      "PLAN workplace-free: name=Workplace Free; isFree=true; note=meetings-chat-not-full-phone",
      "PLAN zoom-phone-unlimited: name=Zoom Phone US/CA Unlimited; amountPerSeat=15; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=medium",
      "PLAN workplace-pro-plus: name=Workplace Pro Plus; amountPerSeat=20.50; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=medium; note=phone-bundle",
      "PLAN workplace-business-plus: name=Workplace Business Plus; amountPerSeat=24.50; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=medium; note=phone-bundle",
    ],
    enrichmentPlans: [
      freePlan("workplace-free", "Workplace Free", {
        description:
          "$0 — free Zoom meetings and team chat. Not a full Zoom Phone system; PSTN business phone requires paid Zoom Phone.",
      }),
      planPerSeatAnnual("zoom-phone-unlimited", "Zoom Phone US/CA Unlimited", 15, {
        hasFreeTrial: true,
        description:
          "From ~$15–16/user/month research floor for US/CA Unlimited Zoom Phone (medium confidence). Paid cloud PBX on top of or bundled with Workplace.",
      }),
      planPerSeatAnnual("workplace-pro-plus", "Workplace Pro Plus", 20.5, {
        highlighted: true,
        hasFreeTrial: true,
        description:
          "From ~$20.50/user/month annual — commonly cited Pro + Phone bundle floor (medium confidence). Confirm live regional packaging.",
      }),
      planPerSeatAnnual("workplace-business-plus", "Workplace Business Plus", 24.5, {
        hasFreeTrial: true,
        description:
          "From ~$24.50/user/month annual — commonly cited Business + Phone bundle floor (medium confidence).",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "supported",
      "call-recording": "higher-plan-only",
      "power-dialer": "add-on",
      "sms-messaging": "supported",
      "whatsapp-business": "not-supported",
      "shared-inbox": "limited",
      "team-messaging": "supported",
      "video-meetings": "supported",
      "crm-cti": "higher-plan-only",
      "analytics-reporting": "limited",
      "ai-assistance": "supported",
      "unified-inbox": "limited",
    },
    aiLines: [
      "AI companion: supported",
      "AI summaries: supported",
      "AI transcription: supported",
      "AI meeting insights: supported",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native", notes: "Deeper CTI on higher Phone/Workplace plans" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native", notes: "Interoperability / calendar surfaces" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "microsoft-365", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Free Workplace covers meetings/chat — not full Zoom Phone PSTN service",
      "Phone seat floors and Pro Plus / Business Plus bundles are medium confidence and region-sensitive",
      "Call recording is higher-plan-only or add-on depending on SKU",
      "Power Pack dialer is an add-on, not included on base Phone",
      "WhatsApp Business is not supported as a first-party channel",
      "Phone analytics depth is limited versus contact-centre specialists unless higher plans are purchased",
    ],
    limitationKinds: [
      "plan-restriction",
      "other",
      "plan-restriction",
      "requires-add-on",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 9,
      "voice-messaging-quality": 9,
      "routing-workflows": 8,
      integrations: 9,
      analytics: 8,
      "outbound-tools": 7,
      scalability: 9,
      "value-for-money": 8,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Zoom’s meetings UX is the most familiar collaboration surface in this set, and Phone inherits that client familiarity. Score reflects documented product accessibility, not hands-on lab testing.",
      "voice-messaging-quality":
        "Video meetings are a core strength; Zoom Phone adds credible cloud PBX voice and SMS for UCaaS buyers. Combined meetings+phone envelope scores high, with the caveat that free tier is not full phone.",
      "routing-workflows":
        "Zoom Phone supports business call routing and IVR-style workflows suitable for SMB/mid-market PBX replacement, without matching RingCentral RingCX contact-centre depth out of the box.",
      integrations:
        "Dense Workplace ecosystem connectors spanning Salesforce, HubSpot, Google Workspace, Microsoft 365, Slack and Zapier. Strong interoperability gravity for hybrid workplaces.",
      analytics:
        "Meeting and Phone analytics are solid on paid plans; deeper phone/contact analytics remain limited or higher-plan gated versus Dialpad/RingCentral AI analytics packaging.",
      "outbound-tools":
        "SMS and Phone outbound cover standard sales calling; Power Pack dialer is add-on. Weaker outbound posture than Sell-oriented dialer products.",
      scalability:
        "Global brand, Workplace enterprise controls and Zoom Phone multi-site deployments scale well for mid-market and enterprise, especially meetings-first organisations adding phone later.",
      "value-for-money":
        "Free meetings/chat plus a ~$15 Phone research floor (medium confidence) and Pro Plus ~$20.50 / Business Plus ~$24.50 annual bundles offer accessible entry if you already live in Zoom — confirm regional Phone pricing live. Affiliate economics excluded.",
      "ai-capabilities":
        "AI Companion (summaries, transcription, meeting assistance) is a first-party strength on paid Workplace surfaces. Phone-specific AI depth is credible but secondary to meetings AI in published packaging.",
    },
    bestFor: [
      "Organisations already standardised on Zoom meetings that want to add Zoom Phone",
      "Hybrid teams that need video-first collaboration with optional cloud PBX",
      "SMB through enterprise buyers who value freemium Workplace entry before paying for Phone",
    ],
    notIdealFor: [
      "Buyers who need WhatsApp Business or a shared customer inbox as a primary channel",
      "Contact-centre teams that need RingCX/Support-class routing without add-ons",
      "Dialer-heavy sales orgs that need power dialer in the base seat",
    ],
    pros: [
      "Best-in-class video meetings familiarity",
      "Free Workplace meetings/chat entry",
      "Zoom Phone UCaaS with SMS and routing",
      "AI Companion on paid Workplace",
      "Broad Google Workspace / Microsoft 365 / CRM integrations",
    ],
    cons: [
      "Full business phone is paid — free tier is not Zoom Phone",
      "Phone seat floors and bundles need live confirmation (medium confidence)",
      "Call recording and Power Pack dialer gated/add-on",
      "No WhatsApp Business channel",
      "Phone analytics trail contact-centre specialists",
    ],
    keyFeatures: [
      "Zoom Workplace meetings, chat and webinars",
      "Zoom Phone cloud PBX with SMS",
      "Call routing / IVR",
      "AI Companion summaries and transcription",
      "CRM/CTI on higher plans",
      "Power Pack dialer add-on",
    ],
    pricingSummary:
      "Workplace Free covers meetings/chat only. Zoom Phone US/CA Unlimited research floor ~$15–16/user/month; Pro Plus ~$20.50 and Business Plus ~$24.50 annual bundles commonly cited — medium confidence, confirm live. Workplace Pro/Business video SKUs are separate from Phone. Cross-checked 2026-08-17.",
    whoShouldChoose:
      "Choose Zoom when meetings are already the collaboration hub and you want Zoom Phone as the natural UCaaS extension rather than a separate PBX vendor.",
    whoShouldConsiderAlternatives:
      "Compare RingCentral for deeper phone/contact-centre UCaaS, Dialpad for included call AI, Microsoft Teams if M365 is the workplace standard, and Aircall for CRM/CTI-led phone without a meetings suite.",
    alternativeSlugs: ["ringcentral", "dialpad", "microsoft-teams", "aircall"],
    competitorSlugs: ["ringcentral", "dialpad", "microsoft-teams", "aircall"],
    comparableSlugs: ["ringcentral", "dialpad", "microsoft-teams"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: ["business-phone", "team-communication"],
    teamTypeSlugs: ["operations", "sales", "customer-success"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "zoom-phone",
        url: "https://www.zoom.com/en/products/ip-phone/",
        title: "Zoom Phone",
        domains: ["features", "pricing"],
      },
      {
        id: "zoom-ai-companion",
        url: "https://www.zoom.com/en/products/ai-companion/",
        title: "Zoom AI Companion",
        domains: ["ai-capabilities"],
      },
    ],
  },

  {
    slug: "nextiva",
    name: "Nextiva",
    company: "Nextiva, Inc.",
    website: "https://www.nextiva.com",
    domain: "nextiva.com",
    pricingUrl: "https://www.nextiva.com/nextiva-pricing",
    aliases: [],
    membershipRole: "primary",
    jobCluster: "cloud-phone",
    softShortDescription:
      "SMB-friendly unified business communications — Core $15, Engage $25, Scale $75 per user/month annual, with messaging apps including WhatsApp and a Contact Center ladder from $75/agent.",
    shortDescription:
      "Nextiva is a cloud business phone and customer-communications platform aimed at SMBs. Published annual floors (verified 2026-08-17): Core $15, Engage $25, Scale $75 per user/month ($23/$50 monthly on Core/Engage). Contact Center Essential starts from $75/agent. Recording is an add-on on Core; analytics and AI land on higher plans / XBert add-on from $99/mo. Annual SMB pricing commonly targets new customers with 1–100 employees on 12-month+ terms.",
    vendorPositioning:
      "Business communications that help you connect with customers — voice, video, messaging and AI in one platform built for growing companies.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 15,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-17 from nextiva.com/nextiva-pricing (high confidence). Core $15, Engage $25, Scale $75 per user/mo annual ($23/$50 monthly for Core/Engage). Contact Center Essential from $75/agent. Eligibility note: annual SMB pricing for new customers 1–100 employees on 12-month+ terms is commonly part of the offer — confirm live. Recording add-on on Core; AI on Scale / XBert add-on from $99/mo.",
    fixturePlans: [
      "PLAN core: name=Core; amountPerSeat=15; currency=USD; interval=year; amountPeriod=month",
      "PLAN engage: name=Engage; amountPerSeat=25; currency=USD; interval=year; amountPeriod=month",
      "PLAN scale: name=Scale; amountPerSeat=75; currency=USD; interval=year; amountPeriod=month",
      "PLAN contact-center-essential: name=Contact Center Essential; amountPerSeat=75; currency=USD; interval=year; amountPeriod=month; note=per-agent",
    ],
    enrichmentPlans: [
      planPerSeatAnnual("core", "Core", 15, {
        hasFreeTrial: true,
        description:
          "$15/user/month billed annually ($23 monthly). Cloud phone entry; call recording is an add-on on Core. Confirm 1–100 employee / 12-month SMB eligibility live.",
      }),
      planPerSeatAnnual("engage", "Engage", 25, {
        highlighted: true,
        hasFreeTrial: true,
        description:
          "$25/user/month billed annually ($50 monthly). Stronger messaging and engagement surface versus Core.",
      }),
      planPerSeatAnnual("scale", "Scale", 75, {
        hasFreeTrial: true,
        description:
          "$75/user/month billed annually. Higher-tier unified communications with AI capabilities; XBert AI add-on also published from $99/mo.",
      }),
      planPerSeatAnnual("contact-center-essential", "Contact Center Essential", 75, {
        description:
          "From $75/agent/month — separate contact-centre ladder. Power-dialer depth associated with CC Professional.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "supported",
      "call-recording": "add-on",
      "power-dialer": "higher-plan-only",
      "sms-messaging": "supported",
      "whatsapp-business": "supported",
      "shared-inbox": "supported",
      "team-messaging": "supported",
      "video-meetings": "supported",
      "crm-cti": "add-on",
      "analytics-reporting": "higher-plan-only",
      "ai-assistance": "higher-plan-only",
      "unified-inbox": "supported",
    },
    aiLines: [
      "AI assistance: higher-plan-only",
      "AI xbert: add-on",
      "AI summaries: higher-plan-only",
      "AI transcription: higher-plan-only",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native", notes: "CTI often add-on / higher packaging" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "zendesk", kind: "native" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Call recording is an add-on on Core rather than included",
      "Analytics and AI assistance require Scale / higher plans or XBert add-on from $99/mo",
      "Power dialer depth is contact-centre Professional territory, not Core",
      "CRM/CTI commonly packaged as add-on",
      "Published annual SMB floors often assume new customers 1–100 employees on 12-month+ terms — confirm eligibility",
      "Scale at $75/user/month is a steep jump from Engage for teams that only need light AI",
    ],
    limitationKinds: [
      "requires-add-on",
      "plan-restriction",
      "plan-restriction",
      "requires-add-on",
      "other",
      "high-cost-at-scale",
    ],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 9,
      "routing-workflows": 8,
      integrations: 8,
      analytics: 8,
      "outbound-tools": 7,
      scalability: 8,
      "value-for-money": 8,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Nextiva markets a straightforward SMB phone-and-messaging setup with published plan names (Core/Engage/Scale). Score reflects documented packaging clarity, not hands-on lab testing.",
      "voice-messaging-quality":
        "Cloud phone plus SMS, WhatsApp/messaging apps, team messaging and video give Nextiva a broad multi-channel envelope for SMB customer communications.",
      "routing-workflows":
        "Business call routing covers typical SMB PBX needs; contact-centre Essential/Professional deepen queues and dialer workflows as a separate ladder rather than Core defaults.",
      integrations:
        "Salesforce, HubSpot, Zendesk, Slack, Teams and Google Workspace connectors are present; CTI depth is often add-on packaged, which caps the integrations score below CTI specialists.",
      analytics:
        "Reporting strengthens on higher plans — scored as capable but higher-plan gated relative to Dialpad’s included AI analytics posture.",
      "outbound-tools":
        "SMS and calling cover standard outbound; power dialer requires contact-centre Professional. Adequate for SMB outbound, not dialer-first sales teams on Core.",
      scalability:
        "Core → Engage → Scale plus Contact Center Essential from $75/agent covers growth into mid-market, with eligibility constraints on promotional SMB annual pricing.",
      "value-for-money":
        "Core at $15/user/month annual with high-confidence first-party verification is one of the clearest SMB phone floors in this set; Engage at $25 remains accessible before Scale/CC/AI add-ons raise TCO. Affiliate economics excluded.",
      "ai-capabilities":
        "AI on Scale and XBert from $99/mo are real but higher-plan/add-on packaged — credible AI without Dialpad’s included-on-entry advantage.",
    },
    bestFor: [
      "SMB teams wanting a clear $15 Core annual cloud-phone floor",
      "Businesses that need WhatsApp/messaging apps alongside voice in one vendor",
      "Growing companies that may expand into Nextiva Contact Center later",
    ],
    notIdealFor: [
      "Buyers who need call recording, analytics and AI included on the cheapest seat",
      "Dialer-heavy sales teams that need power dialer on Core",
      "Enterprises standardised on Microsoft 365 that want Teams Phone as the PBX",
    ],
    pros: [
      "High-confidence Core $15 / Engage $25 annual published floors",
      "WhatsApp and messaging apps supported",
      "Shared and unified inbox surfaces",
      "Contact Center ladder from $75/agent",
      "Broad SMB multi-channel packaging",
    ],
    cons: [
      "Recording add-on on Core",
      "Analytics and AI gated to Scale / XBert",
      "Power dialer on CC Professional, not Core",
      "CRM/CTI often add-on",
      "Scale $75 and eligibility notes complicate “from $15” comparisons",
    ],
    keyFeatures: [
      "Cloud phone with SMS",
      "WhatsApp and messaging apps",
      "Shared / unified inbox",
      "Team messaging and video meetings",
      "Contact Center Essential from $75/agent",
      "AI on Scale / XBert add-on",
    ],
    pricingSummary:
      "Core $15, Engage $25, Scale $75 per user/mo annual ($23/$50 monthly for Core/Engage). Contact Center Essential from $75/agent. Recording add-on on Core; AI on Scale / XBert from $99/mo. Verified high confidence 2026-08-17 on nextiva.com/nextiva-pricing — confirm SMB eligibility (often 1–100 employees, 12-month+) live.",
    whoShouldChoose:
      "Choose Nextiva when you want a transparent SMB cloud-phone floor with messaging apps (including WhatsApp) and a path into contact centre without jumping straight to enterprise UCaaS quotes.",
    whoShouldConsiderAlternatives:
      "Compare Aircall for CRM/CTI depth, RingCentral for enterprise UCaaS scale, Dialpad for included call AI, and CallHippo for lower-friction SMB entry experiments.",
    alternativeSlugs: ["aircall", "ringcentral", "dialpad", "callhippo"],
    competitorSlugs: ["aircall", "ringcentral", "dialpad", "callhippo"],
    comparableSlugs: ["aircall", "ringcentral", "dialpad", "callhippo"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: ["business-phone", "customer-messaging", "team-communication", "contact-center"],
    teamTypeSlugs: ["sales", "customer-success", "operations"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "nextiva-pricing",
        url: "https://www.nextiva.com/nextiva-pricing",
        title: "Nextiva Pricing",
        domains: ["pricing", "plans"],
      },
      {
        id: "nextiva-contact-center",
        url: "https://www.nextiva.com/products/contact-center",
        title: "Nextiva Contact Center",
        domains: ["features", "pricing"],
      },
    ],
  },

  {
    slug: "microsoft-teams",
    name: "Microsoft Teams",
    company: "Microsoft",
    website: "https://www.microsoft.com/en/microsoft-teams",
    domain: "microsoft.com",
    pricingUrl: "https://www.microsoft.com/en-us/microsoft-teams/compare-microsoft-teams-options",
    aliases: ["Teams", "Microsoft Teams Phone"],
    membershipRole: "primary",
    jobCluster: "team-messaging",
    softShortDescription:
      "M365 collaboration hub (chat, meetings, files) with optional Teams Phone telephony add-on — free Teams tier exists; Phone Standard ~$10/user/month annual plus PSTN.",
    shortDescription:
      "Microsoft Teams is scored here as a team-messaging and collaboration hub, not as a peer cloud-phone product. Free Teams and Microsoft 365 Plans include chat and meetings; Teams Phone Standard (~$10/user/month annual) plus PSTN (PAYG ~$13 / Calling Plan ~$17 / Domestic+International ~$34) is a telephony add-on that also requires an eligible Teams/M365 licence. October 2023 Teams unbundling means Teams is no longer assumed free inside every Microsoft 365 SKU — verify licence packaging.",
    vendorPositioning:
      "The hub for teamwork in Microsoft 365 — chat, meetings, calling and apps in one place your organisation already trusts.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: true,
    startingPriceMonthly: 0,
    startingPriceConfidence: "high",
    pricingNotes:
      "Free Teams tier at $0 for chat/meetings collaboration. Teams Phone Standard ~$10/user/month annual is a telephony add-on requiring a separate eligible Teams/M365 licence, plus PSTN options (PAYG ~$13 / Calling Plan ~$17 / Domestic+International ~$34 research bands). Be honest about M365 dependency and Oct 2023 Teams unbundling — many orgs pay via Microsoft 365 Business/Enterprise SKUs rather than standalone Teams. Cross-checked packaging 2026-08-17; confirm regional Microsoft price lists live.",
    fixturePlans: [
      "PLAN free: name=Microsoft Teams Free; isFree=true",
      "PLAN teams-phone-standard: name=Teams Phone Standard; amountPerSeat=10; currency=USD; interval=year; amountPeriod=month; note=telephony-add-on-requires-teams-m365",
      "PLAN calling-plan: name=Teams Calling Plan; amountPerSeat=17; currency=USD; interval=year; amountPeriod=month; note=pstn-add-on; fromFloor=true",
      "PLAN domestic-international: name=Domestic + International Calling; amountPerSeat=34; currency=USD; interval=year; amountPeriod=month; note=pstn-add-on; fromFloor=true",
    ],
    enrichmentPlans: [
      freePlan("free", "Microsoft Teams Free", {
        description:
          "$0 — free Teams chat and meetings tier. Not full enterprise M365 governance; telephony requires Teams Phone + PSTN on top of an eligible licence.",
      }),
      planPerSeatAnnual("teams-phone-standard", "Teams Phone Standard", 10, {
        description:
          "~$10/user/month annual telephony add-on. Requires a separate eligible Teams/Microsoft 365 licence — not a standalone cloud-phone product.",
      }),
      planPerSeatAnnual("calling-plan", "Teams Calling Plan", 17, {
        description:
          "PSTN Calling Plan research floor ~$17/user/month — one of several PSTN options (PAYG ~$13, Domestic+International ~$34). Confirm live Microsoft price lists.",
      }),
      contactSalesPlan("microsoft-365-enterprise", "Microsoft 365 Enterprise", {
        description:
          "Most enterprise Teams deployments are licensed via Microsoft 365 Business/Enterprise SKUs rather than standalone Teams. Contact Microsoft or a partner for bundle pricing.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "add-on",
      "call-routing": "limited",
      "call-recording": "limited",
      "power-dialer": "not-supported",
      "sms-messaging": "limited",
      "whatsapp-business": "not-supported",
      "shared-inbox": "limited",
      "team-messaging": "supported",
      "video-meetings": "supported",
      "crm-cti": "limited",
      "analytics-reporting": "limited",
      "ai-assistance": "add-on",
      "unified-inbox": "limited",
    },
    aiLines: [
      "AI copilot: add-on",
      "AI meeting summaries: add-on",
      "AI transcription: limited",
      "AI assistant: add-on",
    ],
    integrations: [
      { integrationSlug: "microsoft-365", kind: "native", notes: "Core dependency — Outlook, SharePoint, OneDrive, Entra ID" },
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "zendesk", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "zoom", kind: "third-party", notes: "Interoperability / meeting alternatives" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Scored as a collaboration hub — Teams Phone is a telephony add-on, not the primary scored job",
      "Teams Phone requires an eligible Teams/M365 licence plus PSTN (PAYG or Calling Plan)",
      "October 2023 Teams unbundling means Teams is not free inside every Microsoft 365 SKU",
      "No power dialer; SMS and WhatsApp are not first-class customer channels",
      "Copilot AI is a separately priced Microsoft 365 add-on",
      "Call routing/recording depth is limited versus dedicated UCaaS/contact-centre products",
    ],
    limitationKinds: [
      "other",
      "requires-add-on",
      "other",
      "feature-unavailable",
      "requires-add-on",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 7,
      "routing-workflows": 5,
      integrations: 10,
      analytics: 6,
      "outbound-tools": 3,
      scalability: 10,
      "value-for-money": 8,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Familiar chat/meetings UX for Microsoft 365 users, with admin complexity rising once Phone, policies and compliance are enabled. Score reflects documented collaboration accessibility, not hands-on lab testing.",
      "voice-messaging-quality":
        "Strong team messaging and video meetings; PSTN voice exists only via Teams Phone add-on. Scored as a collaboration hub — telephony is secondary, so voice sits below dedicated cloud-phone peers by design.",
      "routing-workflows":
        "Teams Phone offers limited business call routing relative to RingCentral/Dialpad/Nextiva PBX depth. Not scored as a contact-centre router.",
      integrations:
        "Highest integrations score: native Microsoft 365 gravity (Outlook, SharePoint, OneDrive, Entra) plus broad third-party app ecosystem. Unmatched for organisations already on M365.",
      analytics:
        "Teams admin and meeting analytics are adequate for collaboration; communication/contact-centre analytics are limited versus phone specialists.",
      "outbound-tools":
        "No power dialer and weak customer outbound tooling — Teams is not an outbound sales-calling platform. Low score reflects absent job fit, not a defect in chat.",
      scalability:
        "Enterprise identity, compliance and global Microsoft 365 deployment patterns make Teams the scalability ceiling for collaboration hubs in this set.",
      "value-for-money":
        "Free Teams tier and M365-bundled chat/meetings are strong value when the org already pays Microsoft; Teams Phone + PSTN + possible Copilot add cost quickly if telephony is the real requirement. Affiliate economics excluded.",
      "ai-capabilities":
        "Microsoft 365 Copilot is a powerful AI surface but sold as an add-on — capability is high, inclusion in base Teams is not.",
    },
    bestFor: [
      "Organisations standardised on Microsoft 365 that need chat and meetings as the collaboration hub",
      "Enterprises that may add Teams Phone later for PSTN without changing collaboration vendors",
      "IT-led rollouts that prioritise identity, compliance and app ecosystem over dialer features",
    ],
    notIdealFor: [
      "Buyers shortlisting a primary cloud phone / contact-centre system",
      "Sales teams that need power dialer, SMS campaigns or WhatsApp Business",
      "Companies unwilling to navigate M365 licence + Teams Phone + PSTN stacking",
    ],
    pros: [
      "Free Teams tier and deep Microsoft 365 integration",
      "Excellent team messaging and video meetings",
      "Enterprise identity, compliance and scale",
      "Optional Teams Phone when PSTN is required",
      "Copilot AI available as Microsoft add-on",
    ],
    cons: [
      "Not a cloud-phone peer — Phone is an add-on with PSTN costs",
      "Post-2023 unbundling complicates “Teams is included” assumptions",
      "No power dialer; weak customer outbound channels",
      "Copilot is separately priced",
      "Call routing/recording trail dedicated UCaaS products",
    ],
    keyFeatures: [
      "Team messaging and channels",
      "Video meetings and webinars",
      "Microsoft 365 file and app hub",
      "Optional Teams Phone + PSTN",
      "Limited CRM connectors (e.g. Dynamics-oriented CTI)",
      "Microsoft 365 Copilot add-on",
    ],
    pricingSummary:
      "Free Teams at $0 for collaboration. Teams Phone Standard ~$10/user/month annual plus eligible Teams/M365 licence, then PSTN (PAYG ~$13 / Calling Plan ~$17 / Domestic+International ~$34 research bands). Most orgs licence via Microsoft 365 SKUs; Oct 2023 unbundling applies. Confirm live Microsoft price lists.",
    whoShouldChoose:
      "Choose Microsoft Teams when collaboration inside Microsoft 365 is the primary job and telephony is an optional add-on — not when you are shopping for a standalone cloud phone.",
    whoShouldConsiderAlternatives:
      "Compare Slack for chat-first teams outside M365, Zenzap for frontline work chat, and Zoom if meetings-first UCaaS with Zoom Phone fits better than Teams Phone stacking.",
    alternativeSlugs: ["slack", "zenzap", "zoom"],
    competitorSlugs: ["slack", "zenzap", "zoom"],
    comparableSlugs: ["slack", "zenzap", "zoom"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: ["team-communication"],
    teamTypeSlugs: ["operations", "customer-success", "sales"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "teams-phone",
        url: "https://www.microsoft.com/en-us/microsoft-teams/microsoft-teams-phone",
        title: "Microsoft Teams Phone",
        domains: ["features", "pricing"],
      },
      {
        id: "teams-compare",
        url: "https://www.microsoft.com/en-us/microsoft-teams/compare-microsoft-teams-options",
        title: "Compare Microsoft Teams options",
        domains: ["pricing", "plans"],
      },
    ],
  },

  {
    slug: "slack",
    name: "Slack",
    company: "Salesforce",
    website: "https://slack.com",
    domain: "slack.com",
    pricingUrl: "https://slack.com/pricing",
    aliases: [],
    membershipRole: "primary",
    jobCluster: "team-messaging",
    softShortDescription:
      "Channel-based team messaging platform — Free $0, Pro $7.25/user/month annual, Business+ $15, Enterprise+ contact sales; huddles for light video, not a phone system.",
    shortDescription:
      "Slack is a team-messaging workspace built around channels, DMs, canvas and workflow automation. Verified slack.com/pricing 2026-08-17: Free $0, Pro $7.25/user/month annual ($8.75 monthly), Business+ $15 annual ($18 monthly), Enterprise+ contact sales. Huddles provide limited video/audio; there is no cloud phone, call routing, power dialer, SMS or WhatsApp. AI features strengthen on Business+; analytics are limited on lower tiers.",
    vendorPositioning:
      "Where work happens — channel-based messaging, automation and AI that keep teams aligned without living in email.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 7.25,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-17 from slack.com/pricing (high confidence). Free $0; Pro $7.25/user/month annual ($8.75 monthly); Business+ $15 annual ($18 monthly); Enterprise+ contact sales. No free trial on paid plans in the published pricing table — Free tier is the evaluation path. Salesforce ownership; Slack Connect enables cross-org channels.",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true",
      "PLAN pro: name=Pro; amountPerSeat=7.25; currency=USD; interval=year; amountPeriod=month",
      "PLAN business-plus: name=Business+; amountPerSeat=15; currency=USD; interval=year; amountPeriod=month",
      "PLAN enterprise-plus: name=Enterprise+; contactSales=true",
    ],
    enrichmentPlans: [
      freePlan("free", "Free", {
        description:
          "$0 — limited message/file history and core channel messaging. Primary evaluation path (no published free trial on paid plans).",
      }),
      planPerSeatAnnual("pro", "Pro", 7.25, {
        highlighted: true,
        description:
          "$7.25/user/month billed annually ($8.75 monthly). Unlimited message history, huddles, canvas and core productivity features for growing teams.",
      }),
      planPerSeatAnnual("business-plus", "Business+", 15, {
        description:
          "$15/user/month billed annually ($18 monthly). Stronger admin, compliance and AI assistance versus Pro.",
      }),
      contactSalesPlan("enterprise-plus", "Enterprise+", {
        description:
          "Contact sales for Enterprise+ security, compliance and large-org controls.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "not-supported",
      "call-routing": "not-supported",
      "call-recording": "not-supported",
      "power-dialer": "not-supported",
      "sms-messaging": "not-supported",
      "whatsapp-business": "not-supported",
      "shared-inbox": "limited",
      "team-messaging": "supported",
      "video-meetings": "limited",
      "crm-cti": "limited",
      "analytics-reporting": "limited",
      "ai-assistance": "higher-plan-only",
      "unified-inbox": "limited",
    },
    aiLines: [
      "AI assistance: higher-plan-only",
      "AI summaries: higher-plan-only",
      "AI search: higher-plan-only",
      "AI workflow: limited",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native", notes: "Deepening Salesforce ecosystem alignment" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "microsoft-365", kind: "native" },
      { integrationSlug: "zoom", kind: "native" },
      { integrationSlug: "zendesk", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Not a business phone system — no cloud phone, call routing, recording or power dialer",
      "No SMS or WhatsApp Business customer channels",
      "Video is limited to huddles / meeting integrations rather than a full meetings suite",
      "AI assistance is higher-plan-only (Business+ emphasis)",
      "Analytics are limited on Free/Pro relative to enterprise admin suites",
      "No published free trial on paid plans — Free tier is the trial substitute",
    ],
    limitationKinds: [
      "feature-unavailable",
      "feature-unavailable",
      "feature-unavailable",
      "plan-restriction",
      "plan-restriction",
      "other",
    ],
    scores: {
      "ease-of-use": 9,
      "voice-messaging-quality": 5,
      "routing-workflows": 4,
      integrations: 10,
      analytics: 6,
      "outbound-tools": 2,
      scalability: 9,
      "value-for-money": 7,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Channel-based chat is widely understood and quick to adopt for knowledge workers. Score reflects documented product familiarity, not hands-on lab testing.",
      "voice-messaging-quality":
        "Scored on the internal messaging channel Slack sells: excellent team chat, limited huddles for light audio/video, and no PSTN/SMS/WhatsApp. Ceiling is intentionally below phone peers.",
      "routing-workflows":
        "Channels, workflows and shared channels coordinate internal work, but there is no IVR, queue or customer-routing model — low score is category fit, not a chat UX criticism.",
      integrations:
        "App directory depth plus Salesforce, HubSpot, Google Workspace, Microsoft 365, Zoom and Zapier connectors earn a top integrations score for team-messaging jobs.",
      analytics:
        "Workspace analytics exist but are limited on lower tiers versus enterprise admin/insight packages — adequate, not a reporting platform.",
      "outbound-tools":
        "Slack does not sell dialers, SMS broadcasts or customer outbound messaging. Score reflects absent capability for the BC outbound criterion.",
      scalability:
        "Enterprise+ security/compliance and Slack Connect cross-org patterns scale for large companies; Free history limits are the main growth friction at the bottom.",
      "value-for-money":
        "Pro at $7.25/user/month annual with a real Free tier is transparent and competitive for team chat; Business+ $15 and Enterprise+ quotes raise spend when AI/compliance matter. Affiliate economics excluded.",
      "ai-capabilities":
        "Slack AI summaries/search assistance are credible on Business+ and above — strong for chat, higher-plan gated versus Dialpad’s included phone AI.",
    },
    bestFor: [
      "Knowledge-worker teams that need channel-based team messaging as the primary collaboration hub",
      "Organisations that want a freemium chat workspace with a deep app ecosystem",
      "Salesforce-centric companies aligning chat with CRM workflows",
    ],
    notIdealFor: [
      "Anyone shortlisting a cloud phone, contact centre or WhatsApp platform",
      "Teams that need native video meetings as the primary product (prefer Zoom/Teams)",
      "Buyers who need AI assistance included on Pro",
    ],
    pros: [
      "Best-in-class channel messaging UX",
      "Free tier plus clear Pro $7.25 annual pricing",
      "Deep app directory and Salesforce ecosystem ties",
      "Slack Connect for cross-company channels",
      "AI assistance on Business+",
    ],
    cons: [
      "Not a phone system — no PSTN, routing or dialer",
      "No SMS/WhatsApp customer channels",
      "Video limited to huddles / integrations",
      "AI gated to higher plans",
      "No free trial on paid plans",
    ],
    keyFeatures: [
      "Channels, DMs and Slack Connect",
      "Workflows and automation",
      "Huddles (limited video/audio)",
      "Canvas and clips",
      "App directory integrations",
      "Slack AI on Business+",
    ],
    pricingSummary:
      "Free $0; Pro $7.25/user/month annual ($8.75 monthly); Business+ $15 annual ($18 monthly); Enterprise+ contact sales. Verified high confidence on slack.com/pricing 2026-08-17. No published free trial on paid plans — use Free to evaluate.",
    whoShouldChoose:
      "Choose Slack when internal team messaging is the job to be done and you want freemium channels with a deep integration ecosystem — pair it with a phone vendor if you also need PSTN.",
    whoShouldConsiderAlternatives:
      "Compare Microsoft Teams if M365 is already standard, Zenzap for frontline/WhatsApp-group replacement chat, and Zoom if meetings-first collaboration matters more than channels.",
    alternativeSlugs: ["microsoft-teams", "zenzap", "zoom"],
    competitorSlugs: ["microsoft-teams", "zenzap", "zoom"],
    comparableSlugs: ["microsoft-teams", "zenzap", "zoom"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: ["team-communication"],
    teamTypeSlugs: ["operations", "sales", "customer-success", "founders"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "slack-pricing",
        url: "https://slack.com/pricing",
        title: "Slack Pricing",
        domains: ["pricing", "plans"],
      },
      {
        id: "slack-ai",
        url: "https://slack.com/features/ai",
        title: "Slack AI",
        domains: ["ai-capabilities"],
      },
    ],
  },
];

/** Comparison pairs where BOTH sides are in this PRODUCTS array. */
export const COMPARISON_PAIRS = [
  ["dialpad", "ringcentral"],
  ["zoom", "ringcentral"],
  ["microsoft-teams", "slack"],
  ["zoom", "microsoft-teams"],
];
