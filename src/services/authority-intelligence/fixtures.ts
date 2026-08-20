/**
 * Curated discovery seeds for CRM / B2B SaaS authority opportunities.
 *
 * These are research hypotheses for DISCOVER → VERIFY — not acquired links.
 * Live web search can enrich later; seeds keep the framework deterministic.
 */

import type {
  AcquisitionType,
  AuthorityOpportunityType,
  ExpectedLinkTreatment,
  LikelyFollowStatus,
  ValueBand,
  EffortBand,
  DifficultyBand,
  LikelihoodBand,
  SourceQualityBand,
  SpamRisk,
  PromotionChannelKind,
} from "@/domain/schemas/authority-intelligence";

export type OpportunitySeed = {
  type: AuthorityOpportunityType;
  acquisitionType: AcquisitionType;
  domain: string;
  organization: string;
  url: string;
  opportunityUrl?: string;
  targetSoftwareGlimpsePage?: string;
  targetCluster?: string;
  targetAssetHints?: string[];
  relevance: ValueBand;
  audienceFit: ValueBand;
  opportunityDescription: string;
  reasonWhyTheyMightLink: string;
  suggestedPitchAngle?: string;
  expectedLinkTreatment: ExpectedLinkTreatment;
  likelyFollowStatus: LikelyFollowStatus;
  seoValue: ValueBand;
  referralValue: ValueBand;
  brandValue: ValueBand;
  relationshipValue: ValueBand;
  estimatedEffort: EffortBand;
  estimatedCost?: string;
  recurringCost?: string;
  difficulty: DifficultyBand;
  likelihood: LikelihoodBand;
  sourceQuality: SourceQualityBand;
  spamRisk: SpamRisk;
  contactPath?: string;
  submissionPath?: string;
  promotionChannels: PromotionChannelKind[];
  discoveryQueries: string[];
  evidenceNotes: string[];
  primaryValueProposition?:
    | "editorial-citation"
    | "tool-or-resource-utility"
    | "audience-exposure"
    | "brand-awareness"
    | "relationship-building"
    | "directory-discoverability"
    | "paid-exposure"
    | "link-equity-purchase";
  editorialLegitimacy: ValueBand;
  costBurden?: "none" | "low" | "medium" | "high";
};

