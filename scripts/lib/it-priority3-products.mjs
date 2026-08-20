/**
 * IT & Development Priority-3 credibility products (compact).
 * dynatrace, azure-devops.
 *
 * Pricing grounded 2026-08-18 from first-party pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 *
 * Dynatrace is observability — peer of Datadog / New Relic, not PagerDuty.
 * Azure DevOps is source-control + Boards/Pipelines — peer of GitHub / GitLab,
 * not GitHub Copilot and not Jira Software (PM-primary).
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
  "proxy-network": "not-supported",
  "itsm-ai": "limited",
  "dev-ai": "supported",
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
  "dev-ai": "limited",
  "oncall-paging": "not-supported",
  "enterprise-security": "supported",
  "analytics-reporting": "supported",
};

const COMPACT = [
  {
    slug: "dynatrace",
    name: "Dynatrace",
    company: "Dynatrace, Inc.",
    website: "https://www.dynatrace.com",
    domain: "dynatrace.com",
    pricingUrl: "https://www.dynatrace.com/pricing/",
    aliases: ["Dynatrace DPS", "Davis AI", "Dynatrace Platform"],
    membershipRole: "primary",
    jobCluster: "observability-monitoring",
    softShortDescription:
      "Enterprise observability — Dynatrace Platform Subscription (DPS) annual commit + rate card. Full-Stack list unit ~$58/mo per 8 GiB host; 15-day trial. No per-seat SKU.",
    shortDescription:
      "Dynatrace is an enterprise observability platform (full-stack APM, infra, logs, traces, Davis AI) licensed as Dynatrace Platform Subscription: one annual spend commitment, then consumption against a public rate card with no penalty overage. Example list units on dynatrace.com/pricing (2026-08-18): Full-Stack Monitoring about $58/mo per 8 GiB host ($0.01 per memory-GiB-hour); Kubernetes pods and logs ingest are separate line items. Seats are unlimited. 15-day trial. Distinct from Datadog’s published per-host Infrastructure Pro SKU and from PagerDuty on-call.",
    vendorPositioning:
      "One platform, one annual commitment — automatic observability and Davis AI without per-capability SKUs.",
    pricingModel: "custom",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 15,
    startingPriceMonthly: 58,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Verified 2026-08-18 from dynatrace.com/pricing (medium confidence). DPS is an annual commit, not a self-serve SKU. startingPriceMonthly $58 is the published Full-Stack Monitoring rate-card unit per 8 GiB host — not an all-in floor. Always model hosts, GiB, sessions, and commit discount. Affiliate economics excluded.",
    pricingSummary:
      "Contact sales / DPS annual commit. Full-Stack list unit ~$58/mo per 8 GiB host on the public rate card. 15-day trial. Confirm live on dynatrace.com/pricing.",
    plans: [
      {
        kind: "contact-sales",
        slug: "dps",
        name: "Dynatrace Platform Subscription",
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 15,
        description:
          "Annual platform commit; all GA capabilities draw down a rate card. Unlimited seats.",
      },
      {
        kind: "contact-sales",
        slug: "on-demand",
        name: "On-demand over commit",
        description:
          "Usage beyond the annual commit continues at the same rate-card prices — no penalty overage.",
      },
    ],
    featureOverrides: OBS_FEATURES,
    aiLines: [
      "ITSM AI copilot: limited",
      "Developer AI copilot: supported",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Buying motion is an annual DPS commit — not a $15/host self-serve tile",
      "Rate-card units (hosts, GiB, sessions) still dominate TCO; $58/8 GiB is not all-in",
      "Implementation and OneAgent coverage matter more than the trial sandbox",
      "Not an ITSM service desk or git host",
      "Not PagerDuty — Davis AI does not replace on-call paging as the primary job",
    ],
    limitationKinds: [
      "other",
      "other",
      "other",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 6,
      "it-job-fit": 10,
      "workflow-depth": 9,
      integrations: 8,
      "admin-security": 9,
      scalability: 9,
      "value-for-money": 6,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Enterprise platform and OneAgent coverage — productive after architecture work, not in an afternoon. Not a lab test.",
      "it-job-fit":
        "Full-stack observability — ranked with Datadog and New Relic, not against PagerDuty or GitHub.",
      "workflow-depth":
        "APM, infra, logs, traces, and Davis AI form a deep SRE loop from vendor packaging.",
      integrations: "Broad cloud/runtime ecosystem and webhooks; not a SaaS seat graph.",
      "admin-security":
        "Enterprise security/compliance posture is a buying reason versus SMB observability tiles.",
      scalability: "DPS commit + unlimited seats is how large estates buy.",
      "value-for-money":
        "Opaque vs Datadog’s published host SKU; rate-card transparency helps but commit size still dominates. Affiliate economics excluded.",
      "ai-capabilities":
        "Davis AI is a real observability assistant — scored as assistance, not as a reason to skip telemetry.",
    },
    bestFor: [
      "Enterprises that will sign a DPS commit and deploy OneAgent broadly",
      "SRE teams that want full-stack APM plus Davis AI in one platform",
      "Buyers who already rejected per-host Datadog module math",
    ],
    notIdealFor: [
      "SMB teams that need a published $15/host tile (Datadog)",
      "On-call-only paging (PagerDuty)",
      "ITSM desks (ServiceNow / Freshservice)",
    ],
    pros: [
      "Full-stack APM + infra + logs",
      "Public rate card under DPS",
      "Unlimited seats",
      "Davis AI assistance",
      "15-day trial",
    ],
    cons: [
      "Annual commit buying motion",
      "$58/8 GiB is not all-in TCO",
      "Heavier onboarding than New Relic Free",
      "Not ITSM/git/on-call",
      "Implementation effort is real",
    ],
    keyFeatures: [
      "Full-stack monitoring",
      "APM traces and service maps",
      "Logs and Kubernetes observability",
      "Davis AI",
      "DPS annual commit",
    ],
    whoShouldChoose:
      "Choose Dynatrace when enterprise full-stack observability with a DPS commit is the job — not Datadog host modules by default, and not PagerDuty.",
    whoShouldConsiderAlternatives:
      "Compare Datadog or New Relic for published self-serve observability; PagerDuty for paging.",
    alternativeSlugs: ["datadog", "new-relic"],
    competitorSlugs: ["datadog", "new-relic", "grafana-cloud"],
    comparableSlugs: ["datadog", "new-relic"],
    useCaseSlugs: ["observability-monitoring"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    teamTypeSlugs: ["it-ops", "engineering"],
    sourcesExtra: [
      {
        id: "dynatrace-pricing",
        url: "https://www.dynatrace.com/pricing/",
        title: "Dynatrace pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "azure-devops",
    name: "Azure DevOps",
    company: "Microsoft",
    website: "https://azure.microsoft.com/products/devops/",
    domain: "azure.microsoft.com",
    pricingUrl:
      "https://azure.microsoft.com/pricing/details/devops/azure-devops-services/",
    aliases: [
      "Azure DevOps Services",
      "ADO",
      "Visual Studio Team Services",
      "VSTS",
    ],
    membershipRole: "primary",
    jobCluster: "source-control-devops",
    softShortDescription:
      "Azure Repos/Boards/Pipelines — first 5 Basic users free, then $6/user/mo; Basic + Test Plans $52/user/mo; Artifacts 2 GiB free.",
    shortDescription:
      "Azure DevOps is Microsoft’s cloud DevOps suite (Azure Boards, Repos, Pipelines, Artifacts, Test Plans). Basic access is free for the first 5 users, then $6/user/month. Stakeholders are free. Basic + Test Plans is $52/user/month for manual/exploratory test management. Azure Artifacts includes 2 GiB free then usage. Pipelines include a free Microsoft-hosted job with limited minutes; extra parallel jobs are usage-priced. Visual Studio subscribers often include Basic. Distinct from GitHub (separate source-control product, even under Microsoft) and from GitHub Copilot (AI coding).",
    vendorPositioning:
      "Boards, repos, pipelines, and artifacts in one Azure-native DevOps organisation.",
    pricingModel: "per-seat",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 30,
    startingPriceMonthly: 6,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from azure.microsoft.com Azure DevOps Services pricing (high confidence). First 5 Basic users free; additional Basic $6/user/mo. Basic + Test Plans $52/user/mo. Artifacts 2 GiB free. Affiliate economics excluded.",
    pricingSummary:
      "Free for 5 Basic users. Additional Basic $6/user/mo. Basic + Test Plans $52/user/mo. Confirm live on Azure DevOps Services pricing.",
    plans: [
      {
        kind: "free",
        slug: "basic-first-5",
        name: "Basic (first 5 users)",
        description:
          "Boards, Repos, Pipelines, 2 GiB Artifacts — first five Basic users free.",
      },
      {
        kind: "per-seat-monthly",
        slug: "basic",
        name: "Basic",
        amount: 6,
        highlighted: true,
        description:
          "$6/user/mo after the first five — Repos, Boards, Pipelines, Artifacts.",
      },
      {
        kind: "per-seat-monthly",
        slug: "basic-test-plans",
        name: "Basic + Test Plans",
        amount: 52,
        hasFreeTrial: true,
        trialDays: 30,
        description:
          "$52/user/mo — Basic plus manual/exploratory test plans and UAT tools.",
      },
    ],
    featureOverrides: {
      ...SCM_FEATURES,
      "dev-ai": "limited",
    },
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "User 6 onwards is $6/user/mo for every additional Basic seat — the free five are not a forever team cap workaround",
      "Test Plans at $52/user is a QA licence, not something to assign to every developer",
      "Pipeline minutes and Artifacts storage are extra TCO beyond seats",
      "Not GitHub — Microsoft owns both; buying motions and community differ",
      "GitHub Copilot is a separate AI-coding SKU — do not treat Azure DevOps as Copilot",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "plan-restriction",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 7,
      "it-job-fit": 9,
      "workflow-depth": 9,
      integrations: 9,
      "admin-security": 8,
      scalability: 8,
      "value-for-money": 9,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Azure Portal + org/project model is familiar for Microsoft shops; new teams still hit Boards vs GitHub Issues friction. Not a lab test.",
      "it-job-fit":
        "Source control + CI + boards as a DevOps suite — ranked with GitHub and GitLab, not Jira Software (PM) and not GitHub Copilot.",
      "workflow-depth":
        "Repos, Boards, Pipelines, Artifacts, and Test Plans cover a full Azure delivery loop.",
      integrations: "Native Azure AD/Entra, Teams, and Azure cloud; weaker GitHub Marketplace ecosystem.",
      "admin-security":
        "Entra ID, org policies, and enterprise Microsoft procurement are the admin story.",
      scalability: "Seat + pipeline/artifact usage scales; Visual Studio entitlements change TCO.",
      "value-for-money":
        "First five Basic users free then $6 is a sharp published floor vs GitLab Premium. Affiliate economics excluded.",
      "ai-capabilities":
        "AI coding is GitHub Copilot, not this product — scored as limited assistance on Azure DevOps itself.",
    },
    bestFor: [
      "Microsoft/Azure-native engineering orgs",
      "Teams that want Boards + Repos + Pipelines without GitHub",
      "QA groups that will actually buy Test Plans seats",
    ],
    notIdealFor: [
      "Open-source and GitHub-community-first teams",
      "Buyers who only need GitHub Copilot in an existing IDE",
      "ITSM desks (Jira Service Management / ServiceNow)",
    ],
    pros: [
      "Five free Basic users",
      "Published $6 Basic seat",
      "Boards + Repos + Pipelines together",
      "Azure/Entra native",
      "Test Plans path for QA",
    ],
    cons: [
      "Not GitHub’s ecosystem",
      "Test Plans $52 jump",
      "Pipeline minutes extra",
      "AI coding lives on Copilot",
      "Weaker OSS community default",
    ],
    keyFeatures: [
      "Azure Repos (Git)",
      "Azure Boards",
      "Azure Pipelines",
      "Azure Artifacts",
      "Azure Test Plans (paid SKU)",
    ],
    whoShouldChoose:
      "Choose Azure DevOps when Azure-native Boards/Repos/Pipelines are the job — not GitHub by default, and not GitHub Copilot.",
    whoShouldConsiderAlternatives:
      "Compare GitHub for community + Actions; GitLab for DevSecOps-in-one; Jira Software if the job is PM issue tracking only.",
    alternativeSlugs: ["github", "gitlab"],
    competitorSlugs: ["github", "gitlab", "bitbucket"],
    comparableSlugs: ["github", "gitlab"],
    useCaseSlugs: ["source-control-devops"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering", "it-ops"],
    sourcesExtra: [
      {
        id: "azure-devops-pricing",
        url: "https://azure.microsoft.com/pricing/details/devops/azure-devops-services/",
        title: "Azure DevOps Services pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },
];

export const PRODUCTS = COMPACT.map(expandItProduct);

export const COMPARISON_PAIRS = [
  ["dynatrace", "datadog"],
  ["azure-devops", "github"],
  ["azure-devops", "gitlab"],
];
