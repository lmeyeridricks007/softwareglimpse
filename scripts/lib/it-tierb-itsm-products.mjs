/**
 * IT Tier-B + ITSM SMB (compact).
 * manageengine-servicedesk-plus, sysaid, haloitsm, appdynamics, honeycomb,
 * firehydrant, rootly, buildkite, siteground, zyte, iproyal.
 *
 * Pricing grounded 2026-08-18 from first-party pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 *
 * ServiceNow (8.7) / Freshservice (8.4) remain the ITSM awards — do not outrank.
 * Datadog (8.6) remains the observability-monitoring award.
 * PagerDuty (8.0) remains the incident-oncall award.
 * GitHub (9.1) remains the source-control-devops award.
 * WP Engine (7.7) remains the hosting-providers award.
 * Bright Data (7.7) remains the web-data-collection award.
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
  "proxy-network": "not-supported",
  "itsm-ai": "limited",
  "dev-ai": "limited",
  "oncall-paging": "limited",
  "enterprise-security": "supported",
  "analytics-reporting": "supported",
};

const HONEYCOMB_FEATURES = {
  ...OBS_FEATURES,
  "infrastructure-monitoring": "limited",
  "apm-tracing": "supported",
  "log-management": "limited",
  "oncall-paging": "not-supported",
  "enterprise-security": "limited",
  "managed-hosting": "not-supported",
};

const INCIDENT_FEATURES = {
  "incident-management": "supported",
  "change-problem": "limited",
  "service-catalog": "not-supported",
  "infrastructure-monitoring": "limited",
  "apm-tracing": "not-supported",
  "log-management": "not-supported",
  "source-control": "not-supported",
  "cicd-actions": "limited",
  "hosting-panel": "not-supported",
  "managed-hosting": "not-supported",
  "proxy-network": "not-supported",
  "itsm-ai": "limited",
  "dev-ai": "limited",
  "oncall-paging": "add-on",
  "enterprise-security": "limited",
  "analytics-reporting": "supported",
};

const CICD_FEATURES = {
  "incident-management": "not-supported",
  "change-problem": "not-supported",
  "service-catalog": "not-supported",
  "infrastructure-monitoring": "not-supported",
  "apm-tracing": "not-supported",
  "log-management": "limited",
  "source-control": "not-supported",
  "cicd-actions": "supported",
  "hosting-panel": "not-supported",
  "managed-hosting": "not-supported",
  "proxy-network": "not-supported",
  "itsm-ai": "not-supported",
  "dev-ai": "limited",
  "oncall-paging": "not-supported",
  "enterprise-security": "limited",
  "analytics-reporting": "supported",
};

const MANAGED_HOSTING_FEATURES = {
  "incident-management": "not-supported",
  "change-problem": "not-supported",
  "service-catalog": "not-supported",
  "infrastructure-monitoring": "limited",
  "apm-tracing": "not-supported",
  "log-management": "limited",
  "source-control": "not-supported",
  "cicd-actions": "limited",
  "hosting-panel": "limited",
  "managed-hosting": "supported",
  "proxy-network": "not-supported",
  "itsm-ai": "not-supported",
  "dev-ai": "limited",
  "oncall-paging": "not-supported",
  "enterprise-security": "limited",
  "analytics-reporting": "limited",
};

const PROXY_FEATURES = {
  "incident-management": "not-supported",
  "change-problem": "not-supported",
  "service-catalog": "not-supported",
  "infrastructure-monitoring": "not-supported",
  "apm-tracing": "not-supported",
  "log-management": "not-supported",
  "source-control": "not-supported",
  "cicd-actions": "limited",
  "hosting-panel": "not-supported",
  "managed-hosting": "not-supported",
  "proxy-network": "supported",
  "itsm-ai": "not-supported",
  "dev-ai": "limited",
  "oncall-paging": "not-supported",
  "enterprise-security": "limited",
  "analytics-reporting": "supported",
};

const COMPACT = [
  {
    slug: "manageengine-servicedesk-plus",
    name: "ManageEngine ServiceDesk Plus",
    company: "Zoho Corporation / ManageEngine",
    website: "https://www.manageengine.com/products/service-desk/",
    domain: "manageengine.com",
    pricingUrl: "https://www.manageengine.com/products/service-desk/pricing.html",
    aliases: [
      "ServiceDesk Plus",
      "ManageEngine SDP",
      "SDP Cloud",
      "Zoho ManageEngine ServiceDesk Plus",
    ],
    membershipRole: "primary",
    jobCluster: "itsm-service-desk",
    softShortDescription:
      "SMB/mid-market ITSM — Cloud Standard from $13/technician/mo; free up to 5 techs Standard; Professional $27; Enterprise $67; 30-day trial. Does not outrank ServiceNow 8.7 / Freshservice 8.4.",
    shortDescription:
      "ManageEngine ServiceDesk Plus is Zoho/ManageEngine’s ITSM and employee service desk (incidents, problems, changes, assets, catalog) aimed at SMB and mid-market IT. Cloud Standard publishes from $13/technician/month; a Standard path is free up to 5 technicians; Professional $27; Enterprise $67. 30-day trial. Same itsm-service-desk cluster as ServiceNow and Freshservice — ServiceNow remains the enterprise award (8.7) and Freshservice the published mid-market award (8.4); this entity does not outrank either. Distinct from ServiceNow Now Platform ESM and from Freshservice’s Freshworks SKU.",
    vendorPositioning:
      "Published-price ITSM for internal IT — technician SKUs without a ServiceNow RFP, and without Freshworks as the default desk.",
    pricingModel: "per-seat",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 30,
    startingPriceMonthly: 13,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from manageengine.com ServiceDesk Plus pricing (high confidence). Cloud Standard from $13/technician/mo; free up to 5 technicians on Standard; Professional $27; Enterprise $67; 30-day trial. Technician math still stacks. Affiliate economics excluded.",
    pricingSummary:
      "Free Standard up to 5 technicians. Cloud Standard from $13/technician/mo. Professional $27. Enterprise $67. 30-day trial. Confirm live on ManageEngine ServiceDesk Plus pricing.",
    plans: [
      {
        kind: "free",
        slug: "standard-free-5",
        name: "Standard (free up to 5 techs)",
        limits: ["Up to 5 technicians"],
        description:
          "Free Standard path up to 5 technicians — evaluation / tiny IT desks, not unlimited Enterprise.",
      },
      {
        kind: "per-seat-monthly",
        slug: "cloud-standard",
        name: "Cloud Standard",
        amount: 13,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 30,
        description:
          "$13/technician/mo Cloud Standard floor — published SMB ITSM entry. 30-day trial.",
      },
      {
        kind: "per-seat-monthly",
        slug: "professional",
        name: "Professional",
        amount: 27,
        description: "$27/technician/mo Professional — broader ITSM/asset depth than Standard.",
      },
      {
        kind: "per-seat-monthly",
        slug: "enterprise",
        name: "Enterprise",
        amount: 67,
        description: "$67/technician/mo Enterprise — highest published Cloud ITSM pack on this ladder.",
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
      { integrationSlug: "jira", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Does not outrank ServiceNow (8.7) or Freshservice (8.4)",
      "Enterprise $67 is a large step vs the $13 Standard floor — module depth gates by edition",
      "Zoho/ManageEngine family sprawl (Endpoint, AD, etc.) is adjacent, not this SKU",
      "ITSM AI is assistance, not Now Assist / Freddy as a buying reason",
      "Not observability, git, hosting panel, or managed hosting",
    ],
    limitationKinds: [
      "other",
      "plan-restriction",
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
      scalability: 7,
      "value-for-money": 9,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Published Cloud Standard plus a 5-tech free path is approachable for SMB IT; less polished than Freshservice’s modern agent UX. Not a lab test.",
      "it-job-fit":
        "ITSM / employee service desk — ranked with ServiceNow and Freshservice, not Datadog or GitHub. Held at 8 versus Freshservice’s 9.",
      "workflow-depth":
        "Incident/problem/change/catalog/asset cover a real ITIL loop; edition gates keep it below ServiceNow CMDB estates.",
      integrations: "Slack/Teams/Jira/API cover typical mid-market IT stacks — not ServiceNow’s enterprise graph.",
      "admin-security":
        "Enterprise edition and Zoho/ManageEngine admin posture are adequate; not Now Platform domain separation.",
      scalability:
        "Technician ladder to Enterprise $67; held at 7 versus ServiceNow global fulfiller scale.",
      "value-for-money":
        "Published $13 Standard plus free 5-tech path is the sharpest ITSM floor here. Affiliate economics excluded.",
      "ai-capabilities":
        "Zia/copilot-style ITSM assist exists — scored as supporting, not a reason to skip Freshservice Freddy or Now Assist.",
    },
    bestFor: [
      "SMB/mid-market IT teams that want a published $13/technician ITSM SKU",
      "Zoho/ManageEngine-aligned shops that need incidents, changes, and assets without a ServiceNow RFP",
      "Buyers who will actually use the 5-tech free Standard path before paid Cloud",
    ],
    notIdealFor: [
      "Enterprises standardising on ServiceNow CMDB + ESM",
      "Teams that want Freshservice’s simpler published mid-market UX as the default award path",
      "SRE observability or git-host purchases",
    ],
    pros: [
      "Published Cloud Standard $13/technician floor",
      "Free Standard up to 5 technicians",
      "Professional $27 and Enterprise $67 ladder",
      "30-day trial",
      "Clear ITSM identity vs observability/git/hosting",
    ],
    cons: [
      "Does not outrank ServiceNow or Freshservice",
      "Edition gates for deeper ITSM",
      "AI is not the buying reason",
      "ManageEngine family SKU confusion",
      "Not observability or git",
    ],
    keyFeatures: [
      "Incident, problem, and change management",
      "Service catalog and assets",
      "Cloud Standard from $13/technician/mo",
      "Free up to 5 technicians",
      "30-day trial",
    ],
    whoShouldChoose:
      "Choose ManageEngine ServiceDesk Plus when published SMB/mid-market ITSM is the job — not ServiceNow by default, and not Freshservice by default.",
    whoShouldConsiderAlternatives:
      "Compare Freshservice for the published mid-market award path; Jira Service Management if you already live in Jira Cloud; ServiceNow for enterprise ESM.",
    alternativeSlugs: ["freshservice", "jira-service-management"],
    competitorSlugs: [
      "servicenow",
      "jira-service-management",
      "freshservice",
      "sysaid",
      "haloitsm",
    ],
    comparableSlugs: ["freshservice", "jira-service-management", "sysaid"],
    useCaseSlugs: ["itsm-service-desk"],
    businessSizeSlugs: ["small-business", "mid-market"],
    teamTypeSlugs: ["it-ops", "operations"],
    sourcesExtra: [
      {
        id: "sdp-pricing",
        url: "https://www.manageengine.com/products/service-desk/pricing.html",
        title: "ManageEngine ServiceDesk Plus pricing",
        domains: ["pricing", "plans", "free-plan", "free-trial", "limits"],
      },
    ],
  },
  {
    slug: "sysaid",
    name: "SysAid",
    company: "SysAid Technologies Ltd.",
    website: "https://www.sysaid.com",
    domain: "sysaid.com",
    pricingUrl: "https://www.sysaid.com/pricing",
    aliases: ["SysAid ITSM", "SysAid Service Desk"],
    membershipRole: "primary",
    jobCluster: "itsm-service-desk",
    softShortDescription:
      "ITSM / service desk — Professional published ~$89/agent/mo (medium confidence; quote-led page); Enterprise custom min 20 agents; free trial. Does not outrank ServiceNow 8.7 / Freshservice 8.4.",
    shortDescription:
      "SysAid is an ITSM and employee service-desk platform (incidents, requests, assets, automation) for internal IT. The first-party pricing page is quote-led; 2026 listings commonly cite Professional around $89/agent/month — treat as medium-confidence, not a self-serve tile with Freshservice’s certainty. Enterprise is custom with a published 20-agent minimum. Free trial. Same itsm-service-desk cluster as ServiceNow and Freshservice — this entity does not outrank ServiceNow 8.7 or Freshservice 8.4. Distinct from HaloITSM’s all-in-one UK calculator and from ManageEngine’s $13 Standard floor.",
    vendorPositioning:
      "ITSM for internal IT teams that want SysAid’s service-desk and automation suite — expect a quote, not a $19 Starter sticker.",
    pricingModel: "per-seat",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 89,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Researched 2026-08-18 from sysaid.com/pricing (medium confidence — page is quote-led). 2026 listings cite Professional ~$89/agent/mo. Enterprise custom, minimum 20 agents. Free trial. Confirm live quote. Affiliate economics excluded.",
    pricingSummary:
      "No free plan. Professional ~$89/agent/mo (medium confidence; quote-led). Enterprise custom (min 20 agents). Free trial. Confirm live on sysaid.com/pricing.",
    plans: [
      {
        kind: "per-seat-monthly",
        slug: "professional",
        name: "Professional",
        amount: 89,
        highlighted: true,
        hasFreeTrial: true,
        description:
          "~$89/agent/mo Professional — medium-confidence listing price; first-party page is quote-led. Confirm live.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        limits: ["Minimum 20 agents"],
        description:
          "Enterprise custom quote — published minimum 20 agents. Not the ~$89 Professional listing.",
      },
    ],
    featureOverrides: {
      ...ITSM_FEATURES,
      "itsm-ai": "supported",
      "oncall-paging": "limited",
    },
    aiLines: [
      "ITSM AI copilot: supported",
      "Developer AI copilot: not-supported",
      "AI automation: limited",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Pricing page is quote-led — $89 Professional is medium-confidence, not Freshservice Starter certainty",
      "Does not outrank ServiceNow (8.7) or Freshservice (8.4)",
      "Enterprise minimum 20 agents is a buying-motion trap for tiny desks",
      "No published free plan",
      "Not observability, git, hosting panel, or managed hosting",
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
      "admin-security": 8,
      scalability: 7,
      "value-for-money": 7,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Service-desk UX is approachable for internal IT; quote-led buying is the friction versus ManageEngine’s published $13. Not a lab test.",
      "it-job-fit":
        "ITSM cluster peer of Freshservice/HaloITSM — not an observability or git product.",
      "workflow-depth":
        "Incidents, requests, assets, and automation cover a solid desk loop; below ServiceNow ITIL/CMDB ceiling.",
      integrations: "Slack/Teams/API cover typical IT ops; thinner public marketplace than Atlassian.",
      "admin-security":
        "Paid/Enterprise admin is adequate for mid-market desks; not Now Platform governance.",
      scalability:
        "Enterprise min 20 agents plus custom quote; held at 7 versus ServiceNow scale.",
      "value-for-money":
        "~$89 Professional is a weaker published story than ManageEngine $13 or Freshservice $19 — medium confidence on the sticker. Affiliate economics excluded.",
      "ai-capabilities":
        "SysAid Copilot-style ITSM assist is a real path — scored as assistance, not an award reason versus Freshservice.",
    },
    bestFor: [
      "Mid-market IT desks comparing SysAid automation to Freshservice Growth/Pro",
      "Buyers who will run a trial and get a live quote rather than trust $89 listings",
      "Teams that need 20+ agents and will talk Enterprise anyway",
    ],
    notIdealFor: [
      "SMBs that need a high-confidence $13–$19 published technician/agent floor",
      "Enterprise ESM / CMDB (ServiceNow)",
      "Observability or git purchases",
    ],
    pros: [
      "ITSM + automation in one desk",
      "Copilot-style ITSM AI assist",
      "Free trial",
      "Enterprise path with 20-agent minimum (clear)",
      "Same-cluster peer of Freshservice / HaloITSM",
    ],
    cons: [
      "Quote-led pricing (medium confidence on $89)",
      "Does not outrank ServiceNow or Freshservice",
      "No free plan",
      "Weaker value vs ManageEngine $13",
      "Not observability/git/hosting",
    ],
    keyFeatures: [
      "IT service desk / incidents",
      "Asset and request workflows",
      "Automation",
      "ITSM AI copilot",
      "Enterprise (min 20 agents)",
    ],
    whoShouldChoose:
      "Choose SysAid when a quoted ITSM desk with automation/AI assist is the job — not Freshservice’s published Starter by default, and not ServiceNow.",
    whoShouldConsiderAlternatives:
      "Compare ManageEngine ServiceDesk Plus for a $13 published floor; Freshservice for the mid-market award path; HaloITSM for all-in-one UK calculator packaging.",
    alternativeSlugs: ["manageengine-servicedesk-plus", "freshservice"],
    competitorSlugs: [
      "manageengine-servicedesk-plus",
      "freshservice",
      "jira-service-management",
      "haloitsm",
      "servicenow",
    ],
    comparableSlugs: ["freshservice", "haloitsm", "manageengine-servicedesk-plus"],
    useCaseSlugs: ["itsm-service-desk"],
    businessSizeSlugs: ["small-business", "mid-market"],
    teamTypeSlugs: ["it-ops", "operations"],
    sourcesExtra: [
      {
        id: "sysaid-pricing",
        url: "https://www.sysaid.com/pricing",
        title: "SysAid pricing",
        domains: ["pricing", "plans", "free-trial", "limits"],
      },
    ],
  },
  {
    slug: "haloitsm",
    name: "HaloITSM",
    company: "Halo Service Solutions Ltd.",
    website: "https://haloitsm.com",
    domain: "haloitsm.com",
    pricingUrl: "https://haloitsm.com/pricing/",
    aliases: ["Halo", "Halo ITSM", "usehalo.com", "Halo Service Solutions"],
    membershipRole: "primary",
    jobCluster: "itsm-service-desk",
    softShortDescription:
      "All-in-one ITSM — first-party UK calculator ~£66/agent/mo annual; onboarding packages extra. Does not outrank ServiceNow 8.7 / Freshservice 8.4.",
    shortDescription:
      "HaloITSM (Halo) is an all-in-one ITSM / employee service-desk platform (incidents, requests, assets, and adjacent PSA-style packaging) from Halo Service Solutions. The first-party UK pricing calculator shows about £66/agent/month billed annually as the published all-in-one floor — treat as GBP, not a USD list. Onboarding packages are extra. Same itsm-service-desk cluster as ServiceNow and Freshservice — this entity does not outrank ServiceNow 8.7 or Freshservice 8.4. Distinct from SysAid’s quote-led ~$89 listing and from ManageEngine’s $13 Standard floor.",
    vendorPositioning:
      "All-in-one ITSM per agent — one calculator number, with onboarding sold separately.",
    pricingModel: "per-seat",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 66,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from haloitsm.com/pricing UK calculator (high confidence on £66/agent/mo annual). startingPriceMonthly 66 is GBP from that calculator — not a USD list price. Onboarding packages extra. Affiliate economics excluded.",
    pricingSummary:
      "No free plan. All-in-one from ~£66/agent/mo annual (GBP; UK calculator). Onboarding packages extra. Confirm live on haloitsm.com/pricing.",
    plans: [
      {
        kind: "per-seat-annual",
        slug: "all-in-one",
        name: "All-in-one (per agent)",
        amount: 66,
        highlighted: true,
        description:
          "~£66/agent/mo billed annually on the first-party UK calculator — GBP, not USD. Onboarding packages are extra.",
      },
      {
        kind: "contact-sales",
        slug: "onboarding",
        name: "Onboarding packages",
        description:
          "Implementation / onboarding packages sold separately — not included in the £66 agent floor.",
      },
    ],
    featureOverrides: {
      ...ITSM_FEATURES,
      "itsm-ai": "limited",
      "oncall-paging": "supported",
    },
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
      "£66 calculator floor is GBP — do not treat as a USD $66 list",
      "Onboarding packages stack on the agent SKU",
      "Does not outrank ServiceNow (8.7) or Freshservice (8.4)",
      "No published free plan",
      "Not observability, git, hosting panel, or managed hosting",
    ],
    limitationKinds: [
      "other",
      "requires-add-on",
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
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "All-in-one per-agent packaging is easier to model than SysAid quotes; UK calculator is the learning tax for USD buyers. Not a lab test.",
      "it-job-fit":
        "ITSM / service desk — same cluster as Freshservice and ManageEngine ServiceDesk Plus, not a PSA-only or observability SKU.",
      "workflow-depth":
        "All-in-one ITSM (and adjacent PSA-style) workflows are deep for the job; still below ServiceNow CMDB/ESM.",
      integrations: "Slack/Teams/API cover typical desks; Halo marketplace is not Atlassian’s.",
      "admin-security":
        "Paid all-in-one admin is solid for mid-market; not ServiceNow domain separation.",
      scalability:
        "Per-agent annual ladder plus onboarding; held at 8, below ServiceNow’s 10.",
      "value-for-money":
        "Published £66 annual calculator is clearer than SysAid quotes; GBP vs USD and onboarding extras are the TCO catch. Affiliate economics excluded.",
      "ai-capabilities":
        "Halo AI assist exists — scored as supporting, not a reason to skip Freshservice or ServiceNow.",
    },
    bestFor: [
      "IT teams that want an all-in-one per-agent ITSM calculator rather than edition ladders",
      "UK/GBP buyers who will model £66 annual plus onboarding",
      "Desks comparing HaloITSM to SysAid quotes and ManageEngine $13 Standard",
    ],
    notIdealFor: [
      "USD SMBs that need ManageEngine’s $13 published floor without FX conversion",
      "Enterprises buying ServiceNow ESM",
      "Observability or git purchases",
    ],
    pros: [
      "First-party UK calculator (~£66/agent annual)",
      "All-in-one per-agent packaging",
      "Clear ITSM cluster fit",
      "On-call adjacency in the all-in-one story",
      "Stronger published story than SysAid quotes",
    ],
    cons: [
      "GBP not USD",
      "Onboarding extra",
      "Does not outrank ServiceNow or Freshservice",
      "No free plan",
      "Not observability/git/hosting",
    ],
    keyFeatures: [
      "All-in-one ITSM per agent",
      "Incident and request management",
      "Assets / catalog (packaging-dependent)",
      "UK calculator ~£66/agent/mo annual",
      "Onboarding packages (extra)",
    ],
    whoShouldChoose:
      "Choose HaloITSM when all-in-one per-agent ITSM with a published UK calculator is the job — not ServiceNow by default, and not Freshservice by default.",
    whoShouldConsiderAlternatives:
      "Compare ManageEngine ServiceDesk Plus for a USD $13 floor; Freshservice for the mid-market award path; SysAid if you prefer that automation suite.",
    alternativeSlugs: ["manageengine-servicedesk-plus", "freshservice"],
    competitorSlugs: [
      "manageengine-servicedesk-plus",
      "sysaid",
      "freshservice",
      "jira-service-management",
      "servicenow",
    ],
    comparableSlugs: ["sysaid", "manageengine-servicedesk-plus", "freshservice"],
    useCaseSlugs: ["itsm-service-desk"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["it-ops", "operations"],
    sourcesExtra: [
      {
        id: "haloitsm-pricing",
        url: "https://haloitsm.com/pricing/",
        title: "HaloITSM pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "appdynamics",
    name: "AppDynamics",
    company: "Cisco Systems, Inc. / AppDynamics",
    website: "https://www.appdynamics.com",
    domain: "appdynamics.com",
    pricingUrl: "https://www.appdynamics.com/pricing",
    aliases: ["AppD", "Cisco AppDynamics", "AppDynamics Observability"],
    membershipRole: "primary",
    jobCluster: "observability-monitoring",
    softShortDescription:
      "Cisco APM / observability — Infrastructure from ~$6/vCPU/mo; Premium (infra+apps) from $33/vCPU/mo annual; Enterprise $50/vCPU; often Cisco EA quote. Does not outrank Datadog 8.6.",
    shortDescription:
      "AppDynamics is Cisco’s application-performance and observability platform (APM, infra, business iQ). Observability Cloud-style public list: Infrastructure from about $6/vCPU/month; Premium (infrastructure plus applications) from $33/vCPU/month billed annually; Enterprise $50/vCPU. startingPriceMonthly $33 is the APM-relevant Premium floor — not the $6 infra-only tile. Buying is often a Cisco Enterprise Agreement quote. Same observability-monitoring cluster as Datadog — Datadog remains the award (8.6); this entity does not outrank it. Distinct from Honeycomb’s high-cardinality event/trace specialist SKU.",
    vendorPositioning:
      "Cisco APM for application and infrastructure telemetry — vCPU packs, often inside a Cisco EA, not a Datadog $15/host self-serve tile.",
    pricingModel: "usage",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 33,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Researched 2026-08-18 from appdynamics.com/pricing (medium confidence). Infrastructure ~$6/vCPU/mo; Premium (infra+apps) from $33/vCPU/mo annual; Enterprise $50/vCPU. startingPriceMonthly $33 is the APM-relevant floor. Often Cisco EA quote. Affiliate economics excluded.",
    pricingSummary:
      "No free plan. Infrastructure from ~$6/vCPU/mo. Premium (infra+apps) from $33/vCPU/mo annual. Enterprise $50/vCPU. Often Cisco EA. Confirm live on appdynamics.com/pricing.",
    plans: [
      {
        kind: "per-host-annual",
        slug: "infrastructure",
        name: "Infrastructure (per vCPU)",
        amount: 6,
        description:
          "~$6/vCPU/mo infrastructure — not the APM-relevant research floor. Unit is vCPU, modeled as host-priced usage.",
      },
      {
        kind: "per-host-annual",
        slug: "premium",
        name: "Premium (infra + apps)",
        amount: 33,
        highlighted: true,
        description:
          "$33/vCPU/mo billed annually — APM-relevant Premium floor (infra+apps). Often sold inside Cisco EA.",
      },
      {
        kind: "per-host-annual",
        slug: "enterprise",
        name: "Enterprise (per vCPU)",
        amount: 50,
        description: "$50/vCPU Enterprise pack on published Observability Cloud-style list.",
      },
      {
        kind: "contact-sales",
        slug: "cisco-ea",
        name: "Cisco Enterprise Agreement",
        description: "Many estates buy AppDynamics inside a Cisco EA quote — not the $33 vCPU tile alone.",
      },
    ],
    featureOverrides: OBS_FEATURES,
    aiLines: [
      "ITSM AI copilot: limited",
      "Developer AI copilot: limited",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "aws", kind: "native" },
      { integrationSlug: "azure", kind: "native" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Does not outrank Datadog (8.6)",
      "$6/vCPU Infrastructure is not the APM-relevant floor — Premium $33 is",
      "Cisco EA quotes often replace public vCPU tiles",
      "Medium pricing confidence versus Datadog’s published host SKU",
      "Not ITSM, git, hosting panel, or managed hosting",
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
      "workflow-depth": 8,
      integrations: 8,
      "admin-security": 9,
      scalability: 9,
      "value-for-money": 6,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Enterprise APM plus Cisco SKU/EA confusion is heavier than Datadog host tiles. Not a lab test.",
      "it-job-fit":
        "Full-stack APM/observability — ranked with Datadog and Dynatrace, not PagerDuty or ServiceNow.",
      "workflow-depth":
        "APM plus infra packs are deep; held at 8 versus Datadog’s modular breadth and Dynatrace DPS.",
      integrations: "Cloud, Cisco, and chat hooks are a published AppDynamics story.",
      "admin-security":
        "Cisco enterprise security posture is a buying reason versus SMB observability tiles.",
      scalability: "vCPU packs and Cisco EA estates scale; TCO follows vCPU and Premium vs Enterprise.",
      "value-for-money":
        "$33/vCPU Premium is well above Datadog’s $15/host infra tile; EA opacity cuts value. Affiliate economics excluded.",
      "ai-capabilities":
        "Observability AI assist exists — scored as supporting, not a reason to skip Datadog.",
    },
    bestFor: [
      "Cisco-aligned estates that will model vCPU Premium $33 (not $6 infra-only) as APM TCO",
      "APM buyers comparing AppDynamics to Dynatrace DPS and Datadog modules",
      "Teams already in a Cisco EA who will not self-serve Datadog tiles",
    ],
    notIdealFor: [
      "SMBs that need Datadog’s published $15/host Infrastructure Pro tile",
      "High-cardinality event specialists (Honeycomb)",
      "ITSM or on-call-only purchases",
    ],
    pros: [
      "Cisco APM / observability identity",
      "Published Premium $33/vCPU APM-relevant floor",
      "Infrastructure $6/vCPU and Enterprise $50 ladder",
      "Enterprise admin-security posture",
      "Clear cluster fit vs ITSM/git",
    ],
    cons: [
      "Does not outrank Datadog",
      "Easy to confuse $6 infra with $33 Premium",
      "Cisco EA opacity",
      "Medium pricing confidence",
      "Not ITSM/git/hosting",
    ],
    keyFeatures: [
      "Application performance monitoring",
      "Infrastructure monitoring (vCPU)",
      "Premium infra+apps pack",
      "Cisco EA path",
      "Cloud integrations",
    ],
    whoShouldChoose:
      "Choose AppDynamics when Cisco vCPU-priced APM (Premium $33, not $6 infra) is the job — not Datadog host modules by default.",
    whoShouldConsiderAlternatives:
      "Compare Datadog for the observability award path; Dynatrace for DPS full-stack; Honeycomb for high-cardinality traces.",
    alternativeSlugs: ["datadog", "dynatrace"],
    competitorSlugs: ["datadog", "dynatrace", "new-relic", "splunk", "honeycomb"],
    comparableSlugs: ["datadog", "dynatrace", "new-relic"],
    useCaseSlugs: ["observability-monitoring"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    teamTypeSlugs: ["engineering", "it-ops"],
    sourcesExtra: [
      {
        id: "appdynamics-pricing",
        url: "https://www.appdynamics.com/pricing",
        title: "AppDynamics pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "honeycomb",
    name: "Honeycomb",
    company: "Honeycomb.io, Inc.",
    website: "https://www.honeycomb.io",
    domain: "honeycomb.io",
    pricingUrl: "https://www.honeycomb.io/pricing",
    aliases: ["Honeycomb.io", "Honeycomb Observability"],
    membershipRole: "primary",
    jobCluster: "observability-monitoring",
    softShortDescription:
      "High-cardinality event/trace observability — Free; Pro from $150/mo; Enterprise custom. Does not outrank Datadog 8.6.",
    shortDescription:
      "Honeycomb is a high-cardinality event and distributed-tracing observability specialist — BubbleUp, wide events, and trace-first debugging rather than a Datadog-style host/infra suite. Free plan exists. Pro publishes from $150/month; Enterprise is custom. Same observability-monitoring cluster as Datadog — Datadog remains the award (8.6); this entity does not outrank it. Distinct from AppDynamics vCPU APM and from Sentry’s error/replay specialist shape. Landscape-only versus PagerDuty on-call.",
    vendorPositioning:
      "See high-cardinality production behavior — events and traces for debugging, not a full infra observability estate.",
    pricingModel: "flat",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 150,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from honeycomb.io/pricing (high confidence). Free plan. Pro from $150/mo. Enterprise custom. Event/trace volume still changes TCO above the $150 tile. Affiliate economics excluded.",
    pricingSummary:
      "Free plan. Pro from $150/mo. Enterprise quote. Confirm live event/trace allowances on honeycomb.io/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description: "Free Honeycomb path — evaluation / small event volume. Confirm live caps.",
      },
      {
        kind: "flat-monthly",
        slug: "pro",
        name: "Pro",
        amount: 150,
        highlighted: true,
        description:
          "$150/mo Pro — published high-cardinality observability team floor. Volume still meters TCO.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Custom volume, SSO, and support — contact sales.",
      },
    ],
    featureOverrides: HONEYCOMB_FEATURES,
    aiLines: [
      "ITSM AI copilot: limited",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "github", kind: "native" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Not a Datadog-style infrastructure monitoring suite — high-cardinality events/traces are the job",
      "Does not outrank Datadog (8.6)",
      "Pro $150 is not unlimited telemetry",
      "Not on-call paging (PagerDuty) — landscape only",
      "Not ITSM, git host, hosting panel, or managed hosting",
    ],
    limitationKinds: [
      "feature-unavailable",
      "other",
      "plan-restriction",
      "feature-unavailable",
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
        "Query-first wide-event UX is loved by tracing specialists; not a host-map onboarding path. Not a lab test.",
      "it-job-fit":
        "Observability specialist — high-cardinality events/traces, not Datadog infra replacement, not PagerDuty paging.",
      "workflow-depth":
        "BubbleUp, traces, and SLOs are deep for that job; not full-stack infra/logs the way Datadog modules are.",
      integrations: "OpenTelemetry, Slack, and GitHub cover the debugging workflow.",
      "admin-security":
        "Pro/Enterprise add governance; Free is team-grade.",
      scalability: "Enterprise custom plus event volume; $150 Pro is not unlimited.",
      "value-for-money":
        "Free plus published $150 Pro is a clear specialist floor versus Datadog module stacking. Affiliate economics excluded.",
      "ai-capabilities":
        "Query/assist exists — scored as supporting, not an LLM suite.",
    },
    bestFor: [
      "Teams whose observability job is high-cardinality events and traces",
      "OpenTelemetry-first debugging vs host/infra suites",
      "Buyers who will start on Free before Pro $150",
    ],
    notIdealFor: [
      "SRE teams buying infrastructure monitoring as the core SKU (Datadog)",
      "On-call-only paging (PagerDuty) — landscape, not a peer rank",
      "Cisco vCPU APM as the primary shape (AppDynamics)",
    ],
    pros: [
      "Free plan",
      "Published Pro $150/mo floor",
      "High-cardinality event/trace specialist depth",
      "Clear identity vs infra suites",
      "OpenTelemetry-friendly",
    ],
    cons: [
      "Not infra monitoring",
      "Does not outrank Datadog",
      "Event volume still meters TCO",
      "Not on-call-primary",
      "AI is not the product",
    ],
    keyFeatures: [
      "High-cardinality events",
      "Distributed tracing",
      "BubbleUp / query-first debugging",
      "Free and Pro $150/mo",
      "OpenTelemetry",
    ],
    whoShouldChoose:
      "Choose Honeycomb when high-cardinality event/trace debugging is the job — not Datadog infrastructure monitoring by default, and not PagerDuty.",
    whoShouldConsiderAlternatives:
      "Compare Datadog or AppDynamics for full-stack infra/APM; Sentry for error/replay specialists; PagerDuty only on landscape pages for paging.",
    alternativeSlugs: ["datadog", "sentry"],
    competitorSlugs: ["datadog", "sentry", "new-relic", "appdynamics", "grafana-cloud"],
    comparableSlugs: ["datadog", "sentry", "grafana-cloud"],
    useCaseSlugs: ["observability-monitoring"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering"],
    sourcesExtra: [
      {
        id: "honeycomb-pricing",
        url: "https://www.honeycomb.io/pricing",
        title: "Honeycomb pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },
  {
    slug: "firehydrant",
    name: "FireHydrant",
    company: "FireHydrant, Inc.",
    website: "https://firehydrant.com",
    domain: "firehydrant.com",
    pricingUrl: "https://firehydrant.com/pricing/",
    aliases: ["Fire Hydrant", "FireHydrant incidents"],
    membershipRole: "primary",
    jobCluster: "incident-oncall",
    softShortDescription:
      "Incident response — Free up to 10 responders; Pro $25/responder/mo annual; Enterprise custom; 14-day Pro trial. Does not outrank PagerDuty 8.0.",
    shortDescription:
      "FireHydrant is an incident-response and command platform (declare, coordinate, retrospective) with responder-priced packaging. Free covers up to 10 responders. Pro is $25/responder/month billed annually. Enterprise custom. 14-day Pro trial. Same incident-oncall cluster as PagerDuty — PagerDuty remains the award (8.0); this entity does not outrank it. Distinct from Rootly’s $20 Incident Response / On-Call Essentials split and from Datadog/Honeycomb observability.",
    vendorPositioning:
      "Run incidents as a system — command, comms, and learn, with a published Pro responder floor.",
    pricingModel: "per-seat",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 25,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from firehydrant.com/pricing (high confidence). Free up to 10 responders. Pro $25/responder/mo annual. Enterprise custom. 14-day Pro trial. Affiliate economics excluded.",
    pricingSummary:
      "Free up to 10 responders. Pro from $25/responder/mo annual. Enterprise quote. 14-day Pro trial. Confirm live on firehydrant.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        limits: ["Up to 10 responders"],
        description: "Free incident response up to 10 responders.",
      },
      {
        kind: "per-seat-annual",
        slug: "pro",
        name: "Pro",
        amount: 25,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "$25/responder/mo billed annually — Pro incident-response floor. 14-day trial.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Custom governance, scale, and support — contact sales.",
      },
    ],
    featureOverrides: {
      ...INCIDENT_FEATURES,
      "oncall-paging": "limited",
    },
    aiLines: [
      "ITSM AI copilot: limited",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "pagerduty", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Does not outrank PagerDuty (8.0) as the incident-oncall award",
      "On-call paging is not the primary SKU — often paired with PagerDuty",
      "Not observability telemetry (Datadog / Honeycomb)",
      "Not an ITSM CMDB (ServiceNow / Freshservice)",
      "Free 10-responder cap; Pro $25 is not unlimited enterprise",
    ],
    limitationKinds: [
      "other",
      "feature-unavailable",
      "feature-unavailable",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 8,
      "it-job-fit": 8,
      "workflow-depth": 8,
      integrations: 8,
      "admin-security": 7,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Incident command UX is approachable for SRE teams; 10-responder Free is an easy try. Not a lab test.",
      "it-job-fit":
        "Incident-oncall cluster — ranked with PagerDuty and incident.io, not as an observability peer.",
      "workflow-depth":
        "Declare/coordinate/retrospective workflows are deep; paging-first depth still sits with PagerDuty.",
      integrations: "Slack/Teams plus PagerDuty hooks are the incident-command story.",
      "admin-security":
        "Pro is product-led; Enterprise carries heavier governance.",
      scalability: "Per-responder Pro plus Enterprise quote; held below PagerDuty’s scale story.",
      "value-for-money":
        "Free 10 responders plus published $25 Pro annual is a clear floor; still not PagerDuty’s award path. Affiliate economics excluded.",
      "ai-capabilities":
        "Incident assist exists — scored as supporting, not the buying reason versus PagerDuty paging.",
    },
    bestFor: [
      "Teams that want incident command with a 10-responder free path",
      "Buyers comparing FireHydrant Pro $25 to Rootly $20 and incident.io Team $15",
      "Orgs that will keep PagerDuty for paging and add FireHydrant for command",
    ],
    notIdealFor: [
      "Orgs whose primary job is PagerDuty-style on-call paging at enterprise scale",
      "Honeycomb/Datadog observability purchases",
      "ITSM ticket desks without incident command",
    ],
    pros: [
      "Free up to 10 responders",
      "Published Pro $25/responder annual",
      "14-day Pro trial",
      "Incident command depth",
      "PagerDuty-friendly integrations",
    ],
    cons: [
      "Does not outrank PagerDuty",
      "Paging is not the lead SKU",
      "Thinner enterprise scale story",
      "Not telemetry",
      "Not ITSM CMDB",
    ],
    keyFeatures: [
      "Incident declaration and command",
      "Retrospectives",
      "Slack / Teams native",
      "Free 10-responder path",
      "Pro $25/responder annual",
    ],
    whoShouldChoose:
      "Choose FireHydrant when incident command with a published $25 Pro floor is the job — not PagerDuty by default, and not Datadog/Honeycomb.",
    whoShouldConsiderAlternatives:
      "Compare PagerDuty for paging-first on-call; incident.io or Rootly for other product-led incident SKUs.",
    alternativeSlugs: ["pagerduty", "incident-io"],
    competitorSlugs: ["pagerduty", "incident-io", "rootly"],
    comparableSlugs: ["pagerduty", "incident-io", "rootly"],
    useCaseSlugs: ["incident-oncall"],
    businessSizeSlugs: ["small-business", "mid-market"],
    teamTypeSlugs: ["engineering", "operations"],
    sourcesExtra: [
      {
        id: "firehydrant-pricing",
        url: "https://firehydrant.com/pricing/",
        title: "FireHydrant pricing",
        domains: ["pricing", "plans", "free-plan", "free-trial", "limits"],
      },
    ],
  },
  {
    slug: "rootly",
    name: "Rootly",
    company: "Rootly, Inc.",
    website: "https://rootly.com",
    domain: "rootly.com",
    pricingUrl: "https://rootly.com/pricing",
    aliases: ["Rootly.io", "Rootly incidents"],
    membershipRole: "primary",
    jobCluster: "incident-oncall",
    softShortDescription:
      "Incident response — Incident Response Essentials $20/user/mo; On-Call Essentials $20/user; Enterprise custom. Does not outrank PagerDuty 8.0.",
    shortDescription:
      "Rootly is a Slack-native incident-response platform with a sibling On-Call product. Incident Response Essentials publishes at $20/user/month; On-Call Essentials is a separate $20/user line — do not treat the $20 incident floor as including paging. Enterprise custom. Same incident-oncall cluster as PagerDuty — PagerDuty remains the award (8.0); this entity does not outrank it. Distinct from FireHydrant’s $25 Pro responder pack and from incident.io’s $15 Team plus on-call add-on.",
    vendorPositioning:
      "Incident response in Slack — buy On-Call Essentials separately if paging is the job.",
    pricingModel: "per-seat",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 20,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from rootly.com/pricing (high confidence). Incident Response Essentials $20/user/mo. On-Call Essentials $20/user (separate SKU). Enterprise custom. Affiliate economics excluded.",
    pricingSummary:
      "No free plan. Incident Response Essentials from $20/user/mo. On-Call Essentials $20/user extra. Enterprise quote. Confirm live on rootly.com/pricing.",
    plans: [
      {
        kind: "per-seat-monthly",
        slug: "incident-response-essentials",
        name: "Incident Response Essentials",
        amount: 20,
        highlighted: true,
        description:
          "$20/user/mo Incident Response Essentials — incident command floor. On-call is a separate $20 SKU.",
      },
      {
        kind: "per-seat-monthly",
        slug: "on-call-essentials",
        name: "On-Call Essentials",
        amount: 20,
        description:
          "$20/user/mo On-Call Essentials — paging sibling SKU, not included in Incident Response Essentials.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Custom governance, scale, and support — contact sales.",
      },
    ],
    featureOverrides: {
      ...INCIDENT_FEATURES,
      "oncall-paging": "add-on",
    },
    aiLines: [
      "ITSM AI copilot: limited",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "On-Call Essentials is a separate $20/user SKU — not included in Incident Response $20",
      "Does not outrank PagerDuty (8.0)",
      "No published free plan (unlike FireHydrant / incident.io Basic)",
      "Not observability telemetry",
      "Not an ITSM CMDB",
    ],
    limitationKinds: [
      "requires-add-on",
      "other",
      "other",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "it-job-fit": 8,
      "workflow-depth": 8,
      integrations: 8,
      "admin-security": 7,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Slack-native incident UX is approachable; two $20 SKUs are the packaging tax. Not a lab test.",
      "it-job-fit":
        "Incident-oncall cluster — ranked with PagerDuty and FireHydrant, not Datadog.",
      "workflow-depth":
        "Incident command is deep; on-call depth is the sibling SKU versus PagerDuty’s paging-first product.",
      integrations: "Slack-native incident workflows are the integration story.",
      "admin-security":
        "Essentials are product-led; Enterprise carries heavier governance.",
      scalability: "Per-user ladder plus Enterprise quote; held below PagerDuty.",
      "value-for-money":
        "Published $20 Incident Response floor is sharp; doubling for On-Call is the TCO catch. Affiliate economics excluded.",
      "ai-capabilities":
        "Incident assist exists — scored as supporting, not the buying reason versus PagerDuty paging.",
    },
    bestFor: [
      "Slack-first teams buying incident command at a published $20/user floor",
      "Buyers who will add On-Call Essentials only if they need paging",
      "Comparisons versus FireHydrant Pro $25 and incident.io Team $15",
    ],
    notIdealFor: [
      "Teams that need paging-first on-call as the core SKU (PagerDuty)",
      "Buyers who want a free incident path (FireHydrant / incident.io)",
      "Observability or ITSM CMDB purchases",
    ],
    pros: [
      "Published Incident Response $20/user floor",
      "Clear On-Call Essentials sibling SKU",
      "Slack-native incident UX",
      "Same-cluster peer of FireHydrant / incident.io",
      "Enterprise path",
    ],
    cons: [
      "On-call is extra $20",
      "Does not outrank PagerDuty",
      "No free plan",
      "Not telemetry",
      "Not ITSM CMDB",
    ],
    keyFeatures: [
      "Slack-native incident response",
      "Incident Response Essentials $20/user",
      "On-Call Essentials $20/user (separate)",
      "Retros / incident workflow",
      "Enterprise quote path",
    ],
    whoShouldChoose:
      "Choose Rootly when Slack-native incident response at $20/user is the job — not PagerDuty by default, and not FireHydrant’s free-10 path by default.",
    whoShouldConsiderAlternatives:
      "Compare PagerDuty for paging-first on-call; FireHydrant or incident.io for other product-led incident SKUs.",
    alternativeSlugs: ["pagerduty", "incident-io"],
    competitorSlugs: ["pagerduty", "incident-io", "firehydrant"],
    comparableSlugs: ["pagerduty", "firehydrant", "incident-io"],
    useCaseSlugs: ["incident-oncall"],
    businessSizeSlugs: ["small-business", "mid-market"],
    teamTypeSlugs: ["engineering", "operations"],
    sourcesExtra: [
      {
        id: "rootly-pricing",
        url: "https://rootly.com/pricing",
        title: "Rootly pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "buildkite",
    name: "Buildkite",
    company: "Buildkite Pty Ltd",
    website: "https://buildkite.com",
    domain: "buildkite.com",
    pricingUrl: "https://buildkite.com/pricing",
    aliases: ["Buildkite Pipelines", "Buildkite CI"],
    membershipRole: "primary",
    jobCluster: "source-control-devops",
    softShortDescription:
      "CI/CD with self-hosted + hosted agents — not a git host. Free; Pro $30/active user/mo; Enterprise custom; 30-day all-access trial. Does not outrank GitHub 9.1.",
    shortDescription:
      "Buildkite is a CI/CD platform (pipelines, self-hosted agents, hosted agents) — not a Git host. It lives in source-control-devops so DevOps buyers can compare it with CircleCI, GitHub Actions, and GitLab CI, while remaining landscape-aware that GitHub the SCM is a different primary shape. Free plan exists. Pro is $30/active user/month. Enterprise custom. 30-day all-access trial. Same cluster as GitHub — GitHub remains the award (9.1); this entity does not outrank it. Distinct from CircleCI’s $15 Performance credit tile.",
    vendorPositioning:
      "Hybrid CI/CD — run pipelines on your agents or theirs without buying a git host.",
    pricingModel: "per-seat",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 30,
    startingPriceMonthly: 30,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from buildkite.com/pricing (high confidence). Free. Pro $30/active user/mo. Enterprise custom. 30-day all-access trial. Active-user definition still changes TCO. Affiliate economics excluded.",
    pricingSummary:
      "Free plan. Pro from $30/active user/mo. Enterprise quote. 30-day all-access trial. Confirm live on buildkite.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description: "Free CI/CD path — not a git hosting plan. Confirm live caps.",
      },
      {
        kind: "per-seat-monthly",
        slug: "pro",
        name: "Pro",
        amount: 30,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 30,
        description:
          "$30/active user/mo Pro — published CI/CD floor. 30-day all-access trial. Not a git-host SKU.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Enterprise CI — custom security, scale, and support.",
      },
    ],
    featureOverrides: CICD_FEATURES,
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: not-supported",
    ],
    integrations: [
      { integrationSlug: "github", kind: "native" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Not a git host — you still need GitHub, GitLab, or Bitbucket for source control",
      "Same source-control-devops cluster as GitHub, but GitHub the SCM is a different primary shape",
      "Does not outrank GitHub (9.1)",
      "Pro $30/active user is not unlimited CI; agent/minute math still exists",
      "Not observability, on-call, hosting panel, or managed hosting",
    ],
    limitationKinds: [
      "feature-unavailable",
      "other",
      "other",
      "plan-restriction",
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
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Pipeline YAML plus agent install is familiar to CI specialists; not a git-host onboarding path. Not a lab test.",
      "it-job-fit":
        "CI/CD inside source-control-devops — peer path vs CircleCI/Actions, not a GitHub SCM replacement.",
      "workflow-depth":
        "Self-hosted + hosted agents, pipelines, and queues are deep for CI; no repo/PR system of record.",
      integrations: "Native GitHub/GitLab plus Slack/API for pipeline notifications.",
      "admin-security":
        "Self-hosted agents keep build compute in your network — a real security story versus hosted-only CI.",
      scalability: "Pro → Enterprise plus your own agents; active-user definition still meters cost.",
      "value-for-money":
        "Free plus published $30 Pro floor is a clear CI entry; hybrid agents can beat hosted-minute TCO. Affiliate economics excluded.",
      "ai-capabilities":
        "No meaningful dev-AI copilot versus GitHub Copilot — scored low on purpose.",
    },
    bestFor: [
      "Teams that want specialist CI/CD with self-hosted agents against an existing git remote",
      "Buyers comparing Buildkite Pro $30 to CircleCI Performance $15 and GitHub Actions minutes",
      "Orgs that will not move source control in order to buy CI",
    ],
    notIdealFor: [
      "Teams whose primary purchase is a git host (GitHub / GitLab)",
      "Observability or on-call purchases",
      "Hosting panel or managed WordPress hosting",
    ],
    pros: [
      "Published Pro $30/active user floor",
      "Free plan and 30-day all-access trial",
      "Self-hosted + hosted agents",
      "Works with existing git hosts",
      "Clear identity vs SCM",
    ],
    cons: [
      "Not a git host",
      "Does not outrank GitHub",
      "Active-user TCO above $30",
      "AI not a lead feature",
      "Not observability/hosting",
    ],
    keyFeatures: [
      "CI/CD pipelines",
      "Self-hosted agents",
      "Hosted agents",
      "Pro $30/active user",
      "VCS integrations (GitHub/GitLab)",
    ],
    whoShouldChoose:
      "Choose Buildkite when hybrid CI/CD (self-hosted + hosted agents) is the job — not GitHub the SCM by default, even though both sit in source-control-devops.",
    whoShouldConsiderAlternatives:
      "Compare CircleCI for specialist hosted CI credits; GitHub or GitLab when you need repos plus CI in one licence; Azure DevOps for that ecosystem.",
    alternativeSlugs: ["circleci", "github"],
    competitorSlugs: ["circleci", "github", "gitlab", "azure-devops"],
    comparableSlugs: ["circleci", "github", "gitlab"],
    useCaseSlugs: ["source-control-devops"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering"],
    sourcesExtra: [
      {
        id: "buildkite-pricing",
        url: "https://buildkite.com/pricing",
        title: "Buildkite pricing",
        domains: ["pricing", "plans", "free-plan", "free-trial", "limits"],
      },
    ],
  },
  {
    slug: "siteground",
    name: "SiteGround",
    company: "SiteGround Hosting Ltd.",
    website: "https://www.siteground.com",
    domain: "siteground.com",
    pricingUrl: "https://www.siteground.com/wordpress-hosting.htm",
    aliases: ["Site Ground", "SiteGround WordPress"],
    membershipRole: "primary",
    jobCluster: "hosting-providers",
    softShortDescription:
      "Managed WordPress hosting with shared-plan packaging — StartUp promo $2.99 then renews $17.99/mo; GrowBig $29.99; GoGeek $44.99. Use $17.99 ongoing floor. Does not outrank WP Engine 7.7.",
    shortDescription:
      "SiteGround is managed WordPress hosting sold as shared-plan packaging (StartUp / GrowBig / GoGeek) — same hosting-providers cluster as WP Engine, Kinsta, and Cloudways, not a Plesk/cPanel panel licence. StartUp advertises $2.99 intro then renews at $17.99/month; GrowBig renews $29.99; GoGeek $44.99. startingPriceMonthly $17.99 is the ongoing StartUp floor — do not use the intro promo as the research floor. WP Engine remains the cluster award (7.7); this entity does not outrank it. Landscape-only versus Plesk.",
    vendorPositioning:
      "Managed WordPress on shared-plan tiles — cheaper ongoing than Kinsta $35, less specialist depth than WP Engine.",
    pricingModel: "flat",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 17.99,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from siteground.com WordPress hosting (high confidence). StartUp intro $2.99 then renews $17.99/mo; GrowBig renews $29.99; GoGeek $44.99. startingPriceMonthly $17.99 is the ongoing floor — intro promo is not the research floor. Affiliate economics excluded.",
    pricingSummary:
      "No free plan. StartUp renews $17.99/mo (intro promo $2.99 is not the floor). GrowBig $29.99. GoGeek $44.99. Confirm live on siteground.com/wordpress-hosting.htm.",
    plans: [
      {
        kind: "flat-monthly",
        slug: "startup",
        name: "StartUp",
        amount: 17.99,
        highlighted: true,
        description:
          "$17.99/mo ongoing StartUp floor. Promotional $2.99 intro is not the research floor.",
      },
      {
        kind: "flat-monthly",
        slug: "growbig",
        name: "GrowBig",
        amount: 29.99,
        description: "$29.99/mo GrowBig renewal packaging.",
      },
      {
        kind: "flat-monthly",
        slug: "gogeek",
        name: "GoGeek",
        amount: 44.99,
        description: "$44.99/mo GoGeek renewal packaging.",
      },
    ],
    featureOverrides: MANAGED_HOSTING_FEATURES,
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "wordpress", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Intro $2.99 StartUp promo is not the $17.99 ongoing floor",
      "Does not outrank WP Engine (7.7) — specialist managed-WP depth is below the award",
      "Shared-plan packaging, not Kinsta-style isolated managed WP or Cloudways VMs",
      "Not a Plesk/cPanel panel licence (landscape vs Plesk)",
      "Not ITSM, observability, git, or a proxy network",
    ],
    limitationKinds: [
      "other",
      "other",
      "other",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "it-job-fit": 8,
      "workflow-depth": 7,
      integrations: 7,
      "admin-security": 7,
      scalability: 7,
      "value-for-money": 9,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Shared-plan WordPress dashboard is easy to buy; Site Tools UX is approachable. Not a lab test.",
      "it-job-fit":
        "Managed WordPress hosting — hosting-providers cluster with WP Engine/Kinsta/Cloudways, not hosting-operations panels.",
      "workflow-depth":
        "Managed WP on shared plans covers the job; less specialist platform depth than WP Engine or Kinsta GCP isolation. Held at 7.",
      integrations: "WordPress-centric; narrower than Cloudways multi-app.",
      "admin-security":
        "Managed platform security is real; shared-plan isolation is the trade versus Kinsta/WP Engine.",
      scalability: "GrowBig/GoGeek scale the shared ladder; $17.99 StartUp is not a large-estate path.",
      "value-for-money":
        "Published $17.99 ongoing is sharper than Kinsta $35 / WP Engine $30 first-year — value is the story. Affiliate economics excluded.",
      "ai-capabilities":
        "No meaningful ITSM/dev AI copilot — scored low; hosting job rarely needs AI scoring depth.",
    },
    bestFor: [
      "Teams that want managed WordPress hosting with a published $17.99 ongoing floor",
      "Buyers comparing SiteGround StartUp to WP Engine Essential and Kinsta Single",
      "Orgs that will treat $17.99 as renewal TCO, not the $2.99 promo month",
    ],
    notIdealFor: [
      "Admins buying Plesk or DirectAdmin licences for servers they already own",
      "Teams that need WP Engine specialist depth or Kinsta GCP isolation as the award path",
      "ITSM, observability, or source-control purchases",
    ],
    pros: [
      "Managed hosting (managed-hosting supported)",
      "Published StartUp $17.99 ongoing floor",
      "GrowBig $29.99 and GoGeek $44.99 ladder",
      "Clear cluster fit vs panels",
      "Strong value versus Kinsta $35",
    ],
    cons: [
      "Intro promo tiles can mislead",
      "Does not outrank WP Engine",
      "Shared-plan depth below specialist managed WP",
      "Not a panel licence",
      "AI is not the product",
    ],
    keyFeatures: [
      "Managed WordPress hosting",
      "StartUp from $17.99/mo ongoing",
      "GrowBig / GoGeek shared plans",
      "Site Tools dashboard",
      "WordPress-centric workflow",
    ],
    whoShouldChoose:
      "Choose SiteGround when managed WordPress on shared-plan packaging at a $17.99 ongoing floor is the job — not a Plesk panel licence, and not WP Engine by default.",
    whoShouldConsiderAlternatives:
      "Compare WP Engine for WordPress-specialist managed hosting; Kinsta for GCP-isolated managed WP; Cloudways for managed multi-cloud VMs; Plesk only on landscape pages for panel licences.",
    alternativeSlugs: ["wp-engine", "kinsta"],
    competitorSlugs: ["wp-engine", "kinsta", "cloudways"],
    comparableSlugs: ["wp-engine", "kinsta", "cloudways"],
    useCaseSlugs: ["hosting-providers"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    teamTypeSlugs: ["operations", "engineering"],
    sourcesExtra: [
      {
        id: "siteground-wp-hosting",
        url: "https://www.siteground.com/wordpress-hosting.htm",
        title: "SiteGround WordPress hosting",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "zyte",
    name: "Zyte",
    company: "Zyte Group Ltd.",
    website: "https://www.zyte.com",
    domain: "zyte.com",
    pricingUrl: "https://www.zyte.com/pricing/",
    aliases: ["Scrapinghub", "Zyte API", "Scrapy Cloud"],
    membershipRole: "primary",
    jobCluster: "web-data-collection",
    softShortDescription:
      "Zyte API web-data collection (formerly Scrapinghub) — PAYG; monthly commitments from $100; $5 free trial credit. Does not outrank Bright Data 7.7.",
    shortDescription:
      "Zyte (formerly Scrapinghub) is a managed web-data collection platform — Zyte API for crawling/extraction rather than a raw residential-proxy GB pack as the primary shape. Pay-as-you-go plus monthly commitments from $100. $5 free trial credit. Same web-data-collection cluster as Bright Data. Bright Data remains the award (7.7); this entity does not outrank it. Distinct from IPRoyal’s $1.75/GB residential floor and from Apify’s Actor compute path.",
    vendorPositioning:
      "Managed scraping API from the Scrapinghub lineage — pay for successful extraction, not only proxy GB.",
    pricingModel: "usage",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 100,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from zyte.com/pricing (high confidence). Zyte API PAYG; monthly commitments from $100. $5 free trial credit. Formerly Scrapinghub — same vendor, new brand. Affiliate economics excluded.",
    pricingSummary:
      "Zyte API PAYG. Monthly commitments from $100. $5 free trial credit. Confirm live on zyte.com/pricing.",
    plans: [
      {
        kind: "flat-monthly",
        slug: "monthly-commit",
        name: "Monthly commitment",
        amount: 100,
        highlighted: true,
        hasFreeTrial: true,
        description:
          "$100/mo commitment floor for Zyte API — PAYG also exists. $5 free trial credit.",
      },
      {
        kind: "contact-sales",
        slug: "payg",
        name: "Pay-as-you-go",
        description: "Zyte API PAYG — usage meters without the $100 monthly commit. Confirm live rates.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Higher commits, SLAs, and support — contact sales.",
      },
    ],
    featureOverrides: {
      ...PROXY_FEATURES,
      "proxy-network": "supported",
      "dev-ai": "limited",
      "enterprise-security": "limited",
    },
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "python", kind: "native" },
      { integrationSlug: "scrapy", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Formerly Scrapinghub — same vendor; do not treat as two products",
      "Does not outrank Bright Data (7.7)",
      "$100 monthly commit is not unlimited extraction; PAYG meters still apply",
      "API/extraction shape — not a Bright Data-style enterprise proxy estate as the primary identity",
      "Not ITSM, observability, git, hosting panel, or managed hosting",
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
      scalability: 7,
      "value-for-money": 7,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Zyte API is easier than assembling proxy + parser stacks; Scrapinghub rebrand is the naming tax. Not a lab test.",
      "it-job-fit":
        "Web-data-collection — managed scraping API peer of Bright Data/ScraperAPI, not hosting or observability.",
      "workflow-depth":
        "Crawl/extract API plus Scrapy heritage is deep for collection; less proxy-network catalogue than Bright Data.",
      integrations: "Python/Scrapy/API are the extraction-stack story.",
      "admin-security":
        "Paid commits add governance; thinner public ISO-first packaging than Oxylabs / Bright Data.",
      scalability: "Commits above $100 scale; enterprise SLA story is thinner than Bright Data.",
      "value-for-money":
        "Published $100 commit plus $5 trial credit is clearer than Bright Data ~$499; still not a $2/GB hobby pack. Affiliate economics excluded.",
      "ai-capabilities":
        "Extraction assist exists — scored as limited assistance, not a copilot suite.",
    },
    bestFor: [
      "Teams that knew Scrapinghub and need the Zyte API extraction path",
      "Buyers who want a published $100 monthly commit versus Bright Data ~$499",
      "Projects that will spend the $5 trial credit before scaling",
    ],
    notIdealFor: [
      "Enterprises that require Bright Data / Oxylabs proxy-estate compliance packaging",
      "Budget residential GB buyers (IPRoyal / ThorData)",
      "Hosting or ITSM purchases",
    ],
    pros: [
      "Published $100 monthly commit floor",
      "$5 free trial credit",
      "Scrapinghub / Scrapy heritage",
      "Managed extraction API identity",
      "Clear cluster fit vs proxy-only packs",
    ],
    cons: [
      "Does not outrank Bright Data",
      "Rebrand naming confusion",
      "Thinner enterprise proxy catalogue",
      "Usage still meters TCO",
      "Not Actor-platform depth (Apify)",
    ],
    keyFeatures: [
      "Zyte API (crawl / extract)",
      "Monthly commitments from $100",
      "PAYG option",
      "$5 trial credit",
      "Scrapy heritage (formerly Scrapinghub)",
    ],
    whoShouldChoose:
      "Choose Zyte when a managed scraping API with a $100 monthly commit is the job — not Bright Data enterprise proxy commits by default.",
    whoShouldConsiderAlternatives:
      "Compare Bright Data or Oxylabs for enterprise proxy estates; ScraperAPI for API-credit scraping; Apify for Actor compute; IPRoyal for cheap residential GB.",
    alternativeSlugs: ["bright-data", "scraperapi"],
    competitorSlugs: [
      "bright-data",
      "oxylabs",
      "scraperapi",
      "apify",
      "smartproxy",
    ],
    comparableSlugs: ["bright-data", "scraperapi", "apify"],
    useCaseSlugs: ["web-data-collection"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering", "operations"],
    sourcesExtra: [
      {
        id: "zyte-pricing",
        url: "https://www.zyte.com/pricing/",
        title: "Zyte pricing",
        domains: ["pricing", "plans", "free-trial", "limits"],
      },
    ],
  },
  {
    slug: "iproyal",
    name: "IPRoyal",
    company: "IPRoyal",
    website: "https://iproyal.com",
    domain: "iproyal.com",
    pricingUrl: "https://iproyal.com/pricing/",
    aliases: ["IP Royal", "IPRoyal Proxies"],
    membershipRole: "primary",
    jobCluster: "web-data-collection",
    softShortDescription:
      "Residential proxies from $1.75/GB — ISP/datacenter/mobile lines; traffic that never expires framing. Does not outrank Bright Data 7.7.",
    shortDescription:
      "IPRoyal sells residential, ISP, datacenter, and mobile proxies with a published residential floor from $1.75/GB. Traffic is marketed as never expiring. startingPriceMonthly $1.75 is that per-GB floor (a 1GB pack equivalent), not a monthly SaaS seat. Same web-data-collection cluster as Bright Data. Bright Data remains the award (7.7); this entity does not outrank it. Budget / SMB proxy peer of ThorData and Decodo (Smartproxy) — thinner enterprise compliance and platform depth than Bright Data / Oxylabs.",
    vendorPositioning:
      "Self-serve proxy GB — cheap residential entry with unused traffic that does not expire.",
    pricingModel: "usage",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 1.75,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from iproyal.com/pricing (high confidence). Residential from $1.75/GB. ISP/datacenter/mobile are separate lines. startingPriceMonthly $1.75 is the per-GB residential floor, not a seat. Never-expires traffic is packaging, not unlimited throughput. Affiliate economics excluded.",
    pricingSummary:
      "Residential from $1.75/GB. ISP/datacenter/mobile lines on iproyal.com/pricing. Traffic-never-expires framing. Confirm live GB rates before purchase.",
    plans: [
      {
        kind: "flat-monthly",
        slug: "residential-1gb",
        name: "Residential 1GB",
        amount: 1.75,
        highlighted: true,
        description:
          "1GB residential at $1.75/GB — $1.75 total on published pricing. Per-GB floor, not a monthly seat.",
      },
      {
        kind: "contact-sales",
        slug: "isp-datacenter-mobile",
        name: "ISP / datacenter / mobile",
        description:
          "Separate proxy lines — confirm live GB rates. Not the $1.75 residential floor.",
      },
      {
        kind: "contact-sales",
        slug: "high-volume",
        name: "Higher-volume residential",
        description: "Larger GB packs on published pricing — still metered; never-expires is unused-traffic packaging.",
      },
    ],
    featureOverrides: {
      ...PROXY_FEATURES,
      "enterprise-security": "limited",
      "analytics-reporting": "limited",
      "dev-ai": "not-supported",
    },
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: not-supported",
      "AI automation: not-supported",
      "AI recommendations: not-supported",
    ],
    integrations: [
      { integrationSlug: "api", kind: "api" },
      { integrationSlug: "python", kind: "native" },
    ],
    limitations: [
      "Does not outrank Bright Data (7.7)",
      "Brand maturity and enterprise compliance story are thinner than Bright Data / Oxylabs",
      "$1.75/GB is metered — never-expires unused traffic is not unlimited scrape throughput",
      "Not a managed scraping API (Zyte / ScraperAPI) or Actor platform (Apify)",
      "Not ITSM, observability, git, hosting panel, or managed hosting",
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
      "it-job-fit": 8,
      "workflow-depth": 6,
      integrations: 6,
      "admin-security": 6,
      scalability: 7,
      "value-for-money": 9,
      "ai-capabilities": 4,
    },
    scoreRationales: {
      "ease-of-use":
        "Self-serve GB dashboard is straightforward; product-line choice (residential/ISP/DC/mobile) is the learning curve. Not a lab test.",
      "it-job-fit":
        "Residential proxy / web-data-collection — ranked with Bright Data/Smartproxy, not hosting or observability.",
      "workflow-depth":
        "Proxy lines cover collection jobs; thinner platform depth than Bright Data, Zyte API, or Apify Actors. Held at 6.",
      integrations: "API-first with lighter published SDK/ecosystem depth than Bright Data.",
      "admin-security":
        "Limited public enterprise compliance packaging versus Bright Data / Oxylabs ISO 27001.",
      scalability: "GB packs scale; enterprise SLA story is thinner.",
      "value-for-money":
        "Published $1.75/GB residential floor is the sharpest GB entry in this set. Affiliate economics excluded.",
      "ai-capabilities":
        "No meaningful AI copilot story — scored low on purpose.",
    },
    bestFor: [
      "Teams that need a low published residential GB floor",
      "Buyers comparing $1.75/GB to ThorData $2/GB and Decodo $3.75/GB starters",
      "Projects that will validate quality/compliance before production volume",
    ],
    notIdealFor: [
      "Enterprises that require Bright Data / Oxylabs compliance-first proxy estates",
      "Managed extraction API buyers (Zyte / ScraperAPI)",
      "Hosting or ITSM purchases",
    ],
    pros: [
      "Published residential from $1.75/GB",
      "ISP/datacenter/mobile lines",
      "Never-expires unused-traffic packaging",
      "Self-serve dashboard",
      "Clear budget-peer identity",
    ],
    cons: [
      "Does not outrank Bright Data",
      "Thinner enterprise compliance story",
      "Thinner workflow depth than API/Actor platforms",
      "GB math still dominates TCO",
      "No AI story",
    ],
    keyFeatures: [
      "Residential proxies from $1.75/GB",
      "ISP / datacenter / mobile lines",
      "Unused traffic does not expire (packaging)",
      "Self-serve GB purchase",
      "API access",
    ],
    whoShouldChoose:
      "Choose IPRoyal when a published $1.75/GB residential floor is the job — not Bright Data enterprise commits by default.",
    whoShouldConsiderAlternatives:
      "Compare Bright Data or Oxylabs for enterprise proxy estates; Decodo (Smartproxy) or ThorData for other budget GB tiles; Zyte or ScraperAPI for managed APIs.",
    alternativeSlugs: ["bright-data", "smartproxy"],
    competitorSlugs: ["bright-data", "smartproxy", "thordata", "oxylabs"],
    comparableSlugs: ["smartproxy", "thordata", "bright-data"],
    useCaseSlugs: ["web-data-collection"],
    businessSizeSlugs: ["solo", "micro", "small-business"],
    teamTypeSlugs: ["operations", "engineering"],
    sourcesExtra: [
      {
        id: "iproyal-pricing",
        url: "https://iproyal.com/pricing/",
        title: "IPRoyal pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
];

export const PRODUCTS = COMPACT.map(expandItProduct);

export const COMPARISON_PAIRS = [
  ["manageengine-servicedesk-plus", "freshservice"],
  ["sysaid", "freshservice"],
  ["haloitsm", "manageengine-servicedesk-plus"],
  ["sysaid", "haloitsm"],
  ["appdynamics", "datadog"],
  ["honeycomb", "datadog"],
  ["appdynamics", "dynatrace"],
  ["firehydrant", "pagerduty"],
  ["rootly", "incident-io"],
  ["firehydrant", "rootly"],
  ["buildkite", "circleci"],
  ["buildkite", "github"],
  ["siteground", "wp-engine"],
  ["siteground", "kinsta"],
  ["zyte", "bright-data"],
  ["iproyal", "smartproxy"],
  ["zyte", "scraperapi"],
];
