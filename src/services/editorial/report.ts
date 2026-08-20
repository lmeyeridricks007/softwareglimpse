import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
} from "@/data/repositories/catalog";
import { loadAssessment, loadReview } from "@/data/editorial/store";
import { loadEnrichment, loadFacts } from "@/data/research/store";
import {
  assessSoftwareCompleteness,
  formatCompletenessReport,
} from "@/services/completeness/software-completeness";
import { describeProductGraph } from "@/services/graph/resolve-relationships";

export type EditorialReport = {
  slug: string;
  completeness: string;
  dependencyGraph: string;
  editorial: {
    assessmentStatus: string;
    reviewStatus: string;
    reviewIndexable: boolean;
    handsOnTesting: boolean;
    comparisons: string[];
    alternativesPage: string | null;
    bestPages: string[];
    factCount: number;
    hasEnrichment: boolean;
  };
};

export function buildEditorialReport(productSlug: string): EditorialReport {
  const product = getAllSoftwareUnfiltered().find((item) => item.slug === productSlug);
  if (!product) {
    throw new Error(`Unknown software slug: ${productSlug}`);
  }

  const assessment = loadAssessment(productSlug);
  const review = loadReview(productSlug);
  const comparisons = getAllComparisonsUnfiltered().filter((item) =>
    item.productSlugs.includes(productSlug),
  );
  const alternativesPage =
    getAllAlternativesUnfiltered().find((page) => page.sourceSlug === productSlug) ??
    null;
  const bestPages = getAllBestPagesUnfiltered().filter((page) =>
    page.eligibleProductSlugs.includes(productSlug),
  );

  return {
    slug: productSlug,
    completeness: formatCompletenessReport(assessSoftwareCompleteness(product)),
    dependencyGraph: describeProductGraph(productSlug),
    editorial: {
      assessmentStatus: assessment?.status ?? "missing",
      reviewStatus: review?.editorialStatus ?? "missing",
      reviewIndexable: review?.seo.indexable ?? false,
      handsOnTesting: assessment?.handsOnTesting ?? false,
      comparisons: comparisons.map((item) => item.slug),
      alternativesPage: alternativesPage?.slug ?? null,
      bestPages: bestPages.map((page) => page.slug),
      factCount: loadFacts(productSlug).length,
      hasEnrichment: Boolean(loadEnrichment(productSlug)),
    },
  };
}

export function formatEditorialReport(report: EditorialReport): string {
  const e = report.editorial;
  return [
    `Editorial report: ${report.slug}`,
    "",
    "--- Editorial ---",
    `assessment:        ${e.assessmentStatus}`,
    `review:            ${e.reviewStatus}`,
    `review indexable:  ${e.reviewIndexable}`,
    `hands-on testing:  ${e.handsOnTesting}`,
    `facts:             ${e.factCount}`,
    `enrichment:        ${e.hasEnrichment ? "yes" : "no"}`,
    `comparisons:       ${e.comparisons.join(", ") || "(none)"}`,
    `alternatives page: ${e.alternativesPage ?? "(none)"}`,
    `best pages:        ${e.bestPages.join(", ") || "(none)"}`,
    "",
    "--- Dependency graph ---",
    report.dependencyGraph,
    "",
    "--- Completeness ---",
    report.completeness,
    "",
    "Also check related shells:",
    ...getAllComparisonsUnfiltered()
      .filter((c) => c.productSlugs.includes(report.slug))
      .map(
        (c) =>
          `  compare/${c.slug}: editorial=${c.editorialStatus} research=${c.metadata.researchStatus} indexable=${c.seo.indexable}`,
      ),
  ].join("\n");
}
