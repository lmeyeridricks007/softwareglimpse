import type {
  ExperienceDimensionInput,
  EcosystemDimensionInput,
  SiteIntelligenceInput,
} from "@/domain/schemas/site-intelligence";

function experienceAll(
  score: number,
  reason: string,
): ExperienceDimensionInput[] {
  const ids = [
    "navigation",
    "search",
    "information-architecture",
    "visual-hierarchy",
    "mobile-usability",
    "page-readability",
    "decision-workflow",
    "tool-integration",
    "downloads-resources",
    "comparison-experience",
    "accessibility",
    "performance",
    "dead-ends",
    "consistency",
  ];
  return ids.map((id) => ({
    id,
    score,
    reason,
    evidence: [{ label: reason, present: true }],
  }));
}

function ecosystemAll(
  score: number,
  reason: string,
): EcosystemDimensionInput[] {
  const ids = [
    "pillar-coverage",
    "supporting-coverage",
    "entity-relationships",
    "internal-linking",
    "content-depth",
    "tool-relationships",
    "resource-relationships",
    "buyer-journey",
    "cluster-completeness",
    "orphan-rate",
    "duplication-control",
  ];
  return ids.map((id) => ({
    id,
    score,
    reason,
    evidence: [{ label: reason, present: true }],
  }));
}

const COMPETITIVE_IDS = [
  "topic-coverage",
  "content-depth",
  "original-research-value",
  "tools-interactive",
  "comparison-quality",
  "review-depth",
  "evidence-transparency",
  "media",
  "resources",
  "internal-linking",
  "ux",
  "freshness",
  "serp-alignment",
] as const;

function competitiveDims(score: number, reason: string) {
  return COMPETITIVE_IDS.map((id) => ({
    id,
    score,
    reason,
    evidence: [{ label: reason, present: true }],
  }));
}

/** Technically strong site with thin / weak content. */
export const FIXTURE_TECHNICALLY_STRONG_THIN_CONTENT: SiteIntelligenceInput = {
  scopeLabel: "fixture:technically-strong-thin-content",
  evaluatedAt: "2026-08-15T10:00:00.000Z",
  technicalFindings: [],
  technicalChecks: [
    { id: "canonicals", status: "completed" },
    { id: "sitemap-indexability", status: "completed" },
    { id: "structured-data-basic", status: "completed" },
    { id: "internal-orphans", status: "completed" },
    { id: "field-cwv", status: "skipped", reason: "Lab proxies only" },
  ],
  pages: [
    {
      route: "/best/crm-software/",
      pageType: "best",
      overallScore: 38,
      importance: "pillar",
      clusterId: "crm-choose",
    },
    {
      route: "/guides/what-is-crm/",
      pageType: "guide",
      overallScore: 42,
      importance: "pillar",
      clusterId: "crm-learn",
    },
    {
      route: "/compare/a-vs-b/",
      pageType: "comparison",
      overallScore: 55,
      importance: "long-tail",
      clusterId: "crm-compare",
    },
  ],
  experienceDimensions: experienceAll(72, "Adequate chrome; thin decision depth"),
  ecosystemDimensions: ecosystemAll(48, "Sparse supporting coverage"),
  competitorPack: null,
  searchVisibility: null,
  rankingOpportunities: [
    {
      scopeKind: "cluster",
      scopeId: "crm-choose",
      intentFit: 70,
      contentQuality: 38,
      serpCompetitorStrengthInverse: 40,
      topicalCoverage: 45,
      differentiation: 30,
      internalLinkSupport: 40,
      evidenceDepth: 25,
      freshness: 50,
    },
  ],
};

