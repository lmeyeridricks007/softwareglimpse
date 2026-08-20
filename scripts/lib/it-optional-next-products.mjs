/**
 * IT optional-next pack (compact).
 * topdesk, ivanti, bmc-helix, chronosphere, coralogix, render, fly-io.
 *
 * Pricing grounded 2026-08-18 from first-party pages (or labelled third-party
 * / marketplace signals where the vendor has no public list).
 * Affiliate economics never enter scores. handsOnTesting=false.
 *
 * ServiceNow (8.7) / Freshservice (8.4) remain the ITSM awards — do not outrank.
 * Datadog (8.6) remains the observability-monitoring award.
 * Render (7.9) is the cloud-paas cluster award; Fly.io (7.7) is the peer.
 *
 * Each compact entry passes jobCluster and matching useCaseSlugs into expandItProduct.
 */
import { expandItProduct } from "./it-compact-expand.mjs";

const ITSM_FEATURES = {
  "incident-management": "supported",
  "change-problem": "supported",
  "service-catalog": "supported",
  "infrastructure-monitoring": "limited",
  "apm-tracing": "not-supported",
  "log-management": "limited",
  "source-control": "not-supported",
  "cicd-actions": "limited",
  "hosting-panel": "not-supported",
  "managed-hosting": "not-supported",
  "cloud-paas": "not-supported",
  "proxy-network": "not-supported",
  "itsm-ai": "limited",
  "dev-ai": "not-supported",
  "oncall-paging": "limited",
  "enterprise-security": "supported",
  "analytics-reporting": "supported",
};

const OBS_FEATURES = {
  "incident-management": "limited",
  "change-problem": "not-supported",
  "service-catalog": "not-supported",
  "infrastructure-monitoring": "supported",
  "apm-tracing": "supported",
  "log-management": "supported",
  "source-control": "not-supported",
  "cicd-actions": "limited",
  "hosting-panel": "not-supported",
  "managed-hosting": "not-supported",
  "cloud-paas": "not-supported",
  "proxy-network": "not-supported",
  "itsm-ai": "limited",
  "dev-ai": "limited",
  "oncall-paging": "limited",
  "enterprise-security": "supported",
  "analytics-reporting": "supported",
};

const PAAS_FEATURES = {
  "incident-management": "not-supported",
  "change-problem": "not-supported",
  "service-catalog": "not-supported",
  "infrastructure-monitoring": "limited",
  "apm-tracing": "not-supported",
  "log-management": "limited",
  "source-control": "not-supported",
  "cicd-actions": "limited",
  "hosting-panel": "not-supported",
  "managed-hosting": "limited",
  "cloud-paas": "supported",
  "proxy-network": "not-supported",
  "itsm-ai": "not-supported",
  "dev-ai": "limited",
  "oncall-paging": "not-supported",
  "enterprise-security": "limited",
  "analytics-reporting": "limited",
};

