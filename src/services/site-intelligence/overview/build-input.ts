import type {
  ExperienceDimensionInput,
  EcosystemDimensionInput,
  PageQualityInput,
  SiteIntelligenceInput,
  TechnicalCheckInput,
  TechnicalFindingInput,
} from "@/domain/schemas/site-intelligence";
import type { ContentQualityPageType } from "@/domain/schemas/content-quality";
import { classifyPageImportance } from "@/services/content-quality/priority";
import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
import type { ContentScoreSnapshot, SeoIssuesSnapshot } from "./sources";
import type { SiteInventory } from "./inventory";

function toPageType(raw: string): ContentQualityPageType {
  const allowed: ContentQualityPageType[] = [
    "article",
    "guide",
    "product-review",
    "comparison",
    "best",
    "product-guide",
    "industry",
    "use-case",
    "capability",
    "requirement",
    "feature",
    "implementation-guide",
    "resource",
    "tool-landing",
  ];
  if ((allowed as string[]).includes(raw)) return raw as ContentQualityPageType;
  if (raw === "software") return "product-review";
  return "guide";
}

function clusterFor(route: string, pageType: string): string {
  if (pageType === "comparison" || route.startsWith("/compare/")) return "CRM Compare";
  if (pageType === "product-review" || route.startsWith("/software/")) {
    return "CRM Products";
  }
  if (pageType === "industry" || route.startsWith("/industries/")) {
    return "CRM Industries";
  }
  if (pageType === "use-case" || route.startsWith("/use-cases/")) {
    return "CRM Use Cases";
  }
  if (pageType === "capability" || route.startsWith("/capabilities/")) {
    return "CRM Capabilities";
  }
  if (pageType === "best" || route.startsWith("/best/")) return "CRM Choose";
  if (pageType === "tool-landing" || route.startsWith("/tools/")) {
    return "CRM Tools";
  }
  if (pageType === "resource" || route.startsWith("/resources/")) {
    return "CRM Resources";
  }
  if (/implementation|migration|setup/i.test(route)) {
    return "CRM Implementation / Migration";
  }
  if (
    /what-is-crm|how-crm-works|do-i-need|crm-vs|glossary|examples/i.test(route)
  ) {
    return "CRM Learn";
  }
  if (/choose|requirements-guide|evaluation|pricing-guide/i.test(route)) {
    return "CRM Choose";
  }
  return "CRM Learn";
}

export function pagesFromScoreSnapshot(
  snapshot: ContentScoreSnapshot | null,
): PageQualityInput[] {
  if (!snapshot) return [];
  return Object.entries(snapshot.pages).map(([route, row]) => {
    const pageType = toPageType(row.pageType);
    return {
      route,
      pageType,
      overallScore: Math.round(row.score),
      importance: classifyPageImportance(route, pageType),
      clusterId: clusterFor(route, pageType),
      criticalIntegrityFailure: row.priority === "CQ-P0",
    };
  });
}

export function findingsFromSeoIssues(
  snap: SeoIssuesSnapshot | null,
): TechnicalFindingInput[] {
  if (!snap) return [];
  return snap.findings.map((f) => ({
    id: f.id,
    severity: (["P0", "P1", "P2", "P3"].includes(f.severity ?? "")
      ? f.severity
      : "P2") as "P0" | "P1" | "P2" | "P3",
    area: f.area ?? "technical",
    problem: f.problem ?? f.id,
    affectedPages: f.affectedPages ?? [],
  }));
}

