/**
 * Business Communications Priority-4 product pack.
 * Landscape deferred-closed: Twilio (CPaaS adjacent platform),
 * ManyChat (marketing messaging), Intercom (customer messaging / CS-borderline).
 *
 * Research floors cross-checked 2026-08-17 from first-party pricing pages
 * (ManyChat Essential/Pro annual floors corroborated via manychat.com/pricing
 * snippets + first-party help centre Active Contacts / Pro plan articles —
 * manychat.com/pricing HTML fetch timed out).
 * Affiliate economics never enter scores.
 * handsOnTesting=false. No invented prices.
 */
import {
  contactSalesPlan,
  freePlan,
  planFlatAnnual,
  planPerSeatAnnual,
  planPerSeatMonthly,
} from "./bc-onboard-runtime.mjs";

/** Usage / metered plan with no seat dollar (empty rules). */
function usagePlan(slug, name, extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: Boolean(extra.isFree),
    contactSales: false,
    hasFreeTrial: Boolean(extra.hasFreeTrial),
    trialDays: extra.trialDays,
    highlighted: Boolean(extra.highlighted),
    rules: [],
    ...(extra.description ? { description: extra.description } : {}),
    ...(extra.limits ? { limits: extra.limits } : {}),
  };
}

export const PRODUCTS = [
  {
    slug: "twilio",
    name: "Twilio",
    company: "Twilio Inc.",
    website: "https://www.twilio.com",
    domain: "twilio.com",
    pricingUrl: "https://www.twilio.com/en-us/pricing",
    aliases: ["Twilio API", "Twilio Flex", "Twilio Communications"],
    membershipRole: "adjacent",
    jobCluster: "communications-platform",
    adjacentNote:
      "Programmable CPaaS (voice/SMS/WhatsApp APIs + optional Flex CCaaS) — landscape adjacent platform only; never ranked as an SMB/mid phone or UCaaS peer.",
    softShortDescription:
      "Programmable voice/SMS/WhatsApp platform (CPaaS) — pay-as-you-go usage; Flex contact center from $150/named user/mo or $1/active user hour.",
    shortDescription:
      "Twilio is a programmable communications platform (CPaaS): developers embed SMS, voice, WhatsApp, video and related channels via APIs, with optional Twilio Flex as a build-your-own cloud contact center. First-party pricing on twilio.com/en-us/pricing (checked 2026-08-17) is usage-based — US SMS from $0.0083 per message, Voice from ~$0.0085/min inbound and ~$0.014/min outbound, WhatsApp from $0.005 per message (use-case dependent), plus number rents and carrier fees. Flex publishes named-user floors from $150/user/month, active-user-hour from $1, and a User+usage model from $35 MAU (flex pricing page 2026-08-17). Free trial / start-for-free path; no SMB softphone seat card. Scored as a developer platform — landscape adjacent only; not a phone-system peer to RingCentral/OpenPhone.",
    vendorPositioning:
      "The customer engagement platform — build trusted, personalised communications with APIs for SMS, voice, WhatsApp, email and more.",
    pricingModel: "usage",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceConfidence: "high",
    pricingNotes:
      "Confirmed 2026-08-17 on twilio.com/en-us/pricing (+ SMS US and Flex pricing pages): pay-as-you-go. US long-code SMS $0.0083 send/receive; Voice ~$0.0085/min receive / ~$0.014/min make; WhatsApp from $0.005; Conversations API $0.05/active user/mo; Flex named $150/user/mo, active user hour $1, User+usage from $35 MAU; long-code numbers from ~$1.15/mo. Carrier fees and destination rates apply. High confidence on published usage/Flex floors — no invented seat dollars for core CPaaS. Do not treat Flex $150 as an SMB phone list price.",
    fixturePlans: [
      "PLAN trial: name=Free trial; amount=0; currency=USD; interval=month; fromFloor=true; confidence=high; notes=Start for free / trial credit path",
      "PLAN sms: name=SMS (US long code); amount=0.0083; currency=USD; unit=message; fromFloor=true; confidence=high",
      "PLAN voice: name=Voice APIs; amount=0.0085; currency=USD; unit=minute-inbound; fromFloor=true; confidence=high; notes=Outbound make from ~$0.014/min",
      "PLAN flex-named: name=Flex Named User; amountPerSeat=150; currency=USD; interval=month; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN flex-hour: name=Flex Active User Hour; amount=1; currency=USD; unit=active-user-hour; fromFloor=true; confidence=high",
      "PLAN enterprise: name=Enterprise / volume; contactSales=true",
    ],
    enrichmentPlans: [
      usagePlan("trial", "Free trial", {
        isFree: true,
        hasFreeTrial: true,
        description:
          "Start for free — no credit card required on signup path. Trial/credit packaging; then pay as you go.",
      }),
      usagePlan("sms", "SMS / MMS", {
        highlighted: true,
        description:
          "US long-code SMS from $0.0083 per message send or receive (2026-08-17). Carrier fees and destination rates apply. Not a softphone seat.",
      }),
      usagePlan("voice", "Voice APIs", {
        description:
          "Voice from ~$0.0085/min to receive and ~$0.014/min to make (hub pricing summary 2026-08-17). Elastic SIP Trunking and Video are separate meters.",
      }),
      planPerSeatMonthly("flex-named", "Flex Named User", 150, {
        hasFreeTrial: true,
        description:
          "$150 per named user/month — Flex cloud contact center seat model. Optional CCaaS build surface; not the scored CPaaS usage floor for phone peers.",
      }),
      usagePlan("flex-hour", "Flex Active User Hour", {
        description:
          "$1 per active user hour (plus 5,000 free hours trial path for new Flex accounts). Alternative to named seats.",
      }),
      contactSalesPlan("enterprise", "Enterprise / volume discounts", {
        description:
          "Committed-use and enterprise volume discounts — contact sales. No invented list dollars.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "limited",
      "call-routing": "supported",
      "call-recording": "supported",
      "power-dialer": "limited",
      "sms-messaging": "supported",
      "whatsapp-business": "supported",
      "shared-inbox": "limited",
      "team-messaging": "not-supported",
      "video-meetings": "supported",
      "crm-cti": "supported",
      "analytics-reporting": "supported",
      "ai-assistance": "add-on",
      "unified-inbox": "limited",
    },
    aiLines: [
      "AI Conversation Intelligence: add-on",
      "AI Agent Copilot (Flex): add-on",
      "AI Conversation Relay / voice AI: add-on",
      "AI Verify / Lookup fraud tools: supported",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native", notes: "Twilio for Salesforce + Flex" },
      { integrationSlug: "zendesk", kind: "native", notes: "Flex / marketplace" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "zapier-style" },
      { integrationSlug: "slack", kind: "zapier-style" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Not an SMB softphone / UCaaS product — requires engineering to ship a phone experience",
      "Usage + carrier fees make TCO hard to forecast versus flat seat phones",
      "Shared inbox / agent UX only appears if you build it or buy Flex",
      "AI (Conversation Intelligence, Flex Copilot) is usage/add-on priced",
      "Compliance (A2P 10DLC, short codes) adds onboarding fees and lead time",
      "Flex named $150 is a CCaaS build seat — not comparable to OpenPhone list prices",
    ],
    limitationKinds: [
      "other",
      "high-cost-at-scale",
      "feature-unavailable",
      "requires-add-on",
      "other",
      "other",
    ],
    scores: {
      "ease-of-use": 4,
      "voice-messaging-quality": 9,
      "routing-workflows": 8,
      integrations: 10,
      analytics: 7,
      "outbound-tools": 9,
      scalability: 10,
      "value-for-money": 7,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "API-first developer platform — excellent for engineers, poor as an SMB plug-and-play phone. Score reflects platform posture, not hands-on lab testing.",
      "voice-messaging-quality":
        "Carrier-grade programmable voice, SMS, WhatsApp and video primitives are top-tier communications infrastructure — scored as CPaaS quality, not as a packaged softphone UX.",
      "routing-workflows":
        "Studio, TaskRouter and Flex give serious routing when you build it — strong DIY routing without claiming turnkey UCaaS IVR out of the box.",
      integrations:
        "API-first gravity plus Salesforce/Zendesk/HubSpot and marketplace connectors — strongest developer integration story in this BC set.",
      analytics:
        "Delivery insights and Conversation Intelligence exist; depth often usage-priced and DIY-dashboard shaped versus packaged UCaaS analytics.",
      "outbound-tools":
        "Programmable SMS/voice at global scale is a core outbound strength — high for platform buyers, not a power-dialer product.",
      scalability:
        "Global multi-channel CPaaS with volume discounts and Flex options — top-tier scale for builders.",
      "value-for-money":
        "Transparent usage meters and free-trial path are fair for developers; carrier fees and DIY labour raise real TCO versus seat phones. Affiliate economics excluded.",
      "ai-capabilities":
        "Conversation Intelligence, Relay and Flex Agent Copilot are credible but add-on/usage packaged — solid mid/high AI for a platform, not Dialpad-included AI.",
    },
    bestFor: [
      "Product and engineering teams embedding voice, SMS or WhatsApp into their own apps",
      "Organisations building a custom contact centre on Flex rather than buying turnkey UCaaS",
      "Buyers who need global programmable messaging with usage-based economics",
    ],
    notIdealFor: [
      "SMB teams that only need a transparent softphone under $30/seat",
      "Non-technical buyers expecting OpenPhone/RingCentral-style admin UX",
      "Teams that want a packaged WhatsApp shared inbox without building (prefer Wati/respond.io)",
    ],
    pros: [
      "Transparent pay-as-you-go meters for SMS, voice and WhatsApp",
      "Global CPaaS breadth with Studio/TaskRouter/Flex expansion path",
      "API-first integrations and developer documentation",
      "Published Flex named / hourly / MAU commercial options",
      "Free trial / start-for-free path",
    ],
    cons: [
      "Not a turnkey SMB business phone",
      "Usage + carrier fees complicate budgeting",
      "Requires engineering ownership",
      "AI features often usage/add-on priced",
      "A2P/compliance onboarding overhead",
    ],
    keyFeatures: [
      "Programmable SMS, Voice, WhatsApp and Video APIs",
      "Studio flow builder and Functions/Assets",
      "TaskRouter skills-based routing",
      "Twilio Flex optional cloud contact center",
      "Verify, Lookup and Conversation Intelligence",
      "Pay-as-you-go with volume discounts",
    ],
    pricingSummary:
      "Pay-as-you-go confirmed on twilio.com/en-us/pricing 2026-08-17: US SMS from $0.0083/msg, Voice from ~$0.0085/min inbound / ~$0.014/min outbound, WhatsApp from $0.005/msg; Flex named from $150/user/mo or $1/active user hour (also User+usage from $35 MAU). Carrier fees apply. High confidence on published meters — no invented CPaaS seat dollars.",
    whoShouldChoose:
      "Choose Twilio when you need programmable voice/SMS/WhatsApp infrastructure or a Flex build-your-own contact centre — not when you only need an SMB business phone.",
    whoShouldConsiderAlternatives:
      "Compare RingCentral/OpenPhone/Aircall for turnkey UCaaS seats, Talkdesk/Genesys for packaged CCaaS, and Wati/respond.io for WhatsApp shared inboxes without building on APIs.",
    alternativeSlugs: ["ringcentral", "talkdesk", "respond-io", "wati"],
    competitorSlugs: ["ringcentral", "talkdesk", "genesys", "respond-io"],
    comparableSlugs: ["talkdesk", "respond-io"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: ["customer-messaging", "contact-center", "sales-calling"],
    teamTypeSlugs: ["operations", "customer-success", "sales"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "twilio-sms-us",
        url: "https://www.twilio.com/en-us/sms/pricing/us",
        title: "Twilio SMS pricing (United States)",
        domains: ["pricing", "plans", "limits"],
      },
      {
        id: "twilio-flex-pricing",
        url: "https://www.twilio.com/en-us/flex/pricing",
        title: "Twilio Flex pricing",
        domains: ["pricing", "plans", "product-positioning"],
      },
    ],
  },

  {
    slug: "manychat",
    name: "ManyChat",
    company: "ManyChat, Inc.",
    website: "https://manychat.com",
    domain: "manychat.com",
    pricingUrl: "https://manychat.com/pricing",
    aliases: ["Manychat", "Many Chat"],
    membershipRole: "primary",
    jobCluster: "customer-messaging",
    softShortDescription:
      "Messenger / Instagram / WhatsApp marketing chatbot — Free 25 Active Contacts; Essential from $14/mo annual; Pro $29/mo annual.",
    shortDescription:
      "ManyChat is a marketing-oriented chatbot and messaging automation platform spanning Instagram, Facebook Messenger, TikTok, WhatsApp, Telegram, SMS and email. The post–March 2, 2026 Active Contacts model (accounts created on/after that date) publishes Free (25 Active Contacts/mo), Essential, Pro (2,500), Business (7,500) and Advanced (25,000) tiers — Pro at $39/month or $29/month billed annually confirmed on ManyChat Help (Pro plan article, updated 2026-05-06); Essential ~$14/mo and Business/Advanced ~$69/$139 annual-equivalent floors shown on manychat.com/pricing (retrieved via first-party page snippets 2026-08-17; full HTML fetch timed out — medium confidence on Essential/Business/Advanced dollars). 14-day trial on Essential/Pro. Scored in the customer-messaging landscape as a marketing-automation peer to Wati/respond.io — not ranked as a phone system.",
    vendorPositioning:
      "Grow your business on autopilot — automate Instagram, Messenger and WhatsApp conversations that convert.",
    pricingModel: "subscription",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 14,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Free: 25 Active Contacts/mo (ManyChat Help Active Contacts, 2026-05-06) — high. Pro: $39 monthly / $29 annual for 2,500 Active Contacts (Pro plan help) — high. Essential ~$14/mo annual ($17 monthly), Business ~$69, Advanced ~$139 annual-equivalent from manychat.com/pricing snippets 2026-08-17 — medium (pricing HTML fetch timed out; region may vary). Legacy pre-2026-03-02 accounts may still use older contact-list Pro from $15 — note dual models. Channel/Meta fees sit on top where applicable. No invented overage math beyond published per-contact rates.",
    fixturePlans: [
      "PLAN free: name=Free; amount=0; currency=USD; interval=month; fromFloor=true; confidence=high",
      "PLAN essential: name=Essential; amount=14; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=medium",
      "PLAN pro: name=Pro; amount=29; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN business: name=Business; amount=69; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=medium",
      "PLAN advanced: name=Advanced; amount=139; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=medium",
    ],
    enrichmentPlans: [
      freePlan("free", "Free", {
        description:
          "Free forever — 25 Active Contacts per month. Suitable for testing simple automations (Active Contacts help 2026-05-06).",
      }),
      planFlatAnnual("essential", "Essential", 14, {
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "From ~$14/month billed annually (medium — manychat.com/pricing snippet). 250 Active Contacts/mo; overages ~$0.10/contact on Essential.",
      }),
      planFlatAnnual("pro", "Pro", 29, {
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "$29/month billed annually ($39 monthly) — 2,500 Active Contacts; AI automation, WhatsApp, integrations (Pro plan help — high).",
      }),
      planFlatAnnual("business", "Business", 69, {
        description:
          "From ~$69/month annual-equivalent (medium). 7,500 Active Contacts; team assignment / lead routing depth.",
      }),
      planFlatAnnual("advanced", "Advanced", 139, {
        description:
          "From ~$139/month annual-equivalent (medium). 25,000 Active Contacts; high-volume / agency packaging. Confirm live cart.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "not-supported",
      "call-routing": "not-supported",
      "call-recording": "not-supported",
      "power-dialer": "not-supported",
      "sms-messaging": "higher-plan-only",
      "whatsapp-business": "higher-plan-only",
      "shared-inbox": "supported",
      "team-messaging": "not-supported",
      "video-meetings": "not-supported",
      "crm-cti": "limited",
      "analytics-reporting": "limited",
      "ai-assistance": "higher-plan-only",
      "unified-inbox": "limited",
    },
    aiLines: [
      "AI-powered automation / FAQ replies: higher-plan-only",
      "AI conversation assist: higher-plan-only",
      "AI contact-center assistants: not-supported",
      "AI predictive routing: not-supported",
    ],
    integrations: [
      { integrationSlug: "shopify", kind: "native" },
      { integrationSlug: "hubspot", kind: "native", notes: "Pro+" },
      { integrationSlug: "zapier", kind: "zapier-style" },
      { integrationSlug: "make", kind: "zapier-style" },
      { integrationSlug: "google-workspace", kind: "native", notes: "Google Sheets sync" },
    ],
    limitations: [
      "Marketing chatbot posture — thinner support-desk / omnichannel agent ops than respond.io",
      "WhatsApp and multi-channel depth gated to Pro+ on the new model",
      "Active Contact overages and dual legacy/new pricing models confuse buyers",
      "Not a business phone system — no PSTN IVR or softphone",
      "Essential/Business/Advanced annual dollars medium confidence (pricing page fetch timeout)",
      "Inbox seat add-ons ($25/seat on Pro help) raise team TCO",
    ],
    limitationKinds: [
      "other",
      "plan-restriction",
      "other",
      "feature-unavailable",
      "other",
      "requires-add-on",
    ],
    scores: {
      "ease-of-use": 9,
      "voice-messaging-quality": 7,
      "routing-workflows": 6,
      integrations: 7,
      analytics: 6,
      "outbound-tools": 8,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Creator-friendly automation builder and Free tier make ManyChat one of the easiest messaging tools to start. Score from documented packaging, not lab testing.",
      "voice-messaging-quality":
        "Scored on Instagram/Messenger/WhatsApp marketing messaging quality — strong for growth chatbots; intentionally below omnichannel support inboxes and far below phone peers.",
      "routing-workflows":
        "Tags, rules and inbox labels cover marketing automation; Business+ deepens assignment. Trails respond.io workflow/omnichannel routing by design.",
      integrations:
        "Shopify, Sheets, Zapier/Make and Pro+ CRM connectors cover creator/ecommerce stacks — solid mid-tier, not enterprise CTI.",
      analytics:
        "Insights and Active Contact graphs cover campaign basics; trails dedicated CX analytics platforms.",
      "outbound-tools":
        "Broadcasts and growth automations are a primary strength for marketing messaging — strong outbound in-cluster without claiming dialers.",
      scalability:
        "Advanced contact tiers and API help agencies scale; dual pricing models and overages need forecasting.",
      "value-for-money":
        "Free + ~$14 Essential entry is strong for creators. Pro $29 annual is competitive versus respond.io $79. Affiliate economics excluded.",
      "ai-capabilities":
        "AI automation on Pro+ is credible for FAQ/DM flows — mid/high for marketing chatbots, below Fin/CXA-class CS AI.",
    },
    bestFor: [
      "Creators and ecommerce brands automating Instagram, Messenger and WhatsApp DMs",
      "Marketing teams that want a Free tier and low Essential entry before Pro WhatsApp",
      "Buyers comparing marketing chatbots beside Wati/respond.io support inboxes",
    ],
    notIdealFor: [
      "Enterprise support teams needing omnichannel agent ops (prefer respond.io / Intercom)",
      "Buyers who need a business phone / UCaaS seat",
      "Teams that refuse Active Contact overage economics",
    ],
    pros: [
      "Free plan with 25 Active Contacts",
      "Clear Pro $29 annual / $39 monthly floor (high confidence)",
      "Multi-channel creator automations (IG, Messenger, WhatsApp on Pro+)",
      "14-day Essential/Pro trial",
      "Approachable builder for non-technical marketers",
    ],
    cons: [
      "Thinner CS/omnichannel depth than respond.io",
      "WhatsApp gated to Pro+ on new model",
      "Dual legacy/new pricing confusion",
      "Essential/Business/Advanced dollars medium confidence",
      "Not a phone system",
    ],
    keyFeatures: [
      "Instagram, Messenger, TikTok, WhatsApp, Telegram, SMS, email channels",
      "Visual automation builder and broadcasts",
      "Shared inbox with labels/rules (Pro+)",
      "Active Contacts packaging with overage controls",
      "AI-powered automation on Pro+",
      "Shopify and Zapier/Make integrations",
    ],
    pricingSummary:
      "Free (25 Active Contacts) high confidence. Pro $29/mo annual ($39 monthly) for 2,500 Active Contacts — high (ManyChat Help Pro plan). Essential ~$14, Business ~$69, Advanced ~$139 annual-equivalent from manychat.com/pricing snippets 2026-08-17 — medium. Channel/Meta fees extra. Confirm live cart; legacy accounts may still see pre-2026-03-02 Pro from $15.",
    whoShouldChoose:
      "Choose ManyChat when you need marketing chatbot automations across Instagram/Messenger/WhatsApp with a Free path — not when you need a support-first omnichannel inbox or a business phone.",
    whoShouldConsiderAlternatives:
      "Compare respond.io for omnichannel support inboxes, Wati for WhatsApp BSP specialist packaging, and Intercom when Fin AI + shared inbox CS is the job.",
    alternativeSlugs: ["respond-io", "wati", "intercom"],
    competitorSlugs: ["respond-io", "wati", "intercom"],
    comparableSlugs: ["respond-io", "wati"],
    secondaryCategorySlugs: ["marketing"],
    subcategorySlugs: [],
    useCaseSlugs: ["customer-messaging", "whatsapp-support"],
    teamTypeSlugs: ["marketing", "sales", "customer-success"],
    businessSizeSlugs: ["solo", "small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "manychat-pro-plan",
        url: "https://help.manychat.com/hc/en-us/articles/25800228332572-Pro-plan",
        title: "ManyChat Pro plan (Help Center)",
        domains: ["pricing", "plans", "features", "limits"],
      },
      {
        id: "manychat-active-contacts",
        url: "https://help.manychat.com/hc/en-us/articles/25800323349020-Active-Contacts",
        title: "ManyChat Active Contacts",
        domains: ["pricing", "limits", "plans"],
      },
    ],
  },

  {
    slug: "intercom",
    name: "Intercom",
    company: "Intercom, Inc.",
    website: "https://www.intercom.com",
    domain: "intercom.com",
    pricingUrl: "https://www.intercom.com/pricing",
    aliases: ["Intercom Fin", "Fin AI Agent", "Intercom Messenger"],
    membershipRole: "primary",
    jobCluster: "customer-messaging",
    softShortDescription:
      "Customer messaging / shared inbox with Fin AI — Essential from $29/seat/mo + Fin from $0.99/outcome.",
    shortDescription:
      "Intercom is an AI-first customer messaging and shared-inbox platform: Messenger, tickets, help center and Fin AI Agent on Essential/Advanced/Expert seats. First-party pricing on intercom.com/pricing (checked 2026-08-17) publishes Essential $29, Advanced $85 and Expert $132 per seat/month (annual toggle), with Fin from $0.99 per resolution outcome on all plans; Copilot $29/agent/mo and Proactive Support Plus $99/mo add-ons; email/SMS/WhatsApp/Phone are pay-as-you-go channels. Free trial documented. CS-borderline — primary business-communications landscape with secondary customer-service taxonomy. Scored in customer-messaging; never ranked as a phone peer.",
    vendorPositioning:
      "The AI customer service platform — Fin AI Agent plus Intercom Messenger, inbox and help center in one place.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 29,
    startingPriceConfidence: "high",
    pricingNotes:
      "Confirmed 2026-08-17 on intercom.com/pricing: Essential $29, Advanced $85, Expert $132 per seat/month (annual billing toggle); Fin from $0.99 per outcome on all plans; Copilot $29/agent/mo; Proactive Support Plus $99/mo; Pro add-on from $99/mo. Unlimited live chat/email support channels included; campaigns, SMS, WhatsApp and Phone pay-as-you-go. High confidence on published seat + Fin floors. Do not invent channel dollar rates not shown on the hub.",
    fixturePlans: [
      "PLAN essential: name=Essential; amountPerSeat=29; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN advanced: name=Advanced; amountPerSeat=85; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN expert: name=Expert; amountPerSeat=132; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN fin: name=Fin AI Agent; amount=0.99; currency=USD; unit=outcome; fromFloor=true; confidence=high",
    ],
    enrichmentPlans: [
      planPerSeatAnnual("essential", "Essential", 29, {
        hasFreeTrial: true,
        description:
          "$29/seat/month annual — Fin AI Agent, Messenger, shared inbox/ticketing, pre-built reports, public help center. Fin outcomes from $0.99.",
      }),
      planPerSeatAnnual("advanced", "Advanced", 85, {
        highlighted: true,
        hasFreeTrial: true,
        description:
          "$85/seat/month annual — multiple team inboxes, workflows, round-robin, private/multilingual help center, 20 Lite seats.",
      }),
      planPerSeatAnnual("expert", "Expert", 132, {
        hasFreeTrial: true,
        description:
          "$132/seat/month annual — SSO, HIPAA path, SLAs, multibrand Messenger/Help Center, 50 Lite seats.",
      }),
      usagePlan("fin", "Fin AI Agent", {
        description:
          "From $0.99 per Fin outcome on Intercom plans (also Fin standalone on existing helpdesks). Usage-priced AI resolutions — not included unlimited.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "add-on",
      "call-routing": "limited",
      "call-recording": "not-supported",
      "power-dialer": "not-supported",
      "sms-messaging": "add-on",
      "whatsapp-business": "add-on",
      "shared-inbox": "supported",
      "team-messaging": "not-supported",
      "video-meetings": "not-supported",
      "crm-cti": "supported",
      "analytics-reporting": "supported",
      "ai-assistance": "supported",
      "unified-inbox": "supported",
    },
    aiLines: [
      "Fin AI Agent: supported",
      "Copilot agent assist: add-on",
      "AI Auto-translation: add-on",
      "Operator / Pro AI ops: add-on",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "zendesk", kind: "native", notes: "Fin on existing helpdesk path" },
      { integrationSlug: "shopify", kind: "native" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Seat + Fin outcome pricing stacks — TCO rises with AI resolution volume",
      "SMS, WhatsApp and Phone are pay-as-you-go add-on channels, not unlimited included",
      "CS-borderline — heavier helpdesk/ticketing than pure WhatsApp BSPs",
      "Copilot and Proactive Support Plus are separate add-ons",
      "Not a UCaaS / SMB business-phone substitute",
      "Expert security (SSO/HIPAA) requires top seat rung",
    ],
    limitationKinds: [
      "high-cost-at-scale",
      "requires-add-on",
      "other",
      "requires-add-on",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 8,
      "routing-workflows": 9,
      integrations: 9,
      analytics: 8,
      "outbound-tools": 6,
      scalability: 9,
      "value-for-money": 5,
      "ai-capabilities": 9,
    },
    scoreRationales: {
      "ease-of-use":
        "Messenger + shared inbox are polished for support teams; seat/Fin/add-on commercial complexity adds buying friction. Score from documented packaging, not lab testing.",
      "voice-messaging-quality":
        "Scored on customer messaging (live chat, Messenger, help center) — strong CS conversation quality. Phone/SMS/WhatsApp exist as paygo channels, not as the core scored surface.",
      "routing-workflows":
        "Team inboxes, workflows, round-robin and SLAs (Advanced/Expert) are a primary strength versus marketing chatbots.",
      integrations:
        "Salesforce/HubSpot/Shopify/Slack and Fin-on-helpdesk paths give broad CS integration gravity.",
      analytics:
        "Pre-built reports on Essential with deeper ops analytics on higher plans — strong mid/high CS analytics.",
      "outbound-tools":
        "Proactive Support Plus and Series campaigns cover outbound CS; not a marketing-broadcast specialist like ManyChat — mid outbound.",
      scalability:
        "Expert multibrand, SSO and Fin automation document clear mid-market to enterprise CS scale.",
      "value-for-money":
        "Published $29 Essential helps, but Fin outcomes + channel paygo + Copilot add-ons make real TCO expensive versus ManyChat/Wati. Affiliate economics excluded.",
      "ai-capabilities":
        "Fin AI Agent from $0.99/outcome is among the strongest CS AI packages in this catalogue — high AI with usage commercial caveat.",
    },
    bestFor: [
      "Support teams that want Messenger + shared inbox + Fin AI in one CS platform",
      "Mid-market SaaS organisations standardising on Intercom for in-app messaging",
      "Buyers evaluating AI agent resolutions as a primary CX bet",
    ],
    notIdealFor: [
      "SMB teams that only need a cheap marketing chatbot (prefer ManyChat)",
      "Buyers who need a business phone / UCaaS seat",
      "WhatsApp-only BSP programmes without Intercom Messenger (prefer Wati)",
    ],
    pros: [
      "Published Essential/Advanced/Expert seat floors",
      "Fin AI Agent included on all plans (usage-priced outcomes)",
      "Strong shared inbox, workflows and help center",
      "CRM and ecommerce integration catalogue",
      "Clear CS-borderline dual taxonomy (BC + customer-service)",
    ],
    cons: [
      "Seat + Fin + channel paygo inflates TCO",
      "WhatsApp/SMS/Phone not unlimited included",
      "Add-on Copilot / Proactive Support Plus",
      "Not a phone system",
      "Overkill for simple creator DM automations",
    ],
    keyFeatures: [
      "Intercom Messenger and shared inbox / ticketing",
      "Fin AI Agent (outcome-priced)",
      "Help center and workflows (Advanced+)",
      "Round-robin assignment and SLAs (Expert)",
      "Copilot and Proactive Support Plus add-ons",
      "Pay-as-you-go SMS, WhatsApp and Phone channels",
    ],
    pricingSummary:
      "Essential $29, Advanced $85, Expert $132 per seat/month (annual toggle) confirmed on intercom.com/pricing 2026-08-17; Fin from $0.99/outcome; Copilot $29/agent/mo; Proactive Support Plus $99/mo. Channel messaging pay-as-you-go. High confidence on seat + Fin floors.",
    whoShouldChoose:
      "Choose Intercom when you need an AI-first customer messaging inbox with Fin resolutions — especially for in-app Messenger CS — not when you only need a marketing chatbot or a business phone.",
    whoShouldConsiderAlternatives:
      "Compare respond.io for WhatsApp-first omnichannel support, ManyChat for marketing DM automation, Zendesk/helpdesks when ticketing is primary, and Talkdesk when the purchase is true CCaaS.",
    alternativeSlugs: ["respond-io", "manychat", "talkdesk", "wati"],
    competitorSlugs: ["respond-io", "manychat", "zendesk", "talkdesk"],
    comparableSlugs: ["respond-io", "manychat"],
    secondaryCategorySlugs: ["customer-service"],
    subcategorySlugs: [],
    useCaseSlugs: ["customer-messaging", "whatsapp-support", "contact-center"],
    teamTypeSlugs: ["customer-success", "sales", "operations"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [],
  },
];

/** Within-batch pairs only (both must be in PRODUCTS for writeComparisonSpec). */
export const COMPARISON_PAIRS = [
  ["manychat", "intercom"],
];

/**
 * Full comparison set to wire into comparisons.ts (includes existing catalogue peers).
 */
export const COMPARISON_PAIRS_FULL = [
  ["manychat", "respond-io"],
  ["manychat", "wati"],
  ["manychat", "intercom"],
  ["intercom", "respond-io"],
  ["twilio", "talkdesk"],
];
