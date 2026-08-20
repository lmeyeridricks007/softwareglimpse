/**
 * Business Communications Priority-2 non-affiliate product pack.
 * Closes Batch B remainder (OpenPhone, respond.io) + Batch C core (8x8, GoTo Connect, Grasshopper).
 *
 * Research floors cross-checked 2026-08-17 from first-party pricing pages (and
 * secondary corroboration where vendor pages are bot/quote-gated).
 * Affiliate economics never enter scores.
 *
 * Slug note: `8x8` passes SlugSchema, but we use `eightx8` (aliases: 8x8, 8x8 Work)
 * to avoid digit-leading path/CSS edge cases — same pattern as preferring kebab
 * clarity for brand-numeric names.
 */
import {
  contactSalesPlan,
  planFlatAnnual,
  planPerSeatAnnual,
} from "./bc-onboard-runtime.mjs";

export const PRODUCTS = [
  {
    slug: "openphone",
    name: "OpenPhone",
    company: "OpenPhone Technologies, Inc. (Quo)",
    website: "https://www.openphone.com",
    domain: "openphone.com",
    pricingUrl: "https://www.openphone.com/pricing",
    aliases: ["Quo", "Open Phone"],
    membershipRole: "primary",
    jobCluster: "cloud-phone",
    softShortDescription:
      "Modern SMB shared business phone (also branded Quo) with shared numbers, SMS and Sona AI — Starter from $15/user/month annual.",
    shortDescription:
      "OpenPhone (rebranded Quo in 2025; product surface unchanged) is a modern shared business phone for SMB teams: one local or toll-free number per user, unlimited US/Canada calling and SMS under fair use, shared inboxes, and Sona AI answering. Starter $15, Business $23 and Scale $35 per user/month annual ($19/$33/$47 monthly) were confirmed on openphone.com/pricing 2026-08-17. Phone menus, automatic recording and deeper CRM (HubSpot/Salesforce) land on Business+; Scale adds AI call tags and dedicated onboarding. Fair-use policy prohibits cold calling and auto-dialers — not a power-dialer product.",
    vendorPositioning:
      "The modern phone system for modern teams — shared business numbers, SMS and AI that feel like a product your team will actually use.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 7,
    startingPriceMonthly: 15,
    startingPriceConfidence: "high",
    pricingNotes:
      "Confirmed 2026-08-17 on openphone.com/pricing (Quo/OpenPhone): Starter $15, Business $23, Scale $35 per user/month annual ($19/$33/$47 monthly). Extra numbers ~$5/mo; A2P 10DLC registration fees apply for messaging. Sona AI includes free answered-call allowance then credit packs. 7-day trial. High confidence on seat floors.",
    fixturePlans: [
      "PLAN starter: name=Starter; amountPerSeat=15; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN business: name=Business; amountPerSeat=23; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN scale: name=Scale; amountPerSeat=35; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
    ],
    enrichmentPlans: [
      planPerSeatAnnual("starter", "Starter", 15, {
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "$15/user/month billed annually ($19 monthly). Shared business number, unlimited US/CA calling & SMS (fair use), voicemail transcripts, Sona AI baseline.",
      }),
      planPerSeatAnnual("business", "Business", 23, {
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "$23/user/month annual ($33 monthly). Adds phone menus, automatic recording, AI summaries/transcripts on all calls, and deeper HubSpot/Salesforce CRM.",
      }),
      planPerSeatAnnual("scale", "Scale", 35, {
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "$35/user/month annual ($47 monthly). AI call tags, dedicated onboarding and phone support for larger SMB rollouts.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "higher-plan-only",
      "call-recording": "higher-plan-only",
      "power-dialer": "not-supported",
      "sms-messaging": "supported",
      "whatsapp-business": "not-supported",
      "shared-inbox": "supported",
      "team-messaging": "limited",
      "video-meetings": "not-supported",
      "crm-cti": "higher-plan-only",
      "analytics-reporting": "supported",
      "ai-assistance": "supported",
      "unified-inbox": "limited",
    },
    aiLines: [
      "AI answering agent (Sona): supported",
      "AI call summaries: higher-plan-only",
      "AI transcripts: higher-plan-only",
      "AI call tags: higher-plan-only",
    ],
    integrations: [
      { integrationSlug: "hubspot", kind: "native", notes: "Deeper on Business+" },
      { integrationSlug: "salesforce", kind: "native", notes: "Deeper on Business+" },
      { integrationSlug: "pipedrive", kind: "native" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "US/Canada-centric calling footprint — not a global UCaaS carrier story",
      "Phone menus, automatic recording and deeper CRM require Business or above",
      "No power dialer; fair-use policy prohibits cold calling and auto-dialers",
      "No native WhatsApp Business or video meetings product",
      "Sona AI overage credits and extra numbers raise real TCO beyond seat floors",
      "Quo rebrand (2025) can confuse buyers searching for OpenPhone docs",
    ],
    limitationKinds: [
      "feature-unavailable",
      "plan-restriction",
      "feature-unavailable",
      "feature-unavailable",
      "requires-add-on",
      "other",
    ],
    scores: {
      "ease-of-use": 9,
      "voice-messaging-quality": 8,
      "routing-workflows": 7,
      integrations: 8,
      analytics: 7,
      "outbound-tools": 5,
      scalability: 6,
      "value-for-money": 8,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Modern mobile/desktop UX, shared numbers, self-serve signup and a 7-day trial make OpenPhone one of the easiest SMB phones to adopt. Score reflects documented product posture, not hands-on lab testing.",
      "voice-messaging-quality":
        "Solid shared business phone + SMS envelope for US/Canada teams. Strong messaging quality for the SMB job; not carrier-grade multi-country UCaaS breadth.",
      "routing-workflows":
        "Phone menus and group calling land on Business+; Starter is intentionally simpler. Credible SMB routing without contact-centre IVR depth.",
      integrations:
        "Native HubSpot/Salesforce/Pipedrive/Slack plus Zapier — CRM depth is Business-gated, which keeps the score below Aircall-class CTI specialists.",
      analytics:
        "Call history, AI summaries/transcripts on Business+, and Scale AI tags cover SMB reporting needs without enterprise speech analytics.",
      "outbound-tools":
        "SMS and click-to-call cover day-to-day outbound, but fair-use blocks cold calling/auto-dialers and there is no power dialer at any price — intentional product boundary.",
      scalability:
        "Excellent for small shared-line teams; Scale helps larger SMBs, but OpenPhone is not an enterprise multi-site UCaaS or contact-centre platform.",
      "value-for-money":
        "Transparent $15 Starter annual floor with no seat minimum is strong SMB value versus Aircall’s 3-licence floor. Add-ons (numbers, 10DLC, Sona credits) temper all-in TCO. Affiliate economics excluded.",
      "ai-capabilities":
        "Sona AI answering is included across plans with credit limits; Business/Scale deepen summaries, transcripts and tags — credible SMB AI packaging.",
    },
    bestFor: [
      "SMB teams that want a modern shared business number with SMS and AI answering",
      "Founders and small sales/support teams who need transparent per-seat pricing without a 3-licence floor",
      "Teams standardising on HubSpot/Salesforce once they move to Business",
    ],
    notIdealFor: [
      "High-volume cold outbound or power-dialer teams (fair-use / no dialer)",
      "Global multi-country UCaaS or contact-centre buyers",
      "Buyers who need WhatsApp Business API or native video meetings",
    ],
    pros: [
      "Modern shared-number UX with unlimited US/CA calling & SMS under fair use",
      "Transparent Starter floor at $15/user/month annual — no seat minimum",
      "Sona AI answering included with clear Business/Scale AI upgrades",
      "CRM integrations on Business+ (HubSpot, Salesforce, Pipedrive)",
      "7-day free trial and self-serve signup",
    ],
    cons: [
      "US/Canada footprint — not global UCaaS",
      "Menus, auto-recording and deeper CRM gated to Business+",
      "No power dialer; cold calling prohibited by fair use",
      "No WhatsApp Business or video meetings",
      "Extra numbers, 10DLC and Sona credits raise all-in cost",
    ],
    keyFeatures: [
      "Shared business phone numbers and softphone apps",
      "Unlimited US/Canada calling and SMS (fair use)",
      "Sona AI answering agent",
      "Phone menus and automatic recording on Business+",
      "HubSpot / Salesforce CRM on Business+",
      "AI call tags and dedicated onboarding on Scale",
    ],
    pricingSummary:
      "Starter $15, Business $23, Scale $35 per user/month annual ($19/$33/$47 monthly) confirmed on openphone.com/pricing 2026-08-17. Extra numbers ~$5/mo; A2P messaging registration and Sona credit packs extra. 7-day trial. High confidence.",
    whoShouldChoose:
      "Choose OpenPhone when you want a modern SMB shared business phone with transparent pricing, SMS and included AI answering — not a full UCaaS suite or dialer.",
    whoShouldConsiderAlternatives:
      "Compare CallHippo for cheaper SMB dialer-adjacent value, Aircall for mid-market CRM CTI depth, Nextiva for all-in-one SMB UCaaS, and Grasshopper for the simplest virtual-number entry.",
    alternativeSlugs: ["callhippo", "aircall", "nextiva", "grasshopper"],
    competitorSlugs: ["callhippo", "aircall", "nextiva", "grasshopper", "dialpad"],
    comparableSlugs: ["callhippo", "aircall", "nextiva"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: ["business-phone", "sales-calling", "team-communication"],
    teamTypeSlugs: ["sales", "customer-success", "operations"],
    businessSizeSlugs: ["solo", "small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "openphone-quo-pricing",
        url: "https://www.quo.com/pricing",
        title: "Quo (OpenPhone) Pricing",
        domains: ["pricing", "plans", "features"],
      },
    ],
  },

  {
    slug: "eightx8",
    name: "8x8",
    company: "8x8, Inc.",
    website: "https://www.8x8.com",
    domain: "8x8.com",
    pricingUrl: "https://www.8x8.com/pricing",
    aliases: ["8x8", "8x8 Work", "8x8 X Series"],
    membershipRole: "primary",
    jobCluster: "cloud-phone",
    softShortDescription:
      "Global UCaaS + contact-centre platform (8x8 Work / X Series) — Work X2 research floor ~$24/user/month annual; CC tiers custom/higher.",
    shortDescription:
      "8x8 is a global unified-communications and contact-centre vendor: 8x8 Work (X Series) covers cloud phone, video meetings, team messaging and analytics, with Contact Center (X6–X8) as a separate ladder. First-party pricing pages are often bot/quote gated; research floors cross-checked 2026-08-17 put Work X2 around $24 and X4 around $44 per user/month annual, with Express ~$15 and Contact Center ~$85–$140 commonly cited. Mandatory regulatory/service fees are frequently reported on top of list seats. Scored as a RingCentral-class global UCaaS peer, not as a thin SMB virtual number.",
    vendorPositioning:
      "One platform for voice, video, chat and contact centre — global communications for mid-market and enterprise teams.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 30,
    startingPriceMonthly: 24,
    startingPriceConfidence: "medium",
    pricingNotes:
      "8x8.com/pricing is frequently bot/quote gated (verified 2026-08-17). Medium-confidence research floors from corroborated industry sources: Express ~$15, Work X2 ~$24, Work X4 ~$44 per user/month annual; Contact Center X6–X8 ~$85–$140; enterprise/CPaaS custom. Mandatory per-user fees (~$4–$6) often apply on top of list seats. Confirm live quote before publishing dollar claims.",
    fixturePlans: [
      "PLAN express: name=Express; amountPerSeat=15; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=medium",
      "PLAN x2: name=Work X2; amountPerSeat=24; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=medium",
      "PLAN x4: name=Work X4; amountPerSeat=44; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=medium",
      "PLAN contact-center: name=Contact Center; contactSales=true; note=X6-X8-ladder; fromFloor=true",
    ],
    enrichmentPlans: [
      planPerSeatAnnual("express", "Express", 15, {
        hasFreeTrial: true,
        trialDays: 30,
        description:
          "From ~$15/user/month annual (medium confidence) — lighter VoIP entry before full Work X2 packaging.",
      }),
      planPerSeatAnnual("x2", "Work X2", 24, {
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 30,
        description:
          "From ~$24/user/month annual (medium confidence). Core 8x8 Work UCaaS — cloud phone, video, team chat, multi-country calling envelope.",
      }),
      planPerSeatAnnual("x4", "Work X4", 44, {
        hasFreeTrial: true,
        trialDays: 30,
        description:
          "From ~$44/user/month annual (medium confidence). Advanced analytics, quality management and speech analytics versus X2.",
      }),
      contactSalesPlan("contact-center", "Contact Center (X6–X8)", {
        description:
          "Separate contact-centre ladder commonly cited ~$85–$140/user/month — quote-based; not used as the Work X2 scored floor.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "supported",
      "call-recording": "supported",
      "power-dialer": "limited",
      "sms-messaging": "supported",
      "whatsapp-business": "limited",
      "shared-inbox": "limited",
      "team-messaging": "supported",
      "video-meetings": "supported",
      "crm-cti": "supported",
      "analytics-reporting": "supported",
      "ai-assistance": "supported",
      "unified-inbox": "limited",
    },
    aiLines: [
      "AI transcription: supported",
      "AI speech analytics: higher-plan-only",
      "AI quality management: higher-plan-only",
      "AI contact-center assistants: higher-plan-only",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "zendesk", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Published seat floors are medium confidence — first-party pricing often bot/quote gated",
      "Mandatory regulatory/service fees frequently sit on top of list seats",
      "Contact-centre depth requires X6–X8 ladder, not Work X2 alone",
      "Power dialer is limited versus sales-dialer specialists",
      "WhatsApp and shared/unified inbox depth trail messaging-first platforms",
      "SMB buyers may find packaging and TCO opacity heavier than OpenPhone/CallHippo",
    ],
    limitationKinds: [
      "other",
      "high-cost-at-scale",
      "plan-restriction",
      "feature-unavailable",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 7,
      "voice-messaging-quality": 10,
      "routing-workflows": 10,
      integrations: 9,
      analytics: 9,
      "outbound-tools": 7,
      scalability: 10,
      "value-for-money": 6,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Full UCaaS + CC packaging is powerful but heavier than SMB phones — admin, number porting and plan selection need IT involvement. Score reflects documented enterprise surface, not hands-on testing.",
      "voice-messaging-quality":
        "Carrier-grade global voice with video meetings and team messaging puts 8x8 in the same top voice/UCaaS tier as RingCentral. Score grounded in product breadth, not a lab audio test.",
      "routing-workflows":
        "IVR, queues and Contact Center ladders deliver top-tier routing for mid-market and enterprise buyers — a core reason 8x8 sits near RingCentral on shortlists.",
      integrations:
        "Broad CRM/helpdesk and collaboration connectors (Salesforce, HubSpot, Zendesk, Teams, Slack, Google Workspace). Near RingCentral-class integration gravity.",
      analytics:
        "X4 speech analytics and quality management plus contact-centre reporting are first-party strengths. Strong analytics envelope for UCaaS/CC buyers.",
      "outbound-tools":
        "SMS, click-to-dial and limited dialer options cover structured outbound; not primarily a high-volume parallel dialer product.",
      scalability:
        "Work X4 plus Contact Center X6–X8 and enterprise/CPaaS document a clear path from mid-market seats to global contact centre — among the strongest scale stories in BC.",
      "value-for-money":
        "X2 ~$24 annual looks competitive on paper versus RingCentral Core ~$20, but medium-confidence floors, mandatory fees and CC upsells raise TCO opacity. Capability justifies premium for global UCaaS buyers. Affiliate economics excluded.",
      "ai-capabilities":
        "Speech analytics, quality management and CC AI assistants are credible, with deeper packages on higher X-series rungs rather than only thin add-ons.",
    },
    bestFor: [
      "Mid-market and enterprise teams needing global UCaaS with a contact-centre path",
      "Organisations shortlisting RingCentral-class peers for multi-country voice + meetings + chat",
      "Buyers who want analytics/quality management inside the communications platform",
    ],
    notIdealFor: [
      "Micro teams that need the simplest transparent SMB shared phone",
      "Buyers who refuse quote-gated or fee-layered commercial structures",
      "Teams whose primary job is WhatsApp customer messaging alone",
    ],
    pros: [
      "Global UCaaS envelope — phone, video, team chat, analytics",
      "Clear contact-centre expansion path (X6–X8)",
      "Strong CRM and collaboration integrations",
      "Multi-country calling positioning versus US-only SMB phones",
      "Speech analytics / quality management on higher Work tiers",
    ],
    cons: [
      "Seat floors medium confidence — pricing often quote/bot gated",
      "Mandatory fees inflate real seat cost beyond list floors",
      "Contact-centre depth is a separate expensive ladder",
      "Heavier than modern SMB phones like OpenPhone",
      "WhatsApp/shared inbox trail messaging specialists",
    ],
    keyFeatures: [
      "8x8 Work cloud phone, video and team messaging",
      "Multi-country calling packages by X-series tier",
      "IVR, queues and advanced call routing",
      "CRM/CTI connectors (Salesforce, HubSpot, Zendesk)",
      "Analytics, speech analytics and quality management on X4+",
      "Contact Center (X6–X8) ladder",
    ],
    pricingSummary:
      "Work X2 ~$24 and X4 ~$44 per user/month annual research floors (Express ~$15); Contact Center X6–X8 commonly ~$85–$140; enterprise custom. Medium confidence — 8x8.com/pricing often bot/quote gated (2026-08-17). Mandatory fees often apply. Confirm live quote.",
    whoShouldChoose:
      "Choose 8x8 when you need RingCentral-class global UCaaS with a serious contact-centre path and can accept quote-gated commercial complexity.",
    whoShouldConsiderAlternatives:
      "Compare RingCentral for the closest all-in-one UCaaS peer, Dialpad for included AI on Connect, Zoom if meetings-first, and Aircall when mid-market CRM CTI without full UCaaS is enough.",
    alternativeSlugs: ["ringcentral", "dialpad", "zoom", "aircall", "nextiva"],
    competitorSlugs: ["ringcentral", "dialpad", "zoom", "aircall", "goto-connect"],
    comparableSlugs: ["ringcentral", "dialpad", "zoom", "aircall"],
    secondaryCategorySlugs: ["customer-service"],
    subcategorySlugs: [],
    useCaseSlugs: ["business-phone", "sales-calling", "contact-center", "team-communication"],
    teamTypeSlugs: ["sales", "customer-success", "operations"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "eightx8-work",
        url: "https://www.8x8.com/products/work",
        title: "8x8 Work",
        domains: ["features", "product-positioning"],
      },
    ],
  },

  {
    slug: "goto-connect",
    name: "GoTo Connect",
    company: "GoTo Group, Inc.",
    website: "https://www.goto.com/connect",
    domain: "goto.com",
    pricingUrl: "https://www.goto.com/connect/pricing",
    aliases: ["GoTo", "GoToConnect", "Jive"],
    membershipRole: "primary",
    jobCluster: "cloud-phone",
    softShortDescription:
      "Remote-team UCaaS phone system with meetings and messaging — Phone System / CX / Contact Center ladders are custom-quote (no public seat dollars).",
    shortDescription:
      "GoTo Connect is a cloud business phone / UCaaS platform (evolved from Jive) aimed at remote and multi-location teams: softphones, unlimited auto attendants and queues, video meetings (up to 250), team messaging, SMS, and optional CX / Contact Center ladders with shared inbox and digital channels. First-party pricing (goto.com/connect/pricing, checked 2026-08-17) routes every plan to sales — no published per-seat dollars. Industry corroboration commonly cites Phone System ~$26–$29, CX ~$32–$34 and Contact Center ~$80 per user/month, but those are medium/low confidence research ranges, not vendor list prices. AI Receptionist is an add-on across Phone System tiers.",
    vendorPositioning:
      "All-in-one voice and video software for modern workplaces — cloud phone, meetings and messaging with a path into customer experience.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 26,
    startingPriceConfidence: "low",
    pricingNotes:
      "Confirmed 2026-08-17: goto.com/connect/pricing publishes Phone System, Customer Experience (CX), CX Complete and Contact Center feature matrices but requires talking to sales for dollars — no self-serve seat prices. Research ranges from industry sources (~$26 Phone System / ~$34 CX / ~$80 Contact Center) are low-to-medium confidence only. AI Receptionist add-on. Do not invent precise dollars; quote custom packaging as primary commercial fact.",
    fixturePlans: [
      "PLAN phone-system: name=Phone System; contactSales=true; researchRange=~26/user/mo; confidence=low",
      "PLAN cx: name=Customer Experience; contactSales=true; researchRange=~34/user/mo; confidence=low",
      "PLAN cx-complete: name=CX Complete; contactSales=true",
      "PLAN contact-center: name=Contact Center; contactSales=true; researchRange=~80/user/mo; confidence=low",
    ],
    enrichmentPlans: [
      contactSalesPlan("phone-system", "Phone System", {
        hasFreeTrial: true,
        description:
          "Core cloud phone + meetings + messaging. Public page is quote-only (2026-08-17). Industry research sometimes cites ~$26–$29/user/month — low confidence; confirm with sales.",
      }),
      contactSalesPlan("cx", "Customer Experience (CX)", {
        highlighted: true,
        description:
          "Adds shared inbox, web chat, WhatsApp/social channels, surveys and richer reporting. Quote-based.",
      }),
      contactSalesPlan("cx-complete", "CX Complete", {
        description:
          "Phone + AI-powered CX packaging for growing businesses — contact sales.",
      }),
      contactSalesPlan("contact-center", "Contact Center", {
        description:
          "Agent softphone, skill routing, monitoring, auto-dialer and supervisor tooling — separate quote ladder.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "supported",
      "call-recording": "supported",
      "power-dialer": "higher-plan-only",
      "sms-messaging": "supported",
      "whatsapp-business": "higher-plan-only",
      "shared-inbox": "higher-plan-only",
      "team-messaging": "supported",
      "video-meetings": "supported",
      "crm-cti": "supported",
      "analytics-reporting": "supported",
      "ai-assistance": "add-on",
      "unified-inbox": "higher-plan-only",
    },
    aiLines: [
      "AI meeting summary: supported",
      "AI call summaries: add-on",
      "AI receptionist: add-on",
      "AI chat analysis: higher-plan-only",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "zendesk", kind: "native" },
      { integrationSlug: "servicenow", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "No published self-serve seat dollars — every plan is sales-quoted",
      "Industry dollar ranges are low confidence and must not be treated as list prices",
      "AI Receptionist and some AI analytics are add-ons",
      "WhatsApp, shared inbox and unified inbox depth require CX / Contact Center ladders",
      "Auto-dialer and full agent tooling sit on Contact Center, not Phone System",
      "Renewal and add-on opacity is a recurring buyer complaint in secondary sources",
    ],
    limitationKinds: [
      "other",
      "other",
      "requires-add-on",
      "plan-restriction",
      "plan-restriction",
      "other",
    ],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 8,
      "routing-workflows": 8,
      integrations: 8,
      analytics: 7,
      "outbound-tools": 6,
      scalability: 8,
      "value-for-money": 5,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Desktop/mobile apps, unified admin and remote-team packaging are approachable for distributed orgs; sales-quoted buying adds friction versus self-serve SMB phones.",
      "voice-messaging-quality":
        "Solid cloud phone with SMS, team messaging and video meetings (250 participants). Credible mid-tier UCaaS voice/messaging envelope.",
      "routing-workflows":
        "Unlimited auto attendants, queues and dial plans on Phone System; Contact Center adds skills, priority and campaign routing. Strong mid-tier routing without claiming RingCentral/8x8 top tier.",
      integrations:
        "Salesforce, Microsoft, Zendesk, ServiceNow and Google Workspace connectors cover common stacks. Solid but not the broadest enterprise catalogue.",
      analytics:
        "Call reports and dashboards on Phone System; AI summaries/transcripts and CX analytics deepen on higher ladders or add-ons.",
      "outbound-tools":
        "SMS and standard outbound calling on Phone System; auto-dialer and campaigns require Contact Center — mid-pack outbound.",
      scalability:
        "Multi-site admin, CX and Contact Center ladders support growth from remote teams to agent operations — clearer than Grasshopper, thinner than RingCentral/8x8 enterprise stories.",
      "value-for-money":
        "Quote-only pricing and opaque renewal dynamics are the explicit trade-off. Capability can be competitive, but accessibility and price clarity score poorly versus published-floor peers. Affiliate economics excluded.",
      "ai-capabilities":
        "AI meeting summaries are included; AI Receptionist and richer call/chat AI are add-ons or higher-ladder — credible but paid packaging.",
    },
    bestFor: [
      "Remote and multi-location teams wanting phone + meetings + messaging from one vendor",
      "Buyers who may grow into CX digital channels or Contact Center later",
      "Organisations already familiar with GoTo / former Jive deployments",
    ],
    notIdealFor: [
      "Buyers who require transparent self-serve published seat prices",
      "Micro teams that only need a simple virtual number (prefer Grasshopper/OpenPhone)",
      "Enterprises comparing primarily on global UCaaS depth (prefer RingCentral/8x8)",
    ],
    pros: [
      "Phone + video meetings + team messaging in one remote-team UCaaS",
      "Unlimited auto attendants, queues and dial plans on Phone System",
      "Clear CX and Contact Center expansion path",
      "CRM/helpdesk integrations (Salesforce, Zendesk, ServiceNow)",
      "International calling to 50+ countries called out first-party",
    ],
    cons: [
      "No published seat dollars — sales quote required",
      "AI Receptionist and some analytics are add-ons",
      "WhatsApp/shared inbox gated to CX ladders",
      "Auto-dialer only on Contact Center",
      "Value score hurt by pricing opacity",
    ],
    keyFeatures: [
      "Cloud phone system with softphones and number porting",
      "Unlimited auto attendants, ring groups and call queues",
      "Video meetings up to 250 participants",
      "Team messaging and SMS/MMS",
      "CX shared inbox and digital channels on higher ladders",
      "Contact Center agent tooling and auto-dialer",
    ],
    pricingSummary:
      "Phone System, CX, CX Complete and Contact Center are custom-quote only on goto.com/connect/pricing (confirmed 2026-08-17). Industry research sometimes cites ~$26 / ~$34 / ~$80 per user/month ranges — low confidence. AI Receptionist add-on. Confirm live quote; do not treat research ranges as list prices.",
    whoShouldChoose:
      "Choose GoTo Connect when you want remote-team UCaaS (phone + meetings + messaging) with a path into CX/contact centre and can work through a sales quote.",
    whoShouldConsiderAlternatives:
      "Compare RingCentral or 8x8 for deeper global/enterprise UCaaS, Nextiva for clearer SMB published floors, OpenPhone for modern self-serve SMB phone, and Dialpad when included AI calling is decisive.",
    alternativeSlugs: ["ringcentral", "eightx8", "nextiva", "openphone", "dialpad"],
    competitorSlugs: ["ringcentral", "eightx8", "nextiva", "zoom", "aircall"],
    comparableSlugs: ["ringcentral", "eightx8", "nextiva", "zoom"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: ["business-phone", "team-communication", "contact-center"],
    teamTypeSlugs: ["operations", "customer-success", "sales"],
    businessSizeSlugs: ["small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "goto-connect-product",
        url: "https://www.goto.com/connect",
        title: "GoTo Connect",
        domains: ["features", "product-positioning"],
      },
    ],
  },

  {
    slug: "grasshopper",
    name: "Grasshopper",
    company: "Grasshopper (GoTo Group)",
    website: "https://grasshopper.com",
    domain: "grasshopper.com",
    pricingUrl: "https://grasshopper.com/pricing/",
    aliases: ["Grasshopper Phone"],
    membershipRole: "primary",
    jobCluster: "cloud-phone",
    softShortDescription:
      "SMB virtual business numbers with extensions and apps — True Solo from $14/month annual (flat account, not per seat).",
    shortDescription:
      "Grasshopper is a long-standing SMB virtual phone system for US/Canada: pick a local or toll-free number, route to extensions, and take calls on mobile/desktop apps. Plans are flat account pricing — True Solo $14, Solo Plus $25, Small Business $55 per month annual ($18/$32/$70 monthly) are widely corroborated for 2026; the live pricing page is interactive and did not expose dollars cleanly to automated fetch on 2026-08-17 (medium confidence). True Solo is one user/one extension; Solo Plus unlocks unlimited users with three extensions, recording and IVR; Small Business adds four numbers and unlimited extensions. This is a virtual-number / simple shared-line product — not full mid-market UCaaS.",
    vendorPositioning:
      "The entrepreneur’s phone system — a professional business number that works on the phones you already have.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 7,
    startingPriceMonthly: 14,
    startingPriceConfidence: "medium",
    pricingNotes:
      "grasshopper.com/pricing confirms plans + 7-day trial (2026-08-17) but plan dollars render interactively. Medium-confidence floors from corroborating 2026 sources: True Solo $14, Solo Plus $25, Small Business $55 per month annual ($18/$32/$70 monthly). Flat account pricing (not per-seat). Extra numbers ~$9/mo; extensions ~$3/mo on Solo Plus; A2P messaging fees apply. Some sources cite Small Business higher ($80) — treat $55 as the commonly listed annual floor and confirm live.",
    fixturePlans: [
      "PLAN true-solo: name=True Solo; amount=14; currency=USD; interval=year; amountPeriod=month; flat=true; fromFloor=true; confidence=medium",
      "PLAN solo-plus: name=Solo Plus; amount=25; currency=USD; interval=year; amountPeriod=month; flat=true; fromFloor=true; confidence=medium",
      "PLAN small-business: name=Small Business; amount=55; currency=USD; interval=year; amountPeriod=month; flat=true; fromFloor=true; confidence=medium",
    ],
    enrichmentPlans: [
      planFlatAnnual("true-solo", "True Solo", 14, {
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "From ~$14/month annual (medium confidence). 1 user, 1 number, 1 extension — simplest virtual business line.",
        limits: { maximumSeats: 1 },
      }),
      planFlatAnnual("solo-plus", "Solo Plus", 25, {
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "From ~$25/month annual. Unlimited users, 1 number, 3 extensions; unlocks recording, simultaneous ringing and IVR menus.",
      }),
      planFlatAnnual("small-business", "Small Business", 55, {
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "From ~$55/month annual (some sources cite higher — confirm live). 4 numbers, unlimited extensions.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "higher-plan-only",
      "call-recording": "higher-plan-only",
      "power-dialer": "not-supported",
      "sms-messaging": "supported",
      "whatsapp-business": "not-supported",
      "shared-inbox": "not-supported",
      "team-messaging": "not-supported",
      "video-meetings": "not-supported",
      "crm-cti": "limited",
      "analytics-reporting": "limited",
      "ai-assistance": "limited",
      "unified-inbox": "not-supported",
    },
    aiLines: [
      "AI voicemail sentiment: limited",
      "AI call summaries: higher-plan-only",
      "AI receptionist: add-on",
    ],
    integrations: [
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Virtual-number / simple phone product — not full UCaaS (no native team chat or video meetings suite)",
      "IVR, recording and simultaneous ringing require Solo Plus or above",
      "True Solo is capped at one user and one extension",
      "US/Canada focus; limited CRM/CTI versus Aircall-class phones",
      "No power dialer or WhatsApp Business API",
      "Published plan dollars medium confidence — interactive pricing page",
    ],
    limitationKinds: [
      "feature-unavailable",
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 9,
      "voice-messaging-quality": 7,
      "routing-workflows": 6,
      integrations: 5,
      analytics: 5,
      "outbound-tools": 4,
      scalability: 5,
      "value-for-money": 8,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Classic entrepreneur phone: pick a number, install the app, forward to existing phones. 7-day trial and flat plans keep adoption simple. Score reflects documented simplicity, not lab testing.",
      "voice-messaging-quality":
        "Credible virtual business line with SMS and voicemail transcription for US/Canada. Not carrier-grade multi-product UCaaS quality.",
      "routing-workflows":
        "Extensions, greetings and Solo Plus IVR cover basic SMB routing — intentionally thinner than CallHippo/Aircall queues.",
      integrations:
        "Zapier-style automation and limited CRM depth versus CTI specialists. Integrations are not Grasshopper’s selling point.",
      analytics:
        "Basic call history and limited AI sentiment/summaries — adequate for solo/SMB, weak for supervisors.",
      "outbound-tools":
        "SMS and standard outbound calling only. No dialer — scored accordingly.",
      scalability:
        "Solo Plus unlimited users help small teams share one number, but four-number Small Business ceiling and thin UCaaS surface cap scale versus true cloud PBX peers.",
      "value-for-money":
        "Flat $14 True Solo annual floor is among the cheapest ways to get a professional business number. Capability ceiling is the trade-off. Affiliate economics excluded.",
      "ai-capabilities":
        "Voicemail sentiment and limited summaries appear on higher rungs; Virtual Receptionist is an add-on — light AI packaging.",
    },
    bestFor: [
      "Solo operators and tiny teams that primarily need a professional virtual number",
      "SMBs that want flat account pricing instead of per-seat UCaaS maths",
      "Buyers replacing a personal mobile with a branded business line",
    ],
    notIdealFor: [
      "Teams needing full UCaaS (meetings + team chat + deep IVR + CTI)",
      "Sales orgs that need a power dialer or CRM-first phone",
      "Multi-country or contact-centre deployments",
    ],
    pros: [
      "Very low flat entry — True Solo ~$14/month annual",
      "Simple virtual number + extensions model entrepreneurs understand",
      "7-day free trial, no credit card required (vendor claim)",
      "Solo Plus unlocks unlimited users on one number",
      "SMS and voicemail transcription available",
    ],
    cons: [
      "Thin UCaaS — no native team chat or video meetings suite",
      "IVR/recording gated to Solo Plus+",
      "Weak CRM/CTI versus modern SMB phones",
      "No power dialer or WhatsApp Business",
      "Plan dollars medium confidence on interactive pricing page",
    ],
    keyFeatures: [
      "Local and toll-free virtual business numbers",
      "Extensions and call forwarding to existing phones",
      "Mobile and desktop apps",
      "SMS / texting (with A2P fees)",
      "IVR menus and call recording on Solo Plus+",
      "Flat account plans (True Solo / Solo Plus / Small Business)",
    ],
    pricingSummary:
      "True Solo ~$14, Solo Plus ~$25, Small Business ~$55 per month annual ($18/$32/$70 monthly) — medium confidence from 2026 corroboration; interactive grasshopper.com/pricing (2026-08-17). Flat account pricing. Extra numbers ~$9/mo. 7-day trial. Confirm live.",
    whoShouldChoose:
      "Choose Grasshopper when you mainly need an affordable professional virtual number with simple extensions — not a full cloud phone / UCaaS suite.",
    whoShouldConsiderAlternatives:
      "Compare OpenPhone for a modern shared SMB phone with AI, CallHippo for SMB calling + dialer-adjacent features, and Nextiva when you need all-in-one business communications.",
    alternativeSlugs: ["openphone", "callhippo", "nextiva", "krispcall"],
    competitorSlugs: ["openphone", "callhippo", "nextiva", "krispcall"],
    comparableSlugs: ["openphone", "callhippo", "krispcall"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: ["business-phone"],
    teamTypeSlugs: ["operations", "sales"],
    businessSizeSlugs: ["solo", "small-business"],
    officialVideos: [],
    sourcesExtra: [],
  },

  {
    slug: "respond-io",
    name: "respond.io",
    company: "respond.io",
    website: "https://respond.io",
    domain: "respond.io",
    pricingUrl: "https://respond.io/pricing/",
    aliases: ["respondio", "Respond.io"],
    membershipRole: "primary",
    jobCluster: "customer-messaging",
    softShortDescription:
      "Omnichannel customer messaging platform (WhatsApp + other channels) with shared inbox and AI — Starter from $79/month annual-equivalent.",
    shortDescription:
      "respond.io is an omnichannel customer messaging platform: WhatsApp Business API plus other messaging channels in a shared team inbox, with workflows, broadcasts, AI Assist/Agents and contact-based packaging. Confirmed on respond.io/pricing 2026-08-17: Starter $79, Growth $159, Advanced $279 per month on the yearly toggle ($948 / $1,908 / $3,348 billed yearly), with Enterprise custom. Pricing scales with monthly active contacts (MAC) tiers. 7-day free trial, no credit card. Scored in the customer-messaging cluster as a Wati peer — not ranked against phone systems.",
    vendorPositioning:
      "The AI-powered customer conversation platform — manage WhatsApp and every channel in one omnichannel inbox.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 7,
    startingPriceMonthly: 79,
    startingPriceConfidence: "high",
    pricingNotes:
      "Confirmed 2026-08-17 on respond.io/pricing: Starter $79, Growth $159, Advanced $279 per month (yearly billing shown as $948/$1,908/$3,348 per year). Enterprise contact sales. Contact-based (monthly active contacts) packaging — channel/Meta message fees sit on top where applicable. 7-day trial. High confidence on platform floors.",
    fixturePlans: [
      "PLAN starter: name=Starter; amount=79; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN growth: name=Growth; amount=159; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN advanced: name=Advanced; amount=279; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN enterprise: name=Enterprise; contactSales=true",
    ],
    enrichmentPlans: [
      planFlatAnnual("starter", "Starter", 79, {
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "$79/month on yearly billing ($948/yr). Team & custom inboxes, AI Prompt/Assist, basic reports — omnichannel messaging entry.",
      }),
      planFlatAnnual("growth", "Growth", 159, {
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "$159/month yearly ($1,908/yr). Broadcasts, workflow automation, AI Agents, advanced reports, Zapier/Make and developer API.",
      }),
      planFlatAnnual("advanced", "Advanced", 279, {
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "$279/month yearly ($3,348/yr). Multiple workspaces, SSO, webhooks, custom channels and advanced security.",
      }),
      contactSalesPlan("enterprise", "Enterprise", {
        description:
          "Custom packaging — unlimited users, higher workspace/API limits. Contact sales.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "not-supported",
      "call-routing": "not-supported",
      "call-recording": "not-supported",
      "power-dialer": "not-supported",
      "sms-messaging": "supported",
      "whatsapp-business": "supported",
      "shared-inbox": "supported",
      "team-messaging": "not-supported",
      "video-meetings": "not-supported",
      "crm-cti": "limited",
      "analytics-reporting": "supported",
      "ai-assistance": "supported",
      "unified-inbox": "supported",
    },
    aiLines: [
      "AI Assist: supported",
      "AI Prompt: supported",
      "AI Agents: higher-plan-only",
      "AI chat analysis: supported",
    ],
    integrations: [
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "zendesk", kind: "native" },
      { integrationSlug: "shopify", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
      { integrationSlug: "make", kind: "zapier-style" },
    ],
    limitations: [
      "Not a business phone system — no IVR, queues or PSTN calling product",
      "Platform subscription plus channel/Meta messaging fees create two-layer TCO",
      "Contact-based (MAC) packaging can surprise teams with bursty conversation volume",
      "AI Agents and advanced automation sit on Growth+",
      "Advanced/Enterprise needed for SSO, multiple workspaces and custom channels",
      "Higher platform floor ($79) than some WhatsApp-only BSP entry rungs",
    ],
    limitationKinds: [
      "feature-unavailable",
      "high-cost-at-scale",
      "other",
      "plan-restriction",
      "plan-restriction",
      "high-cost-at-scale",
    ],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 8,
      "routing-workflows": 9,
      integrations: 9,
      analytics: 8,
      "outbound-tools": 8,
      scalability: 8,
      "value-for-money": 6,
      "ai-capabilities": 9,
    },
    scoreRationales: {
      "ease-of-use":
        "Shared-inbox metaphor, mobile app and 7-day trial make omnichannel messaging approachable. Contact-tier selection adds buying complexity versus simple WhatsApp-only tools.",
      "voice-messaging-quality":
        "Scored on the messaging channels respond.io sells (WhatsApp + omnichannel inbox), not PSTN voice. Strong messaging quality for customer conversations; methodology does not penalise missing phone IVR.",
      "routing-workflows":
        "Team/custom inboxes, workflows automation (Growth+), assignment and omnichannel routing are a primary strength versus single-channel BSPs.",
      integrations:
        "Native CRM/ecommerce connectors plus Zapier/Make and a developer API on Growth+ give broad automation gravity in the messaging cluster.",
      analytics:
        "Basic → advanced reports across plans; conversation analytics support campaign and inbox performance review.",
      "outbound-tools":
        "Broadcasts and workflow-driven outbound on Growth+ cover marketing/support campaigns — strong messaging outbound without claiming dialer capability.",
      scalability:
        "Advanced/Enterprise workspaces, API limits and contact tiers scale multi-brand messaging ops better than seat-capped WhatsApp tools, though MAC billing needs forecasting.",
      "value-for-money":
        "Transparent $79 Starter floor is high versus some WhatsApp BSP entries, and channel fees stack on top. Omnichannel + AI depth can justify spend for teams already living in messaging. Affiliate economics excluded.",
      "ai-capabilities":
        "AI Assist/Prompt on Starter plus AI Agents on Growth+ is among the stronger messaging-cluster AI packages in this catalogue.",
    },
    bestFor: [
      "Support and growth teams that need WhatsApp plus other messaging channels in one inbox",
      "Organisations running broadcasts and workflow automation across channels",
      "Buyers who want AI Agents inside an omnichannel messaging platform",
    ],
    notIdealFor: [
      "Buyers who need a business phone system with IVR and PSTN calling",
      "Teams that only need the cheapest WhatsApp-only BSP rung",
      "Internal team chat buyers (Slack/Teams/Zenzap)",
    ],
    pros: [
      "True omnichannel inbox spanning WhatsApp and other channels",
      "Workflows, broadcasts and AI Agents on Growth+",
      "Transparent published floors ($79/$159/$279) with yearly billing",
      "CRM/ecommerce integrations and developer API path",
      "7-day free trial without credit card",
    ],
    cons: [
      "Not a phone system — pair with VoIP if you need calling",
      "Higher platform floor than some WhatsApp-only peers",
      "MAC + channel fees complicate TCO forecasting",
      "Advanced security/workspaces require Advanced+",
      "AI Agents gated behind Growth",
    ],
    keyFeatures: [
      "WhatsApp Business API and omnichannel shared inbox",
      "Team and custom inboxes",
      "Broadcasts and workflow automation (Growth+)",
      "AI Assist / Prompt and AI Agents",
      "Advanced reports and developer API",
      "CRM and ecommerce connectors",
    ],
    pricingSummary:
      "Starter $79, Growth $159, Advanced $279 per month on yearly billing ($948 / $1,908 / $3,348 per year) confirmed on respond.io/pricing 2026-08-17. Enterprise custom. Contact-based (MAC) packaging; channel/Meta fees extra. 7-day trial. High confidence.",
    whoShouldChoose:
      "Choose respond.io when you need an omnichannel WhatsApp-capable shared inbox with workflows and AI — not a business phone system.",
    whoShouldConsiderAlternatives:
      "Compare Wati for WhatsApp-specialist BSP packaging, Aircall/CallHippo when the real job is cloud phone, and a helpdesk when ticketing is primary over messaging conversion.",
    alternativeSlugs: ["wati", "aircall", "callhippo"],
    competitorSlugs: ["wati"],
    comparableSlugs: ["wati"],
    secondaryCategorySlugs: ["customer-service"],
    subcategorySlugs: [],
    useCaseSlugs: ["customer-messaging", "whatsapp-support"],
    teamTypeSlugs: ["customer-success", "sales", "marketing"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "respond-io-product",
        url: "https://respond.io/product/",
        title: "respond.io Product",
        domains: ["features", "product-positioning", "ai-capabilities"],
      },
    ],
  },
];

/** Within-batch pairs only (both must be in PRODUCTS for writeComparisonSpec). */
export const COMPARISON_PAIRS = [
  ["openphone", "grasshopper"],
];

/**
 * Full comparison set to wire into comparisons.ts (includes existing catalogue peers).
 * Canonical slug order is handled by approvedBcPair / canonicalizeComparisonSlug.
 */
export const COMPARISON_PAIRS_FULL = [
  ["openphone", "aircall"],
  ["openphone", "callhippo"],
  ["openphone", "nextiva"],
  ["eightx8", "ringcentral"],
  ["goto-connect", "ringcentral"],
  ["grasshopper", "callhippo"],
  ["respond-io", "wati"],
];