export function buildExperienceDimensions(input: {
  inventory: SiteInventory;
  linkEdges?: number;
  linkOrphans?: number;
  performanceFindings: number;
  resourcesLive?: number;
  resourceImprove?: number;
}): ExperienceDimensionInput[] {
  const toolsScore = Math.min(
    100,
    40 +
      input.inventory.toolsAvailable * 8 +
      input.inventory.toolsPartial * 3,
  );
  const orphanPenalty = Math.min(40, (input.linkOrphans ?? 0) * 10);
  const linkScore = Math.max(40, 95 - orphanPenalty);
  const perfScore =
    input.performanceFindings === 0 ? 82 : Math.max(40, 82 - input.performanceFindings * 12);
  const resourceScore =
    (input.resourcesLive ?? 0) >= 12
      ? input.resourceImprove && input.resourceImprove > 5
        ? 72
        : 85
      : (input.resourcesLive ?? 0) > 0
        ? 60
        : 35;

  const compareScore =
    input.inventory.comparisons >= 100
      ? 88
      : input.inventory.comparisons > 0
        ? 70
        : 30;

  return [
    {
      id: "navigation",
      score: 78,
      reason: "Site chrome + category hubs present (inventory)",
    },
    {
      id: "search",
      score: TOOLS_REGISTRY.some((t) => t.slug === "crm-finder" && t.status === "available")
        ? 86
        : 45,
      reason: "CRM Finder is the primary guided-search experience",
    },
    {
      id: "information-architecture",
      score: 80,
      reason: `CRM clusters defined (${input.inventory.clusters.length}); sitemap ${input.inventory.sitemapUrls} URLs`,
    },
    {
      id: "visual-hierarchy",
      score: 74,
      reason: "Template system present; not a full visual QA pass",
    },
    {
      id: "mobile-usability",
      score: 78,
      reason: "App Router responsive assumed; live mobile parity check often skipped",
    },
    {
      id: "page-readability",
      score: 80,
      reason: "Delegated to CQ structure-readability in page audits",
    },
    {
      id: "decision-workflow",
      score: toolsScore,
      reason: `${input.inventory.toolsAvailable} available tools in registry`,
    },
    {
      id: "tool-integration",
      score: toolsScore,
      reason: "Tools registry statuses (available/partial/coming-soon)",
    },
    {
      id: "downloads-resources",
      score: resourceScore,
      reason: `Resources live≈${input.resourcesLive ?? input.inventory.resources}`,
    },
    {
      id: "comparison-experience",
      score: compareScore,
      reason: `${input.inventory.comparisons} published comparisons`,
    },
    {
      id: "accessibility",
      score: 70,
      reason: "No dedicated a11y audit in latest sources — medium confidence structural score",
    },
    {
      id: "performance",
      score: perfScore,
      reason:
        input.performanceFindings === 0
          ? "PerformanceAuditAgent: 0 findings (lab proxies; field CWV skipped)"
          : `${input.performanceFindings} performance finding(s)`,
    },
    {
      id: "dead-ends",
      score: linkScore,
      reason: `Internal linking orphans=${input.linkOrphans ?? "?"} edges=${input.linkEdges ?? "?"}`,
    },
    {
      id: "consistency",
      score: 76,
      reason: "Shared templates across CRM page types",
    },
  ];
}

export function buildEcosystemDimensions(input: {
  inventory: SiteInventory;
  mapTotal?: number;
  mapMissing?: number;
  mapThin?: number;
  linkOrphans?: number;
  contentAvg?: number;
}): EcosystemDimensionInput[] {
  const total = input.mapTotal ?? 207;
  const missing = input.mapMissing ?? 0;
  const thin = input.mapThin ?? 0;
  const covered = Math.max(0, total - missing);
  const coverageScore = Math.round((covered / total) * 100);
  const thinPenalty = Math.min(35, thin * 1.2);
  const pillarScore = Math.max(40, coverageScore - thinPenalty);
  const orphanScore = Math.max(50, 100 - (input.linkOrphans ?? 0) * 15);
  const depthScore = input.contentAvg ?? 75;
  const toolRel = Math.min(100, 50 + input.inventory.toolsAvailable * 7);
  const resourceRel = Math.min(
    100,
    40 + input.inventory.resources * 3,
  );

  return [
    {
      id: "pillar-coverage",
      score: pillarScore,
      reason: `Map coverage ~${covered}/${total}; thin=${thin}`,
    },
    {
      id: "supporting-coverage",
      score: Math.max(35, coverageScore - Math.round(thinPenalty * 0.8)),
      reason: `Missing map rows=${missing}`,
    },
    {
      id: "entity-relationships",
      score: 78,
      reason: "CRM entity graph + relationship services present",
    },
    {
      id: "internal-linking",
      score: orphanScore,
      reason: `Orphans=${input.linkOrphans ?? 0}`,
    },
    {
      id: "content-depth",
      score: Math.round(depthScore),
      reason: `CQ site avg proxy ${depthScore}`,
    },
    {
      id: "tool-relationships",
      score: toolRel,
      reason: `${input.inventory.toolsAvailable} available decision tools`,
    },
    {
      id: "resource-relationships",
      score: resourceRel,
      reason: `${input.inventory.resources} published resources`,
    },
    {
      id: "buyer-journey",
      score: 82,
      reason: "Learn→Choose→Compare→Implement tools largely wired",
    },
    {
      id: "cluster-completeness",
      score: Math.max(40, coverageScore - 5),
      reason: "CRM cluster set present; supporting gaps remain on map",
    },
    {
      id: "orphan-rate",
      score: orphanScore,
      reason: "Inverse orphan severity from InternalLinkAuditAgent",
    },
    {
      id: "duplication-control",
      score: 74,
      reason: "Comparisons dense; cannibalization monitored via SEO opportunity detectors",
    },
  ];
}

