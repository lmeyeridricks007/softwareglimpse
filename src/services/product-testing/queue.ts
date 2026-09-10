import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { getSoftware } from "@/data";
import { getAllComparisonsUnfiltered } from "@/data/repositories/catalog";
import { loadAssessment, loadReview } from "@/data/editorial/store";
import { resolveEvidenceLevel } from "@/services/editorial/evidence-level";
import { resolvePricingVerifiedAtForEvidence } from "@/services/editorial/pricing-verified-at";
import { productHasHandsOnTest } from "@/services/product-testing/sessions";
import type { GscOpportunityReport } from "@/services/seo/gsc-opportunity/types";
import {
  allocateEnrichmentBatch,
  classifyEnrichmentLane,
  compareByLaneThenScore,
  DEFAULT_LANE_ALLOCATION,
  laneReportFields,
  loadExternalEnrichmentEvidence,
  type EnrichmentLane,
  type LaneAllocation,
  type StrategicOverrideReason,
} from "@/services/seo/enrichment-lanes";

export type TestingQueueItem = {
  rank: number;
  productSlug: string;
  productName: string;
  categorySlug: string | null;
  evidenceLevel: "researched" | "data_verified" | "hands_on_tested";
  opportunityScore: number;
  impressions: number;
  clicks: number;
  commercialValue: number;
  comparisonCount: number;
  reviewImportance: number;
  categoryImportance: number;
  evidenceGapScore: number;
  /** Explicit evidence-priority composite from the five production signals. */
  evidencePriorityScore: number;
  /** Within-lane composite (alias overallScore). */
  priorityScore: number;
  overallScore: number;
  lane: EnrichmentLane;
  gscEvidenceScore: number;
  gscDemandScore: number;
  strategicScore: number;
  qualityGapScore: number;
  commercialScore: number;
  authorityScore: number;
  strategicOverride: boolean;
  strategicOverrideReasons: StrategicOverrideReason[];
  reason: string;
  reasons: string[];
};

const CATEGORY_IMPORTANCE: Record<string, number> = {
  crm: 100,
  "sales-intelligence": 90,
  "email-marketing": 85,
  marketing: 75,
  hr: 70,
  "project-management": 65,
  ecommerce: 60,
  "business-communications": 55,
  ai: 50,
  "it-development": 40,
};

/** Default production batch: ten products (largest high-opportunity impact). */
export const DEFAULT_TESTING_QUEUE_LIMIT = 10;

export type BuildProductTestingQueueOptions = {
  limit?: number;
  laneAllocation?: Partial<LaneAllocation>;
  /**
   * When false (default for evidence queue), pick absolute top N by
   * evidencePriorityScore so Lane B with zero GSC cannot displace real demand.
   */
  allocateByLane?: boolean;
};

function loadGscReport(): GscOpportunityReport | null {
  const candidates = [
    path.join(process.cwd(), "data/seo/gsc-opportunities.json"),
    path.join(process.cwd(), "src/data/seo/gsc-opportunities.json"),
  ];
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    try {
      return JSON.parse(readFileSync(file, "utf8")) as GscOpportunityReport;
    } catch {
      continue;
    }
  }
  return null;
}

function extractSoftwareSlug(pagePath: string): string | null {
  const match = pagePath.match(/\/software\/([^/]+)\/?/i);
  return match?.[1]?.toLowerCase() ?? null;
}

/**
 * Five-signal evidence priority (not fabricated):
 * 1) GSC page-level opportunity
 * 2) Comparison dependency count
 * 3) Commercial importance
 * 4) Strategic category importance
 * 5) Current evidence gap
 */
function computeEvidencePriorityScore(input: {
  opportunityScore: number;
  impressions: number;
  comparisonCount: number;
  commercialValue: number;
  categoryImportance: number;
  evidenceGap: number;
  reviewImportance: number;
}): number {
  // Down-weight thin GSC rows so “opportunity” without demand cannot dominate.
  const gscDemandWeight =
    input.impressions >= 200 ? 1.5 : input.impressions >= 50 ? 1.1 : 0.45;
  const gsc =
    input.opportunityScore * gscDemandWeight +
    Math.min(55, Math.log10(input.impressions + 1) * 16);
  const comparisons = Math.min(50, input.comparisonCount * 1.15);
  const commercial = input.commercialValue + input.reviewImportance * 0.25;
  const category = input.categoryImportance * 0.35;
  const gap = input.evidenceGap;
  return Number((gsc + comparisons + commercial + category + gap).toFixed(2));
}

/**
 * Build prioritized product testing queue.
 * Production default: top 10 by evidence-priority signals (no fabricated sessions).
 */