/** Content-rich site with severe technical breakage. */
export const FIXTURE_CONTENT_RICH_TECHNICALLY_BROKEN: SiteIntelligenceInput = {
  scopeLabel: "fixture:content-rich-technically-broken",
  evaluatedAt: "2026-08-15T10:00:00.000Z",
  technicalFindings: [
    {
      id: "SEO-CANONICAL-BEST-P0",
      severity: "P0",
      area: "technical",
      dimensionHint: "canonicals",
      problem: "Canonical does not match resolved public path",
      affectedPages: ["/best/crm-software/"],
    },
    {
      id: "SEO-SITEMAP-NOINDEX-P0",
      severity: "P0",
      area: "technical",
      dimensionHint: "robots-sitemaps",
      problem: "noindex URL is included in the sitemap",
      affectedPages: ["/guides/what-is-crm/"],
    },
    {
      id: "SEO-STATUS-404-P0",
      severity: "P0",
      area: "technical",
      dimensionHint: "status-redirects",
      problem: "Page returns HTTP 404",
      affectedPages: ["/software/hubspot/"],
    },
    {
      id: "SEO-ORPHAN-P1",
      severity: "P1",
      area: "internal-linking",
      dimensionHint: "crawlability",
      problem: "Orphaned indexable page",
      affectedPages: ["/use-cases/pipeline-management/"],
    },
  ],
  technicalChecks: [
    { id: "canonicals", status: "completed" },
    { id: "sitemap-indexability", status: "completed" },
    { id: "status-codes-live", status: "completed" },
  ],
  pages: [
    {
      route: "/best/crm-software/",
      pageType: "best",
      overallScore: 88,
      importance: "pillar",
      clusterId: "crm-choose",
    },
    {
      route: "/guides/what-is-crm/",
      pageType: "guide",
      overallScore: 90,
      importance: "pillar",
      clusterId: "crm-learn",
    },
    {
      route: "/software/hubspot/",
      pageType: "product-review",
      overallScore: 91,
      importance: "high-commercial",
      clusterId: "crm-products",
    },
    {
      route: "/compare/hubspot-vs-pipedrive/",
      pageType: "comparison",
      overallScore: 86,
      importance: "high-commercial",
      clusterId: "crm-compare",
    },
  ],
  experienceDimensions: experienceAll(80, "Strong templates; crawl risk remains"),
  ecosystemDimensions: ecosystemAll(82, "Dense CRM ecosystem on paper"),
  competitorPack: null,
  searchVisibility: null,
};

/** Strong on-site quality but no authority / off-site data. */
export const FIXTURE_STRONG_NO_AUTHORITY: SiteIntelligenceInput = {
  scopeLabel: "fixture:strong-site-no-authority-data",
  evaluatedAt: "2026-08-15T10:00:00.000Z",
  technicalFindings: [],
  technicalChecks: Array.from({ length: 20 }, (_, i) => ({
    id: `check-${i}`,
    status: "completed" as const,
  })),
  pages: [
    {
      route: "/best/crm-software/",
      pageType: "best",
      overallScore: 86,
      importance: "pillar",
      clusterId: "crm-choose",
    },
    {
      route: "/guides/what-is-crm/",
      pageType: "guide",
      overallScore: 88,
      importance: "pillar",
      clusterId: "crm-learn",
    },
    {
      route: "/software/pipedrive/",
      pageType: "product-review",
      overallScore: 90,
      importance: "high-commercial",
      clusterId: "crm-products",
    },
  ],
  experienceDimensions: experienceAll(84, "Mature decision workflow + tools"),
  ecosystemDimensions: ecosystemAll(83, "Strong cluster completeness"),
  competitorPack: {
    clusterId: "crm",
    competitorsSampled: 5,
    backlinkDataAvailable: false,
    dimensions: competitiveDims(72, "On-page competitive parity sampled"),
    strongerThan: ["Tools / finder interactivity"],
    weakerThan: ["Brand SERP occupancy"],
    notes: ["5 competitors sampled, but backlink data unavailable"],
  },
  searchVisibility: null,
  authority: {
    status: "unavailable",
    confidence: "low",
    notes: ["Backlink data unavailable"],
    knownGaps: [],
    impactOnOpportunity: "neutral-unknown",
  },
  rankingOpportunities: [
    {
      scopeKind: "topic",
      scopeId: "best-crm-software",
      intentFit: 90,
      contentQuality: 86,
      serpCompetitorStrengthInverse: 55,
      topicalCoverage: 85,
      differentiation: 80,
      internalLinkSupport: 78,
      evidenceDepth: 75,
      freshness: 80,
    },
  ],
};