export function buildSiteIntelligenceInputFromSources(input: {
  evaluatedAt: string;
  scores: ContentScoreSnapshot | null;
  seoIssues: SeoIssuesSnapshot | null;
  technicalChecks: TechnicalCheckInput[];
  inventory: SiteInventory;
  linkEdges?: number;
  linkOrphans?: number;
  performanceFindings: number;
  mapTotal?: number;
  mapMissing?: number;
  mapThin?: number;
  resourcesLive?: number;
  resourceImprove?: number;
  searchVisibility?: import("@/domain/schemas/site-intelligence").SearchVisibilityMetricsInput | null;
  competitorPack?: import("@/domain/schemas/site-intelligence").CompetitorPackInput | null;
}): SiteIntelligenceInput {
  const pages = pagesFromScoreSnapshot(input.scores);
  const contentAvg =
    pages.length > 0
      ? Math.round(
          pages.reduce((s, p) => s + p.overallScore, 0) / pages.length,
        )
      : undefined;

  return {
    evaluatedAt: input.evaluatedAt,
    scopeLabel: "website-overview:crm",
    technicalFindings: findingsFromSeoIssues(input.seoIssues),
    technicalChecks: input.technicalChecks,
    pages,
    experienceDimensions: buildExperienceDimensions({
      inventory: input.inventory,
      linkEdges: input.linkEdges,
      linkOrphans: input.linkOrphans,
      performanceFindings: input.performanceFindings,
      resourcesLive: input.resourcesLive,
      resourceImprove: input.resourceImprove,
    }),
    ecosystemDimensions: buildEcosystemDimensions({
      inventory: input.inventory,
      mapTotal: input.mapTotal,
      mapMissing: input.mapMissing,
      mapThin: input.mapThin,
      linkOrphans: input.linkOrphans,
      contentAvg,
    }),
    competitorPack: input.competitorPack ?? null,
    searchVisibility: input.searchVisibility ?? null,
    authority: {
      status: "unavailable",
      confidence: "low",
      notes: [
        "Off-site authority / backlink data not integrated for this overview",
      ],
      knownGaps: ["Domain authority and referring-domain gap unknown"],
      impactOnOpportunity: "neutral-unknown",
    },
    rankingOpportunities: [
      {
        scopeKind: "cluster",
        scopeId: "crm",
        intentFit: 85,
        contentQuality: contentAvg ?? 70,
        topicalCoverage: Math.max(
          40,
          100 -
            Math.round(
              ((input.mapMissing ?? 0) + (input.mapThin ?? 0) * 0.5) /
                Math.max(1, input.mapTotal ?? 207) *
                100,
            ),
        ),
        differentiation: Math.min(90, 55 + input.inventory.toolsAvailable * 4),
        internalLinkSupport: Math.max(50, 95 - (input.linkOrphans ?? 0) * 15),
        evidenceDepth: 72,
        freshness: 75,
        // Competitor research not run in this step
        serpCompetitorStrengthInverse: 50,
      },
    ],
  };
}