/** Realistic CRM-niche opportunity hypotheses (evaluate-only). */
export const AUTHORITY_OPPORTUNITY_SEEDS: OpportunitySeed[] = [
  {
    type: "RESOURCE_PAGE",
    acquisitionType: "EARNED",
    domain: "hubspot.com",
    organization: "HubSpot (education / resource lists)",
    url: "https://www.hubspot.com/",
    opportunityUrl: "https://www.hubspot.com/resources",
    targetSoftwareGlimpsePage: "/tools/crm-finder/",
    targetCluster: "crm",
    targetAssetHints: ["crm-finder", "crm-evaluation-checklist"],
    relevance: "strong",
    audienceFit: "excellent",
    opportunityDescription:
      "Vendor education hubs and partner resource lists occasionally cite independent evaluation tools and checklists.",
    reasonWhyTheyMightLink:
      "Independent CRM Finder / evaluation checklist adds utility without competing as a paid review spam site.",
    suggestedPitchAngle:
      "Offer a free, no-signup CRM evaluation tool + checklist as a complementary resource for buyers researching CRM options.",
    expectedLinkTreatment: "EDITORIAL",
    likelyFollowStatus: "unknown",
    seoValue: "good",
    referralValue: "strong",
    brandValue: "strong",
    relationshipValue: "good",
    estimatedEffort: "large",
    difficulty: "very-hard",
    likelihood: "very-low",
    sourceQuality: "excellent",
    spamRisk: "none",
    contactPath: "Partner / education editorial — human only",
    promotionChannels: ["backlink", "partner", "vendor-ecosystem"],
    discoveryQueries: [
      "CRM evaluation tools resource list",
      "best free CRM checklists site:hubspot.com",
    ],
    evidenceNotes: [
      "High bar; do not pitch as affiliate swap.",
      "Prefer tool/resource deep links over homepage.",
    ],
    primaryValueProposition: "tool-or-resource-utility",
    editorialLegitimacy: "excellent",
    costBurden: "none",
  },
  {
    type: "TOOL_CITATION",
    acquisitionType: "EARNED",
    domain: "zapier.com",
    organization: "Zapier blog / apps ecosystem",
    url: "https://zapier.com/blog",
    targetSoftwareGlimpsePage: "/tools/crm-cost-calculator/",
    targetCluster: "crm",
    targetAssetHints: ["crm-cost-calculator", "crm-tco-calculator"],
    relevance: "strong",
    audienceFit: "strong",
    opportunityDescription:
      "Automation / CRM roundups and cost explainers often cite calculators and comparison frameworks.",
    reasonWhyTheyMightLink:
      "A transparent CRM cost / TCO calculator is a practical citation when discussing CRM pricing complexity.",
    suggestedPitchAngle:
      "Share methodology-backed cost calculator as a reader utility when covering CRM pricing.",
    expectedLinkTreatment: "EDITORIAL",
    likelyFollowStatus: "follow",
    seoValue: "strong",
    referralValue: "strong",
    brandValue: "good",
    relationshipValue: "low",
    estimatedEffort: "medium",
    difficulty: "hard",
    likelihood: "low",
    sourceQuality: "excellent",
    spamRisk: "none",
    contactPath: "Editorial tips / writer outreach — human only",
    promotionChannels: ["backlink", "journalist"],
    discoveryQueries: [
      "CRM pricing calculator",
      "CRM total cost of ownership tool",
      '"CRM cost" calculator resource',
    ],
    evidenceNotes: ["Verify live resource pages before outreach drafts."],
    primaryValueProposition: "tool-or-resource-utility",
    editorialLegitimacy: "excellent",
    costBurden: "none",
  },
  {
    type: "TEMPLATE_CITATION",
    acquisitionType: "EARNED",
    domain: "process.st",
    organization: "Process Street / ops template libraries",
    url: "https://www.process.st/",
    targetSoftwareGlimpsePage: "/resources/crm-implementation-checklist/",
    targetCluster: "crm",
    targetAssetHints: ["crm-implementation-checklist", "crm-migration-checklist"],
    relevance: "good",
    audienceFit: "strong",
    opportunityDescription:
      "Operations and checklist libraries cite implementation / migration templates.",
    reasonWhyTheyMightLink:
      "CRM implementation and migration checklists are practical artifacts process teams bookmark.",
    suggestedPitchAngle:
      "Offer downloadable CRM implementation + migration checklists for ops template roundups.",
    expectedLinkTreatment: "EDITORIAL",
    likelyFollowStatus: "unknown",
    seoValue: "good",
    referralValue: "good",
    brandValue: "good",
    relationshipValue: "low",
    estimatedEffort: "medium",
    difficulty: "moderate",
    likelihood: "medium",
    sourceQuality: "good",
    spamRisk: "low",
    promotionChannels: ["backlink", "community"],
    discoveryQueries: [
      "CRM implementation checklist template",
      "CRM migration checklist free",
    ],
    evidenceNotes: [],
    primaryValueProposition: "tool-or-resource-utility",
    editorialLegitimacy: "strong",
    costBurden: "none",
  },
  {
    type: "SOFTWARE_DIRECTORY",
    acquisitionType: "OWNED_PROFILE",
    domain: "g2.com",
    organization: "G2",
    url: "https://www.g2.com/",
    opportunityUrl: "https://www.g2.com/categories/crm",
    targetSoftwareGlimpsePage: "/",
    targetCluster: "crm",
    relevance: "strong",
    audienceFit: "excellent",
    opportunityDescription:
      "Owned vendor/profile presence and category visibility — not a place to buy dofollow links.",
    reasonWhyTheyMightLink:
      "Buyers discover software via directories; SoftwareGlimpse is a media/tool site — listing fit is limited unless productized.",
    suggestedPitchAngle:
      "Clarify whether SoftwareGlimpse tools qualify for directory listing vs vendor products; prefer partner/content relationships over forced listing.",
    expectedLinkTreatment: "NOFOLLOW",
    likelyFollowStatus: "nofollow",
    seoValue: "low",
    referralValue: "strong",
    brandValue: "strong",
    relationshipValue: "medium",
    estimatedEffort: "medium",
    difficulty: "moderate",
    likelihood: "low",
    sourceQuality: "strong",
    spamRisk: "low",
    submissionPath: "Directory submission UI — human only",
    promotionChannels: ["directory-listing"],
    discoveryQueries: ["CRM software directories", "G2 CRM category"],
    evidenceNotes: [
      "Directories often nofollow; value is referral/brand, not link equity.",
    ],
    primaryValueProposition: "directory-discoverability",
    editorialLegitimacy: "good",
    costBurden: "low",
  },
  {
    type: "NEWSLETTER",
    acquisitionType: "EARNED",
    domain: "tlrd.com",
    organization: "B2B SaaS / sales ops newsletters (category)",
    url: "https://www.google.com/search?q=sales+ops+newsletter+CRM+tools",
    targetSoftwareGlimpsePage: "/tools/crm-vendor-scorecard/",
    targetCluster: "crm",
    targetAssetHints: ["crm-vendor-scorecard", "crm-requirements-template"],
    relevance: "strong",
    audienceFit: "excellent",
    opportunityDescription:
      "Sales ops and CRM practitioner newsletters feature free tools and scorecards.",
    reasonWhyTheyMightLink:
      "Audience wants practical evaluation aids; Vendor Scorecard + requirements template fit the format.",
    suggestedPitchAngle:
      "Pitch a one-paragraph tool feature: free CRM vendor scorecard with export — no signup wall.",
    expectedLinkTreatment: "EDITORIAL",
    likelyFollowStatus: "unknown",
    seoValue: "low",
    referralValue: "excellent",
    brandValue: "strong",
    relationshipValue: "good",
    estimatedEffort: "small",
    difficulty: "moderate",
    likelihood: "medium",
    sourceQuality: "good",
    spamRisk: "none",
    contactPath: "Newsletter tip form / reply — human only",
    promotionChannels: ["newsletter", "backlink"],
    discoveryQueries: [
      "sales operations newsletter",
      "CRM tools newsletter feature",
      "SaaS buyer newsletter submit tip",
    ],
    evidenceNotes: [
      "SEO value often low; prioritize referral/brand.",
      "Replace placeholder search URL after verification.",
    ],
    primaryValueProposition: "audience-exposure",
    editorialLegitimacy: "strong",
    costBurden: "none",
  },
  {
    type: "PODCAST",
    acquisitionType: "CONTRIBUTED",
    domain: "podcasts.apple.com",
    organization: "B2B / RevOps podcasts (category)",
    url: "https://podcasts.apple.com/",
    targetSoftwareGlimpsePage: "/guides/how-to-choose-crm/",
    targetCluster: "crm",
    relevance: "good",
    audienceFit: "strong",
    opportunityDescription:
      "RevOps and SaaS podcasts invite practitioners for CRM selection / implementation episodes.",
    reasonWhyTheyMightLink:
      "Show notes often link guest resources — tools and guides can earn citations after a genuine contribution.",
    suggestedPitchAngle:
      "Offer an evidence-based CRM selection framework episode; link scorecard + finder in show notes.",
    expectedLinkTreatment: "EDITORIAL",
    likelyFollowStatus: "unknown",
    seoValue: "low",
    referralValue: "strong",
    brandValue: "excellent",
    relationshipValue: "strong",
    estimatedEffort: "large",
    difficulty: "hard",
    likelihood: "low",
    sourceQuality: "good",
    spamRisk: "none",
    contactPath: "Podcast booking — human only",
    promotionChannels: ["podcast"],
    discoveryQueries: [
      "RevOps podcast guest",
      "CRM implementation podcast",
      "sales ops podcast submit guest",
    ],
    evidenceNotes: ["Contribution first; links are secondary."],
    primaryValueProposition: "brand-awareness",
    editorialLegitimacy: "strong",
    costBurden: "none",
  },
  {
    type: "COMMUNITY",
    acquisitionType: "UGC",
    domain: "reddit.com",
    organization: "r/CRM / r/sales / r/saas communities",
    url: "https://www.reddit.com/r/CRM/",
    targetSoftwareGlimpsePage: "/resources/crm-evaluation-checklist/",
    targetCluster: "crm",
    relevance: "strong",
    audienceFit: "strong",
    opportunityDescription:
      "Practitioners ask for CRM evaluation help; helpful checklist/tool replies (not spam) can earn visibility.",
    reasonWhyTheyMightLink:
      "Communities reward useful free artifacts when answering real questions — not drive-by link drops.",
    suggestedPitchAngle:
      "Only respond to genuine questions with context; mention checklist/tool when directly useful.",
    expectedLinkTreatment: "UGC",
    likelyFollowStatus: "ugc",
    seoValue: "none",
    referralValue: "good",
    brandValue: "good",
    relationshipValue: "low",
    estimatedEffort: "small",
    difficulty: "easy",
    likelihood: "medium",
    sourceQuality: "mixed",
    spamRisk: "medium",
    promotionChannels: ["community"],
    discoveryQueries: [
      "site:reddit.com CRM evaluation checklist",
      "site:reddit.com choosing a CRM spreadsheet",
    ],
    evidenceNotes: [
      "UGC/nofollow — no SEO equity expectation.",
      "Spammy commenting is disallowed by policy and communities.",
    ],
    primaryValueProposition: "audience-exposure",
    editorialLegitimacy: "mixed",
    costBurden: "none",
  },
  {
    type: "ACADEMIC_EDUCATIONAL",
    acquisitionType: "EARNED",
    domain: "edu",
    organization: "University / course reading lists (CRM / sales tech)",
    url: "https://www.google.com/search?q=CRM+software+evaluation+site:.edu",
    targetSoftwareGlimpsePage: "/guides/what-is-crm/",
    targetCluster: "crm",
    targetAssetHints: ["what-is-crm", "crm-glossary"],
    relevance: "good",
    audienceFit: "good",
    opportunityDescription:
      "Educators sometimes link clear CRM explainers and glossaries on syllabi or LibGuides.",
    reasonWhyTheyMightLink:
      "Free, non-salesy educational guides fit classroom resource lists better than affiliate review farms.",
    suggestedPitchAngle:
      "Offer glossary + what-is-CRM as open educational references (no hard sell).",
    expectedLinkTreatment: "EDITORIAL",
    likelyFollowStatus: "follow",
    seoValue: "strong",
    referralValue: "low",
    brandValue: "good",
    relationshipValue: "medium",
    estimatedEffort: "medium",
    difficulty: "hard",
    likelihood: "low",
    sourceQuality: "excellent",
    spamRisk: "none",
    promotionChannels: ["backlink"],
    discoveryQueries: [
      "CRM software evaluation site:.edu",
      "customer relationship management glossary site:.edu",
    ],
    evidenceNotes: ["Verify specific .edu pages before any outreach draft."],
    primaryValueProposition: "editorial-citation",
    editorialLegitimacy: "excellent",
    costBurden: "none",
  },
  {
    type: "VENDOR_ECOSYSTEM",
    acquisitionType: "PARTNERSHIP",
    domain: "pipedrive.com",
    organization: "CRM vendor partner / marketplace ecosystems",
    url: "https://www.pipedrive.com/",
    targetSoftwareGlimpsePage: "/software/pipedrive/",
    targetCluster: "crm",
    relevance: "strong",
    audienceFit: "strong",
    opportunityDescription:
      "Vendors maintain partner directories, blog roundups, and integration ecosystems that can reference independent research.",
    reasonWhyTheyMightLink:
      "Fair, evidence-based product coverage and migration/implementation tools can earn natural vendor mentions.",
    suggestedPitchAngle:
      "Explore content or research partnership — never paid link placement posing as editorial.",
    expectedLinkTreatment: "EDITORIAL",
    likelyFollowStatus: "unknown",
    seoValue: "good",
    referralValue: "strong",
    brandValue: "strong",
    relationshipValue: "excellent",
    estimatedEffort: "large",
    difficulty: "hard",
    likelihood: "low",
    sourceQuality: "strong",
    spamRisk: "low",
    contactPath: "Partner / PR — human only",
    promotionChannels: ["partner", "vendor-ecosystem"],
    discoveryQueries: [
      "Pipedrive partner resources",
      "CRM vendor blog CRM selection tools",
    ],
    evidenceNotes: ["Affiliate economics must never drive editorial claims."],
    primaryValueProposition: "relationship-building",
    editorialLegitimacy: "strong",
    costBurden: "none",
  },
  {
    type: "PAID_NEWSLETTER",
    acquisitionType: "PAID",
    domain: "beehiiv.com",
    organization: "Relevant B2B newsletter sponsorships (category)",
    url: "https://www.google.com/search?q=SaaS+newsletter+sponsorship+CRM",
    targetSoftwareGlimpsePage: "/tools/crm-finder/",
    targetCluster: "crm",
    relevance: "good",
    audienceFit: "strong",
    opportunityDescription:
      "Sponsored placements in niche SaaS / sales newsletters for tool exposure.",
    reasonWhyTheyMightLink:
      "Sponsorship buys audience attention; links should be disclosed as sponsored — value is referral/brand, not ranking.",
    suggestedPitchAngle:
      "Sponsor a single issue featuring CRM Finder with clear sponsorship disclosure.",
    expectedLinkTreatment: "SPONSORED",
    likelyFollowStatus: "sponsored",
    seoValue: "none",
    referralValue: "strong",
    brandValue: "strong",
    relationshipValue: "low",
    estimatedEffort: "small",
    estimatedCost: "Varies — typically hundreds to low thousands USD per issue",
    difficulty: "easy",
    likelihood: "medium",
    sourceQuality: "mixed",
    spamRisk: "low",
    contactPath: "Sponsorship deck — human purchase decision only",
    promotionChannels: ["paid-exposure", "newsletter"],
    discoveryQueries: [
      "SaaS newsletter sponsorship rates",
      "sales newsletter sponsor CRM tool",
    ],
    evidenceNotes: [
      "Do not buy for dofollow SEO.",
      "Evaluate CPC/CPA-style referral value only.",
    ],
    primaryValueProposition: "paid-exposure",
    editorialLegitimacy: "good",
    costBurden: "medium",
  },
  {
    type: "PAID_DIRECTORY",
    acquisitionType: "PAID",
    domain: "example-paid-seo-directory.test",
    organization: "Generic paid dofollow SEO directory (fixture)",
    url: "https://example-paid-seo-directory.test/buy-dofollow-backlinks",
    opportunityDescription:
      "Fixture: marketplace selling dofollow backlink packages.",
    reasonWhyTheyMightLink: "They sell links — not a legitimate editorial relationship.",
    suggestedPitchAngle: "None — reject.",
    expectedLinkTreatment: "EDITORIAL",
    likelyFollowStatus: "follow",
    seoValue: "unknown",
    referralValue: "none",
    brandValue: "none",
    relationshipValue: "none",
    estimatedEffort: "trivial",
    estimatedCost: "$99 for dofollow backlink package",
    difficulty: "easy",
    likelihood: "high",
    sourceQuality: "weak",
    spamRisk: "link-spam-avoid",
    promotionChannels: ["paid-exposure"],
    discoveryQueries: ["buy dofollow CRM backlinks"],
    evidenceNotes: ["Canonical reject fixture for compliance tests."],
    primaryValueProposition: "link-equity-purchase",
    editorialLegitimacy: "none",
    costBurden: "low",
    relevance: "none",
    audienceFit: "none",
  },
  {
    type: "GUEST_CONTRIBUTION",
    acquisitionType: "CONTRIBUTED",
    domain: "example-guest-post-network.test",
    organization: "Bulk guest-post placement network (fixture)",
    url: "https://example-guest-post-network.test/packages",
    opportunityDescription:
      "Fixture: large-scale guest post packages for anchor-rich links.",
    reasonWhyTheyMightLink: "Paid placement network — not earned editorial.",
    expectedLinkTreatment: "EDITORIAL",
    likelyFollowStatus: "follow",
    seoValue: "unknown",
    referralValue: "low",
    brandValue: "none",
    relationshipValue: "none",
    estimatedEffort: "small",
    estimatedCost: "Guest post package — bulk",
    difficulty: "easy",
    likelihood: "high",
    sourceQuality: "weak",
    spamRisk: "link-spam-avoid",
    promotionChannels: ["backlink"],
    discoveryQueries: ["bulk guest posts CRM"],
    evidenceNotes: ["Matched large-scale guest-post policy."],
    primaryValueProposition: "link-equity-purchase",
    editorialLegitimacy: "none",
    costBurden: "low",
    relevance: "low",
    audienceFit: "low",
  },
  {
    type: "DATA_CITATION",
    acquisitionType: "EARNED",
    domain: "searchengineland.com",
    organization: "Industry press / analyst-style publishers",
    url: "https://searchengineland.com/",
    targetSoftwareGlimpsePage: "/compare/",
    targetCluster: "crm",
    relevance: "good",
    audienceFit: "good",
    opportunityDescription:
      "Press cites original datasets, pricing research, and comparison methodologies.",
    reasonWhyTheyMightLink:
      "If SoftwareGlimpse publishes original CRM pricing / feature research, journalists need citeable stats.",
    suggestedPitchAngle:
      "Pitch original research dataset once published — not thin listicles.",
    expectedLinkTreatment: "EDITORIAL",
    likelyFollowStatus: "follow",
    seoValue: "excellent",
    referralValue: "good",
    brandValue: "excellent",
    relationshipValue: "medium",
    estimatedEffort: "large",
    difficulty: "very-hard",
    likelihood: "very-low",
    sourceQuality: "excellent",
    spamRisk: "none",
    contactPath: "Journalist / HARO-style — human only",
    promotionChannels: ["journalist", "backlink", "content-asset-creation"],
    discoveryQueries: [
      "CRM pricing statistics 2026",
      "CRM adoption statistics journalists",
    ],
    evidenceNotes: [
      "Requires creating original research assets first (see content gaps).",
    ],
    primaryValueProposition: "editorial-citation",
    editorialLegitimacy: "excellent",
    costBurden: "none",
  },
  {
    type: "BROKEN_LINK_REPLACEMENT",
    acquisitionType: "EARNED",
    domain: "various",
    organization: "CRM resource pages with broken checklist links",
    url: "https://www.google.com/search?q=%22CRM+evaluation+checklist%22+broken",
    targetSoftwareGlimpsePage: "/resources/crm-evaluation-checklist/",
    targetCluster: "crm",
    relevance: "strong",
    audienceFit: "strong",
    opportunityDescription:
      "Find resource pages linking to dead CRM checklist/template URLs and offer a maintained replacement.",
    reasonWhyTheyMightLink:
      "Webmasters prefer fixing broken utility links when a high-quality free replacement exists.",
    suggestedPitchAngle:
      "Broken-link note + offer SoftwareGlimpse evaluation checklist as replacement.",
    expectedLinkTreatment: "EDITORIAL",
    likelyFollowStatus: "follow",
    seoValue: "strong",
    referralValue: "good",
    brandValue: "good",
    relationshipValue: "low",
    estimatedEffort: "medium",
    difficulty: "moderate",
    likelihood: "medium",
    sourceQuality: "mixed",
    spamRisk: "none",
    promotionChannels: ["backlink"],
    discoveryQueries: [
      "CRM evaluation checklist",
      "CRM requirements template filetype:pdf",
      '"checklist" CRM "404"',
    ],
    evidenceNotes: ["Verify each broken URL live before drafting outreach."],
    primaryValueProposition: "tool-or-resource-utility",
    editorialLegitimacy: "strong",
    costBurden: "none",
  },
  {
    type: "ASSOCIATION",
    acquisitionType: "EARNED",
    domain: "aa-isp.org",
    organization: "Sales / CRM professional associations",
    url: "https://www.aa-isp.org/",
    targetSoftwareGlimpsePage: "/resources/crm-training-plan/",
    targetCluster: "crm",
    relevance: "good",
    audienceFit: "strong",
    opportunityDescription:
      "Associations maintain member resource libraries and event pages.",
    reasonWhyTheyMightLink:
      "Training plans and evaluation frameworks fit member education libraries.",
    suggestedPitchAngle:
      "Contribute a member-education resource (training plan / scorecard) without hard affiliate pitch.",
    expectedLinkTreatment: "EDITORIAL",
    likelyFollowStatus: "unknown",
    seoValue: "good",
    referralValue: "medium",
    brandValue: "strong",
    relationshipValue: "excellent",
    estimatedEffort: "large",
    difficulty: "hard",
    likelihood: "low",
    sourceQuality: "strong",
    spamRisk: "none",
    contactPath: "Association content team — human only",
    promotionChannels: ["partner", "event", "backlink"],
    discoveryQueries: [
      "sales association resource library CRM",
      "CRM professional association resources",
    ],
    evidenceNotes: [],
    primaryValueProposition: "relationship-building",
    editorialLegitimacy: "excellent",
    costBurden: "none",
  },
];

