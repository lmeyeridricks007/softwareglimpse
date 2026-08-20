/**
 * IT industry Tier-A (compact).
 * splunk, elastic-observability, sentry, incident-io, circleci,
 * directadmin, kinsta, smartproxy (Decodo).
 *
 * Pricing grounded 2026-08-18 from first-party pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 *
 * Datadog (8.6) remains the observability-monitoring cluster award.
 * PagerDuty (8.0) remains the incident-oncall award.
 * Plesk (7.4) remains the hosting-operations award.
 * WP Engine (7.7) remains the hosting-providers award.
 * Bright Data (7.7) remains the web-data-collection award.
 */
import { expandItProduct } from "./it-compact-expand.mjs";

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

const SENTRY_FEATURES = {
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

const PANEL_FEATURES = {
  "incident-management": "not-supported",
  "change-problem": "not-supported",
  "service-catalog": "not-supported",
  "infrastructure-monitoring": "limited",
  "apm-tracing": "not-supported",
  "log-management": "limited",
  "source-control": "not-supported",
  "cicd-actions": "not-supported",
  "hosting-panel": "supported",
  "managed-hosting": "not-supported",
  "proxy-network": "not-supported",
  "itsm-ai": "not-supported",
  "dev-ai": "not-supported",
  "oncall-paging": "not-supported",
  "enterprise-security": "limited",
  "analytics-reporting": "limited",
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
  "enterprise-security": "supported",
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
    slug: "splunk",
    name: "Splunk Observability Cloud",
    company: "Splunk LLC (Cisco company)",
    website: "https://www.splunk.com",
    domain: "splunk.com",
    pricingUrl:
      "https://www.splunk.com/en_us/products/pricing/observability.html",
    aliases: ["Splunk", "Splunk Observability", "Splunk O11y"],
    membershipRole: "primary",
    jobCluster: "observability-monitoring",
    softShortDescription:
      "Splunk Observability Cloud — Infrastructure Monitoring from $15/host/mo annual; App & Infra $60/host; End-to-End $75/host; free up to 15 hosts. Not Splunk Platform/SIEM ingest.",
    shortDescription:
      "Splunk Observability Cloud is Cisco/Splunk’s hosted metrics, APM, and full-stack observability SKU. It is not Splunk Platform (Enterprise/Cloud) SIEM ingest pricing — do not treat ingest-GB Platform tiles as this product’s floor. Infrastructure Monitoring publishes from $15/host/month billed annually; App & Infra Monitoring $60/host; End-to-End Observability $75/host. Splunk FAQ documents a free path up to 15 hosts. Same observability-monitoring cluster as Datadog — Datadog remains the cluster award (8.6); this entity does not outrank it.",
    vendorPositioning:
      "Host-priced observability from Splunk — metrics, APM, and end-to-end visibility without buying Splunk Platform ingest.",
    pricingModel: "usage",
    hasFreePlan: true,
    hasFreeTrial: true,
    startingPriceMonthly: 15,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from splunk.com observability pricing (high confidence). Infrastructure Monitoring $15/host/mo annual; App & Infra $60/host; End-to-End $75/host. Free up to 15 hosts per Splunk FAQ. This is Observability Cloud, not Splunk Platform/SIEM ingest. Affiliate economics excluded.",
    pricingSummary:
      "Free up to 15 hosts. Infrastructure Monitoring from $15/host/mo annual. App & Infra $60/host. End-to-End $75/host. Confirm live — not Splunk Platform ingest pricing.",
    plans: [
      {
        kind: "free",
        slug: "free-15-hosts",
        name: "Free (up to 15 hosts)",
        limits: ["Up to 15 hosts per Splunk FAQ"],
        description:
          "Free Observability Cloud path up to 15 hosts — confirm live FAQ allowances.",
      },
      {
        kind: "per-host-annual",
        slug: "infrastructure-monitoring",
        name: "Infrastructure Monitoring",
        amount: 15,
        highlighted: true,
        hasFreeTrial: true,
        description:
          "$15/host/month billed annually — Observability Cloud infrastructure floor, not Platform ingest.",
      },
      {
        kind: "per-host-annual",
        slug: "app-infra",
        name: "App & Infra Monitoring",
        amount: 60,
        description: "$60/host — application plus infrastructure monitoring pack.",
      },
      {
        kind: "per-host-annual",
        slug: "end-to-end",
        name: "End-to-End Observability",
        amount: 75,
        description: "$75/host — full Observability Cloud pack on published pricing.",
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
      { integrationSlug: "pagerduty", kind: "native" },
    ],
    limitations: [
      "Observability Cloud host SKUs are not Splunk Platform/SIEM ingest-GB pricing — do not mix floors",
      "Does not outrank Datadog (8.6) as the observability cluster award",
      "App & Infra $60 and End-to-End $75 stack well above the $15 infrastructure floor",
      "Not ITSM, source control, hosting panel, or managed hosting",
      "Free 15-host FAQ cap is an evaluation/small-estate path, not unlimited telemetry",
    ],
    limitationKinds: [
      "other",
      "other",
      "plan-restriction",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 6,
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
        "Enterprise observability plus Splunk-family SKU confusion (Cloud vs Platform) raise the learning curve. Not a lab test.",
      "it-job-fit":
        "Observability Cloud is a real infra/APM/logs peer of Datadog — ranked in observability-monitoring, not as SIEM ingest.",
      "workflow-depth":
        "Host packs from infra through end-to-end cover a deep SRE loop; held at 8 versus Datadog’s modular breadth.",
      integrations: "Cloud, chat, and on-call hooks are a published Observability Cloud story.",
      "admin-security":
        "Cisco/Splunk enterprise security posture is a buying reason versus SMB observability tiles.",
      scalability: "Host-priced packs and Cisco-scale estates; TCO still follows host count and pack choice.",
      "value-for-money":
        "Published $15/host floor matches Datadog’s infra tile; $60/$75 packs and SKU confusion cut value. Affiliate economics excluded.",
      "ai-capabilities":
        "Observability AI assist exists — scored as supporting, not a reason to skip Datadog.",
    },
    bestFor: [
      "SRE teams that want Splunk Observability Cloud host packs rather than Platform ingest",
      "Cisco/Splunk-aligned estates that need metrics and APM in one Cloud SKU",
      "Buyers who will model $15 vs $60 vs $75 host packs before commit",
    ],
    notIdealFor: [
      "Teams buying Splunk Platform/SIEM ingest as if it were this SKU",
      "Buyers who need Datadog’s broader module catalogue as the default award path",
      "ITSM, git, or hosting-panel purchases",
    ],
    pros: [
      "Published $15/host Infrastructure Monitoring floor",
      "Clear App & Infra and End-to-End pack ladder",
      "Free path up to 15 hosts (FAQ)",
      "Enterprise admin-security posture",
      "Distinct Observability Cloud identity vs Platform SIEM",
    ],
    cons: [
      "Easy to confuse with Splunk Platform ingest pricing",
      "Does not outrank Datadog",
      "$60/$75 packs raise TCO fast",
      "Heavier ease-of-use than specialist error tools",
      "Not ITSM/git/hosting",
    ],
    keyFeatures: [
      "Infrastructure Monitoring (host-priced)",
      "APM / App & Infra pack",
      "End-to-End Observability pack",
      "Free up to 15 hosts (FAQ)",
      "Cloud and on-call integrations",
    ],
    whoShouldChoose:
      "Choose Splunk Observability Cloud when Cisco/Splunk host-priced observability is the job — not Splunk Platform SIEM ingest, and not Datadog by default.",
    whoShouldConsiderAlternatives:
      "Compare Datadog for the observability award path; Elastic Observability for Elastic Cloud; Sentry for error/tracing specialists.",
    alternativeSlugs: ["datadog", "elastic-observability", "sentry"],
    competitorSlugs: [
      "datadog",
      "new-relic",
      "dynatrace",
      "grafana-cloud",
      "elastic-observability",
      "sentry",
    ],
    comparableSlugs: ["datadog", "dynatrace", "elastic-observability"],
    useCaseSlugs: ["observability-monitoring"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "engineering"],
    sourcesExtra: [
      {
        id: "splunk-observability-pricing",
        url: "https://www.splunk.com/en_us/products/pricing/observability.html",
        title: "Splunk Observability pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },
  {
    slug: "elastic-observability",
    name: "Elastic Observability",
    company: "Elasticsearch B.V. / Elastic N.V.",
    website: "https://www.elastic.co",
    domain: "elastic.co",
    pricingUrl: "https://www.elastic.co/pricing",
    aliases: [
      "Elastic Cloud Observability",
      "Elastic Observability Cloud",
      "ELK Observability",
    ],
    membershipRole: "primary",
    jobCluster: "observability-monitoring",
    softShortDescription:
      "Observability on Elastic Cloud — Hosted Standard from $99/mo (120 GB / 2 zones); Serverless Observability usage from ~$0.07–$0.09/GB ingest; self-managed OSS path.",
    shortDescription:
      "Elastic Observability is Elastic’s metrics, logs, traces, and APM solution on Elastic Cloud — not the Elasticsearch search product alone. Elastic Cloud Hosted Standard publishes as low as $99/month for a small production config (120 GB storage / 2 zones on elastic.co/pricing/cloud-hosted). Serverless Observability is usage-based ingest (commonly cited ~$0.07–$0.09/GB). Self-managed Elastic Stack remains a separate OSS/licence path. Same observability-monitoring cluster as Datadog and Grafana Cloud.",
    vendorPositioning:
      "Open observability on Elastic Cloud — logs, metrics, and traces without treating search-only Elasticsearch as the SKU.",
    pricingModel: "usage",
    hasFreePlan: true,
    hasFreeTrial: true,
    startingPriceMonthly: 99,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from elastic.co/pricing and elastic.co/pricing/cloud-hosted (high confidence on Hosted Standard as low as $99/mo for 120 GB / 2 zones). Serverless Observability is usage-based (~$0.07–$0.09/GB ingest commonly cited — confirm live). Self-managed OSS is a different buying motion. Affiliate economics excluded.",
    pricingSummary:
      "Elastic Cloud Hosted Standard from $99/mo (small 120 GB / 2-zone config). Serverless Observability usage-based ingest. Self-managed OSS path. Confirm live on elastic.co/pricing.",
    plans: [
      {
        kind: "free",
        slug: "self-managed-oss",
        name: "Self-managed (OSS path)",
        description:
          "Run Elastic Stack yourself — not the $99 Hosted Standard Cloud floor; you pay infrastructure.",
      },
      {
        kind: "flat-monthly",
        slug: "cloud-hosted-standard",
        name: "Elastic Cloud Hosted Standard",
        amount: 99,
        highlighted: true,
        hasFreeTrial: true,
        description:
          "As low as $99/mo for a small hosted production config (120 GB storage / 2 zones). Resource-based — not a flat all-you-can-ingest tile.",
      },
      {
        kind: "contact-sales",
        slug: "serverless-observability",
        name: "Serverless Observability",
        description:
          "Usage-based ingest (commonly ~$0.07–$0.09/GB) — confirm live serverless rates. Not the $99 hosted floor.",
      },
    ],
    featureOverrides: OBS_FEATURES,
    aiLines: [
      "ITSM AI copilot: limited",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "aws", kind: "native" },
      { integrationSlug: "api", kind: "api" },
      { integrationSlug: "slack", kind: "native" },
    ],
    limitations: [
      "This entity is Elastic Observability on Cloud — not “Elasticsearch search product only”",
      "$99 Hosted Standard is a small 120 GB / 2-zone floor; real TCO follows resources",
      "Serverless ingest rates are a different SKU from Hosted Standard $99",
      "Self-managed OSS is people/infra cost, not a SaaS seat",
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
      "ease-of-use": 6,
      "it-job-fit": 8,
      "workflow-depth": 8,
      integrations: 8,
      "admin-security": 8,
      scalability: 9,
      "value-for-money": 8,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Elastic Cloud plus cluster sizing is more ops-heavy than Datadog host tiles. Not a lab test.",
      "it-job-fit":
        "Observability solution on Elastic Cloud — cluster peer of Datadog/Grafana Cloud, not a search-only SKU.",
      "workflow-depth":
        "Logs, metrics, traces, and APM on Elastic are deep; Hosted vs Serverless vs self-managed is the packaging tax.",
      integrations: "Beats/Agent, cloud, and API ecosystem are the integration story.",
      "admin-security":
        "Cloud subscription tiers gate support/SLA; enterprise security is real on paid Cloud.",
      scalability: "Hosted resource scaling and serverless ingest both scale; TCO follows data.",
      "value-for-money":
        "Published $99 hosted floor plus OSS self-managed path is clearer than Dynatrace DPS. Affiliate economics excluded.",
      "ai-capabilities":
        "AI is not the Elastic Observability buying reason versus telemetry depth.",
    },
    bestFor: [
      "Teams already on Elasticsearch who want Observability as the Cloud solution",
      "Buyers comparing Grafana Cloud OSS-aligned stacks to Elastic Cloud",
      "Orgs that will actually size the $99 hosted config versus serverless ingest",
    ],
    notIdealFor: [
      "Search-only Elasticsearch buyers who do not need observability",
      "Teams that want Datadog’s published per-host Infrastructure Pro tile only",
      "ITSM or git purchases",
    ],
    pros: [
      "Published Hosted Standard from $99/mo",
      "Observability identity distinct from search-only",
      "Serverless ingest option",
      "Self-managed OSS path",
      "Strong log/metrics/trace depth",
    ],
    cons: [
      "$99 is not all-in TCO",
      "Cluster sizing learning curve",
      "AI is not a lead feature",
      "Not Datadog host-SKU simplicity",
      "Not ITSM/git/hosting",
    ],
    keyFeatures: [
      "Elastic Cloud Hosted Observability",
      "Logs, metrics, and traces",
      "APM",
      "Serverless Observability ingest",
      "Self-managed Elastic Stack option",
    ],
    whoShouldChoose:
      "Choose Elastic Observability when Elastic Cloud telemetry (not search-only Elasticsearch) is the job — not Datadog host modules by default.",
    whoShouldConsiderAlternatives:
      "Compare Grafana Cloud for OSS-aligned managed telemetry; Datadog or Splunk Observability Cloud for host-priced suites.",
    alternativeSlugs: ["datadog", "grafana-cloud", "splunk"],
    competitorSlugs: [
      "datadog",
      "grafana-cloud",
      "splunk",
      "new-relic",
      "dynatrace",
    ],
    comparableSlugs: ["datadog", "grafana-cloud"],
    useCaseSlugs: ["observability-monitoring"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering", "operations"],
    sourcesExtra: [
      {
        id: "elastic-pricing",
        url: "https://www.elastic.co/pricing",
        title: "Elastic pricing",
        domains: ["pricing", "plans", "free-plan"],
      },
      {
        id: "elastic-cloud-hosted-pricing",
        url: "https://www.elastic.co/pricing/cloud-hosted",
        title: "Elastic Cloud Hosted pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "sentry",
    name: "Sentry",
    company: "Functional Software, Inc.",
    website: "https://sentry.io",
    domain: "sentry.io",
    pricingUrl: "https://sentry.io/pricing/",
    aliases: ["Sentry.io", "Sentry Error Monitoring"],
    membershipRole: "primary",
    jobCluster: "observability-monitoring",
    softShortDescription:
      "Application error monitoring, tracing, and replays — Developer Free; Team $26/mo annual with default prepaid; Business $80/mo. Not a Datadog infra replacement.",
    shortDescription:
      "Sentry is an application error-monitoring, tracing, and session-replay specialist. It sits in the observability-monitoring cluster as a developer-facing peer — not a Datadog infrastructure-monitoring replacement. Developer Free is $0 (1 user, 5k errors). Team is $26/month billed annually with default prepaid event volume; Business $80/month; Enterprise custom. Same cluster as Datadog/Splunk Observability Cloud; different primary shape (errors/replays vs host/infra suites). Does not outrank Datadog 8.6.",
    vendorPositioning:
      "See broken code in production — errors, traces, and replays for application teams, not a full infra observability estate.",
    pricingModel: "flat",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 26,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from sentry.io/pricing (high confidence). Developer Free $0 (1 user, 5k errors). Team $26/mo annual with default prepaid. Business $80/mo. Enterprise custom. Event prepaid/overage math still changes TCO. Affiliate economics excluded.",
    pricingSummary:
      "Developer Free $0 (1 user, 5k errors). Team from $26/mo annual. Business $80/mo. Enterprise quote. Confirm prepaid event volumes on sentry.io/pricing.",
    plans: [
      {
        kind: "free",
        slug: "developer",
        name: "Developer",
        limits: ["1 user", "5,000 errors"],
        description: "Free Developer plan — 1 user and 5k errors.",
      },
      {
        kind: "flat-annual",
        slug: "team",
        name: "Team",
        amount: 26,
        highlighted: true,
        description:
          "$26/mo billed annually with default prepaid event volume — application error/tracing team floor.",
      },
      {
        kind: "flat-monthly",
        slug: "business",
        name: "Business",
        amount: 80,
        description: "$80/mo Business — higher volume and admin depth. Confirm live billing interval.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Custom volume, SSO, and support — contact sales.",
      },
    ],
    featureOverrides: SENTRY_FEATURES,
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
      "Not a Datadog-style infrastructure monitoring suite — errors/traces/replays are the job",
      "Prepaid event volume on Team/Business is the TCO lever beyond $26/$80 stickers",
      "Does not outrank Datadog (8.6)",
      "Not on-call paging as a primary product (landscape vs PagerDuty)",
      "Not ITSM, git host, hosting panel, or managed hosting",
    ],
    limitationKinds: [
      "feature-unavailable",
      "plan-restriction",
      "other",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 9,
      "it-job-fit": 8,
      "workflow-depth": 8,
      integrations: 8,
      "admin-security": 7,
      scalability: 8,
      "value-for-money": 9,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "SDK-first error UI is the easiest observability entry for application developers. Not a lab test.",
      "it-job-fit":
        "Specialist observability peer — application errors/tracing/replays, not Datadog infra replacement.",
      "workflow-depth":
        "Issues, traces, replays, and release tracking are deep for that job; not full-stack infra.",
      integrations: "GitHub, Slack, and language SDKs cover the application workflow.",
      "admin-security":
        "Business/Enterprise add governance; Team is developer-grade.",
      scalability: "Event prepaid plus Enterprise custom scale; not unlimited free errors.",
      "value-for-money":
        "Free Developer plus published $26 Team floor is sharp for error monitoring. Affiliate economics excluded.",
      "ai-capabilities":
        "Issue grouping/assist exists — scored as supporting, not an LLM suite.",
    },
    bestFor: [
      "Application teams whose primary observability job is errors, traces, and replays",
      "Developers who want a free 5k-error path before Team $26",
      "Buyers comparing a specialist to Datadog/Splunk host suites",
    ],
    notIdealFor: [
      "SRE teams buying infrastructure monitoring as the core SKU (Datadog)",
      "On-call-only paging (PagerDuty) — landscape, not a peer rank",
      "ITSM or hosting purchases",
    ],
    pros: [
      "Free Developer plan",
      "Published Team $26 annual floor",
      "Error/trace/replay specialist depth",
      "Strong developer UX",
      "Clear identity vs infra suites",
    ],
    cons: [
      "Not infra monitoring",
      "Event prepaid/overage math",
      "Does not outrank Datadog",
      "Not on-call-primary",
      "Admin-security thinner than Cisco/Splunk",
    ],
    keyFeatures: [
      "Error monitoring",
      "Distributed tracing",
      "Session replays",
      "Release / commit linking",
      "Language SDKs",
    ],
    whoShouldChoose:
      "Choose Sentry when application error monitoring, tracing, and replays are the job — not Datadog infrastructure monitoring by default.",
    whoShouldConsiderAlternatives:
      "Compare Datadog or Splunk Observability Cloud for full-stack infra; PagerDuty only on landscape pages for paging.",
    alternativeSlugs: ["datadog", "splunk"],
    competitorSlugs: [
      "datadog",
      "new-relic",
      "dynatrace",
      "splunk",
      "elastic-observability",
    ],
    comparableSlugs: ["datadog", "splunk"],
    useCaseSlugs: ["observability-monitoring"],
    businessSizeSlugs: ["solo", "micro", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering"],
    sourcesExtra: [
      {
        id: "sentry-pricing",
        url: "https://sentry.io/pricing/",
        title: "Sentry pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },
  {
    slug: "incident-io",
    name: "incident.io",
    company: "incident.io Ltd",
    website: "https://incident.io",
    domain: "incident.io",
    pricingUrl: "https://incident.io/pricing",
    aliases: ["incidentio", "Incident.io"],
    membershipRole: "primary",
    jobCluster: "incident-oncall",
    softShortDescription:
      "Incident response — Basic Free; Team $15/user/mo annual ($19 monthly); Pro $25/user; on-call add-on +$10–$20/user. Does not outrank PagerDuty 8.0.",
    shortDescription:
      "incident.io is an incident-response and command platform (incident.io Ltd) with optional on-call. Basic is Free. Team is $15/user/month billed annually ($19 monthly); Pro $25/user. On-call is an add-on at about +$10–$20/user. Enterprise custom. Same incident-oncall cluster as PagerDuty — PagerDuty remains the award (8.0); this entity does not outrank it. Distinct from Datadog/Sentry observability.",
    vendorPositioning:
      "Run incidents in one place — declare, coordinate, and learn, with on-call as an add-on rather than the whole product.",
    pricingModel: "per-seat",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 15,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from incident.io/pricing (high confidence). Basic Free. Team $15/user/mo annual / $19 monthly. Pro $25/user. On-call add-on +$10–$20/user. Enterprise custom. Affiliate economics excluded.",
    pricingSummary:
      "Basic Free. Team from $15/user/mo annual ($19 monthly). Pro $25/user. On-call add-on extra. Confirm live on incident.io/pricing.",
    plans: [
      {
        kind: "free",
        slug: "basic",
        name: "Basic",
        description: "Free Basic — core incident response for small teams.",
      },
      {
        kind: "per-seat-annual",
        slug: "team",
        name: "Team",
        amount: 15,
        highlighted: true,
        description:
          "$15/user/mo billed annually ($19 monthly) — incident response team floor. On-call is a separate add-on.",
      },
      {
        kind: "per-seat-annual",
        slug: "pro",
        name: "Pro",
        amount: 25,
        description: "$25/user/mo — higher incident-response depth. Confirm live interval.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Custom governance, scale, and support — contact sales.",
      },
    ],
    featureOverrides: INCIDENT_FEATURES,
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
      "On-call paging is an add-on (+$10–$20/user), not included in the $15 Team floor",
      "Does not outrank PagerDuty (8.0) as the incident-oncall award",
      "Not observability telemetry (Sentry/Datadog) — landscape vs those jobs",
      "Not an ITSM CMDB (Jira Service Management / Freshservice)",
      "Not managed hosting or a control panel",
    ],
    limitationKinds: [
      "requires-add-on",
      "other",
      "feature-unavailable",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 9,
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
        "Slack-native incident UX is approachable for modern SRE teams. Not a lab test.",
      "it-job-fit":
        "Incident-oncall cluster — ranked with PagerDuty, not as an observability peer of Datadog or Sentry.",
      "workflow-depth":
        "Declare/coordinate/learn workflows are deep; on-call depth is add-on versus PagerDuty’s paging-first product.",
      integrations: "Slack/Teams-native incident workflows are the integration story.",
      "admin-security":
        "Team/Pro are product-led; Enterprise carries heavier governance.",
      scalability: "Per-user ladder plus Enterprise quote; held below PagerDuty’s scale story.",
      "value-for-money":
        "Free Basic plus $15 Team floor is a clear published entry; on-call add-on is the TCO catch. Affiliate economics excluded.",
      "ai-capabilities":
        "Incident assist exists — scored as supporting, not the buying reason versus PagerDuty paging.",
    },
    bestFor: [
      "Teams that want incident command in Slack more than a paging-first ops cloud",
      "Buyers who will add on-call only if needed",
      "Product-led incident response versus PagerDuty Professional seats",
    ],
    notIdealFor: [
      "Orgs whose primary job is PagerDuty-style on-call paging at enterprise scale",
      "Sentry/Datadog observability purchases",
      "ITSM ticket desks without incident command",
    ],
    pros: [
      "Free Basic plan",
      "Published Team $15/user annual floor",
      "Strong Slack-native incident UX",
      "Optional on-call add-on",
      "Clear cluster fit vs observability",
    ],
    cons: [
      "On-call is extra",
      "Does not outrank PagerDuty",
      "Thinner enterprise scale story",
      "Not telemetry",
      "Not ITSM CMDB",
    ],
    keyFeatures: [
      "Incident declaration and coordination",
      "Post-incident workflow",
      "Slack / Teams native",
      "On-call add-on",
      "Status / stakeholder comms (plan-gated)",
    ],
    whoShouldChoose:
      "Choose incident.io when incident command is the job and you want a published $15 Team floor — not PagerDuty by default, and not Datadog/Sentry.",
    whoShouldConsiderAlternatives:
      "Compare PagerDuty for paging-first on-call; Jira Service Management if Atlassian ITSM alerting is enough.",
    alternativeSlugs: ["pagerduty", "jira-service-management"],
    competitorSlugs: ["pagerduty", "jira-service-management"],
    comparableSlugs: ["pagerduty"],
    useCaseSlugs: ["incident-oncall"],
    businessSizeSlugs: ["small-business", "mid-market"],
    teamTypeSlugs: ["engineering", "operations"],
    sourcesExtra: [
      {
        id: "incident-io-pricing",
        url: "https://incident.io/pricing",
        title: "incident.io pricing",
        domains: ["pricing", "plans", "free-plan"],
      },
    ],
  },
  {
    slug: "circleci",
    name: "CircleCI",
    company: "Circle Internet Services, Inc.",
    website: "https://circleci.com",
    domain: "circleci.com",
    pricingUrl: "https://circleci.com/pricing/",
    aliases: ["Circle CI", "CircleCI Pipelines"],
    membershipRole: "primary",
    jobCluster: "source-control-devops",
    softShortDescription:
      "CI/CD platform — not a git host. Free (6k build minutes / 30k credits framing); Performance from $15/mo; Scale contact. Peer of GitHub Actions / GitLab CI.",
    shortDescription:
      "CircleCI is a CI/CD platform (pipelines, orbs, hosted/self-hosted runners) — not a Git host. It lives in source-control-devops so DevOps buyers can compare it with GitHub Actions and GitLab CI, while remaining landscape-aware that GitHub the SCM is a different primary shape. Free includes published build-minute/credit framing (commonly 6k build minutes / 30k credits on the pricing page). Performance starts from $15/month. Scale is contact. Distinct from GitHub (repos + Actions) and GitLab (DevSecOps platform).",
    vendorPositioning:
      "Specialist CI/CD — run pipelines against GitHub, GitLab, or Bitbucket remotes without buying a git host.",
    pricingModel: "usage",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 15,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from circleci.com/pricing (high confidence). Free with 6k build minutes / 30k credits framing on page. Performance from $15/mo. Scale contact. Credits/minutes still dominate TCO above the $15 tile. Affiliate economics excluded.",
    pricingSummary:
      "Free (6k build minutes / 30k credits framing). Performance from $15/mo. Scale contact. Confirm live credits on circleci.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        limits: ["Build minutes / credits as published (6k minutes / 30k credits framing)"],
        description:
          "Free CI/CD with published minute/credit caps — not a git hosting plan.",
      },
      {
        kind: "flat-monthly",
        slug: "performance",
        name: "Performance",
        amount: 15,
        highlighted: true,
        description:
          "$15/mo Performance floor — additional credits/minutes versus Free. Confirm live packaging.",
      },
      {
        kind: "contact-sales",
        slug: "scale",
        name: "Scale",
        description: "Scale / enterprise CI — contact sales.",
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
      "Free minute/credit caps; Performance $15 is not unlimited CI",
      "Not observability, on-call, hosting panel, or managed hosting",
      "AI is not the product",
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
      "admin-security": 7,
      scalability: 8,
      "value-for-money": 8,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Config.yml pipelines and orbs are familiar to CI specialists; not a git-host onboarding path. Not a lab test.",
      "it-job-fit":
        "CI/CD inside source-control-devops — peer path vs Actions/GitLab CI, not a GitHub SCM replacement.",
      "workflow-depth":
        "Pipelines, orbs, matrices, and runners are deep for CI; no repo/PR system of record.",
      integrations: "Native GitHub (and other VCS) plus Slack/API for pipeline notifications.",
      "admin-security":
        "Org security exists; thinner than GitHub Enterprise governance of the repo itself.",
      scalability: "Performance → Scale plus self-hosted runners; credits still meter cost.",
      "value-for-money":
        "Free plus published $15 Performance floor is a clear CI entry. Affiliate economics excluded.",
      "ai-capabilities":
        "No meaningful dev-AI copilot versus GitHub Copilot — scored low on purpose.",
    },
    bestFor: [
      "Teams that want specialist CI/CD against an existing GitHub/GitLab/Bitbucket remote",
      "Buyers comparing CircleCI Performance $15 to GitHub Actions minutes",
      "Orgs that do not want to move source control in order to buy CI",
    ],
    notIdealFor: [
      "Teams whose primary purchase is a git host (GitHub / GitLab)",
      "Observability or on-call purchases",
      "Hosting panel or managed WordPress hosting",
    ],
    pros: [
      "Published Performance $15 floor",
      "Free minute/credit path",
      "CI specialist depth",
      "Works with existing git hosts",
      "Clear identity vs SCM",
    ],
    cons: [
      "Not a git host",
      "Credit/minute TCO above $15",
      "AI not a lead feature",
      "Weaker repo governance than GitHub Enterprise",
      "Not observability/hosting",
    ],
    keyFeatures: [
      "Hosted CI/CD pipelines",
      "Orbs / reusable config",
      "VCS integrations (GitHub and peers)",
      "Performance plan from $15/mo",
      "Scale contact path",
    ],
    whoShouldChoose:
      "Choose CircleCI when specialist CI/CD is the job — not GitHub the SCM by default, even though both sit in source-control-devops.",
    whoShouldConsiderAlternatives:
      "Compare GitHub or GitLab when you need repos plus CI in one licence; Azure DevOps or Bitbucket for those ecosystems.",
    alternativeSlugs: ["github", "gitlab"],
    competitorSlugs: ["github", "gitlab", "azure-devops", "bitbucket"],
    comparableSlugs: ["github", "gitlab"],
    useCaseSlugs: ["source-control-devops"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering"],
    sourcesExtra: [
      {
        id: "circleci-pricing",
        url: "https://circleci.com/pricing/",
        title: "CircleCI pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },
  {
    slug: "directadmin",
    name: "DirectAdmin",
    company: "JBMC Software",
    website: "https://www.directadmin.com",
    domain: "directadmin.com",
    pricingUrl: "https://www.directadmin.com/pricing.php",
    aliases: ["Direct Admin", "DA panel"],
    membershipRole: "primary",
    jobCluster: "hosting-operations",
    softShortDescription:
      "Hosting control panel — Personal Plus $5/mo; Lite $15; Standard $29 unlimited accounts/domains. Does not outrank Plesk 7.4.",
    shortDescription:
      "DirectAdmin is a Linux hosting control panel (JBMC Software) licensed per server — not managed WordPress hosting. Personal Plus publishes at $5/month; Lite $15; Standard $29 with unlimited accounts/domains on published packaging. Same hosting-operations cluster as Plesk and cPanel. Plesk remains the cluster award (7.4); this entity does not outrank it. Landscape-only versus Kinsta/WP Engine managed hosting.",
    vendorPositioning:
      "A lighter, cheaper hosting panel licence for admins who already run the server.",
    pricingModel: "flat",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 5,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from directadmin.com/pricing.php (high confidence). Personal Plus $5/mo; Lite $15; Standard $29 unlimited accounts/domains. Per-server panel licence — not a managed-host SKU. Affiliate economics excluded.",
    pricingSummary:
      "No free plan. Personal Plus from $5/mo. Lite $15. Standard $29 unlimited accounts/domains. Confirm live on directadmin.com/pricing.php.",
    plans: [
      {
        kind: "flat-monthly",
        slug: "personal-plus",
        name: "Personal Plus",
        amount: 5,
        highlighted: true,
        description: "$5/mo Personal Plus — entry DirectAdmin panel licence.",
      },
      {
        kind: "flat-monthly",
        slug: "lite",
        name: "Lite",
        amount: 15,
        description: "$15/mo Lite — higher account/domain allowances than Personal Plus.",
      },
      {
        kind: "flat-monthly",
        slug: "standard",
        name: "Standard",
        amount: 29,
        description: "$29/mo Standard — unlimited accounts/domains on published packaging.",
      },
    ],
    featureOverrides: PANEL_FEATURES,
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: not-supported",
      "AI automation: not-supported",
      "AI recommendations: not-supported",
    ],
    integrations: [
      { integrationSlug: "api", kind: "api" },
      { integrationSlug: "wordpress", kind: "native" },
    ],
    limitations: [
      "Panel licence on infrastructure you already run — not Kinsta/WP Engine managed hosting",
      "Does not outrank Plesk (7.4)",
      "No published AI story — scored low on purpose",
      "Not ITSM, observability, or source control",
      "Personal Plus $5 is not unlimited Standard $29 packaging",
    ],
    limitationKinds: [
      "feature-unavailable",
      "other",
      "feature-unavailable",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 7,
      "it-job-fit": 8,
      "workflow-depth": 7,
      integrations: 6,
      "admin-security": 7,
      scalability: 7,
      "value-for-money": 9,
      "ai-capabilities": 3,
    },
    scoreRationales: {
      "ease-of-use":
        "GUI panel for Linux hosts is approachable; thinner ecosystem UX than Plesk/cPanel. Not a lab test.",
      "it-job-fit":
        "Hosting-operations panel licence — ranked with Plesk/cPanel, not managed hosting (Kinsta).",
      "workflow-depth":
        "Accounts, domains, and mail cover the panel job; less WordPress/docker toolkit depth than Plesk.",
      integrations: "API and hosting-stack hooks; not a SaaS integration graph.",
      "admin-security":
        "Panel hardening is operator-dependent; adequate for the licence class.",
      scalability: "Standard unlimited accounts/domains scales the panel; you still own the metal.",
      "value-for-money":
        "Published $5 Personal Plus floor is the sharpest panel entry here versus Plesk Web Admin. Affiliate economics excluded.",
      "ai-capabilities":
        "Not an AI product — scored low on the IT methodology’s AI criterion without pretending otherwise.",
    },
    bestFor: [
      "Admins who want a cheap panel licence on VPS/dedicated they already run",
      "Buyers comparing Personal Plus $5 to Plesk Web Admin or cPanel Solo",
      "Hosts that need Standard unlimited accounts/domains at $29",
    ],
    notIdealFor: [
      "Teams buying managed WordPress hosting (Kinsta / WP Engine)",
      "Windows panel needs (Plesk)",
      "ITSM, git, or observability purchases",
    ],
    pros: [
      "Published Personal Plus $5/mo floor",
      "Lite $15 and Standard $29 ladder",
      "Unlimited accounts/domains on Standard",
      "Clear panel-licence identity",
      "Value versus Plesk/cPanel list",
    ],
    cons: [
      "Does not outrank Plesk",
      "Thinner ecosystem than cPanel/Plesk",
      "No AI story",
      "Not managed hosting",
      "You still operate the server",
    ],
    keyFeatures: [
      "Linux hosting control panel",
      "Personal Plus / Lite / Standard licences",
      "Account and domain administration",
      "Standard unlimited accounts/domains",
      "API",
    ],
    whoShouldChoose:
      "Choose DirectAdmin when a low published panel licence is the job — not Plesk by default, and not Kinsta managed hosting.",
    whoShouldConsiderAlternatives:
      "Compare Plesk or cPanel for broader panel ecosystems; Kinsta/WP Engine only on landscape pages for managed hosting.",
    alternativeSlugs: ["plesk", "cpanel"],
    competitorSlugs: ["plesk", "cpanel"],
    comparableSlugs: ["plesk", "cpanel"],
    useCaseSlugs: ["hosting-operations"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    teamTypeSlugs: ["operations"],
    sourcesExtra: [
      {
        id: "directadmin-pricing",
        url: "https://www.directadmin.com/pricing.php",
        title: "DirectAdmin pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "kinsta",
    name: "Kinsta",
    company: "Kinsta Inc.",
    website: "https://kinsta.com",
    domain: "kinsta.com",
    pricingUrl: "https://kinsta.com/pricing/",
    aliases: ["Kinsta Hosting", "Kinsta WordPress"],
    membershipRole: "primary",
    jobCluster: "hosting-providers",
    softShortDescription:
      "Managed WordPress hosting — Single 20GB from $35/mo ongoing floor (ignore promotional first-month teasers). Does not outrank WP Engine 7.7.",
    shortDescription:
      "Kinsta is managed WordPress (and adjacent app) hosting on Google Cloud — a hosting-providers peer of WP Engine and Cloudways, not a Plesk/cPanel panel licence. Single 20GB publishes from $35/month as the ongoing floor; promotional first-month offers appear on marketing pages and must not replace $35 as the research floor. Free migrations are commonly offered; there is no general free trial. WP Engine remains the cluster award (7.7); this entity does not outrank it. Landscape-only versus Plesk.",
    vendorPositioning:
      "Managed hosting on Google Cloud — WordPress-specialist platform without buying a control-panel licence.",
    pricingModel: "flat",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 35,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from kinsta.com/pricing (high confidence). Single 20GB from $35/mo ongoing. Promotional first-month offers exist — do not use promo tiles as the floor. No general free trial; free migrations are a separate motion. Affiliate economics excluded.",
    pricingSummary:
      "No free plan. Single 20GB from $35/mo ongoing (ignore first-month promos). Free migrations often offered — not a free trial. Confirm live on kinsta.com/pricing.",
    plans: [
      {
        kind: "flat-monthly",
        slug: "single-20gb",
        name: "Single (20GB)",
        amount: 35,
        highlighted: true,
        description:
          "$35/mo ongoing Single 20GB floor. Promotional first-month pricing is not the research floor.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise / higher plans",
        description:
          "Larger visits/storage and enterprise managed hosting — confirm live ladder on kinsta.com/pricing.",
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
      "Promotional first-month offers are not the $35 ongoing Single 20GB floor",
      "Does not outrank WP Engine (7.7)",
      "Not a Plesk/cPanel panel licence (landscape vs DirectAdmin/Plesk)",
      "No general free trial — migrations are the courtesy path",
      "Not ITSM, observability, git, or a proxy network",
    ],
    limitationKinds: [
      "other",
      "other",
      "feature-unavailable",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "it-job-fit": 9,
      "workflow-depth": 8,
      integrations: 7,
      "admin-security": 8,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Managed WordPress dashboard is easier than panel licences on raw VPS. Not a lab test.",
      "it-job-fit":
        "Managed hosting — hosting-providers cluster with WP Engine/Cloudways, not hosting-operations panels.",
      "workflow-depth":
        "Managed WP deploys, staging, and GCP-backed hosting are deep for that job; not a reseller panel OS.",
      integrations: "WordPress-centric; narrower multi-app story than Cloudways.",
      "admin-security":
        "Managed platform security is a buying reason versus DIY panels.",
      scalability: "Plan ladder plus GCP; $35 Single is not the large-estate path.",
      "value-for-money":
        "$35 ongoing is above Cloudways $11 Flexible; specialist managed WP is the trade. Affiliate economics excluded.",
      "ai-capabilities":
        "No meaningful ITSM/dev AI copilot — scored low; hosting job rarely needs AI scoring depth.",
    },
    bestFor: [
      "Teams that want managed WordPress hosting without a panel licence",
      "Buyers comparing Kinsta $35 Single to WP Engine Essential and Cloudways Flexible",
      "Orgs that will treat $35 as ongoing TCO, not a promo month",
    ],
    notIdealFor: [
      "Admins buying Plesk or DirectAdmin licences for servers they already own",
      "Multi-cloud VM hosting as the primary shape (Cloudways)",
      "ITSM, observability, or source-control purchases",
    ],
    pros: [
      "Managed hosting (managed-hosting supported)",
      "Published Single 20GB $35 ongoing floor",
      "Google Cloud-backed platform",
      "Free migrations commonly offered",
      "Clear cluster fit vs panels",
    ],
    cons: [
      "Promo first-month tiles can mislead",
      "Does not outrank WP Engine",
      "No general free trial",
      "Not a panel licence",
      "AI is not the product",
    ],
    keyFeatures: [
      "Managed WordPress hosting",
      "Single 20GB from $35/mo",
      "Google Cloud infrastructure",
      "Staging / deploys",
      "Free migrations (not a free trial)",
    ],
    whoShouldChoose:
      "Choose Kinsta when managed WordPress hosting is the job — not a Plesk/DirectAdmin panel licence, and not WP Engine by default.",
    whoShouldConsiderAlternatives:
      "Compare WP Engine for WordPress-specialist managed hosting; Cloudways for managed multi-cloud VMs; Plesk only on landscape pages for panel licences.",
    alternativeSlugs: ["wp-engine", "cloudways"],
    competitorSlugs: ["wp-engine", "cloudways", "plesk"],
    comparableSlugs: ["wp-engine", "cloudways"],
    useCaseSlugs: ["hosting-providers"],
    businessSizeSlugs: ["small-business", "mid-market"],
    teamTypeSlugs: ["operations", "engineering"],
    sourcesExtra: [
      {
        id: "kinsta-pricing",
        url: "https://kinsta.com/pricing/",
        title: "Kinsta pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "smartproxy",
    name: "Decodo (Smartproxy)",
    company: "Decodo (formerly Smartproxy)",
    website: "https://decodo.com",
    domain: "decodo.com",
    pricingUrl: "https://decodo.com/proxies/residential-proxies/pricing",
    aliases: ["Smartproxy", "Decodo", "smartproxy.com"],
    membershipRole: "primary",
    jobCluster: "web-data-collection",
    softShortDescription:
      "Decodo (formerly Smartproxy) residential proxies — 3GB $11.25/mo ($3.75/GB); PAYG $4/GB; advertised $2/GB at 1000GB. 3-day trial. Slug remains smartproxy.",
    shortDescription:
      "Decodo is the 2025 rebrand of Smartproxy — same proxy network, new brand. The SoftwareGlimpse slug stays `smartproxy` for URL stability; display name is Decodo (Smartproxy). Residential subscriptions publish from 3GB at $11.25/month ($3.75/GB); PAYG $4/GB; advertised volume floor $2/GB at 1000GB. 3-day trial. Same web-data-collection cluster as Bright Data. Bright Data remains the award (7.7); this entity does not outrank it.",
    vendorPositioning:
      "Self-serve residential proxies under the Decodo brand — the Smartproxy network with a lower published GB entry than Bright Data commits.",
    pricingModel: "usage",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 3,
    startingPriceMonthly: 11.25,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from decodo.com residential proxy pricing (high confidence). 3GB subscription $11.25/mo ($3.75/GB). PAYG $4/GB. Advertised $2/GB at 1000GB. 3-day trial. Rebrand Smartproxy → Decodo (2025); slug remains smartproxy. Affiliate economics excluded.",
    pricingSummary:
      "Residential 3GB from $11.25/mo ($3.75/GB). PAYG $4/GB. Volume advertised to $2/GB at 1000GB. 3-day trial. Confirm live on decodo.com.",
    plans: [
      {
        kind: "flat-monthly",
        slug: "residential-3gb",
        name: "Residential 3GB",
        amount: 11.25,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 3,
        description:
          "$11.25/mo for 3GB residential ($3.75/GB) — published self-serve floor. 3-day trial.",
      },
      {
        kind: "contact-sales",
        slug: "payg",
        name: "PAYG residential",
        description: "Pay-as-you-go residential at $4/GB on published pricing.",
      },
      {
        kind: "contact-sales",
        slug: "residential-1000gb",
        name: "Residential 1000GB",
        description:
          "Advertised volume floor $2/GB at 1000GB — confirm live pack math; not the $11.25 starter.",
      },
    ],
    featureOverrides: PROXY_FEATURES,
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: not-supported",
    ],
    integrations: [
      { integrationSlug: "python", kind: "native" },
      { integrationSlug: "nodejs", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Smartproxy rebranded to Decodo in 2025 — same network; do not treat them as two vendors",
      "Does not outrank Bright Data (7.7)",
      "3GB $11.25 is GB-metered — overages and larger packs change TCO",
      "Thinner enterprise compliance story than Bright Data / Oxylabs ISO-first packaging",
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
      "workflow-depth": 7,
      integrations: 7,
      "admin-security": 6,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 4,
    },
    scoreRationales: {
      "ease-of-use":
        "Self-serve proxy dashboard is approachable; rebrand (Smartproxy → Decodo) is the naming tax. Not a lab test.",
      "it-job-fit":
        "Residential proxy / web-data-collection — ranked with Bright Data/Oxylabs, not hosting or observability.",
      "workflow-depth":
        "Residential (and related proxy lines) cover collection jobs; less platform depth than Bright Data.",
      integrations: "API/SDK access for scrape stacks; lighter ecosystem than Bright Data.",
      "admin-security":
        "Limited public enterprise compliance packaging versus Bright Data / Oxylabs ISO 27001.",
      scalability: "1000GB $2/GB tiles exist; enterprise SLA story is thinner.",
      "value-for-money":
        "Published $11.25 / 3GB floor is a sharp SMB entry versus Bright Data ~$499 commits. Affiliate economics excluded.",
      "ai-capabilities":
        "No meaningful AI copilot story — scored low.",
    },
    bestFor: [
      "Teams that knew Smartproxy and need the Decodo-branded same network",
      "Buyers who want a published $11.25 residential starter versus Bright Data commits",
      "Projects that will validate a 3-day trial before GB scale",
    ],
    notIdealFor: [
      "Enterprises that require Bright Data / Oxylabs compliance-first proxy estates",
      "Actor marketplace compute (Apify)",
      "Hosting or ITSM purchases",
    ],
    pros: [
      "Published 3GB $11.25/mo floor",
      "3-day trial",
      "Clear PAYG $4/GB and volume $2/GB tiles",
      "URL-stable smartproxy slug after rebrand",
      "Self-serve dashboard",
    ],
    cons: [
      "Does not outrank Bright Data",
      "Rebrand naming confusion",
      "Thinner enterprise compliance story",
      "GB math still dominates TCO",
      "Not Actor-platform depth",
    ],
    keyFeatures: [
      "Residential proxy network (Decodo / Smartproxy)",
      "3GB subscription from $11.25/mo",
      "PAYG $4/GB",
      "Volume packs toward $2/GB",
      "3-day trial",
    ],
    whoShouldChoose:
      "Choose Decodo (Smartproxy) when a self-serve residential proxy starter is the job — not Bright Data enterprise commits by default.",
    whoShouldConsiderAlternatives:
      "Compare Bright Data or Oxylabs for enterprise proxy estates; ScraperAPI or Apify for API/Actor shapes.",
    alternativeSlugs: ["bright-data", "oxylabs"],
    competitorSlugs: [
      "bright-data",
      "oxylabs",
      "scraperapi",
      "apify",
      "thordata",
    ],
    comparableSlugs: ["bright-data", "oxylabs"],
    useCaseSlugs: ["web-data-collection"],
    businessSizeSlugs: ["solo", "micro", "small-business", "mid-market"],
    teamTypeSlugs: ["operations", "engineering"],
    sourcesExtra: [
      {
        id: "decodo-residential-pricing",
        url: "https://decodo.com/proxies/residential-proxies/pricing",
        title: "Decodo residential proxy pricing",
        domains: ["pricing", "plans", "free-trial", "limits"],
      },
    ],
  },
];

export const PRODUCTS = COMPACT.map(expandItProduct);

export const COMPARISON_PAIRS = [
  ["splunk", "datadog"],
  ["elastic-observability", "grafana-cloud"],
  ["sentry", "datadog"],
  ["incident-io", "pagerduty"],
  ["circleci", "github"],
  ["directadmin", "plesk"],
  ["kinsta", "wp-engine"],
  ["smartproxy", "bright-data"],
  ["splunk", "elastic-observability"],
  ["sentry", "splunk"],
  ["kinsta", "plesk"],
  ["sentry", "pagerduty"],
];
