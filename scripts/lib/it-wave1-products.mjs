/**
 * IT Wave-1 affiliate products (compact).
 * freshservice, Datadog, GitHub, Plesk, Bright Data.
 *
 * Pricing floors grounded 2026-08-18 from first-party / official pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 *
 * Freshservice is ITSM-primary (not Freshsales CRM). Cross-cluster comparison
 * pairs are landscape-only — do not rank ITSM vs observability as undifferentiated peers.
 */
import { expandItProduct } from "./it-compact-expand.mjs";

const COMPACT = [
  {
    slug: "freshservice",
    name: "Freshservice",
    company: "Freshworks Inc.",
    website: "https://www.freshworks.com/freshservice/",
    domain: "freshworks.com",
    pricingUrl: "https://www.freshworks.com/freshservice/pricing/",
    aliases: ["Freshservice by Freshworks", "Freshworks Freshservice"],
    membershipRole: "primary",
    jobCluster: "itsm-service-desk",
    softShortDescription:
      "ITSM / employee service desk with incident, change, and asset workflows — Starter from $19/agent/mo annual.",
    shortDescription:
      "Freshservice is Freshworks’ IT service management platform for incident, problem, change, and service-catalog workflows aimed at internal IT and employee service desks. Published annual agent pricing: Starter $19/agent/mo, Growth $49, Pro $99, Enterprise custom. 21-day free trial on paid tiers. Freddy AI copilot and advanced ITSM modules typically land on higher plans. Distinct from Freshsales CRM — this entity is ITSM-primary on SoftwareGlimpse.",
    vendorPositioning:
      "Modern ITSM for internal IT teams — incidents, requests, changes, and assets with AI-assisted agent workflows.",
    pricingModel: "per-seat",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 21,
    startingPriceMonthly: 19,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from freshworks.com/freshservice/pricing (high confidence). Annual billing: Starter $19/agent/mo, Growth $49, Pro $99, Enterprise contact sales. 21-day trial. Module depth (assets, CMDB, advanced change) gates by tier. Freddy AI on higher tiers. Affiliate via aff-freshservice (Freshworks vendor family — not Freshsales). Affiliate economics excluded from scoring.",
    pricingSummary:
      "Starter $19, Growth $49, Pro $99 per agent/mo on annual billing; Enterprise custom. 21-day trial. No free plan. Confirm live ITSM module gates and Freddy AI packaging.",
    plans: [
      {
        kind: "per-seat-annual",
        slug: "starter",
        name: "Starter",
        amount: 19,
        hasFreeTrial: true,
        trialDays: 21,
        description:
          "$19/agent/month billed annually — entry ITSM for small IT teams.",
      },
      {
        kind: "per-seat-annual",
        slug: "growth",
        name: "Growth",
        amount: 49,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 21,
        description:
          "$49/agent/month billed annually — mid-market ITSM with broader automation depth.",
      },
      {
        kind: "per-seat-annual",
        slug: "pro",
        name: "Pro",
        amount: 99,
        hasFreeTrial: true,
        trialDays: 21,
        description:
          "$99/agent/month billed annually — advanced ITSM, assets, and enterprise-oriented modules.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Enterprise — custom quote for advanced governance, scale, and security.",
      },
    ],
    featureOverrides: {
      "incident-management": "supported",
      "change-problem": "supported",
      "service-catalog": "supported",
      "infrastructure-monitoring": "not-supported",
      "apm-tracing": "not-supported",
      "log-management": "not-supported",
      "source-control": "not-supported",
      "cicd-actions": "not-supported",
      "hosting-panel": "not-supported",
      "proxy-network": "not-supported",
      "itsm-ai": "higher-plan-only",
      "dev-ai": "not-supported",
      "enterprise-security": "higher-plan-only",
      "analytics-reporting": "supported",
    },
    aiLines: [
      "ITSM AI copilot: higher-plan-only",
      "Developer AI copilot: not-supported",
      "AI automation: limited",
      "AI recommendations: higher-plan-only",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "jira", kind: "native" },
      { integrationSlug: "azure-ad", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "No observability, source control, or hosting-panel primary job — ITSM peer only",
      "Freddy AI and advanced assets/CMDB typically require Growth/Pro or higher",
      "Per-agent pricing stacks for large service-desk teams",
      "Enterprise packaging is contact-sales",
      "Not Freshsales CRM — do not conflate Freshworks sales CRM with ITSM",
    ],
    limitationKinds: [
      "feature-unavailable",
      "requires-add-on",
      "plan-restriction",
      "plan-restriction",
      "other",
    ],
    scores: {
      "ease-of-use": 8,
      "it-job-fit": 9,
      "workflow-depth": 9,
      integrations: 9,
      "admin-security": 8,
      scalability: 8,
      "value-for-money": 8,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Freshservice markets a modern ITSM UI for agents and requesters without legacy ITIL complexity overhead. Score from first-party positioning, not hands-on lab testing.",
      "it-job-fit":
        "Primary job is ITSM / employee service desk — incidents, changes, service catalog, and asset workflows match the itsm-service-desk cluster strongly.",
      "workflow-depth":
        "Published ITIL-style incident, problem, change, and catalog workflows give solid ITSM depth; advanced CMDB/assets land on higher tiers.",
      integrations:
        "Native Slack/Teams, Jira, Azure AD, and Zapier-style connectors support typical IT ops stacks — strong for mid-market ITSM buyers.",
      "admin-security":
        "SSO, audit, and RBAC are marketed on higher tiers — adequate enterprise posture with plan gates rather than all-in Starter.",
      scalability:
        "Starter → Growth → Pro → Enterprise ladder supports team growth; per-agent math is the main scaling tax.",
      "value-for-money":
        "Transparent $19/$49/$99 agent floors are competitive for ITSM; AI and advanced modules raise TCO on higher tiers. Affiliate economics excluded.",
      "ai-capabilities":
        "Freddy AI copilot is a published ITSM AI path on higher plans — useful agent assistance with tier packaging rather than unlimited included AI.",
    },
    bestFor: [
      "Internal IT teams needing modern ITSM with transparent per-agent pricing",
      "Mid-market orgs replacing email/ spreadsheet helpdesks with incidents and service catalog",
      "Freshworks-aligned buyers who want ITSM separate from Freshsales CRM",
    ],
    notIdealFor: [
      "SRE teams whose primary job is infrastructure monitoring or APM (Datadog territory)",
      "Developer platform buyers needing source control as the core purchase (GitHub territory)",
      "Web hosts needing a server control panel (Plesk territory)",
    ],
    pros: [
      "Clear ITSM primary job with incident/change/catalog workflows",
      "Transparent Starter/Growth/Pro agent pricing",
      "21-day trial on paid tiers",
      "Strong Slack/Teams/Jira integration posture",
      "Freddy AI ITSM copilot on higher plans",
    ],
    cons: [
      "No free plan — trial-only entry",
      "Advanced assets/CMDB and AI gated to higher tiers",
      "Per-agent costs stack for large desks",
      "Not observability or DevOps primary",
      "Enterprise requires sales engagement",
    ],
    keyFeatures: [
      "Incident and request management",
      "Change and problem management",
      "Employee service catalog",
      "ITSM analytics and reporting",
      "Freddy AI copilot (higher tiers)",
      "Slack, Teams, Jira integrations",
    ],
    whoShouldChoose:
      "Choose Freshservice when ITSM / internal service desk is the primary job and you want published per-agent floors — not when observability or source control is the core need.",
    whoShouldConsiderAlternatives:
      "Compare Datadog for observability, GitHub for source control/DevOps, and landscape-only cross-cluster pages — do not rank ITSM vs monitoring as undifferentiated peers.",
    alternativeSlugs: ["datadog", "github"],
    competitorSlugs: ["servicenow", "jira-service-management", "manageengine-servicedesk"],
    comparableSlugs: ["jira-service-management"],
    useCaseSlugs: ["itsm-service-desk"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations"],
    catalogueSourceId: "aff-freshservice",
  },

  {
    slug: "datadog",
    name: "Datadog",
    company: "Datadog, Inc.",
    website: "https://www.datadoghq.com",
    domain: "datadoghq.com",
    pricingUrl: "https://www.datadoghq.com/pricing/",
    aliases: ["Datadog Observability"],
    membershipRole: "primary",
    jobCluster: "observability-monitoring",
    softShortDescription:
      "Observability suite — infrastructure, APM, logs, and security signals with consumption/host pricing; Infrastructure Pro from $15/host/mo annual.",
    shortDescription:
      "Datadog is an observability and monitoring platform spanning infrastructure metrics, APM/tracing, log management, and related security/RUM modules. Infrastructure Pro publishes from $15/host/month on annual billing as a common entry host floor; APM, logs, and other products add module-specific consumption charges. Free tier exists for limited hosts/metrics. Pricing is usage- and module-heavy — confirm live calculators before purchase.",
    vendorPositioning:
      "Unified observability for cloud-scale infrastructure, applications, logs, and security signals in one platform.",
    pricingModel: "usage",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 15,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from datadoghq.com/pricing (high confidence on Infrastructure Pro $15/host/mo annual floor). Free tier for limited hosts. APM, logs, RUM, SIEM, and other SKUs add separate module/consumption lines — TCO is multi-product. 14-day trial commonly documented. No affiliate in inventory. Affiliate economics excluded.",
    pricingSummary:
      "Free tier (limited). Infrastructure Pro from $15/host/mo annual; APM/logs/RUM are separate module lines with consumption pricing. 14-day trial. Confirm live calculator — multi-module TCO stacks quickly.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        limits: { maxHosts: 5 },
        description: "Free tier with limited hosts/metrics — evaluation floor only.",
      },
      {
        kind: "per-host-annual",
        slug: "infrastructure-pro",
        name: "Infrastructure Pro",
        amount: 15,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "$15/host/month billed annually — common infrastructure monitoring entry floor.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise / Custom",
        description:
          "Enterprise bundles, volume discounts, and multi-year commits — contact sales.",
      },
    ],
    featureOverrides: {
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
      "enterprise-security": "supported",
      "analytics-reporting": "supported",
    },
    aiLines: [
      "ITSM AI copilot: limited",
      "Developer AI copilot: limited",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "aws", kind: "native" },
      { integrationSlug: "azure", kind: "native" },
      { integrationSlug: "google-cloud", kind: "native" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "pagerduty", kind: "native" },
      { integrationSlug: "github", kind: "native" },
    ],
    limitations: [
      "Multi-module TCO (infra + APM + logs + RUM) stacks beyond the $15/host floor",
      "Not an ITSM/service-desk primary peer to Freshservice",
      "Not source control or hosting panel — landscape comparisons only vs GitHub/Plesk",
      "Consumption pricing requires live calculator confirmation",
      "Incident workflows are monitoring-oriented, not full ITIL ITSM",
    ],
    limitationKinds: [
      "requires-add-on",
      "feature-unavailable",
      "feature-unavailable",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 7,
      "it-job-fit": 10,
      "workflow-depth": 10,
      integrations: 9,
      "admin-security": 9,
      scalability: 9,
      "value-for-money": 6,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Datadog’s breadth (infra, APM, logs, security) raises admin learning curve versus single-purpose tools — powerful but not trivial for tiny teams.",
      "it-job-fit":
        "Category-leading fit for observability-monitoring — infrastructure metrics, APM/tracing, and log management are the core published jobs.",
      "workflow-depth":
        "Dashboards, monitors, SLOs, tracing, and log pipelines provide deep SRE/observability workflows when modules are purchased.",
      integrations:
        "Extensive cloud, CI, chat, and on-call integrations are a core Datadog promise — strong ecosystem for modern stacks.",
      "admin-security":
        "Enterprise RBAC, audit logs, SSO/SCIM, and compliance posture are marketed for regulated buyers.",
      scalability:
        "Built for cloud-scale host/log/span volume with enterprise commits — scales well with budget.",
      "value-for-money":
        "Published $15/host floor looks approachable, but multi-module consumption TCO escalates quickly — value score reflects calculator complexity, not affiliate economics.",
      "ai-capabilities":
        "Watchdog, Bits AI, and anomaly features are published observability AI — useful SRE assistance with module/usage packaging.",
    },
    bestFor: [
      "SRE/platform teams needing unified infra + APM + logs",
      "Cloud-native orgs with AWS/Azure/GCP estates",
      "Teams that can model multi-module observability TCO upfront",
    ],
    notIdealFor: [
      "Buyers whose primary job is ITSM ticketing (Freshservice)",
      "Small teams needing predictable single-line seat pricing only",
      "Source-control-first purchases (GitHub)",
    ],
    pros: [
      "Strong observability primary job across infra, APM, and logs",
      "Deep cloud and CI/CD integration catalog",
      "Published Infrastructure Pro host floor",
      "Free tier for limited evaluation",
      "Enterprise security and AI-assisted monitoring features",
    ],
    cons: [
      "Multi-module consumption TCO is complex",
      "Not ITSM or source control",
      "Requires calculator discipline before commit",
      "Ease-of-use tax from platform breadth",
      "Landscape-only comparisons vs ITSM/hosting peers",
    ],
    keyFeatures: [
      "Infrastructure monitoring and alerting",
      "APM and distributed tracing",
      "Log management and search",
      "Dashboards and SLO monitoring",
      "Cloud provider integrations",
      "AI-assisted anomaly detection",
    ],
    whoShouldChoose:
      "Choose Datadog when observability — infrastructure, APM, and logs — is the primary job and you can model module/consumption TCO.",
    whoShouldConsiderAlternatives:
      "Compare Freshservice for ITSM, GitHub for source control (landscape only), and specialist log/APM tools if you need a narrower SKU.",
    alternativeSlugs: ["github", "freshservice"],
    competitorSlugs: ["new-relic", "dynatrace", "grafana-cloud", "splunk"],
    comparableSlugs: ["new-relic"],
    useCaseSlugs: ["observability-monitoring"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations"],
  },

  {
    slug: "github",
    name: "GitHub",
    company: "GitHub, Inc.",
    website: "https://github.com",
    domain: "github.com",
    pricingUrl: "https://github.com/pricing",
    aliases: ["GitHub.com", "GitHub Enterprise"],
    membershipRole: "primary",
    jobCluster: "source-control-devops",
    softShortDescription:
      "Source control and DevOps platform — free tier for public/seats; Team $4/user/mo; Enterprise $21/user/mo on annual billing.",
    shortDescription:
      "GitHub is the dominant Git source-control and developer collaboration platform, with Actions CI/CD, code review, and enterprise governance add-ons. Free tier covers public repos and limited private collaboration. Paid annual floors: Team $4/user/month, Enterprise $21/user/month; Enterprise Cloud is contact-shaped for large orgs. Copilot and advanced security are separate lines. Primary job is source control/DevOps — not observability or ITSM.",
    vendorPositioning:
      "Where the world builds software — Git repos, pull requests, Actions automation, and enterprise developer security.",
    pricingModel: "per-seat",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 4,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from github.com/pricing (high confidence). Free for public repos and limited private use. Team $4/user/mo annual; Enterprise $21/user/mo annual. Copilot and Advanced Security are add-on SKUs. No affiliate in inventory. Affiliate economics excluded.",
    pricingSummary:
      "Free tier for public/limited private. Team $4/user/mo; Enterprise $21/user/mo on annual billing. Copilot and Advanced Security add-ons extra. Confirm live seat minimums and enterprise cloud quotes.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description: "Free for public repositories and limited private collaboration.",
      },
      {
        kind: "per-seat-annual",
        slug: "team",
        name: "Team",
        amount: 4,
        highlighted: true,
        description: "$4/user/month billed annually — team collaboration and protected branches.",
      },
      {
        kind: "per-seat-annual",
        slug: "enterprise",
        name: "Enterprise",
        amount: 21,
        description:
          "$21/user/month billed annually — enterprise governance, audit, and compliance depth.",
      },
    ],
    featureOverrides: {
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
      "dev-ai": "add-on",
      "enterprise-security": "supported",
      "analytics-reporting": "supported",
    },
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: add-on",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "jira", kind: "native" },
      { integrationSlug: "azure-devops", kind: "native" },
      { integrationSlug: "aws", kind: "native" },
    ],
    limitations: [
      "Copilot and Advanced Security are paid add-ons beyond Team/Enterprise seats",
      "Not observability or ITSM — landscape comparisons vs Datadog/Freshservice only",
      "Actions minutes and storage overages can raise TCO",
      "Enterprise Cloud large deployments may need custom quotes",
      "Not a hosting control panel",
    ],
    limitationKinds: [
      "requires-add-on",
      "feature-unavailable",
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "it-job-fit": 10,
      "workflow-depth": 9,
      integrations: 10,
      "admin-security": 9,
      scalability: 10,
      "value-for-money": 9,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "GitHub’s PR-centric workflow is the de facto standard for developers — low friction for engineering teams already on Git.",
      "it-job-fit":
        "Category-defining source-control-devops fit — repos, reviews, and Actions CI/CD match the cluster perfectly.",
      "workflow-depth":
        "Branch protection, environments, Actions pipelines, and code scanning provide deep DevOps workflow when paid tiers/add-ons are enabled.",
      integrations:
        "Massive marketplace and native ties to Jira, Slack, cloud providers, and CI ecosystems — best-in-class integration surface for dev platforms.",
      "admin-security":
        "Enterprise tier publishes SSO, audit log, and compliance features; Advanced Security is an add-on for code scanning/secrets.",
      scalability:
        "Scales from solo OSS maintainers to global enterprises — seat ladder and enterprise cloud are proven at huge scale.",
      "value-for-money":
        "Generous free tier plus $4 Team floor is excellent value for source control; add-ons (Copilot, Advanced Security) raise TCO predictably.",
      "ai-capabilities":
        "GitHub Copilot is the flagship dev-AI add-on — strong capability with separate billing rather than unlimited included AI.",
    },
    bestFor: [
      "Software teams needing Git source control as the system of record",
      "Organizations standardising on Actions for CI/CD alongside repos",
      "Enterprises needing audit/SSO governance on code",
    ],
    notIdealFor: [
      "ITSM/service-desk buyers (Freshservice)",
      "SRE teams buying observability as the primary SKU (Datadog)",
      "Web hosts needing server panel administration (Plesk)",
    ],
    pros: [
      "Dominant source-control primary job",
      "Free tier plus affordable Team seats",
      "Actions CI/CD integrated with repos",
      "Enterprise security and audit options",
      "Copilot dev-AI path",
    ],
    cons: [
      "Copilot/Advanced Security cost extra",
      "Not ITSM or full observability",
      "Actions/storage overages possible",
      "Landscape-only vs monitoring peers",
      "Enterprise cloud may need quotes at scale",
    ],
    keyFeatures: [
      "Git repositories and pull requests",
      "GitHub Actions CI/CD",
      "Code review and branch protection",
      "Enterprise SSO and audit logs",
      "GitHub Copilot (add-on)",
      "Integrations marketplace",
    ],
    whoShouldChoose:
      "Choose GitHub when source control and developer collaboration are the primary job — with Actions for CI/CD if needed.",
    whoShouldConsiderAlternatives:
      "Compare Datadog for observability and Freshservice for ITSM on landscape pages only — not as undifferentiated best-list peers.",
    alternativeSlugs: ["datadog", "freshservice"],
    competitorSlugs: ["gitlab", "bitbucket", "azure-devops"],
    comparableSlugs: ["gitlab"],
    useCaseSlugs: ["source-control-devops"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations"],
  },

  {
    slug: "plesk",
    name: "Plesk",
    company: "WebPros International GmbH",
    website: "https://www.plesk.com",
    domain: "plesk.com",
    pricingUrl: "https://www.plesk.com/pricing/",
    aliases: ["Plesk Obsidian"],
    membershipRole: "primary",
    jobCluster: "hosting-operations",
    softShortDescription:
      "Hosting control panel for web/server administration — Web Admin Edition from $16.99/mo on VPS licensing.",
    shortDescription:
      "Plesk is a hosting and server control panel for managing websites, domains, mail, and WordPress/docker workloads on Linux/Windows servers. Web Admin Edition publishes from about $16.99/month for VPS-style licensing (edition and server-type dependent). Web Pro and Web Host editions add reseller/multi-domain depth at higher price points. Per-server licence model — not per developer seat. Affiliate via aff-plesk.",
    vendorPositioning:
      "Server control panel for web professionals and hosts — simplify site, mail, and application administration on owned infrastructure.",
    pricingModel: "flat",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 16.99,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from plesk.com/pricing (high confidence). Web Admin Edition ~$16.99/mo VPS licence commonly cited; Web Pro/Web Host higher. Pricing varies by server type (VPS vs dedicated) and edition. 14-day trial. Affiliate aff-plesk with published reader offer history. Affiliate economics excluded from scoring.",
    pricingSummary:
      "Web Admin Edition from ~$16.99/mo (VPS licence; edition/server dependent). Web Pro/Web Host higher. 14-day trial. Per-server licence — not per seat. Confirm live edition matrix on plesk.com/pricing.",
    plans: [
      {
        kind: "flat-monthly",
        slug: "web-admin",
        name: "Web Admin Edition",
        amount: 16.99,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "~$16.99/month VPS licence — admin panel for up to limited domains/sites (edition dependent).",
      },
      {
        kind: "flat-monthly",
        slug: "web-pro",
        name: "Web Pro Edition",
        amount: 23.99,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "Higher-tier panel for developers/resellers needing more domains and WordPress/docker tooling.",
      },
      {
        kind: "flat-monthly",
        slug: "web-host",
        name: "Web Host Edition",
        amount: 41.99,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "Host/reseller edition with multi-customer management — confirm live pricing for server type.",
      },
    ],
    featureOverrides: {
      "incident-management": "not-supported",
      "change-problem": "not-supported",
      "service-catalog": "not-supported",
      "infrastructure-monitoring": "limited",
      "apm-tracing": "not-supported",
      "log-management": "limited",
      "source-control": "not-supported",
      "cicd-actions": "not-supported",
      "hosting-panel": "supported",
      "proxy-network": "not-supported",
      "itsm-ai": "not-supported",
      "dev-ai": "not-supported",
      "enterprise-security": "limited",
      "analytics-reporting": "limited",
    },
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: not-supported",
      "AI automation: not-supported",
      "AI recommendations: not-supported",
    ],
    integrations: [
      { integrationSlug: "wordpress", kind: "native" },
      { integrationSlug: "docker", kind: "native" },
      { integrationSlug: "lets-encrypt", kind: "native" },
    ],
    limitations: [
      "Per-server licence math — not comparable to per-seat DevOps or per-agent ITSM",
      "Not observability, ITSM, or source control",
      "Edition/server-type pricing matrix requires live confirmation",
      "Limited AI/automation versus developer platforms",
      "Landscape-adjacent only vs web-data platforms like Bright Data",
    ],
    limitationKinds: [
      "other",
      "feature-unavailable",
      "other",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 8,
      "it-job-fit": 9,
      "workflow-depth": 8,
      integrations: 7,
      "admin-security": 7,
      scalability: 8,
      "value-for-money": 8,
      "ai-capabilities": 4,
    },
    scoreRationales: {
      "ease-of-use":
        "Plesk targets web hosts and admins with GUI-first server management — approachable for hosting ops versus raw CLI-only administration.",
      "it-job-fit":
        "Strong hosting-operations cluster fit — domains, mail, WordPress, and docker admin on owned servers.",
      "workflow-depth":
        "Multi-site, reseller, and WordPress/docker tooling on Pro/Host editions give solid panel workflow depth for web ops.",
      integrations:
        "WordPress/docker/Let’s Encrypt tooling is native; not a broad SaaS integration hub like ITSM or observability suites.",
      "admin-security":
        "Panel RBAC and security extensions exist; enterprise SSO depth is limited versus cloud SaaS dev/IT platforms.",
      scalability:
        "Web Host/reseller editions scale to multi-customer hosting businesses; licence tiers map to server growth.",
      "value-for-money":
        "~$16.99 Web Admin floor is competitive for VPS panel admin; higher editions and server counts raise TCO. Affiliate economics excluded.",
      "ai-capabilities":
        "No meaningful published ITSM/dev AI copilot — hosting panel job rarely needs AI scoring depth.",
    },
    bestFor: [
      "Web agencies and hosts administering sites on VPS/dedicated servers",
      "Admins wanting GUI panel versus manual LAMP/stack configuration",
      "Resellers needing Web Host multi-customer management",
    ],
    notIdealFor: [
      "Developer teams buying source control (GitHub)",
      "SRE observability purchases (Datadog)",
      "Web data/proxy collection jobs (Bright Data)",
    ],
    pros: [
      "Clear hosting-panel primary job",
      "Published Web Admin ~$16.99/mo entry floor",
      "WordPress/docker tooling on higher editions",
      "14-day trial",
      "Affiliate programme available (aff-plesk)",
    ],
    cons: [
      "Per-server licence — different math from seat/agent tools",
      "Not ITSM, observability, or Git",
      "AI capabilities minimal",
      "Edition matrix can confuse first-time buyers",
      "Landscape-only comparisons vs Bright Data",
    ],
    keyFeatures: [
      "Website and domain administration",
      "Mail and DNS management",
      "WordPress toolkit",
      "Docker and extension ecosystem",
      "Reseller/hosting business tools (Web Host)",
      "Server security extensions",
    ],
    whoShouldChoose:
      "Choose Plesk when hosting/server panel administration is the primary job on infrastructure you control.",
    whoShouldConsiderAlternatives:
      "Compare Bright Data only on adjacent landscape pages for web-data jobs — not as a hosting-panel peer ranking.",
    alternativeSlugs: ["bright-data"],
    competitorSlugs: ["cpanel", "directadmin", "cloudways"],
    comparableSlugs: ["cpanel"],
    useCaseSlugs: ["hosting-operations"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    teamTypeSlugs: ["operations"],
    catalogueSourceId: "aff-plesk",
    affiliateUrl: "https://try.plesk.com/tu2la8fk5ac9-z4f5m7",
  },

  {
    slug: "bright-data",
    name: "Bright Data",
    company: "Bright Data Ltd.",
    website: "https://brightdata.com",
    domain: "brightdata.com",
    pricingUrl: "https://brightdata.com/pricing",
    aliases: ["Luminati", "Bright Data proxy network"],
    membershipRole: "primary",
    jobCluster: "web-data-collection",
    softShortDescription:
      "Web data / proxy platform — pay-as-you-go from ~$4/GB residential; starter commitments from ~$499/mo.",
    shortDescription:
      "Bright Data operates a large proxy and web data collection network (residential, datacenter, ISP, mobile) with APIs and scraper tooling for engineering and data teams. Pay-as-you-go residential pricing publishes from about $4/GB; committed starter plans commonly begin near $499/month depending on product line and bandwidth. Usage/GB and commitment pricing dominates — not per-seat ITSM math. Compliance and robots.txt policy posture must be validated for each use case. Affiliate via aff-bright-data.",
    vendorPositioning:
      "Enterprise web data platform — proxies, unblocking, and datasets for reliable large-scale data collection.",
    pricingModel: "usage",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 499,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Researched 2026-08-18 from brightdata.com/pricing (medium confidence — product-line dependent). PAYG residential ~$4/GB cited; starter/commitment plans ~$499/mo floor for common entry packages. Datacenter/mobile lines differ. Compliance and usage policy review required. Affiliate aff-bright-data. Affiliate economics excluded from scoring.",
    pricingSummary:
      "PAYG from ~$4/GB residential; starter commitments ~$499/mo depending on product. No free plan. Confirm live GB rates, minimums, and compliance rules on brightdata.com/pricing.",
    plans: [
      {
        kind: "contact-sales",
        slug: "payg",
        name: "Pay-as-you-go",
        description:
          "Pay-as-you-go residential proxy usage from ~$4/GB — rates vary by proxy type and volume.",
      },
      {
        kind: "flat-annual",
        slug: "starter",
        name: "Starter commitment",
        amount: 499,
        highlighted: true,
        description:
          "~$499/month committed starter packages (product-line dependent) — confirm live calculator.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Enterprise commits, custom SLAs, and dedicated account teams.",
      },
    ],
    featureOverrides: {
      "incident-management": "not-supported",
      "change-problem": "not-supported",
      "service-catalog": "not-supported",
      "infrastructure-monitoring": "not-supported",
      "apm-tracing": "not-supported",
      "log-management": "not-supported",
      "source-control": "not-supported",
      "cicd-actions": "limited",
      "hosting-panel": "not-supported",
      "proxy-network": "supported",
      "itsm-ai": "not-supported",
      "dev-ai": "limited",
      "enterprise-security": "supported",
      "analytics-reporting": "supported",
    },
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "python", kind: "native" },
      { integrationSlug: "nodejs", kind: "native" },
      { integrationSlug: "scrapy", kind: "native" },
      { integrationSlug: "selenium", kind: "native" },
    ],
    limitations: [
      "GB/commitment pricing is opaque without live calculator — medium pricing confidence",
      "Compliance and acceptable-use rules must be validated per project",
      "Not ITSM, observability, source control, or hosting panel",
      "Starter ~$499/mo floor is expensive for casual scraping experiments",
      "Landscape-adjacent only vs Plesk/hosting tools",
    ],
    limitationKinds: [
      "other",
      "other",
      "feature-unavailable",
      "plan-restriction",
      "other",
    ],
    scores: {
      "ease-of-use": 7,
      "it-job-fit": 9,
      "workflow-depth": 8,
      integrations: 8,
      "admin-security": 8,
      scalability: 9,
      "value-for-money": 6,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "API-first proxy/data platform with learning curve for network types, zones, and compliance — powerful for data engineers, not casual admins.",
      "it-job-fit":
        "Strong web-data-collection cluster fit — residential/datacenter/mobile proxy networks and scraper APIs match the primary job.",
      "workflow-depth":
        "Dataset marketplaces, browser automation, and unblocker tooling give deep collection workflows for engineering teams.",
      integrations:
        "SDK/API coverage for Python/Node/Scrapy/Selenium ecosystems is broad for data engineering stacks.",
      "admin-security":
        "Enterprise compliance tooling, IP allowlists, and account governance are marketed for regulated data collection.",
      scalability:
        "Built for large-scale GB throughput and enterprise commits — scales with budget and compliance review.",
      "value-for-money":
        "~$4/GB PAYG and ~$499/mo starter commits are premium versus DIY proxies — value reflects reliability, not affiliate economics.",
      "ai-capabilities":
        "Some scraper/unblocker automation uses ML internally; no dev/ITSM copilot comparable to GitHub Copilot or Freddy AI.",
    },
    bestFor: [
      "Data engineering teams needing reliable residential/datacenter proxy networks",
      "Enterprises with budget for committed web-data infrastructure",
      "Projects with clear compliance review and acceptable-use alignment",
    ],
    notIdealFor: [
      "Hosting admins buying server panels (Plesk)",
      "Teams needing predictable per-seat SaaS pricing",
      "Casual hobby scraping without compliance budget",
    ],
    pros: [
      "Category-leading proxy/web-data network breadth",
      "PAYG and committed plan options",
      "Strong API/SDK ecosystem",
      "Enterprise compliance posture marketed",
      "Affiliate programme (aff-bright-data)",
    ],
    cons: [
      "Premium GB/commitment pricing",
      "No free plan — high entry for experiments",
      "Compliance diligence required",
      "Not ITSM/observability/Git/hosting primary",
      "Medium confidence on exact starter package dollars",
    ],
    keyFeatures: [
      "Residential/datacenter/mobile proxy networks",
      "Web scraper APIs and unblocker",
      "Dataset marketplace",
      "Browser automation integrations",
      "Enterprise account governance",
      "Usage analytics and reporting",
    ],
    whoShouldChoose:
      "Choose Bright Data when web data collection at scale — with proxy network reliability — is the primary job and budget supports GB/commitment pricing.",
    whoShouldConsiderAlternatives:
      "Compare Plesk only on adjacent landscape pages for hosting ops — not as a web-data peer ranking.",
    alternativeSlugs: ["plesk"],
    competitorSlugs: ["oxylabs", "smartproxy", "scraperapi"],
    comparableSlugs: ["oxylabs"],
    useCaseSlugs: ["web-data-collection"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations"],
    catalogueSourceId: "aff-bright-data",
    affiliateUrl: "https://get.brightdata.com/egcchebrm7g5",
  },
];

export const PRODUCTS = COMPACT.map(expandItProduct);

/**
 * Landscape / adjacent comparison pairs across IT job clusters.
 * Do NOT treat these as undifferentiated best-list peers.
 */
export const COMPARISON_PAIRS = [
  ["freshservice", "datadog"],
  ["github", "datadog"],
  ["plesk", "bright-data"],
  ["datadog", "github"],
];
