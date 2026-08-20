/**
 * Business Communications Priority-3 product pack.
 * Phone/UCaaS mid-tier: Webex, Vonage, Ooma.
 * CCaaS landscape only (not phone peers): Talkdesk, Genesys, Five9.
 *
 * Research floors cross-checked 2026-08-17 from first-party pricing pages
 * (and secondary corroboration where vendor pages are dynamic/quote-gated).
 * Affiliate economics never enter scores.
 */
import {
  contactSalesPlan,
  freePlan,
  planPerSeatAnnual,
  planPerSeatMonthly,
} from "./bc-onboard-runtime.mjs";

export const PRODUCTS = [
  {
    slug: "webex",
    name: "Cisco Webex",
    company: "Cisco Systems, Inc.",
    website: "https://www.webex.com",
    domain: "webex.com",
    pricingUrl: "https://www.webex.com/pricing/index.html",
    aliases: ["Cisco Webex", "Webex by Cisco", "Webex"],
    membershipRole: "primary",
    jobCluster: "cloud-phone",
    softShortDescription:
      "Enterprise UC suite (meetings, messaging, Webex Calling) — Meet/Suite published floors; Calling and Contact Center often quote-layered.",
    shortDescription:
      "Cisco Webex is an enterprise unified-communications platform spanning meetings, team messaging, whiteboarding, Webex Calling cloud phone, and a separate Webex Contact Center line. A free meetings tier remains published; paid Meet and Suite seats are commonly cited around $12–$14.50 and ~$22.50–$27 per user/month respectively (medium confidence — webex.com/pricing renders dynamically by region/SKU). Enterprise agreements, Calling Professional add-ons, AI Assistant, devices and Contact Center are frequently quote-negotiated inside Cisco EA packaging. Scored as an enterprise UC / Webex Calling peer — not as a thin SMB virtual number and not as a pure CCaaS rank peer to Talkdesk/Genesys/Five9.",
    vendorPositioning:
      "Industry-leading hybrid work and customer experience — meetings, calling, messaging and devices on one Cisco Webex platform.",
    pricingModel: "subscription",
    hasFreePlan: true,
    hasFreeTrial: true,
    startingPriceMonthly: 14.5,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Confirmed 2026-08-17: webex.com/pricing publishes Free ($0) and Enterprise (contact sales). Meet/Suite list floors vary by region and SKU; research consensus cites Meet ~$12–$14.50 and Suite ~$22.50–$27 per user/month, Calling Professional ~$15–$23 standalone / lower when bundled with Suite, Contact Center commonly ~$110–$235/agent. Medium confidence on paid seat dollars — confirm live cart/EA quote. Free plan: unlimited messaging, meetings up to 40 min / 100 attendees.",
    fixturePlans: [
      "PLAN free: name=Webex Free; amount=0; currency=USD; interval=month; fromFloor=true; confidence=high",
      "PLAN meet: name=Webex Meet; amountPerSeat=14.5; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=medium",
      "PLAN suite: name=Webex Suite; amountPerSeat=22.5; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=medium",
      "PLAN enterprise: name=Webex Enterprise; contactSales=true",
      "PLAN contact-center: name=Webex Contact Center; contactSales=true",
    ],
    enrichmentPlans: [
      freePlan("free", "Webex Free", {
        description:
          "Free forever meetings (40 min / 100 attendees), unlimited messaging, whiteboards, local recording — confirmed on webex.com/pricing 2026-08-17.",
      }),
      planPerSeatAnnual("meet", "Webex Meet", 14.5, {
        hasFreeTrial: true,
        description:
          "From ~$14.50/user/month research floor (medium) — unlimited meetings with AI assistant packaging; meetings-first SKU without full Calling bundle.",
      }),
      planPerSeatAnnual("suite", "Webex Suite", 22.5, {
        highlighted: true,
        hasFreeTrial: true,
        description:
          "From ~$22.50/user/month research floor (medium). Meetings + messaging + cloud calling bundle — primary UC scoring surface for business-phone peers.",
      }),
      contactSalesPlan("enterprise", "Webex Enterprise", {
        description:
          "Up to 1,000 attendees, unlimited cloud recording, FedRAMP paths, Events — custom / EA negotiated.",
      }),
      contactSalesPlan("contact-center", "Webex Contact Center", {
        description:
          "Separate CCaaS ladder commonly cited ~$110–$235/agent/month — quote-based; not used as the Suite scored floor.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "supported",
      "call-recording": "supported",
      "power-dialer": "limited",
      "sms-messaging": "limited",
      "whatsapp-business": "not-supported",
      "shared-inbox": "limited",
      "team-messaging": "supported",
      "video-meetings": "supported",
      "crm-cti": "supported",
      "analytics-reporting": "supported",
      "ai-assistance": "add-on",
      "unified-inbox": "limited",
    },
    aiLines: [
      "AI meeting assistant: supported",
      "AI call summaries: add-on",
      "AI noise removal: supported",
      "AI contact-center assistants: higher-plan-only",
    ],
    integrations: [
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "servicenow", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Paid Meet/Suite seat dollars are medium confidence — pricing UI is region/SKU dynamic",
      "Full Calling + Contact Center depth is often EA/quote layered beyond Suite list floors",
      "AI Assistant and advanced CC AI frequently sold as add-ons or higher SKUs",
      "SMB buyers may find Cisco packaging heavier than OpenPhone/Vonage self-serve phones",
      "WhatsApp Business and shared-inbox depth trail messaging/CCaaS specialists",
      "Power dialer / high-volume outbound is limited versus dialer or CCaaS specialists",
    ],
    limitationKinds: [
      "other",
      "high-cost-at-scale",
      "requires-add-on",
      "other",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 7,
      "voice-messaging-quality": 9,
      "routing-workflows": 8,
      integrations: 9,
      analytics: 8,
      "outbound-tools": 6,
      scalability: 10,
      "value-for-money": 6,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Mature Webex App UX for meetings and messaging; Calling and Contact Center admin still feel enterprise-IT. Score reflects documented product posture, not hands-on lab testing.",
      "voice-messaging-quality":
        "Enterprise-grade meetings plus Webex Calling voice and team messaging put Webex in the top UC voice/messaging band with Zoom/RingCentral peers — not an SMB softphone-only product.",
      "routing-workflows":
        "Calling delivers solid IVR/queues for UC buyers; full contact-centre routing depth sits on Webex Contact Center rather than Suite alone — strong mid-to-enterprise routing without claiming Genesys-class CCaaS.",
      integrations:
        "Deep Cisco + Salesforce/ServiceNow/Microsoft/Google/Slack gravity and device ecosystem. Near RingCentral-class integration story for enterprise UC.",
      analytics:
        "Meeting and calling analytics are first-party strengths; speech/CX analytics deepen on Contact Center and higher SKUs.",
      "outbound-tools":
        "Standard outbound calling and limited dialer options — not a power-dialer or outbound CCaaS specialist.",
      scalability:
        "Cisco EA, global Calling, devices and Contact Center document one of the strongest enterprise scale paths in BC — top-tier scalability.",
      "value-for-money":
        "Free tier helps discovery, but Suite/Calling/EA and add-on AI/CC raise real TCO. Capability justifies premium for enterprise UC buyers; transparency trails self-serve SMB phones. Affiliate economics excluded.",
      "ai-capabilities":
        "AI Assistant and noise removal are credible; deeper call/CC AI often add-on or higher-ladder — strong but paid packaging.",
    },
    bestFor: [
      "Enterprises standardising on Cisco hybrid-work UC (meetings + Calling + messaging)",
      "Organisations already in a Cisco EA that want Calling without a second UCaaS vendor",
      "Buyers who need FedRAMP / regulated meeting paths and room-device ecosystems",
    ],
    notIdealFor: [
      "Micro teams that only need a transparent SMB shared phone under $20/seat",
      "Buyers whose primary job is CCaaS omnichannel agent ops (prefer Talkdesk/Genesys/Five9)",
      "Teams standardised on Zoom meetings who only need a light phone add-on",
    ],
    pros: [
      "Enterprise UC envelope — meetings, messaging, Calling, devices",
      "Published Free tier for meetings/messaging discovery",
      "Strong Salesforce/ServiceNow/Microsoft integration gravity",
      "Clear Contact Center expansion path under the Webex brand",
      "FedRAMP / regulated enterprise security packaging on Enterprise",
    ],
    cons: [
      "Paid seat floors medium confidence — dynamic/EA pricing",
      "Calling and Contact Center often quote-layered beyond Suite",
      "Heavier than modern SMB phones (OpenPhone, Vonage, Ooma)",
      "AI and CC depth frequently add-on priced",
      "Not a WhatsApp-first customer messaging platform",
    ],
    keyFeatures: [
      "Webex meetings, messaging and whiteboarding",
      "Webex Calling cloud phone / softphones",
      "Enterprise security and FedRAMP paths on Enterprise",
      "CRM/UC integrations (Salesforce, ServiceNow, Microsoft)",
      "AI Assistant and noise removal",
      "Webex Contact Center ladder (separate SKU)",
    ],
    pricingSummary:
      "Free plan confirmed on webex.com/pricing 2026-08-17. Meet ~$12–$14.50 and Suite ~$22.50–$27 per user/month research floors (medium); Calling Professional commonly ~$15–$23; Enterprise and Contact Center custom/EA. Confirm live cart or Cisco quote — do not treat secondary Suite dollars as guaranteed list.",
    whoShouldChoose:
      "Choose Cisco Webex when you need enterprise hybrid-work UC — meetings, messaging and Webex Calling — especially inside a Cisco ecosystem, not a thin SMB virtual number.",
    whoShouldConsiderAlternatives:
      "Compare Zoom if you are already meetings-standardised and only need Zoom Phone, RingCentral/8x8 for UCaaS-first peers, and Talkdesk/Genesys/Five9 when the purchase is truly CCaaS agent operations.",
    alternativeSlugs: ["zoom", "ringcentral", "eightx8", "microsoft-teams"],
    competitorSlugs: ["zoom", "ringcentral", "eightx8", "microsoft-teams", "dialpad"],
    comparableSlugs: ["zoom", "ringcentral", "eightx8"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: ["business-phone", "team-communication", "contact-center"],
    teamTypeSlugs: ["operations", "sales", "customer-success"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "webex-calling",
        url: "https://www.webex.com/products/calling.html",
        title: "Webex Calling",
        domains: ["features", "product-positioning"],
      },
    ],
  },

  {
    slug: "vonage",
    name: "Vonage",
    company: "Vonage (an Ericsson company)",
    website: "https://www.vonage.com",
    domain: "vonage.com",
    pricingUrl: "https://www.vonage.com/unified-communications/pricing/",
    aliases: ["Vonage Business", "Vonage Business Communications", "VBC"],
    membershipRole: "primary",
    jobCluster: "cloud-phone",
    softShortDescription:
      "SMB/mid VoIP business phone (VBC) — Mobile from $13.99/line/mo on 12-month promo; Premium/Advanced higher.",
    shortDescription:
      "Vonage Business Communications (VBC) is an SMB/mid-market cloud phone system: unlimited US/Canada calling and SMS under fair use, softphone apps, team messaging, video meetings on Premium+, and CRM connectors on higher tiers. First-party pricing on vonage.com/unified-communications/pricing (checked 2026-08-17) publishes Mobile/Premium/Advanced at $19.99/$29.99/$39.99 per line/month monthly, with a 12-month promotion cutting ~30% to $13.99/$20.99/$27.99. Taxes, regulatory fees and volume line discounts apply. Separate Contact Center and CPaaS products exist but are not the scored VBC floor. Scored as a mid-tier business-phone peer — not a CCaaS landscape award.",
    vendorPositioning:
      "Affordable unified communications for growing businesses — cloud phone, messaging and meetings with clear per-line plans.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 13.99,
    startingPriceConfidence: "high",
    pricingNotes:
      "Confirmed 2026-08-17 on vonage.com/unified-communications/pricing: Mobile $19.99 / Premium $29.99 / Advanced $39.99 per line/month; 12-month promo ~$13.99 / $20.99 / $27.99. Plus taxes & fees. Volume discounts at higher line counts. High confidence on published VBC floors. Contact Center / API products are separate commercial lines.",
    fixturePlans: [
      "PLAN mobile: name=Mobile; amountPerSeat=13.99; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN premium: name=Premium; amountPerSeat=20.99; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN advanced: name=Advanced; amountPerSeat=27.99; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
    ],
    enrichmentPlans: [
      planPerSeatAnnual("mobile", "Mobile", 13.99, {
        description:
          "$13.99/line/month on 12-month promo ($19.99 monthly). Unlimited US/CA calling & SMS, mobile/desktop apps, team messaging baseline.",
      }),
      planPerSeatAnnual("premium", "Premium", 20.99, {
        highlighted: true,
        description:
          "$20.99/line/month annual promo ($29.99 monthly). Multi-level auto attendant, CRM integrations, unlimited video meetings (up to 100), IP desk phones.",
      }),
      planPerSeatAnnual("advanced", "Advanced", 27.99, {
        description:
          "$27.99/line/month annual promo ($39.99 monthly). On-demand call recording, call groups, visual voicemail and deeper team calling features.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "supported",
      "call-recording": "higher-plan-only",
      "power-dialer": "not-supported",
      "sms-messaging": "supported",
      "whatsapp-business": "not-supported",
      "shared-inbox": "limited",
      "team-messaging": "supported",
      "video-meetings": "higher-plan-only",
      "crm-cti": "higher-plan-only",
      "analytics-reporting": "limited",
      "ai-assistance": "limited",
      "unified-inbox": "not-supported",
    },
    aiLines: [
      "AI voicemail transcription: limited",
      "AI call summaries: not-supported",
      "AI receptionist: not-supported",
      "AI contact-center assistants: not-supported",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native", notes: "Premium+" },
      { integrationSlug: "hubspot", kind: "native", notes: "Premium+" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Taxes and regulatory fees sit on top of published per-line floors",
      "Call recording and deeper CRM land on Advanced / Premium packaging",
      "No power dialer — not a high-volume outbound dialer product",
      "AI packaging is thin versus Dialpad/OpenPhone/Talkdesk peers",
      "Contact Center is a separate product line, not included in VBC Mobile",
      "Annual promo floors assume 12-month commitment; monthly list is higher",
    ],
    limitationKinds: [
      "other",
      "plan-restriction",
      "feature-unavailable",
      "feature-unavailable",
      "plan-restriction",
      "other",
    ],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 8,
      "routing-workflows": 7,
      integrations: 7,
      analytics: 6,
      "outbound-tools": 5,
      scalability: 7,
      "value-for-money": 7,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Self-serve VBC plans, mobile/desktop apps and clear Mobile→Premium→Advanced ladder are approachable for SMB/mid teams. Score from documented packaging, not lab testing.",
      "voice-messaging-quality":
        "Solid unlimited US/CA calling + SMS with video on Premium+ — credible mid-tier business-phone envelope without RingCentral global UCaaS breadth.",
      "routing-workflows":
        "Auto attendant and call groups cover SMB routing; Advanced deepens groups/recording. Credible mid-tier routing without contact-centre IVR depth.",
      integrations:
        "Salesforce/HubSpot on Premium+ plus Teams and Zapier — solid SMB CTI without Aircall-class depth.",
      analytics:
        "Call history and basic reporting cover SMB needs; trails enterprise UCaaS/CCaaS analytics.",
      "outbound-tools":
        "SMS and standard outbound calling only — no power dialer. Intentional product boundary for VBC.",
      scalability:
        "Line-count discounts and Advanced packaging help growing SMBs; Enterprise/CCaaS buyers outgrow VBC into separate Vonage or peer platforms.",
      "value-for-money":
        "Transparent $13.99 Mobile promo floor is competitive versus Nextiva/CallHippo. Fees and Advanced upsells temper all-in TCO. Affiliate economics excluded.",
      "ai-capabilities":
        "Thin AI versus Dialpad/OpenPhone — limited transcription/assistant packaging keeps the AI score mid-low.",
    },
    bestFor: [
      "SMB and mid-market teams wanting published per-line VoIP with SMS",
      "Buyers who may grow into Premium video meetings and CRM connectors",
      "US/Canada-centric businesses that value Ericsson-backed Vonage branding",
    ],
    notIdealFor: [
      "Enterprise global UCaaS or regulated CCaaS buyers",
      "Teams that need included AI answering/coaching on every plan",
      "High-volume outbound dialer organisations",
    ],
    pros: [
      "Published Mobile/Premium/Advanced floors with clear annual promo",
      "Unlimited US/CA calling and SMS on VBC plans",
      "Video meetings and CRM on Premium+",
      "Desk phone and softphone options",
      "Volume discounts at higher line counts",
    ],
    cons: [
      "Taxes/fees inflate real line cost",
      "Recording and deeper CRM gated to higher tiers",
      "Thin AI versus modern SMB phones",
      "No power dialer",
      "Contact Center is a separate purchase",
    ],
    keyFeatures: [
      "Cloud business phone with softphones and desk phones",
      "Unlimited US/Canada calling and SMS (fair use)",
      "Multi-level auto attendant on Premium+",
      "Video meetings up to 100 on Premium+",
      "CRM connectors (Salesforce, HubSpot) on Premium+",
      "On-demand recording and call groups on Advanced",
    ],
    pricingSummary:
      "Mobile $13.99, Premium $20.99, Advanced $27.99 per line/month on 12-month promo ($19.99/$29.99/$39.99 monthly) confirmed on vonage.com/unified-communications/pricing 2026-08-17. Plus taxes & fees. High confidence on VBC floors.",
    whoShouldChoose:
      "Choose Vonage when you want a straightforward SMB/mid cloud phone with published per-line pricing, SMS and a clear Premium/Advanced upgrade path — not a full CCaaS suite.",
    whoShouldConsiderAlternatives:
      "Compare Nextiva for all-in-one SMB UCaaS, OpenPhone for modern shared-number UX, CallHippo for dialer-adjacent SMB value, and Ooma for no-contract monthly floors.",
    alternativeSlugs: ["nextiva", "openphone", "callhippo", "ooma"],
    competitorSlugs: ["nextiva", "openphone", "callhippo", "ooma", "ringcentral"],
    comparableSlugs: ["nextiva", "openphone", "callhippo"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: ["business-phone", "sales-calling", "team-communication"],
    teamTypeSlugs: ["sales", "operations", "customer-success"],
    businessSizeSlugs: ["solo", "small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [],
  },

  {
    slug: "ooma",
    name: "Ooma",
    company: "Ooma, Inc.",
    website: "https://www.ooma.com",
    domain: "ooma.com",
    pricingUrl:
      "https://www.ooma.com/small-business-phone-systems/account/ooma-office-pricing-chart/",
    aliases: ["Ooma Office", "Ooma Office Pro", "Ooma Business"],
    membershipRole: "primary",
    jobCluster: "cloud-phone",
    softShortDescription:
      "SMB VoIP (Ooma Office) — Essentials from $19.95/user/mo monthly; Pro $24.95; Pro Plus $29.95 — no annual lock-in.",
    shortDescription:
      "Ooma Office is an SMB cloud phone system with transparent monthly per-user pricing and no required annual contract: Essentials $19.95, Pro $24.95 and Pro Plus $29.95 per user/month (USD) confirmed on Ooma’s Office pricing chart (last updated 2026-04-15; retrieved 2026-08-17). Unlimited calling to US/Canada/Mexico/Puerto Rico, virtual receptionist and ring groups sit on Essentials; Pro adds meetings, recording, SMS (account caps) and voicemail transcription; Pro Plus adds call queues, CRM integrations and larger meetings. Ooma Enterprise is a separate custom line for larger contact-centre needs. Scored as a mid/low phone-cluster peer — overall ≥6.5 warrants a phone rank below the CallHippo/KrispCall band rather than landscape-only.",
    vendorPositioning:
      "Affordable small-business phone systems with transparent pricing and no long-term contracts.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 19.95,
    startingPriceConfidence: "high",
    pricingNotes:
      "Confirmed 2026-08-17 from ooma.com Office pricing chart (updated 2026-04-15): Essentials $19.95, Pro $24.95, Pro Plus $29.95 per user/month USD. Extra local numbers $9.95/mo; toll-free $9.95 + minute overages; SMS packs beyond plan caps. No annual contract required. High confidence on Office seat floors. Enterprise custom.",
    fixturePlans: [
      "PLAN essentials: name=Essentials; amountPerSeat=19.95; currency=USD; interval=month; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN pro: name=Pro; amountPerSeat=24.95; currency=USD; interval=month; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN pro-plus: name=Pro Plus; amountPerSeat=29.95; currency=USD; interval=month; amountPeriod=month; fromFloor=true; confidence=high",
    ],
    enrichmentPlans: [
      planPerSeatMonthly("essentials", "Essentials", 19.95, {
        hasFreeTrial: true,
        description:
          "$19.95/user/month. Extension + local number, unlimited US/CA/Mexico/PR calling, virtual receptionist, ring groups, mobile apps.",
      }),
      planPerSeatMonthly("pro", "Pro", 24.95, {
        highlighted: true,
        hasFreeTrial: true,
        description:
          "$24.95/user/month. Adds Ooma Meetings (25), call recording, SMS (account-wide caps), voicemail transcription, enhanced blocking.",
      }),
      planPerSeatMonthly("pro-plus", "Pro Plus", 29.95, {
        hasFreeTrial: true,
        description:
          "$29.95/user/month. Call queues, CRM integrations, hot desking, larger meetings (100), expanded receptionist.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "supported",
      "call-recording": "higher-plan-only",
      "power-dialer": "higher-plan-only",
      "sms-messaging": "higher-plan-only",
      "whatsapp-business": "not-supported",
      "shared-inbox": "limited",
      "team-messaging": "higher-plan-only",
      "video-meetings": "higher-plan-only",
      "crm-cti": "higher-plan-only",
      "analytics-reporting": "higher-plan-only",
      "ai-assistance": "limited",
      "unified-inbox": "not-supported",
    },
    aiLines: [
      "AI voicemail transcription: higher-plan-only",
      "AI call transcription: higher-plan-only",
      "AI answering agent: limited",
      "AI contact-center assistants: not-supported",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native", notes: "Pro Plus" },
      { integrationSlug: "hubspot", kind: "native", notes: "Pro Plus" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "SMS allotments are account-wide caps (e.g. Pro ~250/mo) — not per-user unlimited",
      "Call queues, CRM and auto-dialer require Pro Plus",
      "Roughly 15-seat cliff — larger teams often outgrow Office into Enterprise or peers",
      "No WhatsApp Business API",
      "AI depth trails OpenPhone/Dialpad",
      "Hardware ATAs/IP phones are optional one-time costs",
    ],
    limitationKinds: [
      "usage-cap",
      "plan-restriction",
      "other",
      "feature-unavailable",
      "feature-unavailable",
      "requires-add-on",
    ],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 7,
      "routing-workflows": 7,
      integrations: 6,
      analytics: 6,
      "outbound-tools": 5,
      scalability: 6,
      "value-for-money": 8,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "No-contract monthly plans and clear Essentials/Pro/Pro Plus ladder make Ooma easy for small teams to adopt. Score from documented packaging, not lab testing.",
      "voice-messaging-quality":
        "Reliable SMB VoIP with unlimited North America calling; meetings and SMS deepen on Pro+. Solid mid/low voice envelope — not carrier-grade global UCaaS.",
      "routing-workflows":
        "Virtual receptionist and ring groups on Essentials; queues and expanded receptionist on Pro Plus. Credible SMB routing without CCaaS depth.",
      integrations:
        "Google/Microsoft on lower tiers; Salesforce/HubSpot on Pro Plus. Thinner than Aircall/Nextiva CTI catalogues.",
      analytics:
        "Call logs and Pro analytics cover SMB reporting; trails mid-market UCaaS analytics.",
      "outbound-tools":
        "SMS on Pro+ and auto-dialer on Pro Plus only — mid/low outbound without a true power dialer story.",
      scalability:
        "Excellent under ~15 seats; Office packaging thins for multi-site contact-centre growth — Enterprise is a separate custom product.",
      "value-for-money":
        "Transparent $19.95 Essentials with no annual lock-in is strong SMB value. SMS caps and Pro Plus upsells temper all-in TCO. Affiliate economics excluded.",
      "ai-capabilities":
        "Transcription features on Pro/Pro Plus; no Sona-class AI answering packaging — mid-low AI score.",
    },
    bestFor: [
      "Small businesses that want transparent monthly VoIP without annual contracts",
      "Teams under ~15 seats needing receptionist, ring groups and optional queues",
      "Buyers who prefer published Office seat floors over quote-only UCaaS",
    ],
    notIdealFor: [
      "Contact-centre / multi-skill agent operations (prefer Talkdesk/Genesys/Five9)",
      "Global multi-country UCaaS buyers",
      "Teams that need unlimited per-user SMS or heavy AI answering",
    ],
    pros: [
      "Transparent Essentials/Pro/Pro Plus monthly floors — no required annual contract",
      "Unlimited North America calling on all Office tiers",
      "Virtual receptionist and ring groups included on Essentials",
      "Queues and CRM on Pro Plus",
      "Optional hardware with clear one-time prices",
    ],
    cons: [
      "SMS account caps bite as teams grow",
      "Queues/CRM gated to Pro Plus",
      "~15-seat Office ceiling for serious scale",
      "Thin AI versus modern SMB phones",
      "No WhatsApp Business",
    ],
    keyFeatures: [
      "Ooma Office cloud phone with softphones and IP phones",
      "Unlimited US/Canada/Mexico/Puerto Rico calling",
      "Virtual receptionist and ring groups",
      "Ooma Meetings, recording and SMS on Pro+",
      "Call queues and CRM on Pro Plus",
      "No required annual contract",
    ],
    pricingSummary:
      "Essentials $19.95, Pro $24.95, Pro Plus $29.95 per user/month USD confirmed on Ooma Office pricing chart (updated 2026-04-15; retrieved 2026-08-17). Extra numbers $9.95/mo; SMS packs beyond caps. No annual lock-in. High confidence.",
    whoShouldChoose:
      "Choose Ooma when you want an affordable SMB business phone with published monthly floors and no annual contract — especially under ~15 seats.",
    whoShouldConsiderAlternatives:
      "Compare CallHippo for dialer-adjacent SMB value, Vonage for promo annual per-line packaging, OpenPhone for modern shared-number UX, and Grasshopper for the simplest virtual-number entry.",
    alternativeSlugs: ["callhippo", "vonage", "openphone", "grasshopper"],
    competitorSlugs: ["callhippo", "vonage", "openphone", "grasshopper", "nextiva"],
    comparableSlugs: ["callhippo", "vonage", "openphone"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: ["business-phone", "sales-calling"],
    teamTypeSlugs: ["operations", "sales", "customer-success"],
    businessSizeSlugs: ["solo", "small-business"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "ooma-tier-comparison",
        url: "https://www.ooma.com/small-business-phone-systems/account/ooma-office-service-tier-comparison-chart/",
        title: "Ooma Office service tier comparison",
        domains: ["features", "plans"],
      },
    ],
  },

  {
    slug: "talkdesk",
    name: "Talkdesk",
    company: "Talkdesk, Inc.",
    website: "https://www.talkdesk.com",
    domain: "talkdesk.com",
    pricingUrl: "https://www.talkdesk.com/pricing/",
    aliases: ["Talkdesk CX Cloud", "Talkdesk CXA"],
    membershipRole: "primary",
    jobCluster: "contact-center",
    softShortDescription:
      "Cloud contact center (CCaaS) — Digital Essentials from $85/user/mo; Voice $105; Elite $165; Industry Clouds from $225.",
    shortDescription:
      "Talkdesk is a mid-market/enterprise cloud contact center (CCaaS): CX Cloud editions span Digital Essentials ($85), Voice Essentials ($105), Elite omnichannel ($165) and Industry Experience Clouds (from $225) per user/month, confirmed on talkdesk.com/pricing 2026-08-17. AI (CXA Copilot/Autopilot/Navigator) and many add-ons are quoted separately. Talkdesk Express offers a limited free credit path for small US/Canada businesses. Scored inside the contact-center job cluster — landscape award on the BC best page; do not rank as a phone-system peer to RingCentral/OpenPhone.",
    vendorPositioning:
      "AI-powered cloud contact center — automate every interaction across voice and digital channels.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 85,
    startingPriceConfidence: "high",
    pricingNotes:
      "Confirmed 2026-08-17 on talkdesk.com/pricing: Digital Essentials $85, Voice Essentials $105, Elite $165, Industry Experience Clouds $225 per user/month USD (Government custom). CXA AI products and many add-ons contact-sales. Talkdesk Express: 25 licences + $100 credit for US/CA businesses under 50 employees. High confidence on CX Cloud list floors; telephony usage and AI raise TCO.",
    fixturePlans: [
      "PLAN digital-essentials: name=Digital Essentials; amountPerSeat=85; currency=USD; interval=month; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN voice-essentials: name=Voice Essentials; amountPerSeat=105; currency=USD; interval=month; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN elite: name=Elite; amountPerSeat=165; currency=USD; interval=month; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN industry: name=Industry Experience Clouds; amountPerSeat=225; currency=USD; interval=month; amountPeriod=month; fromFloor=true; confidence=high",
    ],
    enrichmentPlans: [
      planPerSeatMonthly("digital-essentials", "Digital Essentials", 85, {
        hasFreeTrial: true,
        description:
          "$85/user/month — digital channels only (email, chat, SMS, social). Not a voice CCaaS seat.",
      }),
      planPerSeatMonthly("voice-essentials", "Voice Essentials", 105, {
        hasFreeTrial: true,
        description:
          "$105/user/month — voice-only contact center with Studio routing, speech recognition and BI.",
      }),
      planPerSeatMonthly("elite", "Elite", 165, {
        highlighted: true,
        hasFreeTrial: true,
        description:
          "$165/user/month — omnichannel voice + digital, WFM, screen recording, performance management.",
      }),
      planPerSeatMonthly("industry", "Industry Experience Clouds", 225, {
        description:
          "From $225/user/month — vertical Experience Clouds (FS, healthcare, retail, etc.); Government custom.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "supported",
      "call-recording": "supported",
      "power-dialer": "supported",
      "sms-messaging": "supported",
      "whatsapp-business": "limited",
      "shared-inbox": "supported",
      "team-messaging": "limited",
      "video-meetings": "limited",
      "crm-cti": "supported",
      "analytics-reporting": "supported",
      "ai-assistance": "add-on",
      "unified-inbox": "supported",
    },
    aiLines: [
      "AI Copilot agent assist: add-on",
      "AI Autopilot virtual agent: add-on",
      "AI Navigator routing: add-on",
      "AI interaction analytics: add-on",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "zendesk", kind: "native" },
      { integrationSlug: "servicenow", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Digital and Voice Essentials are channel-siloed — true omnichannel starts at Elite ($165)",
      "CXA AI (Copilot/Autopilot/Navigator) is typically add-on priced on top of CX Cloud seats",
      "Not a substitute for SMB business-phone / UCaaS seats",
      "Contracts and telephony usage commonly raise TCO beyond list floors",
      "Implementation and WFM complexity favour mid-market+ buyers",
      "WhatsApp depth trails messaging-first BSPs",
    ],
    limitationKinds: [
      "plan-restriction",
      "requires-add-on",
      "other",
      "high-cost-at-scale",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 7,
      "voice-messaging-quality": 9,
      "routing-workflows": 10,
      integrations: 9,
      analytics: 9,
      "outbound-tools": 8,
      scalability: 9,
      "value-for-money": 5,
      "ai-capabilities": 9,
    },
    scoreRationales: {
      "ease-of-use":
        "Studio builders and agent workspace are modern for CCaaS, but edition choice and AI add-ons add buying friction versus SMB phones. Score from documented packaging, not lab testing.",
      "voice-messaging-quality":
        "Voice Essentials/Elite deliver contact-centre grade voice plus digital channels on Elite — top-tier CCaaS voice/messaging envelope.",
      "routing-workflows":
        "Studio IVR, skills, omnichannel and Navigator AI routing are core CCaaS strengths — top-tier routing score.",
      integrations:
        "Broad CRM/helpdesk connectors (Salesforce, Zendesk, ServiceNow, Dynamics) and AppConnect marketplace — near enterprise CCaaS integration gravity.",
      analytics:
        "Live dashboards, Explore BI, screen recording and interaction analytics are first-party CCaaS strengths.",
      "outbound-tools":
        "Blended outbound, dialer and proactive engagement on higher editions — strong outbound for contact centres.",
      scalability:
        "Elite + Industry Clouds and CXA automation document clear mid-market to enterprise agent scale.",
      "value-for-money":
        "Published floors help, but $85 digital-only / $165 omnichannel plus AI add-ons is expensive versus UCaaS phones. Capability justifies CCaaS spend; value score reflects TCO. Affiliate economics excluded.",
      "ai-capabilities":
        "CXA Copilot/Autopilot/Navigator packaging is among the strongest CCaaS AI stories — scored high with add-on commercial caveat.",
    },
    bestFor: [
      "Mid-market and enterprise teams buying a purpose-built cloud contact center",
      "Organisations that need omnichannel agent ops with WFM on Elite+",
      "Buyers evaluating AI agent-assist and automation as primary CX bets",
    ],
    notIdealFor: [
      "SMB teams that only need a business phone / softphone (prefer OpenPhone/Vonage/Aircall)",
      "Buyers who refuse add-on AI commercial structures",
      "WhatsApp-only customer messaging teams (prefer Wati/respond.io)",
    ],
    pros: [
      "Published CX Cloud floors ($85–$225) with clear channel editions",
      "Studio routing and omnichannel Elite packaging",
      "Strong CRM/helpdesk integration catalogue",
      "Credible CXA AI roadmap (Copilot/Autopilot/Navigator)",
      "Industry Experience Clouds for vertical rollouts",
    ],
    cons: [
      "Omnichannel requires Elite — cheaper editions are siloed",
      "AI often add-on priced",
      "Not a UCaaS / SMB phone substitute",
      "Telephony usage and contracts raise TCO",
      "Heavier than mid-market cloud phones",
    ],
    keyFeatures: [
      "CX Cloud Digital / Voice / Elite / Industry editions",
      "Talkdesk Studio IVR and routing",
      "Omnichannel agent workspace on Elite+",
      "Workforce and performance management on Elite",
      "CXA AI Copilot, Autopilot and Navigator (add-on)",
      "CRM connectors (Salesforce, Zendesk, ServiceNow)",
    ],
    pricingSummary:
      "Digital Essentials $85, Voice Essentials $105, Elite $165, Industry Experience Clouds from $225 per user/month confirmed on talkdesk.com/pricing 2026-08-17. CXA AI and many add-ons contact sales. Express free-credit path for small US/CA businesses. High confidence on list floors.",
    whoShouldChoose:
      "Choose Talkdesk when you are buying a cloud contact center with published edition floors and AI automation options — not when you only need SMB business-phone seats.",
    whoShouldConsiderAlternatives:
      "Compare Genesys Cloud for enterprise CCaaS depth, Five9 for concurrent-seat / dialer-heavy CCaaS, and RingCentral/8x8 when UCaaS-first with a lighter CC path is enough.",
    alternativeSlugs: ["genesys", "five9", "ringcentral", "eightx8"],
    competitorSlugs: ["genesys", "five9", "ringcentral", "eightx8", "aircall"],
    comparableSlugs: ["genesys", "five9"],
    secondaryCategorySlugs: ["customer-service"],
    subcategorySlugs: [],
    useCaseSlugs: ["contact-center", "customer-messaging", "sales-calling"],
    teamTypeSlugs: ["customer-success", "operations", "sales"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [],
  },

  {
    slug: "genesys",
    name: "Genesys",
    company: "Genesys Cloud Services, Inc.",
    website: "https://www.genesys.com",
    domain: "genesys.com",
    pricingUrl: "https://www.genesys.com/pricing",
    aliases: ["Genesys Cloud", "Genesys Cloud CX", "PureCloud"],
    membershipRole: "primary",
    jobCluster: "contact-center",
    softShortDescription:
      "Enterprise CCaaS (Genesys Cloud CX) — CX 1 from $75/user/mo annual; CX 2 $115; CX 3 $155; CX 4 $240.",
    shortDescription:
      "Genesys Cloud CX is an enterprise cloud contact center / experience orchestration platform. First-party pricing on genesys.com/pricing (checked 2026-08-17) publishes named-agent annual floors: CX 1 $75 (voice), CX 2 $115 (omnichannel), CX 3 $155 (adds WEM), CX 4 $240 (adds journey/AI experience tokens). Concurrent and hourly-interacting licence models also exist; AI Experience tokens and usage-based telephony may apply. Scored as enterprise CCaaS — landscape award only on the BC best page; never ranked as a phone-system peer.",
    vendorPositioning:
      "AI-powered experience orchestration — the cloud contact center platform for enterprises that need voice, digital, WEM and journey management.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 75,
    startingPriceConfidence: "high",
    pricingNotes:
      "Confirmed 2026-08-17 on genesys.com/pricing: CX 1 $75, CX 2 $115, CX 3 $155, CX 4 $240 per named user/month billed annually (USD). Concurrent and hourly interacting alternatives. AI Experience tokens included with org allotments; overages usage-based. Digital-only and UCC-only editions exist. High confidence on published named floors; final TCO still quote-shaped.",
    fixturePlans: [
      "PLAN cx1: name=Genesys Cloud CX 1; amountPerSeat=75; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN cx2: name=Genesys Cloud CX 2; amountPerSeat=115; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN cx3: name=Genesys Cloud CX 3; amountPerSeat=155; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
      "PLAN cx4: name=Genesys Cloud CX 4; amountPerSeat=240; currency=USD; interval=year; amountPeriod=month; fromFloor=true; confidence=high",
    ],
    enrichmentPlans: [
      planPerSeatAnnual("cx1", "Genesys Cloud CX 1", 75, {
        description:
          "$75/user/month annual — voice contact center: IVR, ACD, outbound campaigns, recording, native AI capabilities with token allotments.",
      }),
      planPerSeatAnnual("cx2", "Genesys Cloud CX 2", 115, {
        highlighted: true,
        description:
          "$115/user/month annual — adds digital channels and omnichannel routing for full voice+digital CCaaS.",
      }),
      planPerSeatAnnual("cx3", "Genesys Cloud CX 3", 155, {
        description:
          "$155/user/month annual — adds workforce engagement management (WFM/QM/coaching) on top of CX 2.",
      }),
      planPerSeatAnnual("cx4", "Genesys Cloud CX 4", 240, {
        description:
          "$240/user/month annual — maximises AI experience tokens, journey management and advanced orchestration.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "supported",
      "call-recording": "supported",
      "power-dialer": "supported",
      "sms-messaging": "supported",
      "whatsapp-business": "limited",
      "shared-inbox": "supported",
      "team-messaging": "limited",
      "video-meetings": "limited",
      "crm-cti": "supported",
      "analytics-reporting": "supported",
      "ai-assistance": "supported",
      "unified-inbox": "supported",
    },
    aiLines: [
      "AI Agent Copilot: supported",
      "AI virtual agents / bots: supported",
      "AI predictive routing: supported",
      "AI Supervisor Copilot: supported",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "servicenow", kind: "native" },
      { integrationSlug: "zendesk", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
    ],
    limitations: [
      "Enterprise complexity and implementation cost — not an SMB self-serve phone",
      "CX 1 is voice-only; digital channels require CX 2 or digital add-ons",
      "AI Experience token overages and telephony usage raise TCO beyond seat floors",
      "Named vs concurrent licence choice materially changes commercial math",
      "Not ranked as a UCaaS phone peer on SoftwareGlimpse best page",
      "WhatsApp/social depth still token/add-on shaped on lower editions",
    ],
    limitationKinds: [
      "other",
      "plan-restriction",
      "requires-add-on",
      "other",
      "other",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 6,
      "voice-messaging-quality": 10,
      "routing-workflows": 10,
      integrations: 10,
      analytics: 10,
      "outbound-tools": 8,
      scalability: 10,
      "value-for-money": 5,
      "ai-capabilities": 9,
    },
    scoreRationales: {
      "ease-of-use":
        "Powerful but heavy — admin, licence models and AppFoundry selection need CX specialists. Lower ease than SMB phones by design.",
      "voice-messaging-quality":
        "Enterprise contact-centre voice plus digital on CX 2+ is top-tier CCaaS quality — the reference peer for serious agent ops.",
      "routing-workflows":
        "ACD, speech IVR, omnichannel and predictive routing are category-defining — top routing score.",
      integrations:
        "AppFoundry + Salesforce/ServiceNow/Dynamics/Teams gravity is the broadest enterprise CCaaS integration story in this set.",
      analytics:
        "Speech/text analytics, journey management and supervisor tooling on higher CX rungs are top-tier.",
      "outbound-tools":
        "Outbound campaigns and blending are first-party strengths across CX editions.",
      scalability:
        "Named/concurrent/hourly models plus global enterprise deployments — strongest scale story among P3 CCaaS peers.",
      "value-for-money":
        "Published floors help, but $75–$240 seats plus tokens/telephony/implementation are enterprise budgets. Value reflects TCO opacity relative to capability. Affiliate economics excluded.",
      "ai-capabilities":
        "Native Agent/Supervisor Copilot, virtual agents and predictive routing with token packaging — among the strongest CCaaS AI envelopes.",
    },
    bestFor: [
      "Enterprise contact centres that need omnichannel + WEM + journey orchestration",
      "Regulated industries standardising on Genesys Cloud CX",
      "Buyers comparing CCaaS platforms (not UCaaS phone seats)",
    ],
    notIdealFor: [
      "SMB teams needing a simple business phone under $30/seat",
      "Buyers who want self-serve transparent micro-team VoIP",
      "WhatsApp-only messaging programmes without agent ops",
    ],
    pros: [
      "Published CX 1–4 named floors on genesys.com/pricing",
      "Top-tier omnichannel routing, WEM and analytics",
      "Native AI Copilot / virtual agent packaging",
      "AppFoundry and Salesforce/ServiceNow gravity",
      "Flexible named / concurrent / hourly licence models",
    ],
    cons: [
      "Enterprise complexity and implementation burden",
      "Token and telephony usage inflate real TCO",
      "CX 1 lacks digital without add-ons",
      "Not an SMB phone substitute",
      "Overkill for teams that only need UCaaS Calling",
    ],
    keyFeatures: [
      "Genesys Cloud CX 1–4 editions",
      "Speech-enabled IVR and ACD",
      "Omnichannel digital channels on CX 2+",
      "Workforce engagement on CX 3+",
      "Native AI Copilot, bots and predictive routing",
      "AppFoundry marketplace integrations",
    ],
    pricingSummary:
      "CX 1 $75, CX 2 $115, CX 3 $155, CX 4 $240 per named user/month billed annually confirmed on genesys.com/pricing 2026-08-17. Concurrent/hourly alternatives; AI tokens and usage-based telephony may apply. High confidence on named floors.",
    whoShouldChoose:
      "Choose Genesys Cloud when you need enterprise CCaaS with published CX ladders, WEM and AI orchestration — not when you only need SMB/mid business-phone seats.",
    whoShouldConsiderAlternatives:
      "Compare Talkdesk for mid-market CCaaS with clearer AI add-on packaging, Five9 for dialer-heavy concurrent-seat CCaaS, and RingCentral/8x8 when UCaaS-first with a lighter CC path is enough.",
    alternativeSlugs: ["talkdesk", "five9", "ringcentral", "eightx8"],
    competitorSlugs: ["talkdesk", "five9", "ringcentral", "eightx8", "webex"],
    comparableSlugs: ["talkdesk", "five9"],
    secondaryCategorySlugs: ["customer-service"],
    subcategorySlugs: [],
    useCaseSlugs: ["contact-center", "customer-messaging", "sales-calling"],
    teamTypeSlugs: ["customer-success", "operations"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [],
  },

  {
    slug: "five9",
    name: "Five9",
    company: "Five9, Inc.",
    website: "https://www.five9.com",
    domain: "five9.com",
    pricingUrl: "https://www.five9.com/products/pricing",
    aliases: ["Five9 Intelligent Cloud Contact Center", "Five9 CCaaS"],
    membershipRole: "primary",
    jobCluster: "contact-center",
    softShortDescription:
      "Cloud contact center (CCaaS) — Digital from $119/concurrent seat/mo; Core $159; Plus/Pro/Enterprise quote — 50-seat minimum.",
    shortDescription:
      "Five9 is a cloud contact center platform known for blended inbound/outbound voice, dialer strength and concurrent-seat packaging. First-party pricing on five9.com/products/pricing (checked 2026-08-17) publishes Digital $119 and Core $159 per concurrent seat/month USD, with Plus/Pro/Enterprise contact-sales; a 50-seat minimum and usage-based AI/SMS charges apply. Scored as CCaaS — landscape award only; do not rank as a phone-system peer.",
    vendorPositioning:
      "Intelligent cloud contact center — AI, CRM adapters and WEM choice for mid-market and enterprise CX teams.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 119,
    startingPriceConfidence: "high",
    pricingNotes:
      "Confirmed 2026-08-17 on five9.com/products/pricing: Digital $119, Core $159 per concurrent seat/month USD; Plus/Pro/Enterprise contact sales. Minimum 50 seats. Usage-based AI minutes and SMS may apply. High confidence on Digital/Core floors; higher bundles are quote-only — do not invent Plus/Pro dollars.",
    fixturePlans: [
      "PLAN digital: name=Digital; amountPerSeat=119; currency=USD; interval=month; amountPeriod=month; fromFloor=true; confidence=high; minimumSeats=50",
      "PLAN core: name=Core; amountPerSeat=159; currency=USD; interval=month; amountPeriod=month; fromFloor=true; confidence=high; minimumSeats=50",
      "PLAN plus: name=Plus; contactSales=true",
      "PLAN pro: name=Pro; contactSales=true",
      "PLAN enterprise: name=Enterprise; contactSales=true",
    ],
    enrichmentPlans: [
      planPerSeatMonthly("digital", "Digital", 119, {
        minimumSeats: 50,
        description:
          "$119/concurrent seat/month — digital channels only (chat, email, SMS/MMS, social). 50-seat minimum.",
      }),
      planPerSeatMonthly("core", "Core", 159, {
        highlighted: true,
        minimumSeats: 50,
        description:
          "$159/concurrent seat/month — all channels with AI essentials, dialer, recording, CRM/UC adapter choice. 50-seat minimum.",
      }),
      contactSalesPlan("plus", "Plus", {
        description:
          "All channels with advanced AI — contact sales; no public seat dollars (2026-08-17).",
      }),
      contactSalesPlan("pro", "Pro", {
        description:
          "All channels with AI essentials + WEM — contact sales.",
      }),
      contactSalesPlan("enterprise", "Enterprise", {
        description:
          "All channels with advanced AI + full WEM — contact sales.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "supported",
      "call-recording": "supported",
      "power-dialer": "supported",
      "sms-messaging": "supported",
      "whatsapp-business": "limited",
      "shared-inbox": "supported",
      "team-messaging": "not-supported",
      "video-meetings": "limited",
      "crm-cti": "supported",
      "analytics-reporting": "supported",
      "ai-assistance": "supported",
      "unified-inbox": "supported",
    },
    aiLines: [
      "AI summaries / live transcription: supported",
      "AI Agent Assist: higher-plan-only",
      "AI Knowledge: higher-plan-only",
      "AI Insights: supported",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "servicenow", kind: "native" },
      { integrationSlug: "zendesk", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "zoom", kind: "native" },
      { integrationSlug: "ringcentral", kind: "native" },
    ],
    limitations: [
      "50 concurrent-seat minimum — not viable for small SMB phone buyers",
      "Digital is non-voice; Core is the published voice+digital entry",
      "Plus/Pro/Enterprise dollars are quote-only — do not invent list prices",
      "Usage-based AI minutes and SMS raise TCO beyond seat floors",
      "Not a UCaaS / SMB business-phone substitute",
      "WEM may be Five9 or partner (Verint/Calabrio) add-on packaging",
    ],
    limitationKinds: [
      "usage-cap",
      "plan-restriction",
      "other",
      "requires-add-on",
      "other",
      "requires-add-on",
    ],
    scores: {
      "ease-of-use": 7,
      "voice-messaging-quality": 9,
      "routing-workflows": 9,
      integrations: 9,
      analytics: 8,
      "outbound-tools": 9,
      scalability: 9,
      "value-for-money": 5,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Agent desktop and dialer workflows are strong for CCaaS operators; 50-seat minimum and quote tiers add commercial friction versus SMB phones.",
      "voice-messaging-quality":
        "Core+ voice with blended digital channels is contact-centre grade — strong CCaaS voice/messaging envelope.",
      "routing-workflows":
        "ACD, IVR, queue management and Inference Studio cover serious agent routing — near top-tier without claiming Genesys journey breadth.",
      integrations:
        "Choice of CRM (Salesforce, ServiceNow, Dynamics, Zendesk, Oracle) and UC adapters (Teams, Zoom, RingCentral) is a first-party strength.",
      analytics:
        "Reporting and AI insights on Core+; deeper analytics often add-on. Strong mid/high CCaaS analytics.",
      "outbound-tools":
        "Dialer and blended inbound/outbound are Five9 hallmarks — top outbound score among P3 CCaaS peers.",
      scalability:
        "Concurrent-seat model and 50+ seat posture fit mid-market to enterprise agent centres — strong scale, not SMB.",
      "value-for-money":
        "Published Digital/Core floors help, but 50-seat minimum and usage AI/SMS make entry expensive versus UCaaS phones. Affiliate economics excluded.",
      "ai-capabilities":
        "AI essentials on Core with advanced AI on Plus/Enterprise — credible CCaaS AI with higher-tier gating.",
    },
    bestFor: [
      "Mid-market and enterprise contact centres that need blended dialer strength",
      "Teams comfortable with concurrent-seat economics and 50+ seat minimums",
      "Buyers who want CRM/UC adapter choice inside CCaaS",
    ],
    notIdealFor: [
      "SMB teams under 50 seats needing a simple business phone",
      "Buyers who need fully published dollars on every tier including Plus/Pro",
      "UCaaS-only purchases (prefer RingCentral/Webex/Zoom Phone)",
    ],
    pros: [
      "Published Digital $119 / Core $159 concurrent floors",
      "Strong blended dialer and outbound posture",
      "CRM and UC adapter choice called out first-party",
      "AI essentials on Core with advanced AI path",
      "WEM vendor flexibility (Five9 / Verint / Calabrio)",
    ],
    cons: [
      "50-seat minimum excludes small teams",
      "Plus/Pro/Enterprise are quote-only",
      "Usage AI/SMS inflate TCO",
      "Not an SMB phone substitute",
      "Digital tier excludes voice",
    ],
    keyFeatures: [
      "Digital and Core published CCaaS bundles",
      "Blended inbound/outbound with dialer",
      "ACD, IVR, recording and queue management",
      "CRM adapters (Salesforce, ServiceNow, Dynamics, Zendesk)",
      "UC adapters (Teams, Zoom, RingCentral)",
      "AI summaries, transcription and higher-tier Agent Assist",
    ],
    pricingSummary:
      "Digital $119 and Core $159 per concurrent seat/month USD confirmed on five9.com/products/pricing 2026-08-17; Plus/Pro/Enterprise contact sales. 50-seat minimum; usage-based AI/SMS may apply. High confidence on Digital/Core — do not invent higher-tier dollars.",
    whoShouldChoose:
      "Choose Five9 when you need a cloud contact center with strong dialer/blended outbound economics and can meet the 50 concurrent-seat minimum — not for SMB business-phone seats.",
    whoShouldConsiderAlternatives:
      "Compare Talkdesk for published omnichannel Elite packaging, Genesys for enterprise WEM/journey depth, and RingCentral when UCaaS-first with a lighter CC path is enough.",
    alternativeSlugs: ["talkdesk", "genesys", "ringcentral", "eightx8"],
    competitorSlugs: ["talkdesk", "genesys", "ringcentral", "webex", "eightx8"],
    comparableSlugs: ["talkdesk", "genesys"],
    secondaryCategorySlugs: ["customer-service"],
    subcategorySlugs: [],
    useCaseSlugs: ["contact-center", "sales-calling", "customer-messaging"],
    teamTypeSlugs: ["customer-success", "sales", "operations"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [],
  },
];

/** Within-batch pairs only (both must be in PRODUCTS for writeComparisonSpec). */
export const COMPARISON_PAIRS = [
  ["talkdesk", "genesys"],
  ["five9", "talkdesk"],
  ["vonage", "ooma"],
];

/**
 * Full comparison set to wire into comparisons.ts (includes existing catalogue peers).
 */
export const COMPARISON_PAIRS_FULL = [
  ["webex", "zoom"],
  ["webex", "ringcentral"],
  ["vonage", "nextiva"],
  ["ooma", "callhippo"],
  ["talkdesk", "genesys"],
  ["five9", "talkdesk"],
  ["genesys", "ringcentral"],
];