/** Suggested live-web query packs (execute manually or via future provider). */
export const DISCOVERY_QUERY_PACKS: Array<{
  id: string;
  intent: string;
  queries: string[];
}> = [
  {
    id: "resource-pages",
    intent: "CRM resource / toolkit pages that could cite tools or templates",
    queries: [
      "CRM evaluation tools list",
      "free CRM templates resources",
      "CRM implementation checklist resources",
      '"useful resources" CRM software',
    ],
  },
  {
    id: "tool-citations",
    intent: "Mentions of CRM calculators / finders / scorecards",
    queries: [
      "CRM cost calculator",
      "CRM requirements builder",
      "CRM vendor scorecard template",
      "CRM TCO calculator",
    ],
  },
  {
    id: "journalist-source",
    intent: "Reporters seeking CRM statistics or expert sources",
    queries: [
      "CRM statistics 2026",
      "help a reporter CRM software",
      "CRM adoption rates source",
    ],
  },
  {
    id: "directories",
    intent: "Legitimate software / startup directories (referral value)",
    queries: [
      "best CRM software directories",
      "SaaS startup directory submit",
      "B2B software catalog listing",
    ],
  },
  {
    id: "newsletters-podcasts",
    intent: "Distribution without relying on link equity",
    queries: [
      "sales ops newsletter sponsorship",
      "RevOps podcast guest application",
      "SaaS tools newsletter feature submit",
    ],
  },
];
