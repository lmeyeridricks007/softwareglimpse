/**
 * IT gap-fill PaaS + incident pack (compact).
 * railway, heroku, squadcast (SolarWinds Incident Response).
 *
 * Pricing grounded 2026-08-18 from first-party pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 *
 * Render (7.9) remains the cloud-paas award — Railway / Heroku do not outrank.
 * PagerDuty (8.0) remains the incident-oncall award — Squadcast does not outrank.
 * Fly.io (7.7) stays the PaaS peer; incident.io / FireHydrant / Rootly stay incident peers.
 *
 * Each compact entry passes jobCluster and matching useCaseSlugs into expandItProduct.
 */
import { expandItProduct } from "./it-compact-expand.mjs";

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
  "cloud-paas": "not-supported",
  "proxy-network": "not-supported",
  "itsm-ai": "limited",
  "dev-ai": "limited",
  "oncall-paging": "supported",
  "enterprise-security": "limited",
  "analytics-reporting": "supported",
};

const COMPACT = [
  {
    slug: "railway",
    name: "Railway",
    company: "Railway Corp",
    website: "https://railway.com",
    domain: "railway.com",
    pricingUrl: "https://railway.com/pricing",
    aliases: ["Railway.app", "Railway PaaS", "Railway Cloud"],
    membershipRole: "primary",
    jobCluster: "cloud-paas",
    softShortDescription:
      "Cloud PaaS / app platform — Free Trial $5 credits / 30 days; Free $0 + $1 credits; Hobby $5/mo incl. $5 credits; Pro $20/mo per workspace; Enterprise custom. Does not outrank Render 7.9.",
    shortDescription:
      "Railway is a cloud PaaS / app platform (git-push services, databases, and usage-credited workspaces) from Railway Corp — not a managed WordPress host and not a Plesk/cPanel panel licence. Free Trial gives $5 credits for 30 days with no card. Free is $0/month with $1 usage credits. Hobby is $5/month including $5 credits and is the published research floor (startingPriceMonthly 5). Pro is $20/month per workspace including $20 credits (unlimited seats) — the production team floor above Hobby. Enterprise is custom. Same cloud-paas cluster as Render and Fly.io — Render remains the award (7.9); this entity does not outrank it. Peer of Heroku and Fly.io. Landscape-only versus WP Engine (managed WordPress).",
    vendorPositioning:
      "Git-push app platform with credited workspaces — Hobby $5 is the research floor; Pro $20 is the production team floor; Free $1 credits are not production TCO.",
    pricingModel: "flat",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 30,
    startingPriceMonthly: 5,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from railway.com/pricing (high confidence). Free Trial $5 credits / 30 days, no card. Free $0/mo with $1 usage credits. Hobby $5/mo including $5 credits (startingPriceMonthly 5). Pro $20/mo per workspace including $20 credits, unlimited seats. Enterprise custom. Affiliate economics excluded.",
    pricingSummary:
      "Free Trial $5 credits / 30 days. Free $0 + $1 credits. Hobby from $5/mo incl. $5 credits. Pro $20/mo per workspace. Enterprise custom. Confirm live on railway.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free-trial",
        name: "Free Trial",
        limits: ["$5 credits / 30 days", "No card required"],
        description:
          "Free Trial — $5 credits for 30 days, no card. Evaluation path, not the Hobby research floor.",
      },
      {
        kind: "free",
        slug: "free",
        name: "Free",
        limits: ["$1 usage credits / month"],
        description:
          "Free $0/mo with $1 usage credits — not production TCO; Hobby $5 is the research floor.",
      },
      {
        kind: "flat-monthly",
        slug: "hobby",
        name: "Hobby",
        amount: 5,
        highlighted: true,
        description:
          "$5/mo Hobby including $5 credits — published research floor on railway.com/pricing.",
      },
      {
        kind: "flat-monthly",
        slug: "pro",
        name: "Pro",
        amount: 20,
        description:
          "$20/mo Pro per workspace including $20 credits (unlimited seats) — production team floor above Hobby.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Custom Enterprise Railway workspace — contact sales.",
      },
    ],
    featureOverrides: {
      ...PAAS_FEATURES,
      "cloud-paas": "supported",
      "managed-hosting": "limited",
      "cicd-actions": "limited",
      "hosting-panel": "not-supported",
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
      "Free $1 credits and Free Trial are not production TCO — Hobby $5 is the research floor; Pro $20 is the team floor",
      "Not managed WordPress hosting (WP Engine) — landscape only",
      "Not a hosting control-panel licence (Plesk/cPanel)",
      "Not ITSM, observability, git host, or a proxy network",
    ],
    limitationKinds: [
      "other",
      "plan-restriction",
      "feature-unavailable",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
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
        "Git-push dashboard plus Free/Hobby credited on-ramps are approachable; slightly less polished than Render’s award path. Not a lab test.",
      "it-job-fit":
        "Cloud PaaS / app platform — ranked with Render, Fly.io, and Heroku, not WP Engine managed WordPress.",
      "workflow-depth":
        "Services, databases, and git deploys cover the PaaS job; not a full CI product or Kubernetes control plane.",
      integrations: "GitHub native deploys plus API cover the app-platform workflow.",
      "admin-security":
        "Pro/Enterprise add governance; Hobby/Free are team-grade. Held at 7 versus enterprise clouds.",
      scalability: "Pro workspace + Enterprise; Hobby $5 is not a large-estate Kubernetes story.",
      "value-for-money":
        "Published Hobby $5 floor plus Free $1 credits is a sharp PaaS entry versus Render Pro $25. Affiliate economics excluded.",
      "ai-capabilities":
        "No meaningful ITSM/dev AI copilot — scored low on purpose; PaaS job rarely needs AI scoring depth.",
    },
    bestFor: [
      "Teams that want a credited cloud PaaS with a published Hobby $5 floor",
      "Buyers comparing Railway Hobby/Pro to Render Pro $25 and Fly.io PAYG",
      "Orgs that will treat Free $1 credits as evaluation, not production TCO",
    ],
    notIdealFor: [
      "Teams buying managed WordPress (WP Engine) — landscape only",
      "Admins buying Plesk/cPanel licences for servers they already own",
      "ITSM or observability purchases",
    ],
    pros: [
      "Hobby $5 research floor + Pro $20 team floor",
      "Free plan and Free Trial credits",
      "Clear PaaS identity vs managed WP",
      "Same-cluster peer of Render / Fly.io / Heroku",
      "Git-push app platform",
    ],
    cons: [
      "Does not outrank Render",
      "Usage credits still meter above Hobby/Pro tiles",
      "Not managed WordPress",
      "AI is not the product",
      "Not a panel licence",
    ],
    keyFeatures: [
      "Git-push cloud PaaS",
      "Hobby $5/mo including credits",
      "Pro $20/mo per workspace",
      "Free + Free Trial credit paths",
      "Enterprise custom",
    ],
    whoShouldChoose:
      "Choose Railway when a credited cloud PaaS with a published Hobby $5 floor is the job — not Render by default, and not WP Engine managed WordPress.",
    whoShouldConsiderAlternatives:
      "Compare Render for the cloud-paas award path; Fly.io for PAYG microVMs; Heroku for Salesforce-backed dyno packaging; WP Engine only on landscape pages for managed WordPress.",
    alternativeSlugs: ["render", "fly-io"],
    competitorSlugs: ["render", "fly-io", "heroku", "wp-engine"],
    comparableSlugs: ["render", "fly-io", "heroku"],
    useCaseSlugs: ["cloud-paas"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering"],
    sourcesExtra: [
      {
        id: "railway-pricing",
        url: "https://railway.com/pricing",
        title: "Railway pricing",
        domains: ["pricing", "plans", "free-plan", "free-trial", "limits"],
      },
    ],
  },
  {
    slug: "heroku",
    name: "Heroku",
    company: "Salesforce, Inc. / Heroku",
    website: "https://www.heroku.com",
    domain: "heroku.com",
    pricingUrl: "https://www.heroku.com/pricing",
    aliases: ["Heroku PaaS", "Heroku Dynos", "Salesforce Heroku"],
    membershipRole: "primary",
    jobCluster: "cloud-paas",
    softShortDescription:
      "Cloud PaaS / Cedar dynos — Eco $5 (sleeps); Basic $7 always-on (research floor); Standard-1X $25; Standard-2X $50; Performance-M $250+. No forever-free dyno. Does not outrank Render 7.9.",
    shortDescription:
      "Heroku is Salesforce’s cloud PaaS (Cedar dynos, add-ons, and git-push deploys) — not a managed WordPress host and not a panel licence. Eco is $5/month but sleeps after 30 minutes inactivity and is personal-only — not the always-on research floor. Basic is $7/month always-on and is startingPriceMonthly 7. Standard-1X $25, Standard-2X $50, Performance-M $250 and higher dynos scale up. No forever-free dyno (hasFreePlan false). Same cloud-paas cluster as Render, Railway, and Fly.io — Render remains the award (7.9); this entity does not outrank it. Peer of Railway and Fly.io.",
    vendorPositioning:
      "Classic Salesforce-backed PaaS — Basic $7 always-on is the floor; Eco $5 sleep dynos are not production always-on TCO.",
    pricingModel: "flat",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 7,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from heroku.com/pricing Cedar dynos (high confidence). Eco $5 (sleeps after 30 min, personal only) — not the always-on research floor. Basic $7 always-on = startingPriceMonthly 7. Standard-1X $25; Standard-2X $50; Performance-M $250+. No forever-free dyno. Affiliate economics excluded.",
    pricingSummary:
      "No free forever dyno. Eco $5 (sleeps after 30 min). Basic from $7 always-on (research floor). Standard-1X $25; Standard-2X $50; Performance-M $250+. Confirm live on heroku.com/pricing.",
    plans: [
      {
        kind: "flat-monthly",
        slug: "eco",
        name: "Eco",
        amount: 5,
        description:
          "$5/mo Eco dyno — sleeps after 30 min inactivity; personal only. Not the always-on research floor.",
      },
      {
        kind: "flat-monthly",
        slug: "basic",
        name: "Basic",
        amount: 7,
        highlighted: true,
        description:
          "$7/mo Basic always-on dyno — published always-on research floor on heroku.com/pricing.",
      },
      {
        kind: "flat-monthly",
        slug: "standard-1x",
        name: "Standard-1X",
        amount: 25,
        description: "$25/mo Standard-1X Cedar dyno.",
      },
      {
        kind: "flat-monthly",
        slug: "standard-2x",
        name: "Standard-2X",
        amount: 50,
        description: "$50/mo Standard-2X Cedar dyno.",
      },
      {
        kind: "flat-monthly",
        slug: "performance-m",
        name: "Performance-M",
        amount: 250,
        description: "$250/mo Performance-M Cedar dyno — higher performance ladder.",
      },
    ],
    featureOverrides: {
      ...PAAS_FEATURES,
      "cloud-paas": "supported",
      "managed-hosting": "limited",
      "cicd-actions": "limited",
      "hosting-panel": "not-supported",
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
      "Eco $5 dynos sleep after 30 minutes of inactivity and are personal-only — not always-on production; Basic $7 is the always-on floor",
      "No forever-free dyno (hasFreePlan false)",
      "Not managed WordPress hosting (WP Engine) — landscape only",
      "Not ITSM, observability, a git host, or a panel licence",
    ],
    limitationKinds: [
      "other",
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "it-job-fit": 9,
      "workflow-depth": 8,
      integrations: 8,
      "admin-security": 8,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Classic git-push dyno UX remains approachable; Salesforce packaging is familiar to many teams. Not a lab test.",
      "it-job-fit":
        "Cloud PaaS / app platform — ranked with Render, Railway, and Fly.io, not WP Engine managed WordPress.",
      "workflow-depth":
        "Dynos, add-ons, and pipelines cover the PaaS job; not a Kubernetes control plane.",
      integrations: "GitHub/API plus a mature add-on marketplace cover app-platform workflows.",
      "admin-security":
        "Salesforce-backed org controls are solid for mid-market PaaS; held at 8.",
      scalability: "Standard/Performance dynos scale; not an unlimited Kubernetes estate story.",
      "value-for-money":
        "Basic $7 always-on is clear, but Eco sleep traps and Standard/Performance steps weaken value versus Railway Hobby $5 / Render Pro. Affiliate economics excluded.",
      "ai-capabilities":
        "No meaningful ITSM/dev AI copilot — scored low on purpose.",
    },
    bestFor: [
      "Teams that want Salesforce-backed Cedar dynos with a published Basic $7 always-on floor",
      "Buyers comparing Heroku Basic to Railway Hobby/Pro and Render Pro $25",
      "Orgs that will not treat Eco sleep dynos as production always-on TCO",
    ],
    notIdealFor: [
      "Teams that need a forever-free dyno or Hobby-credit evaluation path",
      "Managed WordPress buyers (WP Engine) — landscape only",
      "ITSM or observability purchases",
    ],
    pros: [
      "Basic $7 always-on floor documented separately from Eco sleep",
      "Mature add-on / dyno ladder",
      "Salesforce-backed PaaS identity",
      "Same-cluster peer of Render / Railway / Fly.io",
      "Clear Standard/Performance scale path",
    ],
    cons: [
      "Does not outrank Render",
      "Eco sleeps after 30 min — easy TCO trap",
      "No forever-free dyno",
      "AI is not the product",
      "Not managed WordPress",
    ],
    keyFeatures: [
      "Cedar dyno PaaS",
      "Basic $7 always-on floor",
      "Eco $5 (sleeps after 30 min)",
      "Standard / Performance dyno ladder",
      "Git-push deploys + add-ons",
    ],
    whoShouldChoose:
      "Choose Heroku when Salesforce-backed Cedar dynos with a Basic $7 always-on floor are the job — not Render by default, and not Eco sleep as production TCO.",
    whoShouldConsiderAlternatives:
      "Compare Render for the cloud-paas award path; Railway for credited Hobby/Pro workspaces; Fly.io for PAYG microVMs.",
    alternativeSlugs: ["render", "railway"],
    competitorSlugs: ["render", "railway", "fly-io", "wp-engine"],
    comparableSlugs: ["render", "railway", "fly-io"],
    useCaseSlugs: ["cloud-paas"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering"],
    sourcesExtra: [
      {
        id: "heroku-pricing",
        url: "https://www.heroku.com/pricing",
        title: "Heroku pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "squadcast",
    name: "SolarWinds Incident Response",
    company: "SolarWinds Corporation",
    website: "https://www.solarwinds.com/it-incident-response-software",
    domain: "solarwinds.com",
    pricingUrl: "https://www.solarwinds.com/it-incident-response-software/pricing",
    aliases: [
      "Squadcast",
      "SolarWinds IR",
      "SWI Incident Response",
      "SolarWinds Incident Response (Squadcast)",
    ],
    membershipRole: "primary",
    jobCluster: "incident-oncall",
    softShortDescription:
      "SolarWinds Incident Response (formerly Squadcast) — Pro $15/user/mo annual; Premium $24/user/mo annual; Enterprise contact; 14-day trial. Slug remains squadcast. Does not outrank PagerDuty 8.0.",
    shortDescription:
      "SolarWinds Incident Response is the SolarWinds rebrand of Squadcast (acquired March 2025) — on-call paging plus incident management under one product. The SoftwareGlimpse slug stays `squadcast` for buyer-search / URL continuity (same pattern as smartproxy → Decodo); display name is SolarWinds Incident Response. Pro is $15/user/month billed annually; Premium $24/user/month annual; Enterprise contact. 14-day trial. startingPriceMonthly 15. Same incident-oncall cluster as PagerDuty — PagerDuty remains the award (8.0); this entity does not outrank it. Peer of incident.io, FireHydrant, and Rootly. squadcast.com redirects to solarwinds.com/it-incident-response-software.",
    vendorPositioning:
      "On-call + incident response under the SolarWinds Incident Response brand — Squadcast network with a published Pro $15 annual floor.",
    pricingModel: "per-seat",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 15,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from solarwinds.com/it-incident-response-software/pricing (high confidence). Pro $15/user/mo billed annually; Premium $24/user/mo annual; Enterprise contact. 14-day trial. SolarWinds acquired Squadcast (Mar 2025); product rebranded to SolarWinds Incident Response; slug remains squadcast. Affiliate economics excluded.",
    pricingSummary:
      "No free plan. Pro from $15/user/mo annual. Premium $24/user/mo annual. Enterprise quote. 14-day trial. Confirm live on SolarWinds Incident Response pricing.",
    plans: [
      {
        kind: "per-seat-annual",
        slug: "pro",
        name: "Pro",
        amount: 15,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "$15/user/mo billed annually — Pro on-call / incident-response floor. 14-day trial.",
      },
      {
        kind: "per-seat-annual",
        slug: "premium",
        name: "Premium",
        amount: 24,
        description: "$24/user/mo billed annually — Premium Incident Response pack.",
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
      "oncall-paging": "supported",
      "incident-management": "supported",
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
      "Does not outrank PagerDuty (8.0) as the incident-oncall award",
      "Squadcast rebranded to SolarWinds Incident Response after the Mar 2025 acquisition — same product; do not treat them as two vendors",
      "No published free plan (unlike FireHydrant / incident.io Basic)",
      "Not observability telemetry (Datadog / Honeycomb)",
      "Not an ITSM CMDB (ServiceNow / Freshservice)",
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
      "it-job-fit": 9,
      "workflow-depth": 8,
      integrations: 8,
      "admin-security": 7,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Product-led on-call/incident UX is approachable; SolarWinds rebrand is the naming tax. Not a lab test.",
      "it-job-fit":
        "Incident-oncall — on-call paging plus incident management, ranked with PagerDuty / incident.io / FireHydrant / Rootly.",
      "workflow-depth":
        "Paging + incident command cover the cluster job; held at 8 versus PagerDuty’s award depth.",
      integrations: "Slack/Teams/API cover typical SRE on-call stacks.",
      "admin-security":
        "Pro/Premium are product-led; Enterprise carries heavier governance. Held at 7.",
      scalability: "Per-user Pro/Premium plus Enterprise quote; held below PagerDuty’s scale story.",
      "value-for-money":
        "Published Pro $15/user annual floor matches incident.io Team math and undercuts FireHydrant Pro $25. Affiliate economics excluded.",
      "ai-capabilities":
        "Incident assist exists — scored as supporting, not the buying reason versus PagerDuty paging.",
    },
    bestFor: [
      "Teams that want on-call + incident response with a published Pro $15 annual floor",
      "Buyers comparing SolarWinds Incident Response (Squadcast) to incident.io, FireHydrant, and Rootly",
      "Orgs that will spend the 14-day trial before committing",
    ],
    notIdealFor: [
      "Orgs whose primary job is PagerDuty-style enterprise paging as the award path",
      "Honeycomb/Datadog observability purchases",
      "ITSM ticket desks without on-call / incident command",
    ],
    pros: [
      "Pro $15/user annual floor",
      "On-call paging + incident management supported",
      "14-day trial",
      "URL-stable squadcast slug after SolarWinds rebrand",
      "Same-cluster peer of PagerDuty / incident.io / FireHydrant / Rootly",
    ],
    cons: [
      "Does not outrank PagerDuty",
      "Rebrand / acquisition naming confusion",
      "No free plan",
      "Thinner enterprise scale story than PagerDuty",
      "Not telemetry or ITSM CMDB",
    ],
    keyFeatures: [
      "On-call paging",
      "Incident management / command",
      "Pro $15/user/mo annual",
      "Premium $24/user/mo annual",
      "14-day trial",
    ],
    whoShouldChoose:
      "Choose SolarWinds Incident Response (Squadcast) when on-call + incident response with a published $15 Pro floor is the job — not PagerDuty by default.",
    whoShouldConsiderAlternatives:
      "Compare PagerDuty for the incident-oncall award path; incident.io, FireHydrant, or Rootly for other product-led incident SKUs.",
    alternativeSlugs: ["pagerduty", "incident-io"],
    competitorSlugs: ["pagerduty", "incident-io", "firehydrant", "rootly"],
    comparableSlugs: ["pagerduty", "incident-io", "firehydrant", "rootly"],
    useCaseSlugs: ["incident-oncall"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering", "operations", "it-ops"],
    sourcesExtra: [
      {
        id: "solarwinds-ir-pricing",
        url: "https://www.solarwinds.com/it-incident-response-software/pricing",
        title: "SolarWinds Incident Response pricing",
        domains: ["pricing", "plans", "free-trial", "limits"],
      },
      {
        id: "solarwinds-ir-product",
        url: "https://www.solarwinds.com/it-incident-response-software",
        title: "SolarWinds Incident Response (formerly Squadcast)",
        domains: ["identity", "product-positioning", "features"],
      },
    ],
  },
];

export const PRODUCTS = COMPACT.map(expandItProduct);

export const COMPARISON_PAIRS = [
  ["railway", "render"],
  ["railway", "fly-io"],
  ["heroku", "render"],
  ["heroku", "railway"],
  ["heroku", "fly-io"],
  ["squadcast", "pagerduty"],
  ["squadcast", "incident-io"],
  ["squadcast", "firehydrant"],
  ["railway", "wp-engine"],
];
