/**
 * Live-verified publication, commentary-platform, and seasonal matches (2026-08-15).
 * Do not invent journalist names — only include named authors when observed on the page.
 */

import type {
  ExpertCommentaryChannel,
  PublicationMatch,
  SeasonalHook,
} from "./types";

export const DIGITAL_PR_LIVE_VERIFIED_AT = "2026-08-15T09:00:00.000Z";

const V = DIGITAL_PR_LIVE_VERIFIED_AT;

export const DIGITAL_PR_LIVE_QUERIES_RUN: string[] = [
  "CRM pricing 2026 journalist coverage SaaS pricing trends",
  "expert commentary request CRM software AI SaaS 2026 Help a Reporter Out",
  "Featured.com Qwoted HARO expert sources SaaS CRM",
  "CRM buying guide pricing comparison Capterra",
  "Dreamforce 2026 Salesforce AI announcement",
  "SaaS Pricing Trends to Watch in 2026 Zylo",
  "State of CRM Pricing Q1 2026",
  "CRM AI Pricing Shake-Out 2026",
];

export const PUBLICATION_MATCHES: PublicationMatch[] = [
  {
    publication: "Capterra Resources",
    url: "https://www.capterra.com/resources/customer-relationship-management-software-pricing-models/",
    recentCoverageAngle:
      "Guide to CRM software pricing models — subscription tiers, upfront/recurring costs, how pricing changes with growth (2026 Shortlist context).",
    verifiedAt: V,
    discoveryQuery: "CRM buying guide pricing comparison Capterra",
  },
  {
    publication: "Sasanova",
    url: "https://www.sasanova.com/guides/state-of-crm-pricing-q1-2026",
    recentCoverageAngle:
      "State of CRM Pricing Q1 2026 — per-seat tables by team size, HubSpot cliff analysis, Salesforce list-price increases.",
    verifiedAt: V,
    discoveryQuery: "State of CRM Pricing Q1 2026",
  },
  {
    publication: "CompareEdge",
    url: "https://comparedge.com/reports/crm-pricing-2026",
    recentCoverageAngle:
      "CRM Pricing Report 2026 — entry prices, free-tier prevalence, multi-vendor comparison tables.",
    verifiedAt: V,
    discoveryQuery: "CRM pricing 2026 journalist coverage SaaS pricing trends",
  },
  {
    publication: "Zylo",
    url: "https://zylo.com/blog/saas-pricing-trends",
    recentCoverageAngle:
      "2026 SaaS pricing trends — AI monetization, hybrid/consumption layers, budget predictability vs usage meters.",
    verifiedAt: V,
    discoveryQuery: "SaaS Pricing Trends to Watch in 2026 Zylo",
  },
  {
    publication: "TechCrunch",
    url: "https://techcrunch.com/2026/03/01/investors-spill-what-they-arent-looking-for-anymore-in-ai-saas-companies/",
    recentCoverageAngle:
      "AI SaaS investor preferences — notes rigid per-seat models harder to defend; consumption/hybrid pricing context (Mar 2026).",
    verifiedAt: V,
    discoveryQuery: "CRM pricing 2026 journalist coverage SaaS pricing trends",
  },
  {
    publication: "CIOPages",
    url: "https://www.ciopages.com/buyer-guides/crm-platform",
    recentCoverageAngle:
      "CRM buyer guide — per-user tiers plus AI agent consumption; TCO drivers beyond list seat price.",
    verifiedAt: V,
    discoveryQuery: "CRM buying guide pricing comparison Capterra",
  },
  {
    publication: "CRM Curator",
    url: "https://crmcurator.com/articles/general/crm-vendor-ai-pricing-shake-out-2026/",
    recentCoverageAngle:
      "CRM AI pricing shake-out 2026 — seats, tokens, outcomes; Agentforce / hybrid meter discussion.",
    verifiedAt: V,
    discoveryQuery: "CRM AI Pricing Shake-Out 2026",
  },
  {
    publication: "Salesforce Break",
    url: "https://salesforcebreak.com/2026/07/17/agentforce-pricing-tiers-explained/",
    recentCoverageAngle:
      "Agentforce pricing tiers explained (Jul 2026) — Flex Credits, conversations, edition bundles.",
    verifiedAt: V,
    discoveryQuery: "Dreamforce 2026 Salesforce AI announcement",
  },
  {
    publication: "MarketScale",
    url: "https://www.marketscale.com/industries/software-and-technology/dreamforce-2026-puts-the-agentic-enterprise-on-trial-in-san-francisco-this-september",
    recentCoverageAngle:
      "Dreamforce 2026 preview — Agentic Enterprise, Agentforce, Data 360; Sept 15–17 San Francisco timing.",
    verifiedAt: V,
    discoveryQuery: "Dreamforce 2026 Salesforce AI announcement",
  },
  {
    publication: "PressVerified",
    url: "https://pressverified.com/blog/after-haro-source-request-platforms-tested-2026",
    recentCoverageAngle:
      "2026 comparison of journalist source-request platforms (Featured, Qwoted, Help A B2B Writer, Source of Sources).",
    verifiedAt: V,
    discoveryQuery: "Featured.com Qwoted HARO expert sources SaaS CRM",
  },
];

