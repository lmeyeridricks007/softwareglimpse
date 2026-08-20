/**
 * IT & Development Priority-2 credibility products (compact).
 * servicenow, jira-service-management, new-relic, grafana-cloud, pagerduty,
 * gitlab, bitbucket, cpanel.
 *
 * Pricing grounded 2026-08-18 from first-party / official pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 *
 * Jira Software remains project-management primary; this JSM entity is ITSM-primary.
 * PagerDuty is incident-oncall — not an observability peer of Datadog.
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
  "proxy-network": "not-supported",
  "itsm-ai": "supported",
  "dev-ai": "limited",
  "oncall-paging": "supported",
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
  "proxy-network": "not-supported",
  "itsm-ai": "limited",
  "dev-ai": "limited",
  "oncall-paging": "limited",
  "enterprise-security": "supported",
  "analytics-reporting": "supported",
};

const SCM_FEATURES = {
  "incident-management": "not-supported",
  "change-problem": "not-supported",
  "service-catalog": "not-supported",
  "infrastructure-monitoring": "not-supported",
  "apm-tracing": "not-supported",
  "log-management": "limited",
  "source-control": "supported",
  "cicd-actions": "supported",
  "hosting-panel": "not-supported",
  "proxy-network": "not-supported",
  "itsm-ai": "not-supported",
  "dev-ai": "supported",
  "oncall-paging": "not-supported",
  "enterprise-security": "supported",
  "analytics-reporting": "supported",
};

const COMPACT = [
  {
    slug: "servicenow",
    name: "ServiceNow",
    company: "ServiceNow, Inc.",
    website: "https://www.servicenow.com",
    domain: "servicenow.com",
    pricingUrl: "https://www.servicenow.com/products/itsm.html",
    aliases: ["Now Platform", "ServiceNow ITSM", "Now Assist"],
    membershipRole: "primary",
    jobCluster: "itsm-service-desk",
    softShortDescription:
      "Enterprise ITSM / Now Platform — contact sales. 2026 ITSM tiers Foundation / Advanced / Prime with bundled Now Assist; no public list price.",
    shortDescription:
      "ServiceNow is the enterprise Now Platform for ITSM (incident, problem, change, request, CMDB) plus a broad module catalog (ITOM, HRSD, CSM). ServiceNow does not publish list prices. From April 2026 ITSM is licensed Foundation / Advanced / Prime with Now Assist allocations bundled. Third-party benchmarks often cite roughly $100+/fulfiller/month list at small bands before discount — treat as directional, not a SoftwareGlimpse floor. Implementation and module sprawl dominate TCO versus Freshservice’s published agent SKUs.",
    vendorPositioning:
      "The enterprise system of action for IT and service operations — not an SMB helpdesk.",
    pricingModel: "custom",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 100,
    startingPriceConfidence: "low",
    pricingNotes:
      "No first-party public list (2026-08-18). ITSM Foundation/Advanced/Prime described on ServiceNow community (April 2026). startingPriceMonthly $100 is a low-confidence third-party small-band fulfiller estimate — not a vendor SKU. Always RFP. Affiliate economics excluded.",
    pricingSummary:
      "Contact sales. Foundation / Advanced / Prime ITSM with bundled Now Assist. No public list price — confirm quote and AI assist pools.",
    plans: [
      {
        kind: "contact-sales",
        slug: "itsm-foundation",
        name: "ITSM Foundation",
        highlighted: true,
        description:
          "Entry ITSM (incident/request/asset + configured Now Assist) — custom quote.",
      },
      {
        kind: "contact-sales",
        slug: "itsm-advanced",
        name: "ITSM Advanced",
        description:
          "Full ITIL suite (problem, change, major incident, on-call) — custom quote.",
      },
      {
        kind: "contact-sales",
        slug: "itsm-prime",
        name: "ITSM Prime",
        description:
          "Highest Assist pool and custom AI agents — custom quote.",
      },
    ],
    featureOverrides: ITSM_FEATURES,
    aiLines: [
      "ITSM AI copilot: supported",
      "Developer AI copilot: limited",
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
      "No published self-serve price — procurement and SI partners are the buying motion",
      "Implementation cost often exceeds year-one licences",
      "Module sprawl (ITOM, HRSD, CSM) can dwarf ITSM seat cost",
      "Poor fit as an SMB published-price alternative to Freshservice Starter",
      "Not an observability, git, or hosting-panel product",
    ],
    limitationKinds: [
      "other",
      "other",
      "plan-restriction",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 6,
      "it-job-fit": 10,
      "workflow-depth": 10,
      integrations: 10,
      "admin-security": 10,
      scalability: 10,
      "value-for-money": 5,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Enterprise platform UX and implementation burden — productive after SI/config, not in an afternoon. Not hands-on lab tested.",
      "it-job-fit":
        "Canonical enterprise ITSM — ranked with Freshservice and JSM, not against Datadog or GitHub.",
      "workflow-depth":
        "ITIL-depth CMDB, change, and cross-module workflows are the category ceiling.",
      integrations: "Broadest enterprise integration surface in the ITSM cluster.",
      "admin-security": "Enterprise controls, domain separation, and compliance are core.",
      scalability: "Built for global fulfiller counts and multi-module estates.",
      "value-for-money":
        "Quote-only + implementation is the TCO story; not comparable to $19 Freshservice Starter. Affiliate economics excluded.",
      "ai-capabilities":
        "Now Assist bundled by 2026 tier; Prime gates custom agents. Scored as assistance, not a ChatGPT substitute.",
    },
    bestFor: [
      "Enterprises standardising ITSM (and often HRSD/CSM) on one platform",
      "ITIL-mature shops that need CMDB + change at scale",
      "Buyers with budget for implementation partners",
    ],
    notIdealFor: [
      "SMBs that need a published $19/agent ITSM SKU (Freshservice)",
      "Atlassian-first teams that only need JSM on an existing Jira Cloud",
      "SRE teams buying observability (Datadog / New Relic)",
    ],
    pros: [
      "Enterprise ITSM depth and CMDB",
      "Cross-module Now Platform",
      "Now Assist on 2026 ITSM tiers",
      "Governance and scale",
      "Integration breadth",
    ],
    cons: [
      "Opaque pricing",
      "Heavy implementation",
      "Module sprawl risk",
      "Weak SMB self-serve motion",
      "Not observability or git",
    ],
    keyFeatures: [
      "Incident, problem, change, request",
      "CMDB / asset",
      "Service catalog / Virtual Agent",
      "Now Assist (tier-gated)",
      "Enterprise security and domain separation",
    ],
    whoShouldChoose:
      "Choose ServiceNow when enterprise ITSM (and likely adjacent Now modules) is the job and you can run an RFP — not when you need Freshservice’s published Starter SKU.",
    whoShouldConsiderAlternatives:
      "Compare Freshservice for published mid-market ITSM; Jira Service Management if you already live in Jira Cloud.",
    alternativeSlugs: ["freshservice", "jira-service-management"],
    competitorSlugs: ["freshservice", "jira-service-management"],
    comparableSlugs: ["freshservice", "jira-service-management"],
    useCaseSlugs: ["itsm-service-desk"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    teamTypeSlugs: ["it-ops", "operations"],
    sourcesExtra: [
      {
        id: "servicenow-itsm",
        url: "https://www.servicenow.com/products/itsm.html",
        title: "ServiceNow ITSM",
        domains: ["identity", "product-positioning", "features"],
      },
    ],
  },
  {
    slug: "jira-service-management",
    name: "Jira Service Management",
    company: "Atlassian",
    website: "https://www.atlassian.com/software/jira/service-management",
    domain: "atlassian.com",
    pricingUrl: "https://www.atlassian.com/software/jira/service-management/pricing",
    aliases: ["JSM", "Jira Service Desk", "Atlassian Service Collection"],
    membershipRole: "primary",
    secondaryCategorySlugs: ["project-management"],
    jobCluster: "itsm-service-desk",
    softShortDescription:
      "Atlassian ITSM on Jira Cloud — Free ≤3 agents; Standard from $20/agent/mo; Premium ~$51.42/agent/mo; Enterprise contact.",
    shortDescription:
      "Jira Service Management is Atlassian’s ITSM / employee service desk on Jira Cloud (incidents, requests, assets; change/problem depth rises on Premium). Distinct from Jira Software, which remains project-management primary on SoftwareGlimpse. Cloud Free covers up to 3 agents. Standard lists from $20/agent/month; Premium around $51.42/agent/month on Atlassian’s Service Collection pricing. Enterprise is annual quote. Virtual Agent conversations and asset objects have overage meters on higher plans. Opsgenie-style alerting is part of the Atlassian ops story — confirm live bundling.",
    vendorPositioning:
      "ITSM for teams that already work in Jira — requests and incidents next to the engineering work.",
    pricingModel: "per-seat",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 7,
    startingPriceMonthly: 20,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from Atlassian Service Collection / JSM pricing (high confidence). Free ≤3 agents; Standard from $20/agent/mo; Premium ~$51.42/agent/mo; Enterprise custom. Volume discounts apply. Confirm live calculator. Affiliate economics excluded.",
    pricingSummary:
      "Free up to 3 agents. Standard from $20/agent/mo. Premium ~$51.42/agent/mo. Enterprise quote. Confirm on Atlassian JSM pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        limits: { maxUsers: 3 },
        description: "Up to 3 agents — evaluation / tiny IT teams.",
      },
      {
        kind: "per-seat-monthly",
        slug: "standard",
        name: "Standard",
        amount: 20,
        highlighted: true,
        description: "From $20/agent/mo — core ITSM, assets, help center (volume discounts apply).",
      },
      {
        kind: "per-seat-monthly",
        slug: "premium",
        name: "Premium",
        amount: 51.42,
        description:
          "~$51.42/agent/mo — advanced incident/problem/change, SLA, higher automation.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Enterprise Cloud — annual quote, Atlassian Guard, scale controls.",
      },
    ],
    featureOverrides: {
      ...ITSM_FEATURES,
      "oncall-paging": "supported",
      "itsm-ai": "supported",
    },
    aiLines: [
      "ITSM AI copilot: supported",
      "Developer AI copilot: limited",
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
      "Jira Software is a different product — do not buy JSM expecting full Work OS PM",
      "Premium is a large step vs Standard for change/problem depth",
      "Virtual Agent / asset object overages can add to agent seats",
      "Enterprise ITSM depth still trails ServiceNow CMDB estates",
      "Not Datadog observability or GitHub source control",
    ],
    limitationKinds: [
      "other",
      "plan-restriction",
      "plan-restriction",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "it-job-fit": 8,
      "workflow-depth": 8,
      integrations: 9,
      "admin-security": 8,
      scalability: 8,
      "value-for-money": 8,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Jira-familiar for Atlassian shops; Free 3-agent path is easy to try. Not a lab test.",
      "it-job-fit":
        "ITSM on Jira Cloud — peer of Freshservice/ServiceNow, not Jira Software PM.",
      "workflow-depth":
        "Solid request/incident/asset; deepest change/problem is Premium-gated.",
      integrations: "Native Jira/Confluence/Slack/Teams is the Atlassian advantage.",
      "admin-security": "Cloud admin + Guard on higher/enterprise packaging.",
      scalability: "Cloud agent scale is high; Enterprise for the largest sites.",
      "value-for-money":
        "Free + $20 Standard is a published SMB/mid-market floor vs ServiceNow quotes. Affiliate economics excluded.",
      "ai-capabilities":
        "Atlassian AI / virtual agent on paid clouds — assistance, not a standalone LLM.",
    },
    bestFor: [
      "Teams already on Jira Cloud who need a service desk",
      "IT/HR/ops request management next to engineering issues",
      "Buyers who want a published agent SKU under ServiceNow TCO",
    ],
    notIdealFor: [
      "Enterprises whose primary need is ServiceNow CMDB + ESM",
      "SMBs that want Freshservice’s simpler ITSM UX without Jira",
      "Observability-only buyers (Datadog)",
    ],
    pros: [
      "Lives next to Jira Software",
      "Published Free / Standard / Premium",
      "Assets and help center on paid clouds",
      "Atlassian ecosystem integrations",
      "On-call/alerting adjacency",
    ],
    cons: [
      "Easy to confuse with Jira Software",
      "Premium price jump",
      "Metered AI/assets",
      "ITSM depth vs ServiceNow",
      "Not a monitoring suite",
    ],
    keyFeatures: [
      "Request and incident management",
      "Help center / portal",
      "Assets (plan-gated depth)",
      "Change/problem on Premium+",
      "Jira and Slack/Teams native",
    ],
    whoShouldChoose:
      "Choose Jira Service Management when ITSM must sit on Jira Cloud — not as a Jira Software licence and not as ServiceNow.",
    whoShouldConsiderAlternatives:
      "Compare Freshservice for a dedicated ITSM SKU; ServiceNow for enterprise ESM.",
    alternativeSlugs: ["freshservice", "servicenow"],
    competitorSlugs: ["freshservice", "servicenow"],
    comparableSlugs: ["freshservice", "servicenow"],
    useCaseSlugs: ["itsm-service-desk"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["it-ops", "engineering"],
    sourcesExtra: [
      {
        id: "jsm-pricing",
        url: "https://www.atlassian.com/software/jira/service-management/pricing",
        title: "Jira Service Management pricing",
        domains: ["pricing", "plans", "free-plan"],
      },
    ],
  },
  {
    slug: "new-relic",
    name: "New Relic",
    company: "New Relic, Inc.",
    website: "https://newrelic.com",
    domain: "newrelic.com",
    pricingUrl: "https://newrelic.com/pricing",
    aliases: ["New Relic One", "NRQL", "New Relic APM"],
    membershipRole: "primary",
    jobCluster: "observability-monitoring",
    softShortDescription:
      "Observability — Free 100 GB ingest + 1 full user; Standard from $10 first full user then $99; data $0.40/GB after 100 GB; Pro $349/full user annual.",
    shortDescription:
      "New Relic is an all-in-one observability platform (APM, infra, logs, traces) billed on data ingest plus user type. Every edition includes 100 GB/month free ingest. Original data is $0.40/GB beyond that (Data Plus $0.60/GB). Basic users are free; Core users $49; Standard full-platform users start at $10 for the first then $99 (max 5). Pro full users are $349/user annual ($418.80 monthly). Enterprise is contact. Distinct from Datadog’s per-host infrastructure SKU.",
    vendorPositioning:
      "All your telemetry in one place — pay for data and the people who actually use the platform.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 10,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from newrelic.com/pricing (high confidence). 100 GB free ingest; $0.40/GB original / $0.60 Data Plus; Standard first full user $10 then $99 (cap 5); Core $49; Pro $349/full user annual. Affiliate economics excluded.",
    pricingSummary:
      "Free 100 GB + 1 full user. Standard from $10 first full user. Data $0.40/GB after 100 GB. Pro $349/full user annual. Confirm on newrelic.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description: "100 GB ingest/mo and one full platform user — community support.",
      },
      {
        kind: "per-seat-monthly",
        slug: "standard-first-user",
        name: "Standard (first full user)",
        amount: 10,
        highlighted: true,
        description: "$10 first full platform user; additional Standard full users $99 (max 5).",
      },
      {
        kind: "per-seat-annual",
        slug: "pro-full-user",
        name: "Pro (full platform user)",
        amount: 349,
        description: "$349/full user/mo billed annually ($418.80 monthly PAYG).",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "FedRAMP/HIPAA-oriented Data Plus and custom user rates — contact sales.",
      },
    ],
    featureOverrides: OBS_FEATURES,
    aiLines: [
      "ITSM AI copilot: limited",
      "Developer AI copilot: supported",
      "AI automation: limited",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Full-platform user prices jump hard after the $10 first seat (Standard) and again at Pro $349",
      "Ingest $0.40/GB after 100 GB is the other TCO lever vs Datadog hosts",
      "Standard caps at 5 full users — growing teams are pushed to Pro",
      "Not an ITSM service desk or git host",
      "Compute/CCU add-ons can appear on advanced capabilities",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 7,
      "it-job-fit": 9,
      "workflow-depth": 9,
      integrations: 8,
      "admin-security": 8,
      scalability: 9,
      "value-for-money": 7,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Unified NRQL/platform is powerful; pricing dimensions (users + GB) add buying friction.",
      "it-job-fit":
        "Observability suite — peer of Datadog/Grafana Cloud, not Freshservice.",
      "workflow-depth":
        "APM + logs + infra + traces in one product is deep; held at 9 vs Datadog’s modular breadth.",
      integrations: "Broad APM language/cloud integrations; incident paging still often PagerDuty.",
      "admin-security": "Pro/Enterprise add governance; Standard is SMB-grade.",
      scalability: "Data + user model scales; Pro user list price is steep.",
      "value-for-money":
        "Generous 100 GB free; full-user list prices are the gotcha vs Datadog host SKUs. Affiliate economics excluded.",
      "ai-capabilities":
        "Platform AI assistance exists; not the buying reason vs APM depth.",
    },
    bestFor: [
      "Teams that want APM + logs + infra in one ingest bill",
      "Orgs that can live with 1–5 Standard full users",
      "Buyers comparing usage-based observability to Datadog hosts",
    ],
    notIdealFor: [
      "ITSM-only buyers (Freshservice / ServiceNow)",
      "Teams standardised on Grafana OSS + cheap Cloud Pro usage",
      "On-call-only (PagerDuty)",
    ],
    pros: [
      "100 GB free ingest",
      "All-in-one APM/logs/infra",
      "Transparent user + GB list",
      "Free basic users",
      "Pro path for unlimited full users",
    ],
    cons: [
      "Full-user price cliff",
      "Standard 5-user cap",
      "GB overage",
      "Not ITSM or git",
      "CCU add-ons",
    ],
    keyFeatures: [
      "APM and distributed tracing",
      "Infrastructure metrics",
      "Log management",
      "NRQL querying",
      "User-type based access",
    ],
    whoShouldChoose:
      "Choose New Relic when unified observability billed on ingest + users is the job — not Datadog host packs and not ITSM.",
    whoShouldConsiderAlternatives:
      "Compare Datadog for host/module packaging; Grafana Cloud for OSS-aligned usage; PagerDuty for on-call.",
    alternativeSlugs: ["datadog", "grafana-cloud"],
    competitorSlugs: ["datadog", "grafana-cloud", "pagerduty"],
    comparableSlugs: ["datadog", "grafana-cloud"],
    useCaseSlugs: ["observability-monitoring"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering", "it-ops"],
    sourcesExtra: [
      {
        id: "newrelic-pricing",
        url: "https://newrelic.com/pricing",
        title: "New Relic pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },
  {
    slug: "grafana-cloud",
    name: "Grafana Cloud",
    company: "Grafana Labs",
    website: "https://grafana.com/products/cloud/",
    domain: "grafana.com",
    pricingUrl: "https://grafana.com/pricing/",
    aliases: ["Grafana", "Grafana Cloud Pro", "Mimir Loki Tempo"],
    membershipRole: "primary",
    jobCluster: "observability-monitoring",
    softShortDescription:
      "Managed Grafana observability — Free 10k series / 50 GB logs; Pro from $19/mo platform fee + usage ($6.50/1k series, $8/user).",
    shortDescription:
      "Grafana Cloud is Grafana Labs’ managed metrics/logs/traces/profiles stack (Mimir, Loki, Tempo, Pyroscope) plus Grafana. Free includes 10,000 active series, 50 GB logs/traces/profiles, 3 users, 14-day retention. Pro adds a published ~$19/month platform fee, longer retention, and usage rates (commonly $6.50 per 1,000 billable series and $8 per active visualisation user). Enterprise/Advanced is a spend-commit (~$25k/year cited) custom contract. Self-hosted Grafana OSS remains free and is a different buying motion.",
    vendorPositioning:
      "Open observability, managed — the Grafana you know, without running Mimir yourself.",
    pricingModel: "usage",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 19,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from Grafana Cloud pricing writeups aligned to grafana.com/pricing (high confidence for Free allowances and Pro $19 platform fee). Usage rates ($6.50/1k series, logs GB split) move — confirm live. Affiliate economics excluded.",
    pricingSummary:
      "Free generous telemetry caps. Pro from $19/mo + usage. Enterprise spend-commit custom. Confirm on grafana.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description: "10k series, 50 GB logs/traces/profiles, 3 users, 14-day retention.",
      },
      {
        kind: "flat-monthly",
        slug: "pro",
        name: "Pro (platform fee)",
        amount: 19,
        highlighted: true,
        description: "$19/mo platform fee plus usage above Free allowances.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Spend commit, SSO/audit, premium support — contact Grafana Labs.",
      },
    ],
    featureOverrides: {
      ...OBS_FEATURES,
      "dev-ai": "limited",
      "enterprise-security": "higher-plan-only",
    },
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Pro bills many usage dimensions — the $19 fee is not the bill",
      "Free retention is 14 days — production teams usually need Pro",
      "Enterprise security (SAML, audit) is not the Free/Pro default story",
      "Not ITSM or source control",
      "Running Grafana OSS yourself is a different TCO (people, not SaaS)",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 7,
      "it-job-fit": 8,
      "workflow-depth": 8,
      integrations: 8,
      "admin-security": 7,
      scalability: 8,
      "value-for-money": 8,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Grafana UX is familiar to OSS users; Cloud usage meters still need FinOps attention.",
      "it-job-fit":
        "Managed observability — cluster peer of Datadog/New Relic, not PagerDuty-only on-call.",
      "workflow-depth":
        "Metrics/logs/traces/profiles + dashboards are deep; less ‘single vendor APM suite’ than New Relic.",
      integrations: "Huge data-source ecosystem; Cloud is the hosted version of that.",
      "admin-security": "Enterprise SKU carries SAML/audit; Pro is usage-grade.",
      scalability: "Usage pricing scales; Enterprise commit for large estates.",
      "value-for-money":
        "Best Free telemetry cap in this wave; Pro is honest usage. Affiliate economics excluded.",
      "ai-capabilities":
        "AI is not the Grafana Cloud buying reason vs dashboards and telemetry.",
    },
    bestFor: [
      "Teams already fluent in Grafana/Prometheus",
      "Startups that fit in the Free telemetry caps",
      "Platform teams that want Mimir/Loki without operating it",
    ],
    notIdealFor: [
      "Buyers who want Datadog-style host SKUs and a single APM vendor UX",
      "ITSM desks (Freshservice)",
      "On-call-only (PagerDuty)",
    ],
    pros: [
      "Generous Free tier",
      "OSS-aligned stack",
      "Pro usage transparency",
      "Dashboards as the centre of gravity",
      "Enterprise path",
    ],
    cons: [
      "Many usage line items",
      "Shorter Free retention",
      "AI not a lead feature",
      "Not ITSM/git",
      "Enterprise is a spend commit",
    ],
    keyFeatures: [
      "Managed metrics (Mimir)",
      "Logs (Loki) and traces (Tempo)",
      "Grafana dashboards",
      "k6 / profiling (plan-gated)",
      "Free + Pro + Enterprise ladder",
    ],
    whoShouldChoose:
      "Choose Grafana Cloud when managed Grafana/LGTM telemetry is the job — not Datadog host modules and not ITSM.",
    whoShouldConsiderAlternatives:
      "Compare Datadog or New Relic for all-in-one APM suites; PagerDuty for paging.",
    alternativeSlugs: ["datadog", "new-relic"],
    competitorSlugs: ["datadog", "new-relic"],
    comparableSlugs: ["datadog", "new-relic"],
    useCaseSlugs: ["observability-monitoring"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering", "it-ops"],
    sourcesExtra: [
      {
        id: "grafana-cloud-pricing",
        url: "https://grafana.com/pricing/",
        title: "Grafana Cloud pricing",
        domains: ["pricing", "plans", "free-plan"],
      },
    ],
  },
  {
    slug: "pagerduty",
    name: "PagerDuty",
    company: "PagerDuty, Inc.",
    website: "https://www.pagerduty.com",
    domain: "pagerduty.com",
    pricingUrl: "https://www.pagerduty.com/pricing/",
    aliases: ["PagerDuty Operations Cloud", "PD"],
    membershipRole: "primary",
    jobCluster: "incident-oncall",
    softShortDescription:
      "On-call / incident response — Free ≤5 responders; Professional $21/user/mo annual ($25 monthly); Business $41 ($49 monthly); Enterprise contact.",
    shortDescription:
      "PagerDuty is an on-call scheduling, paging, and incident-response platform. Free covers up to 5 responders. Professional is $21/user/mo annual ($25 monthly); Business $41 annual ($49 monthly). Enterprise is quote. AIOps, extra status-page capacity, stakeholder licences, and PagerDuty Advance credits are commonly add-ons — the responder seat is not the whole bill. Distinct from Datadog/New Relic observability and from Freshservice ITSM.",
    vendorPositioning:
      "The operations cloud that pages the right human when something breaks.",
    pricingModel: "per-seat",
    hasFreePlan: true,
    hasFreeTrial: true,
    startingPriceMonthly: 21,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from PagerDuty pricing corroboration aligned to pagerduty.com/pricing (high confidence). Free ≤5; Professional $21/$25; Business $41/$49 per responder. Add-ons (AIOps, Advance, status pages) extra. Affiliate economics excluded.",
    pricingSummary:
      "Free ≤5 responders. Professional $21/user/mo annual. Business $41 annual. Enterprise quote. Confirm add-ons on pagerduty.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        limits: { maxUsers: 5 },
        description: "Up to 5 responders — basic alerting and one escalation policy.",
      },
      {
        kind: "per-seat-annual",
        slug: "professional",
        name: "Professional",
        amount: 21,
        highlighted: true,
        description: "$21/responder/mo annual ($25 monthly) — schedules, policies, integrations.",
      },
      {
        kind: "per-seat-annual",
        slug: "business",
        name: "Business",
        amount: 41,
        description: "$41/responder/mo annual ($49 monthly) — analytics, advanced admin, higher limits.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Governance, provisioning depth, bundled add-ons — contact sales.",
      },
    ],
    featureOverrides: {
      "incident-management": "supported",
      "oncall-paging": "supported",
      "change-problem": "limited",
      "infrastructure-monitoring": "limited",
      "apm-tracing": "not-supported",
      "log-management": "not-supported",
      "itsm-ai": "limited",
      "dev-ai": "limited",
      "enterprise-security": "higher-plan-only",
      "analytics-reporting": "supported",
    },
    aiLines: [
      "ITSM AI copilot: limited",
      "Developer AI copilot: limited",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Does not replace Datadog/New Relic telemetry — it pages people",
      "AIOps / Advance / status pages often stack on responder seats",
      "Not an ITSM CMDB (ServiceNow / Freshservice)",
      "Stakeholder (read-only) licences are extra on many plans",
      "Free is a 5-responder cap",
    ],
    limitationKinds: [
      "feature-unavailable",
      "plan-restriction",
      "feature-unavailable",
      "plan-restriction",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 8,
      "it-job-fit": 9,
      "workflow-depth": 8,
      integrations: 9,
      "admin-security": 8,
      scalability: 9,
      "value-for-money": 7,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Schedules and mobile paging are straightforward for SRE teams. Not a lab test.",
      "it-job-fit":
        "Incident-oncall cluster — do not rank as an observability peer of Datadog.",
      "workflow-depth":
        "Escalation, major-incident workflows, and status pages (plan-gated) are deep for paging; not ITIL CMDB depth.",
      integrations: "Native hooks into Datadog, cloud, Slack/Teams are the product.",
      "admin-security": "SSO and advanced admin rise on Business/Enterprise.",
      scalability: "Unlimited responders on paid plans; add-ons scale cost.",
      "value-for-money":
        "$21 Professional is a clear floor; add-ons are the TCO trap. Affiliate economics excluded.",
      "ai-capabilities":
        "Advance/AIOps are add-ons, not included intelligence on Professional.",
    },
    bestFor: [
      "SRE/IT teams that need on-call schedules and paging",
      "Orgs already sending alerts from Datadog/CloudWatch",
      "Incident commanders who want a dedicated ops cloud",
    ],
    notIdealFor: [
      "Teams that only need APM dashboards (New Relic / Grafana)",
      "ITSM ticket desks without paging (Freshservice)",
      "Git hosts (GitHub / GitLab)",
    ],
    pros: [
      "Category-defining on-call",
      "Published Professional/Business seats",
      "Deep alerting integrations",
      "Free 5-responder trial path",
      "Enterprise governance path",
    ],
    cons: [
      "Add-on math (AIOps, Advance, stakeholders)",
      "Not observability telemetry",
      "Not ITSM CMDB",
      "AI not included by default",
      "Responder definition can surprise finance",
    ],
    keyFeatures: [
      "On-call schedules",
      "Escalation policies",
      "Mobile/voice/SMS paging",
      "Incident workflows",
      "Alerting integrations",
    ],
    whoShouldChoose:
      "Choose PagerDuty when paging and incident response are the job — not when you need Datadog telemetry or ServiceNow ITSM.",
    whoShouldConsiderAlternatives:
      "Compare Datadog if you only need monitors+some incident UI; JSM if Atlassian ops alerting is enough.",
    alternativeSlugs: ["datadog", "jira-service-management"],
    competitorSlugs: ["datadog", "grafana-cloud", "jira-service-management"],
    comparableSlugs: ["datadog", "jira-service-management"],
    useCaseSlugs: ["incident-oncall"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering", "it-ops"],
    sourcesExtra: [
      {
        id: "pagerduty-pricing",
        url: "https://www.pagerduty.com/pricing/",
        title: "PagerDuty pricing",
        domains: ["pricing", "plans", "free-plan"],
      },
    ],
  },
  {
    slug: "gitlab",
    name: "GitLab",
    company: "GitLab Inc.",
    website: "https://gitlab.com",
    domain: "gitlab.com",
    pricingUrl: "https://about.gitlab.com/pricing/",
    aliases: ["GitLab.com", "GitLab Premium", "GitLab Ultimate"],
    membershipRole: "primary",
    jobCluster: "source-control-devops",
    softShortDescription:
      "DevSecOps platform — Free; Premium $29/user/mo billed annually; Ultimate custom on current GitLab pricing page.",
    shortDescription:
      "GitLab is a single application for source control, CI/CD, security, and (on higher tiers) DevSecOps. SaaS Free covers small private namespaces with CI minute/storage caps. Premium is $29/user/month billed annually (no true month-to-month on paid). Ultimate is listed as custom/contact on GitLab’s current pricing page (historically $99/user/mo — confirm live). Self-managed SKUs exist separately. Distinct from GitHub (source-control cluster peer) and from GitHub Copilot (AI coding product).",
    vendorPositioning:
      "The DevSecOps platform — repo, CI, and security in one licence rather than a toolbox of point tools.",
    pricingModel: "per-seat",
    hasFreePlan: true,
    hasFreeTrial: true,
    startingPriceMonthly: 29,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from about.gitlab.com/pricing (high confidence for Premium $29/user/mo annual). Ultimate is contact/custom on the live page. CI minutes and storage gate Free. Affiliate economics excluded.",
    pricingSummary:
      "Free with CI/storage caps. Premium $29/user/mo billed annually. Ultimate custom. Confirm on about.gitlab.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description: "SaaS Free — CI minute and storage caps; small private namespaces.",
      },
      {
        kind: "per-seat-annual",
        slug: "premium",
        name: "Premium",
        amount: 29,
        highlighted: true,
        hasFreeTrial: true,
        description: "$29/user/mo billed annually — MR approvals, more CI, SSO-oriented features.",
      },
      {
        kind: "contact-sales",
        slug: "ultimate",
        name: "Ultimate",
        description: "Advanced security/compliance — custom pricing on current GitLab page.",
      },
    ],
    featureOverrides: {
      ...SCM_FEATURES,
      "dev-ai": "supported",
    },
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: supported",
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
      "Paid SaaS is annual — no month-to-month Premium",
      "Ultimate security suite is quote-gated on the current page",
      "Not GitHub Copilot; GitLab Duo/AI is a platform feature, not the ai-code entity",
      "CI minute overages on Free/low tiers",
      "Not observability or ITSM",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "other",
      "plan-restriction",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 7,
      "it-job-fit": 9,
      "workflow-depth": 9,
      integrations: 8,
      "admin-security": 9,
      scalability: 9,
      "value-for-money": 7,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "One application is conceptually simple; GitLab’s surface area is still large vs GitHub-for-git-only.",
      "it-job-fit":
        "Source-control + CI/CD DevOps platform — peer of GitHub/Bitbucket, not Datadog.",
      "workflow-depth":
        "Repo + CI + security in one product is the depth lead vs Bitbucket; GitHub remains the network-effect peer.",
      integrations: "Jira/Slack native; GitHub-equivalent marketplace is thinner.",
      "admin-security": "Premium/Ultimate are built for SSO, approvals, and compliance.",
      scalability: "SaaS and self-managed scale paths.",
      "value-for-money":
        "$29 Premium vs GitHub Team $4 is a different product (CI/DevSecOps). Fair for the scope; not a cheap git host. Affiliate economics excluded.",
      "ai-capabilities":
        "GitLab Duo / AI features on paid platforms — scored as platform AI, not GitHub Copilot.",
    },
    bestFor: [
      "Teams that want git + CI + security in one licence",
      "Self-managed / data-residency buyers",
      "Orgs leaving a many-tool DevOps stack",
    ],
    notIdealFor: [
      "Teams that only need cheap git hosting (GitHub Free / Bitbucket)",
      "AI-IDE-only buyers (Cursor)",
      "Observability-only (Datadog)",
    ],
    pros: [
      "All-in-one DevSecOps",
      "Published Premium $29 annual",
      "Self-managed option",
      "Strong MR/CI depth",
      "AI on the platform (Duo)",
    ],
    cons: [
      "Annual-only paid SaaS",
      "Ultimate quote",
      "Heavier than git-only",
      "Network effect vs GitHub",
      "CI minute gates on Free",
    ],
    keyFeatures: [
      "Git repositories and MRs",
      "CI/CD pipelines",
      "Security scanning (Ultimate-oriented)",
      "Project planning on higher tiers",
      "GitLab Duo AI assistance",
    ],
    whoShouldChoose:
      "Choose GitLab when a DevSecOps platform (git + CI + security) is the job — not GitHub Copilot and not Bitbucket-as-cheap-git.",
    whoShouldConsiderAlternatives:
      "Compare GitHub for ecosystem + Actions; Bitbucket if you are Atlassian-native and need cheaper git+Pipelines.",
    alternativeSlugs: ["github", "bitbucket"],
    competitorSlugs: ["github", "bitbucket"],
    comparableSlugs: ["github", "bitbucket"],
    useCaseSlugs: ["source-control-devops"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering"],
    sourcesExtra: [
      {
        id: "gitlab-pricing",
        url: "https://about.gitlab.com/pricing/",
        title: "GitLab pricing",
        domains: ["pricing", "plans", "free-plan"],
      },
    ],
  },
  {
    slug: "bitbucket",
    name: "Bitbucket Cloud",
    company: "Atlassian",
    website: "https://bitbucket.org",
    domain: "bitbucket.org",
    pricingUrl: "https://www.atlassian.com/software/bitbucket/pricing",
    aliases: ["Bitbucket", "Bitbucket Pipelines", "Atlassian Bitbucket"],
    membershipRole: "primary",
    jobCluster: "source-control-devops",
    softShortDescription:
      "Atlassian git hosting — Free ≤5 users; Standard $3.65/user/mo (min 5-user equivalent); Premium $7.25/user/mo.",
    shortDescription:
      "Bitbucket Cloud is Atlassian’s Git host with Pipelines CI. Free is unlimited repos for up to 5 users (50 build minutes, 1 GB LFS). Standard is $3.65/user/month with a 5-user minimum bill (~$18.25). Premium is $7.25/user/month (~$36.25 minimum) with IP allowlisting, enforced merge checks, and more minutes. 30-day paid trials typical. Best when the team already lives in Jira — not a GitHub social/ecosystem substitute.",
    vendorPositioning:
      "Git and CI for Jira teams — cheaper seats, Atlassian-native.",
    pricingModel: "per-seat",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 30,
    startingPriceMonthly: 3.65,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from atlassian.com/software/bitbucket/pricing (high confidence). Free ≤5 users; Standard $3.65/user; Premium $7.25/user; 5-user minimum on paid. Build minutes 2,500 / 3,500. Affiliate economics excluded.",
    pricingSummary:
      "Free ≤5 users. Standard $3.65/user/mo. Premium $7.25/user/mo. 5-user minimum on paid. Confirm on Atlassian Bitbucket pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        limits: { maxUsers: 5 },
        description: "Up to 5 users — 50 Pipelines minutes, 1 GB LFS.",
      },
      {
        kind: "per-seat-monthly",
        slug: "standard",
        name: "Standard",
        amount: 3.65,
        highlighted: true,
        minimumSeats: 5,
        hasFreeTrial: true,
        trialDays: 30,
        description: "$3.65/user/mo — 2,500 build minutes, 5 GB LFS; billed at least 5 users.",
      },
      {
        kind: "per-seat-monthly",
        slug: "premium",
        name: "Premium",
        amount: 7.25,
        minimumSeats: 5,
        description: "$7.25/user/mo — 3,500 minutes, IP allowlist, merge checks, 10 GB LFS.",
      },
    ],
    featureOverrides: {
      ...SCM_FEATURES,
      "dev-ai": "limited",
      "enterprise-security": "higher-plan-only",
    },
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "zapier", kind: "zapier-style" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Paid plans bill a 5-user floor even for 2-person teams",
      "Ecosystem and Actions marketplace trail GitHub",
      "DevSecOps depth trails GitLab Ultimate",
      "SAML SSO often needs Atlassian Guard extra",
      "Not observability or ITSM (use JSM separately)",
    ],
    limitationKinds: [
      "plan-restriction",
      "other",
      "other",
      "plan-restriction",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "it-job-fit": 7,
      "workflow-depth": 7,
      integrations: 9,
      "admin-security": 7,
      scalability: 8,
      "value-for-money": 9,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Simple git + Pipelines for Jira-native teams. Not a lab test.",
      "it-job-fit":
        "Source-control hosting — peer of GitHub/GitLab, weaker as a full DevSecOps platform than GitLab.",
      "workflow-depth":
        "Repos + Pipelines + Jira links; less platform depth than GitLab, less ecosystem than GitHub.",
      integrations: "Best Jira-native git host in the cluster.",
      "admin-security": "Premium adds IP allowlist and merge checks; Guard extra for SSO.",
      scalability: "Cloud user scale is fine; Data Center is a different SKU.",
      "value-for-money":
        "Lowest published paid git seat in this wave; 5-user minimum is the catch. Affiliate economics excluded.",
      "ai-capabilities":
        "Atlassian AI is not the reason to pick Bitbucket vs GitHub Copilot.",
    },
    bestFor: [
      "Jira Cloud teams that want cheap git + Pipelines",
      "Small orgs that fit in Free (≤5 users)",
      "Premium buyers who need IP allowlisting",
    ],
    notIdealFor: [
      "Open-source / GitHub-ecosystem-first teams",
      "DevSecOps consolidation (GitLab)",
      "AI-native coding (Cursor)",
    ],
    pros: [
      "Low Standard seat price",
      "Jira-native",
      "Real Free 5-user tier",
      "Pipelines included",
      "Premium security controls",
    ],
    cons: [
      "5-user paid minimum",
      "Thinner ecosystem vs GitHub",
      "DevSecOps vs GitLab",
      "Guard extra for SSO",
      "AI not a lead feature",
    ],
    keyFeatures: [
      "Git hosting",
      "Bitbucket Pipelines",
      "Jira integration",
      "Merge checks / IP allowlist (Premium)",
      "LFS and build-minute packs",
    ],
    whoShouldChoose:
      "Choose Bitbucket Cloud when cheap Atlassian-native git + Pipelines is the job — not GitHub’s ecosystem and not GitLab DevSecOps.",
    whoShouldConsiderAlternatives:
      "Compare GitHub for ecosystem/Actions; GitLab for CI+security in one platform.",
    alternativeSlugs: ["github", "gitlab"],
    competitorSlugs: ["github", "gitlab"],
    comparableSlugs: ["github", "gitlab"],
    useCaseSlugs: ["source-control-devops"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    teamTypeSlugs: ["engineering"],
    sourcesExtra: [
      {
        id: "bitbucket-pricing",
        url: "https://www.atlassian.com/software/bitbucket/pricing",
        title: "Bitbucket pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },
  {
    slug: "cpanel",
    name: "cPanel",
    company: "WebPros International, LLC",
    website: "https://cpanel.net",
    domain: "cpanel.net",
    pricingUrl: "https://cpanel.net/pricing/",
    aliases: ["cPanel & WHM", "WHM", "cPanel Solo"],
    membershipRole: "primary",
    jobCluster: "hosting-operations",
    softShortDescription:
      "Hosting control panel — Solo $29.99/mo (1 account); Admin $35.99 (≤5); Pro $53.99 (≤30); Premier $69.99 (100 accounts + $0.49 extra).",
    shortDescription:
      "cPanel & WHM is the incumbent Linux hosting control panel licensed per server by account count. Direct store (from 16 Dec 2025 / 2026 list): Solo $29.99/mo (1 account, Cloud/VPS), Admin $35.99 (≤5), Pro $53.99 (≤30), Premier $69.99 (100 accounts, then $0.49/account). Premier is required for metal/dedicated. 15-day trial typical. Hosts often bundle cheaper distributor licences — the store list is the public floor. Distinct from Plesk (Windows/Linux panel peer) and from cloud IaaS.",
    vendorPositioning:
      "The hosting panel the web host industry standardised on — accounts, email, and sites on a VPS.",
    pricingModel: "flat",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 15,
    startingPriceMonthly: 29.99,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from cPanel Store license pricing articles (high confidence). Solo $29.99 / Admin $35.99 / Pro $53.99 / Premier $69.99 monthly. Affiliate economics excluded.",
    pricingSummary:
      "No free plan. Solo $29.99/mo (1 account). Admin $35.99. Pro $53.99. Premier $69.99. Confirm on cpanel.net/pricing.",
    plans: [
      {
        kind: "flat-monthly",
        slug: "solo",
        name: "Solo Cloud",
        amount: 29.99,
        hasFreeTrial: true,
        trialDays: 15,
        description: "$29.99/mo — 1 cPanel account, Cloud/VPS only.",
      },
      {
        kind: "flat-monthly",
        slug: "admin",
        name: "Admin Cloud",
        amount: 35.99,
        highlighted: true,
        description: "$35.99/mo — up to 5 accounts, Cloud/VPS.",
      },
      {
        kind: "flat-monthly",
        slug: "pro",
        name: "Pro Cloud",
        amount: 53.99,
        description: "$53.99/mo — up to 30 accounts, Cloud/VPS.",
      },
      {
        kind: "flat-monthly",
        slug: "premier",
        name: "Premier",
        amount: 69.99,
        description: "$69.99/mo — 100 accounts then $0.49 each; Cloud or metal.",
      },
    ],
    featureOverrides: {
      "hosting-panel": "supported",
      "incident-management": "not-supported",
      "source-control": "not-supported",
      "infrastructure-monitoring": "limited",
      "enterprise-security": "limited",
      "dev-ai": "not-supported",
      "itsm-ai": "not-supported",
      "analytics-reporting": "limited",
    },
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: not-supported",
      "AI automation: not-supported",
      "AI recommendations: not-supported",
    ],
    integrations: [{ integrationSlug: "api", kind: "api" }],
    limitations: [
      "Licence is per server/accounts — not a cloud app seat",
      "Repeated list-price increases vs historic unlimited licences",
      "Solo/Admin/Pro are Cloud/VPS-only — dedicated needs Premier",
      "Not ITSM, git, or observability",
      "AI is not part of the product story",
    ],
    limitationKinds: [
      "other",
      "other",
      "plan-restriction",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "it-job-fit": 10,
      "workflow-depth": 8,
      integrations: 7,
      "admin-security": 7,
      scalability: 9,
      "value-for-money": 6,
      "ai-capabilities": 3,
    },
    scoreRationales: {
      "ease-of-use":
        "Industry-standard WHM/cPanel UX for hosts and agencies. Not a lab test.",
      "it-job-fit":
        "Hosting control panel — peer of Plesk, not GitHub or Datadog.",
      "workflow-depth":
        "Accounts, DNS, email, backups, and WHM automation are deep for the panel job.",
      integrations: "Hosting ecosystem and API; not a SaaS integration graph.",
      "admin-security":
        "Hardening is operator-dependent; panel provides the controls.",
      scalability: "Premier + per-account overage is how hosts scale.",
      "value-for-money":
        "Store list is high vs older cPanel lore and vs Plesk Web Admin; distributors may be cheaper. Affiliate economics excluded.",
      "ai-capabilities":
        "Not an AI product — scored low on the IT methodology’s AI criterion without pretending otherwise.",
    },
    bestFor: [
      "Web hosts and agencies administering many accounts on a VPS",
      "Operators who need the cPanel ecosystem (installers, WHM)",
      "Premier buyers on dedicated/metal",
    ],
    notIdealFor: [
      "Teams that only need GitHub/GitLab",
      "ITSM buyers",
      "Buyers seeking published AI hosting features",
    ],
    pros: [
      "Incumbent hosting-panel standard",
      "Clear account-count SKUs",
      "WHM for resellers",
      "15-day trial",
      "Premier metal path",
    ],
    cons: [
      "Higher 2026 store list vs history",
      "Cloud vs metal SKU split",
      "No AI story",
      "Not git/ITSM/observability",
      "Per-account Premier overage",
    ],
    keyFeatures: [
      "cPanel account hosting",
      "WHM server admin",
      "Email, DNS, backups",
      "Account-count licence tiers",
      "API / automation",
    ],
    whoShouldChoose:
      "Choose cPanel when Linux hosting-account administration is the job — not Plesk-by-default without checking Windows needs, and not a DevOps platform.",
    whoShouldConsiderAlternatives:
      "Compare Plesk for mixed Windows/Linux panels and often simpler published Web Admin pricing.",
    alternativeSlugs: ["plesk"],
    competitorSlugs: ["plesk"],
    comparableSlugs: ["plesk"],
    useCaseSlugs: ["hosting-operations"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    teamTypeSlugs: ["it-ops", "operations"],
    sourcesExtra: [
      {
        id: "cpanel-store-pricing-2026",
        url: "https://support.cpanel.net/hc/en-us/articles/30117774089879-2026-cPanel-Store-License-Pricing",
        title: "2026 cPanel Store License Pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
];

export const PRODUCTS = COMPACT.map(expandItProduct);

export const COMPARISON_PAIRS = [
  ["servicenow", "freshservice"],
  ["jira-service-management", "freshservice"],
  ["servicenow", "jira-service-management"],
  ["new-relic", "datadog"],
  ["grafana-cloud", "datadog"],
  ["pagerduty", "datadog"],
  ["gitlab", "github"],
  ["bitbucket", "github"],
  ["cpanel", "plesk"],
];