const COMPACT = [
  {
    slug: "topdesk",
    name: "TOPdesk",
    company: "TOPdesk B.V.",
    website: "https://www.topdesk.com",
    domain: "topdesk.com",
    pricingUrl: "https://www.topdesk.com/en/pricing/",
    aliases: ["Topdesk", "TOPdesk ITSM", "TOPdesk Service Management"],
    membershipRole: "primary",
    jobCluster: "itsm-service-desk",
    officialVideos: [
      {
        videoId: "8eZDe24Bq8o",
        title: "TOPdesk: Service Management That Feels Personal",
      },
    ],
    softShortDescription:
      "ITSM / service management — Essential £51/agent/mo; Engaged £72; Excellent £101 (GBP). Does not outrank ServiceNow 8.7 / Freshservice 8.4.",
    shortDescription:
      "TOPdesk is a European ITSM and employee service-management platform (incidents, changes, catalog, and operator workflows) from TOPdesk B.V. First-party pricing publishes Essential at £51/agent/month, Engaged £72, and Excellent £101 — treat as GBP, not a USD list. No published free plan or self-serve trial tile; buying is typically a conversation. Same itsm-service-desk cluster as ServiceNow and Freshservice — ServiceNow remains the enterprise award (8.7) and Freshservice the published mid-market award (8.4); this entity does not outrank either. Distinct from HaloITSM’s UK all-in-one calculator and from Freshservice’s $19 Starter.",
    vendorPositioning:
      "Service management that feels personal — published GBP agent SKUs without a ServiceNow RFP.",
    pricingModel: "per-seat",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 51,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from topdesk.com/en/pricing (high confidence). Essential £51/agent/mo; Engaged £72; Excellent £101. startingPriceMonthly 51 is GBP from that card — not a USD list price. No free plan; no published self-serve trial. Affiliate economics excluded.",
    pricingSummary:
      "No free plan. Essential £51/agent/mo (GBP). Engaged £72. Excellent £101. Confirm live on topdesk.com/en/pricing.",
    plans: [
      {
        kind: "per-seat-monthly",
        slug: "essential",
        name: "Essential",
        amount: 51,
        highlighted: true,
        description:
          "£51/agent/mo Essential — GBP first-party floor, not a USD list. No published free plan or self-serve trial.",
      },
      {
        kind: "per-seat-monthly",
        slug: "engaged",
        name: "Engaged",
        amount: 72,
        description: "£72/agent/mo Engaged (GBP) on the first-party TOPdesk card.",
      },
      {
        kind: "per-seat-monthly",
        slug: "excellent",
        name: "Excellent",
        amount: 101,
        description: "£101/agent/mo Excellent (GBP) — highest published TOPdesk agent pack.",
      },
      {
        kind: "contact-sales",
        slug: "talk-to-topdesk",
        name: "Talk to TOPdesk",
        description:
          "Implementation and packaging via TOPdesk — contact, not a self-serve trial tile.",
      },
    ],
    featureOverrides: ITSM_FEATURES,
    aiLines: [
      "ITSM AI copilot: limited",
      "Developer AI copilot: not-supported",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "£51 Essential floor is GBP — do not treat as a USD $51 list",
      "Does not outrank ServiceNow (8.7) or Freshservice (8.4)",
      "No published free plan or self-serve trial",
      "ITSM AI is assistance, not Now Assist / Freddy as a buying reason",
      "Not observability, git, hosting panel, managed hosting, or cloud PaaS",
    ],
    limitationKinds: [
      "other",
      "other",
      "other",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "it-job-fit": 8,
      "workflow-depth": 8,
      integrations: 8,
      "admin-security": 8,
      scalability: 8,
      "value-for-money": 8,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Published GBP agent ladder is easier to model than Ivanti/BMC RFPs; operator UX is approachable mid-market ITSM. Not a lab test.",
      "it-job-fit":
        "ITSM / employee service desk — ranked with ServiceNow and Freshservice, not Datadog or Render. Held at 8 versus Freshservice’s 9.",
      "workflow-depth":
        "Incident/change/catalog cover a real service-management loop; below ServiceNow CMDB/ESM ceiling.",
      integrations: "Slack/Teams/API cover typical desks — not ServiceNow’s enterprise graph.",
      "admin-security":
        "Paid TOPdesk admin is solid for mid-market; not Now Platform domain separation.",
      scalability:
        "Agent ladder through Excellent £101; held at 8, below ServiceNow’s 10.",
      "value-for-money":
        "Published £51 Essential is a clearer floor than Ivanti/BMC quotes; GBP vs USD is the TCO catch. Affiliate economics excluded.",
      "ai-capabilities":
        "TOPdesk AI assist exists — scored as supporting, not a reason to skip Freshservice Freddy or Now Assist.",
    },
    bestFor: [
      "IT teams that want a published GBP agent ITSM SKU rather than a ServiceNow RFP",
      "European desks comparing TOPdesk Essential £51 to HaloITSM’s UK calculator",
      "Buyers who will model GBP vs Freshservice’s USD $19 Starter before ranking",
    ],
    notIdealFor: [
      "Enterprises standardising on ServiceNow CMDB + ESM",
      "USD SMBs that need Freshservice’s published $19 Starter as the default award path",
      "SRE observability or cloud PaaS purchases",
    ],
    pros: [
      "Published Essential £51/agent floor (GBP)",
      "Engaged £72 and Excellent £101 ladder",
      "Clear ITSM identity vs observability/PaaS",
      "Same-cluster peer of Freshservice / HaloITSM",
      "First-party pricing page",
    ],
    cons: [
      "GBP not USD",
      "Does not outrank ServiceNow or Freshservice",
      "No free plan or self-serve trial",
      "AI is not the buying reason",
      "Not observability or cloud PaaS",
    ],
    keyFeatures: [
      "IT service management / incidents",
      "Change and service catalog",
      "Essential from £51/agent/mo (GBP)",
      "Engaged / Excellent agent packs",
      "Operator-focused service desk",
    ],
    whoShouldChoose:
      "Choose TOPdesk when published GBP-agent ITSM is the job — not ServiceNow by default, and not Freshservice by default.",
    whoShouldConsiderAlternatives:
      "Compare Freshservice for the published mid-market award path; HaloITSM for all-in-one UK calculator packaging; ServiceNow for enterprise ESM.",
    alternativeSlugs: ["freshservice", "haloitsm"],
    competitorSlugs: [
      "freshservice",
      "haloitsm",
      "servicenow",
      "manageengine-servicedesk-plus",
      "sysaid",
      "ivanti",
      "bmc-helix",
    ],
    comparableSlugs: ["freshservice", "haloitsm", "manageengine-servicedesk-plus"],
    useCaseSlugs: ["itsm-service-desk"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["it-ops", "operations"],
    sourcesExtra: [
      {
        id: "topdesk-pricing",
        url: "https://www.topdesk.com/en/pricing/",
        title: "TOPdesk pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "ivanti",
    name: "Ivanti Neurons for ITSM",
    company: "Ivanti, Inc.",
    website: "https://www.ivanti.com/products/ivanti-neurons-for-itsm",
    domain: "ivanti.com",
    pricingUrl: "https://www.ivanti.com/products/ivanti-neurons-for-itsm",
    aliases: ["Ivanti", "Ivanti Neurons for ITSM", "Ivanti Service Manager"],
    membershipRole: "primary",
    jobCluster: "itsm-service-desk",
    officialVideos: [
      {
        videoId: "V5ZIhtPR8TY",
        title: "Stop Ticket Escalations: Ivanti Neurons Workspace Demo",
      },
    ],
    softShortDescription:
      "Enterprise ITSM (Ivanti Neurons / Service Manager) — contact sales. No public list. Does not outrank ServiceNow 8.7 / Freshservice 8.4.",
    shortDescription:
      "Ivanti Neurons for ITSM (also sold as Ivanti Service Manager) is enterprise IT service management — incidents, changes, catalog, and Neurons workspace automation. Ivanti does not publish a self-serve list price; buying is contact sales / RFP. startingPriceMonthly $95 is a low-confidence third-party named-agent estimate — not a vendor SKU, same pattern as ServiceNow’s $100 directional band. Same itsm-service-desk cluster as ServiceNow and Freshservice — this entity does not outrank ServiceNow 8.7 or Freshservice 8.4. Distinct from BMC Helix/Remedy estates and from TOPdesk’s published GBP agent card.",
    vendorPositioning:
      "Neurons-era ITSM for enterprises already in the Ivanti endpoint/ITAM gravity well — expect an RFP, not a $19 Starter tile.",
    pricingModel: "custom",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 95,
    startingPriceConfidence: "low",
    pricingNotes:
      "No first-party public list (2026-08-18). startingPriceMonthly $95 is a low-confidence third-party named-agent estimate — not a vendor SKU. Always RFP. Affiliate economics excluded.",
    pricingSummary:
      "Contact sales. No public list price — $95 named-agent figure is a low-confidence third-party estimate, not an Ivanti SKU. Confirm quote.",
    plans: [
      {
        kind: "contact-sales",
        slug: "neurons-itsm",
        name: "Ivanti Neurons for ITSM",
        highlighted: true,
        description:
          "ITSM / Service Manager on Neurons — custom quote. No published agent tile.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise-rfp",
        name: "Enterprise RFP",
        description:
          "Named-agent, module, and endpoint-adjacent packaging via RFP — not a self-serve SKU.",
      },
    ],
    featureOverrides: {
      ...ITSM_FEATURES,
      "itsm-ai": "supported",
      "oncall-paging": "supported",
      "enterprise-security": "supported",
    },
    aiLines: [
      "ITSM AI copilot: supported",
      "Developer AI copilot: not-supported",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "No published self-serve price — $95 is a low-confidence third-party named-agent estimate, not an Ivanti SKU",
      "Does not outrank ServiceNow (8.7) or Freshservice (8.4)",
      "Neurons / Service Manager naming overlap is a buying-motion trap",
      "Poor fit as an SMB published-price alternative to Freshservice Starter",
      "Not observability, git, hosting panel, or cloud PaaS",
    ],
    limitationKinds: [
      "other",
      "other",
      "other",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 7,
      "it-job-fit": 9,
      "workflow-depth": 9,
      integrations: 8,
      "admin-security": 9,
      scalability: 9,
      "value-for-money": 6,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Enterprise Neurons workspace plus opaque quotes is heavier than Freshservice or TOPdesk’s published cards. Not a lab test.",
      "it-job-fit":
        "Enterprise ITSM — ranked with ServiceNow and BMC Helix, not as an SMB helpdesk or observability SKU.",
      "workflow-depth":
        "ITIL-depth incidents/changes/catalog plus Neurons automation; still below ServiceNow CMDB/ESM ceiling.",
      integrations: "Enterprise IT integrations are real; thinner public marketplace than ServiceNow.",
      "admin-security":
        "Enterprise admin/security posture is a buying reason versus SMB desks.",
      scalability: "Named-agent estates scale; TCO follows RFP modules, not a $19 tile.",
      "value-for-money":
        "Quote-only plus a low-confidence $95 estimate is weaker than published Freshservice/TOPdesk floors. Affiliate economics excluded.",
      "ai-capabilities":
        "Neurons AI assist exists — scored as supporting, not a reason to skip Now Assist.",
    },
    bestFor: [
      "Enterprises already in Ivanti endpoint/ITAM who want Neurons ITSM on the same gravity well",
      "RFP buyers comparing Ivanti to ServiceNow and BMC Helix",
      "Desks that will not self-serve a $19 Freshservice Starter",
    ],
    notIdealFor: [
      "SMBs that need a published agent floor (Freshservice / TOPdesk / ManageEngine)",
      "Teams standardising on ServiceNow as the enterprise award path",
      "Observability or cloud PaaS purchases",
    ],
    pros: [
      "Enterprise ITSM / Service Manager depth",
      "Neurons workspace automation",
      "Strong admin-security and scale story",
      "Same-cluster peer of ServiceNow / BMC Helix",
      "Clear ITSM identity",
    ],
    cons: [
      "No public list — $95 is not a vendor SKU",
      "Does not outrank ServiceNow or Freshservice",
      "Naming overlap (Neurons vs Service Manager)",
      "Weak SMB self-serve motion",
      "Not observability or PaaS",
    ],
    keyFeatures: [
      "Ivanti Neurons for ITSM / Service Manager",
      "Incident, change, and catalog",
      "Neurons workspace automation",
      "Enterprise admin and scale",
      "Contact-sales / RFP packaging",
    ],
    whoShouldChoose:
      "Choose Ivanti Neurons for ITSM when an enterprise Ivanti-aligned ITSM RFP is the job — not ServiceNow by default, and not Freshservice’s published Starter.",
    whoShouldConsiderAlternatives:
      "Compare ServiceNow for the enterprise ITSM award path; BMC Helix for Remedy-lineage estates; Freshservice for published mid-market agent SKUs.",
    alternativeSlugs: ["servicenow", "bmc-helix"],
    competitorSlugs: [
      "servicenow",
      "bmc-helix",
      "freshservice",
      "topdesk",
      "jira-service-management",
    ],
    comparableSlugs: ["servicenow", "bmc-helix", "topdesk"],
    useCaseSlugs: ["itsm-service-desk"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    teamTypeSlugs: ["it-ops", "operations"],
    sourcesExtra: [
      {
        id: "ivanti-neurons-itsm",
        url: "https://www.ivanti.com/products/ivanti-neurons-for-itsm",
        title: "Ivanti Neurons for ITSM",
        domains: ["identity", "product-positioning", "features"],
      },
    ],
  },
  {
    slug: "bmc-helix",
    name: "BMC Helix ITSM",
    company: "BMC Software, Inc.",
    website: "https://www.bmc.com/it-solutions/bmc-helix-itsm.html",
    domain: "bmc.com",
    pricingUrl: "https://www.bmc.com/it-solutions/bmc-helix-itsm.html",
    aliases: ["BMC Helix ITSM", "Helix ITSM", "Remedy", "BMC Remedy"],
    membershipRole: "primary",
    jobCluster: "itsm-service-desk",
    officialVideos: [
      {
        videoId: "MsELM-v29FM",
        title: "What’s new in BMC Helix ITSM 25.1",
      },
    ],
    softShortDescription:
      "Enterprise ITSM (Helix / Remedy lineage) — no BMC.com list; AppExchange signal ~$114.75/named user/mo. Always RFP. Does not outrank ServiceNow 8.7.",
    shortDescription:
      "BMC Helix ITSM is BMC’s enterprise IT service management platform — the Helix/cloud continuation of the Remedy lineage (incidents, problems, changes, catalog, CMDB-adjacent ITSM). BMC.com does not publish a self-serve price card. An AppExchange listing around $114.75/named user/month is a marketplace signal, not a BMC.com SKU — startingPriceMonthly $115 is that rounded figure at medium confidence. Always RFP. Same itsm-service-desk cluster as ServiceNow — ServiceNow remains the award (8.7); this entity does not outrank it. Distinct from Ivanti Neurons and from published-price desks (Freshservice / TOPdesk).",
    vendorPositioning:
      "Helix ITSM for Remedy-lineage and BMC estates — enterprise ITIL depth, quote-led, not a mid-market agent tile.",
    pricingModel: "custom",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 115,
    startingPriceConfidence: "medium",
    pricingNotes:
      "No BMC.com public list (2026-08-18). startingPriceMonthly $115 is rounded from an AppExchange named-user listing (~$114.75/mo) — marketplace signal, not a BMC.com price card. Always RFP. Affiliate economics excluded.",
    pricingSummary:
      "Contact sales / always RFP. No BMC.com list. AppExchange named-user signal ~$114.75/mo (medium confidence; not a BMC SKU). Confirm quote.",
    plans: [
      {
        kind: "contact-sales",
        slug: "helix-itsm",
        name: "BMC Helix ITSM",
        highlighted: true,
        description:
          "Helix ITSM (Remedy lineage) — custom quote. AppExchange ~$114.75/named user/mo is a marketplace signal, not a BMC.com card.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise-rfp",
        name: "Enterprise RFP",
        description:
          "Named-user, on-prem/Helix mix, and module packaging via RFP — always confirm with BMC.",
      },
    ],
    featureOverrides: {
      ...ITSM_FEATURES,
      "itsm-ai": "supported",
      "change-problem": "supported",
      "oncall-paging": "supported",
      "enterprise-security": "supported",
    },
    aiLines: [
      "ITSM AI copilot: supported",
      "Developer AI copilot: not-supported",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "No BMC.com price card — $115 is an AppExchange named-user signal, not a vendor SKU",
      "Does not outrank ServiceNow (8.7)",
      "Remedy/Helix naming is a buying-motion trap for teams expecting a new-build SaaS desk",
      "Always RFP — poor fit versus Freshservice Starter or TOPdesk Essential",
      "Not observability, git, hosting panel, or cloud PaaS",
    ],
    limitationKinds: [
      "other",
      "other",
      "other",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 7,
      "it-job-fit": 9,
      "workflow-depth": 9,
      integrations: 9,
      "admin-security": 9,
      scalability: 9,
      "value-for-money": 6,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Helix/Remedy enterprise UX plus RFP buying is heavier than Freshservice. Not a lab test.",
      "it-job-fit":
        "Enterprise ITSM — ranked with ServiceNow and Ivanti, not as an SMB published-price desk.",
      "workflow-depth":
        "ITIL-depth Helix/Remedy workflows are deep; still below ServiceNow as the award ceiling.",
      integrations: "Broad enterprise ITSM integration surface — stronger than Ivanti’s public story.",
      "admin-security":
        "BMC enterprise security/governance is a buying reason versus mid-market desks.",
      scalability: "Global named-user / Helix estates scale; TCO follows the RFP, not $115 marketplace math.",
      "value-for-money":
        "Opaque BMC.com pricing plus a ~$115 AppExchange signal is weaker than published Freshservice/TOPdesk floors. Affiliate economics excluded.",
      "ai-capabilities":
        "Helix AI assist is a real 25.x path — scored as assistance, not a reason to skip ServiceNow Now Assist.",
    },
    bestFor: [
      "Remedy-lineage estates moving to Helix ITSM",
      "Enterprise RFP buyers comparing BMC Helix to ServiceNow and Ivanti",
      "ITIL-mature shops that will not self-serve a $19 agent tile",
    ],
    notIdealFor: [
      "SMBs that need Freshservice / TOPdesk / ManageEngine published floors",
      "Teams that want ServiceNow as the default enterprise award",
      "Observability or cloud PaaS purchases",
    ],
    pros: [
      "Helix / Remedy ITSM depth",
      "Strong integrations, admin, and scale",
      "Helix AI assist on current trains",
      "Same-cluster peer of ServiceNow / Ivanti",
      "Clear enterprise ITSM identity",
    ],
    cons: [
      "No BMC.com list — $115 is AppExchange, not a SKU",
      "Does not outrank ServiceNow",
      "Always RFP",
      "Remedy naming confusion",
      "Not observability or PaaS",
    ],
    keyFeatures: [
      "BMC Helix ITSM (Remedy lineage)",
      "Incident, problem, and change",
      "Service catalog / ITIL workflows",
      "Helix AI assistance",
      "Enterprise RFP packaging",
    ],
    whoShouldChoose:
      "Choose BMC Helix ITSM when Helix/Remedy-lineage enterprise ITSM is the job — not ServiceNow by default, and not a published mid-market agent tile.",
    whoShouldConsiderAlternatives:
      "Compare ServiceNow for the enterprise ITSM award path; Ivanti for Neurons-aligned RFPs; Freshservice for published mid-market SKUs.",
    alternativeSlugs: ["servicenow", "ivanti"],
    competitorSlugs: [
      "servicenow",
      "ivanti",
      "freshservice",
      "jira-service-management",
      "topdesk",
    ],
    comparableSlugs: ["servicenow", "ivanti"],
    useCaseSlugs: ["itsm-service-desk"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    teamTypeSlugs: ["it-ops", "operations"],
    sourcesExtra: [
      {
        id: "bmc-helix-itsm",
        url: "https://www.bmc.com/it-solutions/bmc-helix-itsm.html",
        title: "BMC Helix ITSM",
        domains: ["identity", "product-positioning", "features"],
      },
    ],
  },
  {
    slug: "chronosphere",
    name: "Chronosphere",
    company: "Chronosphere, Inc.",
    website: "https://chronosphere.io",
    domain: "chronosphere.io",
    pricingUrl: "https://chronosphere.io",
    aliases: ["Chronosphere Observability", "Chronosphere metrics"],
    membershipRole: "primary",
    jobCluster: "observability-monitoring",
    officialVideos: [],
    softShortDescription:
      "Control-plane observability for high-cardinality Prometheus-class telemetry — contact sales / pilot (typically free 2–3 weeks). Does not outrank Datadog 8.6.",
    shortDescription:
      "Chronosphere is a control-plane observability platform aimed at high-cardinality Prometheus-class metrics (and adjacent traces/logs) at scale — cost and cardinality control rather than a Datadog-style host-module suite as the primary shape. No public list price; buying is contact sales plus a pilot (FAQ typically describes a free 2–3 week proof). Same observability-monitoring cluster as Datadog — Datadog remains the award (8.6); this entity does not outrank it. Distinct from Honeycomb’s high-cardinality event/trace specialist SKU and from Coralogix’s published per-GB rate card.",
    vendorPositioning:
      "Control Prometheus-scale cardinality and cost — a pilot, not a $15/host self-serve tile.",
    pricingModel: "custom",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 14,
    pricingNotes:
      "No first-party public list (2026-08-18). Contact sales. Pilot typically free 2–3 weeks per FAQ (modeled as hasFreeTrial; trialDays 14 is a conservative floor, not a published 14-day SaaS tile). No startingPriceMonthly — do not invent a host/GB floor. Affiliate economics excluded.",
    pricingSummary:
      "Contact sales. No public list. Pilot typically free 2–3 weeks (FAQ). Confirm live packaging on chronosphere.io.",
    plans: [
      {
        kind: "contact-sales",
        slug: "pilot",
        name: "Pilot",
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "Typically free 2–3 week pilot per Chronosphere FAQ — proof, not a published SKU tile.",
      },
      {
        kind: "contact-sales",
        slug: "production",
        name: "Production (contact sales)",
        description:
          "Production observability control plane — custom quote. No public host or GB list.",
      },
    ],
    featureOverrides: {
      ...OBS_FEATURES,
      "infrastructure-monitoring": "supported",
      "apm-tracing": "supported",
      "log-management": "limited",
      "oncall-paging": "limited",
    },
    aiLines: [
      "ITSM AI copilot: limited",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "aws", kind: "native" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Does not outrank Datadog (8.6)",
      "No public list price — do not invent a host or GB floor",
      "Pilot length is FAQ-typical (2–3 weeks), not a published 14-day self-serve tile",
      "Not a Honeycomb-style wide-event specialist as the primary identity",
      "Not ITSM, git, hosting panel, managed hosting, or cloud PaaS",
    ],
    limitationKinds: [
      "other",
      "other",
      "other",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 7,
      "it-job-fit": 9,
      "workflow-depth": 9,
      integrations: 8,
      "admin-security": 8,
      scalability: 9,
      "value-for-money": 7,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Prometheus/control-plane onboarding is heavier than Datadog host tiles; pilots are the try-path. Not a lab test.",
      "it-job-fit":
        "Observability-monitoring — high-cardinality metrics control plane, ranked with Datadog, not ITSM or PaaS.",
      "workflow-depth":
        "Cardinality control, PromQL, and scale workflows are deep; not Datadog’s modular breadth as the product shape.",
      integrations: "Prometheus/Kubernetes plus chat/API cover the SRE stack.",
      "admin-security":
        "Enterprise control-plane governance is adequate; held at 8 versus Datadog’s 9-class admin story.",
      scalability:
        "Built for Prometheus-scale cardinality; this is the buying reason versus SMB observability tiles.",
      "value-for-money":
        "Quote/pilot TCO can beat Datadog module stacking at extreme cardinality — but there is no published floor. Affiliate economics excluded.",
      "ai-capabilities":
        "Observability assist is supporting — not a reason to skip Datadog, and not an LLM suite.",
    },
    bestFor: [
      "SRE teams drowning in Prometheus cardinality who will run a 2–3 week pilot",
      "Buyers comparing Chronosphere control-plane quotes to Datadog module TCO",
      "Estates that already speak PromQL rather than host-map onboarding",
    ],
    notIdealFor: [
      "SMBs that need Datadog’s published $15/host Infrastructure Pro tile",
      "High-cardinality event/trace specialists whose job is Honeycomb",
      "ITSM or cloud PaaS purchases",
    ],
    pros: [
      "Prometheus-scale cardinality control",
      "Pilot path (typically 2–3 weeks)",
      "Clear observability cluster fit",
      "Scale story versus SMB tiles",
      "Same-cluster peer of Datadog / Honeycomb / Coralogix",
    ],
    cons: [
      "Does not outrank Datadog",
      "No public list",
      "Heavier than host-module UX",
      "AI is not the product",
      "Not ITSM or PaaS",
    ],
    keyFeatures: [
      "High-cardinality metrics control plane",
      "Prometheus / Kubernetes native",
      "Cardinality and cost controls",
      "Contact-sales production packaging",
      "Pilot (typically 2–3 weeks)",
    ],
    whoShouldChoose:
      "Choose Chronosphere when Prometheus-scale cardinality control via a pilot/quote is the job — not Datadog host modules by default.",
    whoShouldConsiderAlternatives:
      "Compare Datadog for the observability award path; Honeycomb for high-cardinality events/traces; Coralogix for a published per-GB rate card.",
    alternativeSlugs: ["datadog", "honeycomb"],
    competitorSlugs: [
      "datadog",
      "honeycomb",
      "coralogix",
      "grafana-cloud",
      "dynatrace",
    ],
    comparableSlugs: ["datadog", "honeycomb", "coralogix"],
    useCaseSlugs: ["observability-monitoring"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    teamTypeSlugs: ["engineering", "it-ops"],
    sourcesExtra: [
      {
        id: "chronosphere-home",
        url: "https://chronosphere.io",
        title: "Chronosphere",
        domains: ["identity", "product-positioning", "free-trial"],
      },
    ],
  },
  {
    slug: "coralogix",
    name: "Coralogix",
    company: "Coralogix Ltd.",
    website: "https://coralogix.com",
    domain: "coralogix.com",
    pricingUrl: "https://coralogix.com/pricing/",
    aliases: ["Coralogix Observability", "Coralogix logs"],
    membershipRole: "primary",
    jobCluster: "observability-monitoring",
    officialVideos: [
      {
        videoId: "_ky2hztcwkk",
        title: "20.0 Coralogix Academy - Introduction",
      },
    ],
    softShortDescription:
      "Observability usage rate card — Logs $0.42/GB, Traces $0.16/GB, Metrics $0.06/GB, AI $1.50/1M tokens; 14-day / 8-unit trial. No seat floor. Does not outrank Datadog 8.6.",
    shortDescription:
      "Coralogix is an observability platform (logs, traces, metrics, plus an AI token meter) sold on a published usage rate card rather than a Datadog-style host SKU. First-party pricing: Logs $0.42/GB, Traces $0.16/GB, Metrics $0.06/GB, AI $1.50/1M tokens. Free trial is 14 days / 8 units. No free-forever plan and no published monthly seat floor — do not invent one. Same observability-monitoring cluster as Datadog — Datadog remains the award (8.6); this entity does not outrank it. Distinct from Chronosphere’s quote/pilot control plane and from Honeycomb’s $150 Pro event/trace tile.",
    vendorPositioning:
      "Pay for telemetry on a published per-GB / per-token card — not a host-module suite and not a seat tax.",
    pricingModel: "usage",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 14,
    pricingNotes:
      "Verified 2026-08-18 from coralogix.com/pricing (high confidence). Logs $0.42/GB, Traces $0.16/GB, Metrics $0.06/GB, AI $1.50/1M tokens. 14-day / 8-unit trial. No free forever plan. No published seat floor — startingPriceMonthly omitted on purpose (usage rate card). Commitments via contact sales. Affiliate economics excluded.",
    pricingSummary:
      "Usage rate card: Logs $0.42/GB, Traces $0.16/GB, Metrics $0.06/GB, AI $1.50/1M tokens. 14-day / 8-unit trial. No free plan and no seat floor. Confirm live on coralogix.com/pricing.",
    plans: [
      {
        kind: "contact-sales",
        slug: "payg-rate-card",
        name: "Pay-as-you-go rate card",
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "Published usage: Logs $0.42/GB, Traces $0.16/GB, Metrics $0.06/GB, AI $1.50/1M tokens. No monthly seat floor. 14-day / 8-unit trial.",
      },
      {
        kind: "contact-sales",
        slug: "commitments",
        name: "Committed usage",
        description:
          "Volume commitments and enterprise packaging — contact sales. Not a published monthly seat.",
      },
    ],
    featureOverrides: OBS_FEATURES,
    aiLines: [
      "ITSM AI copilot: limited",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "aws", kind: "native" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Does not outrank Datadog (8.6)",
      "No published seat floor — GB/token math still dominates TCO",
      "14-day / 8-unit trial is not a free forever plan",
      "Not a Chronosphere-style Prometheus control plane as the primary identity",
      "Not ITSM, git, hosting panel, managed hosting, or cloud PaaS",
    ],
    limitationKinds: [
      "other",
      "other",
      "plan-restriction",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "it-job-fit": 8,
      "workflow-depth": 8,
      integrations: 8,
      "admin-security": 7,
      scalability: 8,
      "value-for-money": 8,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Published rate card plus a 14-day / 8-unit trial is easier to try than Chronosphere quotes. Not a lab test.",
      "it-job-fit":
        "Observability-monitoring — logs/traces/metrics peer of Datadog, not ITSM or PaaS.",
      "workflow-depth":
        "Telemetry pipeline plus querying is solid; held at 8 versus Datadog’s modular breadth.",
      integrations: "OpenTelemetry/cloud/chat cover typical SRE ingest.",
      "admin-security":
        "Paid/commit paths add governance; thinner public enterprise-packaging story than Datadog. Held at 7.",
      scalability: "GB/token scale; commitments exist — not unlimited ingest on the trial.",
      "value-for-money":
        "Published per-GB card with no seat floor is a clear specialist story versus Datadog host modules. Affiliate economics excluded.",
      "ai-capabilities":
        "AI is a metered $1.50/1M-token line — scored as supporting assistance, not an award reason versus Datadog.",
    },
    bestFor: [
      "Teams that want a published per-GB observability card instead of host SKUs",
      "Buyers who will spend the 14-day / 8-unit trial before committing",
      "Comparisons versus Datadog modules, Chronosphere quotes, and Honeycomb Pro $150",
    ],
    notIdealFor: [
      "SRE teams buying Datadog infrastructure monitoring as the award path",
      "Prometheus-cardinality control-plane specialists (Chronosphere)",
      "ITSM or cloud PaaS purchases",
    ],
    pros: [
      "Published usage rate card (no seat floor)",
      "14-day / 8-unit trial",
      "Logs, traces, metrics, and metered AI",
      "Clear observability cluster fit",
      "Easier published story than Chronosphere quotes",
    ],
    cons: [
      "Does not outrank Datadog",
      "No free forever plan",
      "GB/token TCO still surprises",
      "Thinner enterprise admin story",
      "Not ITSM or PaaS",
    ],
    keyFeatures: [
      "Logs $0.42/GB",
      "Traces $0.16/GB",
      "Metrics $0.06/GB",
      "AI $1.50/1M tokens",
      "14-day / 8-unit trial",
    ],
    whoShouldChoose:
      "Choose Coralogix when a published per-GB observability rate card is the job — not Datadog host modules by default, and not a Chronosphere RFP.",
    whoShouldConsiderAlternatives:
      "Compare Datadog for the observability award path; Chronosphere for Prometheus cardinality control; Honeycomb for high-cardinality events/traces.",
    alternativeSlugs: ["datadog", "chronosphere"],
    competitorSlugs: [
      "datadog",
      "chronosphere",
      "grafana-cloud",
      "honeycomb",
      "new-relic",
    ],
    comparableSlugs: ["datadog", "chronosphere", "honeycomb"],
    useCaseSlugs: ["observability-monitoring"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering", "it-ops"],
    sourcesExtra: [
      {
        id: "coralogix-pricing",
        url: "https://coralogix.com/pricing/",
        title: "Coralogix pricing",
        domains: ["pricing", "plans", "free-trial", "limits"],
      },
    ],
  },
  {
    slug: "render",
    name: "Render",
    company: "Render Services, Inc.",
    website: "https://render.com",
    domain: "render.com",
    pricingUrl: "https://render.com/pricing",
    aliases: ["Render.com", "Render PaaS", "Render Cloud"],
    membershipRole: "primary",
    jobCluster: "cloud-paas",
    officialVideos: [],
    softShortDescription:
      "Cloud PaaS / app platform — Hobby $0 + compute; Pro $25/mo + compute (production floor); Scale $499; Enterprise custom. Starter web $7/mo. Cluster award.",
    shortDescription:
      "Render is a cloud PaaS / app platform (git-push web services, datastores, cron, and preview environments) — not a managed WordPress host and not a Plesk/cPanel panel licence. Hobby is $0 plus compute. Pro is $25/month plus compute and is the production research floor. Scale is $499/month. Enterprise is custom. Starter web instances publish from $7/month — that is compute, not the Pro workspace floor. Same cloud-paas cluster as Fly.io — Render is the cluster award (7.9); Fly.io is the peer (7.7). Landscape-only versus WP Engine (managed WordPress) and Cloudways (managed VMs).",
    vendorPositioning:
      "Git-push app platform — production teams buy Pro $25 plus compute, not Hobby as a fake floor, and not a WordPress managed-host SKU.",
    pricingModel: "flat",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 25,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from render.com/pricing (high confidence). Hobby $0 + compute; Pro $25/mo + compute (startingPriceMonthly production floor); Scale $499; Enterprise custom. Starter web $7/mo is instance compute — not the workspace floor. Affiliate economics excluded.",
    pricingSummary:
      "Hobby $0 + compute (free plan). Pro from $25/mo + compute (production floor). Scale $499. Enterprise custom. Starter web $7/mo is compute, not the Pro floor. Confirm live on render.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "hobby",
        name: "Hobby",
        description:
          "Hobby $0 workspace + compute. Evaluation / side projects — not the production research floor.",
      },
      {
        kind: "flat-monthly",
        slug: "starter-web",
        name: "Starter web service",
        amount: 7,
        description:
          "$7/mo Starter web instance — compute, not the Pro $25 workspace production floor.",
      },
      {
        kind: "flat-monthly",
        slug: "pro",
        name: "Pro",
        amount: 25,
        highlighted: true,
        description:
          "$25/mo Pro workspace + compute — production research floor on render.com/pricing.",
      },
      {
        kind: "flat-monthly",
        slug: "scale",
        name: "Scale",
        amount: 499,
        description: "$499/mo Scale workspace + compute.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Custom Enterprise Render workspace — contact sales.",
      },
    ],
    featureOverrides: {
      ...PAAS_FEATURES,
      "cloud-paas": "supported",
      "managed-hosting": "limited",
      "cicd-actions": "supported",
    },
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: not-supported",
    ],
    integrations: [
      { integrationSlug: "github", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Starter web $7 is compute — Pro $25 is the production workspace floor",
      "Not managed WordPress hosting (WP Engine) — landscape only",
      "Not a hosting control-panel licence (Plesk/cPanel)",
      "Hobby is not production; compute still meters above the $25 tile",
      "Not ITSM, observability, git host, or a proxy network",
    ],
    limitationKinds: [
      "other",
      "feature-unavailable",
      "feature-unavailable",
      "plan-restriction",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 9,
      "it-job-fit": 9,
      "workflow-depth": 8,
      integrations: 8,
      "admin-security": 7,
      scalability: 8,
      "value-for-money": 9,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Git-push dashboard plus Hobby $0 is the easiest PaaS on-ramp in this pair. Not a lab test.",
      "it-job-fit":
        "Cloud PaaS / app platform — ranked with Fly.io, not WP Engine managed WordPress or Plesk panels. Cluster award.",
      "workflow-depth":
        "Services, datastores, cron, and native Git deploys cover the PaaS job; not a full CI product or Kubernetes control plane.",
      integrations: "GitHub/GitLab native deploys plus API cover the app-platform workflow.",
      "admin-security":
        "Pro/Scale add governance; Hobby is team-grade. Held at 7 versus enterprise clouds.",
      scalability: "Scale $499 plus Enterprise; $25 Pro is not a large-estate Kubernetes story.",
      "value-for-money":
        "Hobby plus published Pro $25 production floor is the sharp PaaS story versus Fly.io PAYG and managed-WP hosts. Affiliate economics excluded.",
      "ai-capabilities":
        "No meaningful ITSM/dev AI copilot — scored low on purpose; PaaS job rarely needs AI scoring depth.",
    },
    bestFor: [
      "Teams that want a git-push app platform with a published Pro $25 production floor",
      "Buyers comparing Render Pro to Fly.io shared-cpu PAYG",
      "Orgs that will treat Hobby as evaluation, not production TCO",
    ],
    notIdealFor: [
      "Teams buying managed WordPress (WP Engine) or managed VMs (Cloudways) — landscape only",
      "Admins buying Plesk/cPanel licences for servers they already own",
      "ITSM or observability purchases",
    ],
    pros: [
      "Cloud PaaS cluster award (7.9)",
      "Hobby free plan + Pro $25 production floor",
      "Native Git deploys",
      "Clear identity vs managed WP / panel licences",
      "Starter web $7 compute documented separately",
    ],
    cons: [
      "Compute still meters above $25",
      "Not managed WordPress",
      "Not a panel licence",
      "AI is not the product",
      "Scale/Enterprise is a large step from Pro",
    ],
    keyFeatures: [
      "Git-push web services",
      "Hobby $0 + compute",
      "Pro $25/mo workspace (production floor)",
      "Scale $499 / Enterprise",
      "Starter web from $7/mo (compute)",
    ],
    whoShouldChoose:
      "Choose Render when a cloud PaaS / app platform with a published Pro $25 floor is the job — not WP Engine managed WordPress, and not Fly.io by default.",
    whoShouldConsiderAlternatives:
      "Compare Fly.io for PAYG microVM/app hosting; Cloudways or WP Engine only on landscape pages for managed hosting; Plesk only for panel licences.",
    alternativeSlugs: ["fly-io", "cloudways"],
    competitorSlugs: ["fly-io", "cloudways", "wp-engine", "kinsta"],
    comparableSlugs: ["fly-io"],
    useCaseSlugs: ["cloud-paas"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering"],
    sourcesExtra: [
      {
        id: "render-pricing",
        url: "https://render.com/pricing",
        title: "Render pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },
  {
    slug: "fly-io",
    name: "Fly.io",
    company: "Fly.io, Inc.",
    website: "https://fly.io",
    domain: "fly.io",
    pricingUrl: "https://fly.io/docs/about/pricing/",
    aliases: ["Fly.io", "Fly io", "flyctl"],
    membershipRole: "primary",
    jobCluster: "cloud-paas",
    officialVideos: [
      {
        videoId: "-gDjLF7x27k",
        title: "N-tier architecture is not your only option.",
      },
    ],
    softShortDescription:
      "Cloud PaaS / microVM app platform — PAYG; shared-cpu-1x from ~$1.94/mo (cheapest regions). Support Standard $29/mo is support, not hosting. Does not outrank Render 7.9.",
    shortDescription:
      "Fly.io is a cloud PaaS / app platform that runs apps close to users on Firecracker microVMs — git/CLI deploy, not a managed WordPress host and not a panel licence. Pricing is pay-as-you-go. shared-cpu-1x publishes around $1.94–$2.02/month depending on region; startingPriceMonthly $1.94 is the cheapest listed-region floor. Support Standard at $29/month is a support SKU, not hosting — do not use it as the Fly.io floor. Legacy free allowances are not for new accounts. A free trial exists. Same cloud-paas cluster as Render — Render remains the award (7.9); this entity does not outrank it. Landscape-only versus Cloudways managed VMs.",
    vendorPositioning:
      "Run apps on microVMs near users — PAYG compute is the SKU; $29 Support is not hosting.",
    pricingModel: "usage",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 1.94,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from fly.io/docs/about/pricing (high confidence). PAYG. shared-cpu-1x ~$1.94–$2.02/mo by region; startingPriceMonthly $1.94 is the cheapest listed-region floor. Support Standard $29/mo is support, not hosting. Legacy free allowance is not for new accounts (hasFreePlan false). Free trial exists. Affiliate economics excluded.",
    pricingSummary:
      "Pay-as-you-go. shared-cpu-1x from ~$1.94/mo (cheapest listed regions). Support Standard $29/mo is support, not hosting. No free plan for new accounts. Free trial. Confirm live on fly.io/docs/about/pricing.",
    plans: [
      {
        kind: "flat-monthly",
        slug: "shared-cpu-1x",
        name: "shared-cpu-1x (cheapest regions)",
        amount: 1.94,
        highlighted: true,
        hasFreeTrial: true,
        description:
          "~$1.94/mo shared-cpu-1x in cheapest listed regions ($1.94–$2.02 by region). Hosting floor, not Support.",
      },
      {
        kind: "flat-monthly",
        slug: "support-standard",
        name: "Support Standard",
        amount: 29,
        description:
          "$29/mo Support Standard — support SKU, not hosting. Do not treat as the Fly.io floor.",
      },
      {
        kind: "contact-sales",
        slug: "payg",
        name: "Pay-as-you-go compute",
        description:
          "Machines, volumes, and bandwidth meter beyond the shared-cpu-1x floor. Confirm live fly.io pricing.",
      },
    ],
    featureOverrides: {
      ...PAAS_FEATURES,
      "cloud-paas": "supported",
      "managed-hosting": "limited",
      "cicd-actions": "limited",
    },
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: not-supported",
    ],
    integrations: [
      { integrationSlug: "github", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Does not outrank Render (7.9) as the cloud-paas award",
      "Support Standard $29/mo is support — not the hosting floor",
      "Legacy free allowance is not available to new accounts",
      "Not managed WordPress (WP Engine) or managed VMs (Cloudways) — landscape vs Cloudways",
      "Not ITSM, observability, a git host, or a panel licence",
    ],
    limitationKinds: [
      "other",
      "other",
      "plan-restriction",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 7,
      "it-job-fit": 9,
      "workflow-depth": 8,
      integrations: 8,
      "admin-security": 7,
      scalability: 9,
      "value-for-money": 8,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "flyctl + region/machine model is more DIY than Render’s git-push dashboard. Not a lab test.",
      "it-job-fit":
        "Cloud PaaS / app platform — ranked with Render, not Cloudways managed VMs or WP Engine.",
      "workflow-depth":
        "Machines, volumes, and anycast-style deploy are deep for the PaaS job; CI is limited versus Render’s native Git deploys.",
      integrations: "GitHub/API cover deploy; thinner dashboard marketplace than Render.",
      "admin-security":
        "Org/network controls exist; product-led vs enterprise-cloud governance. Held at 7.",
      scalability:
        "Global microVM placement is the scale story versus Render Pro $25 — scored 9.",
      "value-for-money":
        "Published ~$1.94 shared-cpu-1x floor is sharp PAYG; Support $29 is extra and must not be the floor. Affiliate economics excluded.",
      "ai-capabilities":
        "No meaningful ITSM/dev AI copilot — scored low on purpose.",
    },
    bestFor: [
      "Teams that want PAYG microVM/app hosting close to users",
      "Buyers comparing Fly.io $1.94 shared-cpu-1x to Render Pro $25 + compute",
      "Orgs that will not treat $29 Support as the hosting SKU",
    ],
    notIdealFor: [
      "Teams that want Render’s simpler git-push dashboard as the default award path",
      "Managed WordPress or Cloudways VM buyers (landscape)",
      "ITSM or observability purchases",
    ],
    pros: [
      "PAYG shared-cpu-1x from ~$1.94/mo",
      "Global microVM placement / scale",
      "Free trial",
      "Clear PaaS identity vs managed WP",
      "Support SKU documented separately from hosting",
    ],
    cons: [
      "Does not outrank Render",
      "Harder onboarding than Render",
      "No free plan for new accounts",
      "Easy to confuse $29 Support with hosting",
      "AI is not the product",
    ],
    keyFeatures: [
      "Firecracker microVM app platform",
      "shared-cpu-1x from ~$1.94/mo",
      "Pay-as-you-go machines and bandwidth",
      "Free trial (no new-account free plan)",
      "Support Standard $29/mo (support, not hosting)",
    ],
    whoShouldChoose:
      "Choose Fly.io when PAYG microVM/app hosting is the job — not Render by default, and not Cloudways managed VMs.",
    whoShouldConsiderAlternatives:
      "Compare Render for the cloud-paas award path; Cloudways only on landscape pages for managed VMs; WP Engine for managed WordPress.",
    alternativeSlugs: ["render", "cloudways"],
    competitorSlugs: ["render", "cloudways", "wp-engine"],
    comparableSlugs: ["render"],
    useCaseSlugs: ["cloud-paas"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering"],
    sourcesExtra: [
      {
        id: "fly-io-pricing",
        url: "https://fly.io/docs/about/pricing/",
        title: "Fly.io pricing",
        domains: ["pricing", "plans", "free-trial", "limits"],
      },
    ],
  },
];

export const PRODUCTS = COMPACT.map(expandItProduct);

export const COMPARISON_PAIRS = [
  ["topdesk", "freshservice"],
  ["topdesk", "haloitsm"],
  ["ivanti", "servicenow"],
  ["bmc-helix", "servicenow"],
  ["ivanti", "bmc-helix"],
  ["chronosphere", "datadog"],
  ["coralogix", "datadog"],
  ["chronosphere", "honeycomb"],
  ["render", "fly-io"],
  ["render", "wp-engine"],
  ["fly-io", "cloudways"],
];