export const EXPERT_COMMENTARY_CHANNELS: ExpertCommentaryChannel[] = [
  {
    platform: "Featured.com (incl. HARO brand relaunch)",
    url: "https://featured.com/",
    notes:
      "Live research (2026): Featured.com runs curated expert roundups; HARO brand relaunched under Featured ownership as free journalist-request digests — pitch only with real SG data points.",
    costNotes: "Free digests reported; Featured Pro tiers ~$99–$149/mo in 2026 roundups",
    verifiedAt: V,
    discoveryQuery: "Featured.com Qwoted HARO expert sources SaaS CRM",
  },
  {
    platform: "Qwoted",
    url: "https://www.qwoted.com/",
    notes:
      "Verified journalist ↔ expert marketplace; B2B/tech queries common — use for software-buying insights with sourced SG figures, not invented stats.",
    costNotes: "Free tier with limits; Pro tiers reported in 2026 comparisons",
    verifiedAt: V,
    discoveryQuery: "Featured.com Qwoted HARO expert sources SaaS CRM",
  },
  {
    platform: "Help A B2B Writer",
    url: "https://helpab2bwriter.com/",
    notes:
      "Niche B2B source requests (lower volume). Good fit for CRM/RevOps buying commentary when queries match. Acquired by Superpath; free source registration remains public.",
    costNotes: "Reported free for sources",
    verifiedAt: V,
    discoveryQuery: "expert commentary request CRM software AI SaaS 2026 Help a Reporter Out",
  },
  {
    platform: "Source of Sources (coverage)",
    url: "https://pressverified.com/blog/after-haro-source-request-platforms-tested-2026",
    notes:
      "Peter Shankman post-HARO source network described in 2026 platform tests — public requests; higher spam risk per reviews — filter carefully. Use PressVerified comparison as verified entry point.",
    costNotes: "Free + optional early-access tier reported",
    verifiedAt: V,
    discoveryQuery: "Featured.com Qwoted HARO expert sources SaaS CRM",
  },
];

export const SEASONAL_HOOKS: SeasonalHook[] = [
  {
    hook: "Dreamforce 2026 — Agentic Enterprise / Agentforce news cycle",
    window: "2026-09-15 → 2026-09-17 (plus ±2 weeks news window)",
    relatedPrIdeaIds: ["pr-ai-feature-comparison", "pr-pricing-index"],
    sourceUrl:
      "https://www.marketscale.com/industries/software-and-technology/dreamforce-2026-puts-the-agentic-enterprise-on-trial-in-san-francisco-this-september",
    verifiedAt: V,
    notes:
      "Pair AI-capability availability study + list-price vs AI-add-on framing; do not invent Agentforce usage stats.",
  },
  {
    hook: "Q4 budget / year-end software planning season",
    window: "Oct–Dec annually (peak Nov–Jan renewals)",
    relatedPrIdeaIds: [
      "pr-pricing-index",
      "pr-team-size-pricing",
      "pr-plan-gating",
    ],
    verifiedAt: V,
    notes:
      "Natural demand for team-size cost tables, plan-gating cliffs, free/trial prevalence.",
  },
  {
    hook: "Ongoing CRM AI pricing / consumption-meter coverage",
    window: "Ongoing through 2026 (post Agentforce SKU changes)",
    relatedPrIdeaIds: ["pr-ai-feature-comparison", "pr-pricing-index"],
    sourceUrl:
      "https://crmcurator.com/articles/general/crm-vendor-ai-pricing-shake-out-2026/",
    verifiedAt: V,
    notes:
      "Media already covering seats/tokens/outcomes — SG can contribute researched availability + list-price structure, not outcome ROI claims.",
  },
  {
    hook: "Annual SaaS pricing-trend roundups",
    window: "Q1 reports + mid-year trend pieces",
    relatedPrIdeaIds: ["pr-free-trial-prevalence", "pr-plan-gating"],
    sourceUrl: "https://zylo.com/blog/saas-pricing-trends",
    verifiedAt: V,
    notes:
      "Contribute CRM-category slices from SG corpus when trend pieces need concrete category examples.",
  },
];

export function assertDigitalPrLiveMatchesPresent(
  publications: PublicationMatch[],
  commentary: ExpertCommentaryChannel[],
): void {
  if (publications.length < 5) {
    throw new Error(
      "DigitalPROpportunityAgent requires live publication matches — run a live search pass.",
    );
  }
  if (commentary.length < 3) {
    throw new Error(
      "DigitalPROpportunityAgent requires live expert-commentary channels — run a live search pass.",
    );
  }
}