export function buildProductTestingQueue(
  limitOrOpts: number | BuildProductTestingQueueOptions = DEFAULT_TESTING_QUEUE_LIMIT,
): {
  generatedAt: string;
  gscSource: string | null;
  laneAllocation: LaneAllocation;
  selectionMode: "evidence_priority" | "lane_mix";
  items: TestingQueueItem[];
} {
  const opts: BuildProductTestingQueueOptions =
    typeof limitOrOpts === "number" ? { limit: limitOrOpts } : limitOrOpts;
  const limit = opts.limit ?? DEFAULT_TESTING_QUEUE_LIMIT;
  const laneAllocation = {
    ...DEFAULT_LANE_ALLOCATION,
    ...opts.laneAllocation,
  };
  const allocateByLane = opts.allocateByLane === true;

  const software = getSoftware({ includeUnpublished: true });
  const comparisons = getAllComparisonsUnfiltered();
  const gsc = loadGscReport();
  const external = loadExternalEnrichmentEvidence();

  const comparisonCountBySlug = new Map<string, number>();
  for (const c of comparisons) {
    for (const slug of c.productSlugs) {
      comparisonCountBySlug.set(
        slug,
        (comparisonCountBySlug.get(slug) ?? 0) + 1,
      );
    }
  }

  const gscBySlug = new Map<
    string,
    {
      opportunityScore: number;
      impressions: number;
      clicks: number;
      position: number | null;
      hasDirectQuery: boolean;
    }
  >();
  if (gsc) {
    for (const row of gsc.allRanked ?? gsc.top100 ?? []) {
      const slug = extractSoftwareSlug(row.path);
      if (!slug) continue;
      const prev = gscBySlug.get(slug);
      if (!prev || row.opportunityScore > prev.opportunityScore) {
        gscBySlug.set(slug, {
          opportunityScore: row.opportunityScore,
          impressions: row.impressions,
          clicks: row.clicks,
          position: row.avgPosition ?? null,
          hasDirectQuery:
            row.relationshipSource === "DIRECT_GSC" ||
            row.relationshipSource === "HISTORICAL_DIRECT_GSC",
        });
      } else {
        gscBySlug.set(slug, {
          opportunityScore: prev.opportunityScore,
          impressions: Math.max(prev.impressions, row.impressions),
          clicks: Math.max(prev.clicks, row.clicks),
          position: prev.position ?? row.avgPosition ?? null,
          hasDirectQuery:
            prev.hasDirectQuery ||
            row.relationshipSource === "DIRECT_GSC" ||
            row.relationshipSource === "HISTORICAL_DIRECT_GSC",
        });
      }
    }
  }

  const scored: TestingQueueItem[] = [];

  for (const product of software) {
    if (productHasHandsOnTest(product.slug)) continue;

    const assessment = loadAssessment(product.slug);
    const review = loadReview(product.slug);
    const pricingVerifiedAt = resolvePricingVerifiedAtForEvidence(
      product,
      review?.pricingVerifiedAt,
    );
    const evidenceLevel = resolveEvidenceLevel({
      handsOnTesting: Boolean(
        review?.handsOnTesting || assessment?.handsOnTesting,
      ),
      testedAt: review?.testedAt ?? assessment?.testedAt,
      pricingVerifiedAt,
      lastVerifiedAt:
        product.lastVerifiedAt &&
        pricingVerifiedAt &&
        product.lastVerifiedAt === pricingVerifiedAt
          ? product.lastVerifiedAt
          : null,
    });

    if (evidenceLevel === "hands_on_tested") continue;

    const gscRow = gscBySlug.get(product.slug);
    const pathKey = `/software/${product.slug}/`;
    const comparisonCount = comparisonCountBySlug.get(product.slug) ?? 0;
    const commercialValue = product.affiliate?.enabled ? 25 : 8;
    const reviewImportance =
      (review?.editorialStatus === "approved" ? 20 : 8) +
      (assessment?.status === "approved" ? 10 : 0) +
      (product.seo?.indexable ? 10 : 0);

    const opportunityScore = gscRow?.opportunityScore ?? 0;
    const impressions = gscRow?.impressions ?? 0;
    const clicks = gscRow?.clicks ?? 0;
    const categoryImportance =
      CATEGORY_IMPORTANCE[product.primaryCategorySlug || ""] ?? 20;

    const evidenceGap =
      evidenceLevel === "researched"
        ? 28
        : evidenceLevel === "data_verified"
          ? 14
          : 0;

    const evidencePriorityScore = computeEvidencePriorityScore({
      opportunityScore,
      impressions,
      comparisonCount,
      commercialValue,
      categoryImportance,
      evidenceGap,
      reviewImportance,
    });

    const laneResult = classifyEnrichmentLane({
      gsc: {
        impressions,
        clicks,
        position: gscRow?.position ?? null,
        opportunityScore,
        hasDirectQuery: gscRow?.hasDirectQuery,
        knownBacklinks: external.backlinksByPath.get(pathKey) ?? 0,
        realAiCitations: external.aiCitationsByPath.get(pathKey) ?? 0,
      },
      strategic: {
        categoryImportance,
        productPopularity:
          Math.min(30, comparisonCount * 2) +
          (product.affiliate?.enabled ? 12 : 0),
        commercialRelevance: commercialValue + reviewImportance * 0.35,
        internalJourneyStrength: Math.min(22, comparisonCount * 2),
        competitorRelationship: comparisonCount >= 3,
        importantBuyerQuestion:
          Boolean(review) || Boolean(product.seo?.indexable),
      },
      qualityGap: evidenceGap,
    });

    const fields = laneReportFields(laneResult);
    const reasons: string[] = [];
    if (opportunityScore > 0) {
      reasons.push(
        `GSC page opportunity ${opportunityScore.toFixed(1)} (${impressions} impressions)`,
      );
    } else {
      reasons.push("No GSC software-page row");
    }
    reasons.push(`${comparisonCount} comparison dependencies`);
    reasons.push(
      product.affiliate?.enabled
        ? "Commercial affiliate coverage"
        : "No affiliate commercial coverage",
    );
    reasons.push(
      `Category importance ${categoryImportance} (${product.primaryCategorySlug || "uncategorized"})`,
    );
    reasons.push(`Evidence gap: ${evidenceLevel.replaceAll("_", " ")}`);

    const reason = [
      `Evidence priority ${evidencePriorityScore}`,
      ...reasons.slice(0, 3),
    ].join(" · ");

    scored.push({
      rank: 0,
      productSlug: product.slug,
      productName: product.name,
      categorySlug: product.primaryCategorySlug ?? null,
      evidenceLevel,
      opportunityScore,
      impressions,
      clicks,
      commercialValue,
      comparisonCount,
      reviewImportance,
      categoryImportance,
      evidenceGapScore: evidenceGap,
      evidencePriorityScore,
      priorityScore: fields.overallScore,
      overallScore: fields.overallScore,
      lane: fields.lane,
      gscEvidenceScore: fields.gscEvidenceScore,
      gscDemandScore: fields.gscDemandScore,
      strategicScore: fields.strategicScore,
      qualityGapScore: fields.qualityGapScore,
      commercialScore: fields.commercialScore,
      authorityScore: fields.authorityScore,
      strategicOverride: fields.strategicOverride,
      strategicOverrideReasons: fields.strategicOverrideReasons,
      reason,
      reasons,
    });
  }

  scored.sort((a, b) => {
    if (!allocateByLane) {
      const delta = b.evidencePriorityScore - a.evidencePriorityScore;
      if (delta !== 0) return delta;
    }
    return compareByLaneThenScore(a, b);
  });

  const selected = allocateByLane
    ? allocateEnrichmentBatch(scored, limit, laneAllocation)
    : scored.slice(0, limit);

  const items = selected.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  return {
    generatedAt: new Date().toISOString(),
    gscSource: gsc
      ? gsc.sourceFile || "data/seo/gsc-opportunities.json"
      : null,
    laneAllocation,
    selectionMode: allocateByLane ? "lane_mix" : "evidence_priority",
    items,
  };
}