/** Cluster stronger than competitors on content/tools. */
export const FIXTURE_CLUSTER_STRONGER_THAN_COMPETITORS: SiteIntelligenceInput =
  {
    scopeLabel: "fixture:cluster-stronger-than-competitors",
    evaluatedAt: "2026-08-15T10:00:00.000Z",
    technicalFindings: [],
    technicalChecks: [
      { id: "c1", status: "completed" },
      { id: "c2", status: "completed" },
    ],
    pages: [
      {
        route: "/categories/crm/",
        pageType: "guide",
        overallScore: 88,
        importance: "pillar",
        clusterId: "crm",
      },
      {
        route: "/tools/crm-finder/",
        pageType: "tool-landing",
        overallScore: 92,
        importance: "pillar",
        clusterId: "crm",
      },
    ],
    experienceDimensions: experienceAll(88, "Tools differentiate experience"),
    ecosystemDimensions: ecosystemAll(90, "Full CRM journey coverage"),
    competitorPack: {
      clusterId: "crm",
      competitorsSampled: 5,
      backlinkDataAvailable: true,
      dimensions: competitiveDims(88, "Ahead on tools, depth, evidence"),
      strongerThan: [
        "Interactive CRM Finder + cost calculator",
        "Requirements / scorecard depth",
        "Evidence transparency",
      ],
      weakerThan: ["YouTube embed volume on a few review sites"],
      notes: ["Cluster research pack — CRM"],
    },
    searchVisibility: {
      synthetic: true,
      indexedPerformingCoverage: 70,
      impressionsNorm: 55,
      clicksNorm: 40,
      ctrNorm: 50,
      positionDistributionNorm: 45,
      queryCoverageNorm: 60,
      nonBrandClickShareNorm: 55,
      notes: ["Synthetic fixture for pipeline test only"],
    },
    authority: {
      status: "available",
      confidence: "medium",
      notes: ["Referring-domain sample present"],
      knownGaps: [],
      impactOnOpportunity: "supporting",
    },
    rankingOpportunities: [
      {
        scopeKind: "cluster",
        scopeId: "crm",
        intentFit: 90,
        contentQuality: 90,
        serpCompetitorStrengthInverse: 85,
        topicalCoverage: 92,
        differentiation: 90,
        internalLinkSupport: 88,
        evidenceDepth: 85,
        freshness: 80,
        currentVisibility: 55,
        authorityGap: 70,
      },
    ],
  };

/** Cluster weaker than competitors. */
export const FIXTURE_CLUSTER_WEAKER_THAN_COMPETITORS: SiteIntelligenceInput = {
  scopeLabel: "fixture:cluster-weaker-than-competitors",
  evaluatedAt: "2026-08-15T10:00:00.000Z",
  technicalFindings: [],
  technicalChecks: [
    { id: "c1", status: "completed" },
    { id: "c2", status: "completed" },
  ],
  pages: [
    {
      route: "/industries/healthcare/",
      pageType: "industry",
      overallScore: 62,
      importance: "high-commercial",
      clusterId: "crm-industries",
    },
  ],
  experienceDimensions: experienceAll(60, "Thin industry journey"),
  ecosystemDimensions: ecosystemAll(45, "Missing supporting industry depth"),
  competitorPack: {
    clusterId: "crm-industries",
    competitorsSampled: 5,
    backlinkDataAvailable: true,
    dimensions: competitiveDims(28, "Far behind industry SERP leaders"),
    strongerThan: [],
    weakerThan: [
      "Industry research depth",
      "Original benchmarks",
      "Media / case studies",
      "Internal linking into commercial pillars",
    ],
    notes: ["Industry cluster lagging"],
  },
  searchVisibility: null,
  authority: {
    status: "available",
    confidence: "medium",
    notes: ["Known referring-domain gap vs category leaders"],
    knownGaps: ["Competitor domains have substantially larger referring domains"],
    impactOnOpportunity: "constraining",
  },
  rankingOpportunities: [
    {
      scopeKind: "cluster",
      scopeId: "crm-industries",
      intentFit: 70,
      contentQuality: 62,
      serpCompetitorStrengthInverse: 20,
      topicalCoverage: 40,
      differentiation: 25,
      internalLinkSupport: 35,
      evidenceDepth: 30,
      freshness: 55,
      authorityGap: 20,
    },
  ],
};

export const SITE_INTELLIGENCE_FIXTURES = {
  "technically-strong-thin-content": FIXTURE_TECHNICALLY_STRONG_THIN_CONTENT,
  "content-rich-technically-broken": FIXTURE_CONTENT_RICH_TECHNICALLY_BROKEN,
  "strong-site-no-authority-data": FIXTURE_STRONG_NO_AUTHORITY,
  "cluster-stronger-than-competitors":
    FIXTURE_CLUSTER_STRONGER_THAN_COMPETITORS,
  "cluster-weaker-than-competitors": FIXTURE_CLUSTER_WEAKER_THAN_COMPETITORS,
} as const;

export type SiteIntelligenceFixtureId = keyof typeof SITE_INTELLIGENCE_FIXTURES;

export function getSiteIntelligenceFixture(
  id: SiteIntelligenceFixtureId,
): SiteIntelligenceInput {
  return SITE_INTELLIGENCE_FIXTURES[id];
}

export function listSiteIntelligenceFixtureIds(): SiteIntelligenceFixtureId[] {
  return Object.keys(
    SITE_INTELLIGENCE_FIXTURES,
  ) as SiteIntelligenceFixtureId[];
}