export function formatProductTestingQueueMarkdown(
  queue: ReturnType<typeof buildProductTestingQueue>,
): string {
  const mix = queue.laneAllocation;
  const lines: string[] = [
    "# Product testing queue",
    "",
    `Generated: ${queue.generatedAt}`,
    "",
    queue.gscSource
      ? `GSC source: \`${queue.gscSource}\``
      : "GSC source: **not found** — queue uses catalogue, comparison frequency, affiliate, and evidence-level signals. Run the GSC opportunity engine to write `data/seo/gsc-opportunities.json` for SEO-weighted prioritization.",
    "",
    `Selection: **${queue.selectionMode}** · Limit: **${queue.items.length}** (top ${queue.items.length} production batch).`,
    "",
    queue.selectionMode === "lane_mix"
      ? `Batch mix (A/B/C): **${Math.round(mix.laneA * 100)}% / ${Math.round(mix.laneB * 100)}% / ${Math.round(mix.laneC * 100)}%**.`
      : "Ranked by evidence-priority composite: GSC page opportunity · comparison dependencies · commercial · category importance · evidence gap.",
    "",
    "Only products **without** a valid completed hands-on test session are listed.",
    "",
    "Hands-on claims require a **human** completed session — never auto-PASS or fabricate sessions.",
    "",
    `## TOP ${queue.items.length} PRODUCTS TO TEST`,
    "",
    "| Rank | Product | Priority | GSC opp | Comparisons | Commercial | Category | Evidence | Impressions | Why |",
    "| ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |",
  ];

  for (const item of queue.items) {
    lines.push(
      `| ${item.rank} | [${item.productName}](/software/${item.productSlug}/) (\`${item.productSlug}\`) | ${item.evidencePriorityScore} | ${item.opportunityScore} | ${item.comparisonCount} | ${item.commercialScore} | ${item.categoryImportance} | ${item.evidenceLevel.replaceAll("_", " ")} | ${item.impressions} | ${item.reason} |`,
    );
  }

  lines.push(
    "",
    "## How to use",
    "",
    "1. Open `/dev/product-testing/?secret=$TESTING_SECRET` (or `$PREVIEW_SECRET`)",
    "2. Start a session with the category protocol",
    "3. Complete the checklist as a human — tasks never auto-PASS",
    "4. Upload screenshots in the workspace; finish only when testing is real",
    "5. Dependent refresh tasks are created on complete — do not rewrite all pages blindly",
    "",
    "See `docs/editorial/PRODUCT-TESTING-SYSTEM.md`.",
    "",
  );

  return `${lines.join("\n")}\n`;
}
